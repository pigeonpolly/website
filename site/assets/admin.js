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
  // язык названий статей — тот же, что выбран в редакторе блога («Названия: RU / EN / LV»)
  let vl = 'ru'; try { vl = localStorage.getItem('pp-admin-lang') || 'ru'; } catch (e) {}
  const title = p => [vl, 'ru', 'en', 'lv'].map(l => p['t_' + l]).find(Boolean) || '(без названия)';
  const n = v => Number(v || 0).toLocaleString('ru-RU');
  const err = e => e.code === 401 || e.code === 'auth' || e.code === 'login' ? 'Войдите через Google (кнопка в шапке), чтобы открыть кабинет.' : e.code === 'admin' || e.code === 403 ? 'Этот кабинет только для админа.' : 'Не получилось загрузить: ' + esc(e.message);

  const SECTIONS = { overview, visitors, comments, analytics, backup, subscribers, birds, shop, edits, advent };
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
        <a class="pill-btn" href="#visitors">👥 Посетители: откуда и с чего</a>
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
        <section class="adm-box"><h2>Новые птицы <a class="adm-all" href="#birds">все →</a></h2>${d.newUsers.length ? `<ul class="adm-list">${d.newUsers.map(u => `<li>${u.nick ? `<a href="/bird/?nick=${encodeURIComponent(u.nick)}" target="_blank">@${esc(u.nick)}</a>` : '<i>без ника</i>'}<span>${fmt(u.created_at)}</span></li>`).join('')}</ul>` : '<p class="be-note">Пока никого.</p>'}</section>
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

  // ---------- посетители сайта (своя статистика: /api/admin/visits) ----------
  let vDays = 7;
  const SRC_IC = { 'Google': '🔎', 'Bing': '🔎', 'Yandex': '🔎', 'DuckDuckGo': '🔎', 'Другие поисковики': '🔎', 'Instagram': '📸', 'Facebook': '👥', 'Pinterest': '📌', 'TikTok': '🎵', 'Threads': '🧵',
    'LinkedIn': '💼', 'Telegram': '✈️', 'YouTube': '▶️', 'Patreon': '🎨', 'X (Twitter)': '✖️', 'VK': '🅥', 'Reddit': '👽', 'ChatGPT и др. ИИ': '🤖', 'Почта': '✉️', 'Напрямую': '🔗', 'Другие сайты': '🌐' };
  const DEV_IC = { 'Телефон': '📱', 'Компьютер': '💻', 'Планшет': '📲' };
  let regionName = c => c;
  try { const dn = new Intl.DisplayNames(['ru'], { type: 'region' }); regionName = c => { try { return dn.of(c); } catch (e) { return c; } }; } catch (e) {}
  const flag = c => /^[A-Z]{2}$/.test(c || '') ? String.fromCodePoint(...[...c].map(ch => 127397 + ch.charCodeAt(0))) : '🏳️';
  const pageName = p => p === '/' ? 'Главная' : p === '/ru/' ? 'Главная (RU)' : p === '/lv/' ? 'Главная (LV)' : p;
  const utmUrl = (p, s, c) => `https://www.pigeonpolly.com${p}${p.includes('?') ? '&' : '?'}utm_source=${encodeURIComponent(s)}&utm_campaign=${encodeURIComponent(c)}`;
  const pct = (a, b) => b ? Math.round(a * 100 / b) : 0;
  const delta = (a, b) => { if (!b) return a ? '<small class="adm-up">новое</small>' : ''; const d = Math.round((a - b) * 100 / b); return `<small class="${d >= 0 ? 'adm-up' : 'adm-down'}">${d >= 0 ? '▲' : '▼'} ${Math.abs(d)}% к прошлому периоду</small>`; };
  // горизонтальные полоски: подпись, полоска, число и доля
  const bars = (rows, label, total, extra) => rows.length ? `<ul class="adm-bars">${rows.map(r => `<li><span class="adm-bl">${label(r)}</span><span class="adm-bt"><i style="width:${Math.max(2, pct(r.n, rows[0].n))}%"></i></span><b>${n(r.n)}</b><small>${pct(r.n, total)}%</small>${extra ? extra(r) : ''}</li>`).join('')}</ul>` : '<p class="be-note">Пока нет данных.</p>';
  async function visitors() {
    main.innerHTML = '<p class="be-note">Загрузка…</p>';
    let d; try { d = await api('admin/visits?days=' + vDays); } catch (e) { main.innerHTML = `<p class="be-note">${err(e)}</p>`; return; }
    const N = d.now, P = d.prev, sum = a => a.reduce((s, r) => s + r.n, 0);
    const srcTotal = sum(d.sources), devTotal = sum(d.devices);
    // по каждому источнику: какая доля пришла с телефона
    const sd = {}; d.sourceDevices.forEach(r => { (sd[r.k] = sd[r.k] || {})[r.d] = r.n; });
    const mob = r => { const x = sd[r.k] || {}, t = Object.values(x).reduce((a, b) => a + b, 0); return `<em title="с телефона">📱 ${pct(x['Телефон'] || 0, t)}%</em>`; };
    // график по дням: все дни периода, даже пустые
    const byDay = Object.fromEntries(d.series.map(r => [r.day, r]));
    const days = []; for (let i = d.days - 1; i >= 0; i--) { const s = new Date(Date.now() - i * 86400000).toLocaleDateString('sv-SE', { timeZone: 'Europe/Riga' }); days.push({ day: s, people: (byDay[s] || {}).people || 0, views: (byDay[s] || {}).views || 0 }); }
    const max = Math.max(1, ...days.map(x => x.people));
    const dd = s => new Date(s + 'T12:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', weekday: d.days <= 14 ? 'short' : undefined });
    const chart = d.days === 1 ? '' : `<section class="adm-box"><h2>Люди по дням</h2>
      <div class="adm-chart" role="img" aria-label="Посетители по дням">${days.map(x => `<div class="adm-col" tabindex="0" data-tip="${esc(dd(x.day))}: ${n(x.people)} чел. · ${n(x.views)} просм."><i style="height:${x.people ? Math.max(3, x.people * 100 / max) : 0}%"></i></div>`).join('')}</div>
      <div class="adm-chart-x"><span>${dd(days[0].day)}</span><span class="adm-chart-tip" aria-live="polite">Наведите или нажмите на столбик</span><span>${dd(days[days.length - 1].day)}</span></div></section>`;
    const per = [[1, 'Сегодня'], [7, '7 дней'], [30, '30 дней'], [90, '3 месяца'], [365, 'Год']];
    main.innerHTML = `
      <div class="adm-filter" role="toolbar" aria-label="Период">${per.map(([k, l]) => `<button type="button" class="pill-btn" data-days="${k}" aria-pressed="${vDays === k}">${l}</button>`).join('')}
        <span class="adm-live">🟢 сейчас на сайте: <b>${n(d.online)}</b></span></div>
      <div class="adm-cards">
        <div class="adm-card"><span class="adm-ic">👥</span><b>${n(N.people)}</b><span>человек</span>${delta(N.people, P.people)}</div>
        <div class="adm-card"><span class="adm-ic">🚪</span><b>${n(N.visits)}</b><span>заходов на сайт</span>${delta(N.visits, P.visits)}</div>
        <div class="adm-card"><span class="adm-ic">📄</span><b>${n(N.views)}</b><span>просмотров страниц</span><small>${N.visits ? (N.views / N.visits).toFixed(1).replace('.', ',') + ' стр. за заход' : ''}</small></div>
        <div class="adm-card"><span class="adm-ic">📱</span><b>${pct(N.mobile, N.people)}%</b><span>с телефона</span></div>
      </div>
      ${chart}
      <div class="adm-cols">
        <section class="adm-box"><h2>Откуда пришли</h2><p class="be-note">Каждый заход на сайт: с какого сайта или приложения. «Напрямую» — набрали адрес, закладка или ссылка из мессенджера (WhatsApp, Viber не сообщают, откуда).</p>
          ${bars(d.sources, r => `${SRC_IC[r.k] || '🌐'} ${esc(r.k)}`, srcTotal, mob)}</section>
        <section class="adm-box"><h2>Устройства</h2>${bars(d.devices, r => `${DEV_IC[r.k] || ''} ${esc(r.k)}`, devTotal)}
          <h3>Система</h3>${bars(d.os, r => esc(r.k), sum(d.os))}</section>
      </div>
      <div class="adm-cols">
        <section class="adm-box"><h2>Страны</h2>${bars(d.countries, r => `${flag(r.k)} ${esc(regionName(r.k))}`, sum(d.countries))}</section>
        <section class="adm-box"><h2>Браузер / приложение</h2><p class="be-note">«Внутри приложения» — открыли ссылку прямо в Instagram, TikTok и т.п.</p>${bars(d.browsers, r => esc(r.k), sum(d.browsers))}</section>
      </div>
      <div class="adm-cols">
        <section class="adm-box"><h2>С какой страницы начали</h2>${bars(d.landing, r => `<a href="${esc(r.k)}" target="_blank">${esc(pageName(r.k))}</a>`, sum(d.landing))}</section>
        <section class="adm-box"><h2>Сайты, которые на вас ссылаются</h2>${bars(d.refs, r => esc(r.k), sum(d.refs))}
          <h3>Язык сайта</h3>${bars(d.langs, r => esc(r.k), sum(d.langs))}</section>
      </div>
      <section class="adm-box"><h2>Популярные страницы</h2>
        <table class="be-table adm-table"><thead><tr><th>Страница</th><th>📄 Просмотры</th><th>👥 Люди</th></tr></thead>
        <tbody>${d.pages.map(r => `<tr><td data-l="Страница"><a href="${esc(r.k)}" target="_blank">${esc(pageName(r.k))}</a></td><td data-l="Просмотры">${n(r.n)}</td><td data-l="Люди">${n(r.p)}</td></tr>`).join('') || '<tr><td colspan="3">Пока нет данных.</td></tr>'}</tbody></table></section>
      <section class="adm-box"><h2>🏷 Ваши ссылки с метками</h2>
        <p class="be-note">Ставьте такую ссылку в пост, пин или сторис — и здесь будет видно, сколько людей пришло именно по ней. Заполните страницу сайта, где выложите ссылку, и название (например, <code>pin-001</code>) и нажмите «Сохранить».</p>
        <div class="adm-utm"><input type="text" placeholder="Страница сайта, например /flock/" data-utm-p value="/"><select data-utm-s aria-label="Где выложите">${['pinterest', 'instagram', 'tiktok', 'facebook', 'threads', 'telegram', 'linkedin', 'patreon', 'email'].map(x => `<option>${x}</option>`).join('')}</select><input type="text" placeholder="Название (pin-001)" data-utm-c><input type="text" placeholder="Заметка (необязательно)" data-utm-n><button type="button" class="pill-btn pill-fill" data-utm-go>＋ Сохранить</button></div>
        <p class="be-note" data-utm-out></p>
        ${d.links.length ? `<table class="be-table adm-table adm-links"><thead><tr><th>Ссылка</th><th>🚪 Заходов всего</th><th>👥 Людей</th><th>За период</th><th></th></tr></thead><tbody>
        ${d.links.map(l => { const url = utmUrl(l.path, l.source, l.campaign); return `<tr><td data-l="Ссылка"><b>${esc(l.campaign)}</b> <small>· ${esc(l.source)} → ${esc(pageName(l.path))}</small>${l.note ? `<br><small>${esc(l.note)}</small>` : ''}<br><button type="button" class="bc-link" data-copy="${esc(url)}">📋 Скопировать ссылку</button></td>
          <td data-l="Заходов всего"><b>${n(l.all)}</b></td><td data-l="Людей">${n(l.people)}</td><td data-l="За период">${n(l.period)}</td><td><button type="button" class="bc-link be-danger" data-del="${l.id}" title="Удалить">🗑</button></td></tr>`; }).join('')}</tbody></table>` : '<p class="be-note">Сохранённых ссылок пока нет.</p>'}
        ${(() => { const other = d.campaigns.filter(r => !d.links.some(l => l.campaign === r.k)); return other.length ? `<h3>Другие метки (не сохранены)</h3>${bars(other, r => `${esc(r.k)} <small>(${esc(r.s || '')})</small>`, sum(other))}` : ''; })()}</section>
      <p class="be-note">Считается без cookie: один человек за сутки — один раз (по зашифрованному отпечатку, сам IP не сохраняется). Ваши собственные заходы (когда вы вошли как админ) и роботы не считаются. Статистика копится с ${esc(d.first || 'момента включения')}.</p>`;
    main.querySelectorAll('[data-days]').forEach(b => b.onclick = () => { vDays = Number(b.dataset.days); visitors(); });
    const tip = main.querySelector('.adm-chart-tip');
    main.querySelectorAll('.adm-col').forEach(c => { const show = () => { tip.textContent = c.dataset.tip; main.querySelectorAll('.adm-col.on').forEach(x => x.classList.remove('on')); c.classList.add('on'); }; c.onmouseenter = show; c.onfocus = show; c.onclick = show; });
    const copy = (link, btn, label) => (navigator.clipboard ? navigator.clipboard.writeText(link) : Promise.reject()).then(() => { btn.textContent = '✓ Скопировано'; setTimeout(() => btn.textContent = label, 1600); }).catch(() => prompt('Скопируйте ссылку:', link));
    main.querySelectorAll('[data-copy]').forEach(b => b.onclick = () => copy(b.dataset.copy, b, '📋 Скопировать ссылку'));
    main.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => {
      if (!confirm('Удалить эту ссылку из списка? Заходы по ней останутся в общей статистике.')) return;
      try { await api('admin/links', { delete: Number(b.dataset.del) }); visitors(); } catch (e) { alert(err(e)); }
    });
    const go = main.querySelector('[data-utm-go]'), out = main.querySelector('[data-utm-out]');
    go.onclick = async () => {
      let p = main.querySelector('[data-utm-p]').value.trim() || '/'; p = p.replace(/^https?:\/\/[^/]+/, '').split('#')[0]; if (!p.startsWith('/')) p = '/' + p;
      if (!/[?.]/.test(p) && !p.endsWith('/')) p += '/';
      const c = main.querySelector('[data-utm-c]').value.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9а-яё_-]/gi, '');
      if (!c) { out.textContent = 'Напишите название ссылки, например pin-001.'; return; }
      // проверяем, что такая страница есть на сайте
      const ok = await fetch(p.split('?')[0], { method: 'HEAD' }).then(r => r.ok).catch(() => true);
      if (!ok) { out.innerHTML = `Страницы <code>${esc(p)}</code> на сайте нет — проверьте адрес (например, <code>/flock/</code>, <code>/challenge/</code>, <code>/shop/</code>).`; return; }
      go.disabled = true;
      try { await api('admin/links', { path: p, source: main.querySelector('[data-utm-s]').value, campaign: c, note: main.querySelector('[data-utm-n]').value.trim() }); }
      catch (e) { go.disabled = false; out.textContent = err(e); return; }
      const link = utmUrl(p, main.querySelector('[data-utm-s]').value, c);
      await visitors();
      const o = main.querySelector('[data-utm-out]'); if (o) o.innerHTML = `Сохранено и скопировано: <code>${esc(link)}</code>`;
      navigator.clipboard && navigator.clipboard.writeText(link).catch(() => {});
    };
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
      <p class="be-note">Посетители всего сайта (сколько людей, откуда, с каких устройств) — в разделе <a href="#visitors">👥 Посетители</a>.</p>
      <section class="adm-box"><h2>Статьи</h2>
        <table class="be-table adm-table"><thead><tr><th>Статья</th>${[['views', '👁 Просмотры'], ['likes', '♥ Лайки'], ['comments', '💬 Комментарии']].map(([k, l]) => `<th><button type="button" class="adm-sort" data-sort="${k}" aria-pressed="${aSort === k}">${l}${aSort === k ? ' ↓' : ''}</button></th>`).join('')}<th></th></tr></thead>
        <tbody>${posts.map(p => `<tr><td><a href="/ru/blog/${esc(p.slug)}/" target="_blank">${esc(title(p))}</a></td><td>${n(p.views)}</td><td>${n(p.likes)}</td><td>${n(p.comments)}</td><td><a href="/blog-editor/#${p.id}" title="Редактировать">✎</a></td></tr>`).join('')}</tbody></table></section>`;
    main.querySelectorAll('[data-sort]').forEach(b => b.onclick = () => { aSort = b.dataset.sort; analytics(); });
  }

  // ---------- правки блоков сайта (режим «✏️ Править страницу») ----------
  async function edits() {
    main.innerHTML = '<p class="be-note">Загрузка…</p>';
    let d; try { d = await api('admin/blocks'); } catch (e) { main.innerHTML = `<p class="be-note">${err(e)}</p>`; return; }
    const L = { en: '', ru: '/ru', lv: '/lv', '*': '' };
    main.innerHTML = `<section class="adm-box"><h2>🧩 Правки сайта: ${d.blocks.length}</h2>
      <p class="be-note">Блоки, которые вы изменили или скрыли прямо на сайте. Чтобы править: откройте страницу и в меню аккаунта (птичка справа вверху) выберите <b>«✏️ Править страницу»</b>, затем нажмите на нужный блок.</p>
      ${d.blocks.length ? `<table class="be-table adm-table"><thead><tr><th>Страница</th><th>Блок</th><th>Что</th><th>Когда</th><th></th></tr></thead><tbody>
      ${d.blocks.map(b => `<tr data-id="${esc(b.id)}" data-lang="${b.lang}"><td><a href="${L[b.lang]}${esc(b.page || '/')}" target="_blank">${b.page && b.page !== '/' ? esc(b.page) : 'Главная'}</a></td><td><code>${esc(b.id)}</code></td>
        <td>${b.id.startsWith('page:') ? '🔀 порядок блоков и новые блоки' : b.id.startsWith('custom-') ? '＋ новый блок (' + b.lang.toUpperCase() + ')' : b.lang === '*' ? '🙈 скрыт на всех языках' : '✎ изменён (' + b.lang.toUpperCase() + ')'}</td><td>${fmt(b.updated_at)}</td>
        <td><button type="button" class="bc-link be-danger" data-undo>${b.lang === '*' ? 'Показать' : 'Вернуть как было'}</button></td></tr>`).join('')}</tbody></table>` : '<p class="be-note">Правок пока нет — сайт такой, как в коде.</p>'}</section>`;
    main.querySelectorAll('[data-undo]').forEach(btn => btn.onclick = async () => {
      const tr = btn.closest('tr'), id = tr.dataset.id, l = tr.dataset.lang;
      if (!confirm(l === '*' ? 'Снова показать этот блок посетителям?' : 'Убрать правку и вернуть оригинал этого блока?')) return;
      try { await api('admin/blocks', id.startsWith('page:') ? { id, lang: '*', html: null } : l === '*' ? { id, lang: '*', hidden: false } : { id, lang: l, html: null }); edits(); } catch (e) { alert(err(e)); }
    });
  }

  // ---------- адвент-календарь: что в каком окошке (advent-admin.js) ----------
  function advent() {
    main.innerHTML = '<section class="adm-box"><h2>🎄 Адвент-календарь</h2><p class="be-note">Окошки открываются только в свой день (по Риге), каждая птичка получает все вещи окошка. Прошедшие дни видны всем. <a href="/ru/advent/" target="_blank">Открыть календарь ↗</a></p><div class="adm-adv"></div></section>';
    if (window.PPAdventAdmin) window.PPAdventAdmin.mount(main.querySelector('.adm-adv'));
    else main.querySelector('.adm-adv').innerHTML = '<p class="be-note">Не загрузился advent-admin.js.</p>';
  }

  // ---------- подарить семечко: фон, обувь, головной убор, анимация, рамка ----------
  function giftDialog(u, done) {
    const B = window.PPBirds; if (!B) return;
    const all = !u; if (all) u = { id: 2, nick: null, avatar: '{}' }; // «подарить всем»
    let av = {}; try { av = JSON.parse(u.avatar || '{}') || {}; } catch (e) { /* пусто */ }
    const KINDS = [['any', '🎲 Сюрпризы'], ['hat', '🎩 Головной убор'], ['shoes', '👟 Обувь'], ['item', '🍕 В клюв'], ['scarf', '🧣 Шарфик'], ['bg', '🎨 Фон'], ['frame', '⭕ Рамка'], ['anim', '✨ Анимация'], ...(B.GIFTS.furn ? [['furn', '🛋 Мебель'], ['deco', '🎄 Украшения'], ['wall', '🧱 Обои'], ['floor', '🟫 Пол'], ['view', '🪟 Вид из окна'], ['curtain', '🎀 Шторы']] : [])];
    const NAMES = { halo: 'нимб ★', unicorn: 'рог единорога ★', flamecrown: 'корона феникса ★', dragonegg: 'яйцо дракона ★', goldfeather: 'золотое перо ★', comet: 'комета ★', goldenapple: 'золотое яблоко ★', legend: 'легендарная ★', aurora: 'сияние ★', pirate: 'пиратская шляпа', chef: 'колпак повара', graduation: 'шапочка выпускника', paintbrush: 'кисточка', palette: 'палитра', pencil: 'карандаш', coffee: 'кофе', croissant: 'круассан', bounce: 'прыгает', wiggle: 'качается', float: 'парит', spin: 'кружится', sparkle: 'сияет', heart: 'сердечко', wizard: 'шляпа волшебника', witch: 'шляпа ведьмы', pumpkin: 'тыква', santa: 'колпак Санты', antlers: 'рожки оленя', beanie: 'зимняя шапка', heartband: 'ободок с сердцем', wreath: 'весенний венок', strawhat: 'летняя шляпа', leafcrown: 'осенний венок', wand: 'волшебная палочка', crystal: 'хрустальный шар', star: 'звёздочка', lollipop: 'леденец', minipumpkin: 'тыковка', candycane: 'карамельная трость', giftbox: 'подарок', ornament: 'ёлочный шар', snowflake: 'снежинка', heart: 'сердечко', rose: 'роза', letter: 'валентинка', icecream: 'мороженое', mapleleaf: 'кленовый лист', snow: 'снежинки', magic: 'волшебная', spooky: 'хеллоуин', headset: 'игровые наушники', gamepad: 'геймпад', coin: 'монетка', sword: 'пиксельный меч', mushroom: 'грибок', neon: 'неон', pizza: 'пицца', cherry: 'вишенка', cheese: 'сыр', ring: 'колечко', pearl: 'жемчужина', ruby: 'рубин', sapphire: 'сапфир', key: 'ключик', spoon: 'ложечка', gold: 'золотая', rainbow: 'радуга', stars: 'звёзды', hearts: 'сердечки', leaves: 'листики', dotted: 'пунктир' };
    let kind = 'hat', item = B.GIFTS.hat[0], owned = {};
    if (!all) api('admin/gifts?uid=' + u.id).then(r => { for (const g of r.gifts) owned[g.kind + '|' + g.item] = g.status; draw(); }).catch(() => {});
    const w = document.createElement('div'); w.className = 'adm-gift';
    w.innerHTML = `<div class="adm-gift-card" role="dialog" aria-label="Подарок"><h3>${all ? '🎁 Подарок всем птичкам' : `🎁 Подарок для ${u.nick ? '@' + esc(u.nick) : 'птички без ника'}`}</h3>${all ? '<p class="be-note">Получит каждая птичка с ником (кроме заблокированных). У кого такой вещи уже максимум (3, легендарной — 1), тому не придёт.</p>' : ''}
      <div class="adm-gift-kinds">${KINDS.map(([k, l]) => `<button type="button" class="pill-btn" data-k="${k}">${l}</button>`).join('')}
        <span class="adm-gift-br"></span>${(B.GIFT_THEMES || []).map(t => `<button type="button" class="pill-btn adm-th" data-th="${t[0]}">${t[1][1]}</button>`).join('')}</div>
      <div class="adm-gift-items"></div>
      <div class="adm-gift-prev"><figure><span class="gnow"></span><figcaption>Сейчас</figcaption></figure><span class="adm-gift-arrow">→</span><figure><span class="gp"></span><figcaption>С подарком</figcaption></figure>
        <p class="be-note">✓ — у птички это уже есть (в сумке), 🎁 — подарено, но ещё не открыто. Человек увидит «🎁 Тебе подарок!» в профиле челленджа.</p></div>
      <input type="text" maxlength="200" placeholder="Записка к подарку (необязательно), например: «За 7 дней подряд!»">
      <div class="adm-quick" style="margin-top:12px"><button type="button" class="pill-btn pill-fill" data-send>Подарить</button><button type="button" class="pill-btn" data-x>Готово</button></div><p class="adm-gift-sent" aria-live="polite"></p></div>`;
    document.body.appendChild(w);
    // окно не закрывается после подарка — можно подарить несколько вещей подряд; список подаренного — внизу
    let sent = 0;
    const close = () => { w.remove(); if (sent && done) done(); };
    const sentNote = txt => { sent++; const p = w.querySelector('.adm-gift-sent'); p.insertAdjacentHTML('afterbegin', `<span>${esc(txt)}</span>`); };
    w.onclick = e => { if (e.target === w) close(); };
    w.querySelector('[data-x]').onclick = close;
    let theme = null; // выбрана тема/сезон: показываем вещи разных видов этой темы
    const draw = () => {
      w.querySelectorAll('[data-k]').forEach(b => b.classList.toggle('pill-fill', !theme && b.dataset.k === kind));
      w.querySelectorAll('[data-th]').forEach(b => b.classList.toggle('pill-fill', theme === b.dataset.th));
      const box = w.querySelector('.adm-gift-items'); box.innerHTML = '';
      const th = theme && B.GIFT_THEMES.find(t => t[0] === theme);
      const list = th ? th[2].map(x => x.split('|')) : (B.withSurprise ? B.withSurprise(kind) : B.GIFTS[kind]).map(v => [kind, v]);
      for (const [kd, v] of list) {
        const nm = NAMES[v] || (B.giftName ? B.giftName(kd, v, 1) : v);
        const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-pressed', String(v === item && kd === kind)); b.title = nm;
        b.appendChild(B.giftPic ? B.giftPic(kd, v, u.id, 56, av) : B.avatar(u.id, Object.assign({}, av, { [kd]: v }), 48));
        if (B.LEGEND && B.LEGEND.has(kd + '|' + v)) b.insertAdjacentHTML('beforeend', '<span class="legend-tag">★</span>');
        if (NAMES[v] || th) b.insertAdjacentHTML('beforeend', `<small>${esc(nm)}</small>`);
        const st = owned[kd + '|' + v];
        if (st) { b.classList.add('owned'); b.insertAdjacentHTML('beforeend', `<span class="adm-own">${st === 'new' ? '🎁' : '✓'}</span>`); }
        if (av[kd] === v) b.classList.add('worn');
        b.onclick = () => { item = v; kind = kd; draw(); };
        box.appendChild(b);
      }
      const gn = w.querySelector('.gnow'); if (!gn.firstChild) gn.appendChild(B.avatar(u.id, av, 96));
      const gp = w.querySelector('.gp'); gp.innerHTML = ''; gp.appendChild(B.avatar(u.id, Object.assign({}, av, { [kind]: item }), 96));
    };
    w.querySelectorAll('[data-th]').forEach(b => b.onclick = () => { theme = b.dataset.th; const first = B.GIFT_THEMES.find(t => t[0] === theme)[2][0].split('|'); kind = first[0]; item = first[1]; draw(); });
    w.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { theme = null; kind = b.dataset.k; item = B.GIFTS[kind][0]; draw(); });
    w.querySelector('[data-send]').onclick = async e => {
      e.target.disabled = true;
      try {
        if (all) { if (!confirm('Подарить «' + (B.giftName ? B.giftName(kind, item, 1) : item) + '» всем птичкам?')) { e.target.disabled = false; return; } const r = await api('admin/gift-all', { kind, item, note: w.querySelector('input').value.trim() }); sentNote('🎁 ' + (B.giftName ? B.giftName(kind, item, 1) : item) + ' — отправлено ' + r.count + ' птичкам'); e.target.disabled = false; return; }
        const r = await api('admin/gift', { uid: u.id, kind, item, note: w.querySelector('input').value.trim() });
        const gk = r && r.kind || kind, got = r && r.item || item; owned[gk + '|' + got] = 'new'; // у сюрприза сервер называет, что выпало
        sentNote('🎁 ' + (B.giftName ? B.giftName(gk, got, 1) : got) + ' — подарено'); e.target.disabled = false; draw(); }
      catch (x) { e.target.disabled = false; alert(err(x)); }
    };
    draw();
  }

  // ---------- магазин: цена и количество каждой вещи из коллекций ----------
  // цена от остатка — как effPrice в worker/index.js: ценность × (10 / остаток)^0.4, от ×0.75 до ×2.5 (у легендарных обычный запас — 3)
  const effPrice = (base, stock, leg) => base > 0 ? Math.max(5, Math.round(base * Math.max(0.75, Math.min(2.5, Math.pow((leg ? 3 : 10) / Math.max(1, stock || 0), 0.4))) / 5) * 5) : 0;
  let sFilter = 'all', sq = '', sStock = 'all', sSort = 'cat'; const sOpen = new Set(); let sOnly = 'all'; // фильтр таблицы остатков: all / empty (закончились) / low (1–3) // раскрытые категории в таблице остатков // вид/тема, поиск, сколько осталось, порядок
  async function shop() {
    main.innerHTML = '<p class="be-note">Загрузка…</p>';
    let d; try { d = await api('admin/shop'); } catch (e) { main.innerHTML = `<p class="be-note">${err(e)}</p>`; return; }
    const B = window.PPBirds; if (!B) { main.innerHTML = '<p class="be-note">Не загрузился каталог вещей (birds.js).</p>'; return; }
    const rows = {}; d.items.forEach(r => { rows[r.kind + '|' + r.item] = r; });
    const all = []; B.GIFT_KINDS.forEach(k => (B.withSurprise ? B.withSurprise(k[0]) : B.GIFTS[k[0]] || []).forEach(v => all.push({ kind: k[0], kindName: k[1][1], item: v, name: B.giftName(k[0], v, 1) })));
    const draw = () => {
      const theme = sFilter.startsWith('theme:') ? B.GIFT_THEMES.find(t => 'theme:' + t[0] === sFilter) : null, q = sq.trim().toLowerCase();
      const list = all.filter(x => {
        const r = rows[x.kind + '|' + x.item] || {};
        const n = r.stock || 0;
        if (sStock === 'stock' && !(n > 0)) return false;
        if (sStock === 'low' && !(n > 0 && n <= 3)) return false;
        if (sStock === 'none' && n > 0) return false;
        if (sFilter.startsWith('kind:') && sFilter !== 'kind:' + x.kind) return false;
        if (theme && !theme[2].includes(x.kind + '|' + x.item)) return false;
        return !q || x.name.toLowerCase().includes(q) || x.item.toLowerCase().includes(q);
      });
      const cnt = x => (rows[x.kind + '|' + x.item] || {}).stock || 0;
      if (sSort === 'few') list.sort((a, b) => cnt(a) - cnt(b)); else if (sSort === 'many') list.sort((a, b) => cnt(b) - cnt(a));
      // сводка по видам: сколько вещей в продаже и сколько штук всего
      const pl1 = n => n % 10 === 1 && n % 100 !== 11 ? 'вещь' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'вещи' : 'вещей';
      // «по 5 шт.» / «от 2 до 8 шт.» / «нет в продаже» + сколько закончились
      const stockTxt = xs => { const ns = xs.map(cnt), mn = Math.min(...ns), mx = Math.max(...ns), zero = ns.filter(n => !n).length;
        if (!mx) return '<span class="adm-sk-0">нет в продаже</span>'; const t = mn === mx ? 'по ' + mx + ' шт.' : 'от ' + mn + ' до ' + mx + ' шт.';
        return t + (zero ? ` <span class="adm-sk-0">· ${zero} закончились</span>` : ''); };
      const only = x => sOnly === 'empty' ? cnt(x) === 0 : sOnly === 'low' ? cnt(x) > 0 && cnt(x) <= 3 : true;
      const sum = B.GIFT_KINDS.map(k => { const xs = all.filter(x => x.kind === k[0]); const on = xs.filter(x => cnt(x) > 0); return { k: k[0], name: k[1][1], total: xs.length, on: on.length, pcs: on.reduce((a, x) => a + cnt(x), 0), low: on.filter(x => cnt(x) <= 3).length, txt: stockTxt(xs), hit: xs.filter(only).length, each: (ns => ns.length ? (Math.min(...ns) === Math.max(...ns) ? String(ns[0]) : Math.min(...ns) + '–' + Math.max(...ns)) : '—')(xs.filter(x => !(B.LEGEND && B.LEGEND.has(x.kind + '|' + x.item))).map(cnt)) }; });
      const onSale = all.filter(x => (rows[x.kind + '|' + x.item] || {}).stock > 0).length;
      const fb = (k, l) => `<button type="button" class="pill-btn" data-sf="${k}" aria-pressed="${sFilter === k}">${l}</button>`;
      main.innerHTML = `<section class="adm-box"><h2>🛍 Магазин</h2>
        <p class="be-note">Здесь все вещи из «Коллекций». «Ценность» — цена при обычном запасе (10 шт., у легендарных — 3); её уже расставила по вещам, можно поменять. Покупатели видят «цену сейчас»: чем меньше осталось, тем дороже (до ×2.5), чем больше — тем дешевле (до ×0.75). Остаток 0 — «нет в наличии». Сейчас в продаже: <b>${onSale}</b> из ${all.length}. Сохраняется сразу.</p>
        <div class="be-filters"><input type="search" id="adm-sq" placeholder="🔍 Найти вещь" value="${esc(sq)}"></div>
        <section class="adm-stockbox"><h3>📦 Остаток по категориям</h3>
          <p class="be-note">Сколько штук каждой вещи продаётся. Впишите число и нажмите «Поставить» — у всех вещей категории станет столько штук (легендарные не меняются). Нажмите на название категории, чтобы открыть её вещи и поменять по одной. Цена считается сама: меньше штук — дороже.</p>
          <div class="adm-sbar"><span class="adm-sl">Показать:</span>${[['all', 'Все'], ['empty', '✕ Закончились'], ['low', '⚠️ Скоро закончатся (1–3 шт.)']].map(([k, l]) => `<button type="button" class="pill-btn" data-only="${k}" aria-pressed="${sOnly === k}">${l}</button>`).join('')}</div>
          ${sOnly !== 'all' && !sum.some(r => r.hit) ? '<p class="be-note">Таких вещей нет 🎉</p>' : ''}
          <table class="be-table adm-table adm-stock"><thead><tr><th>Категория</th><th>Сейчас в продаже</th><th>Поставить всем вещам категории</th></tr></thead><tbody>
          ${sum.filter(r => sOnly === 'all' || r.hit).map(r => `<tr data-sk="${r.k}"><td><button type="button" class="adm-exp" data-exp="${r.k}" aria-expanded="${sOpen.has(r.k)}">${sOpen.has(r.k) ? '▾' : '▸'} ${esc(r.name)}</button><small class="adm-sk-n">${r.total} ${pl1(r.total)}</small></td><td>${sOnly === 'all' ? r.txt : `<span class="adm-sk-0">${r.hit} ${pl1(r.hit)} ${sOnly === 'empty' ? 'закончились' : 'скоро закончатся'}</span><br><small>${r.txt}</small>`}</td><td class="adm-setst"><input type="number" min="0" max="10000" inputmode="numeric" placeholder="—" aria-label="Остаток: ${esc(r.name)}"><button type="button" class="pill-btn" data-set="${r.k}">${sOnly === 'all' ? 'Поставить' : 'Пополнить'}</button></td></tr>${sOpen.has(r.k) ? `<tr class="adm-sk-items"><td colspan="3"><div class="adm-sk-grid">${all.filter(x => x.kind === r.k && only(x)).map(x => { const w = rows[x.kind + '|' + x.item] || { price: 0, stock: 0 }, leg = B.LEGEND && B.LEGEND.has(x.kind + '|' + x.item); return `<div class="adm-sk-it${leg ? ' adm-legend' : ''}${(w.stock || 0) > 0 ? '' : ' off'}" data-k="${esc(x.kind)}" data-i="${esc(x.item)}"><span class="adm-shop-pic"></span><span class="adm-sk-nm">${esc(x.name)}${leg && !x.name.includes('★') ? ' ★' : ''}</span><label>Остаток <input type="number" min="0" max="100000" inputmode="numeric" value="${w.stock || 0}" data-f="stock"></label><label>Ценность <input type="number" min="0" max="100000" inputmode="numeric" value="${w.base ?? w.price ?? 0}" data-f="price"></label><small class="adm-shop-st">${w.stock > 0 ? '🔘 ' + w.price : '—'}</small></div>`; }).join('')}</div></td></tr>` : ''}`).join('')}
          <tr data-sk="*"><td><b>Весь магазин</b><small class="adm-sk-n">${all.length} ${pl1(all.length)}</small></td><td>${sum.reduce((a, r) => a + r.on, 0)} в продаже, ${sum.reduce((a, r) => a + r.pcs, 0)} шт. всего</td><td class="adm-setst"><input type="number" min="0" max="10000" inputmode="numeric" placeholder="—" aria-label="Остаток всем"><button type="button" class="pill-btn" data-set="*">${sOnly === 'all' ? 'Поставить всем' : 'Пополнить все найденные'}</button></td></tr></tbody></table>
          <p><button type="button" class="pill-btn pill-fill" id="adm-set-all">💾 Сохранить все заполненные</button> <button type="button" class="pill-btn adm-empty" id="adm-empty-all">🧹 Опустошить полки</button></p></section>
        <div class="adm-sbar"><span class="adm-sl">Сколько:</span>${[['all', 'Все'], ['stock', '🛍 В продаже'], ['low', '⚠️ Мало (1–3)'], ['none', '✕ Нет в наличии']].map(([k, l]) => `<button type="button" class="pill-btn" data-ss="${k}" aria-pressed="${sStock === k}">${l}</button>`).join('')}
          <label class="adm-sl">Порядок: <select id="adm-sort"><option value="cat">по видам</option><option value="few"${sSort === 'few' ? ' selected' : ''}>меньше всего сверху</option><option value="many"${sSort === 'many' ? ' selected' : ''}>больше всего сверху</option></select></label></div>
        <div class="adm-sbar"><span class="adm-sl">Что:</span>${fb('all', 'Все')}${B.GIFT_KINDS.map(k => fb('kind:' + k[0], k[1][1])).join('')}${B.GIFT_THEMES.map(t => fb('theme:' + t[0], t[1][1])).join('')}</div>
        <table class="be-table adm-table adm-shop"><thead><tr><th>Вещь</th><th>Вид</th><th>Ценность 🔘</th><th>Остаток</th><th>Цена сейчас</th></tr></thead><tbody>
        ${list.map(x => { const r = rows[x.kind + '|' + x.item] || { price: 0, stock: 0 }; const leg = B.LEGEND && B.LEGEND.has(x.kind + '|' + x.item); return `<tr data-k="${esc(x.kind)}" data-i="${esc(x.item)}"${leg ? ' class="adm-legend"' : ''}><td class="adm-shop-it"><span class="adm-shop-pic"></span>${esc(x.name)}${leg ? ' <span class="adm-leg-tag" title="Легендарная: 1 штука на птичку, дарить нельзя">★ легендарная</span>' : ''}</td><td>${esc(x.kindName)}</td>
          <td data-l="Цена 🔘"><input type="number" inputmode="numeric" min="0" max="100000" step="1" value="${r.base ?? r.price}" data-f="price" aria-label="Ценность" title="Цена при обычном запасе (10 шт., у легендарных — 3)"></td><td data-l="Количество"><input type="number" inputmode="numeric" min="0" max="100000" step="1" value="${r.stock}" data-f="stock" aria-label="Количество"></td><td class="adm-shop-st">${r.stock > 0 ? '🔘 ' + r.price : '—'}</td></tr>`; }).join('')}</tbody></table></section>`;
      main.querySelectorAll('[data-only]').forEach(b => b.onclick = () => { sOnly = b.dataset.only; draw(); });
      main.querySelectorAll('[data-exp]').forEach(b => b.onclick = () => { const k = b.dataset.exp; sOpen.has(k) ? sOpen.delete(k) : sOpen.add(k); draw(); });
      main.querySelectorAll('.adm-sk-it').forEach(el => { try { el.querySelector('.adm-shop-pic').appendChild(B.giftPic(el.dataset.k, el.dataset.i, 2, 40)); } catch (e) {} });
      main.querySelectorAll('tr[data-k]').forEach(tr => { const pic = tr.querySelector('.adm-shop-pic'); try { pic.appendChild(B.giftPic(tr.dataset.k, tr.dataset.i, 2, 48)); } catch (e) {} });
      main.querySelectorAll('[data-sf]').forEach(b => b.onclick = () => { sFilter = b.dataset.sf; draw(); });
      main.querySelectorAll('[data-ss]').forEach(b => b.onclick = () => { sStock = b.dataset.ss; draw(); });
      main.querySelector('#adm-sort').onchange = e => { sSort = e.target.value; draw(); };
      // поставить остаток: категории (или всему магазину) — каждой вещи ровно столько штук
      const setStock = async (pairs, btn) => {
        const items = []; let what = [];
        for (const [k, n] of pairs) { const xs = (k === '*' ? all : all.filter(x => x.kind === k)).filter(x => only(x) && !(B.LEGEND && B.LEGEND.has(x.kind + '|' + x.item))); xs.forEach(x => items.push([x.kind, x.item, n])); what.push((k === '*' ? 'весь магазин' : (sum.find(r => r.k === k) || {}).name) + ' — по ' + n + ' шт. (' + xs.length + ')'); }
        if (!items.length) return alert('Впишите остаток хотя бы для одной категории.');
        if (!confirm('Поставить остаток:\n' + what.join('\n'))) return;
        if (btn) btn.disabled = true;
        try { const r = await api('admin/shop/restock', { items, set: true }); Object.keys(rows).forEach(k => delete rows[k]); r.items.forEach(x => { rows[x.kind + '|' + x.item] = x; }); draw(); }
        catch (x) { if (btn) btn.disabled = false; alert(err(x)); }
      };
      const val = tr => { const v = tr.querySelector('input').value.trim(); return v === '' ? null : Math.max(0, Math.min(10000, Math.floor(+v) || 0)); };
      main.querySelectorAll('[data-set]').forEach(b => b.onclick = () => { const n = val(b.closest('tr')); if (n == null) return alert('Впишите число.'); setStock([[b.dataset.set, n]], b); });
      // опустошить полки: остаток 0 у всех вещей (и легендарных); ценность остаётся — цены снова посчитаются при пополнении
      main.querySelector('#adm-empty-all').onclick = async e => {
        if (!confirm('Опустошить полки? У всех ' + all.length + ' вещей (и легендарных) остаток станет 0 — в магазине ничего не будет в продаже. Ценность вещей не изменится.')) return;
        if (!confirm('Точно? Это нельзя отменить одной кнопкой — пополнять придётся заново.')) return;
        e.target.disabled = true;
        try { const r = await api('admin/shop/restock', { items: all.map(x => [x.kind, x.item, 0]), set: true }); Object.keys(rows).forEach(k => delete rows[k]); r.items.forEach(x => { rows[x.kind + '|' + x.item] = x; }); draw(); }
        catch (x) { e.target.disabled = false; alert(err(x)); }
      };
      main.querySelector('#adm-set-all').onclick = e => setStock([...main.querySelectorAll('tr[data-sk]')].map(tr => [tr.dataset.sk, val(tr)]).filter(x => x[1] != null), e.target);
      const inp = main.querySelector('#adm-sq');
      inp.oninput = () => { sq = inp.value; draw(); const x = main.querySelector('#adm-sq'); x.focus(); x.setSelectionRange(x.value.length, x.value.length); };
      main.querySelectorAll('.adm-shop input, .adm-sk-it input').forEach(i => i.onchange = async () => {
        const tr = i.closest('[data-i]'), kind = tr.dataset.k, item = tr.dataset.i;
        const price = tr.querySelector('[data-f="price"]').value, stock = tr.querySelector('[data-f="stock"]').value;
        tr.classList.remove('saved');
        try { const r = await api('admin/shop', { kind, item, price, stock }), cur = effPrice(r.price, r.stock, B.LEGEND && B.LEGEND.has(kind + '|' + item)); rows[kind + '|' + item] = { kind, item, base: r.price, price: cur, stock: r.stock }; tr.classList.add('saved'); tr.querySelector('.adm-shop-st').textContent = r.stock > 0 ? '🔘 ' + cur : '—'; }
        catch (e) { alert(err(e)); }
      });
    };
    draw();
  }

  // ---------- все птицы ----------
  let bSort = 'created_at', bq = '';
  async function birds() {
    main.innerHTML = '<p class="be-note">Загрузка…</p>';
    let d; try { d = await api('admin/users'); } catch (e) { main.innerHTML = `<p class="be-note">${err(e)}</p>`; return; }
    const draw = () => {
      const q = bq.trim().toLowerCase().replace(/^@/, '');
      const list = d.users.filter(u => !q || (u.nick || '').toLowerCase().includes(q)).sort((a, b) => (b[bSort] || 0) - (a[bSort] || 0));
      const week = d.users.filter(u => u.created_at > Date.now() / 1000 - 7 * 86400).length;
      const th = (k, l) => `<th><button type="button" class="adm-sort" data-bsort="${k}" aria-pressed="${bSort === k}">${l}${bSort === k ? ' ↓' : ''}</button></th>`;
      main.innerHTML = `<section class="adm-box"><h2>🐦 Все птицы: ${d.users.length}</h2>
        <p class="be-note">Новых за неделю: <b>${week}</b>. Нажмите на ник, чтобы открыть профиль и работы.</p>
        <p><button type="button" class="pill-btn pill-fill" id="adm-giftall">🎁 Подарить всем</button> <button type="button" class="pill-btn" id="adm-backfill">🔘 Начислить всем за прошлые бейджи и рисунки</button> <small class="be-note">Повторно не начислит — каждая награда даётся один раз.</small></p>
        <div class="be-filters"><input type="search" id="adm-bq" placeholder="🔍 Найти по нику" value="${esc(bq)}"></div>
        <table class="be-table adm-table adm-birds"><thead><tr><th>Ник</th>${th('created_at', 'Появилась')}${th('last_seen', 'Заходила')}${th('works', '🎨 Работ')}${th('best', '🔥 Рекорд серии')}${th('buttons', '🔘 Пуговки')}${th('invited', '👥 Позвали')}<th>Подарки</th></tr></thead><tbody>
        ${list.map(u => `<tr><td>${u.nick ? `<a href="/bird/?nick=${encodeURIComponent(u.nick)}" target="_blank">@${esc(u.nick)}</a>` : '<i>без ника</i>'}${u.banned ? ' <small class="be-danger">заблокирована</small>' : ''}</td>
          <td data-l="Появилась">${fmt(u.created_at)}</td><td data-l="Заходила">${fmt(u.last_seen)}</td><td data-l="🎨 Работ">${n(u.works)}</td><td data-l="🔥 Рекорд">${n(u.best)}</td>
          <td data-l="🔘 Пуговки"><b>${n(u.buttons)}</b> <button type="button" class="adm-mini" data-btn="${u.id}" title="Добавить или забрать пуговки">±</button></td><td data-l="👥 Позвали">${n(u.invited)}</td>
          <td data-l="Подарки"><button type="button" class="pill-btn" data-gift="${u.id}" title="Подарить семечко для аватара">🎁${u.gifts ? ' ' + u.gifts : ''}</button></td></tr>`).join('')}</tbody></table></section>`;
      main.querySelectorAll('[data-gift]').forEach(b => b.onclick = () => giftDialog(d.users.find(u => u.id === +b.dataset.gift), birds));
      main.querySelector('#adm-giftall').onclick = () => giftDialog(null, birds);
      main.querySelectorAll('[data-bsort]').forEach(b => b.onclick = () => { bSort = b.dataset.bsort; draw(); });
      main.querySelector('#adm-backfill').onclick = async e => {
        e.target.disabled = true; e.target.textContent = 'Считаю…';
        try { const r = await api('admin/buttons-backfill', {}); alert(`Готово: птиц ${r.users}. Пуговки за прошлые достижения начислены.`); birds(); } catch (x) { alert(err(x)); e.target.disabled = false; }
      };
      main.querySelectorAll('[data-btn]').forEach(b => b.onclick = async () => {
        const u = d.users.find(x => x.id === +b.dataset.btn), v = prompt(`Пуговки для @${u.nick || u.id}: сейчас ${u.buttons}. Сколько добавить? (например 50, или -10 чтобы забрать)`, '10');
        const amount = Math.floor(Number(v)); if (!v || !amount) return;
        try { await api('admin/buttons', { uid: u.id, amount }); u.buttons = Math.max(0, (u.buttons || 0) + amount); draw(); } catch (e) { alert(err(e)); }
      });
      const inp = main.querySelector('#adm-bq');
      inp.oninput = () => { bq = inp.value; draw(); const x = main.querySelector('#adm-bq'); x.focus(); x.setSelectionRange(x.value.length, x.value.length); };
    };
    draw();
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
