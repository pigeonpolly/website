# Карта кода

_`python3 tools/docs/build_map.py`: файл (размер) — что в нём: главные имена (первыми — то, что кладётся в `window`). Номеров строк нет — искать grep-ом. «Общее» внизу при пересборке сохраняется._

## Сервер

- `worker/blog.js` (93K) — блог: страницы /blog/, /api/blog/*, редактор, перевод Gemini, копии: TAGMAP, SITE, LANGS, TOP, GLOSSARY, LANG_NAME, blogUrl, tagLabel, stripTags, gemini, loadTags, tagsOf
- `worker/index.js` (196K) — Worker: site/, страницы через HTMLRewriter, /api (кроме блога), cron: RULES, BTN, STOCK, DAYCOL, GIFT_KINDS, LEGEND, catalog, award, btnOf, avatarOf, gameUnit, streakDays

## Браузер (site/assets)

- `site/assets/account.js` (18K) — вход в шапке, меню аккаунта, обязательный ник, `html.is-admin`: PPToast, PPAccount, askNick, openSignIn, pinAsk
- `site/assets/admin.js` (115K) — кабинет /admin/ (все разделы): BADGE_COND, BADGE_RU, LEVEL_RU, shop, pct
- `site/assets/advent-admin.js` (12K) — кабинет → 🎄 Адвент: план окошек: PPAdventAdmin, ADV_SP, advSet, advBoard, advDayPick
- `site/assets/advent.js` (16K) — адвент /advent/: отсчёт, окошки: ORDER, tap, draw, prize, load
- `site/assets/backup.js` (12K) — резервные копии (кабинет): PPBackup, FOLDER, README, SITE, backup
- `site/assets/bird-card.js` (14K) — карточка «Моя птичка» (сторис) и ссылка /flock/?bird=: PPBirdCard, GOLD, CSS, RING, rnd
- `site/assets/birds.js` (53K) — птички: внешность из id, спрайты, вещи и подарки (`PPBirds`): PPBirds, SPECIAL_HATS, HATS, HD_ITEMS, avatar
- `site/assets/blog-editor.js` (118K) — редактор блога /blog-editor/: LANGS, HOME_SECS, ERR, dashboard, localDate
- `site/assets/blog.js` (13K) — блог для посетителя: лайк, комментарии, кнопки админа: login, adminTools, load, openFn, gButton
- `site/assets/carousel.js` (19K) — карусели для Instagram/TikTok из работ челленджа: PPCarousel, SERIF, CRC, zip, brand
- `site/assets/challenge-data.js` (98K) — данные челленджа: предметы, цвета, советы (EN/RU/LV): CHALLENGE_DATA
- `site/assets/challenge-theme.js` (9K) — тема дня (общая для /challenge и главной), день ЭКСТРА: ChallengeTheme, BDAY, NEUTRAL, SEASON, rngFor
- `site/assets/challenge.js` (29K) — страница челленджа: тема, таймер, календарь, карточка, серии: SPLIT, START, COOLC, renderDiary, resetTimer
- `site/assets/extra-palettes.js` (34K) — палитры ЭКСТРА (build.py): EXTRA_PALETTES
- `site/assets/flock.js` (142K) — стая: сцена canvas, локации, действия, предметы: PPFlockDebug, TREE, EVENTS, ORN_C, rnd
- `site/assets/home-blog.js` (2K) — блок блога на главной: pic
- `site/assets/news.js` (13K) — «конвертик»: 🔔, конвертик, лента новостей: PPNews, KINDS
- `site/assets/palettes.js` (38K) — страница /palettes/, палитра из фото, добавление палитр админом: NAMES, ADD_G, isAdmin, hue, monthName
- `site/assets/polly-help.js` (17K) — «Полли, помоги нарисовать»: гайды /polly-helps/: guide, map
- `site/assets/polly.js` (26K) — Полли-питомец в левом нижнем углу (`PollyPet`): PollyPet, SEASON, CORNER, HOME_X, addProp
- `site/assets/potion-names.js` (23K) — общие данные Зельеварни: ингредиенты, названия зелий (`PPPotion`): PPPotion, ADJ, ING, SEASONS, potion
- `site/assets/potions.js` (48K) — игра «Зельеварня» /potions/: лабиринт, котёл, рецепты: DIRS, HUD, play, overlay, brew
- `site/assets/quest-polly.js` (15K) — задачи в офисе Полли: ORDER, HOTS, KEY, openMail, close
- `site/assets/quest-titos.js` (53K) — дела детектива Титоса: CASES, HOTS, CASE1, openClue, openBoard
- `site/assets/rain.js` (27K) — игра «Пуговичный дождь» /rain/: SKIES, COLORS, MISS, pop, showOverlay
- `site/assets/requests.js` (32K) — «Нарисуй мне» /requests/: HID, lists, pollyPick, saveImg, translateRest
- `site/assets/room.js` (197K) — комната птички: каталог мебели, расстановка, поведение (`PPRoom`): PPRoom, OUT, FURN, DECO, addTh
- `site/assets/rooms-data.js` (5K) — зоны комнат (build.py): ROOMS
- `site/assets/rooms-gallery.js` (4K) — галерея комнат внизу /flock/: more, open, thumb
- `site/assets/rooms.js` (39K) — пиксельные комнаты (офис Полли, Титос): зоны, реплики, эффекты (`ROOM`): ROOM, API, IDX, pct, setEvening
- `site/assets/scroll-nav.js` (2K) — стрелочки наверх/вниз: update
- `site/assets/search.js` (5K) — поиск по сайту (🔍, «/»): run, build, open, render, snippet
- `site/assets/site-edit.js` (24K) — режим «✏️ Править страницу» (админ): PPEdit, PRE, TPL, drawText, override
- `site/assets/site.js` (11K) — меню, шапка «влезает», лайтбокс галерей, /api/hit, `[data-profile]`: open, close, show, fit, over
- `site/assets/sketch-wall.js` (95K) — стена работ, вход, загрузка, бейджи, профиль /bird/, сумка: PPProfile, LEVELS, SPECIAL, COL, loadWall
- `site/assets/today.js` (6K) — блок «Тема дня» (с главной убран): LBL, open, wait
- `site/assets/wobbleland-data.en.js` (26K) — из content/wobbleland.json (build.py): WOBBLELAND
- `site/assets/wobbleland-data.lv.js` (28K) — то же, LV: WOBBLELAND
- `site/assets/wobbleland-data.ru.js` (37K) — то же, RU: WOBBLELAND
- `site/assets/wobbleland.js` (38K) — карта Wobbleland, карточки городов, праздники: HOL, LOC, MAX, img, openCity

## Сборка

- `build.py` (34K) — сборка: страницы, меню, языки, блоки, галереи, поиск, данные для JS: CONTENT, OUT, ROOT, href, bust

## Инструменты (tools)

- `tools/add_images.py` (3K) — добавить картинки в галерею (ImageMagick): ROOT, caption_from, slug
- `tools/ava_deco_gen.py` (16K) — фоны и рамки аватаров → site/assets/ava-deco.css: BAT, HEART, ring_items, gem, mush
- `tools/catalog.js` (5K) — каталог вещей → site/assets/catalog.json (для сервера): FOOD, GEMS, SPECIAL_HATS, animated, stubEl
- `tools/daycolors.js` (1K) — цвета темы дня для сервера → day-colors.json
- `tools/docs/build_db.py` (5K) — собирает docs/db.md: ALTER, CREATE, ROOT, col, split_top
- `tools/docs/build_map.py` (19K) — собирает docs/map.md: ROOT, OUT, COMMON, top_funcs, call_counts
- `tools/docs/check_split.py` (3K) — сверка разбиения _claude-old.md: ROOT, KEY, MARK
- `tools/docs/split_claude_old.py` (28K) — режет _claude-old.md на docs/*.md: CLAUDE, HIST, SPLIT, table, parse_spec
- `tools/import_uploads.py` (4K) — раскладывает загрузки из GitHub по галереям: ROOT, EXT, PREFIX, convert, slug
- `tools/palette_names.py` (5K) — словарь названий цветов (en, ru, lv, hex): NAMES
- `tools/palette_overrides.py` (6K) — палитры, подобранные вручную
- `tools/palette_titles.py` (7K) — короткие названия палитр по картинкам
- `tools/palettes.py` (6K) — палитры из артов → content/palettes.json: HERE, to_lab, palette, to_hex, kmeans
- `tools/rooms/detective.py` (16K) — рисует кабинет Титоса (день/вечер, зоны): HOT, OUT, hot, titos, scene
- `tools/rooms/kit.py` (4K) — набор для пиксельных комнат: слои, шрифт 3×5, вечер: INK, evening, sprite
- `tools/rooms/office.py` (20K) — рисует кабинет Полли (день/вечер, зоны): OUT, HOT, hot, polly, scene
- `tools/rooms/props.py` (4K) — спрайты пасхалок комнат: OUT, _out, portrait, canvas
- `tools/wobbleland/anno.py` (11K) — ручная разметка карты: улицы, дома, значки: HOUSES, STREETS, SQUARES
- `tools/wobbleland/crests3.py` (11K) — пиксельные гербы городов: INK, NAVY, MASK, arc_pts, oell
- `tools/wobbleland/dishes.py` (18K) — пиксельные блюда для книги рецептов: INK, plate, mug, nut, bowl
- `tools/wobbleland/make_map4.py` (10K) — пиксельная карта map-pixel.png: INK, LAND, ROOFS, mode_filter, house
- `tools/wobbleland/sprites.py` (3K) — мелкие спрайты карты: INK, make

## Маршруты worker/index.js (86)

_без `/api`; `f` — возвращает f(); `~f` — код в `route()`, главная вызываемая f; — — только SQL_

/blog/* → blogApi · POST /dev/migrate → migrateToR2 · POST /dev/cleanup → cleanupInactive · GET /profile → ~mergedBadges · POST /birdcard → — · GET /birdcard → — · GET /stats → — · GET /flock → ~avatarOf · GET /birds → ~roomOf · POST /subscribe → — · POST /unsubscribe → — · POST /hit → hit · GET /admin/visits → visitStats · POST /admin/links → — · POST /room → ~cleanRoom · GET /rooms → ~roomOf · GET /game → ~gamePrices · POST /game/start → — · POST /game/level → ~rainItem · GET /potion → ~comboSeason · POST /potion/level → ~mazeItems · POST /potion/done → ~gameBadge · POST /potion/eye → — · POST /potion/give → ~invOf · POST /potion/seen → — · POST /potion/brew → ~potionOf · GET /requests → ~anonCode · POST /requests/tr → ~reqFill · POST /requests → ~anonCode · POST /requests/like → ~visitor · POST /admin/requests/answer → ~reqReward · POST /admin/requests/closed → — · POST /admin/requests/hide → — · GET /advent → ~adventNow · POST /advent/open → ~adventCollector · POST /admin/advent → ~okItem · GET /palettes → ~extraQueue · GET /extra-palettes.js → ~extraQueue · POST /admin/art → ~artEntry · POST /admin/art/hide → — · POST /admin/art/delete → ~extraQueue · GET /admin/users → — · /admin/blocks → — · /admin/subscribers → — · GET /flock/find → — · GET /admin/sec → ~secLocked · POST /admin/pin/verify → ~pinHash · POST /admin/pin/set → ~pinHash · POST /admin/recovery/new → ~loadSec · POST /recover → ~rcNorm · GET /whoami → ~adminIdentity · GET /config → — · POST /login → ~verifyGoogle · POST /logout → ~sessionCookie · GET /me → ~awardBadges · GET /shop → ~ensurePrices · POST /shop/buy → ~legMax · POST /admin/shop/cats → ~cleanRules · POST /admin/shop/reprice → ~gameUnit · POST /admin/shop/restock → ~ensurePrices · /admin/shop → ~shopRow · POST /gift/give → ~cleanRoom · POST /gift/sell → ~cleanRoom · POST /salary/seen → — · POST /admin/salary → — · POST /admin/buttons-backfill → ~backfillButtons · POST /admin/buttons → — · POST /gift → ~avatarOf · POST /avatar → ~avatarOf · GET /admin/gifts → — · POST /admin/gift-all → ~legMax · POST /admin/gift → ~okItem · POST /nick → ~award · POST /upload → ~bump · POST /delete-post → ~imgDelete · GET /wall → — · GET /top → ~streaks · GET /export → — · POST /delete-account → ~sessionCookie · POST /admin/pick → ~addBadge · POST /admin/shop/autorestock → ~autoRestock · GET /admin/autopilot → ~autopilot · /admin/rules → ~autopilot · POST /admin/ai → — · POST /admin/hide → — · POST /admin/ban → —

## Маршруты worker/blog.js (35)

_пути без `/api/blog/`; обозначения те же_

GET state → ~anonCode · POST like → ~visitor · POST comment → ~ipHash · GET search → ~loadTags · GET home → ~fmtDate · GET backup → fullBackup · GET admin/posts → ~geminiKey · GET admin/post → — · POST admin/save → ~cleanHtml · POST admin/delete → — · POST admin/pin → — · GET admin/dupes → — · POST admin/dedupe → ~secsOf · POST admin/bulk → ~slugify · POST admin/feature → — · GET admin/overview → — · GET admin/comments → ~birdName · admin/gemini-key → ~gemini · admin/backup-token → — · GET admin/export → — · POST admin/restore-media → — · POST admin/import → — · GET admin/sections → ~loadTags · POST admin/section-set → ~translateAll · POST admin/section-delete → ~secsOf · GET admin/tags → ~tagsOf · POST admin/tag-set → ~syncTagColumns · POST admin/tags-translate → ~translateTags · POST admin/tag → ~syncTagColumns · POST admin/settings → — · POST admin/comment → — · POST admin/upload → — · POST admin/fetch-image → ~rehostOne · POST admin/translate → translateAll · /sitemap-blog.xml → ~secsOf

## RULE_DEFAULTS (worker/index.js) по группам

_правка — кабинет → 📜 Правила (meta `rules`)_

- пуговки за действия: daily, upload, comment, commentsPerDay, friend, pick
- уровни и бейджи (из BTN): levels, badges
- магазин: лимиты и цены: shopMax, legendMax, priceMin, priceMax
- запас «мало / обычно / много»: lowPct, normPct, manyPct, legendPct
- адвент: adventLastJan, adventButtons, adventSpecialButtons
- ИИ-рисунки: aiStreak, aiUpload
- продажа вещей: sellOn, sellPrice
- Пуговичный дождь (награды в %): gameOn, gameLevelPct, gameRecordPct, gameDayMaxPct, gameMinSec, gameItemEvery, gameKingPct
- Зельеварня (награды в %): potionOn, potion1Pct, potion2Pct, potion3Pct, potionAgainPct, potionDayMaxPct, potionMinSec
- Зельеварня: сезон, полка: potionSeason, potionShelf
- цены: indexOn, indexBase, priceDays, catMult
- пополнение: restockOn, restockTo
- условия бейджей (cond): early, earlyBefore, owl, owlFrom, owlTo, ten, fifty, hundred, inkmaster, comeback, weekend, alt, clock, clockWin, monthly, veteranMonths, veteranPer, collector, colors, rainA, rainB, rainC, potA, potB, mazeA

## Общее

_Сюда следующие этапы дописывают общие сведения о коде._

- Новости птички: `NEWS_KINDS` (worker) → `news` в /api/whoami, /api/news; news.js `KINDS`. Новый вид — по записи там и тут.
- Тема дня челленджа: всегда `ChallengeTheme.themeFor(d, L)` (план месяца из D1, `theme.loading`, событие `pp:chplan`); подбор и план — worker/challenge-plan.js + challenge-days.js.
- useItem (sketch-wall.js) — «нажал — появилось»: вещь птички надеть/снять, вещь комнаты → `PPRoom.live.use` (своя комната на странице; нет — профиль с #use=). Тост — toast.js `PPToast(msg, { action, onAction, ms })` (в layout перед account.js). Свободное место в комнате — room.js `PPRoom.freeSpot(lay, d, k)`.
- catalog-ui.js `PPCatalog`: плитка вещи `tile`, `tabs`, `chips`, `toggle`, `grid`, картинка `pic`, режим «сумка» `bag`, `usage` (где вещь), `kindLabel` — для сумки, потом магазина и карточек. Подключён на /bird/ и /challenge/ перед sketch-wall.js.
- Этап 6: catalog-ui.js `PPCatalog.browse(box, o)` — общий каталог (поиск, «💰 Хватает пуговок», «Фильтры · N» — выезжающая панель, вкладки Всё · Птичке · Комнате · Карточки · Сюрпризы, «Нет в наличии» свёрнуто внизу, режим выбора `pick` + `cant` + `mark`) — магазин, адвент-окно (advent-admin.js), подарок в кабинете (admin.js `giftDialog`). Окно вещи с примеркой — `itemWindow`; useItem теперь `PPCatalog.use(kind, item, {me, after})`, последняя отмена — `PPCatalog.lastUndo`. Примерка комнаты — `PPRoom.mount(…, {preview: true})` (не сохраняет). Подключён ещё на /shop/ и в кабинете.
- account.js: `PPDevH()` — заголовок x-dev-date для ?devdate=; `PPWho` + событие `pp:whoami`. worker: `rigaMs()` — время по Риге → мс.
