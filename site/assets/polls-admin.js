// Кабинет → «🗳 Опросы» (admin.js открывает PPPollsAdmin.mount(main)): создать опрос (вопрос и варианты — хотя бы на одном
// языке, остальное переведётся), открыть на главной (можно со сроком), завершить, удалить; статистика: голоса по вариантам,
// гости / птички, языки, по дням, свои темы посетителей. Переключатель «Блок на главной» — показать / скрыть целиком.
// Сервер — worker/polls.js (/api/admin/polls), на главной — site/assets/poll.js.
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ERR = { q: 'Напишите вопрос.', opts: 'Нужно хотя бы 2 варианта.', hasvotes: 'У этого варианта уже есть голоса — удалить его нельзя (можно поправить текст).', admin: 'Нужно войти как админ.' };
  const api = async b => {
    const r = await fetch('/api/admin/polls', b ? { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) } : { credentials: 'same-origin' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(d.error || r.status), { code: d.error });
    return d;
  };
  const TR = [['en', 'EN'], ['lv', 'LV']]; // пишется по-русски; EN и LV переводит сервер, их можно поправить («🌐 Перевод»)
  const inp = 'style="width:100%;padding:9px 12px;font:inherit;box-sizing:border-box"';
  const date = t => t ? new Date(t * 1000).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const ST = { draft: '📝 Черновик', open: '🟢 Идёт на главной', closed: '🏁 Завершён' };
  const LN = { ru: 'RU', en: 'EN', lv: 'LV' };

  function form(box, x, done) {
    const isNew = !x, id = x ? x.id : '';
    const q = x ? { ...x.q } : { ru: 'На какую тему будет следующее видео?' }, opts = x ? x.opts.map(o => ({ id: o.id, t: { ...o.t } })) : [{ t: {} }, { t: {} }, { t: {} }];
    const q0 = { ...q }, o0 = Object.fromEntries(opts.filter(o => o.id).map(o => [o.id, { ...o.t }])); // как было — что поменялось
    let ideas = x ? !!x.ideas : true, showTr = false;
    const keep = () => { // перед перерисовкой — забрать набранное
      box.querySelectorAll('.po-q').forEach(i => { q[i.dataset.l] = i.value; });
      box.querySelectorAll('.po-o').forEach(d => d.querySelectorAll('input').forEach(i => { opts[d.dataset.i].t[i.dataset.l] = i.value; }));
      const c = box.querySelector('.po-ideas'); if (c) ideas = c.checked;
    };
    const draw = () => {
      box.innerHTML = `<section class="adm-box"><h2>${isNew ? '🗳 Новый опрос' : '✏️ Править опрос'}</h2>
        <p class="be-note">Пишите по-русски — на английский и латышский сайт переведёт сам. Поменяли русский — перевод обновится; поправленный вручную перевод остаётся.</p>
        <p><button type="button" class="pill-btn po-tr">${showTr ? '🌐 Скрыть перевод' : '🌐 Перевод EN / LV — посмотреть и поправить'}</button></p>
        <p><label>Вопрос<br><input ${inp} class="be-input po-q" data-l="ru" maxlength="200" value="${esc(q.ru || '')}"></label></p>
        ${showTr ? TR.map(([l, n]) => `<p><label class="be-note">${n}${q[l] ? '' : ' (переведётся при сохранении)'}<br><input ${inp} class="be-input po-q" data-l="${l}" maxlength="200" value="${esc(q[l] || '')}"></label></p>`).join('') : ''}
        <h3>Варианты</h3>
        ${opts.map((o, i) => `<div class="adm-box po-o" data-i="${i}" style="margin:8px 0;padding:10px 12px"><b>${i + 1}.</b>
          <label style="display:block;margin:4px 0"><input ${inp} class="be-input" data-l="ru" maxlength="120" value="${esc(o.t.ru || '')}"></label>
          ${showTr ? TR.map(([l, n]) => `<label class="be-note" style="display:block;margin:4px 0 4px 18px">${n}${o.t[l] ? '' : ' (переведётся при сохранении)'} <input ${inp} class="be-input" data-l="${l}" maxlength="120" value="${esc(o.t[l] || '')}"></label>`).join('') : ''}
          ${opts.length > 2 ? `<button type="button" class="pill-btn po-rm" data-i="${i}">🗑 Убрать вариант</button>` : ''}</div>`).join('')}
        ${opts.length < 8 ? '<p><button type="button" class="pill-btn po-add">➕ Ещё вариант</button></p>' : ''}
        <p><label><input type="checkbox" class="po-ideas"${ideas ? ' checked' : ''}> Можно предложить свою тему (пункт «Своя тема…» — темы видны здесь)</label></p>
        <div class="adm-quick"><button type="button" class="pill-btn pill-fill po-save">${isNew ? '➕ Создать (черновик)' : '💾 Сохранить'}</button><button type="button" class="pill-btn po-cancel">Отмена</button></div>
        <p class="be-note po-msg" aria-live="polite"></p></section>`;
      const $ = s => box.querySelector(s);
      $('.po-cancel').onclick = () => { box.innerHTML = ''; };
      $('.po-tr').onclick = () => { keep(); showTr = !showTr; draw(); };
      const add = $('.po-add'); if (add) add.onclick = () => { keep(); opts.push({ t: {} }); draw(); };
      box.querySelectorAll('.po-rm').forEach(b => { b.onclick = () => { keep(); opts.splice(+b.dataset.i, 1); draw(); }; });
      $('.po-save').onclick = async () => {
        keep(); const b = $('.po-save'), msg = $('.po-msg');
        b.disabled = true; msg.textContent = '⏳ Сохраняю и перевожу…';
        try {
          // русский поменялся, а перевод не трогали — пустой: сервер переведёт заново; поправленный вручную — как есть
          const fix = (t, was) => { const r = {}; for (const l of ['ru', 'en', 'lv']) r[l] = (t[l] || '').trim();
            for (const [l] of TR) if ((r.ru !== (was.ru || '').trim()) && r[l] === (was[l] || '').trim()) r[l] = ''; return r; };
          const d = await api({ act: 'save', id, q: fix(q, q0), ideas, opts: opts.map(o => ({ id: o.id || '', t: fix(o.t, o0[o.id] || {}) })) });
          box.innerHTML = ''; done(d, isNew ? '✓ Опрос создан — нажмите «▶ Открыть на главной», когда будете готовы' : '✓ Сохранено');
        } catch (e) { b.disabled = false; msg.textContent = ERR[e.code] || 'Ошибка: ' + e.message; }
      };
    };
    draw();
  }

  function stats(x) {
    const s = x.stats, total = s.total || 0, pc = n => total ? Math.round(n * 100 / total) : 0;
    const rows = x.opts.map(o => ({ t: o.t.ru || o.t.en || o.t.lv, n: s.c[o.id] || 0 }));
    if (x.ideas || s.c.idea) rows.push({ t: '✍️ Своя тема', n: s.c.idea || 0 });
    const max = Math.max(0, ...rows.map(r => r.n));
    const days = Object.entries(s.days).sort(), dmax = Math.max(1, ...days.map(d => d[1]));
    return `<ul class="po-bars" data-fold="1" style="list-style:none;padding:0;margin:10px 0">${rows.map(r => `<li style="margin:6px 0"><div style="display:flex;justify-content:space-between;gap:10px"><span>${r.n === max && max ? '★ ' : ''}${esc(r.t)}</span><b>${r.n} · ${pc(r.n)}%</b></div>
      <div style="height:8px;border-radius:4px;background:rgba(127,127,127,.18)"><div style="height:8px;border-radius:4px;width:${pc(r.n)}%;background:var(--pp-acc,#E9A93B)"></div></div></li>`).join('')}</ul>
      <p class="be-note">Всего голосов: <b>${total}</b> · птички (вошли): ${s.members} · гости: ${s.guests} · языки: ${Object.entries(s.langs).map(([l, n]) => `${LN[l] || l} ${n}`).join(', ') || '—'}</p>
      ${days.length ? `<p class="be-note">По дням:</p><div style="display:flex;align-items:flex-end;gap:3px;height:60px;overflow-x:auto">${days.map(([d, n]) => `<span title="${d}: ${n}" style="flex:0 0 14px;height:${Math.max(4, Math.round(n * 60 / dmax))}px;background:var(--pp-acc,#E9A93B);border-radius:3px 3px 0 0"></span>`).join('')}</div>` : ''}
      ${x.ideaList.length ? `<details><summary>✍️ Свои темы посетителей (${x.ideaList.length})</summary><ol>${x.ideaList.map(i => `<li>${esc(i.text)} <span class="be-note">— ${i.nick ? '@' + esc(i.nick) : 'гость'}, ${LN[i.lang] || ''}, ${date(i.at)}</span></li>`).join('')}</ol></details>` : ''}`;
  }

  async function mount(main) {
    main.innerHTML = '<p class="be-note">Загружаю…</p>';
    let d; try { d = await api(); } catch (e) { main.innerHTML = `<p class="be-note">${ERR[e.code] || 'Ошибка: ' + esc(e.message)}</p>`; return; }
    const show = (data, note) => {
      d = data;
      main.innerHTML = `<section class="adm-box"><h2>🏠 Блок на главной</h2>
        <p><label><input type="checkbox" class="po-home"${d.home ? ' checked' : ''}> Показывать опрос на главной</label></p>
        <p class="be-note">${d.home ? 'Если есть открытый опрос — он на главной; нет открытого — 14 дней видны итоги последнего завершённого. Снимите галочку — блок исчезнет полностью.' : 'Блок скрыт — на главной опроса нет совсем (голоса и опросы сохранены).'}</p>
        <p><b>🔗 Ссылка прямо на опрос</b> — для соцсетей, рассылки, сторис: ${['', '/ru', '/lv'].map(l => `<button type="button" class="pill-btn po-link" data-u="https://www.pigeonpolly.com${l}/poll/">📋 ${l ? l.slice(1).toUpperCase() : 'EN'}</button>`).join(' ')}</p>
        <div class="adm-quick"><button type="button" class="pill-btn pill-fill po-new">➕ Новый опрос</button></div><p class="be-note po-note" aria-live="polite">${esc(note || '')}</p></section>
        <div class="po-form"></div>
        ${d.items.length ? '' : '<p class="be-note">Опросов пока нет.</p>'}
        ${d.items.map(x => `<section class="adm-box" data-id="${esc(x.id)}"><h3>${esc(x.q.ru || x.q.en)}</h3>
          <p class="be-note">${ST[x.status]}${x.opened ? ` · открыт ${date(x.opened)}` : ''}${x.status === 'open' && x.ends ? ` · завершится сам ${date(x.ends)}` : ''}${x.closed ? ` · завершён ${date(x.closed)}` : ''} · создан ${date(x.created)}</p>
          ${stats(x)}
          <div class="adm-quick">
            ${x.status !== 'open' ? `<button type="button" class="pill-btn pill-fill" data-act="open">▶ ${x.status === 'closed' ? 'Открыть снова' : 'Открыть на главной'}</button>
              <label class="be-note">срок: <select class="po-days"><option value="0">без срока</option><option value="3">3 дня</option><option value="7">неделя</option><option value="14">2 недели</option><option value="30">месяц</option></select></label>` : '<button type="button" class="pill-btn pill-fill" data-act="close">🏁 Завершить</button>'}
            <button type="button" class="pill-btn" data-act="edit">✏️ Править</button>
            <a class="pill-btn" href="/#poll" target="_blank" rel="noopener">👁 На главной</a>
            <button type="button" class="pill-btn" data-act="del">🗑 Удалить</button></div></section>`).join('')}`;
      const nb = main.querySelector('.po-note'), fbox = main.querySelector('.po-form');
      const run = async (b, body) => { try { show(await api(body), '✓ Готово'); } catch (e) { nb.textContent = ERR[e.code] || 'Ошибка: ' + e.message; } };
      main.querySelectorAll('.po-link').forEach(b => { b.onclick = async () => { try { await navigator.clipboard.writeText(b.dataset.u); nb.textContent = '✓ Скопировано: ' + b.dataset.u; } catch (e) { nb.textContent = b.dataset.u; } }; });
      main.querySelector('.po-home').onchange = e => run(null, { act: 'home', on: e.target.checked ? 1 : 0 });
      main.querySelector('.po-new').onclick = () => { form(fbox, null, show); fbox.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
      main.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', () => {
        const sec = b.closest('[data-id]'), id = sec.dataset.id, x = d.items.find(i => i.id === id), act = b.dataset.act;
        if (act === 'edit') { form(fbox, x, show); fbox.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
        if (act === 'del' && !confirm('Удалить опрос вместе со всеми голосами? Это не отменить.')) return;
        if (act === 'close' && !confirm('Завершить опрос? На главной появятся итоги.')) return;
        if (act === 'open' && d.items.some(i => i.status === 'open' && i.id !== id) && !confirm('Сейчас идёт другой опрос — он завершится. Продолжить?')) return;
        run(b, { act, id, days: +(sec.querySelector('.po-days') || {}).value || 0 });
      }));
    };
    show(d);
  }
  window.PPPollsAdmin = { mount };
})();
