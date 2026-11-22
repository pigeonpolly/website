// Посты Facebook EN №225–274 к пинам №1671–1720 (Алина 22.11.2026): картинка поста — сам пин site/images/pins/pin-NNN.jpg.
// Тексты — поле fb в tools/pins/site5-data.js. node tools/fb/fb_site5.js → проверка длины RU (Threads ≤500) и JSON для Notion «Facebook posts EN».
const D = require('../pins/site5-data.js');
const S = { 'Зима': 'Зима', 'Лето': 'Лето', 'Осень': 'Осень', 'Весна': 'Весна' };
const all = [...D.wl, ...D.pc, ...D.tools, ...D.games, ...D.themes];
if (all.length !== 50) throw new Error('пинов ' + all.length);
const P = all.map((p, i) => { const [title, type, en, ru, hol] = p.fb; return { n: 225 + i, pin: 1671 + i, title, type, season: S[p.season] || 'Круглый год', hol: hol || null, img: `pins/pin-${1671 + i}.jpg`, en, ru }; });
const bad = P.filter(p => p.ru.length > 500).map(p => `${p.n}: ${p.ru.length}`);
if (bad.length) { console.error('RU длиннее 500:', bad.join(', ')); process.exit(1); }
const link = P.filter(p => /https?:|www\.|\.com/.test(p.en + p.ru)).map(p => p.n); if (link.length) { console.error('ссылки в тексте:', link); process.exit(1); }
console.log(JSON.stringify(P));
