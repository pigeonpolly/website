// PDF и картинки листов: node tools/ornaments/render.js (после make.py) → out/<id>.pdf, out/<id>-p1.png, -p2.png.
const {chromium} = require('playwright'), path = require('path'), fs = require('fs');
(async () => {
  const out = path.join(__dirname, 'out'), b = await chromium.launch();
  for (const f of fs.readdirSync(out).filter(f => f.endsWith('.html'))) {
    const id = f.slice(0, -5), p = await b.newPage({viewport: {width: 1123, height: 794}, deviceScaleFactor: 2});
    await p.goto('file://' + path.join(out, f)); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
    await p.pdf({path: path.join(out, id + '.pdf'), width: '297mm', height: '210mm', printBackground: true});
    const pgs = await p.$$('.pg');
    for (let i = 0; i < pgs.length; i++) await pgs[i].screenshot({path: path.join(out, `${id}-p${i + 1}.png`)});
    await p.close(); console.log('ok', id);
  }
  await b.close();
})();
