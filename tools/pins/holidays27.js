// Праздничные пины №1461–1610 (Алина 21.11.2026: «по 10 пинов на праздники» — 15 дат года, от 4.02 до Чёрной пятницы).
// Движок как tools/pins/thanks26.js: всё открыто (списки целиком, HEX видны), арты только Алины, ссылки на настоящие страницы.
// Данные — tools/pins/holidays27-data.js (праздник → тема цвета → 10 пинов). Годов на пинах нет — пины вечные.
// node tools/pins/holidays27.js [номер…] → site/images/pins/pin-NNN.jpg + tools/pins/holidays27.json (тексты и метки для Notion).
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const SITE = 'https://www.pigeonpolly.com';
const PALS = Object.fromEntries(require('../../content/palettes.json').map(p => [p.key, p]));
const L = (p, n) => { const [a, h] = p.split('#'); return `${SITE}${a}?utm_source=pinterest&utm_campaign=holidays&utm_content=pin-${n}${h ? '#' + h : ''}`; };
const U = k => 'file://' + path.join(ROOT, 'site/images', k);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const plain = s => s.replace(/<\/?em>/g, '');
const A = k => { if (!PALS[k]) throw new Error('нет палитры ' + k); return PALS[k].img.replace('images/', ''); };
const EMO = "'Noto Color Emoji'";

const CSSf = t => `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1000px;height:1500px;overflow:hidden}
body{background:${t.bg};color:${t.fg};font-family:Karla,${EMO},sans-serif;position:relative}
h1{font:600 74px/1.03 Fraunces,${EMO};letter-spacing:-.02em}
h1 em{font-style:italic;font-weight:400;color:${t.acc}}
.kick{font:700 22px Karla;letter-spacing:.24em;text-transform:uppercase;color:${t.acc}}
.hand{font:700 46px/1.05 Caveat,${EMO};color:${t.acc}}
.ft{position:absolute;left:44px;right:44px;bottom:30px;height:110px;display:flex;align-items:center;gap:18px}
.ft .lg{width:104px;height:104px}
.ft .ad{font:600 30px Fraunces}
.ft .cta{margin-left:auto;background:${t.btn || t.acc};color:${t.btnFg || '#fff'};font:700 25px Karla;padding:16px 26px;border-radius:40px}
.fr{border-radius:14px;overflow:hidden;box-shadow:0 18px 40px rgba(30,20,10,.18);background:#fff}
`;
const foot = (cta, t) => `<div class="ft"><img class="lg" src="${U(`logo/v3/pigeon-polly-${t.logo}-transparent-4000.png`)}"><div class="ad">pigeonpolly.com</div><div class="cta">${esc(cta)} →</div></div>`;
const img = (k, W, H, pos = '50% 50%') => `<img src="${U(k)}" style="width:${W}px;height:${H}px;object-fit:cover;object-position:${pos};display:block">`;
const head = (kick, h, right = 56, top = 58) => `<div style="position:absolute;left:56px;top:${top}px;right:${right}px"><div class="kick">${kick}</div><h1 style="margin-top:18px">${h}</h1></div>`;

