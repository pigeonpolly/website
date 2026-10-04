# pigeonpolly.com

Статический сайт Pigeon Polly Art Lab. Без фреймворков: HTML + CSS + немного JS.

## Как устроено

- `site/` — готовый сайт. Его публикует Cloudflare (проект Workers `website`, команда `npx wrangler deploy`, настройки в `wrangler.jsonc`).
- `src/layout.html` — общая шапка, меню и подвал для всех страниц.
- `src/pages/*.html` — содержимое страниц.
- `content/galleries/*.json` — галереи (картинки, подписи, порядок).
- `content/ebooks.json` — список книг.
- `content/projects.json` — проекты для книжной полки на /projects (темы, цвета, описания).
- `content/cv.json` — опыт работы, образование и курсы (блок под полкой на /projects).
- `content/i18n/lv.json`, `content/i18n/ru.json` — переводы (английская фраза → перевод). Версии собираются в `site/lv/` и `site/ru/`.
- `build.py` — собирает страницы из `src/` и `content/` в `site/`.
- `tools/add_images.py` — ужимает картинки и добавляет их в галерею.
- `tools/import_uploads.py` — разбирает картинки, загруженные в корень репозитория через GitHub (префиксы `polly_`, `chew_`, `aiart_` и т. д.), по галереям.
- `src/blocks/*.html` — блоки главной (Coming soon, Patreon, о себе, книги, игра). Их стили автоматически изолируются при сборке.
- `_held/` — готовое, но пока не опубликованное (Wobbleland, обложки комиксов). На сайт не попадает.

## Как обновлять

```bash
python3 tools/add_images.py bird "2023 Pigeon Polly space.jpg"   # картинки в галерею
python3 build.py                                                  # пересобрать страницы
```

Затем закоммитить и запушить в `main`: Cloudflare обновит сайт сам.

Адреса страниц совпадают со старым сайтом на Google Sites (`/e-books`, `/art-portfolio/bird` и т. д.).
