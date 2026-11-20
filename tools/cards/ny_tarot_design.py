# «Птичье таро» — три лица карты 120x206 к Новому году 2027. Пиксель-арт + шрифт 5x7.
# Черновик дизайна: python tools/cards/ny_tarot_design.py → _held/ny-tarot/design-sheet.png
# Готовые карты колоды собирает tools/cards/ny_deck.py (те же skin_a / skin_b / skin_c).
import os, sys, math, random
from PIL import Image, ImageDraw, ImageChops, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.dirname(HERE)
sys.path.insert(0, TOOLS)
from pixfont import text, ctext, width, shadow_text  # noqa: E402

CW, CH = 120, 206
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


def polly(*layers):
    """Спрайт Полли из tools/polly_sprite.py; его служебные layers.js/png уводим в _held."""
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


def stars(d, n, seed, y1, y0=0, cols=None):
    rnd = random.Random(seed)
    cols = cols or [(255, 246, 214), (214, 222, 255), (255, 255, 255)]
    for _ in range(n):
        x, y = rnd.randrange(4, CW - 4), rnd.randrange(y0 + 3, y1)
        c = rnd.choice(cols)
        d.point((x, y), fill=c)
        if rnd.random() < .22: d.point([(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)], fill=(196, 190, 235))
        if rnd.random() < .06: d.point([(x - 1, y - 1), (x + 1, y - 1), (x - 1, y + 1), (x + 1, y + 1)], fill=c)


def arch_mask(x0=20, x1=100, spring=70, apex=30, bottom=138):
    """Окно с круглым верхом: полукруг радиусом 40 + прямые бока."""
    m = Image.new('L', (CW, CH), 0)
    md = ImageDraw.Draw(m)
    r = (x1 - x0) / 2
    pts = [(x0, bottom), (x0, spring)]
    for i in range(41):
        a = math.pi - i * math.pi / 40
        pts.append((60 + r * math.cos(a), spring - r * math.sin(a)))
    pts += [(x1, spring), (x1, bottom)]
    md.polygon(pts, fill=255)
    return m


def border_from_mask(im, m, col, grow=1):
    big = m.filter(ImageFilter.MaxFilter(grow * 2 + 1))
    edge = ImageChops.subtract(big, m)
    im.paste(Image.new('RGB', (CW, CH), col), (0, 0), edge)


def inner_line(im, m, col):
    small = m.filter(ImageFilter.MinFilter(3))
    edge = ImageChops.subtract(m, small)
    im.paste(Image.new('RGB', (CW, CH), col), (0, 0), edge)


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


def frame(im, c1, c2, pad=2):
    d = ImageDraw.Draw(im)
    d.rectangle((pad, pad, CW - 1 - pad, CH - 1 - pad), outline=c1)
    d.rectangle((pad + 3, pad + 3, CW - 4 - pad, CH - 4 - pad), outline=c2)


def check_width(t, maxw, what=''):
    w = width(t)
    if w > maxw:
        raise ValueError('%s: строка «%s» %d px > %d px' % (what, t, w, maxw))


