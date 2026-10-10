// Палитры из артов: страница «Палитры» (#pal-app) и кнопка 🎨 в челлендже (#ch-pal-btn). Данные — /assets/palettes.json (tools/palettes.py)
(() => {
  const L = { ru: 'ru', lv: 'lv' }[document.documentElement.lang] || 'en';
  const T = {
    copy: { en: 'Copied', ru: 'Скопировано', lv: 'Nokopēts' },
    copyAll: { en: 'Copy all HEX', ru: 'Скопировать все HEX', lv: 'Kopēt visus HEX' },
    pin: { en: 'Save to Pinterest', ru: 'Сохранить в Pinterest', lv: 'Saglabāt Pinterest' },
    another: { en: '🎲 Another palette', ru: '🎲 Другая палитра', lv: '🎲 Cita palete' },
    all: { en: 'All palettes →', ru: 'Все палитры →', lv: 'Visas paletes →' },
    title: { en: 'Palette for inspiration', ru: 'Палитра для вдохновения', lv: 'Palete iedvesmai' },
    hint: { en: 'Draw today’s theme with these colors. Tap a color to copy its code.', ru: 'Нарисуйте тему дня этими цветами. Нажмите на цвет, чтобы скопировать код.', lv: 'Uzzīmē dienas tēmu šajās krāsās. Pieskaries krāsai, lai nokopētu kodu.' },
    from: { en: 'from', ru: 'из картины', lv: 'no darba' },
    close: { en: 'Close', ru: 'Закрыть', lv: 'Aizvērt' },
    allG: { en: 'All', ru: 'Все', lv: 'Visas' },
    random: { en: '🎲 Surprise me', ru: '🎲 Случайная', lv: '🎲 Pārsteidz mani' },
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
      <div class="pal-act"><button type="button" class="pill-btn" data-all>${T.copyAll[L]}</button>${big ? '' : `<a class="pill-btn" target="_blank" rel="noopener" href="https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(location.origin + pre + '/palettes/#' + p.key)}&media=${encodeURIComponent(location.origin + '/' + p.img)}&description=${encodeURIComponent(p.title.en + ' color palette by Pigeon Polly: ' + p.colors.map(c => c.en + ' ' + c.hex).join(', '))}">📌 ${T.pin[L]}</a>`}</div></div>`;
    el.querySelectorAll('[data-hex]').forEach(b => b.onclick = () => copy(b.dataset.hex));
    el.querySelector('[data-all]').onclick = () => copy(p.colors.map(c => c.hex).join(' '), T.copy[L] + ' ✓');
    return el;
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
    app.append(bar, grid); draw();
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
