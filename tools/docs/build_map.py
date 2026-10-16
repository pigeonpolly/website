#!/usr/bin/env python3
"""docs/map.md — карта кода: одна строка на файл, маршруты /api, ключи RULE_DEFAULTS.

Только имена (без номеров строк). Раздел «Общее» внизу пополняют следующие этапы —
скрипт берёт его из текущего docs/map.md и сохраняет.

Запуск: python3 tools/docs/build_map.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'docs' / 'map.md'
LIMIT = 15 * 1024
COMMON = '## Общее'

# что в файле (коротко); если файла нет в списке — первая строка комментария в начале файла
DESC = {
    'worker/index.js': 'Worker: site/, страницы через HTMLRewriter, /api (кроме блога), cron',
    'worker/blog.js': 'блог: страницы /blog/, /api/blog/*, редактор, перевод Gemini, копии',
    'site/assets/account.js': 'вход в шапке, меню аккаунта, обязательный ник, `html.is-admin`',
    'site/assets/admin.js': 'кабинет /admin/ (все разделы)',
    'site/assets/advent-admin.js': 'кабинет → 🎄 Адвент: план окошек',
    'site/assets/advent.js': 'адвент /advent/: отсчёт, окошки',
    'site/assets/backup.js': 'резервные копии (кабинет)',
    'site/assets/bird-card.js': 'карточка «Моя птичка» (сторис) и ссылка /flock/?bird=',
    'site/assets/birds.js': 'птички: внешность из id, спрайты, вещи и подарки (`PPBirds`)',
    'site/assets/blog-editor.js': 'редактор блога /blog-editor/',
    'site/assets/blog.js': 'блог для посетителя: лайк, комментарии, кнопки админа',
    'site/assets/carousel.js': 'карусели для Instagram/TikTok из работ челленджа',
    'site/assets/challenge-data.js': 'данные челленджа: предметы, цвета, советы (EN/RU/LV)',
    'site/assets/challenge-theme.js': 'тема дня (общая для /challenge и главной), день ЭКСТРА',
    'site/assets/challenge.js': 'страница челленджа: тема, таймер, календарь, карточка, серии',
    'site/assets/extra-palettes.js': 'палитры ЭКСТРА (build.py)',
    'site/assets/flock.js': 'стая: сцена canvas, локации, действия, предметы',
    'site/assets/home-blog.js': 'блок блога на главной',
    'site/assets/palettes.js': 'страница /palettes/, палитра из фото, добавление палитр админом',
    'site/assets/polly-help.js': '«Полли, помоги нарисовать»: гайды /polly-helps/',
    'site/assets/polly.js': 'Полли-питомец в левом нижнем углу (`PollyPet`)',
    'site/assets/potion-names.js': 'общие данные Зельеварни: ингредиенты, названия зелий (`PPPotion`)',
    'site/assets/potions.js': 'игра «Зельеварня» /potions/: лабиринт, котёл, рецепты',
    'site/assets/quest-polly.js': 'задачи в офисе Полли',
    'site/assets/quest-titos.js': 'дела детектива Титоса',
    'site/assets/rain.js': 'игра «Пуговичный дождь» /rain/',
    'site/assets/requests.js': '«Нарисуй мне» /requests/',
    'site/assets/room.js': 'комната птички: каталог мебели, расстановка, поведение (`PPRoom`)',
    'site/assets/rooms-data.js': 'зоны комнат (build.py)',
    'site/assets/rooms-gallery.js': 'галерея комнат внизу /flock/',
    'site/assets/rooms.js': 'пиксельные комнаты (офис Полли, Титос): зоны, реплики, эффекты (`ROOM`)',
    'site/assets/scroll-nav.js': 'стрелочки наверх/вниз',
    'site/assets/search.js': 'поиск по сайту (🔍, «/»)',
    'site/assets/site-edit.js': 'режим «✏️ Править страницу» (админ)',
    'site/assets/site.js': 'меню, шапка «влезает», лайтбокс галерей, /api/hit, `[data-profile]`',
    'site/assets/sketch-wall.js': 'стена работ, вход, загрузка, бейджи, профиль /bird/, сумка',
    'site/assets/today.js': 'блок «Тема дня» (с главной убран)',
    'site/assets/wobbleland-data.en.js': 'из content/wobbleland.json (build.py)',
    'site/assets/wobbleland-data.lv.js': 'то же, LV',
    'site/assets/wobbleland-data.ru.js': 'то же, RU',
    'site/assets/wobbleland.js': 'карта Wobbleland, карточки городов, праздники',
    'build.py': 'сборка: страницы, меню, языки, блоки, галереи, поиск, данные для JS',
    'tools/add_images.py': 'добавить картинки в галерею (ImageMagick)',
    'tools/ava_deco_gen.py': 'фоны и рамки аватаров → site/assets/ava-deco.css',
    'tools/catalog.js': 'каталог вещей → site/assets/catalog.json (для сервера)',
    'tools/daycolors.js': 'цвета темы дня для сервера → day-colors.json',
    'tools/import_uploads.py': 'раскладывает загрузки из GitHub по галереям',
    'tools/palette_names.py': 'словарь названий цветов (en, ru, lv, hex)',
    'tools/palette_overrides.py': 'палитры, подобранные вручную',
    'tools/palette_titles.py': 'короткие названия палитр по картинкам',
    'tools/palettes.py': 'палитры из артов → content/palettes.json',
    'tools/docs/build_db.py': 'собирает docs/db.md',
    'tools/docs/build_map.py': 'собирает docs/map.md',
    'tools/docs/check_split.py': 'сверка разбиения _claude-old.md',
    'tools/docs/split_claude_old.py': 'режет _claude-old.md на docs/*.md',
    'tools/rooms/detective.py': 'рисует кабинет Титоса (день/вечер, зоны)',
    'tools/rooms/kit.py': 'набор для пиксельных комнат: слои, шрифт 3×5, вечер',
    'tools/rooms/office.py': 'рисует кабинет Полли (день/вечер, зоны)',
    'tools/rooms/props.py': 'спрайты пасхалок комнат',
    'tools/wobbleland/anno.py': 'ручная разметка карты: улицы, дома, значки',
    'tools/wobbleland/crests3.py': 'пиксельные гербы городов',
    'tools/wobbleland/dishes.py': 'пиксельные блюда для книги рецептов',
    'tools/wobbleland/make_map4.py': 'пиксельная карта map-pixel.png',
    'tools/wobbleland/sprites.py': 'мелкие спрайты карты',
}
MAXN = 5  # имён на файл (задание: 5–15)
# вспомогательные имена, которые не говорят, что в файле
GENERIC = {'esc', 'json', 'fail', 'errText', 'load', 'open', 'close', 'show', 'save', 'wait', 'toast', 'body', 'html',
           'list', 'all', 'one', 'field', 'admin', 'post', 'loop', 'pause', 'resume', 'emoji', 'more', 'shade', 'stamp',
           'finish', 'pair', 'flash', 'click', 'find', 'card', 'draw', 'line', 'pick', 'place', 'update', 'render', 'build',
           'snippet', 'label', 'blocks', 'changed', 'thumb', 'over', 'shrink', 'match', 'sorted', 'heart', 'download', 'copy',
           'chr', 'round', 'canvas', 'save', 'star', 'keep', 'fit', 'cover', 'hash', 'value', 'slug', 'parse', 'convert',
           'grad', 'uri', 'leaf', 'bulb', 'corn', 'flower', 'stars', 'bat', 'pumpkin', 'ring', 'make', 'berry', 'lemon', 'bowl',
           'house', 'icon', 'mode', 'digits', 'boxsum', 'majority', 'canShare', 'check', 'login', 'google', 'salary', 'start',
           'dashboardLocal', 'closePop', 'sname', 'localTime', 'medal', 'refresh', 'imgUrl', 'tile', 'wrapText', 'beep',
           'minutes', 'peck', 'face', 'flyTo', 'putProp', 'hdShoe', 'drawItem', 'apply', 'zoomAt', 'renderTear', 'closePanel',
           'getAdded', 'delArt', 'hexLab', 'kmeans', 'card', 'openFn', 'gButton', 'renderForm', 'adminTools', 'showPast', 'countdown',
           'prize', 'blobOf', 'linkFor', 'autoPanel', 'tags', 'secsOf'}
GENERATED = ('extra-palettes.js', 'rooms-data.js', 'wobbleland-data.')

# группы RULE_DEFAULTS: первый ключ строки → название
RULE_GROUPS = {
    'daily': 'пуговки за действия', 'levels': 'уровни и бейджи (из BTN)', 'shopMax': 'магазин: лимиты и цены',
    'lowPct': 'запас «мало / обычно / много»', 'adventLastJan': 'адвент', 'aiStreak': 'ИИ-рисунки',
    'sellOn': 'продажа вещей', 'gameOn': 'Пуговичный дождь (награды в %)', 'potionOn': 'Зельеварня (награды в %)',
    'potionSeason': 'Зельеварня: сезон, полка', 'indexOn': 'цены', 'restockOn': 'пополнение',
    'cond': 'условия бейджей (cond)',
}

JS_FUNC = re.compile(r'^\s{0,2}(?:export\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)\s*\(', re.M)
JS_CONST = re.compile(r'^\s{0,2}(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=', re.M)
JS_WIN = re.compile(r'\bwindow\.([A-Z][\w$]*)\s*=')
PY_DEF = re.compile(r'^def\s+(\w+)', re.M)
PY_CONST = re.compile(r'^([A-Z][A-Z0-9_]*)\s*=', re.M)


def head_comment(src):
    for l in src.splitlines()[:6]:
        l = l.strip()
        if l.startswith('//') or l.startswith('#') and not l.startswith('#!'):
            return l.lstrip('/# ').split('. ')[0][:90]
        if l.startswith('"""'):
            return l.strip('"').split('. ')[0][:90]
    return ''


