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
  // день ЭКСТРА = день палитры: тема дня рисуется 6 цветами одной из картин Алины (extra-palettes.js); если ничего не загрузить, серия не сгорает.
  // До сентября 2026 включительно — старая формула; октябрь 2026 — 12-е; дальше — случайный день не ближе 20 дней к прошлому.
  const extraMemo = {};
  function extraDay(y, m) {
    const key = y * 12 + m; if (extraMemo[key]) return extraMemo[key];
    const days = new Date(y, m + 1, 0).getDate(), rm = rngFor('extra-' + y + '-' + m);
    let v = 1 + Math.floor(rm() * days);
    if (key === 2026 * 12 + 9) v = 12;
    else if (key > 2026 * 12 + 9) {
      const py = m ? y : y - 1, pm = m ? m - 1 : 11, prev = extraDay(py, pm), pdays = new Date(py, pm + 1, 0).getDate();
      const lo = Math.max(1, 20 - (pdays - prev));
      v = lo + Math.floor(rm() * (days - lo + 1));
    }
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
  // цвета с 9 октября 2026 — «колодой» по 8 дней: каждый яркий цвет 3 раза, коричневый, чёрный и серый — по 1 разу;
  // в один день не больше одного неяркого цвета и ни один цвет не повторяется два дня подряд (до этого было просто случайно)
  const NEUTRAL = ['#8A5A3C', '#2B2B2B', '#9A9A9A'];
  const blocks = [];
  function colorBlock(b) {
    while (blocks.length <= b) {
      const k = blocks.length, prev = k ? blocks[k - 1][7] : legacyColors(new Date(2026, 9, 8)); // первый день не повторяет цвета 8 октября
      const neutral = D.colors.map((c, i) => i).filter(i => NEUTRAL.includes(D.colors[i].hex));
      const bright = D.colors.map((c, i) => i).filter(i => !NEUTRAL.includes(D.colors[i].hex));
      let days = null;
      for (let attempt = 0; attempt < 200 && !days; attempt++) {
        const r = rngFor('cols-' + k + '-' + attempt), left = {};
        for (const i of bright) left[i] = 3; for (const i of neutral) left[i] = 1;
        const out = []; let last = prev, ok = true;
        for (let dd = 0; dd < 8 && ok; dd++) {
          const day = [];
          for (let s2 = 0; s2 < 3; s2++) {
            // берём случайный цвет из оставшихся, чаще те, которых осталось больше (чтобы в конце не застрять)
            const cand = Object.keys(left).map(Number).filter(i => left[i] > 0 && !day.includes(i) && !last.includes(i) && !(neutral.includes(i) && day.some(j => neutral.includes(j))));
            if (!cand.length) { ok = false; break; }
            const tot = cand.reduce((t, i) => t + left[i], 0); let x = r() * tot, pickI = cand[0];
            for (const i of cand) { x -= left[i]; if (x <= 0) { pickI = i; break; } }
            day.push(pickI); left[pickI]--;
          }
          out.push(day); last = day;
        }
        if (ok) days = out;
      }
      blocks.push(days || blocks[k - 1] || [[0, 1, 2]]);
    }
    return blocks[b];
  }
  function legacyColors(d) { // как выбирались цвета до 9 октября (та же последовательность случайных чисел, что в themeFor)
    const r = rngFor('polly-' + keyOf(d)); r();
    const o = D.colors.map((c, i) => i);
    for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; }
    return o.slice(0, 3);
  }
  const balancedColors = n => colorBlock(Math.floor(n / 8))[n % 8];
  function themeFor(d, L) {
    const r = rngFor('polly-' + keyOf(d));
    // до 5 октября 2026 — старая формула (первые 98 тем), дальше все темы по кругу без повторов
    const legacy = Math.floor(r() * 98);
    const n = Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(2026, 9, 5)) / 864e5);
    const bday = d.getMonth() === 0 && d.getDate() === 23;
    const subject = n < 0 ? D.subjects[legacy] : bday ? D.subjects[birthdayIdx(d.getFullYear())] : D.subjects[planFor(n)];
    const cols = D.colors.slice();
    for (let i = cols.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [cols[i], cols[j]] = [cols[j], cols[i]]; }
    const n2 = Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(2026, 9, 9)) / 864e5);
    if (n2 >= 0) { const pick = balancedColors(n2); cols.splice(0, 3, ...pick.map(i => D.colors[i])); }
    const time = D.times[Math.floor(r() * D.times.length)];
    const day = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
    // раз в месяц — день ЭКСТРА (свой случайный день для каждого месяца)
    const extra = d.getDate() === extraDay(d.getFullYear(), d.getMonth());
    const twist = D.twists[orderOf('polly-twist', D.twists.length)[mod(n, D.twists.length)]][L];
    const mi = d.getFullYear() * 12 + d.getMonth() - (2026 * 12 + 9);
    const extraBw = D.extrasBw[orderOf('polly-extrabw', D.extrasBw.length)[mod(mi, D.extrasBw.length)]][L];
    let colors = cols.slice(0, 3), pal = null;
    const P = window.EXTRA_PALETTES;
    if (extra && P && P.length) { // очередь палитр (build.py + картины, добавленные с сайта): месяц N берёт N-ю, после конца — по кругу
      const p = P[mod(mi, P.length)];
      pal = { key: p.k, title: p.t[L], thumb: p.th };
      colors = p.c.map(([hex, en, ru, lv]) => ({ hex, n: [en, ru, lv] }));
    }
    return { subject: subject[L], colors, pal, twist, extraBw, time, extra, bday, tip: D.tips[day % D.tips.length][L] };
  }
  const isExtra = d => d.getDate() === extraDay(d.getFullYear(), d.getMonth());
  window.ChallengeTheme = { themeFor, keyOf, rngFor, extraDay, isExtra };
})();
