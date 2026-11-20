// Адвент-календарь в кабинете (раздел «🎄 Адвент», admin.js): по датам — что лежит в каждом окошке; нажатие на день — положить вещи
// (весь каталог PPBirds, поиск, фильтры) или загрузить свой файл прямо с компьютера (не ссылкой): файл и превью — в R2 (advent/…), окно — advent_plan.
// Сервер: GET /api/advent (план — только админу), POST /api/admin/advent, POST /api/admin/advent/file.
(function () {
  var L = 1, me = null, box = null, draw = function () {};
  var T = {
    advAdd: ['＋ Add', '＋ Добавить', '＋ Pievienot'], advIn: ['In this window', 'В этом окошке', 'Šajā lodziņā'],
    advDayH: ['Tap things to put them in this window or take them out. Every bird who opens it on that day gets all of them.', 'Нажимайте на вещи, чтобы положить их в это окошко или убрать. Каждая птичка, открывшая окошко в этот день, получит их все.', 'Pieskaries lietām, lai ieliktu tās šajā lodziņā vai izņemtu. Katrs putniņš, kas atver lodziņu tajā dienā, saņem tās visas.'],
    advEmpty: ['empty — buttons', 'пусто — пуговки', 'tukšs — pogas'], advDec: ['December {d}', '{d} декабря', '{d}. decembris'], done: ['Done', 'Готово', 'Gatavs'],
    inkChip: ['ink course', 'курс туши', 'tušas kurss'],
    inkChipT: ['Every bird who opens this window on 24 December also gets the ink course (/ink/, 15 lessons) — it is not a thing in the plan, it opens by itself.',
      'Каждая птичка, открывшая окно 24 декабря, получает доступ к курсу туши (/ink/, 15 уроков) — это не вещь из плана, окно открывает его само.',
      'Katrs putniņš, kas 24. decembrī atver šo lodziņu, saņem arī tušas kursu (/ink/, 15 nodarbības) — tā nav lieta no plāna, lodziņš to atver pats.'],
    hint: ['Tap a day or “＋ Add”: you can put things from the shop into the window or upload your own file. ★ — special windows, the 31st is the legendary one. An empty window gives buttons.',
      'Нажмите на день или «＋ Добавить»: в окно можно положить вещи из магазина или загрузить свой файл. ★ — особые окошки, 31-е — легендарное. Пустое окошко даёт пуговки.',
      'Pieskaries dienai vai “＋ Pievienot”: lodziņā var ielikt lietas no veikala vai augšupielādēt savu failu. ★ — īpašie lodziņi, 31. — leģendārais. Tukšs lodziņš dod pogas.'],
    tabsShop: ['🎁 Things from the shop', '🎁 Вещи из магазина', '🎁 Lietas no veikala'], tabsFile: ['📎 Upload a file', '📎 Загрузить файл', '📎 Augšupielādēt failu'],
    upHint: ['Choose a file from your computer — any file up to 20 MB. The window will show a picture, a caption and “Download”. An image is its own preview; for an archive you can pick a picture.',
      'Выберите файл с компьютера — любой, до 20 МБ. В окне будет картинка, подпись и «Скачать». Картинка сама себе превью, для архива можно выбрать картинку.',
      'Izvēlieties failu no datora — jebkuru, līdz 20 MB. Lodziņā būs attēls, paraksts un “Lejupielādēt”. Attēls pats ir priekšskatījums; arhīvam var izvēlēties attēlu.'],
    pick: ['Choose a file', 'Выбрать файл', 'Izvēlēties failu'], drop: ['or drop it here · up to 20 MB', 'или перетащите сюда · до 20 МБ', 'vai velciet šurp · līdz 20 MB'],
    fname: ['File name', 'Имя файла', 'Faila nosaukums'], fcap: ['Caption under the picture', 'Подпись под картинкой', 'Paraksts zem attēla'],
    more3: ['also EN and LV', 'ещё EN и LV', 'vēl EN un LV'], fprev: ['Picture for the window (optional)', 'Картинка для окна (не обязательно)', 'Attēls lodziņam (nav obligāti)'],
    put: ['Put in the window', 'Положить в окно', 'Ielikt lodziņā'], putOk: ['Added to December {d}', 'Добавлено в {d} декабря', 'Pievienots {d}. decembrim'],
    uploading: ['Uploading…', 'Загружаю…', 'Augšupielādēju…'], filesHere: ['Files in this window', 'Файлы в этом окошке', 'Faili šajā lodziņā'],
    errBig: ['The file is bigger than 20 MB.', 'Файл больше 20 МБ.', 'Fails ir lielāks par 20 MB.'],
    errFile: ['Could not upload. Try again.', 'Не получилось. Попробуйте ещё раз.', 'Neizdevās. Mēģiniet vēlreiz.'],
    errType: ['The picture must be a JPG, PNG, WebP or GIF.', 'Картинка — только JPG, PNG, WebP или GIF.', 'Attēls — tikai JPG, PNG, WebP vai GIF.'],
    errStorage: ['Storage is not connected.', 'Хранилище не подключено.', 'Krātuve nav pievienota.'],
    errAdmin: ['You need to be signed in as the admin.', 'Нужен вход админа.', 'Jāienāk kā administratoram.'],
    confirmDel: ['Remove the file from this window? If nobody has opened it yet, the file itself is deleted too.', 'Убрать файл из этого окошка? Если его ещё никто не открывал, файл удалится совсем.', 'Noņemt failu no šī lodziņa? Ja to vēl neviens nav atvēris, fails tiks izdzēsts.'],
  };
  var ADV_SP = [6, 12, 19, 24, 31], plan = null; // особые окошки — как ADVENT_SPECIAL в worker/index.js
  var FILE_MAX = 20 * 1024 * 1024, PREV_MAX = 6 * 1024 * 1024, IMG = /^image\/(jpeg|png|webp|gif)$/;
  function advSet(day, k, v, on) {
    return fetch('/api/admin/advent', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ day: day, kind: k, item: v, on: on }) })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (x) { plan = x.plan; });
  }
  // файл в окне: {u: адрес файла, p: адрес превью, n: имя, c: {en, ru, lv} — подпись}
  function fileOf(item) { try { var o = JSON.parse(item); return o && o.u ? o : null; } catch (e) { return null; } }
  function extOf(n) { var p = String(n || '').split('.'); return p.length > 1 ? p.pop().toUpperCase().slice(0, 5) : 'FILE'; }
  function aday(day) { return T.advDec[L].replace('{d}', day) + (ADV_SP.indexOf(day) >= 0 ? ' ★' : ''); }
  function gname(k, v) { try { return window.PPBirds.giftName(k, v, L); } catch (e) { return k + ' ' + v; } }
  var kb = function (n) { return n < 1048576 ? Math.round(n / 1024) + ' КБ' : (n / 1048576).toFixed(1) + ' МБ'; };
  // значок файла: превью, если оно есть, иначе — формат (ZIP, PDF…)
  function fthumb(f, size) {
    var t = document.createElement('span'); t.className = 'fl-adv-fthumb'; t.style.width = t.style.height = (size || 44) + 'px';
    if (f && f.p) { var im = document.createElement('img'); im.src = f.p; im.alt = ''; im.loading = 'lazy'; t.appendChild(im); }
    else t.textContent = extOf(f && f.n);
    return t;
  }
  function errText(x) {
    var k = x && x.error;
    return k === 'big' ? T.errBig[L] : k === 'type' ? T.errType[L] : k === 'storage' ? T.errStorage[L] : k === 'admin' ? T.errAdmin[L] : T.errFile[L];
  }
  // файл убрать из окна: если его ещё никто не открывал, сервер удалит и сам файл из хранилища
  function delFile(day, item) {
    if (!confirm(T.confirmDel[L])) return null;
    return advSet(day, 'file', item, false);
  }

  // «📅 Адвент»: по датам — что лежит в каждом окошке (✕ убрать)
  function advBoard() {
    var id = me ? me.id : 2;
    for (var n = 1; n <= 31; n++) {
      var row = document.createElement('div'); row.className = 'fl-adv-row' + (ADV_SP.indexOf(n) >= 0 ? ' sp' : '') + (n === 31 ? ' leg' : '');
      var h = document.createElement('b'); h.textContent = aday(n); row.appendChild(h);
      var list = (plan || []).filter(function (p) { return p.day === n; });
      if (!list.length) { var e = document.createElement('small'); e.textContent = T.advEmpty[L]; row.appendChild(e); }
      list.forEach(function (p) {
        var it = document.createElement('span'), x = document.createElement('button');
        if (p.kind === 'file') { // файл в окне — превью или значок формата, при наведении — имя и подпись
          var f = fileOf(p.item) || {};
          it.className = 'fl-adv-it fl-adv-file'; it.title = (f.n || '') + ((f.c && f.c.ru) ? ' · ' + f.c.ru : '');
          it.appendChild(fthumb(f, 44));
          x.onclick = function () { var done = delFile(p.day, p.item); if (done) done.then(function () { draw(); }).catch(function () {}); };
        } else {
          it.className = 'fl-adv-it'; it.title = gname(p.kind, p.item);
          it.appendChild(window.PPBirds.itemIcon(p.kind, p.item, 44, id));
          x.onclick = function () { advSet(p.day, p.kind, p.item, false).then(function () { draw(); }).catch(function () {}); };
        }
        x.type = 'button'; x.textContent = '✕'; x.setAttribute('aria-label', '✕ ' + it.title);
        it.appendChild(x); row.appendChild(it);
      });
      // 24-е окно само открывает курс туши (INK_DAY в worker/index.js) — не вещь из плана, но видно, что окно не пустое
      if (n === 24) { var inkc = document.createElement('span'); inkc.className = 'fl-adv-ink'; inkc.textContent = '✒️ ' + T.inkChip[L]; inkc.title = T.inkChipT[L]; row.appendChild(inkc); }
      // «＋» и клик по дню — окно дня: вещи из магазина или свой файл
      var addB = document.createElement('button'); addB.type = 'button'; addB.className = 'fl-adv-add'; addB.textContent = T.advAdd[L];
      addB.onclick = (function (d) { return function () { advDayPick(d); }; })(n);
      h.onclick = addB.onclick; h.classList.add('fl-adv-day'); row.appendChild(addB);
      box.appendChild(row);
    }
  }

  // окно дня: вкладка «вещи из магазина» (общий каталог catalog-ui.js, режим выбора, несколько вещей) и «загрузить файл» (с компьютера)
  var dayState = {}; // вкладка и фильтры каталога — до перезагрузки
  function advDayPick(day) {
    var C = window.PPCatalog, d = document.createElement('dialog');
    d.className = 'fl-adv-dlg fl-adv-daydlg';
    var has = function (k, v) { return (plan || []).some(function (p) { return p.day === day && p.kind === k && p.item === v; }); };
    var cnt = function () { return (plan || []).filter(function (p) { return p.day === day; }).length; };
    var up = { file: null, prev: null };
    d.innerHTML = '<h3>' + aday(day) + ' · <span class="fl-adv-n"></span></h3>' +
      '<div class="fl-adv-tabs" role="tablist">' +
        '<button type="button" class="fl-adv-tab on" data-t="shop" role="tab" aria-selected="true">' + T.tabsShop[L] + '</button>' +
        '<button type="button" class="fl-adv-tab" data-t="file" role="tab" aria-selected="false">' + T.tabsFile[L] + '</button></div>' +
      '<div class="fl-adv-pane" data-p="shop"><p>' + T.advDayH[L] + '</p><div class="fl-adv-cat"></div></div>' +
      '<div class="fl-adv-pane" data-p="file" hidden>' +
        '<p>' + T.upHint[L] + '</p>' +
        '<label class="fl-adv-drop"><input type="file" data-f hidden><b>📎 ' + T.pick[L] + '</b><small>' + T.drop[L] + '</small></label>' +
        '<div class="fl-adv-chosen" data-chosen hidden></div>' +
        '<div class="fl-adv-fields"><label>' + T.fname[L] + '<input class="fl-adv-in" data-n maxlength="120"></label>' +
          '<label>' + T.fcap[L] + '<input class="fl-adv-in" data-c maxlength="160"></label></div>' +
        '<div class="fl-adv-more" data-more hidden><input class="fl-adv-in" data-ce placeholder="EN" maxlength="160"><input class="fl-adv-in" data-cl placeholder="LV" maxlength="160"></div>' +
        '<p class="fl-adv-note"><button type="button" class="fl-adv-link" data-show3>🌐 ' + T.more3[L] + '</button></p>' +
        '<label class="fl-adv-drop fl-adv-drop-sm" data-prevbox hidden><input type="file" data-p accept="image/jpeg,image/png,image/webp,image/gif" hidden><b>🖼 ' + T.fprev[L] + '</b></label>' +
        '<p class="fl-adv-msg" data-msg aria-live="polite"></p>' +
        '<p><button type="button" class="pill-btn pill-fill" data-send>' + T.put[L] + '</button></p>' +
        '<div class="fl-adv-files" data-files></div>' +
      '</div>' +
      '<button type="button" class="pill-btn pill-fill" data-x>' + T.done[L] + '</button>';
    var n = d.querySelector('.fl-adv-n'), upd = function () { n.textContent = T.advIn[L] + ': ' + cnt(); };
    upd(); document.body.appendChild(d); d.showModal();
    var $ = function (s) { return d.querySelector(s); };
    var say = function (t, bad) { var m = $('[data-msg]'); m.textContent = t || ''; m.classList.toggle('bad', !!bad); };
    var pb = document.createElement('span'); pb.className = 'fl-adv-pthumb'; pb.hidden = true; $('[data-prevbox]').appendChild(pb);

    C.browse($('.fl-adv-cat'), {
      mode: 'pick', state: dayState, id: me ? me.id : 2,
      mine: has, mineLabel: T.advIn[L],
      pick: { multi: true, has: has },
      onOpen: function (k, v, t) {
        var on = !has(k, v); C.mark(t, on); t.classList.add('busy');
        advSet(day, k, v, on).then(function () { t.classList.remove('busy'); upd(); files(); draw(); }).catch(function () { t.classList.remove('busy'); C.mark(t, !on); });
      },
    });

    // --- файл с компьютера ---
    function chosen() {
      var b = $('[data-chosen]'); b.innerHTML = '';
      if (!up.file) { b.hidden = true; return; }
      b.hidden = false;
      b.appendChild(fthumb(IMG.test(up.file.type || '') ? { p: URL.createObjectURL(up.file), n: up.file.name } : { n: up.file.name }, 44));
      var nm = document.createElement('span'); nm.className = 'nm';
      nm.textContent = up.file.name + ' · ' + kb(up.file.size) + (up.prev ? ' · ' + T.fprev[L] + ': ' + up.prev.name : '');
      b.appendChild(nm);
      var x = document.createElement('button'); x.type = 'button'; x.className = 'fl-adv-x'; x.textContent = '✕';
      x.onclick = function () { setFile(null); };
      b.appendChild(x);
    }
    function setFile(f) {
      up.file = f || null; up.prev = null;
      var pbox = $('[data-prevbox]'), pin = $('[data-p]');
      $('[data-f]').value = ''; pbox.hidden = true; pin.value = ''; pb.innerHTML = ''; pb.hidden = true;
      if (!up.file) { $('[data-n]').value = ''; say(''); chosen(); return; }
      if (up.file.size > FILE_MAX) { up.file = null; $('[data-f]').value = ''; say(T.errBig[L], true); chosen(); return; }
      $('[data-n]').value = up.file.name.slice(0, 120);
      pbox.hidden = IMG.test(up.file.type || ''); // картинка сама себе превью
      say(''); chosen();
    }
    $('[data-f]').onchange = function () { setFile(this.files && this.files[0]); };
    $('[data-p]').onchange = function () {
      var f = this.files && this.files[0]; up.prev = null; pb.innerHTML = ''; pb.hidden = true;
      if (!f) return chosen();
      if (!IMG.test(f.type || '')) { this.value = ''; return say(T.errType[L], true); }
      if (f.size > PREV_MAX) { this.value = ''; return say(T.errBig[L], true); }
      up.prev = f; pb.appendChild(fthumb({ p: URL.createObjectURL(f), n: f.name }, 38)); pb.hidden = false; say(''); chosen();
    };
    $('[data-show3]').onclick = function () { var m = $('[data-more]'); m.hidden = !m.hidden; this.hidden = m.hidden; if (!m.hidden) m.querySelector('input').focus(); };
    // перетащить файл в окно
    var drop = $('.fl-adv-drop');
    drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.classList.add('over'); });
    drop.addEventListener('dragleave', function () { drop.classList.remove('over'); });
    drop.addEventListener('drop', function (e) {
      e.preventDefault(); drop.classList.remove('over');
      var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) setFile(f);
    });
    function resetUp() {
      up.file = null; up.prev = null; $('[data-f]').value = ''; $('[data-p]').value = '';
      $('[data-prevbox]').hidden = true; pb.innerHTML = ''; pb.hidden = true;
      ['[data-n]', '[data-c]', '[data-ce]', '[data-cl]'].forEach(function (s) { d.querySelector(s).value = ''; });
      chosen();
    }
    $('[data-send]').onclick = function () {
      var btn = this;
      if (!up.file) return say(T.errFile[L], true);
      var ru = $('[data-c]').value.trim(), en = $('[data-ce]').value.trim(), lv = $('[data-cl]').value.trim();
      var fd = new FormData();
      fd.append('day', String(day)); fd.append('file', up.file, up.file.name);
      if (up.prev) fd.append('preview', up.prev, up.prev.name);
      fd.append('name', $('[data-n]').value.trim() || up.file.name);
      fd.append('c', JSON.stringify({ ru: ru, en: en || ru, lv: lv || ru })); // одна подпись — на всех языках
      btn.disabled = true; say(T.uploading[L]);
      fetch('/api/admin/advent/file', { method: 'POST', credentials: 'same-origin', body: fd })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (x) { if (!r.ok) throw x; return x; }); })
        .then(function (x) { plan = x.plan || plan; upd(); resetUp(); files(); draw(); say('✓ ' + T.putOk[L].replace('{d}', String(day))); })
        .catch(function (e) { say(errText(e), true); })
        .then(function () { btn.disabled = false; });
    };
    // что уже лежит в этом окошке из файлов (✕ убрать)
    function files() {
      var w = $('[data-files]'); w.innerHTML = '';
      var list = (plan || []).filter(function (p) { return p.day === day && p.kind === 'file'; });
      if (!list.length) return;
      var h = document.createElement('h4'); h.textContent = T.filesHere[L]; w.appendChild(h);
      list.forEach(function (p) {
        var f = fileOf(p.item) || {};
        var r = document.createElement('div'); r.className = 'fl-adv-frow';
        r.appendChild(fthumb(f, 38));
        var nm = document.createElement('span'); nm.className = 'nm';
        nm.textContent = (f.n || '') + ((f.c && f.c.ru) ? ' · ' + f.c.ru : '');
        r.appendChild(nm);
        var x = document.createElement('button'); x.type = 'button'; x.textContent = '✕'; x.setAttribute('aria-label', '✕ ' + (f.n || ''));
        x.onclick = function () {
          var done = delFile(day, p.item);
          if (done) done.then(function () { upd(); files(); draw(); }).catch(function () { say(T.errFile[L], true); });
        };
        r.appendChild(x); w.appendChild(r);
      });
    }
    // вкладки
    [].forEach.call(d.querySelectorAll('.fl-adv-tab'), function (b) {
      b.onclick = function () {
        [].forEach.call(d.querySelectorAll('.fl-adv-tab'), function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-selected', String(on)); });
        [].forEach.call(d.querySelectorAll('.fl-adv-pane'), function (p) { p.hidden = p.dataset.p !== b.dataset.t; });
        if (b.dataset.t === 'file') files();
      };
    });
    d.querySelector('[data-x]').onclick = function () { d.close(); d.remove(); draw(); };
    d.addEventListener('cancel', function () { d.remove(); draw(); });
  }

  window.PPAdventAdmin = {
    mount: function (el) {
      box = el; box.innerHTML = '<p class="be-note">Загрузка…</p>';
      draw = function () { box.innerHTML = '<p class="be-note">' + T.hint[L] + '</p>'; advBoard(); };
      fetch('/api/advent', { credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (x) { plan = x.plan || []; draw(); })
        .catch(function () { box.innerHTML = '<p class="be-note">Не получилось загрузить.</p>'; });
    },
  };
})();
