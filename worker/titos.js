// Детектив Титос (docs/titos.md): 100 уровней-дел, кофе, пуговки за уровень.
// Таблицы: titos (птичка: уровень, кофе, текущее дело), titos_cases (дела из content/titos/*.json и кэш переводов).
// Дела собирает build.py → site/assets/titos-cases.json (RU); worker заносит их в D1 по метке meta titos_cases_<хэш> и переводит недостающее (translate.js).
// API: GET /api/titos, GET /api/titos/case, POST /api/titos/{start,clue,accuse,coffee,legacy}; кабинет — /api/admin/titos/*.
import { translateTo, ABOUT, LANGS } from './translate.js';
import { sortRound } from './titos-sort.js';

export const TITOS_TABLES = [
  // level — сколько уровней раскрыто; coffee — чашек в кофейнике на момент coffee_at (с него считается +1 в час);
  // drink_at — когда Титос пьёт следующую чашку (0 — не пьёт: дела нет, раскрыто или уснул); sleep — уснул посреди дела;
  // run — номер открытого дела (0 — нет), found — найденные улики (JSON), started — начало дела (мс);
  // bugs — когда были «Жуки» (JSON, мс, за последний час); sell_day/sell_n — сколько лишних чашек продано за сутки (по Риге)
  `CREATE TABLE IF NOT EXISTS titos (user_id INTEGER PRIMARY KEY, level INTEGER DEFAULT 0, coffee INTEGER DEFAULT 10, coffee_at INTEGER DEFAULT 0, drink_at INTEGER DEFAULT 0,
    sleep INTEGER DEFAULT 0, run INTEGER DEFAULT 0, found TEXT DEFAULT '[]', started INTEGER DEFAULT 0, bugs TEXT DEFAULT '[]', sell_day TEXT DEFAULT '', sell_n INTEGER DEFAULT 0, legacy INTEGER DEFAULT 0)`,
  // data — дело как в content/titos/NNN.json (тексты {"ru": …}, у старых дел и en/lv); tr — кэш переводов { "текст RU": { en, lv } }
  `CREATE TABLE IF NOT EXISTS titos_cases (n INTEGER PRIMARY KEY, data TEXT NOT NULL, tr TEXT DEFAULT '{}', hash TEXT, updated_at INTEGER)`,
];
// «Разбери дела»: sort_lv — пройдено уровней; sort_run — открытый раунд {lv, at, n, secret (надписи под кляксами), washed}
// «Жуки»: bugs_run — когда начата открытая игра (мс), 0 — нет
export const TITOS_ALTER = ['ALTER TABLE titos ADD COLUMN sort_lv INTEGER DEFAULT 0', "ALTER TABLE titos ADD COLUMN sort_run TEXT DEFAULT ''", 'ALTER TABLE titos ADD COLUMN bugs_run INTEGER DEFAULT 0'];
export const TITOS_RULES = {
  titosOn: true, titosLevelPct: 2.4, // пуговки за уровень: titosLevelPct % опорной цены × (1 + ⌊(ур−1)/10⌋), за каждый уровень один раз
  titosPot: 10, titosStartCups: 1, titosCupMin: 5, titosRegenMin: 60, // кофейник: вместимость; старт дела; −1 чашка каждые N мин; +1 чашка каждые N мин
  titosSortCups: 2, titosSortSec: 1, titosBlotBtn: 1, // «Разбери дела» — чашек за уровень; уровень быстрее (документов × N с) не засчитывается; смыть кляксу — N 🔘
  titosBugsCups: 5, titosBugsPerHour: 2, titosBugsSec: 10, // «Жуки» — чашек за игру, сколько раз в час; игра быстрее N с не засчитывается
  titosRefillPct: 20, titosSellPct: 1, titosSellDayMax: 20, // «Долить» полный кофейник; лишняя чашка → пуговки (не меньше 1), не больше N чашек в сутки
  titosClueSec: 3, // дело быстрее (число улик × N секунд) не засчитывается
};
export const TITOS_RANGE = { titosLevelPct: [0, 100], titosPot: [1, 50], titosStartCups: [0, 10], titosCupMin: [1, 120], titosRegenMin: [1, 1440], titosSortCups: [0, 50], titosSortSec: [0, 30], titosBlotBtn: [0, 100],
  titosBugsCups: [0, 50], titosBugsPerHour: [0, 20], titosBugsSec: [0, 60], titosRefillPct: [0, 1000], titosSellPct: [0, 100], titosSellDayMax: [0, 1000], titosClueSec: [0, 60] };
