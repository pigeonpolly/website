// Уроки курса туши (/ink/, docs/ink.md) — по книге Алины «Ink Sketching: Creative Guide». Отдаются только вошедшим: /api/school/lessons (worker/school.js).
// Урок lNN.js: { icon, card (карточка жителя Воббленда, site/images/cards/), cover, en|ru|lv: { name, intro, goals[], th (HTML, картинки — site/images/ink/),
//   simple, mist [[ошибка, как надо]], terms [[термин, значение]], fact, test [[вопрос, верный, неверный…, почему]], task {h, need, time, steps[]}, client {name, job, say, ask[]} } }.
// Всего уроков — COURSES.ink.n (15); ещё не написанные на странице — «скоро». Новый урок: файл + строка здесь + название в PLAN (ink-course.js) и INK (school-admin.js).
import l01 from './l01.js';
import l02 from './l02.js';
import l03 from './l03.js';
import l04 from './l04.js';
import l05 from './l05.js';
import l06 from './l06.js';

export const INK_LESSONS = [l01, l02, l03, l04, l05, l06];
