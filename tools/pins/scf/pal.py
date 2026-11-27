# python3 tools/pins/scf/pal.py картинка N [x y w h] → N цветов (HEX + имя из site/assets/palette-names.json), JSON
import sys, json
from PIL import Image
f, n = sys.argv[1], int(sys.argv[2])
im = Image.open(f).convert('RGB')
if len(sys.argv) > 6: x, y, w, h = map(int, sys.argv[3:7]); im = im.crop((x, y, x + w, y + h))
im = im.resize((200, int(200 * im.height / im.width)))
q = im.quantize(colors=n * 3, method=Image.Quantize.MEDIANCUT, kmeans=3)
pal = q.getpalette(); cnt = sorted(q.getcolors(), reverse=True)
cols = []
for c, i in cnt:
    r, g, b = pal[i * 3:i * 3 + 3]
    if all(abs(r - R) + abs(g - G) + abs(b - B) > 70 for R, G, B in cols): cols.append((r, g, b))
    if len(cols) == n: break
names = json.load(open('site/assets/palette-names.json'))
items = names if isinstance(names, list) else names.get('names', names)
def near(rgb, used):
    best = None
    for it in items:
        h = it[3]; nm = it[0]
        if nm in used: continue
        R, G, B = int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16)
        d = (R - rgb[0]) ** 2 + (G - rgb[1]) ** 2 + (B - rgb[2]) ** 2
        if best is None or d < best[0]: best = (d, nm)
    return best[1]
used = []; out = []
for c in cols:
    nm = near(c, used); used.append(nm); out.append(['#%02X%02X%02X' % c, nm])
print(json.dumps(out))
