// Кабинет → «🎬 Видео и гайды» (site/assets/guides-admin.js, docs/admin.md): Алина сама добавляет видеоуроки YouTube
// (бесплатные или VIP — только вошедшим) и гайды/книги (ссылка + обложка). Список — meta.v2_guides (JSON, новое первым).
// Сайт: GET /api/v2/guides → /learn/, /guides/, главная (site/assets/v2.js); VIP — ещё и в /api/v2/vip (кабинет ученика cabinet.js).
// h: json, fail, needUser, currentUser, isAdmin, getMeta, setMeta, imgPut, imgDrop(id), randomHex, now, translate(texts, from, langs)
const KEY = 'v2_guides', LANGS = ['en', 'ru', 'lv'], MAX = 200;

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
const cover = x => x.img ? `/api/img/${x.img}?t=1` : x.pic ? x.pic : x.kind === 'video' && x.yt ? `https://i.ytimg.com/vi/${x.yt}/hqdefault.jpg` : '';
// для сайта: VIP-ссылка YouTube — только вошедшим (как /api/v2/vip)
export const guideOut = (x, open) => ({ id: x.id, kind: x.kind, vip: x.vip ? 1 : 0, soon: x.soon ? 1 : 0, t: x.t || {}, d: x.d || {}, cover: cover(x),
  ...(x.kind === 'video' ? (x.vip && !open ? {} : { yt: x.yt }) : { url: x.url }), at: x.at });

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
    return h.json({ items, open: open ? 1 : 0 }, 200, { 'cache-control': 'no-store' });
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
  const kind = (old && old.kind) || (f.get('kind') === 'book' ? 'book' : 'video');
  const link = cut(f.get('url'), 500), x = { ...(old || { id: h.randomHex(6), kind, at: h.now() }) };
  if (kind === 'video') {
    x.soon = f.get('soon') === '1' ? 1 : 0; // «скоро»: видео ещё нет — ссылка не обязательна
    x.yt = ytId(link); if (!x.yt && !(x.soon && !link)) h.fail(400, 'yt');
    x.vip = f.get('vip') === '1' ? 1 : 0;
  } else {
    x.soon = f.get('soon') === '1' ? 1 : 0; // «скоро»: книга ещё не вышла — ссылка не обязательна
    if (link ? !okUrl(link) : !x.soon) h.fail(400, 'url');
    x.url = link; x.free = f.get('free') === '1' ? 1 : 0;
  }
  const t = {}; for (const l of LANGS) t[l] = cut(f.get('t_' + l), 120);
  const src = LANGS.find(l => t[l]) || '';
  if ((kind === 'book' || x.soon) && !src) h.fail(400, 'title');
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
  if (kind === 'book' && !x.img) h.fail(400, 'cover');
  if (old) list[at] = x; else { list.unshift(x); list = list.slice(0, MAX); }
  await h.setMeta(KEY, JSON.stringify(list));
  return out();
}
