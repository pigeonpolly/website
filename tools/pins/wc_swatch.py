# Пин «акварельная палитра»: мазки-имитация акварели + арт, без текста, мини-лого PP справа внизу.
# python3 tools/pins/wc_swatch.py <ключ из content/palettes.json> <номер> [top|bottom]
# python3 tools/pins/wc_swatch.py --all  → все пины из tools/pins/wcpal.json
import json, sys
import numpy as np
from PIL import Image, ImageFilter

ROOT = __file__.rsplit('/tools/', 1)[0]
rng = np.random.default_rng(0)
W, H, M = 1000, 1500, 60
PAPER = np.array([247, 243, 236], float) / 255


def blur(a, r):
    im = Image.fromarray(np.clip(a * 255, 0, 255).astype(np.uint8))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(r)), float) / 255


def noise(h, w, r, amp=1.0):
    n = blur(rng.random((h, w)), r)
    n = (n - n.mean()) / (n.std() + 1e-6)
    return n * amp


def hex2(c):
    return np.array([int(c[i:i + 2], 16) for i in (1, 3, 5)], float) / 255




def swatch(hexc, w, h):
    """плотность пигмента (h×w) одного мазка: рваный край, тёмная кайма, разводы, грануляция, лужица внизу"""
    pad = 30
    hh, ww = h + 2 * pad, w + 2 * pad
    m = np.zeros((hh, ww))
    m[pad + 6:pad + h - 4, pad + 4:pad + w - 4] = 1
    base = blur(m, 16)
    m = base + noise(hh, ww, 12, 0.09) + noise(hh, ww, 4, 0.02)
    m *= base > 0.08                                         # без случайных брызг вокруг
    # низ мазка округлее и тяжелее — как стекающая капля
    yy = np.linspace(0, 1, hh)[:, None]
    m -= np.clip(yy - 0.7, 0, 1) * 1.6 * (np.abs(np.linspace(-1, 1, ww))[None, :] ** 2.5)
    m -= np.clip(0.2 - yy, 0, 1) * 0.6 * (np.abs(np.linspace(-1, 1, ww))[None, :] ** 3)
    mask = (m > 0.5).astype(float)
    mask = blur(mask, 1.1)
    inner = blur(mask, 7)
    edge = np.clip(mask - inner, 0, 1) * 2.0          # кайма, где краска высохла
    flow = noise(hh, ww, 22, 0.16) + noise(hh, ww, 8, 0.07)  # разводы
    gran = np.clip(noise(hh, ww, 1.0, 0.04), -0.08, 0.15)       # грануляция
    pool = yy ** 3 * 0.45                                   # пигмент стёк вниз
    bloom = np.zeros((hh, ww))
    if rng.random() < 0.45:                                   # «цветок» от капли воды
        cy, cx = rng.uniform(0.25, 0.6) * hh, rng.uniform(0.3, 0.7) * ww
        Y, X = np.ogrid[:hh, :ww]
        r = np.sqrt((Y - cy) ** 2 + (X - cx) ** 2) + noise(hh, ww, 5, 4)
        R = rng.uniform(22, 38)
        bloom = -0.16 * blur((r < R).astype(float), 4) + 0.14 * np.exp(-((r - R) / 3) ** 2)
    d = mask * (0.62 + flow + pool + gran + bloom * mask) + edge * 0.5
    return np.clip(d, 0, 1.3) * mask, pad


def paint(canvas, hexc, x, y, w, h):
    d, pad = swatch(hexc, w, h)
    c = np.clip(hex2(hexc), 0.02, 1)
    x0, y0 = x - pad, y - pad
    sub = canvas[y0:y0 + d.shape[0], x0:x0 + d.shape[1]]
    # прозрачный слой: свет проходит сквозь пигмент (перекрытия темнее, как у акварели)
    sub *= c[None, None, :] ** (d[..., None] * 1.05)


