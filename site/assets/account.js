// Вход в шапке на всех страницах: «Войти» (Google) или птичка-аватар из стаи с меню профиля.
(function () {
  const el = document.getElementById('acct');
  if (!el) return;
  const lang = document.documentElement.lang || 'en';
  const L = { en: 0, ru: 1, lv: 2 }[lang] ?? 0;
  const pre = lang === 'en' ? '' : '/' + lang;
  const S = {
    signIn: ['Sign in', 'Войти', 'Ienākt'],
    why: ['One account for the Daily Challenge, blog comments and your own bird in the flock.', 'Один вход для челленджа, комментариев в блоге и своей птички в стае.', 'Viena ieeja izaicinājumam, bloga komentāriem un savam putniņam barā.'],
    profile: ['My profile and works', 'Мой профиль и работы', 'Mans profils un darbi'],
    nick: ['Choose a nickname', 'Выбрать ник', 'Izvēlēties segvārdu'],
    noNick: ['no nickname yet', 'ник ещё не выбран', 'segvārds vēl nav izvēlēts'],
    out: ['Sign out', 'Выйти', 'Iziet'],
    menu: ['Account', 'Аккаунт', 'Konts'],
    admin: ['admin', 'админ', 'admins'],
    cabinet: ['Admin dashboard', 'Кабинет', 'Kabinets'],
    nTitle: ['Meet your bird! Now pick a nickname', 'Знакомься со своей птичкой! Теперь выбери ник', 'Iepazīsties ar savu putniņu! Tagad izvēlies segvārdu'],
    nTitleCat: ['You are a cat! Now pick a nickname', 'Ты котик! Теперь выбери ник', 'Tu esi kaķītis! Tagad izvēlies segvārdu'],
    nTitleCrow: ['You are a crow with a treasure! Now pick a nickname', 'Ты ворона с сокровищем! Теперь выбери ник', 'Tu esi vārna ar dārgumu! Tagad izvēlies segvārdu'],
    nText: ['This name will be shown in the flock, on the Daily Challenge wall and in blog comments. 2–24 letters, numbers, dots, dashes or underscores.', 'Под этим ником тебя увидят в стае, на стене челленджа и в комментариях блога. 2–24 символа: буквы, цифры, точка, дефис или подчёркивание.', 'Ar šo vārdu tevi redzēs barā, izaicinājuma sienā un bloga komentāros. 2–24 simboli: burti, cipari, punkts, defise vai pasvītra.'],
    nPlace: ['your nickname', 'твой ник', 'tavs segvārds'],
    nSave: ['Done', 'Готово', 'Gatavs'],
    nTaken: ['This nickname is taken, try another one.', 'Этот ник уже занят, попробуй другой.', 'Šis segvārds jau aizņemts, mēģini citu.'],
    nBad: ['Use 2–24 letters, numbers, dots, dashes or underscores.', 'Нужно 2–24 символа: буквы, цифры, точка, дефис или подчёркивание.', 'Vajag 2–24 simbolus: burtus, ciparus, punktu, defisi vai pasvītru.'],
    nErr: ['Something went wrong, please try again.', 'Что-то пошло не так, попробуй ещё раз.', 'Kaut kas nogāja greizi, mēģini vēlreiz.'],
    nOut: ['Sign out instead', 'Лучше выйти', 'Labāk iziet'],
    pub: ['Your nickname and bird will be visible to everyone on the site.', 'Твой ник и птичка будут видны всем на сайте.', 'Tavs segvārds un putniņš būs redzami visiem vietnē.'],
    terms: ['By signing in you agree to the', 'Входя, ты соглашаешься с', 'Ieejot tu piekrīti'],
    termsLink: ['privacy rules', 'правилами конфиденциальности', 'privātuma noteikumiem'],
    termsMore: ['Privacy rules', 'Правила конфиденциальности', 'Privātuma noteikumi'],
  };
  const t = k => S[k][L];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let info = null;

  function check() {
    return fetch('/api/whoami', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).then(d => {
      if (!d) return;
      info = d; render();
      if (d.user && !d.user.nick) askNick(d.user);
    }).catch(() => {});
  }
  // открыть окно входа из любого места страницы (кнопка «Хочу свою птичку» в стае)
  function openSignIn() {
    const btn = el.querySelector('.acct-btn');
    if (!btn) return false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (btn.getAttribute('aria-expanded') !== 'true') btn.click();
    btn.focus({ preventScroll: true });
    return true;
  }
  window.PPAccount = { check, openSignIn, signedIn: () => !!(info && info.user) };
  check();

  // ник обязателен: окно сразу после первого входа, закрыть можно только выбрав ник (или выйдя)
  function askNick(u) {
    if (document.getElementById('acct-nick')) return;
    const kind = window.PPBirds ? window.PPBirds.looks(u.id).kind : 'bird';
    const d = document.createElement('dialog');
    d.id = 'acct-nick'; d.className = 'acct-nick';
    d.innerHTML = `<form method="dialog"><canvas width="${window.PPBirds ? window.PPBirds.SW : 28}" height="26" aria-hidden="true"></canvas>
      <h2>${t(kind === 'cat' ? 'nTitleCat' : kind === 'crow' ? 'nTitleCrow' : 'nTitle')}</h2><p>${t('nText')}</p>
      <input name="nick" required minlength="2" maxlength="24" autocomplete="nickname" placeholder="${t('nPlace')}">
      <p class="acct-terms">${t('pub')} <a href="${pre}/privacy/" target="_blank">${t('termsMore')} ↗</a></p>
      <p class="acct-nick-st" role="status" aria-live="polite"></p>
      <button class="pill-btn pill-fill" type="submit">${t('nSave')}</button>
      <button class="acct-nick-out" type="button">${t('nOut')}</button></form>`;
    document.body.appendChild(d);
    if (window.PPBirds) d.querySelector('canvas').getContext('2d').drawImage(window.PPBirds.sprite(window.PPBirds.dress(window.PPBirds.looks(u.id), u.avatar), 0), 0, 0);
    d.addEventListener('cancel', e => e.preventDefault()); // Esc не закрывает
    const f = d.querySelector('form'), st = d.querySelector('.acct-nick-st');
    f.addEventListener('submit', async e => {
      e.preventDefault();
      const nick = f.nick.value.trim().replace(/^@/, '');
      if (!/^[\p{L}\p{N}_.-]{2,24}$/u.test(nick)) { st.textContent = t('nBad'); return; }
      const r = await fetch('/api/nick', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ nick }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok) { location.reload(); return; }
      st.textContent = t(j.error === 'taken' ? 'nTaken' : j.error === 'nick' ? 'nBad' : 'nErr');
    });
    d.querySelector('.acct-nick-out').addEventListener('click', async () => { await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' }); location.reload(); });
    d.showModal();
    f.nick.focus();
  }

  function render() {
    const u = info.user;
    if (!u) {
      el.innerHTML = `<button type="button" class="acct-btn acct-in" aria-expanded="false" aria-haspopup="dialog" aria-label="${t('signIn')}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg><span>${t('signIn')}</span></button>
        <div class="acct-pop" hidden role="dialog" aria-label="${t('signIn')}"><p>${t('why')}</p><div class="acct-g"></div>
        <p class="acct-terms">${t('pub')} ${t('terms')} <a href="${pre}/privacy/">${t('termsLink')}</a>.</p>
        ${info.dev ? '<button type="button" class="pill-btn" data-dev>dev login</button>' : ''}</div>`;
    } else {
      el.innerHTML = `<button type="button" class="acct-btn acct-me${u.admin ? ' acct-admin' : ''}" aria-expanded="false" aria-haspopup="menu" aria-label="${t('menu')}"><canvas width="20" height="26" aria-hidden="true"></canvas></button>
        <div class="acct-pop" hidden role="menu">
          <p class="acct-name">${u.nick ? '@' + esc(u.nick) : `<i>${t('noNick')}</i>`}${u.admin ? ` <span class="acct-badge">★ ${t('admin')}</span>` : ''}</p>
          <a role="menuitem" href="${pre}/challenge/${u.nick ? '#works' : ''}">${u.nick ? t('profile') : t('nick')}</a>
          ${u.admin ? `<a role="menuitem" href="/admin/">${t('cabinet')}</a>${document.querySelector('[data-ppb]') ? '<button type="button" role="menuitem" data-edit>✏️ Править страницу</button>' : ''}` : ''}
          <button type="button" role="menuitem" data-out>${t('out')}</button>
        </div>`;
      // админ: режим правки блоков страницы (site-edit.js грузится только для админа)
      const ed = el.querySelector('[data-edit]');
      if (ed) ed.addEventListener('click', () => {
        el.querySelector('.acct-pop').hidden = true;
        const go = () => window.PPEdit && window.PPEdit.toggle();
        if (window.PPEdit) go(); else { const sc = document.createElement('script'); sc.src = '/assets/site-edit.js'; sc.onload = go; document.head.appendChild(sc); }
      });
      if (u.admin && document.querySelector('[data-ppb-hidden]')) document.documentElement.classList.add('pp-admin');
      if (window.PPBirds) el.querySelector('canvas').getContext('2d').drawImage(window.PPBirds.sprite(window.PPBirds.dress(window.PPBirds.looks(u.id), u.avatar), 0), -window.PPBirds.OX, 0);
    }
    const btn = el.querySelector('.acct-btn'), pop = el.querySelector('.acct-pop');
    const close = () => { pop.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const open = pop.hidden;
      pop.hidden = !open; btn.setAttribute('aria-expanded', String(open));
      if (open && !u) google(el.querySelector('.acct-g'));
    });
    document.addEventListener('click', e => { if (!el.contains(e.target)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !pop.hidden) { close(); btn.focus(); } });
    const dev = el.querySelector('[data-dev]');
    dev && dev.addEventListener('click', () => login('dev:' + (prompt('nick?', 'tester') || 'tester')));
    const out = el.querySelector('[data-out]');
    out && out.addEventListener('click', async () => {
      await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' });
      location.reload();
    });
  }

  async function login(credential) {
    const r = await fetch('/api/login', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ credential }) });
    if (r.ok) location.reload();
  }
  function google(box) {
    if (!box || box.dataset.ready) return;
    box.dataset.ready = '1';
    const go = () => {
      window.google.accounts.id.initialize({ client_id: info.clientId, callback: r => login(r.credential), ux_mode: 'popup' });
      window.google.accounts.id.renderButton(box, { theme: 'outline', size: 'large', shape: 'pill', text: 'signin_with', locale: lang });
    };
    if (window.google?.accounts?.id) return go();
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client'; s.async = true; s.onload = go;
    document.head.appendChild(s);
  }
})();
