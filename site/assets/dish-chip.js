// Значок действующего блюда с кухни в играх и огороде (этап 89, docs/bird.md «Кухня: книга рецептов»).
// Блюдо приходит в /api/whoami → user.dish (worker/kitchen.js dishOf); рисунок и название — из site/assets/cookbook.js (грузится сам, только если блюдо есть).
// Показывается, только если блюдо действует на этой странице: btn — своя игра или все, seed — во всех играх, grow — в огороде. Встаёт в конец .page-head.
(function () {
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0;
  const pre = ['', '/ru', '/lv'][L];
  const PAGE = [[/\/rain\/?$/, 'game'], [/\/potions\/?$/, 'potion'], [/\/pancakes\/?$/, 'pan'], [/\/titos\/?$/, 'titos'], [/\/shift\/?$/, 'shift'], [/\/garden\/?$/, 'garden']];
  const here = (PAGE.find(([re]) => re.test(location.pathname)) || [])[1];
  if (!here) return;
  const T = {
    btn: ['{p} % 🔘 here', '{p} % 🔘 здесь', '{p} % 🔘 šeit'],
    seed: ['seeds drop more often', 'семечки выпадают чаще', 'sēklas krīt biežāk'],
    grow: ['watering: +{p} h of growth', 'полив: +{p} ч роста', 'laistīšana: +{p} h augšanas'],
    left: ['{t} left', 'ещё {t}', 'vēl {t}'],
    h: ['h', 'ч', 'h'], m: ['min', 'мин', 'min'],
    title: ['A dish from Polly’s kitchen is working — open the kitchen', 'Действует блюдо с кухни — открыть кухню', 'Darbojas ēdiens no virtuves — atvērt virtuvi'],
  };
  const t = (k, o) => { let s = T[k][L]; if (o) for (const [a, b] of Object.entries(o)) s = s.replace('{' + a + '}', b); return s; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const dur = ms => { const m = Math.max(1, Math.round(ms / 60000)); return m >= 60 ? Math.floor(m / 60) + ' ' + t('h') + (m % 60 ? ' ' + m % 60 + ' ' + t('m') : '') : m + ' ' + t('m'); };
  const works = d => d && d.until > Date.now() && (here === 'garden' ? d.t === 'grow' : d.t === 'seed' || (d.t === 'btn' && (d.g || []).includes(here)));
  let el = null, dish = null, timer = 0;
  const lib = () => window.PPCookbook ? Promise.resolve() : new Promise(ok => { const s = document.createElement('script'); s.src = '/assets/cookbook.js'; s.onload = s.onerror = () => ok(); document.head.appendChild(s); });
  function css() {
    if (document.getElementById('dish-chip-css')) return;
    const s = document.createElement('style'); s.id = 'dish-chip-css';
    s.textContent = `.dish-chip{display:inline-flex;align-items:center;gap:8px;margin:8px 0 0;padding:4px 12px 4px 4px;border-radius:999px;border:2px solid #5E9E3A;background:#E8F5DC;color:#2B1A51;font-size:14px;line-height:1.25;text-decoration:none;max-width:100%}
.dish-chip.bad{border-color:#C8553D;background:#FBE4DE}.dish-chip img{width:42px;height:32px;image-rendering:pixelated;background:#FFF8E8;border-radius:999px;flex:none}
.dish-chip b{font-weight:700}.dish-chip small{opacity:.75;white-space:nowrap}.dish-chip:hover{filter:brightness(.97)}`;
    document.head.appendChild(s);
  }
  async function draw() {
    clearTimeout(timer);
    if (!works(dish)) { if (el) el.remove(); el = null; return; }
    await lib();
    const head = document.querySelector('.page-head'), gd = document.getElementById('garden'); // в огороде шапки нет — значок над сценой
    if ((!head && !gd) || !window.PPCookbook) return;
    css();
    const C = window.PPCookbook, bad = dish.pct < 0 && dish.t === 'btn', q = dish.q === 'raw' || dish.q === 'burnt' ? dish.q : '';
    const name = C.DISH[dish.r] ? C.DISH[dish.r][0][L] : dish.r;
    const eff = dish.t === 'grow' ? t('grow', { p: dish.pct }) : dish.t === 'seed' ? t('seed') : t('btn', { p: (dish.pct > 0 ? '+' : '−') + Math.round(Math.abs(dish.pct)) });
    if (!el) { el = document.createElement('a'); el.className = 'dish-chip'; if (head) head.appendChild(el); else gd.parentNode.insertBefore(el, gd); }
    el.href = pre + '/bird/#room'; el.title = t('title'); el.classList.toggle('bad', bad);
    el.innerHTML = `<img src="${C.dishPic(dish.r, q)}" alt="" width="42" height="32"><span>🍳 ${esc(name)}: <b>${eff}</b> <small>· ${t('left', { t: dur(dish.until - Date.now()) })}</small></span>`;
    timer = setTimeout(draw, 30000);
  }
  const take = w => { dish = w && w.user ? w.user.dish || null : null; draw(); };
  document.addEventListener('pp:whoami', e => take(e.detail));
  if (window.PPWho) take(window.PPWho);
})();
