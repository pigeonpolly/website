# Карта кода

_`python3 tools/docs/build_map.py`: файл (размер) — что в нём: главные имена (первыми — то, что кладётся в `window`). Номеров строк нет — искать grep-ом. «Общее» внизу при пересборке сохраняется._

## Сервер

- `worker/auth.js` (22K) — Вход с паролем (этап 12): регистрация, вход по почте или нику, смена и сброс пароля, «выйт: FUNNELS, ADVENT_DAY_MAX, DUMMY, ITER, AUTH_ALTER, AUTH_TABLES, rows, failAll, hashPw, ipKey, lockedAny, normEmail
- `worker/blog.js` (89K) — блог: страницы /blog/, /api/blog/*, редактор, перевод Gemini, копии: TAGMAP, SITE, LANGS, TOP, GLOSSARY, PREFIX, blogUrl, tagLabel, loadTags, stripTags, tagsOf, sectionName
- `worker/cards.js` (47K) — Коллекционные карточки за пуговки (docs/cards.md): каждая — в одном экземпляре на весь сай: DAY, RARITY, DESC, SEL, TRADE_N, CARD_ALTER, listOut, sets, tradeDays, round5, statsOf, asset
- `worker/challenge-days.js` (34K) — План тем челленджа в D1 (этап 3, docs/challenge.md «Подбор тем»): таблица challenge_days, : BLANK_FROM, FIRST, BANK_TAGS, COLS, ITEMS, LAST, rigaToday, toRow, bankSync, daysIn, ensureMonth, pad
- `worker/challenge-plan.js` (27K) — Подбор тем челленджа (этап 3, docs/challenge.md «Подбор тем»): план месяца по правилам.: RELAX, BW_GROUPS, MIN_DE, WORD_DAYS, BDAY, CH_DEFAULTS, dayNum, rngFor, hueGap, keyOfNum, pickW, poolOf
- `worker/flock-news.js` (10K) — Новости стаи (этап 13 Г, docs/flock.md): /flock/news/ и 3 строки на главной.: KEEP, BIRD_KINDS, REF, FLOCK_NEWS_ALTER, FLOCK_NEWS_TABLES, note, rigaDayOf, flockEvent, flockNewsCron, roomEvent, flockNewsApi
- `worker/flock.js` (10K) — «Все птички» (/flock/) и пёрышки комнат (этап 13 Б+В, docs/flock.md).: BIRD, PER, COLS, SORTS, FLOCK_ALTER, FLOCK_TABLES, ownerOf, stateOf, featherNews, flockApi
- `worker/garden.js` (21K) — Огород птички (этап 22, /garden/, site/assets/garden.js, docs/bird.md «Огород»): грядки, с: CROPS, TIER, DAY, SIMPLE, GARDEN_ALTER, GARDEN_BOOL, out, fnv, grown, prices, bedOk, bugsOf
- `worker/index.js` (259K) — Worker: site/, страницы через HTMLRewriter, /api (кроме блога), cron: RULES, BTN, STOCK, GIFT_KINDS, GOLD_PICKS, PLEVEL, award, btnOf, catalog, avatarOf, cnt, gameUnit
- `worker/pancakes.js` (12K) — «Блинная Полли» (/pancakes/, site/assets/pancakes.js, docs/games.md): Полли печёт блины жи: PAN_UPS, TOP, PAN_ALTER, PAN_BADGES, PAN_COND, PAN_INT, today, upsOf, price, pancakesApi
- `worker/shift.js` (4K) — «Смена с Полли» (/shift/, этап 29, site/assets/shift.js, docs/rooms.md): таймер работы вме: SHIFT_MIN, SHIFT_ALTER, SHIFT_INT, SHIFT_RANGE, SHIFT_RULES, SHIFT_TABLES, out, shiftApi
- `worker/titos-sort.js` (13K) — «Разбери дела» (этап 9 А, docs/titos.md): у Титоса упали коробки: SORT_TWISTS, ARCHIVE, shuffle, rng, sortRound
- `worker/titos.js` (31K) — Детектив Титос (docs/titos.md): 100 уровней-дел, кофе, пуговки за уровень.: MAX, MIN, TITOS_PRIZES, OPEN, TITOS_ITEMS, TR_BUDGET, out, resolve, rowOf, saveRow, caseOf, settle
- `worker/top.js` (5K) — Доски топа игр (docs/games.md § Доски топа): одна на каждую игру, вкладки «За всё время» и: GAMES, TOP_TABLES, topWeek, prevWeek, topScore, topApi, topCron
- `worker/translate.js` (9K) — Общий перевод для всего сайта (статьи блога, «Нарисуй мне», карточки и всё, что переводитс: BLOG, LANG_NAME, GEMINI_MODELS, LANGS, ABOUT, gemini, run, stripTags, translateOne, geminiKey, translateAll, translateTo
- `worker/wl-holidays.js` (11K) — Праздники Воббленда (docs/wobbleland.md «Праздничные письма»): в день праздника (по Риге) : SITE, MAIL_DAYS, DAY_MAX, WL_ALTER, holidays, langOf, unsubToken, letter, shift, wlHolidayCron, wlLang, wlNote

## Браузер (site/assets)

- `site/assets/account.js` (41K) — вход в шапке, меню аккаунта, обязательный ник, `html.is-admin`: PPDevH, PPWho, PPAccount, ALINA_MAIL, IN_APP
- `site/assets/admin.js` (174K) — кабинет /admin/ (все разделы): BADGE_COND, ADMIN_SECTIONS, BADGE_RU, pct, shop
- `site/assets/advent-admin.js` (9K) — кабинет → 🎄 Адвент: план окошек: PPAdventAdmin, ADV_SP, advSet, advBoard, advDayPick
- `site/assets/advent.js` (17K) — адвент /advent/: отсчёт, окошки: ORDER, tap, goTo, draw, load
- `site/assets/backup.js` (13K) — резервные копии (кабинет): PPBackup, FOLDER, README, SITE, backup
- `site/assets/bird-card.js` (14K) — карточка «Моя птичка» (сторис) и ссылка /flock/?bird=: PPBirdCard, GOLD, CSS, RING, rnd
- `site/assets/birds.js` (55K) — птички: внешность из id, спрайты, вещи и подарки (`PPBirds`): PPBirds, SPECIAL_HATS, HATS, HD_ITEMS, avatar
- `site/assets/blog-editor.js` (123K) — редактор блога /blog-editor/: LANGS, HOME_SECS, ERR, dashboard, pad2
- `site/assets/blog.js` (13K) — блог для посетителя: лайк, комментарии, кнопки админа: login, adminTools, load, openFn, gButton
- `site/assets/can-do.js` (4K) — Что можно с вещью (этап 7, docs/cards.md «Что можно с вещью»): одна функция и для браузера: TITOS, BOXES, LEGEND, canDo
- `site/assets/cards-admin.js` (18K) — Кабинет → «🃏 Карточки» (admin.js открывает PPCardsAdmin.mount(main)): список, новая карточ: PPCardsAdmin, LANGS, RAR, ERR, missing
- `site/assets/cards-ui.js` (49K) — Коллекционные карточки (docs/cards.md): плитка, окно карточки и раздел «🃏 Карточки» в мага: PPCards, PER, RAR, NEED, trade
- `site/assets/carousel.js` (19K) — карусели для Instagram/TikTok из работ челленджа: PPCarousel, SERIF, CRC, zip, brand
- `site/assets/cart.js` (3K) — 🛒 Корзина магазина: вещи откладываются, а не покупаются сразу: PPCart, KEY, read, count, has
- `site/assets/catalog-ui.js` (41K) — Каталог вещей: плитка, вкладки, чипы, переключатель; режим «сумка» (профиль птички).: PPCatalog, LANG, PRICES, SORTS, kindsLabel
- `site/assets/challenge-admin.js` (77K) — Кабинет → «🎨 Темы челленджа» (admin.js открывает PPChallengeAdmin.mount(main)): календарь : PPChallengeAdmin, HARM, WT_NOW, GRIDS, grid
- `site/assets/challenge-data.js` (155K) — данные челленджа: предметы, цвета, советы (EN/RU/LV): CHALLENGE_DATA
- `site/assets/challenge-theme.js` (12K) — тема дня (общая для /challenge и главной), день ЭКСТРА: ChallengeTheme, BDAY, NEUTRAL, ALLC, rngFor
- `site/assets/challenge.js` (33K) — страница челленджа: тема, таймер, календарь, карточка, серии: SPLIT, START, COOLC, renderDiary, resetTimer
- `site/assets/day-card.js` (16K) — Карточка дня (этап 13 А): «почтовая открытка» с ячейками-штампами — задания на сегодня из : PPDay, ICON, KIND, cell, two
- `site/assets/extra-palettes.js` (34K) — палитры ЭКСТРА (build.py): EXTRA_PALETTES
- `site/assets/feathers.js` (5K) — Пёрышки комнаты (этап 13 В, docs/flock.md): полоска под комнатой в профиле /bird/.: PPFeathers, lv1, fall, mount, post
- `site/assets/flock-list.js` (8K) — «Все птички» — /flock/ (этап 13 Б, docs/flock.md): «В стае N птичек», поиск по нику, «🎲 Сл: SORTS, card, load, check
- `site/assets/flock-news.js` (17K) — Новости стаи (этап 13 Г, docs/flock.md): лента /flock/news/ и 3 строки на главной над сцен: PPFlockNews, BADGES, PACK, BTN, prof
- `site/assets/flock.js` (142K) — стая: сцена canvas, локации, действия, предметы: PPFlockDebug, TREE, EVENTS, ORN_C, rnd
- `site/assets/games-hub.js` (3K) — Хаб «Играть» (/games/, этап 14 В): вошедшим — готовность на карточках из GET /api/today («: set, dur
- `site/assets/garden-items.js` (13K) — Вещи для огорода (этап 23, docs/bird.md «Огород»): вид подарка garden — в магазине, сумке,: PPGardenItems, ITEMS, LEG, ORDER, layout
- `site/assets/garden.js` (43K) — Огород птички (этап 22, /garden/?nick=, docs/bird.md «Огород»): пиксельная сцена 192×120 (: PPGardenPlants, CROP, NIGHT_ON, TALL, float
- `site/assets/hatch.js` (9K) — Вылупление (этап 14, docs/site.md «Главная»): пиксельное яйцо, трещины и птичка из скорлуп: PPHatch, EGG, KEY, SPOTS, step
- `site/assets/home-blog.js` (2K) — блок блога на главной: pic
- `site/assets/news.js` (33K) — «Конвертик» — одна очередь новостей птички на всех страницах (этап 4 А).: PPNews, KINDS, COL, BOXES, feed
- `site/assets/palettes.js` (38K) — страница /palettes/, палитра из фото, добавление палитр админом: NAMES, ADD_G, isAdmin, hue, monthName
- `site/assets/pancakes.js` (113K) — Игра «Блинная Полли» (/pancakes/, docs/games.md): Полли печёт блины жителям Воббленда: PAN, SAY, BAKE, setPhase, bakeCol
- `site/assets/pixel-badge.js` (13K) — Пиксельные бейджи тематик месяцев (кабинет → «🏅 Тематика месяца» → «🎨 Бейдж»; показ — sket: PPPixelBadge, GLYPHS, TEMPLATES, RING, rect
- `site/assets/polly-help.js` (17K) — «Полли, помоги нарисовать»: гайды /polly-helps/: guide, map
- `site/assets/polly.js` (26K) — Полли-питомец в левом нижнем углу (`PollyPet`): PollyPet, SEASON, CORNER, HOME_X, addProp
- `site/assets/potion-names.js` (27K) — общие данные Зельеварни: ингредиенты, названия зелий (`PPPotion`): PPPotion, ADJ, FALL, ING, potion
- `site/assets/potions.js` (57K) — игра «Зельеварня» /potions/: лабиринт, котёл, рецепты: DIRS, HUD, play, overlay, brew
- `site/assets/pw-rules.js` (2K) — Правила пароля — одни для сервера (worker/index.js) и браузера (account.js): от 8 символов: COMMON, norm, check
- `site/assets/quest-polly.js` (15K) — задачи в офисе Полли: ORDER, HOTS, KEY, openMail, done
- `site/assets/quest-titos.js` (33K) — дела детектива Титоса: LANG, HOTS, OLD, openClue, openBoard
- `site/assets/rain.js` (27K) — игра «Пуговичный дождь» /rain/: SKIES, COLORS, MISS, pop, showOverlay
- `site/assets/requests.js` (32K) — «Нарисуй мне» /requests/: HID, lists, pollyPick, saveImg, translateRest
- `site/assets/room.js` (320K) — комната птички: каталог мебели, расстановка, поведение (`PPRoom`): PPRoom, OUT, FURN, DECO, rbox
- `site/assets/rooms-data.js` (5K) — зоны комнат (build.py): ROOMS
- `site/assets/rooms.js` (39K) — пиксельные комнаты (офис Полли, Титос): зоны, реплики, эффекты (`ROOM`): ROOM, API, IDX, pct, setEvening
- `site/assets/scroll-nav.js` (2K) — стрелочки наверх/вниз: update
- `site/assets/search.js` (5K) — поиск по сайту (🔍, «/»): run, build, open, render, snippet
- `site/assets/shift-music.js` (11K) — «Смена с Полли» (этап 29): три бесконечные ретро-мелодии и глупая пиксельная колыбельная —: PPShiftMusic, TRACKS, MAJ, LULL, tone
- `site/assets/shift.js` (30K) — «Смена с Полли» (/shift/, этап 29, docs/rooms.md): таймер работы вместе с Полли в её кабин: IMG, STOP, RANKS, sleep, anim
- `site/assets/site-edit.js` (24K) — режим «✏️ Править страницу» (админ): PPEdit, PRE, TPL, drawText, override
- `site/assets/site.js` (13K) — меню, шапка «влезает», лайтбокс галерей, /api/hit, `[data-profile]`: narrow, open, close, show, fit
- `site/assets/sketch-wall.js` (112K) — стена работ, вход, загрузка, бейджи, профиль /bird/, сумка: PPProfile, SPECIAL, LEVELS, COL, loadWall
- `site/assets/titos-bugs.js` (21K) — «Жуки» на /titos/ (этап 9 Б, docs/titos.md): в кабинет Титоса заползли жуки и жучки-прослу: DEMO, GOAL, SAY, drawCard, cupsOf
- `site/assets/titos-sort.js` (35K) — «Разбери дела» на /titos/ (этап 9 А, docs/titos.md): у Титоса упали коробки — документы из: PPTitos, SAY, DEMO, BLOT, setPot
- `site/assets/titos-ui.js` (13K) — «Детектив Титос» /titos/ (docs/titos.md): кофейник (полный / половина / пустой — Титос спи: PPTitos, REWARDS, COL, CSS, pot
- `site/assets/toast.js` (2K) — Тост внизу экрана (этап 5 Б) — один на всех: PPToast('Сохранено') или PPToast('Поставлено': PPSew, PPToast, toast
- `site/assets/today.js` (6K) — блок «Тема дня» (с главной убран): LBL, fill, open, wait
- `site/assets/top-board.js` (8K) — Доска топа игр (docs/games.md § Доски топа): <div class="gtop" data-top="rain"></div> или : PPTop, BOARDS, MED, day, row
- `site/assets/translate-btn.js` (3K) — «🌐 Перевести» — одна кнопка для всех разделов кабинета: PPTranslateBtn, LANGS, ERR
- `site/assets/wl-town.js` (68K) — Wobbleland: прогулка по городу (docs/wobbleland.md «Прогулка»): PPWlTown, LAND, PICKS, CRIT, crit
- `site/assets/wobbleland-data.en.js` (43K) — из content/wobbleland.json (build.py): WOBBLELAND
- `site/assets/wobbleland-data.lv.js` (45K) — то же, LV: WOBBLELAND
- `site/assets/wobbleland-data.ru.js` (58K) — то же, RU: WOBBLELAND
- `site/assets/wobbleland.js` (39K) — карта Wobbleland, карточки городов, праздники: PPWl, HOL, LOC, MAX, img

## Сборка

- `build.py` (41K) — сборка: страницы, меню, языки, блоки, галереи, поиск, данные для JS: CONTENT, OUT, ROOT, href, bust

## Инструменты (tools)

- `tools/add_images.py` (3K) — добавить картинки в галерею (ImageMagick): ROOT, caption_from, slug
- `tools/ava_deco_gen.py` (16K) — фоны и рамки аватаров → site/assets/ava-deco.css: BAT, HEART, ring_items, gem, mush
- `tools/cards/autumn_cozy.py` (40K) — Коллекция «Autumn Cozy»: 30 обычных карточек 120×168 (пиксель-арт) — осень и уют (№78–107): PAPER, LEAVES, OUT, badge, chips
- `tools/cards/halloween.py` (48K) — Коллекция карточек «Хеллоуин 2026»: 10 обычных карточек 120×168 (пиксель-арт, показ с imag: P_COL, CANDY, OUT, outline, paste
- `tools/cards/halloween_remix.py` (34K) — Коллекция «Halloween Remix»: 16 обычных карточек 120×168 (пиксель-арт) — ремиксы уникальны: OUT, BAYER, CARDS, badge, wash
- `tools/cards/unique_crop.py` (11K) — Фото карточек Алины (collectible_card_raw_*.JPEG) → ровная карточка 5:7.: ROOT, erase, order, tone, find_card
- `tools/catalog.js` (6K) — каталог вещей → site/assets/catalog.json (для сервера): FOOD, GEMS, SPECIAL_HATS, animated, stubEl
- `tools/challenge_check.js` (3K) — Проверка подбора тем челленджа: 24 месяца с ноября 2026 тем же модулем worker/challenge-pl
- `tools/challenge_items.js` (2K) — Предметы челленджа с тегами для сервера: challenge-data.js + content/challenge-tags.json →
- `tools/challenge_oct.js` (3K) — Октябрь 2026 в план челленджа: темы, как их считает нынешний themeFor (challenge-theme.js)
- `tools/challenge_tags.js` (18K) — Разметка предметов челленджа: семья, категория, сложность → content/challenge-tags.json (п: KWMAP, BATCH, DISHES, words, cnt
- `tools/daycolors.js` (1K) — цвета темы дня для сервера → day-colors.json
- `tools/docs/build_db.py` (5K) — собирает docs/db.md: ALTER, CREATE, ROOT, col, split_top
- `tools/docs/build_map.py` (19K) — собирает docs/map.md: ROOT, OUT, COMMON, top_funcs, call_counts
- `tools/docs/check_split.py` (3K) — сверка разбиения _claude-old.md: ROOT, KEY, MARK
- `tools/docs/split_claude_old.py` (28K) — режет _claude-old.md на docs/*.md: CLAUDE, HIST, SPLIT, table, parse_spec
- `tools/game_covers.py` (21K) — Пиксельные заставки карточек хаба /games/ → site/images/games/*.png.: ROOT, POLLY, POLLY_FLY, polly, advent
- `tools/i18n_add.py` (3K) — Дописывает переводы EN → RU, LV в content/i18n/ru.json и lv.json.: LANGS, I18N, ROOT, en_html, load_pack
- `tools/import_uploads.py` (4K) — раскладывает загрузки из GitHub по галереям: ROOT, EXT, PREFIX, convert, slug
- `tools/palette_names.py` (5K) — словарь названий цветов (en, ru, lv, hex): NAMES
- `tools/palette_overrides.py` (6K) — палитры, подобранные вручную
- `tools/palette_titles.py` (7K) — короткие названия палитр по картинкам
- `tools/palettes.py` (6K) — палитры из артов → content/palettes.json: HERE, to_lab, palette, to_hex, kmeans
- `tools/pins/pins2.js` (49K) — Пины Pinterest, вторая партия (№190+): полезные (списки, шаблоны, шпаргалки, палитры) и иг: PINS, ROOT, CSS, img, shot
- `tools/rooms/detective.py` (16K) — рисует кабинет Титоса (день/вечер, зоны): HOT, OUT, hot, titos, scene
- `tools/rooms/kit.py` (4K) — набор для пиксельных комнат: слои, шрифт 3×5, вечер: INK, evening, sprite
- `tools/rooms/office.py` (20K) — рисует кабинет Полли (день/вечер, зоны): OUT, HOT, hot, polly, scene
- `tools/rooms/props.py` (4K) — спрайты пасхалок комнат: OUT, _out, portrait, canvas
- `tools/rooms/scenes.py` (19K) — Места происшествия дел Титоса: пиксельные картинки 384×216 (×3) + места для клика в conten: ROOT, SCALE, SPRITES, emo, outline
- `tools/rooms/scenes_cases.py` (44K) — Места происшествия дел Титоса — по функции на дело (рисует tools/rooms/scenes.py, там же п: room, park, snailsquare, webcafe, carrotbar
- `tools/rooms/shift.py` (30K) — «Смена с Полли» (/shift/, этап 29, docs/rooms.md): детальный кабинет 480x270 + передний сл: FLOOR_Y, BACK_HANG, OUT, wing, add
- `tools/sec.py` (2K) — Печатает один раздел docs-файла.: HEAD, section, headings, find
- `tools/shots.py` (8K) — Снимки элемента страницы на нескольких ширинах (Playwright, Chromium из /opt/pw-browsers).: SHEET_W, OUT, ROOT, make_sheet, slug
- `tools/titos_cast.py` (2K) — Жители Воббленда для дел Титоса → docs/titos-cast.md (одна строка на жителя: ключ, имя, го: ROOT, cast, slug
- `tools/titos_check.py` (16K) — Проверка дел Титоса (content/titos/NNN.json, формат — docs/titos.md) и прохождение каждого: DIR, HOT, ROOT, texts, covered
- `tools/titos_clicks.py` (4K) — Дела Титоса в браузере: можно ли нажать каждую улику (зоны кабинета, спрайты, лупа, места : PROBE, CASES, ROOT
- `tools/video/apple.js` (21K) — Видео №2 для соцсетей (этап 15, docs/bird.md «Видео»): Полли рисует яблоко у мольберта, фо: FILM, SNAP, DRAW, APPLE, seg
- `tools/video/film.js` (18K) — Видео для соцсетей (этап 15, docs/bird.md «Видео»): 1080×1920, 30 fps: FILM, PAN, PLATE, STOVE, seg
- `tools/video/render.py` (5K) — Видео для соцсетей (этап 15): кадры рисует tools/video/film.js в Chromium → PNG → ffmpeg →: ROOT, FPS, CHROMIUM, video, png
- `tools/wobbleland/anno.py` (11K) — ручная разметка карты: улицы, дома, значки: HOUSES, STREETS, SQUARES
- `tools/wobbleland/crests3.py` (11K) — пиксельные гербы городов: INK, NAVY, MASK, arc_pts, oell
- `tools/wobbleland/dishes.py` (18K) — пиксельные блюда для книги рецептов: INK, plate, mug, nut, bowl
- `tools/wobbleland/make_map4.py` (10K) — пиксельная карта map-pixel.png: INK, LAND, ROOFS, mode_filter, house
- `tools/wobbleland/portraits.py` (2K) — Портреты жителей для «Блинной Полли»: site/images/wobbleland/pt-<ключ>.png (48×48) — квадр: ROOT, SIZE, DEF
- `tools/wobbleland/residents.py` (25K) — Жители Воббленда из коллекционных карточек (этап 8, для дел Титоса).: CONTENT, ROOT, OUT, token, slug
- `tools/wobbleland/sprites.py` (3K) — мелкие спрайты карты: INK, make

## Маршруты worker/index.js (125)

_без `/api`; `f` — возвращает f(); `~f` — код в `route()`, главная вызываемая f; — — только SQL_

/blog/* → blogApi · /pw/* → — · /funnel → — · /admin/pw-reset → — · /admin/funnels → ~authApi · /flock/news → — · /news-off → — · /admin/flock-notes → ~flockNewsApi · /wl-mail* → — · /admin/wl-holiday → ~wlMailApi · /birds → — · /feathers → — · /feather → ~flockApi · /top → ~topApi · /pancakes → — · /pancakes/* → ~pancakesApi · /garden → — · /garden/* → ~gardenApi · /shift → — · /shift/* → ~shiftApi · /titos* → — · /admin/titos* → ~titosApi · /cards* → — · /admin/cards* → ~cardsApi · /challenge/* → — · /admin/challenge* → ~challengeApi · POST /admin/translate → ~translateTo · POST /dev/migrate → migrateToR2 · POST /dev/cleanup → cleanupInactive · GET /profile → ~doorsOf · POST /birdcard → — · GET /birdcard → — · GET /stats → — · GET /flock → ~avatarOf · POST /subscribe → — · POST /unsubscribe → — · POST /hit → hit · GET /admin/visits → visitStats · POST /admin/links → — · POST /office/done → — · POST /room → ~roomEvent · POST /box0 → ~roomItems · POST /box0/seen → — · GET /rooms → ~roomOf · GET /game → ~gamePrices · POST /game/start → — · POST /game/level → ~rainItem · GET /potion → ~comboSeason · POST /potion/level → ~mazeItems · POST /potion/done → ~potDay · POST /potion/eye → — · GET /potion/bag → ~hintOk · POST /potion/hint → ~hintOk · POST /potion/give → ~invOf · POST /potion/revive → ~cleanRoom · POST /potion/seen → — · POST /potion/brew → ~potionOf · GET /requests → ~anonCode · POST /requests/tr → ~reqFill · POST /requests → ~anonCode · POST /requests/like → ~visitor · POST /admin/requests/answer → ~reqReward · POST /admin/requests/closed → — · POST /admin/requests/hide → — · GET /advent → ~adventNow · POST /advent/open → ~adventCollector · POST /admin/advent → ~okItem · GET /palettes → ~extraQueue · GET /extra-palettes.js → ~extraQueue · POST /admin/art → ~artEntry · POST /admin/art/hide → — · POST /admin/art/delete → ~extraQueue · GET /admin/users → — · /admin/blocks → — · /admin/subscribers → — · GET /flock/find → — · GET /admin/sec → ~secLocked · POST /admin/pin/verify → ~pinHash · POST /admin/pin/set → ~pinHash · POST /admin/recovery/new → ~loadSec · POST /recover → ~rcNorm · GET /whoami → ~wlLang · GET /news → ~newsOf · GET /config → ~mailOn · POST /login → ~funnelStep · POST /logout → ~sessionCookie · GET /today → dayCard · GET /me → ~adventAsk · GET /shop → ~ensurePrices · GET /new → ~catalog · GET /games/top → — · POST /shop/buy → ~legMax · POST /admin/shop/cats → ~cleanRules · POST /admin/shop/reprice → ~gameUnit · POST /admin/shop/restock → ~ensurePrices · /admin/shop → ~shopRow · POST /gift/give → ~cleanRoom · POST /gift/sell → ~toShop · POST /salary/seen → — · POST /admin/salary → — · POST /admin/tax → — · POST /admin/buttons-backfill → ~backfillButtons · POST /admin/buttons → — · POST /gift → ~avatarOf · POST /avatar → ~avatarOf · GET /admin/gifts → — · POST /admin/gift-all → ~legMax · POST /admin/gift → ~okItem · GET /nick/random → ~freeNick · POST /nick → ~welcomeOf · POST /upload → ~monthThemeBadges · POST /delete-post → ~imgDelete · GET /wall → — · GET /top → ~utcToday · GET /export → ~myCards · POST /delete-account → ~sessionCookie · POST /admin/pick → ~addBadge · POST /admin/shop/autorestock → ~autoRestock · /admin/inbox → — · /admin/inbox/seen → ~autopilot · GET /admin/autopilot → ~autopilot · /admin/rules → ~welcomeCheap · POST /admin/ai → — · POST /admin/hide → — · POST /admin/ban → —

## Маршруты worker/blog.js (35)

_пути без `/api/blog/`; обозначения те же_

GET state → ~anonCode · POST like → ~visitor · POST comment → ~ipHash · GET search → ~stripTags · GET home → ~fmtDate · GET backup → fullBackup · GET admin/posts → ~geminiKey · GET admin/post → — · POST admin/save → ~cleanHtml · POST admin/delete → — · POST admin/pin → — · GET admin/dupes → — · POST admin/dedupe → ~secsOf · POST admin/bulk → ~slugify · POST admin/feature → — · GET admin/overview → — · GET admin/comments → ~birdName · admin/gemini-key → ~gemini · admin/backup-token → — · GET admin/export → — · POST admin/restore-media → — · POST admin/import → — · GET admin/sections → ~loadTags · POST admin/section-set → ~translateAll · POST admin/section-delete → ~secsOf · GET admin/tags → ~tagsOf · POST admin/tag-set → ~syncTagColumns · POST admin/tags-translate → ~translateTags · POST admin/tag → ~syncTagColumns · POST admin/settings → — · POST admin/comment → — · POST admin/upload → — · POST admin/fetch-image → ~rehostOne · POST admin/translate → translateAll · /sitemap-blog.xml → ~secsOf

## RULE_DEFAULTS (worker/index.js) по группам

_правка — кабинет → 📜 Правила (meta `rules`)_

- пуговки за действия: daily, upload, comment, commentsPerDay, friend, pick
- уровни и бейджи (из BTN): levels, badges
- магазин: лимиты и цены: shopMax, legendMax, priceMin, priceMax
- запас «мало / обычно / много»: lowPct, normPct, manyPct, legendPct
- адвент: adventLastJan, adventButtons, adventSpecialButtons
- прочее: wlBtn
- прочее: welcomeBtn
- прочее: dayBonusNeed, dayBonusOf, dayBonusPct
- прочее: homeKitchen, homeBedroom, homeCrypt, homeBath, homeOffice
- ИИ-рисунки: aiStreak, aiUpload
- продажа вещей: sellOn, sellPrice
- Пуговичный дождь (награды в %): gameOn, gameLevelPct, gameRecordPct, gameDayMaxPct, gameMinSec, gameItemEvery, gameKingPct
- Зельеварня (награды в %): potionOn, potion1Pct, potion2Pct, potion3Pct, potionAgainPct, potionDayMaxPct, potionMinSec, potionRevive
- Зельеварня: сезон, полка: potionSeason, potionShelf
- цены: indexOn, indexBase, priceDays, catMult
- прочее: cardMult, cardsFirstDay, tradeDays, cardSurprisePct
- пополнение: restockOn, restockTo
- условия бейджей (cond): early, earlyBefore, owl, owlFrom, owlTo, ten, fifty, hundred, inkmaster, comeback, weekend, alt, clock, clockWin, monthly, veteranMonths, veteranPer, collector, colors, rainA, rainB, rainC, potA, potB, mazeA

## Общее

_Сюда следующие этапы дописывают общие сведения о коде._

- Новости птички: `NEWS_KINDS` (worker) → `news` в /api/whoami, /api/news; news.js `KINDS`. Новый вид — по записи там и тут.
- Тема дня челленджа: всегда `ChallengeTheme.themeFor(d, L)` (план месяца из D1, `theme.loading`, событие `pp:chplan`); подбор и план — worker/challenge-plan.js + challenge-days.js.
- useItem (sketch-wall.js) — «нажал — появилось»: вещь птички надеть/снять, вещь комнаты → `PPRoom.live.use` (своя комната на странице; нет — профиль с #use=). Тост — toast.js `PPToast(msg, { action, onAction, ms })` (в layout перед account.js). Свободное место в комнате — room.js `PPRoom.freeSpot(lay, d, k)`. Мелкая ли вещь — `PPRoom.isSmall(d)` (полки, коробки); что светит в темноте — `PPRoom.GLOW`. Можно ли в коробку — `PPCanDo(kind, item).pack`, коробка ли — `PPCanDo.isBox`.
- catalog-ui.js `PPCatalog`: плитка вещи `tile`, `tabs`, `chips`, `toggle`, `grid`, картинка `pic`, режим «сумка» `bag`, `usage` (где вещь), `kindLabel` — для сумки, потом магазина и карточек. Подключён на /bird/ и /challenge/ перед sketch-wall.js.
- cart.js `PPCart` — корзина магазина в браузере (list/add/set/has/clear/count/total), значок `#hd-cart` в шапке; окно корзины — в src/pages/shop.html. `PPCatalog.itemWindow` принимает `action2` (вторая кнопка).
- Этап 6: catalog-ui.js `PPCatalog.browse(box, o)` — общий каталог (поиск, «💰 Хватает пуговок», «Фильтры · N» — выезжающая панель, вкладки Всё · Птичке · Комнате · Карточки · Сюрпризы, «Нет в наличии» свёрнуто внизу, режим выбора `pick` + `cant` + `mark`) — магазин, адвент-окно (advent-admin.js), подарок в кабинете (admin.js `giftDialog`). Окно вещи с примеркой — `itemWindow`; useItem теперь `PPCatalog.use(kind, item, {me, after})`, последняя отмена — `PPCatalog.lastUndo`. Примерка комнаты — `PPRoom.mount(…, {preview: true})` (не сохраняет). Подключён ещё на /shop/ и в кабинете.
- Этап 7 В: cards-ui.js — `PPCards.trade` (окно обмена), `tradeCheck`, `profile(el, {nick, mine})` — вкладка «🃏 Карточки» профиля; подключён на /bird/, /shop/, в кабинете. worker/cards.js — `tradeScheme`, `tradeSweep`, `tradeNews`.
- Этап 7 Г: worker `toShop(env, req, u, g)` — вещь из сумки обратно в магазин (+1, снять/убрать из комнаты), её зовут продажа и 🔦 подсказка; `hintOk(kind, item)` — чем можно платить за подсказку. potions.js подключает catalog-ui.js.
- Этап 7: `PPCanDo(kind, item)` (site/assets/can-do.js, сервер и браузер) — что можно с вещью {shop, gift, sell, bag, box}; новые запреты — только туда. Альбом карточек — `PPRoom.albumOf(nick)` / `PPCards.album(nick)`.
- Этап 8: детектив Титос — worker/titos.js: `addCoffee(env, h, row, src, n)` (все изменения кофейника: case, sort, bugs, buy, лишнее → sell), `titosState(row, RULES, h)` (кофе, следующая чашка, «Жуки»; то же в /api/whoami → `user.titos`), `importTitos` (дела в D1 + перевод). Дела — content/titos/NNN.json → build.py `titos_cases()` → site/assets/titos-cases.json; проверка `tools/titos_check.py`, жители `tools/titos_cast.py`.
- account.js: `PPDevH()` — заголовок x-dev-date для ?devdate=; `PPWho` + событие `pp:whoami`. worker: `rigaMs()` — время по Риге → мс.
- Этап 8 (9–12): titos-ui.js `PPTitos.pot(el, s, {onRefill})` — кофейник, `PPTitos.rewards(el, level)` — 4 награды-силуэта; состояние — whoami `titos` или событие `pp:titos`. worker: `titosSolved(bird, level)` → `flockEvent('titos')` на №10, 20…; `TITOS_REWARDS` = `PPCanDo.TITOS`. docs/titos.md.
- Этап 9 Б+В: «Жуки» — site/assets/titos-bugs.js, `/api/titos/bugs/start` + `/api/titos/coffee {src:'bugs'}`; titos-sort.js отдаёт `PPTitos.kit` {potSvg, setPot, esc} для других игр Титоса.
- Этап 10-1: вещи-награды за дела Титоса — room.js `TC(…)` (furn|tc*, game), `PPCanDo.isCase`, выдача в worker/titos.js accuse (`item`), картинка в quest-titos.js; проверка — titos_check.py `REWARDS`.
- Этап 11 А: награды Титоса за уровни — room.js (chalkrug, titospot:N, clueboard, titosbadge; `PPRoom.aboutOf` — описание вещи в окне, `potCoffee`), worker/titos.js `TITOS_ITEMS`/`levelItem`/`rewardNews`, новость `reward`. DECO с `game: true` тоже не попадает в каталог; мебель с `flat: true` — плоская, как коврик.
- Этап 9 А: «Разбери дела» — раунд собирает `sortRound` (worker/titos-sort.js, архив старых дел там же), API `/api/titos/sort/{start,blot,done}` в worker/titos.js; кофе — `addCoffee(…, 'sort', 1, {noSell})`. Браузер — site/assets/titos-sort.js (карточка под кабинетом, игра в окне; `?sort=demo`).
- Этап 13 Г: новости стаи — worker/flock-news.js: `flockEvent(env, вид, птичка, data)` (в index.js — `flockEventDb`; хелперам — `h.flockEvent(вид, птичка, data)`), `roomEvent`, `flockNewsCron` (30 дней), GET /api/flock/news, /api/admin/flock-notes, POST /api/news-off. Браузер — site/assets/flock-news.js `PPFlockNews.mount(el, {limit})` или `<div data-flock-news="3">`. Новый вид новости = вид в `BIRD_KINDS` (+ ref в `REF`) и шаблоны en/ru/lv в `TPL` (flock-news.js).
- Этап 13 Б+В: worker/flock.js `flockApi` (/api/birds, /api/feathers, /api/feather), `featherNews`; site/assets/flock-list.js («Все птички»), feathers.js `PPFeathers.mount`.
- Этап 13 А: карточка дня — site/assets/day-card.js `PPDay` (на всех страницах: `mount`, `check`, тост «Штамп!»), GET /api/today (`dayCard`, `TASKS`); штамп без пуговок — worker `stamp(env, uid, задание)` / `h.stamp`. Новое задание — строка в `TASKS` + как понять «сделано».
- Этап 12: вход с паролем, письма и воронки — worker/auth.js (`authApi`, `sendMail(env, to, subject, text)`, `mailOn`, `funnelStep(env, req, воронка, шаг, h)`, `FUNNELS`, `googleLink`, `hashPw`); правила пароля — site/assets/pw-rules.js `PPPw.check`; окна — account.js `PPAccount.pwDialog`, `logoutAll`. Новая воронка = строка в `FUNNELS`; вид в «👥 Посетителях» общий (admin.js `funnels`).
- Праздники Воббленда: worker/wl-holidays.js — подарок всем птичкам и письмо в день праздника (`wlHolidayCron`), отписка /api/wl-mail/off, данные site/assets/wl-holidays.json (tools/catalog.js). Язык птички для писем — `users.lang`.
- Этап 14 А: site/assets/hatch.js `PPHatch` — `egg(canvas)` пиксельное яйцо 28×26, `play(canvas, sprite)` вылупление, `welcome({nick, welcome, id, avatar})` окно «Добро пожаловать», `click()`/`nicked()` воронка `hatch`; `html.me-in` — вошедший с ником. worker: `welcomeOf(env, req)` — подарок новичку {kind, item, btn} (случайная вещь ≤ WELCOME_MAX, пуговки — правило welcomeBtn), /api/nick → `welcome`.
- Этап 14 Б: меню — build.py `NAV`, `SECTIONS` (путь, название, значок, описание), `SECTION_HUB`, `TAB_ALIAS`, `CRUMB_ONLY`; подпись раздела над страницей — `section_tabs` (`.crumbs`). Пуговки в шапке — `PPAccount.setButtons(n)`; профиль открывается на месте по /bird/#room, #bag, #album.
- Этап 16: «Блинная Полли» — worker/pancakes.js `pancakesApi` (хелперы из index.js: `badge` = gameBadge, `item` = rainItem с note); `rainItem(env, req, uid, lv, note)` — вещь-подарок игры, годится для новых игр. Бейдж игры = запись в sketch-wall.js (SPECIAL + EXTRA_PIX + COND0/condVals), admin.js (BADGE_RU/BADGE_COND), flock-news.js BADGES, worker BTN.badges + RULE_DEFAULTS.cond.
- Этап 17: доски топа игр — worker/top.js (`topApi`, `topScore(env, игра, uid, n)`, `topWeek`, таблица top_week), site/assets/top-board.js `PPTop` (`<div data-top="игра[,игра]">`). Новая игра = запись в `GAMES` (worker/top.js) и `BOARDS` (top-board.js) + вызов topScore.
- `site/assets/pixel-badge.js` — `PPPixelBadge`: пиксельные бейджи 16×16 (шаблоны, символы, svg), общий для кабинета и сайта.
- Этап 22: огород — worker/garden.js (`gardenApi`, `CROPS`, `grown`, `bugsOf`, `seasonOf`, правила GARDEN_*), site/assets/garden.js (сцена, `drawPlant`, `icon` — пиксельная иконка растения). Новое растение = строка в `CROPS` + `CROP` и ветка в `drawPlant`. Вход — плитка `.room-plan-out` в плане дома (room.js).
- Этап 23: семена и вещи огорода — worker/garden.js (`TIER` редкие/волшебные, `gardenDrop` — из `award` для SEED_GAMES и жуков Титоса, `gardenNews` — новость seeds, серии `weekly`), site/assets/garden-items.js `PPGardenItems` (вид подарка garden: рисунки, `layout` в огороде), `PPGardenPlants` (garden.js: иконки растений и для магазина). Новая вещь огорода = строка в ITEMS.
