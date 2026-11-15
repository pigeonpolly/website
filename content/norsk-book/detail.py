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

def fishstall(x, y, w=150):
    t = (f'<g stroke="{LINE}" stroke-width="1.8" stroke-linejoin="round"><rect x="{x}" y="{y-40}" width="{w}" height="40" fill="#e9eef1"/>'
         f'<path d="M{x-6} {y-70} h{w+12} l-10 18 h{-(w-8)}Z" fill="#c8323c"/>' + ''.join(f'<path d="M{x-6+i} {y-70} l10 18" stroke="#fff" stroke-width="5"/>' for i in range(14, w + 6, 28)) +
         f'<path d="M{x+4} {y-52} v12 M{x+w-4} {y-52} v12" stroke-width="3"/>'
         f'<rect x="{x+6}" y="{y-46}" width="{w-12}" height="10" fill="#dfe8ee"/></g>')
    fish = ''
    for i in range(int((w - 20) / 22)):
        fx = x + 14 + i * 22
        fish += f'<g stroke="{LINE}" stroke-width="1.2"><path d="M{fx} {y-41} q8 -6 16 0 q-8 6 -16 0Z M{fx+16} {y-41} l5 -4 v8Z" fill="{["#c9d2da", "#e9a07a", "#b8c4ce"][i%3]}"/><circle cx="{fx+3}" cy="{y-42}" r=".9" fill="{LINE}"/></g>'
    return t + fish

def bryggehus(x, y, w=40, h=96, c='#c8323c'):
    """Bryggen: augsts, šaurs koka nams ar stāvu jumtu un vertikāliem dēļiem"""
    t = f'<path d="M{x} {y} V{y-h} L{x+w/2} {y-h-w*.8} L{x+w} {y-h} V{y}Z" fill="{c}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>'
    t += ''.join(f'<path d="M{x+i} {y} V{y-h}" stroke="{LINE}" stroke-width=".5" opacity=".35"/>' for i in range(5, int(w), 6))
    t += f'<path d="M{x-3} {y-h+2} L{x+w/2} {y-h-w*.8-2} L{x+w+3} {y-h+2}" fill="none" stroke="#3a3f55" stroke-width="4"/>'
    for j in range(3):
        t += f'<rect x="{x+w*.3:.1f}" y="{y-h+10+j*24:.1f}" width="{w*.4:.1f}" height="13" fill="#fbf6ea" stroke="{LINE}" stroke-width="1.1"/>'
    t += f'<rect x="{x+w*.36:.1f}" y="{y-h-w*.45:.1f}" width="{w*.28:.1f}" height="10" fill="#fbf6ea" stroke="{LINE}" stroke-width="1.1"/>'
    return t

