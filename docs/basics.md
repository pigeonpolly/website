# Основы: устройство, языки, картинки, дизайн, подключено, проверка

Сжатый общий раздел старого CLAUDE.md.

## Как устроено
- Статика без фреймворков; сборка `python3 build.py` (только stdlib).
- `site/` публикуется, HTML в нём **генерируется**: править `src/`, `content/`. `site/assets/`, `site/images/`, `site/files/` — напрямую.
- `src/layout.html` — шаблон (шапка, меню, подвал, «Write to me», мета, Person schema). `src/pages/*.html` — страницы: `{{gallery:имя}}`, `{{ebooks}}`, `{{projects}}`, `{{cv}}`, `{{block:имя}}`. `src/blocks/*.html` — блоки, их `<style>` ограничивается `#blk-имя`, `html, body` → на блок.
- `content/galleries/*.json` (full, thumb, w, h, caption), `content/ebooks.json`, `content/projects.json` (полка проектов), `content/cv.json` (`"current": true` — мигающий кружок; переводы — `content/i18n/cv.<lang>.json`, английская строка → перевод).
- `build.py`: `PAGES`, меню `NAV` + `SECTIONS`, `LANGS`.
- Сервер `worker/index.js` (site/ через ASSETS + /api/*): D1 `pigeonpolly` (`DB`, таблицы создаются сами), KV `IMAGES`, `GOOGLE_CLIENT_ID` в `wrangler.jsonc` (`main`); 503 {ready:false} — пропала привязка. Стена — `site/assets/sketch-wall.js`.
- `ensureSchema`: полная проверка таблиц (~150 запросов) только при смене метки `schema_ver` в meta (хэш текста функции и таблиц) — новые таблицы/ALTER добавлять как раньше, метка сменится сама. Иначе каждый холодный запуск тормозил все страницы.
- Скорость (11.11.2026): то же для блога — `ensureBlogSchema`, метка `blog_schema_ver` (хэш кода + blog-drafts.json: новый черновик в файле → импорт сам). Разовая правка в ensureSchema упала — метка не ставится, повтор при следующем запуске. `loadRules` — раз в минуту, чтения разом; `/api/whoami` — чтения разом (Promise.all). `placement: smart` в wrangler.jsonc — сервер рядом с D1.
- Кэш браузера — `site/_headers`: /assets/* 5 мин (свои скрипты/стили в HTML с ?v=хеш — новые сразу), /images/* сутки (картинку с тем же именем заменять новым именем, иначе до суток видна старая), /files/* сутки.
- Локально: wrangler dev, отдельный конфиг, `DEV_FAKE_LOGIN=1` («dev:ник», `dev:admin` = админ); в рабочем — НЕ ставить.
- **Страницы ошибок** 404 / 500 / 503 на 3 языках: `src/pages/404.html`, `500.html`, `503.html` → `site/(ru|lv/)404.html` и др. (build.py). 404 Cloudflare берёт ближайший сам; 500 (сбой страницы) и 503 (нет базы) отдаёт `errorPage()` в worker/index.js.
- `_held/` — заготовки, без просьбы не публиковать (комиксы и квиз Wobbleland Алина пока не хочет).

## Языки
- Основа EN; LV/RU — замена фраз по `content/i18n/lv.json`, `content/i18n/ru.json` (ключ — точная строка готового HTML, с `&amp;`, `&#39;`, `>…<`); ссылки получают `/lv/`, `/ru/`.
- **Новый английский текст — в оба словаря.** Проекты: `content/i18n/projects.ru.json`, `projects.lv.json` (без пунктов).
- Подписи работ, названия проектов/книг не переводятся.
- Тексты в RU пишутся без рода («У @ник новый рисунок»). Если нужен глагол — «птичка @ник» (женский род).
- Выбор языка запоминается: клик по переключателю пишет `localStorage.pp_lang`; скрипт в `<head>` (src/layout.html) на следующих заходах уводит на ту же страницу в этом языке по `<link rel="alternate" hreflang>`. Без сохранённого выбора запоминается язык первой открытой страницы.

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
- Аналитика своя (кабинет → «👥 Посетители»; Cloudflare Web Analytics Алине непонятна); Search Console, `/sitemap.xml`. Превью ссылок (этап 19): у каждого раздела своя картинка 1200×630 на EN/RU/LV — `site/images/og/<путь>-<язык>.jpg` (`node tools/og_cards.js [ключ]`: тексты и картинки разделов в `CARDS`, лист — _shots/og-cards.jpg); build.py `og_meta` ставит og:image/twitter:image/alt и og:locale, если файл есть (иначе — og-flock). Стая, профиль, огород, privacy — картинка стаи. Статьи блога — своя картинка статьи (worker/blog.js `fill`); /flock/?bird= и /bird/?nick= — карточка птички (/api/birdcard, без карточки — og-flock на языке). Новая страница → строка в CARDS и `node tools/og_cards.js ключ`.

## Проверка перед пушем
1. `python3 build.py`
2. `cd site && python3 -m http.server 8766`, Playwright (`/opt/pw-browsers/chromium`), 390 и 1440: скриншоты, без ошибок консоли и горизонтальной прокрутки.
3. `git add -A && git commit && git push origin main`.
