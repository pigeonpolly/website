// Курс туши, урок 1 — «Страх чистого листа» и разминка (книга «Ink Sketching», с. 4–14). Формат — worker/ink/index.js.
const F = (img, cap) => `<figure><img src="/images/ink/${img}" alt="" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
export default {
  icon: '✺', card: 'classic/12.jpg', cover: 'p11-5.jpg',
  en: {
    name: 'Blank page fear',
    intro: 'Coo! Welcome to the ink course. Before we touch the pen, let’s meet the scariest creature in art — the empty page. Spoiler: it is only paper.',
    goals: ['understand where the fear of the blank page comes from', 'learn four ways to “hack” it', 'warm up your hand before every sketch'],
    th: `<p>You poured fresh ink, picked the perfect pen, you have a whole quiet hour… and suddenly you freeze. You adjust the lamp, check your phone, decide it is the best time to wash a mug. This is the famous <b>fear of the blank page</b>. To beat it, drag it into the light.</p>
<h4>Your brain is an old-school security guard</h4>
<p>Its “firmware” was written when every step into the unknown could end with a sabre-toothed tiger. An empty sheet is pure uncertainty, so the brain switches on anxiety — not because you draw badly, but because it wants to protect you. When your hand trembles, it is just a guard taking the job too seriously.</p>
<h4>Where else the fear comes from</h4>
<ul><li><b>School.</b> Red pen, crossed-out work, points off for mistakes. We grew up believing that paper must not be “spoiled”.</li>
<li><b>The beautiful sketchbook.</b> The more expensive the book, the higher we raise the bar for the first line — and keep “pretty books” empty for years.</li>
<li><b>The mirror.</b> While the page is empty, you are Leonardo in your head. The first line shows that the hand does not obey yet. The page seems to judge us — it doesn’t.</li>
<li><b>Too many choices.</b> Like a menu with 300 dishes: you can draw anything, so the brain freezes and draws nothing.</li>
<li><b>Ctrl+Z.</b> Digital tools taught us that everything can be undone. Ink cannot — and that feels like walking through a minefield.</li></ul>
<p>Ink makes it all sharper: black on white, no eraser, every line stays forever. And ink is a liquid — it drips, spreads, smudges. But the irony is that these “accidents” — drips, smudges, splatters — are exactly what makes a sketch alive.</p>
<div class="ik-tip">In the past the fear was rational: parchment and handmade paper cost a fortune, so apprentices practised on wax tablets and in sand. Today paper costs pennies — the fear simply changed its mask.</div>
<h4>Four ways to hack the fear</h4>
<ol><li><b>The ritual of desecration.</b> Spoil the first page on purpose: a blot in the corner, a chaotic line, the words “here I will make mistakes”. Alina admits it doesn’t work for her — but it helps many people.</li>
<li><b>Small steps.</b> Draw a frame the size of a matchbox and promise to draw only inside it: a keyhole, an eye, a leaf. A small format doesn’t pretend to be high art. (Cats know this trick: they always fit into boxes.)</li>
<li><b>A time limit.</b> 1–2 minutes on a timer. There is no time left for fear — lines get bolder, and often more accurate.</li>
<li><b>Chaos first.</b> Toned paper, a watery blot, textured paper. The page is no longer empty — now you are in a dialogue, looking for shapes like in clouds.</li></ol>
${F('p11-5.jpg', 'Random blots that turned into creatures — the exercise of this lesson')}
<h4>Warm-up: wake the muscles up</h4>
<p>Once Alina sat down on a quiet Sunday with a new expensive sketchbook and went straight for the branches outside the window. The line trembled, the second stroke made it worse — “the ECG of a frightened rabbit”. Lesson learned: talent does not care how nice the light is if your muscles are asleep. So first she “writes herself out” in a draft sketchbook.</p>
${F('p13-9.jpg', 'Warm-up lines: confident lines, rulers, pressure, eights')}
<ul><li><b>Target practice.</b> Two dots 10–15 cm apart. Look at the second dot (not the pen tip!) and connect them with one line on the exhale. Then fill the line with short vertical strokes like a ruler.</li>
<li><b>From a hair to a downpour.</b> One long line: press harder and harder, then let go. A thin hair turns into a lush black trail and fades again.</li>
<li><b>Infinite eights.</b> Draw ∞ without lifting the pen: small ones with the fingers, then bigger with the wrist and elbow. After two minutes your lines become rounder and freer.</li></ul>
<p>The greatest sketchbook in the world is the one that is filled. It may have blots and crooked proportions — but it has life.</p>`,
    simple: 'The fear of the blank page is a protective reflex, not a lack of talent. Trick it: spoil the page, shrink the space, set a timer or start from a blot. Before drawing — warm up: lines between dots, pressure, eights.',
    mist: [['“The first page must be perfect — it sets the tone for the whole book.”', 'The first page is a sandbox. A filled sketchbook beats a pretty empty one.'],
      ['Starting straight with a complex subject with a “cold” hand.', 'Two minutes of warm-up: dots, pressure, eights — then the real sketch.'],
      ['Watching the pen tip while drawing a long line.', 'Look at where the line should end — the hand follows the eye.'],
      ['Spending ages choosing what to draw.', 'Pick the first thing in front of you, or limit yourself with a timer or a small frame.']],
    terms: [['Blank page fear', 'freezing before the first mark on a clean sheet'], ['Warm-up', 'simple marks that wake up the hand before a sketch'], ['Draft sketchbook', 'a cheap notebook for warming up and experiments'], ['Line pressure', 'how hard you press — thin hair or thick trail'], ['Stiffness', 'drawing only with tense fingertips instead of the wrist and shoulder'], ['Analysis paralysis', 'so many options that you choose none']],
    fact: 'Renaissance apprentices practised on wax tablets, slate boards and even in sand — clean paper was too expensive to spoil while learning.',
    test: [['Why does the brain “switch on” fear in front of a blank page?', 'It sees the unknown as a danger and tries to protect you', 'Because you have no talent', 'Because ink is toxic', 'The book compares the brain to a guard: anxiety is protection, not a verdict.'],
      ['What is the “small steps” method?', 'Draw a small frame and only draw inside it', 'Draw only very small things for a month', 'Use the smallest pen', 'A frame the size of a matchbox makes the task safe and small.'],
      ['In the “target practice” warm-up, where should you look?', 'At the second dot, where the line ends', 'At the pen tip', 'At the first dot', 'The hand follows the eye: look at the target.'],
      ['Why set a timer for 1–2 minutes?', 'There is no time left for doubt, the lines get bolder', 'To finish faster and rest', 'Because ink dries in two minutes', 'Fear is a product of overthinking — the timer leaves no time for it.'],
      ['What do drips and smudges give an ink sketch?', 'Life and character', 'Only dirt — they must be avoided', 'Nothing at all', 'The book says the main magic of sketching lies in these “accidents”.'],
      ['What are “infinite eights” for?', 'To remove stiffness and make lines round and free', 'To practise writing the number 8', 'To test the ink colour', 'Eights involve the wrist and elbow — the line stops being stiff.']],
    task: { h: 'Five blots and a warm-up', need: 'the very sheet you have been “saving”, ink, a brush or a pen', time: '20–30 min',
      steps: ['Warm-up on a draft page: three lines between two dots, one “hair to downpour” line and two minutes of eights.', 'Now the saved sheet. Close your eyes and put 5 random blots, spots or careless strokes on it. You can let ink drip from above or draw with your other hand.', 'Open your eyes — the perfect sheet is gone, the worst is over.', 'Look at each spot: a prickly bush? a grumpy neighbour’s nose? a crack in a wall? Add 5–10 strokes to each to reveal an image.', 'Write next to the drawing which spot was the scariest and what it turned into.'] },
    client: { name: 'Mr. Chew', job: 'office clerk, Wobbleland archive', say: 'Oh no, oh no… The archive sent me a completely EMPTY form and I’ve been staring at it since Monday. Show me how you do it — how do you start on a blank page?',
      ask: ['Five blots that turned into creatures or things', 'A caption: which blot was the scariest', 'Your warm-up lines in the corner — I want to see them too'] },
  },
  ru: {
    name: 'Страх чистого листа',
    intro: 'Курлык! Добро пожаловать на курс туши. Прежде чем взять перо, познакомимся с самым страшным существом в искусстве — пустой страницей. Спойлер: это просто бумага.',
    goals: ['понять, откуда берётся страх чистого листа', 'узнать четыре способа его «взломать»', 'разминать руку перед каждым скетчем'],
    th: `<p>Налита свежая тушь, выбрано идеальное перо, впереди целый час тишины… и вдруг ступор. Поправляем лампу, проверяем телефон, решаем, что самое время помыть кружку. Знакомо? Это знаменитый <b>страх чистого листа</b>. Чтобы победить его, его нужно вытащить на свет и рассмотреть.</p>
