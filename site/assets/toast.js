// Тост внизу экрана (этап 5 Б) — один на всех: PPToast('Сохранено') или PPToast('Поставлено', { action: 'Отменить', onAction, ms: 5000 }).
// Новый тост убирает предыдущий. Возвращает { close }.
(() => {
  // «Пуговки получены, шей с умом!» — под каждым тостом с «+N 🔘» и везде, где выдаются пуговки (window.PPSew)
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0;
  window.PPSew = ['Buttons received — sew wisely!', 'Пуговки получены, шей с умом!', 'Pogas saņemtas — šuj gudri!'][L];
  let cur = null;
  function toast(msg, o = {}) {
    if (cur) cur.close();
    const d = document.createElement('div'); d.className = 'pp-toast' + (o.action ? ' pp-toast-act' : ''); d.setAttribute('role', 'status');
    const s = document.createElement('span'); s.textContent = msg; d.appendChild(s);
    if (o.sew ?? /\+\s*\d+\s*🔘/.test(msg)) { const w = document.createElement('small'); w.className = 'pp-toast-sew'; w.textContent = window.PPSew; d.appendChild(w); d.classList.add('pp-toast-2'); }
    let t1 = 0, t2 = 0;
    const close = () => { clearTimeout(t1); clearTimeout(t2); d.classList.add('off'); setTimeout(() => d.remove(), 500); if (cur === me) cur = null; };
    const me = { close };
    if (o.action) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'pp-toast-btn'; b.textContent = o.action;
      b.onclick = () => { close(); o.onAction && o.onAction(); };
      d.appendChild(document.createTextNode(' · ')); d.appendChild(b);
    }
    document.body.appendChild(d); cur = me;
    t1 = setTimeout(close, o.ms || 3800);
    return me;
  }
  window.PPToast = toast;
})();
