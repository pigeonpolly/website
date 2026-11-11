// 📣 Рассылка (10.11.2026, docs/bird.md «Рассылка»): сообщение от Алины на 3 языках (+ файл до 20 МБ) птичкам с ником —
// всем / новым (зарегистрировались за N дней) / старым. На сайте — в «конвертике» (news.js, вид note), по желанию ещё и письмом
// тем, кто согласился на «Новости от Полли» (mail_out с границами aud_from/aud_to, worker/mail.js). Подарок и пуговки с тем же «кому» —
// /api/admin/gift-all и /api/admin/salary (поля aud, days, audWhere ниже).
export const NOTE_TABLES = [
  // L — JSON {en: {s, t}, ru, lv}; file_* — вложение в R2 (MEDIA, ключ notes/<случайный>/<имя>, /media/notes/ закрыт); aud — all|new|old
  'CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, L TEXT NOT NULL, file_key TEXT, file_name TEXT, file_size INTEGER DEFAULT 0, file_type TEXT, aud TEXT DEFAULT \'all\', days INTEGER DEFAULT 0, total INTEGER DEFAULT 0, mail_id INTEGER, created_at INTEGER)',
  'CREATE TABLE IF NOT EXISTS note_to (note_id INTEGER NOT NULL, user_id INTEGER NOT NULL, seen_at INTEGER DEFAULT 0, PRIMARY KEY (note_id, user_id))',
  'CREATE INDEX IF NOT EXISTS note_to_user ON note_to(user_id, seen_at)',
];
export const NOTE_ALTER = ['ALTER TABLE mail_out ADD COLUMN aud_from INTEGER DEFAULT 0', 'ALTER TABLE mail_out ADD COLUMN aud_to INTEGER DEFAULT 0', 'ALTER TABLE mail_out ADD COLUMN aud_ids TEXT']; // aud_ids — «отмеченным»: id через запятую
export const NOTE_FILE_MAX = 20 * 1024 * 1024;
const SITE = 'https://www.pigeonpolly.com';
const LANGS = ['en', 'ru', 'lv'];

// «кому»: границы даты регистрации [from, to) — all: все, new: за последние N дней, old: раньше N дней назад
// pick — отмеченные в «🐦 Птицах» (b.uids — id птичек, до 5000)
export const audIds = b => [...new Set((Array.isArray(b && b.uids) ? b.uids : String((b && b.uids) || '').split(',')).map(x => Math.floor(Number(x))).filter(x => x > 0))].slice(0, 5000);
export function audRange(b, t) {
  if (b && b.aud === 'pick') { const ids = audIds(b); return { aud: 'pick', days: ids.length, from: 0, to: t + 1, ids }; }
  const aud = ['new', 'old'].includes(b && b.aud) ? b.aud : 'all';
  const days = Math.min(3650, Math.max(1, Math.floor(Number(b && b.days) || 30)));
  const cut = t - days * 86400;
  return { aud, days: aud === 'all' ? 0 : days, from: aud === 'new' ? cut : 0, to: aud === 'old' ? cut : t + 1 };
}
// условие для SQL по таблице users (алиас a): птички с ником, не заблокированные, в границах «кому»
export function audWhere(b, t, a = '') {
  const r = audRange(b, t), p = a ? a + '.' : '';
  const pick = r.ids ? ` AND ${p}id IN (${r.ids.join(',') || 0})` : '';
  return { sql: `${p}banned = 0 AND ${p}nick IS NOT NULL AND ${p}nick != '' AND COALESCE(${p}created_at, 0) >= ${r.from} AND COALESCE(${p}created_at, 0) < ${r.to}${pick}`, ...r };
}

const pickL = (L, lang) => { const x = L[lang] || {}; return x.s && x.s.trim() ? x : L.en || {}; };
const fileOut = n => n.file_key ? { name: n.file_name, size: n.file_size, url: '/api/note/file?id=' + n.id } : null;

