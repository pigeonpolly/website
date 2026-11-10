// Кабинет → «📢 Рассылка» (admin.js открывает PPBroadcast.mount(main)): «кому» (все / новые / старые за N дней) и что —
// 📝 сообщение на 3 языках (🌐 перевод) с файлом до 20 МБ (в «конвертик» на сайте, по галочке — ещё письмом согласившимся),
// 🎁 подарок (окно подарка admin.js PPGiftDialog с window.PPAud), 🔘 пуговки (/api/admin/salary). Сервер — worker/notes.js.
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ERR = { en: 'Заполните заголовок и текст на EN — это запасной язык для тех, у кого нет перевода.', too_big: 'Файл больше 20 МБ.', media: 'Нет хранилища файлов (R2 MEDIA).', empty: 'Пустой файл.' };
  const api = async (path, body) => {
    const r = await fetch('/api/' + path, body ? { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : { credentials: 'same-origin' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(ERR[d.error] || d.error || r.status), { code: d.error });
    return d;
  };
  const fmt = t => new Date(t * 1000).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const kb = n => n > 1048576 ? (n / 1048576).toFixed(1) + ' МБ' : Math.max(1, Math.round(n / 1024)) + ' КБ';
  const AUD = { all: 'всем птичкам', new: 'новым', old: 'старым' };
  const audText = (aud, days) => aud === 'all' ? 'Всем' : aud === 'new' ? `Новым (за ${days} дн.)` : `Старым (раньше ${days} дн.)`;
  const KEY = 'pp_bc_draft';

  async function mount(main) {
    let draft = {}; try { draft = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { /* нет хранилища */ }
    const st = { aud: draft.aud || 'all', days: draft.days || 30, what: 'msg', file: null };
    main.innerHTML = `<section class="adm-box"><h2>👥 Кому</h2>
        <div class="adm-quick bc-aud">${Object.keys(AUD).map(k => `<label class="pill-btn"><input type="radio" name="bc-aud" value="${k}"${st.aud === k ? ' checked' : ''}> ${k === 'all' ? 'Всем' : k === 'new' ? 'Новым' : 'Старым'}</label>`).join('')}
          <label class="bc-days">— зарегистрировались <span class="bc-dw"></span> <input type="number" class="be-input bc-n" min="1" max="3650" value="${st.days}" style="width:80px"> дней</label></div>
        <p class="be-note bc-count" aria-live="polite">Считаю…</p>
        <p class="be-note">Сообщения на сайте получают все выбранные птички с ником — это сообщение внутри аккаунта, согласие не нужно. На почту — только тем, кто сам включил «🐦 Новости от Полли» (ссылка «Отписаться» в каждом письме, не больше одного письма в день).</p></section>
      <section class="adm-box"><h2>📦 Что отправить</h2>
        <div class="adm-quick bc-what">${[['msg', '📝 Сообщение или файл'], ['gift', '🎁 Подарок'], ['btn', '🔘 Пуговки']].map(([k, n]) => `<button type="button" class="pill-btn${k === 'msg' ? ' pill-fill' : ''}" data-w="${k}">${n}</button>`).join('')}</div>
        <div class="bc-pane" data-w="msg">
          <div class="ml-tabs adm-quick">${['en', 'ru', 'lv'].map(l => `<button type="button" class="pill-btn${l === 'en' ? ' pill-fill' : ''}" data-l="${l}">${l.toUpperCase()}</button>`).join('')}<span class="bc-tr"></span></div>
          ${['en', 'ru', 'lv'].map(l => `<div class="ml-lang" data-l="${l}"${l === 'en' ? '' : ' hidden'}>
            <p><input class="be-input ml-s" placeholder="Заголовок (${l.toUpperCase()})" value="${esc((draft[l] || {}).s || '')}" maxlength="200" style="width:100%"></p>
            <p><textarea class="be-input ml-t" rows="8" placeholder="Текст (${l.toUpperCase()}). Пустая строка — новый абзац, ссылки — просто адресом." style="width:100%">${esc((draft[l] || {}).t || '')}</textarea></p></div>`).join('')}
          <p><label class="pill-btn">📎 Приложить файл (до 20 МБ) <input type="file" class="bc-file" hidden></label> <span class="be-note bc-fname"></span></p>
          <p><label class="be-check"><input type="checkbox" class="bc-mail"> <b>✉️ Ещё и письмом</b> <small class="bc-mailn"></small></label></p>
          <div class="adm-quick"><button type="button" class="pill-btn pill-fill bc-send">📢 Отправить</button></div></div>
        <div class="bc-pane" data-w="gift" hidden><p class="be-note">Откроется обычное окно подарка — вещь придёт неоткрытым подарком выбранным птичкам.</p>
          <button type="button" class="pill-btn pill-fill bc-gift">🎁 Выбрать подарок</button></div>
        <div class="bc-pane" data-w="btn" hidden><p class="be-note">Пуговки зачислятся сразу, птичка откроет конвертик «💌 Тебе письмо!».</p>
          <p><label>Сколько каждой: <input type="number" class="be-input bc-amt" min="1" max="10000" value="10" style="width:100px"> 🔘</label></p>
          <button type="button" class="pill-btn pill-fill bc-btn">🔘 Выдать</button></div>
        <p class="be-note bc-msg" aria-live="polite"></p></section>
      <section class="adm-box"><h2>📜 Отправленные сообщения</h2><div class="bc-list" style="overflow-x:auto"><p class="be-note">Загрузка…</p></div></section>`;
    const $ = s => main.querySelector(s), $$ = s => [...main.querySelectorAll(s)];
    const f = l => main.querySelector(`.ml-lang[data-l="${l}"]`);
    const msg = (t, bad) => { const m = $('.bc-msg'); m.textContent = t; m.style.color = bad ? '#b00' : ''; };
    const label = () => st.aud === 'all' ? AUD.all : `${AUD[st.aud]} птичкам (${st.aud === 'new' ? 'за последние' : 'раньше, чем'} ${st.days} дн.)`;
    const save = () => { const d = { aud: st.aud, days: st.days }; for (const l of ['en', 'ru', 'lv']) d[l] = { s: f(l).querySelector('.ml-s').value, t: f(l).querySelector('.ml-t').value }; try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} };
    let cnt = { count: 0, mail: 0 };
    async function count() {
      $('.bc-days').hidden = st.aud === 'all';
      $('.bc-dw').textContent = st.aud === 'new' ? 'за последние' : 'раньше, чем';
      try {
        const d = await api(`admin/notes?aud=${st.aud}&days=${st.days}`); cnt = d;
        $('.bc-count').innerHTML = `Получат на сайте: <b>${d.count}</b> птичек · из них согласились на письма: <b>${d.mail}</b>`;
        $('.bc-mailn').textContent = d.mailOn ? `— ${d.mail} птичкам, кто согласился на «Новости от Полли»` : '— письма выключены (нет RESEND_KEY в Cloudflare)';
        $('.bc-mail').disabled = !d.mailOn;
        list(d.list);
      } catch (e) { $('.bc-count').textContent = e.message; }
    }
    function list(items) {
      $('.bc-list').innerHTML = items.length ? `<table class="be-table adm-table"><thead><tr><th>Когда</th><th>Кому</th><th>Заголовок</th><th>Прочитали</th><th>Письма</th><th></th></tr></thead><tbody>
        ${items.map(n => `<tr data-id="${n.id}"><td>${fmt(n.created_at)}</td><td>${audText(n.aud, n.days)}</td><td>${esc(n.subject)}${n.file_name ? `<br><small>📎 <a href="/api/note/file?id=${n.id}">${esc(n.file_name)}</a> · ${kb(n.file_size)}</small>` : ''}</td>
          <td>${n.seen} из ${n.total}</td><td>${n.mail_id ? `${n.mail_sent || 0} из ${n.mail_total || 0}` : '—'}</td><td><button type="button" class="bc-link be-danger" data-del>Удалить</button></td></tr>`).join('')}</tbody></table>` : '<p class="be-note">Пока ничего не отправляли.</p>';
      $$('[data-del]').forEach(b => b.onclick = async () => {
        if (!confirm('Удалить сообщение? Оно пропадёт у всех, файл удалится, недоставленные письма не уйдут.')) return;
        try { await api('admin/notes/delete', { id: Number(b.closest('tr').dataset.id) }); count(); } catch (e) { alert(e.message); }
      });
    }
    $$('[name="bc-aud"]').forEach(r => r.onchange = () => { st.aud = r.value; save(); count(); });
    $('.bc-n').onchange = () => { st.days = Math.min(3650, Math.max(1, Math.floor(+$('.bc-n').value) || 30)); $('.bc-n').value = st.days; save(); count(); };
    $$('.bc-what [data-w]').forEach(b => b.onclick = () => { st.what = b.dataset.w; $$('.bc-what [data-w]').forEach(x => x.classList.toggle('pill-fill', x === b)); $$('.bc-pane').forEach(p => p.hidden = p.dataset.w !== st.what); });
    $$('.ml-tabs [data-l]').forEach(b => b.onclick = () => { $$('.ml-tabs [data-l]').forEach(x => x.classList.toggle('pill-fill', x === b)); $$('.ml-lang').forEach(x => x.hidden = x.dataset.l !== b.dataset.l); });
    $$('.ml-s, .ml-t').forEach(i => i.addEventListener('input', save));
    const src = () => (main.querySelector('.ml-tabs .pill-fill') || {}).dataset?.l || 'en';
    if (window.PPTranslateBtn) $('.bc-tr').appendChild(window.PPTranslateBtn({ from: src, texts: () => [f(src()).querySelector('.ml-s').value, f(src()).querySelector('.ml-t').value], fill: (l, t) => { f(l).querySelector('.ml-s').value = t[0] || ''; f(l).querySelector('.ml-t').value = t[1] || ''; save(); } }));
    $('.bc-file').onchange = () => {
      const x = $('.bc-file').files[0]; st.file = null;
      if (!x) { $('.bc-fname').textContent = ''; return; }
      if (x.size > 20 * 1024 * 1024) { $('.bc-fname').textContent = '⚠️ ' + ERR.too_big; $('.bc-file').value = ''; return; }
      st.file = x; $('.bc-fname').innerHTML = `${esc(x.name)} · ${kb(x.size)} <button type="button" class="bc-link">убрать</button>`;
      $('.bc-fname button').onclick = () => { st.file = null; $('.bc-file').value = ''; $('.bc-fname').textContent = ''; };
    };
    $('.bc-send').onclick = async e => {
      const L = {}; for (const l of ['en', 'ru', 'lv']) L[l] = { s: f(l).querySelector('.ml-s').value.trim(), t: f(l).querySelector('.ml-t').value.trim() };
      if (!L.en.s || !L.en.t) return msg(ERR.en, true);
      const mail = $('.bc-mail').checked && !$('.bc-mail').disabled;
      if (!confirm(`Отправить «${L.en.s}» ${label()} — ${cnt.count} птичкам${st.file ? ' с файлом ' + st.file.name : ''}${mail ? ` и письмом ${cnt.mail} согласившимся` : ''}?`)) return;
      e.target.disabled = true;
      try {
        let file = null;
        if (st.file) {
          msg('Загружаю файл…');
          const r = await fetch('/api/admin/notes/file?name=' + encodeURIComponent(st.file.name), { method: 'POST', credentials: 'same-origin', headers: { 'content-type': st.file.type || 'application/octet-stream' }, body: st.file });
          const d = await r.json().catch(() => ({}));
          if (!r.ok) throw new Error(ERR[d.error] || d.error || r.status);
          file = d;
        }
        msg('Отправляю…');
        const r = await api('admin/notes/send', { L, file, aud: st.aud, days: st.days, mail });
        msg(`📢 Отправлено: ${r.total} птичкам на сайте${r.mail ? `, письма — ${r.mail} (уходят порциями, не больше одного письма в день)` : ''}.`);
        for (const l of ['en', 'ru', 'lv']) { f(l).querySelector('.ml-s').value = ''; f(l).querySelector('.ml-t').value = ''; }
        st.file = null; $('.bc-file').value = ''; $('.bc-fname').textContent = ''; $('.bc-mail').checked = false; save(); count();
      } catch (x) { msg(x.message, true); }
      e.target.disabled = false;
    };
    $('.bc-gift').onclick = () => {
      if (!window.PPGiftDialog) return msg('Окно подарка не загрузилось — обновите страницу.', true);
      window.PPAud = { aud: st.aud, days: st.days, label: label() };
      window.PPGiftDialog(null, () => count());
    };
    $('.bc-btn').onclick = async e => {
      const n = Math.floor(+$('.bc-amt').value);
      if (!(n >= 1 && n <= 10000)) return msg('Нужно число от 1 до 10000.', true);
      if (!confirm(`Выдать по ${n} 🔘 ${label()} — ${cnt.count} птичкам?`)) return;
      e.target.disabled = true;
      try { const r = await api('admin/salary', { amount: n, aud: st.aud, days: st.days }); msg(`💌 Выдано: ${r.count} птичкам по ${r.amount} 🔘`); } catch (x) { msg(x.message, true); }
      e.target.disabled = false;
    };
    count();
  }
  window.PPBroadcast = { mount };
})();
