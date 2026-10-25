# «Обо мне»: мастерская Алины пикселями — коллаж её фото, сведённый в рисовку «крупные пятна цвета» (выбор Алины 25.10.2026).
# Сзади — стена с рамками и стеллаж (_held/lab/wall.webp), бумаги над комодиком закрыты стеной, ячейки — столешницей (стол перед стеллажом).
# Спереди — стол, как на фото у окна: на нём то, что на фото стола (_held/lab/desk.webp): акварель, скетчбук с Полли, палитра,
# кисти, непроливайка, мышка, ноутбук и кошка Милка; рулон бумаги — тыквой-сотами (_held/lab/shelf.webp). Цвет — как у листа «стол с Милкой». Потом: медианный фильтр → 480 px → 56 цветов → контур.
# python3 tools/rooms/lab.py → site/images/about/lab.png и lab@3x.png
import os
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import numpy as np

ROOT = os.path.join(os.path.dirname(__file__), '../..')
OUT = os.path.join(ROOT, 'site/images/about'); os.makedirs(OUT, exist_ok=True)
src = lambda n: Image.open(os.path.join(ROOT, '_held/lab', n)).convert('RGB')
wall, desk, shelf = src('wall.webp'), src('desk.webp'), src('shelf.webp')     # 2000x1500, 2000x1500, 960x1280
W, H = 2000, 1700
rng = np.random.default_rng(4)


def soft(size, fn, r=3):
    m = Image.new('L', size, 0); fn(ImageDraw.Draw(m)); return m.filter(ImageFilter.GaussianBlur(r))


# ---------- стена и стеллаж ----------
# бумаги и файлы над комодиком → стена (берём полосу стены выше)
patch = wall.crop((220, 0, 820, 170)).resize((600, 260))
wall.paste(patch, (220, 165), soft(wall.size, lambda d: d.polygon([(222, 168), (818, 168), (818, 424), (290, 424), (290, 300), (222, 300)], fill=255), 4).crop((220, 165, 820, 425)))
wall = ImageEnhance.Brightness(wall).enhance(1.12)
top = wall.crop((0, 110, 2000, 985))
canvas = Image.new('RGB', (W, H))
canvas.paste(top, (0, 0))

# ---------- столешница между стеллажом и вещами ----------
BAND0 = top.height - 8                            # низ передней кромки полки
B = 1.                                           # вещи на столе — масштаб фото стола
DX, DY = 0, BAND0 + 100 - round(695 * B)         # сдвиг фото стола
BAND1 = H
wood = np.zeros((BAND1 + 40 - BAND0, W, 3))
t = np.linspace(0, 1, wood.shape[0])[:, None, None]
wood[:] = np.array([96, 72, 56]) * (1 - t) + np.array([150, 116, 84]) * t
sun = np.clip((np.arange(W) - 1100) / 500, 0, 1)[None, :, None]   # солнце справа
wood = wood * (1 + .25 * sun)
for _ in range(220):
    y = rng.integers(0, wood.shape[0]); x = rng.integers(0, W); L = rng.integers(60, 260)
    wood[y:y + 2, x:x + L] *= .93
wood += rng.normal(0, 4, wood.shape)
canvas.paste(Image.fromarray(np.clip(wood, 0, 255).astype(np.uint8)), (0, BAND0))
sh = Image.new('L', (W, 60), 0); ImageDraw.Draw(sh).rectangle((0, 0, W, 18), fill=110)      # тень под полкой
canvas.paste((40, 28, 20), (0, BAND0), sh.filter(ImageFilter.GaussianBlur(10)))

# ---------- стол с вещами (фото стола), рулон → тыква ----------
pk = shelf.crop((540, 870, 726, 1046))
pm = soft(pk.size, lambda d: (d.ellipse((9, 16, 177, 172), fill=255), d.rectangle((84, 10, 102, 30), fill=255)), 1.5)
pk = ImageEnhance.Color(pk).enhance(.85).resize((326, 308), Image.LANCZOS); pm = pm.resize(pk.size, Image.LANCZOS)
desk.paste(desk.crop((0, 1180, 220, 1500)).resize((230, 360)), (-10, 760))
desk.paste(pk, (-60, 760), pm)
dm = soft(desk.size, lambda d: (
    d.rectangle((0, 695, 2000, 1500), fill=255),
    d.polygon([(0, 380), (170, 380), (300, 470), (300, 560), (500, 560), (500, 695), (0, 695)], fill=255),
    d.rectangle((250, 630, 700, 700), fill=255),
    d.rectangle((1200, 520, 2000, 700), fill=255),
    d.ellipse((1320, 330, 1940, 800), fill=255)), 3)
dm = Image.fromarray((np.asarray(dm).astype(float) * np.ones(2000)[None, :]).astype(np.uint8))
desk = desk.resize((round(2000 * B), round(1500 * B)), Image.LANCZOS); dm = dm.resize(desk.size, Image.LANCZOS)
canvas.paste(desk, (DX, DY), dm)

# ---------- цвет как у листа «стол с Милкой» ----------
a = np.asarray(canvas).astype(float) / 255
a = a ** np.array([.96, 1.0, 1.04]) * np.array([1.03, 1.0, .96])
lum = a.mean(2, keepdims=True); a = a + (lum < .35) * np.array([.04, .02, 0])
img = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
img = ImageEnhance.Contrast(ImageEnhance.Color(img).enhance(1.3)).enhance(1.08)

# ---------- пикселизация и контур ----------
TW = 480; TH = round(H * TW / W)
small = img.filter(ImageFilter.MedianFilter(7)).resize((TW, TH), Image.LANCZOS)
q = small.quantize(colors=56, method=Image.Quantize.MAXCOVERAGE, kmeans=4, dither=Image.Dither.NONE).convert('RGB')
p = np.asarray(q).astype(float); lu = p.mean(2)
edge = np.zeros_like(lu)
edge[:-1] = np.maximum(edge[:-1], np.abs(lu[1:] - lu[:-1])); edge[:, :-1] = np.maximum(edge[:, :-1], np.abs(lu[:, 1:] - lu[:, :-1]))
p = p * np.where(edge > 46, .72, 1)[..., None]      # тёмный контур по сильным перепадам — «нарисованность»
q = Image.fromarray(p.astype(np.uint8))
q.save(os.path.join(OUT, 'lab.png'))
q.resize((TW * 3, TH * 3), Image.NEAREST).save(os.path.join(OUT, 'lab@3x.png'))
print('ok', q.size)
