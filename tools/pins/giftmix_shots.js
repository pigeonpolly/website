// Кадры открыток для пинов и постов «Отправить подарок» (tools/pins/giftmix.js): tools/pins/gm/pc-<id>.png (не в git).
// Нужен python3 -m http.server 8799 --directory site. Тот же рисунок, что на /postcards/ (?shot=<id>), кадр t=0.35, 2×.
const { chromium } = require('playwright');
const path = require('path');
const D = require('../../site/assets/postcard-designs.js') || globalThis.PPPostcardDesigns;
(async () => {
  const b = await chromium.launch(), out = path.join(__dirname, 'gm');
  const p = await b.newPage({ viewport: { width: 600, height: 420 }, deviceScaleFactor: 2 });
  await p.route('**/api/**', r => r.fulfill({ json: {} }));
  for (const d of globalThis.PPPostcardDesigns.DESIGNS) {
    await p.goto(`http://127.0.0.1:8799/postcards/?shot=${d.id}`); await p.waitForFunction(() => window.PPPostcard && PPPostcard.draw);
    await p.evaluate(id => PPPostcard.ready(id), d.id); await p.waitForTimeout(300);
    await p.evaluate(t => PPPostcard.draw(t), 0.35);
    await p.locator('#pc-shot .pc-pic').screenshot({ path: `${out}/pc-${d.id}.png` });
  }
  // шапка страницы: Полли с мешком подарков
  const q = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await q.route('**/api/**', r => r.fulfill({ json: { left: 60, max: 89, sent: 0 } }));
  await q.goto('http://127.0.0.1:8799/postcards/'); await q.waitForTimeout(1500);
  await q.locator('#pc-hero').screenshot({ path: `${out}/hero.png` });
  await b.close();
})();
