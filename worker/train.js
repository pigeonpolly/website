// «Поезд в Испанию» (/train/, site/assets/train.js, docs/games.md): Полли едет на поезде, Эмпанадильо помогает собирать слова из букв.
// 4 языка игры (en, lv, es, no), у каждого свой счёт станций (users.train_lv JSON {en: N, …}); рекорд для доски топа — лучший из языков (users.train_best).
// Как «Блинная»: забег (train_runs), станции подтверждаются по одной и не быстрее trainMinSec с на станцию от старта;
// пуговки за станцию × (1 + десяток), каждая станция языка — раз в сутки; бонус за новый рекорд языка; вещь каждые trainItemEvery станций (сначала — из темы «🚆 Поезд»).
// Прокачка — users.train_up JSON {hint, word, jar}: N-й уровень стоит N × цена; старт с рубежа каждые trainStartEvery станций (не выше рекорда языка).
// API: GET /api/train, POST /api/train/{start,station,up}.

export const TRAIN_TABLES = [
  'CREATE TABLE IF NOT EXISTS train_runs (id TEXT PRIMARY KEY, user_id INTEGER NOT NULL, started INTEGER NOT NULL, lang TEXT NOT NULL, level INTEGER DEFAULT 0, base INTEGER DEFAULT 0, words INTEGER DEFAULT 0)',
];
export const TRAIN_ALTER = ['ALTER TABLE users ADD COLUMN train_best INTEGER DEFAULT 0', 'ALTER TABLE users ADD COLUMN train_best_at INTEGER',
  "ALTER TABLE users ADD COLUMN train_lv TEXT DEFAULT ''", "ALTER TABLE users ADD COLUMN train_up TEXT DEFAULT ''", 'ALTER TABLE users ADD COLUMN train_words INTEGER DEFAULT 0'];
export const TRAIN_RULES = {
  trainOn: true, trainLevelPct: 2, trainRecordPct: 4, // пуговки за станцию (× (1 + ⌊(ст−1)/10⌋)) и за каждую станцию выше прежнего рекорда языка — % опорной цены
  trainMinSec: 10, trainItemEvery: 10, // станция быстрее N с (от старта, на каждую) не засчитывается; вещь каждые N станций (0 — выкл.)
  trainStartEvery: 10, // рубежи для старта не с 1-й станции
  trainUpHintPct: 50, trainUpWordPct: 120, trainUpJarPct: 60, // цена 1-го уровня улучшения, % опорной цены (N-й — ×N)
};
// улучшения: max — сколько уровней; что дают — в site/assets/train.js (UPS)
export const TRAIN_UPS = { hint: { max: 3, pct: 'trainUpHintPct' }, word: { max: 2, pct: 'trainUpWordPct' }, jar: { max: 2, pct: 'trainUpJarPct' } };
export const TRAIN_RANGE = { trainLevelPct: [0, 100], trainRecordPct: [0, 100], trainMinSec: [1, 120], trainItemEvery: [0, 1000], trainStartEvery: [0, 100],
  trainUpHintPct: [0, 10000], trainUpWordPct: [0, 10000], trainUpJarPct: [0, 10000] };
export const TRAIN_INT = ['trainMinSec', 'trainItemEvery', 'trainStartEvery'];
// бейджи: tr1/tr2/tr3 — станций в одном языке (cond.trainA/B/C), trpoly — trainPoly станций в каждом из 4 языков, trwords — trainWords найденных слов всего
export const TRAIN_BADGES = { tr1: 10, tr2: 20, tr3: 40, trpoly: 30, trwords: 25 };
export const TRAIN_COND = { trainA: 8, trainB: 25, trainC: 60, trainPoly: 8, trainWords: 300 };
export const TRAIN_LANGS = ['en', 'lv', 'es', 'no'];
// вещи темы «🚆 Поезд» (room.js, birds.js) — подарок за рубеж, пока не собраны все; легендарные не дарятся
export const TRAIN_ITEMS = ['furn|toytrain', 'furn|oldsuitcase', 'furn|empanadillo', 'furn|ticketbooth', 'deco|trainposter', 'deco|stationclock', 'deco|routemap', 'wall|tickets', 'curtain|sleeper', 'hat|conductor', 'item|ticket', 'item|phrasebook'];

