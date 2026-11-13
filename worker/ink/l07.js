// Курс туши, урок 7 — «Свет и тень» (книга «Ink Sketching», с. 41–47). Формат — worker/ink/index.js.
const F = (img, cap) => `<figure><img src="/images/ink/${img}" alt="" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
export default {
  icon: '◐', card: 'autumn-cozy/84.png', cover: 'p42-71.jpg',
  en: {
    name: 'Light and shadow',
    intro: 'Ink has only black and white — and still it can show morning sun, a foggy evening and a candle in the dark. Today we learn how light falls, where shadow lives and how to say it all with lines and dots.',
    goals: ['name the parts of light and shadow on an object', 'tell hard, soft, back and side light apart', 'choose one light source and keep it for the whole sketch'],
    th: `<p>Light is what makes a flat circle a ball. Every object has a little <b>family of light</b>: the highlight (just white paper), the light side and the <b>half-tone</b> — the most informative part, where the form turns.</p>
<h4>The family of shadow</h4>
<ul><li><b>Terminator</b> — the border where light ends and shadow begins.</li>
<li><b>Form shadow</b> — the shadow on the object itself; the darkest place on it is right behind the terminator.</li>
<li><b>Reflected light</b> — a little light bouncing back from the table. Leave a thin lighter strip at the shadow edge, or the shadow becomes a flat cut-out.</li>
<li><b>Cast shadow</b> — the shadow on the table. Darkest and sharpest at the point of contact (<b>occlusion</b>), softer and paler further away.</li></ul>
${F('p44-77.jpg', 'One light source: some light on one side, no light on the other — and the cast shadow falls away from the lamp')}
${F('p44-75.jpg', 'A box, a cylinder, a cone: the shadow always runs away from the light')}
<h4>Hard and soft light</h4>
${F('p42-71.jpg', 'Hard light: a sharp terminator, almost no half-tones, a bold black shadow')}
<p><b>Hard light</b> (sun, a spotlight) — few half-tones, a sharp terminator, brave decisions: here black, here white. Shadows become geometric blocks. It feels tense, mysterious.</p>
${F('p42-69.jpg', 'Soft light: dots and sparse hatching, a smooth transition, no hard edges')}
<p><b>Soft light</b> (clouds, a lampshade) — a smooth transition, the shadow never reaches pure black, and the dark joints where things touch matter most. Sparse hatching, dots, diluted ink, no hard contours — good for skin, petals, fog.</p>
<h4>Where the light comes from</h4>
<ul><li><b>Back light</b> — the source is behind: a thin glowing rim, the body almost all in shadow. Noir. Make the rim uneven in thickness.</li>
<li><b>Side light</b> (90°) — the terminator runs down the middle, texture shows up, long shadows lead the eye.</li></ul>
${F('p43-73.jpg', 'Move the lamp — the shadows move. Ink can’t colour white: the light is the paper you leave')}
<h4>Tone in ink</h4>
<p>Ink has no grey pencil — tone is made optically: hatching, cross-hatching, dots, a wash of diluted ink. <b>Low-key</b> (lots of black) feels dramatic, <b>high-key</b> (lots of white) feels light and airy. Check the silhouette: is the object readable as a dark or light spot?</p>
${F('p46-81.jpg', 'Remember: a cast shadow falls on the objects behind — the burger shades the bucket')}
${F('p47-83.jpg', 'Same can twice: only a contour — and with light, shadow and a cast shadow')}
<p><b>Tip from the book:</b> draw a small arrow-sun outside the edge of the page — and don’t change it until the end.</p>`,
    simple: 'Choose one light source and keep it. Light side — white paper, shadow behind the terminator is darkest, leave a bit of reflected light, the cast shadow is darkest at the contact point. Hard light — bold black and white; soft light — dots and smooth transitions.',
    mist: [['“Flat black” — the shadow is one solid cut-out.', 'Leave a thin lighter strip of reflected light at the shadow edge.'],
      ['Every little bump gets its own shadow — the page crumbles.', 'Group shadows into big masses, details only at the edge.'],
      ['Shadows fall in different directions.', 'Draw an arrow-sun outside the page and check every shadow against it.'],
      ['The cast shadow is the same grey everywhere.', 'Make it darkest and sharpest where the object touches the table.']],
    terms: [['Highlight', 'the brightest spot — untouched white paper'], ['Half-tone', 'the zone where the form turns from light to shadow'], ['Terminator', 'the border between light and form shadow'], ['Reflected light', 'light bouncing back into the shadow from nearby surfaces'], ['Cast shadow', 'the shadow an object throws onto other things'], ['Occlusion', 'the darkest shadow where two things touch'], ['Low-key / high-key', 'a picture mostly dark / mostly light']],
    fact: 'The word “chiaroscuro” — Italian for “light-dark” — names the way Renaissance painters modelled form with strong contrast. Caravaggio pushed it so far that his figures seem to step out of darkness.',
    test: [['Where is the darkest place on the object itself?', 'Right behind the terminator, in the form shadow', 'In the highlight', 'At the outer edge of the shadow, by the table', 'Reflected light lightens the far edge of the shadow; the darkest strip is just behind the terminator.'],
      ['Why leave reflected light in the shadow?', 'Otherwise the shadow looks like a flat cut-out', 'To save ink', 'It is where the highlight goes', 'A thin lighter strip keeps the shadow round.'],
      ['Where is a cast shadow darkest and sharpest?', 'At the point of contact with the surface', 'Far from the object', 'Everywhere the same', 'Occlusion — the darkest dark — lives where things touch.'],
      ['What is typical of hard light?', 'A sharp terminator and almost no half-tones', 'Smooth transitions and no black', 'No shadows at all', 'Sun or a spotlight give bold black-and-white blocks.'],
      ['Which tools suit soft light?', 'Sparse hatching, dots, diluted ink', 'Solid black and thick contours', 'Only a ruler', 'Soft light needs smooth transitions without hard edges.'],
      ['What does back light give?', 'A thin glowing rim and a body almost all in shadow', 'A shadow down the middle of the object', 'No contrast at all', 'The source is behind — only the edge shines.'],
      ['How do you keep shadows consistent?', 'Mark one light source outside the page and never change it', 'Draw each shadow where it looks nice', 'Use two lamps', 'One arrow-sun — one logic for all shadows.']],
    task: { h: 'Lamp on, lamp off', need: 'a liner or brush pen, a sketchbook page, a lamp, a simple object (mug, apple, jar)', time: '30 min',
      steps: ['Dim the light in the room. Draw the object with a contour only — no shadows.', 'Turn on a strong lamp from the side. Draw a small arrow-sun outside the edge of the page.', 'Draw the object again: everything in light is white paper, all shadow is solid ink.', 'Add the cast shadow — darkest where the object touches the table.', 'Put the two sketches side by side. Write one word next to each: how does it feel?'] },
    client: { name: 'Moss McCandle', job: 'a small candle with a big flame and an even bigger fear of drafts', say: 'Ahem. I am the only source of light in this room, and NOBODY draws what I do. The mug, the book, the tea — they all have shadows because of ME. Draw my still life: me on the left, and everything else obeying my light. And close the window, please.',
      ask: ['One light source — the candle — and all shadows running away from it', 'Lit sides as white paper, shadows in solid ink', 'A dark cast shadow at every point of contact'] },
  },
  ru: {
    name: 'Свет и тень',
    intro: 'У туши есть только чёрное и белое — и всё же она умеет показать утреннее солнце, туманный вечер и свечу в темноте. Сегодня разбираемся, как падает свет, где живёт тень и как сказать всё это линиями и точками.',
    goals: ['называть части света и тени на предмете', 'различать жёсткий, рассеянный, контровой и боковой свет', 'выбрать один источник света и держаться его весь скетч'],
    th: `<p>Свет — то, что превращает плоский круг в шар. У каждого предмета есть маленькая <b>семья света</b>: блик (просто белая бумага), свет и <b>полутон</b> — самая информативная часть, где форма поворачивается.</p>
