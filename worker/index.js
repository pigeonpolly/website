// Сервер сайта: отдаёт статические файлы из site/ и обслуживает /api/* для «Стены рисунков»:
// вход через Google, ник, загрузка работы дня, серии, стена, топ, модерация, GDPR (экспорт и удаление).
// Данные — Cloudflare D1 (env.DB), картинки челленджа — R2 (env.MEDIA, папка challenge/), старые ещё и в KV (env.IMAGES), пока идёт перенос. Блог — worker/blog.js (картинки блога в R2, env.MEDIA).
import { blogApi, blogPage, visitor, anonCode, birdName, translateAll } from './blog.js';

// sha256 от e-mail администратора (сам адрес в коде не храним)
const ADMIN_HASHES = ['80ac2786b60d61a30d6691a3d40de5d784cdefc580717add788821a7bf900118'];
const SESSION_DAYS = 180;
const MAX_FULL = 2_500_000, MAX_THUMB = 400_000;
const GOLD_PICKS = 15; // 3 звезды «Выбора Полли» (каждые 5 раз — звезда) = золотой ник
const INACTIVE_DAYS = 90; // 3 месяца без загрузок и без входа — картинки можно удалить (уровень и бейджи остаются), но только при заполненном хранилище

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const p = url.pathname;
    if (/^\/(?:(?:ru|lv)\/)?blog\//.test(p) || p.startsWith('/media/') || p === '/sitemap-blog.xml') {
      if (!env.DB) return env.ASSETS.fetch(req);
      try { await ensureSchema(env); return await blogPage(req, env, url, helpers(env)); }
      catch (e) { console.error(e); return env.ASSETS.fetch(req); } // если база недоступна — статическая заглушка
    }
    if (!p.startsWith('/api/')) return sitePage(req, env, url);
    if (!env.DB || !env.IMAGES || !env.GOOGLE_CLIENT_ID) return json({ ready: false }, 503);
    try {
      await ensureSchema(env);
      await loadRules(env); await loadDayColors(env);
      if (p.startsWith('/api/blog/')) return await blogApi(req, env, url, helpers(env));
      return await route(req, env, url);
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.code }, e.status);
      console.error(e);
      return json({ error: 'server' }, 500);
    }
  },
  // раз в час (cron в wrangler.jsonc): переносим порцию старых картинок из KV в R2 и, если хранилище почти полное, чистим картинки давно пропавших
  async scheduled(event, env, ctx) {
    if (!env.DB || !env.IMAGES) return;
    await ensureSchema(env);
    await loadRules(env); await loadDayColors(env);
    await setMeta(env, 'cron_at', String(Date.now())).catch(() => {}); // для «🤖 Автопилота» в кабинете: расписание живо
    ctx.waitUntil((async () => {
      if (!(await getMeta(env, 'buttons_backfill'))) await backfillButtons(env).catch(e => console.error('backfill', e)); // разовое начисление пуговок за прошлое
      await autoPrice(env).catch(e => console.error('price', e)); // раз в сутки: уровень цен под заработки птичек
      await autoRestock(env).catch(e => console.error('restock', e)); // раз в сутки (по Риге) пополнить магазин
      await migrateToR2(env); await cleanupInactive(env);
      await env.DB.prepare('DELETE FROM game_runs WHERE started < ?').bind(Date.now() - 2 * 86400000).run().catch(() => {}); // старые забеги игр (started — в мс)
      await env.DB.prepare('DELETE FROM maze_runs WHERE started < ?').bind(Date.now() - 2 * 86400000).run().catch(() => {});
      await env.DB.prepare('DELETE FROM visits WHERE ts < ?').bind(now() - 400 * 86400).run().catch(() => {}); // статистику храним ~13 месяцев
    })());
  },
};

// ---------- правки блоков сайта (режим «✏️ Править страницу» для админа) ----------
// страница берётся из статики, а блоки с правками (data-ppb) подменяются на лету; ?raw=1 — оригинал без правок (для редактора)
let blocksCache = { at: 0, rows: null };
async function siteBlocks(env) {
  if (blocksCache.rows && Date.now() - blocksCache.at < 20000) return blocksCache.rows;
  await ensureSchema(env);
  const rows = (await env.DB.prepare('SELECT id, lang, html, hidden, updated_at FROM site_blocks').all()).results;
  blocksCache = { at: Date.now(), rows };
  return rows;
}
let hiddenArtCache = { at: 0, rows: null };
async function hiddenArt(env) {
  if (hiddenArtCache.rows && Date.now() - hiddenArtCache.at < 20000) return hiddenArtCache.rows;
  const rows = (await env.DB.prepare('SELECT src, created_at FROM art_hidden').all()).results;
  hiddenArtCache = { at: Date.now(), rows };
  return rows;
}
async function sitePage(req, env, url) {
  if (req.method !== 'GET' || !env.DB || url.searchParams.has('raw')) return env.ASSETS.fetch(req);
  let rows, hid = [];
  try { rows = await siteBlocks(env); } catch (e) { console.error(e); return env.ASSETS.fetch(req); }
  if (/^\/(?:(?:ru|lv)\/)?art-portfolio\//.test(url.pathname)) hid = await hiddenArt(env).catch(() => []);
  // страницу просим целиком (без «If-None-Match»): ответ браузеру зависит ещё и от правок,
  // поэтому метка версии (ETag) = метка файла + версия правок
  const h = new Headers(req.headers); h.delete('if-none-match'); h.delete('if-modified-since');
  const res = await env.ASSETS.fetch(new Request(req, { headers: h }));
  if (res.status !== 200 || !(res.headers.get('content-type') || '').includes('text/html')) return res;
  const ver = rows.length + '.' + rows.reduce((m, r) => Math.max(m, r.updated_at || 0), 0) + (hid.length ? '.h' + hid.length + '.' + hid.reduce((m, r) => Math.max(m, r.created_at || 0), 0) : '');
  const etag = `W/"${(res.headers.get('etag') || '').replace(/^W\/|"/g, '')}-${ver}"`;
  if ((req.headers.get('if-none-match') || '') === etag) return new Response(null, { status: 304, headers: { etag, 'cache-control': 'no-cache' } });
  const out = new Response(res.body, res);
  out.headers.set('etag', etag); out.headers.delete('last-modified'); out.headers.set('cache-control', 'no-cache');
  const lang = (url.pathname.match(/^\/(ru|lv)\//) || [])[1] || 'en';
  const hidden = new Set(rows.filter(r => r.lang === '*' && r.hidden).map(r => r.id));
  const html = new Map(rows.filter(r => r.lang === lang && r.html != null).map(r => [r.id, r.html]));
  // устройство страницы: порядок блоков и новые блоки, добавленные админом (одно на все языки)
  let struct = null;
  const pg = rows.find(r => r.lang === '*' && r.id === 'page:' + url.pathname.replace(/^\/(ru|lv)(?=\/)/, ''));
  try { struct = pg && pg.html ? JSON.parse(pg.html) : null; } catch (e) { struct = null; }
  // ссылка «моя птичка» (/flock/?bird=ник): в превью мессенджеров — карточка этой птички
  const bird = /^\/(?:(?:ru|lv)\/)?flock\/$/.test(url.pathname) ? String(url.searchParams.get('bird') || '').replace(/^@/, '') : '';
  const birdOk = /^[\p{L}\p{N}_.-]{2,24}$/u.test(bird);
  if (!hidden.size && !html.size && !struct && !birdOk && !hid.length) return out;
  const anyLang = id => html.get(id) ?? (rows.find(r => r.id === id && r.html != null && ['en', 'ru', 'lv'].includes(r.lang)) || {}).html;
  const rw = new HTMLRewriter();
  const hidSet = new Set(hid.map(r => r.src)); // картины, скрытые Алиной в галереях «Мой скетчбук» (вернуть — в самой галерее)
  if (hidSet.size) rw.on('figure[data-src]', { element(el) { if (hidSet.has(el.getAttribute('data-src'))) el.remove(); } });
  if (birdOk) {
    const og = { en: [`@${bird} lives in the Pigeon Polly flock 🐦`, 'Everyone who signs in gets their own pixel bird. Get yours!'],
      ru: [`@${bird} живёт в стае Pigeon Polly 🐦`, 'Каждый, кто входит на сайт, получает свою пиксельную птичку. Заведи свою!'],
      lv: [`@${bird} dzīvo Pigeon Polly barā 🐦`, 'Katrs, kurš ienāk vietnē, saņem savu pikseļu putniņu. Iegūsti savu!'] }[lang];
    const set = v => ({ element(el) { el.setAttribute('content', v); } });
    rw.on('meta[property="og:image"]', set(`${url.origin}/api/birdcard?nick=${encodeURIComponent(bird)}`))
      .on('meta[property="og:title"]', set(og[0])).on('meta[property="og:description"]', set(og[1])).on('meta[name="description"]', set(og[1]))
      .on('meta[property="og:url"]', set(url.href)).on('meta[property="og:image:alt"]', set(og[0]))
      .on('title', { element(el) { el.setInnerContent(og[0]); } });
  }
  if (struct) {
    if (Array.isArray(struct.order) && struct.order.length) {
      const css = 'main#main{display:flex;flex-direction:column}main#main>*{order:-1}main#main>[data-ppb]{order:999}' + struct.order.map((id, i) => `main#main>[data-ppb="${String(id).replace(/[^a-z0-9.-]/g, '')}"]{order:${i}}`).join('');
      rw.on('head', { element(el) { el.append(`<style id="pp-order">${css}</style>`, { html: true }); } });
    }
    const custom = (struct.custom || []).filter(id => /^custom-[a-z0-9]{4,20}$/.test(id) && !hidden.has(id));
    if (custom.length) rw.on('main#main', { element(el) { for (const id of custom) el.append(`<section class="pp-custom" data-ppb="${id}" data-ppb-edited>${anyLang(id) || ''}</section>`, { html: true }); } });
  }
  return rw.on('[data-ppb]', {
    element(el) {
      const id = el.getAttribute('data-ppb');
      if (hidden.has(id)) el.setAttribute('data-ppb-hidden', ''); // скрыт: админ видит его в режиме правки и может вернуть
      if (html.has(id)) { el.setInnerContent(html.get(id), { html: true }); el.setAttribute('data-ppb-edited', ''); }
    },
  }).transform(out);
}

// ---------- комната птички (room.js): обои, пол, вид, шторы — по одной; мебель и украшения — сколько есть в сумке ----------
const roomOf = u => { try { const r = JSON.parse(u && u.room || '{}'); return r && typeof r === 'object' ? r : {}; } catch (e) { return {}; } };
async function ownedRoom(env, uid) {
  const m = {};
  for (const r of (await env.DB.prepare(`SELECT kind, item, COUNT(*) AS n FROM gifts WHERE user_id = ? AND status = 'bag' AND kind IN ('wall', 'floor', 'view', 'curtain', 'furn', 'deco') GROUP BY kind, item`).bind(uid).all()).results) m[r.kind + '|' + r.item] = r.n;
  return m;
}
function cleanRoom(room, own) {
  const out = { items: [] };
  for (const k of ['wall', 'floor', 'view', 'curtain']) if (typeof room[k] === 'string' && own[k + '|' + room[k]]) out[k] = room[k];
  const used = {};
  for (const it of Array.isArray(room.items) ? room.items.slice(0, 80) : []) {
    if (!it || !['furn', 'deco'].includes(it.k) || !/^[a-z0-9:-]{1,24}$/i.test(String(it.v))) continue;
    const key = it.k + '|' + it.v; if ((used[key] || 0) >= (own[key] || 0)) continue;
    used[key] = (used[key] || 0) + 1;
    const x = Math.max(-10, Math.min(200, Math.round(Number(it.x) || 0))), o = { k: it.k, v: String(it.v), x };
    // украшения — всегда со своим y; мебель — если её поставили руками (иначе стоит на полу/на том, что под ней)
    if (it.k === 'deco') o.y = Math.max(0, Math.min(120, Math.round(Number(it.y) || 0)));
    else if (it.y != null && Number.isFinite(Number(it.y))) o.y = Math.max(-60, Math.min(120, Math.round(Number(it.y))));
    if (it.f) o.f = 1;
    out.items.push(o);
  }
  return out;
}

// ---------- «🎲 Сюрприз»: вещь '?' любой категории → случайная вещь этой категории, которой у птички ещё нет (не легендарная) ----------
let catalogCache = null;
async function catalog(env, req) {
  if (catalogCache) return catalogCache;
  try { const r = await env.ASSETS.fetch(new Request(new URL('/assets/catalog.json', req.url))); if (r.ok) catalogCache = await r.json(); } catch (e) { /* нет каталога */ }
  return catalogCache || { items: {}, legend: [] };
}
// kind|? — категория; any|legend — любая легендарная; any|? — что угодно. Если в категории у птички уже всё есть — любая вещь, которой у неё нет.
// Возвращает [kind, item] или null (у птички есть вообще всё).
async function surpriseKI(env, req, uid, kind, item = '?') {
  const cat = await catalog(env, req), leg = new Set(cat.legend || []);
  const have = new Set((await env.DB.prepare("SELECT kind, item FROM gifts WHERE user_id = ? AND status IN ('bag', 'new')").bind(uid).all()).results.map(r => r.kind + '|' + r.item));
  const pick = list => list.length ? list[Math.floor(Math.random() * list.length)].split('|') : null;
  const all = Object.entries(cat.items || {}).flatMap(([k, vs]) => vs.map(v => k + '|' + v)).filter(x => !have.has(x));
  const anyNormal = () => pick(all.filter(x => !leg.has(x))) || pick(all);
  if (kind === 'any' && item === 'legend') return pick(all.filter(x => leg.has(x))) || anyNormal();
  if (kind === 'any') return anyNormal();
  return pick(all.filter(x => x.startsWith(kind + '|') && !leg.has(x))) || anyNormal();
}
const surprise = async (env, req, uid, kind) => { const r = await surpriseKI(env, req, uid, kind); return r && r[0] === kind ? r[1] : null; };

// ---------- адвент-календарь (/advent/): окошки 1–31 декабря, сутки по Риге ----------
const ADVENT_SPECIAL = [6, 12, 19, 24, 31];
const ADVENT_LAST_JAN_DEFAULT = 23; // теперь RULES.adventLastJan; // до 23 января (включительно) можно открыть пропущенные окошки // особые окошки (31-е — легендарное); то же в site/assets/advent.js
// бейдж «Коллекционер»: открыты все 31 окошко адвента одного года (пропущенные — до 23 января). true — только что получен
async function adventCollector(env, uid, year) {
  const n = (await env.DB.prepare('SELECT COUNT(*) AS n FROM advent_open WHERE user_id = ? AND year = ?').bind(uid, year).first()).n;
  if (n < RULES.cond.collector) return false;
  const u = await env.DB.prepare('SELECT badges FROM users WHERE id = ?').bind(uid).first();
  if (String(u && u.badges || '').split(',').includes('collector')) return false;
  await addBadge(env, uid, 'collector');
  await award(env, uid, 'badge', 'collector', BTN.badges.collector);
  return true;
}
function adventNow(req, env) {
  // на локальной проверке (DEV_FAKE_LOGIN) дату можно подменить заголовком x-dev-date: 2026-12-05
  const dev = env.DEV_FAKE_LOGIN === '1' && /^\d{4}-\d\d-\d\d$/.test(req.headers.get('x-dev-date') || '') ? req.headers.get('x-dev-date') : null;
  const [y, m, d] = (dev || rigaDay()).split('-').map(Number);
  // 1 декабря 00:00 по Риге (зимой UTC+2) = 30 ноября 22:00 UTC. year — год адвента (в январе — прошлый декабрь).
  // Пропущенные окошки можно открыть до 23 января включительно (claimTo — до какого дня декабря можно забрать)
  const catchUp = m === 1 && d <= RULES.adventLastJan;
  return { year: m === 1 ? y - 1 : y, day: m === 12 ? d : 0, month: m, claimTo: m === 12 ? d : catchUp ? 31 : 0, catchUp,
    startsAt: Date.UTC(y, 10, 30, 22), nowMs: dev ? Date.UTC(y, m - 1, d, 10) : Date.now() };
}

// ---------- картины с сайта и очередь палитр для дней ЭКСТРА ----------
const ART_GALLERIES = ['sketchbook', 'anxiety', 'bird', 'snail', 'detective', 'halloween', 'ai-art', 'other'];
const EXTRA0 = 2026 * 12 + 9; // октябрь 2026 — первый месяц очереди (индекс 0)
const extraMonth = (t = Date.now()) => { const d = new Date(t); return d.getUTCFullYear() * 12 + d.getUTCMonth() - EXTRA0; };
const parseJ = (s, d) => { try { return JSON.parse(s); } catch (e) { return d; } };
function artEntry(r) {
  const t = parseJ(r.title, ['', '', '']);
  return { key: r.key, gallery: r.gallery, img: `media/art/${r.key}.jpg`, thumb: `media/art/${r.key}-800.jpg`, w: r.w, h: r.h, added: true, palette: !!r.palette,
    title: { en: t[0], ru: t[1] || t[0], lv: t[2] || t[0] }, colors: parseJ(r.colors, []).map(c => ({ hex: c[0], en: c[1], ru: c[2], lv: c[3] })) };
}
// очередь = палитры картин из статики (content/extra-order.json, порядок не меняется) + добавленные с сайта:
// события «добавили» (вставка на сохранённое место pos) и «убрали» проигрываем по времени — так прошлые месяцы никогда не меняются
async function extraQueue(env, req) {
  let base = [];
  try { const r = await env.ASSETS.fetch(new Request(new URL('/assets/extra-palettes.json', req.url))); if (r.ok) base = await r.json(); } catch (e) { base = []; }
  const rows = (await env.DB.prepare('SELECT * FROM art_added ORDER BY id').all()).results;
  const ev = [];
  for (const r of rows.filter(r => r.palette)) { ev.push([r.created_at, 0, r]); if (r.removed_at) ev.push([r.removed_at, 1, r]); }
  ev.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2].id - b[2].id);
  const q = base.slice();
  for (const [, kind, r] of ev) {
    if (kind === 0) q.splice(Math.min(r.pos ?? q.length, q.length), 0, { k: r.key, t: parseJ(r.title, ['', '', '']), th: `media/art/${r.key}-800.jpg`, c: parseJ(r.colors, []) });
    else { const j = q.findIndex(x => x.k === r.key); if (j >= 0) q.splice(j, 1); }
  }
  return { q, rows };
}

// ---------- аватар: что надето из подарков (фон, обувь, головной убор, анимация, рамка) ----------
const GIFT_KINDS = ['bg', 'shoes', 'hat', 'anim', 'frame', 'item', 'scarf', 'wall', 'floor', 'view', 'curtain', 'furn', 'deco', 'any']; // any — «🎲 Сюрприз»: any|legend, any|? (в сумку попадает уже настоящая вещь)
const ROOM_KINDS = ['wall', 'floor', 'view', 'curtain', 'furn', 'deco']; // вещи для комнаты (room.js), не надеваются
const avatarOf = u => { try { const a = JSON.parse(u && u.avatar || '{}'); return a && typeof a === 'object' ? a : {}; } catch (e) { return {}; } };
const okItem = (kind, item) => GIFT_KINDS.includes(kind) && (kind === 'any' ? ['?', 'legend'].includes(item) : item === '?' || /^[#a-z0-9:-]{1,24}$/i.test(String(item || ''))); // '?' — «🎲 Сюрприз» этой категории

// общие функции для worker/blog.js
const helpers = env => ({ json, fail, cookie, currentUser, needUser, isAdmin, now, getMeta: k => getMeta(env, k), setMeta: (k, v) => setMeta(env, k, v), awardComment: (uid, cid) => awardComment(env, uid, cid) });

class HttpError extends Error { constructor(status, code) { super(code); this.status = status; this.code = code; } }
const fail = (status, code) => { throw new HttpError(status, code); };
const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });

// ---------- база ----------
let schemaReady = false;
async function ensureSchema(env) {
  if (schemaReady) return;
  await env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT, sub TEXT UNIQUE NOT NULL, email TEXT, nick TEXT UNIQUE COLLATE NOCASE,
      consent INTEGER DEFAULT 0, banned INTEGER DEFAULT 0, created_at INTEGER)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires INTEGER NOT NULL)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY, user_id INTEGER NOT NULL, day TEXT NOT NULL, theme TEXT, bw INTEGER DEFAULT 0,
      created_at INTEGER, hidden INTEGER DEFAULT 0, UNIQUE(user_id, day))`),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS posts_created ON posts(created_at)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT)`),
    // подписка «сообщите, когда выйдет книга»: только адрес, язык и текст согласия (GDPR); рассылает Алина вручную
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS subscribers (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, topic TEXT NOT NULL DEFAULT 'books',
      lang TEXT, consent TEXT, created_at INTEGER, UNIQUE(email, topic))`),
    // правки блоков сайта из режима «✏️ Править страницу»: id = data-ppb блока, lang = en/ru/lv; hidden — скрыт на всех языках (lang = '*')
    // подарки-семечки для аватара: Алина выдаёт из кабинета; status: new — ещё не открыт, bag — в сумке (удалить нельзя)
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS gifts (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, kind TEXT NOT NULL, item TEXT NOT NULL, note TEXT, status TEXT DEFAULT 'new', created_at INTEGER, opened_at INTEGER)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS site_blocks (id TEXT NOT NULL, lang TEXT NOT NULL, html TEXT, hidden INTEGER DEFAULT 0, page TEXT, updated_at INTEGER, PRIMARY KEY (id, lang))`),
    // пуговки: журнал начислений и трат (одно начисление на (кто, за что, ref) — повторно не дать); магазин: цена и сколько осталось
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS button_log (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, kind TEXT NOT NULL, ref TEXT NOT NULL, amount INTEGER NOT NULL, day TEXT, created_at INTEGER, UNIQUE (user_id, kind, ref))`),
    // посетители сайта (своя статистика без cookie): одна строка = один просмотр страницы; vid — хеш (IP + браузер + соль), меняется каждые сутки, сам IP не храним
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS visits (id INTEGER PRIMARY KEY AUTOINCREMENT, day TEXT NOT NULL, ts INTEGER, vid TEXT, entry INTEGER DEFAULT 0, path TEXT, lang TEXT,
      src TEXT, ref TEXT, campaign TEXT, device TEXT, os TEXT, browser TEXT, country TEXT)`),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS visits_day ON visits(day)`),
    // сохранённые ссылки с метками (кабинет → «Посетители»): по ним считаем заходы
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS utm_links (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT NOT NULL, source TEXT NOT NULL, campaign TEXT NOT NULL, note TEXT, created_at INTEGER, UNIQUE (path, source, campaign))`),
    // картины, добавленные Алиной с сайта (галереи «Мой скетчбук» + палитра): картинки в R2 art/<key>.jpg и art/<key>-800.jpg.
    // pos — место в очереди палитр дней ЭКСТРА в момент добавления; hidden — убрана с сайта; removed_at — убрана и из очереди (ещё не была показана)
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS art_added (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT UNIQUE NOT NULL, gallery TEXT NOT NULL, title TEXT, colors TEXT,
      w INTEGER, h INTEGER, palette INTEGER DEFAULT 1, pos INTEGER, hidden INTEGER DEFAULT 0, created_at INTEGER, removed_at INTEGER)`),
    // картины из статики, скрытые Алиной в галереях «Мой скетчбук» (src = images/.../x.jpg); сервер вырезает их из страниц
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS art_hidden (src TEXT PRIMARY KEY, thumb TEXT, gallery TEXT, created_at INTEGER)`),
    // адвент-календарь: что Алина положила в окошко дня (можно несколько — птичке достаётся одна из них) и кто что открыл
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS advent_plan (day INTEGER NOT NULL, kind TEXT NOT NULL, item TEXT NOT NULL, PRIMARY KEY (day, kind, item))`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS advent_open (user_id INTEGER NOT NULL, year INTEGER NOT NULL, day INTEGER NOT NULL, kind TEXT, item TEXT, buttons INTEGER DEFAULT 0, created_at INTEGER, PRIMARY KEY (user_id, year, day))`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS shop (kind TEXT NOT NULL, item TEXT NOT NULL, price INTEGER DEFAULT 0, stock INTEGER DEFAULT 0, PRIMARY KEY (kind, item))`),
    // игра «Пуговичный дождь»: забег (run) — с какого времени и какой уровень пройден
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS game_runs (id TEXT PRIMARY KEY, user_id INTEGER NOT NULL, started INTEGER NOT NULL, level INTEGER DEFAULT 0)`),
    // «Зельеварня Полли»: забег по лабиринту (какие ингредиенты в нём лежат) и книга рецептов птички (tier 0 — не сработало)
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS maze_runs (id TEXT PRIMARY KEY, user_id INTEGER NOT NULL, level INTEGER NOT NULL, seed INTEGER NOT NULL, items TEXT, started INTEGER NOT NULL, done INTEGER DEFAULT 0)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS potion_book (user_id INTEGER NOT NULL, combo TEXT NOT NULL, tier INTEGER NOT NULL, n INTEGER DEFAULT 1, created_at INTEGER, PRIMARY KEY (user_id, combo))`),
    // «Нарисуй мне» (/requests/): темы от посетителей и ответы Алины (img — id картинки, как у работ челленджа: /api/img/…)
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS draw_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, anon TEXT, text TEXT NOT NULL, lang TEXT, who TEXT, status TEXT DEFAULT 'open', img TEXT, gift TEXT, created_at INTEGER, answered_at INTEGER)`),
    // лайки «Нарисуй мне»: kind 't' — тема (пока не нарисована), 'd' — рисунок; who — 'u'+id или 'v'+cookie
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS draw_likes (rid INTEGER NOT NULL, kind TEXT NOT NULL, who TEXT NOT NULL, created_at INTEGER, PRIMARY KEY (rid, kind, who))`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS potion_gifts (id INTEGER PRIMARY KEY AUTOINCREMENT, to_id INTEGER NOT NULL, from_nick TEXT, ing TEXT NOT NULL, n INTEGER NOT NULL, created_at INTEGER, seen INTEGER DEFAULT 0)`),
  ]);
  // новые колонки для уже созданной базы: рекорд и бейджи, которые остаются после очистки картинок
  for (const sql of ["ALTER TABLE users ADD COLUMN avatar TEXT DEFAULT ''", 'ALTER TABLE users ADD COLUMN best INTEGER DEFAULT 0', "ALTER TABLE users ADD COLUMN badges TEXT DEFAULT ''",
    "ALTER TABLE users ADD COLUMN months TEXT DEFAULT ''", 'ALTER TABLE advent_open ADD COLUMN got TEXT', "ALTER TABLE users ADD COLUMN room TEXT DEFAULT ''", 'ALTER TABLE posts ADD COLUMN tod INTEGER',
    'ALTER TABLE users ADD COLUMN picks INTEGER DEFAULT 0', 'ALTER TABLE posts ADD COLUMN picked INTEGER DEFAULT 0',
    "ALTER TABLE users ADD COLUMN mcount TEXT DEFAULT ''", 'ALTER TABLE posts ADD COLUMN bytes INTEGER', 'ALTER TABLE users ADD COLUMN last_seen INTEGER',
    // перенос картинок в R2: store = 'r2' — картинка уже в R2; kv = 1 — копия ещё лежит в KV
    'ALTER TABLE posts ADD COLUMN store TEXT', 'ALTER TABLE posts ADD COLUMN ai INTEGER DEFAULT 0', 'ALTER TABLE shop ADD COLUMN added_at INTEGER', 'ALTER TABLE button_log ADD COLUMN seen INTEGER DEFAULT 1', 'ALTER TABLE users ADD COLUMN game_best INTEGER DEFAULT 0', 'ALTER TABLE users ADD COLUMN game_best_at INTEGER', 'ALTER TABLE users ADD COLUMN maze_level INTEGER DEFAULT 1', "ALTER TABLE users ADD COLUMN inv TEXT DEFAULT ''", 'ALTER TABLE users ADD COLUMN pot_fails INTEGER DEFAULT 0', 'ALTER TABLE draw_requests ADD COLUMN text_en TEXT', 'ALTER TABLE users ADD COLUMN room_at INTEGER', 'ALTER TABLE users ADD COLUMN req_n INTEGER DEFAULT 0', 'ALTER TABLE users ADD COLUMN req_mid INTEGER DEFAULT 0', 'ALTER TABLE posts ADD COLUMN kv INTEGER DEFAULT 1',
    'ALTER TABLE users ADD COLUMN buttons INTEGER DEFAULT 0', 'ALTER TABLE users ADD COLUMN referrer INTEGER']) {
    try { await env.DB.prepare(sql).run(); } catch (e) { /* колонка уже есть */ }
  }
  // «Выбор Полли» подешевел с 50 до 11 пуговок: уже начисленные записи пересчитать один раз, баланс = сумма журнала
  try {
    if (!(await env.DB.prepare("SELECT value FROM meta WHERE key = 'pick_price_11'").first())) {
      await env.DB.prepare("UPDATE button_log SET amount = 11 WHERE kind = 'pick' AND amount != 11").run();
      await env.DB.prepare("UPDATE users SET buttons = MAX(0, (SELECT COALESCE(SUM(amount), 0) FROM button_log b WHERE b.user_id = users.id)) WHERE id IN (SELECT DISTINCT user_id FROM button_log WHERE kind = 'pick')").run();
      await env.DB.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES ('pick_price_11', '1')").run();
    }
  } catch (e) { console.error('pick price', e); }
  // 11.10.2026: зелья получаются чаще — из книги убрать «не сработало» у сочетаний, которые теперь работают (один раз)
  try {
    if (!(await env.DB.prepare("SELECT value FROM meta WHERE key = 'potfail_v2'").first())) {
      const bad = (await env.DB.prepare('SELECT user_id, combo FROM potion_book WHERE tier = 0').all()).results.filter(r => potionOf(r.combo).tier > 0);
      for (let i = 0; i < bad.length; i += 50) await env.DB.batch(bad.slice(i, i + 50).map(r => env.DB.prepare('DELETE FROM potion_book WHERE user_id = ? AND combo = ? AND tier = 0').bind(r.user_id, r.combo)));
      await env.DB.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES ('potfail_v2', '1')").run();
    }
  } catch (e) { console.error('potfail', e); }
  schemaReady = true;
}

