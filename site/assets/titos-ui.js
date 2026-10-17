// «Детектив Титос» /titos/ (docs/titos.md): кофейник (полный / половина / пустой — Титос спит) и 4 карточки-награды над игрой.
// PPTitos.pot(el, s) и PPTitos.rewards(el, level) — общие, ими же будет пользоваться движок дел; s = { coffee, max, next (мс — следующая чашка) }.
// Состояние — /api/whoami → user.titos (titosState, worker/titos.js) и событие 'pp:titos' (quest-titos.js шлёт его после каждого ответа /api/titos*); гость — по localStorage.
(() => {
  const L = { en: 0, ru: 1, lv: 2 }[document.documentElement.lang] ?? 0;
  const t = a => a[L];
  const T = {
    full: ['Coffee pot is full', 'Кофейник полный', 'Kafijas kanna ir pilna'],
    half: ['Half a pot left', 'Кофе — полкофейника', 'Atlikusi puse kannas'],
    empty: ['No coffee. Titos is asleep', 'Кофе нет. Титос спит', 'Kafijas nav. Titoss guļ'],
    cups: ['cups', 'чашек', 'tases'],
    next: ['next cup in', 'следующая чашка через', 'nākamā tase pēc'],
    min: ['min', 'мин', 'min'],
    refill: [n => `☕ Top up for ${n} 🔘`, n => `☕ Долить за ${n} 🔘`, n => `☕ Uzpildīt par ${n} 🔘`],
    refill0: ['☕ Top up', '☕ Долить', '☕ Uzpildīt'],
    soon: ['Sign in to top up', 'Войдите, чтобы долить', 'Ieej, lai uzpildītu'],
    ask: [n => `Fill the coffee pot for ${n} 🔘?`, n => `Долить кофейник за ${n} 🔘?`, n => `Uzpildīt kafijas kannu par ${n} 🔘?`],
    poor: ['Not enough buttons', 'Не хватает пуговок', 'Nepietiek pogu'],
    sleep: ['“I am not asleep. I am analysing with my eyes closed.”', '«Я не сплю. Я анализирую с закрытыми глазами.»', '“Es neguļu. Es analizēju ar aizvērtām acīm.”'],
    awake: ['“Coffee is not a drink. It is a method of investigation.”', '«Кофе — это не напиток. Это метод расследования.»', '“Kafija nav dzēriens. Tā ir izmeklēšanas metode.”'],
    rewards: ['Rewards for levels', 'Награды за уровни', 'Balvas par līmeņiem'],
    locked: ['Solve case No. %', 'Раскройте дело №%', 'Atrisini lietu Nr. %'],
    got: ['In your bag', 'В сумке', 'Somā'],
  };
  // награды за уровни — те же ключи, что TITOS_REWARDS в worker/index.js и PPCanDo.TITOS; картинки пока заглушки (простые SVG, не на силуэте — цветные)
  const REWARDS = [
    { lvl: 30, id: 'furn|chalkrug', ico: '<rect x="2" y="7" width="20" height="12" rx="1.5" fill="#9c3b2e"/><path d="M2 19v2M5 19v2M8 19v2M11 19v2M14 19v2M17 19v2M20 19v2" stroke="#9c3b2e"/><circle cx="7" cy="11" r="1.6" fill="none" stroke="#fff" stroke-width=".8"/><path d="M8.6 11.5l6 .5 3-2M14.6 12l3.4 3M11 11.7l-1 4M12.5 11.8l1.5 3.5" fill="none" stroke="#fff" stroke-width=".8"/>', name: ['Rug with a chalk outline', 'Ковёр с меловым силуэтом', 'Paklājs ar krīta siluetu'] },
    { lvl: 50, id: 'furn|titospot', ico: 'pot', name: ['Detective’s coffee pot', 'Кофейник детектива', 'Detektīva kafijas kanna'] },
    { lvl: 90, id: 'deco|clueboard', ico: '<rect x="2" y="3" width="20" height="16" rx="1" fill="#6b4423"/><rect x="3.5" y="4.5" width="17" height="13" fill="#c9955a"/><rect x="5" y="6" width="4" height="5" fill="#f4f0fa"/><rect x="14" y="6.5" width="5" height="4" fill="#f4f0fa"/><rect x="9.5" y="12" width="4" height="4.5" fill="#f4f0fa"/><path d="M7 6.5L16.5 7l-5 5.5z" fill="none" stroke="#d33" stroke-width=".6"/><circle cx="7" cy="6.5" r=".9" fill="#d33"/><circle cx="16.5" cy="7" r=".9" fill="#d33"/><circle cx="11.5" cy="12.5" r=".9" fill="#d33"/><path d="M4 19l-1 3M20 19l1 3" stroke="#6b4423" stroke-width="1.2"/>', name: ['Evidence board', 'Доска улик', 'Pierādījumu dēlis'] },
    { lvl: 100, id: 'deco|titosbadge', ico: '<rect x="3" y="2" width="18" height="20" rx="1" fill="#8a5a2b"/><rect x="5" y="4" width="14" height="16" fill="#2b1a51"/><path d="M12 6l1.8 3.6 4 .6-2.9 2.8.7 4L12 15.1 8.4 17l.7-4-2.9-2.8 4-.6z" fill="#e9a93b" stroke="#fff3c4" stroke-width=".4"/>', name: ['Detective Titos’ gold badge in a wooden frame', 'Золотой значок детектива Титоса в деревянной рамке', 'Detektīva Titosa zelta nozīmīte koka rāmī'] },
  ];
  // кофейник — пиксели prop-pot.png из кабинета (A — контур, B — тень, C — стекло, D — кофе); кофе заполняет ряды 4–8 снизу
  const GRID = ['....AAAA......', '...ABBBBA.....', '..ABBBBBBA....', '.ACCCCCCCCA...', '.ACDDDDDDCBA..', 'ACDDDDDDDDCBA.', 'ACDDDDDDDDCABA', 'ACDDDDDDDDCBA.', '.ACDDDDDDCAA..', '..ACCCCCCA....', '.ABBBBBBBBA...', '..AAAAAAAA....'];
  const COL = { A: '#1a1528', B: '#28282e', C: '#c8dce6', D: '#5a321e', E: '#3c3f5a' }; // E — пустое стекло
  const stateOf = s => !s || s.coffee <= 0 ? 'empty' : s.coffee >= Math.ceil(s.max * 2 / 3) ? 'full' : 'half';
  const potSvg = (st, bare) => {
    const top = st === 'full' ? 4 : st === 'half' ? 6 : 99; let r = '';
    GRID.forEach((row, y) => [...row].forEach((c, x) => {
      if (c === '.') return;
      const k = c === 'D' && y < top ? 'E' : c;
      r += `<rect x="${x}" y="${y + 4}" width="1.02" height="1.02" fill="${COL[k]}"/>`;
    }));
    // пар над полным и половинным, «z z» над пустым
    const fx = st === 'empty' ? '<text class="tt-z" x="10" y="4" font-size="3.4">z</text><text class="tt-z tt-z2" x="12.4" y="2" font-size="2.6">z</text>'
      : `<path class="tt-steam" d="M6 3.5c-1-1 1-1.6 0-3M8.2 3.5c-1-1 1-1.6 0-3" stroke="#d9d3f2" stroke-width=".55" fill="none"${st === 'half' ? ' opacity=".55"' : ''}/>`;
    return `<svg viewBox="0 0 15 16" width="84" height="90" shape-rendering="crispEdges" aria-hidden="true">${r}${bare ? '' : fx}</svg>`;
  };
  const CSS = `
.tt-top{display:grid;gap:14px;margin:0 0 18px}
.tt-pot{display:flex;align-items:center;gap:14px;flex-wrap:wrap;background:var(--bg-card);border:1px solid var(--line);border-radius:16px;padding:12px 16px}
.tt-pot svg{flex:none;image-rendering:pixelated}
.tt-pot-i{flex:1 1 180px;min-width:0}
.tt-pot-i b{display:block;font-family:var(--serif);font-size:1.15rem}
.tt-pot-i small{display:block;color:var(--muted);margin-top:2px}
.tt-pot-i q{display:block;color:var(--peach);font-style:italic;margin-top:6px;quotes:none}
.tt-cups{display:flex;gap:3px;margin-top:6px}
.tt-cups i{width:10px;height:12px;border-radius:2px 2px 4px 4px;background:var(--line)}
.tt-cups i.on{background:#a8673f}
.tt-pot .pill-btn{flex:none}
.tt-pot .pill-btn[disabled]{opacity:.55;cursor:default}
.tt-pot.is-empty{background:#241843}
.tt-steam{animation:tt-st 2.4s ease-in-out infinite}
.tt-z{fill:#d9d3f2;font-family:var(--sans);font-weight:700;animation:tt-zz 2.4s ease-in-out infinite}.tt-z2{animation-delay:1.2s}
@keyframes tt-st{0%,100%{opacity:.25;transform:translateY(.4px)}50%{opacity:.9;transform:translateY(-.4px)}}
@keyframes tt-zz{0%,100%{opacity:.2}50%{opacity:1}}
.tt-rw h2{font-family:var(--serif);font-size:1.1rem;margin:0 0 8px}
.tt-cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;max-width:760px}
.tt-card{background:#f4f0fa;color:#2b1a51;border-radius:14px;padding:8px 6px 10px;text-align:center;min-width:0}
.tt-card svg{display:block;width:64px;height:64px;margin:4px auto 6px}
.tt-card.is-locked svg{filter:brightness(0);opacity:.22}
.tt-card b{display:block;font-size:.8rem;line-height:1.2}
.tt-card .tt-lv{display:inline-block;font-weight:700;font-size:.72rem;background:#2b1a51;color:#f3effa;border-radius:99px;padding:1px 8px}
.tt-card.is-locked b{color:#8a7fae;letter-spacing:.1em}
@media (max-width:560px){.tt-cards{gap:6px}.tt-card{padding:6px 3px 8px;border-radius:10px}.tt-card svg{width:44px;height:44px}.tt-card b{font-size:.68rem}.tt-card .tt-lv{font-size:.66rem;padding:1px 6px}.tt-pot{padding:10px 12px}.tt-pot svg{width:64px;height:69px}}
@media (prefers-reduced-motion:reduce){.tt-steam,.tt-z{animation:none}}`;
  let css = false;
  const addCss = () => { if (css) return; css = true; const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); };

  // кофейник: el — контейнер; o.onRefill — что делает «☕ Долить» (нет — кнопка неактивна); полный кофейник доливать нечего
  function pot(el, s, o = {}) {
    addCss();
    const st = stateOf(s), mins = s && s.next ? Math.max(1, Math.ceil((s.next - Date.now()) / 60000)) : 0;
    el.className = 'tt-pot is-' + st;
    el.innerHTML = `${potSvg(st)}<div class="tt-pot-i"><b>${t(T[st])}</b><small>☕ ${s.coffee}/${s.max} ${t(T.cups)}${mins && s.coffee < s.max ? ` · ${t(T.next)} ${mins} ${t(T.min)}` : ''}</small>
      <span class="tt-cups">${Array.from({ length: s.max }, (_, i) => `<i${i < s.coffee ? ' class="on"' : ''}></i>`).join('')}</span><q>${t(st === 'empty' ? T.sleep : T.awake)}</q></div>
      <button type="button" class="pill-btn tt-refill"${o.onRefill && s.coffee < s.max ? '' : ' disabled'}${o.onRefill ? '' : ` title="${t(T.soon)}"`}>${s.prices && s.prices.refill ? t(T.refill)(s.prices.refill) : t(T.refill0)}</button>`;
    if (o.onRefill) el.querySelector('.tt-refill').onclick = o.onRefill;
  }
  // 4 карточки-награды: пока уровень не пройден — силуэт
  function rewards(el, level = 0, o = {}) {
    addCss();
    el.className = 'tt-rw';
    el.innerHTML = `<h2>${t(T.rewards)}</h2><div class="tt-cards">${REWARDS.map(r => {
      const got = level >= r.lvl || (o.got || []).includes(r.id);
      const pic = r.ico === 'pot' ? potSvg('full', true) : `<svg viewBox="0 0 24 24" aria-hidden="true">${r.ico}</svg>`;
      return `<div class="tt-card${got ? '' : ' is-locked'}" data-id="${r.id}" title="${got ? t(r.name) + ' · ' + t(T.got) : t(T.locked).replace('%', r.lvl)}"><span class="tt-lv">${r.lvl}</span>${pic}<b>${got ? t(r.name) : '???'}</b></div>`;
    }).join('')}</div>`;
  }
  window.PPTitos = Object.assign(window.PPTitos || {}, { pot, rewards, REWARDS, stateOf });

  // страница /titos/: блок #titos-top над игрой
  const top = document.getElementById('titos-top'); if (!top) return;
  addCss(); top.className = 'tt-top';
  const rwEl = document.createElement('div'), potEl = document.createElement('div'); top.append(rwEl, potEl);
  // гость: уровень — сколько дел раскрыто в этом браузере, кофейник полный
  const local = () => { let n = 0; for (const k of ['pp-titos-syrup-case', 'pp-titos-cucumber-case']) try { if (JSON.parse(localStorage.getItem(k) || '{}').solved) n++; } catch (e) {} return { level: n, coffee: 10, max: 10, next: 0 }; };
  let S = local();
  const qs = new URLSearchParams(location.search), q = qs.get('pot'), ql = Number(qs.get('lvl')) || 0; // ?pot=full|half|empty&lvl=50 — посмотреть кофейник и карточки (для проверки)
  const draw = () => {
    const s = q ? { ...S, coffee: { full: S.max, half: Math.ceil(S.max / 2) - 1, empty: 0 }[q] ?? S.coffee, next: Date.now() + 37 * 60000 } : { ...S };
    if (ql) s.level = ql;
    rewards(rwEl, s.level, s); pot(potEl, s, { onRefill: window.PPWho && window.PPWho.user ? refill : null });
  };
  // «☕ Долить»: POST /api/titos/coffee {src: 'buy'} — пуговки titosRefillPct, кофейник полный
  const refill = async () => {
    if (S.prices && S.prices.refill && !confirm(t(T.ask)(S.prices.refill))) return;
    try {
      const r = await fetch('/api/titos/coffee', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ src: 'buy' }), credentials: 'same-origin' });
      const j = await r.json().catch(() => ({}));
      if (j.state) take(j.state); else if (r.status === 402) (window.PPToast || alert)(t(T.poor));
      if (j.paid && window.PPAccount) window.PPAccount.check(); // пуговки в шапке
    } catch (e) { /* сеть — кнопка останется */ }
  };
  const take = d => { if (d && typeof d.coffee === 'number') { S = { ...S, ...d }; draw(); } };
  const fromWho = d => d && d.user && d.user.titos;
  document.addEventListener('pp:whoami', e => { take(fromWho(e.detail)); draw(); });
  document.addEventListener('pp:titos', e => take(e.detail));
  take(fromWho(window.PPWho));
  draw(); setInterval(draw, 30000);
})();
