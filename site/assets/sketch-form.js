// Форма «Прислать рисунок на стену»: обычная отправка в FormSubmit (файлы не работают через AJAX)
// в невидимый iframe; FormSubmit перенаправляет его на /assets/sent.html — так понимаем, что всё ушло.
(() => {
  const form = document.querySelector('.sketch-form');
  if (!form) return;
  const L = { en: 0, ru: 1, lv: 2 }[document.documentElement.lang] ?? 0;
  const T = {
    sending: ['Sending…', 'Отправляю…', 'Sūta…'],
    ok: ['Thank you! Your sketch is on its way to Polly 🐦', 'Спасибо! Рисунок улетел к Полли 🐦', 'Paldies! Skice ir ceļā pie Pollijas 🐦'],
    err: ['Sorry, it didn’t go through. Please try again a bit later.', 'Не получилось отправить. Попробуйте чуть позже.', 'Diemžēl neizdevās nosūtīt. Lūdzu, pamēģini vēlāk.'],
    big: ['This file is too big or isn’t a picture.', 'Файл слишком большой или это не картинка.', 'Fails ir par lielu vai nav attēls.'],
  };
  const t = k => T[k][L];
  const file = form.elements.attachment, status = form.querySelector('.form-status'), btn = form.querySelector('button[type="submit"]');
  const prev = form.querySelector('.sketch-preview'), sink = document.querySelector('.sketch-sink');
  // тема дня — в письмо, чтобы было видно, к какому дню рисунок
  try {
    const d = new Date(), th = window.ChallengeTheme.themeFor(d, 0);
    form.elements.theme.value = `${window.ChallengeTheme.keyOf(d)} · ${th.subject}`;
  } catch (e) { /* без темы */ }

  // ужимаем фото до 1600px JPEG, чтобы быстро уходило и влезало в лимит
  async function shrink(f) {
    if (!f || !/^image\//.test(f.type)) return null;
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(f); });
    const k = Math.min(1, 1600 / Math.max(img.width, img.height));
    const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(img.src);
    const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.85));
    return blob ? new File([blob], 'sketch.jpg', { type: 'image/jpeg' }) : null;
  }
  file.addEventListener('change', async () => {
    status.textContent = ''; status.className = 'form-status';
    const f = file.files[0];
    if (!f) { prev.hidden = true; return; }
    try {
      const small = await shrink(f);
      if (small && window.DataTransfer) { const dt = new DataTransfer(); dt.items.add(small); file.files = dt.files; }
      const shown = file.files[0];
      if (shown.size > 9e6) throw new Error('big');
      prev.querySelector('img').src = URL.createObjectURL(shown); prev.hidden = false;
    } catch (e) {
      file.value = ''; prev.hidden = true; status.className = 'form-status error'; status.textContent = t('big');
    }
  });

  let waiting = false;
  form.addEventListener('submit', e => {
    if (form.elements._honey.value) { e.preventDefault(); return; }
    waiting = true; btn.disabled = true;
    status.className = 'form-status'; status.textContent = t('sending');
    setTimeout(() => { if (waiting) done(false); }, 45000);
  });
  function done(ok) {
    waiting = false; btn.disabled = false;
    status.className = 'form-status ' + (ok ? 'ok' : 'error');
    status.textContent = t(ok ? 'ok' : 'err');
    if (ok) { form.reset(); prev.hidden = true; }
  }
  sink.addEventListener('load', () => {
    if (!waiting) return;
    let ok = false;
    try { ok = /\/assets\/sent\.html$/.test(sink.contentWindow.location.pathname); } catch (e) { ok = false; }
    done(ok);
  });
})();