const TOP = 'SELECT id, nick, avatar, train_best FROM users WHERE train_best > 0 AND banned = 0 AND nick IS NOT NULL ORDER BY train_best DESC, COALESCE(train_best_at, 0), id LIMIT ';
const parse = (s, d) => { try { return JSON.parse(s || '') || d; } catch (e) { return d; } };
const lvOf = u => { const o = parse(u.train_lv, {}); return Object.fromEntries(TRAIN_LANGS.map(l => [l, Math.max(0, Math.floor(Number(o[l]) || 0))])); };
const upsOf = u => { const o = parse(u.train_up, {}); return Object.fromEntries(Object.entries(TRAIN_UPS).map(([k, x]) => [k, Math.max(0, Math.min(x.max, Math.floor(Number(o[k]) || 0)))])); };

// h: json, fail, currentUser, needUser, rules, rigaDay, unit, btnOf, award, avatarOf, top(uid, n), badge(u, k), item(req, uid, note), give(uid, key, note), randomHex, now
export async function trainApi(req, env, url, h) {
  const p = url.pathname, m = req.method, { json, fail } = h, R = h.rules();
  const price = (unit, lv) => h.btnOf(R.trainLevelPct, unit) * (1 + Math.floor((lv - 1) / 10));
  const today = async uid => (await env.DB.prepare("SELECT COALESCE(SUM(amount), 0) AS n FROM button_log WHERE user_id = ? AND kind = 'train' AND day = ?").bind(uid, h.rigaDay()).first()).n;
  if (m === 'GET' && p === '/api/train') {
    const u = await h.currentUser(req, env), unit = await h.unit();
    const up = Object.fromEntries(Object.entries(TRAIN_UPS).map(([k, x]) => [k, { max: x.max, cost: h.btnOf(R[x.pct], unit) }]));
    const top = (await env.DB.prepare(TOP + '10').all()).results.map(r => ({ id: r.id, nick: r.nick, avatar: h.avatarOf(r), best: r.train_best }));
    return json({ on: R.trainOn, per: h.btnOf(R.trainLevelPct, unit), record: h.btnOf(R.trainRecordPct, unit), every: R.trainItemEvery, start: R.trainStartEvery, up,
      ups: u ? upsOf(u) : null, lv: u ? lvOf(u) : null, words: u ? u.train_words || 0 : 0,
      today: u ? await today(u.id) : 0, best: u ? u.train_best || 0 : 0, buttons: u ? u.buttons || 0 : 0,
      me: u && u.nick && !u.banned ? { id: u.id, nick: u.nick, avatar: h.avatarOf(u) } : null, top });
  }
  if (m !== 'POST' || !p.startsWith('/api/train/')) return null;
  const u = await h.needUser(req, env);
  if (!u.nick || u.banned) fail(400, 'nick');
  const b = await req.json().catch(() => ({}));
  if (p === '/api/train/start') {
    const lang = TRAIN_LANGS.includes(b.lang) ? b.lang : fail(400, 'lang'), id = h.randomHex(12);
    let from = Math.max(0, Math.floor(Number(b.from) || 0));
    if (!R.trainStartEvery || from % R.trainStartEvery || from > lvOf(u)[lang]) from = 0;
    await env.DB.prepare('INSERT INTO train_runs (id, user_id, started, lang, level, base) VALUES (?, ?, ?, ?, ?, ?)').bind(id, u.id, Date.now(), lang, from, from).run();
    return json({ run: id, from });
  }
  if (p === '/api/train/up') {
    const k = String(b.k || ''), x = TRAIN_UPS[k];
    if (!x) fail(400, 'k');
    const ups = upsOf(u), lvl = ups[k] + 1;
    if (lvl > x.max) fail(409, 'max');
    const cost = h.btnOf(R[x.pct], await h.unit()) * lvl, next = JSON.stringify({ ...ups, [k]: lvl });
    const s = await env.DB.prepare("UPDATE users SET buttons = COALESCE(buttons, 0) - ?, train_up = ? WHERE id = ? AND COALESCE(buttons, 0) >= ? AND COALESCE(train_up, '') = ?").bind(cost, next, u.id, cost, u.train_up || '').run();
    if (!s.meta.changes) fail(402, 'poor');
    if (cost) await env.DB.prepare('INSERT OR IGNORE INTO button_log (user_id, kind, ref, amount, day, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(u.id, 'trainup', k + ':' + lvl, -cost, h.rigaDay(), h.now()).run();
    const left = (await env.DB.prepare('SELECT buttons FROM users WHERE id = ?').bind(u.id).first() || {}).buttons || 0;
    return json({ ok: true, ups: { ...ups, [k]: lvl }, paid: cost, buttons: left });
  }
  if (p === '/api/train/station') {
    const r = await env.DB.prepare('SELECT * FROM train_runs WHERE id = ? AND user_id = ?').bind(String(b.run || ''), u.id).first();
    if (!r) fail(404, 'run');
    const lv = Math.floor(Number(b.level) || 0), found = Math.max(0, Math.min(12, Math.floor(Number(b.words) || 0)));
    if (lv !== r.level + 1) fail(409, 'order');
    if (Date.now() - r.started < (lv - (r.base || 0)) * R.trainMinSec * 1000) fail(429, 'fast');
    const upd = await env.DB.prepare('UPDATE train_runs SET level = ?, words = words + ? WHERE id = ? AND level = ?').bind(lv, found, r.id, r.level).run();
    if (!upd.meta.changes) fail(409, 'order');
    const lvs = lvOf(u), old = lvs[r.lang], unit = await h.unit(), day = h.rigaDay();
    const words = (u.train_words || 0) + found, best = Math.max(u.train_best || 0, lv);
    if (lv > old) lvs[r.lang] = lv;
    await env.DB.prepare('UPDATE users SET train_lv = ?, train_words = ?, train_best = ?, train_best_at = CASE WHEN ? > COALESCE(train_best, 0) THEN ? ELSE train_best_at END WHERE id = ?')
      .bind(JSON.stringify(lvs), words, best, lv, Date.now(), u.id).run();
    await h.top(u.id, lv); // доска топа: лучший забег недели
    const badges = [], C = R.cond;
    for (const [k, ok] of [['tr1', lv >= C.trainA], ['tr2', lv >= C.trainB], ['tr3', lv >= C.trainC], ['trpoly', TRAIN_LANGS.every(l => lvs[l] >= C.trainPoly)], ['trwords', words >= C.trainWords]])
      if (ok && await h.badge(u, k)) badges.push(k);
    // каждая станция языка платит раз в сутки; за новый рекорд языка — бонус за каждую станцию выше прежнего (один раз навсегда)
    const got = R.trainOn ? await h.award(u.id, 'train', day + ':' + r.lang + ':' + lv, price(unit, lv)) : 0;
    const rec = R.trainOn && lv > old && R.trainRecordPct > 0 ? await h.award(u.id, 'trainrec', r.lang + ':' + lv, h.btnOf(R.trainRecordPct, unit)) : 0;
    let item = null;
    if (R.trainItemEvery > 0 && lv % R.trainItemEvery === 0) {
      const once = await env.DB.prepare('INSERT OR IGNORE INTO button_log (user_id, kind, ref, amount, day, created_at) VALUES (?, ?, ?, 0, ?, ?)').bind(u.id, 'trainitem', day + ':' + r.lang + ':' + lv, day, h.now()).run();
      if (once.meta.changes) {
        // сначала — вещи темы «🚆 Поезд», которых у птички ещё нет; когда все есть — любая вещь магазина
        const have = new Set((await env.DB.prepare('SELECT kind, item FROM gifts WHERE user_id = ?').bind(u.id).all()).results.map(x => x.kind + '|' + x.item));
        const left = TRAIN_ITEMS.filter(k => !have.has(k));
        item = left.length ? await h.give(u.id, left[Math.floor(Math.random() * left.length)], 'train:' + lv) : await h.item(req, u.id, 'train:' + lv);
      }
    }
    return json({ ok: true, got, rec, today: await today(u.id), best: Math.max(lv, old), lv: lvs, words, badges, item });
  }
  return null;
}
