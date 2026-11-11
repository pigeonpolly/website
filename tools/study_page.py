"""Учебник /study/ (worker/study.js): content/study/textbook.html → worker/study-page.js (строка STUDY_HTML).
Страница не попадает в site/, иначе её мог бы открыть любой. Запуск после правки учебника: python3 tools/study_page.py"""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
NB = (ROOT / 'content/shared/notebook.js').read_text(encoding='utf-8')  # 📒 блокнот (docs/site.md «Блокнот в учебниках»)
def notebook(html, book):
    if '</script' in NB.lower() or html.count('</body>') != 1: raise SystemExit('блокнот: не встроить')
    return html.replace('</body>', f"<script>window.PPNB_BOOK = '{book}';\n{NB}</script>\n</body>")
html = (ROOT / 'content/study/textbook.html').read_text(encoding='utf-8')
html = notebook(html, 'study')
out = ROOT / 'worker/study-page.js'
out.write_text('// Собрано tools/study_page.py из content/study/textbook.html — руками не править.\nexport const STUDY_HTML = ' + json.dumps(html, ensure_ascii=False) + ';\n', encoding='utf-8')
print(out, len(html))
