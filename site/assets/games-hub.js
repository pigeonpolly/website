// Хаб «Играть» (/games/, этап 14 В): вошедшим — готовность на карточках из GET /api/today («☕ 7/10», «🐞 жуки через 12 мин», «✓ сегодня»).
(function () {
  const L = { en: 0, ru: 1, lv: 2 }[document.documentElement.lang] ?? 0;
  const T = {
    stamp: ['📮 today’s stamp is waiting', '📮 штамп дня ждёт', '📮 dienas zīmogs gaida'],
    done: ['✓ played today', '✓ сегодня сыграно', '✓ šodien spēlēts'],
    solved: ['✓ case solved today', '✓ дело сегодня раскрыто', '✓ lieta šodien atrisināta'],
    all: ['all cases solved', 'все дела раскрыты', 'visas lietas atrisinātas'],
    bugsOk: ['🐞 bugs ready', '🐞 жуки готовы', '🐞 blaktis gatavas'],
    bugsIn: ['🐞 bugs in ', '🐞 жуки через ', '🐞 blaktis pēc '],
    advOpen: ['✓ window opened', '✓ окошко открыто', '✓ lodziņš atvērts'],
    advWait: ['🎁 today’s window is waiting', '🎁 окошко дня ждёт', '🎁 dienas lodziņš gaida'],
    min: [' min', ' мин', ' min'], h: [' h ', ' ч ', ' h '],
  };
  const t = k => T[k][L];
  const dur = ms => { const m = Math.max(1, Math.ceil(ms / 60000)); return m < 60 ? m + t('min') : Math.floor(m / 60) + t('h') + (m % 60) + t('min'); };
  const set = (g, parts, on) => {
    const el = document.querySelector(`.gm-tile[data-g="${g}"] .gm-ready`);
    if (!el || !parts.length) return;
    el.textContent = parts.join(' · ');
    el.classList.toggle('on', !!on);
    el.hidden = false;
  };
  (window.__ppFetch || fetch)(`/api/today?lang=${['en', 'ru', 'lv'][L]}`, { credentials: 'same-origin', headers: window.PPDevH ? window.PPDevH() : {} })
    .then(r => r.ok ? r.json() : null).then(d => {
      if (!d || d.guest || !d.tasks) return;
      const now = d.now || Date.now(), task = id => d.tasks.find(x => x.id === id);
      for (const g of ['rain', 'potion']) { const x = task(g); if (x) set(g, [x.done ? t('done') : t('stamp')], !x.done); }
      const ti = task('titos'), bu = task('bugs');
      if (ti) {
        const p = [];
        if (ti.cups) p.push(`☕ ${ti.cups[0]}/${ti.cups[1]}`);
        if (ti.done) p.push(t('solved')); else if (ti.wait === -1) p.push(t('all'));
        if (bu) p.push(bu.next && bu.next > now ? t('bugsIn') + dur(bu.next - now) : t('bugsOk'));
        set('titos', p, !ti.done);
      }
      const ad = task('advent');
      if (ad) set('advent', [ad.done ? t('advOpen') : t('advWait')], !ad.done);
    }).catch(() => { /* гостю и без сети — карточки без готовности */ });
})();
