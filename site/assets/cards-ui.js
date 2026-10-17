// Коллекционные карточки (docs/cards.md): плитка, окно карточки и раздел «🃏 Карточки» в магазине. Один модуль на магазин, альбом и кабинет.
// Рамка, номер и пометка (🤖 / «нарисовала Алина») — CSS (.pc-* в style.css), в картинке только рисунок. Обычные — пиксель-арт 120×168 с image-rendering: pixelated.
// window.PPCards: card(c) — сама карточка; tile(c, o) — карточка + подпись + «Купить» или ник владельца; open(c, o) — окно; buy(c, o); album(nick) — разворот альбома; mount(el) — раздел магазина;
// обмен (этап 7 В): trade(c, o) — окно «что хочу / что отдаю» с проверкой схемы на лету (tradeCheck); profile(el, {nick, mine}) — вкладка «🃏 Карточки» в профиле: обмены + карточки птички.
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
    buy: ['Buy', 'Купить', 'Pirkt'], poor: ['Not enough buttons', 'Не хватает пуговок', 'Nepietiek pogu'], signin: ['Hatch a bird to shop', 'Вылупи птичку, чтобы покупать', 'Izperi putniņu, lai iepirktos'],
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
    // обмен
    offer: ['🔁 Offer a trade', '🔁 Предложить обмен', '🔁 Piedāvāt maiņu'], offerShort: ['🔁 Trade', '🔁 Обмен', '🔁 Maiņa'],
    trWith: ['🔁 Trade with @{n}', '🔁 Обмен с @{n}', '🔁 Maiņa ar @{n}'],
    trWant: ['What I want · cards of @{n}', 'Что хочу · карточки @{n}', 'Ko es gribu · @{n} kartītes'], trGive: ['What I give · my cards', 'Что отдаю · мои карточки', 'Ko es dodu · manas kartītes'],
    trNoMine: ['You have no cards to trade yet.', 'Пока нечего отдать: у вас нет карточек.', 'Tev vēl nav kartīšu, ko mainīt.'], toShop: ['🛍 To the shop', '🛍 В магазин', '🛍 Uz veikalu'],
    trSend: ['🔁 Offer', '🔁 Предложить', '🔁 Piedāvāt'],
    trSent: ['Offer sent to @{n}. It is valid for {d} days.', 'Предложение отправлено @{n}. Оно действует {d} дн.', 'Piedāvājums nosūtīts @{n}. Tas ir spēkā {d} d.'],
    trErr: { scheme: ['This trade does not fit any of the five schemes.', 'Такой обмен не подходит ни под одну из пяти схем.', 'Šī maiņa neatbilst nevienai no piecām shēmām.'],
      owner: ['Some of these cards already belong to someone else. Open the window again.', 'Часть карточек уже у другой птички. Откройте окно ещё раз.', 'Daļa kartīšu jau pieder citam putniņam. Atver logu vēlreiz.'],
      notmine: ['Some of your cards are no longer yours.', 'Части ваших карточек у вас уже нет.', 'Daļas tavu kartīšu tev vairs nav.'],
      many: ['Too many open offers. Wait for answers first.', 'Слишком много открытых предложений. Сначала дождитесь ответов.', 'Pārāk daudz atvērtu piedāvājumu. Vispirms sagaidi atbildes.'],
      stale: ['The trade is out of date: the cards no longer belong to the same birds.', 'Обмен устарел: карточки уже не у тех владельцев.', 'Maiņa ir novecojusi: kartītes vairs nepieder tiem pašiem putniņiem.'],
      expired: ['The offer has expired.', 'Предложение истекло.', 'Piedāvājums ir beidzies.'],
      gone: ['This offer is no longer open.', 'Это предложение уже закрыто.', 'Šis piedāvājums vairs nav atvērts.'] },
    // подсказки схемы (tradeCheck)
    hTake: ['Choose what you want from @{n}.', 'Отметьте, что хотите у @{n}.', 'Atzīmē, ko gribi no @{n}.'],
    hGive: ['Now choose what you give: {w}.', 'Теперь отметьте, что отдаёте: {w}.', 'Tagad atzīmē, ko dod: {w}.'],
    hMoreGive: ['{k} more needed in “What I give”.', 'Нужно ещё {k} в «Что отдаю».', 'Vajag vēl {k} sadaļā “Ko es dodu”.'],
    hMoreTake: ['{k} more needed in “What I want”.', 'Нужно ещё {k} в «Что хочу».', 'Vajag vēl {k} sadaļā “Ko es gribu”.'],
    hExtra: ['{k} too many. {r}', 'Лишние — {k}. {r}', 'Par daudz — {k}. {r}'],
    hOneBig: ['A rare or unique card goes alone: one per side, nothing else next to it.', 'Редкая или уникальная — одна, без других карточек рядом.', 'Retā vai unikālā — viena, bez citām kartītēm blakus.'],
    hSame: { rare: ['A rare card is traded for a rare one or for 5 common.', 'Редкую меняют на редкую или на 5 обычных.', 'Reto maina pret reto vai pret 5 parastām.'],
      unique: ['A unique card is traded for a unique one or for 10 common.', 'Уникальную меняют на уникальную или на 10 обычных.', 'Unikālo maina pret unikālo vai pret 10 parastām.'] },
    hCommon: ['Common cards go one for one; 5 common = 1 rare, 10 common = 1 unique.', 'Обычные — одна на одну; 5 обычных = 1 редкая, 10 обычных = 1 уникальная.', 'Parastās — viena pret vienu; 5 parastās = 1 reta, 10 parastās = 1 unikāla.'],
    hOk: ['✓ Scheme: {s}', '✓ Схема: {s}', '✓ Shēma: {s}'],
    sch: { common: ['1 common ↔ 1 common', '1 обычная ↔ 1 обычная', '1 parastā ↔ 1 parastā'], rare: ['1 rare ↔ 1 rare', '1 редкая ↔ 1 редкая', '1 retā ↔ 1 retā'], unique: ['1 unique ↔ 1 unique', '1 уникальная ↔ 1 уникальная', '1 unikālā ↔ 1 unikālā'],
      rare5: ['5 common ↔ 1 rare', '5 обычных ↔ 1 редкая', '5 parastās ↔ 1 retā'], unique10: ['10 common ↔ 1 unique', '10 обычных ↔ 1 уникальная', '10 parastās ↔ 1 unikālā'] },
    acc: { common: ['1 common', '1 обычную', '1 parasto'], rare: ['1 rare', '1 редкую', '1 reto'], unique: ['1 unique', '1 уникальную', '1 unikālo'] },
    or: [' or ', ' или ', ' vai '],
    // профиль: обмены
    myTrades: ['🔁 Trades', '🔁 Обмены', '🔁 Maiņas'], noTrades: ['No trade offers yet. Open someone’s card and press “🔁 Offer a trade”.', 'Предложений обмена пока нет. Откройте чужую карточку и нажмите «🔁 Предложить обмен».', 'Maiņas piedāvājumu vēl nav. Atver kāda kartīti un spied “🔁 Piedāvāt maiņu”.'],
    tIn: ['@{n} offers a trade', '@{n} предлагает обмен', '@{n} piedāvā maiņu'], tOut: ['Your offer to @{n}', 'Ваше предложение @{n}', 'Tavs piedāvājums @{n}'],
    tGet: ['You get', 'Вы получите', 'Tu saņemsi'], tPay: ['You give', 'Вы отдадите', 'Tu atdosi'],
    tUntil: ['valid until {d}', 'действует до {d}', 'spēkā līdz {d}'], tNew: ['new', 'новое', 'jauns'],
    accept: ['✓ Accept', '✓ Принять', '✓ Pieņemt'], decline: ['✕ Decline', '✕ Отклонить', '✕ Noraidīt'], cancel: ['Cancel the offer', 'Отменить предложение', 'Atsaukt piedāvājumu'],
    sureAcc: ['Trade the cards? This cannot be undone.', 'Обменяться карточками? Отменить это будет нельзя.', 'Mainīt kartītes? To nevarēs atsaukt.'],
    accOk: ['Done! The cards are yours 🃏', 'Готово! Карточки ваши 🃏', 'Gatavs! Kartītes ir tavas 🃏'],
    tPast: ['Earlier', 'Раньше', 'Agrāk'],
    st: { accepted: ['accepted', 'принят', 'pieņemta'], declined: ['declined', 'отклонён', 'noraidīta'], cancelled: ['cancelled', 'отменён', 'atsaukta'], stale: ['out of date', 'устарел', 'novecojusi'], expired: ['expired', 'истёк', 'beigusies'] },
    myCards: ['🃏 My cards', '🃏 Мои карточки', '🃏 Manas kartītes'], hisCards: ['🃏 Cards of @{n}', '🃏 Карточки @{n}', '🃏 @{n} kartītes'], noneHis: ['@{n} has no cards yet.', 'У @{n} пока нет карточек.', '@{n} vēl nav kartīšu.'],
  };
  // игровые статы уникальных карточек Алины (c.game, docs/cards.md): персонаж — HP, слоты, 5 статов 0–5, особенности; предмет — слоты, эффект, что нужно
  var G = {
    hp: ['HP', 'HP', 'HP'], total: ['Total HP', 'Всего HP', 'Kopā HP'], slots: ['Tool slots', 'Слоты для предметов', 'Priekšmetu vietas'], take: ['Takes slots', 'Занимает слотов', 'Aizņem vietas'],
    fx: ['Effect', 'Эффект', 'Efekts'], req: ['Needs', 'Нужно', 'Vajag'], traits: ['Traits', 'Особенности', 'Īpašības'], none: ['none', 'нет', 'nav'],
    tool: ['🧰 Tool card', '🧰 Карточка-предмет', '🧰 Priekšmeta kartīte'], bonus: ['bonus: +{n} HP', 'бонус: +{n} HP', 'bonuss: +{n} HP'],
    s: { snack: ['🧺', 'Snack Reserves', 'Запас перекусов', 'Uzkodu krājumi'], cook: ['🥕', 'Cooking Skill', 'Кулинария', 'Kulinārija'], coffee: ['☕', 'Caffeine Fuel', 'Кофеиновое топливо', 'Kofeīna degviela'],
      mood: ['🙂', 'Mood', 'Настроение', 'Garastāvoklis'], cookie: ['🍪', 'Cookie Power', 'Печеньковая сила', 'Cepumu spēks'] },
    t: { charisma: ['⭐', 'Bird Charisma', 'Птичья харизма', 'Putna harizma'], drama: ['🚪', 'Dramatic Exit', 'Драматичный уход', 'Dramatiska aiziešana'], night: ['🌙', 'Midnight Snacking', 'Полночные перекусы', 'Pusnakts uzkodas'],
      dairy: ['🥛', 'Dairy Intolerance', 'Непереносимость молочного', 'Piena nepanesība'], phone: ['📞', 'Phone Call Panic', 'Паника от звонков', 'Zvanu panika'], yes: ['🙇', 'Can’t Say No', 'Не умеет отказывать', 'Nespēj atteikt'],
      mirror: ['👻', 'Spooked by Reflection', 'Боится отражения', 'Baidās no atspulga'], guilt: ['😴', 'Rest Guilt Mode', 'Вина за отдых', 'Atpūtas vainas režīms'] },
  };
  var SK = ['snack', 'cook', 'coffee', 'mood', 'cookie'];
  // строка эффекта или условия: {s, d} / {s, min} / {s, max} / {hp} / {add|del: особенность} / {t: {en, ru, lv}}
  function gLine(x) {
    var sg = function (d) { return (d > 0 ? '+' : '−') + Math.abs(d); };
    if (x.t) return x.t[LANG] || x.t.en || '';
    if (x.hp != null) return sg(x.hp) + ' HP';
    if (x.s) { var s = G.s[x.s]; return s[0] + ' ' + s[1 + L] + ' ' + (x.d != null ? sg(x.d) : x.min != null ? '≥ ' + x.min : x.max != null ? '≤ ' + x.max : ''); }
    var k = x.add || x.del || x.has, t = G.t[k]; if (!t) return '';
    return (x.add ? '+ ' : x.del ? '✕ ' : '') + t[0] + ' ' + t[1 + L];
  }
  function game(g) {
    var w = el('div', 'pc-game');
    if (g.kind === 'tool') {
      w.appendChild(el('p', 'pc-g-kind', G.tool[L]));
      var dl = el('dl', 'pc-g-tool');
      var row = function (k, v) { if (!v) return; dl.appendChild(el('dt', '', k)); dl.appendChild(el('dd', '', v)); };
      row(G.take[L], g.take ? String(g.take) : '');
      row(G.fx[L], (g.fx || []).map(gLine).join(' · '));
      row(G.req[L], (g.req || []).map(gLine).join(' · '));
      w.appendChild(dl);
      return w;
    }
    var sum = (g.s || []).reduce(function (a, b) { return a + (b || 0); }, 0), cha = (g.tr || []).indexOf('charisma') >= 0;
    var top = el('div', 'pc-g-top');
    var chip = function (big, small) { var c = el('div', 'pc-g-chip'); c.appendChild(el('b', '', big)); c.appendChild(el('span', '', small)); top.appendChild(c); };
    chip(g.hp + ' HP', G.hp[L]); chip(g.hp + (cha ? g.hp : 0) + sum + ' HP', G.total[L]); chip('🧰 ' + g.slots, G.slots[L]);
    w.appendChild(top);
    var ul = el('ul', 'pc-g-stats');
    SK.forEach(function (k, i) {
      var v = (g.s || [])[i] || 0, li = el('li');
      li.appendChild(el('span', 'pc-g-ic', G.s[k][0])); li.appendChild(el('span', 'pc-sn', G.s[k][1 + L]));
      var dots = el('span', 'pc-g-dots'); dots.setAttribute('aria-hidden', 'true');
      for (var j = 0; j < 5; j++) dots.appendChild(el('i', j < v ? 'on' : ''));
      li.appendChild(dots); li.appendChild(el('b', '', String(v))); ul.appendChild(li);
    });
    w.appendChild(ul);
    w.appendChild(el('p', 'pc-g-h', G.traits[L]));
    var tr = el('p', 'pc-g-traits');
    (g.tr || []).forEach(function (k) {
      var t = G.t[k]; if (!t) return;
      var c = el('span', 'pc-g-tr' + (k === 'charisma' ? ' good' : ''), t[0] + ' ' + t[1 + L]);
      if (k === 'charisma') c.title = G.bonus[L].replace('{n}', g.hp);
      tr.appendChild(c);
    });
    if (!tr.childNodes.length) tr.appendChild(el('span', 'pc-g-none', G.none[L]));
    w.appendChild(tr);
    return w;
  }
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
    var t = el('article', 'pc-tile' + (c.owner && !o.album ? ' sold' : '') + (c.mine ? ' mine' : '') + (c.hidden ? ' pc-hid' : ''));
    var b = el('button', 'pc-open'); b.type = 'button'; b.title = c.title || ''; b.appendChild(card(c));
    b.onclick = function () { (o.onOpen || open)(c, o); }; t.appendChild(b);
    t.appendChild(el('p', 'pc-t', c.title || ''));
    var foot = el('p', 'pc-foot');
    if (c.mine) foot.appendChild(el('span', 'pc-yours', T.mine[L]));
    else if (c.owner) { if (!o.album) foot.appendChild(ownerLink(c)); if (canTrade(c, o)) foot.appendChild(tradeBtn(c, o, T.offerShort[L])); }
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
    if (c.game && c.game.kind) info.appendChild(game(c.game));
    var st = el('ul', 'pc-stats');
    (c.game && c.game.kind ? [] : c.stats || []).forEach(function (s) {
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
    if (canTrade(c, o)) info.appendChild(tradeBtn(c, Object.assign({}, o, { before: function () { d.close(); } }), T.offer[L]));
    if (c.mine || c.owner) info.appendChild(el('p', 'pc-rule', T.rule[L]));
    var x = el('button', 'pc-x', '✕'); x.type = 'button'; x.title = T.close[L]; x.onclick = function () { d.close(); };
    box.appendChild(info); d.appendChild(x); d.appendChild(box);
    d.addEventListener('close', function () { d.remove(); });
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    document.body.appendChild(d); d.showModal();
    return d;
  }

  // ---------- обмен (этап 7 В) ----------
  var NEED = { rare: 5, unique: 10 };
  var fmt = function (s, m) { return s.replace(/\{(\w+)\}/g, function (a, k) { return m[k] != null ? m[k] : a; }); };
    // «k обычных» с числом: ru — 1 обычную / 2+ обычных, lv — 1 parasto / parastās
  var commons = function (k) { return k + ' ' + ['common', k % 10 === 1 && k % 100 !== 11 ? 'обычную' : 'обычных', k % 10 === 1 && k % 100 !== 11 ? 'parasto' : 'parastās'][L]; };
  var canTrade = function (c, o) { return !!(c.owner && c.owner.nick && !c.mine && !o.admin && o.me && o.me.nick && o.me.nick !== c.owner.nick); };
  function tradeBtn(c, o, label) {
    var b = el('button', 'pill-btn pc-trade', label); b.type = 'button';
    b.onclick = function (e) { e.stopPropagation(); if (o.before) o.before(); trade(c, o); };
    return b;
  }
  // проверка на лету: give — редкости моих карточек, take — тех, что хочу. {ok, scheme, text}. Сервер проверяет то же (tradeScheme в worker/cards.js)
  function tradeCheck(give, take, nick) {
    var big = function (a) { return a.filter(function (r) { return r !== 'common'; }); };
    var bt = big(take), bg = big(give);
    if (!take.length) return { text: fmt(T.hTake[L], { n: nick }) };
    if ((bt.length && take.length > 1) || (bg.length && give.length > 1)) return { text: T.hOneBig[L] };
    if (bt.length && bg.length) {
      if (bt[0] === bg[0]) return { ok: true, scheme: bt[0] };
      return { text: T.hSame[bt[0]][L] };
    }
    if (bt.length || bg.length) { // одна редкая/уникальная против обычных
      var R = (bt[0] || bg[0]), N = NEED[R], other = bt.length ? give : take, k = other.length;
      if (k === N) return { ok: true, scheme: R + N };
      if (!k) return { text: fmt(T.hGive[L], { w: T.acc[R][L] + T.or[L] + commons(N) }) }; // other пуст только со стороны «отдаю» (take не пуст)
      if (k < N) return { text: fmt(bt.length ? T.hMoreGive[L] : T.hMoreTake[L], { k: commons(N - k) }) };
      return { text: fmt(T.hExtra[L], { k: commons(k - N), r: T.hSame[R][L] }) };
    }
    var t = take.length, g = give.length;
    if (t === 1 && g === 1) return { ok: true, scheme: 'common' };
    if (!g) return { text: fmt(T.hGive[L], { w: t === 1 ? T.acc.common[L] : t === 5 ? T.acc.rare[L] : t === 10 ? T.acc.unique[L] : T.acc.common[L] }) + (t !== 1 && t !== 5 && t !== 10 ? ' ' + T.hCommon[L] : '') };
    return { text: T.hCommon[L] };
  }
  var getJ = function (u) { return fetch(u, { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }); };
  var postJ = function (u, b) {
    return fetch(u, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); });
  };
  var say = function (m) { if (window.PPToast) window.PPToast(m); else alert(m); };
  var errText = function (d) { return (T.trErr[d && d.error] || T.err)[L]; };
  // плитка выбора: нажатие отмечает / снимает отметку; ⓘ — окно карточки
  function pickTile(c, sel, onChange) {
    var t = el('article', 'pc-tile pc-pk' + (sel[c.id] ? ' sel' : ''));
    var b = el('button', 'pc-open'); b.type = 'button'; b.setAttribute('aria-pressed', String(!!sel[c.id])); b.title = c.title || ''; b.appendChild(card(c));
    b.onclick = function () { if (sel[c.id]) delete sel[c.id]; else sel[c.id] = c; t.classList.toggle('sel', !!sel[c.id]); b.setAttribute('aria-pressed', String(!!sel[c.id])); onChange(); };
    t.appendChild(b);
    var cap = el('p', 'pc-t'); cap.appendChild(document.createTextNode(c.title || ''));
    var i = el('button', 'pc-i', 'ⓘ'); i.type = 'button'; i.title = c.title || ''; i.onclick = function () { open(c, { admin: true }); }; cap.appendChild(i);
    t.appendChild(cap);
    return t;
  }
  // окно обмена: «что хочу» (карточки владельца, эта уже отмечена) / «что отдаю» (мои); внизу — подсказка схемы и «Предложить»
  function trade(c, o) {
    o = o || {};
    var nick = c.owner.nick, want = {}, give = {}; want[c.id] = c;
    var d = el('dialog', 'pc-dlg pc-tr'), box = el('div', 'pc-tr-in');
    var x = el('button', 'pc-x', '✕'); x.type = 'button'; x.title = T.close[L]; x.onclick = function () { d.close(); };
    box.appendChild(el('h3', 'pc-tr-h', fmt(T.trWith[L], { n: nick })));
    box.appendChild(el('p', 'pc-rule', T.rule[L]));
    var sW = el('section', 'pc-tr-sec'), sG = el('section', 'pc-tr-sec');
    sW.appendChild(el('h4', '', fmt(T.trWant[L], { n: nick }))); sG.appendChild(el('h4', '', T.trGive[L]));
    var gW = el('div', 'pc-grid pc-tr-grid'), gG = el('div', 'pc-grid pc-tr-grid'); sW.appendChild(gW); sG.appendChild(gG);
    box.appendChild(sW); box.appendChild(sG);
    var foot = el('div', 'pc-tr-foot'), hint = el('p', 'pc-tr-hint'), send = el('button', 'pill-btn pc-buy pc-tr-send', T.trSend[L]); send.type = 'button';
    foot.appendChild(hint); foot.appendChild(send);
    d.appendChild(x); d.appendChild(box); d.appendChild(foot);
    d.addEventListener('close', function () { d.remove(); });
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    document.body.appendChild(d); d.showModal();
    var rar = function (m) { return Object.keys(m).map(function (k) { return m[k].rarity; }); };
    function update() {
      var r = tradeCheck(rar(give), rar(want), nick);
      hint.textContent = r.ok ? fmt(T.hOk[L], { s: T.sch[r.scheme][L] }) : r.text;
      hint.classList.toggle('ok', !!r.ok); send.disabled = !r.ok;
    }
    update();
    var q = '&order=album&lang=' + LANG;
    Promise.all([getJ('/api/cards?owner=' + encodeURIComponent(nick) + q), getJ('/api/cards?show=mine' + q)]).then(function (a) {
      var his = a[0] ? a[0].cards : [c], mine = a[1] ? a[1].cards : [];
      if (!his.some(function (k) { return k.id === c.id; })) his.unshift(c);
      his.forEach(function (k) { gW.appendChild(pickTile(k, want, update)); });
      if (!mine.length) { var p0 = el('p', 'fl-all-lead', T.trNoMine[L] + ' '); var a0 = el('a', 'pc-owner', T.toShop[L]); a0.href = pre + '/shop/#cards'; p0.appendChild(a0); gG.appendChild(p0); }
      mine.forEach(function (k) { gG.appendChild(pickTile(k, give, update)); });
    });
    send.onclick = function () {
      send.disabled = true;
      postJ('/api/cards/trade', { give: Object.keys(give).map(Number), take: Object.keys(want).map(Number) }).then(function (x) {
        if (x.ok) { d.close(); say(fmt(T.trSent[L], { n: nick, d: (o.days || 7) })); if (o.onTrade) o.onTrade(); }
        else { alert(errText(x.d)); update(); }
      }).catch(function () { alert(T.err[L]); update(); });
    };
    return d;
  }
  // мини-карточки обмена (нажатие — окно карточки)
  function minis(list) {
    var w = el('div', 'pc-minis');
    list.forEach(function (c) { var b = el('button', 'pc-mini'); b.type = 'button'; b.title = (c.title || '') + ' · ' + T[c.rarity][L]; b.appendChild(card(c)); b.onclick = function () { open(c, { admin: true }); }; w.appendChild(b); });
    return w;
  }
  var dateOf = function (s) { return new Date(s * 1000).toLocaleDateString(['en-GB', 'ru-RU', 'lv-LV'][L], { day: 'numeric', month: 'long' }); };
  // одно предложение в списке профиля. Входящее: give — что я получу, take — что отдам; исходящее — наоборот
  function tradeRow(tr, reload) {
    var a = el('article', 'pc-trow pc-' + tr.dir + (tr.fresh ? ' fresh' : '') + (tr.status !== 'open' ? ' done' : ''));
    var h = el('p', 'pc-trow-h'), nk = tr.who.nick ? '@' + tr.who.nick : '🐦';
    var whoA = tr.who.nick ? el('a', 'pc-owner', nk) : el('span', 'pc-owner', nk); if (tr.who.nick) whoA.href = birdUrl(tr.who.nick);
    var tpl = (tr.dir === 'in' ? T.tIn : T.tOut)[L].split('@{n}');
    h.appendChild(document.createTextNode(tpl[0])); h.appendChild(whoA); h.appendChild(document.createTextNode(tpl[1] || ''));
    if (tr.fresh) h.appendChild(el('span', 'pc-new', T.tNew[L]));
    h.appendChild(el('small', '', tr.status === 'open' ? fmt(T.tUntil[L], { d: dateOf(tr.expires) }) : T.st[tr.status] ? T.st[tr.status][L] : tr.status));
    a.appendChild(h);
    var get = tr.dir === 'in' ? tr.give : tr.take, pay = tr.dir === 'in' ? tr.take : tr.give;
    var row = el('div', 'pc-trow-x'), s1 = el('div', 'pc-trow-s'), s2 = el('div', 'pc-trow-s');
    s1.appendChild(el('span', 'pc-trow-l', T.tGet[L])); s1.appendChild(minis(get));
    s2.appendChild(el('span', 'pc-trow-l', T.tPay[L])); s2.appendChild(minis(pay));
    row.appendChild(s1); row.appendChild(el('span', 'pc-trow-arr', '⇄')); row.appendChild(s2); a.appendChild(row);
    if (tr.status === 'open') {
      var acts = el('div', 'pc-trow-act');
      var act = function (label, cls, path, sure, okMsg) {
        var b = el('button', 'pill-btn ' + cls, label); b.type = 'button';
        b.onclick = function () {
          if (sure && !confirm(sure)) return;
          b.disabled = true;
          postJ('/api/cards/trade/' + path, { id: tr.id }).then(function (x) {
            if (x.ok) { if (okMsg) say(okMsg); } else alert(errText(x.d));
            if (window.PPNews) window.PPNews.refresh();
            reload();
          }).catch(function () { alert(T.err[L]); b.disabled = false; });
        };
        acts.appendChild(b);
      };
      if (tr.dir === 'in') { act(T.accept[L], 'pill-fill pc-acc', 'accept', T.sureAcc[L], T.accOk[L]); act(T.decline[L], '', 'decline'); }
      else act(T.cancel[L], '', 'cancel');
      a.appendChild(acts);
    }
    return a;
  }
  // вкладка «🃏 Карточки» в профиле (/bird/): своя — обмены + мои карточки; чужая — карточки птички с «🔁 Обмен»
  function profile(root, o) {
    root.innerHTML = '<p class="sw-loading">…</p>';
    var q = '&order=album&lang=' + LANG, nick = o.nick;
    function load() {
      Promise.all([getJ('/api/cards?' + (o.mine ? 'show=mine' : 'owner=' + encodeURIComponent(nick)) + q), o.mine ? getJ('/api/cards/trades?lang=' + LANG) : null]).then(function (a) {
        var data = a[0], tr = a[1];
        root.innerHTML = '';
        if (!data) { root.appendChild(el('p', 'fl-all-lead', T.err[L])); return; }
        var wrap = el('div', 'pc-prof');
        if (o.mine) {
          var sec = el('section', 'pc-trades'); sec.id = 'trades';
          sec.appendChild(el('h3', 'pc-ph', T.myTrades[L]));
          var list = (tr && tr.trades) || [], open_ = list.filter(function (x) { return x.status === 'open'; }), past = list.filter(function (x) { return x.status !== 'open'; });
          if (!list.length) sec.appendChild(el('p', 'pc-rule', T.noTrades[L]));
          open_.sort(function (x, y) { return (x.dir === 'in' ? 0 : 1) - (y.dir === 'in' ? 0 : 1); }).forEach(function (x) { sec.appendChild(tradeRow(x, load)); });
          if (past.length) { var det = el('details', 'pc-past'); det.appendChild(el('summary', '', T.tPast[L] + ' · ' + past.length)); past.forEach(function (x) { det.appendChild(tradeRow(x, load)); }); sec.appendChild(det); }
          wrap.appendChild(sec);
        }
        wrap.appendChild(el('h3', 'pc-ph', o.mine ? T.myCards[L] : fmt(T.hisCards[L], { n: nick })));
        var grid = el('div', 'pc-grid');
        if (!data.cards.length) {
          var p0 = el('p', 'fl-all-lead', (o.mine ? T.noneMine[L] : fmt(T.noneHis[L], { n: nick })) + ' ');
          var a0 = el('a', 'pc-owner', T.toShop[L]); a0.href = pre + '/shop/#cards'; p0.appendChild(a0); wrap.appendChild(p0);
        }
        data.cards.forEach(function (c) { grid.appendChild(tile(c, { me: data.me, days: data.tradeDays, album: true, onBuy: load, onTrade: load })); });
        wrap.appendChild(grid);
        root.appendChild(wrap);
        if (o.scroll) { o.scroll = false; var t = root.querySelector('#trades'); if (t) t.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
      }).catch(function () { root.innerHTML = ''; root.appendChild(el('p', 'fl-all-lead', T.err[L])); });
    }
    load();
    return { reload: load };
  }
  // альбом птички (этап 7): разворот — две страницы (на телефоне одна, листание свайпом); по 6 уголков на странице:
  // сначала уникальные, потом редкие, потом обычные (по номеру), пустые места — бледные рамки. Нажатие на карточку — окно open().
  var TA = {
    album: ['🃏 Album of @{n}', '🃏 Альбом @{n}', '🃏 @{n} albums'], count: ['{n} cards', 'Карточек: {n}', 'Kartītes: {n}'],
    prev: ['Previous page', 'Предыдущая страница', 'Iepriekšējā lapa'], next: ['Next page', 'Следующая страница', 'Nākamā lapa'],
    empty: ['No cards yet — they are in the shop.', 'Карточек пока нет — они есть в магазине.', 'Kartīšu vēl nav — tās ir veikalā.'], shop: ['🃏 To the cards in the shop', '🃏 К карточкам в магазине', '🃏 Uz kartītēm veikalā'],
  };
  var PER = 6;
  function albumPages(cards) {
    var pages = [];
    ['unique', 'rare', 'common'].forEach(function (r) {
      var cs = cards.filter(function (c) { return c.rarity === r; }), n = Math.max(PER, Math.ceil(cs.length / PER) * PER);
      for (var i = 0; i < n; i += PER) pages.push({ r: r, slots: Array.apply(null, Array(PER)).map(function (_, j) { return cs[i + j] || null; }) });
    });
    return pages;
  }
  function album(nick, o) {
    o = o || {};
    var d = el('dialog', 'pc-dlg pc-alb'), x = el('button', 'pc-x', '✕'); x.type = 'button'; x.title = T.close[L]; x.onclick = function () { d.close(); };
    var head = el('div', 'pc-alb-h'); head.appendChild(el('h3', '', TA.album[L].replace('{n}', nick))); var cnt = el('span', 'pc-alb-n', '…'); head.appendChild(cnt);
    var book = el('div', 'pc-book'), nav = el('div', 'pc-alb-nav');
    var bp = el('button', 'pill-btn', '‹'), pn = el('span', 'pc-alb-pg'), bn = el('button', 'pill-btn', '›');
    bp.type = bn.type = 'button'; bp.setAttribute('aria-label', TA.prev[L]); bn.setAttribute('aria-label', TA.next[L]);
    nav.appendChild(bp); nav.appendChild(pn); nav.appendChild(bn);
    d.appendChild(x); d.appendChild(head); d.appendChild(book); d.appendChild(nav);
    d.addEventListener('close', function () { d.remove(); removeEventListener('resize', draw); });
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    document.body.appendChild(d); d.showModal();
    var pages = [], at = 0, data = null;
    var one = function () { return matchMedia('(max-width: 700px)').matches; };
    function page(pg, i) {
      var p = el('section', 'pc-page pc-pg-' + pg.r);
      p.appendChild(el('h4', 'pc-page-h', T[pg.r + 's'][L]));
      var g = el('div', 'pc-slots');
      pg.slots.forEach(function (c) {
        var s = el('div', 'pc-slot pc-slot-' + pg.r + (c ? '' : ' pc-slot-empty'));
        if (c) { var b = el('button', 'pc-open'); b.type = 'button'; b.title = c.title || ''; b.appendChild(card(c)); b.onclick = function () { open(c, Object.assign({ me: data && data.me }, o)); }; s.appendChild(b); }
        g.appendChild(s);
      });
      p.appendChild(g); p.appendChild(el('span', 'pc-page-n', String(i + 1)));
      return p;
    }
    function draw() {
      if (!pages.length) return;
      var step = one() ? 1 : 2; at = Math.max(0, Math.min(at - at % step, pages.length - 1));
      book.innerHTML = ''; book.classList.toggle('pc-book-one', step === 1);
      for (var i = at; i < at + step; i++) book.appendChild(pages[i] ? page(pages[i], i) : el('section', 'pc-page pc-page-blank'));
      pn.textContent = (step === 2 && pages[at + 1] ? (at + 1) + '–' + (at + 2) : String(at + 1)) + ' / ' + pages.length;
      bp.disabled = at === 0; bn.disabled = at + step >= pages.length;
    }
    var go = function (dir) { var step = one() ? 1 : 2, to = at + dir * step; if (to < 0 || to >= pages.length) return; at = to; draw(); book.classList.remove('pc-flip-l', 'pc-flip-r'); void book.offsetWidth; book.classList.add(dir > 0 ? 'pc-flip-r' : 'pc-flip-l'); };
    bp.onclick = function () { go(-1); }; bn.onclick = function () { go(1); };
    d.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1); });
    // свайп: тянуть влево — следующая страница
    var sx = null, sy = 0;
    book.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    book.addEventListener('touchend', function (e) { if (sx == null) return; var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null; if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1); });
    addEventListener('resize', draw);
    fetch('/api/cards?lang=' + LANG + '&order=album&owner=' + encodeURIComponent(nick), { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (dd) {
      data = dd || { cards: [] }; cnt.textContent = TA.count[L].replace('{n}', data.cards.length);
      pages = albumPages(data.cards); draw();
      if (!data.cards.length && data.me && data.me.nick === nick) { var a = el('a', 'pill-btn pc-alb-shop', TA.shop[L]); a.href = pre + '/shop/#cards'; var p = el('p', 'pc-alb-empty', TA.empty[L] + ' '); p.appendChild(a); d.insertBefore(p, nav); }
    }).catch(function () { cnt.textContent = '—'; });
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
      data.cards.forEach(function (c) { grid.appendChild(tile(c, { me: data.me, days: data.tradeDays, onBuy: function () { load(); }, onTrade: function () { load(); } })); });
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
  window.PPCards = { card: card, tile: tile, open: open, buy: buy, mount: mount, album: album, trade: trade, tradeCheck: tradeCheck, profile: profile, T: T, L: L };
  var auto = document.querySelector('[data-pp-cards]');
  if (auto) mount(auto);
})();