# ---------------- A. «Классическое таро» ----------------
def skin_a(name='КОРМУШКА УДАЧИ', lines=('СОСЕДИ ДОБРЫЕ,', 'КРОШКИ КРУПНЫЕ,', 'А ГОЛУБИ — СВОИ.'), hat='scarf', prop=None, seed=1):
    check_width(name, 104, 'A name')
    for l in lines: check_width(l, 104, 'A line')
    im = Image.new('RGB', (CW, CH))
    vgrad(im, (46, 33, 78), (20, 14, 38))
    d = ImageDraw.Draw(im)
    stars(d, 46, seed, 150)
    frame(im, GOLD, GOLD_D)
    for x, y in ((2, 2), (CW - 3, 2), (2, CH - 3), (CW - 3, CH - 3)):
        diamond(d, x, y, GOLD, 2)

    ctext(d, 60, 10, 'ПТИЧЬЕ ТАРО', GOLD)
    d.line([(38, 20), (54, 20)], fill=GOLD_D); d.line([(66, 20), (82, 20)], fill=GOLD_D)
    diamond(d, 60, 20, GOLD, 1)

    m = arch_mask()
    sky = Image.new('RGB', (CW, CH), (0, 0, 0))
    vgrad(sky, (28, 34, 72), (66, 54, 98), 28, 138, 12)
    sd = ImageDraw.Draw(sky)
    stars(sd, 22, 7, 132, 32)
    # луна-ореол, Полли на её фоне
    sd.ellipse((34, 62, 86, 114), fill=(240, 224, 170))
    sd.ellipse((35, 63, 85, 113), fill=(250, 240, 202))
    for cx, cy, cr in ((50, 76, 4), (70, 92, 3), (56, 104, 2), (76, 72, 2)):
        sd.ellipse((cx - cr, cy - cr, cx + cr, cy + cr), fill=(232, 216, 160))
    # сугробы
    sd.ellipse((-16, 118, 70, 168), fill=(222, 234, 248))
    sd.ellipse((50, 116, 140, 168), fill=(232, 242, 252))
    sd.line([(0, 120), (14, 122), (32, 121), (50, 124), (70, 122), (92, 124), (110, 122), (120, 120)], fill=(248, 252, 255))
    # ветка под луной, со снегом сверху
    br = [(4, 116), (24, 113), (46, 115), (66, 112), (86, 114), (106, 111), (118, 114)]
    sd.line(br, fill=(58, 42, 32), width=3)
    sd.line([(x, y - 2) for x, y in br], fill=(248, 252, 255))
    sd.line([(30, 114), (26, 120)], fill=(58, 42, 32))
    sd.line([(92, 113), (97, 119)], fill=(58, 42, 32))
    im.paste(sky, (0, 0), m)
    inner_line(im, m, GOLD_D)
    border_from_mask(im, m, GOLD)

    im.paste(polly(hat), (45, 81), polly(hat))
    d = ImageDraw.Draw(im)
    if prop:
        from props import draw as prop_draw
        p = prop_draw(prop)
        if p: im.paste(p, (84, 124) if seed % 2 else (12, 124), p)
        d = ImageDraw.Draw(im)
    rnd = random.Random(seed + 4)
    for _ in range(44):
        x, y = rnd.randrange(22, 98), rnd.randrange(32, 134)
        if not (43 <= x <= 77 and 80 <= y <= 117) and m.getpixel((x, y)):
            d.point((x, y), fill=(240, 246, 255))

    # лента с названием
    d.rectangle((8, 144, 112, 157), fill=GOLD)
    d.rectangle((8, 144, 112, 145), fill=(252, 222, 140))
    d.rectangle((8, 156, 112, 157), fill=GOLD_D)
    d.rectangle((7, 143, 113, 158), outline=GOLD_D)
    ctext(d, 60, 147, name, INK)

    for i, line in enumerate(lines):
        ctext(d, 60, 160 + i * 10, line, CREAM)

    ctext(d, 60, 192, '2027', GOLD_D)
    return im


