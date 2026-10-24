// Кабинет → «✉️ Письма» (admin.js открывает PPMailAdmin.mount(main)): кто согласился на письма, сколько ушло сегодня,
// новое письмо на 3 языках (🌐 перевод), «Отправить мне» и «Отправить всем». Сервер — worker/mail.js (/api/admin/mail*).
(function () {
  const CAT = { games: '🎮 Уведомления из игр', feat: '✨ Новые фишки на сайте', news: '🐦 Новости от Полли' };
  const ST = { send: '⏳ отправляется', done: '✓ отправлено', stop: '⏹ остановлено' };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ERR = { mail: 'Письма выключены: в Cloudflare нет RESEND_KEY и MAIL_FROM.', en: 'Заполните тему и текст на EN — это запасной язык.', cat: 'Выберите вид письма.' };
  const api = async (path, body) => {
    const r = await fetch('/api/' + path, body ? { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : { credentials: 'same-origin' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(d.error || r.status), { code: d.error });
    return d;
  };
  const fmt = t => new Date(t * 1000).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const KEY = 'pp_mail_draft'; // черновик — в браузере, чтобы не пропал при обновлении страницы

  async function mount(main) {
    main.innerHTML = '<p class="be-note">Загрузка…</p>';
    let d; try { d = await api('admin/mail'); } catch (e) { main.innerHTML = `<p class="be-note">${esc(ERR[e.code] || e.message)}</p>`; return; }
    const s = d.stats || {}, n = k => Number(s[k]) || 0;
    let draft = {}; try { draft = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { /* нет хранилища */ }
    main.innerHTML = `${d.on ? '' : `<p class="be-note">⚠️ ${ERR.mail}</p>`}
      <section class="adm-box"><h2>📮 Кто согласился</h2>
        <p class="be-note">Птичек с почтой: <b>${n('email')}</b> · ответили на окно: <b>${n('asked')}</b> · «Не сейчас»: <b>${n('later')}</b>. Окно «Можно писать тебе на почту?» видят все птички при входе, пока не ответят.</p>
        <table class="be-table adm-table"><tbody>${Object.keys(CAT).map(k => `<tr><td>${CAT[k]}</td><td><b>${n(k)}</b></td></tr>`).join('')}</tbody></table>
        <p class="be-note">Сегодня отправлено: <b>${d.today}</b> из ${d.max} (бесплатный лимит Resend — 100 в сутки). Что не успело — уйдёт само в следующие часы и дни. Одной птичке — не больше одного письма в день: если сегодня ей уже что-то пришло, ваше письмо уйдёт завтра.</p></section>
      <section class="adm-box"><h2>✍️ Новое письмо</h2>
        <p><label>Кому: <select class="ml-cat">${Object.keys(CAT).map(k => `<option value="${k}"${draft.cat === k ? ' selected' : ''}>${CAT[k]} — ${n(k)}</option>`).join('')}</select></label></p>
        <div class="ml-tabs adm-quick">${['en', 'ru', 'lv'].map(l => `<button type="button" class="pill-btn${l === 'en' ? ' pill-fill' : ''}" data-l="${l}">${l.toUpperCase()}</button>`).join('')}<span class="ml-tr"></span></div>
        ${['en', 'ru', 'lv'].map(l => `<div class="ml-lang" data-l="${l}"${l === 'en' ? '' : ' hidden'}>
          <p><input class="be-input ml-s" placeholder="Тема письма (${l.toUpperCase()})" value="${esc((draft[l] || {}).s || '')}" maxlength="200" style="width:100%"></p>
          <p><textarea class="be-input ml-t" rows="10" placeholder="Текст письма (${l.toUpperCase()}). Ссылки — просто адресом: https://www.pigeonpolly.com/…" style="width:100%">${esc((draft[l] || {}).t || '')}</textarea></p></div>`).join('')}
        <p class="be-note">Подпись внизу добавится сама: почему пришло письмо, «Выбрать, что присылать» и «Отписаться». Ответы придут вам на Gmail. Пустой RU или LV — тем птичкам уйдёт EN.</p>
        <div class="adm-quick"><button type="button" class="pill-btn ml-test">📨 Отправить мне (${esc(d.me || 'нет почты')})</button><button type="button" class="pill-btn pill-fill ml-send">🚀 Отправить всем</button></div>
        <p class="be-note ml-msg" aria-live="polite"></p></section>
      <section class="adm-box"><h2>📜 Отправленные</h2>
        ${d.letters.length ? `<table class="be-table adm-table"><thead><tr><th>Когда</th><th>Кому</th><th>Тема</th><th>Ушло</th><th></th></tr></thead><tbody>
        ${d.letters.map(o => `<tr data-id="${o.id}"><td>${fmt(o.created_at)}</td><td>${CAT[o.cat] || o.cat}</td><td>${esc(o.subject)}</td><td>${o.sent} из ${o.total} · ${ST[o.status] || o.status}</td>
          <td>${o.status === 'send' ? '<button type="button" class="bc-link be-danger" data-stop>Остановить</button>' : ''}</td></tr>`).join('')}</tbody></table>` : '<p class="be-note">Пока писем не было.</p>'}</section>`;

    const $ = q => main.querySelector(q), msg = $('.ml-msg');
    const read = () => { const L = {}; main.querySelectorAll('.ml-lang').forEach(x => { L[x.dataset.l] = { s: x.querySelector('.ml-s').value, t: x.querySelector('.ml-t').value }; }); return { cat: $('.ml-cat').value, L }; };
    const save = () => { try { const r = read(); localStorage.setItem(KEY, JSON.stringify({ cat: r.cat, ...r.L })); } catch (e) { /* нет хранилища */ } };
    main.querySelectorAll('.ml-s, .ml-t, .ml-cat').forEach(x => x.addEventListener('input', save));
    main.querySelectorAll('.ml-tabs [data-l]').forEach(b => b.onclick = () => {
      main.querySelectorAll('.ml-tabs [data-l]').forEach(x => x.classList.toggle('pill-fill', x === b));
      main.querySelectorAll('.ml-lang').forEach(x => { x.hidden = x.dataset.l !== b.dataset.l; });
    });
    if (window.PPTranslateBtn) {
      const f = l => main.querySelector(`.ml-lang[data-l="${l}"]`);
      const src = () => { const on = main.querySelector('.ml-tabs .pill-fill'); return on ? on.dataset.l : 'en'; };
      $('.ml-tr').appendChild(window.PPTranslateBtn({ from: src, texts: () => [f(src()).querySelector('.ml-s').value, f(src()).querySelector('.ml-t').value], fill: (l, t) => { f(l).querySelector('.ml-s').value = t[0] || ''; f(l).querySelector('.ml-t').value = t[1] || ''; save(); }, about: 'short' }));
    }
    const busy = on => main.querySelectorAll('.ml-test, .ml-send').forEach(b => { b.disabled = on; });
    $('.ml-test').onclick = async () => {
      busy(true); msg.textContent = 'Отправляю…';
      try { const r = await api('admin/mail/test', read()); msg.textContent = r.ok ? `✓ Ушло писем: ${r.sent} на ${r.to} (по одному на каждый заполненный язык). Проверьте почту, и папку «Спам» тоже.` : 'Не ушло — проверьте ключ Resend.'; } catch (e) { msg.textContent = ERR[e.code] || 'Ошибка: ' + e.message; }
      busy(false);
    };
    $('.ml-send').onclick = async () => {
      const r0 = read(), cnt = n(r0.cat);
      if (!cnt) { msg.textContent = 'Пока никто не включил этот вид писем.'; return; }
      if (!confirm(`Отправить «${r0.L.en.s || '(без темы)'}» — ${cnt} птичкам (${CAT[r0.cat]})?`)) return;
      busy(true); msg.textContent = 'Отправляю первую порцию…';
      try { await api('admin/mail/send', r0); try { localStorage.removeItem(KEY); } catch (e) { /* нет хранилища */ } mount(main); } catch (e) { msg.textContent = ERR[e.code] || 'Ошибка: ' + e.message; busy(false); }
    };
    main.querySelectorAll('[data-stop]').forEach(b => b.onclick = async () => {
      if (!confirm('Остановить эту рассылку? Кому уже ушло — уже ушло.')) return;
      try { await api('admin/mail/stop', { id: Number(b.closest('tr').dataset.id) }); mount(main); } catch (e) { alert(e.message); }
    });
  }
  window.PPMailAdmin = { mount };
})();
