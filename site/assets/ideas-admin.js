// Кабинет → «💡 Темы для блога» (admin.js открывает PPIdeasAdmin.mount(main)): кнопка — сайт смотрит, что сейчас ищут в Google
// и обсуждают на Reddit, Gemini делает 10 тем статей. Сервер — worker/ideas.js (/api/admin/ideas), последний список — в meta.blog_ideas.
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ERR = { no_key: 'Нет ключа Gemini: вставьте его в редакторе блога → «⚙ Перевод (Gemini)».', bad_key: 'Ключ Gemini не подходит — проверьте его в редакторе блога.',
    ai_limit: 'Gemini сегодня устал (дневной лимит). Попробуйте завтра.', ai: 'Gemini не ответил — попробуйте ещё раз через минуту.', idea: 'Список тем обновился — обновите страницу.' };
  const api = async body => {
    const r = await fetch('/api/admin/ideas', body ? { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : { credentials: 'same-origin' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(d.error || r.status), { code: d.error });
    return d;
  };
  const fmt = t => new Date(t * 1000).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
  const text = x => `${x.title_en}\n${x.title_ru}\n\n${x.idea_ru}\n\nКлючевые слова: ${x.keywords.join(', ')}${x.page ? `\nСсылка в статье: https://www.pigeonpolly.com${x.page}` : ''}`;

  function list(box, last) {
    if (!last || !last.ideas || !last.ideas.length) { box.innerHTML = '<p class="be-note">Пока списка нет — нажмите кнопку выше.</p>'; return; }
    const s = last.sources || {};
    box.innerHTML = `<p class="be-note">Список от ${fmt(last.at)}${last.note ? ` · пожелание: «${esc(last.note)}»` : ''} · данные: поиск Google — ${s.google ? '✓' : 'не ответил'}, Reddit — ${s.reddit ? '✓' : 'не ответил'}.</p>
      <ol class="idea-list" style="list-style:none;padding:0;margin:0">${last.ideas.map((x, i) => `<li class="adm-box" style="margin:0 0 12px">
        <h3 style="margin:0 0 4px;font-size:1.15rem">${i + 1}. ${esc(x.title_en)}</h3>
        <p style="margin:0 0 8px;opacity:.75">${esc(x.title_ru)}</p>
        <p style="margin:0 0 8px">${esc(x.idea_ru)}</p>
        <p class="be-note" style="margin:0 0 6px">🔎 ${x.keywords.map(esc).join(' · ')}</p>
        <p class="be-note" style="margin:0 0 6px">📈 ${esc(x.why_ru)}${x.when_ru ? ` · ⏰ ${esc(x.when_ru)}` : ''}${x.page ? ` · 🔗 <a href="${esc(x.page)}" target="_blank">${esc(x.page)}</a>` : ''}</p>
        <div class="adm-quick">${x.post_id ? `<a class="pill-btn pill-fill" href="/blog-editor/#${x.post_id}" target="_blank">📝 Открыть черновик (RU + EN)</a>` : `<button type="button" class="pill-btn pill-fill" data-write="${i}">✍️ Написать статью (RU + EN)</button>`}<button type="button" class="pill-btn" data-copy="${i}">📋 Скопировать тему</button></div>
        <p class="be-note" data-wmsg="${i}" aria-live="polite" style="margin:6px 0 0"></p></li>`).join('')}</ol>`;
    box.querySelectorAll('[data-copy]').forEach(b => b.onclick = async () => {
      try { await navigator.clipboard.writeText(text(last.ideas[b.dataset.copy])); b.textContent = '✓ Скопировано'; } catch (e) { b.textContent = 'Не вышло — выделите текст'; }
    });
    // статья целиком: Gemini пишет на RU и EN в вашем голосе (по последним статьям блога) и кладёт в «Черновики»
    box.querySelectorAll('[data-write]').forEach(b => b.onclick = async () => {
      const i = +b.dataset.write, m = box.querySelector(`[data-wmsg="${i}"]`);
      b.disabled = true; m.textContent = '⏳ Пишу статью на русском и английском… (до 2 минут)';
      try {
        const r = await fetch('/api/admin/ideas/write', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ i }) });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw Object.assign(new Error(d.error || r.status), { code: d.error });
        last.ideas[i].post_id = d.id;
        b.outerHTML = `<a class="pill-btn pill-fill" href="/blog-editor/#${d.id}" target="_blank">📝 Открыть черновик (RU + EN)</a>`;
        m.textContent = '✓ Готово — статья в «Черновиках» блога. Жёлтым отмечены места для вашей истории.';
      } catch (e) { b.disabled = false; m.textContent = ERR[e.code] || 'Ошибка: ' + e.message; }
    });
  }

  async function mount(main) {
    main.innerHTML = `<section class="adm-box"><h2>💡 Темы для блога</h2>
        <p class="be-note">Сайт смотрит, что люди сейчас ищут в Google по вашим темам (рисование, скетчбук, палитры, уютные игры) и что обсуждают на этой неделе в художественных сообществах Reddit, и предлагает 10 тем статей: заголовок с ключевыми словами, о чём писать и на какую страницу сайта сослаться. Занимает до минуты. «✍️ Написать статью» — готовая статья на русском и английском в «Черновиках» блога, в вашем голосе.</p>
        <p><input class="be-input id-note" maxlength="300" style="width:100%;padding:10px 12px;font:inherit" placeholder="Пожелание (можно пусто): например, «про акварель» или «к Рождеству»"></p>
        <div class="adm-quick"><button type="button" class="pill-btn pill-fill id-go">🔎 Найти темы</button></div>
        <p class="be-note id-msg" aria-live="polite"></p></section>
      <section class="adm-box"><h2>✍️ Статья по своей теме</h2>
        <p class="be-note">Напишите тему или ключевые слова на любом языке — сайт посмотрит, что по ним ищут в Google и обсуждают на Reddit, и напишет статью на русском и английском в «Черновики» блога.</p>
        <p><input class="be-input id-topic" maxlength="300" style="width:100%;padding:10px 12px;font:inherit" placeholder="Например: «рисовать, когда нет сил» или «autumn watercolor ideas»"></p>
        <div class="adm-quick"><button type="button" class="pill-btn pill-fill id-write">✍️ Найти и написать</button></div>
        <p class="be-note id-wmsg" aria-live="polite"></p></section>
      <div class="id-list"><p class="be-note">Загрузка…</p></div>`;
    const $ = q => main.querySelector(q), box = $('.id-list'), msg = $('.id-msg');
    $('.id-write').onclick = async () => {
      const b = $('.id-write'), m = $('.id-wmsg'), topic = $('.id-topic').value.trim();
      if (!topic) { m.textContent = 'Сначала напишите тему или ключевые слова.'; $('.id-topic').focus(); return; }
      b.disabled = true; m.textContent = '⏳ Смотрю поиск и Reddit, пишу статью на русском и английском… (до 2 минут)';
      try {
        const r = await fetch('/api/admin/ideas/write', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ topic }) });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw Object.assign(new Error(d.error || r.status), { code: d.error });
        m.innerHTML = `✓ Готово — «${esc(topic)}» в «Черновиках». <a href="/blog-editor/#${d.id}" target="_blank">📝 Открыть черновик (RU + EN)</a>. Жёлтым отмечены места для вашей истории.`;
      } catch (e) { m.textContent = ERR[e.code] || 'Ошибка: ' + e.message; }
      b.disabled = false;
    };
    try { list(box, (await api()).last); } catch (e) { box.innerHTML = `<p class="be-note">${esc(ERR[e.code] || e.message)}</p>`; }
    $('.id-go').onclick = async () => {
      const b = $('.id-go'); b.disabled = true; msg.textContent = '⏳ Смотрю поиск и Reddit, думаю над темами… (до минуты)';
      try { const d = await api({ note: $('.id-note').value.trim() }); msg.textContent = '✓ Готово'; list(box, d.last); } catch (e) { msg.textContent = ERR[e.code] || 'Ошибка: ' + e.message; }
      b.disabled = false;
    };
  }
  window.PPIdeasAdmin = { mount };
})();
