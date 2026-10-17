// «Все птички» — /flock/ (этап 13 Б, docs/flock.md): «В стае N птичек», поиск по нику, «🎲 Случайная птичка», сортировка,
// карточки птичек (птичка, ник, серия, миниатюра комнаты, рисунки, пёрышки) с подгрузкой при прокрутке; данные — GET /api/birds (worker/flock.js).
// /flock/?bird=ник (ссылка «моя птичка» из bird-card.js): эта птичка первой и подсвечена, сверху плашка-приглашение.
(() => {
  const box = document.querySelector('.fl-list');
  if (!box) return;
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0, pre = ['', '/ru', '/lv'][L];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ru = (n, a, b, c) => n % 10 === 1 && n % 100 !== 11 ? a : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? b : c;
  const T = {
    count: [n => `${n} ${n === 1 ? 'bird' : 'birds'} in the flock`, n => `В стае ${n} ${ru(n, 'птичка', 'птички', 'птичек')}`, n => `Barā ${n} ${n % 10 === 1 && n % 100 !== 11 ? 'putniņš' : 'putniņi'}`],
    found: [n => `Found: ${n}`, n => `Нашлось: ${n}`, n => `Atrasti: ${n}`],
    q: ['🔍 Find a bird by nickname', '🔍 Найти птичку по нику', '🔍 Atrast putniņu pēc segvārda'],
    random: ['🎲 Random bird', '🎲 Случайная птичка', '🎲 Nejaušs putniņš'],
    sort: ['Sort', 'Сортировка', 'Kārtot'],
    recent: ['Dropped by recently', 'Недавно были', 'Nesen bija'],
    new: ['Newcomers', 'Новенькие', 'Jaunpienācēji'],
    feathers: ['Cosy rooms 🪶', 'Красивые комнаты 🪶', 'Skaistas istabas 🪶'],
    works: ['Most sketches', 'Много рисунков', 'Daudz skiču'],
    empty: ['empty for now', 'пока пусто', 'pagaidām tukšs'],
    streak: [n => `🔥 ${n}`, n => `🔥 ${n}`, n => `🔥 ${n}`],
    streakT: ['days in a row', 'дней подряд', 'dienas pēc kārtas'],
    worksT: ['sketches', 'рисунков', 'skices'],
    feathersT: ['feathers', 'пёрышек', 'spalviņas'],
    none: ['No birds with this nickname.', 'Птичек с таким ником нет.', 'Putniņu ar tādu segvārdu nav.'],
    err: ['Could not load the flock. Try again later.', 'Не удалось загрузить стаю. Попробуй позже.', 'Neizdevās ielādēt baru. Pamēģini vēlāk.'],
    invite: ['lives in this flock. Want a bird of your own?', 'живёт в этой стае. Хочешь свою птичку?', 'dzīvo šajā barā. Gribi savu putniņu?'],
    get: ['Get my bird', 'Получить птичку', 'Saņemt putniņu'],
  };
  const t = (k, ...a) => { const v = T[k][L]; return typeof v === 'function' ? v(...a) : v; };
  const SORTS = ['recent', 'new', 'feathers', 'works'];
  const bird = (new URLSearchParams(location.search).get('bird') || '').replace(/^@/, '').trim();
  let sort = 'recent', q = '', next = 0, more = false, busy = false, gen = 0;
  try { const s = localStorage.getItem('pp-flock-sort'); if (SORTS.includes(s)) sort = s; } catch (e) { /* ок */ }

  box.innerHTML = `${bird ? `<p class="fl-invite">🐦 <b>@${esc(bird)}</b> ${t('invite')} <button type="button" class="fl-get">${t('get')}</button></p>` : ''}
    <div class="fl-bar">
      <p class="fl-total" aria-live="polite">&nbsp;</p>
      <input type="search" class="fl-q" placeholder="${t('q')}" aria-label="${t('q')}" maxlength="40" autocomplete="off">
      <button type="button" class="pill-btn fl-rnd">${t('random')}</button>
    </div>
    <div class="fl-sorts" role="group" aria-label="${t('sort')}">${SORTS.map(k => `<button type="button" data-sort="${k}" aria-pressed="${k === sort}">${t(k)}</button>`).join('')}</div>
    <div class="fl-grid"></div><p class="fl-msg" hidden></p><div class="fl-more" aria-hidden="true"></div>`;
  const grid = box.querySelector('.fl-grid'), msg = box.querySelector('.fl-msg'), total = box.querySelector('.fl-total');

  const get = box.querySelector('.fl-get');
  if (get) get.onclick = () => { if (window.PPAccount && !window.PPAccount.signedIn()) window.PPAccount.openSignIn(); else location.href = pre + '/bird/'; };
  box.querySelector('.fl-rnd').onclick = async e => {
    e.currentTarget.disabled = true;
    const d = await fetch('/api/birds?random=1&r=' + Date.now()).then(r => r.json()).catch(() => ({}));
    if (d.nick) location.href = pre + '/bird/?nick=' + encodeURIComponent(d.nick); else e.currentTarget.disabled = false;
  };
  box.querySelectorAll('[data-sort]').forEach(b => b.onclick = () => {
    sort = b.dataset.sort; try { localStorage.setItem('pp-flock-sort', sort); } catch (e) { /* ок */ }
    box.querySelectorAll('[data-sort]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    load(true);
  });
  let qt;
  box.querySelector('.fl-q').addEventListener('input', e => { clearTimeout(qt); qt = setTimeout(() => { q = e.target.value.trim().replace(/^@/, ''); load(true); }, 300); });

  // миниатюра комнаты рисуется, когда карточка доходит до экрана (room.js, один неподвижный кадр)
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const r = e.target._room; if (r && window.PPRoom) try { window.PPRoom.mount(e.target, { id: r.id, nick: r.nick, avatar: r.avatar, room: r.room, still: true }); } catch (x) { /* ок */ }
  }), { rootMargin: '300px' }) : null;

  const card = b => {
    const a = document.createElement('a');
    a.className = 'fl-card' + (b.hi ? ' hi' : ''); a.href = pre + '/bird/?nick=' + encodeURIComponent(b.nick);
    a.innerHTML = `<div class="fl-card-room">${b.room ? '' : `<span class="fl-card-empty">${t('empty')}</span>`}</div>
      <div class="fl-card-who"><span class="fl-card-ava"></span><b>@${esc(b.nick)}</b></div>
      <p class="fl-card-st"><span title="${t('streakT')}">${t('streak', b.streak)}</span><span title="${t('worksT')}">🎨 ${b.works}</span><span title="${t('feathersT')}">🪶 ${b.feathers}</span></p>`;
    if (window.PPBirds) a.querySelector('.fl-card-ava').replaceWith(window.PPBirds.avatar(b.id, b.avatar, 44));
    if (b.room) { const rm = a.querySelector('.fl-card-room'); rm._room = b; if (io) io.observe(rm); else if (window.PPRoom) window.PPRoom.mount(rm, { id: b.id, nick: b.nick, avatar: b.avatar, room: b.room, still: true }); }
    return a;
  };

  async function load(reset) {
    if (busy && !reset) return;
    const my = reset ? ++gen : gen;
    if (reset) { next = 0; more = false; }
    busy = true;
    const u = new URLSearchParams({ sort, offset: next }); if (q) u.set('q', q); if (bird) u.set('bird', bird);
    let d;
    try { d = await fetch('/api/birds?' + u).then(r => r.ok ? r.json() : Promise.reject()); }
    catch (e) { if (my === gen) { busy = false; msg.hidden = false; msg.textContent = t('err'); } return; }
    if (my !== gen) return; // пока грузилось, сменили сортировку или поиск
    busy = false;
    if (reset) grid.innerHTML = '';
    total.textContent = q ? t('count', d.total) + ' · ' + t('found', d.found) : t('count', d.total);
    d.birds.forEach(b => grid.appendChild(card(b)));
    next = d.next; more = d.more;
    msg.hidden = !!grid.children.length; msg.textContent = q ? t('none') : '';
    if (more) check();
  }
  // подгрузка при прокрутке: «полоска» под сеткой дошла до экрана
  const tail = box.querySelector('.fl-more');
  const check = () => { if (more && !busy && tail.getBoundingClientRect().top < innerHeight + 600) load(); };
  if ('IntersectionObserver' in window) new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) check(); }, { rootMargin: '600px' }).observe(tail);
  addEventListener('scroll', check, { passive: true });
  const go = () => { if (window.PPBirds && window.PPRoom) load(true); else setTimeout(go, 100); };
  go();
})();
