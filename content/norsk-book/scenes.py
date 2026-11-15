#!/usr/bin/env python3
"""Сцены глав 3–20 (svg 600×340) из деталей art.py. python3 scenes.py → scenes/uNN.svg"""
import os
from art import *
from detail import *
D = os.path.dirname(os.path.abspath(__file__))
S = {}
def scene(n):
    def deco(f):
        S[n] = f
        return f
    return deco

@scene(2)
def u02():
    b = sky(600, 340, '#9fc6e2', '#f4ece0', 'u2')
    b += cloud(100, 50) + cloud(430, 40, .8) + cloud(560, 80, .5, .6)
    # Barcode ēkas ar logiem
    for x, y, w, c in [(300, 104, 26, '#c7d2dd'), (330, 80, 22, '#aebdcb'), (356, 112, 28, '#d5dde4'), (388, 70, 24, '#b8c6d3'), (416, 96, 26, '#cbd5df'), (446, 86, 22, '#a9b9c8'), (472, 108, 26, '#d0d9e2')]:
        b += f'<rect x="{x}" y="{y}" width="{w}" height="{260-y}" fill="{c}" stroke="#1f2442" stroke-width="1.4"/>'
        b += ''.join(f'<rect x="{x+3+i*7}" y="{y+6+j*10}" width="4" height="5" fill="#8fa3b6"/>' for i in range(int(w/7)) for j in range(int((240-y)/10)))
    b += '<path d="M520 260 V150 h30 V120 h26 V260Z" fill="#e2c9a0" stroke="#1f2442" stroke-width="1.4"/>'
    b += water(250, c='#86adc4')
    b += boat(80, 300, .9) + boat(560, 286, .6, '#2f55a0')
    b += '<g stroke="#1f2442" stroke-width="1.6"><path d="M150 262 h40 l-6 8 h-30Z" fill="#fff"/><path d="M160 262 v-10 h18 v10" fill="#c8323c"/></g>'
    # operas jumts
    b += '<path d="M40 252 L300 118 L570 150 L600 252Z" fill="#f4f2ec" stroke="#1f2442" stroke-width="2" stroke-linejoin="round"/>'
    b += '<path d="M300 118 L570 150 L548 172 L312 140Z" fill="#e2dfd6" stroke="#1f2442" stroke-width="1.6" stroke-linejoin="round"/>'
    b += ''.join(f'<path d="M{60+i*40} 252 L{300+i*8} {124+i*3}" stroke="#e1ddd2" stroke-width="1.5"/>' for i in range(8))
    b += '<rect x="420" y="92" width="74" height="64" fill="#6d8299" stroke="#1f2442" stroke-width="2"/>'
    b += ''.join(f'<line x1="{x}" y1="94" x2="{x}" y2="154" stroke="#8ea3b8"/>' for x in range(428, 494, 8))
    b += '<path d="M424 100 L490 150" stroke="#b9c8d6" stroke-width="3" opacity=".6"/>'
    # cilvēki uz jumta (mazi)
    for x, y, c in [(470, 178, '#c8323c'), (486, 182, '#e1a85a'), (520, 196, '#5f8a72'), (230, 168, '#2f55a0')]:
        b += f'<g stroke="#1f2442" stroke-width="1.2"><rect x="{x-3}" y="{y-12}" width="6" height="10" rx="2" fill="{c}"/><circle cx="{x}" cy="{y-15}" r="3" fill="#f0d2b4"/><path d="M{x-2} {y-2} v5 M{x+2} {y-2} v5"/></g>'
    b += '<path d="M0 252 H600" stroke="#1f2442" stroke-width="2"/>'
    b += '<g stroke="#1f2442" stroke-width="1.6"><path d="M100 230 v-50" stroke-width="2"/><path d="M100 180 h26 v16 h-26Z" fill="#c8323c"/><path d="M100 188 h26 M108 180 v16" stroke="#fff" stroke-width="3"/><path d="M100 188 h26 M108 180 v16" stroke="#1f3a68" stroke-width="1.4"/></g>'
    b += crow(160, 226, .55) + polly(268, 194, .6) + sparrow(350, 166, .62, flip=True)
    b += bubble(30, 132, 'Hvor kommer du fra?')
    return svg(600, 340, 'Pollijs, vārna Ina un zvirbulis Bens uz Oslo operas jumta', b)

