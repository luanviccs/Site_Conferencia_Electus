import { eventData } from "../data/event";
import Countdown from "./Countdown";
import Reveal from "./Reveal";
import TicketButton from "./TicketButton";
/** Convite final: só a chamada, sobre o vídeo de louvor ao ar livre que já está no fundo da página (BackgroundStage). */
export default function TicketsCTA() {
  return (
    <section id="ingressos" className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_12%_80%,rgba(255,90,31,.2),transparent_70%)]" />
      <div className="wrap py-28 md:py-44">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Ingressos</p>
          <h2 className="mt-6 font-display text-[clamp(3.5rem,2rem+7vw,9rem)] uppercase leading-[.85]">Garanta seu <span className="text-orange">ingresso</span></h2>
          <p className="mt-7 text-[clamp(1.25rem,1.1rem+.6vw,1.625rem)] font-semibold leading-snug text-paper">{eventData.theme.slogan}</p>
          <p className="lede mt-3 max-w-[40ch] text-paper/90">Sábado, 12 de dezembro, na Renovo Church. Portões abertos a partir das 15h30. A compra é feita na plataforma oficial de inscrições.</p>
          <div className="mt-10"><TicketButton className="btn-primary btn-lg" /></div>
          <Countdown className="mt-14" />
        </Reveal>
      </div>
    </section>
  );
}
