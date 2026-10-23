import { useEffect, useState } from "react";
import { analyticsEnabled, getConsent, loadAnalytics, setConsent } from "../lib/analytics";

/**
 * Aviso de cookies (LGPD) com mensagem padrão, discreto, no rodapé da tela. Só aparece se o Google Analytics estiver configurado
 * e a pessoa ainda não tiver escolhido. "Aceitar" carrega o Analytics; "Recusar" mantém o site sem medição.
 */
export default function ConsentBanner() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!analyticsEnabled()) return;
    const c = getConsent();
    if (c === "aceito") loadAnalytics();
    else if (c === null) setOpen(true);
  }, []);
  if (!open) return null;
  const choose = (v: "aceito" | "recusado") => { setConsent(v); setOpen(false); };
  return (
    <div role="region" aria-label="Aviso de cookies"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-2xl border border-paper/20 bg-ink/95 p-4 text-paper shadow-[0_20px_60px_-20px_rgba(0,0,0,.9)] backdrop-blur sm:inset-x-6 sm:bottom-6 sm:flex sm:items-center sm:gap-5 sm:p-5">
      <p className="text-[.9375rem] leading-relaxed text-paper/85">
        Utilizamos cookies para melhorar sua experiência de navegação. Ao clicar em “Aceitar”, você concorda com o uso de cookies.
      </p>
      <div className="mt-3 flex flex-none gap-2 sm:mt-0">
        <button type="button" onClick={() => choose("recusado")} className="btn btn-ghost btn-sm">Recusar</button>
        <button type="button" onClick={() => choose("aceito")} className="btn btn-primary btn-sm">Aceitar</button>
      </div>
    </div>
  );
}
