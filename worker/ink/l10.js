// Курс туши, урок 10 — «От чашек до стульев» (книга «Ink Sketching», с. 54–58). Формат — worker/ink/index.js.
const F = (img, cap) => `<figure><img src="/images/ink/${img}" alt="" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
export default {
  icon: '☕', card: 'halloween-remix/63.png', cover: 'p54-106.jpg',
  en: {
    name: 'From cups to chairs',
    intro: 'A teapot, a bottle, a chair — any object hides a cube, a cylinder or a ball. Learn to see the box inside things, draw them “made of glass”, catch an ellipse in the air — and put the object firmly on the table with one dark line.',
    goals: ['find the simple shape inside any object', 'draw through the object and build ellipses without a ruler', 'stand an object on the table with a contact shadow and group several objects'],
    th: `<p>Under every object there is a <b>simple shape</b>: a cube, a cylinder, a ball, a cone. Turn on your “X-ray vision” and ask: what box would this thing fit into? A teapot is a ball plus a cylinder spout plus a cone lid. A chair is a cube with legs.</p>
${F('p54-104.jpg', 'The alphabet of drawing: a circle, a square, a triangle, a dot and a line')}
${F('p54-106.jpg', 'One shape — many things: a block becomes a bottle, a cup, a leg; a circle — an apple, a face, a sleeping cat, a frying pan; a square — a TV, a book, a phone')}
<h4>Draw through, as if it’s glass</h4>
<p>Draw the hidden parts too: the back leg of the chair, the whole ellipse of the bottom of a glass — with light <b>construction lines</b>. Then go over what you really see, more confidently. The construction stays as a quiet trace and makes the object believable.</p>
<h4>Ellipses</h4>
${F('p55-108.jpg', 'An ellipse is a circle in perspective: no corners, the short axis is perpendicular to the object’s axis; the further from eye level, the rounder')}
<ul><li>An ellipse has <b>no corners</b> — not a lemon, not a rectangle with round ends.</li>
<li>Its short axis lies along the axis of the object (a glass standing up — the short axis is vertical).</li>
<li>The further from eye level, the rounder: the bottom of a glass is “fatter” than its rim.</li></ul>
<h4>Without a ruler</h4>
<ul><li><b>Ghost axis</b>: two dots or a dotted line — the object’s spine.</li>
<li><b>Mirror sweep</b>: draw the left contour and immediately the right one, while your hand remembers the movement.</li>
<li><b>Catch the ellipse in the air</b>: circle over the paper first, then touch it and go round 2–3 times.</li>
<li>One bold curve is better than a timid “hairy” one made of short pieces.</li></ul>
<h4>Put it on the table</h4>
${F('p57-116.jpg', 'Same balloon: without a shadow it flies, with a dark contact shadow it lies on the floor')}
<p>The <b>contact shadow</b> is the darkest line right under the bottom, thicker where the object rests. Add a couple of horizontal strokes of cast shadow; under chair legs — a tiny ellipse or a dot. Without it the object floats.</p>
<h4>Groups</h4>
<p>Overlap objects: the near one is the “hero” — thicker line, more detail; the far one is thinner, and its lines stop where the hero covers it. The hero’s shadow can fall on its neighbour — that ties them together.</p>`,
    simple: 'Find the cube, cylinder or ball inside every object. Draw through it lightly, as if it’s glass, then go over what you see. Ellipses have no corners and get rounder further from eye level. A dark contact shadow under the bottom puts the object on the table. In a group the near object is the hero.',
    mist: [['Drawing the outline straight away, detail by detail.', 'First the simple shape (box, cylinder, ball), then refine.'],
      ['An ellipse with pointed ends, like a lemon.', 'An ellipse is round all the way — no corners.'],
      ['The bottom of a glass as flat as its rim.', 'Further from eye level — rounder: the bottom is fatter.'],
      ['The object hangs in the air.', 'A dark contact line under it, thicker at the points of support.'],
      ['All objects in a group drawn the same.', 'One hero — thicker and more detailed; the rest thinner, lines stop at the overlap.']],
    terms: [['Primitive', 'a simple shape inside an object: cube, cylinder, ball, cone'], ['Drawing through', 'drawing hidden parts lightly, as if the object were glass'], ['Construction lines', 'light lines of the skeleton that stay as a quiet trace'], ['Ellipse', 'a circle in perspective'], ['Ghost axis', 'two dots or a dotted line marking the object’s spine'], ['Contact shadow', 'the darkest line where the object touches the surface'], ['Overlap', 'one object covering another — the simplest sign of depth']],
    fact: 'Thonet chair No. 14 (1859) is made of just six pieces of steam-bent wood, ten screws and two nuts. By 1930 about 50 million had been sold — it’s still called the “café chair”, and you’ve probably sat on one.',
    test: [['What do you look for first in any object?', 'The simple shape inside it: cube, cylinder, ball', 'The smallest detail', 'The shadow', 'The simple shape is the skeleton everything else hangs on.'],
      ['What does “drawing through” mean?', 'Lightly drawing the hidden parts, as if the object were glass', 'Erasing the back of the object', 'Tracing a photo', 'Hidden parts make the visible ones believable.'],
      ['What is an ellipse?', 'A circle in perspective, without corners', 'An oval with two sharp ends', 'A squashed rectangle', 'An ellipse is round all the way round.'],
      ['Which is rounder: the rim or the bottom of a standing glass (seen from above)?', 'The bottom — it’s further from eye level', 'The rim', 'They are the same', 'The further from eye level, the rounder the ellipse.'],
      ['How to draw a symmetrical bottle without a ruler?', 'A ghost axis and a mirror sweep: left contour, then right at once', 'Draw one half very slowly', 'Trace a ruler', 'Your hand remembers the movement and repeats it mirrored.'],
      ['What stands an object on the table?', 'A dark contact shadow right under the bottom', 'A thick outline all round', 'A light grey wash', 'Without contact shadow the object floats.'],
      ['How do you show which object in a group is closer?', 'Overlap; the near one has a thicker line and more detail', 'Draw the far one bigger', 'Use the same line for all', 'The hero leads; the far lines stop at the overlap.']],
    task: { h: 'X-ray and contact', need: 'a liner, a pencil (optional), a sketchbook page', time: '30 min',
      steps: ['Choose three complicated objects at home (a teapot, a chair, a lamp, a kettle).', 'Draw each only with simple shapes — boxes, cylinders, balls, cones — through, as if it’s glass.', 'Refine: go over the visible contour more confidently, keep the construction light.', 'Draw one more object twice: with a contact shadow and without. It can be absurd — a house, an elephant, a boot, a piece of cheese.', 'Compare: which one stands, which one floats?'] },
    client: { name: 'Madame Teabite', job: 'a spider tea sommelier with eight legs and eight teacups', say: 'Darling, my tea salon needs a new menu, and the menu needs pictures. A teapot, eight cups, a sugar bowl, and the chair where guests sit — but they must stand properly! Last artist drew my cups floating in the air. The oolong spilled on paper. Unforgivable.',
      ask: ['A teapot and at least three cups built from simple shapes', 'Round ellipses, no lemons', 'A contact shadow under every object', 'A chair with the back leg drawn through'] },
  },
  ru: {
    name: 'От чашек до стульев',
    intro: 'Чайник, бутылка, стул — в любом предмете прячется куб, цилиндр или шар. Научимся видеть коробку внутри вещей, рисовать их «из стекла», ловить эллипс в воздухе — и ставить предмет на стол одной тёмной линией.',
    goals: ['находить простую фигуру внутри любого предмета', 'рисовать предмет насквозь и строить эллипсы без линейки', 'ставить предмет на стол контактной тенью и собирать группу предметов'],
    th: `<p>Под любой вещью есть <b>простая фигура</b>: куб, цилиндр, шар, конус. Включи «рентгеновское зрение» и спроси: в какую коробку поместится эта вещь? Чайник — шар плюс цилиндр-носик плюс конус-крышка. Стул — куб на ножках.</p>
