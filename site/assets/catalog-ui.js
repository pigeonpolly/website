// Каталог вещей: плитка, вкладки, чипы, переключатель; режим «сумка» (профиль птички).
// Магазин и карточки потом берут отсюда же (PPCatalog.tile / tabs / chips / grid).
(() => {
  const LANG = /\/admin\//.test(location.pathname) || document.documentElement.lang === 'ru' ? 1 : document.documentElement.lang === 'lv' ? 2 : 0; // кабинет — всегда по-русски
  const tr = a => a[LANG] != null ? a[LANG] : a[0];
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const BIRD_KINDS = ['hat', 'item', 'shoes', 'scarf', 'bg', 'frame', 'anim'], ROOM_KINDS = ['furn', 'deco', 'wall', 'floor', 'view', 'curtain'];
  const FIXED = ['wall', 'floor', 'view', 'curtain']; // в комнате по одной: выбранные обои, пол, вид, шторы
  // вид вещи одним словом — мелко под названием
  const KIND = {
    hat: ['hat', 'шапка', 'cepure'], item: ['in the beak', 'в клюв', 'knābī'], shoes: ['shoes', 'обувь', 'apavi'], scarf: ['scarf', 'шарфик', 'šallīte'],
    bg: ['background', 'фон', 'fons'], frame: ['frame', 'рамка', 'rāmis'], anim: ['animation', 'анимация', 'animācija'],
    furn: ['furniture', 'мебель', 'mēbele'], deco: ['decoration', 'украшение', 'rotājums'], wall: ['wallpaper', 'обои', 'tapetes'],
    any: ['surprise', 'сюрприз', 'pārsteigums'], floor: ['floor', 'пол', 'grīda'], view: ['window view', 'вид из окна', 'skats pa logu'], curtain: ['curtains', 'шторы', 'aizkari'],
  };
  const kindLabel = k => KIND[k] ? tr(KIND[k]) : k;
  const kindsLabel = k => { const e = window.PPBirds && window.PPBirds.GIFT_KINDS.find(x => x[0] === k); return e ? tr(e[1]) : kindLabel(k); };
  const isRoom = k => ROOM_KINDS.includes(k);

  // картинка вещи на светлом квадрате, ~75 %; рамки, фоны и анимации — птичка с этим эффектом
  function pic(kind, v, id, size) {
    const B = window.PPBirds, w = document.createElement('span'); w.className = 'cat-pic';
    if (!B) return w;
    if (['bg', 'frame', 'anim'].includes(kind)) { w.classList.add('ava'); w.appendChild(B.avatar(id || 2, { [kind]: v }, Math.round(size * .75))); }
    else w.appendChild(B.itemIcon(kind, v, size, id));
    return w;
  }

  // меню «⋯»: одно открытое на странице
  let openMenu = null;
  const closeMenu = () => { if (openMenu) { openMenu.remove(); openMenu = null; } };
  document.addEventListener('click', e => { if (openMenu && !e.target.closest('.cat-menu, .cat-more')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('scroll', closeMenu, { passive: true }); // на прокрутке меню не висит над комнатой
  function showMenu(tile, items) {
    closeMenu();
    const m = document.createElement('div'); m.className = 'cat-menu'; m.setAttribute('role', 'menu');
    items.forEach(it => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'menuitem'); b.textContent = it.label; b.onclick = e => { e.stopPropagation(); closeMenu(); it.on(); }; m.appendChild(b); });
    tile.appendChild(m); openMenu = m;
    if (m.getBoundingClientRect().left < 8) m.classList.add('left'); // крайняя левая плитка — меню вправо, не за край экрана
    m.querySelector('button').focus({ preventScroll: true });
  }

  // плитка: картинка, название (≤ 2 строки), вид; отметка слева сверху, «⋯» справа сверху
  // o = { kind, item, name, legend, mark, markOn, menu: [{label, on}], onUse, id, size, title,
  //       price — подпись цены внизу (магазин), badges: [[текст, класс]] — значки сверху слева, pressed — выбрана (режим выбора), off — нельзя (тусклая), dim — нет в наличии }
  function tile(o) {
    const el = document.createElement('div');
    el.className = 'cat-tile' + (o.legend ? ' cat-leg' : '') + (o.markOn ? ' on' : '') + (o.pressed ? ' sel' : '') + (o.off ? ' off' : '') + (o.dim ? ' dim' : '');
    el.innerHTML = `<button type="button" class="cat-main"${o.title ? ` title="${esc(o.title)}"` : ''}${o.pressed != null ? ` aria-pressed="${!!o.pressed}"` : ''}><span class="cat-pic-slot"></span>
      <span class="cat-name">${esc(o.name)}</span><span class="cat-kind">${esc(kindLabel(o.kind))}</span>${o.price ? `<span class="cat-price">${esc(o.price)}</span>` : ''}</button>
      ${o.mark ? `<span class="cat-mark${o.markOn ? ' on' : ''}">${esc(o.mark)}</span>` : ''}${o.legend ? '<span class="cat-star" aria-hidden="true">★</span>' : ''}
      ${o.badges && o.badges.length ? `<span class="cat-badges">${o.badges.map(b => `<span class="cat-badge ${esc(b[1] || '')}">${esc(b[0])}</span>`).join('')}</span>` : ''}
      ${o.menu && o.menu.length ? `<button type="button" class="cat-more" aria-haspopup="menu" aria-label="${esc(tr(['More', 'Ещё', 'Vēl']))}">⋯</button>` : ''}`;
    el.querySelector('.cat-pic-slot').replaceWith(pic(o.kind, o.item, o.id, o.size || 96));
    const main = el.querySelector('.cat-main');
    let longT = 0, longDone = false;
    main.onclick = () => { if (longDone) { longDone = false; return; } o.onUse && o.onUse(); };
    if (o.menu && o.menu.length) {
      const open = () => showMenu(el, o.menu);
      el.querySelector('.cat-more').onclick = e => { e.stopPropagation(); openMenu && openMenu.parentNode === el ? closeMenu() : open(); };
      // телефон: долгое нажатие — то же меню
      main.addEventListener('touchstart', () => { longDone = false; clearTimeout(longT); longT = setTimeout(() => { longDone = true; open(); if (navigator.vibrate) navigator.vibrate(15); }, 500); }, { passive: true });
      ['touchend', 'touchmove', 'touchcancel'].forEach(ev => main.addEventListener(ev, () => clearTimeout(longT), { passive: true }));
      main.addEventListener('contextmenu', e => { e.preventDefault(); if (!longDone) open(); });
    }
    return el;
  }

  const grid = tiles => { const g = document.createElement('div'); g.className = 'cat-grid'; tiles.forEach(t => g.appendChild(t)); return g; };
  // вкладки: [{v, label, n}]
  function tabs(list, cur, pick) {
    const el = document.createElement('div'); el.className = 'cat-tabs'; el.setAttribute('role', 'tablist');
    el.innerHTML = list.map(x => `<button type="button" role="tab" data-v="${esc(x.v)}" aria-selected="${x.v === cur}">${esc(x.label)}${x.n != null ? ` <b>${x.n}</b>` : ''}</button>`).join('');
    el.querySelectorAll('button').forEach(b => b.onclick = () => pick(b.dataset.v));
    return el;
  }
  // мелкие чипы-виды: [{v, label}]
  function chips(list, cur, pick) {
    const el = document.createElement('div'); el.className = 'cat-chips';
    el.innerHTML = list.map(x => `<button type="button" data-v="${esc(x.v)}" aria-pressed="${x.v === cur}">${esc(x.label)}</button>`).join('');
    el.querySelectorAll('button').forEach(b => b.onclick = () => pick(b.dataset.v));
    return el;
  }
  function toggle(label, on, change) {
    const el = document.createElement('label'); el.className = 'cat-toggle';
    el.innerHTML = `<input type="checkbox"${on ? ' checked' : ''}><span class="cat-sw" aria-hidden="true"></span>${esc(label)}`;
    el.querySelector('input').onchange = e => change(e.target.checked);
    return el;
  }

  // ---------- режим «сумка» ----------
  // o = { items: [{kind, item, n, u, legend, gid}], id, state, sell (цена или null), cards (число или null — вкладка появится с карточками),
  //       onUse(g), onGive(g), onSell(g), onMore(g), cardsInto(box), empty, top,
  //       undo: { can(), run() } — кнопка «↶ Отменить»; shopUrl(tab, kind) — плитка «＋ в магазин»; shopCount(kind) — сколько таких вещей в продаже (для пустого вида) }
  function bag(box, o) {
    const S = o.state || (o.state = {});
    S.tab = S.tab || 'all'; S.kind = S.kind || '';
    const draw = () => {
      closeMenu();
      const all = o.items, bird = all.filter(g => !isRoom(g.kind)), room = all.filter(g => isRoom(g.kind));
      box.innerHTML = ''; box.classList.add('cat-bag');
      if (o.top) box.insertAdjacentHTML('beforeend', o.top);
      if (!all.length && o.cards == null) { box.insertAdjacentHTML('beforeend', `<p class="bag-empty">${esc(o.empty || '')}</p>`); return; }
      box.insertAdjacentHTML('beforeend', `<p class="cat-hint">${esc(tr(['Tap a thing — it goes straight onto your bird or into the room', 'Нажми на вещь — она сразу на птичке или в комнате', 'Pieskaries lietai — tā uzreiz būs uz putniņa vai istabā']))}</p>`);
      const head = document.createElement('div'); head.className = 'cat-head';
      const tl = [{ v: 'all', label: tr(['All', 'Всё', 'Viss']), n: all.length }, { v: 'bird', label: tr(['For the bird', 'Птичке', 'Putniņam']), n: bird.length }, { v: 'room', label: tr(['For the room', 'Комнате', 'Istabai']), n: room.length }];
      if (o.cards != null) tl.push({ v: 'cards', label: tr(['Cards', 'Карточки', 'Kartītes']), n: o.cards });
      if (!tl.some(x => x.v === S.tab)) S.tab = 'all';
      head.appendChild(tabs(tl, S.tab, v => { S.tab = v; S.kind = ''; draw(); }));
      if (S.tab !== 'cards') head.appendChild(toggle(tr(['Only unused', 'Только неиспользуемые', 'Tikai neizmantotās']), !!S.free, v => { S.free = v; draw(); }));
      if (o.undo) { // последнее «надеть / поставить» — назад
        const u = document.createElement('button'); u.type = 'button'; u.className = 'cat-undo'; u.textContent = '↶ ' + tr(['Undo', 'Отменить', 'Atsaukt']);
        u.disabled = !o.undo.can(); u.onclick = async () => { u.disabled = true; await o.undo.run(); draw(); }; head.appendChild(u);
      }
      box.appendChild(head);
      if (S.tab === 'cards') { const c = document.createElement('div'); box.appendChild(c); o.cardsInto && o.cardsInto(c); return; }
      const group = S.tab === 'bird' ? bird : S.tab === 'room' ? room : null;
      if (group) { // все виды группы — и пустые: в пустом виде подсказка про магазин
        const ks = (S.tab === 'bird' ? BIRD_KINDS : ROOM_KINDS).filter(k => o.shopUrl || group.some(g => g.kind === k));
        if (ks.length > 1) box.appendChild(chips([{ v: '', label: tr(['All', 'Все', 'Visas']) }, ...ks.map(k => ({ v: k, label: kindsLabel(k) }))], S.kind, v => { S.kind = v; draw(); }));
      }
      if (group && S.kind && o.shopUrl && !group.some(g => g.kind === S.kind)) { // пустой вид: «В магазине есть N таких вещей →»
        const n = o.shopCount ? o.shopCount(S.kind) : null, a = document.createElement('a'); a.className = 'cat-toshop'; a.href = o.shopUrl(S.tab, S.kind);
        a.textContent = n ? tr([`The shop has ${n} things like this: ${kindsLabel(S.kind).toLowerCase()} →`, `В магазине есть ${n} таких вещей: ${kindsLabel(S.kind).toLowerCase()} →`, `Veikalā ir ${n} tādas lietas: ${kindsLabel(S.kind).toLowerCase()} →`])
          : tr([`Look for ${kindsLabel(S.kind).toLowerCase()} in the shop →`, `Поискать в магазине: ${kindsLabel(S.kind).toLowerCase()} →`, `Meklēt veikalā: ${kindsLabel(S.kind).toLowerCase()} →`]);
        box.insertAdjacentHTML('beforeend', `<p class="bag-empty">${esc(tr(['Nothing of this kind yet.', 'Такого пока нет.', 'Tāda pagaidām nav.']))}</p>`); box.appendChild(a); return;
      }
      const ok = g => (!S.free || g.u < g.n) && (!S.kind || g.kind === S.kind);
      // сначала неиспользуемые, потом частично, потом всё в деле
      const rank = g => g.u === 0 ? 0 : g.u < g.n ? 1 : 2;
      const sorted = list => list.filter(ok).map((g, i) => [g, i]).sort((a, b) => rank(a[0]) - rank(b[0]) || a[1] - b[1]).map(x => x[0]);
      const shelves = group ? [[null, sorted(group)]] : [[tr(['For the bird', 'Птичке', 'Putniņam']), sorted(bird)], [tr(['For the room', 'Комнате', 'Istabai']), sorted(room)]];
      const B = window.PPBirds, L = LANG;
      const grids = [];
      let any = false;
      for (const [title, list] of shelves) {
        if (!list.length) continue; any = true;
        if (title) box.insertAdjacentHTML('beforeend', `<h4 class="cat-shelf">${esc(title)}</h4>`);
        const g = grid([]); box.appendChild(g); grids.push([g, list]);
      }
      if (!any) { box.insertAdjacentHTML('beforeend', `<p class="bag-empty">${esc(tr(['Nothing here with these filters.', 'С такими фильтрами ничего нет.', 'Ar šiem filtriem nekā nav.']))}</p>`); return; }
      // размер картинки — по ширине колонки, чтобы вещи были одного масштаба
      const probe = document.createElement('div'); probe.className = 'cat-tile'; probe.style.visibility = 'hidden'; grids[0][0].appendChild(probe);
      const size = Math.max(64, Math.round(probe.getBoundingClientRect().width - 12)); probe.remove();
      for (const [g, list] of grids) for (const it of list) {
        const mark = it.u > 0 ? (it.n > 1 ? `✓ ${it.u}/${it.n}` : '✓') : it.n > 1 ? `×${it.n}` : '';
        const menu = [];
        if (!it.legend && o.onGive) menu.push({ label: '🎁 ' + tr(['Give', 'Подарить', 'Uzdāvināt']), on: () => o.onGive(it) });
        if (o.sell != null && o.onSell) menu.push({ label: '💰 ' + tr([`Sell for ${o.sell} 🔘`, `Продать за ${o.sell} 🔘`, `Pārdot par ${o.sell} 🔘`]), on: () => o.onSell(it) });
        if (o.onMore) menu.push({ label: 'ℹ️ ' + tr(['Details', 'Подробнее', 'Sīkāk']), on: () => o.onMore(it) });
        const used = it.u > 0, room = isRoom(it.kind);
        g.appendChild(tile({ kind: it.kind, item: it.item, name: B.giftName(it.kind, it.item, L), legend: it.legend, mark, markOn: used, menu, id: o.id, size,
          title: room ? tr(['Put it in the room', 'Поставить в комнату', 'Novietot istabā']) : used ? tr(['Take it off', 'Снять', 'Novilkt']) : tr(['Put it on', 'Надеть', 'Uzvilkt']),
          onUse: () => o.onUse && o.onUse(it) }));
      }
      // в конце ленты — «＋ в магазин» (магазин с этим видом)
      if (o.shopUrl) for (const [g, list] of grids) {
        const k = S.kind || '', tab = S.tab === 'all' ? (isRoom(list[0].kind) ? 'room' : 'bird') : S.tab;
        const a = document.createElement('a'); a.className = 'cat-tile cat-plus'; a.href = o.shopUrl(tab, k);
        a.innerHTML = `<span class="cat-plus-in"><b aria-hidden="true">＋</b>${esc(tr(['to the shop', 'в магазин', 'uz veikalu']))}</span>`; g.appendChild(a);
      }
      box.insertAdjacentHTML('beforeend', `<p class="cat-legend">${esc(tr([
        '✓ worn or in the room · 1/3 — how many are in use · ×2 — copies · ★ legendary · ⋯ give, sell, details',
        '✓ надето или в комнате · 1/3 — сколько в деле · ×2 — копии · ★ легендарная · ⋯ подарить, продать, подробнее',
        '✓ uzvilkts vai istabā · 1/3 — cik izmanto · ×2 — kopijas · ★ leģendāra · ⋯ dāvināt, pārdot, sīkāk']))}</p>`);
    };
    draw();
    return { draw, box };
  }

  // где вещь сейчас: надета / стоит в комнате (сколько штук), сколько всего — для сумки
  function usage(kind, item, n, avatar, room) {
    room = room || {};
    if (!isRoom(kind)) return avatar && avatar[kind] === item ? 1 : 0;
    if (FIXED.includes(kind)) return room[kind] === item ? 1 : 0;
    return Math.min(n, (room.items || []).filter(it => it.k === kind && it.v === item).length);
  }

  // ---------- «нажал — появилось» (этап 5 Б; в этап 6 переехало сюда из sketch-wall.js — нужно и магазину) ----------
  // Вещь для комнаты — в свою комнату на странице (PPRoom.live; нет её — в профиль с #use=), вещь птички — надеть / снять. Тост с «Отменить» (5 с).
  // o = { me (птичка: avatar, gifts, nick), after() }. Возвращает отмену (функцию) или null; последняя отмена — PPCatalog.lastUndo
  const pre = ['', '/ru', '/lv'][LANG];
  const profileUrl = nick => `${pre}/bird/?nick=${encodeURIComponent(nick)}`;
  const ERR = ['Something went wrong, please try again.', 'Не получилось, попробуйте ещё раз.', 'Neizdevās, mēģini vēlreiz.'];
  async function use(kind, item, o = {}) {
    const B = window.PPBirds, me = o.me || {};
    const say = (msg, undo) => window.PPToast && window.PPToast(msg, undo ? { action: tr(['Undo', 'Отменить', 'Atsaukt']), onAction: undo, ms: 5000 } : {});
    const keep = undo => { api.lastUndo = undo || null; return undo || null; };
    if (isRoom(kind)) {
      const R = window.PPRoom && window.PPRoom.live;
      if (!R || !R.box.isConnected) { if (me.nick) location.href = profileUrl(me.nick) + '#use=' + encodeURIComponent(kind + '|' + item); return null; }
      const own = (me.gifts || []).filter(x => x.status === 'bag' && x.kind === kind && x.item === item).length;
      const r = R.use(kind, item, own); if (!r) return null;
      const bx = R.box.getBoundingClientRect(); if (bx.bottom < 80 || bx.top > innerHeight - 120) R.box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (r.done === 'there') { say(tr(['Already in the room — here it is', 'Уже в комнате — вот она', 'Jau istabā — lūk, tā'])); return null; }
      const undo = () => { r.undo(); if (o.after) o.after(); };
      say(r.done === 'off' ? tr(['Back to the old one', 'Вернули прежнее', 'Atgriezts iepriekšējais']) : tr(['Placed', 'Поставлено', 'Novietots']), undo);
      return keep(undo);
    }
    const prev = (me.avatar || {})[kind] || null, on = prev === item;
    const set = async v => {
      const r = await fetch('/api/avatar', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ kind, item: v }) });
      const d = await r.json().catch(() => ({})); if (!r.ok) throw new Error(d.error || r.status);
      me.avatar = d.avatar; if (window.PPRoom && window.PPRoom.live && window.PPRoom.live.dress) window.PPRoom.live.dress(d.avatar);
      window.PPAccount && window.PPAccount.check(); if (o.after) o.after();
    };
    try { await set(on ? null : item); } catch (e) { alert(tr(ERR)); return null; }
    const undo = () => set(prev).catch(() => alert(tr(ERR)));
    say(on ? tr(['Taken off', 'Снято', 'Novilkts']) : tr(['Put on', 'Надето', 'Uzvilkts']), undo);
    return keep(undo);
  }

  // ---------- окно (вещи, фильтров) ----------
  function dialog(cls, html) {
    const d = document.createElement('dialog'); d.className = 'cat-dlg ' + (cls || '');
    d.innerHTML = `<button type="button" class="cat-x" aria-label="${esc(tr(['Close', 'Закрыть', 'Aizvērt']))}">✕</button>${html || ''}`;
    d.querySelector('.cat-x').onclick = () => d.close();
    d.addEventListener('click', e => { if (e.target === d) d.close(); });
    d.addEventListener('close', () => d.remove());
    document.body.appendChild(d); d.showModal();
    return d;
  }
  // окно вещи: примерка (на птичке или в комнате — вещь на свободном месте), строки о вещи, одна кнопка
  // o = { kind, item, me, lines: [текст], note, badges: [[текст, класс]], action: { label, on(btn, d), disabled } }
  function itemWindow(o) {
    const B = window.PPBirds, me = o.me || null, room = isRoom(o.kind), sur = o.item === '?' || o.kind === 'any';
    const d = dialog('cat-item', `<div class="cat-item-in"><figure class="cat-try"><div class="cat-try-box"></div><figcaption></figcaption></figure>
      <div class="cat-item-tx"><h3>${o.legend ? '<span class="cat-item-star">★</span> ' : ''}${esc(B.giftName(o.kind, o.item, LANG))}</h3><p class="cat-item-kind">${esc(kindsLabel(o.kind))}</p>
      ${o.badges && o.badges.length ? `<p class="cat-badges cat-item-badges">${o.badges.map(b => `<span class="cat-badge ${esc(b[1] || '')}">${esc(b[0])}</span>`).join('')}</p>` : ''}
      <ul class="cat-item-lines">${(o.lines || []).filter(Boolean).map(l => `<li>${esc(l)}</li>`).join('')}</ul>
      ${o.note ? `<p class="cat-item-note">${esc(o.note)}</p>` : ''}<div class="cat-item-act"></div></div></div>`);
    const tb = d.querySelector('.cat-try-box'), cap = d.querySelector('.cat-try figcaption');
    if (sur) { tb.appendChild(pic(o.kind, o.item, me ? me.id : 2, 180)); cap.textContent = tr(['A random thing you don’t have yet', 'Случайная вещь, которой у тебя ещё нет', 'Nejauša lieta, kuras tev vēl nav']); }
    else if (room && window.PPRoom) { // своя комната (у гостя — пустая) с этой вещью на свободном месте
      tb.classList.add('room-try');
      const rm = JSON.parse(JSON.stringify((me && me.room) || {}));
      try { const R = window.PPRoom.mount(tb, { id: me ? me.id : 2, nick: me ? me.nick || '' : '', avatar: me ? me.avatar : {}, room: rm, preview: true }); setTimeout(() => R.use(o.kind, o.item, 99), 250); } catch (e) { tb.appendChild(pic(o.kind, o.item, 2, 180)); }
      cap.textContent = me ? tr(['In your room', 'В твоей комнате', 'Tavā istabā']) : tr(['In a room', 'В комнате', 'Istabā']);
    } else {
      const a = B.avatar(me ? me.id : 2, Object.assign({}, me ? me.avatar : {}, { [o.kind]: o.item }), 180); a.classList.add('cat-try-ava'); tb.appendChild(a);
      cap.textContent = me ? tr(['On your bird', 'На твоей птичке', 'Uz tava putniņa']) : tr(['On a bird', 'На птичке', 'Uz putniņa']);
    }
    if (o.action) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'cta-btn cat-item-btn'; b.textContent = o.action.label; b.disabled = !!o.action.disabled;
      b.onclick = () => o.action.on(b, d); d.querySelector('.cat-item-act').appendChild(b);
      if (!b.disabled) setTimeout(() => b.focus(), 0);
    }
    return d;
  }

  // ---------- общий каталог (этап 6): магазин, адвент-окно и подарки в кабинете ----------
  // все вещи: [kind, item], «🎲 Сюрприз» первым в каждой категории
  const allEntries = () => { const B = window.PPBirds; return B.GIFT_KINDS.flatMap(k => (B.withSurprise ? B.withSurprise(k[0]) : B.GIFTS[k[0]] || []).map(v => [k[0], v])); };
  const grpOf = k => k === 'any' ? 'any' : isRoom(k) ? 'room' : 'bird';
  const isSur = (k, v) => v === '?' || k === 'any';
  // цена: [значение, подпись, от, до (не включая)]
  const PRICES = [['', ['Any price', 'Любая цена', 'Jebkura cena'], 0, 1e9], ['0-30', ['up to 30 🔘', 'до 30 🔘', 'līdz 30 🔘'], 0, 31], ['30-60', ['30–60 🔘', '30–60 🔘', '30–60 🔘'], 30, 61], ['60-120', ['60–120 🔘', '60–120 🔘', '60–120 🔘'], 60, 121], ['120-300', ['120–300 🔘', '120–300 🔘', '120–300 🔘'], 120, 301], ['300-', ['300 🔘 and more', 'от 300 🔘', 'no 300 🔘'], 300, 1e9]];
  const SORTS = [['kind', ['By category', 'По видам', 'Pēc veida']], ['new', ['Newest first', 'Сначала новые', 'Jaunākās vispirms']], ['cheap', ['Cheapest first', 'Сначала дешёвые', 'Lētākās vispirms']], ['dear', ['Most expensive first', 'Сначала дорогие', 'Dārgākās vispirms']]];
  const TAB_L = { all: ['All', 'Всё', 'Viss'], bird: ['For the bird', 'Птичке', 'Putniņam'], room: ['For the room', 'Комнате', 'Istabai'], cards: ['Cards', 'Карточки', 'Kartītes'], any: ['Surprises', 'Сюрпризы', 'Pārsteigumi'] };

  // o = { mode: 'shop' | 'pick', state, save(S), id, entries() → [[k, v]],
  //       tile(k, v) → доп. поля плитки, onOpen(k, v, плитка) — нажатие,
  //       price(k, v) → цена (фильтр и порядок «Цена»), added(k, v) → когда появилась (порядок «сначала новые»),
  //       mine(k, v) → есть ли (фильтр «что у меня есть»), mineLabel, notMineLabel,
  //       afford(k, v) → хватает ли пуговок (переключатель «💰 Хватает пуговок» — только магазин),
  //       cant(k, v) → причина, почему нельзя ('' — можно): такие скрыты, в «Фильтрах» — «Показать то, что нельзя»,
  //       rest: { title, test(k, v) } — блок внизу, свёрнутый (магазин: «Нет в наличии»),
  //       cardsInto(box) — вкладка «Карточки», empty(S) → текст, когда пусто, lead — строка над списком,
  //       pick: { multi, has(k, v) } — режим выбора: выбранные вещи отмечены }
  function browse(box, o) {
    const S = o.state || (o.state = {});
    const TABS = ['all', 'bird', 'room', ...(o.cardsInto ? ['cards'] : []), 'any'];
    if (!TABS.includes(S.tab)) S.tab = 'all';
    if (!SORTS.some(x => x[0] === S.sort)) S.sort = 'kind';
    if (S.q == null) S.q = '';
    const save = () => o.save && o.save(S);
    box.innerHTML = ''; box.classList.add('cat-browse');
    const top = document.createElement('div'); top.className = 'cat-top';
    const tabBox = document.createElement('div'); tabBox.className = 'cat-tabs-row';
    const list = document.createElement('div'); list.className = 'cat-list';
    box.append(top, tabBox, list);
    let fBtn = null, drawer = null;
    const nFilters = () => (S.kind ? 1 : 0) + (S.theme ? 1 : 0) + (S.price ? 1 : 0) + (S.sort !== 'kind' ? 1 : 0) + (S.show ? 1 : 0) + (S.cantShow ? 1 : 0);
    const fLabel = () => tr(['Filters', 'Фильтры', 'Filtri']) + (nFilters() ? ' · ' + nFilters() : '');

    function drawTop() {
      top.innerHTML = '';
      const q = document.createElement('input'); q.type = 'search'; q.className = 'cat-q'; q.value = S.q;
      q.placeholder = '🔍 ' + tr(['Search by name…', 'Поиск по названию…', 'Meklēt pēc nosaukuma…']); q.setAttribute('aria-label', tr(['Find', 'Найти', 'Meklēt']));
      q.oninput = () => { S.q = q.value; drawList(); }; top.appendChild(q);
      if (o.afford) {
        const a = toggle(tr(['💰 I can afford', '💰 Хватает пуговок', '💰 Pietiek pogu']), !!S.afford, v => { S.afford = v; save(); drawList(); });
        a.title = tr(['Only things you have enough buttons for and can still buy', 'Только вещи, на которые хватает пуговок и которые ещё можно купить', 'Tikai lietas, kurām pietiek pogu un kuras vēl var nopirkt']); a.classList.add('cat-afford'); top.appendChild(a);
      }
      fBtn = document.createElement('button'); fBtn.type = 'button'; fBtn.className = 'cat-fbtn'; fBtn.setAttribute('aria-haspopup', 'dialog');
      fBtn.textContent = fLabel(); fBtn.classList.toggle('on', nFilters() > 0); fBtn.onclick = openFilters; top.appendChild(fBtn);
    }
    function drawTabs() {
      tabBox.innerHTML = '';
      const t = tabs(TABS.map(v => ({ v, label: tr(TAB_L[v]) })), S.tab, v => { if (v === S.tab) return; S.tab = v; S.kind = ''; save(); if (o.onTab) o.onTab(v); drawTabs(); drawList(); });
      t.classList.add('cat-tabs-big'); tabBox.appendChild(t);
      top.hidden = S.tab === 'cards';
    }
    // выезжающая панель «Фильтры»: вид, тема, цена, порядок, что у меня есть
    function openFilters() {
      if (drawer) return;
      const d = document.createElement('dialog'); d.className = 'cat-drawer'; drawer = d;
      const B = window.PPBirds;
      const fill = () => {
        d.innerHTML = `<div class="cat-drawer-in"><div class="cat-drawer-h"><h3>${esc(tr(['Filters', 'Фильтры', 'Filtri']))}</h3><button type="button" class="cat-x" aria-label="${esc(tr(['Close', 'Закрыть', 'Aizvērt']))}">✕</button></div><div class="cat-drawer-body"></div>
          <div class="cat-drawer-foot"><button type="button" class="pill-btn cat-reset">${esc(tr(['✕ Reset', '✕ Сбросить', '✕ Notīrīt']))}</button><button type="button" class="cta-btn cat-done"></button></div></div>`;
        const body = d.querySelector('.cat-drawer-body');
        const sec = (title, el) => { const s = document.createElement('section'); s.className = 'cat-fsec'; s.innerHTML = `<h4>${esc(title)}</h4>`; s.appendChild(el); body.appendChild(s); };
        const set = (f, v) => { S[f] = v; save(); fill(); drawList(); drawTop(); };
        if (S.tab === 'bird' || S.tab === 'room' || S.tab === 'all') {
          const ks = B.GIFT_KINDS.map(k => k[0]).filter(k => k !== 'any' && (S.tab === 'all' || grpOf(k) === S.tab));
          sec(tr(['What', 'Что', 'Kas']), chips([{ v: '', label: tr(['Any', 'Любое', 'Jebkas']) }, ...ks.map(k => ({ v: k, label: kindsLabel(k) }))], S.kind || '', v => set('kind', v)));
        }
        const th = B.GIFT_THEMES.filter(t => t[0] !== 'surprise');
        sec(tr(['Theme', 'Тема', 'Tēma']), chips([{ v: '', label: tr(['Any theme', 'Любая тема', 'Jebkura tēma']) }, ...th.map(t => ({ v: t[0], label: tr(t[1]) }))], S.theme || '', v => set('theme', v)));
        if (o.price) sec(tr(['Price', 'Цена', 'Cena']), chips(PRICES.map(r => ({ v: r[0], label: tr(r[1]) })), S.price || '', v => set('price', v)));
        sec(tr(['Order', 'Порядок', 'Secība']), chips(SORTS.filter(r => (r[0] !== 'cheap' && r[0] !== 'dear') || o.price).filter(r => r[0] !== 'new' || o.added).map(r => ({ v: r[0], label: tr(r[1]) })), S.sort, v => set('sort', v)));
        if (o.mine) {
          const sh = [{ v: '', label: tr(['Everything', 'Всё', 'Visu']) }, { v: 'mine', label: o.mineLabel || tr(['🎒 What I have', '🎒 Что у меня есть', '🎒 Kas man ir']) }];
          if (o.notMineLabel) sh.push({ v: 'not', label: o.notMineLabel });
          sec(tr(['Show', 'Показать', 'Rādīt']), chips(sh, S.show || '', v => set('show', v)));
        }
        if (o.cant) { const w = document.createElement('div'); w.appendChild(toggle(tr(['Show what is not allowed', 'Показать то, что нельзя', 'Rādīt to, kas nav atļauts']), !!S.cantShow, v => set('cantShow', v))); sec(tr(['Not allowed', 'Нельзя', 'Nav atļauts']), w); }
        const n = filtered().filter(kv => !o.rest || !o.rest.test(kv[0], kv[1])).length; // без «нет в наличии» — как в счётчике над списком
        d.querySelector('.cat-done').textContent = tr([`Show ${n}`, `Показать ${n}`, `Rādīt ${n}`]);
        d.querySelector('.cat-done').onclick = () => d.close();
        d.querySelector('.cat-x').onclick = () => d.close();
        d.querySelector('.cat-reset').onclick = () => { S.kind = ''; S.theme = ''; S.price = ''; S.sort = 'kind'; S.show = ''; S.cantShow = false; S.q = ''; save(); fill(); drawTop(); drawList(); };
      };
      fill();
      d.addEventListener('click', e => { if (e.target === d) d.close(); });
      d.addEventListener('close', () => { d.remove(); drawer = null; if (fBtn) fBtn.focus({ preventScroll: true }); });
      document.body.appendChild(d); d.showModal(); requestAnimationFrame(() => d.classList.add('open'));
    }
    // что видно: вкладка, вид, тема, поиск, цена, «что у меня есть», «хватает пуговок», «что нельзя»
    function filtered() {
      const B = window.PPBirds, q = (S.q || '').trim().toLowerCase(), pr = PRICES.find(r => r[0] === S.price) || PRICES[0];
      const theme = S.theme ? B.GIFT_THEMES.find(t => t[0] === S.theme) : null, thSet = theme && new Set(theme[2]);
      return (o.entries || allEntries)().filter(([k, v]) => {
        if (S.tab === 'any' ? !isSur(k, v) : S.tab !== 'all' && (k === 'any' || grpOf(k) !== S.tab)) return false;
        if (S.kind && S.kind !== k) return false;
        if (thSet && !thSet.has(k + '|' + v)) return false;
        if (q && B.giftName(k, v, LANG).toLowerCase().indexOf(q) < 0 && kindsLabel(k).toLowerCase().indexOf(q) < 0) return false;
        if (S.price && o.price) { const p = o.price(k, v); if (p == null || p < pr[2] || p >= pr[3]) return false; }
        if (S.show === 'mine' && o.mine && !o.mine(k, v)) return false;
        if (S.show === 'not' && o.mine && o.mine(k, v)) return false;
        if (S.afford && o.afford && !o.afford(k, v)) return false;
        if (!S.cantShow && o.cant && o.cant(k, v)) return false;
        return true;
      });
    }
    // список: по видам (с заголовками) или одной лентой; плитки дорисовываются по мере прокрутки
    function rows(items) {
      const B = window.PPBirds;
      if (S.sort === 'kind') {
        const shelves = S.tab !== 'any' && !S.kind && new Set(items.map(x => x[0])).size > 1;
        if (!shelves) return items.map(kv => ({ kv }));
        const out = []; let last = '';
        items.forEach(kv => { if (kv[0] !== last) { last = kv[0]; out.push({ h: (B.GIFT_KINDS.find(x => x[0] === kv[0]) || [0, [kv[0]]])[1] }); } out.push({ kv }); });
        return out;
      }
      const order = new Map(items.map((kv, i) => [kv[0] + '|' + kv[1], i])), ix = kv => order.get(kv[0] + '|' + kv[1]);
      const p = kv => (o.price && o.price(kv[0], kv[1])) || 0, ad = kv => (o.added && o.added(kv[0], kv[1])) || 0;
      const sorted = items.slice().sort(S.sort === 'cheap' ? (a, b) => p(a) - p(b) || ix(a) - ix(b) : S.sort === 'dear' ? (a, b) => p(b) - p(a) || ix(a) - ix(b) : (a, b) => ad(b) - ad(a) || ix(b) - ix(a));
      return sorted.map(kv => ({ kv }));
    }
    let tileSize = 96;
    const makeTile = ([k, v]) => {
      const B = window.PPBirds, extra = o.tile ? o.tile(k, v) || {} : {}, cant = o.cant ? o.cant(k, v) : '';
      const t = tile(Object.assign({ kind: k, item: v, name: B.giftName(k, v, LANG), legend: !!(B.LEGEND && B.LEGEND.has(k + '|' + v)), id: o.id, size: tileSize,
        pressed: o.pick ? !!o.pick.has(k, v) : undefined, off: cant || '', title: cant || undefined, onUse: () => { if (!cant && o.onOpen) o.onOpen(k, v, t); } }, extra));
      return t;
    };
    function fill(container, rs) {
      let i = 0, g = null, io = null;
      const step = () => {
        const end = Math.min(rs.length, i + 60);
        for (; i < end; i++) {
          const r = rs[i];
          if (r.h) { const h = document.createElement('h4'); h.className = 'cat-shelf'; h.textContent = tr(r.h); container.appendChild(h); g = null; continue; }
          if (!g) { g = grid([]); container.appendChild(g); }
          g.appendChild(makeTile(r.kv));
        }
        if (i < rs.length) { // остальное — когда долистают
          const sn = document.createElement('div'); sn.className = 'cat-more-sn'; container.appendChild(sn);
          io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); sn.remove(); step(); } }, { rootMargin: '600px 0px' }); io.observe(sn);
        }
      };
      step();
    }
    function drawList() {
      closeMenu();
      if (fBtn) { fBtn.textContent = fLabel(); fBtn.classList.toggle('on', nFilters() > 0); }
      list.innerHTML = '';
      if (S.tab === 'cards') { const c = document.createElement('div'); list.appendChild(c); o.cardsInto(c); return; }
      const items = filtered(), rest = o.rest ? items.filter(kv => o.rest.test(kv[0], kv[1])) : [], main = o.rest ? items.filter(kv => !o.rest.test(kv[0], kv[1])) : items;
      if (o.lead) list.insertAdjacentHTML('beforeend', `<p class="cat-lead">${esc(o.lead)}</p>`);
      const cnt = document.createElement('p'); cnt.className = 'cat-count';
      cnt.textContent = tr([`${main.length} things`, `${main.length} ${plural(main.length, 'вещь', 'вещи', 'вещей')}`, `${main.length} lietas`]); list.appendChild(cnt);
      const probe = grid([]), pt = document.createElement('div'); pt.className = 'cat-tile'; pt.style.visibility = 'hidden'; probe.appendChild(pt); list.appendChild(probe);
      tileSize = Math.max(64, Math.round(pt.getBoundingClientRect().width - 12)) || 96; probe.remove();
      if (!main.length) list.insertAdjacentHTML('beforeend', `<p class="bag-empty">${esc(o.empty ? o.empty(S) : tr(['Nothing here with these filters.', 'С такими фильтрами ничего нет.', 'Ar šiem filtriem nekā nav.']))}</p>`);
      else fill(list, rows(main));
      if (rest.length) { // «Нет в наличии» — внизу, свёрнуто
        const det = document.createElement('details'); det.className = 'cat-rest'; det.open = !!S.restOpen;
        det.innerHTML = `<summary>${esc(o.rest.title)} <b>${rest.length}</b></summary>`;
        const inner = document.createElement('div'); det.appendChild(inner); list.appendChild(det);
        let done = false; const open = () => { if (det.open && !done) { done = true; fill(inner, rows(rest)); } };
        det.addEventListener('toggle', () => { S.restOpen = det.open; open(); }); open();
      }
    }
    drawTop(); drawTabs(); drawList();
    return { draw: () => { drawTop(); drawTabs(); drawList(); }, drawList, state: S, setTab: v => { if (TABS.includes(v)) { S.tab = v; S.kind = ''; drawTabs(); drawList(); } } };
  }
  // режим выбора: отметить / снять отметку у плитки на месте (без перерисовки списка); single — снять с остальных в том же каталоге
  function mark(t, on, single) {
    if (single) t.closest('.cat-browse').querySelectorAll('.cat-tile.sel').forEach(x => { x.classList.remove('sel'); x.querySelector('.cat-main').setAttribute('aria-pressed', 'false'); });
    t.classList.toggle('sel', on); t.querySelector('.cat-main').setAttribute('aria-pressed', String(on));
  }
  const plural = (n, a, b, c) => { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c; };

  const api = { tile, grid, tabs, chips, toggle, pic, bag, usage, kindLabel, kindsLabel, closeMenu, use, browse, itemWindow, dialog, mark, allEntries, grpOf, PRICES, SORTS, lastUndo: null, BIRD_KINDS, ROOM_KINDS, FIXED };
  window.PPCatalog = api;
})();
