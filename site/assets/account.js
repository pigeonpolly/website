// Вход в шапке на всех страницах: «Войти» (Google) или птичка-аватар из стаи с меню профиля.
(function () {
  const el = document.getElementById('acct');
  if (!el) return;
  const lang = document.documentElement.lang || 'en';
  const L = { en: 0, ru: 1, lv: 2 }[lang] ?? 0;
  const pre = lang === 'en' ? '' : '/' + lang;
  const S = {
    signIn: ['Sign in', 'Войти', 'Ienākt'],
    why: ['One account for the Daily Challenge, blog comments and your own bird in the flock.', 'Один вход для челленджа, комментариев в блоге и своей птички в стае.', 'Viena ieeja izaicinājumam, bloga komentāriem un savam putniņam barā.'],
    profile: ['My profile', 'Мой профиль', 'Mans profils'],
    getBird: ['Get a bird', 'Получить птичку', 'Saņem putniņu'],
    streak: [n => `🔥 ${n}-day streak`, n => `🔥 серия ${n} дн.`, n => `🔥 sērija ${n} d.`],
    room: ['My room', 'Моя комната', 'Mana istaba'], bag: ['Bag', 'Сумка', 'Soma'], album: ['Album', 'Альбом', 'Albums'],
    shop: ['Shop', 'Магазин', 'Veikals'], env: ['Envelope', 'Конвертик', 'Aploksnīte'], edit: ['Edit page', 'Править страницу', 'Labot lapu'],
    nick: ['Choose a nickname', 'Выбрать ник', 'Izvēlēties segvārdu'],
    noNick: ['no nickname yet', 'ник ещё не выбран', 'segvārds vēl nav izvēlēts'],
    out: ['Sign out', 'Выйти', 'Iziet'],
    menu: ['Account', 'Аккаунт', 'Konts'],
    admin: ['admin', 'админ', 'admins'],
    cabinet: ['Admin dashboard', 'Кабинет', 'Kabinets'],
    nTitle: ['Meet your bird! Now pick a nickname', 'Знакомься со своей птичкой! Теперь выбери ник', 'Iepazīsties ar savu putniņu! Tagad izvēlies segvārdu'],
    nTitleCat: ['You are a cat! Now pick a nickname', 'Ты котик! Теперь выбери ник', 'Tu esi kaķītis! Tagad izvēlies segvārdu'],
    nTitleCrow: ['You are a crow with a treasure! Now pick a nickname', 'Ты ворона с сокровищем! Теперь выбери ник', 'Tu esi vārna ar dārgumu! Tagad izvēlies segvārdu'],
    nText: ['This name will be shown in the flock, on the Daily Challenge wall and in blog comments. 2–24 letters, numbers, dots, dashes or underscores.', 'Под этим ником тебя увидят в стае, на стене челленджа и в комментариях блога. 2–24 символа: буквы, цифры, точка, дефис или подчёркивание.', 'Ar šo vārdu tevi redzēs barā, izaicinājuma sienā un bloga komentāros. 2–24 simboli: burti, cipari, punkts, defise vai pasvītra.'],
    nPlace: ['your nickname', 'твой ник', 'tavs segvārds'],
    nDice: ['Random nickname', 'Случайный ник', 'Nejaušs segvārds'],
    nSave: ['Done', 'Готово', 'Gatavs'],
    nTaken: ['This nickname is taken, try another one.', 'Этот ник уже занят, попробуй другой.', 'Šis segvārds jau aizņemts, mēģini citu.'],
    nBad: ['Use 2–24 letters, numbers, dots, dashes or underscores.', 'Нужно 2–24 символа: буквы, цифры, точка, дефис или подчёркивание.', 'Vajag 2–24 simbolus: burtus, ciparus, punktu, defisi vai pasvītru.'],
    nErr: ['Something went wrong, please try again.', 'Что-то пошло не так, попробуй ещё раз.', 'Kaut kas nogāja greizi, mēģini vēlreiz.'],
    nOut: ['Sign out instead', 'Лучше выйти', 'Labāk iziet'],
    pub: ['Your nickname and bird will be visible to everyone on the site.', 'Твой ник и птичка будут видны всем на сайте.', 'Tavs segvārds un putniņš būs redzami visiem vietnē.'],
    terms: ['By signing in you agree to the', 'Входя, ты соглашаешься с', 'Ieejot tu piekrīti'],
    termsLink: ['privacy rules', 'правилами конфиденциальности', 'privātuma noteikumiem'],
    termsMore: ['Privacy rules', 'Правила конфиденциальности', 'Privātuma noteikumi'],
    refL: ['Who invited you? (optional)', 'Кто тебя пригласил? (необязательно)', 'Kurš tevi uzaicināja? (nav obligāti)'],
    refP: ['friend’s nickname', 'ник друга', 'drauga segvārds'],
    refHint: ['Your friend gets {n} buttons 🔘', 'Другу достанется {n} пуговок 🔘', 'Draugs saņems {n} pogas 🔘'], // {n} — текущая сумма с сервера (растёт вместе с ценами)
    refBad: ['There is no bird with this nickname. Pick one from the list or leave it empty.', 'Птички с таким ником нет. Выбери из списка или оставь пустым.', 'Putniņa ar tādu segvārdu nav. Izvēlies no saraksta vai atstāj tukšu.'],
    btns: ['buttons', 'пуговок', 'pogas'],
    daily: [n => `+${n} 🔘 buttons for visiting today!`, n => `+${n} 🔘 пуговки за заход сегодня!`, n => `+${n} 🔘 pogas par šodienas apmeklējumu!`],
    // вход с паролем (этап 12)
    or: ['or', 'или', 'vai'],
    tabIn: ['Sign in', 'Вход', 'Ieeja'], tabUp: ['Sign up', 'Регистрация', 'Reģistrācija'],
    login: ['Email or nickname', 'Почта или ник', 'E-pasts vai segvārds'], email: ['Email', 'Почта', 'E-pasts'],
    pw: ['Password', 'Пароль', 'Parole'], pwNew: ['New password', 'Новый пароль', 'Jaunā parole'], pwOld: ['Current password', 'Текущий пароль', 'Pašreizējā parole'],
    pwHint: ['At least 8 characters. A phrase of a few words is easy to remember.', 'От 8 символов. Легко запомнить фразу из нескольких слов.', 'Vismaz 8 simboli. Frāzi no dažiem vārdiem ir viegli atcerēties.'],
    show: ['Show password', 'Показать пароль', 'Rādīt paroli'], hide: ['Hide password', 'Скрыть пароль', 'Slēpt paroli'],
    doIn: ['Sign in', 'Войти', 'Ienākt'], doUp: ['Create account', 'Зарегистрироваться', 'Reģistrēties'],
    agree: ['I agree to the', 'Соглашаюсь с', 'Piekrītu'],
    forgot: ['Forgot password?', 'Забыли пароль?', 'Aizmirsi paroli?'],
    fgText: ['Enter your email — we’ll send a link to choose a new password. It works for 1 hour.', 'Напиши почту — пришлём ссылку, чтобы придумать новый пароль. Она работает 1 час.', 'Ieraksti e-pastu — atsūtīsim saiti jaunas paroles izveidei. Tā darbojas 1 stundu.'],
    fgSend: ['Send link', 'Прислать ссылку', 'Sūtīt saiti'],
    fgSent: ['If there is an account with this email, the link is already on its way. Check your inbox and spam.', 'Если аккаунт с такой почтой есть, ссылка уже летит. Проверь входящие и спам.', 'Ja konts ar šo e-pastu ir, saite jau ceļā. Pārbaudi iesūtni un surogātpastu.'],
    fgOff: ['Email Alina: she will reset the password and send you a temporary one. When you sign in with it, you’ll choose a new password.', 'Напиши Алине на почту: она сбросит пароль и пришлёт временный. При входе с ним придумаешь новый.', 'Uzraksti Alīnai e-pastu: viņa atiestatīs paroli un atsūtīs pagaidu paroli. Ienākot ar to, izdomāsi jaunu.'],
    fgWrite: ['Write to Alina', 'Написать Алине', 'Rakstīt Alīnai'],
    fgSubj: ['Forgot my password', 'Забыли пароль', 'Aizmirsu paroli'],
    fgMsg: ['Hi Alina! I forgot my password. My nickname / email on the site: ', 'Привет, Алина! Не помню пароль. Мой ник / почта на сайте: ', 'Sveika, Alīna! Aizmirsu paroli. Mans segvārds / e-pasts vietnē: '],
    back: ['← Back', '← Назад', '← Atpakaļ'],
    inApp: ['Signing in with Google may not work inside this app. Sign in with a password — or open the site in your browser (⋯ → Open in browser).', 'Вход через Google здесь может не сработать. Войди с паролем — или открой сайт в браузере (⋯ → «Открыть в браузере»).', 'Ieeja ar Google šeit var nedarboties. Ienāc ar paroli — vai atver vietni pārlūkā (⋯ → «Atvērt pārlūkā»).'],
    eWrong: ['Wrong email or password.', 'Неверная почта или пароль.', 'Nepareizs e-pasts vai parole.'],
    eLocked: [n => `Too many attempts. Please wait ${n} minutes.`, n => `Слишком много попыток. Подожди ${n} минут.`, n => `Pārāk daudz mēģinājumu. Pagaidi ${n} minūtes.`],
    eShort: ['The password needs at least 8 characters.', 'В пароле нужно от 8 символов.', 'Parolē vajag vismaz 8 simbolus.'],
    eLong: ['This password is too long.', 'Пароль слишком длинный.', 'Parole ir pārāk gara.'],
    eCommon: ['This password is too common — easy to guess. Try another one.', 'Этот пароль слишком частый — его легко угадать. Придумай другой.', 'Šī parole ir pārāk izplatīta — to viegli uzminēt. Izdomā citu.'],
    eSame: ['The password must not be the same as your email or nickname.', 'Пароль не должен совпадать с почтой или ником.', 'Parole nedrīkst sakrist ar e-pastu vai segvārdu.'],
    eEmail: ['Please check the email address.', 'Проверь адрес почты.', 'Pārbaudi e-pasta adresi.'],
    eConsent: ['Please tick the box to agree to the privacy rules.', 'Отметь галочку согласия с правилами конфиденциальности.', 'Atzīmē piekrišanu privātuma noteikumiem.'],
    eGoogle: ['This email is already linked to Google — sign in with Google. You can add a password later in your profile.', 'Эта почта уже привязана к Google — войди через Google. Пароль можно добавить потом в профиле.', 'Šis e-pasts jau piesaistīts Google — ienāc ar Google. Paroli vari pievienot vēlāk profilā.'],
    eExists: ['This email is already registered — sign in.', 'Эта почта уже зарегистрирована — войди.', 'Šis e-pasts jau reģistrēts — ienāc.'],
    eLink: ['The link is out of date or already used. Ask for a new one.', 'Ссылка устарела или уже использована. Попроси новую.', 'Saite ir novecojusi vai jau izmantota. Palūdz jaunu.'],
    eBanned: ['This account is blocked.', 'Этот аккаунт заблокирован.', 'Šis konts ir bloķēts.'],
    pwSet: ['Change password', 'Сменить пароль', 'Mainīt paroli'], pwAdd: ['Add a password', 'Добавить пароль', 'Pievienot paroli'],
    pwAddText: ['Then you can sign in with your email or nickname and this password — e.g. inside Instagram or TikTok, where Google sign-in doesn’t work.', 'Тогда можно входить по почте или нику и этому паролю — например, внутри Instagram или TikTok, где вход через Google не работает.', 'Tad varēsi ienākt ar e-pastu vai segvārdu un šo paroli — piemēram, Instagram vai TikTok iekšienē, kur ieeja ar Google nedarbojas.'],
    pwTempT: ['Choose a new password', 'Придумай новый пароль', 'Izdomā jaunu paroli'],
    pwTempText: ['You signed in with a temporary password. Choose your own — the temporary one will stop working.', 'Вход — по временному паролю. Придумай свой, а временный перестанет работать.', 'Tu ienāci ar pagaidu paroli. Izdomā savu — pagaidu parole vairs nedarbosies.'],
    pwResetT: ['New password', 'Новый пароль', 'Jaunā parole'],
    pwSave: ['Save', 'Сохранить', 'Saglabāt'], cancel: ['Cancel', 'Отмена', 'Atcelt'],
    pwDone: ['Password saved ✓ Other devices are signed out.', 'Пароль сохранён ✓ На других устройствах вход закрыт.', 'Parole saglabāta ✓ Citās ierīcēs ieeja aizvērta.'],
    outAll: ['Sign out on all devices', 'Выйти на всех устройствах', 'Iziet visās ierīcēs'],
    outAllAsk: ['Sign out on all devices, including this one?', 'Выйти на всех устройствах, и на этом тоже?', 'Iziet visās ierīcēs, arī šajā?'],
  };
  const t = k => S[k][L];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let info = null;
  try { const q = new URLSearchParams(location.search), r = (q.get('ref') || q.get('bird') || '').replace(/^@/, ''); if (/^[\p{L}\p{N}_.-]{2,24}$/u.test(r)) localStorage.setItem('pp-ref', r); } catch (e) {}
  const toast = msg => window.PPToast && window.PPToast(msg); // toast.js

  // проверка дат на локальном сервере (DEV_FAKE_LOGIN): ?devdate=2026-11-30T23:59:50 (по Риге) запоминается на вкладку, часы идут дальше;
  // ?devdate=off — забыть. Сервер без DEV_FAKE_LOGIN заголовок не слушает. Зовут адвент, блок сезона и новости: window.PPDevH()
  try { // один раз при заходе на страницу
    const q = (location.search.match(/[?&]devdate=([\dT:-]+|off)/) || [])[1];
    if (q === 'off') sessionStorage.removeItem('pp-devdate');
    else if (q) sessionStorage.setItem('pp-devdate', JSON.stringify({ base: q, at: Date.now() }));
  } catch (e) {}
  function devH() {
    let v = null;
    try { v = JSON.parse(sessionStorage.getItem('pp-devdate') || 'null'); } catch (e) {}
    if (!v || !/^\d{4}-\d\d-\d\d/.test(v.base)) return {};
    if (v.base.length === 10) return { 'x-dev-date': v.base };
    const [y, mo, d, h, mi, se] = v.base.split(/\D/).map(Number), t = new Date(Date.UTC(y, mo - 1, d, h, mi, se || 0) + Date.now() - v.at);
    return { 'x-dev-date': t.toISOString().slice(0, 19) };
  }
  window.PPDevH = devH;
  function check() {
    return fetch('/api/whoami', { credentials: 'same-origin', headers: devH() }).then(r => r.ok ? r.json() : null).then(d => {
      if (!d) return;
      info = d; render();
      document.documentElement.classList.toggle('is-admin', !!(d.user && d.user.admin)); // полоска цифр над шапкой — только Алине
      if (d.user && d.user.admin) adminStrip();
      if (d.user && !d.user.nick) askNick(d.user);
      if (d.user && d.user.earned) toast(t('daily')(d.user.earned));
      window.PPWho = d; document.dispatchEvent(new CustomEvent('pp:whoami', { detail: d })); // новости птички — «конвертик» (news.js); зарплата теперь там
      if (d.user && d.user.pin) pinAsk();
      if (d.user && d.user.pwTemp) pwDialog('temp'); // вход по временному паролю из кабинета — придумать свой
      else if (resetTok && !d.user) pwDialog('reset');
    }).catch(() => {});
  }
  // защита админки: вход через Google — это ещё не админ; на этом устройстве нужно один раз ввести PIN
  function pinAsk() {
    try { if (sessionStorage.getItem('pp-pin-later')) return; } catch (e) {}
    if (document.querySelector('.pp-pin')) return;
    const box = document.createElement('form'); box.className = 'pp-pin';
    box.innerHTML = `<b>🔐 PIN админа</b><input type="password" inputmode="numeric" autocomplete="off" maxlength="12" aria-label="PIN"><button type="submit" class="pill-btn pill-fill">OK</button><button type="button" class="pp-pin-x" aria-label="Позже">✕</button><span class="pp-pin-st" role="status"></span>`;
    document.body.appendChild(box);
    const inp = box.querySelector('input'), st = box.querySelector('.pp-pin-st');
    box.querySelector('.pp-pin-x').onclick = () => { try { sessionStorage.setItem('pp-pin-later', '1'); } catch (e) {} box.remove(); };
    box.onsubmit = async e => {
      e.preventDefault(); st.textContent = '…';
      const r = await fetch('/api/admin/pin/verify', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ pin: inp.value }) }).catch(() => null);
      const j = r ? await r.json().catch(() => ({})) : {};
      if (r && r.ok) { st.textContent = '✓'; setTimeout(() => location.reload(), 400); return; }
      st.textContent = j.error === 'locked' ? `Слишком много попыток — подожди ${j.minutes} мин.` : 'Не тот PIN'; inp.value = ''; inp.focus();
    };
  }
  // открыть окно входа из любого места страницы (кнопка «Хочу свою птичку» в стае)
  function openSignIn() {
    const btn = el.querySelector('.acct-btn');
    if (!btn) return false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // открываем после текущего клика: иначе тот же клик долетает до «клик мимо окна — закрыть» и окно сразу закрывается
    setTimeout(() => { if (btn.getAttribute('aria-expanded') !== 'true') btn.click(); btn.focus({ preventScroll: true }); }, 0);
    return true;
  }
  // «🔘 N» в шапке (→ магазин), только у вошедших с ником; другие скрипты могут обновить число после покупки
  function setButtons(n) {
    const a = document.getElementById('hd-btns');
    if (!a) return;
    a.hidden = n == null;
    if (n != null) { a.querySelector('b').textContent = n; a.href = pre + '/shop/'; }
    const c = document.getElementById('hd-cart'); // 🛒 корзина (cart.js) — рядом с пуговками
    if (c) { c.hidden = n == null; c.href = pre + '/shop/#cart'; }
  }
  window.PPAccount = { check, openSignIn, signedIn: () => !!(info && info.user), pwDialog, logoutAll, setButtons };
  check();

  // ник обязателен: окно сразу после первого входа, закрыть можно только выбрав ник (или выйдя)
  function askNick(u) {
    if (document.getElementById('acct-nick')) return;
    const kind = window.PPBirds ? window.PPBirds.looks(u.id).kind : 'bird';
    const d = document.createElement('dialog');
    d.id = 'acct-nick'; d.className = 'acct-nick';
    d.innerHTML = `<form method="dialog"><canvas width="${window.PPBirds ? window.PPBirds.SW : 28}" height="26" aria-hidden="true"></canvas>
      <h2>${t(kind === 'cat' ? 'nTitleCat' : kind === 'crow' ? 'nTitleCrow' : 'nTitle')}</h2><p>${t('nText')}</p>
      <div class="acct-nick-in"><input name="nick" required minlength="2" maxlength="24" autocomplete="nickname" placeholder="${t('nPlace')}"><button class="acct-dice" type="button" title="${t('nDice')}" aria-label="${t('nDice')}">🎲</button></div>
      <label class="acct-ref">${t('refL')}<input name="ref" maxlength="24" list="acct-ref-list" autocomplete="off" placeholder="${t('refP')}"><small>${t('refHint').replace('{n}', u.friendBtns || 20)}</small></label><datalist id="acct-ref-list"></datalist>
      <p class="acct-terms">${t('pub')} <a href="${pre}/privacy/" target="_blank">${t('termsMore')} ↗</a></p>
      <p class="acct-nick-st" role="status" aria-live="polite"></p>
      <button class="pill-btn pill-fill" type="submit">${t('nSave')}</button>
      <button class="acct-nick-out" type="button">${t('nOut')}</button></form>`;
    document.body.appendChild(d);
    const bird = window.PPBirds && window.PPBirds.sprite(window.PPBirds.dress(window.PPBirds.looks(u.id), u.avatar), 0);
    if (bird && window.PPHatch) { d.classList.add('hatching'); window.PPHatch.play(d.querySelector('canvas'), bird).then(() => { d.classList.remove('hatching'); f.nick.focus(); }); } // этап 14: яйцо трескается — птичка
    else if (bird) d.querySelector('canvas').getContext('2d').drawImage(bird, 0, 0);
    d.addEventListener('cancel', e => e.preventDefault()); // Esc не закрывает
    const f = d.querySelector('form'), st = d.querySelector('.acct-nick-st');
    try { f.ref.value = localStorage.getItem('pp-ref') || ''; } catch (e) {}
    fetch('/api/birds?names=1').then(r => r.ok ? r.json() : { birds: [] }).then(x => { d.querySelector('#acct-ref-list').innerHTML = (x.birds || []).filter(b => b.nick).map(b => `<option value="${esc(b.nick)}">`).join(''); }).catch(() => {});
    const dice = d.querySelector('.acct-dice');
    dice.addEventListener('click', async () => { // 🎲 случайный свободный ник: «цвет/характер + птичка + 10–99»
      dice.classList.remove('roll'); void dice.offsetWidth; dice.classList.add('roll'); dice.disabled = true;
      const j = await fetch('/api/nick/random').then(r => r.ok ? r.json() : {}).catch(() => ({}));
      dice.disabled = false;
      if (j.nick) { f.nick.value = j.nick; st.textContent = ''; f.nick.focus(); } else st.textContent = t('nErr');
    });
    f.addEventListener('submit', async e => {
      e.preventDefault();
      const nick = f.nick.value.trim().replace(/^@/, '');
      if (!/^[\p{L}\p{N}_.-]{2,24}$/u.test(nick)) { st.textContent = t('nBad'); return; }
      const ref = f.ref.value.trim().replace(/^@/, '');
      const r = await fetch('/api/nick', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ nick, ref }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok) {
        try { localStorage.removeItem('pp-ref'); } catch (e) {}
        if (window.PPHatch) { window.PPHatch.nicked(); d.close(); d.remove(); await window.PPHatch.welcome({ nick: j.nick || nick, welcome: j.welcome, id: u.id, avatar: u.avatar }); } // «Добро пожаловать»
        location.reload(); return;
      }
      st.textContent = t(j.error === 'taken' ? 'nTaken' : j.error === 'nick' ? 'nBad' : j.error === 'ref' ? 'refBad' : 'nErr');
    });
    d.querySelector('.acct-nick-out').addEventListener('click', async () => { await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' }); location.reload(); });
    d.showModal();
    f.nick.focus();
  }

  function render() {
    const u = info.user;
    if (!u) {
      // окно входа: Google и вкладки «Вход» / «Регистрация»; во встроенном браузере (Instagram, TikTok, Facebook…) пароль — первым
      const g = `<div class="acct-g"></div>`, or = `<p class="acct-or"><span>${t('or')}</span></p>`;
      // гостю (этап 14 Б): заметная «🥚 Получить птичку» и маленькое «Войти» — обе открывают окно входа
      el.innerHTML = `<button type="button" class="acct-get" aria-label="${t('getBird')}"><span aria-hidden="true">🥚</span><span class="acct-get-t">${t('getBird')}</span></button><button type="button" class="acct-btn acct-in" aria-expanded="false" aria-haspopup="dialog" aria-label="${t('signIn')}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg><span>${t('signIn')}</span></button>
        <div class="acct-pop acct-auth${IN_APP ? ' acct-inapp' : ''}" hidden role="dialog" aria-label="${t('signIn')}"><p>${t('why')}</p>
        ${IN_APP ? `<p class="acct-warn">${t('inApp')}</p>${pwBox()}${or}${g}` : `${g}${or}${pwBox()}`}
        <p class="acct-terms">${t('pub')} ${t('terms')} <a href="${pre}/privacy/">${t('termsLink')}</a>.</p>
        ${info.dev ? '<button type="button" class="pill-btn" data-dev>dev login</button>' : ''}</div>`;
    } else {
      el.innerHTML = `<button type="button" class="acct-btn acct-me${u.admin ? ' acct-admin' : ''}" aria-expanded="false" aria-haspopup="menu" aria-label="${t('menu')}"><canvas width="40" height="52" aria-hidden="true"></canvas></button>
        <div class="acct-pop" hidden role="menu">
          <p class="acct-name">${u.nick ? '@' + esc(u.nick) : `<i>${t('noNick')}</i>`}${u.admin ? ` <span class="acct-badge">★ ${t('admin')}</span>` : ''}</p>
          ${u.nick ? `<p class="acct-btns">${u.streak ? `<span>${t('streak')(u.streak)}</span>` : ''}<span>🔘 <b>${u.buttons || 0}</b> ${t('btns')}</span></p>` : ''}
          ${u.nick ? [['/bird/', '🐦', 'profile'], ['/bird/#room', '🏠', 'room'], ['/bird/#bag', '🎒', 'bag'], ['/bird/#album', '🃏', 'album'], ['/shop/', '🛍', 'shop']]
            .map(([h, i, k]) => `<a role="menuitem" href="${pre}${h}"><i aria-hidden="true">${i}</i>${t(k)}</a>`).join('') + `<button type="button" role="menuitem" data-env><i aria-hidden="true">✉️</i>${t('env')}</button>`
            : `<a role="menuitem" href="${pre}/challenge/">${t('nick')}</a>`}
          ${u.admin ? `<hr><a role="menuitem" href="/admin/"><i aria-hidden="true">⚙</i>${t('cabinet')}</a>${document.querySelector('[data-ppb]') ? `<button type="button" role="menuitem" data-edit><i aria-hidden="true">✏️</i>${t('edit')}</button>` : ''}` : ''}
          <hr><button type="button" role="menuitem" data-out>${t('out')}</button>
        </div>`;
      // админ: режим правки блоков страницы (site-edit.js грузится только для админа)
      const ed = el.querySelector('[data-edit]');
      if (ed) ed.addEventListener('click', () => { el.querySelector('.acct-pop').hidden = true; editPage(); });
      if (u.admin && document.querySelector('[data-ppb-hidden]')) document.documentElement.classList.add('pp-admin');
      const env = el.querySelector('[data-env]'); // конвертик — лента новостей птички (news.js)
      if (env) env.addEventListener('click', () => { el.querySelector('.acct-pop').hidden = true; if (window.PPNews) window.PPNews.open(); });
      // своя страница профиля: /bird/#room и т.п. меняет только якорь — sketch-wall.js ловит hashchange
      el.querySelectorAll('.acct-pop a[href*="/bird/#"]').forEach(a => a.addEventListener('click', () => { el.querySelector('.acct-pop').hidden = true; }));
      if (window.PPBirds) el.querySelector('canvas').getContext('2d').drawImage(window.PPBirds.spriteHD(window.PPBirds.dress(window.PPBirds.looks(u.id), u.avatar), 0), -8, -2); // детальная птичка
    }
    setButtons(u && u.nick ? u.buttons || 0 : null);
    const get = el.querySelector('.acct-get');
    if (get) get.addEventListener('click', e => { e.stopPropagation(); if (window.PPHatch) window.PPHatch.click(); openSignIn(); });
    const btn = el.querySelector('.acct-btn'), pop = el.querySelector('.acct-pop');
    const close = () => { pop.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const open = pop.hidden;
      pop.hidden = !open; btn.setAttribute('aria-expanded', String(open));
      if (open && !u) { google(el.querySelector('.acct-g')); funnel('open'); loadPw(); }
    });
    document.addEventListener('click', e => { if (!el.contains(e.target)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !pop.hidden) { close(); btn.focus(); } });
    if (!u) wireAuth(pop);
    const dev = el.querySelector('[data-dev]');
    dev && dev.addEventListener('click', () => login('dev:' + (prompt('nick?', 'tester') || 'tester')));
    const out = el.querySelector('[data-out]');
    out && out.addEventListener('click', async () => {
      await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' });
      location.reload();
    });
  }

  // ---------- вход с паролем (этап 12) ----------
  const ALINA_MAIL = 'lina.otkinska@gmail.com'; // забытый пароль — письмо Алине (писем с сайта нет, по её решению)
  const IN_APP = /Instagram|FBAN|FBAV|FB_IAB|FB4A|musical_ly|BytedanceWebview|TikTok|LinkedInApp|Pinterest|Snapchat|\bLine\//i.test(navigator.userAgent);
  let resetTok = '';
  try { const q = new URLSearchParams(location.search); resetTok = /^[0-9a-f]{64}$/.test(q.get('pwreset') || '') ? q.get('pwreset') : ''; if (q.has('pwreset')) { q.delete('pwreset'); history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : '') + location.hash); } } catch (e) {}
  let funnelSent = {};
  const funnel = s => { if (funnelSent[s]) return; funnelSent[s] = 1; fetch('/api/funnel', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ f: 'login', s }), keepalive: true }).catch(() => {}); };
  const api = async (path, data) => {
    const r = await fetch('/api/' + path, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data || {}) }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : { error: 'net' };
    return { ok: !!(r && r.ok), ...j };
  };
  const EK = { wrong: 'eWrong', pw_short: 'eShort', pw_long: 'eLong', pw_common: 'eCommon', pw_same: 'eSame', email: 'eEmail', consent: 'eConsent', google: 'eGoogle', exists: 'eExists', link: 'eLink', banned: 'eBanned' };
  const errText = j => j.error === 'locked' ? t('eLocked')(j.minutes || 15) : EK[j.error] ? t(EK[j.error]) : t('nErr');
  const loadPw = () => { if (window.PPPw || document.querySelector('script[src="/assets/pw-rules.js"]')) return; const sc = document.createElement('script'); sc.src = '/assets/pw-rules.js'; document.head.appendChild(sc); }; // правила пароля — те же, что на сервере
  const pwField = (name, ac, label, hint) => `<label class="acct-l">${label}<span class="acct-pw"><input type="password" name="${name}" autocomplete="${ac}" required maxlength="200"${ac === 'new-password' ? ' minlength="8"' : ''} autocapitalize="none" spellcheck="false"><button type="button" class="acct-eye" aria-label="${t('show')}" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg></button></span>${hint ? `<small>${hint}</small>` : ''}</label>`;
  const hp = '<input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">';
  function pwBox() {
    return `<div class="acct-pwbox"><div class="acct-tabs" role="tablist"><button type="button" role="tab" data-tab="in" aria-selected="true">${t('tabIn')}</button><button type="button" role="tab" data-tab="up" aria-selected="false">${t('tabUp')}</button></div>
      <form class="acct-f" data-f="in" novalidate><label class="acct-l">${t('login')}<input name="login" autocomplete="username" required maxlength="254" autocapitalize="none" spellcheck="false"></label>
        ${pwField('password', 'current-password', t('pw'))}${hp}<p class="acct-st" role="status" aria-live="polite"></p>
        <button class="pill-btn pill-fill" type="submit">${t('doIn')}</button><button type="button" class="acct-link" data-forgot>${t('forgot')}</button></form>
      <form class="acct-f" data-f="up" hidden novalidate><label class="acct-l">${t('email')}<input type="email" name="email" autocomplete="username" required maxlength="254" autocapitalize="none" spellcheck="false"></label>
        ${pwField('password', 'new-password', t('pw'), t('pwHint'))}
        <label class="acct-ok"><input type="checkbox" name="consent" required> <span>${t('agree')} <a href="${pre}/privacy/" target="_blank">${t('termsLink')} ↗</a></span></label>${hp}
        <p class="acct-st" role="status" aria-live="polite"></p><button class="pill-btn pill-fill" type="submit">${t('doUp')}</button></form>
      <form class="acct-f" data-f="forgot" hidden novalidate>${info.mail ? `<p>${t('fgText')}</p><label class="acct-l">${t('email')}<input type="email" name="email" autocomplete="username" required maxlength="254" autocapitalize="none" spellcheck="false"></label>${hp}
        <p class="acct-st" role="status" aria-live="polite"></p><button class="pill-btn pill-fill" type="submit">${t('fgSend')}</button>`
        : `<p>${t('fgOff')}</p><a class="pill-btn pill-fill acct-mail" href="mailto:${ALINA_MAIL}" data-write>✉️ ${t('fgWrite')}</a><p class="acct-mailto">${ALINA_MAIL}</p>`}<button type="button" class="acct-link" data-back>${t('back')}</button></form></div>`;
  }
  function wireEyes(root) {
    root.querySelectorAll('.acct-eye').forEach(b => b.addEventListener('click', () => {
      const inp = b.previousElementSibling, on = inp.type === 'password';
      inp.type = on ? 'text' : 'password'; b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-label', t(on ? 'hide' : 'show')); inp.focus();
    }));
  }
  function wireAuth(pop) {
    const box = pop.querySelector('.acct-pwbox'); if (!box) return;
    const forms = Object.fromEntries([...box.querySelectorAll('form')].map(f => [f.dataset.f, f]));
    const show = k => {
      for (const [n, f] of Object.entries(forms)) f.hidden = n !== k;
      box.querySelector('.acct-tabs').hidden = k === 'forgot';
      box.querySelectorAll('[role=tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === k)));
      const first = forms[k].querySelector('input:not(.hp), button'); if (first) first.focus();
    };
    box.querySelectorAll('[role=tab]').forEach(b => b.addEventListener('click', () => show(b.dataset.tab)));
    box.querySelector('[data-forgot]').addEventListener('click', () => { const v = forms.in.login.value.trim(); show('forgot'); if (forms.forgot.email && v.includes('@')) forms.forgot.email.value = v; });
    box.querySelector('[data-back]').addEventListener('click', () => show('in'));
    wireEyes(box);
    const send = (f, path, data, ok) => async e => {
      e.preventDefault();
      const st = f.querySelector('.acct-st'), btn = f.querySelector('[type=submit]');
      const bad = [...f.querySelectorAll('input[required]')].find(i => i.type === 'checkbox' ? !i.checked : !i.value.trim());
      if (bad) { st.textContent = bad.name === 'consent' ? t('eConsent') : bad.name === 'email' ? t('eEmail') : f.dataset.f === 'in' ? t('eWrong') : t('eShort'); bad.focus(); return; }
      if (f.password && f.dataset.f === 'up') { const e2 = window.PPPw && window.PPPw.check(f.password.value, { email: f.email.value }); if (e2) { st.textContent = errText({ error: 'pw_' + e2 }); f.password.focus(); return; } }
      btn.disabled = true; st.textContent = '…';
      const j = await api(path, { ...data(f), website: f.website ? f.website.value : '', lang });
      btn.disabled = false;
      if (j.ok) return ok(j, st);
      st.textContent = errText(j);
    };
    forms.in.addEventListener('submit', send(forms.in, 'pw/login', f => ({ login: f.login.value.trim(), password: f.password.value }), () => location.reload()));
    forms.up.addEventListener('submit', send(forms.up, 'pw/register', f => ({ email: f.email.value.trim(), password: f.password.value, consent: f.consent.checked }), () => location.reload())); // дальше — окно ника, как после Google
    if (forms.forgot.email) forms.forgot.addEventListener('submit', send(forms.forgot, 'pw/forgot', f => ({ email: f.email.value.trim() }), (j, st) => { st.textContent = j.mail === false ? t('fgOff') : t('fgSent'); }));
    const w = box.querySelector('[data-write]');
    if (w) w.addEventListener('click', () => { // «Напиши Алине» — письмо на её почту с темой и текстом; пароль она сбрасывает в кабинете
      w.href = `mailto:${ALINA_MAIL}?subject=${encodeURIComponent('Pigeon Polly: ' + t('fgSubj'))}&body=${encodeURIComponent(t('fgMsg') + forms.in.login.value.trim())}`;
    });
  }
  // окно пароля: 'change' — сменить (нужен текущий), 'add' — добавить (Google-аккаунт), 'temp' — вместо временного (не закрыть), 'reset' — по ссылке из письма
  function pwDialog(mode) {
    if (document.getElementById('acct-pwd')) return;
    if (!window.PPPw) { const sc = document.createElement('script'); sc.src = '/assets/pw-rules.js'; sc.onload = () => pwDialog(mode); document.head.appendChild(sc); return; }
    const d = document.createElement('dialog'); d.id = 'acct-pwd'; d.className = 'acct-nick acct-pwd';
    const title = { change: t('pwSet'), add: t('pwAdd'), temp: t('pwTempT'), reset: t('pwResetT') }[mode];
    const text = { add: t('pwAddText'), temp: t('pwTempText') }[mode] || '';
    const me = window.PPWho && window.PPWho.user;
    d.innerHTML = `<form method="dialog" novalidate><h2>🔑 ${title}</h2>${text ? `<p>${text}</p>` : ''}
      <input type="text" name="username" autocomplete="username" value="${esc(me && me.nick || '')}" hidden>
      ${mode === 'change' ? pwField('old', 'current-password', t('pwOld')) : ''}${pwField('password', 'new-password', mode === 'change' ? t('pwNew') : t('pw'), t('pwHint'))}
      <p class="acct-nick-st" role="status" aria-live="polite"></p>
      <button class="pill-btn pill-fill" type="submit">${t('pwSave')}</button>
      ${mode === 'temp' ? `<button class="acct-nick-out" type="button" data-out>${t('nOut')}</button>` : `<button class="acct-nick-out" type="button" data-x>${t('cancel')}</button>`}</form>`;
    document.body.appendChild(d);
    if (mode === 'temp') d.addEventListener('cancel', e => e.preventDefault()); // временный пароль — только придумать свой (или выйти)
    d.addEventListener('close', () => d.remove());
    const f = d.querySelector('form'), st = d.querySelector('.acct-nick-st');
    wireEyes(d);
    const x = d.querySelector('[data-x]'); if (x) x.addEventListener('click', () => d.close());
    const o = d.querySelector('[data-out]'); if (o) o.addEventListener('click', async () => { await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' }); location.reload(); });
    f.addEventListener('submit', async e => {
      e.preventDefault();
      const e2 = window.PPPw.check(f.password.value, { nick: me && me.nick });
      if (e2) { st.textContent = errText({ error: 'pw_' + e2 }); f.password.focus(); return; }
      const j = mode === 'reset' ? await api('pw/reset', { token: resetTok, password: f.password.value }) : await api('pw/change', { old: f.old ? f.old.value : '', password: f.password.value });
      if (!j.ok) { st.textContent = errText(j); return; }
      if (mode === 'reset' || mode === 'temp') { location.reload(); return; }
      d.close(); toast(t('pwDone'));
      document.dispatchEvent(new CustomEvent('pp:pw'));
    });
    d.showModal();
    (f.old || f.password).focus();
  }
  async function logoutAll() {
    if (!confirm(t('outAllAsk'))) return;
    await fetch('/api/pw/logout-all', { method: 'POST', credentials: 'same-origin' });
    location.reload();
  }

  function editPage() {
    const go = () => window.PPEdit && window.PPEdit.toggle();
    if (window.PPEdit) go(); else { const sc = document.createElement('script'); sc.src = '/assets/site-edit.js'; sc.onload = go; document.head.appendChild(sc); }
  }
  // админ-полоска (в полоске цифр над шапкой, её видит только админ): «✏️ Править страницу» и «⚙ В кабинете: …» — нужный раздел для этой страницы
  function adminStrip() {
    const bar = document.querySelector('.statbar-in');
    if (!bar || bar.querySelector('.sb-adm') || /^\/admin\//.test(location.pathname)) return;
    const path = location.pathname.replace(/^\/(ru|lv)(?=\/)/, ''), post = document.querySelector('article.bp[data-post-id]');
    const [href, name] = post ? ['/blog-editor/#' + post.dataset.postId, 'редактор этой статьи']
      : [[/^\/shop\//, '#shop', 'Магазин'], [/^\/(art-portfolio|palettes)\//, '#art', 'Картины'], [/^\/challenge\//, '#themes', 'Темы челленджа'], [/^\/advent\//, '#advent', 'Адвент'],
        [/^\/flock\//, '#flock', 'Стая'], [/^\/(rain|potions)\//, '#games', 'Награды игр'], [/^\/bird\//, '#birds', 'Все птицы'], [/^\/blog(-editor)?\//, '/blog-editor/', 'Блог']]
        .map(([re, h, n]) => re.test(path) && [h[0] === '#' ? '/admin/' + h : h, n]).find(Boolean) || ['/admin/', 'Входящие'];
    const box = document.createElement('span'); box.className = 'sb-adm';
    box.innerHTML = `${document.querySelector('[data-ppb]') ? '<button type="button" data-sb-edit>✏️ Править страницу</button>' : ''}<a href="${href}">⚙ В кабинете: ${esc(name)}</a>`;
    bar.prepend(box);
    const b = box.querySelector('[data-sb-edit]'); if (b) b.addEventListener('click', editPage);
  }

  async function login(credential) {
    const r = await fetch('/api/login', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ credential }) });
    if (r.ok) location.reload();
  }
  function google(box) {
    if (!box || box.dataset.ready) return;
    box.dataset.ready = '1';
    const go = () => {
      window.google.accounts.id.initialize({ client_id: info.clientId, callback: r => login(r.credential), ux_mode: 'popup' });
      window.google.accounts.id.renderButton(box, { theme: 'outline', size: 'large', shape: 'pill', text: 'signin_with', locale: lang });
    };
    if (window.google?.accounts?.id) return go();
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client'; s.async = true; s.onload = go;
    document.head.appendChild(s);
  }
})();
