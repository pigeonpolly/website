// Чат «Поболтать с Алиной и Полли» на /about-me/ (site/assets/about-desk.js, docs/site.md): какие вопросы птичка уже открыла.
// Ключ — «a:q012» (ответ Алины) или «p:q012» (ответ Полли). Гость копит в sessionStorage, после входа всё сливается сюда.
// API: GET /api/about-chat → {opened, user}; POST /api/about-chat {add: [ключи]} → {opened}.

export const ABOUT_CHAT_TABLES = [
  'CREATE TABLE IF NOT EXISTS about_chat (user_id INTEGER PRIMARY KEY, opened TEXT, updated_at INTEGER)',
];
const KEY = /^[ap]:q\d{3,4}$/, MAX = 1000;
const parse = s => { try { return JSON.parse(s) || []; } catch (e) { return []; } };

// h: json, fail, currentUser, needUser
export async function aboutChatApi(req, env, url, h) {
  const { json, fail } = h;
  const rowOf = async uid => {
    const r = await env.DB.prepare('SELECT opened FROM about_chat WHERE user_id = ?').bind(uid).first();
    return parse(r && r.opened).filter(k => KEY.test(k));
  };
  if (req.method === 'GET') {
    const u = await h.currentUser(req, env);
    return json({ opened: u ? await rowOf(u.id) : [], user: !!u }, 200, { 'cache-control': 'no-store' });
  }
  if (req.method !== 'POST') return null;
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
