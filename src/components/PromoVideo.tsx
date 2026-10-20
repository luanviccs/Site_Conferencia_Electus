import { useEffect, useRef, useState } from "react";
import { eventData } from "../data/event";
import { useMedia } from "../hooks/useMedia";

declare global { interface Window { instgrm?: { Embeds: { process: () => void } } } }
const IG_SCRIPT = "https://www.instagram.com/embed.js";

/**
 * Vídeo oficial da conferência, em destaque logo abaixo do logo, tocando no próprio site (player próprio, 16:9;
 * 720p a partir de 768px, 540p no celular).
 * - Prévia: toca sem som e em loop enquanto está visível; pausa fora da tela. Com movimento reduzido ou economia de dados,
 *   fica só o pôster até a pessoa tocar em play.
 * - Primeiro toque: recomeça do início com som. Depois: play/pausa, som e tela cheia; barra de progresso fina.
 * - Moldura com as órbitas laranja do logo e brilho azul. Abaixo, só um link discreto para o Reel no Instagram.
 * - Se o arquivo do vídeo ainda não estiver em public/media/, mostra o Reel incorporado do Instagram no mesmo lugar.
 */
export default function PromoVideo({ className = "" }: { className?: string }) {
  const { promoVideo, year } = eventData;
  const v = useRef<HTMLVideoElement>(null);
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const wide = useMedia("(min-width: 768px)");
  const saveData = typeof navigator !== "undefined" && (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  const preview = !reduced && !saveData;
  const [missing, setMissing] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false); // a pessoa já deu play com som
  const [progress, setProgress] = useState(0);
  const startedRef = useRef(started); startedRef.current = started;

  // Prévia sem som enquanto visível; fora da tela, pausa (inclusive se estiver com som).
  // Aba em segundo plano: o navegador bloqueia o play; ao voltar para a aba, a prévia recomeça se o vídeo estiver na tela.
  useEffect(() => {
    const el = v.current; if (!el || missing) return;
    let inView = false;
    const tryPreview = () => { if (preview && inView && !startedRef.current && !document.hidden) { el.muted = true; el.play().catch(() => {}); } };
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting && e.intersectionRatio >= 0.5;
      if (inView) tryPreview(); else if (!el.paused) el.pause();
    }, { threshold: [0, 0.5] });
    io.observe(el); document.addEventListener("visibilitychange", tryPreview);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", tryPreview); };
  }, [preview, missing]);

  // Sem o arquivo: carrega o embed oficial do Instagram (uma vez).
  useEffect(() => {
    if (!missing) return;
    if (window.instgrm) { window.instgrm.Embeds.process(); return; }
    if (document.querySelector(`script[src="${IG_SCRIPT}"]`)) return;
    const s = document.createElement("script"); s.src = IG_SCRIPT; s.async = true; document.body.append(s);
  }, [missing]);

  const watch = () => { // tocar no vídeo
    const el = v.current; if (!el) return;
    if (!startedRef.current) { setStarted(true); el.currentTime = 0; el.muted = false; setMuted(false); el.play().catch(() => {}); return; }
    if (el.paused) el.play().catch(() => {}); else el.pause();
  };
  const toggleSound = () => { const el = v.current; if (!el) return; el.muted = !el.muted; setMuted(el.muted); if (!el.muted) setStarted(true); };
  const fullscreen = () => {
    const el = v.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null; if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {}); else el.webkitEnterFullscreen?.(); // iOS
  };

  const igLink = (
    <a href={promoVideo.url} target="_blank" rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-1.5 font-cond text-sm font-bold uppercase tracking-[.18em] text-paper/55 transition-colors hover:text-paper">
      <span className="link-line">Assistir no Instagram</span><span aria-hidden>↗</span><span className="sr-only"> (abre em nova aba)</span>
    </a>
  );

  if (missing) return (
    <figure className={`promo-video mx-auto w-full max-w-[24rem] ${className}`}>
      <blockquote className="instagram-media" data-instgrm-permalink={promoVideo.url} data-instgrm-version="14">
        <a href={promoVideo.url} target="_blank" rel="noopener noreferrer">Assista ao vídeo oficial da Conferência Electus {year} no Instagram</a>
      </blockquote>
      <figcaption className="mt-2">{igLink}</figcaption>
    </figure>
  );

  const btn = "grid h-11 w-11 place-items-center rounded-full bg-ink/55 text-paper ring-1 ring-paper/20 backdrop-blur-sm transition-colors hover:bg-ink/75";
  return (
    <figure className={`relative mx-auto w-full max-w-[56rem] ${className}`}>
      <div className="relative">
      {/* órbitas do logo em volta do vídeo (decorativas) */}
      <svg aria-hidden viewBox="0 0 400 225" className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[124%] -translate-x-1/2 -translate-y-1/2 overflow-visible text-orange">
        <ellipse cx="200" cy="112.5" rx="198" ry="70" fill="none" stroke="currentColor" strokeWidth="1" opacity=".7" transform="rotate(-11 200 112.5)" />
        <ellipse cx="200" cy="112.5" rx="192" ry="62" fill="none" stroke="currentColor" strokeWidth="1" opacity=".5" transform="rotate(13 200 112.5)" />
      </svg>

      <div className="group relative aspect-video overflow-hidden rounded-2xl bg-ink shadow-[0_40px_120px_-40px_rgb(24_193_255_/_.55)] ring-1 ring-paper/15">
        <video ref={v} src={wide ? promoVideo.src : promoVideo.srcMobile} poster={promoVideo.poster} muted loop playsInline preload="metadata"
          aria-label={`Vídeo oficial da Conferência Electus ${year}`}
          onError={() => setMissing(true)}
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => { const t = e.currentTarget; setProgress(t.duration ? t.currentTime / t.duration : 0); }}
          onClick={watch} className="h-full w-full cursor-pointer object-cover" />

        {/* convite central: "assistir com som" (prévia) ou play (pausado) */}
        {(!started || !playing) && (
          <button type="button" onClick={watch}
            className="absolute inset-0 grid place-items-center bg-gradient-to-t from-ink/70 via-ink/10 to-ink/25 text-paper">
            <span className="flex flex-col items-center gap-3">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-orange text-ink shadow-[0_14px_40px_-10px_rgb(255_168_0_/_.7)] transition-transform duration-300 group-hover:scale-105">
                <svg aria-hidden viewBox="0 0 24 24" className="ml-1 h-8 w-8" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" /></svg>
              </span>
              <span className="font-cond text-base font-extrabold uppercase tracking-[.18em]">{started ? "Continuar" : "Assistir com som"}</span>
            </span>
          </button>
        )}

        {/* controles (depois do primeiro play com som) */}
        {started && (
          <div className="absolute inset-x-3 bottom-4 flex items-center justify-between opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100">
            <button type="button" className={btn} onClick={watch} aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}>
              {playing
                ? <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                : <svg aria-hidden viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" /></svg>}
            </button>
            <div className="flex gap-2">
              <button type="button" className={btn} onClick={toggleSound} aria-label={muted ? "Ativar som" : "Desativar som"}>
                <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" />
                  {muted ? <><path d="m16 9 5 6" /><path d="m21 9-5 6" /></> : <><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></>}
                </svg>
              </button>
              <button type="button" className={btn} onClick={fullscreen} aria-label="Tela cheia">
                <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
              </button>
            </div>
          </div>
        )}

        {/* progresso */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-paper/15">
          <div className="h-full bg-sky" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
      </div>

      <figcaption className="mt-4">{igLink}</figcaption>
    </figure>
  );
}
