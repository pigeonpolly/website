# Оборот колоды «Птичье таро 2027» — 160x270, вариант «Полночь» (выбран Алиной).
import os, sys, math
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.dirname(HERE))
from ny_tarot_design import (CW, CH, GOLD, GOLD_D, diamond, sparkle, stars, vgrad,  # noqa: E402
                             ctext, TITLE)
from pixfont import width  # noqa: E402

OUT = os.path.join(HERE, '..', '..', 'site', 'images', 'cards', 'tarot-2027')


def back_c(lang='ru'):
    im = Image.new('RGB', (CW, CH))
    vgrad(im, (30, 22, 50), (58, 34, 74))
    d = ImageDraw.Draw(im)
    stars(d, 80, 31, CH - 8, 6)
    d.rectangle((2, 2, CW - 3, CH - 3), outline=GOLD_D)
    d.rectangle((6, 6, CW - 7, CH - 7), outline=GOLD)
    for x, y in ((2, 2), (CW - 3, 2), (2, CH - 3), (CW - 3, CH - 3)):
        diamond(d, x, y, GOLD, 2)

    cx, cy = 80, 120
    for ang in range(0, 360, 45):
        a = math.radians(ang)
        ln = 54 if ang % 90 == 0 else 38
        d.line([(cx + math.cos(a) * 7, cy + math.sin(a) * 7),
                (cx + math.cos(a) * ln, cy + math.sin(a) * ln)], fill=GOLD_D)
    d.ellipse((cx - 12, cy - 12, cx + 12, cy + 12), outline=GOLD)
    d.ellipse((cx - 6, cy - 6, cx + 6, cy + 6), fill=GOLD_D)
    d.ellipse((cx - 4, cy - 4, cx + 4, cy + 4), fill=(250, 236, 190))
    for r in (20, 30, 40):
        for ang in range(0, 360, 45):
            a = math.radians(ang + r)
            d.point((int(cx + math.cos(a) * r), int(cy + math.sin(a) * r)), fill=(226, 214, 176))

    ctext(d, 80, 206, TITLE[lang], GOLD)
    ctext(d, 80, 222, '2027', GOLD_D)
    sparkle(d, 80, 40, 7, GOLD_D)
    return im


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for lang in TITLE:
        back_c(lang).save(os.path.join(OUT, 'back-%s.png' % lang), optimize=True)
    back_c().save(os.path.join(OUT, '..', '..', '..', '..', '_held', 'ny-tarot', 'back.png'))
    print('ok')