// ——— шаблоны: каждый получает (p — пин из данных, H — праздник, t — тема, n — номер) и возвращает поля пина ———
const T = {
  pal(p, H, t, n) {
    const P = PALS[p.key], fmt = p.fmt, cs = fmt === 'three' ? P.colors.slice(0, 3) : P.colors, name = p.name;
    const sw = c => `<div style="font:600 25px/1.1 Fraunces">${esc(c.en)}</div><div style="font:700 23px Karla;color:${t.mut};margin-top:4px;letter-spacing:.04em">${c.hex}</div>`;
    const h = p.h || { grid: `<em>${esc(name)}</em> palette`, strip: `A <em>${esc(name.toLowerCase())}</em> palette`, dots: `${esc(H.short)} colors: <em>${esc(name.toLowerCase())}</em>`, three: `Just <em>three colors</em>: ${esc(name.toLowerCase())}` }[fmt];
    const body = {
      grid: () => `${head(`${H.kick} · color palette`, h)}
        <div class="fr" style="position:absolute;left:56px;right:56px;top:300px">${img(A(p.key), 888, 520, p.pos)}</div>
        <div style="position:absolute;left:56px;right:56px;top:860px;display:grid;grid-template-columns:repeat(3,1fr);gap:18px">
        ${cs.map(c => `<div style="background:${t.card};border-radius:14px;overflow:hidden"><div style="height:130px;background:${c.hex}"></div><div style="padding:12px 16px">${sw(c)}</div></div>`).join('')}</div>`,
      strip: () => `${head(`${H.kick} · hex codes`, h)}
        <div class="fr" style="position:absolute;left:56px;top:330px">${img(A(p.key), 520, 830, p.pos)}</div>
        <div style="position:absolute;left:600px;right:56px;top:330px;display:flex;flex-direction:column;gap:14px">
        ${cs.map(c => `<div><div style="height:82px;border-radius:12px;background:${c.hex}"></div><div style="margin-top:6px">${sw(c)}</div></div>`).join('')}</div>`,
      dots: () => `${head(`${H.kick} · color palette`, h)}
        <div class="fr" style="position:absolute;left:56px;right:56px;top:330px">${img(A(p.key), 888, 560, p.pos)}</div>
        <div style="position:absolute;left:40px;right:40px;top:940px;display:grid;grid-template-columns:repeat(6,1fr);gap:8px;text-align:center">
        ${cs.map(c => `<div><div style="width:132px;height:132px;margin:0 auto;border-radius:50%;background:${c.hex};box-shadow:0 0 0 5px ${t.card}"></div><div style="font:600 21px/1.1 Fraunces;margin-top:14px;min-height:46px">${esc(c.en)}</div><div style="font:700 19px Karla;color:${t.mut}">${c.hex}</div></div>`).join('')}</div>`,
      three: () => `${head(`3-color palette · ${H.kick}`, h)}
        <div class="fr" style="position:absolute;left:56px;right:56px;top:330px">${img(A(p.key), 888, 500, p.pos)}</div>
        <div style="position:absolute;left:56px;right:56px;top:870px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
        ${cs.map(c => `<div><div style="height:200px;border-radius:14px;background:${c.hex}"></div><div style="margin-top:10px">${sw(c)}</div></div>`).join('')}</div>`,
    }[fmt]();
    const list = cs.map(c => `${c.en} ${c.hex}`).join(', ');
    return { tpl: 'Палитра', link: L(`/palettes/#${p.key}`, n), title: p.title,
      desc: `${p.lead || `${/^[AEIOU]/.test(H.name) ? 'An' : 'A'} ${H.name} colour palette`} from my painting of ${p.what}: ${list}. ${p.use || 'Use it for cards, illustrations or your sketchbook.'} The full palette with HEX codes is free on pigeonpolly.com.`,
      alt: `${cs.length} colours with names and HEX codes next to a painting by Pigeon Polly of ${p.what}.`,
      topics: p.topics || `${H.name} color palette, Color palette with HEX codes, Color inspiration for artists, ${H.season === 'Зима' ? 'Winter' : H.season === 'Весна' ? 'Spring' : H.season === 'Лето' ? 'Summer' : 'Autumn'} color palette`,
      html: () => body + foot('Get the palette', t) };
  },
  list(p, H, t, n) {
    const items = p.items, two = items.length > 12, fs = two ? (items.length > 20 ? 25 : 28) : 36, rows = Math.ceil(items.length / 2);
    return { tpl: 'Темы', link: L(p.link || '/prompts/', n), title: p.title,
      desc: p.desc || `${plain(p.h).replace(/^./, c => c.toUpperCase()).replace(/:.*$/, '')} — ${items.slice(0, 4).join(', ')}… ${/^[AEIOU]/.test(H.name) ? 'An' : 'A'} ${H.name} drawing list, all on one pin: save it and draw one a day. More free drawing prompts on pigeonpolly.com.`,
      alt: `A list: ${plain(p.h)}, next to an illustration by Pigeon Polly${p.what ? ' of ' + p.what : ''}.`,
      topics: `${H.name} drawing ideas, ${p.topic}, Sketchbook prompts, Drawing prompts for adults`,
      html: () => `<div class="fr" style="position:absolute;right:56px;top:58px;transform:rotate(3deg)">${img(A(p.key), 250, 250, p.pos)}</div>
        <div style="position:absolute;left:56px;right:56px;top:58px;bottom:180px;display:flex;flex-direction:column">
        <div style="margin-right:290px"><div class="kick">${p.kick || H.kick + ' · prompts'}</div><h1 style="margin-top:18px;${plain(p.h).length > 40 ? 'font-size:64px' : ''}">${p.h}</h1></div>
        <div style="flex:1;margin-top:32px;display:grid;align-content:space-evenly;${two ? `grid-template-columns:1.05fr 1fr;grid-auto-flow:column;grid-template-rows:repeat(${rows},auto);column-gap:30px` : 'grid-template-columns:1fr'}">
        ${items.map((s, i) => `<div style="display:flex;gap:12px;align-items:baseline;font:500 ${fs}px/1.2 Karla,${EMO}"><b style="font:600 ${fs}px Fraunces;color:${t.acc};min-width:42px">${i + 1}</b><span>${esc(s)}</span></div>`).join('')}</div></div>
        ${foot(p.cta || 'More prompts', t)}` };
  },
  frames(p, H, t, n) {
    const labels = p.labels, cols = labels.length === 8 ? 3 : 2;
    const art = `<div class="fr" style="height:240px">${img(A(p.key), 280, 240, p.pos)}</div>`;
    const box = s => `<div style="height:${cols === 3 ? 240 : 290}px;border:3px dashed ${t.fg}44;border-radius:14px;background:${t.card};display:flex;align-items:flex-end;justify-content:center;padding:12px"><span class="hand" style="font-size:38px;text-align:center">${esc(s)}</span></div>`;
    const grid = cols === 3 ? [...labels.slice(0, 4).map(box), art, ...labels.slice(4).map(box)] : labels.map(box);
    return { tpl: 'Скетчбук', link: L(p.link || '/prompts/', n), title: p.title,
      desc: `${/^[AEIOU]/.test(H.name) ? 'An' : 'A'} ${H.name} sketchbook page idea: ${labels.join(', ')}. Five minutes per frame, pencil is enough. More free drawing prompts on pigeonpolly.com.`,
      alt: `Sketchbook layout with ${labels.length} empty frames labelled ${labels.join(', ')}${cols === 3 ? ', and an illustration by Pigeon Polly' : ''}.`,
      topics: `${H.name} drawing ideas, Sketchbook layout ideas, Sketchbook page ideas, Drawing prompts for adults`,
      html: () => `${head(p.kick || H.kick + ' · sketchbook page', p.h, cols === 3 ? 56 : 330)}
        ${cols === 2 ? `<div class="fr" style="position:absolute;right:56px;top:58px;transform:rotate(3deg)">${img(A(p.key), 250, 250, p.pos)}</div>` : ''}
        <div style="position:absolute;left:56px;right:56px;top:${cols === 3 ? 370 : 400}px;display:grid;grid-template-columns:repeat(${cols},1fr);gap:18px">${grid.join('')}</div>
        ${foot('More prompts', t)}` };
  },
  bingo(p, H, t, n) {
    const cells = p.cells, c = Math.sqrt(cells.length), sz = c === 5 ? 168 : 212;
    return { tpl: 'Темы', link: L('/prompts/', n), title: p.title,
      desc: `${H.name} drawing bingo: draw one small thing in every square — ${cells.filter(x => !/FREE/.test(x)).slice(0, 6).join(', ')}… Get a line, or fill the whole card. More free drawing prompts on pigeonpolly.com.`,
      alt: `A ${c}×${c} drawing bingo card for ${H.name} with a small thing to draw in each square.`,
      topics: `${H.name} activities, Drawing bingo, Sketchbook prompts, Drawing ideas`,
      html: () => `${head(H.kick + ' · bingo', p.h)}
        <div style="position:absolute;left:50%;transform:translateX(-50%);top:340px;display:grid;grid-template-columns:repeat(${c},${sz}px);gap:10px">
        ${cells.map(s => !/[a-z]/i.test(s) ? `<div style="height:${sz}px;border-radius:12px;background:${t.card};border:2px solid ${t.fg}22;display:flex;align-items:center;justify-content:center;font:100px/1 ${EMO}">${esc(s)}</div>` : /FREE/.test(s) ? `<div style="height:${sz}px;border-radius:12px;background:${t.btn || t.acc};color:${t.btnFg || '#fff'};display:flex;align-items:center;justify-content:center;text-align:center;padding:10px;font:700 34px/1 Caveat">${esc(s)}</div>` : `<div style="height:${sz}px;border-radius:12px;background:${t.card};border:2px solid ${t.fg}22;display:flex;align-items:flex-end;justify-content:center;text-align:center;padding:10px;font:600 ${c === 5 ? 23 : 27}px/1.1 Fraunces,${EMO}">${esc(s)}</div>`).join('')}</div>
        ${foot('More prompts', t)}` };
  },
  pov(p, H, t, n) {
    return { tpl: 'Мем', link: L(p.link || '/prompts/', n), title: p.title,
      desc: `${plain(p.h)}${p.cap.startsWith('—') ? ' ' : ' — '}${p.cap}${p.cap.startsWith('—') ? '.' : ''} ${p.tail || 'Free drawing prompts for every month on pigeonpolly.com.'}`,
      alt: `Meme: “${plain(p.h).replace(/“/g, '‘').replace(/”/g, '’')}” over a painting by Pigeon Polly of ${p.what}, captioned: ${p.cap.replace(/[“”]/g, '')}`,
      topics: `${H.name} humor, Artist memes, Art humor, Sketchbook life`,
      html: () => `${head(p.kick || 'artist life · ' + H.kick, p.h)}
        <div class="fr" style="position:absolute;left:56px;right:56px;top:390px;transform:rotate(-1.5deg)">${img(A(p.key), 888, 640, p.pos)}</div>
        <div class="hand" style="position:absolute;left:56px;right:56px;top:1080px;text-align:center;font-size:56px">${esc(p.cap)}</div>
        ${foot(p.cta || 'Draw along', t)}` };
  },
  quote(p, H, t, n) {
    const q = p.q;
    return { tpl: 'Арт', link: L(p.link || '/prompts/', n), title: p.title,
      desc: `“${plain(q)}” — a small ${H.name} thought from Pigeon Polly Art Lab. ${p.tail || 'Free drawing prompts and lessons on pigeonpolly.com.'}`,
      alt: `Quote “${plain(q)}” under a painting by Pigeon Polly of ${p.what}.`,
      topics: `${H.name} quotes, Artist quotes, ${p.topic || 'Creative motivation'}, Inspirational art quotes`,
      html: () => `<div class="fr" style="position:absolute;left:0;right:0;top:0;border-radius:0">${img(A(p.key), 1000, 760, p.pos)}</div>
        <div style="position:absolute;left:70px;right:70px;top:840px"><div class="kick">${H.kick} · pigeon polly</div>
        <div style="font:600 ${plain(q).length > 50 ? 74 : 90}px/1.05 Fraunces;letter-spacing:-.02em;margin-top:24px">${q.replace('<em>', `<em style="font-style:italic;font-weight:400;color:${t.acc}">`)}</div></div>
        ${foot(p.cta || 'Draw along', t)}` };
  },
  // книги Алины (обложки site/images/e-books) → /books/
  books(p, H, t, n) {
    return { tpl: 'Курс', link: L('/books/', n), title: p.title, desc: p.desc,
      alt: `Covers of two art books by Pigeon Polly — Ink Sketching and Watercolor Sketches — ${p.altTail}.`,
      topics: `${H.name}, Books for artists, Gifts for artists, Learn to draw books`,
      html: () => `${head(p.kick || H.kick, p.h)}
        <div style="position:absolute;left:0;right:0;top:400px;height:620px">
          <div class="fr" style="position:absolute;left:110px;top:30px;transform:rotate(-5deg)"><img src="${U('e-books/ink-sketching.jpg')}" style="width:380px;display:block"></div>
          <div class="fr" style="position:absolute;right:110px;top:0;transform:rotate(4deg)"><img src="${U('e-books/watercolor-sketches.jpg')}" style="width:380px;display:block"></div></div>
        <div class="hand" style="position:absolute;left:56px;right:56px;top:1110px;text-align:center;font-size:52px">${esc(p.cap)}</div>
        ${foot('See the books', t)}` };
  },
};