<h4>Мозг — охранник старой закалки</h4>
<p>Его «прошивка» написана тогда, когда любой шаг в неизвестность мог закончиться встречей с саблезубым тигром. Пустой лист — территория полной неопределённости, и мозг включает тревогу. Не потому что рисуешь плохо, а потому что он хочет защитить. Когда рука дрожит, это просто охранник слишком серьёзно относится к своей работе.</p>
<h4>Откуда ещё берётся страх</h4>
<ul><li><b>Школа.</b> Красная ручка учителя, зачёркивания, минус баллы за ошибки. Мы выросли с убеждением, что бумагу нельзя «портить».</li>
<li><b>Красивый скетчбук.</b> Чем дороже блокнот, тем выше планка для первой линии — и «красивые книжки» годами лежат пустыми.</li>
<li><b>Зеркало.</b> Пока лист пуст, в голове ты Леонардо. Первая линия показывает, что рука пока слушается не так, как хочется. Кажется, что страница выносит приговор — нет, не выносит.</li>
<li><b>Слишком большой выбор.</b> Как меню на 300 блюд: нарисовать можно что угодно, мозг зависает — и не рисует ничего.</li>
<li><b>Ctrl+Z.</b> Цифровые инструменты приучили, что всё можно отменить. Тушь отменить нельзя — и это ощущается как прогулка по минному полю.</li></ul>
<p>Тушь всё это обостряет: чёрное на белом, ластика нет, каждая линия остаётся навсегда. А ещё тушь — жидкость: капает, растекается, размазывается. Но ирония в том, что именно эти «случайности» — капли, кляксы, брызги — делают скетч живым.</p>
<div class="ik-tip">Раньше страх был разумным: пергамент и бумага ручной работы стоили целое состояние, поэтому подмастерья учились на восковых табличках и на песке. Сегодня бумага стоит копейки — страх просто сменил маску.</div>
<h4>Четыре способа взломать страх</h4>
<ol><li><b>Ритуал осквернения.</b> Испорти первую страницу нарочно: клякса в углу, хаотичная линия, надпись «здесь я буду ошибаться». Алина признаётся, что ей это не помогает, — но многим помогает.</li>
<li><b>Маленькие шаги.</b> Нарисуй рамку размером со спичечный коробок и пообещай рисовать только внутри: замочную скважину, глаз, листик. Маленький формат не претендует на высокое искусство. (Коты знают этот трюк: они всегда помещаются в коробки.)</li>
<li><b>Лимит времени.</b> 1–2 минуты на таймере. На страх просто не остаётся времени — линии смелее, и часто точнее.</li>
<li><b>Сначала хаос.</b> Тонированная бумага, водянистая клякса, фактурный лист. Страница больше не пустая — теперь это диалог: ищешь в пятне образы, как в облаках.</li></ol>
${F('p11-5.jpg', 'Случайные кляксы, превратившиеся в существ, — упражнение этого урока')}
<h4>Разминка: разбудить мышцы</h4>
<p>Однажды тихим воскресным утром Алина села с новым дорогим скетчбуком и сразу взялась за ветки за окном. Линия задрожала, второй штрих сделал хуже — получилась «кардиограмма испуганного кролика». Вывод: таланту всё равно, как красиво падает свет, если мышцы ещё спят. С тех пор сначала — «расписаться» в черновом скетчбуке.</p>
${F('p13-9.jpg', 'Разминочные линии: уверенные линии, «линейки», нажим, восьмёрки')}
<ul><li><b>Стрельба по мишеням.</b> Две точки на расстоянии 10–15 см. Смотри на вторую точку (а не на кончик пера!) и соедини их одной линией на выдохе. Потом заполни линию короткими вертикальными штрихами, как линейку.</li>
<li><b>От волоска до ливня.</b> Одна длинная линия: нажим всё сильнее, потом отпускаешь. Тонкий волосок превращается в густой чёрный след и снова тает.</li>
<li><b>Бесконечные восьмёрки.</b> Рисуй ∞, не отрывая пера: маленькие — пальцами, потом крупнее — запястьем и локтем. Через две минуты линии станут круглее и свободнее.</li></ul>
<p>Лучший скетчбук на свете — тот, что заполнен. В нём могут быть кляксы и кривые пропорции — но в нём есть жизнь.</p>`,
    simple: 'Страх чистого листа — защитный рефлекс, а не отсутствие таланта. Его можно обмануть: испортить лист, сузить место, поставить таймер или начать с кляксы. Перед рисованием — разминка: линии между точками, нажим, восьмёрки.',
    mist: [['«Первая страница должна быть идеальной — она задаёт тон всей книге».', 'Первая страница — песочница. Заполненный скетчбук лучше красивого пустого.'],
      ['Сразу браться за сложный сюжет «холодной» рукой.', 'Две минуты разминки: точки, нажим, восьмёрки — и потом настоящий скетч.'],
      ['Смотреть на кончик пера, когда ведёшь длинную линию.', 'Смотреть туда, где линия должна закончиться, — рука идёт за глазом.'],
      ['Долго выбирать, что нарисовать.', 'Взять первое, что перед глазами, или ограничить себя таймером и маленькой рамкой.']],
    terms: [['Страх чистого листа', 'ступор перед первой линией на чистой странице'], ['Разминка', 'простые линии, которые будят руку перед скетчем'], ['Черновой скетчбук', 'дешёвый блокнот для разминки и экспериментов'], ['Нажим', 'насколько сильно давишь на перо — волосок или жирный след'], ['Скованность', 'рисование только кончиками напряжённых пальцев, без запястья и плеча'], ['Паралич выбора', 'вариантов так много, что не выбираешь ни один']],
    fact: 'Подмастерья эпохи Возрождения учились на восковых табличках, грифельных досках и даже на песке: чистую бумагу было слишком дорого портить на учёбе.',
    test: [['Почему мозг «включает» страх перед пустым листом?', 'Он видит в неизвестности опасность и пытается защитить', 'Потому что нет таланта', 'Потому что тушь ядовитая', 'В книге мозг сравнивается с охранником: тревога — это защита, а не приговор.'],
      ['Что такое метод «маленьких шагов»?', 'Нарисовать маленькую рамку и рисовать только внутри неё', 'Месяц рисовать только мелкие предметы', 'Взять самое тонкое перо', 'Рамка размером со спичечный коробок делает задачу маленькой и безопасной.'],
      ['Куда смотреть в разминке «стрельба по мишеням»?', 'На вторую точку, где линия заканчивается', 'На кончик пера', 'На первую точку', 'Рука идёт за глазом: смотри на цель.'],
      ['Зачем ставить таймер на 1–2 минуты?', 'Не остаётся времени на сомнения, линии смелее', 'Чтобы быстрее закончить и отдохнуть', 'Потому что тушь сохнет за две минуты', 'Страх — продукт долгих раздумий, таймер не оставляет на них времени.'],
      ['Что дают скетчу тушью капли и кляксы?', 'Жизнь и характер', 'Только грязь — их надо избегать', 'Ничего', 'Книга говорит: главная магия скетчинга — как раз в этих «случайностях».'],
      ['Зачем нужны «бесконечные восьмёрки»?', 'Убрать скованность, сделать линии круглыми и свободными', 'Научиться писать цифру 8', 'Проверить цвет туши', 'Восьмёрки подключают запястье и локоть — линия перестаёт быть скованной.']],
    task: { h: 'Пять клякс и разминка', need: 'тот самый лист, который жалко было тратить, тушь, кисть или перо', time: '20–30 мин',
      steps: ['Разминка на черновой странице: три линии между двумя точками, одна линия «от волоска до ливня» и две минуты восьмёрок.', 'Теперь тот самый «жалко тратить» лист. Закрой глаза и поставь на нём 5 случайных клякс, пятен или небрежных штрихов. Можно капнуть тушью сверху или провести линию другой рукой.', 'Открой глаза — идеального листа больше нет, самое страшное позади.', 'Посмотри на каждое пятно: колючий куст? нос ворчливого соседа? трещина в стене? Добавь к каждому 5–10 штрихов, чтобы проявить образ.', 'Подпиши рядом, какое пятно было самым страшным и во что оно превратилось.'] },
    client: { name: 'Мистер Чу', job: 'клерк, архив Воббленда', say: 'Ой-ой-ой… Архив прислал мне совершенно ПУСТОЙ бланк, и я смотрю на него с понедельника. Покажи, как это делается, — как начать на чистом листе?',
      ask: ['Пять клякс, превратившихся в существ или вещи', 'Подпись: какая клякса была самой страшной', 'Разминочные линии в уголке — их тоже хочу видеть'] },
  },
  lv: {
    name: 'Tukšas lapas bailes',
    intro: 'Kū! Laipni lūdzam tušas kursā. Pirms ņemam spalvu, iepazīsimies ar visbiedējošāko radību mākslā — tukšo lapu. Spoileris: tas ir tikai papīrs.',
    goals: ['saprast, no kurienes rodas tukšas lapas bailes', 'uzzināt četrus veidus, kā tās “uzlauzt”', 'iesildīt roku pirms katras skices'],
    th: `<p>Ielieta svaiga tuša, izvēlēta ideālā spalva, priekšā vesela klusa stunda… un pēkšņi stupors. Pielabojam lampu, pārbaudām telefonu, nolemjam, ka tieši tagad jāmazgā krūze. Pazīstami? Tās ir slavenās <b>tukšas lapas bailes</b>. Lai tās uzvarētu, tās jāizvelk gaismā un jāaplūko.</p>
