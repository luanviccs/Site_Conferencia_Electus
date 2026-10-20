/** Logo "e" do Electus como máscara: pinte com qualquer cor via className (bg-*). Arquivo: public/logo/electus-e.png */
export default function Mark({ className = "" }: { className?: string }) {
  const m = "url(/logo/electus-e.png) center/contain no-repeat";
  return <span aria-hidden className={`inline-block aspect-[1292/1376] ${className}`} style={{ WebkitMask: m, mask: m }} />;
}
