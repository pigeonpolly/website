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
