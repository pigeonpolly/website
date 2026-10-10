// Полли живёт на сайте: гуляет внизу экрана, сидит на шапке, клюёт кнопки,
// озирается, спит пузом кверху (z z Z). По клику говорит фразу и перелетает.
// По сезонам в подвале страницы лежат вещи, и Полли с ними играет: осень — листья и куча листьев (в октябре ещё тыквы),
// зима — снежки и сугроб, лето — мороженое и цветочки, весной из Полли в полёте сыплются лепестки. Проверка: ?season=autumn|october|winter|spring|summer
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
  let carry = null, push = null; // что Полли несёт в клюве (листик) / катит перед собой (снежок)
  const place = () => {
    pet.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    if (carry) { carry.x = dir > 0 ? x + 11 * PX : x + 3 * PX - carry.w; carry.y = y + 3 * PX; putProp(carry); }
    if (push) { const nx = dir > 0 ? x + 12 * PX : x + 2 * PX - push.w; push.rot = (push.rot || 0) + (nx - push.x) * 6; push.x = nx; putProp(push); }
  };
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
    const x0 = x, dist = Math.abs(tx - x0), yb = spot === 'floor' ? floorY() : spot === 'footer' ? gY() - H : y;
    let last = 0;
    return frameLoop(dist / 0.06, k => {
      x = x0 + (tx - x0) * k;
      const f = Math.floor(k * dist / 10) % 2;
      if (f !== last) { last = f; show(f ? 'b' : 'a'); }
      y = yb - (f ? 2 : 0);
      place();
    }).then(ok => { show('a'); y = yb; place(); return ok; });
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
      if (SEASON === 'spring' && Math.random() < .25) petal(x + W / 2, y + H * .6);
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
    // наверху (на шапке) облачко ушло бы за край экрана — тогда показываем его под Полли; у правого края — левее
    const r = pet.getBoundingClientRect();
    bubble.classList.toggle('below', r.top < 140);
    bubble.classList.toggle('flip', r.left > innerWidth - 240);
    bubble.classList.add('show');
    await wait(ms);
    bubble.classList.remove('show');
  };

  // ---------- сезонные вещи в подвале страницы ----------
  const SEASON = (() => {
    const q = (location.search.match(/[?&]season=(\w+)/) || [])[1]; if (q) return q;
    const m = new Date().getMonth();
    return m === 9 ? 'october' : m >= 8 && m <= 10 ? 'autumn' : m === 11 || m <= 1 ? 'winter' : m <= 4 ? 'spring' : 'summer';
  })();
  const sprite = (rows, pal) => {
    const c = document.createElement('canvas'); c.width = rows[0].length * PX; c.height = rows.length * PX;
    const g2 = c.getContext('2d');
    rows.forEach((r, yy) => [...r].forEach((ch, xx) => { if (pal[ch]) { g2.fillStyle = pal[ch]; g2.fillRect(xx * PX, yy * PX, PX, PX); } }));
    return c;
  };
  // куча листьев / сугроб: купол из пикселей случайных цветов
  const dome = (w, h, cols) => {
    const rows = [];
    for (let yy = 0; yy < h; yy++) {
      let r = '';
      for (let xx = 0; xx < w; xx++) {
        const dx = (xx - (w - 1) / 2) / (w / 2), dy = (h - yy) / h;
        r += dx * dx + dy * dy * 1.05 <= 1 + (Math.random() - .5) * .25 ? String(Math.floor(Math.random() * cols.length)) : '.';
      }
      rows.push(r);
    }
    return sprite(rows, Object.fromEntries(cols.map((c, i) => [String(i), c])));
  };
  const LEAF_C = ['#E07B39', '#C8452B', '#E9B23B', '#A3592A', '#D9952F'];
  const SPR = {
    leaf: () => sprite(['....l', '..lll', '.lll.', 'lll..', 's....'], { l: pick(LEAF_C), s: '#5B3A1E' }),
    pumpkin: () => sprite(['.....g.....', '....gg.....', '..oOoOoOo..', '.oOoOoOoOo.', 'oOoOoOoOoOo', 'oOkOoOoOkOo', 'oOoOoOoOoOo', '.oOkkkkkOo.', '..ooooooo..'],
      { o: '#E8812E', O: '#C9621C', g: '#4E7A2E', k: Math.random() < .5 ? '#3A1E0E' : '#E8812E' }),
    snowball: () => sprite(['.wwww.', 'wwwwww', 'wwwwbw', 'wwwbbw', '.wbbb.'], { w: '#F4F7FB', b: '#C9D6E6' }),
    icecream: () => { const c = pick(['#F7A8C4', '#A8E6CF', '#F5E6A8', '#8B5A3C']); return sprite(['.ppp.', 'ppppp', 'pphpp', 'ccccc', '.cCc.', '.cCc.', '..c..'], { p: c, h: '#FFFFFF', c: '#D9A45B', C: '#B98236' }); },
    flower: () => { const c = pick(['#F28AB2', '#F6C445', '#B79CF2', '#F47C5B', '#FFFFFF']); return sprite(['.p.', 'pyp', '.p.', '.s.', 'ss.', '.s.'], { p: c, y: '#F6D04D', s: '#5E9E45' }); },
  };
  // вещи лежат на дне подвала (.polly-ground, прокручиваются со страницей); когда Полли их несёт или катит — «свободные» (position: fixed)
  const foot = document.querySelector('.site-footer'), GOFF = 6, props = [];
  let ground = null;
  const gRect = () => ground.getBoundingClientRect();
  const gY = () => gRect().bottom - GOFF; // линия земли подвала в координатах экрана
  const groundSeen = () => { if (!ground) return false; const r = gRect(); return r.bottom <= innerHeight + 2 && r.bottom > H + 80; };
  const vx = p => p.free ? p.x : gRect().left + p.lx;
  function putProp(p) {
    const rot = p.rot ? ` rotate(${Math.round(p.rot) % 360}deg)` : '';
    if (p.free) p.el.style.transform = `translate(${Math.round(p.x)}px, ${Math.round(p.y)}px)` + rot;
    else { p.el.style.transform = rot; p.el.style.left = Math.round(p.lx) + 'px'; }
  }
  function freeProp(p) { const r = gRect(); p.x = r.left + p.lx; p.y = r.bottom - GOFF - p.h; p.free = true; p.el.classList.add('free'); document.body.appendChild(p.el); putProp(p); }
  function seat(p) { const r = gRect(); p.lx = Math.max(0, Math.min(r.width - p.w, p.x - r.left)); p.fx = p.lx / Math.max(1, r.width - p.w); p.free = false; p.el.classList.remove('free'); ground.appendChild(p.el); putProp(p); }
  function addProp(kind, el, fx) {
    el.className = 'polly-prop';
    const p = { kind, el, w: el.width, h: el.height, fx, lx: fx * Math.max(0, ground.clientWidth - el.width), free: false };
    ground.appendChild(el); putProp(p); props.push(p); return p;
  }
  if (foot && SEASON !== 'spring') {
    ground = document.createElement('div'); ground.className = 'polly-ground'; ground.setAttribute('aria-hidden', 'true');
    foot.classList.add('has-ground'); foot.appendChild(ground);
    const few = innerWidth < 600, spots = [];
    const free = () => { for (let i = 0; i < 30; i++) { const f = .03 + Math.random() * .94; if (spots.every(s => Math.abs(s - f) > (few ? .14 : .07))) { spots.push(f); return f; } } return Math.random(); };
    if (SEASON === 'autumn' || SEASON === 'october') {
      addProp('pile', dome(few ? 18 : 22, few ? 6 : 7, LEAF_C), free());
      for (let i = 0; i < (few ? 3 : 6); i++) addProp('leaf', SPR.leaf(), free());
      if (SEASON === 'october') for (let i = 0; i < 2; i++) addProp('pumpkin', SPR.pumpkin(), free());
    } else if (SEASON === 'winter') {
      addProp('drift', dome(few ? 18 : 24, few ? 6 : 7, ['#F4F7FB', '#E6EEF7', '#FFFFFF', '#D3DFEC']), free());
      for (let i = 0; i < (few ? 2 : 4); i++) addProp('snowball', SPR.snowball(), free());
    } else if (SEASON === 'summer') {
      for (let i = 0; i < (few ? 1 : 2); i++) addProp('icecream', SPR.icecream(), free());
      for (let i = 0; i < (few ? 3 : 5); i++) addProp('flower', SPR.flower(), free());
    }
  }
  const layoutProps = () => props.forEach(p => { if (!p.free) { p.lx = p.fx * Math.max(0, ground.clientWidth - p.w); putProp(p); } });
  // частицы: листья, снег, лепестки, сердечки
  function burst(px, py, colors, n, spread = 1) {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const d = document.createElement('i'); d.className = 'polly-bit'; d.setAttribute('aria-hidden', 'true');
      const sz = PX * (Math.random() < .5 ? 1 : 2);
      d.style.cssText = `left:${px}px;top:${py}px;width:${sz}px;height:${sz}px;background:${pick(colors)};--dx:${Math.round((Math.random() - .5) * 90 * spread)}px;--dy:${Math.round(-20 - Math.random() * 50 * spread)}px;--r:${Math.round(Math.random() * 360)}deg`;
      d.addEventListener('animationend', () => d.remove()); document.body.appendChild(d);
    }
  }
  function petal(px, py) {
    const d = document.createElement('i'); d.className = 'polly-petal'; d.setAttribute('aria-hidden', 'true');
    d.style.cssText = `left:${px}px;top:${py}px;width:${PX + 1}px;height:${PX}px;background:${pick(['#F7B6C8', '#FCE1E8', '#F28AB2', '#FFFFFF'])};--dx:${Math.round((Math.random() - .5) * 60)}px;--fall:${Math.round(Math.min(260, innerHeight - py))}px`;
    d.addEventListener('animationend', () => d.remove()); document.body.appendChild(d);
  }
  const near = kind => { const list = props.filter(p => p.kind === kind && p !== carry && p !== push); return list.length ? pick(list) : null; };
  const drop = (p, ms = 520) => new Promise(res => {
    const y0 = p.y, x0 = p.x, t0 = performance.now();
    const tick = now => { const k = Math.min(1, (now - t0) / ms); p.y = y0 + (gY() - p.h - y0) * k * k; p.x = x0 + Math.sin(k * Math.PI * 2) * 6; putProp(p); k < 1 ? requestAnimationFrame(tick) : (seat(p), res()); };
    requestAnimationFrame(tick);
  });
  const standBy = p => { const px = vx(p), lx = px - 11 * PX, rx = px + p.w - 3 * PX; return Math.abs(lx - x) < Math.abs(rx - x) && lx > 4 ? lx : Math.min(innerWidth - W - 4, rx); };
  const somewhere = () => { const r = gRect(); return Math.max(4, r.left + 10) + Math.random() * (Math.min(innerWidth, r.right) - Math.max(4, r.left + 10) - W - 10); };
  async function seasonal() {
    if (!props.length || !groundSeen()) return false;
    const my = token, ok = () => my === token && groundSeen();
    // сначала Полли спускается на дно подвала
    if (spot !== 'footer') { spot = 'footer'; perch = null; await flyTo(Math.max(10, Math.min(innerWidth - W - 10, x)), gY() - H); if (!ok()) return true; }
    const kinds = props.map(p => p.kind), r = Math.random();
    // листик в клюве: подобрать, отнести, бросить
    if (kinds.includes('leaf') && r < .45) {
      const p = near('leaf'); await walkTo(standBy(p)); if (!ok()) return true;
      face(vx(p) > x ? 1 : -1); await peck(1); if (!ok()) return true;
      freeProp(p); carry = p; place(); await walkTo(somewhere());
      carry = null; await drop(p); if (ok()) await peck(1); return true;
    }
    // снежок: катит перед собой
    if (kinds.includes('snowball') && r < .45) {
      const p = near('snowball'), tx = somewhere(), d = tx > vx(p) ? 1 : -1;
      await walkTo(d > 0 ? vx(p) - 12 * PX : vx(p) + p.w - 2 * PX); if (!ok()) return true;
      face(d); freeProp(p); push = p; await walkTo(tx); push = null; seat(p);
      if (ok()) await peck(1); return true;
    }
    // нырнуть в кучу листьев / сугроб
    const heap = near('pile') || near('drift');
    if (heap && r < .75) {
      const cols = heap.kind === 'pile' ? LEAF_C : ['#FFFFFF', '#E6EEF7', '#D3DFEC'], hx = vx(heap);
      await walkTo(hx > x ? hx - W - 10 : hx + heap.w + 10); if (!ok()) return true;
      await flyTo(hx + heap.w / 2 - W / 2, gY() - H + PX * 2); if (!ok()) return true;
      pet.classList.add('diving'); heap.el.classList.add('wiggle');
      burst(hx + heap.w / 2, gY() - heap.h + 4, cols, 16);
      await wait(1400 + Math.random() * 1600);
      heap.el.classList.remove('wiggle'); pet.classList.remove('diving');
      if (my !== token) return true;
      burst(hx + heap.w / 2, gY() - heap.h + 4, cols, 12, .8);
      await flyTo(Math.max(10, Math.min(innerWidth - W - 10, hx + (Math.random() < .5 ? -W - 20 : heap.w + 20))), gY() - H);
      return true;
    }
    // посидеть на тыкве
    if (kinds.includes('pumpkin') && r < .9) {
      const p = near('pumpkin');
      await flyTo(vx(p) + p.w / 2 - W / 2, gY() - p.h - H + PX * 2); if (!ok()) return true;
      spot = 'pumpkin'; await peck(1); await wait(2500 + Math.random() * 3000);
      if (ok() && spot === 'pumpkin') { spot = 'footer'; await flyTo(vx(p) + p.w + 8, gY() - H); }
      return true;
    }
    // лето: лизнуть мороженое, понюхать цветочек
    const yum = near('icecream'), fl = near('flower');
    if (yum || fl) {
      const p = yum && (r < .5 || !fl) ? yum : fl;
      await walkTo(standBy(p)); if (!ok()) return true;
      face(vx(p) > x ? 1 : -1); await peck(p.kind === 'icecream' ? 3 : 1);
      if (ok()) burst(x + W / 2, y + 4, ['#F28AB2', '#E5484D'], 3, .4);
      return true;
    }
    return false;
  }

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
    if (groundSeen() && props.length && (spot === 'floor' || spot === 'footer') && Math.random() < 0.6 && await seasonal()) return;
    if (spot === 'footer') return goFloor();
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
    if (carry) { const p = carry; carry = null; drop(p); }
    if (push) { const p = push; push = null; seat(p); } pet.classList.remove('diving'); props.forEach(p => p.el.classList.remove('wiggle'));
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
    if (ground) layoutProps();
    if (spot === 'pumpkin' || spot === 'footer') { token++; pet.classList.remove('diving'); goFloor(); return; }
    if (spot === 'floor' && !body.classList.contains('sleeping')) { y = floorY(); x = Math.min(x, innerWidth - W - 10); place(); return; }
    clearTimeout(st);
    st = setTimeout(() => {
      if (spot === 'button' || spot === 'header' && innerWidth < 1281) { token++; body.classList.remove('sleeping'); zzz.classList.remove('show'); goFloor(); }
      if (spot === 'floor') { y = floorY(); place(); }
    }, 150);
  };
  addEventListener('scroll', () => { if (spot === 'button' || spot === 'footer' || spot === 'pumpkin') reset(); }, { passive: true });
  addEventListener('resize', reset);

  // Полли сама прилетает клевать печать конверта на главной (today.js)
  window.PollyPet = {
    play: () => { token++; busy = false; return seasonal(); }, // проверка сезонных игр из консоли
    async visit(el) {
      if (pet.classList.contains('hidden') || reduce) return false;
      busy = true; token++;
      body.classList.remove('sleeping', 'peck', 'flap'); zzz.classList.remove('show'); show('a');
      spot = 'visit'; perch = null;
      const target = () => { const r = el.getBoundingClientRect(); return [r.left + r.width * 0.5 - W + 6, r.top + r.height * 0.5 - H * 0.3]; };
      await flyTo(...target());
      // страница могла сдвинуться (прокрутка, панель браузера на телефоне) — подлетаем точнее
      for (let i = 0; i < 3; i++) {
        const [tx, ty] = target();
        if (Math.hypot(tx - x, ty - y) < 6) break;
        await flyTo(tx, ty);
      }
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
