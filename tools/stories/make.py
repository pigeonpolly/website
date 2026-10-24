#!/usr/bin/env python3
"""Картинки для Instagram Stories (1080×1920) по всем разделам сайта, EN и RU, без кнопок.

  python3 tools/stories/cap.py    — снимки птичек, комнаты, огорода, челленджа и «Полли, помоги» → _held/stories/src/
  python3 tools/stories/make.py [имя ...] — сторис → _held/stories/{en,ru}/NN-имя.png и лист _held/stories/sheet-{en,ru}.jpg

Шрифты как на сайте (Fraunces, Karla); кириллицы в них нет — для RU сами подставляются Lora и Manrope.
Тексты — из описаний страниц сайта и docs/*.md (факты не придумывать). Картинки — site/images и снимки cap.py.
"""
import functools
import html
import http.server
import json
import pathlib
import sys
import threading

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
OUT = ROOT / '_held' / 'stories'
I = '/site/images/'
SRC = '/_held/stories/src/'


def img(src, cls='', style=''):
    return f'<img class="{cls}" src="{src}" style="{style}">'


def birds(ids, size=230, cols=3):
    return f'<div class="birds" style="--c:{cols};--s:{size}px">' + ''.join(img(f'{SRC}bird-{i}.png', 'px') for i in ids) + '</div>'


def palette(lang):
    pals = json.loads((ROOT / 'site/assets/palettes.json').read_text())
    p = next(x for x in pals if x['key'] == '2026-pigeon-polly-fancy-life')
    sw = ''.join(f'<div class="sw"><i style="background:{c["hex"]}"></i><b>{html.escape(c[lang])}</b><s>{c["hex"]}</s></div>' for c in p['colors'])
    return f'<div class="pal">{img("/site/" + p["img"], "photo")}<div class="sws">{sw}</div></div>'


def cards():
    fs = ['cards/classic/11.jpg', 'cards/halloween-2026/01.png', 'cards/classic/14.jpg', 'cards/halloween-2026/05.png', 'cards/classic/16.jpg']
    rot = [-16, -8, 0, 8, 16]
    return '<div class="fan">' + ''.join(img(I + f, 'card' + (' px' if f.endswith('.png') else ''), f'--r:{r}deg;--i:{k}') for k, (f, r) in enumerate(zip(fs, rot))) + '</div>'


def books():
    return '<div class="books">' + ''.join(img(I + 'e-books/' + f, 'book') for f in ('urban-sketching-digital-traveler.jpg', 'ink-sketching.jpg', 'watercolor-sketches.jpg', 'coloring-book-world-breakfasts.jpg')) + '</div>'


def collage(fs):
    return '<div class="collage">' + ''.join(img(I + f, 'photo') for f in fs) + '</div>'


def bubble(text, pic):
    return f'<div class="req"><div class="bub">{text}</div>{img(I + pic, "photo tilt")}</div>'


def overview(lang):
    rows = {'en': ['🐣 Your own pixel bird', '🏠 A house with 6 rooms', '🥕 A garden', '🛍 Shop & buttons', '🃏 Collectible cards', '🐦 The flock',
                   '✏️ Daily Challenge', '💡 Draw this for me', '🎨 Palettes', '🕊 Polly, help me', '📚 Books', '🎄 Advent calendar',
                   '🔘 Button Rain', '🧪 Potion Lab', '🥞 Polly’s Pancakes', '🕵️ Detective Titos', '⏱ Shift with Polly', '📮 Polly’s Office',
                   '🗺 Wobbleland', '📓 Sketchbook & blog'],
            'ru': ['🐣 Своя пиксельная птичка', '🏠 Дом из 6 комнат', '🥕 Огород', '🛍 Магазин и пуговки', '🃏 Коллекционные карточки', '🐦 Стая',
                   '✏️ Челлендж дня', '💡 Нарисуй мне', '🎨 Палитры', '🕊 Полли, помоги', '📚 Книги', '🎄 Адвент-календарь',
                   '🔘 Пуговичный дождь', '🧪 Зельеварня', '🥞 Блинная Полли', '🕵️ Детектив Титос', '⏱ Смена с Полли', '📮 Офис Полли',
                   '🗺 Воббленд', '📓 Скетчбук и блог']}[lang]
    return '<ul class="ov">' + ''.join(f'<li>{r}</li>' for r in rows) + '</ul>'


