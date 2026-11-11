"""Учебник норвежского /norsk/ (worker/norsk.js): content/norsk/shell.html + extra.js + уроки content/norsk/{a1..b2}.js + engine.js
→ worker/norsk-page.js (строка NORSK_HTML). В site/ не кладём — там всё публично.
Запуск после правки: python3 tools/norsk_page.py [--html путь] (--html — ещё и готовая страница файлом, для проверки в браузере)."""
import json, pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
D = ROOT / 'content/norsk'
shell = (D / 'shell.html').read_text(encoding='utf-8')
files = [D / 'extra.js'] + sorted(D.glob('[abc][12]*.js')) + [D / 'series.js', D / 'topics.js', ] + sorted(D.glob('trans-*.js'))  # trans.js — переводы примеров и предложений (NO_TR)  # series.js — сцены из сериалов (SR), topics.js — тематические словари (TOP)  # extra.js — помощники NOTE/ST/BK и справочники; a1.js … c2.js — уроки вместе с их NOTE, ST и главой книги BK
units = '\n'.join(f.read_text(encoding='utf-8') for f in files if f.exists())
engine = (D / 'engine.js').read_text(encoding='utf-8')
for name, part in (('уроки', units), ('движок', engine)):
    if '</script' in part.lower(): sys.exit(f'{name}: внутри есть </script — страница сломается')
NB = (ROOT / 'content/shared/notebook.js').read_text(encoding='utf-8')  # 📒 блокнот (docs/site.md «Блокнот в учебниках»)
def notebook(html, book):
    if '</script' in NB.lower() or html.count('</body>') != 1: raise SystemExit('блокнот: не встроить')
    return html.replace('</body>', f"<script>window.PPNB_BOOK = '{book}';\n{NB}</script>\n</body>")
KB = (ROOT / 'content/shared/keys.js').read_text(encoding='utf-8')  # ⌨️ кнопки особых букв (docs/site.md «Кнопки особых букв»)
def keys(html, chars):
    if '</script' in KB.lower() or html.count('</body>') != 1: raise SystemExit('кнопки букв: не встроить')
    return html.replace('</body>', f"<script>window.PPKEYS = '{chars}';\n{KB}</script>\n</body>")
html = shell.replace('/*UNITS*/', units).replace('/*ENGINE*/', engine)
html = notebook(html, 'norsk')
html = keys(html, 'å æ ø é è ê ó ô')
out = ROOT / 'worker/norsk-page.js'
out.write_text('// Собрано tools/norsk_page.py из content/norsk/ — руками не править.\nexport const NORSK_HTML = ' + json.dumps(html, ensure_ascii=False) + ';\n', encoding='utf-8')
if '--html' in sys.argv: pathlib.Path(sys.argv[sys.argv.index('--html') + 1]).write_text(html, encoding='utf-8')
print(out, len(html))
