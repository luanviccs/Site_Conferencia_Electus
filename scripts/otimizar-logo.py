"""
Otimiza o SVG oficial do logo da conferência sem perder nada da arte (diferença de 0 pixel conferida no navegador).

Uso:
    python scripts/otimizar-logo.py "Logo conferência.svg" public/logo/conferencia-electus.svg

O arquivo exportado do editor tinha 6 MB porque repetia 18 vezes a mesma imagem PNG (o degradê das letras).
"""
# Logo oficial: mesma arte, sem perdas. (1) as 18 cópias idênticas da imagem embutida viram 1 <image> em <defs> + 18 <use>;
# (2) viewBox recortado nas bordas visíveis do logo (medidas no navegador: x 417–1022, y 209–602) com 4 un. de folga.
import sys, re
src, out = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
tags = re.findall(r'<image\b[^>]*/>', s)
hrefs = {re.search(r'xlink:href="([^"]+)"', t).group(1) for t in tags}
assert len(tags) == 18 and len(hrefs) == 1, (len(tags), len(hrefs))
data = hrefs.pop()
for t in set(tags):
    attrs = re.sub(r'\s*xlink:href="[^"]+"', '', t)[len('<image'):-2]
    attrs = re.sub(r'\s*(width|height|preserveAspectRatio)="[^"]*"', '', attrs)
    s = s.replace(t, f'<use{attrs} xlink:href="#logo-grad"/>')
s = s.replace('<defs>', f'<defs><image id="logo-grad" width="1112" height="944" preserveAspectRatio="xMidYMid meet" xlink:href="{data}"/>', 1)
x0, y0, x1, y1, pad = 417, 209, 1022, 602, 4
vb = f'{x0-pad} {y0-pad} {x1-x0+2*pad} {y1-y0+2*pad}'
s, n = re.subn(r'width="1920"([^>]*?)viewBox="0 0 1440 809.999993"([^>]*?)height="1080"',
               lambda m: f'width="{x1-x0+2*pad}"{m.group(1)}viewBox="{vb}"{m.group(2)}height="{y1-y0+2*pad}"', s, count=1)
assert n == 1
s = s.replace('<svg ', '<svg role="img" aria-label="Conferência Electus" ', 1)
open(out, 'w', encoding='utf-8').write(s)
print(len(s), vb, s.count('<use'), s.count('<image'))
