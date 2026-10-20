import { useEffect, useRef, type ReactNode } from "react";
/** Adiciona a classe "in" uma única vez quando o elemento entra na tela. Desligado com prefers-reduced-motion via CSS. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (!("IntersectionObserver" in window)) { el.classList.add("in"); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    io.observe(el); return () => io.disconnect();
  }, []);
  return ref;
}
/** Entrada única por elemento (opacidade + deslocamento curto). */
export default function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useReveal<HTMLDivElement>();
  return <div ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>{children}</div>;
}
