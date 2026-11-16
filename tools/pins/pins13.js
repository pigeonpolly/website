// Пины №626–725 «Книги 2»: по 50 на каждую книгу Алины — 626–675 «Ink Sketching», 676–725 «Watercolor Sketches».
// У каждой книги 25 пинов ведут на сайт (/books/, utm_campaign=books2, utm_content=pin-NNN), 25 — прямо на Amazon (a.co).
// Картинки: страницы и вырезки из PDF книг (tools/pins/book/), страницы туши (site/images/ink/), скетчи (site/images/photos2/), обложки (e-books/).
// node tools/pins/pins13.js [номер…] → site/images/pins/pin-NNN.jpg + tools/pins/pins13.json (тексты для Notion).
// SET=14 node tools/pins/pins13.js — тот же движок для №726–825 (данные pins14-data.js → pins14.json).
// SET=15 — №826–945 «Artist lifestyle» из фото Алины (tools/pins/life/), шаблоны pal, palside, duo, inset.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const SET = process.env.SET || '13';
const PINS = require(`./pins${SET}-data.js`);
const U = k => 'file://' + (/^(book|life)\//.test(k) ? path.join(__dirname, k) : path.join(ROOT, 'site/images', k));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const TH = {
  paper: { bg: '#F6F1EB', fg: '#1E1A18', acc: '#B8473C', hand: '#B8473C', mut: '#8A7F78', dot: '#1E1A18', card: '#fff' },
  dark: { bg: '#2E2521', fg: '#F1ECE4', acc: '#93AFCC', hand: '#93AFCC', mut: '#B9AEA4', dot: '#C9A27A', card: '#fff' },
  wash: { bg: '#FFFDFA', fg: '#2B2622', acc: '#B8473C', hand: '#3E7FA0', mut: '#8C8580', dot: '#E3A44F', card: '#fff' },
  blush: { bg: '#FBECE4', fg: '#2B2622', acc: '#B8473C', hand: '#B8473C', mut: '#9A8A82', dot: '#7FB0C8', card: '#fff' },
  white: { bg: '#FFFFFF', fg: '#2B2622', acc: '#3E7FA0', hand: '#B8473C', mut: '#8C8580', dot: '#B8473C', card: '#F6F1EB' },
  night: { bg: '#1E2433', fg: '#F3EDE2', acc: '#E3B567', hand: '#E3B567', mut: '#A7A3A0', dot: '#E3B567', card: '#fff' },
  sage: { bg: '#E8ECE2', fg: '#2F3A2E', acc: '#6F8A5E', hand: '#6F8A5E', mut: '#7E8A7A', dot: '#B8473C', card: '#fff' },
  clay: { bg: '#F0E4D7', fg: '#3A2A22', acc: '#A4553A', hand: '#A4553A', mut: '#9A8778', dot: '#6F8A5E', card: '#fff' },
};
const img = (k, W, H, pos = '50% 50%', fit = 'cover', bg = '') => `<img src="${U(k)}" style="width:${W}px;height:${H}px;object-fit:${fit};object-position:${pos};display:block;${bg ? 'background:' + bg : ''}">`;
const fr = (k, W, H, x, y, r = 0, o = {}) => `<div class="fr" style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${r}deg)">${img(k, W, H, o.pos, o.fit || 'cover', o.bg || '#fff')}</div>`;
const cut = (k, W, H, x, y, r = 0, op = 1) => `<img src="${U(k)}" style="position:absolute;left:${x}px;top:${y}px;width:${W}px;height:${H}px;object-fit:contain;transform:rotate(${r}deg);opacity:${op}">`;
const COVER = { ink: 'e-books/ink-sketching.jpg', wc: 'e-books/watercolor-sketches.jpg' };
const NAME = { ink: 'Ink Sketching: Creative Guide', wc: 'Watercolor Sketches: Creative Guide' };
const foot = p => p.foot ? `<div class="url">${esc(p.foot)}</div>` : `<div class="url">${p.to === 'a' ? esc(NAME[p.book]) + ' · on Amazon' : 'more books → pigeonpolly.com/books'}</div>`;
const head = (p, top = 60) => `${p.kick ? `<div class="kick" style="top:${top}px">${esc(p.kick)}</div>` : ''}<h1 style="position:absolute;left:62px;right:56px;top:${top + 64}px;font-size:${p.fs || 78}px">${p.t}</h1>`;
const blob = p => p.blob ? cut('book/' + p.blob + '.png', p.bw || 620, p.bh || 520, p.bx ?? 420, p.by ?? -80, p.br || 0, p.bo || .55) : '';
const mini = (p, x = 770, y = 1170, w = 170) => !COVER[p.book] ? "" : `<div class="fr" style="position:absolute;left:${x}px;top:${y}px;transform:rotate(4deg)">${img(COVER[p.book], w, Math.round(w * 1.393))}</div>`;
const li = (a, b) => `<div class="li">${esc(a)}${b ? `<small>${esc(b)}</small>` : ''}</div>`;

