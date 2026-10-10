// Блок «Тема дня» на главной: конверт, Полли клюёт печать, вылетает листок с темой.
(() => {
  const box = document.querySelector('.today-sec'), CT = window.ChallengeTheme, D = window.CHALLENGE_DATA;
  if (!box || !CT || !D) return;
  const L = { en: 0, ru: 1, lv: 2 }[document.documentElement.lang] ?? 0, locale = ['en-GB', 'ru-RU', 'lv-LV'][L];
  const T = {
    min: ['min', 'мин', 'min'],
    extra: ['✦ EXTRA free day: your own theme', '✦ День свободы: своя тема', '✦ Brīvdiena: sava tēma'],
    bday: ['🎂 My birthday!', '🎂 Мой день рождения!', '🎂 Mana dzimšanas diena!'],
  };
  const t = k => T[k][L], q = s => box.querySelector(s);
  const now = new Date(), th = CT.themeFor(now, L);
  let bw = false; try { bw = localStorage.getItem('ch-bw') === '1'; } catch (e) { /* без памяти */ }

  // листок с темой
  q('.td-date').textContent = now.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
  q('.td-subj').textContent = th.subject;
  q('.td-cols').innerHTML = bw ? `✒ ${th.twist}` : th.colors.map(c => `<i style="background:${c.hex}" title="${c.n[L]}"></i>`).join('');
  q('.td-meta').textContent = `${th.time + 5} ${t('min')}` + (th.bday ? ` · ${t('bday')}` : th.extra ? ` · ${t('extra')}` : '');
  if (bw) box.classList.add('bw');

  // пиксельная Полли
  const P = ['......ddd.....', '.....dbbbd....', '....dbbwwbd...', '....dbbwkbdoo.', '....dbbbbbdo..', '...dbbbbbbd...', '..dbbsbbbbd...',
    '.dbbssbbbbd...', 'dbbssbbbbbd...', 'dbbbbbbbbd....', '.ddbbbbbdd....', '...ddddd......', '....o..o......', '...oo.oo......'];
  const C = { d: '#1a1528', b: '#7f81bf', s: '#5e5a9c', w: '#ffffff', k: '#1a1528', o: '#f2a73b' };
  q('.td-polly').innerHTML = `<svg viewBox="0 0 14 14" shape-rendering="crispEdges">${P.map((r, y) => [...r].map((ch, x) => C[ch] ? `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${C[ch]}"/>` : '').join('')).join('')}</svg>`;
  q('.td-spark').innerHTML = [...Array(14)].map((_, i) => `<i style="--a:${i * 360 / 14}deg;--d:${70 + (i % 3) * 22}px;--c:${['#F0A987', '#E9A93B', '#F5C4B3', '#D85A30'][i % 4]}"></i>`).join('');

  // счётчики: сколько работ загружено и сколько людей присоединилось с момента создания сайта
  const pl = (n, a, b, c) => { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c; };
  const LBL = {
    works: [n => n === 1 ? 'sketch uploaded' : 'sketches uploaded', n => `${pl(n, 'работа загружена', 'работы загружено', 'работ загружено')}`, n => n % 10 === 1 && n % 100 !== 11 ? 'skice augšupielādēta' : 'skices augšupielādētas'],
    users: [n => n === 1 ? 'artist joined' : 'artists joined', n => `${pl(n, 'художник присоединился', 'художника присоединились', 'художников присоединились')}`, n => n % 10 === 1 && n % 100 !== 11 ? 'mākslinieks pievienojies' : 'mākslinieki pievienojušies'],
  };
  fetch('/api/stats').then(r => r.ok ? r.json() : null).then(st => {
    if (!st) return;
    const row = q('.td-stats'); row.hidden = false;
    for (const k of ['works', 'users']) row.querySelector(`[data-l="${k}"]`).textContent = LBL[k][L](st[k]);
    const run = () => ['works', 'users'].forEach(k => {
      const el = row.querySelector(`[data-n="${k}"]`), to = st[k], t0 = performance.now();
      if (matchMedia('(prefers-reduced-motion: reduce)').matches || to < 2) { el.textContent = to.toLocaleString(locale); return; }
      const step = now => { const k2 = Math.min(1, (now - t0) / 1200); el.textContent = Math.round(to * (1 - Math.pow(1 - k2, 3))).toLocaleString(locale); if (k2 < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); run(); } }, { threshold: 0.4 });
      io.observe(row);
    } else run();
  }).catch(() => {});

  let done = false;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function open() {
    if (done) return; done = true;
    const quick = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const seal = q('.td-seal'), pp = window.PollyPet;
    box.classList.add('still');
    // прилетает сама Полли-питомец, чтобы на странице не было двух Полли
    if (!quick && pp) {
      const r = seal.getBoundingClientRect();
      if (r.top < 90 || r.bottom > innerHeight - 20) seal.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // ждём, пока прокрутка остановится (блок не двигается несколько кадров подряд)
      for (let still = 0, last = null, t0 = Date.now(); still < 4 && Date.now() - t0 < 2500;) {
        await new Promise(requestAnimationFrame);
        const top = box.getBoundingClientRect().top;
        still = last !== null && Math.abs(top - last) < 0.5 ? still + 1 : 0; last = top;
      }
      if (await pp.visit(seal)) {
        box.classList.add('opened'); await wait(450);
        box.classList.add('revealed', 'pet'); pp.done();
        return;
      }
    }
    const steps = quick ? [['fly', 0], ['peck', 0], ['opened', 0], ['revealed', 0]] : [['fly', 0], ['peck', 900], ['opened', 1700], ['revealed', 2150]];
    steps.forEach(([c, ms]) => setTimeout(() => box.classList.add(c), ms));
  }
  q('.td-open').addEventListener('click', open);
  q('.td-seal').addEventListener('click', open);
})();
