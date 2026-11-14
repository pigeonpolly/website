// 🃏 Таро (кабинет → «🃏 Таро», только Алина-админ; docs/admin.md «Таро»): «Таро кошек» — расклады, как их делать,
// значения карт в прямом и перевёрнутом положении. Данные — worker/tarot-data.js, наружу только через API:
// GET /api/admin/tarot → { spreads, prep, cards }. Расклады не сохраняются — всё на странице. Устроено как worker/runes.js.
import { TAROT, TAROT_SPREADS, TAROT_PREP, TAROT_PLAIN, TAROT_POS_ASK } from './tarot-data.js';

// s/do — «простыми словами» и «что сделать» (прямая), sr/dr — то же для перевёрнутой; ask/act — вопрос места и место-действие
const CARDS = TAROT.map(c => { const p = TAROT_PLAIN[c.n] || []; return { ...c, s: p[0] || '', do: p[1] || '', sr: p[2] || '', dr: p[3] || '' }; });
const SPREADS = TAROT_SPREADS.map(sp => ({ ...sp, pos: sp.pos.map((p, i) => { const a = (TAROT_POS_ASK[sp.id] || [])[i] || []; return { ...p, ask: a[0] || p.about, act: !!a[1] }; }) }));

export async function tarotApi(req, env, url, h) {
  if (url.pathname !== '/api/admin/tarot') return null;
  const u = await h.currentUser(req, env);
  if (!u || !(await h.isAdmin(u, env))) return h.fail(403, 'admin');
  return h.json({ spreads: SPREADS, prep: TAROT_PREP, cards: CARDS });
}
