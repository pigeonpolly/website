// node tools/norsk/draw.js [номер…]  → site/images/norsk-lv/post-<N>.jpg (1920×1080)
// Данные — tools/norsk/posts.json: [{n, scene, wing, face, look, prop, propAt, flip, at, scale, items:[{prop, at, scale}]}]
// Сцены: forest | winter | cozy. Крыло: down | hold | scratch | wave. Лицо: calm | happy | worried | surprised.
// Реквизит: phone mug book bun candle basket ski letter.  Без номеров — все.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { compose } = require('./polly-art.js');
const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'site/images/norsk-lv');

(async () => {
  const all = JSON.parse(fs.readFileSync(path.join(__dirname, 'posts.json'), 'utf8'));
  const want = process.argv.slice(2).map(Number);
  const list = want.length ? all.filter(p => want.includes(p.n)) : all;
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch(), pg = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const p of list) {
    await pg.setContent(`<html><body style="margin:0">${compose(p)}</body></html>`);
    const f = path.join(OUT, `post-${String(p.n).padStart(3, '0')}.jpg`);
    await pg.screenshot({ path: f, type: 'jpeg', quality: 88, clip: { x: 0, y: 0, width: 1920, height: 1080 } });
    console.log(path.relative(ROOT, f));
  }
  await b.close();
})();
