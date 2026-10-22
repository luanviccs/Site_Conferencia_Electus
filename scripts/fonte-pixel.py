"""
Fonte pixel do site (Our Arcade Games) com acentos do português, pontuação, @, setas, ✦ e parênteses,
desenhados no mesmo grid de pixels da fonte original (células de 128 unidades).

O arquivo original (Our-Arcade-Games.ttf, FontStruct) só tem A–Z, a–z, 0–9 e espaço.

Uso:
    pip install fonttools brotli
    python scripts/fonte-pixel.py caminho/Our-Arcade-Games.ttf public/fonts

Gera our-arcade-games.ttf e our-arcade-games.woff2 (este é o usado pelo site) na pasta de saída.
Para acrescentar um caractere: adicione uma entrada em `punct` (desenho em linhas de "X" e ".") e rode de novo.
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen

C = 128
f = TTFont(sys.argv[1])
gs = f.getGlyphSet()
cmap = f.getBestCmap()
glyf, hmtx = f["glyf"], f["hmtx"]
order = f.getGlyphOrder()
new = {}  # name -> (glyph, adv)

def rects(pen, cells, dx=0):
    for (x, y) in cells:
        x0, y0 = dx + x * C, y * C
        pen.moveTo((x0, y0)); pen.lineTo((x0, y0 + C)); pen.lineTo((x0 + C, y0 + C)); pen.lineTo((x0 + C, y0)); pen.closePath()

def make(name, cells, adv, base=None, dx=0):
    pen = TTGlyphPen(gs)
    if base: gs[base].draw(pen)
    rects(pen, cells, dx)
    new[name] = (pen.glyph(), adv)

# accents: row 8 empty, rows 9-10 above the 8-row cap height; centred on 5-cell letters
acc = {
    "acute": [(2, 9), (3, 10)],
    "grave": [(2, 9), (1, 10)],
    "circ": [(1, 9), (2, 10), (3, 9)],
    "tilde": [(0, 9), (1, 10), (2, 10), (3, 9), (4, 10)],
    "dier": [(1, 9), (3, 9)],
    "ced": [(2, -1), (1, -2), (2, -2)],
}
letters = {"A": "acute grave circ tilde", "E": "acute grave circ", "I": "acute grave circ", "O": "acute grave circ tilde",
           "U": "acute grave circ dier", "C": "ced"}
uni = {("A", "acute"): 0xC1, ("A", "grave"): 0xC0, ("A", "circ"): 0xC2, ("A", "tilde"): 0xC3,
       ("E", "acute"): 0xC9, ("E", "grave"): 0xC8, ("E", "circ"): 0xCA,
       ("I", "acute"): 0xCD, ("I", "grave"): 0xCC, ("I", "circ"): 0xCE,
       ("O", "acute"): 0xD3, ("O", "grave"): 0xD2, ("O", "circ"): 0xD4, ("O", "tilde"): 0xD5,
       ("U", "acute"): 0xDA, ("U", "grave"): 0xD9, ("U", "circ"): 0xDB, ("U", "dier"): 0xDC, ("C", "ced"): 0xC7}
mapping = {}
for L, accs in letters.items():
    base = cmap[ord(L)]
    for a in accs.split():
        name = f"{L}{a}"
        make(name, acc[a], hmtx[base][0], base=base)
        cp = uni[(L, a)]
        mapping[cp] = name; mapping[cp + 0x20] = name  # lowercase = same caps glyph, like the original font

# punctuation (rows 0-7 = cap height)
punct = {
    "period": ([(0, 0)], 256, [0x2E]),
    "comma": ([(1, 0), (0, -1)], 384, [0x2C]),
    "colon": ([(0, 1), (0, 5)], 256, [0x3A]),
    "semicolon": ([(1, 1), (0, 0), (1, 5)], 384, [0x3B]),
    "exclam": ([(0, 0)] + [(0, y) for y in range(2, 8)], 256, [0x21]),
    "question": ([(1, 7), (2, 7), (3, 7), (0, 6), (4, 6), (4, 5), (3, 4), (2, 3), (2, 2), (2, 0)], 768, [0x3F]),
    "hyphen": ([(x, 4) for x in range(4)], 640, [0x2D]),
    "endash": ([(x, 4) for x in range(5)], 768, [0x2013]),
    "emdash": ([(x, 4) for x in range(7)], 1024, [0x2014]),
    "middot": ([(0, 4)], 256, [0xB7]),
    "quotesingle": ([(0, 6), (0, 7)], 256, [0x27, 0x2019, 0x2018]),
    "quotedbl": ([(0, 6), (0, 7), (2, 6), (2, 7)], 512, [0x22, 0x201C, 0x201D]),
    "slash": ([(0, 0), (0, 1), (1, 2), (1, 3), (2, 4), (2, 5), (3, 6), (3, 7)], 640, [0x2F]),
    "plus": ([(2, 2), (2, 3), (2, 5), (2, 6)] + [(x, 4) for x in range(5)], 768, [0x2B]),
    "ordfeminine": ([(0, 4), (1, 4), (2, 4), (0, 6), (1, 6), (2, 6), (2, 7), (0, 7), (1, 7)], 512, [0xAA]),
    "ordmasculine": ([(0, 4), (1, 4), (2, 4), (0, 6), (2, 6), (0, 7), (1, 7), (2, 7), (0, 5), (2, 5)], 512, [0xBA]),
}
# replace ordinal cells with a cleaner layout: small box rows 5-7, underline row 3
punct["ordfeminine"] = ([(0, 7), (1, 7), (2, 6), (0, 5), (1, 5), (2, 5), (0, 6), (0, 3), (1, 3), (2, 3)], 512, [0xAA])
punct["ordmasculine"] = ([(0, 7), (1, 7), (2, 7), (0, 6), (2, 6), (0, 5), (1, 5), (2, 5), (0, 3), (1, 3), (2, 3)], 512, [0xBA])

def grid(rows, top):
    return [(x, top - i) for i, r in enumerate(rows) for x, ch in enumerate(r) if ch == "X"]
punct["at"] = (grid([".XXX.", "X...X", "X.XXX", "X.X.X", "X.XXX", "X....", "X....", ".XXXX"], 7), 768, [0x40])
punct["arrowright"] = (grid(["...X..", "....X.", "XXXXXX", "....X.", "...X.."], 6), 896, [0x2192])
punct["arrowupright"] = (grid(["..XXX", "...XX", "..X.X", ".X...", "X...."], 6), 768, [0x2197])
punct["star4"] = (grid(["...X...", "...X...", "..XXX..", "XXXXXXX", "..XXX..", "...X...", "...X..."], 7), 1024, [0x2726])
punct["parenleft"] = (grid(["..X", ".X.", "X..", "X..", "X..", "X..", ".X.", "..X"], 7), 512, [0x28])
punct["parenright"] = (grid(["X..", ".X.", "..X", "..X", "..X", "..X", ".X.", "X.."], 7), 512, [0x29])
for name, (cells, adv, cps) in punct.items():
    make(name, cells, adv)
    for cp in cps: mapping[cp] = name
# non-breaking space = space
mapping[0xA0] = cmap[0x20]

for name, (g, adv) in new.items():
    glyf[name] = g
    if name not in order: order.append(name)
    g.recalcBounds(glyf)
    hmtx[name] = (adv, g.xMin if g.numberOfContours else 0)
f.setGlyphOrder(order); glyf.glyphOrder = order
for t in f["cmap"].tables:
    if t.isUnicode():
        t.cmap.update(mapping)
f["maxp"].numGlyphs = len(order)
# room for accents/cedilla so nothing is clipped; layout metrics are pinned in CSS (@font-face *-override)
os2 = f["OS/2"]; os2.usWinAscent = 1408; os2.usWinDescent = 256
f["post"].formatType = 3.0
f["head"].fontRevision = 1.1
out = sys.argv[2]
f.save(out + "/our-arcade-games.ttf")
f.flavor = "woff2"; f.save(out + "/our-arcade-games.woff2")
print(len(order), "glyphs")
