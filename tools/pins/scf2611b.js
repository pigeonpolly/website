// Контент-завод №31–90 (Алина 27.11.2026: «30 палитр и 30 тем для рисования, разные списки»), utm_campaign=scf2611b. Движок — копия scf2611.js.
// node tools/pins/scf2611b.js [номер…] → site/images/social/card-NNNN.jpg + tools/pins/scf2611b.json (тексты для Notion)
// Данные — scf2611b-data.js (палитры — scf2611b-pal.json из scf2611b_pal.py). Картинки: 's/…' — site/images/social/src/, 'shots/…' — tools/pins/shots/, иначе site/images/….
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const D = require('./scf2611b-data.js');
const CAMP = 'scf2611b', START = 31;
const file = k => k.startsWith('s/') ? path.join(ROOT, 'site/images/social/src', k.slice(2)) : k.startsWith('shots/') ? path.join(__dirname, k) : path.join(ROOT, 'site/images', k);
const U = k => 'file://' + file(k);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const plain = s => s.replace(/<\/?em>/g, '');
const dims = k => { const b = fs.readFileSync(file(k)); if (b[0] === 0x89) return [b.readUInt32BE(16), b.readUInt32BE(20)]; let i = 2; while (i < b.length) { const m = b[i + 1], l = b.readUInt16BE(i + 2); if (m >= 0xC0 && m <= 0xC2) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]; i += 2 + l; } };
// кадр: c = [x, y, w, h] в долях (0…1) картинки; по умолчанию — вся, cover
function crop(k, c, bw, bh) {
  const [W, H] = dims(k); const [x, y, w, h] = c ? [c[0] * W, c[1] * H, c[2] * W, c[3] * H] : [0, 0, W, H];
  const s = Math.max(bw / w, bh / h), ox = x * s + (w * s - bw) / 2, oy = y * s + (h * s - bh) / 2;
  return `<div style="width:${bw}px;height:${bh}px;background:url('${U(k)}') no-repeat;background-size:${W * s}px ${H * s}px;background-position:${-ox}px ${-oy}px"></div>`;
}
const CSSf = t => `*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1000px;height:1500px;overflow:hidden}
body{background:${t.bg};color:${t.fg};font-family:Karla,sans-serif;position:relative}
h1{font:600 72px/1.04 Fraunces;letter-spacing:-.02em}
h1 em{font-style:italic;font-weight:400;color:${t.acc}}
.kick{font:700 21px Karla;letter-spacing:.24em;text-transform:uppercase;color:${t.acc}}
.hand{font:700 50px/1.05 Caveat;color:${t.acc}}
.ft{position:absolute;left:40px;right:40px;bottom:26px;height:70px;display:flex;align-items:center}
.ft .no{font:500 19px Karla;opacity:.33}
.ft .ad{margin-left:auto;font:500 19px Karla;color:${t.mut};opacity:.85;margin-right:12px}
.ft .lg{width:70px;height:70px;opacity:.9}
.fr{border-radius:18px;overflow:hidden;box-shadow:0 18px 40px rgba(20,14,8,.25);background:#fff}
.chip{display:inline-block;background:${t.card};border-radius:30px;padding:10px 20px;font:700 23px Karla;margin:0 8px 10px 0}`;
const foot = (n, t) => `<div class="ft"><div class="no">${n}</div><div class="ad">pigeonpolly.com</div><img class="lg" src="file://${ROOT}/site/images/logo/v3/pigeon-polly-${t.logo}-transparent-4000.png"></div>`;
const hfs = (h, big = 72) => { const n = plain(h).length; return n > 46 ? big - 16 : n > 30 ? big - 8 : big; };
const head = (kick, h, top = 60, fs) => `<div style="position:absolute;left:56px;top:${top}px;right:56px"><div class="kick">${kick}</div><h1 style="margin-top:16px;font-size:${fs || hfs(h)}px">${h}</h1></div>`;

