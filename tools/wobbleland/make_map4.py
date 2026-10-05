import os
from PIL import Image, ImageDraw
import numpy as np, random, json, math
from collections import deque
exec(open('anno.py').read())
W, H = 1280, 928
G = 640  # сетка рельефа: считаем на 640 и увеличиваем ×2 (рельеф крупным пикселем, детали — мелким)
src = Image.open(os.path.join(os.path.dirname(__file__), 'source/map.jpg')).convert('RGB')
sm = np.asarray(src.resize((G, int(G * H / W)), Image.BOX)).astype(float) / 255
GH = sm.shape[0]
r, g, b = sm[..., 0], sm[..., 1], sm[..., 2]
mx, mn = sm.max(-1), sm.min(-1); sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
d = np.maximum(mx - mn, 1e-6)
hue = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
water = (((hue > 168) & (hue < 252) & (sat > .17)) | ((b > r + .12) & (b > g)))
def boxsum(m, k):
    p = np.pad(m.astype(np.int32), k); c = p.cumsum(0).cumsum(1); c = np.pad(c, ((1, 0), (1, 0))); n = 2 * k + 1
    return c[n:, n:] - c[:-n, n:] - c[n:, :-n] + c[:-n, :-n]
def majority(m, k=1, it=1):
    for _ in range(it): m = boxsum(m, k) > ((2 * k + 1) ** 2) / 2
    return m
water = majority(water, 1, 3)
water[:3, :] = water[-3:, :] = True; water[:, :3] = water[:, -3:] = True
water[int(GH*.80):, int(G*.86):] = True; water[:int(GH*.13), :int(G*.075)] = True; water[:int(GH*.06), int(G*.93):] = True
water = majority(water, 1, 1)
LAND = {'moss': (126, 160, 92), 'green': (86, 128, 72), 'forest': (52, 92, 62), 'olive': (162, 170, 112), 'sand': (232, 210, 160), 'tan': (212, 184, 138),
        'lemon': (242, 212, 92), 'berry': (196, 74, 70), 'orange': (226, 150, 64), 'pink': (240, 168, 182), 'plaza': (198, 160, 140), 'house': (246, 242, 230), 'ink': (40, 34, 52)}
names = list(LAND); pal = np.array([LAND[n] for n in names]) / 255; I = {n: i for i, n in enumerate(names)}
lab = ((sm[..., None, :] - pal[None, None]) ** 2).sum(-1).argmin(-1)
def mode_filter(lbl, mask, k=1):
    cnt = np.stack([boxsum((lbl == i) & mask, k) for i in range(len(names))]); return np.where(mask, cnt.argmax(0), lbl)
land = ~water
lab = np.where(np.isin(lab, [I['ink'], I['house'], I['plaza'], I['pink']]), I['sand'], lab)
for _ in range(2): lab = mode_filter(lab, land, 3)
lab = mode_filter(lab, land, 1)
# увеличиваем ×2
lab = lab.repeat(2, 0).repeat(2, 1)[:H, :W]; land = land.repeat(2, 0).repeat(2, 1)[:H, :W]; water = ~land
img = np.zeros((H, W, 3), np.uint8)
for n, i in I.items(): img[lab == i] = LAND[n]
dist = np.full((H, W), 9999); q = deque()
for y, x in zip(*np.nonzero(land)): dist[y, x] = 0; q.append((y, x))
while q:
    y, x = q.popleft()
    for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < H and 0 <= nx < W and dist[ny, nx] > dist[y, x] + 1: dist[ny, nx] = dist[y, x] + 1; q.append((ny, nx))
