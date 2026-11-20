# Оборот («обложка») карт «Птичье таро» 2027 — 3 варианта под смешанную колоду.
# Запуск: python tools/cards/ny_tarot_backs.py → _held/ny-tarot/backs-sheet.png
import os, sys, math, random
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from ny_tarot_design import (CW, CH, INK, GOLD, GOLD_D, CREAM, BERRY, BERRY_D,
                             PINE, PINE_D, ICE, WHITE, RED, vgrad, stars, frame,
                             diamond, sparkle, ctext, polly, OUT)  # noqa: E402


def silhouette(spr, col):
    im = Image.new('RGBA', spr.size, col + (255,))
    im.putalpha(spr.split()[3])
    return im


# ---------------- A. «Узор» ----------------
def back_a():
    im = Image.new('RGB', (CW, CH))
    vgrad(im, (40, 28, 66), (22, 16, 42))
    d = ImageDraw.Draw(im)
    for y in range(12, CH - 8, 16):
        for x in range(10, CW - 8, 16):
            ox = 8 if (y // 16) % 2 else 0
            d.point([(x + ox, y), (x + ox - 1, y), (x + ox + 1, y), (x + ox, y - 1), (x + ox, y + 1)], fill=(54, 41, 86))
    frame(im, GOLD, GOLD_D)
    for x, y in ((2, 2), (CW - 3, 2), (2, CH - 3), (CW - 3, CH - 3)):
        diamond(d, x, y, GOLD, 2)

    ctext(d, 60, 28, 'ПТИЧЬЕ ТАРО', CREAM)

    d.ellipse((32, 62, 88, 118), fill=(250, 244, 232), outline=GOLD)
    im.paste(polly('scarf'), (45, 76), polly('scarf'))
    d = ImageDraw.Draw(im)
    for x, y in ((60, 64), (60, 116), (34, 90), (86, 90)):
        d.point([(x, y), (x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)], fill=GOLD_D)
    rnd = random.Random(4)
    for _ in range(10):
        x, y = rnd.randrange(36, 84), rnd.randrange(66, 114)
        if not (44 <= x <= 76 and 74 <= y <= 112) and (x - 60) ** 2 + (y - 90) ** 2 < 27 ** 2:
            d.point((x, y), fill=(214, 198, 168))

    d.line([(34, 162), (52, 162)], fill=GOLD_D)
    d.line([(68, 162), (86, 162)], fill=GOLD_D)
    diamond(d, 60, 162, GOLD, 2)
    ctext(d, 60, 176, '2027', GOLD)
    return im


# ---------------- B. «Печать» ----------------
def back_b():
    im = Image.new('RGB', (CW, CH), CREAM)
    d = ImageDraw.Draw(im)
    d.rectangle((3, 3, CW - 4, CH - 4), outline=BERRY)
    d.rectangle((6, 6, CW - 7, CH - 7), outline=GOLD)
    for x, y in ((10, 10), (CW - 11, 10), (10, CH - 11), (CW - 11, CH - 11)):
        for i in range(-3, 4):
            if i:
                d.point((x + i, y), fill=BERRY); d.point((x, y + i), fill=BERRY)
                d.point((x + i, y + i), fill=BERRY); d.point((x + i, y - i), fill=BERRY)
        d.point((x, y), fill=GOLD)

    ctext(d, 60, 30, 'ПТИЧЬЕ ТАРО', BERRY)

    d.ellipse((22, 56, 98, 132), fill=(250, 244, 232), outline=GOLD)
    d.ellipse((25, 59, 95, 129), outline=GOLD_D)
    rnd = random.Random(9)
    for _ in range(14):
        x, y = rnd.randrange(28, 92), rnd.randrange(62, 126)
        if not (44 <= x <= 76 and 76 <= y <= 112):
            d.point((x, y), fill=(214, 198, 168))
    im.paste(polly('beret', 'scarf'), (45, 78), polly('beret', 'scarf'))
    d = ImageDraw.Draw(im)

    d.line([(34, 162), (52, 162)], fill=GOLD_D)
    d.line([(68, 162), (86, 162)], fill=GOLD_D)
    diamond(d, 60, 162, BERRY, 2)
    ctext(d, 60, 176, '2027', BERRY)
    return im


# ---------------- C. «Полночь» ----------------
def back_c():
    im = Image.new('RGB', (CW, CH))
    vgrad(im, (30, 22, 50), (58, 34, 74))
    d = ImageDraw.Draw(im)
    stars(d, 50, 31, 198, 6)
    frame(im, GOLD_D, GOLD)
    for x, y in ((2, 2), (CW - 3, 2), (2, CH - 3), (CW - 3, CH - 3)):
        diamond(d, x, y, GOLD, 2)

    cx, cy = 60, 96
    for ang in range(0, 360, 45):
        a = math.radians(ang)
        ln = 44 if ang % 90 == 0 else 30
        d.line([(cx + math.cos(a) * 6, cy + math.sin(a) * 6),
                (cx + math.cos(a) * ln, cy + math.sin(a) * ln)], fill=GOLD_D)
    d.ellipse((cx - 10, cy - 10, cx + 10, cy + 10), outline=GOLD)
    d.ellipse((cx - 5, cy - 5, cx + 5, cy + 5), fill=GOLD_D)
    d.ellipse((cx - 3, cy - 3, cx + 3, cy + 3), fill=(250, 236, 190))
    for r in (16, 24, 32):
        for ang in range(0, 360, 45):
            a = math.radians(ang + r)
            d.point((int(cx + math.cos(a) * r), int(cy + math.sin(a) * r)), fill=(226, 214, 176))

    ctext(d, 60, 162, 'ПТИЧЬЕ ТАРО', GOLD)
    ctext(d, 60, 176, '2027', GOLD_D)
    return im


def sheet(backs, path, z=3):
    pad = 22
    w = len(backs) * (CW * z + pad) + pad
    h = CH * z + 34 + CH + 24
    out = Image.new('RGB', (w, h), (30, 22, 48))
    dd = ImageDraw.Draw(out)
    for i, im in enumerate(backs):
        x = pad + i * (CW * z + pad)
        out.paste(im.resize((CW * z, CH * z), Image.NEAREST), (x, pad))
        ctext(dd, x + CW * z // 2, pad + CH * z + 8, ['А · УЗОР', 'Б · ПЕЧАТЬ', 'В · ПОЛНОЧЬ'][i], (240, 232, 214))
        # как смотрится в размере 1×
        out.paste(im, (x + CW * z // 2 - CW // 2, pad + CH * z + 26))
    out.save(path)
    return out


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    backs = [back_a(), back_b(), back_c()]
    for name, im in zip(('a', 'b', 'c'), backs):
        im.save(os.path.join(OUT, 'back-%s.png' % name))
    sheet(backs, os.path.join(OUT, 'backs-sheet.png'))
    print('ok')
