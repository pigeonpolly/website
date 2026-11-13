// Курс туши, урок 5 — «Штриховка и „шум“» (книга «Ink Sketching», с. 37–38). Формат — worker/ink/index.js.
const F = (img, cap) => `<figure><img src="/images/ink/${img}" alt="" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
export default {
  icon: '▤', card: 'fall-2025/39.jpg', cover: 'p37-61.jpg',
  en: {
    name: 'Hatching and “noise”',
    intro: 'Ink is only black, yet a sketch can hold a hundred greys. The secret is in the spacing between strokes. Today — hatching, its rhythm, and a little useful “dirt”.',
    goals: ['build tone with the distance between lines', 'use contour hatching and cross-hatching', 'add texture with restrained visual noise'],
    th: `<p>Ink can’t be lighter or darker — it is black. Grey appears in the eye: <b>optical mixing</b>. The farther apart the lines, the lighter the area; the closer, the darker. You don’t press harder — you change the spacing.</p>
${F('p38-63.jpg', 'One pen, parallel lines only: the tone changes with the spacing')}
<h4>Contour hatching</h4>
<p>Lines that follow the form — around a ball, along a cylinder — turn a flat shape into a volume. You don’t have to cover everything: a few strokes on the <b>border of light and shadow</b> are enough, the eye completes the rest.</p>
${F('p37-61.jpg', 'Straight lines keep the circle flat; lines that wrap around it make a ball')}
<h4>Cross-hatching</h4>
<p>A second layer on top of the first gives a deeper shadow. Turn it only <b>15–30°</b>, not a 90° grid — a grid looks like a fishing net, while small angles give velvety shadows. Each new layer — a little turn more.</p>
<h4>Other strokes</h4>
<ul><li><b>Scribbles</b> — loose loops for foliage and bushes.</li>
<li><b>Dots (stippling)</b> — soft transitions, fog, skin. Slow, but very gentle.</li>
<li><b>Short strokes</b> — fur, grass, a rough coat.</li></ul>
<h4>Rhythm</h4>
<p>Hatching is music. Fast strokes are sharp and light; slow ones are heavy and dense. The white paper between them is the pause. Keep one direction inside one area, change it where the plane changes.</p>
<h4>Visual noise</h4>
<p>A perfectly even hatching looks like a printed pattern. A little “noise” makes it a material:</p>
<ul><li>dots inside the hatching;</li>
<li>a few “scratches” against the direction;</li>
<li>tiny white gaps inside black — granite, asphalt;</li>
<li>specks in light areas — dust, sand, stubble.</li></ul>
<p>Noise goes <b>only where the viewer should feel the texture</b>, and sparingly. Dots also soften the edge of a shadow — no hard border needed.</p>
${F('p31-45.jpg', 'Hatching models the face; the background stays quiet')}`,
    simple: 'Tone in ink = spacing between strokes. Hatching that follows the form gives volume; cross-hatching — turn 15–30°, not a grid. Scribbles for leaves, dots for softness, short strokes for fur. A little noise where texture matters — and white paper for pauses.',
    mist: [['Pressing harder to get a darker tone.', 'Bring the lines closer together or add a layer — the pen stays the same.'],
      ['Cross-hatching as a 90° grid.', 'Turn each new layer only 15–30° — the shadow becomes velvet, not a net.'],
      ['Hatching the whole object evenly.', 'Hatch the border of light and shadow; leave the lit part as white paper.'],
      ['Noise everywhere.', 'Only where the texture matters, and sparingly — otherwise it is just dirt.']],
    terms: [['Optical mixing', 'black lines and white paper read as grey from a distance'], ['Hatching', 'parallel lines that build tone'], ['Contour hatching', 'lines that follow the form'], ['Cross-hatching', 'layers of hatching at a small angle to each other'], ['Stippling', 'tone made with dots'], ['Visual noise', 'small dots and scratches that make a surface feel real'], ['Value scale', 'a strip of steps from light to dark']],
    fact: 'Old banknotes and engravings were printed only in black — all their faces, clouds and folds are hatching. Engravers spent years learning to bend one line so it reads as a cheek.',
    test: [['How do you make an area darker with the same pen?', 'Bring the lines closer together', 'Press as hard as possible', 'Use thicker paper', 'Tone in ink comes from the spacing between strokes.'],
      ['What does hatching that follows the form do?', 'Turns a flat shape into a volume', 'Makes the drawing flat and decorative', 'Hides mistakes', 'Lines wrapping around a ball tell the eye it is round.'],
      ['At what angle is the next cross-hatching layer best turned?', '15–30°', 'Exactly 90°', '180°', 'A small angle gives soft, velvety shadows; a grid looks like a net.'],
      ['Which stroke suits fog and soft transitions?', 'Dots', 'Long sharp lines', 'Bold scribbles', 'Dots build tone gently, without hard edges.'],
      ['Where should visual noise go?', 'Only where the viewer should feel the texture', 'Evenly across the whole page', 'Only in the sky', 'Restrained noise reads as material, too much — as dirt.'],
      ['What is the white paper between strokes in rhythm?', 'A pause', 'A mistake', 'An unfinished area', 'Like silence in music, white gives the hatching air.']],
    task: { h: 'A five-step value scale', need: 'one liner or pen, a ruler or a steady hand, a sketchbook page', time: '20 min',
      steps: ['Draw a long rectangle and divide it into five sections.', 'Leave the first one white. Fill the others with parallel lines only — no cross-hatching!', 'Each section darker than the previous: change only the distance between lines, not the pressure.', 'Squint at it: do the five steps read evenly? Fix the step that jumps.', 'Next to it, draw a ball with contour hatching — use your scale: lit side — section 1–2, shadow — 4–5. Add a little noise (dots) at the shadow edge.'] },
    client: { name: 'Wolly Polly', job: 'knits autumn, stitch by stitch', say: 'Every scarf I knit is rhythm: knit, purl, knit, purl — tighter where it should be warm, looser where it should breathe. Your hatching is the same, isn’t it? Draw me a scale from light to dark, and then my ball of yarn — round, cosy, with the right shadow.',
      ask: ['A five-step scale, parallel lines only', 'A ball of yarn (or any ball) with contour hatching', 'A little noise only where it matters'] },
  },
  ru: {
    name: 'Штриховка и «шум»',
    intro: 'Тушь бывает только чёрной, а в скетче могут жить сто оттенков серого. Секрет — в расстоянии между штрихами. Сегодня штриховка, её ритм и немножко полезной «грязи».',
    goals: ['строить тон расстоянием между линиями', 'штриховать по форме и перекрёстно', 'добавлять фактуру сдержанным визуальным шумом'],
    th: `<p>Тушь не бывает светлее или темнее — она чёрная. Серый рождается в глазу: <b>оптическое смешение</b>. Чем реже линии, тем светлее место; чем гуще — тем темнее. Не давишь сильнее — меняешь расстояние.</p>
