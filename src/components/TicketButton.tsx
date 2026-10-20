import { eventData, ticketReady } from "../data/event";
import type { ReactNode } from "react";
/** Todos os CTAs de compra usam este componente → TICKET_URL em src/data/event.ts */
export default function TicketButton({ children = "Garanta seu ingresso", className = "btn-primary" }: { children?: ReactNode; className?: string }) {
  return (
    <a href={ticketReady ? eventData.ticketUrl : "#ingressos"} {...(ticketReady ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`btn ${className}`}>
      <span>{children}</span><span aria-hidden className="arrow">↗</span>
      {ticketReady && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  );
}