export const TITOS_INT = ['titosPot', 'titosStartCups', 'titosCupMin', 'titosRegenMin', 'titosSortCups', 'titosSortSec', 'titosBlotBtn', 'titosBugsCups', 'titosBugsPerHour', 'titosBugsSec', 'titosSellDayMax', 'titosClueSec'];
export const TITOS_PRIZES = { 30: 'rug', 50: 'pot', 90: 'board', 100: 'badge' }; // награды-вещи для комнаты (карточки наверху /titos/)
// награды за уровни — вещи для комнаты (room.js, PPCanDo.TITOS): в сумку один раз + новость reward (gifts.note titoslv:N, opened_at NULL — не видена) + flockEvent
export const TITOS_ITEMS = { 30: ['furn', 'chalkrug'], 50: ['furn', 'titospot'], 90: ['deco', 'clueboard'], 100: ['deco', 'titosbadge'] };
async function levelItem(env, h, u, n) {
  const [kind, base] = TITOS_ITEMS[n] || [];
  if (!kind || await env.DB.prepare('SELECT 1 FROM gifts WHERE user_id = ? AND kind = ? AND (item = ? OR item LIKE ?)').bind(u.id, kind, base, base + ':%').first()) return null;
  let item = base;
  if (base === 'titospot') { // кофейник: N-й по счёту на сайте — свой цвет кофе (room.js potCoffee)
    const r = await env.DB.prepare("INSERT INTO meta (key, value) VALUES ('titos_pot_n', '1') ON CONFLICT(key) DO UPDATE SET value = CAST(value AS INTEGER) + 1 RETURNING value").first();
    item += ':' + Math.max(0, (Number(r && r.value) || 1) - 1);
  }
  await env.DB.prepare("INSERT INTO gifts (user_id, kind, item, note, status, created_at, opened_at) VALUES (?, ?, ?, ?, 'bag', ?, NULL)").bind(u.id, kind, item, 'titoslv:' + n, Math.floor(Date.now() / 1000)).run();
  await h.flockEvent('titosreward', u, { level: n, kind, item });
  return { kind, item };
}
// новость «Награда!» (worker/index.js NEWS_KINDS → news.js reward): первая невиданная награда за уровень
export async function rewardNews(env, uid) {
  const g = await env.DB.prepare("SELECT kind, item, note FROM gifts WHERE user_id = ? AND status = 'bag' AND note LIKE 'titoslv:%' AND opened_at IS NULL ORDER BY id LIMIT 1").bind(uid).first();
  return g ? { n: 1, k: g.kind, v: g.item, level: Number(g.note.slice(8)) || 0 } : null;
}
const OPEN = 2; // дела, которые можно смотреть без входа (бывшие «Дело №1» и «Дело №2»)
const MIN = 60000;
const parseJ = (s, d) => { try { return JSON.parse(s) ?? d; } catch (e) { return d; } };

