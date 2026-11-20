// Книга рецептов на кухне птички (этап 89, docs/bird.md «Кухня: книга рецептов»): window.PPCookbook.open().
// Открывает room.js кнопкой 📖 в своей кухне. Блюда — из урожая огорода; готовка — снять сковородку с огня, пока полоска в зелёном.
// Сервер — worker/kitchen.js (RECIPES, время готовки считает сервер). Иконки растений — window.PPGardenPlants (site/assets/garden.js, грузится сам).
(function () {
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0;
  const pre = ['', '/ru', '/lv'][L];
  const T = {
    title: ['Polly’s recipe book', 'Книга рецептов Полли', 'Pollija recepšu grāmata'],
    sub: ['Cook from your garden harvest. Each dish gives an effect for a few hours — one dish at a time.', 'Готовь из урожая огорода. Каждое блюдо даёт эффект на несколько часов — одно блюдо за раз.', 'Gatavo no dārza ražas. Katrs ēdiens dod efektu uz dažām stundām — viens ēdiens vienlaikus.'],
    cook: ['🍳 Cook', '🍳 Готовить', '🍳 Gatavot'],
    need: ['Not enough harvest', 'Не хватает урожая', 'Nepietiek ražas'],
    full: ['Polly is full', 'Полли сыт', 'Pollijs ir paēdis'],
    left: ['{t} left', 'ещё {t}', 'vēl {t}'],
    now: ['Now:', 'Сейчас:', 'Tagad:'],
    garden: ['🥕 To the garden', '🥕 В огород', '🥕 Uz dārzu'],
    off: ['Dishes give no effects right now.', 'Сейчас блюда не дают эффектов.', 'Pašlaik ēdieni nedod efektus.'],
    guest: ['Only the owner cooks here.', 'Готовит только хозяин кухни.', 'Šeit gatavo tikai saimnieks.'],
    take: ['Take it off the heat!', 'Снять с огня!', 'Noņemt no uguns!'],
    hint: ['Take the pan off while the strip is green. The gold spot in the middle is perfect.', 'Сними сковородку, пока полоска в зелёном. Золотая серединка — идеально.', 'Noņem pannu, kamēr josla ir zaļa. Zelta vidus — ideāli.'],
    raw: ['Too early — it’s raw 😖', 'Рано — сыровато 😖', 'Par agru — jēls 😖'],
    burnt: ['Burnt! 🔥', 'Подгорело! 🔥', 'Piedega! 🔥'],
    good: ['Tasty! 😋', 'Вкусно! 😋', 'Garšīgi! 😋'],
    perfect: ['Perfect! ✨', 'Идеально! ✨', 'Ideāli! ✨'],
    ate: ['Polly ate it. Effect:', 'Полли съел. Эффект:', 'Pollijs apēda. Efekts:'],
    back: ['📖 Back to the book', '📖 К книге', '📖 Atpakaļ uz grāmatu'],
    best: ['best', 'лучшее', 'labākais'],
    times: ['cooked: {n}', 'готовилось: {n}', 'gatavots: {n}'],
    oops: ['Something went wrong, try again', 'Что-то пошло не так, попробуй ещё раз', 'Kaut kas nogāja greizi, mēģini vēlreiz'],
    rare: ['rare', 'редкое', 'retais'],
    h: ['h', 'ч', 'h'], m: ['min', 'мин', 'min'],
    all: ['in all games', 'во всех играх', 'visās spēlēs'],
    grow: ['each watering in the garden: +{n} h of growth', 'каждый полив в огороде: +{n} ч роста', 'katra laistīšana dārzā: +{n} h augšanas'],
    seed: ['seeds from games more often: ×{n}', 'семечки из игр чаще: ×{n}', 'sēklas no spēlēm biežāk: ×{n}'],
    for: ['for {n}', 'на {n}', 'uz {n}'],
  };
  const t = (k, o) => { let s = T[k][L]; if (o) for (const [a, b] of Object.entries(o)) s = s.replace('{' + a + '}', b); return s; };
  const GAME = { game: [['in Button Rain', 'в Пуговичном дожде', 'Pogu lietū'], '/rain/'], potion: [['in the Potion shop', 'в Зельеварне', 'Dziru darbnīcā'], '/potions/'],
    pan: [['in Polly’s Pancakes', 'в Блинной Полли', 'Pollija pankūkās'], '/pancakes/'], titos: [['at Detective Titos', 'у Детектива Титоса', 'pie detektīva Tito'], '/titos/'],
    shift: [['in the Shift with Polly', 'на Смене с Полли', 'Maiņā ar Polliju'], '/shift/'] };
  // блюда: название, посуда, цвета [основной, второй, акцент]
  const DISH = {
    radishsalad: [['Radish salad', 'Салат с редиской', 'Redīsu salāti'], 'bowl', ['#7DBE5A', '#E2486A', '#F5F0DC']],
    carrotsoup: [['Carrot soup', 'Морковный суп', 'Burkānu zupa'], 'bowl', ['#F08A2C', '#9CCB6A', '#FFD08A']],
    berrypancakes: [['Strawberry pancakes', 'Блинчики с клубникой', 'Pankūkas ar zemenēm'], 'stack', ['#E8B66A', '#E23B4E', '#FFF4D6']],
    sunbread: [['Sunflower-seed bread', 'Хлеб с семечками', 'Maize ar saulespuķu sēklām'], 'loaf', ['#C98A44', '#5A3B22', '#F2D29A']],
    cabbagerolls: [['Cabbage rolls', 'Голубцы', 'Kāpostu tīteņi'], 'plate', ['#B8D98A', '#D9603A', '#EAF5D6']],
    tulipteas: [['Tulip tea', 'Чай из тюльпанов', 'Tulpju tēja'], 'cup', ['#E86A8A', '#C7E3F0', '#FFF']],
    pumpkinpie: [['Pumpkin pie', 'Тыквенный пирог', 'Ķirbju pīrāgs'], 'pie', ['#E8892C', '#C98A44', '#FFF4D6']],
    rainbowcake: [['Rainbow carrot cake', 'Радужный морковный торт', 'Varavīksnes burkānu kūka'], 'cake', ['#F08A2C', '#8A5CD6', '#FFF4F8']],
    bluejam: [['Blue rose jam', 'Варенье из синей розы', 'Zilās rozes ievārījums'], 'jar', ['#3D6FD6', '#9FC2F5', '#E8E1D0']],
    goldsoup: [['Golden pumpkin soup', 'Суп из золотой тыквы', 'Zelta ķirbja zupa'], 'bowl', ['#F5C326', '#FFF0A0', '#E8892C']],
    starpudding: [['Starberry pudding', 'Пудинг со звёздной ягодой', 'Zvaigžņogu pudiņš'], 'pudding', ['#F2E6FF', '#B06AF0', '#FFE36A']],
    moontea: [['Moonflower tea', 'Чай из лунного цветка', 'Mēnessziedu tēja'], 'cup', ['#9AA8F0', '#2B2E5C', '#FFF6C2']],
    mandrakestew: [['Mandrake stew', 'Рагу из мандрагоры', 'Mandragoras sautējums'], 'pot', ['#7A5A3A', '#6BAA4A', '#E8C99A']],
  };
  const dname = k => DISH[k] ? DISH[k][0][L] : k;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const api = (path, body) => fetch('/api/kitchen' + path, body ? { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : { credentials: 'same-origin' })
    .then(r => r.ok ? r.json() : Promise.reject(r.status));
  const load = src => new Promise(ok => { if (window.PPGardenPlants) return ok(); const s = document.createElement('script'); s.src = src; s.onload = s.onerror = () => ok(); document.head.appendChild(s); });
  const ink = '#2B1A51';
  const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16), f = c => Math.max(0, Math.min(255, Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k))); return '#' + [n >> 16, n >> 8 & 255, n & 255].map(f).map(v => v.toString(16).padStart(2, '0')).join(''); };

  // ---------- пиксельное блюдо 32×24 ----------
  function drawDish(g, key, q) {
    const [, kind, c0] = DISH[key] || DISH.radishsalad;
    const c = c0.map(x => q === 'burnt' ? shade(x, -.65) : q === 'raw' ? shade(x, .45) : x);
    const R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
    g.clearRect(0, 0, 32, 24);
    R(4, 21, 24, 2, 'rgba(43,26,81,.18)'); // тень
    if (kind === 'bowl' || kind === 'pot') {
      const bowl = kind === 'pot' ? '#5B5560' : '#F7F4EC';
      R(5, 12, 22, 2, ink); R(6, 14, 20, 3, bowl); R(7, 17, 18, 2, bowl); R(9, 19, 14, 2, bowl); R(5, 14, 1, 3, ink); R(26, 14, 1, 3, ink); R(6, 17, 1, 2, ink); R(25, 17, 1, 2, ink); R(8, 19, 1, 2, ink); R(23, 19, 1, 2, ink); R(9, 21, 14, 1, ink);
      R(6, 11, 20, 2, c[0]); R(8, 10, 16, 1, c[0]); [[9, 10], [14, 9], [19, 10], [12, 11], [21, 11]].forEach(([x, y]) => R(x, y, 2, 1, c[1])); R(17, 10, 1, 1, c[2]);
      if (kind === 'pot') { R(2, 13, 3, 2, ink); R(27, 13, 3, 2, ink); }
      if (q !== 'raw') [[11, 3], [16, 1], [21, 4]].forEach(([x, y], i) => { R(x, y + 3, 1, 2, 'rgba(255,255,255,.75)'); R(x + (i % 2 ? 1 : -1), y + 1, 1, 2, 'rgba(255,255,255,.6)'); });
    } else if (kind === 'cup') {
      R(8, 9, 14, 1, ink); R(8, 10, 1, 9, ink); R(21, 10, 1, 9, ink); R(9, 19, 12, 1, ink); R(9, 10, 12, 9, c[1] === '#2B2E5C' ? '#E8ECFF' : '#FFFFFF'); R(9, 10, 12, 2, c[0]);
      R(22, 11, 3, 1, ink); R(24, 12, 1, 4, ink); R(22, 16, 3, 1, ink); R(5, 20, 20, 1, ink); R(6, 19, 2, 1, ink); R(22, 19, 2, 1, ink);
      R(13, 14, 4, 3, c[0]); R(14, 13, 2, 1, c[0]); // цветок на чашке
      [[11, 3], [15, 1], [19, 4]].forEach(([x, y]) => R(x, y + 2, 1, 3, 'rgba(160,160,200,.55)'));
    } else if (kind === 'jar') {
      R(10, 5, 12, 3, c[2]); R(10, 5, 12, 1, ink); R(9, 8, 14, 1, ink); R(9, 9, 1, 11, ink); R(22, 9, 1, 11, ink); R(10, 20, 12, 1, ink); R(10, 9, 12, 11, c[0]); R(11, 10, 2, 8, c[1]);
      R(12, 12, 8, 5, '#FFF8E8'); R(13, 14, 6, 1, ink);
    } else if (kind === 'pudding') {
      R(4, 19, 24, 2, ink); R(5, 18, 22, 1, '#F7F4EC'); R(9, 8, 14, 10, c[0]); R(9, 8, 14, 1, ink); R(8, 9, 1, 9, ink); R(23, 9, 1, 9, ink); R(9, 6, 14, 3, c[1]); R(10, 9, 2, 3, c[1]); R(17, 9, 2, 4, c[1]);
      R(15, 3, 2, 3, c[2]); R(14, 4, 4, 1, c[2]);
    } else { // тарелка: блины, хлеб, голубцы, пирог, торт
      R(2, 18, 28, 2, '#F7F4EC'); R(2, 20, 28, 1, ink); R(1, 18, 1, 2, ink); R(30, 18, 1, 2, ink); R(4, 17, 24, 1, '#E8E1D0');
      if (kind === 'stack') { for (let i = 0; i < 4; i++) { R(7, 15 - i * 3, 18, 3, i % 2 ? shade(c[0], -.12) : c[0]); R(6, 16 - i * 3, 1, 1, ink); R(25, 16 - i * 3, 1, 1, ink); } R(8, 4, 16, 2, c[2]); [[10, 3], [15, 2], [20, 3]].forEach(([x, y]) => { R(x, y, 3, 2, c[1]); R(x + 1, y - 1, 1, 1, '#3A8A3A'); }); }
      else if (kind === 'loaf') { R(7, 9, 18, 8, c[0]); R(8, 8, 16, 1, c[0]); R(7, 9, 18, 1, ink); [[10, 11], [14, 10], [18, 12], [21, 10], [12, 14], [17, 15]].forEach(([x, y]) => R(x, y, 1, 1, c[1])); R(9, 12, 14, 1, c[2]); }
      else if (kind === 'plate') { [7, 13, 19].forEach(x => { R(x, 11, 6, 6, c[0]); R(x, 11, 6, 1, ink); R(x + 1, 12, 4, 1, c[2]); }); R(7, 9, 18, 2, c[1]); R(9, 8, 3, 1, c[1]); R(18, 8, 3, 1, c[1]); }
      else if (kind === 'pie') { R(6, 10, 20, 7, c[1]); R(7, 9, 18, 1, ink); R(7, 10, 18, 3, c[0]); for (let x = 7; x < 25; x += 3) R(x, 10, 1, 7, shade(c[1], -.15)); R(17, 11, 5, 5, '#FFF4D6'); }
      else { R(8, 6, 16, 11, c[2]); R(8, 6, 16, 1, ink); R(8, 9, 16, 2, c[0]); R(8, 13, 16, 2, c[1]); R(15, 2, 2, 4, '#F5C326'); R(15, 1, 2, 1, '#FF7A3A'); }
    }
    if (q === 'burnt') [[10, 0], [18, 1]].forEach(([x, y]) => { R(x, y, 3, 2, 'rgba(60,60,60,.55)'); R(x + 1, y + 2, 2, 2, 'rgba(60,60,60,.4)'); });
  }
  const pics = {};
  const dishPic = (key, q = '') => { const id = key + q; if (pics[id]) return pics[id]; const c = document.createElement('canvas'); c.width = 32; c.height = 24; const g = c.getContext('2d'); drawDish(g, key, q); return (pics[id] = c.toDataURL()); };
  const cropPic = p => window.PPGardenPlants ? `<img class="ck-crop" src="${window.PPGardenPlants.icon(p)}" alt="" width="18" height="20">` : '🌱';
  const cropName = p => window.PPGardenPlants ? window.PPGardenPlants.name(p) : p;

  const dur = ms => { const m = Math.max(1, Math.round(ms / 60000)); return m >= 60 ? Math.floor(m / 60) + ' ' + t('h') + (m % 60 ? ' ' + m % 60 + ' ' + t('m') : '') : m + ' ' + t('m'); };
  const hrs = h => h + ' ' + t('h');
  // текст эффекта: {t, g, pct}
  function effText(e) {
    if (e.t === 'grow') return t('grow', { n: e.pct });
    if (e.t === 'seed') return t('seed', { n: Math.round((1 + e.pct / 100) * 10) / 10 });
    const where = (e.g || []).length >= Object.keys(GAME).length ? t('all') : (e.g || []).map(k => GAME[k] ? `<a href="${pre}${GAME[k][1]}">${GAME[k][0][L]}</a>` : k).join(', ');
    return `${e.pct > 0 ? '+' : '−'}${Math.abs(e.pct)} % 🔘 ${where}`;
  }

  // ---------- окно ----------
  let ov = null, D = null, raf = 0;
  function close() { cancelAnimationFrame(raf); if (ov) ov.remove(); ov = null; document.removeEventListener('keydown', onKey); }
  const onKey = e => { if (e.key === 'Escape') close(); };
  async function open() {
    if (ov) return;
    css();
    ov = document.createElement('div'); ov.className = 'ck-ov'; ov.innerHTML = `<div class="ck-book" role="dialog" aria-modal="true" aria-label="${esc(t('title'))}"><button type="button" class="ck-x" aria-label="✕">✕</button><div class="ck-in"><p class="ck-wait">📖 …</p></div></div>`;
    document.body.appendChild(ov);
    ov.addEventListener('click', e => { if (e.target === ov) close(); });
    ov.querySelector('.ck-x').onclick = close;
    document.addEventListener('keydown', onKey);
    await load('/assets/garden.js');
    try { D = await api(''); } catch (e) { inner().innerHTML = `<p class="ck-wait">${t('oops')}</p>`; return; }
    if (D.cook) cookView(D.cook.r, D.cook.el); else bookView();
  }
  const inner = () => ov.querySelector('.ck-in');
  const toast = m => window.PPToast ? window.PPToast(m) : null;

  function bookView() {
    cancelAnimationFrame(raf);
    if (!ov) return;
    const crop = D.crop || {}, full = !!D.dish;
    const dish = D.dish ? `<div class="ck-now${D.dish.pct < 0 ? ' bad' : ''}"><img src="${dishPic(D.dish.r, D.dish.q === 'raw' || D.dish.q === 'burnt' ? D.dish.q : '')}" alt="" width="64" height="48">
      <div><b>${t('now')} ${esc(dname(D.dish.r))}</b> · ${t(D.dish.q)}<br>${effText(D.dish)} · ${t('left', { t: dur(D.dish.until - Date.now()) })}</div></div>` : '';
    const cards = Object.entries(D.recipes || {}).map(([k, r]) => {
      const ok = Object.entries(r.need).every(([c, n]) => (crop[c] || 0) >= n), b = (D.book || {})[k], rare = Object.keys(r.need).some(c => /rainbow|bluerose|gold|star|moon|mandrake/.test(c));
      const need = Object.entries(r.need).map(([c, n]) => `<span class="ck-need${(crop[c] || 0) >= n ? ' ok' : ''}" title="${esc(cropName(c))}">${cropPic(c)}${esc(cropName(c))} ${Math.min(crop[c] || 0, n)}/${n}</span>`).join('');
      const btn = D.guest ? '' : `<button type="button" class="ck-go" data-cook="${k}"${ok && !full && D.on ? '' : ' disabled'}>${full ? t('full') : ok ? t('cook') : t('need')}</button>`;
      return `<article class="ck-card${ok ? ' can' : ''}"><img class="ck-pic" src="${dishPic(k)}" alt="" width="96" height="72"><div class="ck-body"><h3>${esc(dname(k))}${rare ? ` <small>✨ ${t('rare')}</small>` : ''}</h3>
        <p class="ck-eff">${effText(r)} · ${t('for', { n: hrs(r.h) })}</p><p class="ck-needs">${need}</p>
        ${b ? `<p class="ck-best">${t('times', { n: b.n })}${b.best ? ` · ${t('best')}: ${t(b.best)}` : ''}</p>` : ''}${btn}</div></article>`;
    }).join('');
    inner().innerHTML = `<header class="ck-top"><h2>📖 ${t('title')}</h2><p>${t('sub')}</p>${D.on ? '' : `<p class="ck-off">${t('off')}</p>`}${D.guest ? `<p class="ck-off">${t('guest')}</p>` : ''}</header>
      ${dish}<div class="ck-grid">${cards}</div><p class="ck-foot"><a href="${pre}/garden/">${t('garden')}</a></p>`;
    inner().querySelectorAll('[data-cook]').forEach(b => b.onclick = async () => {
      b.disabled = true;
      try { D = { ...D, ...(await api('/start', { recipe: b.dataset.cook })) }; cookView(b.dataset.cook, D.cook ? D.cook.el : 0); }
      catch (e) { try { D = await api(''); } catch (e2) {} toast(t('oops')); bookView(); }
    });
  }

  // ---------- готовка: сковородка и полоска ----------
  function cookView(key, el0) {
    const r = D.recipes[key], [a, b] = r.win.map(s => s * 1000), late = D.late || 3000, end = b + late, mid = (a + b) / 2, pw = (b - a) * (D.perfect || .2);
    const t0 = performance.now() - (el0 || 0), [, , col] = DISH[key] || DISH.radishsalad;
    const pc = v => (v / end * 100).toFixed(2) + '%';
    inner().innerHTML = `<header class="ck-top"><h2>🍳 ${esc(dname(key))}</h2><p>${t('hint')}</p></header>
      <div class="ck-stove"><canvas class="ck-pan" width="80" height="48"></canvas></div>
      <div class="ck-bar" aria-hidden="true"><i class="z-raw" style="width:${pc(a)}"></i><i class="z-ok" style="left:${pc(a)};width:${pc(b - a)}"></i><i class="z-top" style="left:${pc(mid - pw / 2)};width:${pc(pw)}"></i><i class="z-burn" style="left:${pc(b)};width:${pc(late)}"></i><b class="ck-mark"></b></div>
      <button type="button" class="ck-take">${t('take')}</button>`;
    const cv = inner().querySelector('.ck-pan'), g = cv.getContext('2d'), mark = inner().querySelector('.ck-mark'), btn = inner().querySelector('.ck-take');
    let done = false;
    const lerp = (x, y, k) => { const p = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)), A = p(x), B = p(y); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
    const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    function frame(now) {
      const el = now - t0, k = Math.min(1, el / end);
      mark.style.left = (k * 100) + '%';
      g.clearRect(0, 0, 80, 48);
      R(0, 38, 80, 10, '#3E3936'); R(0, 38, 80, 1, '#58524D'); // плита
      for (let i = 0; i < 7; i++) { const fh = 3 + ((Math.floor(now / 90) + i * 3) % 4); R(20 + i * 6, 38 - fh, 3, fh, i % 2 ? '#FF9A2E' : '#3A8AF0'); R(21 + i * 6, 37 - fh, 1, 1, '#FFE36A'); }
      R(14, 28, 46, 6, '#2F2C33'); R(16, 34, 42, 2, '#2F2C33'); R(14, 27, 46, 1, '#5B5560'); R(60, 29, 16, 3, '#6B4A2E'); R(74, 28, 3, 5, '#6B4A2E'); // сковорода и ручка
      const cooked = el < a ? el / a * .55 : el < b ? .55 + (el - a) / (b - a) * .35 : .9 + Math.min(1, (el - b) / late) * .1;
      const burn = el > b ? Math.min(1, (el - b) / late) : 0;
      const food = (c, c2) => burn ? lerp(c2, '#2A1E18', burn) : lerp(shade(c, .5), c2, Math.min(1, cooked / .7));
      [[18, 24, 9, 3], [28, 23, 10, 4], [39, 24, 8, 3], [48, 23, 9, 4], [23, 22, 5, 2], [43, 21, 5, 2]].forEach(([x, y, w, h], i) => R(x, y + (Math.floor(now / 140 + i) % 3 === 0 ? -1 : 0), w, h, food(col[i % 2], i % 2 ? shade(col[1], -.1) : shade(col[0], -.08))));
      if (el > a * .7) for (let i = 0; i < 3; i++) { const yy = 18 - ((now / 30 + i * 9) % 16); R(25 + i * 12 + Math.sin(now / 200 + i) * 2, yy, 1, 2, burn > .2 ? 'rgba(60,60,60,.7)' : 'rgba(255,255,255,.7)'); }
      if (burn > .3) for (let i = 0; i < 4; i++) R(20 + i * 10, 6 + ((now / 50 + i * 7) % 12), 4, 3, 'rgba(70,70,70,' + (.3 + burn * .4) + ')');
      if (el >= end && !done) return take();
      raf = requestAnimationFrame(frame);
    }
    async function take() {
      if (done) return; done = true; cancelAnimationFrame(raf); btn.disabled = true;
      const ms = Math.round(performance.now() - t0);
      try { const res = await api('/done', { ms }); D = { ...D, ...res }; resultView(res.q, res.ate); }
      catch (e) { try { D = await api(''); } catch (e2) {} toast(t('oops')); bookView(); }
    }
    btn.onclick = take;
    raf = requestAnimationFrame(frame);
  }

  function resultView(q, e) {
    if (!ov) return;
    const bad = q === 'raw' || q === 'burnt';
    inner().innerHTML = `<div class="ck-res${bad ? ' bad' : ''}"><img src="${dishPic(e.r, bad ? q : '')}" alt="" width="160" height="120"><h2>${t(q)}</h2><p><b>${esc(dname(e.r))}</b></p>
      <p>${t('ate')} ${effText(e)} · ${t('for', { n: dur(e.until - Date.now()) })}</p><button type="button" class="ck-go ck-back">${t('back')}</button></div>`;
    inner().querySelector('.ck-back').onclick = bookView;
    if (!bad && window.PPConfetti) window.PPConfetti();
  }

  let cssDone = false;
  function css() {
    if (cssDone) return; cssDone = true;
    const s = document.createElement('style');
    s.textContent = `.ck-ov{position:fixed;inset:0;z-index:1000;background:rgba(43,26,81,.55);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:24px 16px}
.ck-book{position:relative;width:min(960px,100%);background:#FBF3E0;color:${ink};border:3px solid ${ink};border-radius:14px 18px 18px 14px;box-shadow:8px 8px 0 rgba(43,26,81,.35),inset 14px 0 0 #E9D9B4;padding:20px 20px 16px 34px}
.ck-x{position:absolute;top:8px;right:10px;width:36px;height:36px;border-radius:50%;border:2px solid ${ink};background:#fff;font-size:16px;cursor:pointer;color:${ink}}
.ck-top h2{margin:0 40px 4px 0;font-size:22px}.ck-top p{margin:0 0 10px;opacity:.85}.ck-off{color:#B0362A}
.ck-now{display:flex;gap:12px;align-items:center;background:#E8F5DC;border:2px dashed #5E9E3A;border-radius:12px;padding:8px 12px;margin:6px 0 14px}.ck-now.bad{background:#FBE4DE;border-color:#C8553D}
.ck-now img,.ck-pic,.ck-res img{image-rendering:pixelated}
.ck-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.ck-card{display:flex;gap:12px;background:#fff;border:2px solid rgba(43,26,81,.25);border-radius:12px;padding:10px}.ck-card.can{border-color:#5E9E3A}
.ck-card h3{margin:0 0 4px;font-size:16px}.ck-card h3 small{font-weight:400;color:#8A5CD6}.ck-body{flex:1;min-width:0}
.ck-pic{flex:none;width:96px;height:72px;background:#FFF8E8;border-radius:10px}
.ck-eff{margin:0 0 6px;font-size:14px}.ck-eff a,.ck-now a,.ck-res a{color:inherit}
.ck-needs{display:flex;flex-wrap:wrap;gap:4px;margin:0 0 8px}.ck-need{display:inline-flex;align-items:center;gap:3px;font-size:13px;background:#F3E7E3;border-radius:999px;padding:1px 8px 1px 2px;color:#8A2E22}.ck-need.ok{background:#E8F5DC;color:#2E6A1E}
.ck-crop{width:18px;height:20px;image-rendering:pixelated}.ck-best{margin:0 0 6px;font-size:12px;opacity:.7}
.ck-go,.ck-take{font:inherit;font-weight:700;border:2px solid ${ink};background:#F5C326;color:${ink};border-radius:999px;padding:6px 14px;cursor:pointer;box-shadow:0 3px 0 ${ink}}
.ck-go:disabled{background:#EEE6D6;color:rgba(43,26,81,.55);box-shadow:none;cursor:default}
.ck-stove{display:flex;justify-content:center;margin:8px 0 12px}.ck-pan{width:min(480px,100%);aspect-ratio:80/48;image-rendering:pixelated;background:#F6E7C1;border-radius:12px;border:2px solid ${ink}}
.ck-bar{position:relative;height:22px;border:2px solid ${ink};border-radius:999px;overflow:hidden;background:#ddd;max-width:480px;margin:0 auto 14px}.ck-bar i{position:absolute;top:0;bottom:0}
.z-raw{left:0;background:#D9D2C3}.z-ok{background:#7DBE5A}.z-top{background:#F5C326}.z-burn{background:#C8553D}
.ck-mark{position:absolute;top:-2px;bottom:-2px;width:4px;margin-left:-2px;background:${ink};box-shadow:0 0 0 2px #fff}
.ck-take{display:block;margin:0 auto 6px;font-size:20px;padding:12px 28px}
.ck-res{text-align:center;padding:10px 0}.ck-res img{width:160px;height:120px;background:#FFF8E8;border-radius:14px}.ck-res h2{margin:8px 0 4px}.ck-res.bad h2{color:#B0362A}
.ck-foot{margin:12px 0 0;text-align:right}.ck-foot a{color:${ink}}.ck-wait{padding:30px;text-align:center}
@media (max-width:640px){.ck-book{padding:16px 12px 12px 22px;box-shadow:none}.ck-grid{grid-template-columns:1fr}.ck-pic{width:72px;height:54px}.ck-top h2{font-size:19px}}`;
    document.head.appendChild(s);
  }
  window.PPCookbook = { open, close, drawDish, dishPic, DISH };
})();
