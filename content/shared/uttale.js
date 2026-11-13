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
#ppu .nav{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:8px 12px;border-bottom:1px solid ${L}}
#ppu .nav button{border:1px solid ${L};background:none;color:inherit;border-radius:999px;padding:4px 10px;font:600 13px/1.2 inherit;cursor:pointer;white-space:nowrap;flex:none}
#ppu .nav button[aria-pressed=true],#ppu .nav button[aria-pressed=true]:hover{background:${A};border-color:${A};color:var(--on-accent,#fff)}#ppu section:not(.on){display:none}
#ppu .nav button:hover{border-color:${A};color:${A}}
#ppu .bd{flex:1;overflow:auto;padding:2px 12px 40px;font-size:14px;overscroll-behavior:contain}
#ppu h3{margin:10px 0 4px;font-size:15px;font-weight:800;color:${A}}
#ppu p{margin:4px 0 6px}#ppu .tip{background:${S};border-radius:10px;padding:6px 10px;font-size:13px}
#ppu .r{display:grid;grid-template-columns:5.6em 4.2em 1fr;gap:0 6px;align-items:baseline;padding:3px 0;border-bottom:1px solid ${L}}#ppu .r b{font-size:15px}#ppu .r>span{color:${A};font-weight:800}#ppu .r.n{grid-template-columns:1fr}
#ppu .m{width:100%;border-collapse:collapse;text-align:center;margin:4px 0 6px;font-size:15px}#ppu .m th,#ppu .m td{border:1px solid ${L};padding:4px}#ppu .m th{font-size:12px;font-weight:600;opacity:.8}#ppu .m td{font-weight:800;text-align:left;padding-left:10px}#ppu .m td[rowspan]{color:${A};font-size:20px;text-align:center;width:35%}#ppu .m th{text-transform:none;letter-spacing:0}
#ppu .ex{display:inline-flex;align-items:center;gap:3px;margin:0 8px 0 0;border:0;background:none;color:inherit;font:inherit;padding:1px 2px;border-radius:6px;cursor:pointer;text-align:left}
#ppu .ex i{font-style:normal;opacity:.7;font-size:12.5px}
#ppu .ex::before{content:'🔊';font-size:11px;opacity:.55}
#ppu .ex:hover{background:${S}}#ppu .ex small{display:none;font-size:12.5px;opacity:.85}#ppu .ex.tr small{display:inline}#ppu .ex.play::before{opacity:1}
@media (max-width:600px){#ppu{width:100vw;border-right:0}#ppu-tab{padding:8px 6px 8px 5px}}
@media print{#ppu,#ppu-tab{display:none!important}}`;
  // [норвежское, как читать по-русски (примерно), перевод]
  const e = (no, ru, tr) => `<button type="button" class="ex" data-u="${no}" title="${tr || ''}">${no} <i>${ru}</i>${tr ? `<small>— ${tr}</small>` : ''}</button>`;
  const row = (a, s, ...ex) => a || s ? `<div class="r"><b>${a}</b><span>${s.replace(/[[\]]/g, '')}</span><div>${ex.join('')}</div></div>` : `<div class="r n"><div>${ex.join('')}</div></div>`;
  const sec = [
    ['kon', 'Согласные с сюрпризом', `<p class="tip">Запомнить просто: <b>3 звука</b> — хь, ш, й. Каждый получается двумя путями: перед «мягкими» гласными <b>i y ei øy</b> или с буквой <b>j</b>.</p>
<table class="m"><tr><th>пишется</th><th>читается</th></tr>
<tr><td>k + i y ei øy</td><td rowspan="2">хь</td></tr><tr><td>kj · tj</td></tr>
<tr><td>sk + i y ei øy</td><td rowspan="2">ш</td></tr><tr><td>sj · skj</td></tr>
<tr><td>g + i y ei øy</td><td rowspan="2">й</td></tr><tr><td>gj · hj · lj</td></tr></table><div class="t">
${row('k / kj', 'хь', e('kino', 'хи́ну', 'кино'), e('kjøpe', 'хьё́пе', 'покупать'))}
${row('sk / sj', 'ш', e('ski', 'ши', 'лыжи'), e('sjø', 'шё', 'море'))}
${row('g / gj', 'й', e('gi', 'йи', 'давать'), e('gjøre', 'йё́ре', 'делать'))}
${row('hv', 'в', e('hva', 'ва', 'что'), e('hvor', 'вур', 'где'))}
${row('rs', 'ш', e('norsk', 'ношк', 'норвежский'), e('først', 'фёшт', 'сначала'))}
${row('rt rd rn', 'т д н', e('kort', 'кот', 'короткий'), e('barn', 'ба:н', 'ребёнок'))}
${row('ng', 'ŋ', e('ring', 'риŋ', 'кольцо'), e('lang', 'лаŋ', 'длинный'))}
</div><p class="tip">h перед v и j не читается. rt, rd, rn — «r» исчезает, язык чуть назад. ng — «н» в нос, без [г].</p>`],
    ['vok', 'Гласные', `<p>9 гласных. Каждая бывает долгой и краткой.</p><div class="t">
${row('a', '[а]', e('dag', 'да:г', 'день'), e('takk', 'так', 'спасибо'))}
${row('e', '[е], [э]', e('se', 'се:', 'смотреть'), e('penn', 'пэн', 'ручка'))}
${row('i', '[и]', e('is', 'и:с', 'лёд, мороженое'), e('fisk', 'фиск', 'рыба'))}
${row('o', 'у, о', e('sol', 'су:л', 'солнце'), e('bok', 'бу:к', 'книга'), e('godt', 'гот', 'хорошо'))}
${row('u', 'ю*', e('hus', 'хю:с', 'дом'), e('du', 'дю:', 'ты'))}
${row('y', 'ю**', e('by', 'бю:', 'город'), e('ny', 'ню:', 'новый'))}
${row('æ', 'э', e('være', 'вэ́:ре', 'быть'), e('lære', 'лэ́:ре', 'учить'))}
${row('ø', 'ё', e('brød', 'брё:', 'хлеб'), e('søster', 'сё́стер', 'сестра'))}
${row('å', '[о]', e('på', 'по:', 'на'), e('år', 'о:р', 'год'))}
</div><p class="tip">* u — «ю» без «й», губы трубочкой. ** y — «и» губами трубочкой (нем. ü). ø — «ё» без «й». o — чаще «у».<br>Безударное <b>-e</b> на конце — короткое, почти «ə»: ${e('jente', 'йе́нте', 'девочка')}</p>`],
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
    ['tys', 'Немые буквы', `<div class="t">
${row('-d', 'молчит', e('god', 'гу:', 'хороший'), e('med', 'ме:', 'с'), e('land', 'лан', 'страна'), e('bord', 'бу:р', 'стол'))}
${row('-ig', 'и', e('viktig', 'ви́кти', 'важный'), e('hyggelig', 'хю́ггели', 'приятный'))}
${row('det, -et', 'е', e('det', 'де:', 'это'), e('huset', 'хю́:се', 'дом (этот)'))}
${row('hv, hj', 'в, й', e('hvit', 'ви:т', 'белый'), e('hjelp', 'йельп', 'помощь'))}
</div><p class="tip">d молчит после гласной и в -ld, -nd, -rd. h молчит перед v и j.</p>`],
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
<div class="nav">${sec.map(([id, t], n) => `<button type="button" data-go="${id}" aria-pressed="${!n}">${t}</button>`).join('')}</div>
<div class="bd"><p class="tip">Нажмите на слово — звук и перевод. Транскрипция примерная: «:» — долгая гласная, ´ — ударение.</p>${sec.map(([id, t, h], n) => `<section id="ppu-${id}"${n ? '' : ' class="on"'}><h3>${t}</h3>${h}</section>`).join('')}</div>`;
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
    const g = ev.target.closest('[data-go]'); if (g) { p.querySelectorAll('[data-go]').forEach(x => x.setAttribute('aria-pressed', x === g)); p.querySelectorAll('section').forEach(x => x.classList.toggle('on', x.id === 'ppu-' + g.dataset.go)); p.querySelector('.bd').scrollTop = 0; return; }
    const b = ev.target.closest('.ex'); if (!b) return;
    if (audio) audio.pause();
    p.querySelectorAll('.ex.play').forEach(x => x.classList.remove('play')); b.classList.add('play', 'tr');
    const t = b.dataset.u; audio = new Audio('/api/norsk/tts?t=' + encodeURIComponent(t));
    const done = () => b.classList.remove('play');
    audio.onended = done; audio.onerror = () => { done(); browser(t); };
    audio.play().catch(() => { done(); browser(t); });
  }, true);
})();
