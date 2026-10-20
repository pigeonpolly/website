// План тем челленджа в D1 (этап 3, docs/challenge.md «Подбор тем»): таблица challenge_days, создание месяцев, API сайта и кабинета «🎨 Темы челленджа».
// Подбор предметов — worker/challenge-plan.js; предметы с тегами — site/assets/challenge-items.json (build.py).
// Октябрь 2026 — из site/assets/challenge-2026-10.json (tools/challenge_oct.js), один раз (метка meta 'chplan_oct'). Ноябрь и дальше — генератор:
// cron с 20-го создаёт следующий месяц, текущий — если его почему-то нет. Созданный месяц сам не меняется, правит только Алина.
import { planMonth, rowText, rerollDay, checkPlan, dayNum, keyOfNum, poolOf, allColors, baseDay, birthdayIdx, PLAN_FROM, NEW_FROM } from './challenge-plan.js';

export const CHALLENGE_TABLES = [
  // день плана: item — индекс предмета в challenge-data.js; тексты — на трёх языках; colors — индексы цветов (colors + moreColors) через запятую: до 1.11.2026 — 3, дальше 2–5;
  // extra_* — Ч/Б-условие дня ЭКСТРА (есть только в день ЭКСТРА); edited — правила Алина; orig — как было при создании (JSON, для «↩ Вернуть как было»)
  `CREATE TABLE IF NOT EXISTS challenge_days (day TEXT PRIMARY KEY, item INTEGER, subject_en TEXT, subject_ru TEXT, subject_lv TEXT,
    tip_en TEXT, tip_ru TEXT, tip_lv TEXT, colors TEXT, time INTEGER, twist_en TEXT, twist_ru TEXT, twist_lv TEXT,
    extra_en TEXT, extra_ru TEXT, extra_lv TEXT, edited INTEGER DEFAULT 0, orig TEXT, updated_at INTEGER)`,
  // банк тем Алины: каждая тема, вписанная руками в окне дня (k — ключ без регистра и пробелов по краям; days — дни, где стоит, через запятую)
  `CREATE TABLE IF NOT EXISTS challenge_bank (id INTEGER PRIMARY KEY AUTOINCREMENT, k TEXT UNIQUE, en TEXT, ru TEXT, lv TEXT, days TEXT DEFAULT '', created_at INTEGER, updated_at INTEGER)`,
];
const bankKey = s => s.map(x => String(x || '').trim().toLowerCase()).find(Boolean) || '';
const bankKeyOf = s => bankKey([s[1], s[0], s[2]]); // по RU, нет — по EN, LV
const dayList = s => String(s || '').split(',').filter(Boolean);
// тема дня поменялась → день убрать из прежней темы банка, новую тему (если вписана руками, не из списка предметов) — в банк
async function bankPut(env, key, subject, fromList) {
  const k = bankKeyOf(subject);
  const had = (await env.DB.prepare("SELECT id, k, days FROM challenge_bank WHERE ',' || days || ',' LIKE ?").bind('%,' + key + ',%').all()).results;
  const q = had.filter(r => r.k !== k).map(r => env.DB.prepare('UPDATE challenge_bank SET days = ? WHERE id = ?').bind(dayList(r.days).filter(d => d !== key).join(','), r.id));
  if (k && !fromList) {
    const cur = await env.DB.prepare('SELECT days FROM challenge_bank WHERE k = ?').bind(k).first();
    const days = [...new Set([...dayList(cur && cur.days), key])].sort().join(',');
    q.push(env.DB.prepare(`INSERT INTO challenge_bank (k, en, ru, lv, days, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(k) DO UPDATE SET en = excluded.en, ru = excluded.ru, lv = excluded.lv, days = excluded.days, updated_at = excluded.updated_at`).bind(k, ...subject.map(x => String(x || '').trim()), days, now(), now()));
  }
  if (q.length) await env.DB.batch(q);
}
const L3 = ['en', 'ru', 'lv'];
const FIRST = '2026-10'; // раньше плана нет (темы — формулой challenge-theme.js)
const AHEAD = 60; // кабинет: сколько месяцев вперёд можно открыть и править (5 лет)
// с 1.12.2026 темы заполняет Алина: месяцы создаются пустыми, генератор берёт день, только если за час до его начала (с 23:00 по Риге) он ещё пустой
const BLANK_FROM = '2026-12-01';
const pad = n => String(n).padStart(2, '0');
const now = () => Math.floor(Date.now() / 1000);
const parseJ = (s, d) => { try { return JSON.parse(s); } catch (e) { return d; } };
const ymAdd = (ym, k) => { const t = +ym.slice(0, 4) * 12 + +ym.slice(5, 7) - 1 + k; return `${Math.floor(t / 12)}-${pad(t % 12 + 1)}`; };
const daysIn = ym => new Date(Date.UTC(+ym.slice(0, 4), +ym.slice(5, 7), 0)).getUTCDate();

