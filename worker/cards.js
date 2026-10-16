// Коллекционные карточки за пуговки (docs/cards.md): каждая — в одном экземпляре на весь сайт.
// Таблицы: cards (сама карточка, тексты на трёх языках), card_sets (названия коллекций), card_owner (кто купил; card_id уникален — второй владелец невозможен).
// API: GET /api/cards (магазин, альбом), POST /api/cards/buy, кабинет — /api/admin/cards/*. Импорт из репозитория: site/assets/cards/<коллекция>.json
// (список коллекций — site/assets/cards/index.json, собирает build.py), один раз на коллекцию (метка meta cards_<коллекция>).
import { translateTo, ABOUT, LANGS } from './translate.js';

export const RARITY = ['common', 'rare', 'unique']; // обычная 🤖 (нарисована ИИ) · редкая (пиксель-арт Алины) · уникальная (акварель Алины)
export const CARD_TABLES = [
  `CREATE TABLE IF NOT EXISTS cards (id INTEGER PRIMARY KEY AUTOINCREMENT, n INTEGER UNIQUE NOT NULL, collection TEXT NOT NULL DEFAULT '', rarity TEXT NOT NULL DEFAULT 'common',
    price INTEGER DEFAULT 0, img TEXT, hidden INTEGER DEFAULT 0, src_lang TEXT DEFAULT 'ru', t_en TEXT DEFAULT '', t_ru TEXT DEFAULT '', t_lv TEXT DEFAULT '',
    d_en TEXT DEFAULT '', d_ru TEXT DEFAULT '', d_lv TEXT DEFAULT '', stats TEXT DEFAULT '[]', created_at INTEGER, updated_at INTEGER)`,
  `CREATE TABLE IF NOT EXISTS card_sets (slug TEXT PRIMARY KEY, en TEXT DEFAULT '', ru TEXT DEFAULT '', lv TEXT DEFAULT '', src_lang TEXT DEFAULT 'ru', created_at INTEGER)`,
  // ref — метка покупки: по ней в той же транзакции списываются пуговки и пишется журнал
  `CREATE TABLE IF NOT EXISTS card_owner (card_id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, price INTEGER DEFAULT 0, bought_at INTEGER, ref TEXT)`,
  `CREATE INDEX IF NOT EXISTS card_owner_user ON card_owner(user_id)`,
];
const DAY = 86400;
const now = () => Math.floor(Date.now() / 1000);
const randomHex = n => [...crypto.getRandomValues(new Uint8Array(n))].map(b => b.toString(16).padStart(2, '0')).join('');
const parseJ = (s, d) => { try { return JSON.parse(s); } catch (e) { return d; } };
const clip = (v, n) => String(v ?? '').trim().slice(0, n);
export const slugify = s => String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/[а-яё]/g, c => ({ а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' }[c]))
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
// текст на языке страницы; нет перевода — на языке, на котором карточку писали
const pick = (c, f, lang) => c[f + '_' + lang] || c[f + '_' + (c.src_lang || 'ru')] || c[f + '_ru'] || c[f + '_en'] || c[f + '_lv'] || '';
const statsOf = c => (parseJ(c.stats, []) || []).slice(0, 3);
const statName = (s, c, lang) => s[lang] || s[c.src_lang || 'ru'] || s.ru || s.en || s.lv || '';
const setName = (s, lang) => s ? (s[lang] || s[s.src_lang || 'ru'] || s.ru || s.en || s.slug) : '';

// цена: обычная — средняя «цена сейчас» обычной вещи × множитель (RULES.cardMult %), до 5; редкая и уникальная — как поставила Алина
export const round5 = v => Math.max(5, Math.round(v / 5) * 5);
async function priceOf(c, h) { return c.rarity === 'common' ? round5(await h.avgItemPrice() * (h.rules().cardMult || 100) / 100) : Math.max(0, c.price || 0); }
// «в первые сутки» — с момента, когда в коллекции появилась первая карточка
async function firstDayLimit(env, h, collection) {
  const lim = h.rules().cardsFirstDay || 0;
  if (!lim) return 0;
  const st = await env.DB.prepare('SELECT MIN(created_at) AS t FROM cards WHERE collection = ?').bind(collection).first();
  return st && st.t && now() < st.t + DAY ? lim : 0;
}

function pub(c, lang, set, common, meId) {
  return {
    id: c.id, n: c.n, collection: c.collection, set: setName(set, lang), rarity: c.rarity, img: c.img || '',
    price: c.rarity === 'common' ? common : c.price || 0,
    title: pick(c, 't', lang), desc: pick(c, 'd', lang), stats: statsOf(c).map(s => ({ name: statName(s, c, lang), v: Math.max(1, Math.min(10, Math.round(Number(s.v) || 1))) })),
    owner: c.owner_id ? { nick: c.owner_nick || null } : null, mine: !!meId && c.owner_id === meId, since: c.created_at || 0,
  };
}
const SEL = `SELECT c.*, o.user_id AS owner_id, o.bought_at, u.nick AS owner_nick FROM cards c LEFT JOIN card_owner o ON o.card_id = c.id LEFT JOIN users u ON u.id = o.user_id`;
async function sets(env) { return (await env.DB.prepare('SELECT * FROM card_sets ORDER BY created_at, slug').all()).results; }

export async function cardsApi(req, env, url, h) {
  const p = url.pathname, m = req.method, { json, fail } = h;
  const body = () => req.json().catch(() => ({}));

  // ---------- магазин и альбом ----------
  if (m === 'GET' && p === '/api/cards') {
    const lang = LANGS.includes(url.searchParams.get('lang')) ? url.searchParams.get('lang') : 'en';
    const me = await h.currentUser(req, env);
    const q = { collection: url.searchParams.get('collection') || '', rarity: url.searchParams.get('rarity') || '', show: url.searchParams.get('show') || 'all', owner: String(url.searchParams.get('owner') || '').replace(/^@/, '') };
    const where = ['c.hidden = 0'], args = [];
    if (q.collection) { where.push('c.collection = ?'); args.push(q.collection); }
    if (RARITY.includes(q.rarity)) { where.push('c.rarity = ?'); args.push(q.rarity); }
    if (q.show === 'free') where.push('o.user_id IS NULL');
    else if (q.show === 'sold') where.push('o.user_id IS NOT NULL');
    else if (q.show === 'mine') { where.push('o.user_id = ?'); args.push(me ? me.id : -1); }
    if (q.owner) { where.push('u.nick = ?'); args.push(q.owner); }
    // альбом: сначала уникальные, потом редкие, потом обычные (по номеру); магазин — по номеру
    const order = url.searchParams.get('order') === 'album' ? "CASE c.rarity WHEN 'unique' THEN 0 WHEN 'rare' THEN 1 ELSE 2 END, c.n" : 'c.n';
    const rows = (await env.DB.prepare(`${SEL} WHERE ${where.join(' AND ')} ORDER BY ${order}`).bind(...args).all()).results;
    const ss = await sets(env), byS = Object.fromEntries(ss.map(s => [s.slug, s]));
    const common = round5(await h.avgItemPrice() * (h.rules().cardMult || 100) / 100);
    const used = new Set((await env.DB.prepare('SELECT DISTINCT collection FROM cards WHERE hidden = 0').all()).results.map(r => r.collection));
    return json({
      cards: rows.map(c => pub(c, lang, byS[c.collection], common, me && me.id)),
      sets: ss.filter(s => used.has(s.slug)).map(s => ({ slug: s.slug, name: setName(s, lang) })),
      common, firstDay: h.rules().cardsFirstDay || 0,
      me: me && me.nick && !me.banned ? { id: me.id, nick: me.nick, buttons: me.buttons || 0 } : null,
    }, 200, { 'cache-control': 'no-store' });
  }

  // покупка — всё в одной транзакции: карточка свободна и не скрыта, пуговок хватает, цена та же, лимит «в одни руки в первые сутки»
  if (m === 'POST' && p === '/api/cards/buy') {
    const u = await h.needUser(req, env);
    if (!u.nick) fail(400, 'nick');
    if (u.banned) fail(403, 'banned');
    const b = await body();
    const c = await env.DB.prepare(`${SEL} WHERE c.id = ? AND c.hidden = 0`).bind(Number(b.id) || 0).first();
    if (!c) fail(404, 'card');
    if (c.owner_id) return json({ error: 'sold', owner: c.owner_nick || null }, 409);
    const price = await priceOf(c, h);
    if (!(price > 0)) fail(409, 'noprice');
    if (b.price != null && Number(b.price) !== price) return json({ error: 'price', price }, 409); // пока смотрели — цена изменилась
    if ((u.buttons || 0) < price) fail(402, 'poor');
    const lim = await firstDayLimit(env, h, c.collection);
    const ref = randomHex(8), t = now(), mine = 'SELECT 1 FROM card_owner WHERE card_id = ? AND ref = ?';
    const res = await env.DB.batch([
      env.DB.prepare(`INSERT OR IGNORE INTO card_owner (card_id, user_id, price, bought_at, ref) SELECT ?, ?, ?, ?, ?
        WHERE (SELECT COALESCE(buttons, 0) FROM users WHERE id = ?) >= ?
          AND EXISTS (SELECT 1 FROM cards WHERE id = ? AND hidden = 0 AND (rarity = 'common' OR price = ?))
          AND (? = 0 OR (SELECT COUNT(*) FROM card_owner o JOIN cards k ON k.id = o.card_id WHERE o.user_id = ? AND k.collection = ?) < ?)`)
        .bind(c.id, u.id, price, t, ref, u.id, price, c.id, price, lim, u.id, c.collection, lim),
      env.DB.prepare(`UPDATE users SET buttons = COALESCE(buttons, 0) - ? WHERE id = ? AND EXISTS (${mine})`).bind(price, u.id, c.id, ref),
      env.DB.prepare(`INSERT OR IGNORE INTO button_log (user_id, kind, ref, amount, day, created_at) SELECT ?, 'card', ?, ?, ?, ? WHERE EXISTS (${mine})`).bind(u.id, c.id + ':' + ref, -price, h.rigaDay(), t, c.id, ref),
    ]);
    if (!res[0].meta.changes) { // не вышло — объясняем почему (всё перепроверяем заново)
      const o = await env.DB.prepare('SELECT u.nick FROM card_owner o LEFT JOIN users u ON u.id = o.user_id WHERE o.card_id = ?').bind(c.id).first();
      if (o) return json({ error: 'sold', owner: o.nick || null }, 409);
      const cur = await env.DB.prepare('SELECT * FROM cards WHERE id = ? AND hidden = 0').bind(c.id).first();
      if (!cur) fail(404, 'card');
      const np = await priceOf(cur, h); if (np !== price) return json({ error: 'price', price: np }, 409);
      const bal = await env.DB.prepare('SELECT COALESCE(buttons, 0) AS b FROM users WHERE id = ?').bind(u.id).first();
      if (!bal || bal.b < price) fail(402, 'poor');
      if (lim) return json({ error: 'limit', limit: lim }, 409);
      fail(409, 'busy');
    }
    await h.flockEvent('card', u, { card: c.id, n: c.n, collection: c.collection, rarity: c.rarity, price });
    return json({ ok: true, buttons: (u.buttons || 0) - price, card: c.id, owner: u.nick });
  }

  // ---------- кабинет (только админ) ----------
  if (!p.startsWith('/api/admin/cards')) return null;
  const u = await h.needUser(req, env);
  if (!(await h.isAdmin(u, env))) fail(403, 'admin');
  const a = p.slice('/api/admin/cards'.length).replace(/^\//, '');
  const listOut = async () => {
    const rows = (await env.DB.prepare(`${SEL} ORDER BY c.n`).all()).results;
    const avg = await h.avgItemPrice(), mult = h.rules().cardMult || 100;
    return { cards: rows.map(c => ({ ...c, stats: statsOf(c) })), sets: await sets(env), mult, avg: Math.round(avg), common: round5(avg * mult / 100), firstDay: h.rules().cardsFirstDay || 0, nextN: ((rows[rows.length - 1] || {}).n || 0) + 1, files: await repoFiles(env, url) };
  };
  if (m === 'GET' && a === '') return json(await listOut(), 200, { 'cache-control': 'no-store' });
  if (m === 'POST' && a === 'save') {
    const b = await body();
    const rarity = RARITY.includes(b.rarity) ? b.rarity : 'common';
    const src = LANGS.includes(b.src_lang) ? b.src_lang : 'ru';
    const T = (o, n) => Object.fromEntries(LANGS.map(l => [l, clip((o || {})[l], n)]));
    const t = T(b.t, 80), d = T(b.d, 400);
    if (!LANGS.some(l => t[l])) fail(400, 'title');
    const stats = (Array.isArray(b.stats) ? b.stats : []).slice(0, 3).map(s => ({ ...T(s, 30), v: Math.max(1, Math.min(10, Math.round(Number(s && s.v) || 1))) }));
    // коллекция: slug существующей или новое название (на языке карточки) — тогда создаём
    let coll = slugify(b.collection || '');
    if (b.setName && typeof b.setName === 'object') {
      const nm = T(b.setName, 60);
      if (!coll) coll = slugify(nm.en || nm[src] || nm.ru || nm.lv);
      if (coll) await env.DB.prepare('INSERT INTO card_sets (slug, en, ru, lv, src_lang, created_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(slug) DO UPDATE SET en = excluded.en, ru = excluded.ru, lv = excluded.lv')
        .bind(coll, nm.en, nm.ru, nm.lv, src, now()).run();
    }
    if (!coll) fail(400, 'collection');
    const price = rarity === 'common' ? 0 : Math.max(0, Math.min(1000000, Math.floor(Number(b.price) || 0)));
    const img = clip(b.img, 300);
    if (img && !/^\/(media\/cards\/|images\/cards\/)[\w\/.-]+$/.test(img)) fail(400, 'img');
    const vals = [coll, rarity, price, img, b.hidden ? 1 : 0, src, t.en, t.ru, t.lv, d.en, d.ru, d.lv, JSON.stringify(stats), now()];
    let id = Number(b.id) || 0;
    if (id) {
      const r = await env.DB.prepare('UPDATE cards SET collection = ?, rarity = ?, price = ?, img = ?, hidden = ?, src_lang = ?, t_en = ?, t_ru = ?, t_lv = ?, d_en = ?, d_ru = ?, d_lv = ?, stats = ?, updated_at = ? WHERE id = ?').bind(...vals, id).run();
      if (!r.meta.changes) fail(404, 'card');
    } else { // новая — следующий номер
      const r = await env.DB.prepare(`INSERT INTO cards (n, collection, rarity, price, img, hidden, src_lang, t_en, t_ru, t_lv, d_en, d_ru, d_lv, stats, updated_at, created_at)
        VALUES ((SELECT COALESCE(MAX(n), 0) + 1 FROM cards), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(...vals, now()).run();
      id = r.meta.last_row_id;
    }
    return json({ ok: true, id, ...(await listOut()) });
  }
  // сменить номер: занят — карточки меняются номерами
  if (m === 'POST' && a === 'number') {
    const b = await body();
    const id = Number(b.id) || 0, n = Math.floor(Number(b.n) || 0);
    if (n < 1 || n > 1000000) fail(400, 'n');
    const me = await env.DB.prepare('SELECT id, n FROM cards WHERE id = ?').bind(id).first();
    if (!me) fail(404, 'card');
    if (me.n !== n) {
      const other = await env.DB.prepare('SELECT id FROM cards WHERE n = ?').bind(n).first();
      await env.DB.batch([
        env.DB.prepare('UPDATE cards SET n = ? WHERE id = ?').bind(-1000000 - id, id), // временно — номер уникален
        ...(other ? [env.DB.prepare('UPDATE cards SET n = ?, updated_at = ? WHERE id = ?').bind(me.n, now(), other.id)] : []),
        env.DB.prepare('UPDATE cards SET n = ?, updated_at = ? WHERE id = ?').bind(n, now(), id),
      ]);
    }
    return json({ ok: true, ...(await listOut()) });
  }
  if (m === 'POST' && a === 'hide') {
    const b = await body();
    await env.DB.prepare('UPDATE cards SET hidden = ?, updated_at = ? WHERE id = ?').bind(b.hidden ? 1 : 0, now(), Number(b.id) || 0).run();
    return json({ ok: true, ...(await listOut()) });
  }
  // удалить можно только карточку без владельца; у купленной — только «скрыть»
  if (m === 'POST' && a === 'delete') {
    const b = await body(), id = Number(b.id) || 0;
    const c = await env.DB.prepare('SELECT * FROM cards WHERE id = ?').bind(id).first();
    if (!c) fail(404, 'card');
    const r = await env.DB.prepare('DELETE FROM cards WHERE id = ? AND NOT EXISTS (SELECT 1 FROM card_owner WHERE card_id = ?)').bind(id, id).run();
    if (!r.meta.changes) fail(409, 'owned');
    if (env.MEDIA && /^\/media\/cards\//.test(c.img || '') && !(await env.DB.prepare('SELECT 1 FROM cards WHERE img = ?').bind(c.img).first())) await env.MEDIA.delete(c.img.slice(7)).catch(() => {});
    return json({ ok: true, ...(await listOut()) });
  }
  // картинка карточки Алины → R2 cards/
  if (m === 'POST' && a === 'upload') {
    if (!env.MEDIA) fail(503, 'media');
    const form = await req.formData(), file = form.get('file');
    if (!(file instanceof File)) fail(400, 'file');
    if (file.size > 4_000_000) fail(413, 'big');
    const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }[file.type];
    if (!ext) fail(400, 'type');
    const key = `cards/${randomHex(8)}.${ext}`;
    await env.MEDIA.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' } });
    return json({ url: '/media/' + key });
  }
  // множитель цены обычных карточек (% от средней цены вещи)
  if (m === 'POST' && a === 'mult') {
    const b = await body();
    await h.setRules({ cardMult: Number(b.mult) || 100 });
    return json({ ok: true, ...(await listOut()) });
  }
  // «⟳ Импортировать карточки с сайта»
  if (m === 'POST' && a === 'import') {
    const r = await importCards(env, url);
    return json({ ok: true, ...r, ...(await listOut()) });
  }
  // перевести карточку на недостающие языки (кнопка «🌐 Перевести» в списке, если перевода нет)
  if (m === 'POST' && a === 'translate-missing') {
    const r = await translateMissing(env);
    return json({ ok: true, ...r, ...(await listOut()) });
  }
  fail(404, 'not_found');
}

// ---------- импорт из репозитория ----------
async function asset(env, url, path) {
  const r = await env.ASSETS.fetch(new Request(new URL(path, url.origin || 'https://www.pigeonpolly.com').href));
  if (!r.ok) return null;
  return r.json().catch(() => null);
}
async function repoFiles(env, url) {
  const list = await asset(env, url, '/assets/cards/index.json').catch(() => null);
  if (!Array.isArray(list)) return [];
  const out = [];
  for (const slug of list) out.push({ slug, done: !!(await env.DB.prepare('SELECT value FROM meta WHERE key = ?').bind('cards_' + slug).first()) });
  return out;
}
// по 1 разу на коллекцию: заносим карточки и переводим недостающие языки (Gemini). Номер занят — следующий свободный.
export async function importCards(env, url) {
  const list = await asset(env, url, '/assets/cards/index.json').catch(() => null);
  const done = [], skipped = [], errors = [];
  for (const slug of Array.isArray(list) ? list : []) {
    if (!/^[a-z0-9-]{1,40}$/.test(slug)) continue;
    const key = 'cards_' + slug;
    if (await env.DB.prepare('SELECT value FROM meta WHERE key = ?').bind(key).first()) { skipped.push(slug); continue; }
    // ставим метку сразу (INSERT OR IGNORE) — два одновременных запуска не занесут коллекцию дважды
    const lock = await env.DB.prepare('INSERT OR IGNORE INTO meta (key, value) VALUES (?, ?)').bind(key, 'importing:' + now()).run();
    if (!lock.meta.changes) { skipped.push(slug); continue; }
    try {
      const raw = await asset(env, url, `/assets/cards/${slug}.json`);
      const items = (Array.isArray(raw) ? raw : raw && raw.cards || []).filter(x => x && (x.title || '').trim());
      if (!items.length) throw new Error('empty');
      const src = LANGS.includes(items[0].lang) ? items[0].lang : LANGS.includes(raw.lang) ? raw.lang : 'ru';
      const setTitle = String(items[0].collection || slug).trim();
      // что переводить: название коллекции, названия, описания, названия статов (без повторов)
      const statNames = [...new Set(items.flatMap(x => (x.stats || []).map(s => String(s.name || s[0] || '').trim())).filter(Boolean))];
      const texts = [setTitle, ...items.map(x => String(x.title).trim()), ...items.map(x => String(x.desc || '').trim()), ...statNames];
      const { tr, errors: te } = await Promise.race([translateTo(env, texts, src, LANGS, ABOUT.cards), new Promise(r => setTimeout(() => r({ tr: {}, errors: { all: 'timeout' } }), 25000))]);
      const L = (l, i) => l === src ? texts[i] : (tr[l] ? String(tr[l][i] || '').trim() : '');
      const nI = items.length;
      const setNames = Object.fromEntries(LANGS.map(l => [l, L(l, 0).slice(0, 60)]));
      await env.DB.prepare('INSERT INTO card_sets (slug, en, ru, lv, src_lang, created_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(slug) DO NOTHING').bind(slug, setNames.en, setNames.ru, setNames.lv, src, now()).run();
      const t = now();
      for (const [i, x] of items.entries()) {
        const stats = (x.stats || []).slice(0, 3).map(s => {
          const nm = String(s.name || s[0] || '').trim(), j = 1 + 2 * nI + statNames.indexOf(nm);
          return { ...Object.fromEntries(LANGS.map(l => [l, L(l, j).slice(0, 30)])), v: Math.max(1, Math.min(10, Math.round(Number(s.v ?? s[1]) || 1))) };
        });
        const want = Math.floor(Number(x.n) || 0);
        const free = want > 0 && !(await env.DB.prepare('SELECT 1 FROM cards WHERE n = ?').bind(want).first());
        const rarity = RARITY.includes(x.rarity) ? x.rarity : 'common';
        const img = /^\/images\/cards\/[\w\/.-]+$/.test(x.img || '') ? x.img : '';
        await env.DB.prepare(`INSERT INTO cards (n, collection, rarity, price, img, hidden, src_lang, t_en, t_ru, t_lv, d_en, d_ru, d_lv, stats, created_at, updated_at)
          VALUES (${free ? '?' : '(SELECT COALESCE(MAX(n), 0) + 1 + 0 * ? FROM cards)'}, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
          .bind(want, slug, rarity, Math.max(0, Math.floor(Number(x.price) || 0)), img, src,
            ...['en', 'ru', 'lv'].map(l => L(l, 1 + i).slice(0, 80)), ...['en', 'ru', 'lv'].map(l => L(l, 1 + nI + i).slice(0, 400)), JSON.stringify(stats), t, t).run();
      }
      if (!(await env.DB.prepare('SELECT COUNT(*) AS n FROM cards WHERE collection = ?').bind(slug).first()).n) throw new Error('not_saved');
      await env.DB.prepare('UPDATE meta SET value = ? WHERE key = ?').bind(String(t), key).run();
      done.push({ slug, cards: items.length, translated: Object.keys(tr), errors: te });
    } catch (e) {
      await env.DB.prepare('DELETE FROM meta WHERE key = ?').bind(key).run(); // не вышло — попробуем ещё раз
      errors.push({ slug, error: String(e.message || e) });
    }
  }
  return { imported: done, skipped, errors };
}
// пустые переводы (например, не было ключа Gemini во время импорта) — перевести сейчас
async function translateMissing(env) {
  const rows = (await env.DB.prepare('SELECT * FROM cards').all()).results;
  let n = 0;
  for (const c of rows) {
    const src = c.src_lang || 'ru', miss = LANGS.filter(l => l !== src && (!c['t_' + l] || (c['d_' + src] && !c['d_' + l]) || statsOf(c).some(s => !s[l])));
    if (!miss.length) continue;
    const st = statsOf(c), texts = [c['t_' + src] || '', c['d_' + src] || '', ...st.map(s => s[src] || '')];
    const { tr } = await translateTo(env, texts, src, miss, ABOUT.cards);
    const upd = {};
    for (const l of Object.keys(tr)) {
      if (!c['t_' + l]) upd['t_' + l] = String(tr[l][0] || '').slice(0, 80);
      if (!c['d_' + l]) upd['d_' + l] = String(tr[l][1] || '').slice(0, 400);
      st.forEach((s, i) => { if (!s[l]) s[l] = String(tr[l][2 + i] || '').slice(0, 30); });
    }
    if (!Object.keys(tr).length) continue;
    const cols = Object.keys(upd);
    await env.DB.prepare(`UPDATE cards SET ${[...cols.map(k => k + ' = ?'), 'stats = ?'].join(', ')} WHERE id = ?`).bind(...cols.map(k => upd[k]), JSON.stringify(st), c.id).run();
    n++;
  }
  for (const s of await sets(env)) {
    const src = s.src_lang || 'ru', miss = LANGS.filter(l => l !== src && !s[l]);
    if (!miss.length || !s[src]) continue;
    const { tr } = await translateTo(env, [s[src]], src, miss, ABOUT.cards);
    for (const l of Object.keys(tr)) await env.DB.prepare(`UPDATE card_sets SET ${l} = ? WHERE slug = ?`).bind(String(tr[l][0] || '').slice(0, 60), s.slug).run();
  }
  return { translatedCards: n };
}

// «Мои данные» и удаление аккаунта
export async function myCards(env, uid) {
  return (await env.DB.prepare('SELECT c.n, c.collection, c.rarity, c.t_en, c.t_ru, c.t_lv, o.price, o.bought_at FROM card_owner o JOIN cards c ON c.id = o.card_id WHERE o.user_id = ? ORDER BY c.n').bind(uid).all()).results
    .map(r => ({ number: r.n, collection: r.collection, rarity: r.rarity, title: { en: r.t_en, ru: r.t_ru, lv: r.t_lv }, price: r.price, bought_at: r.bought_at ? new Date(r.bought_at * 1000).toISOString() : null }));
}
