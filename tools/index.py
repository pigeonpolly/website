#!/usr/bin/env python3
"""Индекс кода: где что лежит — без чтения больших файлов.

  python3 tools/index.py                 — пересобрать docs/index.tsv
  python3 tools/index.py check           — сверить индекс с кодом (1 — устарел)
  python3 tools/index.py find СЛОВО      — где это: файл:строка + что (до 25 строк)
  python3 tools/index.py where ФАЙЛ      — что в файле: символы по строкам

Колонки docs/index.tsv (TSV, первая строка с «#» — легенда):
  kind  name  file  line  note
  file  — файл (в note: строк и КБ)
  page  — адрес страницы, шаблон и её скрипты
  route — маршрут /api и место в route()/blogApi (name: «GET /api/…»)
  tbl   — таблица D1 (строка в docs/db.md, в note — модуль)
  meta  — ключ meta (строка в docs/db.md, в note — модули)
  sym   — имя в коде (функция, const, window.*, def в python)
  doc   — раздел docs/*.md

Номер строки — то, ради чего индекс: читать `docs/index.tsv` целиком не нужно,
ищи в нём (grep или find), потом `read файл offset=NNN limit=40`.
"""
import importlib.util
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs' / 'index.tsv'
MAX_SYM = 400  # символов на файл (защита от гигантских данных)

HEADER = '''\
# docs/index.tsv — машинный индекс кода pigeonpolly.com. Собран tools/index.py (python3 tools/index.py).
# Колонки: kind | name | file | line | note.  line=0 — номер не нужен.
# kind: file — файл; page — адрес страницы; route — маршрут /api; tbl — таблица D1; meta — ключ meta;
#       sym — имя в коде; doc — раздел docs/*.md.
# Читать целиком не нужно: grep по нужному виду, или python3 tools/index.py find СЛОВО / where ФАЙЛ.
# Свежесть: python3 tools/index.py check (перед пушем).

'''

# файлы, которые собираются скриптами — руками не править
GENERATED = ('english-page.js', 'norsk-page.js', 'nederlands-page.js', 'study-page.js', 'uttale.js',
             'rooms-data.js', 'extra-palettes.js', 'wobbleland-data.', 'day-colors.json', 'catalog.json')

# страницы, которые отдаёт worker, а не site/ (worker/index.js pageFetch — при новой такой странице строка сюда)
WORKER_PAGES = [
    ('/study/', 'worker/study.js', 'страницу отдаёт worker'),
    ('/english/', 'worker/english.js', 'страницу отдаёт worker'),
    ('/norsk/', 'worker/norsk.js', 'страницу отдаёт worker'),
    ('/norsk/avis/', 'worker/avis.js', 'страницу отдаёт worker'),
    ('/nederlands/', 'worker/nederlands.js', 'страницу отдаёт worker'),
    ('/blog/', 'worker/blog.js', 'страницу отдаёт worker (запасная — site/blog/)'),
    ('/blog/v2/', 'worker/blog.js', 'страницу отдаёт worker (шаблон site/blog/v2/)'),
    ('/learn/v/<id>/', 'worker/index.js', 'страницу отдаёт worker: одна страница site/learn/watch/'),
]

# --- символы в коде -------------------------------------------------------
JS_DECL = re.compile(r'^( *)(?:export\s+)?(?:async\s+)?(?:function\s*\*?|const|let|var|class)\s+([A-Za-z_$][\w$]*)', re.M)
JS_WIN = re.compile(r'^ *window\.([A-Za-z_$][\w$]*)\s*=', re.M)
PY_DEF = re.compile(r'^(?:async\s+)?def\s+(\w+)\s*\(', re.M)
PY_CLASS = re.compile(r'^class\s+(\w+)', re.M)
PY_CONST = re.compile(r'^([A-Z][A-Z0-9_]{2,})\s*=', re.M)

