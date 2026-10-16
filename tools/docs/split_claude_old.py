#!/usr/bin/env python3
"""Режет docs/_claude-old.md на docs/*.md (этап 0-2).

Единица — пункт («- …» вместе с вложенными «  - …»). Пункты, где смешаны темы
или часть устарела, делятся по предложениям (SPLIT). Текст переносится дословно.
Пункты общего раздела (CLAUDE) идут в CLAUDE.md в сжатом виде — его пишут руками,
здесь они только отмечаются (проверка — tools/docs/check_split.py).

Запуск: python3 tools/docs/split_claude_old.py [--table]
  --table — напечатать таблицу «первые 60 символов пункта → файл».
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'docs' / '_claude-old.md'
DOCS = ROOT / 'docs'

# граница предложения: . ! ? … (и, может быть, конец **жирного**), пробел, затем заглавная/цифра/кавычка/код/эмодзи
SENT = re.compile(r'(?<=[.!?…])(?:\*\*)?\s+(?=[«“(\[*`🔘🛍🎁🏅🎲🧿🌧👑📜🎨🐦⬇📤🙈🔐🗺🧪📖💌🤖A-ZА-ЯЁ0-9])')


def sentences(text):
    return SENT.split(text)


# ---------- куда что идёт: строка исходника → файл | раздел ----------
CLAUDE = 'CLAUDE'
SPEC = """
3-4 CLAUDE
7-10 CLAUDE
13-16 CLAUDE
18 CLAUDE
21 CLAUDE
24-27 CLAUDE
30-31 CLAUDE
34-37 CLAUDE
41-44 CLAUDE
47-49 CLAUDE
77-79 CLAUDE
52-63 challenge|Тема дня, календарь, таймер, карточка
66-72 challenge|Стена работ (#works)
74-75 challenge|Стена работ (#works)
76 challenge|Бейджи и уровни
80 site|Общие страницы
83-90 wobbleland|Wobbleland
93-96 rooms|Комнаты (общее)
97 rooms|Квесты и детектив Титос
100 challenge|«Полли, помоги нарисовать»
103-105 blog|Устройство
106-108 blog|Редактор и перевод
109-110 blog|Список, главная, теги
111-112 blog|Редактор и перевод
113 flock|Стая на главной и /flock/
114 blog|Список, главная, теги
115-116 blog|Редактор и перевод
117-118 blog|Список, главная, теги
119 blog|Устройство
122-124 flock|Стая на главной и /flock/
125-126 bird|Вход, ник, аккаунт
127 flock|Стая на главной и /flock/
128 blog|Список, главная, теги
131-134 blog|Список, главная, теги
135 admin|Резервные копии
140-141 blog|Редактор и перевод
142-143 admin|Резервные копии
144 blog|Список, главная, теги
147-149 blog|Редактор и перевод
150 challenge|Стена работ (#works)
151-154 flock|Стая на главной и /flock/
155 challenge|Тема дня, календарь, таймер, карточка
156 site|Меню и шапка
157 blog|Редактор и перевод
158 admin|Кабинет /admin/
159 blog|Список, главная, теги
160 site|Общие страницы
162 site|Меню и шапка
163 admin|Резервные копии
164 blog|Редактор и перевод
165-166 site|Главная
167 admin|Кабинет /admin/
168-170 blog|Редактор и перевод
173-177 admin|Правка блоков на сайте
178 admin|Кабинет /admin/
179 challenge|Страница челленджа
180 site|Меню и шапка
181 bird|Подарки и вещи
182 blog|Список, главная, теги
183 flock|Локации и действия
184 admin|Правка блоков на сайте
185 flock|Локации и действия
186 challenge|Бейджи и уровни
187 bird|Подарки и вещи
189 flock|Локации и действия
190 bird|Карточка «Моя птичка»
191-192 blog|Редактор и перевод
193 rooms|Комнаты (общее)
194 rooms|Квесты и детектив Титос
195 site|Сборка
196 rooms|Квесты и детектив Титос
197 shop|Пуговки
198 shop|Магазин
199 shop|Пуговки
200 bird|Подарки и вещи
201-202 shop|Магазин
203 shop|Пуговки
204 admin|Кабинет /admin/
206 bird|Подарки и вещи
209-212 admin|Статистика посетителей
215-216 palettes|Палитры из артов
217 site|Меню и шапка
218 palettes|Pinterest
221-224 challenge|День ЭКСТРА и палитры ЭКСТРА
226 palettes|Pinterest
229 palettes|Палитра из своего фото
232 challenge|День ЭКСТРА и палитры ЭКСТРА
233-234 palettes|Картины и палитры, добавленные с сайта
235 challenge|День ЭКСТРА и палитры ЭКСТРА
236 admin|Резервные копии
239 polly-pet|Сезонные вещи в подвале
241 polly-pet|Сезонные вещи в подвале
244 games|Адвент-календарь
246 games|Адвент-календарь
249-251 site|Меню и шапка
252-253 bird|Профиль /bird/
254 challenge|Страница челленджа
257-260 bird|Комната птички
261 challenge|Страница челленджа
264 shop|Магазин
265 challenge|Страница челленджа
266 bird|Комната птички
268-269 games|Адвент-календарь
270 bird|Подарки и вещи
271 site|Общие страницы
272 bird|Комната птички
275-276 shop|Магазин
277-280 bird|Комната птички
281 games|Адвент-календарь
282-283 shop|Магазин
284 shop|Цены и экономика
285 shop|Магазин
286 challenge|Стена работ (#works)
287 blog|Редактор и перевод
288 challenge|Стена работ (#works)
289 blog|Редактор и перевод
290-291 challenge|Стена работ (#works)
292 shop|Правила (кабинет → 📜)
293 shop|Цены и экономика
294 shop|Магазин
295 bird|Комната птички
296 bird|Подарки и вещи
297 bird|Сумка
298 challenge|Бейджи и уровни
299-300 bird|Комната птички
302 shop|Цены и экономика
303 shop|Зарплата и пополнение
304 shop|Зарплата и пополнение
305-306 games|Пуговичный дождь
307-311 games|Зельеварня
312 games|Бейджи игр
313 games|Пуговичный дождь
314-317 games|Зельеварня
318 shop|Цены и экономика
320 shop|Автопилот
321 shop|Цены и экономика
322 games|Зельеварня
323 palettes|Палитра из своего фото
324 site|Общие страницы
325 site|Главная
326-327 polly-pet|Полли в уголке (с 12.10.2026)
328 challenge|Карусели
329-343 requests|«Нарисуй мне»
344 site|Меню и шапка
345-349 admin|Защита админки
350-351 bird|Подарки и вещи
352 challenge|Карусели
353 requests|«Нарисуй мне»
354 bird|Подарки и вещи
355 bird|Комната птички
"""

# пункты целиком в историю: строка → (куда заменено, чем)
HIST = {
    20: ('site', 'меню: «Сайт проще (10.10)»'),
    73: ('challenge', 'кнопки челленджа 10.10.2026'),
    98: ('site', 'блоки главной: «Сайт проще (10.10)»'),
    136: ('site', 'страницы «О Полли» больше нет (10.10)'),
    137: ('polly-pet', 'Полли-питомец изменён 12.10.2026: всегда в уголке'),
    161: ('site', 'блоки главной: «Сайт проще (10.10)», patreon убран с главной'),
    188: ('site', 'блоки главной: заменён shop-promo, потом «Сайт проще (10.10)»'),
    205: ('site', 'блоки главной: «Сайт проще (10.10)», shop-promo убран'),
    225: ('site', 'меню и вкладки: «Сайт проще (10.10)»'),
    240: ('polly-pet', 'Полли-питомец изменён 12.10.2026: сезонные игры в подвале отключены'),
    319: ('shop', '«Цены сами» (11.10.2026), индексация отключена'),
}

# пункты, которые делятся по предложениям: строка → [(номера предложений, куда, раздел/причина)]
# куда = 'CLAUDE', имя файла (раздел) или 'history:<файл>' (причина)
SPLIT = {
    17: [((0,), 'history:site', 'блоки главной менялись: «Сайт проще (10.10)»'),
         ((1,), 'history:site', 'блок today с главной убран (10.10)'),
         ((2,), CLAUDE, None)],
    19: [((0,), 'history:site', 'меню: «Сайт проще (10.10)» — 5 пунктов'),
         ((1,), 'history:site', 'вкладки над страницами убраны (10.10)'),
         ((2,), CLAUDE, None)],
    38: [((0,), 'history:polly-pet', 'Полли-питомец изменён 12.10.2026'),
         ((1,), 'polly-pet', 'Полли в уголке (с 12.10.2026)')],
    99: [((0,), 'history:challenge', 'кнопки «Полли, помоги» в челлендже и блока «Тема дня» на главной больше нет (10.10)'),
         ((1,), 'challenge', '«Полли, помоги нарисовать»')],
    140: [((0,), 'history:blog', 'автоперевод вернулся — «Перевод статей снова есть (только Gemini)»'),
          ((1, 2, 3), 'blog', 'Редактор и перевод')],
    156: [((0,), 'site', 'Меню и шапка'),
          ((1,), 'history:site', 'вкладки над страницами убраны (10.10)')],
    179: [((0,), 'history:challenge', 'страница челленджа переделана 10.10.2026'),
          ((1, 2), 'challenge', 'Страница челленджа')],
    182: [((0, 1), 'blog', 'Список, главная, теги'),
          ((2,), 'history:site', 'блоки главной: patreon («Мои заметки») с главной убран (10.10)'),
          ((3,), 'blog', 'Список, главная, теги')],
    183: [((0, 1, 2, 3, 4), 'flock', 'Локации и действия'),
          ((5,), 'history:shop', '«Коллекции» убраны — весь каталог в магазине')],
    185: [((0, 1, 2, 3), 'flock', 'Локации и действия'),
          ((4,), 'history:shop', '«Коллекции» убраны — весь каталог в магазине')],
    194: [((0, 1, 2, 3, 4), 'rooms', 'Квесты и детектив Титос'),
          ((5,), 'history:site', 'блок titos-case с главной убран (10.10)')],
    245: [((0,), 'history:games', '«Коллекции» убраны; план адвента — кабинет → 🎄 Адвент'),
          ((1,), 'games', 'Адвент-календарь')],
    261: [((0,), 'history:challenge', 'кнопки челленджа: палитру и «Работы участников» Алина убрала'),
          ((1, 2, 3), 'challenge', 'Страница челленджа')],
    264: [((0, 1), 'shop', 'Магазин'),
          ((2,), 'history:games', 'адвент перенесён в кабинет → 🎄 Адвент')],
    267: [((0,), 'history:games', 'адвент перенесён в кабинет → 🎄 Адвент'),
          ((1,), 'bird', 'Сумка')],
    305: [((0, 1, 2, 3, 4), 'games', 'Пуговичный дождь'),
          ((5,), 'history:games', '«Пуговичный дождь», версия 2 (11.10.2026): ступени по 10 уровней'),
          ((6,), 'games', 'Пуговичный дождь')],
    318: [((0,), 'history:shop', '«Цены сами»: gameUnit = meta index_base, иначе 50'),
          ((1, 2, 3, 4), 'shop', 'Цены и экономика')],
}

# пометки после пункта, где устарела только деталь (своих слов, не из исходника)
NOTE = {
    100: '⚠ Меню «Useful / Полезное» устарело — меню теперь из 5 пунктов, см. docs/site.md.',
    152: '⚠ Разделов-вкладок («Игры») больше нет — /flock/ в меню «Играть», см. docs/site.md.',
    216: '⚠ Раздела «Books & Helpful» больше нет — «Палитры» в меню «Рисовать», см. docs/site.md.',
    239: '⚠ С 12.10.2026 Полли с вещами в подвале не играет — они лежат как украшение (см. ниже).',
    310: '⚠ Шансы `potionOf` изменены — см. «Зелья получаются чаще» (11.10.2026).',
    118: '⚠ Позже (8.10.2026): блок блога на главной показывается всегда, без статей — заглушка (см. ниже).',
    329: '⚠ Длина темы позже — до 120 символов (версия 2), перевод — не ждём при отправке (см. «Переводы тем быстрее»).',
    331: '⚠ Ожидание перевода при отправке позже убрано — см. «Переводы тем быстрее».',
    328: '⚠ Карусели перенесены из кабинета на страницу челленджа — см. следующий пункт.',
}

FILES = {
    'challenge': ('Daily Challenge, стена работ, бейджи, ЭКСТРА', [
        'Ежедневная тема для рисования `/challenge/`: тема дня, календарь, таймер, карточка «поделиться».',
        'Стена работ участников (#works) с входом через Google, «Выбор Полли», парад, бейджи и уровни серий.',
        'Раз в месяц — день ЭКСТРА: 6 цветов палитры картины Алины (очередь палитр ЭКСТРА).',
        'Страница: `src/pages/challenge.html`. Тема: `site/assets/challenge-theme.js` (общий с воркером `extraDay`), `challenge.js`, `challenge-data.js`.',
        'Стена и профиль-загрузка: `site/assets/sketch-wall.js`; «Полли, помоги»: `polly-help.js`; карусели: `carousel.js`.',
        'Сервер: `worker/index.js` (`streaks`, `extraQueue`, `moreBadges`, `/api/wall`, `/api/top`, `/api/img/<id>`).',
        'D1: `users`, `posts`, `sessions`, `meta` (works_total, users_total, pick_*); картинки — R2 `MEDIA` (старые — KV `IMAGES`).',
    ]),
    'blog': ('Блог', [
        'Блог `/blog/` (+ /ru/, /lv/): статьи на трёх языках, разделы, теги, лайки, комментарии, поиск.',
        'Страницы блога собирает worker: `worker/blog.js` (подключён из `worker/index.js`), маршруты `/api/blog/*`.',
        'Редактор `/blog-editor/`: `site/assets/blog-editor.js` (только админ). Главная: `src/blocks/home-blog.html` + `home-blog.js`.',
        'Перевод — только Gemini (`GEMINI_KEY` или meta `gemini_key`). Картинки — R2 `MEDIA`.',
        'D1: `blog_posts`, `blog_likes`, `blog_comments`, `blog_tags`, `blog_sections`.',
    ]),
    'flock': ('Стая', [
        'Стая пиксельных птичек посетителей: блок на главной (`{{block:flock}}`) и страница `/flock/`.',
        'Код: `src/blocks/flock.html`, `site/assets/flock.js` (сцены, локации, действия), внешность — `site/assets/birds.js` (`PPBirds`).',
        'Сервер: `/api/flock` (до 36, на /flock/ до 60), `/api/birds`; галерея комнат — `site/assets/rooms-gallery.js` (`/api/rooms`).',
        'D1: `users` (ник, `avatar`, `room`). Отладка: `PPFlockDebug`.',
    ]),
    'bird': ('Птичка: вход, профиль, комната, сумка, подарки', [
        'Аккаунт посетителя: вход через Google в шапке (`site/assets/account.js`, `/api/whoami`), обязательный ник.',
        'Профиль `/bird/?nick=` — `src/pages/bird.html` + `sketch-wall.js` `renderPage()`: аватар, комната, сумка, достижения, рисунки, пуговки.',
        'Комната птички — `site/assets/room.js` (`PPRoom`, каталог мебели/обоев/украшений); вещи для птички — `site/assets/birds.js` (`PPBirds.GIFTS`).',
        'Подарки: кабинет → Птицы → 🎁, «Подарить всем», «Подарить» другу; карточка «Моя птичка» — `site/assets/bird-card.js`.',
        'D1: `users` (`avatar`, `room`, `room_at`), `gifts` (status new/bag), `button_log`.',
    ]),
    'shop': ('Пуговки, магазин, цены, правила, автопилот, зарплата', [
        '🔘 Пуговки — валюта сайта (`BTN`, `award` в `worker/index.js`); магазин `/shop/` (`src/pages/shop.html`).',
        'Каталог: `site/assets/catalog.json` (собирает build.py через `tools/catalog.js` из birds.js + room.js).',
        'Цены сами (`priceNow`, `stockLevels`, `autoRestock`); Алина меняет только % категорий и цены легендарных.',
        'Правила — кабинет → 📜 (`RULE_DEFAULTS` → meta `rules`); «🤖 Автопилот» — `autopilot()`; зарплата — `/api/admin/salary`.',
        'D1: `shop`, `button_log`, `gifts`, `users.buttons`, `meta` (rules, price_level, unit, index_base, restock_*).',
    ]),
    'games': ('Игры: Пуговичный дождь, Зельеварня, Адвент', [
        '«Пуговичный дождь» `/rain/` — `src/pages/rain.html`, `site/assets/rain.js`; сервер `/api/game*`.',
        '«Зельеварня Полли» `/potions/` — `src/pages/potions.html`, `site/assets/potions.js`, `potion-names.js`; сервер `/api/potion*`.',
        'Адвент `/advent/` — `src/pages/advent.html`, `site/assets/advent.js`, кабинет — `advent-admin.js`; сервер `/api/advent*`.',
        'Награды игр — в % от опорной цены (см. docs/shop.md).',
        'D1: `game_runs`, `maze_runs`, `potion_book`, `potion_gifts`, `advent_plan`, `advent_open`; `users.game_best`, `maze_level`, `inv`.',
    ]),
    'rooms': ('Комнаты: офис Полли, детектив Титос, квесты', [
        'Пиксельные комнаты 384×216: Polly Office Clerk `/polly-office/` и Detective Titos `/detective-office/`.',
        'Рисуются скриптами `tools/rooms/office.py`, `tools/rooms/detective.py` (общий `kit.py`).',
        'Клики и эффекты — `site/assets/rooms.js` (+ `rooms-data.js`); квесты — `quest-titos.js`, `quest-polly.js` (через `window.ROOM`).',
        'Страницы: `src/pages/polly-office(.ru/.lv).html`, `detective-office(...)`. Таблиц D1 нет.',
    ]),
    'wobbleland': ('Wobbleland', [
        'Сказочная страна Алины `/wobbleland/`: пиксельная карта, 11 городов, гербы, праздники и рецепты.',
        'Страница `src/pages/wobbleland.html` (+ .ru/.lv), скрипт `site/assets/wobbleland.js`, данные `content/wobbleland.json`, `content/wobbleland-map.json`.',
        'Переводы `content/i18n/wobbleland.{ru,lv}.json`; генераторы — `tools/wobbleland/*.py`. Таблиц D1 нет.',
    ]),
    'palettes': ('Палитры', [
        'Палитры из картин Алины — страница `/palettes/` (`src/pages/palettes.html`, `site/assets/palettes.js`).',
        'Данные: `tools/palettes.py` → `content/palettes.json` → `site/assets/palettes.json` (build.py).',
        'Палитра из своего фото (в браузере, `maker()`); админ добавляет картины и палитры с сайта.',
        'D1: `art_added`, `art_hidden`; файлы — R2 `art/`. Пины Pinterest — `site/images/pins/`.',
        'Палитры дня ЭКСТРА и их очередь — в docs/challenge.md.',
    ]),
    'admin': ('Кабинет админа, правка блоков, статистика', [
        'Кабинет `/admin/` — `src/pages/admin.html`, `site/assets/admin.js` (в sitemap нет, закрыт в robots).',
        'Правка блоков прямо на сайте — `site/assets/site-edit.js`, D1 `site_blocks`; страницы идут через worker (`sitePage()`).',
        'Своя статистика: `POST /api/hit` → D1 `visits`, `utm_links`; кабинет `#visitors`.',
        'Резервные копии — `site/assets/backup.js`, `/api/blog/backup`; защита админки — PIN и код восстановления (meta `admin_pin`, `recovery_hash`).',
    ]),
    'polly-pet': ('Полли-питомец', [
        'Пиксельная Полли в углу каждой страницы — `site/assets/polly.js` (`window.PollyPet`).',
        'С 12.10.2026 всегда сидит в левом нижнем углу, играет с сезонной вещицей рядом; сезонные вещи в подвале — украшение.',
        'Проверка: `?season=…`, `?pollydebug`, в консоли `PollyPet.corner()` / `PollyPet.play()`. Таблиц D1 нет.',
    ]),
    'requests': ('«Нарисуй мне»', [
        '`/requests/` — посетители предлагают темы, Алина рисует; лайки, переводы тем, подарок автору.',
        'Код: `src/pages/requests.html`, `site/assets/requests.js`, стили `.rq-*`; сервер — `/api/requests*`, `/api/admin/requests/*` в `worker/index.js`.',
        'D1: `draw_requests` (text_en/ru/lv), `draw_likes`; meta `req_closed`.',
    ]),
    'site': ('Сайт: меню, шапка, главная, общие страницы', [
        'Общее устройство сайта, которое не относится к отдельному разделу: меню (`NAV`, `SECTIONS` в build.py), шапка, поиск, главная.',
        'Шаблон — `src/layout.html`, общий скрипт — `site/assets/site.js`, стили — `site/assets/style.css`.',
        'Главная — `src/pages/home.html` и блоки `src/blocks/*` (сейчас: home-blog, coming-soon, flock).',
        'D1: `subscribers` (письмо о книге).',
    ]),
}

ORDER = ['challenge', 'blog', 'flock', 'bird', 'shop', 'games', 'rooms', 'wobbleland', 'palettes', 'admin',
         'polly-pet', 'requests', 'site']


def parse_spec():
    m = {}
    for row in SPEC.strip().splitlines():
        rng, dest = row.split(' ', 1)
        a, _, b = rng.partition('-')
        for n in range(int(a), int(b or a) + 1):
            m[n] = dest
    return m


def units(lines):
    """Пункты исходника: [(номер первой строки, [номера строк])]; вложенные «  - » — к родителю."""
    out = []
    for i, l in enumerate(lines, 1):
        if not l.strip() or l.startswith('#'):
            continue
        if l.startswith('  ') and out:
            out[-1][1].append(i)
        else:
            out.append((i, [i]))
    return out


def slug(title):
    s = title.strip().lower()
    s = re.sub(r'[^\w\- ]', '', s)
    return s.replace(' ', '-')


def plan():
    """Каждая строка исходника → список кусков (куда, раздел/причина, текст)."""
    lines = SRC.read_text(encoding='utf-8').split('\n')
    spec = parse_spec()
    pieces = []  # (строка, куда, раздел, текст)
    for first, nums in units(lines):
        parent = spec.get(first)
        for n in nums:
            text = lines[n - 1]
            if n in HIST or (n not in spec and first in HIST and n != first):
                tgt, why = HIST.get(n) or HIST[first]
                pieces.append((n, 'history:' + tgt, why, text))
            elif n in SPLIT:
                ss = sentences(text)
                used = sorted(i for idx, _, _ in SPLIT[n] for i in idx)
                assert used == list(range(len(ss))), (n, len(ss), used)
                for idx, dest, sec in SPLIT[n]:
                    part = ' '.join(ss[i] for i in idx)
                    if not part.startswith('- '):
                        part = '- ' + part
                    pieces.append((n, dest, sec, part))
            else:
                dest = spec.get(n) or parent
                assert dest, f'строка {n} не распределена: {text[:60]}'
                f, _, sec = dest.partition('|')
                pieces.append((n, f, sec, text))
    return lines, pieces


def write(lines, pieces):
    by_file = {}
    hist = {}
    for n, dest, sec, text in pieces:
        if dest == CLAUDE:
            continue
        if dest.startswith('history:'):
            tgt = dest.split(':', 1)[1]
            hist.setdefault(tgt, []).append((n, text, sec))
            continue
        by_file.setdefault(dest, {}).setdefault(sec, []).append((n, text))
    for name in ORDER:
        title, brief = FILES[name]
        secs = by_file.get(name, {})
        out = [f'# {title}', '', '## Кратко']
        out += [f'- {b}' for b in brief]
        out += ['', '## Оглавление']
        out += [f'- [{s}](#{slug(s)})' for s in secs]
        out += ['', '_Пункты перенесены дословно из docs/_claude-old.md (этап 0-2); ⚠ — пометки о том, что деталь устарела._']
        for s, items in secs.items():
            out += ['', f'## {s}']
            for n, text in items:
                out.append(text)
                if n in NOTE:
                    out.append(('    - ' if text.startswith('  ') else '  - ') + NOTE[n])
        (DOCS / f'{name}.md').write_text('\n'.join(out) + '\n', encoding='utf-8')
    # история
    out = ['# История: устаревшее и заменённое', '', '## Кратко',
           '- Пункты из docs/_claude-old.md, которые отменены более поздними решениями. Перенесены дословно.',
           '- У каждого — пометка «заменено: → docs/X.md» (где актуальное) и чем заменено.',
           '- Читать, только если нужно понять, почему что-то сделано так, или вернуть старое.',
           '- Внизу — старые заголовки docs/_claude-old.md (для сверки).',
           '', '## Оглавление']
    tg = [t for t in ORDER if t in hist]
    out += [f'- [Заменено → docs/{t}.md](#{slug("Заменено → docs/" + t + ".md")})' for t in tg]
    out += ['- [Старые заголовки](#старые-заголовки)']
    for t in tg:
        out += ['', f'## Заменено → docs/{t}.md']
        for n, text, why in hist[t]:
            mark = f' — *заменено: → docs/{t}.md* ({why})'
            out.append(text + mark)
    out += ['', '## Старые заголовки']
    out += [f'- `{l}`' for l in lines if l.startswith('#')]
    (DOCS / 'history.md').write_text('\n'.join(out) + '\n', encoding='utf-8')


def table(lines, pieces):
    for n, dest, sec, text in pieces:
        f = 'CLAUDE.md' if dest == CLAUDE else ('history.md (→ ' + dest.split(':')[1] + ')' if dest.startswith('history:') else dest + '.md')
        t = re.sub(r'^\s*(- |\d+\. )', '', text)[:60]
        print(f'{n:>4} | {t:<60} | {f}')


if __name__ == '__main__':
    lines, pieces = plan()
    if '--table' in sys.argv:
        table(lines, pieces)
    else:
        write(lines, pieces)
        print('ok:', ', '.join(f'docs/{n}.md' for n in ORDER + ['history']))
