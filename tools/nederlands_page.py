"""Учебник нидерландского /nederlands/ (worker/nederlands.js): content/nederlands/shell.html + extra.js + уроки content/nederlands/{a1..b2}.js + engine.js
→ worker/nederlands-page.js (строка NEDERLANDS_HTML). В site/ не кладём — там всё публично.
Запуск после правки: python3 tools/nederlands_page.py [--html путь] (--html — ещё и готовая страница файлом, для проверки в браузере)."""
import json, pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
D = ROOT / 'content/nederlands'
shell = (D / 'shell.html').read_text(encoding='utf-8')
files = [D / 'extra.js'] + sorted(D.glob('[abc][12]*.js')) + [D / 'series.js', D / 'topics.js', ] + sorted(D.glob('trans-*.js'))  # trans.js — переводы примеров и предложений (NL_TR)  # series.js — сцены из сериалов (SR), topics.js — тематические словари (TOP)  # extra.js — помощники NOTE/ST/BK и справочники; a1.js … c2.js — уроки вместе с их NOTE, ST и главой книги BK
units = '\n'.join(f.read_text(encoding='utf-8') for f in files if f.exists())
engine = (D / 'engine.js').read_text(encoding='utf-8')
for name, part in (('уроки', units), ('движок', engine)):
    if '</script' in part.lower(): sys.exit(f'{name}: внутри есть </script — страница сломается')
NB = (ROOT / 'content/shared/notebook.js').read_text(encoding='utf-8')  # 📒 блокнот (docs/site.md «Блокнот в учебниках»)
def notebook(html, book):
    if '</script' in NB.lower() or html.count('</body>') != 1: raise SystemExit('блокнот: не встроить')
    return html.replace('</body>', f"<script>window.PPNB_BOOK = '{book}';\n{NB}</script>\n</body>")
html = shell.replace('/*UNITS*/', units).replace('/*ENGINE*/', engine)
html = notebook(html, 'nederlands')
out = ROOT / 'worker/nederlands-page.js'
out.write_text('// Собрано tools/nederlands_page.py из content/nederlands/ — руками не править.\nexport const NEDERLANDS_HTML = ' + json.dumps(html, ensure_ascii=False) + ';\n', encoding='utf-8')
if '--html' in sys.argv: pathlib.Path(sys.argv[sys.argv.index('--html') + 1]).write_text(html, encoding='utf-8')
print(out, len(html))
