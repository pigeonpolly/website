# Вырезные ёлочные украшения с пиксельной Полли (20.11.2026, docs/coloring.md «Ёлочные украшения»).
# 3 файла, 3 дизайна, всё на английском: ball (плоские шары, колпак Санты), garland (флажки JOY/NOEL, шапка с помпоном),
# star3d (объёмный шар из двух кругов, оленьи рожки).
# python3 tools/ornaments/make.py → out/<id>.html; node tools/ornaments/render.js → out/<id>.pdf, out/<id>-p1.png; python3 tools/ornaments/cover.py → site/images/coloring/.
import math, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..'))
src = open(os.path.join(HERE, '..', 'polly_sprite.py'), encoding='utf-8').read().split('ref=full()')[0]
NS = {}
exec(compile(src, 'polly_sprite', 'exec'), NS)
full, DY = NS['full'], NS['DY']

CREAM, INK, GOLD, GOLDD = '#f4f1ea', '#231f1c', '#e3b04b', '#b8862e'
NAVY, NAVY2, RED, RED2, GRN, GRN2 = '#2e2860', '#544a8e', '#a3242e', '#c8335f', '#2f5d46', '#3f8f5a'

# ---- новые головные уборы (сетка спрайта 30×35, голова сверху на y≈6)
def beanie(g):  # вязаная шапка с помпоном
    g.ell(15.5, 6.2, 6.2, 4.6, '#3f8f5a')
    for x in range(10, 22, 2): g.rect(x, 3, x, 6, '#2f7048')
    g.rect(9, 6, 22, 7, CREAM); [g.p(x, 6, '#e0d8c8') for x in range(10, 22, 2)]
    g.ell(15.5, 1.4, 1.9, 1.7, '#e5484d'); g.p(15, 0, '#f28a8f')
def antlers(g):  # оленьи рожки и красный нос
    BR, LB = '#8a5a3a', '#b07a50'
    for x, y in [(12, 6), (12, 5), (11, 4), (11, 3), (11, 2), (10, 1), (9, 3), (8, 2), (13, 3), (13, 2)]: g.p(x, y, BR)
    for x, y in [(18, 6), (18, 5), (19, 4), (19, 3), (19, 2), (20, 1), (21, 3), (22, 2), (17, 3), (17, 2)]: g.p(x, y, LB)
    g.ell(26.4, 13.4, 1.6, 1.5, '#e5484d'); g.p(26, 12, '#ff9a9a')
