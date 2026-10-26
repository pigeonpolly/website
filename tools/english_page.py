"""Учебник английского /english/ (worker/english.js): content/english/shell.html + уроки content/english/{a1..c2}*.js + extra.js + engine.js
→ worker/english-page.js (строка ENGLISH_HTML). В site/ не кладём — там всё публично.
Запуск после правки: python3 tools/english_page.py [--html путь] (--html — ещё и готовая страница файлом, для проверки в браузере)."""
import json, pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
D = ROOT / 'content/english'
shell = (D / 'shell.html').read_text(encoding='utf-8')
files = sorted(D.glob('[abc][12]*.js')) + [D / 'extra.js', D / 'book.js', D / 'notes.js', D / 'smalltalk.js', D / 'pics.js']  # book.js — «Алиса» (tools/english_book.py), notes.js — книга, «Своими словами», истории слов, реплики вороны  # a1.js, a2.js, b1.js, b1b.js … c2.js — по порядку уровней
units = '\n'.join(f.read_text(encoding='utf-8') for f in files if f.exists())
engine = (D / 'engine.js').read_text(encoding='utf-8')
for name, part in (('уроки', units), ('движок', engine)):
    if '</script' in part.lower(): sys.exit(f'{name}: внутри есть </script — страница сломается')
html = shell.replace('/*UNITS*/', units).replace('/*ENGINE*/', engine)
out = ROOT / 'worker/english-page.js'
out.write_text('// Собрано tools/english_page.py из content/english/ — руками не править.\nexport const ENGLISH_HTML = ' + json.dumps(html, ensure_ascii=False) + ';\n', encoding='utf-8')
if '--html' in sys.argv: pathlib.Path(sys.argv[sys.argv.index('--html') + 1]).write_text(html, encoding='utf-8')
print(out, len(html))
