// Кадры страниц сайта для пинов «Сайт: Воббленд, открытки, тулы, игры, темы» (tools/pins/site5.js) → tools/pins/s5/<имя>.png (не в git).
// Нужен python3 -m http.server 8799 --directory site. /api подменяется пустым ответом. node tools/pins/site5_shots.js [имя…]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const out = path.join(__dirname, 's5'); fs.mkdirSync(out, { recursive: true });
const B = 'http://127.0.0.1:8799';
const SH = [
  // имя, адрес, ширина, высота, селектор (или null — экран), ожидание мс
  ['wl-top', '/wobbleland/', 1440, 1000, null, 2500],
  ['wl-m', '/wobbleland/', 390, 844, null, 2500],
  ['wl-full', '/wobbleland/', 1440, 1000, 'full', 2500],
  ['wl-walk', '/wobbleland/#walk-snailhollow', 1440, 900, null, 3500],
  ...['lemonvale','noodleford','kettleford','buttonspire','pinecrust','maplewink','newwobbleton','jamshire','cheddarford','department','snailhollow'].map(k => ['walk-' + k, '/wobbleland/#walk-' + k, 1440, 900, '.wl-tw-stage', 3500]),
  ['wl-tear', '/wobbleland/', 1440, 1000, '#wl-tear', 2500],
  ['wl-book', '/wobbleland/', 1440, 1000, '#wl-book', 2500],
  ['games', '/games/', 1440, 1000, null, 1500],
  ['games-m', '/games/', 390, 844, 'full', 1500],
  ['palettes', '/palettes/', 1440, 1000, null, 2000],
  ['mixing', '/color-mixing/', 1440, 1000, null, 2000],
  ['mixing-m', '/color-mixing/', 390, 844, 'full', 2000],
  ['prompts', '/prompts/', 1440, 1000, null, 2000],
  ['challenge', '/challenge/', 1440, 1000, null, 2000],
  ['freebies', '/freebies/', 1440, 1000, null, 2000],
  ['helps', '/polly-helps/', 1440, 1000, null, 2000],
  ['learn', '/learn/', 1440, 1000, null, 2000],
  ['ink', '/ink/', 1440, 1000, null, 2000],
  ['artpill', '/art-pill/', 1440, 1000, null, 2000],
  ['requests', '/requests/', 1440, 1000, null, 2000],
  ['titos', '/titos/', 1440, 1000, null, 2500],
  ['train', '/train/', 1440, 1000, null, 2500],
  ['shift', '/shift/', 1440, 1000, null, 2500],
  ['office', '/polly-office/', 1440, 1000, null, 2500],
  ['pancakes', '/pancakes/', 1440, 1000, null, 2500],
  ['potions', '/potions/', 1440, 1000, null, 2500],
  ['rain', '/rain/', 1440, 1000, null, 2500],
  ['flock', '/flock/', 1440, 1000, null, 2500],
  ['garden', '/garden/', 1440, 1000, null, 2500],
  ['advent', '/advent/', 1440, 1000, null, 2500],
  ['how', '/how/', 1440, 1000, null, 1500],
  ['home', '/', 1440, 1000, null, 2000],
  ['postcards', '/postcards/', 1440, 1000, null, 2000],
];
(async () => {
  const only = process.argv.slice(2);
  const b = await chromium.launch();
  for (const [n, u, w, h, sel, wait] of SH) {
    if (only.length && !only.includes(n)) continue;
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: w < 500 ? 3 : 1.5 });
    await p.route('**/api/**', r => r.fulfill({ json: {} }));
    try {
      await p.goto(B + u, { waitUntil: 'load' }); await p.waitForTimeout(wait);
      await p.evaluate(() => document.querySelectorAll('[class*=cookie],[id*=cookie]').forEach(e => e.remove()));
      if (sel === 'full') await p.screenshot({ path: `${out}/${n}.png`, fullPage: true });
      else if (sel) await p.locator(sel).first().screenshot({ path: `${out}/${n}.png` });
      else await p.screenshot({ path: `${out}/${n}.png` });
    } catch (e) { console.log('✗', n, e.message.split('\n')[0]); }
    await p.close();
  }
  await b.close();
})();
