// Курс «Тушь: скетчинг без страха» (/ink/, docs/ink.md) — по книге Алины «Ink Sketching: Creative Guide».
// Для своих: уроки отдаёт сервер только вошедшим (GET /api/school/lessons?course=ink&lang=); гостю — обложка курса, план и «Войти».
// Урок как в учебниках (норвежский): цели → теория с картинками из книги → «Коротко» → частые ошибки → словарик → факт →
// «Проверь себя» (≥ 80 % — открывается практика) → практика из книги + заказ жителя Воббленда → фото страницы «Сдать Полли».
// Следующий урок — после сдачи; Алина в кабинете «🎓 Школа» ставит печать или «на доработку» (worker/school.js, course 'ink').
// Печать у всех уроков — диплом (site/assets/diploma.js). Прогресс тестов — localStorage pp-ink.
(() => {
  const box = document.getElementById('ink-course');
  if (!box || !window.PPDiploma) return;
  const L = { en: 0, ru: 1, lv: 2 }[document.documentElement.lang] ?? 0, LG = ['en', 'ru', 'lv'][L];
  const pre = ['', '/ru', '/lv'][L];
  const KEY = 'pp-ink', COURSE = 'ink', N = 15, PASS = 0.8;
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // план курса (виден и гостям): названия уроков = name в worker/ink/lNN.js
  const PLAN = [
    ['Blank page fear', 'Страх чистого листа', 'Tukšas lapas bailes'], ['A sketch, not a drawing', 'Скетч, а не рисунок', 'Skice, nevis zīmējums'],
    ['Paper, ink and pens', 'Бумага, тушь, перья', 'Papīrs, tuša, spalvas'], ['The line', 'Линия', 'Līnija'], ['Hatching', 'Штриховка', 'Svītrojums'],
    ['Negative space', 'Негативное пространство', 'Negatīvā telpa'], ['Light and shadow', 'Свет и тень', 'Gaisma un ēna'], ['Water and mistakes', 'Вода и ошибки', 'Ūdens un kļūdas'],
    ['Textures', 'Текстуры', 'Tekstūras'], ['From cups to chairs', 'От чашек до стульев', 'No krūzēm līdz krēsliem'], ['Botanical sketching', 'Ботаника', 'Botānika'],
    ['Food and composition', 'Еда и композиция', 'Ēdiens un kompozīcija'], ['The city', 'Город', 'Pilsēta'], ['Quick sketches and living things', 'Быстрые наброски и живые', 'Ātras skices un dzīvās būtnes'],
    ['Mixed media', 'Смешанные техники', 'Jauktās tehnikas']];
  const T = {
    title: ['Ink: Sketching Without Fear', 'Тушь: скетчинг без страха', 'Tuša: skicēšana bez bailēm'],
    lead: ['A full course from Alina’s book “Ink Sketching: Creative Guide”: fifteen lessons with theory, pictures from the book, a quick test and a real task on paper. Polly looks at every page and puts her stamp — and at the end there is a diploma.', 'Полноценный курс по книге Алины «Ink Sketching: Creative Guide»: пятнадцать уроков с теорией, рисунками из книги, коротким тестом и настоящим заданием на бумаге. Полли смотрит каждую страницу и ставит печать — а в конце ждёт диплом.', 'Pilns kurss pēc Alīnas grāmatas «Ink Sketching: Creative Guide»: piecpadsmit nodarbības ar teoriju, zīmējumiem no grāmatas, īsu testu un īstu uzdevumu uz papīra. Pollija apskata katru lapu un uzliek zīmogu — bet beigās gaida diploms.'],
    members: ['For our flock: open to everyone who signs in.', 'Для своих: открыт всем, кто вошёл на сайт.', 'Saviem: atvērts visiem, kas ienākuši vietnē.'],
    how: ['How a lesson works', 'Как устроен урок', 'Kā notiek nodarbība'],
    howList: [['Theory with pictures from the book', 'A short test — 80 % opens the task', 'A task on paper and an order from Wobbleland', 'A photo of your page — Polly answers with a stamp or a note'], ['Теория с рисунками из книги', 'Короткий тест — 80 % открывают задание', 'Задание на бумаге и заказ из Воббленда', 'Фото страницы — Полли ответит печатью или запиской'], ['Teorija ar zīmējumiem no grāmatas', 'Īss tests — 80 % atver uzdevumu', 'Uzdevums uz papīra un pasūtījums no Vobllendas', 'Lapas foto — Pollija atbildēs ar zīmogu vai zīmīti']],
    plan: ['Course plan', 'План курса', 'Kursa plāns'],
    signin: ['Sign in to start', 'Войти и начать', 'Ienākt un sākt'],
    loading: ['Opening the course…', 'Открываю курс…', 'Atveru kursu…'],
    lesson: ['Lesson', 'Урок', 'Nodarbība'], of: ['of', 'из', 'no'],
    soon: ['soon', 'скоро', 'drīzumā'],
    soonT: ['This lesson is still being written. It will appear here soon.', 'Этот урок ещё пишется — скоро появится здесь.', 'Šī nodarbība vēl tiek rakstīta — drīz parādīsies šeit.'],
    locked: ['Opens after you hand in the previous lesson', 'Откроется, когда сдашь предыдущий урок', 'Atvērsies, kad iesniegsi iepriekšējo nodarbību'],
    diploma: ['Diploma', 'Диплом', 'Diploms'],
    goals: ['In this lesson', 'В этом уроке', 'Šajā nodarbībā'],
    theory: ['Theory', 'Теория', 'Teorija'],
    simple: ['In short', 'Коротко', 'Īsumā'],
    mist: ['Common mistakes', 'Частые ошибки', 'Biežākās kļūdas'],
    terms: ['Artist’s glossary', 'Словарик художника', 'Mākslinieka vārdnīca'],
    fact: ['Did you know?', 'А знаешь что?', 'Vai zināji?'],
    test: ['Check yourself', 'Проверь себя', 'Pārbaudi sevi'],
    testNote: ['80 % of right answers opens the task. You can try as many times as you like.', '80 % верных ответов открывают задание. Пробовать можно сколько угодно раз.', '80 % pareizu atbilžu atver uzdevumu. Mēģināt var cik vien gribi.'],
    check: ['Check', 'Проверить', 'Pārbaudīt'],
    retry: ['↺ Try again', '↺ Ещё раз', '↺ Vēlreiz'],
    score: ['Right answers', 'Верных ответов', 'Pareizas atbildes'],
    passed: ['Well done! The task is open.', 'Отлично! Задание открыто.', 'Lieliski! Uzdevums ir atvērts.'],
    failed: ['Almost! Reread the theory and try again — 80 % is needed.', 'Почти! Перечитай теорию и попробуй ещё раз — нужно 80 %.', 'Gandrīz! Pārlasi teoriju un mēģini vēlreiz — vajag 80 %.'],
    answerAll: ['Answer every question first.', 'Сначала ответь на все вопросы.', 'Vispirms atbildi uz visiem jautājumiem.'],
    practice: ['Practice', 'Практика', 'Prakse'],
    practiceLock: ['🔒 The task opens after the test (80 %).', '🔒 Задание откроется после теста (80 %).', '🔒 Uzdevums atvērsies pēc testa (80 %).'],
    need: ['You will need', 'Понадобится', 'Būs vajadzīgs'],
    time: ['Time', 'Время', 'Laiks'],
    order: ['📋 The order', '📋 Заказ', '📋 Pasūtījums'],
    upload: ['📷 Photo of your page', '📷 Фото твоей страницы', '📷 Tavas lapas foto'],
    note: ['A note for Polly (optional)', 'Записка Полли (можно пусто)', 'Zīmīte Pollijai (var tukšu)'],
    send: ['Hand in to Polly', 'Сдать Полли', 'Iesniegt Pollijai'],
    sending: ['Sending…', 'Отправляю…', 'Sūtu…'],
    noPic: ['First add a photo of your page.', 'Сначала добавь фото страницы.', 'Vispirms pievieno lapas foto.'],
    fail: ['Could not send — try again in a minute.', 'Не получилось отправить — попробуй через минуту.', 'Neizdevās nosūtīt — mēģini pēc minūtes.'],
    wait: ['⏳ Your page is with Polly. You can still swap the photo. The next lesson is already open.', '⏳ Страница у Полли. Фото пока можно заменить. Следующий урок уже открыт.', '⏳ Lapa ir pie Pollijas. Foto vēl var nomainīt. Nākamā nodarbība jau ir atvērta.'],
    swap: ['📷 Swap the photo', '📷 Заменить фото', '📷 Nomainīt foto'],
    ok: ['✅ Stamp from Polly! Lesson done.', '✅ Печать от Полли! Урок пройден.', '✅ Zīmogs no Pollijas! Nodarbība pabeigta.'],
    redo: ['↩ Polly asks to try once more', '↩ Полли просит попробовать ещё раз', '↩ Pollija lūdz pamēģināt vēlreiz'],
    again: ['Hand in again', 'Сдать заново', 'Iesniegt vēlreiz'],
    polly: ['Polly', 'Полли', 'Pollija'],
    prev: ['← Lesson', '← Урок', '← Nodarbība'], next: ['Lesson', 'Урок', 'Nodarbība'],
    book: ['The course follows Alina’s book', 'Курс идёт по книге Алины', 'Kurss seko Alīnas grāmatai'],
    bookGo: ['The full book with all exercises →', 'Вся книга со всеми упражнениями →', 'Visa grāmata ar visiem vingrinājumiem →'],
    dipWait: ['The diploma opens when every lesson has a stamp. Stamps so far:', 'Диплом откроется, когда у каждого урока будет печать. Печатей сейчас:', 'Diploms atvērsies, kad katrai nodarbībai būs zīmogs. Zīmogu pagaidām:'],
    dipCongrats: ['Congratulations! Every lesson has a stamp. Here is your ink diploma — and the daily challenge is waiting for your sketches.', 'Поздравляю! У каждого урока стоит печать. Вот твой диплом по туши — а челлендж ждёт твоих скетчей.', 'Apsveicu! Katrai nodarbībai ir zīmogs. Lūk, tavs tušas diploms — un izaicinājums gaida tavas skices.'],
    dipSave: ['⬇ Save the diploma', '⬇ Скачать диплом', '⬇ Lejupielādēt diplomu'],
    toChallenge: ['✏️ To the challenge', '✏️ В челлендж', '✏️ Uz izaicinājumu'],
    back: ['← Back to the lesson', '← Назад к уроку', '← Atpakaļ uz nodarbību'],
    dipTitle: ['DIPLOMA', 'ДИПЛОМ', 'DIPLOMS'],
    dipLine: ['15 lessons · 15 stamps · ink on paper', '15 уроков · 15 печатей · тушь на бумаге', '15 nodarbības · 15 zīmogi · tuša uz papīra'],
    dipMotto: ['The greatest sketchbook in the world is the one that is filled.', 'Лучший скетчбук на свете — тот, что заполнен.', 'Labākā skiču grāmata pasaulē ir tā, kas ir piepildīta.'],
    dipSign: ['Teacher Polly', 'Учитель Полли', 'Skolotāja Pollija'], dipTo: ['is awarded to', 'вручается', 'tiek pasniegts'], dipDate: ['date', 'дата', 'datums'],
    dipFine: ['A keepsake for fun — not an official document, no academic credits or qualification.', 'Памятный диплом для радости — не официальный документ, не даёт кредитных пунктов и квалификации.', 'Piemiņas diploms priekam — nav oficiāls dokuments, nedod kredītpunktus un kvalifikāciju.'],
    dipNote: ['This is a friendly hobby course. The diploma is a keepsake for fun: it is not an official document, gives no academic credits or qualifications and is not recognised by any educational institution.', 'Это дружеский курс для хобби. Диплом — памятная картинка для радости: это не официальный документ, он не даёт кредитных пунктов и квалификации и не признаётся учебными заведениями.', 'Šis ir draudzīgs hobija kurss. Diploms ir piemiņas attēls priekam: tas nav oficiāls dokuments, nedod kredītpunktus vai kvalifikāciju, un to neatzīst izglītības iestādes.'],
  };
  const t = k => T[k][L];
  const ICONS = ['✺', '✎', '✒', '〰', '▤', '◫', '◐', '💧', '▦', '☕', '❦', '🍞', '⌂', '🐦', '✚']; // печати на дипломе
  const polly = window.PPDiploma.svg('ik-polly');

  // прогресс тестов: { cur, t: { [урок]: лучший % } }
  let st; try { st = JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { st = null; }
  if (!st || typeof st !== 'object') st = { cur: 1, t: {} };
  st.t = st.t || {};
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* без памяти — тоже работает */ } };
  const srv = { me: null, nick: '', works: {}, btn: 0 };
  let LS = []; // уроки с сервера (на языке страницы)
  let mode = 'lesson', picked = null, answers = {};
  const has = n => n <= LS.length; // урок уже написан
  const isOpen = n => n === 1 || !!srv.works[n - 1] || !!srv.admin; // админу открыто всё
  const stamps = () => Object.values(srv.works).filter(w => w.status === 'ok').length;
  const passed = n => (st.t[n] || 0) >= PASS * 100 || !!srv.works[n] || !!srv.admin; // сдал работу — тест уже не нужен

  // ---------- гость: обложка курса и план ----------
  const guest = () => {
    box.innerHTML = `<div class="ik-hero"><div><p class="ik-k">🖋 ${t('members')}</p><h1>${t('title')}</h1><p class="ik-lead">${t('lead')}</p>
      <button type="button" class="ik-btn ik-login">${t('signin')}</button></div><img src="/images/ink/p01-0.jpg" alt=""></div>
      <div class="ik-cols"><section class="ik-sheet"><h3>${t('how')}</h3><ol class="ik-how">${T.howList[L].map(x => `<li>${x}</li>`).join('')}</ol></section>
      <section class="ik-sheet"><h3>${t('plan')}</h3><ol class="ik-plan">${PLAN.map(p => `<li>${esc(p[L])}</li>`).join('')}</ol></section></div>${bookLink()}`;
  };
  const bookLink = () => `<a class="ik-book" href="${pre}/books/"><img src="/images/ink/p01-0.jpg" alt=""><span>${t('book')} <b>Ink Sketching: Creative Guide</b><em>${t('bookGo')}</em></span></a>`;

  // ---------- тропинка ----------
  const mark = { wait: '⏳', ok: '✓', redo: '↩' };
  const path = () => `<ol class="ik-path">${PLAN.map((p, i) => {
    const n = i + 1, w = srv.works[n], open = isOpen(n) && has(n);
    return `<li class="${open ? 'open' : 'lock'}${n === st.cur && mode === 'lesson' ? ' cur' : ''}${w ? ' ' + w.status : ''}" data-n="${n}" title="${esc(p[L])}${open ? '' : ' — ' + (has(n) ? t('locked') : t('soon'))}"><span class="ik-dot">${w ? mark[w.status] : n}</span></li>`;
  }).join('')}<li class="dip${stamps() >= N ? ' open' : ' lock'}${mode === 'dip' ? ' cur' : ''}" data-n="dip" title="${t('diploma')}"><span class="ik-dot">📜</span></li></ol>`;

  // ---------- урок ----------
  const testView = (n, l) => {
    const sc = st.t[n], done = passed(n);
    const qs = l.test.map((q, i) => {
      const opts = order(n, i, q.length - 2); // q: [вопрос, верный, неверный…, почему]
      const a = answers[n] && answers[n][i];
      const checked = answers[n] && answers[n].shown;
      return `<li class="ik-q"><p>${esc(q[0])}</p><div class="ik-opts">${opts.map(k => {
        const cls = checked ? (k === 0 ? ' right' : a === k ? ' wrong' : '') : '';
        return `<label class="ik-opt${cls}"><input type="radio" name="q${i}" value="${k}"${a === k ? ' checked' : ''}${checked ? ' disabled' : ''}> ${esc(q[1 + k])}</label>`;
      }).join('')}</div>${checked && a !== 0 ? `<p class="ik-why">${esc(q[q.length - 1])}</p>` : ''}</li>`;
    }).join('');
    const shown = answers[n] && answers[n].shown;
    const res = shown ? `<p class="ik-res ${answers[n].pct >= PASS * 100 ? 'ok' : 'no'}">${t('score')}: <b>${answers[n].right} / ${l.test.length}</b> · ${answers[n].pct >= PASS * 100 ? t('passed') : t('failed')}</p>` : '';
    return `<section class="ik-sheet ik-test" id="ik-test"><h3>✔ ${t('test')}${done ? ' <span class="ik-pass">✓ ' + (sc ? sc + ' %' : '') + '</span>' : ''}</h3><p class="ik-small">${t('testNote')}</p><ol class="ik-qs">${qs}</ol>${res}
      <div class="ik-row">${shown ? `<button type="button" class="ik-btn ik-retry">${t('retry')}</button>` : `<button type="button" class="ik-btn ik-check">${t('check')}</button>`}<span class="ik-msg" role="status"></span></div></section>`;
  };
  // порядок вариантов: перемешан, но одинаков для урока и вопроса (0 — верный)
  const order = (n, i, k) => { const a = [...Array(k).keys()]; let s = n * 31 + i * 7 + 3; for (let j = a.length - 1; j > 0; j--) { s = (s * 16807) % 2147483647; const r = s % (j + 1); [a[j], a[r]] = [a[r], a[j]]; } return a; };

  const verdict = n => {
    const w = srv.works[n]; if (!w) return '';
    const c = w.comment ? `<p class="ik-note"><b>${t('polly')}:</b> ${esc(w.comment)}</p>` : '';
    return `<div class="ik-verdict ${w.status}">${w.img ? `<img src="/api/img/${w.img}?t=1" alt="">` : ''}<div><p>${t(w.status)}</p>${c}</div></div>`;
  };
  const practice = (n, l) => {
    const k = l.task, c = l.client, w = srv.works[n];
    const head = `<h3>✍ ${t('practice')}: ${esc(k.h)}</h3>${k.need ? `<p class="ik-small"><b>${t('need')}:</b> ${esc(k.need)}${k.time ? ` · <b>${t('time')}:</b> ${esc(k.time)}` : ''}</p>` : ''}<ol class="ik-steps">${k.steps.map(s => `<li>${s}</li>`).join('')}</ol>`;
    if (!passed(n)) return `<section class="ik-sheet ik-prac lock">${head.split('<ol')[0]}<p class="ik-lockmsg">${t('practiceLock')}</p></section>`;
    const who = `<div class="ik-client"><img src="/images/cards/${c.card || l.card}" alt=""><div><b>${esc(c.name)}</b><small>${esc(c.job)}</small><p>${esc(c.say)}</p><div class="ik-order"><b>${t('order')}</b><ul>${c.ask.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></div></div>`;
    let hand;
    if (w && w.status === 'ok') hand = verdict(n);
    else hand = `${w ? verdict(n) : ''}${w && w.status === 'wait' ? `<p class="ik-small">${t('wait')}</p>` : ''}<form class="ik-hand" onsubmit="return false"><label class="ik-btn ik-file">${w && w.status === 'wait' ? t('swap') : t('upload')}<input type="file" accept="image/*" hidden></label><img class="ik-prev" alt="" hidden><textarea rows="2" placeholder="${esc(t('note'))}"></textarea><button type="button" class="ik-btn ik-fill ik-send">${w && w.status === 'redo' ? t('again') : t('send')}</button><p class="ik-msg" role="status"></p></form>`;
    return `<section class="ik-sheet ik-prac" id="ik-prac">${head}${who}${hand}</section>`;
  };
  const lessonView = () => {
    const n = st.cur;
    if (!has(n)) return `<section class="ik-sheet"><p>${t('soonT')}</p></section>`;
    const l = LS[n - 1];
    const nav = `<nav class="ik-nav">${n > 1 ? `<button type="button" class="ik-btn" data-go="${n - 1}">${t('prev')} ${n - 1}</button>` : '<span></span>'}${n < N && has(n + 1) && isOpen(n + 1) ? `<button type="button" class="ik-btn ik-fill" data-go="${n + 1}">${t('next')} ${n + 1} →</button>` : ''}</nav>`;
    return `<article class="ik-lesson">
      <header class="ik-lhead"><span class="ik-k">${t('lesson')} ${n} ${t('of')} ${N}</span><h2>${l.icon} ${esc(l.name)}</h2>
        <div class="ik-say">${polly}<p>${esc(l.intro)}</p></div>
        <div class="ik-goals"><b>${t('goals')}</b><ul>${l.goals.map(g => `<li>${esc(g)}</li>`).join('')}</ul></div></header>
      <section class="ik-sheet ik-th"><h3>📖 ${t('theory')}</h3>${l.th}</section>
      <section class="ik-sheet ik-simple"><h3>✦ ${t('simple')}</h3><p>${esc(l.simple)}</p></section>
      <section class="ik-sheet"><h3>⚠ ${t('mist')}</h3><ul class="ik-mist">${l.mist.map(([a, b]) => `<li><p class="no">✗ ${esc(a)}</p><p class="yes">✓ ${esc(b)}</p></li>`).join('')}</ul></section>
      <section class="ik-sheet"><h3>🔖 ${t('terms')}</h3><dl class="ik-terms">${l.terms.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl></section>
      <section class="ik-sheet ik-fact"><h3>💡 ${t('fact')}</h3><p>${esc(l.fact)}</p></section>
      ${testView(n, l)}
      ${practice(n, l)}
      ${nav}</article>`;
  };

  // ---------- диплом ----------
  const dipOpts = () => ({ L, school: t('title'), title: t('dipTitle'), to: t('dipTo'), line: t('dipLine'), motto: t('dipMotto'), sign: t('dipSign'), date: t('dipDate'), fine: t('dipFine'), nick: srv.nick, icons: ICONS, last: Math.max(0, ...Object.values(srv.works).map(w => w.checked || 0)) });
  const diplomaView = () => {
    const k = stamps();
    if (k < N) return `<section class="ik-sheet ik-dipwait"><p>${t('dipWait')} <b>${k} / ${N}</b></p><button type="button" class="ik-btn ik-back">${t('back')}</button></section>`;
    return `<section class="ik-dip"><p class="ik-dip-hi">${t('dipCongrats')}${srv.btn ? ` <span class="ik-pass">+${srv.btn} 🔘</span>` : ''}</p><div class="ik-dip-pic"></div><div class="ik-row"><button type="button" class="ik-btn ik-fill ik-dl">${t('dipSave')}</button><a class="ik-btn" href="${pre}/challenge/">${t('toChallenge')}</a><button type="button" class="ik-btn ik-back">${t('back')}</button></div><p class="ik-small">${t('dipNote')}</p></section>`;
  };

  const render = () => {
    if (srv.me === false) return guest();
    if (srv.me === null || !LS.length) { box.innerHTML = `<p class="ik-loading">${t('loading')}</p>`; return; }
    box.innerHTML = `<div class="ik-top"><h1>${t('title')}</h1>${path()}</div>${mode === 'dip' ? diplomaView() : lessonView()}${bookLink()}`;
    const pic = box.querySelector('.ik-dip-pic');
    if (pic) window.PPDiploma.mount(pic, dipOpts());
  };
  const fixCur = () => { if (!(st.cur >= 1 && st.cur <= N)) st.cur = 1; while (st.cur > 1 && !(isOpen(st.cur) && has(st.cur))) st.cur--; };
  const open = n => { st.cur = n; mode = 'lesson'; save(); render(); box.querySelector('.ik-top').scrollIntoView({ block: 'start', behavior: 'smooth' }); };

  const load = async () => {
    const get = u => fetch(u, { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).catch(() => null);
    const [s, ls] = await Promise.all([get('/api/school?course=ink&lang=' + LG), get('/api/school/lessons?course=ink&lang=' + LG)]);
    if (!s || !s.me || !ls || !ls.me) { srv.me = false; render(); return; }
    srv.me = true; srv.admin = !!s.admin; srv.nick = s.nick || ''; srv.btn = s.diplomaBtn || 0; srv.works = {}; for (const w of s.works || []) srv.works[w.lesson] = w;
    LS = ls.lessons || [];
    fixCur(); render();
    if (location.hash === '#diploma') { mode = 'dip'; render(); }
  };
  const reload = () => fetch('/api/school?course=ink&lang=' + LG, { credentials: 'same-origin' }).then(r => r.json()).then(s => { srv.works = {}; for (const w of s.works || []) srv.works[w.lesson] = w; render(); });

  box.addEventListener('click', e => {
    const el = e.target;
    if (el.closest('.ik-login')) { window.PPAccount && window.PPAccount.openSignIn(); return; }
    const li = el.closest('.ik-path li');
    if (li) { if (li.dataset.n === 'dip') { mode = 'dip'; render(); return; } const k = +li.dataset.n; if (isOpen(k) && has(k)) open(k); return; }
    const go = el.closest('[data-go]'); if (go) { open(+go.dataset.go); return; }
    if (el.closest('.ik-back')) { mode = 'lesson'; render(); return; }
    if (el.closest('.ik-dl')) { window.PPDiploma.save(box.querySelector('.ps-dip-canvas'), 'polly-ink-diploma.png'); return; }
    const n = st.cur, l = LS[n - 1];
    if (el.closest('.ik-check')) {
      const a = answers[n] = answers[n] || {};
      if (l.test.some((_, i) => a[i] == null)) { box.querySelector('.ik-test .ik-msg').textContent = t('answerAll'); return; }
      const right = l.test.filter((_, i) => a[i] === 0).length, pct = Math.round(right / l.test.length * 100);
      Object.assign(a, { shown: 1, right, pct });
      st.t[n] = Math.max(st.t[n] || 0, pct); save(); render();
      box.querySelector(pct >= PASS * 100 ? '#ik-prac' : '#ik-test').scrollIntoView({ block: 'start', behavior: 'smooth' });
      return;
    }
    if (el.closest('.ik-retry')) { answers[n] = {}; render(); box.querySelector('#ik-test').scrollIntoView({ block: 'start' }); return; }
    if (el.closest('.ik-send')) { send(el.closest('.ik-hand')); return; }
  });
  box.addEventListener('change', e => {
    const r = e.target.closest('.ik-q input[type=radio]');
    if (r) { const n = st.cur, i = +r.name.slice(1); (answers[n] = answers[n] || {})[i] = +r.value; return; }
    const f = e.target.closest('.ik-file input');
    if (f && f.files[0]) { picked = f.files[0]; const img = box.querySelector('.ik-prev'); img.src = URL.createObjectURL(picked); img.hidden = false; }
  });
  // фото → полная (1600) и превью (480) JPEG, как в челлендже
  const jpeg = (bmp, max, q) => { const k = Math.min(1, max / Math.max(bmp.width, bmp.height)), c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k); c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height); return new Promise(r => c.toBlob(r, 'image/jpeg', q)); };
  async function send(form) {
    const msg = form.querySelector('.ik-msg'), btn = form.querySelector('.ik-send');
    if (!picked) { msg.textContent = t('noPic'); return; }
    btn.disabled = true; msg.textContent = t('sending');
    try {
      const bmp = await createImageBitmap(picked), fd = new FormData();
      fd.append('course', COURSE); fd.append('lesson', st.cur); fd.append('note', form.querySelector('textarea').value);
      fd.append('full', await jpeg(bmp, 1600, 0.85), 'full.jpg'); fd.append('thumb', await jpeg(bmp, 480, 0.8), 'thumb.jpg');
      const r = await fetch('/api/school/hand', { method: 'POST', credentials: 'same-origin', body: fd });
      if (!r.ok) throw new Error(r.status);
      picked = null; await reload();
    } catch (e) { btn.disabled = false; msg.textContent = t('fail'); }
  }
  document.addEventListener('pp:whoami', e => { const u = e.detail && e.detail.user; if (srv.me === false && u && u.nick) load(); }); // вошёл на этой странице — открыть курс
  render();
  load();
})();