// ---------- кофе ----------
// пересчитать кофейник на момент t: Титос пьёт чашку каждые titosCupMin мин (нет кофе — засыпает), кофейник наполняется на 1 каждые titosRegenMin мин
function settle(r, R, t) {
  const H = R.titosRegenMin * MIN, D = R.titosCupMin * MIN, MAX = R.titosPot;
  let c = Math.min(r.coffee ?? MAX, MAX), ra = r.coffee_at || t, da = r.drink_at || 0, sl = r.sleep || 0;
  for (let i = 0; i < 2000; i++) {
    if (c >= MAX && !da) break;
    const nr = c < MAX ? ra + H : Infinity, nd = da || Infinity, nx = Math.min(nr, nd);
    if (nx > t) break;
    if (nd <= nr) { if (c > 0) { if (c >= MAX) ra = nd; c--; da = nd + D; } else { da = 0; sl = 1; } }
    else { ra = nr; c++; }
  }
  if (c >= MAX) ra = t; // полный: отсчёт следующей чашки начнётся, когда отопьют
  return { ...r, coffee: c, coffee_at: ra, drink_at: da, sleep: sl };
}
async function rowOf(env, uid) {
  let r = await env.DB.prepare('SELECT * FROM titos WHERE user_id = ?').bind(uid).first();
  if (!r) { await env.DB.prepare('INSERT OR IGNORE INTO titos (user_id, coffee_at) VALUES (?, ?)').bind(uid, Date.now()).run(); r = await env.DB.prepare('SELECT * FROM titos WHERE user_id = ?').bind(uid).first(); }
  return r;
}
async function saveRow(env, r) {
  await env.DB.prepare('UPDATE titos SET level = ?, coffee = ?, coffee_at = ?, drink_at = ?, sleep = ?, run = ?, found = ?, started = ?, bugs = ?, sell_day = ?, sell_n = ? WHERE user_id = ?')
    .bind(r.level || 0, r.coffee, r.coffee_at, r.drink_at || 0, r.sleep || 0, r.run || 0, typeof r.found === 'string' ? r.found : JSON.stringify(r.found || []), r.started || 0,
      typeof r.bugs === 'string' ? r.bugs : JSON.stringify(r.bugs || []), r.sell_day || '', r.sell_n || 0, r.user_id).run();
}
// состояние Титоса для страницы и /api/whoami: кофе, когда следующая чашка, когда снова «Жуки», цены
export function titosState(r, R, h, t = Date.now()) {
  const MAX = R.titosPot;
  if (!r) return { level: 0, coffee: MAX, max: MAX, next: null, awake: false, sleep: false, run: 0, found: [], bugsNext: null, bugsLeft: R.titosBugsPerHour, bugsMax: R.titosBugsPerHour, sellLeft: R.titosSellDayMax, prizes: [], sort: 0 };
  const s = settle(r, R, t), bugs = parseJ(s.bugs, []).filter(x => x > t - 60 * MIN), day = h.rigaDay();
  const bugsLeft = Math.max(0, R.titosBugsPerHour - bugs.length);
  return {
    level: s.level || 0, coffee: s.coffee, max: MAX, next: s.coffee < MAX ? s.coffee_at + R.titosRegenMin * MIN : null,
    awake: !!s.drink_at, sleep: !!(s.run && !s.drink_at), run: s.run || 0, found: parseJ(s.found, []),
    drinkAt: s.drink_at || null, // следующая чашка из кофейника (пока идёт дело)
    bugsNext: bugsLeft ? null : Math.min(...bugs) + 60 * MIN, bugsLeft, bugsMax: R.titosBugsPerHour,
    sellLeft: Math.max(0, R.titosSellDayMax - (s.sell_day === day ? s.sell_n || 0 : 0)),
    sort: s.sort_lv || 0, // «Разбери дела»: пройдено уровней
    prizes: Object.keys(TITOS_PRIZES).map(Number).filter(n => (s.level || 0) >= n).map(n => TITOS_PRIZES[n]),
  };
}
// одна функция на всё, что меняет кофейник. src: case (−чашка за дело), sort («Разбери дела», n — уровней), bugs («Жуки»), buy («Долить»), sell (лишнее → пуговки).
// Лишнее при полном кофейнике само продаётся (sell); o.noSell — не продавать (лишнее пропадает). → { r, gained, sold, buttons, paid } или ошибка fail()
export async function addCoffee(env, h, r, src, n = 1, o = {}) {
  const R = h.rules(), t = Date.now(), MAX = R.titosPot;
  r = settle(r, R, t);
  let add = 0, paid = 0;
  if (src === 'case') { // −n чашек: старт или пробуждение посреди дела
    if (r.coffee < n) h.fail(409, 'coffee');
    if (r.coffee >= MAX) r.coffee_at = t;
    r.coffee -= n;
    return { r, gained: -n, sold: 0, buttons: 0, paid: 0 };
  }
  if (src === 'sort') add = R.titosSortCups * Math.max(0, Math.floor(n));
  else if (src === 'bugs') {
    const bugs = parseJ(r.bugs, []).filter(x => x > t - 60 * MIN);
    if (bugs.length >= R.titosBugsPerHour) h.fail(429, 'bugs');
    bugs.push(t); r.bugs = JSON.stringify(bugs); add = R.titosBugsCups;
  } else if (src === 'buy') {
    if (r.coffee >= MAX) h.fail(409, 'full');
    paid = h.btnOf(R.titosRefillPct, await h.unit());
    const u = await env.DB.prepare('SELECT buttons FROM users WHERE id = ?').bind(r.user_id).first();
    if (!u || (u.buttons || 0) < paid) h.fail(402, 'poor');
    const s = await env.DB.prepare('UPDATE users SET buttons = COALESCE(buttons, 0) - ? WHERE id = ? AND COALESCE(buttons, 0) >= ?').bind(paid, r.user_id, paid).run();
    if (!s.meta.changes) h.fail(402, 'poor');
    add = MAX - r.coffee;
  } else h.fail(400, 'src');
  const put = Math.min(add, MAX - r.coffee), extra = add - put;
  if (r.coffee + put >= MAX) r.coffee_at = t;
  r.coffee += put;
  let sold = 0, buttons = 0;
  if (extra > 0 && !o.noSell) { // лишние чашки → пуговки, не больше titosSellDayMax чашек в сутки
    const day = h.rigaDay(), done = r.sell_day === day ? r.sell_n || 0 : 0;
    sold = Math.max(0, Math.min(extra, R.titosSellDayMax - done));
    if (sold) {
      const per = Math.max(1, h.btnOf(R.titosSellPct, await h.unit()));
      buttons = await h.award(r.user_id, 'titossell', `${day}:${t}:${src}`, per * sold);
      r.sell_day = day; r.sell_n = done + sold;
    }
  }
  return { r, gained: put, sold, buttons, paid };
}

