// Общий перевод для всего сайта (статьи блога, «Нарисуй мне», карточки и всё, что переводится в кабинете кнопкой «🌐 Перевести»).
// Gemini (ключ GEMINI_KEY в Cloudflare или meta.gemini_key) — по смыслу и с HTML; если ключа нет или все модели заняты — Workers AI (m2m100).
// about — одна строка для Gemini: что это за тексты (по умолчанию — статья блога).
const stripTags = s => String(s || '').replace(/\[\[[\s\S]*?\]\]/g, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
export const LANGS = ['en', 'ru', 'lv'];
const BLOG = 'The strings are consecutive parts of one blog post written by an illustrator about drawing.';
export const ABOUT = {
  blog: BLOG,
  cards: 'The strings are short texts of collectible cards on an illustrator\'s website for kids and adults: card titles, funny descriptions and names of card stats. Keep the humour and wordplay, keep it short, keep character names (Polly, Titos, Mr.Chew, Pumpkin Head) in their usual form for the language.',
  titos: 'The strings are parts of a funny detective case for kids and adults on an illustrator\'s website: Detective Titos (a sleepy detective who lives on coffee) investigates in Wobbleland. Keep the humour, the short sentences and the names of characters, towns and streets in their usual form for the language.',
  short: 'The strings are short interface texts and labels of an illustrator\'s website.',
};
// несколько языков сразу: { en: [...], lv: [...] }; не вышло для языка — его нет в ответе (поле можно перевести позже)
export async function translateTo(env, texts, from, langs, about = BLOG) {
  const out = {}, errs = {};
  await Promise.all(langs.filter(l => l !== from && LANGS.includes(l)).map(async l => {
    try { out[l] = (await translateAll(env, texts, from, l, false, about)).texts.map(x => String(x ?? '')); } catch (e) { errs[l] = e.code || 'ai'; }
  }));
  return { tr: out, errors: errs };
}

// перевод: Workers AI (m2m100). Теги внутри абзаца прячем за метками ⟦1⟧; если метки потерялись — переводим чистый текст.
async function translateOne(env, text, from, to) {
  if (!text.trim()) return text;
  const run = async s => {
    if (!env.AI) {
      if (env.DEV_FAKE_LOGIN === '1') return `[${to}] ${s}`;
      throw Object.assign(new Error('ai'), { code: 'ai' });
    }
    try {
      const r = await env.AI.run('@cf/meta/m2m100-1.2b', { text: s, source_lang: from, target_lang: to });
      return r.translated_text || '';
    } catch (e) {
      const msg = String(e && e.message || e);
      throw Object.assign(new Error(msg), { code: /limit|quota|429|4006|neuron/i.test(msg) ? 'ai_limit' : 'ai' });
    }
  };
  // m2m100 обрезает длинные куски — длинный абзац переводим по предложениям (оформление внутри него теряется, но текст целый)
  if (text.length > 380) {
    const plain = stripTags(text), parts = [];
    let cur = '';
    for (const sent of plain.match(/[^.!?…]+[.!?…]+["»”')]*\s*|[^.!?…]+$/g) || [plain]) {
      if ((cur + sent).length > 350 && cur) { parts.push(cur); cur = ''; }
      cur += sent;
    }
    if (cur) parts.push(cur);
    const out = [];
    for (const part of parts) out.push(await run(part.trim()));
    return out.join(' ');
  }
  const tags = [];
  const masked = text.replace(/<[^>]+>/g, t => { tags.push(t); return `⟦${tags.length}⟧`; });
  if (!tags.length) return run(text);
  const out = await run(masked);
  if (tags.every((_, i) => out.includes(`⟦${i + 1}⟧`))) return out.replace(/⟦(\d+)⟧/g, (_, n) => tags[n - 1]);
  return run(stripTags(text));
}
// Gemini (ключ GEMINI_KEY в Cloudflare): переводит по смыслу и держит HTML. Модели по очереди — если одна перегружена, берём следующую.
const LANG_NAME = { ru: 'Russian', en: 'English', lv: 'Latvian' };
// Flash-Lite — быстрые (30 абзацев ≈ 8 с) и реже перегружены; полная Flash — запасная
const GEMINI_MODELS = ['gemini-3.1-flash-lite', 'gemini-flash-lite-latest', 'gemini-3.5-flash-lite', 'gemini-3.5-flash'];
// ключ Gemini: из Cloudflare (GEMINI_KEY) или из настроек редактора (meta.gemini_key)
export async function geminiKey(env) {
  if (env.GEMINI_KEY) return env.GEMINI_KEY;
  const r = await env.DB.prepare("SELECT value FROM meta WHERE key = 'gemini_key'").first().catch(() => null);
  return r && r.value || '';
}
export async function gemini(env, texts, from, to, key, about = BLOG) {
  const prompt = `You are a careful professional translator. Translate every string in the JSON array below from ${LANG_NAME[from]} to ${LANG_NAME[to]}.
${about}
Rules:
- Translate faithfully and accurately. Do not add, remove, soften or change any facts, opinions, numbers or details. Do not add your own jokes, idioms or explanations.
- Make it read naturally and fluently in ${LANG_NAME[to]}, keeping the author's tone (personal, friendly), but stay close to the original meaning sentence by sentence.
- Keep every HTML tag and attribute exactly as it is, in the same places; translate only the human-readable text between tags.
- Keep brand, product and personal names (e.g. Moleskine, Talens, SM*LT, Pigeon Polly), numbers and units unchanged.
- If a string is a comma-separated list of short tags, return a comma-separated list of lowercase tags. Empty strings stay empty.
Return only a JSON array of exactly ${texts.length} strings in the same order.

${JSON.stringify(texts)}`;
  const models = env.GEMINI_MODEL ? [env.GEMINI_MODEL, ...GEMINI_MODELS] : GEMINI_MODELS;
  let lastErr = 'ai';
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt) await new Promise(res => setTimeout(res, 8000)); // все заняты — ждём и пробуем ещё раз
  for (const model of models) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST', headers: { 'x-goog-api-key': key, 'content-type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2, responseMimeType: 'application/json', responseSchema: { type: 'ARRAY', items: { type: 'STRING' } } } }),
    });
    if (r.status === 400 || r.status === 401 || r.status === 403) { const t = await r.text(); if (/API key|PERMISSION|UNAUTHENTICATED|API_KEY/i.test(t)) throw Object.assign(new Error('bad_key'), { code: 'bad_key' }); }
    if (!r.ok) { lastErr = r.status === 429 ? 'ai_limit' : 'ai'; continue; } // 404 (модель закрыли), 503 (перегружена), 429 (лимит) — пробуем следующую
    try {
      const d = await r.json();
      const out = JSON.parse(d.candidates[0].content.parts.map(p => p.text || '').join(''));
      if (Array.isArray(out) && out.length === texts.length) return out.map(x => String(x ?? ''));
    } catch (e) { /* ответ не разобрался — следующая модель */ }
  }
  }
  throw Object.assign(new Error(lastErr), { code: lastErr });
}

