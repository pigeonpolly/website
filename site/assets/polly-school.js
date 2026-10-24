// «Школа Полли» (/polly-helps/, docs/challenge.md): Полли в фартуке у мольберта учит рисовать на бумаге.
// Тропинка из 12 уроков по книге Алины «Watercolor Sketches: Creative Guide» → пиксельный диплом.
// Урок = реплики Полли (остаются в ленте, по старой можно вернуть картинку на мольберт), мини-игра, задание на бумаге, клиент из Воббленда.
// Шаги урока — в браузере; сдача фото — worker/school.js. Проверяет Алина в кабинете «🎓 Школа», но ученику это — печать и записка от Полли.
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
    note: ['A note for Polly (optional)', 'Записка Полли (можно пусто)', 'Zīmīte Pollijai (var tukšu)'],
    send: ['Hand in to Polly', 'Сдать Полли', 'Iesniegt Pollijai'],
    sending: ['Sending…', 'Отправляю…', 'Sūtu…'],
    noPic: ['First add a photo of your page.', 'Сначала добавь фото страницы.', 'Vispirms pievieno lapas foto.'],
    fail: ['Could not send — try again in a minute.', 'Не получилось отправить — попробуй через минуту.', 'Neizdevās nosūtīt — mēģini pēc minūtes.'],
    signin: ['Sign in to hand in your page', 'Войди, чтобы сдать страницу', 'Ienāc, lai iesniegtu lapu'],
    signNote: ['Polly checks works of signed-in birds, so she can send you a stamp or a note.', 'Полли проверяет работы вошедших птичек — так она сможет прислать печать или записку.', 'Pollija pārbauda ienākušo putniņu darbus — tā viņa varēs atsūtīt zīmogu vai zīmīti.'],
    wait: ['⏳ Your page is with Polly. You can still swap the photo.', '⏳ Страница у Полли. Фото пока можно заменить.', '⏳ Lapa ir pie Pollijas. Foto vēl var nomainīt.'],
    swap: ['📷 Swap the photo', '📷 Заменить фото', '📷 Nomainīt foto'],
    ok: ['✅ Stamp from Polly! Lesson done.', '✅ Печать от Полли! Урок пройден.', '✅ Zīmogs no Pollijas! Nodarbība pabeigta.'],
    redo: ['↩ Polly asks to try once more', '↩ Полли просит попробовать ещё раз', '↩ Pollija lūdz pamēģināt vēlreiz'],
    again2: ['Hand in again', 'Сдать заново', 'Iesniegt vēlreiz'],
    alina: ['Polly', 'Полли', 'Pollija'],
    soon: ['soon', 'скоро', 'drīz'],
    book: ['The pictures come from Alina’s book', 'Рисунки — из книги Алины', 'Zīmējumi ir no Alīnas grāmatas'],
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
      say: ['Now on paper! Pick any two of these things and find them at home. First only shapes, then a couple of details. Tick the ones you draw.', 'Теперь на бумаге! Выбери любые две вещи из списка и найди их дома. Сначала только фигуры, потом пара деталей. Отметь те, что нарисованы.', 'Tagad uz papīra! Izvēlies jebkuras divas lietas no saraksta un atrodi tās mājās. Vispirms tikai figūras, tad pāris detaļu. Atzīmē uzzīmētās.'] },
    { client: 'mr-crisper', name: ['Mr. Crisper', 'Мистер Криспер', 'Misters Krispers'], job: ['lost-and-found, Wobbleland station', 'бюро находок, вокзал Воббленда', 'atrasto mantu birojs, Vobllendas stacija'],
      say: ['Oh dear, oh dear! Things at the lost-and-found have no labels, and I can’t sleep. Draw me the two you picked in simple shapes, so I can label at least those boxes!', 'Ох-ох-ох! В бюро находок вещи без этикеток, и я не могу уснуть. Нарисуй мне те две, что выбраны, простыми фигурами — подпишу хоть эти коробки!', 'Ak vai, ak vai! Atrasto mantu birojā lietām nav etiķešu, un es nevaru aizmigt. Uzzīmē man tās divas, kuras izvēlējies, ar vienkāršām figūrām — uzlīmēšu etiķetes vismaz šīm kastēm!'] },
    { img: 'l1-c4.png', say: ['I look at every page myself: a stamp, or a note on what to try again. The answer comes to your envelope 💌. And I’m already preparing lesson 2!', 'Я смотрю каждую страницу сама: ставлю печать или пишу, что попробовать ещё раз. Ответ придёт в конвертик 💌. А урок 2 я уже готовлю!', 'Es katru lapu apskatu pati: uzlieku zīmogu vai uzrakstu, ko pamēģināt vēlreiz. Atbilde pienāks aploksnē 💌. Bet 2. nodarbību es jau gatavoju!'] },
  ];

  let st = load();
  st.step = Math.min(st.step || 0, S.length - 1);
  st.quiz = st.quiz ?? null; st.find = st.find || []; st.paper = st.paper || [];
  let view = st.step;
  const srv = { me: null, works: {} }; // с сервера: вошла ли птичка, последняя сдача по урокам
  const LESSON = 1;
  const loadSrv = () => fetch('/api/school', { credentials: 'same-origin' }).then(r => r.json()).then(d => {
    srv.me = !!d.me; srv.works = {}; for (const w of d.works || []) srv.works[w.lesson] = w;
    render();
  }).catch(() => { srv.me = false; });
  // фото → полная (1600) и превью (480) JPEG, как в челлендже
  const jpeg = (bmp, max, q) => { const k = Math.min(1, max / Math.max(bmp.width, bmp.height)), c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k); c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height); return new Promise(r => c.toBlob(r, 'image/jpeg', q)); };
  let picked = null;
  const verdict = () => {
    const w = srv.works[LESSON];
    if (!w) return '';
    const c = w.comment ? `<p class="ps-note"><b>${t('alina')}:</b> ${esc(w.comment)}</p>` : '';
    return `<div class="ps-verdict ${w.status}"><img src="/api/img/${w.img}?t=1" alt=""><div><p>${t(w.status)}</p>${c}</div></div>`;
  };

  const easelArt = i => {
    const s = S[i];
    if (s.find) return lampSvg(st.find);
    if (s.client) return `<img class="ps-client-pic" src="/images/wobbleland/pt-${s.client}.png" alt="">`;
    return `<img src="${IMG}${s.img}" alt="">`;
  };
  const PAPER_MIN = 2; // из пяти вещей — любые две (решение Алины)
  const blocked = i => {
    const s = S[i];
    if (s.quiz) return st.quiz === null;
    if (s.find) return st.find.length < LAMP.length;
    if (s.paper) return st.paper.length < PAPER_MIN;
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
    if (s.client) {
      if (srv.me === null) return '';
      if (!srv.me) return `<div class="ps-hand"><button type="button" class="ps-file ps-login">${t('signin')}</button><p class="ps-states">${t('signNote')}</p></div>`;
      const w = srv.works[LESSON];
      if (w && w.status === 'ok') return `<p class="ps-ans">${t('ok')}</p>`;
      return `${w && w.status === 'wait' ? verdict() : ''}<form class="ps-hand" onsubmit="return false"><label class="ps-file">${w && w.status === 'wait' ? t('swap') : t('upload')}<input type="file" accept="image/*" hidden></label><img class="ps-prev" alt="" hidden><textarea rows="2" placeholder="${esc(t('note'))}"></textarea><button type="button" class="ps-send">${w && w.status === 'redo' ? t('again2') : t('send')}</button><p class="ps-proto" role="status"></p></form>`;
    }
    return '';
  };
  const bubble = i => {
    const s = S[i];
    const who = s.client ? `<div class="ps-who"><img src="/images/wobbleland/ch-${s.client}.png" alt=""><b>${tr(s.name)}</b><span>${tr(s.job)}</span></div>` : '';
    return `<li class="ps-b${s.client ? ' client' : ''}${i === view ? ' cur' : ''}" data-i="${i}">${who}<p>${tr(s.say)}</p>${extra(i)}${i === view ? `<span class="ps-eye">👁 ${t('onEasel')}</span>` : ''}</li>`;
  };

  const mark = { wait: '⏳', ok: '✅', redo: '↩' };
  const path = () => `<ol class="ps-path">${LESSONS.map((n, i) => { const w = srv.works[i + 1], prevDone = i === 1 && srv.works[1]; return `<li class="${i === 0 ? 'open cur' : 'lock'}${w ? ' ' + w.status : ''}" title="${i ? esc(prevDone ? t('soon') : t('locked')) : ''}"><span class="ps-dot">${w ? mark[w.status] : i ? (prevDone ? '🕊' : '🔒') : ICON[i]}</span><small>${i + 1}. ${tr(n)}${prevDone ? ` · ${t('soon')}` : ''}</small></li>`; }).join('')}<li class="lock dip"><span class="ps-dot">📜</span><small>${t('diploma')}</small></li></ol>`;

  const render = () => {
    box.innerHTML = `<div class="ps-head"><h1>${t('title')}</h1><p>${t('lead')}</p><p class="ps-free">${t('free')}</p></div>
      <h3 class="ps-h3">${t('path')}</h3>${path()}${srv.works[LESSON] && srv.works[LESSON].status !== 'wait' ? verdict() : ''}
      <div class="ps-class">
        <div class="ps-stage"><div class="ps-easel"><div class="ps-paperbox">${easelArt(view)}</div></div>${polly}<span class="ps-tag">${t('lesson')} 1 · ${tr(LESSONS[0])}</span></div>
        <div class="ps-chat"><p class="ps-hint">${t('log')}</p><ol class="ps-log">${S.slice(0, st.step + 1).map((_, i) => bubble(i)).join('')}</ol>
          <div class="ps-bar"><button type="button" class="ps-again">${t('again')}</button>${st.step < S.length - 1 ? `<button type="button" class="ps-next"${blocked(st.step) ? ' disabled' : ''}>${t('next')}</button>` : ''}</div></div>
      </div>
      <a class="ps-book" href="/e-books/"><img src="${IMG}book-cover.jpg" alt=""><span>${t('book')} <b>Watercolor Sketches: Creative Guide</b><em>${t('bookGo')}</em></span></a>`;
  };

  box.addEventListener('click', e => {
    const el = e.target;
    if (el.closest('.ps-next')) { st.step++; view = st.step; save(st); render(); const nb = box.querySelector('.ps-log li:last-child'); nb && nb.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return; }
    if (el.closest('.ps-again')) { st = { step: 0, quiz: null, find: [], paper: [] }; view = 0; save(st); render(); return; }
    const q = el.closest('[data-q]');
    if (q) { st.quiz = +q.dataset.q; save(st); render(); return; }
    const g = el.closest('.ps-find g[data-k]');
    if (g && S[view].find) { if (!st.find.includes(g.dataset.k)) st.find.push(g.dataset.k); save(st); render(); return; }
    if (el.closest('.ps-login')) { window.PPAccount && window.PPAccount.openSignIn(); return; }
    if (el.closest('.ps-send')) { send(el.closest('.ps-hand')); return; }
    if (el.closest('input, textarea, label, form')) return;
    const b = el.closest('.ps-b');
    if (b) { view = +b.dataset.i; render(); }
  });
  box.addEventListener('change', e => {
    const p = e.target.closest('[data-p]');
    if (p) { const k = +p.dataset.p; st.paper = p.checked ? [...new Set([...st.paper, k])] : st.paper.filter(x => x !== k); save(st); box.querySelector('.ps-next') && (box.querySelector('.ps-next').disabled = blocked(st.step)); return; }
    const f = e.target.closest('.ps-file input');
    if (f && f.files[0]) { picked = f.files[0]; const img = box.querySelector('.ps-prev'); img.src = URL.createObjectURL(picked); img.hidden = false; }
  });
  async function send(form) {
    const msg = form.querySelector('.ps-proto'), btn = form.querySelector('.ps-send');
    if (!picked) { msg.textContent = t('noPic'); return; }
    btn.disabled = true; msg.textContent = t('sending');
    try {
      const bmp = await createImageBitmap(picked);
      const fd = new FormData();
      fd.append('lesson', LESSON); fd.append('note', form.querySelector('textarea').value);
      fd.append('full', await jpeg(bmp, 1600, 0.85), 'full.jpg'); fd.append('thumb', await jpeg(bmp, 480, 0.8), 'thumb.jpg');
      const r = await fetch('/api/school/hand', { method: 'POST', credentials: 'same-origin', body: fd });
      if (!r.ok) throw new Error(r.status);
      picked = null; await loadSrv();
    } catch (e) { btn.disabled = false; msg.textContent = t('fail'); }
  }
  render();
  loadSrv();
  if (location.hash === '#school') setTimeout(() => box.scrollIntoView(), 80);
})();
