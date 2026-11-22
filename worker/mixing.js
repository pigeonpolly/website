// «Смешивание цветов» /color-mixing/ (docs/palettes.md «Смешивание цветов»): «Мои краски», выбранный бренд и «Мои цвета» — в профиле птички.
// Клиент — site/assets/mixing.js (syncPrefs). Одна строка на пользователя; старая запись не затирает новую (время t с устройства).
export const MIXING_TABLES = [
  'CREATE TABLE IF NOT EXISTS mix_prefs (user_id INTEGER PRIMARY KEY, data TEXT, t INTEGER NOT NULL)',
];
const MEDIA = ['watercolor', 'gouache', 'acrylic'];
const LINE = /^[a-z0-9-]{1,40}$/, IDS = /^(-|[a-z0-9:,-]{0,6000})$/, HEX = /^#[0-9A-F]{6}$/i, PID = /^[a-z0-9:-]{1,60}$/;

// только то, что знает страница: бренд на материал, отмеченные краски (ключ = материал или материал-серия), до 16 сохранённых цветов
function clean(d) {
  const out = { b: {}, p: {}, s: [] };
  if (!d || typeof d !== 'object') return out;
  for (const m of MEDIA) if (d.b && typeof d.b[m] === 'string' && (d.b[m] === '' || d.b[m] === '*' || LINE.test(d.b[m]))) out.b[m] = d.b[m]; // '*' — «Моя палитра» из разных брендов (ключ p: «материал-mine»)
  let n = 0;
  for (const [k, v] of Object.entries(d.p && typeof d.p === 'object' ? d.p : {})) {
    const [m, ...rest] = k.split('-'), line = rest.join('-');
    if (!MEDIA.includes(m) || (line && !LINE.test(line)) || typeof v !== 'string' || !IDS.test(v) || ++n > 60) continue;
    out.p[k] = v;
  }
  for (const x of (Array.isArray(d.s) ? d.s : []).slice(0, 16)) {
    if (!x || !HEX.test(String(x.hex)) || !MEDIA.includes(x.m)) continue;
    const items = {};
    for (const [id, v] of Object.entries(x.items && typeof x.items === 'object' ? x.items : {}).slice(0, 12)) if (PID.test(id) && +v > 0 && +v <= 100) items[id] = +v;
    out.s.push({ hex: String(x.hex).toUpperCase(), m: x.m, items, white: Math.min(100, Math.max(0, +x.white || 0)), d: Math.min(1, Math.max(0.03, +x.d || 0.4)) });
  }
  return out;
}

// h: json, fail, needUser, healthErr
export async function mixingApi(req, env, url, h) {
  const u = await h.needUser(req, env);
  const db = env.DB, noStore = { 'cache-control': 'no-store' };
  const row = await db.prepare('SELECT data, t FROM mix_prefs WHERE user_id = ?').bind(u.id).first();
  if (req.method === 'GET') {
    let data = null; try { data = row ? JSON.parse(row.data) : null; } catch (e) { data = null; }
    return h.json({ data, t: row ? row.t : 0 }, 200, noStore);
  }
  if (req.method !== 'POST') return null;
  let b = {}; try { b = JSON.parse(await req.text()) || {}; } catch (e) { h.fail(400, 'json'); }
  const t = Math.round(+b.t) || 0;
  if (!(t > 0)) h.fail(400, 't');
  if (row && row.t >= t) return h.json({ ok: true, kept: true, t: row.t }, 200, noStore); // на сервере новее — не затираем
  const data = JSON.stringify(clean(b.data));
  if (data.length > 60000) h.fail(413, 'big');
  await db.prepare('INSERT INTO mix_prefs (user_id, data, t) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, t = excluded.t WHERE excluded.t > mix_prefs.t').bind(u.id, data, t).run();
  return h.json({ ok: true, t }, 200, noStore);
}
