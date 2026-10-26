// Проверка учебника английского: node tools/english_check.js [страница.html]
// 1) данные уроков: поля, формат заданий, уникальные id; 2) в браузере: каждый урок открывается без ошибок,
// правильные ответы из данных дают 100 % в каждом блоке (ключи ответов сходятся с проверкой), ошибочные — меньше.
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const file = path.resolve(process.argv[2] || 'english.html');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(String(e))); pg.on('console', m => { if (m.type() === 'error' && !/api\/english|Failed to load|ERR_/.test(m.text())) errs.push(m.text()); });
  await pg.goto('file://' + file);
  const units = await pg.evaluate(() => UNITS);
  const bad = [];
  const ids = new Set();
  const TYPES = ['gap', 'choice', 'order', 'fix', 'tr', 'tf'];
  for (const u of units) {
    if (ids.has(u.id)) bad.push(`${u.id}: id повторяется`); ids.add(u.id);
    for (const f of ['id', 'lvl', 't', 'th']) if (!u[f]) bad.push(`${u.id}: нет поля ${f}`);
    const groups = [...(u.ex || []).map((e, i) => [`e${i}`, [e]]), ...(u.read ? [['r', u.read.q]] : []), ...(u.series ? [['s', [{ t: 'choice', q: u.series.map(s => s.qz).filter(Boolean) }]]] : [])];
    for (const [k, gs] of groups) for (const g of gs) {
      if (!TYPES.includes(g.t)) bad.push(`${u.id}-${k}: тип ${g.t}`);
      for (const s of g.q) {
        const p = s.split(' # ')[0].split('|');
        if (p.length < 2 && g.t !== 'order') bad.push(`${u.id}-${k}: нет ответа: ${s}`);
        if (g.t === 'gap' && (p[0].match(/_{3,}/g) || []).length !== p[1].split(';').length) bad.push(`${u.id}-${k}: пропусков ≠ ответов: ${s}`);
        if (g.t === 'choice' && p.length < 3) bad.push(`${u.id}-${k}: мало вариантов: ${s}`);
        if (g.t === 'choice' && new Set(p.slice(1)).size !== p.length - 1) bad.push(`${u.id}-${k}: варианты повторяются: ${s}`);
        if (g.t === 'tf' && !['T', 'F'].includes(p[1].trim())) bad.push(`${u.id}-${k}: tf не T/F: ${s}`);
      }
    }
    for (const sr of u.series || []) { if (!sr.qz) bad.push(`${u.id}: цитата без вопроса: ${sr.q}`); if (!['friends', 'tbbt', 'parks', 'spn'].includes(sr.show)) bad.push(`${u.id}: сериал ${sr.show}`); }
    if (u.write && !u.write.min) bad.push(`${u.id}: письмо без min`);
  }
  // в браузере: правильные ответы → 100 %
  let blocks = 0;
  for (const u of units) {
    await pg.evaluate(id => { location.hash = 'u/' + id; }, u.id); await pg.waitForTimeout(30);
    const secs = await pg.$$('.exb');
    for (const sec of secs) {
      blocks++;
      await sec.evaluate(sec => {
        for (const li of sec.querySelectorAll('ol > li')) {
          const n = +li.dataset.n;
          const id = sec.dataset.b, u = UNITS.find(x => id.startsWith(x.id + '-'));
          const k = id.slice(u.id.length + 1);
          let groups = k === 'r' ? u.read.q : k === 's' ? [{ t: 'choice', q: u.series.map(s => s.qz).filter(Boolean) }] : [u.ex[+k.slice(1)]];
          const items = groups.flatMap(g => g.q.map(s => [g.t, s])); const [t, s] = items[n];
          const p = s.split(' # ')[0].split('|').map(x => x.trim());
          if (t === 'gap') { const ans = p[1].split(';'); li.querySelectorAll('input.gap').forEach((inp, i) => { inp.value = ans[i].split('/')[0]; }); }
          if (t === 'choice' || t === 'tf') { const r = [...li.querySelectorAll('input[type=radio]')].find(x => x.value === p[1]); if (r) r.checked = true; }
          if (t === 'fix' || t === 'tr') li.querySelector('input.line').value = p[1];
          if (t === 'order') {
            const want = p[0].replace(/[.!?]+$/, '').split(/\s+/); const built = li.querySelector('.built');
            want.forEach((w, i) => { const tok = [...li.querySelectorAll('.pool .tok')].find(x => x.textContent.toLowerCase() === w.toLowerCase()); if (tok) built.append(tok); });
          }
        }
        sec.querySelector('[data-act=check]').click();
      });
      const res = await sec.$eval('.res', e => e.textContent);
      if (res.trim() !== '100 %') {
        const why = await sec.$$eval('li.no', ls => ls.map(l => l.textContent.slice(0, 140)));
        bad.push(`${await sec.getAttribute('data-b')}: правильные ответы дали ${res}: ${why.join(' || ')}`);
      }
    }
  }
  for (const h of ['home', 'dict', 'ach', 'conf', 'series', 'irr', 'src', 'test/A1', 'test/B1']) { await pg.evaluate(h => { location.hash = h; }, h); await pg.waitForTimeout(30); }
  await b.close();
  const stats = { units: units.length, blocks, words: units.reduce((a, u) => a + (u.words || []).length, 0), quotes: units.reduce((a, u) => a + (u.series || []).length, 0) };
  console.log(JSON.stringify(stats));
  for (const x of [...bad, ...errs]) console.log('✗', x);
  console.log(bad.length + errs.length ? `ошибок: ${bad.length + errs.length}` : 'всё в порядке');
  process.exit(bad.length + errs.length ? 1 : 0);
})();
