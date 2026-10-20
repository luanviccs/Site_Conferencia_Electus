/**
 * ÚNICA FONTE DE VERDADE. Edite aqui: datas, horários, local, ingresso, atrações, textos.
 * Tudo que estiver como "[A DEFINIR]" / "URL_A_DEFINIR" é placeholder.
 */
// Link oficial de compra (e-inscrição), usado por todos os botões de ingresso do site.
export const TICKET_URL = "https://www.e-inscricao.com/e/w9OD4Z000a8g";

export const eventData = {
  name: "Conferência Electus",
  year: 2026,
  // Um único dia. doors = abertura dos portões (alvo da contagem regressiva); start = 1ª sessão; "ao vivo" até end.
  dates: { doors: "2026-12-12T15:30:00-03:00", start: "2026-12-12T16:30:00-03:00", end: "2026-12-12T23:00:00-03:00" },
  day: { weekday: "SÁBADO", day: "12", month: "DEZ", long: "12 DE DEZEMBRO" },
  // Horários do dia, na ordem (aparecem no topo e em "Data e local").
  schedule: [
    { time: "15H30", title: "Abertura dos portões" },
    { time: "16H30", title: "1ª sessão" },
    { time: "20H", title: "2ª sessão" },
  ],
  timesArePreliminary: false,
  ticketUrl: TICKET_URL,
  // Local confirmado: Renovo Church.
  venue: { confirmed: true, name: "Renovo Church", address: "Estrada dos Casa, 4285 - Bairro dos Casa, São Bernardo do Campo - SP, 09840-000",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Estrada+dos+Casa+4285+S%C3%A3o+Bernardo+do+Campo+SP", parking: "Estacionamento gratuito", transport: "" },
  // Endereço da igreja (informado), exibido no rodapé.
  church: { name: "Renovo Church", city: "São Bernardo do Campo, SP",
    address: "Estrada dos Casa, 4285 - Bairro dos Casa, São Bernardo do Campo - SP, 09840-000" },
  instagram: { handle: "@electus.sbc", url: "https://instagram.com/electus.sbc" },
  // LOGO: letra "e" (vazio = só texto ELECTUS)
  logoSrc: "/logo/electus-e.png", // só a letra "e" (PNG transparente); troque por SVG quando tiver
  verse: { ref: "1 PEDRO 1:2", words: ["ELEITOS", "SANTIFICADOS", "OBEDIENTES", "PURIFICADOS"],
    // Texto bíblico (Nova Versão Internacional).
    text: "Escolhidos de acordo com o pré-conhecimento de Deus Pai, pela obra santificadora do Espírito, para a obediência a Jesus Cristo e a aspersão do seu sangue: Graça e paz lhes sejam multiplicadas.",
    version: "NVI" },
  // Tema da conferência 2026 (topo, "A conferência", ingressos e título da página).
  theme: {
    name: "O Despertar",
    tagline: "Escolhidos por Deus, despertados pelo Espírito.",
    slogan: "O Despertar dos Eleitos.",
  },
  // Textos de apresentação: a ligação entre a identidade (Electus) e o tema (O Despertar).
  intro: {
    lines: ["Somos o Electus.", "Jovens da Renovo,", "de 18 a 35 anos."],
    lead: "Electus: é hora de despertar para a nossa eleição. Em 12 de dezembro, a gente para tudo por um dia para viver O Despertar.",
    blocks: [
      { label: "Quem somos", text: "Escolhidos e eleitos por Deus, de acordo com o seu pré-conhecimento (1 Pedro 1:2). É isso que Electus quer dizer." },
      { label: "O problema", text: "Muitas vezes, os escolhidos dormem espiritualmente, esquecem sua identidade ou se misturam com o mundo." },
      { label: "O chamado", text: "Despertar é o momento em que o escolhido acorda para viver a santificação e a obediência para as quais foi chamado." },
    ],
  },
  vision: {
    title: "Por que Electus?",
    text: "Electus é o nome do nosso grupo. O lema vem de um único versículo, 1 Pedro 1:2, e se resume em quatro palavras. É assim que a gente se apresenta.",
    // Frase de efeito do tema, logo abaixo das quatro palavras.
    callout: "Santificados para obedecer: o despertar da igreja eleita.",
  },
  speakers: [
    // Fotos em public/images/speakers/. shape: "wide" (foto horizontal, ex.: banda completa) ou "tall" (retrato).
    // w/h = dimensões reais do arquivo; pos = enquadramento (object-position).
    // Textos curtos e editáveis: confirme a nomenclatura institucional com a organização antes de publicar.
    { id: "dunamis", name: "Dunamis Music", description: "Expressão musical do movimento Dunamis, dedicada à adoração.",
      instagram: { handle: "@dunamis.music", url: "https://www.instagram.com/dunamis.music/" },
      image: "/images/speakers/dunamis-music.webp", w: 1200, h: 800, shape: "wide", pos: "50% 58%", zoom: 1 },
    { id: "denio", name: "Pr. Dênio Lara", description: "Pastor da Igreja Dinamus.",
      instagram: { handle: "@deniolarajr", url: "https://www.instagram.com/deniolarajr/" },
      image: "/images/speakers/denio-lara.webp", w: 335, h: 597, shape: "tall", pos: "50% 22%", zoom: 1 },
  ],
  // Fotos reais do Electus (public/images/electus/; cada uma tem versão -960.webp para celulares).
  // Todas ficam reunidas na galeria de "Por que Electus?", na ordem abaixo (posição no mosaico em ElectusVision.tsx).
  // pos = enquadramento (object-position): mantém rostos e mãos dentro dos recortes em todos os tamanhos de tela.
  photos: [
    { src: "/images/electus/maos-levantadas.webp", pos: "50% 38%",
      alt: "Jovens do Electus com as mãos levantadas durante o louvor, sob luz rosa e azul" },
    { src: "/images/electus/adoracao-retrato.webp", pos: "42% 38%",
      alt: "Jovem de suéter vermelho adorando de olhos fechados, com o rosto voltado para cima" },
    { src: "/images/electus/entrega.webp", pos: "48% 40%",
      alt: "Jovem de moletom branco de cabeça baixa, com as mãos sobre o peito, em oração" },
    { src: "/images/electus/ministracao.webp", pos: "45% 35%",
      alt: "Pregador de blusa branca ministrando ao microfone no palco, ao lado do púlpito com a Bíblia aberta" },
    { src: "/images/electus/oracao-grupo.webp", pos: "38% 35%",
      alt: "Jovens do Electus orando juntos, abraçados, de olhos fechados" },
  ],
  // Vídeos de FUNDO da página (public/media/): mudos, em loop, suaves (desfoque leve), sem controles.
  // Ficam atrás do degradê e trocam com fusão conforme a seção visível. h = horizontal (desktop), v = vertical (celular).
  backgroundScenes: [
    { name: "ministracao", sections: ["top"] },
    { name: "drone", sections: ["conferencia"] },
    { name: "adoracao", sections: ["convidados"] },
    { name: "danca", sections: ["electus"] },
    { name: "jesus", sections: ["datas", "duvidas"] },
    { name: "louvor", sections: ["ingressos"] },
  ],
  // Dúvidas frequentes: só fatos confirmados pela organização. "link" vira um atalho discreto ao fim da resposta.
  faq: [
    { q: "Quem pode participar da Conferência Electus?",
      a: "A conferência é aberta a todos que quiserem participar. Ela reúne jovens de diferentes igrejas Renovo para um dia de comunhão e busca por Deus." },
    { q: "Quando acontece a conferência?",
      a: "No sábado, 12 de dezembro de 2026. Os portões abrem às 15h30, a 1ª sessão começa às 16h30 e a 2ª sessão, às 20h." },
    { q: "Onde será realizada?",
      a: "Na Renovo Church, em São Bernardo do Campo, SP. Confira o endereço e a rota antes de sair.",
      link: { label: "Ver endereço", href: "#local" } },
    { q: "O local tem estacionamento?",
      a: "Sim. O local conta com estacionamento gratuito para os participantes." },
    { q: "Como garanto meu ingresso?",
      a: "Clique em qualquer botão de ingresso do site. Você será levado à plataforma oficial de inscrições, onde conclui a compra.",
      ticket: true },
  ] as { q: string; a: string; link?: { label: string; href: string }; ticket?: boolean }[],
  nav: [
    { label: "Conferência", href: "#conferencia" }, { label: "Convidados", href: "#convidados" },
    { label: "Data e local", href: "#datas" }, { label: "Dúvidas", href: "#duvidas" },
  ],
};
export const ticketReady = !TICKET_URL.includes("A_DEFINIR");
