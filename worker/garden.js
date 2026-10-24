// Огород птички (этап 22, /garden/, site/assets/garden.js, docs/bird.md «Огород»): грядки, семена, полив раз в сутки, таймер роста, урожай за пуговки, жуки.
// Растёт только политое: полив даёт gardenWetH часов влаги, рост копится, пока земля мокрая; полить грядку можно раз в сутки по Риге.
// Жуки: каждый день у птички 0…gardenBugMax жуков (шанс gardenBugChance %), каждый вылезает в свой час суток — собрать = gardenBugBtn 🔘.
// Этап 23: семена из игр (gardenDrop — из award в worker/index.js), редкие — раз в gardenRareDays дней подряд с ≥ dayBonusNeed штампами карточки дня,
// волшебные — раз в gardenMagicDays дней подряд с поливом; найденное копится в found → новость «🌱» (gardenNews) до захода в огород. Вещи для огорода — подарки вида garden (site/assets/garden-items.js).
// API: GET /api/garden?nick=, POST /api/garden/{plant,water,harvest,sell,buy,bug,hide}.

export const GARDEN_TABLES = [
  // beds — JSON [{p: растение, t: посажено, g: накоплено роста (мс) к моменту w, w: последний полив} | null]; seeds/crop — {растение: штук}
  // bug_day / bug_got — жуки: за какой день и какие номера уже собраны; harvests — собрано урожаев всего
  "CREATE TABLE IF NOT EXISTS garden (user_id INTEGER PRIMARY KEY, beds TEXT DEFAULT '[]', seeds TEXT DEFAULT '{}', crop TEXT DEFAULT '{}', bug_day TEXT DEFAULT '', bug_got TEXT DEFAULT '[]', harvests INTEGER DEFAULT 0, bugs INTEGER DEFAULT 0, created_at INTEGER)",
];
// found — JSON [{p, src, at}] найденные семена, о которых птичка ещё не знает (src: game/potion/pan/titos/shift/bugs, rare, magic); drop_day/drop_n — сколько семян из игр сегодня
// rare_day/magic_day — день последней награды (серия считается после него); water_days — JSON дней с поливом (последние 40); hide — JSON спрятанных вещей огорода
export const GARDEN_ALTER = ["ALTER TABLE garden ADD COLUMN found TEXT DEFAULT '[]'", "ALTER TABLE garden ADD COLUMN drop_day TEXT DEFAULT ''", 'ALTER TABLE garden ADD COLUMN drop_n INTEGER DEFAULT 0',
  "ALTER TABLE garden ADD COLUMN rare_day TEXT DEFAULT ''", "ALTER TABLE garden ADD COLUMN magic_day TEXT DEFAULT ''", "ALTER TABLE garden ADD COLUMN water_days TEXT DEFAULT '[]'", "ALTER TABLE garden ADD COLUMN hide TEXT DEFAULT '[]'"];
export const GARDEN_RULES = {
  gardenOn: true, gardenBeds: 6, gardenWetH: 24, // грядок; сколько часов земля мокрая после полива (рост идёт только по мокрой)
  gardenSeedPct: 1, gardenSellPct: 3, // семя и урожай — % опорной цены за каждый день роста растения
  gardenStarter: 2, // семян каждого простого растения (1–2 дня роста) при первом заходе в огород
  gardenBugMax: 3, gardenBugChance: 60, gardenBugBtn: 1, // жуков в день до N (бывает и 0: шанс, что жуки вообще будут), пуговок за жука
  gardenDropPct: 10, gardenDropDay: 3, // семечко в награду в игре: шанс % за каждую награду пуговками, не больше N в сутки
  gardenRareDays: 7, gardenMagicDays: 7, // редкое семечко — за N дней подряд с бонусом карточки дня; волшебное — за N дней подряд с поливом
  gardenRareMul: 3, gardenMagicMul: 5, // урожай редких и волшебных дороже простого во столько раз
  gardenSeason: 'auto', // погода и вид: auto — по календарю (дек–фев зима, мар–май весна, июн–авг лето, сен–ноя осень)
};
export const GARDEN_RANGE = { gardenDropPct: [0, 100], gardenDropDay: [0, 20], gardenRareDays: [1, 30], gardenMagicDays: [1, 30], gardenRareMul: [1, 20], gardenMagicMul: [1, 20], gardenBeds: [1, 12], gardenWetH: [1, 72], gardenSeedPct: [0, 100], gardenSellPct: [0, 100], gardenStarter: [0, 20], gardenBugMax: [0, 10], gardenBugChance: [0, 100], gardenBugBtn: [0, 100] };
export const GARDEN_INT = ['gardenDropDay', 'gardenRareDays', 'gardenMagicDays', 'gardenBeds', 'gardenWetH', 'gardenStarter', 'gardenBugMax', 'gardenBugChance', 'gardenBugBtn'];
export const GARDEN_BOOL = ['gardenOn'];
export const GARDEN_SEASONS = ['auto', 'autumn', 'winter', 'spring', 'summer'];

