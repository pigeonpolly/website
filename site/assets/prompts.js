// /prompts/ — темы месяца (GET /api/challenge/month): лист в 5 видах (квадратики, кружочки, цветочки, номера, сетка месяца), цвета тем вкл/выкл, картинка 1080×1350 и печать в том же виде.
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

  // ---- вид листа: квадратики, кружочки, цветочки, просто номера, сетка месяца; цвета тем — да/нет (выбор помнится в браузере)
  var T = function (en, ru, lv) { return [en, ru, lv][LI]; };
  var STYLES = [
    ['box', '☐', T('Boxes', 'Квадратики', 'Rūtiņas')],
    ['circle', '◯', T('Circles', 'Кружочки', 'Aplīši')],
    ['flower', '✿', T('Flowers', 'Цветочки', 'Ziediņi')],
    ['num', '1.', T('Numbers', 'Просто номера', 'Tikai numuri')],
    ['cal', '▦', T('Month grid', 'Сетка месяца', 'Mēneša režģis')]
  ];
  var MIN = T('min', 'мин', 'min');
  var KICK = T('a small drawing every day', 'по маленькому рисунку в день', 'katru dienu mazs zīmējums');
  var FOOT = T('cross off the days you drew', 'зачёркивай нарисованные дни', 'atzīmē uzzīmētās dienas');
  function mem(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var style = mem('pr-style'); if (!STYLES.some(function (s) { return s[0] === style; })) style = 'box';
  var showCol = mem('pr-col') !== '0';
  var opts = document.getElementById('pr-opts');
  var FLOWER = '<svg viewBox="0 0 40 40" aria-hidden="true"><g><circle cx="20.0" cy="9.5" r="8.6"/><circle cx="30.0" cy="16.8" r="8.6"/><circle cx="26.2" cy="28.5" r="8.6"/><circle cx="13.8" cy="28.5" r="8.6"/><circle cx="10.0" cy="16.8" r="8.6"/></g><circle class="pr-fc" cx="20" cy="20" r="10"/></svg>';

  // цвета дня — как на /challenge/ (challenge-theme.js): индексы плана, день ЭКСТРА — палитра картины
  function colorsOf(x) {
    var D = window.CHALLENGE_DATA, CT = window.ChallengeTheme;
    if (!D || !x || !x.day) return [];
    var ALLC = D.colors.concat(D.moreColors || [], D.wheelColors || []);
    var old = null;
    try { old = CT ? CT.formulaFor(new Date(+x.day.slice(0, 4), +x.day.slice(5, 7) - 1, +x.day.slice(8, 10)), LI, true) : null; } catch (e) { old = null; }
    var P = window.EXTRA_PALETTES, pp = null;
    if (x.pal && old && old.extra && P) for (var i = 0; i < P.length; i++) if (P[i].k === x.pal) pp = P[i];
    if (pp) return pp.c.map(function (c) { return { hex: c[0], n: c[1 + LI] || c[1] }; });
    if (old && old.extra && old.pal) return old.colors.map(function (c) { return { hex: c.hex, n: c.n[LI] }; });
    return (x.colors || []).map(function (k) { return ALLC[k]; }).filter(Boolean).map(function (c) { return { hex: c.hex, n: c.n[LI] }; });
  }
  function loadJs(src) {
    return new Promise(function (ok, no) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
  }
  var colReady = loadJs('/assets/challenge-data.js')
    .then(function () { return loadJs('/api/extra-palettes.js').catch(function () { return loadJs('/assets/extra-palettes.js'); }); })
    .then(function () { return loadJs('/assets/challenge-theme.js'); })
    .then(function () { if (days.length) draw(); })
    .catch(function () { /* без цветов — лист и так работает */ });

  function dayDate(x) { return new Date(+x.day.slice(0, 4), +x.day.slice(5, 7) - 1, +x.day.slice(8, 10)); }
  function wdName(d, len) { try { var s = d.toLocaleString(L, { weekday: len || 'short' }); return s.charAt(0).toUpperCase() + s.slice(1).replace(/\.$/, ''); } catch (e) { return ''; } }
  function sw(cols) {
    return showCol && cols.length ? '<span class="pr-sw' + (cols.length > 3 ? ' pr-sw6' : '') + '">' + cols.map(function (c) {
      return '<i style="background:' + c.hex + '" title="' + esc(c.n || '') + '"></i>'; }).join('') + '</span>' : '';
  }
  function mark(n) {
    if (style === 'circle') return '<span class="pr-mk">' + n + '</span>';
    if (style === 'flower') return '<span class="pr-mk">' + FLOWER + '<b>' + n + '</b></span>';
    if (style === 'num') return '<span class="pr-n">' + (n < 10 ? '0' : '') + n + '</span>';
    return '<span class="pr-mk"></span><span class="pr-n">' + n + '</span>';
  }
  function monthDabs() {
    if (!showCol) return '';
    var seen = {}, out = [];
    days.forEach(function (x) { colorsOf(x).slice(0, 3).forEach(function (c) { if (!seen[c.hex] && out.length < 9) { seen[c.hex] = 1; out.push(c); } }); });
    return out.length ? '<span class="pr-dabs" aria-hidden="true">' + out.map(function (c) { return '<i style="background:' + c.hex + '"></i>'; }).join('') + '</span>' : '';
  }
  function drawOpts() {
    if (!opts) return;
    opts.innerHTML = '<div class="pr-styles" role="group">' + STYLES.map(function (s) {
      return '<button type="button" class="pr-st' + (s[0] === style ? ' on' : '') + '" data-st="' + s[0] + '" aria-pressed="' + (s[0] === style) + '"><span class="pr-ic pr-ic-' + s[0] + '" aria-hidden="true">' + (s[0] === 'flower' ? FLOWER : s[1]) + '</span>' + esc(s[2]) + '</button>';
    }).join('') + '</div><label class="pr-tog"><input type="checkbox" id="pr-col"' + (showCol ? ' checked' : '') + '><span class="pr-knob" aria-hidden="true"></span>🎨 ' + esc(T('Theme colours', 'Цвета тем', 'Tēmu krāsas')) + '</label>';
  }
  if (opts) opts.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-st]');
    if (!b) return;
    style = b.getAttribute('data-st'); mem('pr-style', style); drawOpts(); draw();
  });
  if (opts) opts.addEventListener('change', function (e) {
    if (e.target.id !== 'pr-col') return;
    showCol = e.target.checked; mem('pr-col', showCol ? '1' : '0'); draw();
  });
  // печать: сетка месяца — альбомный лист, списки — книжный
  var pageCss = document.createElement('style'); document.head.appendChild(pageCss);

  function draw() {
    pageCss.textContent = '@media print { @page { size: A4 ' + (style === 'cal' ? 'landscape; margin: 9mm' : 'portrait; margin: 11mm') + '; } }';
    g.className = 'pr-g pr-sheet pr-s-' + style + (showCol ? '' : ' pr-nocol');
    if (!days.length) { g.innerHTML = '<p class="pr-wait">—</p>'; return; }
    var hd = '<div class="pr-sh-hd"><div><span class="pr-kick">' + esc(KICK) + '</span><h3>' + esc(title) + '</h3></div>' + monthDabs() + '</div>';
    var ft = '<div class="pr-sh-ft"><span>✿ ' + esc(FOOT) + '</span><span>pigeonpolly.com/prompts</span></div>';
    var body;
    if (style === 'cal') {
      var lead = (dayDate(days[0]).getDay() + 6) % 7, cells = [], k;
      for (k = 0; k < 7; k++) cells.push('<span class="pr-wh">' + esc(wdName(new Date(2024, 0, 1 + k))) + '</span>');
      for (k = 0; k < lead; k++) cells.push('<span class="pr-c pr-c0"></span>');
      days.forEach(function (x) {
        var n = +x.day.slice(-2), t = (x.subject && x.subject[LI]) || '—';
        cells.push('<div class="pr-c"><span class="pr-ct"><b class="pr-n">' + n + '</b><span class="pr-wd">' + esc(wdName(dayDate(x))) + '</span>' + sw(colorsOf(x)) + '</span>' +
          '<span class="pr-t">' + esc(t) + '</span><span class="pr-cb"><span class="pr-time">' + (x.time ? x.time + ' ' + MIN : '') + '</span><span class="pr-mk"></span></span></div>');
      });
      while (cells.length % 7) cells.push('<span class="pr-c pr-c0"></span>');
      body = '<div class="pr-cal">' + cells.join('') + '</div>';
    } else {
      body = '<ol class="pr-list" style="--rows:' + Math.ceil(days.length / 2) + '">' + days.map(function (x) {
        var n = +x.day.slice(-2), t = (x.subject && x.subject[LI]) || '—';
        return '<li class="pr-d">' + mark(n) + '<span class="pr-tx"><span class="pr-t">' + esc(t) + '</span>' +
          '<span class="pr-meta">' + esc(wdName(dayDate(x))) + (x.time ? ' · ' + x.time + ' ' + MIN : '') + '</span></span>' + sw(colorsOf(x)) + '</li>';
      }).join('') + '</ol>';
    }
    g.innerHTML = hd + body + ft;
  }
  drawOpts();
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

  // ---- картинка 1080×1350 в выбранном виде (с цветами или без): весь месяц на одной странице, чтобы сохранить на телефон
  function wrap(x, text, maxW, maxL) {
    var words = String(text).split(' '), lines = [], line = '';
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + ' ' + words[i] : words[i];
      if (x.measureText(test).width > maxW && line) { lines.push(line); line = words[i]; }
      else line = test;
    }
    if (line) lines.push(line);
    maxL = maxL || 2;
    if (lines.length > maxL) { lines = lines.slice(0, maxL); lines[maxL - 1] = lines[maxL - 1].replace(/\s+\S*$/, '') + '…'; }
    return lines;
  }
  var INK = '#2A2620', RUST = '#C4552D', SOFT = '#8A6A58';
  function rr(x, X, Y, w, h, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); }
  function dots(x, cols, X, Y, r, gap) { // X — правый край, Y — центр
    cols.forEach(function (c, i) {
      var cx = X - r - (cols.length - 1 - i) * (r * 2 + gap);
      x.beginPath(); x.arc(cx, Y, r, 0, Math.PI * 2); x.fillStyle = c.hex; x.fill();
      x.lineWidth = 1.5; x.strokeStyle = 'rgba(42,38,32,.25)'; x.stroke();
    });
  }
  function flower(x, cx, cy, s) {
    x.beginPath();
    for (var i = 0; i < 5; i++) { var a = -Math.PI / 2 + i * Math.PI * 2 / 5; x.moveTo(cx + Math.cos(a) * s * .5 + s * .42, cy + Math.sin(a) * s * .5); x.arc(cx + Math.cos(a) * s * .5, cy + Math.sin(a) * s * .5, s * .42, 0, Math.PI * 2); }
    x.fillStyle = '#FFFDF8'; x.fill(); x.lineWidth = 2.5; x.strokeStyle = RUST; x.stroke();
    x.beginPath(); x.arc(cx, cy, s * .62, 0, Math.PI * 2); x.fillStyle = '#FFFDF8'; x.fill();
  }

  function makeImage() {
    var W = 1080, H = 1350, c = document.createElement('canvas');
    c.width = W; c.height = H;
    var x = c.getContext('2d'), M = 64;
    x.fillStyle = '#F4ECDD'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#FFFDF8'; rr(x, 28, 28, W - 56, H - 56, 26); x.fill();
    x.strokeStyle = RUST; x.lineWidth = 4; x.stroke();
    x.textBaseline = 'alphabetic'; x.textAlign = 'left';
    x.fillStyle = SOFT; x.font = '400 28px Karla, Arial, sans-serif'; x.fillText(KICK.toUpperCase(), M + 2, 112);
    x.fillStyle = INK; x.font = '700 72px Fraunces, Georgia, serif'; x.fillText(title, M, 190);
    if (showCol) { // мазки цветов месяца справа от заголовка
      var seen = {}, dab = [];
      days.forEach(function (d) { colorsOf(d).slice(0, 3).forEach(function (k) { if (!seen[k.hex] && dab.length < 9) { seen[k.hex] = 1; dab.push(k); } }); });
      dots(x, dab, W - M, 100, 13, 7);
    }
    x.strokeStyle = 'rgba(196,85,45,.35)'; x.lineWidth = 2; x.setLineDash([2, 8]); x.beginPath(); x.moveTo(M, 236); x.lineTo(W - M, 236); x.stroke(); x.setLineDash([]);
    var top = 270, bot = H - 118;
    if (style === 'cal') {
      var lead = (dayDate(days[0]).getDay() + 6) % 7, weeks = Math.ceil((lead + days.length) / 7);
      var cw = (W - 2 * M) / 7, ch = (bot - top - 40) / weeks;
      x.fillStyle = SOFT; x.font = '700 22px Karla, Arial, sans-serif'; x.textAlign = 'center';
      for (var k = 0; k < 7; k++) x.fillText(wdName(new Date(2024, 0, 1 + k)).toUpperCase(), M + cw * k + cw / 2, top + 22);
      x.textAlign = 'left';
      days.forEach(function (d, i) {
        var p = lead + i, X = M + (p % 7) * cw, Y = top + 40 + Math.floor(p / 7) * ch;
        rr(x, X + 4, Y + 4, cw - 8, ch - 8, 12); x.fillStyle = (p % 7) > 4 ? '#FBF3E8' : '#FFFDF8'; x.fill();
        x.strokeStyle = 'rgba(42,38,32,.16)'; x.lineWidth = 1.5; x.stroke();
        x.fillStyle = RUST; x.font = '700 28px Fraunces, Georgia, serif'; x.fillText(String(+d.day.slice(-2)), X + 14, Y + 38);
        if (showCol) { var cs = colorsOf(d); dots(x, cs, X + cw - 14, Y + 27, cs.length > 3 ? 4 : 7, cs.length > 3 ? 2 : 3); }
        x.fillStyle = INK; x.font = '400 18px Karla, Arial, sans-serif';
        var t = (d.subject && d.subject[LI]) || '—', ml = Math.max(2, Math.floor((ch - 68) / 20));
        wrap(x, t, cw - 24, ml).forEach(function (ln, j) { x.fillText(ln, X + 12, Y + 62 + j * 20); });
        x.strokeStyle = 'rgba(42,38,32,.4)'; x.lineWidth = 2; x.beginPath(); x.arc(X + cw - 22, Y + ch - 22, 7, 0, Math.PI * 2); x.stroke();
      });
    } else {
      var rows = Math.ceil(days.length / 2), colW = (W - 2 * M - 48) / 2, rowH = (bot - top) / rows;
      days.forEach(function (d, i) {
        var col = Math.floor(i / rows), row = i % rows, X = M + col * (colW + 48), Y = top + row * rowH, cy = Y + rowH / 2;
        var n = +d.day.slice(-2), tx = X;
        x.lineWidth = 2.5; x.strokeStyle = style === 'box' ? 'rgba(42,38,32,.55)' : RUST;
        if (style === 'box') {
          rr(x, X, cy - 15, 30, 30, 6); x.stroke();
          x.fillStyle = RUST; x.font = '700 28px Fraunces, Georgia, serif'; x.fillText(String(n), X + 44, cy + 10); tx = X + 92;
        } else if (style === 'circle' || style === 'flower') {
          if (style === 'circle') { x.beginPath(); x.arc(X + 22, cy, 21, 0, Math.PI * 2); x.stroke(); } else flower(x, X + 22, cy, 27);
          x.fillStyle = RUST; x.font = '700 ' + (style === 'flower' ? 18 : 21) + 'px Fraunces, Georgia, serif'; x.textAlign = 'center'; x.fillText(String(n), X + 22, cy + 7); x.textAlign = 'left'; tx = X + 60;
        } else {
          x.fillStyle = RUST; x.font = '700 34px Fraunces, Georgia, serif'; x.fillText((n < 10 ? '0' : '') + n, X, cy + 12); tx = X + 58;
        }
        var cs = showCol ? colorsOf(d) : [], r = cs.length > 3 ? 6 : 8, swW = cs.length ? cs.length * (r * 2 + 4) + 8 : 0;
        x.fillStyle = INK; x.font = '400 23px Karla, Arial, sans-serif';
        var t = (d.subject && d.subject[LI]) || '—', ls = wrap(x, t, X + colW - tx - swW, 2);
        var y0 = cy + 8 - (ls.length - 1) * 13;
        ls.forEach(function (ln, j) { x.fillText(ln, tx, y0 + j * 27); });
        if (cs.length) dots(x, cs, X + colW, cy, r, 4);
        if (row < rows - 1) { x.strokeStyle = 'rgba(42,38,32,.08)'; x.lineWidth = 1; x.beginPath(); x.moveTo(X, Y + rowH); x.lineTo(X + colW, Y + rowH); x.stroke(); }
      });
    }
    x.fillStyle = SOFT; x.font = '400 25px Karla, Arial, sans-serif'; x.textAlign = 'left';
    x.fillText('✿ ' + FOOT, M, H - 66);
    x.textAlign = 'right'; x.fillStyle = RUST; x.font = '700 25px Karla, Arial, sans-serif'; x.fillText('pigeonpolly.com/prompts', W - M, H - 66);
    return c;
  }

  function download() {
    if (!days.length) return;
    var fonts = document.fonts && document.fonts.load ? Promise.all([document.fonts.load('700 40px Fraunces'), document.fonts.load('400 20px Karla'), document.fonts.load('700 20px Karla')]).catch(function () {}) : Promise.resolve();
    Promise.all([fonts, colReady]).then(function () {
      try {
        var c = makeImage();
        var a = document.createElement('a');
        a.download = 'polly-prompts-' + ym(cur) + '-' + style + '.png';
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
    });
  }
  if (prev) prev.addEventListener('click', function () { load(shift(cur, -1)); });
  if (next) next.addEventListener('click', function () { load(shift(cur, 1)); });
  if (pr) pr.addEventListener('click', function () { window.print(); });
  if (save) save.addEventListener('click', download);
  load(cur);
})();