// непрочитанные сообщения — для «конвертика» (worker/index.js NEWS_KINDS note)
export async function noteNews(env, u, lang) {
  const rows = (await env.DB.prepare('SELECT n.* FROM note_to t JOIN notes n ON n.id = t.note_id WHERE t.user_id = ? AND t.seen_at = 0 ORDER BY n.id DESC LIMIT 10').bind(u.id).all().catch(() => ({ results: [] }))).results;
  if (!rows.length) return null;
  return { n: rows.length, items: rows.map(n => { const L = pickL(JSON.parse(n.L), lang); return { id: n.id, s: L.s, t: L.t, file: fileOut(n), at: n.created_at }; }) };
}
// уже прочитанные — для «Мои новости» (newsHistory)
export async function noteHistory(env, u, lang, limit) {
  const rows = (await env.DB.prepare('SELECT n.*, t.seen_at FROM note_to t JOIN notes n ON n.id = t.note_id WHERE t.user_id = ? AND t.seen_at > 0 ORDER BY t.seen_at DESC LIMIT ?').bind(u.id, limit).all().catch(() => ({ results: [] }))).results;
  return rows.map(n => { const L = pickL(JSON.parse(n.L), lang); return { kind: 'note', n: 1, items: [{ id: n.id, s: L.s, t: L.t, file: fileOut(n), at: n.created_at }], at: n.seen_at }; });
}

