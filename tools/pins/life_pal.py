# Палитры из фото Алины (tools/pins/life/*.jpg) → tools/pins/life/palettes.json: 6 цветов, без почти-одинаковых, от светлого к тёмному.
import json, os, colorsys
from PIL import Image
D = os.path.join(os.path.dirname(__file__), 'life'); out = {}
for f in sorted(os.listdir(D)):
    if not f.endswith('.jpg'): continue
    im = Image.open(os.path.join(D, f)).convert('RGB'); im.thumbnail((240, 240))
    q = im.quantize(28, method=Image.Quantize.MEDIANCUT); pal = q.getpalette(); cnt = sorted(q.getcolors(), reverse=True)
    tot = sum(c for c, i in cnt); cand = [(c / tot, tuple(pal[i*3:i*3+3])) for c, i in cnt]
    sat = lambda c: colorsys.rgb_to_hsv(*[x/255 for x in c])[1] * colorsys.rgb_to_hsv(*[x/255 for x in c])[2]
    far = lambda rgb, cols: all(sum((a-b)**2 for a, b in zip(rgb, o)) > 2600 for o in cols)
    cols = []
    for w, rgb in cand:  # 3 главных по площади
        if len(cols) < 3 and far(rgb, cols): cols.append(rgb)
    for w, rgb in sorted([x for x in cand if x[0] > .004], key=lambda x: -sat(x[1]) * (x[0] ** .25)):  # 3 ярких акцента
        if len(cols) < 6 and far(rgb, cols): cols.append(rgb)
    for w, rgb in cand:
        if len(cols) < 6 and far(rgb, cols): cols.append(rgb)
    cols.sort(key=lambda c: -colorsys.rgb_to_hls(*[x/255 for x in c])[1])
    out[f[:-4]] = ['#%02X%02X%02X' % c for c in cols]
json.dump(out, open(os.path.join(D, 'palettes.json'), 'w'), indent=0)
print(len(out))
