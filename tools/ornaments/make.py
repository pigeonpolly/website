# Вырезные ёлочные шары с пиксельной Полли (20.11.2026, docs/coloring.md «Ёлочные шары»).
# python3 tools/ornaments/make.py → tools/ornaments/out/ornaments.html; потом node tools/ornaments/render.js (PDF + обложка).
import math, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..'))
src = open(os.path.join(HERE, '..', 'polly_sprite.py'), encoding='utf-8').read().split('ref=full()')[0]
NS = {}
exec(compile(src, 'polly_sprite', 'exec'), NS)
base, full, rell, DY = NS['base'], NS['full'], NS['rell'], NS['DY']

# ---- новые головные уборы (сетка спрайта 30×35, голова сверху на y≈6)
def beanie(g):  # вязаная шапка с помпоном
    g.ell(15.5, 6.2, 6.2, 4.6, '#3f8f5a')
    g.rect(9, 7, 22, 7, None)
    for x in range(10, 22, 2): g.rect(x, 3, x, 6, '#2f7048')
    g.rect(9, 6, 22, 7, '#f4f1ea'); [g.p(x, 6, '#e0d8c8') for x in range(10, 22, 2)]
    g.ell(15.5, 1.4, 1.9, 1.7, '#e5484d'); g.p(15, 0, '#f28a8f')
def antlers(g):  # оленьи рожки и красный нос
    BR, LB = '#8a5a3a', '#b07a50'
    for x, y in [(12, 6), (12, 5), (11, 4), (11, 3), (11, 2), (10, 1), (9, 3), (8, 2), (13, 3), (13, 2)]: g.p(x, y, BR)
    for x, y in [(18, 6), (18, 5), (19, 4), (19, 3), (19, 2), (20, 1), (21, 3), (22, 2), (17, 3), (17, 2)]: g.p(x, y, LB)
    g.ell(26.4, 13.4, 1.6, 1.5, '#e5484d'); g.p(26, 12, '#ff9a9a')