# --- маршруты (те же правила, что tools/docs/build_map.py, но со строками) --
JS_FUNC = re.compile(r'^\s{0,2}(?:export\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)\s*\(', re.M)
JS_CONST = re.compile(r'^\s{0,2}(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=', re.M)
RX_ROUTE = re.compile(r"(?:m === '(GET|POST|PUT|DELETE)' && )?p(?: === '(/api/[^']*)'|\.startsWith\('(/api/[^']*)'\)|\.match\(/\^((?:\\/[\w-]+)+))")
RX_BLOG = re.compile(r"(?:m === '(GET|POST)' && )?p === '(/api/blog/[^']*|/sitemap-blog\.xml)'")
RX_BLOG_A = re.compile(r"(?:m === '(GET|POST)' && )?a === '([\w-]+)'")
SKIP = {'set', 'add', 'link', 'randomHex', 'sha256', 'key', 'template', 'copies', 'imgGet', 'json', 'fail', 'needUser',
        'needAdmin', 'currentUser', 'isAdmin', 'getMeta', 'setMeta', 'parseJ', 'now', 'rigaDay', 'loadRules', 'admin',
        'one', 'all', 'esc', 'cookie', 'body', 'readJson', 'num', 'clamp', 'int', 'str'}


def line_of(text, pos):
    return text.count('\n', 0, pos) + 1


def js_syms(text):
    """Имена верхнего уровня: минимальный отступ файла (бывает IIFE с 2 пробелами)."""
    cand = [(m.start(), m.group(1), m.group(2), 'fn' if 'function' in m.group(0) else
             ('class' if 'class' in m.group(0) else 'const')) for m in JS_DECL.finditer(text)]
    if not cand:
        return []
    depth = min(len(c[1]) for c in cand)
    out = [(line_of(text, c[0]), c[2], c[3]) for c in cand if len(c[1]) == depth]
    out += [(line_of(text, m.start()), m.group(1), 'win') for m in JS_WIN.finditer(text)]
    seen, res = set(), []
    for ln, name, kind in sorted(out):
        if name in seen or len(name) < 2:
            continue
        seen.add(name)
        res.append((ln, name, kind))
    return res[:MAX_SYM]


def py_syms(text):
    out = [(line_of(text, m.start()), m.group(1), 'fn') for m in PY_DEF.finditer(text)]
    out += [(line_of(text, m.start()), m.group(1), 'class') for m in PY_CLASS.finditer(text)]
    out += [(line_of(text, m.start()), m.group(1), 'const') for m in PY_CONST.finditer(text)]
    seen, res = set(), []
    for ln, name, kind in sorted(out):
        if name in seen:
            continue
        seen.add(name)
        res.append((ln, name, kind))
    return res[:MAX_SYM]


def top_funcs(src):
    imported = {x.strip().split(' as ')[-1] for m in re.finditer(r'import\s*\{([^}]*)\}', src) for x in m.group(1).split(',') if x.strip()}
    return imported | set(JS_FUNC.findall(src)) | {c for c in JS_CONST.findall(src)
                                                   if re.search(rf'\b{re.escape(c)}\s*=\s*(?:async\s*)?(?:\([^)]*\)|[\w$]+)\s*=>', src)}


def handler(seg, funcs, counts):
    for m in re.finditer(r'return\s+(?:json\(\s*)?(?:\{\s*\.\.\.\(?)?(?:await\s+)?([A-Za-z_$][\w$]*)\s*\(', seg):
        n = m.group(1)
        if n in funcs and n not in SKIP:
            return '→ ' + n
    called = {m.group(1) for m in re.finditer(r'(?<![\w$.])([A-Za-z_$][\w$]*)\s*\(', seg)}
    called = [n for n in called if n in funcs and n not in SKIP]
    if not called:
        return '—'
    return '~' + min(called, key=lambda n: (counts.get(n, 0), n))


