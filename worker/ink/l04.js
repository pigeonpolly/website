// Курс туши, урок 4 — «Линия» (книга «Ink Sketching», с. 34–36). Формат — worker/ink/index.js.
const F = (img, cap) => `<figure><img src="/images/ink/${img}" alt="" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
export default {
  icon: '〰', card: 'halloween-remix/71.png', cover: 'p34-55.jpg',
  en: {
    name: 'The line',
    intro: 'In ink there is no eraser and no smudging — the line does all the work. Today we learn to make it heavy or light, fast or slow, and to tell metal from moss with one stroke.',
    goals: ['control a line’s weight, direction and speed', 'choose the type of line for the material', 'join lines so they build depth instead of confusion'],
    th: `<p>A line is a living thing. It has <b>weight</b> (thickness and darkness), <b>direction</b> and <b>speed</b>. Change any of the three — and the same contour tells a different story.</p>
<h4>Weight</h4>
<p>Thickness follows weight and shadow. A stone sits on the ground — its bottom edge is bold and dark. A cloud floats — its contour is a hair. The side turned away from the light gets a heavier line, the lit side — a thinner one or a gap.</p>
<h4>Four kinds of line</h4>
${F('p34-55.jpg', 'Confident, trembling, calligraphic and broken lines')}
<ul><li><b>Confident</b> — one movement, no stops. The backbone of a sketch.</li>
<li><b>Trembling</b> — wobbly on purpose: tree bark, wrinkles, old walls.</li>
<li><b>Calligraphic</b> — changes thickness many times along the way: fabric, hair, water.</li>
<li><b>Broken</b> — the form melts in light or fog; the eye completes the gaps itself.</li></ul>
<h4>Material in a line</h4>
<ul><li><b>Metal and glass</b> — smooth, long, sharp lines.</li>
<li><b>Wood and stone</b> — dry, broken lines with sudden turns.</li>
<li><b>Living things</b> (leaves, animals, people) — soft and round.</li></ul>
<h4>Speed</h4>
<p>A fast stroke gives a sharp, tapering edge; a slow one — a soft, dense, slightly wobbly line. Masters often draw <b>slowly in the middle</b> of a contour and let the ends <b>fly</b> — that is why their drawings breathe.</p>
<h4>Where lines meet</h4>
${F('p36-59.jpg', 'T-junction, closed and open corners, merging, tangents and little ties')}
<ul><li><b>T-junction</b> — one line stops at another: instantly one thing is in front of the other. That is depth.</li>
<li><b>Closed corners</b> — rigid, architectural. <b>Open corners</b> leave a tiny gap, and light “flows in” — fashion sketches and urban sketching love this.</li>
<li><b>Merging</b> — a small thickening where lines meet. A dark point anchors the drawing.</li>
<li><b>Avoid tangents</b> — when the edges of two different objects just touch, the eye can’t tell which is in front. Either overlap them clearly or leave air between them.</li>
<li><b>Little ties</b> — a short bold stroke where a branch leaves the trunk or a handle meets a cup. It “glues” the parts together.</li></ul>
${F('p29-37.jpg', 'One sketch, many lines: bold for what is close and heavy, thin for what is far and light')}`,
    simple: 'A line has weight, direction and speed. Heavy and in shadow — bold; light and lit — thin or broken. Metal — long and smooth, wood — dry and broken, living things — soft. Overlap means depth; avoid edges that just touch.',
    mist: [['Drawing every contour with the same thickness.', 'Bold where the object is heavy, close or in shadow; thin where it is light, far or lit.'],
      ['A “hairy” contour made of many short scratches.', 'One confident stroke. If it went wrong — draw a second one next to it.'],
      ['Two objects whose edges just touch.', 'Either a clear overlap (T-junction) or a gap of air between them.'],
      ['Closing every outline tightly.', 'Leave small gaps on the lit side — light “flows in” and the drawing breathes.']],
    terms: [['Line weight', 'how thick and dark a line is'], ['Confident line', 'drawn in one movement'], ['Calligraphic line', 'changes thickness along its way'], ['Broken line', 'interrupted; the eye fills the gaps'], ['T-junction', 'one line ends on another — a sign of overlap and depth'], ['Tangent', 'edges of two objects that only touch — confusing'], ['Little tie', 'a short bold stroke that joins two parts']],
    fact: 'Japanese calligraphers say the brush shows your mood at the moment of the stroke — a line can’t lie. That is why ink masters warm up before working: the first lines carry the morning’s fuss.',
    test: [['Which contour should be bolder: a stone lying on the ground or a cloud?', 'The stone’s bottom edge', 'The cloud', 'Both the same', 'Line weight follows weight and shadow.'],
      ['Which lines suit metal and glass?', 'Smooth, long and sharp', 'Trembling and broken', 'Soft and round', 'Hard shiny surfaces read through clean, long strokes.'],
      ['What does a T-junction tell the viewer?', 'That one object is in front of the other', 'That the drawing is finished', 'That the line went wrong', 'An overlap is the simplest way to show depth.'],
      ['Why avoid tangents?', 'The eye can’t tell which object is in front', 'Ink smudges there', 'It takes too long', 'Edges that just touch flatten the space.'],
      ['How do masters often use speed in a contour?', 'Slow in the middle, flying at the ends', 'Always as fast as possible', 'Always very slowly', 'Flying ends make the line light and alive.'],
      ['What is a “little tie”?', 'A short bold stroke where two parts meet', 'A ribbon in the sketchbook', 'A broken line in fog', 'It glues a branch to a trunk or a handle to a cup.']],
    task: { h: 'Six lines with feelings', need: 'one pen (a dip pen or brush pen is best, a liner is fine), a sketchbook page', time: '20 min',
      steps: ['Divide the page into six strips and sign them: angry, organic, technical, old, flowing, scratchy.', 'In each strip draw a line (or several) that shows the feeling — think about weight, speed and junctions.', 'Angry — fast, sharp turns, pressure. Organic — soft, round, like a stem. Technical — long, even, straight.', 'Old — trembling, broken, with knots. Flowing — calligraphic, thick and thin. Scratchy — short, dry, dense.', 'Below, draw one simple object (a spool, a cup, a key) with two of these lines and compare which one tells its story better.'] },
    client: { name: 'Spool Ghoul', job: 'grumpy wooden spool, wound too tight since 1893', say: 'Hmph. Thread is a line, and I’ve been a line for a hundred and thirty years. I know a lazy one when I see it. Show me six lines with character — and then draw me, an OLD spool, with an old line. No smooth plastic nonsense.',
      ask: ['Six signed strips: angry, organic, technical, old, flowing, scratchy', 'A spool (or any old object) drawn with a trembling, broken line', 'At least one T-junction and one little tie'] },
  },
  ru: {
    name: 'Линия',
    intro: 'В туши нет ластика и растушёвки — всю работу делает линия. Сегодня учимся делать её тяжёлой и лёгкой, быстрой и медленной и одним штрихом отличать металл от мха.',
    goals: ['управлять весом, направлением и скоростью линии', 'выбирать тип линии под материал', 'соединять линии так, чтобы получалась глубина, а не путаница'],
    th: `<p>Линия — живой организм. У неё есть <b>вес</b> (толщина и темнота), <b>направление</b> и <b>скорость</b>. Поменяй любое из трёх — и тот же контур расскажет другую историю.</p>
