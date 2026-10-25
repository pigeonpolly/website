// Чат «Поболтать с Алиной и Полли» на /about-me/ (site/assets/about-desk.js, docs/site.md).
// 1) Какие вопросы птичка уже открыла. Ключ — «a:q012» (ответ Алины) или «p:q012» (ответ Полли); вопросы посетителей — «a:u7».
//    Гость копит в sessionStorage, после входа всё сливается сюда.
// 2) Свои вопросы: птичка с ником присылает вопрос, которого нет в базе → кабинет «📮 Вопросы из чата» (about-admin.js).
//    Алина отвечает по-русски (за себя и/или за Полли), вопрос и ответы переводятся на en/ru/lv и попадают в игру
//    с пометкой «прислал(а) @ник»; автору — новость aboutask, пока не открыл чат.
// API: GET /api/about-chat → {opened, user, nick, asks}; POST /api/about-chat {add: [ключи]}; POST /api/about-chat/ask {text, lang};
//      GET /api/about-chat/extra → {questions}; GET /api/admin/about-asks?status=; POST /api/admin/about-asks {id, q, a, p, status}.

export const ABOUT_CHAT_TABLES = [
  'CREATE TABLE IF NOT EXISTS about_chat (user_id INTEGER PRIMARY KEY, opened TEXT, updated_at INTEGER)',
  // status: new — ждёт Алину, ok — в игре, no — не добавлять; tr = {q: {en, ru, lv}, a: {…}, p: {…}}; seen = 0 — автор ещё не видел ответа
  "CREATE TABLE IF NOT EXISTS about_asks (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, text TEXT NOT NULL, lang TEXT, status TEXT DEFAULT 'new', tr TEXT, created_at INTEGER, answered_at INTEGER, seen INTEGER DEFAULT 1)",
  'CREATE INDEX IF NOT EXISTS about_asks_s ON about_asks (status)',
  'CREATE INDEX IF NOT EXISTS about_asks_u ON about_asks (user_id)',
];
const KEY = /^[ap]:(q\d{3,4}|u\d{1,7})$/, MAX = 2000;
const LANGS = ['en', 'ru', 'lv'];
export const ASK_MIN = 5, ASK_LEN = 200, ASK_WAIT = 3, ASK_DAY = 10; // длина вопроса; сколько может ждать ответа сразу; в сутки
const parse = (s, d) => { try { return JSON.parse(s) || d; } catch (e) { return d; } };
const langOf = t => /[а-яё]/i.test(t) ? 'ru' : /[āēīūčšžņļķģ]/i.test(t) ? 'lv' : 'en';

// новость автору: на его вопрос ответили, а он ещё не открывал чат
export async function aboutAskNews(env, uid) {
  const r = (await env.DB.prepare("SELECT id, tr FROM about_asks WHERE user_id = ? AND status = 'ok' AND seen = 0 ORDER BY id DESC").bind(uid).all()).results;
  return r.length ? { n: r.length, id: r[0].id, q: parse(r[0].tr, {}).q || {} } : null;
}

