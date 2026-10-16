# Коллекция карточек «Хеллоуин 2026»: 10 обычных карточек 120×168 (пиксель-арт, показ с image-rendering: pixelated).
# Рамка, номер и пометка 🤖 — в CSS сайта (site/assets/cards-ui.js), в картинке только сам рисунок.
# Персонажи — как на сайте: Полли — из спрайта polly.js (тот же силуэт и цвета, только крупнее), Титос — из tools/rooms/detective.py,
# Голова Тыквы и Мистер Чу — по картинам Алины (галереи Pumpkin Family и Mr.Chew).
# Запуск: python3 tools/cards/halloween.py [папка] — по умолчанию site/images/cards/halloween-2026/ (01.png … 10.png) + лист sheet.png рядом.
import sys, os, math, random
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../rooms'))
import kit
from kit import INK, L, D, F3
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

CW, CH = 120, 168
kit.W, kit.H = CW, CH  # слои kit рисуют на холсте карточки
Layer = kit.Layer
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '../../site/images/cards/halloween-2026')

def outline(im, col=INK):
    a = np.asarray(im).copy(); m = a[..., 3] > 0; pp = np.pad(m, 1)
    nb = pp[:-2, 1:-1] | pp[2:, 1:-1] | pp[1:-1, :-2] | pp[1:-1, 2:]
    a[nb & ~m] = col + (255,); return Image.fromarray(a, 'RGBA')
def paste(base, im, x, y, out=True):
    """кладёт спрайт на холст (с контуром), x, y — левый верхний угол"""
    if out: im = outline(_pad(im))
    else: im = _pad(im)
    base.alpha_composite(im, (int(x) - 1, int(y) - 1)) if x >= 1 and y >= 1 else base.alpha_composite(im.crop((max(0, 1 - int(x)), max(0, 1 - int(y)), im.width, im.height)), (max(0, int(x) - 1), max(0, int(y) - 1)))
def _pad(im):
    o = Image.new('RGBA', (im.width + 2, im.height + 2), (0, 0, 0, 0)); o.alpha_composite(im, (1, 1)); return o
