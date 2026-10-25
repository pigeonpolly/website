# «Обо мне»: мастерская Алины, нарисованная с нуля по её фото, в выбранной ею рисовке (мягкий объём → крупные пятна цвета).
# Сцена 1200x900: угол комнаты, стол со стеллажом, рамки, пробковая доска с гирляндой, лампа, окно со шторой и решёткой,
# тыквы-соты, фигурки, комодик-декупаж, акварель, рыжий кот; Алина со спины (рыжие кудри, фиолетовое худи), Полли на подоконнике.
# Потом: медианный фильтр → 400x300 → 56 цветов без дизеринга (как на образце, который понравился Алине).
# python3 tools/rooms/lab.py → site/images/about/lab.png (400x300) и lab@3x.png
import os, math, random
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

OUT = os.path.join(os.path.dirname(__file__), '../../site/images/about'); os.makedirs(OUT, exist_ok=True)
W, H = 1200, 900
rnd = random.Random(5); nrg = np.random.default_rng(5)
yy, xx = np.mgrid[0:H, 0:W].astype(float)
C = np.zeros((H, W, 3))                      # холст, 0..1


def c(*v): return np.array(v, float) / 255


def M(draw, blur=0.8):                       # маска со сглаживанием (рисуем в 2x)
    m = Image.new('L', (W * 2, H * 2), 0); dr = ImageDraw.Draw(m)
    draw(lambda pts: [(x * 2, y * 2) for x, y in pts], dr)
    m = m.resize((W, H), Image.LANCZOS)
    if blur: m = m.filter(ImageFilter.GaussianBlur(blur))
    return np.asarray(m).astype(float) / 255


def poly(pts, blur=.8): return M(lambda s, d: d.polygon(s(pts), fill=255), blur)
def rect(b, blur=.8): return poly([(b[0], b[1]), (b[2], b[1]), (b[2], b[3]), (b[0], b[3])], blur)
def ell(b, blur=.8): return M(lambda s, d: d.ellipse(s([(b[0], b[1]), (b[2], b[3])]), fill=255), blur)
def line(pts, w, blur=.8): return M(lambda s, d: d.line(s(pts), fill=255, width=w * 2), blur)


def paint(m, col):
    global C
    col = np.asarray(col, float)
    if col.ndim == 1: col = col[None, None]
    C = C * (1 - m[..., None]) + col * m[..., None]


def shadow(m, dx=6, dy=8, r=10, k=.35):      # мягкая тень от предмета на то, что позади
    global C
    s = np.roll(np.roll(m, dy, 0), dx, 1)
    s = np.asarray(Image.fromarray((s * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r))).astype(float) / 255
    C = C * (1 - k * s[..., None])


def hgrad(x0, x1, c0, c1, p=1.):
    t = np.clip((xx - x0) / max(1, x1 - x0), 0, 1) ** p; return c0 * (1 - t[..., None]) + c1 * t[..., None]
def vgrad(y0, y1, c0, c1, p=1.):
    t = np.clip((yy - y0) / max(1, y1 - y0), 0, 1) ** p; return c0 * (1 - t[..., None]) + c1 * t[..., None]
def sphere(cx, cy, rx, ry, col, lx=.6, ly=-.6, amb=.45, spec=.25):
    nx = np.clip((xx - cx) / rx, -1, 1); ny = np.clip((yy - cy) / ry, -1, 1)
    nz = np.sqrt(np.clip(1 - nx ** 2 - ny ** 2, 0, 1))
    lam = np.clip(nx * lx + ny * ly + nz * .55, 0, 1)
    sp = np.clip(1 - np.hypot(nx - lx * .5, ny - ly * .5) / .35, 0, 1) ** 2 * spec
    return col[None, None] * (amb + (1 - amb) * lam)[..., None] + sp[..., None]
def noise(k): return nrg.normal(0, k, (H, W, 1))
def box3(front, top_h, side_w, col, top_k=1.15, side_k=.72, sh=True):
    """объёмный ящик: перед, верх (светлее), правый бок (темнее)"""
    x0, y0, x1, y1 = front
    if sh: shadow(rect(front), 8, 6, 9, .3)
    if top_h: paint(poly([(x0, y0), (x1, y0), (x1 + side_w, y0 - top_h), (x0 + side_w, y0 - top_h)]), col * top_k)
    if side_w: paint(poly([(x1, y0), (x1 + side_w, y0 - top_h), (x1 + side_w, y1 - top_h), (x1, y1)]), col * side_k)
    paint(rect(front), vgrad(y0, y1, col * 1.05, col * .9))


# ======================= КОМНАТА =======================
CEIL_Y, FLOOR_Y, CX0 = 34, 640, 860          # потолок, пол у задней стены, угол
def top_r(x): return CEIL_Y - (x - CX0) * .282
def bot_r(x): return FLOOR_Y + (x - CX0) * .53
def rw(x, t): return top_r(x) + t * (bot_r(x) - top_r(x))

WALL = c(150, 124, 112)
paint(np.ones((H, W)), vgrad(0, FLOOR_Y, WALL * 1.08, WALL * .9) + noise(.012))
for y in range(CEIL_Y + 2, FLOOR_Y, 4):                       # фактура обоев — мелкие горизонтали
    C[y, :CX0] *= .985
