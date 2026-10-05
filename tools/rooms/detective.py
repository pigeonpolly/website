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
    base = Layer(); em = Layer(); rnd = random.Random(9)
    WALL = (140, 142, 196)
    base.r((0, 0, W, 124), WALL)
    for x in range(0, W, 10): base.l([(x, 0), (x, 95)], (132, 134, 188))
    base.r((0, 96, W, 124), (102, 98, 150))
    for x in range(0, W, 20): base.l([(x, 97), (x, 123)], (88, 84, 132))
    base.r((0, 96, W, 97), (170, 170, 214)); base.r((0, 122, W, 124), (70, 60, 90))
    base.r((0, 124, W, H), (112, 80, 62))
    for y in range(128, H, 8): base.l([(0, y), (W, y)], (92, 64, 50))
    for y in range(124, H, 8):
        for x in range((y * 37) % 50, W, 50): base.l([(x, y), (x, y + 7)], (92, 64, 50))
    # окно с жалюзи
    base.r((234, 16, 314, 98), (70, 56, 50)); base.r((238, 20, 310, 94), (0, 0, 0))
    sky = Layer()
    for y in range(20, 95):
        t = (y - 20) / 74
        sky.r((238, y, 310, y), (int(150 + 40 * t), int(160 + 30 * t), int(180 + 20 * t)) if not night else (int(20 + 30 * t), int(24 + 26 * t), int(60 + 40 * t)))
    for x0, h in ((238, 40), (254, 56), (276, 34), (292, 50)):
        sky.r((x0, 94 - h, x0 + 15, 94), (110, 116, 140) if not night else (30, 30, 50))
        for wy in range(94 - h + 4, 92, 6):
            for wx in range(x0 + 3, x0 + 13, 4): sky.r((wx, wy, wx + 1, wy + 2), (150, 156, 176) if not night else ((255, 220, 120) if (wx * wy) % 4 else (40, 40, 60)))
    if night:
        sky.e((290, 26, 302, 38), (240, 240, 220)); sky.r((246, 40, 272, 47), (255, 90, 160)); sky.text(248, 41, 'HOTEL', (255, 230, 250))
    else:
        for i in range(40): sky.l([(238 + (i * 13) % 72, 20 + (i * 7) % 70), (236 + (i * 13) % 72, 24 + (i * 7) % 70)], (200, 206, 220))
    base.im.alpha_composite(sky.im); em.im.alpha_composite(sky.im)
    bl = Layer()
    for i, y in enumerate(range(20, 90, 4)):
        bl.p([(238, y), (310, y), (310, y + 2), (238, y + 2)], (218, 206, 170)); bl.l([(238, y + 2), (310, y + 2)], (170, 156, 120))
    bl.r((236, 17, 312, 20), (180, 166, 130)); bl.l([(306, 20), (306, 104)], (218, 206, 170))
    ea = _np.asarray(em.im).copy(); ea[_np.asarray(bl.im)[..., 3] > 0] = 0; em.im = Image.fromarray(ea, 'RGBA')
    base.im.alpha_composite(bl.im); hot('blinds', (234, 16, 314, 104))
    if not night:
        st = Layer()
        for i in range(7):
            y = 128 + i * 8; st.p([(150 + i * 4, y), (230 + i * 4, y), (240 + i * 4, y + 3), (160 + i * 4, y + 3)], (230, 236, 255, 60))
        base.im.alpha_composite(st.im)
    # потолочный вентилятор
    fn = Layer(); fn.r((168, 0, 170, 6), (60, 50, 50)); fn.e((162, 5, 176, 11), (90, 70, 60)); fn.p([(140, 8), (162, 7), (162, 9), (140, 11)], (120, 90, 70)); fn.p([(176, 7), (200, 8), (200, 11), (176, 9)], (120, 90, 70))
    base.im.alpha_composite(fn.outlined()); hot('fan', (138, 0, 202, 13))
    # полки с коробками дел
    sh = Layer()
    for y in (52, 86, 120): sh.box((4, y, 84, y + 3), (120, 84, 60), 25)
    sh.r((4, 20, 6, 122), (100, 70, 50)); sh.r((82, 20, 84, 122), (100, 70, 50))
    labels = [('A-B', 'C-E', 'F-K'), ('1999', '2003', '2024'), ('L-P', 'R-S', 'T-Z')]
    for row, y in enumerate((30, 64, 98)):
        for i, lb in enumerate(labels[row]):
            x = 8 + i * 25; col = (206, 170, 120) if (i + row) % 2 else (196, 158, 108)
            sh.box((x, y, x + 22, y + 21), col, 30); sh.r((x + 3, y + 7, x + 19, y + 14), (246, 240, 224)); sh.text(x + 4 + (4 if len(lb) == 3 else 0) - (2 if len(lb) == 4 else 0), y + 8, lb, (40, 30, 30))
            sh.l([(x, y + 3), (x + 22, y + 3)], D(col, 30))
    base.im.alpha_composite(sh.outlined()); hot('boxes', (2, 18, 86, 124))
    # доска с уликами и красными нитками
    bd = Layer(); bd.r((96, 18, 176, 76), (150, 104, 70)); bd.r((99, 21, 173, 73), (196, 150, 104))
    pins = [(108, 30), (132, 26), (160, 32), (114, 56), (146, 50), (164, 62), (128, 66)]
    for (x, y) in pins[:4] + pins[5:]:
        bd.r((x - 6, y - 4, x + 6, y + 8), (246, 244, 236)); bd.r((x - 4, y - 2, x + 4, y + 5), (110, 120, 150) if (x + y) % 3 else (150, 110, 90))
    bd.r((140, 44, 154, 56), (255, 240, 140)); bd.l([(142, 48), (152, 48)], (150, 140, 90)); bd.l([(142, 51), (150, 51)], (150, 140, 90))
    for a, b in ((0, 1), (1, 2), (0, 3), (3, 4), (4, 2), (4, 5), (3, 6), (6, 5)): bd.l([pins[a], pins[b]], (200, 30, 40))
    for (x, y) in pins: bd.px([(x, y)], (230, 40, 40)); bd.px([(x, y - 1)], (255, 120, 120))
    base.im.alpha_composite(bd.outlined()); hot('board', (94, 16, 178, 78))
    ck = Layer(); ck.e((184, 22, 202, 40), (90, 70, 56)); ck.e((186, 24, 200, 38), (246, 240, 220)); ck.l([(193, 31), (193, 26)], INK); ck.l([(193, 31), (189, 33)], INK)
    base.im.alpha_composite(ck.outlined()); hot('clock', (182, 20, 204, 42))
    # вешалка: плащ и шляпа
    cr = Layer(); cr.r((214, 36, 216, 124), (90, 60, 44)); cr.p([(206, 124), (224, 124), (215, 118)], (90, 60, 44)); cr.l([(208, 40), (222, 40)], (90, 60, 44), 2)
    cr.p([(206, 44), (224, 44), (228, 100), (202, 100)], (176, 150, 100)); cr.l([(215, 46), (215, 98)], (140, 116, 76)); cr.r((206, 66, 224, 69), (150, 124, 82))
    cr.e((204, 34, 226, 42), (70, 60, 60)); cr.r((208, 28, 222, 38), (80, 70, 70)); cr.r((208, 34, 222, 36), (40, 30, 30))
    base.im.alpha_composite(cr.outlined()); hot('coat', (200, 26, 230, 126))
    # шкаф с выдвинутым ящиком папок
    fc = Layer(); fc.box((244, 100, 280, 152), (96, 104, 96))
    for y in (104, 120, 136): fc.r((250, y + 5, 274, y + 7), (170, 176, 160)); fc.l([(246, y + 14), (278, y + 14)], (70, 76, 70))
    fc.box((240, 118, 284, 128), (110, 118, 108), 20)
    for x in range(244, 282, 4): fc.r((x, 112, x + 3, 119), (226, 196, 130) if x % 8 else (210, 180, 116)); fc.px([(x + 1, 112)], (250, 220, 150))
    base.im.alpha_composite(fc.outlined()); hot('cabinet', (238, 98, 286, 154))
    # стол
    dk = Layer(); dk.box((100, 104, 232, 110), (96, 62, 46)); dk.box((104, 110, 228, 152), (80, 52, 40))
    for y in (116, 130): dk.box((190, y, 222, y + 11), (92, 60, 46), 20); dk.r((203, y + 5, 209, y + 6), (200, 170, 100))
    dk.r((110, 116, 184, 150), (72, 46, 36))
    base.im.alpha_composite(dk.outlined()); hot('desk', (100, 110, 232, 152))
    # лампа (как на картине — тёплый жёлтый свет)
    lp = Layer(); lp.r((116, 90, 118, 104), (70, 70, 70)); lp.r((110, 103, 124, 105), (60, 60, 60)); lp.p([(106, 90), (128, 90), (122, 78), (112, 78)], (60, 110, 80)); lp.l([(110, 89), (124, 89)], (90, 150, 110))
    base.im.alpha_composite(lp.outlined()); hot('lamp', (104, 76, 130, 106))
    bulb = Layer(); bulb.r((112, 90, 122, 91), (255, 236, 150)); em.im.alpha_composite(bulb.im) if night else None; base.im.alpha_composite(bulb.im)
    tw = Layer(); tw.box((140, 94, 176, 106), (50, 54, 60)); tw.r((144, 86, 172, 94), (246, 244, 236)); tw.l([(146, 89), (168, 89)], (150, 150, 160)); tw.l([(146, 91), (162, 91)], (150, 150, 160))
    tw.r((138, 92, 178, 94), (40, 40, 46))
    for x in range(144, 174, 3): tw.px([(x, 99), (x + 1, 102)], (200, 200, 200))
    base.im.alpha_composite(tw.outlined()); hot('typewriter', (136, 84, 180, 107))
    fo = Layer()
    for i in range(4): fo.box((184 - i, 100 - i * 2, 208 - i, 103 - i * 2), (226, 196, 130) if i % 2 else (210, 176, 110), 20)
    fo.r((188, 92, 198, 94), (200, 40, 40))
    base.im.alpha_composite(fo.outlined()); hot('folders', (180, 90, 210, 105))
    mg = Layer(); mg.box((214, 96, 222, 104), (190, 50, 50), 25); mg.e((221, 98, 226, 103), (190, 50, 50)); mg.e((222, 99, 224, 102), (0, 0, 0, 0)); mg.r((215, 96, 221, 97), (60, 40, 30))
    base.im.alpha_composite(mg.outlined()); hot('mug', (212, 92, 228, 105))
    mgl = Layer(); mgl.e((128, 98, 136, 104), (200, 170, 90)); mgl.e((130, 99, 134, 103), (190, 220, 240)); mgl.l([(135, 103), (139, 105)], (90, 60, 40), 2)
    base.im.alpha_composite(mgl.outlined()); hot('magnifier', (126, 96, 140, 107))
    # коробки на полу и бумаги
    fl = Layer(); fl.box((16, 140, 50, 168), (196, 158, 108), 30); fl.box((22, 124, 48, 141), (206, 170, 120), 30); fl.r((26, 150, 42, 158), (246, 240, 224)); fl.text(27, 152, 'CASE', (40, 30, 30))
    fl.box((54, 152, 72, 170), (186, 150, 100), 30)
    for x, y in ((80, 172), (96, 178), (140, 170)): fl.p([(x, y), (x + 10, y - 2), (x + 12, y + 4), (x + 2, y + 6)], (240, 236, 224))
    base.im.alpha_composite(fl.outlined()); hot('floorboxes', (14, 122, 74, 172))
    img = base.im.convert('RGB')
    if night:
        img = evening(img, (0.30, 0.32, 0.52), [(117, 96, 95, (255, 210, 110), 1.15), (272, 56, 70, (140, 170, 255), .35)], em.im)
        st = Layer()
        for i in range(7):
            y = 22 + i * 9; st.p([(234, y), (130, y + 34), (130, y + 37), (234, y + 3)], (170, 190, 255, 55))
        img = img.convert('RGBA'); img.alpha_composite(st.im); img = img.convert('RGB')
    return img
