// «Школа Полли» (/polly-helps/, docs/challenge.md): Полли в фартуке у мольберта учит рисовать на бумаге.
// Тропинка из 12 уроков по книге Алины «Watercolor Sketches: Creative Guide» → пиксельный диплом.
// Урок = реплики Полли (остаются в ленте, по старой можно вернуть картинку на мольберт), мини-игра, задание на бумаге, клиент из Воббленда.
// Прототип: прогресс — в браузере; сдача работы, печать, комментарий и «на доработку» от Алины — следующая часть (сервер).
(() => {
  const box = document.getElementById('ps-school');
  if (!box) return;
  const L = { en: 0, ru: 1, lv: 2 }[document.documentElement.lang] ?? 0;
  const tr = a => a[L];
  const IMG = '/images/school/';
  const KEY = 'pp-school-1';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const save = s => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* без памяти — тоже работает */ } };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const T = {
    title: ['Polly’s Drawing School', 'Школа Полли', 'Pollijas zīmēšanas skola'],
    lead: ['Pen, paper and twelve small lessons. Every lesson ends with a real client from Wobbleland, and after twelve stamps you get a pixel diploma.', 'Ручка, бумага и двенадцать маленьких уроков. В конце каждого приходит настоящий клиент из Воббленда, а за двенадцать печатей — пиксельный диплом.', 'Pildspalva, papīrs un divpadsmit mazas nodarbības. Katras beigās ierodas īsts klients no Vobllendas, bet par divpadsmit zīmogiem — pikseļu diploms.'],
    free: ['The daily challenge is open to everyone — school is just for courage.', 'Челлендж открыт всем — школа просто для смелости.', 'Izaicinājums ir atvērts visiem — skola ir tikai drosmei.'],
    path: ['Student path', 'Тропинка ученика', 'Skolēna taka'],
    lesson: ['Lesson', 'Урок', 'Nodarbība'],
    diploma: ['Diploma', 'Диплом', 'Diploms'],
    locked: ['Opens after the previous lesson', 'Откроется после предыдущего урока', 'Atvērsies pēc iepriekšējās nodarbības'],
    next: ['Next →', 'Дальше →', 'Tālāk →'],
    again: ['↺ From the start', '↺ Сначала', '↺ No sākuma'],
    log: ['Polly’s words stay here — tap any of them to put its picture back on the easel.', 'Слова Полли остаются здесь — нажми на любую реплику, и её картинка вернётся на мольберт.', 'Pollijas vārdi paliek šeit — pieskaries jebkuram, un tā attēls atgriezīsies uz molberta.'],
    onEasel: ['on the easel', 'на мольберте', 'uz molberta'],
    found: ['Found', 'Найдено', 'Atrasts'],
    done5: ['All five are drawn ✏️', 'Все пять нарисованы ✏️', 'Visi pieci uzzīmēti ✏️'],
    upload: ['📷 Photo of your page', '📷 Фото твоей страницы', '📷 Tavas lapas foto'],
    note: ['A note for Alina (optional)', 'Записка Алине (можно пусто)', 'Zīmīte Alīnai (var tukšu)'],
    send: ['Hand in to Alina', 'Сдать Алине', 'Iesniegt Alīnai'],
    proto: ['Prototype: handing in will work in the next part. Lesson 2 opens right away, and the stamp comes from Alina.', 'Прототип: сдача заработает в следующей части. Урок 2 откроется сразу, а печать поставит Алина.', 'Prototips: iesniegšana strādās nākamajā daļā. 2. nodarbība atvērsies uzreiz, bet zīmogu uzliks Alīna.'],
    states: ['⏳ with Alina · ✅ stamp · ↩ try again, with Alina’s comment', '⏳ у Алины · ✅ печать · ↩ на доработку, с комментарием Алины', '⏳ pie Alīnas · ✅ zīmogs · ↩ jāpapildina, ar Alīnas komentāru'],
    book: ['These pictures come from my book', 'Эти рисунки — из моей книги', 'Šie zīmējumi ir no manas grāmatas'],
    bookGo: ['More exercises inside →', 'Там ещё больше упражнений →', 'Tur vēl vairāk vingrinājumu →'],
  };
  const t = k => tr(T[k]);

  const LESSONS = [
    ['Shapes', 'Фигуры', 'Figūras'], ['Lines', 'Линии', 'Līnijas'], ['Texture', 'Текстура', 'Tekstūra'],
    ['Combinations', 'Сочетания', 'Kombinācijas'], ['Volume', 'Объём', 'Apjoms'], ['Shadows', 'Тени', 'Ēnas'],
    ['Details', 'Детали', 'Detaļas'], ['Cylinders', 'Цилиндры', 'Cilindri'], ['Ellipses', 'Эллипсы', 'Elipses'],
    ['Pro secrets', 'Секреты', 'Noslēpumi'], ['Composition', 'Композиция', 'Kompozīcija'], ['Collage', 'Коллаж', 'Kolāža'],
  ];
  const ICON = ['◯', '〰', '▦', '◭', '▣', '◐', '✦', '▥', '⬭', '★', '▤', '✂'];

  // Полли в фартуке и берете (пиксели 14×15)
  const P = ['......rr......', '.....rrrr.....', '.....dbbbd....', '....dbbwwbd...', '....dbbwkbdoo.', '....dbbbbbdo..', '...dbbaaaad...', '..dbbsaaaad...', '.dbbssaaaad...', 'dbbssbappad...', 'dbbbbaaaad....', '.ddbbbbbdd....', '...ddddd......', '....o..o......', '...oo.oo......'];
  const C = { d: '#1a1528', b: '#7f81bf', s: '#5e5a9c', w: '#fff', k: '#1a1528', o: '#f2a73b', a: '#F0A987', p: '#D85A30', r: '#D85A30' };
  const polly = `<svg class="ps-polly" viewBox="0 0 14 15" shape-rendering="crispEdges" aria-hidden="true">${P.map((row, y) => [...row].map((ch, x) => C[ch] ? `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${C[ch]}"/>` : '').join('')).join('')}</svg>`;

  // мини-игра: лампа из трёх фигур
  const LAMP = [
    ['tri', '<polygon points="70,30 130,30 150,92 50,92"/>', ['trapezoid — almost a triangle!', 'трапеция — почти треугольник!', 'trapece — gandrīz trīsstūris!']],
    ['rect', '<rect x="93" y="92" width="14" height="70"/>', ['rectangle', 'прямоугольник', 'taisnstūris']],
    ['oval', '<ellipse cx="100" cy="168" rx="42" ry="11"/>', ['oval', 'овал', 'ovāls']],
  ];
  const lampSvg = got => `<svg class="ps-find" viewBox="0 0 200 190" role="img"><rect width="200" height="190" fill="#fff"/>${LAMP.map(([k, el]) => `<g data-k="${k}" class="${got.includes(k) ? 'on' : ''}">${el}</g>`).join('')}<path d="M118 92 q6 18 -2 30" fill="none" stroke="#2B1A51" stroke-width="2"/><circle cx="116" cy="124" r="3" fill="#2B1A51"/></svg>`;

  const S = [
    { img: 'l1-s1.png', say: ['Coo! I’m Polly, and today I’m your teacher. Grab any paper and a pen — a napkin works too.', 'Курлык! Я Полли, и сегодня я твой учитель. Возьми любую бумагу и ручку — салфетка тоже подойдёт.', 'Kū! Es esmu Pollija, un šodien es esmu tava skolotāja. Paņem jebkuru papīru un pildspalvu — der arī salvete.'] },
    { img: 'l1-s1.png', say: ['My secret: everything in the world is made of a few shapes. Circle, square, triangle and two ovals — one standing, one lying.', 'Мой секрет: всё на свете собрано из нескольких фигур. Круг, квадрат, треугольник и два овала — один стоит, другой лежит.', 'Mans noslēpums: viss pasaulē ir salikts no dažām figūrām. Aplis, kvadrāts, trīsstūris un divi ovāli — viens stāv, otrs guļ.'] },
    { img: 'l1-s1.png', say: ['Warm-up: draw each shape five times. Crooked ones count! A wobbly circle is still a circle — and much more alive.', 'Разминка: нарисуй каждую фигуру пять раз. Кривые тоже считаются! Кривой круг — всё равно круг, и он гораздо живее.', 'Iesildīšanās: uzzīmē katru figūru piecas reizes. Šķības arī skaitās! Šķībs aplis tik un tā ir aplis — un daudz dzīvāks.'] },
    { img: 'l1-c1.png', say: ['Now look. Just a circle. Boring?', 'А теперь смотри. Просто круг. Скучно?', 'Tagad skaties. Vienkārši aplis. Garlaicīgi?'] },
    { img: 'l1-c2.png', say: ['A loop on top, two hands, a little shadow — and it’s a clock! The circle did all the work.', 'Петелька сверху, две стрелки, немного тени — и это уже часы! Всю работу сделал круг.', 'Cilpiņa augšā, divi rādītāji, mazliet ēnas — un tas jau ir pulkstenis! Visu darbu izdarīja aplis.'] },
    { img: 'l1-c3.png', say: ['Another circle, a bit lopsided. Guess what it becomes?', 'Ещё один круг, чуть кривой. Угадай, во что он превратится?', 'Vēl viens aplis, mazliet šķībs. Uzmini, par ko tas pārvērtīsies?'],
      quiz: [[['🌙 The moon', '🌙 Луна', '🌙 Mēness'], 0], [['🍳 A frying pan', '🍳 Сковородка', '🍳 Panna'], 1], [['🔘 A button', '🔘 Пуговка', '🔘 Poga'], 0]],
      yes: ['Yes! You think like an artist already.', 'Да! Ты уже думаешь как художник.', 'Jā! Tu jau domā kā mākslinieks.'],
      no: ['Could be! But I had something tastier in mind…', 'Тоже можно! Но я задумала кое-что повкуснее…', 'Arī var! Bet es biju iedomājusies ko garšīgāku…'] },
    { img: 'l1-c4.png', say: ['A frying pan with a fried egg! See? Shapes first, details later — that’s the whole trick.', 'Сковородка с яичницей! Видишь? Сначала фигуры, потом детали — вот и весь фокус.', 'Panna ar ceptu olu! Redzi? Vispirms figūras, pēc tam detaļas — tas ir viss triks.'] },
    { find: 1, say: ['Game time! This lamp hides three shapes. Tap all of them.', 'Игра! В этой лампе спрятаны три фигуры. Найди и нажми все.', 'Spēle! Šajā lampā paslēptas trīs figūras. Atrodi un pieskaries visām.'] },
    { img: 'l1-s1.png', paper: [['a mug', 'кружка', 'krūze'], ['a book', 'книга', 'grāmata'], ['a lamp', 'лампа', 'lampa'], ['a fruit', 'фрукт', 'auglis'], ['a bottle', 'бутылка', 'pudele']],
      say: ['Now on paper! Find five things at home. First only shapes, then a couple of details. Tick each one you draw.', 'Теперь на бумаге! Найди дома пять вещей. Сначала только фигуры, потом пара деталей. Отмечай каждую нарисованную.', 'Tagad uz papīra! Atrodi mājās piecas lietas. Vispirms tikai figūras, tad pāris detaļu. Atzīmē katru uzzīmēto.'] },
    { client: 'mr-crisper', name: ['Mr. Crisper', 'Мистер Криспер', 'Misters Krispers'], job: ['lost-and-found, Wobbleland station', 'бюро находок, вокзал Воббленда', 'atrasto mantu birojs, Vobllendas stacija'],
      say: ['Oh dear, oh dear! Five things at the lost-and-found have no labels, and I can’t sleep. Draw them for me in simple shapes, so I can label the boxes!', 'Ох-ох-ох! В бюро находок пять вещей без этикеток, и я не могу уснуть. Нарисуй их мне простыми фигурами, чтобы я подписал коробки!', 'Ak vai, ak vai! Atrasto mantu birojā piecām lietām nav etiķešu, un es nevaru aizmigt. Uzzīmē tās man ar vienkāršām figūrām, lai es varu uzlīmēt etiķetes kastēm!'] },
    { img: 'l1-c4.png', say: ['Alina looks at every page herself: a stamp, or a note on what to try again. Lesson 2 is already waiting!', 'Алина смотрит каждую страницу сама: ставит печать или пишет, что попробовать ещё раз. А урок 2 уже ждёт!', 'Alīna katru lapu apskata pati: uzliek zīmogu vai uzraksta, ko pamēģināt vēlreiz. Bet 2. nodarbība jau gaida!'] },
  ];

  let st = load();
  st.step = Math.min(st.step || 0, S.length - 1);
  st.quiz = st.quiz ?? null; st.find = st.find || []; st.paper = st.paper || [];
  let view = st.step;

  const easelArt = i => {
    const s = S[i];
    if (s.find) return lampSvg(st.find);
    if (s.client) return `<img class="ps-client-pic" src="/images/wobbleland/pt-${s.client}.png" alt="">`;
    return `<img src="${IMG}${s.img}" alt="">`;
  };
  const blocked = i => {
    const s = S[i];
    if (s.quiz) return st.quiz === null;
    if (s.find) return st.find.length < LAMP.length;
    if (s.paper) return st.paper.length < s.paper.length;
    return false;
  };
  const extra = i => {
    const s = S[i];
    if (s.quiz) {
      if (st.quiz === null) return `<div class="ps-quiz">${s.quiz.map(([q], k) => `<button type="button" data-q="${k}">${tr(q)}</button>`).join('')}</div>`;
      return `<p class="ps-ans">${tr(s.quiz[st.quiz][0])} — ${tr(s.quiz[st.quiz][1] ? s.yes : s.no)}</p>`;
    }
    if (s.find) return `<p class="ps-ans">${t('found')}: ${st.find.length} / ${LAMP.length}${st.find.length ? ' · ' + st.find.map(k => tr(LAMP.find(x => x[0] === k)[2])).join(', ') : ''}</p>`;
    if (s.paper) return `<div class="ps-paper">${s.paper.map((p, k) => `<label><input type="checkbox" data-p="${k}"${st.paper.includes(k) ? ' checked' : ''}> ${tr(p)}</label>`).join('')}</div>`;
    if (s.client) return `<form class="ps-hand" onsubmit="return false"><label class="ps-file">${t('upload')}<input type="file" accept="image/*" hidden></label><img class="ps-prev" alt="" hidden><textarea rows="2" placeholder="${esc(t('note'))}"></textarea><button type="button" class="ps-send">${t('send')}</button><p class="ps-proto" hidden>${t('proto')}</p><p class="ps-states">${t('states')}</p></form>`;
    return '';
  };
  const bubble = i => {
    const s = S[i];
    const who = s.client ? `<div class="ps-who"><img src="/images/wobbleland/ch-${s.client}.png" alt=""><b>${tr(s.name)}</b><span>${tr(s.job)}</span></div>` : '';
    return `<li class="ps-b${s.client ? ' client' : ''}${i === view ? ' cur' : ''}" data-i="${i}">${who}<p>${tr(s.say)}</p>${extra(i)}${i === view ? `<span class="ps-eye">👁 ${t('onEasel')}</span>` : ''}</li>`;
  };

  const path = () => `<ol class="ps-path">${LESSONS.map((n, i) => `<li class="${i === 0 ? 'open cur' : 'lock'}" title="${i ? esc(t('locked')) : ''}"><span class="ps-dot">${i ? '🔒' : ICON[i]}</span><small>${i + 1}. ${tr(n)}</small></li>`).join('')}<li class="lock dip"><span class="ps-dot">📜</span><small>${t('diploma')}</small></li></ol>`;

  const render = (keep) => {
    box.innerHTML = `<div class="ps-head"><h2>${t('title')}</h2><p>${t('lead')}</p><p class="ps-free">${t('free')}</p></div>
      <h3 class="ps-h3">${t('path')}</h3>${path()}
      <div class="ps-class">
        <div class="ps-stage"><div class="ps-easel"><div class="ps-paperbox">${easelArt(view)}</div></div>${polly}<span class="ps-tag">${t('lesson')} 1 · ${tr(LESSONS[0])}</span></div>
        <div class="ps-chat"><p class="ps-hint">${t('log')}</p><ol class="ps-log">${S.slice(0, st.step + 1).map((_, i) => bubble(i)).join('')}</ol>
          <div class="ps-bar"><button type="button" class="ps-again">${t('again')}</button>${st.step < S.length - 1 ? `<button type="button" class="ps-next"${blocked(st.step) ? ' disabled' : ''}>${t('next')}</button>` : ''}</div></div>
      </div>
      <a class="ps-book" href="/e-books/"><img src="${IMG}book-cover.jpg" alt=""><span>${t('book')} <b>Watercolor Sketches: Creative Guide</b><em>${t('bookGo')}</em></span></a>`;
    const log = box.querySelector('.ps-log');
    if (keep) log.scrollTop = keep; else log.scrollTop = log.scrollHeight;
  };

  box.addEventListener('click', e => {
    const el = e.target;
    if (el.closest('.ps-next')) { st.step++; view = st.step; save(st); render(); box.querySelector('.ps-log li:last-child').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return; }
    if (el.closest('.ps-again')) { st = { step: 0, quiz: null, find: [], paper: [] }; view = 0; save(st); render(); return; }
    const q = el.closest('[data-q]');
    if (q) { st.quiz = +q.dataset.q; save(st); render(); return; }
    const g = el.closest('.ps-find g[data-k]');
    if (g && S[view].find) { if (!st.find.includes(g.dataset.k)) st.find.push(g.dataset.k); save(st); render(box.querySelector('.ps-log').scrollTop || 1); return; }
    if (el.closest('.ps-send')) { box.querySelector('.ps-proto').hidden = false; return; }
    if (el.closest('input, textarea, label, form')) return;
    const b = el.closest('.ps-b');
    if (b) { view = +b.dataset.i; render(box.querySelector('.ps-log').scrollTop || 1); }
  });
  box.addEventListener('change', e => {
    const p = e.target.closest('[data-p]');
    if (p) { const k = +p.dataset.p; st.paper = p.checked ? [...new Set([...st.paper, k])] : st.paper.filter(x => x !== k); save(st); box.querySelector('.ps-next') && (box.querySelector('.ps-next').disabled = blocked(st.step)); return; }
    const f = e.target.closest('.ps-file input');
    if (f && f.files[0]) { const img = box.querySelector('.ps-prev'); img.src = URL.createObjectURL(f.files[0]); img.hidden = false; }
  });
  render();
})();