paint(rect((0, 0, W, CEIL_Y)), vgrad(0, CEIL_Y, c(214, 206, 196), c(196, 188, 178)))
paint(poly([(CX0, CEIL_Y), (W, top_r(W)), (W, 0), (CX0, 0)]), c(204, 196, 186))
paint(poly([(CX0, CEIL_Y), (W, top_r(W)), (W, bot_r(W)), (CX0, FLOOR_Y)]), hgrad(CX0, W, WALL * .86, WALL * 1.0) + noise(.012))
paint(line([(CX0, CEIL_Y), (CX0, FLOOR_Y)], 2, 1.5), WALL * .7)
# пол — ламинат
paint(poly([(0, FLOOR_Y), (CX0, FLOOR_Y), (W, bot_r(W)), (W, H), (0, H)]), vgrad(FLOOR_Y, H, c(120, 84, 58), c(150, 106, 72)) + noise(.015))
for i in range(-12, 30):
    x = CX0 + i * 70
    paint(line([(x, FLOOR_Y + (x - CX0) * .53 * (x > CX0)), (CX0 + (x - CX0) * 2.2, H)], 1, .6), c(100, 70, 48))
paint(rect((0, FLOOR_Y - 10, CX0, FLOOR_Y)), c(214, 204, 190) * .9)      # плинтус
paint(poly([(CX0, FLOOR_Y - 10), (W, bot_r(W) - 14), (W, bot_r(W)), (CX0, FLOOR_Y)]), c(214, 204, 190) * .8)

# ======================= ОКНО (правая стена) =======================
WXF, WXN, WT0, WT1 = 900, 1170, .10, .64      # дальний и ближний край, верх и низ (доля высоты стены)
def wq(t0, t1, x0=WXF, x1=WXN): return [(x0, rw(x0, t0)), (x1, rw(x1, t0)), (x1, rw(x1, t1)), (x0, rw(x0, t1))]
frame_m = poly(wq(WT0 - .02, WT1 + .005, WXF - 12, WXN + 16))
shadow(frame_m, -6, 6, 8, .25); paint(frame_m, c(232, 228, 220))
glass = poly(wq(WT0, WT1))
TB = .42                                                   # низ шторы
view = vgrad(rw(1000, TB), rw(1000, WT1), c(255, 196, 120), c(236, 140, 96))
view = view + sphere(1060, rw(1060, WT1) - 30, 140, 70, c(70, 96, 54), .3, -.8, .7, 0) * ell((900, rw(1060, WT1) - 100, 1220, rw(1060, WT1) + 40))[..., None] * 0
paint(glass, view)
bush = ell((910, rw(1000, WT1) - 70, 1060, rw(1000, WT1) + 60)) + ell((1020, rw(1100, WT1) - 100, 1200, rw(1100, WT1) + 60))
paint(np.clip(bush, 0, 1) * glass, sphere(1050, rw(1050, WT1) - 20, 160, 90, c(96, 120, 60), .2, -.9, .6, 0) + noise(.03))
for k in range(-6, 10):                                    # решётка ромбами
    xa = WXF + k * 50
    for sgn in (1, -1):
        pts = [(xa + t * 100 * sgn * 0 + t * 100, rw(xa + t * 100, TB + (WT1 - TB) * (t if sgn > 0 else 1 - t))) for t in (0, 1)]
        paint(line(pts, 3, .6) * glass, c(60, 54, 58))
paint(line([(1030, rw(1030, WT0)), (1030, rw(1030, WT1))], 6, .6), c(232, 228, 220))
blind = poly(wq(WT0 - .01, TB, WXF - 6, WXN + 8))
paint(blind, vgrad(rw(1000, WT0), rw(1000, TB), c(255, 236, 196), c(250, 212, 160)) + noise(.008))
for t in np.arange(WT0 + .02, TB, .035): paint(line([(WXF - 4, rw(WXF - 4, t)), (WXN + 6, rw(WXN + 6, t))], 1, .8) * blind, c(236, 206, 160))
paint(poly([(WXF - 6, rw(WXF - 6, TB - .006)), (WXN + 8, rw(WXN + 8, TB - .008)), (WXN + 8, rw(WXN + 8, TB + .01)), (WXF - 6, rw(WXF - 6, TB + .008))]), c(220, 196, 156))
paint(poly([(WXF - 14, rw(WXF, WT0 - .045)), (WXN + 18, rw(WXN, WT0 - .05)), (WXN + 18, rw(WXN, WT0 - .015)), (WXF - 14, rw(WXF, WT0 - .015))]), c(226, 222, 214))
# подоконник
SY0, SY1 = rw(WXF, WT1 + .005), rw(WXN, WT1 + .005)
paint(poly([(WXF - 20, SY0), (WXN + 26, SY1), (WXN + 10, SY1 + 26), (WXF - 34, SY0 + 16)]), c(240, 238, 232))
paint(poly([(WXF - 34, SY0 + 16), (WXN + 10, SY1 + 26), (WXN + 10, SY1 + 34), (WXF - 34, SY0 + 22)]), c(196, 192, 186))
# маленькая рамка в барокко на правой стене
paint(poly([(1160, rw(1160, .16)), (1196, rw(1196, .16)), (1196, rw(1196, .30)), (1160, rw(1160, .30))]), c(190, 150, 60) + noise(.05))

