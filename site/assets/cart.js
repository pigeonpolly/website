// 🛒 Корзина магазина: вещи откладываются, а не покупаются сразу. Хранится в браузере (localStorage `pp-cart`: [[kind, item, n]]).
// В шапке — #hd-cart рядом с «🔘 N» (src/layout.html; виден, когда видны пуговки — account.js setButtons) с числом вещей → /shop/#cart.
// Окно корзины (сумма, количество, «Купить всё») рисует магазин (src/pages/shop.html). PPCart: list, add, set, clear, count, total
(() => {
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0;
  const KEY = 'pp-cart';
  const read = () => { try { const a = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(a) ? a.filter(x => Array.isArray(x) && x[0] && x[1] && x[2] > 0) : []; } catch (e) { return []; } };
  const write = a => { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) { /* нет хранилища */ } draw(); dispatchEvent(new CustomEvent('pp-cart')); };
  const list = () => read().map(x => ({ kind: x[0], item: x[1], n: x[2] }));
  const count = () => read().reduce((s, x) => s + x[2], 0);
  const has = (k, v) => { const r = read().find(x => x[0] === k && x[1] === v); return r ? r[2] : 0; };
  // n = 0 — убрать из корзины
  function set(k, v, n) {
    const a = read(), i = a.findIndex(x => x[0] === k && x[1] === v);
    n = Math.max(0, Math.floor(n) || 0);
    if (i >= 0) { if (n) a[i][2] = n; else a.splice(i, 1); } else if (n) a.push([k, v, n]);
    write(a);
  }
  const add = (k, v, n) => set(k, v, has(k, v) + (n || 1));
  const clear = () => write([]);
  // сумма по ценам магазина: price(k, v) → число
  const total = price => list().reduce((s, x) => s + (price(x.kind, x.item) || 0) * x.n, 0);

  function draw() {
    const a = document.getElementById('hd-cart');
    if (!a) return;
    const n = count(), b = a.querySelector('.bell-n');
    b.textContent = n ? String(n) : ''; b.hidden = !n;
    a.classList.toggle('has', n > 0);
    a.setAttribute('aria-label', ['Cart', 'Корзина', 'Grozs'][L] + (n ? ` (${n})` : ''));
    a.title = ['Shop cart', 'Корзина магазина', 'Veikala grozs'][L];
  }
  // в другой вкладке поменяли корзину — число в шапке тоже
  addEventListener('storage', e => { if (e.key === KEY) { draw(); dispatchEvent(new CustomEvent('pp-cart')); } });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', draw); else draw();
  window.PPCart = { list, add, set, has, clear, count, total };
})();