const now = () => Math.floor(Date.now() / 1000);

// ---------- пуговки (валюта сайта) ----------
// сколько и за что: заход раз в день, рисунок в челлендж, до 3 комментариев в день, друг, указавший тебя при регистрации
const BTN = { daily: 3, upload: 10, comment: 2, commentsPerDay: 3, friend: 20, pick: 11,
  // бейджи: уровни по рекордной серии (дней) и особые достижения — пуговки один раз за каждый
  levels: { 1: 5, 3: 10, 7: 20, 14: 30, 30: 50, 60: 80, 100: 120, 365: 300 },
  badges: { bw: 5, extra: 15, bday: 15, early: 15, owl: 15, comeback: 15, ten: 20, weekend: 20, newyear: 20, halloween: 20,
    monthly: 25, inkmaster: 25, alt: 30, clock: 30, veteran: 30, fifty: 50, collector: 50, hundred: 100, robot: 1,
    cpurple: 20, cyellow: 20, cred: 20, cblue: 20, cgreen: 20,
    rain1: 10, rain2: 20, rain3: 40, pot1: 5, pot2: 15, pot3: 50, potkid: 20, maze: 20 } }; // игры: «Пуговичный дождь» (rain*) и «Зельеварня» (pot*, maze) // c* — N рисунков в дни, когда в теме дня был этот цвет // robot — загрузил работу с пометкой 🤖 «ИИ-генерация»
// легендарные вещи (как LEGEND в birds.js): в магазине по одной штуке на птичку, дарить нельзя; обычных — до трёх одинаковых
const LEGEND = new Set(['furn|countcoffin', 'furn|crypt', 'furn|tieredcake', 'hat|halo', 'hat|unicorn', 'hat|flamecrown', 'item|dragonegg', 'item|goldfeather', 'item|comet', 'item|goldenapple', 'frame|legend', 'anim|aurora', 'furn|throne', 'view|aurora', 'wall|gold', 'floor|marble', 'furn|dragon', 'furn|portal', 'furn|treasure', 'furn|phoenixnest', 'furn|pollystatue', 'deco|rainbowarc', 'deco|constellation', 'wall|stainedglass', 'floor|clouds', 'floor|goldtiles', 'view|dragonsky', 'curtain|starlight']);
// ---------- правила сайта, которые Алина меняет в кабинете (раздел «📜 Правила»): хранятся в meta 'rules', поверх значений по умолчанию ----------
const RULE_DEFAULTS = {
  daily: 3, upload: 10, comment: 2, commentsPerDay: 3, friend: 20, pick: 11,
  levels: { ...BTN.levels }, badges: { ...BTN.badges },
  shopMax: 3, legendMax: 1, priceMin: 0.75, priceMax: 2.5,
  // «мало / обычно / много» штук в магазине — в % от числа птичек (с ником, не заблокированных); у легендарных — legendPct % от этих чисел
  lowPct: 5, normPct: 20, manyPct: 50, legendPct: 25,
  adventLastJan: 23, adventButtons: 10, adventSpecialButtons: 25,
  aiStreak: true, aiUpload: true,
  sellOn: true, sellPrice: 5,
  // «Пуговичный дождь»: за уровень gameLevel 🔘 × (1 + ⌊(ур.−1)/10⌋) — каждый номер уровня раз в сутки; gameDayMax — лимит в сутки (0 — без лимита);
  // каждые gameItemEvery уровней — вещь из магазина (0 — выкл.); первое место в рекордах — gameKing 🔘 в день, когда играет
  // НАГРАДЫ ИГР — в % от средней цены обычной вещи в магазине (пересчёт раз в сутки, `gameUnit`): цены растут — растут и награды
  gameOn: true, gameLevelPct: 2, gameRecordPct: 4, gameDayMaxPct: 0, gameMinSec: 5, gameItemEvery: 30, gameKingPct: 10,
  // «Зельеварня»: 🔘 за новое зелье по уровням (обычное / вкусное / вкус детства), за повторное, лимит в сутки; лабиринт быстрее potionMinSec с не засчитывается
  potionOn: true, potion1Pct: 4, potion2Pct: 12, potion3Pct: 35, potionAgainPct: 1, potionDayMaxPct: 60, potionMinSec: 8,
  potionSeason: 'auto', potionShelf: true, // сезон зельеварни (auto — по календарю) и бутылочка в комнату за новое зелье «Вкус детства» // «Пуговичный дождь»: 🔘 за пройденный уровень, не больше gameDayMax в сутки; уровень быстрее gameMinSec с — не засчитывается
  indexOn: false, indexBase: 0, priceDays: 4, catMult: {}, // indexOn: пуговки за цены — выключено: теперь цены сами следуют за пуговками; priceDays — за сколько дней обычной активности средняя птичка зарабатывает на среднюю вещь // индексация обычных пуговок по средней цене вещи (0 — стартовая цена = цена в день включения)
  restockOn: true, restockTo: 0, // раз в сутки: у всех вещей, кроме легендарных, остаток дотягивается до restockTo шт. (0 — до «обычного запаса») // продажа вещей обратно в магазин: одна цена за любую вещь
  // условия бейджей (числа из описаний «как получить»)
  cond: { early: 5, earlyBefore: 8, owl: 5, owlFrom: 23, owlTo: 4, ten: 10, fifty: 50, hundred: 100, inkmaster: 10, comeback: 30, weekend: 4,
    alt: 15, clock: 10, clockWin: 60, monthly: 3, veteranMonths: 36, veteranPer: 2, collector: 31, colors: 10,
    rainA: 5, rainB: 15, rainC: 30, potA: 10, potB: 50, mazeA: 20 },
};
const COND_RANGE = { earlyBefore: [1, 23], owlFrom: [0, 23], owlTo: [0, 23], clockWin: [1, 720], collector: [1, 31] };
const RULE_NUM = { daily: [0, 1000], upload: [0, 1000], comment: [0, 1000], commentsPerDay: [0, 100], friend: [0, 1000], pick: [0, 1000],
  shopMax: [1, 99], legendMax: [1, 99], lowPct: [0.1, 1000], normPct: [0.1, 1000], manyPct: [0.1, 10000], legendPct: [1, 100], priceMin: [0.1, 1], priceMax: [1, 10],
  adventLastJan: [0, 31], adventButtons: [0, 1000], adventSpecialButtons: [0, 1000], sellPrice: [0, 10000], restockTo: [0, 10000], indexBase: [0, 100000], priceDays: [1, 60], gameLevelPct: [0, 100], gameRecordPct: [0, 100], gameDayMaxPct: [0, 10000], gameMinSec: [1, 60], gameItemEvery: [0, 1000], gameKingPct: [0, 1000], potion1Pct: [0, 1000], potion2Pct: [0, 1000], potion3Pct: [0, 1000], potionAgainPct: [0, 1000], potionDayMaxPct: [0, 10000], potionMinSec: [1, 120] };
