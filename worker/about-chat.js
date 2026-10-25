// Чат «Поболтать с Алиной и Полли» на /about-me/ (site/assets/about-desk.js, docs/site.md).
// 1) Какие вопросы птичка уже открыла. Ключ — «a:q012» (ответ Алины) или «p:q012» (ответ Полли); вопросы посетителей — «a:u7».
//    Гость копит в sessionStorage, после входа всё сливается сюда.
// 2) Свои вопросы: птичка с ником (от себя или анонимно) или гость (анонимно) присылает вопрос, которого нет в базе → кабинет «📮 Вопросы из чата» (about-admin.js).
//    Алина отвечает по-русски (за себя и/или за Полли), вопрос и ответы переводятся на en/ru/lv и попадают в игру
//    с пометкой «прислал(а) @ник» (или «анонимный вопрос»); автору с аккаунтом — новость aboutask, пока не открыл чат.
// API: GET /api/about-chat → {opened, user, nick, asks}; POST /api/about-chat {add: [ключи]}; POST /api/about-chat/ask {text, lang};
//      GET /api/about-chat/extra → {questions}; GET /api/admin/about-asks?status=; POST /api/admin/about-asks {id, q, a, p, status}.

export const ABOUT_CHAT_TABLES = [
  'CREATE TABLE IF NOT EXISTS about_chat (user_id INTEGER PRIMARY KEY, opened TEXT, updated_at INTEGER)',
  // status: new — ждёт Алину, ok — в игре, no — не добавлять; tr = {q: {en, ru, lv}, a: {…}, p: {…}}; seen = 0 — автор ещё не видел ответа
  "CREATE TABLE IF NOT EXISTS about_asks (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, text TEXT NOT NULL, lang TEXT, status TEXT DEFAULT 'new', tr TEXT, created_at INTEGER, answered_at INTEGER, seen INTEGER DEFAULT 1)",
  'CREATE INDEX IF NOT EXISTS about_asks_s ON about_asks (status)',
  'CREATE INDEX IF NOT EXISTS about_asks_u ON about_asks (user_id)',
];
// анонимные вопросы (25.10.2026): гость (user_id = 0) или птичка, отметившая «анонимно» (anon = 1, ник в игре не показывается);
// ip — хеш адреса с солью, для лимитов гостей
export const ABOUT_CHAT_ALTER = ['ALTER TABLE about_asks ADD COLUMN anon INTEGER DEFAULT 0', 'ALTER TABLE about_asks ADD COLUMN ip TEXT'];
const KEY = /^[ap]:(q\d{3,4}|u\d{1,7})$/, MAX = 2000;
const LANGS = ['en', 'ru', 'lv'];
export const ASK_MIN = 5, ASK_LEN = 200, ASK_WAIT = 3, ASK_DAY = 10, GUEST_DAY = 5, GUEST_HOUR = 30; // длина вопроса; ждут ответа сразу; в сутки; гостю с адреса в сутки; гостей со всего сайта в час
// награды чата (25.10.2026): ступени 25/50/75 % от RULES.cond.chatFull (100) — по achatStepBtn 🔘 за каждую сторону;
// chatFull ответов Алины — бейдж chatA, Полли — chatP (пуговки — RULES.badges); обе — бейдж chatAP и ноутбук furn|pollychat в сумку
export const ACHAT_RULES = { achatStepBtn: 10 };
export const ACHAT_RANGE = { achatStepBtn: [0, 10000] };
export const ACHAT_INT = ['achatStepBtn'];
export const ACHAT_BADGES = { chatA: 100, chatP: 100, chatAP: 50 };
export const ACHAT_COND = { chatFull: 100 };
export const ACHAT_ITEM = ['furn', 'pollychat'];
const STEPS = [0.25, 0.5, 0.75];
const parse = (s, d) => { try { return JSON.parse(s) || d; } catch (e) { return d; } };
const langOf = t => /[а-яё]/i.test(t) ? 'ru' : /[āēīūčšžņļķģ]/i.test(t) ? 'lv' : 'en';

// новость автору: на его вопрос ответили, а он ещё не открывал чат
export async function aboutAskNews(env, uid) {
  const r = (await env.DB.prepare("SELECT id, tr FROM about_asks WHERE user_id = ? AND status = 'ok' AND seen = 0 ORDER BY id DESC").bind(uid).all()).results;
  return r.length ? { n: r.length, id: r[0].id, q: parse(r[0].tr, {}).q || {} } : null;
}