@scene(3)
def u03():
    b = sky(600, 340, '#a9cde6', '#f2efe4', 'u3')
    b += cloud(90, 44) + cloud(520, 60, .8) + cloud(300, 30, .5, .6)
    # tālā koku rinda
    b += ''.join(tree(x, 168, 22, '#8fb48a', '#a9c9a0') for x in range(-10, 640, 38))
    b += '<path d="M0 166 H600 V340 H0Z" fill="#a8c68e"/>'
    # monolīts uz pakāpieniem ar figūrām
    b += '<g stroke="#1f2442" stroke-width="2" stroke-linejoin="round">'
    b += '<path d="M200 186 H400 L388 176 H212Z" fill="#cdc4b0"/><path d="M220 176 H380 L370 166 H230Z" fill="#d6cdb9"/><path d="M242 166 H358 L350 158 H250Z" fill="#ded6c3"/>'
    b += '<path d="M284 158 C281 110 283 60 291 28 C295 18 305 18 309 28 C317 60 319 110 316 158Z" fill="#d8d1c3"/></g>'
    b += ''.join(f'<path d="M{288 + (k % 2) * 3} {150 - k * 9} q6 -5 12 0 q6 5 12 0" stroke="#a69f92" stroke-width="1.3" fill="none"/>' for k in range(13))
    b += ''.join(f'<circle cx="{292 + (k * 7) % 22}" cy="{146 - k * 8.5}" r="2.2" fill="#c4bcab" stroke="#a69f92" stroke-width=".8"/>' for k in range(14))
    b += ''.join(figure(x, y, .42, '#cdc4b0', i) for i, (x, y) in enumerate([(222, 174), (244, 165), (262, 158), (338, 158), (356, 165), (378, 174)]))
    # celiņš ar oļiem
    b += '<path d="M250 186 L350 186 L430 340 L170 340Z" fill="#ebe2cf"/>'
    b += pebbles(lambda r: (r.uniform(200, 400), r.uniform(200, 338)), 90, 5)
    # dzīvžogi, koki, krūmi, puķes
    b += hedge(20, 206, 190) + hedge(390, 206, 190)
    b += tree(30, 214, 30) + tree(570, 214, 30, '#6a9566') + tree(150, 200, 22, '#7ea877')
    b += flowers(30, 200, 222, 1) + flowers(400, 580, 222, 2)
    b += grass(0, 190, 230, 338, 7, '#89ab78', 35) + grass(440, 600, 230, 338, 8, '#89ab78', 30)
    # Sinnataggen uz postamenta
    b += '<rect x="96" y="232" width="34" height="34" fill="#cfc6b4" stroke="#1f2442" stroke-width="2"/>' + figure(113, 232, .7, '#b9b0a0', 2)
    b += lamp(560, 300, 110) + bench(456, 262, 74)
    # pikniks: baložu ģimene uz pleda
    b += blanket(360, 318, 150, 30) + basket(476, 300) + crumbs(420, 308)
    b += polly(170, 322, .6, flip=True)
    b += polly(392, 312, .52, beret=False, c=GREY) + polly(438, 316, .48, beret=False, c=GREY)
    b += polly(470, 322, .26, beret=False, c=GREY, flip=True) + polly(498, 326, .24, beret=False, c=GREY) + polly(524, 328, .2, beret=False, c=GREY, flip=True)
    b += bubble(300, 214, 'Dette er familien min!')
    return svg(600, 340, 'Pollijs un baložu ģimene piknikā Vīgelanna parkā pie Monolīta', b)

