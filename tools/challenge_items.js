// Предметы челленджа с тегами для сервера: challenge-data.js + content/challenge-tags.json → site/assets/challenge-items.json.
// Читает worker/challenge-plan.js (подбор тем, docs/challenge.md «Подбор тем»). Запускает build.py.
const fs = require('fs'), path = require('path');
const root = process.argv[2] || path.join(__dirname, '..');
global.window = {};
new Function(fs.readFileSync(path.join(root, 'site/assets/challenge-data.js'), 'utf8'))();
const D = window.CHALLENGE_DATA, tags = JSON.parse(fs.readFileSync(path.join(root, 'content/challenge-tags.json'), 'utf8'));
const T = [];
for (const t of tags) T[t.i] = [t.f, t.c, t.d];
const miss = D.subjects.map((s, i) => T[i] ? null : i).filter(i => i != null);
if (miss.length) console.error('challenge-items: нет тегов у предметов', miss.join(', '), '— запусти node tools/challenge_tags.js');
const out = { subjects: D.subjects, tags: D.subjects.map((s, i) => T[i] || null), colors: D.colors, tips: D.tips, twists: D.twists, extrasBw: D.extrasBw, times: D.times };
fs.writeFileSync(path.join(root, 'site/assets/challenge-items.json'), JSON.stringify(out));
console.log('challenge-items', D.subjects.length);