let baseAns = null, baseAt = 0;
async function answered(env, h) {
  if (!baseAns || Date.now() - baseAt > 600000) { // база меняется только с выкладкой сайта — держим 10 минут
    const d = await h.asset('/assets/about-chat.json').catch(() => null);
    if (d && d.questions) { baseAns = { a: new Set(), p: new Set() }; for (const q of d.questions) for (const w of ['a', 'p']) if (q[w] && Object.keys(q[w]).length) baseAns[w].add(q.id); baseAt = Date.now(); }
  }
  const out = { a: new Set(baseAns ? baseAns.a : []), p: new Set(baseAns ? baseAns.p : []) };
  for (const r of (await env.DB.prepare("SELECT id, tr FROM about_asks WHERE status = 'ok'").all()).results) { const t = parse(r.tr, {}); for (const w of ['a', 'p']) if (t[w] && Object.keys(t[w]).length) out[w].add('u' + r.id); }
  return out;
}
// счёт открытых ответов и награды (всё повторно не выдаётся: award — по ref, бейдж — один раз, вещь — если ещё не было)
async function chatRewards(env, h, u, opened) {
  const ok = await answered(env, h), R = h.rules(), full = Math.max(1, R.cond.chatFull || 100), got = [];
  const cnt = { a: 0, p: 0 };
  for (const k of opened) { const [w, id] = k.split(':'); if (ok[w] && ok[w].has(id)) cnt[w]++; }
  for (const w of ['a', 'p']) {
    for (const f of STEPS) { const s = Math.round(full * f); if (cnt[w] >= s && R.achatStepBtn > 0) { const n = await h.award(u.id, 'achat', w + s, R.achatStepBtn); if (n) got.push({ t: 'btn', w, s, n }); } }
    if (cnt[w] >= full && await h.badge(u, w === 'a' ? 'chatA' : 'chatP')) got.push({ t: 'badge', k: w === 'a' ? 'chatA' : 'chatP', n: (R.badges || {})[w === 'a' ? 'chatA' : 'chatP'] || 0 });
  }
  if (cnt.a >= full && cnt.p >= full) {
    if (await h.badge(u, 'chatAP')) got.push({ t: 'badge', k: 'chatAP', n: (R.badges || {}).chatAP || 0 });
    const [kind, item] = ACHAT_ITEM;
    if (!(await env.DB.prepare('SELECT 1 FROM gifts WHERE user_id = ? AND kind = ? AND item = ?').bind(u.id, kind, item).first())) {
      await env.DB.prepare("INSERT INTO gifts (user_id, kind, item, note, status, created_at, opened_at) VALUES (?, ?, ?, 'achat', 'bag', ?, NULL)").bind(u.id, kind, item, h.now()).run();
      got.push({ t: 'item', kind, item });
    }
  }
  return { cnt, full, got };
}

// письмо-новость о чате (news.js chatnew) всем птичкам, кто ещё не открывал чат, до CHATNEW_UNTIL; гаснет, когда птичка открыла чат
export const CHATNEW_UNTIL = '2026-11-30';
export async function aboutChatNews(env, uid, day) {
  if (day > CHATNEW_UNTIL) return null;
  return (await env.DB.prepare('SELECT 1 FROM about_chat WHERE user_id = ?').bind(uid).first()) ? null : { n: 1 };
}