let RULES = JSON.parse(JSON.stringify(RULE_DEFAULTS)), rulesAt = 0;
// сколько штук — «мало», «обычно» (цена = ценности), «много» — по числу птичек; считается в loadRules (раз в 15 с)
function stockLevels(birds) {
  const n = (pct, k = 1) => Math.max(1, Math.round(birds * pct / 100 * k)), lg = RULES.legendPct / 100;
  const o = { birds, low: n(RULES.lowPct), norm: n(RULES.normPct), many: n(RULES.manyPct), lowLeg: n(RULES.lowPct, lg), normLeg: n(RULES.normPct, lg), manyLeg: n(RULES.manyPct, lg) };
  o.low = Math.min(o.low, o.norm); o.lowLeg = Math.min(o.lowLeg, o.normLeg); o.many = Math.max(o.many, o.norm + 1); o.manyLeg = Math.max(o.manyLeg, o.normLeg + 1);
  return o;
}
let STOCK = stockLevels(50);
function cleanRules(r) {
  const out = JSON.parse(JSON.stringify(RULE_DEFAULTS));
  if (!r || typeof r !== 'object') return out;
  for (const [k, [lo, hi]] of Object.entries(RULE_NUM)) if (r[k] != null && Number.isFinite(Number(r[k]))) out[k] = Math.max(lo, Math.min(hi, Number(r[k])));
  for (const g of ['levels', 'badges']) for (const k of Object.keys(out[g])) if (r[g] && r[g][k] != null && Number.isFinite(Number(r[g][k]))) out[g][k] = Math.max(0, Math.min(10000, Math.round(Number(r[g][k]))));
  for (const k of ['aiStreak', 'aiUpload', 'sellOn', 'restockOn', 'gameOn', 'potionOn', 'potionShelf', 'indexOn']) if (typeof r[k] === 'boolean') out[k] = r[k];
  for (const k of Object.keys(out.cond)) if (r.cond && r.cond[k] != null && Number.isFinite(Number(r.cond[k]))) { const [lo, hi] = COND_RANGE[k] || [1, 10000]; out.cond[k] = Math.max(lo, Math.min(hi, Math.round(Number(r.cond[k])))); }
  for (const k of ['daily', 'upload', 'comment', 'commentsPerDay', 'friend', 'pick', 'shopMax', 'legendMax', 'adventLastJan', 'adventButtons', 'adventSpecialButtons', 'sellPrice', 'restockTo', 'gameMinSec', 'gameItemEvery', 'potionMinSec']) out[k] = Math.round(out[k]);
  for (const k of Object.keys(out)) if (k.endsWith('Pct')) out[k] = Math.round(out[k] * 10) / 10; // проценты — с точностью до 0.1
  if (['auto', 'autumn', 'winter', 'spring', 'summer'].includes(r.potionSeason)) out.potionSeason = r.potionSeason;
  out.catMult = {}; if (r.catMult && typeof r.catMult === 'object') for (const k of GIFT_KINDS) { const v = Number(r.catMult[k]); if (Number.isFinite(v) && v !== 100) out.catMult[k] = Math.max(10, Math.min(1000, Math.round(v))); }
  if (out.priceMin > out.priceMax) out.priceMin = out.priceMax;
  if (out.lowPct > out.normPct) out.lowPct = out.normPct;
  if (out.manyPct < out.normPct) out.manyPct = out.normPct;
  return out;
}
async function loadRules(env) {
  if (Date.now() - rulesAt < 15000) return RULES;
  rulesAt = Date.now();
  RULES = cleanRules(parseJ(await getMeta(env, 'rules'), null));
  // пуговки — в общий объект BTN (по нему всё начисляется и показывается людям)
  try { const b = await env.DB.prepare('SELECT COUNT(*) AS n FROM users WHERE nick IS NOT NULL AND banned = 0').first(); STOCK = stockLevels(b ? b.n : 0); } catch (e) { STOCK = stockLevels(STOCK.birds); }
  try { if (!CAT_P) CAT_P = (await catalog(env, new Request('https://pigeonpolly.com/'))).prices || {}; const pl = parseJ(await getMeta(env, 'price_level'), null); if (pl && pl.L > 0) PLEVEL = pl; else await autoPrice(env); } catch (e) { /* по умолчанию L = 1 */ }
  // индексация: все пуговки (заход, рисунок, комментарий, друг, «Выбор Полли», уровни, бейджи, адвент) × (средняя цена вещи сегодня ÷ стартовая цена);
  // стартовая — RULES.indexBase или (0) средняя цена в день включения (meta 'index_base'), поэтому сразу после включения ничего не меняется
  let avg = 0, base = 0;
  try { avg = (await gameUnit(env)).avg; base = RULES.indexBase > 0 ? RULES.indexBase : Number(await getMeta(env, 'index_base')) || 0; if (!base && avg) { base = avg; await setMeta(env, 'index_base', String(avg)); } } catch (e) { /* без индексации */ }
  const k = 1, ix = n => n > 0 ? Math.max(1, Math.round(n * k)) : 0; // индексация отключена (11.10.2026): цены сами следуют за пуговками (autoPrice), иначе цены и пуговки разгоняли бы друг друга
  Object.assign(BTN, { daily: ix(RULES.daily), upload: ix(RULES.upload), comment: ix(RULES.comment), commentsPerDay: RULES.commentsPerDay, friend: ix(RULES.friend), pick: ix(RULES.pick),
    advent: ix(RULES.adventButtons), adventSpecial: ix(RULES.adventSpecialButtons), index: { on: false, k: 1, avg, base } });
  for (const [d, n] of Object.entries(RULES.levels)) BTN.levels[d] = ix(n);
  for (const [b, n] of Object.entries(RULES.badges)) BTN.badges[b] = ix(n);
  BTN.cond = RULES.cond; BTN.sell = RULES.sellOn ? RULES.sellPrice : null;  // цена продажи вещи в магазин (null — продажа выключена) // условия бейджей уходят людям вместе с наградами (описания «как получить» подставляют числа)
  return RULES;
}
// цвета темы дня (site/assets/day-colors.json, собирает tools/daycolors.js): {"2026-10-11": "yp"} — для бейджей за цвета
let DAYCOL = null;
async function loadDayColors(env) {
  if (DAYCOL) return DAYCOL;
  try { const r = await env.ASSETS.fetch(new Request('https://pigeonpolly.com/assets/day-colors.json')); DAYCOL = r.ok ? await r.json() : {}; } catch (e) { DAYCOL = {}; }
  return DAYCOL;
}
const gameOnly = (kind, item) => kind === 'furn' && String(item).startsWith('kidpot'); // вещи только из игр (бутылочка «Вкус детства»): в магазин не попадают
const legMax = (kind, item) => LEGEND.has(kind + '|' + item) ? RULES.legendMax : RULES.shopMax;
// дни для серии: работы с пометкой 🤖 считаются, если так разрешено в правилах
const streakDays = rows => rows.filter(r => RULES.aiStreak || !(r.ai > 0)).map(r => r.day);
// цена от остатка: в shop.price — ценность вещи (цена при обычном запасе STOCK.norm, у легендарных — STOCK.normLeg);
// меньше осталось — дороже (до ×2.5), больше — дешевле (до ×0.75). То же считает admin.js effPrice.
function effPrice(base, stock, leg) {
  if (!(base > 0)) return 0;
  const f = Math.max(RULES.priceMin, Math.min(RULES.priceMax, Math.pow((leg ? STOCK.normLeg : STOCK.norm) / Math.max(1, stock || 0), 0.4)));
  return Math.max(5, Math.round(base * f / 5) * 5);
}
// ---------- цены магазина: сами (11.10.2026, «хочу менять только % категорий и цены легендарных») ----------
// обычная вещь: ценность из каталога × % категории (RULES.catMult) × уровень цен PLEVEL.L (сам подстраивается под заработки птичек, autoPrice) × остаток;
// легендарная — ровно та цена, что поставила Алина (shop.price), без множителей
let PLEVEL = { L: 1 }, CAT_P = null;
const isLeg = (kind, item) => LEGEND.has(kind + '|' + item) || item === 'legend';
const catMul = kind => ((RULES.catMult || {})[kind] || 100) / 100;
function baseNow(kind, item, base) {
  if (isLeg(kind, item)) return base > 0 ? base : 0;
  const v = (CAT_P && CAT_P[kind + '|' + item]) || base;
  return v > 0 ? Math.round(v * catMul(kind) * PLEVEL.L) : 0;
}
function priceNow(kind, item, base, stock) {
  const b = baseNow(kind, item, base);
  if (!(b > 0)) return 0;
  return isLeg(kind, item) ? b : effPrice(b, stock, false); // легендарные — ровно как поставлено
}
const shopRow = r => ({ kind: r.kind, item: r.item, base: baseNow(r.kind, r.item, r.price), stock: r.stock, added: r.added_at || 0, price: priceNow(r.kind, r.item, r.price, r.stock), leg: isLeg(r.kind, r.item) });
// уровень цен раз в сутки: медианный заработок активной птички (≥ 3 дней из 14) за день активности (без зарплаты, подарков админа и продаж) × RULES.priceDays = средняя цена вещи;
// если птички много накопили (в среднем больше 10 средних вещей) — чуть дороже; меняется не больше чем на 10 % в день
async function autoPrice(env, force = false) {
  const day = rigaDay(), cur = parseJ(await getMeta(env, 'price_level'), null);
  if (!force && cur && cur.day === day) return cur;
  const cat = await catalog(env, new Request('https://pigeonpolly.com/')), cp = cat.prices || {}, leg = new Set(cat.legend || []);
  const keys = Object.entries(cat.items || {}).flatMap(([k, vs]) => vs.map(v => k + '|' + v)).filter(x => !leg.has(x) && cp[x] > 0);
  const avgVal = keys.length ? keys.reduce((a, x) => a + cp[x] * catMul(x.split('|')[0]), 0) / keys.length : 0;
  let L = cur ? cur.L : 0;
  if (!L) { // первый запуск: уровень такой, чтобы средняя цена осталась как была
    const rows = (await env.DB.prepare('SELECT kind, item, price FROM shop WHERE price > 0').all()).results.filter(r => cp[r.kind + '|' + r.item] > 0 && !isLeg(r.kind, r.item));
    const was = rows.length ? rows.reduce((a, r) => a + r.price, 0) / rows.length : 0, val = rows.length ? rows.reduce((a, r) => a + cp[r.kind + '|' + r.item], 0) / rows.length : 0;
    L = was && val ? Math.max(0.2, Math.min(5, was / val)) : 1;
  }
  const since = now() - 14 * 86400;
  // активная птичка — зарабатывала хотя бы 3 разных дня из 14; её заработок — за один день активности
  const inc = (await env.DB.prepare("SELECT b.user_id, SUM(b.amount) AS s, COUNT(DISTINCT b.day) AS days, MAX(u.buttons) AS bal FROM button_log b JOIN users u ON u.id = b.user_id WHERE b.amount > 0 AND b.created_at >= ? AND b.kind NOT IN ('admin', 'salary', 'sell') AND u.banned = 0 GROUP BY b.user_id").bind(since).all()).results.filter(r => r.s > 0 && r.days >= 3);
  let income = 0, target = 0, Lt = L;
  if (inc.length >= 3 && avgVal > 0) {
    const ss = inc.map(r => r.s / r.days).sort((a, b) => a - b); income = ss[ss.length >> 1];
    target = income * RULES.priceDays;
    const avgBal = inc.reduce((a, r) => a + (r.bal || 0), 0) / inc.length;
    if (avgBal > 10 * avgVal * L) target *= 1.15;
    Lt = Math.max(0.2, Math.min(5, target / avgVal));
    L = L * Math.max(0.9, Math.min(1.1, Lt / L));
  }
  const out = { day, L: Math.round(L * 1000) / 1000, income: Math.round(income * 10) / 10, target: Math.round(target), active: inc.length, avg: Math.round(avgVal * L) };
  await setMeta(env, 'price_level', JSON.stringify(out)); PLEVEL = out;
  return out;
}
// один раз: всем вещам — ценность из каталога (site/assets/catalog.json → prices, считает tools/catalog.js)
// ежедневное пополнение: только закончившиеся вещи (остаток 0 или ещё нет в магазине), кроме легендарных, — до цели; остальные не трогаем
async function autoRestock(env, force = false) {
  if (!force && (!RULES.restockOn || (await getMeta(env, 'restock_day')) === rigaDay())) return null;
  const req = new Request('https://pigeonpolly.com/'), cat = await catalog(env, req), cp = cat.prices || {};
  await ensurePrices(env, req);
  const to = RULES.restockTo > 0 ? RULES.restockTo : STOCK.norm, keys = new Set();
  for (const [k, xs] of Object.entries(cat.items || {})) for (const v of xs) keys.add(k + '|' + v);
  for (const r of (await env.DB.prepare('SELECT kind, item FROM shop').all()).results) keys.add(r.kind + '|' + r.item);
  const list = [...keys].filter(k => !LEGEND.has(k) && !k.endsWith('|legend') && !gameOnly(...k.split('|'))).map(k => k.split('|')).filter(([k, v]) => GIFT_KINDS.includes(k) && v);
  const st = env.DB.prepare('INSERT INTO shop (kind, item, price, stock, added_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(kind, item) DO UPDATE SET added_at = CASE WHEN shop.stock <= 0 THEN excluded.added_at ELSE shop.added_at END, stock = CASE WHEN shop.stock <= 0 THEN excluded.stock ELSE shop.stock END');
  const was = (await env.DB.prepare('SELECT COUNT(*) AS n FROM shop WHERE stock > 0').first()).n;
  for (let i = 0; i < list.length; i += 50) await env.DB.batch(list.slice(i, i + 50).map(([k, v]) => st.bind(k, v, cp[k + '|' + v] || 30, to, now())));
  const filled = (await env.DB.prepare('SELECT COUNT(*) AS n FROM shop WHERE stock > 0').first()).n - was;
  await setMeta(env, 'restock_day', rigaDay()); await setMeta(env, 'restock_last', JSON.stringify({ day: rigaDay(), at: now(), to, items: filled }));
  return { to, items: filled };
}
async function ensurePrices(env, req) {
  if (await env.DB.prepare("SELECT value FROM meta WHERE key = 'prices_v1'").first()) return;
  const cat = await catalog(env, req), list = Object.entries(cat.prices || {});
  if (!list.length) return;
  const st = env.DB.prepare('INSERT INTO shop (kind, item, price, stock) VALUES (?, ?, ?, 0) ON CONFLICT(kind, item) DO UPDATE SET price = excluded.price');
  for (let i = 0; i < list.length; i += 50) await env.DB.batch(list.slice(i, i + 50).map(([k, p]) => { const j = k.indexOf('|'); return st.bind(k.slice(0, j), k.slice(j + 1), p); }));
  await env.DB.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES ('prices_v1', ?)").bind(String(now())).run();
}
const copies = async (env, uid, kind, item) => (await env.DB.prepare("SELECT COUNT(*) AS n FROM gifts WHERE user_id = ? AND kind = ? AND item = ? AND status IN ('bag', 'new')").bind(uid, kind, item).first()).n;
const rigaDay = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Riga' }); // сутки по Риге
async function award(env, uid, kind, ref, amount) {
  const r = await env.DB.prepare('INSERT OR IGNORE INTO button_log (user_id, kind, ref, amount, day, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(uid, kind, String(ref), amount, rigaDay(), now()).run();
  if (!r.meta.changes) return 0;
  await env.DB.prepare('UPDATE users SET buttons = COALESCE(buttons, 0) + ? WHERE id = ?').bind(amount, uid).run();
  return amount;
}
// комментарий: пуговки только за первые три в сутки
async function awardComment(env, uid, commentId) {
  const n = (await env.DB.prepare("SELECT COUNT(*) AS n FROM button_log WHERE user_id = ? AND kind = 'comment' AND day = ?").bind(uid, rigaDay()).first()).n;
  return n < BTN.commentsPerDay ? award(env, uid, 'comment', commentId, BTN.comment) : 0;
}
// пуговки за бейджи: за каждый уровень серии и особый бейдж — один раз (в том числе за полученные раньше)
async function awardBadges(env, uid, best, badges) {
  const want = [...Object.entries(BTN.levels).filter(([d]) => best >= +d).map(([d, n]) => ['lv' + d, n]),
    ...badges.filter(k => BTN.badges[k]).map(k => [k, BTN.badges[k]])];
  if (!want.length) return { total: 0, got: [] };
  const have = new Set((await env.DB.prepare("SELECT ref FROM button_log WHERE user_id = ? AND kind = 'badge'").bind(uid).all()).results.map(r => r.ref));
  let total = 0; const got = [];
  for (const [ref, n] of want) if (!have.has(ref)) { const a = await award(env, uid, 'badge', ref, n); if (a) { total += a; got.push(ref); } }
  return { total, got };
}
// разовое начисление за прошлое (октябрь 2026): каждому — за все бейджи, за каждый загруженный рисунок и за «Выбор Полли».
// Считается в памяти из трёх запросов, записи — пачками (INSERT OR IGNORE: повторно не начислит), баланс = сумма журнала.
async function backfillButtons(env) {
  const users = (await env.DB.prepare("SELECT * FROM users WHERE banned = 0 AND nick IS NOT NULL AND nick != ''").all()).results;
  const posts = (await env.DB.prepare('SELECT user_id, id, day, bw, ai, tod, picked FROM posts').all()).results;
  const byUser = new Map(); for (const x of posts) (byUser.get(x.user_id) || byUser.set(x.user_id, []).get(x.user_id)).push(x);
  const pickUser = Number(await getMeta(env, 'pick_user'));
  const day = rigaDay(), t = now(), ins = [];
  const add = (uid, kind, ref, amount) => ins.push(env.DB.prepare('INSERT OR IGNORE INTO button_log (user_id, kind, ref, amount, day, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(uid, kind, String(ref), amount, day, t));
  for (const u of users) {
    const ps = byUser.get(u.id) || [];
    const best = mergedBest(u, streakDays(ps)), badges = mergedBadges(u, ps).filter(b => b !== 'pick_past' || pickUser !== u.id);
    for (const [d, n] of Object.entries(BTN.levels)) if (best >= +d) add(u.id, 'badge', 'lv' + d, n);
    for (const k of badges) if (BTN.badges[k]) add(u.id, 'badge', k, BTN.badges[k]);
    for (const x of ps) { add(u.id, 'upload', x.day, BTN.upload); if (x.picked) add(u.id, 'pick', x.id, BTN.pick); }
  }
  for (let i = 0; i < ins.length; i += 80) await env.DB.batch(ins.slice(i, i + 80));
  await env.DB.prepare('UPDATE users SET buttons = MAX(0, (SELECT COALESCE(SUM(amount), 0) FROM button_log b WHERE b.user_id = users.id))').run();
  await setMeta(env, 'buttons_backfill', String(t));
  return { users: users.length, records: ins.length };
}
// что уже получено сегодня — для списка условий в профиле
async function buttonStatus(env, u) {
  const day = rigaDay();
  const rows = (await env.DB.prepare('SELECT kind, COUNT(*) AS n FROM button_log WHERE user_id = ? AND day = ? GROUP BY kind').bind(u.id, day).all()).results;
  const got = Object.fromEntries(rows.map(r => [r.kind, r.n]));
  const invited = (await env.DB.prepare('SELECT COUNT(*) AS n FROM users WHERE referrer = ?').bind(u.id).first()).n;
  return { buttons: u.buttons || 0, daily: !!got.daily, upload: !!got.upload, comments: got.comment || 0, invited, rules: BTN };
}
const randomHex = n => [...crypto.getRandomValues(new Uint8Array(n))].map(b => b.toString(16).padStart(2, '0')).join('');
async function sha256(s) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// ---------- посетители (своя статистика вместо непонятной Cloudflare) ----------
// страница сама шлёт POST /api/hit {p: путь, r: откуда пришли, u: utm-метки, w: ширина экрана, t: сенсорный экран}; без cookie, IP не сохраняем
const BOT_RE = /bot|crawl|spider|slurp|headless|lighthouse|preview|externalhit|python|curl|wget|httpclient|monitor|scan/i;
const SOURCES = [ // [название, регулярка по адресу сайта-источника или utm_source]
  ['Google', /(^|\.)google\./], ['Bing', /(^|\.)bing\.com$/], ['Yandex', /(^|\.)ya(ndex)?\.(ru|com|lv|by|kz)$/], ['DuckDuckGo', /duckduckgo/], ['Другие поисковики', /ecosia|yahoo|qwant|brave\.com|startpage|search\./],
  ['Instagram', /instagram|^ig$/], ['Facebook', /facebook|^fb$|fb\.me/], ['Pinterest', /pinterest|pin\.it/], ['TikTok', /tiktok/], ['Threads', /threads\.(net|com)/],
  ['LinkedIn', /linkedin|lnkd\.in/], ['Telegram', /telegram|^t\.me$/], ['YouTube', /youtube|youtu\.be/], ['Patreon', /patreon/], ['X (Twitter)', /^(x\.com|t\.co|twitter\.com)$/],
  ['VK', /(^|\.)vk\.(com|ru)$/], ['Reddit', /reddit/], ['ChatGPT и др. ИИ', /chatgpt|openai|perplexity|claude\.ai|gemini\.google|copilot/], ['Почта', /mail\.|outlook|gmail/],
];
const sourceOf = host => (SOURCES.find(([, re]) => re.test(host)) || ['Другие сайты'])[0];
const utmSource = us => { const s = sourceOf(us); return s === 'Другие сайты' ? us : s; };
function uaInfo(ua, w, touch) {
  const os = /iPhone|iPod/.test(ua) ? 'iPhone (iOS)' : /iPad/.test(ua) || (/Macintosh/.test(ua) && touch) ? 'iPad' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows'
    : /CrOS/.test(ua) ? 'ChromeOS' : /Macintosh|Mac OS X/.test(ua) ? 'Mac' : /Linux/.test(ua) ? 'Linux' : 'Другое';
  const tablet = os === 'iPad' || (/Android/.test(ua) && !/Mobile/.test(ua)) || /Tablet/.test(ua);
  const device = tablet ? 'Планшет' : /Mobi|iPhone|Android/.test(ua) || (touch && w && w < 800) ? 'Телефон' : 'Компьютер';
  const browser = /Instagram/.test(ua) ? 'Instagram (внутри приложения)' : /FBAN|FBAV|FB_IAB/.test(ua) ? 'Facebook (внутри приложения)' : /Pinterest/i.test(ua) ? 'Pinterest (внутри приложения)'
    : /musical_ly|BytedanceWebview|TikTok/i.test(ua) ? 'TikTok (внутри приложения)' : /Telegram/i.test(ua) ? 'Telegram (внутри приложения)' : /LinkedInApp/.test(ua) ? 'LinkedIn (внутри приложения)'
    : /Edg\//.test(ua) ? 'Edge' : /OPR\/|Opera/.test(ua) ? 'Opera' : /SamsungBrowser/.test(ua) ? 'Samsung Internet' : /YaBrowser/.test(ua) ? 'Яндекс Браузер'
    : /Firefox|FxiOS/.test(ua) ? 'Firefox' : /Chrome|CriOS/.test(ua) ? 'Chrome' : /Safari/.test(ua) ? 'Safari' : 'Другой';
  return { os, device, browser };
}
async function hit(req, env) {
  const ok = new Response(null, { status: 204 });
  const ua = req.headers.get('user-agent') || '';
  if (!ua || BOT_RE.test(ua)) return ok;
  let b; try { b = JSON.parse(await req.text()); } catch (e) { return ok; }
  const path = String(b.p || '/').slice(0, 200).split(/[?#]/)[0];
  if (/^\/(admin|blog-editor)\b/.test(path)) return ok;
  const u = await currentUser(req, env).catch(() => null);
  if (u && await isAdmin(u, env)) return ok; // свои заходы Алины не считаем
  const site = new URL(req.url).hostname.replace(/^www\./, '');
  let ref = ''; try { ref = b.r ? new URL(String(b.r)).hostname.replace(/^www\./, '').toLowerCase() : ''; } catch (e) { /* не адрес */ }
  if (ref === site || ref === 'pigeonpolly.com' || ref === 'localhost') ref = 'self';
  const utm = b.u && typeof b.u === 'object' ? b.u : {};
  const us = String(utm.source || '').toLowerCase().slice(0, 60), campaign = String(utm.campaign || '').slice(0, 80) || null;
  const info = uaInfo(ua, Number(b.w) || 0, !!b.t);
  // откуда пришёл: utm-метка → сайт-источник → приложение (Instagram и Facebook часто прячут адрес) → «напрямую»
  let src = null, entry = 0;
  if (us) { src = utmSource(us); entry = 1; }
  else if (ref && ref !== 'self') { src = sourceOf(ref); entry = 1; }
  else if (ref !== 'self') { const app = info.browser.match(/^(Instagram|Facebook|Pinterest|TikTok|Telegram|LinkedIn) \(/); src = app ? app[1] : 'Напрямую'; entry = 1; }
  let salt = await getMeta(env, 'visit_salt');
  if (!salt) { salt = randomHex(16); await setMeta(env, 'visit_salt', salt); }
  const day = rigaDay();
  const vid = (await sha256(salt + day + (req.headers.get('cf-connecting-ip') || '') + ua)).slice(0, 16);
  const lang = /^\/ru(\/|$)/.test(path) ? 'RU' : /^\/lv(\/|$)/.test(path) ? 'LV' : 'EN';
  await env.DB.prepare('INSERT INTO visits (day, ts, vid, entry, path, lang, src, ref, campaign, device, os, browser, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(day, now(), vid, entry, path, lang, src, ref && ref !== 'self' ? ref.slice(0, 80) : null, campaign, info.device, info.os, info.browser, (req.cf && req.cf.country) || null).run();
  return ok;
}
async function visitStats(env, days) {
  const dayAgo = n => new Date(Date.now() - n * 86400000).toLocaleDateString('sv-SE', { timeZone: 'Europe/Riga' });
  const from = dayAgo(days - 1), prevFrom = dayAgo(2 * days - 1);
  const q = async (sql, ...a) => (await env.DB.prepare(sql).bind(...a).all()).results;
  // люди = уникальные за каждые сутки (один человек за день считается один раз)
  const people = async (where, ...a) => q(`SELECT COUNT(DISTINCT day || vid) AS n FROM visits WHERE ${where}`, ...a).then(r => r[0].n);
  const totals = async (a, b) => ({
    people: await people('day >= ? AND day <= ?', a, b),
    views: (await q('SELECT COUNT(*) AS n FROM visits WHERE day >= ? AND day <= ?', a, b))[0].n,
    visits: (await q('SELECT COUNT(*) AS n FROM visits WHERE entry = 1 AND day >= ? AND day <= ?', a, b))[0].n,
  });
  const today = dayAgo(0);
  // разбивки: по людям (уникальным за сутки), а «откуда» — по визитам (каждый заход с другого сайта/приложения)
  const by = col => q(`SELECT ${col} AS k, COUNT(DISTINCT day || vid) AS n FROM visits WHERE day >= ? AND ${col} IS NOT NULL GROUP BY ${col} ORDER BY n DESC LIMIT 30`, from);
  const series = await q('SELECT day, COUNT(DISTINCT vid) AS people, COUNT(*) AS views FROM visits WHERE day >= ? GROUP BY day ORDER BY day', from);
  return {
    days, from, to: today, first: (await q('SELECT MIN(day) AS d FROM visits'))[0].d,
    now: { ...(await totals(from, today)), mobile: (await q("SELECT COUNT(DISTINCT day || vid) AS n FROM visits WHERE day >= ? AND device = 'Телефон'", from))[0].n },
    prev: await totals(prevFrom, dayAgo(days)),
    online: (await q('SELECT COUNT(DISTINCT vid) AS n FROM visits WHERE ts > ?', now() - 300))[0].n,
    series,
    sources: await q('SELECT src AS k, COUNT(*) AS n FROM visits WHERE entry = 1 AND day >= ? GROUP BY src ORDER BY n DESC', from),
    sourceDevices: await q('SELECT src AS k, device AS d, COUNT(*) AS n FROM visits WHERE entry = 1 AND day >= ? GROUP BY src, device', from),
    refs: await q('SELECT ref AS k, COUNT(*) AS n FROM visits WHERE entry = 1 AND ref IS NOT NULL AND day >= ? GROUP BY ref ORDER BY n DESC LIMIT 30', from),
    campaigns: await q('SELECT campaign AS k, src AS s, COUNT(*) AS n FROM visits WHERE entry = 1 AND campaign IS NOT NULL AND day >= ? GROUP BY campaign, src ORDER BY n DESC LIMIT 30', from),
    // сохранённые ссылки: заходы и люди всего и за выбранный период (заход засчитывается по utm_campaign + utm_source)
    links: await Promise.all((await q('SELECT * FROM utm_links ORDER BY id DESC')).map(async l => {
      const c = (await q("SELECT COUNT(*) AS n, COUNT(DISTINCT day || vid) AS p, SUM(day >= ?) AS np, COUNT(DISTINCT CASE WHEN day >= ? THEN day || vid END) AS pp FROM visits WHERE entry = 1 AND campaign = ? AND src = ?", from, from, l.campaign, utmSource(l.source)))[0];
      return { ...l, all: c.n || 0, people: c.p || 0, period: c.np || 0, periodPeople: c.pp || 0 };
    })),
    landing: await q('SELECT path AS k, COUNT(*) AS n FROM visits WHERE entry = 1 AND day >= ? GROUP BY path ORDER BY n DESC LIMIT 20', from),
    pages: await q('SELECT path AS k, COUNT(*) AS n, COUNT(DISTINCT day || vid) AS p FROM visits WHERE day >= ? GROUP BY path ORDER BY n DESC LIMIT 40', from),
    devices: await by('device'), os: await by('os'), browsers: await by('browser'), countries: await by('country'), langs: await by('lang'),
  };
}

// ---------- сессия ----------
function cookie(req, name) {
  const m = (req.headers.get('cookie') || '').match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return m ? m[1] : null;
}
const sessionCookie = (token, maxAge) => `pp_s=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
async function currentUser(req, env) {
  const token = cookie(req, 'pp_s');
  if (!token || !/^[0-9a-f]{64}$/.test(token)) return null;
  const u = await env.DB.prepare(`SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ? AND s.expires > ?`)
    .bind(token, now()).first();
  // «был недавно» для стаи на главной: обновляем не чаще раза в 10 минут
  if (u && (u.last_seen || 0) < now() - 600) await env.DB.prepare('UPDATE users SET last_seen = ? WHERE id = ?').bind(now(), u.id).run();
  return u;
}
async function needUser(req, env) {
  const u = await currentUser(req, env);
  if (!u) fail(401, 'login');
  if (u.banned) fail(403, 'banned');
  return u;
}
const isAdmin = async (u, env) => !!u && ((env.DEV_FAKE_LOGIN === '1' && u.sub === 'dev:admin') || (!!u.email && ADMIN_HASHES.includes(await sha256(u.email.toLowerCase()))));

// ---------- Google ID token ----------
let jwks = null, jwksAt = 0;
const b64url = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), c => c.charCodeAt(0));
async function verifyGoogle(token, env) {
  const [h, p, s] = String(token).split('.');
  if (!h || !p || !s) fail(400, 'token');
  const header = JSON.parse(new TextDecoder().decode(b64url(h)));
  const payload = JSON.parse(new TextDecoder().decode(b64url(p)));
  if (!jwks || Date.now() - jwksAt > 3600e3) {
    jwks = (await (await fetch('https://www.googleapis.com/oauth2/v3/certs')).json()).keys; jwksAt = Date.now();
  }
  const jwk = jwks.find(k => k.kid === header.kid);
  if (!jwk) fail(400, 'token');
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64url(s), new TextEncoder().encode(h + '.' + p));
  if (!ok || payload.aud !== env.GOOGLE_CLIENT_ID || !['accounts.google.com', 'https://accounts.google.com'].includes(payload.iss)
    || payload.exp < now() || !payload.sub) fail(400, 'token');
  return { sub: 'g:' + payload.sub, email: payload.email_verified ? payload.email : null };
}

// ---------- серии ----------
const dayNum = d => Math.round(Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10)) / 864e5);
const utcToday = () => Math.floor(Date.now() / 864e5);
function streaks(days) {
  const n = [...new Set(days.map(dayNum))].sort((a, b) => b - a);
  let best = 0, run = 0;
  for (let i = 0; i < n.length; i++) { run = i && bridged(n[i - 1], n[i]) ? run + 1 : 1; best = Math.max(best, run); }
  let current = 0;
  if (n.length && bridged(utcToday(), n[0])) { current = 1; while (current < n.length && bridged(n[current - 1], n[current])) current++; }
  return { current, best };
}

// день ЭКСТРА — та же формула, что в site/assets/challenge-theme.js
function rngFor(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
  let a = h >>> 0;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let x = Math.imul(a ^ a >>> 15, 1 | a); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; };
}
// день ЭКСТРА = день свободы: своя тема или свой референс; если ничего не загрузить, серия не сгорает.
// До сентября 2026 включительно — старая формула; октябрь 2026 — 12-е; дальше — случайный день не ближе 20 дней к прошлому.
const extraMemo = {};
function extraDay(y, m) {
  const key = y * 12 + m; if (extraMemo[key]) return extraMemo[key];
  const days = new Date(y, m + 1, 0).getDate(), rm = rngFor('extra-' + y + '-' + m);
  let v = 1 + Math.floor(rm() * days);
  if (key === 2026 * 12 + 9) v = 12;
  else if (key > 2026 * 12 + 9) {
    const py = m ? y : y - 1, pm = m ? m - 1 : 11, prev = extraDay(py, pm), pdays = new Date(py, pm + 1, 0).getDate();
    const lo = Math.max(1, 20 - (pdays - prev));
    v = lo + Math.floor(rm() * (days - lo + 1));
  }
  return (extraMemo[key] = v);
}
// день свободы по номеру дня (dayNum): если в этот день ничего не загружено, серия не прерывается
const isExtraNum = n => { const d = new Date(n * 864e5); return d.getUTCDate() === extraDay(d.getUTCFullYear(), d.getUTCMonth()); };
const bridged = (a, b) => { for (let x = b + 1; x < a; x++) if (!isExtraNum(x)) return false; return true; }; // между днями b < a только дни свободы
function badgesOf(posts, months = []) {
  const got = new Set();
  for (const p of posts) {
    const y = +p.day.slice(0, 4), m = +p.day.slice(5, 7) - 1, d = +p.day.slice(8, 10);
    if (p.bw) got.add('bw');
    if (p.ai === 1) got.add('robot'); // 1 — пометил сам автор (2 — пометила Алина, бейджа за это нет)
    if (m === 0 && d === 23) got.add('bday');
    if (d === extraDay(y, m) || (y === 2026 && m === 9 && d === 2)) got.add('extra'); // 2.10.2026 — день ЭКСТРА до переноса на 12-е
  }
  const sorted = [...posts].sort((a, b) => a.day < b.day ? -1 : 1);
  // «Через денёк»: 15 загрузок подряд, каждая ровно через день (≈ месяц)
  const n = [...new Set(sorted.map(p => dayNum(p.day)))];
  for (let i = 1, run = 1; i < n.length; i++) { run = n[i] - n[i - 1] === 2 ? run + 1 : 1; if (run >= RULES.cond.alt) { got.add('alt'); break; } }
  // «Как по часам»: 10 загрузок подряд в пределах одного часа (по кругу суток)
  const tods = sorted.map(p => p.tod);
  const CL = RULES.cond.clock;
  for (let i = 0; i + CL <= tods.length; i++) {
    const w = tods.slice(i, i + CL);
    if (w.some(t => t == null)) continue;
    const s = [...w].sort((a, b) => a - b);
    let gap = s[0] + 1440 - s[s.length - 1];
    for (let j = 1; j < s.length; j++) gap = Math.max(gap, s[j] - s[j - 1]);
    if (1440 - gap <= RULES.cond.clockWin) { got.add('clock'); break; }
  }
  // «Каждый месяц»: работы в 3 календарных месяцах подряд
  const ms = [...new Set([...months, ...posts.map(p => p.day.slice(0, 7))])].map(k => +k.slice(0, 4) * 12 + +k.slice(5, 7) - 1).sort((a, b) => a - b);
  for (let i = 1, run = 1; i < ms.length; i++) { run = ms[i] - ms[i - 1] === 1 ? run + 1 : 1; if (run >= RULES.cond.monthly) { got.add('monthly'); break; } }
  return got;
}
// рекорд и бейджи пользователя: из его работ + сохранённое после прошлых очисток
const mergedBest = (u, days) => Math.max(u.best || 0, streaks(days).best);
const monthsOf = u => String(u.months || '').split(',').filter(Boolean);
// работ по месяцам: "2026-10:3,2026-11:2" — хранится в профиле, очистка картинок её не трогает
const VETERAN_MONTHS = 36, VETERAN_PER_MONTH = 2;
const mcountOf = u => Object.fromEntries(String(u.mcount || '').split(',').filter(Boolean).map(x => { const [k, n] = x.split(':'); return [k, +n || 0]; }));
function isVeteran(u) {
  const mc = mcountOf(u);
  const ok = Object.keys(mc).filter(k => mc[k] >= RULES.cond.veteranPer).map(k => +k.slice(0, 4) * 12 + +k.slice(5, 7) - 1).sort((a, b) => a - b);
  for (let i = 1, run = ok.length ? 1 : 0; i <= ok.length; i++) { if (run >= RULES.cond.veteranMonths) return true; run = ok[i] - ok[i - 1] === 1 ? run + 1 : 1; }
  return false;
}
// ещё 10 особых бейджей (октябрь 2026): время рисования, количество работ, праздники, выходные, возвращение
function moreBadges(u, posts) {
  const got = new Set();
  const tods = posts.map(p => p.tod).filter(t => t != null);
  const C = RULES.cond, night = t => C.owlFrom > C.owlTo ? (t >= C.owlFrom * 60 || t < C.owlTo * 60) : (t >= C.owlFrom * 60 && t < C.owlTo * 60);
  if (tods.filter(t => t < C.earlyBefore * 60).length >= C.early) got.add('early');   // 5 рисунков до 8 утра
  if (tods.filter(night).length >= C.owl) got.add('owl');                            // 5 рисунков с 23:00 до 4:00
  const total = Math.max(posts.length, Object.values(mcountOf(u)).reduce((a, b) => a + b, 0));
  if (total >= C.ten) got.add('ten'); if (total >= C.fifty) got.add('fifty'); if (total >= C.hundred) got.add('hundred');
  if (posts.filter(p => p.bw).length >= C.inkmaster) got.add('inkmaster');               // 10 рисунков в Ч/Б
  const days = new Set(posts.map(p => p.day)), nums = [...new Set(posts.map(p => dayNum(p.day)))].sort((a, b) => a - b);
  for (let i = 1; i < nums.length; i++) if (nums[i] - nums[i - 1] >= C.comeback) { got.add('comeback'); break; } // вернулся после месяца перерыва
  let weekends = 0;
  for (const d of days) { const dt = new Date(d + 'T12:00:00Z'); if (dt.getUTCDay() === 6) { dt.setUTCDate(dt.getUTCDate() + 1); if (days.has(dt.toISOString().slice(0, 10))) weekends++; } }
  if (weekends >= C.weekend) got.add('weekend');                                         // суббота и воскресенье — 4 выходных
  for (const d of days) { const md = d.slice(5); if (md === '12-31' || md === '01-01') got.add('newyear'); if (md === '10-31') got.add('halloween'); }
  // за цвета: N рисунков в дни, когда в теме дня был фиолетовый / жёлтый / красный / синий / зелёный
  if (DAYCOL) for (const [f, k] of [['p', 'cpurple'], ['y', 'cyellow'], ['r', 'cred'], ['b', 'cblue'], ['g', 'cgreen']]) if ([...days].filter(d => (DAYCOL[d] || '').includes(f)).length >= C.colors) got.add(k);
  return got;
}
const mergedBadges = (u, posts) => [...new Set([...String(u.badges || '').split(',').filter(Boolean), ...badgesOf(posts, monthsOf(u)), ...moreBadges(u, posts), ...(isVeteran(u) ? ['veteran'] : [])])];

// ---------- картинки работ: R2 (новые и перенесённые) или KV (старые, пока не перенесены) ----------
const r2Key = (kind, id) => `challenge/${kind}/${id}.jpg`; // kind: i — полная, t — превью
const R2_LIMIT = 10e9; // бесплатные 10 ГБ R2
async function imgPut(env, id, fb, tb) {
  if (env.MEDIA) {
    const meta = { httpMetadata: { contentType: 'image/jpeg', cacheControl: 'public, max-age=31536000, immutable' } };
    await Promise.all([env.MEDIA.put(r2Key('i', id), fb, meta), env.MEDIA.put(r2Key('t', id), tb, meta)]);
    return { store: 'r2', kv: 0 };
  }
  await env.IMAGES.put('i/' + id, fb, { metadata: { type: 'image/jpeg' } });
  await env.IMAGES.put('t/' + id, tb, { metadata: { type: 'image/jpeg' } });
  return { store: null, kv: 1 };
}
async function imgGet(env, kind, id) {
  if (env.MEDIA) { const o = await env.MEDIA.get(r2Key(kind, id)); if (o) return o.arrayBuffer(); }
  return env.IMAGES.get(kind + '/' + id, 'arrayBuffer'); // ещё не перенесена — из KV
}
// удалить картинки работы отовсюду, где они лежат; возвращает число удалений в KV (их бесплатно 1000 в сутки)
async function imgDelete(env, post) {
  const jobs = [];
  if (post.store === 'r2' && env.MEDIA) jobs.push(env.MEDIA.delete([r2Key('i', post.id), r2Key('t', post.id)]));
  if (post.kv !== 0) jobs.push(env.IMAGES.delete('i/' + post.id), env.IMAGES.delete('t/' + post.id));
  await Promise.all(jobs);
  return post.kv !== 0 ? 2 : 0;
}
// перенос старых работ из KV в R2 порциями: копируем, сверяем размер, отмечаем store = 'r2'. Копия в KV остаётся.
async function migrateToR2(env, batch = 100) {
  if (!env.MEDIA) return { moved: 0 };
  const rows = (await env.DB.prepare("SELECT id FROM posts WHERE store IS NULL ORDER BY created_at LIMIT ?").bind(batch).all()).results;
  let moved = 0, missing = 0, failed = 0;
  for (const { id } of rows) {
    try {
      const [a, b] = await Promise.all([env.IMAGES.get('i/' + id, 'arrayBuffer'), env.IMAGES.get('t/' + id, 'arrayBuffer')]);
      if (!a || !b) { missing++; await env.DB.prepare("UPDATE posts SET store = 'missing' WHERE id = ?").bind(id).run(); continue; } // в KV нет — нечего переносить
      const meta = { httpMetadata: { contentType: 'image/jpeg', cacheControl: 'public, max-age=31536000, immutable' } };
      const [x, y] = await Promise.all([env.MEDIA.put(r2Key('i', id), a, meta), env.MEDIA.put(r2Key('t', id), b, meta)]);
      if (!x || !y || x.size !== a.byteLength || y.size !== b.byteLength) { failed++; continue; } // не совпало — попробуем в следующий раз
      await env.DB.prepare("UPDATE posts SET store = 'r2' WHERE id = ?").bind(id).run();
      moved++;
    } catch (e) { failed++; }
  }
  return { moved, missing, failed };
}
async function migrationStatus(env) {
  const r = await env.DB.prepare("SELECT COUNT(*) AS total, SUM(CASE WHEN store = 'r2' THEN 1 ELSE 0 END) AS r2, SUM(CASE WHEN store = 'missing' THEN 1 ELSE 0 END) AS missing, SUM(CASE WHEN kv = 1 THEN 1 ELSE 0 END) AS kv FROM posts").first();
  return { total: r.total || 0, r2: r.r2 || 0, missing: r.missing || 0, kv: r.kv || 0 };
}
// занятость хранилища: KV (1 ГБ) — то, что ещё лежит в KV; R2 (10 ГБ) — перенесённое и новое; считаем по более заполненному
async function storageUsed(env) {
  const r = await env.DB.prepare("SELECT COALESCE(SUM(CASE WHEN kv = 1 THEN bytes ELSE 0 END), 0) AS kv, COALESCE(SUM(CASE WHEN store = 'r2' THEN bytes ELSE 0 END), 0) AS r2 FROM posts").first();
  return Math.max(r.kv / KV_LIMIT, r.r2 / R2_LIMIT);
}

// Очистка (решение Алины): удаляем, только когда картинки заняли ≥85% бесплатного KV (1 ГБ).
// Тогда удаляем работы тех, кто больше 3 месяцев ничего не загружал И не заходил на сайт, начиная с самых давно пропавших, пока не станет <80%.
const KV_LIMIT = 1e9, CLEAN_START = 0.85, CLEAN_STOP = 0.8;
async function cleanupInactive(env, limit = KV_LIMIT) {
  // вес работ, загруженных до появления учёта, считаем один раз
  const unknown = (await env.DB.prepare('SELECT id FROM posts WHERE bytes IS NULL LIMIT 200').all()).results;
  for (const p of unknown) {
    const [a, b] = await Promise.all([imgGet(env, 'i', p.id), imgGet(env, 't', p.id)]);
    await env.DB.prepare('UPDATE posts SET bytes = ? WHERE id = ?').bind((a?.byteLength || 0) + (b?.byteLength || 0), p.id).run();
  }
  // занято: в KV (лимит limit) и в R2 (в 10 раз больше); решает более заполненное
  const r = await env.DB.prepare("SELECT COALESCE(SUM(CASE WHEN kv = 1 THEN bytes ELSE 0 END), 0) AS kv, COALESCE(SUM(CASE WHEN store = 'r2' THEN bytes ELSE 0 END), 0) AS r2 FROM posts").first();
  let kvUsed = r.kv, r2Used = r.r2;
  const frac = () => Math.max(kvUsed / limit, r2Used / (limit * R2_LIMIT / KV_LIMIT));
  const report = { kv: kvUsed, r2: r2Used, limit, percent: Math.round(frac() * 1000) / 10, users: 0, deletes: 0 };
  if (frac() < CLEAN_START) return report;
  const cutoff = new Date((utcToday() - INACTIVE_DAYS) * 864e5).toISOString().slice(0, 10);
  const users = (await env.DB.prepare(`SELECT u.*, MAX(p.day) AS last FROM users u JOIN posts p ON p.user_id = u.id
    WHERE COALESCE(u.last_seen, 0) < ? GROUP BY u.id HAVING last < ? ORDER BY last ASC LIMIT 200`).bind(now() - INACTIVE_DAYS * 86400, cutoff).all()).results;
  for (const u of users) {
    if (frac() < CLEAN_STOP) break;
    if (await isAdmin(u, env)) continue; // работы Алины не удаляются, пока она сама их не удалит
    const posts = (await env.DB.prepare('SELECT id, day, bw, ai, tod, bytes, store, kv FROM posts WHERE user_id = ?').bind(u.id).all()).results;
    if (report.deletes + posts.filter(x => x.kv !== 0).length * 2 > 900) break; // бесплатный лимит KV — 1000 удалений в сутки
    await env.DB.prepare('UPDATE users SET best = ?, badges = ? WHERE id = ?')
      .bind(mergedBest(u, streakDays(posts)), mergedBadges(u, posts).join(','), u.id).run();
    for (const p of posts) { report.deletes += await imgDelete(env, p); if (p.kv !== 0) kvUsed -= p.bytes || 0; if (p.store === 'r2') r2Used -= p.bytes || 0; }
    await env.DB.prepare('DELETE FROM posts WHERE user_id = ?').bind(u.id).run();
    report.users++;
  }
  report.percentAfter = Math.round(frac() * 1000) / 10;
  return report;
}

// «Выбор Полли»: один текущий рисунок, его автор — носитель бейджа; прошлые носители получают 'pick_past'
const getMeta = async (env, k) => (await env.DB.prepare('SELECT value FROM meta WHERE key = ?').bind(k).first())?.value ?? null;
const setMeta = (env, k, v) => env.DB.prepare('INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').bind(k, v).run();
// счётчики «с момента создания сайта»: только растут (удаления их не уменьшают)
async function bump(env, key, countSql) {
  const cur = await getMeta(env, key);
  const base = cur === null ? (await env.DB.prepare(countSql).first()).n - 1 : Number(cur);
  await setMeta(env, key, String(base + 1));
}
// «ставка» для наград игр: средняя цена обычной вещи в продаже (без легендарных и игровых), фиксируется на сутки (meta 'unit');
// btnOf(pct) — сколько пуговок это pct % от неё (минимум 1, если pct > 0). Сбрасывается, когда Алина меняет цены в магазине
let UNIT = null;
async function gameUnit(env, force = false) {
  const day = rigaDay();
  if (!force && UNIT && UNIT.day === day) return UNIT;
  // теперь «ставка» постоянная (опорная цена — средняя цена в день, когда награды игр появились): награды стабильные, а цены сами подстраиваются под заработки
  const ref = Number(await getMeta(env, 'index_base')) || (parseJ(await getMeta(env, 'unit'), null) || {}).avg || 50;
  UNIT = { day, avg: ref };
  return UNIT;
}
const btnOf = (pct, unit) => pct > 0 ? Math.max(1, Math.round(pct * unit.avg / 100)) : 0;
// цены наград игр сейчас (для страниц игр и кабинета)
const gamePrices = unit => ({ avg: unit.avg, level: btnOf(RULES.gameLevelPct, unit), record: btnOf(RULES.gameRecordPct, unit), king: btnOf(RULES.gameKingPct, unit), max: btnOf(RULES.gameDayMaxPct, unit),
  p1: btnOf(RULES.potion1Pct, unit), p2: btnOf(RULES.potion2Pct, unit), p3: btnOf(RULES.potion3Pct, unit), again: btnOf(RULES.potionAgainPct, unit), pmax: btnOf(RULES.potionDayMaxPct, unit) });
// «🤖 Автопилот» в кабинете: что работает само и всё ли в порядке (ok: true — зелёное, false — нужно внимание, null — выключено)
async function autopilot(env, req) {
  const out = [], day = rigaDay(), y = new Date(Date.now() - 86400000).toLocaleDateString('sv-SE', { timeZone: 'Europe/Riga' });
  const cron = Number(await getMeta(env, 'cron_at')) || 0, mins = cron ? Math.round((Date.now() - cron) / 60000) : null;
  out.push({ ok: mins != null && mins < 180, t: 'Расписание (раз в час)', d: mins == null ? 'ещё не запускалось — на сайте это должно случиться в течение часа после выкладки' : mins < 180 ? `последний запуск ${mins} мин назад` : `не запускалось ${Math.round(mins / 60)} ч — напишите Claude` });
  const rl = parseJ(await getMeta(env, 'restock_last'), null);
  out.push(!RULES.restockOn ? { ok: null, t: 'Пополнение магазина', d: 'выключено в правилах' } : { ok: !!rl && (rl.day === day || rl.day === y) || mins == null, t: 'Пополнение магазина каждую ночь', d: rl ? `последний раз ${rl.day}: закончившиеся вещи (${rl.items}) — по ${rl.to} шт.` : 'ещё не было' });
  const cat = await catalog(env, req), leg = new Set(cat.legend || []), all = Object.entries(cat.items || {}).flatMap(([k, vs]) => vs.map(v => k + '|' + v)).filter(x => !leg.has(x));
  const inStock = new Set((await env.DB.prepare('SELECT kind, item FROM shop WHERE stock > 0').all()).results.map(r => r.kind + '|' + r.item)), on = all.filter(x => inStock.has(x)).length;
  out.push({ ok: !all.length || on >= all.length * 0.5, t: 'Вещи в магазине', d: `в продаже ${on} из ${all.length} обычных вещей` + (all.length && on < all.length * 0.5 ? ' — пополнение должно это исправить за ночь' : '') });
  const unit = await gameUnit(env), eco = await env.DB.prepare('SELECT COALESCE(SUM(COALESCE(buttons, 0)), 0) AS total, COUNT(*) AS birds FROM users WHERE nick IS NOT NULL AND banned = 0').first();
  out.push({ ok: true, t: 'Цены', d: `меняются сами от остатка; «мало / много» — от числа птичек (${STOCK.birds}); вы меняете только % категорий и цены легендарных (раздел «Магазин»)` });
  const pl = parseJ(await getMeta(env, 'price_level'), null) || PLEVEL;
  out.push({ ok: true, t: 'Уровень цен', d: `подстраивается сам под заработки птичек: ×${pl.L || 1}` + (pl.active >= 3 ? ` (активная птичка зарабатывает ~${pl.income} 🔘 в день — средняя вещь стоит ~${RULES.priceDays} дня)` : ' (пока мало данных — цены не трогаем)') });
  const avgBal = eco.birds ? Math.round(eco.total / eco.birds) : 0;
  out.push({ ok: true, t: 'Кошельки птичек', d: `в среднем ${avgBal} 🔘 — хватит примерно на ${(pl.avg || unit.avg) ? String(Math.round(avgBal / (pl.avg || unit.avg) * 10) / 10).replace('.', ',') : 0} средней вещи` });
  const sn = { autumn: 'осень · Хеллоуин', winter: 'зима · Новый год', spring: 'весна', summer: 'лето' }[seasonNow()];
  out.push({ ok: true, t: 'Сезон зельеварни', d: sn + (RULES.potionSeason === 'auto' ? ' (по календарю)' : ' — выбран вручную') });
  return out;
}
// вещь за 30 уровней «Пуговичного дождя»: из того, что есть в магазине (остаток −1), которой у птички нет, не легендарная;
// если в магазине такого нет — любая такая вещь из каталога. Приходит неоткрытым подарком
async function rainItem(env, req, uid, lv) {
  const cat = await catalog(env, req), leg = new Set(cat.legend || []);
  const have = new Set((await env.DB.prepare("SELECT kind, item FROM gifts WHERE user_id = ? AND status IN ('bag', 'new')").bind(uid).all()).results.map(r => r.kind + '|' + r.item));
  const ok = (k, v) => !gameOnly(k, v) && k !== 'any' && v !== '?' && v !== 'legend' && !leg.has(k + '|' + v) && !LEGEND.has(k + '|' + v) && !have.has(k + '|' + v);
  const inShop = (await env.DB.prepare('SELECT kind, item FROM shop WHERE stock > 0').all()).results.filter(r => ok(r.kind, r.item));
  let pick = inShop.length ? inShop[Math.floor(Math.random() * inShop.length)] : null;
  if (pick) await env.DB.prepare('UPDATE shop SET stock = MAX(0, stock - 1) WHERE kind = ? AND item = ?').bind(pick.kind, pick.item).run();
  else { const all = Object.entries(cat.items || {}).flatMap(([k, vs]) => vs.map(v => ({ kind: k, item: v }))).filter(x => ok(x.kind, x.item)); pick = all.length ? all[Math.floor(Math.random() * all.length)] : null; }
  if (!pick) return null;
  await env.DB.prepare('INSERT INTO gifts (user_id, kind, item, note, created_at) VALUES (?, ?, ?, ?, ?)').bind(uid, pick.kind, pick.item, 'rain:' + lv, now()).run();
  return { kind: pick.kind, item: pick.item };
}
// тема не на английском → английский перевод (для карточек и подписи под рисунком); язык угадываем по буквам
const guessLang = t => /[а-яё]/i.test(t) ? 'ru' : /[āčēģīķļņšūž]/i.test(t) ? 'lv' : 'en';
async function reqEnglish(env, text) {
  const from = guessLang(text);
  if (from === 'en') return null;
  try { const r = await Promise.race([translateAll(env, [text], from, 'en'), new Promise(res => setTimeout(() => res(null), 5000))]); const e = r && String(r.texts[0] || '').trim(); return e && e !== text ? e.slice(0, 200) : null; } catch (e) { return null; }
}
// подарок за нарисованную тему: вещь, которой у птички нет (не легендарная, не игровая), из самой дешёвой трети каталога;
// раз в 20–30 нарисованных тем этой птички (users.req_mid) — из средней трети. Приходит неоткрытым подарком с note 'req:<id>'
async function reqReward(env, req, uid, rid) {
  const u = await env.DB.prepare('SELECT req_n, req_mid FROM users WHERE id = ? AND banned = 0').bind(uid).first();
  if (!u) return null;
  const n = (u.req_n || 0) + 1, need = u.req_mid || (20 + Math.floor(Math.random() * 11)), mid = n >= need;
  const cat = await catalog(env, req), cp = cat.prices || {}, leg = new Set(cat.legend || []);
  const all = Object.entries(cat.items || {}).flatMap(([k, vs]) => vs.map(v => [k, v])).filter(([k, v]) => k !== 'any' && v !== '?' && v !== 'legend' && !leg.has(k + '|' + v) && !LEGEND.has(k + '|' + v) && !gameOnly(k, v) && cp[k + '|' + v] > 0);
  const vals = all.map(([k, v]) => cp[k + '|' + v]).sort((a, b) => a - b), t1 = vals[Math.floor(vals.length / 3)] || 0, t2 = vals[Math.floor(vals.length * 2 / 3)] || 0;
  const have = new Set((await env.DB.prepare("SELECT kind, item FROM gifts WHERE user_id = ? AND status IN ('bag', 'new')").bind(uid).all()).results.map(r => r.kind + '|' + r.item));
  const free = all.filter(([k, v]) => !have.has(k + '|' + v)), price = ([k, v]) => cp[k + '|' + v];
  let pool = free.filter(x => mid ? price(x) > t1 && price(x) <= t2 : price(x) <= t1);
  if (!pool.length) pool = free.slice().sort((a, b) => price(a) - price(b)).slice(0, 30); // всё дешёвое уже есть — самое дешёвое из оставшегося
  await env.DB.prepare('UPDATE users SET req_n = ?, req_mid = ? WHERE id = ?').bind(mid ? 0 : n, mid ? 20 + Math.floor(Math.random() * 11) : need, uid).run();
  if (!pool.length) return null;
  const [kind, item] = pool[Math.floor(Math.random() * pool.length)];
  await env.DB.prepare('INSERT INTO gifts (user_id, kind, item, note, created_at) VALUES (?, ?, ?, ?, ?)').bind(uid, kind, item, 'req:' + rid, now()).run();
  return { kind, item, mid };
}
// бейдж за игру: один раз, пуговки — как за обычный бейдж (RULES.badges). true — только что получен
async function gameBadge(env, u, k) {
  if (String(u.badges || '').split(',').includes(k)) return false;
  await addBadge(env, u.id, k); u.badges = (u.badges ? u.badges + ',' : '') + k;
  await award(env, u.id, 'badge', k, BTN.badges[k] || 0);
  return true;
}
// ---------- «Зельеварня Полли» (/potions/, site/assets/potions.js) ----------
// ингредиенты (тот же список и порядок — в potions.js); sweet — «сладкие»: два в котле — «вкусное» зелье, три — «вкус детства»
const ING = ['amanita', 'pumpkin', 'web', 'bat', 'eye', 'mandrake', 'moon', 'feather', 'bone', 'candle', 'garlic', 'pepper', 'frog', 'clover', 'star', 'apple', 'candy', 'choco', 'milk', 'honey', 'cookie'];
// сезоны (по 21 ингредиенту, последние 6 — сладкие; порядок — как в site/assets/potion-names.js): лабиринт даёт ингредиенты текущего сезона, рецепт — только из одного сезона
const SEASON_ING = { autumn: ING,
  winter: ['snow', 'icicle', 'pine', 'mitten', 'bell', 'scarf', 'snowman', 'tea', 'salt', 'log', 'tree', 'ribbon', 'deer', 'owlw', 'comet', 'tangerine', 'cupcake', 'hotcoco', 'lolly', 'pie', 'cake'],
  spring: ['tulip', 'daisy', 'sakura', 'sprout', 'butterfly', 'ladybug', 'rainbow', 'drop', 'bee', 'snail', 'egg', 'nest', 'worm', 'kite', 'cloud', 'strawberry', 'cherry', 'pancake', 'waffle', 'pudding', 'croissant'],
  summer: ['sun', 'shell', 'wave', 'crab', 'palm', 'cactus', 'sunflower', 'fish', 'coral', 'sand', 'compass', 'strawhat', 'shades', 'spark', 'dolphin', 'watermelon', 'icecream', 'peach', 'lemonade', 'sherbet', 'pineapple'] };
const ALL_ING = Object.values(SEASON_ING).flat(), ING_SEASON = Object.fromEntries(Object.entries(SEASON_ING).flatMap(([s, l]) => l.map(x => [x, s])));
const SWEET = new Set(Object.values(SEASON_ING).flatMap(l => l.slice(15)));
// сезон по Риге: дек–фев зима, мар–май весна, июн–авг лето, сен–ноя осень (Хеллоуин); RULES.potionSeason — вручную
function seasonNow() {
  if (RULES.potionSeason && RULES.potionSeason !== 'auto') return RULES.potionSeason;
  const m = +rigaDay().slice(5, 7);
  return m === 12 || m <= 2 ? 'winter' : m <= 5 ? 'spring' : m <= 8 ? 'summer' : 'autumn';
}
const fnv = str => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
// все тройки ингредиентов (с повторами, по порядку ING) — номер тройки даёт зелью уникальное имя (у разных рецептов имена не совпадают)
// номер тройки внутри сезона (0…1770) — по нему клиент даёт зелью имя; у осени номера те же, что были до сезонов
const combosOf = L => { const out = []; for (let a = 0; a < L.length; a++) for (let b = a; b < L.length; b++) for (let c = b; c < L.length; c++) out.push([L[a], L[b], L[c]].join('+')); return out; };
const COMBO_IX = Object.fromEntries(Object.entries(SEASON_ING).map(([s, l]) => [s, new Map(combosOf(l).map((c, i) => [c, i]))]));
const comboSeason = combo => ING_SEASON[combo.split('+')[0]] || 'autumn';
// рецепт: сработает или нет — «судьба» тройки (одинаковая у всех птичек); уровень зелья — по числу сладких
function potionOf(combo) {
  const parts = combo.split('+'), sw = parts.filter(x => SWEET.has(x)).length, h = fnv('polly-cauldron|' + combo);
  const ok = h % 100 < (sw === 3 ? 80 : sw === 2 ? 75 : 70); // 11.10.2026: было 45–60 % — слишком часто «не получилось»
  const season = comboSeason(combo);
  return { tier: ok ? (sw === 3 ? 3 : sw === 2 ? 2 : 1) : 0, ix: COMBO_IX[season].get(combo), season };
}
const invOf = u => { const o = parseJ(u.inv, {}) || {}; for (const k of Object.keys(o)) if (!ING_SEASON[k] || !(o[k] > 0)) delete o[k]; return o; };
// что лежит в лабиринте уровня: 3…6 ингредиентов, сладкие попадаются реже
function mazeItems(level, season) {
  const n = Math.min(6, 3 + Math.floor(level / 4)), out = [], L = SEASON_ING[season] || ING;
  for (let i = 0; i < n; i++) {
    const sweet = Math.random() < 0.22, pool = L.filter(x => SWEET.has(x) === sweet);
    out.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return out;
}
async function addBadge(env, uid, badge) {
  const u = await env.DB.prepare('SELECT badges FROM users WHERE id = ?').bind(uid).first();
  if (!u) return;
  const set = new Set(String(u.badges || '').split(',').filter(Boolean)); set.add(badge);
  await env.DB.prepare('UPDATE users SET badges = ? WHERE id = ?').bind([...set].join(','), uid).run();
}

// ---------- маршруты ----------
async function route(req, env, url) {
  const p = url.pathname, m = req.method;
  if (m === 'POST' && p === '/api/dev/migrate' && env.DEV_FAKE_LOGIN === '1') return json({ ...(await migrateToR2(env, Number(url.searchParams.get('batch')) || 100)), status: await migrationStatus(env) });
  if (m === 'POST' && p === '/api/dev/cleanup' && env.DEV_FAKE_LOGIN === '1') return json(await cleanupInactive(env, Number(url.searchParams.get('limit')) || KV_LIMIT));
  // публичный профиль: ник, серия, рекорд, бейджи и работы на стене (e-mail не отдаём)
  if (m === 'GET' && p === '/api/profile') {
    const nick = String(url.searchParams.get('nick') || '').replace(/^@/, '');
    const u = await env.DB.prepare('SELECT * FROM users WHERE nick = ? AND banned = 0').bind(nick).first();
    if (!u) fail(404, 'user');
    const rows = (await env.DB.prepare('SELECT id, day, theme, bw, ai, tod, hidden FROM posts WHERE user_id = ? ORDER BY day DESC').bind(u.id).all()).results;
    const pickUser = Number(await getMeta(env, 'pick_user'));
    const badges = mergedBadges(u, rows).filter(b => b !== 'pick_past' || pickUser !== u.id);
    if (pickUser === u.id) badges.push('pick');
    const bag = (await env.DB.prepare("SELECT DISTINCT kind, item FROM gifts WHERE user_id = ? AND status = 'bag'").bind(u.id).all()).results; // вещи в сумке — их видят все
    const unopened = (await env.DB.prepare("SELECT COUNT(*) AS n FROM gifts WHERE user_id = ? AND status = 'new'").bind(u.id).first()).n;
    return json({ id: u.id, avatar: avatarOf(u), room: roomOf(u), bag, unopened, buttons: u.buttons || 0, nick: u.nick, gold: (u.picks || 0) >= GOLD_PICKS, picks: u.picks || 0, current: streaks(streakDays(rows)).current,
      best: mergedBest(u, streakDays(rows)), badges, posts: rows.filter(r => !r.hidden).map(({ id, day, theme, bw, ai }) => ({ id, day, theme, bw, ai })) });
  }

  // карточка птички для превью ссылки /flock/?bird=ник: картинку рисует браузер владельца (bird-card.js) и присылает сюда
  if (m === 'POST' && p === '/api/birdcard') {
    const u = await needUser(req, env);
    if (!env.MEDIA) fail(503, 'storage');
    const buf = await req.arrayBuffer(), b = new Uint8Array(buf);
    if (buf.byteLength < 100 || buf.byteLength > 900_000 || b[0] !== 0x89 || b[1] !== 0x50 || b[2] !== 0x4E || b[3] !== 0x47) fail(400, 'bad');
    await env.MEDIA.put(`birdcards/${u.id}.png`, buf, { httpMetadata: { contentType: 'image/png' } });
    return json({ ok: true });
  }
  if (m === 'GET' && p === '/api/birdcard') {
    const nick = String(url.searchParams.get('nick') || '').replace(/^@/, '');
    const u = nick ? await env.DB.prepare('SELECT id FROM users WHERE nick = ? AND banned = 0').bind(nick).first() : null;
    const o = u && env.MEDIA ? await env.MEDIA.get(`birdcards/${u.id}.png`) : null;
    if (!o) return Response.redirect(`${url.origin}/assets/og-flock-en.jpg`, 302); // карточку ещё не делали — общая картинка стаи
    return new Response(o.body, { headers: { 'content-type': 'image/png', 'cache-control': 'public, max-age=600' } });
  }

  if (m === 'GET' && p === '/api/stats') {
    const works = await getMeta(env, 'works_total') ?? (await env.DB.prepare('SELECT COUNT(*) AS n FROM posts').first()).n;
    const users = await getMeta(env, 'users_total') ?? (await env.DB.prepare('SELECT COUNT(*) AS n FROM users').first()).n;
    const birds = (await env.DB.prepare('SELECT COUNT(*) AS n FROM users WHERE banned = 0').first()).n; // как счётчик «Стаи»
    const posts = (await env.DB.prepare("SELECT COUNT(*) AS n FROM blog_posts WHERE status = 'published' AND COALESCE(published_at, 0) <= CAST(strftime('%s', 'now') AS INTEGER)").first().catch(() => ({ n: 0 }))).n;
    return json({ works: Number(works), users: Number(users), birds, posts }, 200, { 'cache-control': 'public, max-age=60' });
  }
  // «Стая» на главной: все, кто хоть раз входил; когда их много — те, кто заходил недавно (+ сам посетитель)
  if (m === 'GET' && p === '/api/flock') {
    const LIMIT = Math.min(60, Math.max(36, parseInt(url.searchParams.get('limit')) || 36)); // главная — 36, страница «Стая» — до 60
    const me = await currentUser(req, env);
    const total = (await env.DB.prepare('SELECT COUNT(*) AS n FROM users WHERE banned = 0').first()).n;
    let rows = (await env.DB.prepare(`SELECT id, nick, avatar FROM users WHERE banned = 0 ORDER BY COALESCE(last_seen, created_at) DESC LIMIT ?`).bind(LIMIT).all()).results;
    if (me && !me.banned && !rows.some(r => r.id === me.id)) rows = [{ id: me.id, nick: me.nick, avatar: me.avatar }, ...rows.slice(0, LIMIT - 1)];
    return json({ total, recent: total > LIMIT, birds: rows.map(r => ({ id: r.id, nick: r.nick || null, me: !!me && r.id === me.id, avatar: avatarOf(r) })) });
  }
  // все птицы с ником — для списка на странице «Стая»
  if (m === 'GET' && p === '/api/birds') {
    const rows = (await env.DB.prepare("SELECT id, nick, avatar, room FROM users WHERE banned = 0 AND nick IS NOT NULL AND nick != '' ORDER BY created_at LIMIT 2000").all()).results;
    return json({ birds: rows.map(r => { const rm = roomOf(r); return { id: r.id, nick: r.nick, avatar: avatarOf(r), home: !!((rm.items || []).length || rm.wall || rm.floor || rm.view || rm.curtain) }; }) }, 200, { 'cache-control': 'public, max-age=60' });
  }
  // «Найти птичку»: по нику (сначала точное совпадение, потом начало ника)
  // ---------- подписка на новость о книге ----------
  if (m === 'POST' && p === '/api/subscribe') {
    const b = await req.json().catch(() => ({}));
    if (b.website) return json({ ok: true }); // ловушка для ботов
    const email = String(b.email || '').trim().toLowerCase().slice(0, 254);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) fail(400, 'email');
    if (!b.consent) fail(400, 'consent');
    const topic = ['books', 'news'].includes(b.topic) ? b.topic : 'books';
    await env.DB.prepare('INSERT OR IGNORE INTO subscribers (email, topic, lang, consent, created_at) VALUES (?, ?, ?, ?, ?)')
      .bind(email, topic, ['en', 'ru', 'lv'].includes(b.lang) ? b.lang : 'en', String(b.consentText || '').slice(0, 500), now()).run();
    return json({ ok: true });
  }
  if (m === 'POST' && p === '/api/unsubscribe') {
    const b = await req.json().catch(() => ({}));
    const email = String(b.email || '').trim().toLowerCase();
    await env.DB.prepare('DELETE FROM subscribers WHERE email = ?').bind(email).run();
    return json({ ok: true }); // одинаковый ответ, даже если адреса не было
  }
  // все птицы (аккаунты) для кабинета: ник, когда появились, когда заходили, сколько работ
  if (m === 'POST' && p === '/api/hit') return await hit(req, env);
  if (m === 'GET' && p === '/api/admin/visits') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    return json(await visitStats(env, Math.min(Math.max(Number(url.searchParams.get('days')) || 7, 1), 365)));
  }
  if (m === 'POST' && p === '/api/admin/links') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    const b = await req.json().catch(() => ({}));
    if (b.delete) { await env.DB.prepare('DELETE FROM utm_links WHERE id = ?').bind(Number(b.delete)).run(); return json({ ok: true }); }
    const path = String(b.path || '/').trim().slice(0, 200), source = String(b.source || '').trim().toLowerCase().slice(0, 60), campaign = String(b.campaign || '').trim().slice(0, 80);
    if (!path.startsWith('/') || !source || !campaign) fail(400, 'bad');
    await env.DB.prepare('INSERT OR IGNORE INTO utm_links (path, source, campaign, note, created_at) VALUES (?, ?, ?, ?, ?)').bind(path, source, campaign, String(b.note || '').slice(0, 200) || null, now()).run();
    return json({ ok: true });
  }
  // ---------- адвент-календарь ----------
  if (m === 'POST' && p === '/api/room') {
    const u = await needUser(req, env);
    const b = await req.json().catch(() => ({}));
    const room = cleanRoom(b.room || {}, await ownedRoom(env, u.id));
    // галерея комнат в «Стае» сортируется по тому, когда в комнату что-то добавили (новая вещь, обои, пол, вид, шторы) — перестановка не считается
    const old = roomOf(u), cnt = r => { const m = {}; (r.items || []).forEach(it => { m[it.k + '|' + it.v] = (m[it.k + '|' + it.v] || 0) + 1; }); return m; }, oc = cnt(old);
    const added = Object.entries(cnt(room)).some(([k, n]) => n > (oc[k] || 0)) || ['wall', 'floor', 'view', 'curtain'].some(k => room[k] && room[k] !== old[k]);
    await env.DB.prepare(`UPDATE users SET room = ?${added ? ', room_at = ?' : ''} WHERE id = ?`).bind(...(added ? [JSON.stringify(room), now(), u.id] : [JSON.stringify(room), u.id])).run();
    return json({ ok: true, room });
  }
  // галерея комнат (внизу «Стаи»): обустроенные комнаты, свежие изменения первыми; по 24, дальше — offset
  if (m === 'GET' && p === '/api/rooms') {
    const off = Math.max(0, Math.floor(Number(url.searchParams.get('offset')) || 0));
    const rows = (await env.DB.prepare(`SELECT id, nick, avatar, room, room_at FROM users WHERE banned = 0 AND nick IS NOT NULL AND room IS NOT NULL AND room NOT IN ('', '{}', '{"items":[]}')
      ORDER BY COALESCE(room_at, 0) DESC, id DESC LIMIT 25 OFFSET ?`).bind(off).all()).results;
    const list = rows.map(r => ({ id: r.id, nick: r.nick, avatar: avatarOf(r), room: roomOf(r), at: r.room_at || 0 })).filter(r => (r.room.items || []).length || r.room.wall || r.room.floor || r.room.view || r.room.curtain);
    return json({ rooms: list.slice(0, 24), more: rows.length > 24 }, 200, { 'cache-control': 'no-store' });
  }
  // ---------- игра «Пуговичный дождь» (/rain/, site/assets/rain.js) ----------
  // пуговки — за каждый пройденный уровень (RULES.gameLevel), не больше RULES.gameDayMax в сутки; уровни подтверждаются по одному,
  // и каждый не быстрее RULES.gameMinSec секунд от начала забега (защита от «прошёл 100 уровней за секунду»)
  if (m === 'GET' && p === '/api/game') {
    const u = await currentUser(req, env);
    const today = u ? (await env.DB.prepare("SELECT COALESCE(SUM(amount), 0) AS n FROM button_log WHERE user_id = ? AND kind = 'game' AND day = ?").bind(u.id, rigaDay()).first()).n : 0;
    const top = (await env.DB.prepare('SELECT id, nick, avatar, game_best FROM users WHERE game_best > 0 AND banned = 0 AND nick IS NOT NULL ORDER BY game_best DESC, COALESCE(game_best_at, 0), id LIMIT 10').all()).results.map(r => ({ id: r.id, nick: r.nick, avatar: avatarOf(r), best: r.game_best }));
    const gp = gamePrices(await gameUnit(env));
    return json({ on: RULES.gameOn, per: gp.level, record: gp.record, max: gp.max, every: RULES.gameItemEvery, king: gp.king, avg: gp.avg, today, best: u ? u.game_best || 0 : 0, me: u && u.nick && !u.banned ? { id: u.id, nick: u.nick, avatar: avatarOf(u) } : null, top });
  }
  if (m === 'POST' && p === '/api/game/start') {
    const u = await needUser(req, env);
    if (!u.nick || u.banned) fail(400, 'nick');
    const id = randomHex(12);
    await env.DB.prepare('INSERT INTO game_runs (id, user_id, started, level) VALUES (?, ?, ?, 0)').bind(id, u.id, Date.now()).run();
    return json({ run: id });
  }
  if (m === 'POST' && p === '/api/game/level') {
    const u = await needUser(req, env);
    const b = await req.json().catch(() => ({}));
    const r = await env.DB.prepare('SELECT * FROM game_runs WHERE id = ? AND user_id = ?').bind(String(b.run || ''), u.id).first();
    if (!r) fail(404, 'run');
    const lv = Math.floor(Number(b.level) || 0);
    if (lv !== r.level + 1) fail(409, 'order');
    if (Date.now() - r.started < lv * RULES.gameMinSec * 1000) fail(429, 'fast');
    await env.DB.prepare('UPDATE game_runs SET level = ? WHERE id = ? AND level = ?').bind(lv, r.id, r.level).run();
    const oldBest = u.game_best || 0, unit = await gameUnit(env);
    if (lv > oldBest) await env.DB.prepare('UPDATE users SET game_best = ?, game_best_at = ? WHERE id = ? AND COALESCE(game_best, 0) < ?').bind(lv, Date.now(), u.id, lv).run();
    const badges = [];
    for (const [k, c] of [['rain1', 'rainA'], ['rain2', 'rainB'], ['rain3', 'rainC']]) if (lv >= RULES.cond[c] && await gameBadge(env, u, k)) badges.push(k);
    const day = rigaDay(), today = (await env.DB.prepare("SELECT COALESCE(SUM(amount), 0) AS n FROM button_log WHERE user_id = ? AND kind = 'game' AND day = ?").bind(u.id, day).first()).n;
    // каждый номер уровня платит раз в сутки (переигрывать первые уровни ради пуговок бесполезно); каждые 10 уровней — дороже
    const price = btnOf(RULES.gameLevelPct, unit) * (1 + Math.floor((lv - 1) / 10)), cap = btnOf(RULES.gameDayMaxPct, unit);
    const n = RULES.gameOn ? (cap > 0 ? Math.max(0, Math.min(price, cap - today)) : price) : 0;
    const got = n > 0 ? await award(env, u.id, 'game', day + ':' + lv, n) : 0;
    // новый личный рекорд: бонус за каждый уровень выше прежнего рекорда (один раз навсегда) — хочется расти, а не переигрывать
    const rec = RULES.gameOn && lv > oldBest && RULES.gameRecordPct > 0 ? await award(env, u.id, 'gamerec', String(lv), btnOf(RULES.gameRecordPct, unit)) : 0;
    // каждые gameItemEvery уровней — вещь из магазина, которой у птички нет (не легендарная); за один и тот же уровень — раз в сутки
    let item = null;
    if (RULES.gameItemEvery > 0 && lv % RULES.gameItemEvery === 0) {
      const once = await env.DB.prepare('INSERT OR IGNORE INTO button_log (user_id, kind, ref, amount, day, created_at) VALUES (?, ?, ?, 0, ?, ?)').bind(u.id, 'rainitem', day + ':' + lv, day, now()).run();
      if (once.meta.changes) item = await rainItem(env, req, u.id, lv);
    }
    // первое место в рекордах: +gameKing 🔘 в каждый день, когда держится на первом месте и играет
    let king = 0;
    if (RULES.gameKingPct > 0) {
      const first = await env.DB.prepare('SELECT id FROM users WHERE game_best > 0 AND banned = 0 AND nick IS NOT NULL ORDER BY game_best DESC, COALESCE(game_best_at, 0), id LIMIT 1').first();
      if (first && first.id === u.id) king = await award(env, u.id, 'rainking', day, btnOf(RULES.gameKingPct, unit));
    }
    return json({ ok: true, got, rec, today: today + got, max: cap, best: Math.max(lv, oldBest), badges, item, king });
  }
  if (m === 'GET' && p === '/api/potion') {
    const u = await currentUser(req, env);
    const gp = gamePrices(await gameUnit(env)), rules = { on: RULES.potionOn, p1: gp.p1, p2: gp.p2, p3: gp.p3, again: gp.again, max: gp.pmax, avg: gp.avg };
    if (!u || !u.nick || u.banned) return json({ me: null, rules, season: seasonNow() });
    const today = (await env.DB.prepare("SELECT COALESCE(SUM(amount), 0) AS n FROM button_log WHERE user_id = ? AND kind = 'potion' AND day = ?").bind(u.id, rigaDay()).first()).n;
    const book = (await env.DB.prepare('SELECT combo, tier, n, created_at FROM potion_book WHERE user_id = ? ORDER BY created_at DESC').bind(u.id).all()).results.map(r => { const s = comboSeason(r.combo); return { ...r, season: s, ix: COMBO_IX[s].get(r.combo) }; });
    const gifts = (await env.DB.prepare('SELECT from_nick AS "from", ing, n FROM potion_gifts WHERE to_id = ? AND seen = 0 ORDER BY id').bind(u.id).all()).results;
    return json({ me: { id: u.id, nick: u.nick, avatar: avatarOf(u) }, level: u.maze_level || 1, inv: invOf(u), book, today, rules, season: seasonNow(), gifts });
  }
  // новый лабиринт текущего уровня: сервер решает, какие ингредиенты в нём лежат; seed — форма лабиринта, проклятия и бонусы (их считает potions.js)
  if (m === 'POST' && p === '/api/potion/level') {
    const u = await needUser(req, env);
    if (!u.nick || u.banned) fail(400, 'nick');
    const level = u.maze_level || 1, id = randomHex(12), seed = Math.floor(Math.random() * 2 ** 31), season = seasonNow(), items = mazeItems(level, season);
    await env.DB.prepare('INSERT INTO maze_runs (id, user_id, level, seed, items, started) VALUES (?, ?, ?, ?, ?, ?)').bind(id, u.id, level, seed, JSON.stringify(items), Date.now()).run();
    return json({ run: id, level, seed, items, season });
  }
  // дошла до выхода: собранные ингредиенты (номера из items) — в сумку зельевара, уровень +1
  if (m === 'POST' && p === '/api/potion/done') {
    const u = await needUser(req, env);
    const b = await req.json().catch(() => ({}));
    const r = await env.DB.prepare('SELECT * FROM maze_runs WHERE id = ? AND user_id = ? AND done = 0').bind(String(b.run || ''), u.id).first();
    if (!r) fail(404, 'run');
    if (Date.now() - r.started < RULES.potionMinSec * 1000) fail(429, 'fast');
    const items = parseJ(r.items, []) || [], got = [...new Set((Array.isArray(b.got) ? b.got : []).map(Number).filter(i => Number.isInteger(i) && i >= 0 && i < items.length))];
    const upd = await env.DB.prepare('UPDATE maze_runs SET done = 1 WHERE id = ? AND done = 0').bind(r.id).run();
    if (!upd.meta.changes) fail(404, 'run');
    const inv = invOf(u); for (const i of got) inv[items[i]] = Math.min(99, (inv[items[i]] || 0) + 1);
    const level = Math.max(u.maze_level || 1, r.level + 1);
    await env.DB.prepare('UPDATE users SET inv = ?, maze_level = ? WHERE id = ?').bind(JSON.stringify(inv), level, u.id).run();
    const badges = r.level >= RULES.cond.mazeA && await gameBadge(env, u, 'maze') ? ['maze'] : [];
    return json({ ok: true, inv, level, got: got.map(i => items[i]), badges });
  }
  // подарить ингредиенты другой птичке (до 10 штук за раз); получатель увидит «🎁 @ник подарил(а)…» на странице игры
  if (m === 'POST' && p === '/api/potion/give') {
    const u = await needUser(req, env);
    if (!u.nick || u.banned) fail(400, 'nick');
    const b = await req.json().catch(() => ({}));
    const ing = String(b.ing || ''), n = Math.floor(Number(b.n) || 0);
    if (!ING_SEASON[ing] || n < 1 || n > 10) fail(400, 'bad');
    const to = await env.DB.prepare('SELECT id, nick, inv FROM users WHERE nick = ? AND banned = 0 AND id != ?').bind(String(b.to || '').trim().replace(/^@/, ''), u.id).first();
    if (!to) fail(404, 'bird');
    const inv = invOf(u); if ((inv[ing] || 0) < n) fail(409, 'inv');
    inv[ing] -= n; if (!inv[ing]) delete inv[ing];
    const tinv = invOf(to); tinv[ing] = Math.min(99, (tinv[ing] || 0) + n);
    await env.DB.batch([
      env.DB.prepare('UPDATE users SET inv = ? WHERE id = ?').bind(JSON.stringify(inv), u.id),
      env.DB.prepare('UPDATE users SET inv = ? WHERE id = ?').bind(JSON.stringify(tinv), to.id),
      env.DB.prepare('INSERT INTO potion_gifts (to_id, from_nick, ing, n, created_at) VALUES (?, ?, ?, ?, ?)').bind(to.id, u.nick, ing, n, now()),
    ]);
    return json({ ok: true, inv, to: to.nick, n });
  }
  if (m === 'POST' && p === '/api/potion/seen') {
    const u = await needUser(req, env);
    await env.DB.prepare('UPDATE potion_gifts SET seen = 1 WHERE to_id = ? AND seen = 0').bind(u.id).run();
    return json({ ok: true });
  }
  // сварить: три ингредиента из сумки; рецепт срабатывает или нет (это и узнают методом проб); новое зелье — пуговки по уровню
  if (m === 'POST' && p === '/api/potion/brew') {
    const u = await needUser(req, env);
    if (!u.nick || u.banned) fail(400, 'nick');
    const b = await req.json().catch(() => ({}));
    const ings = (Array.isArray(b.ings) ? b.ings : []).map(String);
    if (ings.length !== 3 || !ings.every(x => ING_SEASON[x])) fail(400, 'bad');
    if (new Set(ings.map(x => ING_SEASON[x])).size > 1) fail(400, 'mix'); // сезоны в одном котле не смешиваются
    const inv = invOf(u), need = {};
    for (const x of ings) need[x] = (need[x] || 0) + 1;
    for (const [x, n] of Object.entries(need)) if ((inv[x] || 0) < n) fail(409, 'inv');
    for (const [x, n] of Object.entries(need)) { inv[x] -= n; if (!inv[x]) delete inv[x]; }
    const combo = [...ings].sort((a, c) => ALL_ING.indexOf(a) - ALL_ING.indexOf(c)).join('+'), pot = potionOf(combo);
    let was = await env.DB.prepare('SELECT n, tier FROM potion_book WHERE user_id = ? AND combo = ?').bind(u.id, combo).first();
    // две неудачи подряд — третье зелье получается точно (уровень — по числу сладких); раньше не вышло, а теперь выходит — считается новым
    const sw = ings.filter(x => SWEET.has(x)).length, pity = !pot.tier && (u.pot_fails || 0) >= 2;
    if (pity) pot.tier = sw === 3 ? 3 : sw === 2 ? 2 : 1;
    if (was && was.tier === 0 && pot.tier > 0) { await env.DB.prepare('DELETE FROM potion_book WHERE user_id = ? AND combo = ?').bind(u.id, combo).run(); was = null; }
    // не получилось — один ингредиент уцелел и вернулся в сумку
    let back = null;
    if (!pot.tier) { back = ings[Math.floor(Math.random() * 3)]; inv[back] = Math.min(99, (inv[back] || 0) + 1); }
    await env.DB.batch([
      env.DB.prepare('UPDATE users SET inv = ? WHERE id = ?').bind(JSON.stringify(inv), u.id),
      env.DB.prepare('INSERT INTO potion_book (user_id, combo, tier, n, created_at) VALUES (?, ?, ?, 1, ?) ON CONFLICT(user_id, combo) DO UPDATE SET n = n + 1').bind(u.id, combo, pot.tier, now()),
      env.DB.prepare('UPDATE users SET pot_fails = ? WHERE id = ?').bind(pot.tier ? 0 : (u.pot_fails || 0) + 1, u.id),
    ]);
    let got = 0; const badges = [];
    if (pot.tier > 0) {
      const today = (await env.DB.prepare("SELECT COALESCE(SUM(amount), 0) AS n FROM button_log WHERE user_id = ? AND kind = 'potion' AND day = ?").bind(u.id, rigaDay()).first()).n;
      const gp = gamePrices(await gameUnit(env)), price = was ? gp.again : [0, gp.p1, gp.p2, gp.p3][pot.tier];
      const n = RULES.potionOn ? (gp.pmax > 0 ? Math.max(0, Math.min(price, gp.pmax - today)) : price) : 0;
      if (n > 0) got = await award(env, u.id, 'potion', combo + ':' + ((was ? was.n : 0) + 1), n);
      const kinds = (await env.DB.prepare('SELECT COUNT(*) AS n FROM potion_book WHERE user_id = ? AND tier > 0').bind(u.id).first()).n;
      for (const [k, ok] of [['pot1', kinds >= 1], ['pot2', kinds >= RULES.cond.potA], ['pot3', kinds >= RULES.cond.potB], ['potkid', pot.tier === 3]]) if (ok && await gameBadge(env, u, k)) badges.push(k);
    }
    // новое зелье «Вкус детства» — бутылочка в сумку, её можно поставить в комнату (вещь furn|kidpot:N, только из игры, в магазине её нет)
    let item = null;
    if (pot.tier === 3 && !was && RULES.potionShelf) {
      item = { kind: 'furn', item: 'kidpot:' + (pot.ix % 8) };
      await env.DB.prepare("INSERT INTO gifts (user_id, kind, item, note, status, created_at, opened_at) VALUES (?, ?, ?, ?, 'bag', ?, ?)").bind(u.id, item.kind, item.item, 'potion:' + pot.season + ':' + pot.ix, now(), now()).run();
    }
    return json({ ok: true, combo, tier: pot.tier, ix: pot.ix, season: pot.season, first: !was, got, inv, badges, item, back, sure: !pot.tier && (u.pot_fails || 0) + 1 >= 2, pity });
  }
  // ---------- «Нарисуй мне» ----------
  if (m === 'GET' && p === '/api/requests') {
    const u = await currentUser(req, env), lang = ['en', 'ru', 'lv'].includes(url.searchParams.get('lang')) ? url.searchParams.get('lang') : 'en';
    const v = visitor(req, cookie), adm = u ? await isAdmin(u, env) : false;
    const rows = (await env.DB.prepare(`SELECT r.id, r.text, r.text_en, r.anon, r.status, r.img, r.created_at, r.answered_at, r.user_id, u.nick FROM draw_requests r LEFT JOIN users u ON u.id = r.user_id
      WHERE r.status IN ('open', 'done') ORDER BY COALESCE(r.answered_at, r.created_at) DESC LIMIT 5000`).all()).results
      .map(r => ({ id: r.id, text: r.text, en: r.text_en || null, status: r.status, img: r.img, at: r.answered_at || r.created_at, name: r.nick ? '@' + r.nick : birdName(r.anon, lang), named: !!r.nick, mine: !!(u && r.user_id === u.id), likes: 0, liked: false }));
    // лайки: у темы — 't', у нарисованного — 'd'
    const me = u && u.nick && !u.banned ? 'u' + u.id : 'v' + v.id, byId = new Map(rows.map(r => [r.id, r]));
    for (const l of (await env.DB.prepare('SELECT rid, kind, COUNT(*) AS n, MAX(who = ?) AS mine FROM draw_likes GROUP BY rid, kind').bind(me).all()).results) {
      const r = byId.get(l.rid); if (r && (r.status === 'done') === (l.kind === 'd')) { r.likes = l.n; r.liked = !!l.mine; }
    }
    const res = json({ open: rows.filter(r => r.status === 'open').sort((a, b) => a.at - b.at), done: rows.filter(r => r.status === 'done'), admin: adm,
      me: u && u.nick && !u.banned ? { nick: u.nick } : null, anon: birdName(await anonCode(v.id), lang) });
    if (v.set) res.headers.append('set-cookie', v.set);
    return res;
  }
  if (m === 'POST' && p === '/api/requests') {
    const u = await currentUser(req, env), v = visitor(req, cookie);
    const b = await req.json().catch(() => ({}));
    const text = String(b.text || '').replace(/\s+/g, ' ').trim().slice(0, 120); // тема — одна строка, до 120 символов
    if (text.length < 3) fail(400, 'short');
    if (/https?:|www\.|\.(com|net|org|ru|lv|io)\b/i.test(text)) fail(400, 'link'); // без ссылок
    const named = u && u.nick && !u.banned, who = named ? 'u' + u.id : 'v' + v.id;
    const today = (await env.DB.prepare('SELECT COUNT(*) AS n FROM draw_requests WHERE who = ? AND created_at > ?').bind(who, now() - 86400).first()).n;
    if (today >= 5) fail(429, 'many'); // не больше 5 тем в сутки от одного человека
    const anon = named ? null : await anonCode(v.id), lang = ['en', 'ru', 'lv'].includes(b.lang) ? b.lang : 'en';
    const r = await env.DB.prepare('INSERT INTO draw_requests (user_id, anon, text, text_en, lang, who, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(named ? u.id : null, anon, text, await reqEnglish(env, text), lang, who, now()).run();
    const res = json({ ok: true, id: r.meta.last_row_id, name: named ? '@' + u.nick : birdName(anon, lang) });
    if (v.set) res.headers.append('set-cookie', v.set);
    return res;
  }
  // лайк темы или рисунка (повторное нажатие — снять); анонимам тоже можно (по cookie)
  if (m === 'POST' && p === '/api/requests/like') {
    const u = await currentUser(req, env), v = visitor(req, cookie);
    const b = await req.json().catch(() => ({}));
    const r = await env.DB.prepare("SELECT id, status FROM draw_requests WHERE id = ? AND status IN ('open', 'done')").bind(Number(b.id)).first();
    if (!r) fail(404, 'req');
    const who = u && u.nick && !u.banned ? 'u' + u.id : 'v' + v.id, kind = r.status === 'done' ? 'd' : 't';
    const del = await env.DB.prepare('DELETE FROM draw_likes WHERE rid = ? AND kind = ? AND who = ?').bind(r.id, kind, who).run();
    if (!del.meta.changes) await env.DB.prepare('INSERT OR IGNORE INTO draw_likes (rid, kind, who, created_at) VALUES (?, ?, ?, ?)').bind(r.id, kind, who, now()).run();
    const n = (await env.DB.prepare('SELECT COUNT(*) AS n FROM draw_likes WHERE rid = ? AND kind = ?').bind(r.id, kind).first()).n;
    const res = json({ ok: true, liked: !del.meta.changes, likes: n });
    if (v.set) res.headers.append('set-cookie', v.set);
    return res;
  }
  // Алина загружает рисунок-ответ (полная + превью, как в челлендже); автору с ником — подарок
  if (m === 'POST' && p === '/api/admin/requests/answer') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    const f = await req.formData(), rid = Number(f.get('id')), full = f.get('full'), thumb = f.get('thumb');
    const r = await env.DB.prepare('SELECT * FROM draw_requests WHERE id = ?').bind(rid).first();
    if (!r) fail(404, 'req');
    if (!full || !thumb || full.size > 6e6) fail(400, 'img');
    const id = randomHex(12); await imgPut(env, id, await full.arrayBuffer(), await thumb.arrayBuffer());
    const first = r.status !== 'done';
    if (!r.text_en && guessLang(r.text) !== 'en') { const en = await reqEnglish(env, r.text); if (en) await env.DB.prepare('UPDATE draw_requests SET text_en = ? WHERE id = ?').bind(en, rid).run(); } // перевод не успел при отправке — ещё раз
    await env.DB.prepare("UPDATE draw_requests SET status = 'done', img = ?, answered_at = ? WHERE id = ?").bind(id, now(), rid).run();
    if (first) await env.DB.prepare("DELETE FROM draw_likes WHERE rid = ? AND kind = 't'").bind(rid).run(); // нарисовано — лайки темы сбрасываются, рисунок собирает свои
    const gift = first && r.user_id ? await reqReward(env, req, r.user_id, rid) : null;
    if (gift) await env.DB.prepare('UPDATE draw_requests SET gift = ? WHERE id = ?').bind(gift.kind + '|' + gift.item, rid).run();
    return json({ ok: true, img: id, gift });
  }
  if (m === 'POST' && p === '/api/admin/requests/hide') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    const b = await req.json().catch(() => ({}));
    await env.DB.prepare("UPDATE draw_requests SET status = 'hidden' WHERE id = ?").bind(Number(b.id)).run();
    return json({ ok: true });
  }
  if (m === 'GET' && p === '/api/advent') {
    const t = adventNow(req, env), u = await currentUser(req, env), admin = await isAdmin(u, env);
    const opened = u ? (await env.DB.prepare('SELECT day, kind, item, buttons, got FROM advent_open WHERE user_id = ? AND year = ?').bind(u.id, t.year).all()).results.map(o => ({ ...o, got: parseJ(o.got, o.kind ? [[o.kind, o.item]] : []) })) : [];
    const all = (await env.DB.prepare('SELECT day, kind, item FROM advent_plan ORDER BY day').all()).results;
    // прошедшие окошки открыты для всех (и для гостей): в декабре — дни до сегодняшнего, в январе — все; будущее — секрет (целиком видит только админ)
    const shownTo = t.day ? t.day - 1 : t.month === 1 ? 31 : 0;
    return json({ year: t.year, month: t.month, today: t.day, claimTo: t.claimTo, catchUp: t.catchUp, lastJan: RULES.adventLastJan, startsAt: t.startsAt, now: t.nowMs, special: ADVENT_SPECIAL, user: u ? { id: u.id, nick: u.nick } : null, opened,
      past: all.filter(r => r.day <= shownTo), shownTo, plan: admin ? all : undefined }, 200, { 'cache-control': 'no-store' });
  }
  if (m === 'POST' && p === '/api/advent/open') {
    const u = await needUser(req, env);
    if (!u.nick) fail(400, 'nick');
    const t = adventNow(req, env), b = await req.json().catch(() => ({})), day = Math.floor(Number(b.day));
    if (!(day >= 1 && day <= t.claimTo)) fail(403, 'locked'); // сегодняшнее и пропущенные (до 23 января), будущие — нет
    const ins = await env.DB.prepare('INSERT OR IGNORE INTO advent_open (user_id, year, day, created_at) VALUES (?, ?, ?, ?)').bind(u.id, t.year, day, now()).run();
    if (!ins.meta.changes) { const o = await env.DB.prepare('SELECT day, kind, item, buttons, got FROM advent_open WHERE user_id = ? AND year = ? AND day = ?').bind(u.id, t.year, day).first(); return json({ ok: true, again: true, ...o, got: parseJ(o.got, o.kind ? [[o.kind, o.item]] : []) }); }
    // у всех одинаково: птичка получает все вещи окошка (кроме тех, которых у неё уже максимум); пустое окошко — пуговки
    const plan = (await env.DB.prepare('SELECT kind, item FROM advent_plan WHERE day = ?').bind(day).all()).results;
    const got = [];
    for (const r of plan) {
      const isSur = r.item === '?' || r.kind === 'any';
      const ki = isSur ? await surpriseKI(env, req, u.id, r.kind, r.item) : [r.kind, r.item]; // «🎲 Сюрприз» — своя случайная вещь каждой птичке
      if (!ki || (!isSur && await copies(env, u.id, ki[0], ki[1]) >= legMax(ki[0], ki[1]))) continue;
      await env.DB.prepare("INSERT INTO gifts (user_id, kind, item, note, status, created_at, opened_at) VALUES (?, ?, ?, 'advent', 'bag', ?, ?)").bind(u.id, ki[0], ki[1], now(), now()).run();
      got.push(ki);
    }
    if (got.length) {
      await env.DB.prepare('UPDATE advent_open SET kind = ?, item = ?, got = ? WHERE user_id = ? AND year = ? AND day = ?').bind(got[0][0], got[0][1], JSON.stringify(got), u.id, t.year, day).run();
      return json({ ok: true, day, kind: got[0][0], item: got[0][1], got, collector: await adventCollector(env, u.id, t.year), collectorBtns: BTN.badges.collector });
    }
    const n = ADVENT_SPECIAL.includes(day) ? BTN.adventSpecial : BTN.advent;
    await award(env, u.id, 'advent', `${t.year}-${day}`, n);
    await env.DB.prepare('UPDATE advent_open SET buttons = ? WHERE user_id = ? AND year = ? AND day = ?').bind(n, u.id, t.year, day).run();
    return json({ ok: true, day, buttons: n, collector: await adventCollector(env, u.id, t.year), collectorBtns: BTN.badges.collector });
  }
  if (m === 'POST' && p === '/api/admin/advent') { // Алина отмечает в «Коллекциях», какую вещь положить в какое окошко
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    const b = await req.json().catch(() => ({})), day = Math.floor(Number(b.day));
    if (!(day >= 1 && day <= 31) || !okItem(b.kind, b.item)) fail(400, 'bad');
    if (b.on === false) await env.DB.prepare('DELETE FROM advent_plan WHERE day = ? AND kind = ? AND item = ?').bind(day, b.kind, String(b.item)).run();
    else await env.DB.prepare('INSERT OR IGNORE INTO advent_plan (day, kind, item) VALUES (?, ?, ?)').bind(day, b.kind, String(b.item)).run();
    return json({ ok: true, plan: (await env.DB.prepare('SELECT day, kind, item FROM advent_plan ORDER BY day').all()).results });
  }
  // картины и палитры, добавленные с сайта (галереи «Мой скетчбук», раздел «Палитры», очередь дней ЭКСТРА)
  if (m === 'GET' && p === '/api/palettes') {
    const { q, rows } = await extraQueue(env, req);
    const hidden = (await env.DB.prepare('SELECT src, thumb, gallery FROM art_hidden ORDER BY created_at DESC').all()).results;
    return json({ added: rows.filter(r => !r.hidden).reverse().map(artEntry), hidden, queue: q.map(x => x.k), month: extraMonth() }, 200, { 'cache-control': 'no-cache' });
  }
  if (m === 'GET' && p === '/api/extra-palettes.js') {
    const { q } = await extraQueue(env, req);
    return new Response('window.EXTRA_PALETTES=' + JSON.stringify(q) + ';\n', { headers: { 'content-type': 'application/javascript; charset=utf-8', 'cache-control': 'public, max-age=300' } });
  }
  if (m === 'POST' && p === '/api/admin/art') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    if (!env.MEDIA) fail(503, 'storage');
    const f = await req.formData(), full = f.get('full'), thumb = f.get('thumb');
    let meta; try { meta = JSON.parse(String(f.get('meta') || '{}')); } catch (e) { fail(400, 'bad'); }
    const gallery = String(meta.gallery || '');
    if (!ART_GALLERIES.includes(gallery) || !full || !thumb || full.size > 6e6 || thumb.size > 2e6) fail(400, 'bad');
    const title = [0, 1, 2].map(i => String((meta.title || [])[i] || (meta.title || [])[0] || '').trim().slice(0, 80));
    const colors = (meta.colors || []).slice(0, 6).map(c => [String(c[0]).toUpperCase(), ...[1, 2, 3].map(i => String(c[i] || '').slice(0, 40))]);
    // из галереи «Мой скетчбук» — просто картина (palette: false); со страницы «Палитры» — с палитрой и в очередь ЭКСТРА (AI-арт — никогда)
    const palette = gallery !== 'ai-art' && meta.palette !== false ? 1 : 0;
    if (palette && (!title[0] || colors.length !== 6 || !colors.every(c => /^#[0-9A-F]{6}$/.test(c[0])))) fail(400, 'bad');
    const key = 'art-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    const meta2 = { httpMetadata: { contentType: 'image/jpeg' } };
    await Promise.all([env.MEDIA.put(`art/${key}.jpg`, await full.arrayBuffer(), meta2), env.MEDIA.put(`art/${key}-800.jpg`, await thumb.arrayBuffer(), meta2)]);
    // в очередь ЭКСТРА: сразу после текущего месяца и после уже ждущих добавленных
    let pos = null;
    if (palette) {
      const { q, rows } = await extraQueue(env, req), mine = new Set(rows.map(r => r.key)), mi = extraMonth();
      pos = Math.min(q.length, Math.max(0, mi + 1 + q.filter((x, j) => j > mi && mine.has(x.k)).length));
    }
    await env.DB.prepare('INSERT INTO art_added (key, gallery, title, colors, w, h, palette, pos, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(key, gallery, JSON.stringify(title), JSON.stringify(colors), Math.round(Number(meta.w) || 800), Math.round(Number(meta.h) || 600), palette, pos, now()).run();
    const row = await env.DB.prepare('SELECT * FROM art_added WHERE key = ?').bind(key).first();
    return json({ ok: true, item: artEntry(row), extraMonth: pos });
  }
  if (m === 'POST' && p === '/api/admin/art/hide') { // скрыть / вернуть картину из статики в галерее
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    const b = await req.json().catch(() => ({}));
    const src = String(b.src || ''), thumb = String(b.thumb || '');
    if (!/^images\/[a-z0-9-]+\/[\w.-]+\.(?:jpe?g|png|webp)$/i.test(src)) fail(400, 'bad');
    if (b.hide === false) await env.DB.prepare('DELETE FROM art_hidden WHERE src = ?').bind(src).run();
    else await env.DB.prepare('INSERT OR REPLACE INTO art_hidden (src, thumb, gallery, created_at) VALUES (?, ?, ?, ?)')
      .bind(src, /^images\/[\w./-]+$/.test(thumb) ? thumb : src, String(b.gallery || '').slice(0, 30), now()).run();
    hiddenArtCache.at = 0;
    return json({ ok: true });
  }
  if (m === 'POST' && p === '/api/admin/art/delete') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    const b = await req.json().catch(() => ({}));
    const row = await env.DB.prepare('SELECT * FROM art_added WHERE key = ?').bind(String(b.key || '')).first();
    if (!row) fail(404, 'not_found');
    // уже была палитрой дня ЭКСТРА (или идёт в этом месяце) — остаётся в очереди, чтобы прошлые месяцы не поменялись; иначе убираем и из очереди
    const { q } = await extraQueue(env, req), j = q.findIndex(x => x.k === row.key);
    if (j > extraMonth() || j < 0) {
      await env.DB.prepare('UPDATE art_added SET hidden = 1, removed_at = ? WHERE id = ?').bind(now(), row.id).run();
      if (env.MEDIA) await env.MEDIA.delete([`art/${row.key}.jpg`, `art/${row.key}-800.jpg`]);
    } else await env.DB.prepare('UPDATE art_added SET hidden = 1 WHERE id = ?').bind(row.id).run();
    return json({ ok: true });
  }
  if (m === 'GET' && p === '/api/admin/users') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    return json({ users: (await env.DB.prepare(`SELECT u.id, u.nick, u.created_at, u.last_seen, u.banned, u.best, u.picks, u.avatar, COALESCE(u.buttons, 0) AS buttons,
      (SELECT COUNT(*) FROM users f WHERE f.referrer = u.id) AS invited,
      (SELECT COUNT(*) FROM gifts g WHERE g.user_id = u.id) AS gifts,
      (SELECT COUNT(*) FROM posts w WHERE w.user_id = u.id) AS works FROM users u ORDER BY u.created_at DESC`).all()).results });
  }
  if (p === '/api/admin/blocks') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    if (m === 'POST') {
      const b = await req.json().catch(() => ({}));
      const id = String(b.id || ''), lang = String(b.lang || '');
      if (!(/^[a-z0-9.-]{1,80}$/.test(id) || /^page:\/[a-z0-9\/-]{0,80}$/.test(id)) || !['en', 'ru', 'lv', '*'].includes(lang)) fail(400, 'bad');
      if (id.startsWith('page:')) { // порядок блоков и список новых блоков страницы
        if (b.html == null) await env.DB.prepare("DELETE FROM site_blocks WHERE id = ? AND lang = '*'").bind(id).run();
        else await env.DB.prepare("INSERT INTO site_blocks (id, lang, html, hidden, page, updated_at) VALUES (?, '*', ?, 0, ?, ?) ON CONFLICT(id, lang) DO UPDATE SET html = excluded.html, updated_at = excluded.updated_at").bind(id, String(b.html).slice(0, 20000), String(b.page || '').slice(0, 200), now()).run();
      } else if (lang === '*') {
        if (b.hidden) await env.DB.prepare('INSERT INTO site_blocks (id, lang, hidden, page, updated_at) VALUES (?, ?, 1, ?, ?) ON CONFLICT(id, lang) DO UPDATE SET hidden = 1, page = excluded.page, updated_at = excluded.updated_at').bind(id, '*', String(b.page || '').slice(0, 200), now()).run();
        else await env.DB.prepare("DELETE FROM site_blocks WHERE id = ? AND lang = '*'").bind(id).run();
      } else if (b.html == null) await env.DB.prepare('DELETE FROM site_blocks WHERE id = ? AND lang = ?').bind(id, lang).run(); // «вернуть как было»
      else {
        const html = String(b.html);
        if (html.length > 300000) fail(413, 'big');
        await env.DB.prepare('INSERT INTO site_blocks (id, lang, html, page, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id, lang) DO UPDATE SET html = excluded.html, page = excluded.page, updated_at = excluded.updated_at')
          .bind(id, lang, html, String(b.page || '').slice(0, 200), now()).run();
      }
      blocksCache = { at: 0, rows: null };
    }
    return json({ blocks: (await env.DB.prepare('SELECT id, lang, hidden, page, updated_at, html FROM site_blocks ORDER BY updated_at DESC').all()).results });
  }
  if (p === '/api/admin/subscribers') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    if (m === 'POST') { const b = await req.json().catch(() => ({})); await env.DB.prepare('DELETE FROM subscribers WHERE id = ?').bind(Number(b.id)).run(); }
    return json({ subscribers: (await env.DB.prepare('SELECT id, email, topic, lang, consent, created_at FROM subscribers ORDER BY created_at DESC').all()).results });
  }
  if (m === 'GET' && p === '/api/flock/find') {
    const q = String(url.searchParams.get('nick') || '').trim().replace(/^@/, '').slice(0, 40);
    if (q.length < 2) return json({ birds: [] });
    const exact = await env.DB.prepare('SELECT id, nick FROM users WHERE banned = 0 AND nick = ? COLLATE NOCASE').bind(q).first();
    const rows = exact ? [exact] : (await env.DB.prepare("SELECT id, nick FROM users WHERE banned = 0 AND nick LIKE ? ESCAPE '\\' ORDER BY COALESCE(last_seen, created_at) DESC LIMIT 5")
      .bind(q.replace(/[\\%_]/g, c => '\\' + c) + '%').all()).results;
    return json({ birds: rows.map(r => ({ id: r.id, nick: r.nick })) });
  }
  // шапка сайта: кто вошёл (для кнопки входа и птички-аватара)
  if (m === 'GET' && p === '/api/whoami') {
    const u = await currentUser(req, env);
    const earned = u && u.nick && !u.banned ? await award(env, u.id, 'daily', rigaDay(), BTN.daily) : 0; // +3 пуговки за первый заход за сутки (шапка спрашивает на каждой странице)
    // зарплата от «администрации Воббленда»: пуговки уже начислены, а конвертик ещё не открыт (seen = 0)
    const salary = u && u.nick && !u.banned ? (await env.DB.prepare("SELECT id, amount FROM button_log WHERE user_id = ? AND kind = 'salary' AND seen = 0").bind(u.id).all()).results : [];
    return json({ user: u && !u.banned ? { id: u.id, nick: u.nick || null, admin: await isAdmin(u, env), avatar: avatarOf(u), buttons: (u.buttons || 0) + earned, earned, salary, friendBtns: BTN.friend } : null, clientId: env.GOOGLE_CLIENT_ID, dev: env.DEV_FAKE_LOGIN === '1' });
  }
  if (m === 'GET' && p === '/api/config') return json({ ready: true, clientId: env.GOOGLE_CLIENT_ID, dev: env.DEV_FAKE_LOGIN === '1' });

  if (m === 'POST' && p === '/api/login') {
    const body = await req.json().catch(() => ({}));
    let who;
    if (env.DEV_FAKE_LOGIN === '1' && String(body.credential).startsWith('dev:')) {
      const name = String(body.credential).slice(4) || 'tester';
      who = { sub: 'dev:' + name, email: name + '@example.com' };
    } else who = await verifyGoogle(body.credential, env);
    let u = await env.DB.prepare('SELECT * FROM users WHERE sub = ?').bind(who.sub).first();
    if (!u) {
      await env.DB.prepare('INSERT INTO users (sub, email, created_at) VALUES (?, ?, ?)').bind(who.sub, who.email, now()).run();
      await bump(env, 'users_total', 'SELECT COUNT(*) AS n FROM users');
      u = await env.DB.prepare('SELECT * FROM users WHERE sub = ?').bind(who.sub).first();
    } else if (who.email && who.email !== u.email) {
      await env.DB.prepare('UPDATE users SET email = ? WHERE id = ?').bind(who.email, u.id).run();
    }
    if (u.banned) fail(403, 'banned');
    const token = randomHex(32);
    await env.DB.batch([
      env.DB.prepare('DELETE FROM sessions WHERE expires < ?').bind(now()),
      env.DB.prepare('INSERT INTO sessions (token, user_id, expires) VALUES (?, ?, ?)').bind(token, u.id, now() + SESSION_DAYS * 86400),
    ]);
    return json({ ok: true }, 200, { 'set-cookie': sessionCookie(token, SESSION_DAYS * 86400) });
  }

  if (m === 'POST' && p === '/api/logout') {
    const token = cookie(req, 'pp_s');
    if (token) await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    return json({ ok: true }, 200, { 'set-cookie': sessionCookie('', 0) });
  }

  if (m === 'GET' && p === '/api/me') {
    const u = await currentUser(req, env);
    if (!u) return json({ user: null });
    const earned = u.nick && !u.banned ? await award(env, u.id, 'daily', rigaDay(), BTN.daily) : 0; // +3 за первый заход за сутки
    if (earned) u.buttons = (u.buttons || 0) + earned;
    const rows = (await env.DB.prepare('SELECT id, day, theme, bw, ai, tod, hidden FROM posts WHERE user_id = ? ORDER BY day DESC').bind(u.id).all()).results;
    const st = streaks(streakDays(rows));
    const pickUser = Number(await getMeta(env, 'pick_user'));
    const kept = mergedBadges(u, rows).filter(b => b !== 'pick_past' || pickUser !== u.id);
    if (pickUser === u.id) kept.push('pick');
    const admin = await isAdmin(u, env);
    const bestNow = mergedBest(u, streakDays(rows));
    const forBadges = u.nick && !u.banned ? await awardBadges(env, u.id, bestNow, kept) : { total: 0, got: [] };
    if (forBadges.total) u.buttons = (u.buttons || 0) + forBadges.total;
    const storage = admin ? Math.round(await storageUsed(env) * 1000) / 10 : undefined;
    const migration = admin && env.MEDIA ? await migrationStatus(env) : undefined;
    return json({ user: { storage, migration, picks: u.picks || 0, gold: (u.picks || 0) >= GOLD_PICKS, nick: u.nick, consent: !!u.consent, banned: !!u.banned, admin: await isAdmin(u, env), current: st.current,
      best: mergedBest(u, streakDays(rows)), keptBadges: kept, posts: rows, id: u.id, avatar: avatarOf(u), room: roomOf(u), earned, badgeEarned: forBadges, btn: await buttonStatus(env, u),
      gifts: (await env.DB.prepare('SELECT id, kind, item, note, status, created_at FROM gifts WHERE user_id = ? ORDER BY created_at DESC').bind(u.id).all()).results } });
  }

  // ---------- магазин: вещи из коллекций за пуговки; цену и остаток задаёт Алина в кабинете ----------
  if (m === 'GET' && p === '/api/shop') {
    await ensurePrices(env, req);
    const rows = (await env.DB.prepare('SELECT kind, item, price, stock, added_at FROM shop').all()).results;
    return json({ items: rows.map(shopRow), max: RULES.shopMax, legendMax: RULES.legendMax, lvl: { low: STOCK.low, many: STOCK.many, lowLeg: STOCK.lowLeg, manyLeg: STOCK.manyLeg } }, 200, { 'cache-control': 'no-store' });
  }
  if (m === 'POST' && p === '/api/shop/buy') {
    const u = await needUser(req, env);
    if (!u.nick) fail(400, 'nick');
    const b = await req.json().catch(() => ({}));
    const kind = String(b.kind || ''), item = String(b.item || '');
    if (!GIFT_KINDS.includes(kind) || !item) fail(400, 'bad');
    const row = await env.DB.prepare('SELECT price, stock FROM shop WHERE kind = ? AND item = ?').bind(kind, item).first();
    if (!row || row.stock <= 0) fail(409, 'soldout');
    row.price = priceNow(kind, item, row.price, row.stock); // цена сейчас (категория × уровень цен × остаток; легендарные — как поставила Алина)
    if (b.price != null && Number(b.price) !== row.price) return json({ error: 'price', price: row.price }, 409); // пока смотрели — цена изменилась
    const sur = item === '?' || kind === 'any' ? await surpriseKI(env, req, u.id, kind, item) : null; // «🎲 Сюрприз» — случайная вещь, которой ещё нет
    if (sur === null && (item === '?' || kind === 'any')) fail(409, 'all');
    const gk = sur ? sur[0] : kind, got = sur ? sur[1] : item;
    if (!sur && await copies(env, u.id, kind, item) >= legMax(kind, item)) fail(409, 'limit'); // обычных — до 3 одинаковых, легендарных — 1
    if ((u.buttons || 0) < row.price) fail(402, 'poor');
    // остаток и пуговки списываем условно (если кто-то успел раньше — ничего не теряется)
    const s1 = await env.DB.prepare('UPDATE shop SET stock = stock - 1 WHERE kind = ? AND item = ? AND stock > 0').bind(kind, item).run();
    if (!s1.meta.changes) fail(409, 'soldout');
    const s2 = await env.DB.prepare('UPDATE users SET buttons = COALESCE(buttons, 0) - ? WHERE id = ? AND COALESCE(buttons, 0) >= ?').bind(row.price, u.id, row.price).run();
    if (!s2.meta.changes) { await env.DB.prepare('UPDATE shop SET stock = stock + 1 WHERE kind = ? AND item = ?').bind(kind, item).run(); fail(402, 'poor'); }
    const g = await env.DB.prepare("INSERT INTO gifts (user_id, kind, item, note, status, created_at, opened_at) VALUES (?, ?, ?, 'shop', 'bag', ?, ?)").bind(u.id, gk, got, now(), now()).run();
    await env.DB.prepare('INSERT OR IGNORE INTO button_log (user_id, kind, ref, amount, day, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(u.id, 'buy', String(g.meta.last_row_id), -row.price, rigaDay(), now()).run();
    return json({ ok: true, buttons: (u.buttons || 0) - row.price, kind: gk, item: got });
  }
  // ценность всех вещей: «выровнять» (вернуть рекомендуемую из каталога) или дороже/дешевле на pct %
  // % категории: 100 — обычная цена; цены всех вещей категории сразу пересчитываются
  if (m === 'POST' && p === '/api/admin/shop/cats') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    const b = await req.json().catch(() => ({}));
    const r = cleanRules({ ...RULES, catMult: { ...(RULES.catMult || {}), ...(b.mult || {}) } });
    await setMeta(env, 'rules', JSON.stringify(r)); rulesAt = 0; await loadRules(env);
    return json({ ok: true, catMult: RULES.catMult, items: (await env.DB.prepare('SELECT kind, item, price, stock, added_at FROM shop').all()).results.map(shopRow) });
  }
  if (m === 'POST' && p === '/api/admin/shop/reprice') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    const b = await req.json().catch(() => ({}));
    if (b.mode === 'reset') {
      const list = Object.entries((await catalog(env, req)).prices || {});
      const st = env.DB.prepare('INSERT INTO shop (kind, item, price, stock) VALUES (?, ?, ?, 0) ON CONFLICT(kind, item) DO UPDATE SET price = excluded.price');
      for (let i = 0; i < list.length; i += 50) await env.DB.batch(list.slice(i, i + 50).map(([k, pr]) => { const j = k.indexOf('|'); return st.bind(k.slice(0, j), k.slice(j + 1), pr); }));
    } else if (b.mode === 'up' || b.mode === 'down') {
      const pct = Math.max(1, Math.min(90, Math.round(Number(b.pct) || 10))), f = b.mode === 'up' ? 1 + pct / 100 : 1 - pct / 100;
      await env.DB.prepare('UPDATE shop SET price = MAX(5, CAST(ROUND(price * ? / 5.0) AS INTEGER) * 5) WHERE price > 0').bind(f).run();
    } else fail(400, 'bad');
    await gameUnit(env, true); // цены поменялись — награды игр пересчитать сразу
    return json({ ok: true });
  }
  // пополнить сразу много вещей (категорию, тему, найденное): +add штук каждой; у вещей без цены — цена price
  if (m === 'POST' && p === '/api/admin/shop/restock') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    const b = await req.json().catch(() => ({}));
    const add = Math.max(1, Math.min(10000, Math.floor(Number(b.add) || 0))), price = Math.max(0, Math.min(100000, Math.floor(Number(b.price) || 0)));
    await ensurePrices(env, req); const cp = (await catalog(env, req)).prices || {}; // у вещи без цены — её ценность из каталога
    const list = (Array.isArray(b.items) ? b.items : []).slice(0, 2000).filter(x => Array.isArray(x) && GIFT_KINDS.includes(String(x[0])) && x[1] && String(x[1]).length <= 40);
    if (!list.length || (!b.set && !(Number(b.add) > 0))) fail(400, 'bad');
    if (b.set) { // поставить остаток ровно [kind, item, n]
      await ensurePrices(env, req); const cp = (await catalog(env, req)).prices || {};
      const st = env.DB.prepare('INSERT INTO shop (kind, item, price, stock, added_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(kind, item) DO UPDATE SET added_at = CASE WHEN excluded.stock > shop.stock THEN excluded.added_at ELSE shop.added_at END, stock = excluded.stock'); // added_at — когда пополнили (для «сначала новые»)
      for (let i = 0; i < list.length; i += 50) await env.DB.batch(list.slice(i, i + 50).map(x => st.bind(String(x[0]), String(x[1]), cp[x[0] + '|' + x[1]] || 30, Math.max(0, Math.min(10000, Math.floor(Number(x[2]) || 0))), now())));
      return json({ ok: true, count: list.length, items: (await env.DB.prepare('SELECT kind, item, price, stock, added_at FROM shop').all()).results.map(shopRow) });
    }
    const st = env.DB.prepare('INSERT INTO shop (kind, item, price, stock, added_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(kind, item) DO UPDATE SET added_at = excluded.added_at, stock = MIN(100000, shop.stock + excluded.stock), price = CASE WHEN shop.price > 0 THEN shop.price ELSE excluded.price END');
    for (let i = 0; i < list.length; i += 50) await env.DB.batch(list.slice(i, i + 50).map(x => st.bind(String(x[0]), String(x[1]), cp[x[0] + '|' + x[1]] || price, add, now())));
    return json({ ok: true, count: list.length, items: (await env.DB.prepare('SELECT kind, item, price, stock, added_at FROM shop').all()).results.map(shopRow) });
  }
  if (p === '/api/admin/shop') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    if (m === 'POST') {
      const b = await req.json().catch(() => ({}));
      const kind = String(b.kind || ''), item = String(b.item || '');
      if (!GIFT_KINDS.includes(kind) || !item || item.length > 40) fail(400, 'bad');
      const posted = Math.max(0, Math.min(100000, Math.floor(Number(b.price) || 0))), stock = Math.max(0, Math.min(100000, Math.floor(Number(b.stock) || 0)));
      // цену задают только легендарным; у обычных ценность не меняется (цена считается сама)
      const old = isLeg(kind, item) ? null : await env.DB.prepare('SELECT price FROM shop WHERE kind = ? AND item = ?').bind(kind, item).first();
      const price = isLeg(kind, item) ? posted : old && old.price > 0 ? old.price : (CAT_P && CAT_P[kind + '|' + item]) || posted;
      await env.DB.prepare('INSERT INTO shop (kind, item, price, stock, added_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(kind, item) DO UPDATE SET added_at = CASE WHEN excluded.stock > shop.stock THEN excluded.added_at ELSE shop.added_at END, price = excluded.price, stock = excluded.stock').bind(kind, item, price, stock, now()).run();
      const row = shopRow({ kind, item, price, stock });
      return json({ ok: true, price, stock, base: row.base, now: row.price });
    }
    await ensurePrices(env, req);
    return json({ items: (await env.DB.prepare('SELECT kind, item, price, stock, added_at FROM shop').all()).results.map(shopRow), suggested: (await catalog(env, req)).prices || {}, economy: await env.DB.prepare('SELECT COALESCE(SUM(COALESCE(buttons, 0)), 0) AS total, COUNT(*) AS birds FROM users WHERE nick IS NOT NULL AND banned = 0').first(), pricing: { ...STOCK, priceMin: RULES.priceMin, priceMax: RULES.priceMax }, level: PLEVEL, catMult: RULES.catMult || {} });
  }
  // подарить купленную в магазине вещь другой птичке: вещь уходит из сумки и приходит ей неоткрытым подарком
  if (m === 'POST' && p === '/api/gift/give') {
    const u = await needUser(req, env);
    if (!u.nick) fail(400, 'nick');
    const b = await req.json().catch(() => ({}));
    const g = await env.DB.prepare("SELECT * FROM gifts WHERE id = ? AND user_id = ? AND status = 'bag'").bind(Number(b.id), u.id).first(); // любую вещь из сумки (раньше — только купленные)
    if (!g) fail(404, 'gift');
    if (LEGEND.has(g.kind + '|' + g.item)) fail(403, 'legend'); // легендарные не дарятся
    const to = await env.DB.prepare("SELECT id, nick FROM users WHERE nick = ? AND banned = 0 AND id != ?").bind(String(b.to || '').trim().replace(/^@/, ''), u.id).first();
    if (!to) fail(404, 'bird');
    if (await copies(env, to.id, g.kind, g.item) >= RULES.shopMax) fail(409, 'has'); // у получателя уже три таких
    await env.DB.prepare("UPDATE gifts SET user_id = ?, status = 'new', note = ?, created_at = ?, opened_at = NULL WHERE id = ?").bind(to.id, 'from:' + u.nick, now(), g.id).run();
    // если даритель носил эту вещь и другой такой у него нет — снять
    const a = avatarOf(u);
    if (a[g.kind] === g.item && !(await env.DB.prepare("SELECT 1 FROM gifts WHERE user_id = ? AND kind = ? AND item = ? AND status = 'bag'").bind(u.id, g.kind, g.item).first())) {
      delete a[g.kind]; await env.DB.prepare('UPDATE users SET avatar = ? WHERE id = ?').bind(JSON.stringify(a), u.id).run();
    }
    if (ROOM_KINDS.includes(g.kind)) await env.DB.prepare('UPDATE users SET room = ? WHERE id = ?').bind(JSON.stringify(cleanRoom(roomOf(u), await ownedRoom(env, u.id))), u.id).run();
    return json({ ok: true, to: to.nick, avatar: a });
  }
  // продать вещь обратно в магазин: цена одна для всех вещей (RULES.sellPrice), вещь возвращается в магазин (+1 к остатку); легендарные тоже можно
  if (m === 'POST' && p === '/api/gift/sell') {
    const u = await needUser(req, env);
    if (!u.nick) fail(400, 'nick');
    if (!RULES.sellOn) fail(403, 'off');
    const b = await req.json().catch(() => ({}));
    const g = await env.DB.prepare("SELECT * FROM gifts WHERE id = ? AND user_id = ? AND status = 'bag'").bind(Number(b.id), u.id).first();
    if (!g) fail(404, 'gift');
    const del = await env.DB.prepare("DELETE FROM gifts WHERE id = ? AND user_id = ? AND status = 'bag'").bind(g.id, u.id).run();
    if (!del.meta.changes) fail(404, 'gift');
    if (!gameOnly(g.kind, g.item)) await env.DB.prepare('INSERT INTO shop (kind, item, price, stock) VALUES (?, ?, ?, 1) ON CONFLICT(kind, item) DO UPDATE SET stock = MIN(100000, shop.stock + 1)').bind(g.kind, g.item, ((await catalog(env, req)).prices || {})[g.kind + '|' + g.item] || 30).run();
    const n = RULES.sellPrice;
    await env.DB.prepare('UPDATE users SET buttons = COALESCE(buttons, 0) + ? WHERE id = ?').bind(n, u.id).run();
    await env.DB.prepare('INSERT OR IGNORE INTO button_log (user_id, kind, ref, amount, day, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(u.id, 'sell', String(g.id), n, rigaDay(), now()).run();
    // если продал то, что было надето или стояло в комнате, и такой больше нет — снять/убрать
    const a = avatarOf(u);
    if (a[g.kind] === g.item && !(await env.DB.prepare("SELECT 1 FROM gifts WHERE user_id = ? AND kind = ? AND item = ? AND status = 'bag'").bind(u.id, g.kind, g.item).first())) {
      delete a[g.kind]; await env.DB.prepare('UPDATE users SET avatar = ? WHERE id = ?').bind(JSON.stringify(a), u.id).run();
    }
    if (ROOM_KINDS.includes(g.kind)) await env.DB.prepare('UPDATE users SET room = ? WHERE id = ?').bind(JSON.stringify(cleanRoom(roomOf(u), await ownedRoom(env, u.id))), u.id).run();
    return json({ ok: true, buttons: (u.buttons || 0) + n, avatar: a, got: n });
  }
  // птичка открыла конвертик с зарплатой — больше не показывать
  if (m === 'POST' && p === '/api/salary/seen') {
    const u = await needUser(req, env);
    await env.DB.prepare("UPDATE button_log SET seen = 1 WHERE user_id = ? AND kind = 'salary' AND seen = 0").bind(u.id).run();
    return json({ ok: true });
  }
  // админ: выдать зарплату всем птичкам (с ником, не заблокированным) — пуговки сразу на счёт, птичке при заходе — конвертик
  if (m === 'POST' && p === '/api/admin/salary') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    const b = await req.json().catch(() => ({}));
    const n = Math.floor(Number(b.amount) || 0);
    if (n < 1 || n > 10000) fail(400, 'bad');
    const ref = 'sal' + Date.now() + randomHex(2), who = 'nick IS NOT NULL AND banned = 0';
    const [ins] = await env.DB.batch([
      env.DB.prepare(`INSERT OR IGNORE INTO button_log (user_id, kind, ref, amount, day, created_at, seen) SELECT id, 'salary', ?, ?, ?, ?, 0 FROM users WHERE ${who}`).bind(ref, n, rigaDay(), now()),
      env.DB.prepare(`UPDATE users SET buttons = COALESCE(buttons, 0) + ? WHERE ${who} AND id IN (SELECT user_id FROM button_log WHERE kind = 'salary' AND ref = ?)`).bind(n, ref),
    ]);
    return json({ ok: true, count: ins.meta.changes, amount: n });
  }
  // админ: начислить всем за прошлые бейджи, рисунки и «Выбор Полли» (можно нажимать сколько угодно — повторно не начислит)
  if (m === 'POST' && p === '/api/admin/buttons-backfill') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    return json({ ok: true, ...(await backfillButtons(env)) });
  }
  // админ меняет пуговки птичке вручную (например, приз)
  if (m === 'POST' && p === '/api/admin/buttons') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    const b = await req.json().catch(() => ({}));
    const uid = Number(b.uid), amount = Math.floor(Number(b.amount) || 0);
    if (!uid || !amount || Math.abs(amount) > 100000) fail(400, 'bad');
    await env.DB.prepare('INSERT INTO button_log (user_id, kind, ref, amount, day, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(uid, 'admin', randomHex(6), amount, rigaDay(), now()).run();
    await env.DB.prepare('UPDATE users SET buttons = MAX(0, COALESCE(buttons, 0) + ?) WHERE id = ?').bind(amount, uid).run();
    return json({ ok: true });
  }

  // подарок: открыть и сразу надеть (use) или положить в сумку
  if (m === 'POST' && p === '/api/gift') {
    const u = await needUser(req, env);
    const b = await req.json().catch(() => ({}));
    const g = await env.DB.prepare('SELECT * FROM gifts WHERE id = ? AND user_id = ?').bind(Number(b.id), u.id).first();
    if (!g) fail(404, 'gift');
    await env.DB.prepare("UPDATE gifts SET status = 'bag', opened_at = COALESCE(opened_at, ?) WHERE id = ?").bind(now(), g.id).run();
    if (b.use && !ROOM_KINDS.includes(g.kind)) { const a = avatarOf(u); a[g.kind] = g.item; await env.DB.prepare('UPDATE users SET avatar = ? WHERE id = ?').bind(JSON.stringify(a), u.id).run(); }
    return json({ ok: true });
  }
  // надеть вещь из сумки (только свою) или снять (item: null)
  if (m === 'POST' && p === '/api/avatar') {
    const u = await needUser(req, env);
    const b = await req.json().catch(() => ({}));
    if (!GIFT_KINDS.includes(b.kind) || ROOM_KINDS.includes(b.kind)) fail(400, 'bad');
    const a = avatarOf(u);
    if (b.item == null) delete a[b.kind];
    else {
      const own = await env.DB.prepare("SELECT 1 FROM gifts WHERE user_id = ? AND kind = ? AND item = ? AND status = 'bag'").bind(u.id, b.kind, String(b.item)).first();
      if (!own) fail(403, 'notyours');
      a[b.kind] = String(b.item);
    }
    await env.DB.prepare('UPDATE users SET avatar = ? WHERE id = ?').bind(JSON.stringify(a), u.id).run();
    return json({ ok: true, avatar: a });
  }
  // что у птички уже есть (для окна подарка в кабинете)
  if (m === 'GET' && p === '/api/admin/gifts') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    return json({ gifts: (await env.DB.prepare('SELECT kind, item, status FROM gifts WHERE user_id = ?').bind(Number(url.searchParams.get('uid'))).all()).results });
  }
  // админ дарит вещь всем птичкам с ником (у кого уже максимум таких — пропускаем)
  if (m === 'POST' && p === '/api/admin/gift-all') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    const b = await req.json().catch(() => ({}));
    if (!okItem(b.kind, b.item)) fail(400, 'bad');
    if (b.item === '?' || b.kind === 'any') { // «🎲 Сюрприз»: каждой птичке своя случайная вещь, которой у неё ещё нет
      const users = (await env.DB.prepare("SELECT id FROM users WHERE banned = 0 AND nick IS NOT NULL AND nick != ''").all()).results;
      const stmts = [];
      for (const x of users) { const it = await surpriseKI(env, req, x.id, b.kind, b.item); if (it) stmts.push(env.DB.prepare('INSERT INTO gifts (user_id, kind, item, note, created_at) VALUES (?, ?, ?, ?, ?)').bind(x.id, it[0], it[1], String(b.note || '').slice(0, 200), now())); }
      for (let i = 0; i < stmts.length; i += 50) await env.DB.batch(stmts.slice(i, i + 50));
      return json({ ok: true, count: stmts.length });
    }
    const lim = legMax(b.kind, b.item);
    const r = await env.DB.prepare(`INSERT INTO gifts (user_id, kind, item, note, created_at) SELECT u.id, ?, ?, ?, ? FROM users u WHERE u.banned = 0 AND u.nick IS NOT NULL AND u.nick != ''
      AND (SELECT COUNT(*) FROM gifts g WHERE g.user_id = u.id AND g.kind = ? AND g.item = ? AND g.status IN ('bag', 'new')) < ?`)
      .bind(b.kind, String(b.item), String(b.note || '').slice(0, 200), now(), b.kind, String(b.item), lim).run();
    return json({ ok: true, count: r.meta.changes || 0 });
  }
  // админ дарит семечко
  if (m === 'POST' && p === '/api/admin/gift') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    const b = await req.json().catch(() => ({}));
    if (!okItem(b.kind, b.item)) fail(400, 'bad');
    const to = await env.DB.prepare('SELECT id FROM users WHERE id = ?').bind(Number(b.uid)).first();
    if (!to) fail(404, 'user');
    const sur = b.item === '?' || b.kind === 'any' ? await surpriseKI(env, req, to.id, b.kind, b.item) : [b.kind, String(b.item)];
    if (!sur) fail(409, 'all');
    await env.DB.prepare('INSERT INTO gifts (user_id, kind, item, note, created_at) VALUES (?, ?, ?, ?, ?)').bind(to.id, sur[0], sur[1], String(b.note || '').slice(0, 200), now()).run();
    return json({ ok: true, kind: sur[0], item: sur[1] });
  }
  if (m === 'POST' && p === '/api/nick') {
    const u = await needUser(req, env);
    const { nick, ref } = await req.json().catch(() => ({}));
    const n = String(nick || '').trim().replace(/^@/, '');
    if (!/^[\p{L}\p{N}_.-]{2,24}$/u.test(n)) fail(400, 'nick');
    const taken = await env.DB.prepare('SELECT id FROM users WHERE nick = ? AND id != ?').bind(n, u.id).first();
    if (taken) fail(409, 'taken');
    // друг, который пригласил: указывается один раз, при первом выборе ника; ему +20 пуговок
    const first = !u.nick && !u.referrer, rn = String(ref || '').trim().replace(/^@/, '');
    const friend = first && rn ? await env.DB.prepare('SELECT id FROM users WHERE nick = ? AND banned = 0 AND id != ?').bind(rn, u.id).first() : null;
    if (first && rn && !friend) fail(400, 'ref');
    await env.DB.prepare('UPDATE users SET nick = ?, referrer = COALESCE(referrer, ?) WHERE id = ?').bind(n, friend ? friend.id : null, u.id).run();
    if (friend) await award(env, friend.id, 'friend', u.id, BTN.friend);
    return json({ ok: true, nick: n });
  }

  if (m === 'POST' && p === '/api/upload') {
    const u = await needUser(req, env);
    if (!u.nick) fail(400, 'nick');
    const f = await req.formData();
    const full = f.get('image'), thumb = f.get('thumb'), day = String(f.get('day') || '');
    if (f.get('consent') === 'yes' && !u.consent) await env.DB.prepare('UPDATE users SET consent = 1 WHERE id = ?').bind(u.id).run();
    else if (!u.consent) fail(400, 'consent');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || dayNum(day) < utcToday() - 3 || dayNum(day) > utcToday() + 1) fail(400, 'day'); // сегодня, вчера, позавчера (с запасом на часовые пояса)
    if (!(full instanceof File) || !(thumb instanceof File)) fail(400, 'file');
    if (full.size > MAX_FULL || thumb.size > MAX_THUMB) fail(413, 'big');
    const fb = await full.arrayBuffer(), tb = await thumb.arrayBuffer();
    const isJpeg = b => { const a = new Uint8Array(b, 0, 3); return a[0] === 0xff && a[1] === 0xd8 && a[2] === 0xff; };
    if (!isJpeg(fb) || !isJpeg(tb)) fail(400, 'file');
    const old = await env.DB.prepare('SELECT id, store, kv FROM posts WHERE user_id = ? AND day = ?').bind(u.id, day).first();
    const id = randomHex(12);
    const where = await imgPut(env, id, fb, tb);
    if (old) {
      await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(old.id).run();
      await imgDelete(env, old);
    }
    if (!old) await bump(env, 'works_total', 'SELECT COUNT(*) + 1 AS n FROM posts'); // замена работы дня не считается
    const tod = Number(f.get('tod'));
    await env.DB.prepare('INSERT INTO posts (id, user_id, day, theme, bw, ai, tod, bytes, created_at, store, kv) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, u.id, day, String(f.get('theme') || '').slice(0, 120), f.get('bw') === '1' ? 1 : 0, f.get('ai') === '1' ? 1 : 0,
        Number.isInteger(tod) && tod >= 0 && tod < 1440 ? tod : null, fb.byteLength + tb.byteLength, now(), where.store, where.kv).run();
    // бейджи и рекорд записываем сразу — их не отнимет ни очистка, ни пропуск
    const months = [...new Set([...monthsOf(u), day.slice(0, 7)])].sort().slice(-24);
    const mc = mcountOf(u);
    if (!old) mc[day.slice(0, 7)] = (mc[day.slice(0, 7)] || 0) + 1; // замена работы дня не считается
    const mcount = Object.keys(mc).sort().slice(-48).map(k => `${k}:${mc[k]}`).join(',');
    const all = (await env.DB.prepare('SELECT day, bw, ai, tod FROM posts WHERE user_id = ?').bind(u.id).all()).results;
    const uu = { ...u, months: months.join(','), mcount };
    await env.DB.prepare('UPDATE users SET months = ?, mcount = ?, best = ?, badges = ? WHERE id = ?')
      .bind(uu.months, mcount, mergedBest(u, streakDays(all)), mergedBadges(uu, all).join(','), u.id).run();
    const earned = f.get('ai') === '1' && !RULES.aiUpload ? 0 : await award(env, u.id, 'upload', day, BTN.upload); // за работу с 🤖 — если разрешено в правилах
    return json({ ok: true, id, earned });
  }

  if (m === 'POST' && p === '/api/delete-post') {
    const u = await needUser(req, env);
    const { id } = await req.json().catch(() => ({}));
    const post = await env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(String(id)).first();
    if (!post || post.user_id !== u.id) fail(404, 'post');
    await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(post.id).run();
    await imgDelete(env, post);
    return json({ ok: true });
  }

  if (m === 'GET' && p === '/api/wall') {
    const before = Number(url.searchParams.get('before')) || 9e12;
    // фильтр стены (каждый выбирает себе): human — работы людей, ai — работы с пометкой 🤖, иначе все
    const wf = url.searchParams.get('f'), aiCond = wf === 'human' ? ' AND COALESCE(p.ai, 0) = 0' : wf === 'ai' ? ' AND p.ai > 0' : '';
    const rows = (await env.DB.prepare(`SELECT p.id, p.day, p.theme, p.bw, p.ai, p.created_at, u.nick, u.id AS uid, (COALESCE(u.picks, 0) >= ${GOLD_PICKS}) AS gold FROM posts p JOIN users u ON u.id = p.user_id
      WHERE p.hidden = 0${aiCond} AND u.banned = 0 AND u.nick IS NOT NULL AND p.created_at < ? ORDER BY p.created_at DESC LIMIT 24`).bind(before).all()).results;
    return json({ posts: rows, pick: await getMeta(env, 'pick_post') });
  }

  if (m === 'GET' && p === '/api/top') {
    const since = new Date((utcToday() - 1) * 864e5).toISOString().slice(0, 10);
    const active = (await env.DB.prepare(`SELECT DISTINCT p.user_id FROM posts p JOIN users u ON u.id = p.user_id
      WHERE p.day >= ? AND u.banned = 0 AND u.nick IS NOT NULL`).bind(since).all()).results.map(r => r.user_id);
    const top = [];
    for (const uid of active.slice(0, 500)) {
      const rows = (await env.DB.prepare('SELECT day, ai FROM posts WHERE user_id = ?').bind(uid).all()).results;
      const u = await env.DB.prepare('SELECT nick, best, picks FROM users WHERE id = ?').bind(uid).first();
      const days = streakDays(rows);
      top.push({ nick: u.nick, current: streaks(days).current, best: mergedBest(u, days), gold: (u.picks || 0) >= GOLD_PICKS });
    }
    top.sort((a, b) => b.current - a.current || b.best - a.best);
    const pickUser = Number(await getMeta(env, 'pick_user'));
    const pu = pickUser ? await env.DB.prepare('SELECT nick, picks FROM users WHERE id = ? AND banned = 0').bind(pickUser).first() : null;
    return json({ top: top.slice(0, 10), pick: pu?.nick || null, pickGold: (pu?.picks || 0) >= GOLD_PICKS });
  }

  const img = p.match(/^\/api\/img\/([0-9a-f]{24})$/);
  if (m === 'GET' && img) {
    const v = await imgGet(env, url.searchParams.get('t') ? 't' : 'i', img[1]);
    if (!v) return new Response('Not found', { status: 404 });
    return new Response(v, { headers: { 'content-type': 'image/jpeg', 'cache-control': 'public, max-age=31536000, immutable' } });
  }

  // ---------- GDPR: экспорт и удаление ----------
  if (m === 'GET' && p === '/api/export') {
    const u = await needUser(req, env);
    const posts = (await env.DB.prepare('SELECT id, day, theme, bw, ai, created_at, hidden FROM posts WHERE user_id = ?').bind(u.id).all()).results;
    const data = {
      exported_at: new Date().toISOString(),
      account: { nick: u.nick, email: u.email, google_account_id: u.sub, consent_to_publish: !!u.consent, created_at: new Date(u.created_at * 1000).toISOString() },
      posts: posts.map(x => ({ ...x, image: `${url.origin}/api/img/${x.id}`, created_at: new Date(x.created_at * 1000).toISOString() })),
    };
    return new Response(JSON.stringify(data, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8', 'content-disposition': 'attachment; filename="pigeonpolly-my-data.json"', 'cache-control': 'no-store' } });
  }

  if (m === 'POST' && p === '/api/delete-account') {
    const u = await currentUser(req, env);
    if (!u) fail(401, 'login');
    const posts = (await env.DB.prepare('SELECT id, store, kv FROM posts WHERE user_id = ?').bind(u.id).all()).results;
    await Promise.all(posts.map(x => imgDelete(env, x)));
    if (env.MEDIA) await env.MEDIA.delete(`birdcards/${u.id}.png`).catch(() => {});
    await env.DB.batch([
      env.DB.prepare('DELETE FROM posts WHERE user_id = ?').bind(u.id),
      env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(u.id),
      env.DB.prepare('DELETE FROM button_log WHERE user_id = ?').bind(u.id),
      env.DB.prepare('DELETE FROM users WHERE id = ?').bind(u.id),
    ]);
    return json({ ok: true }, 200, { 'set-cookie': sessionCookie('', 0) });
  }

  // ---------- модерация ----------
  if (m === 'POST' && p === '/api/admin/pick') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    const { id, undo } = await req.json().catch(() => ({}));
    const prev = Number(await getMeta(env, 'pick_user'));
    if (undo) { // снять «Выбор Полли»: у владельца бейдж становится чёрно-белым
      if (prev) await addBadge(env, prev, 'pick_past');
      await env.DB.prepare("DELETE FROM meta WHERE key IN ('pick_post', 'pick_user')").run();
      return json({ ok: true });
    }
    const post = await env.DB.prepare('SELECT id, user_id, picked FROM posts WHERE id = ?').bind(String(id)).first();
    if (!post) fail(404, 'post');
    if (!post.picked) await env.DB.batch([
      env.DB.prepare('UPDATE posts SET picked = 1 WHERE id = ?').bind(post.id),
      env.DB.prepare('UPDATE users SET picks = COALESCE(picks, 0) + 1 WHERE id = ?').bind(post.user_id),
    ]);
    if (prev && prev !== post.user_id) await addBadge(env, prev, 'pick_past');
    await setMeta(env, 'pick_post', post.id);
    await setMeta(env, 'pick_user', String(post.user_id));
    await award(env, post.user_id, 'pick', post.id, BTN.pick); // +11 пуговок за «Выбор Полли» (один раз за каждую выбранную работу; снятие и передача их не отнимают)
    return json({ ok: true });
  }

  // ---------- кабинет: правила сайта (читать и менять) ----------
  // кнопка «Пополнить сейчас» — то же, что ежедневное пополнение
  if (m === 'POST' && p === '/api/admin/shop/autorestock') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    return json({ ok: true, ...(await autoRestock(env, true)) });
  }
  if (m === 'GET' && p === '/api/admin/autopilot') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    return json({ auto: await autopilot(env, req) });
  }
  if (p === '/api/admin/rules') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    if (m === 'POST') {
      const b = await req.json().catch(() => ({}));
      const r = b.reset ? cleanRules(null) : cleanRules(b.rules);
      await setMeta(env, 'rules', JSON.stringify(r)); rulesAt = 0; await loadRules(env);
    }
    return json({ rules: RULES, defaults: RULE_DEFAULTS, stock: STOCK, gamePrices: gamePrices(await gameUnit(env)), btn: BTN, auto: await autopilot(env, req), restockLast: parseJ(await getMeta(env, 'restock_last'), null), special: ADVENT_SPECIAL, goldPicks: GOLD_PICKS });
  }
  // Алина помечает чужую работу как ИИ (ai = 2) или снимает пометку; бейдж «Бип-буп» за это не даётся
  if (m === 'POST' && p === '/api/admin/ai') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    const { id, ai } = await req.json().catch(() => ({}));
    await env.DB.prepare('UPDATE posts SET ai = CASE WHEN ? THEN (CASE WHEN ai = 1 THEN 1 ELSE 2 END) ELSE 0 END WHERE id = ?').bind(ai ? 1 : 0, String(id)).run();
    return json({ ok: true });
  }
  if (m === 'POST' && (p === '/api/admin/hide' || p === '/api/admin/ban')) {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    const { id, uid, undo } = await req.json().catch(() => ({}));
    if (p === '/api/admin/hide') await env.DB.prepare('UPDATE posts SET hidden = ? WHERE id = ?').bind(undo ? 0 : 1, String(id)).run();
    else {
      await env.DB.prepare('UPDATE users SET banned = ? WHERE id = ?').bind(undo ? 0 : 1, Number(uid)).run();
      if (!undo) await env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(Number(uid)).run();
    }
    return json({ ok: true });
  }

  return json({ error: 'not_found' }, 404);
}
