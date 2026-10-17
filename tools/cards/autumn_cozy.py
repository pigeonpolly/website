# Коллекция «Autumn Cozy»: 30 обычных карточек 120×168 (пиксель-арт) — осень и уют (№78–107).
# Не повторяет «Fall Season 2025» Алины (какао, плед, пирог, варенье, чайник, лампа, вязание, грибы, суп, зефир…): новые звери, вещи и еда.
# Фон — пиксельная «акварельная заливка» из halloween_remix.py, в углу — кленовый лист, внизу у персонажей — 5 кружков статов,
# у предметов — эффект. Рамка, номер и 🤖 — CSS сайта.
# Запуск: python3 tools/cards/autumn_cozy.py [папка] — по умолчанию site/images/cards/autumn-cozy/ (78.png … 107.png); с папкой — ещё лист sheet.png.
import sys, os, random
sys.path.insert(0, os.path.dirname(__file__))
import halloween as H
import halloween_remix as R
from halloween import CW, CH, INK, L, D, canvas, outline, flipx
from halloween_remix import wash, text3, stats, hp, shadow, eyes
from PIL import Image, ImageDraw

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '../../site/images/cards/autumn-cozy')

RUST, OCHRE, CREAM, MOSS, PLUM = (200, 112, 72), (226, 174, 92), (244, 228, 196), (160, 170, 112), (160, 112, 130)
RAIN, PEACH, ROSE, SAGE, CLAY = (150, 170, 192), (236, 178, 128), (226, 160, 150), (178, 196, 150), (214, 150, 110)
PAPER = (250, 246, 236)
LEAVES = [(200, 70, 50), (228, 130, 50), (236, 186, 70), (170, 60, 60), (190, 150, 60)]

def leaf(d, x, y, c, s=1):
    """маленький кленовый лист; s — масштаб (1 — 7 px)"""
    p = [(0, -3), (1, -1), (3, -2), (2, 0), (3, 1), (1, 1), (0, 3), (-1, 1), (-3, 1), (-2, 0), (-3, -2), (-1, -1)]
    d.polygon([(x + a * s, y + b * s) for a, b in p], fill=c)
    d.line([(x, y), (x, y + 3 * s + 1)], fill=D(c, 50))

def fall(im, seed, n=7, box=(4, 4, 100, 140)):
    """падающие листья по фону"""
    r = random.Random(seed); d = ImageDraw.Draw(im)
    for _ in range(n): leaf(d, r.randint(box[0], box[2]), r.randint(box[1], box[3]), r.choice(LEAVES))

def badge(im):
    """кленовый лист в правом верхнем углу (как тыква у хеллоуинских)"""
    d = ImageDraw.Draw(im); d.ellipse((102, 3, 118, 19), fill=PAPER, outline=INK); leaf(d, 110, 10, (210, 80, 46), 2)
    return im

def chip(im, t, x=4, c=INK):
    """плашка эффекта предмета внизу: «+2 MOOD», «-1 CAFF»…"""
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((x, 152, x + 4 * len(t) + 4, 163), 3, fill=PAPER, outline=INK); text3(d, x + 3, 155, t, c)
    return x + 4 * len(t) + 8

def chips(im, *ts):
    x = 4
    for t in ts: x = chip(im, t, x)
    return im

def steam(d, x, y, n=2, c=(255, 255, 255)):
    for i in range(n):
        xx = x + i * 6
        d.line([(xx, y), (xx - 2, y - 4), (xx, y - 8), (xx - 2, y - 12)], fill=c)

def rain(im, seed, n=40, c=(230, 240, 250)):
    r = random.Random(seed); d = ImageDraw.Draw(im)
    for _ in range(n):
        x, y = r.randint(0, CW), r.randint(0, 146); d.line([(x, y), (x - 1, y + 3)], fill=c)

def floor(im, y, c):
    d = ImageDraw.Draw(im); d.rectangle((0, y, CW, 148), fill=c)
    for x in range(0, CW, 14): d.line([(x, y), (x, 148)], fill=D(c, 14))

# ---------- персонажи ----------
def c78():  # Hedgewig Bramble — ёжик, на иголках застряли листья, на голове берет
    im = wash([PEACH, OCHRE, CREAM], 78); fall(im, 78, 5)
    f, d = canvas(84, 64); BR, BRd = (120, 84, 60), (86, 58, 42)
    for i in range(14):  # иголки
        x = 6 + i * 5; d.polygon([(x, 30), (x + 3, 4 + (i % 3) * 3 - (6 if 3 < i < 10 else 0)), (x + 6, 30)], fill=BRd if i % 2 else BR)
    d.ellipse((4, 14, 74, 62), fill=BR); d.ellipse((10, 20, 64, 50), fill=L(BR, 14))
    d.ellipse((46, 26, 82, 60), fill=(236, 210, 170)); d.polygon([(70, 36), (84, 44), (70, 50)], fill=(236, 210, 170))
    d.ellipse((80, 41, 84, 46), fill=INK); eyes(d, 64, 64, 38, 2, white=False)
    d.ellipse((60, 46, 68, 50), fill=(236, 150, 140))
    for (x, y), c in zip(((14, 10), (30, 6), (44, 12), (22, 24), (8, 34)), LEAVES): leaf(d, x, y, c, 2)
    d.ellipse((50, 14, 76, 26), fill=(150, 60, 70)); d.rectangle((62, 10, 64, 14), fill=(150, 60, 70))  # берет
    shadow(im, 58, 136, 70); im.alpha_composite(outline(f), (16, 72))
    return stats(badge(im), [3, 2, 1, 3, 2])

def c79():  # Professor Owlistair Tweed — сова в твидовом пиджаке и очках, засыпает над книгой
    im = wash([PLUM, (190, 150, 160), PEACH], 79)
    f, d = canvas(70, 100); OW, OWd, OWl = (150, 118, 86), (110, 84, 60), (220, 196, 160)
    d.ellipse((6, 0, 64, 56), fill=OW); d.polygon([(10, 6), (16, -2), (22, 6)], fill=OWd); d.polygon([(48, 6), (54, -2), (60, 6)], fill=OWd)
    d.polygon([(4, 44), (66, 44), (68, 98), (2, 98)], fill=(132, 120, 96))  # твид
    for y in range(48, 98, 4): d.line([(4, y), (66, y)], fill=(116, 104, 82))
    for x in range(6, 66, 4): d.line([(x, 46), (x, 98)], fill=(144, 132, 108))
    d.polygon([(26, 44), (44, 44), (35, 70)], fill=OWl)
    d.ellipse((12, 14, 34, 36), fill=OWl); d.ellipse((36, 14, 58, 36), fill=OWl)
    d.arc((16, 20, 30, 32), 200, 340, fill=INK); d.arc((40, 20, 54, 32), 200, 340, fill=INK)  # спит
    d.ellipse((12, 14, 34, 36), outline=(200, 170, 80)); d.ellipse((36, 14, 58, 36), outline=(200, 170, 80)); d.line([(34, 24), (36, 24)], fill=(200, 170, 80))
    d.polygon([(32, 32), (38, 32), (35, 40)], fill=(236, 170, 60))
    d.rectangle((14, 74, 56, 92), fill=(120, 50, 50)); d.rectangle((16, 76, 34, 90), fill=PAPER); d.rectangle((36, 76, 54, 90), fill=PAPER)  # книга
    for y in (79, 82, 85): d.line([(18, y), (32, y)], fill=(180, 170, 160)); d.line([(38, y), (52, y)], fill=(180, 170, 160))
    im.alpha_composite(outline(f), (24, 36)); shadow(im, 60, 140, 64)
    d = ImageDraw.Draw(im); text3(d, 82, 34, 'Z', PAPER); text3(d, 88, 26, 'Z', PAPER); text3(d, 96, 20, 'Z', PAPER)
    return stats(badge(im), [2, 2, 3, 2, 2])

