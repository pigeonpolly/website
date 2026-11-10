"""Учебник норвежского /norsk/ (worker/norsk.js): content/norsk/shell.html + extra.js + уроки content/norsk/{a1..b2}.js + engine.js
→ worker/norsk-page.js (строка NORSK_HTML). В site/ не кладём — там всё публично.
Запуск после правки: python3 tools/norsk_page.py [--html путь] (--html — ещё и готовая страница файлом, для проверки в браузере)."""
import json, pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
D = ROOT / 'content/norsk'
shell = (D / 'shell.html').read_text(encoding='utf-8')
files = [D / 'extra.js'] + sorted(D.glob('[ab][12]*.js'))  # extra.js — помощники NOTE/ST/BK и справочники; a1.js … b2.js — уроки вместе с их NOTE, ST и главой книги BK
units = '\n'.join(f.read_text(encoding='utf-8') for f in files if f.exists())
engine = (D / 'engine.js').read_text(encoding='utf-8')
for name, part in (('уроки', units), ('движок', engine)):
    if '</script' in part.lower(): sys.exit(f'{name}: внутри есть </script — страница сломается')
html = shell.replace('/*UNITS*/', units).replace('/*ENGINE*/', engine)
out = ROOT / 'worker/norsk-page.js'
out.write_text('// Собрано tools/norsk_page.py из content/norsk/ — руками не править.\nexport const NORSK_HTML = ' + json.dumps(html, ensure_ascii=False) + ';\n', encoding='utf-8')
if '--html' in sys.argv: pathlib.Path(sys.argv[sys.argv.index('--html') + 1]).write_text(html, encoding='utf-8')
print(out, len(html))
