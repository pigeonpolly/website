from PIL import Image, ImageDraw
import numpy as np, math
W, H = 40, 46
INK = (26, 21, 40); GOLD = (226, 176, 74); GOLDD = (176, 122, 44); GOLDL = (250, 214, 120)
NAVY = (34, 44, 82); CREAM = (244, 234, 210); WHITE = (250, 248, 240)
def shield_mask():
    m = np.zeros((H, W), bool)
    for y in range(H):
        half = W / 2 if y < H * .55 else W / 2 * (1 - ((y - H * .55) / (H * .45)) ** 1.6)
        for x in range(W):
            if abs(x + .5 - W / 2) < half - .3: m[y, x] = True
    return m
def ring(m):
    p = np.pad(m, 1); e = p[1:-1, 1:-1] & p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:]
    return m & ~e, e
MASK = shield_mask(); OUT, IN1 = ring(MASK); RIM, IN2 = ring(IN1)

class C:
    def __init__(s, field, rim=GOLD):
        s.field = field; s.rim = rim
        s.im = Image.new('RGB', (W, H), field); s.d = ImageDraw.Draw(s.im)
        s.fg = Image.new('L', (W, H), 0); s.fd = ImageDraw.Draw(s.fg)
    def _both(s, fn, *a, col=None, outline=True, **k):
        getattr(s.d, fn)(*a, fill=col, **k)
        if outline: getattr(s.fd, fn)(*a, fill=255, **k)
    def ell(s, box, col, o=True): s._both('ellipse', box, col=col, outline=o)
    def rect(s, box, col, o=True): s._both('rectangle', box, col=col, outline=o)
    def poly(s, pts, col, o=True): s._both('polygon', pts, col=col, outline=o)
    def line(s, pts, col, w=1, o=True): s._both('line', pts, col=col, width=w, outline=o)
    def px(s, pts, col, o=False):
        for p in pts:
            s.d.point(p, fill=col)
            if o: s.fd.point(p, fill=255)
    def done(s, ink=INK, inner=None):
        a = np.asarray(s.im).copy(); fg = np.asarray(s.fg) > 0
        p = np.pad(fg, 1); nb = p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:]
        a[(~fg) & nb & IN2] = ink
        out = np.zeros((H, W, 4), np.uint8); out[..., :3] = a; out[..., 3] = MASK * 255
        out[RIM, :3] = s.rim; out[OUT, :3] = INK
        if inner is not None:
            _, i3 = ring(IN2); r3 = IN2 & ~i3; out[r3, :3] = inner
        return Image.fromarray(out, 'RGBA')