<h4>Семья тени</h4>
<ul><li><b>Терминатор</b> — граница, где кончается свет и начинается тень.</li>
<li><b>Собственная тень</b> — тень на самом предмете; самое тёмное место на нём — сразу за терминатором.</li>
<li><b>Рефлекс</b> — немного света, отражённого от стола. Оставь у края тени тонкую светлую полоску, иначе тень станет плоской вырезкой.</li>
<li><b>Падающая тень</b> — тень на столе. Самая тёмная и резкая в точке контакта (<b>окклюзия</b>), дальше — мягче и светлее.</li></ul>
${F('p44-77.jpg', 'Один источник: с одной стороны немного света, с другой — нет света, и падающая тень уходит от лампы')}
${F('p44-75.jpg', 'Коробка, цилиндр, конус: тень всегда убегает от света')}
<h4>Жёсткий и рассеянный свет</h4>
${F('p42-71.jpg', 'Жёсткий свет: резкий терминатор, почти нет полутонов, смелая чёрная тень')}
<p><b>Жёсткий свет</b> (солнце, прожектор) — мало полутонов, резкий терминатор, смелые решения: здесь чёрное, здесь белое. Тени становятся геометрическими блоками. Настроение — напряжение, тайна.</p>
${F('p42-69.jpg', 'Рассеянный свет: точки и редкая штриховка, плавный переход, без жёстких краёв')}
<p><b>Рассеянный свет</b> (облака, абажур) — плавный переход, тень не доходит до чистого чёрного, а важнее всего тёмные стыки, где предметы касаются. Редкая штриховка, точки, разбавленная тушь, без жёстких контуров — для кожи, лепестков, тумана.</p>
<h4>Откуда светит</h4>
<ul><li><b>Контровой свет</b> — источник сзади: тонкая светящаяся кромка, тело почти всё в тени. Нуар. Кромку делай разной толщины.</li>
<li><b>Боковой свет</b> (90°) — терминатор проходит по середине, проявляется фактура, длинные тени ведут взгляд.</li></ul>
${F('p43-73.jpg', 'Двигаешь лампу — двигаются тени. Тушью белое не закрасить: свет — это бумага, которую ты оставляешь')}
<h4>Тон в туши</h4>
<p>Серого карандаша у туши нет — тон делается оптически: штриховка, перекрёстная штриховка, точки, заливка разбавленной тушью. <b>Low-key</b> (много чёрного) — драма, <b>high-key</b> (много белого) — лёгкость и воздух. Проверяй силуэт: читается ли предмет тёмным или светлым пятном?</p>
${F('p46-81.jpg', 'Помни: падающая тень ложится на предметы позади — бургер затеняет ведёрко')}
${F('p47-83.jpg', 'Одна и та же банка дважды: только контур — и со светом, тенью и падающей тенью')}
<p><b>Совет из книги:</b> нарисуй маленькую стрелку-солнце за краем листа — и не меняй её до конца.</p>`,
    simple: 'Выбери один источник света и держись его. Свет — белая бумага, за терминатором тень темнее всего, оставь немного рефлекса, падающая тень темнее всего в точке контакта. Жёсткий свет — смелые чёрное и белое; рассеянный — точки и плавные переходы.',
    mist: [['«Плоский чёрный» — тень одной сплошной вырезкой.', 'Оставь у края тени тонкую светлую полоску рефлекса.'],
      ['Каждой кочке своя тень — лист рассыпается.', 'Собирай тени в большие массы, детали — только на границе.'],
      ['Тени падают в разные стороны.', 'Нарисуй стрелку-солнце за краем листа и сверяй с ней каждую тень.'],
      ['Падающая тень везде одинаково серая.', 'Сделай её самой тёмной и резкой там, где предмет касается стола.']],
    terms: [['Блик', 'самое светлое место — нетронутая белая бумага'], ['Полутон', 'зона, где форма поворачивает от света к тени'], ['Терминатор', 'граница между светом и собственной тенью'], ['Рефлекс', 'свет, отражённый в тень от соседних поверхностей'], ['Падающая тень', 'тень, которую предмет отбрасывает на другие'], ['Окклюзия', 'самая тёмная тень там, где предметы касаются'], ['Low-key / high-key', 'картинка в основном тёмная / в основном светлая']],
    fact: 'Слово «кьяроскуро» по-итальянски значит «светлое-тёмное» — так называют способ художников Возрождения лепить форму сильным контрастом. Караваджо довёл его до того, что его фигуры словно выходят из темноты.',
    test: [['Где самое тёмное место на самом предмете?', 'Сразу за терминатором, в собственной тени', 'В блике', 'У дальнего края тени, возле стола', 'Рефлекс высветляет дальний край тени; самая тёмная полоса — сразу за терминатором.'],
      ['Зачем оставлять в тени рефлекс?', 'Иначе тень выглядит плоской вырезкой', 'Чтобы сэкономить тушь', 'Там место для блика', 'Тонкая светлая полоска сохраняет тень круглой.'],
      ['Где падающая тень самая тёмная и резкая?', 'В точке контакта с поверхностью', 'Далеко от предмета', 'Везде одинаково', 'Окклюзия — самое тёмное тёмное — живёт там, где предметы касаются.'],
      ['Что характерно для жёсткого света?', 'Резкий терминатор и почти нет полутонов', 'Плавные переходы и никакого чёрного', 'Совсем нет теней', 'Солнце или прожектор дают смелые чёрно-белые блоки.'],
      ['Какие приёмы подходят рассеянному свету?', 'Редкая штриховка, точки, разбавленная тушь', 'Сплошной чёрный и толстые контуры', 'Только линейка', 'Рассеянному свету нужны плавные переходы без жёстких краёв.'],
      ['Что даёт контровой свет?', 'Тонкую светящуюся кромку и тело почти всё в тени', 'Тень по середине предмета', 'Никакого контраста', 'Источник сзади — светится только край.'],
      ['Как сделать тени согласованными?', 'Отметить один источник света за краем листа и не менять его', 'Рисовать каждую тень там, где красиво', 'Взять две лампы', 'Одна стрелка-солнце — одна логика для всех теней.']],
    task: { h: 'Лампа выключена, лампа включена', need: 'линер или брашпен, страница скетчбука, лампа, простой предмет (кружка, яблоко, банка)', time: '30 мин',
      steps: ['Приглуши свет в комнате. Нарисуй предмет только контуром — без теней.', 'Включи сильную лампу сбоку. Нарисуй маленькую стрелку-солнце за краем листа.', 'Нарисуй предмет снова: всё, что на свету, — белая бумага, вся тень — сплошная тушь.', 'Добавь падающую тень — самую тёмную там, где предмет касается стола.', 'Положи два скетча рядом. Напиши у каждого одно слово: какое от него ощущение?'] },
    client: { name: 'Фитилёк Маккендл', job: 'маленькая свеча с большим пламенем и ещё большим страхом сквозняков', say: 'Кхм. Я единственный источник света в этой комнате, и НИКТО не рисует, что я делаю. Кружка, книга, чай — у них всех тени из-за МЕНЯ. Нарисуй мой натюрморт: я слева, а всё остальное подчиняется моему свету. И закрой, пожалуйста, окно.',
      ask: ['Один источник света — свеча, и все тени убегают от неё', 'Освещённые стороны — белая бумага, тени — сплошная тушь', 'Тёмная падающая тень в каждой точке контакта'] },
  },
  lv: {
    name: 'Gaisma un ēna',
    intro: 'Tušai ir tikai melns un balts — un tomēr tā prot parādīt rīta sauli, miglainu vakaru un sveci tumsā. Šodien noskaidrojam, kā krīt gaisma, kur dzīvo ēna un kā to visu pateikt ar līnijām un punktiem.',
    goals: ['nosaukt gaismas un ēnas daļas uz priekšmeta', 'atšķirt cieto, izkliedēto, kontra un sānu gaismu', 'izvēlēties vienu gaismas avotu un turēties pie tā visu skici'],
    th: `<p>Gaisma ir tas, kas plakanu apli pārvērš par lodi. Katram priekšmetam ir maza <b>gaismas ģimene</b>: atspīdums (vienkārši balts papīrs), gaisma un <b>pustonis</b> — informatīvākā daļa, kur forma pagriežas.</p>
