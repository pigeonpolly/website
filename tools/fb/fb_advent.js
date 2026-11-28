// FB EN advent posts: one picture per day 1–31 → site/images/fb/advent-dNN.jpg (1080×1350).
// Needs: python3 -m http.server 8799 --directory site. /api/advent is mocked: day N = today, 1…N-1 opened (nothing inside shown).
// node tools/fb/fb_advent.js [day…]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const DATA = require('./fb_advent-data.js');
const OUT = path.join(__dirname, '..', '..', 'site', 'images', 'fb');
const SPECIAL = [6, 12, 19, 24, 31];
const WIDE = [1, 2, 8, 11, 15, 18, 22, 28]; // posts about the whole street: the street, not one house
const days = process.argv.slice(2).map(Number).filter(Boolean);
const list = days.length ? days : DATA.map((_, i) => i + 1);

(async () => {
  const b = await chromium.launch();
  for (const N of list) {
    const p = await b.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 2 });
    const opened = []; for (let d = 1; d < N; d++) opened.push({ day: d, kind: null, item: null, buttons: 10 });
    await p.route('**/api/**', r => r.request().url().includes('/api/advent')
      ? r.fulfill({ json: { v: 2, year: 2026, month: 12, today: N, claimTo: N, now: Date.parse(`2026-12-${String(N).padStart(2, '0')}T10:00:00Z`), startsAt: Date.parse('2026-11-30T22:00:00Z'), nextAt: Date.parse('2027-12-01T00:00:00Z'), special: SPECIAL, user: { id: 1, nick: 'polly' }, opened, past: [] } })
      : r.fulfill({ json: {} }));
    await p.goto('http://127.0.0.1:8799/advent/', { waitUntil: 'networkidle' });
    await p.addStyleTag({ content: '.snow{display:none!important} *{animation:none!important;transition:none!important} html,body,.advw,.advw .sky{background:transparent!important}' });
    await p.waitForTimeout(700);
    const street = await p.$('.street');
    const house = await p.evaluateHandle(n => document.querySelector(`.win[data-d="${n}"]`).closest('.house'), N);
    const geo = await p.evaluate(n => {
      const w = document.querySelector(`.win[data-d="${n}"]`), h = w.closest('.house'), s = document.querySelector('.street');
      const r = e => { const q = e.getBoundingClientRect(); return { x: q.x, y: q.y, w: q.width, h: q.height }; };
      return { win: r(w), house: r(h), street: r(s) };
    }, N);
    const sImg = (await street.screenshot({ omitBackground: true })).toString('base64');
    const hImg = (await house.screenshot({ omitBackground: true })).toString('base64');
    const garland = await p.evaluate(() => { const g = document.getElementById('garland'); return g ? g.outerHTML : ''; });
    const d = DATA[N - 1], sp = SPECIAL.includes(N);
    // house: fit into 900×640 box
    const wide = WIDE.includes(N), box = wide ? geo.street : geo.house, img = wide ? sImg : hImg;
    const hs = Math.min((wide ? 1080 : 900) / box.w, 640 / box.h), HW = box.w * hs, HH = box.h * hs;
    const ring = (g, base, k, pad) => `left:${(g.x - base.x) * k - pad}px;top:${(g.y - base.y) * k - pad}px;width:${g.w * k + pad * 2}px;height:${g.h * k + pad * 2}px`;
    await p.setViewportSize({ width: 1080, height: 1350 });
    await p.evaluate(({ html }) => { document.body.innerHTML = html; document.body.style.margin = 0; }, { html: `
<style>
.fbx{width:1080px;height:1350px;position:relative;overflow:hidden;background:radial-gradient(120% 70% at 50% 0%,#1d2b4f 0%,#121a33 55%,#0b1124 100%);font-family:Karla,sans-serif;color:#fff}
.fbx .fbx-st i{position:absolute;width:3px;height:3px;border-radius:50%;background:#fff;opacity:.55}
.fbx-k{position:absolute;top:${wide ? 220 : 64}px;width:100%;text-align:center;font-size:24px;letter-spacing:.28em;font-weight:700;color:#E9C46A}
.fbx-h{position:absolute;top:${wide ? 270 : 110}px;left:60px;right:60px;text-align:center;font-family:Fraunces,Georgia,serif;font-size:74px;line-height:1.02;font-weight:700;letter-spacing:-.01em}
.fbx-h em{color:#E9C46A;font-style:italic;font-weight:600}
.fbx-gar{position:absolute;top:${wide ? 372 + 640 - HH - 120 : 300}px;left:140px;width:800px;height:44px}
.fbx-gar svg{width:100%;height:100%}
.fbx-hb{position:absolute;left:${(1080 - HW) / 2}px;top:${372 + (640 - HH)}px;width:${HW}px;height:${HH}px}
.fbx-hb img{width:100%;height:100%;display:block}
.fbx-rg{position:absolute;border:${wide ? 3 : 5}px solid #FFD77A;border-radius:18px;box-shadow:0 0 0 6px rgba(255,215,122,.25),0 0 40px 10px rgba(255,215,122,.45)}
.fbx-ch{position:absolute;top:395px;left:90px;right:90px;display:flex;flex-wrap:wrap;justify-content:center;gap:14px}
.fbx-ch span{padding:10px 22px;border:2px solid rgba(233,196,106,.55);border-radius:40px;font-size:25px;font-weight:700;color:#FFE9B0;background:rgba(233,196,106,.08)}
.fbx-snow{position:absolute;left:0;right:0;top:1008px;height:340px;background:#EEF2F7}
.fbx-f{position:absolute;left:0;right:0;top:1060px;text-align:center;color:#24324F}
.fbx-f .fbx-a{font-family:Fraunces,Georgia,serif;font-size:46px;font-weight:700}
.fbx-f .fbx-a em{color:#B3261E;font-style:italic}
.fbx-f .fbx-b{margin-top:14px;font-size:27px;color:#4A5873}
.fbx-f .fbx-u{display:inline-block;margin-top:30px;padding:16px 38px;border-radius:40px;background:#B3261E;color:#fff;font-weight:700;font-size:28px;letter-spacing:.06em}
</style>
<div class="fbx">
  <div class="fbx-st">${Array.from({ length: 60 }, (_, i) => `<i style="left:${(i * 137.5) % 100}%;top:${(i * 61.8) % 30}%"></i>`).join('')}</div>
  <div class="fbx-k">${sp ? '★ ' : ''}${d.s.toUpperCase()}${sp ? ' ★' : ''}</div>
  <div class="fbx-h">${d.h.replace(/(\d+)/, '<em>$1</em>')}</div>
  ${d.chips ? `<div class="fbx-ch">${d.chips.map(c => `<span>${c}</span>`).join('')}</div>` : ''}
  <div class="fbx-gar">${garland}</div>
  <div class="fbx-hb"><img src="data:image/png;base64,${img}"><div class="fbx-rg" style="${ring(geo.win, box, hs, wide ? 5 : 10)}"></div></div>
  <div class="fbx-snow"></div>
  <div class="fbx-f"><div class="fbx-a">${d.foot || `Window <em>${N}</em> is waiting for you`}</div><div class="fbx-b">A free advent for grown-ups · a file to keep + a gift for your bird</div><div class="fbx-u">pigeonpolly.com/advent</div></div>
</div>` });
    await p.waitForTimeout(150);
    const file = path.join(OUT, `advent-d${String(N).padStart(2, '0')}.jpg`);
    await p.setViewportSize({ width: 1080, height: 1350 });
    const buf = await p.screenshot({ type: 'jpeg', quality: 88, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
    fs.writeFileSync(file, buf);
    console.log(file);
    await p.close();
  }
  await b.close();
})();
