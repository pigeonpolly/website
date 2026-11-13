// Кабинет → «🎓 Курсы» (admin.js открывает PPSchoolAdmin.mount(main)): работы учеников обоих курсов — «Смотри на мир» и «Тушь» (worker/school.js).
// Фильтр по курсу; «С печатью» — сгруппировано по ученикам.
// Печать или «на доработку» с комментарием; комментарий видит ученик под своим уроком, новость приходит в конвертик.
(() => {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const LESSONS = ['Фигуры', 'Линии', 'Текстура', 'Сочетания', 'Объём', 'Тени', 'Детали', 'Цилиндры', 'Эллипсы', 'Секреты', 'Композиция', 'Коллаж'];
  // курс туши (/ink/, worker/ink/): названия уроков — как в worker/ink/lNN.js (ru.name)
  const INK = ['Страх чистого листа', 'Скетч, а не рисунок', 'Бумага, тушь, перья', 'Линия', 'Штриховка', 'Негативное пространство', 'Свет и тень', 'Вода и ошибки', 'Текстуры', 'От чашек до стульев', 'Ботаника', 'Еда и композиция', 'Город', 'Быстрые наброски и живые', 'Смешанные техники'];
  const lname = w => w.course === 'ink' ? `🖋 Тушь · урок ${w.lesson} «${INK[w.lesson - 1] || ''}»` : `Урок ${w.lesson} «${LESSONS[w.lesson - 1] || ''}»`;
  const TABS = [['wait', '⏳ Ждут'], ['redo', '↩ На доработке'], ['ok', '✅ С печатью']];
  const dm = ts => ts ? new Date(ts * 1000).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
  const api = async (path, body) => {
    const r = await fetch('/api/' + path, body ? { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : { credentials: 'same-origin' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || r.status);
    return d;
  };
  const ERR = { comment: 'Напишите, что доработать — ученик увидит это под уроком.', admin: 'Нужен вход админа.', work: 'Работа не найдена.' };

  const COURSES = [['all', 'Все курсы'], ['water', '🕊 Смотри на мир'], ['ink', '🖋 Тушь']];
  const OF = { water: 12, ink: 15 }; // уроков в курсе (worker/school.js COURSES)
  let crs = 'all'; // фильтр курса (запоминается, пока открыт кабинет)
  const item = w => `<li class="sa-w" data-id="${w.id}">
        ${w.img ? `<a class="sa-pic" href="/api/img/${w.img}" target="_blank" rel="noopener"><img src="/api/img/${w.img}?t=1" alt="" loading="lazy"></a>` : '<span class="sa-pic">🗑</span>'}
        <div class="sa-body">
          <p class="sa-top"><a href="/bird/?nick=${encodeURIComponent(w.nick)}" target="_blank">@${esc(w.nick)}</a> · <b>${lname(w)}</b> · <small>${dm(w.at)}${w.before.length ? ` · попытка ${w.before.length + 1}` : ''}</small></p>
          ${w.note ? `<p class="sa-note">✉️ ${esc(w.note)}</p>` : ''}
          ${w.before.length ? `<div class="sa-before">${w.before.map(b => `<a href="/api/img/${b.img}" target="_blank" rel="noopener" title="${esc(b.comment)}"><img src="/api/img/${b.img}?t=1" alt=""><small>${esc((b.comment || '').slice(0, 60))}</small></a>`).join('')}</div>` : ''}
          ${w.status !== 'wait' ? `<p class="sa-was">${w.status === 'ok' ? '✅ Печать' : '↩ На доработке'} · ${dm(w.checked)}${w.comment ? ` — «${esc(w.comment)}» <small>🌐 ${w.tr.length >= 3 ? 'переведён на EN · RU · LV' : 'перевод не получился — ученик видит как написано'}</small>` : ''}</p>` : ''}
          <textarea rows="2" placeholder="Комментарий ученику (для «на доработку» — обязательно)">${esc(w.comment)}</textarea>
          <div class="sa-act"><button type="button" class="pill-btn pill-fill" data-v="ok">✅ Поставить печать</button><button type="button" class="pill-btn" data-v="redo">↩ На доработку</button><span class="sa-st" role="status"></span></div>
        </div></li>`;
  // «С печатью» — по ученикам: ученик + курс, сколько печатей из скольких, последняя; раскрывается списком работ
  const byStudent = ws => {
    const g = {};
    for (const w of ws) (g[w.nick + '|' + w.course] = g[w.nick + '|' + w.course] || []).push(w);
    return Object.values(g).sort((a, b) => Math.max(...b.map(w => w.checked || 0)) - Math.max(...a.map(w => w.checked || 0))).map(ws => {
      const w = ws[0], n = new Set(ws.map(x => x.lesson)).size, of = OF[w.course] || 12;
      ws.sort((a, b) => a.lesson - b.lesson);
      return `<details class="sa-stu"><summary><b>@${esc(w.nick)}</b> · ${w.course === 'ink' ? '🖋 Тушь' : '🕊 Смотри на мир'} · ${n} из ${of} печатей${n >= of ? ' · 🎓 диплом' : ''} <small>· последняя ${dm(Math.max(...ws.map(x => x.checked || 0)))}</small></summary><ul class="sa-list">${ws.map(item).join('')}</ul></details>`;
    }).join('');
  };

  async function mount(main, tab = 'wait') {
    main.innerHTML = '<p class="be-note">Загрузка…</p>';
    let d; try { d = await api('admin/school?status=' + tab); } catch (e) { main.innerHTML = `<p class="be-note">${esc(ERR[e.message] || e.message)}</p>`; return; }
    const c = d.counts || {};
    const ws = d.works.filter(w => crs === 'all' || (w.course || 'water') === crs);
    main.innerHTML = `<section class="adm-box sa"><h2>🎓 Курсы: работы учеников</h2>
      <p class="be-note">Работы учеников с бумаги по обоим курсам — «Смотри на мир как художник» (/polly-helps/) и «Тушь» (/ink/). Печать — урок засчитан. «На доработку» — ученик увидит ваш комментарий под уроком и сможет сдать заново (прежние попытки видны здесь же). Ученику всё приходит от Полли: «Печать от Полли», «Полли: …».</p>
      <div class="sa-tabs">${TABS.map(([k, n]) => `<button type="button" class="pill-btn${k === tab ? ' pill-fill' : ''}" data-tab="${k}">${n} · ${c[k] || 0}</button>`).join('')}</div>
      <div class="sa-tabs">${COURSES.map(([k, n]) => `<button type="button" class="pill-btn${k === crs ? ' pill-fill' : ''}" data-crs="${k}">${n}${k === 'all' ? '' : ' · ' + d.works.filter(w => (w.course || 'water') === k).length}</button>`).join('')}</div>
      ${ws.length ? (tab === 'ok' ? byStudent(ws) : `<ul class="sa-list">${ws.map(item).join('')}</ul>`) : `<p class="adm-calm">${tab === 'wait' ? 'Новых работ нет ✓' : 'Пока пусто'}</p>`}</section>`;
    main.querySelectorAll('[data-crs]').forEach(b => b.onclick = () => { crs = b.dataset.crs; mount(main, tab); });
    main.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => mount(main, b.dataset.tab));
    main.querySelectorAll('.sa-w [data-v]').forEach(b => b.onclick = async () => {
      const li = b.closest('.sa-w'), st = li.querySelector('.sa-st');
      st.textContent = '…';
      try {
        const r = await api('admin/school/check', { id: +li.dataset.id, status: b.dataset.v, comment: li.querySelector('textarea').value });
        st.textContent = (b.dataset.v === 'ok' ? '✓ Печать стоит' : '✓ Вернули на доработку') + (r.diploma ? ` · 🎓 все печати курса — диплом и ${r.diploma} 🔘` : '') + (li.querySelector('textarea').value.trim() ? ((r.tr || []).length >= 3 ? ' · комментарий переведён на EN, RU, LV' : ' · перевод не получился, ученик увидит как написано') : '');
        if (tab === 'wait') setTimeout(() => li.remove(), 700);
      } catch (e) { st.textContent = ERR[e.message] || e.message; }
    });
  }
  window.PPSchoolAdmin = { mount };
})();