# ---------------- B. «Новогодняя открытка» ----------------
def skin_b(name='СИНИЦА В РУКАХ', lines=('ОДНА СИНИЦА', 'В РУКАХ ЛУЧШЕ,', 'ЧЕМ ДВЕ В ЛЕНТЕ.'), hat='santa', prop=None, seed=1):
    check_width(name, 104, 'B name')
    for l in lines: check_width(l, 104, 'B line')
    im = Image.new('RGB', (CW, CH), CREAM)
    d = ImageDraw.Draw(im)
    rnd = random.Random(11)
    for _ in range(80):
        x, y = rnd.randrange(6, CW - 6), rnd.randrange(6, CH - 6)
        d.point((x, y), fill=(238, 226, 205))
    d.rectangle((3, 3, CW - 4, CH - 4), outline=BERRY)
    d.rectangle((6, 6, CW - 7, CH - 7), outline=GOLD)
    for x, y in ((3, 3), (CW - 4, 3), (3, CH - 4), (CW - 4, CH - 4)):
        diamond(d, x, y, BERRY, 2)

    # гирлянда
    gy = [(12, 16), (26, 21), (40, 23), (60, 24), (80, 23), (94, 21), (108, 16)]
    d.line(gy, fill=PINE_D)
    for i, (x, y) in enumerate(gy[1:-1]):
        c = [RED, GOLD, PINE, BERRY][i % 4]
        d.ellipse((x - 2, y, x + 2, y + 4), fill=c)
        d.point((x - 1, y + 1), fill=(255, 240, 200))
        d.point((x, y + 4), fill=GOLD_D)

    # заголовок
    shadow_text(d, (CW - width('С НОВЫМ', 2)) // 2, 30, 'С НОВЫМ', BERRY, BERRY_D, 2)
    shadow_text(d, (CW - width('ГОДОМ!', 2)) // 2, 48, 'ГОДОМ!', BERRY, BERRY_D, 2)

    # снежная полоса
    top = [(0, 114), (14, 110), (28, 113), (44, 109), (60, 112), (76, 109), (92, 113), (106, 110), (119, 114)]
    d.polygon(top + [(119, 136), (0, 136)], fill=WHITE)
    d.line(top, fill=(228, 238, 247))

    # ели
    def tree(x, base, h, half, c=PINE):
        for t in range(3):
            ty = base - h + t * h // 3
            by = base - h + (t + 1) * h // 3 + 3
            hw = int(half * (t + 1) / 3) + 1
            d.polygon([(x, ty), (x - hw, by), (x + hw, by)], fill=c)
            d.point([(x, ty), (x - 1, ty + 1), (x + 1, ty + 1)], fill=(240, 248, 253))
        d.rectangle((x - 1, base - 5, x + 1, base), fill=(96, 62, 42))
    tree(13, 134, 52, 14)
    tree(23, 134, 32, 9, PINE_D)
    tree(107, 134, 54, 14)
    tree(97, 134, 32, 9, PINE_D)

    im.paste(polly(hat), (45, 86), polly(hat))
    d = ImageDraw.Draw(im)
    if prop:
        from props import draw as prop_draw
        p = prop_draw(prop)
        if p: im.paste(p, (90, 112) if seed % 2 else (16, 112), p)
        d = ImageDraw.Draw(im)
    sparkle(d, 82, 100, 7, GOLD)
    sparkle(d, 88, 93, 4, (255, 236, 170))

    rnd = random.Random(3)
    for _ in range(26):
        x, y = rnd.randrange(10, CW - 10), rnd.randrange(66, 132)
        d.point((x, y), fill=(255, 255, 255))
    for x, y, r in ((24, 74, 5), (98, 66, 6), (30, 122, 4), (94, 124, 5)):
        for i in range(-r, r + 1):
            if i:
                d.point((x + i, y), fill=ICE); d.point((x, y + i), fill=ICE)
                d.point((x + i, y + i), fill=ICE); d.point((x + i, y - i), fill=ICE)
        d.point((x, y), fill=GOLD)

    # лента с названием
    d.rectangle((8, 140, 112, 151), fill=BERRY)
    d.rectangle((8, 140, 112, 141), fill=(220, 92, 128))
    d.rectangle((8, 150, 112, 151), fill=BERRY_D)
    ctext(d, 60, 143, name, CREAM)

    for i, line in enumerate(lines):
        ctext(d, 60, 157 + i * 10, line, INK)
    ctext(d, 60, 189, '— ПОЛЛИ, 2027', BERRY)
    return im


# ---------------- C. «Минимал» ----------------
def skin_c(name='ПОЛУНОЧНАЯ СОВА', lines=('СПИ СКОЛЬКО ХОЧЕШЬ', 'И ВСТАВАЙ, КОГДА', 'ЗАХОЧЕТСЯ.'), hat='beret', prop=None, seed=1):
    check_width(name, 104, 'C name')
    for l in lines: check_width(l, 104, 'C line')
    im = Image.new('RGB', (CW, CH))
    vgrad(im, (24, 74, 68), (11, 42, 42))
    d = ImageDraw.Draw(im)
    d.rectangle((3, 3, CW - 4, CH - 4), outline=GOLD)

    ctext(d, 60, 10, 'ПТИЧЬЕ ТАРО', GOLD, 1, 2)
    ctext(d, 60, 22, name, CREAM)

    d.ellipse((20, 32, 100, 112), outline=GOLD_D)
    sparkle(d, 60, 48, 8, GOLD)
    for i in range(8):
        a = math.radians(i * 45)
        d.point((int(60 + math.cos(a) * 33), int(70 + math.sin(a) * 33)), fill=(72, 122, 114))

    im.paste(polly(hat, 'scarf'), (45, 74), polly(hat, 'scarf'))
    d = ImageDraw.Draw(im)
    if prop:
        from props import draw as prop_draw
        p = prop_draw(prop)
        if p: im.paste(p, (84, 94) if seed % 2 else (24, 94), p)
        d = ImageDraw.Draw(im)
    for x, y in ((28, 42), (92, 38), (24, 98), (96, 96)):
        d.point((x, y), fill=(255, 250, 220))

    for i, line in enumerate(lines):
        ctext(d, 60, 126 + i * 10, line, CREAM)
    ctext(d, 60, 162, '2027', GOLD_D)
    for x in (26, 43, 60, 77, 94):
        d.point([(x, 178), (x - 1, 179), (x + 1, 179), (x, 180)], fill=GOLD_D)
    return im


def sheet(cards, path, z=3, pad=22):
    w = len(cards) * (CW * z + pad) + pad
    h = CH * z + pad * 2 + 26
    out = Image.new('RGB', (w, h), (30, 22, 48))
    dd = ImageDraw.Draw(out)
    labels = ['А · КЛАССИКА', 'Б · ОТКРЫТКА', 'В · МИНИМАЛ']
    for i, im in enumerate(cards):
        x = pad + i * (CW * z + pad)
        out.paste(im.resize((CW * z, CH * z), Image.NEAREST), (x, pad))
        ctext(dd, x + CW * z // 2, pad + CH * z + 8, labels[i], (240, 232, 214))
    out.save(path)
    return out


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    cards = [skin_a(), skin_b(), skin_c()]
    for name, im in zip(('a', 'b', 'c'), cards):
        im.save(os.path.join(OUT, 'card-%s.png' % name))
    sheet(cards, os.path.join(OUT, 'design-sheet.png'))
    print('ok')
