# «Обо мне»: мастерская Алины — пиксельная картинка в рисовке, которую Алина выбрала 25.10.2026 (фото → крупные пятна цвета).
# Основа — фото угла (_held/lab/shelf.webp, кадр 960x720): рамки на стене, стеллаж с фигурками и тыквами, пробковая доска, лампа, окно.
# Дорисовано: Алина со спины за столом (рыжие кудри, фиолетовое худи, контровой свет от окна), гирлянда на доске, вечерний тёплый свет.
# Потом: медианный фильтр → уменьшение → 56 цветов без дизеринга → крупные пиксели.
# python3 tools/rooms/lab.py → site/images/about/lab.png (400x300) и lab@3x.png
import os, math, random
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageChops
import numpy as np

ROOT = os.path.join(os.path.dirname(__file__), '../..')
OUT = os.path.join(ROOT, 'site/images/about'); os.makedirs(OUT, exist_ok=True)
rnd = random.Random(11)
img = Image.open(os.path.join(ROOT, '_held/lab/shelf.webp')).convert('RGB').crop((0, 280, 960, 1000))
W, H = img.size                                    # 960x720
yy, xx = np.mgrid[0:H, 0:W].astype(float)


def layer_paste(base, rgb, alpha):
    a = alpha[..., None]
    return base * (1 - a) + rgb * a


def blur(a, r):
    return np.asarray(Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r))).astype(float) / 255


def mask(draw, r=1.2):
    m = Image.new('L', (W, H), 0); draw(ImageDraw.Draw(m)); return np.asarray(m.filter(ImageFilter.GaussianBlur(r))).astype(float) / 255


# ---------- вечерний свет: чуть темнее и теплее, лампа и окно ярче ----------
a = np.asarray(img).astype(float) / 255
a = a ** 1.12 * np.array([1.06, .98, .86])
lamp = np.clip(1 - np.hypot(xx - 850, (yy - 450) * 1.2) / 330, 0, 1) ** 2
a = a + lamp[..., None] * np.array([.22, .16, .08])
a = np.clip(a, 0, 1)

# ---------- гирлянда на пробковой доске (провод; лампочки — после пикселизации) ----------
def sag(xa, ya, xb, yb, s, n): return [(xa + (xb - xa) * i / n, ya + (yb - ya) * i / n + s * math.sin(math.pi * i / n)) for i in range(n + 1)]
wire = sag(196, 248, 330, 262, 18, 50) + sag(330, 262, 466, 262, 16, 50)[1:] + sag(466, 262, 478, 380, -6, 40)[1:]
wm = mask(lambda d: d.line([(round(x), round(y)) for x, y in wire], fill=255, width=2), .6)
a = layer_paste(a, np.array([.22, .18, .15]), wm * .9)
BULBS = [(x, y + 4) for x, y in wire[4::11]]

# ---------- Алина со спины: худи ----------
CX = 360                                           # центр фигуры
hood_pts = [(96, 720), (130, 694), (200, 672), (270, 662), (450, 662), (520, 672), (590, 694), (624, 720)]
hm = mask(lambda d: d.polygon(hood_pts, fill=255), 1.5)
t = np.clip((xx - 96) / 528, 0, 1)                # свет из окна справа
base = (np.array([.30, .17, .42])[None, None] * (1 - t[..., None]) + np.array([.56, .38, .70])[None, None] * t[..., None])
base = base * (1 - .18 * np.clip((yy - 662) / 58, 0, 1))[..., None]
for x0, x1 in ((220, 250), (300, 318), (452, 470), (510, 540)):          # складки
    f = mask(lambda d: d.line([(x0, 680), (x1, 720)], fill=255, width=7), 6)
    base = base * (1 - .22 * f[..., None])
rim = mask(lambda d: d.line([(520, 672), (590, 694), (624, 720)], fill=255, width=6), 4)
base = base + rim[..., None] * np.array([.30, .22, .18])
noise = np.random.default_rng(3).normal(0, .018, (H, W, 1))
a = layer_paste(a, np.clip(base + noise, 0, 1), hm)
# капюшон, собранный у шеи
km = mask(lambda d: d.ellipse((CX - 104, 630, CX + 112, 726), fill=255), 2)
kb = (np.array([.36, .21, .50])[None, None] * (1 - t[..., None]) + np.array([.62, .44, .76])[None, None] * t[..., None])
kb = kb * (1 - .30 * np.clip(1 - np.hypot((xx - CX) / 112, (yy - 680) / 36), 0, 1) ** .5)[..., None]
inner = mask(lambda d: d.ellipse((CX - 66, 650, CX + 72, 706), fill=255), 6)
kb = kb * (1 - .35 * inner[..., None])
a = layer_paste(a, np.clip(kb + noise, 0, 1), km)

