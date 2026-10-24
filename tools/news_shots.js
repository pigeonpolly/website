// Снимки для новостей блога (скилл .claude/skills/site-news): только картинка сцены (canvas), без подписей и кнопок — статьи переводятся.
// Запуск: python3 -m http.server 8790 --directory site &  затем  node tools/news_shots.js <room|garden|wl|shift|hol|all> [мс ходьбы]
// /api подменяется прямо здесь (данные-примеры), снимки — в _shots/news/. Новая сцена — новый блок по образцу.
const { chromium } = require('playwright');
const B = 'http://localhost:8790', O = require('path').join(__dirname, '..', '_shots', 'news') + '/';
const ME = { id: 5, nick: 'polly', avatar: {}, buttons: 120, email_ok: 1, mail_asked: 1, box0: 'x' };
async function page(b, w, h, api = {}) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.route(/^https?:\/\/(?!localhost)/, r => r.abort());
  await p.route('**/api/**', r => { const u = new URL(r.request().url()).pathname; const d = api[u]; if (!d) console.log('API?', u); r.fulfill({ status: d ? 200 : 404, contentType: 'application/json', body: JSON.stringify(d || {}) }); });
  p.on('pageerror', e => console.log('ERR', e.message));
  return p;
}
(async () => {
  require('fs').mkdirSync(O, { recursive: true });
  const b = await chromium.launch(); const which = process.argv[2] || 'all';
  if (which === 'all' || which === 'room') {
    const p = await page(b, 1100, 820);
    await p.goto(B + '/ru/garden/', { waitUntil: 'load' }); await p.waitForTimeout(800);
    await p.evaluate(() => {
      const m = document.querySelector('main'); m.innerHTML = '<div id="rr" style="max-width:900px;margin:30px auto"></div>';
      const room = { floor: 'walnut', items: [{ k: 'furn', v: 'sofa', x: 10 }, { k: 'furn', v: 'jacklantern', x: 75 }, { k: 'furn', v: 'xmastree', x: 100 }, { k: 'furn', v: 'gingerhouse', x: 140 }, { k: 'furn', v: 'teaset', x: 165 }],
        rooms: { kitchen: { wall: '', items: [{ k: 'furn', v: 'stove', x: 100 }, { k: 'furn', v: 'fridge', x: 20 }, { k: 'furn', v: 'kettle', x: 150 }, { k: 'furn', v: 'herbpots', x: 160 }] },
          crypt: { items: [{ k: 'furn', v: 'coffin', x: 90 }] }, bath: { items: [{ k: 'furn', v: 'bathtub', x: 80 }, { k: 'furn', v: 'washbasin', x: 20 }] } } };
      window.__R = PPRoom.mount(document.getElementById('rr'), { id: 5, nick: 'polly', avatar: {}, room, mine: true, me: { id: 5, nick: 'polly', room },
        doors: { open: { kitchen: 1, crypt: 1, bath: 1 }, need: { bedroom: 1, office: 1 }, have: { bedroom: 0 } } });
    });
    await p.waitForTimeout(1500);
    await p.mouse.move(0, 0); await p.addStyleTag({ content: '.room-door-btn{opacity:0!important}' }); await p.waitForTimeout(300); await (await p.$('.room-cv')).screenshot({ path: O + 'c-holiday.png' });
    for (const [id, x, file] of [['kitchen', 100, 'kitchen'], ['crypt', 90, 'crypt'], ['bath', 80, 'bath']]) {
      if (await p.isHidden('.room-plan')) await p.evaluate(() => document.querySelector('.room-door-btn').click());
      await p.click(`[data-home="${id}"]`); await p.waitForTimeout(2500);
      const cv = await p.$('.room-cv'), bb = await cv.boundingBox(), RW = await p.evaluate(() => PPRoom.RW), RH = await p.evaluate(() => PPRoom.RH);
      const k = bb.width / RW;
      await p.mouse.click(bb.x + (x + 12) * k, bb.y + (RH - (id === 'crypt' ? 12 : 22)) * k); await p.waitForTimeout(id === 'kitchen' ? 6500 : 6000); await p.mouse.move(0, 0);
      await (await p.$('.room-cv')).screenshot({ path: O + 'c-' + file + '.png' });
    }
    await p.close();
  }
  if (which === 'all' || which === 'garden') {
    const beds = [{ p: 'pumpkin', k: 1, ready: true, wet: true }, { p: 'sunflower', k: .7, wet: true, today: true }, { p: 'carrot', k: .4, wet: false }, { p: 'tulip', k: 1, ready: true }, { p: 'mandrake', k: .6, wet: true }, null];
    const p = await page(b, 1100, 900, { '/api/garden': { on: 1, owner: { id: 5, nick: 'polly', avatar: {} }, mine: false, beds, season: 'autumn', today: '2026-10-24', prices: {}, items: ['scarecrow', 'wcan', 'barrow', 'pinwheel', 'gnome'] } });
    await p.goto(B + '/ru/garden/?nick=polly', { waitUntil: 'load' }); await p.waitForTimeout(2500);
    await (await p.$('.gd-cv')).screenshot({ path: O + 'c-garden.png' }); await p.close();
  }
  if (which === 'all' || which === 'wl') {
    const p = await page(b, 1200, 760);
    await p.goto(B + '/ru/wobbleland/#walk-lemonvale', { waitUntil: 'load' }); await p.waitForTimeout(1500);
    await p.waitForTimeout(1500); console.log('open?', await p.evaluate(() => location.hash + ' ' + !!document.querySelector('.wl-tw:not([hidden])')));
    await p.keyboard.down('ArrowRight'); await p.waitForTimeout(+process.argv[3] || 2500); await p.keyboard.up('ArrowRight');
    await p.waitForTimeout(900); console.log('still', await p.evaluate(() => location.hash));
    await p.addStyleTag({ content: '.wl-tw-box *{visibility:hidden!important}.wl-tw-box canvas{visibility:visible!important}' }); await p.waitForTimeout(200); await (await p.$('.wl-tw-box canvas')).screenshot({ path: O + 'c-walk.png' }); await p.close();
  }
  if (which === 'all' || which === 'shift') {
    const p = await page(b, 1200, 900);
    await p.goto(B + '/ru/shift/', { waitUntil: 'load' }); await p.waitForTimeout(1000);
    await p.click('text=Начать смену'); await p.waitForTimeout(12000);
    await (await p.$('.sh-scene canvas, #shift canvas')).screenshot({ path: O + 'c-shift.png' }); await p.close();
  }
  if (which === 'all' || which === 'hol') {
    const p = await page(b, 1000, 900, { '/api/whoami': { user: { ...ME, news: [{ kind: 'holiday', note: 'wl:Lemon Lantern Night|Ночь лимонных фонариков|Citronu laternu nakts|LemonVale|LemonVale|LemonVale', k: 'furn', v: 'jacklantern' }] } }, '/api/stats': {} });
    await p.goto(B + '/ru/', { waitUntil: 'load' }); await p.waitForTimeout(2000);
    await p.evaluate(() => PPNews.open()); await p.waitForTimeout(800);
    await p.click('.nw-dlg button:has-text("Открыть конвертик")').catch(e => console.log('no btn', e.message)); await p.waitForTimeout(800);
    await (await p.$('.nw-in')).screenshot({ path: O + 'holiday.png' });
    await p.goto(B + '/ru/', { waitUntil: 'load' }); await p.waitForTimeout(2500);
    const w = await p.$('.wlh'); if (w) { await w.scrollIntoViewIfNeeded(); await w.screenshot({ path: O + 'hol-card.png' }); }
    await p.close();
  }
  await b.close();
})();
