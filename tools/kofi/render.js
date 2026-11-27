// node tools/kofi/render.js (после palette_book.py) → kofi/palette-book/: PDF, ZIP файлов, картинки для Ko-fi и пинов.
const {chromium} = require('playwright'), path = require('path'), fs = require('fs'), {execFileSync} = require('child_process');
const W = path.resolve(__dirname, '../..'), OUT = path.join(__dirname, 'out'), PROD = path.join(W, 'kofi/palette-book');
(async () => {
  fs.mkdirSync(path.join(PROD, 'images'), {recursive: true}); fs.mkdirSync(path.join(OUT, 'shots'), {recursive: true});
  const b = await chromium.launch(), p = await b.newPage({viewport: {width: 816, height: 1056}, deviceScaleFactor: 2});
  await p.goto('file://' + path.join(OUT, 'book.html'), {timeout: 120000}); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1500);
  const pdf = path.join(PROD, 'pigeon-polly-172-color-palettes.pdf');
  await p.pdf({path: pdf, width: '8.5in', height: '11in', printBackground: true, timeout: 300000});
  const pages = JSON.parse(fs.readFileSync(path.join(OUT, 'pages.json'))), secs = await p.$$('.pg'), shot = {};
  console.log('pages', secs.length);
  // снимки страниц для проверки (out/shots/pN.png) и для превью
  const nums = new Set([1, 2, 3, 4, 5, 6, 7, 8, ...process.argv.slice(2).map(Number)]);
  Object.values(pages).forEach(n => nums.add(n));
  for (const n of [...nums].filter(n => n <= secs.length && n <= 40)) await secs[n - 1].screenshot({path: path.join(OUT, 'shots', `p${n}.png`)});
  for (const k of ['cover', '1', '20']) { const n = pages[k], f = path.join(OUT, 'shots', `p${n}.png`); if (!fs.existsSync(f)) await secs[n - 1].screenshot({path: f}); shot[k] = f; }
  const q = await b.newPage({viewport: {width: 1100, height: 1600}, deviceScaleFactor: 1});
  await q.goto('file://' + path.join(OUT, 'previews.html')); await q.evaluate(() => document.fonts.ready);
  await q.evaluate(m => document.querySelectorAll('img[data-page]').forEach(i => i.src = 'file://' + (m[i.dataset.page] || m['20'])), shot);
  await q.waitForTimeout(800);
  for (const id of ['pin1', 'pin2', 'pin3', 'square']) await (await q.$('#' + id)).screenshot({path: path.join(PROD, 'images', id + '.png')});
  await b.close();
  const zip = path.join(PROD, 'palette-files.zip'); if (fs.existsSync(zip)) fs.unlinkSync(zip);
  execFileSync('zip', ['-qr', zip, '.'], {cwd: path.join(OUT, 'files')});
  console.log('ok', (fs.statSync(pdf).size / 1e6).toFixed(1) + ' MB');
})();
