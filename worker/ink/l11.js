// Курс туши, урок 11 — «Ботаника» (книга «Ink Sketching», с. 59–63). Формат — worker/ink/index.js.
const F = (img, cap) => `<figure><img src="/images/ink/${img}" alt="" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
export default {
  icon: '❦', card: 'fall-2025/41.jpg', cover: 'p62-120.jpg',
  en: {
    name: 'Botanical sketching',
    intro: 'A plant is chaos pretending to be order. Everything grows from one point, every stem is springy, every leaf is a ribbon turning in space. Find the growth, the shapes inside flowers and the dark holes between petals — and a sprig of mint will come alive in a minute.',
    goals: ['see a plant as growth from one point', 'build leaves, stems and flowers from organic shapes', 'draw a crown or a lush flower with masses and dark gaps, not every leaf'],
    th: `<p>A plant is <b>chaos pretending to be order</b>. Look for the <b>growth point</b>: everything comes out of a centre — leaves around a stem, petals around a heart, branches from a trunk (radial symmetry). Plants are springy — that’s <b>turgor</b>, the water pressure inside. Lose it in the drawing and the plant turns to cardboard. Texture is never random: spines, hairs and veins all have a job.</p>
<h4>Organic shapes</h4>
<ul><li>A bud — an egg or a ball; a stem — a flexible cylinder.</li>
<li>A hydrangea — a ball; a bell or a lily — a truncated cone; a sunflower — a disc with spirals.</li></ul>
<h4>The vector of growth</h4>
${F('p61-118.jpg', 'From gesture to tree: one line of growth, then forks, then the trunk gets thickness and the branches — character')}
<ul><li>Start a leaf with its <b>central vein</b> — one confident line, the gesture of the leaf. Side veins run to the edges.</li>
<li>A stem is always slightly curved, with thickenings at the nodes.</li>
<li>A leaf is a <b>ribbon in perspective</b>: when it turns, the near edge overlaps the far one.</li>
<li>A leaf stalk wraps around the stem; fluffy things — short “ghost” strokes.</li></ul>
<h4>Crowns</h4>
${F('p62-120.jpg', 'Left — every leaf counted; right — the crown as clouds of light and shadow with sky between them')}
<p>Don’t count leaves. A crown is <b>clouds of light and shadow</b> with “windows of sky” between them. Detail only a couple of “hero” leaves or twigs; the rest is masses.</p>
<h4>Patterns and petals</h4>
<ul><li>Cones and sunflowers: a grid of spirals. Work out a “hero zone” (about 20 %), let the rest dissolve; keep the right texture on the edge so the shape still reads.</li>
<li>Petals: light strokes from the base along the form; what bulges towards you stays white.</li>
<li>In a lush flower (a peony, a rose) volume comes from the <b>dark holes between petals</b>, not from outlining each petal.</li></ul>`,
    simple: 'Everything grows from one point; stems are springy and slightly curved. Start a leaf with its central vein; a turning leaf is a ribbon with an overlap. A crown is clouds of light and shadow with sky windows, plus a couple of hero leaves. In patterns detail 20 %; in lush flowers draw the dark holes between petals.',
    mist: [['Every leaf of the crown drawn and outlined.', 'Clouds of light and shadow, windows of sky, 1–2 hero leaves.'],
      ['A dead straight stem, the same thickness everywhere.', 'Slightly curved, thicker at the nodes — it’s alive and springy.'],
      ['A leaf as a flat symmetric shape.', 'Start with the central vein; when it turns — overlap of the near edge.'],
      ['Every seed of a sunflower drawn.', 'A grid of spirals, a 20 % hero zone, the rest dissolves.'],
      ['Each petal of a rose outlined.', 'Dark holes between petals; bulging parts stay white.']],
    terms: [['Growth point', 'the centre everything in a plant grows out of'], ['Radial symmetry', 'parts arranged around a centre, like petals around a heart'], ['Turgor', 'water pressure that keeps a plant springy'], ['Central vein', 'the main line of a leaf, its gesture'], ['Node', 'a thickening on a stem where a leaf or branch comes out'], ['Hero zone', 'the small part of a pattern drawn in detail'], ['Sky window', 'a gap in a crown where light shows through']],
    fact: 'Count the spirals in a sunflower head: usually 34 one way and 55 the other — or 55 and 89. These are neighbouring Fibonacci numbers; packed this way, the seeds leave almost no gaps.',
    test: [['What do you look for first in a plant?', 'The growth point everything comes out of', 'The biggest leaf', 'The outline of the whole pot', 'Everything grows from a centre — that’s the plant’s order.'],
      ['What is turgor in a drawing?', 'Springiness: stems are slightly curved and alive', 'Dark shadow under leaves', 'A type of hatching', 'Without turgor the plant looks like cardboard.'],
      ['How do you start a leaf?', 'With the central vein — one confident line', 'With the jagged edge', 'With the shadow', 'The central vein is the gesture of the leaf.'],
      ['How do you draw a turning leaf?', 'As a ribbon: the near edge overlaps the far one', 'Flat and symmetrical', 'Only its outline', 'The overlap shows the turn in space.'],
      ['How do you draw a tree crown?', 'Clouds of light and shadow with windows of sky, a couple of hero leaves', 'Every leaf one by one', 'One solid black blob', 'The eye reads masses, not a count of leaves.'],
      ['How much of a sunflower’s spiral pattern do you detail?', 'About 20 % — a hero zone; the rest dissolves', 'All of it', 'None, only the outline', 'A part in detail is enough — the eye repeats the rule.'],
      ['Where does volume come from in a lush flower?', 'From dark holes between petals', 'From outlining every petal', 'From colour only', 'Dark gaps push petals forward; bulges stay white.']],
    task: { h: 'Three looks at one plant', need: 'a liner, a red pen, a sketchbook page, a plant (parsley, mint, a houseplant)', time: '25 min',
      steps: ['Draw the plant for 3 minutes, just as you see it.', 'Take a red pen and analyse the drawing: mark the growth point, central veins, stems with nodes, the shapes (ball, cylinder, cone).', 'Draw it again from life — 1 minute, starting from the growth point and the veins.', 'Step a metre back and draw it once more — 30 seconds. Can someone tell what plant it is?', 'Compare the three: which says the most with the fewest lines?'] },
    client: { name: 'Petunia Spookworth', job: 'a gentle autumn ghost who replants flowers so they bloom brighter next season', say: 'Oh… hello. I’m writing a little garden journal for next spring, so I remember who grows where. Could you draw my friends? The old apple tree by the gate, a pot of mint, and my peony — she is very proud and very lush. I’d like them to look alive. Not pressed. I’ve seen enough pressed flowers.',
      ask: ['A tree crown in masses with windows of sky', 'A sprig of a herb from the growth point and veins', 'A lush flower with dark holes between petals', 'Stems slightly curved, with nodes'] },
  },
  ru: {
    name: 'Ботаника',
    intro: 'Растение — хаос, который притворяется порядком. Всё растёт из одной точки, каждый стебель упругий, каждый лист — лента, поворачивающаяся в пространстве. Найди рост, фигуры внутри цветов и тёмные дыры между лепестками — и веточка мяты оживёт за минуту.',
    goals: ['видеть растение как рост из одной точки', 'строить листья, стебли и цветы из органических фигур', 'рисовать крону и пышный цветок массами и тёмными просветами, а не по листику'],
    th: `<p>Растение — <b>хаос, который притворяется порядком</b>. Ищи <b>точку роста</b>: всё выходит из центра — листья вокруг стебля, лепестки вокруг сердцевины, ветки из ствола (радиальная симметрия). Растение упругое — это <b>тургор</b>, давление воды внутри. Потеряешь его в рисунке — получится картон. Фактура не случайна: колючки, волоски и жилки — у каждой своя работа.</p>
