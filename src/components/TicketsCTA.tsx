import { eventData } from "../data/event";
import Countdown from "./Countdown";
import Reveal from "./Reveal";
import Sparkle from "./Sparkle";
import TicketButton from "./TicketButton";
/** Convite final: só a chamada, sobre o vídeo de louvor ao ar livre que já está no fundo da página (BackgroundStage). */
export default function TicketsCTA() {
  return (
    <section id="ingressos" className="relative isolate overflow-hidden">
      <div className="wrap py-28 md:py-44">
        <Reveal className="relative mx-auto max-w-3xl text-center">
          {/* par de brilhos (azul maior + laranja menor) ao lado do título */}
          <Sparkle className="pointer-events-none absolute right-0 top-0 w-9 text-sky sm:top-8 lg:-right-20 lg:w-12" />
          <Sparkle className="pointer-events-none absolute right-10 top-24 hidden w-4 text-orange sm:block lg:-right-6 lg:top-28 lg:w-5" />
          <p className="eyebrow eyebrow-center">Ingressos</p>
          <h2 className="mt-6 font-display text-[clamp(3.5rem,2rem+7vw,9rem)] uppercase leading-[.85]">Garanta seu <span className="text-orange">ingresso</span></h2>
          <p className="mt-7 text-[clamp(1.25rem,1.1rem+.6vw,1.625rem)] font-semibold leading-snug text-paper">{eventData.theme.slogan}</p>
          <p className="lede mx-auto mt-3 max-w-[40ch] text-paper/90">Sábado, 12 de dezembro, na {eventData.venue.name}. Portões abertos a partir das 15h30. A compra é feita na plataforma oficial de inscrições.</p>
          <div className="mt-10"><TicketButton className="btn-primary btn-lg" /></div>
          <Countdown className="mx-auto mt-14 max-w-xl" />
        </Reveal>
      </div>
    </section>
  );
}
