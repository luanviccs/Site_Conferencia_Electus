import type { CSSProperties } from "react";
import { eventData } from "../data/event";
import Reveal from "./Reveal";
import Sparkle from "./Sparkle";
import TicketButton from "./TicketButton";
const IG = <svg aria-hidden viewBox="0 0 24 24" className="h-[1.1em] w-[1.1em] flex-none" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
/**
 * Título e texto centralizados no topo; abaixo, as duas atrações lado a lado: foto, nome, descrição curta e o Instagram oficial (discreto,
 * para não competir com o botão de ingressos). Foto horizontal (banda completa) ganha coluna mais larga; a partir de 640px
 * as duas fotos têm a mesma altura. A foto do Pr. Dênio é vertical (retrato), por isso a coluna dele é a estreita.
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
        <ul className="mx-auto grid w-full max-w-5xl items-start gap-x-8 gap-y-14 sm:grid-cols-[1.55fr_1fr]">
          {eventData.speakers.map((s, k) => (
            <li key={s.id}>
              <Reveal delay={k * 140}>
                <article className={`speaker ${s.shape === "tall" ? "mx-auto max-w-[26rem] sm:max-w-none" : ""}`}>
                  <div className={`relative overflow-hidden bg-deep sm:aspect-auto sm:h-[clamp(18rem,26vw,22rem)] ${s.shape === "wide" ? "aspect-[3/2]" : "aspect-[4/5]"}`}>
                    <img src={s.image} alt={s.name} loading="lazy" decoding="async" width={s.w} height={s.h}
                      className="speaker-img h-full w-full object-cover" style={{ objectPosition: s.pos, "--z": s.zoom } as CSSProperties} />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                    <div aria-hidden className="absolute inset-0 ring-1 ring-inset ring-paper/10" />
                  </div>
                  <div className="mt-5 border-t border-paper/25 pt-4 text-center">
                    <h3 className="font-display text-[clamp(2.25rem,1.7rem+1.8vw,3.25rem)] uppercase leading-[.9]">{s.name}</h3>
                    <p className="mx-auto mt-2 max-w-[30ch] text-[1.0625rem] leading-relaxed text-paper/75">{s.description}</p>
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
          ))}
        </ul>
        <TicketButton className="btn-primary justify-self-center lg:hidden" />
      </div>
    </section>
  );
}
