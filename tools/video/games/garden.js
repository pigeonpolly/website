// Ролик «Огород» (tools/video/games.js garden): посадить 4 семечка, полить, дни «перемоткой» (сервер ролика сам растит грядки),
// поймать жука, собрать урожай и продать за пуговки. Ответы /api/garden — как у worker/garden.js, только без базы.
const DAYS = { radish: 1, lettuce: 1, carrot: 2, tulip: 2, strawberry: 3, sunflower: 3, cabbage: 3, pumpkin: 4 };
const SELL = { radish: 3, lettuce: 3, carrot: 6, tulip: 6, strawberry: 9, sunflower: 9, cabbage: 9, pumpkin: 12 };
const G = { beds: Array(6).fill(null), seeds: { pumpkin: 1, sunflower: 2, strawberry: 2, tulip: 3, radish: 2, carrot: 2 }, crop: {}, bugs: [], got: 0, buttons: 31 };
const view = () => G.beds.map(b => b && { p: b.p, k: Math.min(1, b.g / DAYS[b.p]), left: Math.max(0, DAYS[b.p] - b.g) * 864e5 - (b.today ? 6 * 36e5 : 0), wet: b.wet, today: b.today, ready: b.g >= DAYS[b.p] });
const state = () => ({ on: true, owner: { nick: 'polly', id: 27, avatar: {} }, mine: true, season: 'autumn', today: '2026-10-24', beds: view(), seeds: G.seeds, crop: G.crop, bugs: G.bugs, bugsGot: G.got, bugsLater: false, bugBtn: 1, buttons: G.buttons,
  prices: Object.fromEntries(Object.keys(DAYS).map(k => [k, { days: DAYS[k], seed: DAYS[k], sell: SELL[k] }])) });
// новый день: политое подросло на сутки, земля ещё влажная, но «сегодня» не полито
function nextDay() { for (const b of G.beds) if (b) { if (b.wet) b.g++; b.today = false; } }

const BEDS = [{ i: 0, p: 'pumpkin' }, { i: 1, p: 'sunflower' }, { i: 2, p: 'strawberry' }, { i: 3, p: 'tulip' }]; // тыква — 4 дня, остальные к 4-му дню готовы
// грядка i на холсте 192×120 (как bedRects(6) в garden.js) → точка на экране
const bedAt = async (v, i, dy = 0) => {
  const r = await v.page.evaluate(() => { const b = document.querySelector('.gd-cv').getBoundingClientRect(); return { x: b.left, y: b.top, k: b.width / 192 }; });
  const col = i % 3, row = Math.floor(i / 3), x = 38 + col * 50 + 22, y = 62 + row * 27 + 12 + 7 + dy;
  return { x: r.x + x * r.k, y: r.y + y * r.k };
};

