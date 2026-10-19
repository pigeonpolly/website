# Места происшествия дел Титоса: пиксельные картинки 384×216 (×3) + места для клика в content/titos/NNN.json.
#   python3 tools/rooms/scenes.py [номера дел…]
# Сцена дела — функция в tools/rooms/scenes_cases.py: фон (helpers ниже) + предметы.
#   clue('c5', '🫙', x, y, n)  — важная улика: место `clue` (прикалывают на доску)
#   talk('d', x, y)            — подозреваемый/свидетель: место `talk` (допрос), фигурка из его карточки
#   say(0 | 'текст', '🍂', x, y, n) — мелкий факт: место `say` (просто узнают); 0, 1… — уже записанные в деле
#   x — середина, y — низ предмета, n — размер в пикселях комнаты.
import sys, os, json, random
sys.path.insert(0, os.path.dirname(__file__))
from kit import W, H, INK, L, D, Layer
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
OUT = os.path.join(ROOT, 'site/images/rooms')
SCALE = 3
EMOJI = ImageFont.truetype('/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf', 109)
CARDS = {r['key']: r['card'] for c in json.load(open(os.path.join(ROOT, 'content/wobbleland.json')))['cities'] for r in c['residents'] if r.get('card')}
SPRITES = {'mr-chew': 'ch-chew.png', 'the-pumpkin-family': 'ch-pumpkin.png'}  # жители без карточки — свой спрайт


def outline(im):
    a = np.asarray(im.convert('RGBA')).copy()
    a = np.pad(a, ((1, 1), (1, 1), (0, 0))); m = a[..., 3] > 0; pp = np.pad(m, 1)
    nb = pp[:-2, 1:-1] | pp[2:, 1:-1] | pp[1:-1, :-2] | pp[1:-1, 2:]
    a[nb & ~m] = INK + (255,); return Image.fromarray(a, 'RGBA')


_E = {}
def emo(ch, n, flip=False):
    """Эмодзи → пиксельный спрайт n px по большей стороне: 12 цветов, без полупрозрачности, тёмный контур."""
    k = (ch, n, flip)
    if k not in _E:
        im = Image.new('RGBA', (160, 128)); ImageDraw.Draw(im).text((0, 0), ch, font=EMOJI, embedded_color=True)
        im = im.crop(im.getbbox()); w, h = im.size; s = n / max(w, h)
        im = im.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)
        a = np.asarray(im).copy(); a[..., 3] = np.where(a[..., 3] > 110, 255, 0)
        a[..., :3] = np.asarray(Image.fromarray(a[..., :3]).quantize(12, dither=Image.Dither.NONE).convert('RGB'))
        im = outline(Image.fromarray(a, 'RGBA'))
        _E[k] = im.transpose(Image.FLIP_LEFT_RIGHT) if flip else im
    return _E[k]


