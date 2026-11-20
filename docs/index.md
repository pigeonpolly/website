# Индекс: где искать код и текст

_Смотреть первым. Точные номера строк — `docs/index.tsv` (файлы, имена в коде, маршруты `/api`, разделы доков), его собирает и ищет `tools/index.py`. Устройство сайта — `docs/basics.md`; карта «файл → что в нём» — `docs/map.md`._

## Поиск в три шага
1. `python3 tools/index.py find СЛОВО` — имя, файл, маршрут или раздел доков → `файл:строка`.
2. `read файл offset=СТРОКА limit=40` — только нужный кусок (или `grep -n` по файлу).
3. Целиком не читать: `worker/index.js`, `worker/blog.js`, `site/assets/*.js` от 100 КБ, `site/assets/style.css`, доки от 20 КБ (у доков бери раздел: строка из индекса или `python3 tools/sec.py файл "Раздел"`).

| Надо | Команда |
|---|---|
| что в файле и где | `python3 tools/index.py where worker/garden.js` |
| где адрес страницы | `python3 tools/index.py find /garden/` → шаблон и её скрипты |
| маршрут `/api` | `python3 tools/index.py find /api/garden` → `worker/index.js:строка` |
| таблица D1 / ключ meta | `python3 tools/index.py find challenge_days` → `docs/db.md:строка` и модуль |
| свеж ли индекс | `python3 tools/index.py check` — перед пушем, после новых файлов, маршрутов, доков |

## Страницы
- `site/<адрес>/index.html` — **сборка** `build.py` из `src/pages/*.html` и каркаса (`src/layout-v2.html` для страниц из `V2`, иначе `src/layout-v2-lab.html`). Править `src/`, `content/`, `site/assets/`, `site/images/`; готовые `site/*/index.html` — нет.
- Адреса, которые отдаёт worker, а не статика: `/study/`, `/english/`, `/norsk/`, `/norsk/avis/`, `/nederlands/`, `/blog/*`, `/learn/v/<id>/` (рисуется одной страницей `/learn/watch/`).
- Правки Алины «✏️ Править страницу» лежат в таблице `site_blocks` и подменяются на лету при отдаче страницы (`siteBlocks` в `worker/index.js`), файл страницы не меняется; `?raw=1` — оригинал без правок.
- Новая страница: `PAGES` в `build.py` + `src/pages/<файл>.html` (+ `V2`, если новый каркас), меню — `NAV`/`SECTIONS`/`SECTION_HUB`, превью ссылки — `CARDS` в `tools/og_cards.js`.

## Общее — не искать заново
Браузер: `site.js` (меню, шапка, `/api/hit`), `v2.js` (новый каркас, видео, сезоны), `account.js` (вход, ник, `html.is-admin`), `birds.js` (вид птички, вещи), `room.js` (комната), `polly.js` (питомец), `search.js`, `toast.js`, `can-do.js` (что можно с вещью), `catalog.json` (товары — собирает `tools/catalog.js`).

Сервер в `worker/index.js`: `route()` — все `/api`, кроме блога; `pageFetch()` — какие адреса отдаёт worker; `siteBlocks()` — правки страниц; `RULE_DEFAULTS` — числа механик (правка в кабинете → 📜 Правила); `award()` — пуговки; `healthErr()` — сбой → письмо Алине; cron — `scheduled()`.

Доки: тема → файл — таблица «Где что» в `CLAUDE.md` (всегда в контексте). Убранное — `docs/retired.md`, «почему так» — `docs/history.md`, что дальше — `docs/plan-status.md`.

Тексты: RU/LV — замена точной английской строки по `content/i18n/ru.json` и `lv.json` (`tools/i18n_add.py ">Save<" ">Сохранить<" ">Saglabāt<"`); в скриптах — en/ru/lv рядом с кодом, не в словарях.

## Большие файлы
| Файл | Входы |
|---|---|
| `worker/index.js` | `route()`, `pageFetch()`, `siteBlocks()`, `RULE_DEFAULTS`, `errorPage()`, `scheduled()` |
| `worker/blog.js` | `blogApi` (роутер `/api/blog`), `blogPage` (страница), `rehostOne` (чужая картинка → своя в R2) |
| `site/assets/admin.js` | разделы кабинета — `PNNAdmin.mount(main)`; список — `ADMIN_GROUPS`/`ADMIN_SECTIONS` |
| `site/assets/room.js`, `flock.js`, `sketch-wall.js`, `blog-editor.js` | `grep` по `window.PP…` и по названию действия |
| `site/assets/style.css`, `v2.css` | `grep` по селектору |
| `worker/*-page.js`, `site/assets/{rooms-data,extra-palettes,wobbleland-data.*}.js` | **собраны** скриптами — руками не править (в индексе помечены «СОБРАН») |

## Перед пушем
`python3 build.py` → `python3 tools/index.py` (если менял код, маршруты, доки) → `python3 tools/index.py check` → `python3 tools/dead_check.py`. На этом компьютере сборка и пуш — `.tools\build.ps1` и `.tools\push.ps1`.
