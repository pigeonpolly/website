// Кабинет зельевара — главная игра птички (docs/brew.md). Этап 0: таблицы, перенос старой Зельеварни, состояние, флаг brewOn.
// Ничего старого не меняет и не удаляет: potion_book, users.inv (сумка ингредиентов — общая с лабиринтом), gifts, badges, cats_alive — как были.
// Перенос — лениво, при первом GET /api/brew игрока: старые рецепты → brew_book (recipe 'old:<combo>'), за них стартовый опыт.
// Уровень без потолка: на переход L → L+1 нужно round(brewXpBase · L^brewXpPow) опыта; xp в brew_state — всего за всё время.
// API: GET /api/brew → { on, me: {level, xp, need, kinds, slots, brews, washEvery, dirt, cats, larisa}, shelf, inv, season, book }.

export const BREW_TABLES = [
  // brews — варок с последней мойки котла; dirt — сколько грязи набралось (неудачи и редкие зелья — больше); shelves — купленные полки (+brewShelfSlots мест каждая)
  // larisa — до какого времени (мс) крыса Лариса моет котёл сама; migrated — 1, когда старая Зельеварня перенесена
  'CREATE TABLE IF NOT EXISTS brew_state (user_id INTEGER PRIMARY KEY, xp INTEGER DEFAULT 0, brews INTEGER DEFAULT 0, dirt INTEGER DEFAULT 0, shelves INTEGER DEFAULT 0, larisa INTEGER DEFAULT 0, migrated INTEGER DEFAULT 0, created_at INTEGER)',
  // книга: recipe — канонический рецепт «ing×n>ing×n» (порядок важен) или 'old:<combo>' из старой Зельеварни; rarity 0 — не получилось, 1…5 — обычное…легендарное
  'CREATE TABLE IF NOT EXISTS brew_book (user_id INTEGER NOT NULL, recipe TEXT NOT NULL, rarity INTEGER NOT NULL, n INTEGER DEFAULT 1, created_at INTEGER, PRIMARY KEY (user_id, recipe))',
  // шкаф: сколько бутылочек этого рецепта стоит (одна ячейка — один рецепт, число — сколько)
  'CREATE TABLE IF NOT EXISTS brew_shelf (user_id INTEGER NOT NULL, recipe TEXT NOT NULL, rarity INTEGER NOT NULL, n INTEGER DEFAULT 1, updated_at INTEGER, PRIMARY KEY (user_id, recipe))',
  // биржа зелий (этап Д): лоты игроков, покупают жители Воббленда
  'CREATE TABLE IF NOT EXISTS brew_market (id INTEGER PRIMARY KEY AUTOINCREMENT, seller_id INTEGER NOT NULL, recipe TEXT NOT NULL, rarity INTEGER NOT NULL, price INTEGER NOT NULL, created_at INTEGER, sold_at INTEGER, buyer TEXT)',
  'CREATE INDEX IF NOT EXISTS brew_market_open ON brew_market (sold_at, rarity)',
];
export const BREW_RULES = {
  brewOn: 1, // 0 — выключено, 1 — видит только админ (проверка Алиной), 2 — все
  brewXpBase: 50, brewXpPow: 1.4, // опыт на уровень: base · L^pow
  brewKindsEvery: 5, brewKindsMax: 8, // разных ингредиентов за варку: 2 на 1–4 ур., +1 каждые N уровней, не больше max
  brewSlots: 6, brewSlotsEvery: 3, brewShelfSlots: 4, // мест в шкафу на старте, +1 каждые N уровней, полка за пуговки — +N мест
  brewWashEvery: 10, // мыть котёл каждые N варок
  brewOldXp: 15, // опыта за каждый рецепт старой Зельеварни при переносе (× уровень зелья)
};
export const BREW_RANGE = { brewOn: [0, 2], brewXpBase: [1, 10000], brewXpPow: [1, 3], brewKindsEvery: [1, 100], brewKindsMax: [2, 12], brewSlots: [1, 100], brewSlotsEvery: [1, 100],
  brewShelfSlots: [1, 100], brewWashEvery: [2, 100], brewOldXp: [0, 1000] };
