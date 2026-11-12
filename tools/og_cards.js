#!/usr/bin/env node
// Картинки превью ссылок 1200×630 (og:image) для разделов сайта на EN/RU/LV → site/images/og/<ключ>-<язык>.jpg
//   node tools/og_cards.js [ключ ...]   — без ключей рисует все; лист — _shots/og-cards.jpg (ImageMagick montage)
// Ключ = путь страницы, «/» → «-», главная — home. build.py ставит картинку сам, если файл есть.
// Вид — как новый дизайн (v2): слева значок, надпись и курсив с линией, справа картинка раздела карточкой.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..'), OUT = path.join(ROOT, 'site/images/og'), SITE = path.join(ROOT, 'site');

// img — от site/; px — пиксель-арт (без сглаживания); pos — object-position; fit: contain — картинка целиком на фоне bg
// тексты: [надзаголовок, строка 1 (белая), строка 2 (золотая), подпись]
const CARDS = {
  home: { img: 'images/v2/hero-autumn.jpg', pos: '40% 50%',
    en: ['lessons · books · games', 'A little painted', 'world', 'Watercolour and ink lessons by Alina Otkinska and the world of Pigeon Polly.'],
    ru: ['уроки · книги · игры', 'Маленький', 'нарисованный мир', 'Уроки акварели и туши Алины Откинской и мир Pigeon Polly.'],
    lv: ['nodarbības · grāmatas · spēles', 'Maza zīmēta', 'pasaule', 'Alīnas Otkinskas akvareļa un tušas nodarbības un Pigeon Polly pasaule.'] },
  learn: { img: 'images/v2/lesson-pepper.jpg', pos: '62% 50%',
    en: ['free video lessons', 'Paint along', 'with Alina', 'Watercolour and ink sketching, step by step.'],
    ru: ['бесплатные видеоуроки', 'Рисуй вместе', 'с Алиной', 'Скетчи акварелью и тушью, шаг за шагом.'],
    lv: ['bezmaksas video nodarbības', 'Zīmē kopā', 'ar Alīnu', 'Akvareļa un tušas skices soli pa solim.'] },
  poll: { img: 'images/v2/hero-winter.jpg', pos: '55% 50%', // опрос на главной, ссылка /poll/ (worker/polls.js pollPage)
    en: ['vote · next video', 'What shall we paint', 'next?', 'Pick the topic of my next video lesson or paint-along. One click, no sign-up.'],
    ru: ['голосование · следующее видео', 'Что рисуем', 'дальше?', 'Выбери тему следующего видеоурока или «рисуем вместе». Один клик, без входа.'],
    lv: ['balsojums · nākamais video', 'Ko zīmēsim', 'tālāk?', 'Izvēlies nākamās video nodarbības tēmu. Viens klikšķis, bez reģistrācijas.'] },
  books: { img: 'images/e-books/watercolor-sketches.jpg', bg: '#F4F0FA', fit: 'contain',
    en: ['creative guides', 'Books for', 'sketching', 'Ink and watercolour guides, a free colouring book and palettes.'],
    ru: ['творческие гайды', 'Книги', 'для скетчинга', 'Гайды по туши и акварели, бесплатная раскраска и палитры.'],
    lv: ['radošie ceļveži', 'Grāmatas', 'skicēšanai', 'Tušas un akvareļa ceļveži, bezmaksas krāsojamā grāmata un paletes.'] },
  'e-books': { img: 'images/e-books/ink-sketching.jpg', bg: '#F4F0FA', fit: 'contain',
    en: ['e-books', 'Learn to', 'sketch', 'E-books by Alina Otkinska: ink, watercolour and urban sketching.'],
    ru: ['электронные книги', 'Учись', 'рисовать', 'Книги Алины Откинской: тушь, акварель, городской скетчинг.'],
    lv: ['e-grāmatas', 'Mācies', 'skicēt', 'Alīnas Otkinskas e-grāmatas: tuša, akvarelis, pilsētas skices.'] },
  sketchbook: { img: 'images/about/sketchbook-photo.jpg',
    en: ['artist from Riga', 'Alina’s', 'sketchbook', 'Watercolours, ink and the characters of Pigeon Polly’s world.'],
    ru: ['художник из Риги', 'Скетчбук', 'Алины', 'Акварель, тушь и герои мира Pigeon Polly.'],
    lv: ['māksliniece no Rīgas', 'Alīnas', 'skicību grāmata', 'Akvareļi, tuša un Pigeon Polly pasaules tēli.'] },
  'art-portfolio': { img: 'images/sketchbook/sketchbook-1-800.jpg',
    en: ['art portfolio', 'My', 'sketchbook', 'Ecoline series, sketchbook pages and AI art by Alina Otkinska.'],
    ru: ['портфолио', 'Мой', 'скетчбук', 'Серии эколином, страницы скетчбука и ИИ-арт Алины Откинской.'],
    lv: ['portfolio', 'Mana', 'skicību grāmata', 'Ekolīna sērijas, skicību lapas un MI māksla.'] },
  'art-portfolio-anxiety': { img: 'images/anxiety/anxiety-1-800.jpg',
    en: ['a series in ecolines', 'Sprouts of', 'anxiety', 'Bright ecoline paintings by Alina Otkinska.'],
    ru: ['серия эколином', 'Ростки', 'тревоги', 'Яркие работы эколином Алины Откинской.'],
    lv: ['sērija ekolīnā', 'Trauksmes', 'asni', 'Spilgti Alīnas Otkinskas ekolīna darbi.'] },
  'art-portfolio-sketchbook': { img: 'images/sketchbook/sketchbook-1-800.jpg',
    en: ['ink & watercolour', 'Sketchbook', 'pages', 'Pages straight from Alina’s sketchbook.'],
    ru: ['тушь и акварель', 'Страницы', 'скетчбука', 'Страницы прямо из скетчбука Алины.'],
    lv: ['tuša un akvarelis', 'Skicību', 'lapas', 'Lapas tieši no Alīnas skicību grāmatas.'] },
  'art-portfolio-snail': { img: 'images/about/walls-photo.jpg', bg: '#FFFFFF', fit: 'contain',
    en: ['illustrations 2023–2025', 'Mr.Chew', 'the snail', 'An Australian postal snail and his slow adventures.'],
    ru: ['иллюстрации 2023–2025', 'Улитка', 'Mr.Chew', 'Австралийская почтовая улитка и её неспешные приключения.'],
    lv: ['ilustrācijas 2023–2025', 'Gliemezis', 'Mr.Chew', 'Austrālijas pasta gliemezis un viņa lēnie piedzīvojumi.'] },
  'art-portfolio-bird': { img: 'images/bird/2026-pigeon-polly-fancy-life-800.jpg',
    en: ['illustrations 2019–2026', 'Pigeon', 'Polly', 'Seven years of a pigeon’s life in watercolour.'],
    ru: ['иллюстрации 2019–2026', 'Голубь', 'Полли', 'Семь лет голубиной жизни в акварели.'],
    lv: ['ilustrācijas 2019–2026', 'Balodis', 'Pollija', 'Septiņi baloža dzīves gadi akvarelī.'] },
  'art-portfolio-detective': { img: 'images/detective/2024-detective-mr-titos-in-the-office-late-night-800.jpg', pos: '55% 50%',
    en: ['illustrations', 'Detective', 'Mr.Titos', 'A late night in the office of Wobbleland’s detective.'],
    ru: ['иллюстрации', 'Детектив', 'Mr.Titos', 'Поздний вечер в кабинете детектива Воббленда.'],
    lv: ['ilustrācijas', 'Detektīvs', 'Mr.Titos', 'Vēls vakars Voblendas detektīva birojā.'] },
  'art-portfolio-halloween': { img: 'images/halloween/halloween-in-blue-800.jpg',
    en: ['halloween series', 'Pumpkin', 'family', 'Welcome to the Pumpkin-Heads family.'],
    ru: ['серия к Хэллоуину', 'Семья', 'Тыквоголовых', 'Добро пожаловать в семью Тыквоголовых.'],
    lv: ['Helovīna sērija', 'Ķirbjgalvu', 'ģimene', 'Laipni lūdzam Ķirbjgalvu ģimenē.'] },
  'art-portfolio-ai-art': { img: 'images/ai-art/ai-art-1-800.jpg',
    en: ['Pigeon Polly style', 'AI', 'art', 'AI art based on the traditional Pigeon Polly style.'],
    ru: ['в стиле Pigeon Polly', 'ИИ-', 'арт', 'ИИ-арт по мотивам акварелей Pigeon Polly.'],
    lv: ['Pigeon Polly stilā', 'MI', 'māksla', 'MI māksla pēc Pigeon Polly akvareļu motīviem.'] },
  'on-walls-and-pages': { img: 'images/about/walls.png', px: 1,
    en: ['exhibitions & publications', 'On walls', '& pages', 'Pigeon Polly art in galleries and in print.'],
    ru: ['выставки и публикации', 'На стенах', 'и страницах', 'Работы Pigeon Polly в галереях и в печати.'],
    lv: ['izstādes un publikācijas', 'Uz sienām', 'un lapām', 'Pigeon Polly darbi galerijās un drukā.'] },
  'about-me': { img: 'images/about/desk.webp', pos: '55% 50%',
    en: ['artist · learning designer', 'Hi, I’m', 'Alina', 'Come to my desk and chat with me and Polly.'],
    ru: ['художник · дизайнер обучения', 'Привет, я', 'Алина', 'Загляни за мой стол и поболтай со мной и Полли.'],
    lv: ['māksliniece · mācību dizainere', 'Sveiki, es esmu', 'Alīna', 'Ienāc pie mana galda un parunā ar mani un Polliju.'] },
  projects: { img: 'images/about/projects.png', px: 1,
    en: ['learning & AI', 'Learning', 'projects', 'Learning design, EdTech and AI automation by Alina Otkinska.'],
    ru: ['обучение и ИИ', 'Проекты', 'про обучение', 'Дизайн обучения, EdTech и ИИ-автоматизация.'],
    lv: ['mācības un MI', 'Mācību', 'projekti', 'Mācību dizains, EdTech un MI automatizācija.'] },
  'work-with-me': { img: 'images/about/work.png', px: 1,
    en: ['workshops & consulting', 'Work', 'with me', 'Learning design, AI in education and sketching workshops.'],
    ru: ['воркшопы и консультации', 'Работать', 'вместе', 'Дизайн обучения, ИИ в образовании и воркшопы по скетчингу.'],
    lv: ['darbnīcas un konsultācijas', 'Strādāsim', 'kopā', 'Mācību dizains, MI izglītībā un skicēšanas darbnīcas.'] },
  'art-pill': { img: 'images/artpill/claude/13.jpg', bg: '#F7F3EA', fit: 'contain',
    en: ['a drawing pill for AI', 'Art-Pill', 'by Polly', 'Give it to your AI and it draws by hand, line by line.'],
    ru: ['таблетка рисования для ИИ', 'Art-Pill', 'by Polly', 'Дай её своему ИИ — и он рисует от руки, линия за линией.'],
    lv: ['zīmēšanas tablete MI', 'Art-Pill', 'by Polly', 'Iedod to savam MI — un tas zīmē ar roku, līniju pa līnijai.'] },
  blog: { img: 'images/about/books.png', px: 1,
    en: ['notes & news', 'Pigeon Polly', 'blog', 'Notes on drawing, learning and creativity.'],
    ru: ['заметки и новости', 'Блог', 'Pigeon Polly', 'Заметки о рисовании, учёбе и творчестве.'],
    lv: ['piezīmes un ziņas', 'Pigeon Polly', 'blogs', 'Piezīmes par zīmēšanu, mācīšanos un radošumu.'] },
  challenge: { img: 'images/challenge/challenge-pigeonpolly-cactus-4-10-2026-800.jpg',
    en: ['one subject · a few minutes', 'Daily sketch', 'challenge', 'Draw today’s subject and pin it to the wall.'],
    ru: ['одна тема · пара минут', 'Челлендж', 'дня', 'Нарисуй тему дня и повесь рисунок на стену.'],
    lv: ['viena tēma · dažas minūtes', 'Dienas', 'izaicinājums', 'Uzzīmē dienas tēmu un piesprauž zīmējumu pie sienas.'] },
  requests: { img: 'images/about/sketchbook.png', px: 1,
    en: ['suggest an idea', 'Draw this', 'for me', 'Every idea becomes a sketchbook drawing, and yours gets a gift.'],
    ru: ['предложи идею', 'Нарисуй', 'мне', 'Каждая идея становится рисунком в скетчбуке, а за свою — подарок.'],
    lv: ['iesaki ideju', 'Uzzīmē', 'man', 'Katra ideja kļūst par zīmējumu, un par tavējo — dāvana.'] },
  'polly-helps': { img: 'images/school/book-cover.jpg', bg: '#FFFFFF', fit: 'contain',
    en: ['little drawing guides', 'Polly, help me', 'draw', 'Build anything from simple shapes and find ideas for what to draw.'],
    ru: ['маленькие гайды', 'Полли, помоги', 'нарисовать', 'Любой предмет из простых фигур и идеи, что нарисовать.'],
    lv: ['mazi zīmēšanas ceļveži', 'Pollija, palīdzi', 'uzzīmēt', 'Jebkas no vienkāršām formām un idejas, ko zīmēt.'] },
  palettes: { img: 'images/bird/2022-pigeon-polly-summer-lover-800.jpg', swatch: 1,
    en: ['colours from real paintings', 'Watercolour', 'palettes', 'Six colours with HEX codes from every artwork. Copy and draw.'],
    ru: ['цвета настоящих картин', 'Палитры', 'акварели', 'Шесть цветов с HEX-кодами из каждой работы. Копируй и рисуй.'],
    lv: ['īstu gleznu krāsas', 'Akvareļa', 'paletes', 'Sešas krāsas ar HEX kodiem no katra darba. Kopē un zīmē.'] },
  wobbleland: { img: 'images/games/wobbleland.png', px: 1,
    en: ['an island of eleven towns', 'Welcome to', 'Wobbleland', 'Explore the pixel map with Polly as your guide.'],
    ru: ['остров из одиннадцати городов', 'Добро пожаловать', 'в Воббленд', 'Гуляй по пиксельной карте вместе с Полли.'],
    lv: ['vienpadsmit pilsētu sala', 'Laipni lūdzam', 'Voblendā', 'Izpēti pikseļu karti kopā ar Polliju.'] },
  games: { img: 'images/games/rain.png', px: 1, grid: ['images/games/rain.png', 'images/games/pancakes.png', 'images/games/train.png', 'images/games/titos.png'],
    en: ['free · in your browser', 'Pigeon Polly', 'games', 'Play, earn buttons and spend them in the shop.'],
    ru: ['бесплатно · в браузере', 'Игры', 'Pigeon Polly', 'Играй, собирай пуговки и трать их в магазине.'],
    lv: ['bez maksas · pārlūkā', 'Pigeon Polly', 'spēles', 'Spēlē, krāj pogas un tērē tās veikalā.'] },
  rain: { img: 'images/games/rain.png', px: 1,
    en: ['a little game', 'Button', 'Rain', 'Catch falling buttons with your pixel bird and dodge the ink blots.'],
    ru: ['маленькая игра', 'Пуговичный', 'дождь', 'Лови пуговки своей пиксельной птичкой и уворачивайся от клякс.'],
    lv: ['maza spēle', 'Pogu', 'lietus', 'Ķer krītošās pogas ar savu pikseļu putniņu un izvairies no traipiem.'] },
  pancakes: { img: 'images/games/pancakes.png', px: 1,
    en: ['a little game', 'Polly’s', 'Pancakes', 'Bake pancakes for Wobbleland: flip at the right moment.'],
    ru: ['маленькая игра', 'Блинная', 'Полли', 'Пеки блинчики для жителей Воббленда — переворачивай вовремя.'],
    lv: ['maza spēle', 'Pollijas', 'pankūkas', 'Cep pankūkas Voblendas iedzīvotājiem — apgriez īstajā brīdī.'] },
  train: { img: 'images/games/train.png', px: 1, pos: '50% 85%',
    en: ['a word game', 'Polly’s', 'Train', 'Travel to Spain, Norway, Britain or Latvia and make words from letters.'],
    ru: ['игра со словами', 'Поезд', 'Полли', 'Поезжай в Испанию, Норвегию, Британию или Латвию и собирай слова.'],
    lv: ['vārdu spēle', 'Pollijas', 'vilciens', 'Brauc uz Spāniju, Norvēģiju, Lielbritāniju vai Latviju un liec vārdus.'] },
  potions: { img: 'images/games/potions.png', px: 1,
    en: ['a halloween game', 'Polly’s', 'Potion Lab', 'Walk the mazes, collect ingredients and discover recipes.'],
    ru: ['игра к Хэллоуину', 'Зельеварня', 'Полли', 'Броди по лабиринтам, собирай ингредиенты и открывай рецепты.'],
    lv: ['Helovīna spēle', 'Pollijas', 'dziru virtuve', 'Staigā pa labirintiem, vāc sastāvdaļas un atklāj receptes.'] },
  advent: { img: 'images/games/advent.png', px: 1,
    en: ['december 1–31', 'Advent', 'calendar', 'Open a window a day: a pixel bird flies out with a gift.'],
    ru: ['1–31 декабря', 'Адвент-', 'календарь', 'Открывай по окошку в день — оттуда вылетает птичка с подарком.'],
    lv: ['1.–31. decembris', 'Adventes', 'kalendārs', 'Atver pa lodziņam dienā — izlido putniņš ar dāvanu.'] },
  titos: { img: 'images/games/titos.png', px: 1,
    en: ['100 cases in Wobbleland', 'Detective', 'Titos', 'Find clues, question suspects and keep the coffee pot full.'],
    ru: ['100 дел в Воббленде', 'Детектив', 'Титос', 'Ищи улики, допрашивай подозреваемых, следи за кофейником.'],
    lv: ['100 lietas Voblendā', 'Detektīvs', 'Titoss', 'Meklē pierādījumus, pratini aizdomās turētos, pieskati kafijas kannu.'] },
  'polly-office': { img: 'images/games/polly-office.png', px: 1,
    en: ['a pixel office', 'Polly,', 'office clerk', 'Old blinds, a water cooler and a desk you can click.'],
    ru: ['пиксельный офис', 'Полли,', 'офисный клерк', 'Старые жалюзи, кулер и стол, по которому можно кликать.'],
    lv: ['pikseļu birojs', 'Pollija,', 'biroja klerke', 'Vecas žalūzijas, ūdens dzesētājs un galds, uz kura var klikšķināt.'] },
  shift: { img: 'images/games/shift.png', px: 1,
    en: ['a focus timer', 'Shift with', 'Polly', 'Pick a time and a retro tune, and Polly works next to you.'],
    ru: ['таймер для работы', 'Смена', 'с Полли', 'Выбери время и ретро-мелодию — Полли работает рядом.'],
    lv: ['fokusa taimeris', 'Maiņa', 'ar Polliju', 'Izvēlies laiku un retro melodiju — Pollija strādā blakus.'] },
  shop: { img: 'images/games/shop.jpg', bg: '#F9E3D6', pos: '30% 50%',
    en: ['paid in buttons', 'Pigeon Polly', 'shop', 'Hats, scarves, frames and treasures for your pixel bird.'],
    ru: ['за пуговки', 'Магазин', 'Pigeon Polly', 'Шляпы, шарфы, рамки и сокровища для пиксельной птички.'],
    lv: ['par pogām', 'Pigeon Polly', 'veikals', 'Cepures, šalles, rāmji un dārgumi tavam pikseļu putniņam.'] },
  flock: { img: 'images/og/src/flock-full.jpg', px: 1,
    en: ['free · fun · one click', 'Get your own', 'pixel bird', 'Sign in, join the flock and support an artist, for free.'],
    ru: ['бесплатно · весело · в один клик', 'Заведи свою', 'пиксельную птичку', 'Войди на сайт, стань частью стаи и бесплатно поддержи художника.'],
    lv: ['bez maksas · jautri · vienā klikšķī', 'Iegūsti savu', 'pikseļu putniņu', 'Ienāc vietnē, kļūsti par bara daļu un bez maksas atbalsti mākslinieci.'] },
  bird: { img: 'images/og/src/flock-full.jpg', px: 1,
    en: ['a bird of the flock', 'Pixel bird', 'profile', 'Its room, bag of gifts, achievements and sketches.'],
    ru: ['птичка из стаи', 'Профиль', 'птички', 'Комната, сумка с подарками, достижения и рисунки.'],
    lv: ['bara putniņš', 'Putniņa', 'profils', 'Istaba, dāvanu soma, sasniegumi un zīmējumi.'] },
  garden: { img: 'images/og/src/flock-scene.jpg', px: 1,
    en: ['behind the bird’s house', 'Bird', 'garden', 'Plant seeds, water them every day and sell the harvest for buttons.'],
    ru: ['за домом птички', 'Огород', 'птички', 'Сажай семена, поливай каждый день и продавай урожай за пуговки.'],
    lv: ['aiz putniņa mājas', 'Putniņa', 'dārzs', 'Stādi sēklas, laisti katru dienu un pārdod ražu par pogām.'] },
  'flock-news': { img: 'images/og/src/flock-scene.jpg', px: 1,
    en: ['what’s new', 'Flock', 'news', 'New birds, drawings of the day, housewarmings and badges.'],
    ru: ['что нового', 'Новости', 'стаи', 'Новые птички, рисунки дня, новоселья и бейджи.'],
    lv: ['kas jauns', 'Bara', 'ziņas', 'Jauni putniņi, dienas zīmējumi, ievākšanās un nozīmītes.'] },
  privacy: { img: 'images/logo/v3/pigeon-polly-color-autumn-1080.png', bg: '#FBF9F5', fit: 'contain',
    en: ['privacy', 'How we', 'care for data', 'How pigeonpolly.com handles your data.'],
    ru: ['конфиденциальность', 'Как мы', 'бережём данные', 'Как pigeonpolly.com обращается с твоими данными.'],
    lv: ['privātums', 'Kā mēs', 'sargājam datus', 'Kā pigeonpolly.com rīkojas ar taviem datiem.'] },
};
const COPY = {};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const fileUrl = p => 'file://' + path.join(SITE, p);

