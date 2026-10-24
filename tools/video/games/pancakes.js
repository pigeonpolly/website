// Ролик «Блинная Полли» (tools/video/games.js pancakes): два жителя Воббленда с 11-го уровня, настоящие нажатия по кнопкам игры.
// Ход читает window.__pan (есть только на localhost): форма, прожарка и топпинги — ровно по заказу, клиент в восторге.
const S = '() => { const s = __pan.s(), c = s.cur || {}; return { phase: s.phase, level: s.level, mood: s.result && s.result.mood, order: s.order && { shape: s.order.shape, bake: s.order.bake, tops: s.order.tops }, fill: c.fill, d1: c.d1, d2: c.d2, made: s.made.length }; }';
let BAKE = null, info = { today: 0, best: 0 };

module.exports = {
  title: 'Polly’s Pancakes', url: '/pancakes/', cover: '/images/games/pancakes.png', seed: 11,
  join: ['Play for free', 'and earn buttons 🔘'],
  music: { i: 0 }, // «Morning Mail»
  show: ['#pancakes'],
  keys: [2.5, 6, 10.5, 13, 18.5],
  // поле 322×502 под заголовком: fit() считает высоту от innerHeight
  init: 'Object.defineProperty(window, "innerHeight", { get: () => 612 });',
  api(m, p) {
    if (m === 'GET' && p.startsWith('/api/pancakes')) return { on: true, per: 1, record: 3, every: 25, wash: 10, soap: 1, start: 10, up: {}, ups: {}, today: 0, best: 20, buttons: 24, me: { nick: 'polly' }, top: [] };
    if (p === '/api/pancakes/start') return { run: 'video', from: 0 };
    if (p === '/api/pancakes/level') { info.today++; info.best++; return { today: info.today, best: info.best, got: 1 }; }
    return null;
  },
  async setup(v) {
    await v.page.addStyleTag({ content: '#pancakes { position: fixed !important; left: 0; right: 0; top: 108px; width: 322px; margin: 0 auto !important; padding: 0 !important; z-index: 10; } #pancakes .rain-top, #pancakes .rain-pause { display: none !important; }' });
    await v.page.evaluate(() => dispatchEvent(new Event('resize')));
    await v.page.clock.runFor(300);
    BAKE = await v.page.evaluate(() => __pan.BAKE);
    await v.page.evaluate(() => __pan.start(10)); // с рубежа: 11-й уровень — формы и топпинги поинтереснее
    await v.page.clock.runFor(200);
  },
  async step(v, t) {
    if (v.fin != null) return;
    const s = await v.page.evaluate(`(${S})()`), key = `${s.level}:${s.made}:${s.phase}`;
    if (v.mem.key !== key) { v.mem.key = key; v.mem.at = t; }
    const since = t - v.mem.at, lv1 = s.level === 11;
    v.speed = lv1 ? 1.4 : 2.2;
    if (s.phase === 'arrive') v.cap(lv1 ? 'Wobbleland is queuing up!' : 'Next customer!');
    if (s.phase === 'pan') { v.cap('Pick the right pan'); if (since > (lv1 ? .8 : .45)) await v.tap(`[data-pan="${s.order.shape}"]`); }
    if (s.phase === 'pour') {
      v.cap('Hold to pour the batter');
      if (!v.holdAt && since > .3 && !v.mem['pour' + key]) { v.mem['pour' + key] = 1; await v.hold('.pk-hold'); }
      if (v.holdAt && s.fill >= .94) await v.release();
    }
    const tgt = s.order && BAKE[s.order.bake];
    if (s.phase === 'cook1') { v.cap('Flip it at the perfect colour'); if (s.d1 >= tgt) await v.tap('.pk-big'); }
    if (s.phase === 'cook2') { v.cap('…and off the pan!'); if (s.d2 >= tgt) await v.tap('.pk-big'); }
    if (s.phase === 'top') {
      v.cap('Add exactly what they ordered');
      const want = Object.entries(s.order.tops).flatMap(([id, n]) => Array(n).fill(id)), k = Math.floor((since - .5) / .5);
      if (k >= 0 && k < want.length && v.mem.top !== key + k) { v.mem.top = key + k; await v.tap(`[data-top="${want[k]}"]`); }
      if (k === want.length + 1 && v.mem.serve !== key) { v.mem.serve = key; await v.tap('.pk-serve'); }
    }
    if (s.phase === 'react') {
      v.speed = 1;
      v.cap(s.mood === 3 ? 'Delighted! +1 🔘' : 'Happy customer! +1 🔘');
      if (lv1 && since > 2.6) await v.tap('.pk-big');
      if (!lv1 && since > 2.4) v.fin = t;
    }
  },
};
