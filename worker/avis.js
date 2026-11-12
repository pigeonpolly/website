// «Morgenavis» — личная утренняя газета на норвежском для Алины (/norsk/avis/, docs/site.md «Morgenavis»).
// Каждое утро (свой cron «47 * * * *» в wrangler.jsonc, с avisHour по Риге): RSS пяти разделов (мир, Латвия, искусство, книги/кино/сериалы, игры) + два рассказа (Норвегия; кухня и традиции, по сезону) за последние ~30 ч →
// Gemini выбирает по 3 главные новости → worker дочитывает статьи → Gemini пересказывает на букмоле уровня A1–A2 или B1–B2
// (сложные и ключевые слова — с переводом на русский, большие новости — коротко и проще). Уровень по умолчанию готовится утром,
// остальные — по первому нажатию на вкладку (и тоже сохраняются). Без Claude: только ключ Gemini сайта (бесплатный лимит).
// Таблицы: avis_src (день → выбранные новости с текстами), avis (день + уровень → готовый выпуск). Хранится 30 дней.
// Слова «+ в словарь» уходят в словарь учебника норвежского (norsk_progress.state.v — тот же формат, что addWord в content/norsk/engine.js).
import { geminiKey, GEMINI_MODELS } from './translate.js';

export const AVIS_TABLES = [
  'CREATE TABLE IF NOT EXISTS avis_src (day TEXT PRIMARY KEY, data TEXT NOT NULL, created_at INTEGER)',
  'CREATE TABLE IF NOT EXISTS avis (day TEXT NOT NULL, level TEXT NOT NULL, data TEXT NOT NULL, created_at INTEGER, PRIMARY KEY (day, level))',
];
// числа — в «📜 Правилах» (кабинет → Все правила → 📰 Morgenavis)
export const AVIS_RULES = { avisOn: true, avisHour: 6 };
export const AVIS_RANGE = { avisHour: [3, 12] };
export const AVIS_INT = ['avisHour'];
export const AVIS_CRON = '47 * * * *';
const V = 4; // версия формата набора и выпуска: старше — за сегодня пересобрать (4 — вдохновение; 3 — сплетни Сиссель)
const LEVELS = ['A', 'B'], KEEP = 30; // два уровня (решение Алины): A = A1–A2, B = B1–B2
const LNAME = { A: 'A1–A2', B: 'B1–B2' };
const rigaDay = (t = Date.now()) => new Date(t).toLocaleDateString('sv-SE', { timeZone: 'Europe/Riga' });
const rigaHour = () => +new Date().toLocaleString('en-GB', { timeZone: 'Europe/Riga', hour: '2-digit', hourCycle: 'h23' });
const GN = (q, hl = 'en', gl = 'US') => `https://news.google.com/rss/search?q=${encodeURIComponent(q + ' when:1d')}&hl=${hl}&gl=${gl}&ceid=${gl}:${hl}`;
// источники: сначала норвежские и профильные, Google News — запасной (у него нет текста статьи, только заголовок)
const FEEDS = {
  verden: ['https://www.nrk.no/urix/toppsaker.rss', 'https://feeds.bbci.co.uk/news/world/rss.xml', GN('world news')],
  latvia: ['https://eng.lsm.lv/rss/', 'https://www.lsm.lv/rss/', GN('Latvia OR Riga', 'en', 'LV')],
  kunst: ['https://www.theartnewspaper.com/rss.xml', 'https://news.artnet.com/feed', 'https://hyperallergic.com/feed/', GN('art exhibition OR museum OR artist')],
  kultur: ['https://www.theguardian.com/culture/rss', 'https://variety.com/feed/', 'https://www.theguardian.com/books/rss', 'https://www.nrk.no/kultur/toppsaker.rss', GN('new book OR new film OR new TV series release')],
  spill: ['https://www.pcgamer.com/rss/', 'https://www.rockpapershotgun.com/feed', 'https://www.eurogamer.net/feed', GN('new video game release Steam')],
  // сплетни о звёздах — пересказывает маскот, сорока Сиссель (skjære — болтушка), в чате
  sladder: ['https://people.com/feed/', 'https://www.eonline.com/syndication/feeds/rssfeeds/topstories.xml', 'https://www.seher.no/rss', GN('celebrity news')],
};
// norge и mat — не из лент: тему дня выбирает Gemini (с учётом сезона и норвежского календаря, без повторов за 30 дней) и пишет рассказ сам
export const SECTIONS = { verden: '🌍 Verden', latvia: '🇱🇻 Latvia', kunst: '🎨 Kunst', kultur: '🎬 Bøker, film og serier', spill: '🎮 Spill', sladder: '💬 Sladder med Sissel', insp: '📌 Inspirasjon', norge: '🇳🇴 Historier fra Norge', mat: '🍲 Mat og tradisjoner' };
const FALLBACK = { // запасные темы рассказов: [тема, запрос фото для Commons]
  norge: [['Hurtigruten — the coastal express along Norway', 'Hurtigruten ship'], ['Bryggen in Bergen — the old Hanseatic wharf', 'Bryggen Bergen'], ['Allemannsretten — the right to roam in Norwegian nature', 'Norway hiking trail'],
    ['Stave churches of Norway', 'Borgund stave church'], ['Friluftsliv — why Norwegians love being outdoors', 'Norway mountain cabin'], ['The Sami people and their culture', 'Sami lavvu'],
    ['Janteloven — the unwritten rules of modesty', 'Aksel Sandemose'], ['Nynorsk and Bokmål — two written Norwegian languages', 'Ivar Aasen'], ['The Lofoten islands and stockfish', 'Lofoten Reine'],
    ['Kos og hytteliv — the Norwegian cabin culture', 'Norwegian hytte'], ['Edvard Munch and Oslo', 'Munch museum Oslo'], ['The Vikings and the Oseberg ship', 'Oseberg ship']],
  mat: [['Brunost — the brown cheese and the cheese slicer', 'brunost'], ['Vafler — Norwegian heart-shaped waffles', 'Norwegian waffles'], ['Kanelboller and skillingsboller from Bergen', 'skillingsboller'],
    ['Matpakke — the Norwegian packed lunch', 'Norwegian matpakke'], ['Fårikål — the national dish', 'fårikål'], ['Lefse — soft potato flatbread', 'lefse'],
    ['Kvikk Lunsj — the hiking chocolate', 'Kvikk Lunsj'], ['Fiskesuppe — Bergen fish soup', 'Bergen fish soup'], ['Rømmegrøt — sour cream porridge', 'rømmegrøt'],
    ['Pinnekjøtt and ribbe — Christmas dinner', 'pinnekjøtt'], ['Sju slag — the seven kinds of Christmas cookies', 'Norwegian christmas cookies'], ['Kaffe — Norway and filter coffee', 'Norwegian coffee kaffe']],
};
const PICK = { verden: 3, latvia: 2, kunst: 2, kultur: 2, spill: 1, sladder: 2 }; // сколько новостей в разделе (решение Алины: больше о культуре, меньше о войне)

