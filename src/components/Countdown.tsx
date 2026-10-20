import { eventData } from "../data/event";
import { useCountdown } from "../hooks/useCountdown";
const pad = (n: number) => String(n).padStart(2, "0");
/** Contagem regressiva compacta (usada no bloco de ingressos). */
export default function Countdown({ className = "" }: { className?: string }) {
  const c = useCountdown(eventData.dates.doors, eventData.dates.end);
  const units = [["Dias", c.d], ["Horas", c.h], ["Min", c.m], ["Seg", c.s]] as const;
  return (
    <div className={className}>
      {c.status === "before" ? (
        <div aria-hidden className="grid max-w-xl grid-cols-4 border-t border-paper/25">
          {units.map(([label, v], i) => (
            <div key={label} className={`pt-4 text-center ${i ? "border-l border-paper/25" : ""}`}>
              <div key={v} className="tick font-display text-[clamp(2.5rem,1.8rem+3vw,4.5rem)] leading-none tabular-nums">{pad(v)}</div>
              <div className="mt-1 font-cond text-sm font-extrabold uppercase tracking-[.18em] text-orange">{label}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="font-display text-5xl uppercase leading-none">{c.status === "live" ? "É agora." : "Foi inesquecível."}</p>
      )}
      <p className="sr-only">{c.status === "before" ? `Faltam ${c.d} dias para a conferência.` : "Conferência em andamento ou encerrada."}</p>
    </div>
  );
}
