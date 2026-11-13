// Курс туши, урок 15 — «Смешанные техники + продолжай» (книга «Ink Sketching», с. 79–81). Последний урок курса. Формат — worker/ink/index.js.
const F = (img, cap) => `<figure><img src="/images/ink/${img}" alt="" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
// Темы для скетчбука после курса — из книги (с. 81).
const TOPICS = {
  en: ['Forgotten shoes', 'People in a queue', 'Kitchen table chaos', 'Hands holding an object', 'City birds and food', 'The view from a transport window', 'What’s in your bag', 'A sleeping pet', 'Light and shadow in a hallway', 'Your breakfast'],
  ru: ['Забытая обувь', 'Люди в очереди', 'Хаос на кухонном столе', 'Руки, держащие предмет', 'Городские птицы и еда', 'Вид из окна транспорта', 'Что лежит в сумке', 'Спящий питомец', 'Свет и тень в коридоре', 'Твой завтрак'],
  lv: ['Aizmirsti apavi', 'Cilvēki rindā', 'Haoss uz virtuves galda', 'Rokas, kas tur priekšmetu', 'Pilsētas putni un ēdiens', 'Skats pa transporta logu', 'Kas ir somā', 'Guļošs mājdzīvnieks', 'Gaisma un ēna gaitenī', 'Tavas brokastis'],
};
const list = (k) => `<ol>${TOPICS[k].map(x => `<li>${x}</li>`).join('')}</ol>`;
export default {
  icon: '✚', card: 'halloween-remix/67.png', cover: 'p79-140.jpg',
  en: {
    name: 'Mixed media',
    intro: 'The last lesson. Ink stays the backbone, but now we invite friends: one bright colour, a watercolour wash, a grey marker, a white gel pen. And then — the most important part of the whole course: how to keep going when the lessons are over.',
    goals: ['use colour as an accent, not as colouring-in', 'combine ink with watercolour, grey marker and white gel pen', 'use the reverse trick: fill around, keep the key things white', 'build a sketching habit that lasts after the course'],
    th: `<h4>Colour as an accent</h4>