def arc_pts(cx, cy, r, a0, a1, n=40):
    return [(cx + r * math.cos(math.radians(a0 + (a1 - a0) * i / n)), cy + r * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]

S = {}
# 1 New Wobbleton: чайка на изогнутой башне с часами
c = C(NAVY)
c.poly([(22, 30), (28, 30), (30, 40), (22, 41), (17, 38)], GOLD)          # изогнутое основание
c.line([(23, 32), (28, 32)], GOLDD, o=False); c.line([(21, 36), (28, 36)], GOLDD, o=False)
c.rect((16, 16, 25, 30), GOLD)                                               # башня
c.rect((16, 16, 17, 30), GOLDL, o=False)
c.ell((17, 19, 24, 26), WHITE); c.px([(20, 21), (20, 22), (21, 22)], INK)   # циферблат и стрелки
c.poly([(15, 16), (26, 16), (24, 13), (17, 13)], GOLDD)                     # крыша
c.ell((15, 6, 24, 12), (232, 232, 236)); c.ell((21, 4, 26, 9), (232, 232, 236))  # чайка
c.poly([(14, 8), (19, 9), (15, 11)], (150, 154, 170))                       # хвост
c.px([(26, 6), (27, 6), (27, 7)], (240, 160, 40), o=True); c.px([(24, 6)], INK)
c.poly([(16, 9), (22, 9), (19, 12)], (180, 184, 198), o=False)             # крыло
c.px([(18, 13), (21, 13)], (240, 160, 40))
S['newwobbleton'] = c.done()
# 2 Maplewink: голубь на стопке блинов, мёд льётся сверху
c = C((52, 62, 120))
for y in (34, 30, 26):
    c.ell((7, y, 32, y + 6), GOLD); c.line([(9, y + 4), (30, y + 4)], GOLDD, o=False)
c.poly([(8, 28), (31, 28), (31, 30), (28, 31), (27, 34), (25, 31), (14, 31), (13, 35), (11, 31), (8, 30)], (240, 168, 40), o=False)
c.line([(22, 3), (22, 14)], (240, 168, 40), w=2)                           # струя мёда
c.ell((12, 15, 26, 27), (120, 132, 196)); c.ell((18, 10, 26, 18), (120, 132, 196))
c.ell((13, 18, 21, 25), (90, 100, 168), o=False)                            # крыло
c.px([(23, 13)], WHITE); c.px([(24, 13)], INK); c.px([(27, 14), (28, 14)], (240, 160, 40), o=True)
c.px([(16, 27), (20, 27)], (240, 140, 60))
S['maplewink'] = c.done()
# 3 Snailhollow: улитка с кружкой на раковине
c = C(CREAM, rim=(150, 120, 80))
c.poly([(5, 36), (30, 36), (33, 33), (12, 33), (10, 24), (7, 24), (6, 30)], (236, 196, 90))   # тело
c.line([(8, 24), (6, 19)], INK, o=False); c.line([(10, 24), (11, 19)], INK, o=False)
c.ell((5, 17, 7, 19), INK, o=False); c.ell((10, 17, 12, 19), INK, o=False)
c.px([(8, 27)], INK)
c.ell((13, 20, 31, 35), (200, 150, 90))                                      # раковина
for (cx, cy, r) in ((22, 28, 6), (22, 28, 3.5)):
    c.line(arc_pts(cx, cy, r, 200, 520, 30), (130, 86, 50), o=False)
c.px([(22, 28), (23, 28)], (130, 86, 50))
c.rect((17, 10, 26, 20), (80, 170, 100)); c.rect((17, 10, 18, 20), (130, 210, 140), o=False)
c.ell((25, 12, 30, 17), (80, 170, 100)); c.ell((27, 14, 28, 15), CREAM, o=False)
c.px([(20, 8), (21, 7), (21, 6), (22, 5)], (170, 170, 180))
S['snailhollow'] = c.done()
# 4 Pinecrust: белка с пирогом на фоне жёлудя
c = C((150, 150, 210))
c.ell((6, 15, 33, 41), (246, 222, 156)); c.poly([(15, 40), (24, 40), (19, 43)], (246, 222, 156))
c.ell((4, 8, 35, 18), (178, 128, 62)); c.rect((18, 4, 21, 9), (130, 90, 44))
for x in range(7, 34, 4): c.px([(x, 12), (x + 2, 14)], (210, 160, 84))
RUST, RUSTD, BELLY = (200, 84, 40), (150, 56, 30), (250, 226, 190)
def oell(box, col):
    x0, y0, x1, y1 = box; c.ell((x0 - 1, y0 - 1, x1 + 1, y1 + 1), INK, o=False); c.ell(box, col, o=False)
oell((22, 16, 33, 35), RUSTD); oell((25, 13, 32, 21), RUSTD)          # хвост
c.ell((24, 19, 30, 31), (176, 70, 36), o=False)
oell((12, 22, 25, 38), RUST)                                           # тело
oell((10, 14, 21, 25), RUST)                                           # голова
c.poly([(17, 11), (20, 15), (16, 15)], INK, o=False); c.poly([(17, 12), (19, 15), (17, 15)], RUST, o=False)  # ухо
c.ell((14, 26, 20, 36), BELLY, o=False)
c.px([(13, 18), (14, 18), (13, 19), (14, 19)], INK); c.px([(14, 18)], WHITE)
c.px([(9, 21), (10, 21)], INK)
oell((6, 27, 17, 32), (214, 166, 96)); c.line([(7, 28), (16, 28)], (180, 50, 60), o=False)   # пирог
c.px([(13, 31), (14, 31), (16, 30)], RUST)
c.px([(13, 38), (14, 38), (19, 38), (20, 38)], INK)
S['pinecrust'] = c.done()
# 5 Lemonvale: долька лимона
c = C((40, 92, 64))
c.ell((6, 8, 33, 37), (236, 190, 60)); c.ell((8, 10, 31, 35), (255, 252, 236), o=False)
c.ell((10, 12, 29, 33), (246, 216, 90), o=False)
cx, cy = 19.5, 22.5
for i in range(8):
    a = math.radians(i * 45); c.line([(cx, cy), (cx + 9.5 * math.cos(a), cy + 9.5 * math.sin(a))], (255, 252, 240), o=False)
c.px([(19, 22), (20, 22), (19, 23), (20, 23)], (255, 252, 240))
S['lemonvale'] = c.done()
# 6 Buttonspire: игла, нитка завитком, пуговица
c = C((26, 34, 64), rim=WHITE)
c.ell((10, 34, 30, 40), (110, 160, 200))
c.line([(14, 34), (27, 8)], (200, 204, 214), w=2); c.px([(26, 10)], (26, 34, 64))
THR = (236, 104, 96)
pts = [(26, 9), (27, 6), (25, 3), (21, 3), (18, 5)]
for i in range(66):
    a = math.radians(60 + i * 10); r = 7 - i * 0.08
    pts.append((12 + r * math.cos(a), 11 - r * math.sin(a)))
c.line(pts[:5], THR, w=1, o=False)
c.line(pts[4:], THR, o=False)
c.ell((19, 24, 30, 35), WHITE); c.px([(23, 28), (26, 28), (23, 31), (26, 31)], (26, 34, 64))
S['buttonspire'] = c.done()
# 7 Noodleford: узел из трёх лапшинок
c = C((28, 52, 70))
NOOD, NOODL = (238, 196, 98), (252, 230, 160)
for i, r in enumerate((5, 7, 9)):
    col = NOODL if i == 1 else NOOD
    c.line(arc_pts(12.5, 18, r, 35, 325, 80) + [(15 + i - 1, 27), (9 + i * 2, 38)], col)
    c.line(arc_pts(26.5, 18, r, 215, 505, 80) + [(24 - i + 1, 27), (30 - i * 2, 38)], col)
S['noodleford'] = c.done()
# 8 Jamshire: банка варенья в венке
c = C(CREAM, rim=(150, 104, 60))
for a in range(0, 360, 45):
    x, y = 19.5 + 13 * math.cos(math.radians(a)), 22 + 14 * math.sin(math.radians(a))
    c.ell((x - 2.5, y - 2.5, x + 2.5, y + 2.5), (150, 90, 160)); c.px([(round(x), round(y))], (240, 200, 90))
c.rect((13, 16, 26, 31), (170, 40, 50)); c.rect((14, 18, 15, 29), (220, 90, 90), o=False)
c.rect((12, 12, 27, 15), (190, 150, 90)); c.rect((15, 21, 24, 26), CREAM, o=False)
c.px([(17, 23), (18, 23), (19, 23), (20, 23), (21, 23)], (170, 40, 50))
S['jamshire'] = c.done()
# 9 Cheddarford: мышка с короной на головке сыра
c = C(NAVY)
c.ell((8, 28, 32, 40), (232, 190, 90)); c.ell((8, 25, 32, 34), (246, 214, 120))
c.px([(12, 35), (20, 37), (26, 34)], (190, 140, 60)); c.px([(15, 29), (24, 30)], (210, 160, 70))
c.ell((13, 14, 25, 28), (176, 120, 70)); c.ell((10, 10, 18, 18), (176, 120, 70))
c.ell((14, 8, 18, 12), (220, 150, 150)); c.px([(12, 13)], INK); c.px([(9, 15)], (220, 150, 150), o=True)
c.line([(25, 26), (30, 22), (31, 16)], (176, 120, 70))
c.poly([(10, 9), (11, 5), (13, 7), (14, 4), (15, 7), (17, 5), (17, 9)], GOLD)
S['cheddarford'] = c.done()
# 10 Kettleford: медный чайник, пар-сердечко
c = C(NAVY)
c.ell((5, 4, 15, 13), (240, 228, 200)); c.ell((13, 4, 23, 13), (240, 228, 200)); c.poly([(6, 10), (22, 10), (14, 18)], (240, 228, 200))
c.px([(10, 20), (9, 21), (9, 22), (10, 23)], (240, 228, 200))
c.ell((11, 23, 31, 39), (190, 100, 50)); c.rect((10, 36, 32, 39), (160, 80, 40))
c.ell((14, 26, 18, 31), (230, 150, 90), o=False)
c.poly([(12, 30), (5, 23), (7, 22), (13, 27)], (190, 100, 50))             # носик
c.line(arc_pts(21, 24, 7, 200, 340, 20), (160, 80, 40), w=2); c.rect((19, 20, 23, 23), (160, 80, 40))
S['kettleford'] = c.done()
# 11 Department of Reflection on the Deed: зеркало с хмурым отражением
c = C((52, 32, 66), rim=(240, 140, 170))
c.rect((18, 33, 21, 41), (190, 196, 214)); c.ell((17, 39, 22, 42), (150, 156, 176))
c.ell((8, 4, 31, 35), (200, 206, 222)); c.ell((9, 5, 30, 34), (150, 156, 180), o=False)
c.ell((11, 7, 28, 32), (176, 214, 232), o=False)
c.line([(14, 12), (19, 9)], WHITE, o=False); c.line([(13, 16), (15, 15)], WHITE, o=False)
c.line([(14, 18), (17, 20)], INK, o=False); c.line([(25, 18), (22, 20)], INK, o=False)   # брови
c.px([(16, 21), (16, 22), (23, 21), (23, 22)], INK)
c.line(arc_pts(19.5, 30, 4, 200, 340, 12), INK, o=False)                               # хмурый рот
c.px([(30, 6), (31, 5), (32, 6), (31, 7), (7, 30), (6, 29), (8, 29)], (240, 140, 170))
S['department'] = c.done()

keys = ['newwobbleton','maplewink','snailhollow','pinecrust','lemonvale','buttonspire','noodleford','jamshire','cheddarford','kettleford','department']
sheet = Image.new('RGBA', ((W + 4) * len(keys), H + 4), (42, 30, 74, 255))
for i, k in enumerate(keys):
    S[k].save(f'p3crest-{k}.png'); sheet.alpha_composite(S[k], (i * (W + 4) + 2, 2))
sheet.resize((sheet.width * 4, sheet.height * 4), Image.NEAREST).save('p3crests-sheet.png')