// strict: только Gemini (для статей) — если не вышло, ошибка, а не слабый перевод
export async function translateAll(env, texts, from, to, strict = false, about = BLOG) {
  const out = [];
  const key = await geminiKey(env);
  const err = code => Object.assign(new Error(code), { code, status: code === 'ai_limit' ? 429 : code === 'no_key' || code === 'bad_key' ? 400 : 502 });
  if (strict && !key) throw err('no_key');
  if (key) {
    try {
      const res = await gemini(env, texts, from, to, key, about);
      // пустой ответ на непустой абзац — этот абзац переводим запасным переводчиком
      for (let i = 0; i < res.length; i++) {
        if (texts[i].trim() && !res[i].trim()) {
          try { res[i] = await translateOne(env, texts[i], from, to); } catch (e) { res[i] = texts[i]; }
        }
      }
      return { texts: res, engine: 'gemini' };
    } catch (e) { if (strict) throw err(e.code || 'ai'); /* иначе — запасной вариант ниже */ }
  }
  try {
    for (let i = 0; i < texts.length; i += 4) out.push(...await Promise.all(texts.slice(i, i + 4).map(s => translateOne(env, s, from, to))));
  } catch (e) {
    const err = new Error(e.code || 'ai'); err.status = e.code === 'ai_limit' ? 429 : 502; err.code = e.code || 'ai'; throw err;
  }
  return { texts: out, engine: 'cloudflare' };
}
