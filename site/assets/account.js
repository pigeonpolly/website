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
    editor: ['Blog editor', 'Редактор блога', 'Bloga redaktors'],
    out: ['Sign out', 'Выйти', 'Iziet'],
    menu: ['Account', 'Аккаунт', 'Konts'],
  };
  const t = k => S[k][L];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let info = null;

  fetch('/api/whoami', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).then(d => { if (d) { info = d; render(); } }).catch(() => {});

  function render() {
    const u = info.user;
    if (!u) {
      el.innerHTML = `<button type="button" class="acct-btn acct-in" aria-expanded="false" aria-haspopup="dialog" aria-label="${t('signIn')}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg><span>${t('signIn')}</span></button>
        <div class="acct-pop" hidden role="dialog" aria-label="${t('signIn')}"><p>${t('why')}</p><div class="acct-g"></div>
        ${info.dev ? '<button type="button" class="pill-btn" data-dev>dev login</button>' : ''}</div>`;
    } else {
      el.innerHTML = `<button type="button" class="acct-btn acct-me" aria-expanded="false" aria-haspopup="menu" aria-label="${t('menu')}"><canvas width="20" height="26" aria-hidden="true"></canvas></button>
        <div class="acct-pop" hidden role="menu">
          <p class="acct-name">${u.nick ? '@' + esc(u.nick) : `<i>${t('noNick')}</i>`}</p>
          <a role="menuitem" href="${pre}/challenge/${u.nick ? '#works' : ''}">${u.nick ? t('profile') : t('nick')}</a>
          ${u.admin ? `<a role="menuitem" href="/blog-editor/">${t('editor')}</a>` : ''}
          <button type="button" role="menuitem" data-out>${t('out')}</button>
        </div>`;
      if (window.PPBirds) el.querySelector('canvas').getContext('2d').drawImage(window.PPBirds.sprite(window.PPBirds.looks(u.id), 0), -window.PPBirds.OX, 0);
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
