// Кабинет → «📮 Вопросы из чата» (admin.js открывает PPAboutAdmin.mount(main)): вопросы, которых не было в базе чата /about-me/
// (worker/about-chat.js). Алина отвечает по-русски за себя и/или за Полли → вопрос и ответы переводятся и попадают в игру
// с пометкой «прислал(а) @ник» или «анонимный вопрос», автору с аккаунтом — новость. «Не добавлять» — вопрос не появится в игре (из «В игре» — убирает).
(() => {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const TABS = [['new', '⏳ Ждут ответа'], ['ok', '✅ В игре'], ['no', '🚫 Не добавлены']];
  const LANG = { ru: 'RU', en: 'EN', lv: 'LV' };
  const dm = ts => ts ? new Date(ts * 1000).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
  const api = async (path, body) => {
    const r = await fetch('/api/' + path, body ? { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : { credentials: 'same-origin' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || r.status);
    return d;
  };
  const ERR = { answer: 'Напишите хотя бы один ответ — свой или Полли.', admin: 'Нужен вход админа.', ask: 'Вопрос не найден.' };

  async function mount(main, tab = 'new') {
    main.innerHTML = '<p class="be-note">Загрузка…</p>';
    let d; try { d = await api('admin/about-asks?status=' + tab); } catch (e) { main.innerHTML = `<p class="be-note">${esc(ERR[e.message] || e.message)}</p>`; return; }
    const c = d.counts || {};
    main.innerHTML = `<section class="adm-box aa"><h2>📮 Вопросы из чата</h2>
      <p class="be-note">Вопросы, которых не было в чате «Поболтать с Алиной и Полли» (/about-me/). Ответьте по-русски — за себя, за Полли или за обеих. Вопрос можно поправить: в игре он будет таким, как в поле «Вопрос». После «Ответить» всё переводится на EN и LV и появляется в чате у всех с пометкой «📮 прислал(а) @ник» (анонимные — «📮 анонимный вопрос»), а автору с аккаунтом приходит новость.</p>
      <div class="sa-tabs">${TABS.map(([k, n]) => `<button type="button" class="pill-btn${k === tab ? ' pill-fill' : ''}" data-tab="${k}">${n} · ${c[k] || 0}</button>`).join('')}</div>
      ${d.asks.length ? `<ul class="aa-list">${d.asks.map(a => `<li class="aa-q" data-id="${a.id}">
        <p class="sa-top">${!a.nick ? '🙈 Гость (аноним)' : a.anon ? `🙈 Аноним · <a href="/bird/?nick=${encodeURIComponent(a.nick)}" target="_blank">@${esc(a.nick)}</a> <small>(ник видите только вы)</small>` : `<a href="/bird/?nick=${encodeURIComponent(a.nick)}" target="_blank">@${esc(a.nick)}</a>`} · <small>${dm(a.at)} · прислано на ${LANG[a.lang] || a.lang}</small></p>
        <p class="aa-orig">❓ ${esc(a.text)}</p>
        <label>Вопрос (как будет в игре)<input type="text" maxlength="200" data-f="q" value="${esc(a.q || a.text)}"></label>
        <label>Ответ Алины<textarea rows="3" data-f="a">${esc(a.a)}</textarea></label>
        <label>Ответ Полли<textarea rows="3" data-f="p">${esc(a.p)}</textarea></label>
        ${a.status === 'ok' ? `<p class="sa-was">✅ В игре с ${dm(a.answered)} · 🌐 ${a.langs.length >= 3 ? 'переведено на EN и LV' : 'перевод не удался — нажмите «Сохранить» ещё раз'}</p>` : ''}
        <div class="sa-act"><button type="button" class="pill-btn pill-fill" data-v="ok">${a.status === 'ok' ? '💾 Сохранить' : '✅ Ответить и добавить в игру'}</button>${a.status !== 'no' ? `<button type="button" class="pill-btn" data-v="no">${a.status === 'ok' ? '🚫 Убрать из игры' : '🚫 Не добавлять'}</button>` : ''}<span class="sa-st" role="status"></span></div>
      </li>`).join('')}</ul>` : `<p class="adm-calm">${tab === 'new' ? 'Новых вопросов нет ✓' : 'Пока пусто'}</p>`}</section>`;
    main.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => mount(main, b.dataset.tab));
    main.querySelectorAll('.aa-q [data-v]').forEach(b => b.onclick = async () => {
      const li = b.closest('.aa-q'), st = li.querySelector('.sa-st'), f = k => li.querySelector(`[data-f="${k}"]`).value;
      st.textContent = b.dataset.v === 'ok' ? 'Перевожу…' : '…';
      li.querySelectorAll('button').forEach(x => x.disabled = true);
      try {
        const r = await api('admin/about-asks', { id: +li.dataset.id, status: b.dataset.v, q: f('q'), a: f('a'), p: f('p') });
        st.textContent = b.dataset.v === 'no' ? '✓ Не попадёт в игру' : (r.missing && r.missing.length ? `✓ В игре, но перевод на ${r.missing.map(l => LANG[l]).join(', ')} не удался — нажмите «Сохранить» ещё раз` : '✓ В игре, переведено');
        if (tab !== 'ok' || b.dataset.v === 'no') setTimeout(() => li.remove(), 900);
      } catch (e) { st.textContent = ERR[e.message] || e.message; }
      li.querySelectorAll('button').forEach(x => x.disabled = false);
    });
  }
  window.PPAboutAdmin = { mount };
})();
