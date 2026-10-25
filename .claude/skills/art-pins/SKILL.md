---
name: art-pins
description: Новый арт Алины на сайт + ~10 пинов Pinterest с ним «по старой схеме» (POV, мемы, палитра, списки) и карточки в Notion «Pinterest pins». Использовать, когда Алина присылает картинку (в т. ч. HEIC с телефона) и просит добавить её в галерею и/или сделать с ней пины.
---

# Арт → галерея → пины → Notion

Образец целиком — 25.10.2026, «(2026) Pigeon Polly is hiding something», пины №242–251: `tools/pins/pins3.js`, docs/palettes.md → Pinterest.

## 1. Арт в галерею
- Галерея — по префиксу из `tools/import_uploads.py` (`polly_` → bird = «Pigeon Polly», `chew_` → snail, `titos_` …). Подпись — **по-английски**, как у соседей: `(ГОД) Pigeon Polly …` (Алина может написать её по-русски — перевести).
- HEIC ImageMagick здесь не читает: `pip install -q pillow-heif`, затем
  `python3 -c "import pillow_heif,sys;from PIL import Image,ImageOps;pillow_heif.register_heif_opener();ImageOps.exif_transpose(Image.open(sys.argv[1])).convert('RGB').save(sys.argv[2],quality=95)" ВХОД "polly_(2026) Pigeon Polly ….jpg"` (в корень репо). Удалить скачанные `*.whl`, если появились.
- `python3 tools/import_uploads.py` дописывает картинку в КОНЕЦ `content/galleries/<гал>.json` — перенести её первой (новые сверху): `d.insert(0, d.pop())`.
- Подпись RU/LV: `python3 tools/i18n_add.py "Pigeon Polly …" "Голубь Полли …" "Balodis Pollija …"` (предупреждение «встречается 2 раза» — это alt + подпись, норма).
- Палитра арта: строка в `tools/palette_titles.py` (`'ключ': ('EN', 'RU', 'LV')`) → `python3 tools/palettes.py` (сам допишет `content/palettes.json` и `content/extra-order.json`).

## 2. Пины
- Сначала **рассмотреть арт** (Read картинки) и найти шутку/сюжет — от него все тексты. Сюжет не очевиден — записать в «Допущения».
- Номера: следующий свободный в Notion — SQL по `collection://95d59f84-0766-4ab5-bed9-b612a3db0f64`: `SELECT "№" … ORDER BY CAST("№" AS INTEGER) DESC LIMIT 3` (сторис тоже занимают номера). Сверить с docs/palettes.md.
- Генератор: скопировать `tools/pins/pins3.js` → `tools/pins/pinsN.js`, поменять `KEY` (ключ картинки = имя файла без .jpg), `UTM` (`utm_campaign=<слово>`), `ALT` и массив `PINS`. Шаблоны: `pov` (кремовый/голубой/сиреневый фон, фото с лентой, подпись, птичка с репликой), `meme` (белый верх, арт, субтитр; `zoom`+`pos` — чтобы мемы не были одинаковыми), `pal` (тёмный, палитра арта), `list` (тег/кикер, арт, 5–10 пунктов, `two` — в 2 колонки).
- Набор на ~10: 3 POV, 3 мема, 3 списка (один — «идеи что нарисовать» со ссылкой на /challenge/), 1 палитра (ссылка `/palettes/#<KEY>`). Остальные ведут в галерею (`/art-portfolio/bird/` и т. п.). Всё на английском, аудитория 25–40, без выдуманных фактов об Алине.
- `node tools/pins/pinsN.js` → `site/images/pins/pin-NNN.jpg` + `tools/pins/pinsN.json`. «⚠ content bottom» у мемов с `zoom` — не ошибка; у остальных — текст налез на подвал.
- Проверить листом: `montage pin-…jpg -tile 5x2 -geometry 360x540+6+6 scratchpad/new.jpg` → Read. Пустоты под списком — увеличить `artH`.

## 3. Сборка, docs, пуш
- `python3 build.py`; строка в docs/palettes.md → Pinterest (номера, кампания, генератор, следующий №) и в docs/plan-status.md (с допущениями).
- Коммит, пуш в `main` (и в рабочую ветку сессии).

## 4. Notion (после пуша — картинки должны открываться)
- По строке на пин в «Pinterest pins» (`data_source_id` выше): `№`, `Тип` (Основной / Мем / Палитра / Полезный), `Заголовок`, `Ссылка`, `Актуальность` (массив: хеллоуинские — «Октябрь», «Осень»; прочие — «Круглый год»), `Язык` EN, `Опубликован` `__NO__`.
- Текст страницы — как у №001: картинка `https://www.pigeonpolly.com/images/pins/pin-NNN.jpg`, затем `### Title`, `### Description`, `### Link`, `### Alt text` в блоках ```` ```txt ````, последней строкой `Topics: …`. Собрать из `pinsN.json` скриптом, отправить одним `notion-create-pages`.

## 5. Алине
- Один лист с пинами (SendUserFile) и до 5 строк: номера, что в Notion, допущения.
