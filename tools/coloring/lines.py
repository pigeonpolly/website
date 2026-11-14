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
ap.add_argument('--min', type=int, default=400)      # убрать кусочки меньше (px)
ap.add_argument('--blob', type=int, default=8)       # толщина линии ×4 после утончения (0 — без утончения) (Алина 14.11: «слишком много чёрных пятен»)
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
  '-morphology', 'Erode', 'Disk:1', '-blur', '0x1.2', '-threshold', '55%', tmp], check=True)
# чёрные пятна (Алина 14.11): все линии и заливки утончаются до осевой (Zhang–Suen) и рисуются одной толщиной
def thin(m):
    m = np.pad(m.astype(np.uint8), 1)
    while True:
        changed = False
        for step in (0, 1):
            P = [np.roll(np.roll(m, -dy, 0), -dx, 1) for dy, dx in ((-1, 0), (-1, 1), (0, 1), (1, 1), (1, 0), (1, -1), (0, -1), (-1, -1))]
            B = sum(P); A = sum(((P[i] == 0) & (P[(i + 1) % 8] == 1)) for i in range(8))
            c = (m == 1) & (B >= 2) & (B <= 6) & (A == 1)
            c &= ((P[0] * P[2] * P[4]) == 0) & ((P[2] * P[4] * P[6]) == 0) if step == 0 else ((P[0] * P[2] * P[6]) == 0) & ((P[0] * P[4] * P[6]) == 0)
            if c.any(): m[c] = 0; changed = True
        if not changed: return m[1:-1, 1:-1].astype(bool)
def nb(m): return sum(np.roll(np.roll(m, dy, 0), dx, 1) for dy in (-1, 0, 1) for dx in (-1, 0, 1) if dy or dx)
if a.blob:
    # мелкие белые дырки внутри пятен — закрасить (иначе после утончения петля = чёрная точка), мелкие чёрные крошки — убрать
    subprocess.run(['convert', tmp, '-define', 'connected-components:area-threshold=350', '-define', 'connected-components:mean-color=true',
      '-connected-components', '8', '-threshold', '50%', tmp], check=True)
    m = np.asarray(Image.open(tmp).convert('L')) < 128
    sk = thin(m).astype(np.uint8)
    for _ in range(8): sk[(sk == 1) & (nb(sk) <= 1)] = 0   # «волоски»: срезать короткие хвостики
    sk = sk.astype(bool)
    Image.fromarray(np.where(sk, 0, 255).astype(np.uint8)).save(tmp)
    subprocess.run(['convert', tmp, '-negate', '-morphology', 'Dilate', f'Disk:{a.blob / 4}',
      '-define', f'connected-components:area-threshold={a.min // 3}', '-define', 'connected-components:mean-color=true', '-connected-components', '8',
      '-negate', '-blur', '0x0.7', '-threshold', '50%', a.out], check=True)
else: os.replace(tmp, a.out)
if os.path.exists(tmp): os.remove(tmp)