def cover(name, extra=''):
    return f'<div class="cover">{img(I + "games/" + name + ".png", "px big")}{extra}</div>'


def wobble():
    pts = ['pt-barnaby-burrows', 'pt-milka', 'pt-miss-peony', 'pt-mr-crisper', 'pt-sir-gourdon-squash', 'pt-professor-owlistair-tweed']
    return ('<div class="stack">' + img(I + 'wobbleland/map-pixel.png', 'px wide') +
            '<div class="row">' + ''.join(img(I + f'wobbleland/{p}.png', 'px face') for p in pts) + '</div></div>')


# имя, акцент, (EN, RU): кикер, заголовок, подзаголовок, три факта; картинка — функция языка
S = [
    ('intro', '#D85A30',
     {'en': ('Hello from Riga', 'Pigeon Polly Art Lab', 'The site of Alina Otkinska — artist, illustrator and learning experience designer. Art · creativity · technologies.',
             ['🎨 Watercolours, sketchbooks, books', '🐦 A pixel bird for everyone', '🕹 Little games and a daily challenge']),
      'ru': ('Привет из Риги', 'Pigeon Polly Art Lab', 'Сайт Алины Откинской — художницы, иллюстратора и дизайнера образовательного опыта. Искусство · творчество · технологии.',
             ['🎨 Акварели, скетчбуки, книги', '🐦 Пиксельная птичка для каждого', '🕹 Мини-игры и ежедневный челлендж'])},
     lambda l: f'<div class="intro">{img(I + "home/first-pigeon-polly.jpg", "photo tilt")}{img(I + "home/alina.jpg", "me")}</div>'),
    ('overview', '#534AB7',
     {'en': ('What’s inside', 'Everything on pigeonpolly.com', 'Draw, play, collect and visit each other — in English, Russian and Latvian.', []),
      'ru': ('Что внутри', 'Всё на pigeonpolly.com', 'Рисовать, играть, собирать и ходить в гости — на английском, русском и латышском.', [])},
     overview),
    ('bird', '#E9A93B',
     {'en': ('The Flock', 'Hatch your own bird', 'Everyone who signs in gets a pixel bird. Every bird is one of a kind — a pigeon, a crow, sometimes even a cat.',
             ['🥚 An egg cracks — and here it is', '🎁 A welcome gift and buttons to start', '🎩 Hats, scarves, shoes and treasures']),
      'ru': ('Стая', 'Вылупи свою птичку', 'Каждый, кто входит на сайт, получает пиксельную птичку. Каждая — одна такая: голубь, ворона, а иногда даже котик.',
             ['🥚 Яйцо трескается — и вот она', '🎁 Подарок и пуговки на старт', '🎩 Шляпы, шарфики, обувь и сокровища'])},
     lambda l: birds(range(12), 210, 4)),
    ('room', '#F0A987',
     {'en': ('Your bird’s home', 'A room — and a whole house', 'Wallpaper, floor, a window view and furniture you arrange yourself. Friends can drop by and leave a feather.',
             ['🚪 6 rooms: living room, kitchen, bedroom, crypt, bathroom, study', '🔓 New rooms open as you play', '🛏 Tap the bed, stove or bathtub — something happens']),
      'ru': ('Дом птички', 'Комната — и целый дом', 'Обои, пол, вид за окном и мебель, которую расставляешь по-своему. Гости заглядывают и оставляют пёрышко.',
             ['🚪 6 комнат: гостиная, кухня, спальня, склеп, ванная, кабинет', '🔓 Новые комнаты открываются в играх', '🛏 Нажми на кровать, плиту или ванну — что-то случится'])},
     lambda l: img(SRC + 'room.png', 'px wide frame')),
    ('garden', '#7CC45A',
     {'en': ('Behind the house', 'The garden', 'Plant seeds, water them every day, catch bugs and sell the harvest for buttons. The weather follows the real season.',
             ['🌱 6 beds, 8 kinds of plants', '💧 Plants grow only in wet soil', '🐞 New bugs every day']),
      'ru': ('За домиком', 'Огород', 'Посади семена, поливай каждый день, лови жуков и продавай урожай за пуговки. Погода — по настоящему сезону.',
             ['🌱 6 грядок, 8 растений', '💧 Растёт только во влажной земле', '🐞 Каждый день — новые жуки'])},
     lambda l: img(SRC + 'garden.png', 'px wide frame')),
    ('shop', '#E9A93B',
     {'en': ('Buttons 🔘', 'The shop', 'Hats, scarves, frames, furniture and treasures for your bird — paid for with buttons you earn on the site.',
             ['🔘 Buttons come from games and the challenge', '🎁 Surprise boxes and seasonal themes', '★ Rare legendary items']),
      'ru': ('Пуговки 🔘', 'Магазин', 'Шляпы, шарфики, рамки, мебель и сокровища для птички — за пуговки, которые копятся на сайте.',
             ['🔘 Пуговки — за игры и челлендж', '🎁 Сюрпризы и сезонные темы', '★ Редкие легендарные вещи'])},
     lambda l: '<div class="stack">' + img(I + 'games/shop.jpg', 'wide frame') + birds([3, 6, 7, 8], 190, 4) + '</div>'),
    ('cards', '#9B5DE5',
     {'en': ('Collect them all', 'Collectible cards', 'Alina’s watercolours and pixel art turned into cards with game stats. Each card is one of a kind.',
             ['🃏 Classic, Fall, Halloween, Autumn Cozy…', '📖 An album in every room', '🔁 Trade cards with other birds']),
      'ru': ('Собери все', 'Коллекционные карточки', 'Акварели Алины и пиксель-арт — карточки с игровыми статами. Каждая карточка единственная.',
             ['🃏 Classic, Fall, Halloween, Autumn Cozy…', '📖 Альбом в каждой комнате', '🔁 Обмен карточками с другими птичками'])},
     lambda l: cards()),
    ('flock', '#5FA8A0',
     {'en': ('Together', 'The flock', 'Find any bird, pay a visit and leave a feather in their room. Scatter seeds, call the wind or rain, throw a party.',
             ['🪶 Feathers in friends’ rooms', '📰 Flock news: who hatched, who drew what', '📮 A day card with tasks and stamps']),
      'ru': ('Вместе', 'Стая', 'Найди любую птичку, загляни в гости и оставь пёрышко в её комнате. Насыпь зёрнышек, позови ветер или дождь, устрой праздник.',
             ['🪶 Пёрышки в чужих комнатах', '📰 Новости стаи: кто вылупился, кто что нарисовал', '📮 Карточка дня: задания и штампы'])},
     lambda l: '<div class="meadow">' + birds([0, 4, 6, 9, 1, 5, 2, 3, 7], 230, 3) + '</div>'),
    ('challenge', '#D85A30',
     {'en': ('Draw every day', 'Daily Challenge', 'One subject, a few colours, a few minutes. Draw, upload a photo and see what the flock drew today.',
             ['✏️ A new theme every day', '🔥 Streaks and badges', '🖼 A wall of drawings from the community']),
      'ru': ('Рисуй каждый день', 'Челлендж дня', 'Одна тема, несколько цветов, несколько минут. Нарисуй, загрузи фото и посмотри, что нарисовала стая сегодня.',
             ['✏️ Каждый день — новая тема', '🔥 Серии дней и бейджи', '🖼 Стена рисунков сообщества'])},
     lambda l: f'<div class="duo">{img(I + "challenge/challenge-pigeonpolly-cactus-4-10-2026-800.jpg", "photo back")}{img(SRC + f"challenge-{l}.png", "front")}</div>'),
    ('requests', '#F08BC0',
     {'en': ('Your ideas', 'Draw this for me', 'Suggest anything for Alina to draw and watch ideas turn into sketchbook drawings.',
             ['💡 Write in English, Russian or Latvian', '📓 Every idea can become a drawing', '🎁 A gift for your bird when yours is drawn']),
      'ru': ('Твои идеи', 'Нарисуй мне', 'Предложи Алине любую тему — и смотри, как идеи превращаются в рисунки из скетчбука.',
             ['💡 Можно писать по-русски, по-английски, по-латышски', '📓 Любая идея может стать рисунком', '🎁 Подарок птичке, когда нарисуют твою'])},
     lambda l: bubble({'en': 'Your cat as a knight, a pigeon eating spaghetti…', 'ru': 'Кот в доспехах рыцаря, голубь со спагетти…'}[l], 'sketchbook/sketchbook-1-800.jpg')),
    ('palettes', '#90AE2D',
     {'en': ('Colours', 'Palettes from my art', 'Six colours with names and HEX codes from every painting and sketchbook page. Tap a colour to copy it.',
             ['🎨 Palettes from watercolours', '📷 And from your own photos', '✏️ Pick one and draw']),
      'ru': ('Цвета', 'Палитры из моих работ', 'Шесть цветов с названиями и HEX-кодами из каждой картины и страницы скетчбука. Нажми на цвет — он скопируется.',
             ['🎨 Палитры из акварелей', '📷 И из своих фотографий', '✏️ Выбери и рисуй'])},
     palette),
    ('helps', '#B39DDB',
     {'en': ('Drawing guides', 'Polly, help me draw!', 'Little guides with Polly as your feathered teacher: build any object from simple shapes.',
             ['◻️ Any object from simple shapes', '💡 How to come up with what to draw', '✏️ Works with today’s theme']),
      'ru': ('Подсказки', 'Полли, помоги нарисовать!', 'Маленькие уроки, где Полли — пернатый учитель: любой предмет из простых фигур.',
             ['◻️ Любой предмет из простых фигур', '💡 Как придумать, что нарисовать', '✏️ Подходит к теме дня'])},
     lambda l: '<div class="clip">' + img(SRC + f'helps-{l}.png', 'shot') + '</div>'),
    ('books', '#4A7BD8',
     {'en': ('Books', 'My books about drawing', 'Urban sketching, ink, watercolour — and a free colouring book. Book 3 is on its way.',
             ['🏙 Urban Sketching: Digital Traveler — soon', '🖋 Ink & watercolour guides', '🥐 Coloring Book: World Breakfasts — free']),
      'ru': ('Книги', 'Мои книги о рисовании', 'Городской скетчинг, тушь, акварель — и бесплатная раскраска. Третья книга уже в работе.',
             ['🏙 Urban Sketching: Digital Traveler — скоро', '🖋 Книги о туши и акварели', '🥐 Раскраска World Breakfasts — бесплатно'])},
     lambda l: books()),
    ('advent', '#1D6B4F',
     {'en': ('December', 'Advent calendar', 'From December 1 to 31 open one window a day — a pixel bird flies out with a gift for your profile.',
             ['🎄 31 windows with gifts', '⏳ Missed one? Catch up until January 23', '🎁 Gifts go straight to your bag']),
      'ru': ('Декабрь', 'Адвент-календарь', 'С 1 по 31 декабря открывай по окошку в день — из него вылетает пиксельная птичка с подарком для профиля.',
             ['🎄 31 окошко с подарками', '⏳ Пропущенные можно забрать до 23 января', '🎁 Подарки сразу в сумку'])},
     lambda l: cover('advent')),
    ('rain', '#534AB7',
     {'en': ('Play for buttons', 'Button Rain', 'Catch falling buttons with your pixel bird and dodge the ink blots. Endless levels.',
             ['🔘 Buttons for the shop', '🖤 Watch out for ink blots', '🏆 Weekly top players']),
      'ru': ('Игра за пуговки', 'Пуговичный дождь', 'Лови падающие пуговки своей пиксельной птичкой и уворачивайся от клякс. Уровни бесконечные.',
             ['🔘 Пуговки для магазина', '🖤 Берегись клякс', '🏆 Топ игроков недели'])},
     lambda l: cover('rain')),
    ('potions', '#3F8530',
     {'en': ('Play for buttons', 'Polly’s Potion Lab', 'Walk endless mazes, collect ingredients and discover potion recipes by trial and error.',
             ['🧪 Potions with silly names', '🐈 Play 3 days in a row — a potion that brings the cat in your room to life', '🔦 A hint when you get stuck']),
      'ru': ('Игра за пуговки', 'Зельеварня Полли', 'Проходи бесконечные лабиринты, собирай ингредиенты и открывай рецепты зелий методом проб и ошибок.',
             ['🧪 Зелья со смешными названиями', '🐈 3 дня подряд — зелье, которое оживит котика в комнате', '🔦 Подсказка, если не получается'])},
     lambda l: cover('potions')),
    ('pancakes', '#C8553D',
     {'en': ('Play for buttons', 'Polly’s Pancakes', 'Bake pancakes for the residents of Wobbleland: pick the pan, flip at the right moment, add the toppings.',
             ['🥞 8 pans and 27 toppings', '🐻 Regulars, fussy customers and a bear courier', '♾ Endless levels']),
      'ru': ('Игра за пуговки', 'Блинная Полли', 'Пеки блины жителям Воббленда: выбирай сковородку, переворачивай вовремя, добавляй топпинги.',
             ['🥞 8 сковородок и 27 топпингов', '🐻 Постоянные гости, привереды и медведь-курьер', '♾ Уровни бесконечные'])},
     lambda l: cover('pancakes')),
    ('titos', '#2B2340',
     {'en': ('Mystery', 'Detective Titos', 'Help Detective Titos solve 100 cases in Wobbleland: find clues, question suspects and keep the coffee pot from running dry.',
             ['🔎 62 cases already open, more on the way', '☕ Coffee for every case', '🏅 A souvenir for your room for every case']),
      'ru': ('Детектив', 'Детектив Титос', 'Помоги детективу Титосу раскрыть 100 дел в Воббленде: ищи улики, допрашивай подозреваемых и следи, чтобы кофейник не опустел.',
             ['🔎 62 дела уже на сайте, остальные — в работе', '☕ Кофе для расследований', '🏅 За каждое дело — вещь для комнаты'])},
     lambda l: '<div class="stack">' + img(I + 'rooms/titos-case-promo.png', 'px wide frame') + img(I + 'games/titos.png', 'px mid') + '</div>'),
    ('shift', '#5B3A26',
     {'en': ('Focus timer', 'Shift with Polly', 'Pick 20 minutes to 3 hours and a retro tune — Polly works next to you in her pixel office.',
             ['⏱ 20, 40, 60, 90 minutes or your own', '🎵 3 endless retro melodies', '📈 Every full hour — a promotion and buttons']),
      'ru': ('Таймер для работы', 'Смена с Полли', 'Выбери от 20 минут до 3 часов и ретро-мелодию — Полли работает рядом в пиксельном офисе.',
             ['⏱ 20, 40, 60, 90 минут или своё время', '🎵 3 бесконечные ретро-мелодии', '📈 Каждый полный час — повышение и пуговки'])},
     lambda l: '<div class="stack">' + img(I + 'shift/office.png', 'px wide frame') + img(I + 'games/shift.png', 'px mid') + '</div>'),
    ('office', '#7FC8F8',
     {'en': ('Polly’s world', 'Polly’s Office', 'A pixel office where every little thing is clickable. Help Polly with the Council of Towns’ mail.',
             ['📮 Tasks with letters and parcels', '☕ A water cooler, a copier, a ringing phone', '🌙 Switch to evening and watch the light change']),
      'ru': ('Мир Полли', 'Офис Полли', 'Пиксельный офис, где нажимается каждая мелочь. Помоги Полли с почтой Совета городов.',
             ['📮 Задачи с письмами и посылками', '☕ Кулер, копир, звонящий телефон', '🌙 Включи вечер — и свет изменится'])},
     lambda l: '<div class="stack">' + img(I + 'rooms/office-day.png', 'px wide frame') + img(I + 'games/polly-office.png', 'px mid') + '</div>'),
    ('wobbleland', '#1B6FA8',
     {'en': ('Polly’s world', 'Wobbleland', 'An island of eleven towns drawn in pixels. Explore the map and meet every town with Polly as your guide.',
             ['🗺 11 towns with crests', '🎉 Holidays and recipes of every town', '🏡 38 residents — tap to hear them talk']),
      'ru': ('Мир Полли', 'Воббленд', 'Остров из одиннадцати городов, нарисованный в пикселях. Исследуй карту и знакомься с городами вместе с Полли.',
             ['🗺 11 городов с гербами', '🎉 Праздники и рецепты каждого города', '🏡 38 жителей — нажми, и они заговорят'])},
     lambda l: wobble()),
    ('sketchbook', '#8E1F2E',
     {'en': ('Art', 'Sketchbook & blog', 'Character series, sketchbook pages and notes on drawing, learning and creativity.',
             ['🐦 Pigeon Polly, Mr. Chew, Detective Titos', '📓 Sketchbook pages and ecoline series', '✍️ A blog about drawing and learning']),
      'ru': ('Искусство', 'Скетчбук и блог', 'Серии персонажей, страницы скетчбука и заметки о рисовании, обучении и творчестве.',
             ['🐦 Голубь Полли, Мистер Чу, детектив Титос', '📓 Страницы скетчбука и серии эколином', '✍️ Блог о рисовании и обучении'])},
     lambda l: collage(['bird/2022-pigeon-polly-celebrates-dia-de-muertos-800.jpg', 'halloween/halloween-lady-800.jpg', 'snail/2023-mr-chew-australian-postal-snail-introduction-800.jpg', 'anxiety/anxiety-1-800.jpg'])),
    ('about', '#D85A30',
     {'en': ('About me', 'Alina Otkinska', 'Learning experience designer, artist and author of Pigeon Polly. Exhibitions, publications and projects about learning and AI.',
             ['🖼 On walls & pages', '🎓 Learning & AI projects', '🤝 Illustrations, courses, collaboration']),
      'ru': ('Обо мне', 'Алина Откинская', 'Дизайнер образовательного опыта, художница и автор Pigeon Polly. Выставки, публикации и проекты об обучении и AI.',
             ['🖼 На стенах и страницах', '🎓 Проекты об обучении и AI', '🤝 Иллюстрации, курсы, сотрудничество'])},
     lambda l: f'<div class="intro">{img(I + "exhibitions/exhibitions-2022-1-800.jpg", "photo tilt")}{img(I + "home/alina.jpg", "me")}</div>'),
]

