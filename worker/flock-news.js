// Новости стаи (этап 13 Г, docs/flock.md): /flock/news/ и 3 строки на главной.
// Таблица flock_events: одно событие на (птичка, вид, ref) — повтор не записывается. Хранятся 30 дней (cron flockNewsCron).
// Виды: new (ник выбран), drawing (рисунок дня, ref — день), room (≥ 3 новых вещей за сутки, ref — день, data.n копится),
// badge, card, legend, titos (дело №10, 20…), pick («Выбор Полли»), feathers (каждое 10-е пёрышко), note — объявление Алины (user_id 0).
// Строки «от Полли» (статья, коллекция, пополнение магазина, адвент) не хранятся — собираются при чтении из blog_posts, card_sets, meta new_seen.
// GET /api/flock/news?lang= — лента; GET/POST /api/admin/flock-notes — объявления; POST /api/news-off {off} — «Не показывать меня в новостях стаи».

export const FLOCK_NEWS_TABLES = [
  `CREATE TABLE IF NOT EXISTS flock_events (id INTEGER PRIMARY KEY AUTOINCREMENT, ts INTEGER NOT NULL, user_id INTEGER NOT NULL DEFAULT 0, kind TEXT NOT NULL, ref TEXT NOT NULL DEFAULT '', data TEXT DEFAULT '{}', UNIQUE (user_id, kind, ref))`,
  `CREATE INDEX IF NOT EXISTS flock_events_ts ON flock_events(ts)`,
];
export const FLOCK_NEWS_ALTER = ['ALTER TABLE users ADD COLUMN news_off INTEGER DEFAULT 0'];

const KEEP = 30 * 86400, ROOM_MIN = 3;
const BIRD_KINDS = ['new', 'drawing', 'room', 'badge', 'card', 'legend', 'titos', 'pick', 'feathers'];
// ref по умолчанию: чтобы одно и то же не попало в ленту дважды
const REF = { new: () => '', drawing: d => d.day, badge: d => d.badge, card: d => d.card, legend: d => d.key, titos: d => d.level, pick: d => d.post, feathers: d => d.n };
const now = () => Math.floor(Date.now() / 1000);
const rigaDayOf = ts => new Date(ts * 1000).toLocaleDateString('sv-SE', { timeZone: 'Europe/Riga' });
const parseJ = (s, d) => { try { const v = JSON.parse(s); return v && typeof v === 'object' ? v : d; } catch (e) { return d; } };

// записать событие птички; ошибки ленты никогда не ломают то, что их вызвало
export async function flockEvent(env, kind, bird, data = {}) {
  try {
    if (!BIRD_KINDS.includes(kind) || !bird || !bird.id || bird.banned) return;
    const ref = String((REF[kind] || (() => now()))(data) ?? '');
    await env.DB.prepare('INSERT OR IGNORE INTO flock_events (ts, user_id, kind, ref, data) VALUES (?, ?, ?, ?, ?)').bind(now(), bird.id, kind, ref, JSON.stringify(data)).run();
  } catch (e) { console.error('flockEvent', kind, e); }
}
// комната: новые вещи за сутки копятся в одной строке; в ленте — когда набралось ROOM_MIN
export async function roomEvent(env, bird, added, day) {
  try {
    if (!(added > 0) || !bird || !bird.nick || bird.banned) return;
    await env.DB.prepare(`INSERT INTO flock_events (ts, user_id, kind, ref, data) VALUES (?, ?, 'room', ?, json_object('n', ?))
      ON CONFLICT (user_id, kind, ref) DO UPDATE SET data = json_object('n', COALESCE(json_extract(flock_events.data, '$.n'), 0) + ?), ts = excluded.ts`).bind(now(), bird.id, day, added, added).run();
  } catch (e) { console.error('roomEvent', e); }
}

export async function flockNewsCron(env) {
  await env.DB.prepare("DELETE FROM flock_events WHERE ts < ? AND (kind != 'note' OR COALESCE(json_extract(data, '$.until'), '') < ?)").bind(now() - KEEP, rigaDayOf(now())).run();
}

