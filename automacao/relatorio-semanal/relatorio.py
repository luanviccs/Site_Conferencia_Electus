"""
Relatório semanal da Conferência Electus.

Toda segunda-feira (GitHub Actions), lê os números da semana anterior (segunda a domingo) no site e nas vendas, gera UM
slide (imagem PNG 1920×1080 + arquivo .pptx com esse slide) com indicadores, comparação com a semana anterior, gráfico
dos últimos 28 dias e a explicação dos números, e envia por e-mail.

Fontes de dados
- Acessos e cliques nos botões de ingresso: Google Analytics 4 (API oficial, conta de serviço).
- Vendas: e-mails de confirmação da Sympla que chegam na caixa do Gmail (contados via IMAP). Opcional.

Uso
    python relatorio.py                  # dados reais + envio do e-mail (configuração por variáveis de ambiente)
    python relatorio.py --demo           # dados de exemplo, sem e-mail (para ver o layout)
    python relatorio.py --sem-email      # dados reais, só gera os arquivos em saida/
    python relatorio.py --fim 2026-10-25 # semana que termina nesse dia (padrão: ontem)

Variáveis de ambiente (ver README.md desta pasta)
    GA4_PROPERTY_ID           ID numérico da propriedade GA4 (ex.: 512345678)
    GA4_CREDENTIALS_JSON      conteúdo do JSON da conta de serviço com acesso de Leitor à propriedade
    GMAIL_USER                Gmail que envia o relatório (e onde chegam os e-mails de venda)
    GMAIL_APP_PASSWORD        senha de app do Gmail (não a senha normal)
    RELATORIO_PARA            destinatário(s), separados por vírgula
    VENDAS_REMETENTE          (opcional) trecho do remetente dos e-mails de venda, ex.: sympla.com.br
    VENDAS_ASSUNTO            (opcional) trecho do assunto desses e-mails, ex.: "Nova inscrição"
"""
from __future__ import annotations

import argparse
import email
import email.header
import email.utils
import imaplib
import json
import os
import random
import smtplib
import sys
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from email.message import EmailMessage
from pathlib import Path
from zoneinfo import ZoneInfo

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyBboxPatch  # noqa: E402

TZ = ZoneInfo("America/Sao_Paulo")
EVENTO = date(2026, 12, 12)          # dia da conferência
INICIO_CAMPANHA = date(2026, 10, 1)  # início da contagem acumulada
SEMANA = 7                           # dias do período do relatório
DIAS_GRAFICO = 28                    # dias no gráfico (4 semanas)
EVENTO_CLIQUE = "clique_ingresso"    # evento enviado pelo site (src/components/TicketButton.tsx)
DIAS_SEMANA = ["segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"]

LARANJA, AZUL, BRANCO, PRETO = "#FFA800", "#18C1FF", "#FFFFFF", "#000000"
CINZA, CINZA_ESCURO = "#9A9A9A", "#1A1A1A"
AQUI = Path(__file__).resolve().parent
SAIDA = AQUI / "saida"


# ───────────────────────────── dados ─────────────────────────────

@dataclass
class Dados:
    fim: date                                   # último dia da semana do relatório
    dias: list[date]                            # últimos DIAS_GRAFICO dias (termina em `fim`)
    visitantes: list[int]                       # séries diárias (para o gráfico)
    visualizacoes: list[int]
    sessoes: list[int]
    cliques: list[int]
    vendas: list[int] | None                    # None = vendas não configuradas
    vis_semana: int = 0                         # visitantes únicos da semana e da semana anterior
    vis_anterior: int = 0
    fontes: list[tuple[str, int]] = field(default_factory=list)  # (origem, sessões) na semana
    total_visitantes: int = 0                   # acumulado desde INICIO_CAMPANHA
    total_cliques: int = 0
    total_vendas: int | None = None

    @property
    def inicio(self) -> date:
        return self.fim - timedelta(days=SEMANA - 1)

    def soma(self, serie: list[int] | None, anterior: bool = False) -> int | None:
        if serie is None:
            return None
        return sum(serie[-2 * SEMANA:-SEMANA]) if anterior else sum(serie[-SEMANA:])


