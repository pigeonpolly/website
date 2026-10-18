// Октябрь 2026 в план челленджа: темы, как их считает нынешний themeFor (challenge-theme.js) → site/assets/challenge-2026-10.json.
// Worker один раз импортирует файл в D1 challenge_days (метка в meta 'chplan_oct'), с ноября темы — из плана по новым правилам.
// С 19 октября (NEW_FROM, 18.10.2026) — уже по новым правилам: planMonth с 19-го числа поверх 1–18 (worker перезаписывает эти дни — метка 'chplan_v4').
// Заодно сверяет, что worker/challenge-plan.js (baseDay) даёт те же цвета, время, совет и особенность. Запуск: node tools/challenge_oct.js
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
global.window = {}; global.document = { documentElement: { lang: 'en' } };
for (const f of ['challenge-data.js', 'challenge-theme.js']) new Function(fs.readFileSync(path.join(root, 'site/assets', f), 'utf8'))();
const D = window.CHALLENGE_DATA, CT = window.ChallengeTheme;
(async () => {
  const P = await import(path.join(root, 'worker/challenge-plan.js'));
  const data = JSON.parse(fs.readFileSync(path.join(root, 'site/assets/challenge-items.json'), 'utf8'));
  const rows = [], bad = [];
  const fromD = +P.NEW_FROM.slice(8);
  for (let d = 1; d < fromD; d++) {
    const dt = new Date(2026, 9, d), key = CT.keyOf(dt), th = [0, 1, 2].map(L => CT.themeFor(dt, L));
    const item = D.subjects.findIndex(s => s[0] === th[0].subject);
    const base = P.baseDay(data, key);
    const colors = th[0].extra ? base.colors : th[0].colors.map(c => D.colors.findIndex(x => x.hex === c.hex));
    const row = { day: key, item, subject: th.map(t => t.subject), tip: th.map(t => t.tip), colors, time: th[0].time, twist: th.map(t => t.twist), extra: th[0].extra ? th.map(t => t.extraBw) : null };
    // сверка с модулем
    const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    if (!same(colors, base.colors) || row.time !== base.time || !same(row.tip, base.tip) || !same(row.twist, base.twist) || !same(row.extra, base.extra)) bad.push(key);
    if (item < 0) bad.push(key + ' (предмет не найден)');
    rows.push(row);
  }
  const res = P.planMonth(data, P.CH_DEFAULTS, 2026, 9, new Map(rows.map(r => [P.dayNum(r.day), r.item])), fromD);
  if (res.broken.length) bad.push('ослаблено: ' + res.broken.map(b => b.day).join(', '));
  rows.push(...res.rows);
  fs.writeFileSync(path.join(root, 'site/assets/challenge-2026-10.json'), JSON.stringify(rows));
  console.log('challenge-2026-10:', rows.length, 'дней;', bad.length ? 'расходится с challenge-plan.js: ' + bad.join(', ') : 'challenge-plan.js совпадает');
  if (bad.length) process.exit(1);
})();
