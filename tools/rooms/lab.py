# «Обо мне»: мастерская Алины — пиксельная картинка из её фото (рисовка, которую Алина выбрала 25.10.2026).
# Основа — фото стола (_held/lab/desk.webp): акварель, скетчбук с Полли, ноутбук, рыжий кот в солнце.
# Меняем: рулон бумаги → тыква-соты с фото полки (_held/lab/shelf.webp), экран → сад Полли с сайта, тёплый свет, гирлянда.
# Потом: медианный фильтр → уменьшение → 56 цветов без дизеринга → крупные пиксели.
# python3 tools/rooms/lab.py → site/images/about/lab.png (360 px) и lab@3x.png
import os
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageChops
import numpy as np

ROOT = os.path.join(os.path.dirname(__file__), '../..')
OUT = os.path.join(ROOT, 'site/images/about'); os.makedirs(OUT, exist_ok=True)
desk = Image.open(os.path.join(ROOT, '_held/lab/desk.webp')).convert('RGB')       # 2000x1500
shelf = Image.open(os.path.join(ROOT, '_held/lab/shelf.webp')).convert('RGB')     # 960x1280
W, H = desk.size


def soft_mask(size, draw, blur=2):
    m = Image.new('L', size, 0); draw(ImageDraw.Draw(m)); return m.filter(ImageFilter.GaussianBlur(blur))


# экран ноутбука: сад Полли с сайта, натянутый на четырёхугольник экрана
scr = Image.open(os.path.join(ROOT, 'site/images/blog/site-news-2026-10/garden.webp')).convert('RGB')
quad = [(500, 92), (1168, 102), (1164, 494), (504, 488)]           # ЛВ, ПВ, ПН, ЛН в координатах фото


def coeffs(dst, src):
    m = []
    for (x, y), (u, v) in zip(dst, src):
        m += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]
    return np.linalg.solve(np.array(m, float), np.array([c for p in src for c in p], float)).tolist()


sw, sh = scr.size
warp = scr.transform((W, H), Image.PERSPECTIVE, coeffs(quad, [(0, 0), (sw, 0), (sw, sh), (0, sh)]), Image.BICUBIC)
warp = ImageEnhance.Brightness(warp).enhance(.92)
desk.paste(warp, (0, 0), soft_mask((W, H), lambda d: d.polygon(quad, fill=255), 1))

# тыква-соты вместо рулона бумаги слева
pk = shelf.crop((540, 870, 726, 1046))
pm = soft_mask(pk.size, lambda d: (d.ellipse((9, 16, 177, 172), fill=255), d.rectangle((84, 10, 102, 30), fill=255)), 1.5)
k = 1.75
pk = pk.resize((round(pk.width * k), round(pk.height * k)), Image.LANCZOS); pm = pm.resize(pk.size, Image.LANCZOS)
pk = ImageEnhance.Color(ImageEnhance.Brightness(pk).enhance(.98)).enhance(.8)
# сначала закрыть рулон тёмной столешницей (тень), потом поставить тыкву
desk.paste(desk.crop((0, 1180, 220, 1500)).resize((230, 360)), (-10, 760))
desk.paste(pk, (-60, 760), pm)

# тёплый «уютный» свет: золотистее, мягче контраст в тенях
a = np.asarray(desk).astype(float) / 255
a = a ** np.array([.96, 1.0, 1.04])                    # чуть теплее, синие краски остаются синими
a = a * np.array([1.03, 1.0, .96])
lum = a.mean(2, keepdims=True)
a = a + (lum < .35) * np.array([.04, .02, 0])          # тени — коричневые, не серые
desk = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
desk = ImageEnhance.Color(desk).enhance(1.3)
desk = ImageEnhance.Contrast(desk).enhance(1.08)

# пикселизация как на выбранном образце
TW = 400
TH = round(H * TW / W)
small = desk.filter(ImageFilter.MedianFilter(5)).resize((TW, TH), Image.LANCZOS)
q = small.quantize(colors=56, method=Image.Quantize.MAXCOVERAGE, kmeans=4, dither=Image.Dither.NONE).convert('RGB')

# гирлянда по верху окна — уже в пикселях, чтобы лампочки были чёткими
d = ImageDraw.Draw(q)
import math
pts = [(x, 6 + 7 * math.sin(math.pi * ((x - 4) % 132) / 132)) for x in range(-4, TW + 4)]
d.line([(x, round(y)) for x, y in pts], fill=(60, 48, 40))
glow = Image.new('RGB', q.size, 0); g = ImageDraw.Draw(glow)
for i, x in enumerate(range(6, TW, 16)):
    y = round(6 + 7 * math.sin(math.pi * ((x - 4) % 132) / 132)) + 2
    c = (255, 206, 110) if i % 3 else (255, 150, 90)
    g.ellipse((x - 6, y - 5, x + 6, y + 7), fill=tuple(v // 3 for v in c))
    d.rectangle((x - 1, y, x + 1, y + 2), fill=c); d.point((x - 1, y), fill=(255, 248, 220)); d.point((x, y - 1), fill=(60, 48, 40))
q = ImageChops.add(q, glow.filter(ImageFilter.GaussianBlur(2)))
q.save(os.path.join(OUT, 'lab.png'))
q.resize((TW * 3, TH * 3), Image.NEAREST).save(os.path.join(OUT, 'lab@3x.png'))
print('ok', q.size)