def periodo(fim: date) -> list[date]:
    return [fim - timedelta(days=i) for i in range(DIAS_GRAFICO - 1, -1, -1)]


def dados_demo(fim: date) -> Dados:
    rnd = random.Random(42)
    dias = periodo(fim)
    vis = [int(80 + i * 6 + rnd.randint(-20, 30)) for i in range(len(dias))]
    cli = [max(0, int(v * rnd.uniform(.06, .11))) for v in vis]
    ven = [max(0, int(c * rnd.uniform(.25, .45))) for c in cli]
    return Dados(fim, dias, vis, [int(v * 1.7) for v in vis], [int(v * 1.2) for v in vis], cli, ven,
                 int(sum(vis[-7:]) * .82), int(sum(vis[-14:-7]) * .82),
                 [("instagram.com", 610), ("(direct)", 340), ("google", 150), ("whatsapp", 95), ("sympla.com.br", 22)],
                 sum(vis) + 900, sum(cli) + 70, sum(ven) + 25)


def dados_ga4(fim: date) -> dict:
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import (DateRange, Dimension, Filter, FilterExpression, Metric,
                                                    OrderBy, RunReportRequest)
    from google.oauth2 import service_account

    info = json.loads(os.environ["GA4_CREDENTIALS_JSON"])
    cred = service_account.Credentials.from_service_account_info(
        info, scopes=["https://www.googleapis.com/auth/analytics.readonly"])
    client = BetaAnalyticsDataClient(credentials=cred)
    prop = f"properties/{os.environ['GA4_PROPERTY_ID'].strip()}"
    dias = periodo(fim)
    faixa = DateRange(start_date=dias[0].isoformat(), end_date=fim.isoformat())
    inicio = fim - timedelta(days=SEMANA - 1)
    semana = DateRange(start_date=inicio.isoformat(), end_date=fim.isoformat())
    anterior = DateRange(start_date=(inicio - timedelta(days=SEMANA)).isoformat(), end_date=(inicio - timedelta(days=1)).isoformat())
    acum = DateRange(start_date=INICIO_CAMPANHA.isoformat(), end_date=fim.isoformat())
    so_cliques = FilterExpression(filter=Filter(field_name="eventName",
                                                string_filter=Filter.StringFilter(value=EVENTO_CLIQUE)))

    def por_dia(rows, idx):
        out = {d: 0 for d in dias}
        for r in rows:
            d = datetime.strptime(r.dimension_values[0].value, "%Y%m%d").date()
            if d in out:
                out[d] = int(float(r.metric_values[idx].value))
        return [out[d] for d in dias]

    def total(faixa_, metrica, filtro=None):
        r = client.run_report(RunReportRequest(property=prop, date_ranges=[faixa_], metrics=[Metric(name=metrica)],
                                               dimension_filter=filtro))
        return int(float(r.rows[0].metric_values[0].value)) if r.rows else 0

    base = client.run_report(RunReportRequest(
        property=prop, date_ranges=[faixa], dimensions=[Dimension(name="date")],
        metrics=[Metric(name="activeUsers"), Metric(name="screenPageViews"), Metric(name="sessions")]))
    cliq = client.run_report(RunReportRequest(
        property=prop, date_ranges=[faixa], dimensions=[Dimension(name="date")],
        metrics=[Metric(name="eventCount")], dimension_filter=so_cliques))
    fontes = client.run_report(RunReportRequest(
        property=prop, date_ranges=[semana], dimensions=[Dimension(name="sessionSource")], metrics=[Metric(name="sessions")],
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)], limit=5))
    return {
        "visitantes": por_dia(base.rows, 0), "visualizacoes": por_dia(base.rows, 1),
        "sessoes": por_dia(base.rows, 2), "cliques": por_dia(cliq.rows, 0),
        # visitantes únicos da semana (somar os dias contaria a mesma pessoa várias vezes)
        "vis_semana": total(semana, "totalUsers"), "vis_anterior": total(anterior, "totalUsers"),
        "fontes": [(r.dimension_values[0].value, int(r.metric_values[0].value)) for r in fontes.rows],
        "total_visitantes": total(acum, "totalUsers"), "total_cliques": total(acum, "eventCount", so_cliques),
    }