${F('p79-140.jpg', 'A lighthouse, a compass and tentacles: everything in black ink — and one orange eye in the centre of the compass')}
<p>You don’t have to colour everything. <b>One</b> bright detail — yellow, red, orange — in an ink drawing becomes the centre of interest at once. The rest stays black and white and only makes it louder.</p>
<h4>Ink and its friends</h4>
${F('p79-142.jpg', 'Ink lines, a red-brown frame and one orange scarf: colour leads the eye along the drawing')}
<ul><li><b>Watercolour before ink</b> — a soft wash first, lines on top when it is dry: light and mood.</li>
<li><b>Watercolour after ink</b> — waterproof ink first, then colour: the lines stay crisp.</li>
<li><b>Grey marker</b> — quick deep shadows without hatching.</li>
<li><b>White gel pen</b> — highlights on top of the dark: a spark in the eye, a glint on metal, rain.</li></ul>
<h4>The reverse trick</h4>
${F('p80-144.jpg', 'Watercolour wall, ink gate: the person reading stays almost white, so the eye goes straight to them')}
<p>Fill the background or the object with a dense wash and <b>leave the key details white</b>: a highlight in the eye, the curve of a wing, a page of a book. White paper is the brightest colour you have — save it for the most important place.</p>
<h4>Keep going</h4>
${F('p81-145.jpg', 'A blot is not the end — it is the beginning of the next page')}
<ul><li>Sketching is a <b>habit</b>, like morning coffee: a few minutes every day beat one long Sunday.</li>
<li>Use the short pauses of the day — a queue, a tram, a kettle that hasn’t boiled yet.</li>
<li>Measure progress in <b>filled sketchbooks</b>, not in likes.</li>
<li>A sketchbook is just paper. It can take anything. Stop thinking — start making a mess.</li></ul>
<h4>Ten themes for your next pages</h4>
${list('en')}`,
    simple: 'Colour works best as one accent; the rest stays ink. Watercolour before ink — mood, after ink — crisp lines; grey marker — quick shadows; white gel pen — highlights. Reverse trick: fill around and keep the key details white. And then just keep going: a little every day, progress in filled sketchbooks.',
    mist: [['Colouring every part of the drawing.', 'One bright accent; the rest stays black and white.'],
      ['Watercolour over non-waterproof ink — lines melt.', 'Check the ink is waterproof and dry, or put the wash first.'],
      ['Painting over the place that should shine.', 'Plan the white: keep paper for the key highlight, or add it with a white gel pen.'],
      ['Waiting for a free day to sketch “properly”.', 'Sketch in short pauses — a few minutes every day.'],
      ['Judging progress by likes.', 'Count filled pages and sketchbooks.']],
    terms: [['Mixed media', 'ink combined with other materials: watercolour, markers, gel pens'], ['Colour accent', 'one bright detail that becomes the centre of interest'], ['Waterproof ink', 'ink that doesn’t run when it is dry and gets wet'], ['Grey marker', 'a marker for quick, even shadows'], ['White gel pen', 'a pen for white highlights on top of dark areas'], ['Reverse trick', 'filling around the subject and keeping key details white'], ['Sketching habit', 'a few minutes of drawing every day']],
    fact: 'In 2009 the illustrator Jake Parker set himself a challenge: one ink drawing every day for the whole of October. He called it Inktober — and now every autumn millions of people around the world post their daily ink drawings.',
    test: [['How to use colour in an ink sketch?', 'As one accent that becomes the centre of interest', 'Colour every part evenly', 'Never use colour', 'One bright detail is louder than ten.'],
      ['What does watercolour BEFORE ink give?', 'Light and mood; the lines go on top when it is dry', 'Melted lines', 'Nothing', 'A soft base, crisp lines on top.'],
      ['What must you check before watercolour AFTER ink?', 'That the ink is waterproof and fully dry', 'That the paper is wet', 'That the pen is new', 'Otherwise the lines run.'],
      ['What is a white gel pen for?', 'Highlights on top of dark areas', 'Outlines', 'Erasing mistakes', 'A spark in the eye, a glint on metal.'],
      ['What is the reverse trick?', 'Fill around the subject and keep key details white', 'Draw with the left hand', 'Turn the page upside down', 'White paper is the brightest colour — save it.'],
      ['What helps a sketching habit most?', 'A few minutes every day in short pauses', 'One long session a month', 'Waiting for inspiration', 'Like morning coffee.'],
      ['How to measure progress?', 'In filled pages and sketchbooks', 'In likes', 'In expensive materials', 'The hand learns from pages, not from likes.']],
    task: { h: 'One accent and the white', need: 'waterproof liner, watercolour or diluted ink with a brush, a grey marker or a white gel pen if you have one, paper from 200 g/m²', time: '50 min',
      steps: ['Sketch 1: a small composition in ink. Choose one detail and make it bright — yellow, red or orange. Nothing else in colour.', 'Sketch 2: something with many objects — shoes in a cupboard, jars on a café shelf, an open fridge. Draw it in detail.', 'Choose a few objects to stay white. Colour or wash everything else around them.', 'If you have them: deep shadows with a grey marker, highlights with a white gel pen.', 'On the same page write which theme from the list you will draw tomorrow.'] },
    client: { name: 'Ghostina Gravy', job: 'a ghost chef who has been stirring the same Eternal Soup for two hundred years', say: 'Darling, it’s almost ready! Two hundred years — almost! I’m throwing a party and I need a poster. The soup, the pot, me with my ladle. But listen: I’m a ghost, I’m white, I don’t want to be coloured in. Colour the kitchen around me — make it warm. And one bright thing, just one… the carrot. And no mirrors in the picture, please. Mine steals croutons.',
      ask: ['A poster in ink with one bright accent', 'Colour around, the ghost and the steam left white', 'Highlights: white paper or a white gel pen', 'A title and the date of the party'] },
  },
  ru: {
    name: 'Смешанные техники',
    intro: 'Последний урок. Тушь остаётся основой, но теперь зовём друзей: один яркий цвет, акварельную заливку, серый маркер, белую гелевую ручку. А потом — самое важное во всём курсе: как продолжать, когда уроки закончились.',
    goals: ['использовать цвет акцентом, а не раскраской', 'соединять тушь с акварелью, серым маркером и белой гелевой ручкой', 'применять обратный приём: залить вокруг, ключевое оставить белым', 'построить привычку скетчинга, которая останется после курса'],
    th: `<h4>Цвет — акцентом</h4>
