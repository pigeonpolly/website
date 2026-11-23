// Огород птички (этап 22, /garden/, site/assets/garden.js, docs/bird.md «Огород»): грядки, семена, полив раз в сутки, таймер роста, урожай за пуговки, жуки.
// Растёт только политое: полив даёт gardenWetH часов влаги, рост копится, пока земля мокрая; полить грядку можно раз в сутки по Риге.
// Жуки: каждый день у птички 0…gardenBugMax жуков (шанс gardenBugChance %), каждый вылезает в свой час суток — собрать = gardenBugBtn 🔘.
// Этап 23: семена из игр (gardenDrop — из award в worker/index.js), редкие — раз в gardenRareDays дней подряд с ≥ dayBonusNeed штампами карточки дня,
// волшебные — раз в gardenMagicDays дней подряд с поливом; найденное копится в found → новость «🌱» (gardenNews) до захода в огород. Вещи для огорода — подарки вида garden (site/assets/garden-items.js).
// Деревья (23.11.2026): 10 видов, по одному на грядку, растут 7–21 политых суток, саженец дороже семени (gardenTreeSeedMul); выросшее остаётся (m: 1 в грядке)
// и плодоносит снова через gardenTreeAgainPct % срока (needMs); первый урожай — 100/gardenTreeAgainPct плодов. «🪓 Выкопать» — POST /api/garden/dig.
// Перестановка (23.11.2026): pos — JSON {b0: [x, y] грядка, 'i:gnome': [x, y] вещь} в пикселях сцены 240×150; POST /api/garden/move.
// Клумбы (24.11.2026): докупить — POST /api/garden/addbed (gardenBedBtn 🔘, всего не больше gardenBedsMax), форма — POST /api/garden/form {bed, form} (FORMS, бесплатно).
// Сумка клумб (23.11.2026): пустую клумбу — в сумку (POST /api/garden/bed {act:'remove'}), поставить (place) или продать за gardenBedSell 🔘 (sell); bedbag — клумбы в сумке, removed — сколько клумб нет в огороде.
// Уборка (23.11.2026): осенью листья, зимой сугробы — choresOf(uid, день); убрать руками (+компост, бонус за все) или сразу за gardenCleanPay 🔘 с кучи (clean).
// Компост (23.11.2026): за убранную кучу, +gardenCompostH ч роста грядке (compost). Собрать и продать всё — harvest/sell {all: true}.
// API: GET /api/garden?nick=, POST /api/garden/{plant,water,harvest,dig,sell,buy,bug,hide,move,addbed,form,bed,clean,compost}.

import { dishOf } from './kitchen.js'; // блюдо «быстрее растёт» при поливе (этап 89)

export const GARDEN_TABLES = [
  // beds — JSON [{p: растение, t: посажено, g: накоплено роста (мс) к моменту w, w: последний полив} | null]; seeds/crop — {растение: штук}
  // bug_day / bug_got — жуки: за какой день и какие номера уже собраны; harvests — собрано урожаев всего
  "CREATE TABLE IF NOT EXISTS garden (user_id INTEGER PRIMARY KEY, beds TEXT DEFAULT '[]', seeds TEXT DEFAULT '{}', crop TEXT DEFAULT '{}', bug_day TEXT DEFAULT '', bug_got TEXT DEFAULT '[]', harvests INTEGER DEFAULT 0, bugs INTEGER DEFAULT 0, created_at INTEGER)",
];
// found — JSON [{p, src, at}] найденные семена, о которых птичка ещё не знает (src: game/potion/pan/titos/shift/bugs, rare, magic); drop_day/drop_n — сколько семян из игр сегодня
// rare_day/magic_day — день последней награды (серия считается после него); water_days — JSON дней с поливом (последние 40); hide — JSON спрятанных вещей огорода; pos — места грядок и вещей, переставленных хозяином
export const GARDEN_ALTER = ["ALTER TABLE garden ADD COLUMN found TEXT DEFAULT '[]'", "ALTER TABLE garden ADD COLUMN drop_day TEXT DEFAULT ''", 'ALTER TABLE garden ADD COLUMN drop_n INTEGER DEFAULT 0',
  "ALTER TABLE garden ADD COLUMN rare_day TEXT DEFAULT ''", "ALTER TABLE garden ADD COLUMN magic_day TEXT DEFAULT ''", "ALTER TABLE garden ADD COLUMN water_days TEXT DEFAULT '[]'", "ALTER TABLE garden ADD COLUMN hide TEXT DEFAULT '[]'", "ALTER TABLE garden ADD COLUMN pos TEXT DEFAULT '{}'",
  'ALTER TABLE garden ADD COLUMN extra INTEGER DEFAULT 0', "ALTER TABLE garden ADD COLUMN forms TEXT DEFAULT '{}'",
  'ALTER TABLE garden ADD COLUMN bedbag INTEGER DEFAULT 0', 'ALTER TABLE garden ADD COLUMN removed INTEGER DEFAULT 0', 'ALTER TABLE garden ADD COLUMN compost INTEGER DEFAULT 0', 'ALTER TABLE garden ADD COLUMN cleaned INTEGER DEFAULT 0',
  "ALTER TABLE garden ADD COLUMN chore_day TEXT DEFAULT ''", "ALTER TABLE garden ADD COLUMN chore_got TEXT DEFAULT '[]'",
  'ALTER TABLE garden ADD COLUMN xp INTEGER DEFAULT 0', 'ALTER TABLE garden ADD COLUMN lvl INTEGER DEFAULT 1', "ALTER TABLE garden ADD COLUMN order_day TEXT DEFAULT ''"]; // extra — докупленные клумбы, forms — {b0: 'round'} формы, bedbag/removed — клумбы в сумке и убранные, compost/cleaned — уборка, xp/lvl — опыт фермы, order_day — заказ дня выполнен