@scene(4)
def u04():
    b = '<rect width="600" height="340" fill="#f2e9dc"/>'
    b += ''.join(f'<rect x="{x}" y="{y}" width="20" height="14" fill="none" stroke="#e3d6c3" stroke-width="1"/>' for x in range(300, 600, 20) for y in range(150, 230, 14))
    out = sky(600, 340, '#cfe2ef', '#eef2ee', 'u4s') + facade(10, 200, 70, 150, '#e1a85a') + facade(84, 200, 60, 130, '#c96f5a') + facade(148, 200, 70, 160, '#9fb7c9')
    out += '<rect x="0" y="200" width="300" height="100" fill="#b8b2a6"/><path d="M0 214 H300" stroke="#8e887d" stroke-width="2"/>' + tram(30, 214, .9)
    b += window(30, 40, 230, 170, out)
    b += crow(205, 213, .38, flip=True)
    b += clock(330, 60, 22, 10, 0)
    b += shelf(380, 80, 160, jar(392, 80) + jar(410, 80, '#d8453c') + jar(428, 80, '#f2d68e', lid='#2f55a0') + cup(460, 80, '#e8c46a', False) + cup(484, 80, '#c8d7e6', False) + plant(522, 80, .6))
    b += '<g stroke="#1f2442" stroke-width="2"><rect x="520" y="110" width="66" height="134" rx="6" fill="#e9eef1"/><path d="M520 160 h66" /><path d="M528 120 v24 M528 170 v30" stroke-width="3"/></g>'
    b += '<g stroke="#1f2442" stroke-width="1.2"><rect x="540" y="124" width="10" height="8" fill="#e86a7a"/><circle cx="566" cy="130" r="5" fill="#f2c13d"/><rect x="552" y="176" width="14" height="10" fill="#fff"/></g>'
    b += '<path d="M380 12 v40" stroke="#1f2442" stroke-width="1.6"/><path d="M364 52 h32 l-6 -14 h-20Z" fill="#c8323c" stroke="#1f2442" stroke-width="1.8"/>'
    b += '<rect y="244" width="600" height="96" fill="#d9b88c"/><g stroke="#c49f6f">' + ''.join(f'<line x1="{x}" y1="244" x2="{x-30}" y2="340"/>' for x in range(40, 640, 70)) + '</g>'
    b += '<g stroke="#1f2442" stroke-width="2" stroke-linejoin="round"><rect x="270" y="236" width="230" height="12" rx="3" fill="#b07f4f"/><path d="M286 248 v76 M484 248 v76" stroke-width="6" stroke="#8b5f37"/></g>'
    b += '<path d="M290 236 l10 -8 h60 l-10 8Z" fill="#f6f1e6" stroke="#1f2442" stroke-width="1.4"/>' + bread(305, 230)
    b += cheese(380, 236) + '<path d="M418 222 l14 -12 l4 4 l-12 12Z" fill="#c9d2da" stroke="#1f2442" stroke-width="1.4"/>'
    b += jar(446, 236, '#c8323c', 16) + cup(468, 236, '#9fc2b8')
    b += '<g stroke="#1f2442" stroke-width="1.6"><path d="M330 236 h34 l-4 -16 h-26Z" fill="#33405a"/><path d="M364 226 q8 0 6 8" fill="none"/></g>'
    b += polly(230, 318, .62, flip=True)
    b += plant(40, 300, .9) + '<g stroke="#1f2442" stroke-width="1.6"><rect x="90" y="266" width="44" height="24" rx="4" fill="#c8323c"/><circle cx="104" cy="278" r="6" fill="#f2e9dc"/><path d="M118 272 h10 M118 278 h10 M118 284 h10"/><path d="M96 266 l10 -14"/></g>'
    b += bubble(60, 222, 'God morgen!')
    return svg(600, 340, 'Pollijs no rīta virtuvē Oslo gatavo matpakke; aiz loga vārna Ina un tramvajs', b)

