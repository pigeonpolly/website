# Палитры для контент-завода №31–60 (scf2611b): цвета — из site/assets/palettes.json (+ extra-palettes для 8 цветов),
# новые фото с Drive — тем же алгоритмом, что tools/palettes.py. Запуск: python3 tools/pins/scf2611b_pal.py → tools/pins/scf2611b-pal.json
import json, pathlib, sys
import numpy as np
from PIL import Image
W = pathlib.Path(__file__).resolve().parents[2]
src = (W / 'tools/palettes.py').read_text().split('\nout = []')[0]
sys.path.insert(0, str(W / 'tools')); g = {'__file__': str(W / 'tools/palettes.py')}; exec(src, g)
to_lab, de = g['to_lab'], g['de']
lab = lambda h: to_lab(np.array([[int(h[i:i + 2], 16) for i in (1, 3, 5)]], float))[0]
P = {x['key']: x for x in json.load(open(W / 'site/assets/palettes.json'))}
E = {x['k']: x for x in json.load(open(W / 'site/assets/extra-palettes.json'))}
# [ключ или s/файл, число цветов, кадр арта для нового фото]
PICK = [
 ('2025-pigeon-polly-celebrates-new-year', 5), ('2023-mr-chew-coffee-passion', 4), ('2024-pigeon-polly-bath-relax', 3),
 ('2026-pigeon-polly-keeps-busy-living', 6), ('2026-pigeon-polly-fancy-life', 8), ('2026-pigeon-polly-seven-years-later', 4),
 ('2025-sometimes-mr-chew-wants-to-be-retired', 5), ('2023-mr-chew-australian-postal-snail-introduction', 3),
 ('2024-detective-mr-titos-in-the-office-late-night', 6), ('sketchbook-5', 3), ('sketchbook-9', 8), ('sketchbook-18', 5),
 ('sketchbook-15', 4), ('sketchbook-20', 6), ('studio-bookshop', 8), ('studio-cat_lights', 4), ('studio-cookies', 3),
 ('studio-desk_night', 5), ('studio-fuji', 6), ('studio-mushroom_house', 8), ('details-tree-lights', 3), ('details-knitted-beanie', 4),
 ('studio-lanterns', 6), ('studio-caffeine_cup', 8),
 ('s/new-6238.jpg', 5, [0, 0, 1, .6]), ('s/new-6308.jpg', 4, [.15, .05, .8, .85]), ('s/new-6471.jpg', 8, [0, 0, 1, 1]),
 ('s/new-6566.jpg', 3, [.2, .15, .65, .3]), ('s/new-6653.jpg', 6, [.2, .3, .75, .5]), ('s/new-6207.jpg', 5, [.27, .32, .36, .3]),
]
NL = g['NL']
def eight(path, six):  # +2 цвета: кластеры картинки, дальние от шести (названия — ближайшие свободные из словаря)
    im = Image.open(path).convert('RGB'); im.thumbnail((180, 180)); px = to_lab(np.asarray(im, float).reshape(-1, 3))
    cs, ns = g['kmeans'](px, 16); cs = [c for c, n in zip(cs, ns) if n > len(px) * .01 and c[0] < 95]
    six = [list(c) for c in six]; used = {c[1] for c in six}
    while len(six) < 8:
        c = max(cs, key=lambda c: min(de(c, lab(x[0])) for x in six)); cs = [z for z in cs if z is not c]
        h = g['to_hex'](c); nm = min((x for x in NL if x[0][0] not in used), key=lambda x: de(lab(h), x[1]))[0]; used.add(nm[0]); six.append([h, nm[0]])
    return six
def pick(cols, n):  # n самых непохожих: первый — самый насыщенный, дальше — дальний от выбранных; порядок исходный
    L = [lab(c[0]) for c in cols]
    ch = [np.hypot(x[1], x[2]) for x in L]; s = [int(np.argmax(ch))]
    while len(s) < n: s.append(max((i for i in range(len(cols)) if i not in s), key=lambda i: min(de(L[i], L[j]) for j in s)))
    return [cols[i] for i in sorted(s)]
out = []
for p in PICK:
    k, n = p[0], p[1]
    if k.startswith('s/'):
        im = Image.open(W / 'site/images/social/src' / k[2:]).convert('RGB'); x, y, w, h = p[2]
        im = im.crop((int(x * im.width), int(y * im.height), int((x + w) * im.width), int((y + h) * im.height))); t = W / 'tools/pins/_tmp.jpg'; im.save(t)
        six = [[c['hex'], c['en']] for c in g['palette'](t)]
        if n == 8: six = eight(t, six)
        t.unlink()
        out.append({'k': k, 'art': k, 'crop': p[2], 'title': '', 'link': '/palettes/', 'cols': pick(six, n) if n < 6 else six})
        continue
    x = P[k]; six = [[c['hex'], c['en']] for c in x['colors']]
    if n == 8:
        six = eight(W / 'site' / x['thumb'], six)
        cols = six
    else: cols = pick(six, n) if n < 6 else six
    out.append({'k': k, 'art': x['img'][len('images/'):], 'title': x['title']['en'], 'link': '/palettes/', 'hash': k, 'cols': cols})
json.dump(out, open(W / 'tools/pins/scf2611b-pal.json', 'w'), ensure_ascii=False, indent=1)
for o in out: print(len(o['cols']), o['k'][:40], o['title'], ' / '.join(f'{c[1]} {c[0]}' for c in o['cols']))
