// Квест детектива Титоса: «Дело об украденном сиропе». Работает поверх rooms.js (window.ROOM).
(() => {
  const A = window.ROOM; if (!A || A.R == null || document.getElementById('rm').dataset.room !== 'detective') return;
  const { box, R, L, esc, pct } = A;
  const t = o => o[L];
  const KEY = 'pp-titos-syrup-case';
  let st = { found: [], pinned: [], analyzed: [], mag: false, dossiers: false, solved: false, tries: 0 };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  // меню дел: новые дела добавлять сюда с номерами (у будущих soon: true, пока не готовы)
  const CASES = [
    { no: 1, title: ['The stolen syrup', 'Украденный сироп', 'Nozagtais sīrups'] },
    { no: 2, soon: true },
  ];
  const UI = {
    caseNo: ['Case No.', 'Дело №', 'Lieta Nr.'], soon: ['coming soon', 'скоро', 'drīzumā'],
    case: ['Case: the stolen syrup', 'Дело: украденный сироп', 'Lieta: nozagtais sīrups'],
    clues: ['Clues on the board', 'Улик на доске', 'Pierādījumi uz dēļa'],
    board: ['📌 Evidence board', '📌 Доска улик', '📌 Pierādījumu dēlis'],
    inv: ['Pockets', 'Карманы', 'Kabatas'],
    pin: ['📌 Pin to the board', '📌 Приколоть на доску', '📌 Piespraust pie dēļa'],
    pinned: ['On the board ✓', 'Уже на доске ✓', 'Jau uz dēļa ✓'],
    exam: ['🔍 Examine with the magnifier', '🔍 Рассмотреть под лупой', '🔍 Apskatīt ar lupu'],
    needMag: ['You need a magnifying glass. There is one on the desk.', 'Нужна лупа. Она лежит на столе.', 'Vajag lupu. Tā ir uz galda.'],
    smeared: ['Something is smeared on it. Too small to see with the naked eye.', 'На этом что-то размазано. Невооружённым глазом не разглядеть.', 'Uz tā kaut kas ir nosmērēts. Ar neapbruņotu aci neredz.'],
    close: ['Close', 'Закрыть', 'Aizvērt'],
    suspects: ['Suspects', 'Подозреваемые', 'Aizdomās turamie'],
    noDoss: ['The suspects’ folders are in the filing cabinet drawer.', 'Папки подозреваемых — в ящике шкафа с документами.', 'Aizdomās turamo mapes ir dokumentu skapja atvilktnē.'],
    accuse: ['Who stole the syrup?', 'Кто украл сироп?', 'Kurš nozaga sīrupu?'],
    accuseBtn: ['Accuse', 'Обвинить', 'Apsūdzēt'],
    needAll: ['Pin all 7 clues to the board first.', 'Сначала приколите на доску все 7 улик.', 'Vispirms piesprauž pie dēļa visus 7 pierādījumus.'],
    intro: ['I can’t sleep. Barrel No. 12 of syrup is missing and I have only coffee. Find the clues, there are seven of them somewhere in this office.', 'Не могу уснуть. Пропала бочка сиропа № 12, а у меня только кофе. Найдите улики — их семь, где-то в этом кабинете.', 'Nevaru aizmigt. Pazudusi sīrupa muca Nr. 12, un man ir tikai kafija. Atrodi pierādījumus — tie ir septiņi, kaut kur šajā kabinetā.'],
    magGot: ['You take the magnifying glass. Now clues can be examined.', 'Вы берёте лупу. Теперь улики можно рассмотреть.', 'Tu paņem lupu. Tagad pierādījumus var apskatīt.'],
    solvedT: ['CASE CLOSED', 'ДЕЛО ЗАКРЫТО', 'LIETA SLĒGTA'],
    again: ['Investigate again', 'Расследовать заново', 'Izmeklēt vēlreiz'],
    bye: ['Case closed. Finally. Home, bed, no coffee. Good night!', 'Дело закрыто. Наконец-то. Домой, в кровать, без кофе. Спокойной ночи!', 'Lieta slēgta. Beidzot. Mājās, gultā, bez kafijas. Ar labu nakti!'],
  };
  const C = {
    report: { hot: 'folders', icon: null, kind: 'read',
      title: ['Factory report', 'Отчёт фабрики', 'Fabrikas ziņojums'],
      text: ['MAPLEWINK SYRUP FACTORY. Barrel No. 12 of golden syrup vanished overnight. The door was not forced, but the skylight in the roof was open. Found next to the empty spot: floury footprints, a feather, a sticky jar lid.',
             'СИРОПНАЯ ФАБРИКА MAPLEWINK. Ночью пропала бочка № 12 золотого сиропа. Дверь не взломана, но открыт люк в крыше. Рядом с пустым местом найдены: мучные следы, перо, липкая крышка от банки.',
             'MAPLEWINK SĪRUPA FABRIKA. Naktī pazuda zelta sīrupa muca Nr. 12. Durvis nav uzlauztas, bet jumta lūka bija vaļā. Blakus tukšajai vietai atrasti: miltaini pēdu nospiedumi, spalva, lipīgs burkas vāciņš.'] },
    photo: { sprite: ['clue-photo', 206, 160, 14], kind: 'read', herring: true,
      title: ['Photo: floury footprints', 'Фото: мучные следы', 'Foto: miltainas pēdas'],
      text: ['Floury boot prints right next to where barrel No. 12 stood. Size 44. Bun the baker wears size 44… and is always covered in flour.', 'Мучные следы ботинок прямо там, где стояла бочка № 12. Размер 44. Пекарь Бан носит 44-й… и вечно весь в муке.', 'Miltaini zābaku nospiedumi tieši tur, kur stāvēja muca Nr. 12. Izmērs 44. Maiznieks Bans valkā 44. izmēru… un vienmēr ir miltos.'] },
    receipt: { hot: 'paper#1', kind: 'read',
      title: ['Bakery delivery note', 'Накладная пекарни', 'Maiznīcas pavadzīme'],
      text: ['PINECREST BAKERY. Delivered to the Syrup Factory: 40 loaves for the night shift. Time: 6 pm. After that — straight to the Festival of Warm Ovens, back at dawn. Signed: Bun.', 'ПЕКАРНЯ PINECRUST. Доставлено на сиропную фабрику: 40 буханок для ночной смены. Время: 18:00. После — сразу на Праздник тёплых печей, обратно на рассвете. Подпись: Бан.', 'PINECRUST MAIZNĪCA. Piegādāts sīrupa fabrikai: 40 klaipi nakts maiņai. Laiks: 18:00. Pēc tam — uzreiz uz Silto krāšņu svētkiem, atpakaļ rītausmā. Paraksts: Bans.'] },
    statement: { hot: 'recorder', kind: 'listen',
      title: ['Witness statement', 'Показания свидетеля', 'Liecinieka liecība'],
      text: ['Dictaphone, night guard Moss: “I was awake. Mostly. Around two in the morning I heard big wings flapping on the roof and somebody squawking ‘so… heavy!’. Then something rolled towards the station.”', 'Диктофон, ночной сторож Мосс: «Я не спал. Почти. Около двух ночи на крыше хлопали большие крылья, и кто-то вопил: „ох… тяжёлая!“. Потом что-то покатилось к станции».', 'Diktofons, nakts sargs Moss: “Es negulēju. Gandrīz. Ap diviem naktī uz jumta plivinājās lieli spārni un kāds kliedza: ‘ak… smaga!’. Tad kaut kas aizripoja uz staciju.”'] },
    feather: { sprite: ['clue-feather', 176, 194, 16], kind: 'analyze',
      title: ['A feather', 'Перо', 'Spalva'],
      text: ['Under the magnifier: a grey-and-white seagull feather, glued together with maple syrup. In Wobbleland, seagulls live in New Wobbleton.', 'Под лупой: серо-белое перо чайки, склеенное кленовым сиропом. В Wobbleland чайки живут в New Wobbleton.', 'Zem lupas: pelēkbalta kaijas spalva, salipusi ar kļavu sīrupu. Wobbleland kaijas dzīvo New Wobbleton.'] },
    lid: { hot: 'bin', kind: 'analyze',
      title: ['Sticky jar lid', 'Липкая крышка', 'Lipīgs vāciņš'],
      text: ['Under the magnifier: these are not fingerprints at all. Three long toes with webbing, printed in syrup. A bird’s foot, not a hand.', 'Под лупой: это вовсе не отпечатки пальцев. Три длинных пальца с перепонками, отпечатаны в сиропе. Лапа птицы, а не рука.', 'Zem lupas: tie nemaz nav pirkstu nospiedumi. Trīs gari pirksti ar peldplēvēm, nospiesti sīrupā. Putna kāja, nevis roka.'] },
    ticket: { hot: 'coat', kind: 'read',
      title: ['Train ticket', 'Билет на поезд', 'Vilciena biļete'],
      text: ['Found in the coat pocket, Titos picked it up at the station: “Night cargo train, Maplewink → New Wobbleton, 02:14. Passenger: G… (the rest is smudged with syrup). Luggage: 1 barrel, very sticky.”', 'Нашёлся в кармане плаща — Титос подобрал его на станции: «Ночной грузовой поезд, Maplewink → New Wobbleton, 02:14. Пассажир: Г… (дальше заляпано сиропом). Багаж: 1 бочка, очень липкая».', 'Atrasta mēteļa kabatā — Titoss to pacēla stacijā: “Nakts kravas vilciens, Maplewink → New Wobbleton, 02:14. Pasažieris: G… (tālāk notraipīts ar sīrupu). Bagāža: 1 muca, ļoti lipīga.”'] },
  };
  const ORDER = ['report', 'photo', 'receipt', 'statement', 'feather', 'lid', 'ticket'];
  const S = {
    baker: { name: ['Bun, baker of Pinecrust', 'Бан, пекарь из Pinecrust', 'Bans, Pinecrust maiznieks'],
      text: ['Bakes three hundred pies a day and uses a lot of syrup. Size 44 boots, always floury. Titos suspects him in every case. Every single one.', 'Печёт триста пирогов в день и тратит много сиропа. Ботинки 44-го размера, вечно в муке. Титос подозревает его в каждом деле. В каждом.', 'Cep trīssimt pīrāgus dienā un izlieto daudz sīrupa. 44. izmēra zābaki, vienmēr miltos. Titoss viņu tur aizdomās katrā lietā. Katrā.'],
      verdict: ['Wrong! Bun delivered the bread at 6 pm, that’s where the floury footprints came from, and he spent the whole night at the Festival of Warm Ovens. The real thief flew away…', 'Мимо! Бан привёз хлеб в 18:00 — отсюда мучные следы, — а всю ночь был на Празднике тёплых печей. Настоящий вор улетел…', 'Garām! Bans atveda maizi 18:00 — no turienes miltainās pēdas —, un visu nakti bija Silto krāšņu svētkos. Īstais zaglis aizlidoja…'] },
    gull: { name: ['Gustav, Seagull Guardian of New Wobbleton', 'Густав, чайка-страж из New Wobbleton', 'Gustavs, kaiju sargs no New Wobbleton'],
      text: ['Guards Seagull Square. Famous for snatching pastries. Strong wings: can almost lift a barrel. Has a terrible sweet tooth.', 'Охраняет площадь Чаек. Знаменит тем, что таскает пирожки. Сильные крылья: почти может поднять бочку. Ужасный сладкоежка.', 'Sargā Kaiju laukumu. Slavens ar to, ka zog pīrādziņus. Spēcīgi spārni: gandrīz var pacelt mucu. Briesmīgs saldummīlis.'],
      verdict: ['Correct! The feather, the webbed prints in syrup, wings on the roof and a ticket for “G…” to New Wobbleton. Gustav confessed: he wanted syrup for the Great Wobble Day pastries. Barrel No. 12 is back in Maplewink.', 'Верно! Перо, перепончатые следы в сиропе, крылья на крыше и билет на «Г…» до New Wobbleton. Густав сознался: хотел сироп для пирожков к Великому дню качки. Бочка № 12 вернулась в Maplewink.', 'Pareizi! Spalva, peldplēvju pēdas sīrupā, spārni uz jumta un biļete uz “G…” līdz New Wobbleton. Gustavs atzinās: gribēja sīrupu pīrādziņiem Lielajai šūpošanās dienai. Muca Nr. 12 ir atpakaļ Maplewink.'] },
    guard: { name: ['Moss, night guard of the Syrup Factory', 'Мосс, ночной сторож фабрики', 'Moss, fabrikas nakts sargs'],
      text: ['A snail from Snailhollow, the slowest guard on the island. Says he was awake. Mostly.', 'Улитка из Snailhollow, самый медленный сторож острова. Говорит, что не спал. Почти.', 'Gliemezis no Snailhollow, lēnākais sargs salā. Saka, ka negulēja. Gandrīz.'],
      verdict: ['Wrong! Moss can’t lift a teacup, let alone a barrel, and he would still be crawling to the 02:14 train today. The real thief flew away…', 'Мимо! Мосс не поднимет и чашку, не то что бочку, а до поезда в 02:14 он полз бы до сих пор. Настоящий вор улетел…', 'Garām! Moss nepaceltu pat tasi, kur nu mucu, un uz vilcienu 02:14 viņš rāpotu vēl šodien. Īstais zaglis aizlidoja…'] },
  };
  // --- полоска дела над комнатой и карманы под ней
  const bar = document.querySelector('.rm-bar');
  const banner = document.createElement('div'); banner.className = 'q-banner'; bar.insertBefore(banner, bar.firstChild.nextSibling);
  const pockets = document.createElement('div'); pockets.className = 'q-pockets'; box.after(pockets);
  const modal = document.createElement('div'); modal.className = 'q-modal'; modal.hidden = true; box.appendChild(modal);
  const icon = id => C[id].sprite ? `/images/rooms/${C[id].sprite[0]}.png` : id === 'report' ? '/images/rooms/prop-mail.png' : id === 'statement' ? '/images/rooms/prop-pot.png' : id === 'receipt' ? '/images/rooms/clue-ticket.png' : id === 'lid' ? '/images/rooms/clue-lid.png' : '/images/rooms/clue-ticket.png';
  const draw = () => {
    banner.innerHTML = `<nav class="q-tabs">${CASES.map(c => `<button type="button" class="${c.no === 1 ? 'on' : ''}"${c.soon ? ' disabled' : ''}>${t(UI.caseNo)} ${c.no}${c.soon ? ' · ' + t(UI.soon) : ' · ' + t(c.title) + (st.solved ? ' ✅' : '')}</button>`).join('')}</nav>` +
      (st.solved ? `<span class="q-stat">✅ ${t(UI.solvedT)}</span><button type="button" data-q="again">${t(UI.again)}</button>`
      : `<span class="q-stat">${t(UI.clues)}: ${st.pinned.length}/7</span><button type="button" data-q="board">${t(UI.board)}</button>`);
    pockets.innerHTML = `<span>${t(UI.inv)}:</span>` + (st.mag ? '<img src="/images/rooms/prop-mag.png" alt="" title="🔍">' : '') +
      st.found.filter(id => !st.pinned.includes(id)).map(id => `<button type="button" data-open="${id}" title="${esc(t(C[id].title))}"><img src="${icon(id)}" alt="">${esc(t(C[id].title))}</button>`).join('');
    ORDER.forEach(id => { const sp = sprites[id]; if (sp) sp.hidden = st.pinned.includes(id) || st.solved; });
  };
  const close = () => { modal.hidden = true; };
  const card = (html) => { modal.innerHTML = `<div class="q-card">${html}<button type="button" class="q-x" data-q="close">✕</button></div>`; modal.hidden = false; };
  const openClue = id => {
    if (!st.found.includes(id)) { st.found.push(id); save(); }
    const c = C[id], needs = c.kind === 'analyze' && !st.analyzed.includes(id), on = st.pinned.includes(id);
    card(`<p class="q-kick">${c.kind === 'listen' ? '🎙' : c.kind === 'analyze' ? '🔍' : '📄'} ${esc(t(UI.case))}</p><h3>${esc(t(c.title))}</h3>
      <div class="q-paper${c.herring ? ' photo' : ''}"><img src="${icon(id)}" alt=""><p>${esc(needs ? t(UI.smeared) : t(c.text))}</p></div>
      <div class="q-acts">${needs ? (st.mag ? `<button type="button" data-q="exam" data-id="${id}">${t(UI.exam)}</button>` : `<em>${t(UI.needMag)}</em>`)
        : on ? `<em>${t(UI.pinned)}</em>` : `<button type="button" data-q="pin" data-id="${id}">${t(UI.pin)}</button>`}</div>`);
    draw();
  };
  const STR = [[0, 2], [1, 2], [0, 3], [3, 6], [0, 4], [4, 5], [5, 6]];
  const openBoard = () => {
    const pos = [[8, 10], [38, 6], [70, 10], [10, 52], [40, 46], [70, 52], [40, 80]];
    const lines = STR.filter(([a, b]) => st.pinned.includes(ORDER[a]) && st.pinned.includes(ORDER[b]))
      .map(([a, b]) => `<line x1="${pos[a][0] + 10}" y1="${pos[a][1] + 7}" x2="${pos[b][0] + 10}" y2="${pos[b][1] + 7}"/>`).join('');
    const slots = ORDER.map((id, i) => st.pinned.includes(id)
      ? `<button type="button" class="q-slot on" style="left:${pos[i][0]}%;top:${pos[i][1]}%" data-open="${id}"><i></i><img src="${icon(id)}" alt="">${esc(t(C[id].title))}</button>`
      : `<span class="q-slot" style="left:${pos[i][0]}%;top:${pos[i][1]}%">?</span>`).join('');
    const sus = st.dossiers ? `<div class="q-sus"><p>${t(UI.accuse)}</p>${Object.entries(S).map(([k, s]) => `<button type="button" data-acc="${k}"${st.pinned.length < 7 ? ' disabled' : ''}><img src="/images/rooms/suspect-${k}.png" alt="">${esc(t(s.name))}</button>`).join('')}${st.pinned.length < 7 ? `<em>${t(UI.needAll)}</em>` : ''}</div>`
      : `<div class="q-sus"><em>${t(UI.noDoss)}</em></div>`;
    card(`<h3>${t(UI.board)}</h3><div class="q-cork"><svg viewBox="0 0 100 100" preserveAspectRatio="none">${lines}</svg>${slots}</div>${sus}`);
  };
  const openDossiers = () => {
    st.dossiers = true; save();
    card(`<p class="q-kick">🗂 ${t(UI.suspects)}</p><div class="q-doss">${Object.entries(S).map(([k, s]) => `<article><img src="/images/rooms/suspect-${k}.png" alt=""><h4>${esc(t(s.name))}</h4><p>${esc(t(s.text))}</p></article>`).join('')}</div>`);
  };
  const solve = (k) => {
    const s = S[k];
    if (k !== 'gull') {
      st.tries++; save(); card(`<h3>❌</h3><p class="q-verdict">${esc(t(s.verdict))}</p>`);
      A.coffee.sip && setTimeout(() => A.coffee.sip(true), 900); return;
    }
    st.solved = true; save(); A.coffee.on = false; draw();
    card(`<div class="q-stamp">${t(UI.solvedT)}</div><p class="q-verdict">${esc(t(s.verdict))}</p>`);
    goHome();
  };
  const goHome = () => {
    const h = A.hero; if (!h) return;
    h.classList.remove('jitter');
    setTimeout(() => { close(); A.sayAt(t(UI.bye), 30, 40, 4000); }, 2600);
    setTimeout(() => { h.classList.add('q-walk'); A.setEvening(true); box.classList.add('q-lightsout'); }, 6000);
  };
  // спрайты улик, которых нет в фоне
  const sprites = {};
  ORDER.forEach(id => {
    const sp = C[id].sprite; if (!sp) return;
    const [src, x, y, w] = sp, b = document.createElement('button'); b.type = 'button'; b.className = 'q-clue';
    b.style.left = pct(x / R.w * 100); b.style.top = pct(y / R.h * 100); b.style.width = pct(w / R.w * 100);
    b.innerHTML = `<img src="/images/rooms/${src}.png" alt="${esc(t(C[id].title))}">`; b.addEventListener('click', () => openClue(id));
    box.appendChild(b); sprites[id] = b;
  });
  const HOTS = {}; ORDER.forEach(id => { if (C[id].hot) HOTS[C[id].hot] = id; });
  A.hook = k => {
    if (st.solved) return false;
    if (HOTS[k]) { openClue(HOTS[k]); return true; }
    if (k === 'magnifier') { if (!st.mag) { st.mag = true; save(); draw(); } A.sayAt(t(UI.magGot), 34, 46); return true; }
    if (k === 'folderdrawer' || k.startsWith('drawer#')) { openDossiers(); return true; }
    if (k === 'board' || k.startsWith('photo#') || k === 'clue') { openBoard(); return true; }
    return false;
  };
  const click = e => {
    const q = e.target.closest('[data-q]'), o = e.target.closest('[data-open]'), a = e.target.closest('[data-acc]');
    if (o) { openClue(o.dataset.open); return; }
    if (a && !a.disabled) { solve(a.dataset.acc); return; }
    if (!q) return;
    const id = q.dataset.id;
    if (q.dataset.q === 'close') close();
    if (q.dataset.q === 'board') openBoard();
    if (q.dataset.q === 'exam') { st.analyzed.push(id); save(); openClue(id); }
    if (q.dataset.q === 'pin') { if (!st.pinned.includes(id)) st.pinned.push(id); save(); draw(); openBoard(); }
    if (q.dataset.q === 'again') { localStorage.removeItem(KEY); location.reload(); }
  };
  [modal, banner, pockets].forEach(el => el.addEventListener('click', click));
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
  if (st.solved) { A.coffee.on = false; A.hero && A.hero.classList.add('q-gone'); box.classList.add('q-lightsout'); }
  else setTimeout(() => A.sayAt(t(UI.intro), 30, 40, 9000), 1200);
  draw();
})();
