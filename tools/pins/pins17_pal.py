# 8 цветов для пинов-палитр «8 colors» (SET=17): к 6 цветам палитры деталей с сайта (content/palettes.json) добавляем 2 заметных оттенка из той же детали.
# python3 tools/pins/pins17_pal.py → tools/pins/p17/pal8.json {key: [{hex, en}, …8]}
import json, pathlib
import numpy as np
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parents[2]
_src = (ROOT / 'tools/palettes.py').read_text().split('\nout = []')[0]
g = {'__file__': str(ROOT / 'tools/palettes.py')}; exec(_src, g)
P = {p['key']: p for p in json.load(open(ROOT / 'content/palettes.json'))}
res = {}
for d in json.load(open(ROOT / 'content/palette-details.json')):
    p = P[d['key']]; cols = list(p['colors'])
    im = Image.open(ROOT / 'site' / p['thumb']).convert('RGB'); im.thumbnail((180, 180))
    px = g['to_lab'](np.asarray(im, float).reshape(-1, 3))
    cs, ns = g['kmeans'](px, 16)
    have = [g['hexlab'](c['hex']) for c in cols]
    for c, n in sorted(zip(cs, ns), key=lambda x: -x[1]):
        if len(cols) == 8: break
        if all(g['de'](c, h) > 16 for h in have):
            hx = g['to_hex'](c); used = {x['en'] for x in cols}
            nm = min((x for x in g['NL'] if x[0][0] not in used), key=lambda x: g['de'](g['hexlab'](hx), x[1]))[0]
            cols.append({'hex': hx, 'en': nm[0]}); have.append(c)
    res[d['key']] = [{'hex': c['hex'], 'en': c['en']} for c in cols]
(ROOT / 'tools/pins/p17').mkdir(exist_ok=True)
json.dump(res, open(ROOT / 'tools/pins/p17/pal8.json', 'w'), indent=0)
print(len(res), sum(len(v) == 8 for v in res.values()))