# ---------- рыжие кудри ----------
HC = (CX - 4, 604)                                 # центр шапки волос
hal = mask(lambda d: d.ellipse((HC[0] - 100, HC[1] - 90, HC[0] + 100, HC[1] + 92), fill=255), 2)
hair = np.zeros((H, W, 3)) + np.array([.62, .22, .07])
blobs = []
for _ in range(420):
    ang = rnd.random() * 2 * math.pi; rr = math.sqrt(rnd.random())
    x = HC[0] + math.cos(ang) * rr * 108; y = HC[1] + math.sin(ang) * rr * 98
    if y > 690: continue
    blobs.append((x, y, rnd.uniform(8, 17)))
blobs.sort(key=lambda b: (b[0] - HC[0]) * .5 - (b[1] - HC[1]))            # тёмные (слева-снизу) раньше
LDIR = (.78, -.55)
for x, y, r in blobs:
    nx, ny = (x - HC[0]) / 108, (y - HC[1]) / 98
    lit = np.clip(.5 + .55 * (nx * LDIR[0] + ny * LDIR[1]), 0, 1)
    c_dark, c_mid, c_lit = np.array([.56, .18, .06]), np.array([.90, .38, .12]), np.array([1.0, .72, .40])
    col = c_dark * (1 - lit) + c_mid * lit if lit < .6 else c_mid * (1 - (lit - .6) / .4) + c_lit * (lit - .6) / .4
    x0, x1, y0, y1 = int(x - r - 2), int(x + r + 3), int(y - r - 2), int(y + r + 3)
    sub_y, sub_x = yy[y0:y1, x0:x1], xx[y0:y1, x0:x1]
    dd = np.hypot(sub_x - x, sub_y - y) / r
    m = np.clip((1 - dd) * 3, 0, 1)
    shade = 1 - .45 * dd ** 2 + .25 * np.clip(1 - np.hypot(sub_x - (x + r * .35), sub_y - (y - r * .4)) / (r * .5), 0, 1)
    c = col[None, None] * shade[..., None] * (.9 + .2 * rnd.random())
    hair[y0:y1, x0:x1] = hair[y0:y1, x0:x1] * (1 - m[..., None]) + c * m[..., None]
    hal[y0:y1, x0:x1] = np.maximum(hal[y0:y1, x0:x1], m)
# пружинки по краю
for _ in range(70):
    ang = rnd.uniform(-math.pi, math.pi * .15); rr = rnd.uniform(.92, 1.08)
    x = HC[0] + math.cos(ang) * rr * 106; y = HC[1] + math.sin(ang) * rr * 96
    if y > 680: continue
    r = rnd.uniform(5, 9)
    cm = mask(lambda d: d.arc((x - r, y - r, x + r, y + r), rnd.randint(0, 180), rnd.randint(200, 360), fill=255, width=3), .7)
    lit = np.clip(.5 + .55 * ((x - HC[0]) / 108 * LDIR[0] + (y - HC[1]) / 98 * LDIR[1]), 0, 1)
    hair = layer_paste(hair, np.array([.55, .18, .06]) * (1 - lit) + np.array([1.0, .62, .3]) * lit, cm)
    hal = np.maximum(hal, cm)
# контровой свет справа и тень снизу от волос на капюшон
rimh = np.clip(((xx - HC[0]) / 108 * .9 - (yy - HC[1]) / 98 * .4) - .55, 0, 1) * hal
hair = hair + rimh[..., None] * np.array([.5, .38, .25])
sh = blur(hal, 10) * (yy > 660) * (1 - hal)
a = a * (1 - .35 * sh[..., None])
a = layer_paste(a, np.clip(hair, 0, 1), hal)

# ---------- общий тёплый тон и пикселизация ----------
img = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
img = ImageEnhance.Color(img).enhance(1.25)
img = ImageEnhance.Contrast(img).enhance(1.06)
TW, TH = 400, 300
small = img.filter(ImageFilter.MedianFilter(5)).resize((TW, TH), Image.LANCZOS)
q = small.quantize(colors=56, method=Image.Quantize.MAXCOVERAGE, kmeans=4, dither=Image.Dither.NONE).convert('RGB')

# лампочки гирлянды — чёткими пикселями поверх
k = TW / W
d = ImageDraw.Draw(q)
glow = Image.new('RGB', q.size, 0); g = ImageDraw.Draw(glow)
for i, (x, y) in enumerate(BULBS):
    x, y = round(x * k), round(y * k)
    c = (255, 210, 120) if i % 3 else (255, 150, 90)
    g.ellipse((x - 6, y - 6, x + 6, y + 6), fill=tuple(v // 3 for v in c))
    d.rectangle((x - 1, y - 1, x, y), fill=c); d.point((x - 1, y - 1), fill=(255, 250, 225))
q = ImageChops.add(q, glow.filter(ImageFilter.GaussianBlur(2)))
q.save(os.path.join(OUT, 'lab.png'))
q.resize((TW * 3, TH * 3), Image.NEAREST).save(os.path.join(OUT, 'lab@3x.png'))
print('ok', q.size)