${F('p38-63.jpg', 'Одна ручка, только параллельные линии: тон меняется расстоянием')}
<h4>Штриховка по форме</h4>
<p>Линии, которые идут по форме — вокруг шара, вдоль цилиндра, — превращают плоскую фигуру в объём. Закрывать всё не нужно: хватит нескольких штрихов на <b>границе света и тени</b>, остальное глаз достроит.</p>
${F('p37-61.jpg', 'Прямые линии оставляют круг плоским; линии, огибающие его, делают шар')}
<h4>Перекрёстная штриховка</h4>
<p>Второй слой поверх первого даёт более глубокую тень. Поворачивай его всего на <b>15–30°</b>, а не сеткой под 90° — сетка похожа на рыболовную, а маленькие углы дают бархатные тени. Каждый новый слой — ещё чуть-чуть поворота.</p>
<h4>Другие штрихи</h4>
<ul><li><b>Каракули</b> — свободные петли для листвы и кустов.</li>
<li><b>Точки</b> — мягкие переходы, туман, кожа. Долго, но очень нежно.</li>
<li><b>Короткие штрихи</b> — мех, трава, грубая шерсть.</li></ul>
<h4>Ритм</h4>
<p>Штриховка — это музыка. Быстрые штрихи — острые и лёгкие, медленные — тяжёлые и плотные. Белая бумага между ними — пауза. Внутри одной плоскости держи одно направление, меняй его там, где меняется плоскость.</p>
<h4>Визуальный шум</h4>
<p>Идеально ровная штриховка похожа на печатный узор. Немного «шума» превращает её в материал:</p>
<ul><li>точки внутри штриховки;</li>
<li>несколько «царапин» против направления;</li>
<li>крошечные белые просветы в чёрном — гранит, асфальт;</li>
<li>крапинки на светлом — пыль, песок, щетина.</li></ul>
<p>Шум — <b>только там, где зритель должен «почувствовать» фактуру</b>, и сдержанно. Точки ещё и смягчают край тени — жёсткая граница не нужна.</p>
${F('p31-45.jpg', 'Штриховка лепит лицо, фон остаётся тихим')}`,
    simple: 'Тон в туши = расстояние между штрихами. Штриховка по форме даёт объём; перекрёстная — поворот на 15–30°, не сетка. Каракули — листва, точки — мягкость, короткие штрихи — мех. Немного шума там, где важна фактура, — и белая бумага для пауз.',
    mist: [['Давить сильнее, чтобы стало темнее.', 'Сблизь линии или добавь слой — ручка остаётся та же.'],
      ['Перекрёстная штриховка сеткой под 90°.', 'Поворачивай каждый новый слой всего на 15–30° — тень станет бархатной, а не сеткой.'],
      ['Ровно заштриховать весь предмет.', 'Штрихуй границу света и тени; освещённое оставь белой бумагой.'],
      ['Шум везде.', 'Только там, где важна фактура, и сдержанно — иначе это просто грязь.']],
    terms: [['Оптическое смешение', 'чёрные линии и белая бумага издали читаются как серый'], ['Штриховка', 'параллельные линии, которые строят тон'], ['Штриховка по форме', 'линии идут вдоль формы'], ['Перекрёстная штриховка', 'слои штриховки под небольшим углом друг к другу'], ['Пуантилизм, точки', 'тон, построенный точками'], ['Визуальный шум', 'мелкие точки и царапины, от которых поверхность кажется настоящей'], ['Тоновая шкала', 'полоска ступеней от светлого к тёмному']],
    fact: 'Старые банкноты и гравюры печатали только чёрным — все их лица, облака и складки сделаны штриховкой. Граверы годами учились изгибать одну линию так, чтобы она читалась как щека.',
    test: [['Как сделать место темнее той же ручкой?', 'Сблизить линии', 'Давить изо всех сил', 'Взять бумагу плотнее', 'Тон в туши — от расстояния между штрихами.'],
      ['Что даёт штриховка по форме?', 'Превращает плоскую фигуру в объём', 'Делает рисунок плоским и декоративным', 'Прячет ошибки', 'Линии, огибающие шар, говорят глазу, что он круглый.'],
      ['На какой угол лучше повернуть следующий слой перекрёстной штриховки?', '15–30°', 'Ровно 90°', '180°', 'Маленький угол даёт мягкие бархатные тени, сетка — похожа на сеть.'],
      ['Какой штрих подходит для тумана и мягких переходов?', 'Точки', 'Длинные острые линии', 'Жирные каракули', 'Точки строят тон мягко, без жёстких краёв.'],
      ['Где нужен визуальный шум?', 'Только там, где зритель должен почувствовать фактуру', 'Равномерно по всему листу', 'Только в небе', 'Сдержанный шум читается как материал, лишний — как грязь.'],
      ['Чем в ритме штриховки служит белая бумага между штрихами?', 'Паузой', 'Ошибкой', 'Недоделанным местом', 'Как тишина в музыке, белое даёт штриховке воздух.']],
    task: { h: 'Тоновая шкала в пять ступеней', need: 'один линер или ручка, линейка или твёрдая рука, страница скетчбука', time: '20 мин',
      steps: ['Нарисуй длинный прямоугольник и раздели его на пять секций.', 'Первую оставь белой. Остальные заполни только параллельными линиями — без перекрёстной штриховки!', 'Каждая секция темнее предыдущей: меняй только расстояние между линиями, а не нажим.', 'Прищурься: пять ступеней читаются ровно? Поправь ту, что «прыгает».', 'Рядом нарисуй шар со штриховкой по форме — по своей шкале: свет — секции 1–2, тень — 4–5. Добавь чуть-чуть шума (точки) на краю тени.'] },
    client: { name: 'Полли-Вязалка', job: 'вяжет осень петелька за петелькой', say: 'Каждый мой шарф — это ритм: лицевая, изнаночная, лицевая, изнаночная — плотнее, где должно греть, свободнее, где должно дышать. Твоя штриховка ведь такая же? Нарисуй мне шкалу от светлого к тёмному, а потом мой клубок — круглый, уютный, с правильной тенью.',
      ask: ['Шкала в пять ступеней, только параллельные линии', 'Клубок (или любой шар) со штриховкой по форме', 'Немножко шума — только там, где нужно'] },
  },
  lv: {
    name: 'Svītrojums un “troksnis”',
    intro: 'Tuša ir tikai melna, bet skicē var dzīvot simts pelēko toņu. Noslēpums — attālumā starp vilcieniem. Šodien svītrojums, tā ritms un mazliet noderīgu “netīrumu”.',
    goals: ['veidot toni ar attālumu starp līnijām', 'svītrot pa formu un krusteniski', 'pievienot faktūru ar atturīgu vizuālo troksni'],
    th: `<p>Tuša nevar būt gaišāka vai tumšāka — tā ir melna. Pelēkais rodas acī: <b>optiskā sajaukšanās</b>. Jo retākas līnijas, jo gaišāka vieta; jo biežākas — jo tumšāka. Nespied stiprāk — maini attālumu.</p>