<h4>Органические фигуры</h4>
<ul><li>Бутон — яйцо или шар; стебель — гибкий цилиндр.</li>
<li>Гортензия — шар; колокольчик или лилия — усечённый конус; подсолнух — диск со спиралями.</li></ul>
<h4>Вектор роста</h4>
${F('p61-118.jpg', 'От жеста к дереву: одна линия роста, потом развилки, потом у ствола появляется толщина, а у веток — характер')}
<ul><li>Лист начинай с <b>центральной жилки</b> — одна уверенная линия, жест листа. Боковые жилки идут к краям.</li>
<li>Стебель всегда чуть изогнут, с утолщениями в узлах.</li>
<li>Лист — <b>лента в перспективе</b>: когда он поворачивается, ближний край перекрывает дальний.</li>
<li>Черешок обхватывает стебель; пушистое — короткие «призрачные» штрихи.</li></ul>
<h4>Кроны</h4>
${F('p62-120.jpg', 'Слева — каждый листик пересчитан; справа — крона облаками света и тени с небом между ними')}
<p>Не считай листья. Крона — это <b>облака света и тени</b> с «окнами неба» между ними. Подробно — только пара листьев или веточек-«героев», остальное — массы.</p>
<h4>Узоры и лепестки</h4>
<ul><li>Шишки и подсолнухи: сетка спиралей. Проработай «геройскую» зону (примерно 20 %), остальное пусть растворяется; по краю — правильная фактура, чтобы форма читалась.</li>
<li>Лепестки: лёгкие штрихи от основания по форме; то, что выгнуто к тебе, остаётся белым.</li>
<li>В пышном цветке (пион, роза) объём дают <b>тёмные дыры между лепестками</b>, а не обведённый каждый лепесток.</li></ul>`,
    simple: 'Всё растёт из одной точки; стебли упругие и чуть изогнуты. Лист начинай с центральной жилки; повёрнутый лист — лента с перекрытием. Крона — облака света и тени с окнами неба плюс пара листьев-героев. В узорах проработай 20 %; в пышных цветах рисуй тёмные дыры между лепестками.',
    mist: [['Каждый лист кроны нарисован и обведён.', 'Облака света и тени, окна неба, 1–2 листа-героя.'],
      ['Мёртво прямой стебель одной толщины.', 'Чуть изогнутый, толще в узлах — живой и упругий.'],
      ['Лист — плоская симметричная фигура.', 'Начни с центральной жилки; при повороте — перекрытие ближнего края.'],
      ['Нарисовано каждое семечко подсолнуха.', 'Сетка спиралей, геройская зона 20 %, остальное растворяется.'],
      ['Каждый лепесток розы обведён.', 'Тёмные дыры между лепестками; выпуклое остаётся белым.']],
    terms: [['Точка роста', 'центр, из которого растёт всё в растении'], ['Радиальная симметрия', 'части расположены вокруг центра, как лепестки вокруг сердцевины'], ['Тургор', 'давление воды, которое держит растение упругим'], ['Центральная жилка', 'главная линия листа, его жест'], ['Узел', 'утолщение на стебле, откуда выходит лист или ветка'], ['Геройская зона', 'небольшая часть узора, проработанная подробно'], ['Окно неба', 'просвет в кроне, где видно свет']],
    fact: 'Посчитай спирали в корзинке подсолнуха: обычно 34 в одну сторону и 55 в другую — или 55 и 89. Это соседние числа Фибоначчи; так семечки укладываются почти без зазоров.',
    test: [['Что искать в растении первым?', 'Точку роста, из которой всё выходит', 'Самый большой лист', 'Контур всего горшка', 'Всё растёт из центра — это и есть порядок растения.'],
      ['Что такое тургор в рисунке?', 'Упругость: стебли чуть изогнуты и живые', 'Тёмная тень под листьями', 'Вид штриховки', 'Без тургора растение похоже на картон.'],
      ['С чего начинать лист?', 'С центральной жилки — одной уверенной линией', 'С зубчатого края', 'С тени', 'Центральная жилка — жест листа.'],
      ['Как нарисовать повёрнутый лист?', 'Лентой: ближний край перекрывает дальний', 'Плоским и симметричным', 'Только контуром', 'Перекрытие показывает поворот в пространстве.'],
      ['Как рисовать крону дерева?', 'Облаками света и тени с окнами неба, пара листьев-героев', 'Каждый лист по отдельности', 'Одним сплошным чёрным пятном', 'Глаз читает массы, а не число листьев.'],
      ['Сколько спирального узора подсолнуха прорабатывать?', 'Примерно 20 % — геройская зона; остальное растворяется', 'Весь', 'Нисколько, только контур', 'Хватит части подробно — глаз повторит правило.'],
      ['Откуда объём у пышного цветка?', 'Из тёмных дыр между лепестками', 'Из обводки каждого лепестка', 'Только из цвета', 'Тёмные просветы выталкивают лепестки вперёд; выпуклое остаётся белым.']],
    task: { h: 'Три взгляда на одно растение', need: 'линер, красная ручка, страница скетчбука, растение (петрушка, мята, комнатное)', time: '25 мин',
      steps: ['Нарисуй растение за 3 минуты — просто как видишь.', 'Возьми красную ручку и разбери рисунок: отметь точку роста, центральные жилки, стебли с узлами, фигуры (шар, цилиндр, конус).', 'Нарисуй снова с натуры — 1 минута, начиная с точки роста и жилок.', 'Отойди на метр и нарисуй ещё раз — 30 секунд. Можно ли понять, что это за растение?', 'Сравни три рисунка: какой говорит больше всего меньшим числом линий?'] },
    client: { name: 'Петуния Спуквёрт', job: 'тихое осеннее привидение, которое пересаживает цветы, чтобы следующей весной они цвели ярче', say: 'Ой… здравствуй. Я веду маленький садовый дневник к весне — чтобы помнить, кто где растёт. Можно нарисовать моих друзей? Старую яблоню у калитки, горшок мяты и мой пион — он очень гордый и очень пышный. Хочется, чтобы они были живые. Не засушенные. Засушенных цветов я уже насмотрелась.',
      ask: ['Крона дерева массами с окнами неба', 'Веточка травы от точки роста и жилок', 'Пышный цветок с тёмными дырами между лепестками', 'Стебли чуть изогнуты, с узлами'] },
  },
  lv: {
    name: 'Botānika',
    intro: 'Augs ir haoss, kas izliekas par kārtību. Viss aug no viena punkta, katrs stublājs ir elastīgs, katra lapa — lente, kas griežas telpā. Atrodi augšanu, formas ziedu iekšpusē un tumšos caurumus starp ziedlapiņām — un piparmētras zariņš atdzīvosies minūtē.',
    goals: ['redzēt augu kā augšanu no viena punkta', 'veidot lapas, stublājus un ziedus no organiskām formām', 'zīmēt vainagu un kuplu ziedu ar masām un tumšām spraugām, nevis pa lapiņai'],
    th: `<p>Augs ir <b>haoss, kas izliekas par kārtību</b>. Meklē <b>augšanas punktu</b>: viss nāk no centra — lapas ap stublāju, ziedlapiņas ap serdi, zari no stumbra (radiālā simetrija). Augs ir elastīgs — tas ir <b>turgors</b>, ūdens spiediens iekšpusē. Pazaudē to zīmējumā — iznāks kartons. Faktūra nav nejauša: ērkšķiem, matiņiem un dzīslām katram ir savs darbs.</p>
