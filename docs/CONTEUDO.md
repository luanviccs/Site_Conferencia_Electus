# Referência de conteúdo: `src/data/event.ts`

Todo o conteúdo do site vem deste arquivo. Os componentes só leem os dados; para mudar um texto, uma data ou uma foto,
edite aqui e confira com `npm run dev`.

[← voltar ao README](../README.md)

---

## Ingresso

| Campo | Tipo | Onde aparece |
|---|---|---|
| `TICKET_URL` | URL | Todos os botões de ingresso (topo, menu, convidados, dúvidas, ingressos, rodapé) e nos dados para o Google |
| `ticketReady` | calculado | `false` enquanto o link contiver `A_DEFINIR`: os botões levam à seção de ingressos em vez de abrir o link |

## Evento

| Campo | Exemplo | Onde aparece |
|---|---|---|
| `name`, `year` | `"Conferência Electus"`, `2026` | Título, rodapé, textos alternativos |
| `dates.doors` | `"2026-12-12T15:30:00-03:00"` | Alvo da contagem regressiva (abertura dos portões) |
| `dates.start` | `"2026-12-12T16:30:00-03:00"` | Início do evento nos dados para o Google |
| `dates.end` | `"2026-12-12T23:00:00-03:00"` | Até quando a contagem mostra "É agora." (estimativa; confirmar) |
| `day` | `{ weekday: "SÁBADO", day: "12", month: "DEZ" }` | Topo e painel "Data e local" |
| `schedule` | `[{ time: "15H30", title: "Abertura dos portões" }, …]` | Topo (portões + início) e painel "Horários" |
| `timesArePreliminary` | `false` | Se `true`, mostra o aviso "Horário preliminar" |
| `theme` | `name`, `tagline`, `slogan` | "O DESPERTAR" no topo, frase abaixo dele, frase da seção de ingressos, título da aba |

> [!WARNING]
> As datas usam o formato ISO com fuso (`-03:00`, horário de Brasília). Sem o fuso, a contagem regressiva pode errar em horas.

## Local e contato

| Campo | Onde aparece |
|---|---|
| `venue.confirmed` | Se `false`, o painel do local mostra "A confirmar" e os dados para o Google não são gerados |
| `venue.name`, `venue.address`, `venue.parking` | Painel azul "Local" |
| `venue.mapUrl` | Botão "Como chegar" (Google Maps) |
| `church` | Rodapé (nome, cidade, endereço) e topo |
| `instagram` | Link do Instagram no rodapé e na seção de dúvidas |

## Vídeos

| Campo | Onde aparece |
|---|---|
| `promoVideo.src` | Vídeo oficial em telas a partir de 768px (720p) |
| `promoVideo.srcMobile` | Vídeo oficial no celular (540p) |
| `promoVideo.poster` | Capa do vídeo antes do play |
| `promoVideo.url` | Link discreto "Assistir no Instagram" e Reel incorporado de reserva |
| `backgroundScenes` | Qual vídeo de fundo toca em cada seção (`name` → `public/media/bg-{name}-h.mp4` / `-v.mp4`) |

## Textos

| Campo | Onde aparece |
|---|---|
| `intro.lines` | Título da seção "A conferência" (uma linha por item; a última em laranja) |
| `intro.lead` | Frase de destaque abaixo do título |
| `intro.blocks` | Três blocos: Quem somos · O problema · O chamado |
| `vision.title`, `vision.text` | Seção "Por que Electus?" |
| `vision.callout` | Frase em laranja abaixo das quatro palavras |
| `verse` | Referência, as quatro palavras (também na faixa animada) e o texto bíblico (NVI) |

## Convidados (`speakers`)

| Campo | Descrição |
|---|---|
| `id` | Identificador único (sem espaços) |
| `name` | Nome no card |
| `description` | Texto oficial do card de divulgação (exibido na fonte pixel) |
| `instagram` | `handle` e `url` |
| `image`, `w`, `h` | Foto em `public/images/speakers/` e suas dimensões reais em pixels |
| `shape` | `"wide"` (foto horizontal) ou `"tall"` (retrato), muda a proporção no celular |
| `pos` | Enquadramento (`object-position`), ex.: `"50% 36%"` = centro horizontal, 36% de cima para baixo |
| `zoom` | Aproximação da foto (1 = sem zoom) |

A ordem da lista define a ordem no site: o 1º tem a foto à esquerda, o 2º à direita, e assim por diante.

> [!NOTE]
> A descrição usa a fonte pixel. Ela tem letras, números, acentos do português e a pontuação comum, incluindo parênteses.
> Um símbolo diferente aparece em outra fonte; veja [MIDIA.md](MIDIA.md#fonte-pixel) para acrescentá-lo.

## Galeria (`photos`)

| Campo | Descrição |
|---|---|
| `src` | Foto em `public/images/electus/` (precisa existir também a versão `-960.webp`) |
| `pos` | Enquadramento dentro do recorte do mosaico |
| `alt` | Descrição para leitores de tela (obrigatória) |

Posições no mosaico, pela ordem da lista: 1ª foto grande · 2ª retrato alto · 3ª, 4ª e 5ª na faixa de baixo.

## Dúvidas (`faq`)

| Campo | Descrição |
|---|---|
| `q` | Pergunta |
| `a` | Resposta (só fatos confirmados pela organização) |
| `link` | Opcional: atalho abaixo da resposta, ex.: `{ label: "Ver endereço", href: "#local" }` |
| `ticket` | Opcional: `true` mostra o botão de ingresso abaixo da resposta |

As perguntas também viram dados estruturados `FAQPage` para o Google.

## Navegação (`nav`)

Itens do menu (cabeçalho, menu do celular e rodapé). `href` aponta para o `id` de uma seção:
`#conferencia`, `#convidados`, `#electus`, `#datas`, `#local`, `#duvidas`, `#ingressos`.

## Fora do `event.ts`

| O quê | Onde |
|---|---|
| Título da aba, descrição para o Google, prévia de compartilhamento | [`index.html`](../index.html) |
| Cores e fontes | [`src/index.css`](../src/index.css) (bloco `@theme`) |
| Ordem das seções | [`src/App.tsx`](../src/App.tsx) |