export const BREW_INT = ['brewOn', 'brewXpBase', 'brewKindsEvery', 'brewKindsMax', 'brewSlots', 'brewSlotsEvery', 'brewShelfSlots', 'brewWashEvery', 'brewOldXp'];

// уровень по всему опыту: { level, xp — опыт внутри уровня, need — сколько нужно на следующий }
export function levelOf(total, R) {
  let L = 1, left = Math.max(0, Math.floor(total || 0));
  for (;;) { const need = Math.round(R.brewXpBase * L ** R.brewXpPow); if (left < need) return { level: L, xp: left, need }; left -= need; L++; }
}
export const kindsOf = (L, R) => Math.min(R.brewKindsMax, 2 + Math.floor(L / R.brewKindsEvery));
export const slotsOf = (L, shelves, R) => R.brewSlots + Math.floor((L - 1) / R.brewSlotsEvery) + shelves * R.brewShelfSlots;

// видно ли игру этому игроку (флаг brewOn)
export async function brewVisible(u, R, isAdmin) { return !!u && (R.brewOn === 2 || (R.brewOn === 1 && await isAdmin(u))); }

// состояние игрока; при первом заходе — перенос старой Зельеварни (идемпотентно: INSERT OR IGNORE + метка migrated)
async function stateOf(env, u, R, now) {
  let s = await env.DB.prepare('SELECT * FROM brew_state WHERE user_id = ?').bind(u.id).first();
  if (s && s.migrated) return s;
  await env.DB.prepare('INSERT OR IGNORE INTO brew_state (user_id, created_at) VALUES (?, ?)').bind(u.id, now).run();
  const old = (await env.DB.prepare('SELECT combo, tier, n, created_at FROM potion_book WHERE user_id = ? AND tier > 0').bind(u.id).all()).results;
  const st = [], xp = old.reduce((a, r) => a + R.brewOldXp * Math.max(1, r.tier), 0);
  for (const r of old) st.push(env.DB.prepare('INSERT OR IGNORE INTO brew_book (user_id, recipe, rarity, n, created_at) VALUES (?, ?, ?, ?, ?)').bind(u.id, 'old:' + r.combo, r.tier, r.n || 1, r.created_at || now));
  // опыт начисляется вместе с меткой — только если метки ещё не было (повторный заход ничего не удвоит)
  st.push(env.DB.prepare('UPDATE brew_state SET xp = xp + ?, migrated = 1 WHERE user_id = ? AND migrated = 0').bind(xp, u.id));
  for (let i = 0; i < st.length; i += 50) await env.DB.batch(st.slice(i, i + 50));
  return env.DB.prepare('SELECT * FROM brew_state WHERE user_id = ?').bind(u.id).first();
}

// h: json, fail, currentUser, needUser, isAdmin(u), rules, now, invOf(u), season()
export async function brewApi(req, env, url, h) {
  const p = url.pathname, m = req.method, { json } = h, R = h.rules();
  if (m === 'GET' && p === '/api/brew') {
    const u = await h.currentUser(req, env);
    if (!u || !u.nick || u.banned) return json({ on: false, me: null });
    if (!(await brewVisible(u, R, x => h.isAdmin(x)))) return json({ on: false, me: null });
    const s = await stateOf(env, u, R, h.now()), lv = levelOf(s.xp, R);
    const shelf = (await env.DB.prepare('SELECT recipe, rarity, n FROM brew_shelf WHERE user_id = ? ORDER BY updated_at DESC').bind(u.id).all()).results;
    const book = (await env.DB.prepare('SELECT recipe, rarity, n, created_at FROM brew_book WHERE user_id = ? ORDER BY created_at DESC').bind(u.id).all()).results;
    return json({ on: true, season: h.season(), inv: h.invOf(u), shelf, book,
      me: { id: u.id, nick: u.nick, level: lv.level, xp: lv.xp, need: lv.need, total: s.xp, kinds: kindsOf(lv.level, R), slots: slotsOf(lv.level, s.shelves, R),
        brews: s.brews, washEvery: R.brewWashEvery, dirt: s.dirt, cats: u.cats_alive || 0, larisa: s.larisa > h.now() ? s.larisa : 0, buttons: u.buttons || 0 } });
  }
  return null;
}
