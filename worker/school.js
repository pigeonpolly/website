// Курсы рисования со сдачей работ (docs/challenge.md): «Смотри на мир как художник» (/polly-helps/, polly-school.js, course 'water')
// и «Тушь: курс скетчинга» (/ink/, ink-course.js, course 'ink', docs/ink.md — только вошедшим, уроки отдаёт /api/school/lessons).
// Ученик сдаёт фото страницы к уроку (полная + превью, как в челлендже) с запиской; Алина в кабинете «🎓 Школа»
// ставит печать (ok) или возвращает на доработку (redo) с комментарием. Ученику — новость «school», пока не открыл страницу курса.
// Пересдача после «на доработку» — новая строка (прежние попытки видны Алине); пока работа ждёт — замена той же строки.
// API: GET /api/school[?course=], POST /api/school/hand, GET /api/school/lessons?course=ink&lang=, GET /api/admin/school, POST /api/admin/school/check.
import { INK_LESSONS } from './ink/index.js';

export const SCHOOL_TABLES = [
  // status: wait — у Алины, ok — печать, redo — на доработку; seen = 0 — вердикт ученик ещё не видел
  "CREATE TABLE IF NOT EXISTS school_works (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, lesson INTEGER NOT NULL, img TEXT NOT NULL, note TEXT, status TEXT DEFAULT 'wait', comment TEXT, created_at INTEGER, checked_at INTEGER, seen INTEGER DEFAULT 1)",
  'CREATE INDEX IF NOT EXISTS school_works_u ON school_works (user_id, lesson)',
  'CREATE INDEX IF NOT EXISTS school_works_s ON school_works (status)',
];
// комментарий Алины переводится при проверке на все языки сайта: comment_tr = {en, ru, lv} (оригинал — на своём языке)
// course: 'water' — первый курс (старые строки), 'ink' — курс туши
export const SCHOOL_ALTER = ['ALTER TABLE school_works ADD COLUMN comment_tr TEXT', "ALTER TABLE school_works ADD COLUMN course TEXT DEFAULT 'water'"];
const LANGS = ['en', 'ru', 'lv'];
const langOf = t => /[а-яё]/i.test(t) ? 'ru' : /[āēīūčšžņļķģ]/i.test(t) ? 'lv' : 'en'; // на каком языке написала Алина
const trOf = r => { try { return JSON.parse(r.comment_tr || '{}'); } catch (e) { return {}; } };
// пуговки за диплом — один раз, button_log kind 'school' ref COURSES[c].ref; числа — в «📜 Правилах»
export const SCHOOL_RULES = { schoolDiplomaBtn: 150, inkDiplomaBtn: 200 };
export const SCHOOL_RANGE = { schoolDiplomaBtn: [0, 10000], inkDiplomaBtn: [0, 10000] };
export const SCHOOL_INT = ['schoolDiplomaBtn', 'inkDiplomaBtn'];
// n — уроков (диплом — печать у всех), members — уроки только вошедшим (с сервера), rule — пуговки за диплом
export const COURSES = { water: { n: 12, ref: 'diploma', rule: 'schoolDiplomaBtn' }, ink: { n: 15, ref: 'diploma-ink', rule: 'inkDiplomaBtn', members: true } };
export const SCHOOL_LESSONS = 12, SCHOOL_DAY_MAX = 20; // уроков первого курса; сдач в сутки на птичку (все курсы)
export const SCHOOL_KEEP_DAYS = 365; // фото работ хранятся год после диплома курса, потом удаляются (schoolCron)
const CO = "IFNULL(course, 'water')"; // старые строки без курса — первый курс
const courseOf = v => COURSES[v] ? v : 'water';

const last = rows => { const m = {}; for (const r of rows) m[r.lesson] = r; return m; }; // rows по id → последняя попытка урока
const doneOf = async (env, uid, c) => (await env.DB.prepare(`SELECT COUNT(DISTINCT lesson) AS n FROM school_works WHERE user_id = ? AND status = 'ok' AND ${CO} = ?`).bind(uid, c).first()).n;
const dipOf = (env, uid, c) => env.DB.prepare("SELECT amount FROM button_log WHERE user_id = ? AND kind = 'school' AND ref = ?").bind(uid, COURSES[c].ref).first().catch(() => null);

// новость ученику: вердикт Алины, который ещё не видел (курс — по последнему вердикту; news.js ведёт на страницу этого курса)
export async function schoolNews(env, uid) {
  const r = (await env.DB.prepare(`SELECT lesson, status, ${CO} AS course FROM school_works WHERE user_id = ? AND seen = 0 ORDER BY id DESC`).bind(uid).all()).results;
  if (!r.length) return null;
  const c = courseOf(r[0].course), mine = r.filter(x => x.course === c);
  const done = await doneOf(env, uid, c), dip = await dipOf(env, uid, c);
  return { course: c, of: COURSES[c].n, btn: dip ? dip.amount : 0, n: mine.length, lesson: r[0].lesson, ok: mine.filter(x => x.status === 'ok').length, redo: mine.filter(x => x.status === 'redo').length, diploma: done >= COURSES[c].n && mine.some(x => x.status === 'ok') }; // последняя печать курса — диплом
}

