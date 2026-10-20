# Conferência Electus 2026
`npm i && npm run dev` · build: `npm run build`
Edite TUDO em `src/data/event.ts`: link de compra (`TICKET_URL`, usado por todos os botões), data e horários (`dates`/`day`/`schedule`), local (`venue`), convidados (`speakers`: nome, descrição, Instagram), dúvidas (`faq`) e textos (`intro`).
Imagens: `public/images/speakers` (convidados) e `public/images/electus` (fotos reais, todas reunidas na galeria de "Por que Electus?", ver `photos` no event.ts; `og.jpg` = imagem de compartilhamento).
Logo: public/logo/electus-e.png (letra "e", transparente).
Fontes: títulos e subtítulos em Big Shoulders Display; textos em Instrument Sans. Destaque pontual (só o tema "O Despertar" no topo, classe `font-pixel`): `public/fonts/our-arcade-games.woff2` (Our Arcade Games, com acentos e pontuação acrescentados).
Fotos em `public/images/electus/` têm versão `-960.webp` (celulares); ao trocar uma foto, gere também a versão reduzida.
