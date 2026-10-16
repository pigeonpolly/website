// Каталог вещей: плитка, вкладки, чипы, переключатель; режим «сумка» (профиль птички).
// Магазин и карточки потом берут отсюда же (PPCatalog.tile / tabs / chips / grid).
(() => {
  const LANG = document.documentElement.lang === 'ru' ? 1 : document.documentElement.lang === 'lv' ? 2 : 0;
  const tr = a => a[LANG] != null ? a[LANG] : a[0];
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const BIRD_KINDS = ['hat', 'item', 'shoes', 'scarf', 'bg', 'frame', 'anim'], ROOM_KINDS = ['furn', 'deco', 'wall', 'floor', 'view', 'curtain'];
  const FIXED = ['wall', 'floor', 'view', 'curtain']; // в комнате по одной: выбранные обои, пол, вид, шторы
  // вид вещи одним словом — мелко под названием
  const KIND = {
    hat: ['hat', 'шапка', 'cepure'], item: ['in the beak', 'в клюв', 'knābī'], shoes: ['shoes', 'обувь', 'apavi'], scarf: ['scarf', 'шарфик', 'šallīte'],
    bg: ['background', 'фон', 'fons'], frame: ['frame', 'рамка', 'rāmis'], anim: ['animation', 'анимация', 'animācija'],
    furn: ['furniture', 'мебель', 'mēbele'], deco: ['decoration', 'украшение', 'rotājums'], wall: ['wallpaper', 'обои', 'tapetes'],
    floor: ['floor', 'пол', 'grīda'], view: ['window view', 'вид из окна', 'skats pa logu'], curtain: ['curtains', 'шторы', 'aizkari'],
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
  function showMenu(tile, items) {
    closeMenu();
    const m = document.createElement('div'); m.className = 'cat-menu'; m.setAttribute('role', 'menu');
    items.forEach(it => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'menuitem'); b.textContent = it.label; b.onclick = e => { e.stopPropagation(); closeMenu(); it.on(); }; m.appendChild(b); });
    tile.appendChild(m); openMenu = m; m.querySelector('button').focus();
  }

  // плитка: картинка, название (≤ 2 строки), вид; отметка слева сверху, «⋯» справа сверху
  // o = { kind, item, name, legend, mark, markOn, menu: [{label, on}], onUse, id, size, title }
  function tile(o) {
    const el = document.createElement('div');
    el.className = 'cat-tile' + (o.legend ? ' cat-leg' : '') + (o.markOn ? ' on' : '');
    el.innerHTML = `<button type="button" class="cat-main"${o.title ? ` title="${esc(o.title)}"` : ''}><span class="cat-pic-slot"></span>
      <span class="cat-name">${esc(o.name)}</span><span class="cat-kind">${esc(kindLabel(o.kind))}</span></button>
      ${o.mark ? `<span class="cat-mark${o.markOn ? ' on' : ''}">${esc(o.mark)}</span>` : ''}${o.legend ? '<span class="cat-star" aria-hidden="true">★</span>' : ''}
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
  //       onUse(g), onGive(g), onSell(g), onMore(g), cardsInto(box), empty, top }
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
      box.appendChild(head);
      if (S.tab === 'cards') { const c = document.createElement('div'); box.appendChild(c); o.cardsInto && o.cardsInto(c); return; }
      const group = S.tab === 'bird' ? bird : S.tab === 'room' ? room : null;
      if (group) {
        const ks = (S.tab === 'bird' ? BIRD_KINDS : ROOM_KINDS).filter(k => group.some(g => g.kind === k));
        if (ks.length > 1) box.appendChild(chips([{ v: '', label: tr(['All', 'Все', 'Visas']) }, ...ks.map(k => ({ v: k, label: kindsLabel(k) }))], S.kind, v => { S.kind = v; draw(); }));
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
      box.insertAdjacentHTML('beforeend', `<p class="cat-legend">${esc(tr([
        '✓ worn or in the room · 1/3 — how many are in use · ×2 — copies · ★ legendary · ⋯ give, sell, details',
        '✓ надето или в комнате · 1/3 — сколько в деле · ×2 — копии · ★ легендарная · ⋯ подарить, продать, подробнее',
        '✓ uzvilkts vai istabā · 1/3 — cik izmanto · ×2 — kopijas · ★ leģendāra · ⋯ dāvināt, pārdot, sīkāk']))}</p>`);
    };
    draw();
    return { draw };
  }

  // где вещь сейчас: надета / стоит в комнате (сколько штук), сколько всего — для сумки
  function usage(kind, item, n, avatar, room) {
    room = room || {};
    if (!isRoom(kind)) return avatar && avatar[kind] === item ? 1 : 0;
    if (FIXED.includes(kind)) return room[kind] === item ? 1 : 0;
    return Math.min(n, (room.items || []).filter(it => it.k === kind && it.v === item).length);
  }

  window.PPCatalog = { tile, grid, tabs, chips, toggle, pic, bag, usage, kindLabel, kindsLabel, closeMenu, BIRD_KINDS, ROOM_KINDS, FIXED };
})();
