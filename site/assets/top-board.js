// Доска топа игр (docs/games.md § Доски топа): <div class="gtop" data-top="rain"></div> или data-top="maze,recipes" (несколько досок — чипы).
// Вкладки «За всё время» / «Эта неделя», 🥇🥈🥉, своя строка, если птичка ниже 10-го места; победитель прошлой недели.
// Сервер — GET /api/top?g=…&p=all|week (worker/top.js). PPTop.mount(el, {crown}) — вручную, PPTop.refresh() — перечитать все доски.
(() => {
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0, PRE = ['', '/ru', '/lv'][L];
  const T = {
    title: ['🏆 Top players', '🏆 Топ игроков', '🏆 Labākie spēlētāji'],
    all: ['All time', 'За всё время', 'Visu laiku'], week: ['This week', 'Эта неделя', 'Šonedēļ'],
    none: ['Nobody here yet: be the first!', 'Пока никого — будь первой птичкой!', 'Vēl neviena — esi pirmais!'],
    noneWeek: ['A new week has started: the first place is free!', 'Новая неделя началась — первое место свободно!', 'Sākusies jauna nedēļa — pirmā vieta ir brīva!'],
    guest: ['Sign in to get into the top.', 'Войди, чтобы попасть в топ.', 'Ienāc, lai tiktu topā.'],
    noNick: ['Choose a nickname to get into the top.', 'Выбери ник, чтобы попасть в топ.', 'Izvēlies segvārdu, lai tiktu topā.'],
    zero: ['You are not in this top yet: play and you will be!', 'Тебя пока нет в этом топе — сыграй, и появишься!', 'Tevis vēl nav šajā topā — uzspēlē, un būsi!'],
    you: ['you', 'ты', 'tu'],
    last: ['Last week’s winner:', 'Победитель прошлой недели:', 'Pagājušās nedēļas uzvarētājs:'],
    weekOf: [(a, b) => `Mon ${a} – Sun ${b}`, (a, b) => `пн ${a} – вс ${b}`, (a, b) => `P ${a} – Sv ${b}`],
  };
  const lvl = ['lv', 'ур.', 'līm.'];
  // что считает каждая доска: [за всё время, за неделю], единица
  const BOARDS = {
    rain: { name: ['🔘 Button Rain', '🔘 Пуговичный дождь', '🔘 Pogu lietus'], unit: lvl,
      all: ['Best level in one game', 'Лучший уровень за одну игру', 'Labākais līmenis vienā spēlē'],
      week: ['Best game of the week', 'Лучшая игра недели', 'Nedēļas labākā spēle'] },
    pan: { name: ['🥞 Pancakes', '🥞 Блины', '🥞 Pankūkas'], unit: lvl,
      all: ['Best level in one game', 'Лучший уровень за одну игру', 'Labākais līmenis vienā spēlē'],
      week: ['Best game of the week', 'Лучшая игра недели', 'Nedēļas labākā spēle'] },
    maze: { name: ['🗺 Mazes', '🗺 Лабиринты', '🗺 Labirinti'], unit: lvl,
      all: ['Maze levels passed', 'Пройдено уровней лабиринта', 'Pabeigti labirinta līmeņi'],
      week: ['Maze levels passed this week', 'Уровней лабиринта за неделю', 'Labirinta līmeņi šonedēļ'] },
    recipes: { name: ['📖 Recipes', '📖 Рецепты', '📖 Receptes'], unit: ['🧪', '🧪', '🧪'],
      all: ['Different potions in the recipe book', 'Разных зелий в книге рецептов', 'Dažādi dzērieni receptu grāmatā'],
      week: ['New potions this week', 'Новых зелий за неделю', 'Jauni dzērieni šonedēļ'] },
    titos: { name: ['🕵️ Cases', '🕵️ Дела', '🕵️ Lietas'], unit: ['📁', '📁', '📁'],
      all: ['Cases solved', 'Раскрыто дел', 'Atrisinātas lietas'],
      week: ['Cases solved this week', 'Раскрыто дел за неделю', 'Šonedēļ atrisinātas lietas'] },
  };
  const t = (k, ...a) => { const v = T[k][L]; return typeof v === 'function' ? v(...a) : v; };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const store = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
  const MED = ['🥇', '🥈', '🥉'];
  const day = s => new Date(s + 'T12:00:00Z').toLocaleDateString(['en-GB', 'ru-RU', 'lv-LV'][L], { day: 'numeric', month: 'short', timeZone: 'UTC' });
  const plus = (s, n) => { const d = new Date(s + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  const boards = [];

  function row(r, b, o, me) {
    const li = document.createElement('li'); li.className = 'gtop-row' + (me && r.id === me.id ? ' me' : '');
    const crown = r.place === 1 && o.crown && o.p === 'all';
    li.innerHTML = `<span class="gtop-place"${crown ? ` title="${esc(o.crown)}"` : ''}>${crown ? '👑' : MED[r.place - 1] || r.place}</span>`;
    if (window.PPBirds) li.appendChild(window.PPBirds.avatar(r.id, r.avatar, 34));
    li.insertAdjacentHTML('beforeend', `<a href="${PRE}/bird/?nick=${encodeURIComponent(r.nick)}">@${esc(r.nick)}</a>${me && r.id === me.id ? `<i>${t('you')}</i>` : ''}<b>${r.score} ${b.unit[L]}</b>`);
    return li;
  }

  async function draw(o) {
    const el = o.el, b = BOARDS[o.g], body = el.querySelector('.gtop-body');
    el.querySelectorAll('.gtop-tab').forEach(x => x.setAttribute('aria-selected', String(x.dataset.p === o.p)));
    el.querySelectorAll('.gtop-chip').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.g === o.g)));
    const n = ++o.n;
    let d = null;
    try { const r = await fetch(`/api/top?g=${o.g}&p=${o.p}`, { credentials: 'same-origin' }); if (r.ok) d = await r.json(); } catch (e) {}
    if (n !== o.n) return; // пока ждали, нажали другую вкладку
    if (!d) { body.innerHTML = ''; return; }
    const who = window.PPWho && window.PPWho.user;
    const sub = `<p class="gtop-sub">${esc(b[o.p][L])}${o.p === 'week' ? ` · ${esc(t('weekOf', day(d.week), day(plus(d.week, 6))))}` : ''}</p>`;
    body.innerHTML = sub + (d.last ? `<p class="gtop-last">👑 ${t('last')} <a href="${PRE}/bird/?nick=${encodeURIComponent(d.last.nick)}">@${esc(d.last.nick)}</a> · ${d.last.score} ${b.unit[L]}</p>` : '');
    const ol = document.createElement('ol'); ol.className = 'gtop-list';
    if (!d.top.length) ol.innerHTML = `<li class="gtop-none">${t(o.p === 'week' ? 'noneWeek' : 'none')}</li>`;
    d.top.forEach(r => ol.appendChild(row(r, b, o, d.me)));
    if (d.me && d.me.place > 10) { ol.insertAdjacentHTML('beforeend', '<li class="gtop-gap" aria-hidden="true">⋯</li>'); ol.appendChild(row(d.me, b, o, d.me)); }
    body.appendChild(ol);
    const note = !d.me ? (who && !who.nick ? t('noNick') : t('guest')) : d.me.place ? '' : t('zero');
    if (note) body.insertAdjacentHTML('beforeend', `<p class="gtop-note">${note}</p>`);
  }

  function mount(el, opt = {}) {
    if (!el) return null;
    if (el.__top) { if (opt.crown) el.__top.crown = opt.crown; return el.__top; }
    const gs = (el.dataset.top || '').split(',').filter(g => BOARDS[g]); if (!gs.length) return null;
    const key = 'pp-top-' + gs.join(',');
    const was = (store(key) || '').split(':');
    const o = { el, gs, g: gs.includes(was[0]) ? was[0] : gs[0], p: was[1] === 'week' ? 'week' : 'all', n: 0, crown: opt.crown || el.dataset.crown || '' };
    el.classList.add('gtop');
    el.innerHTML = `<div class="gtop-head"><h2>${t('title')}</h2><div class="gtop-tabs" role="tablist">${['all', 'week'].map(p => `<button type="button" role="tab" class="gtop-tab" data-p="${p}">${t(p)}</button>`).join('')}</div></div>`
      + (gs.length > 1 ? `<div class="gtop-chips">${gs.map(g => `<button type="button" class="gtop-chip" data-g="${g}">${BOARDS[g].name[L]}</button>`).join('')}</div>` : '')
      + '<div class="gtop-body" aria-live="polite"></div>';
    el.addEventListener('click', e => {
      const tab = e.target.closest('.gtop-tab'), chip = e.target.closest('.gtop-chip');
      if (tab) o.p = tab.dataset.p; else if (chip) o.g = chip.dataset.g; else return;
      store(key, o.g + ':' + o.p); draw(o);
    });
    el.__top = o; boards.push(o); draw(o);
    return o;
  }
  const refresh = el => boards.filter(o => !el || o.el === el).forEach(draw);
  const scan = () => document.querySelectorAll('[data-top]').forEach(el => mount(el));
  window.PPTop = { mount, refresh, scan };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan); else scan();
})();
