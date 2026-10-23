import { eventData, ticketReady } from "../data/event";
import { track } from "../lib/analytics";
import type { ReactNode } from "react";
/**
 * Todos os CTAs de compra usam este componente → TICKET_URL em src/data/event.ts.
 * Cada clique vira o evento "clique_ingresso" no Google Analytics (se a pessoa aceitou os cookies), com a seção de origem.
 */
export default function TicketButton({ children = "Garanta seu ingresso", className = "btn-primary" }: { children?: ReactNode; className?: string }) {
  return (
    <a href={ticketReady ? eventData.ticketUrl : "#ingressos"} {...(ticketReady ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={(e) => track("clique_ingresso", { secao: e.currentTarget.closest("section, header, footer")?.id || e.currentTarget.closest("header, footer")?.tagName.toLowerCase() || "pagina" })}
      className={`btn ${className}`}>
      <span>{children}</span><span aria-hidden className="arrow">↗</span>
      {ticketReady && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  );
}
