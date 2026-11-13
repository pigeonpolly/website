// Курс туши, урок 13 — «Город» (книга «Ink Sketching», с. 69–72). Формат — worker/ink/index.js.
const F = (img, cap) => `<figure><img src="/images/ink/${img}" alt="" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
export default {
  icon: '⌂', card: 'autumn-cozy/80.png', cover: 'p80-144.jpg',
  en: {
    name: 'The city',
    intro: 'Streets, corners, wires, signs and a bench with a view. Today we learn how a city sketch differs from a landscape, how perspective really works without a ruler, and why the “ugly” details are what make a place alive.',
    goals: ['tell an urban sketch from a slow landscape and choose what to leave out', 'build a street with one vanishing point and a house corner with two', 'keep the spirit of a place: honest details, air in the distance, shadow as a wall'],
    th: `<p>People drew cities long before cameras. Eighteenth-century surveyors mapped streets by hand; Canaletto painted his famous Venice views with the help of a <b>camera obscura</b>; the Impressionists took their easels out into the boulevards. In 2007 the journalist and illustrator Gabriel Campanario started <b>Urban Sketchers</b> — today a worldwide movement with one idea: show the world one drawing at a time.</p>
<h4>A sketch, not a landscape</h4>
${F('p80-144.jpg', 'Calle 18, Mérida: a wall, a gate, a pot and a person reading on the pavement — a city sketch is a story of one moment')}
<ul><li>An urban sketch takes <b>10–30 minutes</b>, a landscape can take hours. You catch a moment: light, people, weather.</li>
<li>You are allowed to <b>leave things out</b> — parked cars, an advertising board — if they hide the spirit of the place. And you are allowed to keep the “ugly” things that make it real: wires, signs, a rubbish bin.</li>
<li>No time to go out? <b>Google Street View</b> is a good trainer: the light is frozen and you can choose any angle in any city.</li></ul>
<h4>Perspective: the horizon is your eyes</h4>
${F('p71-129.jpg', 'One-point (a box seen from the front), two-point (a corner), and aerial perspective: further away — smaller, lighter, fewer details')}
<ul><li>The <b>horizon</b> is always at the level of your eyes. Sit down — it goes down with you.</li>
<li><b>One-point</b>: you look straight down a street, a corridor, a tunnel. All lines going away meet in one point on the horizon; verticals stay vertical.</li>
<li><b>Two-point</b>: you look at the corner of a house. Each wall runs to its own point, both on the horizon, often outside the page.</li>
<li><b>Aerial</b>: the further, the smaller, the lighter, the fewer details. In ink it means thinner lines and more white in the distance.</li></ul>
<h4>Bent perspectives</h4>
${F('p72-131.jpg', 'Five-point “fish-eye” perspective: straight lines bend into curves around you')}
<ul><li><b>Three-point</b> — an ant’s or a bird’s view: verticals also run to a point above or below.</li>
<li><b>Fish-eye</b> — lines bend around you like in a spoon; good for a whole square in one picture.</li>
<li><b>Reverse</b> (as in old icons) and <b>multi-point panoramas</b> break the rules on purpose.</li>
<li><b>Flat perspective</b>: the city in tiers, like an old engraving — depth is replaced by textures and layers.</li></ul>
<h4>How to keep it alive</h4>
<p>Pick the <b>hero</b> — a door, a gate, a window with flowers — and give it the detail. One wall of a corner can be drawn carefully with the pen, the other turned into a solid <b>shadow</b>: the house becomes a block at once. Don’t let verticals fall over — a tilted wall reads as a mistake, a wobbly line doesn’t.</p>`,
    simple: 'A city sketch is a quick story of a place, 10–30 minutes. Leave out what hides its spirit, keep the honest details. The horizon is your eye level; straight down a street — one vanishing point, a corner — two, the distance — smaller and lighter. Choose a hero, keep verticals upright, turn one wall into shadow.',
    mist: [['Drawing every window and brick of the whole street.', 'Choose a hero, give it the detail; the rest is simple shapes.'],
      ['The horizon drawn wherever there is space on the page.', 'The horizon is your eye level — find it first.'],
      ['Walls leaning like a falling cupboard.', 'Keep verticals upright (unless you chose a three-point view on purpose).'],
      ['A “clean” postcard: no wires, signs or bins.', 'Keep the honest details — they make the place real.'],
      ['The distance as dark and detailed as the front.', 'Further away — thinner, lighter, fewer details.']],
    terms: [['Urban sketching', 'drawing on location in the city, in 10–30 minutes, as a story of one moment'], ['Horizon', 'the line at the level of your eyes'], ['Vanishing point', 'the point on the horizon where lines going away meet'], ['One-point perspective', 'a view straight down a street: one vanishing point'], ['Two-point perspective', 'a view of a corner: each wall has its own point'], ['Aerial perspective', 'further away — smaller, lighter, fewer details'], ['Fish-eye', 'a curved perspective where straight lines bend around you']],
    fact: 'Urban Sketchers began in November 2007 as an online photo group started by Gabriel Campanario, an illustrator at a Seattle newspaper. Today it has chapters in hundreds of cities, and its motto is “See the world one drawing at a time”.',
    test: [['How long does an urban sketch usually take?', '10–30 minutes', 'Several days', 'Exactly one minute', 'It catches a moment — light, people, weather.'],
      ['Where is the horizon?', 'At the level of your eyes', 'Always in the middle of the page', 'At the top of the tallest house', 'Sit down — the horizon goes down with you.'],
      ['You look straight down a long street. Which perspective?', 'One-point', 'Two-point', 'Reverse', 'All lines going away meet in one point.'],
      ['You look at the corner of a house. Which perspective?', 'Two-point: each wall runs to its own point', 'One-point', 'None — draw it flat', 'Two walls — two vanishing points on the horizon.'],
      ['How does aerial perspective look in ink?', 'Thinner lines, more white, fewer details in the distance', 'The darkest blacks in the distance', 'Everything equally detailed', 'Air softens what is far away.'],
      ['What can you leave out of a city sketch?', 'Things that hide the spirit of the place, like parked cars or ads', 'Nothing — it must be exact', 'All people and windows', 'A sketcher tells the story, not the inventory.'],
      ['How to make a corner house solid quickly?', 'Draw one wall carefully, turn the other into a solid shadow', 'Outline both walls with a ruler', 'Shade everything evenly', 'Light against shadow makes a block at once.']],
    task: { h: 'A street and a corner', need: 'a liner 0.3–0.5, a brush pen or black marker, a sketchbook, a street (or Street View)', time: '45 min',
      steps: ['Find your eye level and draw the horizon lightly.', 'Sketch 1 (15 min): a street, corridor or tunnel with one vanishing point. Keep the “ugly” details: wires, signs, a bin.', 'Sketch 2 (20 min): the corner of a house in two-point perspective. Draw one wall carefully with the pen; turn the other into a solid shadow.', 'Make the distance lighter: thinner lines, fewer details, more white.', 'Write where and when you drew it — street name, time, weather.'] },
    client: { name: 'Rusty Roamwell', job: 'a fox hiking guide who holds his map upside down and always ends up somewhere better', say: 'Right, so — I was leading a group to the Old Mill, and somehow we came out on a little street I’ve never seen. Crooked lamps, wires everywhere, a cat on a sign, a bench at the corner. Best place I’ve ever got lost in! I’m making a guide booklet of “places you find by accident”. Can you draw it so folk can find it too? Well… maybe.',
      ask: ['A street with one vanishing point', 'A corner house: one wall in detail, one in shadow', 'Honest details — wires, signs, a bench', 'Place and time written on the page'] },
  },
  ru: {
    name: 'Город',
    intro: 'Улицы, углы, провода, вывески и скамейка с видом. Сегодня — чем городской скетч отличается от пейзажа, как работает перспектива без линейки и почему именно «некрасивые» детали делают место живым.',
    goals: ['отличать городской скетч от долгого пейзажа и выбирать, что убрать', 'строить улицу с одной точкой схода и угол дома — с двумя', 'сохранять дух места: честные детали, воздух вдали, тень как стена'],
    th: `<p>Города рисовали задолго до фотоаппаратов. Топографы XVIII века зарисовывали улицы от руки; Каналетто писал свои знаменитые виды Венеции с помощью <b>камеры-обскуры</b>; импрессионисты выносили мольберты на бульвары. В 2007 году журналист и иллюстратор Габриэль Кампанарио основал <b>Urban Sketchers</b> — теперь это движение по всему миру с одной идеей: показывать мир по одному рисунку.</p>
