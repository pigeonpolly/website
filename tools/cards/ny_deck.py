# Колода «Птичье таро 2027»: 10 карт-образцов на трёх языках (RU/EN/LV).
# Лицо — tools/cards/ny_tarot_design.py (skin_a / skin_b / skin_c), оборот — tools/cards/ny_tarot_backs.py (back_c).
# Запуск: python tools/cards/ny_deck.py → _held/ny-tarot/deck-sheet.png + отдельные карты
import os, sys
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from ny_tarot_design import CW, CH, OUT, skin_a, skin_b, skin_c, ctext  # noqa: E402
from ny_tarot_backs import back_c  # noqa: E402

# ключ, лицо (a/b/c), названия и три строки пожелания на трёх языках
CONTENT = [
    dict(key='feeder', skin='a',
         ru=('КОРМУШКА УДАЧИ', 'СОСЕДИ ДОБРЫЕ,', 'КРОШКИ КРУПНЫЕ,', 'А ГОЛУБИ — СВОИ.'),
         en=('FEEDER OF LUCK', 'KIND NEIGHBOURS,', 'BIG CRUMBS,', 'AND YOUR PIGEONS.'),
         lv=('LAIMES BAROTAVA', 'LABI KAIMIŅI,', 'LIELAS DRUPATAS,', 'UN BALOŽI — SAVI.')),
    dict(key='tit', skin='b',
         ru=('СИНИЦА В РУКАХ', 'ОДНА СИНИЦА', 'В РУКАХ ЛУЧШЕ,', 'ЧЕМ ДВЕ В ЛЕНТЕ.'),
         en=('A TIT IN HAND', 'ONE TIT IN HAND', 'BEATS TWO', 'IN YOUR FEED.'),
         lv=('ZĪLĪTE ROKĀ', 'VIENA ZĪLĪTE ROKĀ', 'LABĀKA PAR DIVĀM', 'ZIŅU LENTĒ.')),
    dict(key='sparrow', skin='c',
         ru=('ВОРОБЕЙ НА ПЛЕЧЕ', 'ПУСТЬ РЯДОМ БУДЕТ', 'КТО-ТО МАЛЕНЬКИЙ', 'И ОЧЕНЬ ГРОМКИЙ.'),
         en=('POCKET SPARROW', 'MAY SOMEONE SMALL', 'AND VERY LOUD', 'STAY CLOSE.'),
         lv=('ZVIRBULIS KABATĀ', 'LAI BLAKUS IR', 'KĀDS MAZIŅŠ', 'UN ĻOTI SKAĻŠ.')),
    dict(key='magpie', skin='a',
         ru=('СОРОКА-ХОЗЯЙКА', 'ВСЁ БЛЕСТЯЩЕЕ,', 'ЧТО ТЫ УТАЩИШЬ,', 'ОКАЖЕТСЯ НУЖНЫМ.'),
         en=('MAGPIE KEEPER', 'EVERYTHING SHINY', 'YOU DRAG HOME', 'WILL BE USEFUL.'),
         lv=('KRAŠŅU ŽAGATA', 'VISS SPĪDĪGAIS,', 'KO AIZNESI,', 'BŪS NODERĪGS.')),
    dict(key='bullfinch', skin='b',
         ru=('СНЕГИРЬ-ВЕСТНИК', 'ПУСТЬ НА ПРОВОДЕ', 'БУДЕТ ТОЛЬКО', 'ХОРОШАЯ НОВОСТЬ.'),
         en=('BULLFINCH ONLINE', 'MAY THE WIRE HOLD', 'ONLY GOOD NEWS', 'ALL YEAR.'),
         lv=('SVILPIS UZ VADA', 'LAI UZ VADA', 'IR TIKAI LABAS', 'ZIŅAS.')),
    dict(key='dove', skin='c',
         ru=('ГОЛУБЬ МИРА', 'ПОМИРИСЬ С ЧАЙКОЙ', 'ДО ОЛИВЬЕ,', 'А ПОТОМ — ЕШЬ.'),
         en=('DOVE OF PEACE', 'MAKE PEACE', 'WITH THE SEAGULL', 'BEFORE DINNER.'),
         lv=('MĪLAS BALODIS', 'SAMIERINIES', 'AR KAIJU PIRMS', 'VAKARIŅĀM.')),
    dict(key='owl', skin='a',
         ru=('ПОЛУНОЧНАЯ СОВА', 'СПИ, СКОЛЬКО', 'ХОЧЕШЬ, И ВСТАВАЙ', 'КОГДА ЗАХОЧЕШЬ.'),
         en=('MIDNIGHT OWL', 'SLEEP AS LONG', 'AS YOU LIKE,', 'WAKE UP LATER.'),
         lv=('PUSNAKTS PŪCE', 'GULI, CIK GRIBI,', 'PAMODIES, KAD', 'IZDOSIES.')),
    dict(key='woodpecker', skin='b',
         ru=('ДЯТЕЛ-РЕМОНТНИК', 'ПУСТЬ СТУЧИТ', 'ТОЛЬКО В ДВЕРЬ', 'С ПОДАРКОМ.'),
         en=('HANDY WOODPECKER', 'MAY EVERY KNOCK', 'BRING A GIFT', 'TO YOUR DOOR.'),
         lv=('DZEŅDZIS DARA', 'LAI KATRS KLUVA', 'NES DĀVANU', 'PIE DURVĪM.')),
    dict(key='seagull', skin='c',
         ru=('ЧАЙКА-ОПТИМИСТ', 'ТВОЯ БУЛОЧКА', 'ПАДАЕТ ВСЕГДА', 'МАСЛОМ ВВЕРХ.'),
         en=('OPTIMIST SEAGULL', 'YOUR BUN LANDS', 'BUTTER-SIDE UP', 'EVERY TIME.'),
         lv=('KAIJA-OPTIMISTE', 'TAVA BULCIŅA', 'KRĪT AR SVIESTU', 'UZ AUGŠU.')),
    dict(key='penguin', skin='a',
         ru=('ПИНГВИН В ШАРФЕ', 'ХОЛОДНО СНАРУЖИ,', 'ТЕПЛО ВНУТРИ,', 'ШАРФ ДЛИННЫЙ.'),
         en=('SCARFED PENGUIN', 'COLD OUTSIDE,', 'WARM INSIDE,', 'SCARF VERY LONG.'),
         lv=('PINGVĪNS ŠALLĒ', 'AUKSTS ĀRĀ,', 'SILTS IEKŠĀ,', 'ŠALLE GARA.')),
]
LANGS = ('ru', 'en', 'lv')
SKINS = {'a': skin_a, 'b': skin_b, 'c': skin_c}


