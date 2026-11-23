# Карта кода

_`python3 tools/docs/build_map.py`: файл (размер) — что в нём: главные имена (первыми — то, что кладётся в `window`). Номера строк нет — искать grep-ом; номера строк, маршруты и разделы доков — `docs/index.tsv` (`python3 tools/index.py find …`), см. `docs/index.md`. «Общее» внизу при пересборке сохраняется._

## Сервер

- `worker/about-chat.js` (15K) — Чат «Поболтать с Алиной и Полли» на /about-me/ (site/assets/about-desk.js, docs/site.md).: KEY, LANGS, CHATNEW_UNTIL, ACHAT_ITEM, ASK_MIN, STEPS, answered, chatRewards, langOf, rowOf, aboutAskNews, aboutChatApi
- `worker/analytics.js` (13K) — Чтение статей (reads) и «📊 Аналитика» кабинета: одна таблица с любым разрезом (docs/admin.: ART_RE, T_BY, T_F, ANALYTICS_ALTER, ANALYTICS_TABLES, tShift, facet, rDay, inRange, keyOf, tWhere, tDay
- `worker/artpill.js` (10K) — «Art-Pill by Polly» (/art-pill/, site/assets/artpill.js, docs/artpill.md): скетчбуки ИИ по: ARTPILL_VERSIONS, BOOKS_MAX, ARTPILL_TABLES, bookOut, artpillDrop, artpillApi, artpillExport
- `worker/auth.js` (24K) — Вход с паролем (этап 12): регистрация, вход по почте или нику, смена и сброс пароля, «выйт: FUNNELS, ADVENT_DAY_MAX, DUMMY, ITER, AUTH_ALTER, AUTH_TABLES, rows, failAll, hashPw, ipKey, lockedAny, normEmail
- `worker/avis.js` (83K) — «Morgenavis» — личная утренняя газета на норвежском для Алины (/norsk/avis/, docs/site.md : PICK, READ, FEEDS, LEVELS, SEC, TRC, wrap, article, tag, feed, decode, state
- `worker/blog.js` (109K) — блог: страницы /blog/, /api/blog/*, редактор, перевод Gemini, копии: SITE, TAGMAP, LANGS, TOP, GLOSSARY, PREFIX, blogUrl, rows, tagLabel, loadTags, stripTags, tagsOf
- `worker/cards.js` (48K) — Коллекционные карточки за пуговки (docs/cards.md): каждая — в одном экземпляре на весь сай: DAY, RARITY, DESC, SEL, TRADE_N, CARD_ALTER, listOut, sets, tradeDays, round5, statsOf, asset
- `worker/challenge-days.js` (34K) — План тем челленджа в D1 (этап 3, docs/challenge.md «Подбор тем»): таблица challenge_days, : BLANK_FROM, FIRST, BANK_TAGS, COLS, ITEMS, LAST, rigaToday, toRow, bankSync, daysIn, ensureMonth, pad
- `worker/challenge-plan.js` (27K) — Подбор тем челленджа (этап 3, docs/challenge.md «Подбор тем»): план месяца по правилам.: RELAX, BW_GROUPS, MIN_DE, WORD_DAYS, BDAY, CH_DEFAULTS, dayNum, rngFor, hueGap, keyOfNum, pickW, poolOf
- `worker/courier.js` (18K) — «Art Coo-rier: World News» — выпуск новостей искусства одной кнопкой в редакторе блога (do: TXT, MIN_W, PICK_N, FEEDS, GN_ART, MONTHS, fresh, words, fact, ruDate, alike, isNewFact
- `worker/english-page.js` (1184K) — Собрано tools/english_page.py из content/english/ — руками не править.: ENGLISH_HTML
- `worker/english.js` (5K) — Личный учебник английского A1–C2 (/english/, docs/site.md «Учебник английского»): открыт А: ENGLISH_NICKS, LOCKED, MAX, ENGLISH_TABLES, page, englishOk, englishApi
- `worker/flock-news.js` (10K) — Новости стаи (этап 13 Г, docs/flock.md): /flock/news/ и 3 строки на главной.: KEEP, BIRD_KINDS, REF, FLOCK_NEWS_ALTER, FLOCK_NEWS_TABLES, note, rigaDayOf, flockEvent, flockNewsCron, roomEvent, flockNewsApi
- `worker/flock.js` (10K) — «Все птички» (/flock/) и пёрышки комнат (этап 13 Б+В, docs/flock.md).: BIRD, PER, COLS, SORTS, FLOCK_ALTER, FLOCK_TABLES, ownerOf, stateOf, featherNews, flockApi
- `worker/garden.js` (31K) — Огород птички (этап 22, /garden/, site/assets/garden.js, docs/bird.md «Огород»): грядки, деревья, с: CROPS, TIER, GARDEN_ALTER, GARDEN_BOOL, out, fnv, grown, needMs, bedsN, shiftBeds, bugsOf, choresOf, bedOk
- `worker/guides.js` (15K) — Кабинет → «🎬 Видео и гайды» (site/assets/guides-admin.js, docs/admin.md): Алина сама добав: KEY, SEEN_MAX, BASE, HOWTO_MAX, GUIDES_ALTER, cut, out, bImg, hwDrop, hwFiles, hwUrl, langsOf
- `worker/ideas.js` (17K) — Кабинет → «💡 Темы для блога»: по кнопке собираем, что сейчас ищут и обсуждают в сфере Алин: PAGES, IDEAS, MONTHS, SITE, SUBS, ARTICLE, write, ask, suggest, reddit, plain, redditSearch
- `worker/index.js` (320K) — Worker: site/, страницы через HTMLRewriter, /api (кроме блога), cron: RULES, BTN, STOCK, GIFT_KINDS, GOLD_PICKS, LEGEND, url, prep, healthErr, award, run, btnOf
- `worker/kitchen.js` (10K) — Кухня птички: книга рецептов (этап 89, docs/bird.md «Кухня: книга рецептов»): RECIPES, DISH_GAMES, LATE, HOUR, PERFECT, KITCHEN_BOOL, recipes, rowOf, state, settle, cropOf, effectOf
- `worker/mail-html.js` (10K) — Оформление писем: из обычного текста письма — HTML в стиле сайта (sendMail в worker/auth.j: SITE, SERIF, URL_RE, ACC, BTN, KICK, button, langOf, seasonOf, short, mailHtml
- `worker/mail.js` (25K) — Письма с сайта по согласию (docs/bird.md «Письма»): три вида — games (уведомления из игр),: MAIL_DAY_MAX, ORDER, DIGEST, MAIL_CATS, ITEM, CAT, pageUrl, langOf, pre, sendOne, spend, usedToday
- `worker/mixing.js` (3K) — «Смешивание цветов» /color-mixing/ (docs/palettes.md «Смешивание цветов»): «Мои краски», в: MEDIA, LINE, MIXING_TABLES, clean, mixingApi
- `worker/nederlands-page.js` (1016K) — Собрано tools/nederlands_page.py из content/nederlands/ — руками не править.: NEDERLANDS_HTML
- `worker/nederlands.js` (8K) — Личный учебник нидерландского A1–C2 (/nederlands/, docs/site.md «Учебник нидерландского») : AUDIO, LOCKED, MAX, NEDERLANDS_NICKS, TTS_VOICE, TTS_MODELS, tts, page, wav, nederlandsOk, nederlandsApi
- `worker/norsk-page.js` (953K) — Собрано tools/norsk_page.py из content/norsk/ — руками не править.: NORSK_HTML
- `worker/norsk.js` (8K) — Личный учебник норвежского (букмол) A1–C2 (/norsk/, docs/site.md «Учебник норвежского») — : AUDIO, LOCKED, MAX, NORSK_NICKS, TTS_VOICE, TTS_MODELS, tts, page, wav, norskOk, norskApi
- `worker/notebook.js` (5K) — 📒 Блокнот в учебниках (/study/, /english/, /norsk/, /nederlands/; docs/site.md «Блокнот в : BOOKS, NOTEBOOK_TABLES, cleanPage, metaOf, notebookApi
- `worker/notes.js` (11K) — 📣 Рассылка (10.11.2026, docs/bird.md «Рассылка»): сообщение от Алины на 3 языках (+ файл д: NOTE_FILE_MAX, LANGS, SITE, NOTE_ALTER, NOTE_TABLES, audWhere, fileOut, pickL, audIds, audRange, noteHistory, noteNews
- `worker/pancakes.js` (12K) — «Блинная Полли» (/pancakes/, site/assets/pancakes.js, docs/games.md): Полли печёт блины жи: PAN_UPS, TOP, PAN_ALTER, PAN_BADGES, PAN_COND, PAN_INT, today, upsOf, price, pancakesApi
- `worker/pause.js` (3K) — ⏸ Пауза сайта (docs/admin.md «Пауза»): meta site_pause = '1' — посетители на любой страниц: TTL, pauseOn, pauseApi, pauseGate
- `worker/pins.js` (4K) — Кабинет → 📌 Пины (site/assets/posts-admin.js): POST /api/admin/pin-text — Gemini смотрит н: KIND, SCHEMA, pinTextApi
- `worker/polls.js` (15K) — Опросы (docs/site.md «Опрос на главной», docs/admin.md «Опросы»): Алина в кабинете → «🗳 Оп: LANGS, POLL_ALTER, POLL_TABLES, out, row, cut, expire, counts, myVote, pollOut, voter, homePoll
- `worker/postcards.js` (19K) — 💌 Открытки /postcards/ (docs/postcards.md): вошедшая птичка выбирает открытку, пишет пару : SITE, URLISH, PAGE, POSTCARD_INT, POSTCARD_RANGE, POSTCARD_RULES, normEmail, hex, cleanName, langOf, leftToday, sign
- `worker/runes-data.js` (78K) — Руны Алины (кабинет → «🔮 Руны», только админ): колода «Runic Oracle» (Richard Lister, 2025: RUNES, RUNE_PLAIN, RUNE_POS_ASK, RUNE_PREP, RUNE_SPREADS
- `worker/runes.js` (1K) — 🔮 Руны (кабинет → «🔮 Руны», только Алина-админ; docs/admin.md «Руны»): колода «Runic Oracl: CARDS, SPREADS, runesApi
- `worker/school.js` (15K) — Курсы рисования со сдачей работ (docs/challenge.md): «Смотри на мир как художник» (/polly-: COURSES, LANGS, SCHOOL_KEEP_DAYS, INK_YEAR, SCHOOL_ALTER, SCHOOL_INT, courseOf, dipOf, doneOf, inkOn, trOf, langOf
- `worker/shift.js` (4K) — «Смена с Полли» (/shift/, этап 29, site/assets/shift.js, docs/rooms.md): таймер работы вме: SHIFT_MIN, SHIFT_ALTER, SHIFT_INT, SHIFT_RANGE, SHIFT_RULES, SHIFT_TABLES, out, shiftApi
- `worker/study-page.js` (771K) — Собрано tools/study_page.py из content/study/textbook.html — руками не править.: STUDY_HTML
- `worker/study.js` (3K) — Личный учебник «Full Stack Java · Angular» (/study/, docs/site.md «Учебник»): только для п: KEY, LOCKED, STUDY_NICKS, STUDY_TABLES, page, studyOk, studyApi
- `worker/tarot-data.js` (108K) — Таро Алины (кабинет → «🃏 Таро», только админ): «Таро кошек» — 78 карт, значения в прямом и: TAROT, TAROT_PREP, TAROT_SPREADS
- `worker/tarot.js` (908B) — 🃏 Таро (кабинет → «🃏 Таро», только Алина-админ; docs/admin.md «Таро»): «Таро кошек» — раск: tarotApi
- `worker/titos-sort.js` (13K) — «Разбери дела» (этап 9 А, docs/titos.md): у Титоса упали коробки: SORT_TWISTS, ARCHIVE, shuffle, rng, sortRound
- `worker/titos.js` (31K) — Детектив Титос (docs/titos.md): 100 уровней-дел, кофе, пуговки за уровень.: MAX, MIN, TITOS_PRIZES, OPEN, TITOS_ITEMS, TR_BUDGET, out, resolve, rowOf, saveRow, caseOf, settle
- `worker/top.js` (5K) — Доски топа игр (docs/games.md § Доски топа): одна на каждую игру, вкладки «За всё время» и: GAMES, TOP_TABLES, topWeek, prevWeek, topScore, topApi, topCron
- `worker/train.js` (11K) — «Поезд Полли» (/train/, site/assets/train.js, docs/games.md): Полли едет на поезде, Эмпана: TRAIN_LANGS, TRAIN_UPS, TOP, TRAIN_ITEMS, TRAIN_ALTER, TRAIN_BADGES, today, lvOf, upsOf, price, trainApi
- `worker/translate.js` (10K) — Общий перевод для всего сайта (статьи блога, «Нарисуй мне», карточки и всё, что переводитс: BLOG, LANG_NAME, GEMINI_MODELS, LANGS, ABOUT, gemini, run, stripTags, translateOne, geminiKey, translateAll, translateTo
- `worker/uttale.js` (14K) — Собрано tools/norsk_page.py из content/shared/uttale.js — руками не править.: UTTALE_JS
- `worker/visits.js` (4K) — Гости в комнате птички (21.11.2026, docs/bird.md «Гость в чужой комнате»): вошедшая птичка: VISIT_TTL, ACTS, HOMES, VISIT_TABLES, visitsApi
- `worker/week.js` (5K) — Кабинет → «🗓 Неделя» (редизайн 2.0, часть 4; docs/admin.md «Неделя»): 5 цифр за 7 дней и с: OUT_TARGETS, WEEK_TABLES, dayAgo, outClick, weekApi
- `worker/wl-holidays.js` (12K) — Праздники Воббленда (docs/wobbleland.md «Праздничные письма»): в день праздника (по Риге) : SITE, MAIL_DAYS, DAY_MAX, WL_ALTER, holidays, langOf, unsubToken, letter, shift, wlHolidayCron, wlLang, wlNote

## Браузер (site/assets)

- `site/assets/about-admin.js` (6K) — Кабинет → «📮 Вопросы из чата» (admin.js открывает PPAboutAdmin.mount(main)): вопросы, кото: PPAboutAdmin, ERR, LANG, TABS, mount
- `site/assets/about-desk.js` (52K) — «Стол Алины» на /about-me/ (docs/site.md): пиксельная картинка site/images/about/desk.webp: PAGE, SKIN, PAINT, rnd, box
- `site/assets/account.js` (43K) — вход в шапке, меню аккаунта, обязательный ник, `html.is-admin`: PPDevH, PPWhoP, PPWho, ALINA_MAIL, IN_APP
- `site/assets/admin.js` (230K) — кабинет /admin/ (все разделы): PPGiftDialog, PPAud, BADGE_COND, ADMIN_GROUPS, ADMIN_SECTIONS
- `site/assets/advent-admin.js` (32K) — кабинет → 🎄 Адвент: план окошек: PPAdventAdmin, FILE_MAX, ADV_SP, fthumb, advSet
- `site/assets/advent.js` (20K) — адвент /advent/: отсчёт, окошки: FIR, LATE, HOUSES, inside, win
- `site/assets/artpill-claude.js` (50K) — «Art-Pill by Polly»: скетчбук Claude — страницы с первой по последнюю (docs/artpill.md): PP_ARTPILL_CLAUDE, FIRST, SECOND, THIRD
- `site/assets/artpill.js` (40K) — «Art-Pill by Polly» (/art-pill/, docs/artpill.md): версии таблетки, «почему это не просто : VERSIONS, img, pic, openBook, reader
- `site/assets/backup.js` (14K) — резервные копии (кабинет): PPBackup, FOLDER, README, SITE, backup
- `site/assets/bird-card.js` (14K) — карточка «Моя птичка» (сторис) и ссылка /flock/?bird=: PPBirdCard, GOLD, CSS, RING, rnd
- `site/assets/birds.js` (57K) — птички: внешность из id, спрайты, вещи и подарки (`PPBirds`): PPBirds, SPECIAL_HATS, HATS, HD_ITEMS, avatar
- `site/assets/blog-editor.js` (138K) — редактор блога /blog-editor/: LANGS, ERR, FN_RE, dashboard, pad2
- `site/assets/blog.js` (13K) — блог для посетителя: лайк, комментарии, кнопки админа: login, adminTools, load, openFn, gButton
- `site/assets/broadcast-admin.js` (14K) — Кабинет → «📢 Рассылка» (admin.js открывает PPBroadcast.mount(main)): «кому» (все / новые /: PPAud, PPBroadcast, ERR, AUD, KEY
- `site/assets/cabinet.js` (17K) — : PPCab, BOOK, TABS, HASH, sec
- `site/assets/can-do.js` (5K) — Что можно с вещью (этап 7, docs/cards.md «Что можно с вещью»): одна функция и для браузера: TITOS, BOXES, LEGEND, canDo
- `site/assets/cards-admin.js` (18K) — Кабинет → «🃏 Карточки» (admin.js открывает PPCardsAdmin.mount(main)): список, новая карточ: PPCardsAdmin, LANGS, RAR, ERR, missing
- `site/assets/cards-ui.js` (49K) — Коллекционные карточки (docs/cards.md): плитка, окно карточки и раздел «🃏 Карточки» на рын: PPCards, PER, RAR, NEED, trade
- `site/assets/carousel.js` (19K) — карусели для Instagram/TikTok из работ челленджа: PPCarousel, SERIF, CRC, zip, brand
- `site/assets/cart.js` (3K) — 🛒 Корзина: вещи откладываются, а не покупаются сразу: PPCart, KEY, read, count, has
- `site/assets/catalog-ui.js` (41K) — Каталог вещей: плитка, вкладки, чипы, переключатель; режим «сумка» (профиль птички).: PPCatalog, LANG, PRICES, SORTS, kindsLabel
- `site/assets/challenge-admin.js` (77K) — Кабинет → «🎨 Темы челленджа» (admin.js открывает PPChallengeAdmin.mount(main)): календарь : PPChallengeAdmin, HARM, WT_NOW, GRIDS, grid
- `site/assets/challenge-data.js` (155K) — данные челленджа: предметы, цвета, советы (EN/RU/LV): CHALLENGE_DATA
- `site/assets/challenge-theme.js` (12K) — тема дня (общая для /challenge и главной), день ЭКСТРА: ChallengeTheme, BDAY, NEUTRAL, ALLC, rngFor
- `site/assets/challenge.js` (33K) — страница челленджа: тема, таймер, календарь, карточка, серии: SPLIT, START, COOLC, renderDiary, resetTimer
- `site/assets/cheatsheet-admin.js` (17K) — Кабинет → «🧩 Конструктор шпаргалок» (admin.js открывает PPCheatAdmin.mount(main)): шпаргал: PPCheatAdmin, ERR, KINDS, LANGS, rid
- `site/assets/cookbook.js` (23K) — Книга рецептов на кухне птички (этап 89, docs/bird.md «Кухня: книга рецептов»): window.PPC: PPCookbook, DISH, GAME, inner, bookView
- `site/assets/day-card.js` (16K) — Карточка дня (этап 13 А): «почтовая открытка» с ячейками-штампами — задания на сегодня из : PPDay, ICON, KIND, cell, two
- `site/assets/diploma.js` (7K) — Пиксельный диплом курсов (общий): «Смотри на мир как художник» (polly-school.js) и курс ту: PPDiploma, svg, mount, canvas, save
- `site/assets/dish-chip.js` (5K) — Значок действующего блюда с кухни в играх и огороде (этап 89, docs/bird.md «Кухня: книга р: PAGE, here, css, take, dur
- `site/assets/emoji-art.js` (139K) — Нарисованные эмодзи в стиле сайта (docs/site.md «Нарисованные эмодзи»): PPEmojiArt, ART, BAD, SKIP, dbl
- `site/assets/extra-palettes.js` (80K) — палитры ЭКСТРА (build.py): EXTRA_PALETTES
- `site/assets/feathers.js` (5K) — Пёрышки комнаты (этап 13 В, docs/flock.md): полоска под комнатой в профиле /bird/.: PPFeathers, lv1, fall, mount, post
- `site/assets/flock-list.js` (8K) — «Все птички» — /flock/ (этап 13 Б, docs/flock.md): «В стае N птичек», поиск по нику, «🎲 Сл: SORTS, card, load, check
- `site/assets/flock-news.js` (19K) — Новости стаи (этап 13 Г, docs/flock.md): лента /flock/news/ и 3 строки на главной над сцен: PPFlockNews, BADGES, BTN, PACK, prof
- `site/assets/flock.js` (142K) — стая: сцена canvas, локации, действия, предметы: PPFlockDebug, TREE, EVENTS, ORN_C, rnd
- `site/assets/freebies.js` (11K) — freebies/ (docs/freebies.md): календари и заставки из site/assets/freebies.json (tools/pin: MON
- `site/assets/games-hub.js` (2K) — Хаб «Играть» (/games/, этап 14 В): вошедшим — готовность на карточках из GET /api/today («: set, dur
- `site/assets/garden-items.js` (13K) — Вещи для огорода (этап 23, docs/bird.md «Огород»): вид подарка garden — в магазине, сумке,: PPGardenItems, ITEMS, LEG, ORDER, layout
- `site/assets/garden.js` (57K) — Огород птички (этап 22, /garden/?nick=, docs/bird.md «Огород»): пиксельная сцена 240×150 (: PPGardenPlants, CROP, NIGHT_ON, TALL, float, drawChore, editMode, placeBed, cleanAll
- `site/assets/guides-admin.js` (14K) — Кабинет → «🎬 Видео и книги» (admin.js открывает PPGuidesAdmin.mount(main)): добавить видео: PPGuidesAdmin, ERR, form, jpeg, mount
- `site/assets/hatch.js` (9K) — Вылупление (этап 14, docs/site.md «Главная»): пиксельное яйцо, трещины и птичка из скорлуп: PPHatch, EGG, KEY, SPOTS, step
- `site/assets/ideas-admin.js` (9K) — Кабинет → «💡 Темы для блога» (admin.js открывает PPIdeasAdmin.mount(main)): кнопка — сайт : PPIdeasAdmin, ERR, fmt, mount, text
- `site/assets/ink-course.js` (27K) — Курс «Тушь: скетчинг без страха» (/ink/, docs/ink.md) — по книге Алины «Ink Sketching: Cre: KEY, PLAN, ICONS, has, send
- `site/assets/mail-admin.js` (9K) — Кабинет → «✉️ Письма» (admin.js открывает PPMailAdmin.mount(main)): кто согласился на пись: PPMailAdmin, CAT, ERR, KEY, mount
- `site/assets/mixing.js` (94K) — «Смешивание цветов» /color-mixing/ (docs/palettes.md): материал → цвет → рецепты из настоя: MEDIA, WHITE_HEX, CMF, mixHex, mixLab
- `site/assets/news.js` (47K) — «Конвертик» — одна очередь новостей птички на всех страницах (этап 4 А).: PPNews, KINDS, COL, BOXES, feed
- `site/assets/palettes.js` (40K) — страница /palettes/, палитра из фото, добавление палитр админом: PPPalette, NAMES, ADD_G, BADGE, isAdmin
- `site/assets/pancakes.js` (113K) — Игра «Блинная Полли» (/pancakes/, docs/games.md): Полли печёт блины жителям Воббленда: PAN, SAY, BAKE, setPhase, bakeCol
- `site/assets/pixel-badge.js` (13K) — Пиксельные бейджи тематик месяцев (кабинет → «🏅 Тематика месяца» → «🎨 Бейдж»; показ — sket: PPPixelBadge, GLYPHS, TEMPLATES, RING, rect
- `site/assets/poll.js` (10K) — Опрос на главной (worker/polls.js, docs/site.md «Опрос на главной»): бюллетень на бумаге —: ERR, fmtDate, share, load, render
- `site/assets/polls-admin.js` (13K) — Кабинет → «🗳 Опросы» (admin.js открывает PPPollsAdmin.mount(main)): создать опрос (вопрос : PPPollsAdmin, ERR, date, form, mount
- `site/assets/polly-school.js` (25K) — «Школа Полли» (/polly-helps/, docs/challenge.md): Полли в фартуке у мольберта учит рисоват: IMG, KEY, stepsOf, send, path
- `site/assets/polly.js` (58K) — Полли-питомец в левом нижнем углу (`PollyPet`): PollyPet, CORNER, SPR, KPX, say
- `site/assets/postcard-designs.js` (6K) — Открытки /postcards/ (docs/postcards.md): общий список для браузера (postcards.js) и серве: DESIGNS, CATS
- `site/assets/postcard-scenes.js` (26K) — 💌 Рисованные открытки /postcards/ (docs/postcards.md): пиксельные сцены 180×120 с Полли (P: PPPostcardScenes, LINE, TRI, GIFT, polly
- `site/assets/postcards.js` (31K) — 💌 Открытки /postcards/ (docs/postcards.md): выбрать открытку → послание → почта получателя: PPPostcard, TAU, LOOP, INK, gallery
- `site/assets/posts-admin.js` (32K) — Кабинет → «🖼 Пины» (admin.js открывает PPPostsAdmin.mount(main); раньше тут был генератор : PPPostsAdmin, TYPES, DEF, DESIGNS, photo
- `site/assets/potion-names.js` (27K) — общие данные Зельеварни: ингредиенты, названия зелий (`PPPotion`): PPPotion, ADJ, FALL, ING, potion
- `site/assets/potions.js` (57K) — игра «Зельеварня» /potions/: лабиринт, котёл, рецепты: DIRS, HUD, play, overlay, brew
- `site/assets/prompts.js` (5K) — prompts/ — темы месяца (GET /api/challenge/month): карточки, картинка 1080×1350 для телефо: before, shift, makeImage, wrap, load
- `site/assets/pw-rules.js` (2K) — Правила пароля — одни для сервера (worker/index.js) и браузера (account.js): от 8 символов: COMMON, norm, check
- `site/assets/quest-polly.js` (15K) — задачи в офисе Полли: ORDER, HOTS, KEY, openMail, done
- `site/assets/quest-titos.js` (33K) — дела детектива Титоса: LANG, HOTS, OLD, openClue, openBoard
- `site/assets/rain.js` (27K) — игра «Пуговичный дождь» /rain/: SKIES, COLORS, MISS, pop, showOverlay
- `site/assets/requests.js` (32K) — «Нарисуй мне» /requests/: HID, lists, pollyPick, saveImg, translateRest
- `site/assets/room.js` (391K) — комната птички: каталог мебели, расстановка, поведение (`PPRoom`): PPRoom, OUT, FURN, ICE, rbox
- `site/assets/rooms-data.js` (5K) — зоны комнат (build.py): ROOMS
- `site/assets/rooms.js` (39K) — пиксельные комнаты (офис Полли, Титос): зоны, реплики, эффекты (`ROOM`): ROOM, API, IDX, pct, setEvening
- `site/assets/runes-admin.js` (16K) — Кабинет → «🔮 Руны» (только админ; admin.js открывает PPRunesAdmin.mount(main)): PPRunesAdmin, KEY, CSS, grid, isGod
- `site/assets/school-admin.js` (8K) — Кабинет → «🎓 Курсы» (admin.js открывает PPSchoolAdmin.mount(main)): работы учеников обоих : PPSchoolAdmin, COURSES, ERR, INK, mount
- `site/assets/school-lessons.js` (64K) — Уроки «Школы Полли» (polly-school.js): 12 уроков по книге Алины «Watercolor Sketches: Crea: PP_SCHOOL_LESSONS, PHOTO, cupArt, svg
- `site/assets/scroll-nav.js` (2K) — стрелочки наверх/вниз: update
- `site/assets/search.js` (5K) — поиск по сайту (🔍, «/»): run, build, open, render, snippet
- `site/assets/shift-music.js` (11K) — «Смена с Полли» (этап 29): три бесконечные ретро-мелодии и глупая пиксельная колыбельная —: PPShiftMusic, TRACKS, MAJ, LULL, tone
- `site/assets/shift.js` (30K) — «Смена с Полли» (/shift/, этап 29, docs/rooms.md): таймер работы вместе с Полли в её кабин: IMG, STOP, RANKS, sleep, anim
- `site/assets/site-edit.js` (24K) — режим «✏️ Править страницу» (админ): PPEdit, PRE, TPL, drawText, override
- `site/assets/site.js` (16K) — меню, шапка «влезает», лайтбокс галерей, /api/hit, `[data-profile]`: PPOut, narrow, open, close, show
- `site/assets/sketch-wall.js` (120K) — стена работ, вход, загрузка, бейджи, профиль /bird/, сумка: PPProfile, SPECIAL, LEVELS, COL, loadWall
- `site/assets/sketchbook.js` (13K) — Скетчбук /sketchbook/ (docs/site.md): вкладки-тетрадки, просмотр картин, число картин на о: select, tabs, fromHash, panel, recount
- `site/assets/spectral.min.js` (12K) — 
- `site/assets/tarot-admin.js` (11K) — Кабинет → «🃏 Таро» (только админ; admin.js открывает PPTarotAdmin.mount(main)): PPTarotAdmin, FREE_MAX, KEY, CSS, paras
- `site/assets/tarot.js` (18K) — Птичье таро — колода в шапке: одна карта в час, счёт по браузеру (pp_tarot).: KEYS, CFG, LANGS, leftMs, txt
- `site/assets/titos-bugs.js` (21K) — «Жуки» на /titos/ (этап 9 Б, docs/titos.md): в кабинет Титоса заползли жуки и жучки-прослу: DEMO, GOAL, SAY, drawCard, cupsOf
- `site/assets/titos-sort.js` (35K) — «Разбери дела» на /titos/ (этап 9 А, docs/titos.md): у Титоса упали коробки — документы из: PPTitos, SAY, DEMO, BLOT, setPot
- `site/assets/titos-ui.js` (13K) — «Детектив Титос» /titos/ (docs/titos.md): кофейник (полный / половина / пустой — Титос спи: PPTitos, REWARDS, COL, CSS, pot
- `site/assets/toast.js` (2K) — Тост внизу экрана (этап 5 Б) — один на всех: PPToast('Сохранено') или PPToast('Поставлено': PPSew, PPToast, toast
- `site/assets/today.js` (6K) — блок «Тема дня» (с главной убран): LBL, fill, open, wait
- `site/assets/top-board.js` (9K) — Доска топа игр (docs/games.md § Доски топа): <div class="gtop" data-top="rain"></div> или : PPTop, BOARDS, MED, day, row
- `site/assets/train-words.js` (21K) — «Поезд Полли» (/train/, site/assets/train.js, docs/games.md): слова станций на 4 языках иг: PPTrainWords
- `site/assets/train.js` (41K) — «Поезд Полли» (/train/, src/pages/train.html, docs/games.md): Полли едет из Воббленда в вы: MENU, EMP, SAY, store, hint
- `site/assets/translate-btn.js` (3K) — «🌐 Перевести» — одна кнопка для всех разделов кабинета: PPTranslateBtn, LANGS, ERR
- `site/assets/v2.js` (47K) — Редизайн 2.0 (/preview/): сезон (по дате, кнопки в шапке), меню ☰, вход, папка Лаборатории: PPOut, SEEN, COL, COLS, tOf
- `site/assets/wl-town.js` (68K) — Wobbleland: прогулка по городу (docs/wobbleland.md «Прогулка»): PPWlTown, LAND, PICKS, CRIT, crit
- `site/assets/wobbleland-data.en.js` (43K) — из content/wobbleland.json (build.py): WOBBLELAND
- `site/assets/wobbleland-data.lv.js` (45K) — то же, LV: WOBBLELAND
- `site/assets/wobbleland-data.ru.js` (58K) — то же, RU: WOBBLELAND
- `site/assets/wobbleland.js` (41K) — карта Wobbleland, карточки городов, праздники: PPWl, HOL, LOC, MAX, img

## Сборка

- `build.py` (60K) — сборка: страницы, меню, языки, блоки, галереи, поиск, данные для JS: CONTENT, OUT, ROOT, href, lang_dd

## Инструменты (tools)

- `tools/about_chat.py` (4K) — Вопросы чата «Поболтать с Алиной и Полли» (/about-me/, docs/site.md).: FIELDS, FILE, todo, set_ru, cell
- `tools/about_covers.py` (11K) — Пиксельные заставки плиток /about-me/ → site/images/about/*.png.: OUT, SCENES, splash, frame, books
- `tools/add_images.py` (3K) — добавить картинки в галерею (ImageMagick): ROOT, caption_from, slug
- `tools/ava_deco_gen.py` (16K) — фоны и рамки аватаров → site/assets/ava-deco.css: BAT, HEART, ring_items, gem, mush
- `tools/cards/autumn_cozy.py` (40K) — Коллекция «Autumn Cozy»: 30 обычных карточек 120×168 (пиксель-арт) — осень и уют (№78–107): PAPER, LEAVES, OUT, badge, chips
- `tools/cards/halloween.py` (48K) — Коллекция карточек «Хеллоуин 2026»: 10 обычных карточек 120×168 (пиксель-арт, показ с imag: P_COL, CANDY, OUT, outline, paste
- `tools/cards/halloween_remix.py` (34K) — Коллекция «Halloween Remix»: 16 обычных карточек 120×168 (пиксель-арт) — ремиксы уникальны: OUT, BAYER, CARDS, badge, wash
- `tools/cards/ny_deck.py` (6K) — Колода «Птичье таро 2027»: 10 карт-образцов на трёх языках (RU/EN/LV).: CONTENT, HERE, LANGS, deck_sheet, draw
- `tools/cards/ny_tarot_backs.py` (2K) — Оборот колоды «Птичье таро 2027» — 160x270, вариант «Полночь» (выбран Алиной).: HERE, OUT, back_c
- `tools/cards/ny_tarot_design.py` (10K) — «Птичье таро 2027» — лица карты 160x270 с полным текстом предсказания.: GOLD, GOLD_D, BERRY, polly, check_width
- `tools/cards/pixfont.py` (9K) — Пиксельный шрифт 5x7 с кириллицей — для карточек (таро, коллекция).: MARKS, text, width, glyph, ctext
- `tools/cards/props.py` (4K) — Мелкие предметы для карт «Птичье таро» — 13x13, пиксель-арт, с контуром.: GOLD, CREAM, BERRY, candle, cookie
- `tools/cards/proto_big.py` (5K) — Прототип карты побольше: 160x270, текст в 26 знаков, до 12 строк.: HERE, vgrad, wrap, card
- `tools/cards/tarot.py` (2K) — Сборка колоды «Птичье таро 2027»: 100 карт × 3 языка + оборот, 160x270.: OUT, HERE, LANGS, wrap, build
- `tools/cards/tarot_content.py` (60K) — Колода «Птичье таро 2027» — 100 карт, полный текст предсказания на трёх языках.: CARDS
- `tools/cards/tarot_hole.py` (4K) — Карточка-шутка «Дырка» для «Птичьего таро 2027» (колода в шапке): 10 нажатий «Открыть карт: CREAM, SNOW, CARDS, peck_hole, build
- `tools/cards/unique_crop.py` (11K) — Фото карточек Алины (collectible_card_raw_*.JPEG) → ровная карточка 5:7.: ROOT, erase, order, tone, find_card
- `tools/cards/write_tarot_js.py` (963B) — Записывает в site/assets/tarot.js список ключей колоды: HERE
- `tools/catalog.js` (6K) — каталог вещей → site/assets/catalog.json (для сервера): FOOD, GEMS, SPECIAL_HATS, animated, stubEl
- `tools/challenge_check.js` (3K) — Проверка подбора тем челленджа: 24 месяца с ноября 2026 тем же модулем worker/challenge-pl
- `tools/challenge_items.js` (2K) — Предметы челленджа с тегами для сервера: challenge-data.js + content/challenge-tags.json →
- `tools/challenge_oct.js` (3K) — Октябрь 2026 в план челленджа: темы, как их считает нынешний themeFor (challenge-theme.js)
- `tools/challenge_tags.js` (18K) — Разметка предметов челленджа: семья, категория, сложность → content/challenge-tags.json (п: KWMAP, BATCH, DISHES, words, cnt
- `tools/daycolors.js` (1K) — цвета темы дня для сервера → day-colors.json
- `tools/dead_check.py` (6K) — Проверка «хвостов»: что на сайте осталось от убранного (docs/retired.md) и что больше никт: ERROR_PAGES, ROOT, SKIP, is_built
- `tools/docs/build_db.py` (5K) — собирает docs/db.md: ALTER, CREATE, ROOT, col, split_top
- `tools/docs/build_map.py` (19K) — собирает docs/map.md: ROOT, OUT, COMMON, top_funcs, call_counts
- `tools/docs/check_split.py` (3K) — сверка разбиения _claude-old.md: ROOT, KEY, MARK
- `tools/docs/split_claude_old.py` (28K) — режет _claude-old.md на docs/*.md: CLAUDE, HIST, SPLIT, table, parse_spec
- `tools/english_book.py` (3K) — Книга для учебника английского (/english/, docs/site.md «Учебник английского»): «Alice's A: ROOT
- `tools/english_check.js` (10K) — Проверка учебника английского: node tools/english_check.js [страница.html]: TYPES, fmtCheck, solve
- `tools/english_page.py` (2K) — Учебник английского /english/ (worker/english.js): content/english/shell.html + уроки cont: ROOT, notebook
- `tools/fb/fb_giftmix.js` (59K) — Посты Facebook EN №165–224 (Алина 21.11.2026): 165–194 — «Отправить подарок» (/postcards/)
- `tools/fb/fb_no.js` (5K) — Карточки «Learning Norwegian» для постов Facebook EN (Алина 21.11.2026: посты про норвежск: ROOT, DATA, CSS
- `tools/fb/fb_pal.js` (5K) — Карточки-палитры для постов Facebook на латышском (Алина 16.11.2026: «реально палитры, а н: ROOT, KEYS, CSS
- `tools/game_covers.py` (21K) — Пиксельные заставки карточек хаба /games/ → site/images/games/*.png.: ROOT, POLLY, POLLY_FLY, polly, advent
- `tools/i18n_add.py` (3K) — Дописывает переводы EN → RU, LV в content/i18n/ru.json и lv.json.: LANGS, I18N, ROOT, en_html, load_pack
- `tools/import_uploads.py` (4K) — раскладывает загрузки из GitHub по галереям: ROOT, EXT, PREFIX, convert, slug
- `tools/index.py` (19K) — Индекс кода: где что лежит — без чтения больших файлов.: ROOT, OUT, KINDS, line_of, handler
- `tools/logo_mono.py` (2K) — Однотонный значок v3 в любом цвете из чёрного (pigeon-polly-black-only-transparent-4000.pn
- `tools/nederlands_check.js` (11K) — Проверка учебника нидерландского (копия tools/english_check.js): node tools/nederlands_che: TYPES, fmtCheck, solve
- `tools/nederlands_page.py` (3K) — Учебник нидерландского /nederlands/ (worker/nederlands.js): content/nederlands/shell.html : ROOT, keys, notebook
- `tools/news_shots.js` (10K) — Снимки для новостей блога (скилл .claude/skills/site-news): только картинка сцены (canvas): page
- `tools/norsk_check.js` (11K) — Проверка учебника норвежского (копия tools/english_check.js): node tools/norsk_check.js [с: TYPES, fmtCheck, solve
- `tools/norsk_page.py` (4K) — Учебник норвежского /norsk/ (worker/norsk.js): content/norsk/shell.html + extra.js + уроки: ROOT, keys, notebook
- `tools/og_cards.js` (28K) — Картинки превью ссылок 1200×630 (og:image) для разделов сайта на EN/RU/LV → site/images/og: ACC, ROOT, COPY, fileUrl, html
- `tools/ornaments/make.py` (24K) — Вырезные ёлочные украшения с пиксельной Полли (20.11.2026, docs/coloring.md «Ёлочные украш: HERE, BALL_COLS, FILES, cut, fold
- `tools/ornaments/render.js` (953B) — PDF и картинки листов: node tools/ornaments/render.js (после make.py) → out/<id>.pdf, out/
- `tools/paint_brands.js` (15K) — Бренды красок для /color-mixing/ (docs/palettes.md, «Смешивание цветов → Бренды»).: LIB, ROOT, EST, dsLab, fromHex
- `tools/palette_names.py` (5K) — словарь названий цветов (en, ru, lv, hex): NAMES
- `tools/palette_overrides.py` (6K) — палитры, подобранные вручную
- `tools/palette_titles.py` (12K) — короткие названия палитр по картинкам
- `tools/palettes.py` (8K) — палитры из артов → content/palettes.json: HERE, palette, to_lab, to_hex, kmeans
- `tools/pins/cal-data.js` (8K) — Календари 2027 (docs/freebies.md): месяц → арт
- `tools/pins/cal.js` (22K) — Календари на месяц и заставки на телефон для раздела /freebies/ + пины Pinterest с ними (d: YEAR, OUT, ROOT, grid, src
- `tools/pins/cover.js` (5K) — Шапка профиля Pinterest 1920×1080 (16:9) по мотивам главной v2: «Paint small, joyful thing: SEASON, ROOT
- `tools/pins/dec2026.py` (7K) — -*- coding: utf-8 -*-: F_SERIF_B, F_SANS, INK, font, gift
- `tools/pins/giftmix-data.js` (35K) — Данные пинов №1611–1670 для tools/pins/giftmix.js: plain, text
- `tools/pins/giftmix.js` (27K) — Пины №1611–1670 (Алина 21.11.2026): 1611–1640 — «Отправить подарок» (/postcards/, utm_camp: MED, PALS, PINS, head, img
- `tools/pins/giftmix_shots.js` (2K) — Кадры открыток для пинов и постов «Отправить подарок» (tools/pins/giftmix.js): tools/pins/
- `tools/pins/holidays27-data.js` (65K) — Данные праздничных пинов №1461–1610 для tools/pins/holidays27.js: BIRDDAY, BLACKFRI, BOOKDAY, pal, bingo
- `tools/pins/holidays27.js` (17K) — Праздничные пины №1461–1610 (Алина 21.11.2026: «по 10 пинов на праздники» — 15 дат года, о: EMO, PINS, PALS, img, head
- `tools/pins/life_pal.py` (1K) — Палитры из фото Алины (tools/pins/life/*.jpg) → tools/pins/life/palettes.json: 6 цветов, б
- `tools/pins/nails.js` (6K) — Пин №1410 «Палитра для маникюра» из арта «Red nail polish» (палитра details-red-nail-polis: ROOT, NAILS, finger
- `tools/pins/pins10-data.js` (31K) — Данные пинов №429–475 для tools/pins/pins10.js
- `tools/pins/pins10.js` (11K) — Пины №429–475 «Арт-лаборатория»: ведут на статьи блога, видеоуроки, курс туши, галереи; мо: ROOT, CSS, PINS, cov, url
- `tools/pins/pins11.js` (19K) — Пины №476–487 «Книги»: две книги Алины на Amazon — «Ink Sketching: Creative Guide» и «Wate: INK, ROOT, BOOK, cov, url
- `tools/pins/pins12.js` (17K) — Пины-палитры (копия pins7.js) для 50 новых палитр серии studio — фото работ из мастерской : PINS, ROOT, SITE
- `tools/pins/pins13-data.js` (40K) — Данные пинов №626–725 (генератор pins13.js): AMZ, site
- `tools/pins/pins13-wc.js` (40K) — Пины №676–725 — «Watercolor Sketches: Creative Guide» (данные для pins13.js, подключается 
- `tools/pins/pins13.js` (26K) — Пины №626–725 «Книги 2»: по 50 на каждую книгу Алины — 626–675 «Ink Sketching», 676–725 «W: COVER, SET, ROOT, foot, blob
- `tools/pins/pins14-data.js` (38K) — Пины №726–825 (движок pins13.js: SET=14 node tools/pins/pins13.js).: LEARN, FOOT, QPATH
- `tools/pins/pins15-data.js` (43K) — Пины №826–945 «Artist lifestyle / Behind the artist camera» (движок pins13.js: SET=15 node: PAL, ALL, DUO, desc, base
- `tools/pins/pins16-data.js` (51K) — Пины №945–1084 «Топ-форматы 2.0» (Алина 20.11.2026: аналитика Pinterest 21.10–20.11 — пали: ISPY, PCH, SITE, cap
- `tools/pins/pins16.js` (19K) — Пины №945–1084 «Топ-форматы 2.0» — тизеры: пин показывает начало, всё целиком — на /draw/ : OUTI, ROOT, P16, img, foot
- `tools/pins/pins16_prep.py` (7K) — Заготовки для пинов №945+ (SET=16): шаги акварели, контур для DTIYS, «найди отличия», пали: OUT, ROOT, IMG, diff, logo
- `tools/pins/pins17-data.js` (53K) — Пины №1085–1278 (SET=17, Алина 21.11.2026: ещё 100–300 пинов по заходящим темам + 50 тизер: DET, FMT, PALS, day, push
- `tools/pins/pins17.js` (32K) — Пины №1085–1278 (SET=17): темы /prompts/, палитры деталей /palettes/, акварель за 4 шага /: LOGO, ROOT, CSS, img, foot
- `tools/pins/pins17_pal.py` (2K) — 8 цветов для пинов-палитр «8 colors» (SET=17): к 6 цветам палитры деталей с сайта (content: ROOT
- `tools/pins/pins17_shots.js` (2K) — Кадры адвента для пинов №1223+ (SET=17): улица 31 окошка, дома, окна — с локального site/ : OUT
- `tools/pins/pins2.js` (60K) — Пины Pinterest, вторая партия (№190+): полезные (списки, шаблоны, шпаргалки, палитры) и иг: PINS, ROOT, SITE, img, shot
- `tools/pins/pins3.js` (17K) — Пины Pinterest по старой схеме (как 001–189: POV-карточка, мем, палитра, список) с одним а: GAL, ART, PINS, img, foot
- `tools/pins/pins4.js` (19K) — Пины Pinterest по старой схеме (POV, мем, палитра, список) — №252–261: новый дизайн 2.0, л: LEARN, KEY, PINS, img, foot
- `tools/pins/pins5.js` (25K) — Пины 2.0 «арт впереди» — №262–281, зима и ожидание Нового года (ноябрь/декабрь).: BIRD, ROOT, CSS, site, crop
- `tools/pins/pins6-data.js` (27K) — Данные пинов №286–335 (круглый год) для tools/pins/pins6.js: BIRD
- `tools/pins/pins6.js` (10K) — Пины 3.0 «арт впереди», круглый год — №286–335: ROOT, CSS, PINS, crop, site
- `tools/pins/pins7.js` (8K) — Пины-палитры как p01–p59 (тёмный низ, арт сверху, 6 плашек с HEX) для палитр, у которых ещ: PINS, ROOT, SITE
- `tools/pins/pins8-data.js` (17K) — Данные пинов №347–376 для tools/pins/pins8.js: фото работ Алины (site/images/photos/, с её
- `tools/pins/pins8.js` (9K) — Пины из фото Алины (Google Диск, 13.11) + приманки на бесплатные уроки — №347–376: ROOT, CSS, PINS, crop, site
- `tools/pins/pins9.js` (12K) — Новые форматы пинов (14.11.2026): №377 — бесплатная раскраска для печати, №378 — видео-пин: KEYS, FONTS, SITE, coloring, newPage
- `tools/pins/thanks26-more.js` (27K) — Пины Thanksgiving №1414–1460 (Алина 21.11.2026: «сделай в сумме 50 пинов»): POV, PALS, FMT, head, add
- `tools/pins/thanks26.js` (10K) — Пины Thanksgiving №1411–1460 (Алина 21.11.2026: «пин на трендовую тему — Thanksgiving», ск: PAL, PINS, ROOT, img, foot
- `tools/pins/videos-data.js` (31K) — Данные 50 видео-пинов №379–428 (14.11.2026) для tools/pins/videos.js: tour, bird, pal
- `tools/pins/videos.js` (9K) — Видео-пины 9:16 (1080×1920, 30 к/с) — движок для tools/pins/videos-data.js (№379–428): MOVE, PAL, ROOT, clamp01, cam
- `tools/pins/wc_swatch.py` (7K) — Пин «акварельная палитра»: мазки-имитация акварели + арт, без текста, мини-лого PP справа : LOGO, ROOT, PAL, noise, blur
- `tools/pins/wcpal_data.py` (5K) — Данные 100 пинов «акварельная палитра» №1310–1409 → tools/pins/wcpal.json (заголовок, опис: T_TITLE, ROOT, T_DESC, mood
- `tools/polly_px.py` (2K) — 
- `tools/polly_sprite.py` (5K) — Новая Полли (20.11.2026): слои спрайта для site/assets/polly.js (PCOL, PL): OUT, beret, full, groucho, legs_a
- `tools/postcard_gifs.py` (3K) — Анимированные картинки открыток для писем: site/images/postcards/<id>.gif (docs/postcards.: ROOT, OUT
- `tools/rooms/detective.py` (16K) — рисует кабинет Титоса (день/вечер, зоны): HOT, OUT, hot, titos, scene
- `tools/rooms/kit.py` (4K) — набор для пиксельных комнат: слои, шрифт 3×5, вечер: INK, evening, sprite
- `tools/rooms/office.py` (20K) — рисует кабинет Полли (день/вечер, зоны): OUT, HOT, hot, polly, scene
- `tools/rooms/props.py` (4K) — спрайты пасхалок комнат: OUT, _out, portrait, canvas
- `tools/rooms/scenes.py` (19K) — Места происшествия дел Титоса: пиксельные картинки 384×216 (×3) + места для клика в conten: ROOT, SCALE, SPRITES, emo, outline
- `tools/rooms/scenes_cases.py` (44K) — Места происшествия дел Титоса — по функции на дело (рисует tools/rooms/scenes.py, там же п: room, park, snailsquare, webcafe, carrotbar
- `tools/rooms/shift.py` (30K) — «Смена с Полли» (/shift/, этап 29, docs/rooms.md): детальный кабинет 480x270 + передний сл: FLOOR_Y, BACK_HANG, OUT, wing, add
- `tools/school_cover.js` (3K) — Обложка карточки «Школа Полли» на /learn/ (курс, не видео): арт «Полли рисует акварелью у : ROOT
- `tools/sec.py` (2K) — Печатает один раздел docs-файла.: HEAD, section, headings, find
- `tools/shots.py` (8K) — Снимки элемента страницы на нескольких ширинах (Playwright, Chromium из /opt/pw-browsers).: SHEET_W, OUT, ROOT, make_sheet, slug
- `tools/study_page.py` (1K) — Учебник /study/ (worker/study.js): content/study/textbook.html → worker/study-page.js (стр: ROOT, notebook
- `tools/titos_cast.py` (2K) — Жители Воббленда для дел Титоса → docs/titos-cast.md (одна строка на жителя: ключ, имя, го: ROOT, cast, slug
- `tools/titos_check.py` (16K) — Проверка дел Титоса (content/titos/NNN.json, формат — docs/titos.md) и прохождение каждого: DIR, HOT, ROOT, texts, covered
- `tools/titos_clicks.py` (4K) — Дела Титоса в браузере: можно ли нажать каждую улику (зоны кабинета, спрайты, лупа, места : PROBE, CASES, ROOT
- `tools/train_check.js` (2K) — Проверка слов «Поезда в Испанию» (site/assets/train-words.js): каждое слово станции и бону: COL, norm, cnt, fits
- `tools/v2_acct_css.py` (3K) — Из site/assets/style.css — только стили кнопок шапки (вход, меню аватара, колокольчик и ко: KEY, keep_rule, walk, blocks
- `tools/v2_recolor.py` (2K) — Редизайн 2.0, часть Д: убирает фиолетовые тона из CSS старых страниц.: VARS, HUE, SAT, purple, neutral
- `tools/video/apple.js` (21K) — Видео №2 для соцсетей (этап 15, docs/bird.md «Видео»): Полли рисует яблоко у мольберта, фо: FILM, SNAP, DRAW, APPLE, seg
- `tools/video/film.js` (18K) — Видео для соцсетей (этап 15, docs/bird.md «Видео»): 1080×1920, 30 fps: FILM, PAN, PLATE, STOVE, seg
- `tools/video/render.py` (6K) — Видео для соцсетей (этап 15): кадры рисует tools/video/film.js в Chromium → PNG → ffmpeg →: ROOT, FPS, CHROMIUM, video, png
- `tools/video/school.js` (21K) — Видео №3 для соцсетей: «Школа Полли» (/polly-helps/, docs/challenge.md) — зовёт пройти уро: FILM, CARD, DIP, DOTS, seg
- `tools/video/school_music.py` (8K) — Музыка к ролику «Школа Полли» (tools/video/school.js): весёлый чиптюн, 26 с, 120 ударов в : BAR, MEL, CHORDS, note, bar
- `tools/wobbleland/anno.py` (11K) — ручная разметка карты: улицы, дома, значки: HOUSES, STREETS, SQUARES
- `tools/wobbleland/crests3.py` (11K) — пиксельные гербы городов: INK, NAVY, MASK, arc_pts, oell
- `tools/wobbleland/dishes.py` (18K) — пиксельные блюда для книги рецептов: INK, plate, mug, nut, bowl
- `tools/wobbleland/make_map4.py` (10K) — пиксельная карта map-pixel.png: INK, LAND, ROOFS, mode_filter, house
- `tools/wobbleland/portraits.py` (2K) — Портреты жителей для «Блинной Полли»: site/images/wobbleland/pt-<ключ>.png (48×48) — квадр: ROOT, SIZE, DEF
- `tools/wobbleland/residents.py` (25K) — Жители Воббленда из коллекционных карточек (этап 8, для дел Титоса).: CONTENT, ROOT, OUT, token, slug
- `tools/wobbleland/sprites.py` (3K) — мелкие спрайты карты: INK, make

## Маршруты worker/index.js (184)

_без `/api`; `f` — возвращает f(); `~f` — код в `route()`, главная вызываемая f; — — только SQL_

/admin/pin-text → pinTextApi · /blog/admin/courier → courierApi · /blog/* → blogApi · /pw/* → — · /funnel → — · /admin/pw-reset → — · /admin/funnels → ~authApi · /flock/news → — · /news-off → — · /admin/flock-notes → ~flockNewsApi · /wl-mail* → — · /admin/wl-holiday → ~wlMailApi · /birds → — · /feathers → — · /feather → ~flockApi · /top → ~topApi · /pancakes → — · /pancakes/* → ~pancakesApi · /train → — · /train/* → ~trainApi · /garden → — · /garden/* → ~gardenApi · /admin/runes → ~runesApi · /admin/tarot → ~tarotApi · /poll → — · /poll/vote → — · /admin/polls → ~pollsApi · /admin/guides → — · /v2/guides → — · /v2/seen → — · /v2/howto/* → ~guidesApi · /admin/ideas → — · /admin/ideas/write → ~ideasApi · /note/* → — · /admin/notes* → ~notesApi · /admin/notes/send → ~mailCron · /mail/* → — · /admin/mail* → ~mailApi · /study → ~studyApi · /english → — · /english/access → ~englishApi · /postcards/* → ~postcardsApi · /mixing → ~mixingApi · /notebook → ~notebookApi · /avis → — · /avis/* → ~avisApi · /norsk → — · /norsk/access → — · /norsk/tts → ~norskApi · /nederlands → — · /nederlands/access → — · /nederlands/tts → ~nederlandsApi · /artpill → — · /artpill/* → ~artpillApi · /school → — · /school/* → — · /admin/school → — · /admin/school/check → ~schoolApi · /about-chat → — · /about-chat/* → — · /admin/about-asks → ~aboutChatApi · POST /admin/pause → pauseApi · /admin/analytics → ~tableApi · /admin/week → ~weekApi · /room/visit → — · /room/visitors → — · /room/leave → ~visitsApi · /kitchen → — · /kitchen/* → ~kitchenApi · /shift → — · /shift/* → ~shiftApi · /titos* → — · /admin/titos* → ~titosApi · /tarot/reset → ~cardsApi · /cards* → — · /admin/cards* → ~cardsApi · /challenge/* → — · /admin/challenge* → ~challengeApi · POST /admin/translate → ~translateTo · POST /dev/migrate → migrateToR2 · POST /dev/cleanup → cleanupInactive · GET /profile → ~doorsOf · POST /birdcard → — · GET /birdcard → — · GET /stats → — · GET /flock → ~avatarOf · POST /subscribe → — · POST /unsubscribe → — · POST /hit → hit · POST /admin/links → — · POST /office/done → — · POST /room → ~roomEvent · POST /box0 → ~roomItems · POST /box0/seen → — · GET /rooms → ~roomOf · GET /game → ~gamePrices · POST /game/start → — · POST /game/level → ~rainItem · GET /potion → ~comboSeason · POST /potion/level → ~mazeItems · POST /potion/done → ~potDay · POST /potion/eye → — · GET /potion/bag → ~hintOk · POST /potion/hint → ~hintOk · POST /potion/give → ~invOf · POST /potion/revive → ~cleanRoom · POST /potion/seen → — · POST /potion/brew → ~potionOf · GET /requests → ~anonCode · POST /requests/tr → ~reqFill · POST /requests → ~anonCode · POST /requests/like → ~visitor · POST /admin/requests/answer → ~reqReward · POST /admin/requests/closed → — · POST /admin/requests/hide → — · GET /advent → ~adventAdv · POST /advent/open → ~inkOn · POST /admin/advent → ~adventFileDrop · POST /admin/advent/file → ~adventPut · POST /admin/advent/file/edit → ~advFileUsed · GET /palettes → ~extraQueue · GET /extra-palettes.js → ~extraQueue · POST /admin/art → ~artEntry · GET /sketchbook → sketchCfg · POST /admin/sketchbook → ~sketchCfg · POST /admin/art/hide → — · POST /admin/art/delete → ~extraQueue · GET /admin/users → ~tagColors · POST /admin/tag-color → ~tagColors · POST /admin/tags → — · /admin/blocks → — · /admin/subscribers → — · GET /flock/find → — · GET /admin/sec → ~secLocked · POST /admin/pin/verify → ~pinHash · POST /admin/pin/set → ~pinHash · POST /admin/recovery/new → ~loadSec · POST /recover → ~rcNorm · GET /whoami → ~englishOk · GET /v2/yt → — · GET /v2/vip → ~guideOut · GET /news → ~newsOf · GET /news/history → ~newsHistory · GET /config → ~mailOn · POST /login → ~funnelStep · POST /logout → ~sessionCookie · GET /today → dayCard · GET /me → ~adventAsk · GET /shop → ~stockNew · GET /new → ~catalog · POST /shop/buy → ~legMax · POST /admin/shop/cats → ~cleanRules · POST /admin/shop/reprice → ~gameUnit · POST /admin/shop/restock → ~ensurePrices · /admin/shop → ~shopRow · POST /gift/give → ~cleanRoom · POST /gift/sell → ~toShop · POST /salary/seen → — · POST /admin/salary → ~audWhere · POST /admin/tax → — · POST /admin/buttons-backfill → ~backfillButtons · POST /admin/buttons → — · POST /gift → ~avatarOf · POST /avatar → ~avatarOf · GET /admin/gifts → — · POST /admin/gift-all → ~audWhere · POST /admin/gift → ~okItem · GET /nick/random → ~freeNick · POST /nick → ~welcomeOf · POST /upload → ~monthThemeBadges · POST /delete-post → ~imgDelete · GET /wall → — · GET /top → ~utcToday · GET /export → ~artpillExport · POST /delete-account → ~artpillDrop · POST /admin/pick → ~addBadge · POST /admin/shop/autorestock → ~autoRestock · /admin/inbox → — · /admin/inbox/seen → ~autopilot · GET /admin/autopilot → ~autopilot · /admin/rules → ~welcomeCheap · POST /admin/ai → — · POST /admin/hide → — · POST /admin/ban → —

## Маршруты worker/blog.js (37)

_пути без `/api/blog/`; обозначения те же_

GET state → ~anonCode · POST like → ~visitor · POST comment → ~ipHash · GET search → ~stripTags · GET home → ~courierSlug · GET media-list → — · GET backup → fullBackup · GET admin/posts → ~geminiKey · GET admin/post → — · POST admin/save → ~safeUrl · POST admin/delete → — · POST admin/pin → — · GET admin/dupes → — · POST admin/dedupe → ~secsOf · POST admin/bulk → ~slugify · POST admin/feature → — · GET admin/overview → — · GET admin/comments → ~birdName · admin/gemini-key → ~gemini · admin/backup-token → — · GET admin/export → — · POST admin/restore-media → — · POST admin/import → — · GET admin/sections → ~secsOf · POST admin/section-set → ~translateAll · POST admin/section-delete → ~secsOf · GET admin/tags → ~tagsOf · POST admin/tag-set → ~syncTagColumns · POST admin/tags-translate → ~translateTags · POST admin/tag → ~syncTagColumns · POST admin/settings → — · POST admin/comment → — · POST admin/upload → — · admin/img-check → blogImgCheck · POST admin/fetch-image → ~rehostOne · POST admin/translate → translateAll · /sitemap-blog.xml → ~v2Flag

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
- прочее: tarotHour, tarotReset
- пополнение: restockOn, restockTo
- условия бейджей (cond): early, earlyBefore, owl, owlFrom, owlTo, ten, fifty, hundred, inkmaster, comeback, weekend, alt, clock, clockWin, monthly, veteranMonths, veteranPer, collector, colors, rainA, rainB, rainC, potA, potB, mazeA

## Общее

_Сюда следующие этапы дописывают общие сведения о коде._

- 🎓 Курсы со сдачей фото: worker/school.js `COURSES` (новый курс = запись там, `course` в запросах, страница с PPDiploma из site/assets/diploma.js); проверка — кабинет «🎓 Курсы» (school-admin.js), новость `school` с `x.course` (news.js), карточка — cabinet.js «Дипломы» и v2.js `COURSES` на /learn/.

- ⚠️ Worker: обещание (Promise) НЕ хранить в переменной модуля, чтобы его ждали другие запросы (`xWait = run()`) — с флагом handle_cross_request_promise_resolution чужое обещание не выполняется, запрос виснет (13.11.2026: ensureSchema, loadSec, ensureBlogSchema). Кэшировать можно только готовые значения.

- 📰 Новости из сети: worker/avis.js `feed(url)` (RSS/Atom → {title, desc, link, when, img, src}), `article(url)` (текст + og:image), `ask(env, prompt, schema, ok)` (Gemini JSON с запасными моделями, ошибки ai_limit/ai/no_key), `commons(q)` (фото Wikimedia), `GN(q)` (Google News RSS); чужая картинка → своя копия в R2: `rehostOne(env, src, {})` (worker/blog.js). Пользуются Morgenavis и Art Coo-rier (worker/courier.js).
- ⌨️ Кнопки особых букв в учебниках: content/shared/keys.js (встраивают tools/{norsk,nederlands}_page.py функцией keys(html, 'å æ ø'), docs/site.md «Кнопки особых букв»).
- 📒 Блокнот в учебниках: content/shared/notebook.js (клиент, встраивают tools/{study,english,norsk}_page.py функцией notebook(html, book)) + worker/notebook.js (`/api/notebook?book=`, таблица textbook_notes). Новый учебник — книга в `BOOKS` worker/notebook.js и вызов notebook() в его *_page.py.

- Письма птичкам на почту — только через согласие worker/mail.js: новое автоматическое письмо = проверка `users.mail_games` (или feat/news), подвал и отписка — `sendOne`, общий суточный лимит — `usedToday` (meta `mail_n:`, `advent_mail_n:`, `wl_mail_n:`). Рассылки Алины — кабинет ✉️ Письма (mail-admin.js `PPMailAdmin`). Вид всех писем — worker/mail-html.js (текст: абзацы через пустую строку, ссылка одна на строке = кнопка, «—» = подвал).
- Пины — кабинет 🖼 Пины (posts-admin.js `PPPostsAdmin`): новый дизайн = запись в `DESIGNS` + функция в `DRAW` (x, f, cols); общие `pic` (фото с фокусом/зумом), `fitRich` (*курсив* голубым), `hand`, `url`, `kicker`. Тексты — worker/pins.js `pinTextApi`. Цвета фото в браузере — palettes.js `window.PPPalette.named(img)`.

- Новости птички: `NEWS_KINDS` (worker) → `news` в /api/whoami, /api/news; news.js `KINDS`. Новый вид — по записи там и тут. Открытые — `newsHistory` → GET /api/news/history (из gifts, button_log, potion_gifts, card_owner, card_trades; новому виду с историей — строка и там).
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
- Этап 23: семена и вещи огорода — worker/garden.js (`TIER` редкие/волшебные, `gardenDrop` — из `award` для SEED_GAMES и жуков Титоса, `gardenNews` — новость seeds, серии `weekly`), site/assets/garden-items.js `PPGardenItems` (вид подарка garden: рисунки, `layout` в огороде), `PPGardenPlants` (garden.js: иконки растений и для магазина). Новая вещь огорода = строка в ITEMS. Деревья — `TREES`/`drawTree` в garden.js, `needMs` в worker/garden.js; перестановка — `EDIT`/`bedsAt`/`POS` (garden.js), `layout(list, pos)`.
- 23.11.2026: сумка клумб и уборка — worker/garden.js (`bedbag`/`removed`, `bed`, `clean`, `compost`, `choresOf`, `shiftBeds`), garden.js (`.gd-move-top`, `drawChore`, `cleanPile`, `removeBed`, `placeBed`, `sellBed`, `data-bed-*`, `D.bedbag`/`D.chores`), docs/bird.md «Огород».
- /about-me/: site/assets/about-desk.js — сцена со столом (рука на холсте 256×192: `handMat`/`drawHand`, действия `ACTS`, предметы `HOT`) и ретро-чат; worker/about-chat.js `aboutChatApi` (GET/POST /api/about-chat, /api/about-chat/ask, /extra, /api/admin/about-asks), `aboutAskNews` (новость aboutask), `aboutChatNews` (письмо chatnew), `chatRewards` (ступени, бейджи chatA/chatP/chatAP, ноутбук furn|pollychat; правило achatStepBtn, cond.chatFull); кабинет — about-admin.js `PPAboutAdmin`; вопросы базы — tools/about_chat.py.
- Личная страница только для некоторых птичек — как worker/study.js: HTML в worker (не в site/), проверка `studyOk`, флаг в /api/whoami, пункт в меню аватара по флагу (account.js). Так же устроены worker/english.js (/english/) и worker/norsk.js (/norsk/, движок — копия английского в content/norsk/engine.js).
- Редизайн 2.0: новые страницы — шаблон src/layout-v2.html + site/assets/v2.css/v2.js (build.py `V2`, `NOINDEX`, `V2_HOME`, `v2_books`); сезон — `html[data-season]`, цвета только через токены сезона.
- Редизайн 2.0, старая страница в новой шапке: src/layout-v2-lab.html + site/assets/v2-shell.css (build.py `V2_LAB`: путь → исходная страница).
- Страница для новичков `/how/` (21.11.2026): `src/pages/how.html` + `site/assets/how.css`, шаблон V2; вход — «?» `.help-q` в шапке (src/layout-v2*.html, стили v2-shell.css) и `.ft-how` в подвале; на телефоне — `.dr-help` первой строкой в меню ☰.
- tools/v2_acct_css.py → site/assets/v2-acct.css: стили кнопок шапки (вход, меню аватара, 🔔, 🛒, поиск) из style.css для новых страниц.
- Видео и гайды без пересборки: worker/guides.js (`guidesApi`, `guidesList`, `guideOut`, `ytId` — id из любой ссылки YouTube), meta `v2_guides`; кабинет — guides-admin.js; сайт — v2.js (`G`, `ytName`, `guidesReady`).

- 🎨 Нарисованные эмодзи: site/assets/emoji-art.js `PPEmojiArt` (svg, start, off, scan) — на всех страницах v2 сам меняет эмодзи на рисунки (docs/site.md «Нарисованные эмодзи»). Код, который сохраняет innerHTML страницы в базу, — сначала `PPEmojiArt.off()`.

- Этап 89: кухня — worker/kitchen.js (`RECIPES`, `dishOf(env, uid)` — действующее блюдо, `dishBonus` — прибавка к награде игры; в `award` для SEED_GAMES), site/assets/cookbook.js `PPCookbook`. Новое блюдо = строка в RECIPES + `DISH` в cookbook.js.

- 💌 Открытки: worker/postcards.js (`postcardsApi`, `postcardNews`, `postcardCron`), список site/assets/postcard-designs.js, сцены postcard-scenes.js, страница postcards.js `PPPostcard.card(el, d, {greet, msg, from, still})`; Полли любого размера и в любой шапке — `PollyPet.paint(canvas, o)` (polly.js); картинка в письме — 4-й аргумент `mailHtml` (docs/postcards.md).

- worker/pause.js — ⏸ пауза сайта: `pauseOn(env)`, `pauseGate` (страницы), `POST /api/admin/pause`.

- Файлы только для вошедших: положить в `site/members/…` — worker `membersFile` (worker/index.js) пускает вошедших, гостя уводит на /learn/?c=<имя>#signin (docs/coloring.md).
