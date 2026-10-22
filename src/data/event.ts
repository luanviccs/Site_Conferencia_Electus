/**
 * ÚNICA FONTE DE VERDADE. Edite aqui: datas, horários, local, ingresso, atrações, textos.
 * Tudo que estiver como "[A DEFINIR]" / "URL_A_DEFINIR" é placeholder.
 */
// Link oficial de compra (e-inscrição), usado por todos os botões de ingresso do site.
export const TICKET_URL = "https://www.e-inscricao.com/e/w9OD4Z000a8g";

export const eventData = {
  name: "Conferência Electus",
  year: 2026,
  // Um único dia. doors = abertura dos portões (alvo da contagem regressiva); start = início do evento; "ao vivo" até end.
  dates: { doors: "2026-12-12T15:30:00-03:00", start: "2026-12-12T16:30:00-03:00", end: "2026-12-12T23:00:00-03:00" },
  day: { weekday: "SÁBADO", day: "12", month: "DEZ" },
  // Horários do dia, na ordem (aparecem no topo e em "Data e local"): só abertura dos portões e início do evento.
  schedule: [
    { time: "15H30", title: "Abertura dos portões" },
    { time: "16H30", title: "Início do evento" },
  ],
  timesArePreliminary: false,
  ticketUrl: TICKET_URL,
  // Igreja e local do evento: sempre "Cidade Renovo".
  venue: { confirmed: true, name: "Cidade Renovo", address: "Estrada dos Casa, 4285 - Bairro dos Casa, São Bernardo do Campo - SP, 09840-000",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Estrada+dos+Casa+4285+S%C3%A3o+Bernardo+do+Campo+SP", parking: "Estacionamento gratuito" },
  // A igreja (organização): rodapé e organizador nos dados para o Google.
  church: { name: "Cidade Renovo", city: "São Bernardo do Campo, SP",
    address: "Estrada dos Casa, 4285 - Bairro dos Casa, São Bernardo do Campo - SP, 09840-000" },
  instagram: { handle: "@electus.sbc", url: "https://instagram.com/electus.sbc" },
  // Vídeo oficial de divulgação, em destaque logo abaixo do logo no topo, tocando no próprio site (player do site).
  // Arquivos em public/media/ (horizontal 16:9, 2min19s, com narração e legendas): src = 720p (telas a partir de 768px),
  // srcMobile = 540p (celulares), poster = quadro final com a arte "Conferência Electus 2026". Se o arquivo faltar, o site
  // mostra o Reel incorporado do Instagram no mesmo lugar. url = Reel oficial (link discreto "Assistir no Instagram").
  promoVideo: { src: "/media/promo-electus.mp4", srcMobile: "/media/promo-electus-540.mp4", poster: "/media/promo-electus.webp",
    url: "https://www.instagram.com/reel/Ddhwf7pM0ms/" },
  // Letra "e" do Electus (PNG transparente), usada como máscara no cabeçalho e como marca d'água (componente Mark).
  logoSrc: "/logo/electus-e.png",
  verse: { ref: "1 PEDRO 1:2", words: ["ELEITOS", "SANTIFICADOS", "OBEDIENTES", "PURIFICADOS"],
    // Texto bíblico citado na seção "Por que Electus?". version: sigla da tradução (vazio = não mostra).
    text: "Deus, o Pai, os conhecia de antemão e os escolheu, e o Espírito os santificou para a obediência e a purificação pelo sangue de Jesus Cristo. Que vocês tenham cada vez mais graça e paz.",
    version: "" },
  // Tema da conferência 2026 (topo, "A conferência", ingressos e título da página).
  theme: {
    name: "O Despertar",
    tagline: "Escolhidos por Deus, despertados pelo Espírito.",
    slogan: "Conferência Electus: O Despertar",
  },
  // Textos de apresentação: a ligação entre a identidade (Electus) e o tema (O Despertar).
  intro: {
    lines: ["O ministério de jovens", "da Cidade Renovo."],
    lead: "Electus: fomos escolhidos para viver o propósito de Deus. No dia 12 de dezembro, vamos nos reunir para um despertar, retornar à essência do Evangelho e viver por Aquele que nos chamou.",
    // Frase de fechamento, logo abaixo do texto de destaque.
    leadClose: "O Despertar começa quando decidimos não permanecer adormecidos.",
    blocks: [
      { label: "Quem somos", text: "Fomos escolhidos por Deus, chamados pelo nome e separados para o Seu propósito. Somos Electus: uma geração cuja identidade está em Cristo." },
      { label: "O que nos desperta", text: "O maior perigo não é deixar de caminhar, mas se acostumar a viver adormecido. É hora de romper com a indiferença, abandonar as distrações e voltar ao primeiro amor." },
      { label: "Por que despertar", text: "Porque há um chamado que exige uma resposta. Uma geração precisa se levantar, uma chama precisa arder novamente e uma vida inteira precisa ser colocada aos pés de Jesus." },
    ],
  },
  vision: {
    title: "Por que Electus?",
    text: "Electus carrega a essência daquilo para o qual fomos chamados. Inspirado em 1 Pedro 1:2 significa que somos Eleitos pelo Pai. Santificados pelo Espírito. Obedientes ao Filho. Purificados pelo Seu sangue.",
    text2: "Ser Electus é compreender que fomos alcançados para viver uma vida que O glorifique.",
    // Frase de efeito do tema, logo abaixo das quatro palavras.
    callout: "Santificados para obedecer: o despertar da igreja eleita.",
  },
  speakers: [
    // Fotos em public/images/speakers/. shape: "wide" (foto horizontal, ex.: banda completa) ou "tall" (retrato).
    // w/h = dimensões reais do arquivo; pos = enquadramento (object-position).
    // description: texto oficial dos cards de divulgação (aparece na fonte pixel).
    { id: "dunamis", name: "Dunamis Music", description: "A Dunamis Music é o selo musical do Dunamis Movement, um proeminente movimento cristão para-eclesiástico atuante no Brasil. O movimento que deu origem ao braço musical foi liderado e fundado pelo pastor e missionário Teófilo (Téo) Hayashi em abril de 2008. Originalmente, o foco era pregar o Evangelho para jovens universitários, e hoje a missão descrita pela organização é buscar despertar essa geração para estabelecer a cultura do Reino de Deus na terra e transformar a sociedade.",
      instagram: { handle: "@dunamis.music", url: "https://www.instagram.com/dunamis.music/" },
      image: "/images/speakers/dunamis-music.webp", w: 1200, h: 800, shape: "wide", pos: "50% 58%", zoom: 1 },
    { id: "denio", name: "Pr. Dênio Lara", description: "Pastor, escritor e líder da Igreja Dínamus, dedica seu ministério a inspirar uma geração a viver o Evangelho de forma autêntica e prática. Com mensagens sobre vida cristã, liderança e maturidade espiritual, tem impactado vidas e encorajado pessoas a aprofundarem sua caminhada com Cristo.",
      instagram: { handle: "@deniolarajr", url: "https://www.instagram.com/deniolarajr/" },
      image: "/images/speakers/denio-lara.webp", w: 900, h: 1600, shape: "tall", pos: "50% 36%", zoom: 1 },
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
      a: "No sábado, 12 de dezembro de 2026. Os portões abrem às 15h30 e o evento começa às 16h30." },
    { q: "Onde será realizada?",
      a: "Na Cidade Renovo, em São Bernardo do Campo, SP. Confira o endereço e a rota antes de sair.",
      link: { label: "Ver endereço", href: "#local" } },
    { q: "O local tem estacionamento?",
      a: "Sim. O local conta com estacionamento gratuito para os participantes." },
    { q: "Tem algum local para comer perto?",
      a: "Sim, o evento contará com praça de alimentação no local." },
    { q: "Crianças pagam ingresso?",
      a: "Crianças a partir de 12 anos pagam o valor integral do ingresso. Abaixo dessa idade, pagam meia-entrada (exceto crianças de colo). Consulte os valores de entrada em nossa bilheteria." },
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
