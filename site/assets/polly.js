// Полли живёт на сайте: гуляет внизу экрана, сидит на шапке, клюёт кнопки,
// озирается, спит пузом кверху (z z Z). По клику говорит фразу и перелетает.
// По сезонам в подвале страницы лежат вещи, и Полли с ними играет: осень — листья и куча листьев (в октябре ещё тыквы),
// зима — снежки и сугроб, лето — мороженое и цветочки, весной из Полли в полёте сыплются лепестки. Проверка: ?season=autumn|october|winter|spring|summer
// С 20.11.2026 в уголке — вещица, шапка и фразы месяца (MONTH, HATW, ACC, MSAY). Проверка: ?month=1…12, ?day=ММ-ДД, ?bday
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lang = document.documentElement.lang;
  const T = {
    en: { say: ['Need more coffee.', 'I’m not lost, I’m exploring.', 'Have you seen my worm chips?', 'Sketch first, worry later.',
      'This is my office now.', 'Coo.', 'Don’t tell Mr.Chew I was here.', 'Five more minutes…', 'Is that a crumb?', 'This button tastes like design.'],
      wake: ['Huh?! I wasn’t sleeping.', 'Five more minutes…'] },
    lv: { say: ['Vajag vēl kafiju.', 'Es neesmu apmaldījies, es pētu.', 'Vai neesi redzējis manus tārpu čipsus?', 'Vispirms skicē, uztraucies vēlāk.',
      'Tagad šis ir mans birojs.', 'Kū.', 'Nesaki Mr.Chew, ka es te biju.', 'Vēl piecas minūtes…', 'Vai tā ir drupačiņa?', 'Šī poga garšo pēc dizaina.'],
      wake: ['Ko?! Es negulēju.', 'Vēl piecas minūtes…'] },
    ru: { say: ['Нужно больше кофе.', 'Я не заблудился, я исследую.', 'Ты не видел мои червячковые чипсы?', 'Сначала скетч, переживания потом.',
      'Теперь это мой офис.', 'Курлык.', 'Не говори Мистеру Чу, что я тут был.', 'Ещё пять минуточек…', 'Это что, крошка?', 'Эта кнопка на вкус как дизайн.'],
      wake: ['Ой! Я не спал.', 'Ещё пять минуточек…'] },
  }[lang] || null;
  const TXT = T || { say: ['Coo.'], wake: ['Huh?!'] };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const wait = ms => new Promise(r => setTimeout(r, ms));

  // ---------- спрайт ----------
  // 20.11.2026 новая Полли: детальнее, в малиновом берете, как на логотипе (вариант «Б» Алины). Слои рисует tools/polly_sprite.py:
  // тело, лапки, закрытый глаз, головные уборы (берет, колпак, венок, ведьмина шляпа, шапка Санты) и вещи (шарф, очки, «нос с усами», ленточка)
  const PCOL = {a: '#1a1528', b: '#544a8e', c: '#ffffff', d: '#f08a3c', e: '#f2a7b8', f: '#c8642a', g: '#7d75b8', h: '#3e3673', i: '#6a61a3', j: '#2e2860', k: '#c8335f', l: '#e0517a', m: '#a82a50', n: '#5ba3d9', o: '#f6c445', p: '#e5484d', q: '#4e7a2e', r: '#6a9a3a', s: '#f6d04d', t: '#f28ab2', u: '#2b2440', v: '#8a63b8', w: '#d63a3a', x: '#f4f1ea', y: '#1f1b2e', z: '#8fb3d9', A: '#e8a07a', B: '#3a2a1e', C: '#9e3039'};
  const PL = {
    body: [5,['............aaaaaa','...........abbbbbba','..........abbbbbbbba','.........abbbbbbbbbba','........abbbbbbbbbbbba','........abbbbbbcccccba','........abbbbbbcccaabaaa','........abbbbbbccaaabdddaa','........abbbbbbccaaabddddda','........abbbbbbbbbbbbddaaa','.......aabbbbbbeeebbbfffa','......abbbbbbbbbbbbbbaaa','....aabbbbbbbbbggbbbba','...abbhhhhbbbggggggbba','..abbhhiihbbggggggggba','.abbhhiihhhbggggggggba','abbhhiihhjhbggggggggba','bbhhiihhhjbbggggggggba','bhhhhhhjjbbbggggggggba','abhhjjjhbbbbgggggggga','.abbbbbbbbbbbgggggga','..aabbbbbbbbbbbggba','....aabbbbbbaaaaaa','......aaaaaa']],
    legA: [28,['...............a','.........ada..ada','.........ada..ada','.........ada..ada','........aada.aada','.......adddaaddda','........aaa..aaa']],
    legB: [28,['...............a','..........ada.ada','..........ada.ada','..........ada.ada','.........aada.adda','........addda..aa','.........aaa']],
    closed: [10,['...............bbbbb','...............bbbbb','...............bbbbb','...............aa']],
    beret: [0,['.........aaaaakka','.......aakkkkkkkaa','......aklllllkkkkkaa','......akkklllllkkkkka','.......akkkkkkkkkkkkka','........ammmmmmmkkkkkka','.........aammmmmmmmkkka','..............mmmmmmma']],
    party: [0,['..............acca','.............annna','............aoooooa','............annnnna','...........annnpnnaa','..........aoooooooooa','..........annpnnnpna']],
    wreath: [3,['..........aaaaaaaaaaaa','........aaqqrrqqrrqqrraa','.......arqssrqttrqccrssqa','......arrrqqrrqqrrqqrqqqqa','.......arr..........aaqqa','........a.............aa']],
    witch: [0,['.............auua','.............auuua','..............auuua','............aauuuuaa','.........aaavvvvvvvvaa','.......aauuuuuuuuuuuuuaa','......auuuuuuuuuuuuuuuuua','.......auuuuuuuuuuuuuuua','........a............aa']],
    santa: [0,['........acaaaaaa','.......acccwwwwwa','.......acccwwwwwwa','........acwwwwwwwa','.........awwwwwwwwa','.........awwwwwwwwwaaa','.........acccccccccccca','.........acccccccccccca','.....................a']],
    scarf: [16,['.........xppxxppxxppxxp','.........xppxxppxxppxxpa','..................pp..a','..................pp','..................xx','..................pp','..................pp','..................oo']],
    shades: [10,['..............yyyyyyy','.............yyzyyyzy','..............yyyyyyy','..............yyyyyyy']],
    groucho: [10,['..............yyyyyyy','..............y..a.cy','..............y....cyAA','..............yyyyyyAAAA','....................AAAA','.....................AA','...................BBBBBBa','......................aaa']],
    ribbon: [18,['...............CCC','...............ccc','...............CCC','...............C.C','...............C.C']]
  };
  // дата (Рига не важна — по часам гостя); проверка: ?month=6, ?day=06-23, ?bday
  const NOW = (() => {
    const q = location.search, d = new Date(), md = q.match(/[?&]day=(\d\d?)-(\d\d?)/), mm = q.match(/[?&]month=(\d\d?)/);
    const sm = { winter: 1, spring: 4, summer: 7, autumn: 9, october: 10 }[(q.match(/[?&]season=(\w+)/) || [])[1]];
    if (md) return { m: +md[1], d: +md[2] };
    if (mm) return { m: +mm[1], d: 10 };
    if (sm) return { m: sm, d: 10 };
    return { m: d.getMonth() + 1, d: d.getDate() };
  })();
  // 23 января (день рождения Полли; проверка ?bday): праздничный колпак вместо берета и прыжок из тортика
  const BDAY = location.search.includes('bday') || (NOW.m === 1 && NOW.d === 23);
  const { m: MM, d: DD } = NOW;
  // головной убор и вещь месяца: Лиго — венок (15–30.06), Хеллоуин — шляпа ведьмы (24–31.10), Рождество — шапка Санты (15–31.12),
  // январь и декабрь — шарф, июль — тёмные очки, 1 апреля — очки с носом и усами, 11–18.11 — латвийская ленточка
  const HATW = BDAY ? 'party' : MM === 6 && DD >= 15 ? 'wreath' : MM === 10 && DD >= 24 ? 'witch' : MM === 12 && DD >= 15 ? 'santa' : 'beret';
  const ACC = MM === 4 && DD === 1 ? 'groucho' : MM === 7 ? 'shades' : MM === 11 && DD >= 11 && DD <= 18 ? 'ribbon' : MM === 1 || MM === 12 ? 'scarf' : null;
  const SP = 2; // пиксель Полли
  const PX = innerWidth < 600 ? 3 : 4; // пиксель вещиц и частиц
  const W = 30 * SP, H = 35 * SP;
  const makeFrame = (legs, closed) => {
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    ['body', legs, closed && 'closed', HATW, ACC].forEach(k => {
      const L = k && PL[k]; if (!L) return;
      L[1].forEach((r, y) => [...r].forEach((ch, x) => { if (PCOL[ch]) { g.fillStyle = PCOL[ch]; g.fillRect(x * SP, (L[0] + y) * SP, SP, SP); } }));
    });
    return c;
  };
  const F = { a: makeFrame('legA'), b: makeFrame('legB'), fly: makeFrame(null), sleep: makeFrame('legA', true) };

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
  let face = d => { dir = d; body.classList.toggle('flip', d < 0); };
  show('a'); place();

  // ---------- места ----------
  const header = document.querySelector('.site-header, .hd2'); // старая шапка или новая (редизайн 2.0)
  const floorY = () => innerHeight - H - 8;
  const headerSpot = () => {
    // любой свободный промежуток в шапке (между логотипом, пунктами меню и переключателем)
    const hb = header.getBoundingClientRect();
    const items = [header.querySelector('.brand, .lg'), ...header.querySelectorAll('.site-nav > ul > li, .lang-switch, .menu-toggle, .nv > a, .hr > *')]
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
    const my = token;
    for (let i = 0; i < n; i++) {
      if (my !== token) break;
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
    const m = NOW.m - 1; // погода — по дате (или ?month= / ?day=), не по переключателю цветов в шапке
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
    jack: () => sprite(['.....g.....', '....gg.....', '..oOoOoOo..', '.oOoOoOoOo.', 'oOyyOoOyyOo', 'oOoyOoOyoOo', 'oOoOoyoOoOo', '.oyOyOyOyo.', '..oyyyyyo..', '...ooooo...'],
      { o: '#E8812E', O: '#C9621C', g: '#4E7A2E', y: '#FFD84A' }), // Хеллоуин: светящаяся рожица
    snowball: () => sprite(['.wwww.', 'wwwwww', 'wwwwbw', 'wwwbbw', '.wbbb.'], { w: '#F4F7FB', b: '#C9D6E6' }),
    icecream: () => { const c = pick(['#F7A8C4', '#A8E6CF', '#F5E6A8', '#8B5A3C']); return sprite(['.ppp.', 'ppppp', 'pphpp', 'ccccc', '.cCc.', '.cCc.', '..c..'], { p: c, h: '#FFFFFF', c: '#D9A45B', C: '#B98236' }); },
    cake: () => sprite(['...f..f..f...', '...c..c..c...', '...c..c..c...', '.wwwwwwwwwww.', 'wwrwwwwwrwwww', 'wpppwpppwpppw', 'ppppppppppppp', 'pPpPpPpPpPpPp',
      'kkkkkkkkkkkkk', 'ppppppppppppp', 'PPPPPPPPPPPPP'], { f: '#F6C445', c: '#93AFCC', w: '#FFF8F0', r: '#E5484D', p: '#F2A7B8', P: '#D9788F', k: '#8B5A3C' }),
    flower: () => { const c = pick(['#F28AB2', '#F6C445', '#B79CF2', '#F47C5B', '#FFFFFF']); return sprite(['.p.', 'pyp', '.p.', '.s.', 'ss.', '.s.'], { p: c, y: '#F6D04D', s: '#5E9E45' }); },
    // 20.11.2026 вещицы месяцев для уголка
    snowman: () => sprite(['...hhh...', '...hhh...', '..hhhhh..', '...www...', '..wkwkw..', '..wwoow..', '...www...', '..wwwww..', '.wwwkwww.', '.wwwwwww.', '.wwwkwww.', '..wwwww..'],
      { h: '#2b2440', w: '#F4F7FB', k: '#1a1528', o: '#F08A3C' }),
    heart: () => sprite(['.rr...rr.', 'rhrr.rrrr', 'rhrrrrrrr', 'rrrrrrrrr', '.rrrrrrr.', '..rrrrr..', '...rrr...', '....r....'], { r: '#E5484D', h: '#F7A8C4' }),
    tulip: () => sprite(['...rrr...', '..rrrrr..', '..rRrRr..', '...rrr...', '..g.G.g..', '...gGg...', '....G....', '.ttttttt.', '..ttttt..', '..tTTTt..', '...ttt...'],
      { r: pick(['#F28AB2', '#F6C445', '#F47C5B']), R: '#D9608F', g: '#6a9a3a', G: '#4E7A2E', t: '#C8642A', T: '#A3592A' }),
    egg: () => sprite(['...yyy...', '..yyyyy..', '.ywyyywy.', '.bbbbbbb.', 'bbwbbbwbb', 'bbbbbbbbb', 'ppppppppp', '.ppwppwp.', '..ppppp..'],
      { y: '#F6C445', b: '#5ba3d9', p: '#F28AB2', w: '#FFFFFF' }),
    can: () => sprite(['..hhhh.....', '.h....h....', '.bbbbbb...s', '.bbbbbb..s.', 'bbbBbbbbss.', '.bbBbbb.s..', '.bbbbbb....', '.bbbbbb....'], { b: '#8fb3d9', B: '#5ba3d9', h: '#5b6b80', s: '#8fb3d9' }),
    cheese: () => sprite(['..yyyyyyy..', '.yykyyykyy.', 'yyyyykyyyyy', 'ykyyyyyykyy', 'yyyykyyyyyy', '.yyyyyyyky.', '..yyyyyyy..'], { y: '#F2C14E', k: '#7a4a1e' }),
    melon: () => sprite(['rrrrrrrrrrrrr', 'rrkrrrkrrrkrr', '.rrrrrrrrrrr.', '.wrrkrrrkrrw.', '..wwrrrrrww..', '..ggwwwwwgg..', '....ggggg....'], { r: '#E5484D', k: '#1a1528', w: '#F4F1EA', g: '#4E9A3A' }),
    apple: () => sprite(['....s.l.', '....sll.', '.rrrsrr.', 'rrhrrrrr', 'rhrrrrrr', 'rrrrrrrr', 'rrrrrrrr', '.rrrrrr.', '..rr.rr.'], { r: '#D93B3B', h: '#F7A8A8', s: '#5B3A1E', l: '#6a9a3a' }),
    mug: () => sprite(['..s.s....', '.s.s.....', '..s.s....', 'wwwwwww..', 'wbbbbbwww', 'wwwwwww.w', 'wrwrwrw.w', 'wwwwwwwww', 'wwwwwww..', '.wwwww...'],
      { w: '#F4F1EA', b: '#7a4a2e', r: '#E5484D', s: '#cfc7bd' }),
    gift: () => sprite(['...r.r...', '....r....', 'ggggrgggg', 'gGggrggGg', 'rrrrrrrrr', 'ggggrgggg', 'gGggrggGg', 'ggggrgggg'], { g: '#4E9A3A', G: '#3d7a2d', r: '#E5484D' }),
  };
  // вещи лежат на дне подвала (.polly-ground, прокручиваются со страницей); когда Полли их несёт или катит — «свободные» (position: fixed)
  const foot = document.querySelector('.site-footer, .ft2'), GOFF = 6, props = [];
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
  function petal(px, py, cols) {
    const d = document.createElement('i'); d.className = 'polly-petal'; d.setAttribute('aria-hidden', 'true');
    d.style.cssText = `left:${px}px;top:${py}px;width:${PX + 1}px;height:${PX}px;background:${pick(cols || ['#F7B6C8', '#FCE1E8', '#F28AB2', '#FFFFFF'])};--dx:${Math.round((Math.random() - .5) * 60)}px;--fall:${Math.round(Math.min(260, innerHeight - py))}px`;
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
  // 12.10.2026 (Алина: «чтобы птичка не прыгала по экрану, а сидела слева внизу»): Полли всегда сидит в левом нижнем углу
  // и только клюёт, оглядывается и иногда засыпает; никуда не летает и не ходит
  const HOME_X = 16;
  // уголок: сезонная вещица лежит рядом с Полли (справа, на «полу» экрана), и Полли играет с ней, не сходя с места
  // 20.11.2026: вещица и погода — по месяцу (MONTH), фразы месяца — к обычным
  const SNOW = ['#FFFFFF', '#E6EEF7', '#D3DFEC'], PINK = ['#F7B6C8', '#FCE1E8', '#F28AB2', '#FFFFFF'];
  const tag = (k, c) => { if (c) c.dataset.k = k; return c; };
  const HALLOWEEN = MM === 10 && DD >= 24;
  const MONTH = {
    1: { mk: () => Math.random() < .5 ? tag('snowman', SPR.snowman()) : tag('drift', dome(14, 5, ['#F4F7FB', '#E6EEF7', '#FFFFFF', '#D3DFEC'])), fall: SNOW, bits: SNOW },
    2: { mk: () => tag('heart', SPR.heart()), fall: ['#E5484D', '#F28AB2', '#F7A8C4'], bits: ['#E5484D', '#F28AB2', '#FFFFFF'] },
    3: { mk: () => tag('tulip', SPR.tulip()), fall: ['#FFFFFF', '#E9F4E2', '#B9DC9A'], bits: ['#6a9a3a', '#F28AB2'] },
    4: { mk: () => tag('egg', SPR.egg()), fall: PINK, bits: ['#F6C445', '#5ba3d9', '#F28AB2'] },
    5: { mk: () => tag('can', SPR.can()), fall: ['#B79CF2', '#D7C6F7', '#9A7FD9', '#FFFFFF'], bits: ['#8fb3d9', '#B9DCF2', '#FFFFFF'] },
    6: { mk: () => Math.random() < .5 ? tag('cheese', SPR.cheese()) : tag('flower', SPR.flower()), fall: ['#F6D04D', '#F28AB2', '#FFFFFF', '#6a9a3a'], bits: ['#F6D04D', '#6a9a3a'] },
    7: { mk: () => tag('icecream', SPR.icecream()), fall: null, bits: ['#F28AB2', '#E5484D', '#F6C445'] },
    8: { mk: () => tag('melon', SPR.melon()), fall: ['#F6C445', '#FFF3B0', '#FFFFFF'], bits: ['#E5484D', '#1a1528', '#4E9A3A'] },
    9: { mk: () => tag('apple', SPR.apple()), fall: LEAF_C, bits: LEAF_C },
    10: { mk: () => HALLOWEEN ? tag('jack', SPR.jack()) : Math.random() < .5 ? tag('pumpkin', SPR.pumpkin()) : tag('pile', dome(14, 5, LEAF_C)), fall: LEAF_C, bits: LEAF_C },
    11: { mk: () => tag('mug', SPR.mug()), fall: ['#A3592A', '#D9952F', '#8fb3d9'], bits: ['#cfc7bd', '#FFFFFF'] },
    12: { mk: () => tag('gift', SPR.gift()), fall: SNOW, bits: ['#E5484D', '#F6C445', '#FFFFFF'] },
  }[MM] || { mk: () => null, fall: null, bits: LEAF_C };
  // фразы месяца (и особых дней) — en / ru / lv
  const MSAY = (() => {
    const L = lang === 'ru' ? 1 : lang === 'lv' ? 2 : 0;
    const A = {
      1: [['New year, new sketchbook.', 'Новый год — новый скетчбук.', 'Jauns gads — jauna skiču burtnīca.'], ['Snow is just paper falling from the sky.', 'Снег — это бумага, которая падает с неба.', 'Sniegs ir papīrs, kas krīt no debesīm.']],
      2: [['I love you more than crumbs.', 'Люблю тебя больше, чем крошки.', 'Mīlu tevi vairāk nekā drupačas.'], ['Draw a heart. Any heart.', 'Нарисуй сердечко. Любое.', 'Uzzīmē sirsniņu. Jebkādu.']],
      3: [['Something is sprouting. Maybe an idea.', 'Что-то прорастает. Может, идея.', 'Kaut kas dīgst. Varbūt ideja.'], ['Spring smells like fresh paint.', 'Весна пахнет свежей краской.', 'Pavasaris smaržo pēc svaigas krāsas.']],
      4: [['This egg is my work.', 'Это яйцо — моя работа.', 'Šī ola ir mans darbs.'], ['Pastel season is open.', 'Сезон пастели открыт.', 'Pasteļu sezona ir atklāta.']],
      5: [['Watering my ideas.', 'Поливаю идеи.', 'Laistu idejas.'], ['Lilac season! Grab your purples.', 'Сезон сирени! Доставай фиолетовые.', 'Ceriņu laiks! Ņem violetās krāsas.']],
      6: [['Līgo, līgo!', 'Лиго, лиго!', 'Līgo, līgo!'], ['Don’t touch my Jāņi cheese.', 'Не трогай мой сыр Яню.', 'Neaiztiec manu Jāņu sieru.']],
      7: [['Too hot to draw. Drawing anyway.', 'Слишком жарко, чтобы рисовать. Рисую всё равно.', 'Par karstu zīmēšanai. Zīmēju tik un tā.'], ['Ice cream counts as a palette.', 'Мороженое — тоже палитра.', 'Saldējums arī ir palete.']],
      8: [['Make a wish, a star is falling!', 'Загадай желание — звезда падает!', 'Iedomājies vēlēšanos — krīt zvaigzne!'], ['Watermelon: green, red and dots.', 'Арбуз: зелёный, красный и точки.', 'Arbūzs: zaļš, sarkans un punktiņi.']],
      9: [['Back to school. I brought an apple.', 'Снова в школу. Яблоко уже есть.', 'Atpakaļ uz skolu. Ābols jau ir.'], ['Sharpen your pencils!', 'Точи карандаши!', 'Uzasini zīmuļus!']],
      10: [['Inktober? Inktober.', 'Инктобер? Инктобер.', 'Inktober? Inktober.'], ['This pumpkin is staring at me.', 'Эта тыква на меня смотрит.', 'Šis ķirbis skatās uz mani.']],
      11: [['Tea, blanket, sketchbook.', 'Чай, плед, скетчбук.', 'Tēja, pleds, skiču burtnīca.'], ['Cocoa is a warm colour.', 'Какао — тёплый цвет.', 'Kakao ir silta krāsa.']],
      12: [['Have you opened today’s window?', 'Окошко на сегодня уже открыто?', 'Vai šodienas lodziņš jau atvērts?'], ['I wrapped a gift. For me.', 'Подарок упакован. Для себя.', 'Dāvana iesaiņota. Sev.']],
    }[MM] || [];
    const D = MM === 4 && DD === 1 ? [['Who? Me? I’m a totally different bird.', 'Кто? Я? Это совсем другая птица.', 'Kas? Es? Šis ir pavisam cits putns.']]
      : MM === 10 && DD >= 24 ? [['Boo! Did I scare you?', 'Бу! Страшно?', 'Bū! Bail?']]
      : MM === 11 && DD === 18 ? [['Happy birthday, Latvia!', 'С днём рождения, Латвия!', 'Daudz laimes, Latvija!']]
      : MM === 11 && DD === 11 ? [['Lāčplēsis Day. Light a candle.', 'День Лачплесиса. Зажги свечу.', 'Lāčplēša diena. Iededz svecīti.']]
      : MM === 12 && DD >= 24 && DD <= 26 ? [['Merry Christmas!', 'Счастливого Рождества!', 'Priecīgus Ziemassvētkus!']]
      : MM === 12 && DD === 31 ? [['See you next year!', 'До встречи в новом году!', 'Tiekamies nākamgad!']]
      : MM === 1 && DD === 1 ? [['Happy New Year!', 'С Новым годом!', 'Laimīgu Jauno gadu!']] : [];
    return { day: D.map(r => r[L]), month: A.map(r => r[L]) };
  })();
  const sayLine = () => MSAY.day.length && Math.random() < .5 ? pick(MSAY.day) : MSAY.month.length && Math.random() < .4 ? pick(MSAY.month) : pick(TXT.say);
  const CORNER = (() => {
    const mk = BDAY ? tag('cake', SPR.cake()) : MONTH.mk();
    if (!mk) return null;
    mk.className = 'polly-prop free'; mk.setAttribute('aria-hidden', 'true'); document.body.appendChild(mk);
    return { el: mk, w: mk.width, h: mk.height, free: true, x: 0, y: 0 };
  })();
  const cornerPlace = () => { if (!CORNER) return; CORNER.x = HOME_X + W + 2; CORNER.y = innerHeight - 8 - CORNER.h; putProp(CORNER); };
  const PARTY = ['#E5484D', '#F6C445', '#93AFCC', '#F2A7B8', '#7f81bf', '#FFFFFF'];
  // 20.11.2026: у каждой вещицы своё взаимодействие (ITEM[вид].play) и свои реплики по клику (ITEM[вид].say); к шапкам и вещам — HSAY.
  // alive() — Полли никто не позвал (ключи кабинета, новый клик); иначе прерываемся и ничего не трогаем
  const LI = lang === 'ru' ? 1 : lang === 'lv' ? 2 : 0;
  const ani = (el, kf, o) => { if (!reduce && el.animate) el.animate(kf, o); };
  const wig = async ms => { CORNER.el.classList.add('wiggle'); await wait(ms); CORNER.el.classList.remove('wiggle'); };
  const top0 = () => CORNER.y, mid0 = () => CORNER.x + CORNER.w / 2;
  async function hop(alive, stay, dive) { // запрыгнуть на вещицу (или нырнуть в кучу) и вернуться в уголок
    if (reduce) { await peck(1); return; }
    face(1);
    if (!await flyTo(mid0() - W / 2, top0() - H + (dive ? CORNER.h : SP)) || !alive()) return;
    spot = 'item';
    if (dive) { pet.classList.add('diving'); CORNER.el.classList.add('wiggle'); burst(mid0(), top0() + 4, dive, 16); }
    else await peck(1);
    await wait(stay);
    pet.classList.remove('diving'); CORNER.el.classList.remove('wiggle');
    if (!alive()) return;
    if (dive) burst(mid0(), top0() + 4, dive, 12, .8);
    if (await flyTo(HOME_X, floorY()) && alive()) { face(1); spot = 'floor'; }
  }
  const tx3 = a => a.map(r => r[LI]);
  const ITEM = {
    snowman: { say: [['He winked at me. I swear.', 'Он мне подмигнул. Честно.', 'Viņš man piemiedza ar aci. Godīgi.'], ['Nice hat. My beret is better.', 'Шляпа ничего. Мой берет лучше.', 'Laba cepure. Mana berete labāka.']],
      play: async () => { face(1); await peck(1); burst(mid0(), top0() + 4, SNOW, 8, .6); await wig(600); } },
    drift: { say: [['Snow dive! Ten points.', 'Нырок в снег! Десять баллов.', 'Lēciens sniegā! Desmit punkti.'], ['Brr. Worth it.', 'Брр. Оно того стоило.', 'Brr. Bija tā vērts.']],
      play: alive => hop(alive, 1300, SNOW) },
    cake: { say: [['Hands off, it’s my cake!', 'Руки прочь, это мой торт!', 'Rokas nost, tā ir mana torte!'], ['One more candle? Fine.', 'Ещё одну свечку? Ладно.', 'Vēl vienu svecīti? Labi.']],
      play: async () => { face(1); CORNER.el.classList.add('wiggle'); await peck(2); burst(mid0(), top0() + 2, PARTY, 12, .9); await wait(400); CORNER.el.classList.remove('wiggle'); } },
    heart: { say: [['Take it, it’s yours.', 'Держи, это тебе.', 'Ņem, tā ir tev.'], ['My heart goes coo.', 'Сердце делает курлык.', 'Sirds dara kū.']],
      play: async () => { face(1); await peck(1); ani(CORNER.el, [{ scale: '1' }, { scale: '1.35' }, { scale: '1' }], { duration: 450, iterations: 2 }); burst(mid0(), top0(), ['#E5484D', '#F28AB2', '#F7A8C4'], 8, .7); await wait(900); } },
    tulip: { say: [['Grow, little one, grow!', 'Расти, малыш, расти!', 'Augi, mazais, augi!'], ['First flower! Quick, sketch it.', 'Первый цветок! Быстро, скетч!', 'Pirmais zieds! Ātri, skicē!']],
      play: async alive => { face(1); for (let i = 0; i < 3 && alive(); i++) { body.classList.add('flap'); await wait(160); body.classList.remove('flap'); await wait(160); }
        if (!alive()) return; CORNER.el.classList.add('wiggle'); for (let i = 0; i < 4; i++) petal(mid0() - 6 + Math.random() * 12, top0(), MONTH.fall || PINK); await wait(700); CORNER.el.classList.remove('wiggle'); } },
    egg: { say: [['It wobbles… is someone inside?', 'Качается… там кто-то есть?', 'Šūpojas… vai tur kāds ir iekšā?'], ['Egg fight? Count me in!', 'Битва яиц? Я в деле!', 'Olu kauja? Es piedalos!']],
      play: async () => { face(1); await peck(1); ani(CORNER.el, [{ rotate: '0deg' }, { rotate: '-25deg' }, { rotate: '22deg' }, { rotate: '-12deg' }, { rotate: '0deg' }], { duration: 1000 }); await wait(1000); } },
    can: { say: [['Watering the website.', 'Поливаю сайт.', 'Laistu mājaslapu.'], ['Oops, that was your shoe.', 'Ой, это был твой ботинок.', 'Ups, tā bija tava kurpe.']],
      play: async () => { face(1); await peck(1); ani(CORNER.el, [{ rotate: '0deg' }, { rotate: '28deg' }, { rotate: '28deg' }, { rotate: '0deg' }], { duration: 1200 });
        await wait(350); for (let i = 0; i < 8; i++) petal(CORNER.x + CORNER.w + Math.random() * 6, top0() + 4, ['#8fb3d9', '#B9DCF2', '#5ba3d9']); await wait(850); } },
    cheese: { say: [['Caraway, my favourite.', 'Тмин — моё любимое.', 'Ķimenes — mans mīļākais.'], ['Līgo! Pass the cheese.', 'Лиго! Передай сыр.', 'Līgo! Padod sieru.']],
      play: async () => { face(1); await peck(3); burst(mid0(), top0() + 2, ['#F2C14E', '#FFE08A', '#7a4a1e'], 8, .5); } },
    flower: { say: [['Smells like summer.', 'Пахнет летом.', 'Smaržo pēc vasaras.'], ['This one goes in my sketchbook.', 'Этот — в скетчбук.', 'Šo — skiču burtnīcā.']],
      play: async () => { face(1); await peck(1); await wait(500); burst(x + W * .7, y + 20, ['#F28AB2', '#E5484D', '#F7A8C4'], 6, .5); await wait(400); } },
    icecream: { say: [['Brain freeze!', 'Мозг замёрз!', 'Smadzenes sasala!'], ['Just one lick. Okay, three.', 'Только лизнуть. Ладно, три раза.', 'Tikai nolaizīt. Labi, trīs reizes.']],
      play: async () => { face(1); await peck(3); for (let i = 0; i < 3; i++) petal(mid0() - 4 + Math.random() * 8, top0() + 6, ['#F28AB2', '#F7A8C4', '#FFFFFF']); body.classList.add('startle'); await wait(400); body.classList.remove('startle'); } },
    melon: { say: [['Seed-spitting contest!', 'Конкурс по плевкам косточками!', 'Sēklu spļaušanas sacensības!'], ['Watermelon: 92% water, 8% joy.', 'Арбуз: 92% воды, 8% счастья.', 'Arbūzs: 92% ūdens, 8% laimes.']],
      play: async () => { face(1); await peck(2); for (let i = 0; i < 4; i++) { burst(x + 27 * SP, y + 13 * SP, ['#1a1528'], 1, 1.2); await wait(220); } } },
    apple: { say: [['A worm! Hi, worm.', 'Червячок! Привет, червячок.', 'Tārpiņš! Sveiks, tārpiņ.'], ['An apple for the teacher. That’s me.', 'Яблоко для учителя. Это я.', 'Ābols skolotājam. Tas esmu es.']],
      play: async alive => { face(1); await peck(1); if (!alive()) return;
        const wc = sprite(['.p.', 'pkp', 'ppp', '.pp', 'pp.'], { p: '#F2A7B8', k: '#1a1528' }); wc.className = 'polly-prop free'; wc.setAttribute('aria-hidden', 'true');
        const wp = { el: wc, w: wc.width, h: wc.height, free: true, x: mid0() + PX, y: top0() - wc.height + PX }; document.body.appendChild(wc); putProp(wp);
        ani(wc, [{ translate: `0 ${wc.height}px`, opacity: 0 }, { translate: '0 0', opacity: 1 }], { duration: 300, fill: 'forwards' });
        await wait(300); body.classList.add('startle'); await wait(1300); wc.remove(); body.classList.remove('startle'); } },
    pumpkin: { say: [['Best seat in the house.', 'Лучшее место в доме.', 'Labākā vieta mājā.'], ['Pumpkin latte, please.', 'Тыквенный латте, пожалуйста.', 'Ķirbju late, lūdzu.']],
      play: alive => hop(alive, 1800) },
    jack: { say: [['Boo! Okay, the pumpkin did it.', 'Бу! Ладно, это тыква.', 'Bū! Labi, tas bija ķirbis.'], ['Bats! Draw them before they fly away.', 'Летучие мыши! Рисуй, пока не улетели.', 'Sikspārņi! Zīmē, kamēr neaizlido.']],
      play: async alive => { ani(CORNER.el, [{ filter: 'brightness(1)' }, { filter: 'brightness(1.7) drop-shadow(0 0 6px #FFD84A)' }, { filter: 'brightness(1)' }], { duration: 450, iterations: 3 });
        burst(mid0(), top0(), ['#2b2440', '#1a1528', '#3e3673'], 7, 1.6); body.classList.add('startle'); await wait(450); body.classList.remove('startle'); if (alive()) await hop(alive, 1400); } },
    pile: { say: [['Leaf dive!', 'Нырок в листья!', 'Lēciens lapās!'], ['Crunchy. Very crunchy.', 'Хрустит. Очень хрустит.', 'Čaukst. Ļoti čaukst.']],
      play: alive => hop(alive, 1300, LEAF_C) },
    mug: { say: [['Ouch, hot!', 'Ай, горячо!', 'Ai, karsts!'], ['Marshmallows, where are you?', 'Зефирки, вы где?', 'Zefīriņi, kur jūs esat?']],
      play: async () => { face(1); await peck(1); burst(mid0() - PX, top0(), ['#FFFFFF', '#cfc7bd', '#E6EEF7'], 8, .6); body.classList.add('startle'); await wait(450); body.classList.remove('startle'); } },
    gift: { say: [['Can I open it now? Now? Now?', 'Можно уже открыть? А сейчас? А сейчас?', 'Vai jau var atvērt? Tagad? Tagad?'], ['It rattles. Buttons?', 'Гремит. Пуговки?', 'Grab. Pogas?']],
      play: async () => { face(1); await peck(1); await wig(700); ani(CORNER.el, [{ translate: '0 0' }, { translate: '0 -10px' }, { translate: '0 0' }], { duration: 400 }); burst(mid0(), top0(), PARTY, 14, 1); await wait(400); } },
  };
  // реплики к шапке и вещи
  const HSAY = tx3([].concat(
    HATW === 'wreath' ? [['My wreath is better than yours.', 'Мой венок лучше твоего.', 'Mans vainags labāks par tavu.']] : [],
    HATW === 'witch' ? [['This hat came with a broom. I lost the broom.', 'Шляпа была с метлой. Метла потерялась.', 'Cepure bija ar slotu. Slota pazuda.']] : [],
    HATW === 'santa' ? [['Ho-ho-coo!', 'Хо-хо-курлык!', 'Ho-ho-kū!']] : [],
    ACC === 'scarf' ? [['Scarf on. Winter, bring it.', 'Шарф на месте. Зима, давай.', 'Šalle ir. Ziema, nāc.']] : [],
    ACC === 'shades' ? [['Sun? Shades on.', 'Солнце? Очки уже на месте.', 'Saule? Brilles jau ir.']] : [],
    ACC === 'groucho' ? [['Nice nose, right? It’s real.', 'Хороший нос, правда? Настоящий.', 'Labs deguns, vai ne? Īsts.']] : [],
    ACC === 'ribbon' ? [['Red, white, red.', 'Красный, белый, красный.', 'Sarkans, balts, sarkans.']] : []));
  const KIND = CORNER && CORNER.el.dataset.k, IT = KIND && ITEM[KIND], ISAY = IT ? tx3(IT.say) : [];
  const clickLine = () => {
    const r = Math.random();
    if (BDAY && r < .4) return pick(BDAY_SAY);
    if (MSAY.day.length && r < .3) return pick(MSAY.day);
    if (HSAY.length && r < .45) return pick(HSAY);
    if (ISAY.length && r < .8) return pick(ISAY);
    return sayLine();
  };
  async function cornerPlay(alive) {
    if (!CORNER) return;
    const my = token; alive = alive || (() => my === token && !keysOn);
    if (!BDAY && MONTH.fall && Math.random() < .35) { // сверху падают снежинки / сердечки / лепестки / листья / звёздочки месяца
      for (let i = 0; i < 9; i++) petal(HOME_X + Math.random() * (W + 30), innerHeight - 8 - H - 60 - Math.random() * 40, MONTH.fall);
      await wait(700); if (alive()) await peck(1); return;
    }
    if (IT) await IT.play(alive);
  }
  async function act() {
    if (x !== HOME_X || spot !== 'floor') { spot = 'floor'; perch = null; x = HOME_X; y = floorY(); place(); }
    cornerPlace();
    const roll = Math.random();
    if (roll < 0.35 && CORNER) await cornerPlay();
    else if (BDAY && roll < 0.42) await say(pick(BDAY_SAY));
    else if (roll < 0.5) await peck(1 + Math.floor(Math.random() * 3));
    else if (roll < 0.7) { const my = token; face(-dir); await wait(700); if (my === token) face(-dir); } // оглянулась; если позвали (клик, ключи) — не крутить обратно
    else if (roll < 0.8) await sleep();
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
      pet.classList.toggle('hidden', !!blocked); if (CORNER) CORNER.el.style.visibility = blocked ? 'hidden' : '';
      if (!busy && !blocked && !document.hidden) await act();
      await wait(1500 + Math.random() * 3500);
    }
  }

  async function poke() {
    if (busy) return;
    busy = true;
    const my = ++token, alive = () => my === token;
    if (carry) { const p = carry; carry = null; drop(p); }
    if (push) { const p = push; push = null; seat(p); } pet.classList.remove('diving'); props.forEach(p => p.el.classList.remove('wiggle'));
    const wasSleeping = body.classList.contains('sleeping');
    body.classList.remove('sleeping', 'peck', 'flap');
    zzz.classList.remove('show');
    show('a');
    if (x !== HOME_X || spot !== 'floor') { spot = 'floor'; x = HOME_X; y = floorY(); place(); }
    if (wasSleeping) { body.classList.add('startle'); setTimeout(() => body.classList.remove('startle'), 400); await say(pick(TXT.wake)); }
    else await Promise.all([say(clickLine()), IT ? IT.play(alive) : peck(1)]); // остаётся в уголке (кроме прыжка на вещицу)
    if (alive()) busy = false;
  }
  body.addEventListener('click', poke);
  if (CORNER) { CORNER.el.style.pointerEvents = 'auto'; CORNER.el.style.cursor = 'pointer'; CORNER.el.addEventListener('click', poke); }

  // при прокрутке и изменении окна — обратно на «пол»
  let st;
  const reset = () => {
    if (keysOn) { const el = keysOn; keysOn = null; keysTo(el); return; } // Полли с ключами у открытого кабинета — подлететь заново
    if (ground) layoutProps();
    spot = 'floor'; perch = null; x = HOME_X; y = floorY(); place(); cornerPlace();
  };

  addEventListener('resize', reset);

  // связка ключей в клюве: открыли кабинет в шапке (v2.js) — Полли прилетает и садится на край списка, закрыли — летит обратно в угол
  // связка: тонкое колечко у клюва, на нём два ключа (медный позади золотого) концами в разные стороны; вся связка качается
  const KEY = ['XXX', 'X.X', 'XXX', '.X.', '.X.', '.XX', '.X.', '.XX'];
  const KPX = PX - 1, KW = 8 * KPX;
  const keysEl = document.createElement('div'), swing = document.createElement('div');
  keysEl.className = 'polly-keys';
  const keyCv = (col, rot) => {
    const c = document.createElement('canvas'), kg = c.getContext('2d');
    c.width = 3 * KPX; c.height = KEY.length * KPX; kg.fillStyle = col;
    KEY.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === 'X') kg.fillRect(i * KPX, j * KPX, KPX, KPX); }));
    c.style.cssText = `position:absolute;left:${2.5 * KPX}px;top:${3 * KPX}px;image-rendering:pixelated;transform-origin:50% 0;transform:rotate(${rot}deg)`;
    return c;
  };
  const ring = document.createElement('canvas');
  ring.width = KW; ring.height = 4 * KPX;
  { const rg = ring.getContext('2d'); rg.strokeStyle = '#8E93A3'; rg.lineWidth = Math.max(1.2, KPX * 0.45); rg.beginPath(); rg.arc(4 * KPX, 1.9 * KPX, 1.6 * KPX, 0, Math.PI * 2); rg.stroke(); }
  ring.style.cssText = 'position:absolute;left:0;top:0';
  swing.style.cssText = `position:relative;width:${KW}px;height:${12 * KPX}px;transform-origin:50% ${1.9 * KPX}px`;
  swing.append(keyCv('#D27A3C', 30), keyCv('#F2B530', -12), ring);
  const KL = Math.round(23.5 * SP - 4 * KPX); // колечко — у середины клюва (столбцы 21–27 спрайта)
  keysEl.style.cssText = `position:absolute;left:${KL}px;top:${Math.round(14.5 * SP - 1.9 * KPX)}px;display:none;pointer-events:none;filter:drop-shadow(1px 0 0 #1a1528) drop-shadow(-1px 0 0 #1a1528) drop-shadow(0 1px 0 #1a1528) drop-shadow(0 -1px 0 #1a1528)`;
  keysEl.appendChild(swing); body.style.position = 'relative'; body.appendChild(keysEl);
  // клюв поверх колечка: отдельный слой только с клювом, отражается вместе с Полли (.polly-body.flip canvas)
  const beak = document.createElement('canvas'); beak.width = W; beak.height = H;
  { const bg = beak.getContext('2d'), BEAK = ['#f08a3c', '#c8642a'], L = PL.body;
    L[1].forEach((r, j) => [...r].forEach((ch, i) => { if (i >= 21 && BEAK.includes(PCOL[ch])) { bg.fillStyle = PCOL[ch]; bg.fillRect(i * SP, (L[0] + j) * SP, SP, SP); } })); }
  beak.style.cssText = 'position:absolute;left:0;top:0;display:none;pointer-events:none;image-rendering:pixelated';
  body.appendChild(beak);
  if (!reduce && swing.animate) swing.animate([{ transform: 'rotate(-14deg)' }, { transform: 'rotate(14deg)' }], { duration: 650, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' }); // ключи болтаются
  const keysFlip = () => { keysEl.style.left = (dir > 0 ? KL : W - KL - KW) + 'px'; keysEl.style.transform = dir > 0 ? '' : 'scaleX(-1)'; };
  let keysOn = null, keysBack = null;
  async function keysTo(el) {
    clearTimeout(keysBack);
    if (pet.classList.contains('hidden')) return;
    if (!el) { // список закрыт — чуть подождать (мышь могла перейти на соседний кабинет), потом домой
      if (!keysOn) return;
      keysBack = setTimeout(async () => {
        keysOn = null; token++;
        const ok = await flyTo(HOME_X, floorY());
        if (!ok || keysOn) return; // по пути домой снова открыли меню — ключи остаются в клюве
        face(1); keysEl.style.display = beak.style.display = 'none';
        spot = 'floor'; perch = null; busy = false;
      }, 350);
      return;
    }
    if (keysOn === el) return;
    keysOn = el; busy = true; token++;
    body.classList.remove('sleeping', 'peck', 'flap', 'startle'); zzz.classList.remove('show'); bubble.classList.remove('show');
    pet.classList.remove('diving'); pet.style.clipPath = ''; if (CORNER) CORNER.el.classList.remove('wiggle');
    if (carry) { const p = carry; carry = null; drop(p); }
    keysEl.style.display = beak.style.display = 'block';
    spot = 'keys'; perch = null;
    const target = () => { const r = el.getBoundingClientRect(); return el.tagName === 'SUMMARY' ? [r.right - W - 40, r.bottom - H - 4] : [Math.min(innerWidth - W - 6, r.right - W - 14), r.bottom - H - 10]; }; // в списке — в правом нижнем углу, в ☰ — у стрелки
    await flyTo(...target());
    if (keysOn !== el) return;
    const [tx, ty] = target(); x = tx; y = ty; face(-1); keysFlip(); place();
  }
  const faceKeys = face;
  face = d => { faceKeys(d); keysFlip(); };

  // Полли сама прилетает клевать печать конверта на главной (today.js)
  window.PollyPet = {
    keys: el => keysTo(el),
    play: () => { token++; busy = false; return seasonal(); }, // проверка сезонных игр из консоли
    corner: () => cornerPlay(), // проверка игры в уголке (?season=winter и т. п.)
    // для «Выбора Полли» на странице «Нарисуй мне»: кадры спрайта (стоит / в полёте), где она сидит, спрятать/показать
    frames: () => ({ a: F.a, b: F.b, fly: F.fly, w: W, h: H }),
    // открытки /postcards/: Полли нужного размера в нужной шапке и вещи — paint(canvas, {sp, hat, acc, legs}) (рисует с отступом сверху для шапки)
    paint(c, o = {}) {
      const sp = o.sp || 4, top = 2; c.width = 30 * sp; c.height = (35 + top) * sp;
      const g = c.getContext('2d'); g.clearRect(0, 0, c.width, c.height);
      ['body', o.legs || 'legA', o.closed && 'closed', o.hat || 'beret', o.acc].forEach(k => {
        const L = k && PL[k]; if (!L) return;
        L[1].forEach((r, y) => [...r].forEach((ch, x) => { if (PCOL[ch]) { g.fillStyle = PCOL[ch]; g.fillRect(x * sp, (L[0] + y + top) * sp, sp, sp); } }));
      });
      return c;
    },
    where: () => pet.getBoundingClientRect(),
    away: v => { pet.style.visibility = v ? 'hidden' : ''; },
    async visit(el) {
      return false; // Полли больше не перелетает к конверту — конверт открывается своей анимацией
      // eslint-disable-next-line no-unreachable
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

  const BDAY_SAY = { ru: ['У меня день рождения!', 'Кто съел свечку?', 'Торт — это тоже искусство.'],
    lv: ['Man šodien dzimšanas diena!', 'Kurš apēda svecīti?', 'Torte arī ir māksla.'] }[lang] || ['It’s my birthday!', 'Who ate the candle?', 'Cake is art too.'];
  // день рождения: Полли выпрыгивает из тортика (один раз за заход на сайт, дальше просто сидит в колпаке)
  async function cakeJump() {
    let seen = false;
    try { seen = sessionStorage.getItem('pp-bday-jump') === '1'; sessionStorage.setItem('pp-bday-jump', '1'); } catch (e) {}
    if (seen || reduce || location.search.includes('bday=0')) return;
    busy = true; token++;
    const cake = CORNER, top = innerHeight - 8 - cake.h;
    // всё, что ниже верха тортика, срезано — Полли «вылезает» из него
    const clip = () => { pet.style.clipPath = `inset(0 0 ${Math.max(0, Math.min(H, Math.ceil(y + H - top - 2 * PX)))}px 0)`; };
    x = cake.x + cake.w / 2 - W / 2; y = top + 2 * PX; clip(); place(); face(1);
    await wait(900);
    for (let i = 0; i < 3; i++) { cake.el.classList.add('wiggle'); await wait(260); cake.el.classList.remove('wiggle'); await wait(160); }
    burst(cake.x + cake.w / 2, top, PARTY, 22, 1.4);
    const x0 = x, y0 = y, up = top - H - 40 * PX / 4;
    show('fly');
    await frameLoop(420, k => { y = y0 + (up - y0) * (1 - (1 - k) * (1 - k)); body.classList.toggle('flap', Math.floor(k * 10) % 2 === 0); clip(); place(); });
    pet.style.clipPath = '';
    face(-1);
    await frameLoop(560, k => { x = x0 + (HOME_X - x0) * k; y = up + (floorY() - up) * k * k; body.classList.toggle('flap', Math.floor(k * 12) % 2 === 0); place(); });
    body.classList.remove('flap'); show('a'); x = HOME_X; y = floorY(); place(); face(1);
    busy = false;
    await say(BDAY_SAY[0], 3200);
  }

  x = HOME_X; y = floorY(); place(); cornerPlace();
  (BDAY && CORNER ? cakeJump() : Promise.resolve()).then(life);
})();
