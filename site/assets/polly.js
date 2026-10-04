// Полли живёт на сайте: гуляет внизу экрана, сидит на шапке, клюёт кнопки,
// озирается, спит пузом кверху (z z Z). По клику говорит фразу и перелетает.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lang = document.documentElement.lang;
  const T = {
    en: { say: ['Need more coffee.', 'I’m not lost, I’m exploring.', 'Have you seen my worm chips?', 'Sketch first, worry later.',
      'This is my office now.', 'Coo.', 'Don’t tell Mr.Chew I was here.', 'Five more minutes…', 'Is that a crumb?', 'This button tastes like design.'],
      wake: ['Huh?! I wasn’t sleeping.', 'Five more minutes…'] },
    lv: { say: ['Vajag vēl kafiju.', 'Es neesmu apmaldījusies, es pētu.', 'Vai neesi redzējis manus tārpu čipsus?', 'Vispirms skicē, uztraucies vēlāk.',
      'Tagad šis ir mans birojs.', 'Kū.', 'Nesaki Mr.Chew, ka es te biju.', 'Vēl piecas minūtes…', 'Vai tā ir drupačiņa?', 'Šī poga garšo pēc dizaina.'],
      wake: ['Ko?! Es negulēju.', 'Vēl piecas minūtes…'] },
    ru: { say: ['Нужно больше кофе.', 'Я не заблудилась, я исследую.', 'Ты не видел мои червячковые чипсы?', 'Сначала скетч, переживания потом.',
      'Теперь это мой офис.', 'Курлык.', 'Не говори Мистеру Чу, что я тут была.', 'Ещё пять минуточек…', 'Это что, крошка?', 'Эта кнопка на вкус как дизайн.'],
      wake: ['Ой! Я не спала.', 'Ещё пять минуточек…'] },
  }[lang] || null;
  const TXT = T || { say: ['Coo.'], wake: ['Huh?!'] };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const wait = ms => new Promise(r => setTimeout(r, ms));

  // ---------- спрайт ----------
  const BODY = [
    '......ddd.....',
    '.....dbbbd....',
    '....dbbwwbd...',
    '....dbbwkbdoo.',
    '....dbbbbbdo..',
    '...dbbbbbbd...',
    '..dbbsbbbbd...',
    '.dbbssbbbbd...',
    'dbbssbbbbbd...',
    'dbbbbbbbbd....',
    '.ddbbbbbdd....',
    '...ddddd......',
  ];
  const LEGS = {
    a: ['....o..o......', '...oo.oo......'],
    b: ['.....o.o......', '....oo.oo.....'],
    fly: ['..............', '..............'],
  };
  const CLOSED_EYE = row => row.replace('wwb', 'bbb').replace('wkb', 'ddb');
  const COL = { d: '#1a1528', b: '#7f81bf', s: '#5e5a9c', w: '#ffffff', k: '#1a1528', o: '#f2a73b' };
  const PX = innerWidth < 600 ? 3 : 4;
  const W = 14 * PX, H = 14 * PX;
  const makeFrame = (legs, closed) => {
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    const rows = (closed ? BODY.map((r, i) => (i === 2 || i === 3 ? CLOSED_EYE(r) : r)) : BODY).concat(legs);
    rows.forEach((r, y) => [...r].forEach((ch, x) => { if (COL[ch]) { g.fillStyle = COL[ch]; g.fillRect(x * PX, y * PX, PX, PX); } }));
    return c;
  };
  const F = { a: makeFrame(LEGS.a), b: makeFrame(LEGS.b), fly: makeFrame(LEGS.fly), sleep: makeFrame(LEGS.a, true) };

  // ---------- DOM ----------
  const pet = document.createElement('div');
  pet.className = 'polly-pet';
  pet.setAttribute('aria-hidden', 'true');
  pet.innerHTML = '<div class="polly-bubble"></div><div class="polly-zzz"><i>z</i><i>z</i><i>Z</i></div><button class="polly-body" type="button" tabindex="-1"></button>';
  const bubble = pet.querySelector('.polly-bubble'), zzz = pet.querySelector('.polly-zzz'), body = pet.querySelector('.polly-body');
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  body.appendChild(cv);
  document.body.appendChild(pet);
  const g = cv.getContext('2d');
  const show = f => { g.clearRect(0, 0, W, H); g.drawImage(F[f], 0, 0); };

  let x = 20, y = innerHeight - H - 8, dir = 1, spot = 'floor', perch = null, busy = false, token = 0;
  const place = () => { pet.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`; };
  const face = d => { dir = d; body.classList.toggle('flip', d < 0); };
  show('a'); place();

  // ---------- места ----------
  const header = document.querySelector('.site-header');
  const floorY = () => innerHeight - H - 8;
  const headerSpot = () => {
    // любой свободный промежуток в шапке (между логотипом, пунктами меню и переключателем)
    const hb = header.getBoundingClientRect();
    const items = [header.querySelector('.brand'), ...header.querySelectorAll('.site-nav > ul > li, .lang-switch, .menu-toggle')]
      .map(e => e.getBoundingClientRect()).filter(r => r.width && r.top < hb.bottom && r.bottom > hb.top)
      .sort((a, b) => a.left - b.left);
    const gaps = [];
    for (let i = 0; i < items.length; i++) {
      const from = items[i].right + 4, to = (items[i + 1] ? items[i + 1].left : hb.right) - 4;
      if (to - from >= W) gaps.push([from, to]);
    }
    if (!gaps.length) return null;
    const [a, b] = pick(gaps);
    return { x: a + Math.random() * (b - a - W), y: hb.bottom - H };
  };
  const buttonSpot = () => {
    const hb = header.getBoundingClientRect().bottom;
    const els = [...document.querySelectorAll('main .btn, main .cta-btn, main .theme-chip, main .pill, main .about-actions .btn, .site-footer a')]
      .filter(e => { const r = e.getBoundingClientRect(); return r.width > W * 0.8 && r.top > hb + H + 10 && r.bottom < innerHeight - 10; });
    if (!els.length) return null;
    const el = pick(els), r = el.getBoundingClientRect();
    return { x: r.left + Math.min(r.width - W, Math.max(0, r.width * 0.15 + Math.random() * r.width * 0.5)), y: r.top - H + 3, el };
  };

  // ---------- движения ----------
  const frameLoop = (ms, step) => new Promise(res => {
    const my = token, t0 = performance.now();
    const tick = now => {
      if (my !== token) return res(false);
      const k = Math.min(1, (now - t0) / ms);
      step(k);
      if (k < 1) requestAnimationFrame(tick); else res(true);
    };
    requestAnimationFrame(tick);
  });

  const walkTo = async tx => {
    face(tx > x ? 1 : -1);
    if (reduce) { x = tx; place(); return true; }
    const x0 = x, dist = Math.abs(tx - x0);
    let last = 0;
    return frameLoop(dist / 0.06, k => {
      x = x0 + (tx - x0) * k;
      const f = Math.floor(k * dist / 10) % 2;
      if (f !== last) { last = f; show(f ? 'b' : 'a'); }
      y = (spot === 'floor' ? floorY() : y) - (f ? 2 : 0);
      place();
    }).then(ok => { show('a'); y = spot === 'floor' ? floorY() : y; place(); return ok; });
  };

  const flyTo = async (tx, ty) => {
    face(tx > x ? 1 : -1);
    if (reduce) { x = tx; y = ty; place(); return true; }
    const x0 = x, y0 = y, dist = Math.hypot(tx - x0, ty - y0), arc = Math.min(160, 40 + dist * 0.25);
    show('fly');
    return frameLoop(Math.max(600, dist * 1.6), k => {
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      x = x0 + (tx - x0) * e;
      y = y0 + (ty - y0) * e - Math.sin(Math.PI * k) * arc;
      body.classList.toggle('flap', Math.floor(k * 24) % 2 === 0);
      place();
    }).then(ok => { body.classList.remove('flap'); show('a'); return ok; });
  };

  const peck = async (n, el) => {
    for (let i = 0; i < n; i++) {
      if (!reduce) body.classList.add('peck');
      el && el.classList.add('pecked');
      await wait(380);
      body.classList.remove('peck');
      el && el.classList.remove('pecked');
      await wait(300 + Math.random() * 500);
    }
  };

  const say = async (text, ms = 2600) => {
    bubble.textContent = text;
    bubble.classList.add('show');
    await wait(ms);
    bubble.classList.remove('show');
  };

  // ---------- поведение ----------
  const goFloor = () => { spot = 'floor'; perch = null; return flyTo(Math.max(10, Math.min(innerWidth - W - 10, x)), floorY()); };

  const DEBUG = location.search.includes('pollydebug');
  async function act() {
    const my = token;
    const roll = Math.random();
    if (DEBUG) console.log('polly act', roll.toFixed(2), spot);
    if (spot === 'button' && perch) {
      const r = perch.getBoundingClientRect();
      if (r.top < header.getBoundingClientRect().bottom || r.bottom > innerHeight) return goFloor();
    }
    if (roll < 0.22 && spot === 'floor') {
      await walkTo(10 + Math.random() * Math.min(innerWidth - W - 20, 520));
      if (my === token) await peck(1 + Math.floor(Math.random() * 3));
    } else if (roll < 0.36) {
      const s = headerSpot();
      if (s) { spot = 'header'; perch = null; await flyTo(s.x, s.y); if (my === token) await peck(2); }
    } else if (roll < 0.58) {
      const s = buttonSpot();
      if (s) { spot = 'button'; perch = s.el; await flyTo(s.x, s.y); if (my === token) await peck(2 + Math.floor(Math.random() * 3), s.el); }
    } else if (roll < 0.70 && spot !== 'button') {
      await sleep();
    } else if (roll < 0.82) {
      face(-dir); await wait(700); face(-dir); await wait(500);
    } else if (spot !== 'floor') {
      await goFloor();
    } else {
      await peck(2);
    }
  }

  async function sleep() {
    body.classList.add('sleeping');
    show('sleep');
    zzz.classList.add('show');
    const my = token;
    await wait(7000 + Math.random() * 6000);
    if (my !== token) return;
    zzz.classList.remove('show');
    body.classList.remove('sleeping');
    show('a');
  }

  async function life() {
    await wait(2500);
    for (;;) {
      const blocked = document.body.classList.contains('modal-open') || document.querySelector('.lightbox.open') || document.body.classList.contains('menu-open');
      pet.classList.toggle('hidden', !!blocked);
      if (!busy && !blocked && !document.hidden) await act();
      await wait(1500 + Math.random() * 3500);
    }
  }

  body.addEventListener('click', async () => {
    if (busy) return;
    busy = true;
    token++;
    const wasSleeping = body.classList.contains('sleeping');
    body.classList.remove('sleeping', 'peck', 'flap');
    zzz.classList.remove('show');
    show('a');
    if (wasSleeping) { body.classList.add('startle'); setTimeout(() => body.classList.remove('startle'), 400); }
    await say(wasSleeping ? pick(TXT.wake) : pick(TXT.say));
    const s = Math.random() < 0.5 ? headerSpot() : buttonSpot();
    if (s) { spot = s.el ? 'button' : 'header'; perch = s.el || null; await flyTo(s.x, s.y); }
    else { spot = 'floor'; perch = null; await flyTo(20 + Math.random() * (innerWidth * 0.6), floorY()); }
    busy = false;
  });

  // при прокрутке и изменении окна — обратно на «пол»
  let st;
  const reset = () => {
    if (spot === 'floor' && !body.classList.contains('sleeping')) { y = floorY(); x = Math.min(x, innerWidth - W - 10); place(); return; }
    clearTimeout(st);
    st = setTimeout(() => {
      if (spot === 'button' || spot === 'header' && innerWidth < 1281) { token++; body.classList.remove('sleeping'); zzz.classList.remove('show'); goFloor(); }
      if (spot === 'floor') { y = floorY(); place(); }
    }, 150);
  };
  addEventListener('scroll', () => { if (spot === 'button') reset(); }, { passive: true });
  addEventListener('resize', reset);

  // Полли сама прилетает клевать печать конверта на главной (today.js)
  window.PollyPet = {
    async visit(el) {
      if (pet.classList.contains('hidden') || reduce) return false;
      busy = true; token++;
      body.classList.remove('sleeping', 'peck', 'flap'); zzz.classList.remove('show'); show('a');
      spot = 'visit'; perch = null;
      const r = el.getBoundingClientRect();
      await flyTo(r.left + r.width * 0.5 - W + 6, r.top + r.height * 0.5 - H * 0.3);
      face(1);
      await peck(3, el);
      return true;
    },
    async done() {
      await wait(700);
      await goFloor();
      busy = false;
    },
  };

  y = floorY(); place();
  life();
})();
