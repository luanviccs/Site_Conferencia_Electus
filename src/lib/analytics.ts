import { eventData } from "../data/event";

/**
 * Google Analytics 4, só com consentimento (LGPD).
 * - Sem `analytics.ga4Id` em event.ts nada é carregado e o aviso de cookies não aparece.
 * - O script do Google só é baixado depois que a pessoa clica em "Aceitar"; a escolha fica salva no navegador.
 * - `track` registra eventos (ex.: clique nos botões de ingresso); antes do consentimento, não faz nada.
 */
type Gtag = (...args: unknown[]) => void;
declare global { interface Window { dataLayer?: unknown[]; gtag?: Gtag } }

const KEY = "electus-consentimento-analytics";
export const analyticsEnabled = () => Boolean(eventData.analytics.ga4Id);

export function getConsent(): "aceito" | "recusado" | null {
  try { const v = localStorage.getItem(KEY); return v === "aceito" || v === "recusado" ? v : null; } catch { return null; }
}

export function setConsent(v: "aceito" | "recusado") {
  try { localStorage.setItem(KEY, v); } catch { /* navegação privada: vale só para esta visita */ }
  if (v === "aceito") loadAnalytics();
}

let loaded = false;
export function loadAnalytics() {
  const id = eventData.analytics.ga4Id;
  if (loaded || !id) return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  // o gtag oficial exige empilhar o objeto `arguments` (não um array)
  window.gtag = function gtag() { window.dataLayer!.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.append(s);
}

export function track(event: string, params: Record<string, string | number> = {}) {
  if (loaded && window.gtag) window.gtag("event", event, params);
}
