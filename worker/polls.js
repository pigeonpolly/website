// Опросы (docs/site.md «Опрос на главной», docs/admin.md «Опросы»): Алина в кабинете → «🗳 Опросы» создаёт опрос
// (вопрос и варианты на 3 языках — пустые переводятся сами), открывает, завершает, смотрит статистику; блок на главной
// можно скрыть целиком (meta poll_home = '0'). Голос — один с одного IP в каждом опросе (решение Алины), гостям тоже можно;
// у вошедшего — ещё и один на аккаунт. Результаты видят проголосовавшие, все — после завершения, админ — всегда.
// На главной (site/assets/poll.js): открытый опрос, а если его нет — последний завершённый (до 14 дней) с итогами.
// API: GET /api/poll?id=, POST /api/poll/vote {id, opt, idea, lang}; GET/POST /api/admin/polls.
// h: json, fail, currentUser, needUser, isAdmin, getMeta, setMeta, ipKey(req), randomHex, now, translate(texts, from, langs)
export const POLL_TABLES = [
  // q — {en, ru, lv}; opts — [{id, t: {en, ru, lv}}]; status: draft | open | closed; ideas — можно предложить свою тему; ends — завершится сам
  'CREATE TABLE IF NOT EXISTS polls (id TEXT PRIMARY KEY, q TEXT, opts TEXT, status TEXT DEFAULT \'draft\', ideas INTEGER DEFAULT 1, created INTEGER, opened INTEGER, closed INTEGER, ends INTEGER)',
  // ip — хеш IP с солью (сам адрес не храним); один голос с IP в опросе
  'CREATE TABLE IF NOT EXISTS poll_votes (poll TEXT NOT NULL, ip TEXT NOT NULL, opt TEXT, uid INTEGER, lang TEXT, at INTEGER, PRIMARY KEY (poll, ip))',
  'CREATE INDEX IF NOT EXISTS poll_votes_uid ON poll_votes(poll, uid)',
  'CREATE TABLE IF NOT EXISTS poll_ideas (id INTEGER PRIMARY KEY AUTOINCREMENT, poll TEXT, ip TEXT, uid INTEGER, text TEXT, lang TEXT, at INTEGER)',
];
const LANGS = ['ru', 'en', 'lv'], RESULTS_DAYS = 14, MAX_OPTS = 8;
const cut = (s, n) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, n);
const parse = (s, d) => { try { return JSON.parse(s) ?? d; } catch (e) { return d; } };
const row = r => r && { ...r, q: parse(r.q, {}), opts: parse(r.opts, []) };

// завершить опросы, у которых вышел срок
async function expire(h) {
  await h.db.prepare("UPDATE polls SET status = 'closed', closed = ends WHERE status = 'open' AND ends > 0 AND ends < ?").bind(h.now()).run();
}
async function counts(h, id) {
  const r = (await h.db.prepare('SELECT opt, COUNT(*) AS n FROM poll_votes WHERE poll = ? GROUP BY opt').bind(id).all()).results;
  const c = {}; let total = 0; for (const x of r) { c[x.opt] = x.n; total += x.n; }
  return { c, total };
}
async function myVote(h, id, ip, u) {
  const r = await h.db.prepare('SELECT opt FROM poll_votes WHERE poll = ? AND (ip = ? OR (uid IS NOT NULL AND uid = ?)) LIMIT 1').bind(id, ip, u ? u.id : -1).first();
  return r ? r.opt : null;
}
// для сайта: тексты на языке страницы; числа — только если можно
async function pollOut(h, p, lang, ip, u, adm) {
  const my = await myVote(h, p.id, ip, u), show = !!my || p.status === 'closed' || adm;
  const t = o => o[lang] || o.en || o.ru || o.lv || '';
  const out = { id: p.id, q: t(p.q), status: p.status, ends: p.ends || 0, ideas: p.ideas ? 1 : 0, my, opts: p.opts.map(o => ({ id: o.id, t: t(o.t) })) };
  if (show) {
    const { c, total } = await counts(h, p.id);
    out.total = total; out.opts.forEach(o => { o.n = c[o.id] || 0; });
  }
  return out;
}
async function homePoll(h) {
  const open = await h.db.prepare("SELECT * FROM polls WHERE status = 'open' ORDER BY opened DESC LIMIT 1").first();
  if (open) return row(open);
  return row(await h.db.prepare("SELECT * FROM polls WHERE status = 'closed' AND closed > ? ORDER BY closed DESC LIMIT 1").bind(h.now() - RESULTS_DAYS * 86400).first());
}

