// Кабинет → «💡 Темы для блога»: по кнопке собираем, что сейчас ищут и обсуждают в сфере Алины,
// и Gemini делает из этого 10 тем статей (заголовок, ключевые слова, на какую страницу сайта сослаться).
// Источники (бесплатные, без ключей): подсказки поиска Google (что люди допечатывают), топ недели в сабреддитах.
// Не ответил источник — работаем с остальными. Последний список хранится в meta.blog_ideas.
import { geminiKey, GEMINI_MODELS } from './translate.js';

// с чего люди начинают запрос; к каждой фразе Google добавит свои продолжения
const SEEDS = ['drawing prompts', 'drawing ideas', 'sketchbook ideas', 'art challenge', 'cozy games', 'cozy browser games', 'color palette',
  'how to draw', 'art block', 'drawing for beginners', 'watercolor ideas', 'cute illustration', 'learn to draw as an adult', 'drawing habit'];
const SUBS = ['ArtistLounge', 'sketchbooks', 'drawing', 'learnart', 'CozyGamers', 'WebGames'];
// страницы сайта, на которые статья может вести
const PAGES = {
  '/challenge/': 'daily drawing challenge: a theme, colours and a timer every day, wall of drawings',
  '/palettes/': 'colour palettes', '/titos/': 'Detective Titos: tiny mystery cases (browser game)',
  '/pancakes/': "Polly's Pancakes (cozy browser game)", '/potions/': 'potion lab (browser game)', '/rain/': 'Button Rain (browser game)',
  '/shift/': 'Shift with Polly: body-doubling focus timer with cozy music', '/flock/': 'own pixel bird, room, garden',
  '/polly-helps/': 'Polly, help me draw: drawing helper', '/requests/': 'Draw this for me: visitors suggest what Alina draws',
  '/advent/': 'cozy advent calendar (December)', '/wobbleland/': 'Wobbleland: illustrated world and comics', '/e-books/': "Alina's e-books",
  '/art-portfolio/': "Alina's sketchbook and art series",
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

async function suggest(q) {
  const r = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&hl=en&q=${encodeURIComponent(q)}`, { signal: AbortSignal.timeout(5000) });
  if (!r.ok) return [];
  const d = await r.json().catch(() => null);
  return Array.isArray(d) && Array.isArray(d[1]) ? d[1].map(String).filter(s => s !== q).slice(0, 8) : [];
}
async function reddit(sub) {
  const r = await fetch(`https://www.reddit.com/r/${sub}/top.json?t=week&limit=8`, { headers: { 'user-agent': 'pigeonpolly.com blog ideas (by Alina)' }, signal: AbortSignal.timeout(5000) });
  if (!r.ok) return [];
  const d = await r.json().catch(() => null);
  return ((d && d.data && d.data.children) || []).map(c => c.data).filter(x => x && !x.over_18 && !x.stickied).map(x => String(x.title).slice(0, 140));
}

async function ask(env, key, prompt) {
  const schema = { type: 'ARRAY', items: { type: 'OBJECT', required: ['title_en', 'title_ru', 'idea_ru', 'keywords', 'why_ru', 'page'], properties: {
    title_en: { type: 'STRING' }, title_ru: { type: 'STRING' }, idea_ru: { type: 'STRING' }, keywords: { type: 'ARRAY', items: { type: 'STRING' } },
    why_ru: { type: 'STRING' }, page: { type: 'STRING' }, when_ru: { type: 'STRING' } } } };
  let err = 'ai';
  for (const model of GEMINI_MODELS.slice().reverse()) { // для идей — сначала модель поумнее, лёгкие — запасные
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST', headers: { 'x-goog-api-key': key, 'content-type': 'application/json' }, signal: AbortSignal.timeout(40000),
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, responseMimeType: 'application/json', responseSchema: schema } }),
    }).catch(() => null);
    if (!r) continue;
    if (r.status === 400 || r.status === 401 || r.status === 403) { const t = await r.text(); if (/API key|PERMISSION|UNAUTHENTICATED|API_KEY/i.test(t)) throw Object.assign(new Error('bad_key'), { code: 'bad_key' }); }
    if (!r.ok) { err = r.status === 429 ? 'ai_limit' : 'ai'; continue; }
    try {
      const d = await r.json();
      const out = JSON.parse(d.candidates[0].content.parts.map(p => p.text || '').join(''));
      if (Array.isArray(out) && out.length) return out;
    } catch (e) { /* не разобрался — следующая модель */ }
  }
  throw Object.assign(new Error(err), { code: err });
}