// h: json, fail, currentUser, needUser, isAdmin, now, translate(texts, from, langs) → { tr: {lang: [..]} }
export async function aboutChatApi(req, env, url, h) {
  const p = url.pathname, m = req.method, { json, fail } = h;
  const rowOf = async uid => {
    const r = await env.DB.prepare('SELECT opened FROM about_chat WHERE user_id = ?').bind(uid).first();
    return parse(r && r.opened, []).filter(k => KEY.test(k));
  };
  if (m === 'GET' && p === '/api/about-chat/extra') {
    const rows = (await env.DB.prepare("SELECT a.id, a.tr, u.nick FROM about_asks a JOIN users u ON u.id = a.user_id WHERE a.status = 'ok' ORDER BY a.answered_at").all()).results;
    const questions = rows.map(r => ({ id: 'u' + r.id, nick: r.nick || '', ...parse(r.tr, {}) })).filter(x => x.q);
    return json({ questions }, 200, { 'cache-control': 'public, max-age=120' });
  }
  if (m === 'GET' && p === '/api/about-chat') {
    const u = await h.currentUser(req, env);
    if (!u) return json({ opened: [], user: false, asks: [] }, 200, { 'cache-control': 'no-store' });
    const asks = (await env.DB.prepare('SELECT id, text, status, tr, seen FROM about_asks WHERE user_id = ? ORDER BY id DESC LIMIT 30').bind(u.id).all()).results
      .map(r => ({ id: 'u' + r.id, text: r.text, status: r.status, fresh: r.status === 'ok' && !r.seen }));
    if (asks.some(a => a.fresh)) await env.DB.prepare("UPDATE about_asks SET seen = 1 WHERE user_id = ? AND status = 'ok' AND seen = 0").bind(u.id).run(); // открыл чат — ответы увидены
    return json({ opened: await rowOf(u.id), user: true, nick: u.nick || '', asks }, 200, { 'cache-control': 'no-store' });
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
    return json({ opened });
  }
  if (m === 'POST' && p === '/api/about-chat/ask') {
    const u = await h.needUser(req, env);
    if (!u.nick || u.banned) fail(400, 'nick');
    const b = await req.json().catch(() => ({}));
    const text = String(b.text || '').replace(/\s+/g, ' ').trim().slice(0, ASK_LEN);
    if (text.length < ASK_MIN) fail(400, 'short');
    const wait = (await env.DB.prepare("SELECT COUNT(*) AS n FROM about_asks WHERE user_id = ? AND status = 'new'").bind(u.id).first()).n;
    if (wait >= ASK_WAIT) fail(429, 'wait');
    const day = (await env.DB.prepare('SELECT COUNT(*) AS n FROM about_asks WHERE user_id = ? AND created_at > ?').bind(u.id, h.now() - 86400).first()).n;
    if (day >= ASK_DAY) fail(429, 'many');
    const low = text.toLowerCase(); // lower() в SQLite не знает кириллицы — сравниваем здесь
    const same = (await env.DB.prepare("SELECT id, text FROM about_asks WHERE user_id = ? AND status != 'no'").bind(u.id).all()).results.find(r => r.text.toLowerCase() === low);
    if (same) return json({ ok: true, id: 'u' + same.id, dup: true });
    const lang = LANGS.includes(b.lang) ? b.lang : langOf(text);
    const r = await env.DB.prepare('INSERT INTO about_asks (user_id, text, lang, created_at) VALUES (?, ?, ?, ?)').bind(u.id, text, lang, h.now()).run();
    return json({ ok: true, id: 'u' + r.meta.last_row_id });
  }
  if (p === '/api/admin/about-asks') {
    const u = await h.needUser(req, env);
    if (!(await h.isAdmin(u, env))) fail(403, 'admin');
    if (m === 'GET') {
      const st = ['new', 'ok', 'no'].includes(url.searchParams.get('status')) ? url.searchParams.get('status') : 'new';
      const rows = (await env.DB.prepare(`SELECT a.*, u.nick FROM about_asks a JOIN users u ON u.id = a.user_id WHERE a.status = ? ORDER BY a.created_at ${st === 'new' ? 'ASC' : 'DESC'} LIMIT 300`).bind(st).all()).results;
      const n = (await env.DB.prepare('SELECT status, COUNT(*) AS n FROM about_asks GROUP BY status').all()).results;
      return json({
        asks: rows.map(r => { const t = parse(r.tr, {}); return { id: r.id, nick: r.nick, text: r.text, lang: r.lang, status: r.status, at: r.created_at, answered: r.answered_at, q: (t.q || {}).ru || '', a: (t.a || {}).ru || '', p: (t.p || {}).ru || '', langs: Object.keys(t.q || {}) }; }),
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
