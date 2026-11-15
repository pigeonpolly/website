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

if __name__ == '__main__':
    os.makedirs(os.path.join(D, 'scenes'), exist_ok=True)
    for n, f in S.items():
        open(os.path.join(D, 'scenes', f'u{n:02d}.svg'), 'w').write(f())
    print('scenes', sorted(S))