# ======================= СТЕНА: РАМКИ, ДОСКА, ГИРЛЯНДА =======================
def framed(b, fc, inner, matw=8, d=4):
    shadow(rect(b), 7, 9, 8, .35)
    paint(rect(b), hgrad(b[0], b[2], fc * 1.08, fc * .9) + noise(.01))
    x0, y0, x1, y1 = b
    paint(rect((x0 + d, y0 + d, x1 - d, y1 - d)), fc * .8)
    paint(rect((x0 + d + 2, y0 + d + 2, x1 - d - 2, y1 - d - 2)), c(246, 242, 232))
    inner(x0 + d + 2 + matw, y0 + d + 2 + matw, x1 - d - 2 - matw, y1 - d - 2 - matw)
def in_cafe(x0, y0, x1, y1):
    paint(rect((x0, y0, x1, y1)), c(36, 32, 40)); paint(rect((x0 + 6, y0 + 6, x1 - 6, y0 + 18)), c(206, 64, 60))
    mx, my = (x0 + x1) / 2, (y0 + y1) / 2 + 10
    paint(poly([(mx, my - 26), (mx + 26, my), (mx, my + 26), (mx - 26, my)]), c(240, 150, 50)); paint(poly([(mx, my - 18), (mx + 18, my), (mx, my + 18), (mx - 18, my)]), c(36, 32, 40))
    paint(rect((mx - 8, my - 4, mx + 6, my + 8)), c(250, 240, 220))
def in_collage(x0, y0, x1, y1):
    mx, my = (x0 + x1) / 2, (y0 + y1) / 2
    paint(rect((x0, y0, mx, my)), c(200, 110, 50))
    for i in range(4):
        for j in range(2): paint(ell((x0 + 4 + i * 15, y0 + 4 + j * 18, x0 + 16 + i * 15, y0 + 18 + j * 18)), sphere(x0 + 10 + i * 15, y0 + 11 + j * 18, 7, 7, c(246, 150, 50)))
    paint(rect((mx + 2, y0, x1, my)), c(196, 204, 206)); paint(ell((mx + 10, y0 + 8, mx + 30, y0 + 38)), c(250, 250, 248)); paint(ell((mx + 28, y0 + 12, mx + 44, y0 + 38)), c(238, 238, 236))
    paint(rect((x0, my + 2, x1, y1)), c(104, 140, 176)); paint(rect((x0 + 12, y1 - 22, x0 + 66, y1 - 8)), c(210, 40, 44)); paint(rect((x0 + 24, y1 - 30, x0 + 52, y1 - 20)), c(220, 70, 66))
def in_pigeon(x0, y0, x1, y1):
    paint(ell((x0 + 6, y0 + 14, x1 - 6, y1)), sphere((x0 + x1) / 2, (y0 + y1) / 2 + 6, (x1 - x0) / 2, (y1 - y0) / 2, c(146, 150, 196)))
    paint(ell((x1 - 26, y0 + 2, x1 - 6, y0 + 22)), c(140, 146, 190))
def in_sea(x0, y0, x1, y1):
    my = (y0 + y1) / 2; paint(rect((x0, y0, x1, my)), vgrad(y0, my, c(190, 214, 228), c(230, 220, 200))); paint(rect((x0, my, x1, y1)), c(80, 124, 160))
def in_lady(x0, y0, x1, y1):
    paint(rect((x0, y0, x1, y1)), c(70, 44, 52)); paint(ell((x0 + 8, y0 + 6, x1 - 8, y0 + 34)), c(232, 196, 170)); paint(rect((x0 + 4, y0 + 34, x1 - 4, y1)), c(160, 50, 60))
framed((70, 52, 168, 170), c(238, 236, 230), in_cafe)
framed((560, 70, 712, 182), c(104, 70, 50), in_collage, 0, 6)
framed((600, 210, 664, 276), c(238, 236, 230), in_pigeon, 6)
framed((680, 206, 770, 270), c(238, 236, 230), in_sea, 6)
framed((780, 96, 830, 160), c(196, 156, 60), in_lady, 2, 5)
# пробковая доска
CB = (226, 120, 528, 296)
shadow(rect(CB), 8, 10, 9, .35)
paint(rect(CB), c(240, 238, 232))
paint(rect((CB[0] + 8, CB[1] + 8, CB[2] - 8, CB[3] - 8)), c(196, 146, 94) + noise(.04))
cx_, cy_ = 290, 200                                     # цветовой круг
paint(rect((cx_ - 40, cy_ - 40, cx_ + 40, cy_ + 40)), c(30, 30, 34))
ang = (np.degrees(np.arctan2(yy - cy_, xx - cx_)) + 360) % 360; rr = np.hypot(xx - cx_, yy - cy_)
hsv = np.stack([ang / 360, np.full_like(ang, .75), np.full_like(ang, .92)], -1)
rgb = np.asarray(Image.fromarray((hsv * 255).astype(np.uint8), 'HSV').convert('RGB')).astype(float) / 255
paint(((rr > 18) & (rr < 34)).astype(float), rgb)
paint(poly([(cx_, cy_ - 16), (cx_ + 14, cy_ + 8), (cx_ - 14, cy_ + 8)]), c(250, 214, 60))
for b, col in (((350, 140, 400, 212), c(250, 250, 246)), ((410, 136, 460, 176), c(236, 196, 120)), ((470, 140, 516, 196), c(196, 86, 70)), ((412, 190, 470, 250), c(126, 176, 196)), ((350, 222, 400, 280), c(246, 240, 226)), ((476, 210, 516, 270), c(232, 140, 60))):
    shadow(rect(b), 3, 4, 3, .3); paint(rect(b), col + noise(.01))
