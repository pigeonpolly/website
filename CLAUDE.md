# pigeonpolly.com — правила для Claude

Сайт Алины Откинской (Pigeon Polly Art Lab): художница, иллюстратор, learning experience designer из Риги. https://www.pigeonpolly.com (EN), /lv/, /ru/.

## Как общаться с Алиной
- Отвечать **по-русски**, коротко, без технических подробностей.
- Дизайн показывать **скриншотами** (Playwright + Chromium), не словами.
- Факты о ней (даты, работы, книги) не придумывать — спросить или взять из `content/`.
- Она правит только через Claude: собрать, проверить, закоммитить, **запушить в `main`** (так сайт обновляется).

## Как устроено
- Статика без фреймворков; сборка `python3 build.py` (только stdlib).
- `site/` публикуется, HTML в нём **генерируется**: править `src/`, `content/`. `site/assets/`, `site/images/`, `site/files/` — напрямую.
- `src/layout.html` — шаблон (шапка, меню, подвал, «Write to me», мета, Person schema). `src/pages/*.html` — страницы: `{{gallery:имя}}`, `{{ebooks}}`, `{{projects}}`, `{{cv}}`, `{{block:имя}}`. `src/blocks/*.html` — блоки, их `<style>` ограничивается `#blk-имя`, `html, body` → на блок.
- `content/galleries/*.json` (full, thumb, w, h, caption), `content/ebooks.json`, `content/projects.json` (полка проектов), `content/cv.json` (`"current": true` — мигающий кружок).
- `build.py`: `PAGES`, меню `NAV` + `SECTIONS`, `LANGS`.
- Сервер `worker/index.js` (site/ через ASSETS + /api/*): D1 `pigeonpolly` (`DB`, таблицы создаются сами), KV `IMAGES`, `GOOGLE_CLIENT_ID` в `wrangler.jsonc` (`main`); 503 {ready:false} — пропала привязка. Стена — `site/assets/sketch-wall.js`.
- Локально: wrangler dev, отдельный конфиг, `DEV_FAKE_LOGIN=1` («dev:ник», `dev:admin` = админ); в рабочем — НЕ ставить.
- `_held/` — заготовки, без просьбы не публиковать (комиксы и квиз Wobbleland Алина пока не хочет).

## Языки
- Основа EN; LV/RU — замена фраз по `content/i18n/lv.json`, `content/i18n/ru.json` (ключ — точная строка готового HTML, с `&amp;`, `&#39;`, `>…<`); ссылки получают `/lv/`, `/ru/`.
- **Новый английский текст — в оба словаря.** Проекты: `content/i18n/projects.ru.json`, `projects.lv.json` (без пунктов).
- Подписи работ, названия проектов/книг не переводятся.
- Тексты в RU пишутся без рода («У @ник новый рисунок»). Если нужен глагол — «птичка @ник» (женский род).

## Картинки
- Алина грузит через GitHub (Upload files) в корень: `polly_`, `chew_`, `titos_`, `pumpkin_`, `anxiety_`, `sketchbook_`, `aiart_`, `exhibition_`, `publication_`, подпись в имени (`polly_(2026) Pigeon Polly Fancy Life.jpg`) → `python3 tools/import_uploads.py` (ужимает, раскладывает, удаляет исходники) → `python3 build.py`.
- Вручную: `python3 tools/add_images.py <галерея> файлы…` (ImageMagick).

## Дизайн
- Фон `#2B1A51`, фиолетовый `#534AB7`, текст `#F3EFFA`, приглушённый `#D9D3F2`, персик `#F0A987`, оранжевый `#D85A30`, звезда `#E9A93B`, точки `#F5C4B3`, светлые карточки `#F4F0FA`.
- Google Fonts: Fraunces 600 — заголовки, Karla 400/500/700 — текст. Кнопки-«пилюли». Герой — Полли-астронавт в арке с оранжевой рамкой.
- Меню → ☰ при ≤1300px; Patreon и Pinterest не в меню (они в подвале и на главной). Шапка влезает на 360–1600px во всех языках.

## Подключено
- Cloudflare Workers (`website`, `wrangler.jsonc` публикует `site/`), автодеплой на пуш в `main`; pigeonpolly.com и www в Cloudflare, root → www.
- «Write to me»: `https://formsubmit.co/ajax/769d04d721e5563890ed721ba698f9bc` (e-mail в коде не светить).
- Аналитика своя (кабинет → «👥 Посетители»; Cloudflare Web Analytics Алине непонятна); Search Console, `/sitemap.xml`. Превью: `site/assets/og-image.jpg`.

## Проверка перед пушем
1. `python3 build.py`
2. `cd site && python3 -m http.server 8766`, Playwright (`/opt/pw-browsers/chromium`), 390 и 1440: скриншоты, без ошибок консоли и горизонтальной прокрутки.
3. `git add -A && git commit && git push origin main`.

## Остальное — docs/ (читать только нужное)
- `docs/map.md` — код и /api; `docs/db.md` — D1 и meta.
- challenge · blog · flock · bird (вход, профиль, комната, подарки) · shop (пуговки, цены, правила) · games · rooms · wobbleland · palettes · admin · polly-pet · requests · site (меню, главная) · history (устаревшее).
- `docs/_claude-old.md` — только скриптами. `tools/docs/`: split_claude_old.py, check_split.py, build_map.py, build_db.py.