for m in ('day', 'night'): scene(m).save(f'{OUT}/detective-{m}.png')
TIT = ["..k........k....", "...k......k.....", "....k....k......", "....gggggggg....", "...gggggggggg...", "..gggggggggggg..", "..ggkkgggggkkg..",
 "..ggkwgggggkwg..", "..gggggggggggg..", "...gggggggggg...", "....gggggggg....", "......gggg......", "....wwwrrwww....", "...wwwwrrwwww...",
 "..swwwwrrwwwws..", "..swwwwrrwwwws..", ".gswwwwrrwwwwsg.", ".gswwwwrrwwwwsg.", ".gswwwwwwwwwwsg.", ".g.wwwwwwwwww.g.", "...nnnnnnnnnn...",
 "...nnnnnnnnnn...", "...nnnn..nnnn...", "...nnnn..nnnn...", "...nnnn..nnnn...", "...nnnn..nnnn...", "...nnnn..nnnn...", "..kkkkk..kkkkk.."]
TC = {'k': (40, 34, 52), 'g': (150, 156, 178), 'w': (240, 240, 244), 'r': (180, 40, 50), 's': (60, 50, 70), 'n': (60, 66, 100)}
sprite(TIT, TC, 2).save(f'{OUT}/detective-titos.png')
sprite([r.replace('kw', 'gg').replace('kk', 'gg') if i in (6, 7) else r for i, r in enumerate(TIT)], TC, 2).save(f'{OUT}/detective-titos-blink.png')
hot('titos', (74, 116, 110, 178))
json.dump({'w': W, 'h': H, 'hot': HOT, 'sprites': {'titos': [74, 118, 36]}}, open(os.path.join(os.path.dirname(__file__), 'detective.json'), 'w'))
print('ok', len(HOT))
