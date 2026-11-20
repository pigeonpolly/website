# Прототип карты побольше: 160x270, текст в 26 знаков, до 12 строк.
# Только для сравнения: _held/ny-tarot/proto-big.png + рядом нынешняя 120x206.
import os, sys, math, random
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
sys.path.insert(0, HERE)
from ny_tarot_design import polly, diamond, sparkle, GOLD, GOLD_D, CREAM, BERRY, BERRY_D, INK  # noqa
from pixfont import ctext, width, text

W, H = 160, 270


def vgrad(im, top, bot, y0, y1, steps=14):
    d = ImageDraw.Draw(im)
    for y in range(y0, y1 + 1):
        t = round(min(1, (y - y0) / max(1, y1 - y0)) * steps) / steps
        d.line([(0, y), (W - 1, y)], fill=tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3)))


def wrap(s, maxw):
    words, lines, cur = s.split(), [], ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if width(t) <= maxw:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def card(name, text_ru, hat='scarf', seed=1):
    im = Image.new('RGB', (W, H))
    vgrad(im, (46, 33, 78), (20, 14, 38), 0, H - 1)
    d = ImageDraw.Draw(im)
    rnd = random.Random(seed)
    for _ in range(70):
        x, y = rnd.randrange(6, W - 6), rnd.randrange(6, H - 6)
        d.point((x, y), fill=(240, 236, 255) if rnd.random() < .5 else (255, 246, 214))
    d.rectangle((2, 2, W - 3, H - 3), outline=GOLD)
    d.rectangle((6, 6, W - 7, H - 7), outline=GOLD_D)
    for x, y in ((2, 2), (W - 3, 2), (2, H - 3), (W - 3, H - 3)):
        diamond(d, x, y, GOLD, 2)

    ctext(d, W // 2, 12, 'ПТИЧЬЕ ТАРО', GOLD)
    d.line([(48, 24), (64, 24)], fill=GOLD_D)
    d.line([(96, 24), (112, 24)], fill=GOLD_D)
    diamond(d, W // 2, 24, GOLD, 1)

    # окно
    x0, x1, spring, apex, bottom = 30, 130, 84, 40, 124
    m = Image.new('L', (W, H), 0)
    md = ImageDraw.Draw(m)
    r = (x1 - x0) / 2
    pts = [(x0, bottom), (x0, spring)]
    for i in range(41):
        a = math.pi - i * math.pi / 40
        pts.append((80 + r * math.cos(a), spring - r * math.sin(a)))
    pts += [(x1, spring), (x1, bottom)]
    md.polygon(pts, fill=255)

    sky = Image.new('RGB', (W, H), (0, 0, 0))
    vgrad(sky, (28, 34, 72), (66, 54, 98), 36, bottom, 12)
    sd = ImageDraw.Draw(sky)
    for _ in range(30):
        sd.point((rnd.randrange(34, 126), rnd.randrange(38, 122)), fill=(255, 246, 214))

    # луна и ветка
    sd.ellipse((54, 56, 106, 108), fill=(240, 224, 170))
    sd.ellipse((55, 57, 105, 107), fill=(250, 240, 202))
    for cx, cy, cr in ((70, 70, 4), (90, 86, 3), (76, 98, 2)):
        sd.ellipse((cx - cr, cy - cr, cx + cr, cy + cr), fill=(232, 216, 160))
    br = [(24, 112), (46, 109), (68, 111), (90, 108), (112, 110), (136, 107)]
    sd.line(br, fill=(58, 42, 32), width=3)
    sd.line([(x, y - 2) for x, y in br], fill=(248, 252, 255))
    sd.ellipse((10, 114, 90, 160), fill=(222, 234, 248))
    sd.ellipse((74, 112, 160, 160), fill=(232, 242, 252))

    im.paste(sky, (0, 0), m)
    edge = m.filter(__import__('PIL.ImageFilter', fromlist=['MaxFilter']).MaxFilter(3))
    from PIL import ImageChops
    im.paste(Image.new('RGB', (W, H), GOLD), (0, 0), ImageChops.subtract(edge, m))
    im.paste(polly(hat), (65, 76), polly(hat))
    d = ImageDraw.Draw(im)

    # лента с названием
    d.rectangle((20, 130, 140, 143), fill=GOLD)
    d.rectangle((20, 130, 140, 131), fill=(252, 222, 140))
    d.rectangle((20, 142, 140, 143), fill=GOLD_D)
    ctext(d, 80, 133, name, INK)

    # текст предсказания
    lines = wrap(text_ru, 146)
    if len(lines) > 12:
        raise SystemExit('too long: %d lines' % len(lines))
    for i, ln in enumerate(lines):
        ctext(d, 80, 150 + i * 9, ln, CREAM)

    ctext(d, 80, 258, '2027', GOLD_D)
    return im


if __name__ == '__main__':
    crow = 'В этом году вы были бережливой вороной и под листиками во дворе напрятали много вкусного. Но помните, что надо баловать себя вкусным не только по праздникам. Живите сегодня.'
    im = card('ВОРОНА-ХОЗЯЙКА', crow)
    old = Image.open('site/images/cards/tarot-2027/crow-ru.png')
    out = Image.new('RGB', (old.width * 2 + im.width * 2 + 60, 270 * 2 + 40), (30, 22, 48))
    out.paste(old.resize((old.width * 2, old.height * 2), Image.NEAREST), (20, 20))
    out.paste(im.resize((im.width * 2, im.height * 2), Image.NEAREST), (old.width * 2 + 40, 20))
    out.save('_held/ny-tarot/proto-big.png')
    print('ok', im.size)
