// «Школа Полли» (/polly-helps/, site/assets/polly-school.js, docs/challenge.md): сдача работ и проверка Алиной.
// Ученик сдаёт фото страницы к уроку (полная + превью, как в челлендже) с запиской; Алина в кабинете «🎓 Школа»
// ставит печать (ok) или возвращает на доработку (redo) с комментарием. Ученику — новость «school», пока не открыл /polly-helps/.
// Пересдача после «на доработку» — новая строка (прежние попытки видны Алине); пока работа ждёт — замена той же строки.
// API: GET /api/school, POST /api/school/hand, GET /api/admin/school, POST /api/admin/school/check.

export const SCHOOL_TABLES = [
  // status: wait — у Алины, ok — печать, redo — на доработку; seen = 0 — вердикт ученик ещё не видел
  "CREATE TABLE IF NOT EXISTS school_works (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, lesson INTEGER NOT NULL, img TEXT NOT NULL, note TEXT, status TEXT DEFAULT 'wait', comment TEXT, created_at INTEGER, checked_at INTEGER, seen INTEGER DEFAULT 1)",
  'CREATE INDEX IF NOT EXISTS school_works_u ON school_works (user_id, lesson)',
  'CREATE INDEX IF NOT EXISTS school_works_s ON school_works (status)',
];
export const SCHOOL_LESSONS = 12, SCHOOL_DAY_MAX = 20; // уроков; сдач в сутки на птичку

const last = rows => { const m = {}; for (const r of rows) m[r.lesson] = r; return m; }; // rows по id → последняя попытка урока

// новость ученику: вердикт Алины, который ещё не видел
export async function schoolNews(env, uid) {
  const r = (await env.DB.prepare('SELECT lesson, status FROM school_works WHERE user_id = ? AND seen = 0 ORDER BY id DESC').bind(uid).all()).results;
  return r.length ? { n: r.length, lesson: r[0].lesson, ok: r.filter(x => x.status === 'ok').length, redo: r.filter(x => x.status === 'redo').length } : null;
}

// h: json, fail, currentUser, needUser, isAdmin, imgPut, randomHex, now
export async function schoolApi(req, env, url, h) {
  const p = url.pathname, m = req.method, { json, fail } = h;
  if (m === 'GET' && p === '/api/school') {
    const u = await h.currentUser(req, env);
    if (!u || !u.nick || u.banned) return json({ me: false, works: [] }, 200, { 'cache-control': 'no-store' });
    const rows = (await env.DB.prepare('SELECT * FROM school_works WHERE user_id = ? ORDER BY id').bind(u.id).all()).results;
    const tries = {}; for (const r of rows) tries[r.lesson] = (tries[r.lesson] || 0) + 1;
    const works = Object.values(last(rows)).map(r => ({ lesson: r.lesson, status: r.status, comment: r.comment || '', img: r.img, note: r.note || '', at: r.created_at, checked: r.checked_at, tries: tries[r.lesson], fresh: !r.seen }));
    if (rows.some(r => !r.seen)) await env.DB.prepare('UPDATE school_works SET seen = 1 WHERE user_id = ? AND seen = 0').bind(u.id).run(); // открыл школу — вердикты увидены
    return json({ me: true, works }, 200, { 'cache-control': 'no-store' });
  }
  if (m === 'POST' && p === '/api/school/hand') {
    const u = await h.needUser(req, env);
    if (!u.nick || u.banned) fail(400, 'nick');
    const f = await req.formData(), lesson = Number(f.get('lesson')), full = f.get('full'), thumb = f.get('thumb');
    const note = String(f.get('note') || '').trim().slice(0, 500);
    if (!(lesson >= 1 && lesson <= SCHOOL_LESSONS) || !full || !thumb || full.size > 6e6 || thumb.size > 2e6) fail(400, 'img');
    const day = (await env.DB.prepare('SELECT COUNT(*) AS n FROM school_works WHERE user_id = ? AND created_at > ?').bind(u.id, h.now() - 86400).first()).n;
    if (day >= SCHOOL_DAY_MAX) fail(429, 'many');
    const prev = await env.DB.prepare('SELECT * FROM school_works WHERE user_id = ? AND lesson = ? ORDER BY id DESC LIMIT 1').bind(u.id, lesson).first();
    if (prev && prev.status === 'ok') fail(409, 'done');
    const img = h.randomHex(12);
    await h.imgPut(env, img, await full.arrayBuffer(), await thumb.arrayBuffer());
    if (prev && prev.status === 'wait') await env.DB.prepare('UPDATE school_works SET img = ?, note = ?, created_at = ? WHERE id = ?').bind(img, note, h.now(), prev.id).run(); // ещё не проверена — заменяем
    else await env.DB.prepare('INSERT INTO school_works (user_id, lesson, img, note, created_at) VALUES (?, ?, ?, ?, ?)').bind(u.id, lesson, img, note, h.now()).run();
    return json({ ok: true, lesson, status: 'wait', img });
  }
  if (p === '/api/admin/school' || p === '/api/admin/school/check') {
    const u = await h.needUser(req, env);
    if (!(await h.isAdmin(u, env))) fail(403, 'admin');
    if (m === 'GET') {
      const st = url.searchParams.get('status') || 'wait';
      const latest = 'w.id = (SELECT MAX(id) FROM school_works x WHERE x.user_id = w.user_id AND x.lesson = w.lesson)'; // только последняя попытка урока
      const rows = (await env.DB.prepare(`SELECT w.*, u.nick FROM school_works w JOIN users u ON u.id = w.user_id WHERE ${latest} AND ${['wait', 'ok', 'redo'].includes(st) ? 'w.status = ?' : '? IS NOT NULL'} ORDER BY w.created_at ${st === 'wait' ? 'ASC' : 'DESC'} LIMIT 200`).bind(st).all()).results;
      // прежние попытки тех же уроков — чтобы видеть, что исправлено
      const out = [];
      for (const r of rows) {
        const before = (await env.DB.prepare('SELECT img, comment, created_at FROM school_works WHERE user_id = ? AND lesson = ? AND id < ? ORDER BY id').bind(r.user_id, r.lesson, r.id).all()).results;
        out.push({ id: r.id, nick: r.nick, user: r.user_id, lesson: r.lesson, img: r.img, note: r.note || '', status: r.status, comment: r.comment || '', at: r.created_at, checked: r.checked_at, before });
      }
      const n = (await env.DB.prepare(`SELECT status, COUNT(*) AS n FROM school_works w WHERE ${latest} GROUP BY status`).all()).results;
      return json({ works: out, counts: Object.fromEntries(n.map(x => [x.status, x.n])) }, 200, { 'cache-control': 'no-store' });
    }
    if (m === 'POST') {
      const b = await req.json().catch(() => ({}));
      const status = b.status, comment = String(b.comment || '').trim().slice(0, 1000);
      if (!['ok', 'redo'].includes(status)) fail(400, 'status');
      if (status === 'redo' && !comment) fail(400, 'comment'); // на доработку — всегда с объяснением
      const upd = await env.DB.prepare('UPDATE school_works SET status = ?, comment = ?, checked_at = ?, seen = 0 WHERE id = ?').bind(status, comment, h.now(), Number(b.id)).run();
      if (!upd.meta.changes) fail(404, 'work');
      return json({ ok: true });
    }
  }
  return null;
}