<h4>Скетч, а не пейзаж</h4>
${F('p80-144.jpg', 'Калле 18, Мерида: стена, решётка, горшок и человек с книгой на тротуаре — городской скетч рассказывает об одном моменте')}
<ul><li>Городской скетч — это <b>10–30 минут</b>, пейзаж может занять часы. Ловишь момент: свет, людей, погоду.</li>
<li>Можно <b>убрать лишнее</b> — припаркованные машины, рекламный щит, — если они прячут дух места. И можно оставить «некрасивое», что делает его настоящим: провода, вывески, урну.</li>
<li>Нет времени выйти? <b>Google Street View</b> — хороший тренажёр: свет «заморожен», а ракурс можно выбрать в любом городе мира.</li></ul>
<h4>Перспектива: горизонт — это твои глаза</h4>
${F('p71-129.jpg', 'Одноточечная (коробка анфас), двухточечная (угол) и воздушная перспектива: дальше — меньше, светлее, меньше деталей')}
<ul><li><b>Горизонт</b> всегда на уровне глаз. Садишься — он опускается вместе с тобой.</li>
<li><b>Одноточечная</b>: смотришь прямо вдоль улицы, коридора, тоннеля. Все линии, уходящие вглубь, сходятся в одной точке на горизонте; вертикали остаются вертикальными.</li>
<li><b>Двухточечная</b>: смотришь на угол дома. Каждая стена бежит к своей точке, обе на горизонте, часто за краем листа.</li>
<li><b>Воздушная</b>: чем дальше, тем меньше, светлее и проще. В туши это тоньше линии и больше белого вдали.</li></ul>
<h4>Искажённые перспективы</h4>
${F('p72-131.jpg', 'Пятиточечная перспектива «рыбий глаз»: прямые линии изгибаются вокруг тебя')}
<ul><li><b>Трёхточечная</b> — взгляд муравья или птицы: вертикали тоже сходятся в точку сверху или снизу.</li>
<li><b>«Рыбий глаз»</b> — линии гнутся вокруг, как в ложке; хорошо для целой площади на одном листе.</li>
<li><b>Обратная</b> (как на старых иконах) и <b>многоточечные панорамы</b> нарочно ломают правила.</li>
<li><b>Плоская перспектива</b>: город ярусами, как на старой гравюре, — глубину заменяют фактуры и слои.</li></ul>
<h4>Как сохранить живость</h4>
<p>Выбери <b>героя</b> — дверь, решётку, окно с цветами — и отдай деталь ему. Одну стену угла можно подробно прорисовать пером, другую — превратить в сплошную <b>тень</b>: дом сразу становится объёмным. Не давай вертикалям падать — заваленная стена читается как ошибка, а дрожащая линия — нет.</p>`,
    simple: 'Городской скетч — быстрый рассказ о месте, 10–30 минут. Убери то, что прячет его дух, оставь честные детали. Горизонт — уровень глаз; вдоль улицы — одна точка схода, угол — две, даль — меньше и светлее. Выбери героя, держи вертикали, одну стену преврати в тень.',
    mist: [['Прорисовать каждое окно и кирпич всей улицы.', 'Выбрать героя и отдать деталь ему; остальное — простые формы.'],
      ['Горизонт там, где на листе нашлось место.', 'Горизонт — уровень глаз, его находят первым.'],
      ['Стены валятся, как падающий шкаф.', 'Держать вертикали (если это не нарочно выбранная трёхточечная).'],
      ['«Чистая» открытка: ни проводов, ни вывесок, ни урн.', 'Оставить честные детали — они делают место настоящим.'],
      ['Даль такая же тёмная и подробная, как передний план.', 'Дальше — тоньше, светлее, меньше деталей.']],
    terms: [['Городской скетч', 'рисунок с натуры в городе за 10–30 минут — рассказ об одном моменте'], ['Горизонт', 'линия на уровне глаз'], ['Точка схода', 'точка на горизонте, где сходятся линии, уходящие вглубь'], ['Одноточечная перспектива', 'взгляд прямо вдоль улицы: одна точка схода'], ['Двухточечная перспектива', 'взгляд на угол: у каждой стены своя точка'], ['Воздушная перспектива', 'дальше — меньше, светлее, меньше деталей'], ['«Рыбий глаз»', 'изогнутая перспектива, где прямые гнутся вокруг тебя']],
    fact: 'Urban Sketchers появились в ноябре 2007 года как онлайн-группа с фотографиями рисунков, которую создал Габриэль Кампанарио, иллюстратор сиэтлской газеты. Теперь у движения отделения в сотнях городов, а девиз — «Показывать мир по одному рисунку».',
    test: [['Сколько обычно длится городской скетч?', '10–30 минут', 'Несколько дней', 'Ровно минуту', 'Он ловит момент — свет, людей, погоду.'],
      ['Где горизонт?', 'На уровне глаз', 'Всегда посередине листа', 'По крыше самого высокого дома', 'Садишься — горизонт опускается вместе с тобой.'],
      ['Смотришь прямо вдоль длинной улицы. Какая перспектива?', 'Одноточечная', 'Двухточечная', 'Обратная', 'Все линии вглубь сходятся в одной точке.'],
      ['Смотришь на угол дома. Какая перспектива?', 'Двухточечная: каждая стена к своей точке', 'Одноточечная', 'Никакой — рисовать плоско', 'Две стены — две точки схода на горизонте.'],
      ['Как выглядит воздушная перспектива в туши?', 'Вдали тоньше линии, больше белого, меньше деталей', 'Вдали самое чёрное', 'Всё одинаково подробно', 'Воздух смягчает далёкое.'],
      ['Что можно убрать из городского скетча?', 'То, что прячет дух места: машины, рекламу', 'Ничего — всё должно быть точно', 'Всех людей и окна', 'Скетчер рассказывает историю, а не составляет опись.'],
      ['Как быстро сделать угловой дом объёмным?', 'Одну стену прорисовать, другую сделать сплошной тенью', 'Обвести обе стены по линейке', 'Заштриховать всё ровно', 'Свет против тени сразу даёт объём.']],
    task: { h: 'Улица и угол', need: 'линер 0,3–0,5, брашпен или чёрный маркер, скетчбук, улица (или Street View)', time: '45 мин',
      steps: ['Найди уровень глаз и легко проведи горизонт.', 'Скетч 1 (15 мин): улица, коридор или тоннель с одной точкой схода. Оставь «некрасивые» детали: провода, вывески, урну.', 'Скетч 2 (20 мин): угол дома в двухточечной перспективе. Одну стену подробно прорисуй пером, другую сделай сплошной тенью.', 'Сделай даль светлее: тоньше линии, меньше деталей, больше белого.', 'Подпиши, где и когда рисуешь: улица, время, погода.'] },
    client: { name: 'Расти Роумвелл', job: 'лис-экскурсовод, который держит карту вверх ногами и всегда попадает туда, где лучше', say: 'Значит, так — веду группу к Старой мельнице, и вдруг мы выходим на улочку, которой я в жизни не видел. Кривые фонари, провода повсюду, кот на вывеске, скамейка на углу. Лучшее место, где я когда-либо терялся! Делаю путеводитель «Места, которые находят случайно». Нарисуешь так, чтобы и другие её нашли? Ну… может быть.',
      ask: ['Улица с одной точкой схода', 'Угловой дом: одна стена подробно, другая в тени', 'Честные детали — провода, вывески, скамейка', 'Место и время подписаны на листе'] },
  },
  lv: {
    name: 'Pilsēta',
    intro: 'Ielas, stūri, vadi, izkārtnes un soliņš ar skatu. Šodien — ar ko pilsētas skice atšķiras no ainavas, kā perspektīva darbojas bez lineāla un kāpēc tieši “neglītās” detaļas padara vietu dzīvu.',
    goals: ['atšķirt pilsētas skici no ilgas ainavas un izvēlēties, ko atmest', 'būvēt ielu ar vienu nozuduma punktu un mājas stūri — ar diviem', 'saglabāt vietas garu: godīgas detaļas, gaiss tālumā, ēna kā siena'],
    th: `<p>Pilsētas zīmēja ilgi pirms fotoaparātiem. 18. gadsimta topogrāfi ielas zīmēja ar roku; Kanaleto gleznoja savus slavenos Venēcijas skatus ar <b>camera obscura</b> palīdzību; impresionisti iznesa molbertus uz bulvāriem. 2007. gadā žurnālists un ilustrators Gabriels Kampanario nodibināja <b>Urban Sketchers</b> — tagad tā ir kustība visā pasaulē ar vienu ideju: rādīt pasauli pa vienam zīmējumam.</p>