CSS = """
:root { --bg: #2B1A51; --text: #F3EFFA; --muted: #D9D3F2; --peach: #F0A987; --star: #E9A93B; --line: rgba(217,211,242,.22); }
* { box-sizing: border-box; margin: 0; }
html, body { width: 1080px; height: 1920px; overflow: hidden; background: var(--bg); color: var(--text); }
body { font-family: 'Karla', 'Manrope', sans-serif; position: relative;
  background: radial-gradient(1200px 900px at 50% 58%, color-mix(in srgb, var(--acc) 42%, transparent), transparent 70%),
              linear-gradient(180deg, #2B1A51 0%, #24164A 60%, #1B1035 100%); }
.st { position: absolute; inset: 0; padding: 150px 84px 120px; display: flex; flex-direction: column; }
.brand { display: flex; align-items: center; gap: 20px; font: 600 38px 'Fraunces', 'Lora', serif; letter-spacing: .2px; }
.brand img { width: 76px; height: 76px; image-rendering: pixelated; }
.kick { margin-top: 64px; font: 700 30px 'Karla', 'Manrope', sans-serif; text-transform: uppercase; letter-spacing: 4px; color: var(--peach); }
h1 { margin-top: 14px; font: 600 98px/1.02 'Fraunces', 'Lora', serif; letter-spacing: -1.5px; }
.lead { margin-top: 26px; font: 400 40px/1.32 'Karla', 'Manrope', sans-serif; color: var(--muted); }
.vis { flex: 1; display: flex; align-items: center; justify-content: center; min-height: 0; padding: 40px 0; }
.facts { list-style: none; padding: 0; display: grid; gap: 14px; font: 500 35px/1.3 'Karla', 'Manrope', sans-serif; }
.facts li { padding-left: 0; }
.foot { margin-top: 40px; display: flex; align-items: center; gap: 16px; font: 600 44px 'Fraunces', 'Lora', serif; color: var(--star); }
.foot svg { width: 34px; height: 34px; }
img { display: block; }
.px { image-rendering: pixelated; }
.frame { border-radius: 28px; box-shadow: 0 30px 80px rgba(0,0,0,.45); border: 6px solid rgba(255,255,255,.14); }
.wide { width: 100%; height: auto; }
.big { width: 820px; height: 820px; border-radius: 36px; box-shadow: 0 30px 80px rgba(0,0,0,.45); }
.mid { width: 300px; height: 300px; border-radius: 26px; box-shadow: 0 20px 60px rgba(0,0,0,.4); margin-top: -90px; align-self: flex-end; margin-right: 30px; border: 6px solid rgba(255,255,255,.14); }
.cover { position: relative; }
.stack { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 34px; }
.birds { display: grid; grid-template-columns: repeat(var(--c), var(--s)); gap: 22px 26px; justify-items: center; align-items: end; }
.birds img { width: var(--s); height: auto; filter: drop-shadow(0 10px 0 rgba(0,0,0,.18)); }
.meadow { width: 100%; padding: 50px 20px 40px; border-radius: 36px; background: linear-gradient(180deg, #BFE6F6 0%, #D4EEF6 100%); box-shadow: 0 30px 80px rgba(0,0,0,.45); }
.meadow .birds { gap: 0 4px; }
.fan { position: relative; width: 900px; height: 760px; }
.card { position: absolute; left: 50%; top: 60px; width: 330px; height: auto; border-radius: 18px; box-shadow: 0 24px 60px rgba(0,0,0,.5);
  transform-origin: 50% 140%; transform: translateX(-50%) rotate(var(--r)); }
.photo { border-radius: 24px; box-shadow: 0 30px 80px rgba(0,0,0,.45); object-fit: cover; }
.tilt { transform: rotate(-3deg); }
.intro { position: relative; width: 900px; height: 800px; }
.intro .photo { position: absolute; left: 0; top: 0; width: 760px; height: 620px; }
.intro .me { position: absolute; right: 0; bottom: 0; width: 360px; height: 360px; border-radius: 50%; object-fit: cover; border: 10px solid var(--star); box-shadow: 0 30px 80px rgba(0,0,0,.5); }
.duo { position: relative; width: 900px; height: 860px; }
.duo .back { position: absolute; right: 0; top: 0; width: 470px; height: 650px; transform: rotate(5deg); }
.duo .front { position: absolute; left: 0; bottom: 0; width: 560px; height: auto; border-radius: 26px; box-shadow: 0 30px 80px rgba(0,0,0,.5); transform: rotate(-3deg); }
.clip { height: 820px; overflow: hidden; border-radius: 28px; box-shadow: 0 30px 80px rgba(0,0,0,.45); -webkit-mask-image: linear-gradient(180deg, #000 82%, transparent); }
.shot { width: 640px; height: auto; border-radius: 28px; box-shadow: 0 30px 80px rgba(0,0,0,.45); }
.books { display: grid; grid-template-columns: repeat(2, 270px); gap: 26px 40px; }
.book { width: 270px; height: 360px; object-fit: cover; border-radius: 12px; box-shadow: 0 24px 60px rgba(0,0,0,.45); }
.books img:nth-child(odd) { transform: rotate(-2deg); } .books img:nth-child(even) { transform: rotate(2deg) translateY(16px); }
.collage { display: grid; grid-template-columns: 470px 400px; gap: 30px; align-items: center; }
.collage .photo { width: 100%; height: 420px; }
.collage .photo:nth-child(2) { height: 520px; } .collage .photo:nth-child(3) { height: 330px; }
.pal { width: 100%; display: flex; flex-direction: column; gap: 34px; }
.pal .photo { width: 100%; height: 560px; }
.sws { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px 26px; }
.sw { display: grid; grid-template-columns: 74px 1fr; column-gap: 18px; align-items: center; }
.sw i { grid-row: span 2; width: 74px; height: 74px; border-radius: 50%; border: 4px solid rgba(255,255,255,.7); }
.sw b { font: 700 30px 'Karla', 'Manrope', sans-serif; } .sw s { text-decoration: none; font: 400 24px 'Karla', 'Manrope', sans-serif; color: var(--muted); }
.req { position: relative; width: 900px; display: flex; flex-direction: column; align-items: center; gap: 40px; }
.req .photo { width: 760px; height: 600px; }
.bub { position: relative; max-width: 800px; background: #FFFDF8; color: #2B1A51; font: 600 46px/1.25 'Fraunces', 'Lora', serif; padding: 40px 48px; border-radius: 40px; box-shadow: 0 20px 60px rgba(0,0,0,.35); }
.bub::after { content: ''; position: absolute; left: 120px; bottom: -34px; border: 20px solid transparent; border-top: 30px solid #FFFDF8; }
.ov { list-style: none; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 22px 36px; font: 500 36px/1.2 'Karla', 'Manrope', sans-serif; width: 100%;
  background: rgba(255,255,255,.06); border: 2px solid var(--line); border-radius: 36px; padding: 48px 44px; }
.row { display: flex; gap: 18px; justify-content: center; }
.face { width: 128px; height: 128px; border-radius: 22px; border: 5px solid rgba(255,255,255,.2); }
"""

