// node render.js in.svg out.png — SVG sheet to PNG with Chromium.
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const [inp, out] = process.argv.slice(2);
  const svg = fs.readFileSync(inp, 'utf8');
  const w = +svg.match(/width="(\d+)"/)[1], h = +svg.match(/height="(\d+)"/)[1];
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(`<body style="margin:0">${svg}</body>`);
  await page.screenshot({ path: out });
  await browser.close();
})();
