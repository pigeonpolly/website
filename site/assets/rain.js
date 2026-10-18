// Игра «Пуговичный дождь» (/rain/, вкладка в «Играть»): птичка ловит падающие пуговки и уворачивается от клякс.
// Уровни бесконечные: каждый следующий быстрее, клякс больше, с 5-го дует ветер, с 8-го вещи падают зигзагом.
// Управление: палец/мышь — птичка бежит туда, где палец; на компьютере — стрелки или A/D. Пробел/Esc — пауза.
// Пуговки 🔘 даёт сервер (/api/game/start, /api/game/level): за пройденный уровень, не больше дневного лимита из «📜 Правил».
(() => {
  const app = document.getElementById('rain');
  if (!app) return;
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0;
  const T = {
    title: ['Button Rain', 'Пуговичный дождь', 'Pogu lietus'],
    how: ['Move your bird with your finger (or the arrow keys). Catch the falling buttons 🔘, a golden one counts as three. Dodge the ink blots: each one costs a heart. Let 5 buttons fall past you and you lose a heart too.',
      'Двигай птичку пальцем (или стрелками). Лови падающие пуговки 🔘, золотая считается за три. Уворачивайся от клякс: каждая — минус сердечко. Упустишь 5 пуговок — тоже минус сердечко.',
      'Kustini putniņu ar pirkstu (vai bultiņām). Ķer krītošās pogas 🔘, zelta poga skaitās par trim. Izvairies no tintes traipiem: katrs atņem sirsniņu. Palaidīsi garām 5 pogas — arī mīnus sirsniņa.'],
    levels: ['Every 10 levels it gets noticeably harder, and each level pays more. There is no last level.', 'Каждые 10 уровней становится заметно сложнее, а за уровень дают больше пуговок. Последнего уровня нет.', 'Ik pēc 10 līmeņiem kļūst manāmi grūtāk, un par līmeni dod vairāk pogu. Pēdējā līmeņa nav.'],
    pay: [p => `Each level gives +${p} 🔘, from level 11 +${p * 2} 🔘, from 21 +${p * 3} 🔘 and so on. Every level pays once a day.`, p => `За каждый уровень +${p} 🔘, с 11-го +${p * 2} 🔘, с 21-го +${p * 3} 🔘 и так далее. Каждый уровень платит раз в день.`, p => `Par katru līmeni +${p} 🔘, no 11. +${p * 2} 🔘, no 21. +${p * 3} 🔘 un tā tālāk. Katrs līmenis maksā reizi dienā.`],
    recRule: [n => `🏆 New personal record: +${n} 🔘 more for every level above your old one.`, n => `🏆 Новый личный рекорд: ещё +${n} 🔘 за каждый уровень выше прежнего.`, n => `🏆 Jauns personīgais rekords: vēl +${n} 🔘 par katru līmeni virs iepriekšējā.`],
    index: ['Rewards grow together with the prices in the shop.', 'Награды растут вместе с ценами в магазине.', 'Balvas aug kopā ar cenām veikalā.'],
    cap: [m => `Up to ${m} 🔘 a day.`, m => `До ${m} 🔘 в день.`, m => `Līdz ${m} 🔘 dienā.`],
    today0: [n => `Today: +${n} 🔘`, n => `Сегодня: +${n} 🔘`, n => `Šodien: +${n} 🔘`],
    itemRule: [n => `Every ${n} levels a thing from the shop falls from the sky, one you don’t have yet 🎁`, n => `Каждые ${n} уровней с неба падает вещь из магазина, которой у тебя ещё нет 🎁`, n => `Ik pēc ${n} līmeņiem no debesīm nokrīt lieta no veikala, kuras tev vēl nav 🎁`],
    kingRule: [n => `👑 First place in the records: +${n} 🔘 every day you hold it and play.`, n => `👑 Первое место в рекордах: +${n} 🔘 каждый день, пока держишься и играешь.`, n => `👑 Pirmā vieta rekordos: +${n} 🔘 katru dienu, kamēr turies un spēlē.`],
    kingGot: [n => `👑 You are first in the records: +${n} 🔘 for today!`, n => `👑 Ты на первом месте: +${n} 🔘 за сегодня!`, n => `👑 Tu esi pirmais: +${n} 🔘 par šodienu!`],
    gotItem: [n => `🎁 A gift fell from the sky: ${n}! It is waiting in your profile.`, n => `🎁 С неба упал подарок: ${n}! Он ждёт в профиле.`, n => `🎁 No debesīm nokrita dāvana: ${n}! Tā gaida profilā.`],
    harder: [(l, p) => `Level ${l}: harder now! +${p} 🔘 per level`, (l, p) => `Уровень ${l}: стало сложнее! +${p} 🔘 за уровень`, (l, p) => `${l}. līmenis: grūtāk! +${p} 🔘 par līmeni`],
    payOff: ['Buttons for the game are switched off for now: play for the record!', 'Пуговки за игру сейчас выключены: играем за рекорд!', 'Pogas par spēli pašlaik ir izslēgtas: spēlējam rekorda dēļ!'],
    today: [(n, m) => `Today: ${n} of ${m} 🔘`, (n, m) => `Сегодня: ${n} из ${m} 🔘`, (n, m) => `Šodien: ${n} no ${m} 🔘`],
    guest: ['Sign in to earn buttons and get into the record table.', 'Войдите, чтобы получать пуговки и попасть в таблицу рекордов.', 'Ienāc, lai saņemtu pogas un tiktu rekordu tabulā.'],
    signin: ['Sign in', 'Войти', 'Ienākt'],
    play: ['▶ Play', '▶ Играть', '▶ Spēlēt'], again: ['↻ Play again', '↻ Ещё раз', '↻ Vēlreiz'], resume: ['▶ Continue', '▶ Продолжить', '▶ Turpināt'],
    paused: ['Pause', 'Пауза', 'Pauze'], pauseBtn: ['Pause', 'Пауза', 'Pauze'],
    best: [n => `Your record: level ${n}`, n => `Твой рекорд: уровень ${n}`, n => `Tavs rekords: ${n}. līmenis`],
    lv: ['Level', 'Уровень', 'Līmenis'],
    passed: [n => `Level ${n} passed!`, n => `Уровень ${n} пройден!`, n => `${n}. līmenis pārvarēts!`],
    heart: ['+1 ❤️', '+1 ❤️', '+1 ❤️'],
    capHit: [m => `Today’s ${m} 🔘 are collected. Now we play for the record!`, m => `Сегодняшние ${m} 🔘 собраны. Дальше — за рекорд!`, m => `Šodienas ${m} 🔘 savāktas. Tālāk — rekorda dēļ!`],
    over: ['Game over', 'Игра окончена', 'Spēle beigusies'],
    reached: [n => `You passed ${n} ${n === 1 ? 'level' : 'levels'}`, n => `Пройдено уровней: ${n}`, n => `Pārvarēti līmeņi: ${n}`],
    newBest: ['🏆 New record!', '🏆 Новый рекорд!', '🏆 Jauns rekords!'],
    earned: [n => `+${n} 🔘 this game`, n => `+${n} 🔘 за эту игру`, n => `+${n} 🔘 šajā spēlē`],
    badge: [n => `🏅 New achievement: “${n}”`, n => `🏅 Новое достижение: «${n}»`, n => `🏅 Jauns sasniegums: “${n}”`],
    noSave: ['Could not save the level: buttons were not added.', 'Не получилось сохранить уровень: пуговки не начислены.', 'Neizdevās saglabāt līmeni: pogas netika pieskaitītas.'],
  };
  const t = (k, ...a) => { const v = T[k][L]; return typeof v === 'function' ? v(...a) : v; };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const post = (path, body) => fetch('/api/' + path, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}) }).then(r => r.ok ? r.json() : Promise.reject(r.status));

  // ---------- разметка ----------
  app.innerHTML = `<div class="rain-stage"><canvas class="rain-cv" aria-label="${esc(t('title'))}"></canvas>
    <button type="button" class="rain-pause" aria-label="${esc(t('pauseBtn'))}" hidden>❚❚</button>
    <div class="rain-ov"></div></div>
    <section class="rain-top" data-top="rain"></section>`;
  const cv = app.querySelector('.rain-cv'), ov = app.querySelector('.rain-ov'), pauseBtn = app.querySelector('.rain-pause'), stage = app.querySelector('.rain-stage');
  const ctx = cv.getContext('2d');
  const W = 360, H = 560, GROUND = H - 34, BY = GROUND - 26; // логический размер поля; BY — центр птички
  let scale = 1;
  function fit() {
    const maxW = Math.min(app.clientWidth || 360, 440), maxH = Math.max(380, window.innerHeight - 120);
    const w = Math.min(maxW, Math.floor(maxH * W / H));
    scale = w / W;
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    cv.width = Math.round(W * scale * dpr); cv.height = Math.round(H * scale * dpr);
    stage.style.width = w + 'px'; stage.style.height = Math.round(H * scale) + 'px';
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0); ctx.imageSmoothingEnabled = false;
    if (state !== 'play') draw();
  }

  // ---------- данные с сервера ----------
  let info = { on: true, per: 1, max: 5, today: 0, best: 0, me: null, top: [] };
  const load = () => fetch('/api/game', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).then(d => { if (d) info = d; makeBird(); topList(); if (state === 'menu' || state === 'over') showOverlay(); }).catch(() => {});
  // доска топа — top-board.js (PPTop); у первого места за всё время корона: +king 🔘 в день
  function topList() { const el = app.querySelector('.rain-top'); if (!window.PPTop || !el) return; const fresh = !el.__top; window.PPTop.mount(el, { crown: info.king ? '+' + info.king + ' 🔘' : '' }); if (!fresh) window.PPTop.refresh(el); }

  // ---------- птичка: спрайт игрока (или случайной птички для гостя) ----------
  let frames = [], bw = 40, bh = 40;
  function makeBird() {
    const B = window.PPBirds; if (!B) return;
    const id = info.me ? info.me.id : 7, av = info.me ? info.me.avatar || {} : {};
    try {
      frames = [0, 1].map(f => B.crop(B.spriteHD(B.dress(B.looks(id), av), f)));
      const k = 54 / Math.max(frames[0].width, frames[0].height); bw = frames[0].width * k; bh = frames[0].height * k;
    } catch (e) { frames = []; }
  }

  // ---------- игра ----------
  let state = 'menu', level = 1, caught = 0, missed = 0, hearts = 3, items = [], fx = [], bx = W / 2, tx = W / 2, face = 1, walk = 0;
  let runItems = [], spawnT = 0, time = 0, levelT = 0, shake = 0, hurt = 0, banner = null, run = null, queue = Promise.resolve(), runGot = 0, capShown = false, startBest = 0, keys = { l: 0, r: 0 };
  const goal = lv => Math.min(30, 10 + 2 * ((lv - 1) % 10) + 2 * tierOf(lv));
  const MISS = 5;
  // сложность растёт ступенями: каждые 10 уровней — заметный скачок (быстрее, чаще, больше клякс; с 11-го ветер, с 21-го зигзаг), внутри десятка — чуть-чуть
  const tierOf = lv => Math.floor((lv - 1) / 10);
  const P = lv => { const k = tierOf(lv), i = (lv - 1) % 10; return {
    speed: Math.min(500, 130 + 7 * i + 75 * k),
    every: Math.max(0.3, 0.86 - 0.016 * i - 0.12 * k),
    ink: Math.min(0.46, 0.15 + 0.008 * i + 0.07 * k),
    wind: k >= 1 ? Math.min(85, 22 * k + 2 * i) : 0,
    zig: k >= 2 ? Math.min(0.5, 0.12 * (k - 1) + 0.01 * i) : 0,
  }; };
  const priceOf = lv => (info.per || 0) * (1 + tierOf(lv));
  const COLORS = [['#E2725B', '#B5523E'], ['#7F81BF', '#5B5D99'], ['#5FA88A', '#3F7F66'], ['#F0A987', '#C97F5E'], ['#6BA4D8', '#4A7FB0'], ['#C882B8', '#9E5D90']];
  const SKIES = [['#CFE8F6', '#F6EFE2'], ['#D9D3F2', '#F7EADF'], ['#F7DCCB', '#FBF1E4'], ['#CDEBDD', '#F4F1E2'], ['#F2D6E6', '#F8EEE6'], ['#2E2A5A', '#6C5B8E']];

  function start() {
    level = 1; caught = 0; missed = 0; hearts = 3; items = []; fx = []; time = 0; levelT = 0; spawnT = 0.6; banner = { txt: t('lv') + ' 1', t: 1.2 }; runGot = 0; runItems = []; capShown = false; startBest = info.best || 0;
    run = null; queue = Promise.resolve();
    if (info.me) queue = post('game/start').then(r => { run = r.run; }).catch(() => { run = null; });
    state = 'play'; ov.innerHTML = ''; ov.hidden = true; pauseBtn.hidden = false; document.documentElement.classList.add('rain-on');
    const r = stage.getBoundingClientRect(); if (r.top < 60 || r.bottom > innerHeight) stage.scrollIntoView({ block: 'center' }); // на телефоне поле целиком на экране
    last = performance.now(); requestAnimationFrame(loop);
  }
  function spawn() {
    const p = P(level), r = Math.random();
    let type = r < p.ink ? 'ink' : r < p.ink + 0.06 ? 'gold' : 'btn';
    if (type === 'btn' && hearts < 3 && level >= 3 && Math.random() < 0.025) type = 'heart';
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    items.push({ type, x: 22 + Math.random() * (W - 44), y: -20, vy: p.speed * (0.85 + Math.random() * 0.3), c, rot: Math.random() * 6, zig: Math.random() < p.zig ? 40 + Math.random() * 40 : 0, ph: Math.random() * 6, x0: 0 });
    items[items.length - 1].x0 = items[items.length - 1].x;
  }
  function pop(x, y, txt, col) { fx.push({ x, y, txt, col, t: 0.9 }); }
  function loseHeart() {
    hearts--; shake = 0.35; hurt = 0.5; missed = 0;
    if (hearts <= 0) gameOver();
  }
  function levelDone() {
    const lv = level;
    items.forEach(o => { if (o.type !== 'ink') pop(o.x, o.y, '✦', '#E9A93B'); }); items = [];
    banner = { txt: t('passed', lv), t: 1.6 };
    if (lv % 5 === 0 && hearts < 3) { hearts++; pop(W - 40, 30, t('heart'), '#D85A30'); }
    level++; caught = 0; missed = 0; levelT = 0; spawnT = 1.4;
    if ((level - 1) % 10 === 0) banner = { txt: t('harder', level, priceOf(level)), t: 2.6, small: true };
    if (info.me) queue = queue.then(() => run ? post('game/level', { run, level: lv }) : null).then(r => {
      if (!r) return;
      info.today = r.today; info.best = r.best;
      (r.badges || []).forEach((k, i) => setTimeout(() => window.PPToast && window.PPToast(t('badge', { rain1: ['Rain walker', 'Под дождём', 'Lietus gājējs'], rain2: ['Quick paws', 'Ловкие лапки', 'Veiklās ķepas'], rain3: ['Lord of the downpour', 'Повелитель ливня', 'Lietusgāzes valdnieks'] }[k][L])), 300 + i * 1600));
      if (r.got > 0) { runGot += r.got; pop(W / 2, 120, '+' + r.got + ' 🔘', '#6a3fb0'); }
      if (r.rec > 0) { runGot += r.rec; pop(W / 2, 148, '🏆 +' + r.rec + ' 🔘', '#C8961E'); }
      if (r.item) { const B = window.PPBirds, nm = B && B.giftName ? B.giftName(r.item.kind, r.item.item, L) : r.item.item; runItems.push(nm); banner = { txt: t('gotItem', nm), t: 3, small: true }; }
      if (r.king) { runGot += r.king; setTimeout(() => window.PPToast && window.PPToast(t('kingGot', r.king)), 600); }
      else if (info.on && info.max > 0 && r.today >= r.max && !capShown) { capShown = true; banner = { txt: t('capHit', r.max), t: 2.4, small: true }; }
    }).catch(() => {});
  }
  function gameOver() {
    state = 'over'; pauseBtn.hidden = true; document.documentElement.classList.remove('rain-on');
    queue.then(() => load()).then(() => showOverlay());
    showOverlay();
  }
  function pause() { if (state !== 'play') return; state = 'pause'; showOverlay(); }
  function resume() { if (state !== 'pause') return; state = 'play'; ov.hidden = true; last = performance.now(); requestAnimationFrame(loop); }

  let last = 0;
  function loop() {
    if (state !== 'play') return;
    const now = performance.now(), dt = Math.max(0, Math.min(0.05, (now - last) / 1000)); last = now; // своё время, не метка кадра: у неё бывает другой отсчёт
    update(dt); draw();
    if (state === 'play') requestAnimationFrame(loop);
  }
  function update(dt) {
    time += dt; levelT += dt; walk += dt;
    if (shake > 0) shake -= dt; if (hurt > 0) hurt -= dt;
    if (banner) { banner.t -= dt; if (banner.t <= 0) banner = null; }
    // движение птички: к пальцу (быстро, но не мгновенно) или стрелками
    const old = bx;
    if (keys.l || keys.r) { bx += (keys.r - keys.l) * 380 * dt; tx = bx; }
    else { const d = tx - bx, s = 760 * dt; bx += Math.abs(d) < s ? d : Math.sign(d) * s; }
    bx = Math.max(bw / 2, Math.min(W - bw / 2, bx));
    if (Math.abs(bx - old) > 0.3) face = bx > old ? 1 : -1;
    const moving = Math.abs(bx - old) > 0.3;
    // новые предметы
    const p = P(level);
    spawnT -= dt;
    if (spawnT <= 0) { spawn(); spawnT = p.every * (0.75 + Math.random() * 0.5); }
    const wind = p.wind ? Math.sin(time * 0.6) * p.wind : 0;
    for (const o of items) {
      o.y += o.vy * dt; o.rot += dt * 2;
      o.x0 += wind * dt; o.x0 = Math.max(16, Math.min(W - 16, o.x0));
      o.x = o.x0 + (o.zig ? Math.sin(o.ph + o.y / 45) * o.zig * 0.5 : 0);
      // поймала?
      if (!o.done && o.y > BY - bh / 2 - 6 && o.y < BY + 10 && Math.abs(o.x - bx) < bw / 2 + 8) {
        o.done = true;
        if (o.type === 'ink') { pop(o.x, o.y, '💥', '#2b1f3d'); loseHeart(); }
        else if (o.type === 'heart') { hearts = Math.min(3, hearts + 1); pop(o.x, o.y, '+❤️', '#D85A30'); }
        else { const n = o.type === 'gold' ? 3 : 1; caught += n; pop(o.x, o.y - 10, '+' + n, o.type === 'gold' ? '#C8961E' : o.c[1]); }
      }
      // упала мимо
      if (!o.done && o.y > GROUND + 8) {
        o.done = true;
        if (o.type === 'btn' || o.type === 'gold') { missed++; if (missed >= MISS) { pop(o.x, GROUND - 10, '−❤️', '#D85A30'); loseHeart(); } }
      }
    }
    items = items.filter(o => !o.done);
    for (const f of fx) { f.t -= dt; f.y -= 40 * dt; }
    fx = fx.filter(f => f.t > 0);
    if (state === 'play' && caught >= goal(level)) levelDone();
    walk = moving ? walk : 0;
  }

  // ---------- рисование ----------
  function px(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function drawBtn(o) {
    const r = o.type === 'gold' ? 14 : 12, [c1, c2] = o.type === 'gold' ? ['#F2C94C', '#C8961E'] : o.c;
    ctx.save(); ctx.translate(Math.round(o.x), Math.round(o.y)); ctx.rotate(o.rot * 0.3);
    ctx.fillStyle = c2; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill();
    ctx.fillStyle = c1; ctx.beginPath(); ctx.arc(0, 0, r - 2.5, 0, 7); ctx.fill();
    ctx.fillStyle = c2; for (const [a, b] of [[-3.5, -3.5], [3.5, -3.5], [-3.5, 3.5], [3.5, 3.5]]) { ctx.beginPath(); ctx.arc(a, b, 1.8, 0, 7); ctx.fill(); }
    if (o.type === 'gold') { ctx.fillStyle = '#FFF6C8'; ctx.fillRect(-r + 4, -r + 5, 3, 3); }
    ctx.restore();
    if (o.type === 'gold' && Math.sin(time * 12 + o.ph) > 0.6) { px(o.x + 13, o.y - 15, 2, 6, '#F2C94C'); px(o.x + 11, o.y - 13, 6, 2, '#F2C94C'); }
  }
  function drawInk(o) {
    ctx.save(); ctx.translate(Math.round(o.x), Math.round(o.y));
    ctx.fillStyle = '#1E1530';
    ctx.beginPath(); ctx.arc(0, 0, 11, 0, 7); ctx.fill();
    for (let i = 0; i < 6; i++) { const a = i * 1.05 + o.ph; ctx.beginPath(); ctx.arc(Math.cos(a) * 11, Math.sin(a) * 11, 4 + (i % 2) * 2, 0, 7); ctx.fill(); }
    ctx.fillRect(-2, -22, 4, 10); ctx.beginPath(); ctx.arc(0, -24, 3, 0, 7); ctx.fill(); // капля сверху
    ctx.fillStyle = '#fff'; ctx.fillRect(-6, -3, 4, 4); ctx.fillRect(3, -3, 4, 4); // глазки
    ctx.fillStyle = '#1E1530'; ctx.fillRect(-5, -2, 2, 2); ctx.fillRect(4, -2, 2, 2);
    ctx.restore();
  }
  function drawHeart(x, y, s, c) {
    const H0 = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'];
    ctx.fillStyle = c; H0.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === 'X') ctx.fillRect(Math.round(x + i * s), Math.round(y + j * s), s, s); }));
  }
  function draw() {
    const sky = SKIES[(level - 1) % SKIES.length], night = (level - 1) % SKIES.length === SKIES.length - 1;
    ctx.save();
    if (shake > 0) ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6);
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, sky[0]); g.addColorStop(1, sky[1]);
    ctx.fillStyle = g; ctx.fillRect(-10, -10, W + 20, H + 20);
    if (night) for (let i = 0; i < 30; i++) px((i * 97) % W, (i * 53) % (H - 120), 2, 2, i % 3 ? '#fff' : '#F2C94C');
    // облака
    for (let i = 0; i < 4; i++) {
      const cx = ((i * 113 + time * (8 + i * 3)) % (W + 120)) - 60, cy = 50 + i * 70;
      ctx.fillStyle = night ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.75)';
      ctx.fillRect(cx, cy, 56, 12); ctx.fillRect(cx + 10, cy - 8, 30, 10); ctx.fillRect(cx + 34, cy - 4, 16, 6);
    }
    // земля
    px(0, GROUND, W, H - GROUND, night ? '#3A4E3A' : '#8CC084'); px(0, GROUND, W, 4, night ? '#4E6B4E' : '#A7D79B');
    for (let i = 0; i < W; i += 18) px(i + ((i * 7) % 9), GROUND + 10 + (i % 3) * 6, 3, 3, night ? '#2F402F' : '#76AD70');
    // предметы
    for (const o of items) o.type === 'ink' ? drawInk(o) : o.type === 'heart' ? drawHeart(o.x - 10, o.y - 9, 3, '#D85A30') : drawBtn(o);
    // птичка
    const f = frames[walk > 0 ? Math.floor(walk * 8) % 2 : 0];
    px(bx - bw * 0.4, GROUND - 2, bw * 0.8, 4, 'rgba(0,0,0,.15)');
    if (f) {
      ctx.save(); ctx.translate(Math.round(bx), Math.round(BY)); if (face < 0) ctx.scale(-1, 1);
      if (hurt > 0 && Math.floor(hurt * 20) % 2) ctx.globalAlpha = 0.4;
      ctx.drawImage(f, -bw / 2, -bh / 2 + 4, bw, bh); ctx.restore();
    } else px(bx - 16, BY - 12, 32, 30, '#7F81BF');
    // всплывающие подписи
    ctx.textAlign = 'center'; ctx.font = '700 16px system-ui, sans-serif';
    for (const e of fx) { ctx.globalAlpha = Math.max(0, Math.min(1, e.t * 1.5)); ctx.fillStyle = e.col; ctx.fillText(e.txt, e.x, e.y); }
    ctx.globalAlpha = 1;
    ctx.restore();
    // панель сверху: уровень, прогресс, сердечки, упущенные
    px(0, 0, W, 44, 'rgba(43,31,61,.82)');
    ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.font = '700 15px system-ui, sans-serif'; ctx.fillText(t('lv') + ' ' + level, 10, 19);
    const gl = goal(level), pw = 120; px(10, 27, pw, 8, 'rgba(255,255,255,.25)'); px(10, 27, pw * Math.min(1, caught / gl), 8, '#F2C94C');
    ctx.font = '600 11px system-ui, sans-serif'; ctx.fillText(Math.min(caught, gl) + '/' + gl, 136, 35);
    for (let i = 0; i < 3; i++) drawHeart(W - 92 + i * 28, 8, 3, i < hearts ? '#E2564B' : 'rgba(255,255,255,.25)');
    for (let i = 0; i < MISS; i++) px(W - 92 + i * 16, 32, 10, 6, i < missed ? '#F0A987' : 'rgba(255,255,255,.2)');
    if (state === 'play' && hurt > 0) { ctx.fillStyle = `rgba(216,90,48,${hurt * 0.4})`; ctx.fillRect(0, 44, W, H - 44); }
    if (banner) {
      ctx.globalAlpha = Math.min(1, banner.t * 2); ctx.textAlign = 'center';
      const fs = banner.small ? 15 : 24; ctx.font = `800 ${fs}px system-ui, sans-serif`;
      const lines = wrap(banner.txt, W - 60); const h = lines.length * (fs + 6) + 20;
      ctx.fillStyle = 'rgba(255,250,242,.92)'; ctx.fillRect(24, H / 2 - 80 - h / 2, W - 48, h);
      ctx.fillStyle = '#2b1f3d'; lines.forEach((ln, i) => ctx.fillText(ln, W / 2, H / 2 - 80 - h / 2 + 10 + fs + i * (fs + 6)));
      ctx.globalAlpha = 1;
    }
  }
  function wrap(s, max) { const out = []; let cur = ''; for (const w of s.split(' ')) { const n = cur ? cur + ' ' + w : w; if (ctx.measureText(n).width > max && cur) { out.push(cur); cur = w; } else cur = n; } if (cur) out.push(cur); return out; }

  // ---------- экраны поверх поля ----------
  function showOverlay() {
    ov.hidden = false;
    const payLine = info.on && info.per > 0 ? `<p class="rain-pay">${t('pay', info.per)}${info.max > 0 ? ' ' + t('cap', info.max) : ''}${info.me ? ` <b>${info.max > 0 ? t('today', info.today, info.max) : t('today0', info.today)}</b>` : ''}</p>` : `<p class="rain-pay">${t('payOff')}</p>`;
    const extra = `${info.record > 0 && info.on ? `<p class="rain-pay">${t('recRule', info.record)}</p>` : ''}${info.every > 0 ? `<p class="rain-pay">${t('itemRule', info.every)}</p>` : ''}${info.king > 0 ? `<p class="rain-pay">${t('kingRule', info.king)}</p>` : ''}`;
    const guest = info.me ? '' : `<p class="rain-guest">${t('guest')} <button type="button" class="pill-btn rain-in">${t('signin')}</button></p>`;
    if (state === 'menu') ov.innerHTML = `<div class="rain-card"><h2>🔘 ${t('title')}</h2><p>${t('how')}</p>${info.best ? `<p class="rain-best">${t('best', info.best)}</p>` : ''}<button type="button" class="pill-btn pill-fill rain-go">${t('play')}</button>${guest}<div class="rain-rules"><p>${t('levels')}</p>${payLine}${extra}</div></div>`;
    else if (state === 'pause') ov.innerHTML = `<div class="rain-card"><h2>${t('paused')}</h2><button type="button" class="pill-btn pill-fill rain-go">${t('resume')}</button></div>`;
    else if (state === 'over') ov.innerHTML = `<div class="rain-card"><h2>${t('over')}</h2><p class="rain-big">${t('reached', level - 1)}</p>${info.me && level - 1 > startBest ? `<p class="rain-best">${t('newBest')}</p>` : info.best ? `<p class="rain-best">${t('best', info.best)}</p>` : ''}${runGot ? `<p class="rain-got">${t('earned', runGot)}</p>` : ''}${runItems.length ? `<p class="rain-got">🎁 ${runItems.map(esc).join(', ')}</p>` : ''}${payLine}${guest}<button type="button" class="pill-btn pill-fill rain-go">${t('again')}</button></div>`;
    const go = ov.querySelector('.rain-go'); if (go) go.onclick = () => state === 'pause' ? resume() : start();
    const si = ov.querySelector('.rain-in'); if (si) si.onclick = () => window.PPAccount && window.PPAccount.openSignIn();
  }

  // ---------- управление ----------
  const toX = e => { const r = cv.getBoundingClientRect(); return (e.clientX - r.left) / r.width * W; };
  cv.addEventListener('pointerdown', e => { if (state === 'play') { tx = toX(e); try { cv.setPointerCapture(e.pointerId); } catch (x) {} } });
  cv.addEventListener('pointermove', e => { if (state === 'play' && (e.pointerType === 'mouse' || e.buttons || e.pressure > 0)) tx = toX(e); });
  addEventListener('keydown', e => {
    if (state === 'play' && /^(ArrowLeft|ArrowRight|KeyA|KeyD)$/.test(e.code)) { keys[e.code === 'ArrowLeft' || e.code === 'KeyA' ? 'l' : 'r'] = 1; e.preventDefault(); }
    if ((e.code === 'Space' || e.code === 'Escape') && (state === 'play' || state === 'pause') && !e.target.closest('input, textarea')) { e.preventDefault(); state === 'play' ? pause() : resume(); }
  });
  addEventListener('keyup', e => { if (/^(ArrowLeft|KeyA)$/.test(e.code)) keys.l = 0; if (/^(ArrowRight|KeyD)$/.test(e.code)) keys.r = 0; });
  pauseBtn.onclick = pause;
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  addEventListener('blur', () => { keys.l = keys.r = 0; });
  addEventListener('resize', fit);

  // только на локальном сервере: доступ для автотеста (бот ведёт птичку)
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) window.__rain = { s: () => ({ state, time, spawnT, level, caught, hearts, missed, bx, bw, items: items.map(o => ({ type: o.type, x: o.x, y: o.y, vy: o.vy })) }), go: x => { tx = x; } };
  const ready = () => { makeBird(); fit(); showOverlay(); load(); };
  if (window.PPBirds) ready(); else addEventListener('DOMContentLoaded', ready);
})();
