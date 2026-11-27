// Карточки для постов «Balodis Pollijs ceļā uz Norvēģiju» (скилл norsk-lv-posts). Без маскота — слова на картинке.
// node tools/norsk/cards.js [номер…] → site/images/norsk-lv/card-<NNN>.jpg (1080×1350, формат ленты Facebook 4:5).
// Данные — tools/norsk/cards.json (образцы всех видов — cards-sample.json, картинки site/images/norsk-lv/sample-*.jpg), поле kind:
//   word    {no, pr, lv, lvl, ex, exlv, pal?}                       — слово дня: крупно, с артиклем, пример
//   literal {no, parts:[[часть, перевод]…], lit, real, lvl}          — «Burtiski»: смешной буквальный перевод
//   quiz    {no, pr, q, opts:[…], lvl}                               — «Ko tas nozīmē?» A/B/C, ответ — в комментариях/посте
//   list    {t, items:[[no, pr, lv]…], lvl, pal?}                    — 4–6 слов по теме (сезон, праздник)
//   art     {pal, t, lv, w:[[no, pr, lv, x%, y%, 'dn'?]…], lvl}      — рисунок Алины (content/palettes.json) со словами на предметах
//   phrase  {no, pr, lv, note, lvl}                                  — фраза/выражение + когда говорят
// pal — индекс в content/palettes.json: берутся цвета (и рисунок для art). Шрифты Lora/Karla — с латышскими буквами.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const PAL = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/palettes.json'), 'utf8'));
const OUT = path.join(ROOT, 'site/images/norsk-lv');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const LVL = { A1: '#3E8E5A', A2: '#2E8C8C', B1: '#2F5D8A', B2: '#5B4A8A', C1: '#A8324F', C2: '#7A2440' };
const lvlTag = l => l ? `<span class="lvl" style="background:${LVL[String(l).replace('~', '')] || '#555'}">${esc(l)}</span>` : '';
const art = s => s.replace(/^(en|ei|et|å) /, '<small>$1</small> ');
const flag = '<s class="flag"></s>';

