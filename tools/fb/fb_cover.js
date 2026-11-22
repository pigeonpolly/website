// Обложка страницы Facebook 1640×624 (зимняя): тёмный фон, слева — значок, «Paint small, joyful things» и что есть на сайте, справа — коллаж рисунков и пиксельных игр с Полли.
// Безопасная зона: телефон показывает середину ~1110 px (x 265–1375), на компьютере фото профиля закрывает низ слева — там пусто.
// node tools/fb/fb_cover.js → site/images/fb/facebook-cover.jpg (+ facebook-cover-safe.jpg с рамкой обрезки для проверки)
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const U = p => 'file://' + path.join(ROOT, 'site/images', p);
const C = { bg: '#1E2832', bg2: '#2B3743', paper: '#F8F4EC', ink: '#1C2430', mut: '#B9C2CB', acc: '#E2544A', acc2: '#F2C46B', blue: '#93AFCC' };

const ph = (src, x, y, w, h, r, cap = '', pos = 'center', cls = '') =>
  `<figure class="ph ${cls}" style="left:${x}px;top:${y}px;width:${w}px;transform:rotate(${r}deg)"><div style="height:${h}px;background-image:url('${U(src)}');background-position:${pos}"></div>${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;

const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Karla:wght@400;700&family=Caveat:wght@700&display=swap">
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1640px;height:624px;overflow:hidden}
body{background:${C.bg};font-family:Karla,sans-serif;position:relative;color:${C.paper}}
body:before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 30% 40%,${C.bg2},transparent 60%),radial-gradient(circle at 80% 50%,rgba(147,175,204,.18),transparent 50%)}
body:after{content:"";position:absolute;inset:0;opacity:.5;background:url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' seed='2'/%3E%3CfeColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .07 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");pointer-events:none;z-index:50}
.snow{position:absolute;border-radius:50%;background:#fff;opacity:.5}
.ph{position:absolute;background:${C.paper};padding:12px 12px 0;box-shadow:0 4px 8px rgba(0,0,0,.25),0 26px 50px rgba(0,0,0,.45)}
.ph div{background-size:cover;background-repeat:no-repeat}
.ph figcaption{font:700 27px/1 Caveat;color:${C.ink};text-align:center;padding:9px 0 11px}
.ph.px div{image-rendering:pixelated}
.ph:not(:has(figcaption)){padding-bottom:12px}
.tape{position:absolute;width:110px;height:32px;background:rgba(242,196,107,.55);z-index:20}
.badge{position:absolute;left:296px;top:40px;width:128px;filter:drop-shadow(0 8px 14px rgba(0,0,0,.4))}
.brand{position:absolute;left:440px;top:66px;font:700 40px Caveat;color:${C.acc2};transform:rotate(-2deg)}
.where{position:absolute;left:442px;top:116px;font:700 15px Karla;letter-spacing:.28em;color:${C.mut}}
h1{position:absolute;left:296px;top:190px;font:400 92px/.96 Fraunces;font-variation-settings:"opsz" 144;letter-spacing:-.035em;white-space:nowrap}
h1 em{color:${C.acc};font-style:italic;position:relative}
h1 svg{position:absolute;left:-4px;bottom:-6px}
.sub{position:absolute;left:300px;top:388px;width:600px;font:400 23px/1.4 Karla;color:${C.mut}}
.sub b{color:${C.paper}}
.chips{position:absolute;left:300px;top:438px;display:flex;gap:8px;width:640px}
.chips span{border:1.5px solid rgba(248,244,236,.35);border-radius:40px;padding:7px 12px;font:700 15px Karla;white-space:nowrap;color:${C.paper};background:rgba(255,255,255,.04)}
.url{position:absolute;left:968px;top:548px;z-index:30;background:${C.acc};color:#fff;border-radius:40px;padding:13px 30px;font:700 25px Karla;box-shadow:0 10px 24px rgba(0,0,0,.35)}
.note{position:absolute;font:700 31px Caveat;color:${C.acc2};z-index:30}
.note svg{position:absolute}
</style></head><body>
${Array.from({ length: 46 }, (_, i) => { const x = (i * 197) % 1640, y = (i * 113) % 624, s = 2 + (i % 4); return `<i class="snow" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;opacity:${.15 + (i % 5) * .08}"></i>`; }).join('')}

<!-- края: на телефоне обрезаются -->
${ph('sketchbook/sketchbook-15-800.jpg', -40, 30, 250, 200, -7, 'cloudberries')}
${ph('games/wobbleland.png', 40, 330, 190, 190, 5, '', 'center', 'px')}
${ph('sketchbook/sketchbook-17-800.jpg', 1420, 20, 250, 190, 6, 'persimmons')}
${ph('games/advent.png', 1440, 330, 200, 200, -5, '', 'center', 'px')}

<!-- коллаж -->
${ph('v2/hero-winter-900.jpg', 910, 40, 320, 215, -4, 'rooftops & towers ❄', 'center 55%')}
<div class="tape" style="left:1015px;top:26px;transform:rotate(3deg)"></div>
${ph('sketchbook/sketchbook-21-800.jpg', 1205, 100, 180, 180, 7, '', 'center 40%')}
${ph('games/train.png', 905, 340, 220, 150, 3, 'Polly’s train', 'center 70%', 'px')}
${ph('sketchbook/sketchbook-11-800.jpg', 1160, 310, 210, 160, -6, 'coffee & ink')}
<div class="tape" style="left:1220px;top:298px;transform:rotate(-8deg)"></div>

<div class="note" style="left:700px;top:276px;transform:rotate(-8deg)">come paint<br>&nbsp;with me!</div>

<img class="badge" src="${U('logo/v3/pigeon-polly-color-winter-transparent-4000.png')}">
<div class="brand">Pigeon Polly Art Lab</div>
<div class="where">BY ARTIST ALINA OTKINSKA · RIGA</div>
<h1>Paint small,<br><em>joyful<svg width="280" height="30" viewBox="0 0 420 40" preserveAspectRatio="none"><path d="M6 30 C120 8 280 6 412 22" stroke="${C.acc}" stroke-width="7" fill="none" stroke-linecap="round"/></svg></em> things</h1>
<div class="sub"><b>Free</b> watercolour &amp; ink lessons — and a bit of play.</div>
<div class="chips"><span>🎨 lessons</span><span>🖌 palettes</span><span>📅 30-day challenge</span><span>🕹 games with Polly</span></div>
<div class="url">pigeonpolly.com&nbsp; →</div>
</body></html>`;

(async () => {
  const out = path.join(ROOT, 'site/images/fb');
  const tmp = path.join(out, '_cover.html'); fs.writeFileSync(tmp, html);
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1640, height: 624 } });
  await page.goto('file://' + tmp, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(out, 'facebook-cover.jpg'), type: 'jpeg', quality: 92 });
  if (process.argv.includes('--safe')) {
    await page.addStyleTag({ content: `.__s{position:absolute;z-index:99;border:3px dashed #0f0;pointer-events:none}` });
    await page.evaluate(() => { for (const [l, t, w, h, c] of [[265, 0, 1110, 624, '#0f0'], [60, 450, 340, 174, '#f0f']]) { const d = document.createElement('div'); d.className = '__s'; Object.assign(d.style, { left: l + 'px', top: t + 'px', width: w + 'px', height: h + 'px', borderColor: c }); document.body.appendChild(d); } });
    await page.screenshot({ path: path.join(out, '_cover-safe.jpg'), type: 'jpeg', quality: 80 });
  }
  fs.unlinkSync(tmp); await b.close();
})();
