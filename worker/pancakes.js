// «Блинная Полли» (/pancakes/, site/assets/pancakes.js, docs/games.md): Полли печёт блины жителям Воббленда, уровни бесконечные.
// Как «Пуговичный дождь»: забег (pan_runs), уровни подтверждаются по одному и не быстрее panMinSec с на уровень от старта;
// пуговки за уровень × (1 + десяток), каждый номер уровня — раз в сутки; бонус за новый рекорд; вещь каждые panItemEvery уровней.
// Каждые panWashEvery уровней сковородку надо помыть: средство — panSoapBtn 🔘 (POST /api/pancakes/wash), без мытья следующий уровень не засчитывается.
// Прокачка (этап 25): старт с пройденного рубежа (каждые panStartEvery уровней, не выше рекорда) и постоянные улучшения за пуговки — users.pan_up (JSON {hot, heart, pat, spare}),
// N-й уровень улучшения стоит N × цена (panUp*Pct % опорной цены); spare — запасные сковородки: вместо мытья (POST /api/pancakes/wash {spare: true}), сколько за игру.
// API: GET /api/pancakes, POST /api/pancakes/{start,level,wash,up}.

export const PAN_TABLES = [
  // level — пройдено уровней в забеге; washed — сколько раз помыта сковородка; stars — сколько клиентов «в восторге» (для бейджа panstar)
  // base — с какого рубежа начат забег (уровней «уже пройдено»); spare — сколько запасных сковородок взято вместо мытья
  'CREATE TABLE IF NOT EXISTS pan_runs (id TEXT PRIMARY KEY, user_id INTEGER NOT NULL, started INTEGER NOT NULL, level INTEGER DEFAULT 0, washed INTEGER DEFAULT 0, stars INTEGER DEFAULT 0, base INTEGER DEFAULT 0, spare INTEGER DEFAULT 0)',
];
export const PAN_ALTER = ['ALTER TABLE users ADD COLUMN pan_best INTEGER DEFAULT 0', 'ALTER TABLE users ADD COLUMN pan_best_at INTEGER', 'ALTER TABLE users ADD COLUMN pan_washes INTEGER DEFAULT 0',
  "ALTER TABLE users ADD COLUMN pan_up TEXT DEFAULT ''", 'ALTER TABLE pan_runs ADD COLUMN base INTEGER DEFAULT 0', 'ALTER TABLE pan_runs ADD COLUMN spare INTEGER DEFAULT 0'];
export const PAN_RULES = {
  panOn: true, panLevelPct: 2, panRecordPct: 4, // пуговки за уровень (× (1 + ⌊(ур−1)/10⌋)) и за каждый уровень выше прежнего рекорда — % опорной цены
  panMinSec: 8, panItemEvery: 25, // уровень быстрее N с (от старта, на каждый уровень) не засчитывается; вещь из магазина каждые N уровней (0 — выкл.)
  panWashEvery: 10, panSoapBtn: 1, // мыть сковородку каждые N уровней; средство для мытья — N 🔘
  panStartEvery: 10, // рубежи для старта не с 1-го уровня: каждые N пройденных (0 — всегда с 1-го)
  panUpHotPct: 60, panUpHeartPct: 150, panUpPatPct: 60, panUpSparePct: 80, // цена 1-го уровня улучшения, % опорной цены (N-й уровень — ×N)
};
// улучшения: max — сколько уровней; что дают — в site/assets/pancakes.js (UPS)
export const PAN_UPS = { hot: { max: 3, pct: 'panUpHotPct' }, heart: { max: 2, pct: 'panUpHeartPct' }, pat: { max: 3, pct: 'panUpPatPct' }, spare: { max: 2, pct: 'panUpSparePct' } };
const upsOf = u => { let o = {}; try { o = JSON.parse(u.pan_up || '{}') || {}; } catch (e) {} return Object.fromEntries(Object.entries(PAN_UPS).map(([k, x]) => [k, Math.max(0, Math.min(x.max, Math.floor(Number(o[k]) || 0)))])); };
export const PAN_RANGE = { panLevelPct: [0, 100], panRecordPct: [0, 100], panMinSec: [1, 120], panItemEvery: [0, 1000], panWashEvery: [2, 100], panSoapBtn: [0, 100],
  panStartEvery: [0, 100], panUpHotPct: [0, 10000], panUpHeartPct: [0, 10000], panUpPatPct: [0, 10000], panUpSparePct: [0, 10000] };
export const PAN_INT = ['panMinSec', 'panItemEvery', 'panWashEvery', 'panSoapBtn', 'panStartEvery'];
// бейджи (пуговки — RULES.badges, условия — RULES.cond): уровни panA/panB/panC, panstar — panStar клиентов «в восторге» за одну игру, panwash — первая помытая со средством сковородка
export const PAN_BADGES = { pan1: 10, pan2: 20, pan3: 40, panstar: 25, panwash: 5 };
export const PAN_COND = { panA: 5, panB: 15, panC: 30, panStar: 10 };