async function build(env, note) {
  const key = await geminiKey(env);
  if (!key) throw Object.assign(new Error('no_key'), { code: 'no_key' });
  const d = new Date(), month = MONTHS[d.getUTCMonth()], next = MONTHS[(d.getUTCMonth() + 1) % 12];
  const seeds = [...SEEDS, `drawing prompts ${month.toLowerCase()}`, `drawing prompts ${next.toLowerCase()}`, `${next.toLowerCase()} art challenge`];
  const [sg, rd, posts] = await Promise.all([
    Promise.all(seeds.map(q => suggest(q).catch(() => []))),
    Promise.all(SUBS.map(s => reddit(s).catch(() => []))),
    env.DB.prepare("SELECT t_en, t_ru, views FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC LIMIT 40").all().then(r => r.results).catch(() => []),
  ]);
  const searches = seeds.map((q, i) => sg[i].length ? `- ${q}: ${sg[i].join('; ')}` : '').filter(Boolean);
  const threads = SUBS.map((s, i) => rd[i].length ? `- r/${s}: ${rd[i].join(' | ')}` : '').filter(Boolean);
  const top = posts.slice().sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
  const prompt = `You help Alina Otkinska, an illustrator and learning experience designer from Riga, plan blog posts for her website pigeonpolly.com.
The site is "a cozy little world for tired grown-ups": draw a daily prompt, solve a tiny mystery, bake pancakes, decorate your pixel bird's house. Audience: adults 25–40, cozy games, sketchbooks, drawing for yourself after work, Neopets nostalgia. Main language English (also Russian, Latvian).
Today is ${d.toISOString().slice(0, 10)}.

What people type into Google right now (Google autocomplete for seed phrases):
${searches.join('\n') || '(no data)'}

Top posts of this week in related Reddit communities:
${threads.join('\n') || '(no data)'}

Her already published posts (do not repeat them):
${posts.map(p => '- ' + (p.t_en || p.t_ru)).join('\n') || '(none yet)'}
${top.length ? `Most read: ${top.map(p => `${p.t_en || p.t_ru} (${p.views || 0} views)`).join('; ')}` : ''}

Pages of her site an article can lead to:
${Object.entries(PAGES).map(([p, a]) => `- ${p} — ${a}`).join('\n')}
${note ? `\nAlina's wish for this list: ${note}\n` : ''}
Suggest 10 blog post ideas she can write herself (she is an artist; no fake facts about her life, no product reviews she has not done).
- Base each on real search demand above (use the actual phrases as keywords) or on a Reddit discussion, or on a date in the next 6 weeks (holidays, seasons, Inktober-like challenges).
- Prefer useful, evergreen formats people search for: lists of prompts, how-to, palettes, "ideas when you're tired", beginner advice, cozy game lists that include her games.
- Each post must naturally lead to one page of her site from the list.
- title_en: catchy English title containing the main keyword. title_ru: the same in Russian (gender-neutral). idea_ru: 1–2 sentences in Russian, what to write and how to structure it. keywords: 3–5 English search phrases. why_ru: one short Russian sentence why now (which search or discussion). page: the site path from the list. when_ru: when to publish (e.g. "до 1 ноября"), or empty.
Order from most promising to least.`;
  const ideas = (await ask(env, key, prompt)).slice(0, 12).map(x => ({
    title_en: String(x.title_en || '').slice(0, 200), title_ru: String(x.title_ru || '').slice(0, 200), idea_ru: String(x.idea_ru || '').slice(0, 600),
    keywords: (Array.isArray(x.keywords) ? x.keywords : []).map(String).slice(0, 6), why_ru: String(x.why_ru || '').slice(0, 300),
    page: PAGES[x.page] ? x.page : '', when_ru: String(x.when_ru || '').slice(0, 80),
  })).filter(x => x.title_en || x.title_ru);
  return { at: Math.floor(Date.now() / 1000), note: note || '', ideas, sources: { google: searches.length, reddit: threads.length } };
}

export async function ideasApi(req, env, url, h) {
  if (url.pathname !== '/api/admin/ideas') return null;
  const u = await h.needUser(req, env); if (!(await h.isAdmin(u, env))) h.fail(403, 'admin');
  if (req.method === 'GET') { let last = null; try { last = JSON.parse(await h.getMeta('blog_ideas') || 'null'); } catch (e) { /* нет */ } return h.json({ last }); }
  const b = await req.json().catch(() => ({}));
  let res;
  try { res = await build(env, String(b.note || '').slice(0, 300)); } catch (e) { h.fail(e.code === 'ai_limit' ? 429 : e.code === 'no_key' || e.code === 'bad_key' ? 400 : 502, e.code || 'ai'); }
  await h.setMeta('blog_ideas', JSON.stringify(res));
  return h.json({ last: res });
}
