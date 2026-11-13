// «Школа Полли» (/polly-helps/, docs/challenge.md): Полли в фартуке у мольберта учит рисовать на бумаге.
// Тропинка из 12 уроков по книге Алины «Watercolor Sketches: Creative Guide» → пиксельный диплом. Уроки — site/assets/school-lessons.js.
// Урок = реплики Полли (остаются в ленте, по старой можно вернуть картинку на мольберт), мини-игры, задание на бумаге, клиент из Воббленда.
// Шаги уроков — в браузере (pp-school); сдача фото — worker/school.js. Проверяет Алина в кабинете «🎓 Школа», но ученику это — печать и записка от Полли.
// Урок открыт, если предыдущий сдан или пройден до клиента. Диплом — когда у всех 12 уроков печать.
(() => {
  const box = document.getElementById('ps-school');
  const LS = window.PP_SCHOOL_LESSONS;
  if (!box || !LS || !window.PPDiploma) return;
  const L = { en: 0, ru: 1, lv: 2 }[document.documentElement.lang] ?? 0;
  const tr = a => a[L];
  const IMG = '/images/school/';
  const KEY = 'pp-school';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const N = LS.length;

  const T = {
    title: ['See the World Like an Artist', 'Смотри на мир как художник', 'Skaties uz pasauli kā mākslinieks'],
    lead: ['Pen, paper and twelve small lessons. Every lesson ends with a real client from Wobbleland, and after twelve stamps you get a pixel diploma and buttons.', 'Ручка, бумага и двенадцать маленьких уроков. В конце каждого приходит настоящий клиент из Воббленда, а за двенадцать печатей — пиксельный диплом и пуговки.', 'Pildspalva, papīrs un divpadsmit mazas nodarbības. Katras beigās ierodas īsts klients no Vobllendas, bet par divpadsmit zīmogiem — pikseļu diploms un pogas.'],
    free: ['The daily challenge is open to everyone — the course is just for courage.', 'Челлендж открыт всем — курс просто для смелости.', 'Izaicinājums ir atvērts visiem — kurss ir tikai drosmei.'],
    freeDip: ['The diploma is just for fun, not an official qualification.', 'Диплом — для радости, а не официальная квалификация.', 'Diploms ir priekam, nevis oficiāla kvalifikācija.'],
    dipNote: ['This is a friendly hobby course. The diploma is a keepsake for fun: it is not an official document, gives no academic credits or qualifications and is not recognised by any educational institution.', 'Это дружеский курс для хобби. Диплом — памятная картинка для радости: это не официальный документ, он не даёт кредитных пунктов и квалификации и не признаётся учебными заведениями.', 'Šis ir draudzīgs hobija kurss. Diploms ir piemiņas attēls priekam: tas nav oficiāls dokuments, nedod kredītpunktus vai kvalifikāciju, un to neatzīst izglītības iestādes.'],
    dipFine: ['A keepsake for fun — not an official document, no academic credits or qualification.', 'Памятный диплом для радости — не официальный документ, не даёт кредитных пунктов и квалификации.', 'Piemiņas diploms priekam — nav oficiāls dokuments, nedod kredītpunktus un kvalifikāciju.'],
    path: ['Student path', 'Тропинка ученика', 'Skolēna taka'],
    lesson: ['Lesson', 'Урок', 'Nodarbība'],
    diploma: ['Diploma', 'Диплом', 'Diploms'],
    locked: ['Opens after the previous lesson', 'Откроется после предыдущего урока', 'Atvērsies pēc iepriekšējās nodarbības'],
    next: ['Next →', 'Дальше →', 'Tālāk →'],
    again: ['↺ From the start', '↺ Сначала', '↺ No sākuma'],
    log: ['Tap a line to put its picture back on the easel.', 'Нажми на реплику — её картинка вернётся на мольберт.', 'Pieskaries replikai — tās attēls atgriezīsies uz molberta.'],
    more: ['What Polly said before', 'Что Полли говорила раньше', 'Ko Pollija teica iepriekš'],
    fold: ['Put back in the stack', 'Сложить в стопочку', 'Salikt kaudzītē'],
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
    dipSchool: ['See the World Like an Artist', 'Смотри на мир как художник', 'Skaties uz pasauli kā mākslinieks'],
    dipLine: ['12 lessons · 12 stamps · drawing on paper', '12 уроков · 12 печатей · рисунок на бумаге', '12 nodarbības · 12 zīmogi · zīmējums uz papīra'],
    dipMotto: ['Shapes first, details later — and never be afraid of a crooked line!', 'Сначала фигуры, потом детали — и никогда не бойся кривой линии!', 'Vispirms figūras, tad detaļas — un nekad nebaidies no šķības līnijas!'],
    dipSign: ['Teacher Polly', 'Учитель Полли', 'Skolotāja Pollija'],
    dipTo: ['is awarded to', 'вручается', 'tiek pasniegts'],
    dipDate: ['date', 'дата', 'datums'],
    dipCongrats: ['Congratulations! All twelve stamps are in. Here is your diploma — and the daily challenge is waiting for your drawings.', 'Поздравляю! Все двенадцать печатей стоят. Вот твой диплом — а челлендж ждёт твоих рисунков.', 'Apsveicu! Visi divpadsmit zīmogi ir uzlikti. Lūk, tavs diploms — un izaicinājums gaida tavus zīmējumus.'],
    dipSave: ['⬇ Save the diploma', '⬇ Скачать диплом', '⬇ Lejupielādēt diplomu'],
    toChallenge: ['✏️ To the challenge', '✏️ В челлендж', '✏️ Uz izaicinājumu'],
    back: ['← Back to the lesson', '← Назад к уроку', '← Atpakaļ uz nodarbību'],
  };
  const t = k => tr(T[k]);

  // Полли в фартуке и берете (пиксели 14×15) — общая с дипломом, site/assets/diploma.js
  const polly = window.PPDiploma.svg('ps-polly');

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
  // следующий урок — только после «Сдать Полли»; пока сервер не ответил, верим своему прогрессу
  const isOpen = n => n === 1 || !!srv.works[n - 1] || (srv.me === null && finished(n - 1));
  const stamps = () => Object.values(srv.works).filter(w => w.status === 'ok').length;
  if (!(st.cur >= 1 && st.cur <= N) || !isOpen(st.cur)) st.cur = 1;
  let hist = false; // стопочка старых реплик раскрыта
  let mode = 'lesson', view = Math.min(ls(st.cur).step, stepsOf(st.cur).length - 1);

  const loadSrv = () => fetch('/api/school?lang=' + ['en', 'ru', 'lv'][L], { credentials: 'same-origin' }).then(r => r.json()).then(d => {
    srv.me = !!d.me; srv.nick = d.nick || ''; srv.btn = d.diplomaBtn || 0; srv.works = {}; for (const w of d.works || []) srv.works[w.lesson] = w;
    fixCur(); render();
  }).catch(() => { srv.me = false; fixCur(); render(); });
  const fixCur = () => { if (isOpen(st.cur)) return; while (!isOpen(st.cur)) st.cur--; mode = 'lesson'; view = Math.min(ls(st.cur).step, stepsOf(st.cur).length - 1); save(); };
  // фото → полная (1600) и превью (480) JPEG, как в челлендже
  const jpeg = (bmp, max, q) => { const k = Math.min(1, max / Math.max(bmp.width, bmp.height)), c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k); c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height); return new Promise(r => c.toBlob(r, 'image/jpeg', q)); };
  let picked = null;
  const verdict = n => {
    const w = srv.works[n];
    if (!w) return '';
    const c = w.comment ? `<p class="ps-note"><b>${t('polly')}:</b> ${esc(w.comment)}</p>` : '';
    return `<div class="ps-verdict ${w.status}">${w.img ? `<img src="/api/img/${w.img}?t=1" alt="">` : ''}<div><p>${t(w.status)}</p>${c}</div></div>`;
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
    if (s.client) return !srv.works[n];
    return false;
  };
  const pickedOf = n => { const ps = LS[n - 1].steps.find(x => x.paper); return ps ? ps.paper.opts.filter((_, k) => ls(n).paper.includes(k)).map(tr) : []; };
  const extra = (n, i) => {
    const s = stepsOf(n)[i], p = ls(n);
    if (s.quiz) {
      const a = p.quiz[i];
      if (a == null) return `<div class="ps-quiz">${s.quiz.opts.map(([q], k) => `<button type="button" data-q="${k}">${tr(q)}</button>`).join('')}</div>`;
      return `<p class="ps-ans${s.quiz.opts[a][1] ? ' ok' : ''}">${tr(s.quiz.opts[a][0])} — ${tr(s.quiz.opts[a][1] ? s.quiz.yes : s.quiz.no)}</p>`;
    }
    if (s.find) { const got = p.find[i] || []; return `<p class="ps-ans${got.length >= s.find.parts.length ? ' ok' : ''}">${t('found')}: ${got.length} / ${s.find.parts.length}${got.length ? ' · ' + got.map(k => tr(s.find.parts.find(x => x[0] === k)[2])).join(', ') : ''}</p>`; }
    if (s.paper) return `<div class="ps-paper${p.paper.length >= s.paper.min ? ' ok' : ''}">${s.paper.opts.map((o, k) => `<label><input type="checkbox" data-p="${k}"${p.paper.includes(k) ? ' checked' : ''}> ${tr(o)}</label>`).join('')}</div>`;
    if (s.client) {
      const pk = esc(pickedOf(n).join(', ') || '—');
      const task = `<div class="ps-task"><b>${t('task')}</b><ol>${s.client.task.map(x => `<li>${esc(tr(x)).replace('{picked}', `<b>${pk}</b>`)}</li>`).join('')}</ol></div>`;
      if (srv.me === null) return task;
      if (!srv.me) return task + `<div class="ps-hand"><button type="button" class="ps-file ps-login">${t('signin')}</button><p class="ps-states">${t('signNote')}</p></div>`;
      const w = srv.works[n];
      if (w && w.status === 'ok') return `<p class="ps-ans ok">${t('ok')}</p>`;
      return `${task}${w && w.status === 'wait' ? verdict(n) : ''}<form class="ps-hand" onsubmit="return false"><label class="ps-file">${w && w.status === 'wait' ? t('swap') : t('upload')}<input type="file" accept="image/*" hidden></label><img class="ps-prev" alt="" hidden><textarea rows="2" placeholder="${esc(t('note'))}"></textarea><button type="button" class="ps-send">${w && w.status === 'redo' ? t('again2') : t('send')}</button><p class="ps-proto" role="status"></p></form>`;
    }
    if (s.end && n < N && isOpen(n + 1)) return `<div class="ps-quiz"><button type="button" data-go="${n + 1}">${t('goNext')} ${n + 1} →</button></div>`;
    return '';
  };
  const bubble = (n, i) => {
    const s = stepsOf(n)[i], c = s.client;
    const who = c ? `<div class="ps-who"><i style="background-image:url(/images/cards/${c.card})"></i><b>${tr(c.name)}</b><span>${tr(c.job)}</span></div>` : '';
    return `<li class="ps-b${c ? ' client' : ''}${i === view ? ' cur' : ''}" data-i="${i}">${who}<p>${tr(s.say)}</p>${extra(n, i)}${i === view && i < ls(n).step ? `<span class="ps-eye">👁 ${t('onEasel')}</span>` : ''}</li>`;
  };

  const mark = { wait: '⏳', ok: '✓', redo: '↩' }; // кружки тропинки: пустые, пройденный — акцентный с белой галочкой
  const path = () => `<ol class="ps-path">${LS.map((l, i) => {
    const n = i + 1, w = srv.works[n], open = isOpen(n);
    return `<li class="${open ? 'open' : 'lock'}${n === st.cur && mode === 'lesson' ? ' cur' : ''}${w ? ' ' + w.status : ''}" data-n="${n}" title="${open ? '' : esc(t('locked'))}"><span class="ps-dot">${w ? mark[w.status] : ''}</span><small>${n}. ${tr(l.name)}</small></li>`;
  }).join('')}<li class="dip${stamps() >= N ? ' open' : ' lock'}${mode === 'dip' ? ' cur' : ''}" data-n="dip"><span class="ps-dot">📜</span><small>${t('diploma')}</small></li></ol>`;

  // урок: слева мольберт, справа только текущая реплика; прежние — в стопочке, раскрываются по кнопке
  const lessonView = () => {
    const n = st.cur, S = stepsOf(n), p = ls(n), old = p.step;
    const stack = old ? `<button type="button" class="ps-stack${hist ? ' open' : ''}" aria-expanded="${hist}"><b>${old}</b><span>${hist ? t('fold') : t('more')}</span><i>${hist ? '▾' : '▴'}</i></button>` : '';
    const oldLog = hist && old ? `<p class="ps-hint">${t('log')}</p><ol class="ps-log ps-old">${S.slice(0, old).map((_, i) => bubble(n, i)).join('')}</ol>` : '';
    return `<div class="ps-class${hist && old ? ' hist' : ''}">
        <div class="ps-stage"><div class="ps-paperbox">${easelArt(n, view)}</div></div>
        <div class="ps-chat"><div class="ps-lhead"><span class="ps-tag">${t('lesson')} ${n}</span><h2>${LS[n - 1].icon} ${tr(LS[n - 1].name)}</h2><i class="ps-prog"><b style="width:${Math.round((old + 1) / S.length * 100)}%"></b></i></div>${stack}${oldLog}<ol class="ps-log ps-now">${bubble(n, old)}</ol>
          <div class="ps-bar">${polly}<button type="button" class="ps-again">${t('again')}</button>${p.step < S.length - 1 ? `<button type="button" class="ps-next"${blocked(n, p.step) ? ' disabled' : ''}>${t('next')}</button>` : ''}</div></div>
      </div>`;
  };
  // окно урока целиком на экране: если верх ушёл за край или окно далеко внизу — подвинуть
  const fit = () => { const c = box.querySelector('.ps-class'); if (!c) return; const r = c.getBoundingClientRect(); if (r.top < 0 || r.top > innerHeight * .35) c.scrollIntoView({ block: 'start', behavior: 'smooth' }); };

  // ---------- диплом: пиксельная картинка (canvas, site/assets/diploma.js), скачать PNG ----------
  const dipOpts = () => ({ L, school: t('dipSchool'), title: t('dipTitle'), to: t('dipTo'), line: t('dipLine'), motto: t('dipMotto'), sign: t('dipSign'), date: t('dipDate'), fine: t('dipFine'), nick: srv.nick, icons: LS.map(l => l.icon), last: Math.max(...Object.values(srv.works).map(w => w.checked || 0)) });
  const diplomaView = () => {
    const k = stamps();
    if (k < N) return `<div class="ps-dipwait"><p>${t('dipWait')} <b>${k} / ${N}</b></p><button type="button" class="ps-back">${t('back')}</button></div>`;
    return `<div class="ps-dip"><p class="ps-dip-hi">${t('dipCongrats')}${srv.btn ? ` <span class="ps-dip-btn">+${srv.btn} 🔘</span>` : ''}</p><div class="ps-dip-pic"></div><div class="ps-dip-act"><button type="button" class="ps-dl">${t('dipSave')}</button><a class="ps-dl ps-dl2" href="${['', '/ru', '/lv'][L]}/challenge/">${t('toChallenge')}</a><button type="button" class="ps-back">${t('back')}</button></div><p class="ps-dip-note">${t('dipNote')}</p></div>`;
  };

  const render = () => {
    box.innerHTML = `<div class="ps-head"><h1>${t('title')}</h1><p>${t('lead')}</p><p class="ps-free">${t('free')} ${t('freeDip')}</p></div>
      <h3 class="ps-h3">${t('path')}</h3>${path()}${mode === 'lesson' && srv.works[st.cur] && srv.works[st.cur].status === 'redo' ? verdict(st.cur) : ''}
      ${mode === 'dip' ? diplomaView() : lessonView()}
      <a class="ps-book" href="${['', '/ru', '/lv'][L]}/e-books/"><img src="${IMG}book-cover.jpg" alt=""><span>${t('book')} <b>Watercolor Sketches: Creative Guide</b><em>${t('bookGo')}</em></span></a>`;
    const pic = box.querySelector('.ps-dip-pic');
    if (pic) window.PPDiploma.mount(pic, dipOpts()); // шрифты сайта могут догрузиться позже — mount перерисует
  };
  const openLesson = n => { st.cur = n; mode = 'lesson'; hist = false; view = Math.min(ls(n).step, stepsOf(n).length - 1); save(); render(); fit(); };

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
    if (el.closest('.ps-dl') && el.closest('button')) { window.PPDiploma.save(box.querySelector('.ps-dip-canvas'), 'polly-school-diploma.png'); return; }
    if (mode !== 'lesson') return;
    const p = ls(n);
    const toEasel = () => innerWidth <= 820 && box.querySelector('.ps-stage').scrollIntoView({ block: 'start', behavior: 'smooth' }); // телефон: мольберт выше ленты
    if (el.closest('.ps-next')) { p.step++; view = p.step; hist = false; save(); render(); fit(); return; }
    if (el.closest('.ps-again')) { st.l[n] = { step: 0, quiz: {}, find: {}, paper: [] }; view = 0; hist = false; save(); render(); return; }
    if (el.closest('.ps-stack')) { hist = !hist; if (!hist) view = p.step; render(); if (hist) { const o = box.querySelector('.ps-old'); o && (o.scrollTop = o.scrollHeight); } return; }
    const q = el.closest('[data-q]');
    if (q) { p.quiz[q.closest('.ps-b').dataset.i] = +q.dataset.q; save(); render(); return; }
    const g = el.closest('.ps-find g[data-k]');
    if (g && stepsOf(n)[view].find) { const a = p.find[view] = p.find[view] || []; if (!a.includes(g.dataset.k)) a.push(g.dataset.k); save(); render(); return; }
    if (el.closest('.ps-login')) { window.PPAccount && window.PPAccount.openSignIn(); return; }
    if (el.closest('.ps-send')) { send(el.closest('.ps-hand')); return; }
    if (el.closest('input, textarea, label, form')) return;
    const b = el.closest('.ps-b');
    if (b) { const o = box.querySelector('.ps-old'), y = o ? o.scrollTop : 0; view = +b.dataset.i; render(); const o2 = box.querySelector('.ps-old'); o2 && (o2.scrollTop = y); toEasel(); }
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
