import { eventData } from "../data/event";
import Reveal from "./Reveal";
/**
 * Data e local num só bloco: só o que está confirmado. Cada painel tem rótulo no topo e dado na base,
 * então a altura igual entre colunas é intencional (sem lacunas). Data, horários (schedule em event.ts) e local.
 */
export default function Schedule() {
  const { day, schedule, venue, timesArePreliminary, year } = eventData;
  return (
    <section id="datas" className="section">
      <div className="wrap">
        <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div>
            <p className="eyebrow">Data e local</p>
            <h2 className="h-section mt-6">Um dia na<br />Renovo Church</h2>
          </div>
          <p className="lede max-w-[34ch]">Sábado, 12 de dezembro de {year}, em São Bernardo do Campo, SP. Portões abertos a partir das 15h30.</p>
        </Reveal>

        <Reveal className="mt-12 grid grid-cols-2 gap-px border border-paper/15 bg-paper/15 md:mt-16 lg:grid-cols-3">
          <article className="flex flex-col justify-between gap-8 bg-[#0a0f2a] p-5 sm:p-6 md:p-8">
            <h3 className="font-display text-3xl uppercase leading-none text-paper/90 md:text-4xl">{day.weekday}</h3>
            <p className="flex items-end gap-2 sm:gap-3">
              <span className="font-display text-[clamp(4.25rem,3rem+5vw,8.5rem)] leading-[.78]">{day.day}</span>
              <span className="pb-0.5 font-cond text-base font-extrabold uppercase leading-tight tracking-[.16em] sm:text-xl">{day.month}<br />{year}</span>
            </p>
          </article>

          <article className="flex flex-col justify-between gap-8 bg-[#0a0f2a] p-5 sm:p-6 md:p-8">
            <h3 className="font-display text-3xl uppercase leading-none text-paper/90 md:text-4xl">Horários</h3>
            <div>
              {/* horários numa coluna comum (largura do maior) para os rótulos começarem todos no mesmo ponto */}
              <ol className="grid sm:grid-cols-[max-content_1fr] sm:gap-x-4">
                {schedule.map((p, i) => (
                  <li key={p.time} className={`flex flex-col gap-1 py-3 sm:col-span-2 sm:grid sm:grid-cols-subgrid sm:items-baseline ${i ? "border-t border-paper/15" : ""}`}>
                    <span className="font-display text-4xl uppercase leading-none text-orange md:text-5xl">{p.time}</span>
                    <span className="font-cond text-base font-extrabold uppercase tracking-[.12em] text-paper/85 sm:text-lg">{p.title}</span>
                  </li>
                ))}
              </ol>
              {timesArePreliminary && <p className="label mt-2">Horário preliminar</p>}
            </div>
          </article>

          <article id="local" className="relative col-span-2 flex flex-col overflow-hidden bg-blue p-5 sm:p-6 md:p-8 lg:col-span-1">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(80%_70%_at_100%_0%,rgba(255,255,255,.16),transparent_70%),radial-gradient(70%_60%_at_0%_100%,rgba(255,90,31,.32),transparent_70%)]" />
            <div className="relative flex h-full flex-col">
              <h3 className="label text-paper/85">Local</h3>
              {venue.confirmed ? <>
                <p className="mt-5 font-display text-[clamp(2.75rem,2.2rem+2.4vw,4.25rem)] uppercase leading-[.85]">{venue.name}</p>
                <address className="mt-4 max-w-[34ch] text-[1.0625rem] not-italic leading-relaxed text-paper/90">{venue.address}</address>
                {venue.parking && <p className="mt-3 flex items-center gap-2 text-[1.0625rem] font-medium text-paper">
                  <span aria-hidden className="grid h-6 w-6 place-items-center bg-paper font-cond text-sm font-extrabold text-blue">P</span>{venue.parking}</p>}
                {venue.mapUrl && <div className="mt-auto pt-7"><a className="btn border-paper text-paper hover:bg-paper hover:text-ink" href={venue.mapUrl} target="_blank" rel="noopener noreferrer">
                  Como chegar <span aria-hidden className="arrow">↗</span><span className="sr-only"> (abre o mapa em nova aba)</span></a></div>}
              </> : <p className="mt-5 font-display text-5xl uppercase leading-[.9]">A confirmar</p>}
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
