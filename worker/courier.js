// «Art Coo-rier: World News» — выпуск новостей искусства одной кнопкой в редакторе блога (docs/blog.md «Art Coo-rier»).
// Два шага (лимиты Cloudflare на один запрос): POST /api/blog/admin/courier {step:'src'} — ленты за ~48 ч → Gemini выбирает 6–8 новостей →
// worker дочитывает статьи и копирует картинки в R2 (meta courier_src); {step:'write'} — Gemini пишет выпуск голосом Алины →
// черновик в blog_posts (только RU, раздел courierSlug). Ссылки и картинки берём из своих данных, не от Gemini. Использованные ссылки — meta courier_used (300).
import { feed, article, ask, commons, GN } from './avis.js';
import { courierSlug, cleanHtml, rehostOne } from './blog.js';

const FEEDS = [
  ['The Art Newspaper', 'https://www.theartnewspaper.com/rss.xml'],
  ['Artnet News', 'https://news.artnet.com/feed'],
  ['Hyperallergic', 'https://hyperallergic.com/feed/'],
  ['ARTnews', 'https://www.artnews.com/feed/'],
  ['Colossal', 'https://www.thisiscolossal.com/feed/'],
  ['The Guardian', 'https://www.theguardian.com/artanddesign/rss'],
  ['Smithsonian Magazine', 'https://www.smithsonianmag.com/rss/arts-culture/'],
  ['designboom', 'https://www.designboom.com/art/feed/'],
  ['Apollo', 'https://www.apollo-magazine.com/feed/'],
];
const GN_ART = GN('art exhibition OR museum OR artist OR painting'); // запасной: если в профильных лентах мало свежего
const PICK_N = 8, MIN_N = 4, KEEP_USED = 300, PER_SRC = 8, HOURS = 48;
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const rigaDay = (t = Date.now()) => new Date(t).toLocaleDateString('sv-SE', { timeZone: 'Europe/Riga' });
const ruDate = day => { const [, m, d] = day.split('-').map(Number); return `${d} ${MONTHS[m - 1]}`; };
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const strip = s => String(s || '').replace(/\[\[[\s\S]*?\]\]/g, '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const parseJ = (s, d) => { try { return JSON.parse(s) ?? d; } catch (e) { return d; } };
const normLink = u => String(u || '').replace(/[?#].*$/, '').replace(/\/$/, '').toLowerCase();

// ---------- шаг 1: ленты → кандидаты ----------
export async function collectNews(used = new Set(), now = Date.now()) {
  const since = now - HOURS * 3600000;
  const fresh = x => (!x.when || x.when >= since) && !used.has(normLink(x.link));
  const lists = await Promise.all(FEEDS.map(([name, url]) => feed(url).then(l => l.filter(fresh).slice(0, PER_SRC).map(x => ({ ...x, src: name }))).catch(() => [])));
  let all = lists.flat();
  if (all.length < 12) all = all.concat((await feed(GN_ART).catch(() => [])).filter(fresh).slice(0, 15));
  const seen = new Set();
  return all.filter(x => { const k = x.title.toLowerCase().replace(/\W+/g, ' ').slice(0, 60); if (seen.has(k)) return false; seen.add(k); return true; })
    .sort((a, b) => (b.when || 0) - (a.when || 0)).slice(0, 70);
}

const PICK_SCHEMA = { type: 'OBJECT', required: ['picks'], properties: { picks: { type: 'ARRAY', items: { type: 'OBJECT', required: ['i', 'q'], properties: { i: { type: 'INTEGER' }, q: { type: 'STRING' } } } } } };
const pickPrompt = list => `You are the editor of "Art Coo-rier", a daily digest of world ART news for the blog of an artist from Riga.
From the numbered list of fresh news (last 48 hours) choose the ${PICK_N} most interesting and important stories for people who love art and drawing:
exhibitions, museums, discoveries, restorations, artists, auctions, street art, illustration, design, art history finds.
Make the issue diverse: different countries and continents, different topics, at most 2 stories from one source; no duplicates of the same story;
skip pure business gossip, obituaries without art content, sponsored posts, listicles and event calendars.
For each chosen story give its number "i" and "q" — a short English search query (2–4 words, e.g. artist + artwork or museum name) for a free photo on Wikimedia Commons.

${list.map((x, i) => `${i}. [${x.src}] ${x.title}${x.desc ? ' — ' + x.desc.slice(0, 220) : ''}`).join('\n')}`;

async function picture(env, it, q, moved) { // своя копия картинки в R2: og:image → картинка из RSS → Wikimedia Commons; ничего — без картинки
  for (const u of [it.og, it.img].filter(Boolean)) {
    const local = await rehostOne(env, u, moved);
    if (local) return { img: local, credit: it.src, photo: '' };
  }
  const c = await commons(q).catch(() => ({}));
  if (c.img) { const local = await rehostOne(env, c.img, moved); if (local) return { img: local, credit: 'Wikimedia Commons', photo: c.photo || '' }; }
  return { img: '', credit: '', photo: '' };
}

async function stepSrc(env, h) {
  const used = new Set(parseJ(await h.getMeta('courier_used'), []));
  const list = await collectNews(used);
  if (list.length < MIN_N) h.fail(502, 'no_news');
  const out = await ask(env, pickPrompt(list), PICK_SCHEMA, o => Array.isArray(o.picks) && o.picks.filter(p => list[p.i]).length >= Math.min(MIN_N, list.length), 0.3);
  const picks = [], took = new Set();
  for (const p of out.picks) if (list[p.i] && !took.has(p.i) && picks.length < PICK_N) { took.add(p.i); picks.push({ ...list[p.i], q: String(p.q || '').slice(0, 80) }); }
  const items = await Promise.all(picks.map(async it => {
    const a = await article(it.link).catch(() => ({ text: '', img: '' }));
    const pic = await picture(env, { ...it, og: a.img }, it.q, {}); // свой кэш у каждой: общий при параллельной загрузке отдаёт null
    return { title: it.title, src: it.src, link: it.link, when: it.when, desc: it.desc, text: (a.text || '').slice(0, 3000), ...pic };
  }));
  const day = rigaDay();
  await h.setMeta('courier_src', JSON.stringify({ day, at: Date.now(), items }));
  return { ok: true, n: items.length, pics: items.filter(x => x.img).length };
}

// ---------- шаг 2: Gemini пишет выпуск → черновик ----------
const TXT = { type: 'STRING' }, BLOCK = { type: 'OBJECT', required: ['h', 'text'], properties: { h: TXT, text: TXT } };
const WRITE_SCHEMA = { type: 'OBJECT', required: ['intro', 'd_ru', 'items', 'facts', 'history', 'joke'], properties: {
  intro: TXT, d_ru: TXT,
  items: { type: 'ARRAY', items: { type: 'OBJECT', required: ['i', 'h', 'p'], properties: { i: { type: 'INTEGER' }, h: TXT, p: { type: 'ARRAY', items: TXT } } } },
  facts: { type: 'ARRAY', items: BLOCK }, history: BLOCK, joke: TXT } };
const writePrompt = (day, items, samples) => `Write today's issue of "Art Coo-rier" — a digest of world art news for the blog of Alina Otkinska, an artist and learning experience designer from Riga. Date: ${ruDate(day)} ${day.slice(0, 4)}.
LANGUAGE: Russian. VOICE: Alina's — warm, lively, curious, addressing the reader as «ты»; but it is an art NEWS digest, not chatter: clear facts first, a light personal touch at most once per story.
STRICT RULE: Russian WITHOUT grammatical gender of the author or the reader — never write forms like «я сделала», «я рад», «ты открыл», «ты увидела»; use present tense, «мне кажется», «хочется», «стоит посмотреть», «ты можешь», impersonal phrases.
FACTS: retell only what is in the source text below — no invented names, numbers, dates, quotes or places. If the text is short, write less. Keep names of artists, museums and works correct (Russian transliteration, original in brackets once if helpful).
Return JSON:
- intro: 2–3 sentences: greeting, the date, what is in today's issue (mention 2–3 highlights).
- d_ru: one short description of the issue for the blog list (max 160 chars).
- items: for EVERY news item below, in a good reading order: i (its number), h (a short lively Russian headline, max 90 chars), p (1–2 paragraphs, 2–4 sentences each).
- facts: exactly 2 "Интересный факт" blocks about art (h — short title, text — 2–4 sentences). Only real, well-known, verifiable facts (famous works, artists, materials, museums); avoid obscure or disputed claims and exact numbers you are not sure about.
- history: one "Из истории искусств" block (h, text 3–5 sentences): a well-known event in art history that happened on ${ruDate(day)} (any year) if you are sure about it, otherwise a well-known story from art history. No doubtful dates.
- joke: one short, kind, light joke about art or artists (in Russian, no gender forms).

Examples of Alina's style (from her blog, for tone only — do not copy the content):
${samples.map((s, i) => `--- sample ${i + 1} ---\n${s}`).join('\n') || '(no samples)'}

NEWS:
${items.map((x, i) => `### ${i}. [${x.src}] ${x.title}\n${(x.text || x.desc || '').slice(0, 2500)}`).join('\n\n')}`;

export function buildHtml(day, src, w) {
  const items = src.items, done = new Set(), parts = [`<p>${esc(w.intro)}</p>`];
  const news = (w.items || []).filter(x => items[x.i] && !done.has(x.i) && done.add(x.i));
  const fact = f => f && f.text ? `<h2>💡 Интересный факт: ${esc(f.h)}</h2><p>${esc(f.text)}</p>` : '';
  const half = Math.ceil(news.length / 2);
  news.forEach((x, k) => {
    const it = items[x.i];
    parts.push(`<h2>${esc(x.h || it.title)}</h2>`);
    if (it.img) parts.push(`<figure><img src="${esc(it.img)}" alt="${esc(x.h || it.title)}"><figcaption>Фото: ${it.photo ? `<a href="${esc(it.photo)}">${esc(it.credit)}</a>` : esc(it.credit)}</figcaption></figure>`);
    for (const p of (x.p || []).slice(0, 3)) if (String(p).trim()) parts.push(`<p>${esc(p)}</p>`);
    parts.push(`<p><i>Источник: <a href="${esc(it.link)}">${esc(it.src)}</a></i></p>`);
    if (k === half - 1) parts.push(fact((w.facts || [])[0]));
  });
  parts.push(fact((w.facts || [])[1]));
  if (w.history && w.history.text) parts.push(`<h2>📜 Из истории искусств: ${esc(w.history.h)}</h2><p>${esc(w.history.text)}</p>`);
  if (w.joke) parts.push(`<h2>😄 Шутка дня</h2><blockquote>${esc(w.joke)}</blockquote>`);
  return { html: parts.filter(Boolean).join('\n'), cover: (news.map(x => items[x.i]).find(it => it.img) || {}).img || '', n: news.length };
}

async function stepWrite(env, h) {
  const src = parseJ(await h.getMeta('courier_src'), null);
  if (!src || !Array.isArray(src.items) || !src.items.length || Date.now() - (src.at || 0) > 2 * 86400000) h.fail(409, 'no_src');
  const cs = await courierSlug(env);
  const rows = (await env.DB.prepare("SELECT b_ru, section FROM blog_posts WHERE status = 'published' AND b_ru != '' ORDER BY published_at DESC LIMIT 8").all()).results;
  const samples = rows.filter(r => !String(r.section || '').split(',').map(x => x.trim()).includes(cs)).slice(0, 2).map(r => strip(r.b_ru).slice(0, 1500));
  const day = src.day || rigaDay(), need = Math.min(MIN_N, src.items.length);
  const w = await ask(env, writePrompt(day, src.items, samples), WRITE_SCHEMA,
    o => Array.isArray(o.items) && o.items.filter(x => src.items[x.i] && x.p && x.p.length).length >= need && Array.isArray(o.facts) && o.facts.length >= 2 && o.history && o.history.text && o.joke, 0.6);
  const { html, cover } = buildHtml(day, src, w);
  const b = await cleanHtml(html);
  let slug = `art-coo-rier-${day}`;
  for (let i = 2; await env.DB.prepare('SELECT id FROM blog_posts WHERE slug = ?').bind(slug).first(); i++) slug = `art-coo-rier-${day}-${i}`;
  const now = Math.floor(Date.now() / 1000);
  const r = await env.DB.prepare(`INSERT INTO blog_posts (slug, status, cover, t_ru, t_en, t_lv, d_ru, d_en, d_lv, b_ru, b_en, b_lv, tags_en, section, src_lang, created_at, updated_at)
    VALUES (?, 'draft', ?, ?, '', '', ?, '', '', ?, '', '', ?, ?, 'ru', ?, ?)`)
    .bind(slug, cover, `Art Coo-rier: новости искусства, ${ruDate(day)}`, String(w.d_ru || '').slice(0, 300), b, 'art news, art world, exhibitions', cs, now, now).run();
  const id = r.meta.last_row_id;
  const used = parseJ(await h.getMeta('courier_used'), []).concat(src.items.map(x => normLink(x.link)));
  await h.setMeta('courier_used', JSON.stringify([...new Set(used)].slice(-KEEP_USED)));
  await h.setMeta('courier_src', '');
  return { id, slug, editUrl: '/blog-editor/#' + id };
}

// POST /api/blog/admin/courier — только админ (проверка как у остальных /api/blog/admin/*); h — helpers из index.js + healthErr
export async function courierApi(req, env, h) {
  const u = await h.needUser(req, env); if (!(await h.isAdmin(u, env))) h.fail(403, 'admin');
  if (req.method !== 'POST') h.fail(405, 'method');
  const { step } = await req.json().catch(() => ({}));
  try {
    if (step === 'src') return h.json(await stepSrc(env, h));
    if (step === 'write') return h.json(await stepWrite(env, h));
  } catch (e) {
    if (e && e.status) throw e; // HttpError (fail) — как есть
    if (e && ['ai_limit', 'ai', 'no_key'].includes(e.code)) h.fail(e.code === 'ai_limit' ? 429 : 502, e.code);
    await h.healthErr('courier', e);
    h.fail(500, 'courier');
  }
  h.fail(400, 'bad');
}