def vendas_gmail(fim: date) -> tuple[list[int], int] | None:
    """Conta os e-mails de confirmação de compra (Sympla) por dia. None se não estiver configurado."""
    remetente = os.environ.get("VENDAS_REMETENTE", "").strip()
    assunto = os.environ.get("VENDAS_ASSUNTO", "").strip()
    if not remetente and not assunto:
        return None
    dias = periodo(fim)
    # O IMAP busca só por data e remetente (texto simples); o filtro de assunto, que pode ter acentos, é feito aqui.
    criterios = ["SINCE", INICIO_CAMPANHA.strftime("%d-%b-%Y")]
    if remetente:
        criterios += ["FROM", f'"{remetente}"']
    conta = {d: 0 for d in dias}
    total = 0
    with imaplib.IMAP4_SSL("imap.gmail.com") as imap:
        imap.login(os.environ["GMAIL_USER"], os.environ["GMAIL_APP_PASSWORD"])
        imap.select("INBOX", readonly=True)
        typ, ids = imap.search(None, *criterios)
        for num in (ids[0].split() if typ == "OK" and ids and ids[0] else []):
            typ, hdr = imap.fetch(num, "(BODY.PEEK[HEADER.FIELDS (DATE SUBJECT)])")
            if typ != "OK" or not hdr or not hdr[0]:
                continue
            cab = email.message_from_bytes(hdr[0][1])
            titulo = str(email.header.make_header(email.header.decode_header(cab.get("Subject", ""))))
            if assunto and assunto.lower() not in titulo.lower():
                continue
            quando = email.utils.parsedate_to_datetime(cab["Date"]) if cab.get("Date") else None
            if not quando:
                continue
            d = quando.astimezone(TZ).date()
            if d <= fim:
                total += 1
            if d in conta:
                conta[d] += 1
    return [conta[d] for d in dias], total


def coletar(fim: date) -> Dados:
    g = dados_ga4(fim)
    v = vendas_gmail(fim)
    return Dados(fim, periodo(fim), g["visitantes"], g["visualizacoes"], g["sessoes"], g["cliques"],
                 v[0] if v else None, g["vis_semana"], g["vis_anterior"], g["fontes"],
                 g["total_visitantes"], g["total_cliques"], v[1] if v else None)


# ───────────────────────────── análise em texto ─────────────────────────────

def pct(a: float | None, b: float | None) -> str:
    return f"{(a / b * 100):.1f}%".replace(".", ",") if a is not None and b else "–"


def variacao(atual: int, anterior: int) -> str:
    if anterior == 0:
        return "primeira semana" if atual else "="
    v = (atual - anterior) / anterior * 100
    return f"{'+' if v >= 0 else ''}{v:.0f}%"


def faixa_txt(d: Dados) -> str:
    return f"{d.inicio.strftime('%d/%m')} a {d.fim.strftime('%d/%m/%Y')}"