STAR = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z"/></svg>'


def page(st, lang):
    name, acc, tx, vis = st
    kick, h1, lead, facts = tx[lang]
    fl = ''.join(f'<li>{html.escape(f)}</li>' for f in facts)
    return f"""<!doctype html><html lang="{lang}"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Karla:wght@400;500;700&family=Lora:wght@600&family=Manrope:wght@400;500;700&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body style="--acc:{acc}"><div class="st">
<div class="brand"><img src="/site/assets/logo.png">Pigeon Polly Art Lab</div>
<div class="kick">{html.escape(kick)}</div><h1>{html.escape(h1)}</h1><p class="lead">{html.escape(lead)}</p>
<div class="vis">{vis(lang)}</div>
{f'<ul class="facts">{fl}</ul>' if facts else ''}
<div class="foot">{STAR}pigeonpolly.com</div>
</div><script>
// картинка уменьшается, если текст длинный и места под ней меньше
document.fonts.ready.then(() => Promise.all([...document.images].map(i => i.decode().catch(() => 0)))).then(() => {{
  const v = document.querySelector('.vis'), c = v.firstElementChild, room = v.clientHeight - 80, h = c.offsetHeight;
  if (h > room) {{ c.style.transform = `scale(${{room / h}})`; }}
  document.body.dataset.ready = 1;
}});
</script></body></html>"""