// раз в час (scheduled): у выпускников курса, чья последняя печать старше SCHOOL_KEEP_DAYS, удаляем фото работ этого курса.
// Строки с печатями остаются (img = '') — тропинка и диплом у ученика на месте; прежние попытки удаляются целиком. imgDrop(id) — удалить фото
export async function schoolCron(env, now, imgDrop) {
  let k = 0;
  for (const [c, o] of Object.entries(COURSES)) {
    const grads = `SELECT user_id FROM school_works WHERE status = 'ok' AND ${CO} = ? GROUP BY user_id HAVING COUNT(DISTINCT lesson) >= ${o.n} AND MAX(checked_at) < ?`;
    const rows = (await env.DB.prepare(`SELECT id, img, status FROM school_works WHERE img != '' AND ${CO} = ? AND user_id IN (${grads}) LIMIT 50`).bind(c, c, now - SCHOOL_KEEP_DAYS * 86400).all()).results;
    for (const r of rows) {
      await imgDrop(r.img).catch(() => {});
      await env.DB.prepare(r.status === 'ok' ? "UPDATE school_works SET img = '' WHERE id = ?" : 'DELETE FROM school_works WHERE id = ?').bind(r.id).run();
    }
    k += rows.length;
  }
  return k;
}

// h: json, fail, currentUser, needUser, isAdmin, imgPut, imgDrop(id), randomHex, now, rules(), award(uid, kind, ref, n), translate(texts, from, langs) → { tr: {lang: [..]} }
export async function schoolApi(req, env, url, h) {
  const p = url.pathname, m = req.method, { json, fail } = h;
  const lang = LANGS.includes(url.searchParams.get('lang')) ? url.searchParams.get('lang') : 'en';
  // уроки курса для своих (вошедшим с ником): весь текст на одном языке
  if (m === 'GET' && p === '/api/school/lessons') {
    const c = courseOf(url.searchParams.get('course'));
    if (c !== 'ink') fail(404, 'course');
    const u = await h.currentUser(req, env);
    if (!u || !u.nick || u.banned) return json({ me: false }, 401, { 'cache-control': 'no-store' });
    const lessons = INK_LESSONS.map((l, i) => { const x = l[lang] || l.en; return { n: i + 1, icon: l.icon, card: l.card, cover: l.cover, ...x }; });
    return json({ me: true, of: COURSES.ink.n, lessons }, 200, { 'cache-control': 'no-store' });
  }
  if (m === 'GET' && p === '/api/school') {
    const c = courseOf(url.searchParams.get('course'));
    const u = await h.currentUser(req, env);
    if (!u || !u.nick || u.banned) return json({ me: false, works: [] }, 200, { 'cache-control': 'no-store' });
    const rows = (await env.DB.prepare(`SELECT * FROM school_works WHERE user_id = ? AND ${CO} = ? ORDER BY id`).bind(u.id, c).all()).results;
    const tries = {}; for (const r of rows) tries[r.lesson] = (tries[r.lesson] || 0) + 1;
    const works = Object.values(last(rows)).map(r => ({ lesson: r.lesson, status: r.status, comment: trOf(r)[lang] || r.comment || '', img: r.img, note: r.note || '', at: r.created_at, checked: r.checked_at, tries: tries[r.lesson], fresh: !r.seen }));
    if (!url.searchParams.has('peek') && rows.some(r => !r.seen)) await env.DB.prepare(`UPDATE school_works SET seen = 1 WHERE user_id = ? AND seen = 0 AND ${CO} = ?`).bind(u.id, c).run(); // открыл курс — вердикты увидены (?peek — кабинет только смотрит)
    const dip = await dipOf(env, u.id, c);
    return json({ me: true, nick: u.nick, course: c, of: COURSES[c].n, works, diplomaBtn: dip ? dip.amount : 0 }, 200, { 'cache-control': 'no-store' });
  }
  if (m === 'POST' && p === '/api/school/hand') {
    const u = await h.needUser(req, env);
    if (!u.nick || u.banned) fail(400, 'nick');
    const f = await req.formData(), lesson = Number(f.get('lesson')), full = f.get('full'), thumb = f.get('thumb');
    const c = courseOf(f.get('course')), note = String(f.get('note') || '').trim().slice(0, 500);
    if (!(lesson >= 1 && lesson <= COURSES[c].n) || !full || !thumb || full.size > 6e6 || thumb.size > 2e6) fail(400, 'img');
    const day = (await env.DB.prepare('SELECT COUNT(*) AS n FROM school_works WHERE user_id = ? AND created_at > ?').bind(u.id, h.now() - 86400).first()).n;
    if (day >= SCHOOL_DAY_MAX) fail(429, 'many');
    const prev = await env.DB.prepare(`SELECT * FROM school_works WHERE user_id = ? AND lesson = ? AND ${CO} = ? ORDER BY id DESC LIMIT 1`).bind(u.id, lesson, c).first();
    if (prev && prev.status === 'ok') fail(409, 'done');
    const img = h.randomHex(12);
    await h.imgPut(env, img, await full.arrayBuffer(), await thumb.arrayBuffer());
    if (prev && prev.status === 'wait') { // ещё не проверена — заменяем, старое фото удаляем
      await env.DB.prepare('UPDATE school_works SET img = ?, note = ?, created_at = ? WHERE id = ?').bind(img, note, h.now(), prev.id).run();
      await h.imgDrop(prev.img).catch(() => {});
    }
    else await env.DB.prepare('INSERT INTO school_works (user_id, lesson, img, note, created_at, course) VALUES (?, ?, ?, ?, ?, ?)').bind(u.id, lesson, img, note, h.now(), c).run();
    return json({ ok: true, lesson, status: 'wait', img });
  }
  if (p === '/api/admin/school' || p === '/api/admin/school/check') {
    const u = await h.needUser(req, env);
    if (!(await h.isAdmin(u, env))) fail(403, 'admin');
    if (m === 'GET') {
      const st = url.searchParams.get('status') || 'wait';
      const latest = `w.id = (SELECT MAX(id) FROM school_works x WHERE x.user_id = w.user_id AND x.lesson = w.lesson AND IFNULL(x.course, 'water') = IFNULL(w.course, 'water'))`; // только последняя попытка урока
      const rows = (await env.DB.prepare(`SELECT w.*, u.nick FROM school_works w JOIN users u ON u.id = w.user_id WHERE ${latest} AND ${['wait', 'ok', 'redo'].includes(st) ? 'w.status = ?' : '? IS NOT NULL'} ORDER BY w.created_at ${st === 'wait' ? 'ASC' : 'DESC'} LIMIT 200`).bind(st).all()).results;
      // прежние попытки тех же уроков — чтобы видеть, что исправлено
      const out = [];
      for (const r of rows) {
        const before = (await env.DB.prepare(`SELECT img, comment, created_at FROM school_works WHERE user_id = ? AND lesson = ? AND ${CO} = ? AND id < ? ORDER BY id`).bind(r.user_id, r.lesson, courseOf(r.course), r.id).all()).results;
        out.push({ id: r.id, nick: r.nick, user: r.user_id, course: courseOf(r.course), lesson: r.lesson, img: r.img, note: r.note || '', status: r.status, comment: r.comment || '', tr: Object.keys(trOf(r)), at: r.created_at, checked: r.checked_at, before });
      }
      const n = (await env.DB.prepare(`SELECT status, COUNT(*) AS n FROM school_works w WHERE ${latest} GROUP BY status`).all()).results;
      return json({ works: out, counts: Object.fromEntries(n.map(x => [x.status, x.n])) }, 200, { 'cache-control': 'no-store' });
    }
    if (m === 'POST') {
      const b = await req.json().catch(() => ({}));
      const status = b.status, comment = String(b.comment || '').trim().slice(0, 1000);
      if (!['ok', 'redo'].includes(status)) fail(400, 'status');
      if (status === 'redo' && !comment) fail(400, 'comment'); // на доработку — всегда с объяснением
      const work = await env.DB.prepare(`SELECT id, user_id, ${CO} AS course FROM school_works WHERE id = ?`).bind(Number(b.id)).first();
      if (!work) fail(404, 'work');
      // перевод комментария на все языки сайта (не вышло — ученик увидит оригинал; при следующей правке переведётся заново)
      const from = langOf(comment), tr = comment ? { [from]: comment } : {};
      if (comment) { try { const r = await h.translate([comment], from, LANGS); for (const l of LANGS) if (r.tr[l] && r.tr[l][0]) tr[l] = r.tr[l][0]; } catch (e) {} }
      await env.DB.prepare('UPDATE school_works SET status = ?, comment = ?, comment_tr = ?, checked_at = ?, seen = 0 WHERE id = ?').bind(status, comment, JSON.stringify(tr), h.now(), work.id).run();
      // последняя печать курса — пуговки за диплом (один раз)
      let diploma = 0;
      if (status === 'ok') {
        const c = courseOf(work.course), o = COURSES[c];
        const n = Math.round(h.rules()[o.rule] || 0);
        if ((await doneOf(env, work.user_id, c)) >= o.n && n > 0) diploma = await h.award(work.user_id, 'school', o.ref, n);
      }
      return json({ ok: true, tr: Object.keys(tr), diploma });
    }
  }
  return null;
}
