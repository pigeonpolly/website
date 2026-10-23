// «Смена с Полли» (/shift/, этап 29, docs/rooms.md): таймер работы вместе с Полли в её кабинете.
// Сцена — canvas 480×270: фон и передний слой стола (tools/rooms/shift.py → site/images/shift/), Полли — кадры из polly.png/polly.json.
// Пока идёт смена, Полли в случайном порядке занимается делами (между ними печатает); на столе — таймер. В конце срывает галстук,
// берёт гитару, звучит колыбельная (shift-music.js), потом засыпает. Вошедшим — «повышение» за каждый час и 🔘 (worker/shift.js).
// Смена переживает перезагрузку страницы (localStorage pp-shift).
(() => {
  const root = document.getElementById('shift');
  if (!root) return;
  const LI = { ru: 1, lv: 2 }[document.documentElement.lang] || 0;
  const tr = a => a[LI] != null ? a[LI] : a[0];
  const M = window.PPShiftMusic;
  const T = {
    min: ['min', 'мин', 'min'], h: ['h', 'ч', 'st.'], own: ['Custom', 'Своё', 'Savs'],
    start: ['▶ Start the shift', '▶ Начать смену', '▶ Sākt maiņu'], pause: ['⏸ Pause', '⏸ Пауза', '⏸ Pauze'], resume: ['▶ Go on', '▶ Дальше', '▶ Turpināt'],
    stop: ['⏹ End early', '⏹ Закончить', '⏹ Beigt'], again: ['🔁 One more shift', '🔁 Ещё смену', '🔁 Vēl vienu maiņu'],
    stopQ: ['End the shift early? It won’t count towards a promotion.', 'Закончить смену раньше? Она не пойдёт в зачёт повышения.', 'Beigt maiņu agrāk? Tā netiks ieskaitīta paaugstinājumā.'],
    time: ['Shift length', 'Длина смены', 'Maiņas garums'], music: ['Music', 'Музыка', 'Mūzika'], silence: ['Silence', 'Тишина', 'Klusums'], vol: ['Volume', 'Громкость', 'Skaļums'],
    left: ['left', 'осталось', 'atlicis'], paused: ['paused', 'пауза', 'pauze'], over: ['Shift over!', 'Смена окончена!', 'Maiņa beigusies!'],
    post: ['Your position', 'Должность', 'Amats'], worked: ['worked', 'отработано', 'nostrādāts'], toNext: ['to the next promotion', 'до повышения', 'līdz paaugstinājumam'],
    guest: ['Sign in — and every hour with Polly brings a promotion and buttons 🔘.', 'Войди — и за каждый час с Полли будет повышение и пуговки 🔘.', 'Ienāc — un par katru stundu ar Polliju būs paaugstinājums un pogas 🔘.'],
    signin: ['Sign in', 'Войти', 'Ienākt'], perHour: ['per hour', 'за час', 'par stundu'],
    promo: ['Promotion! You are now', 'Повышение! Теперь ты —', 'Paaugstinājums! Tagad tu esi'],
    good: ['Good shift! Minutes saved.', 'Хорошая смена! Минуты в зачёте.', 'Laba maiņa! Minūtes ieskaitītas.'],
    guestDone: ['Good shift! Sign in next time to get promotions and buttons.', 'Хорошая смена! Войди в следующий раз — будут повышения и пуговки.', 'Laba maiņa! Nākamreiz ienāc — būs paaugstinājumi un pogas.'],
    noSave: ['Couldn’t save the shift — check the connection.', 'Не получилось сохранить смену — проверь интернет.', 'Neizdevās saglabāt maiņu — pārbaudi savienojumu.'],
    title: ['Shift with Polly', 'Смена с Полли', 'Maiņa ar Polliju'],
  };
  const DO = {
    wait: ['Polly is waiting for the shift to start', 'Полли ждёт начала смены', 'Pollija gaida maiņas sākumu'],
    type: ['Polly is typing a report', 'Полли печатает отчёт', 'Pollija raksta atskaiti'],
    coffee: ['Polly is drinking coffee', 'Полли пьёт кофе', 'Pollija dzer kafiju'],
    lunch: ['Polly is having lunch from her lunch box', 'Полли обедает из контейнера', 'Pollija ēd pusdienas no kastītes'],
    water: ['Polly is drinking water at the cooler', 'Полли пьёт воду у кулера', 'Pollija dzer ūdeni pie dzesētāja'],
    stretch: ['Polly is stretching', 'Полли разминается', 'Pollija izstaipās'],
    copy: ['Polly is copying and printing documents', 'Полли копирует и печатает документы', 'Pollija kopē un drukā dokumentus'],
    folder: ['Polly is searching the folders', 'Полли ищет в папках', 'Pollija meklē mapēs'],
    plant: ['Polly is watering the plant', 'Полли поливает цветок', 'Pollija laista puķi'],
    diploma: ['Polly is straightening her diplomas', 'Полли поправляет дипломы', 'Pollija pielabo diplomus'],
    toss: ['Polly throws a crumpled sheet into the bin', 'Полли кидает смятый лист в урну', 'Pollija met saburzītu lapu atkritnē'],
    tie: ['Shift over! Polly rips off her tie…', 'Смена окончена! Полли срывает галстук…', 'Maiņa beigusies! Pollija norauj kaklasaiti…'],
    rock: ['…grabs a rock guitar and plays… a lullaby', '…берёт рок-гитару и играет… колыбельную', '…paņem rokģitāru un spēlē… šūpuļdziesmu'],
    sleep: ['Polly is asleep. Shh.', 'Полли уснула. Тсс.', 'Pollija aizmigusi. Čšš.'],
    pause: ['Pause — Polly is drinking coffee', 'Пауза — Полли пьёт кофе', 'Pauze — Pollija dzer kafiju'],
  };
  // бесконечная лестница должностей: после списка — «Легенда офиса ★N»
  const RANKS = [
    ['Intern', 'Стажёр', 'Praktikants'], ['Junior Clerk', 'Младший клерк', 'Jaunākais klerks'], ['Clerk', 'Клерк', 'Klerks'],
    ['Keeper of Paper Clips', 'Хранитель скрепок', 'Saspraužu sargs'], ['Senior Clerk', 'Старший клерк', 'Vecākais klerks'],
    ['Coffee Machine Whisperer', 'Заклинатель кофемашины', 'Kafijas automāta čukstētājs'], ['Head of Sticky Notes', 'Начальник стикеров', 'Līmlapiņu priekšnieks'],
    ['Stapler Specialist', 'Специалист по степлерам', 'Skavotāju speciālists'], ['Water Cooler Team Lead', 'Тимлид кулера', 'Ūdens dzesētāja komandas vadītājs'],
    ['Folder Archivist', 'Архивариус папок', 'Mapju arhivārs'], ['Deputy Manager', 'Заместитель менеджера', 'Menedžera vietnieks'], ['Manager', 'Менеджер', 'Menedžeris'],
    ['Senior Plant Manager', 'Старший менеджер по цветам', 'Augu vecākais menedžeris'], ['Head of Department', 'Глава отдела', 'Nodaļas vadītājs'],
    ['Director of Diplomas', 'Директор по дипломам', 'Diplomu direktors'], ['Vice President of Lunch Boxes', 'Вице-президент по ланч-боксам', 'Pusdienu kastīšu viceprezidents'],
    ['Vice President', 'Вице-президент', 'Viceprezidents'], ['Chief Executive Pigeon', 'Генеральный голубь', 'Galvenais izpildbalodis'],
    ['Chair of the Board', 'Председатель совета директоров', 'Valdes priekšsēdētājs'], ['Office Legend', 'Легенда офиса', 'Biroja leģenda'],
  ];
  const rankName = n => n < RANKS.length ? tr(RANKS[n]) : tr(RANKS[RANKS.length - 1]) + ' ★' + (n - RANKS.length + 2);
  const PRESETS = [20, 40, 60, 90];
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* без памяти */ } } };
  const post = (path, body) => fetch('/api/' + path, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}) }).then(r => r.ok ? r.json() : Promise.reject(r.status));
  const toast = m => window.PPToast && window.PPToast(m);

  // ---------- состояние смены ----------
  // phase: idle | run | pause | end; dur — минуты; end — когда кончится (run); left — сколько осталось (pause); run — id смены на сервере
  let S = Object.assign({ phase: 'idle', dur: 40, end: 0, left: 0, run: null }, store.get('pp-shift', {}));
  let track = store.get('pp-shift-track', 0), vol = store.get('pp-shift-vol', 0.6), info = null;
  const save = () => store.set('pp-shift', S);
  const leftMs = () => S.phase === 'run' ? Math.max(0, S.end - Date.now()) : S.phase === 'pause' ? S.left : S.phase === 'end' ? 0 : S.dur * 60000;
  const fmt = ms => { const s = Math.ceil(ms / 1000), h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, x = s % 60, p = n => String(n).padStart(2, '0'); return h ? `${h}:${p(m)}:${p(x)}` : `${p(m)}:${p(x)}`; };
  const durLabel = m => m % 60 === 0 ? `${m / 60} ${tr(T.h)}` : m > 60 ? `${(m / 60).toLocaleString(['en', 'ru', 'lv'][LI])} ${tr(T.h)}` : `${m} ${tr(T.min)}`;

  // ---------- разметка ----------
  root.innerHTML = `
    <div class="sh-top">
      <div class="sh-clock"><b class="sh-left">--:--</b><small class="sh-sub"></small></div>
      <div class="sh-ctl">
        <div class="sh-row"><span class="sh-lbl">${tr(T.time)}</span>
          ${PRESETS.map(m => `<button type="button" class="sh-chip" data-min="${m}">${durLabel(m)}</button>`).join('')}
          <label class="sh-chip sh-own">${tr(T.own)}: <input type="number" min="5" max="180" step="5" inputmode="numeric"> ${tr(T.min)}</label></div>
        <div class="sh-row"><span class="sh-lbl">${tr(T.music)}</span>
          ${(M ? M.TRACKS : []).map((t, i) => `<button type="button" class="sh-chip" data-track="${i}">${t.icon} ${tr(t.name)}</button>`).join('')}
          <button type="button" class="sh-chip" data-track="-1">🔇 ${tr(T.silence)}</button>
          <span aria-hidden="true">🔊</span><input type="range" class="sh-vol" min="0" max="100" aria-label="${tr(T.vol)}"></div>
        <div class="sh-row sh-btns"><button type="button" class="btn sh-go"></button><button type="button" class="btn ghost sh-stop">${tr(T.stop)}</button></div>
      </div>
    </div>
    <div class="sh-scene"><canvas width="480" height="270" aria-hidden="true"></canvas></div>
    <p class="sh-cap" aria-live="polite"></p>
    <div class="sh-rank"></div>
    <div class="sh-done" hidden></div>`;
  const $ = s => root.querySelector(s), $$ = s => [...root.querySelectorAll(s)];
  const cv = $('canvas'), g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
  const own = $('.sh-own input'), volEl = $('.sh-vol');
  volEl.value = Math.round(vol * 100);
  const baseTitle = document.title;

  function renderCtl() {
    const busy = S.phase === 'run' || S.phase === 'pause';
    $$('[data-min]').forEach(b => { b.classList.toggle('on', +b.dataset.min === S.dur); b.disabled = busy; });
    const isOwn = !PRESETS.includes(S.dur);
    $('.sh-own').classList.toggle('on', isOwn); own.disabled = busy; if (isOwn && document.activeElement !== own) own.value = S.dur;
    $$('[data-track]').forEach(b => b.classList.toggle('on', +b.dataset.track === track));
    $('.sh-go').textContent = S.phase === 'run' ? tr(T.pause) : S.phase === 'pause' ? tr(T.resume) : S.phase === 'end' ? tr(T.again) : tr(T.start);
    $('.sh-stop').hidden = !busy;
  }
  function renderRank() {
    const el = $('.sh-rank');
    if (!info) { el.innerHTML = ''; return; }
    if (!info.me) {
      el.innerHTML = `<p>🪪 ${tr(T.guest)}</p><button type="button" class="btn ghost sh-in">${tr(T.signin)}</button>`;
      el.querySelector('.sh-in').onclick = () => window.PPAccount && window.PPAccount.openSignIn();
      return;
    }
    const t = info.total || 0, h = Math.floor(t / 60), m = t % 60;
    el.innerHTML = `<p>🪪 ${tr(T.post)}: <b>${rankName(info.rank)}</b> · ${tr(T.worked)} ${h} ${tr(T.h)} ${m} ${tr(T.min)} · ${tr(T.toNext)} ${60 - m} ${tr(T.min)}${info.on && info.btn ? ` · +${info.btn} 🔘 ${tr(T.perHour)}` : ''}</p>`;
  }
  const load = () => fetch('/api/shift', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).then(d => { if (d) { info = d; renderRank(); } }).catch(() => {});

  $$('[data-min]').forEach(b => b.onclick = () => { S.dur = +b.dataset.min; S.phase = 'idle'; save(); renderCtl(); $('.sh-done').hidden = true; });
  own.onchange = () => { const v = Math.max(5, Math.min(180, Math.round(+own.value || 0))); own.value = v; S.dur = v; S.phase = 'idle'; save(); renderCtl(); };
  own.onfocus = () => { if (PRESETS.includes(S.dur)) own.value = S.dur; };
  $$('[data-track]').forEach(b => b.onclick = () => {
    track = +b.dataset.track; store.set('pp-shift-track', track); renderCtl();
    if (!M) return;
    if (track < 0) M.stop(); else if (S.phase !== 'end' || !finale) M.play(track);
  });
  volEl.oninput = () => { vol = volEl.value / 100; store.set('pp-shift-vol', vol); M && M.volume(vol); };
  M && M.volume(vol);

  $('.sh-go').onclick = () => {
    if (S.phase === 'idle' || S.phase === 'end') start();
    else if (S.phase === 'run') { S.left = Math.max(0, S.end - Date.now()); S.phase = 'pause'; save(); M && M.stop(); doPause(); }
    else if (S.phase === 'pause') { S.end = Date.now() + S.left; S.phase = 'run'; save(); music(); work(); }
    renderCtl();
  };
  $('.sh-stop').onclick = () => {
    if (!confirm(tr(T.stopQ))) return;
    S.phase = 'idle'; S.run = null; save(); M && M.stop(); renderCtl(); idle();
  };
  const music = () => { if (M && track >= 0) M.play(track); };

  function start() {
    $('.sh-done').hidden = true;
    S.phase = 'run'; S.end = Date.now() + S.dur * 60000; S.run = null; save();
    music(); work(); renderCtl();
    if (info && info.me) post('shift/start', { min: S.dur }).then(r => { S.run = r.run; save(); }).catch(() => toast(tr(T.noSave)));
  }
  function finish() {
    S.phase = 'end'; save(); renderCtl(); document.title = '⏰ ' + baseTitle;
    doFinale();
    const box = $('.sh-done');
    const show = html => { box.innerHTML = `<b>🎉 ${tr(T.over)}</b><p>${html}</p>`; box.hidden = false; };
    if (!S.run) { show(info && info.me ? tr(T.good) : tr(T.guestDone)); return; }
    const run = S.run; S.run = null; save();
    post('shift/done', { run }).then(r => {
      info = Object.assign(info || {}, r, { me: true }); renderRank();
      if (r.promoted > 0) {
        const msg = `${tr(T.promo)} ${rankName(r.rank)}${r.got ? ` · +${r.got} 🔘` : ''}`;
        show(msg); toast('🪪 ' + msg);
        if (r.got && window.PPAccount && window.PPAccount.setButtons) window.PPAccount.setButtons(r.buttons);
      } else show(`${tr(T.good)} ${tr(T.toNext)} — ${60 - r.total % 60} ${tr(T.min)}.`);
    }).catch(e => show(e === 409 ? tr(T.good) : tr(T.noSave)));
  }

  // ---------- сцена ----------
  const IMG = {}, FLOOR = 238, DESK = { x: 305, y: 201 }, BIN = { x: 239, y: 208 };
  let SH = null; // polly.json
  const P = { x: DESK.x, y: DESK.y, face: 1, frames: ['stand'], ms: 400, behind: true, bob: 0 };
  const fx = { lines: 0, flash: 0, drawer: 0, tilt: [0, 0, 0], tilt0: [0, 0, 0], balls: 0, tie: null, guitar: false };
  let parts = [], cap = '', finale = false, gen = 0;
  const STOP = {};
  const setCap = k => { cap = tr(DO[k]); $('.sh-cap').textContent = cap; };
  const sleep = (ms, my) => new Promise((ok, no) => setTimeout(() => my !== gen ? no(STOP) : ok(), ms));
  const anim = (frames, ms = 400) => { P.frames = frames; P.ms = ms; };
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  // перелёт/шаги: каждые 30 мс к цели; my — поколение сценария (новое — старый сценарий останавливается)
  function moveTo(x, y, my, fly) {
    anim(fly ? ['fly1', 'fly2'] : ['walk1', 'walk2'], fly ? 130 : 170);
    if (Math.abs(x - P.x) > 1) P.face = x > P.x ? 1 : -1;
    const sp = fly ? 2.4 : 1.5;
    return new Promise((ok, no) => {
      const step = () => {
        if (my !== gen) return no(STOP);
        const dx = x - P.x, dy = y - P.y, d = Math.hypot(dx, dy);
        if (d <= sp) { P.x = x; P.y = y; anim(['stand']); return ok(); }
        P.x += dx / d * sp; P.y += dy / d * sp; setTimeout(step, 30);
      };
      step();
    });
  }
  const atDesk = () => P.behind && P.x === DESK.x && P.y === DESK.y;
  async function leaveDesk(my) {
    if (!P.behind) return;
    await moveTo(P.x, 150, my, true); P.behind = false;
  }
  async function toFloor(x, my) {
    await leaveDesk(my);
    if (P.y !== FLOOR) await moveTo(P.y < FLOOR - 40 ? x : P.x, FLOOR, my, true);
    await moveTo(x, FLOOR, my);
  }
  async function toAir(x, y, my) { await leaveDesk(my); await moveTo(x, y, my, true); }
  async function toDesk(my) {
    if (atDesk()) return;
    if (P.behind) { await moveTo(DESK.x, DESK.y, my, true); return; }
    if (P.y === FLOOR) await moveTo(DESK.x, FLOOR, my);
    await moveTo(DESK.x, 150, my, true); P.behind = true;
    await moveTo(DESK.x, DESK.y, my, true); P.face = 1; anim(['stand']);
  }
  // точка в координатах офисного спрайта (клюв, крыло) → сцена
  const at = (ox, oy) => ({ x: P.x + (ox - 25) * P.face, y: P.y + oy - 101 });

  // дела: каждое — async (my, сколько мс)
  const ACTS = {
    async type(my, ms) {
      await toDesk(my); setCap('type'); anim(['type1', 'type2'], 170);
      const end = Date.now() + ms;
      while (Date.now() < end) { await sleep(rnd(1500, 3500), my); fx.lines = (fx.lines + 1) % 9; if (Math.random() < 0.25) { anim(['blink'], 400); await sleep(500, my); anim(['type1', 'type2'], 170); } }
    },
    async coffee(my, ms) {
      await toDesk(my); setCap('coffee');
      const end = Date.now() + ms;
      while (Date.now() < end) { anim(['coffee1']); await sleep(1600, my); anim(['coffee2']); for (let i = 0; i < 3; i++) { steam(at(39, 40)); await sleep(800, my); } }
    },
    async lunch(my, ms) {
      await toDesk(my); setCap('lunch'); anim(['lunch1', 'lunch2'], 550); await sleep(ms, my);
    },
    async water(my, ms) {
      await toFloor(184, my); P.face = -1; setCap('water');
      const end = Date.now() + ms;
      while (Date.now() < end) { anim(['water2']); for (let i = 0; i < 4; i++) { bubble(); await sleep(300, my); } anim(['water1']); await sleep(1500, my); }
    },
    async stretch(my, ms) {
      await toFloor(pick([200, 220, 260]), my); P.face = pick([1, -1]); setCap('stretch'); anim(['stretch1', 'stretch2'], 900); await sleep(ms, my);
    },
    async copy(my, ms) {
      await toFloor(95, my); P.face = -1; setCap('copy'); anim(['copy1', 'copy2'], 320);
      const end = Date.now() + ms * 0.6;
      while (Date.now() < end) { fx.flash = Date.now(); await sleep(1400, my); sheet(74, 190, 1.2, -0.3); await sleep(700, my); }
      await toFloor(140, my); P.face = -1; anim(['copy1', 'copy2'], 320);
      for (let i = 0; i < 3; i++) { await sleep(1200, my); sheet(99, 178, 0.4, -1.4); }
      await sleep(ms * 0.2, my);
    },
    async folder(my, ms) {
      await toFloor(406, my); P.face = 1; setCap('folder'); fx.drawer = 1; anim(['folder1', 'folder2'], 700);
      const end = Date.now() + ms;
      try { while (Date.now() < end) { await sleep(rnd(1200, 2200), my); const p = at(40, 40); sheet(p.x, p.y, rnd(-1, 1), -1.8); } } finally { fx.drawer = 0; }
    },
    async plant(my, ms) {
      await toAir(419, 154, my); P.face = 1; setCap('plant'); anim(['can1']); await sleep(600, my); anim(['can2']);
      const end = Date.now() + ms;
      while (Date.now() < end) { const p = at(61, 39); drop(p.x, p.y); await sleep(160, my); }
      anim(['can1']); await sleep(500, my); await moveTo(419, FLOOR, my, true); anim(['stand']);
    },
    async diploma(my, ms) {
      const i = Math.floor(Math.random() * 3), yc = [41, 73, 105][i];
      fx.tilt[i] = fx.tilt0[i] = pick([-1, 1]) * rnd(0.12, 0.2);
      await toAir(168, yc + 84, my); P.face = 1; setCap('diploma'); anim(['adjust1', 'adjust2'], 380);
      const t0 = Date.now(), dur = Math.max(2500, ms);
      while (Date.now() - t0 < dur) { const k = (Date.now() - t0) / dur; fx.tilt[i] = fx.tilt0[i] * (1 - k) * Math.cos(k * 12); await sleep(60, my); }
      fx.tilt[i] = 0; anim(['fly1', 'fly2'], 130); await sleep(500, my); await moveTo(168, FLOOR, my, true);
    },
    async toss(my) {
      await toFloor(184, my); P.face = 1; setCap('toss');
      for (let n = 0; n < 2; n++) { anim(['throw1']); await sleep(1100, my); anim(['throw2']); const p = at(3, 28); ball(p.x, p.y); await sleep(1500, my); }
    },
  };
  const DBG = new URLSearchParams(location.search).get('act');
  const OTHER = ['coffee', 'lunch', 'water', 'stretch', 'copy', 'folder', 'plant', 'diploma', 'toss'];

  async function work() {
    const my = ++gen; finale = false; fx.guitar = false; fx.tie = null;
    let bag = [];
    try {
      while (true) {
        if (ACTS[DBG]) { await ACTS[DBG](my, 15000); continue; } // проверка: /shift/?act=plant
        await ACTS.type(my, rnd(25000, 50000));
        if (!bag.length) bag = OTHER.slice().sort(() => Math.random() - 0.5);
        const k = bag.pop(); await ACTS[k](my, rnd(12000, 22000));
      }
    } catch (e) { if (e !== STOP) throw e; }
  }
  async function doPause() {
    const my = ++gen;
    try { await toDesk(my); setCap('pause'); while (true) { anim(['coffee1']); await sleep(1800, my); anim(['coffee2']); steam(at(39, 40)); await sleep(1600, my); } } catch (e) { if (e !== STOP) throw e; }
  }
  async function idle() {
    const my = ++gen; finale = false; fx.guitar = false; fx.tie = null;
    try {
      await toDesk(my); setCap('wait');
      while (true) { anim(['stand']); await sleep(rnd(2000, 4000), my); anim(['blink']); await sleep(250, my); if (Math.random() < 0.3) { anim(['type1', 'type2'], 170); await sleep(2500, my); } }
    } catch (e) { if (e !== STOP) throw e; }
  }
  async function doFinale() {
    const my = ++gen; finale = true;
    try {
      M && M.stop();
      if (P.behind) await leaveDesk(my);
      await toFloor(200, my); P.face = 1; anim(['stand']); setCap('tie'); await sleep(700, my);
      anim(['riptie']); const p = at(64, 10); fx.tie = { x: p.x, y: p.y, vx: 1.6, vy: -2.4, r: 0, land: FLOOR - 4 }; await sleep(900, my);
      anim(['notie']); await sleep(900, my);
      sparkle(P.x - 10, P.y - 60); fx.guitar = true; setCap('rock'); anim(['guitar1', 'guitar2'], 260);
      const long = M ? new Promise(ok => M.lullaby(2, ok)) : sleep(20000, my);
      let playing = true; long.then(() => { playing = false; });
      while (playing) { note(); await sleep(rnd(500, 900), my); }
      if (my !== gen) return;
      fx.guitar = false; anim(['sleep']); setCap('sleep');
      while (true) { zz(); await sleep(1400, my); }
    } catch (e) { if (e !== STOP) throw e; }
  }

  // частицы: {x, y, vx, vy, g, life, kind}
  const add = o => parts.push(Object.assign({ vx: 0, vy: 0, g: 0, life: 60, t: 0 }, o));
  const steam = p => add({ x: p.x + rnd(-2, 2), y: p.y, vy: -0.35, life: 50, kind: 'steam' });
  const bubble = () => add({ x: 143 + rnd(-6, 6), y: 122, vy: -0.6, life: 50, kind: 'bubble' });
  const sheet = (x, y, vx, vy) => add({ x, y, vx, vy, g: 0.05, life: 70, kind: 'sheet' });
  const drop = (x, y) => add({ x: x + rnd(-1, 1), y, vx: 0.2, vy: 0.5, g: 0.15, life: 30, kind: 'drop' });
  const sparkle = (x, y) => { for (let i = 0; i < 10; i++) add({ x, y, vx: rnd(-1.5, 1.5), vy: rnd(-1.5, 1), life: 30, kind: 'spark' }); };
  const note = () => add({ x: P.x + rnd(10, 30), y: P.y - 70, vx: rnd(0.2, 0.6), vy: -0.6, life: 80, kind: Math.random() < 0.5 ? 'note' : 'note2' });
  const zz = () => add({ x: P.x + 14, y: P.y - 100, vx: 0.3, vy: -0.4, life: 70, kind: 'zz' });
  function ball(x, y) {
    // дуга к урне за ~40 кадров
    const n = 40, vx = (BIN.x - x) / n, vy = (BIN.y - y) / n - 0.5 * 0.25 * n;
    add({ x, y, vx, vy, g: 0.25, life: n, kind: 'ball', onEnd: () => { fx.balls = Math.min(4, fx.balls + 1); } });
  }

  // таймер на столе: шрифт 3×5 (как в tools/rooms/kit.py)
  const F3 = { 0: '111101101101111', 1: '010110010010111', 2: '111001111100111', 3: '111001111001111', 4: '101101111001001', 5: '111100111001111', 6: '111100111101111', 7: '111001010010010', 8: '111101111101111', 9: '111101111001111', ':': '000010000010000' };
  function deskTimer() {
    const ms = leftMs(), s = Math.ceil(ms / 1000), h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60;
    const txt = h ? `${h}:${String(m).padStart(2, '0')}` : `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    const blink = S.phase === 'pause' && Date.now() % 1000 < 500, x0 = 252, y0 = 130, w = txt.length * 4 + 5;
    g.fillStyle = '#1a1528'; g.fillRect(x0 - 1, y0 - 1, w + 2, 14);
    g.fillStyle = S.phase === 'end' ? '#e0384a' : '#d8d0c0'; g.fillRect(x0, y0, w, 12);
    g.fillStyle = '#20302a'; g.fillRect(x0 + 2, y0 + 2, w - 4, 8);
    g.fillStyle = '#1a1528'; g.fillRect(x0 + 2, y0 + 12, 3, 2); g.fillRect(x0 + w - 5, y0 + 12, 3, 2);
    if (blink) return;
    g.fillStyle = S.phase === 'end' && Date.now() % 600 < 300 ? '#ffd060' : '#8cf0a8';
    [...txt].forEach((ch, i) => { const f = F3[ch]; if (f) for (let j = 0; j < 15; j++) if (f[j] === '1') g.fillRect(x0 + 3 + i * 4 + j % 3, y0 + 3 + Math.floor(j / 3), 1, 1); });
  }
  function sprite(name, x, y, flip) {
    const f = SH.f[name]; if (!f) return;
    const dx = Math.round(x) - (flip ? SH.fw - SH.fx : SH.fx), dy = Math.round(y) - SH.fy;
    if (flip) { g.save(); g.translate(dx + SH.fw, dy); g.scale(-1, 1); g.drawImage(IMG.p, f[0], f[1], SH.fw, SH.fh, 0, 0, SH.fw, SH.fh); g.restore(); }
    else g.drawImage(IMG.p, f[0], f[1], SH.fw, SH.fh, dx, dy, SH.fw, SH.fh);
  }
  function prop(name, x, y) { const p = SH.p[name]; if (p) g.drawImage(IMG.p, p[0], p[1], p[2], p[3], Math.round(x - p[2] / 2), Math.round(y - p[3] / 2), p[2], p[3]); }
  function drawPolly(t) {
    const fr = P.frames[Math.floor(t / P.ms) % P.frames.length];
    const hover = P.y < FLOOR - 20 && !P.behind && /^(can|adjust)/.test(fr) ? Math.round(Math.sin(t / 180) * 1.5) : 0;
    sprite(fr, P.x, P.y + hover, P.face < 0);
  }
  function draw(t) {
    g.drawImage(IMG.bg, 0, 0);
    // кривые дипломы: кусок стены поверх и повёрнутая рамка
    fx.tilt.forEach((a, i) => {
      if (!a) return; const y0 = [28, 60, 92][i];
      g.fillStyle = '#d6c8a8'; g.fillRect(195, y0 - 1, 37, 29);
      g.save(); g.translate(213, y0 + 2); g.rotate(a); g.drawImage(IMG.bg, 195, y0 - 1, 37, 29, -18, -3, 37, 29); g.restore();
    });
    if (fx.drawer) { g.fillStyle = '#1a1528'; g.fillRect(434, 157, 42, 18); g.fillStyle = '#a4aea4'; g.fillRect(435, 158, 40, 16); g.fillStyle = '#e0d8b0'; for (let i = 0; i < 5; i++) g.fillRect(437 + i * 7, 154 + (i % 2), 5, 5); g.fillStyle = '#dcdcd2'; g.fillRect(446, 165, 10, 1); }
    if (fx.flash) { const k = (Date.now() - fx.flash) / 900; if (k < 1) { g.fillStyle = 'rgba(200,255,220,0.85)'; g.fillRect(8 + Math.round(k * 54), 160, 4, 4); } }
    for (let i = 0; i < fx.balls; i++) prop('ball', 234 + i * 3.5, 205 - (i % 2) * 2);
    if (P.behind) drawPolly(t);
    g.drawImage(IMG.desk, 0, 0);
    // текст на мониторе растёт, пока Полли печатает
    g.fillStyle = '#78dca0'; for (let i = 0; i < fx.lines; i++) g.fillRect(338, 124 + i * 3, 6 + (i * 13) % 30, 1);
    if (fx.lines && Date.now() % 800 < 400) { g.fillStyle = '#e6f0fa'; g.fillRect(338 + 6 + ((fx.lines - 1) * 13) % 30 + 1, 123 + (fx.lines - 1) * 3, 2, 3); }
    deskTimer();
    if (fx.tie) prop('tie', fx.tie.x, fx.tie.y);
    if (!P.behind) drawPolly(t);
    parts.forEach(p => {
      if (p.kind === 'steam') { g.fillStyle = `rgba(255,255,255,${0.8 * (1 - p.t / p.life)})`; g.fillRect(Math.round(p.x + Math.sin(p.t / 6) * 1.5), Math.round(p.y), 1, 2); }
      else if (p.kind === 'bubble') { g.fillStyle = '#e8f6ff'; g.fillRect(Math.round(p.x), Math.round(p.y), 2, 2); }
      else if (p.kind === 'spark') { g.fillStyle = '#ffd060'; g.fillRect(Math.round(p.x), Math.round(p.y), 2, 2); }
      else prop(p.kind, p.x, p.y);
    });
  }
  function stepParts() {
    parts.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += p.g; p.t++; if (p.kind === 'bubble' && p.y < 92) p.t = p.life; });
    parts = parts.filter(p => { if (p.t < p.life) return true; p.onEnd && p.onEnd(); return false; });
    const tie = fx.tie; if (tie && tie.y < tie.land) { tie.x += tie.vx; tie.y = Math.min(tie.land, tie.y + tie.vy); tie.vy += 0.15; }
  }
  let last = 0;
  function frame(t) {
    if (t - last > 33) { last = t; stepParts(); if (SH) draw(t); }
    requestAnimationFrame(frame);
  }
  // часы: каждые 250 мс; в фоне вкладки — реже, но время считается от S.end
  setInterval(() => {
    const ms = leftMs();
    $('.sh-left').textContent = fmt(ms);
    $('.sh-sub').textContent = S.phase === 'pause' ? tr(T.paused) : S.phase === 'run' ? tr(T.left) : S.phase === 'end' ? tr(T.over) : durLabel(S.dur);
    if (S.phase === 'run') { document.title = fmt(ms) + ' · ' + baseTitle; if (ms <= 0) finish(); }
    else if (S.phase !== 'end') document.title = baseTitle;
  }, 250);

  const img = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
  Promise.all([img('/images/shift/office.png'), img('/images/shift/desk.png'), img('/images/shift/polly.png'), fetch('/images/shift/polly.json').then(r => r.json())])
    .then(([bg, desk, p, sh]) => { IMG.bg = bg; IMG.desk = desk; IMG.p = p; SH = sh; requestAnimationFrame(frame); })
    .catch(() => { $('.sh-scene').hidden = true; });

  renderCtl(); load();
  if (S.phase === 'run' && S.end <= Date.now()) finish();
  else if (S.phase === 'run') { work(); music(); }
  else if (S.phase === 'pause') doPause();
  else { if (S.phase === 'end') { S.phase = 'idle'; save(); renderCtl(); } idle(); }
})();
