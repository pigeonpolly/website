// Чтение статей (reads) и «📊 Аналитика» кабинета: одна таблица с любым разрезом (docs/admin.md).
// Данные — та же своя статистика без cookie: visits (просмотры, источник, rpath — с какой страницы сайта перешли)
// + reads (на странице статьи site.js шлёт POST /api/hit {e:'read', p, s: % прокрутки статьи, t: секунд на вкладке}).
// API: GET /api/admin/analytics?from=…&to=…&cmp=…&by=…&src=…&row=… (worker/analytics.js tableApi).

export const ANALYTICS_TABLES = [
  // чтение статьи: один человек (суточный vid) — одна строка на статью за день; s и t — наибольшие за день
  'CREATE TABLE IF NOT EXISTS reads (day TEXT NOT NULL, vid TEXT NOT NULL, path TEXT NOT NULL, ts INTEGER, sec INTEGER DEFAULT 0, depth INTEGER DEFAULT 0, PRIMARY KEY (day, vid, path))',
  'CREATE INDEX IF NOT EXISTS visits_path ON visits(path, day)',
];
export const ANALYTICS_ALTER = ['ALTER TABLE visits ADD COLUMN rpath TEXT']; // rpath — путь страницы нашего сайта, с которой перешли (внутренний переход)

