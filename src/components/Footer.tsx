import { eventData, ticketReady } from "../data/event";
export default function Footer() {
  const { church, verse, instagram, nav, name, year, ticketUrl } = eventData;
  const link = "flex min-h-11 items-center self-start transition-colors hover:text-orange";
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="wrap grid gap-12 pb-12 pt-16 md:grid-cols-12 md:gap-x-10 md:pt-28">
        <div className="md:col-span-7">
          <p className="eyebrow">Instagram</p>
          <a href={instagram.url} target="_blank" rel="noopener noreferrer" aria-label={`Instagram do Electus, ${instagram.handle} (abre em nova aba)`}
            className="mt-5 inline-block break-words font-display text-[clamp(2.6rem,1.6rem+5vw,6.5rem)] uppercase leading-none transition-colors hover:text-orange">
            {instagram.handle}<span aria-hidden className="ml-3 text-orange">↗</span></a>
          <p className="lede mt-4 max-w-[36ch]">Acompanhe o Electus e as novidades da conferência.</p>
        </div>
        <div className="grid grid-cols-2 gap-8 md:col-span-5 md:pt-10">
          <div className="text-sm leading-relaxed text-paper/70">
            <p className="font-cond text-base font-extrabold uppercase tracking-[.18em] text-paper">{name} {year}</p>
            <p className="mt-2">{church.name}</p>
            <address className="not-italic">{church.address}</address>
          </div>
          <nav aria-label="Rodapé" className="flex flex-col font-cond text-base font-extrabold uppercase tracking-[.18em] text-paper/80">
            {nav.map((n) => <a key={n.href} href={n.href} className={link}>{n.label}</a>)}
            <a href={ticketReady ? ticketUrl : "#ingressos"} {...(ticketReady ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={`${link} gap-2 text-orange`}>Ingressos<span aria-hidden>↗</span>{ticketReady && <span className="sr-only"> (abre em nova aba)</span>}</a>
          </nav>
        </div>
      </div>
      <div aria-hidden className="wrap flex flex-wrap gap-x-6 gap-y-1 font-cond text-sm font-bold uppercase tracking-[.22em] text-paper/45">
        <span>{verse.ref}</span>{verse.words.map((w) => <span key={w}>{w}</span>)}
      </div>
      <p aria-hidden className="chrome -mb-[3.5vw] mt-6 select-none whitespace-nowrap text-center font-display text-[30vw] uppercase leading-[.78]">Electus</p>
    </footer>
  );
}
