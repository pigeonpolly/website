# Кабинет детектива Титоса: день/вечер 320x192 + спрайт + зоны для клика
import sys, os, json, random, math
sys.path.insert(0, os.path.dirname(__file__))
from kit import *
import numpy as _np
OUT = os.path.join(os.path.dirname(__file__), '../../site/images/rooms')
HOT = {}
def hot(k, b): HOT[k] = [round(b[0] / W * 100, 2), round(b[1] / H * 100, 2), round((b[2] - b[0]) / W * 100, 2), round((b[3] - b[1]) / H * 100, 2)]
def scene(mode):
    night = mode == 'night'
    base = Layer(); em = Layer(); rnd = random.Random(9); FY = 140
    put = lambda L: base.im.alpha_composite(L.outlined())
    WALL = (140, 142, 196)
    base.r((0, 0, W, FY), WALL)
    for _ in range(900): base.px([(rnd.randrange(W), rnd.randrange(0, FY - 30))], (132, 134, 190))
    base.r((0, 108, W, FY), (102, 98, 150))
    for x in range(0, W, 20): base.l([(x, 109), (x, FY - 2)], (88, 84, 132))
    base.r((0, 108, W, 109), (170, 170, 214)); base.r((0, FY - 2, W, FY), (70, 60, 90))
    base.r((0, FY, W, H), (112, 80, 62))
    for y in range(FY + 4, H, 8): base.l([(0, y), (W, y)], (92, 64, 50))
    for y in range(FY, H, 8):
        for x in range((y * 37) % 50, W, 50): base.l([(x, y), (x, y + 7)], (92, 64, 50))
    # ковёр
    rug = Layer(); rug.p([(96, 176), (290, 176), (310, 206), (76, 206)], (120, 46, 50)); rug.p([(102, 180), (286, 180), (302, 202), (84, 202)], (150, 60, 60))
    for x in range(110, 290, 12): rug.px([(x, 191)], (220, 180, 100))
    base.im.alpha_composite(rug.im); hot('rug', (76, 190, 310, 208))
    # окно с жалюзи
    base.r((282, 16, 376, 104), (70, 56, 50)); base.r((286, 20, 372, 100), (0, 0, 0))
    sky = Layer()
    for y in range(20, 101):
        t = (y - 20) / 80
        sky.r((286, y, 372, y), (int(150 + 40 * t), int(160 + 30 * t), int(180 + 20 * t)) if not night else (int(20 + 30 * t), int(24 + 26 * t), int(60 + 40 * t)))
    for x0, h in ((286, 44), (304, 60), (328, 36), (346, 54)):
        sky.r((x0, 100 - h, x0 + 17, 100), (110, 116, 140) if not night else (30, 30, 50))
        for wy in range(100 - h + 4, 98, 6):
            for wx in range(x0 + 3, x0 + 15, 4): sky.r((wx, wy, wx + 1, wy + 2), (150, 156, 176) if not night else ((255, 220, 120) if (wx * wy) % 4 else (40, 40, 60)))
    if night: sky.e((350, 26, 362, 38), (240, 240, 220)); sky.r((296, 42, 322, 49), (255, 90, 160)); sky.text(298, 43, 'HOTEL', (255, 230, 250))
    else:
        for i in range(50): sky.l([(286 + (i * 13) % 86, 20 + (i * 7) % 76), (284 + (i * 13) % 86, 24 + (i * 7) % 76)], (200, 206, 220))
    base.im.alpha_composite(sky.im); em.im.alpha_composite(sky.im)
    bl = Layer()
    for y in range(20, 96, 4): bl.p([(286, y), (372, y), (372, y + 2), (286, y + 2)], (218, 206, 170)); bl.l([(286, y + 2), (372, y + 2)], (170, 156, 120))
    bl.r((284, 17, 374, 20), (180, 166, 130)); bl.l([(368, 20), (368, 110)], (218, 206, 170))
    ea = _np.asarray(em.im).copy(); ea[_np.asarray(bl.im)[..., 3] > 0] = 0; em.im = Image.fromarray(ea, 'RGBA')
    base.im.alpha_composite(bl.im); hot('blinds', (282, 16, 376, 110))
    if not night:
        st = Layer()
        for i in range(8):
            y = FY + 4 + i * 8; st.p([(180 + i * 4, y), (270 + i * 4, y), (282 + i * 4, y + 3), (192 + i * 4, y + 3)], (230, 236, 255, 60))
        base.im.alpha_composite(st.im)
    # потолочный вентилятор
    fn = Layer(); fn.r((190, 0, 192, 6), (60, 50, 50)); fn.e((184, 5, 198, 11), (90, 70, 60)); fn.p([(160, 8), (184, 7), (184, 9), (160, 11)], (120, 90, 70)); fn.p([(198, 7), (222, 8), (222, 11), (198, 9)], (120, 90, 70))
    put(fn); hot('fan', (158, 0, 224, 13))
    # высокие стопки коробок, как на картине
    bx = Layer()
    stacks = [(4, ['1532', '1999', '2001', 'A-B']), (34, ['1998', 'C-D', 'E-G', '2000', 'H-K']), (64, ['L-P', 'R-S', 'T-Z'])]
    for x0, labels in stacks:
        for i, lb in enumerate(labels):
            y = FY + 2 - (i + 1) * 22; col = (206, 170, 120) if (i + x0) % 2 else (196, 158, 108)
            hot('box#' + lb, (x0, y, x0 + 28, y + 21)); bx.box((x0, y, x0 + 28, y + 21), col, 30); bx.l([(x0, y + 4), (x0 + 28, y + 4)], D(col, 30)); bx.r((x0 + 4, y + 8, x0 + 24, y + 15), (246, 240, 224)); bx.text(x0 + 6 + (2 if len(lb) == 3 else 0), y + 9, lb, (40, 30, 30))
    bx.p([(40, FY - 112), (62, FY - 116), (64, FY - 110), (42, FY - 106)], (246, 244, 236))  # бумаги сверху
    put(bx)
    # доска улик
    bd = Layer(); bd.r((100, 16, 186, 84), (150, 104, 70)); bd.r((103, 19, 183, 81), (196, 150, 104))
    pins = [(112, 28), (138, 24), (168, 30), (118, 56), (152, 50), (172, 66), (134, 72)]
    for i_, (x, y) in enumerate(pins[:4] + pins[5:]):
        hot(f'photo#{i_}', (x - 6, y - 4, x + 6, y + 8)); bd.r((x - 6, y - 4, x + 6, y + 8), (246, 244, 236)); bd.r((x - 4, y - 2, x + 4, y + 5), (110, 120, 150) if (x + y) % 3 else (150, 110, 90))
    hot('clue', (146, 44, 160, 56)); bd.r((146, 44, 160, 56), (255, 240, 140)); bd.l([(148, 48), (158, 48)], (150, 140, 90))
    for a_, b_ in ((0, 1), (1, 2), (0, 3), (3, 4), (4, 2), (4, 5), (3, 6), (6, 5)): bd.l([pins[a_], pins[b_]], (200, 30, 40))
    for (x, y) in pins: bd.px([(x, y)], (230, 40, 40))
    put(bd); hot('board', (98, 14, 188, 86))
    # дверь с матовым стеклом
    dr = Layer(); dr.box((196, 26, 240, FY), (110, 74, 54), 25); dr.r((202, 32, 234, 76), (200, 210, 214)); dr.text(204, 40, 'TITOS', (40, 40, 50)); dr.text(204, 48, 'DTCTV', (40, 40, 50))
    dr.r((230, 86, 234, 90), (220, 190, 100)); dr.r((202, 84, 234, 132), (100, 66, 48)); put(dr); hot('door', (194, 24, 242, FY))
    # часы и вешалка
    ck = Layer(); ck.e((248, 22, 266, 40), (90, 70, 56)); ck.e((250, 24, 264, 38), (246, 240, 220)); ck.l([(257, 31), (257, 26)], INK); ck.l([(257, 31), (253, 33)], INK)
    put(ck); hot('clock', (246, 20, 268, 42))
    cr = Layer(); cr.r((260, 46, 262, FY), (90, 60, 44)); cr.p([(252, FY), (270, FY), (261, FY - 6)], (90, 60, 44)); cr.l([(254, 50), (268, 50)], (90, 60, 44), 2)
    cr.p([(252, 54), (270, 54), (274, 112), (248, 112)], (176, 150, 100)); cr.l([(261, 56), (261, 110)], (140, 116, 76)); cr.r((252, 76, 270, 79), (150, 124, 82))
    cr.e((250, 44, 272, 52), (70, 60, 60)); cr.r((254, 38, 268, 48), (80, 70, 70)); cr.r((254, 44, 268, 46), (40, 30, 30))
    cr.l([(266, 112), (270, 132)], (60, 50, 60), 2); put(cr); hot('coat', (246, 54, 276, FY)); hot('hat', (248, 36, 274, 53))
    # шкаф с выдвинутым ящиком и сейф
    fc = Layer(); fc.box((286, 112, 324, FY + 22), (96, 104, 96))
    for i_, y in enumerate((116, 134, 152)): fc.r((294, y + 5, 316, y + 7), (170, 176, 160)); fc.l([(288, y + 15), (322, y + 15)], (70, 76, 70)); hot(f'drawer#{i_}', (286, y + 8 if i_ == 0 else y, 324, y + 15))
    fc.box((282, 130, 328, 140), (110, 118, 108), 20)
    for x in range(286, 326, 4): fc.r((x, 124, x + 3, 131), (226, 196, 130) if x % 8 else (210, 176, 116))
    put(fc); hot('folderdrawer', (282, 122, 328, 140))
    sf = Layer(); sf.box((334, 124, 374, FY + 22), (70, 74, 80)); sf.r((338, 128, 370, FY + 18), (84, 88, 96)); sf.e((346, 134, 362, 150), (190, 190, 200)); sf.e((350, 138, 358, 146), (120, 120, 130)); sf.l([(354, 136), (354, 142)], INK)
    sf.r((364, 140, 367, 150), (200, 170, 90)); put(sf); hot('safe', (332, 122, 376, FY + 24)); hot('dial', (345, 133, 363, 151))
    # стол
    dk = Layer(); dk.box((112, 118, 252, 124), (96, 62, 46)); dk.box((116, 124, 248, 168), (80, 52, 40))
    for y in (130, 146): dk.box((206, y, 242, y + 12), (92, 60, 46), 20); dk.r((221, y + 5, 227, y + 6), (200, 170, 100))
    dk.r((122, 130, 200, 166), (72, 46, 36)); put(dk); hot('desk', (112, 124, 204, 168)); hot('deskdrawer#0', (206, 130, 242, 142)); hot('deskdrawer#1', (206, 146, 242, 158))
    lp = Layer(); lp.r((128, 102, 130, 118), (70, 70, 70)); lp.r((122, 117, 136, 119), (60, 60, 60)); lp.p([(118, 102), (140, 102), (134, 90), (124, 90)], (60, 110, 80)); lp.l([(122, 101), (136, 101)], (90, 150, 110))
    put(lp); hot('lamp', (116, 88, 142, 120))
    bulb = Layer(); bulb.r((124, 102, 134, 103), (255, 236, 150)); base.im.alpha_composite(bulb.im); em.im.alpha_composite(bulb.im) if night else None
    tw = Layer(); tw.box((150, 106, 186, 118), (50, 54, 60)); tw.r((154, 98, 182, 106), (246, 244, 236)); tw.l([(156, 101), (178, 101)], (150, 150, 160)); tw.r((148, 104, 188, 106), (40, 40, 46))
    for x in range(154, 184, 3): tw.px([(x, 111), (x + 1, 114)], (200, 200, 200))
    put(tw); hot('typewriter', (146, 96, 190, 119))
    fo = Layer()
    for i in range(5): fo.box((194 - i, 112 - i * 2, 220 - i, 115 - i * 2), (226, 196, 130) if i % 2 else (210, 176, 110), 20)
    fo.r((198, 102, 208, 104), (200, 40, 40)); put(fo); hot('folders', (190, 100, 222, 117))
    pk = Layer(); pk.box((226, 168, 250, 182), (176, 140, 96), 25); pk.l([(238, 168), (238, 182)], (240, 230, 200)); pk.l([(226, 175), (250, 175)], (240, 230, 200)); pk.e((235, 164, 241, 169), (240, 230, 200))
    put(pk); hot('parcel', (224, 162, 252, 184))
    dc = Layer(); dc.box((138, 112, 148, 118), (60, 60, 70), 20); dc.r((140, 113, 146, 115), (120, 200, 220)); dc.l([(143, 118), (140, 124), (146, 128)], (40, 40, 50))
    put(dc); hot('recorder', (136, 110, 150, 120))
    mg = Layer(); mg.box((240, 98, 248, 106), (190, 50, 50), 25); mg.e((247, 100, 252, 105), (190, 50, 50)); mg.e((248, 101, 250, 104), (0, 0, 0, 0)); mg.r((241, 98, 247, 99), (60, 40, 30))
    put(mg); hot('mug', (238, 94, 254, 107))
    mgl = Layer(); mgl.e((314, 102, 324, 110), (200, 170, 90)); mgl.e((316, 103, 322, 109), (190, 220, 240)); mgl.l([(323, 109), (328, 112)], (90, 60, 40), 2)
    put(mgl); hot('magnifier', (311, 98, 330, 114))
    # пол: корзина с бумажками, газеты, листы
    wb = Layer(); wb.p([(258, 160), (272, 160), (270, 180), (260, 180)], (90, 70, 60)); wb.e((258, 157, 272, 163), (70, 56, 50))
    for x, y in ((260, 154), (266, 152), (272, 156)): wb.e((x - 3, y - 3, x + 3, y + 3), (240, 236, 224))
    wb.e((276, 178, 282, 184), (240, 236, 224)); put(wb); hot('bin', (254, 148, 284, 186))
    np_ = Layer()
    for i in range(4): np_.box((300, 186 - i * 4, 332, 190 - i * 4), (226, 222, 210), 20)
    np_.l([(304, 175), (326, 175)], (120, 120, 120)); put(np_); hot('news', (298, 170, 334, 192))
    fl = Layer()
    for i_, (x, y) in enumerate(((140, 190), (160, 196), (200, 186), (250, 194))): hot(f'paper#{i_}', (x - 1, y - 3, x + 13, y + 7)); fl.p([(x, y), (x + 10, y - 2), (x + 12, y + 4), (x + 2, y + 6)], (240, 236, 224))
    base.im.alpha_composite(fl.outlined())
    img = base.im.convert('RGB')
    if night:
        img = evening(img, (0.30, 0.32, 0.52), [(129, 108, 110, (255, 210, 110), 1.15), (330, 60, 80, (140, 170, 255), .35)], em.im)
        st = Layer()
        for i in range(8):
            y = 22 + i * 9; st.p([(282, y), (150, y + 40), (150, y + 43), (282, y + 3)], (170, 190, 255, 55))
        img = img.convert('RGBA'); img.alpha_composite(st.im); img = img.convert('RGB')
    return img