${F('p79-140.jpg', 'Маяк, компас и щупальца: всё чёрной тушью — и один оранжевый глаз в центре компаса')}
<p>Не нужно раскрашивать всё. <b>Одна</b> яркая деталь — жёлтая, красная, оранжевая — в рисунке тушью сразу становится центром интереса. Остальное остаётся чёрно-белым и только делает её громче.</p>
<h4>Тушь и её друзья</h4>
${F('p79-142.jpg', 'Линии туши, красно-коричневая рамка и один оранжевый шарф: цвет ведёт глаз по рисунку')}
<ul><li><b>Акварель до туши</b> — сначала мягкая заливка, линии сверху, когда высохнет: свет и настроение.</li>
<li><b>Акварель после туши</b> — сначала водостойкая тушь, потом цвет: линии остаются чёткими.</li>
<li><b>Серый маркер</b> — быстрые глубокие тени без штриховки.</li>
<li><b>Белая гелевая ручка</b> — блики поверх тёмного: искра в глазу, отблеск на металле, дождь.</li></ul>
<h4>Обратный приём</h4>
${F('p80-144.jpg', 'Стена — акварелью, решётка — тушью: человек с книгой почти белый, и глаз сразу идёт к нему')}
<p>Залей фон или предмет плотной акварелью и <b>оставь ключевые детали белыми</b>: блик в глазу, изгиб крыла, страницу книги. Белая бумага — самый яркий цвет, который у тебя есть, — береги её для самого важного места.</p>
<h4>Продолжай</h4>
${F('p81-145.jpg', 'Клякса — не конец, а начало следующей страницы')}
<ul><li>Скетчинг — это <b>привычка</b>, как утренний кофе: несколько минут каждый день лучше одного долгого воскресенья.</li>
<li>Пользуйся короткими паузами дня — очередь, трамвай, чайник, который ещё не закипел.</li>
<li>Прогресс измеряй <b>заполненными скетчбуками</b>, а не лайками.</li>
<li>Скетчбук — просто бумага. Он выдержит всё. Хватит думать — просто начни пачкать.</li></ul>
<h4>Десять тем для следующих страниц</h4>
${list('ru')}`,
    simple: 'Цвет лучше всего работает одним акцентом; остальное — тушь. Акварель до туши — настроение, после — чёткие линии; серый маркер — быстрые тени; белая гелевая — блики. Обратный приём: залить вокруг, ключевое оставить белым. А дальше просто продолжай: понемногу каждый день, прогресс — в заполненных скетчбуках.',
    mist: [['Раскрасить каждую часть рисунка.', 'Один яркий акцент; остальное остаётся чёрно-белым.'],
      ['Акварель поверх неводостойкой туши — линии плывут.', 'Проверить, что тушь водостойкая и сухая, или заливку — первой.'],
      ['Закрасить место, которое должно сиять.', 'Планировать белое: оставить бумагу для главного блика или добавить его белой гелевой.'],
      ['Ждать свободного дня, чтобы рисовать «как следует».', 'Рисовать в короткие паузы — по несколько минут каждый день.'],
      ['Мерить прогресс лайками.', 'Считать заполненные страницы и скетчбуки.']],
    terms: [['Смешанная техника', 'тушь вместе с другими материалами: акварелью, маркерами, гелевыми ручками'], ['Цветовой акцент', 'одна яркая деталь, которая становится центром интереса'], ['Водостойкая тушь', 'тушь, которая не плывёт, если высохла и намокла'], ['Серый маркер', 'маркер для быстрых ровных теней'], ['Белая гелевая ручка', 'ручка для белых бликов поверх тёмного'], ['Обратный приём', 'залить вокруг, ключевые детали оставить белыми'], ['Привычка скетчинга', 'несколько минут рисования каждый день']],
    fact: 'В 2009 году иллюстратор Джейк Паркер устроил себе челлендж: один рисунок тушью каждый день весь октябрь. Он назвал его Inktober — и теперь каждую осень миллионы людей по всему миру выкладывают свои ежедневные рисунки тушью.',
    test: [['Как использовать цвет в скетче тушью?', 'Одним акцентом, который становится центром интереса', 'Ровно раскрасить всё', 'Никогда не использовать', 'Одна яркая деталь громче десяти.'],
      ['Что даёт акварель ДО туши?', 'Свет и настроение; линии сверху, когда высохнет', 'Расплывшиеся линии', 'Ничего', 'Мягкая основа, чёткие линии сверху.'],
      ['Что проверить перед акварелью ПОСЛЕ туши?', 'Что тушь водостойкая и полностью высохла', 'Что бумага мокрая', 'Что перо новое', 'Иначе линии поплывут.'],
      ['Зачем белая гелевая ручка?', 'Блики поверх тёмного', 'Контуры', 'Стирать ошибки', 'Искра в глазу, отблеск на металле.'],
      ['Что такое обратный приём?', 'Залить вокруг, ключевые детали оставить белыми', 'Рисовать левой рукой', 'Перевернуть лист', 'Белая бумага — самый яркий цвет, береги её.'],
      ['Что больше всего помогает привычке?', 'Несколько минут каждый день в короткие паузы', 'Одно долгое занятие в месяц', 'Ждать вдохновения', 'Как утренний кофе.'],
      ['Как мерить прогресс?', 'Заполненными страницами и скетчбуками', 'Лайками', 'Дорогими материалами', 'Рука учится на страницах, а не на лайках.']],
    task: { h: 'Один акцент и белое', need: 'водостойкий линер, акварель или разбавленная тушь с кистью, серый маркер или белая гелевая ручка, если есть, бумага от 200 г/м²', time: '50 мин',
      steps: ['Скетч 1: небольшая композиция тушью. Выбери одну деталь и сделай её яркой — жёлтой, красной или оранжевой. Больше ничего цветом.', 'Скетч 2: что-то, где много предметов, — обувь в шкафу, банки на полке кофейни, открытый холодильник. Нарисуй подробно.', 'Выбери несколько предметов, которые останутся белыми. Всё вокруг них раскрась или залей.', 'Если есть: глубокие тени — серым маркером, блики — белой гелевой ручкой.', 'На той же странице запиши, какую тему из списка нарисуешь завтра.'] },
    client: { name: 'Гостина Грейви', job: 'шеф-призрак, которая двести лет помешивает один и тот же Вечный Суп', say: 'Дорогуша, он почти готов! Двести лет — почти! Устраиваю праздник, и мне нужна афиша. Суп, котёл, я с половником. Но послушай: я призрак, я белая, меня не надо раскрашивать. Раскрась кухню вокруг — пусть будет тёплой. И одна яркая вещь, только одна… морковка. И никаких зеркал на картинке, пожалуйста. Моё ворует сухарики.',
      ask: ['Афиша тушью с одним ярким акцентом', 'Цвет вокруг, призрак и пар — белые', 'Блики: белая бумага или белая гелевая ручка', 'Заголовок и дата праздника'] },
  },
  lv: {
    name: 'Jauktās tehnikas',
    intro: 'Pēdējā nodarbība. Tuša paliek pamats, bet tagad saucam draugus: vienu spilgtu krāsu, akvareļa laukumu, pelēku marķieri, baltu gēla pildspalvu. Un tad — pats svarīgākais visā kursā: kā turpināt, kad nodarbības beigušās.',
    goals: ['lietot krāsu kā akcentu, nevis izkrāsošanu', 'apvienot tušu ar akvareli, pelēku marķieri un baltu gēla pildspalvu', 'izmantot apgriezto paņēmienu: aizpildīt apkārt, galveno atstāt baltu', 'izveidot skicēšanas ieradumu, kas paliks pēc kursa'],
    th: `<h4>Krāsa — kā akcents</h4>
