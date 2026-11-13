// Курс туши, урок 2 — «Скетч, а не рисунок» и корни скетчинга тушью (книга «Ink Sketching», с. 15–20). Формат — worker/ink/index.js.
const F = (img, cap) => `<figure><img src="/images/ink/${img}" alt="" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
export default {
  icon: '✎', card: 'fall-2025/40.jpg', cover: 'p17-13.jpg',
  en: {
    name: 'A sketch, not a drawing',
    intro: 'Today we learn to sprint, not to run a marathon. And we’ll peek into the past: Leonardo, Rembrandt, newspaper reporters and Japanese masters all helped invent the ink sketch.',
    goals: ['tell a sketch from a classical drawing', 'use the white of the paper as “active silence”', 'know where ink sketching comes from and its modern styles'],
    th: `<p><b>A sketch</b> is rapid visual shorthand. It captures not the object itself but your impression of it. If classical drawing is when you sit down “to work”, sketching is when you simply live — drink coffee, wait for a bus — and catch pieces of that life in ink.</p>
<h4>Sprint and marathon</h4>
<div class="tbl"><table><thead><tr><th></th><th>Sketch</th><th>Classical drawing</th></tr></thead><tbody>
<tr><td>Time</td><td>seconds to half an hour</td><td>hours or days</td></tr>
<tr><td>Goal</td><td>catch a moment before it “cools down”</td><td>a finished, polished result</td></tr>
<tr><td>Stages</td><td>none: every line is final</td><td>construction → refinement → detailing</td></tr>
<tr><td>Mistake</td><td>an invitation to be creative</td><td>an obstacle that spoils the result</td></tr>
<tr><td>Detail</td><td>only what matters, the rest dissolves</td><td>even detail across the whole sheet</td></tr></tbody></table></div>
<p>The biggest mistake is to step onto a 100-metre sprint with a marathon mindset. But “sprint” doesn’t mean a hand flapping like a fan. Sketching is not rushing — it is <b>compression</b>: you build the form and lay the final stroke at the same time.</p>
<h4>The right to be unfinished</h4>
<p>A sketch may stop at any point — the moment the thought has found its expression. You can draw a face with jeweller’s precision and let the shoulders dissolve into the white of the page. The white paper becomes a participant: it stands in for light, air and volume. We trust the viewer’s imagination.</p>
${F('p17-13.jpg', 'A detailed window inside the “lens” — and a house that is only an outline')}
<h4>Where ink sketching comes from</h4>
<ul><li><b>Ancient Egypt and China.</b> Carbon ink: pigment, water and a binder. It doesn’t fade in the sun — the first material for images that do not age.</li>
<li><b>The Renaissance.</b> Iron gall ink went on grey, then turned blue-black and brown, literally etching into paper. No corrections possible — Leonardo and Dürer drew with extreme concentration.</li>
<li><b>Travel notes.</b> Before modern pencils (late 18th century) ink was the only tool outside the studio: folding pens and portable inkwells in the notebooks of sailors and mapmakers. One precise line replaced a page of description.</li>
<li><b>Rembrandt.</b> Sketches were considered private and “not serious” — which gave masters freedom. In his quick sketches there are messy strokes he would never allow in a commissioned portrait.</li>
<li><b>Newspapers, comics, architects.</b> Court and war reporters, the inker in comics, architects showing ideas to clients — they gave us cross-hatching, bold black spots and the clear line.</li>
<li><b>Sumi-e.</b> Black ink and water only, no pencil sketch. The artist looks for a long time, then paints in seconds — the sprint in its purest form. It taught the West to value what is left unsaid.</li></ul>
<h4>Today: three popular directions</h4>
<ul><li><b>Linear minimalism</b> — the whole drawing in one line of constant thickness; trains you to see the silhouette.</li>
<li><b>Spot and blot</b> — drips and careless washes that resolve into a recognisable image.</li>
<li><b>Mixed media</b> — ink makes the framework, colour gives the mood.</li></ul>
<p>Since 2007 there is the Urban Sketchers movement with its simple manifesto: draw the world as it is, here and now. Modern ink sketching takes precision from old masters, speed from newspaper reporters and courage from comic artists — and its main style is your own handwriting.</p>`,
    simple: 'A sketch is a sprint: quick, every line final, details only where they matter, and the white paper works as light and air. Ink sketching grew from manuscripts, Renaissance studies, travel notes, reportage, comics and sumi-e.',
    mist: [['Approaching a five-minute sketch like an academic drawing.', 'A sketch is a sprint: capture the impression, not every hair.'],
      ['Finishing the object up to every edge of the page.', 'Let the edges dissolve into white — the viewer will finish the rest.'],
      ['Treating a slip as a ruined sketch.', 'In a sketch a slip is part of the search for form — it often looks more sincere.'],
      ['Thinking that “sprint” means moving the hand as fast as possible.', 'Sprint means compression: building and finishing at the same time, even calmly.']],
    terms: [['Sketch', 'a quick drawing that captures an impression'], ['Active silence', 'untouched white paper that works as light and air'], ['Iron gall ink', 'Renaissance ink that etches into paper and darkens with time'], ['Reportage sketch', 'quick drawing of events on the spot'], ['Inker', 'in comics — the artist who traces the pencil drawing in ink'], ['Sumi-e', 'Japanese painting with black ink and water, no preliminary sketch']],
    fact: 'Iron gall ink goes onto paper light grey and only then turns blue-black and later brown — in old manuscripts you can watch “time” in the colour of the lines.',
    test: [['What is the main difference between a sketch and a classical drawing?', 'A sketch captures an impression quickly; every line is final', 'A sketch is always smaller', 'A sketch is drawn only in pencil', 'Sketching is a sprint and compression; drawing is a marathon with stages.'],
      ['What does the white paper do in an ink sketch?', 'It works as light, air and volume', 'It must be filled completely', 'Nothing — it is just background', 'The book calls it a collaborator and “active silence”.'],
      ['Why were Renaissance artists so concentrated when drawing with iron gall ink?', 'The line could not be corrected — it etched into the paper', 'The ink was too expensive', 'They drew in the dark', 'Iron gall ink etched into the paper — no corrections.'],
      ['Why was ink the only tool for drawing outside the studio until the late 18th century?', 'Modern pencils did not exist yet', 'Pencils were forbidden', 'Paint was invisible', 'Graphite pencils in their modern form appeared only at the end of the 18th century.'],
      ['What is special about sumi-e?', 'Only ink and water, no pencil sketch, the essence instead of a copy', 'It uses many bright colours', 'You draw slowly for weeks', 'Sumi-e is the sprint in its purest form.'],
      ['What is “linear minimalism”?', 'A drawing made with one line of constant thickness', 'A drawing with as few objects as possible', 'Drawing only with a ruler', 'It trains you to see the silhouette.']],
    task: { h: 'The lens and the void', need: 'a pen or liner, a timer, an object with an interesting texture', time: '10–15 min',
      steps: ['Draw a small freehand square in the middle of the page — no ruler. This is your camera lens.', 'Pick an object with a complex texture: an old boot, a crumpled cup, a plant.', 'Set a timer for 5 minutes. Inside the lens draw one detail with jeweller’s precision.', 'Toward the edges of the square let the lines break, thin out and vanish into the white.', 'Do not finish the object outside the frame. If the hand slips — leave it: every mark is a final decision.'] },
    client: { name: 'Mr. SnapChew', job: 'photographer of fleeting autumn moments', say: 'My camera is in for repair and the leaves won’t wait! Make me a “photo” in ink — sharp in the middle, dissolving at the edges, like through my favourite lens.',
      ask: ['A square “lens” with one very detailed piece', 'Lines that fade into white toward the edges', 'Nothing drawn outside the frame'] },
  },
  ru: {
    name: 'Скетч, а не рисунок',
    intro: 'Сегодня учимся бегать спринт, а не марафон. А ещё заглянем в прошлое: Леонардо, Рембрандт, газетные репортёры и японские мастера — все приложили руку к скетчу тушью.',
    goals: ['отличать скетч от классического рисунка', 'использовать белую бумагу как «активную тишину»', 'знать, откуда пришёл скетчинг тушью и какие у него сейчас стили'],
    th: `<p><b>Скетч</b> — быстрая визуальная стенография. Он ловит не сам предмет, а впечатление от него. Если классический рисунок — это когда садишься «работать», то скетч — это когда просто живёшь: пьёшь кофе, ждёшь автобус — и ловишь кусочки этой жизни тушью.</p>