def c80():  # Rusty Roamwell — лис-путешественник с рюкзаком и картой, которую держит вверх ногами
    im = wash([SAGE, MOSS, OCHRE], 80); fall(im, 80, 4)
    f, d = canvas(84, 110); FX, FXd = (220, 112, 50), (180, 80, 36)
    d.polygon([(4, 60), (0, 96), (20, 104), (24, 80)], fill=FX); d.polygon([(0, 96), (6, 104), (20, 104)], fill=PAPER)  # хвост
    d.rounded_rectangle((8, 40, 32, 84), 6, fill=(90, 110, 70)); d.rectangle((12, 50, 28, 60), fill=(70, 90, 54))  # рюкзак
    d.ellipse((6, 32, 34, 44), fill=(160, 60, 50))  # скатка
    d.rounded_rectangle((24, 44, 60, 96), 10, fill=FX); d.ellipse((32, 56, 52, 90), fill=PAPER)
    d.rectangle((28, 94, 36, 108), fill=(60, 40, 36)); d.rectangle((48, 94, 56, 108), fill=(60, 40, 36))
    d.polygon([(22, 10), (28, -0), (34, 12)], fill=FXd); d.polygon([(48, 12), (56, 0), (60, 12)], fill=FXd)
    d.ellipse((20, 6, 62, 44), fill=FX); d.polygon([(36, 30), (62, 28), (76, 34), (62, 40), (40, 42)], fill=PAPER)
    d.ellipse((72, 31, 77, 36), fill=INK); eyes(d, 36, 52, 22, 2, white=False)
    d.rectangle((50, 54, 82, 76), fill=(236, 220, 170)); d.line([(54, 70), (60, 62), (68, 66), (78, 58)], fill=(200, 60, 60))  # карта
    text3(d, 56, 57, 'N', INK); d.point([(70, 72), (74, 60)], fill=INK)
    d.line([(66, 54), (66, 76)], fill=(200, 184, 140))
    shadow(im, 60, 140, 66); im.alpha_composite(outline(f), (18, 32))
    return stats(badge(im), [3, 2, 2, 3, 1])

def c81():  # Barnaby Burrows — барсук-пекарь в фартуке, с буханкой на закваске
    im = wash([CREAM, OCHRE, CLAY], 81)
    f, d = canvas(80, 112); GR, GRd = (120, 120, 130), (80, 80, 90)
    d.rounded_rectangle((8, 44, 72, 106), 16, fill=GR)
    d.polygon([(18, 50), (62, 50), (66, 106), (14, 106)], fill=PAPER); d.rectangle((26, 74, 54, 88), fill=(236, 230, 214))  # фартук
    d.ellipse((10, 0, 70, 52), fill=PAPER); d.polygon([(22, 6), (34, 6), (36, 46), (26, 46)], fill=INK); d.polygon([(46, 6), (58, 6), (54, 46), (44, 46)], fill=INK)
    d.ellipse((8, 2, 20, 14), fill=GRd); d.ellipse((60, 2, 72, 14), fill=GRd)
    eyes(d, 30, 50, 26, 2); d.ellipse((35, 36, 45, 43), fill=INK); d.point((38, 37), fill=(140, 140, 150))
    d.rectangle((24, -4, 56, 6), fill=PAPER); d.ellipse((20, -12, 60, 4), fill=PAPER)  # колпак
    d.ellipse((20, 62, 64, 82), fill=(190, 120, 60)); d.ellipse((22, 62, 62, 76), fill=(214, 150, 80))  # буханка
    for x in (30, 40, 50): d.line([(x, 66), (x + 4, 72)], fill=(244, 210, 150))
    im.alpha_composite(outline(f), (20, 34)); shadow(im, 60, 144, 70)
    d = ImageDraw.Draw(im); steam(d, 54, 90, 3)
    for x, y in ((14, 70), (100, 60), (20, 110), (98, 100)): d.point((x, y), fill=PAPER); d.point((x + 2, y + 1), fill=PAPER)  # мука
    return stats(badge(im), [2, 4, 1, 2, 3])

def c82():  # Nutmeg Hazelton — белка под зонтиком из кленового листа, прячет орехи в карманы
    im = wash([RAIN, (180, 196, 210), OCHRE], 82); rain(im, 82, 34)
    f, d = canvas(90, 116); SQ, SQd = (190, 100, 50), (150, 72, 36)
    d.ellipse((0, 30, 40, 100), fill=SQ); d.ellipse((8, 40, 32, 92), fill=L(SQ, 24))  # хвост
    d.rounded_rectangle((26, 66, 62, 112), 12, fill=SQ); d.ellipse((34, 74, 54, 106), fill=CREAM)
    d.ellipse((24, 40, 64, 76), fill=SQ); d.polygon([(28, 44), (30, 30), (38, 42)], fill=SQd); d.polygon([(50, 42), (58, 30), (60, 44)], fill=SQd)
    eyes(d, 36, 52, 56, 3); d.ellipse((42, 64, 46, 67), fill=INK); d.point([(32, 66), (56, 66)], fill=(236, 140, 130))
    d.ellipse((30, 92, 38, 100), fill=(140, 90, 50)); d.ellipse((50, 94, 58, 102), fill=(140, 90, 50))  # орехи
    d.line([(62, 80), (70, 6)], fill=(90, 60, 40), width=2)
    LF = (220, 80, 40)
    d.polygon([(70, 0), (78, 6), (90, 4), (86, 14), (90, 22), (70, 18), (50, 22), (54, 14), (50, 4), (62, 6)], fill=LF)
    d.line([(70, 2), (70, 18)], fill=D(LF, 50)); d.line([(56, 8), (70, 12), (84, 8)], fill=D(LF, 50))
    im.alpha_composite(outline(f), (14, 28)); shadow(im, 58, 142, 60)
    return stats(badge(im), [4, 1, 2, 2, 2])