paint(line([(358, 196), (366, 160), (388, 164), (388, 200)], 2), c(110, 110, 130)); paint(ell((364, 150, 386, 172)), c(250, 250, 246)); paint(line([(364, 162), (372, 150), (384, 154), (386, 166)], 2), c(110, 110, 130))
for y in range(232, 276, 8): paint(line([(358, y), (392, y)], 1), c(170, 166, 160))
# гирлянда: провод, лампочки (светятся в конце)
def sag(xa, ya, xb, yb, s, n): return [(xa + (xb - xa) * i / n, ya + (yb - ya) * i / n + s * math.sin(math.pi * i / n)) for i in range(n + 1)]
wire = sag(214, 116, 376, 126, 26, 60) + sag(376, 126, 540, 116, 24, 60)[1:] + sag(540, 116, 556, 300, -10, 60)[1:]
paint(line([(round(x), round(y)) for x, y in wire], 2, .6), c(50, 44, 40))
BULBS = [(x, y + 6) for x, y in wire[5::12]]

# ======================= СТОЛ И СТЕЛЛАЖ =======================
OAK = c(206, 164, 112); OAKD = c(170, 128, 84)
DT0, DT1, DF1 = 470, 545, 640                  # стол: задний край, передний, низ переда
HT, HX0, HX1 = 300, 14, 566                    # стеллаж: верх, лево, право
# стеллаж: задник ячеек, полка, стойки
paint(rect((HX0, HT, HX1, DT0)), vgrad(HT, DT0, c(60, 44, 36), c(96, 72, 54)))
box3((HX0 - 6, HT - 4, HX1 + 6, HT + 14), 14, 10, OAK)
for x in (HX0 - 6, 196, 376, HX1 - 8): paint(rect((x, HT + 14, x + 14, DT0)), hgrad(x, x + 14, OAK * 1.05, OAKD))
# столешница с перспективой
desk_top = poly([(0, DT0), (CX0, DT0), (1010, rw(1010, .718)), (1086, DT1), (0, DT1)])
paint(desk_top, vgrad(DT0, DT1, OAK * .95, OAK * 1.1) + noise(.014))
for _ in range(60):
    y = rnd.uniform(DT0 + 4, DT1 - 4); x = rnd.uniform(0, 980)
    paint(line([(x, y), (x + rnd.uniform(40, 140), y)], 1, .6) * desk_top, OAK * .92)
paint(rect((0, DT1, 1086, DT1 + 8)), OAK * 1.12)
paint(rect((0, DT1 + 8, 1086, DF1 + 10)), vgrad(DT1, DF1, c(70, 52, 42), c(44, 34, 30)))       # под столом тень
box3((0, DT1 + 8, 214, DF1 + 18), 0, 0, OAKD, sh=False)
for y in (DT1 + 16, DT1 + 52): box3((10, y, 204, y + 30), 0, 0, OAKD * 1.08, sh=False); paint(rect((90, y + 12, 124, y + 16)), c(236, 222, 196))
box3((1040, DT1 + 8, 1086, DF1 + 40), 0, 0, OAKD, sh=False)
# коврик на столе (тёмно-синий, звёздочки)
mat = poly([(620, DT0 + 8), (900, DT0 + 8), (930, DT1 - 8), (600, DT1 - 8)])
paint(mat, c(38, 46, 96) + noise(.02))
for x, y in ((650, 494), (760, 520), (860, 486), (700, 530)): paint(poly([(x, y - 8), (x + 3, y - 2), (x + 9, y), (x + 3, y + 2), (x, y + 8), (x - 3, y + 2), (x - 9, y), (x - 3, y - 2)]), c(220, 60, 70))

# ======================= НА СТЕЛЛАЖЕ =======================
def honey(cx, cy, rx, ry, col=c(255, 122, 36)):          # бумажная тыква-соты
    m = ell((cx - rx, cy - ry, cx + rx, cy + ry)); shadow(m, 10, 6, 10, .4)
    s = sphere(cx, cy, rx, ry, col, .55, -.55, .62, .18)
    for k in range(-4, 5):                               # дольки
        xs = cx + k * rx / 4.6
        seg = M(lambda sc, d: d.line(sc([(cx + (xs - cx) * math.sin(math.pi * t / 20) ** .7 * 1.0, cy - ry + 2 * ry * t / 20) for t in range(21)]), fill=255, width=4), 1.2)
        s = s * (1 - .16 * seg[..., None])
    hexes = ((np.sin((xx - cx) / 3.2) * np.sin((yy - cy) / 3.2 + (xx - cx) / 6)) > .55).astype(float)
    s = s * (1 - .12 * hexes[..., None])
    paint(m, s); paint(rect((cx - 3, cy - ry - 12, cx + 3, cy - ry + 2)), c(80, 110, 50))
# комодик-декупаж
box3((30, 186, 180, HT - 4), 10, 8, c(190, 146, 98))
papers = [c(230, 210, 170), c(200, 124, 92), c(210, 182, 128), c(170, 192, 168), c(224, 196, 150), c(190, 110, 90)]
for i in range(3):
    for j in range(2):
        b = (36 + j * 72, 192 + i * 34, 102 + j * 72, 220 + i * 34); col = papers[(i * 2 + j) % 6]
        paint(rect(b), col + noise(.05))
        if (i + j) % 2:
            for x in range(b[0] + 3, b[2], 8): paint(line([(x, b[1] + 2), (x, b[3] - 2)], 2) * rect(b), col * .7)
            for y in range(b[1] + 3, b[3], 8): paint(line([(b[0] + 2, y), (b[2] - 2, y)], 1) * rect(b), col * .78)
        paint(ell(((b[0] + b[2]) / 2 - 4, (b[1] + b[3]) / 2 - 3, (b[0] + b[2]) / 2 + 4, (b[1] + b[3]) / 2 + 3)), c(110, 76, 50))
