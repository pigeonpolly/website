// Тема дня для Daily Challenge: одинаковая у всех в один день. Нужен challenge-data.js.
// Используется на странице /challenge и в блоке «Тема дня» на главной.
(() => {
  const D = window.CHALLENGE_DATA;
  if (!D) return;
  const pad = n => String(n).padStart(2, '0');
  const keyOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  function rngFor(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
    let a = h >>> 0;
    return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let x = Math.imul(a ^ a >>> 15, 1 | a); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; };
  }
  // день ЭКСТРА: свой случайный день каждый месяц, число не повторяет прошлый месяц
  const extraMemo = {};
  function extraDay(y, m) {
    const key = y * 12 + m; if (extraMemo[key]) return extraMemo[key];
    const days = new Date(y, m + 1, 0).getDate(), rm = rngFor('extra-' + y + '-' + m);
    let v = 1 + Math.floor(rm() * days);
    if (key > 2026 * 12 + 9) { const prev = extraDay(m ? y : y - 1, m ? m - 1 : 11); while (v === prev) v = 1 + Math.floor(rm() * days); }
    return (extraMemo[key] = v);
  }
  const orders = {};
  function orderOf(name, len) {
    if (orders[name]) return orders[name];
    const r = rngFor(name), o = [...Array(len).keys()];
    for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; }
    return (orders[name] = o);
  }
  // 2/3 дней — предмет текущего сезона, остальные — любой другой; внутри каждой группы без повторов
  const SEASON = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'];
  const pools = { none: [] }; D.subjects.forEach((r, i) => (r[3] || 'none').split(' ').forEach(t => (pools[t] = pools[t] || []).push(i)));
  const plan = [], used = {};
  // ровно 2/3 дней каждого месяца — сезонные (какие именно — случайно, но одинаково у всех)
  function seasonalDay(d) {
    const days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const o = orderOf('season-' + d.getFullYear() + '-' + d.getMonth(), days);
    return o.indexOf(d.getDate() - 1) < Math.ceil(days * 2 / 3);
  }
  function planFor(n) {
    while (plan.length <= n) {
      const d = new Date(2026, 9, 5 + plan.length);
      const bd = d.getMonth() === 0 && d.getDate() === 23;
      const p = seasonalDay(d) ? SEASON[d.getMonth()] : 'none';
      const pool = pools[p], o = orderOf('pool-' + p, pool.length);
      let k = used[p] || 0, idx = pool[o[k % pool.length]];
      // сезонный предмет мог встретиться в соседнем сезоне недавно — пропускаем повтор за последние 60 дней
      for (let tries = 0; tries < pool.length && plan.slice(-60).includes(idx); tries++) { k++; idx = pool[o[k % pool.length]]; }
      if (!bd) used[p] = k + 1;
      plan.push(bd ? -1 : idx);
    }
    return plan[n];
  }
  const BDAY = ['a birthday cake', 'a gift box with a bow', 'a bunch of balloons', 'a party hat', 'a birthday candle', 'a cupcake', 'a piñata', 'a greeting card', 'a confetti cannon', 'a paper crown'];
  function birthdayIdx(y) {
    const name = BDAY[mod(y - 2027, BDAY.length)], i = D.subjects.findIndex(r => r[0] === name);
    return i < 0 ? 0 : i;
  }
  const mod = (a, b) => ((a % b) + b) % b;
  function themeFor(d, L) {
    const r = rngFor('polly-' + keyOf(d));
    // до 5 октября 2026 — старая формула (первые 98 тем), дальше все темы по кругу без повторов
    const legacy = Math.floor(r() * 98);
    const n = Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(2026, 9, 5)) / 864e5);
    const bday = d.getMonth() === 0 && d.getDate() === 23;
    const subject = n < 0 ? D.subjects[legacy] : bday ? D.subjects[birthdayIdx(d.getFullYear())] : D.subjects[planFor(n)];
    const cols = D.colors.slice();
    for (let i = cols.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [cols[i], cols[j]] = [cols[j], cols[i]]; }
    const time = D.times[Math.floor(r() * D.times.length)];
    const day = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
    // раз в месяц — день ЭКСТРА (свой случайный день для каждого месяца)
    const extra = d.getDate() === extraDay(d.getFullYear(), d.getMonth());
    const twist = D.twists[orderOf('polly-twist', D.twists.length)[mod(n, D.twists.length)]][L];
    const mi = d.getFullYear() * 12 + d.getMonth() - (2026 * 12 + 9);
    const extraBw = D.extrasBw[orderOf('polly-extrabw', D.extrasBw.length)[mod(mi, D.extrasBw.length)]][L];
    return { subject: subject[L], colors: cols.slice(0, 3), twist, extraBw, time, extra, bday, tip: D.tips[day % D.tips.length][L] };
  }
  window.ChallengeTheme = { themeFor, keyOf, rngFor, extraDay };
})();
