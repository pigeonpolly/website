# Кабинет Полли (офисный клерк): дневная и вечерняя картинка 320x192 + спрайты + зоны для клика
import sys, os, json, random, math
sys.path.insert(0, os.path.dirname(__file__))
from kit import *
OUT = os.path.join(os.path.dirname(__file__), '../../site/images/rooms')
HOT = {}
def hot(k, b): HOT[k] = [round(b[0] / W * 100, 2), round(b[1] / H * 100, 2), round((b[2] - b[0]) / W * 100, 2), round((b[3] - b[1]) / H * 100, 2)]
def scene(mode):
    night = mode == 'night'
    base = Layer(); em = Layer()
    WALL, FLOOR = (206, 196, 164), (112, 122, 144)
    base.r((0, 0, W, 14), (228, 224, 208))
    for x in range(0, W, 32): base.l([(x, 0), (x, 14)], (198, 194, 176))
    base.l([(0, 7), (W, 7)], (210, 206, 190))
    for x0 in (40, 140, 240):
        base.r((x0, 3, x0 + 44, 10), (238, 240, 236) if not night else (150, 150, 150)); base.r((x0, 3, x0 + 44, 3), (200, 200, 196))
        if not night: base.r((x0 + 2, 5, x0 + 42, 8), (255, 255, 250))
    base.r((0, 14, W, 15), (176, 168, 140))
    base.r((0, 15, W, 127), WALL)
    rnd = random.Random(3)
    for _ in range(500): base.px([(rnd.randrange(W), rnd.randrange(15, 126))], (198, 188, 156))
    base.r((0, 96, W, 97), (186, 176, 146)); base.r((0, 124, W, 127), (150, 134, 104))
    base.r((0, 128, W, H), FLOOR)
    for _ in range(1400): base.px([(rnd.randrange(W), rnd.randrange(128, H))], rnd.choice([(102, 112, 134), (124, 134, 156)]))
    # окно
    base.r((8, 20, 90, 102), (236, 236, 230)); base.r((12, 24, 86, 98), (0, 0, 0))
    sky = Layer()
    if not night:
        for y in range(24, 99): sky.r((12, y, 86, y), (150 + (y - 24) // 2, 196 + (y - 24) // 4, 232))
        sky.e((22, 30, 44, 38), (250, 250, 250)); sky.e((30, 27, 46, 36), (250, 250, 250))
    else:
        for y in range(24, 99):
            t = (y - 24) / 74; c = (int(70 + 180 * t), int(50 + 90 * t), int(110 - 30 * t)); sky.r((12, y, 86, y), c)
        sky.e((60, 70, 74, 84), (255, 214, 120))
    for x0, h, c in ((12, 30, (150, 80, 66)), (30, 44, (126, 70, 60)), (52, 24, (160, 100, 80)), (66, 38, (118, 78, 70))):
        sky.r((x0, 98 - h, x0 + 16, 98), c if not night else D(c, 70))
        for wy in range(98 - h + 4, 96, 6):
            for wx in range(x0 + 3, x0 + 14, 5): sky.r((wx, wy, wx + 1, wy + 2), (90, 110, 140) if not night else (255, 214, 110) if (wx + wy) % 3 else (60, 50, 70))
    base.im.alpha_composite(sky.im); em.im.alpha_composite(sky.im) if night else None
    # старые жалюзи: перекошенный низ, гнутая планка, шнур
    bl = Layer()
    SL, SD = (232, 226, 200), (196, 188, 156)
    for i, y in enumerate(range(24, 79, 4)):
        tilt = 2 if i in (5, 6) else 0
        bl.p([(12, y), (86, y + tilt), (86, y + 2 + tilt), (12, y + 2)], SL); bl.l([(12, y + 2), (86, y + 2 + tilt)], SD)
    bl.p([(12, 79), (86, 72), (86, 75), (12, 82)], (214, 206, 176)); bl.l([(12, 82), (86, 75)], (170, 160, 130))
    bl.p([(40, 52), (50, 56), (60, 52), (60, 54), (50, 58), (40, 54)], (214, 206, 176))
    bl.l([(30, 24), (30, 81)], (170, 160, 130)); bl.l([(68, 24), (68, 75)], (170, 160, 130))
    bl.r((10, 21, 88, 24), (200, 194, 168)); bl.l([(10, 24), (88, 24)], INK)
    bl.l([(84, 24), (84, 108)], (236, 230, 206)); bl.e((82, 106, 86, 112), (236, 230, 206)); bl.px([(84, 112)], INK)
    if night:  # жалюзи не светятся — вырезаем их из «светящегося» слоя неба
        import numpy as _np
        ea = _np.asarray(em.im).copy(); ba = _np.asarray(bl.im)[..., 3] > 0; ea[ba] = 0; em.im = Image.fromarray(ea, 'RGBA')
    base.im.alpha_composite(bl.im); hot('blinds', (8, 20, 90, 112))
    # полосы света от жалюзи на полу
    if not night:
        st = Layer()
        for i in range(6):
            y = 132 + i * 9; st.p([(30 + i * 6, y), (110 + i * 6, y), (124 + i * 6, y + 4), (44 + i * 6, y + 4)], (255, 250, 220, 70))
        base.im.alpha_composite(st.im)
    # кулер
    c = Layer()
    c.box((94, 96, 118, 142), (236, 236, 240)); c.r((97, 100, 115, 104), (210, 210, 220))
    c.r((99, 108, 102, 112), (60, 120, 220)); c.r((109, 108, 112, 112), (220, 60, 60)); c.r((97, 116, 115, 118), (180, 180, 190))
    c.p([(98, 64), (114, 64), (116, 70), (116, 94), (96, 94), (96, 70)], (130, 186, 236)); c.r((103, 60, 109, 64), (110, 160, 220))
    c.l([(99, 72), (99, 90)], (200, 232, 252)); c.l([(97, 80), (115, 80)], (110, 170, 226)); c.l([(97, 86), (115, 86)], (110, 170, 226))
    c.r((119, 100, 123, 120), (246, 246, 246)); c.r((119, 98, 123, 100), (200, 200, 210))
    base.im.alpha_composite(c.outlined()); hot('cooler', (92, 58, 124, 144))
    # календарь и копир
    ca = Layer(); ca.r((98, 24, 120, 50), (250, 250, 246)); ca.r((98, 24, 120, 30), (200, 60, 60)); ca.text(102, 25, 'OCT', (255, 255, 255))
    for yy in range(33, 49, 4):
        for xx in range(100, 119, 4): ca.r((xx, yy, xx + 2, yy + 2), (200, 200, 210))
    ca.r((108, 41, 110, 43), (230, 60, 60))
    base.im.alpha_composite(ca.outlined()); hot('calendar', (96, 22, 122, 52))
    cp = Layer(); cp.box((8, 120, 58, 168), (214, 208, 190)); cp.box((6, 112, 60, 122), (196, 190, 172)); cp.r((10, 114, 56, 118), (60, 66, 80))
    cp.box((40, 124, 56, 132), (90, 96, 110)); cp.r((43, 126, 53, 129), (120, 220, 160)); cp.r((14, 136, 52, 140), (170, 164, 146)); cp.r((14, 150, 52, 154), (170, 164, 146))
    cp.r((60, 128, 70, 132), (250, 250, 246)); cp.r((14, 160, 52, 166), (186, 180, 160))
    base.im.alpha_composite(cp.outlined()); hot('copier', (4, 110, 72, 170))
    # часы, постер, доска
    k = Layer(); k.e((128, 22, 146, 40), (250, 250, 246)); k.e((130, 24, 144, 38), (255, 255, 255))
    for a in range(0, 360, 30): k.px([(137 + round(6 * math.cos(math.radians(a))), 31 + round(6 * math.sin(math.radians(a))))], (120, 120, 130))
    k.l([(137, 31), (137, 26)], INK); k.l([(137, 31), (141, 33)], INK)
    base.im.alpha_composite(k.outlined()); hot('clock', (126, 20, 148, 42))
    po = Layer(); po.r((156, 20, 196, 66), (40, 50, 90))
    for y in range(22, 50): po.r((158, y, 194, y), (int(240 - (y - 22) * 3), int(150 - (y - 22) * 2), int(90 + (y - 22) * 2)))
    po.e((168, 38, 184, 54), (255, 220, 120)); po.r((158, 46, 194, 50), (40, 50, 90))
    for x, y in ((166, 30), (176, 27), (186, 32)): po.px([(x - 2, y), (x - 1, y - 1), (x, y), (x + 1, y - 1), (x + 2, y)], INK)
    po.text(160, 56, 'TEAMWORK', (250, 236, 200))
    base.im.alpha_composite(po.outlined()); hot('poster', (154, 18, 198, 68))
    b = Layer(); b.r((206, 26, 254, 64), (196, 150, 100)); b.r((208, 28, 252, 62), (214, 170, 120))
    for x, y, col in ((212, 32, (255, 240, 130)), (226, 30, (160, 220, 250)), (240, 34, (255, 170, 190)), (214, 46, (180, 240, 160)), (230, 44, (255, 255, 255)), (242, 48, (255, 240, 130))):
        b.r((x, y, x + 9, y + 9), col); b.px([(x + 4, y + 1)], (220, 40, 40)); b.l([(x + 2, y + 4), (x + 7, y + 4)], (150, 150, 150)); b.l([(x + 2, y + 6), (x + 6, y + 6)], (150, 150, 150))
    base.im.alpha_composite(b.outlined()); hot('board', (204, 24, 256, 66))
    # шкаф с папками и цветок
    f = Layer(); f.box((288, 64, 316, 142), (150, 160, 150))
    for y in (66, 85, 104, 123): f.box((291, y, 313, y + 16), (164, 174, 164), 25); f.r((298, y + 6, 306, y + 8), (220, 220, 210)); f.r((300, y + 2, 304, y + 4), (240, 240, 230))
    base.im.alpha_composite(f.outlined()); hot('cabinet', (286, 62, 318, 144))
    pl = Layer(); pl.p([(292, 52), (312, 52), (309, 64), (295, 64)], (190, 100, 60))
    for (x, y, dx, dy) in ((302, 50, -10, -14), (302, 50, 8, -16), (302, 50, -2, -22), (302, 50, 12, -6), (302, 50, -12, -4)):
        pl.p([(x, y), (x + dx, y + dy), (x + dx // 2 + 3, y + dy // 2)], (70, 140, 70)); pl.l([(x, y), (x + dx, y + dy)], (50, 110, 50))
    base.im.alpha_composite(pl.outlined()); hot('plant', (286, 26, 318, 66))
    # стол, кресло, предметы
    ch = Layer(); ch.r((198, 72, 228, 108), (50, 50, 60)); ch.r((200, 74, 226, 104), (64, 64, 76)); ch.l([(202, 76), (202, 102)], (90, 90, 104))
    base.im.alpha_composite(ch.outlined())
    dk = Layer(); dk.box((164, 106, 286, 112), (176, 124, 82)); dk.box((166, 112, 284, 152), (150, 102, 66))
    for y in (118, 130, 142): dk.box((250, y, 280, y + 9), (164, 114, 74), 25); dk.r((262, y + 4, 268, y + 5), (220, 200, 140))
    dk.r((172, 116, 244, 148), (140, 94, 60))
    base.im.alpha_composite(dk.outlined()); hot('desk', (164, 112, 286, 152))
    mo = Layer(); mo.box((232, 74, 272, 104), (222, 214, 188)); mo.r((236, 78, 268, 98), (0, 0, 0)); mo.r((244, 102, 260, 106), (200, 192, 168))
    scr = Layer(); scr.r((237, 79, 267, 97), (40, 70, 60) if not night else (60, 120, 100))
    for y in range(81, 96, 3): scr.l([(239, y), (239 + (y * 7) % 22 + 4, y)], (120, 220, 160))
    scr.r((239, 80, 245, 80), (230, 240, 250))
    base.im.alpha_composite(mo.outlined()); base.im.alpha_composite(scr.im); em.im.alpha_composite(scr.im) if night else None
    hot('monitor', (230, 72, 274, 107))
    kb = Layer(); kb.box((236, 106, 272, 110), (210, 204, 182), 20)
    for x in range(238, 270, 3): kb.px([(x, 107), (x + 1, 108)], (170, 164, 146))
    base.im.alpha_composite(kb.outlined())
    mg = Layer(); mg.box((276, 96, 284, 106), (250, 250, 250), 20); mg.e((283, 98, 288, 104), (250, 250, 250)); mg.e((284, 99, 286, 103), (0, 0, 0, 0)); mg.r((277, 96, 283, 97), (110, 70, 40))
    mg.px([(279, 100), (281, 100), (278, 101), (280, 102)], (220, 60, 80))
    base.im.alpha_composite(mg.outlined()); hot('mug', (274, 92, 290, 107))
    je = Layer(); je.box((186, 92, 206, 106), (246, 210, 70), 30); je.r((189, 97, 203, 101), (70, 70, 80)); je.r((189, 96, 199, 97), (110, 110, 120)); je.px([(188, 94), (189, 94)], (255, 250, 200))
    base.im.alpha_composite(je.outlined()); hot('jello', (184, 90, 208, 107))
    npl = Layer(); npl.p([(210, 100), (232, 100), (234, 106), (208, 106)], (120, 80, 50)); npl.text(212, 101, 'POLLY', (250, 220, 140))
    base.im.alpha_composite(npl.outlined()); hot('nameplate', (206, 98, 236, 108))
    # корзина
    tr = Layer(); tr.p([(166, 150), (180, 150), (178, 170), (168, 170)], (110, 116, 130)); tr.e((166, 147, 180, 153), (90, 96, 110)); tr.e((170, 144, 176, 150), (250, 250, 240))
    base.im.alpha_composite(tr.outlined()); hot('trash', (164, 142, 182, 172))
    hot('lights', (40, 2, 284, 12))
    img = base.im.convert('RGB')
    if night:
        img = evening(img, (0.42, 0.40, 0.58), [(252, 92, 70, (90, 200, 160), .9), (60, 60, 150, (255, 150, 90), .55), (106, 80, 40, (120, 170, 255), .35)], em.im)
        # вечерние оранжевые полосы через жалюзи на стене справа от окна
        st = Layer()
        for i in range(5):
            y = 40 + i * 9; st.p([(92, y), (150, y + 22), (150, y + 25), (92, y + 3)], (255, 160, 90, 60))
        img = img.convert('RGBA'); img.alpha_composite(st.im); img = img.convert('RGB')
    return img
for m in ('day', 'night'): scene(m).save(f'{OUT}/office-{m}.png')
# спрайты: Полли во весь рост, телефон
POLLY = ["......bbbbb.......", ".....bbbbbbb......", "....bbbbbbbbb.....", "....bbbwwbbbbb....", "....bbbwkbbbbboo..", "....bbbbbbbbbbooo.",
 "....lbbbbbbbbbb...", ".....lbbbbbbbbb...", "......bbbbbbbb....", ".....ccbbbbbcc....", "....sbcctttccbs...", "...ssbbbtttbbbss..", "..sssbbbbtbbbbsss.",
 "..ssbbbbbtbbbbbss.", ".sssbbbbbbbbbbbsss", ".ssbbbbbbbbbbbbpps", ".ssbbbbbgbbbbbbpps", ".ssbbbbbgbbbbbbpps", "..sbbbbbbbbbbbbpp.", "..sbbbbbbbbbbbbs..",
 "..sbbbbbbbbbbbbs..", "...bbbbbbbbbbbb...", "...lbbbbbbbbbbb...", "....lbbbbbbbbb....", ".....bbbbbbbb.....", "......bbbbbb......", "......o....o......",
 "......o....o......", "......o....o......", ".....oo...oo......", "....ooo..ooo......"]
PC = {'b': (127, 129, 191), 's': (94, 90, 156), 'l': (160, 164, 214), 'w': (255, 255, 255), 'k': (26, 21, 40), 'o': (242, 167, 59), 't': (196, 50, 60),
      'c': (250, 250, 250), 'p': (250, 250, 236), 'g': (250, 214, 110)}
sprite(POLLY, PC, 2).save(f'{OUT}/office-polly.png'); sprite([r.replace('ww', 'bb').replace('wk', 'kk') if i in (3, 4) else r for i, r in enumerate(POLLY)], PC, 2).save(f'{OUT}/office-polly-blink.png')
PH = ["..rrrrrrrrrr....", ".rrrrrrrrrrrr...", "...r......r.....", "..yyyyyyyyyyy...", ".yyyykkkkyyyyy..", ".yyykyykyykyyy..", ".yyyyyyyyyyyyyc.", "yyyyyyyyyyyyyyc."]
sprite(PH, {'r': (230, 222, 196), 'y': (220, 210, 180), 'k': (120, 112, 96), 'c': (60, 60, 60)}).save(f'{OUT}/office-phone.png')
hot('polly', (120, 110, 160, 178)); hot('phone', (168, 96, 186, 107))
json.dump({'w': W, 'h': H, 'hot': HOT, 'sprites': {'polly': [120, 112, 40], 'phone': [168, 97, 18]}}, open(os.path.join(os.path.dirname(__file__), 'office.json'), 'w'))
print('ok', len(HOT))
