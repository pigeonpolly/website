// «Смешивание цветов» /color-mixing/ (docs/palettes.md): материал → цвет → рецепты из настоящих пигментов.
// Модель: краски заданы цветом из тюбика (m) и разбелом 1:3 (t); спектры — spectral.js (spectral.min.js, MIT).
// Гуашь и акрил — двухконстантная модель Кубелки–Мунка (белила рассеивают сильнее), акварель — прозрачные слои (Бугер–Ламберт) на белой бумаге.
(() => {
  const SP = typeof window !== 'undefined' ? window.spectral : require('./spectral.min.js');
  const HAS_DOM = typeof document !== 'undefined';
  const L = HAS_DOM ? ({ ru: 'ru', lv: 'lv' }[document.documentElement.lang] || 'en') : 'en';
  const N = 38;

  // ── пигменты: код Colour Index, цвет из тюбика (m), разбел 1 часть : 3 белил (t) ──
  const PIG = [
    { id: 'lemon', ci: 'PY3', m: '#EFD510', t: '#F5EA8A', n: ['Lemon yellow (Hansa light)', 'Лимонная (ганза светлая)', 'Citrondzeltenā (Hansa gaišā)'] },
    { id: 'hansa', ci: 'PY74 / PY97', m: '#F5B80A', t: '#F9DC7C', n: ['Warm yellow (Hansa medium / cadmium yellow hue)', 'Тёплая жёлтая (ганза средняя / кадмий жёлтый)', 'Siltā dzeltenā (Hansa vidējā / kadmija dzeltenā)'] },
    { id: 'ochre', ci: 'PY42 / PY43', m: '#B87A28', t: '#E6CB98', n: ['Yellow ochre', 'Охра жёлтая', 'Dzeltenais okers'] },
    { id: 'scarlet', ci: 'PR255 / PR108', m: '#D9301C', t: '#F29A86', n: ['Warm red (scarlet / cadmium red light)', 'Тёплый красный (алый / кадмий красный светлый)', 'Siltā sarkanā (koši sarkanā / kadmija sarkanā gaišā)'] },
    { id: 'pyrrol', ci: 'PR254', m: '#BE1622', t: '#EC8A90', n: ['Pyrrole red', 'Пирроловый красный', 'Pirola sarkanā'] },
    { id: 'qrose', ci: 'PV19', m: '#A3164B', t: '#E06C9C', n: ['Quinacridone rose', 'Хинакридон розовый', 'Hinakridona rozā'] },
    { id: 'qmag', ci: 'PR122', m: '#8E1650', t: '#C85A96', n: ['Magenta (quinacridone magenta)', 'Маджента (хинакридон пурпурный)', 'Madženta (hinakridona purpura)'] },
    { id: 'aliz', ci: 'PR177 / PR83', m: '#6E1424', t: '#B8606F', n: ['Alizarin crimson', 'Краплак (ализарин)', 'Alizarīna krapplaka'] },
    { id: 'viol', ci: 'PV23', m: '#2A1640', t: '#6A4E9E', n: ['Dioxazine violet', 'Диоксазин фиолетовый', 'Dioksazīna violetā'], strong: 1 },
    { id: 'ultra', ci: 'PB29', m: '#1C2A80', t: '#6B7CC8', n: ['Ultramarine blue', 'Ультрамарин', 'Ultramarīns'] },
    { id: 'phthalo', ci: 'PB15:3', m: '#0A2350', t: '#2A6CB8', n: ['Phthalo blue (primary cyan)', 'Фталоцианин синий (голубая основная)', 'Ftalocianīna zilā (primārā ciāna)'], strong: 1 },
    { id: 'cerul', ci: 'PB35 / PB36', m: '#2E7DB0', t: '#A9CDE6', n: ['Cerulean blue', 'Церулеум', 'Cerulejs'] },
    { id: 'pgreen', ci: 'PG7', m: '#06302A', t: '#1C7E6C', n: ['Phthalo green', 'Фталоцианин зелёный', 'Ftalocianīna zaļā'], strong: 1 },
    { id: 'bsienna', ci: 'PBr7', m: '#7A2E14', t: '#C98466', n: ['Burnt sienna', 'Сиена жжёная', 'Dedzinātā siena'] },
    { id: 'bumber', ci: 'PBr7', m: '#3A2418', t: '#8E7A6E', n: ['Burnt umber', 'Умбра жжёная', 'Dedzinātā umbra'] },
    { id: 'black', ci: 'PBk9 / PBk11', m: '#1A1A1A', t: '#6C6C6E', n: ['Black (ivory / mars)', 'Чёрная (слоновая кость / марс)', 'Melnā (kaula / marsa)'], strong: 1 },
  ];
  const WHITE_HEX = '#F6F6F2';
  // материалы: какие краски есть и какие включены по умолчанию (набор «для начала»)
  const MEDIA = {
    watercolor: { all: ['lemon', 'hansa', 'ochre', 'scarlet', 'pyrrol', 'qrose', 'qmag', 'aliz', 'viol', 'ultra', 'phthalo', 'cerul', 'pgreen', 'bsienna', 'bumber', 'black'],
      on: ['lemon', 'hansa', 'ochre', 'scarlet', 'qrose', 'ultra', 'phthalo', 'pgreen', 'bsienna', 'bumber'], water: true },
    gouache: { all: ['lemon', 'hansa', 'ochre', 'scarlet', 'pyrrol', 'qrose', 'qmag', 'aliz', 'viol', 'ultra', 'phthalo', 'cerul', 'pgreen', 'bsienna', 'bumber', 'black'],
      on: ['lemon', 'hansa', 'ochre', 'scarlet', 'qmag', 'ultra', 'phthalo', 'pgreen', 'bsienna', 'bumber', 'black'] },
    acrylic: { all: ['lemon', 'hansa', 'ochre', 'scarlet', 'pyrrol', 'qrose', 'qmag', 'aliz', 'viol', 'ultra', 'phthalo', 'cerul', 'pgreen', 'bsienna', 'bumber', 'black'],
      on: ['lemon', 'hansa', 'ochre', 'scarlet', 'qmag', 'ultra', 'phthalo', 'pgreen', 'bsienna', 'bumber', 'black'] },
  };

  // ── цвет: спектр ↔ OKLab ──
  const KSf = r => (1 - r) ** 2 / (2 * r), KMf = k => 1 + k - Math.sqrt(k * k + 2 * k);
  const CMF = [0, 1, 2].map(() => new Float64Array(N));
  for (let i = 0; i < N; i++) { const e = new Array(N).fill(0); e[i] = 1; const x = new SP.Color(e).XYZ; for (let j = 0; j < 3; j++) CMF[j][i] = x[j]; }
  const cbrt = Math.cbrt;
  const xyzLab = (X, Y, Z) => {
    const l = cbrt(0.8189330101 * X + 0.3618667424 * Y - 0.1288597137 * Z), m = cbrt(0.0329845436 * X + 0.9293118715 * Y + 0.0361456387 * Z), s = cbrt(0.0482003018 * X + 0.2643662691 * Y + 0.6338517070 * Z);
    return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s, 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
  };
  const labOfR = R => { let X = 0, Y = 0, Z = 0; for (let i = 0; i < N; i++) { X += CMF[0][i] * R[i]; Y += CMF[1][i] * R[i]; Z += CMF[2][i] * R[i]; } return xyzLab(X, Y, Z); };
  const hexOfR = R => new SP.Color(Array.from(R)).toString({ format: 'hex' }).toUpperCase();
  const labOfHex = h => labOfR(new SP.Color(h).R);
  const dE = (a, b) => 100 * Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const lch = a => [a[0], Math.hypot(a[1], a[2]), (Math.atan2(a[2], a[1]) * 180 / Math.PI + 360) % 360];

  const Wc = new SP.Color(WHITE_HEX), WK = Wc.R.map(KSf), RP = Wc.R; // белила: K/S, S = 1; бумага — тот же белый
  const P = {};
  // краска из цвета в тюбике (m) и разбела 1:3 белилами (t) → K, S (гуашь, акрил), A, ts (акварель)
  function prep(p) {
    const m = new SP.Color(p.m), t = new SP.Color(p.t), Lm = labOfR(m.R)[0];
    const mk = m.R.map(KSf), tk = t.R.map(KSf);
    // рассеяние краски относительно белил: из разбела 1:3 (медиана по спектру — устойчивее)
    const Si = mk.map((_, i) => { const v = 3 * (tk[i] - WK[i]) / (mk[i] - tk[i]); return isFinite(v) && v > 0 ? v : null; }).filter(v => v !== null).sort((a, b) => a - b);
    const S = Si[Si.length >> 1] || 0.3;
    const K = Float64Array.from(mk, k => k * S);
    // акварель: поглощение по форме разбела, сила — так, чтобы чистая краска была цвета из тюбика
    const tA = t.R.map((r, i) => Math.max(0, -Math.log(r / RP[i])));
    let lo = 0, hi = 80; for (let j = 0; j < 40; j++) { const c = (lo + hi) / 2; if (labOfR(tA.map((a, i) => RP[i] * Math.exp(-c * a)))[0] > Lm) lo = c; else hi = c; }
    const A = Float64Array.from(tA, a => a * (lo + hi) / 2);
    // сила краски в акварельной смеси: насколько тёмный её разбел относительно чистой краски (фталоцианин — сильный, охра — слабая)
    const ts = 8 / ((lo + hi) / 2);
    return Object.assign({}, p, { S, K, A, ts });
  }
  for (const p of PIG) P[p.id] = prep(p);

  // items: [[pigment, parts]...], white — части белил (гуашь/акрил); d — насыщенность акварели (1 — из тюбика, 0.1 — светлый чай)
  const R_ = new Float64Array(N);
  const mixR = (items, white, d, water) => {
    let tot = 0; for (const it of items) tot += it[1];
    for (let i = 0; i < N; i++) {
      if (water) { let a = 0, tw = 0; for (const it of items) { a += it[0].A[i] * it[1] * it[0].ts; tw += it[1] * it[0].ts; } R_[i] = RP[i] * Math.exp(-d * a / tw); }
      else { let k = WK[i] * white, s = white; for (const it of items) { k += it[0].K[i] * it[1]; s += it[0].S * it[1]; } R_[i] = KMf(k / s); }
    }
    return R_;
  };
  const mixLab = (items, white, d, water) => labOfR(mixR(items, white, d, water));
  const mixHex = (items, white, d, water) => hexOfR(mixR(items, white, d, water));

  // ── подбор рецепта ──
  const F2 = [0.03, 0.06, 0.1, 0.16, 0.25, 0.35, 0.5, 0.65, 0.75, 0.84, 0.9, 0.94, 0.97];
  const T3 = []; { const v = [1, 2, 4, 8]; for (const a of v) for (const b of v) for (const c of v) { const g = [a, b, c]; const s = a + b + c; const key = g.map(x => (x / s).toFixed(3)).join(); if (!T3.some(t => t.key === key)) T3.push({ key, w: g.map(x => x / s) }); } }
  const WL = [0, 0.25, 0.5, 1, 2, 3, 5, 8, 12, 20, 35];             // белила на 1 часть краски
  const DL = [1, 0.7, 0.5, 0.35, 0.25, 0.18, 0.12, 0.08, 0.05, 0.03]; // акварель: сколько пигмента
  const UNITS = [0.25, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40];
  const snapU = x => { let b = UNITS[0]; for (const u of UNITS) if (Math.abs(Math.log(u / x)) < Math.abs(Math.log(b / x))) b = u; return b; };
  const penalty = r => 1.6 * (r.items.length - 1) + (r.items.some(it => it[0].id === 'black' || it[0].blk) ? 1 : 0);

  function coarse(tLab, pig, water) {
    const best = new Map(), lv = water ? DL : WL;
    const consider = (items) => {
      let b = null;
      for (const x of lv) { const lab = water ? mixLab(items, 0, x, true) : mixLab(items, x, 1, false); const e = dE(lab, tLab); if (!b || e < b.e) b = { e, x }; }
      const key = items.map(it => it[0].id).join('+'), cur = best.get(key);
      if (!cur || b.e < cur.e) best.set(key, { e: b.e, items: items.map(it => [it[0], it[1]]), x: b.x });
    };
    const n = pig.length;
    for (let i = 0; i < n; i++) consider([[pig[i], 1]]);
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (const f of F2) consider([[pig[i], f], [pig[j], 1 - f]]);
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) for (const t of T3) consider([[pig[i], t.w[0]], [pig[j], t.w[1]], [pig[k], t.w[2]]]);
    return [...best.values()];
  }
  // уточнение: покоординатный спуск по логарифмам долей и белил / воды
  function refine(c, tLab, water) {
    const v = c.items.map(it => Math.log(it[1])); let x = Math.log(Math.max(c.x, water ? 0.01 : 0.02));
    const useX = water || c.x > 0;
    const ev = () => { const items = c.items.map((it, i) => [it[0], Math.exp(v[i])]); const ex = Math.exp(x); return dE(water ? mixLab(items, 0, Math.min(1, ex), true) : mixLab(items, useX ? ex : 0, 1, false), tLab); };
    let e = ev();
    for (let step = 0.6; step > 0.02; step *= 0.6) {
      let moved = true;
      while (moved) {
        moved = false;
        const dims = v.length + (useX ? 1 : 0);
        for (let d = 0; d < dims; d++) for (const s of [step, -step]) {
          if (d < v.length) v[d] += s; else x += s;
          const e2 = ev();
          if (e2 < e - 1e-4) { e = e2; moved = true; } else { if (d < v.length) v[d] -= s; else x -= s; }
        }
      }
    }
    const sum = v.reduce((a, b) => a + Math.exp(b), 0);
    return { e, items: c.items.map((it, i) => [it[0], Math.exp(v[i]) / sum]), x: useX ? Math.min(water ? 1 : 1e9, Math.exp(x)) : 0 };
  }
  // в понятные единицы: горошины (гуашь, акрил) или кисти (акварель), ¼ — капелька / кончик кисти
  function toUnits(c, tLab, water) {
    // совсем маленькие доли (<3 %) убираем: на палитре их всё равно не отмерить
    let items0 = c.items.filter(it => it[1] >= 0.03); if (!items0.length) items0 = [c.items.slice().sort((a, b) => b[1] - a[1])[0]];
    const s0 = items0.reduce((a, it) => a + it[1], 0); items0 = items0.map(it => [it[0], it[1] / s0]);
    const minF = Math.min(...items0.map(it => it[1]));
    let best = null;
    for (const U of [1, 1.5, 2, 3, 4, 6, 8, 12, 16]) {
      if (minF * U < 0.12 && U < 16) continue;
      const items = items0.map(it => [it[0], snapU(it[1] * U)]);
      const tot = items.reduce((a, it) => a + it[1], 0);
      let white = 0, d = 1;
      if (water) d = c.x; else if (c.x * tot >= 0.15) white = snapU(c.x * tot);
      const lab = water ? mixLab(items, 0, d, true) : mixLab(items, white, 1, false);
      const fr = items.filter(it => it[1] % 1).length + (white % 1 ? 1 : 0);
      const score = dE(lab, tLab) + 0.04 * (tot + white) + 0.35 * fr + (items[0] && Math.max(...items.map(it => it[1])) < 1 ? 0.8 : 0);
      if (!best || score < best.score) best = { score, e: dE(lab, tLab), items, white, d };
    }
    best.items.sort((a, b) => b[1] - a[1]);
    best.hex = water ? mixHex(best.items, 0, best.d, true) : mixHex(best.items, best.white, 1, false);
    return best;
  }
  // отбор до 16 красок: лучшие по одной (с белилами/водой) и те, что входят в лучшие пары (грубая сетка)
  function shortlist(pig, tLab, water) {
    const seen = new Set(); pig = pig.filter(p => { const k = p.m + p.t; if (seen.has(k)) return false; seen.add(k); return true; }); // одинаковые по цвету краски — один раз
    if (pig.length <= 16) return pig;
    const lv = water ? [1, 0.4, 0.15, 0.05] : [0, 1, 4, 16], fr = [0.15, 0.5, 0.85];
    const best = (items) => { let e = 1e9; for (const x of lv) { const v = dE(water ? mixLab(items, 0, x, true) : mixLab(items, x, 1, false), tLab); if (v < e) e = v; } return e; };
    const single = pig.map(p => ({ p, e: best([[p, 1]]) })).sort((a, b) => a.e - b.e);
    const pairs = [];
    for (let i = 0; i < pig.length; i++) for (let j = i + 1; j < pig.length; j++) {
      let e = 1e9; for (const f of fr) { const v = best([[pig[i], f], [pig[j], 1 - f]]); if (v < e) e = v; }
      pairs.push({ a: pig[i], b: pig[j], e });
    }
    pairs.sort((a, b) => a.e - b.e);
    const out = new Set(single.slice(0, 6).map(x => x.p));
    for (const q of pairs) { if (out.size >= 16) break; out.add(q.a); if (out.size < 16) out.add(q.b); }
    return [...out];
  }
  function solve(hex, ids, water) {
    const tLab = labOfHex(hex);
    let pig = ids.map(id => P[id]).filter(Boolean);
    if (pig.length > 16) pig = shortlist(pig, tLab, water); // большой набор (вся серия бренда): перебор троек завис бы — сначала отбираем подходящие краски
    if (!pig.length) return { tLab, recipes: [] };
    const cand = coarse(tLab, pig, water).sort((a, b) => (a.e + penalty(a)) - (b.e + penalty(b))).slice(0, 14);
    const ref = cand.map(c => { const r = refine(c, tLab, water); return toUnits(r, tLab, water); });
    ref.sort((a, b) => (a.e + penalty(a)) - (b.e + penalty(b)));
    const out = [];
    for (const r of ref) {
      const key = r.items.map(it => it[0].id).sort().join();
      if (out.some(o => o.items.map(it => it[0].id).sort().join() === key)) continue;
      if (out.length && r.e > out[0].e + 6) continue; // заметно хуже лучшего — не показываем
      out.push(r); if (out.length === 3) break;
    }
    return { tLab, recipes: out };
  }

  if (!HAS_DOM) { module.exports = { P, PIG, MEDIA, solve, mixHex, labOfHex, dE, lch, prep, hexOfR, labOfR }; return; }

  // ═══════════════ страница ═══════════════
  const app = document.getElementById('mx-app');
  if (!app) return;
  const gi = { en: 0, ru: 1, lv: 2 }[L];
  const T = {
    m1: { en: '1. Choose your paint', ru: '1. Выберите материал', lv: '1. Izvēlies materiālu' },
    watercolor: { en: 'Watercolour', ru: 'Акварель', lv: 'Akvarelis' },
    gouache: { en: 'Gouache', ru: 'Гуашь', lv: 'Guaša' },
    acrylic: { en: 'Acrylic', ru: 'Акрил', lv: 'Akrils' },
    m2: { en: '2. Choose the colour you want', ru: '2. Выберите цвет, который нужен', lv: '2. Izvēlies vajadzīgo krāsu' },
    pick: { en: 'Pick a colour', ru: 'Выбрать цвет', lv: 'Izvēlēties krāsu' },
    photo: { en: '📷 From a photo', ru: '📷 Из фото', lv: '📷 No foto' },
    photoTip: { en: 'Tap the photo where the colour is. The photo stays on your device.', ru: 'Нажмите на фото там, где нужный цвет. Фото остаётся на вашем устройстве.', lv: 'Pieskaries foto vietā, kur ir vajadzīgā krāsa. Foto paliek tavā ierīcē.' },
    fromPal: { en: 'Or try a colour from my paintings:', ru: 'Или попробуйте цвет из моих картин:', lv: 'Vai pamēģini krāsu no manām gleznām:' },
    another: { en: '🎲 Other colours', ru: '🎲 Другие цвета', lv: '🎲 Citas krāsas' },
    mine: { en: 'My paints', ru: 'Мои краски', lv: 'Manas krāsas' },
    mineTip: { en: 'Tick the paints you have. The pigment code is printed on the tube or pan (like PB29): paints with the same code mix alike in any brand.', ru: 'Отметьте краски, которые у вас есть. Код пигмента написан на тюбике или кювете (например, PB29): краски с одним кодом смешиваются похоже у любого бренда.', lv: 'Atzīmē krāsas, kas tev ir. Pigmenta kods ir uz tūbiņas vai kivetes (piemēram, PB29): krāsas ar vienu kodu jaucas līdzīgi jebkuram zīmolam.' },
    all: { en: '☑ Select all', ru: '☑ Отметить все', lv: '☑ Atzīmēt visas' },
    clear: { en: '☐ Clear all', ru: '☐ Убрать все', lv: '☐ Noņemt visas' },
    brand: { en: 'Paints:', ru: 'Краски:', lv: 'Krāsas:' },
    baseSet: { en: 'Basic pigments (any brand)', ru: 'Базовые пигменты (любой бренд)', lv: 'Pamata pigmenti (jebkurš zīmols)' },
    brandSrc: { en: 'Where the pigments come from: {src}. Tick the tubes you have. ≈ means the pigment colour is approximate.', ru: 'Откуда составы: {src}. Отметьте тюбики, которые у вас есть. ≈ — цвет пигмента приблизительный.', lv: 'No kurienes sastāvi: {src}. Atzīmē tūbiņas, kas tev ir. ≈ — pigmenta krāsa ir aptuvena.' },
    brandsNote: { en: 'This site is not affiliated with paint makers. Brand and paint names belong to their owners; pigment lists are taken from the makers’ own websites and colour charts.', ru: 'Сайт не связан с производителями красок. Названия брендов и красок принадлежат их владельцам; составы взяты с сайтов и выкрасок самих производителей.', lv: 'Vietne nav saistīta ar krāsu ražotājiem. Zīmolu un krāsu nosaukumi pieder to īpašniekiem; sastāvi ņemti no pašu ražotāju vietnēm un krāsu kartēm.' },
    find: { en: 'Find a paint', ru: 'Найти краску', lv: 'Atrast krāsu' },
    cloudIn: { en: '💾 Saved in your profile: the same paints on any device.', ru: '💾 Сохраняется в вашем профиле: те же краски на любом устройстве.', lv: '💾 Saglabājas tavā profilā: tās pašas krāsas jebkurā ierīcē.' },
    cloudOut: { en: '💾 Sign in and your paints will be saved in your profile, on any device.', ru: '💾 Войдите — и отмеченные краски сохранятся в профиле, на любом устройстве.', lv: '💾 Ienāc — un atzīmētās krāsas saglabāsies tavā profilā jebkurā ierīcē.' },
    signIn: { en: 'Sign in', ru: 'Войти', lv: 'Ienākt' },
    reset: { en: '↺ Basic set', ru: '↺ Базовый набор', lv: '↺ Pamata komplekts' },
    m3: { en: '3. How to mix it', ru: '3. Как смешать', lv: '3. Kā sajaukt' },
    wait: { en: 'Mixing paints…', ru: 'Смешиваю краски…', lv: 'Jaucu krāsas…' },
    want: { en: 'you want', ru: 'нужен', lv: 'vajag' },
    got: { en: 'you get', ru: 'получится', lv: 'sanāks' },
    rec: { en: 'Recipe', ru: 'Рецепт', lv: 'Recepte' },
    simple: { en: 'simplest', ru: 'самый простой', lv: 'vienkāršākā' },
    acc: [[2, { en: 'almost exact', ru: 'почти точно', lv: 'gandrīz precīzi' }], [4, { en: 'very close', ru: 'очень близко', lv: 'ļoti tuvu' }], [7, { en: 'close', ru: 'близко', lv: 'tuvu' }], [99, { en: 'the closest your paints can get', ru: 'ближе всего, что дают ваши краски', lv: 'tuvākais, ko dod tavas krāsas' }]],
    unitPea: { en: '1 part = a pea-sized blob of paint from the tube (about 5 mm). ¼ = a tiny dot on the tip of a palette knife or brush.', ru: '1 часть = горошина краски из тюбика (около 5 мм). ¼ = капелька на кончике мастихина или кисти.', lv: '1 daļa = zirņa lieluma krāsas piciņa no tūbiņas (ap 5 mm). ¼ = mazs pilieniņš uz mastikas naža vai otas gala.' },
    unitBrush: { en: '1 part = one loaded brush (round brush no. 6–8). ¼ = just the tip of the brush.', ru: '1 часть = одна полная кисть краски (круглая кисть № 6–8). ¼ = только кончик кисти.', lv: '1 daļa = viena pilna ota krāsas (apaļā ota nr. 6–8). ¼ = tikai otas galiņš.' },
    unitT: { en: 'Units', ru: 'Единицы', lv: 'Mērvienības' },
    pea: { en: ['pea', 'peas'], ru: ['горошина', 'горошины', 'горошин'], lv: ['zirnītis', 'zirnīši'] },
    brush: { en: ['brush', 'brushes'], ru: ['кисть', 'кисти', 'кистей'], lv: ['ota', 'otas'] },
    dot: { en: 'a tiny dot', ru: 'капелька', lv: 'pilieniņš' },
    tip: { en: 'just the tip', ru: 'кончик кисти', lv: 'otas galiņš' },
    white: { en: 'Titanium white', ru: 'Белила титановые', lv: 'Titāna baltā' },
    water: { en: 'Water', ru: 'Вода', lv: 'Ūdens' },
    cons: [[0.7, { en: 'The mix is a thick paste: dark, rich, opaque strokes.', ru: 'Смесь густая, как паста: мазок тёмный, насыщенный, бумага не просвечивает.', lv: 'Maisījums biezs kā pasta: triepiens tumšs, piesātināts, papīrs necaurspīd.' }], [0.4, { en: 'The mix is thick but flows: bright strokes, the paper barely shows through.', ru: 'Смесь густая, но течёт с кисти: мазок яркий, бумага почти не просвечивает.', lv: 'Maisījums biezs, bet tek no otas: triepiens spilgts, papīrs gandrīz necaurspīd.' }], [0.2, { en: 'The mix is runny: a coloured stroke with the paper slightly showing through.', ru: 'Смесь жидкая: мазок цветной, но бумага немного просвечивает.', lv: 'Maisījums šķidrs: triepiens krāsains, bet papīrs mazliet caurspīd.' }], [0.1, { en: 'The mix is very watery: a see-through stroke, the paper shows clearly.', ru: 'Смесь очень водянистая: мазок прозрачный, бумага хорошо видна.', lv: 'Maisījums ļoti ūdeņains: triepiens caurspīdīgs, papīrs labi redzams.' }], [0, { en: 'Almost just water: a barely visible tint.', ru: 'Почти одна вода: еле заметный оттенок.', lv: 'Gandrīz tikai ūdens: tikko manāms tonis.' }]],
    waterAbout: { en: 'About', ru: 'Примерно', lv: 'Apmēram' },
    waterOf: { en: 'of water', ru: 'воды', lv: 'ūdens' },
    waterLittle: { en: 'Almost no water: just wet the brush', ru: 'Воды почти не нужно: только смочить кисть', lv: 'Ūdens gandrīz nevajag: tikai samitrināt otu' },
    steps: { en: 'How to mix', ru: 'Как смешивать', lv: 'Kā jaukt' },
    stOpaque: { en: 'Put the white on the palette first and add the colour to it bit by bit: a dark colour is much stronger than white.', ru: 'Сначала положите на палитру белила и добавляйте к ним цвет понемногу: тёмный цвет намного сильнее белил.', lv: 'Vispirms uzliec uz paletes balto un pa druskai pievieno krāsu: tumša krāsa ir daudz stiprāka par balto.' },
    stWhiteFirst: { en: 'Start with the white, then add the colours to it bit by bit.', ru: 'Начните с белил, потом понемногу добавляйте к ним цвета.', lv: 'Sāc ar balto, tad pa druskai pievieno tai krāsas.' },
    stMain: { en: 'Start with', ru: 'Начните с', lv: 'Sāc ar' },
    stAdd: { en: 'then add', ru: 'потом добавьте', lv: 'tad pievieno' },
    stWater: { en: 'Wet the paint with water in a palette well, then add the other colours one by one and stir. Test on a scrap of the same paper: watercolour dries lighter.', ru: 'Размочите краску водой в лунке палитры, добавьте остальные цвета по одному и размешайте. Проверьте на обрезке той же бумаги: акварель высыхает светлее.', lv: 'Samitrini krāsu ar ūdeni paletes iedobē, pievieno pārējās krāsas pa vienai un samaisi. Pārbaudi uz tā paša papīra strēmeles: akvarelis nožūst gaišāks.' },
    stGouache: { en: 'Gouache shifts a little as it dries: light colours often dry lighter, dark ones a bit lighter and duller too. Make a test swatch and let it dry.', ru: 'Гуашь при высыхании немного меняется: светлые цвета обычно светлеют, тёмные тоже становятся чуть светлее и глуше. Сделайте выкраску и дайте ей высохнуть.', lv: 'Guaša, nožūstot, nedaudz mainās: gaišas krāsas parasti kļūst gaišākas, tumšās arī mazliet gaišākas un blāvākas. Uztaisi izkrāsojumu un ļauj tam nožūt.' },
    stAcrylic: { en: 'Acrylic dries a little darker than it looks wet: mix a touch lighter than you need.', ru: 'Акрил высыхает чуть темнее, чем выглядит мокрым: смешайте чуть светлее, чем нужно.', lv: 'Akrils nožūst mazliet tumšāks, nekā izskatās slapjš: sajauc nedaudz gaišāku, nekā vajag.' },
    strongS: { en: 'very strong, add by tiny bits', ru: 'очень сильная, добавляйте по капельке', lv: 'ļoti spēcīga, pievieno pa pilieniņam' },
    wheel: { en: 'Colour wheel', ru: 'Цветовой круг', lv: 'Krāsu aplis' },
    wYou: { en: 'your colour (closer to the centre = more muted)', ru: 'ваш цвет (ближе к центру — глуше)', lv: 'tava krāsa (tuvāk centram — blāvāka)' },
    wOpp: { en: 'its opposite', ru: 'противоположный', lv: 'pretējā' },
    rules: { en: 'Mixing rules', ru: 'Правила смешивания', lv: 'Jaukšanas noteikumi' },
    strong: { en: 'is very strong: add it in tiny amounts.', ru: 'очень сильная краска: добавляйте совсем понемногу.', lv: 'ir ļoti spēcīga krāsa: pievieno pavisam pa druskai.' },
    path: { en: 'Step by step', ru: 'Шаг за шагом', lv: 'Soli pa solim' },
    about: { en: 'About this colour', ru: 'Про этот цвет', lv: 'Par šo krāsu' },
    tune: { en: 'Fine-tune it', ru: 'Подправить', lv: 'Pielāgot' },
    lighter: { en: 'Lighter', ru: 'Светлее', lv: 'Gaišāk' },
    darker: { en: 'Darker', ru: 'Темнее', lv: 'Tumšāk' },
    muted: { en: 'More muted', ru: 'Глуше', lv: 'Blāvāk' },
    addMore: { en: 'add more', ru: 'добавьте ещё', lv: 'pievieno vēl' },
    addLittle: { en: 'add a little', ru: 'добавьте немного', lv: 'pievieno mazliet' },
    moreWater: { en: 'add more water', ru: 'добавьте больше воды', lv: 'pievieno vairāk ūdens' },
    noBlack: { en: 'instead of black', ru: 'вместо чёрной', lv: 'melnās vietā' },
    compl: { en: '— its opposite on the colour wheel, so it calms the colour down without making it dirty', ru: '— противоположный на цветовом круге, он гасит яркость и не делает цвет грязным', lv: '— pretējā krāsu aplī, tā nodzēš spilgtumu un nepadara krāsu netīru' },
    gamut: { en: 'This colour is brighter than your paints can mix. With this tube it gets much closer:', ru: 'Этот цвет ярче, чем можно смешать из ваших красок. С этим тюбиком получится гораздо ближе:', lv: 'Šī krāsa ir spilgtāka, nekā var sajaukt no tavām krāsām. Ar šo tūbiņu sanāks daudz tuvāk:' },
    screen: { en: 'This is a very bright screen colour: paint cannot be quite this bright. Here is the closest one.', ru: 'Это очень яркий «экранный» цвет: краска не бывает настолько яркой. Вот самый близкий.', lv: 'Šī ir ļoti spilgta «ekrāna» krāsa: krāsa nevar būt tik spilgta. Lūk, tuvākā.' },
    note: { en: 'This is a calculation based on how real pigments mix (the Kubelka–Munk model). Paints of different brands, even with the same pigment, are not identical: if you mix different brands, or in some cases, the colour may come out not quite like on the site. It is best to experiment yourself with your own materials: make a test swatch on the same paper and adjust.', ru: 'Это расчёт по тому, как смешиваются настоящие пигменты (модель Кубелки — Мунка). Краски разных брендов, даже с одним пигментом, не одинаковые: при смешивании разных брендов или в отдельных случаях цвет может получиться не таким, как на сайте. Лучше всего экспериментировать самому на своих материалах: сделайте выкраску на той же бумаге и подправьте.', lv: 'Tas ir aprēķins pēc tā, kā jaucas īsti pigmenti (Kubelkas–Munka modelis). Dažādu zīmolu krāsas, pat ar vienu pigmentu, nav vienādas: jaucot dažādus zīmolus vai atsevišķos gadījumos krāsa var sanākt ne gluži tāda kā vietnē. Vislabāk eksperimentēt pašam ar saviem materiāliem: uztaisi izkrāsojumu uz tā paša papīra un pielāgo.' },
    none: { en: 'Tick at least one paint.', ru: 'Отметьте хотя бы одну краску.', lv: 'Atzīmē vismaz vienu krāsu.' },
    copy: { en: 'Copied', ru: 'Скопировано', lv: 'Nokopēts' },
  };
  const t = k => T[k][L];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const nm = id => P[id].n[gi];
  const ink = h => { const n = parseInt(h.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255; return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#1B1820' : '#FFFFFF'; };
  // «Мои краски», бренд и «Мои цвета» (ключи SYNC) у вошедших живут в профиле (syncPrefs, /api/mixing); в браузере — копия
  const SYNC = /^pp-mix-(p-|b-|saved$)/;
  let applying = false;
  const ls = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* приватный режим */ } if (SYNC.test(k) && !applying) { try { localStorage.setItem('pp-mix-t', String(Date.now())); } catch (e) { /* */ } syncSoon(); } } };
  const plural = (n, forms) => {
    if (L === 'ru') { const i = Math.floor(n); if (n !== i) return forms[1]; const a = i % 10, b = i % 100; return a === 1 && b !== 11 ? forms[0] : a >= 2 && a <= 4 && (b < 12 || b > 14) ? forms[1] : forms[2]; }
    if (L === 'lv') { return n % 10 === 1 && n % 100 !== 11 ? forms[0] : forms[1]; }
    return n === 1 ? forms[0] : forms[1];
  };
  const frac = n => { const w = Math.floor(n), r = n - w, f = r === 0.25 ? '¼' : r === 0.5 ? '½' : r === 0.75 ? '¾' : ''; return (w ? w : '') + f || '0'; };

  // состояние: материал, цвет, свои краски; адрес ?c=HEX&m=… можно отправить другу
  const qs = new URLSearchParams(location.search);
  let medium = MEDIA[qs.get('m')] ? qs.get('m') : (MEDIA[ls.get('pp-mix-m')] ? ls.get('pp-mix-m') : 'watercolor');
  let target = /^#?[0-9a-f]{6}$/i.test(qs.get('c') || '') ? '#' + qs.get('c').replace('#', '').toUpperCase() : '#7A9E7E';
  // бренды (site/assets/paint-brands.json, tools/paint_brands.js): краски серии — id «b:серия:номер», пигменты смешаны заранее
  let BR = null, BRP = null;
  const STRONG = /\b(PB15(:\d)?|PG7|PG36|PV23|PB16|PB60|PBk6|PBk7)\b/;
  const loadBrands = () => BRP || (BRP = fetch('/assets/paint-brands.json').then(r => r.ok ? r.json() : null).then(x => { BR = x; return x; }).catch(() => null));
  const brandOf = m => ls.get('pp-mix-b-' + m) || '';
  const lineOf = m => { const id = brandOf(m); const L = BR && id ? BR.lines.find(l => l.id === id && l.medium === m) : null; if (L && !L.ready) prepLine(L); return L; };
  function prepLine(L) {
    L.paints.forEach((x, i) => {
      const id = 'b:' + L.id + ':' + i, n = x[0], ru = x[7] || n;
      P[id] = prep({ id, m: x[3], t: x[4], n: [n, ru, n], ci: x[2].replace(/,/g, ', ') + (x[6] ? ' ≈' : ''), strong: STRONG.test(x[2]) ? 1 : 0, blk: /^PBk\d+$/.test(x[2]) ? 1 : 0 });
    });
    L.ready = 1;
  }
  const pkey = m => 'pp-mix-p-' + m + (lineOf(m) ? '-' + brandOf(m) : '');
  const allIds = m => { const L = lineOf(m); return L ? L.paints.map((_, i) => 'b:' + L.id + ':' + i) : MEDIA[m].all; };
  const defaultOn = m => { const L = lineOf(m); return L ? L.starter.map(i => 'b:' + L.id + ':' + i) : MEDIA[m].on.slice(); };
  const myPaints = m => { const s = ls.get(pkey(m)); if (s === '-') return []; const all = allIds(m); const v = s ? s.split(',').filter(id => all.includes(id)) : null; return v && v.length ? v : defaultOn(m); };

  app.innerHTML = `<nav class="mx-tabs" role="tablist"><button type="button" role="tab" data-tab="find"></button><button type="button" role="tab" data-tab="play"></button><button type="button" role="tab" data-tab="pigs"></button></nav>
    <div class="mx-pane mx-find" data-pane="find"><div class="mx-left"><div class="mx-step"><h2>${t('m1')}</h2><div class="mx-media" role="tablist">${Object.keys(MEDIA).map(m => `<button type="button" role="tab" data-m="${m}">${t(m)}</button>`).join('')}</div>
      <label class="mx-brw">🎨 ${t('brand')} <select class="mx-brand"></select></label><p class="mx-hint mx-bsrc" hidden></p>
      <details class="mx-mine"><summary>🎨 ${t('mine')} <span class="mx-cnt"></span></summary><p class="mx-hint">${t('mineTip')}</p><p class="mx-hint mx-cloud"></p><input class="mx-pfind" type="search" placeholder="🔍 ${t('find')}" hidden><div class="mx-pg"></div><div class="mx-acts"><button type="button" class="mx-all mx-lnk">${t('all')}</button><button type="button" class="mx-nonebtn mx-lnk">${t('clear')}</button><button type="button" class="mx-reset mx-lnk">${t('reset')}</button></div></details></div>
    <div class="mx-step"><h2>${t('m2')}</h2>
      <div class="mx-pickrow"><label class="mx-color"><input type="color" value="${target}" aria-label="${t('pick')}"><span class="mx-tsw"></span></label>
        <input class="mx-hex" type="text" maxlength="7" spellcheck="false" aria-label="HEX" value="${target}">
        <label class="mx-btn mx-ph">${t('photo')}<input type="file" accept="image/*" hidden></label></div>
      <div class="mx-photo" hidden><p class="mx-hint">${t('photoTip')}</p><canvas></canvas></div>
      <div class="mx-pal"><p class="mx-hint">${t('fromPal')}</p><div class="mx-chips"></div><button type="button" class="mx-lnk mx-more">${t('another')}</button></div></div>
    </div><div class="mx-step mx-right"><h2>${t('m3')}</h2><p class="mx-unit"></p><div class="mx-out"></div>
      <p class="mx-note">⚠️ ${t('note')}</p><p class="mx-hint mx-legal">${t('brandsNote')}</p></div></div>
    <div class="mx-pane" data-pane="play" hidden></div><div class="mx-pane" data-pane="pigs" hidden></div>`;
  const $ = s => app.querySelector(s);

  function brandOptions() {
    const cur = lineOf(medium) ? brandOf(medium) : '';
    return `<option value="">${t('baseSet')}</option>` + (BR ? BR.lines.filter(l => l.medium === medium).map(l => `<option value="${l.id}"${l.id === cur ? ' selected' : ''}>${esc(l.brand + ' — ' + l.name)} (${l.paints.length})</option>`).join('') : (brandOf(medium) ? `<option selected>…</option>` : ''));
  }
  function renderMedia() {
    app.querySelectorAll('[data-m]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.m === medium)));
    app.querySelectorAll('.mx-brand').forEach(sel => { sel.innerHTML = brandOptions(); });
    const L = lineOf(medium), bs = $('.mx-bsrc'); bs.hidden = !L; if (L) bs.textContent = t('brandSrc').replace('{src}', L.src);
    $('.mx-pg').classList.toggle('mx-pgb', !!L); $('.mx-pfind').hidden = !L; $('.mx-pfind').value = '';
    const on = myPaints(medium);
    $('.mx-pg').innerHTML = allIds(medium).map(id => `<label class="mx-p"><input type="checkbox" value="${id}"${on.includes(id) ? ' checked' : ''}><i style="background:linear-gradient(90deg,${P[id].m} 50%,${P[id].t} 50%)"></i><span>${esc(nm(id))}<small>${P[id].ci}</small></span></label>`).join('') +
      (MEDIA[medium].water || L ? '' : `<label class="mx-p"><input type="checkbox" checked disabled><i style="background:${WHITE_HEX}"></i><span>${t('white')}<small>PW6</small></span></label>`);
    $('.mx-cnt').textContent = '(' + on.length + ')';
    const w = MEDIA[medium].water;
    $('.mx-unit').innerHTML = `<b>${t('unitT')}:</b> ${w ? t('unitBrush') : t('unitPea')}<br>💡 ${w ? t('stWater') : t('stOpaque') + ' ' + (medium === 'gouache' ? t('stGouache') : t('stAcrylic'))}`;
  }
  const amt = (n, water) => {
    if (n === 0.25) return water ? t('tip') : t('dot');
    const f = water ? T.brush[L] : T.pea[L];
    return frac(n) + ' ' + plural(n, f);
  };
  const sw = (hex, cls) => `<span class="mx-sw${cls ? ' ' + cls : ''}" style="background:${hex}" title="${hex}"></span>`;

  function describe(tl) {
    const [Lv, C, h] = lch(tl);
    const H = [[20, ['crimson', 'малиновый', 'aveņsarkans']], [45, ['red', 'красный', 'sarkans']], [75, ['orange', 'оранжевый', 'oranžs']], [115, ['yellow', 'жёлтый', 'dzeltens']], [165, ['green', 'зелёный', 'zaļš']], [215, ['turquoise', 'бирюзовый', 'tirkīzs']], [275, ['blue', 'синий', 'zils']], [315, ['violet', 'фиолетовый', 'violets']], [345, ['pink-magenta', 'пурпурный', 'purpursarkans']], [361, ['crimson', 'малиновый', 'aveņsarkans']]];
    let hue = H.find(x => h < x[0])[1][gi];
    if (C < 0.03) hue = ['grey', 'серый', 'pelēks'][gi];
    else if (Lv < 0.62 && C < 0.13 && h > 30 && h < 100) hue = ['brown', 'коричневый', 'brūns'][gi];
    const light = Lv > 0.86 ? ['very light', 'очень светлый', 'ļoti gaišs'] : Lv > 0.7 ? ['light', 'светлый', 'gaišs'] : Lv > 0.5 ? ['mid-tone', 'средний по тону', 'vidēja toņa'] : Lv > 0.35 ? ['dark', 'тёмный', 'tumšs'] : ['very dark', 'очень тёмный', 'ļoti tumšs'];
    const sat = C > 0.15 ? ['bright', 'яркий', 'spilgts'] : C > 0.08 ? ['medium-bright', 'средней яркости', 'vidēji spilgts'] : C > 0.03 ? ['muted', 'приглушённый', 'piesātinājumā remdens'] : ['nearly neutral', 'почти нейтральный', 'gandrīz neitrāls'];
    const warm = C < 0.03 ? null : (h < 105 || h > 335) ? ['warm', 'тёплый', 'silts'] : (h > 150 && h < 300) ? ['cool', 'холодный', 'vēss'] : null;
    const words = [light[gi], sat[gi], warm && warm[gi], hue].filter(Boolean);
    const theory = C > 0.15
      ? { en: 'Bright colours come from two clean paints that sit close on the colour wheel. Every extra paint makes the mix duller.', ru: 'Яркие цвета получаются из двух чистых красок, которые стоят рядом на цветовом круге. Каждая лишняя краска делает смесь глуше.', lv: 'Spilgtas krāsas sanāk no divām tīrām krāsām, kas krāsu aplī ir blakus. Katra lieka krāsa padara maisījumu blāvāku.' }
      : C > 0.03
        ? { en: 'Muted colours are made by mixing in a little of the opposite colour on the colour wheel, not black: the colour stays alive.', ru: 'Приглушённые цвета получают, добавляя немного противоположного по цветовому кругу цвета, а не чёрную: так цвет остаётся живым.', lv: 'Remdenas krāsas iegūst, piejaucot mazliet pretējās krāsas no krāsu apļa, nevis melno: tā krāsa paliek dzīva.' }
        : { en: 'Beautiful greys and near-blacks come from two opposite colours, for example ultramarine and burnt sienna: shift the balance to make the grey warmer or cooler.', ru: 'Красивые серые и почти чёрные получаются из двух противоположных цветов, например ультрамарина и жжёной сиены: сдвигайте пропорцию, чтобы серый стал теплее или холоднее.', lv: 'Skaistas pelēkās un gandrīz melnās sanāk no divām pretējām krāsām, piemēram, ultramarīna un dedzinātās sienas: maini proporciju, lai pelēkā kļūtu siltāka vai vēsāka.' };
    return { words: words.join(', '), theory: theory[L] };
  }

  // подправить: что добавить, чтобы стало светлее / темнее / глуше (считается теми же смесями)
  function tune(r, water, ids) {
    const base = r.items, baseLab = water ? mixLab(base, 0, r.d, true) : mixLab(base, r.white, 1, false), bl = lch(baseLab);
    const tot = base.reduce((a, it) => a + it[1], 0);
    const out = {};
    out.lighter = water ? { hex: mixHex(base, 0, r.d * 0.55, true), txt: t('moreWater') } : { hex: mixHex(base, r.white + Math.max(1, tot), 1, false), txt: t('addMore') + ': ' + t('white') };
    let bestD = null, bestM = null;
    for (const id of ids) {
      if (id === 'black' || P[id].blk) continue;
      const p = P[id], items = base.map(it => [it[0], it[1]]); const ex = items.find(it => it[0] === p);
      if (ex) ex[1] += tot * 0.25; else items.push([p, tot * 0.25]);
      const lab = water ? mixLab(items, 0, r.d, true) : mixLab(items, r.white, 1, false), c = lch(lab);
      // темнее: ближе всего к тому же цвету, только на ступень темнее (тон и яркость сохраняются)
      const darkScore = -dE(lab, [baseLab[0] - 0.1, baseLab[1], baseLab[2]]);
      if (c[0] < bl[0] - 0.02 && (!bestD || darkScore > bestD.s)) bestD = { s: darkScore, id, hex: water ? mixHex(items, 0, r.d, true) : mixHex(items, r.white, 1, false) };
      const muteScore = (bl[1] - c[1]) * 100 - Math.abs(bl[0] - c[0]) * 60;
      if (!ex && bl[1] > 0.04 && (!bestM || muteScore > bestM.s)) bestM = { s: muteScore, id, hex: water ? mixHex(items, 0, r.d, true) : mixHex(items, r.white, 1, false) };
    }
    if (bestD) out.darker = { hex: bestD.hex, txt: t('addLittle') + ': ' + nm(bestD.id) + (ids.includes('black') ? ' (' + t('noBlack') + ')' : '') };
    if (bestM && bestM.s > 1) out.muted = { hex: bestM.hex, txt: t('addLittle') + ': ' + nm(bestM.id) + ' ' + t('compl') };
    return { base: hexOfR(water ? mixR(base, 0, r.d, true) : mixR(base, r.white, 1, false)), ...out };
  }

  function recipeHTML(r, i, water) {
    const e = r.e, acc = T.acc.find(a => e < a[0])[1][L];
    const tot = r.items.reduce((a, it) => a + it[1], 0) + r.white;
    const rows = r.items.map(it => ({ hex: it[0].m, name: nm(it[0].id), ci: it[0].ci, n: it[1], pct: it[1] / tot }));
    if (r.white) rows.push({ hex: WHITE_HEX, name: t('white'), ci: 'PW6', n: r.white, pct: r.white / tot });
    let waterRow = '';
    if (water) {
      const cons = T.cons.find(c => r.d >= c[0])[1][L];
      const paint = r.items.reduce((a, it) => a + it[1], 0), wb = Math.max(0, Math.round(paint * (1 / Math.max(r.d, 0.03) - 1) * 2) / 2);
      waterRow = `<li class="mx-w"><span class="mx-sw mx-sww"></span><span><b>${wb >= 0.5 ? t('waterAbout') + ' ' + amt(wb, true) + ' ' + t('waterOf') : t('waterLittle')}</b><small>${esc(cons)}</small></span></li>`;
    }
    // шаг за шагом: краски добавляются по очереди
    const steps = []; const acc2 = [];
    if (!water && r.white) steps.push(WHITE_HEX); // гуашь и акрил с белилами: начинаем с белил и добавляем цвета
    for (const it of r.items) { acc2.push([it[0], it[1]]); steps.push(water ? mixHex(acc2, 0, r.d, true) : mixHex(acc2, r.white, 1, false)); }
    // общие советы материала — один раз над рецептами (.mx-unit), в карточке — только порядок
    const seq = r.items.map(it => it[0]); const first = water ? seq[0] : (r.white ? null : seq.slice().sort((a, b) => labOfR(b.K.map(k => KMf(k / b.S)))[0] - labOfR(a.K.map(k => KMf(k / a.S)))[0])[0]);
    const howto = first ? t('stMain') + ' ' + esc(nm(first.id)) + (seq.length > 1 ? ', ' + t('stAdd') + ' ' + seq.filter(p => p !== first).map(p => esc(nm(p.id))).join(', ') : '') + '.' : t('stWhiteFirst');
    const strongIds = new Set(r.items.filter(it => it[0].strong).map(it => it[0].id));
    return `<article class="mx-r"><header><b>${t('rec')} ${i + 1}</b><span class="mx-acc">${esc(acc)}</span></header>
      <div class="mx-dots">${rows.map(x => `<span class="mx-dot" style="background:${x.hex}" title="${esc(x.name)}"></span>`).join('<b>+</b>')}${water ? '<b>+</b><span class="mx-dot mx-sww" title="' + t('water') + '"></span>' : ''}</div>
      <ul class="mx-ing">${rows.map(x => `<li><b>${amt(x.n, water)}</b> ${esc(x.name)} <small>${x.ci} · ${Math.round(x.pct * 100)}%</small>${[...strongIds].some(id => nm(id) === x.name) ? `<em>⚡ ${t('strongS')}</em>` : ''}</li>`).join('')}${waterRow}</ul>
      <p class="mx-how">${steps.length > 1 ? `<span class="mx-path">${steps.map(h => sw(h)).join('<span>→</span>')}</span>` : ''}${howto}</p>
      <div class="mx-cmp"><div class="mx-strip" style="--x:50%;background:${target}"><i style="background:${r.hex}"></i><b class="mx-hd"></b><input type="range" min="0" max="100" value="50" aria-label="${t('want')} / ${t('got')}"></div><div class="mx-cl"><span>${t('want')} <code>${target}</code></span><span>${t('got')} <code>${r.hex}</code></span></div></div></article>`;
  }

  // цветовой круг художника (жёлтый — красный — синий): 12 секторов, точка — нужный цвет (ближе к центру — глуше), ◦ — противоположный
  const WHEEL = ['#F7D417', '#F6A91B', '#F07F1F', '#E5502A', '#D3263A', '#B0246C', '#6E3A8E', '#44449A', '#2856A8', '#16848A', '#3A9A4A', '#9CC23A'];
  const WN = [['yellow', 'жёлтый', 'dzeltens'], ['yellow-orange', 'жёлто-оранжевый', 'dzelteni oranžs'], ['orange', 'оранжевый', 'oranžs'], ['red-orange', 'красно-оранжевый', 'sarkani oranžs'], ['red', 'красный', 'sarkans'], ['red-violet', 'красно-фиолетовый', 'sarkani violets'], ['violet', 'фиолетовый', 'violets'], ['blue-violet', 'сине-фиолетовый', 'zili violets'], ['blue', 'синий', 'zils'], ['blue-green', 'сине-зелёный', 'zili zaļš'], ['green', 'зелёный', 'zaļš'], ['yellow-green', 'жёлто-зелёный', 'dzelteni zaļš']];
  const WH = WHEEL.map(h => lch(labOfHex(h))[2]);
  // оттенок OKLCh → положение на круге художника (0…12), по ближайшим секторам
  const wheelPos = h => {
    for (let k = 0; k < 12; k++) {
      const a = WH[k], b = WH[(k + 1) % 12]; let span = (a - b + 360) % 360, dd = (a - h + 360) % 360; // по кругу оттенки убывают Y→R→V→B→G
      if (dd <= span) return k + (span ? dd / span : 0);
    }
    return 0;
  };
  function wheelSVG(tl) {
    const [, C, h] = lch(tl), pos = wheelPos(h), R = 70, cx = 80, cy = 80;
    const pt = (p, r) => { const a = (p / 12) * 2 * Math.PI - Math.PI / 2; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
    let seg = '';
    for (let k = 0; k < 12; k++) {
      const [x1, y1] = pt(k - 0.5, R), [x2, y2] = pt(k + 0.5, R), [x3, y3] = pt(k + 0.5, 34), [x4, y4] = pt(k - 0.5, 34);
      seg += `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}A${R} ${R} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}L${x3.toFixed(1)} ${y3.toFixed(1)}A34 34 0 0 0 ${x4.toFixed(1)} ${y4.toFixed(1)}Z" fill="${WHEEL[k]}"><title>${WN[k][gi]}</title></path>`;
    }
    const rr = C < 0.03 ? 0 : 34 + Math.min(1, C / 0.2) * 36, [mx, my] = rr ? pt(pos, rr) : [cx, cy], [ox, oy] = pt(pos + 6, 52);
    return `<svg class="mx-wheel" viewBox="0 0 160 160" role="img" aria-label="${t('wheel')}">${seg}<circle cx="80" cy="80" r="33" fill="#FFFDF8"/><circle cx="80" cy="80" r="14" fill="#8E8A86"/>` +
      `<circle cx="${ox.toFixed(1)}" cy="${oy.toFixed(1)}" r="8" fill="none" stroke="#fff" stroke-width="3"/><circle cx="${ox.toFixed(1)}" cy="${oy.toFixed(1)}" r="8" fill="none" stroke="#2A2230" stroke-width="1.5" stroke-dasharray="3 2"/>` +
      `<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="11" fill="${target}" stroke="#fff" stroke-width="3"/><circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="12.5" fill="none" stroke="#2A2230" stroke-width="1.5"/></svg>`;
  }
  const RULES = [
    { en: 'Mix two paints that sit next to each other on the wheel to get a clean, bright colour. Violet = ultramarine + a pink-leaning red (quinacridone rose), not orange-leaning red.', ru: 'Для чистого яркого цвета смешивайте две краски, которые на круге рядом. Фиолетовый = ультрамарин + красный с уклоном в розовый (хинакридон), а не в оранжевый.', lv: 'Tīrai spilgtai krāsai jauc divas krāsas, kas aplī ir blakus. Violetā = ultramarīns + sarkanā ar rozā nokrāsu (hinakridons), nevis ar oranžu.' },
    { en: 'Opposite colours on the wheel calm each other down: this is how you get greys, browns and soft muted colours.', ru: 'Противоположные на круге цвета гасят друг друга: так получаются серые, коричневые и мягкие приглушённые цвета.', lv: 'Pretējās krāsas aplī nodzēš viena otru: tā sanāk pelēkās, brūnās un maigas remdenas krāsas.' },
    { en: 'The fewer paints, the cleaner the colour: 2–3 paints at most.', ru: 'Чем меньше красок, тем чище цвет: не больше 2–3.', lv: 'Jo mazāk krāsu, jo tīrāka krāsa: ne vairāk kā 2–3.' },
    { en: 'Add dark to light, a little at a time — never the other way round.', ru: 'Добавляйте тёмное в светлое понемногу — не наоборот.', lv: 'Pievieno tumšo gaišajam pa druskai — ne otrādi.' },
    { en: 'Lighter: water in watercolour, white in gouache and acrylic (white also makes the colour cooler and chalkier).', ru: 'Светлее: в акварели — водой, в гуаши и акриле — белилами (белила ещё делают цвет холоднее и «мелованнее»).', lv: 'Gaišāk: akvarelī — ar ūdeni, guašā un akrilā — ar balto (baltā krāsu arī padara vēsāku un krītaināku).' },
    { en: 'Darker: not with black, but with a dark neighbour or the opposite colour (ultramarine, burnt umber).', ru: 'Темнее: не чёрной, а тёмной соседней или противоположной краской (ультрамарин, умбра).', lv: 'Tumšāk: nevis ar melno, bet ar tumšu blakus vai pretējo krāsu (ultramarīns, umbra).' },
  ];
  // ── раздел «Пигменты — для самых любопытных»: свойства и истории ──
  // tr: прозрачность T/ST/SO/O; st: окрашивает бумагу 0–2; gr: зернится в акварели; ts: сила 1–3; lf: светостойкость (ASTM I лучшая)
  const PINFO = {
    lemon: { tr: 'ST', st: 1, gr: 0, ts: 2, lf: 'I–II', d: ['Arylide (Hansa) yellow, an organic pigment first made in Germany around 1910. A cool, slightly greenish yellow: with blues it gives the cleanest greens.', 'Ариловый (ганза) жёлтый — органический пигмент, впервые получен в Германии около 1910 года. Холодный, чуть зеленоватый жёлтый: с синими даёт самые чистые зелёные.', 'Arilīda (Hansa) dzeltenā — organisks pigments, pirmoreiz iegūts Vācijā ap 1910. gadu. Vēsa, mazliet zaļgana dzeltenā: ar zilajām dod vistīrākās zaļās.'] },
    hansa: { tr: 'ST', st: 1, gr: 0, ts: 2, lf: 'I–II', d: ['A warm, neutral yellow. Mixed with a warm red it makes clean oranges; with blue, warmer olive greens. Cadmium yellow (PY35) is the opaque version with the same role.', 'Тёплый, нейтральный жёлтый. С тёплым красным даёт чистые оранжевые, с синим — более тёплые, оливковые зелёные. Кадмий жёлтый (PY35) — его непрозрачный «двойник».', 'Silta, neitrāla dzeltenā. Ar silto sarkano dod tīras oranžās, ar zilo — siltākas, olīvu zaļās. Kadmija dzeltenā (PY35) ir tās necaurspīdīgais «dvīnis».'] },
    ochre: { tr: 'SO', st: 0, gr: 1, ts: 1, lf: 'I', d: ['Iron oxide earth: one of the oldest pigments, found in cave paintings. Natural (PY43) or synthetic (PY42). Gentle and weak, it softens any colour and is great for skin tones and landscapes.', 'Земля с оксидом железа — один из самых древних пигментов, им рисовали ещё в пещерах. Бывает природной (PY43) и синтетической (PY42). Мягкая и слабая, приглушает любой цвет; хороша для кожи и пейзажей.', 'Zeme ar dzelzs oksīdu — viens no senākajiem pigmentiem, ar to zīmēja jau alās. Dabīgā (PY43) vai sintētiskā (PY42). Maiga un vāja, remdina jebkuru krāsu; laba ādai un ainavām.'] },
    scarlet: { tr: 'SO', st: 1, gr: 0, ts: 2, lf: 'I', d: ['A red leaning towards orange: pyrrole scarlet (PR255) or cadmium red light (PR108). Makes bright oranges, but with blue it gives dull browns, not violets.', 'Красный с уклоном в оранжевый: пирроловый алый (PR255) или кадмий красный светлый (PR108). Даёт яркие оранжевые, а с синим — глухие коричневые, не фиолетовые.', 'Sarkanā ar novirzi uz oranžo: pirola koši sarkanā (PR255) vai kadmija sarkanā gaišā (PR108). Dod spilgtas oranžās, bet ar zilo — blāvas brūnās, nevis violetās.'] },
    pyrrol: { tr: 'SO', st: 1, gr: 0, ts: 2, lf: 'I', d: ['Diketopyrrolopyrrole (DPP) red, developed in the 1980s; the same pigment family gives the famous bright red of sports cars. A strong, clean, middle red.', 'Дикетопирролопиррол (DPP), создан в 1980-х; пигменты этого семейства дают знаменитый ярко-красный цвет спортивных машин. Сильный, чистый, средний красный.', 'Diketopirolopirols (DPP), radīts 1980. gados; šīs saimes pigmenti dod slaveno spilgti sarkano sporta mašīnu krāsu. Spēcīga, tīra, vidēja sarkanā.'] },
    qrose: { tr: 'T', st: 2, gr: 0, ts: 2, lf: 'I', d: ['Quinacridones appeared in the late 1950s. A cool pink-red: with ultramarine it gives clean violets, with yellow — coral and warm reds. Lovely in glazes.', 'Хинакридоны появились в конце 1950-х. Холодный розово-красный: с ультрамарином даёт чистые фиолетовые, с жёлтым — коралловые и тёплые красные. Красив в лессировках.', 'Hinakridoni parādījās 1950. gadu beigās. Vēsa rozīgi sarkanā: ar ultramarīnu dod tīras violetās, ar dzelteno — korāļa un siltas sarkanās. Skaista lesēšanā.'] },
    qmag: { tr: 'T', st: 2, gr: 0, ts: 3, lf: 'I', d: ['Very close to the magenta of printing inks. The best partner for blue when you need bright purples and violets.', 'Очень близок к пурпурной краске для печати. Лучший партнёр синего, когда нужны яркие сиреневые и фиолетовые.', 'Ļoti tuvs drukas purpursarkanajai. Labākais zilās partneris, ja vajag spilgtas ceriņu un violetās krāsas.'] },
    aliz: { tr: 'T', st: 1, gr: 0, ts: 2, lf: 'I (PR177) · III (PR83)', d: ['Alizarin (PR83) was the first natural dye made synthetically, in 1868; before that it came from madder root. It fades in light washes, so “permanent alizarin” (PR177 and others) is used instead. A deep, cool, wine red.', 'Ализарин (PR83) — первый природный краситель, полученный синтетически (1868); раньше его добывали из корня марены. В светлых разбелах выцветает, поэтому чаще берут «стойкий краплак» (PR177 и др.). Глубокий холодный винный красный.', 'Alizarīns (PR83) — pirmā dabīgā krāsviela, iegūta sintētiski (1868); agrāk to ieguva no madaras saknes. Gaišos atšķaidījumos izbalē, tāpēc biežāk ņem «noturīgo krapplaku» (PR177 u. c.). Dziļa, vēsa vīna sarkanā.'] },
    viol: { tr: 'T', st: 2, gr: 0, ts: 3, lf: 'I–II', d: ['One of the strongest pigments: almost black in masstone. A tiny amount darkens and cools a mix; with yellow it gives deep neutral darks.', 'Один из самых сильных пигментов: в массе почти чёрный. Капля затемняет и охлаждает смесь; с жёлтым даёт глубокие нейтральные тёмные.', 'Viens no spēcīgākajiem pigmentiem: masā gandrīz melns. Piliens satumšo un atvēsina maisījumu; ar dzelteno dod dziļus neitrālus tumšos.'] },
    ultra: { tr: 'T', st: 0, gr: 1, ts: 2, lf: 'I', d: ['Once ground from lapis lazuli and worth more than gold; synthetic since 1828. A warm, slightly violet blue that granulates beautifully in watercolour. With burnt sienna it makes the classic greys.', 'Когда-то его растирали из лазурита, и он стоил дороже золота; синтетический — с 1828 года. Тёплый, чуть фиолетовый синий, красиво зернится в акварели. С жжёной сиеной даёт классические серые.', 'Kādreiz to berza no lazurīta, un tas maksāja vairāk nekā zelts; sintētisks — kopš 1828. gada. Silta, mazliet violeta zilā, akvarelī skaisti graudojas. Ar dedzināto sienu dod klasiskās pelēkās.'] },
    phthalo: { tr: 'T', st: 2, gr: 0, ts: 3, lf: 'I', d: ['Phthalocyanine blue, introduced in the 1930s. Extremely strong and staining: one drop tints a whole palette. A cool blue leaning to green, the painter’s version of printing cyan.', 'Фталоцианин синий, появился в 1930-х. Очень сильный и окрашивающий: одна капля окрашивает всю палитру. Холодный синий с уклоном в зелёный — «художественный» вариант голубой печатной краски.', 'Ftalocianīna zilā, parādījās 1930. gados. Ļoti spēcīga un krāsojoša: viens piliens nokrāso visu paleti. Vēsa zilā ar novirzi uz zaļo — mākslinieku variants drukas ciānai.'] },
    cerul: { tr: 'SO', st: 0, gr: 1, ts: 1, lf: 'I', d: ['A cobalt pigment, popular with artists since the 1860s. Weak, opaque and grainy: a soft sky blue for skies and water. Usually costs more than other blues.', 'Кобальтовый пигмент, популярен у художников с 1860-х. Слабый, кроющий и зернистый: мягкий небесно-голубой для неба и воды. Обычно дороже других синих.', 'Kobalta pigments, mākslinieku iecienīts kopš 1860. gadiem. Vājš, sedzošs un graudains: maiga debeszila debesīm un ūdenim. Parasti dārgāks par citām zilajām.'] },
    pgreen: { tr: 'T', st: 2, gr: 0, ts: 3, lf: 'I', d: ['Phthalocyanine green: a cool blue-green, very strong and staining. Almost never used straight: mixed with yellows, ochre or reds it gives natural greens for leaves and grass.', 'Фталоцианин зелёный: холодный сине-зелёный, очень сильный и окрашивающий. Чистым почти не используют: с жёлтыми, охрой или красными даёт естественные зелёные для листьев и травы.', 'Ftalocianīna zaļā: vēsa zili zaļā, ļoti spēcīga un krāsojoša. Tīru gandrīz neizmanto: ar dzeltenajām, okeru vai sarkanajām dod dabiskas zaļās lapām un zālei.'] },
    bsienna: { tr: 'T', st: 1, gr: 1, ts: 2, lf: 'I', d: ['Earth from near Siena in Tuscany, roasted until it turns warm red-brown. The best friend of ultramarine: together they give greys, shadows and darks of any temperature.', 'Земля из окрестностей Сиены в Тоскане, обожжённая до тёплого красно-коричневого. Лучший друг ультрамарина: вместе дают серые, тени и тёмные любой температуры.', 'Zeme no Sjēnas apkārtnes Toskānā, apdedzināta līdz siltai sarkanbrūnai. Ultramarīna labākā draudzene: kopā dod jebkuras temperatūras pelēkās, ēnas un tumšās.'] },
    bumber: { tr: 'SO', st: 1, gr: 1, ts: 2, lf: 'I', d: ['Iron earth with manganese; the name probably comes from Umbria in Italy (or Latin umbra, “shadow”). A deep neutral brown for darks, wood and hair; a softer alternative to black.', 'Железистая земля с марганцем; название, вероятно, от итальянской Умбрии (или латинского umbra — «тень»). Глубокий нейтральный коричневый для тёмных мест, дерева и волос; мягкая замена чёрной.', 'Dzelzs zeme ar mangānu; nosaukums, iespējams, no Umbrijas Itālijā (vai latīņu umbra — «ēna»). Dziļa neitrāla brūnā tumšām vietām, kokam un matiem; maigāka alternatīva melnajai.'] },
    black: { tr: 'O', st: 0, gr: 0, ts: 3, lf: 'I', d: ['Ivory black (PBk9) is made from charred bones and is slightly warm; mars black (PBk11) is iron oxide, denser and more opaque. Black quickly makes colours dull, so use it rarely and in tiny amounts.', 'Слоновая кость (PBk9) — из обожжённых костей, чуть тёплая; марс чёрный (PBk11) — оксид железа, плотнее и кроет сильнее. Чёрная быстро делает цвета глухими — добавляйте редко и по капле.', 'Kaula melnā (PBk9) — no apdedzinātiem kauliem, mazliet silta; marsa melnā (PBk11) — dzelzs oksīds, blīvāka un sedz labāk. Melnā ātri padara krāsas blāvas — pievieno reti un pa pilienam.'] },
    white: { tr: 'O', st: 0, gr: 0, ts: 3, lf: 'I', d: ['Titanium white, made commercially since around 1920: the most opaque white. It lightens, but also makes colours cooler and chalkier; a touch of yellow or red brings warmth back.', 'Титановые белила, производятся примерно с 1920 года — самые кроющие белила. Осветляют, но ещё делают цвет холоднее и «мелованнее»; капля жёлтого или красного возвращает тепло.', 'Titāna baltā, ražo apmēram kopš 1920. gada — vissedzošākā baltā. Gaišina, bet arī padara krāsu vēsāku un krītaināku; piliens dzeltenās vai sarkanās atgriež siltumu.'] },
  };
  const PT = {
    h: { en: 'Pigments: properties and stories, for the most curious', ru: 'Пигменты: свойства и истории для самых любопытных', lv: 'Pigmenti: īpašības un stāsti zinātkārākajiem' },
    p: { en: 'Left half of the swatch — paint straight from the tube, right half — mixed 1:3 with white. These are typical values; a brand may differ.', ru: 'Левая половина образца — краска из тюбика, правая — разбел 1:3 белилами. Значения типичные, у отдельного бренда могут отличаться.', lv: 'Paraugā pa kreisi — krāsa no tūbiņas, pa labi — atšķaidīta 1:3 ar balto. Vērtības tipiskas, atsevišķam zīmolam var atšķirties.' },
    tr: { T: ['transparent', 'прозрачная', 'caurspīdīga'], ST: ['semi-transparent', 'полупрозрачная', 'puscaurspīdīga'], SO: ['semi-opaque', 'полукроющая', 'puspārklājoša'], O: ['opaque', 'кроющая', 'pārklājoša'] },
    st: [['washes off', 'смывается', 'nomazgājas'], ['stains a little', 'немного окрашивает бумагу', 'mazliet nokrāso papīru'], ['stains paper', 'сильно окрашивает бумагу', 'stipri nokrāso papīru']],
    gr: ['granulates in watercolour', 'зернится в акварели', 'akvarelī graudojas'],
    ts: [null, ['weak', 'слабая', 'vāja'], ['medium strength', 'средней силы', 'vidēji spēcīga'], ['very strong', 'очень сильная', 'ļoti spēcīga']],
    lf: ['lightfastness', 'светостойкость', 'gaismas noturība'],
  };
  function pigmentsHTML() {
    const list = PIG.map(p => ({ id: p.id, name: nm(p.id), ci: p.ci, m: p.m, tt: p.t })).concat([{ id: 'white', name: t('white'), ci: 'PW6', m: WHITE_HEX, tt: WHITE_HEX }]);
    return `<div class="mx-step mx-pigs"><h2>${PT.h[L]}</h2><p class="mx-hint">${PT.p[L]}</p><div class="mx-pc">${list.map(x => {
      const f = PINFO[x.id], chips = [PT.tr[f.tr][gi], PT.ts[f.ts][gi], PT.st[f.st][gi], f.gr ? PT.gr[gi] : null, PT.lf[gi] + ' ' + f.lf].filter(Boolean);
      return `<article><i style="background:linear-gradient(90deg,${x.m} 50%,${x.tt} 50%)"></i><h3>${esc(x.name)} <small>${x.ci}</small></h3><p class="mx-chp">${chips.map(c => `<span>${esc(c)}</span>`).join('')}</p><p>${esc(f.d[gi])}</p></article>`;
    }).join('')}</div></div>`;
  }

  let job = 0;
  function run() {
    const my = job = job + 1;
    const ids = myPaints(medium), water = !!MEDIA[medium].water;
    $('.mx-tsw').style.background = target;
    if (!ids.length) { $('.mx-out').innerHTML = `<p class="mx-hint">${t('none')}</p>`; return; }
    $('.mx-out').innerHTML = `<p class="mx-hint mx-wait">${t('wait')}</p>`;
    try { history.replaceState(null, '', location.pathname + '?m=' + medium + '&c=' + target.slice(1)); } catch (e) { /* file:// */ }
    setTimeout(() => {
      if (my !== job) return;
      const res = solve(target, ids, water);
      if (my !== job || !res.recipes.length) return;
      const best = res.recipes[0], d = describe(res.tLab);
      let gam = '';
      if (best.e > 5) {
        const all = solve(target, allIds(medium), water).recipes[0];
        const extra = all && all.e < best.e - 2 && all.items.map(it => it[0].id).filter(id => !ids.includes(id));
        if (extra && extra.length) gam = `<p class="mx-gam">💡 ${t('gamut')} <b>${extra.map(id => esc(nm(id)) + ' (' + P[id].ci + ')').join(', ')}</b> ${sw(all.hex)}</p>`;
        else if (best.e > 8) gam = `<p class="mx-gam">💡 ${t('screen')}</p>`;
      }
      const tu = tune(best, water, ids);
      const tRow = (k, x) => x ? `<li>${sw(tu.base)}<span>→</span>${sw(x.hex)}<span><b>${t(k)}:</b> ${esc(x.txt)}</span></li>` : '';
      $('.mx-out').innerHTML = `<article class="mx-r mx-th"><div class="mx-thw">${wheelSVG(res.tLab)}<p class="mx-wl"><span><i class="mx-k1"></i>${t('wYou')}</span><span><i class="mx-k2"></i>${t('wOpp')}</span></p></div><div class="mx-tht">
        <header><b>${t('about')}</b></header><p class="mx-desc">${sw(target)} <b>${esc(d.words)}</b></p><p>${esc(d.theory)}</p>
        <p class="mx-sub">${t('tune')}</p><ul class="mx-tune">${tRow('lighter', tu.lighter)}${tRow('darker', tu.darker)}${tRow('muted', tu.muted)}</ul>
        <details class="mx-rules"><summary>📐 ${t('rules')}</summary><ol>${RULES.map(x => `<li>${esc(x[L])}</li>`).join('')}</ol></details></div></article>` +
        gam + res.recipes.map((r, i) => recipeHTML(r, i, water)).join('');
    }, 30);
  }
  function setTarget(h, from) {
    h = '#' + h.replace('#', '').toUpperCase();
    if (!/^#[0-9A-F]{6}$/.test(h)) return;
    target = h;
    if (from !== 'pick') $('input[type=color]').value = h.toLowerCase();
    if (from !== 'hex') $('.mx-hex').value = h;
    run();
  }

  app.addEventListener('click', e => {
    const m = e.target.closest('[data-m]');
    if (m) { medium = m.dataset.m; ls.set('pp-mix-m', medium); renderMedia(); run(); if (app.querySelector('.mx-tubes')) { renderShelf(); renderPuddle(false); } return; }
    const c = e.target.closest('[data-c]');
    if (c) { setTarget(c.dataset.c); $('.mx-out').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (e.target.closest('.mx-all')) { ls.set(pkey(medium), allIds(medium).join(',')); renderMedia(); run(); return; }
    if (e.target.closest('.mx-nonebtn')) { ls.set(pkey(medium), '-'); renderMedia(); run(); return; }
    if (e.target.closest('.mx-reset')) { ls.set(pkey(medium), ''); renderMedia(); run(); return; }
    if (e.target.closest('.mx-more')) palChips();
  });
  app.addEventListener('change', e => {
    if (e.target.matches('.mx-brand')) {
      ls.set('pp-mix-b-' + medium, e.target.value);
      loadBrands().then(() => { renderMedia(); run(); if (app.querySelector('.mx-tubes')) { renderShelf(); renderPuddle(false); } });
      return;
    }
    if (e.target.matches('.mx-pg input')) { const v = [...app.querySelectorAll('.mx-pg input:checked:not(:disabled)')].map(x => x.value); ls.set(pkey(medium), v.join(',') || '-'); $('.mx-cnt').textContent = '(' + v.length + ')'; run(); }
    if (e.target.matches('input[type=color]')) setTarget(e.target.value, 'pick');
    if (e.target.matches('.mx-ph input')) photo(e.target.files[0]);
  });
  // поиск краски в длинной серии
  app.addEventListener('input', e => { if (e.target.matches('.mx-pfind')) { const q = e.target.value.trim().toLowerCase(); app.querySelectorAll('.mx-pg .mx-p').forEach(l => { l.hidden = q && !l.textContent.toLowerCase().includes(q); }); } });
  // ползунок сравнения «нужен | получится»: тянем границу
  app.addEventListener('input', e => { if (e.target.matches('.mx-strip input')) e.target.parentNode.style.setProperty('--x', e.target.value + '%'); });
  let pickT = 0;
  $('input[type=color]').addEventListener('input', e => { clearTimeout(pickT); const v = e.target.value; $('.mx-tsw').style.background = v; pickT = setTimeout(() => setTarget(v, 'pick'), 350); });
  $('.mx-hex').addEventListener('input', e => { const v = e.target.value.trim(); if (/^#?[0-9a-f]{6}$/i.test(v)) setTarget(v, 'hex'); });

  // цвет из своего фото: всё в браузере, на сервер ничего не уходит
  function photo(f) {
    if (!f) return;
    const img = new Image(), url = URL.createObjectURL(f);
    img.onload = () => {
      const cv = $('.mx-photo canvas'), k = Math.min(1, 900 / Math.max(img.width, img.height));
      cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height); URL.revokeObjectURL(url);
      $('.mx-photo').hidden = false;
    };
    img.src = url;
  }
  $('.mx-photo canvas').addEventListener('click', e => {
    const cv = e.currentTarget, r = cv.getBoundingClientRect(), x = Math.round((e.clientX - r.left) * cv.width / r.width), y = Math.round((e.clientY - r.top) * cv.height / r.height);
    const d = cv.getContext('2d').getImageData(Math.max(0, x - 2), Math.max(0, y - 2), 5, 5).data; let R = 0, G = 0, B = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) { R += d[i]; G += d[i + 1]; B += d[i + 2]; n++; }
    setTarget([R, G, B].map(v => Math.round(v / n).toString(16).padStart(2, '0')).join(''));
  });

  // цвета из картин Алины (те же данные, что на /palettes/)
  let pals = null;
  function palChips() {
    if (!pals) return;
    const p = pals[Math.floor(Math.random() * pals.length)];
    $('.mx-chips').innerHTML = p.colors.map(c => `<button type="button" class="mx-chip" data-c="${c.hex}" style="background:${c.hex};color:${ink(c.hex)}" title="${esc(c[L] || c.en)}">${esc(c[L] || c.en)}</button>`).join('') +
      `<a class="mx-from" href="${L === 'en' ? '' : '/' + L}/palettes/#${encodeURIComponent(p.key)}">${esc((p.title && (p.title[L] || p.title.en)) || '')} →</a>`;
  }
  fetch('/assets/palettes.json').then(r => r.ok ? r.json() : []).then(x => { pals = (x || []).filter(p => p.colors && p.colors.length); if (pals.length) palChips(); else $('.mx-pal').hidden = true; }).catch(() => { $('.mx-pal').hidden = true; });


  // ═══ вкладка «Смешать самому»: капаем краски в лужицу и смотрим, что выйдет ═══
  const PL = {
    tab1: { en: '🎯 Find a mix', ru: '🎯 Подобрать смесь', lv: '🎯 Atrast maisījumu' },
    tab2: { en: '🧪 Mix it yourself', ru: '🧪 Смешать самому', lv: '🧪 Sajaukt pašam' },
    tab3: { en: '🔬 Pigments', ru: '🔬 Пигменты', lv: '🔬 Pigmenti' },
    h: { en: 'Drop paints into the puddle', ru: 'Капайте краски в лужицу', lv: 'Pilini krāsas peļķītē' },
    p: { en: 'Tap a paint to add a portion and watch what colour you get. Paints mix like real pigments, not like light on a screen.', ru: 'Нажмите на краску, чтобы добавить порцию, и смотрите, какой цвет получится. Краски смешиваются как настоящие пигменты, а не как свет на экране.', lv: 'Pieskaries krāsai, lai pievienotu porciju, un skaties, kāda krāsa sanāk. Krāsas jaucas kā īsti pigmenti, nevis kā gaisma ekrānā.' },
    portion: { en: 'Portion:', ru: 'Порция:', lv: 'Porcija:' },
    water: { en: 'Water', ru: 'Вода', lv: 'Ūdens' },
    empty: { en: 'The puddle is empty. Add a paint!', ru: 'Лужица пустая. Добавьте краску!', lv: 'Peļķīte ir tukša. Pievieno krāsu!' },
    near: { en: 'looks like', ru: 'похоже на', lv: 'līdzīgi' },
    path: { en: 'How the colour changed', ru: 'Как менялся цвет', lv: 'Kā mainījās krāsa' },
    reset: { en: '↺ Start over', ru: '↺ Начать заново', lv: '↺ Sākt no jauna' },
    rand: { en: '🎲 Surprise me', ru: '🎲 Удиви меня', lv: '🎲 Pārsteidz mani' },
    save: { en: '📌 Keep this colour', ru: '📌 Сохранить цвет', lv: '📌 Saglabāt krāsu' },
    find: { en: '🎯 How to mix it exactly', ru: '🎯 Как смешать его точно', lv: '🎯 Kā to sajaukt precīzi' },
    saved: { en: 'My colours (tap to bring back the mix)', ru: 'Мои цвета (нажмите, чтобы вернуть смесь)', lv: 'Manas krāsas (pieskaries, lai atgrieztu maisījumu)' },
    copy: { en: 'Copied', ru: 'Скопировано', lv: 'Nokopēts' },
  };
  const pl = (k) => PL[k][L];
  let play = { items: {}, white: 0, d: 0.4 }, portion = 1, plPath = [], plPrev = null;
  let NAMES = null;
  fetch('/assets/palette-names.json').then(r => r.ok ? r.json() : null).then(x => { NAMES = (x || []).map(n => ({ n, lab: labOfHex(n[3]) })); renderPuddle(false); }).catch(() => {});
  const plItems = () => Object.keys(play.items).filter(id => play.items[id] > 0 && P[id]).map(id => [P[id], play.items[id]]);
  const plHex = () => {
    const it = plItems(), water = !!MEDIA[medium].water;
    if (!it.length) return water ? '#FBFAF6' : (play.white ? WHITE_HEX : null);
    return water ? mixHex(it, 0, play.d, true) : mixHex(it, play.white, 1, false);
  };
  const portions = [0.25, 0.5, 1];
  function playHTML() {
    return `<div class="mx-play"><div class="mx-step mx-shelf"><h2>${pl('h')}</h2><p class="mx-hint">${pl('p')}</p>
      <div class="mx-media mx-pm">${Object.keys(MEDIA).map(m => `<button type="button" role="tab" data-m="${m}">${t(m)}</button>`).join('')}</div>
      <label class="mx-brw">🎨 ${t('brand')} <select class="mx-brand"></select></label>
      <p class="mx-por">${pl('portion')} ${portions.map(v => `<button type="button" data-por="${v}">${v === 1 ? '1' : v === 0.5 ? '½' : '¼'}</button>`).join('')}<span class="mx-hint"></span></p>
      <div class="mx-tubes"></div>
      <label class="mx-wat" hidden><span>💧 ${pl('water')}: <b></b></span><input type="range" min="0" max="100" value="40"></label></div>
      <div class="mx-pud"><div class="mx-step mx-pudt"><div class="mx-bowl"><div class="mx-blob"></div><div class="mx-swirl"></div><div class="mx-drops"></div></div>
      <p class="mx-res"><button type="button" class="mx-reshex" title="HEX"></button><span class="mx-rname"></span></p><p class="mx-rdesc"></p></div>
      <div class="mx-step mx-pudr"><div class="mx-ppath" hidden><p class="mx-sub">${pl('path')}</p><div class="mx-trail"></div></div>
      <ul class="mx-plist"></ul>
      <div class="mx-pbtn"><button type="button" class="mx-btn mx-pl-rand">${pl('rand')}</button><button type="button" class="mx-btn mx-pl-save">${pl('save')}</button><button type="button" class="mx-btn mx-pl-find">${pl('find')}</button><button type="button" class="mx-lnk mx-pl-reset">${pl('reset')}</button></div>
      <div class="mx-psaved" hidden><p class="mx-sub">${pl('saved')}</p><div></div></div></div></div></div>`;
  }
  function renderShelf() {
    const water = !!MEDIA[medium].water, box = app.querySelector('.mx-tubes'); if (!box) return;
    const mine = myPaints(medium), shelf = lineOf(medium) && mine.length ? mine : allIds(medium);
    box.innerHTML = shelf.map(id => `<button type="button" class="mx-tube" data-add="${id}" title="${esc(nm(id))} · ${P[id].ci}"><i style="--c:${P[id].m};--t:${P[id].t}"></i><span>${esc(nm(id).replace(/ \(.*\)$/, ''))}</span></button>`).join('') +
      (water ? '' : `<button type="button" class="mx-tube" data-add="white" title="${t('white')} · PW6"><i style="--c:${WHITE_HEX};--t:#FFFFFF"></i><span>${t('white')}</span></button>`);
    app.querySelector('.mx-wat').hidden = !water;
    app.querySelectorAll('[data-por]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.por === portion)));
    app.querySelector('.mx-por .mx-hint').textContent = ' ' + (water ? t('unitBrush') : t('unitPea')).split('.')[0] + '.';
    setWater();
  }
  function setWater() {
    const w = app.querySelector('.mx-wat'); if (!w) return;
    w.querySelector('input').value = String(Math.round(100 - play.d * 100));
    w.querySelector('b').textContent = T.cons.find(c => play.d >= c[0])[1][L];
  }
  function renderPuddle(drop, dropColor) {
    const bowl = app.querySelector('.mx-bowl'); if (!bowl) return;
    const hex = plHex(), it = plItems(), water = !!MEDIA[medium].water;
    const blob = bowl.querySelector('.mx-blob');
    blob.style.background = hex || 'transparent'; blob.classList.toggle('on', !!hex);
    // эффект: падает капля, по лужице идёт круг, цвета закручиваются и сливаются
    if (drop && dropColor) {
      const d = document.createElement('i'); d.className = 'mx-drop'; d.style.background = dropColor; d.style.left = (40 + Math.random() * 20) + '%';
      bowl.querySelector('.mx-drops').appendChild(d); setTimeout(() => d.remove(), 1400);
      const sw = bowl.querySelector('.mx-swirl'), cols = [plPrev || dropColor, dropColor, plPrev || dropColor, dropColor, hex || dropColor];
      sw.style.background = `conic-gradient(from ${Math.round(Math.random() * 360)}deg, ${cols.join(',')}, ${cols[0]})`;
      sw.classList.remove('go'); void sw.offsetWidth; sw.classList.add('go');
      bowl.classList.remove('rip'); void bowl.offsetWidth; bowl.classList.add('rip');
    }
    plPrev = hex;
    const rh = app.querySelector('.mx-reshex'); rh.textContent = hex && it.length ? hex : ''; rh.style.display = hex && it.length ? '' : 'none';
    let name = '';
    if (hex && it.length && NAMES) { const lab = labOfHex(hex); let b = null; for (const x of NAMES) { const e = dE(lab, x.lab); if (!b || e < b.e) b = { e, x }; } name = pl('near') + ' «' + b.x.n[gi] + '»'; }
    app.querySelector('.mx-rname').textContent = it.length ? name : pl('empty');
    app.querySelector('.mx-rdesc').textContent = hex && it.length ? describe(labOfHex(hex)).words : '';
    const tot = it.reduce((a, x) => a + x[1], 0) + (water ? 0 : play.white);
    const rows = it.map(([p, n]) => ({ id: p.id, hex: p.m, name: nm(p.id), n }));
    if (!water && play.white) rows.push({ id: 'white', hex: WHITE_HEX, name: t('white'), n: play.white });
    app.querySelector('.mx-plist').innerHTML = rows.map(r => `<li><span class="mx-sw" style="background:${r.hex}"></span><span class="mx-pn"><b>${amt(r.n, water)}</b> ${esc(r.name)} <small>${Math.round(r.n / tot * 100)}%</small></span><button type="button" data-dec="${r.id}" aria-label="−">−</button><button type="button" data-add="${r.id}" aria-label="+">+</button><button type="button" data-del="${r.id}" aria-label="✕">✕</button></li>`).join('');
    const pp = app.querySelector('.mx-ppath'); pp.hidden = plPath.length < 2;
    app.querySelector('.mx-trail').style.background = plPath.length > 1 ? `linear-gradient(90deg, ${plPath.map((h, i) => h + ' ' + Math.round(i / (plPath.length - 1) * 100) + '%').join(',')})` : '';
    app.querySelector('.mx-pl-find').disabled = app.querySelector('.mx-pl-save').disabled = !(hex && it.length);
    renderSaved();
  }
  const savedGet = () => { try { return JSON.parse(ls.get('pp-mix-saved') || '[]'); } catch (e) { return []; } };
  function renderSaved() {
    const s = savedGet(), box = app.querySelector('.mx-psaved'); if (!box) return;
    box.hidden = !s.length;
    box.querySelector('div').innerHTML = s.map((x, i) => `<button type="button" class="mx-sv" data-saved="${i}" style="background:${x.hex}" title="${x.hex} · ${esc(t(x.m))}"></button>`).join('');
  }
  function addPaint(id, k) {
    if (id === 'white') play.white = Math.max(0, play.white + k);
    else play.items[id] = Math.max(0, (play.items[id] || 0) + k);
    if (play.items[id] === 0) delete play.items[id];
    const hex = plHex(); if (hex && k > 0) { plPath.push(hex); if (plPath.length > 24) plPath.shift(); }
    renderPuddle(k > 0, id === 'white' ? WHITE_HEX : P[id] && P[id].m);
  }
  function plReset() { play = { items: {}, white: 0, d: play.d }; plPath = []; plPrev = null; renderPuddle(false); }
  function plRandom() {
    plReset();
    const ids = allIds(medium).filter(id => id !== 'black' && !P[id].blk), n = 2 + Math.floor(Math.random() * 2), pick = [];
    while (pick.length < n) { const id = ids[Math.floor(Math.random() * ids.length)]; if (!pick.includes(id)) pick.push(id); }
    pick.forEach((id, i) => setTimeout(() => addPaint(id, [0.5, 1, 1, 2][Math.floor(Math.random() * 4)]), i * 450));
    if (!MEDIA[medium].water && Math.random() < 0.6) setTimeout(() => addPaint('white', 1 + Math.floor(Math.random() * 4)), n * 450);
  }
  function setTab(tab) {
    app.querySelectorAll('[data-tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === tab)));
    app.querySelectorAll('.mx-pane').forEach(p => { p.hidden = p.dataset.pane !== tab; });
    ls.set('pp-mix-tab', tab);
    if (tab === 'play') { renderShelf(); renderPuddle(false); }
  }
  app.addEventListener('click', e => {
    const tb = e.target.closest('[data-tab]'); if (tb) { setTab(tb.dataset.tab); return; }
    const a = e.target.closest('[data-add]'); if (a) { addPaint(a.dataset.add, a.closest('.mx-plist') ? (a.dataset.add === 'white' ? 1 : portion) : portion); return; }
    const dc = e.target.closest('[data-dec]'); if (dc) { addPaint(dc.dataset.dec, -portion); return; }
    const dl = e.target.closest('[data-del]'); if (dl) { if (dl.dataset.del === 'white') play.white = 0; else delete play.items[dl.dataset.del]; renderPuddle(false); return; }
    const po = e.target.closest('[data-por]'); if (po) { portion = +po.dataset.por; renderShelf(); return; }
    if (e.target.closest('.mx-pl-reset')) { plReset(); return; }
    if (e.target.closest('.mx-pl-rand')) { plRandom(); return; }
    if (e.target.closest('.mx-reshex')) { const h = plHex(); (navigator.clipboard ? navigator.clipboard.writeText(h) : Promise.reject()).then(() => window.PPToast && window.PPToast(pl('copy') + ': ' + h)).catch(() => {}); return; }
    if (e.target.closest('.mx-pl-save')) { const h = plHex(); if (!h) return; const s = savedGet().filter(x => x.hex !== h); s.unshift({ hex: h, m: medium, items: play.items, white: play.white, d: play.d }); ls.set('pp-mix-saved', JSON.stringify(s.slice(0, 16))); renderSaved(); return; }
    const sv = e.target.closest('[data-saved]'); if (sv) { const x = savedGet()[+sv.dataset.saved]; if (!x) return; medium = MEDIA[x.m] ? x.m : medium; ls.set('pp-mix-m', medium); play = { items: Object.assign({}, x.items), white: x.white || 0, d: x.d || 0.4 }; plPath = [x.hex]; plPrev = null; renderMedia(); renderShelf(); renderPuddle(true, x.hex); run(); return; }
    if (e.target.closest('.mx-pl-find')) { const h = plHex(); if (!h) return; setTab('find'); setTarget(h); app.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
  app.addEventListener('input', e => { if (e.target.matches('.mx-wat input')) { play.d = Math.max(0.03, 1 - e.target.value / 100); setWater(); renderPuddle(false); } });

  // ── синхронизация с профилем ──
  function who() { return window.PPWho && window.PPWho.user; }
  var syncT = 0, pulled = false; // var: ls.set может позвать syncSoon раньше этой строки
  function collect() {
    const d = { b: {}, p: {}, s: savedGet() };
    for (const m of Object.keys(MEDIA)) d.b[m] = ls.get('pp-mix-b-' + m) || '';
    try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/^pp-mix-p-/.test(k)) d.p[k.slice(9)] = localStorage.getItem(k) || ''; } } catch (e) { /* */ }
    return d;
  }
  function push(beacon) {
    if (!who() || !pulled) return;
    clearTimeout(syncT); syncT = 0;
    const body = JSON.stringify({ data: collect(), t: +ls.get('pp-mix-t') || Date.now() });
    if (beacon && navigator.sendBeacon) navigator.sendBeacon('/api/mixing', body);
    else fetch('/api/mixing', { method: 'POST', credentials: 'same-origin', body }).catch(() => {});
  }
  function syncSoon() { if (who() && pulled) { clearTimeout(syncT); syncT = setTimeout(push, 800); } }
  function applyPrefs(d, t) {
    applying = true;
    try {
      const drop = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/^pp-mix-p-/.test(k)) drop.push(k); }
      drop.forEach(k => localStorage.removeItem(k));
    } catch (e) { /* */ }
    for (const m of Object.keys(MEDIA)) ls.set('pp-mix-b-' + m, (d.b && d.b[m]) || '');
    for (const [k, v] of Object.entries(d.p || {})) ls.set('pp-mix-p-' + k, v);
    ls.set('pp-mix-saved', JSON.stringify(d.s || []));
    ls.set('pp-mix-t', String(t));
    applying = false;
    loadBrands().then(() => { renderMedia(); run(); if (app.querySelector('.mx-tubes')) { renderShelf(); renderPuddle(false); } });
  }
  function cloudNote() {
    const el = app.querySelector('.mx-cloud'); if (!el) return;
    el.innerHTML = who() ? esc(t('cloudIn')) : esc(t('cloudOut')) + (window.PPAccount && window.PPAccount.openSignIn ? ` <button type="button" class="mx-lnk mx-signin">${t('signIn')}</button>` : '');
  }
  function pull() {
    cloudNote();
    if (!who() || pulled) return;
    fetch('/api/mixing', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).then(x => {
      if (!x) return;
      pulled = true;
      const localT = +ls.get('pp-mix-t') || 0;
      if (x.data && x.t >= localT) applyPrefs(x.data, x.t); // в профиле новее — берём его
      else if (localT > (x.t || 0)) push(); // отмечено до входа или на этом устройстве позже — переносим в профиль
    }).catch(() => {});
  }
  if (window.PPWho) pull(); else cloudNote();
  document.addEventListener('pp:whoami', pull);
  window.addEventListener('pagehide', () => { if (syncT) push(true); });
  app.addEventListener('click', e => { if (e.target.closest('.mx-signin') && window.PPAccount) window.PPAccount.openSignIn(); });

  app.querySelector('[data-pane="pigs"]').innerHTML = pigmentsHTML();
  app.querySelector('[data-pane="play"]').innerHTML = playHTML();
  [['find', 'tab1'], ['play', 'tab2'], ['pigs', 'tab3']].forEach(([k, v]) => { app.querySelector(`[data-tab="${k}"]`).textContent = pl(v); });
  renderMedia();
  run();
  // список брендов — в выпадающем списке; если выбран бренд, пересчитать уже с его красками
  loadBrands().then(() => { const had = Object.keys(MEDIA).some(m => brandOf(m)); renderMedia(); if (had) { run(); if (app.querySelector('.mx-tubes') && !app.querySelector('[data-pane="play"]').hidden) { renderShelf(); renderPuddle(false); } } });
  setTab(['find', 'play', 'pigs'].includes(qs.get('tab')) ? qs.get('tab') : (['find', 'play', 'pigs'].includes(ls.get('pp-mix-tab')) ? ls.get('pp-mix-tab') : 'find'));
})();
