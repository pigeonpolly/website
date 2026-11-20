// Кухня птички: книга рецептов (этап 89, docs/bird.md «Кухня: книга рецептов»). Блюда готовятся из урожая огорода (garden.crop),
// готовка — «снять с огня вовремя»: время считает сервер (start → done), качество raw / good / perfect / burnt.
// Съеденное блюдо — эффект на часы (одно блюдо за раз): btn — +% пуговок в играх (award в worker/index.js, строка button_log kind 'dish'),
// grow — каждый полив в огороде добавляет часы роста (worker/garden.js water), seed — чаще семечко из игр (gardenDrop). Подгоревшее/сырое — −cookBadPct % пуговок.
// Названия и рисунки блюд — site/assets/cookbook.js. API: GET /api/kitchen, POST /api/kitchen/{start,done}.

export const KITCHEN_TABLES = [
  // cook — JSON готовки сейчас {r, t0} ('' — не готовится); dish — JSON съеденного {r, q, t, g, pct, until}; book — {рецепт: {n, best}}; cooked — блюд всего
  "CREATE TABLE IF NOT EXISTS kitchen (user_id INTEGER PRIMARY KEY, cook TEXT DEFAULT '', dish TEXT DEFAULT '', book TEXT DEFAULT '{}', cooked INTEGER DEFAULT 0, created_at INTEGER)",
];
export const KITCHEN_RULES = {
  cookOn: true, // блюда дают эффекты
  cookPower: 100, cookTime: 100, // сила и длительность хороших эффектов, % от рецепта
  cookPerfectPct: 50, // «идеально» — эффект сильнее на столько %
  cookBadPct: 20, cookBadH: 2, // сырое или подгоревшее: −% пуговок в тех же играх на N часов
};
export const KITCHEN_RANGE = { cookPower: [0, 500], cookTime: [10, 500], cookPerfectPct: [0, 200], cookBadPct: [0, 100], cookBadH: [0, 24] };
export const KITCHEN_INT = ['cookPower', 'cookTime', 'cookPerfectPct', 'cookBadPct', 'cookBadH'];
export const KITCHEN_BOOL = ['cookOn'];

// игры с пуговками (kind в button_log): game — Пуговичный дождь, potion — Зельеварня, pan — Блинная, titos — Титос, shift — Смена
export const DISH_GAMES = ['game', 'potion', 'pan', 'titos', 'shift'];
// рецепт: need — урожай; t — эффект (btn: pct % пуговок в играх g; grow: +pct ч роста за полив; seed: шанс семечка +pct %); h — часов; win — секунды «готово» [от, до]
export const RECIPES = {
  radishsalad: { need: { radish: 2, lettuce: 1 }, t: 'btn', g: ['game'], pct: 25, h: 3, win: [4, 6.5] },
  carrotsoup: { need: { carrot: 2, cabbage: 1 }, t: 'btn', g: ['potion'], pct: 25, h: 3, win: [4.5, 7] },
  berrypancakes: { need: { strawberry: 2 }, t: 'btn', g: ['pan'], pct: 30, h: 3, win: [3.5, 6] },
  sunbread: { need: { sunflower: 2 }, t: 'btn', g: ['titos'], pct: 25, h: 3, win: [5, 7.5] },
  cabbagerolls: { need: { cabbage: 2, carrot: 1 }, t: 'btn', g: ['shift'], pct: 25, h: 4, win: [4.5, 7] },
  tulipteas: { need: { tulip: 2 }, t: 'grow', pct: 6, h: 24, win: [3, 5.5] },
  pumpkinpie: { need: { pumpkin: 1, strawberry: 1 }, t: 'btn', g: DISH_GAMES, pct: 15, h: 4, win: [5, 7] },
  rainbowcake: { need: { rainbowcarrot: 1, carrot: 1 }, t: 'seed', pct: 100, h: 6, win: [5, 7] },
  bluejam: { need: { bluerose: 1, strawberry: 1 }, t: 'btn', g: DISH_GAMES, pct: 30, h: 4, win: [5, 6.8] },
  goldsoup: { need: { goldpumpkin: 1, pumpkin: 1 }, t: 'btn', g: DISH_GAMES, pct: 50, h: 4, win: [5.5, 7.2] },
  starpudding: { need: { starberry: 1, strawberry: 1 }, t: 'seed', pct: 200, h: 6, win: [5, 6.6] },
  moontea: { need: { moonflower: 1, tulip: 1 }, t: 'grow', pct: 12, h: 24, win: [5, 6.6] },
  mandrakestew: { need: { mandrake: 1, cabbage: 1, radish: 1 }, t: 'btn', g: DISH_GAMES, pct: 100, h: 2, win: [6, 7.2] },
};
const PERFECT = .2; // «идеально» — средняя пятая часть окна «готово»
const LATE = 3000; // сколько сек после окна сковородка ещё на огне; дальше — подгорело само
const HOUR = 36e5;
const parse = (s, d) => { try { const v = JSON.parse(s); return v && typeof v === 'object' ? v : d; } catch (e) { return d; } };

