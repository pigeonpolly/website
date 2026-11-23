"""Слова в картинках для учебника /norsk/ (docs/site.md «Учебник норвежского»): python3 tools/norsk_gender/make.py
→ content/norsk/ordbilder.js (window.NO_ORD.k — существительные en/ei/et, .o — остальные части речи); потом python3 tools/norsk_page.py.
Слова — words.py и words_other.py, транскрипция — tr.py (правила + OVR) и tr_extra.py (служебные слова)."""
import json, pathlib, sys
H = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(H))
from words import TOPICS as K
from words_other import TOPICS as O
from tr import tr
from tr_extra import tr as tr2, pres
k = []
for no, ru, data in K:
    rows = []
    for line in data.strip().splitlines():
        p = line.split('|'); art, w = p[0].split(' ', 1)
        rows.append([art, w, p[1], p[2], p[3] if len(p) > 3 else '', tr(w)])
    k.append([no, ru, rows])
o = []
for no, ru, data in O:
    rows = []
    for line in data.strip().splitlines():
        t, w, r, pic = line.split('|')
        rows.append([t, w, r, pic, tr2(('å ' if t == 'v' else '') + w), pres(w) if t == 'v' else ''])
    o.append([no, ru, rows])
js = '// Собрано tools/norsk_gender/make.py — руками не править.\nwindow.NO_ORD = ' + json.dumps({'k': k, 'o': o}, ensure_ascii=False, separators=(',', ':')) + ';\n'
out = H.parent.parent / 'content/norsk/ordbilder.js'
out.write_text(js, encoding='utf-8')
print(out, sum(len(t[2]) for t in k), sum(len(t[2]) for t in o), len(js))
