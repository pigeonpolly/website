// Шапка профиля Pinterest 1920×1080 (16:9) по мотивам главной v2: «Paint small, joyful things», Полли в поезде, значок v3.
// Важное — в середине по высоте и не в правом верхнем углу (там кнопки Pinterest). node tools/pins/cover.js [winter|autumn] → site/images/pins/pinterest-cover-<сезон>.jpg (цвета — site/assets/v2.css, арт и подпись — site/assets/v2.js)
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const U = p => 'file://' + path.join(ROOT, 'site/images', p);
const SEASON = process.argv[2] || 'winter';
const S = {
  autumn: { C: { bg: '#F4F0EA', sheet: '#FBF9F5', ink: '#2A211C', mut: '#6C6058', line: '#DED5CA', acc: '#22405F', acc2: '#93AFCC' }, glow: 'rgba(147,175,204,.22)', tape: 'rgba(147,175,204,.55)', pos: '30% 45%', note: 'Polly on the train', badge: 'purple' },
  winter: { C: { bg: '#EEF1F3', sheet: '#F8FAFB', ink: '#1C2430', mut: '#5D6670', line: '#D3DAE0', acc: '#9E1B22', acc2: '#E2544A' }, glow: 'rgba(120,160,200,.22)', tape: 'rgba(158,27,34,.28)', pos: 'center 40%', note: 'rooftops and towers ❄', badge: 'winter' },
}[SEASON];
const C = S.C;

const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&family=Karla:wght@400;700&family=Caveat:wght@700&display=swap">
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1920px;height:1080px;overflow:hidden}
body{background:${C.bg};color:${C.ink};font-family:Karla,sans-serif;position:relative}
body:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 78% 55%,${S.glow},transparent 55%)}
.pill{position:absolute;left:150px;top:250px;border:2px solid ${C.line};background:${C.sheet};border-radius:40px;padding:14px 30px 14px 54px;font:700 21px Karla;letter-spacing:.26em;color:${C.mut}}
.pill:before{content:"";position:absolute;left:28px;top:50%;width:10px;height:10px;margin-top:-5px;border-radius:50%;background:${C.acc}}
h1{position:absolute;left:142px;top:330px;font:400 150px/.98 Fraunces;font-variation-settings:"opsz" 144;letter-spacing:-.035em}
h1 em{color:${C.acc};position:relative;font-style:italic}
h1 svg{position:absolute;left:-6px;bottom:-8px}
.sub{position:absolute;left:150px;top:690px;width:760px;font:400 34px/1.45 Karla;color:${C.mut}}
.btn{position:absolute;left:150px;top:830px;background:${C.acc};color:#fff;border-radius:50px;padding:22px 44px;font:700 32px Karla;box-shadow:0 10px 24px rgba(28,36,48,.28)}
.btn b{font-weight:700}
.art{position:absolute;left:1040px;top:190px;width:760px;height:620px;border:14px solid #fff;transform:rotate(2deg);box-shadow:0 3px 6px rgba(42,33,28,.12),0 34px 60px rgba(42,33,28,.25);overflow:hidden;background:#fff}
.art img{width:100%;height:100%;object-fit:cover;object-position:${S.pos}}
.tape{position:absolute;width:170px;height:46px;background:${S.tape};left:1330px;top:168px;transform:rotate(-4deg)}
.cap{position:absolute;left:1170px;top:842px;font:700 54px Caveat;color:${C.acc};transform:rotate(-3deg)}
.cap svg{vertical-align:-8px;margin-left:8px}
.badge{position:absolute;left:955px;top:700px;width:190px;height:190px;transform:rotate(-8deg);filter:drop-shadow(0 12px 18px rgba(42,33,28,.28))}
.ed{position:absolute;left:150px;top:150px;font:700 44px Caveat;color:${C.acc};transform:rotate(-2deg)}
</style></head><body>
<div class="ed">Pigeon Polly Art Lab</div>
<div class="pill">WATERCOLOUR &amp; INK · FREE LESSONS</div>
<h1>Paint small,<br><em>joyful<svg width="380" height="40" viewBox="0 0 420 40"><path d="M6 30 C120 8 280 6 412 22" stroke="${C.acc}" stroke-width="7" fill="none" stroke-linecap="round"/></svg></em> things</h1>
<div class="sub">Free lessons, full paint-alongs and creative guides by artist Alina Otkinska.</div>
<div class="btn">▶&nbsp; pigeonpolly.com</div>
<div class="art"><img src="${U('v2/hero-' + SEASON + '.jpg')}"></div>
<div class="tape"></div>
<img class="badge" src="${U('logo/v3/pigeon-polly-color-' + S.badge + '-transparent-4000.png')}">
<div class="cap">${S.note}</div>
</body></html>`;

(async () => {
  const tmp = path.join(__dirname, 'shots', '_cover.html'); fs.writeFileSync(tmp, html);
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + tmp, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(ROOT, 'site/images/pins/pinterest-cover-' + SEASON + '.jpg'), type: 'jpeg', quality: 90 });
  fs.unlinkSync(tmp); await b.close();
})();