// действующее блюдо птички (или null) — для award (index.js) и полива (garden.js)
export async function dishOf(env, uid) {
  const r = await env.DB.prepare('SELECT dish FROM kitchen WHERE user_id = ?').bind(uid).first().catch(() => null);
  const d = parse(r && r.dish, null);
  return d && d.until > Date.now() ? d : null;
}
// прибавка пуговок от блюда к награде игры (отрицательная — от неудачного блюда); 0 — блюдо ни при чём
export function dishBonus(d, kind, amount) {
  if (!d || d.t !== 'btn' || !(amount > 0) || !(d.g || []).includes(kind)) return 0;
  const x = amount * d.pct / 100;
  return d.pct > 0 ? Math.max(1, Math.round(x)) : -Math.min(amount - 1, Math.floor(-x));
}
// эффект по рецепту и качеству
function effectOf(R, key, q) {
  const r = RECIPES[key], now = Date.now();
  if (q === 'raw' || q === 'burnt') return { r: key, q, t: 'btn', g: r.t === 'btn' ? r.g : DISH_GAMES, pct: -R.cookBadPct, until: now + R.cookBadH * HOUR, at: now };
  const pct = Math.round(r.pct * R.cookPower / 100 * (q === 'perfect' ? 1 + R.cookPerfectPct / 100 : 1) * 10) / 10;
  return { r: key, q, t: r.t, g: r.g || [], pct, until: now + Math.round(r.h * R.cookTime / 100 * HOUR), at: now };
}
const quality = (key, ms) => {
  const [a, b] = RECIPES[key].win.map(s => s * 1000), mid = (a + b) / 2;
  if (ms < a) return 'raw';
  if (ms > b) return 'burnt';
  return Math.abs(ms - mid) <= (b - a) * PERFECT / 2 ? 'perfect' : 'good';
};