// новый дизайн (редизайн 2.0, v2.css, осень): бумага, значок-логотип, тонкий Fraunces + синий курсив с линией от руки, картинка — карточкой
const ACC = '#22405F', INK = '#2A211C', MUT = '#6C6058', LINE = '#DED5CA';
const NOTE = { en: 'come and play', ru: 'заходи в гости', lv: 'nāc ciemos' }, NOTE2 = { en: 'with love, Polly', ru: 'с любовью, Полли', lv: 'ar mīlestību, Pollija' };
function html(c, t, lang) {
  const art = c.grid
    ? `<div class="grid">${c.grid.map(g => `<img src="${fileUrl(g)}" class="px">`).join('')}</div>`
    : `<img class="art${c.px ? ' px' : ''}" src="${fileUrl(c.img)}" style="object-position:${c.pos || '50% 50%'};object-fit:${c.fit || 'cover'}">`;
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&family=Lora:ital,wght@0,400;1,400&family=Karla:wght@400;500;700&family=Caveat:wght@700&display=swap" rel="stylesheet">
<style>
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#F4F0EA;font-family:Karla,sans-serif;position:relative;overflow:hidden;color:${INK}}
.top{position:absolute;left:64px;top:40px;display:flex;align-items:center;gap:16px;font-family:Fraunces,Lora,serif;font-size:30px;letter-spacing:-.01em}
.top img{width:66px;height:66px}
.top i{color:${ACC}}
.txt{position:absolute;left:72px;top:150px;width:600px}
.k{display:inline-flex;align-items:center;gap:12px;border:1.5px solid ${LINE};border-radius:999px;padding:9px 20px;font-size:15px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${MUT};background:#FBF9F5}
.k:before{content:"";width:9px;height:9px;border-radius:50%;background:${ACC}}
h1{white-space:nowrap;font-family:Fraunces,Lora,serif;font-weight:400;font-size:86px;line-height:1.02;letter-spacing:-.02em;margin-top:28px}
h1 em{display:inline-block;white-space:nowrap;position:relative;color:${ACC};font-style:italic}
h1 em svg{position:absolute;left:-3%;bottom:-.16em;width:106%;height:.32em;overflow:visible}
h1 em path{stroke:${ACC};stroke-width:5;fill:none;stroke-linecap:round;opacity:.85}
.s{color:${MUT};font-size:25px;line-height:1.45;margin-top:30px;max-width:560px}
.url{position:absolute;left:72px;bottom:44px;font-size:15px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${MUT}}
.card{position:absolute;left:728px;top:62px;width:410px;height:470px;background:#fff;padding:14px;transform:rotate(2.2deg);box-shadow:0 18px 40px rgba(42,33,28,.18),0 2px 6px rgba(42,33,28,.12)}
.pic{width:100%;height:100%;overflow:hidden;position:relative;background:${c.bg || '#1b1035'}}
.art{width:100%;height:100%;display:block}
.px{image-rendering:pixelated}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;width:100%;height:100%;background:#fff}
.grid img{width:100%;height:100%;object-fit:cover}
.note{position:absolute;left:790px;top:548px;font-family:Caveat,cursive;font-size:38px;color:${ACC};transform:rotate(-3deg);display:flex;align-items:center;gap:12px}
.note svg{width:64px;height:24px}
.sw{position:absolute;left:0;right:0;bottom:0;height:64px;display:flex}
.sw i{flex:1}
.fx{font-family:Lora,serif}
</style></head><body>
<div class="top"><img src="${fileUrl('assets/logo-badge-autumn.png')}"><span>Pigeon Polly <i>Art Lab</i></span></div>
<div class="txt"><div class="k">${esc(t[0])}</div><h1><span class="l1">${esc(t[1])}</span><br><em>${esc(t[2]).replace(/ā/g, '<span class="fx">ā</span>')}<svg viewBox="0 0 200 20" preserveAspectRatio="none"><path d="M3 13 C 45 4, 90 18, 130 9 S 185 6, 197 11"/></svg></em></h1><div class="s">${esc(t[3])}</div></div>
<div class="url">pigeonpolly.com</div>
<div class="card"><div class="pic">${art}${c.swatch ? '<div class="sw"><i style="background:#3E2A5C"></i><i style="background:#8C5A3C"></i><i style="background:#D85A30"></i><i style="background:#E9A93B"></i><i style="background:#9FB38A"></i><i style="background:#F4E6D0"></i></div>' : ''}</div></div>
<div class="note"><svg viewBox="0 0 64 24"><path d="M2 20 C 18 4, 40 2, 60 8" stroke="${ACC}" stroke-width="3" fill="none" stroke-linecap="round"/></svg>${esc((c.px || c.grid ? NOTE : NOTE2)[lang])}</div>
</body></html>`;
}

(async () => {
  const only = process.argv.slice(2);
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  const done = [];
  for (const [key, c] of Object.entries(CARDS)) {
    if (COPY[key] || (only.length && !only.includes(key))) continue;
    for (const lang of ['en', 'ru', 'lv']) {
      const tmp = path.join(OUT, `_tmp.html`);
      fs.writeFileSync(tmp, html(c, c[lang], lang));
      await page.goto('file://' + tmp, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        await document.fonts.ready;
        // длинные надписи — мельче, чтобы не залезали на карточку
        const h = document.querySelector('h1'), s = document.querySelector('.s'), W = 620, w = el => el.getBoundingClientRect().width;
        let f = 86; while (f > 44 && (w(h.querySelector('.l1')) > W || w(h.querySelector('em')) > W)) { f -= 2; h.style.fontSize = f + 'px'; }
        let g = 25; while (g > 19 && s.getBoundingClientRect().height > g * 1.45 * 2 + 4) { g -= 1; s.style.fontSize = g + 'px'; }
      });
      const dest = path.join(OUT, `${key}-${lang}.jpg`);
      await page.screenshot({ path: dest, type: 'jpeg', quality: 86 });
      done.push(dest);
    }
  }
  try { fs.unlinkSync(path.join(OUT, '_tmp.html')); } catch (e) {}
  for (const [key, from] of Object.entries(COPY)) for (const lang of ['en', 'ru', 'lv'])
    fs.copyFileSync(path.join(SITE, `assets/og-${from}-${lang}.jpg`), path.join(OUT, `${key}-${lang}.jpg`));
  await browser.close();
  fs.mkdirSync(path.join(ROOT, '_shots'), { recursive: true });
  const sheet = fs.readdirSync(OUT).filter(f => /-(en|ru)\.jpg$/.test(f)).sort().map(f => path.join(OUT, f));
  require('child_process').execFileSync('montage', [...sheet, '-geometry', '400x210+3+3', '-tile', '6x', path.join(ROOT, '_shots/og-cards.jpg')]);
  console.log('og cards:', done.length, 'drawn,', Object.keys(COPY).length * 3, 'copied');
})();
