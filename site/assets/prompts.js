// /prompts/ — список тем месяца (GET /api/challenge/month): 30 карточек, время, чекбокс, печать.
(function () {
  var g = document.getElementById('pr-g');
  if (!g) return;
  var L = (document.documentElement.lang || 'en').slice(0, 2);
  var LI = { en: 0, ru: 1, lv: 2 }[L] || 0;
  var now = new Date();
  var first = { y: now.getFullYear(), m: now.getMonth() + 1 };          // текущий месяц
  var last = shift(first, now.getDate() >= 20 ? 1 : 0);                  // следующий открывается с 20-го
  var cur = first;
  var mEl = document.getElementById('pr-m');
  var prev = document.getElementById('pr-prev');
  var next = document.getElementById('pr-next');
  var pr = document.getElementById('pr-print');

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

  function draw(d) {
    var days = (d && d.days) || [];
    g.innerHTML = days.length ? days.map(function (x) {
      var t = (x.subject && x.subject[LI]) || '—';
      return '<div class="pr-d"><span class="pr-n">' + (+x.day.slice(-2)) + '</span>' +
        '<span class="pr-t">' + esc(t) + '</span>' +
        '<span class="pr-time">' + (x.time ? x.time + ' min' : '') + '</span>' +
        '<span class="pr-box" aria-hidden="true"></span></div>';
    }).join('') : '<p class="pr-wait">—</p>';
  }

  function load(o) {
    if (before(o, first) || before(last, o)) return;
    cur = o;
    if (mEl) mEl.textContent = label(o);
    if (prev) prev.disabled = !before(first, o);
    if (next) next.disabled = !before(o, last);
    g.innerHTML = '<p class="pr-wait">…</p>';
    fetch('/api/challenge/month?m=' + ym(o), { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (!d || !d.days) throw new Error('no'); draw(d); })
      .catch(function () { g.innerHTML = '<p class="pr-wait">…</p>'; });
  }

  if (prev) prev.addEventListener('click', function () { load(shift(cur, -1)); });
  if (next) next.addEventListener('click', function () { load(shift(cur, 1)); });
  if (pr) pr.addEventListener('click', function () { window.print(); });
  load(cur);
})();
