# Контуры для раскраски из цветного арта: тонкие тёмные линии оригинала + границы плоских цветовых пятен.
# python3 tools/coloring/lines.py ВХОД ВЫХОД.png [--k 8] [--edges 1] …
import argparse, subprocess, os, numpy as np
from PIL import Image, ImageFilter
ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('out')
ap.add_argument('--k', type=int, default=8)          # цветов в упрощении (меньше — крупнее пятна)
ap.add_argument('--dark', type=float, default=0.6)   # линия не светлее (0..1)
ap.add_argument('--bh', type=int, default=11)        # ширина «тонкого» (px при 2000)
ap.add_argument('--bht', type=float, default=0.10)   # насколько линия темнее соседей
ap.add_argument('--soft', type=int, default=3)       # проходов сглаживания перед упрощением
ap.add_argument('--mode', type=int, default=15)      # «склейка» мелких пятен
ap.add_argument('--edges', type=int, default=1)      # 0 — только линии оригинала
ap.add_argument('--ec', type=float, default=0.22)    # перепад светлоты для границы пятен
ap.add_argument('--min', type=int, default=250)      # убрать кусочки меньше (px)
a = ap.parse_args()
im = Image.open(a.src).convert('RGB')
s = 2000 / max(im.size); im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
gi = im.convert('L').filter(ImageFilter.MedianFilter(3))
# линия = тонкое тёмное относительно соседей (black-hat: закрытие минус оригинал), а не тёмная заливка
cl = gi.filter(ImageFilter.MaxFilter(a.bh)).filter(ImageFilter.MinFilter(a.bh))
bh = (np.asarray(cl, dtype=np.float32) - np.asarray(gi, dtype=np.float32)) / 255
line = (bh > a.bht) & (np.asarray(gi) < 255 * a.dark)
if a.edges:
    sm = im
    for _ in range(a.soft): sm = sm.filter(ImageFilter.MedianFilter(9))
    q = np.asarray(sm.quantize(a.k, method=Image.Quantize.MEDIANCUT).filter(ImageFilter.ModeFilter(a.mode)))
    e = np.zeros_like(line)
    e[:, 1:] |= q[:, 1:] != q[:, :-1]; e[1:, :] |= q[1:, :] != q[:-1, :]
    # только чёткие границы: перепад светлоты рядом больше --ec (градиенты неба и акварельные разводы не в счёт)
    L = sm.convert('L').filter(ImageFilter.GaussianBlur(2))
    ct = (np.asarray(L.filter(ImageFilter.MaxFilter(7)), dtype=np.float32) - np.asarray(L.filter(ImageFilter.MinFilter(7)), dtype=np.float32)) / 255
    line |= e & (ct > a.ec)
tmp = a.out + '.tmp.png'
Image.fromarray(np.where(line, 0, 255).astype(np.uint8)).save(tmp)
# убрать мелочь (связные компоненты), сгладить и чуть утолщить линию до печатной
subprocess.run(['convert', tmp, '-negate', '-define', f'connected-components:area-threshold={a.min}',
  '-define', 'connected-components:mean-color=true', '-connected-components', '8', '-negate',
  '-morphology', 'Erode', 'Disk:1', '-blur', '0x1.2', '-threshold', '55%', a.out], check=True)
os.remove(tmp)
