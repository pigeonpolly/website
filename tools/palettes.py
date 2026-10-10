# Палитры из артов сайта: 6 цветов из каждой картинки галерей (кроме AI-арта) + «художественные» названия на 3 языках.
# В каждой палитре 3 ярких цвета (акценты: куртка, лужа, лампа — даже если пятно маленькое; кислотные чуть приглушаем)
# и 3 спокойных (фон, тени, бумага). Ручные палитры (они же в пинах) — tools/palette_overrides.py.
# Запуск: python3 tools/palettes.py → content/palettes.json. Новая картинка — добавить её название в tools/palette_titles.py.
import json, sys, pathlib
import numpy as np
from PIL import Image
HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from palette_names import NAMES
from palette_titles import T
from palette_overrides import O
W = HERE.parent


def to_lab(rgb):  # rgb: (N, 3) 0..255 → Lab (N, 3)
    c = rgb / 255.0
    c = np.where(c <= .04045, c / 12.92, ((c + .055) / 1.055) ** 2.4)
    m = np.array([[.4124, .3576, .1805], [.2126, .7152, .0722], [.0193, .1192, .9505]])
    xyz = c @ m.T / np.array([.95047, 1.0, 1.08883])
    f = np.where(xyz > .008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[:, 1] - 16, 500 * (f[:, 0] - f[:, 1]), 200 * (f[:, 1] - f[:, 2])], 1)


def to_hex(lab):  # Lab (3,) → '#RRGGBB'
    L, a, b = lab
    fy = (L + 16) / 116; fx = fy + a / 500; fz = fy - b / 200
    inv = lambda t: t ** 3 if t ** 3 > .008856 else (t - 16 / 116) / 7.787
    xyz = np.array([inv(fx) * .95047, inv(fy), inv(fz) * 1.08883])
    rgb = np.array([[3.2406, -1.5372, -.4986], [-.9689, 1.8758, .0415], [.0557, -.2040, 1.0570]]) @ xyz
    g = lambda c: 12.92 * c if c <= .0031308 else 1.055 * c ** (1 / 2.4) - .055
    return '#%02X%02X%02X' % tuple(int(round(min(1, max(0, g(max(v, 0)))) * 255)) for v in rgb)


def kmeans(x, k, it=16, seed=7):
    rng = np.random.default_rng(seed)
    k = min(k, len(x))
    c = x[rng.choice(len(x), k, replace=False)]
    for _ in range(it):
        lab = np.argmin(((x[:, None, :] - c[None]) ** 2).sum(2), 1)
        c = np.array([x[lab == i].mean(0) if (lab == i).any() else c[i] for i in range(k)])
    return c, np.bincount(lab, minlength=k)


hexlab = lambda h: to_lab(np.array([[int(h[i:i + 2], 16) for i in (1, 3, 5)]], float))[0]
NL = [(nm, hexlab(nm[3])) for nm in NAMES]
de = lambda a, b: float(np.sqrt(((np.asarray(a) - np.asarray(b)) ** 2).sum()))
chroma = lambda c: float(np.hypot(c[1], c[2]))
hue = lambda c: float(np.degrees(np.arctan2(c[2], c[1])) % 360)
hdiff = lambda a, b: min(abs(hue(a) - hue(b)), 360 - abs(hue(a) - hue(b)))


def palette(path):
    im = Image.open(path).convert('RGB'); im.thumbnail((180, 180))
    px = to_lab(np.asarray(im, float).reshape(-1, 3))
    paper = (px[:, 0] > 90) & (np.hypot(px[:, 1], px[:, 2]) < 10)  # белая бумага/фон — не цвет картинки
    if (~paper).mean() > .08: px = px[~paper]
    C = np.hypot(px[:, 1], px[:, 2])
    # яркие: отдельный k-means только по насыщенным пикселям, чтобы маленькие пятна не тонули в фоне
    vivid = []
    for thr in (34, 26, 18):
        vp = px[(C > thr) & (px[:, 0] > 22) & (px[:, 0] < 93)]
        if len(vp) < max(15, len(px) * .003): continue
        cs, ns = kmeans(vp, 8)
        cand = sorted([(c, n) for c, n in zip(cs, ns) if n >= max(8, len(px) * .002)], key=lambda x: -(x[1] ** .4) * chroma(x[0]))
        for c, n in cand:
            if len(vivid) == 3: break
            if all(hdiff(c, v) > 28 or de(c, v) > 38 for v in vivid): vivid.append(c.copy())
        if len(vivid) == 3: break
    for v in vivid:  # не кислотные: слишком сочные чуть приглушаем
        ch = chroma(v)
        if ch > 62: v[1:] *= (62 + (ch - 62) * .35) / ch
    # спокойные: общий k-means, малонасыщенные кластеры по площади; не больше одного очень тёмного и одного очень светлого
    cs, ns = kmeans(px, 14)
    order = sorted(zip(cs, ns), key=lambda x: -x[1])
    muted, dk, lt, need = [], 0, 0, 6 - len(vivid)
    for gap in (20, 14, 9):
        for c, n in order:
            if len(muted) == need: break
            if chroma(c) > 30 or c[0] > 95 or (c[0] < 18 and dk) or (c[0] > 86 and lt): continue
            if all(de(c, m) > gap for m in muted + vivid):
                muted.append(c); dk += c[0] < 18; lt += c[0] > 86
        if len(muted) == need: break
    for c, n in order:  # если мало — любой отличающийся
        if len(muted) == need: break
        if c[0] <= 95 and all(de(c, m) > 8 for m in muted + vivid): muted.append(c)
    muted.sort(key=lambda c: c[0])
    cols, used = [], set()
    for c in vivid + muted:
        h = to_hex(c)
        nm = min((x for x in NL if x[0][0] not in used), key=lambda x: de(hexlab(h), x[1]))[0]; used.add(nm[0])
        cols.append({'hex': h, 'en': nm[0], 'ru': nm[1], 'lv': nm[2]})
    return cols


out = []
for gal in ['bird', 'snail', 'sketchbook', 'halloween', 'detective', 'anxiety', 'challenge']:
    for it in json.load(open(W / 'content' / 'galleries' / f'{gal}.json')):
        key = it['full'].split('/')[-1][:-4]
        if key not in T or key == 'anxiety-7': continue
        cols = [{'hex': h, 'en': e, 'ru': r, 'lv': l} for e, r, l, h in O[key]] if key in O else palette(W / 'site' / it['thumb'])
        out.append({'key': key, 'gallery': gal, 'img': it['full'], 'thumb': it['thumb'], 'w': it['w'], 'h': it['h'], 'title': dict(zip(['en', 'ru', 'lv'], T[key])), 'colors': cols})
json.dump(out, open(W / 'content' / 'palettes.json', 'w'), ensure_ascii=False, indent=0)
print(len(out))
