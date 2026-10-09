// Кабинет админа: обзор (цифры сайта), все комментарии блога (одобрить, ответить, удалить), аналитика статей.
(function () {
  const main = document.getElementById('adm-main');
  if (!main) return;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const api = async (path, body) => {
    const r = await fetch('/api/' + path, body ? { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : { credentials: 'same-origin' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(d.error || r.status); e.code = d.error || r.status; throw e; }
    return d;
  };
  const fmt = ts => ts ? new Date(ts * 1000).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';
  const title = p => p.t_ru || p.t_en || p.t_lv || '(без названия)';
  const n = v => Number(v || 0).toLocaleString('ru-RU');
  const err = e => e.code === 401 || e.code === 'auth' || e.code === 'login' ? 'Войдите через Google (кнопка в шапке), чтобы открыть кабинет.' : e.code === 'admin' || e.code === 403 ? 'Этот кабинет только для админа.' : 'Не получилось загрузить: ' + esc(e.message);

  const SECTIONS = { overview, comments, analytics, backup, subscribers };
  function route() {
    const sec = (location.hash || '#overview').slice(1);
    document.querySelectorAll('.adm-nav [data-sec]').forEach(a => a.setAttribute('aria-current', a.dataset.sec === sec ? 'page' : 'false'));
    (SECTIONS[sec] || overview)();
  }
  addEventListener('hashchange', route);

  // ---------- обзор ----------
  async function overview() {
    main.innerHTML = '<p class="be-note">Загрузка…</p>';
    let d; try { d = await api('blog/admin/overview'); } catch (e) { main.innerHTML = `<p class="be-note">${err(e)}</p>`; return; }
    pend(d.comments.pending);
    const card = (icon, label, big, small) => `<div class="adm-card"><span class="adm-ic">${icon}</span><b>${big}</b><span>${label}</span>${small ? `<small>${small}</small>` : ''}</div>`;
    main.innerHTML = `
      <div class="adm-quick">
        <a class="pill-btn pill-fill" href="/blog-editor/#new">＋ Новая статья</a>
        <a class="pill-btn" href="#comments">💬 Комментарии${d.comments.pending ? ` — ждут проверки: ${d.comments.pending}` : ''}</a>
        <a class="pill-btn" href="https://dash.cloudflare.com/?to=/:account/web-analytics" target="_blank" rel="noopener">📈 Посетители (Cloudflare) ↗</a>
      </div>
      <div class="adm-cards">
        ${card('📝', 'статей опубликовано', n(d.posts.pub), d.posts.draft ? `черновиков: ${n(d.posts.draft)}` : '')}
        ${card('👁', 'просмотров статей', n(d.posts.views), `лайков: ${n(d.posts.likes)}`)}
        ${card('💬', 'комментариев', n(d.comments.total), `за неделю: ${n(d.comments.week)}`)}
        ${card('🐦', 'птиц в стае', n(d.totals.users), `новых за неделю: ${n(d.users.week)} · заходили: ${n(d.users.active)}`)}
        ${card('🎨', 'работ в челлендже', n(d.totals.works), `за неделю: ${n(d.works.week)}`)}
      </div>
      <div class="adm-cols">
        <section class="adm-box"><h2>Популярные статьи</h2>${d.top.length ? `<ol class="adm-top">${d.top.map(p => `<li><a href="/ru/blog/${esc(p.slug)}/" target="_blank">${esc(title(p))}</a><span>👁 ${n(p.views)} · ♥ ${n(p.likes)} · 💬 ${n(p.comments)}</span><a class="adm-edit" href="/blog-editor/#${p.id}" title="Редактировать">✎</a></li>`).join('')}</ol>` : '<p class="be-note">Пока нет опубликованных статей.</p>'}</section>
        <section class="adm-box"><h2>Новые птицы</h2>${d.newUsers.length ? `<ul class="adm-list">${d.newUsers.map(u => `<li>${u.nick ? `<a href="/challenge/#@${encodeURIComponent(u.nick)}" target="_blank">@${esc(u.nick)}</a>` : '<i>без ника</i>'}<span>${fmt(u.created_at)}</span></li>`).join('')}</ul>` : '<p class="be-note">Пока никого.</p>'}</section>
      </div>
      ${backupBox()}
      <section class="adm-box"><h2>Новые работы в челлендже</h2>${d.newWorks.length ? `<div class="adm-works">${d.newWorks.map(w => `<a href="/api/img/${w.id}" target="_blank" title="@${esc(w.nick)} · ${esc(w.theme || '')} · ${esc(w.day)}"><img src="/api/img/${w.id}?t=1" alt="" loading="lazy"><span>@${esc(w.nick)}</span></a>`).join('')}</div>` : '<p class="be-note">Пока нет работ.</p>'}</section>`;
    wireBackup();
  }
  function pend(k) { const b = document.getElementById('adm-pend'); if (b) { b.hidden = !k; b.textContent = k || ''; } }

  // ---------- комментарии ----------
  let cFilter = 'all';
  async function comments() {
    main.innerHTML = '<p class="be-note">Загрузка…</p>';
    let d; try { d = await api('blog/admin/comments?filter=' + cFilter); } catch (e) { main.innerHTML = `<p class="be-note">${err(e)}</p>`; return; }
    const list = d.comments;
    if (cFilter === 'all') pend(list.filter(c => c.status === 'pending').length);
    main.innerHTML = `
      <div class="adm-cbar"><div class="be-seg adm-seg">${[['all', 'Все'], ['pending', 'Ждут проверки']].map(([k, l]) => `<button type="button" data-cf="${k}" aria-pressed="${cFilter === k}">${l}</button>`).join('')}</div>
        <label class="be-switch"><input type="checkbox" id="adm-strict" ${d.strict ? 'checked' : ''}><span></span><b>Строгий режим</b><small>не больше 1 комментария в час с одного адреса (если начнётся спам)</small></label></div>
      ${list.length ? `<ol class="adm-comments">${list.map(c => `<li class="adm-c${c.status === 'pending' ? ' pending' : ''}" data-cid="${c.id}" data-post="${c.post_id}" data-name="${esc(c.name)}">
        <p class="adm-c-head"><b>${esc(c.name)}</b> → <a href="/ru/blog/${esc(c.slug)}/#comments" target="_blank">${esc(title(c))}</a> <span>${fmt(c.created_at)}</span>${c.status === 'pending' ? ' <em>ждёт проверки (есть ссылка)</em>' : ''}</p>
        <p class="adm-c-body">${esc(c.body).replace(/\n/g, '<br>')}</p>
        <p class="adm-c-acts">${c.status === 'pending' ? '<button type="button" class="pill-btn pill-fill" data-ok>✓ Одобрить</button>' : ''}
          <button type="button" class="pill-btn" data-reply>↩ Ответить</button>
          <button type="button" class="pill-btn be-danger" data-del>🗑 Удалить</button></p></li>`).join('')}</ol>` : `<p class="be-note">${cFilter === 'pending' ? 'Нет комментариев, которые ждут проверки 🎉' : 'Комментариев пока нет.'}</p>`}`;
    main.querySelectorAll('[data-cf]').forEach(b => b.onclick = () => { cFilter = b.dataset.cf; comments(); });
    const st = main.querySelector('#adm-strict');
    st.onchange = async () => { try { await api('blog/admin/settings', { strict: st.checked }); } catch (e) { st.checked = !st.checked; alert(err(e)); } };
    main.querySelectorAll('.adm-c').forEach(li => {
      const id = Number(li.dataset.cid);
      const ok = li.querySelector('[data-ok]');
      ok && (ok.onclick = async () => { try { await api('blog/admin/comment', { id, action: 'approve' }); comments(); } catch (e) { alert(err(e)); } });
      li.querySelector('[data-del]').onclick = async () => { if (!confirm('Удалить комментарий?')) return; try { await api('blog/admin/comment', { id, action: 'delete' }); li.remove(); } catch (e) { alert(err(e)); } };
      li.querySelector('[data-reply]').onclick = () => {
        if (li.querySelector('.adm-reply')) return;
        const f = document.createElement('form'); f.className = 'adm-reply';
        const name = li.dataset.name.replace(/^@/, '');
        f.innerHTML = `<textarea rows="3" maxlength="1500" required>${li.dataset.name.startsWith('@') ? '@' + esc(name) + ', ' : ''}</textarea><p><button class="pill-btn pill-fill" type="submit">Отправить ответ</button> <button class="bc-link" type="button" data-cancel>отмена</button></p>`;
        li.appendChild(f);
        const ta = f.querySelector('textarea'); ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length);
        f.querySelector('[data-cancel]').onclick = () => f.remove();
        f.onsubmit = async e => {
          e.preventDefault();
          try { await api('blog/comment', { id: Number(li.dataset.post), lang: 'ru', body: ta.value }); if (li.classList.contains('pending')) await api('blog/admin/comment', { id, action: 'approve' }); comments(); }
          catch (er) { alert(err(er)); }
        };
      };
    });
  }

  // ---------- аналитика: статьи ----------
  let aSort = 'views';
  async function analytics() {
    main.innerHTML = '<p class="be-note">Загрузка…</p>';
    let d; try { d = await api('blog/admin/posts'); } catch (e) { main.innerHTML = `<p class="be-note">${err(e)}</p>`; return; }
    const posts = d.posts.filter(p => p.status === 'published').sort((a, b) => (b[aSort] || 0) - (a[aSort] || 0));
    const sum = k => posts.reduce((s, p) => s + (p[k] || 0), 0);
    main.innerHTML = `
      <div class="adm-cards">
        <div class="adm-card"><span class="adm-ic">👁</span><b>${n(sum('views'))}</b><span>просмотров всех статей</span></div>
        <div class="adm-card"><span class="adm-ic">♥</span><b>${n(sum('likes'))}</b><span>лайков</span></div>
        <div class="adm-card"><span class="adm-ic">💬</span><b>${n(sum('comments'))}</b><span>комментариев</span></div>
      </div>
      <p class="be-note">Посетители всего сайта (сколько людей, откуда, с каких устройств) — в <a href="https://dash.cloudflare.com/?to=/:account/web-analytics" target="_blank" rel="noopener">Cloudflare Web Analytics ↗</a>.</p>
      <section class="adm-box"><h2>Статьи</h2>
        <table class="be-table adm-table"><thead><tr><th>Статья</th>${[['views', '👁 Просмотры'], ['likes', '♥ Лайки'], ['comments', '💬 Комментарии']].map(([k, l]) => `<th><button type="button" class="adm-sort" data-sort="${k}" aria-pressed="${aSort === k}">${l}${aSort === k ? ' ↓' : ''}</button></th>`).join('')}<th></th></tr></thead>
        <tbody>${posts.map(p => `<tr><td><a href="/ru/blog/${esc(p.slug)}/" target="_blank">${esc(title(p))}</a></td><td>${n(p.views)}</td><td>${n(p.likes)}</td><td>${n(p.comments)}</td><td><a href="/blog-editor/#${p.id}" title="Редактировать">✎</a></td></tr>`).join('')}</tbody></table></section>`;
    main.querySelectorAll('[data-sort]').forEach(b => b.onclick = () => { aSort = b.dataset.sort; analytics(); });
  }

  // ---------- подписчики: «сообщите, когда выйдет книга» ----------
  async function subscribers() {
    main.innerHTML = '<p class="be-note">Загрузка…</p>';
    let d; try { d = await api('admin/subscribers'); } catch (e) { main.innerHTML = `<p class="be-note">${err(e)}</p>`; return; }
    const list = d.subscribers, LN = { en: 'EN', ru: 'RU', lv: 'LV' };
    main.innerHTML = `<section class="adm-box"><h2>📬 Ждут новость о книге: ${list.length}</h2>
      <p class="be-note">Люди оставили адрес под книгой и согласились получить письмо, когда она выйдет. Когда будете рассылать — вставляйте адреса в поле <b>«Скрытая копия» (BCC)</b>, чтобы получатели не видели адреса друг друга, и допишите в конце: «Если больше не хотите писем — ответьте на это письмо, и я удалю ваш адрес» (или дайте ссылку на сайт: под книгой есть «Отписаться»).</p>
      ${list.length ? `<div class="adm-quick"><button type="button" class="pill-btn pill-fill" data-copyall>📋 Скопировать все адреса</button><button type="button" class="pill-btn" data-csv>⬇ Скачать таблицу (CSV)</button></div>
      <table class="be-table adm-table"><thead><tr><th>Email</th><th>Язык</th><th>Когда</th><th></th></tr></thead><tbody>
      ${list.map(s => `<tr data-id="${s.id}"><td>${esc(s.email)}</td><td>${LN[s.lang] || ''}</td><td>${fmt(s.created_at)}</td><td><button type="button" class="bc-link be-danger" data-delsub title="Удалить адрес (например, если человек попросил)">Удалить</button></td></tr>`).join('')}</tbody></table>` : '<p class="be-note">Пока никто не подписался.</p>'}</section>`;
    const all = list.map(s => s.email).join(', ');
    const cp = main.querySelector('[data-copyall]');
    cp && (cp.onclick = async () => { try { await navigator.clipboard.writeText(all); cp.textContent = '✓ Скопировано: ' + list.length; } catch (e) { prompt('Скопируйте адреса:', all); } });
    const csv = main.querySelector('[data-csv]');
    csv && (csv.onclick = () => {
      const rows = [['email', 'language', 'subscribed', 'consent'], ...list.map(s => [s.email, s.lang || '', new Date(s.created_at * 1000).toISOString(), s.consent || ''])];
      const text = rows.map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\n');
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff' + text], { type: 'text/csv' })); a.download = 'pigeonpolly-podpischiki.csv'; a.click();
    });
    main.querySelectorAll('[data-delsub]').forEach(b => b.onclick = async () => {
      if (!confirm('Удалить этот адрес из списка?')) return;
      try { await api('admin/subscribers', { id: Number(b.closest('tr').dataset.id) }); subscribers(); } catch (e) { alert(err(e)); }
    });
  }

  // ---------- копии сайта ----------
  const backupBox = () => `<section class="adm-box"><h2>💾 Копии сайта</h2>
      <p class="be-note">Полная копия — два архива: данные (статьи, комментарии, челлендж, все картинки) и код сайта с GitHub. Автокопия кладёт их в ваш Google Drive каждый понедельник.</p>
      <div class="adm-quick"><button type="button" class="pill-btn pill-fill" data-bk="download">💾 Скачать полную копию</button>
        <button type="button" class="pill-btn" data-bk="auto">🔁 Автокопия в Google Drive</button>
        <label class="pill-btn adm-restore">♻ Восстановить из копии<input type="file" accept=".zip" hidden data-bk="restore"></label></div></section>`;
  function wireBackup() {
    const B = window.PPBackup; if (!B) return;
    main.querySelectorAll('[data-bk="download"]').forEach(b => b.onclick = () => B.download(b));
    main.querySelectorAll('[data-bk="auto"]').forEach(b => b.onclick = () => B.autoPanel());
    main.querySelectorAll('[data-bk="restore"]').forEach(inp => inp.onchange = () => { const f = inp.files[0]; inp.value = ''; if (f) B.restore(f, inp.closest('label')); });
  }
  function backup() { main.innerHTML = backupBox(); wireBackup(); }

  route();
})();