def names(path, src):
    """5–15 главных имён: экспорт в window, самые используемые функции и КОНСТАНТЫ."""
    if path.suffix == '.py':
        funcs, consts, win = PY_DEF.findall(src), PY_CONST.findall(src), []
    else:
        funcs = JS_FUNC.findall(src)
        allc = JS_CONST.findall(src)
        consts = [c for c in allc if re.fullmatch(r'[A-Z][A-Z0-9_]+', c)]
        funcs += [c for c in allc if c not in consts and re.search(rf'\b{re.escape(c)}\s*=\s*(?:async\s*)?(?:\([^)]*\)|[\w$]+)\s*=>', src)]
        win = list(dict.fromkeys(JS_WIN.findall(src)))
    if any(g in path.name for g in GENERATED):
        return win[:5]

    def uses(n):
        return len(re.findall(rf'(?<![\w$.]){re.escape(n)}\b', src))
    worker = path.parent.name == 'worker'
    if worker:
        win = []
    maxn = 12 if worker else MAXN
    tiny = {'esc', 'json', 'fail', 'main', 'api', 'err'} | (SKIP if worker else set())
    funcs = sorted({f for f in funcs if len(f) > 2 and f not in tiny}, key=lambda n: (-uses(n), n))
    consts = sorted({c for c in consts if len(c) > 2}, key=lambda n: (-uses(n), n))
    pick = win[:3] + consts[:3 if not worker else 6]
    pick += [f for f in funcs if f not in pick and f not in GENERIC][:maxn - len(pick)]
    if len(pick) < 5:  # мелкий файл — добираем и «общими» именами
        pick += [f for f in funcs if f not in pick][:5 - len(pick)]
    return pick[:maxn]


