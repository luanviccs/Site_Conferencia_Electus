import { useEffect, useState } from "react";
import { eventData } from "../data/event";
import Mark from "./Mark";
import TicketButton from "./TicketButton";
/**
 * Transparente sobre o hero; ganha fundo sólido ao rolar. O botão de ingressos fica sempre visível;
 * abaixo de 1024px a navegação vai para um menu compacto.
 */
export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setSolid(scrollY > 24);
    on(); addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const resize = () => { if (innerWidth >= 1024) setOpen(false); };
    addEventListener("keydown", esc); addEventListener("resize", resize);
    return () => { removeEventListener("keydown", esc); removeEventListener("resize", resize); };
  }, [open]);
  const bg = solid || open;
  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${bg ? "border-paper/10 bg-ink/95" : "border-transparent"}`}>
      <div className="wrap flex h-16 items-center justify-between gap-4 md:h-20">
        <a href="#top" aria-label="Conferência Electus 2026, início" className="flex min-h-11 min-w-0 items-center gap-2.5 text-paper sm:gap-3" onClick={() => setOpen(false)}>
          <Mark className="h-8 flex-none bg-current max-[359px]:hidden md:h-9" />
          <span className="flex flex-col whitespace-nowrap">
            <span className="font-cond text-xs font-extrabold uppercase leading-none tracking-[.26em] text-paper/70 max-[389px]:text-[.625rem] max-[389px]:tracking-[.16em]">Conferência</span>
            <span className="mt-1 font-display text-xl uppercase leading-[.85] tracking-wide max-[389px]:text-lg sm:text-2xl">Electus<span className="ml-1.5 font-cond text-sm font-extrabold tracking-[.16em] text-orange max-[389px]:ml-1 max-[389px]:text-xs max-[389px]:tracking-[.08em] sm:ml-2 sm:text-base">2026</span></span>
          </span>
        </a>
        <nav aria-label="Principal" className="hidden items-center gap-8 font-cond text-base font-extrabold uppercase tracking-[.18em] text-paper/75 lg:flex">
          {eventData.nav.map((n) => <a key={n.href} href={n.href} className="link-line py-1 hover:text-paper">{n.label}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <TicketButton className="btn-primary btn-sm">Ingressos</TicketButton>
          <button type="button" aria-expanded={open} aria-controls="menu-mobile" aria-label={open ? "Fechar menu" : "Abrir menu"} onClick={() => setOpen((o) => !o)}
            className="relative grid h-11 w-11 place-items-center text-paper lg:hidden">
            <span aria-hidden className={`absolute h-0.5 w-6 bg-current transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[5px]"}`} />
            <span aria-hidden className={`absolute h-0.5 w-6 bg-current transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[5px]"}`} />
          </button>
        </div>
      </div>
      <div id="menu-mobile" data-open={open} className="menu-panel lg:hidden" {...(!open && { inert: "" })}>
        <div>
          <nav aria-label="Menu" className="wrap flex flex-col pb-6 pt-2">
            {eventData.nav.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)}
                className="flex min-h-14 items-center justify-between border-t border-paper/10 font-display text-3xl uppercase text-paper transition-colors hover:text-orange">
                {n.label}<span aria-hidden className="text-xl text-paper/40">→</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
