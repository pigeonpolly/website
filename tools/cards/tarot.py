# Сборка колоды «Птичье таро 2027»: 100 карт × 3 языка + оборот.
# Запуск: python tools/cards/tarot.py → site/images/cards/tarot-2027/<ключ>-<ru|en|lv>.png, back.png
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.dirname(HERE))
from ny_tarot_design import skin_a, skin_b, skin_c, check_width  # noqa: E402
from ny_tarot_backs import back_c  # noqa: E402
from tarot_content import CARDS  # noqa: E402

SKINS = {'a': skin_a, 'b': skin_b, 'c': skin_c}
LANGS = (('ru', 4), ('en', 5), ('lv', 6))
OUT = os.path.join(HERE, '..', '..', 'site', 'images', 'cards', 'tarot-2027')


def build():
    os.makedirs(OUT, exist_ok=True)
    for i, card in enumerate(CARDS):
        key, skin, hat, prop = card[0], card[1], card[2], card[3]
        for lang, idx in LANGS:
            name, l1, l2, l3 = card[idx]
            check_width(name, 104, '%s/%s name' % (key, lang))
            for l in (l1, l2, l3):
                check_width(l, 104, '%s/%s line' % (key, lang))
            im = SKINS[skin](name, (l1, l2, l3), hat=hat or 'scarf', prop=(prop or None) if skin != 'c' else None, seed=i + 1)
            im.save(os.path.join(OUT, '%s-%s.png' % (key, lang)), optimize=True)
    back_c().save(os.path.join(OUT, 'back.png'), optimize=True)
    print('ok', len(CARDS) * 3 + 1, OUT)


if __name__ == '__main__':
    build()
