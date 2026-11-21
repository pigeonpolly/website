// Пин №1410 «Палитра для маникюра» из арта «Red nail polish» (палитра details-red-nail-polish на /palettes/).
// node tools/pins/nails.js → site/images/pins/pin-1410.jpg + tools/pins/nails.json (тексты для Notion). Тема clay (v2), значок v3 winter.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const U = k => 'file://' + path.join(ROOT, 'site', k);
const P = JSON.parse(fs.readFileSync(path.join(ROOT, 'site/assets/palettes.json'))).find(p => p.key === 'details-red-nail-polish');
const C = Object.fromEntries(P.colors.map(c => [c.en, c.hex]));
const t = { bg: '#F1E7DC', fg: '#2E2521', acc: '#9E1B22', mut: '#7A6658', card: '#FBF6F0', logo: 'color-winter' };
// пальцы слева направо: мизинец, безымянный (акцент), средний, указательный, большой
const NAILS = [['Linen', 300], ['Ink Black', 360], ['Tomato', 390], ['Brick', 355], ['Latte', 270]];
const skin = '#E9CDB8';
const pin = {
  n: 1410, season: 'Зима',
  title: 'Holiday Red Manicure Color Palette from My Art, HEX Codes | Pigeon Polly',
  desc: `A nail color palette pulled from my artwork “Red nail polish”: Tomato ${C.Tomato}, Brick ${C.Brick}, Latte ${C.Latte}, Ink Black ${C['Ink Black']} and Linen ${C.Linen}. Tomato red for the classic holiday mani, one ink black accent nail, latte and linen for the soft nude ones. Save it for your next salon visit, or click any color on my site to copy its HEX.`,
  alt: 'Five painted nails in tomato red, brick, latte, ink black and linen with color names and HEX codes, under a detail of the artwork “Red nail polish” by Pigeon Polly.',
  link: 'https://www.pigeonpolly.com/palettes/?utm_source=pinterest&utm_campaign=nails#details-red-nail-polish',
  topics: 'Nail color palette, Red manicure, Holiday nails, Christmas nails, HEX codes',
};
const finger = ([name, h], i) => {
  const hex = C[name], w = 132;
  return `<div style="display:flex;flex-direction:column;align-items:center;width:${w + 30}px">
    <div style="position:relative;width:${w}px;height:${h}px;background:linear-gradient(90deg,#DDBCA4,${skin} 30%,${skin} 70%,#DDBCA4);border-radius:${w / 2}px ${w / 2}px 0 0">
      <div style="position:absolute;left:16px;right:16px;top:16px;height:${Math.round(w * 1.25)}px;background:${hex};border-radius:50px 50px 26px 26px;box-shadow:inset 0 -6px 0 rgba(0,0,0,.12),0 2px 0 rgba(0,0,0,.08)">
        <div style="position:absolute;left:18px;top:18px;width:16px;height:70px;border-radius:10px;background:rgba(255,255,255,.45)"></div>
      </div>
    </div>
    <div style="margin-top:20px;font:700 22px Karla;letter-spacing:.06em;text-transform:uppercase;color:${t.fg}">${name}</div>
    <div style="margin-top:4px;font:500 26px Karla;color:${t.mut}">${hex}</div>
  </div>`;
};
const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Karla:wght@400;500;700&family=Caveat:wght@700&display=swap"><style>
*{box-sizing:border-box;margin:0;padding:0}html,body{width:1000px;height:1500px;overflow:hidden}
body{background:${t.bg};color:${t.fg};font-family:Karla,sans-serif;position:relative}
</style></head><body>
<div style="position:absolute;left:56px;right:56px;top:56px">
  <div style="font:700 22px Karla;letter-spacing:.24em;text-transform:uppercase;color:${t.acc}">Manicure palette from my art</div>
  <h1 style="margin-top:14px;font:600 78px/1.02 Fraunces;letter-spacing:-.02em">Holiday red <em style="font-style:italic;font-weight:400;color:${t.acc}">nails</em></h1>
</div>
<div style="position:absolute;left:56px;right:56px;top:250px;height:470px;border-radius:12px;overflow:hidden;box-shadow:0 18px 40px rgba(0,0,0,.18);background:#fff">
  <img src="${U(P.img)}" style="width:100%;height:100%;object-fit:cover;object-position:50% 45%;display:block">
</div>
<div style="position:absolute;right:70px;top:690px;transform:rotate(-4deg);background:${t.card};padding:10px 22px;border-radius:8px;box-shadow:0 6px 16px rgba(0,0,0,.15);font:700 40px Caveat;color:${t.acc}">“Red nail polish”, my painting</div>
<div style="position:absolute;left:40px;right:40px;top:800px;height:${390 + 90}px;display:flex;justify-content:center;align-items:flex-end;gap:0">${NAILS.map(finger).join('')}</div>
<div style="position:absolute;left:56px;right:56px;top:1290px;text-align:center;font:700 38px Caveat;color:${t.mut}">ink black accent nail · latte &amp; linen for soft nudes</div>
<div style="position:absolute;left:44px;right:44px;bottom:26px;height:110px;display:flex;align-items:center;gap:18px">
  <img src="${U(`images/logo/v3/pigeon-polly-${t.logo}-transparent-4000.png`)}" style="width:104px;height:104px">
  <div style="font:600 30px Fraunces">pigeonpolly.com</div>
  <div style="margin-left:auto;background:${t.acc};color:#fff;font:700 25px Karla;padding:16px 24px;border-radius:40px">Copy the HEX codes →</div>
</div>
</body></html>`;
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  const tmp = path.join(__dirname, 'shots', '_nails.html'); fs.mkdirSync(path.dirname(tmp), { recursive: true });
  fs.writeFileSync(tmp, html);
  await page.goto('file://' + tmp, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(ROOT, `site/images/pins/pin-${pin.n}.jpg`), type: 'jpeg', quality: 85 });
  fs.unlinkSync(tmp); await b.close();
  fs.writeFileSync(path.join(__dirname, 'nails.json'), JSON.stringify([{ ...pin, type: 'Палитра', media: `https://www.pigeonpolly.com/images/pins/pin-${pin.n}.jpg` }], null, 1));
})();
