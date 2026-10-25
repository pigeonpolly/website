// «Art-Pill by Polly» (/art-pill/, site/assets/artpill.js, docs/artpill.md): скетчбуки ИИ посетителей и отзывы о таблетке.
// Птичка (тот же профиль сайта) заводит скетчбук своего ИИ: имя ИИ, модель, версия таблетки, как ИИ нашёл свой стиль;
// добавляет страницы — рисунок (полная + превью, как в челлендже) и заметки петли. Отзыв о таблетке — текст + оценка 1–5.
// Удаляет хозяин или админ. Всё видно сразу (без проверки); при удалении аккаунта — artpillDrop.
// API: GET /api/artpill, GET /api/artpill/book?id=, POST /api/artpill/book, POST /api/artpill/page, POST /api/artpill/review, POST /api/artpill/del.

export const ARTPILL_TABLES = [
  'CREATE TABLE IF NOT EXISTS ap_books (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, ai TEXT NOT NULL, model TEXT, pill TEXT, style TEXT, created_at INTEGER, updated_at INTEGER)',
  'CREATE INDEX IF NOT EXISTS ap_books_u ON ap_books (user_id)',
  'CREATE TABLE IF NOT EXISTS ap_pages (id INTEGER PRIMARY KEY AUTOINCREMENT, book_id INTEGER NOT NULL, user_id INTEGER NOT NULL, img TEXT NOT NULL, note TEXT, created_at INTEGER)',
  'CREATE INDEX IF NOT EXISTS ap_pages_b ON ap_pages (book_id)',
  'CREATE TABLE IF NOT EXISTS ap_reviews (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, pill TEXT, stars INTEGER, text TEXT NOT NULL, created_at INTEGER)',
];
// версии таблетки, которые можно выбрать (новая версия — дописать сюда и в site/assets/artpill.js VERSIONS)
export const ARTPILL_VERSIONS = ['0.1'];
const BOOKS_MAX = 5, PAGES_DAY_MAX = 30, REVIEWS_DAY_MAX = 5, PAGES_MAX = 500;
const str = (v, n) => String(v || '').trim().slice(0, n);

const bookOut = r => ({ id: r.id, nick: r.nick, ai: r.ai, model: r.model || '', pill: r.pill || '', style: r.style || '', n: r.n || 0, cover: r.cover || '', at: r.created_at, upd: r.updated_at });

// удаление аккаунта: скетчбуки, страницы (и их картинки), отзывы
export async function artpillDrop(env, uid, imgDrop) {
  const imgs = (await env.DB.prepare('SELECT img FROM ap_pages WHERE user_id = ?').bind(uid).all().catch(() => ({ results: [] }))).results;
  await Promise.all(imgs.map(x => imgDrop(x.img).catch(() => {})));
  await env.DB.batch([
    env.DB.prepare('DELETE FROM ap_pages WHERE user_id = ?').bind(uid),
    env.DB.prepare('DELETE FROM ap_books WHERE user_id = ?').bind(uid),
    env.DB.prepare('DELETE FROM ap_reviews WHERE user_id = ?').bind(uid),
  ]).catch(() => {});
}
// экспорт данных птички
export async function artpillExport(env, uid) {
  const q = sql => env.DB.prepare(sql).bind(uid).all().then(r => r.results).catch(() => []);
  return { books: await q('SELECT id, ai, model, pill, style, created_at FROM ap_books WHERE user_id = ?'), pages: await q('SELECT id, book_id, img, note, created_at FROM ap_pages WHERE user_id = ?'), reviews: await q('SELECT id, pill, stars, text, created_at FROM ap_reviews WHERE user_id = ?') };
}