honey(102, 134, 62, 50)
# баночка с кистями
for i in range(6):
    paint(line([(204 + i * 4, HT - 42), (196 + i * 8, HT - 96 + (i % 3) * 8)], 3), [c(150, 90, 50), c(40, 36, 40), c(210, 60, 60), c(60, 80, 170), c(230, 196, 70), c(40, 36, 40)][i])
paint(rect((196, HT - 48, 230, HT - 4)), hgrad(196, 230, c(90, 140, 112), c(50, 90, 70)))
# фигурки-чиби
def chibi(x, hair, shirt):
    y = HT - 4
    shadow(rect((x - 10, y - 50, x + 14, y)), 6, 2, 5, .35)
    paint(ell((x - 12, y - 6, x + 16, y + 2)), c(220, 210, 196))
    paint(rect((x - 6, y - 22, x + 10, y - 4)), hgrad(x - 6, x + 10, shirt * 1.1, shirt * .8))
    paint(ell((x - 13, y - 52, x + 17, y - 20)), sphere(x + 2, y - 36, 15, 16, c(244, 208, 178)))
    paint(ell((x - 15, y - 56, x + 19, y - 36)), sphere(x + 2, y - 46, 17, 10, hair))
    paint(rect((x - 15, y - 46, x - 9, y - 26)), hair * .9)
    paint(ell((x - 4, y - 36, x, y - 31)), c(30, 26, 30)); paint(ell((x + 5, y - 36, x + 9, y - 31)), c(30, 26, 30))
chibi(252, c(70, 46, 34), c(244, 244, 240)); chibi(286, c(40, 30, 28), c(200, 60, 60)); chibi(320, c(246, 210, 96), c(90, 130, 196))
honey(366, HT - 26, 24, 22)
paint(ell((246, HT - 46, 268, HT - 4)), 0) if False else None
# зелёный органайзер с книгами и маленькой тыквой
for i, col in enumerate((c(64, 64, 76), c(226, 214, 190), c(104, 80, 146), c(240, 232, 214), c(170, 66, 56), c(80, 106, 80), c(220, 190, 120))):
    b = (408 + i * 18, 210 + (i % 3) * 8, 424 + i * 18, HT - 30); shadow(rect(b), 4, 2, 3, .3); paint(rect(b), hgrad(b[0], b[2], col * 1.1, col * .82))
honey(528, 244, 26, 22)
box3((398, HT - 44, 556, HT - 4), 0, 0, c(110, 196, 80))
# в ячейках: жестянки, книги, пакеты, наушники, стакан с ручками, шарф
for i, col in enumerate((c(50, 54, 62), c(80, 84, 94), c(150, 46, 46))): box3((30, DT0 - 16 - i * 16, 140, DT0 - 2 - i * 16), 0, 0, col)
for i, col in enumerate((c(236, 232, 220), c(190, 156, 112), c(70, 82, 130), c(220, 214, 200))): box3((144, DT0 - 12 - i * 12, 190, DT0 - 2 - i * 12), 0, 0, col, sh=False)
paint(poly([(214, 384), (276, 380), (280, DT0), (210, DT0)]), hgrad(210, 280, c(56, 70, 58), c(36, 48, 40)) + noise(.02))
paint(line([(230, 382), (244, 360), (258, 380)], 2), c(210, 190, 120))
paint(poly([(282, 392), (336, 388), (340, DT0), (278, DT0)]), hgrad(278, 340, c(236, 110, 166), c(190, 70, 126)))
paint(line([(296, 390), (308, 372), (320, 388)], 2), c(246, 206, 226))
paint(ell((390, 402, 440, 440)), sphere(415, 421, 25, 19, c(236, 190, 214))); paint(ell((400, 412, 430, 446)), c(80, 60, 50))
paint(rect((390, 424, 402, DT0 - 4)), c(226, 170, 204)); paint(rect((428, 424, 440, DT0 - 4)), c(226, 170, 204))
paint(rect((456, 412, 486, DT0)), hgrad(456, 486, c(250, 220, 70), c(206, 170, 40)))
for i in range(5): paint(line([(460 + i * 6, 412), (456 + i * 8, 386 + (i % 2) * 8)], 3), [c(70, 96, 210), c(226, 64, 64), c(46, 42, 48), c(96, 180, 96), c(240, 160, 60)][i])
scarf = poly([(500, HT + 12), (532, HT + 12), (538, 420), (546, 500), (514, 506), (506, 420)])
for k in range(12):
    y = HT + 12 + k * 17
    paint(scarf * rect((480, y, 560, y + 9)), hgrad(500, 546, c(246, 196, 50), c(206, 160, 30)))
    paint(scarf * rect((480, y + 9, 560, y + 17)), hgrad(500, 546, c(150, 40, 48), c(110, 26, 36)))