const TOP = 'SELECT id, nick, avatar, pan_best FROM users WHERE pan_best > 0 AND banned = 0 AND nick IS NOT NULL ORDER BY pan_best DESC, COALESCE(pan_best_at, 0), id LIMIT ';

// h: json, fail, currentUser, needUser, rules, rigaDay, unit, btnOf, award, avatarOf, top(uid, n), badge(u, k), item(req, uid, note), randomHex, now
export async function pancakesApi(req, env, url, h) {
  const p = url.pathname, m = req.method, { json, fail } = h, R = h.rules();
  const price = (unit, lv) => h.btnOf(R.panLevelPct, unit) * (1 + Math.floor((lv - 1) / 10));
  const today = async uid => (await env.DB.prepare("SELECT COALESCE(SUM(amount), 0) AS n FROM button_log WHERE user_id = ? AND kind = 'pan' AND day = ?").bind(uid, h.rigaDay()).first()).n;
  if (m === 'GET' && p === '/api/pancakes') {
    const u = await h.currentUser(req, env), unit = await h.unit();
    const up = Object.fromEntries(Object.entries(PAN_UPS).map(([k, x]) => [k, { max: x.max, cost: h.btnOf(R[x.pct], unit) }]));
    const top = (await env.DB.prepare(TOP + '10').all()).results.map(r => ({ id: r.id, nick: r.nick, avatar: h.avatarOf(r), best: r.pan_best }));
    return json({ on: R.panOn, per: h.btnOf(R.panLevelPct, unit), record: h.btnOf(R.panRecordPct, unit), every: R.panItemEvery, wash: R.panWashEvery, soap: R.panSoapBtn,
      start: R.panStartEvery, up, ups: u ? upsOf(u) : null,
      today: u ? await today(u.id) : 0, best: u ? u.pan_best || 0 : 0, buttons: u ? u.buttons || 0 : 0,
      me: u && u.nick && !u.banned ? { id: u.id, nick: u.nick, avatar: h.avatarOf(u) } : null, top });
  }
  if (m !== 'POST' || !p.startsWith('/api/pancakes/')) return null;
  const u = await h.needUser(req, env);
  if (!u.nick || u.banned) fail(400, 'nick');
  if (p === '/api/pancakes/start') {
    // from — сколько уровней «уже пройдено»: рубеж каждые panStartEvery, не выше рекорда; сковородка на старте чистая
    const b0 = await req.json().catch(() => ({})), id = h.randomHex(12);
    let from = Math.max(0, Math.floor(Number(b0.from) || 0));
    if (!R.panStartEvery || from % R.panStartEvery || from > (u.pan_best || 0)) from = 0;
    await env.DB.prepare('INSERT INTO pan_runs (id, user_id, started, level, washed, base) VALUES (?, ?, ?, ?, ?, ?)').bind(id, u.id, Date.now(), from, Math.floor(from / R.panWashEvery), from).run();
    return json({ run: id, from });
  }
  // улучшение за пуговки: N-й уровень — N × цена; pan_up меняется, только если его никто не поменял между чтением и записью
  if (p === '/api/pancakes/up') {
    const b0 = await req.json().catch(() => ({})), k = String(b0.k || ''), x = PAN_UPS[k];
    if (!x) fail(400, 'k');
    const ups = upsOf(u), lvl = ups[k] + 1;
    if (lvl > x.max) fail(409, 'max');
    const cost = h.btnOf(R[x.pct], await h.unit()) * lvl, next = JSON.stringify({ ...ups, [k]: lvl });
    const s = await env.DB.prepare("UPDATE users SET buttons = COALESCE(buttons, 0) - ?, pan_up = ? WHERE id = ? AND COALESCE(buttons, 0) >= ? AND COALESCE(pan_up, '') = ?").bind(cost, next, u.id, cost, u.pan_up || '').run();
    if (!s.meta.changes) fail(402, 'poor');
    if (cost) await env.DB.prepare('INSERT OR IGNORE INTO button_log (user_id, kind, ref, amount, day, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(u.id, 'panup', k + ':' + lvl, -cost, h.rigaDay(), h.now()).run();
    const left = (await env.DB.prepare('SELECT buttons FROM users WHERE id = ?').bind(u.id).first() || {}).buttons || 0;
    return json({ ok: true, ups: { ...ups, [k]: lvl }, paid: cost, buttons: left });
  }
  const b = await req.json().catch(() => ({}));
  const r = await env.DB.prepare('SELECT * FROM pan_runs WHERE id = ? AND user_id = ?').bind(String(b.run || ''), u.id).first();
  if (!r) fail(404, 'run');
  // мытьё сковородки: после каждого panWashEvery-го уровня, один раз; soap — со средством (panSoapBtn 🔘), иначе водой (дольше тереть, бесплатно)
  if (p === '/api/pancakes/wash') {
    const need = Math.floor(r.level / R.panWashEvery);
    if (r.washed >= need) fail(409, 'clean');
    if (b.spare) { // запасная сковородка вместо мытья: сколько уровней улучшения spare — столько раз за игру
      if ((r.spare || 0) >= upsOf(u).spare) fail(409, 'spare');
      await env.DB.prepare('UPDATE pan_runs SET washed = ?, spare = COALESCE(spare, 0) + 1 WHERE id = ?').bind(need, r.id).run();
      return json({ ok: true, paid: 0, spare: (r.spare || 0) + 1, badges: [] });
    }
    let paid = 0;
    if (b.soap && R.panSoapBtn > 0) {
      paid = R.panSoapBtn;
      const s = await env.DB.prepare('UPDATE users SET buttons = COALESCE(buttons, 0) - ? WHERE id = ? AND COALESCE(buttons, 0) >= ?').bind(paid, u.id, paid).run();
      if (!s.meta.changes) fail(402, 'poor');
      await env.DB.prepare('INSERT OR IGNORE INTO button_log (user_id, kind, ref, amount, day, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(u.id, 'pansoap', r.id + ':' + need, -paid, h.rigaDay(), h.now()).run();
    }
    await env.DB.prepare('UPDATE pan_runs SET washed = ? WHERE id = ?').bind(need, r.id).run();
    await env.DB.prepare('UPDATE users SET pan_washes = COALESCE(pan_washes, 0) + 1 WHERE id = ?').bind(u.id).run();
    const badges = paid && await h.badge(u, 'panwash') ? ['panwash'] : [];
    const left = (await env.DB.prepare('SELECT buttons FROM users WHERE id = ?').bind(u.id).first() || {}).buttons || 0;
    return json({ ok: true, paid, buttons: left, badges });
  }
  if (p === '/api/pancakes/level') {
    const lv = Math.floor(Number(b.level) || 0), mood = Math.max(0, Math.min(3, Math.floor(Number(b.mood) || 0)));
    if (lv !== r.level + 1) fail(409, 'order');
    if (lv > 1 && (lv - 1) % R.panWashEvery === 0 && r.washed < (lv - 1) / R.panWashEvery) fail(409, 'wash');
    if (Date.now() - r.started < (lv - (r.base || 0)) * R.panMinSec * 1000) fail(429, 'fast');
    const stars = r.stars + (mood === 3 ? 1 : 0);
    const upd = await env.DB.prepare('UPDATE pan_runs SET level = ?, stars = ? WHERE id = ? AND level = ?').bind(lv, stars, r.id, r.level).run();
    if (!upd.meta.changes) fail(409, 'order');
    const oldBest = u.pan_best || 0, unit = await h.unit(), day = h.rigaDay();
    await h.top(u.id, lv); // доска топа: лучший забег недели
    if (lv > oldBest) await env.DB.prepare('UPDATE users SET pan_best = ?, pan_best_at = ? WHERE id = ? AND COALESCE(pan_best, 0) < ?').bind(lv, Date.now(), u.id, lv).run();
    const badges = [];
    for (const [k, ok] of [['pan1', lv >= R.cond.panA], ['pan2', lv >= R.cond.panB], ['pan3', lv >= R.cond.panC], ['panstar', stars >= R.cond.panStar]]) if (ok && await h.badge(u, k)) badges.push(k);
    // каждый номер уровня платит раз в сутки; за новый рекорд — бонус за каждый уровень выше прежнего (один раз навсегда)
    const got = R.panOn ? await h.award(u.id, 'pan', day + ':' + lv, price(unit, lv)) : 0;
    const rec = R.panOn && lv > oldBest && R.panRecordPct > 0 ? await h.award(u.id, 'panrec', String(lv), h.btnOf(R.panRecordPct, unit)) : 0;
    let item = null;
    if (R.panItemEvery > 0 && lv % R.panItemEvery === 0) {
      const once = await env.DB.prepare('INSERT OR IGNORE INTO button_log (user_id, kind, ref, amount, day, created_at) VALUES (?, ?, ?, 0, ?, ?)').bind(u.id, 'panitem', day + ':' + lv, day, h.now()).run();
      if (once.meta.changes) item = await h.item(req, u.id, 'pan:' + lv);
    }
    return json({ ok: true, got, rec, today: await today(u.id), best: Math.max(lv, oldBest), badges, item, wash: lv % R.panWashEvery === 0 });
  }
  return null;
}
