#!/usr/bin/env node
// Ролики про игры сайта (этап 15 игры, docs/games.md «Видео игр»): настоящая игра со страницы site/, снятая покадрово в Chromium.
// Время в странице — подставное (page.clock): кадр = +1/30 с игрового времени (или больше — «перемотка»), CSS-анимации шагают так же.
// Сервер не нужен: файлы отдаёт свой http-сервер из site/, /api/* отвечает сценарий ролика (tools/video/games/<имя>.js).
// Музыка — ретро-мелодии сайта (site/assets/shift-music.js), записанные в OfflineAudioContext → WAV → ffmpeg.
//
//   node tools/video/games.js pancakes            — _held/video/pigeonpolly-game-pancakes-en.mp4
//   node tools/video/games.js pancakes --keys     — лист ключевых кадров _shots/video_keys_pancakes.png
//   node tools/video/games.js all                 — все ролики
// Сценарий: { title, url, cover, join, music, show, init?, api(method, path, body), setup(v), step(v, t), keys }; финал начинается, когда step ставит v.fin.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..'), SITE = path.join(ROOT, 'site'), OUT = path.join(ROOT, '_held', 'video');
const FPS = 30, VW = 360, VH = 640, DPR = 3; // 1080×1920
const FILMS = ['pancakes', 'shift', 'garden'];
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp' };

function serve() {
  return new Promise(ok => {
    const srv = http.createServer((q, r) => {
      let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
      const f = path.join(SITE, path.normalize(p));
      if (!f.startsWith(SITE)) { r.writeHead(403); return r.end(); }
      fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); r.end(d); });
    }).listen(0, '127.0.0.1', () => ok(srv));
  });
}

// в странице до всех скриптов: случайность с зерном (ролик каждый раз одинаковый), шаг CSS-анимаций вместе с подставным временем
const PRE = seed => `(() => {
  let s = ${seed} >>> 0; Math.random = () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  window.__animStep = dt => { for (const a of document.getAnimations()) { if (a.__t == null) { a.__t = a.currentTime || 0; a.pause(); } a.__t += dt; a.currentTime = a.__t; } };
})();`;

