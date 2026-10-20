// Вылупление (этап 14, docs/site.md «Главная»): пиксельное яйцо, трещины и птичка из скорлупы, окно «Добро пожаловать», воронка «🥚 Вылупи».
// PPHatch.egg(canvas) — яйцо на холсте SW×SH (как маленькая птичка birds.js); PPHatch.play(canvas, sprite) → Promise — трескается, появляется птичка;
// PPHatch.welcome({ nick, welcome: {kind, item, btn}, avatar }) → Promise (закрыли окно); PPHatch.click() — нажали «Вылупи» (воронка и метка до входа).
// html.me-in — вошедший с ником (главная показывает «Мой день» вместо приветствия); localStorage pp-in — чтобы при следующем заходе не мигало.
(() => {
  const L = { en: 0, ru: 1, lv: 2 }[document.documentElement.lang] ?? 0, pre = ['', '/ru', '/lv'][L];
  const T = {
    hi: [n => `Bird @${n} has hatched!`, n => `Птичка @${n} вылупилась!`, n => `Putniņš @${n} ir izšķīlies!`],
    best: ['The best thing that ever happened to this egg.', 'Лучшее, что случалось с этим яйцом.', 'Labākais, kas jebkad noticis ar šo olu.'],
    gift: ['A welcome gift', 'Подарок новичку', 'Dāvana jaunpienācējam'],
    wear: ['Put on', 'Надеть', 'Uzvilkt'],
    worn: ['✓ Wearing it', '✓ Надето', '✓ Uzvilkts'],
    btns: [n => `+${n} 🔘 buttons to start with`, n => `+${n} 🔘 пуговок на старт`, n => `+${n} 🔘 pogas sākumam`],
    shop: ['🛍 Pick my first thing', '🛍 Выбрать первую вещь', '🛍 Izvēlēties pirmo lietu'],
    flock: ['🐦 See myself in the flock', '🐦 Посмотреть себя в стае', '🐦 Apskatīt sevi barā'],
    err: ['Something went wrong, please try again.', 'Не получилось, попробуйте ещё раз.', 'Neizdevās, mēģini vēlreiz.'],
  };
  const t = (k, ...a) => { const v = T[k][L]; return typeof v === 'function' ? v(...a) : v; };
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const still = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- яйцо: пиксели 28×26, низ на линии лапок (BASE) ----------
  const W = 28, H = 26, CX = 14, CY = 16.5, RX = 6.5, RY = 8.5;
  const SPOTS = [[11, 12, '#E9A93B'], [16, 10, '#9B5DE5'], [17, 17, '#E9A93B'], [12, 19, '#F08BC0'], [14, 14, '#F08BC0'], [10, 16, '#9B5DE5']];
  const inEgg = (x, y) => { const dy = (y + .5 - CY) / RY, rx = RX * (dy < 0 ? .86 : 1); return dy * dy + ((x + .5 - CX) / rx) ** 2 <= 1; };
  function eggPixels() { // [x, y, цвет]
    const px = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (!inEgg(x, y)) continue;
      const edge = !inEgg(x - 1, y) || !inEgg(x + 1, y) || !inEgg(x, y - 1) || !inEgg(x, y + 1);
      px.push([x, y, edge ? '#2B1A51' : x > CX + 2 && y > CY - 3 ? '#EADBB8' : x < CX - 2 && y < CY - 3 ? '#FFFFFF' : '#FFF6E0']);
    }
    SPOTS.forEach(([x, y, c]) => px.push([x, y, c]));
    return px;
  }
  const EGG = eggPixels();
  // линия трещины: зигзаг поперёк яйца
  const crackY = x => 15 + [0, -1, 0, 1, 1, 0, -1, -1, 0, 1, 0, -1, 0, 1][x % 14];
  const crackXs = EGG.length ? [...new Set(EGG.map(p => p[0]))].sort((a, b) => a - b) : [];
  function draw(ctx, o = {}) { // o: dx, crack (0…1), split (0…1 — верх улетает), fade (низ), bird (спрайт), rise (0…1)
    ctx.clearRect(0, 0, W, H);
    const dx = o.dx || 0, sp = o.split || 0, cr = o.crack || 0;
    if (o.bird) { ctx.save(); ctx.translate(0, Math.round((1 - (o.rise ?? 1)) * 9)); ctx.drawImage(o.bird, 0, 0); ctx.restore(); }
    const cut = cr ? crackXs.slice(0, Math.ceil(crackXs.length * cr)) : [];
    const cutSet = new Set(cut.map(x => x + ',' + crackY(x)));
    for (const [x, y, c] of EGG) {
      const top = y < crackY(x);
      if (top && sp) { ctx.globalAlpha = Math.max(0, 1 - sp); ctx.fillStyle = c; ctx.fillRect(x + dx + Math.round(sp * 7), y - Math.round(sp * 14), 1, 1); continue; }
      if (!top && o.fade) ctx.globalAlpha = Math.max(0, 1 - o.fade);
      else if (!top || !sp) ctx.globalAlpha = 1;
      if (!top && o.bird && sp && y < crackY(x) + 1) continue; // птичка выглядывает из нижней скорлупки
      ctx.fillStyle = cutSet.has(x + ',' + y) && c !== '#2B1A51' ? '#2B1A51' : c;
      ctx.fillRect(x + dx, y, 1, 1);
    }
    ctx.globalAlpha = 1;
  }
  function egg(canvas) { const c = canvas.getContext('2d'); c.imageSmoothingEnabled = false; draw(c); return canvas; }
  function play(canvas, bird) {
    const ctx = canvas.getContext('2d'); ctx.imageSmoothingEnabled = false;
    if (still()) { ctx.clearRect(0, 0, W, H); ctx.drawImage(bird, 0, 0); return Promise.resolve(); }
    return new Promise(done => {
      const t0 = performance.now();
      const step = now => {
        const ms = now - t0, wob = n => Math.round(Math.sin(ms / n));
        if (ms < 900) draw(ctx, { dx: wob(60) });
        else if (ms < 1900) draw(ctx, { dx: wob(40), crack: Math.min(1, Math.ceil((ms - 900) / 330) / 3) });
        else if (ms < 2500) { const p = (ms - 1900) / 600; draw(ctx, { crack: 1, split: p, bird, rise: p }); }
        else if (ms < 3000) draw(ctx, { crack: 1, split: 1, bird, rise: 1, fade: (ms - 2500) / 500 });
        else { ctx.clearRect(0, 0, W, H); ctx.drawImage(bird, 0, 0); done(); return; }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  // ---------- воронка «🥚 Вылупи» (worker/auth.js FUNNELS.hatch): нажали → вошли → выбрали ник ----------
  const KEY = 'pp-hatch', DAY = 86400000;
  const get = () => { try { const v = JSON.parse(localStorage.getItem(KEY) || 'null'); return v && Date.now() - v.at < DAY ? v : null; } catch (e) { return null; } };
  const put = v => { try { v ? localStorage.setItem(KEY, JSON.stringify(v)) : localStorage.removeItem(KEY); } catch (e) {} };
  const step = s => fetch('/api/funnel', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ f: 'hatch', s }), keepalive: true }).catch(() => {});
  function click() { if (!get()) { step('click'); put({ s: 'click', at: Date.now() }); } }
  function nicked() { const v = get(); if (v) { step('nick'); put(null); } }
  document.addEventListener('pp:whoami', e => {
    const u = e.detail && e.detail.user, v = get();
    document.documentElement.classList.toggle('me-in', !!(u && u.nick));
    try { u && u.nick ? localStorage.setItem('pp-in', '1') : localStorage.removeItem('pp-in'); } catch (x) {}
    if (!u || !v) return;
    if (v.s === 'click') { step('in'); put(u.nick ? null : { s: 'in', at: v.at }); }
    else if (u.nick) put(null);
  });

  // ---------- «Добро пожаловать» сразу после ника ----------
  function welcome(o) {
    const B = window.PPBirds, w = o.welcome || null, me = { nick: o.nick, avatar: Object.assign({}, o.avatar || {}) };
    const d = document.createElement('dialog'); d.className = 'acct-nick hatch-hi';
    d.innerHTML = `<form method="dialog"><canvas width="${B ? B.SW : 28}" height="26" aria-hidden="true"></canvas>
      <h2>${esc(t('hi', o.nick))}</h2><p>${t('best')}</p>
      ${w ? `<div class="hh-gift"><span class="hh-pic"></span><span class="hh-tx"><small>🎁 ${t('gift')}</small><b>${esc(B ? B.giftName(w.kind, w.item, L) : w.item)}</b></span><button type="button" class="pill-btn" data-wear>${t('wear')}</button></div>
      ${w.btn > 0 ? `<p class="hh-btn">${t('btns', w.btn)}</p><p class="pp-sew">${window.PPSew || ''}</p>` : ''}` : ''}
      <a class="pill-btn pill-fill" href="${pre}/shop/">${t('shop')}</a>
      <a class="pill-btn" href="${pre}/flock/?bird=${encodeURIComponent(o.nick)}">${t('flock')}</a>
      <button class="hh-x" type="submit" aria-label="OK">✕</button></form>`;
    document.body.appendChild(d);
    const cv = d.querySelector('canvas'), paint = () => { if (!B || o.id == null) return; const c = cv.getContext('2d'); c.clearRect(0, 0, cv.width, cv.height); c.drawImage(B.sprite(B.dress(B.looks(o.id), me.avatar), 0), 0, 0); };
    paint();
    if (w && B) try { d.querySelector('.hh-pic').appendChild(B.giftPic(w.kind, w.item, o.id, 44)); } catch (e) {}
    const wear = d.querySelector('[data-wear]');
    if (wear) wear.onclick = async () => {
      wear.disabled = true;
      try {
        if (window.PPCatalog) { if (!(await window.PPCatalog.use(w.kind, w.item, { me }))) throw 0; }
        else {
          const r = await fetch('/api/avatar', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ kind: w.kind, item: w.item }) });
          const j = await r.json().catch(() => ({})); if (!r.ok) throw 0; me.avatar = j.avatar || me.avatar;
        }
        me.avatar[w.kind] = w.item; paint(); wear.textContent = t('worn');
      } catch (e) { wear.disabled = false; alert(t('err')); }
    };
    return new Promise(res => { d.addEventListener('close', () => { d.remove(); res(); }); d.showModal(); });
  }

  window.PPHatch = { egg, play, welcome, click, nicked, W, H };
})();