const CSS = `*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1350px;overflow:hidden}
body{background:var(--bg);color:#2B2A33;font-family:Karla,sans-serif;position:relative}
.kick{position:absolute;left:80px;top:70px;font:700 26px Karla;letter-spacing:.2em;color:var(--acc);text-transform:uppercase;display:flex;align-items:center;gap:14px}
.flag{display:inline-block;width:40px;height:28px;text-decoration:none;border-radius:3px;background:
 linear-gradient(90deg,transparent 11px,#fff 11px,#fff 19px,transparent 19px),linear-gradient(0deg,transparent 10px,#fff 10px,#fff 18px,transparent 18px),#BA0C2F;position:relative}
.flag:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 13px,#00205B 13px,#00205B 17px,transparent 17px),linear-gradient(0deg,transparent 12px,#00205B 12px,#00205B 16px,transparent 16px)}
.lvl{display:inline-block;color:#fff;font:700 28px Karla;padding:6px 18px 8px;border-radius:40px;letter-spacing:.04em}
.top-lvl{position:absolute;right:80px;top:58px}
.foot{position:absolute;left:80px;right:80px;bottom:56px;font:italic 400 26px Lora;color:#8A7F74;display:flex;justify-content:space-between}
.mid{position:absolute;left:80px;right:80px;top:170px;bottom:150px;display:flex;flex-direction:column;justify-content:center}
.big{font:600 150px/1 Lora;color:#1F2A44;letter-spacing:-.01em}
.big small{font:italic 400 64px Lora;color:#8A7F74;margin-right:10px}
.pr{font:500 44px Karla;color:#6B6158;margin-top:26px}
.lv{font:700 72px/1.1 Karla;color:var(--acc);margin-top:30px}
.ex{margin-top:70px;padding:34px 40px;background:#fff;border-radius:26px;box-shadow:0 8px 24px rgba(40,30,20,.08)}
.ex b{display:block;font:600 42px/1.25 Lora;color:#1F2A44}.ex.note span{margin:0;color:#2B2A33;font-size:32px}.ex span{display:block;font:500 34px/1.3 Karla;color:#8A7F74;margin-top:12px}
.parts{display:flex;align-items:flex-end;gap:22px;margin-top:50px;flex-wrap:wrap}
.part{background:#fff;border-radius:24px;padding:22px 30px;box-shadow:0 8px 24px rgba(40,30,20,.08)}
.part b{display:block;font:600 64px Lora;color:#1F2A44}.part span{display:block;font:500 32px Karla;color:#8A7F74;margin-top:6px}
.plus{font:700 64px Karla;color:#C9BBA8;padding-bottom:40px}
.lit{margin-top:60px;font:700 40px Karla;color:#8A7F74;text-transform:uppercase;letter-spacing:.12em}
.lit b{display:block;font:italic 600 76px/1.1 Lora;color:var(--acc);text-transform:none;letter-spacing:0;margin-top:10px}
.real{margin-top:44px;font:500 40px Karla;color:#6B6158}.real b{color:#1F2A44;font-weight:700}
.q{font:700 46px Karla;color:var(--acc);margin-bottom:24px}
.opts{margin-top:60px;display:flex;flex-direction:column;gap:22px}
.opt{display:flex;align-items:center;gap:28px;background:#fff;border-radius:24px;padding:26px 34px;font:600 44px/1.2 Karla;color:#2B2A33;box-shadow:0 8px 24px rgba(40,30,20,.08)}
.opt i{flex:none;width:72px;height:72px;border-radius:50%;background:var(--acc);color:#fff;font:700 40px Karla;display:flex;align-items:center;justify-content:center;font-style:normal}
.cta{margin-top:44px;font:700 40px Karla;color:#1F2A44}
h1{font:600 84px/1.05 Lora;color:#1F2A44}
.rows{margin-top:50px;display:flex;flex-direction:column}
.row{display:grid;grid-template-columns:1.1fr 1fr;align-items:baseline;gap:20px;padding:24px 0;border-top:3px solid var(--line)}
.dense .rows{margin-top:30px}.dense .row{padding:14px 0}.dense h1{font-size:72px}.row b{font:600 54px Lora;color:#1F2A44}.row b small{font:italic 400 34px Lora;color:#8A7F74;margin-right:6px}
.row span{font:500 30px Karla;color:#8A7F74}.row span u{display:block;text-decoration:none;font:700 40px Karla;color:var(--acc);margin-bottom:4px}
.pic{position:absolute;left:50%;transform:translateX(-50%);border-radius:20px;box-shadow:0 10px 30px rgba(40,30,20,.18)}
.pic img{display:block;width:100%;height:100%;border-radius:20px}
.tag{position:absolute;transform:translate(-50%,-50%);white-space:nowrap}
.tag i{position:absolute;left:50%;top:50%;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:#C8102E;box-shadow:0 0 0 4px #fff,0 2px 6px rgba(0,0,0,.4)}
.tag b{position:absolute;top:-62px;left:0;transform:translateX(-50%);background:#fff;color:#1F2A44;font:700 32px Karla;padding:7px 16px 9px;border-radius:12px;box-shadow:0 3px 10px rgba(0,0,0,.28);border-bottom:4px solid #C8102E}
.tag.dn b{top:26px}.tag.l b{transform:translateX(-88%)}.tag.r b{transform:translateX(-12%)}
.abot{position:absolute;left:80px;right:80px;bottom:120px}
.abot h2{font:600 60px/1.05 Lora;color:#1F2A44}.abot h2 em{font:italic 400 36px Lora;color:#8A7F74;margin-left:14px}
.ws{display:grid;grid-template-columns:1fr 1fr;gap:12px 40px;margin-top:22px}
.ws div{border-top:3px solid var(--line);padding-top:10px}.ws b{font:700 34px Karla;color:#1F2A44}.ws span{display:block;font:500 26px Karla;color:#8A7F74}
.ws span u{text-decoration:none;color:var(--acc);font-weight:700}`;

// Цвета: по номеру карточки по кругу (соседние посты в ленте — разные); it.theme — свой индекс, it.bg/it.acc — свои цвета.
const THEMES = [
  ['#F4EEE3', '#BA0C2F'], ['#E3ECF4', '#00205B'], ['#F6E3E1', '#A8324F'], ['#E5EFE2', '#2F6B45'],
  ['#FBF0D9', '#B5651D'], ['#E4F1F0', '#1F7A7A'], ['#EEE6F3', '#5B3F8A'], ['#00205B', '#FFD36B', 1], ['#BA0C2F', '#FFFFFF', 1],
];
const DARK = `.big,.ex b,.part b,h1,.row b,.abot h2,.ws b,.cta,.real b{color:#fff}.big small,.row b small,.pr,.real,.foot,.lit,.abot h2 em,.ws span,.row span{color:rgba(255,255,255,.72)}
.ex,.part,.opt{background:rgba(255,255,255,.12);box-shadow:none}.ex span,.part span,.ex.note span{color:rgba(255,255,255,.85)}.opt{color:#fff}.opt i{color:#1F2A44}`;
function colors(it) {
  const t = THEMES[(it.theme ?? it.n) % THEMES.length];
  return { bg: it.bg || t[0], acc: it.acc || t[1], line: t[2] ? 'rgba(255,255,255,.25)' : 'rgba(0,0,0,.09)', dark: !!t[2] };
}