def main():
    only = set(sys.argv[1:])
    h = functools.partial(type('Q', (http.server.SimpleHTTPRequestHandler,), {'log_message': lambda *a: None}), directory=str(ROOT))
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    tmp = OUT / '_html'
    tmp.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg = b.new_page(viewport={'width': 1080, 'height': 1920})
        pg.on('pageerror', lambda e: print('ERR', e))
        for lang in ('en', 'ru'):
            (OUT / lang).mkdir(exist_ok=True)
            for n, st in enumerate(S, 1):
                if only and st[0] not in only:
                    continue
                f = tmp / f'{st[0]}-{lang}.html'
                f.write_text(page(st, lang))
                pg.goto(f'http://127.0.0.1:{srv.server_port}/_held/stories/_html/{f.name}')
                pg.wait_for_load_state('networkidle'); pg.wait_for_selector('body[data-ready]')
                over = pg.evaluate("(() => { const v = document.querySelector('.vis'), r = v.getBoundingClientRect(); return [...v.querySelectorAll('*')].filter(e => !e.closest('.clip')).some(e => { const b = e.getBoundingClientRect(); return b.bottom > r.bottom + 2 || b.top < r.top - 2; }) || document.querySelector('.foot').getBoundingClientRect().bottom > 1900; })()")
                if over:
                    print('⚠ не влезает:', st[0], lang)
                pg.screenshot(path=str(OUT / lang / f'{n:02d}-{st[0]}.png'))
        b.close()
    sheet()


def sheet():
    from PIL import Image
    for lang in ('en', 'ru'):
        fs = sorted((OUT / lang).glob('*.png'))
        w, hh, cols = 270, 480, 8
        rows = (len(fs) + cols - 1) // cols
        s = Image.new('RGB', (cols * w + (cols + 1) * 10, rows * hh + (rows + 1) * 10), '#111')
        for i, f in enumerate(fs):
            s.paste(Image.open(f).convert('RGB').resize((w, hh)), (10 + (i % cols) * (w + 10), 10 + (i // cols) * (hh + 10)))
        s.save(OUT / f'sheet-{lang}.jpg', quality=85)


if __name__ == '__main__':
    main()
