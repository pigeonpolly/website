// «Стена рисунков»: вход через Google, ник, загрузка работы дня, серии и бейджи, топ, стена, модерация, GDPR.
// Сервер — worker/index.js (/api/*). Пока сервер не подключён, показываем «Скоро».
(() => {
  const app = document.getElementById('sw-app');
  if (!app) return;
  const L = { en: 0, ru: 1, lv: 2 }[document.documentElement.lang] ?? 0;
  const locale = ['en-GB', 'ru-RU', 'lv-LV'][L];
  const T = {
    soon: ['The Sketch Wall opens very soon. Meanwhile, draw today’s theme on the Daily Challenge page!', 'Стена рисунков скоро откроется. А пока нарисуйте тему дня на странице челленджа!', 'Skiču siena drīz atvērsies. Pagaidām uzzīmē dienas tēmu izaicinājuma lapā!'],
    toChallenge: ['To the Daily Challenge', 'К челленджу', 'Uz izaicinājumu'],
    signTitle: ['Join the wall', 'Присоединяйтесь к стене', 'Pievienojies sienai'],
    signText: ['Sign in with Google to upload your daily sketch, keep your streak and collect badges. No passwords.', 'Войдите через Google, чтобы загружать рисунок дня, вести серию и собирать бейджи. Без паролей.', 'Ienāc ar Google, lai augšupielādētu dienas skici, turētu sēriju un krātu nozīmītes. Bez parolēm.'],
    devLogin: ['Dev login', 'Тестовый вход', 'Testa ieeja'],
    nickTitle: ['Choose your nickname', 'Выберите ник', 'Izvēlies segvārdu'],
    nickText: ['It will be shown under your sketches and in the top. 2–24 letters, numbers, _ . -', 'Он будет под вашими рисунками и в топе. 2–24 символа: буквы, цифры, _ . -', 'Tas būs redzams zem tavām skicēm un topā. 2–24 simboli: burti, cipari, _ . -'],
    save: ['Save', 'Сохранить', 'Saglabāt'],
    nickBad: ['Use 2–24 letters, numbers, _ . -', 'Нужно 2–24 символа: буквы, цифры, _ . -', 'Vajag 2–24 simbolus: burti, cipari, _ . -'],
    nickTaken: ['This nickname is taken, try another one.', 'Этот ник уже занят, попробуйте другой.', 'Šis segvārds ir aizņemts, pamēģini citu.'],
    streak: [n => `${n} day${n === 1 ? '' : 's'} in a row`, n => `${n} ${pl(n, 'день', 'дня', 'дней')} подряд`, n => `${n} ${n % 10 === 1 && n % 100 !== 11 ? 'diena' : 'dienas'} pēc kārtas`],
    best: [n => `Best: ${n}`, n => `Рекорд: ${n}`, n => `Rekords: ${n}`],
    toNext: [(n, l) => `${n} more day${n === 1 ? '' : 's'} to “${l}”`, (n, l) => `Ещё ${n} ${pl(n, 'день', 'дня', 'дней')} до «${l}»`, (n, l) => `Vēl ${n} ${n % 10 === 1 && n % 100 !== 11 ? 'diena' : 'dienas'} līdz “${l}”`],
    maxLevel: ['You reached the top level!', 'Вы на высшем уровне!', 'Tu esi augstākajā līmenī!'],
    badges: ['Badges', 'Бейджи', 'Nozīmītes'],
    today: ['Today’s theme', 'Тема дня', 'Dienas tēma'],
    pick: ['Choose a photo of your sketch', 'Выбрать фото рисунка', 'Izvēlēties skices foto'],
    consent: ['I agree that my sketch is shown publicly on this wall with my nickname, and I am 13 or older.', 'Я согласен(на), что мой рисунок будет публично показан на этой стене с моим ником, и мне есть 13 лет.', 'Piekrītu, ka mana skice tiks publiski rādīta šajā sienā ar manu segvārdu, un man ir vismaz 13 gadi.'],
    upload: ['Put it on the wall', 'Повесить на стену', 'Likt uz sienas'],
    uploading: ['Uploading…', 'Загружаю…', 'Augšupielādē…'],
    posted: ['Today’s sketch is on the wall ✓', 'Рисунок дня уже на стене ✓', 'Dienas skice ir uz sienas ✓'],
    replace: ['Replace', 'Заменить', 'Aizstāt'],
    del: ['Delete', 'Удалить', 'Dzēst'],
    delAsk: ['Delete this sketch?', 'Удалить этот рисунок?', 'Dzēst šo skici?'],
    logout: ['Sign out', 'Выйти', 'Iziet'],
    myData: ['Download my data', 'Скачать мои данные', 'Lejupielādēt manus datus'],
    delAcc: ['Delete my account', 'Удалить аккаунт', 'Dzēst kontu'],
    delAccAsk: ['Delete your account, all your sketches and your streak? This can’t be undone.', 'Удалить аккаунт, все ваши рисунки и серию? Это нельзя отменить.', 'Dzēst kontu, visas tavas skices un sēriju? To nevarēs atsaukt.'],
    err: ['Something went wrong. Please try again.', 'Что-то пошло не так. Попробуйте ещё раз.', 'Kaut kas nogāja greizi. Pamēģini vēlreiz.'],
    banned: ['This account is blocked.', 'Этот аккаунт заблокирован.', 'Šis konts ir bloķēts.'],
    big: ['This file is too big or isn’t a picture.', 'Файл слишком большой или это не картинка.', 'Fails ir par lielu vai nav attēls.'],
    emptyTop: ['No streaks yet. Be the first!', 'Серий пока нет. Будьте первым!', 'Sēriju vēl nav. Esi pirmais!'],
    emptyWall: ['The wall is waiting for the first sketch.', 'Стена ждёт первый рисунок.', 'Siena gaida pirmo skici.'],
    levelUp: ['New level!', 'Новый уровень!', 'Jauns līmenis!'],
    newBadge: ['New badge!', 'Новый бейдж!', 'Jauna nozīmīte!'],
    hide: ['Hide', 'Скрыть', 'Paslēpt'], ban: ['Block', 'Блок', 'Bloķēt'],
    banAsk: ['Block this user? Their sketches disappear from the wall.', 'Заблокировать пользователя? Его рисунки пропадут со стены.', 'Bloķēt lietotāju? Viņa skices pazudīs no sienas.'],
  };
  const t = (k, ...a) => { const v = T[k][L]; return typeof v === 'function' ? v(...a) : v; };
  function pl(n, a, b, c) { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c; }
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const api = async (path, opt = {}) => {
    const r = await fetch('/api/' + path, { credentials: 'same-origin', ...opt });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(data.error || r.status); e.code = data.error; e.status = r.status; throw e; }
    return data;
  };
  const post = (path, body) => api(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}) });

  // ---------- уровни и бейджи ----------
  const LEVELS = [
    { d: 1, n: ['Egg', 'Яйцо', 'Ola'], s: 'egg', bg: '#F4F0FA' },
    { d: 3, n: ['Chick', 'Птенец', 'Cālis'], s: 'chick', bg: '#F7E7A6' },
    { d: 7, n: ['Little pigeon', 'Голубёнок', 'Balodītis'], s: 'polly', bg: '#CFC7E8' },
    { d: 14, n: ['Carrier pigeon', 'Почтовый голубь', 'Pasta balodis'], s: 'post', bg: '#C6E4D6' },
    { d: 30, n: ['Travelling pigeon', 'Голубь-путешественник', 'Ceļotājs balodis'], s: 'travel', bg: '#F5C4B3' },
    { d: 60, n: ['Artist pigeon', 'Голубь-художник', 'Mākslinieks balodis'], s: 'artist', bg: '#F0A987' },
    { d: 100, n: ['Astronaut pigeon', 'Голубь-астронавт', 'Astronauts balodis'], s: 'astro', bg: '#9FB6E8' },
    { d: 365, n: ['Polly legend', 'Легенда Полли', 'Pollijas leģenda'], s: 'crown', bg: '#9C8FE0' },
  ];
  const SPECIAL = [
    { k: 'extra', n: ['EXTRA day done', 'День ЭКСТРА пройден', 'EKSTRA diena paveikta'], icon: '✦', bg: '#E9A93B' },
    { k: 'bw', n: ['Ink mood: drew in B/W', 'Нарисовал(а) в Ч/Б', 'Zīmēju melnbalti'], icon: '✒', bg: '#E2E2E2' },
    { k: 'bday', n: ['Polly’s birthday guest', 'Гость на дне рождения Полли', 'Pollijas dzimšanas dienas viesis'], icon: '🎂', bg: '#F5C4B3' },
  ];
  const POLLY = ['......ddd.....', '.....dbbbd....', '....dbbwwbd...', '....dbbwkbdoo.', '....dbbbbbdo..', '...dbbbbbbd...', '..dbbsbbbbd...',
    '.dbbssbbbbd...', 'dbbssbbbbbd...', 'dbbbbbbbbd....', '.ddbbbbbdd....', '...ddddd......', '....o..o......', '...oo.oo......'];
  const SPR = {
    egg: ['..............', '.....dddd.....', '....dwwwwd....', '...dwwwwwwd...', '...dwwswwwd...', '..dwwwwwwwwd..', '..dwwwwwswwd..',
      '..dwswwwwwwd..', '..dwwwwwwwwd..', '..dwwwwwwwwd..', '...dwwwwwwd...', '....dwwwwd....', '.....dddd.....', '..............'],
    chick: ['..............', '.....dddd.....', '....dyyyyd....', '...dyyykyd....', '...dyyyyydoo..', '...dyyyyyd....', '..dyyyyyyyd...',
      '.dyyyyyyyyyd..', '.dwdwdwdwdwd..', '.dwwwwwwwwwd..', '..dwwwwwwwd...', '...ddddddd....', '..............', '..............'],
  };
  const COL = { d: '#1a1528', b: '#7f81bf', s: '#5e5a9c', w: '#ffffff', k: '#1a1528', o: '#f2a73b', y: '#F2C230', e: '#FFFDF8', r: '#D9372B',
    n: '#8A5A3C', g: '#E9A93B', h: '#BFE3FF', c: '#c9b8e8' };
  const EXTRA_PIX = {
    post: [[10, 6, 'eeee'], [10, 7, 'eree'], [10, 8, 'eeee']],
    travel: [[10, 9, '.nn.'], [9, 10, 'nnnnn'], [9, 11, 'nggnn'], [9, 12, 'nnnnn']],
    artist: [[4, -2, '..rrrr'], [3, -1, '.rrrrrrr'], [3, 0, 'rrr...r']],
    crown: [[4, -3, 'd.d.d'], [4, -2, 'gdgdg'], [3, -1, 'dgggggd'], [3, 0, 'dgrgrgd'], [4, 1, 'ddddd']],
  };
  function spriteSvg(kind) {
    const rows = SPR[kind] || POLLY, px = [];
    rows.forEach((r, y) => [...r].forEach((ch, x) => COL[ch] && px.push([x, y + 3, COL[ch]])));
    (EXTRA_PIX[kind] || []).forEach(([x0, y0, s]) => [...s].forEach((ch, i) => COL[ch] && px.push([x0 + i, y0 + 3, COL[ch]])));
    // шлем астронавта: стеклянное кольцо вокруг головы
    if (kind === 'astro') for (let y = -3; y < 9; y++) for (let x = 0; x < 14; x++) {
      const r = Math.hypot(x + .5 - 7.6, y + .5 - 3); if (r > 4.4 && r < 5.5) px.push([x, y + 3, '#BFE3FF']);
    }
    return `<svg viewBox="0 0 14 17" shape-rendering="crispEdges">${px.map(([x, y, c]) => `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${c}"/>`).join('')}</svg>`;
  }
  const medal = (lv, on = true, big = false) =>
    `<span class="sw-medal${on ? '' : ' off'}${big ? ' big' : ''}" style="--bg:${lv.bg}" title="${esc(lv.n[L])}${lv.d ? ` · ${lv.d}` : ''}">${lv.s ? spriteSvg(lv.s) : `<b>${lv.icon}</b>`}</span>`;
  const levelOf = best => [...LEVELS].reverse().find(l => best >= l.d) || null;
  function specials(posts) {
    const got = new Set();
    for (const p of posts) {
      const d = new Date(p.day + 'T12:00:00');
      if (p.bw) got.add('bw');
      if (d.getMonth() === 0 && d.getDate() === 23) got.add('bday');
      if (window.ChallengeTheme && d.getDate() === window.ChallengeTheme.extraDay(d.getFullYear(), d.getMonth())) got.add('extra');
    }
    return got;
  }
  // тема хранится по-английски — показываем на языке страницы
  function themeLocal(en) {
    const row = (window.CHALLENGE_DATA?.subjects || []).find(r => r[0] === en);
    return row ? row[L] : en;
  }
  const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const fmtDay = k => new Date(k + 'T12:00:00').toLocaleDateString(locale, { day: 'numeric', month: 'short' });

  // ---------- состояние ----------
  let cfg = null, me = null;
  async function start() {
    try { cfg = await api('config'); } catch (e) { cfg = null; }
    if (!cfg || !cfg.ready) {
      app.innerHTML = `<div class="sw-card sw-soon">${spriteSvg('polly')}<div><p>${t('soon')}</p><a class="cta-btn" href="${L === 1 ? '/ru' : L === 2 ? '/lv' : ''}/challenge/">${t('toChallenge')}</a></div></div>`;
      document.querySelector('.sw-cols').hidden = true;
      return;
    }
    await refresh();
    loadTop(); loadWall();
  }
  async function refresh(prev) {
    try { me = (await api('me')).user; } catch (e) { me = null; }
    render(prev);
  }

  function render(prev) {
    if (!me) return renderSignIn();
    if (me.banned) { app.innerHTML = `<div class="sw-card"><p>${t('banned')}</p></div>`; return; }
    if (!me.nick) return renderNick();
    renderProfile(prev);
  }

  function renderSignIn() {
    app.innerHTML = `<div class="sw-card sw-signin"><span class="sw-signin-polly">${spriteSvg('polly')}</span><div>
      <h2>${t('signTitle')}</h2><p>${t('signText')}</p><div id="sw-gbtn" class="sw-gbtn"></div>
      ${cfg.dev ? `<button class="pill-btn" type="button" id="sw-dev">${t('devLogin')}</button>` : ''}
      <p class="sw-status" id="sw-status"></p></div></div>`;
    const dev = document.getElementById('sw-dev');
    dev && dev.addEventListener('click', () => login('dev:' + (prompt('nick?', 'tester') || 'tester')));
    const tryGoogle = (n = 0) => {
      if (!window.google?.accounts?.id) return n < 50 && setTimeout(() => tryGoogle(n + 1), 200);
      google.accounts.id.initialize({ client_id: cfg.clientId, callback: r => login(r.credential), ux_mode: 'popup' });
      google.accounts.id.renderButton(document.getElementById('sw-gbtn'), { theme: 'outline', size: 'large', shape: 'pill', text: 'continue_with', locale: ['en', 'ru', 'lv'][L] });
    };
    tryGoogle();
  }
  async function login(credential) {
    const st = document.getElementById('sw-status');
    try { await post('login', { credential }); await refresh(); loadTop(); loadWall(true); }
    catch (e) { if (st) st.textContent = e.code === 'banned' ? t('banned') : t('err'); }
  }

  function renderNick() {
    app.innerHTML = `<form class="sw-card sw-nickform" id="sw-nick"><h2>${t('nickTitle')}</h2><p>${t('nickText')}</p>
      <div class="sw-row"><input name="nick" required maxlength="24" placeholder="@pigeonpolly" autocomplete="nickname"><button class="cta-btn" type="submit">${t('save')}</button></div>
      <p class="sw-status" id="sw-status"></p></form>`;
    document.getElementById('sw-nick').addEventListener('submit', async e => {
      e.preventDefault();
      const st = document.getElementById('sw-status');
      try { await post('nick', { nick: e.target.nick.value }); await refresh(); }
      catch (err) { st.textContent = err.code === 'taken' ? t('nickTaken') : err.code === 'nick' ? t('nickBad') : t('err'); }
    });
  }

  function renderProfile(prev) {
    const lv = levelOf(me.best), next = LEVELS.find(l => l.d > me.best);
    const got = specials(me.posts), today = todayKey(), mine = me.posts.find(p => p.day === today);
    const th = window.ChallengeTheme ? window.ChallengeTheme.themeFor(new Date(), L) : null;
    const base = (LEVELS.indexOf(next) > 0 ? LEVELS[LEVELS.indexOf(next) - 1].d : 0);
    const progress = next ? Math.round((me.best - base) / (next.d - base) * 100) : 100;
    app.innerHTML = `<div class="sw-grid">
      <div class="sw-card sw-profile">
        ${lv ? medal(lv, true, true) : `<span class="sw-medal big off" style="--bg:#F4F0FA">${spriteSvg('egg')}</span>`}
        <div class="sw-who"><h2>@${esc(me.nick)}</h2><p class="sw-level">${lv ? esc(lv.n[L]) : '—'}</p>
          <p class="sw-streak">🔥 ${t('streak', me.current)} · ${t('best', me.best)}</p>
          <div class="sw-bar"><i style="width:${progress}%"></i></div>
          <p class="sw-next">${next ? t('toNext', next.d - me.best, next.n[L]) : t('maxLevel')}</p></div>
        <div class="sw-badges"><h3>${t('badges')}</h3><div>${LEVELS.map(l => medal(l, me.best >= l.d)).join('')}${SPECIAL.map(s => medal(s, got.has(s.k))).join('')}</div></div>
        <p class="sw-acc"><button type="button" class="sw-link" id="sw-out">${t('logout')}</button> · <a class="sw-link" href="/api/export">${t('myData')}</a> · <button type="button" class="sw-link danger" id="sw-delacc">${t('delAcc')}</button>${me.admin ? ' · <b>admin</b>' : ''}</p>
      </div>
      <form class="sw-card sw-upload" id="sw-up">
        <p class="sw-kicker">${t('today')}</p><h2>${th ? esc(th.subject) : ''}</h2>
        ${mine ? `<div class="sw-mine"><img src="/api/img/${mine.id}?t=1" alt=""><div><p>${t('posted')}</p><button type="button" class="sw-link danger" data-del="${mine.id}">${t('del')}</button></div></div>` : ''}
        <label class="pill-btn sw-file">${mine ? t('replace') : t('pick')}<input type="file" accept="image/*" name="file" hidden></label>
        <div class="sw-prev" hidden><img alt=""></div>
        ${me.consent ? '' : `<label class="sw-check"><input type="checkbox" name="consent" required> <span>${t('consent')} <a href="/privacy/">↗</a></span></label>`}
        <button class="cta-btn" type="submit" disabled>${t('upload')}</button>
        <p class="sw-status" id="sw-status"></p>
      </form></div>`;
    if (prev) celebrate(prev, lv, got);
    document.getElementById('sw-out').onclick = async () => { await post('logout'); me = null; render(); loadWall(true); };
    document.getElementById('sw-delacc').onclick = async () => {
      if (!confirm(t('delAccAsk'))) return;
      try { await post('delete-account'); me = null; render(); loadTop(); loadWall(true); } catch (e) { alert(t('err')); }
    };
    app.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => {
      if (!confirm(t('delAsk'))) return;
      try { await post('delete-post', { id: b.dataset.del }); await refresh(); loadTop(); loadWall(true); } catch (e) { alert(t('err')); }
    });
    setupUpload(th);
  }

  // ---------- загрузка ----------
  async function shrink(file, max, q) {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); });
    const k = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(img.src);
    return new Promise(r => c.toBlob(r, 'image/jpeg', q));
  }
  function setupUpload(th) {
    const form = document.getElementById('sw-up'), input = form.file, btn = form.querySelector('button[type="submit"]');
    const prev = form.querySelector('.sw-prev'), st = document.getElementById('sw-status');
    let full = null, thumb = null;
    input.addEventListener('change', async () => {
      st.textContent = ''; full = thumb = null; btn.disabled = true; prev.hidden = true;
      const f = input.files[0]; if (!f) return;
      try {
        if (!/^image\//.test(f.type)) throw 0;
        full = await shrink(f, 1600, 0.85); thumb = await shrink(f, 600, 0.8);
        if (!full || full.size > 2.4e6) throw 0;
        prev.querySelector('img').src = URL.createObjectURL(thumb); prev.hidden = false; btn.disabled = false;
      } catch (e) { st.textContent = t('big'); }
    });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!full) return;
      btn.disabled = true; st.textContent = t('uploading');
      const fd = new FormData();
      fd.append('image', new File([full], 'sketch.jpg', { type: 'image/jpeg' }));
      fd.append('thumb', new File([thumb], 'thumb.jpg', { type: 'image/jpeg' }));
      fd.append('day', todayKey());
      fd.append('theme', th ? window.ChallengeTheme.themeFor(new Date(), 0).subject : '');
      let bw = false; try { bw = localStorage.getItem('ch-bw') === '1'; } catch (err) { /* без памяти */ }
      fd.append('bw', bw ? '1' : '0');
      if (form.consent) fd.append('consent', form.consent.checked ? 'yes' : '');
      try {
        await api('upload', { method: 'POST', body: fd });
        const before = { best: me.best, got: specials(me.posts) };
        await refresh(before); loadTop(); loadWall(true);
      } catch (err) { st.textContent = err.code === 'big' || err.code === 'file' ? t('big') : t('err'); btn.disabled = false; }
    });
  }

  // праздник: новый уровень или бейдж
  function celebrate(prev, lv, got) {
    const oldLv = levelOf(prev.best);
    const newSpecial = SPECIAL.find(s => got.has(s.k) && !prev.got.has(s.k));
    let html = '';
    if (lv && lv !== oldLv) html = `${medal(lv, true, true)}<b>${t('levelUp')}</b><span>${esc(lv.n[L])}</span>`;
    else if (newSpecial) html = `${medal(newSpecial, true, true)}<b>${t('newBadge')}</b><span>${esc(newSpecial.n[L])}</span>`;
    if (!html) return;
    const pop = document.createElement('div');
    pop.className = 'sw-pop'; pop.innerHTML = html + [...Array(16)].map((_, i) => `<i style="--a:${i * 22.5}deg;--c:${['#F0A987', '#E9A93B', '#7F81BF', '#D85A30'][i % 4]}"></i>`).join('');
    document.body.appendChild(pop);
    pop.addEventListener('click', () => pop.remove());
    setTimeout(() => pop.classList.add('out'), 3200);
    setTimeout(() => pop.remove(), 3800);
  }

  // ---------- топ и стена ----------
  async function loadTop() {
    const el = document.getElementById('sw-top');
    try {
      const { top } = await api('top');
      el.innerHTML = top.length ? top.map((r, i) => {
        const lv = levelOf(r.best);
        return `<li><span class="sw-pos">${i + 1}</span>${lv ? medal(lv) : ''}<span class="sw-topnick">@${esc(r.nick)}</span><span class="sw-fire">🔥 ${r.current}</span></li>`;
      }).join('') : `<li class="sw-empty">${t('emptyTop')}</li>`;
    } catch (e) { el.innerHTML = ''; }
  }
  let cursor = null;
  async function loadWall(reset) {
    const el = document.getElementById('sw-wall'), more = document.getElementById('sw-more');
    if (reset) { cursor = null; el.innerHTML = ''; }
    try {
      const { posts } = await api('wall' + (cursor ? `?before=${cursor}` : ''));
      if (!posts.length && !el.children.length) el.innerHTML = `<p class="sw-empty">${t('emptyWall')}</p>`;
      el.insertAdjacentHTML('beforeend', posts.map(p => `<figure class="sw-tile${p.bw ? ' bw' : ''}" data-id="${p.id}">
        <a href="/api/img/${p.id}" data-lightbox><img src="/api/img/${p.id}?t=1" alt="${esc(themeLocal(p.theme))}" loading="lazy"></a>
        <figcaption><b>@${esc(p.nick)}</b> <span>${esc(themeLocal(p.theme))} · ${fmtDay(p.day)}</span></figcaption>
        ${me && me.admin ? `<div class="sw-mod"><button type="button" data-hide="${p.id}">${t('hide')}</button><button type="button" data-ban="${p.uid}">${t('ban')}</button></div>` : ''}
      </figure>`).join(''));
      if (posts.length) cursor = posts[posts.length - 1].created_at;
      more.hidden = posts.length < 24;
    } catch (e) { more.hidden = true; }
  }
  document.getElementById('sw-more')?.addEventListener('click', () => loadWall());
  document.getElementById('sw-wall')?.addEventListener('click', async e => {
    const h = e.target.closest('[data-hide]'), b = e.target.closest('[data-ban]');
    try {
      if (h) { await post('admin/hide', { id: h.dataset.hide }); h.closest('.sw-tile').remove(); }
      if (b && confirm(t('banAsk'))) { await post('admin/ban', { uid: b.dataset.ban }); loadWall(true); loadTop(); }
    } catch (err) { alert(t('err')); }
  });

  start();
})();
