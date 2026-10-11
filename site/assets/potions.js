// «Зельеварня Полли» (/potions/, вкладка в «Играть»): Полли готовится к Хеллоуину. Птичка проходит лабиринты и собирает
// ингредиенты, потом варит из трёх ингредиентов зелья — рецепты открываются методом проб и ошибок.
// Лабиринт: бесконечные уровни (растёт размер, привидения, проклятия). Проклятие тумана — видно только рядом с собой;
// бонусы: 🏮 фонарь (туман уходит), 👢 сапоги (быстрее), 🧲 магнит (ингредиенты сами летят), 🧿 оберег (привидения не трогают).
// Сервер (worker/index.js, /api/potion*) решает, какие ингредиенты в лабиринте, хранит сумку и книгу рецептов, платит пуговки.
(() => {
  const app = document.getElementById('potions');
  if (!app) return;
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0, pre = ['', '/ru', '/lv'][L];
  const T = {
    title: ['Polly’s Potion Lab', 'Зельеварня Полли', 'Pollijas dziru virtuve'],
    tabMaze: ['🗺 Maze', '🗺 Лабиринт', '🗺 Labirints'], tabPot: ['🧪 Cauldron', '🧪 Котёл', '🧪 Katls'], tabBook: ['📖 Recipes', '📖 Рецепты', '📖 Receptes'],
    login: ['Sign in to walk the mazes, brew potions and earn buttons.', 'Войдите, чтобы ходить по лабиринтам, варить зелья и получать пуговки.', 'Ienāc, lai staigātu pa labirintiem, vārītu dziras un saņemtu pogas.'],
    signin: ['Sign in', 'Войти', 'Ienākt'],
    lv: ['Level', 'Уровень', 'Līmenis'],
    how: ['Swipe on the maze (or use the arrows) and your bird runs until the next turn. Collect the ingredients and find the 🚪 door.', 'Проведи пальцем по лабиринту (или жми стрелки) — птичка бежит до поворота. Собери ингредиенты и найди дверь 🚪.', 'Velc ar pirkstu pa labirintu (vai spied bultiņas) — putniņš skrien līdz pagriezienam. Savāc sastāvdaļas un atrodi durvis 🚪.'],
    go: ['▶ Go!', '▶ Вперёд!', '▶ Aiziet!'],
    fog: ['🌫 Fog curse: you only see what is close to you.', '🌫 Проклятие тумана: видно только то, что рядом.', '🌫 Miglas lāsts: redzams tikai tas, kas tuvumā.'],
    ghosts: [n => `👻 Ghosts: ${n}. They steal ingredients!`, n => `👻 Привидений: ${n}. Они воруют ингредиенты!`, n => `👻 Spoki: ${n}. Viņi zog sastāvdaļas!`],
    skulls: ['💀 Cursed skulls lie around: touch one and the fog comes.', '💀 Повсюду проклятые черепа: заденешь — придёт туман.', '💀 Apkārt nolādēti galvaskausi: pieskaries — nāks migla.'],
    items: [n => `Ingredients in this maze: ${n}`, n => `Ингредиентов в лабиринте: ${n}`, n => `Sastāvdaļas labirintā: ${n}`],
    done: [n => `Level ${n} passed!`, n => `Уровень ${n} пройден!`, n => `${n}. līmenis pārvarēts!`],
    gotIngs: ['You found:', 'Найдено:', 'Atrasts:'], gotNone: ['No ingredients this time.', 'В этот раз без ингредиентов.', 'Šoreiz bez sastāvdaļām.'],
    next: ['Next maze →', 'Следующий лабиринт →', 'Nākamais labirints →'], toPot: ['🧪 To the cauldron', '🧪 К котлу', '🧪 Pie katla'],
    checking: ['Checking the maze…', 'Проверяем лабиринт…', 'Pārbaudām labirintu…'],
    saveErr: ['Could not save the level. Try again.', 'Не получилось сохранить уровень. Попробуй ещё раз.', 'Neizdevās saglabāt līmeni. Mēģini vēlreiz.'],
    stolen: [e => `A ghost stole ${e}!`, e => `Привидение утащило ${e}!`, e => `Spoks nozaga ${e}!`],
    boo: ['Boo!', 'Бу!', 'Bū!'],
    cursed: ['🌫 Cursed! Fog…', '🌫 Проклятие! Туман…', '🌫 Lāsts! Migla…'],
    buff: { lantern: ['🏮 Lantern: the fog is gone', '🏮 Фонарь: туман рассеялся', '🏮 Laterna: migla izklīda'], boots: ['👢 Fast boots!', '👢 Сапоги-скороходы!', '👢 Ātrie zābaki!'],
      magnet: ['🧲 Magnet: ingredients fly to you', '🧲 Магнит: ингредиенты летят к тебе', '🧲 Magnēts: sastāvdaļas lido pie tevis'], amulet: ['🧿 Amulet: ghosts can’t touch you', '🧿 Оберег: привидения не трогают', '🧿 Amulets: spoki tev netiek klāt'] },
    bag: ['Your ingredients', 'Твои ингредиенты', 'Tavas sastāvdaļas'], bagEmpty: ['No ingredients yet: walk a maze!', 'Ингредиентов пока нет — пройди лабиринт!', 'Sastāvdaļu vēl nav — izej labirintu!'],
    pick3: ['Put three ingredients into the cauldron. Which ones work together? Nobody knows: try!', 'Положи в котёл три ингредиента. Какие сработают вместе — никто не знает: пробуй!', 'Ieliec katlā trīs sastāvdaļas. Kuras derēs kopā — neviens nezina: mēģini!'],
    hint: ['Rumour has it that sweet things make potions tastier…', 'Говорят, сладкое делает зелья вкуснее…', 'Runā, ka saldumi dziras padara garšīgākas…'],
    brew: ['🔥 Brew!', '🔥 Сварить!', '🔥 Vārīt!'], brewing: ['Bubbling…', 'Булькает…', 'Burbuļo…'],
    knownOk: ['📖 You have brewed this before:', '📖 Это уже варили:', '📖 Šo jau vārīji:'], knownBad: ['✗ You tried this already: it does not work.', '✗ Это уже пробовали — не работает.', '✗ Šo jau mēģināji — nedarbojas.'],
    tier: [['', 'Ordinary', 'Tasty', 'Taste of childhood'], ['', 'Обычное', 'Вкусное', 'Вкус детства'], ['', 'Parasta', 'Garšīga', 'Bērnības garša']],
    newPot: ['✨ New potion!', '✨ Новое зелье!', '✨ Jauna dzira!'], againPot: ['You brewed it again', 'Сварено ещё раз', 'Atkal izvārīta'],
    prop: ['Effect', 'Свойство', 'Īpašība'],
    plus: [n => `+${n} 🔘`, n => `+${n} 🔘`, n => `+${n} 🔘`], cap: ['Today’s potion buttons are collected: brew for the collection!', 'Пуговки за зелья на сегодня собраны — варим для коллекции!', 'Šodienas pogas par dzirām savāktas — vārām kolekcijai!'],
    fail: ['Nothing came out', 'Не получилось', 'Neizdevās'],
    ok: ['OK', 'Хорошо', 'Labi'], again: ['Brew more', 'Варить ещё', 'Vārīt vēl'],
    bookEmpty: ['The recipe book is empty. Brew something!', 'Книга рецептов пока пустая. Свари что-нибудь!', 'Recepšu grāmata ir tukša. Izvāri kaut ko!'],
    found: [n => `Potions discovered: ${n}`, n => `Открыто зелий: ${n}`, n => `Atklātas dziras: ${n}`],
    fails: ['Did not work:', 'Не сработало:', 'Nenostrādāja:'],
    pay: (r) => [`New potion: +${r.p1} 🔘 ordinary, +${r.p2} 🔘 tasty, +${r.p3} 🔘 taste of childhood. Brewing a known one again: +${r.again} 🔘.${r.max ? ` Up to ${r.max} 🔘 a day.` : ''}`,
      `Новое зелье: обычное +${r.p1} 🔘, вкусное +${r.p2} 🔘, вкус детства +${r.p3} 🔘. Повторное: +${r.again} 🔘.${r.max ? ` До ${r.max} 🔘 в день.` : ''}`,
      `Jauna dzira: parasta +${r.p1} 🔘, garšīga +${r.p2} 🔘, bērnības garša +${r.p3} 🔘. Atkārtota: +${r.again} 🔘.${r.max ? ` Līdz ${r.max} 🔘 dienā.` : ''}`][L],
    today: [(n, m) => `Today: ${n} of ${m} 🔘`, (n, m) => `Сегодня: ${n} из ${m} 🔘`, (n, m) => `Šodien: ${n} no ${m} 🔘`],
    badge: [n => `🏅 New achievement: “${n}”`, n => `🏅 Новое достижение: «${n}»`, n => `🏅 Jauns sasniegums: “${n}”`],
    noMix: ['(seasons don’t mix in one cauldron)', '(сезоны в одном котле не смешиваются)', '(sezonas vienā katlā nejaucas)'],
    shelf: ['🏠 The bottle is waiting in your bag: put it on a shelf in your room!', '🏠 Бутылочка ждёт в сумке — поставь её на полку в комнате!', '🏠 Pudelīte gaida somā — noliec to plauktā savā istabā!'],
    giveT: ['Give to a bird', 'Подарить птичке', 'Uzdāvināt putniņam'], giveN: ['How many', 'Сколько', 'Cik'], giveTo: ['To whom', 'Кому', 'Kam'], givePh: ['bird’s nickname', 'ник птички', 'putniņa segvārds'],
    giveBtn: ['🎁 Give', '🎁 Подарить', '🎁 Dāvināt'], cancel: ['Cancel', 'Отмена', 'Atcelt'], giveNo: ['There is no bird with this nickname.', 'Птички с таким ником нет.', 'Putniņa ar tādu segvārdu nav.'],
    given: [(e, n) => `${e} is on its way to @${n}!`, (e, n) => `${e} летит к @${n}!`, (e, n) => `${e} lido pie @${n}!`],
    gotGift: [(n, e) => `🎁 @${n} gave you ${e}`, (n, e) => `🎁 @${n} подарил(а) тебе ${e}`, (n, e) => `🎁 @${n} tev uzdāvināja ${e}`],
    pause: ['Pause', 'Пауза', 'Pauze'], resume: ['▶ Continue', '▶ Продолжить', '▶ Turpināt'],
  };
  const t = (k, ...a) => { const v = T[k][L]; return typeof v === 'function' ? v(...a) : v; };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const post = (path, body) => fetch('/api/' + path, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}) })
    .then(async r => r.ok ? r.json() : Promise.reject(r.status));
  const toast = m => window.PPToast ? window.PPToast(m) : null;

  // ингредиенты, имена зелий и бутылочки — в potion-names.js (window.PPPotion)
  const { ING, IG, SEASON_INFO, FAILS, potion, bottle, L2 } = window.PPPotion;
  const seasonOfCombo = c => IG[c.split('+')[0]].s;

  // ---------- состояние ----------
  let S = null, tab = 'maze';
  app.innerHTML = `<div class="pot-bar"></div><div class="pot-tabs" role="tablist">${['maze', 'pot', 'book'].map(k => `<button type="button" role="tab" data-tab="${k}">${t({ maze: 'tabMaze', pot: 'tabPot', book: 'tabBook' }[k])}</button>`).join('')}</div>
    <div class="pot-view pot-maze"><div class="pot-stage"><canvas class="pot-cv"></canvas><button type="button" class="pot-pause" hidden>❚❚</button><div class="pot-ov"></div></div>
      <div class="pot-pad" aria-hidden="true"><button type="button" data-d="0,-1">▲</button><button type="button" data-d="-1,0">◀</button><button type="button" data-d="0,1">▼</button><button type="button" data-d="1,0">▶</button></div></div>
    <div class="pot-view pot-pot" hidden></div><div class="pot-view pot-book" hidden></div>`;
  const bar = app.querySelector('.pot-bar'), cv = app.querySelector('.pot-cv'), ov = app.querySelector('.pot-ov'), stage = app.querySelector('.pot-stage'), pauseBtn = app.querySelector('.pot-pause');
  const ctx = cv.getContext('2d');
  const badgeName = k => ({ maze: ['Maze walker', 'Лабиринтоход', 'Labirintu gājējs'], pot1: ['First potion', 'Первое зелье', 'Pirmā dzira'], pot2: ['Young alchemist', 'Юный алхимик', 'Jaunais alķīmiķis'],
    pot3: ['Cauldron master', 'Мастер котла', 'Katla meistars'], potkid: ['Taste of childhood', 'Вкус детства', 'Bērnības garša'] }[k] || [k, k, k])[L];
  const showBadges = bs => (bs || []).forEach((k, i) => setTimeout(() => toast(t('badge', badgeName(k))), 400 + i * 1600));

  function drawBar() {
    if (!S || !S.me) { bar.innerHTML = ''; return; }
    const n = Object.values(S.inv).reduce((a, b) => a + b, 0);
    const si = SEASON_INFO[S.season] || SEASON_INFO.autumn;
    bar.innerHTML = `<span>${si.e} ${si.n[L]}</span><span>🗺 ${t('lv')} <b>${S.level}</b></span><span>🎒 <b>${n}</b></span>${S.rules.on && S.rules.max > 0 ? `<span>${t('today', S.today, S.rules.max)}</span>` : ''}`;
  }
  function showTab(k) {
    tab = k;
    app.querySelectorAll('[data-tab]').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === k));
    app.querySelectorAll('.pot-view').forEach(v => { v.hidden = !v.classList.contains('pot-' + k); });
    if (k !== 'maze' && state === 'play') pause();
    if (k === 'pot') drawPot(); if (k === 'book') drawBook(); if (k === 'maze') fit();
  }
  app.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => showTab(b.dataset.tab));

  // ======================= ЛАБИРИНТ =======================
  const rngOf = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let x = Math.imul(seed ^ seed >>> 15, 1 | seed); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; };
  const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  let M = null, state = 'idle', run = null, last = 0, scale = 1, cell = 30, frames = [], fx = [];
  const VW = 360, VH = 520;
  // уровень → лабиринт (размер, стены), привидения, проклятие, бонусы; всё из seed — одинаково при каждом построении
  function build(level, seed, items) {
    const r = rngOf(seed), cols = Math.min(13, 5 + Math.floor((level + 1) / 2)), rows = Math.min(18, cols + 2 + Math.floor(level / 4));
    const W = []; for (let y = 0; y < rows; y++) { W.push([]); for (let x = 0; x < cols; x++) W[y].push([1, 1, 1, 1]); } // стены: верх, право, низ, лево
    const seen = W.map(row => row.map(() => false)), st = [[0, rows - 1]]; seen[rows - 1][0] = true;
    while (st.length) {
      const [x, y] = st[st.length - 1], nb = DIRS.map((d, i) => [x + d[0], y + d[1], i]).filter(([a, b]) => a >= 0 && b >= 0 && a < cols && b < rows && !seen[b][a]);
      if (!nb.length) { st.pop(); continue; }
      const [a, b, i] = nb[Math.floor(r() * nb.length)];
      W[y][x][i] = 0; W[b][a][(i + 2) % 4] = 0; seen[b][a] = true; st.push([a, b]);
    }
    // немного петель: в части тупиков убрать стенку — есть куда убежать от привидения
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      if (W[y][x].reduce((a, b) => a + b, 0) === 3 && r() < 0.35) {
        const opts = [0, 1, 2, 3].filter(i => W[y][x][i] && x + DIRS[i][0] >= 0 && y + DIRS[i][1] >= 0 && x + DIRS[i][0] < cols && y + DIRS[i][1] < rows);
        if (opts.length) { const i = opts[Math.floor(r() * opts.length)]; W[y][x][i] = 0; W[y + DIRS[i][1]][x + DIRS[i][0]][(i + 2) % 4] = 0; }
      }
    }
    const dist = bfs(W, cols, rows, 0, rows - 1);
    let ex = [0, 0], far = -1; for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) if (dist[y][x] > far) { far = dist[y][x]; ex = [x, y]; }
    const free = []; for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) if (dist[y][x] >= 2 && !(x === ex[0] && y === ex[1])) free.push([x, y]);
    for (let i = free.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [free[i], free[j]] = [free[j], free[i]]; }
    const take = () => free.pop() || [Math.floor(r() * cols), Math.floor(r() * rows)];
    const things = items.map((id, i) => ({ k: 'ing', id, i, x: 0, y: 0 })).map(o => { const [x, y] = take(); return { ...o, x, y }; });
    const nb = level >= 2 ? 1 + (r() < 0.45 ? 1 : 0) : 0, BUFFS = ['lantern', 'boots', 'magnet', 'amulet'];
    for (let i = 0; i < nb; i++) { const [x, y] = take(); things.push({ k: 'buff', id: BUFFS[Math.floor(r() * BUFFS.length)], x, y }); }
    const fog = level >= 3 && r() < Math.min(0.6, 0.15 + 0.04 * level);
    const ns = level >= 5 ? Math.min(3, Math.floor((level - 3) / 4)) : 0;
    for (let i = 0; i < ns; i++) { const [x, y] = take(); things.push({ k: 'skull', x, y }); }
    const ng = level >= 3 ? Math.min(4, 1 + Math.floor((level - 3) / 4)) : 0, ghosts = [];
    const farCells = []; for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) if (dist[y][x] >= Math.min(6, far - 1)) farCells.push([x, y]);
    for (let i = 0; i < ng; i++) { const [x, y] = farCells[Math.floor(r() * farCells.length)] || ex; const gs = Math.min(4.2, 2.2 + 0.08 * level); ghosts.push(Object.assign(mover(x, y, gs), { base: gs })); }
    return { level, cols, rows, W, ex, things, fog, ghosts, r, p: mover(0, rows - 1, 4.6), got: [], buffs: {}, stun: 0, time: 0, want: null, ns };
  }
  function bfs(W, cols, rows, sx, sy) {
    const d = W.map(row => row.map(() => -1)); d[sy][sx] = 0; const q = [[sx, sy]];
    while (q.length) { const [x, y] = q.shift(); W[y][x].forEach((w, i) => { if (w) return; const a = x + DIRS[i][0], b = y + DIRS[i][1]; if (d[b][a] < 0) { d[b][a] = d[y][x] + 1; q.push([a, b]); } }); }
    return d;
  }
  // движение по клеткам: from → to, t от 0 до 1; dir — номер направления (0 верх, 1 право, 2 низ, 3 лево)
  const mover = (x, y, speed) => ({ fx: x, fy: y, tx: x, ty: y, t: 1, dir: null, speed, face: 1 });
  const pos = m => [m.fx + (m.tx - m.fx) * m.t, m.fy + (m.ty - m.fy) * m.t];
  const open = (x, y, d) => d != null && !M.W[y][x][d];
  function step(m, dt, choose) {
    let left = m.speed * dt;
    while (left > 0) {
      if (m.t >= 1) {
        m.fx = m.tx; m.fy = m.ty; m.t = 1;
        const nd = choose(m); if (nd == null) { m.dir = null; return; }
        m.dir = nd; m.tx = m.fx + DIRS[nd][0]; m.ty = m.fy + DIRS[nd][1]; m.t = 0;
        if (DIRS[nd][0]) m.face = DIRS[nd][0];
      }
      const d = Math.min(left, 1 - m.t); m.t += d; left -= d;
      if (m.t >= 1 && m.onCell) m.onCell(m.tx, m.ty);
    }
  }
  // игрок: на перекрёстке поворачивает, куда просили, иначе бежит прямо до стены
  const choosePlayer = m => open(m.fx, m.fy, M.want) ? M.want : open(m.fx, m.fy, m.dir) ? m.dir : null;
  function reverse(m) { if (m.t < 1 && m.dir != null) { [m.fx, m.fy, m.tx, m.ty] = [m.tx, m.ty, m.fx, m.fy]; m.t = 1 - m.t; m.dir = (m.dir + 2) % 4; if (DIRS[m.dir][0]) m.face = DIRS[m.dir][0]; } }
  function setWant(d) {
    if (!M || state !== 'play') return;
    M.want = d; const p = M.p;
    if (p.dir != null && d === (p.dir + 2) % 4) reverse(p); // развернуться можно сразу, посреди коридора
  }
  // привидение: бродит, на развилках иногда поворачивает к птичке
  function chooseGhost(g) {
    const ds = [0, 1, 2, 3].filter(d => open(g.fx, g.fy, d)); if (!ds.length) return null;
    let c = ds.filter(d => g.dir == null || d !== (g.dir + 2) % 4); if (!c.length) c = ds;
    const [px, py] = pos(M.p), far = Math.abs(px - g.fx) + Math.abs(py - g.fy);
    if (far < 7 && M.r() < 0.45 && !M.buffs.amulet) { const best = c.slice().sort((a, b) => (Math.abs(px - g.fx - DIRS[a][0]) + Math.abs(py - g.fy - DIRS[a][1])) - (Math.abs(px - g.fx - DIRS[b][0]) + Math.abs(py - g.fy - DIRS[b][1])))[0]; return best; }
    return c[Math.floor(M.r() * c.length)];
  }
  function onPlayerCell(x, y) {
    for (const o of M.things) {
      if (o.taken || o.x !== x || o.y !== y) continue;
      if (o.k === 'ing') take(o);
      else if (o.k === 'buff') { o.taken = true; M.buffs[o.id] = o.id === 'lantern' ? 1e9 : o.id === 'boots' ? 8 : o.id === 'magnet' ? 12 : 10; if (o.id === 'lantern') M.fog = false; banner(T.buff[o.id][L]); }
      else if (o.k === 'skull' && !M.buffs.lantern) { o.taken = true; M.fog = true; banner(t('cursed')); M.shake = 0.3; }
    }
    if (x === M.ex[0] && y === M.ex[1]) finish();
  }
  function take(o) { o.taken = true; M.got.push(o.i); fxPop(o.x, o.y, IG[o.id].e); }
  function fxPop(x, y, txt) { fx.push({ x: x + 0.5, y: y + 0.5, txt, t: 0.9 }); }
  let ban = null; const banner = (txt, s = 1.8) => { ban = { txt, t: s }; };

  async function newLevel() {
    state = 'loading'; overlay(`<p>…</p>`);
    try { const r = await post('potion/level'); run = r; M = build(r.level, r.seed, r.items); M.season = r.season || S.season; if (r.season && r.season !== S.season) { S.season = r.season; drawBar(); } M.p.onCell = onPlayerCell; makeBird(); fit(); startCard(); }
    catch (e) { overlay(`<p>${t('saveErr')}</p><button type="button" class="pill-btn pill-fill" data-a="retry">↻</button>`); }
  }
  function startCard() {
    state = 'ready'; draw();
    const ng = M.ghosts.length, mods = [M.fog ? t('fog') : '', ng ? t('ghosts', ng) : '', M.ns ? t('skulls') : ''].filter(Boolean);
    overlay(`<h2>${t('lv')} ${M.level}</h2><p>${t('items', M.things.filter(o => o.k === 'ing').length)}</p>${mods.map(m => `<p class="pot-mod">${m}</p>`).join('')}<p class="pot-how">${t('how')}</p><button type="button" class="pill-btn pill-fill" data-a="go">${t('go')}</button>`);
  }
  function play() {
    state = 'play'; ov.hidden = true; pauseBtn.hidden = false; document.documentElement.classList.add('pot-on');
    const r = stage.getBoundingClientRect(); if (r.top < 60 || r.bottom > innerHeight) stage.scrollIntoView({ block: 'center' });
    last = performance.now(); requestAnimationFrame(loop);
  }
  function pause() { if (state !== 'play') return; state = 'pause'; overlay(`<h2>${t('pause')}</h2><button type="button" class="pill-btn pill-fill" data-a="resume">${t('resume')}</button>`); }
  async function finish() {
    if (state !== 'play') return;
    state = 'saving'; pauseBtn.hidden = true; document.documentElement.classList.remove('pot-on');
    const got = M.got.slice();
    overlay(`<p>${t('checking')}</p>`);
    for (let k = 0; k < 8; k++) {
      try {
        const r = await post('potion/done', { run: run.run, got });
        S.inv = r.inv; S.level = r.level; drawBar(); showBadges(r.badges);
        const list = r.got.length ? `<p class="pot-got">${r.got.map(id => `<span title="${esc(IG[id].n)}">${IG[id].e}</span>`).join('')}</p>` : `<p>${t('gotNone')}</p>`;
        state = 'done';
        overlay(`<h2>${t('done', M.level)}</h2>${r.got.length ? `<p>${t('gotIngs')}</p>` : ''}${list}<div class="pot-ov-btns"><button type="button" class="pill-btn" data-a="pot">${t('toPot')}</button><button type="button" class="pill-btn pill-fill" data-a="next">${t('next')}</button></div>`);
        return;
      } catch (e) { if (e === 429) { await new Promise(r => setTimeout(r, 1500)); continue; } break; }
    }
    state = 'done'; overlay(`<p>${t('saveErr')}</p><button type="button" class="pill-btn pill-fill" data-a="next">${t('next')}</button>`);
  }
  function overlay(html) { ov.hidden = false; ov.innerHTML = `<div class="pot-card">${html}</div>`; }
  ov.addEventListener('click', e => {
    const a = e.target.closest('[data-a]'); if (!a) return;
    const k = a.dataset.a;
    if (k === 'go') play(); else if (k === 'resume') { state = 'play'; ov.hidden = true; last = performance.now(); requestAnimationFrame(loop); }
    else if (k === 'next' || k === 'retry') newLevel(); else if (k === 'pot') { newLevel(); showTab('pot'); } else if (k === 'in') window.PPAccount && window.PPAccount.openSignIn();
  });

  function loop() {
    if (state !== 'play') return;
    const now = performance.now(), dt = Math.max(0, Math.min(0.05, (now - last) / 1000)); last = now;
    update(dt); draw();
    if (state === 'play') requestAnimationFrame(loop);
  }
  function update(dt) {
    M.time += dt; if (M.shake > 0) M.shake -= dt;
    for (const k of Object.keys(M.buffs)) { M.buffs[k] -= dt; if (M.buffs[k] <= 0) delete M.buffs[k]; }
    if (ban) { ban.t -= dt; if (ban.t <= 0) ban = null; }
    const p = M.p; p.speed = M.buffs.boots ? 7.5 : 4.6;
    if (M.stun > 0) M.stun -= dt; else step(p, dt, choosePlayer);
    const [px, py] = pos(p);
    if (M.buffs.magnet) for (const o of M.things) if (o.k === 'ing' && !o.taken && Math.hypot(o.x - px, o.y - py) < 2.3) take(o);
    for (const g of M.ghosts) {
      g.speed = M.buffs.amulet ? 1.8 : g.base;
      step(g, dt, chooseGhost);
      const [gx, gy] = pos(g);
      if (Math.hypot(gx - px, gy - py) < 0.6 && !g.cool) {
        g.cool = 1.5;
        if (!M.buffs.amulet) {
          M.stun = 0.7; M.shake = 0.3;
          const i = M.got.pop();
          if (i != null) { const o = M.things.find(z => z.k === 'ing' && z.i === i); const cells = []; for (let y = 0; y < M.rows; y++) for (let x = 0; x < M.cols; x++) if (Math.abs(x - px) + Math.abs(y - py) > 5) cells.push([x, y]);
            const c = cells[Math.floor(M.r() * cells.length)] || [o.x, o.y]; o.x = c[0]; o.y = c[1]; o.taken = false; banner(t('stolen', IG[o.id].e)); }
          else banner(t('boo'), 1);
        }
        // привидение улетает в дальний угол
        const far = []; for (let y = 0; y < M.rows; y++) for (let x = 0; x < M.cols; x++) if (Math.abs(x - px) + Math.abs(y - py) > 6) far.push([x, y]);
        const c = far[Math.floor(M.r() * far.length)]; if (c) Object.assign(g, { fx: c[0], fy: c[1], tx: c[0], ty: c[1], t: 1, dir: null });
      }
      if (g.cool) { g.cool -= dt; if (g.cool <= 0) g.cool = 0; }
    }
    for (const f of fx) { f.t -= dt; f.y -= 0.8 * dt; } fx = fx.filter(f => f.t > 0);
  }

  // ---------- рисование лабиринта ----------
  function makeBird() {
    const B = window.PPBirds; if (!B || !S || !S.me) return;
    try { frames = [0, 1].map(f => B.crop(B.spriteHD(B.dress(B.looks(S.me.id), S.me.avatar || {}), f))); } catch (e) { frames = []; }
  }
  function fit() {
    if (!M) { cv.width = cv.height = 1; return; }
    const maxW = Math.min(app.clientWidth || 360, 460), maxH = Math.max(340, window.innerHeight - 190);
    cell = Math.floor(Math.min(maxW / M.cols, maxH / (M.rows + 1.4)));
    const w = cell * M.cols, h = cell * (M.rows + 1.4), dpr = Math.min(3, window.devicePixelRatio || 1);
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); stage.style.width = w + 'px'; stage.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.imageSmoothingEnabled = false; draw();
  }
  const HUD = () => cell * 1.4;
  function emoji(e, x, y, s) { ctx.font = `${Math.round(s)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(e, x, y + 1); }
  function draw() {
    if (!M) return;
    const c = cell, top = HUD(), w = c * M.cols, h = c * M.rows;
    ctx.save();
    const SI = SEASON_INFO[M.season] || SEASON_INFO.autumn;
    ctx.fillStyle = SI.bg; ctx.fillRect(0, 0, w, top + h);
    if (M.shake > 0) ctx.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
    ctx.translate(0, top);
    // пол — шахматка, стены — толстые линии
    for (let y = 0; y < M.rows; y++) for (let x = 0; x < M.cols; x++) { ctx.fillStyle = (x + y) % 2 ? SI.f1 : SI.f2; ctx.fillRect(x * c, y * c, c, c); }
    ctx.fillStyle = '#5a3f8a'; ctx.globalAlpha = 0.9;
    ctx.fillRect(M.ex[0] * c + 2, M.ex[1] * c + 2, c - 4, c - 4); ctx.globalAlpha = 1;
    emoji('🚪', M.ex[0] * c + c / 2, M.ex[1] * c + c / 2, c * 0.72);
    const lw = Math.max(3, Math.round(c / 7));
    ctx.fillStyle = SI.wall;
    for (let y = 0; y < M.rows; y++) for (let x = 0; x < M.cols; x++) {
      const wl = M.W[y][x], X = x * c, Y = y * c;
      if (wl[0]) ctx.fillRect(X - lw / 2, Y - lw / 2, c + lw, lw); if (wl[3]) ctx.fillRect(X - lw / 2, Y - lw / 2, lw, c + lw);
      if (wl[1] && x === M.cols - 1) ctx.fillRect(X + c - lw / 2, Y - lw / 2, lw, c + lw); if (wl[2] && y === M.rows - 1) ctx.fillRect(X - lw / 2, Y + c - lw / 2, c + lw, lw);
    }
    const bob = Math.sin(M.time * 4) * c * 0.05;
    for (const o of M.things) {
      if (o.taken) continue;
      const X = o.x * c + c / 2, Y = o.y * c + c / 2;
      if (o.k === 'ing') { ctx.fillStyle = 'rgba(242,201,76,.18)'; ctx.beginPath(); ctx.arc(X, Y, c * 0.42, 0, 7); ctx.fill(); emoji(IG[o.id].e, X, Y + bob, c * 0.62); }
      else if (o.k === 'buff') { ctx.fillStyle = 'rgba(127,200,255,.22)'; ctx.beginPath(); ctx.arc(X, Y, c * 0.42, 0, 7); ctx.fill(); emoji({ lantern: '🏮', boots: '👢', magnet: '🧲', amulet: '🧿' }[o.id], X, Y - bob, c * 0.6); }
      else emoji('💀', X, Y, c * 0.55);
    }
    // птичка
    const [px, py] = pos(M.p), f = frames[M.p.t < 1 && M.stun <= 0 ? Math.floor(M.time * 8) % 2 : 0];
    ctx.save(); ctx.translate(px * c + c / 2, py * c + c / 2);
    if (M.stun > 0) ctx.rotate(Math.sin(M.time * 30) * 0.2);
    if (M.p.face < 0) ctx.scale(-1, 1);
    if (f) { const k = c * 0.9 / Math.max(f.width, f.height); ctx.drawImage(f, -f.width * k / 2, -f.height * k / 2, f.width * k, f.height * k); }
    else { ctx.fillStyle = '#7F81BF'; ctx.fillRect(-c * 0.3, -c * 0.3, c * 0.6, c * 0.6); }
    ctx.restore();
    if (M.buffs.amulet) { ctx.strokeStyle = 'rgba(120,190,255,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px * c + c / 2, py * c + c / 2, c * 0.55, 0, 7); ctx.stroke(); }
    for (const g of M.ghosts) { const [gx, gy] = pos(g); ctx.globalAlpha = M.buffs.amulet ? 0.45 : 0.92; emoji('👻', gx * c + c / 2, gy * c + c / 2 + Math.sin(M.time * 5 + gx) * c * 0.06, c * 0.72); ctx.globalAlpha = 1; }
    // туман: видно только круг вокруг птички
    if (M.fog) {
      const R = c * 2.6, cx = px * c + c / 2, cy = py * c + c / 2;
      ctx.fillStyle = 'rgba(14,9,26,.97)'; ctx.beginPath(); ctx.rect(-10, -10, w + 20, h + 20); ctx.moveTo(cx + R, cy); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill('evenodd');
      const g = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R); g.addColorStop(0, 'rgba(14,9,26,0)'); g.addColorStop(1, 'rgba(14,9,26,.95)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R + 1, 0, 7); ctx.fill();
    }
    ctx.textBaseline = 'alphabetic';
    for (const e of fx) { ctx.globalAlpha = Math.min(1, e.t * 1.6); emoji(e.txt, e.x * c, e.y * c, c * 0.8); } ctx.globalAlpha = 1;
    ctx.restore();
    // верхняя панель: уровень, что собрано, бонусы
    ctx.fillStyle = 'rgba(43,31,61,.95)'; ctx.fillRect(0, 0, w, top);
    ctx.fillStyle = '#fff'; ctx.font = `700 ${Math.round(top * 0.36)}px system-ui, sans-serif`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(t('lv') + ' ' + M.level, 8, top / 2);
    const ings = M.things.filter(o => o.k === 'ing'), es = Math.min(top * 0.5, (w * 0.62 - ctx.measureText(t('lv') + ' ' + M.level).width - 24) / Math.max(1, ings.length) / 1.1), x0 = ctx.measureText(t('lv') + ' ' + M.level).width + 16 + es / 2;
    ings.forEach((o, i) => { ctx.globalAlpha = M.got.includes(o.i) ? 1 : 0.28; emoji(IG[o.id].e, x0 + i * es * 1.1, top / 2, es); }); ctx.globalAlpha = 1;
    const bs = Object.keys(M.buffs).map(k => ({ lantern: '🏮', boots: '👢', magnet: '🧲', amulet: '🧿' }[k])).concat(M.fog ? ['🌫'] : []), bz = top * 0.45;
    bs.forEach((e, i) => emoji(e, w - 54 - i * bz * 1.1, top / 2, bz));
    if (ban) {
      ctx.globalAlpha = Math.min(1, ban.t * 2); let fs = Math.round(Math.max(14, c * 0.55)); ctx.font = `800 ${fs}px system-ui, sans-serif`;
      while (fs > 10 && ctx.measureText(ban.txt).width > w - 30) { fs--; ctx.font = `800 ${fs}px system-ui, sans-serif`; } ctx.textAlign = 'center';
      const tw = ctx.measureText(ban.txt).width + 24, bx = w / 2, by = top + h * 0.18;
      ctx.fillStyle = 'rgba(255,250,242,.94)'; ctx.fillRect(bx - tw / 2, by - c * 0.5, tw, c); ctx.fillStyle = '#2b1f3d'; ctx.fillText(ban.txt, bx, by + 1); ctx.globalAlpha = 1;
    }
  }

  // ---------- управление: свайп по полю, касание (в сторону от птички), стрелки, кнопки ----------
  const dirOf = (dx, dy) => Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0);
  let sw = null;
  cv.addEventListener('pointerdown', e => { if (state !== 'play') return; sw = { x: e.clientX, y: e.clientY, moved: false }; try { cv.setPointerCapture(e.pointerId); } catch (x) {} });
  cv.addEventListener('pointermove', e => { if (!sw || state !== 'play') return; const dx = e.clientX - sw.x, dy = e.clientY - sw.y; if (Math.hypot(dx, dy) > 18) { setWant(dirOf(dx, dy)); sw = { x: e.clientX, y: e.clientY, moved: true }; } });
  cv.addEventListener('pointerup', e => {
    if (!sw || state !== 'play') { sw = null; return; }
    if (!sw.moved) { const r = cv.getBoundingClientRect(), [px, py] = pos(M.p); setWant(dirOf(e.clientX - r.left - (px + 0.5) * cell, e.clientY - r.top - HUD() - (py + 0.5) * cell)); }
    sw = null;
  });
  addEventListener('keydown', e => {
    const k = { ArrowUp: 0, KeyW: 0, ArrowRight: 1, KeyD: 1, ArrowDown: 2, KeyS: 2, ArrowLeft: 3, KeyA: 3 }[e.code];
    if (k != null && state === 'play' && tab === 'maze') { setWant(k); e.preventDefault(); }
    if ((e.code === 'Escape' || e.code === 'Space') && tab === 'maze' && !e.target.closest('input, textarea')) { if (state === 'play') { pause(); e.preventDefault(); } else if (state === 'pause') { e.preventDefault(); ov.querySelector('[data-a=resume]').click(); } }
  });
  app.querySelectorAll('.pot-pad [data-d]').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); const [dx, dy] = b.dataset.d.split(',').map(Number); setWant(dirOf(dx, dy)); }));
  pauseBtn.onclick = pause;
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  addEventListener('resize', () => { if (tab === 'maze') fit(); });

  // ======================= КОТЁЛ =======================
  let slots = [], brewing = false;
  const comboKey = ids => ids.slice().sort((a, b) => ING.findIndex(r => r[0] === a) - ING.findIndex(r => r[0] === b)).join('+');
  function drawPot(result) {
    const v = app.querySelector('.pot-pot');
    if (!S || !S.me) { v.innerHTML = `<p class="pot-login">${t('login')} <button type="button" class="pill-btn" data-a2="in">${t('signin')}</button></p>`; return; }
    const left = { ...S.inv }; slots.forEach(id => { left[id]--; });
    const items = ING.filter(r => S.inv[r[0]] > 0);
    const known = slots.length === 3 ? S.book.find(b => b.combo === comboKey(slots)) : null, slotSeason = slots.length ? IG[slots[0]].s : null;
    v.innerHTML = `<p class="pot-lead">${t('pick3')} <small>${t('hint')}</small></p>
      <div class="pot-cauldron${brewing ? ' brewing' : ''}"><div class="pot-slots">${[0, 1, 2].map(i => slots[i] ? `<button type="button" class="pot-slot on" data-slot="${i}" title="${esc(IG[slots[i]].n)}">${IG[slots[i]].e}</button>` : `<span class="pot-slot"></span>`).join('')}</div>
        <div class="pot-kettle" aria-hidden="true"><i></i><i></i><i></i></div></div>
      ${known ? `<p class="pot-known">${known.tier ? `${t('knownOk')} <b>${esc(potion(known.ix, known.tier, known.season).name)}</b>` : t('knownBad')}</p>` : ''}
      <p><button type="button" class="pill-btn pill-fill pot-brew" ${slots.length === 3 && !brewing ? '' : 'disabled'}>${brewing ? t('brewing') : t('brew')}</button></p>
      ${result || ''}
      <h3>${t('bag')}</h3>${items.length ? Object.keys(SEASON_INFO).filter(sn => items.some(r => r[5] === sn)).map(sn => `<p class="pot-sn">${SEASON_INFO[sn].e} ${SEASON_INFO[sn].n[L]}${slotSeason && slotSeason !== sn ? ` <small>${t('noMix')}</small>` : ''}</p><div class="pot-inv">${items.filter(r => r[5] === sn).map(r => `<div class="pot-ing-w"><button type="button" class="pot-ing" data-ing="${r[0]}" ${left[r[0]] > 0 && slots.length < 3 && !brewing && (!slotSeason || slotSeason === sn) ? '' : 'disabled'}><span>${r[1]}</span><small>${esc(IG[r[0]].n)}</small><b>×${left[r[0]]}</b></button>${left[r[0]] > 0 ? `<button type="button" class="pot-give" data-give="${r[0]}" title="${esc(t('giveT'))}" aria-label="${esc(t('giveT'))}">🎁</button>` : ''}</div>`).join('')}</div>`).join('') : `<p class="pot-empty">${t('bagEmpty')}</p>`}
      ${S.rules.on ? `<p class="pot-pay">${T.pay(S.rules)}</p>` : ''}`;
    v.querySelectorAll('[data-ing]').forEach(b => b.onclick = () => { if (slots.length < 3) { slots.push(b.dataset.ing); drawPot(); } });
    v.querySelectorAll('[data-slot]').forEach(b => b.onclick = () => { slots.splice(+b.dataset.slot, 1); drawPot(); });
    v.querySelectorAll('[data-give]').forEach(b => b.onclick = () => giveIng(b.dataset.give, left[b.dataset.give]));
    const br = v.querySelector('.pot-brew'); if (br) br.onclick = brew;
    const ok = v.querySelector('[data-a2=ok]'); if (ok) ok.onclick = () => drawPot();
  }
  async function brew() {
    if (slots.length !== 3 || brewing) return;
    brewing = true; drawPot();
    const ings = slots.slice();
    try {
      const [r] = await Promise.all([post('potion/brew', { ings }), new Promise(res => setTimeout(res, 1300))]);
      S.inv = r.inv; slots = []; brewing = false;
      const b = S.book.find(x => x.combo === r.combo); if (b) b.n++; else S.book.unshift({ combo: r.combo, tier: r.tier, n: 1, ix: r.ix, season: r.season });
      if (r.got) S.today += r.got;
      drawBar(); showBadges(r.badges);
      let html;
      if (!r.tier) html = `<div class="pot-res fail"><h3>💨 ${t('fail')}</h3><p>${esc(FAILS[Math.floor(Math.random() * FAILS.length)][L2])}</p><p class="pot-rec">${ings.map(id => IG[id].e).join(' ')}</p><button type="button" class="pill-btn" data-a2="ok">${t('again')}</button></div>`;
      else {
        const pt = potion(r.ix, r.tier, r.season);
        html = `<div class="pot-res t${r.tier}"><p class="pot-res-h">${r.first ? t('newPot') : t('againPot')}</p><span class="pot-res-b"></span><h3>${esc(pt.name)}</h3><p class="pot-tier t${r.tier}">${T.tier[L][r.tier]}</p>
          <p><b>${t('prop')}:</b> ${esc(pt.eff)}</p><p class="pot-rec">${ings.map(id => IG[id].e).join(' ')}</p>${r.item ? `<p class="pot-shelf">${t('shelf')}</p>` : ''}${r.got ? `<p class="pot-plus">${t('plus', r.got)}</p>` : S.rules.on && S.rules.max > 0 && S.today >= S.rules.max ? `<p class="pot-cap">${t('cap')}</p>` : ''}<button type="button" class="pill-btn" data-a2="ok">${t('again')}</button></div>`;
      }
      drawPot(html);
      if (r.tier) { const slot = app.querySelector('.pot-res-b'); if (slot) slot.appendChild(bottle(r.ix, r.tier, 64, r.season)); }
      window.PPAccount && window.PPAccount.check && r.got && window.PPAccount.check();
    } catch (e) { brewing = false; drawPot(`<p class="pot-err">${t('saveErr')}</p>`); }
  }

  // подарить ингредиенты другой птичке
  function giveIng(id, max) {
    const d = document.createElement('dialog'); d.className = 'pot-dlg';
    d.innerHTML = `<form method="dialog"><h3>${t('giveT')}</h3><p class="pot-dlg-e">${IG[id].e}</p><p>${esc(IG[id].n)}</p>
      <label>${t('giveN')} <input name="n" type="number" min="1" max="${Math.min(10, max)}" value="1" inputmode="numeric"></label>
      <label>${t('giveTo')} <input name="to" list="pot-birds" required maxlength="24" autocomplete="off" placeholder="${esc(t('givePh'))}"></label><datalist id="pot-birds"></datalist>
      <p class="pot-dlg-st" role="status"></p><div class="pot-ov-btns"><button type="button" class="pill-btn" value="x">${t('cancel')}</button><button type="submit" class="pill-btn pill-fill">${t('giveBtn')}</button></div></form>`;
    document.body.appendChild(d); d.showModal();
    fetch('/api/birds').then(r => r.ok ? r.json() : { birds: [] }).then(x => { d.querySelector('#pot-birds').innerHTML = (x.birds || []).filter(b => b.nick && b.id !== S.me.id).map(b => `<option value="${esc(b.nick)}">`).join(''); }).catch(() => {});
    const f = d.querySelector('form'), st = d.querySelector('.pot-dlg-st');
    d.querySelector('[value=x]').onclick = () => { d.close(); d.remove(); };
    f.onsubmit = async e => {
      e.preventDefault();
      try { const r = await post('potion/give', { ing: id, n: +f.n.value, to: f.to.value }); S.inv = r.inv; drawBar(); drawPot(); d.close(); d.remove(); toast(t('given', IG[id].e + '×' + r.n, r.to)); }
      catch (x) { st.textContent = x === 404 ? t('giveNo') : t('saveErr'); }
    };
  }
  function incoming(list) {
    if (!list || !list.length) return;
    list.forEach((g, i) => setTimeout(() => toast(t('gotGift', g.from, IG[g.ing] ? IG[g.ing].e + '×' + g.n : '')), 300 + i * 1500));
    post('potion/seen').catch(() => {});
  }

  // ======================= КНИГА РЕЦЕПТОВ =======================
  function drawBook() {
    const v = app.querySelector('.pot-book');
    if (!S || !S.me) { v.innerHTML = `<p class="pot-login">${t('login')}</p>`; return; }
    const okb = S.book.filter(b => b.tier > 0).sort((a, b) => b.tier - a.tier || a.ix - b.ix), bad = S.book.filter(b => !b.tier);
    v.innerHTML = !S.book.length ? `<p class="pot-empty">${t('bookEmpty')}</p>` : `<p class="pot-lead">${t('found', okb.length)}</p>
      <div class="pot-list">${okb.map(b => { const pt = potion(b.ix, b.tier, b.season); return `<div class="pot-entry t${b.tier}" data-ix="${b.ix}" data-tier="${b.tier}" data-season="${b.season}"><span class="pot-ic"></span><div><b>${esc(pt.name)}</b> <span class="pot-tier t${b.tier}">${T.tier[L][b.tier]}</span><p>${esc(pt.eff)}</p><p class="pot-rec">${b.combo.split('+').map(id => `<span title="${esc(IG[id].n)}">${IG[id].e}</span>`).join(' ')}${b.n > 1 ? ` <small>×${b.n}</small>` : ''}</p></div></div>`; }).join('')}</div>
      ${bad.length ? `<h3>${t('fails')}</h3><p class="pot-bad">${bad.map(b => `<span>${b.combo.split('+').map(id => IG[id].e).join('')}</span>`).join('')}</p>` : ''}`;
    v.querySelectorAll('.pot-entry').forEach(el => el.querySelector('.pot-ic').appendChild(bottle(+el.dataset.ix, +el.dataset.tier, 44, el.dataset.season)));
  }
  app.addEventListener('click', e => { const a = e.target.closest('[data-a2=in]'); if (a) window.PPAccount && window.PPAccount.openSignIn(); });

  // ======================= старт =======================
  // только на локальном сервере: доступ для автотеста
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) window.__pot = { s: () => M && ({ state, level: M.level, p: pos(M.p), ex: M.ex, things: M.things.map(o => ({ k: o.k, x: o.x, y: o.y, taken: !!o.taken })), W: M.W, got: M.got.length }), want: setWant, fog: v => { M.fog = v; draw(); } };
  fetch('/api/potion', { credentials: 'same-origin' }).then(r => r.json()).then(d => {
    S = d; drawBar(); showTab('maze'); incoming(d.gifts);
    if (!S.me) { stage.style.width = '100%'; stage.style.height = '260px'; overlay(`<h2>🧪 ${t('title')}</h2><p>${t('login')}</p><button type="button" class="pill-btn pill-fill" data-a="in">${t('signin')}</button>`); app.querySelector('.pot-pad').hidden = true; return; }
    newLevel();
  }).catch(() => overlay(`<p>${t('saveErr')}</p>`));
})();
