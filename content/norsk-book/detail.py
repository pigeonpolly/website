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