${F('p38-63.jpg', 'Viena pildspalva, tikai paralēlas līnijas: tonis mainās ar attālumu')}
<h4>Svītrojums pa formu</h4>
<p>Līnijas, kas iet pa formu — apkārt bumbai, gar cilindru, — pārvērš plakanu figūru apjomā. Visu pārklāt nevajag: pietiek ar dažiem vilcieniem uz <b>gaismas un ēnas robežas</b>, pārējo acs pabeigs pati.</p>
${F('p37-61.jpg', 'Taisnas līnijas atstāj apli plakanu; līnijas, kas to apņem, rada bumbu')}
<h4>Krusteniskais svītrojums</h4>
<p>Otrs slānis virs pirmā dod dziļāku ēnu. Pagriez to tikai par <b>15–30°</b>, nevis 90° režģī — režģis izskatās pēc zvejas tīkla, bet mazi leņķi dod samtainas ēnas. Katrs jauns slānis — vēl mazliet pagrieziena.</p>
<h4>Citi vilcieni</h4>
<ul><li><b>Švīkājumi</b> — brīvas cilpas lapotnei un krūmiem.</li>
<li><b>Punkti</b> — mīkstas pārejas, migla, āda. Ilgi, bet ļoti maigi.</li>
<li><b>Īsi vilcieni</b> — kažoks, zāle, raupja vilna.</li></ul>
<h4>Ritms</h4>
<p>Svītrojums ir mūzika. Ātri vilcieni — asi un viegli, lēni — smagi un blīvi. Baltais papīrs starp tiem ir pauze. Vienā plaknē turi vienu virzienu, maini to tur, kur mainās plakne.</p>
<h4>Vizuālais troksnis</h4>
<p>Ideāli vienmērīgs svītrojums izskatās pēc drukāta raksta. Nedaudz “trokšņa” to pārvērš materiālā:</p>
<ul><li>punkti svītrojuma iekšā;</li>
<li>daži “skrāpējumi” pret virzienu;</li>
<li>sīkas baltas spraugas melnajā — granīts, asfalts;</li>
<li>raibumi gaišajā — putekļi, smiltis, rugāji.</li></ul>
<p>Troksnis — <b>tikai tur, kur skatītājam jā“sajūt” faktūra</b>, un atturīgi. Punkti arī mīkstina ēnas malu — cieta robeža nav vajadzīga.</p>
${F('p31-45.jpg', 'Svītrojums veido seju, fons paliek kluss')}`,
    simple: 'Tonis tušā = attālums starp vilcieniem. Svītrojums pa formu dod apjomu; krusteniskais — pagrieziens par 15–30°, ne režģis. Švīkājumi — lapotne, punkti — maigums, īsi vilcieni — kažoks. Mazliet trokšņa tur, kur svarīga faktūra, — un balts papīrs pauzēm.',
    mist: [['Spiest stiprāk, lai būtu tumšāk.', 'Satuvini līnijas vai pievieno slāni — pildspalva paliek tā pati.'],
      ['Krusteniskais svītrojums 90° režģī.', 'Pagriez katru jauno slāni tikai par 15–30° — ēna kļūs samtaina, nevis tīkls.'],
      ['Vienmērīgi nosvītrot visu priekšmetu.', 'Svītro gaismas un ēnas robežu; apgaismoto atstāj baltu.'],
      ['Troksnis visur.', 'Tikai tur, kur svarīga faktūra, un atturīgi — citādi tie ir vienkārši netīrumi.']],
    terms: [['Optiskā sajaukšanās', 'melnas līnijas un balts papīrs no attāluma nolasās kā pelēks'], ['Svītrojums', 'paralēlas līnijas, kas veido toni'], ['Svītrojums pa formu', 'līnijas iet gar formu'], ['Krusteniskais svītrojums', 'svītrojuma slāņi nelielā leņķī viens pret otru'], ['Punktējums', 'tonis, veidots ar punktiem'], ['Vizuālais troksnis', 'sīki punkti un skrāpējumi, no kuriem virsma šķiet īsta'], ['Toņu skala', 'josla ar pakāpēm no gaišā uz tumšo']],
    fact: 'Vecās banknotes un gravīras drukāja tikai melnā — visas to sejas, mākoņi un krokas ir svītrojums. Gravieri gadiem mācījās izliekt vienu līniju tā, lai tā nolasītos kā vaigs.',
    test: [['Kā padarīt vietu tumšāku ar to pašu pildspalvu?', 'Satuvināt līnijas', 'Spiest no visa spēka', 'Ņemt biezāku papīru', 'Tonis tušā rodas no attāluma starp vilcieniem.'],
      ['Ko dod svītrojums pa formu?', 'Pārvērš plakanu figūru apjomā', 'Padara zīmējumu plakanu un dekoratīvu', 'Paslēpj kļūdas', 'Līnijas, kas apņem bumbu, pasaka acij, ka tā ir apaļa.'],
      ['Par kādu leņķi labāk pagriezt nākamo krusteniskā svītrojuma slāni?', '15–30°', 'Tieši 90°', '180°', 'Mazs leņķis dod mīkstas, samtainas ēnas; režģis izskatās pēc tīkla.'],
      ['Kāds vilciens der miglai un mīkstām pārejām?', 'Punkti', 'Garas asas līnijas', 'Trekni švīkājumi', 'Punkti veido toni maigi, bez cietām malām.'],
      ['Kur vajadzīgs vizuālais troksnis?', 'Tikai tur, kur skatītājam jāsajūt faktūra', 'Vienmērīgi pa visu lapu', 'Tikai debesīs', 'Atturīgs troksnis nolasās kā materiāls, pārlieku — kā netīrumi.'],
      ['Kas svītrojuma ritmā ir baltais papīrs starp vilcieniem?', 'Pauze', 'Kļūda', 'Nepabeigta vieta', 'Kā klusums mūzikā, baltais dod svītrojumam gaisu.']],
    task: { h: 'Piecu pakāpju toņu skala', need: 'viens lainers vai pildspalva, lineāls vai stingra roka, skiču burtnīcas lapa', time: '20 min',
      steps: ['Uzzīmē garu taisnstūri un sadali to piecās daļās.', 'Pirmo atstāj baltu. Pārējās aizpildi tikai ar paralēlām līnijām — bez krusteniskā svītrojuma!', 'Katra daļa tumšāka par iepriekšējo: maini tikai attālumu starp līnijām, ne spiedienu.', 'Piemiedz acis: vai piecas pakāpes nolasās vienmērīgi? Izlabo to, kas “lec”.', 'Blakus uzzīmē bumbu ar svītrojumu pa formu — pēc savas skalas: gaisma — 1.–2. daļa, ēna — 4.–5. Pievieno mazliet trokšņa (punktus) ēnas malā.'] },
    client: { name: 'Adītāja Pollija', job: 'ada rudeni cilpu pa cilpai', say: 'Katra mana šalle ir ritms: labiskā, kreiliskā, labiskā, kreiliskā — blīvāk, kur jāsilda, brīvāk, kur jāelpo. Tavs svītrojums taču ir tāds pats? Uzzīmē man skalu no gaišā uz tumšo, un tad manu kamolu — apaļu, mājīgu, ar pareizu ēnu.',
      ask: ['Piecu pakāpju skala, tikai paralēlas līnijas', 'Kamols (vai jebkura bumba) ar svītrojumu pa formu', 'Mazliet trokšņa — tikai tur, kur vajag'] },
  },
};
