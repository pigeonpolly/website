// Обложка карточки «Школа Полли» на /learn/ (курс, не видео): арт «Полли пишет диплом» + дорожка 12 уроков → диплом, цвета страницы школы.
// node tools/school_cover.js → site/images/school/course-cover.jpg (1100×756, 16:11 как .vc .th)
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const art = 'file://' + path.join(ROOT, 'site/images/bird/2019-pigeon-polly-writing-diploma.jpg');
const dots = Array.from({ length: 12 }, (_, i) => `<i${i ? '' : ' class="on"'}>${i + 1}</i>`).join('<u></u>');
const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Karla:wght@700&display=swap">
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1100px;height:756px;overflow:hidden;background:#2B1A51;font-family:Karla,sans-serif}
.a{position:absolute;left:0;top:0;width:1100px;height:560px;background:url(${art}) center 38%/cover}
.a:after{content:"";position:absolute;inset:auto 0 0 0;height:140px;background:linear-gradient(transparent,#2B1A51)}
.p{position:absolute;left:46px;right:46px;top:618px;display:flex;align-items:center}
.p i{flex:none;width:58px;height:58px;border-radius:50%;border:3px solid #5B4A92;background:#3A2870;color:#CFC4F2;font:700 25px Karla;font-style:normal;display:grid;place-items:center}
.p i.on{background:#F0A987;border-color:#FBEFE6;color:#2B1A51}
.p u{flex:1;border-top:4px dotted #8E6C5E;margin:0 3px}
.p b{flex:none;width:84px;height:84px;border-radius:50%;background:#A87046;border:4px solid #F0A987;display:grid;place-items:center;font-size:44px;margin-left:3px}
.t{position:absolute;left:46px;right:46px;top:684px;display:flex;justify-content:space-between;color:#CFC4F2;font:700 26px Karla;letter-spacing:.14em}
.t span:last-child{color:#F0A987}
</style></head><body><div class="a"></div>
<div class="p">${dots}<u></u><b>📜</b></div>
</body></html>`;
(async () => {
  const tmp = path.join(__dirname, '_school_cover.html'); fs.writeFileSync(tmp, html);
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1100, height: 756 } });
  await pg.goto('file://' + tmp, { waitUntil: 'networkidle' }); await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: path.join(ROOT, 'site/images/school/course-cover.jpg'), type: 'jpeg', quality: 85 });
  fs.unlinkSync(tmp); await b.close();
})();
