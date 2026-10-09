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

  const SECTIONS = { overview, comments, analytics, backup, subscribers, birds, edits };
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
        <section class="adm-box"><h2>Новые птицы <a class="adm-all" href="#birds">все →</a></h2>${d.newUsers.length ? `<ul class="adm-list">${d.newUsers.map(u => `<li>${u.nick ? `<a href="/challenge/#@${encodeURIComponent(u.nick)}" target="_blank">@${esc(u.nick)}</a>` : '<i>без ника</i>'}<span>${fmt(u.created_at)}</span></li>`).join('')}</ul>` : '<p class="be-note">Пока никого.</p>'}</section>
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

  // ---------- подарить семечко: фон, обувь, головной убор, анимация, рамка ----------
  function giftDialog(u, done) {
    const B = window.PPBirds; if (!B) return;
    let av = {}; try { av = JSON.parse(u.avatar || '{}') || {}; } catch (e) { /* пусто */ }
    const KINDS = [['hat', '🎩 Головной убор'], ['shoes', '👟 Обувь'], ['item', '🍕 В клюв'], ['scarf', '🧣 Шарфик'], ['bg', '🎨 Фон'], ['frame', '⭕ Рамка'], ['anim', '✨ Анимация']];
    const NAMES = { halo: 'нимб ★', unicorn: 'рог единорога ★', flamecrown: 'корона феникса ★', dragonegg: 'яйцо дракона ★', goldfeather: 'золотое перо ★', comet: 'комета ★', goldenapple: 'золотое яблоко ★', legend: 'легендарная ★', aurora: 'сияние ★', pirate: 'пиратская шляпа', chef: 'колпак повара', graduation: 'шапочка выпускника', paintbrush: 'кисточка', palette: 'палитра', pencil: 'карандаш', coffee: 'кофе', croissant: 'круассан', bounce: 'прыгает', wiggle: 'качается', float: 'парит', spin: 'кружится', sparkle: 'сияет', heart: 'сердечко', wizard: 'шляпа волшебника', witch: 'шляпа ведьмы', pumpkin: 'тыква', santa: 'колпак Санты', antlers: 'рожки оленя', beanie: 'зимняя шапка', heartband: 'ободок с сердцем', wreath: 'весенний венок', strawhat: 'летняя шляпа', leafcrown: 'осенний венок', wand: 'волшебная палочка', crystal: 'хрустальный шар', star: 'звёздочка', lollipop: 'леденец', minipumpkin: 'тыковка', candycane: 'карамельная трость', giftbox: 'подарок', ornament: 'ёлочный шар', snowflake: 'снежинка', heart: 'сердечко', rose: 'роза', letter: 'валентинка', icecream: 'мороженое', mapleleaf: 'кленовый лист', snow: 'снежинки', magic: 'волшебная', spooky: 'хеллоуин', headset: 'игровые наушники', gamepad: 'геймпад', coin: 'монетка', sword: 'пиксельный меч', mushroom: 'грибок', neon: 'неон', pizza: 'пицца', cherry: 'вишенка', cheese: 'сыр', ring: 'колечко', pearl: 'жемчужина', ruby: 'рубин', sapphire: 'сапфир', key: 'ключик', spoon: 'ложечка', gold: 'золотая', rainbow: 'радуга', stars: 'звёзды', hearts: 'сердечки', leaves: 'листики', dotted: 'пунктир' };
    let kind = 'hat', item = B.GIFTS.hat[0], owned = {};
    api('admin/gifts?uid=' + u.id).then(r => { for (const g of r.gifts) owned[g.kind + '|' + g.item] = g.status; draw(); }).catch(() => {});
    const w = document.createElement('div'); w.className = 'adm-gift';
    w.innerHTML = `<div class="adm-gift-card" role="dialog" aria-label="Подарок"><h3>🎁 Подарок для ${u.nick ? '@' + esc(u.nick) : 'птички без ника'}</h3>
      <div class="adm-gift-kinds">${KINDS.map(([k, l]) => `<button type="button" class="pill-btn" data-k="${k}">${l}</button>`).join('')}
        <span class="adm-gift-br"></span>${(B.GIFT_THEMES || []).map(t => `<button type="button" class="pill-btn adm-th" data-th="${t[0]}">${t[1][1]}</button>`).join('')}</div>
      <div class="adm-gift-items"></div>
      <div class="adm-gift-prev"><figure><span class="gnow"></span><figcaption>Сейчас</figcaption></figure><span class="adm-gift-arrow">→</span><figure><span class="gp"></span><figcaption>С подарком</figcaption></figure>
        <p class="be-note">✓ — у птички это уже есть (в сумке), 🎁 — подарено, но ещё не открыто. Человек увидит «🎁 Тебе подарок!» в профиле челленджа.</p></div>
      <input type="text" maxlength="200" placeholder="Записка к подарку (необязательно), например: «За 7 дней подряд!»">
      <div class="adm-quick" style="margin-top:12px"><button type="button" class="pill-btn pill-fill" data-send>Подарить</button><button type="button" class="pill-btn" data-x>Отмена</button></div></div>`;
    document.body.appendChild(w);
    const close = () => w.remove();
    w.onclick = e => { if (e.target === w) close(); };
    w.querySelector('[data-x]').onclick = close;
    let theme = null; // выбрана тема/сезон: показываем вещи разных видов этой темы
    const draw = () => {
      w.querySelectorAll('[data-k]').forEach(b => b.classList.toggle('pill-fill', !theme && b.dataset.k === kind));
      w.querySelectorAll('[data-th]').forEach(b => b.classList.toggle('pill-fill', theme === b.dataset.th));
      const box = w.querySelector('.adm-gift-items'); box.innerHTML = '';
      const th = theme && B.GIFT_THEMES.find(t => t[0] === theme);
      const list = th ? th[2].map(x => x.split('|')) : B.GIFTS[kind].map(v => [kind, v]);
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
      try { await api('admin/gift', { uid: u.id, kind, item, note: w.querySelector('input').value.trim() }); close(); alert('🎁 Подарок отправлен! Он появится у птички в профиле челленджа.'); done && done(); }
      catch (x) { e.target.disabled = false; alert(err(x)); }
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
        <div class="be-filters"><input type="search" id="adm-bq" placeholder="🔍 Найти по нику" value="${esc(bq)}"></div>
        <table class="be-table adm-table"><thead><tr><th>Ник</th>${th('created_at', 'Появилась')}${th('last_seen', 'Заходила')}${th('works', '🎨 Работ')}${th('best', '🔥 Рекорд серии')}<th>Подарки</th></tr></thead><tbody>
        ${list.map(u => `<tr><td>${u.nick ? `<a href="/challenge/#@${encodeURIComponent(u.nick)}" target="_blank">@${esc(u.nick)}</a>` : '<i>без ника</i>'}${u.banned ? ' <small class="be-danger">заблокирована</small>' : ''}</td>
          <td>${fmt(u.created_at)}</td><td>${fmt(u.last_seen)}</td><td>${n(u.works)}</td><td>${n(u.best)}</td>
          <td><button type="button" class="pill-btn" data-gift="${u.id}" title="Подарить семечко для аватара">🎁${u.gifts ? ' ' + u.gifts : ''}</button></td></tr>`).join('')}</tbody></table></section>`;
      main.querySelectorAll('[data-gift]').forEach(b => b.onclick = () => giftDialog(d.users.find(u => u.id === +b.dataset.gift), birds));
      main.querySelectorAll('[data-bsort]').forEach(b => b.onclick = () => { bSort = b.dataset.bsort; draw(); });
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