def draw(card, lang):
    name, l1, l2, l3, l4 = card[lang]
    return SKINS[card['skin']](name, (l1, l2, l3, l4))


def deck_sheet(path):
    z = 3
    pad = 16
    lab = 26
    row1_h = CH * z
    row2_z = 2
    row2_h = CH * row2_z
    W = 4 * (CW * z + pad) + pad
    out = Image.new('RGB', (W, row1_h + lab + row2_h + lab + pad * 2), (30, 22, 48))
    d = ImageDraw.Draw(out)
    top = [('ОБОРОТ', back_c())] + [('%s · RU' % t, draw(c, 'ru')) for t, c in zip('АБВ', CONTENT[:3])]
    for i, (label, im) in enumerate(top):
        x = pad + i * (CW * z + pad)
        out.paste(im.resize((CW * z, CH * z), Image.NEAREST), (x, pad))
        ctext(d, x + CW * z // 2, pad + row1_h + 6, label, (240, 232, 214))
    y2 = pad + row1_h + lab
    i = 0
    for lang in ('en', 'lv'):
        for c in CONTENT[:3]:
            im = draw(c, lang)
            x = pad + i * (CW * row2_z + pad)
            out.paste(im.resize((CW * row2_z, CH * row2_z), Image.NEAREST), (x, y2))
            ctext(d, x + CW * row2_z // 2, y2 + row2_h + 6, '%s · %s' % (c['key'].upper(), lang.upper()), (240, 232, 214))
            i += 1
    out.save(path)
    return out


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for c in CONTENT:
        for lang in LANGS:
            draw(c, lang).save(os.path.join(OUT, 'card-%s-%s.png' % (c['key'], lang)))
    deck_sheet(os.path.join(OUT, 'deck-sheet.png'))
    print('ok')