// h: json, fail, currentUser, needUser, isAdmin, now, ipKey(req) → хеш адреса, translate(texts, from, langs) → { tr: {lang: [..]} },
//    rules(), award(uid, kind, ref, n), badge(u, k) — бейдж + его пуговки, asset(path) → JSON из site/
export async function aboutChatApi(req, env, url, h) {
  const p = url.pathname, m = req.method, { json, fail } = h;
  const rowOf = async uid => {
    const r = await env.DB.prepare('SELECT opened FROM about_chat WHERE user_id = ?').bind(uid).first();
    return parse(r && r.opened, []).filter(k => KEY.test(k));
  };
  if (m === 'GET' && p === '/api/about-chat/extra') {
    const rows = (await env.DB.prepare("SELECT a.id, a.tr, a.anon, u.nick FROM about_asks a LEFT JOIN users u ON u.id = a.user_id WHERE a.status = 'ok' ORDER BY a.answered_at").all()).results;
    const questions = rows.map(r => ({ id: 'u' + r.id, nick: r.anon ? '' : r.nick || '', ...parse(r.tr, {}) })).filter(x => x.q); // nick '' — анонимный вопрос
    return json({ questions }, 200, { 'cache-control': 'public, max-age=120' });
  }
  if (m === 'GET' && p === '/api/about-chat') {
    const u = await h.currentUser(req, env);
    if (!u) return json({ opened: [], user: false, asks: [] }, 200, { 'cache-control': 'no-store' });
    const asks = (await env.DB.prepare('SELECT id, text, status, tr, seen, anon FROM about_asks WHERE user_id = ? ORDER BY id DESC LIMIT 30').bind(u.id).all()).results
      .map(r => ({ id: 'u' + r.id, text: r.text, status: r.status, anon: !!r.anon, fresh: r.status === 'ok' && !r.seen }));
    if (asks.some(a => a.fresh)) await env.DB.prepare("UPDATE about_asks SET seen = 1 WHERE user_id = ? AND status = 'ok' AND seen = 0").bind(u.id).run(); // открыл чат — ответы увидены
    await env.DB.prepare("INSERT OR IGNORE INTO about_chat (user_id, opened, updated_at) VALUES (?, '[]', ?)").bind(u.id, Date.now()).run(); // открыл чат — письмо о нём гаснет
    const opened = await rowOf(u.id), rw = await chatRewards(env, h, u, opened).catch(() => null); // награды, если правила поменялись или база выросла
    return json({ opened, user: true, nick: u.nick || '', asks, full: rw ? rw.full : 100, cnt: rw ? rw.cnt : null, got: rw ? rw.got : [] }, 200, { 'cache-control': 'no-store' });
  }
  if (m === 'POST' && p === '/api/about-chat') {
    const u = await h.needUser(req, env);
    const b = await req.json().catch(() => ({}));
    if (!Array.isArray(b.add)) fail(400, 'add');
    const set = new Set(await rowOf(u.id));
    for (const k of b.add.slice(0, MAX)) if (KEY.test(String(k))) set.add(String(k));
    const opened = [...set].slice(0, MAX);
    await env.DB.prepare(`INSERT INTO about_chat (user_id, opened, updated_at) VALUES (?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET opened = excluded.opened, updated_at = excluded.updated_at`)
      .bind(u.id, JSON.stringify(opened), Date.now()).run();
    const rw = u.nick && !u.banned ? await chatRewards(env, h, u, opened).catch(e => { console.error('achat', e); return null; }) : null;
    return json({ opened, full: rw ? rw.full : 100, cnt: rw ? rw.cnt : null, got: rw ? rw.got : [] });
  }
  if (m === 'POST' && p === '/api/about-chat/ask') {
    const u0 = await h.currentUser(req, env);
    if (u0 && u0.banned) fail(403, 'banned');
    const u = u0 && u0.nick ? u0 : null; // без ника — как гость
    const b = await req.json().catch(() => ({}));
    if (b.hp) return json({ ok: true, id: 'u0' }); // скрытое поле заполняют только боты
    const text = String(b.text || '').replace(/\s+/g, ' ').trim().slice(0, ASK_LEN);
    if (text.length < ASK_MIN) fail(400, 'short');
    if (/https?:|www\.|\.(com|net|org|ru|lv|io)\b/i.test(text)) fail(400, 'link'); // без ссылок
    const anon = u ? (b.anon ? 1 : 0) : 1, ip = await h.ipKey(req);
    // лимиты: птичке — по аккаунту, гостю — по адресу и общий наплыв гостей
    const by = u ? ['user_id = ?', u.id] : ['user_id = 0 AND ip = ?', ip];
    const wait = (await env.DB.prepare(`SELECT COUNT(*) AS n FROM about_asks WHERE ${by[0]} AND status = 'new'`).bind(by[1]).first()).n;
    if (wait >= ASK_WAIT) fail(429, 'wait');
    const day = (await env.DB.prepare(`SELECT COUNT(*) AS n FROM about_asks WHERE ${by[0]} AND created_at > ?`).bind(by[1], h.now() - 86400).first()).n;
    if (day >= (u ? ASK_DAY : GUEST_DAY)) fail(429, 'many');
    if (!u) {
      if (!(Number(b.ms) >= 2000)) fail(400, 'fast'); // человек не напишет вопрос быстрее 2 с после открытия чата
      const hour = (await env.DB.prepare('SELECT COUNT(*) AS n FROM about_asks WHERE user_id = 0 AND created_at > ?').bind(h.now() - 3600).first()).n;
      if (hour >= GUEST_HOUR) fail(429, 'busy');
    }
    const low = text.toLowerCase(); // lower() в SQLite не знает кириллицы — сравниваем здесь
    const same = (await env.DB.prepare(`SELECT id, text FROM about_asks WHERE ${by[0]} AND status != 'no'`).bind(by[1]).all()).results.find(r => r.text.toLowerCase() === low);
    if (same) return json({ ok: true, id: 'u' + same.id, dup: true });
    const lang = LANGS.includes(b.lang) ? b.lang : langOf(text);
    const r = await env.DB.prepare('INSERT INTO about_asks (user_id, text, lang, anon, ip, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(u ? u.id : 0, text, lang, anon, ip, h.now()).run();
    return json({ ok: true, id: 'u' + r.meta.last_row_id, anon: !!anon });
  }
  if (p === '/api/admin/about-asks') {
    const u = await h.needUser(req, env);
    if (!(await h.isAdmin(u, env))) fail(403, 'admin');
    if (m === 'GET') {
      const st = ['new', 'ok', 'no'].includes(url.searchParams.get('status')) ? url.searchParams.get('status') : 'new';
      const rows = (await env.DB.prepare(`SELECT a.*, u.nick FROM about_asks a LEFT JOIN users u ON u.id = a.user_id WHERE a.status = ? ORDER BY a.created_at ${st === 'new' ? 'ASC' : 'DESC'} LIMIT 300`).bind(st).all()).results;
      const n = (await env.DB.prepare('SELECT status, COUNT(*) AS n FROM about_asks GROUP BY status').all()).results;
      return json({
        asks: rows.map(r => { const t = parse(r.tr, {}); return { id: r.id, nick: r.nick || '', anon: !!r.anon, text: r.text, lang: r.lang, status: r.status, at: r.created_at, answered: r.answered_at, q: (t.q || {}).ru || '', a: (t.a || {}).ru || '', p: (t.p || {}).ru || '', langs: Object.keys(t.q || {}) }; }),
        counts: Object.fromEntries(n.map(x => [x.status, x.n])),
      }, 200, { 'cache-control': 'no-store' });
    }
    if (m === 'POST') {
      const b = await req.json().catch(() => ({}));
      const row = await env.DB.prepare('SELECT * FROM about_asks WHERE id = ?').bind(Number(b.id)).first();
      if (!row) fail(404, 'ask');
      if (b.status === 'no') { // не добавлять (или убрать из игры)
        await env.DB.prepare("UPDATE about_asks SET status = 'no', seen = 1 WHERE id = ?").bind(row.id).run();
        return json({ ok: true });
      }
      const cut = (s, n) => String(s || '').trim().slice(0, n);
      const q = cut(b.q, ASK_LEN) || row.text, a = cut(b.a, 3000), pa = cut(b.p, 3000);
      if (!a && !pa) fail(400, 'answer');
      // вопрос — с языка, на котором его прислали (или как поправила Алина), ответы — с русского; не перевелось — остаётся оригинал
      const qFrom = langOf(q), tr = { q: { [qFrom]: q }, a: a ? { ru: a } : {}, p: pa ? { ru: pa } : {} };
      const go = async (texts, from, set) => {
        const to = LANGS.filter(l => l !== from);
        try { const r = await h.translate(texts, from, to); for (const l of to) if (r.tr[l]) set(l, r.tr[l]); } catch (e) {}
      };
      await go([q], qFrom, (l, v) => { if (v[0]) tr.q[l] = v[0]; });
      const ans = [a, pa].filter(Boolean);
      await go(ans, 'ru', (l, v) => { let i = 0; if (a && v[i]) tr.a[l] = v[i]; if (a) i++; if (pa && v[i]) tr.p[l] = v[i]; });
      const first = row.status !== 'ok';
      await env.DB.prepare(`UPDATE about_asks SET status = 'ok', tr = ?, answered_at = COALESCE(answered_at, ?)${first ? ', seen = 0' : ''} WHERE id = ?`).bind(JSON.stringify(tr), h.now(), row.id).run();
      return json({ ok: true, langs: Object.keys(tr.q), missing: LANGS.filter(l => !tr.q[l] || (a && !tr.a[l]) || (pa && !tr.p[l])) });
    }
  }
  return null;
}