// растения: дней роста (политых суток); названия и рисунки — site/assets/garden.js. Редкие и волшебные (этап 23) в лавке не продаются.
export const CROPS = { radish: 1, lettuce: 1, carrot: 2, tulip: 2, strawberry: 3, sunflower: 3, cabbage: 3, pumpkin: 4,
  rainbowcarrot: 3, bluerose: 4, goldpumpkin: 5, // редкие
  starberry: 3, moonflower: 4, mandrake: 5 }; // волшебные
export const TIER = { rainbowcarrot: 'rare', bluerose: 'rare', goldpumpkin: 'rare', starberry: 'magic', moonflower: 'magic', mandrake: 'magic' };
const SIMPLE = Object.keys(CROPS).filter(k => !TIER[k]);
const ofTier = t => Object.keys(TIER).filter(k => TIER[k] === t);
const starter = R => R.gardenStarter > 0 ? Object.fromEntries(SIMPLE.filter(k => CROPS[k] <= 2).map(k => [k, R.gardenStarter])) : {}; // семена при первом заходе
const sellMul = (R, k) => TIER[k] === 'rare' ? R.gardenRareMul : TIER[k] === 'magic' ? R.gardenMagicMul : 1;
const back = (day, n) => { const d = new Date(day + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() - n); return d.toISOString().slice(0, 10); };
// дней подряд в set: с сегодняшнего (если он уже есть) или со вчерашнего, но только после дня последней награды after
const run = (set, today, after) => { let n = 0; for (let i = set.has(today) ? 0 : 1; i < 60; i++) { const d = back(today, i); if ((after && d <= after) || !set.has(d)) break; n++; } return n; };
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
  const prices = () => Object.fromEntries(Object.entries(CROPS).map(([k, d]) => [k, { days: d, seed: TIER[k] ? null : h.btnOf(R.gardenSeedPct * d, unit), sell: h.btnOf(R.gardenSellPct * d * sellMul(R, k), unit), tier: TIER[k] || '' }]));
  const rowOf = async uid => {
    let r = await env.DB.prepare('SELECT * FROM garden WHERE user_id = ?').bind(uid).first();
    if (!r) {
      const seeds = starter(R);
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
  // вещи для огорода: свои (в сумке) — стоят сами, кроме спрятанных
  const itemsOf = async uid => [...new Set((await env.DB.prepare("SELECT item FROM gifts WHERE user_id = ? AND kind = 'garden' AND status = 'bag'").bind(uid).all()).results.map(r => r.item))];
  // редкое и волшебное семечко: серии дней и награда, когда серия набрана (раз за серию: следующая считается с дня награды)
  const weekly = async (uid, s) => {
    const today = h.rigaDay(), r = s.row, out = {};
    const five = new Set((await env.DB.prepare("SELECT day FROM button_log WHERE user_id = ? AND kind = 'stamp' AND ref LIKE '%:five' AND day >= ?").bind(uid, back(today, 45)).all()).results.map(x => x.day));
    const wet = new Set(parse(r.water_days, []));
    for (const [t, set, need, col] of [['rare', five, R.gardenRareDays, 'rare_day'], ['magic', wet, R.gardenMagicDays, 'magic_day']]) {
      const n = run(set, today, r[col] || '');
      if (R.gardenOn && n >= need) {
        const list = ofTier(t), p = list[fnv(uid + ':' + today + ':' + t) % list.length], seeds = { ...s.seeds, [p]: (s.seeds[p] || 0) + 1 }, found = [...parse(r.found, []), { p, src: t, at: now }].slice(-10);
        const q = await env.DB.prepare(`UPDATE garden SET seeds = ?, found = ?, ${col} = ? WHERE user_id = ? AND seeds = ? AND COALESCE(${col}, '') = ?`).bind(JSON.stringify(seeds), JSON.stringify(found), today, uid, r.seeds, r[col] || '').run();
        if (q.meta.changes) { s.seeds = seeds; r.seeds = JSON.stringify(seeds); r.found = JSON.stringify(found); r[col] = today; }
        out[t] = { n: 0, need, got: p };
      } else out[t] = { n: Math.min(n, need), need };
    }
    return out;
  };
  const state = async (u, s) => {
    const today = h.rigaDay(), all = bugsOf(u.id, today, R);
    return { on: R.gardenOn, beds: s.beds.map(b => view(b, today)), seeds: s.seeds, crop: s.crop, prices: prices(), bugs: bugsView(u.id, s.got),
      bugsGot: s.got.length, bugsLater: all.some(b => b.at > now), bugBtn: R.gardenBugBtn, wetH: R.gardenWetH, season: seasonOf(R, today), today,
      harvests: s.row.harvests || 0, buttons: u.buttons || 0, items: await itemsOf(u.id), hide: parse(s.row.hide, []) };
  };
  if (m === 'GET' && p === '/api/garden') {
    const me = await h.currentUser(req, env), nick = (url.searchParams.get('nick') || '').replace(/^@/, '');
    const u = nick ? await env.DB.prepare('SELECT * FROM users WHERE nick = ? AND banned = 0').bind(nick).first() : me && me.nick ? me : null;
    if (!u || !u.nick) return json({ on: R.gardenOn, season: seasonOf(R, h.rigaDay()), today: h.rigaDay(), owner: null, mine: false });
    const mine = !!(me && me.id === u.id);
    const owner = { id: u.id, nick: u.nick, avatar: h.avatarOf(u) };
    if (!mine) { // гость видит грядки, но не трогает; огорода ещё нет — пустые грядки
      const r = await env.DB.prepare('SELECT beds, hide FROM garden WHERE user_id = ?').bind(u.id).first(), today = h.rigaDay();
      const beds = Array.from({ length: R.gardenBeds }, (_, i) => view(parse(r && r.beds, [])[i], today)), hide = parse(r && r.hide, []);
      return json({ on: R.gardenOn, owner, mine, beds, season: seasonOf(R, today), today, prices: prices(), items: (await itemsOf(u.id)).filter(v => !hide.includes(v)) });
    }
    const s = await rowOf(u.id), week = await weekly(u.id, s), found = parse(s.row.found, []);
    if (found.length) await env.DB.prepare("UPDATE garden SET found = '[]' WHERE user_id = ?").bind(u.id).run(); // новость «🌱» прочитана: птичка в огороде
    return json({ ...(await state(u, s)), owner, mine, week, found });
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
    const wd = parse(r0.water_days, []); if (!wd.includes(today)) wd.push(today); // дни с поливом — для волшебного семечка
    await save({ beds: s.beds, water_days: wd.slice(-40) });
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
    const each = h.btnOf(R.gardenSellPct * CROPS[k] * sellMul(R, k), unit);
    s.crop[k] = have - n; if (!s.crop[k]) delete s.crop[k];
    await save({ crop: s.crop });
    const got = each > 0 ? await h.award(u.id, 'gsell', k + ':' + now + ':' + h.randomHex(4), each * n) : 0;
    return out({ got });
  }
  if (p === '/api/garden/hide') { // спрятать вещь огорода (on: true) или вернуть на место
    const v = String(b.item || ''), hide = parse(r0.hide, []).filter(x => x !== v);
    if (b.on) hide.push(v);
    await env.DB.prepare('UPDATE garden SET hide = ? WHERE user_id = ?').bind(JSON.stringify(hide.slice(-40)), u.id).run();
    return out();
  }
  if (p === '/api/garden/buy') { // семена простых растений — за пуговки (здесь и в магазине); редкие и волшебные не продаются
    const k = String(b.seed || ''), n = Math.max(1, Math.min(20, Math.floor(Number(b.n) || 1)));
    if (!CROPS[k] || TIER[k]) fail(400, 'seed');
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

// семечко в награду в игре (worker/index.js award): шанс gardenDropPct, не больше gardenDropDay в сутки; простое случайное → в семена и в found (новость)
export async function gardenDrop(env, uid, src, R, day) {
  if (!R.gardenOn || !(R.gardenDropPct > 0) || !(R.gardenDropDay > 0) || Math.random() * 100 >= R.gardenDropPct) return null;
  let r = await env.DB.prepare('SELECT seeds, found, drop_day, drop_n FROM garden WHERE user_id = ?').bind(uid).first();
  if (!r) { // огорода ещё нет — заводим, как при первом заходе
    await env.DB.prepare('INSERT OR IGNORE INTO garden (user_id, seeds, created_at) VALUES (?, ?, ?)').bind(uid, JSON.stringify(starter(R)), Date.now()).run();
    r = await env.DB.prepare('SELECT seeds, found, drop_day, drop_n FROM garden WHERE user_id = ?').bind(uid).first();
  }
  const n = r.drop_day === day ? r.drop_n || 0 : 0;
  if (n >= R.gardenDropDay) return null;
  const p = SIMPLE[Math.floor(Math.random() * SIMPLE.length)], seeds = parse(r.seeds, {}), found = [...parse(r.found, []), { p, src, at: Date.now() }].slice(-10);
  seeds[p] = (seeds[p] || 0) + 1;
  const q = await env.DB.prepare("UPDATE garden SET seeds = ?, found = ?, drop_day = ?, drop_n = ? WHERE user_id = ? AND seeds = ? AND COALESCE(drop_day, '') = ? AND COALESCE(drop_n, 0) = ?")
    .bind(JSON.stringify(seeds), JSON.stringify(found), day, n + 1, uid, r.seeds, r.drop_day || '', r.drop_n || 0).run();
  return q.meta.changes ? p : null;
}
// новость «🌱» (NEWS_KINDS в worker/index.js): найденные семена, пока птичка не зашла в огород
export async function gardenNews(env, uid) {
  const r = await env.DB.prepare('SELECT found FROM garden WHERE user_id = ?').bind(uid).first().catch(() => null);
  const f = parse(r && r.found, []);
  if (!Array.isArray(f) || !f.length) return null;
  const last = f[f.length - 1];
  return { n: f.length, src: last.src, tier: f.some(x => TIER[x.p] === 'magic') ? 'magic' : f.some(x => TIER[x.p] === 'rare') ? 'rare' : '' };
}