// ---------- дела ----------
const isT = o => o && typeof o === 'object' && !Array.isArray(o) && typeof o.ru === 'string';
// все тексты {"ru": …} дела по порядку
function texts(o, out = []) {
  if (isT(o)) out.push(o);
  else if (Array.isArray(o)) o.forEach(x => texts(x, out));
  else if (o && typeof o === 'object') Object.values(o).forEach(x => texts(x, out));
  return out;
}
// дело на одном языке: {"ru","en","lv"} → строка (нет перевода — RU)
function resolve(o, lang, tr) {
  if (isT(o)) return o[lang] || (tr[o.ru] || {})[lang] || o.ru;
  if (Array.isArray(o)) return o.map(x => resolve(x, lang, tr));
  if (o && typeof o === 'object') return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, resolve(v, lang, tr)]));
  return o;
}
// что видит браузер: без виновного, трюка, финала и связей улик (их знает только сервер)
function forClient(c, lang, tr) {
  const x = resolve(c, lang, tr);
  delete x.culprit; delete x.trick; delete x.solved;
  x.suspects = (x.suspects || []).map(s => { const { wrong, ...rest } = s; return rest; });
  x.clues = (x.clues || []).map(({ against, clears, refutes, fake, ...rest }) => rest);
  return x;
}
async function caseOf(env, n) { return env.DB.prepare('SELECT * FROM titos_cases WHERE n = ?').bind(n).first(); }
async function caseCount(env) { return (await env.DB.prepare('SELECT COUNT(*) AS n, COALESCE(MAX(n), 0) AS top FROM titos_cases').first()); }
// улики, которые надо найти: все улики дела; «клик» по лупе — 'lens'
const clueIds = c => (c.clues || []).map(x => x.id);