# ======================= ЛАМПА =======================
LG = c(150, 174, 190)
box3((786, DT0 - 10, 812, DT0 + 6), 0, 0, c(80, 86, 96))
paint(line([(800, DT0 - 10), (836, 300)], 6, .6), LG); paint(line([(836, 300), (740, 268)], 6, .6), LG)
paint(line([(806, DT0 - 40), (830, 330)], 2, .6), LG * .7)
for x, y in ((836, 300), (740, 268)): paint(ell((x - 7, y - 7, x + 7, y + 7)), sphere(x, y, 7, 7, LG))
shade = poly([(694, 280), (742, 254), (770, 306), (716, 334)])
paint(shade, hgrad(694, 770, LG * 1.15, LG * .78) + noise(.01))
paint(poly([(716, 334), (770, 306), (762, 318), (722, 340)]), c(255, 250, 226))
LAMP = (738, 330)

# ======================= НА СТОЛЕ =======================
# ноутбук со стикерами (крышка видна сзади Алины)
paint(poly([(660, 534), (850, 534), (868, 548), (646, 548)]), c(44, 46, 56))
lap = poly([(668, 400), (846, 404), (852, 534), (662, 534)]); shadow(lap, 10, 4, 10, .35)
paint(lap, hgrad(662, 852, c(56, 60, 74), c(40, 42, 52)) + noise(.01))
for x, y, col in ((700, 430, c(246, 206, 60)), (760, 446, c(232, 70, 90)), (810, 424, c(100, 190, 230)), (720, 490, c(130, 206, 110)), (800, 494, c(246, 150, 60)), (752, 512, c(240, 240, 240)), (690, 470, c(200, 120, 220))):
    paint(ell((x - 13, y - 13, x + 13, y + 13)), sphere(x, y, 13, 13, col, .5, -.5, .7, .1))
# акварель, непроливайка, кружка с кистями
box3((440, 500, 560, 532), 6, 6, c(200, 204, 212))
pal = [c(246, 206, 40), c(244, 150, 34), c(226, 60, 46), c(204, 44, 98), c(126, 58, 132), c(54, 76, 170), c(40, 150, 180), c(44, 130, 84), c(120, 172, 64), c(156, 96, 54), c(96, 64, 44), c(44, 44, 50)]
for r_ in range(2):
    for k in range(6): paint(rect((446 + k * 19, 504 + r_ * 13, 461 + k * 19, 514 + r_ * 13)), pal[r_ * 6 + k] + noise(.03))
paint(rect((100, 476, 150, 530)), hgrad(100, 150, c(250, 206, 50), c(206, 160, 30))); paint(ell((100, 466, 150, 486)), c(250, 220, 80))
paint(ell((106, 470, 122, 482)), c(180, 130, 30)); paint(ell((128, 470, 144, 482)), c(180, 130, 30)); paint(rect((104, 490, 146, 524)), c(214, 228, 230))
paint(rect((30, 472, 70, 530)), hgrad(30, 70, c(60, 104, 90), c(36, 70, 60)))
for i in range(6): paint(line([(36 + i * 6, 472), (26 + i * 9, 420 + (i % 3) * 10)], 3), [c(40, 36, 40), c(150, 90, 50), c(70, 80, 170), c(220, 220, 226), c(40, 36, 40), c(200, 70, 60)][i])
# рыжий кот спит на столе в солнце
GIN = c(236, 140, 60)
cat = ell((900, 474, 1020, 540)); shadow(cat, 6, 6, 10, .4)
paint(poly([(906, 524), (960, 540), (1000, 538), (1004, 548), (930, 550), (900, 540)]), GIN * .9)       # хвост вокруг
paint(cat, sphere(960, 507, 60, 33, GIN, .6, -.5, .6, .12))
for k in range(5): paint(line([(918 + k * 20, 478), (926 + k * 20, 502)], 5, 1.5) * cat, GIN * .72)
head = ell((990, 470, 1050, 526)); shadow(head, 4, 6, 8, .3)
paint(poly([(994, 488), (998, 452), (1018, 474)]), GIN * .95); paint(poly([(1024, 472), (1044, 450), (1048, 486)]), GIN * .9)
paint(poly([(999, 482), (1001, 462), (1012, 474)]), c(246, 170, 160)); paint(poly([(1029, 472), (1041, 458), (1043, 480)]), c(246, 170, 160))
paint(head, sphere(1020, 498, 30, 28, GIN, .6, -.5, .6, .12))
paint(ell((1004, 500, 1040, 528)), c(252, 244, 232))
paint(line([(1004, 494), (1015, 498)], 3), c(70, 40, 24)); paint(line([(1026, 498), (1037, 494)], 3), c(70, 40, 24))
paint(ell((1018, 504, 1024, 509)), c(230, 120, 120))
for k in range(3): paint(line([(1011, 486 - k * 6), (1015, 478 - k * 6)], 2) * head, GIN * .75); paint(line([(1029, 486 - k * 6), (1025, 478 - k * 6)], 2) * head, GIN * .75)
paint(ell((946, 528, 966, 542)), c(252, 244, 232))