@scene(5)
def u05():
    b = sky(600, 340, '#9ec3df', '#eef3f6', 'u5')
    b += cloud(80, 40) + cloud(330, 30, .6, .7) + cloud(200, 90, .5, .6)
    b += '<path d="M0 200 L60 150 L110 180 L170 130 L230 175 L290 140 L350 185 L420 160 V260 H0Z" fill="#c9d9e6"/>' + '<path d="M160 138 L170 130 L180 138 M280 148 L290 140 L300 148" stroke="#fff" stroke-width="4" fill="none"/>'
    b += '<path d="M0 230 C80 200 160 214 240 196 C300 184 360 200 420 190 L420 340 H0Z" fill="#dfe9f1"/>'
    b += '<path d="M0 250 C60 236 120 246 190 240 C240 236 260 250 300 246 V340 H0Z" fill="#a7c1d4"/>'
    b += ''.join(f'<rect x="{x}" y="{246-h}" width="8" height="{h}" fill="#c2d2de" stroke="#8ea3b8" stroke-width=".8"/>' for x, h in [(40, 14), (52, 20), (64, 12), (78, 18), (96, 10), (120, 16)])
    # lēciena tramplīns
    b += '<path d="M600 40 L560 40 C520 120 470 200 380 262 L600 262Z" fill="#f4f6f8" stroke="#1f2442" stroke-width="2" stroke-linejoin="round"/>'
    b += '<path d="M600 40 L560 40 L548 50 L600 50Z" fill="#c9d2da" stroke="#1f2442" stroke-width="1.6"/>'
    b += '<path d="M566 40 C526 120 476 200 388 262" stroke="#9fb0c2" stroke-width="2" fill="none"/>'
    b += '<g stroke="#1f2442" stroke-width="1.6">' + ''.join(f'<path d="M{x} 262 V{y}" />' for x, y in [(560, 50), (540, 96), (520, 136), (500, 170), (480, 200)]) + '</g>'
    b += '<path d="M548 30 h24 v10 h-24Z" fill="#c8323c" stroke="#1f2442" stroke-width="1.6"/>'
    b += flag(430, 230, 40, .8) + flag(470, 236, 40, .8)
    # sniegota zeme, egles
    b += '<path d="M0 262 C120 250 240 270 360 258 C460 250 540 262 600 256 V340 H0Z" fill="#fbfdff" stroke="#1f2442" stroke-width="2"/>'
    b += ''.join(spruce_snow(x, y, h) for x, y, h in [(20, 268, 60), (60, 270, 46), (250, 264, 40), (290, 266, 52), (580, 270, 50)])
    b += '<path d="M60 340 C140 300 260 290 420 300" stroke="#cfdbe6" stroke-width="2" fill="none"/><path d="M80 340 C160 304 270 296 430 306" stroke="#cfdbe6" stroke-width="2" fill="none"/>'
    b += skier(330, 296, .8) + skier(400, 300, .7, '#2f6fb0', '#33333c') + skier(150, 318, .9, '#e1a85a')
    b += '<rect x="196" y="268" width="6" height="40" fill="#8b5f37" stroke="#1f2442" stroke-width="1.6"/>' + magpie(199, 268, .5)
    b += '<g stroke="#1f2442" stroke-width="1.6"><rect x="462" y="276" width="86" height="22" rx="3" fill="#2f3c58"/><path d="M474 298 v20 M536 298 v20" stroke-width="3"/></g>'
    b += '<text x="469" y="291" font-family="DM Sans,sans-serif" font-size="9" font-weight="700" fill="#fff">HOLMENKOLLEN</text>'
    b += polly(250, 330, .52)
    b += '<path d="M231 281 Q250 288 269 280" stroke="#c8323c" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M258 285 l5 18" stroke="#c8323c" stroke-width="6" stroke-linecap="round"/>'
    b += bubble(60, 190, 'Går du på ski?')
    return svg(600, 340, 'Pollijs un žagata Sigrīda pie Holmenkollen tramplīna ziemā', b)

@scene(6)
def u06():
    b = logs(0, 0, 600, 260)
    b += '<path d="M0 0 H600 V18 H0Z" fill="#8b5f37"/>'
    out = sky(600, 340, '#c4d6e6', '#f2f5f8', 'u6s') + '<rect y="120" width="600" height="220" fill="#fbfdff"/>' + ''.join(spruce_snow(x, y, h) for x, y, h in [(30, 150, 70), (70, 160, 60), (110, 150, 80)])
    b += window(40, 50, 130, 110, out, '#f6efe0')
    b += '<g stroke="#1f2442" stroke-width="1.6"><path d="M30 46 C60 70 50 120 66 170 H24 V46Z" fill="#c8323c"/><path d="M180 46 C150 70 160 120 144 170 H186 V46Z" fill="#c8323c"/></g>'
    b += '<g fill="#fff" opacity=".9">' + ''.join(f'<path d="M{x} {y} l3 -3 l3 3 l-3 3Z"/>' for x, y in [(44, 60), (90, 72), (140, 64), (120, 100), (60, 110)]) + '</g>'
    # kamīns
    b += '<g stroke="#1f2442" stroke-width="2" stroke-linejoin="round"><path d="M300 260 V120 h120 V260Z" fill="#9aa0a8"/><path d="M290 120 h140 v-12 h-140Z" fill="#7d838c"/>'
    b += '<path d="M322 260 V180 q0 -24 38 -24 q38 0 38 24 V260Z" fill="#33333c"/></g>'
    b += ''.join(f'<path d="M300 {y} h120" stroke="#858b94" stroke-width="1.2"/>' for y in range(134, 260, 18))
    b += fire(334, 252, 52)
    b += candle(310, 108, 18) + candle(330, 108, 26) + candle(410, 108, 14)
    b += '<g stroke="#1f2442" stroke-width="1.6"><rect x="350" y="70" width="40" height="30" fill="#e9d6b4"/><path d="M356 94 l10 -14 l8 8 l6 -6 l6 12Z" fill="#7fa3c4"/></g>'
    # grāmatu plaukts
    b += shelf(460, 90, 120, ''.join(f'<rect x="{464+i*12}" y="{90-h}" width="10" height="{h}" fill="{c}" stroke="#1f2442" stroke-width="1.2"/>' for i, (h, c) in enumerate([(26, '#c8323c'), (22, '#2f55a0'), (28, '#e1a85a'), (20, '#5f8a72'), (24, '#9b7650')])) + candle(560, 90, 14))
    b += shelf(460, 140, 120, jar(470, 140, '#c8323c') + jar(490, 140, '#e9b45f') + cup(520, 140, '#c8d7e6', False) + plant(556, 140, .5))
    b += skis(200, 262)
    b += '<rect y="260" width="600" height="80" fill="#b98a58"/>' + ''.join(f'<path d="M{x} 260 L{x-20} 340" stroke="#a37548" stroke-width="2"/>' for x in range(60, 640, 60))
    b += rug(330, 300, 220, 40)
    b += armchair(460, 290, '#2f6f8a') + owl(496, 262, .55)
    b += '<g stroke="#1f2442" stroke-width="1.6"><path d="M548 252 c10 -10 20 -10 30 0 l-6 20 h-18Z" fill="#f6efe0"/><path d="M552 260 h22 M554 266 h18" stroke="#c8323c" stroke-width="2"/></g>'
    b += polly(260, 318, .55, flip=True)
    b += '<g stroke="#1f2442" stroke-width="1.6"><rect x="140" y="276" width="44" height="34" rx="4" fill="#e1a85a"/><path d="M146 276 v-8 h32 v8" fill="none"/></g>'
    b += bubble(60, 210, 'Så koselig!')
    return svg(600, 340, 'Pollijs un pūce Ulfs omulīgā kalnu mājiņā pie kamīna', b)