def sheep(x, y, s=1, flip=False):
    sx = -s if flip else s
    wool = ''.join(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#f6f2ea" stroke="{LINE}" stroke-width="1.8"/>' for cx, cy, r in [(-26, -40, 14), (-10, -50, 15), (8, -50, 15), (24, -40, 14), (-16, -28, 14), (6, -26, 15), (22, -26, 12)])
    wool += ''.join(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#f6f2ea"/>' for cx, cy, r in [(-26, -40, 13), (-10, -50, 14), (8, -50, 14), (24, -40, 13), (-16, -28, 13), (6, -26, 14), (22, -26, 11), (0, -38, 16)])
    return f"""<g transform="translate({x} {y}) scale({sx} {s})" stroke="{LINE}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
 <path d="M-18 -16 v20 M-6 -14 v20 M8 -14 v20 M20 -16 v20" stroke="#33333c" stroke-width="4"/>
 {wool}
 <path d="M30 -54 C30 -66 40 -72 48 -70 C56 -68 60 -58 58 -48 C56 -40 48 -36 40 -38 C34 -40 30 -46 30 -54Z" fill="#3a3a40"/>
 <path d="M32 -64 l-10 -4 l6 8Z" fill="#3a3a40"/><circle cx="48" cy="-58" r="2.6" fill="#fff" stroke="none"/><circle cx="49" cy="-58" r="1.3" fill="{LINE}" stroke="none"/>
</g>"""

def waterfall(x, y0, y1, w=40):
    t = f'<path d="M{x} {y0} C{x-6} {(y0+y1)/2} {x-4} {y1-20} {x-10} {y1} H{x+w+10} C{x+w+4} {y1-20} {x+w+6} {(y0+y1)/2} {x+w} {y0}Z" fill="#e8f2f8" stroke="{LINE}" stroke-width="1.6"/>'
    t += ''.join(f'<path d="M{x+i} {y0+4} C{x+i-3} {(y0+y1)/2} {x+i-2} {y1-16} {x+i-5} {y1-2}" stroke="#a9c7d8" stroke-width="1.6" fill="none"/>' for i in range(6, w, 8))
    t += ''.join(f'<circle cx="{x-10+i*12}" cy="{y1+2}" r="7" fill="#fff" stroke="#c9dbe6" stroke-width="1.2"/>' for i in range(int(w / 10) + 3))
    return t

def train(x, y, n=3, c='#3f6e4f', s=1):
    t = f'<g transform="translate({x} {y}) scale({s})" stroke="{LINE}" stroke-width="1.8" stroke-linejoin="round">'
    for k in range(n):
        ox = k * 108
        t += f'<rect x="{ox}" y="-50" width="100" height="44" rx="6" fill="{c}"/><rect x="{ox}" y="-18" width="100" height="5" fill="#e9eef3"/>'
        t += ''.join(f'<rect x="{ox+8+i*23}" y="-42" width="17" height="16" rx="2" fill="#d9e8f2"/>' for i in range(4))
        t += f'<circle cx="{ox+20}" cy="-4" r="5" fill="#33333c"/><circle cx="{ox+80}" cy="-4" r="5" fill="#33333c"/>'
        if k: t += f'<path d="M{ox-8} -24 h8" stroke-width="3"/>'
    return t + '</g>'

def cormorant(x, y, s=1, flip=False, hat=False):
    sx = -s if flip else s
    h = ('<path d="M24 -108 c-8 -14 4 -24 14 -18 c4 -10 18 -8 18 2 c10 -2 14 10 6 16 v10 h-34Z" fill="#fff"/><path d="M26 -98 h32" />' if hat else '')
    return f"""<g transform="translate({x} {y}) scale({sx} {s})" stroke="{LINE}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
 <path d="M-6 -10 L-8 6 M-8 6 l-8 2 M-8 6 l6 2 M8 -10 L9 6 M9 6 l-8 2 M9 6 l6 2" stroke="#33333c" stroke-width="3" fill="none"/>
 <path d="M-30 -30 L-52 -6 L-40 -4 L-24 -20Z" fill="#26282f"/>
 <path d="M-28 -40 C-30 -64 -10 -72 10 -66 C24 -62 30 -48 28 -34 C26 -18 12 -8 -4 -8 C-18 -8 -26 -20 -28 -40Z" fill="#33363f"/>
 <path d="M-20 -48 C-6 -58 10 -56 20 -46" stroke="#5a6a5a" stroke-width="2" fill="none"/>
 <path d="M14 -64 C18 -84 22 -96 30 -100 C40 -104 50 -98 50 -90 C50 -82 40 -80 34 -78 C30 -70 26 -64 24 -58Z" fill="#33363f"/>
 <path d="M48 -92 L72 -88 q4 2 0 6 l-4 -2 L48 -86Z" fill="#9b8a72"/>
 <circle cx="40" cy="-92" r="3" fill="#2bb3a0" stroke="none"/><circle cx="40.5" cy="-92" r="1.3" fill="{LINE}" stroke="none"/>
 {h}
</g>"""

def lifebuoy(x, y, r=16):
    return (f'<circle cx="{x}" cy="{y}" r="{r}" fill="#fff" stroke="{LINE}" stroke-width="1.8"/><circle cx="{x}" cy="{y}" r="{r*.5}" fill="#c9d6e0" stroke="{LINE}" stroke-width="1.6"/>'
            + ''.join(f'<path d="M{x+r*.55*__import__("math").cos(a)} {y+r*.55*__import__("math").sin(a)} L{x+r*__import__("math").cos(a)} {y+r*__import__("math").sin(a)}" stroke="#c8323c" stroke-width="7"/>' for a in (0.4, 2.0, 3.6, 5.2)))

def lighthouse(x, y, h=60):
    return (f'<g stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"><path d="M{x-8} {y} L{x-5} {y-h} H{x+5} L{x+8} {y}Z" fill="#fff"/>'
            f'<path d="M{x-7} {y-h*.3} H{x+7} L{x+6.5} {y-h*.5} H{x-6.5}Z M{x-5.5} {y-h*.75} H{x+5.5} L{x+5} {y-h*.9} H{x-5}Z" fill="#c8323c"/>'
            f'<rect x="{x-6}" y="{y-h-10}" width="12" height="10" fill="#f6d36b"/><path d="M{x-8} {y-h-10} L{x} {y-h-18} L{x+8} {y-h-10}Z" fill="#c8323c"/></g>')

def jugend(x, y, w=70, h=110, c='#f2d68e', tower=False, roof='#5f8a8a'):
    t = f'<rect x="{x}" y="{y-h}" width="{w}" height="{h}" fill="{c}" stroke="{LINE}" stroke-width="1.6"/>'
    t += f'<path d="M{x-3} {y-h} h{w+6} v-6 q{-(w+6)/2} -16 {-(w+6)} 0Z" fill="{roof}" stroke="{LINE}" stroke-width="1.6"/>'
    for j in range(int((h - 20) / 30)):
        for i in range(3):
            wx = x + 8 + i * (w - 16) / 3; wy = y - h + 14 + j * 30
            t += f'<path d="M{wx:.1f} {wy+18:.1f} v-12 q{(w-16)/6-2:.1f} -8 {(w-16)/3-4:.1f} 0 v12Z" fill="#fbf6ea" stroke="{LINE}" stroke-width="1.1"/>'
    t += f'<path d="M{x} {y-h+8} h{w}" stroke="#fff" stroke-width="2" opacity=".6"/>'
    if tower:
        tx = x + w - 10
        t += f'<rect x="{tx-10}" y="{y-h-30}" width="20" height="30" fill="{c}" stroke="{LINE}" stroke-width="1.6"/><path d="M{tx-13} {y-h-30} L{tx} {y-h-58} L{tx+13} {y-h-30}Z" fill="{roof}" stroke="{LINE}" stroke-width="1.6"/>'
        t += f'<rect x="{tx-4}" y="{y-h-24}" width="8" height="12" rx="4" fill="#fbf6ea" stroke="{LINE}" stroke-width="1"/>'
    return t

def sweater(x, y, c='#c8323c', s=1, pattern=True):
    t = (f'<g transform="translate({x} {y}) scale({s})" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round">'
         f'<path d="M-14 -40 L-30 -32 L-36 -8 L-26 -6 L-22 -22 L-22 0 H22 L22 -22 L26 -6 L36 -8 L30 -32 L14 -40 Q0 -32 -14 -40Z" fill="{c}"/>')
    if pattern:
        t += '<path d="M-22 -26 H22" stroke="#fff" stroke-width="5"/><path d="M-20 -26 l4 -3 l4 3 l4 -3 l4 3 l4 -3 l4 3 l4 -3 l4 3 l4 -3" stroke="#1f2442" stroke-width="1.2" fill="none"/>'
        t += ''.join(f'<circle cx="{-16+i*8}" cy="{-12+(i%2)*6}" r="1.2" fill="#fff" stroke="none"/>' for i in range(5))
    return t + '</g>'

def troll(x, y, s=1, flip=False):
    sx = -s if flip else s
    return f"""<g transform="translate({x} {y}) scale({sx} {s})" stroke="{LINE}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
 <ellipse cx="0" cy="6" rx="44" ry="6" fill="#000" opacity=".08" stroke="none"/>
 <path d="M-16 -10 l-4 14 h14 Z M10 -10 l2 14 h14Z" fill="#8b7a62"/>
 <path d="M-34 -30 C-50 -10 -60 0 -70 -6 C-64 -12 -56 -20 -48 -34" fill="none" stroke-width="4"/><circle cx="-72" cy="-8" r="6" fill="#6f8a5a"/>
 <path d="M-30 -60 C-34 -100 -14 -120 6 -120 C30 -120 40 -96 36 -60 C34 -24 22 -6 0 -6 C-20 -6 -28 -24 -30 -60Z" fill="#a39a7e"/>
 <path d="M-22 -50 C-20 -30 -10 -18 4 -18 C18 -18 26 -34 24 -54" fill="#7e9a5f"/>
 <path d="M-26 -112 C-36 -126 -20 -140 -6 -132 C0 -146 22 -144 24 -130 C40 -132 44 -114 32 -108Z" fill="#6f8a5a"/>
 <path d="M4 -140 v-22 M4 -154 l-10 -8 M4 -150 l10 -10" stroke="#7a5a3e" stroke-width="3"/><circle cx="-6" cy="-164" r="6" fill="#6a9566"/><circle cx="14" cy="-162" r="7" fill="#6a9566"/>
 <path d="M16 -96 C40 -96 50 -80 42 -72 C34 -66 22 -74 16 -82Z" fill="#b5ab8e"/>
 <circle cx="-4" cy="-98" r="5" fill="#fff"/><circle cx="12" cy="-100" r="5" fill="#fff"/><circle cx="-3" cy="-98" r="2.4" fill="{LINE}" stroke="none"/><circle cx="13" cy="-100" r="2.4" fill="{LINE}" stroke="none"/>
 <path d="M-6 -70 q12 8 22 0" fill="none"/><path d="M-2 -70 v4 M10 -70 v4" stroke-width="1.6"/>
 <path d="M30 -64 C46 -70 52 -84 56 -96" fill="none" stroke-width="4"/>
</g>"""

def raincloud(x, y, s=1):
    return (f'<g transform="translate({x} {y}) scale({s})"><g fill="#c3ccd6" stroke="{LINE}" stroke-width="1.4"><ellipse cx="0" cy="0" rx="40" ry="14"/><ellipse cx="-14" cy="-10" rx="18" ry="12"/><ellipse cx="12" cy="-12" rx="22" ry="15"/></g>'
            f'<ellipse cx="0" cy="0" rx="38" ry="12" fill="#c3ccd6"/>' + ''.join(f'<path d="M{dx} {14+dy} l-4 10" stroke="#6f9cc0" stroke-width="2" stroke-linecap="round"/>' for dx, dy in [(-24, 0), (-12, 6), (0, 0), (12, 6), (24, 0), (-18, 18), (6, 18)]) + '</g>')

def sun(x, y, r=18):
    import math
    rays = ''.join(f'<path d="M{x+math.cos(a)*(r+4):.1f} {y+math.sin(a)*(r+4):.1f} L{x+math.cos(a)*(r+12):.1f} {y+math.sin(a)*(r+12):.1f}" stroke="#e9a73a" stroke-width="3" stroke-linecap="round"/>' for a in [k*math.pi/4 for k in range(8)])
    return rays + f'<circle cx="{x}" cy="{y}" r="{r}" fill="#f6d36b" stroke="{LINE}" stroke-width="1.6"/>'

def muskox(x, y, s=1, flip=False):
    sx = -s if flip else s
    hair = ''.join(f'<path d="M{-40+i*7} -24 q-2 14 1 26" stroke="#3a2a20" stroke-width="1.4" fill="none"/>' for i in range(12))
    return f"""<g transform="translate({x} {y}) scale({sx} {s})" stroke="{LINE}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
 <ellipse cx="0" cy="4" rx="50" ry="5" fill="#000" opacity=".08" stroke="none"/>
 <path d="M-30 0 v-10 M-14 0 v-10 M16 0 v-10 M30 0 v-10" stroke="#d9cfbd" stroke-width="5"/>
 <path d="M-46 -20 C-50 -50 -30 -66 0 -66 C24 -66 40 -56 44 -40 C48 -20 40 -6 30 -2 L-40 -2 C-46 -6 -46 -14 -46 -20Z" fill="#5b4330"/>
 <path d="M-20 -60 C-10 -70 10 -70 20 -62 C10 -58 -10 -58 -20 -60Z" fill="#a08a6e"/>
 {hair}
 <path d="M36 -44 C46 -50 60 -48 64 -36 C66 -26 60 -18 52 -18 C44 -18 38 -26 36 -34Z" fill="#4a3526"/>
 <path d="M40 -50 C30 -56 30 -40 40 -38 M56 -50 C66 -56 68 -40 58 -38" fill="none" stroke="#e9e1d0" stroke-width="5"/>
 <path d="M40 -50 C30 -56 30 -40 40 -38 M56 -50 C66 -56 68 -40 58 -38" fill="none" stroke="{LINE}" stroke-width="1"/>
 <path d="M56 -24 q4 3 8 0" fill="#d9cfbd"/><circle cx="54" cy="-34" r="2" fill="#fff" stroke="none"/>
</g>"""

def reindeer(x, y, s=1, flip=False, pack=False):
    sx = -s if flip else s
    p = '<rect x="-20" y="-62" width="22" height="20" rx="4" fill="#c8323c"/><path d="M-16 -58 h14" stroke="#fff" stroke-width="1.6"/>' if pack else ''
    return f"""<g transform="translate({x} {y}) scale({sx} {s})" stroke="{LINE}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
 <ellipse cx="0" cy="4" rx="40" ry="5" fill="#000" opacity=".08" stroke="none"/>
 <path d="M-24 -30 L-28 2 M-12 -28 L-12 2 M14 -28 L16 2 M26 -30 L30 2" stroke="#7a5a3e" stroke-width="4"/>
 <path d="M-34 -40 C-36 -58 -14 -62 10 -60 C30 -58 38 -48 36 -36 C34 -24 18 -22 0 -22 C-22 -22 -32 -28 -34 -40Z" fill="#b39274"/>
 <path d="M-30 -36 C-14 -30 14 -30 32 -36 C30 -26 16 -22 0 -22 C-18 -22 -28 -28 -30 -36Z" fill="#efe6d6" stroke="none"/>
 {p}
 <path d="M28 -54 C30 -70 38 -80 48 -80 C56 -80 60 -72 58 -64 C56 -56 48 -54 42 -50 C38 -46 34 -44 30 -44Z" fill="#b39274"/>
 <path d="M44 -80 C40 -96 30 -104 22 -104 M38 -94 l-8 -2 M50 -80 C54 -98 64 -104 72 -104 M58 -96 l8 -6 M46 -86 l4 -8" fill="none" stroke="#8b6a4e" stroke-width="3"/>
 <circle cx="58" cy="-62" r="3" fill="{LINE}" stroke="none"/><circle cx="48" cy="-70" r="2.4" fill="{LINE}" stroke="none"/>
 <path d="M40 -76 l-8 -6 l2 8Z" fill="#b39274"/>
</g>"""

def rock(x, y, w=60, h=30, c='#a9a49a'):
    return (f'<path d="M{x} {y} C{x} {y-h*.7} {x+w*.2} {y-h} {x+w*.5} {y-h} C{x+w*.8} {y-h} {x+w} {y-h*.6} {x+w} {y}Z" fill="{c}" stroke="{LINE}" stroke-width="1.6"/>'
            f'<path d="M{x+w*.3} {y-h*.7} q{w*.1} -4 {w*.25} -2" stroke="#c9c4ba" stroke-width="2" fill="none"/>')

def binoculars(x, y):
    return f'<g stroke="{LINE}" stroke-width="1.6"><rect x="{x}" y="{y}" width="9" height="14" rx="3" fill="#33333c"/><rect x="{x+11}" y="{y}" width="9" height="14" rx="3" fill="#33333c"/><path d="M{x+9} {y+5} h2"/></g>'

def cathedral(x, y, s=1):
    t = f'<g transform="translate({x} {y}) scale({s})" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round">'
    t += '<rect x="-90" y="-60" width="180" height="60" fill="#9fa9a6"/><path d="M-90 -60 L0 -90 L90 -60Z" fill="#5f7f78"/>'
    t += '<rect x="-30" y="-110" width="60" height="110" fill="#aab3b0"/><path d="M-30 -110 L0 -150 L30 -110Z" fill="#5f7f78"/>'
    t += '<path d="M-6 -150 L0 -190 L6 -150Z" fill="#5f7f78"/>'
    t += '<circle cx="0" cy="-74" r="14" fill="#cfd8e0"/><path d="M0 -88 v28 M-14 -74 h28 M-10 -84 l20 20 M10 -84 l-20 20" stroke-width="1"/>'
    t += ''.join(f'<path d="M{x0} -8 v-26 q6 -10 12 0 v26Z" fill="#cfd8e0"/>' for x0 in (-80, -60, 48, 68))
    t += '<path d="M-10 0 v-30 q10 -14 20 0 v30Z" fill="#6a5a4a"/>'
    return t + '</g>'

def bybro(x, y, w=260):
    t = f'<path d="M{x} {y} Q{x+w/2} {y-30} {x+w} {y}" stroke="{LINE}" stroke-width="16" fill="none"/><path d="M{x} {y} Q{x+w/2} {y-30} {x+w} {y}" stroke="#c8323c" stroke-width="12" fill="none"/>'
    t += ''.join(f'<path d="M{x+i} {y-30*4*(i/w)*(1-i/w)-6} v-18" stroke="{LINE}" stroke-width="3"/>' for i in range(10, w, 20))
    t += f'<path d="M{x} {y-24} Q{x+w/2} {y-54} {x+w} {y-24}" stroke="{LINE}" stroke-width="3" fill="none"/>'
    t += ''.join(f'<path d="M{x+i} {y} v40" stroke="{LINE}" stroke-width="6"/><path d="M{x+i} {y} v40" stroke="#7a5a3e" stroke-width="4"/>' for i in (30, w / 2, w - 30))
    return t

def stilthouse(x, y, w=44, h=46, c='#e1a85a'):
    t = ''.join(f'<path d="M{x+i} {y} v24" stroke="{LINE}" stroke-width="4"/><path d="M{x+i} {y} v24" stroke="#7a5a3e" stroke-width="2.4"/>' for i in (4, w / 2, w - 4))
    return t + gable(x, y, w, h, c)


def raven(x, y, s=1, flip=False):
    """krauklis — melns, ar lielu knābi"""
    return crowc(x, y, s, flip, '#26282f')

def crowc(x, y, s=1, flip=False, body='#26282f'):
    from art import LINE as L
    sx = -s if flip else s
    return f"""<g transform="translate({x} {y}) scale({sx} {s})" stroke="{L}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
 <path d="M-6 -12 L-8 8 M-8 8 l-7 1 M-8 8 l6 1 M8 -12 L9 8 M9 8 l-7 1 M9 8 l6 1" stroke="#33333c" stroke-width="2.6" fill="none"/>
 <path d="M-34 -40 L-64 -26 L-56 -16 L-30 -24Z" fill="{body}"/>
 <path d="M-36 -36 C-38 -60 -14 -70 10 -66 C24 -64 34 -58 38 -48 C40 -26 24 -12 0 -12 C-22 -12 -34 -22 -36 -36Z" fill="{body}"/>
 <path d="M-26 -48 C-10 -58 12 -56 24 -46" stroke="#4a5068" stroke-width="2" fill="none"/>
 <path d="M10 -66 C14 -84 28 -94 42 -92 C56 -90 62 -78 58 -66 C52 -54 34 -50 20 -54Z" fill="{body}"/>
 <path d="M56 -82 C66 -82 80 -78 84 -72 C78 -70 66 -68 56 -68Z" fill="#33363f"/>
 <circle cx="46" cy="-80" r="3.4" fill="#fff" stroke-width="1.2"/><circle cx="47" cy="-80" r="1.8" fill="{L}" stroke="none"/>
 <path d="M14 -60 l4 6 l4 -6 l4 6" stroke="#4a5068" stroke-width="1.4" fill="none"/>
</g>"""

def whirl(x, y, r=30):
    return (f'<ellipse cx="{x}" cy="{y}" rx="{r}" ry="{r*.35}" fill="#5f8fae" stroke="#1f2442" stroke-width="1.4"/>'
            f'<path d="M{x-r*.8} {y} C{x-r*.6} {y-r*.3} {x+r*.6} {y-r*.3} {x+r*.6} {y} C{x+r*.6} {y+r*.2} {x-r*.3} {y+r*.2} {x-r*.3} {y} C{x-r*.3} {y-r*.1} {x+r*.2} {y-r*.12} {x+r*.15} {y}" stroke="#d6e8f2" stroke-width="2" fill="none"/>')

def eagle(x, y, s=1):
    return (f'<g transform="translate({x} {y}) scale({s})" stroke="#1f2442" stroke-width="1.6" stroke-linejoin="round">'
            f'<path d="M-60 -6 C-40 -20 -20 -16 -6 -8 C6 -16 30 -22 60 -8 C40 -6 20 -2 8 2 L0 10 L-8 2 C-24 -2 -44 -2 -60 -6Z" fill="#6a4e36"/>'
            f'<path d="M-6 -8 C-4 -16 6 -16 8 -8Z" fill="#f6efe0"/><path d="M-6 6 l6 10 l6 -10Z" fill="#f6efe0"/></g>')

def puffin(x, y, s=1, flip=False):
    sx = -s if flip else s
    return f"""<g transform="translate({x} {y}) scale({sx} {s})" stroke="{LINE}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
 <ellipse cx="0" cy="8" rx="30" ry="5" fill="#000" opacity=".08" stroke="none"/>
 <path d="M-8 -2 l-4 10 h12Z M8 -2 l0 10 h12Z" fill="#f08a3c"/>
 <path d="M-26 -40 C-30 -76 -12 -96 6 -96 C26 -96 34 -76 32 -44 C30 -14 18 0 2 0 C-14 0 -24 -14 -26 -40Z" fill="#26282f"/>
 <path d="M-16 -50 C-18 -30 -10 -8 2 -8 C16 -8 22 -28 20 -50 C12 -56 -8 -56 -16 -50Z" fill="#fbf8f1"/>
 <path d="M-12 -92 C-22 -84 -22 -66 -12 -60 C0 -54 18 -58 22 -70 C24 -82 16 -92 6 -94Z" fill="#f2efe6"/>
 <path d="M18 -82 C30 -84 38 -78 40 -70 C38 -62 30 -60 18 -64Z" fill="#e8562f"/><path d="M20 -74 C26 -76 32 -74 36 -71" stroke="#f6c445" stroke-width="2" fill="none"/>
 <path d="M18 -82 v18" stroke="#9aa0a8" stroke-width="3"/>
 <circle cx="6" cy="-78" r="3" fill="{LINE}" stroke="none"/><path d="M0 -84 l4 2 M8 -72 l6 4" stroke="#c8323c" stroke-width="1.4"/>
 <path d="M24 -40 C30 -30 28 -18 20 -10" fill="none"/>
</g>"""

def hjell(x, y, w=140, h=60):
    t = f'<g stroke="{LINE}" stroke-width="2.4"><path d="M{x} {y} L{x+10} {y-h} M{x+w} {y} L{x+w-10} {y-h} M{x+w/2} {y} V{y-h}" stroke="#7a5a3e"/>'
    t += f'<path d="M{x+6} {y-h} H{x+w-6} M{x+8} {y-h*.55} H{x+w-8}" stroke="#7a5a3e"/></g>'
    for row, yy in ((0, y - h), (1, y - h * .55)):
        for i in range(int((w - 20) / 10)):
            fx = x + 12 + i * 10
            t += f'<path d="M{fx} {yy+2} q-4 14 0 26 l3 4 l3 -4 q4 -12 0 -26Z" fill="#cdb796" stroke="{LINE}" stroke-width=".9"/>'
    return t

def rorbu(x, y, w=60, h=34):
    from art import house
    t = ''.join(f'<path d="M{x+i} {y} v22" stroke="{LINE}" stroke-width="4"/><path d="M{x+i} {y} v22" stroke="#7a5a3e" stroke-width="2.4"/>' for i in (4, w / 2, w - 4))
    return t + house(x, y, w, h, '#b8322f', '#3a3f55')

def eider(x, y, s=1, flip=False):
    sx = -s if flip else s
    return f"""<g transform="translate({x} {y}) scale({sx} {s})" stroke="{LINE}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
 <path d="M-6 -8 l-6 8 h12Z M8 -8 l0 8 h12Z" fill="#7a7a70"/>
 <path d="M-34 -30 C-36 -54 -10 -60 14 -56 C32 -52 40 -42 36 -28 C32 -12 16 -8 -2 -8 C-22 -8 -32 -16 -34 -30Z" fill="#9b7650"/>
 <path d="M-24 -40 C-10 -50 10 -48 22 -40" stroke="#7a5a3e" stroke-width="2" fill="none"/>
 <path d="M14 -56 C16 -74 28 -82 40 -80 C52 -78 56 -66 50 -56 C44 -48 30 -46 22 -48Z" fill="#a8835c"/>
 <path d="M50 -70 C60 -70 70 -66 72 -60 C64 -58 56 -58 50 -60Z" fill="#7d8a7a"/>
 <circle cx="40" cy="-68" r="2.6" fill="{LINE}" stroke="none"/>
 <path d="M26 -84 c4 -8 18 -8 20 0" fill="#fff"/><path d="M34 -90 v-6 M30 -93 h8" stroke="#c8323c" stroke-width="2"/>
</g>"""

def husky(x, y, s=1, flip=False):
    sx = -s if flip else s
    return f"""<g transform="translate({x} {y}) scale({sx} {s})" stroke="{LINE}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
 <path d="M-26 -22 L-30 2 M-14 -20 L-14 2 M16 -20 L18 2 M28 -22 L32 2" stroke="#7d8697" stroke-width="5"/>
 <path d="M-26 -22 L-30 2 M-14 -20 L-14 2 M16 -20 L18 2 M28 -22 L32 2" stroke="#e8ebef" stroke-width="2.4"/>
 <path d="M-38 -38 C-50 -50 -54 -66 -44 -70 C-40 -60 -34 -52 -30 -44" fill="#7d8697"/>
 <path d="M-36 -30 C-38 -48 -18 -54 8 -52 C28 -50 38 -42 36 -28 C34 -16 18 -14 0 -14 C-22 -14 -34 -18 -36 -30Z" fill="#7d8697"/>
 <path d="M-30 -26 C-14 -20 14 -20 32 -26 C30 -16 16 -14 0 -14 C-18 -14 -28 -18 -30 -26Z" fill="#f1f3f5" stroke="none"/>
 <path d="M26 -48 C28 -62 38 -70 50 -68 C60 -66 66 -58 64 -50 L72 -46 C70 -40 62 -38 56 -40 C48 -36 36 -38 30 -40Z" fill="#7d8697"/>
 <path d="M46 -56 C52 -58 60 -54 64 -50 L72 -46 C70 -40 62 -38 56 -40 C50 -38 44 -44 46 -56Z" fill="#f1f3f5"/>
 <path d="M34 -64 L32 -80 L44 -68Z M48 -68 L52 -84 L58 -66Z" fill="#7d8697"/>
 <circle cx="72" cy="-46" r="2.6" fill="{LINE}" stroke="none"/><circle cx="50" cy="-58" r="2.6" fill="#7fb6e8" stroke="{LINE}" stroke-width="1"/>
 <path d="M28 -44 C24 -36 22 -30 24 -24" stroke="#c8323c" stroke-width="4" fill="none"/>
</g>"""

def aurora(w=600):
    t = '<defs><linearGradient id="aur" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ef0b8" stop-opacity="0"/><stop offset=".5" stop-color="#7ef0b8" stop-opacity=".75"/><stop offset="1" stop-color="#b48cf0" stop-opacity=".1"/></linearGradient></defs>'
    t += '<path d="M0 90 C80 40 160 120 260 70 C360 20 440 110 600 50 L600 130 C440 190 360 100 260 150 C160 200 80 120 0 170Z" fill="url(#aur)"/>'
    t += '<path d="M60 60 C140 20 220 90 320 40 C400 10 480 70 560 30 L560 70 C480 110 400 50 320 90 C220 140 140 70 60 110Z" fill="url(#aur)" opacity=".7"/>'
    return t

def stars(seed=5, n=40, w=600, h=150):
    import random
    random.seed(seed)
    return ''.join(f'<circle cx="{random.uniform(0,w):.1f}" cy="{random.uniform(0,h):.1f}" r="{random.uniform(.6,1.6):.1f}" fill="#fff" opacity="{random.uniform(.5,1):.2f}"/>' for _ in range(n))

def sled(x, y, s=1):
    return (f'<g transform="translate({x} {y}) scale({s})" stroke="{LINE}" stroke-width="2" stroke-linejoin="round">'
            f'<path d="M-60 0 H40 q16 0 16 -14" fill="none" stroke-width="3"/><path d="M-50 -2 v-30 M30 -2 v-30" stroke-width="3"/>'
            f'<path d="M-54 -32 H34 v-10 H-54Z" fill="#a8774a"/><path d="M-58 -42 v-40 h10 v40" fill="#a8774a"/></g>')

def arcticcathedral(x, y, s=1):
    t = f'<g transform="translate({x} {y}) scale({s})" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round">'
    for i, (w, h) in enumerate([(100, 120), (84, 100), (68, 80), (52, 60)]):
        t += f'<path d="M{-w/2+i*6} 0 L{i*6} {-h} L{w/2+i*6} 0Z" fill="{["#eef2f6", "#e2e8ee", "#d6dde5", "#cad3dc"][i]}"/>'
    t += '<path d="M-10 0 v-20 h20 v20Z" fill="#f6d36b"/><path d="M0 -60 l-8 30 h16Z" fill="#f6d36b" opacity=".8"/>'
    return t + '</g>'

def ptarmigan(x, y, s=1, flip=False):
    sx = -s if flip else s
    return f"""<g transform="translate({x} {y}) scale({sx} {s})" stroke="{LINE}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
 <ellipse cx="0" cy="6" rx="30" ry="5" fill="#000" opacity=".08" stroke="none"/>
 <path d="M-10 -6 c-4 8 -8 10 -12 12 h14Z M8 -6 c0 8 2 10 6 12 h-12Z" fill="#fbf8f1"/>
 <path d="M-30 -24 L-46 -30 L-42 -18Z" fill="#33363f"/>
 <path d="M-32 -26 C-34 -48 -10 -56 12 -52 C28 -48 36 -38 34 -24 C32 -10 16 -4 -2 -4 C-20 -4 -30 -12 -32 -26Z" fill="#fbf8f1"/>
 <path d="M-22 -40 C-8 -48 10 -46 22 -40 C14 -30 -8 -28 -26 -32Z" fill="#a8835c"/>
 <path d="M-16 -42 l6 4 M-4 -44 l6 4 M8 -44 l5 4" stroke="#7a5a3e" stroke-width="1.4"/>
 <path d="M12 -52 C14 -66 24 -74 34 -72 C44 -70 48 -60 44 -52 C40 -46 30 -44 22 -46Z" fill="#a8835c"/>
 <path d="M44 -62 L54 -58 L44 -55Z" fill="#33363f"/>
 <path d="M28 -70 q6 -6 12 0" fill="#d8453c" stroke-width="1.4"/><circle cx="34" cy="-62" r="2.4" fill="{LINE}" stroke="none"/>
</g>"""

def carving(x, y, kind='rein', s=1, c='#b8432f'):
    shapes = {
        'rein': 'M-20 0 l4 -14 h26 l4 14 M-16 -14 l-2 14 M6 -14 l2 14 M10 -14 l8 -8 l2 -8 M18 -22 l-6 -6 M20 -24 l6 -6 M-16 -14 l-6 -6',
        'boat': 'M-30 -6 q30 12 60 0 M-30 -6 l-6 -10 M30 -6 l6 -10 M-18 -6 v-10 M-6 -6 v-10 M6 -6 v-10 M18 -6 v-10',
        'man': 'M0 -6 v-14 M0 -20 m-4 -4 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M-8 -16 h16 M0 -6 l-6 8 M0 -6 l6 8',
        'bear': 'M-18 0 v-10 q0 -8 10 -8 h14 q8 0 10 6 l6 2 M-10 -18 v18 M8 -18 v18',
    }
    return f'<path transform="translate({x} {y}) scale({s})" d="{shapes[kind]}" stroke="{c}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'

def birch(x, y, h=70):
    t = f'<path d="M{x-3} {y} L{x-2} {y-h} H{x+2} L{x+3} {y}Z" fill="#f4f1ea" stroke="{LINE}" stroke-width="1.4"/>'
    t += ''.join(f'<path d="M{x-2} {y-k} h3" stroke="{LINE}" stroke-width="1.6"/>' for k in range(10, h, 14))
    t += ''.join(f'<circle cx="{x+dx}" cy="{y-h+dy}" r="{r}" fill="#9bbf6a" stroke="{LINE}" stroke-width="1.2"/>' for dx, dy, r in [(-10, 4, 11), (8, 2, 12), (0, -10, 12), (-4, 14, 9), (10, 14, 9)])
    return t + ''.join(f'<circle cx="{x+dx}" cy="{y-h+dy}" r="{r}" fill="#b5d07e"/>' for dx, dy, r in [(-6, -4, 4), (8, 0, 3)])

def globe(x, y, s=1):
    t = f'<g transform="translate({x} {y}) scale({s})" stroke="{LINE}" stroke-width="2">'
    t += '<path d="M-24 0 h48 l-6 -16 h-36Z" fill="#7d838c"/><path d="M-4 -16 v-10 h8 v10" fill="#7d838c"/>'
    t += '<circle cx="0" cy="-60" r="34" fill="none" stroke-width="3.5"/><ellipse cx="0" cy="-60" rx="14" ry="34" fill="none" stroke-width="2.4"/><ellipse cx="0" cy="-60" rx="34" ry="12" fill="none" stroke-width="2.4"/>'
    t += '<path d="M0 -94 v68 M-34 -60 h68" stroke-width="2"/></g>'
    return t