const T = {
  // заголовок, большой арт, подпись от руки
  hero(p, t) {
    const ah = p.ah || 860;
    return `${head(p.kick, p.h)}<div class="fr" style="position:absolute;left:56px;top:${p.top || 300}px">${crop(p.art, p.crop, 888, ah)}</div>
      ${p.cap ? `<div class="hand" style="position:absolute;left:56px;right:56px;top:${(p.top || 300) + ah + 34}px;text-align:center">${esc(p.cap)}</div>` : ''}`;
  },
  // арт на весь верх, текст на плашке снизу
  full(p, t) {
    return `<div style="position:absolute;left:0;top:0">${crop(p.art, p.crop, 1000, 1000)}</div>
      <div style="position:absolute;left:0;right:0;top:1000px;bottom:0;background:${t.bg}"></div>
      <div style="position:absolute;left:56px;right:56px;top:1040px"><div class="kick">${p.kick}</div><h1 style="margin-top:14px;font-size:${hfs(p.h, 64)}px">${p.h}</h1>${p.sub ? `<div style="font:500 28px/1.3 Karla;color:${t.mut};margin-top:14px">${esc(p.sub)}</div>` : ''}</div>`;
  },
  // список: арт-полоса и пункты (1 или 2 колонки)
  list(p, t) {
    const ah = p.ah || 380, top = p.top || 300;
    return `${head(p.kick, p.h)}<div class="fr" style="position:absolute;left:56px;top:${top}px">${crop(p.art, p.crop, 888, ah)}</div>
      <div style="position:absolute;left:56px;right:56px;top:${top + ah + 36}px;bottom:120px;display:grid;grid-template-columns:${p.two ? '1fr 1fr' : '1fr'};column-gap:30px;align-content:space-evenly">${p.items.map((s, i) => `<div style="display:flex;gap:12px;align-items:baseline;font:500 ${p.two ? 31 : 35}px/1.2 Karla;padding:6px 0"><b style="font:600 ${p.two ? 31 : 35}px Fraunces;color:${t.acc};min-width:${p.two ? 36 : 44}px">${i + 1}</b><span>${esc(s)}</span></div>`).join('')}</div>`;
  },
  // палитра: арт и плашки с HEX
  pal(p, t) {
    const n = p.cols.length, per = n > 5 ? Math.ceil(n / 2) : n, sw = (888 - (per - 1) * 16) / per, sh = n > 5 ? 190 : 300;
    return `<div class="fr" style="position:absolute;left:56px;top:56px">${crop(p.art, p.crop, 888, p.ah || 560)}</div>
      <div style="position:absolute;left:56px;right:56px;top:${(p.ah || 560) + 90}px"><div class="kick">${p.kick}</div><h1 style="margin-top:12px;font-size:${hfs(p.h, 64)}px">${p.h}</h1></div>
      <div style="position:absolute;left:56px;right:56px;bottom:130px;display:flex;flex-wrap:wrap;gap:16px">${p.cols.map(([hex, nm]) => `<div style="width:${sw}px;border-radius:14px;overflow:hidden;background:${t.card};box-shadow:0 6px 18px rgba(0,0,0,.08)"><div style="height:${sh}px;background:${hex}"></div><div style="padding:10px 14px"><div style="font:600 ${n > 5 ? 20 : 25}px Fraunces">${esc(nm)}</div><div style="font:700 ${n > 5 ? 17 : 20}px Karla;color:${t.mut};letter-spacing:.06em">${hex}</div></div></div>`).join('')}</div>`;
  },
  // процесс: 3 кадра в ряд, высокие, подписи
  steps(p, t) {
    return `${head(p.kick, p.h)}${p.imgs.map(([k, c, cap], i) => `<div style="position:absolute;left:${56 + i * 303}px;top:${p.top || 330}px;width:282px"><div class="fr">${crop(k, c, 282, 700)}</div><div class="hand" style="font-size:40px;text-align:center;margin-top:16px">${esc(cap)}</div></div>`).join('')}
      ${p.note ? `<div style="position:absolute;left:56px;right:56px;top:${(p.top || 330) + 800}px;font:500 30px/1.35 Karla;color:${t.mut};text-align:center">${esc(p.note)}</div>` : ''}`;
  },
  // мем: надпись сверху, арт, подпись
  meme(p, t) {
    return `<div style="position:absolute;left:56px;right:56px;top:70px;font:600 ${p.fs || 66}px/1.06 Fraunces;text-align:center">${esc(p.top)}</div>
      <div class="fr" style="position:absolute;left:40px;top:${p.at || 320}px">${crop(p.art, p.crop, 920, p.ah || 800)}</div>
      ${p.sub ? `<div class="hand" style="position:absolute;left:56px;right:56px;top:${(p.at || 320) + (p.ah || 800) + 30}px;text-align:center;font-size:52px">${esc(p.sub)}</div>` : ''}`;
  },
  // 4 картинки 2×2 с подписями
  grid(p, t) {
    return `${head(p.kick, p.h)}<div style="position:absolute;left:56px;right:56px;top:${p.top || 300}px;display:grid;grid-template-columns:1fr 1fr;gap:22px">${p.imgs.map(([k, c, cap]) => `<div><div class="fr">${crop(k, c, 433, p.ih || 440)}</div><div style="font:600 26px/1.2 Fraunces;margin-top:10px">${esc(cap)}</div></div>`).join('')}</div>`;
  },
  // цитата + арт
  quote(p, t) {
    return `<div style="position:absolute;left:56px;right:56px;top:70px"><div class="kick">${p.kick}</div>
      <div style="font:400 italic ${p.fs || 62}px/1.12 Fraunces;margin-top:24px">“${esc(p.q)}”</div>${p.who ? `<div class="hand" style="margin-top:20px;font-size:44px">— ${esc(p.who)}</div>` : ''}</div>
      <div class="fr" style="position:absolute;left:56px;top:${p.at || 600}px">${crop(p.art, p.crop, 888, p.ah || 640)}</div>`;
  },
  // палитра: арт слева во всю высоту, плашки столбиком справа
  stripe(p, t) {
    const n = p.cols.length, top = 330, H = 1020, gap = n > 5 ? 12 : 18, rh = (H - (n - 1) * gap) / n;
    return `${head(p.kick, p.h, 60, hfs(p.h, 66))}<div class="fr" style="position:absolute;left:56px;top:${top}px">${crop(p.art, p.crop, 470, H)}</div>
      <div style="position:absolute;left:556px;right:56px;top:${top}px;height:${H}px;display:flex;flex-direction:column;gap:${gap}px">${p.cols.map(([hex, nm]) => `<div style="flex:1;display:flex;border-radius:14px;overflow:hidden;background:${t.card};box-shadow:0 6px 18px rgba(0,0,0,.08)"><div style="width:${Math.min(150, rh * 1.3)}px;background:${hex}"></div><div style="padding:0 16px;display:flex;flex-direction:column;justify-content:center"><div style="font:600 ${n > 5 ? 23 : 28}px/1.1 Fraunces">${esc(nm)}</div><div style="font:700 ${n > 5 ? 18 : 21}px Karla;color:${t.mut};letter-spacing:.06em;margin-top:4px">${hex}</div></div></div>`).join('')}</div>`;
  },
  // список-чеклист: арт в круге справа вверху, пункты с квадратиками
  check(p, t) {
    const two = p.items.length > 9;
    return `<div class="fr" style="position:absolute;right:56px;top:56px;width:280px;height:280px;border-radius:50%">${crop(p.art, p.crop, 280, 280)}</div>
      <div style="position:absolute;left:56px;right:366px;top:70px"><div class="kick">${p.kick}</div><h1 style="margin-top:16px;font-size:${hfs(p.h, 64) - 4}px">${p.h}</h1></div>
      <div style="position:absolute;left:56px;right:56px;top:${p.top || 400}px;bottom:130px;display:grid;grid-template-columns:${two ? '1fr 1fr' : '1fr'};column-gap:34px;align-content:space-evenly">${p.items.map(s => `<div style="display:flex;gap:16px;align-items:center;font:500 ${two ? 30 : 36}px/1.2 Karla;padding:8px 0"><span style="flex:none;width:${two ? 30 : 36}px;height:${two ? 30 : 36}px;border:3px solid ${t.acc};border-radius:7px"></span><span>${esc(s)}</span></div>`).join('')}</div>`;
  },
};

