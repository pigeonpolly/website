# A1 English Pack (86.1–86.2)

Не часть сайта: папка `a1-pack/`, скилл `.claude/skills/a1-pack`. Курс английского A1 для взрослых, инструкции на латышском, на «tu».
- Дизайн: `a1-pack/design/pack.css` (токены, `--accent` = цвет темы, тонкие серые линии, без чёрных заливок), `pack.js` (показ слайдов F/A/←→, автосохранение полей, тесты по клику, печать textarea).
- Кот Оскар: `a1-pack/tools/draw_oscar.py` → `design/oscar/*.svg` (10 поз + дудлы; шарф/клубок/кофе = `var(--accent)`); лист — `design/oscar-sheet.png`. Персонаж: `a1-pack/OSKARS.md` (британец, гид Hop & Hat Tours в Лондоне; ошибки делают туристы Jānis/Līga).
- Шрифты (все LV-буквы): Nunito / Inter / Caveat в `a1-pack/fonts/`. Fredoka и Sniglet отброшены — нет ā ē ī ū ķ ļ ņ ģ; Grandstander — слишком грубый.
- Сборка: `tools/build_pack.py` (topic.json + parts/*.json → HTML) → `make_office.py` (DOCX/PPTX) → `render.js` (PNG Оскара, PDF) → `<slug>-pack.zip`. `tools/check_pack.py` — правила (слайды ≥ мин/3, 4–5 упражнений, ответы, источники BC/Cambridge/BBC). `tools/sheet.py` — контактный лист из PDF.
- Формат контента: `a1-pack/SCHEMA.md`. Пустые шаблоны для ручной работы: `a1-pack/veidnes/` (из `topics/_veidne`). Пример: `topics/to-be`.