const CSS = t => `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1000px;height:1500px;overflow:hidden}
body{background:${t.bg};color:${t.fg};font-family:Karla,sans-serif;position:relative}
.url{position:absolute;left:0;right:0;bottom:38px;text-align:center;font:700 36px Caveat;color:${t.mut}}
.kick{position:absolute;left:64px;font:700 48px Caveat;color:${t.hand};transform:rotate(-2deg);z-index:2}
h1{font:600 78px/1.02 Fraunces;letter-spacing:-.02em;color:${t.fg};z-index:2}
h1 em{font-style:italic;font-weight:400;color:${t.acc}}
.fr{border-radius:8px;overflow:hidden;box-shadow:0 22px 46px rgba(0,0,0,${t === TH.dark ? .45 : .2});background:#fff}
.hand{font:700 50px/1.1 Caveat;color:${t.hand}}
.tag{display:inline-block;background:${t.acc};color:${t.bg};font:700 24px Karla;letter-spacing:.2em;text-transform:uppercase;padding:10px 20px;border-radius:40px}
.lbl{position:absolute;background:${t === TH.dark ? '#F1ECE4' : t.fg};color:${t === TH.dark ? '#2E2521' : t.bg};font:700 34px Caveat;padding:2px 14px}
.li{font:700 46px/1.05 Caveat;color:${t.hand};padding-left:40px;position:relative;margin-bottom:16px}
.li:before{content:'';position:absolute;left:4px;top:18px;width:16px;height:16px;border-radius:50%;background:${t.dot}}
.li small{display:block;font:400 26px/1.25 Karla;color:${t.mut};margin-top:4px}
.q{font:400 italic 74px/1.12 Fraunces;color:${t.fg};letter-spacing:-.01em}
.note{position:absolute;background:#FFF3B8;color:#2B2622;font:700 40px/1.1 Caveat;padding:22px 26px;box-shadow:0 12px 26px rgba(0,0,0,.18);width:360px}
.badge{display:flex;align-items:center;gap:22px;font:700 44px/1.05 Caveat;color:${t.fg};margin-bottom:22px}
.badge b{flex:none;width:62px;height:62px;border-radius:50%;background:${t.acc};color:${t.bg};font:600 34px/62px Fraunces;text-align:center}
.box{flex:none;width:44px;height:44px;border:4px solid ${t.acc};border-radius:8px;position:relative}
.box:after{content:'';position:absolute;left:10px;top:-2px;width:14px;height:26px;border:solid ${t.acc};border-width:0 6px 6px 0;transform:rotate(40deg)}
.row{display:flex;gap:26px;align-items:flex-start;margin-bottom:26px}
.row .k{flex:none;width:250px;font:700 50px/1 Caveat;color:${t.acc}}
.row .v{font:400 35px/1.25 Karla;color:${t.fg}}
.day{background:${t.card};border-radius:14px;padding:22px 24px;min-height:205px;font:400 33px/1.22 Karla;color:#2B2622;box-shadow:0 6px 16px rgba(0,0,0,.08)}
.day b{display:block;font:700 44px/1.1 Caveat;color:${t.acc}}
`;