PAL = {p['key']: p for p in json.load(open(f'{ROOT}/content/palettes.json'))}
LOGO = Image.open(f'{ROOT}/site/images/logo/v3/pigeon-polly-brown-only-transparent-4000.png').convert('RGBA')
LOGO = LOGO.crop(LOGO.getbbox())


def smart_crop(art, aw, ah):
    """кадр aw×ah там, где больше всего деталей (контуры), а не просто по центру"""
    r = max(aw / art.width, ah / art.height)
    art = art.resize((round(art.width * r), round(art.height * r)), Image.LANCZOS)
    g = np.asarray(art.convert('L').resize((art.width // 4, art.height // 4)), float)
    e = np.abs(np.diff(g, axis=0))[:, :-1] + np.abs(np.diff(g, axis=1))[:-1, :]
    sx, sy = art.width - aw, art.height - ah
    best, bx, by = -1, sx // 2, sy // 2
    for ox in np.linspace(0, sx, 9).astype(int) if sx else [0]:
        for oy in np.linspace(0, sy, 9).astype(int) if sy else [0]:
            v = e[oy // 4:(oy + ah) // 4, ox // 4:(ox + aw) // 4].sum()
            v *= 1 - 0.15 * (abs(ox - sx / 2) / (sx or 1) + abs(oy - sy / 2) / (sy or 1))  # лёгкая тяга к центру
            if v > best:
                best, bx, by = v, ox, oy
    return art.crop((bx, by, bx + aw, by + ah))


def render(key, num, layout='top'):
    global rng
    rng = np.random.default_rng(int(num))
    data = PAL[key]
    cols = [c['hex'] for c in data['colors']]
    paper = np.ones((H, W, 3)) * PAPER                     # бумага: лёгкое зерно и волокна
    paper *= (1 + noise(H, W, 1.0, 0.005) + noise(H, W, 10, 0.006))[..., None]
    art = Image.open(f"{ROOT}/site/{data['img']}").convert('RGB')
    cw = W - 2 * M
    ah = int(min(1000, max(760, cw * art.height / art.width)))
    SH, GAP, LB = 250, 60, 90                               # мазки, промежуток, полоса лого
    y0 = (H - LB - (SH + GAP + ah)) // 2 + 10
    sy, ay = (y0, y0 + SH + GAP) if layout == 'top' else (y0 + ah + GAP, y0)
    n = len(cols)
    step = cw / n
    sw = int(step - 20)  # промежуток между мазками ~25 px
    for i, c in enumerate(cols):
        x = int(M + i * step + 10 + rng.integers(-3, 4))
        y = sy + int(rng.integers(-8, 9))
        paint(paper, c, x, y, sw, SH + int(rng.integers(-14, 15)))
    out = Image.fromarray(np.clip(paper * 255, 0, 255).astype(np.uint8))
    art = smart_crop(art, cw, ah)
    sh = Image.new('L', (W, H), 0)                          # тонкая тень под артом
    sh.paste(60, (M + 3, ay + 6, M + cw + 3, ay + ah + 6))
    out.paste(Image.new('RGB', (W, H), (90, 70, 55)), (0, 0), sh.filter(ImageFilter.GaussianBlur(8)))
    out.paste(art, (M, ay))
    lh = 64                                                 # мини-лого PP справа внизу
    logo = LOGO.resize((round(LOGO.width * lh / LOGO.height), lh), Image.LANCZOS)
    logo.putalpha(logo.split()[3].point(lambda v: int(v * 0.85)))
    bottom = max(sy + SH, ay + ah)
    out.paste(logo, (W - M - logo.width, min(H - lh - 24, bottom + (H - bottom - lh) // 2)), logo)
    dst = f'{ROOT}/site/images/pins/pin-{num}.jpg'
    out.save(dst, quality=90)
    return dst


if __name__ == '__main__':
    if sys.argv[1] == '--all':
        for p in json.load(open(f'{ROOT}/tools/pins/wcpal.json')):
            render(p['key'], p['n'], p['layout'])
            print(p['n'], end=' ', flush=True)
    else:
        print(render(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else 'top'))
