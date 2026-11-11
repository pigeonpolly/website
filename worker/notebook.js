// 📒 Блокнот в учебниках (/study/, /english/, /norsk/, /nederlands/; docs/site.md «Блокнот в учебниках»). Клиент — content/shared/notebook.js.
// Хранится ОТДЕЛЬНО от прогресса (study_progress / english_progress / norsk_progress не трогаем): своя таблица, строка на страницу.
// page_id '_' — служебная строка книги: { cleared — когда очистили весь блокнот, del — {id: время удаления} }.
// Слияние по времени t: старая запись никогда не затирает новую (два устройства, повторная отправка, sendBeacon).
import { studyOk } from './study.js';
import { englishOk } from './english.js';
import { norskOk } from './norsk.js';
import { nederlandsOk } from './nederlands.js';

export const NOTEBOOK_TABLES = [
  'CREATE TABLE IF NOT EXISTS textbook_notes (user_id INTEGER NOT NULL, book TEXT NOT NULL, page_id TEXT NOT NULL, data TEXT, t INTEGER NOT NULL, PRIMARY KEY (user_id, book, page_id))',
];
const BOOKS = { study: studyOk, english: englishOk, norsk: norskOk, nederlands: nederlandsOk };
const ID = /^[a-z0-9]{4,24}$/, MAX_HTML = 600000, MAX_PAGES = 3000, MAX_DEL = 5000;

const cleanPage = p => {
  if (!p || !ID.test(String(p.id)) || !(+p.t > 0)) return null;
  const html = String(p.html || '');
  if (html.length > MAX_HTML) return null;
  return { id: String(p.id), title: String(p.title || '').slice(0, 200), html, t: Math.round(+p.t), c: Math.round(+p.c || +p.t), mark: !!p.mark, at: String(p.at || '').slice(0, 200), nb: ID.test(String(p.nb || '')) ? String(p.nb) : '', kind: p.kind === 'book' ? 'book' : '' }; // kind 'book' — блокнот (title), иначе страница блокнота nb
};

// h: json, fail, currentUser, isAdmin, adminIdentity
export async function notebookApi(req, env, url, h) {
  const book = url.searchParams.get('book') || '';
  if (!BOOKS[book]) h.fail(400, 'book');
  const u = await h.currentUser(req, env);
  if (!(await BOOKS[book](u, env, h))) h.fail(u ? 403 : 401, u ? 'forbidden' : 'login');
  const db = env.DB, noStore = { 'cache-control': 'no-store' };
  const metaOf = async () => {
    const r = await db.prepare("SELECT data FROM textbook_notes WHERE user_id = ? AND book = ? AND page_id = '_'").bind(u.id, book).first();
    let m = {}; try { m = JSON.parse((r && r.data) || '{}') || {}; } catch (e) { m = {}; }
    return { cleared: +m.cleared || 0, del: m.del && typeof m.del === 'object' ? m.del : {} };
  };
  if (req.method === 'GET') {
    const r = await db.prepare("SELECT data FROM textbook_notes WHERE user_id = ? AND book = ? AND page_id != '_'").bind(u.id, book).all();
    const pages = [];
    for (const x of r.results || []) { try { const p = cleanPage(JSON.parse(x.data)); if (p) pages.push(p); } catch (e) { /* битая строка — пропуск */ } }
    return h.json({ uid: String(u.id), pages, meta: await metaOf() }, 200, noStore);
  }
  if (req.method !== 'POST') return null;
  let b = {}; try { b = JSON.parse(await req.text()) || {}; } catch (e) { h.fail(400, 'json'); } // text: sendBeacon шлёт без application/json
  const meta = await metaOf(), ops = [];
  const cleared = Math.max(meta.cleared, Math.round(+b.cleared) || 0);
  const del = { ...meta.del };
  for (const [id, t] of Object.entries(b.del && typeof b.del === 'object' ? b.del : {})) if (ID.test(id) && +t > 0) del[id] = Math.max(+del[id] || 0, Math.round(+t));
  const keep = Object.entries(del).sort((a, b2) => b2[1] - a[1]).slice(0, MAX_DEL); // старые отметки об удалении — забываем
  const meta2 = { cleared, del: Object.fromEntries(keep) };
  if (cleared > meta.cleared) ops.push(db.prepare("DELETE FROM textbook_notes WHERE user_id = ? AND book = ? AND page_id != '_' AND t <= ?").bind(u.id, book, cleared));
  for (const [id, t] of keep) if (t > (+meta.del[id] || 0)) ops.push(db.prepare('DELETE FROM textbook_notes WHERE user_id = ? AND book = ? AND page_id = ? AND t <= ?').bind(u.id, book, id, t));
  const cnt = await db.prepare("SELECT COUNT(*) n FROM textbook_notes WHERE user_id = ? AND book = ? AND page_id != '_'").bind(u.id, book).first();
  let room = MAX_PAGES - ((cnt && cnt.n) || 0), skipped = 0;
  for (const raw of (Array.isArray(b.pages) ? b.pages : []).slice(0, 200)) {
    const p = cleanPage(raw);
    if (!p) { skipped++; continue; }
    if (p.t <= cleared || p.t <= (+meta2.del[p.id] || 0)) continue; // удалённое раньше не воскрешаем
    if (room <= 0) { skipped++; continue; }
    room--; // грубо: обновление существующей тоже считаем — лимит щедрый
    ops.push(db.prepare(`INSERT INTO textbook_notes (user_id, book, page_id, data, t) VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id, book, page_id) DO UPDATE SET data = excluded.data, t = excluded.t WHERE excluded.t > textbook_notes.t`).bind(u.id, book, p.id, JSON.stringify(p), p.t));
  }
  ops.push(db.prepare(`INSERT INTO textbook_notes (user_id, book, page_id, data, t) VALUES (?, ?, '_', ?, ?)
    ON CONFLICT(user_id, book, page_id) DO UPDATE SET data = excluded.data, t = excluded.t`).bind(u.id, book, JSON.stringify(meta2), Date.now()));
  await db.batch(ops);
  return h.json({ ok: true, skipped }, 200, noStore);
}