// слой поверх страницы: звёзды фона, заголовок и подпись, следы нажатий, финал
const OVERLAY = `(() => {
  const css = document.createElement('style');
  css.textContent = \`
    html, body { background: #2B1A51 !important; overflow: hidden !important; }
    body * { visibility: hidden; }
    .vid-show, .vid-show *, .pp-toast, .pp-toast *, #vid-top, #vid-top *, #vid-bg, #vid-fin, .vid-tap, dialog[open], dialog[open] * { visibility: visible; }
    #vid-bg, #vid-fin { position: fixed; inset: 0; width: 360px; height: 640px; pointer-events: none; }
    #vid-bg { z-index: 0; } #vid-fin { z-index: 3000; }
    #vid-top { position: fixed; left: 0; right: 0; top: 0; z-index: 2500; text-align: center; pointer-events: none; padding-top: 22px; }
    #vid-top h1 { margin: 0; font: 600 30px var(--serif); color: #F3EFFA; letter-spacing: -.01em; }
    #vid-top p { margin: 8px 16px 0; min-height: 22px; font: 700 18px var(--sans); color: #F0A987; }
    .vid-tap { position: fixed; z-index: 2600; border-radius: 50%; pointer-events: none; border: 3px solid #fff; }
    .pp-toast { bottom: 30px !important; }
  \`;
  document.head.appendChild(css);
  const mk = (tag, id) => { const e = document.createElement(tag); e.id = id; document.body.appendChild(e); return e; };
  const bg = mk('canvas', 'vid-bg'), fin = mk('canvas', 'vid-fin'), top = mk('div', 'vid-top');
  bg.width = fin.width = 1080; bg.height = fin.height = 1920;
  top.innerHTML = '<h1></h1><p></p>';
  const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), seg = (t, a, b) => clamp((t - a) / (b - a));
  const ease = k => k < .5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2, back = k => 1 + 2.7 * (k - 1) ** 3 + 1.7 * (k - 1) ** 2;
  const BG = '#2B1A51', PEACH = '#F0A987';
  function stars(g, t) {
    g.fillStyle = BG; g.fillRect(0, 0, 1080, 1920);
    for (let i = 0; i < 46; i++) {
      const x = Math.floor(rnd(i) * 90) * 12, y = Math.floor(rnd(i + 9) * 160) * 12;
      if (Math.sin(t * 2.2 + i * 1.7) <= -.3 || (y < 330 && x > 90 && x < 990)) continue; // не по заголовку
      g.fillStyle = i % 5 ? '#534AB7' : PEACH; g.fillRect(x, y, 12, 12);
      if (i % 4 === 0) { g.fillRect(x - 12, y, 36, 12); g.fillRect(x, y - 12, 12, 36); }
    }
  }
  let cover = null, cap = '', capT = 0;
  const text = (g, s, x, y, font, c) => { g.font = font; g.fillStyle = c; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, x, y); };
  window.VID = {
    init(o) { top.querySelector('h1').textContent = o.title; (o.show || []).forEach(s => document.querySelectorAll(s).forEach(e => e.classList.add('vid-show')));
      return o.cover ? this.setCover(o.cover) : null; },
    setCover(src) { return new Promise(ok => { cover = new Image(); cover.onload = ok; cover.onerror = ok; cover.src = src; }); },
    // t — секунды ролика; c — подпись; taps — [{x, y, t}]; f0 — секунда начала финала; o — тексты финала
    paint(t, c, taps, f0, o) {
      stars(bg.getContext('2d'), t);
      const p = top.querySelector('p');
      if (c !== cap) { cap = c; capT = t; p.textContent = c; }
      p.style.opacity = seg(t, capT, capT + .25); p.style.transform = 'translateY(' + (1 - ease(seg(t, capT, capT + .25))) * 8 + 'px)';
      document.querySelectorAll('.vid-tap').forEach(e => e.remove());
      for (const q of taps) {
        const k = (t - q.t) / .5; if (k < 0 || k > 1) continue;
        const e = document.createElement('div'), r = 10 + 26 * ease(k);
        e.className = 'vid-tap'; Object.assign(e.style, { left: q.x - r + 'px', top: q.y - r + 'px', width: 2 * r + 'px', height: 2 * r + 'px', opacity: 1 - k, background: 'rgba(255,255,255,' + (.35 * (1 - k)) + ')' });
        document.body.appendChild(e);
      }
      const g = fin.getContext('2d'); g.clearRect(0, 0, 1080, 1920);
      if (t < f0) { fin.style.opacity = 0; return; }
      fin.style.opacity = 1;
      const k = seg(t, f0, f0 + .5);
      g.globalAlpha = k; stars(g, t);
      g.fillStyle = 'rgba(240,169,135,.18)'; g.beginPath(); g.arc(540, 700, 360, 0, Math.PI * 2); g.fill();
      if (cover && cover.naturalWidth) {
        const sc = k < 1 ? .7 + .3 * back(k) : 1, ar = cover.naturalHeight / cover.naturalWidth, w = (ar < .9 ? 820 : 560) * sc, h = w * ar; // квадратная заставка или кадр игры
        g.save(); g.translate(540, 700); g.rotate(-.05 + Math.sin(t * 1.6) * .015); g.imageSmoothingEnabled = false;
        g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(-w / 2 + 16, -h / 2 + 20, w, h);
        g.fillStyle = '#FBF6EC'; g.fillRect(-w / 2 - 14, -h / 2 - 14, w + 28, h + 28);
        g.drawImage(cover, -w / 2, -h / 2, w, h); g.restore();
      }
      g.globalAlpha = seg(t, f0 + .4, f0 + .8); text(g, o.name, 540, 1130, '600 84px Fraunces, Georgia, serif', '#F3EFFA');
      g.globalAlpha = seg(t, f0 + .7, f0 + 1.1); text(g, 'pigeonpolly.com', 540, 1270, '600 104px Fraunces, Georgia, serif', '#F3EFFA');
      o.join.forEach((l, i) => { g.globalAlpha = seg(t, f0 + 1 + .2 * i, f0 + 1.4 + .2 * i); text(g, l, 540, 1410 + 80 * i, '700 60px Karla, system-ui, sans-serif', PEACH); });
      g.globalAlpha = 1;
    },
  };
})();`;

async function openFilm(br, port, F) {
  const page = await br.newPage({ viewport: { width: VW, height: VH }, deviceScaleFactor: DPR });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.clock.install({ time: new Date(F.at || '2026-10-24T12:00:00+03:00') });
  await page.addInitScript(PRE(F.seed || 7) + (F.init || ''));
  await page.route(/\/api\//, async r => {
    const q = r.request(), u = new URL(q.url());
    let body = null; try { body = q.postDataJSON(); } catch (e) { /* не JSON */ }
    const res = F.api ? F.api(q.method(), u.pathname + u.search, body) : null;
    await r.fulfill(res == null ? { status: 404, body: '' } : { status: 200, contentType: 'application/json', body: JSON.stringify(res) });
  });
  await page.goto(`http://127.0.0.1:${port}${F.url}`, { waitUntil: 'load' });
  await page.clock.runFor(500);
  await page.evaluate(OVERLAY);
  await page.evaluate(o => Promise.all([document.fonts.load('600 104px Fraunces'), document.fonts.load('700 60px Karla')]).then(() => VID.init(o)), { title: F.title, show: F.show, cover: F.cover });
  if (errs.length) throw new Error('ошибки на странице: ' + errs.join('; '));
  return { page, errs };
}