export async function notesApi(req, env, url, h) {
  const p = url.pathname, m = req.method;
  // птичка: прочитано / скачать файл (только получателю или админу)
  if (m === 'POST' && p === '/api/note/seen') {
    const u = await h.needUser(req, env);
    const b = await req.json().catch(() => ({}));
    const ids = (Array.isArray(b.ids) ? b.ids : [b.id]).map(Number).filter(x => x > 0).slice(0, 20);
    for (const id of ids) await env.DB.prepare('UPDATE note_to SET seen_at = ? WHERE note_id = ? AND user_id = ? AND seen_at = 0').bind(h.now(), id, u.id).run();
    return h.json({ ok: true });
  }
  if (m === 'GET' && p === '/api/note/file') {
    const u = await h.needUser(req, env);
    const id = Number(url.searchParams.get('id')) || 0;
    const n = await env.DB.prepare('SELECT * FROM notes WHERE id = ?').bind(id).first();
    if (!n || !n.file_key) h.fail(404, 'file');
    if (!(await h.isAdmin(u, env)) && !(await env.DB.prepare('SELECT 1 FROM note_to WHERE note_id = ? AND user_id = ?').bind(id, u.id).first())) h.fail(403, 'file');
    const obj = env.MEDIA && await env.MEDIA.get(n.file_key);
    if (!obj) h.fail(404, 'file');
    return new Response(obj.body, { headers: { 'content-type': n.file_type || 'application/octet-stream', 'content-disposition': `attachment; filename*=UTF-8''${encodeURIComponent(n.file_name || 'file')}`, 'cache-control': 'private, no-store' } });
  }
  if (!p.startsWith('/api/admin/notes')) return null;
  const a = await h.needUser(req, env); if (!(await h.isAdmin(a, env))) h.fail(403, 'admin');
  const t = h.now();
  if (m === 'GET' && p === '/api/admin/notes') { // сколько птичек в каждой группе и в т. ч. согласных на письма; последние рассылки
    const b = { aud: url.searchParams.get('aud'), days: url.searchParams.get('days'), uids: url.searchParams.get('uids') };
    const w = audWhere(b, t);
    const c = await env.DB.prepare(`SELECT COUNT(*) AS n, SUM(mail_news = 1 AND email IS NOT NULL AND email != '') AS mail FROM users WHERE ${w.sql}`).first();
    const list = (await env.DB.prepare('SELECT n.id, n.L, n.file_name, n.file_size, n.aud, n.days, n.total, n.created_at, n.mail_id, (SELECT COUNT(*) FROM note_to x WHERE x.note_id = n.id AND x.seen_at > 0) AS seen, mo.sent AS mail_sent, mo.total AS mail_total FROM notes n LEFT JOIN mail_out mo ON mo.id = n.mail_id ORDER BY n.id DESC LIMIT 30').all()).results
      .map(n => ({ ...n, subject: (JSON.parse(n.L).en || {}).s || '', L: undefined }));
    return h.json({ count: c.n || 0, mail: c.mail || 0, mailOn: !!(env.RESEND_KEY && env.MAIL_FROM), media: !!env.MEDIA, max: NOTE_FILE_MAX, list });
  }
  if (m !== 'POST') return null;
  if (p === '/api/admin/notes/file') { // файл — сырым телом, имя в ?name=; возвращает ключ для /send
    if (!env.MEDIA) h.fail(400, 'media');
    const len = Number(req.headers.get('content-length') || 0);
    if (len > NOTE_FILE_MAX) h.fail(413, 'too_big');
    const buf = await req.arrayBuffer();
    if (!buf.byteLength) h.fail(400, 'empty');
    if (buf.byteLength > NOTE_FILE_MAX) h.fail(413, 'too_big');
    const name = String(url.searchParams.get('name') || 'file').replace(/[\\/\0-\x1f"]/g, '_').slice(0, 120) || 'file';
    const rnd = [...crypto.getRandomValues(new Uint8Array(16))].map(x => x.toString(16).padStart(2, '0')).join('');
    const key = `notes/${rnd}/${name}`;
    const type = (req.headers.get('content-type') || 'application/octet-stream').slice(0, 100);
    await env.MEDIA.put(key, buf, { httpMetadata: { contentType: type } });
    return h.json({ ok: true, key, name, size: buf.byteLength, type });
  }
  if (p === '/api/admin/notes/send') {
    const b = await req.json().catch(() => ({}));
    const L = {};
    for (const l of LANGS) { const x = (b.L || {})[l] || {}; L[l] = { s: String(x.s || '').trim().slice(0, 200), t: String(x.t || '').trim().slice(0, 20000) }; }
    if (!L.en.s || !L.en.t) h.fail(400, 'en');
    const f = b.file && /^notes\/[0-9a-f]{32}\//.test(String(b.file.key || '')) ? b.file : null;
    const w = audWhere(b, t);
    const r = await env.DB.prepare('INSERT INTO notes (L, file_key, file_name, file_size, file_type, aud, days, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(JSON.stringify(L), f ? f.key : null, f ? String(f.name || 'file').slice(0, 120) : null, f ? Number(f.size) || 0 : 0, f ? String(f.type || '').slice(0, 100) : null, w.aud, w.days, t).run();
    const id = r.meta.last_row_id;
    const ins = await env.DB.prepare(`INSERT OR IGNORE INTO note_to (note_id, user_id) SELECT ?, id FROM users WHERE ${w.sql}`).bind(id).run();
    const total = ins.meta.changes || 0;
    let mailId = null, mailTotal = 0;
    if (b.mail && env.RESEND_KEY && env.MAIL_FROM) { // письмо — только согласившимся на «Новости от Полли», те же границы «кому»
      const ML = {};
      const more = { en: 'Read it on the site (you need to be signed in):', ru: 'Прочитать на сайте (нужно войти):', lv: 'Lasīt vietnē (jāienāk):' };
      const att = { en: 'There is a file attached — download it on the site.', ru: 'К сообщению приложен файл — скачать его можно на сайте.', lv: 'Ziņai pievienots fails — to var lejupielādēt vietnē.' };
      for (const l of LANGS) if (L[l].s && L[l].t) ML[l] = { s: L[l].s, t: L[l].t + (f ? '\n\n' + att[l] : '') + '\n\n' + more[l] + ' ' + SITE + (l === 'en' ? '' : '/' + l) + '/bird/' };
      mailTotal = (await env.DB.prepare(`SELECT COUNT(*) AS n FROM users WHERE ${w.sql} AND mail_news = 1 AND email IS NOT NULL AND email != ''`).first()).n || 0;
      const mo = await env.DB.prepare("INSERT INTO mail_out (cat, L, status, total, created_at, aud_from, aud_to, aud_ids) VALUES ('news', ?, 'send', ?, ?, ?, ?, ?)").bind(JSON.stringify(ML), mailTotal, t, w.from, w.to, w.ids ? w.ids.join(',') || '0' : null).run();
      mailId = mo.meta.last_row_id;
    }
    await env.DB.prepare('UPDATE notes SET total = ?, mail_id = ? WHERE id = ?').bind(total, mailId, id).run();
    return h.json({ ok: true, id, total, mail: mailId ? mailTotal : 0, runMail: !!mailId });
  }
  if (p === '/api/admin/notes/delete') { // убрать из «конвертиков» (у тех, кто ещё не открыл, и из истории), файл удалить
    const b = await req.json().catch(() => ({}));
    const n = await env.DB.prepare('SELECT * FROM notes WHERE id = ?').bind(Number(b.id) || 0).first();
    if (!n) h.fail(404, 'note');
    if (n.file_key && env.MEDIA) await env.MEDIA.delete(n.file_key).catch(() => {});
    await env.DB.batch([env.DB.prepare('DELETE FROM note_to WHERE note_id = ?').bind(n.id), env.DB.prepare('DELETE FROM notes WHERE id = ?').bind(n.id),
      env.DB.prepare("UPDATE mail_out SET status = 'stop' WHERE id = ? AND status = 'send'").bind(n.mail_id || 0)]);
    return h.json({ ok: true });
  }
  return null;
}