@scene(7)
def u07():
    b = sky(600, 340, '#a9cbe3', '#f1efe4', 'u7')
    b += cloud(120, 46) + cloud(470, 36, .8)
    b += ridge([(0, 150), (80, 90), (150, 130), (230, 70), (300, 120), (380, 80), (460, 130), (540, 76), (600, 110)], '#9fb3c4', 190, snow=95)
    b += ridge([(0, 190), (100, 140), (200, 175), (300, 130), (420, 170), (520, 140), (600, 165)], '#7d9a7a', 230)
    b += '<path d="M0 200 C120 186 260 196 380 186 C470 180 540 190 600 186 V340 H0Z" fill="#a8c68e"/>'
    b += ''.join(spruce(x, y, h, '#5f8a72') for x, y, h in [(30, 198, 40), (60, 200, 30), (560, 194, 44), (590, 196, 34)])
    b += turfhouse(90, 230, 110, 58) + stabbur(240, 226) + turfhouse(420, 222, 80, 44, '#a0703e')
    b += fence(0, 600, 262)
    b += grass(0, 600, 268, 336, 9, '#89ab78', 50) + flowers(320, 420, 270, 11, ('#f2c13d', '#fff', '#c58ad8'))
    b += goat(470, 300, .62, flip=True) + goat(550, 270, .38)
    # galds ar brunost
    b += '<g stroke="#1f2442" stroke-width="2" stroke-linejoin="round"><rect x="180" y="268" width="170" height="10" rx="3" fill="#b07f4f"/><path d="M196 278 v52 M334 278 v52" stroke-width="5" stroke="#8b5f37"/></g>'
    b += brunost(200, 268) + '<path d="M244 254 l16 -12 l4 4 l-14 12Z" fill="#c9d2da" stroke="#1f2442" stroke-width="1.4"/>'
    b += '<g stroke="#1f2442" stroke-width="1.6"><ellipse cx="300" cy="266" rx="30" ry="5" fill="#f6efe0"/></g>' + waffle(292, 262, .7) + waffle(310, 263, .6)
    b += cup(330, 268, '#c8323c')
    b += polly(140, 330, .55, flip=True)
    b += bubble(330, 190, 'Vil du smake brunost?')
    return svg(600, 340, 'Pollijs un kaza Gro saimniecībā Gudbrandsdālenē nogaršo brūno sieru', b)

