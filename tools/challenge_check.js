// Проверка подбора тем челленджа: 24 месяца с ноября 2026 тем же модулем worker/challenge-plan.js (история — октябрь из challenge-2026-10.json).
// Печатает только нарушения и итог. Запуск: node tools/challenge_check.js [месяцев]
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), months = +process.argv[2] || 24;
(async () => {
  const P = await import(path.join(root, 'worker/challenge-plan.js'));
  const data = JSON.parse(fs.readFileSync(path.join(root, 'site/assets/challenge-items.json'), 'utf8'));
  const oct = JSON.parse(fs.readFileSync(path.join(root, 'site/assets/challenge-2026-10.json'), 'utf8'));
  const plan = new Map(oct.map(r => [P.dayNum(r.day), r.item]));
  const R = P.CH_DEFAULTS, from = P.dayNum(P.PLAN_FROM);
  let relaxed = 0, last = from, t0 = Date.now();
  for (let k = 0; k < months; k++) {
    const y = 2026 + Math.floor((10 + k) / 12), m = (10 + k) % 12;
    const hist = new Map([...plan].filter(([n]) => n >= from - 150 + k * 30));
    const res = P.planMonth(data, R, y, m, hist);
    for (const r of res.rows) { plan.set(P.dayNum(r.day), r.item); last = P.dayNum(r.day); }
    relaxed += res.broken.length;
    // остальное в строке дня: 2–5 разных цветов из colors + moreColors, время, тексты на 3 языках; в день ЭКСТРА — Ч/Б-условие; скучные (off) — никогда
    const nc = P.allColors(data).length, off = new Set(data.off || []);
    for (const r of res.rows) {
      const bad = [];
      if (new Set(r.colors).size !== r.colors.length || r.colors.length < 2 || r.colors.length > 5 || r.colors.some(c => !(c >= 0 && c < nc))) bad.push('colors');
      if (off.has(r.item) && !r.day.endsWith('-01-23')) bad.push('off');
      if (String(data.subjects[r.item][3] || '').includes('halloween') && r.day.slice(5, 7) !== '10') bad.push('halloween');
      if (!data.times.includes(r.time)) bad.push('time');
      for (const f of ['subject', 'tip', 'twist']) if (!(r[f] && r[f].length === 3 && r[f].every(Boolean))) bad.push(f);
      if ((+r.day.slice(8) === P.extraDay(y, m)) !== !!r.extra) bad.push('extra');
      if (bad.length) console.log(r.day, 'строка:', bad.join(', '));
    }
  }
  const v = P.checkPlan(data, R, plan, from, last);
  for (const x of v) console.log(x.day, data.subjects[x.item][0], '—', x.rules.join(', '));
  // сезон: доля сезонных дней по месяцам — ровно chSeasonDaysPct
  let seasonBad = 0;
  for (let n = from; n <= last; n++) { const k = P.keyOfNum(n), p = P.poolOf(data, R, k), s = data.subjects[plan.get(n)][3] || ''; if (p !== 'bday' && (p === 'none' ? !!s : !s.split(' ').includes(p))) seasonBad++; }
  if (seasonBad) console.log('не тот сезон:', seasonBad, 'дн.');
  const d = { 1: 0, 2: 0, 3: 0 }; for (let n = from; n <= last; n++) d[data.tags[plan.get(n)][2]]++;
  console.log(`Итог: ${months} мес. (${last - from + 1} дн.), нарушений ${v.length + seasonBad}, ослаблено при подборе ${relaxed}; сложность 1/2/3 = ${d[1]}/${d[2]}/${d[3]}; ${((Date.now() - t0) / 1000).toFixed(1)} с`);
  if (v.length + seasonBad) process.exit(1);
})();
