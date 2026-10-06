// «Полли, помоги нарисовать!» — окно с инструкцией: любой предмет = несколько фигур, потом детали.
// Открывается любой кнопкой с атрибутом data-polly-help (страница челленджа, блок «Тема дня» на главной).
(() => {
  const L = { en: 0, ru: 1, lv: 2 }[document.documentElement.lang] ?? 0;
  const T = {
    title: ['Any object from simple shapes', 'Любой предмет из простых фигур', 'Jebkurš priekšmets no vienkāršām figūrām'],
    lead: ['Any object is just a few familiar shapes. Let’s take apart a <b>mug</b> first, then today’s theme the same way.', 'Любой предмет — это просто несколько знакомых фигур. Сегодня разберём <b>чашку</b>, а потом так же — тему дня.', 'Jebkurš priekšmets ir tikai dažas pazīstamas figūras. Vispirms izjauksim <b>krūzi</b>, pēc tam tāpat — dienas tēmu.'],
    bub: ['Coo! Don’t try to draw “a mug” straight away. First look at it like a pigeon on a ledge: which shapes do you see? 🕊', 'Курлык! Не пытайтесь сразу нарисовать «чашку». Сначала посмотрите на неё как голубь с карниза: какие фигуры вы видите? 🕊', 'Kū! Nemēģini uzreiz uzzīmēt “krūzi”. Vispirms paskaties uz to kā balodis no dzegas: kādas figūras tu redzi? 🕊'],
    s: [
      [['Find the big shapes', 'Squint. A mug is a rectangle (the body) and a circle (the handle). No more than 2–3 shapes.'], ['Найдите большие фигуры', 'Прищурьтесь. Чашка — это прямоугольник (тело) и круг (ручка). Не больше 2–3 фигур.'], ['Atrodi lielās figūras', 'Piemiedz acis. Krūze ir taisnstūris (ķermenis) un aplis (rokturis). Ne vairāk kā 2–3 figūras.']],
      [['Give the shapes volume', 'The rectangle becomes a cylinder: ovals at the top and bottom. Draw lightly, these lines will fade later.'], ['Дайте фигурам объём', 'Прямоугольник становится цилиндром: сверху и снизу — овалы. Рисуйте легко, линии потом исчезнут.'], ['Piešķir figūrām apjomu', 'Taisnstūris kļūst par cilindru: augšā un apakšā — ovāli. Zīmē viegli, līnijas vēlāk pazudīs.']],
      [['Refine the outline', 'Trace the real form over the shapes: the base is a little narrower, the handle is a thick loop, not a circle.'], ['Уточните контур', 'Обведите по фигурам настоящую форму: дно чуть уже, ручка — толстая петля, а не круг.'], ['Precizē kontūru', 'Apvelc pa figūrām īsto formu: apakša nedaudz šaurāka, rokturis — bieza cilpa, nevis aplis.']],
      [['Add the details', 'Coffee inside, a highlight, steam. Details come last, once the form holds.'], ['Добавьте детали', 'Кофе внутри, блик, пар. Детали — в самом конце, когда форма уже держится.'], ['Pievieno detaļas', 'Kafija iekšā, atspīdums, tvaiks. Detaļas — pašās beigās, kad forma jau turas.']],
      [['Make it yours', 'A pattern, a shadow on the table, a word. It’s no longer “a mug”, it’s your mug.'], ['Сделайте её своей', 'Узор, тень на столе, надпись. Это уже не «чашка вообще», а ваша чашка.'], ['Padari to par savu', 'Raksts, ēna uz galda, uzraksts. Tā vairs nav “krūze vispār”, bet tava krūze.']],
      [['Now — today’s theme', 'Look at today’s object and repeat steps 1–5. Anything can be built from shapes.'], ['Теперь — тема дня', 'Посмотрите на сегодняшний предмет и повторите шаги 1–5. Любую вещь можно собрать из фигур.'], ['Tagad — dienas tēma', 'Paskaties uz šodienas priekšmetu un atkārto 1.–5. soli. Jebko var salikt no figūrām.']],
    ],
    lamp: ['lamp?', 'лампа?', 'lampa?'], tree: ['tree?', 'ёлка?', 'egle?'],
    tip1: ['<b>Check proportions:</b> how many times does the width fit into the height? Compare the shapes with each other, not with perfection.', '<b>Проверяйте пропорции:</b> сколько раз ширина помещается в высоту? Сравнивайте фигуры друг с другом, а не с идеалом.', '<b>Pārbaudi proporcijas:</b> cik reizes platums ietilpst augstumā? Salīdzini figūras savā starpā, nevis ar ideālu.'],
    tip2: ['<b>Don’t erase right away:</b> light shape lines can stay — in a sketch they look alive.', '<b>Не стирайте сразу:</b> лёгкие линии фигур можно оставить — в скетче они выглядят живо.', '<b>Nedzēs uzreiz:</b> vieglās figūru līnijas var palikt — skicē tās izskatās dzīvi.'],
    src: ['From my sketching guides', 'По мотивам моих скетч-гайдов', 'Pēc manām skicēšanas grāmatām'],
    go: ['Got it, drawing! ✏️', 'Понятно, рисую! ✏️', 'Skaidrs, zīmēju! ✏️'], close: ['Close', 'Закрыть', 'Aizvērt'],
  };
  const t = k => T[k][L];
  const I = [
    '<rect x="62" y="40" width="76" height="70" fill="#E3D6FA" opacity=".55"/><circle cx="148" cy="72" r="18" fill="none" stroke="#D85A30" stroke-width="3" stroke-dasharray="5 4"/><rect x="62" y="40" width="76" height="70" fill="none" stroke="#7F81BF" stroke-width="3" stroke-dasharray="5 4"/>',
    '<line x1="100" y1="22" x2="100" y2="126" stroke="#C9B8E0" stroke-width="1.5"/><ellipse cx="100" cy="42" rx="38" ry="10" fill="none" stroke="#7F81BF" stroke-width="2.5"/><ellipse cx="100" cy="110" rx="38" ry="10" fill="none" stroke="#7F81BF" stroke-width="2.5" stroke-dasharray="4 4"/><line x1="62" y1="42" x2="62" y2="110" stroke="#7F81BF" stroke-width="2.5"/><line x1="138" y1="42" x2="138" y2="110" stroke="#7F81BF" stroke-width="2.5"/><circle cx="148" cy="74" r="18" fill="none" stroke="#D85A30" stroke-width="2.5"/>',
    '<ellipse cx="100" cy="42" rx="38" ry="10" fill="none" stroke="#C9B8E0" stroke-width="1.5"/><path d="M62 42 L66 104 Q100 122 134 104 L138 42" fill="none" stroke="#2B1A51" stroke-width="3"/><ellipse cx="100" cy="42" rx="38" ry="10" fill="none" stroke="#2B1A51" stroke-width="3"/><path d="M137 58 C164 54 166 92 134 92" fill="none" stroke="#2B1A51" stroke-width="3"/><path d="M137 66 C154 64 154 86 135 84" fill="none" stroke="#2B1A51" stroke-width="2"/>',
    '<path d="M62 42 L66 104 Q100 122 134 104 L138 42" fill="#F5C4B3" stroke="#2B1A51" stroke-width="3"/><ellipse cx="100" cy="42" rx="38" ry="10" fill="#7A4A2A" stroke="#2B1A51" stroke-width="3"/><path d="M137 58 C164 54 166 92 134 92" fill="none" stroke="#2B1A51" stroke-width="3"/><path d="M137 66 C154 64 154 86 135 84" fill="none" stroke="#2B1A51" stroke-width="2"/><path d="M76 52 L78 98" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/><path d="M88 24 q-6 -8 0 -16 M104 26 q-6 -8 0 -16" fill="none" stroke="#B9AFDD" stroke-width="2.5" stroke-linecap="round"/>',
    '<path d="M62 42 L66 104 Q100 122 134 104 L138 42" fill="#F5C4B3" stroke="#2B1A51" stroke-width="3"/><ellipse cx="100" cy="42" rx="38" ry="10" fill="#7A4A2A" stroke="#2B1A51" stroke-width="3"/><path d="M137 58 C164 54 166 92 134 92" fill="none" stroke="#2B1A51" stroke-width="3"/><path d="M137 66 C154 64 154 86 135 84" fill="none" stroke="#2B1A51" stroke-width="2"/><path d="M82 72 c4 -8 14 -8 18 0 c4 -8 14 -8 18 0 c0 10 -18 20 -18 20 s-18 -10 -18 -20z" fill="#D85A30"/><ellipse cx="100" cy="122" rx="54" ry="7" fill="#E3D3AE"/>',
    `<g fill="none" stroke-width="2.5"><rect x="22" y="58" width="44" height="40" stroke="#7F81BF" stroke-dasharray="4 3"/><circle cx="44" cy="44" r="14" stroke="#D85A30" stroke-dasharray="4 3"/><polygon points="120,96 150,40 180,96" stroke="#7F81BF" stroke-dasharray="4 3"/><rect x="138" y="96" width="24" height="16" stroke="#D85A30" stroke-dasharray="4 3"/></g><text x="44" y="122" text-anchor="middle" font-size="12" fill="#5A4E78">${t('lamp')}</text><text x="150" y="130" text-anchor="middle" font-size="12" fill="#5A4E78">${t('tree')}</text>`,
  ];
  const P = ['......ddd.....', '.....dbbbd....', '....dbbwwbd...', '....dbbwkbdoo.', '....dbbbbbdo..', '...dbbbbbbd...', '..dbbsbbbbd...', '.dbbssbbbbd...', 'dbbssbbbbbd...', 'dbbbbbbbbd....', '.ddbbbbbdd....', '...ddddd......', '....o..o......', '...oo.oo......'];
  const C = { d: '#1a1528', b: '#7f81bf', s: '#5e5a9c', w: '#fff', k: '#1a1528', o: '#f2a73b' };
  const polly = `<svg viewBox="0 0 14 14" shape-rendering="crispEdges" aria-hidden="true">${P.map((r, y) => [...r].map((ch, x) => C[ch] ? `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${C[ch]}"/>` : '').join('')).join('')}</svg>`;
  // --- гайд 2: как придумать, что нарисовать (карта ассоциаций)
  const G = {
    title: ['How to come up with what to draw', 'Как придумать, что нарисовать', 'Kā izdomāt, ko zīmēt'],
    lead: ['Blank page, empty head? Take one word and let it grow, the way sparrows gather around a bun.', 'Чистый лист и пустая голова? Возьмите одно слово и дайте ему разрастись — так воробьи слетаются к булке.', 'Tukša lapa un tukša galva? Paņem vienu vārdu un ļauj tam augt — kā zvirbuļi salido pie maizītes.'],
    bub: ['Coo! Let’s try with the word “umbrella”. You can take today’s theme instead.', 'Курлык! Попробуем на слове «зонт». А можно взять тему дня.', 'Kū! Pamēģināsim ar vārdu “lietussargs”. Var ņemt arī dienas tēmu.'],
    w: ['umbrella', 'зонт', 'lietussargs'],
    assoc: [['rain', 'puddle', 'grandma', 'wind', 'café', 'cat'], ['дождь', 'лужа', 'бабушка', 'ветер', 'кафе', 'кот'], ['lietus', 'peļķe', 'vecmāmiņa', 'vējš', 'kafejnīca', 'kaķis']],
    feat: [['old', 'yellow', 'tiny', 'torn'], ['старый', 'жёлтый', 'крошечный', 'дырявый'], ['vecs', 'dzeltens', 'sīks', 'caurs']],
    qs: [['Why?', 'How?', 'With what?', 'Who?', 'Where?', 'What if?'], ['Почему?', 'Как?', 'Чем?', 'Кто?', 'Где?', 'А что если?'], ['Kāpēc?', 'Kā?', 'Ar ko?', 'Kas?', 'Kur?', 'Un ja nu?']],
    s: [
      [['Write the word in the middle', 'One word, right in the centre of the page. This is your bun.'], ['Напишите слово посередине', 'Одно слово — в самом центре листа. Это ваша булка.'], ['Uzraksti vārdu vidū', 'Viens vārds — pašā lapas centrā. Tā ir tava maizīte.']],
      [['Surround it with associations', 'Like sparrows around a bun: everything that comes to mind, quickly, without judging. Six or more.'], ['Окружите его ассоциациями', 'Как воробьи булку: всё, что приходит в голову, быстро и без оценки. Шесть штук и больше.'], ['Apņem to ar asociācijām', 'Kā zvirbuļi maizīti: viss, kas nāk prātā, ātri un bez vērtēšanas. Seši un vairāk.']],
      [['Add characteristics', 'What is it like? Size, colour, age, mood, material. “Umbrella” becomes “an old yellow torn umbrella”.'], ['Добавьте характеристики', 'Какой он? Размер, цвет, возраст, настроение, материал. «Зонт» превращается в «старый жёлтый дырявый зонт».'], ['Pievieno īpašības', 'Kāds tas ir? Izmērs, krāsa, vecums, noskaņa, materiāls. “Lietussargs” kļūst par “vecu dzeltenu caurumainu lietussargu”.']],
      [['Ask yourself questions', 'Why is it torn? How did it get here? What is it made of? Who owns it? What if…? Each answer is a new picture.'], ['Задавайте себе вопросы', 'Почему он дырявый? Как он сюда попал? Чем его чинили? Чей он? А что если…? Каждый ответ — новая картинка.'], ['Uzdod sev jautājumus', 'Kāpēc tas ir caurs? Kā tas te nokļuva? Ar ko to lāpīja? Kam tas pieder? Un ja nu…? Katra atbilde ir jauns zīmējums.']],
      [['Pick the most unexpected', 'Connect two or three sparrows that don’t belong together. That’s your sketch.'], ['Выберите самое неожиданное', 'Соедините двух-трёх воробьёв, которые обычно не встречаются. Это и есть ваш рисунок.'], ['Izvēlies negaidītāko', 'Savieno divus trīs zvirbuļus, kas parasti nesatiekas. Tas arī ir tavs zīmējums.']],
    ],
    result: ['<b>For example:</b> an old torn umbrella in a café, and a cat hiding from the rain under it — because grandma forgot it there.', '<b>Например:</b> старый дырявый зонт в кафе, а под ним от дождя прячется кот — потому что бабушка забыла его там.', '<b>Piemēram:</b> vecs caurs lietussargs kafejnīcā, un zem tā no lietus slēpjas kaķis — jo vecmāmiņa to tur aizmirsa.'],
    tip1: ['<b>Quantity first:</b> the first three associations are the same for everyone. The interesting ones start after the sixth.', '<b>Сначала количество:</b> первые три ассоциации у всех одинаковые. Интересное начинается после шестой.', '<b>Vispirms daudzums:</b> pirmās trīs asociācijas visiem ir vienādas. Interesantais sākas pēc sestās.'],
    tip2: ['<b>Two minutes are enough:</b> set a timer, scribble fast, and start drawing while the idea is warm.', '<b>Хватит двух минут:</b> поставьте таймер, пишите быстро и начинайте рисовать, пока идея тёплая.', '<b>Pietiek ar divām minūtēm:</b> uzliec taimeri, raksti ātri un sāc zīmēt, kamēr ideja ir silta.'],
  };
  const g = k => G[k][L];
  const map = (step) => {
    const W = g('w'), A = G.assoc[L], F = G.feat[L], Q = G.qs[L];
    const pos = [[40, 34], [160, 30], [22, 86], [178, 90], [60, 124], [146, 128]];
    const sparrow = (x, y) => `<g transform="translate(${x - 6} ${y - 12})"><ellipse cx="6" cy="5" rx="6" ry="4.5" fill="#B07A4A"/><circle cx="10" cy="2" r="3" fill="#8A5A34"/><path d="M13 2 l3 1 -3 1z" fill="#E9A93B"/><circle cx="10.6" cy="1.6" r=".7" fill="#1a1528"/></g>`;
    let s = '<rect width="200" height="150" fill="#FFFDF6"/>';
    if (step >= 1) s += pos.map(([x, y], i) => `<line x1="100" y1="76" x2="${x}" y2="${y}" stroke="#E3D3AE" stroke-width="1.5"/>`).join('');
    s += `<ellipse cx="100" cy="76" rx="36" ry="18" fill="#E9B872" stroke="#2B1A51" stroke-width="2"/><path d="M78 70 q10 -6 22 0 q10 -6 22 0" fill="none" stroke="#C98A4A" stroke-width="2"/><text x="100" y="84" text-anchor="middle" font-size="12" font-weight="700" fill="#2B1A51">${W}</text>`;
    if (step >= 1) s += pos.map(([x, y], i) => `${sparrow(x, y)}<text x="${x}" y="${y + 9}" text-anchor="middle" font-size="9.5" fill="#5A4E78">${A[i]}</text>`).join('');
    if (step >= 2) s += F.map((f, i) => `<text x="${[100, 100, 52, 150][i]}" y="${[50, 108, 66, 64][i]}" text-anchor="middle" font-size="9" font-style="italic" fill="#D85A30">${f}</text>`).join('');
    if (step >= 3) s += Q.slice(0, 4).map((q, i) => `<g transform="translate(${[6, 152, 6, 150][i]} ${[4, 4, 140 - 4, 140 - 4][i] - 4})"><rect width="44" height="13" rx="6" fill="#7F81BF"/><text x="22" y="9.5" text-anchor="middle" font-size="8.5" font-weight="700" fill="#fff">${q}</text></g>`).join('');
    if (step >= 4) { const hl = [2, 4, 5].map(i => pos[i]); s += `<path d="M${hl[0][0]} ${hl[0][1] + 4} L${hl[1][0]} ${hl[1][1] + 4} L${hl[2][0]} ${hl[2][1] + 4}" fill="none" stroke="#D85A30" stroke-width="2.5" stroke-dasharray="4 3"/>` + hl.map(([x, y]) => `<circle cx="${x}" cy="${y + 2}" r="15" fill="none" stroke="#D85A30" stroke-width="2"/>`).join(''); }
    return `<svg viewBox="0 0 200 150" aria-hidden="true">${s}</svg>`;
  };
  const guide = (id, title, lead, bub, steps, art, tips, extra = '') => `<article class="ph-guide" id="${id}">
    <div class="ph-top">${polly}<div><h2>${title}</h2><p class="ph-lead">${lead}</p></div></div>
    <div class="ph-bub">${bub}</div>
    <div class="ph-steps">${steps.map((st, i) => `<div class="ph-st">${art(i)}<h3><span>${i + 1}</span>${st[L][0]}</h3><p>${st[L][1]}</p></div>`).join('')}</div>
    ${extra}<div class="ph-tips">${tips.map(x => `<p>${x}</p>`).join('')}</div></article>`;
  const box = document.getElementById('ph-guides');
  if (box) {
    box.innerHTML = guide('shapes', t('title'), t('lead'), t('bub'), T.s, i => `<svg viewBox="0 0 200 140" aria-hidden="true">${I[i]}</svg>`, [t('tip1'), t('tip2')]) +
      guide('ideas', g('title'), g('lead'), g('bub'), G.s, i => map(i), [g('tip1'), g('tip2')], `<p class="ph-result">${g('result')}</p>`);
    const h = location.hash && document.querySelector(location.hash); h && setTimeout(() => h.scrollIntoView(), 50);
  }
})();