def scarf_g(g):  # зелёный шарф
    for x in range(9, 23):
        c = '#3f8f5a' if (x // 2) % 2 else CREAM; g.p(x, 11 + DY, c); g.p(x, 12 + DY, c)
    g.rect(18, 13 + DY, 19, 17 + DY, '#3f8f5a'); g.rect(18, 15 + DY, 19, 15 + DY, CREAM)
def bell(g):  # бубенчик на шее
    g.rect(9, 11 + DY, 22, 11 + DY, '#c8335f'); g.ell(15.5, 13.6 + DY, 1.6, 1.5, '#f6c445'); g.p(15, 14 + DY, '#8a6a1a')
SANTA = [NS['santa'], NS['scarf']]; BEANIE = [beanie, scarf_g]; ANTLERS = [antlers, bell]

def polly(fs, px, cx, cy, flip=False):  # Полли по центру (cx, cy); flip — смотрит влево
    g = full(NS['legs_a'], *fs)
    x0, y0 = cx - 15 * px, cy - 18 * px
    out = []
    for y, row in enumerate(g.a):
        x = 0
        while x < g.w:
            c = row[x]
            if not c: x += 1; continue
            x1 = x
            while x1 + 1 < g.w and row[x1 + 1] == c: x1 += 1
            xs = (g.w - 1 - x1) if flip else x
            out.append(f'<rect x="{x0 + xs * px:.3f}" y="{y0 + y * px:.3f}" width="{(x1 - x + 1) * px + .06:.3f}" height="{px + .08:.3f}" fill="{c}"/>')
            x = x1 + 1
    return '<g shape-rendering="crispEdges">' + ''.join(out) + '</g>'

def pix(cx, cy, s, c, pts):
    return ''.join(f'<rect x="{cx + (dx - .5) * s:.2f}" y="{cy + (dy - .5) * s:.2f}" width="{s:.2f}" height="{s:.2f}" fill="{c}"/>' for dx, dy in pts)
def snowflake(cx, cy, s, c): return pix(cx, cy, s, c, [(0, -2), (0, 2), (-2, 0), (2, 0), (0, 0), (-1, -1), (1, -1), (-1, 1), (1, 1)])
def star(cx, cy, s, c): return pix(cx, cy, s, c, [(0, -1), (0, 0), (0, 1), (-1, 0), (1, 0)])
def gloss(cx, cy, R, op=.35):
    return f'<path d="M{cx - R * .74} {cy - R * .37} A{R * .84} {R * .84} 0 0 1 {cx - R * .32} {cy - R * .79}" fill="none" stroke="#fff" stroke-opacity="{op}" stroke-width="{R * .07:.2f}" stroke-linecap="round"/>'

def cut(d): return f'<path d="{d}" fill="none" stroke="{INK}" stroke-width=".35"/>'
def fold(x1, y1, x2, y2): return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{INK}" stroke-width=".35" stroke-dasharray="1.6 1"/>'
def hole(cx, cy): return f'<circle cx="{cx}" cy="{cy}" r="1.6" fill="#fff" stroke="{INK}" stroke-width=".3"/>'

# ================= 1. BALL: плоские шары, лицо + оборот, сгиб по «шапочке» =================
R1, CW, CH, FOLD = 38, 17, 7, 105
BALL_COLS = [(NAVY, NAVY2, '#e5484d'), (RED, RED2, GRN2), (GRN, GRN2, '#f6c445')]
BACKS = [('Merry Christmas!', 'love, Polly'), ('Happy New Year!', 'love, Polly'), ('Make a wish!', 'love, Polly')]

def ball_front(i, cx, cy):
    col, col2, acc = BALL_COLS[i]
    g = [f'<rect x="{cx - R1}" y="{cy - R1}" width="{2 * R1}" height="{2 * R1}" fill="{col}"/>',
         f'<rect x="{cx - R1}" y="{cy - R1}" width="{2 * R1}" height="{R1 * .42}" fill="{col2}"/>']
    for k in range(-3, 4): g.append(snowflake(cx + k * 9.5, cy - R1 * .79, .95, CREAM))
    zz = ' '.join(f'{cx - R1 + k * 4:.2f},{cy + R1 * .62 + (0 if k % 2 else 3)}' for k in range(21))
    g.append(f'<rect x="{cx - R1}" y="{cy + R1 * .62}" width="{2 * R1}" height="{R1}" fill="{col2}"/>')
    g.append(f'<polyline points="{zz}" fill="none" stroke="{GOLD}" stroke-width="1.1" stroke-linejoin="round"/>')
    for k in range(-4, 5): g.append(f'<circle cx="{cx + k * 7.5}" cy="{cy + R1 * .86}" r="1.15" fill="{CREAM if k % 2 else acc}"/>')
    for dx, dy in [(-31, -6), (30, -10), (-27, 14), (29, 12), (-17, -20), (20, -21)]: g.append(star(cx + dx, cy + dy, .9, GOLD))
    g.append(f'<circle cx="{cx}" cy="{cy + 1}" r="22.5" fill="{CREAM}" stroke="{GOLD}" stroke-width="1.4"/>')
    g.append(f'<circle cx="{cx}" cy="{cy + 1}" r="20.6" fill="none" stroke="{col}" stroke-width=".35" stroke-dasharray=".1 1.3" stroke-linecap="round"/>')
    g.append(polly(SANTA, 1.18, cx + .8, cy + .6, flip=(i == 1)))
    g.append(f'<rect x="{cx - 13}" y="{cy + 18.4}" width="26" height=".5" fill="#d9d0bf"/>')
    g.append(gloss(cx, cy, R1))
    return f'<clipPath id="bf{i}"><circle cx="{cx}" cy="{cy}" r="{R1}"/></clipPath><g clip-path="url(#bf{i})">{"".join(g)}</g>'

def ball_back(i, cx, cy):  # печатается вверх ногами — после сгиба читается правильно
    col, col2, _ = BALL_COLS[i]; t1, t2 = BACKS[i]
    g = [f'<rect x="{cx - R1}" y="{cy - R1}" width="{2 * R1}" height="{2 * R1}" fill="{col}"/>']
    k = 0
    for yy in range(-36, 40, 9):
        for xx in range(-36, 40, 9):
            off = 4.5 if (yy // 9) % 2 else 0
            g.append((snowflake if k % 2 else star)(cx + xx + off, cy + yy, .7, col2)); k += 1
    g.append(f'<rect x="{cx - 29}" y="{cy - 14}" width="58" height="28" rx="6" fill="{CREAM}" stroke="{GOLD}" stroke-width="1.2"/>')
    g.append(f'<text x="{cx}" y="{cy}" text-anchor="middle" class="hand" style="font-size:8.6px" fill="{col}">{t1}</text>')
    g.append(f'<text x="{cx}" y="{cy + 7.5}" text-anchor="middle" class="ph" style="font-size:4.4px" fill="{INK}">{t2} ♥</text>')
    g.append(f'<text x="{cx}" y="{cy + 25}" text-anchor="middle" class="url" fill="{CREAM}">pigeonpolly.com</text>')
    g.append(gloss(cx, cy, R1, .3))
    return f'<g transform="rotate(180 {cx} {cy})"><clipPath id="bb{i}"><circle cx="{cx}" cy="{cy}" r="{R1}"/></clipPath><g clip-path="url(#bb{i})">{"".join(g)}</g></g>'

def ball_piece(i, cx):
    cyF, cyB = FOLD + CH + R1 - .6, FOLD - CH - R1 + .6
    s = f'<rect x="{cx - CW / 2}" y="{FOLD - CH - 1.2}" width="{CW}" height="{2 * CH + 2.4}" fill="{GOLD}"/>'
    for k in range(1, 5): s += f'<rect x="{cx - CW / 2 + k * CW / 5 - .3}" y="{FOLD - CH - 1.2}" width=".6" height="{2 * CH + 2.4}" fill="{GOLDD}" opacity=".55"/>'
    s += ball_front(i, cx, cyF) + ball_back(i, cx, cyB)
    a = math.degrees(math.asin((CW / 2) / R1))
    def pt(cy, ang): return cx + R1 * math.sin(math.radians(ang)), cy - R1 * math.cos(math.radians(ang))
    x1, y1 = pt(cyF, -a); x2, y2 = pt(cyF, a); x3, y3 = pt(cyB, 180 - a); x4, y4 = pt(cyB, 180 + a)
    s += cut(f'M{x2:.2f} {y2:.2f} A{R1} {R1} 0 1 1 {x1:.2f} {y1:.2f} L{x4:.2f} {y4:.2f} A{R1} {R1} 0 1 1 {x3:.2f} {y3:.2f} Z')
    return s + fold(cx - CW / 2 - 4, FOLD, cx + CW / 2 + 4, FOLD) + hole(cx, FOLD + 3.3)

def sheet_ball():
    return ''.join(ball_piece(i, 49.5 + i * 99) for i in range(3))

# ================= 2. GARLAND: флажки, клапан сверху загибается через нитку =================
FW, FH, TAB = 52, 70, 11
def flag(cx, top, kind, n):
    x0, x1, yb = cx - FW / 2, cx + FW / 2, top + TAB
    pts = f'{x0},{yb} {x1},{yb} {x1},{yb + FH * .72} {cx},{yb + FH} {x0},{yb + FH * .72}'
    cid = f'fl{n}'
    s = [f'<rect x="{x0}" y="{top}" width="{FW}" height="{TAB + .3}" fill="#ece5d6"/>',
         f'<text x="{cx}" y="{top + 6.8}" text-anchor="middle" class="tab">glue ↓ fold over the string</text>',
         f'<clipPath id="{cid}"><polygon points="{pts}"/></clipPath>']
    g = []
    if kind[0] == 'p':  # Полли
        g.append(f'<rect x="{x0}" y="{yb}" width="{FW}" height="{FH}" fill="{CREAM}"/>')
        g.append(f'<rect x="{x0}" y="{yb}" width="{FW}" height="7" fill="{RED}"/>')
        for k in range(-2, 3): g.append(snowflake(cx + k * 9, yb + 3.5, .7, CREAM))
        g.append(f'<polygon points="{x0 + 3},{yb + 10} {x1 - 3},{yb + 10} {x1 - 3},{yb + FH * .72 - 1.4} {cx},{yb + FH - 5} {x0 + 3},{yb + FH * .72 - 1.4}" fill="none" stroke="{RED}" stroke-width=".5" stroke-dasharray=".1 1.4" stroke-linecap="round"/>')
        g.append(polly(BEANIE, 1.12, cx + (-.8 if kind == 'pl' else .8), yb + 31, flip=(kind == 'pl')))
        g.append(f'<rect x="{cx - 13}" y="{yb + 49.8}" width="26" height=".5" fill="#d9d0bf"/>')
        g.append(f'<text x="{cx}" y="{yb + 57}" text-anchor="middle" class="hand" style="font-size:5.2px" fill="{RED}">ho ho ho</text>')
    else:  # буква
        col, col2 = (RED, RED2) if n % 2 else (GRN, GRN2)
        g.append(f'<rect x="{x0}" y="{yb}" width="{FW}" height="{FH}" fill="{col}"/>')
        for yy in range(4, 70, 8):
            for xx in range(-24, 28, 8):
                off = 4 if (yy // 8) % 2 else 0
                g.append(star(cx + xx + off, yb + yy, .6, col2))
        g.append(f'<circle cx="{cx}" cy="{yb + 29}" r="17" fill="{CREAM}" stroke="{GOLD}" stroke-width="1.2"/>')
        g.append(f'<text x="{cx}" y="{yb + 40.5}" text-anchor="middle" class="big" fill="{col}">{kind}</text>')
        for k in (-1, 1): g.append(snowflake(cx + k * 12, yb + 54, .8, CREAM))
    s.append(f'<g clip-path="url(#{cid})">{"".join(g)}</g>')
    s.append(cut(f'M{x0} {top} L{x1} {top} L{x1} {yb + FH * .72} L{cx} {yb + FH} L{x0} {yb + FH * .72} Z'))
    s.append(fold(x0 - 2, yb, x1 + 2, yb))
    return ''.join(s)

def sheet_garland():
    s, n = [], 0
    for r, row in enumerate([['p', 'J', 'O', 'Y', 'pl'], ['p', 'N', 'O', 'E', 'L']]):
        top = 18 + r * 92
        for c, k in enumerate(row):
            s.append(flag(148.5 + (c - 2) * 56, top, k, n)); n += 1
    return ''.join(s)

# ================= 3. STAR3D: объёмный шар из двух кругов с прорезями =================
R3, HW = 38, 10   # радиус круга, ширина перемычки-сгиба
def disc_face(cx, cy, n, flipP, letters):
    g = [f'<rect x="{cx - R3}" y="{cy - R3}" width="{2 * R3}" height="{2 * R3}" fill="{GRN}"/>']
    g.append(f'<circle cx="{cx}" cy="{cy}" r="{R3 - 3}" fill="none" stroke="{GOLD}" stroke-width=".9"/>')
    for k in range(36):
        a = k * math.pi / 18; g.append(f'<circle cx="{cx + (R3 - 5.6) * math.cos(a):.2f}" cy="{cy + (R3 - 5.6) * math.sin(a):.2f}" r=".9" fill="{CREAM if k % 2 else "#e5484d"}"/>')
    # левая половина (по виду спереди): медальон с Полли; правая — снежинки и слово
    side = -1
    g.append(f'<circle cx="{cx + side * 17}" cy="{cy}" r="15.2" fill="{CREAM}" stroke="{GOLD}" stroke-width="1"/>')
    g.append(polly(ANTLERS, .82, cx + side * 17 + (-.5 if flipP else .5), cy - .4, flip=flipP))
    g.append(f'<rect x="{cx + side * 17 - 9}" y="{cy + 11.6}" width="18" height=".4" fill="#d9d0bf"/>')
    for dx, dy in [(10, -20), (24, -12), (12, 18), (26, 10), (8, 0)]: g.append(snowflake(cx + dx, cy + dy, .75, '#cfe6d6'))
    g.append(f'<text x="{cx + 19}" y="{cy + 2.4}" text-anchor="middle" class="hand" style="font-size:7px" fill="{CREAM}">{letters}</text>')
    g.append(gloss(cx, cy, R3, .28))
    return f'<clipPath id="d{n}"><circle cx="{cx}" cy="{cy}" r="{R3}"/></clipPath><g clip-path="url(#d{n})">{"".join(g)}</g>'

def disc_pair(cy, n, slot, word):
    # лицо слева, оборот справа (зеркально), между ними — перемычка-сгиб
    cxF, cxB = 148.5 - R3 - HW / 2 + .6, 148.5 + R3 + HW / 2 - .6
    hx = 148.5
    s = f'<rect x="{hx - HW / 2 - 1}" y="{cy - 7}" width="{HW + 2}" height="14" fill="{GRN}"/>'
    s += disc_face(cxF, cy, n, False, word[0])
    s += f'<g transform="translate({2 * cxB} 0) scale(-1 1)">' + disc_face(cxB, cy, n + 1, True, '') + '</g>'
    a = math.degrees(math.asin(7 / R3))
    def pt(cx, ang): return cx + R3 * math.sin(math.radians(ang)), cy - R3 * math.cos(math.radians(ang))
    p1 = pt(cxF, 90 - a); p2 = pt(cxF, 90 + a); p3 = pt(cxB, 270 + a); p4 = pt(cxB, 270 - a)
    s += cut(f'M{p1[0]:.2f} {p1[1]:.2f} L{p3[0]:.2f} {p3[1]:.2f} A{R3} {R3} 0 1 1 {p4[0]:.2f} {p4[1]:.2f} L{p2[0]:.2f} {p2[1]:.2f} A{R3} {R3} 0 1 1 {p1[0]:.2f} {p1[1]:.2f} Z')
    s += fold(hx, cy - 10, hx, cy + 10)
    # прорезь на лице: A — сверху до центра, B — снизу до центра
    y1, y2 = (cy - R3, cy) if slot == 'top' else (cy, cy + R3)
    s += f'<line x1="{cxF}" y1="{y1}" x2="{cxF}" y2="{y2}" stroke="#e5484d" stroke-width=".9"/><line x1="{cxF}" y1="{y1}" x2="{cxF}" y2="{y2}" stroke="#fff" stroke-width=".25" stroke-dasharray="1 1"/>'
    lab = 'A · cut slot from the top to the centre' if slot == 'top' else 'B · cut slot from the bottom to the centre'
    s += f'<text x="{cxF - R3 - 2}" y="{cy - R3 + 3}" text-anchor="end" class="lbl">{lab.split(" · ")[0]}</text>'
    s += f'<text x="{cxB + R3 + 3}" y="{cy}" class="lbl2">{lab.split(" · ")[1]}</text>' if False else ''
    if slot == 'bottom': s += hole(cxF, cy - R3 + 3.5)
    return s

def sheet_star3d():
    return disc_pair(60, 0, 'top', ('JOY', 'JOY')) + disc_pair(150, 2, 'bottom', ('NOEL', 'NOEL'))

# ================= страницы =================
CSS = '''
@page{size:297mm 210mm;margin:0}
*{margin:0;padding:0;box-sizing:border-box}
html,body{background:#fff}
.pg{width:297mm;height:210mm;position:relative;overflow:hidden;page-break-after:always;background:#fff}
.pg:last-child{page-break-after:auto}
.pg>svg{position:absolute;inset:0;width:297mm;height:210mm}
.hand{font-family:'Caveat';font-weight:700}
.ph{font-family:'Patrick Hand'}
.url{font:700 2.6px 'Karla';letter-spacing:.25px}
.tab{font:500 2.3px 'Karla';fill:#8a8275;letter-spacing:.1px}
.big{font:500 27px 'Fraunces'}
.lbl{font:400 9px 'Caveat Brush';fill:#a3242e}
.hd{position:absolute;left:12mm;right:12mm;top:6mm;display:flex;justify-content:space-between;align-items:baseline;font:500 3.4mm 'Karla';color:#6b6458}
.hd b{font:500 5.4mm 'Fraunces';color:#231f1c}
.hd i{font:400 4.6mm 'Caveat Brush';color:#a3242e;font-style:normal}
.ft{position:absolute;left:12mm;right:12mm;bottom:5mm;display:flex;justify-content:space-between;font:500 2.7mm 'Karla';color:#8a8275}
.ins{padding:15mm 14mm 0}
.ins h1{font:500 11mm/1 'Fraunces';color:#231f1c}
.ins h1 em{font-family:'Caveat Brush';font-style:normal;color:#a3242e;font-size:10mm}
.ins .sub{font:500 3.8mm 'Karla';color:#6b6458;margin:2.5mm 0 8mm}
.steps{display:grid;grid-template-columns:repeat(5,1fr);gap:5mm}
.st{border:.35mm solid #e2dbcd;border-radius:4mm;padding:4mm 3.5mm 5mm;background:#faf8f3}
.st svg{width:100%;height:32mm;display:block;margin-bottom:3mm}
.st .n{font:400 7mm/1 'Caveat Brush';color:#a3242e}
.st p{font:500 3.4mm/1.4 'Karla';color:#3a352e;margin-top:1.6mm}
.tips{margin-top:9mm;display:grid;grid-template-columns:1fr 1fr 1fr;gap:6mm;font:500 3.2mm/1.5 'Karla';color:#3a352e}
.tips b{font:500 3.9mm 'Fraunces';display:block;margin-bottom:1mm}
'''
FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&family=Karla:wght@500;700&family=Caveat:wght@700&family=Caveat+Brush&family=Patrick+Hand&display=swap">'
FT = '<div class="ft"><span>© Alina Otkinska · Pigeon Polly Art Lab · pigeonpolly.com</span><span>free for personal use</span></div>'

def mini(k):  # маленькие схемы шагов, viewBox 60×46
    B = lambda cx, cy, r, c: f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{c}"/>'
    sc = lambda x, y: f'<text x="{x}" y="{y}" style="font-size:9px">✂</text>'
    dash = lambda d: f'<path d="{d}" fill="none" stroke="{INK}" stroke-width=".6" stroke-dasharray="1.6 1"/>'
    arrow = lambda d, e: f'<path d="{d}" fill="none" stroke="#a3242e" stroke-width="1.1"/><path d="{e}" fill="none" stroke="#a3242e" stroke-width="1.1"/>'
    M = {
        'b_cut': B(30, 34, 9, NAVY) + f'<rect x="27" y="19" width="6" height="7" fill="{GOLD}"/>' + B(30, 11, 9, NAVY2) + dash('M30 43.6 A9.6 9.6 0 1 1 30.1 43.6 M30 20.4 A9.6 9.6 0 1 1 30.1 20.4') + sc(42, 38),
        'b_fold': B(30, 32, 10, RED) + f'<rect x="27" y="18" width="6" height="4" fill="{GOLD}"/>' + dash('M18 18 L42 18') + arrow('M30 16 C 48 16 52 25 46 35', 'M43.5 33 l2.6 2.6 l1.4 -3.4'),
        'glue': B(24, 24, 11, RED2) + B(36, 24, 11, RED) + '<path d="M18 24 q3 -4 6 0 t6 0" fill="none" stroke="#fff" stroke-width="1.3"/>' + f'<text x="44" y="10" style="font:400 7px Caveat Brush" fill="#a3242e">glue</text>',
        'b_hang': B(30, 31, 11, GRN) + f'<rect x="27" y="16" width="6" height="5" fill="{GOLD}"/><circle cx="30" cy="18.5" r="1.3" fill="#fff"/>' + '<path d="M30 18.5 C 22 8 38 8 30 18.5 M30 10 L30 2" fill="none" stroke="#a3242e" stroke-width="1"/>',
        'tree': '<path d="M30 3 L46 40 L14 40 Z" fill="#3f8f5a"/>' + B(24, 30, 3.4, NAVY) + B(36, 24, 3.4, RED) + B(31, 36, 3.4, '#f6c445'),
        'g_cut': f'<path d="M14 6 L46 6 L46 32 L30 42 L14 32 Z" fill="{CREAM}" stroke="{INK}" stroke-width=".6" stroke-dasharray="1.6 1"/><rect x="14" y="6" width="32" height="7" fill="#ece5d6"/>' + sc(47, 30),
        'g_fold': '<path d="M4 9 L56 9" stroke="#a3242e" stroke-width="1"/>' + f'<path d="M14 9 L46 9 L46 34 L30 44 L14 34 Z" fill="{RED}"/><path d="M14 9 L46 9 L46 3 L14 3 Z" fill="#ece5d6" stroke="{INK}" stroke-width=".4"/>' + arrow('M48 3 C 54 6 54 12 48 15', 'M48.5 12.5 l-.6 2.8 l2.6 .6'),
        'g_string': '<path d="M0 8 Q30 20 60 8" fill="none" stroke="#a3242e" stroke-width=".9"/>' + ''.join(f'<path d="M{3 + j * 14} {9 + 4 * math.sin(j * 1.1)} l11 0 l0 16 l-5.5 7 l-5.5 -7 Z" fill="{[CREAM, RED, GRN, RED][j]}" stroke="#d9d0bf" stroke-width=".3"/>' for j in range(4)),
        'g_tip': '<text x="30" y="30" text-anchor="middle" style="font:500 22px Fraunces" fill="#a3242e">JOY</text>',
        's_cut': B(17, 23, 11, GRN) + f'<rect x="28" y="19" width="4" height="8" fill="{GRN}"/>' + B(43, 23, 11, GRN2) + dash('M30 12 L30 34') + sc(48, 42),
        's_fold': B(24, 24, 11, GRN2) + B(36, 24, 11, GRN) + '<path d="M18 24 q3 -4 6 0 t6 0" fill="none" stroke="#fff" stroke-width="1.3"/>' + f'<text x="44" y="10" style="font:400 7px Caveat Brush" fill="#a3242e">glue</text>',
        's_slot': B(17, 24, 11, GRN) + '<path d="M17 13 L17 24" stroke="#e5484d" stroke-width="1.4"/>' + B(43, 24, 11, GRN) + '<path d="M43 24 L43 35" stroke="#e5484d" stroke-width="1.4"/>' + '<text x="17" y="43" text-anchor="middle" style="font:400 6px Caveat Brush" fill="#a3242e">A</text><text x="43" y="9" text-anchor="middle" style="font:400 6px Caveat Brush" fill="#a3242e">B</text>',
        's_join': f'<ellipse cx="30" cy="25" rx="5" ry="15" fill="{GRN2}"/>' + B(30, 25, 15, GRN) + f'<ellipse cx="30" cy="25" rx="5" ry="15" fill="{GRN2}" opacity=".9"/>' + arrow('M48 4 L48 18', 'M45.5 15.5 l2.5 3 l2.5 -3'),
        's_hang': f'<ellipse cx="30" cy="29" rx="4" ry="13" fill="{GRN2}"/>' + B(30, 29, 13, GRN) + f'<ellipse cx="30" cy="29" rx="4" ry="13" fill="{GRN2}" opacity=".9"/>' + '<path d="M30 17.5 C 23 8 37 8 30 17.5 M30 10 L30 2" fill="none" stroke="#a3242e" stroke-width="1"/>',
    }
    return f'<svg viewBox="0 0 60 46">{M[k]}</svg>'

FILES = [
    dict(id='polly-ornament-balls', title='Polly Christmas balls', tag='cut · fold · glue · hang', sheet=sheet_ball,
         sub='Three flat paper ornaments with Polly in a Santa hat. Each has a message on the back.',
         steps=[('b_cut', 'Cut out each ornament along the solid line. The front and the back stay joined at the gold cap.'),
                ('b_fold', 'Fold along the dashed line, picture side out.'),
                ('glue', 'Glue the two halves back to back. Press under a book for 10 minutes.'),
                ('b_hang', 'Punch the little circle on the cap and tie a ribbon or thread.'),
                ('tree', 'Hang them on the tree, a window or a gift box.')],
         tips=[('Paper', 'Print at 100% (“actual size”) on thick paper, 160–220 g/m².'), ('Glue', 'A glue stick works best: liquid glue makes the paper wavy.'), ('A garland', 'Thread all three on one long ribbon, a hand’s width apart.')],
         t={'en': 'Polly Christmas balls to cut out', 'ru': 'Ёлочные шары с Полли (EN)', 'lv': 'Eglītes bumbas ar Polliju (EN)'}),
    dict(id='polly-garland', title='Polly JOY & NOEL garland', tag='cut · fold · string', sheet=sheet_garland,
         sub='Ten paper flags with Polly in a pompom beanie: one string says JOY, the other NOEL.',
         steps=[('g_cut', 'Cut out each flag along the solid line, together with its grey tab.'),
                ('g_fold', 'Lay a string along the dashed line and fold the tab back over it.'),
                ('glue', 'Glue the tab to the back of the flag. Let it dry.'),
                ('g_string', 'Slide the flags so the letters read JOY and NOEL, Polly at the ends.'),
                ('g_tip', 'Hang it on a shelf, a window or above the bed.')],
         tips=[('Paper', 'Print at 100% (“actual size”) on thick paper, 160–220 g/m².'), ('String', 'Baker’s twine, yarn or a thin ribbon, about 1.5 m for both words.'), ('Longer', 'Print the sheet twice for a longer garland.')],
         t={'en': 'Polly JOY & NOEL garland', 'ru': 'Гирлянда с Полли JOY & NOEL (EN)', 'lv': 'Virtene ar Polliju JOY & NOEL (EN)'}),
    dict(id='polly-3d-ornament', title='Polly 3D ornament', tag='cut · glue · slot · hang', sheet=sheet_star3d,
         sub='Two paper circles slot together into a 3D ornament: Polly in reindeer antlers peeks out from all sides.',
         steps=[('s_cut', 'Cut out both pieces, A and B, along the solid line.'),
                ('s_fold', 'Fold each piece along the dashed line, picture out, and glue back to back.'),
                ('s_slot', 'Cut along the red line: A from the top to the centre, B from the bottom to the centre.'),
                ('s_join', 'Slide A down onto B so the slots lock. Open into a cross.'),
                ('s_hang', 'Punch the circle on top of B and tie a ribbon.')],
         tips=[('Paper', 'Print at 100% (“actual size”) on thick paper, 160–220 g/m².'), ('Slots', 'Make each slot a hair wider than the paper (cut twice, close together).'), ('Tight fit', 'A drop of glue in the centre keeps the ornament from turning.')],
         t={'en': 'Polly 3D ornament', 'ru': 'Объёмный шар с Полли (EN)', 'lv': 'Telpisks rotājums ar Polliju (EN)'}),
]

def html_for(f):
    st = ''.join(f'<div class="st">{mini(k)}<span class="n">{i + 1}</span><p>{t}</p></div>' for i, (k, t) in enumerate(f['steps']))
    tips = ''.join(f'<div><b>{a}</b>{b}</div>' for a, b in f['tips'])
    p1 = f'<div class="pg"><div class="hd"><b>{f["title"]}</b><i>{f["tag"]}</i><span>A4 · print at 100%</span></div><svg viewBox="0 0 297 210" xmlns="http://www.w3.org/2000/svg">{f["sheet"]()}</svg>{FT}</div>'
    p2 = f'<div class="pg"><div class="ins"><h1>{f["title"]} <em>· how to make it</em></h1><p class="sub">{f["sub"]}</p><div class="steps">{st}</div><div class="tips">{tips}</div></div>{FT}</div>'
    return f'<!doctype html><html><head><meta charset="utf-8">{FONTS}<style>{CSS}</style></head><body>{p1}{p2}</body></html>'

def main():
    out = os.path.join(HERE, 'out'); os.makedirs(out, exist_ok=True)
    for f in FILES: open(os.path.join(out, f['id'] + '.html'), 'w', encoding='utf-8').write(html_for(f))
    print('ok', [f['id'] for f in FILES])

if __name__ == '__main__':
    main()