${F('p79-140.jpg', 'Bāka, kompass un taustekļi: viss ar melnu tušu — un viena oranža acs kompasa centrā')}
<p>Nav jāizkrāso viss. <b>Viena</b> spilgta detaļa — dzeltena, sarkana, oranža — tušas zīmējumā uzreiz kļūst par interešu centru. Pārējais paliek melnbalts un tikai padara to skaļāku.</p>
<h4>Tuša un tās draugi</h4>
${F('p79-142.jpg', 'Tušas līnijas, sarkanbrūns rāmis un viena oranža šalle: krāsa ved aci pa zīmējumu')}
<ul><li><b>Akvarelis pirms tušas</b> — vispirms maigs laukums, līnijas virsū, kad nožuvis: gaisma un noskaņa.</li>
<li><b>Akvarelis pēc tušas</b> — vispirms ūdensizturīga tuša, tad krāsa: līnijas paliek skaidras.</li>
<li><b>Pelēks marķieris</b> — ātras dziļas ēnas bez svītrojuma.</li>
<li><b>Balta gēla pildspalva</b> — atspīdumi virs tumšā: dzirkstele acī, atblāzma uz metāla, lietus.</li></ul>
<h4>Apgrieztais paņēmiens</h4>
${F('p80-144.jpg', 'Siena — ar akvareli, režģis — ar tušu: cilvēks ar grāmatu gandrīz balts, un acs uzreiz iet pie viņa')}
<p>Aizpildi fonu vai priekšmetu ar blīvu akvareli un <b>atstāj galvenās detaļas baltas</b>: atspīdumu acī, spārna izliekumu, grāmatas lappusi. Baltais papīrs ir spilgtākā krāsa, kas tev ir, — taupi to vissvarīgākajai vietai.</p>
<h4>Turpini</h4>
${F('p81-145.jpg', 'Traips nav beigas — tas ir nākamās lapas sākums')}
<ul><li>Skicēšana ir <b>ieradums</b> kā rīta kafija: dažas minūtes katru dienu ir labākas par vienu garu svētdienu.</li>
<li>Izmanto dienas īsās pauzes — rinda, tramvajs, tējkanna, kas vēl nav uzvārījusies.</li>
<li>Progresu mēri <b>piepildītās skiču burtnīcās</b>, nevis “patīk” skaitā.</li>
<li>Skiču burtnīca ir tikai papīrs. Tā izturēs visu. Beidz domāt — vienkārši sāc ķēpāt.</li></ul>
<h4>Desmit tēmas nākamajām lapām</h4>
${list('lv')}`,
    simple: 'Krāsa vislabāk strādā kā viens akcents; pārējais — tuša. Akvarelis pirms tušas — noskaņa, pēc — skaidras līnijas; pelēks marķieris — ātras ēnas; balta gēla — atspīdumi. Apgrieztais paņēmiens: aizpildīt apkārt, galveno atstāt baltu. Un tālāk vienkārši turpini: mazliet katru dienu, progress — piepildītās burtnīcās.',
    mist: [['Izkrāsot katru zīmējuma daļu.', 'Viens spilgts akcents; pārējais paliek melnbalts.'],
      ['Akvarelis virs neūdensizturīgas tušas — līnijas izplūst.', 'Pārbaudīt, ka tuša ir ūdensizturīga un sausa, vai laukumu likt pirmo.'],
      ['Aizkrāsot vietu, kurai jāmirdz.', 'Plānot balto: atstāt papīru galvenajam atspīdumam vai pievienot to ar baltu gēla pildspalvu.'],
      ['Gaidīt brīvu dienu, lai zīmētu “kā nākas”.', 'Zīmēt īsās pauzēs — pa dažām minūtēm katru dienu.'],
      ['Mērīt progresu ar “patīk”.', 'Skaitīt piepildītās lapas un burtnīcas.']],
    terms: [['Jauktā tehnika', 'tuša kopā ar citiem materiāliem: akvareli, marķieriem, gēla pildspalvām'], ['Krāsas akcents', 'viena spilgta detaļa, kas kļūst par interešu centru'], ['Ūdensizturīga tuša', 'tuša, kas neizplūst, ja nožuvusi un samirkst'], ['Pelēks marķieris', 'marķieris ātrām, vienmērīgām ēnām'], ['Balta gēla pildspalva', 'pildspalva baltiem atspīdumiem virs tumšā'], ['Apgrieztais paņēmiens', 'aizpildīt apkārt, galvenās detaļas atstāt baltas'], ['Skicēšanas ieradums', 'dažas minūtes zīmēšanas katru dienu']],
    fact: '2009. gadā ilustrators Džeiks Pārkers sev uzstādīja izaicinājumu: viens tušas zīmējums katru dienu visu oktobri. Viņš to nosauca par Inktober — un tagad katru rudeni miljoniem cilvēku visā pasaulē publicē savus ikdienas tušas zīmējumus.',
    test: [['Kā lietot krāsu tušas skicē?', 'Kā vienu akcentu, kas kļūst par interešu centru', 'Vienmērīgi izkrāsot visu', 'Nekad nelietot', 'Viena spilgta detaļa ir skaļāka par desmit.'],
      ['Ko dod akvarelis PIRMS tušas?', 'Gaismu un noskaņu; līnijas virsū, kad nožuvis', 'Izplūdušas līnijas', 'Neko', 'Maigs pamats, skaidras līnijas virsū.'],
      ['Kas jāpārbauda pirms akvareļa PĒC tušas?', 'Ka tuša ir ūdensizturīga un pilnīgi nožuvusi', 'Ka papīrs ir slapjš', 'Ka spalva ir jauna', 'Citādi līnijas izplūdīs.'],
      ['Kam vajag baltu gēla pildspalvu?', 'Atspīdumiem virs tumšā', 'Kontūriem', 'Kļūdu dzēšanai', 'Dzirkstele acī, atblāzma uz metāla.'],
      ['Kas ir apgrieztais paņēmiens?', 'Aizpildīt apkārt, galvenās detaļas atstāt baltas', 'Zīmēt ar kreiso roku', 'Apgriezt lapu', 'Baltais papīrs ir spilgtākā krāsa — taupi to.'],
      ['Kas visvairāk palīdz ieradumam?', 'Dažas minūtes katru dienu īsās pauzēs', 'Viena gara nodarbība mēnesī', 'Gaidīt iedvesmu', 'Kā rīta kafija.'],
      ['Kā mērīt progresu?', 'Piepildītās lapās un burtnīcās', 'Ar “patīk”', 'Dārgos materiālos', 'Roka mācās no lapām, nevis no “patīk”.']],
    task: { h: 'Viens akcents un baltais', need: 'ūdensizturīgs lainers, akvarelis vai atšķaidīta tuša ar otu, pelēks marķieris vai balta gēla pildspalva, ja ir, papīrs no 200 g/m²', time: '50 min',
      steps: ['1. skice: neliela kompozīcija ar tušu. Izvēlies vienu detaļu un padari to spilgtu — dzeltenu, sarkanu vai oranžu. Neko citu krāsā.', '2. skice: kaut kas ar daudziem priekšmetiem — apavi skapī, burkas kafejnīcas plauktā, atvērts ledusskapis. Uzzīmē detalizēti.', 'Izvēlies dažus priekšmetus, kas paliks balti. Visu ap tiem izkrāso vai aizpildi.', 'Ja ir: dziļas ēnas — ar pelēku marķieri, atspīdumi — ar baltu gēla pildspalvu.', 'Tajā pašā lapā pieraksti, kuru tēmu no saraksta zīmēsi rīt.'] },
    client: { name: 'Ghostina Gravy', job: 'spoku šefpavāre, kas divsimt gadus maisa vienu un to pašu Mūžīgo Zupu', say: 'Dārgumiņ, tā ir gandrīz gatava! Divsimt gadu — gandrīz! Rīkoju svētkus, un man vajag afišu. Zupa, katls, es ar smeļamo karoti. Bet klausies: es esmu spoks, es esmu balta, mani nevajag izkrāsot. Izkrāso virtuvi man apkārt — lai ir silta. Un viena spilgta lieta, tikai viena… burkāns. Un nekādu spoguļu attēlā, lūdzu. Manējais zog grauzdiņus.',
      ask: ['Afiša ar tušu un vienu spilgtu akcentu', 'Krāsa apkārt, spoks un tvaiks — balti', 'Atspīdumi: balts papīrs vai balta gēla pildspalva', 'Virsraksts un svētku datums'] },
  },
};
