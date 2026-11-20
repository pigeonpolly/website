# Сборка колоды «Птичье таро 2027»: 100 карт × 3 языка + оборот, 160x270.
# Запуск: python tools/cards/tarot.py → site/images/cards/tarot-2027/<ключ>-<ru|en|lv>.png, back.png
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.dirname(HERE))
from ny_tarot_design import skin_a, skin_b, skin_c, check_width, CW, CH, TEXT_W, MAX_LINES  # noqa: E402
from ny_tarot_backs import back_c  # noqa: E402
from tarot_content import CARDS  # noqa: E402
from pixfont import width  # noqa: E402

SKINS = {'a': skin_a, 'b': skin_b, 'c': skin_c}
LANGS = ('ru', 'en', 'lv')
OUT = os.path.join(HERE, '..', '..', 'site', 'images', 'cards', 'tarot-2027')


def wrap(s, maxw=TEXT_W):
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


def build():
    os.makedirs(OUT, exist_ok=True)
    for i, card in enumerate(CARDS):
        key, skin, hat, prop = card['key'], card['skin'], card['hat'], card['prop']
        for lang in LANGS:
            name, txt = card[lang]
            check_width(name, 140, '%s/%s name' % (key, lang))
            lines = wrap(txt)
            if len(lines) > MAX_LINES:
                raise SystemExit('%s/%s: %d строк (макс %d)' % (key, lang, len(lines), MAX_LINES))
            im = SKINS[skin](name, lines, hat=hat or 'scarf', prop=(prop or None) if skin != 'c' else None, seed=i + 1)
            im.save(os.path.join(OUT, '%s-%s.png' % (key, lang)), optimize=True)
    back_c().save(os.path.join(OUT, 'back.png'), optimize=True)
    print('ok', len(CARDS) * 3 + 1, OUT)


if __name__ == '__main__':
    build()
