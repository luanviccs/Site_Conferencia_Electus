# Mídia: vídeos, fotos, logo e fonte

Especificações dos arquivos em `public/` e as receitas usadas para gerá-los.
As receitas usam [FFmpeg](https://ffmpeg.org/) (vídeo) e Python com Pillow/fontTools (imagens e fonte).

[← voltar ao README](../README.md)

---

## Resumo

| Tipo | Pasta | Formato | Tamanho alvo |
|---|---|---|---|
| Vídeos de fundo | `public/media/bg-{nome}-h.mp4` / `-v.mp4` | H.264, sem áudio, 24 fps, 960×540 / 540×960 | ~200–750 KB |
| Capas dos vídeos de fundo | `public/media/bg-{nome}-h.webp` / `-v.webp` | WebP | ~10–20 KB |
| Vídeo oficial | `public/media/promo-electus.mp4` / `-540.mp4` | H.264 + AAC, 30 fps, 720p / 540p, `faststart` | ~23 MB / ~13 MB |
| Capa do vídeo oficial | `public/media/promo-electus.webp` | WebP, quadro final do vídeo | ~55 KB |
| Galeria | `public/images/electus/{nome}.webp` + `-960.webp` | WebP 1800px + 960px | 15–230 KB |
| Compartilhamento | `public/images/electus/og.jpg` | JPEG 1200×630 | ~150 KB |
| Convidados | `public/images/speakers/` | WebP | < 120 KB |
| Logo oficial | `public/logo/conferencia-electus.svg` | SVG (613×401) | 374 KB |
| Fonte pixel | `public/fonts/our-arcade-games.woff2` | WOFF2 | ~2 KB |

---

## Vídeos de fundo

Ficam atrás do conteúdo, então são escurecidos, sem cor (tom azul) e levemente desfocados **no próprio arquivo**.

```bash
LOOK="hue=s=0,eq=contrast=1.08:gamma=1.35,curves=r='0/0.06 1/0.80':g='0/0.07 1/0.83':b='0/0.20 1/1',gblur=sigma=1.6"
```

```bash
ffmpeg -i original.mov -an -vf "fps=24,scale=960:540:flags=lanczos,$LOOK" -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 30 -preset slow -movflags +faststart public/media/bg-NOME-h.mp4
```

```bash
ffmpeg -i original.mov -an -vf "fps=24,scale=-2:960:flags=lanczos,crop=540:960,$LOOK" -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 30 -preset slow -movflags +faststart public/media/bg-NOME-v.mp4
```

```bash
ffmpeg -i public/media/bg-NOME-h.mp4 -frames:v 1 -c:v libwebp -quality 70 public/media/bg-NOME-h.webp
```

Depois, associe o vídeo a uma seção em `backgroundScenes` (`src/data/event.ts`).

## Vídeo oficial

```bash
ffmpeg -i original.mp4 -c:v libx264 -profile:v high -pix_fmt yuv420p -preset slow -crf 26 -maxrate 1600k -bufsize 3200k -c:a aac -b:a 128k -ac 2 -movflags +faststart public/media/promo-electus.mp4
```

```bash
ffmpeg -i original.mp4 -vf "scale=960:-2:flags=lanczos" -c:v libx264 -profile:v high -pix_fmt yuv420p -preset slow -crf 28 -maxrate 900k -bufsize 1800k -c:a aac -b:a 96k -ac 2 -movflags +faststart public/media/promo-electus-540.mp4
```

```bash
ffmpeg -ss 138.3 -i original.mp4 -frames:v 1 -c:v libwebp -quality 80 public/media/promo-electus.webp
```

> [!TIP]
> `-movflags +faststart` coloca o índice no começo do arquivo: o vídeo começa a tocar antes de baixar inteiro.

## Fotos

Cada foto da galeria tem duas versões: 1800px (telas grandes) e 960px (celulares). Exemplo com Pillow:

```python
from PIL import Image, ImageOps
im = ImageOps.exif_transpose(Image.open("foto.jpg")).convert("RGB")
w, h = im.size
im.resize((1800, round(h * 1800 / w)), Image.LANCZOS).save("public/images/electus/nome.webp", "WEBP", quality=68, method=6)
im.resize((960,  round(h * 960 / w)),  Image.LANCZOS).save("public/images/electus/nome-960.webp", "WEBP", quality=72, method=6)
```

- Fotos com o assunto pequeno no quadro rendem mais com um corte mais fechado antes de exportar.
- Ajuste o enquadramento final com `pos` em `event.ts`.

## Logo oficial

O SVG exportado do editor tinha 6 MB porque repetia 18 vezes a mesma imagem embutida. O script mantém uma cópia, reaproveita
com `<use>` e recorta o espaço vazio, com o mesmo visual (diferença de 0 pixel):

```bash
python scripts/otimizar-logo.py "Logo conferência.svg" public/logo/conferencia-electus.svg
```

Se o arquivo de origem mudar de estrutura, o script recusa (confere as 18 cópias) em vez de gerar um logo errado.

## Fonte pixel

O arquivo original *Our Arcade Games* (FontStruct) só tem A–Z, a–z, 0–9 e espaço. O script desenha, no mesmo grid de
pixels, os acentos do português (Á À Â Ã É Ê Í Ó Ô Õ Ú Ç…), a pontuação (`. , : ; ! ? - – — · ' " / + ( )`), `@`, `→ ↗ ✦` e `ª º`.

```bash
pip install fonttools brotli
```

```bash
python scripts/fonte-pixel.py caminho/Our-Arcade-Games.ttf public/fonts
```

Para acrescentar um caractere, adicione uma entrada em `punct` no script, desenhada com linhas de `X` e `.`:

```python
punct["parenleft"] = (grid(["..X", ".X.", "X..", "X..", "X..", "X..", ".X.", "..X"], 7), 512, [0x28])
#                          desenho (linha de cima → baixo), linha do topo, largura, códigos Unicode
```
