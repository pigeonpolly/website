# Коллекция «Halloween Remix»: 16 обычных карточек 120×168 (пиксель-арт) — ремиксы уникальных акварелей Алины «Halloween 2025» (№46–61).
# Не копии: у каждой её карточки — новый персонаж или предмет в той же теме. Фон — пиксельная «акварельная заливка» как на её карточках,
# в углу — тыква или капля (как у неё), внизу у персонажей — 5 кружков статов. Рамка, номер и 🤖 — CSS сайта.
# Инструменты рисования — из tools/cards/halloween.py. Запуск: python3 tools/cards/halloween_remix.py [папка] — по умолчанию
# site/images/cards/halloween-remix/ (62.png … 77.png); с папкой — ещё лист sheet.png для просмотра.
import sys, os, random
sys.path.insert(0, os.path.dirname(__file__))
import halloween as H
from halloween import CW, CH, INK, L, D, canvas, outline, paste, flipx, PO, POd, POl, PSt
from PIL import Image, ImageDraw
import numpy as np

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '../../site/images/cards/halloween-remix')
F3 = dict(H.F3, **{'+': '000010111010000', '?': '111001011000010'})
def text3(d, x, y, t, c):
    for i, ch in enumerate(t.upper()):
        f = F3.get(ch, F3[' '])
        for j in range(15):
            if f[j] == '1': d.point((x + i * 4 + j % 3, y + j // 3), fill=c)

# ---------- фон: акварельная заливка (пятна двух-трёх цветов, ступеньки с дизерингом, тёмные края пятен) ----------
LILAC, PEACH, LEMON, ROSE, SAGE = (150, 132, 184), (236, 168, 104), (240, 214, 120), (232, 160, 150), (178, 196, 150)
BAYER = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) / 16 - .5
def wash(cols, seed, lv=6):
    r = np.random.RandomState(seed)
    f = np.asarray(Image.fromarray((r.rand(7, 5) * 255).astype(np.uint8), 'L').resize((CW, CH), Image.BICUBIC)).astype(float) / 255
    f = (f - f.min()) / (f.max() - f.min() + 1e-6)
    q = np.clip(np.round(f * lv + np.tile(BAYER, (CH // 4, CW // 4)) * .9), 0, lv) / lv
    cols = np.array(cols, float); k = len(cols) - 1
    i = np.minimum((q * k).astype(int), k - 1); t = (q * k - i)[..., None]
    a = cols[i] * (1 - t) + cols[i + 1] * t
    g = np.round(f * 2)
    edge = (np.abs(np.diff(g, axis=0, prepend=g[:1])) + np.abs(np.diff(g, axis=1, prepend=g[:, :1]))) > 0
    a[edge] *= .95  # «край» высохшего пятна
    sp = r.rand(CH, CW); a[sp < .02] *= 1.06; a[sp > .985] *= .93  # зерно бумаги
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).convert('RGBA')

def badge(im, kind):
    """значок в правом верхнем углу, как у Алины: тыква (pumpkin) или капля (drop)"""
    d = ImageDraw.Draw(im)
    if kind == 'drop':
        d.polygon([(110, 4), (114, 10), (115, 14), (110, 18), (105, 14), (106, 10)], fill=(200, 50, 60)); d.ellipse((105, 10, 115, 19), fill=(200, 50, 60))
        d.point([(108, 12), (108, 13)], fill=(250, 150, 150))
    else:
        d.ellipse((103, 7, 117, 18), fill=PO); d.line([(110, 8), (110, 17)], fill=POd); d.line([(106, 9), (106, 16)], fill=POd); d.line([(114, 9), (114, 16)], fill=POd)
        d.rectangle((109, 4, 111, 7), fill=PSt); d.point((106, 10), fill=POl)
    return im

def stats(im, s):
    """5 кружков статов внизу (как на акварелях Алины): перекусы, кулинария, кофеин, настроение, печенье"""
    d = ImageDraw.Draw(im)
    for i, v in enumerate(s):
        x = 4 + i * 16
        d.ellipse((x, 151, x + 13, 164), fill=(250, 246, 236), outline=INK); d.ellipse((x + 2, 153, x + 11, 162), outline=(180, 170, 160))
        text3(d, x + 6 - 1, 155, str(v), INK)
    return im

def hp(im, n, x=4):
    d = ImageDraw.Draw(im)
    w = 4 * len(str(n)) + 4 + 9
    d.rounded_rectangle((x, 152, x + w + 3, 163), 3, fill=(250, 246, 236), outline=INK)
    text3(d, x + 3, 155, '+' + str(n), INK); text3(d, x + 3 + 4 * (len(str(n)) + 1) + 1, 155, 'HP', (200, 50, 60))
    return im

def glitch(im, x=4, add=False):
    d = ImageDraw.Draw(im)
    t = ('+1 GLITCH' if add else '-1 GLITCH')
    d.rounded_rectangle((x, 152, x + 4 * len(t) + 4, 163), 3, fill=(250, 246, 236), outline=INK)
    text3(d, x + 3, 155, t, INK)
    return im

def shadow(im, cx, y, w):
    d = ImageDraw.Draw(im, 'RGBA'); d.ellipse((cx - w // 2, y - 3, cx + w // 2, y + 3), fill=(40, 24, 60, 70))

def eyes(d, x1, x2, y, r=2, white=True, look=0):
    for x in (x1, x2):
        if white: d.ellipse((x - r - 1, y - r - 1, x + r + 1, y + r + 1), fill=(255, 255, 255))
        d.ellipse((x - r + 1 + look, y - r + 1, x + r - 1 + look, y + r - 1), fill=INK)
        d.point((x - 1 + look, y - 1), fill=(255, 255, 255))

# ---------- персонажи ----------
def c62():  # Sir Gourdon Squash — ремикс Miss Pumpkinella: джентльмен с головой-тыквой баттернат, фрак, бабочка, монокль
    im = wash([LILAC, (196, 170, 200), PEACH], 62)
    f, d = canvas(80, 130)
    FR, FRd = (60, 90, 70), (40, 64, 50)
    d.polygon([(10, 82), (28, 70), (52, 70), (70, 82), (74, 128), (6, 128)], fill=FR)  # фрак
    d.polygon([(40, 70), (52, 70), (70, 82), (74, 128), (48, 128)], fill=FRd)
    d.polygon([(30, 70), (50, 70), (46, 110), (34, 110)], fill=(246, 242, 232))  # рубашка
    d.polygon([(30, 70), (36, 70), (40, 96), (26, 84)], fill=L(FR, 18)); d.polygon([(50, 70), (44, 70), (40, 96), (54, 84)], fill=FRd)
    for y in (88, 98): d.ellipse((39, y, 41, y + 2), fill=(200, 170, 80))
    d.polygon([(32, 72), (40, 76), (48, 72), (48, 80), (40, 76), (32, 80)], fill=(200, 50, 60)); d.ellipse((38, 74, 42, 78), fill=(160, 36, 50))
    d.rectangle((60, 104, 64, 112), fill=(246, 242, 232))  # платочек в кармане
    f = outline(f)
    # голова: тыква баттернат — длинная, бежевая, внизу шире
    h, hd = canvas(40, 64); BT, BTd, BTl = (232, 196, 132), (200, 156, 96), (248, 222, 170)
    hd.ellipse((10, 4, 30, 34), fill=BT); hd.ellipse((4, 26, 36, 62), fill=BT); hd.rectangle((10, 18, 30, 40), fill=BT)
    hd.arc((4, 26, 36, 62), 20, 160, fill=BTd); hd.ellipse((8, 30, 14, 40), fill=BTl); hd.ellipse((13, 8, 17, 18), fill=BTl)
    hd.rectangle((18, 0, 21, 5), fill=PSt)
    eyes(hd, 14, 26, 38, 2, white=False)
    hd.ellipse((22, 33, 31, 42), outline=(200, 170, 80)); hd.line([(31, 38), (34, 52)], fill=(200, 170, 80))  # монокль на цепочке
    hd.polygon([(12, 46), (20, 44), (28, 46), (24, 49), (20, 47), (16, 49)], fill=(90, 60, 40))  # усы
    hd.arc((16, 46, 24, 54), 30, 150, fill=INK)
    h = outline(h)
    f.alpha_composite(h, (20, 14))
    # цилиндр в руке? — нет: тросточка
    shadow(im, 60, 160, 64)
    im.alpha_composite(f, (20, 32))
    d = ImageDraw.Draw(im); d.line([(94, 112), (100, 158)], fill=INK, width=3); d.line([(94, 112), (100, 158)], fill=(110, 70, 40)); d.arc((88, 106, 98, 116), 180, 360, fill=INK, width=2)
    return stats(badge(im, 'pumpkin'), [2, 3, 1, 3, 2])

def c63():  # Madame Teabite — ремикс Dr. Dripsson: паучиха-чайная сомелье в кружевном чепце, чайник и чашки в лапках
    im = wash([LEMON, PEACH, (210, 150, 110)], 63)
    d = ImageDraw.Draw(im)
    for a in range(0, 90, 18):  # паутина в углу
        import math
        d.line([(0, 0), (int(60 * math.cos(math.radians(a))), int(60 * math.sin(math.radians(a))))], fill=(250, 246, 230))
    for rr in (16, 30, 44, 58): d.arc((-rr, -rr, rr, rr), 0, 90, fill=(250, 246, 230))
    d.line([(60, 0), (60, 44)], fill=(250, 246, 230))
    s, sd = canvas(110, 90); cx, cy = 55, 40
    LEG = (70, 50, 80)
    for sx in (-1, 1):
        for i, (ax, ay, bx, by) in enumerate(((20, -14, 34, 6), (26, -2, 42, 20), (24, 12, 38, 34), (16, 20, 26, 44))):
            sd.line([(cx + sx * 10, cy + 4), (cx + sx * ax, cy + ay), (cx + sx * bx, cy + by)], fill=LEG, width=2)
    sd.ellipse((cx - 20, cy - 18, cx + 20, cy + 22), fill=(176, 150, 210)); sd.ellipse((cx - 14, cy - 14, cx - 4, cy - 6), fill=(206, 186, 232))
    sd.ellipse((cx - 22, cy - 26, cx + 22, cy - 12), fill=(250, 246, 240)); [sd.point((cx + x, cy - 13), fill=(200, 190, 210)) for x in range(-20, 21, 3)]  # чепец
    sd.ellipse((cx - 2, cy - 30, cx + 6, cy - 22), fill=(230, 120, 150))
    eyes(sd, cx - 8, cx + 8, cy - 2, 4); sd.point([(cx - 3, cy + 3), (cx + 3, cy + 3)], fill=(110, 90, 140))
    sd.arc((cx - 6, cy + 4, cx + 6, cy + 12), 20, 160, fill=INK)
    sd.ellipse((cx - 14, cy + 4, cx - 10, cy + 7), fill=(240, 150, 160)); sd.ellipse((cx + 10, cy + 4, cx + 14, cy + 7), fill=(240, 150, 160))
    s = outline(s)
    im.alpha_composite(s, (5, 44))
    # чайник слева, чашка справа
    t, td = canvas(36, 26); TP = (90, 160, 170)
    td.ellipse((6, 4, 28, 24), fill=TP); td.rectangle((14, 1, 20, 4), fill=TP); td.ellipse((15, 0, 19, 2), fill=L(TP))
    td.polygon([(26, 12), (35, 4), (35, 7), (28, 16)], fill=TP); td.arc((0, 8, 10, 20), 90, 270, fill=TP, width=2)
    td.ellipse((10, 8, 14, 12), fill=L(TP, 50)); [td.point((x, 16), fill=(250, 246, 230)) for x in range(10, 26, 3)]
    paste(im, t, 6, 104)
    c, cd = canvas(20, 16); cd.rectangle((2, 3, 13, 12), fill=(250, 246, 240)); cd.arc((10, 4, 18, 11), 270, 90, fill=(250, 246, 240), width=2)
    cd.rectangle((3, 3, 12, 5), fill=(170, 100, 50)); cd.line([(0, 13), (16, 13)], fill=(250, 246, 240), width=2)
    paste(im, c, 92, 112)
    d = ImageDraw.Draw(im)
    for y, x in ((104, 98), (98, 101), (92, 98)): d.point((x, y), fill=(255, 255, 255))
    shadow(im, 60, 146, 70)
    return stats(badge(im, 'pumpkin'), [3, 3, 2, 3, 2])

def c64():  # Lady Slugworth — ремикс Baron von Worms: улитка-слизень-аристократка с диадемой, жемчугом и лорнетом
    im = wash([PEACH, LEMON, (226, 200, 150)], 64)
    s, sd = canvas(100, 90); SL, SLd, SLl = (170, 200, 120), (130, 160, 90), (206, 228, 160)
    sd.polygon([(4, 84), (30, 76), (54, 66), (60, 40), (62, 20), (70, 8), (82, 8), (90, 20), (90, 48), (86, 70), (96, 84)], fill=SL)
    sd.polygon([(4, 84), (96, 84), (94, 88), (6, 88)], fill=SLd)
    sd.line([(66, 22), (64, 50), (58, 70)], fill=SLl, width=3)
    sd.line([(70, 10), (64, 0)], fill=SLd, width=2); sd.line([(82, 10), (88, 0)], fill=SLd, width=2)
    sd.ellipse((61, -1, 67, 4), fill=SLd); sd.ellipse((85, -1, 91, 4), fill=SLd)
    sd.polygon([(66, 10), (70, 2), (73, 8), (76, 0), (79, 8), (82, 2), (86, 10)], fill=(240, 200, 80)); sd.point([(76, 3), (70, 6), (82, 6)], fill=(120, 200, 230))  # диадема
    eyes(sd, 70, 82, 22, 3, look=-1)
    sd.line([(69, 16), (73, 15)], fill=INK); sd.line([(79, 15), (83, 16)], fill=INK)
    sd.arc((70, 26, 80, 34), 200, 340, fill=INK)  # губки «фи»
    for i in range(9): sd.ellipse((62 + i * 3, 38 + abs(i - 4) // 2 * 2 - (4 - abs(i - 4)), 66 + i * 3, 42 + abs(i - 4) // 2 * 2 - (4 - abs(i - 4))), fill=(252, 248, 240))  # жемчуг
    s = outline(s)
    im.alpha_composite(s, (6, 60))
    d = ImageDraw.Draw(im)
    d.line([(88, 96), (100, 80)], fill=INK, width=2); d.line([(88, 96), (100, 80)], fill=(200, 160, 60))  # лорнет
    d.ellipse((96, 72, 106, 82), outline=INK); d.ellipse((97, 73, 105, 81), outline=(240, 200, 80))
    for x, y in ((14, 154), (30, 156), (8, 150)): d.point((x, y), fill=(255, 255, 255))
    d.line([(0, 150), (20, 150)], fill=(206, 228, 160))
    return stats(badge(im, 'pumpkin'), [1, 2, 1, 3, 2])

def c65():  # Buzzby Caramello — ремикс Candice Creepleton: пчела-конфета, полосатая как кэнди-корн, глаза спиральками, стаканчик кофе
    im = wash([LILAC, (190, 160, 200), (120, 104, 160)], 65)
    b, bd = canvas(80, 80)
    for x0, y0 in ((12, 6), (44, 4)): bd.ellipse((x0, y0, x0 + 24, y0 + 30), fill=(220, 236, 248)); bd.ellipse((x0 + 4, y0 + 4, x0 + 10, y0 + 12), fill=(250, 252, 255))
    bd.ellipse((14, 22, 66, 76), fill=(250, 244, 230))  # тело как кэнди-корн: белая макушка, оранжевая середина, жёлтый низ
    m = Image.new('L', (80, 80), 0); ImageDraw.Draw(m).ellipse((14, 22, 66, 76), fill=255)
    band, bnd = canvas(80, 80); bnd.rectangle((0, 50, 80, 64), fill=(236, 130, 40)); bnd.rectangle((0, 64, 80, 80), fill=(246, 200, 60))
    bnd.line([(0, 50), (80, 50)], fill=INK); bnd.line([(0, 64), (80, 64)], fill=INK)
    b.paste(band, (0, 0), Image.fromarray(np.minimum(np.asarray(m), np.asarray(band)[..., 3])))
    for sx in (30, 50):  # глаза-спиральки
        bd.ellipse((sx - 7, 34, sx + 7, 48), fill=(255, 255, 255)); bd.arc((sx - 5, 36, sx + 5, 46), 0, 300, fill=INK); bd.arc((sx - 2, 39, sx + 2, 43), 90, 360, fill=INK)
    bd.line([(36, 50), (44, 50)], fill=(200, 60, 70)); bd.line([(30, 24), (24, 10)], fill=INK); bd.line([(50, 24), (56, 10)], fill=INK)
    bd.ellipse((21, 7, 26, 12), fill=(236, 130, 40)); bd.ellipse((54, 7, 59, 12), fill=(236, 130, 40))
    b = outline(b)
    im.alpha_composite(b, (20, 30))
    c, cd = canvas(18, 24); cd.polygon([(2, 4), (16, 4), (14, 23), (4, 23)], fill=(250, 246, 240)); cd.rectangle((0, 1, 17, 4), fill=(80, 60, 60))
    cd.rectangle((3, 10, 15, 16), fill=(170, 110, 70)); cd.point([(8, 12), (9, 13), (10, 12)], fill=(250, 246, 240))
    paste(im, c, 88, 92)
    d = ImageDraw.Draw(im)
    for x, y in ((94, 84), (98, 80), (95, 76)): d.point((x, y), fill=(255, 255, 255))  # пар
    for y in range(110, 140, 3): d.line([(36, y), (40, y + 1)], fill=INK); d.line([(80, y), (76, y + 1)], fill=INK)  # «дрожь»
    d.line([(52, 108), (50, 128)], fill=INK); d.line([(66, 108), (68, 128)], fill=INK)
    shadow(im, 60, 140, 40)
    return stats(badge(im, 'pumpkin'), [2, 1, 4, 1, 2])

def c66():  # Count Hopula — ремикс Countfluffula: пушистый белый кролик-вампир с крыльями летучей мыши и морковным соком
    im = wash([ROSE, (200, 170, 200), LILAC], 66)
    w, wd = canvas(116, 50); WG = (110, 80, 110)
    for sx in (-1, 1):
        pts = [(58, 22), (58 + sx * 20, 4), (58 + sx * 46, 2), (58 + sx * 56, 18), (58 + sx * 46, 16), (58 + sx * 40, 30), (58 + sx * 30, 22), (58 + sx * 22, 34)]
        wd.polygon(pts, fill=WG); wd.line([(58 + sx * 20, 4), (58 + sx * 40, 30)], fill=L(WG, 30)); wd.line([(58 + sx * 20, 4), (58 + sx * 30, 22)], fill=L(WG, 30))
    im.alpha_composite(outline(w), (1, 62))
    r, rd = canvas(60, 90); FUR, FURd, PINK = (250, 248, 252), (214, 208, 226), (240, 160, 180)
    rd.ellipse((12, 0, 24, 36), fill=FUR); rd.ellipse((34, 0, 46, 36), fill=FUR); rd.ellipse((15, 6, 21, 30), fill=PINK); rd.ellipse((37, 6, 43, 30), fill=PINK)
    rd.ellipse((6, 26, 54, 70), fill=FUR); rd.ellipse((10, 56, 50, 90), fill=FUR)
    for x, y in ((6, 40), (52, 44), (8, 58), (50, 62), (12, 82), (46, 84)): rd.ellipse((x - 3, y - 3, x + 3, y + 3), fill=FUR)  # пух
    rd.arc((10, 58, 50, 90), 20, 160, fill=FURd)
    rd.polygon([(12, 62), (30, 70), (48, 62), (52, 52), (30, 64), (8, 52)], fill=(130, 30, 50))  # воротник плаща
    eyes(rd, 22, 38, 44, 3)
    rd.polygon([(28, 50), (32, 50), (30, 52)], fill=PINK)
    rd.line([(30, 52), (30, 54)], fill=INK); rd.arc((24, 50, 30, 58), 0, 120, fill=INK); rd.arc((30, 50, 36, 58), 60, 180, fill=INK)
    rd.polygon([(27, 56), (29, 56), (28, 60)], fill=(255, 255, 255)); rd.polygon([(31, 56), (33, 56), (32, 60)], fill=(255, 255, 255))  # клыки
    rd.ellipse((12, 48, 18, 52), fill=PINK); rd.ellipse((42, 48, 48, 52), fill=PINK)
    im.alpha_composite(outline(r), (30, 44))
    g, gd = canvas(16, 30); gd.polygon([(1, 10), (15, 10), (13, 29), (3, 29)], fill=(220, 236, 248)); gd.polygon([(2, 14), (14, 14), (12, 28), (4, 28)], fill=(244, 140, 50))
    gd.line([(10, 0), (8, 14)], fill=(250, 250, 250), width=2); gd.point([(9, 3), (9, 7)], fill=(220, 60, 70))
    gd.polygon([(4, 6), (8, 2), (7, 9)], fill=(110, 170, 70))
    paste(im, g, 92, 110)
    shadow(im, 60, 142, 46)
    return stats(badge(im, 'drop'), [3, 1, 1, 4, 2])

def c67():  # Ghostina Gravy — ремикс Rowena Ghostclaw: привидение-повар в колпаке, с половником, над кастрюлей «вечного супа»
    im = wash([(220, 170, 150), ROSE, LILAC], 67)
    g, gd = canvas(70, 100); GH = (244, 244, 252)
    gd.rectangle((18, 2, 52, 18), fill=GH); [gd.ellipse((x, -2, x + 16, 14), fill=GH) for x in (14, 26, 40)]  # колпак
    gd.line([(18, 18), (52, 18)], fill=(200, 200, 220))
    gd.ellipse((12, 18, 58, 64), fill=GH); gd.rectangle((12, 40, 58, 86), fill=GH)
    for i, x in enumerate(range(12, 58, 9)): gd.ellipse((x, 80, x + 10, 92 + (i % 2) * 4), fill=GH)
    gd.ellipse((20, 26, 26, 36), fill=INK); gd.ellipse((40, 26, 46, 36), fill=INK); gd.point([(22, 28), (42, 28)], fill=(255, 255, 255))
    gd.ellipse((29, 38, 37, 48), fill=INK); gd.ellipse((31, 42, 35, 47), fill=(200, 60, 80))
    gd.ellipse((14, 36, 20, 40), fill=(250, 200, 210)); gd.ellipse((46, 36, 52, 40), fill=(250, 200, 210))
    gd.polygon([(12, 50), (2, 60), (6, 64), (14, 58)], fill=GH)  # ручка-волна
    gd.rectangle((20, 54, 50, 76), fill=(230, 220, 240)); gd.line([(20, 58), (50, 58)], fill=(200, 60, 80))  # фартук
    im.alpha_composite(outline(g), (26, 20))
    d = ImageDraw.Draw(im)
    d.line([(30, 76), (14, 104)], fill=INK, width=3); d.line([(30, 76), (14, 104)], fill=(180, 180, 200)); d.ellipse((8, 100, 20, 108), fill=(180, 180, 200), outline=INK)  # половник
    p, pd = canvas(60, 34); PT = (70, 70, 90)
    pd.rectangle((4, 6, 56, 32), fill=PT); pd.rectangle((0, 4, 60, 8), fill=L(PT, 20)); pd.ellipse((4, 2, 56, 10), fill=(200, 130, 70))
    pd.ellipse((14, 3, 20, 7), fill=(240, 180, 110)); pd.ellipse((36, 4, 40, 7), fill=(240, 180, 110))
    pd.rectangle((8, 14, 52, 26), fill=D(PT, 10)); [pd.point((x, 20), fill=(220, 220, 230)) for x in range(12, 50, 4)]
    paste(im, p, 30, 110)
    d = ImageDraw.Draw(im)
    for x in (44, 58, 72):
        for y in range(92, 108, 4): d.point((x + (y // 4 % 2), y), fill=(255, 255, 255))
    d.rectangle((84, 128, 100, 140), fill=(250, 246, 230), outline=INK); text3(d, 87, 132, 'RIP', INK)  # бирка на кастрюле
    return stats(badge(im, 'drop'), [2, 4, 1, 2, 1])

def c68():  # Toad Mortimer — ремикс Lord Croakstill: жаба в капюшоне жнеца с вилкой вместо косы, уставшая
    im = wash([LILAC, (130, 110, 170), (190, 170, 200)], 68)
    t, td = canvas(70, 110); CL, CLd = (80, 60, 110), (56, 40, 80); TG = (120, 170, 90)
    td.polygon([(10, 108), (14, 40), (24, 14), (35, 6), (46, 14), (56, 40), (60, 108)], fill=CL)
    td.polygon([(35, 6), (46, 14), (56, 40), (60, 108), (40, 108)], fill=CLd)
    td.ellipse((16, 22, 54, 56), fill=TG); td.rectangle((20, 40, 50, 54), fill=TG)
    td.ellipse((16, 18, 30, 32), fill=TG); td.ellipse((40, 18, 54, 32), fill=TG)
    for x in (23, 47):  # сонные глаза
        td.ellipse((x - 5, 20, x + 5, 30), fill=(255, 250, 200)); td.chord((x - 5, 20, x + 5, 30), 180, 360, fill=D(TG, 10)); td.line([(x - 5, 25), (x + 5, 25)], fill=INK); td.point((x, 27), fill=INK)
    td.line([(24, 44), (46, 44)], fill=INK); td.arc((22, 40, 48, 50), 20, 160, fill=D(TG, 30))
    td.ellipse((30, 34, 32, 36), fill=D(TG, 40)); td.ellipse((38, 34, 40, 36), fill=D(TG, 40))
    td.polygon([(14, 40), (24, 14), (35, 6), (46, 14), (56, 40), (50, 36), (46, 20), (35, 12), (24, 20), (20, 36)], fill=CL)  # край капюшона поверх
    td.ellipse((10, 70, 18, 78), fill=TG)
    im.alpha_composite(outline(t), (20, 36))
    d = ImageDraw.Draw(im)
    d.line([(32, 30), (32, 146)], fill=INK, width=3); d.line([(32, 30), (32, 146)], fill=(150, 110, 70))  # вилка-коса
    d.rectangle((24, 28, 40, 32), fill=(200, 200, 214), outline=INK)
    for x in (25, 30, 35, 40): d.rectangle((x - 1, 14, x, 28), fill=(200, 200, 214)); d.line([(x - 2, 14), (x - 2, 28)], fill=INK); d.line([(x + 1, 14), (x + 1, 28)], fill=INK)
    d.line([(24, 13), (41, 13)], fill=INK)
    for x, y in ((92, 30), (100, 22), (106, 14)): text3(d, x, y, 'Z', (250, 246, 236))
    shadow(im, 56, 146, 52)
    return stats(badge(im, 'pumpkin'), [2, 1, 2, 1, 3])

# ---------- предметы ----------
GL_DEL = {"en": "🩹 Removes 1 glitch", "ru": "🩹 Убирает 1 глюк", "lv": "🩹 Noņem 1 kļūmi"}
def c69():  # Haunted Garlic Braid — ремикс Suspicious Herbs: коса чеснока, в которой живёт крошечное привидение
    im = wash([LILAC, (180, 160, 200), (220, 200, 210)], 69)
    d = ImageDraw.Draw(im)
    d.line([(60, 0), (60, 30)], fill=INK, width=2); d.line([(60, 0), (60, 30)], fill=(190, 160, 110))
    for i, (x, y) in enumerate(((60, 34), (50, 50), (70, 54), (58, 70), (46, 86), (68, 90), (56, 108))):
        g, gd = canvas(24, 26); WH = (248, 244, 236)
        gd.ellipse((2, 6, 22, 24), fill=WH); gd.polygon([(9, 8), (12, 0), (15, 8)], fill=WH)
        gd.arc((6, 6, 14, 24), 90, 270, fill=(214, 200, 210)); gd.arc((10, 6, 18, 24), 270, 90, fill=(214, 200, 210)); gd.line([(12, 7), (12, 23)], fill=(200, 180, 200))
        gd.ellipse((4, 10, 8, 16), fill=(255, 255, 255)); [gd.point((x2, 24), fill=(180, 160, 120)) for x2 in (9, 12, 15)]
        if i == 3:  # одна долька — с лицом
            gd.point([(8, 14), (16, 14)], fill=INK); gd.arc((9, 15, 15, 20), 20, 160, fill=INK)
        paste(im, g, x - 12, y - 6)
    gh, hd = canvas(22, 26); hd.ellipse((1, 0, 21, 18), fill=(244, 244, 252)); hd.rectangle((1, 9, 21, 20), fill=(244, 244, 252))
    for x in (1, 8, 15): hd.ellipse((x, 16, x + 6, 24), fill=(244, 244, 252))
    hd.ellipse((6, 6, 9, 10), fill=INK); hd.ellipse((13, 6, 16, 10), fill=INK); hd.ellipse((9, 11, 13, 15), fill=INK)
    paste(im, gh, 84, 66)
    d = ImageDraw.Draw(im)
    for x, y in ((80, 60), (78, 56), (100, 58)): d.point((x, y), fill=(255, 255, 255))
    for x, y, c in ((18, 40, (120, 160, 90)), (16, 60, (120, 160, 90)), (100, 120, (150, 110, 170))):  # веточки трав рядом
        d.line([(x, y), (x, y + 30)], fill=D(c, 30)); [d.ellipse((x - 3 + 4 * (k % 2), y + 4 + k * 6, x + 1 + 4 * (k % 2), y + 7 + k * 6), fill=c) for k in range(4)]
    return glitch(badge(im, 'pumpkin'))

def c70():  # Moody Ring — ремикс Charmageddon: кольцо настроения с камнем-тучкой, работает только когда всё плохо
    im = wash([PEACH, LEMON, (230, 190, 130)], 70)
    r, rd = canvas(70, 80); GO, GOd, GOl = (230, 180, 70), (180, 130, 40), (250, 220, 130)
    rd.ellipse((8, 30, 62, 78), fill=GO); rd.ellipse((18, 40, 52, 70), fill=(0, 0, 0, 0))
    rd.arc((8, 30, 62, 78), 30, 150, fill=GOd, width=3); rd.arc((10, 32, 60, 76), 200, 300, fill=GOl, width=2)
    rd.polygon([(22, 32), (26, 22), (44, 22), (48, 32)], fill=GO)
    rd.ellipse((16, 0, 54, 34), fill=(70, 80, 130)); rd.ellipse((20, 4, 50, 30), fill=(96, 110, 170))
    rd.ellipse((22, 12, 36, 22), fill=(170, 176, 200)); rd.ellipse((30, 8, 46, 22), fill=(170, 176, 200))  # тучка внутри
    rd.point([(30, 15), (38, 15)], fill=INK); rd.arc((30, 17, 38, 22), 200, 340, fill=INK)
    rd.ellipse((22, 6, 27, 10), fill=(220, 230, 255))
    im.alpha_composite(outline(r), (25, 40))
    d = ImageDraw.Draw(im)
    for x, y in ((30, 30), (92, 50), (24, 104)): d.line([(x, y - 3), (x, y + 3)], fill=(255, 255, 255)); d.line([(x - 3, y), (x + 3, y)], fill=(255, 255, 255))
    for x in (54, 62, 70): d.line([(x, 32), (x - 2, 38)], fill=(90, 110, 180))  # дождик
    shadow(im, 60, 126, 50)
    return hp(badge(im, 'pumpkin'), 6)

def c71():  # Spool Ghoul — ремикс Sew-Sew Patty: деревянная катушка с глазами, в нитках застряла иголка
    im = wash([(230, 190, 130), PEACH, ROSE], 71)
    s, sd = canvas(64, 90); WD, WDd = (200, 150, 96), (160, 110, 64); TH, THd = (130, 80, 170), (100, 56, 140)
    sd.ellipse((0, 0, 64, 16), fill=WD); sd.rectangle((8, 8, 56, 80), fill=TH); sd.ellipse((0, 74, 64, 90), fill=WDd)
    sd.rectangle((0, 74, 64, 82), fill=WDd); sd.ellipse((0, 70, 64, 86), fill=WD); sd.ellipse((26, 4, 38, 12), fill=WDd)
    for y in range(18, 74, 3): sd.line([(8, y), (56, y + 1)], fill=THd if y % 2 else TH)
    sd.ellipse((16, 30, 28, 42), fill=(255, 255, 255)); sd.ellipse((36, 30, 48, 42), fill=(255, 255, 255))
    sd.ellipse((20, 34, 26, 40), fill=INK); sd.ellipse((40, 34, 46, 40), fill=INK)
    sd.line([(14, 26), (28, 30)], fill=INK); sd.line([(50, 26), (36, 30)], fill=INK)  # хмурые брови
    sd.arc((24, 46, 40, 56), 200, 340, fill=INK)
    sd.line([(52, 10), (56, 60)], fill=(220, 220, 230), width=2); sd.ellipse((50, 6, 55, 12), outline=(220, 220, 230))  # иголка
    im.alpha_composite(outline(s), (28, 40))
    d = ImageDraw.Draw(im)
    d.line([(36, 110), (20, 130), (40, 136), (14, 146)], fill=(130, 80, 170), width=2)  # хвостик нитки
    for x, y, c in ((92, 40, (200, 60, 70)), (98, 56, (240, 200, 60)), (90, 70, (80, 150, 200))):  # пуговки-подружки
        d.ellipse((x, y, x + 10, y + 10), fill=c, outline=INK); d.point([(x + 4, y + 4), (x + 6, y + 4), (x + 4, y + 6), (x + 6, y + 6)], fill=INK)
    shadow(im, 60, 132, 60)
    return hp(badge(im, 'pumpkin'), 3)

def c72():  # Caramel Onion — ремикс Bad Apple: «яблоко в карамели», которое на самом деле лук
    im = wash([(190, 170, 200), LILAC, PEACH], 72)
    o, od = canvas(64, 80); ON, ONd = (236, 210, 230), (200, 160, 200); CA, CAd, CAl = (180, 110, 50), (140, 80, 30), (220, 150, 80)
    od.ellipse((4, 18, 60, 74), fill=ON); od.polygon([(24, 22), (32, 0), (40, 22)], fill=ON)
    od.arc((14, 18, 50, 74), 100, 260, fill=ONd); od.arc((14, 18, 50, 74), 280, 80, fill=ONd)
    od.chord((4, 18, 60, 74), -15, 195, fill=CA)  # карамель — снизу, сверху видно лук
    for x, y in ((10, 38), (22, 34), (34, 37), (46, 33), (56, 38)): od.ellipse((x - 4, y - 3, x + 4, y + 4), fill=CA)  # волнистый край
    od.arc((8, 22, 56, 70), 30, 90, fill=CAl, width=2); od.arc((4, 18, 60, 74), -15, 195, fill=CAd)
    od.line([(32, 2), (32, 20)], fill=(150, 180, 90))
    od.ellipse((18, 44, 24, 50), fill=INK); od.ellipse((40, 44, 46, 50), fill=INK); od.point([(19, 45), (41, 45)], fill=(255, 255, 255))
    od.line([(26, 56), (38, 54)], fill=INK)  # ухмылка
    od.polygon([(46, 50), (48, 56), (44, 56)], fill=(120, 190, 240))  # слеза
    im.alpha_composite(outline(o), (28, 54))
    d = ImageDraw.Draw(im)
    d.rectangle((58, 8, 62, 60), fill=(250, 246, 236), outline=INK)
    for y in range(10, 58, 6): d.line([(59, y), (61, y + 3)], fill=(220, 70, 80))
    d.ellipse((24, 132, 96, 144), fill=(140, 80, 30)); d.ellipse((32, 134, 88, 140), fill=(180, 110, 50))
    return hp(badge(im, 'pumpkin'), 6)

def c73():  # Bat Boba — ремикс Vamp Juice: бабл-ти вишнёвого цвета с шариками-летучими мышками
    im = wash([SAGE, (200, 210, 170), LEMON], 73)
    c, cd = canvas(56, 96); GL = (226, 236, 246)
    cd.polygon([(4, 30), (52, 30), (46, 94), (10, 94)], fill=GL)
    cd.polygon([(6, 40), (50, 40), (46, 92), (10, 92)], fill=(190, 40, 70)); cd.polygon([(6, 40), (50, 40), (49, 50), (7, 50)], fill=(220, 90, 120))
    cd.ellipse((2, 18, 54, 34), fill=(240, 246, 252)); cd.ellipse((10, 20, 46, 30), fill=(250, 252, 255))
    cd.rectangle((14, 58, 42, 72), fill=(250, 246, 236)); [cd.point((x, 65), fill=INK) for x in range(17, 40, 2)]  # этикетка
    for x, y in ((14, 80), (24, 86), (36, 82), (42, 88), (20, 90), (30, 76)):
        cd.ellipse((x - 3, y - 3, x + 3, y + 3), fill=(40, 24, 40)); cd.polygon([(x - 3, y - 1), (x - 7, y - 4), (x - 5, y + 1)], fill=(40, 24, 40)); cd.polygon([(x + 3, y - 1), (x + 7, y - 4), (x + 5, y + 1)], fill=(40, 24, 40))
        cd.point([(x - 1, y - 1), (x + 1, y - 1)], fill=(240, 80, 90))
    cd.line([(10, 32), (12, 90)], fill=(255, 255, 255))
    im.alpha_composite(outline(c), (32, 52))
    d = ImageDraw.Draw(im)
    d.line([(68, 74), (80, 16)], fill=INK, width=6); d.line([(68, 74), (80, 16)], fill=(40, 24, 40), width=4)  # толстая трубочка
    H.bat(d, 24, 30, 2); H.bat(d, 100, 44, 1); H.bat(d, 96, 104, 1)
    shadow(im, 60, 148, 50)
    return hp(badge(im, 'drop'), 6)

def c74():  # Fang Floss — ремикс Vamp Kiss Fix: мятная зубная нить для вампиров
    im = wash([PEACH, (240, 190, 120), ROSE], 74)
    b, bd = canvas(70, 60); BX = (246, 248, 252)
    bd.rounded_rectangle((2, 10, 68, 58), 10, fill=BX); bd.rounded_rectangle((2, 4, 68, 22), 8, fill=(140, 220, 200))
    bd.rectangle((2, 16, 68, 22), fill=(140, 220, 200)); bd.line([(4, 22), (66, 22)], fill=(100, 180, 160))
    bd.chord((18, 28, 52, 50), 0, 180, fill=(200, 50, 60)); bd.rectangle((20, 34, 50, 38), fill=(255, 255, 255))  # «улыбка» с клыками
    bd.polygon([(24, 38), (28, 38), (26, 44)], fill=(255, 255, 255)); bd.polygon([(42, 38), (46, 38), (44, 44)], fill=(255, 255, 255))
    bd.ellipse((8, 26, 14, 32), fill=(220, 236, 240))
    im.alpha_composite(outline(b), (25, 60))
    d = ImageDraw.Draw(im)
    d.line([(90, 64), (100, 40), (92, 20), (104, 8)], fill=(250, 250, 250), width=1)  # нить
    d.line([(91, 64), (101, 40), (93, 20), (105, 8)], fill=(140, 220, 200))
    for x, y in ((20, 40), (30, 30), (14, 56)):  # мятные листики
        d.ellipse((x, y, x + 8, y + 5), fill=(110, 190, 120), outline=INK); d.line([(x + 1, y + 2), (x + 7, y + 2)], fill=(70, 140, 80))
    d.polygon([(70, 128), (74, 124), (78, 128), (74, 136)], fill=(255, 255, 255))  # блёстки
    d.point([(56, 132), (88, 120), (40, 126)], fill=(255, 255, 255))
    return glitch(badge(im, 'drop'))

def c75():  # Mystery Stew — ремикс One Chance Pizza: суп раз в год, в каждой ложке — неизвестно что
    im = wash([PEACH, LILAC, (200, 170, 200)], 75)
    b, bd = canvas(90, 56); BW, BWd = (110, 150, 200), (80, 110, 160)
    bd.chord((0, -20, 90, 54), 0, 180, fill=BW); bd.ellipse((0, 0, 90, 20), fill=(120, 170, 80))
    bd.ellipse((6, 3, 84, 17), fill=(150, 200, 90))
    bd.ellipse((14, 4, 26, 14), fill=(255, 255, 255)); bd.ellipse((18, 7, 23, 12), fill=(60, 140, 200)); bd.point((20, 9), fill=INK)  # глаз в супе
    bd.ellipse((56, 4, 66, 10), fill=(220, 80, 70)); bd.point([(59, 6), (63, 7)], fill=(255, 255, 255))  # мухомор
    bd.rectangle((40, 2, 48, 8), fill=(240, 200, 80))  # сыр?
    bd.arc((70, 6, 78, 14), 0, 360, fill=(255, 255, 255))
    bd.ellipse((30, 26, 60, 46), fill=(250, 246, 236)); text3(bd, 43, 32, '?', INK)
    bd.arc((0, -20, 90, 54), 20, 160, fill=BWd); bd.line([(30, 52), (60, 52)], fill=BWd, width=3)
    im.alpha_composite(outline(b), (14, 76))
    d = ImageDraw.Draw(im)
    for x, y in ((40, 70), (58, 62), (76, 70), (50, 52)): d.ellipse((x, y, x + 5, y + 5), outline=(255, 255, 255))  # пузыри
    d.line([(90, 72), (106, 30)], fill=INK, width=4); d.line([(90, 72), (106, 30)], fill=(200, 200, 214), width=2); d.ellipse((100, 20, 112, 34), fill=(200, 200, 214), outline=INK)
    for x, y in ((20, 30), (34, 18), (70, 26)): text3(d, x, y, '?', (250, 246, 236))
    shadow(im, 60, 136, 70)
    hp(im, 4, x=4); glitch(im, x=40, add=True)
    return badge(im, 'pumpkin')

def c76():  # Pumpkin Scooter — ремикс Broom Cab: самокат-такси с колёсами-тыквами и шашечками
    im = wash([LILAC, (170, 150, 200), (210, 190, 220)], 76)
    d = ImageDraw.Draw(im)
    for x, y in ((20, 30), (90, 24), (30, 70), (100, 80)): d.line([(x, y - 2), (x, y + 2)], fill=(255, 255, 255)); d.line([(x - 2, y), (x + 2, y)], fill=(255, 255, 255))
    s, sd = canvas(100, 100); MT = (60, 60, 80)
    sd.line([(70, 6), (62, 80)], fill=MT, width=4); sd.line([(60, 6), (82, 6)], fill=MT, width=4)
    sd.rectangle((56, 2, 62, 10), fill=(40, 30, 40)); sd.rectangle((80, 2, 86, 10), fill=(40, 30, 40))
    sd.polygon([(14, 78), (64, 78), (66, 86), (12, 86)], fill=(240, 200, 60))  # дека
    for x in range(14, 64, 6): sd.rectangle((x, 79, x + 2, 81), fill=INK); sd.rectangle((x + 3, 82, x + 5, 84), fill=INK)
    sd.polygon([(60, 18), (78, 18), (76, 30), (62, 30)], fill=(240, 200, 60)); text3(sd, 62, 22, 'TAXI', INK)
    im.alpha_composite(outline(s), (8, 40))
    for x in (14, 70):
        w = H.pumpkin(26, 22, face='jack', lit=True); im.alpha_composite(w, (x, 112))
    d = ImageDraw.Draw(im)
    for y in (120, 128, 136): d.line([(2, y), (10, y)], fill=(250, 246, 236))  # линии скорости
    return badge(im, 'pumpkin')

def c77():  # Ghost Thimble — ремикс Ghost button: напёрсток с привидением внутри, шепчет «опять я?»
    im = wash([LEMON, (240, 220, 150), PEACH], 77)
    d = ImageDraw.Draw(im)
    d.line([(10, 20), (40, 40), (20, 70), (50, 90)], fill=(130, 80, 170), width=1)
    t, td = canvas(56, 66); SV, SVd, SVl = (200, 204, 220), (150, 154, 180), (236, 238, 246)
    td.polygon([(8, 12), (48, 12), (54, 64), (2, 64)], fill=SV); td.ellipse((8, 2, 48, 22), fill=SV)
    td.ellipse((2, 58, 54, 66), fill=SVd)
    for y in range(10, 58, 5):
        for x in range(6 + (y // 5 % 2) * 2, 50, 5): td.point((x, y), fill=SVd)
    td.line([(14, 14), (10, 58)], fill=SVl, width=2)
    td.ellipse((16, 24, 40, 48), fill=(244, 244, 252)); td.rectangle((16, 36, 40, 52), fill=(244, 244, 252))
    for x in (16, 24, 32): td.ellipse((x, 48, x + 8, 56), fill=(244, 244, 252))
    td.ellipse((21, 32, 25, 37), fill=INK); td.ellipse((31, 32, 35, 37), fill=INK); td.ellipse((26, 40, 30, 45), fill=INK)
    im.alpha_composite(outline(t), (32, 64))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((60, 34, 108, 54), 6, fill=(250, 246, 236), outline=INK); d.polygon([(66, 54), (72, 54), (64, 62)], fill=(250, 246, 236)); d.line([(66, 55), (64, 62), (72, 55)], fill=INK)
    text3(d, 64, 38, 'AGAIN', INK); text3(d, 64, 45, 'ME?', INK)
    shadow(im, 60, 134, 56)
    return hp(badge(im, 'pumpkin'), 3)

CARDS = [c62, c63, c64, c65, c66, c67, c68, c69, c70, c71, c72, c73, c74, c75, c76, c77]

def sheet(ims, path, z=3):
    pad = 10; cols = 8
    out = Image.new('RGB', (cols * (CW * z + pad) + pad, 2 * (CH * z + pad) + pad), (43, 26, 81))
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
