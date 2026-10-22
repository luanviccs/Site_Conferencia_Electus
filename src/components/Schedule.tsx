import { eventData } from "../data/event";
import Reveal from "./Reveal";
import Sparkle from "./Sparkle";
/**
 * Data e local num só bloco: só o que está confirmado. Cada painel tem rótulo no topo e dado na base,
 * então a altura igual entre colunas é intencional (sem lacunas). Data, horários (schedule em event.ts) e local.
 */
export default function Schedule() {
  const { day, schedule, venue, timesArePreliminary, year } = eventData;
  return (
    <section id="datas" className="section">
      <div className="wrap">
        <Reveal className="flex flex-col items-center gap-y-6 text-center">
          <div className="relative">
            <Sparkle className="pointer-events-none absolute -right-14 top-12 hidden w-8 text-sky md:block" />
            <p className="eyebrow eyebrow-center">Data e local</p>
            <h2 className="h-section mt-6">Um dia na<br />{venue.name}</h2>
          </div>
          <p className="lede max-w-[34ch]">Sábado, 12 de dezembro de {year}, em São Bernardo do Campo, SP. Portões abertos a partir das 15h30.</p>
        </Reveal>

        <Reveal className="mt-12 grid grid-cols-2 gap-px border border-paper/15 bg-paper/15 text-center md:mt-16 lg:grid-cols-3">
          <article className="flex flex-col justify-between gap-8 bg-black p-5 sm:p-6 md:p-8">
            <h3 className="font-display text-3xl uppercase leading-none text-paper/90 md:text-4xl">{day.weekday}</h3>
            <p className="flex items-end justify-center gap-2 sm:gap-3">
              <span className="font-display text-sky text-[clamp(4.25rem,3rem+5vw,8.5rem)] leading-[.78]">{day.day}</span>
              <span className="pb-0.5 font-cond text-base font-extrabold uppercase leading-tight tracking-[.16em] sm:text-xl">{day.month}<br />{year}</span>
            </p>
          </article>

          <article className="flex flex-col justify-between gap-8 bg-black p-5 sm:p-6 md:p-8">
            <h3 className="font-display text-3xl uppercase leading-none text-paper/90 md:text-4xl">Horários</h3>
            <div>
              {/* cada horário centralizado: hora em destaque e o rótulo logo abaixo */}
              <ol>
                {schedule.map((p, i) => (
                  <li key={p.time} className={`flex flex-col items-center gap-1 py-3 ${i ? "border-t border-paper/15" : ""}`}>
                    <span className="font-display text-4xl uppercase leading-none text-orange md:text-5xl">{p.time}</span>
                    <span className="font-cond text-base font-extrabold uppercase tracking-[.12em] text-paper/85 sm:text-lg">{p.title}</span>
                  </li>
                ))}
              </ol>
              {timesArePreliminary && <p className="label mt-2">Horário preliminar</p>}
            </div>
          </article>

          <article id="local" className="relative col-span-2 flex flex-col overflow-hidden bg-blue p-5 text-ink sm:p-6 md:p-8 lg:col-span-1">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(80%_70%_at_100%_0%,rgba(255,255,255,.28),transparent_70%)]" />
            <div className="relative flex h-full flex-col items-center">
              <h3 className="label text-ink/70">Local</h3>
              {venue.confirmed ? <>
                <p className="mt-5 font-display text-[clamp(2.75rem,2.2rem+2.4vw,4.25rem)] uppercase leading-[.85]">{venue.name}</p>
                <address className="mt-4 max-w-[34ch] text-[1.0625rem] not-italic leading-relaxed text-ink/80">{venue.address}</address>
                {venue.parking && <p className="mt-3 flex items-center justify-center gap-2 text-[1.0625rem] font-medium text-ink">
                  <span aria-hidden className="grid h-6 w-6 place-items-center bg-ink font-cond text-sm font-extrabold text-blue">P</span>{venue.parking}</p>}
                {venue.mapUrl && <div className="mt-auto pt-7"><a className="btn border-ink text-ink hover:bg-ink hover:text-paper" href={venue.mapUrl} target="_blank" rel="noopener noreferrer">
                  Como chegar <span aria-hidden className="arrow">↗</span><span className="sr-only"> (abre o mapa em nova aba)</span></a></div>}
              </> : <p className="mt-5 font-display text-5xl uppercase leading-[.9]">A confirmar</p>}
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