const T = {
  // обложка крупно + 3 «значка»
  hero: p => `${blob(p)}${p.tag ? `<div style="position:absolute;left:62px;top:66px"><span class="tag">${esc(p.tag)}</span></div>` : ''}
    <h1 style="position:absolute;left:62px;right:56px;top:140px;font-size:${p.fs || 80}px">${p.t}</h1>
    ${fr(COVER[p.book], 440, 613, 70, 470, -3)}
    <div style="position:absolute;left:560px;right:40px;top:${p.btop || 540}px">${p.badges.map((b, i) => `<div class="badge"><b>${i + 1}</b><span>${esc(b)}</span></div>`).join('')}</div>
    <div class="hand" style="position:absolute;left:66px;right:60px;top:1170px;text-align:center">${esc(p.hand)}</div>${foot(p)}`,
  // обложка между двумя страницами (как pins11)
  book: p => `${blob(p)}<div style="position:absolute;left:62px;top:66px"><span class="tag">${esc(p.tag || 'my book')}</span></div>
    <h1 style="position:absolute;left:62px;right:56px;top:140px;font-size:${p.fs || 80}px">${p.t}</h1>
    ${p.pages.map((k, i) => fr(k, 400, 470, i ? 520 : 70, i ? 520 : 470, i ? 5 : -6)).join('')}
    ${fr(COVER[p.book], 460, 641, 270, 450, -1)}
    <div class="hand" style="position:absolute;left:66px;right:60px;top:1150px;text-align:center">${esc(p.hand)}</div>${foot(p)}`,
  // картинка + список
  tips: p => `${blob(p)}${head(p)}
    ${p.cut ? cut(p.art, 876, p.h || 400, 62, p.top || 330) : fr(p.art, 876, p.h || 400, 62, p.top || 330, -1, { fit: p.fit, pos: p.pos })}
    <div style="position:absolute;left:62px;right:56px;top:${(p.top || 330) + (p.h || 400) + 50}px">${p.items.map(([a, b]) => li(a, b)).join('')}</div>${foot(p)}`,
  // сетка 2×2
  grid: p => `${blob(p)}${head(p)}
    <div style="position:absolute;left:50px;right:50px;top:${p.top || 340}px;display:grid;grid-template-columns:1fr 1fr;gap:22px">
    ${p.items.map(q => `<div style="position:relative;border-radius:8px;overflow:hidden;background:${q.cut ? 'transparent' : '#fff'}">${img(q.art, 439, p.ch || 400, q.pos, q.fit || (q.cut ? 'contain' : 'cover'), q.cut ? '' : '#fff')}${q.say ? `<span class="lbl" style="left:10px;bottom:10px">${esc(q.say)}</span>` : ''}</div>`).join('')}</div>
    <div class="hand" style="position:absolute;left:66px;right:60px;top:${(p.top || 340) + 2 * (p.ch || 400) + 66}px;text-align:center">${esc(p.hand)}</div>${foot(p)}`,
  // две картинки + 10 тем в 2 колонки
  prompts: p => `${blob(p)}${head(p)}
    ${p.arts.map((k, i) => fr(k, 416, 450, 62 + i * 440, 350 + i * 20, i ? 2 : -2)).join('')}
    <div style="position:absolute;left:62px;right:40px;top:880px;display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:84px;column-gap:24px">${p.items.map(q => `<div style="font:700 ${p.ifs || 42}px/1 Caveat;color:${TH[p.th].hand};padding-left:36px;position:relative;white-space:nowrap;display:flex;align-items:center"><span style="position:absolute;left:4px;top:50%;margin-top:-8px;width:16px;height:16px;border-radius:50%;background:${TH[p.th].dot}"></span>${esc(q)}</div>`).join('')}</div>${foot(p)}`,
  // большая цитата
  quote: p => `${blob(p)}<div style="position:absolute;left:70px;top:90px;font:400 260px/1 Fraunces;color:${TH[p.th].acc};opacity:.9">“</div>
    <div class="q" style="position:absolute;left:80px;right:70px;top:280px;font-size:${Math.round((p.qs || 72) * 1.15)}px">${esc(p.q)}</div>
    ${p.art ? (p.cut ? cut(p.art, p.aw || 480, p.ah || 460, p.ax ?? 70, p.ay ?? 740, p.ar || 0) : fr(p.art, p.aw || 480, p.ah || 460, p.ax ?? 70, p.ay ?? 740, p.ar ?? -3, { fit: p.fit || 'contain' })) : ''}
    <div class="hand" style="position:absolute;left:${p.art ? 560 : 80}px;right:50px;top:${p.hy || 820}px">${esc(p.hand || '— from my book')}</div>
    ${mini(p, 700, 1040, 190)}${foot(p)}`,
  // страница книги крупно + записка
  page: p => `${blob(p)}${head(p)}
    ${p.crop ? fr(p.page, 860, 660, 70, 330, -1.5, { pos: '50% 4%' }) : fr(p.page, 600, 848, 70, 320, -2, { fit: 'contain', bg: '#fff' })}
    <div class="note" style="left:${p.nx || (p.crop ? 560 : 590)}px;top:${p.ny || (p.crop ? 930 : 880)}px;transform:rotate(4deg)">${esc(p.note)}</div>
    ${p.crop ? mini(p, 120, 1040, 200) : mini(p, 760, 420, 180)}${foot(p)}`,
  // разворот: две страницы
  spread: p => `${blob(p)}${head(p)}
    <div style="position:absolute;left:40px;top:${p.top || 340}px;display:flex;box-shadow:0 26px 50px rgba(0,0,0,.3);transform:rotate(-1deg)">${p.pages.map(k => img(k, 460, 650, '50% 50%', 'contain', '#fff')).join('<div style="width:2px;background:#ddd"></div>')}</div>
    <div class="hand" style="position:absolute;left:66px;right:60px;top:${(p.top || 340) + 700}px;text-align:center">${esc(p.hand)}</div>${foot(p)}`,
  // POV
  pov: p => `${blob(p)}<div style="position:absolute;left:62px;right:56px;top:70px;font:600 ${p.fs || 66}px/1.08 Fraunces;color:${TH[p.th].fg}"><em style="font-style:normal;color:${TH[p.th].acc}">POV:</em> ${esc(p.t)}</div>
    ${p.cut ? cut(p.art, 860, p.h || 720, 70, p.top || 380) : fr(p.art, 860, p.h || 720, 70, p.top || 380, -1.5, { fit: p.fit, pos: p.pos })}
    <div class="hand" style="position:absolute;left:70px;right:60px;top:${(p.top || 380) + (p.h || 720) + 40}px;text-align:center">${esc(p.sub)}</div>${foot(p)}`,
  // мем: подпись сверху, картинка, ответ снизу
  meme: p => `${blob(p)}<div style="position:absolute;left:62px;right:56px;top:70px;font:700 ${p.fs || 52}px/1.15 Karla;color:${TH[p.th].fg}">${esc(p.top)}</div>
    ${p.cut ? cut(p.art, 860, p.h || 700, 70, p.at || 360) : fr(p.art, 860, p.h || 700, 70, p.at || 360, 1, { fit: p.fit, pos: p.pos })}
    <div class="hand" style="position:absolute;left:70px;right:60px;top:${(p.at || 360) + (p.h || 700) + 40}px;text-align:center;font-size:${p.ss || 50}px">${esc(p.sub)}</div>${foot(p)}`,
  // словарик / мифы: пары «ключ — значение»
  pairs: p => `${blob(p)}${head(p)}
    ${p.art ? (p.cut ? cut(p.art, 380, 300, 560, 330, 0) : fr(p.art, 340, 280, 590, 330, 3, { fit: p.fit || 'contain' })) : ''}
    <div style="position:absolute;left:62px;right:56px;top:${p.top || 660}px">${p.pairs.map(([k, v]) => `<div class="row"><div class="k" style="width:${p.kw || 250}px">${esc(k)}</div><div class="v">${esc(v)}</div></div>`).join('')}</div>${foot(p)}`,
  // 3 шага
  steps: p => `${blob(p)}${head(p)}
    ${p.steps.map((s, i) => `<div style="position:absolute;left:62px;right:56px;top:${(p.top || 330) + i * 330}px;display:flex;gap:34px;align-items:center">
      <div class="fr" style="flex:none">${img(s.art, 400, 300, s.pos, s.fit || 'contain', '#fff')}</div>
      <div><div style="font:600 70px/1 Fraunces;color:${TH[p.th].acc}">${i + 1}</div><div style="font:700 48px/1.05 Caveat;color:${TH[p.th].fg};margin-top:8px">${esc(s.say)}</div></div></div>`).join('')}${foot(p)}`,
  // челлендж по дням
  challenge: p => `${blob(p)}${head(p)}
    <div style="position:absolute;left:56px;right:56px;top:${p.top || 340}px;display:grid;grid-template-columns:1fr 1fr;gap:18px">${p.days.map((d, i) => `<div class="day"${p.compact ? ' style="min-height:0;padding:14px 20px;font-size:29px"' : ''}><b>day ${i + 1}</b>${esc(d)}</div>`).join('')}</div>
    ${p.compact ? "" : mini(p, 770, 1160, 160)}${foot(p)}`,
  // это vs то
  vs: p => `${blob(p)}${head(p)}
    ${[p.a, p.b].map((s, i) => `<div style="position:absolute;left:${i ? 512 : 50}px;top:${(p.top || 360) + i * 30}px;width:438px;transform:rotate(${i ? 2 : -2}deg)">
      ${s.cut ? `<div style="height:${p.h || 520}px">${img(s.art, 438, p.h || 520, '50% 50%', 'contain')}</div>` : `<div class="fr">${img(s.art, 438, p.h || 520, s.pos, s.fit || 'cover', '#fff')}</div>`}
      <div style="font:700 50px/1 Caveat;color:${TH[p.th].acc};margin-top:20px;text-align:center">${esc(s.say)}</div>
      ${s.sm ? `<div style="font:400 28px/1.25 Karla;color:${TH[p.th].mut};margin-top:8px;text-align:center">${esc(s.sm)}</div>` : ''}</div>`).join('')}
    <div class="hand" style="position:absolute;left:66px;right:60px;top:${(p.top || 360) + (p.h || 520) + (p.hg || 260)}px;text-align:center">${esc(p.hand)}</div>${foot(p)}`,
  // чек-лист с галочками
  check: p => `${blob(p)}${head(p)}
    ${p.art ? cut(p.art, p.aw || 420, p.ah || 360, p.ax ?? 540, p.ay ?? 330, p.ar || 0) : ''}
    <div style="position:absolute;left:62px;right:${p.art && p.ay < 700 ? 60 : 56}px;top:${p.top || 720}px">${p.items.map(([a, b]) => `<div class="row" style="align-items:center"><div class="box"></div><div><div style="font:700 44px/1.05 Caveat;color:${TH[p.th].fg}">${esc(a)}</div>${b ? `<div style="font:400 26px/1.25 Karla;color:${TH[p.th].mut}">${esc(b)}</div>` : ''}</div></div>`).join('')}</div>${foot(p)}`,
  // оглавление
  inside: p => `${blob(p)}${head(p)}
    ${fr(COVER[p.book], 330, 460, 610, 360, 4)}
    <div style="position:absolute;left:62px;width:520px;top:${p.top || 360}px">${p.list.map(([n, s]) => `<div style="display:flex;gap:18px;align-items:baseline;margin-bottom:14px"><span style="flex:none;width:58px;font:600 36px Fraunces;color:${TH[p.th].acc}">${n}</span><span style="font:400 33px/1.15 Karla;color:${TH[p.th].fg}">${esc(s)}</span></div>`).join('')}</div>
    <div class="hand" style="position:absolute;left:610px;right:50px;top:880px">${esc(p.hand)}</div>${foot(p)}`,
  // записка автора с вырезанным фото
  note: p => `${blob(p)}${head(p)}
    ${cut(p.art, p.aw || 520, p.ah || 720, p.ax ?? 440, p.ay ?? 560, p.ar || 0)}
    <div class="q" style="position:absolute;left:70px;width:${p.qw || 440}px;top:${p.qy || 400}px;font-size:${p.qs || 50}px">“${esc(p.q)}”</div>
    <div class="hand" style="position:absolute;left:70px;width:400px;top:${p.hy || 1150}px">${esc(p.hand)}</div>${foot(p)}`,
  // палитра из фото: фото, ниже кружки с HEX
  pal: p => `${head(p)}
    ${fr(p.art, 860, p.h || 700, 70, p.top || 330, -1, { pos: p.pos })}
    <div style="position:absolute;left:50px;right:50px;top:${(p.top || 330) + (p.h || 700) + 50}px;display:flex;justify-content:center;gap:18px">${p.cols.map(c => `<div style="text-align:center"><div style="width:132px;height:132px;border-radius:50%;background:${c};box-shadow:0 8px 18px rgba(0,0,0,.18);border:5px solid #fff"></div><div style="font:700 24px Karla;color:${TH[p.th].mut};margin-top:12px;letter-spacing:.04em">${c}</div></div>`).join('')}</div>
    ${p.hand ? `<div class="hand" style="position:absolute;left:66px;right:60px;top:${(p.top || 330) + (p.h || 700) + 235}px;text-align:center;font-size:40px">${esc(p.hand)}</div>` : ''}${foot(p)}`,
  // палитра сбоку: фото высоко слева, полосы цветов справа
  palside: p => `<div style="position:absolute;left:56px;top:60px;right:56px"><div class="kick" style="position:static;margin-bottom:6px">${esc(p.kick || 'color palette')}</div><h1 style="font-size:${p.fs || 64}px">${p.t}</h1></div>
    ${fr(p.art, 560, 1020, 56, 330, 0, { pos: p.pos })}
    <div style="position:absolute;left:650px;right:56px;top:330px;height:1020px;display:flex;flex-direction:column;gap:12px">${p.cols.map(c => `<div style="flex:1;border-radius:10px;background:${c};display:flex;align-items:flex-end;padding:12px 14px;font:700 24px Karla;color:${parseInt(c.slice(1, 3), 16) * .3 + parseInt(c.slice(3, 5), 16) * .59 + parseInt(c.slice(5, 7), 16) * .11 > 150 ? '#2B2622' : '#fff'}">${c}</div>`).join('')}</div>${foot(p)}`,
  // художник и работа: два фото рядом с подписями
  duo: p => `${blob(p)}${head(p)}
    <div style="position:absolute;left:46px;top:${p.top || 380}px;width:450px;transform:rotate(-3deg)"><div class="fr">${img(p.me, 450, p.h || 640, p.mpos)}</div><div class="hand" style="text-align:center;margin-top:16px;font-size:44px">${esc(p.l1 || 'the artist')}</div></div>
    <div style="position:absolute;left:510px;top:${(p.top || 380) + 50}px;width:446px;transform:rotate(2.5deg)"><div class="fr">${img(p.art, 446, p.h || 640, p.apos, p.afit || 'cover', '#fff')}</div><div class="hand" style="text-align:center;margin-top:16px;font-size:44px">${esc(p.l2 || 'the art')}</div></div>
    ${p.hand ? `<div style="position:absolute;left:66px;right:60px;top:${(p.top || 380) + (p.h || 640) + 160}px;text-align:center;font:400 italic 40px/1.2 Fraunces;color:${TH[p.th].fg}">${esc(p.hand)}</div>` : ''}${foot(p)}`,
  // арт крупно + фото художника кружком в углу
  inset: p => `${head(p)}
    ${fr(p.art, 880, p.h || 760, 60, p.top || 330, 0, { pos: p.apos, fit: p.afit || 'cover' })}
    <div style="position:absolute;left:${p.ix ?? 600}px;top:${(p.top || 330) + (p.h || 760) - 230}px;width:330px;height:330px;border-radius:50%;overflow:hidden;border:10px solid ${TH[p.th].bg};box-shadow:0 16px 36px rgba(0,0,0,.3)">${img(p.me, 330, 330, p.mpos)}</div>
    <div class="hand" style="position:absolute;left:70px;width:${(p.ix ?? 600) - 90}px;top:${(p.top || 330) + (p.h || 760) + 30}px;font-size:46px">${esc(p.hand)}</div>${foot(p)}`,
  // арт во весь пин + цитата поверх (затемнение снизу или сверху)
  full: p => `${img(p.art, 1000, 1500, p.pos || '50% 50%')}
    <div style="position:absolute;left:0;right:0;${p.top ? 'top:0;height:760px;background:linear-gradient(rgba(15,12,10,.82),rgba(15,12,10,0))' : 'bottom:0;height:860px;background:linear-gradient(rgba(15,12,10,0),rgba(15,12,10,.85) 55%)'}"></div>
    <div style="position:absolute;left:70px;right:70px;${p.top ? 'top:90px' : 'bottom:150px'};color:#F6F1EB">
      ${p.kick ? `<div style="font:700 26px Karla;letter-spacing:.24em;text-transform:uppercase;color:#E3C9A0;margin-bottom:22px">${esc(p.kick)}</div>` : ''}
      <div style="font:400 italic ${p.qs || 74}px/1.1 Fraunces;letter-spacing:-.01em">${esc(p.q)}</div>
      ${p.hand ? `<div style="font:700 44px Caveat;color:#E3C9A0;margin-top:22px">${esc(p.hand)}</div>` : ''}</div>
    <div class="url" style="color:#E3C9A0;${p.top ? '' : 'z-index:3'}">${esc(p.foot || 'pigeonpolly.com')}</div>`,
  // арт в паспарту + подпись как в музее
  frame: p => `${blob(p)}<div style="position:absolute;left:${(1000 - (p.aw || 740)) / 2 - 24}px;top:${p.at || 110}px;background:#fff;padding:24px;box-shadow:0 26px 50px rgba(0,0,0,.22);transform:rotate(${p.ar || 0}deg)">${img(p.art, p.aw || 740, p.ah || 800, p.pos)}</div>
    <div style="position:absolute;left:80px;right:80px;top:${(p.at || 110) + (p.ah || 800) + 110}px;text-align:center">
      <div style="font:400 italic ${p.qs || 56}px/1.15 Fraunces;color:${TH[p.th].fg}">${esc(p.q)}</div>
      ${p.kick ? `<div style="font:700 24px Karla;letter-spacing:.24em;text-transform:uppercase;color:${TH[p.th].acc};margin-top:26px">${esc(p.kick)}</div>` : ''}</div>${foot(p)}`,
  // цветной верх с текстом + арт снизу
  split: p => `<div style="position:absolute;left:0;right:0;top:0;height:${p.sh || 640}px;background:${TH[p.th].bg}"></div>
    ${blob(p)}<div style="position:absolute;left:70px;right:70px;top:${p.ty || 110}px">
      ${p.kick ? `<div style="font:700 26px Karla;letter-spacing:.24em;text-transform:uppercase;color:${TH[p.th].acc};margin-bottom:26px">${esc(p.kick)}</div>` : ''}
      <div style="font:600 ${p.qs || 76}px/1.05 Fraunces;letter-spacing:-.02em;color:${TH[p.th].fg}">${p.t}</div></div>
    <div style="position:absolute;left:0;top:${p.sh || 640}px">${img(p.art, 1000, 1500 - (p.sh || 640), p.pos)}</div>
    <div class="url" style="color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.6)">${esc(p.foot || 'pigeonpolly.com')}</div>`,
  // только цитата: пятно акварели, подпись
  qmin: p => `${blob(p)}<div style="position:absolute;left:90px;right:90px;top:0;bottom:120px;display:flex;flex-direction:column;justify-content:center;text-align:center">
      <div style="font:400 120px/0.6 Fraunces;color:${TH[p.th].acc}">“</div>
      <div style="font:400 italic ${p.qs || 78}px/1.12 Fraunces;color:${TH[p.th].fg};margin-top:30px">${esc(p.q)}</div>
      <div style="width:80px;height:3px;background:${TH[p.th].acc};margin:46px auto 26px"></div>
      <div style="font:700 26px Karla;letter-spacing:.24em;text-transform:uppercase;color:${TH[p.th].mut}">${esc(p.kick || 'pigeon polly art lab')}</div></div>${foot(p)}`,
  // полароид с подписью от руки
  polaroid: p => `${blob(p)}<div style="position:absolute;left:110px;top:${p.at || 150}px;width:780px;background:#fff;padding:30px 30px 0;box-shadow:0 26px 50px rgba(0,0,0,.25);transform:rotate(${p.ar ?? -3}deg)">
      ${img(p.art, 720, p.ah || 760, p.pos)}
      <div style="font:700 ${p.qs || 56}px/1.08 Caveat;color:#2B2622;text-align:center;padding:30px 10px 40px">${esc(p.q)}</div></div>
    ${p.kick ? `<div class="hand" style="position:absolute;left:70px;right:70px;top:${p.ky || 1240}px;text-align:center">${esc(p.kick)}</div>` : ''}${foot(p)}`,
  // мини-эссе: заголовок, картинка, 3 абзаца
  essay: p => `${blob(p)}${head(p)}
    ${fr(p.art, 876, p.h || 430, 62, p.top || 330, -1, { pos: p.pos })}
    <div style="position:absolute;left:66px;right:60px;top:${(p.top || 330) + (p.h || 430) + 56}px">${p.paras.map(t => `<p style="font:400 ${p.ps || 34}px/1.38 Karla;color:${TH[p.th].fg};margin-bottom:22px">${t}</p>`).join('')}</div>${foot(p)}`,
  // дыхание: круги
  breathe: p => `${blob(p)}${head(p)}
    <div style="position:absolute;left:200px;top:380px;width:600px;height:600px">${[600, 470, 340, 210].map((d, i) => `<div style="position:absolute;left:${(600 - d) / 2}px;top:${(600 - d) / 2}px;width:${d}px;height:${d}px;border-radius:50%;border:${4 + i}px solid ${TH[p.th].acc};opacity:${.25 + i * .22}"></div>`).join('')}
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:700 54px/1 Caveat;color:${TH[p.th].fg};text-align:center">${esc(p.center)}</div></div>
    <div style="position:absolute;left:70px;right:70px;top:1040px">${p.items.map(([a, b]) => li(a, b)).join('')}</div>${foot(p)}`,
};

