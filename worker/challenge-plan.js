// Подбор тем челленджа (этап 3, docs/challenge.md «Подбор тем»): план месяца по правилам.
// Общий для worker (cron 20-го, кабинет «🎨 Темы челленджа») и tools/challenge_check.js / challenge_oct.js (node).
// data — site/assets/challenge-items.json (собирает build.py): subjects [en, ru, lv, сезон], tags [семья, категория, сложность], colors, moreColors, bw, off, tips, twists, extrasBw, times.

// числа — в «📜 Правилах» (RULE_DEFAULTS в worker/index.js берёт их отсюда)
export const CH_DEFAULTS = {
  chFamilyGap: 90,   // одна семья предметов — не ближе стольких дней (и никогда дважды в месяце)
  chCatWindow: 7,    // в любые chCatWindow дней подряд —
  chCatMin: 5,       // не меньше chCatMin разных категорий (и одна категория — не два дня подряд)
  chEasy: 3, chMid: 3, chHard: 1, // «колода» сложности: сколько простых / средних / сложных на каждые (chEasy + chMid + chHard) дней
  chSeasonDaysPct: 80, // сколько % дней месяца — предметы сезона (80 → 5–6 дней в неделю; до 18.10.2026 было chSeasonPct = 66)
};
export const CH_RANGE = { chFamilyGap: [0, 365], chCatWindow: [2, 14], chCatMin: [1, 14], chEasy: [0, 14], chMid: [0, 14], chHard: [0, 14], chSeasonDaysPct: [0, 100] };
export const PLAN_FROM = '2026-11-01'; // с этого дня темы — из плана (раньше — формула challenge-theme.js)
export const NEW_FROM = '2026-10-19'; // с этого дня — новые правила: цвета 2–5, Ч/Б-указания, слова-темы и «из жизни» (18.10.2026, по просьбе Алины)

const pad = n => String(n).padStart(2, '0');
const mod = (a, b) => ((a % b) + b) % b;
export const dayNum = key => Math.round(Date.UTC(+key.slice(0, 4), +key.slice(5, 7) - 1, +key.slice(8, 10)) / 864e5);
export const keyOfNum = n => new Date(n * 864e5).toISOString().slice(0, 10);
const N_OCT5 = dayNum('2026-10-05'), N_OCT9 = dayNum('2026-10-09'), N_FROM = dayNum(PLAN_FROM), N_NEW = dayNum(NEW_FROM);
const FRESH = 1080; // предметы с этого индекса (18.10.2026, с маленькой историей) — первыми, пока не были

// те же случайные числа, что в site/assets/challenge-theme.js
export function rngFor(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
  let a = h >>> 0;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let x = Math.imul(a ^ a >>> 15, 1 | a); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; };
}
const orders = {};
function orderOf(name, len) {
  const k = name + '|' + len; if (orders[k]) return orders[k];
  const r = rngFor(name), o = [...Array(len).keys()];
  for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; }
  return (orders[k] = o);
}
// день ЭКСТРА — как в challenge-theme.js (m — 0…11)
const extraMemo = {};
export function extraDay(y, m) {
  const key = y * 12 + m; if (extraMemo[key]) return extraMemo[key];
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate(), rm = rngFor('extra-' + y + '-' + m);
  let v = 1 + Math.floor(rm() * days);
  if (key === 2026 * 12 + 9) v = 12;
  else if (key > 2026 * 12 + 9) {
    const py = m ? y : y - 1, pm = m ? m - 1 : 11, prev = extraDay(py, pm), pdays = new Date(Date.UTC(py, pm + 1, 0)).getUTCDate();
    const lo = Math.max(1, 20 - (pdays - prev));
    v = lo + Math.floor(rm() * (days - lo + 1));
  }
  return (extraMemo[key] = v);
}
const SEASON = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'];
// какие дни месяца — сезонные: chSeasonDaysPct % дней, выбор — как в challenge-theme.js
const seasonMemo = {};
export function seasonalDays(y, m, pct = CH_DEFAULTS.chSeasonDaysPct) {
  const mk = y + '-' + m + '-' + pct; if (seasonMemo[mk]) return seasonMemo[mk];
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate(), o = orderOf('season-' + y + '-' + m, days), n = Math.ceil(days * pct / 100);
  const out = new Set(); for (let i = 0; i < n; i++) out.add(o[i] + 1);
  return (seasonMemo[mk] = out);
}
const BDAY = ['a birthday cake', 'a gift box with a bow', 'a bunch of balloons', 'a party hat', 'a birthday candle', 'a cupcake', 'a piñata', 'a greeting card', 'a confetti cannon', 'a paper crown'];
export function birthdayIdx(data, y) { const i = data.subjects.findIndex(r => r[0] === BDAY[mod(y - 2027, BDAY.length)]); return i < 0 ? 0 : i; }

