// Карточки «Learning Norwegian» для постов Facebook EN (Алина 21.11.2026: посты про норвежский — на её рисунках, со словами на картинке).
// Рисунок из content/palettes.json (pal = индекс), на предметах — норвежские слова (x, y в % от рисунка), внизу — список: слово, произношение, перевод.
// node tools/fb/fb_no.js [номер…] → site/images/fb/no-<номер>.jpg (1080×1350). Данные — tools/fb/fb_no.json. Посты — Notion «Facebook posts EN», тип «Норвежский», docs/growth.md.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const PAL = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/palettes.json'), 'utf8'));
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'fb_no.json'), 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1350px;overflow:hidden}
body{background:#F4EEE3;color:#2B2A33;font-family:Karla,sans-serif;position:relative}
.art{position:absolute;left:50%;top:40px;transform:translateX(-50%);border-radius:18px;overflow:visible;box-shadow:0 10px 30px rgba(40,30,20,.18)}
.art img{display:block;width:100%;height:100%;border-radius:18px}
.tag{position:absolute;transform:translate(-50%,-50%);white-space:nowrap}
.tag i{position:absolute;left:50%;top:50%;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:#C8102E;box-shadow:0 0 0 4px #fff,0 2px 6px rgba(0,0,0,.4)}
.tag b{position:absolute;top:-58px;left:0;transform:translateX(-50%);background:#fff;color:#1F2A44;font:700 30px Karla;padding:7px 16px 8px;border-radius:12px;box-shadow:0 3px 10px rgba(0,0,0,.28);border-bottom:4px solid #C8102E}
.tag.dn b{top:24px}
.tag.l b{transform:translateX(-88%)}
.tag.r b{transform:translateX(-12%)}
.bot{position:absolute;left:70px;right:70px;bottom:46px}
.kick{font:700 24px Karla;letter-spacing:.22em;color:#C8102E;text-transform:uppercase}
.kick s{display:inline-block;width:34px;height:22px;margin-right:12px;vertical-align:-3px;text-decoration:none;background:
 linear-gradient(90deg,transparent 9px,#fff 9px,#fff 15px,transparent 15px),
 linear-gradient(0deg,transparent 8px,#fff 8px,#fff 14px,transparent 14px),#BA0C2F;position:relative;border-radius:2px}
.kick s:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 10.5px,#00205B 10.5px,#00205B 13.5px,transparent 13.5px),linear-gradient(0deg,transparent 9.5px,#00205B 9.5px,#00205B 12.5px,transparent 12.5px)}
h1{font:600 64px/1.05 Lora;margin-top:10px}
h1 em{font:italic 400 34px Lora;color:#7A7067;margin-left:16px}
.ws{display:grid;grid-template-columns:1fr 1fr;gap:16px 40px;margin-top:26px}
.ws div{border-top:2px solid #E2D7C6;padding-top:12px}
.ws b{display:block;font:700 34px Karla;color:#1F2A44}
.ws span{display:block;font:500 24px Karla;color:#8A7F74;margin-top:3px}
.ws span tt{font:400 25px 'Noto Sans',sans-serif;color:#6B6158}
.ws span u{text-decoration:none;color:#2B2A33}
.foot{position:absolute;right:70px;bottom:22px;font:italic 400 22px Lora;color:#A39888}
`;

(async () => {
  const want = process.argv.slice(2).map(Number);
  const items = want.length ? DATA.filter(x => want.includes(x.n)) : DATA;
  fs.mkdirSync(path.join(ROOT, 'site/images/fb'), { recursive: true });
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  for (const it of items) {
    const p = PAL[it.pal]; if (!p) throw new Error('no art ' + it.pal);
    const file = path.join(ROOT, 'site', p.img);
    await page.goto('file://' + file); const { w, h } = await page.evaluate(() => ({ w: document.images[0].naturalWidth, h: document.images[0].naturalHeight }));
    const rows = Math.ceil(it.w.length / 2), boxH = 1350 - 40 - (230 + rows * 98);
    let aw = 960, ah = aw * h / w; if (ah > boxH) { ah = boxH; aw = ah * w / h; }
    const tags = it.w.map(([no, , , x, y, f]) => `<div class="tag ${y < 16 || f === 'dn' ? 'dn' : ''} ${x > 78 ? 'l' : x < 20 ? 'r' : ''}" style="left:${x}%;top:${y}%"><i></i><b>${esc(no.replace(/^(en|ei|et) /, ''))}</b></div>`).join('');
    const list = it.w.map(([no, pr, en]) => `<div><b>${esc(no)}</b><span><tt>[${esc(pr)}]</tt> · <u>${esc(en)}</u></span></div>`).join('');
    const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;1,400&family=Karla:wght@400;500;700&family=Noto+Sans:wght@400&display=block"><style>${CSS}</style></head><body>
<div class="art" style="top:${40 + (boxH - ah) / 2}px;width:${aw}px;height:${ah}px"><img src="file://${file}">${tags}</div>
<div class="bot"><div class="kick"><s></s>Learning Norwegian</div><h1>${esc(it.t)}<em>${esc(it.en)}</em></h1><div class="ws">${list}</div></div>
<div class="foot">pigeonpolly.com</div></body></html>`;
    const tmp = path.join(ROOT, 'site/images/fb', '_no.html'); fs.writeFileSync(tmp, html); await page.goto('file://' + tmp, { waitUntil: 'networkidle' }); fs.unlinkSync(tmp);
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(ROOT, 'site/images/fb', `no-${it.n}.jpg`);
    await page.screenshot({ path: out, type: 'jpeg', quality: 88 });
    console.log(out);
  }
  await b.close();
})();
