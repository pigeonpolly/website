"""Учебник /study/ (worker/study.js): content/study/textbook.html → worker/study-page.js (строка STUDY_HTML).
Страница не попадает в site/, иначе её мог бы открыть любой. Запуск после правки учебника: python3 tools/study_page.py"""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
html = (ROOT / 'content/study/textbook.html').read_text(encoding='utf-8')
out = ROOT / 'worker/study-page.js'
out.write_text('// Собрано tools/study_page.py из content/study/textbook.html — руками не править.\nexport const STUDY_HTML = ' + json.dumps(html, ensure_ascii=False) + ';\n', encoding='utf-8')
print(out, len(html))