const CARDS = D.cards.map((p, i) => {
  const n = START + i, t = D.TH[p.th];
  if (!t) throw new Error(`card ${n}: нет темы ${p.th}`);
  if (!T[p.type]) throw new Error(`card ${n}: нет шаблона ${p.type}`);
  if (p.title.length > 100) throw new Error(`card ${n}: заголовок ${p.title.length}`);
  if (!D.BOARDS.includes(p.board)) throw new Error(`card ${n}: нет доски ${p.board}`);
  const link = `https://www.pigeonpolly.com${p.link}${p.link.includes('?') ? '&' : '?'}utm_source=pinterest&utm_medium=social&utm_campaign=${CAMP}&utm_content=card-${n}${p.hash ? '#' + p.hash : ''}`;
  return { n, t, p, file: `card-${String(n).padStart(4, '0')}.jpg`, ru: p.ru, type: p.ntype, season: p.season, hol: p.hol, title: p.title, desc: p.desc, alt: p.alt, board: p.board, link, fb: p.fb, grp: p.grp };
});

(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  const out = path.join(ROOT, 'site/images/social'); fs.mkdirSync(out, { recursive: true });
  const tmp = path.join(out, '_p.html'), only = process.argv.slice(2).map(Number);
  const FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Karla:wght@400;500;700&family=Caveat:wght@700&display=swap">';
  for (const c of CARDS) {
    if (only.length && !only.includes(c.n)) continue;
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${CSSf(c.t)}</style></head><body>${T[c.p.type](c.p, c.t)}${foot(c.n, c.t)}</body></html>`);
    await page.goto('file://' + tmp, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
    const over = await page.evaluate(() => { const ft = document.querySelector('.ft').getBoundingClientRect().top; return Math.max(...[...document.querySelectorAll('body > *:not(.ft)')].map(e => e.getBoundingClientRect().bottom)) - ft; });
    if (over > 4) console.log('⚠ card', c.n, 'наезжает на подвал на', Math.round(over));
    await page.screenshot({ path: path.join(out, c.file), type: 'jpeg', quality: 86 });
  }
  fs.unlinkSync(tmp);
  fs.writeFileSync(path.join(__dirname, 'scf2611b.json'), JSON.stringify(CARDS.map(({ t, p, ...x }) => x), null, 1));
  await b.close();
})();