// предметы с тегами (статика) — один раз на копию worker
let ITEMS = null;
export async function chItems(env) {
  if (ITEMS) return ITEMS;
  const r = await env.ASSETS.fetch(new Request('https://pigeonpolly.com/assets/challenge-items.json'));
  if (!r.ok) throw new Error('challenge-items ' + r.status);
  return (ITEMS = await r.json());
}
// строка базы ↔ объект плана {day, item, subject, tip, colors, time, twist, extra}
const toRow = r => ({ day: r.day, item: r.item, subject: L3.map(l => r['subject_' + l] || ''), tip: L3.map(l => r['tip_' + l] || ''),
  colors: String(r.colors || '').split(',').filter(x => x !== '').map(Number), time: r.time, twist: L3.map(l => r['twist_' + l] || ''),
  extra: r.extra_en || r.extra_ru || r.extra_lv ? L3.map(l => r['extra_' + l] || '') : null, edited: r.edited ? 1 : 0 });
const COLS = ['item', ...['subject', 'tip', 'twist', 'extra'].flatMap(f => L3.map(l => f + '_' + l)), 'colors', 'time'];
const colVals = d => [d.item, ...['subject', 'tip', 'twist', 'extra'].flatMap(f => L3.map((l, i) => (d[f] ? String(d[f][i] ?? '') : null) || (f === 'extra' ? null : ''))), (d.colors || []).join(','), d.time];
const plain = d => ({ day: d.day, item: d.item, subject: d.subject, tip: d.tip, colors: d.colors, time: d.time, twist: d.twist, extra: d.extra });
function insertSql(env, d) {
  return env.DB.prepare(`INSERT OR IGNORE INTO challenge_days (day, ${COLS.join(', ')}, edited, orig, updated_at) VALUES (?, ${COLS.map(() => '?').join(', ')}, 0, ?, ?)`)
    .bind(d.day, ...colVals(d), JSON.stringify(plain(d)), now());
}
async function monthRows(env, ym) {
  return (await env.DB.prepare('SELECT * FROM challenge_days WHERE day >= ? AND day <= ? ORDER BY day').bind(ym + '-01', ym + '-31').all()).results.map(toRow);
}
// план вокруг дня (для правил): номер дня → предмет
async function planAround(env, from, to) {
  const rows = (await env.DB.prepare('SELECT day, item FROM challenge_days WHERE day >= ? AND day <= ?').bind(keyOfNum(from), keyOfNum(to)).all()).results;
  return new Map(rows.filter(r => r.item != null).map(r => [dayNum(r.day), r.item]));
}
// октябрь 2026 — один раз из файла
async function importOct(env) {
  if ((await env.DB.prepare("SELECT value FROM meta WHERE key = 'chplan_oct'").first())) return;
  const r = await env.ASSETS.fetch(new Request('https://pigeonpolly.com/assets/challenge-2026-10.json'));
  if (!r.ok) return;
  const rows = await r.json();
  await env.DB.batch([...rows.map(d => insertSql(env, d)),
    env.DB.prepare("INSERT INTO meta (key, value) VALUES ('chplan_oct', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind(String(now()))]);
}
// 18.10.2026 — новые темы, цвета 2–5 и Ч/Б-указания с 19.10 (NEW_FROM): будущие дни (не правленные Алиной) — один раз заново (метка meta 'chplan_v4'):
// конец октября — из нового challenge-2026-10.json, ноябрь и дальше — генератор пересоберёт сам
async function upgradeV2(env) {
  if ((await env.DB.prepare("SELECT value FROM meta WHERE key = 'chplan_v4'").first())) return;
  await importOct(env);
  const from = [NEW_FROM, keyOfNum(dayNum(rigaToday()) + 1)].sort()[1];
  const r = await env.ASSETS.fetch(new Request('https://pigeonpolly.com/assets/challenge-2026-10.json'));
  const oct = r.ok ? (await r.json()).filter(d => d.day >= from) : [];
  await env.DB.batch([env.DB.prepare('DELETE FROM challenge_days WHERE day >= ? AND edited = 0').bind(from), ...oct.map(d => insertSql(env, d)),
    env.DB.prepare("INSERT INTO meta (key, value) VALUES ('chplan_v4', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind(String(now()))]);
}
// пустой день: без предмета и цветов; время, совет, Ч/Б и метка ЭКСТРА — как обычно
const emptyRow = (data, key) => ({ ...rowText(data, key, -1), day: key, item: null, subject: ['', '', ''], colors: [] });
// 20.10.2026: один раз (метка meta 'chplan_blank12') — все дни с BLANK_FROM удаляются, месяцы пересоздаются пустыми (ensureMonth)
async function blankFrom(env) {
  if ((await env.DB.prepare("SELECT value FROM meta WHERE key = 'chplan_blank12'").first())) return;
  await env.DB.batch([env.DB.prepare('DELETE FROM challenge_days WHERE day >= ?').bind(BLANK_FROM),
    env.DB.prepare("INSERT INTO meta (key, value) VALUES ('chplan_blank12', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind(String(now()))]);
}
async function updateRow(env, d, edited) {
  await env.DB.prepare(`UPDATE challenge_days SET ${COLS.map(c => c + ' = ?').join(', ')}, edited = ?, updated_at = ? WHERE day = ?`).bind(...colVals(d), edited, now(), d.day).run();
}
// день пустой (нет темы ни на одном языке; не ЭКСТРА — и нет цветов)? — дополнить по старым правилам: предмет — как «🎲 Другая тема», цвета — гармония генератора
async function fillDay(env, rules, key) {
  const row = await env.DB.prepare('SELECT * FROM challenge_days WHERE day = ?').bind(key).first();
  if (!row) return;
  const d = toRow(row), needSubj = !d.subject.some(x => x.trim()), needCols = !d.extra && !d.colors.length;
  if (!needSubj && !needCols) return;
  const data = await chItems(env);
  if (needSubj) {
    const n = dayNum(key);
    const item = poolOf(data, rules, key) === 'bday' ? birthdayIdx(data, +key.slice(0, 4)) : rerollDay(data, rules, await planAround(env, n - 150, n + 150), key, []);
    if (item == null) return;
    d.item = item; d.subject = rowText(data, key, item).subject;
  }
  if (needCols) d.colors = baseDay(data, key).colors;
  await updateRow(env, d, row.edited ? 1 : 0);
}
// сегодня (если вдруг пустой) и с 23:00 по Риге — завтра
const rigaHour = () => +new Date().toLocaleString('en-GB', { timeZone: 'Europe/Riga', hour: '2-digit', hourCycle: 'h23' });
async function autoFill(env, rules) {
  const today = rigaToday(), keys = [today];
  if (rigaHour() >= 23) keys.push(keyOfNum(dayNum(today) + 1));
  for (const k of keys) if (k >= BLANK_FROM) { await ensureMonth(env, rules, k.slice(0, 7)); await fillDay(env, rules, k); }
}
// месяц есть в базе? нет — создать по правилам (история — ~150 дней до него); с BLANK_FROM — пустым
export async function ensureMonth(env, rules, ym) {
  if (ym < FIRST) return false;
  await upgradeV2(env);
  if (ym === FIRST) { await importOct(env); return true; }
  if (ym + '-01' >= BLANK_FROM) await blankFrom(env); // до проверки «месяц уже есть»: старые сгенерированные дни с декабря — стереть один раз
  const have = await env.DB.prepare('SELECT COUNT(*) AS n FROM challenge_days WHERE day >= ? AND day <= ?').bind(ym + '-01', ym + '-31').first();
  if (have && have.n >= daysIn(ym)) return true;
  await importOct(env);
  const data = await chItems(env);
  if (ym + '-01' >= BLANK_FROM) {
    await blankFrom(env);
    await env.DB.batch(Array.from({ length: daysIn(ym) }, (_, k) => insertSql(env, emptyRow(data, `${ym}-${pad(k + 1)}`))));
    return true;
  }
  const start = dayNum(ym + '-01');
  const history = await planAround(env, start - 150, start - 1);
  const res = planMonth(data, rules, +ym.slice(0, 4), +ym.slice(5, 7) - 1, history);
  await env.DB.batch(res.rows.map(d => insertSql(env, d)));
  if (res.broken.length) console.log('challenge plan', ym, 'ослаблено:', JSON.stringify(res.broken));
  return true;
}
// месяц по Риге: сегодня и (с 20-го) следующий
const rigaToday = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Riga' });
const openMonths = (today = rigaToday()) => { const ym = today.slice(0, 7); return +today.slice(8, 10) >= 20 ? [ym, ymAdd(ym, 1)] : [ym]; };
// cron: текущий месяц (если нет) и с 20-го — следующий
export async function challengeCron(env, rules) {
  for (const ym of openMonths()) await ensureMonth(env, rules, ym);
  await autoFill(env, rules);
}
// цвета дней плана для бейджей за цвета (с NEW_FROM; раньше — site/assets/day-colors.json): {"2026-11-03": "py"}
const FAM = { purple: 'p', yellow: 'y', red: 'r', blue: 'b', green: 'g' };
export async function planDayColors(env) {
  const data = await chItems(env), out = {};
  const rows = (await env.DB.prepare('SELECT day, colors FROM challenge_days WHERE day >= ? AND extra_en IS NULL').bind(NEW_FROM).all()).results;
  const all = allColors(data);
  for (const r of rows) { const s = [...new Set(String(r.colors || '').split(',').map(i => { const c = all[+i] || { n: [] }; return FAM[c.f || c.n[0]] || ''; }))].join(''); if (s) out[r.day] = s; }
  return out;
}

// ---------- API ----------
// h: { json, fail, needUser, isAdmin, rules }
export async function challengeApi(req, env, url, h) {
  const p = url.pathname, m = req.method;
  // план месяца для сайта: /challenge/, главная, стена (challenge-theme.js кэширует ответ в localStorage)
  if (m === 'GET' && p === '/api/challenge/month') {
    const ym = String(url.searchParams.get('m') || '');
    if (!/^\d{4}-\d\d$/.test(ym)) h.fail(400, 'bad');
    if (openMonths().includes(ym) || ym === FIRST) await ensureMonth(env, h.rules(), ym);
    if (ym === rigaToday().slice(0, 7) || openMonths().includes(ym)) await autoFill(env, h.rules()); // не дождались cron — сегодняшний пустой день заполнится сейчас
    const days = ym < FIRST ? [] : (await monthRows(env, ym)).map(({ edited, ...d }) => d);
    return h.json({ m: ym, days }, 200, { 'cache-control': 'public, max-age=60' });
  }
  if (!p.startsWith('/api/admin/challenge')) return null;
  const u = await h.needUser(req, env);
  if (!(await h.isAdmin(u, env))) h.fail(403, 'admin');
  const data = await chItems(env), rules = h.rules();
  // календарь месяца для кабинета: дни плана, теги предметов, сколько уже работ, что нарушает правила
  if (m === 'GET' && p === '/api/admin/challenge') {
    const ym = /^\d{4}-\d\d$/.test(url.searchParams.get('m') || '') ? url.searchParams.get('m') : rigaToday().slice(0, 7);
    // в кабинете можно открыть план на год вперёд (AHEAD месяцев); месяцы создаются по порядку — генератору нужна история до месяца
    const curM = rigaToday().slice(0, 7);
    if (ym >= FIRST && ym <= ymAdd(curM, AHEAD)) for (let k = ym > curM ? curM : ym; k <= ym; k = ymAdd(k, 1)) await ensureMonth(env, rules, k);
    const days = await monthRows(env, ym);
    const works = Object.fromEntries((await env.DB.prepare('SELECT day, COUNT(*) AS n FROM posts WHERE day >= ? AND day <= ? GROUP BY day').bind(ym + '-01', ym + '-31').all()).results.map(r => [r.day, r.n]));
    let broken = [];
    if (days.length) {
      const s = dayNum(ym + '-01'), e = s + days.length - 1, plan = await planAround(env, s - 150, e + 150);
      broken = checkPlan(data, rules, plan, s, e).filter(x => x.day >= PLAN_FROM);
    }
    const last = ((await env.DB.prepare('SELECT day FROM challenge_days WHERE edited = 1 ORDER BY updated_at DESC LIMIT 1').first()) || {}).day || null; // последний правленный день — подсвечен в календаре
    const tags = days.map(d => { const t = data.tags[d.item] || []; return { f: t[0] || '', c: t[1] || '', d: t[2] || 0, pool: poolOf(data, rules, d.day) }; });
    return h.json({ m: ym, today: rigaToday(), days, tags, works, broken, last, colors: allColors(data), base: data.colors.length, ahead: AHEAD, times: data.times });
  }
  // банк тем: список (последние сверху) и удаление
  if (m === 'GET' && p === '/api/admin/challenge/bank') {
    const items = (await env.DB.prepare('SELECT id, en, ru, lv, days, created_at FROM challenge_bank ORDER BY updated_at DESC').all()).results.map(r => ({ ...r, days: dayList(r.days) }));
    return h.json({ items });
  }
  const b = await req.json().catch(() => ({}));
  if (m === 'POST' && p === '/api/admin/challenge/bank/delete') {
    await env.DB.prepare('DELETE FROM challenge_bank WHERE id = ?').bind(Number(b.id) || 0).run();
    return h.json({ ok: true });
  }
  const key = String(b.day || '');
  if (!/^\d{4}-\d\d-\d\d$/.test(key)) h.fail(400, 'bad');
  const cur = await env.DB.prepare('SELECT * FROM challenge_days WHERE day = ?').bind(key).first();
  if (!cur) h.fail(404, 'day');
  const save = (d, edited = 1) => updateRow(env, d, edited);
  // банк тем: тема, вписанная руками (не из списка предметов), — в банк; день уходит из прежней темы банка
  const track = (k, d) => { const gen = data.subjects[d.item]; return bankPut(env, k, d.subject, !!gen && bankKeyOf(gen) === bankKeyOf(d.subject)); };
  const back = async () => h.json({ day: toRow(await env.DB.prepare('SELECT * FROM challenge_days WHERE day = ?').bind(key).first()) });
  // правка дня: предмет, совет, 1–5 цветов, время, особенность, Ч/Б-условие ЭКСТРА
  if (m === 'POST' && p === '/api/admin/challenge/day') {
    const d = toRow(cur), t3 = (v, old) => Array.isArray(v) ? L3.map((l, i) => String(v[i] ?? '').trim().slice(0, 300)) : old;
    d.subject = t3(b.subject, d.subject); d.tip = t3(b.tip, d.tip); d.twist = t3(b.twist, d.twist);
    if (d.extra) d.extra = t3(b.extra, d.extra);
    if (Array.isArray(b.colors)) {
      const c = [...new Set(b.colors.map(Number).filter(i => Number.isInteger(i) && i >= 0 && i < allColors(data).length))];
      if (c.length < (key >= BLANK_FROM ? 0 : 1) || c.length > 5) h.fail(400, 'colors'); // 1 — монохромная гармония; с BLANK_FROM можно без цветов — подберутся в 23:00
      d.colors = c;
    }
    if (b.time != null) { if (!data.times.includes(Number(b.time))) h.fail(400, 'time'); d.time = Number(b.time); }
    if (!d.subject[0] && !d.subject[1] && !d.subject[2]) h.fail(400, 'subject');
    await save(d); await track(key, d); return back();
  }
  // «🎲 Другой предмет»: следующий подходящий по правилам (кроме уже предложенных — exclude)
  if (m === 'POST' && p === '/api/admin/challenge/reroll') {
    const n = dayNum(key), plan = await planAround(env, n - 150, n + 150);
    const item = rerollDay(data, rules, plan, key, (Array.isArray(b.exclude) ? b.exclude : []).map(Number).filter(Number.isInteger));
    if (item == null) h.fail(409, 'none');
    const d = toRow(cur); d.item = item; d.subject = rowText(data, key, item).subject;
    await save(d); await track(key, d); return back();
  }
  // «⇄ Поменять с днём…»: предметы двух дней меняются местами (цвета и остальное остаются у своих дней)
  if (m === 'POST' && p === '/api/admin/challenge/swap') {
    const other = await env.DB.prepare('SELECT * FROM challenge_days WHERE day = ?').bind(String(b.with || '')).first();
    if (!other || other.day === key) h.fail(404, 'day');
    const a = toRow(cur), c = toRow(other);
    [a.item, c.item, a.subject, c.subject] = [c.item, a.item, c.subject, a.subject];
    await save(a); await save(c); await track(key, a); await track(c.day, c);
    return h.json({ day: toRow(await env.DB.prepare('SELECT * FROM challenge_days WHERE day = ?').bind(key).first()), other: toRow(await env.DB.prepare('SELECT * FROM challenge_days WHERE day = ?').bind(other.day).first()) });
  }
  // «↩ Вернуть как было» — как при создании месяца
  if (m === 'POST' && p === '/api/admin/challenge/revert') {
    const o = parseJ(cur.orig, null);
    if (!o) h.fail(409, 'orig');
    await save({ ...o, day: key }, 0); await track(key, o); return back();
  }
  return null;
}