function body(it, img) {
  const foot = `<div class="foot"><span>Pollijs ceļā uz Norvēģiju</span><span>pigeonpolly.com</span></div>`;
  const kick = t => `<div class="kick">${flag}${esc(t)}</div><div class="top-lvl">${lvlTag(it.lvl)}</div>`;
  switch (it.kind) {
    case 'word': return `${kick('Vārds dienai')}<div class="mid"><div class="big">${art(esc(it.no))}</div><div class="pr">(izrunā: ${esc(it.pr)})</div><div class="lv">${esc(it.lv)}</div>
      ${it.ex ? `<div class="ex"><b>${esc(it.ex)}</b><span>${esc(it.exlv)}</span></div>` : ''}</div>${foot}`;
    case 'phrase': return `${kick('Izteiciens')}<div class="mid"><div class="big" style="font-size:104px;line-height:1.05">${esc(it.no)}</div><div class="pr">(izrunā: ${esc(it.pr)})</div><div class="lv" style="font-size:60px">${esc(it.lv)}</div>
      ${it.note ? `<div class="ex note"><span>${esc(it.note)}</span></div>` : ''}</div>${foot}`;
    case 'literal': return `${kick('Smieklīgi vārdi')}<div class="mid"><div class="big" style="font-size:${it.no.length > 10 ? 120 : 150}px">${esc(it.no)}</div>
      <div class="parts">${it.parts.map(([a, b]) => `<div class="part"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('<div class="plus">+</div>')}</div>
      <div class="lit">Burtiski:<b>${esc(it.lit)}</b></div><div class="real">Patiesībā: <b>${esc(it.real)}</b></div></div>${foot}`;
    case 'quiz': return `${kick('Uzmini!')}<div class="mid"><div class="q">${esc(it.q || 'Ko tas nozīmē?')}</div><div class="big" style="font-size:${it.no.length > 12 ? 96 : 130}px;line-height:1.05">${art(esc(it.no))}</div>
      ${it.pr ? `<div class="pr">(izrunā: ${esc(it.pr)})</div>` : ''}<div class="opts">${it.opts.map((o, i) => `<div class="opt"><i>${'ABC'[i]}</i>${esc(o)}</div>`).join('')}</div>
      <div class="cta">Raksti atbildi komentāros 👇</div></div>${foot}`;
    case 'list': return `${kick('Norvēģu valoda')}<div class="mid${it.items.length > 5 ? ' dense' : ''}" style="justify-content:flex-start;top:190px"><h1>${esc(it.t)}</h1><div class="rows">${it.items.map(([no, pr, lv]) => `<div class="row"><b>${art(esc(no))}</b><span><u>${esc(lv)}</u>(izrunā: ${esc(pr)})</span></div>`).join('')}</div></div>${foot}`;
    case 'art': {
      const rows = Math.ceil(it.w.length / 2), boxTop = 150, boxH = 1350 - boxTop - (250 + rows * 92);
      let aw = 920, ah = aw * img.h / img.w; if (ah > boxH) { ah = boxH; aw = ah * img.w / img.h; }
      const tags = it.w.map(([no, , , x, y, f]) => `<div class="tag ${y < 16 || f === 'dn' ? 'dn' : ''} ${x > 78 ? 'l' : x < 20 ? 'r' : ''}" style="left:${x}%;top:${y}%"><i></i><b>${esc(no.replace(/^(en|ei|et) /, ''))}</b></div>`).join('');
      return `${kick('Norvēģu valoda')}<div class="pic" style="top:${boxTop + (boxH - ah) / 2}px;width:${aw}px;height:${ah}px"><img src="file://${img.file}">${tags}</div>
        <div class="abot"><h2>${esc(it.t)}<em>${esc(it.lv)}</em></h2><div class="ws">${it.w.map(([no, pr, lv]) => `<div><b>${esc(no)}</b><span><u>${esc(lv)}</u> · ${esc(pr)}</span></div>`).join('')}</div></div>${foot}`;
    }
  }
  throw new Error('kind? ' + it.kind);
}

(async () => {
  const all = JSON.parse(fs.readFileSync(path.join(__dirname, 'cards.json'), 'utf8'));
  const want = process.argv.slice(2).map(Number);
  const list = want.length ? all.filter(x => want.includes(x.n)) : all;
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch(), page = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const it of list) {
    let img = null;
    if (it.kind === 'art') {
      const p = PAL[it.pal]; if (!p) throw new Error('no art ' + it.pal);
      img = { file: path.join(ROOT, 'site', p.img) };
      await page.goto('file://' + img.file);
      Object.assign(img, await page.evaluate(() => ({ w: document.images[0].naturalWidth, h: document.images[0].naturalHeight })));
    }
    const c = colors(it);
    const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;1,400;1,600&family=Karla:wght@400;500;600;700&display=block&subset=latin-ext">
      <style>:root{--bg:${c.bg};--acc:${c.acc};--line:${c.line}}${CSS}${c.dark ? DARK : ''}</style></head><body>${body(it, img)}</body></html>`;
    const tmp = path.join(OUT, '_card.html'); fs.writeFileSync(tmp, html);
    await page.goto('file://' + tmp, { waitUntil: 'networkidle' }); fs.unlinkSync(tmp);
    await page.evaluate(() => document.fonts.ready);
    const f = path.join(OUT, `card-${String(it.n).padStart(3, '0')}.jpg`);
    await page.screenshot({ path: f, type: 'jpeg', quality: 88 });
    console.log(path.relative(ROOT, f));
  }
  await b.close();
})();
