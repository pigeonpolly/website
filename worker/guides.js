// Кабинет → «🎬 Видео и гайды» (site/assets/guides-admin.js, docs/admin.md): Алина сама добавляет видеоуроки YouTube
// (бесплатные или VIP — только вошедшим) и гайды/книги (ссылка + обложка). Список — meta.v2_guides (JSON, новое первым).
// Сайт: GET /api/v2/guides → /learn/, /guides/, главная (site/assets/v2.js); VIP — ещё и в /api/v2/vip (кабинет ученика cabinet.js).
// h: json, fail, needUser, currentUser, isAdmin, getMeta, setMeta, imgPut, imgDrop(id), randomHex, now, translate(texts, from, langs)
const KEY = 'v2_guides', LANGS = ['en', 'ru', 'lv'], MAX = 200;
// «✓ Просмотрено» у вошедшего — в профиле: users.yt_seen = id YouTube через запятую (последние SEEN_MAX); у гостя — в браузере (v2.js)
export const GUIDES_ALTER = ["ALTER TABLE users ADD COLUMN yt_seen TEXT DEFAULT ''"];
const SEEN_MAX = 500;
const seenOf = u => String((u && u.yt_seen) || '').split(',').filter(s => /^[\w-]{11}$/.test(s));

export const ytId = s => {
  s = String(s || '').trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtu\.be\/|[?&]v=|\/(?:shorts|embed|live|v)\/)([\w-]{11})/);
  return m ? m[1] : '';
};
const okUrl = s => /^https?:\/\/[^\s"'<>]+$/i.test(s) || /^\/[^\s"'<>]*$/.test(s);
const cut = (s, n) => String(s || '').trim().slice(0, n);

export async function guidesList(h) {
  try { const a = JSON.parse(await h.getMeta(KEY) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; }
}
// «Как нарисовать» (kind howto): страницы-картинки или один PDF в R2 howto/<id>/<n>.jpg | guide.pdf, отдаёт GET /api/v2/howto/<id>/<файл>
const HOWTO_MAX = 40, PDF_MAX = 25e6, PAGE_MAX = 4e6;
const hwUrl = (x, f) => `/api/v2/howto/${x.id}/${f}?v=${x.fv || 0}`;
const hwFiles = x => x.kind !== 'howto' ? [] : x.pdf ? ['guide.pdf'] : Array.from({ length: x.pages || 0 }, (_, i) => (i + 1) + '.jpg');
async function hwDrop(env, x) { const k = hwFiles(x).map(f => `howto/${x.id}/${f}`); if (k.length && env.MEDIA) await env.MEDIA.delete(k); }
// собранная в конструкторе (кабинет → «🧩 Конструктор шпаргалок», cheatsheet-admin.js): x.built = 1, x.blocks = [{ id, k, w, t: {en,ru,lv}, img }]
// k: h заголовок · p текст · img картинка с подписью · step шаг (картинка + текст, номер сам) · tip совет-наклейка · list список (строки); w: full | half
// картинки блоков — /api/img/<id> (imgPut), всегда на 3 языках (langs = en ru lv)
const BK = ['h', 'p', 'img', 'step', 'tip', 'list'], BMAX = 40, BTXT = 2000;
const bImg = x => ((x.blocks || []).find(b => b.img) || {}).img;
const langsOf = v => LANGS.filter(l => String(v || '').split(/[\s,]+/).includes(l));
const cover = x => x.img ? `/api/img/${x.img}?t=1` : x.built && bImg(x) ? `/api/img/${bImg(x)}?t=1` : x.kind === 'howto' && x.pages && !x.pdf ? hwUrl(x, '1.jpg') : x.pic ? x.pic : x.kind === 'video' && x.yt ? `https://i.ytimg.com/vi/${x.yt}/hqdefault.jpg` : '';
// для сайта: VIP-ссылка YouTube — только вошедшим (как /api/v2/vip)
// langs — на каких языках видео / шпаргалка (фильтр «Язык» на /learn/); у собранных — всегда все три
export const guideOut = (x, open) => ({ id: x.id, kind: x.kind, vip: x.vip ? 1 : 0, soon: x.soon ? 1 : 0, t: x.t || {}, d: x.d || {}, cover: cover(x), langs: x.built ? LANGS : x.langs || [],
  ...(x.kind === 'video' ? (x.vip && !open ? {} : { yt: x.yt }) : x.built ? { built: 1, blocks: x.vip && !open ? [] : (x.blocks || []).map(b => ({ k: b.k, w: b.w, t: b.t || {}, ...(b.img ? { img: `/api/img/${b.img}` } : {}) })) }
  : x.kind === 'howto' ? { files: x.vip && !open ? [] : hwFiles(x).map(f => hwUrl(x, f)), pdf: x.pdf ? 1 : 0, pages: x.pages || 0 } : { url: x.url }), at: x.at });

// встроенные (были на сайте до кабинета): один раз дописываются в конец списка (метка meta v2_guides_base),
// дальше их можно править, скрывать и удалять в кабинете, как добавленные; названия бесплатных — с YouTube (v2.js ytName)
const BASE = [
  { id: 'b-cafe', kind: 'video', yt: 'eRa1uB_7s9U', at: 1 },
  { id: 'b-pepper', kind: 'video', yt: 'VVvLZcIqUbM', at: 1 },
  { id: 'review', kind: 'video', vip: 1, yt: 'PaypNmVZFOw', pic: '/images/v2/lesson-szmal.jpg', at: 1, t: { en: 'Watercolour review', ru: 'Обзор акварели', lv: 'Akvareļu apskats' } },
];
async function withBase(h) {
  const list = await guidesList(h);
  if (await h.getMeta(KEY + '_base') === '1') return list;
  for (const b of BASE) if (!list.some(x => x.id === b.id || (x.kind === 'video' && x.yt === b.yt))) list.push({ ...b });
  await h.setMeta(KEY, JSON.stringify(list)); await h.setMeta(KEY + '_base', '1');
  return list;
}
export async function guidesApi(req, env, url, h) {
  const p = url.pathname, m = req.method;
  if (p === '/api/v2/guides' && m === 'GET') {
    const u = await h.currentUser(req, env), open = !!(u && !u.banned);
    const items = (await withBase(h)).filter(x => !x.hidden).map(x => guideOut(x, open));
    return h.json({ items, open: open ? 1 : 0, ...(open ? { seen: seenOf(u) } : {}) }, 200, { 'cache-control': 'no-store' });
  }
  // отметить / снять «просмотрено»: {add: [id YouTube], del: [...]}; add — ещё и перенос отметок гостя после входа
  // файлы гайдов «Как нарисовать» — всем (как картинки сайта)
  const hm = p.match(/^\/api\/v2\/howto\/([\w]+)\/(\d+\.jpg|guide\.pdf)$/);
  if (hm && m === 'GET') {
    const o = env.MEDIA && await env.MEDIA.get(`howto/${hm[1]}/${hm[2]}`);
    if (!o) h.fail(404, 'none');
    return new Response(o.body, { headers: { 'content-type': hm[2].endsWith('.pdf') ? 'application/pdf' : 'image/jpeg', 'cache-control': 'public, max-age=86400' } });
  }
  if (p === '/api/v2/seen' && m === 'POST') {
    const u = await h.needUser(req, env); if (u.banned) h.fail(403, 'banned');
    const b = await req.json().catch(() => ({})), ok = a => (Array.isArray(a) ? a : []).map(String).filter(s => /^[\w-]{11}$/.test(s)).slice(0, SEEN_MAX);
    const del = new Set(ok(b.del)), add = ok(b.add).filter(s => !del.has(s));
    const set = new Set(seenOf(u).filter(s => !del.has(s) && !add.includes(s)));
    for (const s of add) set.add(s);
    const seen = [...set].slice(-SEEN_MAX);
    await h.db.prepare('UPDATE users SET yt_seen = ? WHERE id = ?').bind(seen.join(','), u.id).run();
    return h.json({ seen }, 200, { 'cache-control': 'no-store' });
  }
  if (p !== '/api/admin/guides') return null;
  const u = await h.needUser(req, env); if (!(await h.isAdmin(u, env))) h.fail(403, 'admin');
  let list = await withBase(h);
  const out = () => h.json({ items: list.map(x => ({ ...x, cover: cover(x) })) });
  if (m === 'GET') return out();
  if (m !== 'POST') h.fail(405, 'method');
  const f = await req.formData().catch(() => null); if (!f) h.fail(400, 'form');
  const act = String(f.get('act') || ''), id = String(f.get('id') || '');
  const at = list.findIndex(x => x.id === id);
  if (act === 'del') {
    if (at < 0) h.fail(404, 'none');
    const [x] = list.splice(at, 1);
    await h.setMeta(KEY, JSON.stringify(list));
    if (x.img) await h.imgDrop(x.img).catch(() => {});
    for (const b of x.blocks || []) if (b.img) await h.imgDrop(b.img).catch(() => {});
    await hwDrop(env, x).catch(() => {});
    return out();
  }
  if (act === 'hide') { if (at < 0) h.fail(404, 'none'); list[at].hidden = list[at].hidden ? 0 : 1; await h.setMeta(KEY, JSON.stringify(list)); return out(); }
  if (act === 'up' || act === 'down') {
    if (at < 0) h.fail(404, 'none');
    const to = at + (act === 'up' ? -1 : 1);
    if (to >= 0 && to < list.length) { [list[at], list[to]] = [list[to], list[at]]; await h.setMeta(KEY, JSON.stringify(list)); }
    return out();
  }
  if (act !== 'save') h.fail(400, 'act');
  // новое или правка: вид, ссылка, название (язык, на котором написано, + перевод на остальные), обложка
  const old = at >= 0 ? list[at] : null;
  const kind = (old && old.kind) || (['book', 'howto'].includes(f.get('kind')) ? f.get('kind') : 'video');
  const built = old ? !!old.built : kind === 'howto' && f.get('built') === '1';
  let dropImgs = [];
  const link = cut(f.get('url'), 500), x = { ...(old || { id: h.randomHex(6), kind, at: h.now() }) };
  if (kind === 'video') {
    x.soon = f.get('soon') === '1' ? 1 : 0; // «скоро»: видео ещё нет — ссылка не обязательна
    x.yt = ytId(link); if (!x.yt && !(x.soon && !link)) h.fail(400, 'yt');
    x.vip = f.get('vip') === '1' ? 1 : 0;
    x.langs = langsOf(f.get('langs'));
  } else if (built) { // конструктор: блоки (JSON) + новые картинки блоков файлами bi_<id> (полная) и bt_<id> (превью)
    x.soon = 0; x.vip = f.get('vip') === '1' ? 1 : 0; x.built = 1; x.pages = 0; x.pdf = 0; x.langs = LANGS;
    x.hidden = f.get('draft') === '1' ? 1 : 0; // черновик — на сайте не видно
    let raw; try { raw = JSON.parse(f.get('blocks') || '[]'); } catch (e) { raw = null; }
    if (!Array.isArray(raw)) h.fail(400, 'blocks');
    const had = new Set((old && old.blocks || []).map(b => b.img).filter(Boolean)), blocks = [];
    for (const r of raw.slice(0, BMAX)) {
      if (!r || !BK.includes(r.k)) continue;
      const b = { id: /^[\w]{1,16}$/.test(r.id) ? r.id : h.randomHex(4), k: r.k, w: r.w === 'half' ? 'half' : 'full', t: {} };
      for (const l of LANGS) b.t[l] = cut((r.t || {})[l], BTXT);
      const fb = f.get('bi_' + b.id), tb = f.get('bt_' + b.id);
      if (fb && typeof fb === 'object' && fb.size) {
        if (fb.size > 4e6) h.fail(400, 'img');
        const id = h.randomHex(12), full = await fb.arrayBuffer();
        await h.imgPut(env, id, full, tb && typeof tb === 'object' && tb.size ? await tb.arrayBuffer() : full);
        b.img = id;
      } else if (r.img && had.has(r.img)) b.img = r.img;
      if (b.img || LANGS.some(l => b.t[l])) blocks.push(b);
    }
    if (!blocks.length) h.fail(400, 'blocks');
    // перевод недостающего: язык, на котором писала Алина (src), → остальные, одним заходом на язык
    const bsrc = LANGS.includes(f.get('src')) ? f.get('src') : 'ru';
    const miss = LANGS.filter(l => l !== bsrc && blocks.some(b => b.t[bsrc] && !b.t[l]));
    if (miss.length) {
      const todo = blocks.filter(b => b.t[bsrc]);
      const r = await h.translate(todo.map(b => b.t[bsrc]), bsrc, miss).catch(() => ({ tr: {} }));
      for (const l of miss) todo.forEach((b, i) => { if (!b.t[l]) b.t[l] = cut(((r.tr || {})[l] || [])[i], BTXT) || b.t[bsrc]; });
    }
    for (const b of blocks) for (const l of LANGS) if (!b.t[l]) delete b.t[l];
    const keep = new Set(blocks.map(b => b.img).filter(Boolean));
    dropImgs = [...had].filter(i => !keep.has(i)); // старые картинки, которых больше нет, — после сохранения
    x.blocks = blocks;
  } else if (kind === 'howto') {
    x.soon = 0; x.vip = f.get('vip') === '1' ? 1 : 0; x.langs = langsOf(f.get('langs'));
    // новые файлы заменяют старые целиком: картинки (страницы по порядку, JPEG из кабинета) или один PDF
    const fs = f.getAll('page').filter(v => v && typeof v === 'object' && v.size), pdf = fs.find(v => /pdf/i.test(v.type || '') || /\.pdf$/i.test(v.name || ''));
    if (fs.length) {
      if (!env.MEDIA) h.fail(500, 'storage');
      const cv = f.get('cover'); if (pdf && !x.img && !(cv && typeof cv === 'object' && cv.size)) h.fail(400, 'cover'); // до записи файлов
      if (pdf ? pdf.size > PDF_MAX : fs.length > HOWTO_MAX || fs.some(v => v.size > PAGE_MAX)) h.fail(400, 'big');
      if (old) await hwDrop(env, old).catch(() => {});
      const meta = ct => ({ httpMetadata: { contentType: ct } });
      if (pdf) { await env.MEDIA.put(`howto/${x.id}/guide.pdf`, await pdf.arrayBuffer(), meta('application/pdf')); x.pdf = 1; x.pages = 0; }
      else { for (let i = 0; i < fs.length; i++) await env.MEDIA.put(`howto/${x.id}/${i + 1}.jpg`, await fs[i].arrayBuffer(), meta('image/jpeg')); x.pdf = 0; x.pages = fs.length; }
      x.fv = (x.fv || 0) + 1;
    }
    if (!x.pdf && !x.pages) h.fail(400, 'pages');
  } else {
    x.soon = f.get('soon') === '1' ? 1 : 0; // «скоро»: книга ещё не вышла — ссылка не обязательна
    if (link ? !okUrl(link) : !x.soon) h.fail(400, 'url');
    x.url = link; x.free = f.get('free') === '1' ? 1 : 0;
  }
  const t = {}; for (const l of LANGS) t[l] = cut(f.get('t_' + l), 120);
  const src = LANGS.find(l => t[l]) || '';
  if ((kind !== 'video' || x.soon) && !src) h.fail(400, 'title');
  const need = LANGS.filter(l => !t[l]);
  if (src && need.length) {
    const r = await h.translate([t[src]], src, need).catch(() => ({ tr: {} }));
    for (const l of need) t[l] = cut(((r.tr || {})[l] || [])[0], 120) || t[src];
  }
  x.t = t;
  // описание (необязательно): на странице видео /learn/v/<id>/ — тоже переводится на остальные языки
  const d = {}; for (const l of LANGS) d[l] = cut(f.get('d_' + l), 3000);
  const dsrc = LANGS.find(l => d[l]), dneed = LANGS.filter(l => !d[l]);
  if (dsrc && dneed.length) {
    const r = await h.translate([d[dsrc]], dsrc, dneed).catch(() => ({ tr: {} }));
    for (const l of dneed) d[l] = cut(((r.tr || {})[l] || [])[0], 3000) || d[dsrc];
  }
  if (dsrc) x.d = d; else delete x.d;
  const pic = f.get('cover');
  if (pic && typeof pic === 'object' && pic.size) {
    if (pic.size > 3e6) h.fail(400, 'img');
    const img = h.randomHex(12), buf = await pic.arrayBuffer();
    await h.imgPut(env, img, buf, buf);
    if (x.img) await h.imgDrop(x.img).catch(() => {});
    x.img = img;
  } else if (f.get('nocover') === '1' && x.img) { await h.imgDrop(x.img).catch(() => {}); delete x.img; }
  if ((kind === 'book' || (kind === 'howto' && x.pdf)) && !x.img) h.fail(400, 'cover');
  if (old) list[at] = x; else { list.unshift(x); list = list.slice(0, MAX); }
  await h.setMeta(KEY, JSON.stringify(list));
  for (const i of dropImgs) await h.imgDrop(i).catch(() => {});
  return out();
}