export const GARDEN_RULES = {
  gardenOn: true, gardenBeds: 6, gardenWetH: 24, // грядок; сколько часов земля мокрая после полива (рост идёт только по мокрой)
  gardenBedsMax: 10, gardenBedBtn: 60, // клумб всего не больше N (с докупленными); цена одной докупленной клумбы 🔘
  gardenBedSell: 1, // продажа убранной в сумку клумбы, 🔘
  gardenSeedPct: 1, gardenSellPct: 3, // семя и урожай — % опорной цены за каждый день роста растения
  gardenStarter: 2, // семян каждого простого растения (1–2 дня роста) при первом заходе в огород
  gardenBugMax: 3, gardenBugChance: 60, gardenBugBtn: 1, // жуков в день до N (бывает и 0: шанс, что жуки вообще будут), пуговок за жука
  gardenDropPct: 10, gardenDropDay: 3, // семечко в награду в игре: шанс % за каждую награду пуговками, не больше N в сутки
  gardenRareDays: 7, gardenMagicDays: 7, // редкое семечко — за N дней подряд с бонусом карточки дня; волшебное — за N дней подряд с поливом
  gardenRareMul: 3, gardenMagicMul: 5, // урожай редких и волшебных дороже простого во столько раз
  gardenTreeSeedMul: 3, gardenTreeSellMul: 1, // деревья: саженец дороже семени (за день роста) во столько раз; урожай с дерева — дороже простого во столько раз
  gardenTreeAgainPct: 30, // выросшее дерево остаётся и плодоносит снова через N % своего срока роста; первый урожай — 100/N плодов, дальше по одному
  gardenSeason: 'auto', // погода и вид: auto — по календарю (дек–фев зима, мар–май весна, июн–авг лето, сен–ноя осень)
  gardenCleanOn: true, gardenCleanPiles: 3, gardenCleanPay: 1, gardenCleanBtn: 2, gardenCompostH: 6, // уборка листьев/снега и компост
  gardenLvlXp: 50, // опыт фермы: сколько XP на новый уровень
  gardenOrderPct: 150, // заказ дня: пуговки — % от цены урожая в заказе
};
export const GARDEN_RANGE = { gardenDropPct: [0, 100], gardenDropDay: [0, 20], gardenRareDays: [1, 30], gardenMagicDays: [1, 30], gardenRareMul: [1, 20], gardenMagicMul: [1, 20], gardenTreeSeedMul: [1, 20], gardenTreeSellMul: [0.5, 20], gardenTreeAgainPct: [5, 100], gardenBeds: [1, 12], gardenBedsMax: [1, 12], gardenBedBtn: [0, 10000], gardenBedSell: [0, 100], gardenWetH: [1, 72], gardenSeedPct: [0, 100], gardenSellPct: [0, 100], gardenStarter: [0, 20], gardenBugMax: [0, 10], gardenBugChance: [0, 100], gardenBugBtn: [0, 100],
  gardenCleanPiles: [0, 10], gardenCleanPay: [0, 100], gardenCleanBtn: [0, 100], gardenCompostH: [1, 48], gardenLvlXp: [10, 500], gardenOrderPct: [100, 500] };
export const GARDEN_INT = ['gardenBedsMax', 'gardenBedBtn', 'gardenBedSell', 'gardenTreeAgainPct', 'gardenDropDay', 'gardenRareDays', 'gardenMagicDays', 'gardenBeds', 'gardenWetH', 'gardenStarter', 'gardenBugMax', 'gardenBugChance', 'gardenBugBtn', 'gardenCleanPiles', 'gardenCleanPay', 'gardenCleanBtn', 'gardenCompostH', 'gardenLvlXp', 'gardenOrderPct'];
export const GARDEN_BOOL = ['gardenOn', 'gardenCleanOn'];
export const GARDEN_SEASONS = ['auto', 'autumn', 'winter', 'spring', 'summer'];

// растения: дней роста (политых суток); названия и рисунки — site/assets/garden.js. Редкие и волшебные (этап 23) в лавке не продаются.
export const CROPS = { radish: 1, lettuce: 1, carrot: 2, tulip: 2, strawberry: 3, sunflower: 3, cabbage: 3, pumpkin: 4,
  rainbowcarrot: 3, bluerose: 4, goldpumpkin: 5, // редкие
  starberry: 3, moonflower: 4, mandrake: 5, // волшебные
  cherrytree: 7, appletree: 8, plumtree: 9, rowan: 10, peartree: 10, birch: 12, linden: 14, spruce: 15, pine: 18, oak: 21 }; // деревья: саженцы в лавке, одно на грядку
export const TIER = { rainbowcarrot: 'rare', bluerose: 'rare', goldpumpkin: 'rare', starberry: 'magic', moonflower: 'magic', mandrake: 'magic',
  cherrytree: 'tree', appletree: 'tree', plumtree: 'tree', rowan: 'tree', peartree: 'tree', birch: 'tree', linden: 'tree', spruce: 'tree', pine: 'tree', oak: 'tree' };
const NOSALE = k => TIER[k] === 'rare' || TIER[k] === 'magic'; // редкие и волшебные не продаются; саженцы — да
const SIMPLE = Object.keys(CROPS).filter(k => !TIER[k]);
const ofTier = t => Object.keys(TIER).filter(k => TIER[k] === t);
const starter = R => R.gardenStarter > 0 ? Object.fromEntries(SIMPLE.filter(k => CROPS[k] <= 2).map(k => [k, R.gardenStarter])) : {}; // семена при первом заходе
const sellMul = (R, k) => TIER[k] === 'rare' ? R.gardenRareMul : TIER[k] === 'magic' ? R.gardenMagicMul : TIER[k] === 'tree' ? R.gardenTreeSellMul : 1;
const back = (day, n) => { const d = new Date(day + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() - n); return d.toISOString().slice(0, 10); };
// дней подряд в set: с сегодняшнего (если он уже есть) или со вчерашнего, но только после дня последней награды after
const run = (set, today, after) => { let n = 0; for (let i = set.has(today) ? 0 : 1; i < 60; i++) { const d = back(today, i); if ((after && d <= after) || !set.has(d)) break; n++; } return n; };
const DAY = 864e5, HOUR = 36e5;
export const FORMS = ['rect', 'round', 'square', 'long', 'heart']; // формы клумб (рисунки — garden.js `bedShape`)
// сколько клумб у птички: из правил + докупленные − убранные, но не больше gardenBedsMax (и не меньше 1)
const bedsN = (R, r) => Math.max(1, Math.min(R.gardenBedsMax || 10, R.gardenBeds + ((r && r.extra) || 0) - ((r && r.removed) || 0)));

