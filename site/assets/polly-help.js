// «Полли, помоги нарисовать!» — окно с инструкцией: любой предмет = несколько фигур, потом детали.
// Открывается любой кнопкой с атрибутом data-polly-help (страница челленджа, блок «Тема дня» на главной).
(() => {
  const L = { en: 0, ru: 1, lv: 2 }[document.documentElement.lang] ?? 0;
  const T = {
    title: ['Polly, help me draw!', 'Полли, помоги нарисовать!', 'Pollija, palīdzi uzzīmēt!'],
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
  let dlg, opener;
  const build = () => {
    dlg = document.createElement('div'); dlg.className = 'ph-help'; dlg.hidden = true;
    dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true'); dlg.setAttribute('aria-label', t('title'));
    dlg.innerHTML = `<div class="ph-card"><button type="button" class="ph-x" aria-label="${t('close')}">✕</button>
      <div class="ph-top">${polly}<div><h2>${t('title')}</h2><p class="ph-lead">${t('lead')}</p></div></div>
      <div class="ph-bub">${t('bub')}</div>
      <div class="ph-steps">${T.s.map((st, i) => `<div class="ph-st"><svg viewBox="0 0 200 140" aria-hidden="true">${I[i]}</svg><h3><span>${i + 1}</span>${st[L][0]}</h3><p>${st[L][1]}</p></div>`).join('')}</div>
      <div class="ph-tips"><p>${t('tip1')}</p><p>${t('tip2')}</p></div>
      <div class="ph-bot"><a href="/e-books/">${t('src')}</a><button type="button" class="ph-go">${t('go')}</button></div></div>`;
    document.body.appendChild(dlg);
    dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('.ph-x, .ph-go')) close(); });
  };
  const open = el => { if (!dlg) build(); opener = el; dlg.hidden = false; document.body.style.overflow = 'hidden'; dlg.querySelector('.ph-x').focus(); };
  const close = () => { dlg.hidden = true; document.body.style.overflow = ''; opener && opener.focus(); };
  document.addEventListener('click', e => { const b = e.target.closest('[data-polly-help]'); if (b) { e.preventDefault(); open(b); } });
  addEventListener('keydown', e => { if (e.key === 'Escape' && dlg && !dlg.hidden) close(); });
})();