export async function titosApi(req, env, url, h) {
  const p = url.pathname, m = req.method, { json, fail } = h, R = h.rules();
  const body = () => req.json().catch(() => ({}));
  const lang = LANGS.includes(url.searchParams.get('lang')) ? url.searchParams.get('lang') : 'en';
  const out = (r, extra = {}) => json({ ok: true, state: titosState(r, R, h), ...extra });

  if (m === 'GET' && p === '/api/titos') {
    const u = await h.currentUser(req, env), r = u && !u.banned ? await rowOf(env, u.id) : null;
    if (!(await caseCount(env)).n) await importTitos(env, url); // дел в базе ещё нет (первая выкладка) — занести сразу, не дожидаясь расписания
    const list = (await env.DB.prepare('SELECT n, data, tr FROM titos_cases ORDER BY n').all()).results
      .map(x => { const d = parseJ(x.data, {}), tr = parseJ(x.tr, {}); return { n: x.n, title: resolve(d.title || { ru: '' }, lang, tr) }; });
    const unit = await h.unit();
    return json({ on: R.titosOn, state: titosState(r, R, h), cases: list, play: !!(u && u.nick && !u.banned), // play — сервер ведёт дело (вошла птичка с ником); иначе открытые дела без кофе и наград
      prices: { level: h.btnOf(R.titosLevelPct, unit), refill: h.btnOf(R.titosRefillPct, unit), sell: Math.max(1, h.btnOf(R.titosSellPct, unit)), bugs: R.titosBugsCups, sort: R.titosSortCups, blot: R.titosBlotBtn },
      prizes: TITOS_PRIZES });
  }
  if (m === 'GET' && p === '/api/titos/case') {
    const n = Math.floor(Number(url.searchParams.get('n')) || 0), u = await h.currentUser(req, env);
    const lv = u && !u.banned ? ((await env.DB.prepare('SELECT level FROM titos WHERE user_id = ?').bind(u.id).first()) || {}).level || 0 : 0;
    if (n < 1 || (n > lv + 1 && n > OPEN)) fail(403, 'locked');
    const c = await caseOf(env, n); if (!c) fail(404, 'case');
    return json({ case: forClient(parseJ(c.data, {}), lang, parseJ(c.tr, {})) });
  }
  // бывшие дела №1 и №2, раскрытые раньше (localStorage) — засчитать без пуговок
  if (m === 'POST' && p === '/api/titos/legacy') {
    const u = await h.needUser(req, env), b = await body(), r = await rowOf(env, u.id);
    const solved = new Set((Array.isArray(b.solved) ? b.solved : []).map(Number));
    let lv = r.level || 0; while (lv < OPEN && solved.has(lv + 1)) lv++;
    if (lv > (r.level || 0)) await env.DB.prepare('UPDATE titos SET level = ?, legacy = ? WHERE user_id = ? AND level < ?').bind(lv, lv, u.id, lv).run();
    return out({ ...r, level: Math.max(lv, r.level || 0) });
  }
  if (m === 'POST' && p === '/api/titos/start') {
    const u = await h.needUser(req, env); if (!u.nick) fail(400, 'nick');
    if (!R.titosOn) fail(403, 'off');
    const b = await body(), n = Math.floor(Number(b.n) || 0);
    let r = settle(await rowOf(env, u.id), R, Date.now());
    if (n < 1 || n > (r.level || 0) + 1) fail(409, 'order'); // уровни — по порядку (раскрытые можно переиграть)
    if (!(await caseOf(env, n))) fail(404, 'case');
    const same = r.run === n;
    if (same && r.drink_at) return out(r); // уже идёт
    ({ r } = await addCoffee(env, h, r, 'case', R.titosStartCups));
    r.drink_at = Date.now() + R.titosCupMin * MIN; r.sleep = 0;
    if (!same) { r.run = n; r.found = '[]'; r.started = Date.now(); }
    await saveRow(env, r);
    return out(r, { resumed: same });
  }
  if (m === 'POST' && p === '/api/titos/clue') {
    const u = await h.needUser(req, env), b = await body(), n = Math.floor(Number(b.n) || 0), id = String(b.id || '');
    let r = settle(await rowOf(env, u.id), R, Date.now());
    if (r.run !== n) fail(409, 'run');
    if (!r.drink_at) { await saveRow(env, r); fail(409, 'sleep'); }
    const c = parseJ((await caseOf(env, n) || {}).data, null); if (!c) fail(404, 'case');
    const found = parseJ(r.found, []), clue = (c.clues || []).find(x => x.id === id);
    if (id !== 'lens' && !clue) fail(400, 'clue');
    if (clue && clue.lens && !found.includes('lens')) fail(409, 'lens'); // мелкую улику — только под лупой
    if (!found.includes(id)) found.push(id);
    r.found = JSON.stringify(found);
    await saveRow(env, r);
    return out(r);
  }
  if (m === 'POST' && p === '/api/titos/reward/seen') { // новость «Награда!» прочитана (нажали «Поставить»)
    const u = await h.needUser(req, env);
    await env.DB.prepare("UPDATE gifts SET opened_at = ? WHERE user_id = ? AND note LIKE 'titoslv:%' AND opened_at IS NULL").bind(Math.floor(Date.now() / 1000), u.id).run();
    return json({ ok: true });
  }
  if (m === 'POST' && p === '/api/titos/accuse') {
    const u = await h.currentUser(req, env), b = await body(), n = Math.floor(Number(b.n) || 0), who = String(b.who || '');
    if (!u || u.banned || !u.nick) { // без входа — только открытые дела и только ответ «верно / мимо»
      const row = n >= 1 && n <= OPEN ? await caseOf(env, n) : null, c = parseJ(row && row.data, null); if (!c) fail(401, 'login');
      const s = (c.suspects || []).find(x => x.id === who); if (!s) fail(400, 'who');
      return json({ ok: true, state: null, right: who === c.culprit, text: resolve(who === c.culprit ? c.solved || { ru: '' } : s.wrong || { ru: '' }, lang, parseJ(row.tr, {})) });
    }
    let r = settle(await rowOf(env, u.id), R, Date.now());
    if (r.run !== n) fail(409, 'run');
    if (!r.drink_at) { await saveRow(env, r); fail(409, 'sleep'); }
    const row = await caseOf(env, n), c = parseJ(row && row.data, null); if (!c) fail(404, 'case');
    const tr = parseJ(row.tr, {}), found = parseJ(r.found, []), need = clueIds(c);
    if (need.some(id => !found.includes(id))) fail(409, 'clues');
    if (Date.now() - (r.started || 0) < need.length * R.titosClueSec * 1000) fail(429, 'fast');
    const s = (c.suspects || []).find(x => x.id === who); if (!s) fail(400, 'who');
    if (who !== c.culprit) { await saveRow(env, r); return out(r, { right: false, text: resolve(s.wrong || { ru: '' }, lang, tr) }); }
    const first = n > (r.level || 0);
    r.drink_at = 0; r.sleep = 0; r.run = 0; r.found = '[]'; r.started = 0;
    if (first) r.level = n;
    await saveRow(env, r);
    let buttons = 0;
    if (first && R.titosOn) buttons = await h.award(u.id, 'titos', String(n), h.btnOf(R.titosLevelPct, await h.unit()) * (1 + Math.floor((n - 1) / 10)));
    if (first) await h.stamp(u.id, 'titos'); // штамп в карточке дня
    if (first && n % 10 === 0) await h.flockEvent('titos', u, { level: n });
    // вещь-награда за дело (c.reward = 'furn|tc<имя>', room.js) — в сумку, один раз
    let item = null;
    if (first && /^furn\|tc[a-z]+$/.test(c.reward || '')) {
      item = { kind: 'furn', item: c.reward.split('|')[1] };
      await env.DB.prepare("INSERT INTO gifts (user_id, kind, item, note, status, created_at, opened_at) SELECT ?, ?, ?, ?, 'bag', ?, ? WHERE NOT EXISTS (SELECT 1 FROM gifts WHERE user_id = ? AND kind = ? AND item = ?)")
        .bind(u.id, item.kind, item.item, 'titos:' + n, Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000), u.id, item.kind, item.item).run();
    }
    const reward = first && TITOS_ITEMS[n] ? await levelItem(env, h, u, n) : null; // награда за уровень 30/50/90/100
    return out(r, { right: true, text: resolve(c.solved || { ru: '' }, lang, tr), buttons, prize: first ? TITOS_PRIZES[n] || null : null, item, reward });
  }
  // «Разбери дела» (worker/titos-sort.js): start — новый раунд следующего уровня; blot {i} — смыть кляксу за titosBlotBtn 🔘; done {lv, sell} — +titosSortCups чашек
  if (m === 'POST' && p.startsWith('/api/titos/sort/')) {
    const u = await h.needUser(req, env); if (!u.nick) fail(400, 'nick');
    const b = await body(), r = await rowOf(env, u.id), run = parseJ(r.sort_run, null);
    const keep = x => env.DB.prepare('UPDATE titos SET sort_run = ? WHERE user_id = ?').bind(x ? JSON.stringify(x) : '', u.id).run();
    if (p === '/api/titos/sort/start') {
      const lv = (r.sort_lv || 0) + 1, seed = (Math.random() * 2 ** 32) >>> 0;
      const real = (await env.DB.prepare('SELECT n, data, tr FROM titos_cases ORDER BY n').all()).results.map(x => {
        const d = parseJ(x.data, {}), tr = parseJ(x.tr, {});
        return { n: x.n, title: resolve(d.title || { ru: '' }, lang, tr), docs: (d.clues || []).filter(c => c.title).map(c => ({ emo: c.emo || '', icon: c.icon || '', name: resolve(c.title, lang, tr) })) };
      });
      const { secret, ...round } = sortRound(lv, r.level || 0, lang, real, seed);
      await keep({ lv, at: Date.now(), n: round.docs.length, secret, washed: [] });
      return out(r, { lv, round, blot: R.titosBlotBtn, cups: R.titosSortCups, sec: R.titosSortSec });
    }
    if (!run || run.lv !== Number(b.lv)) fail(409, 'run');
    if (p === '/api/titos/sort/blot') {
      const i = String(Math.floor(Number(b.i))); if (!(i in (run.secret || {}))) fail(400, 'blot');
      let paid = 0;
      if (!run.washed.includes(i) && R.titosBlotBtn > 0) {
        paid = R.titosBlotBtn;
        const s = await env.DB.prepare('UPDATE users SET buttons = COALESCE(buttons, 0) - ? WHERE id = ? AND COALESCE(buttons, 0) >= ?').bind(paid, u.id, paid).run();
        if (!s.meta.changes) fail(402, 'poor');
        run.washed.push(i); await keep(run);
      }
      return json({ ok: true, label: run.secret[i], paid });
    }
    if (p === '/api/titos/sort/done') {
      if (Date.now() - run.at < run.n * R.titosSortSec * 1000) fail(429, 'fast');
      const res = await addCoffee(env, h, r, 'sort', 1, { noSell: !b.sell });
      res.r.sort_lv = run.lv;
      await saveRow(env, res.r);
      await env.DB.prepare("UPDATE titos SET sort_lv = ?, sort_run = '' WHERE user_id = ?").bind(run.lv, u.id).run();
      return out(res.r, { gained: res.gained, sold: res.sold, buttons: res.buttons });
    }
    fail(404, 'sort');
  }
  // «Жуки» (site/assets/titos-bugs.js): start — открыть игру (не больше titosBugsPerHour в час); кофе — POST /api/titos/coffee {src: 'bugs', sell}
  if (m === 'POST' && p === '/api/titos/bugs/start') {
    const u = await h.needUser(req, env); if (!u.nick) fail(400, 'nick');
    const r = await rowOf(env, u.id);
    if (!titosState(r, R, h).bugsLeft) fail(429, 'bugs');
    await env.DB.prepare('UPDATE titos SET bugs_run = ? WHERE user_id = ?').bind(Date.now(), u.id).run();
    return out(r, { cups: R.titosBugsCups, sec: R.titosBugsSec });
  }
  if (m === 'POST' && p === '/api/titos/coffee') { // кофе из «Жуков» и «Долить»; «Разбери дела» — /api/titos/sort/done
    const u = await h.needUser(req, env), b = await body(), src = String(b.src || '');
    if (!['bugs', 'buy'].includes(src)) fail(400, 'src');
    const r = await rowOf(env, u.id);
    if (src === 'bugs') { // только после /api/titos/bugs/start и не быстрее titosBugsSec
      if (!r.bugs_run) fail(409, 'run');
      if (Date.now() - r.bugs_run < R.titosBugsSec * 1000) fail(429, 'fast');
      const c = await env.DB.prepare('UPDATE titos SET bugs_run = 0 WHERE user_id = ? AND bugs_run = ?').bind(u.id, r.bugs_run).run();
      if (!c.meta.changes) fail(409, 'run');
    }
    const res = await addCoffee(env, h, r, src, 1, { noSell: src === 'bugs' && b.sell === false });
    await saveRow(env, res.r);
    if (src === 'bugs') await h.stamp(u.id, 'bugs'); // штамп в карточке дня
    return out(res.r, { gained: res.gained, sold: res.sold, buttons: res.buttons, paid: res.paid });
  }

  // ---------- кабинет ----------
  if (p.startsWith('/api/admin/titos')) {
    const u = await h.needUser(req, env); if (!(await h.isAdmin(u, env))) fail(403, 'admin');
    if (m === 'GET' && p === '/api/admin/titos') return json(await adminList(env));
    if (m === 'POST' && p === '/api/admin/titos/import') return json({ ok: true, ...(await importTitos(env, url, true)), ...(await adminList(env)) });
  }
  return null;
}
async function adminList(env) {
  const rows = (await env.DB.prepare('SELECT n, data, tr, updated_at FROM titos_cases ORDER BY n').all()).results;
  const players = await env.DB.prepare('SELECT COUNT(*) AS n, COALESCE(MAX(level), 0) AS top FROM titos WHERE level > 0').first();
  return { cases: rows.map(x => { const d = parseJ(x.data, {}), tr = parseJ(x.tr, {}), all = texts(d);
    const miss = l => all.filter(o => !o[l] && !(tr[o.ru] || {})[l]).length;
    return { n: x.n, title: (d.title || {}).ru || '', missing: { en: miss('en'), lv: miss('lv') }, updated: x.updated_at }; }), players };
}

