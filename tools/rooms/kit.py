# Набор для пиксельных комнат: слои с контуром, шрифт 3x5, освещение «вечер»
from PIL import Image, ImageDraw
import numpy as np, math, json
W, H = 384, 216
INK = (26, 21, 40)
def L(c, k=40): return tuple(min(255, v + k) for v in c[:3])
def D(c, k=40): return tuple(max(0, v - k) for v in c[:3])
F3 = {'A':'010101111101101','B':'110101110101110','C':'011100100100011','D':'110101101101110','E':'111100110100111','F':'111100110100100','G':'011100101101011',
 'H':'101101111101101','I':'111010010010111','J':'001001001101010','K':'101101110101101','L':'100100100100111','M':'101111111101101','N':'110101101101101',
 'O':'010101101101010','P':'110101110100100','Q':'010101101110011','R':'110101110101101','S':'011100010001110','T':'111010010010010','U':'101101101101111',
 'V':'101101101101010','W':'101101111111101','X':'101101010101101','Y':'101101010010010','Z':'111001010100111','0':'111101101101111','1':'010110010010111',
 '2':'111001111100111','3':'111001111001111','4':'101101111001001','5':'111100111001111','6':'111100111101111','7':'111001010010010','8':'111101111101111',
 '9':'111101111001111',' ':'000000000000000','.':'000000000000010','-':'000000111000000',"'":'010010000000000','!':'010010010000010','&':'010101010101011','/':'001001010100100',':':'000010000010000'}
class Layer:
    def __init__(s):
        s.im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); s.d = ImageDraw.Draw(s.im)
    def r(s, b, c): s.d.rectangle(b, fill=c)
    def e(s, b, c): s.d.ellipse(b, fill=c)
    def p(s, pts, c): s.d.polygon(pts, fill=c)
    def l(s, pts, c, w=1): s.d.line(pts, fill=c, width=w)
    def px(s, pts, c):
        for q in pts: s.d.point(q, fill=c)
    def text(s, x, y, t, c):
        for i, ch in enumerate(t.upper()):
            f = F3.get(ch, F3[' '])
            for j in range(15):
                if f[j] == '1': s.d.point((x + i * 4 + j % 3, y + j // 3), fill=c)
    def box(s, b, c, k=35):  # объёмный прямоугольник: блик слева/сверху, тень справа/снизу
        x0, y0, x1, y1 = b; s.r(b, c); s.r((x0, y0, x1, y0), L(c, k)); s.r((x0, y0, x0, y1), L(c, k // 2)); s.r((x1, y0, x1, y1), D(c, k)); s.r((x0, y1, x1, y1), D(c, k))
    def outlined(s):
        a = np.asarray(s.im).copy(); m = a[..., 3] > 0; pp = np.pad(m, 1)
        nb = pp[:-2, 1:-1] | pp[2:, 1:-1] | pp[1:-1, :-2] | pp[1:-1, 2:]
        a[nb & ~m] = INK + (255,); return Image.fromarray(a, 'RGBA')
    def bbox(s):
        return s.im.getbbox()
def sprite(rows, col, scale=1):
    h, w = len(rows), max(len(r) for r in rows)
    a = np.zeros((h + 2, w + 2, 4), np.uint8)
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            if ch in col: a[y + 1, x + 1] = col[ch] + (255,)
    m = a[..., 3] > 0; pp = np.pad(m, 1); nb = pp[:-2, 1:-1] | pp[2:, 1:-1] | pp[1:-1, :-2] | pp[1:-1, 2:]
    a[nb & ~m] = INK + (255,)
    im = Image.fromarray(a, 'RGBA')
    return im.resize((im.width * scale, im.height * scale), Image.NEAREST) if scale > 1 else im
def evening(img, tint, lights, emissive):
    """img RGB; tint — множитель цвета вечера; lights — [(x, y, r, (R,G,B), сила)]; emissive — маска пикселей, которые светятся сами."""
    a = np.asarray(img.convert('RGB')).astype(float) / 255
    out = a * np.array(tint)[None, None]
    yy, xx = np.mgrid[0:H, 0:W]
    for x, y, r, c, k in lights:
        f = np.clip(1 - np.hypot(xx - x, (yy - y) * 1.15) / r, 0, 1) ** 1.6 * k
        out += a * f[..., None] * (np.array(c) / 255)[None, None]
    out = np.clip(out, 0, 1)
    # слегка ступенчатое освещение — как в пиксель-арте
    out = np.round(out * 40) / 40
    res = (out * 255).astype(np.uint8)
    em = np.asarray(emissive.convert('RGBA')); m = em[..., 3] > 0
    res[m] = em[m][..., :3]
    return Image.fromarray(res)
