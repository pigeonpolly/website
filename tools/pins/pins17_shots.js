// Кадры адвента для пинов №1223+ (SET=17): улица 31 окошка, дома, окна — с локального site/ (нужен python3 -m http.server 8799 --directory site).
// /api/advent подменяется состоянием «до 1 декабря»: все окна заморожены, внутри ничего не видно.
const { chromium } = require('playwright');
const path = require('path');
const OUT = path.join(__dirname, 'p17');
(async () => {
  require('fs').mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 2 });
  await p.route('**/api/**', r => r.request().url().includes('/api/advent')
    ? r.fulfill({ json: { now: Date.parse('2026-11-25T12:00:00Z'), startsAt: Date.parse('2026-11-30T22:00:00Z'), today: 0, special: [6, 12, 19, 24, 31], claimTo: 0, past: [], opened: [], user: null, year: 2026 } })
    : r.fulfill({ json: {} }));
  await p.goto('http://127.0.0.1:8799/advent/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '.snow,.stars{display:none!important}' });
  await p.waitForTimeout(800);
  await (await p.$('.street')).screenshot({ path: path.join(OUT, 'adv-street.png'), omitBackground: true });
  const hs = await p.$$('.street .house');
  for (let i = 0; i < hs.length; i++) await hs[i].screenshot({ path: path.join(OUT, `adv-house${i}.png`), omitBackground: true });
  for (const d of [1, 6, 12, 19, 24, 31]) await (await p.$(`.win[data-d="${d}"]`)).screenshot({ path: path.join(OUT, `adv-win${d}.png`), omitBackground: true });
  await b.close();
})();
