import type { CSSProperties } from "react";
import { eventData } from "../data/event";
import Reveal from "./Reveal";
import Sparkle from "./Sparkle";
import TicketButton from "./TicketButton";
const IG = <svg aria-hidden viewBox="0 0 24 24" className="h-[1.1em] w-[1.1em] flex-none" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
/**
 * Título e texto centralizados no topo; abaixo, um convidado por linha (foto, nome, descrição e o Instagram oficial, discreto
 * para não competir com o botão de ingressos). A partir de 768px, foto e texto lado a lado alternando os lados:
 * 1º foto à esquerda e texto alinhado à direita; 2º texto à esquerda (alinhado à esquerda) e foto à direita.
 */
export default function Speakers() {
  return (
    <section id="convidados" className="section">
      <div className="wrap grid gap-12">
        <Reveal className="relative mx-auto w-full max-w-3xl text-center">
          <Sparkle className="pointer-events-none absolute right-0 top-0 w-6 text-orange md:w-7" />
          <p className="eyebrow eyebrow-center">Convidados</p>
          <h2 className="h-section mt-6">Quem vem com a gente</h2>
          <p className="lede mx-auto mt-6 max-w-[32ch]">Os convidados confirmados da Conferência Electus {eventData.year}.</p>
          <TicketButton className="btn-primary mt-9 hidden lg:inline-flex" />
        </Reveal>
        {/* um convidado por linha, alternando os lados: foto à esquerda e texto alinhado à direita, depois o inverso.
            No celular: foto em cima e texto centralizado embaixo. */}
        <ul className="mx-auto grid w-full max-w-6xl gap-y-16 md:gap-y-24">
          {eventData.speakers.map((s, k) => {
            const flip = k % 2 === 1; // 2º convidado: foto à direita, texto à esquerda
            return (
              <li key={s.id}>
                <Reveal delay={k * 140}>
                  <article className="speaker grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
                    <div className={`relative mx-auto w-full overflow-hidden bg-deep md:aspect-auto md:h-[clamp(20rem,32vw,28rem)] ${s.shape === "wide" ? "aspect-[3/2]" : "aspect-[4/5] max-w-[26rem] md:max-w-none"} ${flip ? "md:order-last" : ""}`}>
                      <img src={s.image} alt={s.name} loading="lazy" decoding="async" width={s.w} height={s.h}
                        className="speaker-img h-full w-full object-cover" style={{ objectPosition: s.pos, "--z": s.zoom } as CSSProperties} />
                      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                      <div aria-hidden className="absolute inset-0 ring-1 ring-inset ring-paper/10" />
                    </div>
                    <div className={`border-t border-paper/25 pt-4 text-center ${flip ? "md:text-left" : "md:text-right"}`}>
                      <h3 className="font-display text-[clamp(2.25rem,1.7rem+1.8vw,3.25rem)] uppercase leading-[.9]">{s.name}</h3>
                      {/* texto oficial dos cards de divulgação, fonte pixel em tamanho de leitura confortável */}
                      <p className="mt-4 text-pretty font-pixel text-[1.125rem] leading-[1.6] text-paper/90 hyphens-auto sm:text-[1.25rem] md:text-[1.125rem] lg:text-[1.25rem] xl:text-[1.375rem]">{s.description}</p>
                      {s.instagram.url && (
                        <a href={s.instagram.url} target="_blank" rel="noopener noreferrer" aria-label={`Instagram de ${s.name}, ${s.instagram.handle} (abre em nova aba)`}
                          className="group mt-3 inline-flex min-h-11 items-center gap-2 text-[.9375rem] font-medium text-paper/65 transition-colors hover:text-orange focus-visible:text-orange">
                          {IG}<span className="link-line">{s.instagram.handle}</span>
                          <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                        </a>
                      )}
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
        <TicketButton className="btn-primary justify-self-center lg:hidden" />
      </div>
    </section>
  );
}
