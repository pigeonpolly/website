# «Птичье таро 2027» — лица карты 160x270 с полным текстом предсказания.
# Голос: предсказание от голубя. Текст переносится сам (tools/cards/tarot.py).
import os, sys, math, random
from PIL import Image, ImageDraw, ImageChops, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.dirname(HERE)
sys.path.insert(0, TOOLS)
from pixfont import ctext, width, text  # noqa: E402

CW, CH = 160, 270
INK = (26, 21, 40)
GOLD = (242, 193, 78)
GOLD_D = (176, 128, 40)
CREAM = (246, 236, 217)
BERRY = (200, 51, 95)
BERRY_D = (148, 32, 68)
PINE = (47, 93, 80)
PINE_D = (30, 62, 55)
ICE = (207, 228, 242)
WHITE = (255, 252, 245)
RED = (214, 58, 58)

OUT = os.path.join(TOOLS, '..', '_held', 'ny-tarot')
SPR = {}
TEXT_TOP = 150
LINE_H = 9
MAX_LINES = 11
TEXT_W = 144


def polly(*layers):
    key = tuple(layers)
    if key in SPR:
        return SPR[key]
    if 'polly_sprite' not in sys.modules:
        import builtins
        tmp = os.path.join(os.path.dirname(OUT), '_sprite_tmp')
        os.makedirs(tmp, exist_ok=True)
        orig = builtins.open

        def _open(f, *a, **k):
            if isinstance(f, str) and f in ('layers.js', 'layers.png'):
                return orig(os.path.join(tmp, f), *a, **k)
            return orig(f, *a, **k)

        builtins.open = _open
        try:
            import polly_sprite  # noqa: F401
        finally:
            builtins.open = orig
    ps = sys.modules['polly_sprite']
    im = ps.full(*[getattr(ps, n) for n in layers]).img(1)
    SPR[key] = im
    return im


def vgrad(im, top, bot, y0=0, y1=CH - 1, steps=16):
    d = ImageDraw.Draw(im)
    for y in range(y0, y1 + 1):
        t = round(min(1, (y - y0) / max(1, y1 - y0)) * steps) / steps
        d.line([(0, y), (CW - 1, y)], fill=tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3)))


def stars(d, n, seed, y1, y0=0):
    rnd = random.Random(seed)
    for _ in range(n):
        x, y = rnd.randrange(6, CW - 6), rnd.randrange(y0 + 3, y1)
        c = rnd.choice([(255, 246, 214), (214, 222, 255), (255, 255, 255)])
        d.point((x, y), fill=c)
        if rnd.random() < .2: d.point([(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)], fill=(196, 190, 235))


def diamond(d, x, y, c, r=2):
    for i in range(-r, r + 1):
        for j in range(-r, r + 1):
            if abs(i) + abs(j) <= r: d.point((x + i, y + j), fill=c)


def sparkle(d, x, y, r, c):
    d.line([(x - r, y), (x + r, y)], fill=c)
    d.line([(x, y - r), (x, y + r)], fill=c)
    h = r // 2
    d.line([(x - h, y - h), (x + h, y + h)], fill=c)
    d.line([(x + h, y - h), (x - h, y + h)], fill=c)
    d.point((x, y), fill=c)


def frame(im, c1, c2):
    d = ImageDraw.Draw(im)
    d.rectangle((2, 2, CW - 3, CH - 3), outline=c1)
    d.rectangle((6, 6, CW - 7, CH - 7), outline=c2)
    for x, y in ((2, 2), (CW - 3, 2), (2, CH - 3), (CW - 3, CH - 3)):
        diamond(d, x, y, c1, 2)


def arch_mask(x0=30, x1=130, spring=84, apex=40, bottom=124):
    m = Image.new('L', (CW, CH), 0)
    md = ImageDraw.Draw(m)
    r = (x1 - x0) / 2
    pts = [(x0, bottom), (x0, spring)]
    for i in range(41):
        a = math.pi - i * math.pi / 40
        pts.append((80 + r * math.cos(a), spring - r * math.sin(a)))
    pts += [(x1, spring), (x1, bottom)]
    md.polygon(pts, fill=255)
    return m


def border_from_mask(im, m, col, grow=1):
    big = m.filter(ImageFilter.MaxFilter(grow * 2 + 1))
    im.paste(Image.new('RGB', (CW, CH), col), (0, 0), ImageChops.subtract(big, m))


