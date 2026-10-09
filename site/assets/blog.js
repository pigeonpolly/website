// Блог для посетителя: лайк, комментарии (аноним «птица + номер» или ник из челленджа), кнопки админа.
(function () {
  const lang = document.documentElement.lang || 'en';
  const L = { en: 0, ru: 1, lv: 2 }[lang] ?? 0;
  const S = {
    as: ['You comment as', 'Вы комментируете как', 'Jūs komentējat kā'],
    orSign: ['or sign in to comment with your Challenge nickname:', 'или войдите, чтобы писать под ником из челленджа:', 'vai pieslēdzieties, lai rakstītu ar izaicinājuma segvārdu:'],
    noNick: ['Choose a nickname on the Challenge page to comment under it.', 'Выберите ник на странице челленджа, чтобы писать под ним.', 'Izvēlieties segvārdu izaicinājuma lapā, lai rakstītu ar to.'],
    place: ['Write a comment…', 'Напишите комментарий…', 'Uzrakstiet komentāru…'],
    send: ['Send', 'Отправить', 'Sūtīt'],
    pending: ['Thanks! Your comment has a link, so it will appear after a quick check.', 'Спасибо! В комментарии есть ссылка, он появится после проверки.', 'Paldies! Komentārā ir saite, tas parādīsies pēc pārbaudes.'],
    rate: ['Too many comments in a row. Please try again in a few minutes.', 'Слишком много комментариев подряд. Попробуйте через несколько минут.', 'Pārāk daudz komentāru pēc kārtas. Mēģiniet pēc dažām minūtēm.'],
    strict: ['Right now you can post one comment per hour. Please come back a bit later.', 'Сейчас можно оставлять один комментарий в час. Загляните чуть позже.', 'Šobrīd var rakstīt vienu komentāru stundā. Lūdzu, atgriezieties vēlāk.'],
    error: ['Something went wrong. Please try again.', 'Что-то пошло не так. Попробуйте ещё раз.', 'Kaut kas nogāja greizi. Mēģiniet vēlreiz.'],
    del: ['Delete', 'Удалить', 'Dzēst'], approve: ['Approve', 'Одобрить', 'Apstiprināt'],
    waiting: ['Waiting for review', 'Ждут проверки', 'Gaida pārbaudi'], sure: ['Delete this comment?', 'Удалить комментарий?', 'Dzēst komentāru?'],
    logout: ['Sign out', 'Выйти', 'Iziet'],
  };
  const t = k => S[k][L];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const api = async (path, body) => {
    const r = await fetch('/api/' + path, body ? { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : { credentials: 'same-origin' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(d.error || r.status); e.code = d.error; throw e; }
    return d;
  };

  const art = document.querySelector('.bp[data-post-id]');
  const id = art ? Number(art.dataset.postId) : 0;
  let st = null;

  async function load() {
    try { st = await api(`blog/state?id=${id}&lang=${lang}`); } catch (e) { return; }
    document.querySelectorAll('[data-blog-admin]').forEach(el => { el.hidden = !st.admin; });
    if (!art) return;
    const like = art.querySelector('.bp-like');
    like.setAttribute('aria-pressed', st.liked ? 'true' : 'false');
    like.querySelector('.bp-likes').textContent = st.likes;
    renderForm();
    if (st.admin) adminTools();
  }

  function renderForm() {
    const box = art.querySelector('[data-comment-form]');
    const who = st.user && st.user.nick
      ? `${t('as')} <b>@${esc(st.user.nick)}</b> · <button type="button" class="bc-link" data-out>${t('logout')}</button>`
      : `${t('as')} <b>🐦 ${esc(st.anon)}</b>`;
    box.innerHTML = `<form class="bc-form">
      <textarea name="body" rows="4" maxlength="1500" required placeholder="${t('place')}"></textarea>
      <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="bc-row"><p class="bc-who">${who}</p><button class="pill-btn pill-fill" type="submit">${t('send')}</button></div>
      ${st.user ? (st.user.nick ? '' : `<p class="bc-hint"><a href="/${lang === 'en' ? '' : lang + '/'}challenge/">${t('noNick')}</a></p>`)
        : `<div class="bc-sign"><span>${t('orSign')}</span><span class="bc-g"></span>${st.dev ? '<button type="button" class="pill-btn" data-dev>dev login</button>' : ''}</div>`}
      <p class="bc-status" role="status" aria-live="polite"></p></form>`;
    const f = box.querySelector('form');
    f.addEventListener('submit', async e => {
      e.preventDefault();
      const status = f.querySelector('.bc-status'), btn = f.querySelector('button[type=submit]');
      btn.disabled = true; status.textContent = '';
      try {
        const r = await api('blog/comment', { id, lang, body: f.body.value, website: f.website.value });
        f.body.value = '';
        if (r.status === 'pending') status.textContent = t('pending');
        else if (r.comment) {
          art.querySelector('.bc-list').insertAdjacentHTML('beforeend', r.comment.html);
          const empty = art.querySelector('.bc-empty'); empty && empty.remove();
          const n = art.querySelector('.bp-ccount'); n.textContent = +n.textContent + 1;
          if (st.admin) adminTools();
        }
      } catch (err) { status.textContent = t(err.code === 'rate' ? 'rate' : err.code === 'strict' ? 'strict' : 'error'); }
      btn.disabled = false;
    });
    const out = box.querySelector('[data-out]');
    out && out.addEventListener('click', async () => { await api('logout', {}); load(); });
    const dev = box.querySelector('[data-dev]');
    dev && dev.addEventListener('click', () => login('dev:' + (prompt('nick?', 'tester') || 'tester')));
    const g = box.querySelector('.bc-g');
    if (g) gButton(g);
  }

  async function login(credential) {
    try { await api('login', { credential }); } catch (e) { return; }
    location.reload(); // шапка обновится и, если ника ещё нет, сразу попросит его выбрать
  }
  function gButton(el) {
    const go = () => {
      window.google.accounts.id.initialize({ client_id: st.clientId, callback: r => login(r.credential), ux_mode: 'popup' });
      window.google.accounts.id.renderButton(el, { theme: 'outline', size: 'medium', shape: 'pill', text: 'signin_with', locale: lang });
    };
    if (window.google?.accounts?.id) return go();
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client'; s.async = true; s.onload = go;
    document.head.appendChild(s);
  }

  // админ: удалить любой комментарий, одобрить ожидающие (со ссылками)
  function adminTools() {
    art.querySelectorAll('.bc').forEach(li => {
      if (li.querySelector('.bc-adm')) return;
      li.querySelector('.bc-head').insertAdjacentHTML('beforeend', `<button type="button" class="bc-link bc-adm" data-del>${t('del')}</button>`);
    });
    let pend = art.querySelector('.bc-pending');
    if (!pend && st.pending.length) {
      art.querySelector('.bc-list').insertAdjacentHTML('beforebegin', `<div class="bc-pending"><h3>${t('waiting')}</h3><ol class="bc-plist"></ol></div>`);
      pend = art.querySelector('.bc-pending');
      pend.querySelector('ol').innerHTML = st.pending.map(c => `<li class="bc" data-cid="${c.id}"><p class="bc-head"><b>${esc(c.name)}</b>
        <button type="button" class="bc-link" data-ok>${t('approve')}</button> <button type="button" class="bc-link" data-del>${t('del')}</button></p>
        <div class="bc-body"><p>${esc(c.body)}</p></div></li>`).join('');
    }
  }
  document.addEventListener('click', async e => {
    const b = e.target.closest('[data-del], [data-ok]');
    if (!b || !art) return;
    const li = b.closest('[data-cid]');
    if (b.hasAttribute('data-del') && !confirm(t('sure'))) return;
    try { await api('blog/admin/comment', { id: Number(li.dataset.cid), action: b.hasAttribute('data-ok') ? 'approve' : 'delete' }); } catch (err) { return; }
    if (b.hasAttribute('data-ok')) location.reload(); else li.remove();
  });

  if (art) art.querySelector('.bp-like').addEventListener('click', async e => {
    const btn = e.currentTarget;
    try {
      const r = await api('blog/like', { id });
      btn.setAttribute('aria-pressed', r.liked ? 'true' : 'false');
      btn.querySelector('.bp-likes').textContent = r.likes;
      if (r.liked) { btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop'); }
    } catch (err) { /* молча */ }
  });

  // «Поделиться»: на телефоне — системное окно, на компьютере — меню соцсетей и «скопировать ссылку»
  const share = art && art.querySelector('.bp-share');
  if (share) {
    const { url, title, img } = share.dataset, u = encodeURIComponent(url), tt = encodeURIComponent(title);
    const links = [
      ['Facebook', `https://www.facebook.com/sharer/sharer.php?u=${u}`],
      ['Telegram', `https://t.me/share/url?url=${u}&text=${tt}`],
      ['WhatsApp', `https://wa.me/?text=${tt}%20${u}`],
      ['Pinterest', `https://pinterest.com/pin/create/button/?url=${u}&description=${tt}${img ? '&media=' + encodeURIComponent(img) : ''}`],
      ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${u}`],
      ['X', `https://twitter.com/intent/tweet?url=${u}&text=${tt}`],
      [share.dataset.lEmail, `mailto:?subject=${tt}&body=${tt}%0A${u}`],
    ];
    const menu = document.createElement('div');
    menu.className = 'bp-share-menu'; menu.hidden = true;
    menu.innerHTML = `<button type="button" data-copy>🔗 ${esc(share.dataset.lCopy)}</button>` +
      links.map(([n, h]) => `<a href="${h}" target="_blank" rel="noopener">${esc(n)}</a>`).join('');
    share.parentElement.appendChild(menu);
    const close = () => { menu.hidden = true; share.setAttribute('aria-expanded', 'false'); };
    share.addEventListener('click', async e => {
      e.stopPropagation();
      if (navigator.share && matchMedia('(pointer: coarse)').matches) {
        try { await navigator.share({ title, url }); } catch (err) { /* закрыли окно */ }
        return;
      }
      menu.hidden = !menu.hidden; share.setAttribute('aria-expanded', String(!menu.hidden));
    });
    menu.querySelector('[data-copy]').addEventListener('click', async ev => {
      const b = ev.currentTarget;
      try { await navigator.clipboard.writeText(url); } catch (err) { prompt('', url); }
      b.textContent = share.dataset.lCopied; setTimeout(() => { b.textContent = '🔗 ' + share.dataset.lCopy; close(); }, 1400);
    });
    document.addEventListener('click', e => { if (!menu.contains(e.target)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  // на телефоне панель «Разделы, теги и архив» стоит над статьями — сворачиваем её, чтобы статьи были сразу видны
  const sw = document.querySelector('.bl-sidewrap');
  if (sw && matchMedia('(max-width: 960px)').matches) sw.open = false;

  load();
})();
