// Пины №1721–1730 (Алина 23.11.2026): Goal Workbook 2027 → /advent/ (utm_campaign=workbook27). Данные и тексты FB — workbook27-data.js.
// Кадры: tools/pins/wb/ (не в git): pdftoppm -r 150 -png WORKBOOK.pdf page; pdfimages -j WORKBOOK.pdf art.
// node tools/pins/workbook27.js [номер…] → site/images/pins/pin-NNN.jpg + tools/pins/workbook27.json
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const D = require('./workbook27-data.js');
const START = 1721, CAMP = 'workbook27', LINK = '/advent/';
const file = k => k.startsWith('logo/') ? path.join(ROOT, 'site/images', k) : path.join(__dirname, 'wb', k);
const U = k => 'file://' + file(k);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const plain = s => s.replace(/<\/?em>/g, '');
const dims = k => { const b = fs.readFileSync(file(k)); if (b[0] === 0x89) return [b.readUInt32BE(16), b.readUInt32BE(20)]; let i = 2; while (i < b.length) { const m = b[i + 1], l = b.readUInt16BE(i + 2); if (m >= 0xC0 && m <= 0xC2) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]; i += 2 + l; } };
function crop(k, c, bw, bh) {
  const [W, H] = dims(k); const [x, y, w, h] = c || [0, 0, W, H];
  const s = Math.max(bw / w, bh / h), ox = x * s + (w * s - bw) / 2, oy = y * s + (h * s - bh) / 2;
  return `<div style="width:${bw}px;height:${bh}px;background:url('${U(k)}') no-repeat;background-size:${W * s}px ${H * s}px;background-position:${-ox}px ${-oy}px"></div>`;
}
const CSSf = t => `*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1000px;height:1500px;overflow:hidden}
body{background:${t.bg};color:${t.fg};font-family:Karla,sans-serif;position:relative}
h1{font:600 74px/1.03 Fraunces;letter-spacing:-.02em}
h1 em{font-style:italic;font-weight:400;color:${t.acc}}
.kick{font:700 22px Karla;letter-spacing:.24em;text-transform:uppercase;color:${t.acc}}
.hand{font:700 50px/1.05 Caveat;color:${t.acc}}
.ft{position:absolute;left:44px;right:44px;bottom:30px;height:110px;display:flex;align-items:center;gap:18px}
.ft .lg{width:104px;height:104px}.ft .ad{font:600 30px Fraunces}
.ft .cta{margin-left:auto;background:${t.btn};color:${t.btnFg};font:700 25px Karla;padding:16px 26px;border-radius:40px}
.fr{border-radius:18px;overflow:hidden;box-shadow:0 18px 40px rgba(20,14,8,.28);background:#fff}
.pg{background:#fff;box-shadow:0 24px 50px rgba(10,6,4,.35);border-radius:6px;overflow:hidden}
.chip{display:inline-block;background:${t.card};border-radius:30px;padding:10px 20px;font:700 23px Karla;margin:0 8px 10px 0}`;
const foot = (cta, t) => `<div class="ft"><img class="lg" src="${U(`logo/v3/pigeon-polly-${t.logo}-transparent-4000.png`)}"><div class="ad">pigeonpolly.com</div><div class="cta">${esc(cta)} →</div></div>`;
const hfs = h => { const n = plain(h).length; return n > 30 ? 64 : 74; };
const head = (kick, h, top = 58) => `<div style="position:absolute;left:56px;top:${top}px;right:56px"><div class="kick">${kick}</div><h1 style="margin-top:18px;font-size:${hfs(h)}px">${h}</h1></div>`;

