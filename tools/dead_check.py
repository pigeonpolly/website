#!/usr/bin/env python3
"""Проверка «хвостов»: что на сайте осталось от убранного (docs/retired.md) и что больше никто не использует.

  python3 tools/dead_check.py          — отчёт; код выхода 1, если в живом коде есть маркер из docs/retired.md
  python3 tools/dead_check.py --short  — только итог одной строкой

Ищет:
  1. маркеры из docs/retired.md (колонка «Маркер» в `кавычках`) в живом коде — значит, убранное снова где-то используется;
  2. блоки src/blocks, которые не подключены ни к одной собираемой странице;
  3. страницы src/pages, которые build.py не собирает (кроме языковых копий *.ru/*.lv и страниц ошибок);
  4. скрипты и стили site/assets, на которые нет ни одной ссылки из живого кода;
  5. адреса /api/…, которые есть в worker, но их никто не вызывает (подсказка, не ошибка: бывают ссылки из писем и составные адреса).
Только читает файлы, ничего не меняет.
"""
import glob
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
# большие сгенерированные файлы — не читаем (и не нужны: на них ссылаются по имени)
SKIP = re.compile(r'(-data(\.\w+)?\.js|catalog\.json|search-\w+\.json|day-colors\.json|extra-palettes)')
ERROR_PAGES = {'404.html', '500.html', '503.html', 'pause.html'}


def T(p):
    try:
        return open(p, encoding='utf-8', errors='ignore').read()
    except OSError:
        return ''


build = T('build.py')
built = set(re.findall(r'"([\w\-.]+\.html)"', build))
pages = sorted(glob.glob('src/pages/*.html'))


def is_built(p):
    n = os.path.basename(p)
    stem = re.sub(r'\.(ru|lv)\.html$', '.html', n)  # privacy.ru.html — языковая копия privacy.html
    return n in built or stem in built or n in ERROR_PAGES


live_pages = [p for p in pages if is_built(p)]
dead_pages = [p for p in pages if not is_built(p)]

# блоки: от живых страниц и шаблонов, с вложенными блоками
blocks = {os.path.basename(x)[:-5]: x for x in glob.glob('src/blocks/*.html')}
live_blocks, todo = set(), live_pages + glob.glob('src/*.html')
while todo:
    f = todo.pop()
    for n in re.findall(r'\{\{block:([\w-]+)\}\}', T(f)):
        if n in blocks and n not in live_blocks:
            live_blocks.add(n)
            todo.append(blocks[n])
dead_blocks = sorted(set(blocks) - live_blocks)

live_files = (live_pages + glob.glob('src/*.html') + [blocks[n] for n in live_blocks] + ['build.py', 'site/_redirects', 'wrangler.jsonc']
              + glob.glob('worker/**/*.js', recursive=True) + glob.glob('content/**/*.js', recursive=True))
live_text = '\n'.join(T(f) for f in live_files)

assets = [a for a in sorted(os.listdir('site/assets')) if a.endswith(('.js', '.css')) and not SKIP.search(a)]
atext = {a: T('site/assets/' + a) for a in assets}
reach = {a for a in assets if a in live_text}
grow = True
while grow:
    grow = False
    for a in list(reach):
        for o in assets:
            if o not in reach and o in atext[a]:
                reach.add(o)
                grow = True
dead_assets = [a for a in assets if a not in reach]

# адреса API без вызова
front = '\n'.join(atext[a] for a in reach) + '\n' + '\n'.join(T(f) for f in live_files if not f.startswith('worker/')) \
    + '\n'.join(T(f) for f in glob.glob('worker/*page*.js') + ['worker/avis.js', 'worker/mail.js'])
wtext = '\n'.join(T(f) for f in glob.glob('worker/*.js'))
routes = sorted(set(re.findall(r"['\"`](/api/[\w\-/]+[\w])", wtext)))
quiet_routes = [r for r in routes if r not in front and r[5:] not in front
                and not any(r.startswith(p) for p in ('/api/admin/', '/api/dev/'))]

# маркеры убранного
retired, sec = [], ''
for line in T('docs/retired.md').splitlines():
    if line.startswith('## '):
        sec = line
    # проверяются только строки раздела «## Убрано…»; «## Ждёт чистки» — список того, что ещё предстоит удалить
    if sec.startswith('## Убрано') and line.startswith('|') and '`' in line:
        cells = [c.strip() for c in line.strip('|').split('|')]
        for m in re.findall(r'`([^`]+)`', cells[-1] if cells else ''):
            retired.append((cells[0], m))
hits = []
check_files = [f for f in live_files] + ['site/assets/' + a for a in reach]
for what, m in retired:
    where = [f for f in check_files if m in T(f)]
    if where:
        hits.append((what, m, where[:4]))

if '--short' in sys.argv:
    print(f'dead_check: убранное в коде {len(hits)}, блоков-сирот {len(dead_blocks)}, страниц {len(dead_pages)}, '
          f'файлов assets {len(dead_assets)}, тихих /api {len(quiet_routes)}')
else:
    def show(title, items):
        print(f'\n== {title}: {len(items)}')
        for i in items:
            print('  ', i)
    show('Убранное (docs/retired.md) снова в живом коде — ОШИБКА', [f'{w} · `{m}` → {", ".join(f)}' for w, m, f in hits])
    show('Страницы src/pages, которые не собираются', [os.path.basename(p) for p in dead_pages])
    show('Блоки src/blocks без страницы', dead_blocks)
    show('site/assets без ссылок из живого кода', dead_assets)
    show('Адреса /api без вызова с сайта (проверить: письма, составные адреса)', quiet_routes)
sys.exit(1 if hits else 0)