const parse = (s, d) => { try { const v = JSON.parse(s); return v && typeof v === 'object' ? v : d; } catch (e) { return d; } };
const fnv = str => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const dayOf = ms => new Date(ms).toLocaleDateString('sv-SE', { timeZone: 'Europe/Riga' });
// сколько роста у грядки сейчас (мс): накопленное + мокрое время с последнего полива
// сколько роста нужно до урожая (мс): выросшему дереву — только до новых плодов
export const needMs = (b, R) => !b || !CROPS[b.p] ? 0 : CROPS[b.p] * DAY * (b.m && TIER[b.p] === 'tree' ? Math.max(5, R.gardenTreeAgainPct || 30) / 100 : 1);
// цена одного плода: у дерева — за срок «снова плодоносит», у остальных — за весь срок роста
const sellPct = (R, k) => R.gardenSellPct * CROPS[k] * sellMul(R, k) * (TIER[k] === 'tree' ? Math.max(5, R.gardenTreeAgainPct || 30) / 100 : 1);
export const grown = (b, now, wetH) => !b ? 0 : (b.g || 0) + (b.w ? Math.max(0, Math.min(now - b.w, wetH * HOUR)) : 0);
// опыт фермы: уровень от накопленного XP (gardenLvlXp — сколько на уровень)
export const levelOf = (xp, R) => 1 + Math.floor(Math.max(0, Number(xp) || 0) / Math.max(10, R.gardenLvlXp || 50));
// заказ дня: два простых растения из корзинки, цена — по урожаю, награда — % от неё
export function orderOf(uid, day, R) {
  const h = fnv(uid + ':' + day + ':order'), list = ['radish', 'lettuce', 'carrot', 'tulip'];
  const a = list[h % list.length];
  let b = list[(h >>> 5) % list.length]; if (b === a) b = list[(h >>> 9) % list.length]; if (b === a) b = a === 'radish' ? 'lettuce' : 'radish';
  const items = [{ p: a, n: 1 + (h >>> 12) % 2 }, { p: b, n: 1 + (h >>> 16) % 2 }];
  const value = items.reduce((sum, x) => sum + sellPct(R, x.p) * x.n, 0);
  return { day, items, value, seed: list[(h >>> 20) % list.length] };
}
// жуки дня: [{i, at, bed}] — сколько и когда вылезают, одинаково при каждом запросе (от птички и дня)
export function bugsOf(uid, day, R) {
  const h = fnv(uid + ':' + day + ':bugs');
  if (R.gardenBugMax < 1 || h % 100 >= R.gardenBugChance) return [];
  const n = 1 + fnv(day + ':n:' + uid) % R.gardenBugMax, start = Date.parse(day + 'T00:00:00Z') - 3 * HOUR; // полночь по Риге (± час летом — не важно)
  return Array.from({ length: n }, (_, i) => { const x = fnv(uid + ':' + day + ':' + i); return { i, at: start + (7 + x % 14) * HOUR + (x >>> 8) % 60 * 6e4, bed: (x >>> 16) % 64, x: (x >>> 4) % 100 }; });
}
// уборка: осенью листья, зимой сугробы; кучи одинаковы весь день и у всех запросов, у каждой свой номер
export function choresOf(uid, day, R, season) {
  if (!R.gardenCleanOn || !(R.gardenCleanPiles > 0) || (season !== 'autumn' && season !== 'winter')) return [];
  const h = fnv(uid + ':' + day + ':chores'), n = 1 + (h >>> 8) % R.gardenCleanPiles;
  return Array.from({ length: n }, (_, i) => { const x = fnv(uid + ':' + day + ':chore:' + i); return { i, kind: season === 'winter' ? 'snow' : 'leaves', x: 8 + x % 224, y: 66 + (x >>> 9) % 76 }; });
}
// сдвинуть ключи b0, b1… после удаления клумбы i (b2 → b1 и т. д.)
const shiftBeds = (obj, i) => {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    const m = /^b(\d+)$/.exec(k);
    if (!m) { out[k] = v; continue; }
    const n = +m[1];
    if (n < i) out[k] = v; else if (n > i) out['b' + (n - 1)] = v;
  }
  return out;
};

