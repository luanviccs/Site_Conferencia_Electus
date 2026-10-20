import { eventData } from "../data/event";
import Reveal from "./Reveal";
export default function ConferenceIntro() {
  const { lines, lead, blocks } = eventData.intro;
  return (
    <section id="conferencia" className="section">
      <div className="wrap">
        <p className="eyebrow">A conferência</p>
        <Reveal>
          <h2 className="h-section mt-6">
            {lines.map((l, i) => <span key={l} className={`block ${i === lines.length - 1 ? "text-orange" : ""}`}>{l}{" "}</span>)}
          </h2>
        </Reveal>
        {/* Só texto: o vídeo de fundo (drone na Renovo) faz o papel de imagem; as fotos estão em "Por que Electus?" */}
        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:gap-x-10 lg:gap-x-16">
          <Reveal className="md:col-span-6" delay={60}>
            <p className="max-w-[24ch] text-[clamp(1.375rem,1.1rem+.9vw,1.875rem)] font-semibold leading-snug text-paper text-pretty">{lead}</p>
          </Reveal>
          <Reveal className="md:col-span-5 md:col-start-8" delay={120}>
            <dl className="grid gap-8">
              {blocks.map((b) => (
                <div key={b.label} className="border-t border-paper/20 pt-4">
                  <dt className="label text-orange">{b.label}</dt>
                  <dd className="lede mt-2 max-w-[40ch]">{b.text}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
