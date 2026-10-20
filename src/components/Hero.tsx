import type { CSSProperties } from "react";
import { eventData } from "../data/event";
import Sparkle from "./Sparkle";
import TicketButton from "./TicketButton";
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
/**
 * Wordmark cromado no topo; abaixo, à esquerda, o tema e o essencial para decidir (data, horário, local, convidados, compra);
 * à direita o brilho de acento sobre a luz laranja. O vídeo de adoração fica no fundo da página (BackgroundStage).
 * Entrada escalonada só no carregamento (desligada com prefers-reduced-motion).
 */
export default function Hero() {
  const { church, day, schedule, speakers, theme, year } = eventData;
  const [doors, ...sessions] = schedule;
  return (
    <section id="top" className="mesh-blue relative isolate overflow-hidden pb-20 pt-20 text-paper md:pb-24 md:pt-24">
      <div className="wrap relative grid gap-y-8 md:grid-cols-12 md:gap-x-10">
        <h1 className="rise relative z-10 md:col-span-12" style={d(0)}>
          <span className="sr-only">Conferência Electus {year}</span>
          <span aria-hidden className="chrome block select-none whitespace-nowrap font-display text-[30.5vw] uppercase leading-[.78] md:-ml-[.5vw] md:text-[min(31.5vw,28.5rem)]">Electus</span>
        </h1>

        <div className="relative z-10 flex flex-col md:col-span-7 md:pb-4 lg:col-span-6">
          <p className="rise eyebrow text-paper" style={d(150)}>Conferência {year} · Tema</p>
          <p className="rise mt-5 whitespace-nowrap font-pixel uppercase leading-none text-[clamp(2.5rem,14.5vw,5rem)] md:text-[clamp(3.5rem,7.6vw,6.5rem)]" style={d(220)}>
            {theme.name.split(" ")[0]} <span className="text-orange">{theme.name.split(" ").slice(1).join(" ")}</span>
          </p>
          <p className="rise mt-4 text-[clamp(1.125rem,1rem+.5vw,1.375rem)] font-medium leading-snug text-paper/90" style={d(260)}>{theme.tagline}</p>
          <dl className="rise mt-7 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t border-paper/25 pt-5 font-cond uppercase" style={d(320)}>
            <div>
              <dt className="label">{day.weekday}</dt>
              <dd className="mt-0.5 text-xl font-extrabold leading-tight tracking-[.08em] md:text-2xl">{day.day} Dez
                <span className="mt-1 block font-sans text-sm font-medium normal-case tracking-normal text-paper/75">{doors.title} às {doors.time.toLowerCase()}</span></dd>
            </div>
            <div>
              <dt className="label">Sessões</dt>
              <dd className="mt-0.5 text-xl font-extrabold tracking-[.08em] md:text-2xl">
                {sessions.map((s, i) => <span key={s.time}>{i > 0 && " · "}<span className="text-orange">{s.time}</span></span>)}</dd>
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
          <div className="rise mt-8 flex flex-wrap gap-3" style={d(420)}>
            <TicketButton className="btn-primary btn-lg" />
            <a href="#convidados" className="btn btn-ghost btn-lg">Ver convidados</a>
          </div>
        </div>

        {/* Acento sobre a luz laranja do degradê; as fotos ficam reunidas em "Por que Electus?" */}
        <div aria-hidden className="relative hidden md:col-span-5 md:block lg:col-span-6">
          <Sparkle className="rise absolute left-[38%] top-[42%] w-12 text-orange" />
        </div>
      </div>
    </section>
  );
}