(async () => {
  const only = process.argv.slice(2).map(Number);
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  const tmp = path.join(__dirname, 'shots', `_pin${SET}.html`); fs.mkdirSync(path.dirname(tmp), { recursive: true }); const out = [];
  const cnt = {};
  for (const p of PINS) {
    cnt[p.book + p.to] = (cnt[p.book + p.to] || 0) + 1;
    out.push({ n: p.n, type: p.type, title: p.title, desc: p.desc, alt: p.alt, link: p.link, topics: p.topics });
    if (only.length && !only.includes(p.n)) continue;
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Karla:wght@400;700&family=Caveat:wght@700&display=swap"><style>${CSS(TH[p.th])}</style></head><body>${T[p.tpl](p)}</body></html>`);
    await page.goto('file://' + tmp, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
    const over = await page.evaluate(() => Math.max(...[...document.querySelectorAll('body *:not(.url)')].filter(e => !/^(IMG)$/.test(e.tagName) || !e.style.opacity).map(e => e.getBoundingClientRect().bottom)));
    if (over > 1430) console.log('⚠ pin', p.n, 'bottom', Math.round(over));
    await page.screenshot({ path: path.join(ROOT, `site/images/pins/pin-${p.n}.jpg`), type: 'jpeg', quality: 86 });
  }
  console.log('ссылки:', JSON.stringify(cnt));
  if (fs.existsSync(tmp)) fs.unlinkSync(tmp); fs.writeFileSync(path.join(__dirname, `pins${SET}.json`), JSON.stringify(out, null, 1));
  await b.close();
})();