module.exports = {
  title: 'Polly’s Garden', url: '/garden/', seed: 3,
  join: ['Every bird has a house', 'with its own garden 🥕'],
  music: { track: { name: ['Garden', 'Огород', 'Dārzs'], icon: '🥕', bpm: 112, swing: 0, root: 67, scale: [0, 2, 4, 5, 7, 9, 11], prog: [0, 3, 4, 0], ext: [0, 2, 4],
    lead: 'square', leadV: 0.045, bass: 'triangle', bassV: 0.16, drums: 'pop', arp: true, rest: 0.22 } },
  show: ['#garden'],
  keys: [1.5, 5.5, 9, 13, 17, 20],
  api(m, p, b) {
    if (m === 'GET' && p.startsWith('/api/garden')) return state();
    const a = p.replace('/api/garden/', '');
    if (a === 'plant') { G.beds[b.bed] = { p: b.seed, g: 0, wet: false, today: false }; G.seeds[b.seed]--; }
    if (a === 'water') { let n = 0; G.beds.forEach((x, i) => { if (x && !x.today && (b.all || i === b.bed) && x.g < DAYS[x.p]) { x.wet = x.today = true; n++; } }); return { ok: true, watered: n, ...state() }; }
    if (a === 'harvest') { const x = G.beds[b.bed]; G.crop[x.p] = (G.crop[x.p] || 0) + 3; G.beds[b.bed] = null; }
    if (a === 'sell') { const got = SELL[b.crop] * G.crop[b.crop]; G.buttons += got; delete G.crop[b.crop]; return { ok: true, got, ...state() }; }
    if (a === 'bug') { G.bugs = G.bugs.filter(x => x.i !== b.i); G.got++; G.buttons++; return { ok: true, got: 1, ...state() }; }
    if (a === 'buy') return null;
    return { ok: true, ...state() };
  },
  async setup(v) {
    await v.page.addStyleTag({ content: `
      #garden { position: fixed !important; left: 0; right: 0; top: 96px; margin: 0 !important; padding: 0 12px !important; z-index: 10; }
      #garden .gd-home, #garden .gd-how, #garden .vid-hide, #garden.vid-sell .gd-sel { display: none !important; }
      #garden .gd-bar { justify-content: center; } .pp-toast { display: none !important; }` });
    // в панели — только грядка, урожай и полив: жуки и семена прячем (по заголовку раздела)
    await v.page.evaluate(() => new MutationObserver(() => document.querySelectorAll('#garden .gd-box').forEach(s => { const h = s.querySelector('h3'); if (h && /🐞|🌱/.test(h.textContent)) s.classList.add('vid-hide'); }))
      .observe(document.getElementById('garden'), { childList: true, subtree: true }));
    await v.page.clock.runFor(400);
  },
  async step(v, t) {
    const day = async (n, fn) => v.once('day' + n, async () => { nextDay(); if (fn) fn(); await v.page.clock.fastForward(60000); await v.page.clock.runFor(100); });
    if (t < 1.2) { v.cap('Polly has a garden now!'); return; }
    // сажаем: грядка → семечко, по 1,1 с
    const k = Math.floor((t - 1.2) / 1.1);
    if (k < BEDS.length) {
      v.cap('Plant the seeds 🌱');
      const f = (t - 1.2) % 1.1, b = BEDS[k];
      if (f < .5) await v.once('bed' + k, async () => v.tap(await bedAt(v, b.i)));
      else await v.once('seed' + k, () => v.tap(`[data-plant="${b.p}"]`));
      return;
    }
    const t1 = 1.2 + BEDS.length * 1.1; // ≈ 5,6
    if (t < t1 + 1.6) { v.cap('Water them every day 💧'); if (t > t1 + .4) await v.once('w1', () => v.tap('.gd-water-all')); return; }
    if (t < t1 + 3.2) { await day(2); v.cap('Day 2: sprouts!'); if (t > t1 + 2.1) await v.once('w2', () => v.tap('.gd-water-all')); return; }
    if (t < t1 + 6.4) {
      await day(3, () => { G.bugs = [{ i: 0, bed: 1, x: 50 }]; });
      v.cap('Day 3: a bug! Catch it for a button 🐞');
      if (t > t1 + 4.4) await v.once('bug', async () => { const r = await bedAt(v, 1, 1); await v.tap({ x: r.x + 0, y: r.y }); });
      if (t > t1 + 5.4) await v.once('w3', () => v.tap('.gd-water-all'));
      return;
    }
    if (t < t1 + 10.6) {
      await day(4);
      v.cap('Day 4: harvest time! 🧺');
      const t2 = t1 + 6.6;
      for (const [n, b] of [[0, 1], [1, 2], [2, 3]]) { // тыкве нужно 4 дня — пусть растёт
        if (t > t2 + n * 1.2) await v.once('hb' + n, async () => v.tap(await bedAt(v, b)));
        if (t > t2 + n * 1.2 + .55) await v.once('hv' + n, () => v.tap('[data-harvest]'));
      }
      return;
    }
    if (t < t1 + 13.4) {
      v.cap('…and sell it for buttons 🔘');
      await v.once('sell', () => v.page.evaluate(() => document.getElementById('garden').classList.add('vid-sell'))); // корзинка — сразу под полем
      if (t > t1 + 11) await v.once('s1', () => v.tap('[data-sell="sunflower"]'));
      if (t > t1 + 12) await v.once('s2', () => v.tap('[data-sell="strawberry"]'));
      return;
    }
    if (v.fin == null) { v.fin = t; await v.page.evaluate(() => VID.setCover(document.querySelector('.gd-cv').toDataURL())); } // в финале — кадр огорода
  },
};
