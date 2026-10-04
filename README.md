# pigeonpolly.com

Статический сайт Pigeon Polly Art Lab. Без фреймворков: HTML + CSS + немного JS.

## Как устроено

- `site/` — готовый сайт, его публикует Cloudflare Pages (Build output directory: `site`, Build command: пусто).
- `src/layout.html` — общая шапка, меню и подвал для всех страниц.
- `src/pages/*.html` — содержимое страниц.
- `content/galleries/*.json` — галереи (картинки, подписи, порядок).
- `content/ebooks.json` — список книг.
- `build.py` — собирает страницы из `src/` и `content/` в `site/`.
- `tools/add_images.py` — ужимает картинки и добавляет их в галерею.

## Как обновлять

```bash
python3 tools/add_images.py bird "2023 Pigeon Polly space.jpg"   # картинки в галерею
python3 build.py                                                  # пересобрать страницы
```

Затем закоммитить и запушить в `main`: Cloudflare Pages обновит сайт сам.

Адреса страниц совпадают со старым сайтом на Google Sites (`/e-books`, `/art-portfolio/bird` и т. д.).
