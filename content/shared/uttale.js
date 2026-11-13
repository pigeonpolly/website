/* 🗣 Шпаргалка произношения норвежского (букмол) — язычок у левого края, панель выезжает слева.
   Встраивают tools/norsk_page.py: в учебник /norsk/ и в worker/uttale.js → Morgenavis /norsk/avis/ (docs/site.md «Шпаргалка произношения»).
   Ни прогресс учебника, ни газету не трогает; 🔊 — /api/norsk/tts (голос Gemini), без него — голос браузера nb-NO. */
(() => {
  if (document.getElementById('ppu')) return;
  const A = 'var(--accent,var(--acc,#534ab7))', S = 'var(--accent-soft,var(--acc2,#eef))', L = 'var(--line,var(--rule,#ddd))';
  const css = `
#ppu-tab{position:fixed;z-index:84;left:0;top:50%;transform:translateY(-50%);display:grid;place-items:center;gap:2px;border:1px solid ${L};border-left:0;border-radius:0 12px 12px 0;background:var(--card,#fff);color:${A};padding:9px 8px 9px 6px;cursor:pointer;box-shadow:2px 2px 10px rgb(0 0 0/.08);font:800 12px/1 system-ui,sans-serif;transition:padding .15s}
#ppu-tab:hover{padding-left:12px}#ppu-tab b{font-size:20px;line-height:1}
body.ppu-open #ppu-tab{opacity:0;pointer-events:none}
#ppu{position:fixed;z-index:85;top:0;left:0;bottom:0;width:min(480px,100vw);display:flex;flex-direction:column;background:var(--card,#fff);color:var(--ink,#222);border-right:1px solid ${L};box-shadow:10px 0 30px rgb(0 0 0/.15);transform:translateX(-102%);transition:transform .22s ease;font:15px/1.45 system-ui,-apple-system,'Segoe UI',sans-serif}
#ppu.on{transform:none}
#ppu .hd{display:flex;align-items:center;gap:8px;padding:12px 12px 8px 16px;border-bottom:1px solid ${L}}
#ppu .hd h2{flex:1;margin:0;font-size:18px;font-weight:800}
#ppu .x{border:0;background:none;color:inherit;font-size:22px;line-height:1;width:36px;height:36px;border-radius:50%;cursor:pointer}
#ppu .x:hover{background:${S}}
#ppu .nav{display:flex;flex-wrap:wrap;gap:6px;padding:8px 16px;border-bottom:1px solid ${L}}
#ppu .nav button{border:1px solid ${L};background:none;color:inherit;border-radius:999px;padding:4px 10px;font:600 13px/1.2 inherit;cursor:pointer}
#ppu .nav button:hover{border-color:${A};color:${A}}
#ppu .bd{flex:1;overflow:auto;padding:4px 16px 40px;overscroll-behavior:contain}
#ppu h3{margin:18px 0 6px;font-size:15px;font-weight:800;color:${A}}
#ppu p{margin:4px 0 8px}#ppu .tip{background:${S};border-radius:10px;padding:8px 10px;font-size:14px}
#ppu .r{padding:6px 0;border-bottom:1px solid ${L}}#ppu .h{margin-bottom:2px}#ppu .h b{font-size:16px;margin-right:4px}#ppu .h span{color:${A};font-weight:700}
#ppu .ex{display:inline-flex;align-items:center;gap:3px;margin:2px 6px 2px 0;border:0;background:none;color:inherit;font:inherit;padding:1px 2px;border-radius:6px;cursor:pointer;text-align:left}
#ppu .ex i{font-style:normal;opacity:.75;font-size:13px}
#ppu .ex::before{content:'🔊';font-size:11px;opacity:.55}
#ppu .ex:hover{background:${S}}#ppu .ex.play::before{opacity:1}
@media (max-width:600px){#ppu{width:100vw;border-right:0}#ppu-tab{padding:8px 6px 8px 5px}}
@media print{#ppu,#ppu-tab{display:none!important}}`;
  // [норвежское, как читать по-русски (примерно), перевод]
  const e = (no, ru, tr) => `<button type="button" class="ex" data-u="${no}">${no} <i>[${ru}]${tr ? ' — ' + tr : ''}</i></button>`;
  const row = (a, s, ...ex) => `<div class="r">${a || s ? `<div class="h"><b>${a}</b> <span>${s}</span></div>` : ''}<div>${ex.join('')}</div></div>`;
  const sec = [
    ['vok', 'Гласные', `<p>9 гласных. Каждая бывает долгой и краткой.</p><div class="t">
${row('a', '[а]', e('dag', 'да:г', 'день'), e('takk', 'так', 'спасибо'))}
${row('e', '[е], [э]', e('se', 'се:', 'смотреть'), e('penn', 'пэн', 'ручка'))}
${row('i', '[и]', e('is', 'и:с', 'лёд, мороженое'), e('fisk', 'фиск', 'рыба'))}
${row('o', 'чаще [у], иногда [о]', e('sol', 'су:л', 'солнце'), e('bok', 'бу:к', 'книга'), e('godt', 'гот', 'хорошо'))}
${row('u', '[ю] без «й», губы трубочкой', e('hus', 'хю:с', 'дом'), e('du', 'дю:', 'ты'))}
${row('y', '[и] с губами трубочкой (как нем. ü)', e('by', 'бю:', 'город'), e('ny', 'ню:', 'новый'))}
${row('æ', 'открытое [э]', e('være', 'вэ́:ре', 'быть'), e('lære', 'лэ́:ре', 'учить'))}
${row('ø', '[ё] без «й» (как нем. ö)', e('brød', 'брё:', 'хлеб'), e('søster', 'сё́стер', 'сестра'))}
${row('å', '[о]', e('på', 'по:', 'на'), e('år', 'о:р', 'год'))}
</div><p class="tip">Безударное <b>-e</b> на конце — короткое, почти «ə»: ${e('jente', 'йе́нте', 'девочка')}</p>`],
    ['len', 'Долгий или краткий', `<p>Одна согласная после гласной — гласная <b>долгая</b>; две согласные — <b>краткая</b>.</p><div class="t">
${row('', '', e('tak', 'та:к', 'крыша'), e('takk', 'так', 'спасибо'))}
${row('', '', e('tale', 'та́:ле', 'речь'), e('takke', 'та́кке', 'благодарить'))}
${row('', '', e('vin', 'ви:н', 'вино'), e('vinn', 'вин', 'победи'))}
</div>`],
    ['dif', 'Двойные гласные', `<div class="t">
${row('ei', '[эй]', e('nei', 'нэй', 'нет'), e('hei', 'хэй', 'привет'))}
${row('øy', '[ёй]', e('øy', 'ёй', 'остров'), e('høy', 'хёй', 'высокий'))}
${row('au', '[эу]', e('sau', 'сэу', 'овца'), e('august', 'эугу́ст', 'август'))}
</div>`],
    ['kon', 'Согласные с сюрпризом', `<div class="t">
${row('kj, tj', '[хь] — как в «химия»', e('kjøpe', 'хьё́:пе', 'покупать'), e('tjue', 'хью́:е', 'двадцать'))}
${row('k + i, y, ei, øy', '[хь]', e('kino', 'хи́:ну', 'кино'), e('kirke', 'хи́рке', 'церковь'))}
${row('sj, skj', '[ш]', e('sjø', 'шё:', 'море'), e('skje', 'ше:', 'ложка'))}
${row('sk + i, y, ei, øy', '[ш]', e('ski', 'ши:', 'лыжи'), e('sky', 'шю:', 'облако'))}
${row('g + i, y, ei, øy', '[й]', e('gi', 'йи:', 'давать'), e('gyllen', 'йю́ллен', 'золотой'))}
${row('gj, hj, lj', '[й] — h и g не читаются', e('gjøre', 'йё́:ре', 'делать'), e('hjem', 'йем', 'дом'))}
${row('hv', '[в] — h не читается', e('hva', 'ва:', 'что'), e('hvor', 'вур', 'где'))}
${row('rs', '[ш]', e('norsk', 'нош:к', 'норвежский'), e('først', 'фёшт', 'сначала'))}
${row('rt, rd, rn, rl', 'r сливается, язык чуть назад', e('kort', 'кот', 'короткий'), e('barn', 'ба:н', 'ребёнок'))}
${row('ng', '[ŋ] — «н» в нос, без [г]', e('ring', 'риŋ', 'кольцо'), e('lang', 'лаŋ', 'длинный'))}
${row('r', 'короткое раскатистое (в Осло)', e('rød', 'рё:', 'красный'))}
</div>`],
    ['tys', 'Немые буквы', `<div class="t">
${row('-d', 'после гласной, в -ld, -nd, -rd', e('god', 'гу:', 'хороший'), e('med', 'ме:', 'с'), e('land', 'лан', 'страна'), e('bord', 'бу:р', 'стол'))}
${row('-g', 'в -ig, -lig', e('viktig', 'ви́кти', 'важный'), e('hyggelig', 'хю́ггели', 'приятный'))}
${row('-t', 'в «det» и у среднего рода -et', e('det', 'де:', 'это'), e('huset', 'хю́:се', 'дом (этот)'))}
${row('h', 'перед j и v', e('hvit', 'ви:т', 'белый'), e('hjelp', 'йельп', 'помощь'))}
</div>`],
    ['sma', 'Маленькие слова', `<p>Читаются не по буквам — лучше запомнить:</p><div class="t">
${row('', '', e('jeg', 'яй', 'я'), e('meg', 'мяй', 'меня'), e('deg', 'дяй', 'тебя'), e('seg', 'сяй', 'себя'))}
${row('', '', e('de', 'ди:', 'они'), e('dem', 'дем', 'их'), e('De', 'ди:', 'Вы'))}
${row('', '', e('og', 'о', 'и'), e('å', 'о', 'частица перед глаголом'), e('også', 'о́ссо', 'тоже'))}
${row('', '', e('er', 'эр', 'есть'), e('ikke', 'и́кке', 'не'), e('mye', 'мю́:е', 'много'))}
</div>`],
    ['ton', 'Ударение и тон', `<p>Ударение почти всегда на <b>первом</b> слоге. В заимствованиях — часто на последнем: ${e('universitet', 'юнивэшите́:т', 'университет')} ${e('restaurant', 'рэстэура́ŋ', 'ресторан')}</p>
<p>У норвежского два «напева» слова. <b>Тон 1</b> — один ровный подъём; <b>тон 2</b> — «качелька»: вниз и снова вверх (так звучит большинство двусложных слов).</p><div class="t">
${row('тон 1', '', e('bønder', 'бё́нер', 'крестьяне'), e('tanken', 'та́ŋкен', 'бак'))}
${row('тон 2', '', e('bønner', 'бё́нер', 'бобы'), e('tanken', 'та́ŋкен', 'мысль'))}
</div><p class="tip">Не страшно, если тон не выходит: из контекста всё понятно. Нажмите 🔊 и повторите за голосом — это лучше любой таблицы.</p>`],
  ];
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  const tab = document.createElement('button');
  tab.type = 'button'; tab.id = 'ppu-tab'; tab.title = 'Произношение (Alt+U)'; tab.setAttribute('aria-label', 'Шпаргалка произношения');
  tab.innerHTML = '<b>Å</b>';
  const p = document.createElement('aside');
  p.id = 'ppu'; p.setAttribute('aria-label', 'Шпаргалка произношения'); p.setAttribute('aria-hidden', 'true'); p.dataset.nokeys = '';
  p.innerHTML = `<div class="hd"><h2>🗣 Uttale · произношение</h2><button type="button" class="x" aria-label="Закрыть">×</button></div>
<div class="nav">${sec.map(([id, t]) => `<button type="button" data-go="${id}">${t}</button>`).join('')}</div>
<div class="bd"><p class="tip">Транскрипция русскими буквами — примерная. «:» — гласная долгая, ударный слог отмечен ´. Нажмите на слово — прозвучит.</p>${sec.map(([id, t, h]) => `<section id="ppu-${id}"><h3>${t}</h3>${h}</section>`).join('')}</div>`;
  document.body.append(tab, p);
  const open = on => { p.classList.toggle('on', on); p.setAttribute('aria-hidden', on ? 'false' : 'true'); document.body.classList.toggle('ppu-open', on); if (on) p.querySelector('.x').focus({ preventScroll: true }); };
  tab.addEventListener('click', () => open(true));
  p.querySelector('.x').addEventListener('click', () => open(false));
  addEventListener('keydown', ev => { if (ev.altKey && ev.code === 'KeyU') { ev.preventDefault(); open(!p.classList.contains('on')); } else if (ev.key === 'Escape' && p.classList.contains('on')) open(false); });
  document.addEventListener('pointerdown', ev => { if (p.classList.contains('on') && !p.contains(ev.target) && !tab.contains(ev.target)) open(false); });
  // события внутри панели не доходят до страницы (перевод слов по нажатию, горячие клавиши учебника)
  for (const t of ['click', 'mouseup', 'keydown', 'pointerup']) p.addEventListener(t, ev => ev.stopPropagation());
  let audio = null;
  function browser(t) { if (!('speechSynthesis' in window)) return; speechSynthesis.cancel(); const m = new SpeechSynthesisUtterance(t); m.lang = 'nb-NO'; m.rate = .85; const v = speechSynthesis.getVoices().find(v => /^(nb|no|nn)/i.test(v.lang)); if (v) m.voice = v; speechSynthesis.speak(m); }
  p.addEventListener('click', ev => {
    const g = ev.target.closest('[data-go]'); if (g) { p.querySelector('#ppu-' + g.dataset.go).scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    const b = ev.target.closest('.ex'); if (!b) return;
    if (audio) audio.pause();
    p.querySelectorAll('.ex.play').forEach(x => x.classList.remove('play')); b.classList.add('play');
    const t = b.dataset.u; audio = new Audio('/api/norsk/tts?t=' + encodeURIComponent(t));
    const done = () => b.classList.remove('play');
    audio.onended = done; audio.onerror = () => { done(); browser(t); };
    audio.play().catch(() => { done(); browser(t); });
  }, true);
})();