def routes_index(src):
    funcs = top_funcs(src)
    counts = {n: len(re.findall(rf'(?<![\w$.]){re.escape(n)}\s*\(', src)) for n in funcs}
    hits = []
    for m in RX_ROUTE.finditer(src):
        path = m.group(2) or (m.group(3) and m.group(3) + '*') or (m.group(4) and m.group(4).replace('\\/', '/') + '/…')
        ls = src.rfind('\n', 0, m.start()) + 1
        if src[m.start() - 1] == '!':
            continue
        if not src[ls:m.start()].lstrip().startswith(('if', '}', 'else')) and 'if (' not in src[ls:m.end()]:
            continue
        meth = m.group(1) or ''
        if not meth:
            mm = re.search(r"m === '(GET|POST|PUT|DELETE)'", src[ls:m.end() + 40])
            meth = mm.group(1) if mm else ''
        hits.append((m.start(), meth, path))
    out, seen = [], set()
    for i, (pos, meth, path) in enumerate(hits):
        end = hits[i + 1][0] if i + 1 < len(hits) else pos + 3000
        h = handler(src[pos:end][:3000], funcs, counts)
        if (meth, path) in seen or (not meth and any(k[1] == path for k in seen)):
            continue
        seen.add((meth, path))
        name = (meth + ' ' if meth else '') + path
        out.append((line_of(src, pos), name, h))
    return out


def routes_blog(src):
    funcs = top_funcs(src)
    counts = {n: len(re.findall(rf'(?<![\w$.]){re.escape(n)}\s*\(', src)) for n in funcs}
    hits = [(m.start(), m.group(1) or '', m.group(2)) for m in RX_BLOG.finditer(src)]
    adm = src.find("p.startsWith('/api/blog/admin/')")
    for m in RX_BLOG_A.finditer(src):
        if m.start() > adm:
            hits.append((m.start(), m.group(1) or '', '/api/blog/admin/' + m.group(2)))
    hits.sort()
    out, seen = [], set()
    for i, (pos, meth, path) in enumerate(hits):
        end = hits[i + 1][0] if i + 1 < len(hits) else pos + 2000
        key = (meth, path)
        if key in seen:
            continue
        seen.add(key)
        name = (meth + ' ' if meth else '') + path
        out.append((line_of(src, pos), name, handler(src[pos:end][:2500], funcs, counts)))
    return out


# --- страницы -------------------------------------------------------------
def load_pages():
    """PAGES, V2 из build.py — импортом (он ничего не делает при импорте); иначе разбором текста."""
    try:
        spec = importlib.util.spec_from_file_location('pp_build', ROOT / 'build.py')
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        return list(mod.PAGES), set(getattr(mod, 'V2', ()))
    except Exception as e:  # build.py сломан — не повод ронять индекс
        print(f'! build.py не импортируется ({e}); читаю PAGES по тексту', file=sys.stderr)
        text = (ROOT / 'build.py').read_text(encoding='utf-8')
        block = re.search(r'^PAGES = \[(.*?)^\]', text, re.S | re.M)
        v2 = re.search(r'^V2 = \{(.*?)\}', text, re.S | re.M)
        rows = re.findall(r'^\s*\("([^"]*)",\s*"[^"]*",\s*"([^"]+)",', block.group(1), re.M) if block else []
        v2set = {x.strip().strip('"') for x in v2.group(1).split(',')} if v2 else set()
        return [(p, '', f, '') for p, f in rows], v2set


SCRIPT_RX = re.compile(r'<script[^>]+src="([^"]+)"')


def page_scripts(path):
    f = ROOT / 'site' / path / 'index.html'
    if not f.exists():
        return []
    return [s.split('?')[0].rsplit('/', 1)[-1] for s in SCRIPT_RX.findall(f.read_text(encoding='utf-8', errors='replace'))]


def page_rows():
    pages, v2 = load_pages()
    sets = {p: page_scripts(p) for p, *_ in pages}
    cnt = {}
    for ss in sets.values():
        for s in set(ss):
            cnt[s] = cnt.get(s, 0) + 1
    total = max(1, len([1 for ss in sets.values() if ss]))
    common = {s for s, c in cnt.items() if c >= total * 0.6}
    rows = []
    for path, _title, file, _desc in pages:
        note = 'en,ru,lv' + ('; v2' if path in v2 else '')
        own = sorted(set(sets.get(path, ())) - common)
        if own:
            note += '; скрипты: ' + ', '.join(own)
        if path and path not in v2:
            note += '; lab-шаблон'
        rows.append(('page', '/' + (path + '/' if path else ''), f'src/pages/{file}', 0, note))
    for url, where, note in WORKER_PAGES:
        rows.append(('page', url, where, 0, note))
    return rows


