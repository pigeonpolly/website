// «Школа Полли» (/polly-helps/, docs/challenge.md): Полли в фартуке у мольберта учит рисовать на бумаге.
// Тропинка из 12 уроков по книге Алины «Watercolor Sketches: Creative Guide» → пиксельный диплом. Уроки — site/assets/school-lessons.js.
// Урок = реплики Полли (остаются в ленте, по старой можно вернуть картинку на мольберт), мини-игры, задание на бумаге, клиент из Воббленда.
// Шаги уроков — в браузере (pp-school); сдача фото — worker/school.js. Проверяет Алина в кабинете «🎓 Школа», но ученику это — печать и записка от Полли.
// Урок открыт, если предыдущий сдан или пройден до клиента. Диплом — когда у всех 12 уроков печать.
(() => {
  const box = document.getElementById('ps-school');
  const LS = window.PP_SCHOOL_LESSONS;
  if (!box || !LS) return;
  const L = { en: 0, ru: 1, lv: 2 }[document.documentElement.lang] ?? 0;
  const tr = a => a[L];
  const IMG = '/images/school/';
  const KEY = 'pp-school';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const N = LS.length;

  const T = {
    title: ['Polly’s Drawing School', 'Школа Полли', 'Pollijas zīmēšanas skola'],
    lead: ['Pen, paper and twelve small lessons. Every lesson ends with a real client from Wobbleland, and after twelve stamps you get a pixel diploma and buttons.', 'Ручка, бумага и двенадцать маленьких уроков. В конце каждого приходит настоящий клиент из Воббленда, а за двенадцать печатей — пиксельный диплом и пуговки.', 'Pildspalva, papīrs un divpadsmit mazas nodarbības. Katras beigās ierodas īsts klients no Vobllendas, bet par divpadsmit zīmogiem — pikseļu diploms un pogas.'],
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
    polly: ['Polly', 'Полли', 'Pollija'],
    task: ['📋 The order', '📋 Заказ', '📋 Pasūtījums'],
    book: ['The pictures come from Alina’s book', 'Рисунки — из книги Алины', 'Zīmējumi ir no Alīnas grāmatas'],
    bookGo: ['More exercises inside →', 'Там ещё больше упражнений →', 'Tur vēl vairāk vingrinājumu →'],
    endNext: ['I look at every page myself: a stamp, or a note on what to try again. The answer comes to your envelope 💌. Meanwhile the next lesson is open: ', 'Я смотрю каждую страницу сама: ставлю печать или пишу, что попробовать ещё раз. Ответ придёт в конвертик 💌. А пока открыт следующий урок: ', 'Es katru lapu apskatu pati: uzlieku zīmogu vai uzrakstu, ko pamēģināt vēlreiz. Atbilde pienāks aploksnē 💌. Bet pagaidām ir atvērta nākamā nodarbība: '],
    endLast: ['That was the last lesson! When all twelve pages have my stamp, your diploma opens at the end of the path. 📜', 'Это был последний урок! Когда на всех двенадцати страницах будет моя печать, в конце тропинки откроется твой диплом. 📜', 'Tā bija pēdējā nodarbība! Kad visās divpadsmit lapās būs mans zīmogs, takas galā atvērsies tavs diploms. 📜'],
    goNext: ['Go to lesson', 'К уроку', 'Uz nodarbību'],
    dipWait: ['The diploma opens when every lesson has a stamp. Stamps so far:', 'Диплом откроется, когда у каждого урока будет печать. Печатей сейчас:', 'Diploms atvērsies, kad katrai nodarbībai būs zīmogs. Zīmogu pagaidām:'],
    dipTitle: ['DIPLOMA', 'ДИПЛОМ', 'DIPLOMS'],
    dipSchool: ['Polly’s Drawing School', 'Школа Полли', 'Pollijas zīmēšanas skola'],
    dipLine: ['12 lessons · 12 stamps · drawing on paper', '12 уроков · 12 печатей · рисунок на бумаге', '12 nodarbības · 12 zīmogi · zīmējums uz papīra'],
    dipMotto: ['Shapes first, details later — and never be afraid of a crooked line!', 'Сначала фигуры, потом детали — и никогда не бойся кривой линии!', 'Vispirms figūras, tad detaļas — un nekad nebaidies no šķības līnijas!'],
    dipSign: ['Teacher Polly', 'Учитель Полли', 'Skolotāja Pollija'],
    dipCongrats: ['Congratulations! All twelve stamps are in. Here is your diploma — and the daily challenge is waiting for your drawings.', 'Поздравляю! Все двенадцать печатей стоят. Вот твой диплом — а челлендж ждёт твоих рисунков.', 'Apsveicu! Visi divpadsmit zīmogi ir uzlikti. Lūk, tavs diploms — un izaicinājums gaida tavus zīmējumus.'],
    dipSave: ['⬇ Save the diploma', '⬇ Скачать диплом', '⬇ Lejupielādēt diplomu'],
    toChallenge: ['✏️ To the challenge', '✏️ В челлендж', '✏️ Uz izaicinājumu'],
    back: ['← Back to the lesson', '← Назад к уроку', '← Atpakaļ uz nodarbību'],
  };
  const t = k => tr(T[k]);

  // Полли в фартуке и берете (пиксели 14×15)
  const P = ['......rr......', '.....rrrr.....', '.....dbbbd....', '....dbbwwbd...', '....dbbwkbdoo.', '....dbbbbbdo..', '...dbbaaaad...', '..dbbsaaaad...', '.dbbssaaaad...', 'dbbssbappad...', 'dbbbbaaaad....', '.ddbbbbbdd....', '...ddddd......', '....o..o......', '...oo.oo......'];
  const C = { d: '#1a1528', b: '#7f81bf', s: '#5e5a9c', w: '#fff', k: '#1a1528', o: '#f2a73b', a: '#F0A987', p: '#D85A30', r: '#D85A30' };
  const polly = `<svg class="ps-polly" viewBox="0 0 14 15" shape-rendering="crispEdges" aria-hidden="true">${P.map((row, y) => [...row].map((ch, x) => C[ch] ? `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${C[ch]}"/>` : '').join('')).join('')}</svg>`;

  // уроки: шаги из school-lessons.js + прощальная реплика Полли после клиента
  const stepsOf = n => {
    const l = LS[n - 1], s = l.steps.slice(), last = [...s].reverse().find(x => x.img || x.art);
    const nx = LS[n];
    s.push({ img: last && last.img, art: last && last.art, end: 1, say: nx ? [0, 1, 2].map(i => T.endNext[i] + '«' + nx.name[i] + '»') : T.endLast });
    return s;
  };
  const clientAt = n => LS[n - 1].steps.findIndex(x => x.client);

  // прогресс: { cur, l: { [урок]: { step, quiz: {шаг: ответ}, find: {шаг: [ключи]}, paper: [] } } }; старый формат урока 1 (pp-school-1) переносится
  let st;
  try { st = JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { st = null; }
  if (!st) {
    st = { cur: 1, l: {} };
    try { const o = JSON.parse(localStorage.getItem('pp-school-1')); if (o) st.l[1] = { step: o.step || 0, quiz: o.quiz != null ? { 5: o.quiz } : {}, find: o.find && o.find.length ? { 7: o.find } : {}, paper: o.paper || [] }; } catch (e) {}
  }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* без памяти — тоже работает */ } };
  const ls = n => (st.l[n] = st.l[n] || { step: 0, quiz: {}, find: {}, paper: [] });
  const srv = { me: null, nick: '', works: {} }; // с сервера: вошла ли птичка, последняя сдача по урокам
  const finished = n => ls(n).step >= clientAt(n);
  const isOpen = n => n === 1 || !!srv.works[n - 1] || finished(n - 1);
  const stamps = () => Object.values(srv.works).filter(w => w.status === 'ok').length;
  if (!(st.cur >= 1 && st.cur <= N) || !isOpen(st.cur)) st.cur = 1;
  let mode = 'lesson', view = Math.min(ls(st.cur).step, stepsOf(st.cur).length - 1);

  const loadSrv = () => fetch('/api/school?lang=' + ['en', 'ru', 'lv'][L], { credentials: 'same-origin' }).then(r => r.json()).then(d => {
    srv.me = !!d.me; srv.nick = d.nick || ''; srv.btn = d.diplomaBtn || 0; srv.works = {}; for (const w of d.works || []) srv.works[w.lesson] = w;
    render();
  }).catch(() => { srv.me = false; render(); });
  // фото → полная (1600) и превью (480) JPEG, как в челлендже
  const jpeg = (bmp, max, q) => { const k = Math.min(1, max / Math.max(bmp.width, bmp.height)), c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k); c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height); return new Promise(r => c.toBlob(r, 'image/jpeg', q)); };
  let picked = null;
  const verdict = n => {
    const w = srv.works[n];
    if (!w) return '';
    const c = w.comment ? `<p class="ps-note"><b>${t('polly')}:</b> ${esc(w.comment)}</p>` : '';
    return `<div class="ps-verdict ${w.status}"><img src="/api/img/${w.img}?t=1" alt=""><div><p>${t(w.status)}</p>${c}</div></div>`;
  };

  // мини-игра «найди»: части нажимаются
  const findSvg = (f, got) => `<svg class="ps-find" viewBox="0 0 200 190" role="img"><rect width="200" height="190" fill="#fff"/>${f.deco || ''}${f.parts.map(([k, el]) => `<g data-k="${k}" class="${got.includes(k) ? 'on' : ''}">${el}</g>`).join('')}</svg>`;
  const easelArt = (n, i) => {
    const s = stepsOf(n)[i], p = ls(n);
    if (s.find) return findSvg(s.find, p.find[i] || []);
    if (s.client) return `<img class="ps-client-pic" src="/images/cards/${s.client.card}" alt="${esc(tr(s.client.name))}">`; // карточка жителя — акварель Алины
    if (s.art) return s.art;
    return s.img ? `<img src="${IMG}${s.img}" alt="">` : '';
  };
  const blocked = (n, i) => {
    const s = stepsOf(n)[i], p = ls(n);
    if (s.quiz) return p.quiz[i] == null;
    if (s.find) return (p.find[i] || []).length < s.find.parts.length;
    if (s.paper) return p.paper.length < s.paper.min;
    return false;
  };
  const pickedOf = n => { const ps = LS[n - 1].steps.find(x => x.paper); return ps ? ps.paper.opts.filter((_, k) => ls(n).paper.includes(k)).map(tr) : []; };
  const extra = (n, i) => {
    const s = stepsOf(n)[i], p = ls(n);
    if (s.quiz) {
      const a = p.quiz[i];
      if (a == null) return `<div class="ps-quiz">${s.quiz.opts.map(([q], k) => `<button type="button" data-q="${k}">${tr(q)}</button>`).join('')}</div>`;
      return `<p class="ps-ans">${tr(s.quiz.opts[a][0])} — ${tr(s.quiz.opts[a][1] ? s.quiz.yes : s.quiz.no)}</p>`;
    }
    if (s.find) { const got = p.find[i] || []; return `<p class="ps-ans">${t('found')}: ${got.length} / ${s.find.parts.length}${got.length ? ' · ' + got.map(k => tr(s.find.parts.find(x => x[0] === k)[2])).join(', ') : ''}</p>`; }
    if (s.paper) return `<div class="ps-paper">${s.paper.opts.map((o, k) => `<label><input type="checkbox" data-p="${k}"${p.paper.includes(k) ? ' checked' : ''}> ${tr(o)}</label>`).join('')}</div>`;
    if (s.client) {
      const pk = esc(pickedOf(n).join(', ') || '—');
      const task = `<div class="ps-task"><b>${t('task')}</b><ol>${s.client.task.map(x => `<li>${esc(tr(x)).replace('{picked}', `<b>${pk}</b>`)}</li>`).join('')}</ol></div>`;
      if (srv.me === null) return task;
      if (!srv.me) return task + `<div class="ps-hand"><button type="button" class="ps-file ps-login">${t('signin')}</button><p class="ps-states">${t('signNote')}</p></div>`;
      const w = srv.works[n];
      if (w && w.status === 'ok') return `<p class="ps-ans">${t('ok')}</p>`;
      return `${task}${w && w.status === 'wait' ? verdict(n) : ''}<form class="ps-hand" onsubmit="return false"><label class="ps-file">${w && w.status === 'wait' ? t('swap') : t('upload')}<input type="file" accept="image/*" hidden></label><img class="ps-prev" alt="" hidden><textarea rows="2" placeholder="${esc(t('note'))}"></textarea><button type="button" class="ps-send">${w && w.status === 'redo' ? t('again2') : t('send')}</button><p class="ps-proto" role="status"></p></form>`;
    }
    if (s.end && n < N) return `<div class="ps-quiz"><button type="button" data-go="${n + 1}">${t('goNext')} ${n + 1} →</button></div>`;
    return '';
  };
  const bubble = (n, i) => {
    const s = stepsOf(n)[i], c = s.client;
    const who = c ? `<div class="ps-who"><img src="/images/cards/${c.card}" alt=""><b>${tr(c.name)}</b><span>${tr(c.job)}</span></div>` : '';
    return `<li class="ps-b${c ? ' client' : ''}${i === view ? ' cur' : ''}" data-i="${i}">${who}<p>${tr(s.say)}</p>${extra(n, i)}${i === view ? `<span class="ps-eye">👁 ${t('onEasel')}</span>` : ''}</li>`;
  };

  const mark = { wait: '⏳', ok: '✅', redo: '↩' };
  const path = () => `<ol class="ps-path">${LS.map((l, i) => {
    const n = i + 1, w = srv.works[n], open = isOpen(n);
    return `<li class="${open ? 'open' : 'lock'}${n === st.cur && mode === 'lesson' ? ' cur' : ''}${w ? ' ' + w.status : ''}" data-n="${n}" title="${open ? '' : esc(t('locked'))}"><span class="ps-dot">${w ? mark[w.status] : open ? l.icon : '🔒'}</span><small>${n}. ${tr(l.name)}</small></li>`;
  }).join('')}<li class="dip${stamps() >= N ? ' open' : ' lock'}${mode === 'dip' ? ' cur' : ''}" data-n="dip"><span class="ps-dot">📜</span><small>${t('diploma')}</small></li></ol>`;

  const lessonView = () => {
    const n = st.cur, S = stepsOf(n), p = ls(n);
    return `<div class="ps-class">
        <div class="ps-stage"><div class="ps-easel"><div class="ps-paperbox">${easelArt(n, view)}</div></div>${polly}<span class="ps-tag">${t('lesson')} ${n} · ${tr(LS[n - 1].name)}</span></div>
        <div class="ps-chat"><p class="ps-hint">${t('log')}</p><ol class="ps-log">${S.slice(0, p.step + 1).map((_, i) => bubble(n, i)).join('')}</ol>
          <div class="ps-bar"><button type="button" class="ps-again">${t('again')}</button>${p.step < S.length - 1 ? `<button type="button" class="ps-next"${blocked(n, p.step) ? ' disabled' : ''}>${t('next')}</button>` : ''}</div></div>
      </div>`;
  };

  // ---------- диплом: пиксельная картинка (canvas), скачать PNG ----------
  function diplomaCanvas() {
    const c = document.createElement('canvas'), W = 1200, H = 850, x = c.getContext('2d');
    c.width = W; c.height = H;
    x.imageSmoothingEnabled = false;
    x.fillStyle = '#2B1A51'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#FBF4E2'; x.fillRect(40, 40, W - 80, H - 80);
    // пиксельная рамка: клетки по краю
    const px = 20, cols = ['#D85A30', '#F0A987', '#E9A93B', '#7f81bf'];
    for (let i = 0; i * px < W - 80; i++) for (const y of [40, H - 60]) { x.fillStyle = cols[(i + (y > 100 ? 2 : 0)) % 4]; x.fillRect(40 + i * px, y, px, px); }
    for (let j = 0; j * px < H - 80; j++) for (const xx of [40, W - 60]) { x.fillStyle = cols[(j + (xx > 100 ? 1 : 3)) % 4]; x.fillRect(xx, 40 + j * px, px, px); }
    // Полли
    const s = 14;
    P.forEach((row, yy) => [...row].forEach((ch, xx) => { if (C[ch]) { x.fillStyle = C[ch]; x.fillRect(110 + xx * s, 430 + yy * s, s, s); } }));
    x.textAlign = 'center'; x.fillStyle = '#2B1A51';
    const serif = "600 {s}px Fraunces, Georgia, serif", sans = "{w} {s}px Karla, system-ui, sans-serif";
    const f = (tpl, sz, w = 400) => tpl.replace('{s}', sz).replace('{w}', w);
    x.font = f(serif, 92); x.fillText(t('dipTitle'), W / 2, 185);
    x.fillStyle = '#D85A30'; x.font = f(sans, 34, 700); x.fillText(t('dipSchool'), W / 2, 240);
    x.fillStyle = '#2B1A51'; x.font = f(serif, 64); x.fillText('@' + (srv.nick || '…'), W / 2, 345);
    x.font = f(sans, 28); x.fillStyle = '#5A4E78'; x.fillText(t('dipLine'), W / 2, 400);
    // 12 печатей
    LS.forEach((l, i) => {
      const cx = 400 + (i % 6) * 80, cy = 480 + Math.floor(i / 6) * 86;
      x.fillStyle = '#5FA35A'; x.fillRect(cx - 30, cy - 30, 60, 60);
      x.fillStyle = '#FBF4E2'; x.fillRect(cx - 24, cy - 24, 48, 48);
      x.fillStyle = '#5FA35A'; x.font = f(sans, 28, 700); x.fillText(l.icon, cx, cy + 10);
      x.fillStyle = '#5A4E78'; x.font = f(sans, 13, 700); x.fillText(String(i + 1), cx, cy + 46);
    });
    x.fillStyle = '#2B1A51'; x.font = 'italic ' + f(sans, 24); x.fillText(t('dipMotto'), W / 2, 700);
    const last = Math.max(...Object.values(srv.works).map(w => w.checked || 0));
    const date = new Date((last || Date.now() / 1000) * 1000).toLocaleDateString(['en-GB', 'ru-RU', 'lv-LV'][L], { day: 'numeric', month: 'long', year: 'numeric' });
    x.textAlign = 'left'; x.font = f(sans, 22); x.fillText(date, 110, 760);
    x.textAlign = 'right'; x.font = f(serif, 30); x.fillText(t('dipSign') + ' 🕊', W - 110, 760);
    return c;
  }
  const diplomaView = () => {
    const k = stamps();
    if (k < N) return `<div class="ps-dipwait"><p>${t('dipWait')} <b>${k} / ${N}</b></p><button type="button" class="ps-back">${t('back')}</button></div>`;
    return `<div class="ps-dip"><p class="ps-dip-hi">${t('dipCongrats')}${srv.btn ? ` <span class="ps-dip-btn">+${srv.btn} 🔘</span>` : ''}</p><div class="ps-dip-pic"></div><div class="ps-dip-act"><button type="button" class="ps-dl">${t('dipSave')}</button><a class="ps-dl ps-dl2" href="${['', '/ru', '/lv'][L]}/challenge/">${t('toChallenge')}</a><button type="button" class="ps-back">${t('back')}</button></div></div>`;
  };

  const render = () => {
    box.innerHTML = `<div class="ps-head"><h1>${t('title')}</h1><p>${t('lead')}</p><p class="ps-free">${t('free')}</p></div>
      <h3 class="ps-h3">${t('path')}</h3>${path()}${mode === 'lesson' && srv.works[st.cur] && srv.works[st.cur].status !== 'wait' ? verdict(st.cur) : ''}
      ${mode === 'dip' ? diplomaView() : lessonView()}
      <a class="ps-book" href="${['', '/ru', '/lv'][L]}/e-books/"><img src="${IMG}book-cover.jpg" alt=""><span>${t('book')} <b>Watercolor Sketches: Creative Guide</b><em>${t('bookGo')}</em></span></a>`;
    const pic = box.querySelector('.ps-dip-pic');
    if (pic) { const c = diplomaCanvas(); c.className = 'ps-dip-canvas'; pic.append(c); }
  };
  const openLesson = n => { st.cur = n; mode = 'lesson'; view = Math.min(ls(n).step, stepsOf(n).length - 1); save(); render(); box.querySelector('.ps-class').scrollIntoView({ block: 'start', behavior: 'smooth' }); };

  box.addEventListener('click', e => {
    const el = e.target, n = st.cur;
    const li = el.closest('.ps-path li');
    if (li) {
      if (li.dataset.n === 'dip') { mode = 'dip'; render(); return; }
      const k = +li.dataset.n; if (isOpen(k)) openLesson(k); return;
    }
    const go = el.closest('[data-go]');
    if (go) { openLesson(+go.dataset.go); return; }
    if (el.closest('.ps-back')) { mode = 'lesson'; render(); return; }
    if (el.closest('.ps-dl') && el.closest('button')) { const c = box.querySelector('.ps-dip-canvas'); c && c.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'polly-school-diploma.png'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }, 'image/png'); return; }
    if (mode !== 'lesson') return;
    const p = ls(n);
    const toEasel = () => innerWidth <= 820 && box.querySelector('.ps-stage').scrollIntoView({ block: 'start', behavior: 'smooth' }); // телефон: мольберт выше ленты
    if (el.closest('.ps-next')) { p.step++; view = p.step; save(); render(); if (stepsOf(n)[view].find) toEasel(); else { const nb = box.querySelector('.ps-log > li:last-child'); nb && nb.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } return; }
    if (el.closest('.ps-again')) { st.l[n] = { step: 0, quiz: {}, find: {}, paper: [] }; view = 0; save(); render(); return; }
    const q = el.closest('[data-q]');
    if (q) { p.quiz[q.closest('.ps-b').dataset.i] = +q.dataset.q; save(); render(); return; }
    const g = el.closest('.ps-find g[data-k]');
    if (g && stepsOf(n)[view].find) { const a = p.find[view] = p.find[view] || []; if (!a.includes(g.dataset.k)) a.push(g.dataset.k); save(); render(); return; }
    if (el.closest('.ps-login')) { window.PPAccount && window.PPAccount.openSignIn(); return; }
    if (el.closest('.ps-send')) { send(el.closest('.ps-hand')); return; }
    if (el.closest('input, textarea, label, form')) return;
    const b = el.closest('.ps-b');
    if (b) { view = +b.dataset.i; render(); toEasel(); }
  });
  box.addEventListener('change', e => {
    const n = st.cur, p = ls(n);
    const c = e.target.closest('[data-p]');
    if (c) { const k = +c.dataset.p; p.paper = c.checked ? [...new Set([...p.paper, k])] : p.paper.filter(x => x !== k); save(); const nb = box.querySelector('.ps-next'); nb && (nb.disabled = blocked(n, p.step)); return; }
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
      fd.append('lesson', st.cur); fd.append('note', form.querySelector('textarea').value);
      fd.append('full', await jpeg(bmp, 1600, 0.85), 'full.jpg'); fd.append('thumb', await jpeg(bmp, 480, 0.8), 'thumb.jpg');
      const r = await fetch('/api/school/hand', { method: 'POST', credentials: 'same-origin', body: fd });
      if (!r.ok) throw new Error(r.status);
      picked = null; await loadSrv();
    } catch (e) { btn.disabled = false; msg.textContent = t('fail'); }
  }
  render();
  loadSrv();
  if (location.hash === '#school') setTimeout(() => box.scrollIntoView(), 80);
  if (location.hash === '#diploma') { mode = 'dip'; }
})();
