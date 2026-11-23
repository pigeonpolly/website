// /prompts/ — темы месяца (GET /api/challenge/month): карточки, картинка 1080×1350 для телефона и Pinterest, печать.
(function () {
  var g = document.getElementById('pr-g');
  if (!g) return;
  var L = (document.documentElement.lang || 'en').slice(0, 2);
  var LI = { en: 0, ru: 1, lv: 2 }[L] || 0;
  var now = new Date();
  var first = { y: now.getFullYear(), m: now.getMonth() + 1 };          // текущий месяц
  var last = shift(first, now.getDate() >= 20 ? 1 : 0);                  // следующий открывается с 20-го; Алине (admin) дальше — любой месяц, где все дни заполнены
  var got = {}, admin = null;                                            // admin: null — ещё не знаем
  var who = fetch('/api/whoami', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) { admin = !!(d && d.user && d.user.admin); }).catch(function () { admin = false; });                                                          // ym → days (кэш ответов)
  var days = [], title = '';
  var cur = now.getDate() >= 20 ? last : first;                        // с 20-го открываем месяц вперёд
  var mEl = document.getElementById('pr-m');
  var prev = document.getElementById('pr-prev');
  var next = document.getElementById('pr-next');
  var pr = document.getElementById('pr-print');
  var save = document.getElementById('pr-save');

  function shift(o, k) { var d = new Date(o.y, o.m - 1 + k, 1); return { y: d.getFullYear(), m: d.getMonth() + 1 }; }
  function ym(o) { return o.y + '-' + ('0' + o.m).slice(-2); }
  function before(a, b) { return a.y < b.y || (a.y === b.y && a.m < b.m); }
  function label(o) {
    var mn;
    try { mn = new Date(o.y, o.m - 1, 1).toLocaleString(L, { month: 'long' }); }
    catch (e) { return ym(o); }
    mn = mn.charAt(0).toUpperCase() + mn.slice(1);
    return mn + ' ' + o.y;
  }
  function esc(s) { return String(s).replace(/[<>&]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]; }); }

  function draw() {
    g.innerHTML = days.length ? days.map(function (x) {
      var t = (x.subject && x.subject[LI]) || '—';
      return '<div class="pr-d"><span class="pr-n">' + (+x.day.slice(-2)) + '</span>' +
        '<span class="pr-t">' + esc(t) + '</span>' +
        '<span class="pr-time">' + (x.time ? x.time + ' min' : '') + '</span>' +
        '<span class="pr-box" aria-hidden="true"></span></div>';
    }).join('') : '<p class="pr-wait">—</p>';
  }

  function full(d) { return d && d.length && d.every(function (x) { return x.subject && x.subject[0]; }); }
  function get(o) {
    var k = ym(o);
    if (got[k]) return Promise.resolve(got[k]);
    return fetch('/api/challenge/month?m=' + k, { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (!d || !d.days) throw new Error('no'); got[k] = d.days; return d.days; });
  }
  // только Алине: следующий месяц уже заполнен целиком — пускаем стрелку «→» к нему
  function probe(o) {
    if (admin === null) { who.then(function () { probe(o); }); return; }
    if (!admin) return;
    var n = shift(o, 1);
    if (!before(last, n)) return;
    get(n).then(function (d) {
      if (!full(d) || before(n, last) || ym(o) !== ym(cur)) return;
      last = n;
      if (next) next.disabled = false;
    }).catch(function () {});
  }

  function load(o) {
    if (before(o, first) || before(last, o)) return;
    cur = o;
    title = label(o);
    if (mEl) mEl.textContent = title;
    if (prev) prev.disabled = !before(first, o);
    if (next) next.disabled = !before(o, last);
    g.innerHTML = '<p class="pr-wait">…</p>';
    get(o)
      .then(function (d) { if (ym(o) !== ym(cur)) return; days = d; draw(); probe(o); })
      .catch(function () { days = []; g.innerHTML = '<p class="pr-wait">…</p>'; });
  }

  // ---- картинка 1080×1350: весь месяц на одной странице, чтобы сохранить на телефон
  function wrap(x, text, maxW) {
    var words = String(text).split(' '), lines = [], line = '';
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + ' ' + words[i] : words[i];
      if (x.measureText(test).width > maxW && line) { lines.push(line); line = words[i]; }
      else line = test;
    }
    if (line) lines.push(line);
    if (lines.length > 2) { lines = lines.slice(0, 2); lines[1] = lines[1].replace(/\s+\S*$/, '') + '…'; }
    return lines;
  }

  function makeImage() {
    var W = 1080, H = 1350, c = document.createElement('canvas');
    c.width = W; c.height = H;
    var x = c.getContext('2d');
    x.fillStyle = '#F4ECDD'; x.fillRect(0, 0, W, H);
    x.strokeStyle = '#C4552D'; x.lineWidth = 5; x.strokeRect(26, 26, W - 52, H - 52);
    x.fillStyle = '#2A2620'; x.textBaseline = 'alphabetic';
    x.font = '700 64px Fraunces, Georgia, serif'; x.fillText(title, 66, 150);
    x.fillStyle = '#8A6A58'; x.font = '400 30px Karla, Arial, sans-serif';
    x.fillText('30 prompts · pigeonpolly.com/prompts', 68, 200);
    var cols = 3, gap = 22, cw = (W - 132 - gap * 2) / cols, top = 280;
    var rows = Math.ceil(days.length / cols), rowH = (H - top - 110) / rows;
    days.forEach(function (d, i) {
      var col = Math.floor(i / rows), row = i % rows;
      var cx = 66 + col * (cw + gap), cy = top + row * rowH;
      x.fillStyle = '#C4552D'; x.font = '700 30px Fraunces, Georgia, serif';
      x.fillText(String(+d.day.slice(-2)), cx, cy);
      x.fillStyle = '#2A2620'; x.font = '400 25px Karla, Arial, sans-serif';
      var t = (d.subject && d.subject[LI]) || '—';
      wrap(x, t, cw - 46).forEach(function (ln, k) { x.fillText(ln, cx + 44, cy + k * 31); });
    });
    x.fillStyle = '#8A6A58'; x.font = '400 26px Karla, Arial, sans-serif';
    x.fillText('pigeonpolly.com', 66, H - 62);
    return c;
  }

  function download() {
    if (!days.length) return;
    try {
      var c = makeImage();
      var a = document.createElement('a');
      a.download = 'polly-prompts-' + ym(cur) + '.png';
      if (c.toBlob) {
        c.toBlob(function (b) {
          a.href = URL.createObjectURL(b);
          document.body.appendChild(a); a.click(); a.remove();
        }, 'image/png');
      } else {
        a.href = c.toDataURL('image/png');
        document.body.appendChild(a); a.click(); a.remove();
      }
    } catch (e) { /* без canvas — просто ничего */ }
  }

  if (prev) prev.addEventListener('click', function () { load(shift(cur, -1)); });
  if (next) next.addEventListener('click', function () { load(shift(cur, 1)); });
  if (pr) pr.addEventListener('click', function () { window.print(); });
  if (save) save.addEventListener('click', download);
  load(cur);
})();
