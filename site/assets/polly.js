// Полли, которая живёт на сайте: иногда заходит в левый нижний угол, клюёт,
// по клику говорит фразу (на языке страницы) и улетает.
(() => {
  if (matchMedia('print').matches) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lang = document.documentElement.lang;
  const PHRASES = {
    en: ['Need more coffee.', 'I’m not lost, I’m exploring.', 'Have you seen my worm chips?', 'Sketch first, worry later.',
      'This is my office now.', 'Coo.', 'Don’t tell Mr.Chew I was here.', 'Five more minutes…', 'Is that a crumb?'],
    lv: ['Vajag vēl kafiju.', 'Es neesmu apmaldījusies, es pētu.', 'Vai neesi redzējis manus tārpu čipsus?', 'Vispirms skicē, uztraucies vēlāk.',
      'Tagad šis ir mans birojs.', 'Kū.', 'Nesaki Mr.Chew, ka es te biju.', 'Vēl piecas minūtes…', 'Vai tā ir drupačiņa?'],
    ru: ['Нужно больше кофе.', 'Я не заблудилась, я исследую.', 'Ты не видел мои червячковые чипсы?', 'Сначала скетч, переживания потом.',
      'Теперь это мой офис.', 'Курлык.', 'Не говори Мистеру Чу, что я тут была.', 'Ещё пять минуточек…', 'Это что, крошка?'],
  };
  const phrases = PHRASES[lang] || PHRASES.en;

  // пиксельный спрайт: d — контур, b — тело, s — тень крыла, w/k — глаз, o — клюв и лапки
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
  const LEGS = [['....o..o......', '...oo.oo......'], ['.....o.o......', '....oo.oo.....']];
  const COL = { d: '#1a1528', b: '#7f81bf', s: '#5e5a9c', w: '#ffffff', k: '#1a1528', o: '#f2a73b' };
  const PX = innerWidth < 600 ? 3 : 4;

  const frame = legs => {
    const c = document.createElement('canvas');
    const rows = BODY.concat(legs);
    c.width = 14 * PX; c.height = rows.length * PX;
    const g = c.getContext('2d');
    rows.forEach((r, y) => [...r].forEach((ch, x) => {
      if (COL[ch]) { g.fillStyle = COL[ch]; g.fillRect(x * PX, y * PX, PX, PX); }
    }));
    return c;
  };
  const frames = LEGS.map(frame);

  const wrap = document.createElement('div');
  wrap.className = 'polly-pet';
  wrap.setAttribute('aria-hidden', 'true');
  const btn = document.createElement('button');
  btn.className = 'polly-body';
  btn.type = 'button';
  btn.tabIndex = -1;
  const cv = frames[0].cloneNode();
  btn.appendChild(cv);
  const bubble = document.createElement('div');
  bubble.className = 'polly-bubble';
  wrap.append(bubble, btn);
  document.body.appendChild(wrap);
  const g = cv.getContext('2d');
  const draw = i => { g.clearRect(0, 0, cv.width, cv.height); g.drawImage(frames[i], 0, 0); };
  draw(0);

  let x = -80, state = 'away', walkTimer = null, idleTimer = null;
  const place = () => { wrap.style.transform = `translateX(${x}px)`; };
  place();

  const walkTo = (target, done) => {
    clearInterval(walkTimer);
    const dir = target > x ? 1 : -1;
    btn.classList.toggle('flip', dir < 0);
    if (reduce) { x = target; place(); done && done(); return; }
    let f = 0;
    walkTimer = setInterval(() => {
      x += dir * 6;
      f ^= 1; draw(f);
      btn.classList.toggle('hop', f === 1);
      place();
      if ((dir > 0 && x >= target) || (dir < 0 && x <= target)) {
        clearInterval(walkTimer); x = target; place(); draw(0); btn.classList.remove('hop');
        done && done();
      }
    }, 120);
  };

  const peckLoop = () => {
    if (state !== 'here') return;
    if (!reduce) { btn.classList.add('peck'); setTimeout(() => btn.classList.remove('peck'), 380); }
    idleTimer = setTimeout(peckLoop, 1800 + Math.random() * 2200);
  };

  const arrive = () => {
    if (state !== 'away' || document.hidden || document.body.classList.contains('modal-open')) return schedule(15000);
    state = 'walking';
    wrap.classList.add('visible');
    walkTo(16 + Math.random() * Math.min(160, innerWidth * 0.25), () => {
      state = 'here';
      peckLoop();
      idleTimer = setTimeout(leave, 9000 + Math.random() * 6000);
    });
  };

  const leave = () => {
    if (state !== 'here') return;
    clearTimeout(idleTimer);
    state = 'walking';
    walkTo(-80, () => { state = 'away'; wrap.classList.remove('visible'); schedule(); });
  };

  const fly = () => {
    clearTimeout(idleTimer); clearInterval(walkTimer);
    state = 'flying';
    bubble.classList.remove('show');
    btn.classList.add('flying');
    setTimeout(() => {
      btn.classList.remove('flying', 'flip');
      wrap.classList.remove('visible');
      x = -80; place(); draw(0);
      state = 'away'; schedule();
    }, reduce ? 300 : 1400);
  };

  btn.addEventListener('click', () => {
    if (state !== 'here' && state !== 'walking') return;
    clearInterval(walkTimer); clearTimeout(idleTimer);
    state = 'talking';
    draw(0); btn.classList.remove('hop');
    bubble.textContent = phrases[Math.floor(Math.random() * phrases.length)];
    bubble.classList.add('show');
    setTimeout(fly, 2600);
  });

  let nextTimer;
  function schedule(ms) {
    clearTimeout(nextTimer);
    nextTimer = setTimeout(arrive, ms || 35000 + Math.random() * 30000);
  }
  schedule(6000 + Math.random() * 4000);
})();