// h: json, fail, currentUser, needUser, rules, rigaDay, unit, btnOf, award, avatarOf, now
export async function gardenApi(req, env, url, h) {
  const p = url.pathname, m = req.method, { json, fail } = h, R = h.rules(), now = Date.now();
  const unit = await h.unit();
  const prices = () => Object.fromEntries(Object.entries(CROPS).map(([k, d]) => [k, { days: d, seed: NOSALE(k) ? null : h.btnOf(R.gardenSeedPct * d * (TIER[k] === 'tree' ? R.gardenTreeSeedMul : 1), unit), sell: h.btnOf(sellPct(R, k), unit), tier: TIER[k] || '', again: TIER[k] === 'tree' ? Math.round(d * R.gardenTreeAgainPct / 10) / 10 : undefined }]));
  const rowOf = async uid => {
    let r = await env.DB.prepare('SELECT * FROM garden WHERE user_id = ?').bind(uid).first();
    if (!r) {
      const seeds = starter(R);
      await env.DB.prepare('INSERT OR IGNORE INTO garden (user_id, seeds, created_at) VALUES (?, ?, ?)').bind(uid, JSON.stringify(seeds), now).run();
      r = await env.DB.prepare('SELECT * FROM garden WHERE user_id = ?').bind(uid).first();
    }
    const beds = parse(r.beds, []); beds.length = bedsN(R, r); // грядок стало меньше в правилах — лишние пропадают при следующей записи
    return { row: r, beds: Array.from(beds, b => b || null), seeds: parse(r.seeds, {}), crop: parse(r.crop, {}), got: r.bug_day === h.rigaDay() ? parse(r.bug_got, []) : [] };
  };
  // как грядка выглядит для браузера: растение, сколько выросло (0…1), сколько осталось, полита ли сегодня, мокрая ли земля
  const view = (b, today) => {
    if (!b || !CROPS[b.p]) return null;
    const need = needMs(b, R), gr = grown(b, now, R.gardenWetH);
    return { p: b.p, m: b.m ? 1 : 0, k: Math.min(1, gr / need), left: Math.max(0, need - gr), wet: !!b.w && now - b.w < R.gardenWetH * HOUR, today: !!b.w && dayOf(b.w) === today, ready: gr >= need };
  };
  const bugsView = (uid, got, n) => bugsOf(uid, h.rigaDay(), R).filter(b => b.at <= now && !got.includes(b.i)).map(b => ({ i: b.i, bed: b.bed % n, x: b.x }));
  // вещи для огорода: свои (в сумке) — стоят сами, кроме спрятанных
  const itemsOf = async uid => [...new Set((await env.DB.prepare("SELECT item FROM gifts WHERE user_id = ? AND kind = 'garden' AND status = 'bag'").bind(uid).all()).results.map(r => r.item))];
  // редкое и волшебное семечко: серии дней и награда, когда серия набрана (раз за серию: следующая считается с дня награды)
  const weekly = async (uid, s) => {
    const today = h.rigaDay(), r = s.row, out = {};
    const five = new Set((await env.DB.prepare("SELECT day FROM button_log WHERE user_id = ? AND kind = 'stamp' AND ref LIKE '%:five' AND day >= ?").bind(uid, back(today, 45)).all()).results.map(x => x.day));
    const wet = new Set(parse(r.water_days, []));
    for (const [t, set, need, col] of [['rare', five, R.gardenRareDays, 'rare_day'], ['magic', wet, R.gardenMagicDays, 'magic_day']]) {
      const n = run(set, today, r[col] || '');
      if (R.gardenOn && n >= need) {
        const list = ofTier(t), p = list[fnv(uid + ':' + today + ':' + t) % list.length], seeds = { ...s.seeds, [p]: (s.seeds[p] || 0) + 1 }, found = [...parse(r.found, []), { p, src: t, at: now }].slice(-10);
        const q = await env.DB.prepare(`UPDATE garden SET seeds = ?, found = ?, ${col} = ? WHERE user_id = ? AND seeds = ? AND COALESCE(${col}, '') = ?`).bind(JSON.stringify(seeds), JSON.stringify(found), today, uid, r.seeds, r[col] || '').run();
        if (q.meta.changes) { s.seeds = seeds; r.seeds = JSON.stringify(seeds); r.found = JSON.stringify(found); r[col] = today; }
        out[t] = { n: 0, need, got: p };
      } else out[t] = { n: Math.min(n, need), need };
    }
    return out;
  };
  const state = async (u, s) => {
    const today = h.rigaDay(), all = bugsOf(u.id, today, R), season = seasonOf(R, today), items = await itemsOf(u.id), hide = parse(s.row.hide, []);
    const chows = choresOf(u.id, today, R, season), got = s.row.chore_day === today ? parse(s.row.chore_got, []) : [];
    const ord = orderOf(u.id, today, R), order = { ...ord, done: s.row.order_day === today, reward: h.btnOf(ord.value * (R.gardenOrderPct || 150) / 100, unit), can: ord.items.every(x => (s.crop[x.p] || 0) >= x.n) };
    const xp = Number(s.row.xp) || 0, level = levelOf(xp, R), lvlXp = Math.max(10, R.gardenLvlXp || 50);
    return { on: R.gardenOn, beds: s.beds.map(b => view(b, today)), seeds: s.seeds, crop: s.crop, prices: prices(), bugs: bugsView(u.id, s.got, s.beds.length), forms: parse(s.row.forms, {}), bedsMax: Math.max(R.gardenBeds, R.gardenBedsMax || 10), bedBtn: R.gardenBedBtn, bedSell: R.gardenBedSell, bedbag: s.row.bedbag || 0,
      bugsGot: s.got.length, bugsLater: all.some(b => b.at > now), bugBtn: R.gardenBugBtn, wetH: R.gardenWetH, season, today,
      harvests: s.row.harvests || 0, buttons: u.buttons || 0, items, hide, pos: parse(s.row.pos, {}),
      compost: s.row.compost || 0, cleaned: s.row.cleaned || 0, chores: chows.filter(c => !got.includes(c.i)), choresAll: chows.length,
      cleanOn: !!R.gardenCleanOn, cleanPay: R.gardenCleanPay, cleanBtn: R.gardenCleanBtn, compostH: R.gardenCompostH,
      xp, level, lvlXp, levelLeft: lvlXp - xp % lvlXp, order };
  };
  if (m === 'GET' && p === '/api/garden') {
    const me = await h.currentUser(req, env), nick = (url.searchParams.get('nick') || '').replace(/^@/, '');
    const u = nick ? await env.DB.prepare('SELECT * FROM users WHERE nick = ? AND banned = 0').bind(nick).first() : me && me.nick ? me : null;
    if (!u || !u.nick) return json({ on: R.gardenOn, season: seasonOf(R, h.rigaDay()), today: h.rigaDay(), owner: null, mine: false });
    const mine = !!(me && me.id === u.id);
    const owner = { id: u.id, nick: u.nick, avatar: h.avatarOf(u) };
    if (!mine) { // гость видит грядки, но не трогает; огорода ещё нет — пустые грядки
      const r = await env.DB.prepare('SELECT beds, hide, pos, extra, removed, forms, chore_day, chore_got FROM garden WHERE user_id = ?').bind(u.id).first(), today = h.rigaDay();
      const beds = Array.from({ length: bedsN(R, r) }, (_, i) => view(parse(r && r.beds, [])[i], today)), hide = parse(r && r.hide, []), season = seasonOf(R, today);
      const chows = choresOf(u.id, today, R, season), got = r && r.chore_day === today ? parse(r.chore_got, []) : [];
      return json({ on: R.gardenOn, owner, mine, beds, season, today, prices: prices(), items: (await itemsOf(u.id)).filter(v => !hide.includes(v)), pos: parse(r && r.pos, {}), forms: parse(r && r.forms, {}),
        chores: chows.filter(c => !got.includes(c.i)), choresAll: chows.length, cleanOn: !!R.gardenCleanOn, cleanPay: R.gardenCleanPay, cleanBtn: R.gardenCleanBtn, bedSell: R.gardenBedSell });
    }
    const s = await rowOf(u.id), week = await weekly(u.id, s);
    let found = parse(s.row.found, []);
    const lv = levelOf(s.row.xp || 0, R), cur = Math.max(1, Number(s.row.lvl) || 1);
    if (lv > cur) { // новый уровень фермы — семечко за каждый (не больше 10 за заход)
      const steps = Math.min(10, lv - cur), seeds = { ...s.seeds }, gains = [];
      for (let i = 0; i < steps; i++) { const p = SIMPLE[fnv(u.id + ':lvl:' + (cur + i)) % SIMPLE.length]; seeds[p] = (seeds[p] || 0) + 1; gains.push({ p, src: 'level', at: now }); }
      const nf = [...found, ...gains].slice(-10);
      const q = await env.DB.prepare('UPDATE garden SET seeds = ?, found = ?, lvl = ? WHERE user_id = ? AND COALESCE(lvl, 1) = ?').bind(JSON.stringify(seeds), JSON.stringify(nf), cur + steps, u.id, cur).run();
      if (q.meta.changes) { s.seeds = seeds; s.row.found = JSON.stringify(nf); s.row.lvl = cur + steps; found = nf; }
    }
    if (found.length) await env.DB.prepare("UPDATE garden SET found = '[]' WHERE user_id = ?").bind(u.id).run(); // новость «🌱» прочитана: птичка в огороде
    return json({ ...(await state(u, s)), owner, mine, week, found });
  }
  if (m !== 'POST' || !p.startsWith('/api/garden/')) return null;
  const u = await h.needUser(req, env);
  if (!u.nick || u.banned) fail(400, 'nick');
  const b = await req.json().catch(() => ({}));
  const s = await rowOf(u.id), r0 = s.row;
  const i = Math.floor(Number(b.bed));
  const bedOk = () => { if (!(i >= 0 && i < s.beds.length)) fail(400, 'bed'); };
  // запись с проверкой, что огород не поменялся в другой вкладке (иначе 409 — браузер перезагрузит)
  const save = async (patch, extra = '') => {
    const keys = Object.keys(patch), vals = keys.map(k => typeof patch[k] === 'object' ? JSON.stringify(patch[k]) : patch[k]);
    const q = await env.DB.prepare(`UPDATE garden SET ${keys.map(k => k + ' = ?').join(', ')}${extra} WHERE user_id = ? AND beds = ? AND seeds = ? AND crop = ?`).bind(...vals, u.id, r0.beds, r0.seeds, r0.crop).run();
    if (!q.meta.changes) fail(409, 'busy');
  };
  // опыт фермы: действия дают XP, уровень считается при заходе (подарок — семечко)
  const addXp = (n) => {
    if (!(n > 0)) return null;
    const q = env.DB.prepare('UPDATE garden SET xp = COALESCE(xp, 0) + ? WHERE user_id = ?').bind(n, u.id).run();
    return q && typeof q.catch === 'function' ? q.catch(() => {}) : q;
  };
  const out = async (more = {}) => { const fresh = await env.DB.prepare('SELECT buttons FROM users WHERE id = ?').bind(u.id).first(); return json({ ok: true, ...more, ...(await state({ ...u, buttons: (fresh || {}).buttons || 0 }, await rowOf(u.id))) }); };
  if (p === '/api/garden/plant') {
    bedOk();
    const k = String(b.seed || '');
    if (!CROPS[k]) fail(400, 'seed');
    if (s.beds[i]) fail(409, 'taken');
    if (!(s.seeds[k] > 0)) fail(409, 'noseed');
    s.beds[i] = { p: k, t: now, g: 0, w: 0 };
    s.seeds[k]--; if (!s.seeds[k]) delete s.seeds[k];
    await save({ beds: s.beds, seeds: s.seeds });
    await addXp(2);
    return out();
  }
  if (p === '/api/garden/water') { // одну грядку (bed) или все (all: true) — каждую раз в сутки по Риге
    const today = h.rigaDay(), list = b.all ? s.beds.map((_, j) => j) : (bedOk(), [i]);
    const dish = h.rules().cookOn ? await dishOf(env, u.id).catch(() => null) : null, boost = dish && dish.t === 'grow' && dish.pct > 0 ? dish.pct * HOUR : 0; // блюдо с кухни (этап 89): полив сразу добавляет часы роста
    let n = 0;
    for (const j of list) {
      const x = s.beds[j];
      if (!x || !CROPS[x.p] || (x.w && dayOf(x.w) === today) || grown(x, now, R.gardenWetH) >= needMs(x, R)) continue;
      x.g = Math.min(needMs(x, R), grown(x, now, R.gardenWetH) + boost); x.w = now; n++;
    }
    if (!n) fail(409, 'watered');
    const wd = parse(r0.water_days, []); if (!wd.includes(today)) wd.push(today); // дни с поливом — для волшебного семечка
    await save({ beds: s.beds, water_days: wd.slice(-40) });
    await addXp(n);
    return out({ watered: n, boost: boost / HOUR });
  }
  if (p === '/api/garden/harvest') {
    if (b.all) { // собрать всё, что поспело, одной кнопкой
      const got = [];
      s.beds.forEach((x, j) => {
        if (!x || !CROPS[x.p] || grown(x, now, R.gardenWetH) < needMs(x, R)) return;
        const tree = TIER[x.p] === 'tree', n = tree && !x.m ? Math.max(1, Math.round(100 / Math.max(5, R.gardenTreeAgainPct || 30))) : 1;
        s.beds[j] = tree ? { p: x.p, t: x.t, g: 0, w: 0, m: 1 } : null;
        s.crop[x.p] = (s.crop[x.p] || 0) + n; got.push({ p: x.p, n });
      });
      if (!got.length) fail(409, 'nothing');
      await save({ beds: s.beds, crop: s.crop }, `, harvests = COALESCE(harvests, 0) + ${got.length}`);
      await addXp(5 * got.length);
      return out({ harvested: got, count: got.length });
    }
    bedOk();
    const x = s.beds[i];
    if (!x || !CROPS[x.p]) fail(409, 'empty');
    if (grown(x, now, R.gardenWetH) < needMs(x, R)) fail(409, 'growing');
    const tree = TIER[x.p] === 'tree', n = tree && !x.m ? Math.max(1, Math.round(100 / Math.max(5, R.gardenTreeAgainPct || 30))) : 1;
    s.beds[i] = tree ? { p: x.p, t: x.t, g: 0, w: 0, m: 1 } : null; // дерево остаётся и плодоносит снова
    s.crop[x.p] = (s.crop[x.p] || 0) + n;
    await save({ beds: s.beds, crop: s.crop }, ', harvests = COALESCE(harvests, 0) + 1');
    await addXp(5);
    return out({ harvested: x.p, n });
  }
  if (p === '/api/garden/dig') { // выкопать растение или дерево — грядка свободна, урожая нет
    bedOk();
    if (!s.beds[i]) fail(409, 'empty');
    s.beds[i] = null;
    await save({ beds: s.beds });
    await addXp(1);
    return out();
  }
  if (p === '/api/garden/sell') { // весь урожай одного вида (или n штук), all: true — всю корзинку
    if (b.all) {
      const keys = Object.keys(s.crop).filter(k => CROPS[k] && s.crop[k] > 0);
      if (!keys.length) fail(409, 'nocrop');
      if (!R.gardenOn) fail(403, 'off');
      let total = 0;
      for (const k of keys) total += h.btnOf(sellPct(R, k), unit) * s.crop[k];
      s.crop = {};
      await save({ crop: s.crop });
      const got = total > 0 ? await h.award(u.id, 'gsell', 'all:' + now + ':' + h.randomHex(4), total) : 0;
      await addXp(2);
      return out({ got });
    }
    const k = String(b.crop || ''), have = s.crop[k] || 0, n = Math.min(have, Math.max(1, Math.floor(Number(b.n) || have)));
    if (!CROPS[k] || !have) fail(409, 'nocrop');
    if (!R.gardenOn) fail(403, 'off');
    const each = h.btnOf(sellPct(R, k), unit);
    s.crop[k] = have - n; if (!s.crop[k]) delete s.crop[k];
    await save({ crop: s.crop });
    const got = each > 0 ? await h.award(u.id, 'gsell', k + ':' + now + ':' + h.randomHex(4), each * n) : 0;
    await addXp(1);
    return out({ got });
  }
  if (p === '/api/garden/hide') { // спрятать вещь огорода (on: true) или вернуть на место
    const v = String(b.item || ''), hide = parse(r0.hide, []).filter(x => x !== v);
    if (b.on) hide.push(v);
    await env.DB.prepare('UPDATE garden SET hide = ? WHERE user_id = ?').bind(JSON.stringify(hide.slice(-40)), u.id).run();
    return out();
  }
  if (p === '/api/garden/move') { // перестановка: {pos: {b0: [x, y], 'i:gnome': [x, y]}} целиком или {reset: true} — как было
    const pos = {};
    if (!b.reset) for (const [k, v] of Object.entries(b.pos && typeof b.pos === 'object' ? b.pos : {}).slice(0, 80)) {
      if (!(/^b\d{1,2}$/.test(k) && +k.slice(1) < s.beds.length) && !/^i:[a-z0-9]{1,24}$/.test(k)) continue;
      if (!Array.isArray(v) || v.length !== 2) continue;
      const x = Math.round(Number(v[0])), y = Math.round(Number(v[1]));
      if (Number.isFinite(x) && Number.isFinite(y)) pos[k] = [Math.max(-10, Math.min(250, x)), Math.max(0, Math.min(155, y))];
    }
    await env.DB.prepare('UPDATE garden SET pos = ? WHERE user_id = ?').bind(JSON.stringify(pos), u.id).run();
    return out();
  }
  if (p === '/api/garden/bed') { // клумбы: пустую — в сумку, поставить из сумки, продать (gardenBedSell 🔘)
    const act = String(b.act || '');
    const bag = Math.max(0, Math.floor(Number(r0.bedbag) || 0)), removed = Math.max(0, Math.floor(Number(r0.removed) || 0));
    if (act === 'remove') {
      bedOk();
      if (s.beds[i]) fail(409, 'planted');
      if (s.beds.length <= 1) fail(409, 'last');
      s.beds.splice(i, 1);
      const pos = shiftBeds(parse(r0.pos, {}), i), forms = shiftBeds(parse(r0.forms, {}), i);
      await save({ beds: s.beds, pos, forms, removed: removed + 1, bedbag: bag + 1 });
      return out({ removed: 1 });
    }
    if (act === 'place') {
      if (!bag || removed < 1) fail(409, 'nobed');
      if (s.beds.length >= Math.max(R.gardenBeds, R.gardenBedsMax || 10)) fail(409, 'max');
      const beds = [...s.beds, null];
      await save({ beds, removed: removed - 1, bedbag: bag - 1 });
      return out({ placed: 1 });
    }
    if (act === 'sell') {
      if (!bag) fail(409, 'nobed');
      if (!R.gardenOn) fail(403, 'off');
      const n = Math.max(1, Math.min(bag, Math.floor(Number(b.n) || 1)));
      await save({ bedbag: bag - n });
      const got = R.gardenBedSell > 0 ? await h.award(u.id, 'gbed', 'bedbag:' + now + ':' + h.randomHex(4), R.gardenBedSell * n) : 0;
      return out({ got, sold: n });
    }
    fail(400, 'act');
  }
  if (p === '/api/garden/clean') { // уборка листьев/снега: {i} — руками (компост и бонус за все), {all:true} — сразу за gardenCleanPay 🔘 с кучи
    const today = h.rigaDay(), season = seasonOf(R, today), chows = choresOf(u.id, today, R, season);
    if (!chows.length) fail(409, 'nochores');
    let got = r0.chore_day === today ? parse(r0.chore_got, []) : [];
    if (b.all) {
      const left = chows.filter(c => !got.includes(c.i));
      if (!left.length) fail(409, 'done');
      const cost = left.length * Math.max(0, R.gardenCleanPay || 0);
      if (cost > 0) {
        const q = await env.DB.prepare('UPDATE users SET buttons = COALESCE(buttons, 0) - ? WHERE id = ? AND COALESCE(buttons, 0) >= ?').bind(cost, u.id, cost).run();
        if (!q.meta.changes) fail(402, 'poor');
        await env.DB.prepare('INSERT OR IGNORE INTO button_log (user_id, kind, ref, amount, day, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(u.id, 'gcleanpay', today + ':' + now + ':' + h.randomHex(4), -cost, today, h.now()).run();
      }
      got = got.concat(left.map(c => c.i));
      const q = await env.DB.prepare('UPDATE garden SET chore_day = ?, chore_got = ?, cleaned = COALESCE(cleaned, 0) + ? WHERE user_id = ? AND beds = ? AND seeds = ? AND crop = ?')
        .bind(today, JSON.stringify(got), left.length, u.id, r0.beds, r0.seeds, r0.crop).run();
      if (!q.meta.changes) fail(409, 'busy');
      await addXp(1);
      return out({ cleaned: left.length, paid: cost, bonus: 0 });
    }
    const ch = chows.find(c => c.i === Math.floor(Number(b.i)));
    if (!ch) fail(404, 'chore');
    if (got.includes(ch.i)) fail(409, 'done');
    got.push(ch.i);
    const q = await env.DB.prepare('UPDATE garden SET chore_day = ?, chore_got = ?, cleaned = COALESCE(cleaned, 0) + 1, compost = COALESCE(compost, 0) + 1 WHERE user_id = ? AND beds = ? AND seeds = ? AND crop = ?')
      .bind(today, JSON.stringify(got), u.id, r0.beds, r0.seeds, r0.crop).run();
    if (!q.meta.changes) fail(409, 'busy');
    const allDone = chows.every(c => got.includes(c.i));
    const bonus = allDone && R.gardenOn && R.gardenCleanBtn > 0 ? await h.award(u.id, 'gclean', today, R.gardenCleanBtn) : 0;
    await addXp(2);
    return out({ cleaned: 1, compost: 1, bonus, choresLeft: chows.length - got.length });
  }
  if (p === '/api/garden/compost') { // компост: +gardenCompostH ч роста грядке
    bedOk();
    if (!(Number(r0.compost) > 0)) fail(409, 'nocompost');
    const x = s.beds[i];
    if (!x || !CROPS[x.p]) fail(409, 'empty');
    const need = needMs(x, R), gr = grown(x, now, R.gardenWetH);
    if (gr >= need) fail(409, 'ready');
    x.g = Math.min(need, gr + R.gardenCompostH * HOUR); x.w = now;
    const q = await env.DB.prepare('UPDATE garden SET beds = ?, compost = COALESCE(compost, 0) - 1 WHERE user_id = ? AND beds = ? AND seeds = ? AND crop = ? AND COALESCE(compost, 0) > 0')
      .bind(JSON.stringify(s.beds), u.id, r0.beds, r0.seeds, r0.crop).run();
    if (!q.meta.changes) fail(409, 'busy');
    await addXp(1);
    return out({ boost: R.gardenCompostH });
  }
  if (p === '/api/garden/addbed') { // докупить клумбу: пуговки сразу, клумба — пустая, в конце
    if (!R.gardenOn) fail(403, 'off');
    if (s.beds.length >= Math.max(R.gardenBeds, R.gardenBedsMax || 10)) fail(409, 'max');
    const cost = Math.max(0, R.gardenBedBtn || 0), ex = r0.extra || 0;
    if (cost > 0) {
      const q = await env.DB.prepare('UPDATE users SET buttons = COALESCE(buttons, 0) - ? WHERE id = ? AND COALESCE(buttons, 0) >= ?').bind(cost, u.id, cost).run();
      if (!q.meta.changes) fail(402, 'poor');
      await env.DB.prepare('INSERT OR IGNORE INTO button_log (user_id, kind, ref, amount, day, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(u.id, 'gbed', 'bed' + (s.beds.length + 1) + ':' + now + ':' + h.randomHex(4), -cost, h.rigaDay(), h.now()).run();
    }
    const q2 = await env.DB.prepare('UPDATE garden SET extra = ? WHERE user_id = ? AND COALESCE(extra, 0) = ?').bind(ex + 1, u.id, ex).run();
    if (!q2.meta.changes) { // в другой вкладке уже докупили — вернуть пуговки
      if (cost > 0) await env.DB.prepare('UPDATE users SET buttons = COALESCE(buttons, 0) + ? WHERE id = ?').bind(cost, u.id).run();
      fail(409, 'busy');
    }
    await addXp(5);
    return out({ added: 1 });
  }
  if (p === '/api/garden/form') { // форма клумбы: rect (обычная) — по умолчанию
    bedOk();
    const f = String(b.form || ''), forms = parse(r0.forms, {});
    if (!FORMS.includes(f)) fail(400, 'form');
    if (f === 'rect') delete forms['b' + i]; else forms['b' + i] = f;
    await env.DB.prepare('UPDATE garden SET forms = ? WHERE user_id = ?').bind(JSON.stringify(forms), u.id).run();
    return out();
  }
  if (p === '/api/garden/order') { // заказ дня: отдать урожай из корзинки — пуговки и семечко
    if (!R.gardenOn) fail(403, 'off');
    const today = h.rigaDay();
    if (r0.order_day === today) fail(409, 'orderdone');
    const ord = orderOf(u.id, today, R);
    if (!ord.items.every(x => (s.crop[x.p] || 0) >= x.n)) fail(409, 'ordnofruit');
    for (const x of ord.items) { s.crop[x.p] -= x.n; if (!s.crop[x.p]) delete s.crop[x.p]; }
    s.seeds[ord.seed] = (s.seeds[ord.seed] || 0) + 1;
    const reward = h.btnOf(ord.value * (R.gardenOrderPct || 150) / 100, unit);
    await save({ crop: s.crop, seeds: s.seeds, order_day: today });
    const got = reward > 0 ? await h.award(u.id, 'gorder', today, reward) : 0;
    await addXp(10);
    return out({ got, seed: ord.seed });
  }
  if (p === '/api/garden/buy') { // семена простых растений — за пуговки (здесь и в магазине); редкие и волшебные не продаются
    const k = String(b.seed || ''), n = Math.max(1, Math.min(20, Math.floor(Number(b.n) || 1)));
    if (!CROPS[k] || NOSALE(k)) fail(400, 'seed');
    const cost = h.btnOf(R.gardenSeedPct * CROPS[k] * (TIER[k] === 'tree' ? R.gardenTreeSeedMul : 1), unit) * n;
    if (cost > 0) {
      const q = await env.DB.prepare('UPDATE users SET buttons = COALESCE(buttons, 0) - ? WHERE id = ? AND COALESCE(buttons, 0) >= ?').bind(cost, u.id, cost).run();
      if (!q.meta.changes) fail(402, 'poor');
      await env.DB.prepare('INSERT OR IGNORE INTO button_log (user_id, kind, ref, amount, day, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(u.id, 'gseed', k + ':' + now + ':' + h.randomHex(4), -cost, h.rigaDay(), h.now()).run();
    }
    s.seeds[k] = (s.seeds[k] || 0) + n;
    await env.DB.prepare('UPDATE garden SET seeds = ? WHERE user_id = ?').bind(JSON.stringify(s.seeds), u.id).run();
    return out({ paid: cost });
  }
  if (p === '/api/garden/bug') {
    const today = h.rigaDay(), bug = bugsOf(u.id, today, R).find(x => x.i === Math.floor(Number(b.i)));
    if (!bug || bug.at > now) fail(404, 'bug');
    if (s.got.includes(bug.i)) fail(409, 'got');
    const got = [...s.got, bug.i];
    const q = await env.DB.prepare('UPDATE garden SET bug_day = ?, bug_got = ?, bugs = COALESCE(bugs, 0) + 1 WHERE user_id = ? AND bug_day = ? AND bug_got = ?')
      .bind(today, JSON.stringify(got), u.id, r0.bug_day || '', r0.bug_got || '[]').run();
    if (!q.meta.changes) fail(409, 'busy');
    const btn = R.gardenOn && R.gardenBugBtn > 0 ? await h.award(u.id, 'gbug', today + ':' + bug.i, R.gardenBugBtn) : 0;
    await addXp(2);
    return out({ got: btn });
  }
  return null;
}

// погода по сезону: сезон из правил или по месяцу в Риге
export function seasonOf(R, day) {
  if (R.gardenSeason && R.gardenSeason !== 'auto') return R.gardenSeason;
  const mo = +day.slice(5, 7);
  return mo === 12 || mo <= 2 ? 'winter' : mo <= 5 ? 'spring' : mo <= 8 ? 'summer' : 'autumn';
}

// семечко в награду в игре (worker/index.js award): шанс gardenDropPct, не больше gardenDropDay в сутки; простое случайное → в семена и в found (новость)
export async function gardenDrop(env, uid, src, R, day) {
  if (!R.gardenOn || !(R.gardenDropPct > 0) || !(R.gardenDropDay > 0) || Math.random() * 100 >= R.gardenDropPct) return null;
  let r = await env.DB.prepare('SELECT seeds, found, drop_day, drop_n FROM garden WHERE user_id = ?').bind(uid).first();
  if (!r) { // огорода ещё нет — заводим, как при первом заходе
    await env.DB.prepare('INSERT OR IGNORE INTO garden (user_id, seeds, created_at) VALUES (?, ?, ?)').bind(uid, JSON.stringify(starter(R)), Date.now()).run();
    r = await env.DB.prepare('SELECT seeds, found, drop_day, drop_n FROM garden WHERE user_id = ?').bind(uid).first();
  }
  const n = r.drop_day === day ? r.drop_n || 0 : 0;
  if (n >= R.gardenDropDay) return null;
  const p = SIMPLE[Math.floor(Math.random() * SIMPLE.length)], seeds = parse(r.seeds, {}), found = [...parse(r.found, []), { p, src, at: Date.now() }].slice(-10);
  seeds[p] = (seeds[p] || 0) + 1;
  const q = await env.DB.prepare("UPDATE garden SET seeds = ?, found = ?, drop_day = ?, drop_n = ? WHERE user_id = ? AND seeds = ? AND COALESCE(drop_day, '') = ? AND COALESCE(drop_n, 0) = ?")
    .bind(JSON.stringify(seeds), JSON.stringify(found), day, n + 1, uid, r.seeds, r.drop_day || '', r.drop_n || 0).run();
  return q.meta.changes ? p : null;
}
// новость «🌱» (NEWS_KINDS в worker/index.js): найденные семена, пока птичка не зашла в огород
export async function gardenNews(env, uid) {
  const r = await env.DB.prepare('SELECT found FROM garden WHERE user_id = ?').bind(uid).first().catch(() => null);
  const f = parse(r && r.found, []);
  if (!Array.isArray(f) || !f.length) return null;
  const last = f[f.length - 1];
  return { n: f.length, src: last.src, tier: f.some(x => TIER[x.p] === 'magic') ? 'magic' : f.some(x => TIER[x.p] === 'rare') ? 'rare' : '' };
}
