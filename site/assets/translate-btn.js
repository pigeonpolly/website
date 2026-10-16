// «🌐 Перевести» — одна кнопка для всех разделов кабинета. Сервер: POST /api/admin/translate (worker/translate.js, Gemini; запасной — Workers AI).
// PPTranslateBtn({ from: () => 'ru', texts: () => [...], fill: (lang, texts) => {}, about: 'cards', to: ['en', 'lv'] }) → <button>
// texts — что переводить (на языке from), fill — куда положить перевод для каждого языка; потом перевод можно поправить руками.
(function () {
  const LANGS = ['ru', 'en', 'lv'];
  const ERR = { no_key: 'Нет ключа Gemini — вставьте его: ⚙️ Сервис → Ключ Gemini.', bad_key: 'Ключ Gemini не подходит — проверьте: ⚙️ Сервис → Ключ Gemini.', ai_limit: 'Переводчик на сегодня устал (лимит). Попробуйте позже или впишите перевод руками.' };
  window.PPTranslateBtn = function (o) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'pill-btn pp-tr-btn';
    const label = () => { const f = o.from(), to = (o.to || LANGS).filter(l => l !== f); return `🌐 Перевести с ${f.toUpperCase()} на ${to.map(l => l.toUpperCase()).join(' и ')}`; };
    b.textContent = label();
    b.refresh = () => { b.textContent = label(); };
    b.onclick = async () => {
      const from = o.from(), to = (o.to || LANGS).filter(l => l !== from), texts = o.texts();
      if (!texts.some(t => String(t || '').trim())) { alert('Сначала напишите текст на ' + from.toUpperCase() + '.'); return; }
      b.disabled = true; b.textContent = '🌐 Перевожу…';
      try {
        const r = await fetch('/api/admin/translate', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ texts, from, to, about: o.about || 'short' }) });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw Object.assign(new Error(d.error || r.status), { code: d.error });
        for (const l of Object.keys(d.tr || {})) o.fill(l, d.tr[l]);
        const miss = to.filter(l => !(d.tr || {})[l]);
        if (miss.length) alert('Не получилось перевести на ' + miss.map(l => l.toUpperCase()).join(', ') + ' — впишите руками или попробуйте ещё раз.');
        if (o.done) o.done(d);
      } catch (e) { alert(ERR[e.code] || 'Не получилось перевести (' + (e.code || e.message) + '). Попробуйте ещё раз.'); }
      b.disabled = false; b.textContent = label();
    };
    return b;
  };
})();
