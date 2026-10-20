import { eventData } from "../data/event";
import Mark from "./Mark";
import Photo from "./Photo";
import Reveal from "./Reveal";

/*
 * Galeria (todas as fotos do site ficam aqui), na ordem de `photos` em event.ts.
 * Celular: foto principal larga; retrato alto ao lado de dois quadrados; foto larga fechando.
 * Desktop: mosaico 12×7 — principal + retrato em cima (4 linhas); embaixo três recortes de larguras diferentes (3 linhas).
 */
const tiles = [
  { cls: "col-span-2 aspect-[4/3] md:col-[1/9] md:row-[1/5]", sizes: "(min-width: 768px) 38vw, 100vw" },
  { cls: "row-span-2 md:col-[9/13] md:row-[1/5]", sizes: "(min-width: 768px) 19vw, 50vw" },
  { cls: "aspect-square md:col-[1/4] md:row-[5/8]", sizes: "(min-width: 768px) 14vw, 50vw" },
  { cls: "aspect-square md:col-[4/9] md:row-[5/8]", sizes: "(min-width: 768px) 24vw, 50vw" },
  { cls: "col-span-2 aspect-[16/9] md:col-[9/13] md:row-[5/8]", sizes: "(min-width: 768px) 19vw, 100vw" },
];

/** Identidade do Electus: o versículo que dá nome ao grupo, as fotos reais do grupo, as quatro palavras que o resumem e a frase do tema. */
export default function ElectusVision() {
  const { verse, vision, photos } = eventData;
  return (
    <section id="electus" className="section relative overflow-hidden pb-12 md:pb-16">
      <Mark className="pointer-events-none absolute -right-[10vw] top-24 w-[46vw] bg-blue opacity-[.07] md:w-[30vw]" />
      <div className="wrap relative grid gap-12 md:grid-cols-12 md:items-center md:gap-x-10 lg:gap-x-16">
        <Reveal className="md:col-span-5">
          <p className="eyebrow">{verse.ref}</p>
          <h2 className="h-section mt-6">{vision.title}</h2>
          <p className="lede mt-6 max-w-[40ch]">{vision.text}</p>
          <blockquote className="mt-10 border-l-2 border-orange pl-5">
            <p className="text-[1.125rem] font-medium leading-relaxed text-paper/85 text-pretty">“{verse.text}”</p>
            <footer className="label mt-3">{verse.ref} · {verse.version}</footer>
          </blockquote>
        </Reveal>
        <div className="relative isolate md:col-span-7">
          {/* luz azul com um ponto de calor laranja atrás do mosaico (mesma paleta dos degradês da página) */}
          <div aria-hidden className="pointer-events-none absolute -inset-[8%] -z-10"
            style={{ background: "radial-gradient(60% 55% at 40% 40%, rgb(35 64 255 / .32), transparent 70%), radial-gradient(35% 35% at 82% 78%, rgb(255 90 31 / .22), transparent 72%)" }} />
          <div className="grid grid-cols-2 gap-3 md:aspect-square md:grid-cols-12 md:grid-rows-7 lg:aspect-[7/6] md:gap-4">
            {photos.map((p, i) => (
              <Photo key={p.src} src={p.src} pos={p.pos} alt={p.alt} sizes={tiles[i].sizes} delay={i * 110}
                className={`${tiles[i].cls} md:aspect-auto ${i === 0 ? "" : "shadow-[0_24px_60px_-24px_rgba(0,0,0,.8)]"}`} />
            ))}
          </div>
        </div>
      </div>
      <ol className="wrap relative mt-16 grid grid-cols-2 md:mt-24 lg:grid-cols-4">
        {verse.words.map((w, k) => (
          <li key={w} className="border-t border-paper/20 py-6 pr-3 md:py-8">
            <Reveal delay={k * 90}>
              <span className="font-cond text-base font-extrabold tracking-[.18em] text-orange">{String(k + 1).padStart(2, "0")}</span>
              <span className={`mt-2 block font-display uppercase leading-none text-[min(8vw,4rem)] lg:text-[min(3.9vw,3.6rem)] ${k === 0 ? "text-paper" : "text-paper/80"}`}>{w}</span>
            </Reveal>
          </li>
        ))}
      </ol>
      <Reveal className="wrap relative">
        <p className="border-t border-paper/20 pt-8 font-display uppercase leading-[.95] text-[clamp(1.875rem,1.2rem+2.8vw,3.5rem)] text-orange text-balance md:pt-10">{vision.callout}</p>
      </Reveal>
    </section>
  );
}