<h4>Спринт и марафон</h4>
<div class="tbl"><table><thead><tr><th></th><th>Скетч</th><th>Классический рисунок</th></tr></thead><tbody>
<tr><td>Время</td><td>от секунд до получаса</td><td>часы или дни</td></tr>
<tr><td>Цель</td><td>поймать момент, пока он «не остыл»</td><td>законченный, отточенный результат</td></tr>
<tr><td>Этапы</td><td>нет: каждая линия — финальная</td><td>построение → уточнение → проработка</td></tr>
<tr><td>Ошибка</td><td>приглашение к творчеству</td><td>помеха, портящая результат</td></tr>
<tr><td>Детали</td><td>только главное, остальное растворяется</td><td>равномерная проработка всего листа</td></tr></tbody></table></div>
<p>Главная ошибка — выйти на стометровку с настроем марафонца. Но «спринт» не значит, что рука машет как вентилятор. Скетч — не спешка, а <b>сжатие</b>: строишь форму и кладёшь финальный штрих одновременно.</p>
<h4>Право на незавершённость</h4>
<p>Скетч может оборваться в любой момент — как только мысль нашла выражение. Можно нарисовать лицо с ювелирной точностью, а линию плеч растворить в белизне листа. Белая бумага становится участником: она изображает свет, воздух и объём. Мы доверяем воображению зрителя.</p>
${F('p17-13.jpg', 'Подробное окно внутри «объектива» — и дом, от которого остался только контур')}
<h4>Откуда пришёл скетчинг тушью</h4>
<ul><li><b>Древний Египет и Китай.</b> Сажевая тушь: пигмент, вода и связующее. Не выцветает на солнце — первый материал для изображений, которые не стареют.</li>
<li><b>Возрождение.</b> Железо-галловые чернила ложились серыми, потом становились сине-чёрными и коричневыми, буквально въедаясь в бумагу. Исправить нельзя — Леонардо и Дюрер рисовали с предельной сосредоточенностью.</li>
<li><b>Путевые заметки.</b> До современных карандашей (конец XVIII века) тушь была единственным инструментом вне мастерской: складные перья и походные чернильницы в блокнотах мореплавателей и топографов. Одна точная линия заменяла страницу описания.</li>
<li><b>Рембрандт.</b> Наброски считались личными и «несерьёзными» — и это давало мастерам свободу. В его быстрых скетчах есть небрежные штрихи, которых он никогда бы не позволил в заказном портрете.</li>
<li><b>Газеты, комиксы, архитекторы.</b> Репортёры в суде и на войне, «инкер» в комиксах, архитекторы, показывающие идеи заказчикам, — от них перекрёстная штриховка, смелые чёрные пятна и чистая линия.</li>
<li><b>Суми-э.</b> Только чёрная тушь и вода, без карандашного наброска. Художник долго смотрит, а потом рисует за секунды — спринт в чистом виде. Суми-э научило Запад ценить недосказанное.</li></ul>
<h4>Сегодня: три популярных направления</h4>
<ul><li><b>Линейный минимализм</b> — весь рисунок одной линией постоянной толщины; учит видеть силуэт.</li>
<li><b>Пятно и клякса</b> — потёки и небрежные заливки, из хаоса которых проступает узнаваемый образ.</li>
<li><b>Смешанные техники</b> — тушь даёт каркас, цвет — настроение.</li></ul>
<p>С 2007 года есть движение Urban Sketchers с простым манифестом: рисовать мир таким, какой он есть, здесь и сейчас. Современный скетчинг тушью берёт точность у старых мастеров, скорость у газетных репортёров и смелость у авторов комиксов — а главный стиль в нём твой собственный почерк.</p>`,
    simple: 'Скетч — спринт: быстро, каждая линия финальная, детали только там, где важно, а белая бумага работает светом и воздухом. Скетчинг тушью вырос из рукописей, этюдов Возрождения, путевых заметок, репортажа, комиксов и суми-э.',
    mist: [['Подходить к пятиминутному скетчу как к академическому рисунку.', 'Скетч — спринт: поймать впечатление, а не каждый волосок.'],
      ['Дорисовывать предмет до всех краёв листа.', 'Дать краям раствориться в белом — зритель достроит сам.'],
      ['Считать промах испорченным скетчем.', 'В скетче промах — часть поиска формы, и часто выглядит искреннее.'],
      ['Думать, что «спринт» — это водить рукой как можно быстрее.', 'Спринт — это сжатие: строить и заканчивать одновременно, хоть и спокойно.']],
    terms: [['Скетч', 'быстрый рисунок, который ловит впечатление'], ['Активная тишина', 'нетронутая белая бумага, которая работает светом и воздухом'], ['Железо-галловые чернила', 'чернила Возрождения: въедаются в бумагу и темнеют со временем'], ['Репортажный скетч', 'быстрая зарисовка событий на месте'], ['Инкер', 'в комиксах — художник, обводящий карандашный рисунок тушью'], ['Суми-э', 'японская живопись чёрной тушью и водой, без предварительного наброска']],
    fact: 'Железо-галловые чернила ложатся на бумагу светло-серыми и только потом становятся сине-чёрными, а позже коричневыми — в старых рукописях «время» видно по цвету линий.',
    test: [['Главное отличие скетча от классического рисунка?', 'Скетч быстро ловит впечатление, каждая линия финальная', 'Скетч всегда меньше по размеру', 'Скетч рисуют только карандашом', 'Скетч — спринт и сжатие, рисунок — марафон с этапами.'],
      ['Что делает белая бумага в скетче тушью?', 'Работает светом, воздухом и объёмом', 'Её нужно заполнить целиком', 'Ничего — это просто фон', 'Книга называет её соавтором и «активной тишиной».'],
      ['Почему художники Возрождения рисовали железо-галловыми чернилами так сосредоточенно?', 'Линию нельзя было исправить — она въедалась в бумагу', 'Чернила были слишком дорогими', 'Они рисовали в темноте', 'Эти чернила въедались в бумагу — исправлений не бывает.'],
      ['Почему до конца XVIII века тушь была единственным инструментом для рисования вне мастерской?', 'Современных карандашей ещё не было', 'Карандаши были запрещены', 'Краски были невидимыми', 'Графитные карандаши в современном виде появились только в конце XVIII века.'],
      ['Чем особенно суми-э?', 'Только тушь и вода, без наброска, суть вместо копии', 'Много ярких красок', 'Рисуют медленно неделями', 'Суми-э — спринт в чистом виде.'],
      ['Что такое «линейный минимализм»?', 'Рисунок одной линией постоянной толщины', 'Рисунок с как можно меньшим числом предметов', 'Рисование только по линейке', 'Он учит видеть силуэт.']],
    task: { h: 'Объектив и пустота', need: 'ручка или линер, таймер, предмет с интересной фактурой', time: '10–15 мин',
      steps: ['Нарисуй от руки небольшой квадрат в середине страницы — без линейки. Это объектив камеры.', 'Выбери предмет со сложной фактурой: старый ботинок, мятый стаканчик, растение.', 'Поставь таймер на 5 минут. Внутри объектива нарисуй одну деталь с ювелирной точностью.', 'Ближе к краям квадрата дай линиям прерываться, истончаться и исчезать в белом.', 'Не дорисовывай предмет за рамкой. Если рука дрогнула — оставь: каждая метка — окончательное решение.'] },
    client: { name: 'Мистер Снэпчу', job: 'фотограф мимолётных осенних моментов', say: 'Камера в ремонте, а листья ждать не будут! Сделай мне «фото» тушью — резкое в середине и растворяющееся к краям, как через мой любимый объектив.',
      ask: ['Квадратный «объектив» с одной очень подробной деталью', 'Линии, которые к краям тают в белом', 'Ничего не дорисовано за рамкой'] },
  },
  lv: {
    name: 'Skice, nevis zīmējums',
    intro: 'Šodien mācāmies skriet sprintu, nevis maratonu. Un ieskatīsimies pagātnē: Leonardo, Rembrants, avīžu reportieri un japāņu meistari — visi pielika roku tušas skicei.',
    goals: ['atšķirt skici no klasiskā zīmējuma', 'izmantot balto papīru kā “aktīvo klusumu”', 'zināt, no kurienes nāk tušas skicēšana un kādi ir tās mūsdienu stili'],
    th: `<p><b>Skice</b> ir ātra vizuālā stenogrāfija. Tā notver nevis pašu priekšmetu, bet iespaidu par to. Ja klasiskais zīmējums ir tad, kad apsēdies “strādāt”, tad skice ir tad, kad vienkārši dzīvo — dzer kafiju, gaidi autobusu — un ķer šīs dzīves gabaliņus ar tušu.</p>
