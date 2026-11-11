#!/usr/bin/env node
// Проверка слов «Поезда в Испанию» (site/assets/train-words.js): каждое слово станции и бонусное складывается из её плиток,
// и сколько наборов для бесконечных станций получается у каждого языка. Запуск: node tools/train_check.js
global.window = {}; require('../site/assets/train-words.js'); const W = window.PPTrainWords;
const COL = { en: 1, lv: 3, es: 4, no: 5 };
const norm = (w, l) => { w = w.toLowerCase(); if (l === 'es') w = w.normalize('NFD').replace(/ñ/g, 'ñ').replace(/[̀-ͯ]/g, '').normalize('NFC'); return w; };
const cnt = s => { const m = {}; for (const c of s) m[c] = (m[c] || 0) + 1; return m; };
const fits = (w, t) => { const a = cnt(w); for (const c in a) if ((t[c] || 0) < a[c]) return false; return true; };
let bad = 0;
for (const l of Object.keys(COL)) {
  W[l].forEach((st, i) => { const t = cnt(norm(st.b, l));
    st.w.forEach(x => { if (!fits(norm(x[0], l), t)) { bad++; console.log(`✗ ${l} станция ${i + 1}: «${x[0]}» не из букв ${st.b}`); } if (x.length !== 5) { bad++; console.log(`✗ ${l} ${x[0]}: нужно [слово, значок, en, ru, lv]`); } });
    st.x.split(' ').filter(Boolean).forEach(w => { if (!fits(norm(w, l), t)) { bad++; console.log(`✗ ${l} станция ${i + 1}: бонус «${w}» не из букв ${st.b}`); } });
  });
  const words = new Set(); W[l].forEach(st => st.w.forEach(x => words.add(norm(x[0], l))));
  W.dict.trim().split('\n').forEach(r => { const p = r.split('|'); if (p.length !== 6) { bad++; console.log('✗ строка словаря:', r); } else if (!/\s/.test(p[COL[l]])) words.add(norm(p[COL[l]], l)); });
  console.log(`${l}: ${words.size} слов в словаре`);
}
console.log(bad ? `ошибок: ${bad}` : 'всё в порядке'); process.exit(bad ? 1 : 0);