const T = {
  // страница PDF крупно, под наклоном, чипы справа
  hero(p, t) {
    const [, , cw, ch] = p.crop, h = Math.round(p.w * ch / cw);
    return `${head(p.kick, p.h)}<div class="pg" style="position:absolute;left:56px;top:270px;transform:rotate(${p.rot}deg)">${crop(p.src, p.crop, p.w, h)}</div>
      <div style="position:absolute;left:${56 + p.w + 40}px;right:40px;top:330px;display:flex;flex-direction:column;gap:18px">${p.side.map(s => `<div style="background:${t.card};border-radius:18px;padding:18px 20px;font:600 27px/1.2 Fraunces">${esc(s)}</div>`).join('')}</div>
      <div class="hand" style="position:absolute;left:56px;right:56px;top:${270 + h + 40}px;text-align:center;font-size:54px">${esc(p.cap)}</div>${foot(p.cta, t)}`;
  },
  // арт сверху, 4 цветные карточки
  cards(p, t) {
    return `${head(p.kick, p.h)}<div class="fr" style="position:absolute;left:56px;top:300px">${crop(p.art, p.crop, 888, 540)}</div>
      <div style="position:absolute;left:56px;right:56px;top:870px;display:grid;grid-template-columns:1fr 1fr;gap:20px">${p.items.map(([c, a, b]) => `<div style="background:${t.card};border-left:12px solid ${c};border-radius:16px;padding:22px 24px;box-shadow:0 6px 18px rgba(0,0,0,.06)"><div style="font:600 32px/1.1 Fraunces">${esc(a)}</div><div style="font:500 24px/1.3 Karla;color:${t.mut};margin-top:8px">${esc(b)}</div></div>`).join('')}</div>${foot(p.cta, t)}`;
  },
  // арт + три шага по сезонам
  flow(p, t) {
    return `${head(p.kick, p.h)}<div class="fr" style="position:absolute;left:56px;top:270px">${crop(p.art, p.crop, 888, 500)}</div>
      <div style="position:absolute;left:56px;right:56px;top:800px;display:flex;flex-direction:column;gap:16px">${p.steps.map(([n, a, d, b]) => `<div style="display:flex;gap:22px;align-items:center;background:${t.card};border-radius:18px;padding:18px 24px"><div style="flex:none;width:64px;height:64px;border-radius:50%;background:${t.acc};color:${t.btnFg};display:flex;align-items:center;justify-content:center;font:600 36px Fraunces">${n}</div><div style="flex:1"><div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font:600 34px Fraunces">${esc(a)}</span><span style="font:700 22px Karla;letter-spacing:.1em;color:${t.acc}">${esc(d)}</span></div><div style="font:500 23px/1.3 Karla;color:${t.mut};margin-top:4px">${esc(b)}</div></div></div>`).join('<div style="text-align:center;font:700 30px Karla;color:' + t.acc + ';margin:-8px 0">↓</div>')}</div>${foot(p.cta, t)}`;
  },
  // три страницы веером
  fan(p, t) {
    const w = 500, h = Math.round(w * 1754 / 1240);
    return `${head(p.kick, p.h)}${p.pages.map((k, i) => `<div class="pg" style="position:absolute;left:${[10, 250, 490][i]}px;top:${[350, 300, 350][i]}px;transform:rotate(${[-8, 0, 8][i]}deg);z-index:${[1, 3, 2][i]}">${crop(k, [0, 0, 1240, 1754], w, h)}</div>`).join('')}
      <div style="position:absolute;left:56px;right:56px;top:${300 + h + 60}px;text-align:center">${p.chips.map(s => `<span class="chip">${esc(s)}</span>`).join('')}</div>${foot(p.cta, t)}`;
  },
  // открытый список + арт в углу
  list(p, t) {
    return `<div style="position:absolute;right:40px;top:40px;width:300px;height:300px;background:#fff;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center"><img src="${U(p.art)}" style="width:280px"></div>
      <div style="position:absolute;left:56px;right:370px;top:58px"><div class="kick">${p.kick}</div><h1 style="margin-top:18px;font-size:62px">${p.h}</h1></div>
      <div style="position:absolute;left:56px;right:56px;top:390px;bottom:180px;display:grid;align-content:space-evenly">${p.items.map((s, i) => `<div style="display:flex;gap:14px;align-items:baseline;font:500 31px/1.2 Karla"><b style="font:600 31px Fraunces;color:${t.acc};min-width:46px">${i + 1}</b><span>${esc(s)}</span></div>`).join('')}</div>${foot(p.cta, t)}`;
  },
  // мем: надпись сверху, арт, подпись
  meme(p, t) {
    return `<div style="position:absolute;left:56px;right:56px;top:80px;font:600 72px/1.05 Fraunces;text-align:center">${esc(p.top)}</div>
      <div class="fr" style="position:absolute;left:40px;top:300px">${crop(p.art, p.crop, 920, 800)}</div>
      <div class="hand" style="position:absolute;left:56px;right:56px;top:1135px;text-align:center;font-size:52px">${esc(p.sub)}</div>${foot(p.cta, t)}`;
  },
  // четыре даты проверки
  checks(p, t) {
    return `${head(p.kick, p.h)}<div class="fr" style="position:absolute;left:56px;top:290px">${crop(p.art, p.crop, 888, 400)}</div>
      <div style="position:absolute;left:56px;right:56px;top:720px;display:flex;flex-direction:column;gap:14px">${p.items.map(([d, a, b]) => `<div style="display:flex;gap:22px;align-items:center;background:${t.card};border-radius:18px;padding:16px 24px;box-shadow:0 6px 18px rgba(0,0,0,.06)"><div style="flex:none;width:58px;height:58px;border-radius:50%;border:4px solid ${t.acc}"></div><div style="flex:none;width:150px;font:700 30px Karla">${esc(d)}</div><div><div style="font:600 34px Fraunces">${esc(a)}</div><div style="font:500 22px Karla;color:${t.mut};margin-top:2px">${esc(b)}</div></div></div>`).join('')}</div>${foot(p.cta, t)}`;
  },
  // заполненный пример цели
  example(p, t) {
    return `${head(p.kick, p.h)}<div class="hand" style="position:absolute;left:56px;right:56px;top:250px;font-size:56px;color:${t.fg}">${esc(p.goal)}</div>
      <div class="fr" style="position:absolute;left:56px;top:400px">${crop(p.art, p.crop, 888, 470)}</div>
      <div style="position:absolute;left:56px;right:56px;top:905px;display:flex;flex-direction:column;gap:12px">${p.rows.map(([a, b]) => `<div style="display:flex;gap:20px;align-items:baseline;border-bottom:2px solid ${t.card};padding-bottom:10px"><div style="flex:none;width:200px;font:700 20px Karla;letter-spacing:.14em;text-transform:uppercase;color:${t.acc}">${esc(a)}</div><div style="font:700 42px/1.1 Caveat">${esc(b)}</div></div>`).join('')}</div>${foot(p.cta, t)}`;
  },
  quote(p, t) {
    return `<div style="position:absolute;left:56px;right:56px;top:70px"><div class="kick">${p.kick}</div>
      <div style="font:400 italic 66px/1.12 Fraunces;margin-top:26px">“${esc(p.q)}”</div><div class="hand" style="margin-top:22px;font-size:46px">— ${esc(p.who)}</div></div>
      <div class="fr" style="position:absolute;left:56px;top:560px">${crop(p.art, p.crop, 888, 600)}</div>${foot(p.cta, t)}`;
  },
};