<h4>Вес</h4>
<p>Толщина следует за весом и тенью. Камень лежит на земле — его нижний край жирный и тёмный. Облако парит — его контур как волосок. Сторона, отвёрнутая от света, получает линию тяжелее, освещённая — тоньше или с разрывом.</p>
<h4>Четыре вида линий</h4>
${F('p34-55.jpg', 'Уверенная, дрожащая, каллиграфическая и прерывистая линии')}
<ul><li><b>Уверенная</b> — одним движением, без остановок. Скелет скетча.</li>
<li><b>Дрожащая</b> — неровная нарочно: кора дерева, морщины, старые стены.</li>
<li><b>Каллиграфическая</b> — много раз меняет толщину по пути: ткань, волосы, вода.</li>
<li><b>Прерывистая</b> — форма тает в свете или тумане; глаз сам достраивает разрывы.</li></ul>
<h4>Материал линией</h4>
<ul><li><b>Металл и стекло</b> — гладкие, длинные, острые линии.</li>
<li><b>Дерево и камень</b> — сухие, прерывистые, с резкими поворотами.</li>
<li><b>Живое</b> (листья, звери, люди) — мягкие и круглые.</li></ul>
<h4>Скорость</h4>
<p>Быстрый штрих даёт острый, сужающийся край; медленный — мягкую, плотную, чуть дрожащую линию. Мастера часто ведут контур <b>медленно в середине</b> и дают концам <b>улететь</b> — поэтому их рисунки дышат.</p>
<h4>Где линии встречаются</h4>
${F('p36-59.jpg', 'T-стык, закрытые и открытые углы, сгущение, касания и «связки»')}
<ul><li><b>T-стык</b> — одна линия упирается в другую: сразу видно, что один предмет впереди другого. Это и есть глубина.</li>
<li><b>Закрытые углы</b> — жёсткость, архитектура. <b>Открытые</b> оставляют крошечный зазор, и свет «втекает» внутрь — так любят модный скетч и городской скетчинг.</li>
<li><b>Сгущение</b> — маленькое утолщение там, где линии сходятся. Тёмная точка — якорь рисунка.</li>
<li><b>Избегай касаний</b> — когда края двух разных предметов просто соприкасаются, глаз не понимает, что впереди. Либо явное перекрытие, либо воздух между ними.</li>
<li><b>«Связки»</b> — короткий жирный штрих там, где ветка выходит из ствола или ручка встречается с чашкой. Он «склеивает» части.</li></ul>
${F('p29-37.jpg', 'Один скетч — много линий: жирные для близкого и тяжёлого, тонкие для далёкого и лёгкого')}`,
    simple: 'У линии есть вес, направление и скорость. Тяжёлое и в тени — жирно; лёгкое и на свету — тонко или с разрывом. Металл — длинно и гладко, дерево — сухо и прерывисто, живое — мягко. Перекрытие — это глубина; края, которые просто касаются, — путаница.',
    mist: [['Обводить все контуры одной толщиной.', 'Жирно там, где предмет тяжёлый, близкий или в тени; тонко — где лёгкий, далёкий или на свету.'],
      ['«Волосатый» контур из множества коротких царапин.', 'Один уверенный штрих. Не вышло — проведи второй рядом.'],
      ['Два предмета, края которых просто касаются.', 'Либо явное перекрытие (T-стык), либо зазор воздуха.'],
      ['Плотно замыкать каждый контур.', 'Оставь маленькие разрывы на освещённой стороне — свет «втекает», рисунок дышит.']],
    terms: [['Вес линии', 'насколько линия толстая и тёмная'], ['Уверенная линия', 'проведена одним движением'], ['Каллиграфическая линия', 'меняет толщину по пути'], ['Прерывистая линия', 'с разрывами; глаз достраивает их сам'], ['T-стык', 'одна линия упирается в другую — знак перекрытия и глубины'], ['Касание (tangent)', 'края двух предметов только соприкасаются — путает глаз'], ['«Связка»', 'короткий жирный штрих, соединяющий две части']],
    fact: 'Японские каллиграфы говорят, что кисть выдаёт настроение в момент штриха — линия не умеет врать. Поэтому мастера туши разминаются перед работой: первые линии несут в себе утреннюю суету.',
    test: [['Чей контур должен быть жирнее: камня на земле или облака?', 'Нижний край камня', 'Облака', 'Одинаковый', 'Вес линии следует за весом и тенью.'],
      ['Какие линии подходят металлу и стеклу?', 'Гладкие, длинные, острые', 'Дрожащие и прерывистые', 'Мягкие и круглые', 'Твёрдые блестящие поверхности читаются через чистые длинные штрихи.'],
      ['Что T-стык говорит зрителю?', 'Что один предмет впереди другого', 'Что рисунок закончен', 'Что линия не удалась', 'Перекрытие — самый простой способ показать глубину.'],
      ['Почему стоит избегать касаний (tangents)?', 'Глаз не понимает, какой предмет впереди', 'Там размазывается тушь', 'Это слишком долго', 'Края, которые просто соприкасаются, делают пространство плоским.'],
      ['Как мастера часто используют скорость в контуре?', 'Медленно в середине, концы «улетают»', 'Всегда как можно быстрее', 'Всегда очень медленно', 'Летящие концы делают линию лёгкой и живой.'],
      ['Что такое «связка»?', 'Короткий жирный штрих там, где сходятся две части', 'Ленточка-закладка в скетчбуке', 'Прерывистая линия в тумане', 'Она «приклеивает» ветку к стволу или ручку к чашке.']],
    task: { h: 'Шесть линий с характером', need: 'одна ручка (лучше перо или брашпен, подойдёт и линер), разворот скетчбука', time: '20 мин',
      steps: ['Раздели страницу на шесть полос и подпиши: злая, органическая, техническая, старая, текучая, царапучая.', 'В каждой полосе проведи линию (или несколько), которая показывает это настроение, — думай о весе, скорости и стыках.', 'Злая — быстро, резкие повороты, нажим. Органическая — мягко, кругло, как стебель. Техническая — длинно, ровно, прямо.', 'Старая — дрожащая, с разрывами и узелками. Текучая — каллиграфическая, толсто-тонко. Царапучая — коротко, сухо, плотно.', 'Ниже нарисуй один простой предмет (катушку, чашку, ключ) двумя из этих линий и сравни, какая лучше рассказывает его историю.'] },
    client: { name: 'Катушка Ворчушка', job: 'сердитая деревянная катушка, намотана слишком туго с 1893 года', say: 'Хмпф. Нитка — это линия, а я линия уже сто тридцать лет. Ленивую узнаю сразу. Покажи мне шесть линий с характером — а потом нарисуй меня, СТАРУЮ катушку, старой линией. Никакой гладкой пластмассы.',
      ask: ['Шесть подписанных полос: злая, органическая, техническая, старая, текучая, царапучая', 'Катушка (или любой старый предмет) дрожащей, прерывистой линией', 'Хотя бы один T-стык и одна «связка»'] },
  },
  lv: {
    name: 'Līnija',
    intro: 'Tušā nav dzēšgumijas un nav ēnošanas ar pirkstu — visu darbu dara līnija. Šodien mācāmies padarīt to smagu vai vieglu, ātru vai lēnu un ar vienu vilcienu atšķirt metālu no sūnām.',
    goals: ['vadīt līnijas svaru, virzienu un ātrumu', 'izvēlēties līnijas veidu materiālam', 'savienot līnijas tā, lai rodas dziļums, nevis juceklis'],
    th: `<p>Līnija ir dzīvs organisms. Tai ir <b>svars</b> (biezums un tumšums), <b>virziens</b> un <b>ātrums</b>. Maini jebkuru no trim — un tas pats kontūrs pastāsta citu stāstu.</p>