def c83():  # Sir Puddlesworth — утка в жёлтом дождевике прыгает в лужу и пугается отражения
    im = wash([RAIN, (170, 190, 210), SAGE], 83); rain(im, 83, 40)
    d = ImageDraw.Draw(im)
    d.ellipse((10, 124, 110, 146), fill=(110, 140, 176)); d.ellipse((18, 128, 102, 142), fill=(130, 160, 196))  # лужа
    f, d2 = canvas(70, 96); YL, YLd = (246, 206, 60), (210, 168, 40)
    d2.polygon([(10, 40), (60, 40), (66, 80), (4, 80)], fill=YL); d2.line([(35, 42), (35, 80)], fill=YLd)
    for y in (50, 60, 70): d2.ellipse((37, y, 40, y + 3), fill=YLd)
    d2.ellipse((16, 6, 54, 44), fill=PAPER); d2.polygon([(50, 26), (68, 28), (66, 34), (50, 34)], fill=(240, 150, 50))
    eyes(d2, 34, 44, 20, 2); d2.line([(30, 14), (36, 12)], fill=INK)
    d2.chord((10, 0, 60, 26), 180, 360, fill=YL); d2.rectangle((6, 12, 64, 15), fill=YL)  # зюйдвестка
    for x in (18, 42): d2.rectangle((x, 80, x + 10, 94), fill=(40, 120, 90))  # сапоги
    im.alpha_composite(outline(f), (26, 22))
    r = flipx(f).transpose(Image.FLIP_TOP_BOTTOM).resize((48, 20), Image.NEAREST); r.putalpha(r.getchannel('A').point(lambda v: v // 3))
    im.alpha_composite(r, (36, 124))
    d = ImageDraw.Draw(im); text3(d, 84, 46, '!', INK); text3(d, 88, 40, '!', INK)
    for x, y in ((14, 120), (100, 118), (8, 112), (106, 110)): d.ellipse((x, y, x + 4, y + 4), fill=(200, 220, 240))
    return stats(badge(im), [1, 1, 2, 4, 2])

def c84():  # Moss McCandle — свечка-человечек боится сквозняков и драматично гаснет
    im = wash([PLUM, (110, 80, 110), (200, 140, 110)], 84)
    im = H.glow(im, 60, 50, 40, (255, 210, 120), .45)
    f, d = canvas(44, 90); WX, WXd = (238, 226, 196), (206, 190, 156)
    d.rounded_rectangle((6, 22, 38, 88), 4, fill=WX); d.polygon([(6, 22), (38, 22), (38, 30), (32, 36), (28, 28), (20, 40), (14, 28), (6, 32)], fill=(250, 244, 226))
    d.line([(32, 30), (32, 50)], fill=WXd); d.line([(22, 0 + 20), (22, 16)], fill=INK)
    d.polygon([(22, 0), (28, 10), (22, 18), (16, 10)], fill=(250, 170, 50)); d.polygon([(22, 6), (25, 12), (22, 16), (19, 12)], fill=(255, 236, 140))
    eyes(d, 16, 28, 50, 2); d.arc((16, 58, 28, 66), 200, 340, fill=INK)  # волнуется
    d.line([(2, 56), (6, 62)], fill=INK); d.line([(38, 62), (42, 56)], fill=INK)
    im.alpha_composite(outline(f), (38, 40))
    d = ImageDraw.Draw(im); d.ellipse((30, 128, 90, 140), fill=(160, 120, 80)); d.ellipse((34, 128, 86, 136), fill=(190, 150, 100))  # подсвечник
    for y in (60, 76, 92): d.line([(4, y), (20, y - 4), (28, y)], fill=(230, 230, 246))  # сквозняк
    return stats(badge(im), [1, 2, 2, 3, 1])

def c85():  # Chestnut Charlie — жареный каштан в бумажном кульке, тёплый и болтливый
    im = wash([CLAY, PEACH, CREAM], 85); fall(im, 85, 4)
    d = ImageDraw.Draw(im)
    d.polygon([(26, 70), (94, 70), (60, 146)], fill=(220, 200, 160)); d.line([(26, 70), (60, 146), (94, 70)], fill=INK); d.line([(26, 70), (94, 70)], fill=INK)
    for y in range(80, 140, 8): d.line([(26 + (y - 70) * 34 // 76, y), (94 - (y - 70) * 34 // 76, y)], fill=(200, 180, 140))
    for x, y in ((30, 62), (76, 60), (44, 66)):
        c, cd = canvas(20, 16); cd.ellipse((0, 2, 20, 16), fill=(110, 60, 40)); cd.ellipse((4, 4, 12, 10), fill=(150, 90, 60)); cd.ellipse((4, 0, 16, 6), fill=(200, 170, 120))
        im.alpha_composite(outline(c), (x, y))
    f, fd = canvas(44, 40); CN = (120, 66, 40)
    fd.ellipse((0, 4, 44, 40), fill=CN); fd.polygon([(14, 4), (22, -2), (30, 4)], fill=CN); fd.ellipse((6, 8, 18, 18), fill=L(CN, 40))
    fd.line([(16, 10), (28, 10)], fill=(236, 210, 150)); fd.line([(22, 6), (22, 14)], fill=(236, 210, 150))  # надрез
    eyes(fd, 14, 30, 24, 2); fd.chord((14, 26, 30, 36), 0, 180, fill=INK); fd.rectangle((18, 31, 26, 33), fill=(220, 80, 80))
    im.alpha_composite(outline(f), (38, 34))
    d = ImageDraw.Draw(im); steam(d, 50, 30, 3)
    return stats(badge(im), [3, 2, 1, 3, 1])

def c86():  # Mittens Mulligan — кот в свитере растёкся по батарее
    im = wash([ROSE, PEACH, CREAM], 86)
    d = ImageDraw.Draw(im)
    d.rectangle((0, 40, 26, 100), fill=(160, 190, 210)); d.rectangle((2, 42, 24, 98), fill=(196, 220, 236)); d.line([(13, 42), (13, 98)], fill=INK)  # окно
    r, rd = canvas(96, 50)
    for i in range(8): rd.rounded_rectangle((i * 12, 0, i * 12 + 10, 48), 3, fill=(236, 236, 240))
    rd.rectangle((0, 40, 94, 44), fill=(210, 210, 220))
    im.alpha_composite(outline(r), (12, 92))
    f, fd = canvas(96, 40); CT, CTd = (120, 120, 132), (90, 90, 104)
    fd.ellipse((0, 8, 74, 40), fill=(170, 60, 60)); for_ = [fd.line([(x, 10), (x, 38)], fill=(150, 50, 52)) for x in range(6, 70, 6)]
    fd.ellipse((60, 6, 94, 34), fill=CT); fd.polygon([(64, 10), (66, 0), (74, 8)], fill=CT); fd.polygon([(82, 8), (90, 0), (92, 12)], fill=CT)
    fd.arc((68, 16, 76, 22), 200, 340, fill=INK); fd.arc((80, 16, 88, 22), 200, 340, fill=INK); fd.point((78, 25), fill=(236, 140, 150))
    fd.ellipse((-6, 22, 16, 34), fill=CT)  # хвост
    for x in (20, 40): fd.ellipse((x, 32, x + 10, 40), fill=CT)  # лапы свисают
    im.alpha_composite(outline(f), (14, 62))
    d = ImageDraw.Draw(im)
    for x in (40, 60, 80): d.line([(x, 56), (x - 2, 50), (x, 44)], fill=(255, 255, 255))  # тепло
    return stats(badge(im), [2, 1, 1, 4, 2])

def c87():  # Bramwell Bear — сонный медведь в пижаме и колпаке, собирается в спячку до весны
    im = wash([(110, 100, 140), PLUM, (200, 160, 140)], 87)
    d = ImageDraw.Draw(im); H.moon(d, 20, 22, 9)
    f, fd = canvas(86, 112); BE, BEd = (150, 100, 66), (114, 74, 50)
    fd.rounded_rectangle((8, 50, 78, 110), 20, fill=(120, 150, 200))
    for x in range(14, 76, 10): fd.line([(x, 52), (x, 108)], fill=(160, 190, 230))
    fd.ellipse((12, 6, 74, 60), fill=BE); fd.ellipse((8, 4, 24, 20), fill=BE); fd.ellipse((62, 4, 78, 20), fill=BE)
    fd.ellipse((30, 34, 56, 56), fill=(210, 170, 130)); fd.ellipse((38, 36, 48, 43), fill=INK)
    fd.arc((24, 24, 36, 32), 200, 340, fill=INK); fd.arc((50, 24, 62, 32), 200, 340, fill=INK)
    fd.ellipse((40, 46, 46, 52), fill=INK)  # зевает
    fd.polygon([(16, 14), (70, 14), (86, 0), (82, -4)], fill=(120, 150, 200)); fd.polygon([(16, 14), (70, 14), (50, 0)], fill=(120, 150, 200))
    fd.ellipse((78, 0, 86, 8), fill=PAPER)
    fd.ellipse((60, 74, 82, 100), fill=(240, 220, 160)); fd.line([(64, 80), (78, 80)], fill=(200, 150, 70))  # подушка-обнимашка
    im.alpha_composite(outline(f), (16, 36)); shadow(im, 60, 148, 76)
    return stats(badge(im), [4, 2, 0, 3, 3])

def c88():  # Wren Windlow — крапивник на подоконнике слушает дождь, рядом напёрсток с чаем
    im = wash([RAIN, (176, 190, 206), CREAM], 88)
    d = ImageDraw.Draw(im)
    d.rectangle((10, 10, 110, 112), fill=(126, 150, 180)); d.rectangle((12, 12, 108, 110), outline=(236, 220, 190), width=3)
    d.line([(60, 12), (60, 110)], fill=(236, 220, 190), width=3); d.line([(12, 60), (108, 60)], fill=(236, 220, 190), width=3)
    r = random.Random(88)
    for _ in range(18):
        x, y = r.randint(16, 104), r.randint(16, 100); d.line([(x, y), (x, y + 4)], fill=(210, 226, 240)); d.point((x, y + 5), fill=(240, 248, 255))
    d.rectangle((0, 112, 120, 120), fill=(236, 220, 190)); d.rectangle((0, 120, 120, 148), fill=(200, 160, 120))
    f, fd = canvas(46, 36); WR, WRd = (150, 104, 70), (110, 74, 50)
    fd.ellipse((8, 8, 40, 34), fill=WR); fd.polygon([(8, 18), (0, 2), (14, 14)], fill=WRd)  # хвостик торчит
    fd.ellipse((26, 4, 44, 22), fill=WR); fd.ellipse((14, 16, 32, 30), fill=WRd)
    fd.polygon([(42, 12), (48, 14), (42, 16)], fill=(220, 180, 90)); eyes(fd, 36, 36, 11, 2, white=False)
    fd.line([(28, 8), (40, 6)], fill=(236, 220, 190))
    im.alpha_composite(outline(f), (34, 80))
    t, td = canvas(14, 14); td.rectangle((1, 2, 13, 13), fill=(200, 204, 220)); td.ellipse((1, 0, 13, 4), fill=(170, 120, 70))
    im.alpha_composite(outline(t), (84, 98)); steam(ImageDraw.Draw(im), 90, 96, 1)
    return stats(badge(im), [1, 2, 3, 3, 1])

def c89():  # Leafy Lou — куча листьев с глазами: в неё прыгают, она хихикает
    im = wash([OCHRE, PEACH, MOSS], 89)
    d = ImageDraw.Draw(im); r = random.Random(89)
    d.chord((8, 70, 112, 170), 180, 360, fill=(200, 110, 50))
    for _ in range(170):
        x = r.randint(14, 106); y = r.randint(78, 146)
        if (x - 60) ** 2 / 52 ** 2 + (y - 120) ** 2 / 50 ** 2 < 1: leaf(d, x, y, r.choice(LEAVES))
    d.ellipse((38, 98, 54, 114), fill=PAPER); d.ellipse((66, 98, 82, 114), fill=PAPER)
    d.ellipse((44, 104, 50, 110), fill=INK); d.ellipse((72, 102, 78, 108), fill=INK)
    d.chord((48, 116, 72, 132), 0, 180, fill=INK); d.rectangle((54, 124, 66, 128), fill=(220, 90, 90))
    for x, y, c in ((20, 40, LEAVES[0]), (90, 30, LEAVES[2]), (40, 20, LEAVES[1]), (74, 56, LEAVES[3])): leaf(d, x, y, c, 2)
    return stats(badge(im), [2, 1, 1, 4, 1])

# ---------- предметы ----------
def c90():  # Odd Socks Club — шерстяные носки, ни одного одинакового
    im = wash([ROSE, CREAM, SAGE], 90)
    for x, y, a, b, k in ((18, 30, (200, 70, 60), (240, 200, 90), 0), (60, 50, (90, 130, 170), PAPER, 1)):
        s, sd = canvas(40, 80)
        sd.rectangle((6, 0, 30, 54), fill=a); sd.ellipse((6, 44, 40, 78), fill=a); sd.rectangle((6, 54, 26, 78), fill=a)
        for yy in range(4, 54, 10): sd.rectangle((6, yy, 30, yy + 4), fill=b)
        if k: [sd.point((xx, yy), fill=(200, 70, 60)) for xx in range(9, 30, 5) for yy in range(6, 52, 6)]
        sd.ellipse((26, 58, 40, 76), fill=D(a, 30)); sd.rectangle((4, 0, 32, 6), fill=L(a, 30))
        im.alpha_composite(outline(s.rotate(-14 if k else 10, expand=True)), (x, y))
    shadow(im, 60, 142, 80)
    return chips(badge(im), '+3 HP', '+1 MOOD')

def c91():  # Spiced Cider — кружка яблочного сидра с палочкой корицы и долькой яблока
    im = wash([CLAY, PEACH, OCHRE], 91); fall(im, 91, 4)
    m, md = canvas(66, 66); MG = (200, 70, 50)
    md.rounded_rectangle((4, 6, 50, 64), 6, fill=MG); md.ellipse((4, 0, 50, 12), fill=(176, 104, 40)); md.ellipse((8, 2, 46, 10), fill=(214, 140, 60))
    md.arc((40, 18, 64, 48), 270, 90, fill=MG, width=5)
    md.line([(10, 18), (10, 56)], fill=L(MG, 30), width=2)
    for x in range(10, 48, 8): md.rectangle((x, 30, x + 3, 33), fill=PAPER)
    im.alpha_composite(outline(m), (24, 70))
    d = ImageDraw.Draw(im)
    d.line([(58, 76), (70, 44)], fill=(110, 60, 30), width=4); d.line([(59, 76), (71, 44)], fill=(150, 90, 50))
    d.chord((26, 62, 50, 86), 180, 360, fill=(240, 230, 190)); d.arc((26, 62, 50, 86), 180, 360, fill=(200, 50, 50), width=2)
    steam(d, 40, 62, 3); shadow(im, 56, 140, 60)
    return chips(badge(im), '+5 HP', '-1 CAFF')

def c92():  # Hot Water Hug — грелка в вязаном чехле с ушками
    im = wash([ROSE, (230, 190, 180), CREAM], 92)
    g, gd = canvas(66, 90); KN = (230, 120, 110)
    gd.rectangle((24, 0, 42, 14), fill=(200, 60, 60)); gd.rectangle((22, 10, 44, 16), fill=(180, 50, 50))
    gd.rounded_rectangle((2, 14, 64, 88), 18, fill=KN)
    for y in range(20, 86, 6):
        for x in range(6, 62, 6): gd.line([(x, y), (x + 3, y + 3), (x + 6, y)], fill=D(KN, 24))
    gd.ellipse((0, 12, 14, 26), fill=KN); gd.ellipse((52, 12, 66, 26), fill=KN)
    eyes(gd, 22, 44, 46, 2, white=False); gd.arc((26, 50, 40, 60), 20, 160, fill=INK)
    gd.ellipse((14, 54, 20, 58), fill=(240, 160, 160)); gd.ellipse((46, 54, 52, 58), fill=(240, 160, 160))
    im.alpha_composite(outline(g), (28, 40))
    d = ImageDraw.Draw(im)
    for x, y in ((14, 50), (100, 60), (18, 100)): d.polygon([(x, y + 2), (x + 3, y), (x + 6, y + 2), (x + 3, y + 6)], fill=(220, 80, 90))
    shadow(im, 60, 138, 70)
    return chips(badge(im), '+4 HP', '+1 MOOD')

def c93():  # Crackle Hearth — маленький камин: две ячейки, зато греет всех
    im = wash([CLAY, (180, 110, 90), PEACH], 93)
    floor(im, 128, (150, 100, 70))
    f, fd = canvas(96, 90); BR = (170, 90, 70)
    fd.rectangle((0, 0, 96, 12), fill=(110, 70, 50)); fd.rectangle((6, 12, 90, 90), fill=BR)
    for y in range(14, 90, 8):
        for x in range(6 + (y // 8 % 2) * 8, 90, 16): fd.rectangle((x, y, x + 14, y + 6), fill=L(BR, 12))
    fd.rectangle((22, 34, 74, 90), fill=(40, 26, 30)); fd.chord((22, 20, 74, 50), 180, 360, fill=(40, 26, 30))
    fd.rectangle((28, 80, 68, 86), fill=(110, 70, 40)); fd.rectangle((32, 76, 62, 80), fill=(140, 90, 50))
    fd.polygon([(30, 78), (38, 52), (44, 66), (50, 42), (58, 64), (62, 54), (68, 78)], fill=(240, 120, 40))
    fd.polygon([(38, 78), (44, 62), (50, 54), (54, 66), (60, 78)], fill=(250, 200, 80))
    fd.rectangle((14, -6, 22, 0), fill=(220, 200, 120)); fd.rectangle((72, -8, 80, 0), fill=(120, 160, 90))  # на полке
    im.alpha_composite(outline(f), (12, 46)); im = H.glow(im, 60, 110, 44, (255, 180, 90), .3)
    return chips(badge(im), '+8 HP', '+1 MOOD')

def c94():  # Rainy Window — дождь за окном: можно никуда не идти, вина за отдых проходит
    im = wash([RAIN, (160, 176, 200), PLUM], 94)
    d = ImageDraw.Draw(im)
    d.rectangle((14, 14, 106, 120), fill=(90, 110, 150)); d.rectangle((14, 14, 106, 120), outline=(236, 220, 190), width=4)
    d.line([(60, 14), (60, 120)], fill=(236, 220, 190), width=3)
    r = random.Random(94)
    for _ in range(26):
        x, y = r.randint(20, 100), r.randint(18, 112); d.line([(x, y), (x, y + r.randint(3, 8))], fill=(190, 210, 236)); d.point((x, y + 9), fill=(250, 250, 255))
    d.rectangle((6, 120, 114, 128), fill=(236, 220, 190))
    p = H.polly(3, eye='half'); p = p.crop((0, 0, p.width, p.height * 2 // 3))
    im.alpha_composite(outline(p), (36, 120 - p.height))
    c, cd = canvas(16, 16); cd.rounded_rectangle((0, 2, 12, 16), 2, fill=(200, 80, 60)); cd.arc((8, 5, 16, 13), 270, 90, fill=(200, 80, 60), width=2)
    im.alpha_composite(outline(c), (80, 104)); steam(ImageDraw.Draw(im), 86, 102, 1)
    d = ImageDraw.Draw(im); d.rounded_rectangle((4, 152, 76, 163), 3, fill=PAPER, outline=INK); text3(d, 7, 155, 'NO GUILT', (200, 50, 60))
    return badge(im)

def c95():  # Honey Dipper — горшочек мёда с ложкой-веретеном, течёт медленно, как осеннее утро
    im = wash([OCHRE, (240, 200, 110), CREAM], 95)
    j, jd = canvas(64, 70); HN = (232, 166, 40)
    jd.ellipse((2, 14, 62, 70), fill=HN); jd.rectangle((10, 6, 54, 20), fill=HN); jd.rectangle((6, 4, 58, 12), fill=(236, 220, 190))
    jd.polygon([(6, 12), (58, 12), (60, 18), (4, 18)], fill=(200, 80, 60)); [jd.rectangle((x, 12, x + 3, 18), fill=PAPER) for x in range(8, 58, 8)]
    jd.ellipse((10, 28, 22, 44), fill=L(HN, 40)); jd.rectangle((18, 40, 46, 54), fill=PAPER); text3(jd, 21, 45, 'HONEY', (150, 90, 30))
    im.alpha_composite(outline(j), (28, 70))
    d = ImageDraw.Draw(im)
    d.line([(70, 30), (56, 76)], fill=(160, 110, 60), width=3)
    for i, y in enumerate((26, 22, 18)): d.ellipse((66 + i, y, 80 + i, y + 6), fill=(190, 130, 70), outline=INK)
    d.line([(70, 34), (70, 64)], fill=(232, 166, 40), width=2); d.ellipse((68, 64, 72, 69), fill=(232, 166, 40))  # капля
    for x, y in ((24, 30), (96, 70)):  # пчёлки
        d.ellipse((x, y, x + 8, y + 6), fill=(240, 200, 40), outline=INK); d.line([(x + 3, y), (x + 3, y + 6)], fill=INK); d.ellipse((x + 2, y - 4, x + 6, y), fill=PAPER, outline=INK)
    shadow(im, 60, 142, 64)
    return chips(badge(im), '+2 SNACK')

def c96():  # Pinecone Kindling — шишки для растопки: +1 HP каждому в команде
    im = wash([MOSS, SAGE, OCHRE], 96)
    for x, y, s in ((18, 70, 1.0), (58, 60, 1.2), (36, 98, .9)):
        w, h = int(34 * s), int(46 * s); p, pd = canvas(w, h)
        pd.ellipse((0, 0, w, h), fill=(130, 80, 50))
        for yy in range(2, h - 2, 5):
            for xx in range(2 + (yy // 5 % 2) * 3, w - 2, 6): pd.polygon([(xx, yy), (xx + 3, yy + 4), (xx + 6, yy)], fill=(170, 110, 66)); pd.point((xx + 3, yy + 1), fill=(200, 150, 100))
        im.alpha_composite(outline(p), (x, y))
    d = ImageDraw.Draw(im)
    for x, y in ((90, 40), (100, 52), (84, 56)): d.polygon([(x, y + 6), (x + 3, y), (x + 6, y + 6), (x + 3, y + 10)], fill=(240, 140, 40)); d.point((x + 3, y + 6), fill=(255, 230, 120))
    shadow(im, 60, 146, 80)
    return chips(badge(im), '+1 HP ALL')

def c97():  # Leaky Umbrella — зонтик в горошек: держит один глюк, а следующий протекает
    im = wash([RAIN, (170, 186, 206), ROSE], 97); rain(im, 97, 46)
    u, ud = canvas(100, 110); UM = (200, 70, 90)
    ud.chord((0, 0, 100, 70), 180, 360, fill=UM)
    for x in (0, 25, 50, 75): ud.chord((x, 26, x + 25, 44), 0, 180, fill=(0, 0, 0, 0))
    for x, y in ((20, 14), (44, 8), (68, 14), (32, 24), (60, 26), (84, 26), (12, 28)): ud.ellipse((x, y, x + 5, y + 5), fill=PAPER)
    ud.line([(50, 0), (50, 100)], fill=(70, 50, 50), width=2); ud.arc((50, 92, 64, 108), 0, 180, fill=(70, 50, 50), width=3)
    ud.rectangle((48, -4, 52, 2), fill=(70, 50, 50))
    im.alpha_composite(outline(u), (10, 30))
    d = ImageDraw.Draw(im)
    for y in (70, 82, 94, 106): d.ellipse((76, y, 80, y + 6), fill=(200, 226, 250), outline=(90, 120, 160))  # протекает
    d.ellipse((60, 128, 100, 140), fill=(130, 160, 196))
    return glitchless(badge(im))

def glitchless(im):
    d = ImageDraw.Draw(im); t = 'BLOCK 1 GLITCH'
    d.rounded_rectangle((4, 152, 4 + 4 * len(t) + 4, 163), 3, fill=PAPER, outline=INK); text3(d, 7, 155, t, INK); return im

def c98():  # Endless Scarf — шарф такой длины, что хватает на двоих
    im = wash([CREAM, OCHRE, ROSE], 98)
    d = ImageDraw.Draw(im); cols = [(200, 70, 60), (240, 190, 80), (110, 140, 90), PAPER]
    pts = [(10, 20), (40, 34), (80, 28), (104, 48), (84, 74), (40, 70), (18, 94), (44, 118), (90, 110), (106, 134)]
    for i in range(len(pts) - 1):
        (x0, y0), (x1, y1) = pts[i], pts[i + 1]
        for k in range(12):
            t = k / 12; x, y = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
            d.ellipse((x - 8, y - 8, x + 8, y + 8), fill=cols[(i * 12 + k) // 3 % 4], outline=INK if k == 0 else None)
    for x in range(98, 116, 4): d.line([(x, 140), (x, 148)], fill=(200, 70, 60))
    return chips(badge(im), 'SHARE 3 HP')

def c99():  # Foil Potato — печёная в фольге картошка из костра
    im = wash([PLUM, CLAY, OCHRE], 99)
    d = ImageDraw.Draw(im)
    for x, y in ((14, 124), (36, 130), (62, 126), (86, 132)): d.ellipse((x, y, x + 22, y + 12), fill=(70, 50, 50)); d.ellipse((x + 4, y + 2, x + 10, y + 6), fill=(240, 120, 40))
    p, pd = canvas(80, 56); FL, FLd = (200, 204, 216), (150, 154, 170)
    pd.ellipse((0, 4, 80, 56), fill=FL)
    for x, y in ((10, 20), (24, 40), (56, 44), (66, 18), (40, 12)): pd.line([(x, y), (x + 8, y + 4)], fill=FLd); pd.point((x + 2, y - 1), fill=PAPER)
    pd.ellipse((20, 6, 60, 30), fill=(200, 150, 90)); pd.ellipse((24, 8, 56, 26), fill=(246, 224, 160))
    pd.rectangle((34, 10, 44, 16), fill=(250, 220, 90)); pd.line([(36, 12), (42, 12)], fill=(255, 245, 190))  # масло
    pd.point([(28, 14), (50, 20), (46, 12)], fill=(110, 150, 70))  # укроп
    im.alpha_composite(outline(p), (20, 72))
    steam(ImageDraw.Draw(im), 52, 70, 3)
    return chips(badge(im), '+6 HP', '+1 SNACK')

def c100():  # Apple Haul — корзина яблок из сада
    im = wash([SAGE, MOSS, PEACH], 100)
    b, bd = canvas(96, 70); WK, WKd = (190, 140, 80), (150, 104, 56)
    bd.arc((14, 0, 82, 60), 180, 360, fill=WKd, width=5)
    r = random.Random(100)
    for x, y in ((18, 22), (34, 16), (50, 14), (66, 18), (26, 30), (44, 26), (60, 28), (76, 26)):
        c = r.choice([(210, 50, 50), (230, 80, 60), (180, 200, 70), (240, 170, 60)])
        bd.ellipse((x - 2, y, x + 14, y + 15), fill=c); bd.point((x + 3, y + 3), fill=L(c, 60)); bd.line([(x + 6, y), (x + 7, y - 3)], fill=(90, 60, 30))
    bd.polygon([(6, 34), (90, 34), (80, 70), (16, 70)], fill=WK)
    for y in range(38, 70, 6): bd.line([(10, y), (86, y)], fill=WKd)
    for x in range(14, 86, 8): bd.line([(x, 34), (x + 2, 70)], fill=L(WK, 20))
    im.alpha_composite(outline(b), (12, 66))
    d = ImageDraw.Draw(im); leaf(d, 30, 40, (110, 150, 70), 2)
    shadow(im, 60, 140, 80)
    return chips(badge(im), '+3 SNACK')

def c101():  # Chamomile Calm — пакетик ромашкового чая: кофеин уходит, спокойствие приходит
    im = wash([CREAM, (240, 230, 170), SAGE], 101)
    d = ImageDraw.Draw(im)
    for x, y in ((16, 24), (90, 30), (20, 108), (96, 100)):
        for a, b in ((-4, 0), (4, 0), (0, -4), (0, 4), (-3, -3), (3, 3), (-3, 3), (3, -3)): d.ellipse((x + a - 2, y + b - 2, x + a + 2, y + b + 2), fill=PAPER, outline=(200, 200, 190))
        d.ellipse((x - 2, y - 2, x + 2, y + 2), fill=(240, 200, 50))
    t, td = canvas(50, 60)
    td.polygon([(4, 10), (46, 10), (48, 58), (2, 58)], fill=(236, 220, 180)); td.polygon([(4, 10), (12, 2), (38, 2), (46, 10)], fill=(220, 204, 160))
    for y in range(16, 56, 5):
        for x in range(6, 46, 5): td.point((x, y), fill=(200, 180, 130))
    td.ellipse((14, 24, 36, 46), fill=PAPER)
    for a in range(0, 360, 45):
        import math; td.ellipse((25 + 7 * math.cos(math.radians(a)) - 3, 35 + 7 * math.sin(math.radians(a)) - 3, 25 + 7 * math.cos(math.radians(a)) + 3, 35 + 7 * math.sin(math.radians(a)) + 3), fill=PAPER, outline=(210, 210, 200))
    td.ellipse((21, 31, 29, 39), fill=(240, 200, 50))
    im.alpha_composite(outline(t), (36, 64))
    d = ImageDraw.Draw(im); d.line([(61, 66), (70, 30)], fill=(240, 240, 240)); d.rectangle((62, 18, 80, 32), fill=(110, 160, 90), outline=INK); text3(d, 65, 23, 'ZZ', PAPER)
    shadow(im, 60, 132, 54)
    return chips(badge(im), '-2 CAFF', '+1 MOOD')

def c102():  # Missing Piece Puzzle — пазл на 1000 деталей: последней всегда нет
    im = wash([PLUM, (190, 150, 180), PEACH], 102)
    floor(im, 120, (180, 140, 110))
    p, pd = canvas(100, 70); r = random.Random(102)
    pd.polygon([(10, 0), (100, 0), (90, 70), (0, 70)], fill=(236, 180, 90))
    for i in range(0, 100, 10):
        for j in range(0, 70, 10):
            c = r.choice([(236, 180, 90), (220, 150, 70), (200, 110, 60), (170, 190, 220), (150, 170, 210)]) if j < 30 else r.choice([(200, 110, 60), (160, 90, 50), (230, 160, 70)])
            x = i - j // 7
            if 6 <= x <= 86: pd.rectangle((x, j, x + 9, j + 9), fill=c)
    for i in range(10, 100, 10): pd.line([(i, 0), (i - 10, 70)], fill=(140, 90, 60))
    for j in range(10, 70, 10): pd.line([(10 - j // 7, j), (100 - j // 7, j)], fill=(140, 90, 60))
    pd.rectangle((50, 30, 60, 40), fill=(40, 26, 30))  # дырка
    im.alpha_composite(outline(p), (10, 60))
    q, qd = canvas(16, 16); qd.rectangle((2, 2, 13, 13), fill=(200, 110, 60)); qd.ellipse((5, -1, 10, 4), fill=(200, 110, 60)); qd.ellipse((11, 5, 16, 10), fill=(200, 110, 60))
    im.alpha_composite(outline(q), (90, 132))  # деталь под столом
    d = ImageDraw.Draw(im); text3(d, 64, 40, '?', PAPER); text3(d, 70, 32, '?', PAPER)
    return chips(badge(im), '+2 MOOD')

def c103():  # Rainy Jazz Record — проигрыватель, пластинка «Rainy Jazz»
    im = wash([PLUM, (130, 100, 130), RAIN], 103)
    p, pd = canvas(100, 70)
    pd.rectangle((0, 20, 100, 70), fill=(150, 96, 60)); pd.rectangle((0, 20, 100, 26), fill=(180, 120, 76))
    pd.ellipse((10, 0, 72, 40), fill=(30, 26, 34))
    for k in (6, 12, 18): pd.ellipse((10 + k, k * 2 // 3, 72 - k, 40 - k * 2 // 3), outline=(60, 56, 66))
    pd.ellipse((33, 13, 49, 27), fill=(220, 90, 70)); pd.point((41, 20), fill=INK)
    pd.line([(88, 6), (84, 20), (60, 24)], fill=(200, 200, 210), width=2); pd.ellipse((84, 2, 94, 12), fill=(170, 170, 180))
    pd.ellipse((80, 44, 90, 54), fill=(220, 200, 120)); pd.ellipse((66, 44, 76, 54), fill=(220, 200, 120))
    im.alpha_composite(outline(p), (10, 68))
    d = ImageDraw.Draw(im)
    for x, y in ((20, 40), (44, 26), (74, 44), (90, 22)):  # ноты
        d.ellipse((x, y + 8, x + 6, y + 13), fill=PAPER); d.line([(x + 5, y + 10), (x + 5, y)], fill=PAPER); d.line([(x + 5, y), (x + 9, y + 3)], fill=PAPER)
    rain(im, 103, 14, (200, 210, 230))
    return chips(badge(im), '+2 MOOD')

def c104():  # Maple Tower — стопка блинчиков с кленовым сиропом
    im = wash([OCHRE, PEACH, CREAM], 104); fall(im, 104, 3, (4, 4, 100, 50))
    t, td = canvas(84, 80); PC, PCd = (230, 180, 100), (196, 140, 70)
    td.ellipse((0, 66, 84, 80), fill=PAPER, outline=(200, 200, 210))
    for i in range(6):
        y = 60 - i * 9; td.ellipse((8, y, 76, y + 14), fill=PCd); td.ellipse((8, y - 2, 76, y + 10), fill=PC)
    td.ellipse((10, 6, 74, 18), fill=(170, 80, 30))
    for x, h in ((14, 18), (30, 28), (58, 22), (70, 14)): td.rectangle((x, 12, x + 3, 12 + h), fill=(170, 80, 30)); td.ellipse((x - 1, 10 + h, x + 4, 15 + h), fill=(170, 80, 30))
    td.rectangle((34, 2, 48, 10), fill=(250, 220, 90)); td.line([(36, 4), (46, 4)], fill=(255, 245, 190))
    im.alpha_composite(outline(t), (18, 58))
    b, bd = canvas(16, 34); bd.rectangle((4, 0, 10, 8), fill=(150, 90, 50)); bd.rounded_rectangle((0, 8, 14, 34), 4, fill=(190, 100, 40)); leaf(bd, 7, 20, (230, 160, 60))
    im.alpha_composite(outline(b), (98, 104)); steam(ImageDraw.Draw(im), 54, 54, 2)
    return chips(badge(im), '+5 HP', '+1 COOKIE')

def c105():  # Fluffy Earmuffs — пушистые наушники: звонки больше не пугают
    im = wash([ROSE, (220, 180, 200), CREAM], 105)
    e, ed = canvas(100, 80); FU = (236, 200, 210)
    ed.arc((16, 0, 84, 70), 180, 360, fill=(150, 110, 170), width=6)
    for x in (0, 62):
        ed.ellipse((x, 30, x + 38, 74), fill=FU)
        for a, b in ((4, 34), (22, 34), (2, 54), (26, 56), (14, 64), (12, 40)): ed.ellipse((x + a, b, x + a + 10, b + 10), fill=L(FU, 14))
        ed.ellipse((x + 10, 42, x + 28, 62), fill=D(FU, 18))
    im.alpha_composite(outline(e), (10, 50))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((44, 20, 76, 40), 4, fill=(60, 60, 80), outline=INK); text3(d, 49, 27, 'RING', PAPER)
    d.line([(40, 18), (80, 44)], fill=(200, 50, 60), width=2); d.line([(80, 18), (40, 44)], fill=(200, 50, 60), width=2)
    shadow(im, 60, 138, 80)
    d.rounded_rectangle((4, 152, 76, 163), 3, fill=PAPER, outline=INK); text3(d, 7, 155, 'NO PANIC', INK)
    return badge(im)

def c106():  # Rowan Wreath — венок из рябины на двери: щепотка удачи тем, кто в настроении
    im = wash([MOSS, SAGE, CLAY], 106)
    d = ImageDraw.Draw(im)
    d.rectangle((14, 0, 106, 148), fill=(120, 80, 60)); d.rectangle((22, 8, 98, 148), outline=(96, 62, 46), width=3)
    d.ellipse((92, 80, 98, 86), fill=(220, 190, 90), outline=INK)
    w, wd = canvas(70, 70); r = random.Random(106)
    wd.ellipse((0, 0, 70, 70), fill=(90, 120, 60)); wd.ellipse((16, 16, 54, 54), fill=(0, 0, 0, 0))
    for a in range(0, 360, 14):
        import math; x, y = 35 + 27 * math.cos(math.radians(a)), 35 + 27 * math.sin(math.radians(a))
        wd.polygon([(x - 5, y), (x, y - 3), (x + 5, y), (x, y + 3)], fill=r.choice([(110, 150, 70), (80, 110, 50)]))
        if a % 28 == 0:
            for dx, dy in ((0, 0), (3, 2), (-2, 3)): wd.ellipse((x + dx - 2, y + dy - 2, x + dx + 2, y + dy + 2), fill=(220, 60, 40))
    wd.polygon([(28, 58), (35, 52), (42, 58), (40, 70), (35, 62), (30, 70)], fill=(200, 60, 60))
    im.alpha_composite(outline(w), (25, 34))
    d = ImageDraw.Draw(im); d.line([(60, 0), (60, 34)], fill=(200, 60, 60), width=2)
    d.rounded_rectangle((4, 152, 68, 163), 3, fill=PAPER, outline=INK); text3(d, 7, 155, 'LUCK', (60, 140, 70)); text3(d, 27, 155, 'MOOD 2+', INK)
    return badge(im)

def c107():  # Fogbound Thermos — термос для туманных утренних прогулок
    im = wash([RAIN, (200, 206, 214), MOSS], 107)
    d = ImageDraw.Draw(im)
    for y in (40, 60, 90, 120): d.rounded_rectangle((-10 + y % 30, y, 70 + y % 40, y + 8), 4, fill=(226, 230, 236))
    for x, h in ((8, 70), (96, 60)): d.rectangle((x, 148 - h, x + 6, 148), fill=(90, 80, 70)); d.ellipse((x - 10, 148 - h - 20, x + 16, 148 - h + 10), fill=(140, 120, 80))
    t, td = canvas(40, 96); TH = (60, 110, 90)
    td.rounded_rectangle((2, 20, 38, 96), 6, fill=TH); td.rectangle((6, 6, 34, 22), fill=(200, 204, 216)); td.rectangle((4, 0, 36, 8), fill=(170, 174, 190))
    td.rectangle((2, 44, 38, 60), fill=(220, 200, 150)); text3(td, 6, 49, 'HOT', TH)
    td.line([(8, 24), (8, 90)], fill=L(TH, 30), width=2)
    im.alpha_composite(outline(t), (30, 46))
    c, cd = canvas(26, 22); cd.polygon([(0, 2), (26, 2), (22, 22), (4, 22)], fill=(170, 174, 190)); cd.ellipse((1, 0, 25, 6), fill=(110, 70, 40))
    im.alpha_composite(outline(c), (76, 116)); steam(ImageDraw.Draw(im), 84, 112, 2)
    return chips(badge(im), '+2 CAFF', '+3 HP')

CARDS = [c78, c79, c80, c81, c82, c83, c84, c85, c86, c87, c88, c89, c90, c91, c92, c93, c94, c95, c96, c97, c98, c99, c100, c101, c102, c103, c104, c105, c106, c107]

def sheet(ims, path, z=3):
    pad = 10; cols = 10; rows = (len(ims) + cols - 1) // cols
    out = Image.new('RGB', (cols * (CW * z + pad) + pad, rows * (CH * z + pad) + pad), (60, 40, 30))
    for i, im in enumerate(ims):
        out.paste(im.convert('RGB').resize((CW * z, CH * z), Image.NEAREST), (pad + (i % cols) * (CW * z + pad), pad + (i // cols) * (CH * z + pad)))
    out.save(path)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    ims = []
    for f in CARDS:
        im = f().convert('RGB'); assert im.size == (CW, CH)
        im.save(os.path.join(OUT, f.__name__[1:] + '.png'), optimize=True); ims.append(im)
    if len(sys.argv) > 1: sheet(ims, os.path.join(OUT, 'sheet.png'))
    print('ok', len(ims))
