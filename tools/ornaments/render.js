// PDF и картинки листов: node tools/ornaments/render.js (после make.py); обложку 800×550 собирает cover.py.
const {chromium} = require('playwright'), path = require('path');
(async () => {
  const out = path.join(__dirname, 'out'), b = await chromium.launch(), p = await b.newPage({viewport: {width: 1123, height: 794}, deviceScaleFactor: 2});
  await p.goto('file://' + path.join(out, 'ornaments.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
  await p.pdf({path: path.join(out, 'ornaments.pdf'), width: '297mm', height: '210mm', printBackground: true});
  const pgs = await p.$$('.pg');
  for (let i = 0; i < pgs.length; i++) await pgs[i].screenshot({path: path.join(out, 'p' + (i + 1) + '.png')});
  await b.close(); console.log('ok');
})();