@scene(8)
def u08():
    b = sky(600, 340, '#a7cbe6', '#f6efe2', 'u8')
    b += cloud(90, 40) + cloud(500, 50, .8)
    b += '<path d="M0 170 C80 80 180 60 280 90 C360 112 440 70 520 90 C560 100 590 120 600 130 V260 H0Z" fill="#7f9f84" stroke="#1f2442" stroke-width="1.6"/>'
    b += ''.join(tree(x, y, 10, '#6a9566', '#86b07f') for x, y in [(60, 150), (90, 130), (140, 112), (200, 104), (330, 110), (380, 100), (450, 96), (520, 108), (560, 120)])
    b += '<path d="M120 210 L300 92" stroke="#1f2442" stroke-width="2" stroke-dasharray="5 4"/><rect x="236" y="124" width="22" height="14" rx="3" fill="#2f6fb0" stroke="#1f2442" stroke-width="1.4" transform="rotate(-33 247 131)"/>'
    for i, (w, h, c) in enumerate([(52, 90, '#e8d9b8'), (48, 104, '#c8323c'), (54, 86, '#f2d68e'), (46, 98, '#fbf6ea'), (52, 92, '#9fb7c9'), (50, 110, '#e1a85a'), (48, 88, '#f3e6d0'), (54, 100, '#c96f5a'), (50, 94, '#e8d9b8'), (48, 102, '#fbf6ea'), (52, 92, '#d9825f'), (50, 96, '#9fc2b8')]):
        b += gable(i * 50 - 2, 252, w, h, c)
    b += bunting(0, 300, 120) + bunting(300, 600, 126)
    b += flag(30, 252, 70) + flag(570, 252, 70)
    b += '<rect y="252" width="600" height="88" fill="#d8d2c4"/>' + ''.join(f'<path d="M{x} 252 L{x-18} 340" stroke="#c4bdae" stroke-width="1.4"/>' for x in range(30, 640, 40))
    for i, x in enumerate(range(70, 560, 34)):
        b += person(x, 286 + (i % 2) * 4, .8, ['#c8323c', '#1f3a68', '#2f6f8a', '#e1a85a'][i % 4], ['#7a5a3e', '#e6c27a', '#3a2a20'][i % 3], flagged=True, skirt='#1f3a68' if i % 3 == 0 else None)
    b += balloon(120, 230) + balloon(132, 222, '#1f3a68') + balloon(470, 226, '#fff')
    b += '<g stroke="#1f2442" stroke-width="1.6"><rect x="508" y="290" width="70" height="34" rx="4" fill="#fbf6ea"/><path d="M508 290 l10 -16 h50 l10 16" fill="#c8323c"/><circle cx="522" cy="330" r="6" fill="#33333c"/><circle cx="564" cy="330" r="6" fill="#33333c"/></g>'
    b += '<text x="516" y="311" font-family="DM Sans,sans-serif" font-size="8.5" font-weight="700" fill="#c8323c">IS · PØLSER</text>'
    b += polly(200, 336, .48, flip=True, extra='<path d="M44 -60 L60 -140" stroke="#1f2442" stroke-width="2"/><rect x="58" y="-160" width="34" height="22" fill="#c8323c" stroke="#1f2442" stroke-width="1.4"/><path d="M58 -149 h34 M70 -160 v22" stroke="#fff" stroke-width="6"/><path d="M58 -149 h34 M70 -160 v22" stroke="#1f3a68" stroke-width="3"/>')
    b += polly(300, 336, .48, beret=False, c=GREY, extra=VEST)
    b += bubble(300, 186, 'Gratulerer med dagen!')
    return svg(600, 340, 'Pollijs un balodis Bjērns 17. maijā Bergenā vēro bērnu gājienu', b)

@scene(9)
def u09():
    b = sky(600, 340, '#b2cde0', '#f2efe6', 'u9')
    b += cloud(80, 34, .9) + cloud(420, 28, .7)
    b += '<path d="M0 150 C60 70 140 40 220 70 C300 96 340 40 420 50 C500 60 560 90 600 110 V230 H0Z" fill="#7f9f84" stroke="#1f2442" stroke-width="1.6"/>'
    b += ''.join(tree(x, y, 9, '#6a9566', '#86b07f') for x, y in [(40, 130), (90, 100), (150, 80), (250, 84), (330, 70), (410, 64), (480, 76), (540, 96)])
    cols = ['#c8323c', '#e1a85a', '#fbf6ea', '#c8323c', '#f2d68e', '#d9825f', '#fbf6ea', '#c8323c', '#e1a85a', '#fbf6ea', '#b8432f']
    for i, c in enumerate(cols):
        b += bryggehus(10 + i * 38, 232, 40, 92 + (i % 3) * 8, c)
    b += water(232, c='#86adc4')
    b += boat(500, 244, .7, '#fbf6ea') + boat(570, 242, .5)
    b += '<rect y="250" width="600" height="90" fill="#d8d2c4"/><path d="M0 250 H600" stroke="#1f2442" stroke-width="2"/>'
    b += ''.join(f'<path d="M{x} 250 L{x-14} 340" stroke="#c4bdae" stroke-width="1.4"/>' for x in range(20, 640, 40))
    b += fishstall(330, 318, 170)
    b += gull(450, 268, .42, flip=True)
    b += person(110, 316, .9, '#2f6f8a') + person(140, 318, .85, '#e1a85a', '#3a2a20') + person(560, 322, .9, '#5f8a72', '#e6c27a')
    b += polly(250, 334, .5)
    b += '<g transform="translate(186 292) rotate(-8)" stroke="#1f2442" stroke-width="1.4"><rect width="44" height="30" fill="#fbf6ea"/><path d="M14 0 v30 M30 0 v30" stroke="#d6cbb6"/><path d="M4 22 L16 10 L28 18 L40 6" stroke="#c8323c" stroke-width="2" fill="none"/></g>'
    b += bubble(300, 186, 'Unnskyld, hvor er Fløibanen?')
    return svg(600, 340, 'Pollijs ar karti Bergenā pie Brigenas namiem un zivju tirgus, kur strādā kaija Knuts', b)

