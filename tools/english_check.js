// Проверка учебника английского: node tools/english_check.js [страница.html]
// 1) данные: поля уроков, формат заданий, уникальные id, notes.js (подсказки к книге есть в тексте части, пример «Своими словами» проходит проверку);
// 2) в браузере: замки (урок 2 закрыт, пока урок 1 не пройден на 80 %), каждый урок открывается без ошибок,
// правильные ответы дают 100 % в каждом блоке (и в собранных на лету), тесты уровней, прогресс сохраняется после перезагрузки.
const { chromium } = require('playwright');
const path = require('path');
const file = path.resolve(process.argv[2] || 'english.html');
const TYPES = ['gap', 'choice', 'order', 'fix', 'tr', 'tf', 'mk'], SHOWS = ['friends', 'tbbt', 'parks', 'spn', 'hp'];
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(String(e))); pg.on('console', m => { if (m.type() === 'error' && !/api\/english|Failed to load|ERR_/.test(m.text())) errs.push(m.text()); });
  await pg.goto('file://' + file); await pg.waitForTimeout(100);
  const { units, notes, book, lift } = await pg.evaluate(() => ({ units: UNITS, notes: window.EN_NOTES, book: window.EN_BOOK, lift: window.EN_LIFT }));
  const bad = [], ids = new Set();
  const fmtCheck = (where, g) => {
    if (!TYPES.includes(g.t)) bad.push(`${where}: тип ${g.t}`);
    for (const s of g.q) {
      const p = s.split(' # ')[0].split('|');
      if (p.length < 2 && g.t !== 'order') bad.push(`${where}: нет ответа: ${s}`);
      if (g.t === 'gap' && (p[0].match(/_{3,}/g) || []).length !== p[1].split(';').length) bad.push(`${where}: пропусков ≠ ответов: ${s}`);
      if (g.t === 'choice' && p.length < 3) bad.push(`${where}: мало вариантов: ${s}`);
      if (g.t === 'choice' && new Set(p.slice(1)).size !== p.length - 1) bad.push(`${where}: варианты повторяются: ${s}`);
      if (g.t === 'tf' && !['T', 'F'].includes((p[1] || '').trim())) bad.push(`${where}: tf не T/F: ${s}`);
      if (g.t === 'mk' && !p[2]) bad.push(`${where}: нет примера: ${s}`);
    }
  };
  for (const u of units) {
    if (ids.has(u.id)) bad.push(`${u.id}: id повторяется`); ids.add(u.id);
    for (const f of ['id', 'lvl', 't', 'th']) if (!u[f]) bad.push(`${u.id}: нет поля ${f}`);
    for (const [i, e] of (u.ex || []).entries()) fmtCheck(`${u.id}-e${i}`, e);
    for (const g of (u.read || {}).q || []) fmtCheck(`${u.id}-r`, g);
    for (const sr of u.series || []) { if (!sr.qz) bad.push(`${u.id}: цитата без вопроса: ${sr.q}`); else fmtCheck(`${u.id}-s`, { t: 'choice', q: [sr.qz] }); if (!SHOWS.includes(sr.show)) bad.push(`${u.id}: сериал ${sr.show}`); }
    if (u.write && !u.write.min) bad.push(`${u.id}: письмо без min`);
    const n = notes[u.id], part = book.parts.find(x => x.u === u.id);
    if (!n) { bad.push(`${u.id}: нет записи в notes.js`); continue; }
    if (!part) bad.push(`${u.id}: нет части книги`);
    for (const k of ['crow', 'mk', 'etym', 'ru', 'gl', 'tf', 'ch', 'bmk']) if (!n[k]) bad.push(`${u.id}: notes без ${k}`);
    if (n.mk) fmtCheck(`${u.id}-m`, { t: 'mk', q: n.mk });
    if (!n.st) bad.push(`${u.id}: нет смолтока (smalltalk.js)`); else { fmtCheck(`${u.id}-t`, { t: 'choice', q: n.st.dlg }); fmtCheck(`${u.id}-t`, { t: 'mk', q: [n.st.mk] }); }
    for (const k of ['tf', 'ch', 'bmk']) if (n[k]) fmtCheck(`${u.id}-b`, { t: k === 'ch' ? 'choice' : k === 'bmk' ? 'mk' : 'tf', q: n[k] });
    const txt = part ? part.txt.join(' ').toLowerCase() : '';
    for (const w of Object.keys(n.gl || {})) if (!new RegExp(`\\b${w.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(txt)) bad.push(`${u.id}: подсказки «${w}» нет в тексте части книги`);
  }
  for (const [lv, L] of Object.entries(lift || {})) fmtCheck('лифт ' + lv, { t: 'choice', q: L.q });
  if (Object.keys(lift || {}).length !== 6) bad.push('лифт: не все уровни');
  if (book.parts.length !== units.length) bad.push(`частей книги ${book.parts.length}, уроков ${units.length}`);
  // имя: при первом заходе спрашивает, «Alina» в заданиях заменяется
  await pg.evaluate(() => { localStorage.clear(); }); await pg.reload(); await pg.waitForTimeout(150);
  if (!(await pg.$('#namebox'))) bad.push('имя: окно не появилось при первом заходе');
  else { await pg.fill('#namebox [name=en]', 'Tessa'); await pg.fill('#namebox [name=ru]', 'Тесса'); await pg.click('#namebox button'); await pg.waitForTimeout(50); }
  const named = await pg.evaluate(() => JSON.stringify(UNITS).includes('Tessa') && !JSON.stringify(UNITS).includes('Alina') && JSON.stringify(window.EN_NOTES).includes('Тесса'));
  if (!named) bad.push('имя: не подставилось в материалы');
  // замки: с нуля открыт только первый урок
  await pg.evaluate(() => { const k = Object.keys(localStorage).find(x => x.startsWith('english-state')); const st = JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify({ rv: st.rv, name: st.name })); }); await pg.reload(); await pg.waitForTimeout(100);
  await pg.evaluate(() => { location.hash = 'u/' + UNITS[1].id; }); await pg.waitForTimeout(50);
  if (!(await pg.$('[data-pwf]')) || (await pg.$$('.exb')).length) bad.push('замок: второй урок открыт с нуля');
  // правильные ответы → 100 %
  const solve = async () => {
    let n = 0;
    for (;;) {
      const sec = await pg.$('.exb:not(.locked):not([data-done])'); if (!sec) break; n++;
      const r = await sec.evaluate(sec => {
        sec.dataset.done = 1;
        const items = window.EN_DEBUG.BLOCKS[sec.dataset.b], probs = [];
        for (const li of sec.querySelectorAll('ol > li')) {
          const it = items[+li.dataset.n], p = it.p;
          if (it.t === 'gap') { const ans = p[1].split(';'); li.querySelectorAll('input.gap').forEach((inp, i) => { inp.value = ans[i].split('/')[0]; }); }
          if (['choice', 'tf', 'lc'].includes(it.t)) { const r = [...li.querySelectorAll('input[type=radio]')].find(x => x.value === p[1]); if (r) r.checked = true; else probs.push('нет варианта ' + p[1]); }
          if (['fix', 'tr', 'sp'].includes(it.t)) li.querySelector('input.line').value = p[1];
          if (it.t === 'ls') li.querySelector('input.line').value = p[0];
          if (it.t === 'mk') li.querySelector('textarea').value = p[2] || '';
          if (it.t === 'order') { const built = li.querySelector('.built'); for (const w of p[0].replace(/[.!?]+$/, '').split(/\s+/)) { const tok = [...li.querySelectorAll('.pool .tok')].find(x => x.textContent.toLowerCase() === w.toLowerCase()); if (tok) built.append(tok); } }
        }
        sec.querySelector('[data-act=check]').click();
        for (const li of sec.querySelectorAll('ol > li.no')) { const it = items[+li.dataset.n]; if (it.auto || /^(fx-|lt-)/.test(sec.dataset.b) && it.t !== 'mk') { const bt = li.querySelector('[data-act=self]'); if (bt) bt.click(); else if (it.t !== 'mk') probs.push('авто: ' + li.textContent.slice(0, 120)); } else probs.push(li.textContent.slice(0, 160)); }
        return { id: sec.dataset.b, res: sec.querySelector('.res').textContent, probs };
      });
      if (r.probs.length) bad.push(`${r.id}: правильные ответы не прошли: ${r.probs.join(' || ')}`);
      await pg.waitForTimeout(5);
    }
    return n;
  };
  let blocks = 0;
  for (const u of units) {
    await pg.evaluate(id => { location.hash = 'u/' + id; }, u.id); await pg.waitForTimeout(30);
    if (await pg.$('[data-pwf="' + u.id + '"]')) { bad.push(`${u.id}: закрыт, хотя предыдущие пройдены`); continue; }
    blocks += await solve();
    const sc = await pg.evaluate(id => { const S = window.EN_DEBUG.state(); return UNITS.find(x => x.id === id) && Object.keys(S.d).filter(k => k.startsWith(id + '-')).length; }, u.id);
    if (!sc) bad.push(`${u.id}: ни один блок не засчитан`);
  }
  for (const l of ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']) { await pg.evaluate(h => { location.hash = h; }, 'test/' + l); await pg.waitForTimeout(30); blocks += await solve(); }
  for (const h of ['home', 'dict', 'ach', 'conf', 'series', 'irr', 'src', 'fix', 'book', 'etym', 'pods']) { await pg.evaluate(h => { location.hash = h; }, h); await pg.waitForTimeout(30); }
  // прогресс после перезагрузки на месте
  const before = await pg.evaluate(() => Object.keys(window.EN_DEBUG.state().d).length);
  await pg.reload(); await pg.waitForTimeout(150);
  const after = await pg.evaluate(() => Object.keys(window.EN_DEBUG.state().d).length);
  if (!before || after !== before) bad.push(`прогресс после перезагрузки: было ${before} блоков, стало ${after}`);
  await b.close();
  console.log(JSON.stringify({ units: units.length, blocks, bookParts: book.parts.length, quotes: units.reduce((a, u) => a + (u.series || []).length, 0), savedBlocks: after }));
  for (const x of [...bad, ...errs]) console.log('✗', x);
  console.log(bad.length + errs.length ? `ошибок: ${bad.length + errs.length}` : 'всё в порядке');
  process.exit(bad.length + errs.length ? 1 : 0);
})();
