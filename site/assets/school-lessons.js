// Уроки «Школы Полли» (polly-school.js): 12 уроков по книге Алины «Watercolor Sketches: Creative Guide».
// Шаг урока: say [en, ru, lv] + img (site/images/school/) или art (svg) и один из видов:
//   quiz {opts: [[[en, ru, lv], верно 1/0], …], yes, no} · find {parts: [[ключ, svg, [en, ru, lv]], …], deco} — нажать все части
//   paper {opts: [[en, ru, lv], …], min} — что нарисовать на бумаге · client {card, name, job, task: [[en, ru, lv] ×3]} — заказ; {picked} — выбранное в paper.
// После клиента движок сам добавляет прощальную реплику Полли (печать, следующий урок).
(() => {
  const W = (x, y, w, h) => `<rect class="hit" x="${x}" y="${y}" width="${w}" height="${h}"/>`; // невидимая зона нажатия для тонких линий
  const PHOTO = ['Take a photo of the page and press “Hand in to Polly”.', 'Сфотографируй страницу и нажми «Сдать Полли».', 'Nofotografē lapu un nospied “Iesniegt Pollijai”.'];
  const svg = (inner, h = 190) => `<svg viewBox="0 0 200 ${h}" class="ps-art" aria-hidden="true"><rect width="200" height="${h}" fill="#fff"/>${inner}</svg>`;
  const ink = 'fill="none" stroke="#2B1A51" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
  // эллипсы (урок 9): отверстие кружки сверху, наискосок, сбоку
  // дно — передняя половина такого же эллипса (чуть круглее), а чем выше взгляд, тем ниже кажется кружка
  const cupArt = ry => svg(`<path d="M55 60 L60 ${160 - ry / 2} A40 ${Math.max(4, Math.round(ry * 40 / 45 + 1))} 0 0 0 140 ${160 - ry / 2} L145 60" ${ink}/><ellipse cx="100" cy="60" rx="45" ry="${ry}" ${ink}/><path d="M145 85 c30 -4 30 50 -4 48" ${ink}/><ellipse cx="100" cy="60" rx="45" ry="${ry}" fill="none" stroke="#D85A30" stroke-width="2.5" stroke-dasharray="7 5"/>`);

  window.PP_SCHOOL_LESSONS = [
    { // 1 — Фигуры
      name: ['Shapes', 'Фигуры', 'Figūras'], icon: '◯',
      steps: [
        { img: 'l1-s1.png', say: ['Coo! I’m Polly, and today I’m your teacher. Grab any paper and a pen — a napkin works too.', 'Курлык! Я Полли, и сегодня я твой учитель. Возьми любую бумагу и ручку — салфетка тоже подойдёт.', 'Kū! Es esmu Pollija, un šodien es esmu tava skolotāja. Paņem jebkuru papīru un pildspalvu — der arī salvete.'] },
        { img: 'l1-s1.png', say: ['My secret: everything in the world is made of a few shapes. Circle, square, triangle and two ovals — one standing, one lying.', 'Мой секрет: всё на свете собрано из нескольких фигур. Круг, квадрат, треугольник и два овала — один стоит, другой лежит.', 'Mans noslēpums: viss pasaulē ir salikts no dažām figūrām. Aplis, kvadrāts, trīsstūris un divi ovāli — viens stāv, otrs guļ.'] },
        { img: 'l1-s1.png', say: ['Warm-up: draw each shape five times. Crooked ones count! A wobbly circle is still a circle — and much more alive.', 'Разминка: нарисуй каждую фигуру пять раз. Кривые тоже считаются! Кривой круг — всё равно круг, и он гораздо живее.', 'Iesildīšanās: uzzīmē katru figūru piecas reizes. Šķības arī skaitās! Šķībs aplis tik un tā ir aplis — un daudz dzīvāks.'] },
        { img: 'l1-c1.png', say: ['Now look. Just a circle. Boring?', 'А теперь смотри. Просто круг. Скучно?', 'Tagad skaties. Vienkārši aplis. Garlaicīgi?'] },
        { img: 'l1-c2.png', say: ['A loop on top, two hands, a little shadow — and it’s a clock! The circle did all the work.', 'Петелька сверху, две стрелки, немного тени — и это уже часы! Всю работу сделал круг.', 'Cilpiņa augšā, divi rādītāji, mazliet ēnas — un tas jau ir pulkstenis! Visu darbu izdarīja aplis.'] },
        { img: 'l1-c3.png', say: ['Another circle, a bit lopsided. Guess what it becomes?', 'Ещё один круг, чуть кривой. Угадай, во что он превратится?', 'Vēl viens aplis, mazliet šķībs. Uzmini, par ko tas pārvērtīsies?'],
          quiz: { opts: [[['🌙 The moon', '🌙 Луна', '🌙 Mēness'], 0], [['🍳 A frying pan', '🍳 Сковородка', '🍳 Panna'], 1], [['🔘 A button', '🔘 Пуговка', '🔘 Poga'], 0]],
            yes: ['Yes! You think like an artist already.', 'Да! Ты уже думаешь как художник.', 'Jā! Tu jau domā kā mākslinieks.'],
            no: ['Could be! But I had something tastier in mind…', 'Тоже можно! Но я задумала кое-что повкуснее…', 'Arī var! Bet es biju iedomājusies ko garšīgāku…'] } },
        { img: 'l1-c4.png', say: ['A frying pan with a fried egg! See? Shapes first, details later — that’s the whole trick.', 'Сковородка с яичницей! Видишь? Сначала фигуры, потом детали — вот и весь фокус.', 'Panna ar ceptu olu! Redzi? Vispirms figūras, pēc tam detaļas — tas ir viss triks.'] },
        { say: ['Game time! This lamp hides three shapes. Tap all of them.', 'Игра! В этой лампе спрятаны три фигуры. Найди и нажми все.', 'Spēle! Šajā lampā paslēptas trīs figūras. Atrodi un pieskaries visām.'],
          find: { parts: [
            ['tri', '<polygon points="70,30 130,30 150,92 50,92"/>', ['trapezoid — almost a triangle!', 'трапеция — почти треугольник!', 'trapece — gandrīz trīsstūris!']],
            ['rect', '<rect x="93" y="92" width="14" height="70"/>', ['rectangle', 'прямоугольник', 'taisnstūris']],
            ['oval', '<ellipse cx="100" cy="168" rx="42" ry="11"/>', ['oval', 'овал', 'ovāls']]],
            deco: '<path d="M118 92 q6 18 -2 30" fill="none" stroke="#2B1A51" stroke-width="2"/><circle cx="116" cy="124" r="3" fill="#2B1A51"/>' } },
        { img: 'l1-s1.png', say: ['Now on paper! Pick any two of these things and find them at home. First only shapes, then a couple of details. Tick the ones you draw.', 'Теперь на бумаге! Выбери любые две вещи из списка и найди их дома. Сначала только фигуры, потом пара деталей. Отметь те, что нарисованы.', 'Tagad uz papīra! Izvēlies jebkuras divas lietas no saraksta un atrodi tās mājās. Vispirms tikai figūras, tad pāris detaļu. Atzīmē uzzīmētās.'],
          paper: { min: 2, opts: [['a mug', 'кружка', 'krūze'], ['a book', 'книга', 'grāmata'], ['a lamp', 'лампа', 'lampa'], ['a fruit', 'фрукт', 'auglis'], ['a bottle', 'бутылка', 'pudele']] } },
        { say: ['Oh dear, oh dear! Things at the lost-and-found have no labels, and I can’t sleep. Draw me the two you picked in simple shapes, so I can label at least those boxes!', 'Ох-ох-ох! В бюро находок вещи без этикеток, и я не могу уснуть. Нарисуй мне те две, что выбраны, простыми фигурами — подпишу хоть эти коробки!', 'Ak vai, ak vai! Atrasto mantu birojā lietām nav etiķešu, un es nevaru aizmigt. Uzzīmē man tās divas, kuras izvēlējies, ar vienkāršām figūrām — uzlīmēšu etiķetes vismaz šīm kastēm!'],
          client: { card: 'classic/14.jpg', name: ['Mr. Crisper', 'Мистер Криспер', 'Misters Krispers'], job: ['lost-and-found, Wobbleland station', 'бюро находок, вокзал Воббленда', 'atrasto mantu birojs, Vobllendas stacija'],
            task: [['On a sheet of paper, draw the two things you picked: {picked}.', 'На листе бумаги нарисуй две выбранные вещи: {picked}.', 'Uz papīra lapas uzzīmē divas izvēlētās lietas: {picked}.'],
              ['First only big shapes (circle, rectangle, oval), then a couple of details — a handle, a label, a shadow.', 'Сначала только крупные фигуры (круг, прямоугольник, овал), потом пара деталей — ручка, этикетка, тень.', 'Vispirms tikai lielas figūras (aplis, taisnstūris, ovāls), tad pāris detaļu — rokturis, etiķete, ēna.'], PHOTO] } },
      ] },

    { // 2 — Линии
      name: ['Lines', 'Линии', 'Līnijas'], icon: '〰',
      steps: [
        { img: 'l2-a.png', say: ['Today — lines! A line is never just a line: thin or bold, calm or shaky, dotted or wavy. Pressure and speed change its character.', 'Сегодня — линии! Линия никогда не бывает просто линией: тонкая или смелая, спокойная или дрожащая, пунктир или волна. Нажим и скорость меняют её характер.', 'Šodien — līnijas! Līnija nekad nav vienkārši līnija: plāna vai drosmīga, mierīga vai drebuļaina, punktēta vai viļņaina. Spiediens un ātrums maina tās raksturu.'] },
        { img: 'l2-b.png', say: ['Look: a straight one, a wave, a line with a little break, a trembling one. All drawn with the same pen!', 'Смотри: прямая, волна, линия с перерывом, дрожащая. И всё это — одной и той же ручкой!', 'Skaties: taisna, vilnis, līnija ar pārtraukumu, drebuļaina. Un tas viss — ar vienu un to pašu pildspalvu!'] },
        { img: 'l2-c.png', say: ['And these are lines with knots: a dot, a bow, a little square, a loop. Suddenly the line tells a story.', 'А это линии с узелками: точка, бантик, квадратик, петелька. И линия вдруг начинает рассказывать историю.', 'Bet šīs ir līnijas ar mezgliņiem: punkts, bantīte, kvadrātiņš, cilpiņa. Un līnija pēkšņi sāk stāstīt stāstu.'] },
        { img: 'l2-d.png', say: ['Dashes, dots, a fat heavy line — that’s pressure. Press harder and the line gets louder. Lighter — it whispers.', 'Пунктир, штрихи, толстая жирная линия — это нажим. Нажми сильнее — линия громче. Легче — шепчет.', 'Svītriņas, punkti, bieza trekna līnija — tas ir spiediens. Spied stiprāk — līnija skaļāka. Vieglāk — tā čukst.'] },
        { img: 'l2-a.png', say: ['Guess: which line is best for rain?', 'Угадай: какой линией лучше нарисовать дождь?', 'Uzmini: ar kādu līniju vislabāk zīmēt lietu?'],
          quiz: { opts: [[['〰 A wave', '〰 Волной', '〰 Ar vilni'], 0], [['╱ Short slanted dashes', '╱ Короткими косыми штрихами', '╱ Ar īsām slīpām svītriņām'], 1], [['━ A thick straight line', '━ Толстой прямой', '━ Ar biezu taisnu līniju'], 0]],
            yes: ['Exactly! A few slanted dashes — and it’s already dripping.', 'Точно! Пара косых штрихов — и уже капает.', 'Tieši tā! Pāris slīpas svītriņas — un jau līst.'],
            no: ['You can try! But short slanted dashes are the wettest.', 'Можно и так! Но короткие косые штрихи — самые мокрые.', 'Var arī tā! Bet īsas slīpas svītriņas ir visslapjākās.'] } },
        { say: ['Game! Find on the sheet: a wave, a zigzag and a dashed line.', 'Игра! Найди на листе волну, зигзаг и пунктир.', 'Spēle! Atrodi uz lapas vilni, zigzagu un punktētu līniju.'],
          find: { parts: [
            ['wave', `${W(15, 25, 170, 40)}<path class="ln" d="M20 45 q15 -22 30 0 t30 0 t30 0 t30 0 t30 0"/>`, ['wave', 'волна', 'vilnis']],
            ['zig', `${W(15, 78, 170, 40)}<polyline class="ln" points="20,110 40,85 60,110 80,85 100,110 120,85 140,110 160,85 180,110"/>`, ['zigzag', 'зигзаг', 'zigzags']],
            ['dash', `${W(15, 160, 170, 24)}<path class="ln" d="M20 172 H180" stroke-dasharray="12 9"/>`, ['dashed line', 'пунктир', 'punktēta līnija']]],
            deco: '<path d="M20 140 C60 132 90 146 180 138" fill="none" stroke="#2B1A51" stroke-width="1.5"/>' } },
        { img: 'l2-a.png', say: ['On paper: fill half a page with lines — straight, curvy, zigzag, dashed, light and heavy. Don’t try to make them perfect. Which ones will you surely try?', 'На бумаге: заполни полстраницы линиями — прямыми, изогнутыми, зигзагами, пунктиром, лёгкими и жирными. Не старайся сделать их идеальными. Какие точно попробуешь?', 'Uz papīra: aizpildi pus lapu ar līnijām — taisnām, izliektām, zigzagiem, punktētām, vieglām un treknām. Necenties tās padarīt perfektas. Kuras noteikti pamēģināsi?'],
          paper: { min: 3, opts: [['wave', 'волна', 'vilnis'], ['zigzag', 'зигзаг', 'zigzags'], ['dashed', 'пунктир', 'punktēta'], ['line with knots', 'линия с узелками', 'līnija ar mezgliņiem'], ['heavy line', 'жирная линия', 'trekna līnija']] } },
        { say: ['Ah, someone from Polly’s school! I tie the knots on the noodle lanterns, and I’ve run out of ideas. Draw me ribbons — each one with a different line!', 'А, из школы Полли! Я завязываю узлы на фонариках из лапши, и у меня кончились идеи. Нарисуй мне ленточки — каждую другой линией!', 'Ā, no Pollijas skolas! Es sienu mezglus nūdeļu laternām, un man ir beigušās idejas. Uzzīmē man lentītes — katru ar citu līniju!'],
          client: { card: 'classic/24.jpg', name: ['Sir Pickleknot', 'Сэр Пиклнот', 'Sers Pickleknot'], job: ['knot master, noodle lanterns', 'мастер узлов, фонарики из лапши', 'mezglu meistars, nūdeļu laternas'],
            task: [['Draw 6 long ribbons across the page, one under another. Each ribbon is a different kind of line: straight, wave, zigzag, dashed, shaky, heavy.', 'Нарисуй 6 длинных ленточек поперёк листа, одну под другой. Каждая ленточка — другой вид линии: прямая, волна, зигзаг, пунктир, дрожащая, жирная.', 'Uzzīmē 6 garas lentītes pāri lapai, vienu zem otras. Katra lentīte — cits līnijas veids: taisna, vilnis, zigzags, punktēta, drebuļaina, trekna.'],
              ['Make sure the lines ticked earlier are there: {picked}.', 'Среди них обязательно линии, отмеченные раньше: {picked}.', 'Starp tām noteikti jābūt iepriekš atzīmētajām līnijām: {picked}.'],
              ['On two ribbons, draw little knots right on the line — a dot, a bow or a loop.', 'На двух ленточках нарисуй узелки прямо на линии — точку, бантик или петельку.', 'Uz divām lentītēm uzzīmē mezgliņus tieši uz līnijas — punktu, bantīti vai cilpiņu.'], PHOTO] } },
      ] },

    { // 3 — Текстура
      name: ['Texture', 'Текстура', 'Tekstūra'], icon: '▦',
      steps: [
        { img: 'l3-a.png', say: ['You can draw shapes and lines. Now let’s make them friends: outline a circle with a shaky line — and it’s already a little cloud.', 'Ты уже умеешь фигуры и линии. Теперь подружим их: обведи круг дрожащей линией — и это уже облачко.', 'Tu jau proti figūras un līnijas. Tagad sadraudzināsim tās: apvelc apli ar drebuļainu līniju — un tas jau ir mākonītis.'] },
        { img: 'l3-a.png', say: ['A square with knots in the corners, a triangle with little boxes — shapes get a character.', 'Квадрат с узелками в углах, треугольник с квадратиками — фигуры получают характер.', 'Kvadrāts ar mezgliņiem stūros, trīsstūris ar kvadrātiņiem — figūras iegūst raksturu.'] },
        { img: 'l3-b.png', say: ['And now the filling! Dots, tiny speckles, hatching, crosshatching, waves. That’s texture.', 'А теперь начинка! Точки, мелкий горошек, штриховка, сеточка, волны. Это и есть текстура.', 'Bet tagad pildījums! Punkti, sīki raibumiņi, svītrojums, krustojums, viļņi. Tā ir tekstūra.'] },
        { img: 'l3-b.png', say: ['Which texture fits an orange peel?', 'Какая текстура подойдёт для апельсиновой корки?', 'Kāda tekstūra der apelsīna mizai?'],
          quiz: { opts: [[['• Dots', '• Точки', '• Punkti'], 1], [['/// Hatching', '/// Штриховка', '/// Svītrojums'], 0], [['〰 Waves', '〰 Волны', '〰 Viļņi'], 0]],
            yes: ['Yes! The peel is covered in tiny dimples — dots.', 'Да! Корка вся в маленьких ямках — точках.', 'Jā! Miza ir pilna ar sīkām bedrītēm — punktiem.'],
            no: ['Fun idea! But an orange peel is full of tiny dimples — dots.', 'Интересно! Но корка апельсина вся в ямках — это точки.', 'Interesanti! Bet apelsīna miza ir pilna ar bedrītēm — tie ir punkti.'] } },
        { say: ['Game! Find the dots, the hatching and the crosshatching.', 'Игра! Найди точки, штриховку и сеточку.', 'Spēle! Atrodi punktus, svītrojumu un krustojumu.'],
          find: { parts: [
            ['dots', '<circle cx="50" cy="55" r="34"/><g class="tx"><circle cx="38" cy="42" r="2.5"/><circle cx="58" cy="40" r="2.5"/><circle cx="46" cy="60" r="2.5"/><circle cx="66" cy="62" r="2.5"/><circle cx="36" cy="72" r="2.5"/><circle cx="56" cy="78" r="2.5"/></g>', ['dots', 'точки', 'punkti']],
            ['hatch', '<circle cx="150" cy="55" r="34"/><path class="tx ln" d="M126 40 L150 22 M120 58 L166 24 M124 74 L178 36 M134 84 L182 50 M150 88 L182 66"/>', ['hatching', 'штриховка', 'svītrojums']],
            ['cross', '<circle cx="100" cy="140" r="34"/><path class="tx ln" d="M76 126 L100 108 M70 144 L116 110 M74 160 L128 122 M84 170 L132 136 M76 126 L120 168 M84 114 L132 154 M100 108 L134 136"/>', ['crosshatching', 'сеточка', 'krustojums']]] } },
        { img: 'l3-b.png', say: ['On paper: draw four circles and fill them with different textures. Which will you take?', 'На бумаге: нарисуй четыре круга и заполни их разными текстурами. Какие возьмёшь?', 'Uz papīra: uzzīmē četrus apļus un aizpildi tos ar dažādām tekstūrām. Kuras ņemsi?'],
          paper: { min: 3, opts: [['dots', 'точки', 'punkti'], ['hatching', 'штриховка', 'svītrojums'], ['crosshatching', 'сеточка', 'krustojums'], ['waves', 'волны', 'viļņi'], ['my own pattern', 'свой узор', 'savs raksts']] } },
        { say: ['Pins and needles! I mend broken hearts, and I need new patches. Draw me fabric scraps with patterns, please!', 'Иголки-булавки! Я чиню разбитые сердца, и мне нужны новые заплатки. Нарисуй мне лоскутки с узорами!', 'Adatas un kniepadatas! Es lāpu salauztas sirdis, un man vajag jaunus ielāpus. Uzzīmē man auduma gabaliņus ar rakstiem!'],
          client: { card: 'halloween-2025/55.jpg', name: ['Sew-Sew Patty', 'Шью-Шью Пэтти', 'Šuj-Šuj Patija'], job: ['seamstress, mends broken hearts', 'швея, чинит разбитые сердца', 'šuvēja, lāpa salauztas sirdis'],
            task: [['Draw 4 patches — a square, a circle, a heart and any shape — with shaky or knotted edges.', 'Нарисуй 4 заплатки — квадрат, круг, сердце и любую фигуру — с дрожащими или узелковыми краями.', 'Uzzīmē 4 ielāpus — kvadrātu, apli, sirdi un jebkuru figūru — ar drebuļainām vai mezglotām malām.'],
              ['Fill them with textures: {picked}.', 'Заполни их текстурами: {picked}.', 'Aizpildi tos ar tekstūrām: {picked}.'], PHOTO] } },
      ] },

    { // 4 — Сочетания
      name: ['Combinations', 'Сочетания', 'Kombinācijas'], icon: '◭',
      steps: [
        { img: 'l4-a.png', say: ['Almost ready to draw! First — how shapes live next to each other. They can hide behind one another.', 'Почти готовы рисовать! Сначала — как фигуры живут рядом. Они умеют прятаться друг за друга.', 'Gandrīz gatavi zīmēt! Vispirms — kā figūras dzīvo blakus. Tās prot paslēpties viena aiz otras.'] },
        { img: 'l4-a.png', say: ['See the dashed lines? That’s the part of a shape hiding behind. Sketch it lightly — you don’t have to outline it later.', 'Видишь пунктир? Это часть фигуры, которая спряталась сзади. Наметь её легко — потом её можно не обводить.', 'Redzi punktēto līniju? Tā ir figūras daļa, kas paslēpusies aizmugurē. Iezīmē to viegli — vēlāk to var neapvilkt.'] },
        { img: 'l4-a.png', say: ['If a circle covers part of a square — which one is closer to us?', 'Если круг закрывает часть квадрата — кто ближе к нам?', 'Ja aplis aizsedz daļu kvadrāta — kurš ir tuvāk mums?'],
          quiz: { opts: [[['◯ The circle', '◯ Круг', '◯ Aplis'], 1], [['▢ The square', '▢ Квадрат', '▢ Kvadrāts'], 0], [['= Both the same', '= Одинаково', '= Vienādi'], 0]],
            yes: ['Right! Whoever covers is closer.', 'Верно! Кто закрывает — тот и ближе.', 'Pareizi! Kurš aizsedz — tas ir tuvāk.'],
            no: ['Hmm! Whoever covers the other is closer — here, the circle.', 'Хм! Кто закрывает другого — тот ближе. Здесь это круг.', 'Hmm! Kurš aizsedz otru — tas ir tuvāk. Šeit tas ir aplis.'] } },
        { say: ['Game! Three shapes fell into a pile. Find each one.', 'Игра! Три фигуры упали в кучку. Найди каждую.', 'Spēle! Trīs figūras sakritušas kaudzē. Atrodi katru.'],
          find: { parts: [
            ['sq', '<rect x="30" y="40" width="80" height="80"/>', ['square — at the back', 'квадрат — сзади', 'kvadrāts — aizmugurē']],
            ['ci', '<circle cx="110" cy="115" r="45"/>', ['circle — in the middle', 'круг — посередине', 'aplis — vidū']],
            ['tr', '<polygon points="140,60 180,150 100,150"/>', ['triangle — in front', 'треугольник — впереди', 'trīsstūris — priekšā']]],
            deco: '' } },
        { img: 'l4-a.png', say: ['On paper: draw a little house and things that stand in front of it or behind it. Pick what will be there:', 'На бумаге: нарисуем домик и то, что стоит перед ним или за ним. Выбери, что там будет:', 'Uz papīra: uzzīmēsim mājiņu un to, kas stāv tās priekšā vai aiz tās. Izvēlies, kas tur būs:'],
          paper: { min: 3, opts: [['a fence in front of the house', 'забор перед домиком', 'žogs mājiņas priekšā'], ['a tree behind the house', 'дерево за домиком', 'koks aiz mājiņas'], ['a bush in front of the wall', 'куст перед стеной', 'krūms sienas priekšā'], ['a chimney behind the roof', 'труба за крышей', 'skurstenis aiz jumta'], ['a cat in the window', 'кошка в окне', 'kaķis logā']] } },
        { say: ['…(only a tail sticks out of the box) Meow. I’m tired of my box. Draw me a house with things in front of it and behind it — a real one!', '…(из коробки торчит только хвост) Мяу. Надоела мне коробка. Нарисуй мне домик, чтобы перед ним и за ним что-то было, — настоящий!', '…(no kastes rēgojas tikai aste) Ņau. Man apnikusi kaste. Uzzīmē man mājiņu, lai tās priekšā un aiz tās kaut kas būtu, — īstu!'],
          client: { card: 'classic/15.jpg', name: ['Milka', 'Милка', 'Milka'], job: ['lives in a box', 'живёт в коробке', 'dzīvo kastē'],
            task: [['Draw a house and, around it, what was picked: {picked}.', 'Нарисуй домик и рядом то, что выбрано: {picked}.', 'Uzzīmē mājiņu un blakus to, kas izvēlēts: {picked}.'],
              ['What stands in front — draw it whole, it covers part of the house. What stands behind — draw only the part that peeks out.', 'Что стоит впереди — рисуй целиком, оно закрывает часть домика. Что сзади — рисуй только ту часть, что выглядывает.', 'Ko stāv priekšā — zīmē visu, tas aizsedz daļu mājiņas. Ko stāv aizmugurē — zīmē tikai to daļu, kas izspraucas.'],
              ['You can mark the hidden parts with a light dashed line.', 'Спрятанные части можно наметить лёгким пунктиром.', 'Paslēptās daļas vari iezīmēt ar vieglu punktētu līniju.'], PHOTO] } },
      ] },

    { // 5 — Объём
      name: ['Volume', 'Объём', 'Apjoms'], icon: '▣',
      steps: [
        { img: 'l5-a.png', say: ['A circle is flat. But add hatching on one side and a shadow below — and it’s a ball!', 'Круг плоский. Но добавь штриховку с одной стороны и тень снизу — и он становится шаром!', 'Aplis ir plakans. Bet pievieno svītrojumu vienā pusē un ēnu apakšā — un tas kļūst par bumbu!'] },
        { img: 'l5-a.png', say: ['A cube the same way: a square, a second square a little higher and to the side, then join the corners.', 'С кубом так же: квадрат, второй квадрат чуть выше и сбоку, потом соедини углы.', 'Ar kubu tāpat: kvadrāts, otrs kvadrāts mazliet augstāk un sānis, tad savieno stūrus.'] },
        { img: 'l5-b.png', say: ['Another way: draw a corner like a tick, then two walls, then a lid. You get a tall box.', 'Ещё способ: нарисуй угол-«галочку», потом две стенки, потом крышку. Получится высокая коробка.', 'Vēl viens veids: uzzīmē stūri kā ķeksīti, tad divas sienas, tad vāku. Sanāks augsta kaste.'] },
        { img: 'l5-c.png', say: ['Shade one side and add a shadow on the table — and the volume is ready.', 'Закрась одну сторону и добавь тень на столе — объём готов.', 'Iekrāso vienu pusi un pievieno ēnu uz galda — apjoms gatavs.'] },
        { img: 'l5-c.png', say: ['How many sides of a cube can you usually see at once?', 'Сколько стенок куба обычно видно сразу?', 'Cik kuba sienas parasti redz uzreiz?'],
          quiz: { opts: [[['1', '1', '1'], 0], [['3', '3', '3'], 1], [['6', '6', '6'], 0]],
            yes: ['Yes, three — the others hide at the back.', 'Да, три — остальные прячутся сзади.', 'Jā, trīs — pārējās slēpjas aizmugurē.'],
            no: ['Usually three — the rest hide at the back.', 'Обычно три — остальные прячутся сзади.', 'Parasti trīs — pārējās slēpjas aizmugurē.'] } },
        { say: ['Game! Find the three sides of this cube: front, top and side.', 'Игра! Найди три стенки этого куба: переднюю, верхнюю и боковую.', 'Spēle! Atrodi trīs šī kuba sienas: priekšējo, augšējo un sānu.'],
          find: { parts: [
            ['front', '<polygon points="45,75 125,75 125,155 45,155"/>', ['front side', 'передняя', 'priekšējā']],
            ['top', '<polygon points="45,75 85,40 165,40 125,75"/>', ['top', 'верхняя', 'augšējā']],
            ['side', '<polygon points="125,75 165,40 165,120 125,155"/>', ['side', 'боковая', 'sānu']]],
            deco: '<path d="M125 155 L185 165 L165 120" fill="#2B1A51" opacity=".18"/>' } },
        { img: 'l5-b.png', say: ['On paper: draw a ball and a few boxes of different heights. Which boxes?', 'На бумаге: нарисуй шар и несколько коробок разной высоты. Какие коробки?', 'Uz papīra: uzzīmē bumbu un dažas dažāda augstuma kastes. Kādas kastes?'],
          paper: { min: 2, opts: [['a low one', 'низкая', 'zema'], ['a tall one', 'высокая', 'augsta'], ['a long one', 'длинная', 'gara'], ['a perfect cube', 'кубик', 'kubiņš'], ['a flat one', 'плоская', 'plakana']] } },
        { say: ['I adore bags and boxes! Draw me gift boxes — real ones with volume, not flat stickers.', 'Обожаю пакеты и коробки! Нарисуй мне подарочные коробки — объёмные, а не плоские наклейки.', 'Es dievinu maisiņus un kastes! Uzzīmē man dāvanu kastes — apjomīgas, nevis plakanas uzlīmes.'],
          client: { card: 'classic/22.jpg', name: ['Bobby Bagster', 'Бобби Бэгстер', 'Bobijs Bagsters'], job: ['bag connoisseur', 'знаток пакетов', 'maisiņu zinātājs'],
            task: [['Draw 3 boxes with volume, among them: {picked}.', 'Нарисуй 3 объёмные коробки, среди них: {picked}.', 'Uzzīmē 3 apjomīgas kastes, starp tām: {picked}.'],
              ['Shade one side of each and add a shadow on the table. A ribbon on top is a bonus!', 'У каждой закрась одну сторону и добавь тень на столе. Бантик сверху — бонус!', 'Katrai iekrāso vienu pusi un pievieno ēnu uz galda. Bantīte augšā — bonuss!'], PHOTO] } },
      ] },

    { // 6 — Тени
      name: ['Shadows', 'Тени', 'Ēnas'], icon: '◐',
      steps: [
        { img: 'l6-a.png', say: ['Take something round — an apple, a ball — and shine your phone’s flashlight on it in a dark room.', 'Возьми что-то круглое — яблоко, мячик — и посвети на него фонариком телефона в тёмной комнате.', 'Paņem kaut ko apaļu — ābolu, bumbiņu — un tumšā istabā paspīdini uz to ar telefona lukturīti.'] },
        { img: 'l6-a.png', say: ['Where the light hits — it’s bright. On the other side there’s a shadow on the object itself. And on the table — a cast shadow, always running away from the light.', 'Где свет — там светло. С другой стороны — тень на самом предмете. А на столе — падающая тень, и она всегда убегает от света.', 'Kur gaisma — tur gaišs. Otrā pusē — ēna uz pašas lietas. Bet uz galda — krītošā ēna, un tā vienmēr bēg no gaismas.'] },
        { img: 'l6-a.png', say: ['The lamp is on the left. Where does the shadow fall?', 'Лампа слева. Куда упадёт тень?', 'Lampa ir pa kreisi. Kur kritīs ēna?'],
          quiz: { opts: [[['← To the left', '← Влево', '← Pa kreisi'], 0], [['→ To the right', '→ Вправо', '→ Pa labi'], 1], [['↑ Up', '↑ Вверх', '↑ Uz augšu'], 0]],
            yes: ['Right! A shadow runs away from the light.', 'Правильно! Тень убегает от света.', 'Pareizi! Ēna bēg no gaismas.'],
            no: ['A shadow always runs away from the light — so to the right.', 'Тень всегда убегает от света — значит, вправо.', 'Ēna vienmēr bēg no gaismas — tātad pa labi.'] } },
        { say: ['Game! Find the highlight, the shadow on the ball and the shadow on the table.', 'Игра! Найди блик, тень на шаре и тень на столе.', 'Spēle! Atrodi atspīdumu, ēnu uz bumbas un ēnu uz galda.'],
          find: { parts: [
            ['hi', '<ellipse cx="80" cy="72" rx="11" ry="8"/>', ['highlight', 'блик', 'atspīdums']],
            ['core', '<path d="M129 66 A48 48 0 0 1 68 140 Q120 128 129 66 Z"/>', ['shadow on the ball', 'тень на шаре', 'ēna uz bumbas']],
            ['cast', '<ellipse cx="140" cy="158" rx="44" ry="10"/>', ['shadow on the table', 'тень на столе', 'ēna uz galda']]],
            deco: '<circle cx="95" cy="100" r="48" fill="none" stroke="#2B1A51" stroke-width="3"/><circle cx="30" cy="30" r="8" fill="none" stroke="#E9A93B" stroke-width="3"/><path d="M14 30h-8M30 14v-8M42 18l6-6M18 18l-6-6" stroke="#E9A93B" stroke-width="3"/>' } },
        { img: 'l6-a.png', say: ['Experiment: shine a flashlight on two things and draw them with their shadows. Which will you take?', 'Опыт: посвети фонариком на две вещи и нарисуй их с тенями. Какие возьмёшь?', 'Eksperiments: paspīdini ar lukturīti uz divām lietām un uzzīmē tās ar ēnām. Kuras ņemsi?'],
          paper: { min: 2, opts: [['an apple', 'яблоко', 'ābols'], ['a ball', 'мяч', 'bumba'], ['a mug', 'кружка', 'krūze'], ['a box', 'коробка', 'kaste'], ['an orange', 'апельсин', 'apelsīns']] } },
        { say: ['Eek! Was that a shadow?! I jump at every one of them. Maybe if you explain shadows with a drawing, I’ll stop being scared…', 'Ай! Это была тень?! Я пугаюсь каждой. Может, если ты объяснишь мне тени рисунком, я перестану бояться…', 'Ai! Vai tā bija ēna?! Es baidos no katras. Varbūt, ja tu man izskaidrosi ēnas ar zīmējumu, es pārstāšu baidīties…'],
          client: { card: 'classic/25.jpg', name: ['Dr. Panicoli', 'Доктор Паниколи', 'Dr. Panikoli'], job: ['PhD candidate, afraid of shadows', 'аспирант, боится теней', 'doktorants, baidās no ēnām'],
            task: [['Draw {picked} and a lamp or the sun next to them.', 'Нарисуй {picked} и лампу или солнце рядом.', 'Uzzīmē {picked} un blakus lampu vai sauli.'],
              ['Shadow on the object — on the side away from the light; shadow on the table — running away from the light.', 'Тень на предмете — со стороны, где нет света; тень на столе — убегает от света.', 'Ēna uz lietas — pusē, kur nav gaismas; ēna uz galda — bēg no gaismas.'], PHOTO] } },
      ] },

    { // 7 — Детали
      name: ['Details', 'Детали', 'Detaļas'], icon: '✦',
      steps: [
        { img: 'l1-c2.png', say: ['Remember the circle that became a clock? Details are the small lines that make a shape recognisable.', 'Помнишь круг, который стал часами? Детали — это маленькие линии, которые делают фигуру узнаваемой.', 'Atceries apli, kas kļuva par pulksteni? Detaļas ir mazās līnijas, kas padara figūru atpazīstamu.'] },
        { img: 'l7-a.png', say: ['A plain cylinder is boring. Add a handle, a tea bag, dots for shadow — and it’s somebody’s favourite mug.', 'Простой цилиндр скучный. Добавь ручку, чайный пакетик, точки-тень — и это уже чья-то любимая кружка.', 'Vienkāršs cilindrs ir garlaicīgs. Pievieno rokturi, tējas maisiņu, punktus ēnai — un tā jau ir kāda mīļākā krūze.'] },
        { img: 'l7-a.png', say: ['Experiment: a pattern on a cup, letters on a can. Don’t try to impress — try to tell a story. Lines don’t have to be solid!', 'Экспериментируй: узор на чашке, буквы на банке. Не старайся удивить — старайся рассказать. Линии не обязаны быть сплошными!', 'Eksperimentē: raksts uz tases, burti uz bundžas. Necenties pārsteigt — centies pastāstīt. Līnijām nav jābūt vienlaidu!'] },
        { img: 'l1-c1.png', say: ['What turns a circle into an acorn?', 'Что превратит круг в жёлудь?', 'Kas pārvērtīs apli par zīli?'],
          quiz: { opts: [[['🎩 A little cap and a stem', '🎩 Шапочка и хвостик', '🎩 Cepurīte un kātiņš'], 1], [['🕐 Two hands', '🕐 Две стрелки', '🕐 Divi rādītāji'], 0], [['☀ Rays', '☀ Лучи', '☀ Stari'], 0]],
            yes: ['Exactly! Two small details — and it’s an acorn.', 'Точно! Две маленькие детали — и это жёлудь.', 'Tieši tā! Divas mazas detaļas — un tā ir zīle.'],
            no: ['That’s a different thing! An acorn needs a little cap and a stem.', 'Это уже другая вещь! Жёлудю нужны шапочка и хвостик.', 'Tā jau ir cita lieta! Zīlei vajag cepurīti un kātiņu.'] } },
        { say: ['Game! Find the three details that turned this cylinder into a mug of tea.', 'Игра! Найди три детали, которые превратили цилиндр в кружку чая.', 'Spēle! Atrodi trīs detaļas, kas pārvērta cilindru par tējas krūzi.'],
          find: { parts: [
            ['handle', `${W(128, 80, 40, 60)}<path class="ln" d="M130 88 c34 -6 34 50 -2 46"/>`, ['handle', 'ручка', 'rokturis']],
            ['bag', `${W(60, 60, 34, 70)}<path class="ln" d="M70 64 L74 104"/><rect x="66" y="104" width="16" height="18"/>`, ['tea bag', 'чайный пакетик', 'tējas maisiņš']],
            ['steam', `${W(80, 6, 50, 50)}<path class="ln" d="M92 50 q-8 -10 0 -20 t0 -20 M112 50 q-8 -10 0 -20 t0 -20"/>`, ['steam', 'пар', 'tvaiks']]],
            deco: '<ellipse cx="96" cy="64" rx="34" ry="8" fill="none" stroke="#2B1A51" stroke-width="3"/><path d="M62 64 L66 160 Q96 172 126 160 L130 64" fill="none" stroke="#2B1A51" stroke-width="3"/>' } },
        { img: 'l1-c3.png', say: ['On paper: draw three identical circles and turn each into something different with details. What will they become?', 'На бумаге: нарисуй три одинаковых круга и преврати каждый деталями во что-то своё. Чем они станут?', 'Uz papīra: uzzīmē trīs vienādus apļus un ar detaļām pārvērt katru par kaut ko citu. Par ko tie kļūs?'],
          paper: { min: 3, opts: [['an acorn', 'жёлудь', 'zīle'], ['a button', 'пуговица', 'poga'], ['the moon', 'луна', 'mēness'], ['a cookie', 'печенье', 'cepums'], ['a plate', 'тарелка', 'šķīvis'], ['a clock', 'часы', 'pulkstenis']] } },
        { say: ['I collect shiny acorns… but there’s so much round stuff around! Show me what else can come out of a circle.', 'Я собираю блестящие жёлуди… но вокруг столько круглого! Покажи, что ещё можно сделать из круга.', 'Es vācu spīdīgas zīles… bet apkārt ir tik daudz apaļa! Parādi, kas vēl var iznākt no apļa.'],
          client: { card: 'fall-2025/38.jpg', name: ['Tim Froggucion', 'Тим Фроггуччино', 'Tims Froggucion'], job: ['acorn collector', 'собирает блестящие жёлуди', 'vāc spīdīgas zīles'],
            task: [['Draw three identical circles in a row.', 'Нарисуй в ряд три одинаковых круга.', 'Uzzīmē rindā trīs vienādus apļus.'],
              ['With details, turn them into: {picked}.', 'Деталями преврати их в: {picked}.', 'Ar detaļām pārvērt tos par: {picked}.'], PHOTO] } },
      ] },

    { // 8 — Цилиндры
      name: ['Cylinders', 'Цилиндры', 'Cilindri'], icon: '▥',
      steps: [
        { img: 'l8-b.png', say: ['I forgot to tell you about cylinders! It’s simple: a rectangle and two ovals.', 'Я забыла рассказать про цилиндры! Это просто: прямоугольник и два овала.', 'Es aizmirsu pastāstīt par cilindriem! Tas ir vienkārši: taisnstūris un divi ovāli.'] },
        { img: 'l8-b.png', say: ['The top oval is seen whole, the bottom one only by its front half. The back half — skip it or erase it.', 'Верхний овал виден целиком, нижний — только передняя половинка. Заднюю — не рисуй или сотри.', 'Augšējais ovāls redzams viss, apakšējais — tikai priekšējā puse. Aizmugurējo — nezīmē vai izdzēs.'] },
        { img: 'l8-a.png', say: ['A cylinder has a shadow too: light on one side, shadow on the other. Hatch along the cylinder — or try dots and stripes.', 'У цилиндра тоже есть тень: свет с одной стороны, тень с другой. Штрихуй вдоль цилиндра — или попробуй точки и полоски.', 'Arī cilindram ir ēna: gaisma no vienas puses, ēna no otras. Svītro gar cilindru — vai pamēģini punktus un strīpas.'] },
        { img: 'l8-a.png', say: ['Which of these is a cylinder?', 'Что из этого — цилиндр?', 'Kas no šī ir cilindrs?'],
          quiz: { opts: [[['⚽ A ball', '⚽ Мяч', '⚽ Bumba'], 0], [['🥫 A can', '🥫 Банка', '🥫 Bundža'], 1], [['📕 A book', '📕 Книга', '📕 Grāmata'], 0]],
            yes: ['Yes! Cans, cups, bottles, vases — cylinders are everywhere.', 'Да! Банки, кружки, бутылки, вазы — цилиндры повсюду.', 'Jā! Bundžas, krūzes, pudeles, vāzes — cilindri ir visur.'],
            no: ['Look again: a can is a rectangle and two ovals — a cylinder!', 'Посмотри ещё раз: банка — это прямоугольник и два овала, то есть цилиндр!', 'Paskaties vēlreiz: bundža ir taisnstūris un divi ovāli — cilindrs!'] } },
        { say: ['Game! Find the parts of the cylinder: the top oval, the walls and the bottom curve.', 'Игра! Найди части цилиндра: верхний овал, стенки и нижнюю дугу.', 'Spēle! Atrodi cilindra daļas: augšējo ovālu, sienas un apakšējo loku.'],
          find: { parts: [
            ['top', '<ellipse cx="100" cy="40" rx="50" ry="14"/>', ['top oval', 'верхний овал', 'augšējais ovāls']],
            ['walls', `${W(44, 40, 14, 120)}${W(142, 40, 14, 120)}<path class="ln" d="M50 40 V150 M150 40 V150"/>`, ['walls', 'стенки', 'sienas']],
            ['bottom', `${W(48, 146, 104, 30)}<path class="ln" d="M50 150 Q100 178 150 150"/>`, ['bottom curve — only the front half!', 'нижняя дуга — только передняя половина!', 'apakšējais loks — tikai priekšējā puse!']]],
            deco: '<path d="M50 150 Q100 122 150 150" fill="none" stroke="#C9B8E0" stroke-width="1.5" stroke-dasharray="4 4"/>' } },
        { img: 'l8-b.png', say: ['On paper: draw two cylinder things from your kitchen. Which?', 'На бумаге: нарисуй две вещи-цилиндра со своей кухни. Какие?', 'Uz papīra: uzzīmē divas cilindra lietas no savas virtuves. Kuras?'],
          paper: { min: 2, opts: [['a mug', 'кружка', 'krūze'], ['a can', 'банка', 'bundža'], ['a glass', 'стакан', 'glāze'], ['a vase', 'ваза', 'vāze'], ['a candle', 'свеча', 'svece']] } },
        { say: ['Welcome to the first web-based coffee bar! Guests keep coming, and I’m short of dishes. Draw me some cylinder crockery — and no decaf, please.', 'Добро пожаловать в первую кофейню в паутине! Гости идут, а посуды не хватает. Нарисуй мне посуду-цилиндры — и никакого декафа.', 'Laipni lūdzam pirmajā tīmekļa kafejnīcā! Viesi nāk, bet trauku pietrūkst. Uzzīmē man cilindru traukus — un nekāda bezkofeīna.'],
          client: { card: 'halloween-2025/47.jpg', name: ['Dr. Dripsson', 'Доктор Дрипссон', 'Dr. Dripsons'], job: ['spider barista', 'паук-бариста', 'zirnekļa barista'],
            task: [['Draw {picked} — each from a rectangle and two ovals.', 'Нарисуй {picked} — каждую из прямоугольника и двух овалов.', 'Uzzīmē {picked} — katru no taisnstūra un diviem ovāliem.'],
              ['Add a shadow on one side and a detail — a handle, a label or steam.', 'Добавь тень с одной стороны и деталь — ручку, этикетку или пар.', 'Pievieno ēnu vienā pusē un detaļu — rokturi, etiķeti vai tvaiku.'], PHOTO] } },
      ] },

    { // 9 — Эллипсы
      name: ['Ellipses', 'Эллипсы', 'Elipses'], icon: '⬭',
      steps: [
        { art: cupArt(40), say: ['The opening of a cylinder changes when you move. Straight from above it’s a circle.', 'Отверстие цилиндра меняется, когда ты двигаешься. Прямо сверху — это круг.', 'Cilindra atvere mainās, kad tu kusties. Tieši no augšas tā ir aplis.'] },
        { art: cupArt(18), say: ['From an angle it becomes an oval. The lower your eyes, the flatter the oval.', 'Если смотреть наискосок — это овал. Чем ниже твои глаза, тем площе овал.', 'No slīpuma tā kļūst par ovālu. Jo zemāk tavas acis, jo plakanāks ovāls.'] },
        { art: cupArt(5), say: ['From the side — almost a line! Take an empty mug (don’t spill!) or a toilet paper roll and check it yourself.', 'Сбоку — почти линия! Возьми пустую кружку (не пролей!) или рулон бумаги и проверь.', 'No sāniem — gandrīz līnija! Paņem tukšu krūzi (neizlej!) vai papīra rulli un pārbaudi.'] },
        { art: cupArt(40), say: ['You’re looking at a mug straight from above. What is the opening?', 'Ты смотришь на кружку прямо сверху. Какое у неё отверстие?', 'Tu skaties uz krūzi tieši no augšas. Kāda ir tās atvere?'],
          quiz: { opts: [[['◯ A circle', '◯ Круг', '◯ Aplis'], 1], [['⬭ A flat oval', '⬭ Плоский овал', '⬭ Plakans ovāls'], 0], [['— A line', '— Линия', '— Līnija'], 0]],
            yes: ['Yes! From above — a round circle.', 'Да! Сверху — круглый круг.', 'Jā! No augšas — apaļš aplis.'],
            no: ['From above the opening is a full circle — try it with a real mug!', 'Сверху отверстие — полный круг. Проверь на настоящей кружке!', 'No augšas atvere ir pilns aplis — pārbaudi ar īstu krūzi!'] } },
        { say: ['Game! Three cups from different heights. Tap each opening.', 'Игра! Три чашки с разной высоты. Нажми на каждое отверстие.', 'Spēle! Trīs tases no dažāda augstuma. Pieskaries katrai atverei.'],
          find: { parts: [
            ['e1', '<ellipse cx="40" cy="70" rx="26" ry="18"/>', ['seen from high above — round', 'вид сверху — круглое', 'no augšas — apaļa']],
            ['e2', '<ellipse cx="100" cy="70" rx="26" ry="9"/>', ['at an angle — an oval', 'наискосок — овал', 'slīpi — ovāls']],
            ['e3', `${W(132, 63, 56, 14)}<ellipse cx="160" cy="70" rx="26" ry="3"/>`, ['from the side — almost a line', 'сбоку — почти линия', 'no sāniem — gandrīz līnija']]],
            deco: '<path d="M14 70 L18 118 A22 17 0 0 0 62 118 L66 70 M74 70 L78 130 A22 9 0 0 0 122 130 L126 70 M134 70 L138 138 A22 3 0 0 0 182 138 L186 70" fill="none" stroke="#2B1A51" stroke-width="3"/>' } },
        { art: cupArt(18), say: ['On paper: draw one mug (or a bowl) from different heights. Which views?', 'На бумаге: нарисуй одну кружку (или миску) с разной высоты. Какие виды?', 'Uz papīra: uzzīmē vienu krūzi (vai bļodu) no dažāda augstuma. Kādus skatus?'],
          paper: { min: 2, opts: [['from above', 'сверху', 'no augšas'], ['at an angle', 'наискосок', 'slīpi'], ['from the side', 'сбоку', 'no sāniem']] } },
        { say: ['Darling! I save every snack for a rainy day and dip it in a fresh puddle. Draw my mug and my bowl — from different sides, so I can admire them.', 'Дорогуша! Я берегу угощения на дождливый день и макаю их в свежую лужу. Нарисуй мою кружку и миску — с разных сторон, чтобы я ими любовалась.', 'Mīļumiņ! Es taupu kārumus lietainai dienai un mērcēju tos svaigā peļķē. Uzzīmē manu krūzi un bļodu — no dažādām pusēm, lai varu tās apbrīnot.'],
          client: { card: 'classic/23.jpg', name: ['Lady Puddle-Dip', 'Леди Лужемак', 'Lēdija Puddle-Dip'], job: ['gourmet', 'гурман', 'gardēde'],
            task: [['Draw a mug or a bowl: {picked}.', 'Нарисуй кружку или миску: {picked}.', 'Uzzīmē krūzi vai bļodu: {picked}.'],
              ['Watch how the oval of the opening changes from view to view.', 'Следи, как меняется овал отверстия от вида к виду.', 'Vēro, kā mainās atveres ovāls no skata uz skatu.'], PHOTO] } },
      ] },

    { // 10 — Секреты
      name: ['Pro secrets', 'Секреты', 'Noslēpumi'], icon: '★',
      steps: [
        { img: 'l10-a.png', say: ['A couple of pro secrets. When shapes stand close, a small shadow appears between them. It glues them together.', 'Пара секретов мастеров. Когда фигуры стоят рядом, между ними появляется маленькая тень. Она их склеивает.', 'Pāris meistaru noslēpumu. Kad figūras stāv blakus, starp tām parādās maza ēna. Tā tās salīmē kopā.'] },
        { img: 'l10-a.png', say: ['And don’t let edges just touch — that’s a “no!”. Either leave a gap, or let one shape step behind the other.', 'И не давай краям просто касаться — это «нет!». Либо оставь зазор, либо пусть одна фигура зайдёт за другую.', 'Un neļauj malām vienkārši pieskarties — tas ir “nē!”. Vai nu atstāj atstarpi, vai lai viena figūra ieiet aiz otras.'] },
        { img: 'l10-a.png', say: ['A circle and a square stand side by side. What’s best?', 'Круг и квадрат стоят рядом. Как лучше?', 'Aplis un kvadrāts stāv blakus. Kā labāk?'],
          quiz: { opts: [[['Edges just touch', 'Касаются краями', 'Malas tikai pieskaras'], 0], [['A small gap — or one overlaps', 'Зазор — или один заходит за другой', 'Atstarpe — vai viens ieiet aiz otra'], 1]],
            yes: ['A pro answer!', 'Ответ мастера!', 'Meistara atbilde!'],
            no: ['Touching edges look stuck. Leave a gap or overlap them.', 'Касание краями выглядит как ошибка. Лучше зазор или перекрытие.', 'Pieskaršanās ar malām izskatās kā kļūda. Labāk atstarpe vai pārklāšanās.'] } },
        { say: ['Game! Find the three small shadows that glue this still life together.', 'Игра! Найди три маленькие тени, которые склеивают этот натюрморт.', 'Spēle! Atrodi trīs mazās ēnas, kas salīmē šo klusās dabas ainu.'],
          find: { parts: [
            ['s1', '<path class="sh" d="M80 80 A38 38 0 0 1 70 148.7 L96 150 Q120 112 90 77 Z"/>', ['shadow between the ball and the box', 'тень между шаром и коробкой', 'ēna starp bumbu un kasti']],
            ['s2', '<path class="sh" d="M52 150 H132 L148 159 H68 Z"/>', ['shadow under the objects', 'тень под предметами', 'ēna zem lietām']],
            ['s3', '<path class="sh" d="M136 150 H178 L190 159 H150 Z"/>', ['shadow behind the bottle', 'тень за бутылкой', 'ēna aiz pudeles']]],
            deco: '<rect x="80" y="62" width="60" height="88" fill="none" stroke="#2B1A51" stroke-width="3"/><circle cx="60" cy="112" r="38" fill="#fff" stroke="#2B1A51" stroke-width="3"/><path d="M132 150 V96 q0 -10 6 -14 V60 h8 v22 q6 4 6 14 V150 Z" fill="#fff" stroke="#2B1A51" stroke-width="3"/>' } },
        { img: 'l10-a.png', say: ['On paper: a little still life — three things next to each other, overlapping or with gaps. Which?', 'На бумаге: маленький натюрморт — три вещи рядом, внахлёст или с зазором. Какие?', 'Uz papīra: maza klusā daba — trīs lietas blakus, pārklājoties vai ar atstarpi. Kuras?'],
          paper: { min: 3, opts: [['a bun', 'булочка', 'bulciņa'], ['a baguette', 'багет', 'bagete'], ['a cupcake', 'кекс', 'keksiņš'], ['a jar of jam', 'банка варенья', 'ievārījuma burka'], ['a mug', 'кружка', 'krūze']] } },
        { say: ['Hello, sweetie! I want a beautiful shop window. Draw me pastries standing together, a little behind one another — like at my bakery.', 'Здравствуй, солнышко! Хочу красивую витрину. Нарисуй мне выпечку, которая стоит рядом и чуть заходит друг за друга, — как у меня в пекарне.', 'Sveiks, saulīt! Gribu skaistu skatlogu. Uzzīmē man smalkmaizītes, kas stāv blakus un mazliet aizsedz viena otru, — kā manā maiznīcā.'],
          client: { card: 'classic/13.jpg', name: ['Miss Peony', 'Мисс Пиони', 'Miss Peony'], job: ['bakery seller', 'продавщица в пекарне', 'maiznīcas pārdevēja'],
            task: [['Draw {picked} side by side, like in a shop window.', 'Нарисуй рядом {picked}, как на витрине.', 'Uzzīmē blakus {picked}, kā skatlogā.'],
              ['Let them overlap or leave gaps — no touching edges. Add small shadows between them.', 'Пусть они заходят друг за друга или стоят с зазором — без касания краями. Добавь маленькие тени между ними.', 'Lai tās pārklājas vai stāv ar atstarpi — bez malu pieskaršanās. Pievieno mazas ēnas starp tām.'], PHOTO] } },
      ] },

    { // 11 — Композиция
      name: ['Composition', 'Композиция', 'Kompozīcija'], icon: '▤',
      steps: [
        { img: 'l11-b.png', say: ['Composition is how you arrange everything on the page. An apple right in the middle is fine — but we can do better.', 'Композиция — это то, как ты раскладываешь всё на листе. Яблоко ровно посередине — нормально, но можно интереснее.', 'Kompozīcija ir tas, kā tu visu izkārto uz lapas. Ābols tieši vidū — ir labi, bet var interesantāk.'] },
        { img: 'l11-b.png', say: ['Move it to a corner — asymmetry. Add some text — balance. Come closer — let the apple not even fit on the page!', 'Сдвинь его в угол — асимметрия. Добавь текст — баланс. Подойди ближе — пусть яблоко даже не помещается целиком!', 'Pabīdi to uz stūri — asimetrija. Pievieno tekstu — līdzsvars. Pienāc tuvāk — lai ābols pat neietilpst pilnībā!'] },
        { img: 'l11-a.png', say: ['Add words, stickers, different fonts. And leave some empty space — a drawing needs to breathe.', 'Добавь надписи, наклейки, разные шрифты. И оставь пустое место — рисунку нужно дышать.', 'Pievieno uzrakstus, uzlīmes, dažādus fontus. Un atstāj tukšu vietu — zīmējumam vajag elpot.'] },
        { img: 'l11-b.png', say: ['Where is a single small object more interesting?', 'Где один маленький предмет смотрится интереснее?', 'Kur viens mazs priekšmets izskatās interesantāk?'],
          quiz: { opts: [[['Exactly in the centre', 'Ровно в центре', 'Tieši centrā'], 0], [['Nearer a corner, with empty space', 'Ближе к углу, с пустым местом', 'Tuvāk stūrim, ar tukšu vietu'], 1]],
            yes: ['Yes! Empty space makes the object the star.', 'Да! Пустое место делает предмет звездой.', 'Jā! Tukša vieta padara priekšmetu par zvaigzni.'],
            no: ['The centre is calm, but a little off-centre with empty space is more alive.', 'Центр — спокойно, но чуть в сторону и с пустым местом — живее.', 'Centrs ir mierīgs, bet mazliet sānis un ar tukšu vietu — dzīvāk.'] } },
        { say: ['Game! A sketchbook page. Find the object, the title and the sticker.', 'Игра! Страница скетчбука. Найди предмет, надпись и наклейку.', 'Spēle! Skiču burtnīcas lapa. Atrodi priekšmetu, uzrakstu un uzlīmi.'],
          find: { parts: [
            ['obj', '<path d="M30 175 C10 140 20 100 55 100 C70 100 75 108 80 108 C85 108 92 100 105 100 C135 100 140 145 120 175 Z"/><path class="ln" d="M80 108 C80 90 86 80 96 74"/>', ['the object — big and close', 'предмет — крупно и близко', 'priekšmets — liels un tuvu']],
            ['title', `${W(110, 22, 80, 50)}<text x="150" y="44" text-anchor="middle" font-size="18" font-family="Georgia" fill="#2B1A51" stroke="none">Hello,</text><text x="150" y="64" text-anchor="middle" font-size="18" font-family="Georgia" fill="#2B1A51" stroke="none">apple</text>`, ['the title', 'надпись', 'uzraksts']],
            ['stick', '<circle cx="160" cy="130" r="16"/><circle cx="160" cy="130" r="5"/>', ['the sticker', 'наклейка', 'uzlīme']]],
            deco: '<rect x="6" y="6" width="188" height="178" fill="none" stroke="#2B1A51" stroke-width="2"/><path d="M100 6 V184" stroke="#2B1A51" stroke-width="2"/>' } },
        { img: 'l11-a.png', say: ['On paper: one object — but with composition. Which tricks will you use?', 'На бумаге: один предмет — но с композицией. Какие приёмы используешь?', 'Uz papīra: viens priekšmets — bet ar kompozīciju. Kādus paņēmienus izmantosi?'],
          paper: { min: 2, opts: [['asymmetry', 'асимметрия', 'asimetrija'], ['a close-up', 'крупный план', 'tuvplāns'], ['a title', 'надпись', 'uzraksts'], ['a sticker', 'наклейка', 'uzlīme'], ['a page split in two', 'лист на две части', 'lapa divās daļās']] } },
        { say: ['Hi, lovelies! My blog “Life in the Sugar Lane” is bored without a pretty page. Draw me just one thing — but with composition!', 'Привет, мои сладкие! Мой блог «Жизнь на Сахарной улице» скучает без красивой страницы. Нарисуй мне всего одну вещь — но с композицией!', 'Sveiki, mīļumiņi! Mans blogs “Dzīve Cukura ielā” garlaikojas bez skaistas lapas. Uzzīmē man tikai vienu lietu — bet ar kompozīciju!'],
          client: { card: 'halloween-2025/49.jpg', name: ['Candice Creepleton', 'Кэндис Криплтон', 'Kendisa Creepleton'], job: ['blogger, “Life in the Sugar Lane”', 'блогер, «Жизнь на Сахарной улице»', 'blogere, “Dzīve Cukura ielā”'],
            task: [['Draw a whole page or a sketchbook spread about one object of your choice — it must be the main hero.', 'Нарисуй целую страницу или разворот в скетчбуке про один любой предмет — он должен быть главным.', 'Uzzīmē veselu lapu vai skiču burtnīcas atvērumu par vienu priekšmetu pēc izvēles — tam jābūt galvenajam.'],
              ['Choose the best way to place it on the page and use: {picked}.', 'Выбери, как лучше разместить его на странице, и используй: {picked}.', 'Izvēlies, kā to labāk izvietot lapā, un izmanto: {picked}.'],
              ['Add captions and small mini-sketches around it — and leave some empty space so the page can breathe.', 'Добавь к нему надписи и мини-зарисовки — и оставь пустое место, чтобы страница дышала.', 'Pievieno tam uzrakstus un mazas mini skices — un atstāj tukšu vietu, lai lapa varētu elpot.'], PHOTO] } },
      ] },

    { // 12 — Коллаж
      name: ['Collage', 'Коллаж', 'Kolāža'], icon: '✂',
      steps: [
        { img: 'l12-a.png', say: ['The last lesson! A sketch is freedom: you don’t have to draw only what’s in front of you right now.', 'Последний урок! Скетч — это свобода: не обязательно рисовать только то, что перед тобой прямо сейчас.', 'Pēdējā nodarbība! Skice ir brīvība: nav obligāti zīmēt tikai to, kas ir tev priekšā tieši tagad.'] },
        { img: 'l12-a.png', say: ['Take three things you love — from a photo, from the window, from your table — and gather them on one page. Add a caption.', 'Возьми три вещи, которые любишь, — с фото, из окна, со стола — и собери их на одной странице. Добавь подпись.', 'Paņem trīs lietas, kuras mīli, — no foto, no loga, no galda — un savāc tās vienā lapā. Pievieno parakstu.'] },
        { img: 'l12-a.png', say: ['What can you mix in a collage?', 'Что можно смешивать в коллаже?', 'Ko var jaukt kolāžā?'],
          quiz: { opts: [[['Only what’s on my table', 'Только то, что на столе', 'Tikai to, kas ir uz galda'], 0], [['Anything I love', 'Всё, что люблю', 'Visu, ko mīlu'], 1], [['Only photos', 'Только фото', 'Tikai foto'], 0]],
            yes: ['Yes! A sketchbook is a place for everything you love.', 'Да! Скетчбук — место для всего, что ты любишь.', 'Jā! Skiču burtnīca ir vieta visam, ko tu mīli.'],
            no: ['No limits here — anything you love can go into a collage.', 'Тут нет границ — в коллаж можно всё, что любишь.', 'Te nav robežu — kolāžā var visu, ko mīli.'] } },
        { img: 'l12-a.png', say: ['On paper: a collage page. What goes in?', 'На бумаге: страница-коллаж. Что в неё войдёт?', 'Uz papīra: kolāžas lapa. Kas tajā būs?'],
          paper: { min: 3, opts: [['favourite food', 'любимая еда', 'mīļākais ēdiens'], ['the view from a window', 'вид из окна', 'skats pa logu'], ['a mug', 'кружка', 'krūze'], ['a plant', 'растение', 'augs'], ['a pet', 'питомец', 'mājdzīvnieks'], ['something from childhood', 'вещь из детства', 'lieta no bērnības']] } },
        { say: ['Good evening! I teach etiquette to witches and ghosts, and my recipe book needs a cover. Make me a collage of your favourite things — elegantly!', 'Добрый вечер! Я учу этикету ведьм и призраков, и моей книге рецептов нужна обложка. Собери мне коллаж из своих любимых вещей — элегантно!', 'Labvakar! Es mācu etiķeti raganām un spokiem, un manai recepšu grāmatai vajag vāku. Saliec man kolāžu no savām mīļākajām lietām — eleganti!'],
          client: { card: 'halloween-2025/46.jpg', name: ['Miss Pumpkinella', 'Мисс Тыквелла', 'Mis Pumpkinella'], job: ['etiquette teacher for witches and ghosts', 'учит этикету ведьм и призраков', 'māca etiķeti raganām un spokiem'],
            task: [['Gather on one page: {picked}.', 'Собери на одной странице: {picked}.', 'Savāc vienā lapā: {picked}.'],
              ['Add a title or a caption, and small shadows between the things.', 'Добавь заголовок или подпись и маленькие тени между вещами.', 'Pievieno virsrakstu vai parakstu un mazas ēnas starp lietām.'], PHOTO] } },
      ] },
  ];
})();
