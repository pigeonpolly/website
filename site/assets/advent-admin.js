// Адвент-календарь в кабинете (раздел «🎄 Адвент», admin.js): по датам — что лежит в каждом окошке; нажатие на день — выбрать вещи
// (весь каталог PPBirds, поиск, фильтры по видам и темам). Сервер: GET /api/advent (план — только админу), POST /api/admin/advent.
(function () {
  var L = 1, me = null, box = null, draw = function () {};
  var T = {
    adv: ['📅 Advent', '📅 Адвент', '📅 Advente'], advT: ['Advent windows for “{n}”', 'Окошки адвента для «{n}»', 'Adventes lodziņi lietai “{n}”'],
    advH: ['🔒 Only you see this. Tap the days this thing should be in. Every bird who opens the window on its day gets all the things in it; an empty window gives buttons. ★ — special windows, the 31st is the legendary one.',
      '🔒 Видите только вы. Отметьте дни, в окошках которых будет эта вещь. Каждая птичка, открывшая окошко в его день, получит все вещи из него; пустое окошко даёт пуговки. ★ — особые окошки, 31-е — легендарное.',
      '🔒 Redzi tikai tu. Atzīmē dienas, kuru lodziņos būs šī lieta. Katrs putniņš, kas atver lodziņu tā dienā, saņem visas tajā esošās lietas; tukšs lodziņš dod pogas. ★ — īpašie lodziņi, 31. — leģendārais.'],
    advLegend: ['Inside each day you see what is already in that window. Dark — this thing is there.', 'В каждом дне видно, что уже лежит в этом окошке. Тёмный — там эта вещь.', 'Katrā dienā redzams, kas jau ir šajā lodziņā. Tumšs — tur ir šī lieta.'],
    advAdd: ['＋ Add things', '＋ Добавить вещи', '＋ Pievienot lietas'], advIn: ['In this window', 'В этом окошке', 'Šajā lodziņā'],
    advDayH: ['Tap things to put them in this window or take them out. Every bird who opens it on that day gets all of them.', 'Нажимайте на вещи, чтобы положить их в это окошко или убрать. Каждая птичка, открывшая окошко в этот день, получит их все.', 'Pieskaries lietām, lai ieliktu tās šajā lodziņā vai izņemtu. Katrs putniņš, kas atver lodziņu tajā dienā, saņem tās visas.'],
    advEmpty: ['empty — buttons', 'пусто — пуговки', 'tukšs — pogas'], advDec: ['December {d}', '{d} декабря', '{d}. decembris'], done: ['Done', 'Готово', 'Gatavs'],
    all: ['All', 'Все', 'Visi'],
  };
  var ADV_SP = [6, 12, 19, 24, 31], plan = null; // особые окошки — как ADVENT_SPECIAL в worker/index.js
  var advKey = function (k, v) { return k + '|' + v; };
  function advDays(k, v) { return (plan || []).filter(function (p) { return p.kind === k && p.item === v; }).map(function (p) { return p.day; }); }
  function advSet(day, k, v, on) {
    return fetch('/api/admin/advent', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ day: day, kind: k, item: v, on: on }) })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (x) { plan = x.plan; });
  }
  // окно выбора дней для вещи
  function advPick(k, v) {
    var B = window.PPBirds, d = document.createElement('dialog'); d.className = 'fl-adv-dlg';
    var draw2 = function () {
      var on = advDays(k, v);
      d.innerHTML = '<h3>' + T.advT[L].replace('{n}', B.giftName(k, v, L)) + '</h3><p>' + T.advH[L] + ' ' + T.advLegend[L] + '</p><div class="fl-adv-days">' +
        Array.from({ length: 31 }, function (_, i) { var n = i + 1; return '<button type="button" data-d="' + n + '" aria-pressed="' + (on.indexOf(n) >= 0) + '" class="' + (ADV_SP.indexOf(n) >= 0 ? 'sp' : '') + (n === 31 ? ' leg' : '') + '">' + n + (ADV_SP.indexOf(n) >= 0 ? '★' : '') + '</button>'; }).join('') +
        '</div><button type="button" class="pill-btn pill-fill" data-x>' + T.done[L] + '</button>';
      d.querySelector('[data-x]').onclick = function () { d.close(); d.remove(); draw(); };
      // в каждом дне — что уже лежит в этом окошке (картинки, при наведении — названия)
      [].forEach.call(d.querySelectorAll('[data-d]'), function (b) {
        var n = +b.dataset.d, inDay = (plan || []).filter(function (p) { return p.day === n; });
        if (!inDay.length) return;
        b.title = inDay.map(function (p) { return B.giftName(p.kind, p.item, L); }).join(', ');
        var mini = document.createElement('span'); mini.className = 'fl-adv-mini';
        inDay.slice(0, 3).forEach(function (p) { mini.appendChild(B.itemIcon(p.kind, p.item, 22, me ? me.id : 2)); });
        if (inDay.length > 3) { var more = document.createElement('em'); more.textContent = '+' + (inDay.length - 3); mini.appendChild(more); }
        b.appendChild(mini); b.classList.add('has');
      });
      [].forEach.call(d.querySelectorAll('[data-d]'), function (b) { b.onclick = function () { b.disabled = true; advSet(+b.dataset.d, k, v, b.getAttribute('aria-pressed') !== 'true').then(draw2).catch(function () { b.disabled = false; }); }; });
    };
    draw2(); document.body.appendChild(d); d.showModal();
    d.addEventListener('cancel', function () { d.remove(); draw(); });
  }
  // «📅 Адвент»: по датам — что лежит в каждом окошке (✕ убрать)
  function advBoard() {
    var B = window.PPBirds, id = me ? me.id : 2;
    for (var n = 1; n <= 31; n++) {
      var row = document.createElement('div'); row.className = 'fl-adv-row' + (ADV_SP.indexOf(n) >= 0 ? ' sp' : '') + (n === 31 ? ' leg' : '');
      var h = document.createElement('b'); h.textContent = T.advDec[L].replace('{d}', n) + (ADV_SP.indexOf(n) >= 0 ? ' ★' : ''); row.appendChild(h);
      var list = (plan || []).filter(function (p) { return p.day === n; });
      if (!list.length) { var e = document.createElement('small'); e.textContent = T.advEmpty[L]; row.appendChild(e); }
      list.forEach(function (p) {
        var it = document.createElement('span'); it.className = 'fl-adv-it'; it.title = B.giftName(p.kind, p.item, L);
        it.appendChild(B.itemIcon(p.kind, p.item, 44, id));
        var x = document.createElement('button'); x.type = 'button'; x.textContent = '✕'; x.setAttribute('aria-label', '✕ ' + it.title);
        x.onclick = function () { advSet(p.day, p.kind, p.item, false).then(draw); };
        it.appendChild(x); row.appendChild(it);
      });
      // «＋» и клик по дню — выбрать вещи для этого окошка
      var addB = document.createElement('button'); addB.type = 'button'; addB.className = 'fl-adv-add'; addB.textContent = T.advAdd[L];
      addB.onclick = (function (d) { return function () { advDayPick(d); }; })(n); row.appendChild(addB);
      h.onclick = addB.onclick; h.classList.add('fl-adv-day');
      box.appendChild(row);
    }
  }
  // окно дня: общий каталог (catalog-ui.js, режим выбора, несколько вещей) — нажатие кладёт вещь в окошко или убирает
  var dayState = {}; // вкладка и фильтры — до перезагрузки
  function advDayPick(day) {
    var C = window.PPCatalog, d = document.createElement('dialog');
    d.className = 'fl-adv-dlg fl-adv-daydlg';
    var has = function (k, v) { return (plan || []).some(function (p) { return p.day === day && p.kind === k && p.item === v; }); };
    var cnt = function () { return (plan || []).filter(function (p) { return p.day === day; }).length; };
    d.innerHTML = '<h3>' + T.advDec[L].replace('{d}', day) + (ADV_SP.indexOf(day) >= 0 ? ' ★' : '') + ' · <span class="fl-adv-n"></span></h3><p>' + T.advDayH[L] + '</p>' +
      '<div class="fl-adv-cat"></div><button type="button" class="pill-btn pill-fill" data-x>' + T.done[L] + '</button>';
    var n = d.querySelector('.fl-adv-n'), upd = function () { n.textContent = T.advIn[L] + ': ' + cnt(); };
    upd(); document.body.appendChild(d); d.showModal();
    C.browse(d.querySelector('.fl-adv-cat'), {
      mode: 'pick', state: dayState, id: me ? me.id : 2,
      mine: has, mineLabel: T.advIn[L],
      pick: { multi: true, has: has },
      onOpen: function (k, v, t) {
        var on = !has(k, v); C.mark(t, on); t.classList.add('busy');
        advSet(day, k, v, on).then(function () { t.classList.remove('busy'); upd(); }).catch(function () { t.classList.remove('busy'); C.mark(t, !on); });
      },
    });
    d.querySelector('[data-x]').onclick = function () { d.close(); d.remove(); draw(); };
    d.addEventListener('cancel', function () { d.remove(); draw(); });
  }


  window.PPAdventAdmin = {
    mount: function (el) {
      box = el; box.innerHTML = '<p class="be-note">Загрузка…</p>';
      draw = function () { box.innerHTML = '<p class="be-note">' + T.advDayH[L] + ' Нажмите на день или «＋ Добавить вещи». ★ — особые окошки, 31-е — легендарное. Пустое окошко даёт пуговки.</p>'; advBoard(); };
      fetch('/api/advent', { credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (x) { plan = x.plan || []; draw(); })
        .catch(function () { box.innerHTML = '<p class="be-note">Не получилось загрузить.</p>'; });
    },
  };
})();