def kb(n):
    return f'{n / 1024:.0f}K' if n >= 1024 else f'{n}B'


def file_line(path):
    src = path.read_text(encoding='utf-8', errors='replace')
    rel = path.relative_to(ROOT).as_posix()
    desc = DESC.get(rel) or head_comment(src)
    ns = names(path, src)
    return f'- `{rel}` ({kb(path.stat().st_size)}) — {desc}' + (': ' + ', '.join(ns) if ns else '')


def top_funcs(src):
    imported = {x.strip().split(' as ')[-1] for m in re.finditer(r'import\s*\{([^}]*)\}', src) for x in m.group(1).split(',') if x.strip()}
    return imported | set(JS_FUNC.findall(src)) | {c for c in JS_CONST.findall(src)
                                       if re.search(rf'\b{re.escape(c)}\s*=\s*(?:async\s*)?(?:\([^)]*\)|[\w$]+)\s*=>', src)}


SKIP = {'set', 'add', 'link', 'randomHex', 'sha256', 'key', 'template', 'copies', 'imgGet', 'json', 'fail', 'needUser', 'needAdmin', 'currentUser', 'isAdmin', 'getMeta', 'setMeta', 'parseJ', 'now',
        'rigaDay', 'loadRules', 'admin', 'one', 'all', 'esc', 'cookie', 'body', 'readJson', 'num', 'clamp', 'int', 'str'}