def explicacao(d: Dados) -> list[str]:
    vis, cli = d.vis_semana, d.soma(d.cliques)
    if not any(d.visitantes) and not any(d.cliques):
        return ["Ainda sem dados processados: o Google Analytics leva de 24 a 48 horas para liberar os números "
                "de uma propriedade nova. Os próximos relatórios já virão preenchidos."]
    txt = [f"{vis} pessoas visitaram o site na semana ({variacao(vis, d.vis_anterior)} em relação à semana anterior)."]
    txt.append(f"{cli} cliques nos botões de ingresso ({variacao(cli, d.soma(d.cliques, True))}): "
               f"{pct(cli, vis)} dos visitantes demonstraram intenção de compra.")
    if d.vendas is not None:
        ven = d.soma(d.vendas)
        txt.append(f"{ven} vendas confirmadas na Sympla: {pct(ven, cli)} de quem clicou concluiu a compra "
                   f"({pct(ven, vis)} dos visitantes).")
    ultimos = d.visitantes[-SEMANA:]
    melhor = max(range(SEMANA), key=lambda i: ultimos[i])
    dia_melhor = d.dias[-SEMANA + melhor]
    txt.append(f"Melhor dia: {DIAS_SEMANA[dia_melhor.weekday()]} ({dia_melhor.strftime('%d/%m')}), "
               f"com {ultimos[melhor]} visitantes.")
    if d.fontes:
        f, s = d.fontes[0]
        nome = {"(direct)": "acesso direto", "(not set)": "origem não identificada"}.get(f, f)
        txt.append(f"Principal origem da semana: {nome} ({s} sessões).")
    return txt


# ───────────────────────────── slide ─────────────────────────────

def card(fig, x, y, w, h, titulo, valor, sub, cor):
    ax = fig.add_axes([x, y, w, h]); ax.axis("off")
    ax.add_patch(FancyBboxPatch((0, 0), 1, 1, boxstyle="round,pad=0,rounding_size=0.06", transform=ax.transAxes,
                                facecolor=CINZA_ESCURO, edgecolor="#2E2E2E", linewidth=1.5))
    ax.add_patch(FancyBboxPatch((0, .93), 1, .07, boxstyle="square,pad=0", transform=ax.transAxes, facecolor=cor, edgecolor="none"))
    ax.text(.08, .72, titulo.upper(), color=CINZA, fontsize=15, fontweight="bold", transform=ax.transAxes)
    ax.text(.08, .30, valor, color=BRANCO, fontsize=46, fontweight="bold", transform=ax.transAxes)
    ax.text(.08, .10, sub, color=cor, fontsize=14, fontweight="bold", transform=ax.transAxes)


