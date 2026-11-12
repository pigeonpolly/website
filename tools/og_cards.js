#!/usr/bin/env node
// Картинки превью ссылок 1200×630 (og:image) для разделов сайта на EN/RU/LV → site/images/og/<ключ>-<язык>.jpg
//   node tools/og_cards.js [ключ ...]   — без ключей рисует все; лист — _shots/og-cards.jpg (ImageMagick montage)
// Ключ = путь страницы, «/» → «-», главная — home. build.py ставит картинку сам, если файл есть.
// Вид — как у og-flock-*.jpg: слева надпись, справа арка с картинкой раздела.
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
  train: { img: 'images/games/train.png', px: 1,
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
};
// Стая, профиль птички, огород, новости стаи — общая картинка стаи (og-flock-*.jpg): она как раз про них
const COPY = { flock: 'flock', bird: 'flock', garden: 'flock', 'flock-news': 'flock', privacy: 'flock' };

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const fileUrl = p => 'file://' + path.join(SITE, p);

function html(c, t) {
  const art = c.grid
    ? `<div class="grid">${c.grid.map(g => `<img src="${fileUrl(g)}" class="px">`).join('')}</div>`
    : `<img class="art${c.px ? ' px' : ''}" src="${fileUrl(c.img)}" style="object-position:${c.pos || '50% 50%'};object-fit:${c.fit || 'cover'}">`;
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Karla:wght@400;500&display=swap" rel="stylesheet">
<style>
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#2B1A51;font-family:Karla,sans-serif;position:relative;overflow:hidden}
.txt{position:absolute;left:72px;top:0;bottom:0;width:590px;display:flex;flex-direction:column;justify-content:center}
.k{color:#F0A987;font-size:24px;font-weight:500;letter-spacing:.5px;margin-bottom:18px}
h1{font-family:Fraunces,serif;font-weight:600;color:#F3EFFA;font-size:78px;line-height:1.02;letter-spacing:-.5px}
h1 b{display:block;color:#E9A93B;font-weight:600}
.s{color:#D9D3F2;font-size:27px;line-height:1.45;margin-top:26px;max-width:580px}
.brand{margin-top:44px;font-family:Fraunces,serif;color:#F3EFFA;font-size:30px}
.url{color:#F0A987;font-size:22px;margin-top:6px}
.arch{position:absolute;left:700px;top:56px;width:454px;height:520px;border:8px solid #D85A30;border-radius:227px 227px 22px 22px;overflow:hidden;background:${c.bg || '#1b1035'}}
.art{width:100%;height:100%;display:block}
.px{image-rendering:pixelated}
.grid{display:grid;grid-template-columns:1fr 1fr;width:100%;height:100%}
.grid img{width:100%;height:100%;object-fit:cover}
.base{position:absolute;left:690px;top:578px;width:470px;height:7px;background:#D85A30;border-radius:4px}
.star{position:absolute;left:1106px;top:52px;width:64px;height:64px}
.dot{position:absolute;width:13px;height:13px;border-radius:50%;background:#F5C4B3}
.sw{position:absolute;left:0;right:0;bottom:0;height:70px;display:flex}
.sw i{flex:1}
</style></head><body>
<div class="txt"><div class="k">${esc(t[0])}</div><h1>${esc(t[1])}<b>${esc(t[2])}</b></h1><div class="s">${esc(t[3])}</div>
<div class="brand">Pigeon Polly Art Lab</div><div class="url">pigeonpolly.com</div></div>
<div class="arch">${art}${c.swatch ? '<div class="sw"><i style="background:#3E2A5C"></i><i style="background:#8C5A3C"></i><i style="background:#D85A30"></i><i style="background:#E9A93B"></i><i style="background:#9FB38A"></i><i style="background:#F4E6D0"></i></div>' : ''}</div>
<div class="base"></div>
<svg class="star" viewBox="0 0 64 64"><path d="M32 0C34 22 42 30 64 32C42 34 34 42 32 64C30 42 22 34 0 32C22 30 30 22 32 0Z" fill="#E9A93B"/></svg>
<div class="dot" style="left:668px;top:236px"></div><div class="dot" style="left:1160px;top:390px"></div>
<script>
// длинные надписи — мельче, чтобы влезли
const h=document.querySelector('h1'),s=document.querySelector('.s'),box=document.querySelector('.txt');
let f=78;
const fitLine=el=>{const r=document.createRange();r.selectNodeContents(el);return r.getBoundingClientRect().width};
while(f>44&&(fitLine(h.firstChild)>590||fitLine(h.querySelector('b'))>590||h.getBoundingClientRect().height>f*1.02*2+4)){f-=2;h.style.fontSize=f+'px'}
let g=27;while(g>20&&s.getBoundingClientRect().height>g*1.45*2+4){g-=1;s.style.fontSize=g+'px'}
</script></body></html>`;
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
      fs.writeFileSync(tmp, html(c, c[lang]));
      await page.goto('file://' + tmp, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
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