# --- сборка ---------------------------------------------------------------
def file_list():
    out = []
    out += sorted((ROOT / 'worker').glob('*.js'))
    out += sorted((ROOT / 'site' / 'assets').glob('*.js'))
    out += sorted((ROOT / 'site' / 'assets').glob('*.css'))
    out += [ROOT / 'build.py']
    out += sorted(p for p in (ROOT / 'tools').rglob('*')
                  if p.is_file() and p.suffix in ('.py', '.js') and 'source' not in p.parts and '__pycache__' not in p.parts)
    out += sorted((ROOT / 'content').rglob('*.js'))
    out += sorted((ROOT / 'src').rglob('*.html'))
    out += sorted((ROOT / 'docs').glob('*.md'))
    return out


def build_rows():
    rows = []  # (kind, name, file, line, note)
    for p in file_list():
        rel = p.relative_to(ROOT).as_posix()
        text = p.read_text(encoding='utf-8', errors='replace')
        n = text.count('\n') + (0 if text.endswith('\n') else 1)
        note = f'{n} строк, {p.stat().st_size / 1024:.0f} КБ'
        if any(g in p.name for g in GENERATED):
            note += ' · СОБРАН, руками не править'
        rows.append(('file', rel, rel, 0, note))
        if p.suffix == '.py':
            syms = py_syms(text)
        elif p.suffix == '.js':
            syms = js_syms(text)
        else:
            syms = []
        rows += [('sym', name, rel, ln, kind) for ln, name, kind in syms]
        if p.suffix == '.md':
            rows += [('doc', name, rel, ln, 'h%d' % lvl) for ln, lvl, name in doc_headings(text)]

    rows += page_rows()
    rows += db_rows()

    for rel, fn in (('worker/index.js', routes_index), ('worker/blog.js', routes_blog)):
        for ln, name, h in fn((ROOT / rel).read_text(encoding='utf-8')):
            rows.append(('route', name, rel, ln, h))
    rows.sort(key=lambda r: (KINDS.index(r[0]), r[2], r[3], r[1]))
    return rows


# --- таблицы D1 и ключи meta (из docs/db.md: таблица → модуль) -----------------
TBL_RX = re.compile(r'^- \*\*(\w+)\*\* \((\S+?)\)')
META_RX = re.compile(r'^- `([^`]+)` — (.+)$')


def db_rows():
    f = ROOT / 'docs' / 'db.md'
    if not f.exists():
        return []
    lines = f.read_text(encoding='utf-8').splitlines()
    rows, meta_from = [], next((i for i, l in enumerate(lines) if l.startswith('## Ключи meta')), len(lines))
    for i, l in enumerate(lines[:meta_from]):
        m = TBL_RX.match(l)
        if m:
            rows.append(('tbl', m.group(1), 'docs/db.md', i + 1, m.group(2)))
    for i, l in enumerate(lines[meta_from:], start=meta_from):
        m = META_RX.match(l)
        if m:
            rows.append(('meta', m.group(1), 'docs/db.md', i + 1, m.group(2)[:90]))
    return rows


KINDS = ['file', 'page', 'route', 'tbl', 'meta', 'sym', 'doc']
HEAD_RE = re.compile(r'^(#{1,6})\s+(.*?)\s*#*\s*$')


def doc_headings(text):
    out, fence = [], False
    for i, l in enumerate(text.splitlines()):
        if l.lstrip().startswith('```'):
            fence = not fence
        elif not fence and (m := HEAD_RE.match(l)):
            out.append((i + 1, len(m.group(1)), m.group(2)))
    return out


def render():
    rows = build_rows()
    lines = [HEADER.rstrip('\n')]
    lines += ['\t'.join(str(x) for x in r) for r in rows]
    counts = {k: sum(1 for r in rows if r[0] == k) for k in KINDS}
    lines.insert(1, '# файлов %d, страниц %d, маршрутов %d, таблиц %d, ключей meta %d, имён %d, разделов доков %d' % (
        counts['file'], counts['page'], counts['route'], counts['tbl'], counts['meta'], counts['sym'], counts['doc']))
    return '\n'.join(lines) + '\n'