for m in ('day', 'night'): scene(m).save(f'{OUT}/detective-{m}.png')
# Титос по картине Алины: голова-купол без лица со строчкой-швом, тонкая антенна-проводок, белая рубашка, бордовые подтяжки и галстук
from PIL import ImageDraw as _ID
def titos(blink=False):
    # человек с головой улитки (по картине Алины): голова-купол на тонкой шее, два длинных стебелька с глазками,
    # маленькие щупальца-лапки у подбородка, строчка ресниц; рубашка с пышными рукавами, бордовые подтяжки и галстук
    PW, PH_ = 56, 134
    im = Image.new('RGBA', (PW, PH_), (0, 0, 0, 0)); d = _ID.Draw(im)
    G, Gd, Gl = (150, 150, 198), (112, 110, 162), (186, 186, 224)
    Wt, Ws, R_, S = (232, 232, 244), (190, 192, 214), (150, 40, 52), (130, 36, 44)
    cx = 28
    # стебельки с глазками
    for sx, ex, ey in ((cx - 4, cx - 12, 6), (cx + 4, cx + 10, 9)):
        d.line([(sx, 28), (sx + (ex - sx) // 3, 20), (ex, ey + 4)], fill=Gd, width=2)
        d.ellipse((ex - 4, ey - 3, ex + 4, ey + 5), fill=(214, 214, 232))
        if not blink: d.rectangle((ex - 1, ey - 1, ex + 1, ey + 3), fill=(40, 34, 52))
        else: d.line([(ex - 3, ey + 1), (ex + 3, ey + 1)], fill=(40, 34, 52))
    # голова-подушка: небольшая, мягкий скруглённый прямоугольник с чуть «надутыми» боками
    import math as _m
    def pillow(x0, y0, x1, y1, bulge):
        pts = []
        for t in range(0, 21): u = t / 20; pts.append((x0 + (x1 - x0) * u, y0 - bulge * _m.sin(_m.pi * u)))
        for t in range(1, 21): u = t / 20; pts.append((x1 + bulge * _m.sin(_m.pi * u), y0 + (y1 - y0) * u))
        for t in range(1, 21): u = t / 20; pts.append((x1 - (x1 - x0) * u, y1 + bulge * _m.sin(_m.pi * u)))
        for t in range(1, 20): u = t / 20; pts.append((x0 - bulge * _m.sin(_m.pi * u), y1 - (y1 - y0) * u))
        return pts
    d.polygon(pillow(cx - 13, 28, cx + 13, 44, 3), fill=G)
    d.polygon([(x, y) for x, y in pillow(cx - 13, 28, cx + 13, 44, 3) if y > 41] + [(cx + 13, 41), (cx - 13, 41)], fill=Gd)
    d.polygon(pillow(cx - 12, 29, cx + 12, 41, 2), fill=G)
    d.ellipse((cx - 9, 28, cx - 3, 32), fill=Gl)
    # простой рот: короткая мягкая улыбка
    d.line([(cx - 3, 37), (cx - 2, 38), (cx + 2, 38), (cx + 3, 37)], fill=(60, 56, 90))
    # щупальца-лапки у подбородка
    d.line([(cx - 8, 45), (cx - 11, 49), (cx - 9, 51)], fill=Gd, width=2); d.line([(cx + 8, 45), (cx + 11, 49), (cx + 9, 51)], fill=Gd, width=2)
    # шея
    d.rectangle((cx - 3, 46, cx + 3, 54), fill=Gd)
    # рубашка: обычные плечи, длинный торс, прямые руки
    d.polygon([(cx - 11, 58), (cx - 6, 54), (cx + 6, 54), (cx + 11, 58), (cx + 10, 100), (cx - 10, 100)], fill=Wt)
    d.polygon([(cx + 4, 55), (cx + 11, 58), (cx + 10, 100), (cx + 4, 100)], fill=Ws)
    d.polygon([(cx - 6, 52), (cx, 58), (cx - 4, 62), (cx - 9, 56)], fill=Wt); d.polygon([(cx + 6, 52), (cx, 58), (cx + 4, 62), (cx + 9, 56)], fill=Ws)
    d.polygon([(cx - 2, 58), (cx + 2, 58), (cx + 3, 88), (cx, 92), (cx - 3, 88)], fill=R_)
    d.line([(cx - 7, 56), (cx - 7, 100)], fill=S, width=2); d.line([(cx + 7, 56), (cx + 7, 100)], fill=S, width=2)
    for sgn in (-1, 1):
        sx_ = cx + sgn * 11
        d.polygon([(sx_, 58), (sx_ + sgn * 4, 60), (sx_ + sgn * 5, 92), (sx_ + sgn * 1, 92)], fill=Wt if sgn < 0 else Ws)
        d.line([(sx_ + sgn * 1, 80), (sx_ + sgn * 5, 80)], fill=Ws if sgn < 0 else (170, 172, 198))
        d.ellipse((sx_ + (sgn * 5 if sgn < 0 else 0) - (0 if sgn < 0 else 0), 91, sx_ + (0 if sgn < 0 else sgn * 5), 98), fill=G)
    # брюки, ботинки
    d.rectangle((cx - 10, 100, cx + 10, 104), fill=(54, 50, 70))
    d.rectangle((cx - 9, 104, cx - 1, 126), fill=(60, 66, 100)); d.rectangle((cx + 1, 104, cx + 9, 126), fill=(60, 66, 100)); d.line([(cx + 6, 106), (cx + 6, 124)], fill=(48, 52, 82))
    d.rectangle((cx - 11, 126, cx - 1, 129), fill=(30, 26, 36)); d.rectangle((cx + 1, 126, cx + 11, 129), fill=(30, 26, 36))
    a = _np.asarray(im).copy(); m = a[..., 3] > 0; pp = _np.pad(m, 1)
    nb = pp[:-2, 1:-1] | pp[2:, 1:-1] | pp[1:-1, :-2] | pp[1:-1, 2:]; a[nb & ~m] = INK + (255,)
    return Image.fromarray(a, 'RGBA')
titos().save(f'{OUT}/detective-titos.png'); titos(True).save(f'{OUT}/detective-titos-blink.png')
hot('titos', (94, 78, 152, 212))
json.dump({'w': W, 'h': H, 'hot': HOT, 'sprites': {'titos': [94, 80, 56]}}, open(os.path.join(os.path.dirname(__file__), 'detective.json'), 'w'))
print('ok', len(HOT))