def scarf_g(g):  # зелёный шарф
    for x in range(9, 23):
        c = '#3f8f5a' if (x // 2) % 2 else '#f4f1ea'; g.p(x, 11 + DY, c); g.p(x, 12 + DY, c)
    g.rect(18, 13 + DY, 19, 17 + DY, '#3f8f5a'); g.rect(18, 15 + DY, 19, 15 + DY, '#f4f1ea')
def bell(g):  # бубенчик на шее
    g.rect(9, 11 + DY, 22, 11 + DY, '#c8335f'); g.ell(15.5, 13.6 + DY, 1.6, 1.5, '#f6c445'); g.p(15, 14 + DY, '#8a6a1a')

def polly_svg(fs, px, x0, y0):
    g = full(NS['legs_a'], *fs)
    out = []
    for y, row in enumerate(g.a):
        x = 0
        while x < g.w:
            c = row[x]
            if not c: x += 1; continue
            x1 = x
            while x1 + 1 < g.w and row[x1 + 1] == c: x1 += 1
            out.append(f'<rect x="{x0 + x * px:.3f}" y="{y0 + y * px:.3f}" width="{(x1 - x + 1) * px + .06:.3f}" height="{px + .08:.3f}" fill="{c}"/>')
            x = x1 + 1
    return '<g shape-rendering="crispEdges">' + ''.join(out) + '</g>'

def snowflake(cx, cy, s, c):  # пиксельная снежинка 5×5
    pts = [(0, -2), (0, -1), (0, 0), (0, 1), (0, 2), (-2, 0), (-1, 0), (1, 0), (2, 0), (-1, -1), (1, -1), (-1, 1), (1, 1)]
    pts = [(0, -2), (0, 2), (-2, 0), (2, 0), (0, 0), (-1, -1), (1, -1), (-1, 1), (1, 1)]
    return ''.join(f'<rect x="{cx + (dx - .5) * s:.2f}" y="{cy + (dy - .5) * s:.2f}" width="{s:.2f}" height="{s:.2f}" fill="{c}"/>' for dx, dy in pts)
def star(cx, cy, s, c):  # пиксельная звёздочка-крестик
    return ''.join(f'<rect x="{cx + (dx - .5) * s:.2f}" y="{cy + (dy - .5) * s:.2f}" width="{s:.2f}" height="{s:.2f}" fill="{c}"/>' for dx, dy in [(0, -1), (0, 0), (0, 1), (-1, 0), (1, 0)])

CREAM, INK, GOLD, GOLDD = '#f4f1ea', '#231f1c', '#e3b04b', '#b8862e'
BALLS = [
    dict(id='santa', fs=[NS['santa'], NS['scarf']], col='#2e2860', col2='#544a8e', acc='#e5484d',
         t={'en': 'Santa hat', 'ru': 'Колпак Санты', 'lv': 'Salaveča cepure'}, greet='Merry Christmas!', g2='from Polly'),
    dict(id='beanie', fs=[beanie, scarf_g], col='#a3242e', col2='#c8335f', acc='#3f8f5a',
         t={'en': 'Pompom beanie', 'ru': 'Шапка с помпоном', 'lv': 'Cepure ar bumbuli'}, greet='Priecīgus Ziemassvētkus!', g2='no Pollija'),
    dict(id='antlers', fs=[antlers, bell], col='#2f5d46', col2='#3f8f5a', acc='#f6c445',
         t={'en': 'Reindeer antlers', 'ru': 'Оленьи рожки', 'lv': 'Ziemeļbrieža ragi'}, greet='С Новым годом!', g2='от Полли'),
]
R, CW, CH = 38, 17, 7      # радиус шара, ширина и высота «шапочки» шара, мм
FOLD = 105                 # линия сгиба (середина листа)

def ball_front(b, cx, cy, i, blank=False):
    cid = f'cf{i}{"b" if blank else ""}'
    s = [f'<clipPath id="{cid}"><circle cx="{cx}" cy="{cy}" r="{R}"/></clipPath>']
    if blank:
        s.append(f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="#fff"/>')
        s.append(f'<circle cx="{cx}" cy="{cy}" r="{R - 4}" fill="none" stroke="#c9c2b4" stroke-width=".35" stroke-dasharray="1 1.4"/>')
        s.append(f'<text x="{cx}" y="{cy + 2}" text-anchor="middle" class="hint">draw your Polly</text>')
        return ''.join(s)
    g = [f'<rect x="{cx - R}" y="{cy - R}" width="{2 * R}" height="{2 * R}" fill="{b["col"]}"/>']
    # верхняя полоса: снежинки, нижняя: зигзаг и точки
    g.append(f'<rect x="{cx - R}" y="{cy - R}" width="{2 * R}" height="{R * .42}" fill="{b["col2"]}"/>')
    for k in range(-3, 4): g.append(snowflake(cx + k * 9.5, cy - R * .79, .95, CREAM))
    zz = ' '.join(f'{cx - R + k * 4:.2f},{cy + R * .62 + (0 if k % 2 else 3)}' for k in range(0, 21))
    g.append(f'<rect x="{cx - R}" y="{cy + R * .62}" width="{2 * R}" height="{R}" fill="{b["col2"]}"/>')
    g.append(f'<polyline points="{zz}" fill="none" stroke="{GOLD}" stroke-width="1.1" stroke-linejoin="round"/>')
    for k in range(-4, 5): g.append(f'<circle cx="{cx + k * 7.5}" cy="{cy + R * .86}" r="1.15" fill="{CREAM if k % 2 else b["acc"]}"/>')
    for dx, dy in [(-31, -6), (30, -10), (-27, 14), (29, 12), (-17, -20), (20, -21)]: g.append(star(cx + dx, cy + dy, .9, GOLD))
    # медальон с Полли
    g.append(f'<circle cx="{cx}" cy="{cy + 1}" r="22.5" fill="{CREAM}" stroke="{GOLD}" stroke-width="1.4"/>')
    g.append(f'<circle cx="{cx}" cy="{cy + 1}" r="20.6" fill="none" stroke="{b["col"]}" stroke-width=".35" stroke-dasharray=".1 1.3" stroke-linecap="round"/>')
    px = 1.18
    g.append(polly_svg(b['fs'], px, cx - 15 * px + .8, cy + 1 - 17.5 * px - .6))
    g.append(f'<rect x="{cx - 13}" y="{cy + 18.4}" width="26" height=".5" fill="#d9d0bf"/>')  # «пол»
    # блик
    g.append(f'<path d="M{cx - 28} {cy - 14} A{R - 6} {R - 6} 0 0 1 {cx - 12} {cy - 30}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2.6" stroke-linecap="round"/>')
    s.append(f'<g clip-path="url(#{cid})">{"".join(g)}</g>')
    return ''.join(s)

def ball_back(b, cx, cy, i, blank=False):  # рисуется вверх ногами (после сгиба — правильно)
    cid = f'cb{i}{"b" if blank else ""}'
    s = [f'<g transform="rotate(180 {cx} {cy})"><clipPath id="{cid}"><circle cx="{cx}" cy="{cy}" r="{R}"/></clipPath>']
    if blank:
        s.append(f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="#fff"/>')
        s.append(f'<circle cx="{cx}" cy="{cy}" r="{R - 4}" fill="none" stroke="#c9c2b4" stroke-width=".35" stroke-dasharray="1 1.4"/>')
        s.append(f'<text x="{cx}" y="{cy + 2}" text-anchor="middle" class="hint">write a wish</text></g>')
        return ''.join(s)
    g = [f'<rect x="{cx - R}" y="{cy - R}" width="{2 * R}" height="{2 * R}" fill="{b["col"]}"/>']
    k = 0
    for yy in range(-36, 40, 9):
        for xx in range(-36, 40, 9):
            off = 4.5 if (yy // 9) % 2 else 0
            g.append(snowflake(cx + xx + off, cy + yy, .7, b['col2']) if k % 2 else star(cx + xx + off, cy + yy, .7, b['col2'])); k += 1
    g.append(f'<rect x="{cx - 29}" y="{cy - 14}" width="58" height="28" rx="6" fill="{CREAM}" stroke="{GOLD}" stroke-width="1.2"/>')
    fs = 8.4 if len(b['greet']) < 18 else 6.6
    g.append(f'<text x="{cx}" y="{cy - 0.5}" text-anchor="middle" class="greet" style="font-size:{fs}px" fill="{b["col"]}">{b["greet"]}</text>')
    g.append(f'<text x="{cx}" y="{cy + 7}" text-anchor="middle" class="from" fill="{INK}">{b["g2"]} ♥</text>')
    g.append(f'<text x="{cx}" y="{cy + 25}" text-anchor="middle" class="url" fill="{CREAM}">pigeonpolly.com</text>')
    g.append(f'<path d="M{cx - 28} {cy - 14} A{R - 6} {R - 6} 0 0 1 {cx - 12} {cy - 30}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="2.6" stroke-linecap="round"/>')
    s.append(f'<g clip-path="url(#{cid})">{"".join(g)}</g></g>')
    return ''.join(s)

def cap(cx, y, up, blank=False):  # металлическая шапочка шара; up — к сгибу сверху вниз
    y0 = y if up else y - CH
    f = '#fff' if blank else GOLD
    s = f'<rect x="{cx - CW / 2}" y="{y0}" width="{CW}" height="{CH + 1.2}" fill="{f}"/>' if up else f'<rect x="{cx - CW / 2}" y="{y0 - 1.2}" width="{CW}" height="{CH + 1.2}" fill="{f}"/>'
    if not blank:
        for k in range(1, 5): s += f'<rect x="{cx - CW / 2 + k * CW / 5 - .3}" y="{y0 + (0 if up else -1.2)}" width=".6" height="{CH + 1.2}" fill="{GOLDD}" opacity=".55"/>'
    return s

def piece(b, cx, i, blank=False):
    cyF = FOLD + CH + R - .6
    cyB = FOLD - CH - R + .6
    s = cap(cx, FOLD, True, blank) + cap(cx, FOLD, False, blank)
    s += ball_front(b, cx, cyF, i, blank) + ball_back(b, cx, cyB, i, blank)
    # линия реза: контур (два круга + шапочки)
    a = math.degrees(math.asin((CW / 2) / R))
    def pt(cy, ang): return cx + R * math.sin(math.radians(ang)), cy - R * math.cos(math.radians(ang))
    x1, y1 = pt(cyF, -a); x2, y2 = pt(cyF, a)
    x3, y3 = pt(cyB, 180 - a); x4, y4 = pt(cyB, 180 + a)
    d = (f'M{x2:.2f} {y2:.2f} A{R} {R} 0 1 1 {x1:.2f} {y1:.2f} L{cx - CW / 2:.2f} {FOLD - CH - .6:.2f} '
         f'L{x4:.2f} {y4:.2f} A{R} {R} 0 1 1 {x3:.2f} {y3:.2f} L{cx + CW / 2:.2f} {FOLD + CH + .6:.2f} Z')
    s += f'<path d="{d}" fill="none" stroke="{INK}" stroke-width=".35"/>'
    s += f'<line x1="{cx - CW / 2 - 4}" y1="{FOLD}" x2="{cx + CW / 2 + 4}" y2="{FOLD}" stroke="{INK}" stroke-width=".35" stroke-dasharray="1.6 1"/>'
    s += f'<circle cx="{cx}" cy="{FOLD + 3.3}" r="1.6" fill="#fff" stroke="{INK}" stroke-width=".3"/>'
    return s

def scissors(x, y):
    return f'<text x="{x}" y="{y}" class="sc">✂</text>'

CSS = '''
@page{size:297mm 210mm;margin:0}
*{margin:0;padding:0;box-sizing:border-box}
html,body{background:#fff}
.pg{width:297mm;height:210mm;position:relative;overflow:hidden;page-break-after:always;background:#fff}
.pg:last-child{page-break-after:auto}
svg{position:absolute;inset:0;width:297mm;height:210mm}
.hint{font:400 3.6px 'Patrick Hand';fill:#a49c8d}
.greet{font-family:'Caveat';font-weight:700}
.from{font:400 4.2px 'Patrick Hand'}
.url{font:700 2.6px 'Karla','Nunito Sans';letter-spacing:.25px}
.sc{font-size:4px;fill:#8a8275}
.hd{position:absolute;left:12mm;right:12mm;top:6mm;display:flex;justify-content:space-between;align-items:baseline;font:500 3.4mm 'Karla','Nunito Sans';color:#6b6458}
.hd b{font:500 5.4mm 'Fraunces','Lora';color:#231f1c}
.hd i{font:400 4.6mm 'Caveat Brush';color:#a3242e;font-style:normal}
.ft{position:absolute;left:12mm;right:12mm;bottom:5mm;display:flex;justify-content:space-between;font:500 2.7mm 'Karla','Nunito Sans';color:#8a8275}
.lab{position:absolute;bottom:11mm;width:99mm;text-align:center;font:400 4.2mm 'Caveat Brush';color:#544a8e}
/* инструкция */
.ins{padding:15mm 14mm 0}
.ins h1{font:500 11mm/1 'Fraunces','Lora';color:#231f1c}
.ins h1 em{font-family:'Caveat Brush';font-style:normal;color:#a3242e;font-size:10mm}
.ins .sub{font:500 3.6mm 'Karla','Nunito Sans';color:#6b6458;margin:2.5mm 0 7mm}
.steps{display:grid;grid-template-columns:repeat(5,1fr);gap:5mm}
.st{border:.35mm solid #e2dbcd;border-radius:4mm;padding:4mm 3.5mm;background:#faf8f3}
.st svg{position:static;width:100%;height:30mm;display:block;margin-bottom:3mm}
.st .n{font:400 7mm/1 'Caveat Brush';color:#a3242e}
.st p{font:500 2.9mm/1.35 'Karla','Nunito Sans';color:#3a352e;margin-top:1.6mm}
.st p.ru,.st p.lv{color:#6b6458}
.tips{margin-top:7mm;display:grid;grid-template-columns:1fr 1fr 1fr;gap:6mm;font:500 2.9mm/1.45 'Karla','Nunito Sans';color:#3a352e}
.tips b{font:500 3.6mm 'Fraunces','Lora';display:block;margin-bottom:1mm}
'''

def sheet(blank=False):
    s = []
    for i, b in enumerate(BALLS):
        cx = 49.5 + i * 99
        s.append(piece(b, cx, i, blank))
    for i in range(3): s.append(scissors(49.5 + i * 99 - 46, FOLD + CH + 2 * R - 6))
    return f'<svg viewBox="0 0 297 210" xmlns="http://www.w3.org/2000/svg">{"".join(s)}</svg>'

def step_svg(k, b):
    # маленькие схемы: 1 вырезать, 2 согнуть, 3 склеить, 4 дырочка и нитка, 5 гирлянда
    c, c2 = b['col'], b['col2']
    if k == 1:
        return f'''<svg viewBox="0 0 60 46"><circle cx="30" cy="34" r="9" fill="{c}"/><rect x="27" y="22" width="6" height="4" fill="{GOLD}"/><rect x="27" y="18.5" width="6" height="3.5" fill="{GOLD}"/><circle cx="30" cy="10" r="9" fill="{c2}"/>
<path d="M27 22 L27 18.5 M33 18.5 L33 25.5" stroke="{INK}" stroke-width=".6" stroke-dasharray="1.6 1"/><circle cx="30" cy="34" r="9.6" fill="none" stroke="{INK}" stroke-width=".6" stroke-dasharray="1.6 1"/><circle cx="30" cy="10" r="9.6" fill="none" stroke="{INK}" stroke-width=".6" stroke-dasharray="1.6 1"/><text x="42" y="38" style="font-size:9px">✂</text></svg>'''
    if k == 2:
        return f'''<svg viewBox="0 0 60 40"><circle cx="30" cy="28" r="10" fill="{c}"/><rect x="27" y="15" width="6" height="4" fill="{GOLD}"/><line x1="18" y1="15" x2="42" y2="15" stroke="{INK}" stroke-width=".7" stroke-dasharray="2 1.2"/>
<path d="M30 13 C 48 13 52 22 46 32" fill="none" stroke="#a3242e" stroke-width="1.1"/><path d="M43.5 30 l2.6 2.6 l1.4 -3.4" fill="none" stroke="#a3242e" stroke-width="1.1"/><circle cx="30" cy="4" r="0" /></svg>'''
    if k == 3:
        return f'''<svg viewBox="0 0 60 40"><circle cx="24" cy="22" r="11" fill="{c2}"/><circle cx="36" cy="22" r="11" fill="{c}" opacity=".95"/>
<path d="M18 22 q3 -4 6 0 t6 0" fill="none" stroke="#fff" stroke-width="1.3"/><text x="44" y="10" style="font:400 7px Caveat Brush" fill="#a3242e">glue</text></svg>'''
    if k == 4:
        return f'''<svg viewBox="0 0 60 40"><circle cx="30" cy="27" r="11" fill="{c}"/><rect x="27" y="12" width="6" height="5" fill="{GOLD}"/><circle cx="30" cy="14.5" r="1.3" fill="#fff"/>
<path d="M30 14.5 C 22 4 38 4 30 14.5" fill="none" stroke="#a3242e" stroke-width="1"/><path d="M30 6 L30 0" stroke="#a3242e" stroke-width="1"/></svg>'''
    dots = ''.join(f'<circle cx="{8 + j * 15}" cy="{22 + 4 * math.sin(j)}" r="6" fill="{BALLS[j % 3]["col"]}"/><rect x="{6 + j * 15}" y="{13.5 + 4 * math.sin(j)}" width="4" height="3" fill="{GOLD}"/>' for j in range(4))
    return f'''<svg viewBox="0 0 60 40"><path d="M0 8 Q30 22 60 8" fill="none" stroke="#a3242e" stroke-width=".9"/>{dots}</svg>'''

STEPS = [
    ('Cut out along the solid line — the front and the back stay joined at the gold caps.',
     'Вырезать по сплошной линии — лицо и оборот остаются соединены золотыми «шапочками».',
     'Izgriez pa nepārtraukto līniju — priekšpuse un aizmugure paliek savienotas pie zelta cepurītēm.'),
    ('Fold along the dashed line, picture side out.', 'Согнуть по пунктиру, картинкой наружу.', 'Pārloki pa raustīto līniju, ar zīmējumu uz āru.'),
    ('Glue the two halves back to back. Press under a book for 10 minutes.', 'Склеить половинки спинками. Подержать под книгой 10 минут.', 'Salīmē abas puses kopā. Paturi zem grāmatas 10 minūtes.'),
    ('Punch the little circle on the cap and tie a ribbon or thread.', 'Проколоть кружок на «шапочке» и продеть ленточку или нитку.', 'Izdur caurumiņu uz cepurītes un iever lentīti vai diegu.'),
    ('Hang one on the tree — or string all three into a garland.', 'Повесить на ёлку — или нанизать все три в гирлянду.', 'Pakar eglītē — vai savēr visas trīs virtenē.'),
]

def instructions():
    st = ''.join(f'<div class="st">{step_svg(k + 1, BALLS[k % 3])}<span class="n">{k + 1}</span><p>{e}</p><p class="ru">{r}</p><p class="lv">{l}</p></div>' for k, (e, r, l) in enumerate(STEPS))
    return f'''<div class="pg"><div class="ins"><h1>Polly ornaments <em>· cut, fold, hang</em></h1>
<p class="sub">Ёлочные шары с Полли · Eglītes rotājumi ar Polliju · 3 hats: {" · ".join(b["t"]["en"] for b in BALLS)}</p>
<div class="steps">{st}</div>
<div class="tips"><div><b>Paper</b>Print at 100% (“actual size”) on thick paper, 160–220 g/m². A glue stick works best — liquid glue makes paper wavy.</div>
<div><b>Бумага</b>Печатать в масштабе 100% на плотной бумаге 160–220 г/м². Лучше клей-карандаш — от жидкого бумага идёт волнами.</div>
<div><b>Papīrs</b>Drukā 100% mērogā uz bieza papīra, 160–220 g/m². Labāk zīmuļveida līme — no šķidrās papīrs viļņojas.</div></div>
<div class="tips"><div><b>Make your own</b>The last page has blank ornaments — draw Polly in your own hat and write a wish on the back.</div>
<div><b>Свой шар</b>На последнем листе — пустые шары: нарисовать Полли в своей шапке, а на обороте написать пожелание.</div>
<div><b>Savs rotājums</b>Pēdējā lapā — tukši rotājumi: uzzīmē Polliju savā cepurē un aizmugurē uzraksti vēlējumu.</div></div>
</div><div class="ft"><span>© Alina Otkinska · Pigeon Polly Art Lab · pigeonpolly.com</span><span>free for personal use</span></div></div>'''

FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&family=Karla:wght@500;700&family=Caveat:wght@700&family=Caveat+Brush&family=Patrick+Hand&family=Lora:wght@500&family=Nunito+Sans:wght@600&display=swap">'

def page(svg, title, blank=False):
    labs = ''.join(f'<div class="lab" style="left:{i * 99}mm">{"" if blank else b["t"]["en"]}</div>' for i, b in enumerate(BALLS))
    return f'''<div class="pg"><div class="hd"><b>{title}</b><i>{"cut · fold · glue · hang" if not blank else "draw · cut · fold · hang"}</i><span>A4 · print at 100%</span></div>{svg}
<div class="ft"><span>© Alina Otkinska · Pigeon Polly Art Lab · pigeonpolly.com</span><span>free for personal use</span></div></div>'''

def main():
    out = os.path.join(HERE, 'out'); os.makedirs(out, exist_ok=True)
    html = f'''<!doctype html><html><head><meta charset="utf-8">{FONTS}<style>{CSS}</style></head><body>
{page(sheet(), "Polly Christmas ornaments")}
{instructions()}
{page(sheet(True), "Draw your own Polly ornament", True)}
</body></html>'''
    open(os.path.join(out, 'ornaments.html'), 'w', encoding='utf-8').write(html)
    print('ok', out)

if __name__ == '__main__':
    main()