const note = r => { const d = parseJ(r.data, {}); return { id: r.id, ts: r.ts, en: d.en || '', ru: d.ru || '', lv: d.lv || '', src: d.src || 'ru', until: d.until || '' }; };

export async function flockNewsApi(req, env, url, h) {
  const p = url.pathname, m = req.method, { json, fail } = h;

  if (m === 'POST' && p === '/api/news-off') {
    const u = await h.needUser(req, env);
    const b = await req.json().catch(() => ({}));
    await env.DB.prepare('UPDATE users SET news_off = ? WHERE id = ?').bind(b.off ? 1 : 0, u.id).run();
    return json({ ok: true, off: !!b.off });
  }

  if (p === '/api/admin/flock-notes') {
    const u = await h.needUser(req, env);
    if (!(await h.isAdmin(u, env))) fail(403, 'admin');
    if (m === 'POST') {
      const b = await req.json().catch(() => ({}));
      if (b.del) { await env.DB.prepare("DELETE FROM flock_events WHERE id = ? AND kind = 'note'").bind(Number(b.del)).run(); return json({ ok: true }); }
      const clip = s => String(s || '').trim().slice(0, 400);
      const d = { en: clip(b.en), ru: clip(b.ru), lv: clip(b.lv), src: ['en', 'ru', 'lv'].includes(b.src) ? b.src : 'ru', until: /^\d{4}-\d\d-\d\d$/.test(b.until || '') ? b.until : '' };
      if (!d[d.src]) fail(400, 'text');
      if (b.id) await env.DB.prepare("UPDATE flock_events SET data = ? WHERE id = ? AND kind = 'note'").bind(JSON.stringify(d), Number(b.id)).run();
      else await env.DB.prepare("INSERT INTO flock_events (ts, user_id, kind, ref, data) VALUES (?, 0, 'note', ?, ?)").bind(now(), 'n' + Date.now(), JSON.stringify(d)).run();
    }
    const rows = (await env.DB.prepare("SELECT id, ts, data FROM flock_events WHERE kind = 'note' ORDER BY ts DESC LIMIT 50").all()).results;
    return json({ notes: rows.map(note) });
  }

  if (m === 'GET' && p === '/api/flock/news') {
    const lang = ['ru', 'lv'].includes(url.searchParams.get('lang')) ? url.searchParams.get('lang') : 'en';
    const since = now() - KEEP, today = rigaDayOf(now());
    const rows = (await env.DB.prepare(`SELECT e.id, e.ts, e.user_id, e.kind, e.ref, e.data, u.nick, u.avatar, d.id AS post, d.theme, q.id AS pick
      FROM flock_events e LEFT JOIN users u ON u.id = e.user_id
      LEFT JOIN posts d ON e.kind = 'drawing' AND d.user_id = e.user_id AND d.day = e.ref AND d.hidden = 0
      LEFT JOIN posts q ON e.kind = 'pick' AND q.id = e.ref AND q.hidden = 0
      WHERE e.ts > ? AND e.kind != 'note' AND u.banned = 0 AND COALESCE(u.news_off, 0) = 0 AND u.nick IS NOT NULL AND u.nick != ''
      ORDER BY e.ts DESC LIMIT 600`).bind(since).all()).results;
    // названия тем дня и карточек — на языке страницы
    const days = [...new Set(rows.filter(r => r.kind === 'drawing').map(r => r.ref))];
    const subj = {};
    for (let i = 0; i < days.length; i += 80) {
      const part = days.slice(i, i + 80);
      for (const c of (await env.DB.prepare(`SELECT day, subject_en, subject_${lang} AS s FROM challenge_days WHERE day IN (${part.map(() => '?').join(',')})`).bind(...part).all().catch(() => ({ results: [] }))).results) subj[c.day] = c;
    }
    const cardIds = [...new Set(rows.filter(r => r.kind === 'card').map(r => Number(parseJ(r.data, {}).card)).filter(Boolean))];
    const cards = {};
    if (cardIds.length) for (const c of (await env.DB.prepare(`SELECT id, n, img, hidden, t_en, t_${lang} AS t FROM cards WHERE id IN (${cardIds.map(() => '?').join(',')})`).bind(...cardIds).all()).results) cards[c.id] = c;
    const events = [];
    for (const r of rows) {
      const d = parseJ(r.data, {}), e = { id: r.id, ts: r.ts, day: rigaDayOf(r.ts), kind: r.kind, uid: r.user_id, nick: r.nick, avatar: parseJ(r.avatar, {}) };
      if (r.kind === 'drawing') {
        if (!r.post) continue; // работу удалили или скрыли
        const s = subj[r.ref]; e.theme = s && s.subject_en === r.theme ? s.s || r.theme : r.theme || ''; e.img = `/api/img/${r.post}?t=1`;
      } else if (r.kind === 'pick') { if (!r.pick) continue; e.img = `/api/img/${r.pick}?t=1`; }
      else if (r.kind === 'room') { if ((d.n || 0) < ROOM_MIN) continue; e.n = d.n; }
      else if (r.kind === 'card') { const c = cards[d.card]; if (!c || c.hidden) continue; e.n = c.n; e.title = c.t || c.t_en; e.img = c.img || ''; }
      else if (r.kind === 'badge') e.badge = d.badge;
      else if (r.kind === 'legend') { e.k = d.kind; e.v = d.item; }
      else if (r.kind === 'titos') e.n = d.level;
      else if (r.kind === 'feathers') e.n = d.n;
      events.push(e);
    }
    // строки «от Полли»
    const polly = (ts, x) => events.push({ id: 'p' + events.length, ts, day: rigaDayOf(ts), kind: 'polly', ...x });
    for (const b of (await env.DB.prepare(`SELECT slug, cover, t_en, t_${lang} AS t, published_at FROM blog_posts WHERE status = 'published' AND published_at > ? AND published_at <= ?`).bind(since, now()).all().catch(() => ({ results: [] }))).results)
      polly(b.published_at, { what: 'post', title: b.t || b.t_en, url: `${lang === 'en' ? '' : '/' + lang}/blog/${b.slug}/`, img: b.cover || '' });
    for (const s of (await env.DB.prepare('SELECT s.slug, s.en, s.ru, s.lv, s.created_at, COUNT(c.id) AS n FROM card_sets s JOIN cards c ON c.collection = s.slug AND COALESCE(c.hidden, 0) = 0 WHERE s.created_at > ? GROUP BY s.slug').bind(since).all().catch(() => ({ results: [] }))).results)
      polly(s.created_at, { what: 'set', title: s[lang] || s.en || s.slug, url: '/shop/#cards' });
    const seen = parseJ(await h.getMeta('new_seen'), {}), byDay = {};
    for (const at of Object.values(seen)) if (at > since) { const k = rigaDayOf(at); (byDay[k] = byDay[k] || { n: 0, ts: 0 }).n++; byDay[k].ts = Math.max(byDay[k].ts, at); }
    for (const x of Object.values(byDay)) polly(x.ts, { what: 'restock', n: x.n, url: '/shop/' });
    const [y, mo, dd] = today.split('-').map(Number);
    if (mo === 12) for (let n = 1; n <= dd; n++) { const ts = Math.floor(h.rigaMs(y, 12, n) / 1000); if (ts > since) polly(ts, { what: 'advent', n, url: '/advent/' }); }
    const notes = (await env.DB.prepare("SELECT id, ts, data FROM flock_events WHERE kind = 'note' ORDER BY ts DESC LIMIT 50").all()).results.map(note);
    const pinned = notes.filter(n => n.until && n.until >= today).map(n => ({ id: 'n' + n.id, ts: n.ts, text: n[lang] || n[n.src] || n.en || n.ru, until: n.until }));
    for (const n of notes) if (!(n.until && n.until >= today) && n.ts > since) polly(n.ts, { what: 'note', text: n[lang] || n[n.src] || n.en || n.ru });
    events.sort((a, b) => b.ts - a.ts);
    return json({ today, pinned, events }, 200, { 'cache-control': 'public, max-age=60' });
  }
  return null;
}
