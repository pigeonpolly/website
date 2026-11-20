#!/usr/bin/env python3
"""Kontaktlapa no PNG: python3 a1-pack/tools/sheet.py <izvade.png> <kolonnas> <platums> <attēli…>
Piem.: python3 a1-pack/tools/sheet.py lapa.png 4 480 shots/d-*.png"""
import sys
from PIL import Image

out, cols, w = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
ims = [Image.open(f).convert("RGB") for f in sys.argv[4:]]
ims = [im.resize((w, round(im.height * w / im.width))) for im in ims]
hh = max(i.height for i in ims)
rows = (len(ims) + cols - 1) // cols
S = Image.new("RGB", (cols * (w + 8) - 8, rows * (hh + 8) - 8), "#d9d8d3")
for i, im in enumerate(ims):
    S.paste(im, ((i % cols) * (w + 8), (i // cols) * (hh + 8)))
S.save(out)
print(out, len(ims))
