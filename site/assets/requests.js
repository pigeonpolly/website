// «Нарисуй мне» (/requests/): сверху любой может предложить тему (аноним — «птица + номер», как в комментариях),
// ниже — темы, которые ждут, и сетка рисунков-ответов Алины (наведение — чуть крупнее, клик — на весь экран).
// Только Алина (админ) видит кнопки: загрузить рисунок к теме, скрыть тему, скачать карточку «рисунок + тема» для соцсетей.
// Автор темы с ником получает за каждый рисунок подарок для птички (сервер: /api/requests, /api/admin/requests/*).
(() => {
  const app = document.getElementById('requests');
  if (!app) return;
  const lang = { ru: 'ru', lv: 'lv' }[document.documentElement.lang] || 'en', L = { en: 0, ru: 1, lv: 2 }[lang];
  const T = {
    ask: ['What should I draw?', 'Что мне нарисовать?', 'Ko man uzzīmēt?'],
    askP: ['A pigeon eating spaghetti, a cat on a scooter, my grandma’s garden…', 'Голубь ест спагетти, кот на самокате, бабушкин сад…', 'Balodis ēd spageti, kaķis uz skrejriteņa, vecmāmiņas dārzs…'],
    send: ['✏️ Suggest', '✏️ Предложить', '✏️ Ieteikt'],
    as: [n => `You’ll appear as ${n}.`, n => `Ты будешь подписан(а) как ${n}.`, n => `Tu būsi parakstīts kā ${n}.`],
    gift: ['🎁 Sign in and get a gift for your pixel bird for every drawing of your idea.', '🎁 Войди — и за каждый рисунок по твоей теме твоя пиксельная птичка получит подарок.', '🎁 Ienāc — un par katru zīmējumu pēc tavas tēmas tavs pikseļu putniņš saņems dāvanu.'],
    giftIn: ['🎁 For every drawing of your idea your bird gets a gift.', '🎁 За каждый рисунок по твоей теме твоя птичка получит подарок.', '🎁 Par katru zīmējumu pēc tavas tēmas tavs putniņš saņems dāvanu.'],
    giftS: ['🎁 a gift for your bird for every drawing', '🎁 подарок птичке за каждый рисунок', '🎁 dāvana putniņam par katru zīmējumu'],
    giftA: ['for a 🎁 for your bird', '— и птичка получит 🎁', 'un putniņš saņems 🎁'],
    signin: ['Sign in', 'Войти', 'Ienākt'],
    thanks: ['Thank you! Your idea is in the queue ✨', 'Спасибо! Тема в очереди ✨', 'Paldies! Tēma ir rindā ✨'],
    err: { short: ['A few more words, please.', 'Напиши чуть подробнее.', 'Uzraksti mazliet vairāk.'], link: ['Please, no links.', 'Без ссылок, пожалуйста.', 'Bez saitēm, lūdzu.'],
      many: ['That’s enough ideas for today: come back tomorrow!', 'На сегодня хватит идей — приходи завтра!', 'Šodienai idejām pietiek — nāc rīt!'],
      wait: ['Just a moment before the next idea.', 'Подожди немного перед следующей темой.', 'Pagaidi mirkli pirms nākamās tēmas.'],
      fast: ['Oops, too fast! Try again in a second.', 'Ой, слишком быстро! Попробуй ещё раз через секунду.', 'Ups, pārāk ātri! Mēģini pēc sekundes.'],
      busy: ['So many ideas right now! Try again in an hour.', 'Сейчас очень много тем! Попробуй через час.', 'Šobrīd ļoti daudz tēmu! Mēģini pēc stundas.'],
      dup: ['This idea is already in the list: give it a ♡ instead!', 'Такая тема уже есть в списке — поставь ей ♡!', 'Šī tēma jau ir sarakstā — iedod tai ♡!'],
      closed: ['I’m not taking new ideas right now.', 'Сейчас я не принимаю новые темы.', 'Šobrīd jaunas tēmas nepieņemu.'], x: ['Something went wrong, try again.', 'Что-то пошло не так, попробуй ещё раз.', 'Kaut kas nogāja greizi, mēģini vēlreiz.'] },
    waiting: n => [`Waiting to be drawn (${n})`, `Ждут своей очереди (${n})`, `Gaida savu kārtu (${n})`][L],
    drawn: n => [`Drawn (${n})`, `Нарисовано (${n})`, `Uzzīmēts (${n})`][L],
    none: ['No ideas yet. Be the first!', 'Пока нет тем. Будь первым!', 'Vēl nav tēmu. Esi pirmais!'],
    noneDone: ['The first drawings are on their way.', 'Первые рисунки уже в пути.', 'Pirmie zīmējumi jau ceļā.'],
    up: ['📤 Upload drawing', '📤 Загрузить рисунок', '📤 Augšupielādēt'], hide: ['🙈 Hide', '🙈 Скрыть', '🙈 Paslēpt'], card: ['⬇ Card', '⬇ Карточка', '⬇ Kartīte'],
    hideAsk: ['Hide this idea?', 'Скрыть эту тему?', 'Paslēpt šo tēmu?'], uploading: ['Uploading…', 'Загружаю…', 'Augšupielādē…'],
    gave: ['🎁 Gift sent to', '🎁 Подарок отправлен:', '🎁 Dāvana nosūtīta:'], redo: ['📤 Replace', '📤 Заменить', '📤 Aizstāt'],
    cardIdea: ['Idea by', 'Тема от', 'Ideja no'], cardCta: ['Suggest yours:', 'Предложи свою:', 'Iesaki savu:'],
    close: ['Close', 'Закрыть', 'Aizvērt'], mine: ['your idea', 'твоя тема', 'tava tēma'],
    like: ['Like', 'Нравится', 'Patīk'], sortL: ['Sort', 'Порядок', 'Kārtība'],
    sQueue: ['🕒 In order', '🕒 По очереди', '🕒 Pēc kārtas'], sNew: ['✨ Newest', '✨ Сначала новые', '✨ Jaunākās'], sTop: ['❤️ Most liked', '❤️ Больше лайков', '❤️ Populārākās'],
    search: ['🔍 Search by nickname or idea', '🔍 Поиск по нику или теме', '🔍 Meklēt pēc segvārda vai tēmas'], nothing: ['Nothing found.', 'Ничего не нашлось.', 'Nekas netika atrasts.'],
    moreOpen: n => [`Show all (+${n})`, `Показать все (+${n})`, `Rādīt visas (+${n})`][L], moreDone: n => [`Show ${n} more`, `Показать ещё ${n}`, `Rādīt vēl ${n}`][L],
    closedMsg: ['🌙 I’m drawing the ideas I already have, so new ones are paused for now. Come back a bit later, and meanwhile ♡ the ideas you like!', '🌙 Сейчас я рисую уже предложенные темы, поэтому приём новых на паузе. Загляни чуть позже, а пока поставь ♡ темам, которые нравятся!', '🌙 Šobrīd zīmēju jau ieteiktās tēmas, tāpēc jaunu pieņemšana ir pauzē. Ieskaties vēlāk, un pa to laiku iedod ♡ tēmām, kas patīk!'],
    pause: ['⏸ Stop taking ideas', '⏸ Временно не принимать темы', '⏸ Pagaidām nepieņemt tēmas'], resume: ['▶ Take ideas again', '▶ Снова принимать темы', '▶ Atkal pieņemt tēmas'],
    pausedAdm: ['New ideas are paused: visitors see a note instead of the form.', 'Приём тем на паузе: посетители видят записку вместо поля.', 'Tēmu pieņemšana ir pauzē: apmeklētāji redz zīmīti formas vietā.'],
    hidden: n => [`🙈 Hidden (${n})`, `🙈 Скрытые (${n})`, `🙈 Paslēptās (${n})`][L], back: ['↩ Bring back', '↩ Вернуть', '↩ Atgriezt'],
    pick: ['🐦 Polly’s pick', '🐦 Выбор Полли', '🐦 Pollijas izvēle'], pickH: ['Polly brought you this one:', 'Полли принесла тебе:', 'Pollija tev atnesa:'], again: ['🐦 Again', '🐦 Ещё раз', '🐦 Vēlreiz'],
  };
  const t = (k, ...a) => { const v = T[k]; const x = Array.isArray(v) ? v[L] : v; return typeof x === 'function' ? x(...a) : x; };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const imgUrl = (id, thumb) => `/api/img/${id}${thumb ? '?t=1' : ''}`;
  let S = null;

  async function load() {
    S = await fetch(`/api/requests?lang=${lang}`, { credentials: 'same-origin' }).then(r => r.json());
    draw();
  }
  // поиск (по нику и по тексту темы — сразу в обоих списках) и показ частями: тем — 30, рисунков — 24, дальше «Показать ещё»
  let HID = false; // открыт ли список скрытых (только у Алины)
  let Q = '', openN = 30, doneN = 24, SORT = 'queue'; // queue — темы по очереди (старые первыми), рисунки — новые; new — новые; top — по лайкам
  const sorted = (list, isOpen) => { const a = list.slice(); if (SORT === 'top') a.sort((x, y) => y.likes - x.likes || y.at - x.at); else if (SORT === 'new' || !isOpen) a.sort((x, y) => y.at - x.at); else a.sort((x, y) => x.at - y.at); return a; };
  const heart = r => `<button type="button" class="rq-like${r.liked ? ' on' : ''}" data-like="${r.id}" aria-pressed="${r.liked}" title="${esc(t('like'))}">${r.liked ? '♥' : '♡'}<b>${r.likes || ''}</b></button>`;
  const match = r => { const q = Q.trim().toLowerCase().replace(/^@/, ''); return !q || r.name.toLowerCase().replace(/^@/, '').includes(q) || r.text.toLowerCase().includes(q); };
  function draw() {
    const shut = S.closed && !S.admin; // пауза: посетителям — записка вместо поля, Алине — поле и пометка
    app.innerHTML = `<section class="rq-ask" aria-label="${esc(t('ask'))}">
        ${shut ? `<p class="rq-closed">${t('closedMsg')}</p>` : `<form class="rq-form"><div class="rq-bar"><input type="text" name="text" maxlength="120" required autocomplete="off" placeholder="${esc(t('askP'))}" aria-label="${esc(t('ask'))}"><span class="rq-cnt"></span><button type="submit" class="rq-go" aria-label="${esc(t('send').replace('✏️ ', ''))}"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M3 11.5 20.5 4l-7.5 17.5-2.2-7.8z" fill="currentColor"/></svg></button></div>
        <input type="text" name="website" class="rq-hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <p class="rq-who">${esc(S.me ? '@' + S.me.nick : S.anon)} · ${S.me ? t('giftS') : `<button type="button" class="rq-in">${t('signin')}</button> ${t('giftA')}`}</p><p class="rq-st" role="status"></p></form>`}
        ${S.admin && S.closed ? `<p class="rq-pause">${t('pausedAdm')}</p>` : ''}</section>
      <div class="rq-lists"></div>`;
    // кнопки — в шапке справа от заголовка: пауза (админ), «Выбор Полли» (админ), порядок, поиск
    const head = document.getElementById('rq-tools') || app.insertBefore(Object.assign(document.createElement('div'), { className: 'rq-tools' }), app.querySelector('.rq-lists'));
    head.innerHTML = `${S.admin ? `<button type="button" class="rq-tog${S.closed ? ' on' : ''}" title="${esc(S.closed ? t('resume') : t('pause'))}" aria-label="${esc(S.closed ? t('resume') : t('pause'))}">${S.closed ? '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>' : '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="6" y="4.5" width="4" height="15" rx="1.2" fill="currentColor"/><rect x="14" y="4.5" width="4" height="15" rx="1.2" fill="currentColor"/></svg>'}</button>` : ''}${S.admin && S.open.length ? `<button type="button" class="pill-btn pill-fill rq-pick">${t('pick')}</button>` : ''}<select class="rq-sort" aria-label="${esc(t('sortL'))}">${[['queue', t('sQueue')], ['new', t('sNew')], ['top', t('sTop')]].map(([k, l]) => `<option value="${k}"${SORT === k ? ' selected' : ''}>${l}</option>`).join('')}</select><input type="search" class="rq-search" placeholder="${esc(t('search'))}" value="${esc(Q)}" aria-label="${esc(t('search'))}">`;
    const tog = head.querySelector('.rq-tog'); if (tog) tog.onclick = async () => {
      tog.disabled = true; const r = await fetch('/api/admin/requests/closed', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ closed: !S.closed }) }).then(r => r.json()).catch(() => null);
      if (r && r.ok) S.closed = r.closed; draw();
    };
    const f = app.querySelector('.rq-form');
    if (f) {
    const st = app.querySelector('.rq-st'), cnt = app.querySelector('.rq-cnt'), t0 = Date.now();
    f.text.oninput = () => { const n = f.text.value.length; cnt.textContent = n > 80 ? `${n}/120` : ''; cnt.classList.toggle('near', n > 100); };
    f.onsubmit = async e => {
      e.preventDefault(); const b = f.querySelector('button[type=submit]'); b.disabled = true;
      try {
        const r = await fetch('/api/requests', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text: f.text.value, lang, hp: f.website.value, ms: Date.now() - t0 }) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) { st.textContent = (T.err[j.error] || T.err.x)[L]; b.disabled = false; if (j.error === 'closed') { S.closed = true; setTimeout(draw, 2500); } return; }
        await load(); const s2 = app.querySelector('.rq-st'); if (s2) s2.textContent = t('thanks');
      } catch (x) { st.textContent = T.err.x[L]; b.disabled = false; }
    };
    const si = app.querySelector('.rq-in'); if (si) si.onclick = () => window.PPAccount && window.PPAccount.openSignIn();
    }
    const sq = head.querySelector('.rq-search'); sq.oninput = () => { Q = sq.value; openN = 30; doneN = 24; lists(); };
    const so = head.querySelector('.rq-sort'); so.onchange = () => { SORT = so.value; lists(); };
    const pk = head.querySelector('.rq-pick'); if (pk) pk.onclick = pollyPick;
    lists();
  }
  function lists() {
    const adm = S.admin, op = sorted(S.open.filter(match), true), dn = sorted(S.done.filter(match), false), box = app.querySelector('.rq-lists');
    box.innerHTML = `<section class="rq-wait" aria-label="${esc(t('waiting', op.length))}">${op.length ? `<ul class="rq-list">${op.slice(0, openN).map(r => `<li data-id="${r.id}"${r.mine ? ' class="mine"' : ''}><span class="rq-txt"><span class="rq-q" title="${esc(r.text)}${r.en ? ' · ' + esc(r.en) : ''}">${esc(r.text)}</span><span class="rq-by">${esc(r.name)}</span></span>${heart(r)}${adm ? `<span class="rq-adm"><label class="rq-ic rq-upl" title="${esc(t('up'))}">📤<input type="file" accept="image/*" hidden></label><button type="button" class="rq-ic rq-hide" title="${esc(t('hide'))}">🙈</button></span>` : ''}</li>`).join('')}</ul>${op.length > openN ? `<button type="button" class="pill-btn rq-more" data-more="open">${t('moreOpen', op.length - openN)}</button>` : ''}` : `<p class="rq-none">${Q ? t('nothing') : t('none')}</p>`}</section>
      <section class="rq-done"><h2>${t('drawn', dn.length)}</h2>${dn.length ? `<div class="rq-grid">${dn.slice(0, doneN).map(r => `<figure data-id="${r.id}"><button type="button" class="rq-pic" aria-label="${esc(r.text)}"><img src="${imgUrl(r.img, 1)}" alt="${esc(r.text)}" loading="lazy" decoding="async"></button>
        <figcaption><span class="rq-q">${esc(r.en || r.text)}</span>${r.en ? `<span class="rq-orig">${esc(r.text)}</span>` : ''}<span class="rq-cap-row"><span class="rq-by">${esc(r.name)}</span>${heart(r)}</span></figcaption>${adm ? `<div class="rq-adm"><button type="button" class="pill-btn pill-fill rq-card">${t('card')}</button><label class="pill-btn rq-upl">${t('redo')}<input type="file" accept="image/*" hidden></label></div>` : ''}</figure>`).join('')}</div>${dn.length > doneN ? `<button type="button" class="pill-btn rq-more" data-more="done">${t('moreDone', Math.min(24, dn.length - doneN))}</button>` : ''}` : `<p class="rq-none">${Q ? t('nothing') : t('noneDone')}</p>`}</section>${adm && S.hidden && S.hidden.length ? `
      <details class="rq-hidden"${HID ? ' open' : ''}><summary>${t('hidden', S.hidden.length)}</summary><ul class="rq-list">${S.hidden.map(r => `<li data-id="${r.id}"><span class="rq-txt"><span class="rq-q" title="${esc(r.text)}">${esc(r.text)}</span><span class="rq-by">${esc(r.name)}</span></span><button type="button" class="pill-btn rq-back">${t('back')}</button></li>`).join('')}</ul></details>` : ''}`;
    box.querySelectorAll('[data-more]').forEach(b => b.onclick = () => { if (b.dataset.more === 'open') openN = 1e9; else doneN += 24; lists(); });
    box.querySelectorAll('.rq-pic').forEach(b => b.onclick = () => open(+b.closest('figure').dataset.id, dn));
    box.querySelectorAll('[data-like]').forEach(b => b.onclick = async () => {
      const id = +b.dataset.like, r = S.open.concat(S.done).find(x => x.id === id); if (!r || b.disabled) return;
      b.disabled = true; r.liked = !r.liked; r.likes += r.liked ? 1 : -1; b.classList.toggle('on', r.liked); b.innerHTML = `${r.liked ? '♥' : '♡'}<b>${r.likes || ''}</b>`; // сразу, не дожидаясь сервера
      try { const j = await fetch('/api/requests/like', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }) }).then(x => x.json()); r.liked = j.liked; r.likes = j.likes; } catch (e) {}
      lists();
    });
    if (!adm) return;
    box.querySelectorAll('.rq-upl input').forEach(i => i.onchange = () => upload(+i.closest('[data-id]').dataset.id, i.files[0], i.closest('label')));
    const hd = box.querySelector('.rq-hidden'); if (hd) hd.ontoggle = () => { HID = hd.open; };
    box.querySelectorAll('.rq-back').forEach(b => b.onclick = async () => { b.disabled = true; await fetch('/api/admin/requests/hide', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: +b.closest('[data-id]').dataset.id, back: true }) }); load(); });
    box.querySelectorAll('.rq-hide').forEach(b => b.onclick = async () => { if (!confirm(t('hideAsk'))) return; await fetch('/api/admin/requests/hide', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: +b.closest('[data-id]').dataset.id }) }); load(); });
    box.querySelectorAll('.rq-card').forEach(b => b.onclick = () => card(S.done.find(r => r.id === +b.closest('[data-id]').dataset.id)));
  }

  // ---------- «🐦 Выбор Полли» (только для Алины, ни на что не влияет): Полли прилетает из угла с запиской в клюве ----------
  async function pollyPick() {
    const list = S.open.length ? S.open : S.done; if (!list.length) return;
    const r = list[Math.floor(Math.random() * list.length)], pp = window.PollyPet, fr = pp && pp.frames ? pp.frames() : null;
    const ov = document.createElement('div'); ov.className = 'rq-pp'; document.body.appendChild(ov); document.body.classList.add('modal-open');
    const close = () => { ov.remove(); document.body.classList.remove('modal-open'); pp && pp.away && pp.away(false); document.removeEventListener('keydown', key); };
    const key = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', key);
    ov.addEventListener('click', e => { if (e.target === ov || e.target.closest('[data-x]')) close(); if (e.target.closest('[data-again]')) { close(); pollyPick(); } });
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cardHtml = `<div class="rq-pp-card"><p class="rq-pp-h">${t('pickH')}</p><p class="rq-pp-q">“${esc(r.text)}”</p>${r.en ? `<p class="rq-pp-en">${esc(r.en)}</p>` : ''}<p class="rq-pp-by">${esc(r.name)}${r.status === 'done' ? ' · ✓' : ''}</p><div class="rq-pp-b"><button type="button" class="pill-btn" data-x>${t('close')}</button><button type="button" class="pill-btn pill-fill" data-again>${t('again')}</button></div></div>`;
    if (!fr || reduce) { ov.innerHTML = cardHtml; return; }
    // птичка (крупнее, чем в углу) с запиской летит из угла в центр
    const k = 3, bird = document.createElement('div'); bird.className = 'rq-pp-bird';
    const cv = document.createElement('canvas'); cv.width = fr.w; cv.height = fr.h; cv.style.width = fr.w * k + 'px'; cv.style.height = fr.h * k + 'px'; bird.appendChild(cv);
    const note = document.createElement('span'); note.className = 'rq-pp-note'; note.textContent = '📜'; bird.appendChild(note);
    ov.appendChild(bird);
    const g = cv.getContext('2d'), frame = f => { g.clearRect(0, 0, fr.w, fr.h); g.imageSmoothingEnabled = false; g.drawImage(fr[f], 0, 0); };
    const from = pp.where(), sx = from.left, sy = from.top, tx = innerWidth / 2 - fr.w * k / 2, ty = innerHeight / 2 - fr.h * k / 2 - 40;
    pp.away(true);
    const t0 = performance.now(), dur = 1300;
    await new Promise(res => { const step = now => { const q = Math.min(1, (now - t0) / dur), e = q < .5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2;
      const x = sx + (tx - sx) * e, y = sy + (ty - sy) * e - Math.sin(Math.PI * q) * 160, sc = 1 / k + (1 - 1 / k) * e;
      bird.style.transform = `translate(${x}px, ${y}px) scale(${sc})`; frame(Math.floor(q * 14) % 2 ? 'fly' : 'a'); q < 1 ? requestAnimationFrame(step) : res(); }; requestAnimationFrame(step); });
    frame('a'); note.classList.add('drop'); await new Promise(res => setTimeout(res, 450));
    const holder = document.createElement('div'); holder.innerHTML = cardHtml; const cd = holder.firstChild; ov.appendChild(cd);
    bird.classList.add('done');
  }

  // ---------- загрузка ответа (как в челлендже: полная до 1600 px и превью 500 px) ----------
  async function shrink(file, max, q) {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); });
    const k = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(img.src);
    return new Promise(r => c.toBlob(r, 'image/jpeg', q));
  }
  async function upload(id, file, lbl) {
    if (!file) return; lbl.classList.add('busy'); lbl.firstChild.textContent = t('uploading');
    try {
      const fd = new FormData(); fd.append('id', id); fd.append('full', new File([await shrink(file, 1600, .85)], 'full.jpg', { type: 'image/jpeg' })); fd.append('thumb', new File([await shrink(file, 500, .78)], 'thumb.jpg', { type: 'image/jpeg' }));
      const r = await fetch('/api/admin/requests/answer', { method: 'POST', credentials: 'same-origin', body: fd }).then(x => x.json());
      if (r.gift && window.PPToast) { const B = window.PPBirds; window.PPToast(`${t('gave')} ${B && B.giftName ? B.giftName(r.gift.kind, r.gift.item, L) : r.gift.item}${r.gift.mid ? ' ✨' : ''}`); }
      await load();
    } catch (x) { alert(T.err.x[L]); lbl.classList.remove('busy'); }
  }

  // ---------- на весь экран ----------
  function open(id, from) {
    const list = from || S.done; let i = list.findIndex(r => r.id === id);
    const d = document.createElement('div'); d.className = 'rq-lb'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true');
    const show = () => { const r = list[i]; d.innerHTML = `<button type="button" class="rq-lb-x" aria-label="${t('close')}">✕</button>${list.length > 1 ? '<button type="button" class="rq-lb-p" aria-label="←">‹</button><button type="button" class="rq-lb-n" aria-label="→">›</button>' : ''}
      <figure><img src="${imgUrl(r.img)}" alt="${esc(r.text)}"><figcaption><span class="rq-q">“${esc(r.en || r.text)}”</span>${r.en ? `<span class="rq-orig">${esc(r.text)}</span>` : ''}<span class="rq-by">${esc(r.name)}</span></figcaption></figure>`; };
    const close = () => { d.remove(); document.removeEventListener('keydown', key); document.body.classList.remove('modal-open'); };
    const key = e => { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') { i = (i + 1) % list.length; show(); } if (e.key === 'ArrowLeft') { i = (i - 1 + list.length) % list.length; show(); } };
    d.addEventListener('click', e => { if (e.target.closest('.rq-lb-x') || e.target === d) close(); else if (e.target.closest('.rq-lb-n')) { i = (i + 1) % list.length; show(); } else if (e.target.closest('.rq-lb-p')) { i = (i - 1 + list.length) % list.length; show(); } });
    let sx = null; d.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true }); d.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) { i = (i + (dx < 0 ? 1 : -1) + list.length) % list.length; show(); } sx = null; });
    document.addEventListener('keydown', key); document.body.classList.add('modal-open'); show(); document.body.appendChild(d);
  }

  // ---------- карточка для соцсетей (12.10.2026): фото Алины целиком, без рамки и без обрезки; поверх — белое «сообщение»
  // с предложенной темой и «idea by @ник» (как в чате); внизу — «drawn by pigeonpolly.com» ----------
  async function card(r) {
    try { await Promise.all(['600 60px Fraunces', '700 34px Karla'].map(f => document.fonts.load(f))); } catch (e) {}
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = imgUrl(r.img); });
    const W = 1080, H = Math.round(W * img.height / img.width), u = W / 1080; // размер — как у фото
    const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
    g.drawImage(img, 0, 0, W, H);
    const rr = (x, y, w, h, rad) => { g.beginPath(); g.moveTo(x + rad, y); g.arcTo(x + w, y, x + w, y + h, rad); g.arcTo(x + w, y + h, x, y + h, rad); g.arcTo(x, y + h, x, y, rad); g.arcTo(x, y, x + w, y, rad); g.closePath(); };
    // сообщение: ник сверху, тема ниже; ширина — по тексту, но не шире 82 % карточки
    const pad = 40 * u, maxW = W * 0.82 - pad * 2, fs = Math.round(H > W * 1.4 ? 56 : 50) * u;
    g.font = `600 ${fs}px Fraunces, Georgia, serif`;
    const lines = []; let cur = ''; for (const w of (r.en || r.text).split(' ')) { const tt = cur ? cur + ' ' + w : w; if (g.measureText(tt).width > maxW && cur) { lines.push(cur); cur = w; } else cur = tt; } lines.push(cur);
    const ls = lines.slice(0, 5), tw = Math.max(...ls.map(l => g.measureText(l).width));
    g.font = `400 ${32 * u}px Karla, system-ui, sans-serif`; const ib = 'idea by ', iw = g.measureText(ib).width;
    g.font = `700 ${32 * u}px Karla, system-ui, sans-serif`; const nw = iw + g.measureText(r.name).width;
    const bw = Math.max(tw, nw) + pad * 2, lh = fs * 1.18, bh = pad + 36 * u + 14 * u + ls.length * lh + pad * 0.7, bx = 48 * u, by = 48 * u;
    g.save(); g.shadowColor = 'rgba(0,0,0,.28)'; g.shadowBlur = 30 * u; g.shadowOffsetY = 8 * u;
    rr(bx, by, bw, bh, 34 * u); g.fillStyle = '#FFFFFF'; g.fill();
    g.beginPath(); g.moveTo(bx + 46 * u, by + bh - 4); g.lineTo(bx + 30 * u, by + bh + 34 * u); g.lineTo(bx + 96 * u, by + bh - 4); g.closePath(); g.fill(); // «хвостик» сообщения
    g.restore();
    g.textBaseline = 'alphabetic'; g.textAlign = 'left';
    g.font = `400 ${32 * u}px Karla, system-ui, sans-serif`; g.fillStyle = '#9A9BC4'; g.fillText(ib, bx + pad, by + pad + 26 * u);
    g.font = `700 ${32 * u}px Karla, system-ui, sans-serif`; g.fillStyle = '#7F81BF'; g.fillText(r.name, bx + pad + iw, by + pad + 26 * u);
    g.font = `600 ${fs}px Fraunces, Georgia, serif`; g.fillStyle = '#2B1A51';
    ls.forEach((ln, i) => g.fillText(ln, bx + pad, by + pad + 36 * u + 14 * u + fs * 0.92 + i * lh));
    // адрес сайта внизу
    // «drawn by pigeonpolly.com»: «drawn by» тоньше и светлее, адрес — жирным
    g.font = `400 ${34 * u}px Karla, system-ui, sans-serif`; const db = 'drawn by ', dw = g.measureText(db).width;
    g.font = `700 ${34 * u}px Karla, system-ui, sans-serif`;
    const site = 'pigeonpolly.com', stw = g.measureText(site).width, sw = dw + stw + 56 * u, sx = (W - sw) / 2, sy = H - 48 * u - 64 * u;
    g.save(); g.shadowColor = 'rgba(0,0,0,.25)'; g.shadowBlur = 20 * u; rr(sx, sy, sw, 64 * u, 32 * u); g.fillStyle = 'rgba(255,255,255,.92)'; g.fill(); g.restore();
    g.textAlign = 'left';
    g.font = `400 ${34 * u}px Karla, system-ui, sans-serif`; g.fillStyle = '#7F81BF'; g.fillText(db, sx + 28 * u, sy + 44 * u);
    g.font = `700 ${34 * u}px Karla, system-ui, sans-serif`; g.fillStyle = '#2B1A51'; g.fillText(site, sx + 28 * u + dw, sy + 44 * u);
    c.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `pigeonpolly-request-${r.id}.jpg`; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }, 'image/jpeg', .92);
  }

  load().catch(() => { app.innerHTML = `<p class="rq-none">${T.err.x[L]}</p>`; });
})();
