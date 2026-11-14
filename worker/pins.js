// Кабинет → 📌 Пины (site/assets/posts-admin.js): POST /api/admin/pin-text — Gemini смотрит на картинку пина и пишет
// тексты для Pinterest (EN): надписи на пине (kicker, headline, hand, items) и поля Pinterest (title, desc, alt, topics).
// Факты об Алине не выдумывать: только то, что видно на картинке, и подсказка Алины (hint).
import { GEMINI_MODELS, geminiKey } from './translate.js';

const S = { type: 'STRING' };
const SCHEMA = { type: 'OBJECT', required: ['headline', 'hand', 'title', 'desc', 'alt', 'topics'], properties: {
  kicker: S, headline: S, hand: S, items: { type: 'ARRAY', items: S }, name: S, title: S, desc: S, alt: S, topics: S } };

const KIND = {
  art: 'a pin that shows one artwork in full beauty; headline = short poetic caption (3–7 words)',
  palette: 'a color palette pin; name = a short evocative palette name (2–4 words, Title Case) based on the artwork; headline = the same name',
  meme: 'a relatable, gentle artist meme; headline = the meme text on top (max 14 words, first person, funny but kind); hand = a short sticky-note punchline (max 5 words)',
  read: 'a pin that leads to a blog article; headline = article-style headline (max 8 words); hand = one teaser sentence (max 18 words)',
  video: 'a pin for a free video lesson; headline = lesson title (max 6 words); hand = one inviting sentence (max 14 words)',
  prompts: 'a list of drawing prompts; headline = list title (max 6 words), kicker = 2–3 words; items = exactly 8 short drawing ideas inspired by the image (2–4 words each, lowercase)',
  steps: 'a process pin (sketch → finished); headline = max 6 words; items = one short label per photo (1–3 words)',
  grid: 'a series of artworks in a grid; kicker = 2–4 words; headline = max 6 words',
};

export async function pinTextApi(req, env, h) {
  const u = await h.needUser(req, env); if (!(await h.isAdmin(u, env))) h.fail(403, 'admin');
  if (req.method !== 'POST') h.fail(405, 'method');
  const b = await req.json().catch(() => ({}));
  const img = String(b.img || '').match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
  if (!img || img[2].length > 1.5e6) h.fail(400, 'img');
  const key = await geminiKey(env); if (!key) h.fail(502, 'no_key');
  const prompt = `You write Pinterest pins (English) for Pigeon Polly Art Lab (pigeonpolly.com) — the cozy art site of Alina Otkinska, an artist from Riga
(watercolor, ink, acrylic, sketchbooks, a pigeon character named Polly). Audience: women 18–34 who like art, cozy home, books, TV shows, animals.
Pin type: ${KIND[b.kind] || KIND.art}.
${b.hint ? `Alina's note about the image (trust it): ${String(b.hint).slice(0, 500)}\n` : ''}${b.link ? `The pin links to: ${String(b.link).slice(0, 300)}\n` : ''}${b.colors ? `Palette colors: ${String(b.colors).slice(0, 300)}\n` : ''}
Look carefully at the image. Rules: describe only what is visible; never invent facts about Alina (no dates, places, stories, materials unless obvious or in her note);
warm, simple, human tone, no hashtags, no emojis, no clickbait words like "stunning" or "must-see".
Return JSON: kicker, headline, hand (one short line), items (array, only if the type needs it), name (palettes only),
title (Pinterest title, max 90 chars, searchable keywords first), desc (Pinterest description, 2–3 sentences, max 450 chars, natural keywords),
alt (alt text for blind users, one sentence describing the image), topics (4–6 comma-separated lowercase Pinterest topics).`;
  let err = 'ai';
  for (const model of GEMINI_MODELS.slice().reverse()) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST', headers: { 'x-goog-api-key': key, 'content-type': 'application/json' }, signal: AbortSignal.timeout(40000),
      body: JSON.stringify({ contents: [{ parts: [{ inline_data: { mime_type: img[1], data: img[2] } }, { text: prompt }] }],
        generationConfig: { temperature: 0.7, responseMimeType: 'application/json', responseSchema: SCHEMA } }),
    }).catch(() => null);
    if (!r) continue;
    if (!r.ok) { err = r.status === 429 ? 'ai_limit' : 'ai'; continue; }
    try {
      const d = await r.json(), out = JSON.parse(d.candidates[0].content.parts.map(p => p.text || '').join(''));
      if (out && out.title && out.headline) return h.json(out);
    } catch (e) { /* следующая модель */ }
  }
  h.fail(err === 'ai_limit' ? 429 : 502, err);
}
