// Коллекционные карточки (docs/cards.md): плитка, окно карточки и раздел «🃏 Карточки» в магазине. Один модуль на магазин, альбом и кабинет.
// Рамка, номер и пометка (🤖 / «нарисовала Алина») — CSS (.pc-* в style.css), в картинке только рисунок. Обычные — пиксель-арт 120×168 с image-rendering: pixelated.
// window.PPCards: card(c) — сама карточка; tile(c, o) — карточка + подпись + «Купить» или ник владельца; open(c, o) — окно; buy(c, o); mount(el) — раздел магазина.
(function () {
  var L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0, LANG = ['en', 'ru', 'lv'][L], pre = ['', '/ru', '/lv'][L];
  var T = {
    title: ['🃏 Cards', '🃏 Карточки', '🃏 Kartītes'],
    lead: ['Collectible cards for buttons. Each card exists in a single copy on the whole site: once someone buys it, it is theirs.', 'Коллекционные карточки за пуговки. Каждая карточка — в одном экземпляре на весь сайт: кто купил, у того она и есть.', 'Kolekcijas kartītes par pogām. Katra kartīte ir tikai vienā eksemplārā visā vietnē: kurš nopirka, tam tā arī pieder.'],
    common: ['Common', 'Обычная', 'Parasta'], rare: ['Rare', 'Редкая', 'Reta'], unique: ['Unique', 'Уникальная', 'Unikāla'],
    commons: ['🤖 Common', '🤖 Обычные', '🤖 Parastās'], rares: ['Rare', 'Редкие', 'Retās'], uniques: ['Unique', 'Уникальные', 'Unikālās'],
    robot: ['🤖 drawn by AI', '🤖 нарисовал ИИ', '🤖 zīmējis MI'], alina: ['✎ drawn by Alina', '✎ нарисовала Алина', '✎ zīmējusi Alīna'],
    fColl: ['Collection', 'Коллекция', 'Kolekcija'], allColl: ['All collections', 'Все коллекции', 'Visas kolekcijas'], fRar: ['Rarity', 'Редкость', 'Retums'], any: ['Any', 'Любая', 'Jebkura'],
    fShow: ['Show', 'Показать', 'Rādīt'], sAll: ['All', 'Все', 'Visas'], sFree: ['Free', 'Свободные', 'Brīvās'], sSold: ['Bought', 'Купленные', 'Nopirktās'], sMine: ['Mine', 'Мои', 'Manas'],
    buy: ['Buy', 'Купить', 'Pirkt'], poor: ['Not enough buttons', 'Не хватает пуговок', 'Nepietiek pogu'], signin: ['Sign in to buy', 'Войдите, чтобы купить', 'Ienāc, lai nopirktu'],
    mine: ['✓ Yours', '✓ Ваша', '✓ Tava'], owner: ['Owner', 'Владелец', 'Īpašnieks'], free: ['free', 'свободна', 'brīva'], number: ['Number', 'Номер', 'Numurs'], rarity: ['Rarity', 'Редкость', 'Retums'],
    sure: ['Buy the card “{n}” for {p} 🔘? It will be yours only: you cannot sell or gift it, only trade.', 'Купить карточку «{n}» за {p} 🔘? Она будет только у вас: продать или подарить её нельзя, только обменять.', 'Pirkt kartīti “{n}” par {p} 🔘? Tā būs tikai tev: to nevar pārdot vai uzdāvināt, tikai apmainīt.'],
    ok: ['The card is yours! 🃏', 'Карточка ваша! 🃏', 'Kartīte ir tava! 🃏'],
    sold: ['Someone has just bought this card.', 'Эту карточку только что купили.', 'Šo kartīti tikko nopirka.'],
    changed: ['The price has just changed: now {p} 🔘. Take a look and buy again.', 'Цена только что изменилась: теперь {p} 🔘. Посмотрите и купите ещё раз.', 'Cena tikko mainījās: tagad {p} 🔘. Paskaties un pērc vēlreiz.'],
    limit: ['In the first day of a collection one bird can buy only {n} of its cards.', 'В первые сутки коллекции в одни руки — не больше {n} её карточек.', 'Kolekcijas pirmajā diennaktī vienam putniņam — ne vairāk kā {n} tās kartītes.'],
    err: ['Could not buy, please try again.', 'Не получилось купить, попробуйте ещё раз.', 'Neizdevās nopirkt, mēģini vēlreiz.'],
    have: ['You have {n} 🔘', 'У вас {n} 🔘', 'Tev ir {n} 🔘'], none: ['No cards here yet.', 'Здесь пока нет карточек.', 'Šeit vēl nav kartīšu.'], noneMine: ['You have no cards yet.', 'У вас пока нет карточек.', 'Tev vēl nav kartīšu.'],
    rule: ['Only trading is possible: common ↔ common, rare ↔ rare, unique ↔ unique, 5 common ↔ 1 rare, 10 common ↔ 1 unique.', 'Карточку можно только обменять: обычную на обычную, редкую на редкую, уникальную на уникальную, 5 обычных на 1 редкую, 10 обычных на 1 уникальную.', 'Kartīti var tikai apmainīt: parasto pret parasto, reto pret reto, unikālo pret unikālo, 5 parastās pret 1 reto, 10 parastās pret 1 unikālo.'],
    close: ['Close', 'Закрыть', 'Aizvērt'], hidden: ['hidden', 'скрыта', 'paslēpta'],
  };
  var RAR = ['common', 'rare', 'unique'];
  var el = function (tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  var birdUrl = function (nick) { return pre + '/bird/?nick=' + encodeURIComponent(nick); };

  // сама карточка: рамка по редкости, номер, пометка — всё CSS
  function card(c, big) {
    var f = el('div', 'pc-card pc-' + (RAR.indexOf(c.rarity) >= 0 ? c.rarity : 'common') + (big ? ' pc-big' : ''));
    var pic = el('div', 'pc-pic');
    if (c.img) { var im = el('img'); im.src = c.img; im.alt = c.title || ''; im.loading = 'lazy'; im.decoding = 'async'; if (c.rarity === 'common') im.className = 'px'; pic.appendChild(im); }
    f.appendChild(pic);
    f.appendChild(el('span', 'pc-n', '№' + c.n));
    var mk = el('span', 'pc-mark', c.rarity === 'common' ? '🤖' : '✎'); mk.title = c.rarity === 'common' ? T.robot[L] : T.alina[L]; f.appendChild(mk);
    return f;
  }
  function ownerLink(c) {
    if (!c.owner) return null;
    if (!c.owner.nick) return el('span', 'pc-owner', '🐦');
    var a = el('a', 'pc-owner', '@' + c.owner.nick); a.href = birdUrl(c.owner.nick); return a;
  }
  // плитка: o.me — {buttons} или null, o.onBuy — после покупки, o.admin — клик открывает правку (o.onOpen)
  function tile(c, o) {
    o = o || {};
    var t = el('article', 'pc-tile' + (c.owner ? ' sold' : '') + (c.mine ? ' mine' : '') + (c.hidden ? ' pc-hid' : ''));
    var b = el('button', 'pc-open'); b.type = 'button'; b.title = c.title || ''; b.appendChild(card(c));
    b.onclick = function () { (o.onOpen || open)(c, o); }; t.appendChild(b);
    t.appendChild(el('p', 'pc-t', c.title || ''));
    var foot = el('p', 'pc-foot');
    if (c.mine) foot.appendChild(el('span', 'pc-yours', T.mine[L]));
    else if (c.owner) foot.appendChild(ownerLink(c));
    else if (!o.admin) foot.appendChild(buyBtn(c, o));
    if (o.admin) foot.appendChild(el('span', 'pc-price', c.rarity === 'common' ? '🔘 ' + c.price + ' (авто)' : '🔘 ' + (c.price || '—')));
    t.appendChild(foot);
    return t;
  }
  function buyBtn(c, o) {
    var b = el('button', 'pill-btn pc-buy'); b.type = 'button';
    if (!o.me) { b.textContent = T.signin[L] + ' · 🔘 ' + c.price; b.onclick = function () { if (window.PPAccount) window.PPAccount.openSignIn(); }; return b; }
    var ok = (o.me.buttons || 0) >= c.price;
    b.innerHTML = ok ? T.buy[L] + ' · 🔘 ' + c.price : '🔘 ' + c.price + ' · ' + T.poor[L];
    b.disabled = !ok; b.onclick = function () { buy(c, o, b); };
    return b;
  }
  function buy(c, o, btn) {
    if (!confirm(T.sure[L].replace('{n}', c.title).replace('{p}', c.price))) return;
    if (btn) btn.disabled = true;
    fetch('/api/cards/buy', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: c.id, price: c.price }) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        if (x.ok) { if (window.PPToast) window.PPToast(T.ok[L]); else alert(T.ok[L]); }
        else alert(x.d.error === 'price' ? T.changed[L].replace('{p}', x.d.price) : x.d.error === 'sold' ? T.sold[L] : x.d.error === 'poor' ? T.poor[L] : x.d.error === 'limit' ? T.limit[L].replace('{n}', x.d.limit) : T.err[L]);
        if (o.onBuy) o.onBuy(x.ok, x.d);
      }).catch(function () { alert(T.err[L]); if (btn) btn.disabled = false; });
  }
  // окно карточки: крупно слева, справа — название, описание, статы, номер, редкость, владелец (на телефоне — под картинкой)
  function open(c, o) {
    o = o || {};
    var d = el('dialog', 'pc-dlg'), box = el('div', 'pc-dlg-in');
    box.appendChild(card(c, true));
    var info = el('div', 'pc-info');
    info.appendChild(el('h3', '', c.title || ''));
    if (c.set) info.appendChild(el('p', 'pc-set', c.set));
    if (c.desc) info.appendChild(el('p', 'pc-desc', c.desc));
    var st = el('ul', 'pc-stats');
    (c.stats || []).forEach(function (s) {
      var li = el('li'); li.appendChild(el('span', 'pc-sn', s.name));
      var bar = el('span', 'pc-bar'); bar.style.setProperty('--v', s.v); bar.setAttribute('aria-hidden', 'true'); li.appendChild(bar);
      li.appendChild(el('b', '', String(s.v) + '/10')); st.appendChild(li);
    });
    info.appendChild(st);
    var dl = el('dl', 'pc-meta');
    var row = function (k, v) { dl.appendChild(el('dt', '', k)); var dd = el('dd'); if (typeof v === 'string') dd.textContent = v; else dd.appendChild(v); dl.appendChild(dd); };
    row(T.number[L], '№' + c.n);
    row(T.rarity[L], T[c.rarity][L] + ' · ' + (c.rarity === 'common' ? T.robot[L] : T.alina[L]));
    row(T.owner[L], c.owner ? ownerLink(c) : T.free[L]);
    info.appendChild(dl);
    if (!c.owner && !o.admin) { var bb = buyBtn(c, Object.assign({}, o, { onBuy: function (ok, x) { d.close(); if (o.onBuy) o.onBuy(ok, x); } })); info.appendChild(bb); }
    if (c.mine) info.appendChild(el('p', 'pc-rule', T.rule[L]));
    var x = el('button', 'pc-x', '✕'); x.type = 'button'; x.title = T.close[L]; x.onclick = function () { d.close(); };
    box.appendChild(info); d.appendChild(x); d.appendChild(box);
    d.addEventListener('close', function () { d.remove(); });
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    document.body.appendChild(d); d.showModal();
    return d;
  }

  // раздел магазина: фильтры коллекция · редкость · все / свободные / купленные / мои
  function mount(root) {
    var F = { collection: '', rarity: '', show: 'all' };
    try { var sv = JSON.parse(localStorage.getItem('pp-cards-f') || 'null'); if (sv) F = Object.assign(F, sv); } catch (e) { /* нет хранилища */ }
    var save = function () { try { localStorage.setItem('pp-cards-f', JSON.stringify(F)); } catch (e) { /* ок */ } };
    root.innerHTML = '';
    var h = el('h2', 'pc-h', T.title[L]); root.appendChild(h);
    root.appendChild(el('p', 'fl-all-lead pc-lead', T.lead[L]));
    var meP = el('p', 'pc-me'); root.appendChild(meP);
    var bar = el('div', 'pc-filters'); bar.setAttribute('role', 'toolbar'); root.appendChild(bar);
    var grid = el('div', 'pc-grid'); root.appendChild(grid);
    var data = null;
    function filters() {
      bar.innerHTML = '';
      var row = function (label) { var r = el('div', 'shop-row shop-seg'); r.appendChild(el('span', 'shop-lab', label)); var g = el('div', 'shop-opts'); r.appendChild(g); bar.appendChild(r); return g; };
      var pill = function (g, f, v, label) { var b = el('button', 'pill-btn', label); b.type = 'button'; b.setAttribute('aria-pressed', String(F[f] === v)); b.onclick = function () { F[f] = v; save(); load(); }; g.appendChild(b); };
      if ((data.sets || []).length) {
        var g0 = row(T.fColl[L]), sel = el('select', 'shop-theme');
        sel.innerHTML = '<option value="">' + T.allColl[L] + '</option>' + data.sets.map(function (s) { return '<option value="' + s.slug + '">' + String(s.name).replace(/</g, '&lt;') + '</option>'; }).join('');
        sel.value = F.collection; sel.onchange = function () { F.collection = sel.value; save(); load(); }; g0.appendChild(sel);
      }
      var g1 = row(T.fRar[L]); pill(g1, 'rarity', '', T.any[L]); pill(g1, 'rarity', 'common', T.commons[L]); pill(g1, 'rarity', 'rare', T.rares[L]); pill(g1, 'rarity', 'unique', T.uniques[L]);
      var g2 = row(T.fShow[L]); pill(g2, 'show', 'all', T.sAll[L]); pill(g2, 'show', 'free', T.sFree[L]); pill(g2, 'show', 'sold', T.sSold[L]); if (data.me) pill(g2, 'show', 'mine', T.sMine[L]);
    }
    function draw() {
      if (F.show === 'mine' && !data.me) F.show = 'all';
      filters();
      meP.textContent = data.me ? T.have[L].replace('{n}', data.me.buttons) : '';
      grid.innerHTML = '';
      if (!data.cards.length) { grid.appendChild(el('p', 'fl-all-lead', F.show === 'mine' ? T.noneMine[L] : T.none[L])); return; }
      data.cards.forEach(function (c) { grid.appendChild(tile(c, { me: data.me, onBuy: function () { load(); } })); });
    }
    function load() {
      var q = '?lang=' + LANG + (F.collection ? '&collection=' + encodeURIComponent(F.collection) : '') + (F.rarity ? '&rarity=' + F.rarity : '') + '&show=' + F.show;
      fetch('/api/cards' + q, { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
        if (!d) { root.hidden = true; return; } // сервер недоступен (статический просмотр) — раздела нет
        root.hidden = false; data = d;
        if (F.collection && !d.sets.some(function (s) { return s.slug === F.collection; })) { F.collection = ''; save(); return load(); }
        draw();
      }).catch(function () { root.hidden = true; });
    }
    load();
    return { reload: load };
  }
  window.PPCards = { card: card, tile: tile, open: open, buy: buy, mount: mount, T: T, L: L };
  var auto = document.querySelector('[data-pp-cards]');
  if (auto) mount(auto);
})();