const ART_RE = /^\/(?:(ru|lv)\/)?blog\/([^/?#]+)\/?$/; // адрес статьи → [язык, slug]
export const isArticle = p => ART_RE.test(p || '');

// запись чтения (из hit() в index.js — роботы и заходы админа уже отсеяны)
export async function readHit(env, b, day, ts, vid) {
  const path = String(b.p || '').slice(0, 200).split(/[?#]/)[0];
  if (!isArticle(path)) return;
  const sec = Math.max(0, Math.min(1800, Math.round(Number(b.t) || 0))), depth = Math.max(0, Math.min(100, Math.round(Number(b.s) || 0)));
  await env.DB.prepare(`INSERT INTO reads (day, vid, path, ts, sec, depth) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT (day, vid, path) DO UPDATE SET ts = excluded.ts, sec = MAX(sec, excluded.sec), depth = MAX(depth, excluded.depth)`).bind(day, vid, path, ts, sec, depth).run();
}

// ================== 📊 «Аналитика» одной таблицей (20.11.2026) ==================
// Одна таблица вместо десятка блоков: период с любыми датами, фильтры и разрез — страницы, статьи, дни, источники,
// страны, устройства, язык, метки. Для каждой строки — люди, просмотры, заходы извне, время, дочитывания, телефон и Δ.
// GET /api/admin/analytics?from=ГГГГ-ММ-ДД&to=…&days=…&cmp=prev|year|none&by=…&src=&device=&country=&lang=&row=<ключ>&limit=
const T_BY = { page: 'path', article: 'path', day: 'day', src: 'src', ref: 'ref', country: 'country', device: 'device', lang: 'lang', campaign: 'campaign' };
const T_F = { src: 'src', device: 'device', country: 'country', lang: 'lang' };
const tShift = (day, n) => { const d = new Date(day + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const tYear = day => (Number(day.slice(0, 4)) - 1) + day.slice(4);
const tDay = s => /^\d{4}-\d{2}-\d{2}$/.test(String(s || '')) ? String(s) : null;
const rDay = ts => ts ? new Date(ts * 1000).toLocaleDateString('sv-SE', { timeZone: 'Europe/Riga' }) : null;

function tRange(url) {
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Riga' });
  let to = tDay(url.searchParams.get('to')) || today;
  const want = Math.min(Math.max(Number(url.searchParams.get('days')) || 7, 1), 400);
  let from = tDay(url.searchParams.get('from')) || tShift(to, 1 - want);
  if (from > to) { const t = from; from = to; to = t; } // даты ввели наоборот — меняем местами
  if (from < tShift(to, -399)) from = tShift(to, -399);
  return { from, to, days: Math.round((Date.parse(to + 'T12:00:00Z') - Date.parse(from + 'T12:00:00Z')) / 86400000) + 1 };
}
function tWhere(range, f) {
  const w = ['day >= ?', 'day <= ?'], a = [range.from, range.to];
  for (const [k, col] of Object.entries(T_F)) if (f[k]) { w.push(col + ' = ?'); a.push(f[k]); }
  return { sql: w.join(' AND '), args: a };
}

export async function tableApi(req, env, url, h) {
  if (url.pathname !== '/api/admin/analytics' || req.method !== 'GET') return null;
  const u = await h.needUser(req, env);
  if (!(await h.isAdmin(u, env))) h.fail(403, 'admin');

  const range = tRange(url), { from, to, days } = range;
  const by = T_BY[url.searchParams.get('by')] ? url.searchParams.get('by') : 'page';
  const col = T_BY[by];
  const cmp = ['prev', 'year', 'none'].includes(url.searchParams.get('cmp')) ? url.searchParams.get('cmp') : 'prev';
  const prev = cmp === 'none' ? null : cmp === 'year' ? { from: tYear(from), to: tYear(to) } : { from: tShift(from, -days), to: tShift(from, -1) };
  const f = { src: url.searchParams.get('src') || '', device: url.searchParams.get('device') || '', country: url.searchParams.get('country') || '', lang: url.searchParams.get('lang') || '' };
  const filtered = Object.values(f).some(Boolean);
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 300, 10), 2000);
  const q = async (sql, ...a) => (await env.DB.prepare(sql).bind(...a).all()).results;
  const w = tWhere(range, f);
  // «время» и «дочитали» — из reads; при фильтрах не считаем (в reads нет источника и устройства)
  const withReads = !filtered && (by === 'page' || by === 'article' || by === 'day');

  // ---- строки: любой разрез по visits ----
  const cur = await q(`SELECT ${col} AS k, COUNT(*) AS views, COUNT(DISTINCT day || vid) AS people, SUM(entry) AS entries,
      COUNT(DISTINCT CASE WHEN device = 'Телефон' THEN day || vid END) AS mobile
    FROM visits WHERE ${w.sql} AND ${col} IS NOT NULL GROUP BY ${col} ${by === 'day' ? 'ORDER BY day ASC' : 'ORDER BY views DESC'} LIMIT ?`,
  ...w.args, by === 'day' ? 400 : by === 'article' ? 2000 : limit);
  const add = (map, k, r) => {
    const o = map.get(k) || { k, people: 0, views: 0, entries: 0, mobile: 0, prevPeople: 0, prevViews: 0, reads: null, avgSec: null, donePct: null };
    o.people += r.people || 0; o.views += r.views || 0; o.entries += r.entries || 0; o.mobile += r.mobile || 0;
    map.set(k, o);
  };
  const keyOf = (k) => { if (by !== 'article') return k; const m = ART_RE.exec(k || ''); return m ? m[2] : null; };
  const map = new Map();
  for (const r of cur) { const k = keyOf(r.k); if (k) add(map, k, r); }
  let rows = [...map.values()];

  // ---- прошлый период (или тот же период год назад) ----
  if (prev) {
    const w2 = tWhere(prev, f), pmap = new Map();
    const prow = await q(`SELECT ${col} AS k, COUNT(*) AS views, COUNT(DISTINCT day || vid) AS people FROM visits
      WHERE ${w2.sql} AND ${col} IS NOT NULL GROUP BY ${col} LIMIT 2000`, ...w2.args);
    for (const r of prow) { const k = keyOf(r.k); if (k) add(pmap, k, { people: r.people, views: r.views }); }
    for (const row of rows) {
      const k = by === 'day' ? tShift(row.k, -days) : row.k, p = pmap.get(k);
      if (p) { row.prevPeople = p.people; row.prevViews = p.views; }
    }
  }

  // ---- чтение статей: время и «дочитали» ----
  if (withReads) {
    const rrows = await q(by === 'day'
      ? 'SELECT day AS k, COUNT(*) AS n, SUM(sec) AS sec, SUM(depth >= 75) AS done FROM reads WHERE day >= ? AND day <= ? GROUP BY day'
      : 'SELECT path AS k, COUNT(*) AS n, SUM(sec) AS sec, SUM(depth >= 75) AS done FROM reads WHERE day >= ? AND day <= ? GROUP BY path', from, to);
    const rmap = new Map();
    for (const r of rrows) { const k = keyOf(r.k); if (!k) continue; const o = rmap.get(k) || { n: 0, sec: 0, done: 0 }; o.n += r.n; o.sec += r.sec || 0; o.done += r.done || 0; rmap.set(k, o); }
    for (const row of rows) { const r = rmap.get(row.k); if (r) { row.reads = r.n; row.avgSec = Math.round(r.sec / r.n); row.donePct = Math.round(r.done * 100 / r.n); } }
  }
  if (by === 'article') { // название, лайки, комментарии, дата и счётчик за всё время
    const posts = await q(`SELECT p.id, p.slug, p.t_ru, p.t_en, p.t_lv, p.views AS total, p.likes, p.published_at,
      (SELECT COUNT(*) FROM blog_comments c WHERE c.post_id = p.id AND c.status = 'ok') AS comments FROM blog_posts p WHERE p.status = 'published'`);
    const bySlug = Object.fromEntries(posts.map(p => [p.slug, p]));
    rows = rows.filter(r => bySlug[r.k]).map(r => ({ ...r, post: bySlug[r.k] }));
  }
  rows.sort((a, b) => b.views - a.views);

  // ---- итог за период и сравнение ----
  const tot = (await q(`SELECT COUNT(*) AS views, COUNT(DISTINCT day || vid) AS people, SUM(entry) AS entries,
    COUNT(DISTINCT CASE WHEN device = 'Телефон' THEN day || vid END) AS mobile FROM visits WHERE ${w.sql}`, ...w.args))[0];
  const rtot = withReads ? (await q('SELECT COUNT(*) AS n, SUM(sec) AS sec, SUM(depth >= 75) AS done FROM reads WHERE day >= ? AND day <= ?', from, to))[0] : null;
  const ptot = prev ? (await q(`SELECT COUNT(*) AS views, COUNT(DISTINCT day || vid) AS people FROM visits WHERE ${tWhere(prev, f).sql}`, ...tWhere(prev, f).args))[0] : null;

  // ---- списки для фильтров: за период, без самих фильтров ----
  const facet = col => q(`SELECT ${col} AS k, COUNT(*) AS n FROM visits WHERE day >= ? AND day <= ? AND ${col} IS NOT NULL GROUP BY ${col} ORDER BY n DESC LIMIT 40`, from, to);
  const facets = { src: await facet('src'), device: await facet('device'), country: await facet('country'), lang: await facet('lang') };

  // ---- пометки периода: вышли статьи, завели метки, сайт был на паузе ----
  const inRange = ts => { const d = rDay(ts); return !!d && d >= from && d <= to; };
  const events = [];
  for (const p of await q("SELECT slug, t_ru, t_en, t_lv, published_at FROM blog_posts WHERE status = 'published' AND published_at IS NOT NULL"))
    if (inRange(p.published_at)) events.push({ day: rDay(p.published_at), ic: '📰', t: `вышла статья «${p.t_ru || p.t_en || p.t_lv || p.slug}»` });
  for (const l of await q('SELECT campaign, created_at FROM utm_links')) if (inRange(l.created_at)) events.push({ day: rDay(l.created_at), ic: '🏷', t: `завели ссылку ${l.campaign}` });
  const pauseAt = Number((await q("SELECT value FROM meta WHERE key = 'site_pause_at'").catch(() => []))[0]?.value || 0);
  if (inRange(pauseAt)) events.push({ day: rDay(pauseAt), ic: '⏸', t: 'сайт ставили на паузу' });
  events.sort((a, b) => a.day < b.day ? -1 : a.day > b.day ? 1 : 0);

  // ---- сохранённые ссылки с метками ----
  const links = await Promise.all((await q('SELECT * FROM utm_links ORDER BY id DESC')).map(async l => {
    const c = (await q('SELECT COUNT(*) AS n, COUNT(DISTINCT day || vid) AS p FROM visits WHERE entry = 1 AND campaign = ? AND day >= ? AND day <= ?', l.campaign, from, to))[0];
    return { ...l, period: c.n || 0, periodPeople: c.p || 0 };
  }));

  // ---- одна строка подробно: по дням, откуда, куда дальше, устройства, страны ----
  let detail = null;
  const rowKey = url.searchParams.get('row');
  if (rowKey) {
    const keys = by === 'article' ? [`/blog/${rowKey}/`, `/ru/blog/${rowKey}/`, `/lv/blog/${rowKey}/`] : [rowKey];
    const cond = by === 'article' ? 'path IN (?, ?, ?)' : col + ' = ?';
    const wd = `${w.sql} AND ${cond}`, a = [...w.args, ...keys];
    const byCol = (c, extra = '', n = 8) => q(`SELECT ${c} AS k, COUNT(*) AS n FROM visits WHERE ${wd} ${extra} AND ${c} IS NOT NULL GROUP BY ${c} ORDER BY n DESC LIMIT ${n}`, ...a);
    detail = {
      series: await q(`SELECT day, COUNT(*) AS views, COUNT(DISTINCT vid) AS people FROM visits WHERE ${wd} GROUP BY day ORDER BY day`, ...a),
      sources: by === 'day' || by === 'page' || by === 'article' ? await byCol('src', 'AND entry = 1') : [],
      inner: await byCol('rpath', 'AND entry = 0'),
      next: by === 'page' || by === 'article' ? await q(`SELECT path AS k, COUNT(*) AS n FROM visits WHERE day >= ? AND day <= ? AND rpath IN (?, ?, ?) GROUP BY path ORDER BY n DESC LIMIT 8`, from, to, ...(by === 'article' ? keys : [rowKey, rowKey, rowKey])) : [],
      devices: await byCol('device'), countries: await byCol('country'),
    };
  }

  return h.json({
    from, to, days, cmp, prev, by, filtered, withReads, first: ((await q('SELECT MIN(day) AS d FROM visits'))[0] || {}).d || null,
    totals: {
      people: tot.people || 0, views: tot.views || 0, entries: tot.entries || 0, mobile: tot.mobile || 0,
      reads: rtot ? rtot.n || 0 : null, avgSec: rtot && rtot.n ? Math.round((rtot.sec || 0) / rtot.n) : null,
      donePct: rtot && rtot.n ? Math.round((rtot.done || 0) * 100 / rtot.n) : null,
      prevPeople: ptot ? ptot.people || 0 : null, prevViews: ptot ? ptot.views || 0 : null,
    },
    rows, facets, events, links, detail,
  });
}
