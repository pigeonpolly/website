// 💌 Открытки /postcards/ (docs/postcards.md): выбрать открытку → послание → почта получателя → отправить (только вошедшим).
// Открытка = картинка (арт Алины или сцена, нарисованная здесь: polly, night, cake) + живая анимация поверх (FX) + пожелание.
// Анимация — функция от фазы t ∈ [0, 1): петля LOOP мс без шва — tools/postcard_gifs.py снимает кадры для письма (window.PPPostcard.draw).
// Шапка страницы: пиксельная Полли в шапке Санты с мешком подарков (PollyPet.paint) и счётчик отправленных открыток.
// ?c=токен — открытка, пришедшая по письму: конверт → открытка; «Мои открытки» (#inbox) — полученные и отправленные.
(() => {
  const DS = window.PPPostcardDesigns;
  const L = ['ru', 'lv'].includes(document.documentElement.lang) ? document.documentElement.lang : 'en', LI = { en: 0, ru: 1, lv: 2 }[L];
  const tr = a => a[LI];
  const pre = L === 'en' ? '' : '/' + L;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const LOOP = 4000;

  // ---------- анимация поверх открытки ----------
  // частицы с постоянными случайными свойствами; положение — от фазы t (целое число кругов за петлю → без шва)
  const rnd = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const TAU = Math.PI * 2;
  const heart = (g, x, y, s) => { g.beginPath(); g.moveTo(x, y + s * .3); g.bezierCurveTo(x, y, x - s * .5, y, x - s * .5, y + s * .3); g.bezierCurveTo(x - s * .5, y + s * .6, x, y + s * .8, x, y + s); g.bezierCurveTo(x, y + s * .8, x + s * .5, y + s * .6, x + s * .5, y + s * .3); g.bezierCurveTo(x + s * .5, y, x, y, x, y + s * .3); g.fill(); };
  const star = (g, x, y, r) => { g.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, q = i % 2 ? r * .28 : r; g.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q); } g.closePath(); g.fill(); };
  const FX = {
    snow: { n: 70, draw(g, p, t, w, h) { const y = ((p.y + t * p.k) % 1) * (h + 20) - 10, x = p.x * w + Math.sin(TAU * (t * p.k + p.ph)) * 10 * p.s; g.globalAlpha = .55 + p.s * .4; g.fillStyle = '#fff'; g.beginPath(); g.arc(x, y, 1.2 + p.s * 2.6 * w / 600, 0, TAU); g.fill(); } },
    twinkle: { n: 46, draw(g, p, t, w, h) { const a = Math.max(0, Math.sin(TAU * (t * p.k + p.ph))); g.globalAlpha = a; g.fillStyle = ['#FFE8A3', '#FFFFFF', '#FFC6D9', '#BFE3FF'][p.c % 4]; star(g, p.x * w, p.y * h, (3 + p.s * 7) * w / 600 * (.5 + a * .5)); } },
    sparkle: { n: 30, draw(g, p, t, w, h) { const a = Math.max(0, Math.sin(TAU * (t * p.k + p.ph))) ** 2; g.globalAlpha = a; g.fillStyle = ['#FFF6C9', '#FFFFFF', '#FFD86B'][p.c % 3]; star(g, p.x * w, p.y * h, (4 + p.s * 9) * w / 600); } },
    hearts: { n: 26, draw(g, p, t, w, h) { const y = (1 - (p.y + t * p.k) % 1) * (h + 40) - 20, x = p.x * w + Math.sin(TAU * (t * p.k * 2 + p.ph)) * 14; g.globalAlpha = .75; g.fillStyle = ['#E5484D', '#F28AB2', '#FF6F91', '#C2185B'][p.c % 4]; heart(g, x, y, (8 + p.s * 14) * w / 600); } },
    bubbles: { n: 30, draw(g, p, t, w, h) { const y = (1 - (p.y + t * p.k) % 1) * (h + 40) - 20, x = p.x * w + Math.sin(TAU * (t * p.k + p.ph)) * 12, r = (5 + p.s * 14) * w / 600; g.globalAlpha = .8; g.strokeStyle = 'rgba(255,255,255,.95)'; g.lineWidth = 1.4; g.fillStyle = 'rgba(190,230,255,.22)'; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.stroke(); g.fillStyle = '#fff'; g.beginPath(); g.arc(x - r * .35, y - r * .35, r * .22, 0, TAU); g.fill(); } },
    confetti: { n: 60, draw(g, p, t, w, h) { const y = ((p.y + t * p.k) % 1) * (h + 20) - 10, x = p.x * w + Math.sin(TAU * (t * p.k + p.ph)) * 16, a = TAU * (t * p.k * 2 + p.ph); g.globalAlpha = .95; g.fillStyle = ['#F6C445', '#E5484D', '#5BA3D9', '#6A9A3A', '#B79CF2', '#F28AB2'][p.c % 6]; g.save(); g.translate(x, y); g.rotate(a); g.scale(1, Math.cos(a * 1.3)); g.fillRect(-4 * w / 600, -2.5 * w / 600, 8 * w / 600, 5 * w / 600); g.restore(); } },
    leaves: { n: 20, draw(g, p, t, w, h) { const y = ((p.y + t * p.k) % 1) * (h + 30) - 15, x = p.x * w + Math.sin(TAU * (t * p.k + p.ph)) * 26, a = Math.sin(TAU * (t * p.k * 2 + p.ph)) * 1.2, s = (6 + p.s * 8) * w / 600; g.globalAlpha = .9; g.fillStyle = ['#C8642A', '#D9952F', '#A3592A', '#E0B040'][p.c % 4]; g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.ellipse(0, 0, s, s * .5, 0, 0, TAU); g.fill(); g.restore(); } },
    balloons: { n: 9, draw(g, p, t, w, h) { const y = (1 - (p.y + t * p.k) % 1) * (h + 90) - 30, x = p.x * w + Math.sin(TAU * (t * p.k + p.ph)) * 10, r = (9 + p.s * 8) * w / 600; g.globalAlpha = .85; g.strokeStyle = 'rgba(80,60,60,.5)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y + r * 1.2); g.quadraticCurveTo(x + 5, y + r * 2.2, x, y + r * 3.2); g.stroke(); g.fillStyle = ['#E5484D', '#F6C445', '#5BA3D9', '#B79CF2', '#F28AB2'][p.c % 5]; g.beginPath(); g.ellipse(x, y, r * .85, r * 1.1, 0, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.ellipse(x - r * .3, y - r * .4, r * .18, r * .3, -.4, 0, TAU); g.fill(); } },
    sun: { n: 1, draw(g, p, t, w, h) { // лучи солнца из угла и блики
      const cx = w * .92, cy = h * .05; g.save(); g.translate(cx, cy); g.rotate(TAU * t / 6); for (let i = 0; i < 12; i++) { g.rotate(TAU / 12); g.globalAlpha = .13 + .07 * Math.sin(TAU * (t + i / 12)); g.fillStyle = '#FFE58A'; g.beginPath(); g.moveTo(0, 0); g.lineTo(w * .9, -w * .04); g.lineTo(w * .9, w * .04); g.fill(); } g.restore();
      FX.sparkle.parts.forEach(q => FX.sparkle.draw(g, q, t, w, h)); } },
    fireworks: { n: 5, draw(g, p, t, w, h) { // салют: у каждого своя фаза; 24 искры разлетаются и гаснут
      const f = (t * p.k + p.ph) % 1, x = (.12 + p.x * .76) * w, y = (.12 + p.y * .4) * h, col = ['#F6C445', '#F28AB2', '#7FD1FF', '#B6F09C', '#FF8A5B'][p.c % 5];
      if (f < .22) { const q = f / .22; g.globalAlpha = .9; g.fillStyle = '#FFE8A3'; g.beginPath(); g.arc(x, h - (h - y) * q, 2 * w / 600, 0, TAU); g.fill(); return; }
      const q = (f - .22) / .78, R = (40 + p.s * 50) * w / 600 * Math.sqrt(q);
      g.globalAlpha = Math.max(0, 1 - q * 1.1); g.fillStyle = col;
      for (let i = 0; i < 24; i++) { const a = TAU * i / 24; g.beginPath(); g.arc(x + Math.cos(a) * R, y + Math.sin(a) * R + q * q * 30 * w / 600, (2.4 - q * 1.4) * w / 600, 0, TAU); g.fill(); } } },
  };
  for (const [k, f] of Object.entries(FX)) { const r = rnd(k.length * 977 + 13); f.parts = Array.from({ length: f.n }, () => ({ x: r(), y: r(), s: r(), ph: r(), c: Math.floor(r() * 12), k: 1 + Math.floor(r() * 2) })); }
  FX.sparkle.parts.forEach(p => p.k = 1);
  const fxDraw = (g, kind, t, w, h) => { const f = FX[kind]; if (!f) return; g.clearRect(0, 0, w, h); f.parts.forEach(p => { g.save(); f.draw(g, p, t, w, h); g.restore(); }); g.globalAlpha = 1; };

  // ---------- сцены без арта ----------
  const SACK = ['......aaaa......', '.....awwwwa.....', '....aowwwwoa....', '...aoooooooa....', '...annnnnnnna...', '..appppppppppa..', '.apppqpppppqppa.', '.appppppppppppa.', 'appqpppppqppppa', 'apppppppppppppa', 'appppppqppppppa', 'apqppppppppqppa', '.appppppppppppa.', '..aaaaaaaaaaaa..'];
  const SACK_C = { a: '#3a1d14', w: '#f4f1ea', o: '#f6c445', n: '#5ba3d9', p: '#b0412e', q: '#8d2f20' };
  const pix = (g, rows, cols, x0, y0, s) => rows.forEach((r, y) => [...r].forEach((ch, x) => { if (cols[ch]) { g.fillStyle = cols[ch]; g.fillRect(x0 + x * s, y0 + y * s, s, s); } }));
  // ---------- открытка ----------
  const imgs = {};
  const loadImg = src => imgs[src] || (imgs[src] = new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; }));
  const live = new Set();
  // card(el, d, {msg, from, to, still}) — рисует открытку в el; still — без анимации (миниатюры в списке, пока не наведут)
  function card(el, d, o = {}) {
    el.classList.add('pc-card'); el.dataset.d = d.id; el.style.setProperty('--ink', d.ink);
    el.innerHTML = `<div class="pc-pic"><canvas class="pc-cv"></canvas></div><div class="pc-strip"><b class="pc-g">${esc(o.greet || tr(d.g))}</b>`
      + (o.msg != null ? `<p class="pc-msg">${esc(o.msg)}</p><p class="pc-sig">${o.from ? '— ' + esc(o.from) : ''}</p>` : '') + '</div>';
    const cv = el.querySelector('.pc-cv'), g = cv.getContext('2d');
    const st = { el, d, cv, g, img: null, run: !o.still, t0: performance.now() };
    const size = () => { const r = cv.getBoundingClientRect(), k = Math.min(2, devicePixelRatio || 1); cv.width = Math.max(10, Math.round(r.width * k)); cv.height = Math.max(10, Math.round(r.width * 2 / 3 * k)); };
    st.frame = t => { const w = cv.width, h = cv.height; g.clearRect(0, 0, w, h);
      if (d.art) { if (st.img) { const i = st.img, k = Math.max(w / i.width, h / i.height); g.drawImage(i, (w - i.width * k) / 2, (h - i.height * k) / 2, i.width * k, i.height * k); } }
      else { const SCN = window.PPPostcardScenes; if (SCN) { const lo = st.lo || (st.lo = Object.assign(document.createElement('canvas'), { width: SCN.W, height: SCN.H })); const lg = lo.getContext('2d'); lg.clearRect(0, 0, SCN.W, SCN.H); SCN.draw(d.scene, lg, t); g.imageSmoothingEnabled = false; g.drawImage(lo, 0, 0, w, h); } }
      const fx = st.fx || (st.fx = Object.assign(document.createElement('canvas'), {})); fx.width = w; fx.height = h; fxDraw(fx.getContext('2d'), d.fx, t, w, h); g.drawImage(fx, 0, 0); };
    size(); st.frame(0);
    if (d.art) loadImg(d.art).then(i => { st.img = i; st.frame(0); });
    new ResizeObserver(() => { size(); st.frame(((performance.now() - st.t0) % LOOP) / LOOP); }).observe(cv);
    el._pc = st; live.add(st);
    return st;
  }
  const tick = now => { for (const s of live) { if (!s.el.isConnected) { live.delete(s); continue; } if (s.run) s.frame(((now - s.t0) % LOOP) / LOOP); } requestAnimationFrame(tick); };
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(tick);

  // снимок кадра для письма: tools/postcard_gifs.py — ?shot=<id>, затем PPPostcard.draw(t)
  window.PPPostcard = { card, FX, LOOP, ready: id => { const d = DS.byId(id); return d && d.art ? loadImg(d.art) : Promise.resolve(); } };

  // ---------- тексты страницы ----------
  const W = {
    count: n => [`${n} ${n === 1 ? 'gift' : 'gifts'} sent`, `${n} ${['подарок', 'подарка', 'подарков'][n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 1 : 2]} отправлено`, `${n} dāvanas nosūtītas`][LI],
    pick: ['Pick a postcard', 'Выбери открытку', 'Izvēlies kartīti'],
    write: ['Write a few words', 'Напиши пару слов', 'Uzraksti dažus vārdus'],
    greet: ['Words on the postcard', 'Надпись на открытке', 'Uzraksts uz kartītes'],
    msg: ['Your message', 'Твоё послание', 'Tavs vēstījums'], msgPh: ['Wishing you a cozy winter and lots of tiny joys…', 'Желаю уютной зимы и много маленьких радостей…', 'Novēlu mājīgu ziemu un daudz mazu prieku…'],
    toName: ['To (name)', 'Кому (имя)', 'Kam (vārds)'], toEmail: ['Their email', 'Почта получателя', 'Saņēmēja e-pasts'],
    from: ['From', 'От кого', 'No kā'], anon: ['Send anonymously — a secret friend', 'Отправить анонимно — от тайного друга', 'Sūtīt anonīmi — no slepena drauga'],
    send: ['Send the postcard', 'Отправить открытку', 'Sūtīt kartīti'], back: ['← Other postcards', '← Другие открытки', '← Citas kartītes'],
    login: ['Sign in to send — it’s free', 'Войди, чтобы отправить — это бесплатно', 'Ienāc, lai nosūtītu — tas ir bez maksas'], loginBtn: ['Sign in', 'Войти', 'Ienākt'],
    secret: ['a secret friend', 'тайный друг', 'slepens draugs'],
    sent: ['Sent! 🎉', 'Отправлено! 🎉', 'Nosūtīts! 🎉'],
    sentMail: e => [`The postcard is flying to ${e}.`, `Открытка летит на ${e}.`, `Kartīte lido uz ${e}.`][LI],
    sentQueue: ['Lots of postcards today — the letter will go out within a few hours.', 'Сегодня много открыток — письмо уйдёт в ближайшие часы.', 'Šodien daudz kartīšu — vēstule aizies tuvāko stundu laikā.'],
    sentOff: ['Letters are resting right now — send this link yourself:', 'Письма сейчас отдыхают — вот ссылка, её можно отправить самостоятельно:', 'Vēstules šobrīd atpūšas — nosūti saiti pats:'],
    sentBlock: ['This address asked not to get postcards from the site — but here is the link:', 'Этот адрес попросил не присылать открытки с сайта — но вот ссылка:', 'Šī adrese lūdza nesūtīt kartītes — bet te ir saite:'],
    link: ['Link to the postcard', 'Ссылка на открытку', 'Saite uz kartīti'], copy: ['Copy', 'Копировать', 'Kopēt'], copied: ['Copied', 'Скопировано', 'Nokopēts'],
    more: ['Send another', 'Отправить ещё', 'Sūtīt vēl'],
    left: n => [`You can send ${n} more today.`, `Сегодня можно отправить ещё ${n}.`, `Šodien vari nosūtīt vēl ${n}.`][LI],
    err: { email: ['Check the email address.', 'Проверь адрес почты.', 'Pārbaudi e-pasta adresi.'], day: ['That’s all postcards for today — come back tomorrow.', 'На сегодня открытки закончились — приходи завтра.', 'Šodienai kartītes beigušās — nāc rīt.'], same: ['Two postcards to one address a day is enough.', 'Двух открыток на один адрес в день достаточно.', 'Pietiek ar divām kartītēm vienai adresei dienā.'], nick: ['Choose a nickname first.', 'Сначала выбери ник.', 'Vispirms izvēlies segvārdu.'], x: ['Something went wrong, try again.', 'Что-то пошло не так, попробуй ещё раз.', 'Kaut kas nogāja greizi, mēģini vēlreiz.'] },
    inbox: ['My postcards', 'Мои открытки', 'Manas kartītes'], got: ['Received', 'Полученные', 'Saņemtās'], sentL: ['Sent', 'Отправленные', 'Nosūtītās'],
    none: ['Nothing here yet.', 'Пока пусто.', 'Pagaidām tukšs.'], to: ['to', 'кому:', 'kam:'],
    st: { sent: ['delivered', 'доставлено', 'piegādāts'], queue: ['in the queue', 'в очереди', 'rindā'], off: ['link only', 'только ссылка', 'tikai saite'], block: ['address said no', 'адрес отказался', 'adrese atteicās'], fail: ['not delivered', 'не доставлено', 'nav piegādāts'] },
    tap: ['Tap the envelope', 'Нажми на конверт', 'Pieskaries aploksnei'], forYou: n => n ? [`For ${n}`, `Для: ${n}`, `Priekš: ${n}`][LI] : ['For you', 'Для тебя', 'Tev'],
    reply: ['Send a postcard back', 'Отправить открытку в ответ', 'Sūtīt kartīti atpakaļ'], kept: ['Saved in “My postcards”.', 'Сохранено в «Моих открытках».', 'Saglabāts sadaļā «Manas kartītes».'],
    notFound: ['This postcard got lost on the way.', 'Эта открытка потерялась по дороге.', 'Šī kartīte pazuda pa ceļam.'],
  };

  // ---------- шапка: Полли с мешком и счётчик ----------
  function hero(box) {
    box.innerHTML = '<div class="pc-polly"><span class="pc-bubble"><b class="pc-n">…</b></span><canvas class="pc-pp"></canvas><canvas class="pc-sack"></canvas><span class="pc-pop" aria-hidden="true"></span></div>';
    const pp = box.querySelector('.pc-pp'), sk = box.querySelector('.pc-sack');
    sk.width = 16 * 7; sk.height = 14 * 7; pix(sk.getContext('2d'), SACK, SACK_C, 0, 0, 7);
    let f = 0; const draw = () => { if (window.PollyPet && PollyPet.paint) PollyPet.paint(pp, { sp: 5, hat: 'santa', acc: 'scarf', legs: f++ % 2 ? 'legB' : 'legA', closed: f % 9 === 0 }); };
    draw(); setInterval(draw, 520); if (!window.PollyPet) setTimeout(draw, 800);
    fetch('/api/postcards/stats').then(r => r.json()).then(x => setCount(x.n || 0)).catch(() => setCount(0));
    setInterval(() => pop(box), 3200);
  }
  let shown = 0;
  function setCount(n) {
    const el = document.querySelector('.pc-n'); if (!el) return;
    const a = shown, t0 = performance.now();
    const step = now => { const q = Math.min(1, (now - t0) / 900), v = Math.round(a + (n - a) * q); el.textContent = W.count(v); if (q < 1) requestAnimationFrame(step); };
    shown = n; requestAnimationFrame(step);
  }
  function pop(box) { // из мешка выпрыгивает подарочек
    const p = box.querySelector('.pc-pop'); if (!p) return;
    const b = document.createElement('i'); b.style.setProperty('--c', ['#E5484D', '#5BA3D9', '#F6C445', '#6A9A3A', '#B79CF2'][Math.floor(Math.random() * 5)]); b.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
    p.appendChild(b); setTimeout(() => b.remove(), 1600);
  }

  // ---------- выбор и отправка ----------
  const me = () => window.PPWho && window.PPWho.user;
  let cat = 'all';
  function gallery(box) {
    box.innerHTML = `<h2 class="pc-h">${tr(W.pick)}</h2><div class="pc-chips">${DS.CATS.map(([k, n]) => `<button type="button" data-cat="${k}"${k === cat ? ' class="on"' : ''}>${esc(tr(n))}</button>`).join('')}</div><div class="pc-grid"></div>`;
    const grid = box.querySelector('.pc-grid');
    const fill = () => { grid.innerHTML = ''; DS.DESIGNS.filter(d => cat === 'all' || d.cat === cat).forEach(d => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'pc-tile'; b.setAttribute('aria-label', tr(d.g)); grid.appendChild(b);
      const st = card(b, d, { still: true }); b.onmouseenter = () => st.run = true; b.onmouseleave = () => { st.run = false; }; b.onfocus = b.onmouseenter; b.onblur = b.onmouseleave;
      b.onclick = () => compose(d); }); };
    box.querySelectorAll('[data-cat]').forEach(c => c.onclick = () => { cat = c.dataset.cat; box.querySelectorAll('[data-cat]').forEach(x => x.classList.toggle('on', x === c)); fill(); });
    fill();
  }
  function compose(d) {
    const box = document.getElementById('pc-main'), u = me();
    box.innerHTML = `<button type="button" class="pc-back">${tr(W.back)}</button><div class="pc-comp"><div class="pc-prev"></div><form class="pc-form" novalidate>
      <h2 class="pc-h">${tr(W.write)}</h2>
      <label>${tr(W.greet)}<input name="greet" maxlength="60" value="${esc(tr(d.g))}"></label>
      <label>${tr(W.msg)}<textarea name="msg" maxlength="400" rows="4" placeholder="${esc(tr(W.msgPh))}"></textarea><small class="pc-cnt">0 / 400</small></label>
      <div class="pc-row"><label>${tr(W.toName)}<input name="to_name" maxlength="40" autocomplete="off"></label><label>${tr(W.toEmail)}<input name="to_email" type="email" required maxlength="254" autocomplete="off" inputmode="email"></label></div>
      <label>${tr(W.from)}<input name="from_name" maxlength="40" value="${esc(u ? u.nick || '' : '')}"></label>
      <label class="pc-chk"><input type="checkbox" name="anon"> ${tr(W.anon)}</label>
      <p class="pc-err" role="alert"></p>
      ${u ? `<button class="btn pri pc-send" type="submit">💌 ${tr(W.send)}</button>` : `<p class="pc-login">${tr(W.login)}</p><a class="btn pri" href="#signin" data-pc-in>${tr(W.loginBtn)}</a>`}
    </form></div>`;
    box.querySelector('.pc-back').onclick = () => { gallery(box); box.scrollIntoView({ behavior: 'smooth' }); };
    const f = box.querySelector('form'), prev = box.querySelector('.pc-prev');
    const upd = () => { const from = f.anon.checked ? tr(W.secret) : f.from_name.value.trim(); const st = prev._pc; if (st) { st.el.querySelector('.pc-g').textContent = f.greet.value.trim() || tr(d.g); st.el.querySelector('.pc-msg').textContent = f.msg.value; st.el.querySelector('.pc-sig').textContent = from ? '— ' + from : ''; } box.querySelector('.pc-cnt').textContent = f.msg.value.length + ' / 400'; f.from_name.disabled = f.anon.checked; };
    card(prev, d, { msg: '', from: u ? u.nick : '' });
    f.addEventListener('input', upd); upd();
    const inBtn = box.querySelector('[data-pc-in]'); if (inBtn) inBtn.onclick = e => { e.preventDefault(); window.PPAccount && PPAccount.openSignIn(); };
    f.onsubmit = async e => {
      e.preventDefault(); const er = f.querySelector('.pc-err'); er.textContent = '';
      const em = f.to_email.value.trim(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) { er.textContent = tr(W.err.email); f.to_email.focus(); return; }
      const btn = f.querySelector('.pc-send'); btn.disabled = true;
      try {
        const r = await fetch('/api/postcards/send', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ design: d.id, greet: f.greet.value.trim() === tr(d.g) ? '' : f.greet.value, msg: f.msg.value, to_name: f.to_name.value, to_email: em, from_name: f.from_name.value, anon: f.anon.checked, lang: L }) });
        const x = await r.json().catch(() => ({}));
        if (!r.ok) { er.textContent = tr(W.err[x.error] || W.err.x); btn.disabled = false; return; }
        done(d, x, em);
      } catch (_) { er.textContent = tr(W.err.x); btn.disabled = false; }
    };
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function done(d, x, em) {
    const box = document.getElementById('pc-main');
    setCount(x.n || shown + 1); for (let i = 0; i < 5; i++) setTimeout(() => pop(document.getElementById('pc-hero')), i * 160);
    const note = x.mail === 'sent' ? W.sentMail(esc(em)) : x.mail === 'queue' ? tr(W.sentQueue) : x.mail === 'block' ? tr(W.sentBlock) : tr(W.sentOff);
    box.innerHTML = `<div class="pc-done"><div class="pc-fly"><span class="pc-env"></span></div><h2 class="pc-h">${tr(W.sent)}</h2><p>${note}</p>
      <label class="pc-link">${tr(W.link)}<span><input readonly value="${esc(x.url)}"><button type="button" class="btn">${tr(W.copy)}</button></span></label>
      ${x.left != null ? `<p class="pc-left">${W.left(x.left)}</p>` : ''}<p><button type="button" class="btn pri pc-again">${tr(W.more)}</button> <a class="btn" href="#inbox">${tr(W.inbox)}</a></p></div>`;
    const inp = box.querySelector('.pc-link input');
    box.querySelector('.pc-link button').onclick = e => { inp.select(); (navigator.clipboard ? navigator.clipboard.writeText(inp.value) : Promise.reject()).catch(() => document.execCommand('copy')); e.target.textContent = tr(W.copied); };
    box.querySelector('.pc-again').onclick = () => gallery(box);
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---------- «Мои открытки» ----------
  async function inbox() {
    const box = document.getElementById('pc-main');
    if (!me()) { window.PPAccount && PPAccount.openSignIn(); return; }
    box.innerHTML = '<p class="pc-wait">…</p>';
    const x = await fetch('/api/postcards/inbox').then(r => r.json()).catch(() => null);
    if (!x) { box.innerHTML = `<p>${tr(W.err.x)}</p>`; return; }
    fetch('/api/postcards/seen', { method: 'POST' }).catch(() => {});
    const list = (a, mine) => a.length ? `<div class="pc-grid pc-inb">${a.map((c, i) => `<a class="pc-it" href="${pre}/postcards/?c=${esc(c.t)}" data-i="${i}" data-m="${mine ? 1 : 0}"><span class="pc-slot"></span><small>${mine ? `${tr(W.to)} ${esc(c.to || c.email)} · ${tr(W.st[c.mail] || W.st.sent)}` : (c.from ? '— ' + esc(c.from) : '— ' + tr(W.secret))}${!mine && !c.seen ? ' <b class="pc-new">new</b>' : ''}</small></a>`).join('')}</div>` : `<p class="pc-none">${tr(W.none)}</p>`;
    box.innerHTML = `<button type="button" class="pc-back">${tr(W.back)}</button><h2 class="pc-h">${tr(W.inbox)}</h2><h3>${tr(W.got)} · ${x.got.length}</h3>${list(x.got, false)}<h3>${tr(W.sentL)} · ${x.sent.length}</h3>${list(x.sent, true)}`;
    box.querySelector('.pc-back').onclick = () => { history.replaceState(null, '', location.pathname); gallery(box); };
    box.querySelectorAll('.pc-it').forEach(a => { const c = (a.dataset.m === '1' ? x.sent : x.got)[+a.dataset.i], d = DS.byId(c.design); if (d) card(a.querySelector('.pc-slot'), d, { still: true, greet: c.greet, msg: c.msg, from: c.from || tr(W.secret) }); });
  }

  // ---------- открытка по ссылке из письма: конверт → открытка ----------
  async function view(tok) {
    const box = document.getElementById('pc-main');
    document.body.classList.add('pc-viewing');
    const x = await fetch('/api/postcards/card?t=' + encodeURIComponent(tok)).then(r => r.ok ? r.json() : null).catch(() => null);
    const d = x && DS.byId(x.card.design);
    if (!d) { box.innerHTML = `<p class="pc-none">${tr(W.notFound)}</p>`; gallery(document.getElementById('pc-gal')); return; }
    const c = x.card;
    box.innerHTML = `<div class="pc-view"><button type="button" class="pc-envl" aria-label="${esc(tr(W.tap))}"><span class="pc-flap"></span><span class="pc-body"><span class="pc-to">${esc(W.forYou(c.to))}</span></span><span class="pc-seal">P</span><span class="pc-in"></span></button><p class="pc-tap">${tr(W.tap)}</p>
      <div class="pc-after" hidden>${x.got ? `<p class="pc-kept">${tr(W.kept)}</p>` : ''}<a class="btn pri" href="${pre}/postcards/">🎁 ${tr(W.reply)}</a></div></div>`;
    const env = box.querySelector('.pc-envl'), slot = box.querySelector('.pc-in');
    card(slot, d, { greet: c.greet, msg: c.msg, from: c.from || tr(W.secret) });
    const open = () => { if (env.classList.contains('open')) return; env.classList.add('open'); box.querySelector('.pc-tap').hidden = true; setTimeout(() => { box.querySelector('.pc-after').hidden = false; }, 1400); };
    env.onclick = open; setTimeout(open, 2600);
  }

  // ---------- старт ----------
  function start() {
    const shot = location.search.match(/[?&]shot=([\w-]+)/);
    if (shot) { // кадры для письма (tools/postcard_gifs.py): одна открытка без надписи, анимация — по команде
      document.body.classList.add('pc-shot'); const d = DS.byId(shot[1]); const el = document.getElementById('pc-shot');
      const st = card(el, d, { still: true }); window.PPPostcard.draw = t => st.frame(t); return;
    }
    hero(document.getElementById('pc-hero'));
    const tok = (location.search.match(/[?&]c=(p[0-9a-f]{24})/) || [])[1];
    if (tok) view(tok); else gallery(document.getElementById('pc-main'));
    const go = () => { if (location.hash === '#inbox') inbox(); };
    addEventListener('hashchange', go);
    document.addEventListener('pp:whoami', () => { go(); const f = document.querySelector('.pc-form'); if (f && me() && f.querySelector('[data-pc-in]')) { const d = DS.byId(document.querySelector('.pc-prev').dataset.d); if (d) compose(d); } });
    if (window.PPWho) go();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