// режиссёр: v.tap(селектор | {x, y}), v.hold / v.release, v.cap(текст), v.speed, v.s() — состояние игры (если сценарий его даёт)
function director(page, F) {
  const v = { page, F, caption: '', taps: [], speed: 1, t: 0, mem: {}, fin: F.fin };
  v.box = async sel => page.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
  v.tap = async (where, quiet) => {
    const p = typeof where === 'string' ? await v.box(where) : where;
    if (!p) throw new Error(`не найдено: ${where} (${v.t.toFixed(2)} с)`);
    await page.mouse.click(p.x, p.y);
    if (!quiet) v.taps.push({ x: p.x, y: p.y, t: v.t });
  };
  v.hold = async sel => { const p = await v.box(sel); await page.mouse.move(p.x, p.y); await page.mouse.down(); v.taps.push({ x: p.x, y: p.y, t: v.t }); v.holdAt = p; };
  v.release = async () => { await page.mouse.up(); v.holdAt = null; };
  v.cap = s => { v.caption = s; };
  v.once = (k, f) => { if (v.mem[k]) return; v.mem[k] = true; return f(); };
  return v;
}

async function shoot(br, port, name, keysOnly) {
  const F = require(`./games/${name}.js`);
  const { page } = await openFilm(br, port, F);
  const v = director(page, F);
  if (F.setup) await F.setup(v);
  const keys = new Set((F.keys || []).map(s => Math.round(s * FPS))), TAIL = F.tail || 4.5;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ppgame-'));
  const shots = [];
  let ms = 0;
  let n = 0;
  for (; v.fin == null || n < Math.round((v.fin + TAIL) * FPS); n++) { // конец — через TAIL секунд после начала финала (финал ставит сценарий: v.fin)
    if (n > 60 * FPS) throw new Error('ролик длиннее минуты — сценарий не дошёл до финала');
    v.t = n / FPS;
    await F.step(v, v.t);
    if (v.holdAt) v.taps.push({ x: v.holdAt.x, y: v.holdAt.y, t: v.t - .35 }); // пока держит — палец на кнопке
    await page.evaluate(([t, c, taps, fin, o]) => VID.paint(t, c, taps, fin, o), [v.t, v.caption, v.taps.filter(q => v.t - q.t < .6), v.fin == null ? 1e9 : v.fin, { name: F.title, join: F.join }]);
    if (!keysOnly || keys.has(n)) {
      const buf = await page.screenshot({ type: 'png' });
      if (keysOnly) shots.push(buf); else fs.writeFileSync(path.join(dir, String(n).padStart(4, '0') + '.png'), buf);
    }
    if (keysOnly && shots.length === keys.size) break;
    // шаг времени: игра — с текущей скоростью, CSS-анимации — так же
    const step = 1000 / FPS * v.speed, to = Math.round(ms + step), dt = to - Math.round(ms); ms += step;
    await page.clock.runFor(dt);
    await page.evaluate(d => window.__animStep(d), dt);
  }
  await page.close();
  F.seconds = n / FPS;
  return { F, dir, shots };
}

