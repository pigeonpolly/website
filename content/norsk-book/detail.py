"""Детали для насыщенных сцен (деревья, кусты, цветы, скамейки, фонари, люди-скульптуры, текстуры)."""
import random
from art import LINE

def rnd(seed):
    random.seed(seed)
    return random

def tree(x, y, r=34, c='#6f9a6a', c2='#8db884', trunk='#7a5a3e'):
    """лиственное дерево: y — низ ствола"""
    t = f'<path d="M{x-4} {y} L{x-3} {y-r*1.1} L{x+3} {y-r*1.1} L{x+4} {y}Z" fill="{trunk}" stroke="{LINE}" stroke-width="1.6"/>'
    cy = y - r * 1.5
    blobs = [(-r*.55, r*.15, r*.62), (r*.55, r*.1, r*.6), (0, -r*.35, r*.72), (-r*.2, r*.3, r*.6), (r*.25, r*.35, r*.55)]
    t += ''.join(f'<circle cx="{x+dx:.1f}" cy="{cy+dy:.1f}" r="{rr:.1f}" fill="{c}" stroke="{LINE}" stroke-width="1.6"/>' for dx, dy, rr in blobs)
    t += ''.join(f'<circle cx="{x+dx:.1f}" cy="{cy+dy:.1f}" r="{rr:.1f}" fill="{c}"/>' for dx, dy, rr in blobs)
    t += f'<circle cx="{x-r*.25:.1f}" cy="{cy-r*.45:.1f}" r="{r*.28:.1f}" fill="{c2}"/><circle cx="{x+r*.4:.1f}" cy="{cy-r*.05:.1f}" r="{r*.18:.1f}" fill="{c2}"/>'
    return t

def bush(x, y, w=50, c='#5f8a5e', c2='#7ea877'):
    h = w * .5
    d = f'M{x} {y} C{x} {y-h} {x+w*.2} {y-h*1.1} {x+w*.35} {y-h*.9} C{x+w*.45} {y-h*1.3} {x+w*.75} {y-h*1.2} {x+w*.8} {y-h*.8} C{x+w*1.05} {y-h*.8} {x+w} {y} {x+w} {y}Z'
    return (f'<path d="{d}" fill="{c}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>'
            f'<ellipse cx="{x+w*.35}" cy="{y-h*.6}" rx="{w*.12}" ry="{h*.15}" fill="{c2}"/><ellipse cx="{x+w*.7}" cy="{y-h*.55}" rx="{w*.1}" ry="{h*.12}" fill="{c2}"/>')

def hedge(x, y, w, h=18, c='#5f8a5e'):
    t = f'<rect x="{x}" y="{y-h}" width="{w}" height="{h}" rx="6" fill="{c}" stroke="{LINE}" stroke-width="1.6"/>'
    t += ''.join(f'<path d="M{x+i} {y-h+5} q3 -3 6 0" stroke="#7ea877" stroke-width="1.4" fill="none"/>' for i in range(6, int(w) - 6, 12))
    return t

def flowers(x0, x1, y, seed=1, cols=('#e86a7a', '#f2c13d', '#ffffff', '#c58ad8')):
    r = rnd(seed); t = ''
    for i in range(int((x1 - x0) / 9)):
        x = x0 + i * 9 + r.uniform(-3, 3); yy = y + r.uniform(-4, 4); c = r.choice(cols)
        t += f'<path d="M{x:.1f} {yy:.1f} v8" stroke="#4f7a52" stroke-width="1.4"/><circle cx="{x:.1f}" cy="{yy:.1f}" r="3" fill="{c}" stroke="{LINE}" stroke-width=".8"/>'
    return t

def grass(x0, x1, y0, y1, seed=2, c='#86a876', n=40):
    r = rnd(seed)
    return ''.join(f'<path d="M{x:.1f} {y:.1f} l-2 -6 M{x:.1f} {y:.1f} l2 -7 M{x:.1f} {y:.1f} l5 -5" stroke="{c}" stroke-width="1.3" fill="none"/>'
                   for x, y in ((r.uniform(x0, x1), r.uniform(y0, y1)) for _ in range(n)))