def gerar_slide(d: Dados, destino: Path) -> Path:
    plt.rcParams.update({"font.family": "DejaVu Sans", "text.color": BRANCO})
    fig = plt.figure(figsize=(19.2, 10.8), dpi=100, facecolor=PRETO)

    faltam = (EVENTO - d.fim).days - 1
    fig.text(.04, .925, "CONFERÊNCIA ELECTUS  ·  O DESPERTAR", color=LARANJA, fontsize=17, fontweight="bold")
    fig.text(.04, .86, f"Relatório semanal · {faixa_txt(d)}", color=BRANCO, fontsize=38, fontweight="bold")
    fig.text(.96, .885, f"{max(faltam, 0)}", color=AZUL, fontsize=58, fontweight="bold", ha="right")
    fig.text(.96, .855, "dias para o evento", color=CINZA, fontsize=15, ha="right")

    cli, cli_ant = d.soma(d.cliques), d.soma(d.cliques, True)
    pv, ses = d.soma(d.visualizacoes), d.soma(d.sessoes)
    ven, ven_ant = d.soma(d.vendas), d.soma(d.vendas, True)
    cards = [
        ("Visitantes na semana", f"{d.vis_semana}", f"{variacao(d.vis_semana, d.vis_anterior)} vs. semana anterior", AZUL),
        ("Visualizações", f"{pv}", f"{ses} sessões", AZUL),
        ("Cliques em ingresso", f"{cli}", f"{pct(cli, d.vis_semana)} dos visitantes · {variacao(cli, cli_ant)}", LARANJA),
        ("Vendas (Sympla)", f"{ven}" if ven is not None else "–",
         f"{pct(ven, cli)} dos cliques · {variacao(ven, ven_ant)}" if ven is not None else "não configurado", LARANJA),
    ]
    for k, c in enumerate(cards):
        card(fig, .04 + k * .2325, .60, .215, .21, *c)

    # gráfico: últimos 28 dias, com a semana do relatório destacada
    ax = fig.add_axes([.06, .10, .53, .40], facecolor=PRETO)
    rot = [x.strftime("%d/%m") for x in d.dias]
    ax.axvspan(len(rot) - SEMANA - .5, len(rot) - .5, color=AZUL, alpha=.08, zorder=0)
    l1 = ax.plot(rot, d.visitantes, color=AZUL, linewidth=3, marker="o", markersize=4, label="Visitantes (eixo esq.)")
    ax2 = ax.twinx()
    extra = []
    if d.vendas is not None:
        extra.append(ax2.bar(rot, d.vendas, color=BRANCO, alpha=.8, width=.5, label="Vendas (eixo dir.)", zorder=2))
    l2 = ax2.plot(rot, d.cliques, color=LARANJA, linewidth=3, marker="o", markersize=4,
                  label="Cliques em ingresso (eixo dir.)", zorder=3)
    ax.set_title(f"Últimos {DIAS_GRAFICO} dias  ·  semana do relatório em destaque", color=BRANCO, fontsize=18,
                 fontweight="bold", loc="left", pad=14)
    for a_ in (ax, ax2):
        a_.spines["top"].set_visible(False)
        for s_ in ("left", "right", "bottom"):
            a_.spines[s_].set_color("#333333")
        a_.set_ylim(bottom=0)
    ax.tick_params(colors=AZUL, labelsize=12)
    ax.tick_params(axis="x", colors=CINZA, labelsize=11)
    ax.set_xticks(range(0, len(rot), 3), [rot[i] for i in range(0, len(rot), 3)])
    ax2.tick_params(colors=LARANJA, labelsize=12)
    ax2.set_ylim(top=max(max(d.cliques), max(d.vendas or [0]), 1) * 1.35)
    ax.set_ylim(top=max(max(d.visitantes), 1) * 1.35)
    ax.grid(axis="y", color="#262626", linewidth=1)
    alcas = l1 + l2 + extra
    ax.legend(alcas, [h.get_label() for h in alcas], loc="upper left", frameon=False, labelcolor=BRANCO, fontsize=12, ncol=3)

    # análise
    fig.text(.64, .475, "O QUE OS NÚMEROS DIZEM", color=LARANJA, fontsize=17, fontweight="bold")
    y = .435
    for linha in explicacao(d):
        partes, atual = [], ""
        for palavra in linha.split():
            if len(atual) + len(palavra) > 56:
                partes.append(atual); atual = palavra
            else:
                atual = f"{atual} {palavra}".strip()
        partes.append(atual)
        fig.text(.64, y, "•", color=AZUL, fontsize=15, fontweight="bold")
        for p in partes:
            fig.text(.655, y, p, color=BRANCO, fontsize=14)
            y -= .029
        y -= .01
    total_v = "–" if d.total_vendas is None else f"{d.total_vendas}"
    fig.text(.64, .075, f"Desde {INICIO_CAMPANHA.strftime('%d/%m')}:  {d.total_visitantes} visitantes  ·  "
                        f"{d.total_cliques} cliques  ·  {total_v} vendas", color=CINZA, fontsize=14, fontweight="bold")
    fig.text(.04, .03, "Fontes: Google Analytics 4 (visitas e cliques; só quem aceitou cookies) · e-mails de confirmação da Sympla (vendas)",
             color="#6E6E6E", fontsize=11)

    destino.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(destino, facecolor=PRETO, dpi=100)
    plt.close(fig)
    return destino


def gerar_pptx(png: Path, d: Dados, destino: Path) -> Path:
    from pptx import Presentation
    from pptx.util import Emu

    prs = Presentation()
    prs.slide_width, prs.slide_height = Emu(12192000), Emu(6858000)  # 16:9
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    slide.shapes.add_picture(str(png), 0, 0, width=prs.slide_width, height=prs.slide_height)
    slide.notes_slide.notes_text_frame.text = "\n".join(explicacao(d))
    prs.save(destino)
    return destino