// ---------- RSS ----------
const decode = s => String(s || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;|&#8217;/g, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/\s+/g, ' ').trim();
const tag = (x, t) => { const m = x.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`, 'i')); return m ? m[1] : ''; };
async function feed(url) {
  const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; Morgenavis/1.0)' }, signal: AbortSignal.timeout(10000) }).catch(() => null);
  if (!r || !r.ok) return [];
  const xml = await r.text().catch(() => '');
  const host = new URL(url).hostname.replace(/^www\./, '');
  return (xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) || []).map(x => {
    const link = decode(tag(x, 'link')) || ((x.match(/<link[^>]*href="([^"]+)"/i) || [])[1] || '');
    const when = Date.parse(decode(tag(x, 'pubDate') || tag(x, 'published') || tag(x, 'updated') || tag(x, 'dc:date'))) || 0;
    const img = (x.match(/<media:(?:content|thumbnail)[^>]*url="([^"]+)"/i) || x.match(/<enclosure[^>]*url="([^"]+)"[^>]*type="image/i) || x.match(/<img[^>]*src="([^"]+)"/i) || [])[1] || '';
    return { img: /^https:\/\//.test(img) ? img.replace(/&amp;/g, '&') : '', title: decode(tag(x, 'title')).slice(0, 220), desc: decode(tag(x, 'description') || tag(x, 'summary')).slice(0, 500), link, when, src: host === 'news.google.com' ? decode(tag(x, 'source')) || 'Google News' : host };
  }).filter(x => x.title && x.link);
}
async function collect() {
  const since = Date.now() - 30 * 3600000, out = {};
  for (const [sec, urls] of Object.entries(FEEDS)) {
    const all = (await Promise.all(urls.map(feed))).flat().filter(x => !x.when || x.when >= since), seen = new Set();
    out[sec] = all.filter(x => { const k = x.title.toLowerCase().slice(0, 60); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 14);
  }
  return out;
}
// текст статьи: абзацы <p> со страницы (не вышло — останется описание из RSS)
async function article(url) { // → { text, img } (img — og:image страницы)
  if (/news\.google\.com/.test(url)) return { text: '', img: '' };
  const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; Morgenavis/1.0)' }, signal: AbortSignal.timeout(9000) }).catch(() => null);
  if (!r || !r.ok || !/html/.test(r.headers.get('content-type') || '')) return { text: '', img: '' };
  const raw = await r.text().catch(() => '');
  const og = (raw.match(/<meta[^>]+(?:property|name)="(?:og:image|twitter:image)"[^>]+content="([^"]+)"/i) || raw.match(/<meta[^>]+content="([^"]+)"[^>]+(?:property|name)="(?:og:image|twitter:image)"/i) || [])[1] || '';
  const html = raw.replace(/<(script|style|nav|footer|aside|figure)[\s\S]*?<\/\1>/gi, ' ');
  return { text: (html.match(/<p[\s>][\s\S]*?<\/p>/gi) || []).map(decode).filter(p => p.length > 50).join('\n').slice(0, 4000), img: /^https:\/\//.test(og) ? og.replace(/&amp;/g, '&') : '' };
}

// ---------- Gemini ----------
async function ask(env, prompt, schema, ok, temp = 0.4) {
  const key = await geminiKey(env);
  if (!key) throw Object.assign(new Error('no_key'), { code: 'no_key' });
  let err = 'ai';
  for (const model of GEMINI_MODELS.slice().reverse()) { // сначала модель поумнее — язык уровня важнее скорости
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST', headers: { 'x-goog-api-key': key, 'content-type': 'application/json' }, signal: AbortSignal.timeout(100000),
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: temp, responseMimeType: 'application/json', responseSchema: schema } }),
    }).catch(() => null);
    if (!r) continue;
    if (!r.ok) { err = r.status === 429 ? 'ai_limit' : 'ai'; continue; }
    try {
      const d = await r.json(), out = JSON.parse(d.candidates[0].content.parts.map(p => p.text || '').join(''));
      if (ok(out)) return out;
    } catch (e) { /* не разобрался — следующая модель */ }
  }
  throw Object.assign(new Error(err), { code: err });
}
const INTS = { type: 'ARRAY', items: { type: 'INTEGER' } };
const PICK_SCHEMA = { type: 'OBJECT', required: [...Object.keys(FEEDS), 'norge', 'mat'], properties: { ...Object.fromEntries(Object.keys(FEEDS).map(k => [k, INTS])), norge: { type: 'STRING' }, mat: { type: 'STRING' }, norge_q: { type: 'STRING' }, mat_q: { type: 'STRING' } } };
// фото к рассказу: Wikimedia Commons (свободная лицензия, без ключа) → { img, photo } (photo — страница файла с автором и лицензией)
async function commons(q) {
  if (!q) return {};
  const u = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=6&prop=imageinfo&iiprop=url|mime&iiurlwidth=900&gsrsearch=' + encodeURIComponent(q + ' filetype:bitmap');
  const r = await fetch(u, { headers: { 'user-agent': 'Morgenavis/1.0 (personal reading page)' }, signal: AbortSignal.timeout(8000) }).catch(() => null);
  if (!r || !r.ok) return {};
  const pages = Object.values(((await r.json().catch(() => ({}))).query || {}).pages || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
  const f = pages.map(x => (x.imageinfo || [])[0]).find(i => i && /jpeg|png|webp/.test(i.mime || '') && i.thumburl);
  return f ? { img: f.thumburl, photo: f.descriptionurl || '' } : {};
}
const WEEKDAY = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// утром: собрать новости, выбрать главные, дочитать статьи → avis_src
async function buildSrc(env, day) {
  const cand = await collect();
  const list = sec => cand[sec].map((x, i) => `${i}. [${x.src}] ${x.title} — ${x.desc.slice(0, 200)}`).join('\n') || '(none)';
  const recent = { norge: [], mat: [] }; // темы рассказов за 30 дней — чтобы не повторяться
  for (const r of (await env.DB.prepare('SELECT data FROM avis_src WHERE day < ? ORDER BY day DESC LIMIT ?').bind(day, KEEP).all()).results) {
    try { for (const x of JSON.parse(r.data)) if (x.topic && recent[x.sec]) recent[x.sec].push(x.topic); } catch (e) { /* старый формат */ }
  }
  let pick = Object.fromEntries(Object.keys(FEEDS).map(k => [k, [0, 1, 2]]));
  try {
    pick = await ask(env, `You are the editor of a morning digest for a reader in Riga, Latvia, who is an artist and is learning Norwegian. Today is ${WEEKDAY(day)}.

PART 1. From each numbered list of headlines from the last 24 hours choose the most important, interesting and varied stories: WORLD ${PICK.verden}, LATVIA ${PICK.latvia}, ART ${PICK.kunst}, CULTURE ${PICK.kultur}, GAMES ${PICK.spill}, CELEBRITY GOSSIP ${PICK.sladder}.
Rules: no duplicates of the same event, no clickbait, no horoscopes. NEVER choose medicine, health, diseases, hospitals or drugs stories, and NEVER violent or disturbing crime, murders, abuse, terror, disasters with victims or other triggering content. Keep war and military conflict to a minimum: at most ONE such story in WORLD and none elsewhere; prefer science, climate, society, economy, technology and good news. ART: exhibitions, artists, museums, discoveries, art world. CULTURE: trends and notable new releases in world books, films and TV series (premieres, bestsellers, awards), not celebrity gossip. GAMES: notable new or upcoming video games (Steam, consoles, indie), not hardware deals. CELEBRITY GOSSIP: light, fun, harmless stories about stars (new couples, weddings, babies, red carpets, surprising hobbies, comebacks); never death, illness, divorces with fights, abuse, lawsuits or anything sad. Return the numbers.

PART 2. Choose today's topics for two short stories written from general knowledge (no news needed). Each topic: one line in English, specific (not "Norwegian food" but e.g. "Fårikål — the national dish and Fårikålens festdag in September").
For each topic also give a 2–4 word English photo search query for Wikimedia Commons ("norge_q", "mat_q"), e.g. "fårikål dish", "Bryggen Bergen".
- "norge": an interesting story about Norway — its history, everyday life, customs, places, people, language or society.
Never choose topics about death, disasters, war or disease.
- "mat": Norwegian food and traditions — a dish, baking, a custom or a holiday tradition.
If a Norwegian holiday, tradition day or season-specific custom falls today or within the next 7 days (e.g. Mortensaften, Farsdag, Luciadagen, advent, julebord, Sankthans, 17. mai, påske, Fastelavn, seasonal dishes), prefer it for at least one of the two topics. Do not repeat these recent topics:
norge: ${recent.norge.slice(0, 30).join(' | ') || '(none)'}
mat: ${recent.mat.slice(0, 30).join(' | ') || '(none)'}

${Object.keys(FEEDS).map(k => `${k.toUpperCase()}:\n${list(k)}`).join('\n\n')}`, PICK_SCHEMA, o => o && Array.isArray(o.verden), 0.4);
  } catch (e) { /* без выбора — первые по порядку ленты, без рассказов */ }
  const items = [];
  for (const sec of Object.keys(FEEDS)) {
    const idx = [...new Set((pick[sec] || []).filter(i => Number.isInteger(i) && cand[sec][i]))].slice(0, PICK[sec]);
    for (let i = 0; idx.length < PICK[sec] && i < cand[sec].length; i++) if (!idx.includes(i)) idx.push(i);
    for (const i of idx) items.push({ sec, v: V, ...cand[sec][i] });
  }
  if (!items.length) throw Object.assign(new Error('no_news'), { code: 'no_news' });
  const texts = await Promise.all(items.map(x => article(x.link)));
  items.forEach((x, i) => { x.text = texts[i].text; x.img = texts[i].img || x.img || ''; });
  const dn = Math.floor(Date.parse(day + 'T12:00:00Z') / 86400000);
  for (const sec of ['norge', 'mat']) if (!pick[sec]) { const t = FALLBACK[sec][dn % FALLBACK[sec].length]; pick[sec] = t[0]; pick[sec + '_q'] = t[1]; }
  for (const sec of ['norge', 'mat']) if (pick[sec]) items.push({ sec, topic: String(pick[sec]).slice(0, 200), title: '', link: '', src: '', ...await commons(String(pick[sec + '_q'] || '').slice(0, 80)) });
  await env.DB.prepare('INSERT INTO avis_src (day, data, created_at) VALUES (?, ?, ?) ON CONFLICT(day) DO UPDATE SET data = excluded.data, created_at = excluded.created_at')
    .bind(day, JSON.stringify(items), Date.now()).run();
  return items;
}

const GUIDE = {
  A: 'CEFR A1–A2 (beginner to elementary). Short clear sentences (5–12 words), present and simple past tense (preteritum, perfektum), simple connectors (og, men, fordi, så, når), only common everyday words, almost no subordinate clauses. Each story 60–110 words. Gloss 7–9 words per story (all key nouns and verbs a beginner may not know).',
  B: 'CEFR B1–B2 (intermediate to upper-intermediate). Natural newspaper-like Bokmål (like NRK, a bit simpler), subordinate clauses (som, at, hvis, selv om) and varied syntax, some idioms and fixed expressions, abstract vocabulary is fine. Each story 140–230 words. Gloss 5–6 of the hardest words, idioms or set phrases per story.',
};
const WORD = { type: 'OBJECT', required: ['no', 'ru'], properties: { no: { type: 'STRING' }, ru: { type: 'STRING' } } };
const ISSUE = { type: 'OBJECT', required: ['hilsen', 'items', 'dagens'], properties: {
  hilsen: { type: 'STRING' },
  dagens: { type: 'ARRAY', items: { type: 'OBJECT', required: ['no', 'ru', 'ex'], properties: { no: { type: 'STRING' }, ru: { type: 'STRING' }, ex: { type: 'STRING' } } } },
  items: { type: 'ARRAY', items: { type: 'OBJECT', required: ['i', 'title', 'kort', 'text', 'words', 'ru', 'q'], properties: {
    i: { type: 'INTEGER' }, title: { type: 'STRING' }, kort: { type: 'STRING' }, text: { type: 'STRING' }, words: { type: 'ARRAY', items: WORD }, ru: { type: 'STRING' }, q: { type: 'STRING' } } } } } };

// выпуск уровня: пересказ всех выбранных новостей одним вызовом → avis
async function buildIssue(env, day, level, all) {
  const src = all.filter(x => !x.topic), topics = all.filter(x => x.topic);
  const tales = topics.length ? buildTales(env, day, level, topics).catch(e => { console.error('avis tales', e); return { items: [], insp: [] }; }) : { items: [], insp: [] };
  const stories = src.map((x, i) => `#${i} [${x.sec}] ${x.title}\nSource: ${x.src}\n${x.text || x.desc}`).join('\n\n---\n\n');
  const out = await ask(env, `You write a daily news digest in Norwegian Bokmål for an adult Russian-speaking learner of Norwegian who lives in Riga and is an artist. The goal: read more Norwegian every day and understand it fluently.

Level: ${GUIDE[level]}

For EVERY story below (keep the order, field "i" = the story number) write:
- "title": a short Norwegian headline at this level.
- "kort": if the original story is long or complicated, ONE simple Norwegian sentence "what is it about" (a summary). Otherwise an empty string.
- "text": a simplified, faithful retelling in Norwegian at this level, 1–3 short paragraphs separated by "\\n\\n". If the source is long, summarise and keep only the essential facts. Never invent facts, numbers or quotes; keep names. Mark every glossed word exactly as it appears in the text with double square brackets, e.g. "Regjeringen [[foreslår]] nye [[tiltak]]."
- "words": the glossed words: "no" = dictionary form (nouns with en/ei/et, verbs with å, e.g. "et tiltak", "å foreslå"), "ru" = short Russian translation (1–4 words). Do not gloss very basic words the level already knows.
- "ru": 1–2 sentences in Russian: what the story says (for self-check after reading).
- "q": one short comprehension question in Norwegian at this level.
For stories in section [sladder] (celebrity gossip) write "title" and "text" as Sissel, a cute chatty magpie (skjære) who gossips with her friend, the reader: informal, warm and playful, speaking directly to "du" ("Hør her!", "Du, vet du hva?", "Jeg sier ikke noe, men…"), one or two emojis at most, still the same level, still only facts from the source. "kort" stays empty for gossip.
Also:
- "hilsen": 1–2 friendly Norwegian sentences at this level to start the day (mention the date ${day} naturally, e.g. weekday), no facts that are not in the stories.
- "dagens": "words of the day" — 3 useful words or expressions from today's stories, with Russian translation and a short Norwegian example sentence at this level.
Use correct modern Bokmål spelling and grammar. Do not use English words when a Norwegian word exists.

STORIES:

${stories}`, ISSUE, o => o && Array.isArray(o.items) && o.items.length);
  const items = out.items.filter(x => src[x.i]).map(x => ({ sec: src[x.i].sec, link: src[x.i].link, src: src[x.i].src, img: src[x.i].img || '', title: String(x.title).slice(0, 200), kort: String(x.kort || '').slice(0, 300),
    text: String(x.text).slice(0, 3000), words: (x.words || []).slice(0, 12).map(w => ({ no: String(w.no).slice(0, 60), ru: String(w.ru).slice(0, 80) })), ru: String(x.ru).slice(0, 500), q: String(x.q || '').slice(0, 200) }));
  const tl = await tales; items.push(...tl.items);
  const data = { v: V, insp: tl.insp, day, level, hilsen: String(out.hilsen || '').slice(0, 400), dagens: (out.dagens || []).slice(0, 5).map(w => ({ no: String(w.no).slice(0, 60), ru: String(w.ru).slice(0, 80), ex: String(w.ex).slice(0, 200) })), items };
  await env.DB.prepare('INSERT INTO avis (day, level, data, created_at) VALUES (?, ?, ?, ?) ON CONFLICT(day, level) DO UPDATE SET data = excluded.data, created_at = excluded.created_at')
    .bind(day, level, JSON.stringify(data), Date.now()).run();
  return data;
}
const STORY = { type: 'OBJECT', required: ['items'], properties: { items: { type: 'ARRAY', items: { type: 'OBJECT', required: ['i', 'title', 'text', 'words', 'ru', 'q'], properties: {
  i: { type: 'INTEGER' }, title: { type: 'STRING' }, text: { type: 'STRING' }, words: { type: 'ARRAY', items: WORD }, ru: { type: 'STRING' }, q: { type: 'STRING' } } } },
  insp: { type: 'ARRAY', items: { type: 'OBJECT', required: ['no', 'ru', 'q', 'colors'], properties: { no: { type: 'STRING' }, ru: { type: 'STRING' }, q: { type: 'STRING' }, colors: { type: 'ARRAY', items: { type: 'STRING' } } } } } } };
const TALE_LEN = { A: '90–140 words', B: '180–260 words' };
// рассказы дня (norge, mat) — из общих знаний Gemini, тот же формат, что у новостей
async function buildTales(env, day, level, topics) {
  const out = await ask(env, `You write short reading texts in Norwegian Bokmål for an adult Russian-speaking learner of Norwegian (an artist living in Riga). Today is ${WEEKDAY(day)}.

Level: ${GUIDE[level]} Length of each text: ${TALE_LEN[level]}.

Write one text for EVERY topic below (field "i" = the topic number):
${topics.map((x, i) => `#${i} [${x.sec === 'mat' ? 'Norwegian food and traditions' : 'a story about Norway'}] ${x.topic}`).join('\n')}

Make it vivid and personal, like a friendly magazine column: everyday details, how Norwegians really do it, a small surprising fact. For food: what it is, when and how it is eaten, and if it fits, 3–4 simple steps of how it is made. If the day is today or soon, say so. Use only well-established facts; if unsure about a date, number or name, leave it out.
- "title": a short Norwegian title.
- "text": 2–3 short paragraphs separated by "\n\n". Mark every glossed word exactly as it appears in the text with double square brackets, e.g. "Vi [[baker]] [[boller]]."
- "words": the glossed words: "no" = dictionary form (nouns with en/ei/et, verbs with å), "ru" = short Russian translation (1–4 words).
- "ru": 1–2 sentences in Russian: what the text says (for self-check).
- "q": one short comprehension question in Norwegian at this level.
Also "insp": 6 seasonal inspiration themes for an artist (illustration, sketchbook, cozy aesthetics, colour palettes, nature, Scandinavian seasonal mood, holidays of this time of year), fitting today's date and season in Northern Europe, varied, no repeats of the stories: "no" = a short Norwegian title at this level (2–5 words), "ru" = its Russian translation, "q" = an English Pinterest search query of 2–5 words that gives beautiful results (e.g. "cozy november illustration", "nordic winter palette"), "colors" = 4 hex colours of a matching palette (e.g. "#a3542c").
Use correct modern Bokmål.`, STORY, o => o && Array.isArray(o.items) && o.items.length, 0.6);
  const insp = (out.insp || []).slice(0, 8).map(x => ({ no: String(x.no).slice(0, 80), ru: String(x.ru).slice(0, 80), q: String(x.q).slice(0, 80), colors: (x.colors || []).filter(c => /^#[0-9a-f]{6}$/i.test(c)).slice(0, 5) }));
  return { insp, items: out.items.filter(x => topics[x.i]).map(x => ({ sec: topics[x.i].sec, link: '', src: '', img: topics[x.i].img || '', photo: topics[x.i].photo || '', title: String(x.title).slice(0, 200), kort: '', text: String(x.text).slice(0, 3000),
    words: (x.words || []).slice(0, 12).map(w => ({ no: String(w.no).slice(0, 60), ru: String(w.ru).slice(0, 80) })), ru: String(x.ru).slice(0, 500), q: String(x.q || '').slice(0, 200) })) };
}
const getSrc = async (env, day) => { const r = await env.DB.prepare('SELECT data FROM avis_src WHERE day = ?').bind(day).first(); return r ? JSON.parse(r.data) : null; };
const getLevel = async env => { const r = await env.DB.prepare("SELECT value FROM meta WHERE key = 'avis_level'").first().catch(() => null); return LEVELS.includes(r && r.value) ? r.value : 'B'; };

// cron (AVIS_CRON, раз в час): с avisHour по Риге — новости дня и выпуск уровня по умолчанию; старше 30 дней — удалить
export async function avisCron(env, R) {
  if (!R.avisOn || rigaHour() < R.avisHour) return;
  const day = rigaDay();
  const tries = 'avis_try:' + day, n = Number(((await env.DB.prepare('SELECT value FROM meta WHERE key = ?').bind(tries).first().catch(() => null)) || {}).value) || 0;
  if (n >= 4) return; // Gemini занят весь день — не больше 4 попыток
  let src = await getSrc(env, day);
  const level = await getLevel(env);
  if (src && await env.DB.prepare('SELECT 1 FROM avis WHERE day = ? AND level = ?').bind(day, level).first()) return;
  await env.DB.prepare("INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind(tries, String(n + 1)).run();
  if (!src) src = await buildSrc(env, day);
  await buildIssue(env, day, level, src);
  const old = rigaDay(Date.now() - KEEP * 86400000);
  await env.DB.batch([env.DB.prepare('DELETE FROM avis WHERE day < ?').bind(old), env.DB.prepare('DELETE FROM avis_src WHERE day < ?').bind(old),
    env.DB.prepare("DELETE FROM meta WHERE key LIKE 'avis_try:%' AND key < ?").bind('avis_try:' + old)]);
}

// h: json, fail, currentUser, isAdmin, adminIdentity
export async function avisApi(req, env, url, h) {
  const p = url.pathname, m = req.method, u = await h.currentUser(req, env);
  const ok = !!(u && !u.banned && (await h.isAdmin(u, env) || await h.adminIdentity(u, env))); // только Алина
  if (!p.startsWith('/api/')) return page(ok ? AVIS_HTML : LOCKED, ok ? 200 : 403);
  if (!ok) h.fail(u ? 403 : 401, u ? 'forbidden' : 'login');
  const nc = { 'cache-control': 'no-store' };
  if (p === '/api/avis/level' && m === 'POST') { // какой уровень готовить утром
    const b = await req.json().catch(() => ({}));
    if (!LEVELS.includes(b.level)) h.fail(400, 'level');
    await env.DB.prepare("INSERT INTO meta (key, value) VALUES ('avis_level', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind(b.level).run();
    return h.json({ ok: true });
  }
  if (p === '/api/avis/word' && m === 'POST') { // «+ в словарь» учебника норвежского
    const b = await req.json().catch(() => ({})), w = String(b.w || '').trim().slice(0, 60), k = w.toLowerCase();
    if (!k) h.fail(400, 'word');
    const r = await env.DB.prepare('SELECT state FROM norsk_progress WHERE user_id = ?').bind(u.id).first();
    let s = {}; try { s = JSON.parse((r && r.state) || '{}') || {}; } catch (e) { s = {}; }
    s.v = s.v || {};
    if (!s.v[k]) s.v[k] = { w, tr: String(b.tr || '').slice(0, 120), ex: String(b.ex || '').slice(0, 240), l: 0, due: Math.floor(Date.now() / 86400000), u: 0, src: 'avis' };
    s.t = Date.now();
    await env.DB.prepare(`INSERT INTO norsk_progress (user_id, state, updated_at) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET state = excluded.state, updated_at = excluded.updated_at`).bind(u.id, JSON.stringify(s), Date.now()).run();
    return h.json({ ok: true });
  }
  if (p === '/api/avis' && (m === 'GET' || m === 'POST')) { // GET ?day&level — выпуск (нет — собрать сейчас); POST {day, level, fresh} — собрать заново
    const b = m === 'POST' ? await req.json().catch(() => ({})) : {};
    const today = rigaDay(), day = /^\d{4}-\d\d-\d\d$/.test(b.day || url.searchParams.get('day') || '') ? (b.day || url.searchParams.get('day')) : today;
    const want = b.level || url.searchParams.get('level'), level = LEVELS.includes(want) ? want : await getLevel(env);
    const days = (await env.DB.prepare('SELECT day FROM avis_src ORDER BY day DESC LIMIT ?').bind(KEEP).all()).results.map(x => x.day);
    let data = null;
    if (!(m === 'POST' && b.fresh)) { const r = await env.DB.prepare('SELECT data FROM avis WHERE day = ? AND level = ?').bind(day, level).first(); if (r) data = JSON.parse(r.data); }
    if (data && day === today && data.v !== V) data = null; // выпуск старого формата — переписать
    if (!data) {
      try {
        let src = m === 'POST' && b.fresh === 'news' && day === today ? null : await getSrc(env, day);
        if (src && day === today && !src.some(x => x.v === V)) src = null; // набор старого формата (без рассказов и картинок) — собрать заново
        if (!src && day !== today) h.fail(404, 'no_day');
        if (!src) src = await buildSrc(env, day);
        data = await buildIssue(env, day, level, src);
      } catch (e) { if (e.status) throw e; return h.json({ error: e.code || 'ai', day, level, days }, 502, nc); }
    }
    if (!days.includes(day)) days.unshift(day);
    return h.json({ ...data, days, defaultLevel: await getLevel(env) }, 200, nc);
  }
  return null;
}

const page = (html, status) => new Response(html, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex, nofollow' } });
const LOCKED = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Страница закрыта</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fbfaff;color:#1f1832;font:17px/1.6 system-ui,sans-serif;padding:16px;text-align:center}a{color:#534ab7}</style></head>
<body><main><h1>Страница закрыта</h1><p>Это личная страница. Войдите на сайт и откройте её снова.</p><p><a href="/">pigeonpolly.com</a></p></main></body></html>`;

// Сиссель — милая сорока-сплетница (маскот раздела «Sladder»)
const MAGPIE = `<svg viewBox="0 0 72 64" width="60" height="54"><path d="M22 44L2 60c2 3 6 3 8 1l18-12z" fill="#2c3e8f"/><path d="M22 46L6 62" stroke="#4a6fe0" stroke-width="2" stroke-linecap="round"/><ellipse cx="38" cy="38" rx="19" ry="16" fill="#1d1b26"/><ellipse cx="42" cy="43" rx="12" ry="11" fill="#fff"/><path d="M21 35c7-6 17-5 20 4-8 5-18 3-20-4z" fill="#1d1b26" stroke="#3a5bd0" stroke-width="1.6"/><path d="M25 35c4-2 9-2 12 1-4 2-9 2-12-1z" fill="#fff"/><circle cx="44" cy="20" r="13" fill="#1d1b26"/><circle cx="40" cy="19" r="4.4" fill="#fff"/><circle cx="50" cy="19" r="4.4" fill="#fff"/><circle cx="41" cy="20" r="2.3" fill="#1d1b26"/><circle cx="51" cy="20" r="2.3" fill="#1d1b26"/><circle cx="41.8" cy="19" r=".8" fill="#fff"/><circle cx="51.8" cy="19" r=".8" fill="#fff"/><path d="M55 22l11 3-11 3z" fill="#2a2633"/><circle cx="38" cy="26" r="2.3" fill="#ff9fb0" opacity=".75"/><circle cx="52" cy="27" r="2.3" fill="#ff9fb0" opacity=".75"/><path d="M36 53l-2 7M45 53l2 7" stroke="#2a2633" stroke-width="2.4" stroke-linecap="round"/></svg>`;
const AVIS_HTML = `<!doctype html><html lang="nb"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="robots" content="noindex">
<title>Morgenavis</title><link rel="icon" href="/favicon.ico">
<style>
:root{--bg:#fbfaff;--card:#fff;--ink:#1f1832;--mute:#6b6480;--line:#e6e1f2;--acc:#534ab7;--acc2:#efeafc;--mark:#fff2b8;--ok:#2f8f5b}
@media (prefers-color-scheme:dark){:root{--bg:#16131f;--card:#211d2d;--ink:#eeeaf7;--mute:#a59fb8;--line:#363047;--acc:#a99ff0;--acc2:#2c2742;--mark:#5a4b12;--ok:#6fcf97}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:18px/1.65 Georgia,'Times New Roman',serif}
.wrap{max-width:720px;margin:0 auto;padding:16px 16px 80px}
header{display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap;border-bottom:3px double var(--line);padding-bottom:8px}
h1{font-size:34px;margin:0;letter-spacing:.5px}h1 small{display:block;font:14px system-ui,sans-serif;color:var(--mute);letter-spacing:0}
.top a{font:14px system-ui,sans-serif;color:var(--acc)}
.bar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:14px 0;font:15px system-ui,sans-serif}
.lv{display:inline-flex;border:1px solid var(--line);border-radius:999px;overflow:hidden;background:var(--card)}
.lv button{border:0;background:none;color:var(--ink);padding:7px 14px;font:600 15px system-ui,sans-serif;cursor:pointer}
.lv button[aria-pressed=true]{background:var(--acc);color:#fff}
select,.btn{font:15px system-ui,sans-serif;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:10px;padding:6px 10px;cursor:pointer}
.hint{font:14px system-ui,sans-serif;color:var(--mute)}
.hilsen{font-style:italic;margin:6px 0 14px}
.box{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin:14px 0}
.dagens h3{margin:0 0 6px;font:700 15px system-ui,sans-serif;color:var(--acc);text-transform:uppercase;letter-spacing:.06em}
.dagens li{margin:4px 0}.dagens i{color:var(--mute)}
h2.sec{font:700 14px system-ui,sans-serif;text-transform:uppercase;letter-spacing:.08em;color:var(--mute);margin:28px 0 4px;border-top:1px solid var(--line);padding-top:12px}
article h3{font-size:23px;line-height:1.3;margin:6px 0 6px}
.kort{font:15px system-ui,sans-serif;background:var(--acc2);border-radius:8px;padding:6px 10px;margin:6px 0}
mark{background:var(--mark);color:inherit;border-radius:3px;padding:0 2px;cursor:pointer}
.words{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0;font:14px system-ui,sans-serif;padding:0;list-style:none}
.words li{background:var(--acc2);border-radius:8px;padding:3px 4px 3px 9px;display:flex;align-items:center;gap:6px}
.words b{font-weight:600}.add{border:1px solid var(--acc);background:var(--card);color:var(--acc);border-radius:6px;cursor:pointer;font:600 13px system-ui,sans-serif;padding:2px 8px;white-space:nowrap}
.add.done{color:var(--ok);border-color:transparent}
.w{cursor:pointer;border-radius:3px}.w:hover{background:var(--acc2)}
#tip .add{margin-top:6px;background:var(--bg);color:var(--acc)}#tip small{opacity:.75}
.tools{display:flex;gap:8px;flex-wrap:wrap;align-items:center;font:14px system-ui,sans-serif;margin-top:6px}
.tools a{color:var(--mute)}
details{font:15px system-ui,sans-serif;margin-top:6px}summary{cursor:pointer;color:var(--acc)}
.q{font-style:italic;margin:6px 0 0}
#tip{position:fixed;z-index:9;background:var(--ink);color:var(--bg);font:15px system-ui,sans-serif;padding:6px 10px;border-radius:8px;max-width:260px;box-shadow:0 4px 18px #0003}
.load{text-align:center;padding:60px 0;color:var(--mute);font:16px system-ui,sans-serif}
.load b{display:block;font-size:40px;animation:bob 1.2s ease-in-out infinite}@keyframes bob{50%{transform:translateY(-8px)}}
.read{font:600 15px system-ui,sans-serif}
.insp{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;margin:10px 0}
.ins{display:flex;flex-direction:column;gap:2px;text-decoration:none;color:var(--ink);background:var(--card);border:1px solid var(--line);border-radius:14px;padding:10px;font:14px system-ui,sans-serif}
.ins:hover{border-color:var(--acc)}.ins b{font-size:15px}.ins small{color:var(--mute)}.ins .pq{font-size:12px}
.pal{display:flex;height:54px;border-radius:9px;overflow:hidden;margin-bottom:6px}.pal i{flex:1}
.gossip{display:flex;gap:10px;align-items:flex-start;margin:16px 0}.sissel{flex:none;margin-top:4px;animation:bob 2.4s ease-in-out infinite}
.bubble{position:relative;flex:1;min-width:0;background:var(--acc2);border-radius:4px 18px 18px 18px;padding:10px 14px}
.bubble .who{display:block;font:700 13px system-ui,sans-serif;color:var(--acc);letter-spacing:.04em}
.bubble article h3{font-size:20px;margin-top:2px}.bubble .pic{max-height:220px}.bubble .words li{background:var(--card)}
.toc{position:sticky;top:0;z-index:5;display:flex;gap:6px;overflow-x:auto;padding:8px 0;margin:8px 0;background:var(--bg);font:600 14px system-ui,sans-serif;scrollbar-width:none}
.toc::-webkit-scrollbar{display:none}.toc a{flex:none;text-decoration:none;color:var(--ink);background:var(--card);border:1px solid var(--line);border-radius:999px;padding:5px 12px}
.toc a:hover{border-color:var(--acc);color:var(--acc)}
h2.sec{scroll-margin-top:56px;display:flex;justify-content:space-between;align-items:center}.up{color:var(--mute);text-decoration:none;font-size:16px}
.pic{display:block;width:100%;aspect-ratio:16/9;max-height:300px;object-fit:cover;border-radius:12px;margin:8px 0 4px;background:var(--acc2)}
</style></head><body><div class="wrap">
<header id="top"><h1>Morgenavis<small id="date"></small></h1><span class="top"><a href="/norsk/">← учебник норвежского</a></span></header>
<div class="bar"><span class="lv" id="lv">${LEVELS.map(l => `<button type="button" data-l="${l}">${LNAME[l]}</button>`).join('')}</span>
<select id="day" aria-label="День"></select><button class="btn" id="again" type="button" title="Написать выпуск заново">↻ заново</button></div>
<p class="hint" id="hint">Нажми на <mark>выделенное слово</mark> — перевод. «+» — слово в словарь учебника. Сначала читай, потом проверяй себя по-русски.</p>
<main id="main"><div class="load"><b>🐧</b>Пелле несёт газету…</div></main>
</div><div id="tip" hidden></div>
<script>
(() => {
  const $ = s => document.querySelector(s), esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const MAG = ${JSON.stringify(MAGPIE)};
  const SEC = ${JSON.stringify(SECTIONS)}, LN = ${JSON.stringify(LNAME)};
  let level = null, day = null, data = null;
  try { level = localStorage.getItem('avis-level'); } catch (e) {}
  const added = new Set(JSON.parse((() => { try { return localStorage.getItem('avis-added') || '[]'; } catch (e) { return '[]'; } })()));
  const fmt = d => new Date(d + 'T12:00:00').toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  // каждое слово — по нажатию (перевод и «+ в словарь»); [[слово]] из глоссария — выделено
  const L = 'A-Za-zÆØÅæøåÉéÈèÔôÜü', WRE = new RegExp('([' + L + ']+(?:[\\u2019\\'-][' + L + ']+)*)', 'g');
  const wrap = t => esc(t).replace(WRE, '<span class="w">$1</span>');
  function marks(t) {
    return t.split(/\\n\\n+/).map(p => '<p>' + p.split(/(\\[\\[.+?\\]\\])/).map((x, i) => i % 2 ? '<mark class="w">' + esc(x.slice(2, -2)) + '</mark>' : wrap(x)).join('') + '</p>').join('');
  }
  const base = w => w.toLowerCase().replace(/^(en|ei|et|å) /, '');
  let GL = {};
  function gloss(w) { // перевод из глоссария выпуска (с окончаниями: -en, -et, -a, -ene, -er, -te…)
    const k = w.toLowerCase();
    if (GL[k]) return GL[k];
    const forms = [k.replace(/(ene|ane|ne)$/, ''), k.replace(/(en|et|a|er|e|r|t|s)$/, ''), k.replace(/(te|de|dde|tte)$/, ''), k.replace(/ene$/, 'e'), k.replace(/a$/, 'e')];
    for (const f of forms) if (f.length > 2 && GL[f]) return GL[f];
    for (const [g, v] of Object.entries(GL)) if (g.length > 3 && !g.includes(' ') && k.startsWith(g.slice(0, Math.max(4, g.length - 2)))) return v;
    return null;
  }
  const TRC = (() => { try { return { ...JSON.parse(localStorage.getItem('norsk-tr') || '{}'), ...JSON.parse(localStorage.getItem('avis-tr') || '{}') }; } catch (e) { return {}; } })();
  async function trWord(w) { // глоссарий выпуска → кэш переводов (общий с учебником) → MyMemory
    const g = gloss(w); if (g) return g;
    const k = w.toLowerCase(); if (TRC[k]) return { no: k, ru: TRC[k], note: 'машинный перевод' };
    try {
      const j = await (await fetch('https://api.mymemory.translated.net/get?langpair=nb|ru&q=' + encodeURIComponent(w))).json(), tr = j && j.responseData && j.responseData.translatedText;
      if (tr && !/MYMEMORY|INVALID|QUERY LENGTH/i.test(tr) && tr.toLowerCase() !== k) { TRC[k] = tr.slice(0, 120); try { const c = JSON.parse(localStorage.getItem('avis-tr') || '{}'); c[k] = TRC[k]; localStorage.setItem('avis-tr', JSON.stringify(c)); } catch (e) {} return { no: k, ru: TRC[k], note: 'машинный перевод' }; }
    } catch (e) {}
    return { no: k, ru: '', note: 'перевод не нашёлся' };
  }
  function render() {
    const d = data; GL = {}; for (const w of [...(d.dagens || []), ...d.items.flatMap(x => x.words)]) { GL[w.no.toLowerCase()] = w; GL[base(w.no)] = w; }
    $('#date').textContent = fmt(d.day) + ' · ' + (LN[d.level] || d.level);
    let html = d.hilsen ? '<p class="hilsen tx">' + wrap(d.hilsen) + '</p>' : '';
    if (d.dagens && d.dagens.length) html += '<div class="box dagens"><h3>Dagens ord</h3><ul>' + d.dagens.map(w => '<li><b>' + esc(w.no) + '</b> — ' + esc(w.ru) + ' ' + addBtn(w.no, w.ru, w.ex) + '<br><i class="tx">' + wrap(w.ex) + '</i></li>').join('') + '</ul></div>';
    const secs = [...new Set(d.items.map(x => x.sec))]; if (d.insp && d.insp.length) secs.push('insp');
    html += '<nav class="toc" aria-label="Разделы">' + secs.map(k => '<a href="#s-' + k + '">' + esc(SEC[k] || k) + '</a>').join('') + '</nav>';
    let sec = '';
    d.items.forEach((x, i) => {
      if (x.sec !== sec) { sec = x.sec; html += '<h2 class="sec" id="s-' + sec + '">' + esc(SEC[sec] || sec) + '<a class="up" href="#top" aria-label="Наверх">↑</a></h2>'; }
      const plain = x.text.replace(/\\[\\[(.+?)\\]\\]/g, '$1');
      if (x.sec === 'sladder') html += '<div class="gossip"><span class="sissel" aria-hidden="true">' + MAG + '</span><div class="bubble"><b class="who">Sissel</b>';
      html += '<article data-i="' + i + '">' + (x.img ? '<img class="pic" src="' + esc(x.img) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">' : '') + '<h3 class="tx">' + wrap(x.title) + '</h3>' + (x.kort ? '<p class="kort tx">📌 ' + wrap(x.kort) + '</p>' : '') + '<div class="tx">' + marks(x.text) + '</div>'
        + (x.words.length ? '<ul class="words">' + x.words.map(w => '<li><span><b>' + esc(w.no) + '</b> — ' + esc(w.ru) + '</span>' + addBtn(w.no, w.ru, (plain.split(/(?<=[.!?])\\s+/).find(s => s.toLowerCase().includes(w.no.toLowerCase().replace(/^(en|ei|et|å) /, '').slice(0, 4))) || '')) + '</li>').join('') + '</ul>' : '')
        + (x.q ? '<p class="q tx">❓ ' + wrap(x.q) + '</p>' : '')
        + '<div class="tools"><button class="btn" type="button" data-say="' + i + '">🔊 Les høyt</button>' + (x.link ? '<a href="' + esc(x.link) + '" target="_blank" rel="noopener">kilde: ' + esc(x.src) + '</a>' : '') + (x.photo ? '<a href="' + esc(x.photo) + '" target="_blank" rel="noopener">foto: Wikimedia Commons</a>' : '') + '</div>'
        + '<details><summary>Проверить себя по-русски</summary><p>' + esc(x.ru) + '</p></details></article>' + (x.sec === 'sladder' ? '</div></div>' : '');
    });
    if (d.insp && d.insp.length) html += '<h2 class="sec" id="s-insp">' + esc(SEC.insp) + '<a class="up" href="#top" aria-label="Наверх">↑</a></h2><p class="hint">Подборка по сезону: нажми — откроется Pinterest с этой темой.</p><div class="insp">'
      + d.insp.map(x => '<a class="ins" href="https://www.pinterest.com/search/pins/?q=' + encodeURIComponent(x.q) + '" target="_blank" rel="noopener"><span class="pal">' + x.colors.map(c => '<i style="background:' + c + '"></i>').join('') + '</span><b>' + esc(x.no) + '</b><small>' + esc(x.ru) + '</small><small class="pq">📌 ' + esc(x.q) + '</small></a>').join('') + '</div>';
    const n = d.items.reduce((s, x) => s + x.text.split(/\\s+/).length, 0);
    html += '<p class="hint" style="margin-top:30px">≈ ' + n + ' ord · ' + Math.max(1, Math.round(n / 110)) + ' min. Godt jobba! 🐧</p>';
    $('#main').innerHTML = html;
  }
  const addBtn = (w, tr, ex) => added.has(w.toLowerCase()) ? '<button class="add done" type="button" disabled>✓ в словаре</button>' : '<button class="add" type="button" data-w="' + esc(w) + '" data-tr="' + esc(tr) + '" data-ex="' + esc(ex) + '" title="в словарь учебника">+ в словарь</button>';
  function setLevelUi() { document.querySelectorAll('#lv button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.l === level))); }
  async function load(opts = {}) {
    $('#main').innerHTML = '<div class="load"><b>🐧</b>' + (opts.fresh ? 'Пелле пишет выпуск заново…' : 'Пелле несёт газету… (новый уровень пишется около минуты)') + '</div>';
    const q = opts.fresh ? fetch('/api/avis', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ day, level, fresh: opts.fresh }) })
      : fetch('/api/avis?' + new URLSearchParams({ ...(day ? { day } : {}), ...(level ? { level } : {}) }));
    const r = await q.catch(() => null), j = r ? await r.json().catch(() => ({})) : {};
    if (!r || !r.ok || j.error) { $('#main').innerHTML = '<div class="load"><b>☕</b>' + ({ ai_limit: 'Gemini сейчас занят (лимит). Попробуй через пару минут.', no_key: 'У сайта нет ключа Gemini.', no_news: 'Ленты новостей не ответили. Попробуй ↻ позже.', no_day: 'За этот день выпуска нет.' }[j.error] || 'Не получилось собрать выпуск. Попробуй ↻ через минуту.') + '</div>'; return; }
    data = j; day = j.day; level = j.level; setLevelUi();
    $('#day').innerHTML = j.days.map(d => '<option value="' + d + '"' + (d === day ? ' selected' : '') + '>' + fmt(d) + '</option>').join('');
    render();
  }
  $('#lv').addEventListener('click', e => { const b = e.target.closest('button'); if (!b || b.dataset.l === level) return; level = b.dataset.l; try { localStorage.setItem('avis-level', level); } catch (x) {}
    setLevelUi(); fetch('/api/avis/level', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ level }) }); load(); });
  $('#day').addEventListener('change', e => { day = e.target.value; load(); });
  $('#again').addEventListener('click', () => { if (confirm(day === data?.days?.[0] ? 'Собрать сегодняшний выпуск заново — со свежими новостями (около минуты)?' : 'Написать этот выпуск заново (около минуты)?')) load({ fresh: day === data?.days?.[0] ? 'news' : 'text' }); });
  const tip = $('#tip');
  const sentOf = el => { const p = el.closest('p, li, h3') || el; const t = p.textContent; return (t.split(/(?<=[.!?])\\s+/).find(x => x.includes(el.textContent.split(' ')[0])) || t).trim().slice(0, 240); };
  function place(rect) { tip.style.left = Math.max(8, Math.min(innerWidth - tip.offsetWidth - 8, rect.left)) + 'px'; tip.style.top = (rect.bottom + 6 + tip.offsetHeight > innerHeight ? rect.top - tip.offsetHeight - 6 : rect.bottom + 6) + 'px'; }
  async function showTip(text, rect, ex) { // любое слово или фраза: перевод и «+ в словарь»
    tip.innerHTML = '<b>' + esc(text) + '</b> <small>ищу перевод…</small>'; tip.hidden = false; place(rect);
    const r = await trWord(text), w = text.includes(' ') ? text : r.no, k = w.toLowerCase();
    if (tip.hidden) return;
    tip.innerHTML = '<b>' + esc(w) + '</b> — ' + esc(r.ru || '—') + (r.note ? '<br><small>' + esc(r.note) + '</small>' : '') + '<br>'
      + (added.has(k) ? '<small>✓ уже в словаре</small>' : r.ru ? '<button class="add" type="button" data-w="' + esc(w) + '" data-tr="' + esc(r.ru) + '" data-ex="' + esc(ex) + '">+ в словарь</button>' : '');
    place(rect);
  }
  async function addWord(a) {
    a.disabled = true; const r = await fetch('/api/avis/word', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ w: a.dataset.w, tr: a.dataset.tr, ex: a.dataset.ex }) }).catch(() => null);
    if (!r || !r.ok) { a.disabled = false; return; }
    const k = a.dataset.w.toLowerCase(); added.add(k); try { localStorage.setItem('avis-added', JSON.stringify([...added].slice(-2000))); } catch (x) {}
    document.querySelectorAll('.add[data-w]').forEach(b => { if (b.dataset.w.toLowerCase() === k) { b.textContent = '✓ в словаре'; b.classList.add('done'); b.disabled = true; } });
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('.add[data-w]');
    if (a) { addWord(a); return; }
    if (e.target.closest('#tip')) return;
    const sel = getSelection(); if (sel && !sel.isCollapsed && sel.toString().trim().includes(' ')) return; // выделили фразу — переводит onSel
    const w = e.target.closest('.w');
    if (w) { showTip(w.textContent, w.getBoundingClientRect(), sentOf(w)); return; }
    tip.hidden = true;
    const s = e.target.closest('[data-say]');
    if (s) say(s, data.items[+s.dataset.say]);
  });
  const onSel = () => setTimeout(() => { // выделили несколько слов — перевод фразы
    const sel = getSelection(); if (!sel || sel.isCollapsed) return;
    const txt = sel.toString().trim().replace(/\\s+/g, ' ');
    if (!txt.includes(' ') || txt.length > 200 || !sel.anchorNode || !sel.anchorNode.parentElement || !sel.anchorNode.parentElement.closest('.tx')) return;
    showTip(txt, sel.getRangeAt(0).getBoundingClientRect(), sentOf(sel.anchorNode.parentElement));
  }, 10);
  document.addEventListener('mouseup', onSel); document.addEventListener('touchend', () => setTimeout(onSel, 300));
  addEventListener('scroll', () => { tip.hidden = true; }, { passive: true });
  let audio = null, stop = false;
  async function say(btn, x) { // голос Gemini (как в учебнике, /api/norsk/tts — до 500 знаков за раз), без него — голос браузера
    if (audio) { stop = true; audio.pause(); audio = null; speechSynthesis.cancel(); btn.textContent = '🔊 Les høyt'; return; }
    stop = false; btn.textContent = '⏹ Stopp';
    const text = x.title + '. ' + x.text.replace(/\\[\\[(.+?)\\]\\]/g, '$1'), parts = [];
    for (const s of text.split(/(?<=[.!?])\\s+/)) { if (parts.length && (parts[parts.length - 1] + ' ' + s).length < 450) parts[parts.length - 1] += ' ' + s; else parts.push(s.slice(0, 480)); }
    for (const t of parts) {
      if (stop) break;
      const ok = await new Promise(res => { audio = new Audio('/api/norsk/tts?t=' + encodeURIComponent(t)); audio.onended = () => res(true); audio.onerror = () => res(false); audio.play().catch(() => res(false)); });
      if (!ok && !stop) { await new Promise(res => { const u = new SpeechSynthesisUtterance(t); u.lang = 'nb-NO'; u.onend = res; u.onerror = res; speechSynthesis.speak(u); }); }
    }
    audio = null; btn.textContent = '🔊 Les høyt';
  }
  load();
})();
</script></body></html>`;
