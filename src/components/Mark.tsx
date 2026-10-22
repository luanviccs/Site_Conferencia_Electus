import { eventData } from "../data/event";
/** Letra "e" do Electus como máscara: pinte com qualquer cor via className (bg-*). Arquivo: logoSrc em src/data/event.ts */
export default function Mark({ className = "" }: { className?: string }) {
  const m = `url(${eventData.logoSrc}) center/contain no-repeat`;
  return <span aria-hidden className={`inline-block aspect-[1292/1376] ${className}`} style={{ WebkitMask: m, mask: m }} />;
}