const PINS = D.pins.map((p, i) => {
  const n = START + i, t = D.TH[p.th];
  if (!T[p.type]) throw new Error('нет шаблона ' + p.type);
  if (p.title.length > 100) throw new Error(`pin ${n}: заголовок ${p.title.length}`);
  return { n, t, p, link: `https://www.pigeonpolly.com${LINK}?utm_source=pinterest&utm_campaign=${CAMP}&utm_content=pin-${n}`, title: p.title, desc: p.desc, alt: p.alt, topics: D.TOP, tpl: p.type === 'meme' ? 'Мем' : p.type === 'list' || p.type === 'checks' ? 'Темы' : 'Календарь', season: 'Зима' };
});
const old = new Set(fs.readdirSync(__dirname).filter(f => f.endsWith('.json') && f !== 'workbook27.json').flatMap(f => (fs.readFileSync(path.join(__dirname, f), 'utf8').match(/"title": *"[^"]*"/g) || []).map(s => s.split('"')[3])));
const rep = PINS.filter(p => old.has(p.title)).map(p => p.n); if (rep.length) throw new Error('заголовок уже был: ' + rep);

(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  const tmp = path.join(__dirname, 'wb', '_p.html'), only = process.argv.slice(2).map(Number);
  const FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Karla:wght@400;500;700&family=Caveat:wght@700&display=swap">';
  for (const p of PINS) {
    if (only.length && !only.includes(p.n)) continue;
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${CSSf(p.t)}</style></head><body>${T[p.p.type](p.p, p.t)}</body></html>`);
    await page.goto('file://' + tmp, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
    const over = await page.evaluate(() => { const ft = document.querySelector('.ft').getBoundingClientRect().top; return Math.max(...[...document.querySelectorAll('body > *:not(.ft)')].map(e => e.getBoundingClientRect().bottom)) - ft; });
    if (over > 4) console.log('⚠ pin', p.n, 'наезжает на подвал на', Math.round(over));
    await page.screenshot({ path: path.join(ROOT, `site/images/pins/pin-${p.n}.jpg`), type: 'jpeg', quality: 85 });
  }
  fs.unlinkSync(tmp);
  fs.writeFileSync(path.join(__dirname, 'workbook27.json'), JSON.stringify(PINS.map(({ t, p, ...x }) => x), null, 1));
  await b.close();
})();