def pebbles(pts_fn, n=60, seed=3, c='#d3c8b2'):
    r = rnd(seed)
    return ''.join(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{r.uniform(1.2, 2.6):.1f}" ry="{r.uniform(.8, 1.6):.1f}" fill="{c}"/>' for x, y in (pts_fn(r) for _ in range(n)))

def bench(x, y, w=70, c='#8b5f37'):
    return (f'<g stroke="{LINE}" stroke-width="1.8" stroke-linejoin="round"><path d="M{x+6} {y} v-16 M{x+w-6} {y} v-16" stroke-width="3"/>'
            f'<rect x="{x}" y="{y-20}" width="{w}" height="6" rx="2" fill="{c}"/><rect x="{x}" y="{y-34}" width="{w}" height="5" rx="2" fill="{c}"/>'
            f'<rect x="{x}" y="{y-42}" width="{w}" height="5" rx="2" fill="{c}"/><path d="M{x+8} {y-20} v-22 M{x+w-8} {y-20} v-22"/></g>')

def lamp(x, y, h=90):
    return (f'<g stroke="{LINE}" stroke-width="2" stroke-linejoin="round"><path d="M{x} {y} v-{h}" stroke-width="3.5" stroke="#2f3a4a"/>'
            f'<path d="M{x-8} {y} h16" stroke-width="3"/><path d="M{x-9} {y-h} h18 l-4 -16 h-10Z" fill="#fbe7a6"/><path d="M{x-11} {y-h-16} h22 l-11 -8Z" fill="#2f3a4a"/></g>')

def figure(x, y, s=1, c='#cfc6b4', pose=0):
    """каменная фигура человека (скульптура): y — низ"""
    arms = ['M-6 -28 l-8 14 M6 -28 l8 14', 'M-6 -28 l-10 -10 M6 -28 l10 -10', 'M-6 -28 l-4 16 M6 -28 l12 -4'][pose % 3]
    return (f'<g transform="translate({x} {y}) scale({s})" stroke="{LINE}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'
            f'<path d="{arms}" stroke="{c}" stroke-width="5"/><path d="{arms}" fill="none" stroke-width="0"/>'
            f'<path d="M-7 -32 C-8 -18 -6 -10 -5 0 H5 C6 -10 8 -18 7 -32 C4 -36 -4 -36 -7 -32Z" fill="{c}"/>'
            f'<circle cx="0" cy="-40" r="6" fill="{c}"/></g>')

def blanket(x, y, w=110, h=26, c='#c8323c', c2='#f3e6d0'):
    t = f'<path d="M{x} {y} L{x+14} {y-h} L{x+w+14} {y-h} L{x+w} {y}Z" fill="{c}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>'
    t += ''.join(f'<path d="M{x+i} {y} L{x+i+14} {y-h}" stroke="{c2}" stroke-width="3"/>' for i in range(14, w, 22))
    return t

def basket(x, y):
    return (f'<g stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"><path d="M{x} {y-16} h30 l-4 16 h-22Z" fill="#c99a5b"/>'
            f'<path d="M{x+4} {y-16} q11 -16 22 0" fill="none" stroke-width="2"/><path d="M{x+3} {y-10} h24 M{x+5} {y-5} h20" stroke="#a87a42" stroke-width="1.2"/>'
            f'<ellipse cx="{x+10}" cy="{y-18}" rx="8" ry="4" fill="#e9c27a"/></g>')

def crumbs(x, y, seed=4, n=10):
    r = rnd(seed)
    return ''.join(f'<circle cx="{x+r.uniform(-20,20):.1f}" cy="{y+r.uniform(-4,4):.1f}" r="{r.uniform(1,2):.1f}" fill="#e9c27a" stroke="{LINE}" stroke-width=".6"/>' for _ in range(n))

def window(x, y, w, h, inner='', frame='#fff'):
    """окно с переплётом; inner — пейзаж за окном (рисуется с клипом)"""
    cid = f'w{x}{y}'
    return (f'<defs><clipPath id="{cid}"><rect x="{x}" y="{y}" width="{w}" height="{h}"/></clipPath></defs>'
            f'<g clip-path="url(#{cid})">{inner}</g>'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="none" stroke="{frame}" stroke-width="7"/>'
            f'<path d="M{x+w/2} {y} V{y+h} M{x} {y+h*.45} H{x+w}" stroke="{frame}" stroke-width="5"/>'
            f'<rect x="{x-4}" y="{y-4}" width="{w+8}" height="{h+8}" fill="none" stroke="{LINE}" stroke-width="2"/>'
            f'<rect x="{x-10}" y="{y+h+2}" width="{w+20}" height="7" rx="2" fill="#efe6d8" stroke="{LINE}" stroke-width="1.6"/>')

def clock(x, y, r=16, hh=10, mm=0):
    import math
    ah = math.radians((hh % 12) * 30 + mm * .5 - 90); am = math.radians(mm * 6 - 90)
    ticks = ''.join(f'<path d="M{x+math.cos(math.radians(k*30))*r*.8:.1f} {y+math.sin(math.radians(k*30))*r*.8:.1f} L{x+math.cos(math.radians(k*30))*r*.95:.1f} {y+math.sin(math.radians(k*30))*r*.95:.1f}" stroke="{LINE}" stroke-width="1.2"/>' for k in range(12))
    return (f'<circle cx="{x}" cy="{y}" r="{r}" fill="#fff" stroke="{LINE}" stroke-width="2.2"/>{ticks}'
            f'<path d="M{x} {y} L{x+math.cos(ah)*r*.5:.1f} {y+math.sin(ah)*r*.5:.1f}" stroke="{LINE}" stroke-width="2.2" stroke-linecap="round"/>'
            f'<path d="M{x} {y} L{x+math.cos(am)*r*.75:.1f} {y+math.sin(am)*r*.75:.1f}" stroke="{LINE}" stroke-width="1.6" stroke-linecap="round"/>')

def shelf(x, y, w, items=''):
    return f'<rect x="{x}" y="{y}" width="{w}" height="5" fill="#a8774a" stroke="{LINE}" stroke-width="1.6"/>{items}'

def jar(x, y, c='#e9b45f', h=18, lid='#c8323c'):
    return (f'<g stroke="{LINE}" stroke-width="1.4"><rect x="{x}" y="{y-h}" width="12" height="{h}" rx="3" fill="#eef3f4"/>'
            f'<rect x="{x+1.5}" y="{y-h*.7}" width="9" height="{h*.6}" rx="2" fill="{c}" stroke="none"/><rect x="{x-1}" y="{y-h-4}" width="14" height="4" rx="1" fill="{lid}"/></g>')

def plant(x, y, s=1):
    return (f'<g transform="translate({x} {y}) scale({s})" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round">'
            f'<path d="M0 -20 C-14 -34 -16 -50 -6 -58 C0 -46 2 -32 0 -20Z" fill="#6f9a76"/><path d="M2 -20 C10 -40 26 -46 32 -44 C28 -30 16 -22 4 -18Z" fill="#7fae86"/>'
            f'<path d="M-2 -18 C-14 -26 -28 -24 -32 -20 C-22 -12 -10 -12 0 -14Z" fill="#5f8a68"/><path d="M-12 -18 h26 l-4 18 h-18Z" fill="#d9825f"/></g>')

def cup(x, y, c='#9fc2b8', steam=True):
    st = f'<path d="M{x+3} {y-14} q3 -5 0 -10 M{x+9} {y-14} q3 -5 0 -10" stroke="#b9a58c" stroke-width="1.4" fill="none"/>' if steam else ''
    return (f'<g stroke="{LINE}" stroke-width="1.6"><path d="M{x-2} {y-12} h16 l-2 12 h-12Z" fill="{c}"/><path d="M{x+14} {y-9} q7 1 0 7" fill="none"/></g>{st}')

def tram(x, y, s=1):
    return (f'<g transform="translate({x} {y}) scale({s})" stroke="{LINE}" stroke-width="1.8" stroke-linejoin="round">'
            f'<rect x="0" y="-40" width="150" height="34" rx="6" fill="#2f6fb0"/><rect x="0" y="-16" width="150" height="6" fill="#e9eef3"/>'
            + ''.join(f'<rect x="{8+i*24}" y="-34" width="16" height="14" rx="2" fill="#d9e8f2"/>' for i in range(6)) +
            f'<path d="M60 -40 l10 -12 l10 12" fill="none"/><circle cx="25" cy="-4" r="5" fill="#33333c"/><circle cx="125" cy="-4" r="5" fill="#33333c"/></g>')

def facade(x, y, w, h, c, wc='#f6e7c4', rows=3, cols=3):
    t = f'<rect x="{x}" y="{y-h}" width="{w}" height="{h}" fill="{c}" stroke="{LINE}" stroke-width="1.6"/>'
    t += f'<rect x="{x-2}" y="{y-h-6}" width="{w+4}" height="6" fill="#ece3d4" stroke="{LINE}" stroke-width="1.4"/>'
    for i in range(cols):
        for j in range(rows):
            t += f'<rect x="{x+6+i*(w-12)/cols+2:.1f}" y="{y-h+10+j*(h-16)/rows:.1f}" width="{(w-12)/cols-6:.1f}" height="{(h-16)/rows-8:.1f}" fill="{wc}" stroke="{LINE}" stroke-width="1"/>'
    return t

def cheese(x, y, c='#e8c46a'):
    return f'<g stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"><path d="M{x} {y} h30 v-14 l-30 -6Z" fill="{c}"/><path d="M{x} {y-20} l30 6 l8 -4 l-30 -6Z" fill="#f2d68e"/><path d="M{x+30} {y} l8 -4 v-14" fill="#d9b459"/></g>'

def bread(x, y):
    return f'<g stroke="{LINE}" stroke-width="1.6"><path d="M{x} {y} v-14 q0 -8 10 -8 h4 q10 0 10 8 v14Z" fill="#e9c98f"/><path d="M{x+3} {y-2} v-11 q0 -5 7 -5 h4 q7 0 7 5 v11Z" fill="#f6e6c4" stroke="none"/></g>'

def magpie(x, y, s=1, flip=False):
    """skjære: melnbalta, gara aste; skatās pa labi"""
    sx = -s if flip else s
    return f"""<g transform="translate({x} {y}) scale({sx} {s})" stroke="{LINE}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
 <path d="M-4 -12 L-6 8 M-6 8 l-6 1 M-6 8 l5 1 M8 -12 L9 8 M9 8 l-6 1 M9 8 l5 1" stroke="#33333c" stroke-width="2.4" fill="none"/>
 <path d="M-30 -36 L-96 -60 L-92 -48 L-28 -26Z" fill="#26304a"/>
 <path d="M-34 -34 C-36 -58 -12 -68 12 -64 C26 -62 34 -54 36 -44 C38 -24 22 -12 0 -12 C-20 -12 -32 -22 -34 -34Z" fill="#fff"/>
 <path d="M-30 -44 C-10 -60 18 -58 30 -46 C16 -32 -12 -28 -40 -34Z" fill="#26304a"/>
 <path d="M-22 -44 C-10 -50 4 -50 14 -46" stroke="#5f7fb8" stroke-width="2" fill="none"/>
 <path d="M10 -64 C12 -84 26 -92 40 -90 C54 -88 58 -76 54 -64 C48 -54 30 -50 18 -54Z" fill="#26304a"/>
 <path d="M53 -78 L72 -74 L53 -70Z" fill="#26304a"/>
 <circle cx="43" cy="-78" r="2.6" fill="#fff" stroke="none"/>
</g>"""

def skier(x, y, s=1, c='#c8323c', c2='#2f55a0'):
    return (f'<g transform="translate({x} {y}) scale({s})" stroke="{LINE}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">'
            f'<path d="M-16 0 h34" stroke-width="2"/><path d="M-4 -2 l-4 -14 M4 -2 l2 -14" stroke="{c2}" stroke-width="4"/>'
            f'<path d="M-6 -16 C-8 -26 -4 -32 2 -32 C6 -30 6 -22 4 -16Z" fill="{c}"/><circle cx="1" cy="-37" r="4.5" fill="#f0d2b4"/>'
            f'<path d="M-3 -40 q4 -6 8 0" fill="{c}"/><path d="M-6 -24 l-10 22 M4 -24 l12 22" stroke="#555" stroke-width="1.2"/></g>')

def snowtree(x, y, h=40):
    return spruce_snow(x, y, h)

def spruce_snow(x, y, h=40, c='#4f7a64'):
    w = h * .38
    t = (f'<path d="M{x} {y-h} L{x+w*.6} {y-h*.55} L{x+w*.3} {y-h*.55} L{x+w} {y-h*.12} L{x+w*.4} {y-h*.12} L{x+w*.4} {y} L{x-w*.4} {y} '
         f'L{x-w*.4} {y-h*.12} L{x-w} {y-h*.12} L{x-w*.3} {y-h*.55} L{x-w*.6} {y-h*.55}Z" fill="{c}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
    t += f'<path d="M{x-w*.55} {y-h*.55} q{w*.3} -4 {w*.55} 0 q{w*.3} -4 {w*.55} 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>'
    t += f'<path d="M{x-w*.9} {y-h*.13} q{w*.45} -5 {w*.9} 0 q{w*.45} -5 {w*.9} 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>'
    return t + f'<path d="M{x-4} {y-h+6} L{x} {y-h} L{x+4} {y-h+6}" stroke="#fff" stroke-width="3" fill="none"/>'

def flag(x, y, h=50, s=1):
    return (f'<g transform="translate({x} {y}) scale({s})"><path d="M0 0 v-{h}" stroke="{LINE}" stroke-width="2"/>'
            f'<rect x="0" y="-{h}" width="26" height="18" fill="#c8323c" stroke="{LINE}" stroke-width="1.2"/>'
            f'<path d="M0 -{h-9} h26 M9 -{h} v18" stroke="#fff" stroke-width="5"/><path d="M0 -{h-9} h26 M9 -{h} v18" stroke="#1f3a68" stroke-width="2.4"/></g>')

def owl(x, y, s=1, flip=False):
    sx = -s if flip else s
    return f"""<g transform="translate({x} {y}) scale({sx} {s})" stroke="{LINE}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
 <path d="M-8 -2 l-4 8 M-8 -2 l0 9 M-8 -2 l4 8 M8 -2 l-4 8 M8 -2 l0 9 M8 -2 l4 8" stroke="#e1a85a" stroke-width="2.4"/>
 <path d="M-30 -40 C-32 -80 -20 -100 0 -100 C20 -100 32 -80 30 -40 C28 -10 16 0 0 0 C-16 0 -28 -10 -30 -40Z" fill="#9b7650"/>
 <path d="M-18 -50 C-18 -26 -10 -8 0 -8 C10 -8 18 -26 18 -50 C12 -56 -12 -56 -18 -50Z" fill="#e9d6b4"/>
 <path d="M-10 -44 l4 4 l4 -4 M2 -44 l4 4 l4 -4 M-8 -30 l4 4 l4 -4 M4 -30 l4 4 l4 -4 M-4 -18 l4 4 l4 -4" stroke="#b9956a" stroke-width="1.4" fill="none"/>
 <path d="M-22 -96 L-28 -112 L-12 -100Z M22 -96 L28 -112 L12 -100Z" fill="#7a5a3e"/>
 <circle cx="-12" cy="-78" r="11" fill="#f6efe0"/><circle cx="12" cy="-78" r="11" fill="#f6efe0"/>
 <circle cx="-12" cy="-78" r="6" fill="#f2b23d"/><circle cx="12" cy="-78" r="6" fill="#f2b23d"/>
 <circle cx="-11" cy="-78" r="3" fill="{LINE}" stroke="none"/><circle cx="13" cy="-78" r="3" fill="{LINE}" stroke="none"/>
 <path d="M-4 -70 L0 -60 L4 -70Z" fill="#e1a85a"/>
 <path d="M-30 -60 C-40 -40 -34 -18 -22 -8" fill="none"/><path d="M30 -60 C40 -40 34 -18 22 -8" fill="none"/>
 <path d="M-14 -66 h-8 M14 -66 h8" stroke-width="1.2"/>
 <circle cx="-12" cy="-78" r="13" fill="none" stroke-width="1.6"/><circle cx="12" cy="-78" r="13" fill="none" stroke-width="1.6"/><path d="M1 -78 h-2" stroke-width="1.6"/>
</g>"""

def candle(x, y, h=20, c='#f6efe0'):
    return (f'<g stroke="{LINE}" stroke-width="1.4"><rect x="{x-3}" y="{y-h}" width="6" height="{h}" fill="{c}"/>'
            f'<path d="M{x} {y-h-2} q4 -6 0 -12 q-4 6 0 12Z" fill="#f2b23d"/><path d="M{x-6} {y} h12" stroke-width="2"/></g>')

def fire(x, y, w=50):
    return (f'<g stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"><path d="M{x} {y} C{x-4} {y-24} {x+10} {y-30} {x+8} {y-46} C{x+22} {y-34} {x+28} {y-22} {x+26} {y-34} C{x+40} {y-20} {x+w} {y-10} {x+w} {y}Z" fill="#f2a33a"/>'
            f'<path d="M{x+12} {y} C{x+10} {y-14} {x+18} {y-18} {x+18} {y-26} C{x+28} {y-16} {x+34} {y-10} {x+36} {y}Z" fill="#f6d36b" stroke="none"/>'
            f'<path d="M{x-6} {y+2} h{w+12}" stroke="#7a5a3e" stroke-width="5"/></g>')

def logs(x, y, w, h, c='#c99a64', c2='#b7864f'):
    t = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{c}"/>'
    t += ''.join(f'<path d="M{x} {y+i} H{x+w}" stroke="{c2}" stroke-width="2"/>' for i in range(14, int(h), 16))
    return t

def rug(x, y, w=140, h=24, c='#c8323c'):
    return (f'<ellipse cx="{x}" cy="{y}" rx="{w/2}" ry="{h/2}" fill="{c}" stroke="{LINE}" stroke-width="1.6"/>'
            f'<ellipse cx="{x}" cy="{y}" rx="{w/2-12}" ry="{h/2-5}" fill="none" stroke="#f3e6d0" stroke-width="2" stroke-dasharray="6 4"/>')

def armchair(x, y, c='#2f6f8a'):
    return (f'<g stroke="{LINE}" stroke-width="2" stroke-linejoin="round"><path d="M{x} {y} v-60 q0 -14 14 -14 h44 q14 0 14 14 v60" fill="{c}"/>'
            f'<rect x="{x-8}" y="{y-34}" width="16" height="34" rx="6" fill="{c}"/><rect x="{x+64}" y="{y-34}" width="16" height="34" rx="6" fill="{c}"/>'
            f'<rect x="{x+6}" y="{y-26}" width="60" height="18" rx="4" fill="#e9d6b4"/><path d="M{x} {y} v8 M{x+72} {y} v8" stroke-width="3"/></g>')

def skis(x, y):
    return (f'<g stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"><path d="M{x} {y} l6 -110 l6 0 l-4 110Z" fill="#c8323c"/>'
            f'<path d="M{x+14} {y} l8 -108 l6 2 l-6 106Z" fill="#c8323c"/><path d="M{x+30} {y} l-2 -96 M{x+38} {y} l2 -96" stroke-width="2"/></g>')

def goat(x, y, s=1, flip=False, c='#f1ece2'):
    sx = -s if flip else s
    return f"""<g transform="translate({x} {y}) scale({sx} {s})" stroke="{LINE}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
 <ellipse cx="0" cy="6" rx="46" ry="6" fill="#000" opacity=".08" stroke="none"/>
 <path d="M-30 -30 L-32 4 M-18 -28 L-18 4 M18 -28 L20 4 M30 -30 L32 4" stroke-width="5"/>
 <path d="M-30 -30 L-32 4 M-18 -28 L-18 4 M18 -28 L20 4 M30 -30 L32 4" stroke="{c}" stroke-width="2.4"/>
 <path d="M-42 -46 C-44 -66 -20 -72 10 -70 C34 -68 42 -56 40 -40 C38 -26 20 -22 0 -22 C-24 -22 -40 -28 -42 -46Z" fill="{c}"/>
 <path d="M-42 -54 l-8 -6 l4 10Z" fill="{c}"/>
 <path d="M30 -64 C34 -80 44 -92 56 -92 C68 -92 72 -80 70 -70 C68 -60 60 -54 50 -56 C42 -58 36 -60 30 -60Z" fill="{c}"/>
 <path d="M52 -92 C48 -106 40 -112 32 -112 M60 -92 C60 -106 54 -114 46 -116" fill="none" stroke="#9b8a72" stroke-width="3"/>
 <path d="M48 -86 l-14 -4 l6 10Z" fill="{c}"/>
 <path d="M66 -60 C64 -48 60 -44 56 -40" fill="none" stroke-width="1.8"/><path d="M58 -56 l-4 18 l8 -6Z" fill="#d9cfbd"/>
 <circle cx="60" cy="-80" r="3" fill="{LINE}" stroke="none"/><path d="M68 -70 l2 2" />
 <path d="M-10 -60 C0 -64 10 -64 20 -60" stroke="#d9cfbd" stroke-width="1.6" fill="none"/>
</g>"""

def turfhouse(x, y, w=90, h=50, c='#8b5f37'):
    t = f'<rect x="{x}" y="{y-h}" width="{w}" height="{h}" fill="{c}" stroke="{LINE}" stroke-width="1.8"/>'
    t += ''.join(f'<path d="M{x} {y-h+i} H{x+w}" stroke="#6f4a2a" stroke-width="1.6"/>' for i in range(8, h, 9))
    t += f'<path d="M{x-8} {y-h} L{x+w/2} {y-h-h*.55} L{x+w+8} {y-h}Z" fill="#7aa36a" stroke="{LINE}" stroke-width="1.8" stroke-linejoin="round"/>'
    t += ''.join(f'<path d="M{x+i} {y-h-h*.1} l-2 -6 M{x+i} {y-h-h*.1} l3 -6" stroke="#5f8a52" stroke-width="1.4"/>' for i in range(10, w, 14))
    t += f'<rect x="{x+w*.12}" y="{y-h*.7}" width="{w*.2}" height="{h*.3}" fill="#f6e7c4" stroke="{LINE}" stroke-width="1.4"/><rect x="{x+w*.6}" y="{y-h*.6}" width="{w*.18}" height="{h*.6}" fill="#c8323c" stroke="{LINE}" stroke-width="1.4"/>'
    return t

def stabbur(x, y):
    t = turfhouse(x, y - 18, 56, 40, '#9b6a3e')
    t += ''.join(f'<path d="M{x+i} {y} v-18" stroke="{LINE}" stroke-width="5"/><path d="M{x+i} {y} v-18" stroke="#7a5a3e" stroke-width="3"/>' for i in (8, 28, 48))
    return t

def fence(x0, x1, y, h=22):
    t = ''.join(f'<path d="M{x} {y} l0 -{h}" stroke="{LINE}" stroke-width="4"/><path d="M{x} {y} l0 -{h}" stroke="#a87a42" stroke-width="2"/>' for x in range(x0, x1, 18))
    return t + f'<path d="M{x0} {y-h*.75} H{x1} M{x0} {y-h*.35} H{x1}" stroke="#a87a42" stroke-width="3"/><path d="M{x0} {y-h*.75} H{x1} M{x0} {y-h*.35} H{x1}" stroke="{LINE}" stroke-width=".8" opacity=".5"/>'

def brunost(x, y):
    return (f'<g stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"><path d="M{x} {y} h34 v-20 h-34Z" fill="#b8733a"/><path d="M{x} {y-20} l8 -6 h34 l-8 6Z" fill="#c98a4e"/>'
            f'<path d="M{x+34} {y} l8 -6 v-20 l-8 6Z" fill="#9c5f2e"/></g>')

def gable(x, y, w=50, h=80, c='#e8d9b8', roof='#3a3f55'):
    """бергенский дом с щипцом: y — низ"""
    t = f'<path d="M{x} {y} V{y-h} L{x+w/2} {y-h-w*.45} L{x+w} {y-h} V{y}Z" fill="{c}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>'
    t += f'<path d="M{x-3} {y-h+2} L{x+w/2} {y-h-w*.45-2} L{x+w+3} {y-h+2}" fill="none" stroke="{roof}" stroke-width="5" stroke-linejoin="round"/>'
    for j in range(int(h / 26)):
        for i in range(2):
            t += f'<rect x="{x+w*.16+i*w*.42:.1f}" y="{y-h+8+j*26:.1f}" width="{w*.26:.1f}" height="15" fill="#fbf6ea" stroke="{LINE}" stroke-width="1.2"/><path d="M{x+w*.29+i*w*.42:.1f} {y-h+8+j*26:.1f} v15" stroke="{LINE}" stroke-width=".8"/>'
    t += f'<rect x="{x+w*.3:.1f}" y="{y-h*.08-10:.1f}" width="{w*.4:.1f}" height="{h*.08+10:.1f}" fill="#fbf6ea" stroke="{LINE}" stroke-width="1"/>'
    return t

def person(x, y, s=1, coat='#c8323c', hair='#7a5a3e', flagged=False, skirt=None):
    t = f'<g transform="translate({x} {y}) scale({s})" stroke="{LINE}" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round">'
    t += f'<path d="M-4 -14 v14 M4 -14 v14" stroke-width="3"/>'
    if skirt:
        t += f'<path d="M-10 -12 L-6 -34 H6 L10 -12Z" fill="{skirt}"/>'
    t += f'<path d="M-7 -14 C-8 -26 -7 -34 0 -36 C7 -34 8 -26 7 -14Z" fill="{coat}"/>'
    t += f'<circle cx="0" cy="-42" r="6" fill="#f0d2b4"/><path d="M-6 -44 q6 -8 12 0 q-6 -3 -12 0Z" fill="{hair}"/>'
    if flagged:
        t += '<path d="M7 -30 L12 -58" stroke-width="1.4"/><rect x="10" y="-66" width="14" height="9" fill="#c8323c" stroke-width="1"/><path d="M10 -61.5 h14 M15 -66 v9" stroke="#fff" stroke-width="2.6"/><path d="M10 -61.5 h14 M15 -66 v9" stroke="#1f3a68" stroke-width="1.2"/>'
    return t + '</g>'

def balloon(x, y, c='#c8323c'):
    return f'<path d="M{x} {y} q-4 20 2 40" stroke="{LINE}" stroke-width="1" fill="none"/><ellipse cx="{x}" cy="{y-10}" rx="9" ry="11" fill="{c}" stroke="{LINE}" stroke-width="1.4"/><ellipse cx="{x-3}" cy="{y-14}" rx="2" ry="3" fill="#fff" opacity=".6"/>'

def bunting(x0, x1, y, sag=14):
    import math
    n = int((x1 - x0) / 16)
    t = f'<path d="M{x0} {y} Q{(x0+x1)/2} {y+sag*2} {x1} {y}" stroke="{LINE}" stroke-width="1.2" fill="none"/>'
    cols = ['#c8323c', '#fff', '#1f3a68']
    for i in range(n):
        tt = (i + .5) / n; xx = x0 + (x1 - x0) * tt; yy = y + sag * 2 * 2 * tt * (1 - tt)
        t += f'<path d="M{xx-5:.1f} {yy:.1f} h10 l-5 10Z" fill="{cols[i%3]}" stroke="{LINE}" stroke-width=".8"/>'
    return t