@scene(10)
def u10():
    b = sky(600, 340, '#a6c9e2', '#eef1ea', 'u10')
    b += cloud(300, 36, .8) + cloud(520, 26, .6)
    b += '<path d="M0 0 H190 C180 80 160 150 130 220 L0 236Z" fill="#7d8f9c" stroke="#1f2442" stroke-width="1.6"/>'
    b += '<path d="M600 0 H420 C430 90 460 160 510 210 L600 220Z" fill="#8a9ca8" stroke="#1f2442" stroke-width="1.6"/>'
    b += ''.join(f'<path d="M{x} {y} l{dx} {dy}" stroke="#6d7f8b" stroke-width="2" stroke-linecap="round"/>' for x, y, dx, dy in [(20, 30, 40, 26), (60, 110, 34, 20), (30, 170, 30, 16), (120, 60, 26, 30), (470, 50, 30, 26), (520, 120, 34, 22), (560, 60, 20, 30)])
    b += '<path d="M40 10 l20 10 l-14 4Z M500 14 l24 8 l-16 6Z" fill="#fff" opacity=".85"/>'
    b += '<path d="M190 0 C210 40 236 52 254 62 M300 62 C326 52 400 40 420 0" stroke="#1f2442" stroke-width="1.6" fill="none"/>'
    b += '<path d="M190 0 C210 40 236 52 254 62 L300 62 C326 52 400 40 420 0Z" fill="#9aacb8"/>'
    b += '<path d="M130 220 C200 196 360 196 510 210 L600 220 V340 H0 V236Z" fill="#7aa36a" stroke="#1f2442" stroke-width="1.6"/>'
    b += waterfall(254, 62, 200, 46)
    b += ''.join(spruce(x, y, h, '#4f7a64') for x, y, h in [(160, 222, 34), (188, 214, 28), (370, 212, 32), (404, 218, 40), (446, 222, 30), (560, 226, 36)])
    b += person(226, 214, .75, '#c8323c', '#e6c27a', skirt='#c8323c')
    b += '<g stroke="#1f2442" stroke-width="1.6"><path d="M330 214 h60 v-14 h-60Z" fill="#c9b79c"/><path d="M336 200 v-6 h48 v6" fill="#8b5f37"/><text x="340" y="210" font-family="DM Sans,sans-serif" font-size="7.5" font-weight="700" fill="#1f2442" stroke="none">KJOSFOSSEN</text></g>'
    b += '<path d="M0 312 L600 300" stroke="#5f5a52" stroke-width="12"/><path d="M0 312 L600 300" stroke="#8b847a" stroke-width="5" stroke-dasharray="12 7"/>'
    b += '<path d="M540 300 V230 q30 -40 60 -40 V300Z" fill="#33333c" stroke="#1f2442" stroke-width="2"/><path d="M528 300 V226 q42 -56 84 -52" fill="none" stroke="#9aa0a8" stroke-width="10"/>'
    b += train(150, 306, 3, s=1.3)
    b += '<g transform="translate(150 306) scale(1.3)">' + polly(36, -24, .24) + sheep(162, -26, .3, flip=True) + '</g>'
    b += sheep(70, 330, .55) + sheep(30, 326, .42, flip=True)
    b += grass(0, 600, 314, 338, 13, '#5f8a52', 40) + flowers(80, 160, 300, 21, ('#fff', '#f2c13d'))
    b += '<path d="M330 80 q6 -5 12 0 q6 -5 12 0 M360 100 q5 -4 10 0 q5 -4 10 0" stroke="#1f2442" stroke-width="1.4" fill="none"/>'
    b += bubble(30, 246, 'Se! Kjosfossen!')
    return svg(600, 340, 'Flåmas dzelzceļa vilciens pie Kjosfosena ūdenskrituma; Pollijs un aita vagona logos', b)

