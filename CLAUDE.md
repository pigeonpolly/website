# pigeonpolly.com — контекст для Claude

Сайт Алины Откинской (бренд Pigeon Polly Art Lab): художница, иллюстратор и learning experience designer из Риги.
Живой сайт: https://www.pigeonpolly.com (EN), /lv/ (латышский), /ru/ (русский).

## Как общаться с Алиной
- Отвечать **по-русски**, коротко и по делу, без лишних технических подробностей.
- Алина визуал: изменения дизайна показывать **скриншотами** (Playwright + Chromium), а не описывать словами.
- Не придумывать факты о ней (даты, места работы, названия книг) — спрашивать или брать из `content/`.
- Она редактирует только через Claude: после правок — собрать, проверить, закоммитить и **запушить в `main`** (так сайт и обновляется).

## Как устроено
- Статический сайт без фреймворков: HTML + CSS + немного JS. Сборка — `python3 build.py` (только стандартная библиотека Python).
- `site/` — готовый сайт (он и публикуется). HTML-страницы в `site/` **генерируются**, руками не править — править `src/` и `content/`, затем `python3 build.py`. CSS/JS/картинки в `site/assets/`, `site/images/`, `site/files/` правятся напрямую.
- `src/layout.html` — общий шаблон (шапка, меню, подвал, окно «Write to me», мета-теги, Person schema).
- `src/pages/*.html` — страницы. Плейсхолдеры: `{{gallery:имя}}`, `{{ebooks}}`, `{{projects}}`, `{{cv}}`, `{{block:имя}}`.
- `src/blocks/*.html` — блоки главной (coming-soon, patreon, about, sketching-guides, game). Их `<style>` при сборке автоматически ограничивается блоком (`#blk-имя`); правила для `html, body` переносятся на сам блок.
- `content/galleries/*.json` — галереи (full, thumb, w, h, caption). `content/ebooks.json` — книги. `content/projects.json` — книжная полка проектов (темы и цвета, описания). `content/cv.json` — опыт, образование, курсы (`"current": true` — зелёный мигающий кружок).
- `build.py` — список страниц `PAGES`, меню `NAV`, подменю `PORTFOLIO`, языки `LANGS`.
- `_held/` — готово, но **не публиковать без просьбы**: Wobbleland (страница, квиз), обложки комиксов «Robbery on the Wobbleton Express» и «The Paper Girl».

## Языки
- Английский — основа. LV/RU строятся из английского HTML заменой фраз по словарям `content/i18n/lv.json`, `content/i18n/ru.json` (ключ — точная английская строка из готового HTML, включая `&amp;`, `&#39;`, `>…<`). Внутренние ссылки автоматически получают префикс `/lv/`, `/ru/`.
- Описания проектов: `content/i18n/projects.ru.json` (полностью), `projects.lv.json` (без пунктов — они пока на английском).
- **Любой новый английский текст надо добавить в оба словаря**, иначе в LV/RU останется английский.
- Подписи к работам и названия проектов/книг намеренно не переводятся.

## Картинки
- Новые работы: Алина загружает файлы через GitHub (Add file → Upload files) в корень репозитория с префиксами `polly_`, `chew_`, `titos_`, `pumpkin_`, `anxiety_`, `sketchbook_`, `aiart_`, `exhibition_`, `publication_`; подпись — в имени: `polly_(2026) Pigeon Polly Fancy Life.jpg`. Затем `python3 tools/import_uploads.py` (ужимает, раскладывает, удаляет исходники) и `python3 build.py`.
- Или вручную: `python3 tools/add_images.py <галерея> файлы…`. Нужен ImageMagick.

## Дизайн
- Цвета: фон `#2B1A51`, второй фиолетовый `#534AB7`, текст `#F3EFFA`, приглушённый `#D9D3F2`, персик `#F0A987`, оранжевый `#D85A30`, звезда `#E9A93B`, точки `#F5C4B3`, светлые карточки `#F4F0FA`.
- Шрифты: Fraunces 600 (заголовки), Karla 400/500/700 (текст), Google Fonts.
- Кнопки-«пилюли». Главная картинка — Полли-астронавт в арке с оранжевой рамкой.
- Меню переходит в ☰ на ширине ≤1440px (латышские пункты длинные). После правок шапки проверять, что она помещается на 360–1600px во всех трёх языках.
- Полли-питомец: `site/assets/polly.js` (пиксельный спрайт; гуляет, сидит на шапке и кнопках, клюёт, спит с z z Z; фразы на EN/LV/RU). `?pollydebug` в адресе — лог действий в консоль.

## Подключено
- Хостинг: Cloudflare Workers (проект `website`, `wrangler.jsonc` публикует папку `site/`), автодеплой на каждый пуш в `main`. Домен pigeonpolly.com и www привязаны в Cloudflare; редирект root → www.
- Форма «Write to me»: FormSubmit, адрес `https://formsubmit.co/ajax/769d04d721e5563890ed721ba698f9bc` (настоящий e-mail в коде не светить).
- Аналитика: Cloudflare Web Analytics (вкладка Visitors). Google Search Console подключена, sitemap: `/sitemap.xml`.
- Превью ссылок: `site/assets/og-image.jpg` (1200×630).

## Проверка перед пушем
1. `python3 build.py`
2. Поднять локально: `cd site && python3 -m http.server 8766`, открыть Playwright-ом (Chromium в `/opt/pw-browsers/chromium`) на ширинах 390 и 1440, посмотреть скриншоты, проверить, что нет ошибок в консоли и горизонтальной прокрутки.
3. `git add -A && git commit && git push origin main`.