<h4>Svars</h4>
<p>Biezums seko svaram un ēnai. Akmens guļ uz zemes — tā apakšējā mala ir trekna un tumša. Mākonis lidinās — tā kontūrs ir kā mats. Pusei, kas pagriezta prom no gaismas, — smagāka līnija, apgaismotajai — tievāka vai ar pārtraukumu.</p>
<h4>Četri līniju veidi</h4>
${F('p34-55.jpg', 'Pārliecināta, trīcoša, kaligrāfiska un pārtraukta līnija')}
<ul><li><b>Pārliecināta</b> — vienā kustībā, bez apstāšanās. Skices mugurkauls.</li>
<li><b>Trīcoša</b> — nelīdzena ar nodomu: koka miza, grumbas, vecas sienas.</li>
<li><b>Kaligrāfiska</b> — ceļā daudzreiz maina biezumu: audums, mati, ūdens.</li>
<li><b>Pārtraukta</b> — forma kūst gaismā vai miglā; acs pati aizpilda spraugas.</li></ul>
<h4>Materiāls līnijā</h4>
<ul><li><b>Metāls un stikls</b> — gludas, garas, asas līnijas.</li>
<li><b>Koks un akmens</b> — sausas, pārtrauktas, ar straujiem pagriezieniem.</li>
<li><b>Dzīvais</b> (lapas, dzīvnieki, cilvēki) — mīkstas un apaļas.</li></ul>
<h4>Ātrums</h4>
<p>Ātrs vilciens dod asu, smailu galu; lēns — mīkstu, blīvu, nedaudz trīcošu līniju. Meistari bieži velk kontūru <b>lēni vidū</b> un ļauj galiem <b>aizlidot</b> — tāpēc viņu zīmējumi elpo.</p>
<h4>Kur līnijas satiekas</h4>
${F('p36-59.jpg', 'T-savienojums, slēgti un atvērti stūri, sabiezējums, pieskārieni un “saitītes”')}
<ul><li><b>T-savienojums</b> — viena līnija atduras otrā: uzreiz redzams, ka viens priekšmets ir priekšā otram. Tas ir dziļums.</li>
<li><b>Slēgti stūri</b> — stingrība, arhitektūra. <b>Atvērti</b> atstāj sīku spraugu, un gaisma “ieplūst” iekšā — to mīl modes skice un pilsētas skicēšana.</li>
<li><b>Sabiezējums</b> — mazs resninājums, kur līnijas satiekas. Tumšs punkts ir zīmējuma enkurs.</li>
<li><b>Izvairies no pieskārieniem</b> — kad divu dažādu priekšmetu malas tikai saskaras, acs nesaprot, kas ir priekšā. Vai nu skaidrs pārklājums, vai gaiss starp tām.</li>
<li><b>“Saitītes”</b> — īss trekns vilciens, kur zars iziet no stumbra vai osa satiekas ar krūzi. Tas “salīmē” daļas kopā.</li></ul>
${F('p29-37.jpg', 'Viena skice — daudz līniju: treknas tuvajam un smagajam, tievas tālajam un vieglajam')}`,
    simple: 'Līnijai ir svars, virziens un ātrums. Smags un ēnā — trekni; viegls un gaismā — tievi vai ar pārtraukumu. Metāls — gari un gludi, koks — sausi un pārtraukti, dzīvais — mīksti. Pārklājums ir dziļums; malas, kas tikai saskaras, — juceklis.',
    mist: [['Apvilkt visus kontūrus vienā biezumā.', 'Trekni, kur priekšmets ir smags, tuvs vai ēnā; tievi — kur viegls, tāls vai gaismā.'],
      ['“Matains” kontūrs no daudziem īsiem skrāpējumiem.', 'Viens pārliecināts vilciens. Neizdevās — novelc otru blakus.'],
      ['Divi priekšmeti, kuru malas tikai saskaras.', 'Vai nu skaidrs pārklājums (T-savienojums), vai gaisa sprauga.'],
      ['Cieši noslēgt katru kontūru.', 'Atstāj mazus pārtraukumus gaismas pusē — gaisma “ieplūst”, zīmējums elpo.']],
    terms: [['Līnijas svars', 'cik līnija ir bieza un tumša'], ['Pārliecināta līnija', 'novilkta vienā kustībā'], ['Kaligrāfiska līnija', 'ceļā maina biezumu'], ['Pārtraukta līnija', 'ar spraugām; acs tās aizpilda pati'], ['T-savienojums', 'viena līnija beidzas pie otras — pārklājuma un dziļuma zīme'], ['Pieskāriens (tangent)', 'divu priekšmetu malas tikai saskaras — mulsina aci'], ['“Saitīte”', 'īss trekns vilciens, kas savieno divas daļas']],
    fact: 'Japāņu kaligrāfi saka, ka ota parāda noskaņojumu vilciena brīdī — līnija neprot melot. Tāpēc tušas meistari pirms darba iesildās: pirmās līnijas nes rīta steigu.',
    test: [['Kura kontūram jābūt treknākam: akmenim uz zemes vai mākonim?', 'Akmens apakšējai malai', 'Mākonim', 'Vienādi', 'Līnijas svars seko svaram un ēnai.'],
      ['Kādas līnijas der metālam un stiklam?', 'Gludas, garas, asas', 'Trīcošas un pārtrauktas', 'Mīkstas un apaļas', 'Cietas, spīdīgas virsmas nolasās caur tīriem, gariem vilcieniem.'],
      ['Ko T-savienojums pasaka skatītājam?', 'Ka viens priekšmets ir priekšā otram', 'Ka zīmējums ir pabeigts', 'Ka līnija neizdevās', 'Pārklājums ir vienkāršākais veids parādīt dziļumu.'],
      ['Kāpēc izvairīties no pieskārieniem (tangents)?', 'Acs nesaprot, kurš priekšmets ir priekšā', 'Tur izsmērējas tuša', 'Tas ir pārāk ilgi', 'Malas, kas tikai saskaras, padara telpu plakanu.'],
      ['Kā meistari bieži izmanto ātrumu kontūrā?', 'Lēni vidū, gali “aizlido”', 'Vienmēr pēc iespējas ātrāk', 'Vienmēr ļoti lēni', 'Lidojoši gali padara līniju vieglu un dzīvu.'],
      ['Kas ir “saitīte”?', 'Īss trekns vilciens, kur satiekas divas daļas', 'Lentīte-grāmatzīme burtnīcā', 'Pārtraukta līnija miglā', 'Tā “pielīmē” zaru pie stumbra vai osu pie krūzes.']],
    task: { h: 'Sešas līnijas ar raksturu', need: 'viena pildspalva (labāk spalva vai otas pildspalva, der arī lainers), skiču burtnīcas atvērums', time: '20 min',
      steps: ['Sadali lapu sešās joslās un paraksti: dusmīga, organiska, tehniska, veca, plūstoša, skrāpējoša.', 'Katrā joslā novelc līniju (vai vairākas), kas parāda šo noskaņu, — domā par svaru, ātrumu un savienojumiem.', 'Dusmīga — ātri, asi pagriezieni, spiediens. Organiska — mīksti, apaļi, kā stiebrs. Tehniska — gari, līdzeni, taisni.', 'Veca — trīcoša, ar pārtraukumiem un mezgliņiem. Plūstoša — kaligrāfiska, biezi-tievi. Skrāpējoša — īsi, sausi, blīvi.', 'Zemāk uzzīmē vienu vienkāršu priekšmetu (spoli, krūzi, atslēgu) ar divām no šīm līnijām un salīdzini, kura labāk izstāsta tā stāstu.'] },
    client: { name: 'Īgnā Spole', job: 'īgna koka spole, uztīta pārāk cieši kopš 1893. gada', say: 'Hmpf. Diegs ir līnija, un es esmu līnija jau simt trīsdesmit gadus. Slinku pazīstu uzreiz. Parādi man sešas līnijas ar raksturu — un tad uzzīmē mani, VECU spoli, ar vecu līniju. Nekādas gludas plastmasas.',
      ask: ['Sešas parakstītas joslas: dusmīga, organiska, tehniska, veca, plūstoša, skrāpējoša', 'Spole (vai jebkurš vecs priekšmets) ar trīcošu, pārtrauktu līniju', 'Vismaz viens T-savienojums un viena “saitīte”'] },
  },
};
