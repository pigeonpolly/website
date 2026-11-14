// 🔮 Руны (кабинет → «🔮 Руны», только Алина-админ; docs/admin.md «Руны»): колода «Runic Oracle» —
// расклады, как их делать, и толкования карт по-русски. Данные — worker/runes-data.js, наружу только через API:
// GET /api/admin/runes → { spreads, prep, cards }. Расклады не сохраняются — всё на странице.
import { RUNES, RUNE_SPREADS, RUNE_PREP, RUNE_PLAIN, RUNE_POS_ASK } from './runes-data.js';

// s/do — «простыми словами» и «что сделать»; ask/act — вопрос места расклада и место-действие
const CARDS = RUNES.map(c => ({ ...c, s: (RUNE_PLAIN[c.n] || [])[0] || '', do: (RUNE_PLAIN[c.n] || [])[1] || '' }));
const SPREADS = RUNE_SPREADS.map(sp => ({ ...sp, pos: sp.pos.map((p, i) => { const a = (RUNE_POS_ASK[sp.id] || [])[i] || []; return { ...p, ask: a[0] || p.about, act: !!a[1] }; }) }));

export async function runesApi(req, env, url, h) {
  if (url.pathname !== '/api/admin/runes') return null;
  const u = await h.currentUser(req, env);
  if (!u || !(await h.isAdmin(u, env))) return h.fail(403, 'admin');
  return h.json({ spreads: SPREADS, prep: RUNE_PREP, cards: CARDS });
}