// музыка: ретро-трек сайта, записанный без колонок (OfflineAudioContext) → WAV
// m: { i } — трек сайта, { track } — свой трек в формате TRACKS, { lullaby: true } — колыбельная из финала «Смены»
async function music(br, port, m, seconds, seed, file) {
  const page = await br.newPage();
  await page.goto(`http://127.0.0.1:${port}/404.html`);
  const b64 = await page.evaluate(async ({ seconds, m, seed }) => {
    const SR = 44100, len = Math.ceil((seconds + 1) * SR);
    let s = seed >>> 0; Math.random = () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const src = await (await fetch('/assets/shift-music.js')).text();
    window.AudioContext = class extends OfflineAudioContext { constructor() { super(2, len, SR); window.__ctx = this; } resume() { return Promise.resolve(); } };
    // планировщик сайта заглядывает на 2,5 с вперёд — здесь на весь ролик сразу
    (0, eval)(src.replace('ctx.currentTime + 2.5', 'ctx.currentTime + ' + (seconds + 1)));
    const M = window.PPShiftMusic;
    if (m.track) M.TRACKS.push(m.track);
    M.volume(1);
    if (m.lullaby) M.lullaby(2); else M.play(m.track ? M.TRACKS.length - 1 : m.i);
    const buf = await window.__ctx.startRendering();
    // WAV 16 бит
    const ch = [buf.getChannelData(0), buf.getChannelData(1)], n = buf.length, out = new DataView(new ArrayBuffer(44 + n * 4));
    const w = (o, str) => [...str].forEach((c, i) => out.setUint8(o + i, c.charCodeAt(0)));
    w(0, 'RIFF'); out.setUint32(4, 36 + n * 4, true); w(8, 'WAVEfmt '); out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, 2, true);
    out.setUint32(24, SR, true); out.setUint32(28, SR * 4, true); out.setUint16(32, 4, true); out.setUint16(34, 16, true); w(36, 'data'); out.setUint32(40, n * 4, true);
    let peak = 0; for (const c of ch) for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(c[i]));
    const k = peak > 0 ? .89 / peak : 1;
    for (let i = 0; i < n; i++) for (let c = 0; c < 2; c++) out.setInt16(44 + i * 4 + c * 2, Math.max(-1, Math.min(1, ch[c][i] * k)) * 32767, true);
    let bin = ''; const u8 = new Uint8Array(out.buffer); for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return btoa(bin);
  }, { seconds, m, seed });
  fs.writeFileSync(file, Buffer.from(b64, 'base64'));
  await page.close();
}

async function main() {
  const args = process.argv.slice(2), keysOnly = args.includes('--keys');
  const names = args.includes('all') ? FILMS : args.filter(a => FILMS.includes(a));
  if (!names.length) { console.log('node tools/video/games.js (' + FILMS.join(' | ') + ' | all) [--keys]'); process.exit(1); }
  const srv = await serve(), port = srv.address().port;
  const br = await chromium.launch();
  for (const name of names) {
    const { F, dir, shots } = await shoot(br, port, name, keysOnly);
    if (keysOnly) {
      const sheet = await br.newPage({ viewport: { width: 1200, height: 800 } });
      await sheet.setContent(`<body style="margin:0"><div id="s" style="display:grid;grid-template-columns:repeat(${shots.length},1fr);gap:8px;padding:8px;width:1184px;background:#fff">${shots.map(b => `<img style="width:100%;display:block" src="data:image/png;base64,${b.toString('base64')}">`).join('')}</div></body>`);
      const out = path.join(ROOT, '_shots', `video_keys_${name}.png`);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      await sheet.locator('#s').screenshot({ path: out });
      await sheet.close();
      console.log('лист:', path.relative(ROOT, out));
      continue;
    }
    fs.mkdirSync(OUT, { recursive: true });
    const mp4 = path.join(OUT, `pigeonpolly-game-${name}-en.mp4`);
    // звук: куски музыки (F.audio — [{ i | track | lullaby, from }], по умолчанию F.music с начала), каждый — свой WAV, сведены по времени
    const segs = F.audio || [{ ...F.music, from: 0 }], ins = [], fl = [];
    for (let k = 0; k < segs.length; k++) {
      const a = segs[k], to = k + 1 < segs.length ? segs[k + 1].from : F.seconds, d = to - a.from, wav = path.join(dir, `music${k}.wav`);
      await music(br, port, a, d, (F.seed || 7) + k, wav);
      ins.push('-i', wav);
      fl.push(`[${k + 1}:a]atrim=0:${d.toFixed(3)},afade=t=in:d=${k ? 0.05 : 0.3},afade=t=out:st=${Math.max(0, d - 0.35).toFixed(3)}:d=0.35,adelay=${Math.round(a.from * 1000)}:all=1[a${k}]`);
    }
    fl.push(`${segs.map((_, k) => `[a${k}]`).join('')}amix=inputs=${segs.length}:normalize=0,afade=t=out:st=${Math.max(0, F.seconds - 1.5).toFixed(3)}:d=1.5[aout]`);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, '%04d.png'), ...ins,
      '-filter_complex', fl.join(';'), '-map', '0:v', '-map', '[aout]',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-c:a', 'aac', '-b:a', '192k', '-t', F.seconds.toFixed(3), '-movflags', '+faststart', mp4]);
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`${path.relative(ROOT, mp4)}: ${F.seconds} с, ${Math.round(fs.statSync(mp4).size / 1024)} КБ`);
  }
  await br.close(); srv.close();
}
main().catch(e => { console.error(e); process.exit(1); });