<h4>Organiskās formas</h4>
<ul><li>Pumpurs — ola vai lode; stublājs — lokans cilindrs.</li>
<li>Hortenzija — lode; zvaniņš vai lilija — nošķelts konuss; saulespuķe — disks ar spirālēm.</li></ul>
<h4>Augšanas vektors</h4>
${F('p61-118.jpg', 'No žesta līdz kokam: viena augšanas līnija, tad sazarojumi, tad stumbram parādās biezums, bet zariem — raksturs')}
<ul><li>Lapu sāc ar <b>centrālo dzīslu</b> — viena pārliecināta līnija, lapas žests. Sānu dzīslas iet uz malām.</li>
<li>Stublājs vienmēr ir nedaudz izliekts, ar sabiezējumiem mezglos.</li>
<li>Lapa ir <b>lente perspektīvā</b>: kad tā pagriežas, tuvākā mala pārklāj tālāko.</li>
<li>Lapas kātiņš apskauj stublāju; pūkainais — īsas “spoku” svītriņas.</li></ul>
<h4>Vainagi</h4>
${F('p62-120.jpg', 'Pa kreisi — katra lapiņa saskaitīta; pa labi — vainags kā gaismas un ēnas mākoņi ar debesīm starp tiem')}
<p>Neskaiti lapas. Vainags ir <b>gaismas un ēnas mākoņi</b> ar “debesu logiem” starp tiem. Detalizēti — tikai pāris lapu vai zariņu-“varoņu”, pārējais — masas.</p>
<h4>Raksti un ziedlapiņas</h4>
<ul><li>Čiekuri un saulespuķes: spirāļu režģis. Izstrādā “varoņu” zonu (apmēram 20 %), pārējais lai izšķīst; gar malu — pareiza faktūra, lai forma nolasītos.</li>
<li>Ziedlapiņas: vieglas svītras no pamatnes pa formu; tas, kas izliecies pret tevi, paliek balts.</li>
<li>Kuplā ziedā (peonijā, rozē) apjomu dod <b>tumšie caurumi starp ziedlapiņām</b>, nevis katras ziedlapiņas apvilkšana.</li></ul>`,
    simple: 'Viss aug no viena punkta; stublāji ir elastīgi un nedaudz izliekti. Lapu sāc ar centrālo dzīslu; pagriezta lapa ir lente ar pārklājumu. Vainags — gaismas un ēnas mākoņi ar debesu logiem plus pāris lapu-varoņu. Rakstos izstrādā 20 %; kuplos ziedos zīmē tumšos caurumus starp ziedlapiņām.',
    mist: [['Katra vainaga lapa uzzīmēta un apvilkta.', 'Gaismas un ēnas mākoņi, debesu logi, 1–2 lapas-varoņi.'],
      ['Nedzīvi taisns stublājs ar vienu biezumu.', 'Nedaudz izliekts, resnāks mezglos — dzīvs un elastīgs.'],
      ['Lapa kā plakana simetriska forma.', 'Sāc ar centrālo dzīslu; pagriežoties — tuvākās malas pārklājums.'],
      ['Uzzīmēta katra saulespuķes sēkla.', 'Spirāļu režģis, varoņu zona 20 %, pārējais izšķīst.'],
      ['Katra rozes ziedlapiņa apvilkta.', 'Tumši caurumi starp ziedlapiņām; izliektais paliek balts.']],
    terms: [['Augšanas punkts', 'centrs, no kura aug viss augā'], ['Radiālā simetrija', 'daļas izkārtotas ap centru kā ziedlapiņas ap serdi'], ['Turgors', 'ūdens spiediens, kas tur augu elastīgu'], ['Centrālā dzīsla', 'lapas galvenā līnija, tās žests'], ['Mezgls', 'sabiezējums uz stublāja, no kura iziet lapa vai zars'], ['Varoņu zona', 'neliela raksta daļa, izstrādāta detalizēti'], ['Debesu logs', 'sprauga vainagā, kur redzama gaisma']],
    fact: 'Saskaiti spirāles saulespuķes ziedgalvā: parasti 34 uz vienu pusi un 55 uz otru — vai 55 un 89. Tie ir blakus esoši Fibonači skaitļi; tā sēklas sakārtojas gandrīz bez spraugām.',
    test: [['Ko augā meklēt vispirms?', 'Augšanas punktu, no kura viss iziet', 'Lielāko lapu', 'Visa poda kontūru', 'Viss aug no centra — tā ir auga kārtība.'],
      ['Kas zīmējumā ir turgors?', 'Elastīgums: stublāji nedaudz izliekti un dzīvi', 'Tumša ēna zem lapām', 'Svītrojuma veids', 'Bez turgora augs izskatās pēc kartona.'],
      ['Ar ko sākt lapu?', 'Ar centrālo dzīslu — vienu pārliecinātu līniju', 'Ar robaino malu', 'Ar ēnu', 'Centrālā dzīsla ir lapas žests.'],
      ['Kā uzzīmēt pagrieztu lapu?', 'Kā lenti: tuvākā mala pārklāj tālāko', 'Plakanu un simetrisku', 'Tikai ar kontūru', 'Pārklājums parāda pagriezienu telpā.'],
      ['Kā zīmēt koka vainagu?', 'Ar gaismas un ēnas mākoņiem un debesu logiem, pāris lapu-varoņu', 'Katru lapu atsevišķi', 'Ar vienu vienlaidus melnu laukumu', 'Acs nolasa masas, nevis lapu skaitu.'],
      ['Cik daudz saulespuķes spirāļu raksta izstrādāt?', 'Apmēram 20 % — varoņu zonu; pārējais izšķīst', 'Visu', 'Neko, tikai kontūru', 'Pietiek ar daļu detalizēti — acs atkārtos likumu.'],
      ['No kurienes kuplam ziedam apjoms?', 'No tumšajiem caurumiem starp ziedlapiņām', 'No katras ziedlapiņas apvilkšanas', 'Tikai no krāsas', 'Tumšās spraugas izspiež ziedlapiņas uz priekšu; izliektais paliek balts.']],
    task: { h: 'Trīs skatieni uz vienu augu', need: 'lainers, sarkana pildspalva, skiču burtnīcas lapa, augs (pētersīļi, piparmētra, istabas augs)', time: '25 min',
      steps: ['Uzzīmē augu 3 minūtēs — vienkārši, kā redzi.', 'Paņem sarkanu pildspalvu un izanalizē zīmējumu: atzīmē augšanas punktu, centrālās dzīslas, stublājus ar mezgliem, formas (lode, cilindrs, konuss).', 'Uzzīmē vēlreiz no dabas — 1 minūte, sākot ar augšanas punktu un dzīslām.', 'Atkāpies metru un uzzīmē vēl reizi — 30 sekundes. Vai var saprast, kas tas par augu?', 'Salīdzini trīs zīmējumus: kurš pasaka visvairāk ar vismazāk līnijām?'] },
    client: { name: 'Petūnija Spookworth', job: 'kluss rudens spoks, kas pārstāda ziedus, lai nākamajā pavasarī tie ziedētu spožāk', say: 'Ak… sveiks. Es rakstu mazu dārza dienasgrāmatu pavasarim — lai atcerētos, kurš kur aug. Vai vari uzzīmēt manus draugus? Veco ābeli pie vārtiņiem, podu ar piparmētru un manu peoniju — viņa ir ļoti lepna un ļoti kupla. Gribas, lai viņi būtu dzīvi. Ne izkaltēti. Izkaltētus ziedus esmu redzējusi gana.',
      ask: ['Koka vainags ar masām un debesu logiem', 'Zāļu zariņš no augšanas punkta un dzīslām', 'Kupls zieds ar tumšiem caurumiem starp ziedlapiņām', 'Stublāji nedaudz izliekti, ar mezgliem'] },
  },
};