<h4>Smadzenes — vecās skolas apsargs</h4>
<p>To “programmatūra” rakstīta laikos, kad katrs solis nezināmajā varēja beigties ar zobenzobu tīģeri. Tukša lapa ir pilnīgas nenoteiktības teritorija, un smadzenes ieslēdz trauksmi. Nevis tāpēc, ka zīmē slikti, bet tāpēc, ka tās grib aizsargāt. Kad roka trīc, tas vienkārši apsargs pārāk nopietni uztver savu darbu.</p>
<h4>No kurienes vēl rodas bailes</h4>
<ul><li><b>Skola.</b> Skolotājas sarkanā pildspalva, nosvītrojumi, mīnus punkti par kļūdām. Mēs izaugām ar pārliecību, ka papīru nedrīkst “sabojāt”.</li>
<li><b>Skaistā skiču burtnīca.</b> Jo dārgāka burtnīca, jo augstāka latiņa pirmajai līnijai — un “skaistās grāmatiņas” gadiem stāv tukšas.</li>
<li><b>Spogulis.</b> Kamēr lapa tukša, galvā tu esi Leonardo. Pirmā līnija parāda, ka roka vēl neklausa tā, kā gribētos. Šķiet, ka lapa nolasa spriedumu — tā nenolasa.</li>
<li><b>Pārāk liela izvēle.</b> Kā ēdienkarte ar 300 ēdieniem: zīmēt var jebko, smadzenes uzkaras — un nezīmē neko.</li>
<li><b>Ctrl+Z.</b> Digitālie rīki pieradināja, ka visu var atcelt. Tušu atcelt nevar — un tas šķiet kā pastaiga pa mīnu lauku.</li></ul>
<p>Tuša to visu saasina: melns uz balta, dzēšgumijas nav, katra līnija paliek uz visiem laikiem. Turklāt tuša ir šķidrums: pil, izplūst, izsmērējas. Taču ironija ir tā, ka tieši šīs “nejaušības” — pilieni, traipi, šļakatas — padara skici dzīvu.</p>
<div class="ik-tip">Agrāk bailes bija saprātīgas: pergaments un roku darba papīrs maksāja veselu bagātību, tāpēc mācekļi mācījās uz vaska plāksnītēm un smiltīs. Šodien papīrs maksā kapeikas — bailes vienkārši nomainīja masku.</div>
<h4>Četri veidi, kā uzlauzt bailes</h4>
<ol><li><b>Apgānīšanas rituāls.</b> Sabojā pirmo lapu tīšām: traips stūrī, haotiska līnija, uzraksts “šeit es kļūdīšos”. Alīna atzīst, ka viņai tas nepalīdz, — bet daudziem palīdz.</li>
<li><b>Mazi soļi.</b> Uzzīmē rāmīti sērkociņu kastītes lielumā un apsoli zīmēt tikai tajā: atslēgas caurumu, aci, lapiņu. Mazs formāts nepretendē uz augsto mākslu. (Kaķi zina šo triku: tie vienmēr ietilpst kastēs.)</li>
<li><b>Laika limits.</b> 1–2 minūtes taimerī. Bailēm vienkārši neatliek laika — līnijas drosmīgākas un bieži precīzākas.</li>
<li><b>Vispirms haoss.</b> Tonēts papīrs, ūdeņains traips, faktūras lapa. Lapa vairs nav tukša — tagad tas ir dialogs: traipā meklē tēlus kā mākoņos.</li></ol>
${F('p11-5.jpg', 'Nejauši traipi, kas pārvērtās radībās, — šīs nodarbības vingrinājums')}
<h4>Iesildīšanās: pamodināt muskuļus</h4>
<p>Reiz klusā svētdienas rītā Alīna apsēdās ar jaunu dārgu skiču burtnīcu un uzreiz ķērās pie zariem aiz loga. Līnija sāka trīcēt, otrais vilciens padarīja sliktāk — iznāca “nobijušās truša kardiogramma”. Secinājums: talantam ir vienalga, cik skaisti krīt gaisma, ja muskuļi vēl guļ. Kopš tā laika vispirms jā“izrakstās” melnraksta burtnīcā.</p>
${F('p13-9.jpg', 'Iesildīšanās līnijas: pārliecinātas līnijas, “lineāli”, spiediens, astotnieki')}
<ul><li><b>Šaušana mērķī.</b> Divi punkti 10–15 cm attālumā. Skaties uz otro punktu (nevis uz spalvas galu!) un savieno tos ar vienu līniju izelpā. Tad aizpildi līniju ar īsiem vertikāliem vilcieniem kā lineālu.</li>
<li><b>No matiņa līdz lietusgāzei.</b> Viena gara līnija: spiediens arvien stiprāks, tad atlaid. Tievs matiņš pārvēršas biezā melnā sliedē un atkal izzūd.</li>
<li><b>Bezgalīgi astotnieki.</b> Zīmē ∞, neatraujot spalvu: mazus — ar pirkstiem, tad lielākus — ar plaukstas locītavu un elkoni. Pēc divām minūtēm līnijas kļūs apaļākas un brīvākas.</li></ul>
<p>Labākā skiču grāmata pasaulē ir tā, kas ir piepildīta. Tajā var būt traipi un šķības proporcijas — bet tajā ir dzīvība.</p>`,
    simple: 'Tukšas lapas bailes ir aizsargreflekss, nevis talanta trūkums. Tās var apmānīt: sabojāt lapu, sašaurināt vietu, uzlikt taimeri vai sākt ar traipu. Pirms zīmēšanas — iesildīšanās: līnijas starp punktiem, spiediens, astotnieki.',
    mist: [['“Pirmajai lapai jābūt ideālai — tā nosaka toni visai grāmatai.”', 'Pirmā lapa ir smilšu kaste. Piepildīta burtnīca ir labāka par skaistu tukšu.'],
      ['Uzreiz ķerties pie sarežģīta sižeta ar “aukstu” roku.', 'Divas minūtes iesildīšanās: punkti, spiediens, astotnieki — tad īstā skice.'],
      ['Skatīties uz spalvas galu, velkot garu līniju.', 'Skatīties tur, kur līnijai jābeidzas, — roka seko acij.'],
      ['Ilgi izvēlēties, ko zīmēt.', 'Ņemt pirmo, kas acu priekšā, vai ierobežot sevi ar taimeri un mazu rāmīti.']],
    terms: [['Tukšas lapas bailes', 'stupors pirms pirmās līnijas uz tīras lapas'], ['Iesildīšanās', 'vienkāršas līnijas, kas pamodina roku pirms skices'], ['Melnraksta burtnīca', 'lēta burtnīca iesildīšanās un eksperimentiem'], ['Spiediens', 'cik stipri spied uz spalvas — matiņš vai trekna sliede'], ['Stīvums', 'zīmēšana tikai ar saspringtiem pirkstu galiem, bez plaukstas locītavas un pleca'], ['Izvēles paralīze', 'variantu tik daudz, ka neizvēlies nevienu']],
    fact: 'Renesanses mācekļi mācījās uz vaska plāksnītēm, šīfera tāfelēm un pat smiltīs: tīru papīru bija pārāk dārgi bojāt mācībās.',
    test: [['Kāpēc smadzenes tukšas lapas priekšā “ieslēdz” bailes?', 'Tās nezināmajā redz briesmas un cenšas aizsargāt', 'Jo nav talanta', 'Jo tuša ir indīga', 'Grāmatā smadzenes salīdzinātas ar apsargu: trauksme ir aizsardzība, nevis spriedums.'],
      ['Kas ir “mazo soļu” metode?', 'Uzzīmēt mazu rāmīti un zīmēt tikai tajā', 'Mēnesi zīmēt tikai sīkas lietas', 'Paņemt plānāko spalvu', 'Sērkociņu kastītes lieluma rāmītis padara uzdevumu mazu un drošu.'],
      ['Kur skatīties iesildīšanās vingrinājumā “šaušana mērķī”?', 'Uz otro punktu, kur līnija beidzas', 'Uz spalvas galu', 'Uz pirmo punktu', 'Roka seko acij: skaties uz mērķi.'],
      ['Kāpēc likt taimeri uz 1–2 minūtēm?', 'Neatliek laika šaubām, līnijas drosmīgākas', 'Lai ātrāk pabeigtu un atpūstos', 'Jo tuša nožūst divās minūtēs', 'Bailes ir ilgas domāšanas produkts, taimeris tai neatstāj laika.'],
      ['Ko tušas skicei dod pilieni un traipi?', 'Dzīvību un raksturu', 'Tikai netīrumus — no tiem jāizvairās', 'Neko', 'Grāmata saka: skicēšanas galvenā maģija ir tieši šajās “nejaušībās”.'],
      ['Kam vajadzīgi “bezgalīgie astotnieki”?', 'Noņemt stīvumu, padarīt līnijas apaļas un brīvas', 'Iemācīties rakstīt ciparu 8', 'Pārbaudīt tušas krāsu', 'Astotnieki iesaista plaukstas locītavu un elkoni — līnija vairs nav stīva.']],
    task: { h: 'Pieci traipi un iesildīšanās', need: 'tā pati lapa, ko “taupīji”, tuša, ota vai spalva', time: '20–30 min',
      steps: ['Iesildīšanās melnraksta lapā: trīs līnijas starp diviem punktiem, viena līnija “no matiņa līdz lietusgāzei” un divas minūtes astotnieku.', 'Tagad “taupītā” lapa. Aizver acis un uzliec uz tās 5 nejaušus traipus, plankumus vai paviršus vilcienus. Var uzpilināt tušu no augšas vai novilkt līniju ar otru roku.', 'Atver acis — ideālās lapas vairs nav, pats briesmīgākais ir garām.', 'Apskati katru plankumu: dzeloņains krūms? īgna kaimiņa deguns? plaisa sienā? Pievieno katram 5–10 vilcienus, lai atklātu tēlu.', 'Uzraksti blakus, kurš plankums bija visbiedējošākais un par ko tas pārvērtās.'] },
    client: { name: 'Misters Ču', job: 'ierēdnis, Vobllendas arhīvs', say: 'Ak vai, ak vai… Arhīvs man atsūtīja pilnīgi TUKŠU veidlapu, un es skatos uz to kopš pirmdienas. Parādi, kā to dara, — kā sākt uz tīras lapas?',
      ask: ['Pieci traipi, kas pārvērtušies radībās vai lietās', 'Paraksts: kurš traips bija visbiedējošākais', 'Iesildīšanās līnijas stūrītī — tās arī gribu redzēt'] },
  },
};
