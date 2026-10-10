// Палитры из артов: страница «Палитры» (#pal-app, сверху — «Палитра из вашего фото») и кнопка 🎨 в челлендже (#ch-pal-btn). Данные — /assets/palettes.json (tools/palettes.py)
(() => {
  const L = { ru: 'ru', lv: 'lv' }[document.documentElement.lang] || 'en';
  const T = {
    copy: { en: 'Copied', ru: 'Скопировано', lv: 'Nokopēts' },
    copyAll: { en: 'Copy all HEX', ru: 'Скопировать все HEX', lv: 'Kopēt visus HEX' },
    another: { en: '🎲 Another palette', ru: '🎲 Другая палитра', lv: '🎲 Cita palete' },
    all: { en: 'All palettes →', ru: 'Все палитры →', lv: 'Visas paletes →' },
    title: { en: 'Palette for inspiration', ru: 'Палитра для вдохновения', lv: 'Palete iedvesmai' },
    hint: { en: 'Draw today’s theme with these colors. Tap a color to copy its code.', ru: 'Нарисуйте тему дня этими цветами. Нажмите на цвет, чтобы скопировать код.', lv: 'Uzzīmē dienas tēmu šajās krāsās. Pieskaries krāsai, lai nokopētu kodu.' },
    from: { en: 'from', ru: 'из картины', lv: 'no darba' },
    close: { en: 'Close', ru: 'Закрыть', lv: 'Aizvērt' },
    allG: { en: 'All', ru: 'Все', lv: 'Visas' },
    random: { en: '🎲 Surprise me', ru: '🎲 Случайная', lv: '🎲 Pārsteidz mani' },
    mkH: { en: 'Make a palette from your photo', ru: 'Палитра из вашего фото', lv: 'Palete no tava foto' },
    mkP: { en: 'Upload your art or any photo and get a palette card like these: 3 bright and 3 calm colors with names and HEX codes. The photo stays on your device, nothing is uploaded to the site.', ru: 'Загрузите свой рисунок или любое фото и получите такую же карточку с палитрой: 3 ярких и 3 спокойных цвета с названиями и HEX-кодами. Фото остаётся на вашем устройстве, на сайт ничего не загружается.', lv: 'Augšupielādē savu zīmējumu vai jebkuru foto un saņem tādu pašu kartīti ar paleti: 3 spilgtas un 3 mierīgas krāsas ar nosaukumiem un HEX kodiem. Foto paliek tavā ierīcē, uz vietni nekas netiek augšupielādēts.' },
    mkPick: { en: '📷 Choose a photo', ru: '📷 Выбрать фото', lv: '📷 Izvēlēties foto' },
    mkOther: { en: '📷 Another photo', ru: '📷 Другое фото', lv: '📷 Cits foto' },
    mkName: { en: 'Palette name', ru: 'Название палитры', lv: 'Paletes nosaukums' },
    mkDef: { en: 'My palette', ru: 'Моя палитра', lv: 'Mana palete' },
    mkSave: { en: '⬇ Download the card', ru: '⬇ Скачать карточку', lv: '⬇ Lejupielādēt kartīti' },
    mkWait: { en: 'Mixing colors…', ru: 'Смешиваю краски…', lv: 'Jaucu krāsas…' },
    mkErr: { en: 'Could not open this file, try a JPG or PNG.', ru: 'Не получилось открыть файл, попробуйте JPG или PNG.', lv: 'Neizdevās atvērt failu, pamēģini JPG vai PNG.' },
    mkTip: { en: 'Drag a circle to take that color from another spot of the photo. Or tap a circle, then tap the photo.', ru: 'Перетащите кружок, чтобы взять цвет из другого места фото. Или нажмите на кружок, а потом на фото.', lv: 'Velc aplīti, lai paņemtu krāsu no citas foto vietas. Vai pieskaries aplītim un tad foto.' },
    mkPin: { en: 'Color', ru: 'Цвет', lv: 'Krāsa' },
    mkReset: { en: '↺ Back to automatic', ru: '↺ Вернуть как было', lv: '↺ Atjaunot automātiski' },
    adH: { en: '🔒 Add to the site (only you see this)', ru: '🔒 Добавить на сайт (видите только вы)', lv: '🔒 Pievienot vietnei (redzi tikai tu)' },
    adSec: { en: 'Section', ru: 'Раздел', lv: 'Sadaļa' },
    adT: { en: 'Title', ru: 'Название', lv: 'Nosaukums' },
    adGo: { en: '➕ Add to the site', ru: '➕ Добавить на сайт', lv: '➕ Pievienot vietnei' },
    adBusy: { en: 'Uploading…', ru: 'Загружаю…', lv: 'Augšupielādēju…' },
    adOk: { en: 'Added! It is already in the section and in Palettes.', ru: 'Добавлено! Картина уже в разделе и в «Палитрах».', lv: 'Pievienots! Darbs jau ir sadaļā un «Paletēs».' },
    adOkAi: { en: 'Added to the section.', ru: 'Добавлено в раздел.', lv: 'Pievienots sadaļai.' },
    adExtra: { en: 'EXTRA day palette in the challenge:', ru: 'Палитра дня ЭКСТРА в челлендже:', lv: 'EKSTRA dienas palete izaicinājumā:' },
    adErr: { en: 'Could not save, try again.', ru: 'Не получилось сохранить, попробуйте ещё раз.', lv: 'Neizdevās saglabāt, mēģini vēlreiz.' },
    adNeedT: { en: 'Write a title.', ru: 'Напишите название.', lv: 'Uzraksti nosaukumu.' },
    adAdd: { en: '➕ Add a picture to this section', ru: '➕ Добавить картину в этот раздел', lv: '➕ Pievienot darbu šai sadaļai' },
    adDel: { en: 'Remove from the site', ru: 'Убрать с сайта', lv: 'Noņemt no vietnes' },
    adDelQ: { en: 'Remove this picture from the site?', ru: 'Убрать эту картину с сайта?', lv: 'Noņemt šo darbu no vietnes?' },
    adWhen: { en: '📅 EXTRA:', ru: '📅 ЭКСТРА:', lv: '📅 EKSTRA:' },
    adWas: { en: '✓ was EXTRA:', ru: '✓ была ЭКСТРА:', lv: '✓ bija EKSTRA:' },
    adHelp: { en: 'Choose a picture, move the circles if you want other colors, write the title and press “Add”. The picture goes to its section, the palette to Palettes and to the queue of EXTRA days.', ru: 'Выберите картину, при желании подвигайте кружки-пипетки, напишите название и нажмите «Добавить». Картина попадёт в свой раздел, палитра — в «Палитры» и в очередь дней ЭКСТРА.', lv: 'Izvēlies darbu, ja vajag, pakustini aplīšus, uzraksti nosaukumu un spied «Pievienot». Darbs nonāks savā sadaļā, palete — «Paletēs» un EKSTRA dienu rindā.' },
    kick: { en: 'Color palette', ru: 'Палитра', lv: 'Krāsu palete' },
    made: { en: 'made with Pigeon Polly', ru: 'сделано с Pigeon Polly', lv: 'veidots ar Pigeon Polly' },
  };
  const G = { bird: ['Pigeon Polly', 'Pigeon Polly', 'Pigeon Polly'], snail: ['Mr.Chew', 'Mr.Chew', 'Mr.Chew'], sketchbook: ['Sketchbook', 'Скетчбук', 'Skiču burtnīca'],
    halloween: ['Pumpkin Family', 'Тыквенная семья', 'Ķirbju ģimene'], detective: ['Mr.Titos', 'Мистер Титос', 'Mr.Titos'], anxiety: ['Anxiety', 'Тревога', 'Trauksme'], challenge: ['Challenge', 'Челлендж', 'Izaicinājums'],
    'ai-art': ['AI Art', 'AI-арт', 'AI māksla'], other: ['Other', 'Другое', 'Citi'] };
  const ADD_G = ['sketchbook', 'anxiety', 'bird', 'snail', 'detective', 'halloween', 'ai-art', 'other']; // куда админ может добавить картину (как ART_GALLERIES в worker)
  const gi = { en: 0, ru: 1, lv: 2 }[L], pre = L === 'en' ? '' : '/' + L;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const toast = m => window.PPToast ? window.PPToast(m) : null;
  const copy = (txt, msg) => (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast(msg || T.copy[L] + ': ' + txt)).catch(() => prompt('', txt));
  const ink = h => { const n = parseInt(h.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255; return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#1B1820' : '#FFFFFF'; };
  let data = null, extra = { added: [], queue: [], month: 0 };
  const getAdded = () => fetch('/api/palettes', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).then(x => (x && (extra = x)) || extra).catch(() => extra);
  // все палитры: добавленные с сайта (новые сверху) + из статики
  const load = () => data ? Promise.resolve(data) : Promise.all([fetch('/assets/palettes.json').then(r => r.json()), getAdded()])
    .then(([st, ad]) => (data = [...ad.added.filter(p => p.palette), ...st]));
  let adminP = null;
  const isAdmin = () => adminP || (adminP = fetch('/api/whoami', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).then(d => !!(d && d.user && d.user.admin)).catch(() => false));
  const monthName = i => new Date(2026, 9 + i, 1).toLocaleDateString({ en: 'en-GB', ru: 'ru-RU', lv: 'lv-LV' }[L], { month: 'long', year: 'numeric' });
  const delArt = (key, el) => { if (!confirm(T.adDelQ[L])) return;
    fetch('/api/admin/art/delete', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ key }) })
      .then(r => { if (!r.ok) throw 0; el.remove(); if (data) data = data.filter(p => p.key !== key); }).catch(() => alert(T.adErr[L])); };
  function card(p, big) {
    const el = document.createElement('article'); el.className = 'pal-card' + (big ? ' big' : ''); el.id = p.key;
    el.innerHTML = `<a class="pal-img" href="/${esc(p.img)}" target="_blank" rel="noopener"><img src="/${esc(p.thumb)}" alt="${esc(p.title[L])}" loading="lazy" width="${p.w}" height="${p.h}"></a>
      <div class="pal-body"><h3>${esc(p.title[L])}</h3><small>${esc(G[p.gallery] ? G[p.gallery][gi] : p.gallery)}</small>
      <ul class="pal-sw">${p.colors.map(c => `<li><button type="button" data-hex="${c.hex}" style="--c:${c.hex};--i:${ink(c.hex)}" title="${esc(c[L])} ${c.hex}"><i></i><b>${esc(c[L])}</b><code>${c.hex}</code></button></li>`).join('')}</ul>
      <div class="pal-act"><button type="button" class="pill-btn" data-all>${T.copyAll[L]}</button></div></div>`;
    el.querySelectorAll('[data-hex]').forEach(b => b.onclick = () => copy(b.dataset.hex));
    el.querySelector('[data-all]').onclick = () => copy(p.colors.map(c => c.hex).join(' '), T.copy[L] + ' ✓');
    if (!big) isAdmin().then(a => {
      if (!a) return;
      const act = el.querySelector('.pal-act'), i = extra.queue.indexOf(p.key);
      if (i >= 0) { const s = document.createElement('small'); s.className = 'pal-when'; s.textContent = (i < extra.month ? T.adWas[L] : T.adWhen[L]) + ' ' + monthName(i); act.appendChild(s); }
      if (p.added) { const b = document.createElement('button'); b.type = 'button'; b.className = 'pill-btn'; b.textContent = '🗑'; b.title = T.adDel[L]; b.onclick = () => delArt(p.key, el); act.appendChild(b); }
    });
    return el;
  }
  // ---------- «Палитра из вашего фото»: всё считается в браузере, фото никуда не отправляется ----------
  // тот же алгоритм, что tools/palettes.py: 3 ярких (отдельный k-means по насыщенным пикселям, кислотные приглушаем) + 3 спокойных по площади
  const toLab = (r, g, b) => {
    const f = c => (c /= 255) <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
    const R = f(r), G = f(g), B = f(b);
    const x = (.4124 * R + .3576 * G + .1805 * B) / .95047, y = .2126 * R + .7152 * G + .0722 * B, z = (.0193 * R + .1192 * G + .9505 * B) / 1.08883;
    const h = t => t > .008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
    return [116 * h(y) - 16, 500 * (h(x) - h(y)), 200 * (h(y) - h(z))];
  };
  const labHex = ([L, a, b]) => {
    const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - b / 200, inv = t => t ** 3 > .008856 ? t ** 3 : (t - 16 / 116) / 7.787;
    const x = inv(fx) * .95047, y = inv(fy), z = inv(fz) * 1.08883;
    const g = c => { c = Math.max(c, 0); c = c <= .0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - .055; return Math.round(Math.min(1, Math.max(0, c)) * 255); };
    return '#' + [3.2406 * x - 1.5372 * y - .4986 * z, -.9689 * x + 1.8758 * y + .0415 * z, .0557 * x - .2040 * y + 1.0570 * z].map(v => g(v).toString(16).padStart(2, '0')).join('').toUpperCase();
  };
  const hexLab = h => toLab(parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16));
  const dE = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
  const chr = c => Math.hypot(c[1], c[2]);
  const hue = c => (Math.atan2(c[2], c[1]) * 180 / Math.PI + 360) % 360;
  const hdiff = (p, q) => { const d = Math.abs(hue(p) - hue(q)); return Math.min(d, 360 - d); };
  function kmeans(x, k, it = 16) {
    let a = 7; const rnd = () => (a = (a * 1103515245 + 12345) % 2147483648) / 2147483648;
    k = Math.min(k, x.length);
    let c = []; const used = new Set();
    while (c.length < k) { const i = Math.floor(rnd() * x.length); if (!used.has(i)) { used.add(i); c.push(x[i].slice()); } }
    const lab = new Int32Array(x.length);
    for (let t = 0; t < it; t++) {
      const sum = c.map(() => [0, 0, 0, 0]);
      x.forEach((p, i) => { let bi = 0, bd = Infinity; c.forEach((q, j) => { const d = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2; if (d < bd) { bd = d; bi = j; } }); lab[i] = bi; const s = sum[bi]; s[0] += p[0]; s[1] += p[1]; s[2] += p[2]; s[3]++; });
      c = c.map((q, j) => sum[j][3] ? [sum[j][0] / sum[j][3], sum[j][1] / sum[j][3], sum[j][2] / sum[j][3]] : q);
    }
    const n = new Array(c.length).fill(0); lab.forEach(j => n[j]++);
    return c.map((q, j) => [q, n[j]]);
  }
  function extract(img) {
    const s = Math.min(1, 180 / Math.max(img.naturalWidth, img.naturalHeight));
    const cv = document.createElement('canvas'); cv.width = Math.max(1, Math.round(img.naturalWidth * s)); cv.height = Math.max(1, Math.round(img.naturalHeight * s));
    const g = cv.getContext('2d'); g.drawImage(img, 0, 0, cv.width, cv.height);
    const d = g.getImageData(0, 0, cv.width, cv.height).data;
    let px = []; for (let i = 0; i < d.length; i += 4) px.push(toLab(d[i], d[i + 1], d[i + 2]));
    const all = px, W = cv.width, H = cv.height;
    const nonPaper = px.filter(p => !(p[0] > 90 && chr(p) < 10));
    if (nonPaper.length > px.length * .08) px = nonPaper;
    const vivid = [];
    for (const thr of [34, 26, 18]) {
      const vp = px.filter(p => chr(p) > thr && p[0] > 22 && p[0] < 93);
      if (vp.length < Math.max(15, px.length * .003)) continue;
      const cand = kmeans(vp, 8).filter(([, n]) => n >= Math.max(8, px.length * .002)).sort((p, q) => q[1] ** .4 * chr(q[0]) - p[1] ** .4 * chr(p[0]));
      for (const [c] of cand) { if (vivid.length === 3) break; if (vivid.every(v => hdiff(c, v) > 28 || dE(c, v) > 38)) vivid.push(c.slice()); }
      if (vivid.length === 3) break;
    }
    vivid.forEach(v => { const ch = chr(v); if (ch > 62) { const k = (62 + (ch - 62) * .35) / ch; v[1] *= k; v[2] *= k; } });
    const order = kmeans(px, 14).sort((p, q) => q[1] - p[1]);
    const muted = [], need = 6 - vivid.length; let dk = 0, lt = 0;
    for (const gap of [20, 14, 9]) {
      for (const [c] of order) {
        if (muted.length === need) break;
        if (chr(c) > 30 || c[0] > 95 || (c[0] < 18 && dk) || (c[0] > 86 && lt)) continue;
        if ([...muted, ...vivid].every(m => dE(c, m) > gap)) { muted.push(c); dk += c[0] < 18; lt += c[0] > 86; }
      }
      if (muted.length === need) break;
    }
    for (const [c] of order) { if (muted.length >= need) break; if (c[0] <= 95 && [...muted, ...vivid].every(m => dE(c, m) > 8)) muted.push(c); }
    for (const [c] of order) { if (muted.length >= need) break; if (![...muted, ...vivid].includes(c)) muted.push(c); } // совсем однотонное фото
    muted.sort((p, q) => p[0] - q[0]);
    // где на фото стоит пипетка каждого цвета — ближайший по цвету пиксель
    return [...vivid, ...muted].slice(0, 6).map(c => {
      let bi = 0, bd = Infinity; all.forEach((p, i) => { const e = dE(p, c); if (e < bd) { bd = e; bi = i; } });
      return { hex: labHex(c), u: (bi % W + .5) / W, v: (Math.floor(bi / W) + .5) / H };
    });
  }
  let NAMES = null;
  const loadNames = () => NAMES ? Promise.resolve(NAMES) : fetch('/assets/palette-names.json').then(r => r.json()).then(n => (NAMES = n.map(x => [x, hexLab(x[3])])));
  // название — ближайшее из словаря палитр Полли, без повторов внутри палитры
  function nameOf(h, used) {
    const l = hexLab(h); let best = null, bd = Infinity;
    for (const [x, xl] of NAMES) if (!used.has(x[gi])) { const d = dE(l, xl); if (d < bd) { bd = d; best = x; } }
    return best; // [en, ru, lv, hex]
  }
  const setName = (c, e) => { c.nm = e; c.n = e[gi]; };
  function nameAll(cols) { const used = new Set(); cols.forEach(c => { setName(c, nameOf(c.hex, used)); used.add(c.n); }); return cols; }
  // пиксельная Полли для плашки сайта (как в блоке «Тема дня»)
  const PP = ['......ddd.....', '.....dbbbd....', '....dbbwwbd...', '....dbbwkbdoo.', '....dbbbbbdo..', '...dbbbbbbd...', '..dbbsbbbbd...',
    '.dbbssbbbbd...', 'dbbssbbbbbd...', 'dbbbbbbbbd....', '.ddbbbbbdd....', '...ddddd......', '....o..o......', '...oo.oo......'];
  const PC = { d: '#1a1528', b: '#7f81bf', s: '#5e5a9c', w: '#ffffff', k: '#1a1528', o: '#f2a73b' };
  const rr = (g, x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
  async function drawCard(img, cols, title) {
    await Promise.all(["600 80px Fraunces", "italic 400 28px Fraunces", "700 26px Karla", "500 21px Karla"].map(f => document.fonts ? document.fonts.load(f).catch(() => 0) : 0));
    const W = 1000, H = 1500, c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d'), BG = '#2A1B1F';
    g.fillStyle = BG; g.fillRect(0, 0, W, H);
    const AH = 760, s = Math.max(W / img.naturalWidth, AH / img.naturalHeight), iw = img.naturalWidth * s, ih = img.naturalHeight * s;
    g.save(); g.beginPath(); g.rect(0, 0, W, AH); g.clip(); g.drawImage(img, (W - iw) / 2, (AH - ih) / 2, iw, ih); g.restore();
    const gr = g.createLinearGradient(0, AH - 220, 0, AH); gr.addColorStop(0, 'rgba(42,27,31,0)'); gr.addColorStop(1, BG);
    g.fillStyle = gr; g.fillRect(0, AH - 220, W, 221);
    g.fillStyle = '#E9A72B'; g.font = '700 26px Karla, sans-serif'; if ('letterSpacing' in g) g.letterSpacing = '6px';
    g.fillText(T.kick[L].toUpperCase(), 70, 708);
    if ('letterSpacing' in g) g.letterSpacing = '0px';
    let fs = 80; g.font = `600 ${fs}px Fraunces, Georgia, serif`;
    while (g.measureText(title).width > 860 && fs > 40) g.font = `600 ${fs -= 4}px Fraunces, Georgia, serif`;
    g.fillStyle = '#FBF4E2'; g.fillText(title, 70, 790);
    cols.forEach((col, i) => {
      const x = 70 + (i % 3) * 294, y = 848 + Math.floor(i / 3) * 219;
      g.fillStyle = col.hex; rr(g, x, y, 272, 118, 14); g.fill();
      g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 2; g.stroke();
      g.fillStyle = '#FBF4E2'; g.font = '700 26px Karla, sans-serif'; g.fillText(col.n, x, y + 150, 272);
      g.fillStyle = '#C9B8B0'; g.font = '500 21px Karla, sans-serif'; if ('letterSpacing' in g) g.letterSpacing = '2px';
      g.fillText(col.hex, x, y + 186); if ('letterSpacing' in g) g.letterSpacing = '0px';
    });
    g.fillStyle = '#C9B8B0'; g.font = 'italic 400 28px Fraunces, Georgia, serif'; g.fillText(T.made[L], 70, 1440);
    // плашка сайта справа внизу: пиксельная Полли + адрес
    g.font = '700 26px Karla, sans-serif';
    const tw = g.measureText('pigeonpolly.com').width, bw = 30 + 42 + 14 + tw + 30, bh = 70, bx = W - 70 - bw, by = 1394;
    g.fillStyle = '#F0A987'; rr(g, bx, by, bw, bh, 35); g.fill();
    const ps = 3; PP.forEach((row, yy) => [...row].forEach((ch, xx) => { if (PC[ch]) { g.fillStyle = PC[ch]; g.fillRect(bx + 28 + xx * ps, by + 14 + yy * ps, ps, ps); } }));
    g.fillStyle = '#2A1B1F'; g.fillText('pigeonpolly.com', bx + 30 + 42 + 14, by + 44);
    return c;
  }
  function maker(o = {}) {
    const box = document.createElement('section'); box.className = 'pal-mk' + (o.adminOnly ? ' pal-mk-admin' : '');
    box.innerHTML = `<div class="pal-mk-txt"><h2>🎨 ${T.mkH[L]}</h2><p>${T.mkP[L]}</p>
      <label class="pill-btn pill-fill pal-mk-pick">${T.mkPick[L]}<input type="file" accept="image/*" hidden></label>
      <div class="pal-mk-opts" hidden><label>${T.mkName[L]} <input type="text" maxlength="40" value="${esc(T.mkDef[L])}"></label>
      <button type="button" class="pill-btn pill-fill" data-save>${T.mkSave[L]}</button></div><p class="pal-mk-msg" aria-live="polite"></p>
      <div class="pal-mk-edit" hidden><p class="pal-mk-tip">${T.mkTip[L]}</p><div class="pal-mk-photo"></div><button type="button" class="pill-btn" data-reset>${T.mkReset[L]}</button></div>
      <div class="pal-mk-ad" hidden><h3>${T.adH[L]}</h3>
        <label>${T.adSec[L]} <select data-g>${ADD_G.map(g => `<option value="${g}"${g === (o.gallery || 'sketchbook') ? ' selected' : ''}>${esc(G[g][gi])}</option>`).join('')}</select></label>
        ${['en', 'ru', 'lv'].map(l => `<label>${T.adT[L]} ${l.toUpperCase()} <input type="text" maxlength="80" data-t="${l}"></label>`).join('')}
        <button type="button" class="pill-btn pill-fill" data-add>${T.adGo[L]}</button><p class="pal-mk-admsg" aria-live="polite"></p></div></div>
      <div class="pal-mk-out"></div>`;
    if (o.adminOnly) { box.querySelector('h2').textContent = '➕ ' + T.adAdd[L].replace(/^➕\s*/, ''); box.querySelector('.pal-mk-txt > p').textContent = T.adHelp[L]; }
    const inp = box.querySelector('input[type=file]'), opts = box.querySelector('.pal-mk-opts'), name = box.querySelector('input[type=text]');
    const out = box.querySelector('.pal-mk-out'), msg = box.querySelector('.pal-mk-msg'), pick = box.querySelector('.pal-mk-pick');
    const edit = box.querySelector('.pal-mk-edit'), photo = box.querySelector('.pal-mk-photo');
    let img = null, cols = null, auto = null, canvas = null, timer = 0, sample = null, cur = 0;
    const render = () => drawCard(img, cols, name.value.trim() || T.mkDef[L]).then(c => { canvas = c; c.className = 'pal-mk-card'; out.replaceChildren(c); });
    const later = () => { clearTimeout(timer); timer = setTimeout(render, 200); };
    const ad = box.querySelector('.pal-mk-ad'), adMsg = box.querySelector('.pal-mk-admsg'), tIn = l => ad.querySelector(`[data-t="${l}"]`);
    let admin = false;
    isAdmin().then(a => { admin = a; if (a && img) ad.hidden = false; });
    // название на карточке = название на языке страницы (пока его не меняли вручную)
    const syncTitle = () => { const t = tIn(L); if (!t.dataset.own) t.value = name.value.trim(); };
    ['en', 'ru', 'lv'].forEach(l => tIn(l).addEventListener('input', e => { e.target.dataset.own = '1'; if (l === L) { name.value = e.target.value; later(); } }));
    name.oninput = () => { syncTitle(); later(); };
    const resized = (im, maxW, maxSide) => new Promise(res => {
      const s = Math.min(1, maxW / im.naturalWidth, maxSide / Math.max(im.naturalWidth, im.naturalHeight)), c = document.createElement('canvas');
      c.width = Math.round(im.naturalWidth * s); c.height = Math.round(im.naturalHeight * s); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      c.toBlob(b => res([b, c.width, c.height]), 'image/jpeg', .9);
    });
    box.querySelector('[data-add]').onclick = async e => {
      const t = ['en', 'ru', 'lv'].map(l => tIn(l).value.trim()), any = t.find(Boolean);
      if (!any) { adMsg.textContent = T.adNeedT[L]; return; }
      const btn = e.target; btn.disabled = true; adMsg.textContent = T.adBusy[L];
      try {
        const [full] = await resized(img, 2400, 2400), [thumb, w, h] = await resized(img, 800, 4000);
        const fd = new FormData(), gal = ad.querySelector('[data-g]').value;
        fd.append('full', full, 'full.jpg'); fd.append('thumb', thumb, 'thumb.jpg');
        fd.append('meta', JSON.stringify({ gallery: gal, w, h, title: t.map(x => x || any), colors: cols.map(c => [c.hex, c.nm[0], c.nm[1], c.nm[2]]) }));
        const r = await fetch('/api/admin/art', { method: 'POST', credentials: 'same-origin', body: fd });
        if (!r.ok) throw 0;
        const x = await r.json();
        if (x.extraMonth != null) { extra.queue.splice(x.extraMonth, 0, x.item.key); }
        adMsg.textContent = (x.item.palette ? T.adOk[L] : T.adOkAi[L]) + (x.extraMonth != null ? ` ${T.adExtra[L]} ${monthName(x.extraMonth)}`.replace(/\.?$/, '.') : '');
        if (data && x.item.palette) data.unshift(x.item);
        document.dispatchEvent(new CustomEvent('pp:art-added', { detail: x.item }));
      } catch (err) { adMsg.textContent = T.adErr[L]; }
      btn.disabled = false;
    };
    // пипетки: фото с 6 кружками; тянем кружок (или выбираем его и тапаем по фото) — цвет берётся из этой точки
    function pickAt(u, v) {
      const { data, w, h } = sample, x0 = Math.min(w - 1, Math.max(0, Math.floor(u * w))), y0 = Math.min(h - 1, Math.max(0, Math.floor(v * h)));
      let r = 0, g = 0, b = 0, n = 0;
      for (let y = Math.max(0, y0 - 2); y <= Math.min(h - 1, y0 + 2); y++) for (let x = Math.max(0, x0 - 2); x <= Math.min(w - 1, x0 + 2); x++) { const i = (y * w + x) * 4; r += data[i]; g += data[i + 1]; b += data[i + 2]; n++; }
      const hex = '#' + [r, g, b].map(c => Math.round(c / n).toString(16).padStart(2, '0')).join('').toUpperCase();
      const c = cols[cur]; c.hex = hex; c.u = u; c.v = v;
      setName(c, nameOf(hex, new Set(cols.filter((_, i) => i !== cur).map(x => x.n))));
      drawPins(); later();
    }
    function drawPins() {
      photo.querySelectorAll('.pal-pin').forEach((el, i) => {
        const c = cols[i]; el.style.left = c.u * 100 + '%'; el.style.top = c.v * 100 + '%'; el.style.setProperty('--c', c.hex);
        el.classList.toggle('on', i === cur); el.title = `${c.n} ${c.hex}`;
      });
    }
    function setupPhoto(im) {
      const s = Math.min(1, 800 / Math.max(im.naturalWidth, im.naturalHeight)), cv = document.createElement('canvas');
      cv.width = Math.max(1, Math.round(im.naturalWidth * s)); cv.height = Math.max(1, Math.round(im.naturalHeight * s));
      const g = cv.getContext('2d'); g.drawImage(im, 0, 0, cv.width, cv.height);
      sample = { data: g.getImageData(0, 0, cv.width, cv.height).data, w: cv.width, h: cv.height };
      const view = new Image(); view.src = im.src; view.alt = ''; view.draggable = false;
      photo.replaceChildren(view, ...cols.map((c, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'pal-pin'; b.textContent = i + 1; b.setAttribute('aria-label', T.mkPin[L] + ' ' + (i + 1)); return b; }));
      cur = 0; drawPins();
      const pos = e => { const r = view.getBoundingClientRect(); return [Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))]; };
      let drag = false;
      photo.onpointerdown = e => {
        const pin = e.target.closest('.pal-pin');
        if (pin) { cur = [...photo.querySelectorAll('.pal-pin')].indexOf(pin); drawPins(); drag = true; photo.setPointerCapture(e.pointerId); e.preventDefault(); return; }
        if (e.target === view) { e.preventDefault(); pickAt(...pos(e)); drag = true; photo.setPointerCapture(e.pointerId); }
      };
      photo.onpointermove = e => { if (drag) pickAt(...pos(e)); };
      photo.onpointerup = photo.onpointercancel = () => { drag = false; };
      photo.onkeydown = e => { // стрелками двигаем выбранную пипетку
        const k = { ArrowLeft: [-.01, 0], ArrowRight: [.01, 0], ArrowUp: [0, -.01], ArrowDown: [0, .01] }[e.key]; if (!k) return;
        const pin = e.target.closest('.pal-pin'); if (!pin) return;
        cur = [...photo.querySelectorAll('.pal-pin')].indexOf(pin); e.preventDefault();
        pickAt(Math.min(1, Math.max(0, cols[cur].u + k[0])), Math.min(1, Math.max(0, cols[cur].v + k[1])));
      };
    }
    box.querySelector('[data-reset]').onclick = () => { cols = auto.map(c => ({ ...c })); drawPins(); render(); };
    inp.onchange = () => {
      const f = inp.files[0]; if (!f) return;
      msg.textContent = T.mkWait[L];
      const url = URL.createObjectURL(f), im = new Image();
      im.onload = () => loadNames().then(() => {
        img = im; auto = nameAll(extract(im)); cols = auto.map(c => ({ ...c }));
        setupPhoto(im); edit.hidden = false; name.value = T.mkDef[L];
        const base = f.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();
        if (base && !/^(img|dsc|photo|image|pxl|screenshot)\b/i.test(base) && !/^\d/.test(base)) name.value = base.slice(0, 40);
        opts.hidden = false; pick.firstChild.textContent = T.mkOther[L]; msg.textContent = '';
        ['en', 'ru', 'lv'].forEach(l => { tIn(l).value = ''; delete tIn(l).dataset.own; }); syncTitle(); adMsg.textContent = ''; if (admin) ad.hidden = false;
        return render();
      }).catch(() => { msg.textContent = T.mkErr[L]; });
      im.onerror = () => { msg.textContent = T.mkErr[L]; URL.revokeObjectURL(url); };
      im.src = url; inp.value = '';
    };
    box.querySelector('[data-save]').onclick = () => canvas && canvas.toBlob(b => {
      const a = document.createElement('a'); a.href = URL.createObjectURL(b);
      a.download = 'palette-' + (name.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'pigeonpolly') + '.jpg';
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }, 'image/jpeg', .92);
    return box;
  }
  // страница «Палитры»
  const app = document.getElementById('pal-app');
  if (app) load().then(d0 => {
    let d = d0;
    const bar = document.createElement('div'); bar.className = 'pal-bar'; bar.setAttribute('role', 'toolbar');
    const grid = document.createElement('div'); grid.className = 'pal-grid';
    let f = 'all';
    const draw = () => { grid.innerHTML = ''; d.filter(p => f === 'all' || p.gallery === f).forEach(p => grid.appendChild(card(p))); bar.querySelectorAll('[data-g]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.g === f))); };
    const gs = ['all', ...new Set(d.map(p => p.gallery))];
    bar.innerHTML = gs.map(g => `<button type="button" class="pill-btn" data-g="${g}">${g === 'all' ? T.allG[L] : esc(G[g] ? G[g][gi] : g)}</button>`).join('') + `<button type="button" class="pill-btn pill-fill" data-rnd>${T.random[L]}</button>`;
    bar.querySelectorAll('[data-g]').forEach(b => b.onclick = () => { f = b.dataset.g; draw(); });
    bar.querySelector('[data-rnd]').onclick = () => { f = 'all'; draw(); const c = grid.children[Math.floor(Math.random() * grid.children.length)]; c.scrollIntoView({ behavior: 'smooth', block: 'center' }); c.classList.remove('flash'); void c.offsetWidth; c.classList.add('flash'); };
    app.append(maker(), bar, grid); draw();
    document.addEventListener('pp:art-added', e => { if (e.detail.palette) { d = data; f = 'all'; draw(); } });
    const h = decodeURIComponent(location.hash.slice(1)), t = h && document.getElementById(h);
    if (t) setTimeout(() => { t.scrollIntoView({ block: 'center' }); t.classList.add('flash'); }, 60);
  });
  // галереи «Мой скетчбук»: картины, добавленные с сайта (новые — первыми), и для админа — «➕ Добавить картину» и 🗑
  const gal = document.querySelector('.gallery[data-gallery]');
  if (gal && ADD_G.includes(gal.dataset.gallery)) {
    const name = gal.dataset.gallery;
    const fig = p => {
      const f = document.createElement('figure'); f.dataset.added = p.key;
      f.innerHTML = `<a href="/${esc(p.img)}" data-lightbox><img src="/${esc(p.thumb)}" width="${p.w}" height="${p.h}" alt="${esc(p.title[L])}" loading="lazy" decoding="async"></a><figcaption>${esc(p.title[L])}</figcaption>`;
      isAdmin().then(a => { if (!a) return; const b = document.createElement('button'); b.type = 'button'; b.className = 'pal-del'; b.textContent = '🗑'; b.title = T.adDel[L]; b.onclick = () => delArt(p.key, f); f.appendChild(b); });
      return f;
    };
    getAdded().then(x => x.added.filter(p => p.gallery === name).reverse().forEach(p => gal.prepend(fig(p))));
    document.addEventListener('pp:art-added', e => { if (e.detail.gallery === name) gal.prepend(fig(e.detail)); });
    isAdmin().then(a => {
      if (!a) return;
      const wrap = document.createElement('div'); wrap.className = 'pal-adm-wrap';
      const open = document.createElement('button'); open.type = 'button'; open.className = 'pill-btn pill-fill'; open.textContent = T.adAdd[L];
      let mk = null;
      open.onclick = () => { if (!mk) { mk = maker({ adminOnly: true, gallery: name }); wrap.appendChild(mk); } else mk.hidden = !mk.hidden; };
      wrap.appendChild(open); gal.before(wrap);
    });
  }
  // кнопка 🎨 в челлендже: случайная палитра в окне
  const btn = document.getElementById('ch-pal-btn');
  if (btn) btn.onclick = () => load().then(d => {
    const dlg = document.createElement('div'); dlg.className = 'pal-modal'; dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true');
    const box = document.createElement('div'); box.className = 'pal-modal-box';
    const close = () => { dlg.remove(); removeEventListener('keydown', key); };
    const key = e => { if (e.key === 'Escape') close(); };
    const show = () => {
      const p = d[Math.floor(Math.random() * d.length)];
      box.innerHTML = `<button type="button" class="pal-x" aria-label="${T.close[L]}">✕</button><h2>🎨 ${T.title[L]}</h2><p class="pal-hint">${T.hint[L]}</p>`;
      box.appendChild(card(p, true));
      const act = document.createElement('div'); act.className = 'pal-act';
      act.innerHTML = `<button type="button" class="pill-btn pill-fill" data-more>${T.another[L]}</button><a class="pill-btn" href="${pre}/palettes/#${p.key}">${T.all[L]}</a>`;
      box.appendChild(act);
      box.querySelector('.pal-x').onclick = close; act.querySelector('[data-more]').onclick = show;
    };
    show(); dlg.appendChild(box); dlg.onclick = e => { if (e.target === dlg) close(); }; addEventListener('keydown', key);
    document.body.appendChild(dlg); box.querySelector('.pal-x').focus();
  });
})();
