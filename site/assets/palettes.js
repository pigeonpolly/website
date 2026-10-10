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
    kick: { en: 'Color palette', ru: 'Палитра', lv: 'Krāsu palete' },
    made: { en: 'made with Pigeon Polly', ru: 'сделано с Pigeon Polly', lv: 'veidots ar Pigeon Polly' },
  };
  const G = { bird: ['Pigeon Polly', 'Pigeon Polly', 'Pigeon Polly'], snail: ['Mr.Chew', 'Mr.Chew', 'Mr.Chew'], sketchbook: ['Sketchbook', 'Скетчбук', 'Skiču burtnīca'],
    halloween: ['Pumpkin Family', 'Тыквенная семья', 'Ķirbju ģimene'], detective: ['Mr.Titos', 'Мистер Титос', 'Mr.Titos'], anxiety: ['Anxiety', 'Тревога', 'Trauksme'], challenge: ['Challenge', 'Челлендж', 'Izaicinājums'] };
  const gi = { en: 0, ru: 1, lv: 2 }[L], pre = L === 'en' ? '' : '/' + L;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const toast = m => window.PPToast ? window.PPToast(m) : null;
  const copy = (txt, msg) => (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast(msg || T.copy[L] + ': ' + txt)).catch(() => prompt('', txt));
  const ink = h => { const n = parseInt(h.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255; return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#1B1820' : '#FFFFFF'; };
  let data = null;
  const load = () => data ? Promise.resolve(data) : fetch('/assets/palettes.json').then(r => r.json()).then(d => (data = d));
  function card(p, big) {
    const el = document.createElement('article'); el.className = 'pal-card' + (big ? ' big' : ''); el.id = p.key;
    el.innerHTML = `<a class="pal-img" href="/${esc(p.img)}" target="_blank" rel="noopener"><img src="/${esc(p.thumb)}" alt="${esc(p.title[L])}" loading="lazy" width="${p.w}" height="${p.h}"></a>
      <div class="pal-body"><h3>${esc(p.title[L])}</h3><small>${esc(G[p.gallery] ? G[p.gallery][gi] : p.gallery)}</small>
      <ul class="pal-sw">${p.colors.map(c => `<li><button type="button" data-hex="${c.hex}" style="--c:${c.hex};--i:${ink(c.hex)}" title="${esc(c[L])} ${c.hex}"><i></i><b>${esc(c[L])}</b><code>${c.hex}</code></button></li>`).join('')}</ul>
      <div class="pal-act"><button type="button" class="pill-btn" data-all>${T.copyAll[L]}</button></div></div>`;
    el.querySelectorAll('[data-hex]').forEach(b => b.onclick = () => copy(b.dataset.hex));
    el.querySelector('[data-all]').onclick = () => copy(p.colors.map(c => c.hex).join(' '), T.copy[L] + ' ✓');
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
    return [...vivid, ...muted].slice(0, 6).map(c => labHex(c));
  }
  let NAMES = null;
  const loadNames = () => NAMES ? Promise.resolve(NAMES) : fetch('/assets/palette-names.json').then(r => r.json()).then(n => (NAMES = n.map(x => [x, hexLab(x[3])])));
  function nameAll(hexes) {
    const used = new Set();
    return hexes.map(h => {
      const l = hexLab(h); let best = null, bd = Infinity;
      for (const [x, xl] of NAMES) if (!used.has(x[0])) { const d = dE(l, xl); if (d < bd) { bd = d; best = x; } }
      used.add(best[0]); return { hex: h, n: best[gi] };
    });
  }
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
  function maker() {
    const box = document.createElement('section'); box.className = 'pal-mk';
    box.innerHTML = `<div class="pal-mk-txt"><h2>🎨 ${T.mkH[L]}</h2><p>${T.mkP[L]}</p>
      <label class="pill-btn pill-fill pal-mk-pick">${T.mkPick[L]}<input type="file" accept="image/*" hidden></label>
      <div class="pal-mk-opts" hidden><label>${T.mkName[L]} <input type="text" maxlength="40" value="${esc(T.mkDef[L])}"></label>
      <button type="button" class="pill-btn pill-fill" data-save>${T.mkSave[L]}</button></div><p class="pal-mk-msg" aria-live="polite"></p></div>
      <div class="pal-mk-out"></div>`;
    const inp = box.querySelector('input[type=file]'), opts = box.querySelector('.pal-mk-opts'), name = box.querySelector('input[type=text]');
    const out = box.querySelector('.pal-mk-out'), msg = box.querySelector('.pal-mk-msg'), pick = box.querySelector('.pal-mk-pick');
    let img = null, cols = null, canvas = null, timer = 0;
    const render = () => drawCard(img, cols, name.value.trim() || T.mkDef[L]).then(c => { canvas = c; c.className = 'pal-mk-card'; out.replaceChildren(c); });
    name.oninput = () => { clearTimeout(timer); timer = setTimeout(render, 250); };
    inp.onchange = () => {
      const f = inp.files[0]; if (!f) return;
      msg.textContent = T.mkWait[L];
      const url = URL.createObjectURL(f), im = new Image();
      im.onload = () => loadNames().then(() => {
        img = im; cols = nameAll(extract(im));
        const base = f.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();
        if (base && !/^(img|dsc|photo|image|pxl|screenshot)\b/i.test(base) && !/^\d/.test(base)) name.value = base.slice(0, 40);
        opts.hidden = false; pick.firstChild.textContent = T.mkOther[L]; msg.textContent = '';
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
  if (app) load().then(d => {
    const bar = document.createElement('div'); bar.className = 'pal-bar'; bar.setAttribute('role', 'toolbar');
    const grid = document.createElement('div'); grid.className = 'pal-grid';
    let f = 'all';
    const draw = () => { grid.innerHTML = ''; d.filter(p => f === 'all' || p.gallery === f).forEach(p => grid.appendChild(card(p))); bar.querySelectorAll('[data-g]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.g === f))); };
    const gs = ['all', ...new Set(d.map(p => p.gallery))];
    bar.innerHTML = gs.map(g => `<button type="button" class="pill-btn" data-g="${g}">${g === 'all' ? T.allG[L] : esc(G[g] ? G[g][gi] : g)}</button>`).join('') + `<button type="button" class="pill-btn pill-fill" data-rnd>${T.random[L]}</button>`;
    bar.querySelectorAll('[data-g]').forEach(b => b.onclick = () => { f = b.dataset.g; draw(); });
    bar.querySelector('[data-rnd]').onclick = () => { f = 'all'; draw(); const c = grid.children[Math.floor(Math.random() * grid.children.length)]; c.scrollIntoView({ behavior: 'smooth', block: 'center' }); c.classList.remove('flash'); void c.offsetWidth; c.classList.add('flash'); };
    app.append(maker(), bar, grid); draw();
    const h = decodeURIComponent(location.hash.slice(1)), t = h && document.getElementById(h);
    if (t) setTimeout(() => { t.scrollIntoView({ block: 'center' }); t.classList.add('flash'); }, 60);
  });
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