<h4>Ēnas ģimene</h4>
<ul><li><b>Terminators</b> — robeža, kur beidzas gaisma un sākas ēna.</li>
<li><b>Paša ēna</b> — ēna uz paša priekšmeta; tumšākā vieta uz tā ir uzreiz aiz terminatora.</li>
<li><b>Reflekss</b> — mazliet gaismas, kas atstarojas no galda. Atstāj pie ēnas malas plānu gaišāku joslu, citādi ēna kļūs par plakanu izgriezumu.</li>
<li><b>Krītošā ēna</b> — ēna uz galda. Tumšākā un asākā saskares punktā (<b>oklūzija</b>), tālāk — maigāka un gaišāka.</li></ul>
${F('p44-77.jpg', 'Viens avots: vienā pusē mazliet gaismas, otrā — nav gaismas, un krītošā ēna aiziet prom no lampas')}
${F('p44-75.jpg', 'Kaste, cilindrs, konuss: ēna vienmēr bēg no gaismas')}
<h4>Cietā un izkliedētā gaisma</h4>
${F('p42-71.jpg', 'Cietā gaisma: ass terminators, gandrīz nav pustoņu, drosmīga melna ēna')}
<p><b>Cietā gaisma</b> (saule, prožektors) — maz pustoņu, ass terminators, drosmīgi lēmumi: te melns, te balts. Ēnas kļūst par ģeometriskiem blokiem. Noskaņa — spriedze, noslēpums.</p>
${F('p42-69.jpg', 'Izkliedētā gaisma: punkti un rets svītrojums, plūstoša pāreja, bez cietām malām')}
<p><b>Izkliedētā gaisma</b> (mākoņi, abažūrs) — plūstoša pāreja, ēna nesasniedz tīru melnu, un svarīgākās ir tumšās saskares vietas. Rets svītrojums, punkti, atšķaidīta tuša, bez cietiem kontūriem — ādai, ziedlapām, miglai.</p>
<h4>No kurienes spīd</h4>
<ul><li><b>Kontragaisma</b> — avots aizmugurē: plāna mirdzoša mala, ķermenis gandrīz viss ēnā. Nuārs. Malu dari dažāda biezuma.</li>
<li><b>Sānu gaisma</b> (90°) — terminators iet pa vidu, parādās faktūra, garas ēnas vada skatienu.</li></ul>
${F('p43-73.jpg', 'Pārvieto lampu — pārvietojas ēnas. Ar tušu baltu neuzkrāsosi: gaisma ir papīrs, ko atstāj')}
<h4>Tonis tušā</h4>
<p>Pelēka zīmuļa tušai nav — tonis rodas optiski: svītrojums, krustenisks svītrojums, punkti, atšķaidītas tušas laviers. <b>Low-key</b> (daudz melnā) — drāma, <b>high-key</b> (daudz baltā) — vieglums un gaiss. Pārbaudi siluetu: vai priekšmets nolasās kā tumšs vai gaišs plankums?</p>
${F('p46-81.jpg', 'Atceries: krītošā ēna krīt uz priekšmetiem aizmugurē — burgers aizēno spainīti')}
${F('p47-83.jpg', 'Viena un tā pati bundža divreiz: tikai kontūrs — un ar gaismu, ēnu un krītošo ēnu')}
<p><b>Padoms no grāmatas:</b> uzzīmē mazu bultu-sauli aiz lapas malas — un nemaini to līdz beigām.</p>`,
    simple: 'Izvēlies vienu gaismas avotu un turies pie tā. Gaisma — balts papīrs, aiz terminatora ēna ir vistumšākā, atstāj mazliet refleksa, krītošā ēna vistumšākā saskares punktā. Cietā gaisma — drosmīgs melns un balts; izkliedētā — punkti un plūstošas pārejas.',
    mist: [['“Plakanais melnais” — ēna kā viens vienlaidus izgriezums.', 'Atstāj pie ēnas malas plānu gaišu refleksa joslu.'],
      ['Katram pauguriņam sava ēna — lapa sabirst.', 'Apvieno ēnas lielās masās, detaļas — tikai uz robežas.'],
      ['Ēnas krīt uz dažādām pusēm.', 'Uzzīmē bultu-sauli aiz lapas malas un salīdzini ar to katru ēnu.'],
      ['Krītošā ēna visur vienādi pelēka.', 'Padari to vistumšāko un asāko tur, kur priekšmets pieskaras galdam.']],
    terms: [['Atspīdums', 'gaišākā vieta — neskarts balts papīrs'], ['Pustonis', 'zona, kur forma pagriežas no gaismas uz ēnu'], ['Terminators', 'robeža starp gaismu un paša ēnu'], ['Reflekss', 'gaisma, kas atstarojas ēnā no blakus virsmām'], ['Krītošā ēna', 'ēna, ko priekšmets met uz citiem'], ['Oklūzija', 'tumšākā ēna tur, kur priekšmeti saskaras'], ['Low-key / high-key', 'attēls pārsvarā tumšs / pārsvarā gaišs']],
    fact: 'Vārds “kjaroskuro” itāliski nozīmē “gaišs-tumšs” — tā sauc renesanses gleznotāju veidu veidot formu ar spēcīgu kontrastu. Karavadžo to aizveda tik tālu, ka viņa figūras it kā iznāk no tumsas.',
    test: [['Kur ir tumšākā vieta uz paša priekšmeta?', 'Uzreiz aiz terminatora, paša ēnā', 'Atspīdumā', 'Pie ēnas tālākās malas, pie galda', 'Reflekss pagaišina ēnas tālāko malu; tumšākā josla ir uzreiz aiz terminatora.'],
      ['Kāpēc ēnā atstāt refleksu?', 'Citādi ēna izskatās kā plakans izgriezums', 'Lai ietaupītu tušu', 'Tur ir vieta atspīdumam', 'Plāna gaiša josla saglabā ēnu apaļu.'],
      ['Kur krītošā ēna ir vistumšākā un asākā?', 'Saskares punktā ar virsmu', 'Tālu no priekšmeta', 'Visur vienādi', 'Oklūzija — tumšākais tumšais — dzīvo tur, kur priekšmeti saskaras.'],
      ['Kas raksturīgs cietajai gaismai?', 'Ass terminators un gandrīz nav pustoņu', 'Plūstošas pārejas un nekāda melnā', 'Nav ēnu vispār', 'Saule vai prožektors dod drosmīgus melnbaltus blokus.'],
      ['Kādi paņēmieni der izkliedētai gaismai?', 'Rets svītrojums, punkti, atšķaidīta tuša', 'Vienlaidus melns un biezi kontūri', 'Tikai lineāls', 'Izkliedētai gaismai vajag plūstošas pārejas bez cietām malām.'],
      ['Ko dod kontragaisma?', 'Plānu mirdzošu malu un ķermeni gandrīz visu ēnā', 'Ēnu priekšmeta vidū', 'Nekādu kontrastu', 'Avots aizmugurē — spīd tikai mala.'],
      ['Kā padarīt ēnas saskaņotas?', 'Atzīmēt vienu gaismas avotu aiz lapas malas un to nemainīt', 'Zīmēt katru ēnu tur, kur skaisti', 'Ņemt divas lampas', 'Viena bulta-saule — viena loģika visām ēnām.']],
    task: { h: 'Lampa izslēgta, lampa ieslēgta', need: 'lainers vai otas pildspalva, skiču burtnīcas lapa, lampa, vienkāršs priekšmets (krūze, ābols, burka)', time: '30 min',
      steps: ['Pievāji gaismu istabā. Uzzīmē priekšmetu tikai ar kontūru — bez ēnām.', 'Ieslēdz spēcīgu lampu no sāniem. Uzzīmē mazu bultu-sauli aiz lapas malas.', 'Uzzīmē priekšmetu vēlreiz: viss, kas gaismā, — balts papīrs, visa ēna — vienlaidus tuša.', 'Pievieno krītošo ēnu — vistumšāko tur, kur priekšmets pieskaras galdam.', 'Noliec abas skices blakus. Uzraksti pie katras vienu vārdu: kāda no tās sajūta?'] },
    client: { name: 'Dakts Makkendls', job: 'maza svece ar lielu liesmu un vēl lielākām bailēm no caurvēja', say: 'Khm. Es esmu vienīgais gaismas avots šajā istabā, un NEVIENS nezīmē, ko es daru. Krūzei, grāmatai, tējai — visām ir ēnas MANIS dēļ. Uzzīmē manu klusināto dabu: es pa kreisi, un viss pārējais pakļaujas manai gaismai. Un aizver, lūdzu, logu.',
      ask: ['Viens gaismas avots — svece, un visas ēnas bēg no tās', 'Apgaismotās puses — balts papīrs, ēnas — vienlaidus tuša', 'Tumša krītošā ēna katrā saskares punktā'] },
  },
};