def flipx(im): return im.transpose(Image.FLIP_LEFT_RIGHT)
def canvas(w, h): im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); return im, ImageDraw.Draw(im)
def text3(d, x, y, t, c):
    for i, ch in enumerate(t.upper()):
        f = F3.get(ch, F3[' '])
        for j in range(15):
            if f[j] == '1': d.point((x + i * 4 + j % 3, y + j // 3), fill=c)

# ---------- фоны ----------
def sky(top, bottom, stars=0, seed=1, y1=CH):
    im = Image.new('RGBA', (CW, CH), (0, 0, 0, 255)); d = ImageDraw.Draw(im)
    for y in range(CH):
        t = min(1, y / max(1, y1)); t = round(t * 12) / 12  # ступеньки — как в пиксель-арте
        d.line([(0, y), (CW, y)], fill=tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    r = random.Random(seed)
    for _ in range(stars):
        x, y = r.randrange(CW), r.randrange(int(y1 * .8))
        d.point((x, y), fill=(255, 244, 210) if r.random() < .3 else (200, 196, 240))
        if r.random() < .12: d.point([(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)], fill=(150, 140, 210))
    return im, d
def moon(d, x, y, r, c=(250, 236, 180), cut=None):
    d.ellipse((x - r, y - r, x + r, y + r), fill=c)
    d.ellipse((x - r + 2, y - r + 2, x - r // 3, y - r // 3), fill=L(c, 6))
    for cx, cy, cr in ((x + r // 3, y - r // 4, max(1, r // 4)), (x - r // 3, y + r // 3, max(1, r // 5)), (x + r // 5, y + r // 2, max(1, r // 6))):
        d.ellipse((cx - cr, cy - cr, cx + cr, cy + cr), fill=D(c, 22))
    if cut: d.ellipse((x - r + cut[0], y - r + cut[1], x + r + cut[0], y + r + cut[1]), fill=cut[2])
def bat(d, x, y, s=1, c=(30, 22, 44)):
    d.polygon([(x, y), (x - 3 * s, y - 2 * s), (x - 5 * s, y), (x - 4 * s, y + s), (x - 2 * s, y), (x - s, y + 2 * s), (x, y + s), (x + s, y + 2 * s), (x + 2 * s, y), (x + 4 * s, y + s), (x + 5 * s, y), (x + 3 * s, y - 2 * s)], fill=c)
    d.point([(x - 1, y - 1), (x + 1, y - 1)], fill=c)
def ground(d, y, c, hills=None, seed=2):
    d.rectangle((0, y, CW, CH), fill=c)
    r = random.Random(seed)
    for _ in range(40): d.point((r.randrange(CW), r.randrange(y + 2, CH)), fill=D(c, 14))
    d.line([(0, y), (CW, y)], fill=L(c, 18))
def vignette(im, k=.14):
    a = np.asarray(im.convert('RGB')).astype(float)
    yy, xx = np.mgrid[0:CH, 0:CW]; f = 1 - k * np.clip((np.hypot((xx - CW / 2) / (CW / 2), (yy - CH / 2) / (CH / 2)) - .55) / .9, 0, 1)
    f = np.round(f * 24) / 24
    return Image.fromarray(np.clip(a * f[..., None], 0, 255).astype(np.uint8)).convert('RGBA')
def glow(im, x, y, r, c, k=.5):
    a = np.asarray(im.convert('RGB')).astype(float)
    yy, xx = np.mgrid[0:CH, 0:CW]; f = np.clip(1 - np.hypot(xx - x, yy - y) / r, 0, 1) ** 1.5 * k
    f = np.round(f * 8) / 8
    a = a + (np.array(c)[None, None] - a) * f[..., None] * .6 + f[..., None] * 18
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).convert('RGBA')

# ---------- Полли: спрайт из site/assets/polly.js, увеличенный с тем же силуэтом ----------
P_BODY = ['......ddd.....', '.....dbbbd....', '....dbbwwbd...', '....dbbwkbdoo.', '....dbbbbbdo..', '...dbbbbbbd...',
          '..dbbsbbbbd...', '.dbbssbbbbd...', 'dbbssbbbbbd...', 'dbbbbbbbbd....', '.ddbbbbbdd....', '...ddddd......']
P_COL = {'b': (127, 129, 191), 's': (94, 90, 156), 'o': (242, 167, 59), 'w': (255, 255, 255), 'k': INK}
def _cells(rows, chars):
    m = np.zeros((len(rows), max(len(r) for r in rows)), bool)
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            if ch in chars: m[y, x] = True
    return m
def _smooth(m, k, blur=.55, th=118):
    im = Image.fromarray((m * 255).astype(np.uint8), 'L').resize((m.shape[1] * k, m.shape[0] * k), Image.NEAREST)
    im = im.filter(ImageFilter.GaussianBlur(k * blur))
    return np.asarray(im) > th
def polly(k=4, eye='open', legs=True, look=0, brow=False, wingup=False):
    """k — во сколько раз крупнее спрайта (4 → 56×56); eye: open / half / wide / closed; look — зрачок -1 назад, 0, 1 вперёд"""
    rows = P_BODY
    sil = _smooth(_cells(rows, 'dbswk'), k)
    wing = _smooth(_cells(rows, 's'), k, .5, 100) & sil
    h, w = sil.shape
    a = np.zeros((h + 2 * k, w + k, 4), np.uint8)
    a[:h, :w][sil] = P_COL['b'] + (255,)
    # тень снизу и блик на голове — объём, как у вещей в комнате
    yy, xx = np.mgrid[0:h, 0:w]
    up = np.zeros_like(sil); up[:-k] = sil[k:]  # тень по нижнему краю (повторяет контур) и светлая кромка сверху
    a[:h, :w][sil & ~up & (yy > h * .45)] = D(P_COL['b'], 16) + (255,)
    dn = np.zeros_like(sil); dn[1:] = sil[:-1]; lf = np.zeros_like(sil); lf[:, 1:] = sil[:, :-1]
    a[:h, :w][sil & ~dn & (yy < h * .5)] = L(P_COL['b'], 22) + (255,)
    a[:h, :w][wing] = P_COL['s'] + (255,)
    wl = np.zeros_like(wing); wl[1:, 1:] = wing[:-1, :-1]; a[:h, :w][wing & ~wl] = L(P_COL['s'], 18) + (255,)
    im = Image.fromarray(a, 'RGBA'); d = ImageDraw.Draw(im)
    hl = (int(6.6 * k), int(1.1 * k)); d.ellipse((hl[0], hl[1], hl[0] + k, hl[1] + max(1, k // 2)), fill=L(P_COL['b'], 28))
    # клюв
    bx, by = 11 * k - k // 2, int(3.1 * k)
    d.polygon([(bx, by), (bx + int(2.2 * k), by + k // 2), (bx + int(1.6 * k), by + k), (bx + k // 2, by + int(1.7 * k)), (bx, by + int(1.4 * k))], fill=P_COL['o'])
    d.line([(bx + k // 2, by + k // 2 + 1), (bx + int(1.8 * k), by + k // 2 + 1)], fill=D(P_COL['o'], 40))
    # глаз
    ex, ey = int(7.05 * k), int(2.05 * k); er = int(1.9 * k)
    if eye == 'closed':
        d.arc((ex, ey + k // 2, ex + er, ey + er), 200, 340, fill=INK, width=max(1, k // 3))
    else:
        tall = er + (k // 2 if eye == 'wide' else 0)
        d.ellipse((ex, ey - (k // 2 if eye == 'wide' else 0), ex + er, ey + tall - (k // 2 if eye == 'wide' else 0)), fill=P_COL['w'])
        d.ellipse((ex - 1, ey - 1 - (k // 2 if eye == 'wide' else 0), ex + er + 1, ey + tall + 1 - (k // 2 if eye == 'wide' else 0)), outline=INK)
        ps = max(2, int(k * .85)) if eye != 'wide' else max(2, int(k * .6))
        px_ = ex + er // 2 + look * (k // 2) - ps // 2 + k // 3; py_ = ey + er // 2 - ps // 2 + k // 4
        d.rectangle((px_, py_, px_ + ps - 1, py_ + ps - 1), fill=INK)
        d.point((px_, py_), fill=P_COL['w'])
        if eye == 'half': d.rectangle((ex - 1, ey - 1, ex + er + 1, ey + er // 2 - 1), fill=P_COL['b']); d.line([(ex - 1, ey + er // 2 - 1), (ex + er + 1, ey + er // 2 - 1)], fill=INK)
    if brow: d.line([(ex - k // 2, ey - k // 2 - 1), (ex + er, ey + k // 3 - 1)], fill=INK, width=max(1, k // 3))
    if legs:
        for lx in (4.4, 7.4):
            x0 = int(lx * k); y0 = 11 * k - 1
            d.rectangle((x0, y0, x0 + max(1, k // 3), y0 + int(1.3 * k)), fill=P_COL['o'])
            d.rectangle((x0 - int(1.0 * k), y0 + int(1.3 * k), x0 + max(1, k // 3), y0 + int(1.3 * k) + max(1, k // 3)), fill=P_COL['o'])
    return im.crop(im.getbbox())


# ---------- Титос: как в tools/rooms/detective.py (голова-подушка, глаза на стебельках, рубашка, бордовые подтяжки и галстук) ----------
TG, TGd, TGl = (150, 150, 198), (112, 110, 162), (186, 186, 224)
TWt, TWs, TR, TS = (232, 232, 244), (190, 192, 214), (150, 40, 52), (130, 36, 44)
BAND, BANDd, BANDl = (236, 228, 204), (196, 184, 152), (250, 246, 230)
def _pillow(x0, y0, x1, y1, bulge):
    pts = []
    for t in range(0, 21): u = t / 20; pts.append((x0 + (x1 - x0) * u, y0 - bulge * math.sin(math.pi * u)))
    for t in range(1, 21): u = t / 20; pts.append((x1 + bulge * math.sin(math.pi * u), y0 + (y1 - y0) * u))
    for t in range(1, 21): u = t / 20; pts.append((x1 - (x1 - x0) * u, y1 + bulge * math.sin(math.pi * u)))
    for t in range(1, 20): u = t / 20; pts.append((x0 - bulge * math.sin(math.pi * u), y1 - (y1 - y0) * u))
    return pts
def titos(costume='', arm='', eyes='open', hat=False):
    """costume: '' — как обычно, 'mummy' — в бинтах; arm: '' — руки вниз, 'magnifier' — правая рука с лупой вперёд, 'pot' — правая рука с кофейником;
    eyes: open / wide (не спит); hat — шляпа детектива"""
    PW, PH = 84, 136
    im, d = canvas(PW, PH); cx = 28
    mum = costume == 'mummy'
    # стебельки с глазками (у мумии тоже — «маскироваться отказались»)
    for sx, ex, ey in ((cx - 4, cx - 12, 6), (cx + 4, cx + 10, 9)):
        d.line([(sx, 28), (sx + (ex - sx) // 3, 20), (ex, ey + 4)], fill=TGd, width=2)
        r = 5 if eyes == 'wide' else 4
        d.ellipse((ex - r, ey - r + 1, ex + r, ey + r + 1), fill=(214, 214, 232))
        if eyes == 'wide':
            d.rectangle((ex - 1, ey, ex + 1, ey + 2), fill=(40, 34, 52)); d.point([(ex - 3, ey - 1), (ex + 3, ey + 3)], fill=(220, 120, 130))
        else: d.rectangle((ex - 1, ey - 1, ex + 1, ey + 3), fill=(40, 34, 52))
    G, Gd = (BAND, BANDd) if mum else (TG, TGd)
    d.polygon(_pillow(cx - 13, 28, cx + 13, 44, 3), fill=G)
    d.polygon([(x, y) for x, y in _pillow(cx - 13, 28, cx + 13, 44, 3) if y > 41] + [(cx + 13, 41), (cx - 13, 41)], fill=Gd)
    d.polygon(_pillow(cx - 12, 29, cx + 12, 41, 2), fill=G)
    if not mum:
        d.ellipse((cx - 9, 28, cx - 3, 32), fill=TGl)
        if eyes == 'wide': d.ellipse((cx - 2, 35, cx + 2, 39), fill=(60, 56, 90))
        else: d.line([(cx - 3, 37), (cx - 2, 38), (cx + 2, 38), (cx + 3, 37)], fill=(60, 56, 90))
        d.line([(cx - 8, 45), (cx - 11, 49), (cx - 9, 51)], fill=TGd, width=2); d.line([(cx + 8, 45), (cx + 11, 49), (cx + 9, 51)], fill=TGd, width=2)
    d.rectangle((cx - 3, 46, cx + 3, 54), fill=Gd)
    Wt, Ws = (BAND, BANDd) if mum else (TWt, TWs)
    d.polygon([(cx - 11, 58), (cx - 6, 54), (cx + 6, 54), (cx + 11, 58), (cx + 10, 100), (cx - 10, 100)], fill=Wt)
    d.polygon([(cx + 4, 55), (cx + 11, 58), (cx + 10, 100), (cx + 4, 100)], fill=Ws)
    if not mum:
        d.polygon([(cx - 6, 52), (cx, 58), (cx - 4, 62), (cx - 9, 56)], fill=Wt); d.polygon([(cx + 6, 52), (cx, 58), (cx + 4, 62), (cx + 9, 56)], fill=Ws)
        d.polygon([(cx - 2, 58), (cx + 2, 58), (cx + 3, 88), (cx, 92), (cx - 3, 88)], fill=TR)
        d.line([(cx - 7, 56), (cx - 7, 100)], fill=TS, width=2); d.line([(cx + 7, 56), (cx + 7, 100)], fill=TS, width=2)
    for sgn in (-1, 1):
        sx_ = cx + sgn * 11
        if sgn > 0 and arm == 'pot':  # правая рука поднята вперёд-вверх (наливает)
            d.polygon([(sx_, 58), (sx_ + 4, 59), (sx_ + 14, 60), (sx_ + 24, 54), (sx_ + 26, 58), (sx_ + 14, 66), (sx_ + 1, 66)], fill=Ws)
            d.ellipse((sx_ + 23, 51, sx_ + 30, 58), fill=G)
            continue
        if sgn > 0 and arm:  # правая рука вперёд (локоть чуть ниже плеча)
            d.polygon([(sx_, 58), (sx_ + 4, 60), (sx_ + 14, 72), (sx_ + 24, 76), (sx_ + 24, 81), (sx_ + 12, 79), (sx_ + 1, 68)], fill=Ws)
            if not mum: d.line([(sx_ + 18, 75), (sx_ + 18, 80)], fill=(170, 172, 198))
            d.ellipse((sx_ + 23, 74, sx_ + 30, 81), fill=G)
            continue
        d.polygon([(sx_, 58), (sx_ + sgn * 4, 60), (sx_ + sgn * 5, 92), (sx_ + sgn * 1, 92)], fill=Wt if sgn < 0 else Ws)
        if not mum: d.line([(sx_ + sgn * 1, 80), (sx_ + sgn * 5, 80)], fill=Ws if sgn < 0 else (170, 172, 198))
        d.ellipse((sx_ + (sgn * 5 if sgn < 0 else 0), 91, sx_ + (0 if sgn < 0 else sgn * 5), 98), fill=G)
    P1, P2 = ((BAND, BANDd) if mum else ((60, 66, 100), (48, 52, 82)))
    d.rectangle((cx - 10, 100, cx + 10, 104), fill=(BANDd if mum else (54, 50, 70)))
    d.rectangle((cx - 9, 104, cx - 1, 126), fill=P1); d.rectangle((cx + 1, 104, cx + 9, 126), fill=P1); d.line([(cx + 6, 106), (cx + 6, 124)], fill=P2)
    d.rectangle((cx - 11, 126, cx - 1, 129), fill=(30, 26, 36) if not mum else BANDd); d.rectangle((cx + 1, 126, cx + 11, 129), fill=(30, 26, 36) if not mum else BANDd)
    if mum:  # бинты: косые полоски по всему телу и голове, хвостик бинта
        a = np.asarray(im).copy(); yy, xx = np.mgrid[0:PH, 0:PW]
        body = (a[..., 3] > 0) & (yy > 26) & ~((yy < 28) & (xx < cx + 6))
        stripe = ((yy + (xx // 2)) % 5 == 0) & body
        a[stripe] = BANDd + (255,); hl = ((yy + (xx // 2)) % 5 == 2) & body & (xx < cx + 4); a[hl] = BANDl + (255,)
        im = Image.fromarray(a, 'RGBA'); d = ImageDraw.Draw(im)
        d.line([(cx - 10, 96), (cx - 16, 108), (cx - 13, 116)], fill=BAND, width=3); d.line([(cx - 16, 108), (cx - 13, 116)], fill=BANDd)
        d.line([(cx + 12, 40), (cx + 18, 44), (cx + 20, 52)], fill=BAND, width=2)
    if hat:  # шляпа детектива (стебельки — сквозь шляпу)
        d.polygon([(cx - 17, 30), (cx + 17, 30), (cx + 14, 27), (cx - 14, 27)], fill=(110, 80, 56))
        d.polygon([(cx - 10, 27), (cx - 9, 19), (cx + 9, 19), (cx + 10, 27)], fill=(126, 92, 64))
        d.rectangle((cx - 10, 24, cx + 10, 26), fill=(70, 46, 34)); d.line([(cx - 3, 20), (cx + 3, 20)], fill=(96, 70, 50))
        for sx, ex, ey in ((cx - 4, cx - 12, 6), (cx + 4, cx + 10, 9)): d.line([(sx, 22), (sx + (ex - sx) // 3, 18)], fill=TGd, width=2)
    return outline(im)

# ---------- Мистер Чу: светло-серый улиток с длинными рожками и золотыми глазками (картины Алины), коричневая раковина ----------
CG, CGd, CGl, CGo = (214, 210, 228), (164, 158, 188), (238, 236, 246), (232, 184, 74)
SH, SHd, SHl = (176, 120, 72), (128, 82, 46), (214, 160, 104)
def mrchew(face=1, alarm=False, shell=True, eyes='open'):
    """смотрит вправо; alarm — рожки торчком; eyes: open / wide"""
    im, d = canvas(70, 70)
    # ножка-тело: длинная, вдоль земли, спереди поднимается шеей с головой
    d.polygon([(4, 66), (8, 60), (40, 58), (50, 52), (52, 34), (56, 26), (62, 26), (66, 32), (66, 50), (62, 62), (58, 66)], fill=CG)
    d.polygon([(4, 66), (58, 66), (62, 62), (60, 64), (8, 64)], fill=CGd)
    d.line([(54, 30), (54, 50)], fill=CGl); d.line([(58, 58), (62, 50)], fill=CGd)
    for y in (40, 46): d.line([(60, y), (65, y + 1)], fill=CGd)  # складочки «подбородка», как на картинах
    if shell:
        d.ellipse((10, 26, 46, 62), fill=SH); d.ellipse((12, 28, 40, 54), fill=SHl)
        d.ellipse((16, 32, 38, 54), fill=SH)
        for r_, c in ((8, SHd), (5, SH), (2, SHd)): d.ellipse((27 - r_, 43 - r_, 27 + r_, 43 + r_), outline=c)
        d.arc((10, 26, 46, 62), 20, 160, fill=SHd, width=2)
    # рожки
    for bx, tx, ty in ((57, 50 if alarm else 46, 2 if alarm else 6), (62, 66 if alarm else 68, 4 if alarm else 10)):
        d.line([(bx, 28), ((bx + tx) // 2, (28 + ty) // 2 + (0 if alarm else 3)), (tx, ty + 3)], fill=CGd, width=2)
        r = 3 if eyes != 'wide' else 4
        d.ellipse((tx - r, ty - r + 2, tx + r, ty + r + 2), fill=CGo); d.point((tx - 1, ty + 1), fill=L(CGo, 50))
        d.rectangle((tx + (1 if face > 0 else -1), ty + 2, tx + (1 if face > 0 else -1), ty + 3), fill=INK)
    return outline(im.crop(im.getbbox()))
def chew_ghost():
    """Мистер Чу под простынёй: рожки торчат спереди, дырки для глаз — на затылке (сзади, над раковиной)"""
    im, d = canvas(78, 72)
    d.polygon([(2, 70), (6, 52), (10, 34), (18, 22), (32, 18), (46, 22), (54, 30), (60, 26), (68, 28), (72, 40), (72, 58), (76, 70),
               (68, 66), (60, 70), (50, 65), (40, 70), (30, 65), (20, 70), (12, 65)], fill=(246, 246, 252))
    d.polygon([(2, 70), (6, 52), (10, 40), (14, 60), (12, 65)], fill=(214, 214, 230))
    d.line([(22, 30), (30, 60)], fill=(220, 220, 236)); d.line([(46, 28), (48, 60)], fill=(220, 220, 236)); d.line([(64, 36), (66, 62)], fill=(220, 220, 236))
    for ex in (16, 28): d.ellipse((ex - 3, 30, ex + 3, 38), fill=INK)  # «глаза» простыни — сзади
    d.arc((14, 44, 30, 54), 200, 340, fill=INK)  # и страшный рот, тоже сзади
    for bx, tx, ty in ((62, 58, 2), (68, 72, 6)):
        d.line([(bx, 28), (tx, ty + 3)], fill=CGd, width=2)
        d.ellipse((tx - 3, ty - 1, tx + 3, ty + 5), fill=CGo); d.rectangle((tx + 1, ty + 2, tx + 1, ty + 3), fill=INK)
    d.polygon([(70, 66), (76, 70), (66, 70)], fill=CG)
    return outline(im.crop(im.getbbox()))

# ---------- тыквы: Голова Тыквы (дама из «Pumpkin Family»), тыква-фонарь, хор ----------
PO, POd, POl, PSt = (232, 116, 44), (190, 80, 28), (248, 156, 80), (92, 110, 50)
def pumpkin(w, h, face='smile', lit=False, stem=True):
    """тыква с рёбрами; face: smile / scared / o / a / jack (фонарь) / none"""
    im, d = canvas(w + 2, h + 6); y0 = 5
    d.ellipse((0, y0, w, y0 + h), fill=PO)
    for i, fx in enumerate((.18, .38, .62, .82)):
        x = int(w * fx); d.arc((x - w // 4, y0 + 1, x + w // 4, y0 + h - 1), 70 if fx > .5 else 110, 290 if fx > .5 else 250, fill=POd) if False else None
    for fx in (.3, .5, .7):  # рёбра
        x = int(w * fx); d.ellipse((x - w // 7, y0 + 1, x + w // 7, y0 + h - 1), outline=POd)
    d.ellipse((int(w * .14), y0 + 2, int(w * .3), y0 + h // 3), fill=POl)
    if stem: d.polygon([(w // 2 - 2, y0 + 2), (w // 2 - 1, 0), (w // 2 + 3, 0), (w // 2 + 2, y0 + 2)], fill=PSt); d.point((w // 2 + 3, 1), fill=L(PSt, 30))
    hole = (255, 214, 90) if lit else (34, 20, 30)
    cx, cy = w // 2, y0 + h // 2
    e = max(2, w // 9)
    if face == 'jack':
        for sx in (-1, 1): d.polygon([(cx + sx * w // 5 - e, cy - 1), (cx + sx * w // 5 + e, cy - 1), (cx + sx * w // 5, cy - h // 4)], fill=hole)
        d.polygon([(cx - w // 3, cy + 3), (cx - w // 6, cy + 6), (cx - w // 10, cy + 3), (cx, cy + 7), (cx + w // 10, cy + 3), (cx + w // 6, cy + 6), (cx + w // 3, cy + 3), (cx + w // 4, cy + h // 3), (cx - w // 4, cy + h // 3)], fill=hole)
    elif face != 'none':
        big = face == 'scared'
        for sx in (-1, 1):
            ex = cx + sx * w // 5
            d.ellipse((ex - e - (1 if big else 0), cy - h // 4 - (2 if big else 0), ex + e + (1 if big else 0), cy + (1 if big else -1)), fill=hole)
            if big: d.rectangle((ex, cy - h // 8, ex + 1, cy - h // 8 + 1), fill=(255, 255, 255))
        if face == 'smile':
            d.chord((cx - w // 3, cy - 2, cx + w // 3, cy + h // 3 + 2), 0, 180, fill=hole); d.rectangle((cx + 1, cy + h // 6, cx + 3, cy + h // 6 + 3), fill=PO)
        elif face == 'scared':
            d.ellipse((cx - 3, cy + 4, cx + 3, cy + h // 3 + 2), fill=hole)
            d.line([(cx - w // 3, cy - h // 3), (cx - w // 8, cy - h // 4 - 4)], fill=POd); d.line([(cx + w // 3, cy - h // 3), (cx + w // 8, cy - h // 4 - 4)], fill=POd)
        elif face == 'o': d.ellipse((cx - 2, cy + 3, cx + 2, cy + 8), fill=hole)
        elif face == 'a': d.ellipse((cx - 4, cy + 2, cx + 4, cy + h // 3 + 3), fill=hole); d.rectangle((cx - 2, cy + h // 3, cx + 2, cy + h // 3 + 1), fill=(200, 60, 70))
    return outline(im.crop(im.getbbox()))
DR, DRd, DRl, SK = (122, 74, 158), (90, 52, 122), (160, 110, 196), (240, 208, 184)
def pumpkin_lady(face='smile', arms='down', book=False):
    """Голова Тыквы: тыква вместо головы, бледная шея с кулоном, фиолетовое платье с пышными рукавами в горошек"""
    im, d = canvas(60, 96); cx = 30
    d.rectangle((cx - 4, 32, cx + 4, 44), fill=SK); d.line([(cx - 4, 40), (cx, 46), (cx + 4, 40)], fill=(150, 130, 120)); d.ellipse((cx - 2, 45, cx + 2, 49), fill=(60, 180, 190))
    d.polygon([(cx - 16, 46), (cx - 6, 42), (cx + 6, 42), (cx + 16, 46), (cx + 18, 70), (cx + 22, 94), (cx - 22, 94), (cx - 18, 70)], fill=DR)
    d.polygon([(cx + 6, 42), (cx + 16, 46), (cx + 18, 70), (cx + 22, 94), (cx + 10, 94)], fill=DRd)
    d.line([(cx - 16, 50), (cx + 16, 50)], fill=DRl)
    for y in range(56, 92, 7):
        for x in range(cx - 14, cx + 16, 7): d.point((x + (y // 7 % 2) * 3, y), fill=DRl)
    for sgn in (-1, 1):  # пышные рукава
        sx = cx + sgn * 17
        d.ellipse((sx - 7, 42, sx + 7, 58), fill=DR if sgn < 0 else DRd); d.arc((sx - 7, 42, sx + 7, 58), 200, 330, fill=DRl)
        if arms == 'down': d.polygon([(sx - 3, 56), (sx + 3, 56), (sx + 2 * sgn + 2, 74), (sx + 2 * sgn - 2, 74)], fill=DR if sgn < 0 else DRd); d.ellipse((sx + 2 * sgn - 3, 72, sx + 2 * sgn + 3, 78), fill=SK)
    if arms == 'front':  # руки вперёд, ладони у груди (держит книгу / нож)
        d.polygon([(cx - 20, 54), (cx - 14, 54), (cx - 4, 64), (cx - 8, 68)], fill=DR); d.polygon([(cx + 20, 54), (cx + 14, 54), (cx + 6, 64), (cx + 10, 68)], fill=DRd)
        d.ellipse((cx - 10, 62, cx - 4, 68), fill=SK); d.ellipse((cx + 4, 62, cx + 10, 68), fill=SK)
    if arms == 'up':  # руки вверх от испуга
        for sgn in (-1, 1):
            sx = cx + sgn * 17; d.polygon([(sx - 3, 48), (sx + 3, 48), (sx + sgn * 8 + 2, 30), (sx + sgn * 8 - 2, 28)], fill=DR if sgn < 0 else DRd); d.ellipse((sx + sgn * 8 - 3, 24, sx + sgn * 8 + 3, 30), fill=SK)
    if book: d.polygon([(cx - 11, 60), (cx + 11, 60), (cx + 12, 70), (cx - 12, 70)], fill=(250, 244, 226)); d.line([(cx, 60), (cx, 70)], fill=(170, 150, 120)); [d.line([(cx - 9, y), (cx - 2, y)], fill=(120, 110, 100)) or d.line([(cx + 2, y), (cx + 9, y)], fill=(120, 110, 100)) for y in (63, 66)]
    im = outline(im)
    head = pumpkin(34, 30, face, stem=True)
    im.alpha_composite(head, (cx - head.width // 2, 34 - head.height + 2))
    return im.crop(im.getbbox())

# ---------- паучки ----------
def spider(hat=False, candy=None, look=1):
    im, d = canvas(20, 16)
    for i, (a, b) in enumerate(((2, 6), (1, 9), (2, 12), (4, 14))):
        d.line([(9, 8), (a + 1, b - 2), (a, b)], fill=(40, 30, 50)); d.line([(11, 8), (20 - a - 1, b - 2), (20 - a, b)], fill=(40, 30, 50))
    d.ellipse((5, 4, 15, 13), fill=(52, 40, 66)); d.ellipse((7, 5, 10, 7), fill=(84, 70, 104))
    for ex in (8, 12): d.rectangle((ex - 1 + (look > 0), 8, ex + (look > 0), 9), fill=(255, 255, 255)); d.point((ex + (look > 0), 9), fill=INK)
    if hat: d.rectangle((4, 3, 16, 4), fill=(40, 30, 40)); d.rectangle((7, 0, 13, 3), fill=(40, 30, 40)); d.line([(7, 2), (13, 2)], fill=(200, 60, 70))
    if candy: d.ellipse((13, 10, 18, 14), fill=candy); d.point([(12, 12), (19, 12)], fill=candy)
    return im
def candy(c, w=7):
    im, d = canvas(w + 4, 5); d.ellipse((2, 0, w + 1, 4), fill=c); d.polygon([(0, 0), (2, 2), (0, 4)], fill=L(c, 30)); d.polygon([(w + 3, 0), (w + 1, 2), (w + 3, 4)], fill=L(c, 30))
    d.line([(4, 1), (w - 1, 1)], fill=L(c, 50)); return outline(im)
CANDY = [(220, 60, 80), (90, 180, 110), (240, 190, 60), (110, 140, 230), (200, 110, 210), (250, 140, 60)]

# ---------- 10 карточек ----------
NIGHT = ((34, 20, 66), (86, 54, 120))
def c01():  # Полли-вампир: плащ графа, зловещий взгляд, торчат оранжевые ноги
    im, d = sky(*NIGHT, stars=26, seed=11, y1=130)
    # готическое окно с луной
    d.rectangle((26, 18, 94, 112), fill=(58, 38, 82)); d.polygon([(26, 40), (60, 8), (94, 40)], fill=(58, 38, 82))
    d.rectangle((32, 36, 88, 108), fill=(24, 18, 52)); d.polygon([(32, 38), (60, 14), (88, 38)], fill=(24, 18, 52))
    moon(d, 72, 40, 11); d.line([(60, 16), (60, 108)], fill=(58, 38, 82), width=2); d.line([(32, 66), (88, 66)], fill=(58, 38, 82), width=2)
    bat(d, 44, 30, 1); bat(d, 50, 50, 1); bat(d, 98, 22, 1, (24, 16, 36))
    ground(d, 132, (52, 34, 60), seed=3)
    for x in range(0, CW, 12): d.rectangle((x, 132, x + 11, 137), fill=(66, 46, 74)); d.line([(x, 132), (x, 137)], fill=(40, 26, 48))
    # свеча
    d.rectangle((100, 112, 106, 132), fill=(240, 232, 214)); d.rectangle((106, 112, 106, 132), fill=(200, 190, 170)); d.ellipse((101, 104, 105, 111), fill=(255, 200, 80)); d.point((103, 106), fill=(255, 250, 220))
    d.polygon([(99, 132), (108, 132), (106, 128), (101, 128)], fill=(200, 190, 170))
    im = glow(im, 103, 108, 34, (255, 190, 90), .6); d = ImageDraw.Draw(im)
    # плащ: широко распахнут крылом, высокий воротник с красной подкладкой; из-под плаща — оранжевые ноги
    p = polly(5, eye='half', brow=True, look=1)
    px, py = 30, 64
    cl, cd = canvas(CW, CH)
    cd.polygon([(px + 18, py + 22), (px - 22, py + 6), (px - 26, py + 30), (px - 18, py + 48), (px - 8, py + 60), (px + 4, py + 64), (px + 36, py + 64), (px + 50, py + 56), (px + 54, py + 30), (px + 46, py + 22)], fill=(26, 20, 34))
    cd.polygon([(px - 22, py + 6), (px - 14, py + 18), (px - 10, py + 40), (px - 8, py + 60), (px - 18, py + 48), (px - 26, py + 30)], fill=(150, 26, 40))
    for i in range(3): cd.line([(px + 18 - i, py + 22 + i * 2), (px - 20 + i * 2, py + 8 + i * 12)], fill=(44, 34, 56))
    cd.polygon([(px + 54, py + 30), (px + 50, py + 56), (px + 44, py + 60), (px + 48, py + 34)], fill=(120, 20, 32))
    cl = outline(cl)
    cw, cwd = canvas(CW, CH)  # воротник за головой
    cwd.polygon([(px + 12, py + 26), (px + 4, py + 2), (px + 16, py + 14), (px + 24, py - 2), (px + 32, py + 12), (px + 44, py + 0), (px + 46, py + 26)], fill=(26, 20, 34))
    cwd.polygon([(px + 14, py + 24), (px + 8, py + 8), (px + 17, py + 17), (px + 24, py + 4), (px + 31, py + 16), (px + 42, py + 6), (px + 43, py + 24)], fill=(170, 30, 46))
    im.alpha_composite(outline(cw))
    paste(im, p, px, py)
    im.alpha_composite(cl)
    d = ImageDraw.Draw(im)
    d.rectangle((px + 22, py + 52, px + 26, py + 58), fill=(214, 170, 60)); d.point((px + 24, py + 55), fill=(150, 26, 40))  # застёжка
    for lx in (22, 37):  # ноги торчат из-под плаща
        d.rectangle((px + lx, py + 64, px + lx + 1, py + 69), fill=P_COL['o']); d.rectangle((px + lx - 4, py + 69, px + lx + 1, py + 70), fill=P_COL['o'])
        d.line([(px + lx - 5, py + 71), (px + lx + 2, py + 71)], fill=INK)
    return vignette(im)

def c02():  # Метла с характером: Полли — на шабаш (костёр на горе), метла — в булочную
    im, d = sky((26, 18, 60), (120, 70, 120), stars=22, seed=21, y1=120)
    moon(d, 24, 24, 12)
    # слева вдали гора с костром шабаша
    d.polygon([(0, 104), (14, 78), (30, 70), (46, 90), (60, 112), (0, 112)], fill=(44, 30, 64))
    d.polygon([(0, 104), (6, 86), (12, 80), (20, 92), (30, 112), (0, 112)], fill=(54, 36, 74))
    for i, c in enumerate(((255, 120, 40), (255, 190, 70), (255, 240, 160))): d.polygon([(8 + i, 82), (12, 70 + i * 3), (16 - i, 82)], fill=c)
    im = glow(im, 12, 78, 24, (255, 140, 60), .6); d = ImageDraw.Draw(im)
    for i in range(3): bat(d, 8 + i * 7, 58 - (i % 2) * 4, 1, (26, 16, 40))
    # справа внизу — булочная с кренделем
    ground(d, 140, (54, 40, 66), seed=4)
    d.rectangle((60, 108, 106, 140), fill=(206, 150, 104)); d.polygon([(56, 110), (83, 90), (110, 110)], fill=(150, 60, 50))
    d.rectangle((66, 116, 82, 130), fill=(255, 214, 120)); d.line([(74, 116), (74, 130)], fill=(150, 100, 70)); d.line([(66, 123), (82, 123)], fill=(150, 100, 70))
    d.rectangle((88, 120, 100, 140), fill=(120, 74, 50)); d.point((98, 130), fill=(240, 200, 100))
    d.line([(104, 100), (104, 112)], fill=(70, 50, 40)); d.line([(104, 104), (110, 104)], fill=(70, 50, 40))
    d.ellipse((106, 104, 114, 112), outline=(214, 150, 70), width=2); d.ellipse((108, 106, 112, 110), outline=(214, 150, 70))  # крендель
    im = glow(im, 74, 122, 28, (255, 200, 110), .5); d = ImageDraw.Draw(im)
    # метла: тянет вниз вправо, у неё сердитые глазки
    bl, bd = canvas(CW, CH)
    bd.line([(8, 64), (84, 96)], fill=(150, 100, 56), width=3); bd.line([(8, 63), (84, 95)], fill=(186, 134, 80))
    bd.polygon([(80, 92), (106, 92), (112, 104), (104, 108), (82, 102)], fill=(214, 176, 90))
    for i in range(6): bd.line([(84, 95 + i), (110, 96 + i * 2)], fill=(176, 140, 60))
    bd.rectangle((80, 92, 84, 101), fill=(150, 46, 46))
    im.alpha_composite(outline(bl)); d = ImageDraw.Draw(im)
    d.rectangle((94, 96, 96, 98), fill=(255, 255, 255)); d.rectangle((100, 97, 102, 99), fill=(255, 255, 255)); d.point([(96, 98), (102, 99)], fill=INK)
    d.line([(93, 94), (97, 96)], fill=INK); d.line([(103, 95), (99, 96)], fill=INK)
    # Полли верхом, в шляпе ведьмы, тянет крылом в сторону костра
    p = flipx(polly(4, eye='open', look=1, legs=False))
    px, py = 26, 34
    paste(im, p, px, py)
    hl, hd = canvas(CW, CH)
    hd.polygon([(px + 2, py + 4), (px + 34, py + 2), (px + 22, py - 2), (px + 14, py - 24), (px + 6, py - 18), (px + 10, py - 2)], fill=(40, 26, 60))
    hd.polygon([(px + 11, py - 1), (px + 23, py - 2), (px + 24, py + 2), (px + 10, py + 3)], fill=(240, 140, 50))
    im.alpha_composite(outline(hl)); d = ImageDraw.Draw(im)
    d.polygon([(px + 2, py + 30), (px - 8, py + 20), (px - 14, py + 18), (px - 6, py + 26)], fill=P_COL['s']); d.line([(px + 2, py + 30), (px - 8, py + 20), (px - 14, py + 18)], fill=INK)
    for lx in (24, 32): d.line([(px + lx, py + 44), (px + lx + 2, py + 50)], fill=P_COL['o'], width=2)
    # линии движения
    for y in (70, 78, 86): d.line([(114, y + 30), (119, y + 32)], fill=(200, 180, 230))
    return vignette(im)

def c03():  # Конфеты для паучков: у каждого восемь конфет, у Полли — ни одной
    im, d = sky((44, 28, 78), (70, 44, 100), stars=0, y1=168)
    # паутина в углу
    for i in range(1, 6): d.arc((-18 * i, -18 * i, 18 * i, 18 * i), 0, 90, fill=(150, 140, 190))
    for a in range(0, 91, 18): d.line([(0, 0), (int(100 * math.cos(math.radians(a))), int(100 * math.sin(math.radians(a))))], fill=(150, 140, 190))
    ground(d, 132, (78, 52, 90), seed=5)
    for x in range(0, CW, 20): d.line([(x, 132), (x + 6, CH)], fill=(66, 44, 78))
    # дверь с тыквой-фонарём
    d.rectangle((84, 40, 116, 132), fill=(110, 70, 54)); d.rectangle((88, 44, 112, 84), fill=(96, 60, 46)); d.rectangle((88, 90, 112, 128), fill=(96, 60, 46)); d.ellipse((88, 86, 92, 90), fill=(220, 180, 90))
    d.rectangle((96, 30, 104, 38), fill=(255, 220, 120)); d.rectangle((98, 26, 102, 30), fill=(60, 40, 40)); d.line([(100, 22), (100, 26)], fill=(60, 40, 40))  # фонарь над дверью
    im = glow(im, 100, 34, 26, (255, 200, 100), .5); d = ImageDraw.Draw(im)
    # Полли с пустой корзинкой-тыквой — заглядывает внутрь
    p = polly(4, eye='open', look=0)
    paste(im, p, 22, 76)
    b = pumpkin(22, 16, 'smile', stem=False)
    paste(im, b, 54, 104)
    d = ImageDraw.Draw(im); d.arc((56, 96, 74, 112), 180, 360, fill=INK); d.ellipse((58, 105, 74, 108), fill=(40, 22, 30))  # ручка и пустое дно
    d.text = None
    # паучки с конфетами (по восемь — стопками)
    for i, (x, y) in enumerate(((6, 140), (30, 146), (54, 142), (76, 148), (98, 140))):
        s = spider(look=1 if i % 2 else -1)
        im.alpha_composite(outline(s), (x, y))
        for j in range(4 if i % 2 else 3): im.alpha_composite(candy(CANDY[(i + j) % 6], 6), (x + 3, y - 4 - j * 4))
    # вопрос над Полли
    d = ImageDraw.Draw(im)
    for x, y in ((58, 62), (64, 56)): d.ellipse((x, y, x + 3, y + 3), fill=(240, 236, 250))  # Полли думает…
    d.ellipse((66, 36, 90, 54), fill=(240, 236, 250)); d.ellipse((66, 36, 90, 54), outline=INK)
    im.alpha_composite(candy(CANDY[0], 6), (71, 42)); d = ImageDraw.Draw(im); d.line([(70, 50), (86, 39)], fill=(200, 40, 50), width=2)  # …о конфете, которой нет
    return vignette(im)

def c04():  # Титос-мумия
    im, d = sky((40, 32, 54), (92, 74, 70), stars=0, y1=168)
    # стена склепа из блоков с рисунками
    for y in range(0, 140, 12):
        for x in range(-(y // 12 % 2) * 10, CW, 20):
            d.rectangle((x, y, x + 19, y + 11), fill=(118, 98, 80) if (x + y) % 3 else (108, 90, 74)); d.rectangle((x, y, x + 19, y), fill=(140, 120, 98)); d.rectangle((x, y + 11, x + 19, y + 11), fill=(76, 62, 54))
    for x, y in ((10, 20), (92, 34), (14, 70), (96, 86)):
        d.ellipse((x, y, x + 6, y + 4), outline=(70, 56, 46)); d.point((x + 3, y + 2), fill=(70, 56, 46)); d.line([(x + 1, y + 6), (x + 5, y + 6)], fill=(70, 56, 46))
    ground(d, 140, (70, 56, 50), seed=6)
    # факел
    d.rectangle((102, 50, 106, 70), fill=(90, 60, 40)); d.polygon([(100, 50), (108, 50), (106, 40), (104, 34), (102, 40)], fill=(255, 150, 50)); d.polygon([(102, 48), (106, 48), (104, 40)], fill=(255, 230, 140))
    im = glow(im, 104, 44, 46, (255, 170, 80), .6); d = ImageDraw.Draw(im)
    t = titos('mummy')
    paste(im, t, 30, 140 - 129, out=False)
    # саркофаг сбоку
    d = ImageDraw.Draw(im)
    s, sd = canvas(CW, CH); sd.polygon([(84, 140), (88, 92), (100, 84), (114, 92), (118, 140)], fill=(200, 160, 70)); sd.polygon([(92, 100), (100, 94), (110, 100), (108, 112), (94, 112)], fill=(80, 140, 150))
    sd.line([(88, 118), (116, 118)], fill=(150, 110, 40)); sd.line([(88, 128), (117, 128)], fill=(150, 110, 40))
    im.alpha_composite(outline(s))
    return vignette(im)

def c05():  # Кто съел конфеты? Титос с лупой, паучок в шляпе
    im, d = sky((72, 70, 120), (112, 100, 150), stars=0, y1=140)
    d.rectangle((0, 0, CW, 118), fill=(140, 142, 196))
    for i in range(160): d.point(((i * 37) % CW, (i * 53) % 110), fill=(132, 134, 190))
    d.rectangle((0, 112, CW, 118), fill=(102, 98, 150))
    ground(d, 118, (112, 80, 62), seed=7)
    for y in range(122, CH, 8): d.line([(0, y), (CW, y)], fill=(92, 64, 50))
    # доска улик
    d.rectangle((70, 12, 116, 52), fill=(150, 104, 70)); d.rectangle((72, 14, 114, 50), fill=(196, 150, 104))
    for x, y in ((78, 20), (100, 18), (88, 36), (106, 40)): d.rectangle((x - 3, y - 2, x + 5, y + 6), fill=(246, 244, 236))
    d.line([(80, 20), (102, 18), (90, 36), (108, 40)], fill=(200, 30, 40)); text3(d, 74, 44, '?', (60, 40, 30))
    # стол: на нём паучок в шляпе, фантики
    tb, td = canvas(CW, CH); td.rectangle((70, 100, 118, 104), fill=(96, 62, 46)); td.rectangle((74, 104, 78, 140), fill=(80, 52, 40)); td.rectangle((110, 104, 114, 140), fill=(80, 52, 40))
    im.alpha_composite(outline(tb))
    sp = spider(hat=True, look=-1); im.alpha_composite(outline(sp.resize((sp.width, sp.height))), (90, 86))
    d = ImageDraw.Draw(im)
    for x, y, c in ((76, 98, 0), (108, 97, 2), (30, 150, 1), (60, 160, 3), (100, 156, 4), (14, 132, 5)):
        im.alpha_composite(candy(CANDY[c], 5), (x, y))
    d = ImageDraw.Draw(im)
    for x, y in ((40, 136), (52, 144), (64, 138), (78, 150), (90, 144)):  # липкие следы
        d.ellipse((x, y, x + 4, y + 2), fill=(170, 90, 140)); d.point([(x - 1, y - 1), (x + 5, y - 1)], fill=(170, 90, 140))
    t = titos(arm='magnifier', hat=True)
    paste(im, t, 2, CH - 8 - 129, out=False)
    d = ImageDraw.Draw(im)
    hx, hy = 2 + 28 + 11 + 26, CH - 8 - 129 + 77  # лупа в руке
    d.line([(hx, hy), (hx + 8, hy + 5)], fill=(90, 60, 40), width=2)
    d.ellipse((hx + 6, hy - 1, hx + 22, hy + 15), fill=(200, 170, 90)); d.ellipse((hx + 8, hy + 1, hx + 20, hy + 13), fill=(196, 226, 240)); d.point([(hx + 11, hy + 4), (hx + 12, hy + 3)], fill=(255, 255, 255))
    d.ellipse((hx + 6, hy - 1, hx + 22, hy + 15), outline=INK)
    return vignette(im, .18)

def c06():  # Полуночный кофе: тыква-фонарь на ночной смене, Титос наливает ей кофе
    im, d = sky((30, 26, 60), (60, 50, 90), stars=0, y1=168)
    d.rectangle((0, 0, CW, 116), fill=(64, 62, 104))
    for i in range(140): d.point(((i * 29) % CW, (i * 41) % 110), fill=(58, 56, 96))
    # окно с луной и часы — полночь
    d.rectangle((70, 10, 112, 56), fill=(70, 56, 50)); d.rectangle((73, 13, 109, 53), fill=(20, 22, 52)); moon(d, 98, 26, 7); d.line([(91, 13), (91, 53)], fill=(70, 56, 50), width=2); d.line([(73, 33), (109, 33)], fill=(70, 56, 50), width=2)
    for i in range(6): d.point(((76 + i * 7) % 108, 16 + (i * 13) % 34), fill=(220, 220, 240))
    d.ellipse((8, 10, 30, 32), fill=(90, 70, 56)); d.ellipse((10, 12, 28, 30), fill=(246, 240, 220)); d.line([(19, 21), (19, 13)], fill=INK); d.line([(19, 21), (19, 14)], fill=INK)
    d.line([(20, 21), (20, 14)], fill=INK)
    ground(d, 116, (90, 64, 52), seed=8)
    # стол
    tb, td = canvas(CW, CH); td.rectangle((54, 112, 120, 117), fill=(96, 62, 46)); td.rectangle((58, 117, 116, 150), fill=(80, 52, 40)); td.rectangle((62, 122, 112, 146), fill=(72, 46, 36))
    im.alpha_composite(outline(tb))
    # тыква-фонарь с чашкой
    jk = pumpkin(30, 24, 'jack', lit=True); paste(im, jk, 82, 112 - jk.height + 1)
    im = glow(im, 97, 98, 30, (255, 180, 70), .6); d = ImageDraw.Draw(im)
    for sx in (80, 112): pass
    cup, cd = canvas(14, 12); cd.rectangle((1, 2, 9, 10), fill=(240, 236, 228)); cd.rectangle((9, 2, 9, 10), fill=(200, 196, 190)); cd.rectangle((2, 2, 8, 3), fill=(70, 40, 26)); cd.ellipse((8, 4, 13, 9), outline=(240, 236, 228), width=2)
    paste(im, outline(cup), 69, 103, out=False)
    # Титос с кофейником, глаза широко открыты — теперь не спят оба
    t = titos(arm='pot', eyes='wide')
    tx, ty = -6, CH - 6 - 129
    paste(im, t, tx, ty, out=False)
    hx, hy = tx + 28 + 11 + 27, ty + 54  # ладонь
    pot, pd = canvas(22, 22)
    pd.polygon([(5, 6), (15, 6), (19, 20), (1, 20)], fill=(206, 226, 236)); pd.rectangle((2, 12, 18, 20), fill=(84, 48, 30)); pd.line([(4, 7), (2, 18)], fill=(240, 250, 255))
    pd.rectangle((5, 2, 15, 6), fill=(40, 40, 46)); pd.polygon([(16, 8), (21, 5), (17, 12)], fill=(206, 226, 236)); pd.arc((-3, 6, 7, 18), 90, 270, fill=(40, 40, 46), width=2)
    pot = outline(pot.rotate(-40, expand=True, resample=Image.NEAREST))
    im.alpha_composite(pot, (hx - 4, hy - 16))
    d = ImageDraw.Draw(im); d.line([(hx + 19, hy + 5), (hx + 14, hy + 17)], fill=(110, 64, 38), width=2); d.line([(hx + 18, hy + 6), (hx + 14, hy + 16)], fill=(150, 96, 60))
    for i in range(3): d.line([(84 + i * 2, 98 - i), (85 + i * 2, 93 - i)], fill=(200, 200, 220))  # пар
    return vignette(im, .2)

def c07():  # Новое лицо: Голова Тыквы вырезала себе испуганное лицо и испугалась сама себя (в зеркале)
    im, d = sky((44, 70, 80), (30, 50, 60), stars=0, y1=168)
    for x in range(0, CW, 8): d.line([(x, 0), (x, 120)], fill=(38, 62, 72))  # обои в полоску
    ground(d, 120, (96, 66, 52), seed=9)
    # туалетный столик с зеркалом
    m, md = canvas(CW, CH)
    md.ellipse((70, 22, 114, 84), fill=(200, 160, 70)); md.ellipse((74, 26, 110, 80), fill=(120, 180, 186))
    md.rectangle((64, 104, 120, 110), fill=(110, 70, 54)); md.rectangle((68, 110, 116, 150), fill=(96, 60, 46)); md.rectangle((72, 116, 112, 128), fill=(110, 70, 54)); md.ellipse((90, 120, 94, 124), fill=(220, 180, 90))
    md.rectangle((88, 84, 96, 104), fill=(200, 160, 70))
    im.alpha_composite(outline(m))
    # отражение: испуганное лицо
    r = pumpkin(26, 22, 'scared', stem=True); paste(im, flipx(r), 80, 40)
    d = ImageDraw.Draw(im)
    for x, y in ((78, 32), (100, 70)): d.line([(x, y), (x + 4, y - 4)], fill=(220, 240, 240))
    # обрезки тыквы и нож на столе
    for x, y in ((70, 101), (76, 102), (106, 101)): d.ellipse((x, y, x + 4, y + 3), fill=PO); d.ellipse((x, y, x + 4, y + 3), outline=INK)
    for x, y in ((112, 102), (84, 103)): d.ellipse((x, y, x + 2, y + 1), fill=(246, 230, 180))
    # сама Голова Тыквы: руки вверх, нож в руке
    lady = pumpkin_lady('scared', arms='up')
    paste(im, lady, 6, 160 - lady.height, out=False)
    d = ImageDraw.Draw(im)
    kx, ky = 6 + 30 + 17 + 8, 160 - lady.height + 24
    d.line([(kx, ky + 2), (kx + 2, ky - 8)], fill=(210, 214, 224), width=2); d.line([(kx - 1, ky + 2), (kx + 1, ky + 5)], fill=(90, 60, 40), width=2)
    # «!» и капельки
    d.rectangle((14, 34, 16, 42), fill=(255, 236, 160)); d.rectangle((14, 45, 16, 47), fill=(255, 236, 160))
    for x, y in ((8, 56), (58, 50)): d.polygon([(x, y), (x - 2, y + 4), (x + 2, y + 4)], fill=(170, 220, 240)); d.ellipse((x - 2, y + 2, x + 2, y + 6), fill=(170, 220, 240))
    return vignette(im)

def c08():  # Тыквенный хор: все поют «У-у-у», одна — «А-а-а»
    im, d = sky((30, 22, 64), (70, 40, 92), stars=30, seed=81, y1=110)
    moon(d, 96, 20, 9)
    # сцена-занавес
    d.rectangle((0, 0, 10, 140), fill=(130, 30, 50)); d.rectangle((110, 0, CW, 140), fill=(130, 30, 50))
    for x in (3, 7, 113, 117): d.line([(x, 0), (x, 140)], fill=(100, 20, 40))
    d.polygon([(0, 0), (CW, 0), (CW, 8), (90, 12), (60, 8), (30, 12), (0, 8)], fill=(150, 36, 58))
    ground(d, 140, (100, 70, 50), seed=10)
    for x in range(0, CW, 10): d.line([(x, 140), (x, CH)], fill=(86, 58, 42))
    # Голова Тыквы в хоре — сзади по центру, с нотами
    lady = pumpkin_lady('o', arms='front', book=True)
    paste(im, lady, 30, 132 - lady.height, out=False)
    # ряд тыкв: у всех «о», у одной — широкое «а»
    for i, (x, w, h, f) in enumerate(((8, 24, 19, 'o'), (32, 26, 21, 'o'), (58, 22, 18, 'a'), (80, 28, 22, 'o'))):
        pk = pumpkin(w, h, f); paste(im, pk, x + 2, 152 - pk.height)
    d = ImageDraw.Draw(im)
    def note(x, y, c):
        d.ellipse((x, y + 5, x + 4, y + 8), fill=c); d.line([(x + 4, y), (x + 4, y + 7)], fill=c); d.line([(x + 4, y), (x + 7, y + 2)], fill=c)
    for x, y in ((18, 104), (44, 98), (96, 102), (104, 86)): note(x, y, (220, 220, 250))
    note(68, 104, (255, 170, 80)); note(74, 92, (255, 170, 80))  # её ноты — другие
    return vignette(im)

def c09():  # Привидение Мистера Чу: дырки для глаз — на затылке
    im, d = sky((22, 26, 54), (60, 70, 100), stars=34, seed=91, y1=120)
    moon(d, 26, 26, 13)
    # кладбищенская ограда и надгробия
    ground(d, 134, (54, 66, 70), seed=11)
    for x in range(0, CW, 8): d.line([(x, 104), (x, 134)], fill=(30, 30, 46)); d.point((x, 103), fill=(30, 30, 46))
    d.line([(0, 110), (CW, 110)], fill=(30, 30, 46)); d.line([(0, 126), (CW, 126)], fill=(30, 30, 46))
    st, sd = canvas(CW, CH)
    for x, h in ((84, 26), (102, 18)): sd.rectangle((x, 134 - h, x + 14, 134), fill=(130, 136, 150)); sd.ellipse((x, 134 - h - 7, x + 14, 134 - h + 7), fill=(130, 136, 150)); sd.line([(x + 4, 134 - h + 2), (x + 10, 134 - h + 2)], fill=(90, 96, 110))
    im.alpha_composite(outline(st))
    g = chew_ghost(); paste(im, g, 14, 156 - g.height)
    d = ImageDraw.Draw(im)
    # испуганный паучок смотрит на «страшную» сторону
    sp = spider(look=1); im.alpha_composite(outline(sp), (2, 150))
    d.rectangle((10, 140, 11, 145), fill=(255, 236, 160)); d.point((10, 147), fill=(255, 236, 160))
    return vignette(im)

def c10():  # Зелье убежало: зелье страха испугалось и сбежало из котла
    im, d = sky((30, 40, 40), (40, 60, 56), stars=0, y1=168)
    for y in range(0, 130, 10):
        for x in range(-(y // 10 % 2) * 8, CW, 16): d.rectangle((x, y, x + 15, y + 9), fill=(56, 70, 66)); d.line([(x, y + 9), (x + 15, y + 9)], fill=(40, 52, 50))
    ground(d, 130, (54, 46, 44), seed=12)
    # полка с банками
    d.rectangle((6, 30, 60, 33), fill=(110, 76, 50))
    for i, c in enumerate(((150, 70, 200), (90, 200, 120), (230, 120, 60), (90, 150, 230))):
        x = 10 + i * 13; d.rectangle((x, 20, x + 8, 30), fill=c); d.rectangle((x + 2, 16, x + 6, 20), fill=(200, 180, 150)); d.line([(x + 1, 22), (x + 1, 28)], fill=L(c, 50))
    # котёл на огне
    # Мистер Чу — за котлом, в ужасе
    c = flipx(mrchew(alarm=True, eyes='wide'))
    paste(im, c, 62, 64, out=False)
    d = ImageDraw.Draw(im); d.rectangle((60, 40, 62, 48), fill=(255, 236, 160)); d.rectangle((60, 51, 62, 53), fill=(255, 236, 160))
    for i, c_ in enumerate(((255, 110, 40), (255, 180, 60), (255, 240, 150))): d.polygon([(26 + i * 3, 150), (35, 130 + i * 4), (44 - i * 3, 150)], fill=c_)
    im = glow(im, 35, 142, 32, (255, 150, 60), .6)
    k, kd = canvas(CW, CH)
    kd.ellipse((10, 102, 60, 144), fill=(40, 38, 46)); kd.ellipse((12, 98, 58, 108), fill=(60, 58, 68)); kd.ellipse((16, 100, 54, 106), fill=(110, 220, 90))
    kd.rectangle((16, 140, 20, 150), fill=(40, 38, 46)); kd.rectangle((50, 140, 54, 150), fill=(40, 38, 46))
    im.alpha_composite(outline(k)); d = ImageDraw.Draw(im)
    for x, y, r in ((26, 101, 2), (44, 100, 3), (36, 97, 2)): d.ellipse((x - r, y - r, x + r, y + r), fill=(160, 240, 130))
    d.arc((18, 110, 32, 132), 110, 200, fill=(80, 78, 90))
    # след зелья — через край котла влево и вниз, капли
    d.line([(56, 104), (62, 112), (66, 124), (72, 136)], fill=(110, 220, 90), width=3)
    for x, y in ((66, 128), (74, 146), (64, 140)): d.ellipse((x, y, x + 3, y + 2), fill=(110, 220, 90))
    # само зелье: зелёная капля с ножками бежит прочь, глаза испуганные
    b, bd = canvas(30, 34)
    bd.polygon([(14, 0), (22, 10), (26, 18), (24, 26), (14, 28), (4, 26), (2, 18), (6, 10)], fill=(110, 220, 90)); bd.ellipse((6, 6, 12, 12), fill=(170, 250, 150))
    for ex in (10, 18): bd.ellipse((ex - 3, 12, ex + 3, 19), fill=(255, 255, 255)); bd.rectangle((ex + 1, 14, ex + 2, 16), fill=INK)
    bd.ellipse((12, 20, 16, 25), fill=(30, 70, 30))
    bd.line([(10, 27), (6, 32)], fill=(80, 180, 70), width=2); bd.line([(18, 27), (24, 31)], fill=(80, 180, 70), width=2)
    paste(im, flipx(outline(b)), 74, 132, out=False)
    d = ImageDraw.Draw(im)
    for y in (142, 150, 158): d.line([(62, y), (68, y)], fill=(200, 230, 200))  # линии бега
    return vignette(im)

CARDS = [c01, c02, c03, c04, c05, c06, c07, c08, c09, c10]

def sheet(ims, path, z=3):
    pad = 10; cols = 5
    out = Image.new('RGB', (cols * (CW * z + pad) + pad, 2 * (CH * z + pad) + pad), (43, 26, 81))
    for i, im in enumerate(ims):
        out.paste(im.convert('RGB').resize((CW * z, CH * z), Image.NEAREST), (pad + (i % cols) * (CW * z + pad), pad + (i // cols) * (CH * z + pad)))
    out.save(path)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    ims = []
    for i, f in enumerate(CARDS):
        im = f().convert('RGB'); assert im.size == (CW, CH)
        im.save(os.path.join(OUT, '%02d.png' % (i + 1)), optimize=True); ims.append(im)
    sheet(ims, os.path.join(OUT, 'sheet.png') if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), 'halloween-2026-sheet.png'))
    print('ok', len(ims))
