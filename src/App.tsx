import { useEffect } from "react";
import { eventData, ticketReady } from "./data/event";
import BackgroundStage from "./components/BackgroundStage";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import ConferenceIntro from "./components/ConferenceIntro";
import Speakers from "./components/Speakers";
import ElectusVision from "./components/ElectusVision";
import Schedule from "./components/Schedule";
import Faq from "./components/Faq";
import TicketsCTA from "./components/TicketsCTA";
import Footer from "./components/Footer";
import ConsentBanner from "./components/ConsentBanner";

export default function App() {
  // Structured data só quando local e ingresso estiverem definidos (nada inventado).
  useEffect(() => {
    if (!eventData.venue.confirmed || !ticketReady) return;
    const s = document.createElement("script"); s.type = "application/ld+json";
    s.text = JSON.stringify({ "@context": "https://schema.org", "@type": "Event", name: `${eventData.name} ${eventData.year}: ${eventData.theme.name}`,
      startDate: eventData.dates.start, endDate: eventData.dates.end, doorTime: eventData.dates.doors,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", eventStatus: "https://schema.org/EventScheduled",
      location: { "@type": "Place", name: eventData.venue.name, address: eventData.venue.address },
      performer: eventData.speakers.map((p) => ({ "@type": "Person", name: p.name })),
      organizer: { "@type": "Organization", name: eventData.church.name }, url: eventData.ticketUrl });
    const f = document.createElement("script"); f.type = "application/ld+json";
    f.text = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: eventData.faq.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })) });
    document.head.append(s, f); return () => { s.remove(); f.remove(); };
  }, []);
  // Ordem pensada para conversão: o que é → quem vem → identidade → quando/onde → dúvidas → compra.
  return (
    <>
      <a href="#conferencia" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-orange focus:p-3 focus:font-bold focus:text-ink">Ir para o conteúdo</a>
      <BackgroundStage />
      <Header />
      <main>
        <Hero />
        <div className="page-bg overflow-x-clip">
          <Marquee />
          <ConferenceIntro />
          <Speakers />
          <ElectusVision />
          <Schedule />
          <Faq />
          <TicketsCTA />
        </div>
      </main>
      <Footer />
      <ConsentBanner />
    </>
  );
}
