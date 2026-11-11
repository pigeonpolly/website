// Кабинет → «🗓 Неделя» (редизайн 2.0, часть 4; docs/admin.md «Неделя»): 5 цифр за 7 дней и сравнение с прошлыми 7 днями.
// Переходы на Amazon: site.js / v2.js шлют POST /api/hit {o: 'amazon', p, h} при нажатии на ссылку a.co / amazon.* → out_clicks.
// API: GET /api/admin/week.

export const WEEK_TABLES = [
  // переходы с сайта наружу (пока только Amazon): vid — тот же суточный отпечаток, что в visits (без IP)
  'CREATE TABLE IF NOT EXISTS out_clicks (id INTEGER PRIMARY KEY AUTOINCREMENT, day TEXT NOT NULL, ts INTEGER, vid TEXT, target TEXT, path TEXT, href TEXT)',
  'CREATE INDEX IF NOT EXISTS out_clicks_day ON out_clicks(day)',
  'CREATE INDEX IF NOT EXISTS button_log_kind_day ON button_log(kind, day)', // «покупки за 7 дней» без полного прохода
];

export const OUT_TARGETS = { amazon: /(^|\.)amazon\.[a-z.]+$|^a\.co$/ };

// запись нажатия (из hit() в index.js — роботы и заходы админа уже отсеяны)
export async function outClick(env, b, day, ts, vid) {
  const target = String(b.o || '');
  if (!OUT_TARGETS[target]) return;
  let host = ''; try { host = new URL(String(b.h || '')).hostname.replace(/^www\./, '').toLowerCase(); } catch (e) { return; }
  if (!OUT_TARGETS[target].test(host)) return;
  const path = String(b.p || '/').slice(0, 200).split(/[?#]/)[0], href = String(b.h).slice(0, 300);
  await env.DB.prepare('INSERT INTO out_clicks (day, ts, vid, target, path, href) VALUES (?, ?, ?, ?, ?, ?)').bind(day, ts, vid, target, path, href).run();
}

// h: json, fail, needUser, isAdmin, getMeta, now
export async function weekApi(req, env, url, h) {
  if (url.pathname !== '/api/admin/week' || req.method !== 'GET') return null;
  const u = await h.needUser(req, env);
  if (!(await h.isAdmin(u, env))) h.fail(403, 'admin');
  const dayAgo = n => new Date(Date.now() - n * 86400000).toLocaleDateString('sv-SE', { timeZone: 'Europe/Riga' });
  const t = h.now(), d0 = dayAgo(6), p0 = dayAgo(13), p1 = dayAgo(7), today = dayAgo(0);
  const one = async (sql, ...v) => { try { return Number((await env.DB.prepare(sql).bind(...v).first())?.n) || 0; } catch (e) { return 0; } };
  const pair = async (sql, a, b, c, d) => { const [now, prev] = await Promise.all([one(sql, a, b), one(sql, c, d)]); return { now, prev }; };
  const wk = 7 * 86400;
  // все запросы — разом, а не по очереди (раньше кабинет открывался по 2–3 с)
  const [people, shop, amazon, buys, subsT, subsN, subsP, birdsN, birdsP, salary, restockRaw, amazonFirst] = await Promise.all([
    // люди — уникальные за сутки, как в «👥 Посетителях»
    pair('SELECT COUNT(DISTINCT day || vid) AS n FROM visits WHERE day >= ? AND day <= ?', d0, today, p0, p1),
    pair("SELECT COUNT(DISTINCT day || vid) AS n FROM visits WHERE day >= ? AND day <= ? AND path GLOB '*/shop/*'", d0, today, p0, p1),
    pair("SELECT COUNT(*) AS n FROM out_clicks WHERE target = 'amazon' AND day >= ? AND day <= ?", d0, today, p0, p1),
    pair("SELECT COUNT(*) AS n FROM button_log WHERE kind = 'buy' AND day >= ? AND day <= ?", d0, today, p0, p1),
    one('SELECT COUNT(*) AS n FROM subscribers'),
    one('SELECT COUNT(*) AS n FROM subscribers WHERE created_at > ?', t - wk),
    one('SELECT COUNT(*) AS n FROM subscribers WHERE created_at > ? AND created_at <= ?', t - 2 * wk, t - wk),
    one('SELECT COUNT(*) AS n FROM users WHERE created_at > ?', t - wk),
    one('SELECT COUNT(*) AS n FROM users WHERE created_at > ? AND created_at <= ?', t - 2 * wk, t - wk),
    env.DB.prepare("SELECT created_at AS at, amount, COUNT(*) AS birds FROM button_log WHERE kind = 'salary' GROUP BY ref ORDER BY created_at DESC LIMIT 1").first().catch(() => null), // ещё не выдавали
    Promise.resolve(h.getMeta(env, 'restock_last')).catch(() => null),
    one("SELECT MIN(ts) AS n FROM out_clicks WHERE target = 'amazon'"),
  ]);
  const subs = { total: subsT, now: subsN, prev: subsP }, birds = { now: birdsN, prev: birdsP };
  let restock = null; try { restock = JSON.parse(restockRaw); } catch (e) { /* не пополняли */ }
  return h.json({ from: d0, to: today, people, shop, amazon, amazonFirst, buys, subs, birds, salary, restock }, 200, { 'cache-control': 'no-store' });
}