def handler(body_text, funcs, counts):
    """f — маршрут возвращает f(…); ~f — обработчик прямо в route(), f — самая «своя» из вызываемых функций; — — только SQL."""
    for m in re.finditer(r'return\s+(?:json\(\s*)?(?:\{\s*\.\.\.\(?)?(?:await\s+)?([A-Za-z_$][\w$]*)\s*\(', body_text):
        n = m.group(1)
        if n in funcs and n not in SKIP:
            return n
    called = {m.group(1) for m in re.finditer(r'(?<![\w$.])([A-Za-z_$][\w$]*)\s*\(', body_text)}
    called = [n for n in called if n in funcs and n not in SKIP]
    if not called:
        return '—'
    return '~' + min(called, key=lambda n: (counts.get(n, 0), n))


def call_counts(src):
    return {n: len(re.findall(rf'(?<![\w$.]){re.escape(n)}\s*\(', src)) for n in top_funcs(src)}


def routes_index(src):
    funcs, counts = top_funcs(src), call_counts(src)
    rx = re.compile(r"(?:m === '(GET|POST|PUT|DELETE)' && )?p(?: === '(/api/[^']*)'|\.startsWith\('(/api/[^']*)'\)|\.match\(/\^((?:\\/[\w-]+)+))")
    hits = []
    for m in rx.finditer(src):
        path = m.group(2) or (m.group(3) and m.group(3) + '*') or (m.group(4) and m.group(4).replace('\\/', '/') + '/…')
        line_start = src.rfind('\n', 0, m.start()) + 1
        if src[m.start() - 1] == '!':
            continue
        if not src[line_start:m.start()].lstrip().startswith(('if', '}', 'else')) and 'if (' not in src[line_start:m.end()]:
            continue
        meth = m.group(1) or ''
        if not meth:
            mm = re.search(r"m === '(GET|POST|PUT|DELETE)'", src[line_start:m.end() + 40])
            meth = mm.group(1) if mm else ''
        hits.append((m.start(), meth, path))
    out, seen = [], set()
    for i, (pos, meth, path) in enumerate(hits):
        end = hits[i + 1][0] if i + 1 < len(hits) else pos + 3000
        h = handler(src[pos:end][:3000], funcs, counts)
        if (meth, path) in seen or (not meth and any(k[1] == path for k in seen)):
            continue
        seen.add((meth, path))
        out.append(f'{meth} {path} → {h}'.strip())
    return out


def routes_blog(src):
    funcs, counts = top_funcs(src), call_counts(src)
    out = []
    hits = []
    for m in re.finditer(r"(?:m === '(GET|POST)' && )?p === '(/api/blog/[^']*|/sitemap-blog\.xml)'", src):
        hits.append((m.start(), m.group(1) or '', m.group(2)))
    adm = src.find("p.startsWith('/api/blog/admin/')")
    for m in re.finditer(r"(?:m === '(GET|POST)' && )?a === '([\w-]+)'", src):
        if m.start() > adm:
            hits.append((m.start(), m.group(1) or '', '/api/blog/admin/' + m.group(2)))
    hits.sort()
    seen = set()
    for i, (pos, meth, path) in enumerate(hits):
        end = hits[i + 1][0] if i + 1 < len(hits) else pos + 2000
        key = (meth, path)
        if key in seen:
            continue
        seen.add(key)
        out.append(f'{meth} {path} → {handler(src[pos:end][:2500], funcs, counts)}'.strip())
    return out


