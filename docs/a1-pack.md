# A1 English Lab (86.1–86.2)

Не часть сайта: `a1-pack/`, скилл `.claude/skills/a1-pack`. Английский A1 для взрослых, инструкции на латышском, на «tu».
- Формат (с 20.11, по просьбе Алины): на тему **2 самодостаточных HTML** — `<slug>-prezentacija.html` (интерактивные слайды) и `<slug>-tema.html` (история, правило, слова с озвучкой, упражнения с проверкой и XP, факты, видео, ошибки, тест, домашка → PDF). Прежние 7 материалов убраны — docs/retired.md.
- Движок: `a1-pack/lab/lab.js` (рендер из `window.LAB`, типы слайдов/упражнений — SCHEMA.md), `lab.css` (тёплый фон, белые карточки, Inter + Instrument Serif, без чёрных заливок кроме блока домашки). Озвучка — `speechSynthesis` en-GB.
- Домашка → PDF: html2pdf.js 0.10.1 (MIT) встроен в tema.html как `text/x-lazy`, рендер в отдельном iframe (весь документ html2canvas вешает); запасной путь — печать `body.print-rep`.
- Сборка: `tools/build_lab.py` (инлайнит CSS/JS/шрифты woff2 из `fonts/web/`/SVG Оскара), проверка `tools/check_lab.py`.
- Кот: `tools/draw_oscar.py` → `design/oscar/*.svg`, лист `design/oscar-sheet.png`; персонаж — `OSKARS.md` (британец, гид Hop & Hat Tours).
- `a1-pack/veidnes/` — пустые Word/PowerPoint прежнего вида, ждут решения Алины.
