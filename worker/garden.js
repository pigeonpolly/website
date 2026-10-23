// Огород птички (этап 22, /garden/, site/assets/garden.js, docs/bird.md «Огород»): грядки, семена, полив раз в сутки, таймер роста, урожай за пуговки, жуки.
// Растёт только политое: полив даёт gardenWetH часов влаги, рост копится, пока земля мокрая; полить грядку можно раз в сутки по Риге.
// Жуки: каждый день у птички 0…gardenBugMax жуков (шанс gardenBugChance %), каждый вылезает в свой час суток — собрать = gardenBugBtn 🔘.
// API: GET /api/garden?nick=, POST /api/garden/{plant,water,harvest,sell,buy,bug}.

export const GARDEN_TABLES = [
  // beds — JSON [{p: растение, t: посажено, g: накоплено роста (мс) к моменту w, w: последний полив} | null]; seeds/crop — {растение: штук}
  // bug_day / bug_got — жуки: за какой день и какие номера уже собраны; harvests — собрано урожаев всего
  "CREATE TABLE IF NOT EXISTS garden (user_id INTEGER PRIMARY KEY, beds TEXT DEFAULT '[]', seeds TEXT DEFAULT '{}', crop TEXT DEFAULT '{}', bug_day TEXT DEFAULT '', bug_got TEXT DEFAULT '[]', harvests INTEGER DEFAULT 0, bugs INTEGER DEFAULT 0, created_at INTEGER)",
];
export const GARDEN_RULES = {
  gardenOn: true, gardenBeds: 6, gardenWetH: 24, // грядок; сколько часов земля мокрая после полива (рост идёт только по мокрой)
  gardenSeedPct: 1, gardenSellPct: 3, // семя и урожай — % опорной цены за каждый день роста растения
  gardenStarter: 2, // семян каждого простого растения (1–2 дня роста) при первом заходе в огород
  gardenBugMax: 3, gardenBugChance: 60, gardenBugBtn: 1, // жуков в день до N (бывает и 0: шанс, что жуки вообще будут), пуговок за жука
  gardenSeason: 'auto', // погода и вид: auto — по календарю (дек–фев зима, мар–май весна, июн–авг лето, сен–ноя осень)
};
export const GARDEN_RANGE = { gardenBeds: [1, 12], gardenWetH: [1, 72], gardenSeedPct: [0, 100], gardenSellPct: [0, 100], gardenStarter: [0, 20], gardenBugMax: [0, 10], gardenBugChance: [0, 100], gardenBugBtn: [0, 100] };
export const GARDEN_INT = ['gardenBeds', 'gardenWetH', 'gardenStarter', 'gardenBugMax', 'gardenBugChance', 'gardenBugBtn'];
export const GARDEN_BOOL = ['gardenOn'];
export const GARDEN_SEASONS = ['auto', 'autumn', 'winter', 'spring', 'summer'];

// растения: дней роста (политых суток); названия и рисунки — site/assets/garden.js. Редкие и волшебные семена — этап 23.
export const CROPS = { radish: 1, lettuce: 1, carrot: 2, tulip: 2, strawberry: 3, sunflower: 3, cabbage: 3, pumpkin: 4 };
const DAY = 864e5, HOUR = 36e5;

const parse = (s, d) => { try { const v = JSON.parse(s); return v && typeof v === 'object' ? v : d; } catch (e) { return d; } };
const fnv = str => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const dayOf = ms => new Date(ms).toLocaleDateString('sv-SE', { timeZone: 'Europe/Riga' });
// сколько роста у грядки сейчас (мс): накопленное + мокрое время с последнего полива
export const grown = (b, now, wetH) => !b ? 0 : (b.g || 0) + (b.w ? Math.max(0, Math.min(now - b.w, wetH * HOUR)) : 0);
// жуки дня: [{i, at, bed}] — сколько и когда вылезают, одинаково при каждом запросе (от птички и дня)
export function bugsOf(uid, day, R) {
  const h = fnv(uid + ':' + day + ':bugs');
  if (R.gardenBugMax < 1 || h % 100 >= R.gardenBugChance) return [];
  const n = 1 + fnv(day + ':n:' + uid) % R.gardenBugMax, start = Date.parse(day + 'T00:00:00Z') - 3 * HOUR; // полночь по Риге (± час летом — не важно)
  return Array.from({ length: n }, (_, i) => { const x = fnv(uid + ':' + day + ':' + i); return { i, at: start + (7 + x % 14) * HOUR + (x >>> 8) % 60 * 6e4, bed: (x >>> 16) % 64, x: (x >>> 4) % 100 }; });
}