def rule_defaults(src):
    m = re.search(r'const RULE_DEFAULTS = \{\n(.*?)\n\};', src, re.S)
    if not m:
        return []
    groups, cur = [], None
    text = m.group(1)
    for line in text.split('\n'):
        code = re.sub(r'//.*', '', line).strip()
        if not code:
            continue
        keys = re.findall(r'(?:^|[,{]\s*)(\w+)\s*:', code)
        if not keys:
            continue
        if line.startswith('  ') and not line.startswith('    ') and keys[0] in RULE_GROUPS:
            cur = [RULE_GROUPS[keys[0]], []]
            groups.append(cur)
        elif cur is None or (line.startswith('  ') and not line.startswith('    ')):
            cur = ['прочее', []]
            groups.append(cur)
        if keys[0] == 'cond':
            keys = keys[1:]
        cur[1] += [k for k in keys if k not in cur[1]]
    return groups


def main():
    old_common = ''
    if OUT.exists():
        t = OUT.read_text(encoding='utf-8')
        if COMMON in t:
            old_common = t[t.index(COMMON):].strip()
    files = sorted((ROOT / 'worker').glob('*.js')) + sorted((ROOT / 'site' / 'assets').glob('*.js')) + [ROOT / 'build.py']
    files += sorted(p for p in (ROOT / 'tools').rglob('*') if p.suffix in ('.py', '.js') and 'source' not in p.parts)
    out = ['# Карта кода', '',
           '_`python3 tools/docs/build_map.py`: файл (размер) — что в нём: главные имена (первыми — то, что кладётся в `window`). Номеров строк нет — искать grep-ом. «Общее» внизу при пересборке сохраняется._', '']
    groups = [('worker/', 'Сервер'), ('site/assets/', 'Браузер (site/assets)'), ('build.py', 'Сборка'), ('tools/', 'Инструменты (tools)')]
    for prefix, title in groups:
        out += [f'## {title}', '']
        out += [file_line(p) for p in files if p.relative_to(ROOT).as_posix().startswith(prefix)]
        out.append('')
    idx = (ROOT / 'worker' / 'index.js').read_text(encoding='utf-8')
    blog = (ROOT / 'worker' / 'blog.js').read_text(encoding='utf-8')
    r1, r2 = routes_index(idx), routes_blog(blog)
    r1 = [r.replace(' /api/', ' /').replace('/api/', '/', 1) if r.startswith('/api/') else r.replace(' /api/', ' /') for r in r1]
    r2 = [r.replace(' /api/blog/', ' ').replace('/api/blog/', '', 1) for r in r2]
    out += [f'## Маршруты worker/index.js ({len(r1)})', '', '_без `/api`; `f` — возвращает f(); `~f` — код в `route()`, главная вызываемая f; — — только SQL_', '', ' · '.join(r1), '']
    out += [f'## Маршруты worker/blog.js ({len(r2)})', '', '_пути без `/api/blog/`; обозначения те же_', '', ' · '.join(r2), '']
    out += ['## RULE_DEFAULTS (worker/index.js) по группам', '', '_правка — кабинет → 📜 Правила (meta `rules`)_', '']
    out += [f'- {g}: ' + ', '.join(ks) for g, ks in rule_defaults(idx)]
    out += ['', old_common or f'{COMMON}\n\n_Сюда следующие этапы дописывают общие сведения о коде._']
    text = '\n'.join(out) + '\n'
    OUT.write_text(text, encoding='utf-8')
    size = len(text.encode())
    print(f'{OUT.relative_to(ROOT)}: {len(files)} файлов, маршрутов {len(r1)} + {len(r2)}, {size} байт' + ('' if size <= LIMIT else ' — БОЛЬШЕ 15 КБ!'))


if __name__ == '__main__':
    main()
