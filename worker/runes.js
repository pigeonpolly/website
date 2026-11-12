// 🔮 Руны (кабинет → «🔮 Руны», только Алина-админ; docs/admin.md «Руны»): колода «Runic Oracle» —
// расклады, как их делать, и толкования карт по-русски. Данные — worker/runes-data.js, наружу только через API:
// GET /api/admin/runes → { spreads, prep, cards }. Расклады не сохраняются — всё на странице.
import { RUNES, RUNE_SPREADS, RUNE_PREP } from './runes-data.js';

export async function runesApi(req, env, url, h) {
  if (url.pathname !== '/api/admin/runes') return null;
  const u = await h.currentUser(req, env);
  if (!u || !(await h.isAdmin(u, env))) return h.fail(403, 'admin');
  return h.json({ spreads: RUNE_SPREADS, prep: RUNE_PREP, cards: RUNES });
}
