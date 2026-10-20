import type { CSSProperties } from "react";
import { eventData } from "../data/event";
import PromoVideo from "./PromoVideo";
import Sparkle from "./Sparkle";
import TicketButton from "./TicketButton";
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
/**
 * Tudo centralizado: logo oficial no topo; logo abaixo, o vídeo oficial (Reel do Instagram) em destaque;
 * depois, o tema e o essencial para decidir (data, horário, local, convidados, compra).
 * Um brilho de acento ao lado do logo. O vídeo de adoração fica no fundo da página (BackgroundStage).
 * Entrada escalonada só no carregamento (desligada com prefers-reduced-motion).
 */
export default function Hero() {
  const { church, day, schedule, speakers, theme, year } = eventData;
  const [doors, start] = schedule;
  return (
    <section id="top" className="mesh-blue relative isolate overflow-hidden pb-20 pt-20 text-paper md:pb-24 md:pt-24">
      <div className="wrap relative flex flex-col items-center gap-y-8 text-center">
        <h1 className="rise relative z-10 w-full" style={d(0)}>
          <span className="sr-only">Conferência Electus {year}</span>
          {/* logo oficial (SVG, proporção 613×401); o texto do h1 fica no sr-only acima */}
          <img src="/logo/conferencia-electus.svg" alt="" width={613} height={401} decoding="async" {...{ fetchpriority: "high" }}
            className="mx-auto block h-auto w-full max-w-[26rem] select-none sm:max-w-[30rem] md:max-w-[min(56vw,40rem)]" draggable={false} />
          {/* brilho ao lado do logo (só a partir do tablet, onde há espaço livre nas laterais) */}
          <Sparkle className="absolute right-[6%] top-[58%] hidden w-10 text-orange md:block lg:right-[12%] lg:w-12" />
        </h1>

        <div className="rise relative z-10 w-full" style={d(80)}>
          <PromoVideo />
        </div>

        <div className="relative z-10 flex w-full flex-col items-center">
          <p className="rise eyebrow eyebrow-center text-paper" style={d(150)}>Conferência {year} · Tema</p>
          <p className="rise mt-5 whitespace-nowrap font-pixel uppercase leading-none text-[clamp(2.5rem,14.5vw,5rem)] md:text-[clamp(3.5rem,7.6vw,6.5rem)]" style={d(220)}>
            {theme.name.split(" ")[0]} <span className="text-orange">{theme.name.split(" ").slice(1).join(" ")}</span>
          </p>
          <p className="rise mt-4 max-w-[36ch] text-[clamp(1.125rem,1rem+.5vw,1.375rem)] font-medium leading-snug text-paper/90" style={d(260)}>{theme.tagline}</p>
          <dl className="rise mt-7 grid w-full max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t border-paper/25 pt-5 font-cond uppercase" style={d(320)}>
            <div>
              <dt className="label">{day.weekday}</dt>
              <dd className="mt-0.5 text-xl font-extrabold leading-tight tracking-[.08em] md:text-2xl">{day.day} Dez
                <span className="mt-1 block font-sans text-sm font-medium normal-case tracking-normal text-paper/75">{doors.title} às {doors.time.toLowerCase()}</span></dd>
            </div>
            <div>
              <dt className="label">{start.title}</dt>
              <dd className="mt-0.5 text-xl font-extrabold tracking-[.08em] text-orange md:text-2xl">{start.time}</dd>
            </div>
            <div>
              <dt className="label">Local</dt>
              <dd className="mt-0.5 text-xl font-extrabold leading-tight tracking-[.08em] md:text-2xl">{church.name}
                <span className="mt-1 block font-sans text-sm font-medium normal-case tracking-normal text-paper/75">{church.city}</span></dd>
            </div>
            <div>
              <dt className="label">Convidados</dt>
              <dd className="mt-0.5 text-xl font-extrabold leading-tight tracking-[.08em] md:text-2xl">{speakers.map((s) => <span key={s.id} className="block">{s.name}</span>)}</dd>
            </div>
          </dl>
          <div className="rise mt-8 flex flex-wrap justify-center gap-3" style={d(420)}>
            <TicketButton className="btn-primary btn-lg" />
            <a href="#convidados" className="btn btn-ghost btn-lg">Ver convidados</a>
          </div>
        </div>

      </div>
    </section>
  );
}
