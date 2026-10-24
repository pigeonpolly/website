// Кабинет админа: обзор (цифры сайта), все комментарии блога (одобрить, ответить, удалить), аналитика статей.
(function () {
  const main = document.getElementById('adm-main');
  if (!main) return;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const api = async (path, body) => {
    const dev = window.PPDevH ? window.PPDevH() : {}; // ?devdate= на локальном сервере — например, строка «Адвент» в автопилоте с 15 ноября
    const r = await fetch('/api/' + path, body ? { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json', ...dev }, body: JSON.stringify(body) } : { credentials: 'same-origin', headers: dev });
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

  // ---------- разделы кабинета: меню строится из этого списка — новый раздел = одна строка (docs/admin.md) ----------
  // id — адрес /admin/#id · open — какой экран показать (если не тот же id) · href — раздел живёт на другой странице
  // focus — к чему прокрутить экран (свёрнутое раскроется) · about — одна строка «что здесь делается» · count — счётчик из «Входящих»
  // hide — старый адрес (ссылки на него работают), но в меню его нет: экран тот же, что у другого пункта
  const ADMIN_GROUPS = { pub: '✍️ Публиковать', birds: '🐦 Птицы', shop: '🛍 Магазин и игры', stats: '📊 Статистика', service: '⚙️ Сервис' };
  const rulesBox = re => m => [...m.querySelectorAll('.adm-rules h3')].find(h => re.test(h.textContent));
  const ADMIN_SECTIONS = [
    { id: 'inbox', ic: '📥', name: 'Входящие', about: 'Только то, что ждёт вас. Пусто — значит, всё спокойно.', count: 'total' },
    { id: 'blog', ic: '✍️', name: 'Блог', group: 'pub', href: '/blog-editor/', count: 'scheduled' },
    { id: 'requests', ic: '🖍', name: 'Нарисуй мне', group: 'pub', href: '/ru/requests/', count: 'requests' },
    { id: 'themes', ic: '🗓', name: 'Темы челленджа', group: 'pub', about: 'Темы челленджа на любой месяц вперёд: тема на трёх языках, цвета, время; банк ваших тем.' },
    { id: 'art', ic: '🎨', name: 'Картины и палитры', group: 'pub', about: 'Картины, добавленные с сайта, скрытые картины и очередь палитр дня ЭКСТРА.' },
    { id: 'posts', ic: '📣', name: 'Посты', group: 'pub', about: 'Готовые картинки и тексты для соцсетей: тема дня, темы на месяц, палитра, загадка Титоса. Всё рисуется само из того, что сейчас на сайте.' },
    { id: 'notes', ic: '📌', name: 'Объявления', group: 'pub', about: 'Объявления в «Новостях стаи» (/flock/news/): закреплены сверху до выбранной даты, потом — обычной строкой «от Полли».' },
    { id: 'birds', ic: '🐦', name: 'Птицы', group: 'birds', about: 'Все птички стаи: пуговки, подарки, зарплата. Нажмите на ник — откроется профиль.' },
    { id: 'gifts', hide: 1, ic: '🎁', name: 'Подарки и зарплата', open: 'birds', focus: '#adm-giftall', about: 'Подарить вещь одной птичке или всем, выдать зарплату пуговками.' },
    { id: 'comments', ic: '💬', name: 'Комментарии', group: 'birds', about: 'Комментарии к статьям блога: одобрить, ответить, удалить.', count: 'comments' },
    { id: 'strict', hide: 1, ic: '🛡', name: 'Строгий режим', open: 'comments', focus: '#adm-strict', about: 'Строгий режим комментариев: не больше одного комментария в час с одного адреса.' },
    { id: 'mail', ic: '✉️', name: 'Письма', group: 'birds', about: 'Письма птичкам на почту — только тем, кто согласился: уведомления из игр, новые фишки, новости от Полли.' },
    { id: 'subscribers', ic: '📬', name: 'Подписчики', group: 'birds', about: 'Адреса людей, которые ждут письма о новой книге.', count: 'subs' },
    { id: 'shop', ic: '🛍', name: 'Магазин', group: 'shop', about: 'Сколько штук каждой вещи в продаже; цены считаются сами.' },
    { id: 'cards', ic: '🃏', name: 'Карточки', group: 'shop', about: 'Коллекционные карточки: каждая — в одном экземпляре. Новая карточка, правка, номер, скрыть, удалить; цена обычных; импорт коллекций с сайта.' },
    { id: 'advent', ic: '🎄', name: 'Адвент', group: 'shop', about: 'Что лежит в каком окошке адвент-календаря.', count: 'advent' },
    { id: 'titos', ic: '🕵️', name: 'Дела Титоса', group: 'shop', about: 'Какие дела детектива Титоса на сайте и переведены ли они. Новые дела заносятся сами раз в час после выкладки.' },
    { id: 'titos-rules', hide: 1, ic: '📜', name: 'Правила Титоса', open: 'rules', focus: rulesBox(/Детектив Титос/), about: 'Кофе детектива Титоса и пуговки за раскрытые дела.' },
    { id: 'games', hide: 1, ic: '🎮', name: 'Награды игр', open: 'rules', focus: rulesBox(/Пуговичный дождь/), about: 'Сколько пуговок дают игры.' },
    { id: 'overview', ic: '📊', name: 'Обзор', group: 'stats', about: 'Главные цифры сайта: статьи, комментарии, птицы, работы в челлендже.' },
    { id: 'challenge', hide: 1, ic: '📊', name: 'Обзор', open: 'overview', about: 'Главные цифры сайта: статьи, комментарии, птицы, работы в челлендже.' },
    { id: 'flock', hide: 1, ic: '📊', name: 'Обзор', open: 'overview', about: 'Главные цифры сайта: статьи, комментарии, птицы, работы в челлендже.' },
    { id: 'visitors', ic: '👥', name: 'Посетители', group: 'stats', about: 'Сколько людей заходит на сайт, откуда и с каких устройств.' },
    { id: 'analytics', ic: '📈', name: 'Статьи', group: 'stats', about: 'Просмотры, лайки и комментарии каждой статьи.' },
    { id: 'rules', ic: '📜', name: 'Правила', group: 'service', about: 'Что сайт делает сам (автопилот) и все числа: пуговки, бейджи, игры.' },
    { id: 'backup', ic: '💾', name: 'Копии', group: 'service', about: 'Полная копия сайта: скачать, настроить автокопию, восстановить.' },
    { id: 'security', ic: '🔐', name: 'Защита', group: 'service', about: 'PIN админа и код восстановления на случай, если потеряете Google.' },
    { id: 'edits', ic: '🧩', name: 'Правки страниц', group: 'service', about: 'Блоки, которые вы поменяли или скрыли прямо на сайте («✏️ Править страницу»), — здесь их можно вернуть как было.', count: 'edits' },
    { id: 'gemini', hide: 1, ic: '🔑', name: 'Ключ Gemini', href: '/blog-editor/#gemini' },
  ];
  const SECTIONS = { notes, titos, inbox, security, overview: () => overview(), visitors, comments, analytics, backup, subscribers, birds, shop, edits, advent, rules, art,
    themes: () => window.PPChallengeAdmin ? window.PPChallengeAdmin.mount(main) : (main.innerHTML = '<p class="be-note">Не загрузился challenge-admin.js</p>'), // 🎨 Темы челленджа (challenge-admin.js)
    cards: () => window.PPCardsAdmin && window.PPCards ? window.PPCardsAdmin.mount(main) : (main.innerHTML = '<p class="be-note">Не загрузился cards-admin.js</p>'), // 🃏 Карточки (cards-admin.js)
    posts: () => window.PPPostsAdmin ? window.PPPostsAdmin.mount(main) : (main.innerHTML = '<p class="be-note">Не загрузился posts-admin.js</p>'), // 📣 Посты (posts-admin.js)
    mail: () => window.PPMailAdmin ? window.PPMailAdmin.mount(main) : (main.innerHTML = '<p class="be-note">Не загрузился mail-admin.js</p>'), // ✉️ Письма (mail-admin.js)
    carousel: () => window.PPCarousel ? window.PPCarousel(main) : (main.innerHTML = '<p class="be-note">Не загрузился carousel.js</p>') };
  const secOf = id => ADMIN_SECTIONS.find(x => x.id === id);
  const nav = document.getElementById('adm-nav');
  // меню слева — только группы (6 строк); разделы группы — вкладками над экраном
  const inGroup = g => ADMIN_SECTIONS.filter(x => !x.hide && x.group === g);
  const cnt = keys => keys.length ? `<span class="adm-count" data-count="${keys.join(',')}" hidden></span>` : '';
  if (nav) nav.innerHTML = `<a href="#inbox" data-grp="">📥 Входящие${cnt(['total'])}</a>` + Object.entries(ADMIN_GROUPS).map(([g, name]) =>
    `<a href="#${inGroup(g).find(x => !x.href).id}" data-grp="${g}">${name}${cnt(inGroup(g).filter(x => x.count && x.count !== 'total').map(x => x.count))}</a>`).join('');
  const tabLink = (x, cur) => `<a href="${x.href || '#' + x.id}"${x.href ? ' class="adm-ext" title="Откроется на своей странице"' : ''}${x.id === cur ? ' aria-current="page"' : ''}>${x.ic} ${x.name}${x.count ? `<span class="adm-count" data-count="${x.count}"${x.count === 'comments' ? ' id="adm-pend"' : ''} hidden></span>` : ''}</a>`;
  // экран: строка «что здесь делается» сверху, потом сам раздел; focus — прокрутить к нужному месту
  async function route() {
    const id = (location.hash || '#inbox').slice(1), x = secOf(id) || (SECTIONS[id] ? { id } : secOf('inbox'));
    const cur = x.hide ? x.open || x.id : x.id, g = (secOf(cur) || x).group || '';
    document.querySelectorAll('.adm-nav [data-grp]').forEach(a => a.setAttribute('aria-current', a.dataset.grp === g ? 'page' : 'false'));
    const about = document.getElementById('adm-about');
    if (about) about.innerHTML = (g ? `<nav class="adm-tabs" aria-label="${esc(ADMIN_GROUPS[g])}">${inGroup(g).map(t => tabLink(t, cur)).join('')}</nav>` : x.name ? `<h2>${x.ic} ${x.name}</h2>` : '') + (x.about ? `<p>${x.about}</p>` : '');
    if (inboxData) badges(inboxData);
    if (x.id === 'subscribers') api('admin/inbox/seen', { k: 'subs' }).then(() => counts()).catch(() => {}); // открыла — новые уже не новые
    await (SECTIONS[x.open || x.id] || inbox)();
    const f = typeof x.focus === 'function' ? x.focus(main) : x.focus ? main.querySelector(x.focus) : null;
    if (f) {
      for (let d = f.closest('details'); d; d = d.parentElement && d.parentElement.closest('details')) d.open = true;
      const box = f.closest('.adm-box, section, label, p') || f;
      box.scrollIntoView({ behavior: 'smooth', block: 'center' }); box.classList.remove('adm-focus'); void box.offsetWidth; box.classList.add('adm-focus');
    }
  }
  addEventListener('hashchange', route);
  // длинные таблицы и списки — первые 10 строк, остальное по кнопке «Показать все» (кроме таблицы остатков магазина: в ней кнопка «Поставить»)
  const FOLD = 10;
  function foldLong() {
    main.querySelectorAll('table.be-table:not(.adm-stock):not([data-fold]), .adm-box > ol:not([data-fold]), .adm-box > ul:not([data-fold]), ol.adm-comments:not([data-fold]), ul.adm-bars:not([data-fold])').forEach(t => {
      const rows = t.tBodies ? [...(t.tBodies[0] || t).rows] : [...t.children].filter(x => x.tagName === 'LI');
      if (rows.length <= FOLD + 2) return;
      t.dataset.fold = '1';
      const hide = on => rows.slice(FOLD).forEach(r => r.classList.toggle('adm-fold-h', on));
      const b = document.createElement('button'); b.type = 'button'; b.className = 'pill-btn adm-fold-b';
      const set = on => { hide(on); b.textContent = on ? `▾ Показать все (${rows.length})` : '▴ Свернуть'; };
      b.onclick = () => set(!rows[FOLD].classList.contains('adm-fold-h'));
      set(true); t.after(b);
    });
  }
  let foldT = 0;
  new MutationObserver(() => { clearTimeout(foldT); foldT = setTimeout(foldLong, 50); }).observe(main, { childList: true, subtree: true });

  // ---------- 📥 входящие: только то, что ждёт Алину ----------
  let inboxData = null;
  function badges(d) {
    const v = { ...d, comments: d.comments, requests: d.requests, subs: d.subs, edits: d.edits, advent: (d.advent || []).length, scheduled: (d.scheduled || []).length };
    v.total = inboxItems(d).length; // сколько разных дел ждёт
    document.querySelectorAll('#adm [data-count]').forEach(b => { const k = b.dataset.count.split(',').reduce((a, c) => a + (v[c] || 0), 0); b.hidden = !k; b.textContent = k || ''; });
  }
  const counts = () => api('admin/inbox').then(d => { inboxData = d; badges(d); return d; });
  const plural = (k, one, few, many) => k % 10 === 1 && k % 100 !== 11 ? one : [2, 3, 4].includes(k % 10) && ![12, 13, 14].includes(k % 100) ? few : many;
  const dm = ts => { const d = new Date(ts * 1000), p = v => String(v).padStart(2, '0'); return `${p(d.getDate())}.${p(d.getMonth() + 1)} ${p(d.getHours())}:${p(d.getMinutes())}`; };
  function inboxItems(d) {
    const out = [], adv = d.advent || [], sch = d.scheduled || [];
    if (d.comments) out.push({ ic: '💬', n: d.comments, t: `${plural(d.comments, 'комментарий ждёт', 'комментария ждут', 'комментариев ждут')} проверки`, d: 'в них есть ссылки — одобрить или удалить', href: '#comments', cf: 'pending', go: 'Проверить' });
    if (d.requests) out.push({ ic: '🖍', n: d.requests, t: `${plural(d.requests, 'заявка', 'заявки', 'заявок')} «Нарисуй мне»`, d: 'темы, которые ещё не нарисованы', href: '/ru/requests/', go: 'Открыть ↗' });
    if (d.subs) out.push({ ic: '📬', n: d.subs, t: `${plural(d.subs, 'новый подписчик', 'новых подписчика', 'новых подписчиков')}`, d: 'ждут письма о книге', href: '#subscribers', go: 'Посмотреть' });
    if ((d.auto || []).length) out.push({ ic: '🤖', n: d.auto.length, t: 'автопилот: нужно внимание', d: d.auto.map(a => `${esc(a.t)} — ${esc(a.d)}`).join('<br>'), href: '#rules', go: 'Открыть', raw: 1 });
    if (adv.length) out.push({ ic: '🎄', n: adv.length, t: `${plural(adv.length, 'окошко', 'окошка', 'окошек')} адвента ${plural(adv.length, 'пустое', 'пустые', 'пустые')}`, d: `декабрь: ${adv.length > 12 ? adv.slice(0, 12).join(', ') + '…' : adv.join(', ')} — в пустом окошке будут только пуговки`, href: '#advent', go: 'Заполнить' });
    if (d.edits) out.push({ ic: '🧩', n: d.edits, t: `${plural(d.edits, 'правка', 'правки', 'правок')} сайта поверх кода`, d: 'ваш текст закрывает блок из кода: если блок обновят в коде, на сайте всё равно будет ваша правка', href: '#edits', go: 'Проверить' });
    if (sch.length) out.push({ ic: '⏰', n: sch.length, t: `${plural(sch.length, 'статья запланирована', 'статьи запланированы', 'статей запланировано')}`, d: sch.slice(0, 5).map(p => `«${esc(title(p))}» — ${dm(p.published_at)}`).join('<br>'), href: '/blog-editor/#scheduled', go: 'Открыть', raw: 1 });
    return out;
  }
  async function inbox() {
    main.innerHTML = '<p class="be-note">Загрузка…</p>';
    let d; try { d = await counts(); } catch (e) { main.innerHTML = `<p class="be-note">${err(e)}</p>`; return; }
    const items = inboxItems(d);
    main.innerHTML = `<div class="adm-quick"><a class="pill-btn pill-fill" href="/blog-editor/#new">＋ Новая статья</a></div>
      ${items.length ? `<ul class="adm-inbox">${items.map(it => `<li><span class="adm-in-ic">${it.ic}</span><span class="adm-in-n">${n(it.n)}</span>
        <span class="adm-in-t"><b>${it.t}</b><small>${it.raw ? it.d : esc(it.d)}</small></span><a class="pill-btn" href="${it.href}"${it.cf ? ` data-cf-go="${it.cf}"` : ''}>${it.go}</a></li>`).join('')}</ul>`
        : '<p class="adm-calm">Всё спокойно ✓<small>Ничего не ждёт: комментарии проверены, заявок и новых подписчиков нет, автопилот работает.</small></p>'}`;
    main.querySelectorAll('[data-cf-go]').forEach(a => a.addEventListener('click', () => { cFilter = a.dataset.cfGo; }));
  }

  // ---------- 🔐 защита (12.10.2026): PIN админа и код восстановления ----------
  // Не админ, но открыл кабинет — может ввести код восстановления (если потеряла доступ к старому Google).
  function recoverForm() {
    return `<section class="adm-box"><h2>🔑 Вход по коду восстановления</h2>
      <p class="be-note">Если старый Google-аккаунт потерян или его забрали: войди на сайт любым другим аккаунтом Google и введи код с бумажки. Этот аккаунт станет админом, старый — перестанет.</p>
      <form class="adm-sec-f" id="rc-f"><input type="text" autocomplete="off" placeholder="XXXXX-XXXXX-XXXXX-XXXXX" maxlength="40" required><button class="pill-btn pill-fill">Войти как админ</button></form><p class="be-note" id="rc-st" role="status"></p></section>`;
  }
  function wireRecover() {
    const f = document.getElementById('rc-f'); if (!f) return;
    f.onsubmit = async e => { e.preventDefault(); const st = document.getElementById('rc-st'); st.textContent = '…';
      try { await api('recover', { code: f.querySelector('input').value }); st.textContent = '✓ Готово! Теперь ты админ. Задай новый PIN и новый код восстановления.'; setTimeout(() => { location.hash = '#security'; location.reload(); }, 1200); }
      catch (x) { st.textContent = x.code === 'locked' ? 'Слишком много попыток — подожди час.' : x.code === 'login' ? 'Сначала войди через Google (кнопка в шапке).' : 'Код не подошёл.'; } };
  }
  function pinForm(note) {
    return `<section class="adm-box"><h2>🔐 Введи PIN админа</h2><p class="be-note">${note || 'На этом устройстве админские права включатся после PIN — один раз.'}</p>
      <form class="adm-sec-f" id="pin-f"><input type="password" inputmode="numeric" autocomplete="off" maxlength="12" required placeholder="PIN"><button class="pill-btn pill-fill">OK</button></form><p class="be-note" id="pin-st" role="status"></p></section>`;
  }
  function wirePin() {
    const f = document.getElementById('pin-f'); if (!f) return;
    f.onsubmit = async e => { e.preventDefault(); const st = document.getElementById('pin-st'); st.textContent = '…';
      try { await api('admin/pin/verify', { pin: f.querySelector('input').value }); location.reload(); }
      catch (x) { st.textContent = x.code === 'locked' ? 'Слишком много попыток — подожди час.' : 'Не тот PIN.'; f.querySelector('input').value = ''; } };
  }
  async function security() {
    main.innerHTML = '<p class="be-note">Загрузка…</p>';
    let s; try { s = await api('admin/sec'); } catch (e) { main.innerHTML = e.code === 'admin' || e.code === 403 ? recoverForm() : `<p class="be-note">${err(e)}</p>`; wireRecover(); return; }
    if (s.pinSet && !s.pinOk) { main.innerHTML = pinForm(); wirePin(); return; }
    main.innerHTML = `<section class="adm-box"><h2>🔐 PIN админа</h2>
      <p class="be-note">${s.pinSet ? '✓ PIN задан. Даже если кто-то войдёт в твой Google, без PIN он будет обычной птичкой. На каждом новом устройстве PIN нужно ввести один раз.' : '⚠️ PIN не задан: сейчас админом становится любой, кто войдёт в твой Google.'}</p>
      <form class="adm-sec-f" id="pin-set"><input type="password" inputmode="numeric" autocomplete="new-password" minlength="4" maxlength="12" pattern="\\d{4,12}" placeholder="${s.pinSet ? 'Новый PIN' : 'PIN: 4–12 цифр'}" required><input type="password" inputmode="numeric" autocomplete="new-password" maxlength="12" placeholder="Ещё раз" required><button class="pill-btn pill-fill">${s.pinSet ? 'Сменить PIN' : 'Задать PIN'}</button></form>
      <p class="be-note" id="pin-set-st" role="status"></p>
      <p class="be-note">PIN не связан с Google — не используй тот же, что от телефона или банка. После 5 неверных попыток ввод закрывается на час.</p></section>
      <section class="adm-box"><h2>🔑 Код восстановления</h2>
      <p class="be-note">${s.recoverySet ? `✓ Код создан ${fmt(s.recoveryAt)}. Если потеряешь доступ к Google — войди другим аккаунтом Google, открой кабинет и введи этот код.` : '⚠️ Кода ещё нет. Если потеряешь доступ к Google, вернуть админку будет нечем.'}</p>
      ${s.pinSet ? `<button type="button" class="pill-btn pill-fill" id="rc-new">${s.recoverySet ? 'Сделать новый код (старый перестанет работать)' : 'Создать код'}</button>` : '<p class="be-note">Сначала задай PIN — без него код мог бы перевыпустить тот, кто забрал Google.</p>'}
      <div id="rc-out"></div></section>
      ${s.pinSet ? '<section class="adm-danger"><h3>⚠️ Осторожно</h3><button type="button" class="pill-btn be-danger" id="pin-off">Убрать PIN</button><p class="be-note">Без PIN админом станет любой, кто войдёт в ваш Google.</p></section>' : ''}`;
    const f = document.getElementById('pin-set'), st = document.getElementById('pin-set-st');
    f.onsubmit = async e => { e.preventDefault(); const [a, b] = f.querySelectorAll('input');
      if (!/^\d{4,12}$/.test(a.value)) { st.textContent = 'PIN — от 4 до 12 цифр.'; return; }
      if (a.value !== b.value) { st.textContent = 'PIN не совпадает.'; return; }
      try { await api('admin/pin/set', { pin: a.value }); security(); } catch (x) { st.textContent = 'Не получилось: ' + esc(x.code); } };
    const off = document.getElementById('pin-off'); if (off) off.onclick = async () => { if (!confirm('Убрать PIN? Тогда админом снова станет любой, кто войдёт в твой Google.')) return; await api('admin/pin/set', { pin: '' }); security(); };
    const nb = document.getElementById('rc-new'); if (nb) nb.onclick = async () => {
      if (s.recoverySet && !confirm('Сделать новый код? Старый перестанет работать.')) return;
      let d; try { d = await api('admin/recovery/new', {}); } catch (x) { alert('Не получилось: ' + x.code); return; }
      const txt = `Pigeon Polly — код восстановления админки\n\n${d.code}\n\nКак использовать: войди на pigeonpolly.com любым аккаунтом Google, открой pigeonpolly.com/admin/#security и введи код.\nКод одноразовый. Создан: ${new Date().toLocaleString('ru-RU')}\n`;
      document.getElementById('rc-out').innerHTML = `<div class="adm-rc"><p><b>Запиши этот код на бумагу и спрячь.</b> Сайт показывает его один раз и сам не хранит.</p><code>${esc(d.code)}</code>
        <p><button type="button" class="pill-btn" id="rc-dl">⬇ Скачать .txt</button> <button type="button" class="pill-btn" id="rc-pr">🖨 Распечатать</button></p>
        <p class="be-note">Не храни его в Google Диске или Gmail — если Google заберут, заберут и код.</p></div>`;
      document.getElementById('rc-dl').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain' })); a.download = 'pigeonpolly-recovery-code.txt'; a.click(); };
      document.getElementById('rc-pr').onclick = () => { const w = open('', '_blank'); if (!w) return; w.document.write(`<pre style="font:20px/1.5 monospace;padding:40px">${esc(txt)}</pre>`); w.document.close(); w.print(); };
      nb.remove();
    };
  }

  // ---------- обзор ----------
  // «🤖 Автопилот»: что работает само; зелёное — всё хорошо, жёлтое (warn) — стоит заглянуть, красное — нужно внимание
  const autoCard = list => { const bad = list.filter(x => x.ok === false); return `<section class="adm-box adm-auto${bad.length ? ' warn' : ''}"><h3>🤖 Автопилот: ${bad.length ? `нужно внимание (${bad.length})` : 'всё работает само ✓'}</h3>
    <p class="be-note">${bad.length ? 'Ниже красным — что не так. Остальное по-прежнему работает само.' : 'Магазин пополняется, цены и награды подстраиваются, сезоны меняются — ничего настраивать не нужно.'}</p>
    <ul>${list.map(x => `<li class="${x.ok === false ? 'bad' : x.ok === null ? 'off' : x.warn ? 'warn' : 'ok'}"><b>${x.ok === false ? '⚠️' : x.ok === null ? '⏸' : x.warn ? '🟡' : '✓'} ${esc(x.t)}</b> — ${esc(x.d)}</li>`).join('')}</ul></section>`; };
  async function overview(el = main) {
    el.innerHTML = '<p class="be-note">Загрузка…</p>';
    let d; try { d = await api('blog/admin/overview'); } catch (e) { el.innerHTML = `<p class="be-note">${err(e)}</p>`; return; }
    const card = (icon, label, big, small) => `<div class="adm-card"><span class="adm-ic">${icon}</span><b>${big}</b><span>${label}</span>${small ? `<small>${small}</small>` : ''}</div>`;
    el.innerHTML = `<div class="adm-cards">
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
      <section class="adm-box"><h2>Новые работы в челлендже</h2>${d.newWorks.length ? `<div class="adm-works">${d.newWorks.map(w => `<a href="/api/img/${w.id}" target="_blank" title="@${esc(w.nick)} · ${esc(w.theme || '')} · ${esc(w.day)}"><img src="/api/img/${w.id}?t=1" alt="" loading="lazy"><span>@${esc(w.nick)}</span></a>`).join('')}</div>` : '<p class="be-note">Пока нет работ.</p>'}</section>`;
  }
  function pend(k) { const b = document.getElementById('adm-pend'); if (b) { b.hidden = !k; b.textContent = k || ''; } }

  // ---------- 🎨 картины и палитры, добавленные с сайта (/api/palettes; добавляют и скрывают их на страницах галерей) ----------
  async function art() {
    main.innerHTML = '<p class="be-note">Загрузка…</p>';
    let d; try { d = await fetch('/api/palettes', { credentials: 'same-origin' }).then(r => r.json()); } catch (e) { main.innerHTML = `<p class="be-note">${err(e)}</p>`; return; }
    const added = d.added || [], hidden = d.hidden || [];
    main.innerHTML = `<div class="adm-quick"><a class="pill-btn pill-fill" href="/ru/palettes/">🎨 Палитры: добавить картину ↗</a> <a class="pill-btn" href="/ru/art-portfolio/sketchbook/">Мой скетчбук ↗</a></div>
      <p class="be-note">Добавлять и скрывать картины — прямо на страницах галерей: кнопки видны только вам.</p>
      <div class="adm-cards"><div class="adm-card"><span class="adm-ic">🖼</span><b>${n(added.length)}</b><span>картин добавлено с сайта</span></div>
        <div class="adm-card"><span class="adm-ic">🎨</span><b>${n((d.queue || []).length)}</b><span>палитр в очереди дня ЭКСТРА</span></div>
        <div class="adm-card"><span class="adm-ic">🙈</span><b>${n(hidden.length)}</b><span>картин скрыто</span></div></div>
      <section class="adm-box"><h2>Добавлены с сайта</h2>${added.length ? `<div class="adm-works">${added.slice().reverse().map(a => `<a href="/${esc(a.img)}" target="_blank" title="${esc(a.title.ru || a.title.en || '')}"><img src="/${esc(a.thumb)}" alt="" loading="lazy"><span>${esc(a.gallery)}${a.palette ? ' · 🎨' : ''}</span></a>`).join('')}</div>` : '<p class="be-note">Пока ничего.</p>'}</section>`;
  }

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
  // воронки (этап 12): один вид для любой воронки из worker/auth.js FUNNELS — шаги по дням, доля от первого шага
  async function funnels(box, days) {
    if (!box) return;
    let d; try { d = await api('admin/funnels?days=' + days); } catch (e) { box.innerHTML = ''; return; }
    box.innerHTML = d.funnels.map(f => {
      const tot = {}; f.days.forEach(r => f.steps.forEach(s => { tot[s.k] = (tot[s.k] || 0) + (r.n[s.k] || 0); }));
      const first = f.steps[0].k;
      const cell = (row, s, i) => `<td data-l="${esc(s.label)}"><b>${n(row[s.k] || 0)}</b>${i && row[first] ? ` <small>${pct(row[s.k] || 0, row[first])}%</small>` : ''}</td>`;
      return `<section class="adm-box adm-funnel"><h2>🔻 Воронка: ${esc(f.name)}</h2>
        <p class="be-note">За ${d.days} дн. Один человек за сутки на каждом шаге считается один раз; % — от первого шага.</p>
        ${f.days.length ? `<table class="be-table adm-table"><thead><tr><th>День</th>${f.steps.map(s => `<th>${esc(s.label)}</th>`).join('')}</tr></thead><tbody>
          <tr class="adm-total"><td data-l="День"><b>Всего</b></td>${f.steps.map((s, i) => cell(tot, s, i)).join('')}</tr>
          ${f.days.map(r => `<tr><td data-l="День">${new Date(r.day + 'T12:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', weekday: 'short' })}</td>${f.steps.map((s, i) => cell(r.n, s, i)).join('')}</tr>`).join('')}</tbody></table>` : '<p class="be-note">Пока нет данных.</p>'}</section>`;
    }).join('');
  }
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
      <div data-funnels></div>
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
        <tbody>${d.pages.map(r => `<tr><td data-l="Страница"><a href="${esc(r.k)}" target="_blank">${esc(pageName(r.k))}</a></td><td data-l="Просмотры">${n(r.n)}</td><td data-l="Люди">${n(r.p)}</td></tr>`).join('') || '<tr><td colspan="4">Пока нет данных.</td></tr>'}</tbody></table></section>
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
    funnels(main.querySelector('[data-funnels]'), Math.max(vDays, 7));
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
  // 🕵️ Титос: дела в базе (worker/titos.js), «⟳ Импортировать дела» — занести site/assets/titos-cases.json и перевести недостающее
  async function titos(msg) {
    main.innerHTML = '<p class="be-note">Загрузка…</p>';
    let d; try { d = await api('admin/titos'); } catch (e) { main.innerHTML = `<p class="be-note">${err(e)}</p>`; return; }
    main.innerHTML = `<section class="adm-box"><h2>🕵️ Дела: ${d.cases.length}</h2>
      <p class="be-note">Играющих птичек: ${d.players.n}, дальше всех — уровень ${d.players.top}.${msg ? ' ' + esc(msg) : ''}</p>
      <p><button type="button" class="pill-btn" id="adm-titos-imp">⟳ Импортировать дела</button></p>
      ${d.cases.length ? `<table class="be-table adm-table"><thead><tr><th>№</th><th>Дело</th><th>Перевод</th></tr></thead><tbody>
      ${d.cases.map(c => `<tr><td>${c.n}</td><td>${esc(c.title)}</td><td>${c.missing.en || c.missing.lv ? `нет EN: ${c.missing.en}, LV: ${c.missing.lv} — показывается RU` : '✓ EN, LV'}</td></tr>`).join('')}</tbody></table>` : '<p class="be-note">Дел в базе ещё нет — нажмите «Импортировать дела».</p>'}</section>`;
    document.getElementById('adm-titos-imp').onclick = async e => {
      e.target.disabled = true; e.target.textContent = 'Импортирую и перевожу…';
      try { const r = await api('admin/titos/import', {}); titos(r.error ? 'Не вышло: ' + r.error : `Готово: дел ${r.imported}` + (r.errors && r.errors.length ? `, без перевода ${r.errors.length} (нет ключа Gemini?)` : '') + '.'); } catch (x) { alert(err(x)); titos(); }
    };
  }
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

  // ---------- 📣 объявления в «Новостях стаи» (worker/flock-news.js, /api/admin/flock-notes) ----------
  async function notes(edit) {
    main.innerHTML = '<p class="be-note">Загрузка…</p>';
    let d; try { d = await api('admin/flock-notes'); } catch (e) { main.innerHTML = `<p class="be-note">${err(e)}</p>`; return; }
    const cur = edit || { src: 'ru', ru: '', en: '', lv: '', until: '' }, today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Riga' });
    main.innerHTML = `<section class="adm-box"><h2>📣 ${cur.id ? 'Править объявление' : 'Новое объявление'}</h2>
      <p class="be-note">Текст — на одном языке, остальные — кнопкой «Перевести» (перевод можно поправить). До выбранной даты объявление висит сверху ленты, потом — обычной строкой ещё 30 дней.</p>
      <form class="adm-note-f">${['ru', 'en', 'lv'].map(l => `<label>${l.toUpperCase()} <textarea name="${l}" rows="2" maxlength="400">${esc(cur[l])}</textarea></label>`).join('')}
        <label>Закрепить сверху до <input type="date" name="until" value="${esc(cur.until)}" min="${today}"></label>
        <p class="adm-note-btns"><span class="adm-note-tr"></span><button class="pill-btn" type="submit">Опубликовать</button>${cur.id ? ' <button type="button" class="bc-link" data-cancel>Отмена</button>' : ''}</p></form></section>
      <section class="adm-box"><h2>Все объявления: ${d.notes.length}</h2>${d.notes.length ? `<table class="be-table adm-table"><thead><tr><th>Текст</th><th>Сверху до</th><th>Когда</th><th></th></tr></thead><tbody>
      ${d.notes.map(n => `<tr data-id="${n.id}"><td>${esc(n.ru || n[n.src] || n.en)}</td><td>${n.until ? esc(n.until) + (n.until >= today ? ' 📌' : '') : '—'}</td><td>${new Date(n.ts * 1000).toLocaleDateString('ru-RU')}</td>
        <td><button type="button" class="bc-link" data-edit>Править</button> <button type="button" class="bc-link be-danger" data-del>Удалить</button></td></tr>`).join('')}</tbody></table>` : '<p class="be-note">Объявлений пока нет.</p>'}</section>`;
    const f = main.querySelector('.adm-note-f');
    const src = () => ['ru', 'en', 'lv'].find(l => f[l].value.trim()) || 'ru';
    if (window.PPTranslateBtn) main.querySelector('.adm-note-tr').appendChild(window.PPTranslateBtn({ from: src, texts: () => [f[src()].value], fill: (l, t) => { f[l].value = t[0] || ''; }, about: 'short' }));
    f.onsubmit = async e => {
      e.preventDefault();
      try { await api('admin/flock-notes', { id: cur.id, src: src(), ru: f.ru.value, en: f.en.value, lv: f.lv.value, until: f.until.value }); notes(); } catch (x) { alert(err(x)); }
    };
    const cancel = main.querySelector('[data-cancel]'); if (cancel) cancel.onclick = () => notes();
    main.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => notes(d.notes.find(n => n.id === Number(b.closest('tr').dataset.id))));
    main.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => {
      if (!confirm('Удалить объявление из новостей стаи?')) return;
      try { await api('admin/flock-notes', { del: Number(b.closest('tr').dataset.id) }); notes(); } catch (x) { alert(err(x)); }
    });
  }

  // ---------- адвент-календарь: что в каком окошке (advent-admin.js) ----------
  function advent() {
    main.innerHTML = '<section class="adm-box"><h2>🎄 Адвент-календарь</h2><p class="be-note">Окошки открываются только в свой день (по Риге), каждая птичка получает все вещи окошка. Прошедшие дни видны всем. <a href="/ru/advent/" target="_blank">Открыть календарь ↗</a></p><div class="adm-adv"></div></section>';
    if (window.PPAdventAdmin) window.PPAdventAdmin.mount(main.querySelector('.adm-adv'));
    else main.querySelector('.adm-adv').innerHTML = '<p class="be-note">Не загрузился advent-admin.js.</p>';
  }

  // ---------- 📜 правила сайта: что можно поменять (сохраняется в meta 'rules') + полный свод правил с текущими числами ----------
  const BADGE_RU = { bw: 'Нарисовал(а) в Ч/Б', extra: 'День ЭКСТРА-палитры', bday: 'Гость на дне рождения Полли', early: 'Ранняя пташка', owl: 'Ночная сова', comeback: 'С возвращением',
    ten: 'Первая десятка', triple: 'Три в одном', weekend: 'Художник выходного дня', newyear: 'Новогодний скетч', halloween: 'Тыквенный скетч', monthly: 'Каждый месяц', mtheme: 'Тематика месяца (каждый такой бейдж)', inkmaster: 'Мастер туши', alt: 'Через денёк',
    clock: 'Как по часам', veteran: 'Старожил', fifty: 'Полсотни', collector: 'Коллекционер (адвент)', hundred: 'Клуб сотни', robot: 'Бип-буп (ИИ-работа)', cpurple: 'Фиолетовое настроение', cyellow: 'Солнечная серия', cred: 'Красная тревога', cblue: 'Синее настроение', cgreen: 'Зелёные руки' , rain1: 'Под дождём (игра)', rain2: 'Ловкие лапки (игра)', rain3: 'Повелитель ливня (игра)', pot1: 'Первое зелье', pot2: 'Юный алхимик', pot3: 'Мастер котла', potkid: 'Вкус детства (зелье)', maze: 'Лабиринтоход', pan1: 'Блинный подмастерье', pan2: 'Мастер переворота', pan3: 'Блинная легенда Воббленда', panstar: 'Всеобщая любимица', panwash: 'Чисто до скрипа' };
  const LEVEL_RU = { 1: 'Яйцо', 3: 'Птенец', 7: 'Голубёнок', 14: 'Почтовый голубь', 30: 'Голубь-путешественник', 60: 'Голубь-художник', 100: 'Голубь-астронавт', 365: 'Легенда Полли' };
  // условие бейджа: [ключ, подпись до, подпись после] — поля прямо в тексте условия
  const BADGE_COND = {
    early: [['early', 'Загрузить', 'рисунков'], ['earlyBefore', 'до', ':00 утра']], owl: [['owl', 'Загрузить', 'рисунков'], ['owlFrom', 'с', ':00'], ['owlTo', 'до', ':00']],
    ten: [['ten', 'Всего', 'рисунков']], fifty: [['fifty', 'Всего', 'рисунков']], hundred: [['hundred', 'Всего', 'рисунков']], inkmaster: [['inkmaster', '', 'рисунков в Ч/Б']],
    comeback: [['comeback', 'Вернуться после перерыва от', 'дней']], weekend: [['weekend', 'Суббота + воскресенье одних выходных —', 'раз(а)']],
    alt: [['alt', '', 'рисунков подряд строго через день']], clock: [['clock', '', 'рисунков подряд в одно время'], ['clockWin', '± в пределах', 'минут']],
    monthly: [['monthly', 'Рисунки в', 'месяцах подряд']], veteran: [['veteranPer', 'Хотя бы', 'рисунка в месяц'], ['veteranMonths', '', 'месяцев подряд']],
    collector: [['collector', 'Открыть', 'окошек адвента']],
    rain1: [['rainA', '«Пуговичный дождь»: пройти', 'уровней']], rain2: [['rainB', '«Пуговичный дождь»: пройти', 'уровней']], rain3: [['rainC', '«Пуговичный дождь»: пройти', 'уровней']],
    pot2: [['potA', 'Открыть', 'разных зелий']], pot3: [['potB', 'Открыть', 'разных зелий']], maze: [['mazeA', 'Пройти лабиринт', 'уровня']],
    pan1: [['panA', '«Блинная Полли»: пройти', 'уровней']], pan2: [['panB', '«Блинная Полли»: пройти', 'уровней']], pan3: [['panC', '«Блинная Полли»: пройти', 'уровней']], panstar: [['panStar', '«Блинная Полли»: в восторге', 'клиентов за одну игру']],
    ...Object.fromEntries(['cpurple', 'cyellow', 'cred', 'cblue', 'cgreen'].map(k => [k, [['colors', 'Рисунков в дни с этим цветом в теме:', '(общее число для всех 5 цветов)']]])),
  };
  const BADGE_FIXED = { triple: 'Загрузить за один день работы за позавчера, вчера и сегодня', bw: 'Загрузить рисунок в режиме Ч/Б', extra: 'Загрузить рисунок в день ЭКСТРА (раз в месяц)', bday: 'Загрузить рисунок 23 января', newyear: 'Загрузить рисунок 31 декабря или 1 января', halloween: 'Загрузить рисунок 31 октября', robot: 'Загрузить работу и самому поставить галочку 🤖 (пометка админа не считается)' , pot1: 'Сварить первое зелье (любое удачное)', potkid: 'Сварить зелье «Вкус детства»', panwash: '«Блинная Полли»: помыть сковородку со средством' };
  async function rules() {
    // всё, что можно настраивать, — под свёрнутым блоком «Тонкая настройка»; сверху — только «🤖 Автопилот»
    main.innerHTML = '<p class="be-note">Загрузка…</p>';
    let d; try { d = await api('admin/rules'); } catch (e) { main.innerHTML = `<p class="be-note">${err(e)}</p>`; return; }
    const R = d.rules, D = d.defaults, S = d.stock || {}, G = d.gamePrices || {}, IX = (d.btn && d.btn.index) || { on: false, k: 1, avg: 0, base: 0 };
    const pct = k => num(k, R[k], D[k], 0.5, 64) + ' %'; // награды игр — в % от средней цены вещи
    const btnPct = v => v > 0 ? Math.max(1, Math.round(v * (G.avg || 0) / 100)) : 0; // % опорной цены → пуговки (как btnOf в worker)
    const num = (path, v, def, step = 1, w = 70) => `<input type="number" step="${step}" data-r="${path}" value="${v}" style="width:${w}px" title="По умолчанию: ${def}"${String(v) !== String(def) ? ' class="adm-r-changed"' : ''}>`;
    const row = (label, inner, def, note = '') => `<tr><td>${label}${note ? `<br><small class="be-note">${note}</small>` : ''}</td><td>${inner}</td><td class="be-note">${def}</td></tr>`;
    const box = (h, rows, lead = '') => `<section class="adm-box adm-rules"><h3>${h}</h3>${lead ? `<p class="be-note">${lead}</p>` : ''}<table class="be-table adm-table"><thead><tr><th>Что</th><th>Сейчас</th><th>По умолчанию</th></tr></thead><tbody>${rows.join('')}</tbody></table></section>`;
    const btnRows = [['daily', 'Первый заход за сутки'], ['upload', 'Рисунок в челлендж (раз в день)'], ['comment', 'Комментарий'], ['commentsPerDay', 'Сколько комментариев в день приносят пуговки', ''], ['friend', 'Друг указал тебя при регистрации'], ['pick', '«★ Выбор Полли» (за каждую выбранную работу)']]
      .map(([k, l]) => row(l, num(k, R[k], D[k]) + (k === 'commentsPerDay' ? ' шт.' : ' 🔘'), D[k]));
    btnRows.push(row('📮 Карточка дня: бонус за … штампов', num('dayBonusNeed', R.dayBonusNeed, D.dayBonusNeed) + ' из ' + num('dayBonusOf', R.dayBonusOf, D.dayBonusOf), D.dayBonusNeed + ' из ' + D.dayBonusOf, 'штамп — задание дня (заход, рисунок, комментарий, игры, Титос, адвент); бонус раз в сутки'),
      row('🥚 Подарок новичку после ника', `случайная вещь для птички до ${d.welcomeMax || 30} 🔘 — сейчас таких <b>${d.welcomeCount || 0}</b>`, 'случайная', 'кладётся в сумку, в окне «Добро пожаловать» — кнопка «Надеть»'),
      row('🥚 Стартовые пуговки новичку', num('welcomeBtn', R.welcomeBtn, D.welcomeBtn) + ' 🔘', 'цена подарка', '−1 — столько, сколько стоит выпавший подарок; 0 — без пуговок'),
      row('🎉 Праздник Воббленда: вещей нет — пуговки', num('wlBtn', R.wlBtn, D.wlBtn) + ' 🔘', 'цена вещи', '−1 — столько, сколько стоит праздничная вещь; когда у птички уже все вещи этого вида'),
      row('📮 Бонус карточки дня', pct('dayBonusPct') + (G.avg && R.dayBonusPct > 0 ? ` → сейчас <b>${Math.max(1, Math.round(R.dayBonusPct * G.avg / 100))} 🔘</b>` : ''), D.dayBonusPct + ' %', 'от опорной цены вещи'));
    const lvRows = Object.keys(D.levels).map(k => row(`${LEVEL_RU[k] || ''} — рекорд ${k} ${k === '1' ? 'день' : 'дней'} подряд`, num('levels.' + k, R.levels[k], D.levels[k]) + ' 🔘', D.levels[k]));
    const bRows = Object.keys(D.badges).map(k => {
      const cond = BADGE_COND[k] ? BADGE_COND[k].map(([ck, a, b]) => `${a} ${num('cond.' + ck, R.cond[ck], D.cond[ck], 1, 60)} ${b}`).join(' · ') : (BADGE_FIXED[k] || '');
      return `<tr><td><b>${BADGE_RU[k] || k}</b><br><small>${cond}</small></td><td>${num('badges.' + k, R.badges[k], D.badges[k])} 🔘</td><td class="be-note">${D.badges[k]} 🔘${BADGE_COND[k] ? '<br>' + BADGE_COND[k].map(([ck]) => D.cond[ck]).join(' / ') : ''}</td></tr>`;
    });
    const shopRows = [
      row('Сколько одинаковых обычных вещей можно иметь', num('shopMax', R.shopMax, D.shopMax) + ' шт.', D.shopMax, 'и купить, и получить в подарок'),
      row('Сколько одинаковых легендарных', num('legendMax', R.legendMax, D.legendMax) + ' шт.', D.legendMax),
      row('<b>«Мало»</b> — не больше … % от числа птичек', num('lowPct', R.lowPct, D.lowPct, 0.5) + ` % → сейчас <b>1–${S.low} шт.</b>`, D.lowPct + ' %', 'фильтр «Мало» в магазине; цена выше ценности'),
      row('<b>Обычный запас</b> — … % от числа птичек', num('normPct', R.normPct, D.normPct, 0.5) + ` % → сейчас <b>${S.norm} шт.</b>`, D.normPct + ' %', 'при нём цена = ценности; меньше штук — дороже, больше — дешевле'),
      row('<b>«Много»</b> — от … % от числа птичек', num('manyPct', R.manyPct, D.manyPct, 1) + ` % → сейчас <b>от ${S.many} шт.</b>`, D.manyPct + ' %', 'фильтр «Много»; цена ниже ценности'),
      row('Легендарных — … % от этих чисел', num('legendPct', R.legendPct, D.legendPct) + ` % → сейчас мало 1–${S.lowLeg}, обычно ${S.normLeg}, много от ${S.manyLeg}`, D.legendPct + ' %'),
      row('Средняя вещь стоит примерно … дней заработка активной птички', num('priceDays', R.priceDays, D.priceDays) + ' дн.', D.priceDays + ' дн.', 'по этому сайт сам ставит уровень цен раз в сутки'),
      row('Самая низкая цена (доля от ценности)', '×' + num('priceMin', R.priceMin, D.priceMin, 0.05), '×' + D.priceMin, 'когда штук очень много'),
      row('Самая высокая цена (во сколько раз дороже)', '×' + num('priceMax', R.priceMax, D.priceMax, 0.1), '×' + D.priceMax, 'когда осталась 1 штука'),
      row(`<label class="adm-r-chk"><input type="checkbox" data-r="restockOn"${R.restockOn ? ' checked' : ''}> Каждый день пополнять закончившиеся вещи (кроме легендарных)</label>`, 'до ' + num('restockTo', R.restockTo, D.restockTo) + ` шт. <small class="be-note">0 — до обычного запаса (сейчас ${S.norm} шт.)</small><br><button type="button" class="pill-btn" id="adm-restock-now">↻ Пополнить сейчас</button>`, 'вкл, до обычного запаса', `раз в сутки (ночью по Риге): вещи с остатком 0 получают столько штук; у остальных остаток не меняется.${d.restockLast ? ` Последний раз: ${d.restockLast.day}, пополнено ${d.restockLast.items} вещей по ${d.restockLast.to} шт.` : ''}`),
      row('🃏 Карточек одной коллекции в одни руки в первые сутки', num('cardsFirstDay', R.cardsFirstDay, D.cardsFirstDay) + ' шт.', D.cardsFirstDay ? D.cardsFirstDay + ' шт.' : 'без лимита', '0 — без лимита; сутки — с появления первой карточки коллекции'),
      row('🎲 Карточка-сюрприз стоит', num('cardSurprisePct', R.cardSurprisePct, D.cardSurprisePct) + ' %', D.cardSurprisePct + ' %', 'от средней цены свободных карточек этой редкости; выпадает случайная свободная — такой ни у кого нет'),
      row('🔁 Предложение обмена карточками живёт', num('tradeDays', R.tradeDays, D.tradeDays) + ' дн.', D.tradeDays + ' дн.', 'потом оно истекает само; принять уже нельзя'),
      row(`<label class="adm-r-chk"><input type="checkbox" data-r="sellOn"${R.sellOn ? ' checked' : ''}> Птички могут продавать вещи обратно в магазин</label>`, 'за ' + num('sellPrice', R.sellPrice, D.sellPrice) + ' 🔘', D.sellPrice + ' 🔘', 'одна цена за любую вещь; проданная вещь возвращается в магазин (+1 шт.)'),
    ];
    const advRows = [
      row('Пропущенные окошки можно открыть до … января', num('adventLastJan', R.adventLastJan, D.adventLastJan) + ' января', D.adventLastJan, '0 — в январе уже нельзя'),
      row('Пуговки в окошке без вещей', num('adventButtons', R.adventButtons, D.adventButtons) + ' 🔘', D.adventButtons),
      row(`Пуговки в особом пустом окошке (${d.special.join(', ')} декабря)`, num('adventSpecialButtons', R.adventSpecialButtons, D.adventSpecialButtons) + ' 🔘', D.adventSpecialButtons),
    ];
    const chk = (k, l, note) => `<label class="adm-r-chk"><input type="checkbox" data-r="${k}"${R[k] ? ' checked' : ''}> ${l}${note ? ` <small class="be-note">${note}</small>` : ''}</label>`;
    main.innerHTML = `${autoCard(d.auto || [])}<details class="adm-fine"${sessionStorage.getItem('pp-fine') ? ' open' : ''}><summary>⚙️ Тонкая настройка — можно не трогать</summary><section class="adm-box"><h2>📜 Правила</h2>
      <p class="be-note">Здесь можно поменять пуговки, бейджи, магазин, адвент и ИИ-работы. Изменения действуют сразу после «Сохранить» (до минуты на всех страницах). Поле с жёлтой рамкой отличается от значения по умолчанию. Уже полученные бейджи и пуговки при изменениях не отнимаются; если снизить условие бейджа, птички, которые ему уже соответствуют, получат его при следующем заходе.</p>
      <p class="adm-r-bar"><button type="button" class="pill-btn pill-fill" id="adm-r-save">💾 Сохранить правила</button> <span class="be-note" id="adm-r-st"></span></p></section>
      ${box('🔘 Пуговки', btnRows)}
      ${box('🥚 Уровни (рекордная серия) — пуговки один раз за уровень', lvRows)}
      ${box('🏅 Бейджи — награда и условия', bRows, 'Числа в условиях можно менять прямо в тексте. Описание «как получить» у птичек подстраивается само.')}
      ${box('🛍 Магазин', shopRows)}
      <section class="adm-box adm-rules adm-unit"><h3>💡 Как устроена экономика</h3><p>Пуговки за действия и игры — <b>постоянные</b> (награды игр — в % от опорной цены ${G.avg} 🔘, она не меняется). А <b>цены в магазине подстраиваются сами</b>: раз в сутки сайт смотрит, сколько зарабатывает обычная активная птичка, и ставит уровень цен так, чтобы средняя вещь стоила примерно столько, сколько она зарабатывает за ${R.priceDays} дн. Если птички много накопили — чуть дороже. За день цены меняются не больше чем на 10 %. Вы меняете только % категорий и цены легендарных (раздел «🛍 Магазин»).</p></section>
      ${box('🔘 Игра «Пуговичный дождь»', [
        row(`<label class="adm-r-chk"><input type="checkbox" data-r="gameOn"${R.gameOn ? ' checked' : ''}> Давать пуговки за игру</label>`, 'за уровень ' + pct('gameLevelPct') + ` → сейчас ${G.level} 🔘`, D.gameLevelPct + ' %', `уровни 1–10 — столько, 11–20 — вдвое (${G.level * 2}), 21–30 — втрое (${G.level * 3}) и т. д.; каждый номер уровня платит раз в сутки`),
        row('🏆 Новый личный рекорд — за каждый уровень выше прежнего', pct('gameRecordPct') + ` → сейчас ${G.record} 🔘`, D.gameRecordPct + ' %', 'один раз навсегда: стимул становиться лучше, а не переигрывать'),
        row('Лимит пуговок за игру в сутки', pct('gameDayMaxPct') + (G.max ? ` → сейчас ${G.max} 🔘` : ''), D.gameDayMaxPct ? D.gameDayMaxPct + ' %' : 'без лимита', '0 — без лимита (каждый уровень всё равно платит только раз в день)'),
        row('Вещь из магазина каждые … уровней', num('gameItemEvery', R.gameItemEvery, D.gameItemEvery) + ' ур.', D.gameItemEvery + ' ур.', 'вещь, которой у птички нет (не легендарная), неоткрытым подарком; за один уровень — раз в сутки; 0 — выключено'),
        row('👑 Первое место в рекордах — каждый день, когда играет', pct('gameKingPct') + ` → сейчас ${G.king} 🔘`, D.gameKingPct + ' %', 'кто первый в таблице рекордов и прошёл в этот день хоть один уровень; 0 — выключено'),
        row('Уровень не засчитывается, если пройден быстрее', num('gameMinSec', R.gameMinSec, D.gameMinSec) + ' с', D.gameMinSec + ' с', 'защита от подделки: столько секунд на каждый уровень от начала игры (честно — дольше)'),
      ], '<a href="/ru/rain/">Открыть игру →</a>')}
      ${box('🥞 Игра «Блинная Полли»', [
        row(`<label class="adm-r-chk"><input type="checkbox" data-r="panOn"${R.panOn ? ' checked' : ''}> Давать пуговки за игру</label>`, 'за уровень ' + pct('panLevelPct') + ` → сейчас ${btnPct(R.panLevelPct)} 🔘`, D.panLevelPct + ' %', 'уровни 1–10 — столько, 11–20 — вдвое, 21–30 — втрое и т. д.; каждый номер уровня платит раз в сутки'),
        row('🏆 Новый личный рекорд — за каждый уровень выше прежнего', pct('panRecordPct') + ` → сейчас ${btnPct(R.panRecordPct)} 🔘`, D.panRecordPct + ' %', 'один раз навсегда'),
        row('Подарок из магазина каждые … уровней', num('panItemEvery', R.panItemEvery, D.panItemEvery) + ' ур.', D.panItemEvery + ' ур.', 'вещь, которой у птички нет (не легендарная), неоткрытым подарком; за один уровень — раз в сутки; 0 — выключено'),
        row('Мыть сковородку каждые … уровней', num('panWashEvery', R.panWashEvery, D.panWashEvery) + ' ур.', D.panWashEvery + ' ур.', 'пальцем по экрану; без мытья следующий уровень не засчитывается'),
        row('Средство для мытья', num('panSoapBtn', R.panSoapBtn, D.panSoapBtn) + ' 🔘', D.panSoapBtn + ' 🔘', 'списывается при мытье; без средства — водой, тереть дольше, бесплатно; 0 — средство бесплатное'),
        row('Старт не с начала — рубежи каждые … уровней', num('panStartEvery', R.panStartEvery, D.panStartEvery) + ' ур.', D.panStartEvery + ' ур.', 'можно начать с 11-го, 21-го… уровня, если рекорд не ниже; пропущенные уровни пуговок не дают; 0 — всегда с 1-го'),
        ...[['panUpHotPct', '🔥 Улучшение «Горячая плита» (3 уровня)', 'сырое тесто доходит до нужного цвета быстрее, у самой цели — как обычно'], ['panUpHeartPct', '❤️ Улучшение «Лишнее сердечко» (2 уровня)', '+1 сердечко на старте и в запасе'],
          ['panUpPatPct', '⏳ Улучшение «Терпеливые клиенты» (3 уровня)', '+20 % терпения за уровень'], ['panUpSparePct', '🍳 Улучшение «Запасная сковородка» (2 уровня)', 'вместо мытья взять чистую, столько раз за игру']]
          .map(([k, n, d]) => row(n, pct(k) + ` → сейчас ${btnPct(R[k])} 🔘`, D[k] + ' %', 'цена 1-го уровня, 2-й — вдвое, 3-й — втрое; ' + d)),
        row('Уровень не засчитывается, если пройден быстрее', num('panMinSec', R.panMinSec, D.panMinSec) + ' с', D.panMinSec + ' с', 'защита от подделки: столько секунд на каждый уровень от начала игры'),
      ], '<a href="/ru/pancakes/">Открыть игру →</a>')}
      ${box('🥕 Огород птички', [
        row(`<label class="adm-r-chk"><input type="checkbox" data-r="gardenOn"${R.gardenOn ? ' checked' : ''}> Давать пуговки за урожай и жуков</label>`, '', 'вкл', 'выключено — огород растёт, но продать урожай нельзя, жуки без пуговок'),
        row('Грядок у каждой птички', num('gardenBeds', R.gardenBeds, D.gardenBeds), D.gardenBeds, 'до 6 — по 3 в ряд, больше — по 4; если уменьшить, лишние грядки пропадут вместе с растениями'),
        row('Земля влажная после полива', num('gardenWetH', R.gardenWetH, D.gardenWetH) + ' ч', D.gardenWetH + ' ч', 'растение растёт, только пока земля влажная; полить грядку можно раз в сутки (по Риге)'),
        row('Семечко — за каждый день роста', pct('gardenSeedPct') + ` → сейчас ${btnPct(R.gardenSeedPct)} 🔘 за день`, D.gardenSeedPct + ' %', 'редиска и салат растут 1 день, морковь и тюльпан 2, клубника, подсолнух и капуста 3, тыква 4'),
        row('Урожай — за каждый день роста', pct('gardenSellPct') + ` → сейчас ${btnPct(R.gardenSellPct)} 🔘 за день`, D.gardenSellPct + ' %', 'продаётся из корзинки'),
        row('Семян в подарок при первом заходе', num('gardenStarter', R.gardenStarter, D.gardenStarter) + ' шт.', D.gardenStarter + ' шт.', 'каждого растения на 1–2 дня (редиска, салат, морковь, тюльпан)'),
        row('🐞 Жуков в день — до', num('gardenBugMax', R.gardenBugMax, D.gardenBugMax), D.gardenBugMax, 'каждый вылезает в свой час между 7 и 21 по Риге'),
        row('Шанс, что жуки сегодня будут', num('gardenBugChance', R.gardenBugChance, D.gardenBugChance) + ' %', D.gardenBugChance + ' %', 'в остальные дни жуков нет'),
        row('🐞 Пуговок за жука', num('gardenBugBtn', R.gardenBugBtn, D.gardenBugBtn) + ' 🔘', D.gardenBugBtn + ' 🔘'),
        row('🌱 Семечко в награду в игре', num('gardenDropPct', R.gardenDropPct, D.gardenDropPct) + ' %', D.gardenDropPct + ' %', 'шанс за каждую награду пуговками в Пуговичном дожде, Зельеварне, Блинной, у Титоса (дела и жуки) и в «Смене с Полли»; семечко простое, случайное'),
        row('🌱 Семян из игр в сутки — до', num('gardenDropDay', R.gardenDropDay, D.gardenDropDay) + ' шт.', D.gardenDropDay + ' шт.'),
        row('✨ Редкое семечко — дней подряд', num('gardenRareDays', R.gardenRareDays, D.gardenRareDays) + ' дн.', D.gardenRareDays + ' дн.', 'дни, когда в карточке дня собрано столько штампов, сколько нужно для бонуса дня; после награды серия считается заново. Радужная морковь, синяя роза, золотая тыква'),
        row('🔮 Волшебное семечко — дней подряд', num('gardenMagicDays', R.gardenMagicDays, D.gardenMagicDays) + ' дн.', D.gardenMagicDays + ' дн.', 'дни, когда в огороде полита хоть одна грядка; после награды — заново. Звёздная ягода, лунный цветок, мандрагора'),
        row('Урожай редких дороже в', num('gardenRareMul', R.gardenRareMul, D.gardenRareMul) + ' раз', D.gardenRareMul + ' раз'),
        row('Урожай волшебных дороже в', num('gardenMagicMul', R.gardenMagicMul, D.gardenMagicMul) + ' раз', D.gardenMagicMul + ' раз'),
        row('Сезон огорода', `<select data-r="gardenSeason">${[['auto', 'по календарю'], ['autumn', '🍂 осень'], ['winter', '❄️ зима'], ['spring', '🌸 весна'], ['summer', '☀️ лето']].map(([k, l]) => `<option value="${k}"${R.gardenSeason === k ? ' selected' : ''}>${l}</option>`).join('')}</select>`, 'по календарю', 'погода и вид: дек–фев зима, мар–май весна, июн–авг лето, сен–ноя осень'),
      ], 'Вход — дверь 🚪 в комнате птички → «Огород» (/garden/)')}
      ${box('✉️ Уведомления из игр на почту', [
        row(`<label class="adm-r-chk"><input type="checkbox" data-r="mailGamesOn"${R.mailGamesOn ? ' checked' : ''}> Присылать уведомления из игр</label>`, '', 'вкл', 'только птичкам, которые включили «🎮 Уведомления из игр»; одной птичке — не больше одного письма в день вообще (любого: рассылка, праздник, адвент, уведомление); что не уместилось — завтра'),
        row('🔥 Серия сгорит сегодня — серия от', num('mailStreakMin', R.mailStreakMin, D.mailStreakMin) + ' дн.', D.mailStreakMin + ' дн.', 'если сегодня ещё нет рисунка и сегодня не день свободы'),
        row('🔥 …письмо о серии — с', num('mailStreakHour', R.mailStreakHour, D.mailStreakHour) + ' ч по Риге', D.mailStreakHour + ' ч'),
        row('🥕🌱 Огород — не чаще раза в', num('mailGardenDays', R.mailGardenDays, D.mailGardenDays) + ' дн.', D.mailGardenDays + ' дн.', 'урожай созрел или грядки сухие, а птичка не заходила больше суток'),
        row('🕵️ Титос ждёт — если птичка не заходила', num('mailTitosDays', R.mailTitosDays, D.mailTitosDays) + ' дн.', D.mailTitosDays + ' дн.', 'про каждое следующее дело — одно письмо'),
      ], 'Письма уходят сами раз в час, в пределах бесплатного лимита (90 в сутки вместе с остальными письмами). <a href="#mail">✉️ Письма →</a>')}
      ${box('⏱ «Смена с Полли»', [
        row(`<label class="adm-r-chk"><input type="checkbox" data-r="shiftOn"${R.shiftOn ? ' checked' : ''}> Давать пуговки за смены</label>`, num('shiftBtn', R.shiftBtn, D.shiftBtn) + ' 🔘 за час', D.shiftBtn + ' 🔘', 'минуты доигранных до конца смен копятся; каждый полный час — повышение и столько пуговок'),
      ], '<a href="/ru/shift/">Открыть страницу →</a>')}
      ${box('🧪 Игра «Зельеварня Полли»', [
        row(`<label class="adm-r-chk"><input type="checkbox" data-r="potionOn"${R.potionOn ? ' checked' : ''}> Давать пуговки за зелья</label>`, '', 'вкл', 'выключено — варят только для коллекции'),
        row('Сезон зельеварни', `<select data-r="potionSeason">${[['auto', 'по календарю'], ['autumn', '🎃 осень · Хеллоуин'], ['winter', '❄️ зима · Новый год'], ['spring', '🌷 весна'], ['summer', '☀️ лето']].map(([k, l]) => `<option value="${k}"${R.potionSeason === k ? ' selected' : ''}>${l}</option>`).join('')}</select>`, 'по календарю', 'по календарю: дек–фев зима, мар–май весна, июн–авг лето, сен–ноя осень; от сезона зависят ингредиенты и цвет лабиринта'),
        row(`<label class="adm-r-chk"><input type="checkbox" data-r="potionShelf"${R.potionShelf ? ' checked' : ''}> Бутылочка в комнату за новое зелье «Вкус детства»</label>`, '', 'вкл', 'появляется в сумке, её можно поставить в комнату; в магазине таких нет'),
        row('Новое <b>обычное</b> зелье', pct('potion1Pct') + ` → сейчас ${G.p1} 🔘`, D.potion1Pct + ' %'),
        row('Новое <b>вкусное</b> зелье', pct('potion2Pct') + ` → сейчас ${G.p2} 🔘`, D.potion2Pct + ' %', 'два сладких ингредиента в котле'),
        row('Новое зелье <b>«Вкус детства»</b>', pct('potion3Pct') + ` → сейчас ${G.p3} 🔘`, D.potion3Pct + ' %', 'три сладких ингредиента'),
        row('Повторное зелье (рецепт уже открыт)', pct('potionAgainPct') + ` → сейчас ${G.again} 🔘`, D.potionAgainPct + ' %', '0 — пуговки только за новые'),
        row('Лимит пуговок за зелья в сутки', pct('potionDayMaxPct') + (G.pmax ? ` → сейчас ${G.pmax} 🔘` : ''), D.potionDayMaxPct + ' %', '0 — без лимита'),
        row('Зелье оживления котика — играть дней подряд', num('potionRevive', R.potionRevive, D.potionRevive) + ' дн.', D.potionRevive + ' дн.', 'лабиринт или котёл раз в сутки; зелье в сумку, его кладут на котика в комнате; 0 — выкл.'),
        row('Лабиринт не засчитывается, если пройден быстрее', num('potionMinSec', R.potionMinSec, D.potionMinSec) + ' с', D.potionMinSec + ' с', 'защита от подделки (если быстрее — игра чуть подождёт)'),
      ], '<a href="/ru/potions/">Открыть игру →</a>')}
      ${box('🕵️ Игра «Детектив Титос»', [
        row(`<label class="adm-r-chk"><input type="checkbox" data-r="titosOn"${R.titosOn ? ' checked' : ''}> Давать пуговки за дела</label>`, 'за уровень ' + pct('titosLevelPct') + ` → сейчас ${G.titosLevel} 🔘`, D.titosLevelPct + ' %', `уровни 1–10 — столько, 11–20 — вдвое (${G.titosLevel * 2}), 21–30 — втрое и т. д.; за каждый уровень один раз`),
        row('Дело не засчитывается, если раскрыто быстрее, чем по … с на улику', num('titosClueSec', R.titosClueSec, D.titosClueSec) + ' с', D.titosClueSec + ' с', 'защита от подделки: 7 улик × 3 с = 21 с'),
        row('☕ Кофейник вмещает', num('titosPot', R.titosPot, D.titosPot) + ' чашек', D.titosPot),
        row('Начать дело стоит', num('titosStartCups', R.titosStartCups, D.titosStartCups) + ' чаш.', D.titosStartCups, 'дальше Титос пьёт по чашке'),
        row('Титос выпивает чашку каждые', num('titosCupMin', R.titosCupMin, D.titosCupMin) + ' мин', D.titosCupMin + ' мин', 'кофе кончился — Титос засыпает, дело ждёт на сервере'),
        row('Кофейник сам наполняется: +1 чашка каждые', num('titosRegenMin', R.titosRegenMin, D.titosRegenMin) + ' мин', D.titosRegenMin + ' мин', 'до полного'),
        row('«Разбери дела» — за уровень', num('titosSortCups', R.titosSortCups, D.titosSortCups) + ' чаш.', D.titosSortCups),
        row('«Разбери дела»: уровень не засчитывается, если пройден быстрее, чем по … с на документ', num('titosSortSec', R.titosSortSec, D.titosSortSec) + ' с', D.titosSortSec + ' с', 'защита от подделки (если быстрее — игра чуть подождёт)'),
        row('«Разбери дела»: смыть кляксу', num('titosBlotBtn', R.titosBlotBtn, D.titosBlotBtn) + ' 🔘', D.titosBlotBtn + ' 🔘', '0 — кнопки «Смыть» нет, только угадать'),
        row('«Жуки» — за игру', num('titosBugsCups', R.titosBugsCups, D.titosBugsCups) + ' чаш., не чаще ' + num('titosBugsPerHour', R.titosBugsPerHour, D.titosBugsPerHour, 1, 50) + ' раз в час', `${D.titosBugsCups} · ${D.titosBugsPerHour}`),
        row('«Жуки»: игра не засчитывается, если пройдена быстрее, чем за', num('titosBugsSec', R.titosBugsSec, D.titosBugsSec) + ' с', D.titosBugsSec + ' с', 'защита от подделки (если быстрее — игра чуть подождёт)'),
        row('«☕ Долить» полный кофейник', pct('titosRefillPct') + ` → сейчас ${G.titosRefill} 🔘`, D.titosRefillPct + ' %'),
        row('Лишний кофе (кофейник полный) — пуговки за чашку', pct('titosSellPct') + ` → сейчас ${G.titosSell} 🔘`, D.titosSellPct + ' %', 'не меньше 1 🔘'),
        row('…не больше чашек в сутки', num('titosSellDayMax', R.titosSellDayMax, D.titosSellDayMax) + ' чаш.', D.titosSellDayMax, '0 — лишний кофе не продаётся'),
      ], 'Награды за уровни 30, 50, 90 и 100 — вещи для комнаты: их нет в магазине, подарить и продать нельзя. <a href="/ru/titos/">Открыть игру →</a>')}
      ${box('🚪 Дом птички — что открывает комнату', [
        row('🍳 Кухня: уровень в «Блинной Полли»', num('homeKitchen', R.homeKitchen, D.homeKitchen), D.homeKitchen, 'считается рекорд'),
        row('🛏 Спальня: пёрышек в чужих комнатах', num('homeBedroom', R.homeBedroom, D.homeBedroom), D.homeBedroom),
        row('🕯 Склеп: раскрытых дел Титоса', num('homeCrypt', R.homeCrypt, D.homeCrypt), D.homeCrypt),
        row('🛁 Ванная: уровень в «Пуговичном дожде»', num('homeBath', R.homeBath, D.homeBath), D.homeBath, 'считается рекорд'),
        row('💼 Кабинет: задача Оффис Полли', num('homeOffice', R.homeOffice, D.homeOffice), D.homeOffice, '1 — «Ответ Совету городов»'),
      ], '0 — комната открыта сразу. Уже выполнившим условие раньше комната открыта сама.')}
      ${box('🎄 Адвент', advRows)}
      ${box('🎨 Темы челленджа — подбор плана месяца', [
        row('Одна семья предметов (яблоко, корзина яблок…) — не ближе', num('chFamilyGap', R.chFamilyGap, D.chFamilyGap) + ' дн.', D.chFamilyGap + ' дн.', 'и никогда дважды в одном месяце'),
        row('В любые … дней подряд', num('chCatWindow', R.chCatWindow, D.chCatWindow) + ' дн.', D.chCatWindow + ' дн.', 'одна категория (еда, дом, птица…) — никогда два дня подряд'),
        row('… не меньше разных категорий', num('chCatMin', R.chCatMin, D.chCatMin) + ' шт.', D.chCatMin + ' шт.'),
        row('Колода сложности: простых · средних · сложных', num('chEasy', R.chEasy, D.chEasy, 1, 50) + ' · ' + num('chMid', R.chMid, D.chMid, 1, 50) + ' · ' + num('chHard', R.chHard, D.chHard, 1, 50), `${D.chEasy} · ${D.chMid} · ${D.chHard}`, 'на каждые (сумма) дней подряд; сложный — сцена, место, персонаж в действии'),
        row('Дней с предметами сезона', num('chSeasonDaysPct', R.chSeasonDaysPct, D.chSeasonDaysPct) + ' %', D.chSeasonDaysPct + ' %', '80 % — 5–6 дней в неделю'),
      ], 'Действует на месяцы, которые ещё не созданы (следующий создаётся 20-го). Уже созданный месяц правится в ✍️ Публиковать → 🎨 Темы челленджа.')}
      <section class="adm-box adm-rules"><h3>🤖 ИИ-работы</h3>${chk('aiStreak', 'Работа с пометкой 🤖 засчитывается в серию', '(выключить — такие дни не продлевают серию)')}<br>${chk('aiUpload', 'За работу с пометкой 🤖 дают пуговки за загрузку')}</section>
      </details><details class="adm-fine"><summary>📖 Как всё устроено — простыми словами</summary><section class="adm-box adm-rules" id="adm-rules-all"></section></details>
      <section class="adm-danger"><h3>⚠️ Осторожно</h3><button type="button" class="pill-btn be-danger" id="adm-r-reset">↺ Вернуть все правила по умолчанию</button><p class="be-note">Все числа в тонкой настройке станут такими, как были сначала.</p></section>`;
    const fine = main.querySelector('.adm-fine'); fine.addEventListener('toggle', () => { try { fine.open ? sessionStorage.setItem('pp-fine', '1') : sessionStorage.removeItem('pp-fine'); } catch (e) {} });
    // полный свод правил — обычным текстом, с текущими числами
    const pc = n => n + ' 🔘';
    main.querySelector('#adm-rules-all').innerHTML = `
      <h4>Челлендж</h4><ul>
        <li>Каждый день — тема дня. Рисунок можно загрузить за завтра, сегодня, вчера и позавчера (одна работа на день; новая заменяет старую).</li>
        <li>Раз в месяц — день ЭКСТРА (день свободы: своя тема или свой референс). Если в этот день ничего не загружено, серия не прерывается.</li>
        <li>Темы на месяц подбираются сами (20-го — на следующий месяц): одна семья предметов — не ближе ${R.chFamilyGap} дней и никогда дважды в месяце; одна категория — не два дня подряд, в любые ${R.chCatWindow} дней — не меньше ${R.chCatMin} разных; сложность «колодой»: ${R.chEasy} простых, ${R.chMid} средних, ${R.chHard} сложный на ${R.chEasy + R.chMid + R.chHard} дней; ${R.chSeasonDaysPct} % дней — предметы сезона. Любой день можно поправить в «🎨 Темы челленджа».</li>
        <li>Серия — сколько дней подряд есть рисунки; рекорд серии даёт уровни. ${R.aiStreak ? 'Работы с пометкой 🤖 тоже засчитываются в серию.' : 'Работы с пометкой 🤖 в серию <b>не</b> засчитываются.'}</li>
        <li>Галочка «Ч/Б» — рисунок в чёрно-белом режиме (бейджи «Нарисовал(а) в Ч/Б» и «Мастер туши»).</li>
        <li>Галочка 🤖 «ИИ-генерация» ставит значок робота на работе. Админ тоже может пометить работу 🤖 (голова робота в углу работы). На стене каждый выбирает: все работы, работы людей или работы роботов.</li>
        <li>«★ Выбор Полли» — одна работа на всём сайте; ставит и снимает админ. Каждые 5 выборов — звезда на бейдже, 3 звезды (${d.goldPicks} выборов) — золотой ник. Если снять выбор, бейдж становится чёрно-белым, пуговки и счётчик остаются.</li>
        <li>Админ может скрыть работу со стены и заблокировать птичку (её работы пропадают со стены).</li></ul>
      <h4>Пуговки 🔘</h4><ul>
        <li>Первый заход за сутки — ${pc(R.daily)}; рисунок — ${pc(R.upload)} (за день один раз)${R.aiUpload ? '' : ', за работу с 🤖 — 0'}; комментарий — ${pc(R.comment)} (первые ${R.commentsPerDay} в день); друг указал тебя при регистрации — ${pc(R.friend)}; «Выбор Полли» — ${pc(R.pick)}.</li>
        <li>Уровни: ${Object.keys(R.levels).map(k => `${LEVEL_RU[k]} (${k}) — ${R.levels[k]}`).join(', ')}.</li>
        <li>Бейджи: ${Object.keys(R.badges).map(k => `${BADGE_RU[k] || k} — ${R.badges[k]}`).join(', ')}. За каждый бейдж и уровень пуговки дают один раз.</li></ul>
      <h4>Магазин</h4><ul>
        <li>Одинаковых обычных вещей — до ${R.shopMax} шт., легендарных — до ${R.legendMax}. Легендарные дарить нельзя.</li>
        <li>«Мало», «обычно» и «много» считаются от числа птичек с ником (сейчас ${S.birds}): мало — до ${R.lowPct} % (1–${S.low} шт.), обычный запас — ${R.normPct} % (${S.norm} шт.), много — от ${R.manyPct} % (${S.many} шт.); у легендарных — ${R.legendPct} % от этих чисел (1–${S.lowLeg} / ${S.normLeg} / от ${S.manyLeg}). Птичек становится больше — числа растут сами.</li>
        <li>Цена обычной вещи = ценность × % категории × уровень цен (сам, раз в сутки: средняя вещь ≈ заработок активной птички за ${R.priceDays} дн.; не больше ±10 % в день) × остаток: (обычный запас ÷ остаток)^0.4, от ×${R.priceMin} до ×${R.priceMax}, округление до 5. Легендарные — ровно та цена, что поставлена вручную.</li>
        <li>«🎲 Сюрприз» — случайная вещь категории, которой у птички ещё нет; если всё есть — любая вещь, которой нет.</li>
        <li>Любую вещь из сумки, кроме легендарных, можно подарить другой птичке (если у неё ещё нет максимума). Админ может дарить что угодно.</li>
        <li>${R.restockOn ? `Каждый день (ночью по Риге) закончившиеся вещи (кроме легендарных) пополняются сами — по ${R.restockTo > 0 ? R.restockTo + ' шт.' : 'обычному запасу (' + S.norm + ' шт.)'}; у остальных остаток не меняется.` : 'Ежедневное пополнение магазина выключено.'}</li>
        <li>${R.sellOn ? `Любую вещь можно продать обратно в магазин за ${pc(R.sellPrice)} — она снова появится в продаже.` : 'Продажа вещей обратно в магазин выключена.'}</li></ul>
      <h4>Игра «Пуговичный дождь»</h4><ul>
        <li>Птичка ловит пуговки и уворачивается от клякс; 3 сердечка, клякса или 5 упущенных пуговок — минус сердечко; каждые 5 уровней — +1 сердечко. Уровни бесконечные, каждый быстрее.</li>
        <li>Сложность растёт ступенями: каждые 10 уровней заметно быстрее и больше клякс (с 11-го — ветер, с 21-го — зигзаг).</li>
        <li>Награды игр — в % от опорной цены ${G.avg} 🔘 (постоянная), поэтому не скачут.</li>
        <li>${R.gameOn && R.gameLevelPct > 0 ? `За уровень — ${R.gameLevelPct} % (сейчас ${pc(G.level)}) × (1 + каждый пройденный десяток): 1–10 — ${G.level}, 11–20 — ${G.level * 2}, 21–30 — ${G.level * 3}… Каждый номер уровня платит раз в сутки${G.max > 0 ? `, всего не больше ${pc(G.max)} в сутки` : ''}. Новый личный рекорд — ещё ${R.gameRecordPct} % (${pc(G.record)}) за каждый уровень выше прежнего.` : 'Пуговки за игру выключены.'}${R.gameItemEvery > 0 ? ` Каждые ${R.gameItemEvery} уровней — вещь из магазина, которой у птички нет (не легендарная).` : ''}${R.gameKingPct > 0 ? ` 👑 Первое место в рекордах — ${R.gameKingPct} % (${pc(G.king)}) в каждый день, когда держится и играет.` : ''}</li></ul>
      <h4>Игра «Блинная Полли»</h4><ul>
        <li>К окошку приходят жители Воббленда (уровень — один житель): выбрать сковородку (форма), налить тесто, перевернуть и снять вовремя (прожарка из заказа), добавить топпинги. Ошибки снижают довольство; совсем недовольный клиент — минус сердечко (3, каждые 5 уровней одно возвращается).</li>
        <li>Сложнее с каждым десятком: быстрее печётся, уже «идеальная» полоса, больше блинов и топпингов в заказе, с 11-го уровня клиенты ждут ограниченное время; новые формы и топпинги открываются по уровням.</li>
        <li>${R.panOn && R.panLevelPct > 0 ? `За уровень — ${R.panLevelPct} % (сейчас ${pc(btnPct(R.panLevelPct))}) × (1 + каждый пройденный десяток), каждый номер уровня раз в сутки; новый рекорд — ещё ${R.panRecordPct} % за уровень.` : 'Пуговки за игру выключены.'}${R.panItemEvery > 0 ? ` Каждые ${R.panItemEvery} уровней — подарок из магазина.` : ''} Каждые ${R.panWashEvery} уровней — мыть сковородку пальцем: средство ${pc(R.panSoapBtn)}, водой — бесплатно, но дольше.</li></ul>
      <h4>Огород птички</h4><ul>
        <li>Вход — дверь 🚪 в комнате → «Огород». ${R.gardenBeds} грядок; посадить семечко, поливать каждый день (раз в сутки по Риге): растение растёт, только пока земля влажная (${R.gardenWetH} ч после полива).</li>
        <li>Семечко — ${R.gardenSeedPct} % (${pc(btnPct(R.gardenSeedPct))}) за каждый день роста, урожай — ${R.gardenSellPct} % (${pc(btnPct(R.gardenSellPct))}) за день${R.gardenOn ? '' : ' (продажа сейчас выключена)'}. При первом заходе — по ${R.gardenStarter} семян редиски, салата, моркови и тюльпана.</li>
        <li>Жуки: в ${R.gardenBugChance} % дней — от 1 до ${R.gardenBugMax}, вылезают в разное время днём; каждый — ${pc(R.gardenBugBtn)}.</li>
        <li>Семена: простые — в лавке огорода и в магазине; в играх с шансом ${R.gardenDropPct} % за награду (до ${R.gardenDropDay} в сутки). Редкое — за ${R.gardenRareDays} дней подряд с бонусом карточки дня, волшебное — за ${R.gardenMagicDays} дней подряд с поливом; их урожай дороже в ${R.gardenRareMul} и ${R.gardenMagicMul} раз. Найденное семечко — новость 🌱 в конвертике.</li>
        <li>Вещи для огорода (лейка, пугало, теплица, тачка…, ★ золотая лейка и оранжерея, «🎲 Сюрприз») — в магазине; купленная вещь сама стоит в огороде.</li>
        <li>Погода — ${R.gardenSeason === 'auto' ? 'по календарю' : 'вручную: ' + R.gardenSeason}: осенью листья, дождик или туман, зимой снег, весной лепестки, летом солнце и бабочки; вечером (с 19 до 7) — звёзды.</li></ul>
      <h4>«Смена с Полли»</h4><ul>
        <li>Таймер 20 мин – 3 ч, Полли работает рядом. Засчитывается только смена, доведённая до конца; минуты копятся: каждый полный час — повышение (новая должность, лестница бесконечная)${R.shiftOn && R.shiftBtn > 0 ? ` и ${pc(R.shiftBtn)}` : ''}.</li></ul>
      <h4>Игра «Зельеварня Полли»</h4><ul>
        <li>Лабиринты бесконечные: с каждым уровнем больше; с 3-го — привидения (воруют ингредиент) и иногда проклятие тумана (видно только рядом), с 5-го — проклятые черепа. Бонусы: 🏮 фонарь, 👢 сапоги, 🧲 магнит, 🧿 оберег.</li>
        <li>Сезоны: дек–фев зима, мар–май весна, июн–авг лето, сен–ноя осень${R.potionSeason !== 'auto' ? ` (сейчас вручную: ${R.potionSeason})` : ''}. У каждого сезона свои 21 ингредиент и цвет лабиринта; сварить можно только из одного сезона (старые ингредиенты не пропадают). Ингредиентами можно делиться: 🎁 в котле, до 10 штук за раз.${R.potionShelf ? ' За новое зелье «Вкус детства» — бутылочка в комнату.' : ''}</li>
        <li>В лабиринте 3–6 ингредиентов (решает сервер). Зелье — из трёх ингредиентов; срабатывает рецепт или нет — одинаково для всех птичек, его узнают пробами. Два сладких (🍎🍬🍫🥛🍯🍪) — «вкусное», три — «вкус детства». У каждого рецепта своё имя и свойство.</li>
        <li>${R.potionOn ? `Новое зелье: обычное — ${R.potion1Pct} % (${pc(G.p1)}), вкусное — ${R.potion2Pct} % (${pc(G.p2)}), вкус детства — ${R.potion3Pct} % (${pc(G.p3)}); повторное — ${R.potionAgainPct} % (${pc(G.again)})${G.pmax ? `; не больше ${pc(G.pmax)} в сутки` : ''}.` : 'Пуговки за зелья выключены.'}</li></ul>
      <h4>Игра «Детектив Титос»</h4><ul>
        <li>100 уровней-дел по порядку; дела 1–2 — прежние «Сироп» и «Шпион среди огурцов» (кто раскрыл их раньше, получает их засчитанными, без пуговок).</li>
        <li>Кофейник — ${R.titosPot} чашек. Начать дело — ${R.titosStartCups} чаш., дальше −1 каждые ${R.titosCupMin} мин; кофе кончился — Титос спит, дело ждёт. +1 чашка каждые ${R.titosRegenMin} мин до полного; «Разбери дела» — +${R.titosSortCups} за уровень (клякса — смыть за ${R.titosBlotBtn} 🔘 или угадать), «Жуки» — +${R.titosBugsCups} (до ${R.titosBugsPerHour} раз в час); «☕ Долить» — ${pc(G.titosRefill)}; лишнее при полном — ${pc(G.titosSell)} за чашку, до ${R.titosSellDayMax} в сутки.</li>
        <li>${R.titosOn ? `За уровень — ${R.titosLevelPct} % (сейчас ${pc(G.titosLevel)}) × (1 + каждый пройденный десяток), за каждый уровень один раз.` : 'Пуговки за дела выключены.'} Награды-вещи: 30 — ковёр с меловым силуэтом, 50 — кофейник детектива, 90 — доска улик, 100 — золотой значок в рамке.</li></ul>
      <h4>Адвент-календарь</h4><ul>
        <li>1–31 декабря, окошко открывается в свой день (по Риге); у всех одинаковые вещи. Прошедшие окошки видны всем, и гостям.</li>
        <li>Пропущенные окошки можно открыть ${R.adventLastJan ? `до ${R.adventLastJan} января` : 'только в декабре'}, даже если птичка зарегистрировалась позже.</li>
        <li>Окошко без вещей — ${pc(R.adventButtons)}, особое (${d.special.join(', ')}) — ${pc(R.adventSpecialButtons)}. Открыть ${R.cond.collector} окошек — бейдж «Коллекционер».</li></ul>
      <h4>Комната птички</h4><ul><li>Вещи для комнаты — из сумки (покупки, подарки, адвент). Подарил вещь — она уходит из комнаты.</li></ul>
      <h4>Блог</h4><ul><li>Комментарии: аноним («птица + номер») или под ником из челленджа. Комментарий со ссылкой ждёт проверки в кабинете.</li></ul>`;
    const st = main.querySelector('#adm-r-st');
    main.querySelector('#adm-r-save').onclick = async e => {
      const r = JSON.parse(JSON.stringify(R));
      main.querySelectorAll('[data-r]').forEach(i => {
        const path = i.dataset.r.split('.'); const v = i.type === 'checkbox' ? i.checked : i.tagName === 'SELECT' ? i.value : Number(i.value);
        if (path.length === 2) r[path[0]][path[1]] = v; else r[path[0]] = v;
      });
      e.target.disabled = true; st.textContent = 'Сохраняю…';
      try { await api('admin/rules', { rules: r }); st.textContent = '✓ Сохранено'; rules(); } catch (x) { e.target.disabled = false; st.textContent = '⚠ ' + err(x); }
    };
    main.querySelector('#adm-restock-now').onclick = async e => {
      const to = +main.querySelector('[data-r=restockTo]').value > 0 ? +main.querySelector('[data-r=restockTo]').value : S.norm;
      if (!confirm(`Пополнить сейчас все ЗАКОНЧИВШИЕСЯ вещи (кроме легендарных) — по ${R.restockTo > 0 ? R.restockTo : S.norm} шт.?` + (to !== (R.restockTo > 0 ? R.restockTo : S.norm) ? '\n(Новое число в поле сначала сохраните кнопкой «Сохранить».)' : ''))) return;
      e.target.disabled = true;
      try { const r = await api('admin/shop/autorestock', {}); alert(`↻ Готово: пополнено ${r.items} закончившихся вещей, по ${r.to} шт.`); rules(); } catch (x) { e.target.disabled = false; alert(err(x)); }
    };
    main.querySelector('#adm-r-reset').onclick = async () => {
      if (!confirm('Вернуть все правила к значениям по умолчанию?')) return;
      try { await api('admin/rules', { reset: true }); rules(); } catch (x) { alert(err(x)); }
    };
  }

  // налог: списать N 🔘 или N % у всех / у не вернувшихся после регистрации (больше месяца) / у не заходивших дольше выбранного срока
  function taxDialog(users, done) {
    const w = document.createElement('div'); w.className = 'adm-gift';
    w.innerHTML = `<div class="adm-tax-card" role="dialog" aria-label="Налог"><h3>🧾 Списать налог</h3>
      <p class="adm-tax-row"><label>Сколько <input type="number" min="1" max="10000" value="10" data-n></label>
        <label><input type="radio" name="tax-u" value="btn" checked> 🔘 пуговок</label><label><input type="radio" name="tax-u" value="pct"> % от пуговок</label></p>
      <fieldset><legend>У кого</legend>
        <label><input type="radio" name="tax-w" value="all" checked> у всех птичек</label>
        <label><input type="radio" name="tax-w" value="never"> не заходили ни разу после регистрации (прошло больше месяца)</label>
        <label><input type="radio" name="tax-w" value="idle"> не заходили дольше, чем <select data-days>${[[7, 'неделя'], [14, '2 недели'], [30, 'месяц'], [60, '2 месяца'], [90, '3 месяца'], [180, 'полгода'], [365, 'год']].map(([v, l]) => `<option value="${v}"${v === 30 ? ' selected' : ''}>${l}</option>`).join('')}</select></label></fieldset>
      <p class="be-note">Пуговок не станет меньше нуля. Птичка письма не получит. Заблокированные и птички без ника не платят.</p>
      <p class="adm-tax-sum" aria-live="polite"></p>
      <div class="adm-quick"><button type="button" class="pill-btn pill-fill" data-go>Списать</button><button type="button" class="pill-btn" data-x>Отмена</button></div></div>`;
    document.body.appendChild(w);
    const q = s => w.querySelector(s), val = name => q(`[name=${name}]:checked`).value, t = Date.now() / 1000;
    const pick = () => {
      const pct = val('tax-u') === 'pct', n = Math.floor(+q('[data-n]').value) || 0, who = val('tax-w'), days = +q('[data-days]').value;
      const list = users.filter(u => u.nick && !u.banned && u.buttons > 0).filter(u => {
        const seen = u.last_seen || u.created_at || 0;
        return who === 'all' || (who === 'never' ? u.created_at < t - 30 * 86400 && seen < (u.created_at || 0) + 86400 : seen < t - days * 86400);
      }).map(u => Math.min(u.buttons, pct ? Math.floor(u.buttons * n / 100) : n)).filter(x => x > 0);
      return { pct, n, who, days, list, ok: n >= 1 && n <= (pct ? 100 : 10000) };
    };
    const show = () => { const c = pick(); q('.adm-tax-sum').innerHTML = c.ok ? `Птичек заплатит: <b>${c.list.length}</b>, всего <b>${c.list.reduce((a, b) => a + b, 0)}</b> 🔘` : `Нужно число от 1 до ${c.pct ? 100 : 10000}.`; };
    w.oninput = w.onchange = show; show();
    const close = () => w.remove();
    q('[data-x]').onclick = close; w.onclick = e => { if (e.target === w) close(); };
    q('[data-go]').onclick = async e => {
      const c = pick(); if (!c.ok) return;
      if (!confirm(`Списать налог ${c.n}${c.pct ? ' %' : ' 🔘'}  — птичек: ${c.list.length}?`)) return;
      e.target.disabled = true;
      try { const r = await api('admin/tax', { amount: c.n, unit: c.pct ? 'pct' : 'btn', who: c.who, days: c.days }); alert(`🧾 Налог списан. Птичек: ${r.count}, всего ${r.total} 🔘`); close(); done(); } catch (x) { alert(err(x)); e.target.disabled = false; }
    };
  }

  // ---------- подарить семечко: фон, обувь, головной убор, анимация, рамка ----------
  function giftDialog(u, done) {

    const B = window.PPBirds, C = window.PPCatalog; if (!B || !C) return;
    const all = !u; if (all) u = { id: 2, nick: null, avatar: '{}' }; // «подарить всем»
    let av = {}; try { av = JSON.parse(u.avatar || '{}') || {}; } catch (e) { /* пусто */ }
    const NAMES = { halo: 'нимб ★', unicorn: 'рог единорога ★', flamecrown: 'корона феникса ★', dragonegg: 'яйцо дракона ★', goldfeather: 'золотое перо ★', comet: 'комета ★', goldenapple: 'золотое яблоко ★', legend: 'легендарная ★', aurora: 'сияние ★', pirate: 'пиратская шляпа', chef: 'колпак повара', graduation: 'шапочка выпускника', paintbrush: 'кисточка', palette: 'палитра', pencil: 'карандаш', coffee: 'кофе', croissant: 'круассан', bounce: 'прыгает', wiggle: 'качается', float: 'парит', spin: 'кружится', sparkle: 'сияет', heart: 'сердечко', wizard: 'шляпа волшебника', witch: 'шляпа ведьмы', pumpkin: 'тыква', santa: 'колпак Санты', antlers: 'рожки оленя', beanie: 'зимняя шапка', heartband: 'ободок с сердцем', wreath: 'весенний венок', strawhat: 'летняя шляпа', leafcrown: 'осенний венок', wand: 'волшебная палочка', crystal: 'хрустальный шар', star: 'звёздочка', lollipop: 'леденец', minipumpkin: 'тыковка', candycane: 'карамельная трость', giftbox: 'подарок', ornament: 'ёлочный шар', snowflake: 'снежинка', heart: 'сердечко', rose: 'роза', letter: 'валентинка', icecream: 'мороженое', mapleleaf: 'кленовый лист', snow: 'снежинки', magic: 'волшебная', spooky: 'хеллоуин', headset: 'игровые наушники', gamepad: 'геймпад', coin: 'монетка', sword: 'пиксельный меч', mushroom: 'грибок', neon: 'неон', pizza: 'пицца', cherry: 'вишенка', cheese: 'сыр', ring: 'колечко', pearl: 'жемчужина', ruby: 'рубин', sapphire: 'сапфир', key: 'ключик', spoon: 'ложечка', gold: 'золотая', rainbow: 'радуга', stars: 'звёзды', hearts: 'сердечки', leaves: 'листики', dotted: 'пунктир' };
    let kind = 'hat', item = B.GIFTS.hat[0], owned = {}, copies = {};
    // цены: как сейчас в магазине (с учётом остатка); у вещей не из магазина — ценность (base)
    let price = {}, LIM = { max: 3, leg: 1 };
    const priceOf = (kd, v) => price[kd + '|' + v] || 0;
    const w = document.createElement('div'); w.className = 'adm-gift';
    w.innerHTML = `<div class="adm-gift-card" role="dialog" aria-label="Подарок"><h3>${all ? '🎁 Подарок всем птичкам' : `🎁 Подарок для ${u.nick ? '@' + esc(u.nick) : 'птички без ника'}`}</h3>${all ? '<p class="be-note">Получит каждая птичка с ником (кроме заблокированных). У кого такой вещи уже максимум (3, легендарной — 1), тому не придёт.</p>' : ''}
      <div class="adm-gift-cat"></div>
      <div class="adm-gift-prev"><figure><span class="gnow"></span><figcaption>Сейчас</figcaption></figure><span class="adm-gift-arrow">→</span><figure><span class="gp"></span><figcaption>С подарком</figcaption></figure>
        <p class="be-note">✓ — у птички это уже есть (в сумке), 🎁 — подарено, но ещё не открыто. Вещи, которых у птички уже максимум, скрыты («Фильтры» → «Показать то, что нельзя»). Человек увидит «🎁 Тебе подарок!» в профиле челленджа.</p></div>
      <input type="text" maxlength="200" placeholder="Записка к подарку (необязательно), например: «За 7 дней подряд!»">
      <div class="adm-quick" style="margin-top:12px"><button type="button" class="pill-btn pill-fill" data-send>Подарить</button><button type="button" class="pill-btn" data-x>Готово</button></div><p class="adm-gift-sent" aria-live="polite"></p></div>`;
    document.body.appendChild(w);
    // окно не закрывается после подарка — можно подарить несколько вещей подряд; список подаренного — внизу
    let sent = 0;
    const close = () => { w.remove(); if (sent && done) done(); };
    const sentNote = txt => { sent++; const p = w.querySelector('.adm-gift-sent'); p.insertAdjacentHTML('afterbegin', `<span>${esc(txt)}</span>`); };
    w.onclick = e => { if (e.target === w) close(); };
    w.querySelector('[data-x]').onclick = close;
    const nameOf = (kd, v) => NAMES[v] || (B.giftName ? B.giftName(kd, v, 1) : v);
    const isLeg = (kd, v) => !!(B.LEGEND && B.LEGEND.has(kd + '|' + v));
    // общий каталог (catalog-ui.js), режим выбора одной вещи; «что нельзя» — у птички уже максимум таких
    const S = giftDialog.f || (giftDialog.f = {}); // вкладка и фильтры — до перезагрузки
    const ui = C.browse(w.querySelector('.adm-gift-cat'), {
      mode: 'pick', state: S, id: u.id,
      tile: (kd, v) => { const st = owned[kd + '|' + v], pr = priceOf(kd, v); return { name: nameOf(kd, v), price: pr ? '🔘 ' + pr : '', badges: st ? [[st === 'new' ? '🎁' : '✓' + (copies[kd + '|' + v] > 1 ? ' ×' + copies[kd + '|' + v] : ''), 'have']] : [], markOn: av[kd] === v }; },
      price: (kd, v) => priceOf(kd, v) || null,
      mine: all ? null : (kd, v) => !!owned[kd + '|' + v], mineLabel: '✓ Что уже есть', notMineLabel: 'Чего ещё нет',
      cant: all ? null : (kd, v) => v !== '?' && kd !== 'any' && (copies[kd + '|' + v] || 0) >= (isLeg(kd, v) ? LIM.leg : LIM.max) ? 'У птички уже максимум таких' : '',
      pick: { has: (kd, v) => kd === kind && v === item },
      onOpen: (kd, v, t) => { kind = kd; item = v; C.mark(t, true, true); prev(); },
      cardsInto: window.PPCards ? box => giftCards(box) : null, onTab: v => w.classList.toggle('adm-gift-oncards', v === 'cards'),
    });
    w.classList.toggle('adm-gift-oncards', S.tab === 'cards');
    // вкладка «Карточки»: 🎲 случайная свободная (редкость, коллекция) — одной птичке или каждой своя; одной птичке — ещё и любая свободная по нажатию.
    // Карточки единственные: всем одну и ту же нельзя, у кого карточки кончились — тому не придёт (worker/cards.js admin/cards/gift, gift-all)
    const CS = giftDialog.c || (giftDialog.c = { rarity: '', coll: '' });
    const RAR = [['', 'Любая'], ['common', 'Обычная 🤖'], ['rare', 'Редкая'], ['unique', 'Уникальная']];
    function giftCards(box) {
      box.innerHTML = '<p class="be-note">Загрузка карточек…</p>';
      api('cards?show=free&lang=ru').then(d => {
        const free = d.cards.filter(c => c.rarity === 'common' || c.price > 0); // как в сюрпризе магазина: редкие и уникальные без цены ещё не готовы
        const left = () => free.filter(c => (!CS.rarity || c.rarity === CS.rarity) && (!CS.coll || c.collection === CS.coll)).length;
        box.innerHTML = `<div class="adm-gc"><p class="be-note">Каждая карточка — одна на весь сайт: подаренная уходит из магазина к птичке в альбом. Пуговки не списываются, птичка увидит «🃏 Тебе карточка!» в новостях.</p>
          <div class="adm-gc-row"><select data-r aria-label="Редкость">${RAR.map(r => `<option value="${r[0]}"${r[0] === CS.rarity ? ' selected' : ''}>${r[1]}</option>`).join('')}</select>
          <select data-c aria-label="Коллекция"><option value="">Все коллекции</option>${d.sets.map(x => `<option value="${esc(x.slug)}"${x.slug === CS.coll ? ' selected' : ''}>${esc(x.name)}</option>`).join('')}</select></div>
          <p class="adm-gc-left"></p><button type="button" class="pill-btn pill-fill" data-rnd></button>
          ${all ? '' : '<h4>Или выберите карточку</h4><div class="pc-grid adm-gc-grid"></div>'}</div>`;
        const rnd = box.querySelector('[data-rnd]'), grid = box.querySelector('.adm-gc-grid');
        const draw = () => {
          const n = left();
          box.querySelector('.adm-gc-left').textContent = `Свободных карточек: ${n}` + (all && n ? ' — получат ' + n + ' птичек максимум' : '');
          rnd.textContent = all ? '🎲 Каждой — своя случайная' : '🎲 Подарить случайную'; rnd.disabled = !n;
          if (grid) { grid.innerHTML = ''; free.filter(c => (!CS.rarity || c.rarity === CS.rarity) && (!CS.coll || c.collection === CS.coll)).forEach(c => grid.appendChild(window.PPCards.tile(c, { admin: true, onOpen: give }))); }
        };
        const done1 = (c, r) => { const i = free.findIndex(x => x.id === (r.card || c).id); if (i >= 0) free.splice(i, 1); sentNote('🃏 №' + r.card.n + ' «' + r.card.title + '» — подарено'); draw(); };
        const why = x => x.code === 'sold' ? 'Эту карточку уже кто-то купил.' : x.code === 'none' ? 'Свободных карточек не осталось.' : err(x);
        async function give(c) {
          if (!confirm(`Подарить №${c.n} «${c.title}» птичке ${u.nick ? '@' + u.nick : ''}?`)) return;
          try { done1(c, await api('admin/cards/gift', { uid: u.id, id: c.id, note: w.querySelector('input').value.trim() })); } catch (x) { alert(why(x)); giftCards(box); }
        }
        box.querySelector('[data-r]').onchange = e => { CS.rarity = e.target.value; draw(); };
        box.querySelector('[data-c]').onchange = e => { CS.coll = e.target.value; draw(); };
        rnd.onclick = async () => {
          const note = w.querySelector('input').value.trim(), what = (RAR.find(r => r[0] === CS.rarity) || RAR[0])[1].toLowerCase();
          rnd.disabled = true;
          try {
            if (all) {
              if (!confirm(`Подарить каждой птичке свою случайную карточку (${what})?`)) { rnd.disabled = false; return; }
              const r = await api('admin/cards/gift-all', { rarity: CS.rarity, collection: CS.coll, note });
              sentNote(`🃏 Случайная карточка — отправлено ${r.count} из ${r.birds} птичек` + (r.count < r.birds ? ' (карточки кончились)' : ''));
              return giftCards(box);
            }
            const r = await api('admin/cards/gift', { uid: u.id, rarity: CS.rarity, collection: CS.coll, note });
            done1(r.card, r);
          } catch (x) { alert(why(x)); draw(); }
        };
        draw();
      }).catch(x => { box.innerHTML = `<p class="be-note">${err(x)}</p>`; });
    }
    const prev = () => {
      const gn = w.querySelector('.gnow'); if (!gn.firstChild) gn.appendChild(B.avatar(u.id, av, 96));
      const gp = w.querySelector('.gp'); gp.innerHTML = '';
      gp.appendChild(B.isRoomKind && B.isRoomKind(kind) || kind === 'any' || item === '?' ? B.itemIcon(kind, item, 96, u.id) : B.avatar(u.id, Object.assign({}, av, { [kind]: item }), 96));
      const sp = priceOf(kind, item), send = w.querySelector('[data-send]');
      send.textContent = sp ? `Подарить · 🔘 ${sp}${all ? ' каждой' : ''}` : 'Подарить';
    };
    api('admin/shop').then(r => { for (const x of r.items || []) price[x.kind + '|' + x.item] = x.price || x.base || 0; for (const [k, v] of Object.entries(r.suggested || {})) if (!price[k]) price[k] = v; if (r.rules) LIM = { max: r.rules.shopMax || 3, leg: r.rules.legendMax || 1 }; ui.drawList(); prev(); }).catch(() => {});
    if (!all) api('admin/gifts?uid=' + u.id).then(r => { for (const g of r.gifts) { const k = g.kind + '|' + g.item; owned[k] = owned[k] === 'bag' ? 'bag' : g.status; copies[k] = (copies[k] || 0) + 1; } ui.drawList(); }).catch(() => {});
    w.querySelector('[data-send]').onclick = async e => {
      e.target.disabled = true;
      try {
        if (all) { if (!confirm('Подарить «' + (B.giftName ? B.giftName(kind, item, 1) : item) + '» всем птичкам?')) { e.target.disabled = false; return; } const r = await api('admin/gift-all', { kind, item, note: w.querySelector('input').value.trim() }); sentNote('🎁 ' + (B.giftName ? B.giftName(kind, item, 1) : item) + ' — отправлено ' + r.count + ' птичкам'); e.target.disabled = false; return; }
        const r = await api('admin/gift', { uid: u.id, kind, item, note: w.querySelector('input').value.trim() });
        const gk = r && r.kind || kind, got = r && r.item || item; owned[gk + '|' + got] = owned[gk + '|' + got] || 'new'; copies[gk + '|' + got] = (copies[gk + '|' + got] || 0) + 1; // у сюрприза сервер называет, что выпало
        sentNote('🎁 ' + (B.giftName ? B.giftName(gk, got, 1) : got) + ' — подарено'); e.target.disabled = false; ui.drawList(); }
      catch (x) { e.target.disabled = false; alert(err(x)); }
    };
    prev();
  }

  // ---------- магазин: цена и количество каждой вещи из коллекций ----------
  // цена от остатка — как effPrice в worker/index.js: ценность × (обычный запас / остаток)^0.4, от ×0.75 до ×2.5; «мало / обычно / много» — от числа птичек (STOCK на сервере)
  let PR = { birds: 0, low: 3, norm: 10, many: 25, lowLeg: 1, normLeg: 3, manyLeg: 7, priceMin: 0.75, priceMax: 2.5 }; // формула цены — из «📜 Правил» (приходит с admin/shop)
  const effPrice = (base, stock, leg) => base > 0 ? Math.max(5, Math.round(base * Math.max(PR.priceMin, Math.min(PR.priceMax, Math.pow((leg ? PR.normLeg : PR.norm) / Math.max(1, stock || 0), 0.4))) / 5) * 5) : 0;
  let sFilter = 'all', sq = '', sStock = 'all', sSort = 'cat', sList = false, redrawT = 0; const sOpen = new Set(); // фильтр «Закончились / Скоро закончатся» — общий для таблицы остатков и списка вещей (sStock)
  async function shop() {
    main.innerHTML = '<p class="be-note">Загрузка…</p>';
    let d; try { d = await api('admin/shop'); } catch (e) { main.innerHTML = `<p class="be-note">${err(e)}</p>`; return; }
    if (d.pricing) PR = d.pricing;
    const eco = d.economy || { total: 0, birds: 0 };
    const B = window.PPBirds; if (!B) { main.innerHTML = '<p class="be-note">Не загрузился каталог вещей (birds.js).</p>'; return; }
    const rows = {}; d.items.forEach(r => { rows[r.kind + '|' + r.item] = r; });
    const all = []; B.GIFT_KINDS.forEach(k => (B.withSurprise ? B.withSurprise(k[0]) : B.GIFTS[k[0]] || []).forEach(v => all.push({ kind: k[0], kindName: k[1][1], item: v, name: B.giftName(k[0], v, 1) })));
    const isLeg = x => !!(B.LEGEND && B.LEGEND.has(x.kind + '|' + x.item)), lowN = x => isLeg(x) ? PR.lowLeg : PR.low, manyN = x => isLeg(x) ? PR.manyLeg : PR.many;
    // % категорий: 100 — обычная цена, 150 — в полтора раза дороже, 50 — вдвое дешевле
    const catBox = () => { const cm = d.catMult || {}; return `<section class="adm-stockbox adm-cats"><h3>🏷 Цены категорий</h3><p class="be-note">100 % — обычная цена. Поставьте 150 %, чтобы вся категория стала в полтора раза дороже, 50 % — вдвое дешевле. Сохраняется сразу.</p>
      <div class="adm-cat-grid">${B.GIFT_KINDS.filter(k => k[0] !== 'any').map(k => { const ps = all.filter(x => x.kind === k[0] && !isLeg(x) && x.item !== '?').map(x => (rows[x.kind + '|' + x.item] || {}).price || 0).filter(Boolean); const mn = ps.length ? Math.min(...ps) : 0, mx = ps.length ? Math.max(...ps) : 0;
        return `<label class="adm-cat${(cm[k[0]] || 100) !== 100 ? ' changed' : ''}"><span>${esc(k[1][1])}</span><span class="adm-cat-in"><input type="number" min="10" max="1000" step="5" value="${cm[k[0]] || 100}" data-cat="${k[0]}"> %</span><small>${ps.length ? (mn === mx ? mn : mn + '–' + mx) + ' 🔘' : '—'}</small></label>`; }).join('')}</div></section>`; };
    // легендарные: точная цена и остаток для каждой
    const legBox = () => `<section class="adm-stockbox adm-legs"><h3>★ Легендарные — цена каждой</h3><p class="be-note">Точная цена (без всяких множителей) и сколько штук в продаже. Сохраняется сразу.</p>
      <div class="adm-sk-grid">${all.filter(isLeg).map(x => { const w = rows[x.kind + '|' + x.item] || { base: 0, stock: 0 }; return `<div class="adm-sk-it adm-legend adm-leg-it${(w.stock || 0) > 0 ? '' : ' off'}" data-k="${esc(x.kind)}" data-i="${esc(x.item)}"><span class="adm-shop-pic"></span><span class="adm-sk-nm">${esc(x.name)}</span><label>Цена <input type="number" min="0" max="100000" inputmode="numeric" value="${w.base || 0}" data-f="price"></label><label>Штук <input type="number" min="0" max="100000" inputmode="numeric" value="${w.stock || 0}" data-f="stock"></label><small class="adm-shop-st">${w.stock > 0 ? '🔘 ' + w.price : '—'}</small></div>`; }).join('')}</div></section>`;
    const draw = () => {
      const theme = sFilter.startsWith('theme:') ? B.GIFT_THEMES.find(t => 'theme:' + t[0] === sFilter) : null, q = sq.trim().toLowerCase();
      const list = all.filter(x => {
        const r = rows[x.kind + '|' + x.item] || {};
        const n = r.stock || 0;
        if (sStock === 'stock' && !(n > 0)) return false;
        if (sStock === 'low' && !(n > 0 && n <= lowN(x))) return false;
        if (sStock === 'many' && !(n >= manyN(x))) return false;
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
      const sOnly = sStock === 'none' ? 'empty' : sStock === 'low' ? 'low' : sStock === 'many' ? 'many' : 'all';
      const only = x => sOnly === 'empty' ? cnt(x) === 0 : sOnly === 'low' ? cnt(x) > 0 && cnt(x) <= lowN(x) : sOnly === 'many' ? cnt(x) >= manyN(x) : true;
      const sum = B.GIFT_KINDS.map(k => { const xs = all.filter(x => x.kind === k[0]); const on = xs.filter(x => cnt(x) > 0); return { k: k[0], name: k[1][1], total: xs.length, on: on.length, pcs: on.reduce((a, x) => a + cnt(x), 0), low: on.filter(x => cnt(x) <= lowN(x)).length, txt: stockTxt(xs), hit: xs.filter(only).length, value: xs.reduce((a, x) => a + cnt(x) * ((rows[x.kind + '|' + x.item] || {}).price || 0), 0), each: (ns => ns.length ? (Math.min(...ns) === Math.max(...ns) ? String(ns[0]) : Math.min(...ns) + '–' + Math.max(...ns)) : '—')(xs.filter(x => !(B.LEGEND && B.LEGEND.has(x.kind + '|' + x.item))).map(cnt)) }; });
      const onSale = all.filter(x => (rows[x.kind + '|' + x.item] || {}).stock > 0).length;
      const fb = (k, l) => `<button type="button" class="pill-btn" data-sf="${k}" aria-pressed="${sFilter === k}">${l}</button>`;
      main.innerHTML = `<section class="adm-box"><h2>🛍 Магазин</h2>
        <p class="be-note">Цены считаются сами: <b>ценность вещи × % категории × уровень цен</b> (он сам подстраивается под то, сколько птички зарабатывают и копят — сейчас ×${(d.level && d.level.L) || 1}), а ещё дороже, когда штук мало, и дешевле, когда много. Вы меняете только <b>% категорий</b> и <b>цены легендарных</b> — они ниже. Остаток меняется сам (пополнение каждую ночь), но его можно поставить и вручную. Сейчас в продаже: <b>${onSale}</b> из ${all.length}.</p>
        <p class="adm-refill">↻ Пополнить <b>все закончившиеся, кроме легендарных</b> (сейчас ${all.filter(x => !isLeg(x) && cnt(x) === 0).length} ${pl1(all.filter(x => !isLeg(x) && cnt(x) === 0).length)}) — по <input type="number" id="adm-refill-n" min="1" max="10000" inputmode="numeric" value="${PR.norm}" style="width:70px"> шт. <button type="button" class="pill-btn pill-fill" id="adm-refill">Пополнить</button> <small class="be-note">обычный запас сейчас — ${PR.norm} шт.</small></p>
        <details class="adm-fine"><summary>⚙️ Тонкая настройка цен — можно не трогать</summary>${catBox()}${legBox()}</details>
        ${(() => {
          // экономика: пуговки у птичек и насколько сейчас дороги вещи (цена сейчас ÷ ценность, по вещам в продаже)
          const on = all.filter(x => cnt(x) > 0), sp = on.reduce((a, x) => a + ((rows[x.kind + '|' + x.item] || {}).price || 0), 0), sb = on.reduce((a, x) => a + ((rows[x.kind + '|' + x.item] || {}).base || 0), 0);
          const k = sb ? sp / sb : 1, avgP = on.length ? Math.round(sp / on.length) : 0, avgB = eco.birds ? Math.round(eco.total / eco.birds) : 0;
          const verdict = !on.length ? ['⚪', 'в продаже ничего нет'] : k < 0.92 ? ['🟢', 'сейчас вещи в среднем <b>дешёвые</b> (запасы большие)'] : k > 1.15 ? ['🔴', 'сейчас вещи в среднем <b>дорогие</b> (запасы маленькие)'] : ['🟡', 'цены сейчас <b>нормальные</b>'];
          return `<section class="adm-eco"><div><b>🔘 ${n(eco.total)}</b><span>пуговок у всех птичек</span></div><div><b>🔘 ${n(avgB)}</b><span>в среднем на птичку (${n(eco.birds)} с ником)</span></div><div><b>🔘 ${n(avgP)}</b><span>средняя цена вещи в продаже</span></div>
            <div class="adm-eco-v"><b>${verdict[0]} ×${k.toFixed(2)}</b><span>${verdict[1]}${on.length && avgP ? ` · средней птичке хватает на ~${Math.floor(avgB / avgP)} ${Math.floor(avgB / avgP) === 1 ? 'вещь' : 'вещей'}` : ''}</span></div>
            </section>`;
        })()}
        <section class="adm-stockbox"><h3>📦 Остаток по категориям</h3>
          <p class="be-note">Сколько штук каждой вещи продаётся. Впишите число и нажмите «💾 Поставить» внизу — у всех вещей категории станет столько штук (легендарные не меняются, кроме фильтров «Закончились», «Мало» и «Много»). Нажмите на название категории, чтобы открыть её вещи и поменять по одной. Цена считается сама: меньше штук — дороже.</p>
          <div class="adm-sbar"><span class="adm-sl">Показать:</span>${[['all', 'Все'], ['empty', '✕ Закончились'], ['low', `⚠️ Мало (1–${PR.low} шт.)`], ['many', `📦 Много (от ${PR.many} шт.)`]].map(([k, l]) => `<button type="button" class="pill-btn" data-only="${k}" aria-pressed="${sOnly === k}">${l}</button>`).join('')}</div>
          ${sOnly !== 'all' && !sum.some(r => r.hit) ? '<p class="be-note">Таких вещей нет 🎉</p>' : ''}
          <table class="be-table adm-table adm-stock"><thead><tr><th>Категория</th><th>Сейчас в продаже</th><th title="Сколько пуговок нужно, чтобы купить всё, что сейчас есть в продаже (по сегодняшним ценам)">Всё вместе стоит</th><th>Сколько штук поставить</th></tr></thead><tbody>
          ${sum.filter(r => sOnly === 'all' || r.hit).map(r => `<tr data-sk="${r.k}"><td><button type="button" class="adm-exp" data-exp="${r.k}" aria-expanded="${sOpen.has(r.k)}">${sOpen.has(r.k) ? '▾' : '▸'} ${esc(r.name)}</button><small class="adm-sk-n">${r.total} ${pl1(r.total)}</small></td><td>${sOnly === 'all' ? r.txt : `<span class="adm-sk-0">${r.hit} ${pl1(r.hit)} ${sOnly === 'empty' ? 'закончились' : sOnly === 'low' ? 'мало' : 'много'}</span><br><small>${r.txt}</small>`}</td><td>${r.value ? '🔘 ' + n(r.value) : '—'}</td><td class="adm-setst"><input type="number" min="0" max="10000" inputmode="numeric" placeholder="—" aria-label="Остаток: ${esc(r.name)}"></td></tr>${sOpen.has(r.k) ? `<tr class="adm-sk-items"><td colspan="4"><div class="adm-sk-grid">${all.filter(x => x.kind === r.k && only(x)).map(x => { const w = rows[x.kind + '|' + x.item] || { price: 0, base: (d.suggested || {})[x.kind + '|' + x.item] || 0, stock: 0 }, leg = B.LEGEND && B.LEGEND.has(x.kind + '|' + x.item); return `<div class="adm-sk-it${leg ? ' adm-legend' : ''}${(w.stock || 0) > 0 ? '' : ' off'}" data-k="${esc(x.kind)}" data-i="${esc(x.item)}"><span class="adm-shop-pic"></span><span class="adm-sk-nm">${esc(x.name)}${leg && !x.name.includes('★') ? ' ★' : ''}</span><label>Остаток <input type="number" min="0" max="100000" inputmode="numeric" value="${w.stock || 0}" data-f="stock"></label>${leg ? `<label>Цена <input type="number" min="0" max="100000" inputmode="numeric" value="${w.base ?? w.price ?? 0}" data-f="price"></label>` : ''}<small class="adm-shop-st">${w.stock > 0 ? '🔘 ' + w.price : '—'}</small></div>`; }).join('')}</div></td></tr>` : ''}`).join('')}
          <tr data-sk="*"><td><b>Весь магазин</b><small class="adm-sk-n">каждой вещи (кроме легендарных) станет ровно столько штук</small><small class="adm-sk-n">${all.length} ${pl1(all.length)}</small></td><td>${sum.reduce((a, r) => a + r.on, 0)} в продаже, ${sum.reduce((a, r) => a + r.pcs, 0)} шт. всего</td><td><b>🔘 ${n(sum.reduce((a, r) => a + r.value, 0))}</b></td><td class="adm-setst"><input type="number" min="0" max="10000" inputmode="numeric" placeholder="—" aria-label="Остаток всем"></td></tr></tbody></table>
          <p><button type="button" class="pill-btn pill-fill" id="adm-set-all">💾 Поставить</button> <small class="be-note">— всем строкам, где вписано число</small></p></section>
        <details class="adm-fine" id="adm-list"${sList || sq || sFilter !== 'all' || sSort !== 'cat' ? ' open' : ''}><summary>📋 Все вещи одним списком — поиск, темы, порядок</summary>
        <div class="be-filters"><input type="search" id="adm-sq" placeholder="🔍 Найти вещь" value="${esc(sq)}"></div>
        <div class="adm-sbar"><label class="adm-sl">Порядок: <select id="adm-sort"><option value="cat">по видам</option><option value="few"${sSort === 'few' ? ' selected' : ''}>меньше всего сверху</option><option value="many"${sSort === 'many' ? ' selected' : ''}>больше всего сверху</option></select></label></div>
        <div class="adm-sbar"><span class="adm-sl">Вид:</span>${fb('all', 'Все')}${B.GIFT_KINDS.map(k => fb('kind:' + k[0], k[1][1])).join('')}</div>
        <div class="adm-sbar"><span class="adm-sl">Тема:</span>${B.GIFT_THEMES.map(t => fb('theme:' + t[0], t[1][1])).join('')}</div>
        <table class="be-table adm-table adm-shop"><thead><tr><th>Вещь</th><th>Вид</th><th>Ценность 🔘</th><th>Остаток</th><th>Цена сейчас</th></tr></thead><tbody>
        ${list.map(x => { const r = rows[x.kind + '|' + x.item] || { price: 0, base: (d.suggested || {})[x.kind + '|' + x.item] || 0, stock: 0 }; const leg = B.LEGEND && B.LEGEND.has(x.kind + '|' + x.item); return `<tr data-k="${esc(x.kind)}" data-i="${esc(x.item)}"${leg ? ' class="adm-legend"' : ''}><td class="adm-shop-it"><span class="adm-shop-pic"></span>${esc(x.name)}${leg ? ' <span class="adm-leg-tag" title="Легендарная: 1 штука на птичку, дарить нельзя">★ легендарная</span>' : ''}</td><td>${esc(x.kindName)}</td>
          <td data-l="Цена 🔘">${leg ? `<input type="number" inputmode="numeric" min="0" max="100000" step="1" value="${r.base ?? r.price}" data-f="price" aria-label="Цена легендарной">` : `<span class="be-note" title="ценность × % категории × уровень цен">${r.base || '—'}</span>`}</td><td data-l="Количество"><input type="number" inputmode="numeric" min="0" max="100000" step="1" value="${r.stock}" data-f="stock" aria-label="Количество"></td><td class="adm-shop-st">${r.stock > 0 ? '🔘 ' + r.price : '—'}</td></tr>`; }).join('')}</tbody></table></details></section>
        <section class="adm-danger"><h3>⚠️ Осторожно</h3><button type="button" class="pill-btn be-danger adm-empty" id="adm-empty-all">🧹 Опустошить полки</button><p class="be-note">У всех вещей (и легендарных) остаток станет 0 — в магазине ничего не будет в продаже.</p></section>`;
      main.querySelectorAll('[data-cat]').forEach(i => i.onchange = async () => {
        const v = Math.max(10, Math.min(1000, Math.round(+i.value) || 100)); i.disabled = true;
        try { const r = await api('admin/shop/cats', { mult: { [i.dataset.cat]: v } }); d.catMult = r.catMult; Object.keys(rows).forEach(k => delete rows[k]); r.items.forEach(x => { rows[x.kind + '|' + x.item] = x; }); draw(); }
        catch (x) { i.disabled = false; alert(err(x)); }
      });
      main.querySelectorAll('[data-rp]').forEach(b => b.onclick = async () => {
        const mode = b.dataset.rp, pct = +main.querySelector('#adm-rp-pct').value || 10;
        const ask = mode === 'reset' ? 'Вернуть всем вещам рекомендуемую ценность? Ваши ручные цены заменятся.' : `Сделать все вещи ${mode === 'up' ? 'дороже' : 'дешевле'} на ${pct}%? (меняется ценность; цена сейчас по-прежнему зависит от остатка)`;
        if (!confirm(ask)) return;
        b.disabled = true;
        try { await api('admin/shop/reprice', { mode, pct }); shop(); } catch (x) { b.disabled = false; alert(err(x)); }
      });
      main.querySelectorAll('[data-only]').forEach(b => b.onclick = () => { sStock = { all: 'all', empty: 'none', low: 'low', many: 'many' }[b.dataset.only]; draw(); });
      // пополнить все закончившиеся (остаток 0), кроме легендарных, — не зависит от фильтров
      main.querySelector('#adm-refill').onclick = async e => {
        const k = Math.max(1, Math.min(10000, Math.floor(+main.querySelector('#adm-refill-n').value) || 0)), xs = all.filter(x => !isLeg(x) && cnt(x) === 0);
        if (!xs.length) return alert('Закончившихся обычных вещей нет 🎉');
        if (!confirm(`Пополнить ${xs.length} ${pl1(xs.length)}, которые закончились (кроме легендарных), — по ${k} шт.?`)) return;
        e.target.disabled = true;
        try { const r = await api('admin/shop/restock', { items: xs.map(x => [x.kind, x.item, k]), set: true }); Object.keys(rows).forEach(q => delete rows[q]); r.items.forEach(x => { rows[x.kind + '|' + x.item] = x; }); draw(); }
        catch (x) { e.target.disabled = false; alert(err(x)); }
      };
      main.querySelectorAll('[data-exp]').forEach(b => b.onclick = () => { const k = b.dataset.exp; sOpen.has(k) ? sOpen.delete(k) : sOpen.add(k); draw(); });
      main.querySelectorAll('.adm-sk-it').forEach(el => { try { el.querySelector('.adm-shop-pic').appendChild(B.giftPic(el.dataset.k, el.dataset.i, 2, 40)); } catch (e) {} });
      main.querySelectorAll('tr[data-k]').forEach(tr => { const pic = tr.querySelector('.adm-shop-pic'); try { pic.appendChild(B.giftPic(tr.dataset.k, tr.dataset.i, 2, 48)); } catch (e) {} });
      main.querySelectorAll('[data-sf]').forEach(b => b.onclick = () => { sFilter = b.dataset.sf; draw(); });
      main.querySelectorAll('[data-ss]').forEach(b => b.onclick = () => { sStock = b.dataset.ss; draw(); });
      main.querySelector('#adm-sort').onchange = e => { sSort = e.target.value; draw(); };
      main.querySelector('#adm-list').addEventListener('toggle', e => { sList = e.target.open; });
      // поставить остаток: категории (или всему магазину) — каждой вещи ровно столько штук
      const setStock = async (pairs, btn) => {
        const items = []; let what = [];
        for (const [k, n] of pairs) { const xs = (k === '*' ? all : all.filter(x => x.kind === k)).filter(x => only(x) && (sOnly !== 'all' || !(B.LEGEND && B.LEGEND.has(x.kind + '|' + x.item)))); xs.forEach(x => items.push([x.kind, x.item, n])); what.push((k === '*' ? 'весь магазин' : (sum.find(r => r.k === k) || {}).name) + ' — по ' + n + ' шт. (' + xs.length + ')'); }
        if (!items.length) return alert(pairs.length ? (sOnly === 'all' ? 'Здесь нечего менять: в категории только легендарные (их меняют по одной или с фильтром).' : 'Под этот фильтр («' + { empty: 'Закончились', low: 'Мало', many: 'Много' }[sOnly] + '») в категории сейчас нет вещей — возможно, вы их уже пополнили. Нажмите «Все», чтобы поставить остаток всей категории.') : 'Впишите остаток хотя бы для одной категории.');
        if (!confirm((sOnly === 'empty' ? 'Пополнить только ЗАКОНЧИВШИЕСЯ вещи:\n' : sOnly === 'low' ? 'Пополнить только вещи, которых МАЛО:\n' : sOnly === 'many' ? 'Поставить остаток только вещам, которых МНОГО:\n' : 'Поставить остаток ВСЕМ вещам:\n') + what.join('\n'))) return;
        if (btn) btn.disabled = true;
        try { const r = await api('admin/shop/restock', { items, set: true }); Object.keys(rows).forEach(k => delete rows[k]); r.items.forEach(x => { rows[x.kind + '|' + x.item] = x; }); draw(); }
        catch (x) { if (btn) btn.disabled = false; alert(err(x)); }
      };
      const val = tr => { const v = tr.querySelector('input').value.trim(); return v === '' ? null : Math.max(0, Math.min(10000, Math.floor(+v) || 0)); };
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
        const pi = tr.querySelector('[data-f="price"]'), price = pi ? pi.value : ((rows[tr.dataset.k + '|' + tr.dataset.i] || {}).base || 0), stock = tr.querySelector('[data-f="stock"]').value;
        tr.classList.remove('saved');
        try { const r = await api('admin/shop', { kind, item, price, stock }), cur = r.now; rows[kind + '|' + item] = { kind, item, base: r.base, price: cur, stock: r.stock }; tr.classList.add('saved'); tr.classList.toggle('off', tr.classList.contains('adm-sk-it') && !(r.stock > 0)); tr.querySelector('.adm-shop-st').textContent = r.stock > 0 ? '🔘 ' + cur : '—'; later(); }
        catch (e) { alert(err(e)); }
      });
      // после правки одной вещи — пересчитать сводку и фильтры (когда курсор ушёл из полей остатка/ценности)
      const later = () => { clearTimeout(redrawT); redrawT = setTimeout(() => { const a = document.activeElement; if (a && a.matches && a.matches('.adm-shop input, .adm-sk-it input')) return later(); if (main.querySelector('.adm-stockbox')) draw(); }, 900); };
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
        <p><button type="button" class="pill-btn pill-fill" id="adm-giftall">🎁 Подарить всем</button> <button type="button" class="pill-btn pill-fill" id="adm-salary" title="Пуговки сразу зачисляются всем птичкам с ником; при заходе на сайт птичка увидит конвертик от администрации Воббленда">💌 Выдать зарплату</button> <button type="button" class="pill-btn pill-fill" id="adm-tax" title="Списать пуговки у всех или только у тех, кто давно не заходит">🧾 Списать налог</button></p>
        <div class="be-filters"><input type="search" id="adm-bq" placeholder="🔍 Найти по нику" value="${esc(bq)}"></div>
        <table class="be-table adm-table adm-birds"><thead><tr><th>Ник</th>${th('created_at', 'Появилась')}${th('last_seen', 'Заходила')}${th('works', '🎨 Работ')}${th('best', '🔥 Рекорд серии')}${th('buttons', '🔘 Пуговки')}${th('invited', '👥 Позвали')}<th>Подарки</th><th>Вход</th></tr></thead><tbody>
        ${list.map(u => `<tr><td>${u.nick ? `<a href="/bird/?nick=${encodeURIComponent(u.nick)}" target="_blank">@${esc(u.nick)}</a>` : '<i>без ника</i>'}${u.banned ? ' <small class="be-danger">заблокирована</small>' : ''}</td>
          <td data-l="Появилась">${fmt(u.created_at)}</td><td data-l="Заходила">${fmt(u.last_seen)}</td><td data-l="🎨 Работ">${n(u.works)}</td><td data-l="🔥 Рекорд">${n(u.best)}</td>
          <td data-l="🔘 Пуговки"><b>${n(u.buttons)}</b> <button type="button" class="adm-mini" data-btn="${u.id}" title="Добавить или забрать пуговки">±</button></td><td data-l="👥 Позвали">${n(u.invited)}</td>
          <td data-l="Подарки"><button type="button" class="pill-btn" data-gift="${u.id}" title="Подарить семечко для аватара">🎁${u.gifts ? ' ' + u.gifts : ''}</button></td>
          <td data-l="Вход"><small title="${u.via === 'g:' ? 'Входит через Google' : 'Входит с паролем'}">${u.via === 'g:' ? 'Google' : ''}${u.via === 'g:' && u.haspw ? ' + ' : ''}${u.haspw ? '🔑' : ''}${u.pw_temp ? ' (временный)' : ''}</small> <button type="button" class="adm-mini" data-pwreset="${u.id}" title="Временный пароль: птичка входит с ним и сразу придумывает свой">🔑 Сбросить пароль</button></td></tr>`).join('')}</tbody></table>
        <details class="adm-fine"><summary>⋯ Редко нужно</summary><p><button type="button" class="pill-btn" id="adm-backfill">🔘 Начислить всем за прошлые бейджи и рисунки</button> <small class="be-note">Нужно было один раз, когда появились пуговки. Повторно не начислит — каждая награда даётся один раз.</small></p></details></section>`;
      main.querySelectorAll('[data-gift]').forEach(b => b.onclick = () => giftDialog(d.users.find(u => u.id === +b.dataset.gift), birds));
      main.querySelector('#adm-giftall').onclick = () => giftDialog(null, birds);
      // зарплата: всем птичкам с ником (кроме заблокированных) N пуговок сразу, у них — конвертик с анимацией (account.js)
      main.querySelector('#adm-salary').onclick = async e => {
        const v = prompt('Зарплата: сколько пуговок 🔘 выдать КАЖДОЙ птичке с ником?\nПуговки зачислятся сразу, а при заходе на сайт птичка откроет конвертик от администрации Воббленда.', '10');
        if (v == null) return;
        const n = Math.floor(+v);
        if (!(n >= 1 && n <= 10000)) return alert('Нужно число от 1 до 10000.');
        if (!confirm(`Выдать всем птичкам по ${n} 🔘?`)) return;
        e.target.disabled = true;
        try { const r = await api('admin/salary', { amount: n }); alert(`💌 Зарплата выдана: ${r.count} птичкам по ${r.amount} 🔘`); } catch (x) { alert(err(x)); }
        e.target.disabled = false;
      };
      main.querySelector('#adm-tax').onclick = () => taxDialog(d.users, birds);
      // «🔑 Сбросить пароль» (этап 12): временный пароль показывается один раз — отправьте его птичке сами; при входе она придумает новый
      main.querySelectorAll('[data-pwreset]').forEach(b => b.onclick = async () => {
        const u = d.users.find(x => x.id === +b.dataset.pwreset);
        if (!confirm(`Сбросить пароль @${u.nick || u.id}? Старый пароль перестанет работать, птичка выйдет на всех устройствах.`)) return;
        try { const r = await api('admin/pw-reset', { uid: u.id }); u.haspw = 1; u.pw_temp = 1; draw(); prompt(`Временный пароль — отправьте птичке (показывается один раз).\nВход: ${r.login}\nПри входе она придумает новый пароль.`, r.password); } catch (e) { alert(err(e)); }
      });
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
</div></section>
      <section class="adm-danger"><h3>⚠️ Осторожно</h3><label class="pill-btn adm-restore">♻ Восстановить из копии<input type="file" accept=".zip" hidden data-bk="restore"></label><p class="be-note">Восстановление заменяет данные сайта данными из архива копии.</p></section>`;
  function wireBackup() {
    const B = window.PPBackup; if (!B) return;
    main.querySelectorAll('[data-bk="download"]').forEach(b => b.onclick = () => B.download(b));
    main.querySelectorAll('[data-bk="auto"]').forEach(b => b.onclick = () => B.autoPanel());
    main.querySelectorAll('[data-bk="restore"]').forEach(inp => inp.onchange = () => { const f = inp.files[0]; inp.value = ''; if (f) B.restore(f, inp.closest('label')); });
  }
  function backup() { main.innerHTML = backupBox(); wireBackup(); }

  // сначала проверка: не админ → «Этот кабинет только для админа» + вход по коду восстановления; админ без PIN на этом устройстве → PIN
  (async () => {
    try { const g = await api('admin/sec'); if (g.pinSet && !g.pinOk) { main.innerHTML = pinForm(); wirePin(); return; } }
    catch (e) { if (e.code === 'admin' || e.code === 403) { main.innerHTML = `<p class="be-note">Этот кабинет только для админа.</p>${recoverForm()}`; wireRecover(); return; } }
    route();
  })();
})();