def person(key, n=40):
    """Фигурка жителя: медальон из его карточки (как на карте Воббленда), без карточки — спрайт ×2."""
    if key in SPRITES:
        im = Image.open(os.path.join(ROOT, 'site/images/wobbleland', SPRITES[key])).convert('RGBA')
        return im.resize((im.width * 2, im.height * 2), Image.NEAREST)
    im = Image.open(os.path.join(ROOT, 'site/images/cards', CARDS[key])).convert('RGB')
    w, h = im.size; side = w * 0.56; cx, cy = w / 2, h * 0.5
    im = im.crop((int(cx - side / 2), int(cy - side / 2), int(cx + side / 2), int(cy + side / 2)))
    im = ImageEnhance.Color(ImageEnhance.Contrast(im).enhance(1.3)).enhance(1.35)
    px = im.resize((n - 4, n - 4), Image.LANCZOS).quantize(20, Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGBA')
    out = Image.new('RGBA', (n, n)); m = Image.new('L', (n - 4, n - 4)); ImageDraw.Draw(m).ellipse((0, 0, n - 5, n - 5), fill=255)
    d = ImageDraw.Draw(out); d.ellipse((0, 0, n - 1, n - 1), fill=INK); d.ellipse((1, 1, n - 2, n - 2), fill=(246, 236, 210))
    out.paste(px, (2, 2), m); return out


class Scene:
    def __init__(s, case):
        s.case = case; s.bg = Layer(); s.fx = Layer(); s.mist = Layer(); s.items = []; s.spots = []; s.moved = []
        s.night = False; s.glow = []; s.r = random.Random(case['n'])
        s.says = [z['say'] for sc in case.get('scenes', [])[:1] for z in sc.get('spots', []) if 'say' in z]
    def done(s):
        """say(0…) — факты, которые были в деле до картинки (то есть не из текста сцены); повторный запуск их не теряет."""
        mine = {z['say']['ru'] for z in s.spots if isinstance(z.get('say'), dict)}
        old = [t for t in s.says if t['ru'] not in mine]
        for z in s.spots:
            if isinstance(z.get('say'), int): z['say'] = old[z['say']]

    # --- предметы
    def place(s, im, x, y, layer=None):
        """Картинка серединой в x, низом в y (пиксели комнаты). Возвращает рамку."""
        x0, y0 = int(round(x - im.width / 2)), int(round(y - im.height))
        s.items.append((im, x0, y0)); return (x0, y0, x0 + im.width, y0 + im.height)
    def prop(s, ch, x, y, n=16, flip=False): return s.place(emo(ch, n, flip), x, y)
    def spot(s, box, **kw):
        x0, y0, x1, y1 = box; cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        w, h = max(x1 - x0 + 6, 28), max(y1 - y0 + 6, 24)  # не меньше пальца на телефоне
        x0, y0 = max(0, min(W - w, cx - w / 2)), max(0, min(H - h, cy - h / 2))
        s.spots.append({'x': round(x0 / W * 100, 1), 'y': round(y0 / H * 100, 1), 'w': round(w / W * 100, 1), 'h': round(h / H * 100, 1), **kw})
    def clue(s, cid, ch, x, y, n=18, flip=False, move=False):
        s.spot(s.prop(ch, x, y, n, flip), clue=cid)
        if move: s.moved.append(cid)
    def talk(s, sid, x, y, n=40):
        who = {p['id']: p.get('who') for p in s.case['suspects']}[sid]
        b = s.place(person(who, n), x, y - 2)
        s.fx.e((b[0] + 2, y - 3, b[2] - 2, y + 1), (0, 0, 0, 70)); s.spot(b, talk=sid)
    def say(s, what, ch, x, y, n=16, flip=False, h=None):
        """Без картинки (ch=None) — место n×h над точкой x, y на уже нарисованном фоне."""
        txt = what if isinstance(what, int) else {'ru': what}  # номер — уже записанный факт, подставит done()
        s.spot(s.prop(ch, x, y, n, flip) if ch else (x - n / 2, y - (h or n // 2), x + n / 2, y), say=txt)

    # --- фон
    def sky(s, top, bot, y1=H, stars=0):
        for y in range(0, H):  # ниже y1 — цвет горизонта (там обычно земля или стены)
            t = min(1, y / max(1, y1 - 1)); s.bg.r((0, y, W, y), tuple(int(a + (b - a) * t) for a, b in zip(top, bot)))
        for _ in range(stars): s.bg.px([(s.r.randrange(W), s.r.randrange(int(y1 * .7)))], (250, 240, 200))
    def moon(s, x, y, r=9): s.bg.e((x - r, y - r, x + r, y + r), (250, 244, 214)); s.bg.e((x - r + 3, y - r + 2, x - r + 7, y - r + 6), (226, 220, 190)); s.glow.append((x, y, 40))
    def wall(s, y0, y1, c, kind='plain'):
        s.bg.r((0, y0, W, y1), c)
        if kind == 'stripes':
            for x in range(0, W, 16): s.bg.r((x, y0, x + 7, y1), L(c, 10))
        elif kind == 'bricks':
            for y in range(y0, y1, 8):
                s.bg.l([(0, y), (W, y)], D(c, 22))
                for x in range((y // 8 % 2) * 10, W, 20): s.bg.l([(x, y), (x, y + 7)], D(c, 22))
        elif kind == 'planks':
            for x in range(0, W, 14): s.bg.l([(x, y0), (x, y1)], D(c, 20))
        elif kind == 'stone':
            for y in range(y0, y1, 12):
                for x in range((y // 12 % 2) * 14, W, 28): s.bg.box((x + 1, y + 1, x + 26, y + 10), c, 18)
        elif kind == 'web':
            for x0 in (0, W):
                for k in range(1, 6): s.bg.l([(x0, y0), (abs(x0 - k * 26), y1)], L(c, 25))
                for rr in range(20, 140, 24): s.bg.d.arc((x0 - rr, y0 - rr, x0 + rr, y0 + rr), 0, 180, fill=L(c, 25))
        s.bg.r((0, y1 - 3, W, y1), D(c, 30))
    def floor(s, y0, c, kind='planks'):
        s.bg.r((0, y0, W, H), c)
        if kind == 'planks':
            for y in range(y0 + 6, H, 8): s.bg.l([(0, y), (W, y)], D(c, 20))
            for y in range(y0, H, 8):
                for x in range((y * 37) % 60, W, 60): s.bg.l([(x, y), (x, y + 7)], D(c, 20))
        elif kind == 'tiles':
            for y in range(y0, H, 12):
                for x in range(0, W, 12):
                    if (x // 12 + y // 12) % 2: s.bg.r((x, y, x + 11, y + 11), D(c, 18))
        elif kind == 'cobbles':
            for y in range(y0, H, 7):
                for x in range((y // 7 % 2) * 6, W, 12): s.bg.e((x, y, x + 10, y + 5), D(c, 14) if (x + y) % 3 else L(c, 8))
        elif kind == 'grass':
            for _ in range(500): x, y = s.r.randrange(W), s.r.randrange(y0, H); s.bg.l([(x, y), (x + s.r.choice((-1, 0, 1)), y - 2)], D(c, 22) if s.r.random() < .6 else L(c, 18))
        elif kind == 'dirt':
            for _ in range(300): s.bg.px([(s.r.randrange(W), s.r.randrange(y0, H))], D(c, 18))
        elif kind == 'cloud':
            for _ in range(40): x, y = s.r.randrange(-20, W), s.r.randrange(y0 - 6, H); s.bg.e((x, y, x + s.r.randrange(30, 70), y + s.r.randrange(10, 22)), L(c, s.r.choice((8, 16))))
        elif kind == 'snow':
            for _ in range(200): s.bg.px([(s.r.randrange(W), s.r.randrange(y0, H))], (210, 220, 240))
        s.bg.r((0, y0, W, y0), D(c, 30))
    def window(s, x0, y0, x1, y1, frame=(110, 80, 60), view=None, sill=True, curtains=None, lit=False):
        s.bg.box((x0 - 4, y0 - 4, x1 + 4, y1 + 4), frame, 30)
        top, bot = view or (((22, 26, 62), (60, 54, 110)) if s.night else ((160, 196, 230), (220, 230, 240)))
        for y in range(y0, y1 + 1):
            t = (y - y0) / max(1, y1 - y0); s.bg.r((x0, y, x1, y), tuple(int(a + (b - a) * t) for a, b in zip(top, bot)))
        if lit: s.bg.r((x0, y0, x1, y1), (255, 214, 130)); s.glow.append(((x0 + x1) // 2, (y0 + y1) // 2, 60))
        if s.night and not lit:
            for _ in range(6): s.bg.px([(s.r.randrange(x0, x1), s.r.randrange(y0, (y0 + y1) // 2))], (250, 240, 200))
        s.bg.r(((x0 + x1) // 2 - 1, y0, (x0 + x1) // 2, y1), frame); s.bg.r((x0, (y0 + y1) // 2, x1, (y0 + y1) // 2 + 1), frame)
        if curtains:
            s.bg.p([(x0 - 6, y0 - 6), (x0 + 10, y0 - 6), (x0 + 2, y1 + 4), (x0 - 8, y1 + 4)], curtains)
            s.bg.p([(x1 - 10, y0 - 6), (x1 + 6, y0 - 6), (x1 + 8, y1 + 4), (x1 - 2, y1 + 4)], curtains)
        if sill: s.bg.box((x0 - 10, y1 + 4, x1 + 10, y1 + 9), L(frame, 20), 25)
        return y1 + 4  # верх подоконника
    def door(s, x0, y0, x1, y1, c=(120, 80, 56), sign=None):
        s.bg.box((x0 - 3, y0 - 3, x1 + 3, y1), D(c, 30), 20); s.bg.box((x0, y0, x1, y1), c, 25)
        s.bg.r((x0 + 4, y0 + 4, x1 - 4, (y0 + y1) // 2 - 2), D(c, 15)); s.bg.r((x0 + 4, (y0 + y1) // 2 + 2, x1 - 4, y1 - 4), D(c, 15))
        s.bg.e((x1 - 8, (y0 + y1) // 2 - 2, x1 - 4, (y0 + y1) // 2 + 2), (230, 196, 90))
        if sign: s.bg.box((x0 + 3, y0 + 10, x1 - 3, y0 + 22), (240, 230, 200), 20); [s.bg.l([(x0 + 6, y0 + 13 + i * 3), (x1 - 6 - (i * 5) % 9, y0 + 13 + i * 3)], (90, 70, 60)) for i in range(3)]
    def shelf(s, x0, x1, y, c=(130, 90, 60), items=(), n=14):
        s.bg.box((x0, y, x1, y + 4), c, 25)
        if items:
            step = (x1 - x0) / len(items)
            for i, ch in enumerate(items): s.prop(ch, x0 + step * (i + .5), y, n)
    def counter(s, x0, y0, x1, y1, c=(140, 96, 64), top=None):
        s.bg.box((x0, y0, x1, y1), c, 25); s.bg.box((x0 - 4, y0 - 5, x1 + 4, y0), top or L(c, 30), 25)
        for x in range(x0 + 12, x1 - 4, 24): s.bg.r((x, y0 + 6, x + 14, y1 - 6), D(c, 14))
        return y0 - 5
    def table(s, x0, x1, y, c=(150, 100, 70), cloth=None, legs=22):
        if cloth: s.bg.p([(x0 - 4, y), (x1 + 4, y), (x1 + 8, y + legs - 4), (x0 - 8, y + legs - 4)], cloth); s.bg.r((x0 - 4, y, x1 + 4, y + 2), L(cloth, 25))
        else:
            s.bg.box((x0, y, x1, y + 4), c, 25)
            for x in (x0 + 3, x1 - 6): s.bg.r((x, y + 4, x + 3, y + legs), D(c, 20))
        return y
    def rug(s, x0, y0, x1, y1, c=(150, 60, 60)):
        s.bg.p([(x0 + 10, y0), (x1 - 10, y0), (x1, y1), (x0, y1)], c); s.bg.p([(x0 + 14, y0 + 3), (x1 - 14, y0 + 3), (x1 - 6, y1 - 3), (x0 + 6, y1 - 3)], L(c, 25))
    def house(s, x0, x1, ytop, ybot, c, roof=(120, 60, 50), lit=()):
        s.bg.box((x0, ytop, x1, ybot), c, 20)
        s.bg.p([(x0 - 6, ytop), ((x0 + x1) // 2, ytop - (x1 - x0) // 3), (x1 + 6, ytop)], roof)
        for i, (wx, wy) in enumerate(((x0 + 8, ytop + 10), (x1 - 20, ytop + 10))):
            if wy + 14 < ybot: s.bg.box((wx, wy, wx + 12, wy + 14), (255, 214, 130) if i in lit else (60, 60, 100), 20)
    def lamp(s, x, yb, h=70):
        s.bg.r((x - 1, yb - h, x + 1, yb), (40, 36, 50)); s.bg.r((x - 4, yb - 3, x + 4, yb), (40, 36, 50))
        s.bg.box((x - 5, yb - h - 10, x + 5, yb - h), (255, 220, 130), 20); s.glow.append((x, yb - h - 5, 50))
    def fence(s, x0, x1, y, c=(170, 130, 90), h=18):
        s.bg.r((x0, y - h + 4, x1, y - h + 6), c); s.bg.r((x0, y - 6, x1, y - 4), c)
        for x in range(x0, x1, 8): s.bg.p([(x, y), (x, y - h), (x + 2, y - h - 3), (x + 5, y - h), (x + 5, y)], L(c, 15))
    def pond(s, x0, y0, x1, y1, c=(70, 110, 150)):
        s.bg.e((x0 - 4, y0 - 3, x1 + 4, y1 + 3), (90, 120, 70)); s.bg.e((x0, y0, x1, y1), c)
        for i in range(5): x = x0 + 14 + i * (x1 - x0 - 28) // 5; yy = (y0 + y1) // 2 + (i % 2) * 4; s.bg.l([(x, yy), (x + 8, yy)], L(c, 40))
    def fog(s, c=(255, 170, 210), a=70, y0=0, y1=H, k=14):
        for _ in range(k): x, y = s.r.randrange(-30, W), s.r.randrange(y0, y1); s.mist.e((x, y, x + s.r.randrange(50, 110), y + s.r.randrange(8, 16)), c + (a,))
    def bigprop(s, ch, x, y, n): return s.prop(ch, x, y, n)  # декор без места для клика
    def books(s, x0, y0, x1, y1, c=(110, 76, 52)):
        s.bg.box((x0, y0, x1, y1), c, 20)
        for y in range(y0 + 4, y1 - 4, 22):
            x = x0 + 4
            while x < x1 - 8:
                w = s.r.randrange(3, 7); h = s.r.randrange(13, 18); col = s.r.choice(((170, 60, 60), (60, 100, 150), (70, 130, 80), (200, 170, 80), (120, 80, 140), (220, 210, 190)))
                s.bg.box((x, y + 18 - h, x + w, y + 18), col, 20); x += w + 1
            s.bg.r((x0 + 2, y + 18, x1 - 2, y + 21), D(c, 25))
    def boxes(s, x0, yb, cols, rows, w=26, h=20, labels=True):
        for i in range(cols):
            for j in range(rows - (i % 2)):
                x, y = x0 + i * (w + 2), yb - (j + 1) * (h + 1); col = (206, 170, 120) if (i + j) % 2 else (196, 158, 108)
                s.bg.box((x, y, x + w, y + h), col, 25); s.bg.l([(x, y + 4), (x + w, y + 4)], D(col, 30))
                if labels: s.bg.r((x + 5, y + 8, x + w - 5, y + 14), (246, 240, 224)); s.bg.l([(x + 7, y + 11), (x + w - 9, y + 11)], (90, 80, 70))
    def bench(s, x0, x1, y, c=(150, 96, 60)):
        s.bg.box((x0, y - 22, x1, y - 18), c, 25); s.bg.box((x0, y - 12, x1, y - 8), c, 25)
        for x in (x0 + 5, x1 - 9): s.bg.r((x, y - 8, x + 4, y), (60, 50, 50))
        return y - 12
    def cauldron(s, x, y, w=60, soup=(120, 170, 80)):
        s.bg.e((x - w // 2, y - w * 2 // 3, x + w // 2, y), (50, 46, 56)); s.bg.e((x - w // 2 + 4, y - w * 2 // 3 - 4, x + w // 2 - 4, y - w * 2 // 3 + 8), soup)
        s.bg.r((x - w // 2 - 4, y - w * 2 // 3, x + w // 2 + 4, y - w * 2 // 3 + 3), (70, 66, 76))
        for i in range(3): s.mist.e((x - 20 + i * 14, y - w - 30 - i * 6, x - 4 + i * 14, y - w - 10 - i * 6), (240, 240, 250, 120))
        s.glow.append((x, y - 10, 50))
        return y - w * 2 // 3
    def mirror(s, x0, y0, x1, y1, cloth=(200, 190, 170)):
        s.bg.box((x0 - 4, y0 - 4, x1 + 4, y1 + 4), (190, 150, 70), 30); s.bg.r((x0, y0, x1, y1), (170, 200, 220))
        if cloth: s.bg.p([(x0 - 6, y0 - 6), (x1 + 6, y0 - 6), (x1 + 8, y1 + 10), (x0 + (x1 - x0) // 2, y1 + 4), (x0 - 8, y1 + 10)], cloth)
    def lights(s, x0, x1, y, sag=10, c=(255, 220, 120)):
        pts = [(x, y + sag * (1 - ((x - x0) / (x1 - x0) * 2 - 1) ** 2)) for x in range(x0, x1 + 1, 4)]
        s.bg.l(pts, (50, 40, 50))
        for i, (x, yy) in enumerate(pts[::4]): s.bg.e((x - 2, yy, x + 2, yy + 4), c); s.glow.append((x, yy + 2, 16)) if s.night else None
    def columns(s, xs, y0, y1, c=(220, 210, 200)):
        for x in xs: s.bg.box((x - 8, y0, x + 8, y1), c, 25); s.bg.box((x - 12, y0 - 6, x + 12, y0), L(c, 10), 20); s.bg.box((x - 12, y1, x + 12, y1 + 5), L(c, 10), 20)
    def tomb(s, x, y, w=22, h=30, c=(150, 150, 160)):
        s.bg.p([(x - w // 2, y), (x - w // 2, y - h + w // 2), (x, y - h), (x + w // 2, y - h + w // 2), (x + w // 2, y)], c)
        s.bg.e((x - w // 2, y - h, x + w // 2, y - h + w), c); s.bg.l([(x - 5, y - h + 12), (x + 5, y - h + 12)], D(c, 40)); s.bg.l([(x, y - h + 7), (x, y - h + 18)], D(c, 40))
    def radiator(s, x0, yb, n=8, c=(200, 200, 206)):
        for i in range(n): s.bg.box((x0 + i * 7, yb - 34, x0 + i * 7 + 5, yb - 4), c, 25)
        s.bg.r((x0 - 2, yb - 8, x0 + n * 7, yb - 6), D(c, 30)); return yb - 34
    def stall(s, x0, x1, yb, c=(200, 70, 60)):
        s.bg.box((x0, yb - 30, x1, yb), (160, 110, 70), 25)
        for x in range(x0 - 6, x1 + 6, 12): s.bg.p([(x, yb - 70), (x + 12, yb - 70), (x + 12, yb - 58), (x, yb - 58)], c if (x - x0) // 12 % 2 else (246, 240, 224))
        for x in (x0 + 2, x1 - 4): s.bg.r((x, yb - 70, x + 2, yb - 30), (90, 60, 40))
        return yb - 30

    # --- готово
    def render(s):
        im = Image.new('RGBA', (W, H), (0, 0, 0, 255)); im.alpha_composite(s.bg.im)
        for sp, x, y in s.items: im.alpha_composite(sp, (x, y))
        im.alpha_composite(s.fx.im)
        from PIL import ImageFilter
        im.alpha_composite(s.mist.im.filter(ImageFilter.GaussianBlur(4)))
        if s.night:  # вечер: темнее и синее, у ламп и окон — тёплые пятна
            a = np.asarray(im.convert('RGB')).astype(float) / 255
            out = a * np.array((.62, .62, .82)); yy, xx = np.mgrid[0:H, 0:W]
            for x, y, r in s.glow: out += a * (np.clip(1 - np.hypot(xx - x, yy - y) / r, 0, 1) ** 1.5 * .5)[..., None] * np.array((1, .85, .55))
            im = Image.fromarray((np.clip(np.round(out * 40) / 40, 0, 1) * 255).astype(np.uint8)).convert('RGBA')
        return im.convert('RGB').resize((W * SCALE, H * SCALE), Image.NEAREST)


def run(nums=None):
    import scenes_cases
    done = []
    for name in sorted(n for n in dir(scenes_cases) if n.startswith('case_')):
        n = int(name[5:])
        if nums and n not in nums: continue
        path = os.path.join(ROOT, f'content/titos/{n:03d}.json'); case = json.load(open(path))
        sc = Scene(case); getattr(scenes_cases, name)(sc); sc.done()
        img = f'titos-scene-{n:03d}.png'
        sc.render().save(os.path.join(OUT, img), optimize=True)
        s0 = case['scenes'][0]; s0['img'] = '/images/rooms/' + img
        # сначала большие места (люди), сверху — мелкие улики: в сцене позже в списке = выше
        s0['spots'] = sorted(sc.spots, key=lambda z: -(z['w'] * z['h']))
        for c in case['clues']:
            if c['id'] in sc.moved: c['at'] = 'scene:' + s0['id']
        with open(path, 'w') as f: f.write(json.dumps(case, ensure_ascii=False, indent=2) + '\n')
        done.append(n)
    print('сцены:', done)


if __name__ == '__main__':
    run({int(a) for a in sys.argv[1:]})