# ======================= ПОЛЛИ НА ПОДОКОННИКЕ =======================
PX, PY = 1088, rw(1088, WT1 + .005) + 8             # лапки
PB = c(96, 104, 196)
body = ell((PX - 46, PY - 82, PX + 34, PY - 10)); shadow(body, -8, 6, 8, .35)
paint(body, sphere(PX - 6, PY - 46, 40, 36, PB, .7, -.4, .45, .2))
paint(poly([(PX + 22, PY - 44), (PX + 56, PY - 22), (PX + 50, PY - 14), (PX + 18, PY - 22)]), PB * .7)          # хвост
paint(ell((PX - 30, PY - 70, PX + 20, PY - 20)), sphere(PX, PY - 46, 26, 26, PB * .8, .7, -.4, .5, .1))        # крыло
paint(ell((PX - 48, PY - 120, PX + 2, PY - 72)), sphere(PX - 23, PY - 96, 25, 24, PB, .7, -.4, .45, .2))       # голова
paint(ell((PX - 46, PY - 82, PX - 14, PY - 64)), c(100, 170, 150))                                               # переливы шеи
paint(ell((PX - 44, PY - 112, PX - 18, PY - 86)), c(250, 250, 250))
paint(ell((PX - 42, PY - 106, PX - 26, PY - 90)), c(246, 204, 56)); paint(ell((PX - 39, PY - 103, PX - 30, PY - 93)), c(26, 21, 40)); paint(ell((PX - 37, PY - 102, PX - 34, PY - 99)), c(255, 255, 255))
paint(rect((PX - 44, PY - 112, PX - 18, PY - 104)), PB * .8)
paint(poly([(PX - 46, PY - 98), (PX - 66, PY - 92), (PX - 46, PY - 88)]), c(244, 170, 50))
paint(poly([(PX - 40, PY - 76), (PX - 4, PY - 76), (PX - 8, PY - 66), (PX - 40, PY - 66)]), c(236, 110, 40))             # шарфик
for dx in (-16, -2): paint(line([(PX + dx, PY - 12), (PX + dx, PY)], 3), c(244, 170, 50)); paint(line([(PX + dx - 6, PY), (PX + dx + 4, PY)], 3), c(244, 170, 50))

# ======================= АЛИНА СО СПИНЫ =======================
AX = 590
rug = ell((AX - 330, 690, AX + 330, 890), 1.5)                 # круглый ковёр, вязаный
shadow(rug, 0, 6, 8, .3)
rr_ = np.hypot((xx - AX) / 330, (yy - 790) / 100)
paint(rug, np.where(((rr_ * 9).astype(int) % 2 == 0)[..., None], c(214, 168, 118), c(196, 146, 100)) + noise(.02))
paint(rug * np.clip((rr_ - .88) * 20, 0, 1), c(176, 96, 64))
chair = (54 / 255, 52 / 255, 62 / 255)
cb = ell((AX - 120, 520, AX + 120, 600)); paint(cb, c(46, 44, 54))
paint(rect((AX - 120, 560, AX + 120, 700)), hgrad(AX - 120, AX + 120, c(40, 38, 48), c(66, 64, 78)))
paint(ell((AX - 120, 670, AX + 120, 730)), c(40, 38, 48))
paint(rect((AX - 10, 720, AX + 10, 800)), c(36, 36, 44))
for dx, dy in ((-130, 20), (130, 20), (-70, 40), (70, 40)):
    paint(line([(AX, 800), (AX + dx, 800 + dy)], 8, 1), c(36, 36, 44)); paint(ell((AX + dx - 10, 800 + dy, AX + dx + 10, 820 + dy)), c(26, 26, 32))
# худи: плечи, рукава к столу
HD, HL = c(96, 56, 140), c(160, 112, 206)
hood = M(lambda s, d: (d.rounded_rectangle(s([(AX - 160, 448), (AX + 160, 700)]), radius=150, fill=255)), 1.2) * (yy < 650)
paint(hood, hgrad(AX - 150, AX + 150, HD, HL, 1.3) + noise(.012))
paint(poly([(AX - 140, 520), (AX - 172, 520), (AX - 188, DT1 - 6), (AX - 120, DT1 + 4)]), hgrad(AX - 190, AX - 120, HD * .8, HD))
paint(poly([(AX + 140, 520), (AX + 172, 520), (AX + 188, DT1 - 6), (AX + 120, DT1 + 4)]), hgrad(AX + 120, AX + 190, HL * .9, HL * .78))
for x0, x1 in ((AX - 100, AX - 112), (AX - 30, AX - 36), (AX + 40, AX + 48), (AX + 100, AX + 116)):
    f = line([(x0, 520), (x1, 650)], 10, 7); C[:] = C * (1 - .18 * (f * hood)[..., None])
rim = line([(AX + 96, 462), (AX + 146, 500), (AX + 160, 640)], 8, 5); C[:] = C + (rim * hood)[..., None] * c(80, 60, 40)
kap = ell((AX - 96, 430, AX + 100, 512)); paint(kap, hgrad(AX - 100, AX + 104, HD * 1.05, HL * 1.05))
paint(ell((AX - 60, 446, AX + 64, 500)), hgrad(AX - 60, AX + 64, HD * .7, HD * .9))
# рыжие кудри
HC = (AX - 2, 382); HRX, HRY = 82, 78
hal = ell((HC[0] - HRX, HC[1] - HRY, HC[0] + HRX, HC[1] + HRY + 6), 1.5)
hair = np.zeros((H, W, 3)) + c(190, 70, 24)
blobs = []
for _ in range(420):
    a_ = rnd.random() * 2 * math.pi; r_ = math.sqrt(rnd.random())
    blobs.append((HC[0] + math.cos(a_) * r_ * (HRX - 6), HC[1] + math.sin(a_) * r_ * (HRY - 6), rnd.uniform(8, 16)))
