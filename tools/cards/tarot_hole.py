# Карточка-шутка «Дырка» для «Птичьего таро 2027» (колода в шапке): 10 нажатий «Открыть карту», пока не прошёл час,
# и выпадает карточка, где Полли говорит, что от такого клевания в одно место может образоваться дырка.
# В колоду (100 карт) не входит: отдельные файлы hole-<ru|en|lv>.png, 160x270, как вся колода.
# Запуск: python tools/cards/tarot_hole.py → site/images/cards/tarot-2027/
import os, sys, math, random
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.dirname(HERE))
from ny_tarot_design import skin_a, check_width, TEXT_W, MAX_LINES  # noqa: E402
from pixfont import width  # noqa: E402
from tarot import OUT, wrap  # noqa: E402
from PIL import ImageDraw  # noqa: E402

# (название на ленте, текст предсказания) — голос Полли, три языка
CARDS = {
    'ru': ('ДЫРКА', 'Если так часто клевать в одно место, там может образоваться дырка.'),
    'en': ('A HOLE', "Peck the same spot this often and you'll peck a hole right through."),
    'lv': ('CAURUMS', 'Ja tik bieži knābā vienā vietā, tur var izveidoties caurums.'),
}
SNOW = (222, 234, 248)
CREAM = (246, 236, 217)
INK = (26, 21, 40)


def peck_hole(im):
    """Дырка в карточке справа от клюва Полли: светлый рваный край бумаги, чернота внутри, крошки и трещинки."""
    d = ImageDraw.Draw(im)
    cx, cy = 101, 113
    rnd = random.Random(7)
    outer, inner = [], []
    for i in range(20):
        a = 2 * math.pi * i / 20
        outer.append((cx + (9 + rnd.choice([-2, -1, 0, 0, 0, 1, 2])) * math.cos(a),
                      cy + (7 + rnd.choice([-1, -1, 0, 0, 0, 1])) * math.sin(a)))
        inner.append((cx + (6.5 + rnd.choice([-1, 0, 0, 0, 1])) * math.cos(a),
                      cy + (5 + rnd.choice([-1, 0, 0, 0, 1])) * math.sin(a)))
    d.polygon(outer, fill=CREAM)          # срез бумаги — светлая кромка
    d.polygon(inner, fill=(6, 5, 10))     # сама дырка
    # тень внутри у нижнего края и блик у верхнего
    for i in range(len(inner)):
        x1, y1 = inner[i]
        x2, y2 = inner[(i + 1) % len(inner)]
        my = (y1 + y2) / 2
        if my > cy + 1:
            d.line([(x1, y1), (x2, y2)], fill=(30, 26, 44))
    # крошки бумаги и снега рядом
    for x, y, c in ((88, 104, CREAM), (112, 102, CREAM), (119, 112, SNOW), (111, 122, SNOW), (85, 118, SNOW)):
        d.point((x, y), fill=c)
    # следы клюва: мелкие точки на снегу перед дыркой
    for x, y in ((89, 110), (92, 114), (95, 107)):
        d.point((x, y), fill=(18, 14, 26))
    # трещинки на снегу от клюва к дырке
    for x1, y1, x2, y2 in ((89, 107, 93, 108), (90, 112, 94, 112), (91, 117, 95, 116)):
        d.line([(x1, y1), (x2, y2)], fill=INK)


def build():
    os.makedirs(OUT, exist_ok=True)
    for i, (lang, (name, txt)) in enumerate(CARDS.items()):
        check_width(name, 140, 'hole/%s name' % lang)
        lines = wrap(txt)
        if len(lines) > MAX_LINES:
            raise SystemExit('hole/%s: %d строк (макс %d)' % (lang, len(lines), MAX_LINES))
        for ln in lines:
            if width(ln) > TEXT_W:
                raise SystemExit('hole/%s: строка шире %d px — «%s»' % (lang, TEXT_W, ln))
        im = skin_a(name, lines, seed=99 + i, lang=lang)  # шапка «Птичье таро» по языку (TITLE в ny_tarot_design)
        peck_hole(im)
        im.save(os.path.join(OUT, 'hole-%s.png' % lang), optimize=True)
    print('ok', len(CARDS), OUT)


if __name__ == '__main__':
    build()