def read_disk():
    if not OUT.exists():
        return ''
    with open(OUT, encoding='utf-8', newline=None) as f:
        return f.read()


def read_rows():
    rows = []
    for l in read_disk().splitlines():
        if l.startswith('#') or not l:
            continue
        parts = l.split('\t')
        if len(parts) == 5:
            rows.append(parts)
    return rows


def cmd_build():
    text = render()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, 'w', encoding='utf-8', newline='\n') as f:
        f.write(text)
    print(f'{OUT.relative_to(ROOT)}: {len(text.splitlines())} строк, {len(text.encode()) / 1024:.0f} КБ')
    return 0


def cmd_check():
    old = read_disk()
    if not old:
        print('docs/index.tsv нет — python3 tools/index.py')
        return 1
    new = render()
    if old == new:
        print(f'docs/index.tsv свеж: {len(new.splitlines())} строк')
        return 0
    a, b = old.splitlines(), new.splitlines()
    gone = [l for l in a if l not in set(b)]
    came = [l for l in b if l not in set(a)]
    print(f'docs/index.tsv устарел: −{len(gone)} / +{len(came)} строк. Обнови: python3 tools/index.py')
    for l in gone[:5]:
        print('  −', l[:150])
    for l in came[:5]:
        print('  +', l[:150])
    return 1


def cmd_find(*words):
    q = ' '.join(words).strip().lower()
    if not q:
        print(__doc__)
        return 2
    rows, hits = read_rows(), []
    for kind, name, file, line, note in rows:
        ln = name.lower()
        if ln == q:
            score = 0
        elif ln.startswith(q):
            score = 1
        elif q in ln:
            score = 2
        elif q in file.lower():
            score = 3
        elif q in note.lower():
            score = 4
        else:
            continue
        hits.append((score, KINDS.index(kind), file, len(line), kind, name, line, note))
    hits.sort()
    if not hits:
        print(f'«{q}» нет в индексе. Попробуй короче (garden, award, /shop/) или grep по коду.')
        return 1
    for score, _k, file, _z, kind, name, line, note in hits[:25]:
        where = f'{file}:{line}' if int(line) else file
        tail = f'({note})' if kind == 'sym' else note[:80]
        print(f'{where:<40} {kind:<5} {name}' + (f'  · {tail}' if tail else ''))
    if len(hits) > 25:
        print(f'… ещё {len(hits) - 25}: уточни запрос')
    return 0


def cmd_where(what):
    q = what.strip().strip('/')
    rows = [r for r in read_rows() if q in r[2]]
    if not rows:
        print(f'файла «{q}» в индексе нет — grep -rn "{q}" worker site/assets')
        return 1
    rows.sort(key=lambda r: (r[2], int(r[3]) or -1))
    shown = 0
    for kind, name, file, line, note in rows:
        if shown >= 60:
            print(f'… ещё {len(rows) - 60} — смотри grep по файлу')
            break
        if kind in ('file', 'page', 'route', 'doc'):
            print(f'{file:<34} {kind:<5} {name}  · {note[:90]}')
        else:
            print(f'{file}:{line:<6} {name}  · {note}')
        shown += 1
    print('\nдальше: read файл offset=строка limit=40 (целиком большие файлы не читать)')
    return 0


def main():
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass
    args = sys.argv[1:]
    if not args:
        return cmd_build()
    cmd, rest = args[0], args[1:]
    if cmd in ('-h', '--help', 'help'):
        print(__doc__)
        return 0
    if cmd == 'check':
        return cmd_check()
    if cmd == 'find':
        return cmd_find(*rest)
    if cmd == 'where':
        if not rest:
            print(__doc__)
            return 2
        return cmd_where(' '.join(rest))
    print(__doc__)
    return 2


if __name__ == '__main__':
    sys.exit(main())