// ---------- импорт из репозитория: site/assets/titos-cases.json ----------
// по метке meta titos_cases_<хэш файла>: дело записывается заново, переводы — из кэша (тот же RU-текст не переводится второй раз), новое — translateTo
export async function importTitos(env, url, force = false) {
  const r = await env.ASSETS.fetch(new Request(new URL('/assets/titos-cases.json', url.origin || 'https://www.pigeonpolly.com').href)).catch(() => null);
  const file = r && r.ok ? await r.json().catch(() => null) : null;
  if (!file || !Array.isArray(file.cases)) return { imported: 0, error: 'no_file' };
  const key = 'titos_cases_' + String(file.hash || '').slice(0, 16);
  if (!force && await env.DB.prepare('SELECT value FROM meta WHERE key = ?').bind(key).first()) return { imported: 0, skipped: true };
  const lock = await env.DB.prepare('INSERT OR IGNORE INTO meta (key, value) VALUES (?, ?)').bind(key, 'importing:' + Date.now()).run();
  if (!lock.meta.changes && !force) return { imported: 0, skipped: true };
  let n = 0; const errors = [];
  try {
    for (const c of file.cases) {
      const num = Math.floor(Number(c.n) || 0); if (num < 1 || num > 999) continue;
      const old = await caseOf(env, num), tr = parseJ(old && old.tr, {});
      const all = texts(c);
      for (const o of all) for (const l of ['en', 'lv']) if (o[l]) (tr[o.ru] = tr[o.ru] || {})[l] = o[l]; // готовые переводы (старые дела) — сразу в кэш
      for (const l of ['en', 'lv']) {
        const need = [...new Set(all.filter(o => !o[l] && !(tr[o.ru] || {})[l]).map(o => o.ru))];
        if (!need.length) continue;
        const res = await Promise.race([translateTo(env, need, 'ru', [l], ABOUT.titos), new Promise(x => setTimeout(() => x({ tr: {}, errors: { [l]: 'timeout' } }), 25000))]).catch(() => ({ tr: {}, errors: { [l]: 'ai' } }));
        if (res.tr[l]) need.forEach((s, i) => { const v = String(res.tr[l][i] || '').trim(); if (v) (tr[s] = tr[s] || {})[l] = v; });
        else errors.push({ n: num, lang: l, error: (res.errors || {})[l] || 'ai' });
      }
      const hash = String(c.hash || '');
      await env.DB.prepare('INSERT INTO titos_cases (n, data, tr, hash, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(n) DO UPDATE SET data = excluded.data, tr = excluded.tr, hash = excluded.hash, updated_at = excluded.updated_at')
        .bind(num, JSON.stringify(c), JSON.stringify(tr), hash, Date.now()).run();
      n++;
    }
    await env.DB.prepare('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)').bind(key, String(Date.now())).run();
  } catch (e) {
    await env.DB.prepare('DELETE FROM meta WHERE key = ?').bind(key).run(); // не вышло — попробуем ещё раз
    return { imported: n, error: String(e.message || e), errors };
  }
  return { imported: n, errors };
}
