// Цвета темы дня для сервера: какие из пяти цветов (фиолетовый p, жёлтый y, красный r, синий b, зелёный g) были в палитре дня.
// → site/assets/day-colors.json {"2026-10-11": "py", ...}. Дни ЭКСТРА (палитра из картины) не считаются. Запускает build.py.
const fs = require('fs'), path = require('path');
const root = process.argv[2];
global.window = {}; global.document = { documentElement: { lang: 'en' } };
for (const f of ['challenge-data.js', 'challenge-theme.js']) new Function(fs.readFileSync(path.join(root, 'site/assets', f), 'utf8'))();
const CT = window.ChallengeTheme, FAM = { purple: 'p', yellow: 'y', red: 'r', blue: 'b', green: 'g' };
const out = {};
// только дни до 1.11.2026: дальше темы — из плана в D1 (worker/challenge-days.js planDayColors)
for (let d = new Date(2024, 0, 1); d < new Date(2026, 10, 1); d.setDate(d.getDate() + 1)) {
  const th = CT.themeFor(d, 0); if (th.extra) continue;
  const s = th.colors.map(c => FAM[c.n[0]] || '').join('');
  if (s) out[CT.keyOf(d)] = s;
}
fs.writeFileSync(path.join(root, 'site/assets/day-colors.json'), JSON.stringify(out));
console.log('day-colors', Object.keys(out).length);
