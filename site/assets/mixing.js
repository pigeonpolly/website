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
  for (const p of PIG) {
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
    P[p.id] = Object.assign({}, p, { S, K, A, ts });
  }

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
  const penalty = r => 1.6 * (r.items.length - 1) + (r.items.some(it => it[0].id === 'black') ? 1 : 0);

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
  function solve(hex, ids, water) {
    const tLab = labOfHex(hex), pig = ids.map(id => P[id]).filter(Boolean);
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

  if (!HAS_DOM) { module.exports = { P, PIG, MEDIA, solve, mixHex, labOfHex, dE, lch }; return; }

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
  const ls = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* приватный режим */ } } };
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
  const myPaints = m => { const s = ls.get('pp-mix-p-' + m); if (s === '-') return []; const v = s ? s.split(',').filter(id => MEDIA[m].all.includes(id)) : null; return v && v.length ? v : MEDIA[m].on.slice(); };

  app.innerHTML = `
    <div class="mx-left"><div class="mx-step"><h2>${t('m1')}</h2><div class="mx-media" role="tablist">${Object.keys(MEDIA).map(m => `<button type="button" role="tab" data-m="${m}">${t(m)}</button>`).join('')}</div>
      <details class="mx-mine"><summary>🎨 ${t('mine')} <span class="mx-cnt"></span></summary><p class="mx-hint">${t('mineTip')}</p><div class="mx-pg"></div><div class="mx-acts"><button type="button" class="mx-all mx-lnk">${t('all')}</button><button type="button" class="mx-nonebtn mx-lnk">${t('clear')}</button><button type="button" class="mx-reset mx-lnk">${t('reset')}</button></div></details></div>
    <div class="mx-step"><h2>${t('m2')}</h2>
      <div class="mx-pickrow"><label class="mx-color"><input type="color" value="${target}" aria-label="${t('pick')}"><span class="mx-tsw"></span></label>
        <input class="mx-hex" type="text" maxlength="7" spellcheck="false" aria-label="HEX" value="${target}">
        <label class="mx-btn mx-ph">${t('photo')}<input type="file" accept="image/*" hidden></label></div>
      <div class="mx-photo" hidden><p class="mx-hint">${t('photoTip')}</p><canvas></canvas></div>
      <div class="mx-pal"><p class="mx-hint">${t('fromPal')}</p><div class="mx-chips"></div><button type="button" class="mx-lnk mx-more">${t('another')}</button></div></div>
    </div><div class="mx-step mx-right"><h2>${t('m3')}</h2><p class="mx-unit"></p><div class="mx-out"></div>
      <p class="mx-note">⚠️ ${t('note')}</p></div>`;
  const $ = s => app.querySelector(s);

  function renderMedia() {
    app.querySelectorAll('[data-m]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.m === medium)));
    const on = myPaints(medium);
    $('.mx-pg').innerHTML = MEDIA[medium].all.map(id => `<label class="mx-p"><input type="checkbox" value="${id}"${on.includes(id) ? ' checked' : ''}><i style="background:linear-gradient(90deg,${P[id].m} 50%,${P[id].t} 50%)"></i><span>${esc(nm(id))}<small>${P[id].ci}</small></span></label>`).join('') +
      (MEDIA[medium].water ? '' : `<label class="mx-p"><input type="checkbox" checked disabled><i style="background:${WHITE_HEX}"></i><span>${t('white')}<small>PW6</small></span></label>`);
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
      if (id === 'black') continue;
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
    const bar = rows.map(x => `<i style="flex:${x.pct};background:${x.hex}" title="${Math.round(x.pct * 100)}%"></i>`).join('');
    // шаг за шагом: краски добавляются по очереди
    const steps = []; const acc2 = [];
    const order = water ? r.items.slice() : r.items.slice();
    for (const it of order) { acc2.push([it[0], it[1]]); steps.push(water ? mixHex(acc2, 0, r.d, true) : mixHex(acc2, r.white * (acc2.length === order.length ? 1 : 0), 1, false)); }
    if (!water && r.white) { steps.pop(); steps.push(mixHex(acc2, 0, 1, false)); steps.push(r.hex); }
    const strong = r.items.filter(it => it[0].strong).map(it => `<li>${esc(nm(it[0].id))} ${t('strong')}</li>`).join('');
    // общие советы материала — один раз над рецептами (.mx-unit), в карточке — только порядок и сильные краски
    const seq = r.items.map(it => it[0]); const first = water ? seq[0] : (r.white ? null : seq.slice().sort((a, b) => labOfR(b.K.map((k, i) => KMf(k / b.S)))[0] - labOfR(a.K.map((k, i) => KMf(k / a.S)))[0])[0]);
    const howto = `<li>${first ? t('stMain') + ' ' + esc(nm(first.id)) + (seq.length > 1 ? ', ' + t('stAdd') + ' ' + seq.filter(p => p !== first).map(p => esc(nm(p.id))).join(', ') : '') + '.' : t('stWhiteFirst')}</li>`;
    return `<article class="mx-r"><header><b>${t('rec')} ${i + 1}</b>${i === 0 && r.items.length === 1 ? '' : ''}<span class="mx-acc">${esc(acc)}</span></header>
      <div class="mx-dots">${rows.map(x => `<span class="mx-dot" style="background:${x.hex}" title="${esc(x.name)}"></span>`).join('<b>+</b>')}${water ? '<b>+</b><span class="mx-dot mx-sww" title="' + t('water') + '"></span>' : ''}</div>
      <ul class="mx-ing">${rows.map(x => `<li>${sw(x.hex)}<span><b>${amt(x.n, water)}</b> — ${esc(x.name)} <small>${x.ci} · ${Math.round(x.pct * 100)}%</small></span></li>`).join('')}${waterRow}</ul>
      <div class="mx-bar">${bar}</div>
      ${steps.length > 1 ? `<p class="mx-sub">${t('path')}</p><div class="mx-path">${steps.map(h => sw(h)).join('<span>→</span>')}</div>` : ''}
      <p class="mx-sub">${t('steps')}</p><ul class="mx-how">${howto}${strong}</ul>
      <div class="mx-cmp"><div class="mx-strip"><i style="background:${target}"></i><i style="background:${r.hex}"></i></div><div class="mx-cl"><span>${t('want')} <code>${target}</code></span><span>${t('got')} <code>${r.hex}</code></span></div></div></article>`;
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
        const all = solve(target, MEDIA[medium].all, water).recipes[0];
        const extra = all && all.e < best.e - 2 && all.items.map(it => it[0].id).filter(id => !ids.includes(id));
        if (extra && extra.length) gam = `<p class="mx-gam">💡 ${t('gamut')} <b>${extra.map(id => esc(nm(id)) + ' (' + P[id].ci + ')').join(', ')}</b> ${sw(all.hex)}</p>`;
        else if (best.e > 8) gam = `<p class="mx-gam">💡 ${t('screen')}</p>`;
      }
      const tu = tune(best, water, ids);
      const tRow = (k, x) => x ? `<li>${sw(tu.base)}<span>→</span>${sw(x.hex)}<span><b>${t(k)}:</b> ${esc(x.txt)}</span></li>` : '';
      $('.mx-out').innerHTML = gam + res.recipes.map((r, i) => recipeHTML(r, i, water)).join('') +
        `<article class="mx-r mx-th"><header><b>${t('about')}</b></header><p class="mx-desc">${sw(target)} <b>${esc(d.words)}</b></p><p>${esc(d.theory)}</p>
        <p class="mx-sub">${t('tune')}</p><ul class="mx-tune">${tRow('lighter', tu.lighter)}${tRow('darker', tu.darker)}${tRow('muted', tu.muted)}</ul></article>`;
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
    if (m) { medium = m.dataset.m; ls.set('pp-mix-m', medium); renderMedia(); run(); return; }
    const c = e.target.closest('[data-c]');
    if (c) { setTarget(c.dataset.c); $('.mx-out').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (e.target.closest('.mx-all')) { ls.set('pp-mix-p-' + medium, MEDIA[medium].all.join(',')); renderMedia(); run(); return; }
    if (e.target.closest('.mx-nonebtn')) { ls.set('pp-mix-p-' + medium, '-'); renderMedia(); run(); return; }
    if (e.target.closest('.mx-reset')) { ls.set('pp-mix-p-' + medium, ''); renderMedia(); run(); return; }
    if (e.target.closest('.mx-more')) palChips();
  });
  app.addEventListener('change', e => {
    if (e.target.matches('.mx-pg input')) { const v = [...app.querySelectorAll('.mx-pg input:checked:not(:disabled)')].map(x => x.value); ls.set('pp-mix-p-' + medium, v.join(',') || '-'); $('.mx-cnt').textContent = '(' + v.length + ')'; run(); }
    if (e.target.matches('input[type=color]')) setTarget(e.target.value, 'pick');
    if (e.target.matches('.mx-ph input')) photo(e.target.files[0]);
  });
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

  renderMedia();
  run();
})();
