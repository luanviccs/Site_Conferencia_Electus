import { useReveal } from "./Reveal";
/**
 * Foto editorial em cor natural com o tom da página por cima (base azul-noite, topo azul), borda nítida. Preenche a caixa
 * que o layout der (aspect ou área do grid). Surge ao rolar; carrega a versão 960px em telas pequenas.
 */
export default function Photo({ src, alt, pos = "center", className = "", sizes = "(min-width: 768px) 58vw, 100vw", delay = 0 }:
  { src: string; alt: string; pos?: string; className?: string; sizes?: string; delay?: number }) {
  const ref = useReveal<HTMLElement>();
  return (
    <figure ref={ref} className={`reveal-photo relative overflow-hidden bg-deep ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      <img src={src} srcSet={`${src.replace(".webp", "-960.webp")} 960w, ${src} 1800w`} sizes={sizes} alt={alt} width={1800} height={1200}
        loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover contrast-[1.04] saturate-[.92]" style={{ objectPosition: pos }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-[#18C1FF]/10" />
      <div aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-paper/10" />
    </figure>
  );
}