<h4>Skice, nevis ainava</h4>
${F('p80-144.jpg', 'Calle 18, Merida: siena, režģis, pods un cilvēks ar grāmatu uz ietves — pilsētas skice stāsta par vienu mirkli')}
<ul><li>Pilsētas skice ir <b>10–30 minūtes</b>, ainava var aizņemt stundas. Tu noķer mirkli: gaismu, cilvēkus, laikapstākļus.</li>
<li>Drīkst <b>atmest lieko</b> — novietotas mašīnas, reklāmas stendu —, ja tie slēpj vietas garu. Un drīkst atstāt “neglīto”, kas padara to īstu: vadus, izkārtnes, atkritumu tvertni.</li>
<li>Nav laika iziet? <b>Google Street View</b> ir labs trenažieris: gaisma ir “sasaldēta”, bet skatu punktu var izvēlēties jebkurā pasaules pilsētā.</li></ul>
<h4>Perspektīva: horizonts ir tavas acis</h4>
${F('p71-129.jpg', 'Viena punkta (kaste no priekšpuses), divu punktu (stūris) un gaisa perspektīva: tālāk — mazāks, gaišāks, mazāk detaļu')}
<ul><li><b>Horizonts</b> vienmēr ir acu līmenī. Apsēdies — tas nolaižas līdz ar tevi.</li>
<li><b>Viena punkta</b>: skaties taisni gar ielu, gaiteni, tuneli. Visas līnijas, kas aiziet dziļumā, satiekas vienā punktā uz horizonta; vertikāles paliek vertikālas.</li>
<li><b>Divu punktu</b>: skaties uz mājas stūri. Katra siena skrien uz savu punktu, abi uz horizonta, bieži aiz lapas malas.</li>
<li><b>Gaisa</b>: jo tālāk, jo mazāks, gaišāks un vienkāršāks. Tušā tas nozīmē tievākas līnijas un vairāk baltā tālumā.</li></ul>
<h4>Izliektās perspektīvas</h4>
${F('p72-131.jpg', 'Piecu punktu perspektīva “zivs acs”: taisnas līnijas izliecas ap tevi')}
<ul><li><b>Trīs punktu</b> — skudras vai putna skats: arī vertikāles satiekas punktā augšā vai lejā.</li>
<li><b>“Zivs acs”</b> — līnijas liecas ap tevi kā karotē; der visam laukumam vienā lapā.</li>
<li><b>Apgrieztā</b> (kā senās ikonās) un <b>daudzpunktu panorāmas</b> noteikumus lauž apzināti.</li>
<li><b>Plakanā perspektīva</b>: pilsēta stāvos kā sena gravīrā — dziļumu aizstāj faktūras un slāņi.</li></ul>
<h4>Kā saglabāt dzīvīgumu</h4>
<p>Izvēlies <b>varoni</b> — durvis, režģi, logu ar puķēm — un atdod detaļas tam. Vienu stūra sienu var rūpīgi uzzīmēt ar spalvu, otru — pārvērst vienlaidu <b>ēnā</b>: māja uzreiz kļūst apjomīga. Neļauj vertikālēm krist — sašķiebta siena izskatās pēc kļūdas, bet trīcoša līnija — ne.</p>`,
    simple: 'Pilsētas skice ir ātrs stāsts par vietu, 10–30 minūtes. Atmet to, kas slēpj tās garu, atstāj godīgās detaļas. Horizonts ir acu līmenis; gar ielu — viens nozuduma punkts, stūris — divi, tālums — mazāks un gaišāks. Izvēlies varoni, turi vertikāles, vienu sienu pārvērt ēnā.',
    mist: [['Uzzīmēt katru visas ielas logu un ķieģeli.', 'Izvēlēties varoni un atdot detaļas tam; pārējais — vienkāršas formas.'],
      ['Horizonts tur, kur lapā atradās vieta.', 'Horizonts ir acu līmenis, to atrod pirmo.'],
      ['Sienas gāžas kā krītošs skapis.', 'Turēt vertikāles (ja vien trīs punktu skats nav izvēlēts apzināti).'],
      ['“Tīra” pastkarte: ne vadu, ne izkārtņu, ne tvertņu.', 'Atstāt godīgās detaļas — tās padara vietu īstu.'],
      ['Tālums tikpat tumšs un detalizēts kā priekšplāns.', 'Tālāk — tievāk, gaišāk, mazāk detaļu.']],
    terms: [['Pilsētas skice', 'zīmējums no dabas pilsētā 10–30 minūtēs — stāsts par vienu mirkli'], ['Horizonts', 'līnija acu līmenī'], ['Nozuduma punkts', 'punkts uz horizonta, kur satiekas dziļumā ejošās līnijas'], ['Viena punkta perspektīva', 'skats taisni gar ielu: viens nozuduma punkts'], ['Divu punktu perspektīva', 'skats uz stūri: katrai sienai savs punkts'], ['Gaisa perspektīva', 'tālāk — mazāks, gaišāks, mazāk detaļu'], ['“Zivs acs”', 'izliekta perspektīva, kur taisnes liecas ap tevi']],
    fact: 'Urban Sketchers sākās 2007. gada novembrī kā tiešsaistes grupa ar zīmējumu fotogrāfijām, ko izveidoja Gabriels Kampanario, Sietlas laikraksta ilustrators. Tagad kustībai ir nodaļas simtiem pilsētu, un tās moto ir “Rādīt pasauli pa vienam zīmējumam”.',
    test: [['Cik ilgi parasti top pilsētas skice?', '10–30 minūtes', 'Vairākas dienas', 'Tieši minūti', 'Tā noķer mirkli — gaismu, cilvēkus, laikapstākļus.'],
      ['Kur ir horizonts?', 'Acu līmenī', 'Vienmēr lapas vidū', 'Pa augstākās mājas jumtu', 'Apsēdies — horizonts nolaižas līdz ar tevi.'],
      ['Skaties taisni gar garu ielu. Kāda perspektīva?', 'Viena punkta', 'Divu punktu', 'Apgrieztā', 'Visas līnijas dziļumā satiekas vienā punktā.'],
      ['Skaties uz mājas stūri. Kāda perspektīva?', 'Divu punktu: katra siena uz savu punktu', 'Viena punkta', 'Nekāda — zīmēt plakani', 'Divas sienas — divi nozuduma punkti uz horizonta.'],
      ['Kā tušā izskatās gaisa perspektīva?', 'Tālumā tievākas līnijas, vairāk baltā, mazāk detaļu', 'Tālumā tumšākais melnais', 'Viss vienlīdz detalizēts', 'Gaiss mīkstina tālo.'],
      ['Ko drīkst atmest pilsētas skicē?', 'To, kas slēpj vietas garu: mašīnas, reklāmas', 'Neko — visam jābūt precīzi', 'Visus cilvēkus un logus', 'Skicētājs stāsta stāstu, nevis sastāda inventāru.'],
      ['Kā ātri padarīt stūra māju apjomīgu?', 'Vienu sienu izzīmēt, otru pārvērst vienlaidu ēnā', 'Abas sienas apvilkt pēc lineāla', 'Visu vienmērīgi nosvītrot', 'Gaisma pret ēnu uzreiz dod apjomu.']],
    task: { h: 'Iela un stūris', need: 'lainers 0,3–0,5, otas pildspalva vai melns marķieris, skiču burtnīca, iela (vai Street View)', time: '45 min',
      steps: ['Atrodi acu līmeni un viegli novelc horizontu.', '1. skice (15 min): iela, gaitenis vai tunelis ar vienu nozuduma punktu. Atstāj “neglītās” detaļas: vadus, izkārtnes, tvertni.', '2. skice (20 min): mājas stūris divu punktu perspektīvā. Vienu sienu rūpīgi izzīmē ar spalvu, otru pārvērt vienlaidu ēnā.', 'Padari tālumu gaišāku: tievākas līnijas, mazāk detaļu, vairāk baltā.', 'Paraksti, kur un kad zīmē: iela, laiks, laikapstākļi.'] },
    client: { name: 'Rusty Roamwell', job: 'lapsa gids, kas tur karti otrādi un vienmēr nonāk tur, kur ir labāk', say: 'Tātad — vedu grupu uz Veco dzirnavu, un pēkšņi mēs iznākam ieliņā, kādu mūžā neesmu redzējis. Šķības laternas, vadi visur, kaķis uz izkārtnes, soliņš uz stūra. Labākā vieta, kur jebkad esmu apmaldījies! Taisu ceļvedi “Vietas, ko atrod nejauši”. Uzzīmēsi tā, lai arī citi to atrastu? Nu… varbūt.',
      ask: ['Iela ar vienu nozuduma punktu', 'Stūra māja: viena siena detalizēti, otra ēnā', 'Godīgas detaļas — vadi, izkārtnes, soliņš', 'Vieta un laiks parakstīti lapā'] },
  },
};
