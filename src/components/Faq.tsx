import { useId, useState } from "react";
import { eventData } from "../data/event";
import Reveal from "./Reveal";
import TicketButton from "./TicketButton";
/**
 * Acordeão acessível: botão com aria-expanded/aria-controls, painel com role="region".
 * Painel fechado fica "inert" (links internos não recebem foco). Altura animada via CSS (grid 0fr → 1fr).
 */
export default function Faq() {
  const { faq, instagram } = eventData;
  const [open, setOpen] = useState<number | null>(null);
  const uid = useId();
  return (
    <section id="duvidas" className="section">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-x-16">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">Dúvidas</p>
          <h2 className="h-section mt-6 lg:text-[min(5.6vw,5.75rem)]">Dúvidas frequentes</h2>
          <p className="lede mt-6 max-w-[30ch]">
            Ficou alguma pergunta? Fale com o Electus no Instagram,{" "}
            <a href={instagram.url} target="_blank" rel="noopener noreferrer" className="link-line text-paper hover:text-orange">{instagram.handle}<span className="sr-only"> (abre em nova aba)</span></a>.
          </p>
        </Reveal>
        <Reveal className="lg:col-span-7">
          <ul className="border-b border-paper/15">
            {faq.map((f, i) => {
              const isOpen = open === i;
              const bid = `${uid}-q${i}`, pid = `${uid}-a${i}`;
              return (
                <li key={f.q} data-open={isOpen} className="faq-item border-t border-paper/15 transition-colors duration-300 data-[open=true]:border-orange/70">
                  <h3>
                    <button id={bid} type="button" aria-expanded={isOpen} aria-controls={pid} onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-center gap-4 py-5 text-left md:gap-6 md:py-6">
                      <span aria-hidden className="w-7 flex-none font-cond text-base font-extrabold tracking-[.12em] text-orange">{String(i + 1).padStart(2, "0")}</span>
                      <span className={`flex-1 text-[clamp(1.125rem,1rem+.5vw,1.4rem)] font-semibold leading-snug transition-colors ${isOpen ? "text-paper" : "text-paper/85 group-hover:text-paper"}`}>{f.q}</span>
                      <span aria-hidden className="faq-icon relative h-4 w-4 flex-none text-paper/70 transition-colors group-hover:text-paper" />
                    </button>
                  </h3>
                  <div id={pid} role="region" aria-labelledby={bid} className="faq-panel" {...(!isOpen && { inert: "" })}>
                    <div>
                      <p className="max-w-[58ch] pb-2 pl-11 pr-8 text-[1.0625rem] leading-relaxed text-paper/75 md:pl-[3.25rem]">{f.a}</p>
                      {(f.link || f.ticket) && (
                        <div className="pb-6 pl-11 pt-3 md:pl-[3.25rem]">
                          {f.link && <a href={f.link.href} className="inline-flex min-h-11 items-center gap-2 font-cond text-base font-extrabold uppercase tracking-[.16em] text-orange">
                            <span className="link-line">{f.link.label}</span><span aria-hidden>→</span></a>}
                          {f.ticket && <TicketButton className="btn-primary btn-sm" />}
                        </div>
                      )}
                      {!f.link && !f.ticket && <div className="pb-4" />}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
