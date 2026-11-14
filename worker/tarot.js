// 🃏 Таро (кабинет → «🃏 Таро», только Алина-админ; docs/admin.md «Таро»): «Таро кошек» — расклады, как их делать,
// значения карт в прямом и перевёрнутом положении. Данные — worker/tarot-data.js, наружу только через API:
// GET /api/admin/tarot → { spreads, prep, cards }. Расклады не сохраняются — всё на странице. Устроено как worker/runes.js.
import { TAROT, TAROT_SPREADS, TAROT_PREP } from './tarot-data.js';

export async function tarotApi(req, env, url, h) {
  if (url.pathname !== '/api/admin/tarot') return null;
  const u = await h.currentUser(req, env);
  if (!u || !(await h.isAdmin(u, env))) return h.fail(403, 'admin');
  return h.json({ spreads: TAROT_SPREADS, prep: TAROT_PREP, cards: TAROT });
}
