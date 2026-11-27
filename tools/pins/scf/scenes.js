// node tools/pins/scf/scenes.js → tools/pins/scf/polly-<сцена>.png (пиксельные сцены с Полли, ×5)
const fs = require('fs'), path = require('path'); const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + path.join(__dirname, 'scenes.html')); await p.waitForFunction(() => window.PollyPet && window.render);
  for (const n of ['doodle', 'market', 'layer', 'wobble', 'norsk', 'dark4pm']) {
    const d = await p.evaluate(([n]) => render(n, 5), [n]);
    fs.writeFileSync(path.join(__dirname, `polly-${n}.png`), Buffer.from(d.split(',')[1], 'base64'));
  }
  await b.close();
})();