def inner_line(im, m, col):
    small = m.filter(ImageFilter.MinFilter(3))
    im.paste(Image.new('RGB', (CW, CH), col), (0, 0), ImageChops.subtract(m, small))


# надписи на карте по языку
TITLE = {'ru': 'ПТИЧЬЕ ТАРО', 'en': 'BIRD TAROT', 'lv': 'PUTNU TARO'}
GREET = {'ru': ('С НОВЫМ', 'ГОДОМ!'), 'en': ('HAPPY', 'NEW YEAR!'), 'lv': ('AR JAUNO', 'GADU!')}


def check_width(t, maxw, what=''):
    w = width(t)
    if w > maxw:
        raise ValueError('%s: «%s» %d px > %d px' % (what, t, w, maxw))


def text_block(d, lines, color, top=TEXT_TOP):
    if len(lines) > MAX_LINES:
        raise ValueError('слишком длинный текст: %d строк' % len(lines))
    for i, ln in enumerate(lines):
        ctext(d, CW // 2, top + i * LINE_H, ln, color)


# ---------------- A. «Классическое таро» ----------------
def skin_a(name='КОРМУШКА УДАЧИ', lines=(), hat='scarf', prop=None, seed=1, lang='ru'):
    check_width(name, 140, 'A name')
    im = Image.new('RGB', (CW, CH))
    vgrad(im, (46, 33, 78), (20, 14, 38))
    d = ImageDraw.Draw(im)
    stars(d, 70, seed, CH - 10)
    frame(im, GOLD, GOLD_D)

    ctext(d, 80, 12, TITLE[lang], GOLD)
    d.line([(48, 24), (64, 24)], fill=GOLD_D)
    d.line([(96, 24), (112, 24)], fill=GOLD_D)
    diamond(d, 80, 24, GOLD, 1)

    m = arch_mask()
    sky = Image.new('RGB', (CW, CH), (0, 0, 0))
    vgrad(sky, (28, 34, 72), (66, 54, 98), 36, 124, 12)
    sd = ImageDraw.Draw(sky)
    stars(sd, 26, seed + 7, 120, 38)
    sd.ellipse((54, 54, 106, 106), fill=(240, 224, 170))
    sd.ellipse((55, 55, 105, 105), fill=(250, 240, 202))
    for cx, cy, cr in ((70, 68, 4), (90, 84, 3), (76, 96, 2)):
        sd.ellipse((cx - cr, cy - cr, cx + cr, cy + cr), fill=(232, 216, 160))
    br = [(22, 110), (44, 107), (66, 109), (88, 106), (110, 108), (138, 105)]
    sd.line(br, fill=(58, 42, 32), width=3)
    sd.line([(x, y - 2) for x, y in br], fill=(248, 252, 255))
    sd.ellipse((8, 112, 90, 160), fill=(222, 234, 248))
    sd.ellipse((72, 110, 160, 160), fill=(232, 242, 252))
    im.paste(sky, (0, 0), m)
    inner_line(im, m, GOLD_D)
    border_from_mask(im, m, GOLD)

    im.paste(polly(hat), (65, 74), polly(hat))
    d = ImageDraw.Draw(im)
    rnd = random.Random(seed + 4)
    for _ in range(40):
        x, y = rnd.randrange(34, 126), rnd.randrange(38, 120)
        if not (63 <= x <= 97 and 72 <= y <= 110) and m.getpixel((x, y)):
            d.point((x, y), fill=(240, 246, 255))

    d.rectangle((20, 130, 140, 143), fill=GOLD)
    d.rectangle((20, 130, 140, 131), fill=(252, 222, 140))
    d.rectangle((20, 142, 140, 143), fill=GOLD_D)
    d.rectangle((19, 129, 141, 144), outline=GOLD_D)
    ctext(d, 80, 133, name, INK)

    text_block(d, lines, CREAM)
    ctext(d, 80, 258, '2027', GOLD_D)
    return im


# ---------------- B. «Новогодняя открытка» ----------------
def skin_b(name='СИНИЦА В РУКАХ', lines=(), hat='santa', prop=None, seed=1, lang='ru'):
    check_width(name, 140, 'B name')
    im = Image.new('RGB', (CW, CH), CREAM)
    d = ImageDraw.Draw(im)
    rnd = random.Random(seed + 11)
    for _ in range(120):
        x, y = rnd.randrange(8, CW - 8), rnd.randrange(8, CH - 8)
        d.point((x, y), fill=(238, 226, 205))
    d.rectangle((2, 2, CW - 3, CH - 3), outline=BERRY)
    d.rectangle((6, 6, CW - 7, CH - 7), outline=GOLD)
    for x, y in ((2, 2), (CW - 3, 2), (2, CH - 3), (CW - 3, CH - 3)):
        diamond(d, x, y, BERRY, 2)

    gy = [(25, 18), (50, 24), (80, 27), (110, 24), (135, 18)]
    d.line(gy, fill=PINE_D)
    for i, (x, y) in enumerate(gy[1:-1]):
        c = [RED, GOLD, PINE, BERRY][i % 4]
        d.ellipse((x - 3, y, x + 3, y + 5), fill=c)
        d.point((x - 1, y + 1), fill=(255, 240, 200))

    shadow = (150, 60, 90)
    for i, (t, y) in enumerate(((GREET[lang][0], 36), (GREET[lang][1], 54))):
        text(d, 80 - width(t, 2) // 2 + 1, y + 1, t, shadow, 2)
        text(d, 80 - width(t, 2) // 2, y, t, BERRY, 2)

    top = [(8, 98), (30, 94), (52, 97), (80, 93), (108, 97), (130, 94), (152, 98)]
    d.polygon(top + [(152, 130), (8, 130)], fill=WHITE)
    d.line(top, fill=(228, 238, 247))

    def tree(x, base, h, half, c=PINE):
        for t in range(3):
            ty = base - h + t * h // 3
            by = base - h + (t + 1) * h // 3 + 4
            hw = int(half * (t + 1) / 3) + 1
            d.polygon([(x, ty), (x - hw, by), (x + hw, by)], fill=c)
            d.point([(x, ty), (x - 1, ty + 1), (x + 1, ty + 1)], fill=(240, 248, 253))
        d.rectangle((x - 1, base - 6, x + 1, base), fill=(96, 62, 42))
    tree(18, 124, 62, 16)
    tree(32, 124, 38, 10, PINE_D)
    tree(142, 124, 64, 16)
    tree(128, 124, 38, 10, PINE_D)

    im.paste(polly(hat), (65, 80), polly(hat))
    d = ImageDraw.Draw(im)
    sparkle(d, 108, 96, 8, GOLD)
    sparkle(d, 116, 86, 5, (255, 236, 170))
    rnd = random.Random(seed + 3)
    for _ in range(30):
        d.point((rnd.randrange(14, CW - 14), rnd.randrange(70, 122)), fill=(255, 255, 255))

    d.rectangle((18, 130, 142, 143), fill=BERRY)
    d.rectangle((18, 130, 142, 131), fill=(220, 92, 128))
    d.rectangle((18, 142, 142, 143), fill=BERRY_D)
    ctext(d, 80, 133, name, CREAM)

    text_block(d, lines, INK)
    ctext(d, 80, 258, '2027', BERRY)
    return im


# ---------------- C. «Минимал» ----------------
def skin_c(name='ПОЛУНОЧНАЯ СОВА', lines=(), hat='beret', prop=None, seed=1, lang='ru'):
    check_width(name, 140, 'C name')
    im = Image.new('RGB', (CW, CH))
    vgrad(im, (24, 74, 68), (11, 42, 42))
    d = ImageDraw.Draw(im)
    d.rectangle((2, 2, CW - 3, CH - 3), outline=GOLD)

    ctext(d, 80, 12, TITLE[lang], GOLD, 1, 2)
    ctext(d, 80, 26, name, CREAM)

    d.ellipse((32, 40, 128, 136), outline=GOLD_D)
    sparkle(d, 80, 58, 9, GOLD)
    for i in range(8):
        a = math.radians(i * 45)
        d.point((int(80 + math.cos(a) * 43), int(88 + math.sin(a) * 43)), fill=(72, 122, 114))

    im.paste(polly(hat, 'scarf'), (65, 78), polly(hat, 'scarf'))
    d = ImageDraw.Draw(im)
    for x, y in ((40, 50), (120, 46), (36, 120), (124, 116)):
        d.point((x, y), fill=(255, 250, 220))

    text_block(d, lines, CREAM, top=146)
    ctext(d, 80, 258, '2027', GOLD_D)
    return im
