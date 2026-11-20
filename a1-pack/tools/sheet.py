#!/usr/bin/env python3
"""Kontaktlapa pārskatam: PDF → viena PNG (slaidi vai lapas).
  python3 a1-pack/tools/sheet.py <fails.pdf> <izvade.png> [--cols 4] [--dpi 40] [--pages 1-12]"""
import subprocess, sys, tempfile
from pathlib import Path
from PIL import Image

a = sys.argv
pdf, out = a[1], a[2]
cols = int(a[a.index("--cols") + 1]) if "--cols" in a else 4
dpi = a[a.index("--dpi") + 1] if "--dpi" in a else "40"
with tempfile.TemporaryDirectory() as t:
    cmd = ["pdftoppm", "-r", dpi, "-png"]
    if "--pages" in a:
        f, l = a[a.index("--pages") + 1].split("-")
        cmd += ["-f", f, "-l", l]
    subprocess.run(cmd + [pdf, f"{t}/p"], check=True)
    ims = [Image.open(p) for p in sorted(Path(t).glob("p-*.png"))]
    w, h = max(i.width for i in ims), max(i.height for i in ims)
    rows = (len(ims) + cols - 1) // cols
    S = Image.new("RGB", (cols * (w + 8), rows * (h + 8)), "#ccc")
    for i, im in enumerate(ims):
        S.paste(im, ((i % cols) * (w + 8), (i // cols) * (h + 8)))
    S.save(out)
    print(out, len(ims))