${F('p54-104.jpg', 'Азбука рисунка: круг, квадрат, треугольник, точка и линия')}
${F('p54-106.jpg', 'Одна фигура — много вещей: брусок становится бутылкой, чашкой, ногой; круг — яблоком, лицом, спящим котом, сковородкой; квадрат — телевизором, книгой, телефоном')}
<h4>Насквозь, как из стекла</h4>
<p>Рисуй и спрятанное: заднюю ножку стула, полный эллипс дна стакана — лёгкими <b>строительными линиями</b>. Потом обведи то, что правда видно, увереннее. Построение остаётся тихим следом и делает предмет убедительным.</p>
<h4>Эллипсы</h4>
${F('p55-108.jpg', 'Эллипс — круг в перспективе: без углов, малая ось перпендикулярна оси предмета; чем дальше от уровня глаз, тем круглее')}
<ul><li>У эллипса <b>нет углов</b> — не лимон и не прямоугольник со скруглёнными концами.</li>
<li>Его малая ось лежит вдоль оси предмета (стакан стоит — малая ось вертикальная).</li>
<li>Чем дальше от уровня глаз, тем круглее: дно стакана «толще» его края.</li></ul>
<h4>Без линейки</h4>
<ul><li><b>Призрачная ось</b>: две точки или пунктир — позвоночник предмета.</li>
<li><b>Зеркальный взмах</b>: левый контур — и сразу правый, пока рука помнит движение.</li>
<li><b>Поймай эллипс в воздухе</b>: сначала покружи над бумагой, потом коснись и пройди 2–3 раза.</li>
<li>Одна смелая кривая лучше робкой «волосатой» из коротких кусочков.</li></ul>
<h4>Поставь на стол</h4>
${F('p57-116.jpg', 'Один и тот же шарик: без тени он летит, с тёмной контактной тенью — лежит на полу')}
<p><b>Контактная тень</b> — самая тёмная линия прямо под дном, толще там, где предмет опирается. Добавь пару горизонтальных штрихов падающей тени; под ножками стула — крошечный эллипс или точку. Без неё предмет парит.</p>
<h4>Группы</h4>
<p>Перекрывай предметы: ближний — «герой», линия толще, деталей больше; дальний тоньше, и его линии обрываются там, где его закрывает герой. Тень героя может упасть на соседа — это связывает их вместе.</p>`,
    simple: 'Найди в каждом предмете куб, цилиндр или шар. Нарисуй насквозь, легко, как из стекла, потом обведи видимое. У эллипса нет углов, и чем дальше от уровня глаз, тем он круглее. Тёмная контактная тень под дном ставит предмет на стол. В группе ближний предмет — герой.',
    mist: [['Сразу контур, деталь за деталью.', 'Сначала простая фигура (коробка, цилиндр, шар), потом уточнять.'],
      ['Эллипс с острыми концами, как лимон.', 'Эллипс круглый на всём пути — без углов.'],
      ['Дно стакана такое же плоское, как край.', 'Дальше от уровня глаз — круглее: дно толще.'],
      ['Предмет висит в воздухе.', 'Тёмная контактная линия под ним, толще в точках опоры.'],
      ['Все предметы группы нарисованы одинаково.', 'Один герой — толще и подробнее; остальные тоньше, линии обрываются у перекрытия.']],
    terms: [['Примитив', 'простая фигура внутри предмета: куб, цилиндр, шар, конус'], ['Рисовать насквозь', 'легко рисовать спрятанные части, как будто предмет из стекла'], ['Строительные линии', 'лёгкие линии каркаса, которые остаются тихим следом'], ['Эллипс', 'круг в перспективе'], ['Призрачная ось', 'две точки или пунктир — позвоночник предмета'], ['Контактная тень', 'самая тёмная линия там, где предмет касается поверхности'], ['Перекрытие', 'один предмет закрывает другой — самый простой знак глубины']],
    fact: 'Венский стул Тонета № 14 (1859) собирается всего из шести деталей гнутого паром дерева, десяти винтов и двух гаек. К 1930 году их продали около 50 миллионов — его до сих пор зовут «стулом для кафе», и почти наверняка тебе доводилось на нём сидеть.',
    test: [['Что искать в предмете первым?', 'Простую фигуру внутри: куб, цилиндр, шар', 'Самую мелкую деталь', 'Тень', 'Простая фигура — каркас, на котором держится всё остальное.'],
      ['Что значит «рисовать насквозь»?', 'Легко рисовать спрятанные части, как будто предмет из стекла', 'Стирать заднюю часть предмета', 'Обводить фотографию', 'Спрятанное делает видимое убедительным.'],
      ['Что такое эллипс?', 'Круг в перспективе, без углов', 'Овал с двумя острыми концами', 'Сплющенный прямоугольник', 'Эллипс круглый на всём пути.'],
      ['Что круглее у стоящего стакана (смотрим сверху): край или дно?', 'Дно — оно дальше от уровня глаз', 'Край', 'Одинаково', 'Чем дальше от уровня глаз, тем круглее эллипс.'],
      ['Как нарисовать симметричную бутылку без линейки?', 'Призрачная ось и зеркальный взмах: левый контур, сразу правый', 'Очень медленно одну половину', 'Обвести линейку', 'Рука помнит движение и повторяет его зеркально.'],
      ['Что ставит предмет на стол?', 'Тёмная контактная тень прямо под дном', 'Толстый контур вокруг', 'Светлая серая заливка', 'Без контактной тени предмет парит.'],
      ['Как показать, какой предмет в группе ближе?', 'Перекрытие; у ближнего линия толще и деталей больше', 'Дальний нарисовать крупнее', 'Одной линией все', 'Герой ведёт; линии дальнего обрываются у перекрытия.']],
    task: { h: 'Рентген и контакт', need: 'линер, карандаш (по желанию), страница скетчбука', time: '30 мин',
      steps: ['Выбери дома три сложных предмета (чайник, стул, лампа, электрочайник).', 'Нарисуй каждый только простыми фигурами — коробки, цилиндры, шары, конусы — насквозь, как из стекла.', 'Уточни: видимый контур обведи увереннее, построение оставь лёгким.', 'Ещё один предмет нарисуй дважды: с контактной тенью и без. Можно абсурдный — дом, слон, ботинок, кусок сыра.', 'Сравни: какой стоит, а какой парит?'] },
    client: { name: 'Мадам Тибайт', job: 'паучиха-сомелье чая с восемью лапками и восемью чашками', say: 'Дорогуша, моему чайному салону нужно новое меню, а меню нужны картинки. Чайник, восемь чашек, сахарница и стул, на котором сидят гости, — но они должны стоять как следует! Прошлый художник нарисовал мои чашки парящими в воздухе. Улун пролился на бумагу. Непростительно.',
      ask: ['Чайник и минимум три чашки из простых фигур', 'Круглые эллипсы, без лимонов', 'Контактная тень под каждым предметом', 'Стул, у которого задняя ножка нарисована насквозь'] },
  },
  lv: {
    name: 'No krūzēm līdz krēsliem',
    intro: 'Tējkanna, pudele, krēsls — jebkurā priekšmetā slēpjas kubs, cilindrs vai lode. Iemācīsimies redzēt kasti lietu iekšpusē, zīmēt tās “no stikla”, noķert elipsi gaisā — un nolikt priekšmetu uz galda ar vienu tumšu līniju.',
    goals: ['atrast vienkāršo formu jebkura priekšmeta iekšpusē', 'zīmēt priekšmetu cauri un veidot elipses bez lineāla', 'nostādīt priekšmetu uz galda ar kontakta ēnu un sakārtot priekšmetu grupu'],
    th: `<p>Zem katras lietas ir <b>vienkārša forma</b>: kubs, cilindrs, lode, konuss. Ieslēdz “rentgena redzi” un pajautā: kādā kastē šī lieta ietilptu? Tējkanna — lode plus cilindrs-snīpis plus konuss-vāciņš. Krēsls — kubs uz kājām.</p>
