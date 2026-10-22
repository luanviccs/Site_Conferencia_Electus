import { eventData } from "../data/event";
import Reveal from "./Reveal";
import Sparkle from "./Sparkle";
export default function ConferenceIntro() {
  const { lines, lead, leadClose, blocks } = eventData.intro;
  return (
    <section id="conferencia" className="section">
      <div className="wrap text-center">
        <p className="eyebrow eyebrow-center">A conferência</p>
        <Reveal className="relative">
          {/* brilho no espaço livre à direita do título (só a partir do tablet; no celular o título ocupa a largura) */}
          <Sparkle className="pointer-events-none absolute right-[8%] top-2 hidden w-9 text-sky md:block lg:w-11" />
          <h2 className="h-section mt-6">
            {lines.map((l, i) => <span key={l} className={`block ${i === lines.length - 1 ? "text-orange" : ""}`}>{l}{" "}</span>)}
          </h2>
        </Reveal>
        {/* Só texto, centralizado: o vídeo de fundo (drone na Renovo) faz o papel de imagem; as fotos estão em "Por que Electus?" */}
        <div className="mt-12 md:mt-16">
          <Reveal delay={60}>
            <p className="mx-auto max-w-[34ch] text-[clamp(1.375rem,1.1rem+.9vw,1.875rem)] font-semibold leading-snug text-paper text-balance">{lead}</p>
            <p className="mx-auto mt-5 max-w-[34ch] text-[clamp(1.25rem,1.05rem+.7vw,1.625rem)] font-semibold leading-snug text-orange text-balance">{leadClose}</p>
          </Reveal>
          <Reveal className="mt-12 md:mt-16" delay={120}>
            <dl className="grid gap-8 md:grid-cols-3 md:gap-x-10 lg:gap-x-14">
              {blocks.map((b) => (
                <div key={b.label} className="border-t border-paper/20 pt-4">
                  <dt className="label text-orange">{b.label}</dt>
                  <dd className="lede mx-auto mt-2 max-w-[40ch]">{b.text}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
