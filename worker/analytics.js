// Кабинет → «📊 Аналитика» → «📰 Блог» (docs/admin.md «Аналитика блога»): какие статьи читают, откуда приходят, дочитывают ли.
// Данные — та же своя статистика без cookie: visits (просмотры, источник, rpath — с какой страницы сайта перешли)
// + reads (на странице статьи site.js шлёт POST /api/hit {e:'read', p, s: % прокрутки статьи, t: секунд на вкладке}).
// API: GET /api/admin/blogstats?days=N (все статьи) и &post=ID (одна статья подробно).

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

// внутренний переход → понятное название места
function placeOf(p) {
  if (!p) return 'Другое';
  const x = p.replace(/^\/(ru|lv)(?=\/)/, '');
  if (x === '/' || x === '') return 'Главная';
  if (/^\/blog\/?$/.test(x)) return 'Список блога';
  if (ART_RE.test(x)) return 'Другая статья';
  if (/^\/flock\//.test(x)) return 'Стая';
  if (/^\/challenge\//.test(x)) return 'Челлендж';
  if (/^\/(bird|room)\//.test(x)) return 'Профиль, комната птички';
  if (/^\/shop\//.test(x)) return 'Магазин';
  return 'Другие страницы сайта';
}

// h: json, fail, needUser, isAdmin
export async function blogStatsApi(req, env, url, h) {
  if (url.pathname !== '/api/admin/blogstats' || req.method !== 'GET') return null;
  const u = await h.needUser(req, env);
  if (!(await h.isAdmin(u, env))) h.fail(403, 'admin');
  const days = Math.min(Math.max(Number(url.searchParams.get('days')) || 30, 1), 365);
  const dayAgo = n => new Date(Date.now() - n * 86400000).toLocaleDateString('sv-SE', { timeZone: 'Europe/Riga' });
  const from = dayAgo(days - 1), prevFrom = dayAgo(2 * days - 1), prevTo = dayAgo(days), today = dayAgo(0);
  const q = async (sql, ...a) => (await env.DB.prepare(sql).bind(...a).all()).results;
  const posts = await q(`SELECT p.id, p.slug, p.t_ru, p.t_en, p.t_lv, p.section, p.published_at, p.views AS total, p.likes, p.members,
    (SELECT COUNT(*) FROM blog_comments c WHERE c.post_id = p.id AND c.status = 'ok') AS comments FROM blog_posts p WHERE p.status = 'published'`);
  const bySlug = Object.fromEntries(posts.map(p => [p.slug, p]));
  const slugOf = path => { const m = ART_RE.exec(path || ''); return m && bySlug[m[2]] ? m[2] : null; };
  const BLOG = "path GLOB '*blog/?*'"; // статьи (список блога /blog/ сюда не попадает)

  const post = url.searchParams.get('post');
  if (post) return h.json(await onePost(posts.find(p => String(p.id) === post), { q, from, prevFrom, prevTo, today, days, slugOf }));

  // по статьям: просмотры, люди, заходы извне, прошлый период, чтение, главный источник
  const add = (o, k, f) => { o[k] = o[k] || {}; f(o[k]); };
  const st = {};
  for (const r of await q(`SELECT path, COUNT(*) AS n, COUNT(DISTINCT day || vid) AS p, SUM(entry) AS e FROM visits WHERE day >= ? AND ${BLOG} GROUP BY path`, from)) {
    const s = slugOf(r.path); if (s) add(st, s, o => { o.views = (o.views || 0) + r.n; o.people = (o.people || 0) + r.p; o.entries = (o.entries || 0) + (r.e || 0); });
  }
  for (const r of await q(`SELECT path, COUNT(*) AS n FROM visits WHERE day >= ? AND day <= ? AND ${BLOG} GROUP BY path`, prevFrom, prevTo)) {
    const s = slugOf(r.path); if (s) add(st, s, o => { o.prev = (o.prev || 0) + r.n; });
  }
  for (const r of await q('SELECT path, COUNT(*) AS n, SUM(sec) AS sec, SUM(depth >= 75) AS done FROM reads WHERE day >= ? GROUP BY path', from)) {
    const s = slugOf(r.path); if (s) add(st, s, o => { o.reads = (o.reads || 0) + r.n; o.sec = (o.sec || 0) + (r.sec || 0); o.done = (o.done || 0) + (r.done || 0); });
  }
  const srcRows = await q(`SELECT path, src, COUNT(*) AS n FROM visits WHERE entry = 1 AND day >= ? AND ${BLOG} GROUP BY path, src`, from);
  const srcOf = {};
  for (const r of srcRows) { const s = slugOf(r.path); if (s) add(srcOf, s, o => { o[r.src] = (o[r.src] || 0) + r.n; }); }
  const sources = {}; // на все статьи вместе
  for (const r of srcRows) if (slugOf(r.path)) sources[r.src] = (sources[r.src] || 0) + r.n;
  const inner = {};
  for (const r of await q(`SELECT rpath, COUNT(*) AS n FROM visits WHERE entry = 0 AND rpath IS NOT NULL AND day >= ? AND ${BLOG} GROUP BY rpath`, from)) { const k = placeOf(r.rpath); inner[k] = (inner[k] || 0) + r.n; }
  const rows = posts.map(p => {
    const o = st[p.slug] || {}, src = Object.entries(srcOf[p.slug] || {}).sort((a, b) => b[1] - a[1]);
    return { id: p.id, slug: p.slug, t_ru: p.t_ru, t_en: p.t_en, t_lv: p.t_lv, section: p.section, published_at: p.published_at, members: p.members,
      total: p.total || 0, likes: p.likes || 0, comments: p.comments || 0, views: o.views || 0, people: o.people || 0, entries: o.entries || 0, prev: o.prev || 0,
      reads: o.reads || 0, avgSec: o.reads ? Math.round(o.sec / o.reads) : null, donePct: o.reads ? Math.round(o.done * 100 / o.reads) : null,
      top: src[0] ? { k: src[0][0], n: src[0][1] } : null };
  });
  const sum = k => rows.reduce((s, r) => s + (r[k] || 0), 0);
  const rd = (await q('SELECT COUNT(*) AS n, SUM(sec) AS sec, SUM(depth >= 75) AS done FROM reads WHERE day >= ?', from))[0];
  const series = await q(`SELECT day, COUNT(*) AS views, COUNT(DISTINCT vid) AS people FROM visits WHERE day >= ? AND ${BLOG} GROUP BY day ORDER BY day`, from);
  const sections = (await q('SELECT slug, ru, en FROM blog_sections').catch(() => [])).map(s => ({ slug: s.slug, name: s.ru || s.en || s.slug }));
  return h.json({
    days, from, to: today, first: ((await q('SELECT MIN(day) AS d FROM reads'))[0] || {}).d || null,
    totals: { views: sum('views'), people: (await q(`SELECT COUNT(DISTINCT day || vid) AS n FROM visits WHERE day >= ? AND ${BLOG}`, from))[0].n, prev: sum('prev'),
      entries: sum('entries'), list: (await q("SELECT COUNT(*) AS n FROM visits WHERE day >= ? AND path GLOB '*blog/'", from))[0].n,
      reads: rd.n || 0, avgSec: rd.n ? Math.round((rd.sec || 0) / rd.n) : null, donePct: rd.n ? Math.round((rd.done || 0) * 100 / rd.n) : null },
    series, sections, posts: rows,
    sources: Object.entries(sources).map(([k, n]) => ({ k, n })).sort((a, b) => b.n - a.n),
    inner: Object.entries(inner).map(([k, n]) => ({ k, n })).sort((a, b) => b.n - a.n),
  });
}

async function onePost(p, { q, from, prevFrom, prevTo, today, days }) {
  if (!p) return { error: 'post' };
  const paths = ['', '/ru', '/lv'].map(x => `${x}/blog/${p.slug}/`), IN = `path IN (?, ?, ?)`;
  const by = (col, extra = '') => q(`SELECT ${col} AS k, COUNT(*) AS n FROM visits WHERE day >= ? AND ${IN} ${extra} AND ${col} IS NOT NULL GROUP BY ${col} ORDER BY n DESC LIMIT 20`, from, ...paths);
  const innerRows = await q(`SELECT rpath, COUNT(*) AS n FROM visits WHERE entry = 0 AND rpath IS NOT NULL AND day >= ? AND ${IN} GROUP BY rpath ORDER BY n DESC LIMIT 40`, from, ...paths);
  const inner = {}; innerRows.forEach(r => { const k = placeOf(r.rpath); inner[k] = (inner[k] || 0) + r.n; });
  const reads = await q(`SELECT sec, depth FROM reads WHERE day >= ? AND ${IN}`, from, ...paths);
  const bucket = (arr, edges) => edges.map((e, i) => ({ k: e[0], n: arr.filter(v => v >= e[1] && (i === edges.length - 1 || v < edges[i + 1][1])).length }));
  const tot = (await q(`SELECT COUNT(*) AS n, COUNT(DISTINCT day || vid) AS p, SUM(entry) AS e FROM visits WHERE day >= ? AND ${IN}`, from, ...paths))[0];
  return {
    days, from, to: today,
    post: { id: p.id, slug: p.slug, t_ru: p.t_ru, t_en: p.t_en, t_lv: p.t_lv, published_at: p.published_at, total: p.total || 0, likes: p.likes || 0, comments: p.comments || 0 },
    totals: { views: tot.n || 0, people: tot.p || 0, entries: tot.e || 0, prev: (await q(`SELECT COUNT(*) AS n FROM visits WHERE day >= ? AND day <= ? AND ${IN}`, prevFrom, prevTo, ...paths))[0].n,
      reads: reads.length, avgSec: reads.length ? Math.round(reads.reduce((s, r) => s + (r.sec || 0), 0) / reads.length) : null,
      donePct: reads.length ? Math.round(reads.filter(r => r.depth >= 75).length * 100 / reads.length) : null },
    series: await q(`SELECT day, COUNT(*) AS views, COUNT(DISTINCT vid) AS people FROM visits WHERE day >= ? AND ${IN} GROUP BY day ORDER BY day`, from, ...paths),
    sources: await by('src', 'AND entry = 1'), refs: await by('ref', 'AND entry = 1'), campaigns: await by('campaign', 'AND entry = 1'),
    inner: Object.entries(inner).map(([k, n]) => ({ k, n })).sort((a, b) => b.n - a.n),
    // куда пошли дальше: просмотры, у которых rpath — эта статья
    next: (await q(`SELECT path AS k, COUNT(*) AS n FROM visits WHERE day >= ? AND rpath IN (?, ?, ?) GROUP BY path ORDER BY n DESC LIMIT 10`, from, ...paths)),
    langs: await by('lang'), devices: await by('device'), countries: await by('country'),
    depth: bucket(reads.map(r => r.depth || 0), [['меньше четверти', 0], ['до половины', 25], ['больше половины', 50], ['почти до конца или до конца', 75]]),
    time: bucket(reads.map(r => r.sec || 0), [['меньше 10 секунд', 0], ['10–30 секунд', 10], ['30 секунд – 1 минута', 30], ['1–3 минуты', 60], ['больше 3 минут', 180]]),
  };
}