img[water & (dist > 28)] = (40, 86, 164); img[water & (dist <= 28) & (dist > 12)] = (52, 120, 186); img[water & (dist <= 12)] = (86, 176, 200)
foam = water & (dist <= 2) & (dist >= 1) & ((np.indices((H, W)).sum(0) // 2 % 3) == 0); img[foam] = (180, 226, 232)
rnd = random.Random(7)
for _ in range(2600):
    x, y = rnd.randrange(6, W - 8), rnd.randrange(6, H - 6)
    if dist[y, x] > 30: img[y, x - 2:x + 3] = (98, 146, 214); img[y - 1, x + 2:x + 4] = (98, 146, 214)
fr = random.Random(5)
for y, x in zip(*np.nonzero((lab == I['forest']) & land)):
    if fr.random() < .022 and 3 < y < H - 3 and 2 < x < W - 3:
        img[y - 3, x - 1:x + 2] = (88, 140, 80); img[y - 2, x - 2:x + 3] = (60, 110, 64); img[y - 1, x - 2:x + 3] = (40, 80, 50); img[y, x] = (90, 60, 40)
edge = land & (np.roll(water, 1, 0) | np.roll(water, -1, 0) | np.roll(water, 1, 1) | np.roll(water, -1, 1))
img[edge] = (26, 21, 40)
im = Image.fromarray(img); D = ImageDraw.Draw(im); BASE = img.copy()
INK = (26, 21, 40)
# площади
for k, (nm, poly) in SQUARES.items():
    fill, line = ((240, 150, 170), INK) if k == 'dept' else ((90, 100, 96), INK) if k in ('syrf', 'pief') else ((150, 196, 110), INK) if k == 'cham' else ((250, 220, 110), INK) if k == 'lemf' else ((214, 186, 160), INK)
    D.polygon(poly, fill=fill, outline=line)
    if k not in ('dept', 'cham', 'lemf', 'syrf', 'pief'):
        xs = [p[0] for p in poly]; ys = [p[1] for p in poly]
        for yy in range(min(ys), max(ys), 6):
            for xx in range(min(xs) + (yy // 6 % 2) * 3, max(xs), 6):
                if im.getpixel((xx, yy)) == fill: im.putpixel((xx, yy), (196, 166, 142))
    if k == 'lemf':
        for yy in range(min(p[1] for p in poly) + 3, max(p[1] for p in poly), 5):
            for xx in range(min(p[0] for p in poly), max(p[0] for p in poly), 2):
                if im.getpixel((xx, yy)) == fill: im.putpixel((xx, yy + (xx // 2) % 2), (200, 160, 50))
# улицы
for k, (nm, pts) in STREETS.items():
    D.line(pts, fill=(170, 140, 100), width=7, joint='curve')
for k, (nm, pts) in STREETS.items():
    D.line(pts, fill=(244, 230, 196), width=5, joint='curve')
# железная дорога
D.line(RAIL, fill=(110, 20, 16), width=5, joint='curve'); D.line(RAIL, fill=(160, 36, 28), width=3, joint='curve')
for i in range(len(RAIL) - 1):
    (x0, y0), (x1, y1) = RAIL[i], RAIL[i + 1]; L = math.hypot(x1 - x0, y1 - y0)
    for s in range(0, int(L), 6):
        x, y = x0 + (x1 - x0) * s / L, y0 + (y1 - y0) * s / L; im.putpixel((int(x), int(y)), (226, 120, 100))
# высотки
for x, y, w, h, lb in APTS:
    D.rectangle((x - w // 2, y - h // 2, x + w // 2, y + h // 2), fill=(156, 164, 196), outline=INK)
    D.rectangle((x - w // 2 + 1, y - h // 2 + 1, x + w // 2 - 1, y - h // 2 + 3), fill=(120, 128, 168))
    for yy in range(y - h // 2 + 6, y + h // 2 - 2, 4):
        for xx in range(x - w // 2 + 3, x + w // 2 - 2, 4): D.rectangle((xx, yy, xx + 1, yy + 1), fill=(250, 226, 140) if (xx * 7 + yy) % 5 == 0 else (60, 66, 100))
# цифры 3x5
FONT = {'0': '111101101101111', '1': '010110010010111', '2': '111001111100111', '3': '111001111001111', '4': '101101111001001',
        '5': '111100111001111', '6': '111100111101111', '7': '111001010010010', '8': '111101111101111', '9': '111101111001111'}
def digits(x, y, s, col):
    tw = len(s) * 4 - 1; x0 = x - tw // 2
    for i, ch in enumerate(s):
        f = FONT[ch]
        for j in range(15):
            if f[j] == '1': im.putpixel((x0 + i * 4 + j % 3, y + j // 3), col)
ROOFS = [(196, 74, 70), (66, 132, 150), (214, 124, 56), (128, 98, 168), (90, 140, 80), (180, 80, 120)]
skeys = list(STREETS) + list(SQUARES)
def house(x, y, num, street, size):
    roof = ROOFS[skeys.index(street) % len(ROOFS)] if street in skeys else ROOFS[0]
    if size == 3:  # большое здание с плоской крышей (офисы, полиция)
        w, h = 27, 17; x0, y0 = x - w // 2, y - h // 2
        D.rectangle((x0, y0, x0 + w - 1, y0 + h - 1), fill=(246, 242, 230), outline=INK)
        D.rectangle((x0 + 1, y0 + 1, x0 + w - 2, y0 + 4), fill=(70, 96, 170) if street == 'seag' else roof)
        D.line([(x0 + 1, y0 + 5), (x0 + w - 2, y0 + 5)], fill=INK)
        digits(x, y0 + 8, num, INK); return
    w = 13 if size == 1 else 17; rh = 5 if size == 1 else 6; wh = 8 if size == 1 else 10
    x0, y0 = x - w // 2, y - (rh + wh) // 2
    # тень
    D.rectangle((x0 + 2, y0 + rh + 1, x0 + w + 1, y0 + rh + wh + 1), fill=tuple(int(c * .62) for c in BASE[min(H - 1, y), min(W - 1, x)]))
    D.rectangle((x0, y0 + rh, x0 + w - 1, y0 + rh + wh - 1), fill=(246, 242, 230), outline=INK)
    D.polygon([(x0, y0 + rh), (x0 + 3, y0), (x0 + w - 4, y0), (x0 + w - 1, y0 + rh)], fill=roof, outline=INK)
    D.line([(x0 + 4, y0 + 1), (x0 + w - 5, y0 + 1)], fill=tuple(min(255, c + 50) for c in roof))
    if num: digits(x, y0 + rh + 2 + (1 if size == 2 else 0), num, INK)
    else: D.rectangle((x - 1, y0 + rh + 4, x, y0 + rh + wh - 2), fill=(110, 70, 50))
for x, y, num, st, sz in HOUSES: house(x, y, num, st, sz)
# значки
def icon(kind, x, y):
    if kind == 'police':
        D.ellipse((x - 6, y - 6, x + 6, y + 6), fill=(60, 90, 180), outline=INK)
        for p in ((-1,-3),(-1,-2),(-1,-1),(-1,0),(-1,1),(-1,2),(0,-3),(1,-3),(2,-2),(2,-1),(1,0),(0,0)): im.putpixel((x + p[0], y + p[1]), (255, 255, 255))
    elif kind == 'gas':
        D.polygon([(x, y - 6), (x + 6, y + 5), (x - 6, y + 5)], fill=INK); D.polygon([(x, y - 2), (x + 3, y + 3), (x - 3, y + 3)], fill=(240, 200, 80))
    elif kind == 'hospital':
        D.rectangle((x - 6, y - 6, x + 6, y + 6), fill=(255, 255, 255), outline=INK); D.rectangle((x - 1, y - 4, x + 1, y + 4), fill=(210, 50, 50)); D.rectangle((x - 4, y - 1, x + 4, y + 1), fill=(210, 50, 50))
    elif kind == 'hub':
        D.ellipse((x - 6, y - 4, x + 5, y + 5), fill=(160, 100, 60), outline=INK); D.ellipse((x + 2, y - 8, x + 8, y - 2), fill=(160, 100, 60), outline=INK)
        im.putpixel((x + 6, y - 6), INK); D.polygon([(x + 8, y - 5), (x + 11, y - 4), (x + 8, y - 3)], fill=(240, 170, 50)); im.putpixel((x + 5, y - 9), (220, 50, 50)); im.putpixel((x + 6, y - 9), (220, 50, 50))
    elif kind == 'tower':
        D.rectangle((x - 5, y - 16, x + 5, y + 10), fill=(200, 200, 210), outline=INK); D.polygon([(x - 6, y - 16), (x, y - 24), (x + 6, y - 16)], fill=(130, 130, 150), outline=INK)
        for yy in range(y - 13, y + 9, 4):
            for xx in (x - 2, x + 2): D.rectangle((xx - 1, yy - 1, xx, yy), fill=(240, 180, 60) if (yy // 4 + xx) % 2 else (200, 80, 80))
for kind, x, y in POIS:
    if kind in ('park', 'forest'): continue
    icon(kind, x, y)
# станции
for k, (x, y) in STATIONS.items():
    D.rectangle((x - 5, y - 5, x + 5, y + 5), fill=INK); D.rectangle((x - 3, y - 3, x + 3, y + 3), fill=(240, 169, 135))
im.save('map-full.png')
im.resize((W * 2, H * 2), Image.NEAREST).save('map-full-x2.png')
print('ok')
