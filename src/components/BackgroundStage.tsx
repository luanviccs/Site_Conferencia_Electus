import { useEffect, useRef, useState } from "react";
import { eventData } from "../data/event";
import { useMedia } from "../hooks/useMedia";

/**
 * Fundo vivo da página: vídeos de adoração atrás do degradê (o tom azul já vem nos arquivos), trocando com fusão lenta
 * conforme a seção que está no meio da tela. Não é um player: sem controles, sem som, sem foco, sem clique.
 * Um vídeo só recebe `src` quando vai tocar (cenas nunca vistas não baixam nada); com prefers-reduced-motion
 * ou economia de dados nenhum vídeo é baixado e fica a imagem estática da cena.
 */
export default function BackgroundStage() {
  const scenes = eventData.backgroundScenes;
  const wide = useMedia("(min-width: 768px)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const saveData = typeof navigator !== "undefined" && (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  const motion = !reduced && !saveData;
  const [active, setActive] = useState(0);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const activeRef = useRef(active); activeRef.current = active;
  // cenas que já tocaram mantêm o arquivo (voltar a elas não baixa de novo)
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set());
  useEffect(() => { if (motion) setLoaded((l) => (l.has(active) ? l : new Set(l).add(active))); }, [active, motion]);
  // ao trocar de orientação (versão h ↔ v), só a cena atual troca de arquivo; as outras voltam a não ter src
  const firstWide = useRef(true);
  useEffect(() => { if (firstWide.current) { firstWide.current = false; return; } setLoaded(new Set([activeRef.current])); }, [wide]);

  // Cena ativa = seção que cruza a faixa central da tela
  useEffect(() => {
    const byId = new Map<string, number>();
    scenes.forEach((s, i) => s.sections.forEach((id) => byId.set(id, i)));
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { const i = byId.get(e.target.id); if (i !== undefined) setActive(i); }
    }, { rootMargin: "-45% 0px -45% 0px" });
    byId.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [scenes]);

  // Toca só a cena ativa; as outras pausam depois da fusão. Pausa tudo com a aba oculta.
  useEffect(() => {
    const sync = () => vids.current.forEach((v, i) => {
      if (!v) return;
      v.muted = true;
      if (motion && i === active && !document.hidden) { v.preload = "auto"; v.play().catch(() => {}); return; }
      if (i !== active) v.preload = "none";
      // só pausa o que está tocando: pause() num vídeo nunca carregado faz o navegador começar a baixá-lo
      if (v.paused) return;
      if (i === active) { v.pause(); return; } // aba oculta ou movimento reduzido: pausa na hora
      window.setTimeout(() => { if (!v.paused && i !== activeRef.current) v.pause(); }, 1500); // cena anterior: depois da fusão
    });
    sync(); document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [active, motion, wide, loaded]);

  const v = wide ? "h" : "v";
  return (
    <div aria-hidden className="bg-stage">
      {scenes.map((s, i) => (
        <video key={s.name} ref={(el) => { vids.current[i] = el; }} tabIndex={-1} muted loop playsInline preload="none"
          disablePictureInPicture disableRemotePlayback
          src={motion && loaded.has(i) ? `/media/bg-${s.name}-${v}.mp4` : undefined}
          // pôster só da cena atual e vizinhas (evita baixar imagens que talvez nunca apareçam)
          poster={Math.abs(i - active) <= 1 ? `/media/bg-${s.name}-${v}.webp` : undefined}
          onCanPlay={(e) => { if (motion && i === activeRef.current && !document.hidden) e.currentTarget.play().catch(() => {}); }}
          className={`bg-stage-video ${i === active ? "is-on" : ""}`} />
      ))}
    </div>
  );
}