export async function pollsApi(req, env, url, h) {
  const p = url.pathname, m = req.method;
  if (p === '/api/poll' && m === 'GET') {
    await expire(h);
    const lang = LANGS.includes(url.searchParams.get('lang')) ? url.searchParams.get('lang') : 'en';
    const id = url.searchParams.get('id');
    if (!id && (await h.getMeta('poll_home')) === '0') return h.json({ poll: null, hidden: 1 });
    const poll = id ? row(await h.db.prepare("SELECT * FROM polls WHERE id = ? AND status != 'draft'").bind(id).first()) : await homePoll(h);
    if (!poll) return h.json({ poll: null });
    const u = await h.currentUser(req, env), adm = u ? await h.isAdmin(u, env) : false;
    return h.json({ poll: await pollOut(h, poll, lang, await h.ipKey(req), u, adm) });
  }
  if (p === '/api/poll/vote' && m === 'POST') {
    await expire(h);
    const b = await req.json().catch(() => ({})), lang = LANGS.includes(b.lang) ? b.lang : 'en';
    if (b.hp) h.fail(400, 'bot'); // скрытое поле — только у ботов
    const poll = row(await h.db.prepare('SELECT * FROM polls WHERE id = ?').bind(String(b.id || '')).first());
    if (!poll || poll.status === 'draft') h.fail(404, 'none');
    if (poll.status !== 'open') h.fail(409, 'closed');
    const idea = cut(b.idea, 120);
    const opt = String(b.opt || ''), isIdea = opt === 'idea';
    if (!isIdea && !poll.opts.some(o => o.id === opt)) h.fail(400, 'opt');
    if (isIdea && (!poll.ideas || idea.length < 3)) h.fail(400, 'idea');
    if (isIdea && /https?:|www\.|\.(com|net|org|ru|lv|io)\b/i.test(idea)) h.fail(400, 'link');
    const u = await h.currentUser(req, env), ip = await h.ipKey(req), uid = u && !u.banned ? u.id : null;
    if (await myVote(h, poll.id, ip, uid ? u : null)) h.fail(409, 'voted');
    const r = await h.db.prepare('INSERT OR IGNORE INTO poll_votes (poll, ip, opt, uid, lang, at) VALUES (?, ?, ?, ?, ?, ?)').bind(poll.id, ip, isIdea ? 'idea' : opt, uid, lang, h.now()).run();
    if (!r.meta.changes) h.fail(409, 'voted');
    if (isIdea) await h.db.prepare('INSERT INTO poll_ideas (poll, ip, uid, text, lang, at) VALUES (?, ?, ?, ?, ?, ?)').bind(poll.id, ip, uid, idea, lang, h.now()).run();
    return h.json({ poll: await pollOut(h, poll, lang, ip, uid ? u : null, false) });
  }
  if (p !== '/api/admin/polls') return null;
  const u = await h.needUser(req, env); if (!(await h.isAdmin(u, env))) h.fail(403, 'admin');
  await expire(h);
  const out = async () => {
    const list = (await h.db.prepare('SELECT * FROM polls ORDER BY created DESC').all()).results.map(row);
    const day = t => new Date(t * 1000).toLocaleDateString('sv-SE', { timeZone: 'Europe/Riga' });
    for (const x of list) {
      const v = (await h.db.prepare('SELECT opt, uid, lang, at FROM poll_votes WHERE poll = ?').bind(x.id).all()).results;
      const c = {}, langs = {}, days = {}; let members = 0;
      for (const r of v) { c[r.opt] = (c[r.opt] || 0) + 1; langs[r.lang || 'en'] = (langs[r.lang || 'en'] || 0) + 1; days[day(r.at)] = (days[day(r.at)] || 0) + 1; if (r.uid) members++; }
      x.stats = { total: v.length, c, langs, days, members, guests: v.length - members };
      x.ideaList = (await h.db.prepare('SELECT i.text, i.lang, i.at, u.nick FROM poll_ideas i LEFT JOIN users u ON u.id = i.uid WHERE i.poll = ? ORDER BY i.at DESC LIMIT 300').bind(x.id).all()).results;
    }
    return h.json({ items: list, home: (await h.getMeta('poll_home')) === '0' ? 0 : 1 });
  };
  if (m === 'GET') return out();
  if (m !== 'POST') h.fail(405, 'method');
  const b = await req.json().catch(() => ({})), act = String(b.act || ''), id = String(b.id || '');
  if (act === 'home') { await h.setMeta('poll_home', b.on ? '1' : '0'); return out(); }
  const old = id ? row(await h.db.prepare('SELECT * FROM polls WHERE id = ?').bind(id).first()) : null;
  if (act !== 'save' && !old) h.fail(404, 'none');
  if (act === 'open') { // открыт может быть только один — остальные открытые завершаются
    await h.db.prepare("UPDATE polls SET status = 'closed', closed = ? WHERE status = 'open' AND id != ?").bind(h.now(), id).run();
    const days = Math.max(0, Math.min(365, Number(b.days) || 0));
    await h.db.prepare("UPDATE polls SET status = 'open', opened = ?, closed = NULL, ends = ? WHERE id = ?").bind(h.now(), days ? h.now() + days * 86400 : 0, id).run();
    return out();
  }
  if (act === 'close') { await h.db.prepare("UPDATE polls SET status = 'closed', closed = ? WHERE id = ?").bind(h.now(), id).run(); return out(); }
  if (act === 'del') {
    await h.db.batch(['DELETE FROM polls WHERE id = ?', 'DELETE FROM poll_votes WHERE poll = ?', 'DELETE FROM poll_ideas WHERE poll = ?'].map(s => h.db.prepare(s).bind(id)));
    return out();
  }
  if (act !== 'save') h.fail(400, 'act');
  // новый или правка: вопрос и варианты — хотя бы на одном языке, остальное переводится; вариант с голосами удалить нельзя
  const q = {}; for (const l of LANGS) q[l] = cut((b.q || {})[l], 200);
  const src = LANGS.find(l => q[l]); if (!src) h.fail(400, 'q');
  const opts = (Array.isArray(b.opts) ? b.opts : []).slice(0, MAX_OPTS).map(o => {
    const t = {}; for (const l of LANGS) t[l] = cut(((o || {}).t || {})[l], 120);
    return { id: /^[\w-]{1,12}$/.test(String((o || {}).id || '')) ? String(o.id) : h.randomHex(4), t };
  }).filter(o => LANGS.some(l => o.t[l]));
  if (opts.length < 2) h.fail(400, 'opts');
  if (old) {
    const { c } = await counts(h, old.id);
    if (old.opts.some(o => c[o.id] && !opts.some(n => n.id === o.id))) h.fail(409, 'hasvotes');
  }
  // перевод: всё пустое — с языка, на котором написан вопрос (или вариант)
  const jobs = [{ o: q, max: 200 }, ...opts.map(o => ({ o: o.t, max: 120 }))];
  for (const from of LANGS) {
    const todo = jobs.filter(j => j.o[from] && LANGS.some(l => !j.o[l]));
    if (!todo.length) continue;
    const need = LANGS.filter(l => l !== from && todo.some(j => !j.o[l]));
    const r = await h.translate(todo.map(j => j.o[from]), from, need).catch(() => ({ tr: {} }));
    todo.forEach((j, i) => { for (const l of need) if (!j.o[l]) j.o[l] = cut(((r.tr || {})[l] || [])[i], j.max) || j.o[from]; });
  }
  const ideas = b.ideas ? 1 : 0;
  if (old) await h.db.prepare('UPDATE polls SET q = ?, opts = ?, ideas = ? WHERE id = ?').bind(JSON.stringify(q), JSON.stringify(opts), ideas, old.id).run();
  else await h.db.prepare("INSERT INTO polls (id, q, opts, status, ideas, created) VALUES (?, ?, ?, 'draft', ?, ?)").bind(h.randomHex(6), JSON.stringify(q), JSON.stringify(opts), ideas, h.now()).run();
  return out();
}