@scene(11)
def u11():
    b = sky(600, 340, '#9cc0dc', '#f3ece0', 'u11')
    b += cloud(120, 40) + cloud(420, 30, .8) + cloud(560, 70, .5)
    b += ridge([(0, 150), (60, 90), (120, 130), (190, 70), (260, 120), (330, 84), (400, 130), (470, 96), (540, 120), (600, 100)], '#a6b8c6', 180, snow=110)
    b += '<path d="M0 180 C60 166 110 176 170 168 C230 160 260 176 320 172 L320 190 H0Z" fill="#7d9a7a" stroke="#1f2442" stroke-width="1.4"/>'
    b += ''.join(house(x, 184, 18, 13, c) for x, c in [(30, '#c8323c'), (56, '#fbf6ea'), (84, '#e1a85a'), (200, '#c8323c'), (226, '#fbf6ea')])
    b += lighthouse(300, 184, 46)
    b += water(184, c='#7fa6c0')
    b += '<path d="M420 160 q6 -5 12 0 q6 -5 12 0 M470 140 q5 -4 10 0 q5 -4 10 0" stroke="#1f2442" stroke-width="1.4" fill="none"/>'
    # kuģa klājs
    b += '<path d="M0 250 H600 V340 H0Z" fill="#c8b48e"/>' + ''.join(f'<path d="M0 {y} H600" stroke="#b49f78" stroke-width="1.4"/>' for y in range(262, 340, 12))
    b += '<path d="M0 214 H600" stroke="#1f2442" stroke-width="3"/><path d="M0 214 H600" stroke="#fff" stroke-width="1.4"/>'
    b += ''.join(f'<path d="M{x} 214 V250" stroke="#1f2442" stroke-width="2.4"/>' for x in range(10, 600, 40)) + '<path d="M0 232 H600" stroke="#1f2442" stroke-width="1.4"/>'
    b += '<g stroke="#1f2442" stroke-width="2"><path d="M470 250 V120 h70 V250Z" fill="#fbf6ea"/><path d="M490 120 v-50 h34 v50Z" fill="#c8323c"/><path d="M490 70 h34 v14 h-34Z" fill="#33333c"/></g>'
    b += ''.join(f'<circle cx="{486 + i*18}" cy="{150 + j*30}" r="6" fill="#bcd3e4" stroke="#1f2442" stroke-width="1.4"/>' for i in range(3) for j in range(3))
    b += lifebuoy(440, 236)
    b += '<g stroke="#1f2442" stroke-width="1.6"><rect x="60" y="268" width="60" height="8" fill="#a87a42"/><path d="M66 276 v24 M114 276 v24" stroke-width="3"/><rect x="70" y="254" width="40" height="14" fill="#fff"/></g>'
    b += '<text x="90" y="246" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="8" font-weight="700" fill="#1f2442">HURTIGRUTEN</text>'
    b += polly(220, 330, .55)
    b += '<g transform="translate(160 296) rotate(-10)" stroke="#1f2442" stroke-width="1.4"><rect width="40" height="30" fill="#fbf6ea"/><path d="M6 22 L14 10 L20 16 L28 6 L34 20" stroke="#2f55a0" stroke-width="1.6" fill="none"/></g>'
    b += cormorant(350, 332, .78, flip=True, hat=True)
    b += '<g stroke="#1f2442" stroke-width="1.6"><ellipse cx="380" cy="268" rx="22" ry="5" fill="#c9d2da"/><path d="M362 266 q18 -18 36 0" fill="#e9a07a"/></g>'
    b += bubble(110, 112, 'Er du kokken på skipet?')
    return svg(600, 340, 'Pollijs un jūraskraukļa pavārs Ūle uz Hurtigruten kuģa klāja; krastā bāka un mājiņas', b)

if __name__ == '__main__':
    os.makedirs(os.path.join(D, 'scenes'), exist_ok=True)
    for n, f in S.items():
        open(os.path.join(D, 'scenes', f'u{n:02d}.svg'), 'w').write(f())
    print('scenes', sorted(S))