${F('p54-104.jpg', 'Zīmēšanas ābece: aplis, kvadrāts, trīsstūris, punkts un līnija')}
${F('p54-106.jpg', 'Viena forma — daudz lietu: klucītis kļūst par pudeli, krūzi, kāju; aplis — par ābolu, seju, guļošu kaķi, pannu; kvadrāts — par televizoru, grāmatu, telefonu')}
<h4>Cauri, kā no stikla</h4>
<p>Zīmē arī apslēpto: krēsla aizmugurējo kāju, pilnu glāzes dibena elipsi — ar vieglām <b>būvlīnijām</b>. Pēc tam pārliecinātāk apvelc to, kas tiešām redzams. Konstrukcija paliek kā kluss pēds un padara priekšmetu ticamu.</p>
<h4>Elipses</h4>
${F('p55-108.jpg', 'Elipse ir aplis perspektīvā: bez stūriem, mazā ass perpendikulāra priekšmeta asij; jo tālāk no acu līmeņa, jo apaļāka')}
<ul><li>Elipsei <b>nav stūru</b> — tā nav citrons un nav taisnstūris ar noapaļotiem galiem.</li>
<li>Tās mazā ass iet pa priekšmeta asi (glāze stāv — mazā ass vertikāla).</li>
<li>Jo tālāk no acu līmeņa, jo apaļāka: glāzes dibens ir “resnāks” par malu.</li></ul>
<h4>Bez lineāla</h4>
<ul><li><b>Spoku ass</b>: divi punkti vai raustīta līnija — priekšmeta mugurkauls.</li>
<li><b>Spoguļa vēziens</b>: kreisais kontūrs — un uzreiz labais, kamēr roka atceras kustību.</li>
<li><b>Noķer elipsi gaisā</b>: vispirms paapļo virs papīra, tad pieskaries un izej 2–3 reizes.</li>
<li>Viena drosmīga līkne ir labāka par bikli “matainu” līniju no īsiem gabaliņiem.</li></ul>
<h4>Noliec uz galda</h4>
${F('p57-116.jpg', 'Tas pats balons: bez ēnas tas lido, ar tumšu kontakta ēnu — guļ uz grīdas')}
<p><b>Kontakta ēna</b> ir tumšākā līnija tieši zem dibena, resnāka tur, kur priekšmets balstās. Pieliec pāris horizontālu krītošās ēnas svītru; zem krēsla kājām — mazītiņu elipsi vai punktu. Bez tās priekšmets lidinās.</p>
<h4>Grupas</h4>
<p>Pārklāj priekšmetus: tuvākais ir “varonis” — līnija resnāka, detaļu vairāk; tālākais plānāks, un tā līnijas pārtrūkst tur, kur to aizsedz varonis. Varoņa ēna var krist uz kaimiņu — tas viņus sasaista.</p>`,
    simple: 'Atrodi katrā priekšmetā kubu, cilindru vai lodi. Uzzīmē cauri, viegli, kā no stikla, tad apvelc redzamo. Elipsei nav stūru, un jo tālāk no acu līmeņa, jo tā apaļāka. Tumša kontakta ēna zem dibena noliek priekšmetu uz galda. Grupā tuvākais priekšmets ir varonis.',
    mist: [['Uzreiz kontūrs, detaļa pēc detaļas.', 'Vispirms vienkārša forma (kaste, cilindrs, lode), tad precizēt.'],
      ['Elipse ar asiem galiem, kā citrons.', 'Elipse ir apaļa visā garumā — bez stūriem.'],
      ['Glāzes dibens tikpat plakans kā mala.', 'Tālāk no acu līmeņa — apaļāks: dibens resnāks.'],
      ['Priekšmets karājas gaisā.', 'Tumša kontakta līnija zem tā, resnāka balsta punktos.'],
      ['Visi grupas priekšmeti zīmēti vienādi.', 'Viens varonis — resnāks un detalizētāks; pārējie plānāki, līnijas pārtrūkst pie pārklājuma.']],
    terms: [['Primitīvs', 'vienkārša forma priekšmeta iekšpusē: kubs, cilindrs, lode, konuss'], ['Zīmēt cauri', 'viegli zīmēt apslēptās daļas, it kā priekšmets būtu no stikla'], ['Būvlīnijas', 'vieglas karkasa līnijas, kas paliek kā kluss pēds'], ['Elipse', 'aplis perspektīvā'], ['Spoku ass', 'divi punkti vai raustīta līnija — priekšmeta mugurkauls'], ['Kontakta ēna', 'tumšākā līnija tur, kur priekšmets pieskaras virsmai'], ['Pārklājums', 'viens priekšmets aizsedz otru — vienkāršākā dziļuma zīme']],
    fact: 'Toneta krēsls Nr. 14 (1859) sastāv tikai no sešām ar tvaiku liektām koka detaļām, desmit skrūvēm un diviem uzgriežņiem. Līdz 1930. gadam to pārdeva ap 50 miljoniem — to joprojām sauc par “kafejnīcas krēslu”, un tev, visticamāk, uz tāda ir nācies sēdēt.',
    test: [['Ko priekšmetā meklēt vispirms?', 'Vienkāršo formu iekšpusē: kubu, cilindru, lodi', 'Sīkāko detaļu', 'Ēnu', 'Vienkāršā forma ir karkass, uz kura turas viss pārējais.'],
      ['Ko nozīmē “zīmēt cauri”?', 'Viegli zīmēt apslēptās daļas, it kā priekšmets būtu no stikla', 'Izdzēst priekšmeta aizmuguri', 'Apvilkt fotogrāfiju', 'Apslēptais padara redzamo ticamu.'],
      ['Kas ir elipse?', 'Aplis perspektīvā, bez stūriem', 'Ovāls ar diviem asiem galiem', 'Saplacināts taisnstūris', 'Elipse ir apaļa visā garumā.'],
      ['Kas stāvošai glāzei (skatoties no augšas) ir apaļāks: mala vai dibens?', 'Dibens — tas ir tālāk no acu līmeņa', 'Mala', 'Vienādi', 'Jo tālāk no acu līmeņa, jo apaļāka elipse.'],
      ['Kā uzzīmēt simetrisku pudeli bez lineāla?', 'Spoku ass un spoguļa vēziens: kreisais kontūrs, uzreiz labais', 'Ļoti lēni vienu pusi', 'Apvilkt lineālu', 'Roka atceras kustību un atkārto to spoguļattēlā.'],
      ['Kas noliek priekšmetu uz galda?', 'Tumša kontakta ēna tieši zem dibena', 'Resns kontūrs visapkārt', 'Gaišs pelēks laukums', 'Bez kontakta ēnas priekšmets lidinās.'],
      ['Kā parādīt, kurš grupas priekšmets ir tuvāk?', 'Pārklājums; tuvākajam līnija resnāka un detaļu vairāk', 'Tālāko zīmēt lielāku', 'Visus ar vienu līniju', 'Varonis vada; tālākā līnijas pārtrūkst pie pārklājuma.']],
    task: { h: 'Rentgens un kontakts', need: 'lainers, zīmulis (pēc vēlēšanās), skiču burtnīcas lapa', time: '30 min',
      steps: ['Izvēlies mājās trīs sarežģītus priekšmetus (tējkannu, krēslu, lampu, elektrisko tējkannu).', 'Uzzīmē katru tikai ar vienkāršām formām — kastēm, cilindriem, lodēm, konusiem — cauri, kā no stikla.', 'Precizē: redzamo kontūru apvelc pārliecinātāk, konstrukciju atstāj vieglu.', 'Vēl vienu priekšmetu uzzīmē divreiz: ar kontakta ēnu un bez. Var absurdu — māju, ziloni, zābaku, siera gabalu.', 'Salīdzini: kurš stāv, bet kurš lidinās?'] },
    client: { name: 'Madāma Teabite', job: 'zirnekļu tējas someljē ar astoņām kājiņām un astoņām tasītēm', say: 'Mīļumiņ, manam tējas salonam vajag jaunu ēdienkarti, un ēdienkartei vajag attēlus. Tējkanna, astoņas tases, cukurtrauks un krēsls, uz kura sēž viesi, — bet tiem jāstāv kārtīgi! Iepriekšējais mākslinieks uzzīmēja manas tases lidojam gaisā. Ulongs izlija uz papīra. Nepiedodami.',
      ask: ['Tējkanna un vismaz trīs tases no vienkāršām formām', 'Apaļas elipses, bez citroniem', 'Kontakta ēna zem katra priekšmeta', 'Krēsls ar cauri uzzīmētu aizmugurējo kāju'] },
  },
};