// h: json, fail, currentUser, needUser, rules, rigaDay, unit, btnOf, award, avatarOf, now
export async function gardenApi(req, env, url, h) {
  const p = url.pathname, m = req.method, { json, fail } = h, R = h.rules(), now = Date.now();
  const unit = await h.unit();
  const prices = () => Object.fromEntries(Object.entries(CROPS).map(([k, d]) => [k, { days: d, seed: h.btnOf(R.gardenSeedPct * d, unit), sell: h.btnOf(R.gardenSellPct * d, unit) }]));
  const rowOf = async uid => {
    let r = await env.DB.prepare('SELECT * FROM garden WHERE user_id = ?').bind(uid).first();
    if (!r) {
      const seeds = R.gardenStarter > 0 ? Object.fromEntries(Object.entries(CROPS).filter(([, d]) => d <= 2).map(([k]) => [k, R.gardenStarter])) : {};
      await env.DB.prepare('INSERT OR IGNORE INTO garden (user_id, seeds, created_at) VALUES (?, ?, ?)').bind(uid, JSON.stringify(seeds), now).run();
      r = await env.DB.prepare('SELECT * FROM garden WHERE user_id = ?').bind(uid).first();
    }
    const beds = parse(r.beds, []); beds.length = R.gardenBeds; // грядок стало меньше в правилах — лишние пропадают при следующей записи
    return { row: r, beds: Array.from(beds, b => b || null), seeds: parse(r.seeds, {}), crop: parse(r.crop, {}), got: r.bug_day === h.rigaDay() ? parse(r.bug_got, []) : [] };
  };
  // как грядка выглядит для браузера: растение, сколько выросло (0…1), сколько осталось, полита ли сегодня, мокрая ли земля
  const view = (b, today) => {
    if (!b || !CROPS[b.p]) return null;
    const need = CROPS[b.p] * DAY, gr = grown(b, now, R.gardenWetH);
    return { p: b.p, k: Math.min(1, gr / need), left: Math.max(0, need - gr), wet: !!b.w && now - b.w < R.gardenWetH * HOUR, today: !!b.w && dayOf(b.w) === today, ready: gr >= need };
  };
  const bugsView = (uid, got) => bugsOf(uid, h.rigaDay(), R).filter(b => b.at <= now && !got.includes(b.i)).map(b => ({ i: b.i, bed: b.bed % R.gardenBeds, x: b.x }));
  const state = async (u, s) => {
    const today = h.rigaDay(), all = bugsOf(u.id, today, R);
    return { on: R.gardenOn, beds: s.beds.map(b => view(b, today)), seeds: s.seeds, crop: s.crop, prices: prices(), bugs: bugsView(u.id, s.got),
      bugsGot: s.got.length, bugsLater: all.some(b => b.at > now), bugBtn: R.gardenBugBtn, wetH: R.gardenWetH, season: seasonOf(R, today), today,
      harvests: s.row.harvests || 0, buttons: u.buttons || 0 };
  };
  if (m === 'GET' && p === '/api/garden') {
    const me = await h.currentUser(req, env), nick = (url.searchParams.get('nick') || '').replace(/^@/, '');
    const u = nick ? await env.DB.prepare('SELECT * FROM users WHERE nick = ? AND banned = 0').bind(nick).first() : me && me.nick ? me : null;
    if (!u || !u.nick) return json({ on: R.gardenOn, season: seasonOf(R, h.rigaDay()), today: h.rigaDay(), owner: null, mine: false });
    const mine = !!(me && me.id === u.id);
    const owner = { id: u.id, nick: u.nick, avatar: h.avatarOf(u) };
    if (!mine) { // гость видит грядки, но не трогает; огорода ещё нет — пустые грядки
      const r = await env.DB.prepare('SELECT beds FROM garden WHERE user_id = ?').bind(u.id).first(), today = h.rigaDay();
      const beds = Array.from({ length: R.gardenBeds }, (_, i) => view(parse(r && r.beds, [])[i], today));
      return json({ on: R.gardenOn, owner, mine, beds, season: seasonOf(R, today), today, prices: prices() });
    }
    return json({ ...(await state(u, await rowOf(u.id))), owner, mine });
  }
  if (m !== 'POST' || !p.startsWith('/api/garden/')) return null;
  const u = await h.needUser(req, env);
  if (!u.nick || u.banned) fail(400, 'nick');
  const b = await req.json().catch(() => ({}));
  const s = await rowOf(u.id), r0 = s.row;
  const i = Math.floor(Number(b.bed));
  const bedOk = () => { if (!(i >= 0 && i < R.gardenBeds)) fail(400, 'bed'); };
  // запись с проверкой, что огород не поменялся в другой вкладке (иначе 409 — браузер перезагрузит)
  const save = async (patch, extra = '') => {
    const keys = Object.keys(patch), vals = keys.map(k => typeof patch[k] === 'object' ? JSON.stringify(patch[k]) : patch[k]);
    const q = await env.DB.prepare(`UPDATE garden SET ${keys.map(k => k + ' = ?').join(', ')}${extra} WHERE user_id = ? AND beds = ? AND seeds = ? AND crop = ?`).bind(...vals, u.id, r0.beds, r0.seeds, r0.crop).run();
    if (!q.meta.changes) fail(409, 'busy');
  };
  const out = async (more = {}) => { const fresh = await env.DB.prepare('SELECT buttons FROM users WHERE id = ?').bind(u.id).first(); return json({ ok: true, ...more, ...(await state({ ...u, buttons: (fresh || {}).buttons || 0 }, await rowOf(u.id))) }); };
  if (p === '/api/garden/plant') {
    bedOk();
    const k = String(b.seed || '');
    if (!CROPS[k]) fail(400, 'seed');
    if (s.beds[i]) fail(409, 'taken');
    if (!(s.seeds[k] > 0)) fail(409, 'noseed');
    s.beds[i] = { p: k, t: now, g: 0, w: 0 };
    s.seeds[k]--; if (!s.seeds[k]) delete s.seeds[k];
    await save({ beds: s.beds, seeds: s.seeds });
    return out();
  }
  if (p === '/api/garden/water') { // одну грядку (bed) или все (all: true) — каждую раз в сутки по Риге
    const today = h.rigaDay(), list = b.all ? s.beds.map((_, j) => j) : (bedOk(), [i]);
    let n = 0;
    for (const j of list) {
      const x = s.beds[j];
      if (!x || !CROPS[x.p] || (x.w && dayOf(x.w) === today) || grown(x, now, R.gardenWetH) >= CROPS[x.p] * DAY) continue;
      x.g = grown(x, now, R.gardenWetH); x.w = now; n++;
    }
    if (!n) fail(409, 'watered');
    await save({ beds: s.beds });
    return out({ watered: n });
  }
  if (p === '/api/garden/harvest') {
    bedOk();
    const x = s.beds[i];
    if (!x || !CROPS[x.p]) fail(409, 'empty');
    if (grown(x, now, R.gardenWetH) < CROPS[x.p] * DAY) fail(409, 'growing');
    s.beds[i] = null; s.crop[x.p] = (s.crop[x.p] || 0) + 1;
    await save({ beds: s.beds, crop: s.crop }, ', harvests = COALESCE(harvests, 0) + 1');
    return out({ harvested: x.p });
  }
  if (p === '/api/garden/sell') { // весь урожай одного вида (или n штук)
    const k = String(b.crop || ''), have = s.crop[k] || 0, n = Math.min(have, Math.max(1, Math.floor(Number(b.n) || have)));
    if (!CROPS[k] || !have) fail(409, 'nocrop');
    if (!R.gardenOn) fail(403, 'off');
    const each = h.btnOf(R.gardenSellPct * CROPS[k], unit);
    s.crop[k] = have - n; if (!s.crop[k]) delete s.crop[k];
    await save({ crop: s.crop });
    const got = each > 0 ? await h.award(u.id, 'gsell', k + ':' + now + ':' + h.randomHex(4), each * n) : 0;
    return out({ got });
  }
  if (p === '/api/garden/buy') { // семена простых растений — за пуговки (редкие и волшебные — этап 23)
    const k = String(b.seed || ''), n = Math.max(1, Math.min(20, Math.floor(Number(b.n) || 1)));
    if (!CROPS[k]) fail(400, 'seed');
    const cost = h.btnOf(R.gardenSeedPct * CROPS[k], unit) * n;
    if (cost > 0) {
      const q = await env.DB.prepare('UPDATE users SET buttons = COALESCE(buttons, 0) - ? WHERE id = ? AND COALESCE(buttons, 0) >= ?').bind(cost, u.id, cost).run();
      if (!q.meta.changes) fail(402, 'poor');
      await env.DB.prepare('INSERT OR IGNORE INTO button_log (user_id, kind, ref, amount, day, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(u.id, 'gseed', k + ':' + now + ':' + h.randomHex(4), -cost, h.rigaDay(), h.now()).run();
    }
    s.seeds[k] = (s.seeds[k] || 0) + n;
    await env.DB.prepare('UPDATE garden SET seeds = ? WHERE user_id = ?').bind(JSON.stringify(s.seeds), u.id).run();
    return out({ paid: cost });
  }
  if (p === '/api/garden/bug') {
    const today = h.rigaDay(), bug = bugsOf(u.id, today, R).find(x => x.i === Math.floor(Number(b.i)));
    if (!bug || bug.at > now) fail(404, 'bug');
    if (s.got.includes(bug.i)) fail(409, 'got');
    const got = [...s.got, bug.i];
    const q = await env.DB.prepare('UPDATE garden SET bug_day = ?, bug_got = ?, bugs = COALESCE(bugs, 0) + 1 WHERE user_id = ? AND bug_day = ? AND bug_got = ?')
      .bind(today, JSON.stringify(got), u.id, r0.bug_day || '', r0.bug_got || '[]').run();
    if (!q.meta.changes) fail(409, 'busy');
    const btn = R.gardenOn && R.gardenBugBtn > 0 ? await h.award(u.id, 'gbug', today + ':' + bug.i, R.gardenBugBtn) : 0;
    return out({ got: btn });
  }
  return null;
}

// погода по сезону: сезон из правил или по месяцу в Риге
export function seasonOf(R, day) {
  if (R.gardenSeason && R.gardenSeason !== 'auto') return R.gardenSeason;
  const mo = +day.slice(5, 7);
  return mo === 12 || mo <= 2 ? 'winter' : mo <= 5 ? 'spring' : mo <= 8 ? 'summer' : 'autumn';
}
