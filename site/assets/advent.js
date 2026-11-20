// Адвент «Улица 31 окошка» (/advent/): дизайн Алины, данные — /api/advent.
(() => {
  const app = document.getElementById('advw');
  if (!app) return;
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0, LG = ['en', 'ru', 'lv'][L];
  const T = {
    signin: ['Sign in to open the windows', 'Войдите, чтобы открывать окошки', 'Ienāc, lai atvērtu lodziņus'],
    soon: ['Not yet! This window opens on December {d}.', 'Ещё рано! Это окошко откроется {d} декабря.', 'Vēl par agru! Šis lodziņš atvērsies {d}. decembrī.'],
    late: ['24 and 31 December can only be opened on the day.', 'Окна 24 и 31 декабря открываются только в свой день.', '24. un 31. decembri var atvērt tikai tajā dienā.'],
    over: ['This year’s calendar is over. See you in December!', 'Календарь этого года закончился. До встречи в декабре!', 'Šī gada kalendārs ir beidzis. Tiekamies decembrī!'],
    gift: ['A gift for your bird', 'Подарок для птички', 'Dāvana putniņam'],
    inBag: ['already in your bag', 'уже в сумке', 'jau somā'],
    buttons: ['Buttons inside', 'Внутри пуговки', 'Iekšā pogas'],
    download: ['Download', 'Скачать', 'Lejupielādēt'],
    view: ['Open', 'Посмотреть', 'Atvērt'],
    admin: ['What is inside this window', 'Что лежит в этом окне', 'Kas ir šajā lodziņā'],
    empty: ['Empty window — buttons inside', 'Пустое окно — внутри пуговки', 'Tukšs lodziņš — iekšā pogas'],
    toAdmin: ['Advent in the admin panel →', 'Адвент в кабинете →', 'Advente kabinetā →'],
    err: ['Could not open, please try again.', 'Не получилось открыть, попробуйте ещё раз.', 'Neizdevās atvērt, mēģini vēlreiz.'],
    lit: ['Lit', 'Зажжено', 'Iedegts'],
    of: ['of 31 · windows to Christmas', 'из 31 · окошек до Рождества', 'no 31 · lodziņi līdz Ziemassvētkiem'],
  };
  const t = k => T[k][L];
  const LATE = [24, 31];
  let S = null, skew = 0, opened = {}, planBy = {}, pastBy = {};

  const HOUSES = [
    { c: '#B4473D', w: 200, roof: 'step', attic: 6, rows: [[1, 2], [3, 4], [5]], chim: 1 },
    { c: '#F1E3C8', w: 236, roof: 'tri', attic: 12, rows: [[7, 8, 9], [10, 11]], rc: '#2C5F4B', chim: 1 },
    { church: 1, c: '#EDE6DA', w: 250 },
    { c: '#3E6B5A', w: 200, roof: 'step', attic: 19, rows: [[13, 14], [15, 16], [17, 18]] },
    { c: '#E3B95A', w: 184, roof: 'tri', rows: [[20, 21], [22, 23]], rc: '#8E1A22', chim: 1 },
    { c: '#5B7FA3', w: 200, roof: 'round', rows: [[25, 26], [27, 28], [29, 30]], rc: '#2C5F4B' },
  ];
  const FIR = `<svg viewBox="0 0 70 120"><rect x="31" y="104" width="8" height="16" fill="#5A3420"/><path d="M35 4 L58 44 H46 L64 76 H50 L68 106 H2 L20 76 H6 L24 44 H12Z" fill="#23503F"/><path d="M35 4 L46 24 H24Z M24 44 h22 l-6-8 h-10z M20 76 h30 l-5-7 h-20z M2 106 h66 l-4-6 h-58z" fill="#fff" opacity=".9"/><circle cx="30" cy="60" r="3" fill="#E9C46A"/><circle cx="44" cy="88" r="3" fill="#C8463C"/></svg>`;
  const ROOSTER = `<svg viewBox="0 0 80 110" width="66" height="90" style="position:absolute;left:50%;top:-112px;transform:translateX(-50%);overflow:visible;filter:drop-shadow(0 0 8px rgba(233,196,106,.7))"><g style="transform-origin:40px 104px;animation:aw-swing 5s ease-in-out infinite"><path d="M40 104 V58" stroke="#C9A227" stroke-width="3"/><circle cx="40" cy="74" r="5" fill="#E9C46A" stroke="#8C6A12" stroke-width="1.5"/><path d="M14 66 H66 M58 61 L68 66 L58 71 M14 62 L20 66 L14 70" stroke="#C9A227" stroke-width="2.5" fill="none" stroke-linejoin="round"/><path d="M30 56 C24 50 20 40 22 30 C24 22 30 18 36 20 C38 14 42 10 48 10 C54 10 56 16 54 20 L60 22 L54 26 C56 32 54 40 50 46 C56 44 60 38 60 30 C66 34 66 44 62 50 C58 56 50 58 42 58 Z" fill="#E9C46A" stroke="#8C6A12" stroke-width="2" stroke-linejoin="round"/><circle cx="49" cy="16" r="1.8" fill="#2A211C"/></g></svg>`;

  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function load() {
    fetch('/api/advent', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).then(d => {
      if (!d) throw 0;
      S = d; skew = d.now - Date.now(); build(); draw();
    }).catch(() => { app.style.display = 'none'; });
  }
  function build() {
    opened = {}; (S.opened || []).forEach(o => opened[o.day] = o);
    planBy = {}; (S.plan || []).forEach(p => (planBy[p.day] = planBy[p.day] || []).push(p));
    pastBy = {}; (S.past || []).forEach(p => (pastBy[p.day] = pastBy[p.day] || []).push([p.kind, p.item]));
  }
  const claimable = d => !!S.user && d <= (S.claimTo || 0) && !opened[d] && (!LATE.includes(d) || d === S.today);
  function stateOf(d) {
    if (opened[d]) return 'open';
    if (d === S.today) return 'today';
    if (claimable(d)) return 'ready';
    return 'lock';
  }
  const isFile = it => it && it.kind === 'file';
  function fileOf(item) { try { return JSON.parse(item); } catch (e) { return null; } }
  function itemsOf(d, admin) {
    if (admin && planBy[d]) return planBy[d].map(p => [p.kind, p.item]);
    if (opened[d]) {
      const o = opened[d];
      if (o.kind === 'file') return (o.got && o.got.length ? o.got : [o.item]).map(x => ['file', x]);
      if (o.kind) return (o.got || [[o.kind, o.item]]).map(x => Array.isArray(x) ? x : [x.kind, x.item]);
      return [];
    }
    return pastBy[d] || [];
  }

  // ---------- окна ----------
  function win(d, extra) {
    const s = stateOf(d), sp = (S.special || []).includes(d);
    const items = itemsOf(d, false);
    let inner = '';
    if (s === 'open' && items.length) {
      const [k, v] = items[0];
      if (k === 'file') { const f = fileOf(v); if (f && f.p) inner = `<img class="fpic" src="${esc(f.p)}" alt=""><span class="fbadge">${esc((f.n || '').split('.').pop().toUpperCase())}</span>`; }
      else inner = '<span class="gift">🎁</span>';
    }
    return `<button class="win ${s}${sp ? ' sp' : ''}${d === 24 ? ' d24' : ''}${d === 31 ? ' d31' : ''} ${extra || ''}" data-d="${d}" aria-label="${d}">
      <span class="glass">${inner}${s === 'today' ? '<span class="candle"></span>' : ''}</span>
      <span class="sh l"></span><span class="sh r"></span><span class="bow"><i><b></b></i></span><span class="sill"></span><span class="key">${d}</span></button>`;
  }
  const chimney = (x, y) => `<rect x="${x}" y="${y}" width="16" height="30" fill="#6B3A2A"/><rect x="${x - 3}" y="${y - 4}" width="22" height="6" rx="2" fill="#fff"/>`;
  function roofSvg(h) {
    const rc = h.rc || '#7E141B';
    if (h.roof === 'step') return `<svg viewBox="0 0 200 120">${h.chim ? chimney(150, 10) : ''}<path d="M0 120 V78 H20 V58 H40 V38 H60 V18 H140 V38 H160 V58 H180 V78 H200 V120Z" fill="${h.c}"/><path d="M0 78 H20 V58 H40 V38 H60 V18 H140 V38 H160 V58 H180 V78 H200" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round"/><circle cx="100" cy="6" r="3" fill="#E9C46A"/></svg>`;
    if (h.roof === 'round') return `<svg viewBox="0 0 200 92"><path d="M0 92 V62 Q100 -18 200 62 V92Z" fill="${rc}"/><path d="M8 60 Q100 -12 192 60" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/><circle cx="100" cy="46" r="10" fill="#F4EFE6"/></svg>`;
    return `<svg viewBox="0 0 200 104">${h.chim ? chimney(140, 24) : ''}<path d="M-6 104 L100 12 L206 104Z" fill="${rc}"/><path d="M8 94 L100 18 L192 94" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  function house(h) {
    if (h.church) return `<div class="house church" style="width:${h.w}px">
      <div style="position:relative;height:170px;width:100%;display:grid;place-items:end center">
        <svg viewBox="0 0 250 170" style="position:absolute;inset:0;width:100%;height:100%"><path d="M90 170 V84 L125 0 L160 84 V170Z" fill="#2C5F4B"/><path d="M93 84 L125 8 L157 84" fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="round"/><rect x="86" y="80" width="78" height="8" rx="2" fill="#E3DACB"/><path d="M60 170 L90 120 H160 L190 170Z" fill="#8E1A22"/><path d="M66 166 L92 124 H158 L184 166" fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="round"/></svg>
        <div style="position:relative;margin-bottom:46px">${win(31, 'd31')}${ROOSTER}</div>
      </div>
      <div class="facade" style="--c:${h.c};padding-top:48px"><div class="ground" style="gap:22px">
        <span style="width:30px;height:60px;border-radius:15px 15px 0 0;background:linear-gradient(160deg,#3A5174,#22334F);box-shadow:0 0 0 4px var(--frame);align-self:center;margin-bottom:30px"></span>
        ${win(24, 'd24')}
        <span style="width:30px;height:60px;border-radius:15px 15px 0 0;background:linear-gradient(160deg,#3A5174,#22334F);box-shadow:0 0 0 4px var(--frame);align-self:center;margin-bottom:30px"></span>
      </div><span class="step"></span></div></div>`;
    const rows = h.rows.map((r, i) => i === h.rows.length - 1
      ? `<div class="ground">${r.map(d => win(d)).join('')}<span class="door"><i></i></span></div>`
      : `<div class="row">${r.map(d => win(d)).join('')}</div>`).join('');
    const smoke = h.chim ? `<span class="smoke" style="left:${h.roof === 'step' ? 78 : 73}%;top:-6px"></span><span class="smoke" style="left:${h.roof === 'step' ? 78 : 73}%;top:-6px;animation-delay:1.3s"></span>` : '';
    return `<div class="house"><div class="roof">${smoke}${roofSvg(h)}${h.attic ? `<div class="attic" style="bottom:${h.roof === 'step' ? 30 : 18}px">${win(h.attic)}</div>` : ''}</div>
      <div class="facade" style="--c:${h.c}">${rows}<span class="step"></span></div></div>`;
  }

  // ---------- гирлянда ----------
  function garland() {
    const g = document.getElementById('garland');
    if (!g) return;
    let gs = '<path d="M0 6 Q 112 34 225 8 T 450 8 T 675 8 T 900 6" fill="none" stroke="#5A6478" stroke-width="2" vector-effect="non-scaling-stroke"/>';
    const col = ['#FFD77A', '#FF8A7A', '#9FE3C1'];
    for (let i = 1; i <= 31; i++) {
      const x = 8 + (i - 1) * (884 / 30), y = 7 + 12 * Math.abs(Math.sin((x / 225) * Math.PI));
      const on = !!opened[i], c = col[i % 3];
      gs += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><rect x="-2.5" y="0" width="5" height="4" fill="#5A6478"/>${on ? `<circle cx="0" cy="10" r="10" fill="${c}" opacity=".25"/>` : ''}<ellipse cx="0" cy="10" rx="4.5" ry="6.5" fill="${on ? c : '#34415A'}"/></g>`;
    }
    g.innerHTML = gs;
    const n = Object.keys(opened).length;
    const gc = document.getElementById('gcount');
    if (gc) gc.innerHTML = `${t('lit')} <strong>${n}</strong> ${t('of')}`;
  }

  // ---------- файлы и бонусы ----------
  function drawBelow() {
    const days = Object.keys(opened).map(Number).sort((a, b) => a - b);
    const fs = days.filter(d => itemsOf(d, false).some(([k]) => k === 'file'));
    const fc = document.getElementById('fcount');
    if (fc) fc.textContent = `${fs.length} of 31`;
    const files = document.getElementById('files');
    if (files) files.innerHTML = fs.map(d => {
      const f = fileOf(itemsOf(d, false)[0][1]);
      if (!f) return '';
      const fmt = (f.n || '').split('.').pop().toUpperCase();
      return `<div class="fcard"><span class="th"><img src="${esc(f.p || '')}" alt=""><span class="fbadge">${esc(fmt)}</span></span><span><b>${esc(f.n || '')}</b><br><small>${d} · ${esc((f.c && (f.c[LG] || f.c.en)) || '')}</small></span><a href="${esc(f.u)}" download>📥 ${t('download')}</a></div>`;
    }).join('') || '<div class="fcard wait">Files appear here as you open the windows</div>';

    const bs = days.filter(d => itemsOf(d, false).some(([k]) => k !== 'file'));
    const bc = document.getElementById('bcount');
    if (bc) bc.textContent = `${bs.length} of 31`;
    const bonus = document.getElementById('bonus');
    if (bonus) bonus.innerHTML = bs.map(() => '<span>🎁</span>').join('') + '<span class="no">+27</span>';
  }

  // ---------- отрисовка ----------
  function draw() {
    const street = document.getElementById('street');
    if (street) street.innerHTML = `<div class="prop fir">${FIR}</div><div class="prop lamp"><b></b></div>` + HOUSES.map(house).join('') + `<div class="prop lamp"><b></b></div><div class="prop fir">${FIR}</div>`;
    fit(); garland(); drawBelow();
  }
  function fit() {
    const st = document.getElementById('street'); if (!st) return;
    st.style.zoom = 1;
    if (innerWidth <= 760) return;
    const need = st.getBoundingClientRect().width, have = document.documentElement.clientWidth - 24;
    if (need > have) st.style.zoom = (have / need).toFixed(3);
  }
  addEventListener('resize', () => fit());

  // ---------- окно ----------
  const modal = document.getElementById('modal'), mbody = document.getElementById('mbody');
  function show(html, conf) {
    mbody.innerHTML = html; modal.classList.add('on');
    const c = document.getElementById('conf'); if (!c) return; c.innerHTML = '';
    if (conf) for (let i = 0; i < 40; i++) c.insertAdjacentHTML('beforeend', `<i style="left:${Math.random() * 100}%;background:${['#E9C46A','#9E1B22','#2C5F4B','#FF8A7A'][i % 4]};animation-delay:${Math.random() * .4}s"></i>`);
  }
  const kick = d => `<p class="k" style="margin:0">${d} December</p>`;
  function fileCard(f) {
    const fmt = (f.n || '').split('.').pop().toUpperCase();
    return `<div class="file"><div class="prev prev-paper"><img src="${esc(f.p || '')}" alt=""></div><span class="fmt">${esc(fmt)}</span><p class="fname">${esc(f.n || '')}</p><p class="fmeta" style="margin:0">${esc((f.c && (f.c[LG] || f.c.en)) || '')}</p><div class="acts" style="justify-content:center"><a class="pill" href="${esc(f.u)}" download>📥 ${t('download')}</a></div></div>`;
  }
  function giftRow(name) {
    return `<div class="more"><span class="k">🎁 ${t('gift')}</span><div class="item"><span class="th">🎁</span><span><b>${esc(name)}</b><small>${t('inBag')}</small></span><a class="mini-btn" href="/bird/#bp-room">🏠</a></div></div>`;
  }
  function inside(d, admin) {
    const items = itemsOf(d, admin);
    if (!items.length) return kick(d) + `<div class="big">🔘</div><p>${t('buttons')}</p>`;
    return kick(d) + items.map(([k, v]) => {
      if (k === 'file') { const f = fileOf(v); return f ? fileCard(f) : ''; }
      let name = k + ' ' + v;
      try { if (window.PPBirds) name = window.PPBirds.giftName(k, v, L); } catch (e) { /* как есть */ }
      return giftRow(name);
    }).join('');
  }
  function openDay(d) {
    const s = stateOf(d);
    if (S.plan) return show(inside(d, true) + `<div class="acts" style="justify-content:center;margin-top:10px"><a class="pill ghost" href="/admin/#advent">🎄 ${t('toAdmin')}</a></div>`);
    if (s === 'lock') {
      const b = document.querySelector(`#street .win[data-d="${d}"]`);
      if (b) { b.classList.remove('rattle'); void b.offsetWidth; b.classList.add('rattle'); }
      const msg = (LATE.includes(d) && d <= (S.claimTo || 0)) ? t('late') : (!S.today && S.month >= 1 && S.month <= 2 ? t('over') : t('soon').replace('{d}', d));
      return show(`${kick(d)}<div class="big">⛄</div><h3>${t('soon').replace('{d}', d).split('!')[0]}</h3><p>${msg}</p>`);
    }
    if (s === 'open') return show(inside(d, false));
    if (!S.user) {
      try { location.hash = '#d=' + d; } catch (e) { /* ок */ }
      return show(`${kick(d)}<div class="big">🔑</div><p>${t('signin')}</p><div class="acts" style="justify-content:center"><button class="pill" id="adv-signin">${t('signin')}</button></div>`);
    }
    const b = document.querySelector(`#street .win[data-d="${d}"]`);
    if (b) b.classList.add('opening');
    fetch('/api/advent/open', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ day: d }) })
      .then(r => { if (!r.ok) throw 0; return r.json(); })
      .then(x => setTimeout(() => { build(); draw(); show(inside(d, false), true); if (window.PPNews) window.PPNews.refresh(); }, 850))
      .catch(() => { if (b) b.classList.remove('opening'); show(`${kick(d)}<p>${t('err')}</p>`); });
  }
  app.addEventListener('click', e => {
    const b = e.target.closest('.win'); if (b) return openDay(+b.dataset.d);
    const sg = e.target.closest('#adv-signin');
    if (sg) { window.PPAccount && window.PPAccount.openSignIn(); return; }
    if (e.target === modal || e.target.closest('.x')) modal.classList.remove('on');
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('on'); });

  // снег и звёзды
  const st = document.getElementById('stars');
  if (st) for (let i = 0; i < 70; i++) st.insertAdjacentHTML('beforeend', `<i style="left:${Math.random() * 100}%;top:${Math.random() * 45}%;animation-delay:${Math.random() * 3}s"></i>`);
  const sn = document.getElementById('snow');
  if (sn) for (let i = 0; i < 46; i++) { const s = 2 + Math.random() * 4; sn.insertAdjacentHTML('beforeend', `<i style="left:${Math.random() * 100}%;width:${s}px;height:${s}px;animation-duration:${8 + Math.random() * 9}s;animation-delay:-${Math.random() * 14}s;opacity:${.35 + Math.random() * .5}"></i>`); }

  load();
  document.addEventListener('pp:whoami', () => { if (!S || !S.user) load(); });
})();
