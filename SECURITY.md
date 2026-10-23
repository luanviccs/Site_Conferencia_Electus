# Segurança

## Superfície do site

O site da Conferência Electus é **estático**: não tem servidor próprio, banco de dados, login, formulários, cookies próprios
nem chaves de API. A compra de ingressos acontece na plataforma externa (Sympla), aberta em nova aba.

## Cabeçalhos HTTP

Definidos em [`vercel.json`](vercel.json) para todas as páginas e aplicados também no `npm run preview`, para teste local:

| Cabeçalho | Valor | Protege contra |
|---|---|---|
| `Content-Security-Policy` | só recursos do próprio site, Google Fonts e Instagram (vídeo de reserva) | injeção de scripts e conteúdo de terceiros |
| `X-Frame-Options` | `DENY` (+ `frame-ancestors 'none'`) | o site ser embutido em outra página (clickjacking) |
| `X-Content-Type-Options` | `nosniff` | arquivos interpretados como outro tipo |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | vazamento do endereço completo para outros sites |
| `Permissions-Policy` | câmera, microfone, localização, pagamento e USB desligados | uso indevido de recursos do aparelho |
| `Cross-Origin-Opener-Policy` | `same-origin` | outras janelas controlarem a página |

### Origens externas permitidas

| Origem | Por quê |
|---|---|
| `fonts.googleapis.com`, `fonts.gstatic.com` | Fontes Big Shoulders Display e Instrument Sans |
| `www.instagram.com` | Script e moldura do Reel oficial, usados só se o vídeo do site não carregar |
| `www.googletagmanager.com`, `*.google-analytics.com`, `*.analytics.google.com` | Google Analytics 4, carregado só depois que o visitante aceita os cookies |

> [!IMPORTANT]
> Ao incluir um serviço novo (analytics, mapa embutido, outro vídeo), acrescente a origem na
> `Content-Security-Policy` do `vercel.json`. Do contrário, o navegador bloqueia o recurso.
> Teste com `npm run build` seguido de `npm run preview`, conferindo o console do navegador.

## Boas práticas no código

- Links que abrem em nova aba sempre com `rel="noopener noreferrer"`.
- Nenhum uso de `innerHTML`, `eval` ou `dangerouslySetInnerHTML`.
- Os dados estruturados (JSON-LD) vêm só de `src/data/event.ts`, sem entrada de usuário.
- Nunca commitar arquivos `.env`, chaves ou certificados (bloqueados no `.gitignore`).

## Dependências

- `package-lock.json` versionado: o CI instala com `npm ci`, exatamente as mesmas versões.
- O CI roda `npm audit --omit=dev --audit-level=high` a cada envio.
- Ferramentas de desenvolvimento (Vite, esbuild) ficam em `devDependencies` e não vão para o site publicado.

## Como reportar

Encontrou um problema de segurança? Fale com a equipe pelo Instagram [@electus.sbc](https://instagram.com/electus.sbc)
ou abra uma issue **sem detalhes que permitam explorar a falha**, pedindo um contato privado.