blobs.sort(key=lambda b: (b[0] - HC[0]) * .6 - (b[1] - HC[1]))
for x, y, r in blobs:
    nx, ny = (x - HC[0]) / HRX, (y - HC[1]) / HRY
    lit = float(np.clip(.5 + .55 * (nx * .75 - ny * .55), 0, 1))
    col = c(176, 58, 18) * (1 - lit) + c(246, 112, 36) * lit if lit < .6 else c(246, 112, 36) * (1 - (lit - .6) / .4) + c(255, 184, 104) * ((lit - .6) / .4)
    x0, x1, y0, y1 = int(x - r - 2), int(x + r + 3), int(y - r - 2), int(y + r + 3)
    dd = np.hypot(xx[y0:y1, x0:x1] - x, yy[y0:y1, x0:x1] - y) / r
    m = np.clip((1 - dd) * 3, 0, 1)
    sh = 1 - .5 * dd ** 2 + .3 * np.clip(1 - np.hypot(xx[y0:y1, x0:x1] - (x + r * .35), yy[y0:y1, x0:x1] - (y - r * .4)) / (r * .5), 0, 1)
    hair[y0:y1, x0:x1] = hair[y0:y1, x0:x1] * (1 - m[..., None]) + (col[None, None] * sh[..., None]) * m[..., None]
for _ in range(90):                                  # пружинки по краю
    a_ = rnd.uniform(-math.pi, math.pi * .2); rr_ = rnd.uniform(.94, 1.1)
    x, y = HC[0] + math.cos(a_) * rr_ * HRX, HC[1] + math.sin(a_) * rr_ * HRY
    r = rnd.uniform(6, 10); lit = float(np.clip(.5 + .55 * ((x - HC[0]) / HRX * .75 - (y - HC[1]) / HRY * .55), 0, 1))
    cm = M(lambda s, d: d.arc(s([(x - r, y - r), (x + r, y + r)]), rnd.randint(0, 180), rnd.randint(200, 360), fill=255, width=6), .6)
    hair = hair * (1 - cm[..., None]) + (c(150, 50, 16) * (1 - lit) + c(255, 160, 80) * lit)[None, None] * cm[..., None]; hal = np.maximum(hal, cm)
rimh = np.clip(((xx - HC[0]) / HRX * .9 - (yy - HC[1]) / HRY * .4) - .5, 0, 1) * hal
hair = hair + rimh[..., None] * c(120, 90, 60)
shadow(hal, 0, 18, 14, .4)
paint(hal, np.clip(hair, 0, 1))

# ======================= СВЕТ =======================
light = np.zeros((H, W, 3)) + c(150, 132, 128)                       # тёплый вечерний полумрак
def pt(x, y, r, col, k=1., p=1.6, sy=1.):
    global light; f = np.clip(1 - np.hypot(xx - x, (yy - y) * sy) / r, 0, 1) ** p * k; light = light + f[..., None] * col
pt(1040, 300, 700, c(255, 186, 120), .75, 1.4)                         # окно
ang_ = np.arctan2(yy - LAMP[1], xx - LAMP[0])                          # лампа — конус вниз-влево
cone = np.clip(1 - np.abs(ang_ - math.radians(112)) / math.radians(38), 0, 1) ** 1.2 * np.clip(1 - np.hypot(xx - LAMP[0], yy - LAMP[1]) / 420, 0, 1) * (yy > LAMP[1] - 10)
light = light + cone[..., None] * c(255, 230, 180) * .9
pt(LAMP[0], LAMP[1], 80, c(255, 230, 180), .5)
for i, (x, y) in enumerate(BULBS): pt(x, y, 44, c(255, 170, 80), .35, 2)
light = light * (1 - .3 * np.clip((yy - 640) / 260, 0, 1))[..., None] * (1 - .25 * np.clip((140 - xx) / 140, 0, 1))[..., None]
img = C * light * 1.08
# свечение: штора, абажур, лампочки
glow = np.zeros((H, W, 3))
glow += (blind[..., None] * c(255, 220, 160) * .35); glow += poly([(716, 334), (770, 306), (762, 318), (722, 340)])[..., None] * c(255, 250, 230)
for i, (x, y) in enumerate(BULBS):
    b = ell((x - 4, y - 4, x + 4, y + 5), .4); img = img * (1 - b[..., None]) + b[..., None] * (c(255, 236, 170) if i % 3 else c(255, 180, 110)); glow += b[..., None] * c(255, 190, 110)
gl = Image.fromarray((np.clip(glow, 0, 1) * 255).astype(np.uint8))
img = img + np.asarray(gl.filter(ImageFilter.GaussianBlur(10))).astype(float) / 255 * .8 + np.asarray(gl.filter(ImageFilter.GaussianBlur(30))).astype(float) / 255 * .5
img = np.clip(img, 0, 1)

# ======================= ПИКСЕЛИЗАЦИЯ =======================
full = Image.fromarray((img * 255).astype(np.uint8))
full.save(os.path.join(os.path.dirname(__file__), 'lab_full.png')) if os.environ.get('LAB_FULL') else None
TW, TH = 400, 300
small = full.filter(ImageFilter.MedianFilter(5)).resize((TW, TH), Image.LANCZOS)
q = small.quantize(colors=56, method=Image.Quantize.MAXCOVERAGE, kmeans=4, dither=Image.Dither.NONE).convert('RGB')
q.save(os.path.join(OUT, 'lab.png'))
q.resize((TW * 3, TH * 3), Image.NEAREST).save(os.path.join(OUT, 'lab@3x.png'))
print('ok', q.size)