# ───────────────────────────── e-mail ─────────────────────────────

def enviar(d: Dados, png: Path, pptx: Path) -> None:
    para = [x.strip() for x in os.environ["RELATORIO_PARA"].split(",") if x.strip()]
    msg = EmailMessage()
    msg["Subject"] = f"Conferência Electus · relatório semanal ({faixa_txt(d)})"
    msg["From"] = os.environ["GMAIL_USER"]
    msg["To"] = ", ".join(para)
    linhas = explicacao(d)
    msg.set_content("Relatório semanal da Conferência Electus\n\n" + "\n".join(f"- {l}" for l in linhas)
                    + "\n\nO slide completo está em anexo (PNG e PowerPoint).")
    itens = "".join(f"<li style='margin:6px 0'>{l}</li>" for l in linhas)
    msg.add_alternative(
        f"""<div style="font-family:Arial,sans-serif;background:#000;color:#fff;padding:24px">
        <p style="color:#FFA800;font-weight:bold;letter-spacing:2px;margin:0">CONFERÊNCIA ELECTUS · O DESPERTAR</p>
        <h1 style="margin:8px 0 16px">Relatório semanal · {faixa_txt(d)}</h1>
        <img src="cid:slide" alt="Slide do relatório" style="width:100%;max-width:960px;border-radius:8px">
        <ul style="font-size:15px;line-height:1.5">{itens}</ul>
        <p style="color:#9A9A9A;font-size:12px">Anexos: slide em PNG e PowerPoint.</p></div>""", subtype="html")
    dados_png = png.read_bytes()
    msg.get_payload()[1].add_related(dados_png, "image", "png", cid="<slide>")
    msg.add_attachment(dados_png, maintype="image", subtype="png", filename=png.name)
    msg.add_attachment(pptx.read_bytes(), maintype="application",
                       subtype="vnd.openxmlformats-officedocument.presentationml.presentation", filename=pptx.name)
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as s:
        s.login(os.environ["GMAIL_USER"], os.environ["GMAIL_APP_PASSWORD"])
        s.send_message(msg)


# ───────────────────────────── principal ─────────────────────────────

FALTANDO = ["GA4_PROPERTY_ID", "GA4_CREDENTIALS_JSON", "GMAIL_USER", "GMAIL_APP_PASSWORD", "RELATORIO_PARA"]


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[1])
    ap.add_argument("--demo", action="store_true", help="dados de exemplo, sem e-mail")
    ap.add_argument("--sem-email", action="store_true", help="só gera os arquivos em saida/")
    ap.add_argument("--fim", help="último dia da semana do relatório (AAAA-MM-DD); padrão: ontem")
    a = ap.parse_args()
    fim = date.fromisoformat(a.fim) if a.fim else datetime.now(TZ).date() - timedelta(days=1)

    if a.demo:
        d = dados_demo(fim)
    else:
        falta = [k for k in FALTANDO if not os.environ.get(k)]
        if a.sem_email:
            falta = [k for k in falta if k in ("GA4_PROPERTY_ID", "GA4_CREDENTIALS_JSON")]
        if falta:
            print(f"Relatório não configurado ainda (faltam: {', '.join(falta)}). Veja automacao/relatorio-semanal/README.md.")
            return 0
        d = coletar(fim)

    nome = f"relatorio-semanal-electus-{d.inicio.isoformat()}_a_{fim.isoformat()}"
    png = gerar_slide(d, SAIDA / f"{nome}.png")
    pptx = gerar_pptx(png, d, SAIDA / f"{nome}.pptx")
    print(f"Slide gerado: {png}\nPowerPoint: {pptx}")
    if not (a.demo or a.sem_email):
        enviar(d, png, pptx)
        print("E-mail enviado.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
