// Тост внизу экрана (этап 5 Б) — один на всех: PPToast('Сохранено') или PPToast('Поставлено', { action: 'Отменить', onAction, ms: 5000 }).
// Новый тост убирает предыдущий. Возвращает { close }.
(() => {
  let cur = null;
  function toast(msg, o = {}) {
    if (cur) cur.close();
    const d = document.createElement('div'); d.className = 'pp-toast' + (o.action ? ' pp-toast-act' : ''); d.setAttribute('role', 'status');
    const s = document.createElement('span'); s.textContent = msg; d.appendChild(s);
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
