import { eventData } from "../data/event";
/**
 * Faixa com as quatro palavras de 1 Pedro 1:2; cobre a emenda entre o hero e o corpo da página.
 * Só as quatro palavras, neste design: é a mesma arte das pulseiras da conferência.
 */
export default function Marquee() {
  const t = eventData.verse.words.join("  ✦  ") + "  ✦  ";
  return (
    <div aria-hidden className="marquee-wrap relative z-20 -mt-7 -rotate-[1.5deg] overflow-hidden bg-orange py-3 text-ink shadow-[0_20px_40px_-20px_rgba(0,0,0,.6)] md:py-4">
      <div className="marquee flex w-max whitespace-pre font-display text-3xl uppercase leading-none md:text-5xl">
        {[0, 1, 2, 3].map((i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}