const HOL = require('./holidays27-data.js');
const PINS = []; let n = 1461;
for (const H of HOL) {
  if (H.pins.length !== 10) throw new Error(`${H.tag}: ${H.pins.length} пинов, нужно 10`);
  for (const p of H.pins) {
    const tag = p.tag || H.tag, k = n++, t = H.th;
    const o = T[p.type](p, p.H || H, t, k);
    if (o.title.length > 100) throw new Error(`pin ${k}: заголовок длиннее 100 (${o.title.length})`);
    PINS.push({ n: k, holiday: tag, season: H.season, t, ...o });
  }
}
if (n !== 1611) throw new Error('ожидалось до №1610, вышло ' + (n - 1));
const dup = PINS.map(p => p.title).filter((x, i, a) => a.indexOf(x) !== i); if (dup.length) throw new Error('повтор заголовков: ' + dup);

(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  const tmp = path.join(__dirname, 'shots', '_hol.html'); fs.mkdirSync(path.dirname(tmp), { recursive: true });
  const only = process.argv.slice(2).map(Number);
  for (const p of PINS) {
    if (only.length && !only.includes(p.n)) continue;
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Karla:wght@400;500;700&family=Caveat:wght@700&display=swap"><style>${CSSf(p.t)}</style></head><body>${p.html()}</body></html>`);
    await page.goto('file://' + tmp, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
    const over = await page.evaluate(() => { const ft = document.querySelector('.ft').getBoundingClientRect().top; return Math.max(...[...document.querySelectorAll('body > *:not(.ft)')].map(e => e.getBoundingClientRect().bottom)) - ft; });
    if (over > 4) console.log('⚠ pin', p.n, 'наезжает на подвал на', Math.round(over));
    await page.screenshot({ path: path.join(ROOT, `site/images/pins/pin-${p.n}.jpg`), type: 'jpeg', quality: 85 });
  }
  fs.unlinkSync(tmp);
  fs.writeFileSync(path.join(__dirname, 'holidays27.json'), JSON.stringify(PINS.map(({ html, t, ...p }) => p), null, 1));
  await b.close();
})();
