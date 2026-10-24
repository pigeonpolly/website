// Кабинет → «🎓 Школа» (admin.js открывает PPSchoolAdmin.mount(main)): работы учеников «Школы Полли» (worker/school.js).
// Печать или «на доработку» с комментарием; комментарий видит ученик под своим уроком, новость приходит в конвертик.
(() => {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const LESSONS = ['Фигуры', 'Линии', 'Текстура', 'Сочетания', 'Объём', 'Тени', 'Детали', 'Цилиндры', 'Эллипсы', 'Секреты', 'Композиция', 'Коллаж'];
  const TABS = [['wait', '⏳ Ждут'], ['redo', '↩ На доработке'], ['ok', '✅ С печатью']];
  const dm = ts => ts ? new Date(ts * 1000).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
  const api = async (path, body) => {
    const r = await fetch('/api/' + path, body ? { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : { credentials: 'same-origin' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || r.status);
    return d;
  };
  const ERR = { comment: 'Напишите, что доработать — ученик увидит это под уроком.', admin: 'Нужен вход админа.', work: 'Работа не найдена.' };

  async function mount(main, tab = 'wait') {
    main.innerHTML = '<p class="be-note">Загрузка…</p>';
    let d; try { d = await api('admin/school?status=' + tab); } catch (e) { main.innerHTML = `<p class="be-note">${esc(ERR[e.message] || e.message)}</p>`; return; }
    const c = d.counts || {};
    main.innerHTML = `<section class="adm-box sa"><h2>🎓 Школа Полли</h2>
      <p class="be-note">Работы учеников с бумаги. Печать — урок засчитан. «На доработку» — ученик увидит ваш комментарий под уроком и сможет сдать заново (прежние попытки видны здесь же). Ученику всё приходит от Полли: «Печать от Полли», «Полли: …».</p>
      <div class="sa-tabs">${TABS.map(([k, n]) => `<button type="button" class="pill-btn${k === tab ? ' pill-fill' : ''}" data-tab="${k}">${n} · ${c[k] || 0}</button>`).join('')}</div>
      ${d.works.length ? `<ul class="sa-list">${d.works.map(w => `<li class="sa-w" data-id="${w.id}">
        <a class="sa-pic" href="/api/img/${w.img}" target="_blank" rel="noopener"><img src="/api/img/${w.img}?t=1" alt="" loading="lazy"></a>
        <div class="sa-body">
          <p class="sa-top"><a href="/bird/?nick=${encodeURIComponent(w.nick)}" target="_blank">@${esc(w.nick)}</a> · <b>Урок ${w.lesson} «${LESSONS[w.lesson - 1] || ''}»</b> · <small>${dm(w.at)}${w.before.length ? ` · попытка ${w.before.length + 1}` : ''}</small></p>
          ${w.note ? `<p class="sa-note">✉️ ${esc(w.note)}</p>` : ''}
          ${w.before.length ? `<div class="sa-before">${w.before.map(b => `<a href="/api/img/${b.img}" target="_blank" rel="noopener" title="${esc(b.comment)}"><img src="/api/img/${b.img}?t=1" alt=""><small>${esc((b.comment || '').slice(0, 60))}</small></a>`).join('')}</div>` : ''}
          ${w.status !== 'wait' ? `<p class="sa-was">${w.status === 'ok' ? '✅ Печать' : '↩ На доработке'} · ${dm(w.checked)}${w.comment ? ` — «${esc(w.comment)}»` : ''}</p>` : ''}
          <textarea rows="2" placeholder="Комментарий ученику (для «на доработку» — обязательно)">${esc(w.comment)}</textarea>
          <div class="sa-act"><button type="button" class="pill-btn pill-fill" data-v="ok">✅ Поставить печать</button><button type="button" class="pill-btn" data-v="redo">↩ На доработку</button><span class="sa-st" role="status"></span></div>
        </div></li>`).join('')}</ul>` : `<p class="adm-calm">${tab === 'wait' ? 'Новых работ нет ✓' : 'Пока пусто'}</p>`}</section>`;
    main.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => mount(main, b.dataset.tab));
    main.querySelectorAll('.sa-w [data-v]').forEach(b => b.onclick = async () => {
      const li = b.closest('.sa-w'), st = li.querySelector('.sa-st');
      st.textContent = '…';
      try {
        await api('admin/school/check', { id: +li.dataset.id, status: b.dataset.v, comment: li.querySelector('textarea').value });
        st.textContent = b.dataset.v === 'ok' ? '✓ Печать стоит' : '✓ Вернули на доработку';
        if (tab === 'wait') setTimeout(() => li.remove(), 700);
      } catch (e) { st.textContent = ERR[e.message] || e.message; }
    });
  }
  window.PPSchoolAdmin = { mount };
})();