<h4>Sprints un maratons</h4>
<div class="tbl"><table><thead><tr><th></th><th>Skice</th><th>Klasiskais zīmējums</th></tr></thead><tbody>
<tr><td>Laiks</td><td>no sekundēm līdz pusstundai</td><td>stundas vai dienas</td></tr>
<tr><td>Mērķis</td><td>notvert mirkli, kamēr tas “nav atdzisis”</td><td>pabeigts, nopulēts rezultāts</td></tr>
<tr><td>Posmi</td><td>nav: katra līnija ir galīgā</td><td>konstrukcija → precizēšana → detalizēšana</td></tr>
<tr><td>Kļūda</td><td>aicinājums radošumam</td><td>šķērslis, kas sabojā rezultātu</td></tr>
<tr><td>Detaļas</td><td>tikai galvenais, pārējais izšķīst</td><td>vienmērīga visas lapas izstrāde</td></tr></tbody></table></div>
<p>Lielākā kļūda ir iziet uz simtmetrīgo ar maratonista noskaņu. Taču “sprints” nenozīmē, ka roka vicinās kā ventilators. Skice nav steiga, bet <b>saspiešana</b>: veido formu un liec galīgo vilcienu vienlaikus.</p>
<h4>Tiesības būt nepabeigtam</h4>
<p>Skice var aprauties jebkurā brīdī — tiklīdz doma ir atradusi izteiksmi. Var uzzīmēt seju ar juvelierisku precizitāti, bet plecu līniju izšķīdināt lapas baltumā. Baltais papīrs kļūst par dalībnieku: tas attēlo gaismu, gaisu un apjomu. Mēs uzticamies skatītāja iztēlei.</p>
${F('p17-13.jpg', 'Detalizēts logs “objektīvā” — un māja, no kuras palikusi tikai kontūra')}
<h4>No kurienes nāk tušas skicēšana</h4>
<ul><li><b>Senā Ēģipte un Ķīna.</b> Kvēpu tuša: pigments, ūdens un saistviela. Nebalē saulē — pirmais materiāls attēliem, kas nenoveco.</li>
<li><b>Renesanse.</b> Dzelzs-galla tinte uzklājās pelēka, tad kļuva zili melna un brūna, burtiski iegraužoties papīrā. Labot nevar — Leonardo un Dīrers zīmēja ar galēju koncentrēšanos.</li>
<li><b>Ceļojumu piezīmes.</b> Līdz mūsdienu zīmuļiem (18. gs. beigas) tuša bija vienīgais rīks ārpus darbnīcas: saliekamas spalvas un ceļojumu tintnīcas jūrasbraucēju un topogrāfu burtnīcās. Viena precīza līnija aizstāja apraksta lappusi.</li>
<li><b>Rembrants.</b> Skices uzskatīja par personiskām un “nenopietnām” — un tas meistariem deva brīvību. Viņa ātrajās skicēs ir pavirši vilcieni, ko viņš nekad neatļautos pasūtītā portretā.</li>
<li><b>Avīzes, komiksi, arhitekti.</b> Reportieri tiesā un karā, “inkers” komiksos, arhitekti, kas rāda idejas pasūtītājiem, — no viņiem krusteniskais svītrojums, drosmīgi melni plankumi un tīrā līnija.</li>
<li><b>Sumi-e.</b> Tikai melna tuša un ūdens, bez zīmuļa skices. Mākslinieks ilgi skatās un tad zīmē sekundēs — sprints tīrā veidā. Sumi-e iemācīja Rietumiem novērtēt nepateikto.</li></ul>
<h4>Šodien: trīs populāri virzieni</h4>
<ul><li><b>Lineārais minimālisms</b> — viss zīmējums ar vienu nemainīga biezuma līniju; māca redzēt siluetu.</li>
<li><b>Plankums un traips</b> — notecējumi un pavirši laukumi, no kuru haosa izaug atpazīstams tēls.</li>
<li><b>Jauktās tehnikas</b> — tuša dod karkasu, krāsa — noskaņu.</li></ul>
<p>Kopš 2007. gada ir kustība Urban Sketchers ar vienkāršu manifestu: zīmēt pasauli tādu, kāda tā ir, šeit un tagad. Mūsdienu tušas skicēšana ņem precizitāti no vecajiem meistariem, ātrumu no avīžu reportieriem un drosmi no komiksu autoriem — bet galvenais stils tajā ir tavs paša rokraksts.</p>`,
    simple: 'Skice ir sprints: ātri, katra līnija galīgā, detaļas tikai tur, kur svarīgi, un baltais papīrs strādā kā gaisma un gaiss. Tušas skicēšana izauga no manuskriptiem, renesanses studijām, ceļojumu piezīmēm, reportāžas, komiksiem un sumi-e.',
    mist: [['Ķerties pie piecu minūšu skices kā pie akadēmiska zīmējuma.', 'Skice ir sprints: notvert iespaidu, nevis katru matiņu.'],
      ['Pabeigt priekšmetu līdz visām lapas malām.', 'Ļaut malām izšķīst baltumā — skatītājs pabeigs pats.'],
      ['Uzskatīt kļūdu par sabojātu skici.', 'Skicē kļūda ir daļa no formas meklējumiem, un bieži izskatās sirsnīgāk.'],
      ['Domāt, ka “sprints” nozīmē vadīt roku pēc iespējas ātrāk.', 'Sprints ir saspiešana: veidot un pabeigt vienlaikus, kaut arī mierīgi.']],
    terms: [['Skice', 'ātrs zīmējums, kas notver iespaidu'], ['Aktīvais klusums', 'neskarts balts papīrs, kas strādā kā gaisma un gaiss'], ['Dzelzs-galla tinte', 'renesanses tinte: iegraužas papīrā un laika gaitā tumšo'], ['Reportāžas skice', 'ātrs notikumu uzzīmējums uz vietas'], ['Inkers', 'komiksos — mākslinieks, kas apvelk zīmuļa zīmējumu ar tušu'], ['Sumi-e', 'japāņu glezniecība ar melnu tušu un ūdeni, bez iepriekšējas skices']],
    fact: 'Dzelzs-galla tinte uz papīra uzklājas gaiši pelēka un tikai pēc tam kļūst zili melna, vēlāk brūna — vecos manuskriptos “laiku” var redzēt līniju krāsā.',
    test: [['Galvenā atšķirība starp skici un klasisko zīmējumu?', 'Skice ātri notver iespaidu, katra līnija galīgā', 'Skice vienmēr ir mazāka', 'Skici zīmē tikai ar zīmuli', 'Skice ir sprints un saspiešana, zīmējums — maratons ar posmiem.'],
      ['Ko tušas skicē dara baltais papīrs?', 'Strādā kā gaisma, gaiss un apjoms', 'To jāaizpilda pilnībā', 'Neko — tas ir tikai fons', 'Grāmata to sauc par līdzautoru un “aktīvo klusumu”.'],
      ['Kāpēc renesanses mākslinieki ar dzelzs-galla tinti zīmēja tik koncentrēti?', 'Līniju nevarēja izlabot — tā iegrauzās papīrā', 'Tinte bija pārāk dārga', 'Viņi zīmēja tumsā', 'Šī tinte iegrauzās papīrā — labojumu nav.'],
      ['Kāpēc līdz 18. gs. beigām tuša bija vienīgais rīks zīmēšanai ārpus darbnīcas?', 'Mūsdienu zīmuļu vēl nebija', 'Zīmuļi bija aizliegti', 'Krāsas bija neredzamas', 'Grafīta zīmuļi mūsdienu veidā parādījās tikai 18. gs. beigās.'],
      ['Ar ko īpaša sumi-e?', 'Tikai tuša un ūdens, bez skices, būtība kopijas vietā', 'Daudz spilgtu krāsu', 'Zīmē lēni nedēļām', 'Sumi-e ir sprints tīrā veidā.'],
      ['Kas ir “lineārais minimālisms”?', 'Zīmējums ar vienu nemainīga biezuma līniju', 'Zīmējums ar pēc iespējas mazāk priekšmetiem', 'Zīmēšana tikai ar lineālu', 'Tas māca redzēt siluetu.']],
    task: { h: 'Objektīvs un tukšums', need: 'pildspalva vai lainers, taimeris, priekšmets ar interesantu faktūru', time: '10–15 min',
      steps: ['Uzzīmē ar roku nelielu kvadrātu lapas vidū — bez lineāla. Tas ir kameras objektīvs.', 'Izvēlies priekšmetu ar sarežģītu faktūru: vecu zābaku, saburzītu glāzīti, augu.', 'Uzliec taimeri uz 5 minūtēm. Objektīvā uzzīmē vienu detaļu ar juvelierisku precizitāti.', 'Tuvāk kvadrāta malām ļauj līnijām pārtrūkt, kļūt tievākām un izzust baltumā.', 'Nepabeidz priekšmetu aiz rāmja. Ja roka nodrebēja — atstāj: katra atzīme ir galīgs lēmums.'] },
    client: { name: 'Misters Snepču', job: 'gaistošu rudens mirkļu fotogrāfs', say: 'Kamera ir remontā, bet lapas negaidīs! Uztaisi man “foto” ar tušu — asu vidū un izšķīstošu uz malām, kā caur manu mīļāko objektīvu.',
      ask: ['Kvadrātveida “objektīvs” ar vienu ļoti detalizētu detaļu', 'Līnijas, kas uz malām izkūst baltumā', 'Nekas nav uzzīmēts aiz rāmja'] },
  },
};
