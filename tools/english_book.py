"""Книга для учебника английского (/english/, docs/site.md «Учебник английского»): «Alice's Adventures in Wonderland» (Lewis Carroll, 1865,
общественное достояние; текст Project Gutenberg #11 — content/english/book/alice.txt) → content/english/book.js (window.EN_BOOK).
Книга делится на части по порядку уроков: часть i — урок UNITS[i]; в A1 куски короткие, к C2 длиннее (W — слов на урок по уровню).
Запуск: python3 tools/english_book.py, потом python3 tools/english_page.py."""
import json, pathlib, re, subprocess
ROOT = pathlib.Path(__file__).resolve().parent.parent
D = ROOT / 'content/english'
raw = (D / 'book/alice.txt').read_text(encoding='utf-8').replace('\r', '')
body = raw[raw.index('CHAPTER I.'):raw.index('THE END')].rstrip()  # без служебного хвоста Gutenberg
units = json.loads(subprocess.check_output(['node', '-e', '''
const fs=require("fs");let UNITS=[];global.U=u=>UNITS.push(u);
for(const f of fs.readdirSync(process.argv[1]).filter(f=>/^[abc][12].*\\.js$/.test(f)).sort())eval(fs.readFileSync(process.argv[1]+"/"+f,"utf8"));
console.log(JSON.stringify(UNITS.map(u=>[u.id,u.lvl])))''', str(D)]))
W = {'A1': 230, 'A2': 340, 'B1': 480, 'B2': 580, 'C1': 680, 'C2': 760}

def esc(s): return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
paras, ch = [], ''  # [глава, html абзаца, слов]
for block in re.split(r'\n\s*\n', body):
    if not block.strip() or set(block.strip()) <= set('* \n'): continue
    m = re.match(r'CHAPTER ([IVXL]+)\. (.+)', block.strip())
    if m: ch = m.group(1) + '. ' + m.group(2); paras.append([ch, None, 0]); continue
    lines = block.split('\n')
    verse = sum(1 for l in lines if l.startswith('  ')) >= max(2, len(lines) // 2)
    txt = '<br>'.join(esc(l.strip()) for l in lines if l.strip()) if verse else esc(' '.join(l.strip() for l in lines))
    paras.append([ch, txt, len(txt.split())])
total = sum(p[2] for p in paras); want = [W[l] for _, l in units]; scale = total / sum(want)
import bisect, itertools
bounds = list(itertools.accumulate(w * scale for w in want))  # где по счёту слов кончается часть i
parts, acc, head = [[] for _ in units], 0, []
for p in paras:
    if p[1] is None: head.append(['h', p[0]]); continue
    k = min(len(units) - 1, bisect.bisect_left(bounds, acc + p[2] / 2))  # абзац — в часть, куда попадает его середина
    parts[k] += head + [['p', p[1], p[0]]]; head = []; acc += p[2]
out = []
for i, part in enumerate(parts):
    chs = [x[1] for x in part if x[0] == 'h']
    first_ch = next((x[2] for x in part if x[0] == 'p'), '')
    out.append({'u': units[i][0] if i < len(units) else '', 'ch': first_ch, 'h': chs, 'txt': [x[1] for x in part if x[0] == 'p'], 'n': sum(len(x[1].split()) for x in part if x[0] == 'p')})
js = ('// Собрано tools/english_book.py из content/english/book/alice.txt — руками не править.\n'
      'window.EN_BOOK = ' + json.dumps({'title': "Alice's Adventures in Wonderland", 'author': 'Lewis Carroll', 'year': 1865, 'parts': out}, ensure_ascii=False) + ';\n')
(D / 'book.js').write_text(js, encoding='utf-8')
print(len(out), 'частей на', len(units), 'уроков;', total, 'слов;', [(o['u'], o['n']) for o in out])