// ---------- всё, кроме предмета: цвета, время, совет, особенность, Ч/Б-условие ЭКСТРА (как в challenge-theme.js) ----------
const NEUTRAL = ['#8A5A3C', '#2B2B2B', '#9A9A9A'];
const blocks = [];
function legacyColors(data, key) {
  const r = rngFor('polly-' + key); r();
  const o = data.colors.map((c, i) => i);
  for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; }
  return o.slice(0, 3);
}
function colorBlock(data, b) {
  while (blocks.length <= b) {
    const k = blocks.length, prev = k ? blocks[k - 1][7] : legacyColors(data, '2026-10-08');
    const neutral = data.colors.map((c, i) => i).filter(i => NEUTRAL.includes(data.colors[i].hex));
    const bright = data.colors.map((c, i) => i).filter(i => !NEUTRAL.includes(data.colors[i].hex));
    let days = null;
    for (let attempt = 0; attempt < 200 && !days; attempt++) {
      const r = rngFor('cols-' + k + '-' + attempt), left = {};
      for (const i of bright) left[i] = 3; for (const i of neutral) left[i] = 1;
      const out = []; let last = prev, ok = true;
      for (let dd = 0; dd < 8 && ok; dd++) {
        const day = [];
        for (let s2 = 0; s2 < 3; s2++) {
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
// ---------- с 1.11.2026: гармоничные цвета (2–5) из colors + moreColors ----------
// все цвета плана: индексы 0–9 — colors, 10+ — moreColors; k: 'n' — нейтральный, f — бейдж за цвет (иначе n[0])
export const allColors = data => data.colors.concat(data.moreColors || [], data.wheelColors || []); // wheelColors — только для правки в кабинете (цветовой круг)
const genColors = data => data.colors.concat(data.moreColors || []); // из них подбирает генератор
function hsl(hex) {
  const v = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255), mx = Math.max(...v), mn = Math.min(...v), l = (mx + mn) / 2, dd = mx - mn;
  if (!dd) return { h: 0, s: 0, l };
  const [r, g, b] = v, h = mx === r ? ((g - b) / dd + 6) % 6 : mx === g ? (b - r) / dd + 2 : (r - g) / dd + 4;
  return { h: h * 60, s: dd / (1 - Math.abs(2 * l - 1)), l };
}
// насколько два цвета различаются на глаз (ΔE в Lab): меньше MIN_DE — в одном дне не ставим (индиго и тёмно-синий, кремовый и бежевый…)
function lab(hex) {
  const v = [1, 3, 5].map(i => { const c = parseInt(hex.slice(i, i + 2), 16) / 255; return c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92; });
  const xyz = [[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]].map((r, k) => (r[0] * v[0] + r[1] * v[1] + r[2] * v[2]) / [0.9505, 1, 1.089][k]);
  const f = t => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116, [x, y, z] = xyz.map(f);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}
const MIN_DE = 35;
const dE = (a, b) => Math.hypot(a.lab[0] - b.lab[0], a.lab[1] - b.lab[1], a.lab[2] - b.lab[2]);
const hueGap = (a, b) => { const x = Math.abs(a - b) % 360; return x > 180 ? 360 - x : x; };
const SEASON_OF = m => SEASON[m];
// насколько цвет подходит сезону (вес при выборе акцента)
function seasonW(c, season) {
  const warm = c.h < 70 || c.h > 320;
  if (season === 'autumn') return warm || (c.h < 100 && c.l < 0.5) ? 4 : c.l < 0.35 ? 2 : 0.6;
  if (season === 'winter') return !warm || c.l < 0.35 ? 2 : 0.8;
  if (season === 'spring') return c.l > 0.6 ? 2.5 : 1;
  if (season === 'summer') return c.s > 0.6 && c.l > 0.45 ? 2.5 : 1;
  return 1;
}
// схемы: нейтральные + 1 акцент; соседние оттенки; дополнительные; главный + поддержка (5). Два ярких одного оттенка (голубой и индиго) — никогда
const SCHEMES = [['accent', 38], ['analog', 27], ['compl', 22], ['five', 13]];
function harmonyFor(data, key, avoid) {
  const all = genColors(data).map((c, i) => ({ i, k: c.k, lab: lab(c.hex), ...hsl(c.hex) }));
  const N = all.filter(c => c.k === 'n'), A = all.filter(c => c.k !== 'n' && !avoid.has(c.i));
  const season = SEASON_OF(+key.slice(5, 7) - 1), r = rngFor('harmony-' + key);
  let out = [];
  const far = list => list.filter(c => !out.includes(c) && out.every(o => dE(c, o) >= MIN_DE && (c.k === 'n' || o.k === 'n' || hueGap(c.h, o.h) >= 45))); // только заметно другие, чем уже выбранные
  const pickW = (list0, w) => { const list = far(list0); if (!list.length) return null; const tot = list.reduce((t, c) => t + w(c), 0); let x = r() * tot; for (const c of list) { x -= w(c); if (x <= 0) return c; } return list[list.length - 1]; };
  const pickN = (k, from = N) => { const got = []; for (let j = 0; j < k; j++) { const pool = far(from).filter(c => got.every(o => dE(c, o) >= MIN_DE) && !got.includes(c)); if (!pool.length) break; got.push(pool[Math.floor(r() * pool.length)]); } return got; };
  const sw = c => seasonW(c, season);
  let x = r() * 100, scheme = 'accent'; for (const [s2, w] of SCHEMES) { x -= w; if (x <= 0) { scheme = s2; break; } }
  const add = c => { if (c) out.push(c); return c; }, addN = k => pickN(k).forEach(add);
  const a = add(pickW(A, sw));
  if (scheme === 'accent') addN(r() < 0.3 ? 1 : r() < 0.6 ? 2 : 3);
  else if (scheme === 'analog') { // соседние по кругу, но заметно разные
    const near = c => hueGap(c.h, a.h) >= 45 && hueGap(c.h, a.h) <= 100;
    if (add(pickW(A.filter(near), sw)) && r() < 0.5) add(pickW(A.filter(near), sw));
    if (out.length < 3 || r() < 0.4) addN(1);
  } else if (scheme === 'compl') {
    add(pickW(A.filter(c => hueGap(c.h, a.h) >= 150), sw));
    addN(r() < 0.3 ? 0 : r() < 0.7 ? 1 : 2);
  } else if (scheme === 'five') {
    add(pickW(A.filter(c => hueGap(c.h, a.h) >= 45 && hueGap(c.h, a.h) <= 100), sw));
    add(pickW(A.filter(c => hueGap(c.h, a.h) >= 150), sw));
    addN(5 - out.length);
  }
  if (out.length < 2) addN(2 - out.length);
  if (out.length < 2) add(pickW(A, sw));
  // по порядку: светлые → тёмные нейтральные, потом акценты
  return out.sort((p, q) => (p.k === 'n') === (q.k === 'n') ? q.l - p.l : p.k === 'n' ? -1 : 1).map(c => c.i);
}
// цвета дня с 1.11: акценты не повторяют вчерашние
export function harmonyColors(data, key) {
  const y = harmonyFor(data, keyOfNum(dayNum(key) - 1), new Set()), all = allColors(data);
  return harmonyFor(data, key, new Set(y.filter(i => all[i].k !== 'n')));
}
// ---------- с 1.11.2026: Ч/Б-указание — одно в день, группы по очереди (раскадровка, линия и штриховка, размер, настроение) ----------
const BW_GROUPS = ['frame', 'line', 'size', 'mood'];
export function bwTwist(data, n) {
  const k = n - N_NEW, g = BW_GROUPS[mod(k, BW_GROUPS.length)], L = data.bw[g];
  // внутри группы — по кругу без повторов
  return L[orderOf('bw-' + g, L.length)[mod(Math.floor(k / BW_GROUPS.length), L.length)]].slice(0, 3);
}
export function baseDay(data, key) {
  const n = dayNum(key), y = +key.slice(0, 4), m = +key.slice(5, 7) - 1, d = +key.slice(8, 10);
  const r = rngFor('polly-' + key); r();
  const cols = data.colors.map((c, i) => i);
  for (let i = cols.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [cols[i], cols[j]] = [cols[j], cols[i]]; }
  const colors = n >= N_NEW && data.moreColors && data.moreColors.length ? harmonyColors(data, key) : n >= N_OCT9 ? colorBlock(data, Math.floor((n - N_OCT9) / 8))[(n - N_OCT9) % 8].slice() : cols.slice(0, 3);
  const time = data.times[Math.floor(r() * data.times.length)];
  const mi = y * 12 + m - (2026 * 12 + 9);
  const extra = d === extraDay(y, m);
  return {
    colors, time, tip: data.tips[n % data.tips.length].slice(0, 3),
    twist: n >= N_NEW && data.bw ? bwTwist(data, n) : data.twists[orderOf('polly-twist', data.twists.length)[mod(n - N_OCT5, data.twists.length)]].slice(0, 3),
    extra: extra ? data.extrasBw[orderOf('polly-extrabw', data.extrasBw.length)[mod(mi, data.extrasBw.length)]].slice(0, 3) : null,
  };
}

// ---------- проверка предмета для дня ----------
// значимые слова предмета (EN, в ед. числе): «a mug of tea» и «your favourite mug» — общее «mug», в соседние дни так нельзя
const WSTOP = new Set('a an the of in on at by to for with and or from into under over your you yours my its it his her their our this that what who which is are be just one two three four five any all some last first next new old big little tiny small giant huge favourite favorite today today\'s todays right now away up out off full day night time thing things way'.split(' '));
const wordsMemo = new WeakMap();
function wordsOf(data, i) {
  let M = wordsMemo.get(data); if (!M) wordsMemo.set(data, M = []);
  if (M[i]) return M[i];
  const w = String((data.subjects[i] || [''])[0]).toLowerCase().replace(/[’']s\b/g, '').split(/[^a-z]+/).filter(x => x.length > 2 && !WSTOP.has(x))
    .map(x => x.endsWith('ies') ? x.slice(0, -3) + 'y' : /(ches|shes|xes)$/.test(x) ? x.slice(0, -2) : /[^s]s$/.test(x) ? x.slice(0, -1) : x);
  return (M[i] = new Set(w));
}
const WORD_DAYS = 3;
// plan: Map номер дня → индекс предмета (соседние дни с обеих сторон); rules — CH_DEFAULTS и правки из «📜 Правил»
const deckOf = (rules, n) => { const len = rules.chEasy + rules.chMid + rules.chHard; return len ? Math.floor((n - N_FROM) / len) : 0; };
const quotaOf = rules => ({ 1: rules.chEasy, 2: rules.chMid, 3: rules.chHard });
// что нарушит предмет item в день n (пустой список — подходит). skip — какие правила не проверять
// всё про соседей дня n, что нужно для проверки любого предмета (считается один раз на день)
function around(data, rules, plan, n) {
  const T = data.tags, ym = keyOfNum(n).slice(0, 7), at = x => (x !== n && plan.has(x) && T[plan.get(x)]) || null;
  const fams = new Set(); // семьи, которые нельзя: были ближе chFamilyGap дней или в том же месяце
  for (const [x, it] of plan) if (x !== n && T[it] && (Math.abs(x - n) < rules.chFamilyGap || keyOfNum(x).slice(0, 7) === ym)) fams.add(T[it][0]);
  const nb = new Set([at(n - 1), at(n + 1)].filter(Boolean).map(t => t[1]));
  const words = new Set(); // слова предметов в соседние WORD_DAYS дней
  for (let x = n - WORD_DAYS; x <= n + WORD_DAYS; x++) if (x !== n && plan.has(x)) for (const w of wordsOf(data, plan.get(x))) words.add(w);
  const W = rules.chCatWindow, wins = [];
  for (let s = n - W + 1; s <= n; s++) {
    const cats = new Set(); let empty = 0;
    for (let x = s; x < s + W; x++) { if (x === n) continue; const t = at(x); if (t) cats.add(t[1]); else empty++; }
    wins.push({ cats, empty });
  }
  const len = rules.chEasy + rules.chMid + rules.chHard, used = { 1: 0, 2: 0, 3: 0 };
  if (len && n >= N_FROM) { const s0 = N_FROM + deckOf(rules, n) * len; for (let x = s0; x < s0 + len; x++) { const t = at(x); if (t) used[t[2]]++; } }
  return { fams, nb, words, wins, used, deck: !!len && n >= N_FROM };
}
// что нарушит предмет item в день n (пустой список — подходит). skip — какие правила не проверять
export function violations(data, rules, plan, n, item, skip = {}, ctx = null) {
  ctx = ctx || around(data, rules, plan, n);
  const [f, c, dif] = data.tags[item] || [], out = [], min = Math.min(rules.chCatMin, rules.chCatWindow);
  if (!skip.family && ctx.fams.has(f)) out.push('family');
  if (!skip.cat && ctx.nb.has(c)) out.push('cat');
  if (!skip.family && n >= N_NEW && [...wordsOf(data, item)].some(w => ctx.words.has(w))) out.push('word');
  if (!skip.window && ctx.wins.some(w => w.cats.size + (w.cats.has(c) ? 0 : 1) + w.empty < min)) out.push('window');
  if (!skip.deck && ctx.deck && ctx.used[dif] >= quotaOf(rules)[dif]) out.push('deck');
  return out;
}
// какой «пул» у дня: сезон или «без сезона»; 23 января — именинный предмет
export function poolOf(data, rules, key) {
  const y = +key.slice(0, 4), m = +key.slice(5, 7) - 1, d = +key.slice(8, 10);
  if (m === 0 && d === 23) return 'bday';
  return seasonalDays(y, m, rules.chSeasonDaysPct).has(d) ? SEASON[m] : 'none';
}
const seasonsOf = new WeakMap(); // сезоны предмета — один раз на data
function inPool(data, i, p) {
  if (p === 'any') return true;
  let S = seasonsOf.get(data); if (!S) seasonsOf.set(data, S = data.subjects.map(r => String(r[3] || '').split(' ').filter(Boolean)));
  if (!S[i].length && data.tags[i] && ['idea', 'life'].includes(data.tags[i][1])) return true; // слово-тема и тема «из жизни» без сезона годятся в любой день
  return p === 'none' ? !S[i].length : S[i].includes(p);
}
const isHalloween = (data, i) => String(data.subjects[i][3] || '').split(' ').includes('halloween');
const poolLists = new WeakMap(); // предметы пула (с тегами) — один раз на data
function poolList(data, p) {
  let M = poolLists.get(data); if (!M) poolLists.set(data, M = {});
  if (!M.off) M.off = new Set(data.off || []); // content/challenge-off.txt — скучные предметы генератор не берёт
  return M[p] || (M[p] = data.subjects.map((r, i) => i).filter(i => data.tags[i] && !M.off.has(i) && inPool(data, i, p)));
}
// подходящие предметы для дня, лучшие первыми: давно не было (или не было никогда), потом — случайно
// lastUse: Map предмет → номер дня, когда был; rnd — случайные числа
function ranked(data, rules, plan, n, pool, lastUse, rnd, skip, wantD) {
  const out = [], ctx = around(data, rules, plan, n), oct = keyOfNum(n).slice(5, 7) === '10', hw = keyOfNum(n).slice(5) === '10-31'; // 31 октября — хеллоуинская тема
  // слово-тема (категория idea, в духе Inktober 52) — первой, если её не было 6 дней
  // и так же тема «из жизни» (категория life: кадр из любимого фильма, ваш завтрак, вид из окна…)
  const noneFor = (c, k) => n >= N_NEW && [...Array(k)].every((_, x) => !plan.has(n - x - 1) || (data.tags[plan.get(n - x - 1)] || [])[1] !== c);
  const wantIdea = noneFor('idea', 6), wantLife = noneFor('life', 3); // слово — ~раз в неделю, «из жизни» — ~2 раза
  for (const i of poolList(data, pool)) {
    if (wantD && data.tags[i][2] !== wantD) continue;
    if (!oct && isHalloween(data, i)) continue; // хеллоуинские — только в октябре
    if (violations(data, rules, plan, n, i, skip, ctx).length) continue;
    const lu = lastUse.has(i) ? lastUse.get(i) : -1e9;
    const c = data.tags[i][1], special = c === 'idea' || c === 'life';
    out.push([i, lu + rnd() * 30 - (i >= FRESH && lu < 0 && !special ? 100 : 0) - (wantIdea && c === 'idea' ? 1e10 : 0) - (wantLife && c === 'life' ? 2e10 : 0) - (hw && isHalloween(data, i) ? 3e10 : 0)]); // разница в месяц — почти одно и то же; новые предметы, которых ещё не было, — первыми
  }
  return out.sort((a, b) => a[1] - b[1]).map(x => x[0]);
}
// ослабления по очереди, если по всем правилам никто не подходит
const RELAX = [{}, { window: 1 }, { window: 1, deck: 1 }, { window: 1, deck: 1, cat: 1 }, { window: 1, deck: 1, cat: 1, family: 1 }];

// ---------- план месяца ----------
// history: Map номер дня → предмет (что уже было до месяца, лучше ~120 дней; можно и дни после — если месяц пересобирается)
// Возвращает { rows: [{day, item, subject, tip, colors, time, twist, extra}], broken: [{day, rules}] } — broken: где правила пришлось ослабить
// fromDay — с какого числа месяца подбирать (раньше — уже есть в history; так собран конец октября 2026)
export function planMonth(data, rules, y, m, history, fromDay = 1) {
  rules = { ...CH_DEFAULTS, ...(rules || {}) };
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate(), ym = `${y}-${pad(m + 1)}`;
  let best = null;
  for (let attempt = 0; attempt < 12 && !(best && !best.broken.length); attempt++) {
    const rnd = rngFor(`plan-${ym}-${attempt}`), plan = new Map(history), lastUse = new Map(), broken = [];
    for (const [x, it] of [...history].sort((a, b) => a[0] - b[0])) lastUse.set(it, x);
    const keys = [...Array(days)].map((_, i) => `${ym}-${pad(i + 1)}`).slice(fromDay - 1);
    // 23 января — заранее, чтобы колода и категории учли именинный предмет
    for (const k of keys) if (poolOf(data, rules, k) === 'bday') plan.set(dayNum(k), birthdayIdx(data, y));
    // ближайшее 23 января после месяца (в пределах chFamilyGap) — не брать семью именинного предмета
    { const nb = dayNum(`${y + 1}-01-23`), end = dayNum(keys[keys.length - 1]); if (m > 0 && nb - end < rules.chFamilyGap) plan.set(nb, birthdayIdx(data, y + 1)); }
    for (const k of keys) {
      const n = dayNum(k), pool = poolOf(data, rules, k);
      if (pool === 'bday') continue;
      const wantD = pickDifficulty(data, rules, plan, n, pool, rnd);
      let item = null, lvl = 0;
      for (; lvl < RELAX.length && item == null; lvl++) {
        item = ranked(data, rules, plan, n, pool, lastUse, rnd, RELAX[lvl], lvl < 2 ? wantD : 0)[0] ?? null;
        if (item == null && lvl < 2) item = ranked(data, rules, plan, n, pool, lastUse, rnd, RELAX[lvl], 0)[0] ?? null;
      }
      if (item == null) { item = ranked(data, rules, plan, n, 'any', lastUse, rnd, RELAX[RELAX.length - 1], 0)[0] ?? 0; lvl = RELAX.length + 1; }
      if (lvl > 1) broken.push({ day: k, rules: Object.keys(RELAX[Math.min(lvl - 1, RELAX.length - 1)]).concat(lvl > RELAX.length ? ['pool'] : []) });
      plan.set(n, item); lastUse.set(item, n);
    }
    const rows = keys.map(k => ({ day: k, item: plan.get(dayNum(k)), ...rowText(data, k, plan.get(dayNum(k))) }));
    if (!best || broken.length < best.broken.length) best = { rows, broken };
  }
  return best;
}
// сложность для дня: из того, что осталось в колоде; сложную — лучше в день без сезона (у сезонных предметов сложных мало)
function pickDifficulty(data, rules, plan, n, pool, rnd) {
  const len = rules.chEasy + rules.chMid + rules.chHard; if (!len || n < N_FROM) return 0;
  const T = data.tags, q = quotaOf(rules), s0 = N_FROM + deckOf(rules, n) * len, left = { ...q };
  for (let x = s0; x < s0 + len; x++) if (plan.has(x) && T[plan.get(x)]) left[T[plan.get(x)][2]]--;
  // сколько дней колоды после этого ещё пустые и без сезона
  let laterFree = 0;
  for (let x = n + 1; x < s0 + len; x++) if (!plan.has(x) && poolOf(data, rules, keyOfNum(x)) === 'none') laterFree++;
  const opts = [];
  for (const d of [1, 2, 3]) {
    if (left[d] <= 0) continue;
    let w = left[d];
    if (pool !== 'none' && d === 3 && laterFree >= left[3]) w = 0; // сложную оставим дню без сезона
    if (pool === 'none' && d === 3) w *= 3;
    opts.push([d, w]);
  }
  const tot = opts.reduce((t, o) => t + o[1], 0); if (!tot) return opts.length ? opts[0][0] : 0;
  let x = rnd() * tot; for (const [d, w] of opts) { x -= w; if (x <= 0) return d; }
  return opts[opts.length - 1][0];
}
// тексты дня для строки плана: предмет + всё остальное
export function rowText(data, key, item) {
  const s = data.subjects[item] || ['', '', ''];
  return { subject: s.slice(0, 3), ...baseDay(data, key) };
}
// «🎲 Другой предмет» в кабинете: лучший предмет для дня по правилам, кроме нынешнего и тех, что в exclude
export function rerollDay(data, rules, plan, key, exclude = []) {
  rules = { ...CH_DEFAULTS, ...(rules || {}) };
  const n = dayNum(key), cur = plan.get(n), pool = poolOf(data, rules, key) === 'bday' ? 'none' : poolOf(data, rules, key);
  const p2 = new Map(plan); p2.delete(n);
  const lastUse = new Map(); for (const [x, it] of [...p2].sort((a, b) => a[0] - b[0])) lastUse.set(it, x);
  const rnd = rngFor(`reroll-${key}-${exclude.length}-${Date.now()}`);
  for (const skip of RELAX) {
    const c = ranked(data, rules, p2, n, pool, lastUse, rnd, skip, 0).filter(i => i !== cur && !exclude.includes(i));
    if (c.length) return c[0];
  }
  return null;
}
// все нарушения в плане (для tools/challenge_check.js и кабинета): [{day, rules}]
export function checkPlan(data, rules, plan, from, to) {
  rules = { ...CH_DEFAULTS, ...(rules || {}) };
  const out = [];
  for (let n = from; n <= to; n++) {
    if (!plan.has(n)) continue;
    const key = keyOfNum(n), pool = poolOf(data, rules, key), it = plan.get(n);
    const v = pool === 'bday' ? [] : violations(data, rules, plan, n, it);
    if (pool !== 'bday' && !inPool(data, it, pool)) v.push('pool');
    if (v.length) out.push({ day: key, item: it, rules: v });
  }
  return out;
}