// h: json, fail, currentUser, needUser, isAdmin, imgPut, imgDrop(id), randomHex, now
export async function artpillApi(req, env, url, h) {
  const p = url.pathname, m = req.method, { json, fail } = h;
  const NS = { 'cache-control': 'no-store' };
  const cover = '(SELECT img FROM ap_pages x WHERE x.book_id = b.id ORDER BY x.id DESC LIMIT 1) AS cover, (SELECT COUNT(*) FROM ap_pages x WHERE x.book_id = b.id) AS n';
  if (m === 'GET' && p === '/api/artpill') {
    const u = await h.currentUser(req, env);
    const books = (await env.DB.prepare(`SELECT b.*, u.nick, ${cover} FROM ap_books b JOIN users u ON u.id = b.user_id WHERE COALESCE(u.banned, 0) = 0 ORDER BY b.updated_at DESC LIMIT 200`).all()).results;
    const reviews = (await env.DB.prepare('SELECT r.*, u.nick FROM ap_reviews r JOIN users u ON u.id = r.user_id WHERE COALESCE(u.banned, 0) = 0 ORDER BY r.id DESC LIMIT 100').all()).results;
    const me = u && u.nick && !u.banned ? { nick: u.nick, admin: await h.isAdmin(u, env), books: books.filter(b => b.user_id === u.id).map(b => b.id) } : null;
    return json({ me, versions: ARTPILL_VERSIONS, books: books.filter(b => b.n > 0 || (me && b.user_id === u.id)).map(bookOut),
      reviews: reviews.map(r => ({ id: r.id, nick: r.nick, pill: r.pill || '', stars: r.stars || 0, text: r.text, at: r.created_at, mine: !!(me && r.user_id === u.id) })) }, 200, NS);
  }
  if (m === 'GET' && p === '/api/artpill/book') {
    const u = await h.currentUser(req, env);
    const b = await env.DB.prepare(`SELECT b.*, u.nick, ${cover} FROM ap_books b JOIN users u ON u.id = b.user_id WHERE b.id = ? AND COALESCE(u.banned, 0) = 0`).bind(Number(url.searchParams.get('id'))).first();
    if (!b) fail(404, 'book');
    const pages = (await env.DB.prepare('SELECT id, img, note, created_at FROM ap_pages WHERE book_id = ? ORDER BY id').bind(b.id).all()).results;
    return json({ book: bookOut(b), mine: !!(u && u.id === b.user_id), pages: pages.map(x => ({ id: x.id, img: x.img, note: x.note || '', at: x.created_at })) }, 200, NS);
  }
  if (m === 'POST' && p === '/api/artpill/book') {
    const u = await h.needUser(req, env);
    if (!u.nick) fail(400, 'nick');
    const b = await req.json().catch(() => ({}));
    const ai = str(b.ai, 60), model = str(b.model, 80), style = str(b.style, 4000);
    const pill = ARTPILL_VERSIONS.includes(b.pill) ? b.pill : ARTPILL_VERSIONS[ARTPILL_VERSIONS.length - 1];
    if (!ai) fail(400, 'ai');
    if (b.id) {
      const row = await env.DB.prepare('SELECT id, user_id FROM ap_books WHERE id = ?').bind(Number(b.id)).first();
      if (!row || row.user_id !== u.id) fail(404, 'book');
      await env.DB.prepare('UPDATE ap_books SET ai = ?, model = ?, pill = ?, style = ?, updated_at = ? WHERE id = ?').bind(ai, model, pill, style, h.now(), row.id).run();
      return json({ ok: true, id: row.id });
    }
    const n = (await env.DB.prepare('SELECT COUNT(*) AS n FROM ap_books WHERE user_id = ?').bind(u.id).first()).n;
    if (n >= BOOKS_MAX) fail(429, 'many');
    const r = await env.DB.prepare('INSERT INTO ap_books (user_id, ai, model, pill, style, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(u.id, ai, model, pill, style, h.now(), h.now()).run();
    return json({ ok: true, id: r.meta.last_row_id });
  }
  if (m === 'POST' && p === '/api/artpill/page') {
    const u = await h.needUser(req, env);
    if (!u.nick) fail(400, 'nick');
    const f = await req.formData(), full = f.get('full'), thumb = f.get('thumb');
    const book = await env.DB.prepare('SELECT id, user_id FROM ap_books WHERE id = ?').bind(Number(f.get('book'))).first();
    if (!book || book.user_id !== u.id) fail(404, 'book');
    if (!full || !thumb || full.size > 6e6 || thumb.size > 2e6) fail(400, 'img');
    const day = (await env.DB.prepare('SELECT COUNT(*) AS n FROM ap_pages WHERE user_id = ? AND created_at > ?').bind(u.id, h.now() - 86400).first()).n;
    if (day >= PAGES_DAY_MAX) fail(429, 'many');
    const all = (await env.DB.prepare('SELECT COUNT(*) AS n FROM ap_pages WHERE book_id = ?').bind(book.id).first()).n;
    if (all >= PAGES_MAX) fail(429, 'full');
    const img = h.randomHex(12);
    await h.imgPut(env, img, await full.arrayBuffer(), await thumb.arrayBuffer());
    await env.DB.batch([
      env.DB.prepare('INSERT INTO ap_pages (book_id, user_id, img, note, created_at) VALUES (?, ?, ?, ?, ?)').bind(book.id, u.id, img, str(f.get('note'), 2000), h.now()),
      env.DB.prepare('UPDATE ap_books SET updated_at = ? WHERE id = ?').bind(h.now(), book.id),
    ]);
    return json({ ok: true, img });
  }
  if (m === 'POST' && p === '/api/artpill/review') {
    const u = await h.needUser(req, env);
    if (!u.nick) fail(400, 'nick');
    const b = await req.json().catch(() => ({}));
    const text = str(b.text, 2000), stars = Math.max(0, Math.min(5, Math.round(Number(b.stars) || 0)));
    if (!text) fail(400, 'text');
    const day = (await env.DB.prepare('SELECT COUNT(*) AS n FROM ap_reviews WHERE user_id = ? AND created_at > ?').bind(u.id, h.now() - 86400).first()).n;
    if (day >= REVIEWS_DAY_MAX) fail(429, 'many');
    await env.DB.prepare('INSERT INTO ap_reviews (user_id, pill, stars, text, created_at) VALUES (?, ?, ?, ?, ?)').bind(u.id, ARTPILL_VERSIONS.includes(b.pill) ? b.pill : '', stars || null, text, h.now()).run();
    return json({ ok: true });
  }
  if (m === 'POST' && p === '/api/artpill/del') {
    const u = await h.needUser(req, env);
    const b = await req.json().catch(() => ({})), id = Number(b.id);
    const table = { book: 'ap_books', page: 'ap_pages', review: 'ap_reviews' }[b.kind];
    if (!table) fail(400, 'kind');
    const row = await env.DB.prepare(`SELECT * FROM ${table} WHERE id = ?`).bind(id).first();
    if (!row) fail(404, 'row');
    if (row.user_id !== u.id && !(await h.isAdmin(u, env))) fail(403, 'owner');
    if (b.kind === 'book') {
      const imgs = (await env.DB.prepare('SELECT img FROM ap_pages WHERE book_id = ?').bind(id).all()).results;
      await Promise.all(imgs.map(x => h.imgDrop(x.img).catch(() => {})));
      await env.DB.batch([env.DB.prepare('DELETE FROM ap_pages WHERE book_id = ?').bind(id), env.DB.prepare('DELETE FROM ap_books WHERE id = ?').bind(id)]);
    } else {
      if (b.kind === 'page') await h.imgDrop(row.img).catch(() => {});
      await env.DB.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
    }
    return json({ ok: true });
  }
  return null;
}