// h: json, fail, currentUser, needUser, rules, rigaDay
export async function kitchenApi(req, env, url, h) {
  const p = url.pathname, m = req.method, { json, fail } = h, R = h.rules(), now = Date.now();
  const rowOf = async uid => {
    let r = await env.DB.prepare('SELECT * FROM kitchen WHERE user_id = ?').bind(uid).first();
    if (!r) { await env.DB.prepare('INSERT OR IGNORE INTO kitchen (user_id, created_at) VALUES (?, ?)').bind(uid, now).run(); r = await env.DB.prepare('SELECT * FROM kitchen WHERE user_id = ?').bind(uid).first(); }
    return r;
  };
  const cropOf = async uid => parse(((await env.DB.prepare('SELECT crop FROM garden WHERE user_id = ?').bind(uid).first()) || {}).crop, {});
  const recipes = () => Object.fromEntries(Object.entries(RECIPES).map(([k, r]) => [k, { need: r.need, t: r.t, g: r.g || [], pct: Math.round(r.pct * R.cookPower) / 100, h: Math.round(r.h * R.cookTime) / 100, win: r.win }]));
  // съесть приготовленное: блюдо, книга, счётчик (с проверкой, что cook не поменялся)
  const finish = async (u, r, key, q) => {
    const d = effectOf(R, key, q), book = parse(r.book, {}), was = book[key] || { n: 0, best: '' }, rank = x => ['', 'raw', 'burnt', 'good', 'perfect'].indexOf(x);
    book[key] = { n: was.n + 1, best: rank(q) > rank(was.best) ? q : was.best };
    const res = await env.DB.prepare("UPDATE kitchen SET cook = '', dish = ?, book = ?, cooked = COALESCE(cooked, 0) + 1 WHERE user_id = ? AND cook = ?").bind(JSON.stringify(d), JSON.stringify(book), u.id, r.cook).run();
    if (!res.meta.changes) fail(409, 'busy');
    return d;
  };
  // брошенная готовка (страницу закрыли): после окна и LATE — подгорело
  const settle = async (u, r) => {
    const c = parse(r.cook, null);
    if (!c || !RECIPES[c.r] || now - c.t0 < RECIPES[c.r].win[1] * 1000 + LATE + 10000) return r;
    await finish(u, r, c.r, 'burnt').catch(() => null);
    return rowOf(u.id);
  };
  const state = async (u, r) => {
    const c = parse(r.cook, null), d = parse(r.dish, null);
    return { on: R.cookOn, recipes: recipes(), crop: await cropOf(u.id), book: parse(r.book, {}), cooked: r.cooked || 0,
      dish: d && d.until > now ? d : null, last: d, cook: c && RECIPES[c.r] ? { r: c.r, el: Math.max(0, Date.now() - c.t0) } : null, late: LATE, perfect: PERFECT };
  };
  if (m === 'GET' && p === '/api/kitchen') {
    const u = await h.currentUser(req, env);
    if (!u || !u.nick) return json({ on: R.cookOn, recipes: recipes(), guest: true });
    const r = await settle(u, await rowOf(u.id));
    return json(await state(u, r));
  }
  if (m !== 'POST' || !p.startsWith('/api/kitchen/')) return null;
  const u = await h.needUser(req, env);
  if (!u.nick || u.banned) fail(400, 'nick');
  const b = await req.json().catch(() => ({}));
  let r = await settle(u, await rowOf(u.id));
  if (p === '/api/kitchen/start') {
    const key = String(b.recipe || ''), rec = RECIPES[key];
    if (!rec) fail(400, 'recipe');
    if (!R.cookOn) fail(403, 'off');
    if (parse(r.cook, null)) fail(409, 'cooking');
    const d = parse(r.dish, null);
    if (d && d.until > now) fail(409, 'full'); // одно блюдо за раз
    const g = await env.DB.prepare('SELECT crop FROM garden WHERE user_id = ?').bind(u.id).first(), crop = parse(g && g.crop, {});
    for (const [k, n] of Object.entries(rec.need)) if ((crop[k] || 0) < n) fail(409, 'nocrop');
    for (const [k, n] of Object.entries(rec.need)) { crop[k] -= n; if (!crop[k]) delete crop[k]; }
    const q = await env.DB.prepare('UPDATE garden SET crop = ? WHERE user_id = ? AND crop = ?').bind(JSON.stringify(crop), u.id, g.crop).run();
    if (!q.meta.changes) fail(409, 'busy');
    const c = JSON.stringify({ r: key, t0: Date.now() });
    await env.DB.prepare("UPDATE kitchen SET cook = ? WHERE user_id = ?").bind(c, u.id).run();
    return json({ ok: true, ...(await state(u, { ...r, cook: c })) });
  }
  if (p === '/api/kitchen/done') { // ms — сколько сковородка была на огне по часам браузера (не больше, чем у сервера, и не меньше чем на 3 с)
    const c = parse(r.cook, null);
    if (!c || !RECIPES[c.r]) fail(409, 'nocook');
    const el = Date.now() - c.t0, ms = Number(b.ms), use = Number.isFinite(ms) ? Math.max(el - 3000, Math.min(el, ms)) : el;
    const q = quality(c.r, use), d = await finish(u, r, c.r, q);
    return json({ ok: true, q, ate: d, ...(await state(u, await rowOf(u.id))) });
  }
  return null;
}
