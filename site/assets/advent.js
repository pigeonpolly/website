// Адвент-календарь (/advent/, вкладка в «Играх»): до 1 декабря — обратный отсчёт; 1–31 декабря вошедший открывает окошки
// (сегодняшнее и пропущенные), из окошка вылетает птичка с подарком в клюве — вещь сразу в сумке. Что в каком окошке — Алина
// отмечает в «Коллекциях» на странице стаи (кнопка 📅 у вещи). Сервер: /api/advent, /api/advent/open (worker/index.js).
(() => {
  const app = document.getElementById('advent');
  if (!app) return;
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0, pre = ['', '/ru', '/lv'][L];
  const T = {
    soon: ['The calendar opens on December 1', 'Календарь откроется 1 декабря', 'Kalendārs atvērsies 1. decembrī'],
    units: [['days', 'hours', 'min', 'sec'], ['дней', 'часов', 'минут', 'секунд'], ['dienas', 'stundas', 'min', 'sek']],
    login: ['Sign in to open the windows and collect gifts', 'Войдите, чтобы открывать окошки и собирать подарки', 'Ienāc, lai atvērtu lodziņus un vāktu dāvanas'],
    signin: ['Sign in', 'Войти', 'Ienākt'],
    today: ['Today’s window is waiting!', 'Сегодняшнее окошко ждёт!', 'Šodienas lodziņš gaida!'],
    missed: ['Each window opens only on its own day. Come back tomorrow!', 'Каждое окошко открывается только в свой день. Приходите завтра!', 'Katrs lodziņš atveras tikai savā dienā. Nāc rīt!'],
    was: ['This window held:', 'В этом окошке было:', 'Šajā lodziņā bija:'], wasBtns: ['This window held buttons 🔘', 'В этом окошке были пуговки 🔘', 'Šajā lodziņā bija pogas 🔘'],
    youGot: ['✓ You got it', '✓ Ты это получил(а)', '✓ Tu to saņēmi'], missedIt: ['This day has passed: its window can no longer be opened.', 'Этот день прошёл: окошко больше не открыть.', 'Šī diena ir pagājusi: lodziņu vairs nevar atvērt.'],
    todayOnly: ['Only today’s window can be opened.', 'Открыть можно только сегодняшнее окошко.', 'Var atvērt tikai šodienas lodziņu.'],
    locked: ['Not yet! This window opens on December {d}.', 'Ещё рано! Это окошко откроется {d} декабря.', 'Vēl par agru! Šis lodziņš atvērsies {d}. decembrī.'],
    got: ['A gift for you:', 'Тебе подарок:', 'Dāvana tev:'],
    inBag: ['It is already in your bag 🎒', 'Он уже у тебя в сумке 🎒', 'Tā jau ir tavā somā 🎒'],
    btns: ['+{n} 🔘 buttons!', '+{n} 🔘 пуговок!', '+{n} 🔘 pogas!'],
    btnsWhy: ['This window had buttons inside. Spend them in the shop.', 'В этом окошке были пуговки. Их можно потратить в магазине.', 'Šajā lodziņā bija pogas. Tās var iztērēt veikalā.'],
    bag: ['Open my bag', 'Открыть сумку', 'Atvērt somu'], shop: ['Shop', 'Магазин', 'Veikals'], close: ['Close', 'Закрыть', 'Aizvērt'],
    legend: ['★ Legendary!', '★ Легендарная!', '★ Leģendāra!'], special: ['Special window', 'Особое окошко', 'Īpašs lodziņš'],
    err: ['Could not open, please try again.', 'Не получилось открыть, попробуйте ещё раз.', 'Neizdevās atvērt, mēģini vēlreiz.'],
    over: ['This year’s calendar is over. See you in December!', 'Календарь этого года закончился. До встречи в декабре!', 'Šī gada kalendārs ir beidzies. Tiekamies decembrī!'],
    count: ['Opened {n} of 31', 'Открыто {n} из 31', 'Atvērti {n} no 31'],
    adm: ['🔒 You see this because you are the admin: how many gifts are in each window. Put things in windows in the admin panel.', '🔒 Видите только вы: сколько вещей лежит в каждом окошке. Класть вещи в окошки — в кабинете.', '🔒 Redzi tikai tu: cik lietu ir katrā lodziņā. Lietas lodziņos liek kabinetā.'],
    toColl: ['🎄 Advent in the admin panel →', '🎄 Адвент в кабинете →', '🎄 Advente kabinetā →'],
  };
  const t = k => T[k][L];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const devDate = (location.search.match(/[?&]devdate=(\d{4}-\d\d-\d\d)/) || [])[1]; // проверка на локальном сервере (DEV_FAKE_LOGIN)
  const H = devDate ? { 'x-dev-date': devDate } : {};
  let S = null, skew = 0, timer = 0;
  // окошки вперемешку (одинаково у всех), особые — золотые
  const ORDER = (() => { const o = [...Array(31)].map((_, i) => i + 1); let a = 20261201; const r = () => (a = (a * 1103515245 + 12345) % 2147483648) / 2147483648; for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; } return o; })();

  function load() {
    return fetch('/api/advent', { credentials: 'same-origin', headers: H }).then(r => r.ok ? r.json() : null).then(d => { if (d) { S = d; skew = d.now - Date.now(); } draw(); }).catch(draw);
  }
  function countdown(box) {
    const tick = () => {
      const ms = Math.max(0, S.startsAt - (Date.now() + skew));
      if (!ms) { clearInterval(timer); load(); return; }
      const v = [Math.floor(ms / 864e5), Math.floor(ms / 36e5) % 24, Math.floor(ms / 6e4) % 60, Math.floor(ms / 1e3) % 60];
      box.innerHTML = v.map((n, i) => `<span><b>${String(n).padStart(i ? 2 : 1, '0')}</b><small>${T.units[L][i]}</small></span>`).join('');
    };
    clearInterval(timer); tick(); timer = setInterval(tick, 1000);
  }
  function draw() {
    if (!S) { app.innerHTML = ''; return; }
    const opened = Object.fromEntries((S.opened || []).map(o => [o.day, o]));
    const past = {}; (S.past || []).forEach(p => (past[p.day] = past[p.day] || []).push([p.kind, p.item]));
    const isPast = d => d <= (S.shownTo || 0);
    const plan = {}; (S.plan || []).forEach(p => (plan[p.day] = plan[p.day] || []).push(p));
    const before = !S.today && (Date.now() + skew) < S.startsAt;
    let head = '';
    if (before) head = `<div class="adv-soon"><p>${t('soon')}</p><div class="adv-cd" role="timer"></div></div>`;
    else if (!S.today) head = `<div class="adv-soon"><p>${t('over')}</p></div>`;
    else if (!S.user) head = `<div class="adv-soon"><p>${t('login')}</p><button type="button" class="pill-btn pill-fill" data-login>${t('signin')}</button></div>`;
    else head = `<div class="adv-soon"><p>${opened[S.today] ? t('missed') : t('today')}</p><small>${t('todayOnly')}</small></div>`;
    if (S.plan) head += `<p class="adv-adm">${t('adm')} <a href="/admin/#advent">${t('toColl')}</a></p>`;
    app.innerHTML = head + `<div class="adv-board">${ORDER.map(d => {
      const o = opened[d], sp = S.special.includes(d), pd = isPast(d), can = S.today && d === S.today;
      const cls = ['adv-win', sp ? 'sp' : '', d === 31 ? 'leg' : '', o || pd ? 'open' : '', pd ? 'past' : '', can && !o ? 'ready' : '', d === S.today ? 'today' : '', !can && !o && !pd ? 'lock' : ''].filter(Boolean).join(' ');
      return `<button type="button" class="${cls}" data-d="${d}" aria-label="${d}${sp ? ' — ' + t('special') : ''}"><span class="adv-in"></span><span class="adv-door l"></span><span class="adv-door r"></span><b>${d}</b>${sp ? '<i class="adv-star">★</i>' : ''}${S.plan && plan[d] ? `<em class="adv-n">${plan[d].length}</em>` : ''}</button>`;
    }).join('')}</div>`;
    // открытые окошки: внутри картинка подарка
    // открытые окошки: внутри картинка подарка (прошедшие дни — видны всем)
    app.querySelectorAll('.adv-win.open').forEach(b => { const d = +b.dataset.d, o = opened[d] || (past[d] ? { kind: past[d][0][0], item: past[d][0][1] } : { buttons: 1 }); b.querySelector('.adv-in').appendChild(prize(o, 40)); if ((past[d] || []).length > 1 || (o.got || []).length > 1) b.classList.add('many'); });
    if (before) countdown(app.querySelector('.adv-cd'));
    const lg = app.querySelector('[data-login]'); if (lg) lg.onclick = () => window.PPAccount && window.PPAccount.openSignIn();
    app.querySelectorAll('.adv-win').forEach(b => b.onclick = () => { const d = +b.dataset.d; if (!opened[d] && isPast(d)) return showPast(b, d, past[d] || []); tap(b, d, opened[d]); });
  }
  function prize(o, size) {
    const B = window.PPBirds, s = document.createElement('span'); s.className = 'adv-prize';
    if (o && o.kind && B) s.appendChild(B.itemIcon(o.kind, o.item, size, S.user ? S.user.id : 2));
    else if (o && o.buttons) s.textContent = '🔘';
    return s;
  }
  function tap(btn, d, o) {
    if (o) return show(btn, o, false);
    if (!S.today || d !== S.today) { toast(d < (S.today || 32) ? t('todayOnly') : t('locked').replace('{d}', d)); btn.classList.remove('shake'); void btn.offsetWidth; btn.classList.add('shake'); return; }
    if (!S.user) { window.PPAccount && window.PPAccount.openSignIn(); return; }
    if (btn.disabled) return;
    btn.disabled = true;
    fetch('/api/advent/open', { method: 'POST', credentials: 'same-origin', headers: Object.assign({ 'content-type': 'application/json' }, H), body: JSON.stringify({ day: d }) })
      .then(r => { if (!r.ok) throw 0; return r.json(); })
      .then(x => { S.opened = (S.opened || []).filter(q => q.day !== d).concat([x]); btn.classList.add('opening'); setTimeout(() => show(btn, x, true), 650); })
      .catch(() => { btn.disabled = false; toast(t('err')); });
  }
  const toast = m => window.PPToast ? window.PPToast(m) : alert(m);
  // прошедший день: что было в окошке (видно всем)
  function showPast(btn, d, items) {
    const B = window.PPBirds;
    const dlg = document.createElement('div'); dlg.className = 'adv-modal'; dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true');
    dlg.innerHTML = `<div class="adv-card"><button type="button" class="adv-x" aria-label="${t('close')}">✕</button><p class="adv-kick">${d} · ${items.length ? t('was') : t('wasBtns')}</p><div class="adv-list"></div><p>${t('missedIt')}</p></div>`;
    const list = dlg.querySelector('.adv-list');
    items.forEach(([k, v]) => { const f = document.createElement('figure'); f.appendChild(B.itemIcon(k, v, 64, S.user ? S.user.id : 2)); const c = document.createElement('figcaption'); c.textContent = B.giftName(k, v, L); f.appendChild(c); list.appendChild(f); });
    const close = () => dlg.remove();
    dlg.querySelector('.adv-x').onclick = close; dlg.onclick = e => { if (e.target === dlg) close(); };
    document.body.appendChild(dlg); dlg.querySelector('.adv-x').focus();
  }
  // окно: птичка вылетает из окошка и приносит подарок
  function show(btn, o, fresh) {
    const B = window.PPBirds, leg = o.kind && B && B.LEGEND && B.LEGEND.has(o.kind + '|' + o.item);
    const dlg = document.createElement('div'); dlg.className = 'adv-modal' + (leg ? ' leg' : ''); dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true');
    const name = o.kind && B ? B.giftName(o.kind, o.item, L) : '';
    dlg.innerHTML = `<div class="adv-card"><button type="button" class="adv-x" aria-label="${t('close')}">✕</button>
      <div class="adv-stage"><div class="adv-bird"></div></div>
      <p class="adv-kick">${o.kind ? t('got') : t('btns').replace('{n}', o.buttons || 0)}</p>
      ${o.kind ? `<h2>${esc(name)}</h2>${(o.got || []).length > 1 ? `<div class="adv-list">${o.got.slice(1).map(() => '<figure></figure>').join('')}</div>` : ''}${leg ? `<p class="adv-leg">${t('legend')}</p>` : ''}<p>${t('inBag')}</p>` : `<p>${t('btnsWhy')}</p>`}
      <div class="adv-act">${S.user && S.user.nick ? `<a class="pill-btn pill-fill" href="${pre}/bird/">${t('bag')}</a>` : ''}<a class="pill-btn" href="${pre}/shop/">${t('shop')}</a></div></div>`;
    const bird = dlg.querySelector('.adv-bird');
    (o.got || []).slice(1).forEach(([k, v], i) => { const f = dlg.querySelectorAll('.adv-list figure')[i]; if (f && B) { f.appendChild(B.itemIcon(k, v, 56, S.user ? S.user.id : 2)); const c = document.createElement('figcaption'); c.textContent = B.giftName(k, v, L); f.appendChild(c); } });
    if (B) {
      const id = 5 + o.day * 37, lk = o.kind === 'item' ? B.dress(B.looks(id), { item: o.item }) : B.looks(id);
      const c = B.crop(B.spriteHD(lk, 0)); c.className = 'adv-bird-c'; c.style.width = c.width * 3 + 'px'; c.style.height = c.height * 3 + 'px'; bird.appendChild(c);
      if (o.kind !== 'item') bird.appendChild(prize(o, 64)); // шапку, фон, рамку и т. п. птичка несёт под собой
    }
    const close = () => { dlg.remove(); removeEventListener('keydown', key); if (fresh) draw(); };
    const key = e => { if (e.key === 'Escape') close(); };
    dlg.querySelector('.adv-x').onclick = close; dlg.onclick = e => { if (e.target === dlg) close(); };
    addEventListener('keydown', key); document.body.appendChild(dlg);
    // вылет: от окошка к центру окна
    const r = btn.getBoundingClientRect(), st = dlg.querySelector('.adv-stage').getBoundingClientRect();
    bird.style.setProperty('--fx', Math.round(r.left + r.width / 2 - (st.left + st.width / 2)) + 'px');
    bird.style.setProperty('--fy', Math.round(r.top + r.height / 2 - (st.top + st.height / 2)) + 'px');
    requestAnimationFrame(() => bird.classList.add('fly'));
    if (leg) for (let i = 0; i < 18; i++) { const s = document.createElement('i'); s.className = 'adv-spark'; s.style.cssText = `--a:${i * 20}deg;--d:${80 + (i % 3) * 30}px;animation-delay:${.7 + (i % 4) * .08}s`; dlg.querySelector('.adv-stage').appendChild(s); }
    dlg.querySelector('.adv-x').focus();
  }
  load();
})();
