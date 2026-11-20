# Заготовки для пинов №945+ (SET=16): шаги акварели, контур для DTIYS, «найди отличия», палитры деталей, логотипы.
# python3 tools/pins/pins16_prep.py [steps|logo|pal|diff|all] → tools/pins/p16/
import sys, json, pathlib
import numpy as np
from PIL import Image, ImageFilter, ImageOps, ImageEnhance, ImageChops
ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = pathlib.Path(__file__).parent / 'p16'; OUT.mkdir(exist_ok=True)
IMG = ROOT / 'site/images'

def load(k, size=1100):
    im = Image.open(IMG / k).convert('RGB'); im.thumbnail((size, size)); return im

def lines(im, k=2.2, blur=1.2):
    """контур: разность гауссиан по яркости → тёмные линии на белом"""
    g = np.asarray(ImageOps.grayscale(im)).astype(float)
    a = np.asarray(Image.fromarray(g.astype('uint8')).filter(ImageFilter.GaussianBlur(blur))).astype(float)
    b = np.asarray(Image.fromarray(g.astype('uint8')).filter(ImageFilter.GaussianBlur(blur * k))).astype(float)
    d = np.clip((b - a) * 6, 0, 255)  # тёмные края
    return 255 - d

def paper(w, h, tone=(251, 248, 242)):
    rng = np.random.default_rng(3); n = rng.normal(0, 5, (h // 4 + 1, w // 4 + 1))
    n = (np.asarray(Image.fromarray(np.uint8(np.clip(128 + n, 0, 255))).resize((w, h), Image.BICUBIC)).astype(float) - 128) * .6
    return np.stack([np.clip(t + n, 0, 255) for t in tone], -1)

def steps(k, name):
    im = load(k); w, h = im.size; P = paper(w, h)
    L = lines(im)
    # 1 карандаш: светло-серые линии
    pen = P * (1 - (255 - L[..., None]) / 255 * .55)
    Image.fromarray(np.uint8(pen)).save(OUT / f'{name}-1.jpg', quality=88)
    # 2 тушь: чёткие тёмные линии
    ink = np.clip((255 - L) * 1.8, 0, 255)[..., None] / 255
    inkim = P * (1 - ink * .92)
    Image.fromarray(np.uint8(inkim)).save(OUT / f'{name}-2.jpg', quality=88)
    # 3 первая заливка: размытые светлые пятна цвета + тушь
    wash = im.filter(ImageFilter.GaussianBlur(9)).filter(ImageFilter.ModeFilter(9))
    wash = ImageEnhance.Color(wash).enhance(.8)
    wa = np.asarray(wash).astype(float); wa = 255 - (255 - wa) * .5  # светлее, как первый слой
    st3 = (P / 255) * wa * (1 - ink * .9)
    Image.fromarray(np.uint8(st3)).save(OUT / f'{name}-3.jpg', quality=88)
    im.save(OUT / f'{name}-4.jpg', quality=88)

def lineart(k, name, k2=2.0, blur=1.4, thr=None):
    im = load(k, 1400); L = lines(im, k2, blur)
    L = np.clip((L - 120) * 2, 0, 255) if thr else L
    Image.fromarray(np.uint8(L)).filter(ImageFilter.SMOOTH).save(OUT / f'{name}-line.png')

def logo():
    for v in ['color-autumn', 'color-winter', 'color-spring', 'color-summer', 'color-purple', 'white-only']:
        f = ROOT / f'site/images/logo/v3/pigeon-polly-{v}-transparent-4000.png'
        if not f.exists(): f = ROOT / f'site/images/logo/v3/pigeon-polly-{v}-transparent-4000.png'.replace('-transparent', '')
        im = Image.open(f); im.thumbnail((320, 320)); im.save(OUT / f'logo-{v}.png')

# палитры по кадру — тот же алгоритм, что tools/palettes.py (3 ярких + 3 спокойных, имена из palette_names.py)
_src = (ROOT / 'tools/palettes.py').read_text().split('\nout = []')[0]
_g = {'__file__': str(ROOT / 'tools/palettes.py')}; exec(_src, _g)

def crop(k, box):
    im = Image.open(IMG / k).convert('RGB'); w, h = im.size; x, y, cw, ch = box
    return im.crop((int(x * w), int(y * h), int((x + cw) * w), int((y + ch) * h)))

def pals(spec):
    f0 = OUT / 'palettes.json'; res = json.load(open(f0)) if f0.exists() else {}  # все наборы в одном файле
    for n, k, box in spec:
        c = crop(k, box); c.thumbnail((1200, 1200)); f = OUT / f'crop-{n}.jpg'; c.save(f, quality=88)
        res[str(n)] = _g['palette'](f)
    json.dump(res, open(OUT / 'palettes.json', 'w'), ensure_ascii=False, indent=1)

def diff(k, name, seed):
    """5 отличий: кусок отражён, цвет сдвинут, деталь закрашена соседним куском, деталь продублирована, кусок пропал (размыт)"""
    im = load(k, 1000); w, h = im.size; rng = np.random.default_rng(seed); b = im.copy(); spots = []
    def free(r):
        for _ in range(200):
            x, y = int(rng.uniform(r, w - r)), int(rng.uniform(r, h - r))
            if all((x - a) ** 2 + (y - c) ** 2 > (r + rr + 30) ** 2 for a, c, rr in spots): return x, y
        return x, y
    for kind in ['flip', 'hue', 'patch', 'dup', 'hue2']:
        r = int(min(w, h) * rng.uniform(.06, .09)); x, y = free(r); spots.append((x, y, r))
        box = (x - r, y - r, x + r, y + r); reg = b.crop(box)
        if kind == 'flip': reg = ImageOps.mirror(reg)
        elif kind in ('hue', 'hue2'):
            hsv = np.asarray(reg.convert('HSV')).copy(); hsv[..., 0] = (hsv[..., 0].astype(int) + (70 if kind == 'hue' else 140)) % 256
            hsv[..., 1] = np.clip(hsv[..., 1].astype(int) + 40, 0, 255); reg = Image.fromarray(hsv, 'HSV').convert('RGB')
        elif kind == 'patch':
            sx = x + 2 * r + 10 if x + 3 * r + 10 < w else x - 2 * r - 10; reg = b.crop((sx - r, y - r, sx + r, y + r))
        elif kind == 'dup':
            sy = y + 2 * r + 10 if y + 3 * r + 10 < h else y - 2 * r - 10; reg = b.crop((x - r, sy - r, x + r, sy + r))
        m = Image.new('L', reg.size, 0); from PIL import ImageDraw; ImageDraw.Draw(m).ellipse((4, 4, 2 * r - 4, 2 * r - 4), 255)
        b.paste(reg, box[:2], m.filter(ImageFilter.GaussianBlur(5)))
    im.save(OUT / f'diff-{name}-a.jpg', quality=88); b.save(OUT / f'diff-{name}-b.jpg', quality=88)
    json.dump(spots, open(OUT / f'diff-{name}.json', 'w'))

def spec():
    import subprocess
    import os; return json.loads(subprocess.check_output(['node', '-e', f"console.log(JSON.stringify(require('./tools/pins/pins{os.environ.get('SET', '16')}-data.js')))"], cwd=ROOT, env={**__import__('os').environ}))

if __name__ == '__main__':
    what = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if what in ('logo', 'all'): logo()
    if what in ('steps', 'pal', 'diff', 'line', 'all'):
        D = spec()
    if what in ('steps', 'all'):
        for p in D:
            if p['tpl'] == 'steps': steps(p['art'], p['name'])
    if what in ('pal', 'all'):
        pals([(p['n'], p['art'], p['crop']) for p in D if p['tpl'] in ('pal', 'palch')])
    if what in ('diff', 'all'):
        for p in D:
            if p['tpl'] == 'diff': diff(p['art'], p['name'], p['n'])
    if what in ('line', 'all'):
        for p in D:
            if p['tpl'] == 'dtiys': lineart(p['art'], p['name'])
    if what == 'test':
        steps('photos2/cupcake.jpg', 'test')
