// Видео для соцсетей (этап 15, docs/bird.md «Видео»): 1080×1920, 30 fps. Комната — PPRoom.mount с o.film (птичку и всё своё рисует
// сценарий ниже), птичка — PPBirds.spriteHD. FILM.frame(n) рисует кадр n и отдаёт PNG (dataURL); рендер — tools/video/render.py.
// ?lang=en|ru|lv — язык финальной надписи (остальные кадры у всех версий одинаковые).
(() => {
  const B = window.PPBirds, RM = window.PPRoom;
  const FPS = 30, VW = 1080, VH = 1920, S = 14, RW = RM.RW, RH = RM.RH, GY = 113;
  const VIEW = VW / S, ROOM_Y = (VH - RH * S) / 2;      // в кадре 77 из 192 пикселей комнаты, камера едет за птичкой
  const BG = '#2B1A51', OUT = '#1a1528';
  const LANG = new URLSearchParams(location.search).get('lang') || 'en';
  const HATCH = { en: '🥚 Hatch your bird', ru: '🥚 Вылупи свою птичку', lv: '🥚 Izperē savu putniņu' }[LANG]; // как на кнопке с яйцом (content/i18n)
  const END = 19; // секунд

  // ---------- время ----------
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = k => k < .5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
  const seg = (t, t0, t1) => clamp((t - t0) / (t1 - t0));
  const lerp = (a, b, k) => a + (b - a) * k;
  const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }; // одинаково в каждом рендере

  // ---------- птичка: круглая сиреневая (id 27) с беретом; тапочки рисуем сами, чтобы снять по одной ----------
  const lk = Object.assign({}, B.looks(27), { shoe: null });
  const FR = [0, 1, 2].map(f => B.spriteHD(lk, f));
  const SLIP = ['.....oo...', '....owwo..', '.oooowwooo', 'occcccppco', 'occcccccco', 'oddddddddo', '.oooooooo.'];
  const SLIP_PAL = { o: OUT, w: '#FFFFFF', c: '#F08BC0', p: '#F7B6D6', d: '#C76A9A' };
  const stamp = (c, rows, x0, y0, pal) => rows.forEach((r, y) => [...r].forEach((ch, x) => { if (pal[ch]) { c.fillStyle = pal[ch]; c.fillRect(x0 + x, y0 + y, 1, 1); } }));
  const feet = f => (f === 1 ? [-5, 4] : [-3, 2]).map(d => 20 + d + B.HO); // левый край лапок в спрайте (как в spriteHD)
  const cache = {};
  function birdPic(f, back, front) {
    const key = f + '' + +back + +front; if (cache[key]) return cache[key];
    const c = document.createElement('canvas'); c.width = B.HW; c.height = B.HH; const x = c.getContext('2d');
    x.drawImage(FR[f], 0, 0);
    const [l0, l1] = feet(f);
    if (back) stamp(x, SLIP, l0 - 3, B.HB - 5, SLIP_PAL);
    if (front) stamp(x, SLIP, l1 - 3, B.HB - 5, SLIP_PAL);
    return (cache[key] = c);
  }
  // птичка в комнате: пиксель спрайта = полпикселя комнаты; x — середина тела, y — где стоят лапки
  function drawBird(g, b) {
    const c = birdPic(b.f, b.back, b.front), x = Math.round(b.x * 2) / 2, y = Math.round(b.y * 2) / 2;
    g.save();
    if (b.dir < 0) { g.translate(x * 2, 0); g.scale(-1, 1); }
    g.drawImage(c, x - (20 + B.HO) / 2, y - (B.HB + 1) / 2, c.width / 2, c.height / 2);
    g.restore();
  }
  // тапочка на полу или в полёте (spin — сколько раз перевернулась)
  const slipPic = (() => { const c = document.createElement('canvas'); c.width = 10; c.height = 7; stamp(c.getContext('2d'), SLIP, 0, 0, SLIP_PAL); return c; })();
  function drawSlipper(g, x, y, spin = 0) {
    g.save(); g.translate(x + 2.5, y - 1.75);
    if (spin) g.rotate(Math.round(spin * 8) / 8 * Math.PI * 2); // поворот ступеньками по 45° — пиксели не «плывут»
    g.drawImage(slipPic, -2.5, -1.75, 5, 3.5); g.restore();
  }

  // ---------- комната: кухня из темы «👩‍🍳 Поварское» ----------
  const room = { wall: 'kitchentiles', floor: 'checker', curtain: 'polkadot', items: [
    { k: 'furn', v: 'album', x: 174 },
    { k: 'furn', v: 'baguettes', x: 128 },
    { k: 'furn', v: 'chefcounter', x: 70 },
    { k: 'furn', v: 'spicerack', x: 73, y: 50 },
    { k: 'deco', v: 'ladles', x: 92, y: 49 },
    { k: 'deco', v: 'menuboard', x: 38, y: 40 },
    { k: 'deco', v: 'garlic', x: 60, y: 34 },
  ] };
  const STOVE = { x: 103, y: GY - 26, d: RM.defOf('furn', 'stove') };
  const PAN = { x: 104.5, y: 91 }; // сковородка на плите (вместо кастрюли)
  const PLATE = { x: 73, y: 97 }; // тарелка на поварском столе

  // ---------- сценарий (секунды) ----------
  const DOOR = { x: 6, w: 26, top: 62 }; // дверь слева: проём x 9…29
  const doorOpen = t => t < 4.6 ? ease(seg(t, .8, 1.6)) : 1 - ease(seg(t, 5.6, 6.2));
  const SL1 = { t0: 4.15, t1: 4.65, x: 37 }, SL2 = { t0: 4.9, t1: 5.4, x: 41.5 }; // тапочки слетают к двери
  const TOSS = [[9.6, 10.3], [11.7, 12.4]];                                     // блинчик со сковородки на тарелку
  const FLIP = [8.9, 11.05];                                                   // переворот на сковородке
  const BATTER = [8.0, 10.4];                                                  // налила тесто
  const BITES = [13.7, 14.3, 14.9];                                            // откусила — блинчиков меньше
  function stackAt(t) { let n = 1 + TOSS.filter(([, b]) => t >= b).length; BITES.forEach(b => { if (t >= b) n--; }); return Math.max(0, n); }
  function bird(t) {
    const b = { x: 46, y: GY, dir: 1, f: 0, back: true, front: true };
    const walkF = () => Math.floor(t / .16) % 2;
    if (t < 1.7) { b.x = -12; return b; }
    if (t < 3.4) { b.x = lerp(-1, 46, seg(t, 1.7, 3.4)); b.f = walkF(); return b; }
    if (t < 6.0) {
      b.back = t < SL1.t0; b.front = t < SL2.t0;
      for (const s of [SL1, SL2]) if (t >= s.t0 - .2 && t < s.t0 + .15) b.y = GY - 1.5 * Math.sin(Math.PI * seg(t, s.t0 - .2, s.t0 + .15)); // подпрыгивает — тапочка слетает
      if (t > 5.5) b.dir = -1; // оглянулась на тапочки
      if (t > 5.85) b.dir = 1;
      return b;
    }
    b.back = b.front = false;
    if (t < 7.1) { b.x = lerp(46, 64, seg(t, 6.0, 7.1)); b.f = walkF(); return b; }
    if (t < 7.75) { const k = seg(t, 7.1, 7.75); b.x = lerp(64, 99, k); b.y = lerp(GY, 97, k) - Math.sin(Math.PI * k) * 14; return b; } // прыг на стол
    b.x = 99; b.y = 97;
    if (t < 12.6) { b.f = t > 8.0 && Math.floor(t / .25) % 2 ? 2 : 0; return b; } // печёт
    b.dir = -1;
    if (t < 12.95) { b.x = lerp(99, 92, seg(t, 12.6, 12.95)); b.f = walkF(); return b; }
    b.x = 92;
    if (t < 15.2) { b.f = Math.floor(t / .22) % 2 ? 2 : 0; return b; } // ест
    b.dir = 1; b.y = 97 - 2 * Math.abs(Math.sin((t - 15.2) * 9)) * (t < 15.9 ? 1 : 0); // радуется
    return b;
  }
  const camX = t => lerp(0, 60, ease(seg(t, 5.9, 7.9)));

  // ---------- рисование своего поверх комнаты ----------
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  function drawDoor(g, t) {
    const a = doorOpen(t), { x, w, top } = DOOR, ix = x + 3, iw = w - 6, iy = top + 3;
    R(g, x, top, w, GY - top, '#7A4A30'); R(g, x + 1, top + 1, w - 2, 1, '#A0673C'); // коробка
    if (a > 0) { // за дверью — солнечный двор
      R(g, ix, iy, iw, GY - iy, '#BFE3F5'); R(g, ix, iy, iw, 10, '#A8D6F0');
      R(g, ix + 12, iy + 4, 4, 4, '#FFF1A8');
      R(g, ix, GY - 16, iw, 16, '#7FC28A'); R(g, ix, GY - 16, iw, 1, '#9AD4A2');
      for (let i = 0; i < 5; i++) R(g, ix + 2 + i * 4, GY - 17 - (i % 2), 2, 2, '#5FA86B');
      g.fillStyle = '#E8D9B5'; g.beginPath(); g.moveTo(ix + 7, GY - 16); g.lineTo(ix + 13, GY - 16); g.lineTo(ix + iw, GY); g.lineTo(ix, GY); g.fill();
      g.fillStyle = `rgba(255,240,190,${.28 * a})`; g.beginPath(); g.moveTo(ix, GY); g.lineTo(ix + iw, GY); g.lineTo(ix + iw + 22, RH); g.lineTo(ix + 4, RH); g.fill(); // свет на полу
    }
    const lw = Math.max(1.5, iw * Math.cos(a * Math.PI / 2 * .94)), grow = 3 * Math.sin(a * Math.PI / 2); // створка поворачивается к нам
    const ly = iy - grow, lh = GY - iy + grow * 1.4;
    R(g, ix, ly, lw, lh, a > .5 ? '#B5823E' : '#C8955E');
    if (lw > 6) {
      const pw = lw - 6;
      R(g, ix + 3, ly + 4, pw, lh * .38, '#B5823E'); R(g, ix + 3, ly + 8 + lh * .38, pw, lh * .42, '#B5823E');
      R(g, ix + 3, ly + 4, pw, 1, '#D9A86E'); R(g, ix + 3, ly + 8 + lh * .38, pw, 1, '#D9A86E');
      R(g, ix + lw - 3, ly + lh * .55, 1.5, 1.5, '#E9C46A');
    }
    R(g, ix + lw - .5, ly, .5, lh, '#7A4A30');
  }
  function drawStove(g, t) {
    const p = (x, y, w, h, c) => { if (y >= 6) R(g, STOVE.x + x, STOVE.y + y, w, h, c); }; // плита без кастрюли
    STOVE.d.d(p, t * 1000, STOVE.d.i, {});
    const on = t > 7.9 && t < 12.8;
    if (on) for (let i = 0; i < 4; i++) R(g, PAN.x + 1 + i * 3, PAN.y + 1.5 - (Math.floor(t * 12 + i) % 2) * .5, 1, 1, i % 2 ? '#F6C445' : '#F08A3B'); // огонёк
    R(g, PAN.x - .5, PAN.y - .5, 15, 3.5, OUT); R(g, PAN.x, PAN.y + .5, 14, 2, '#4A4560'); R(g, PAN.x, PAN.y, 14, .5, '#8A8696');
    R(g, PAN.x + 14, PAN.y + .5, 4, 1, OUT); R(g, PAN.x + 17.5, PAN.y, 3.5, 1.5, '#8C5A3C');
  }
  // блинчик: cx, cy — середина; flip 0…1 — переворот (сплющивается), done — румяность 0…1
  function pancake(g, cx, cy, flip, done) {
    const c = Math.cos(flip * Math.PI), h = Math.max(1, 3 * Math.abs(c)), up = c >= 0;
    const top = done < .5 ? '#F6E2AE' : up ? '#EDB765' : '#D99A4A', edge = done < .5 ? '#C9A45E' : '#8B4A20';
    const x = Math.round((cx - 6) * 2) / 2, y = Math.round((cy - h / 2) * 2) / 2;
    R(g, x + 1, y - .5, 10, h + 1, edge); R(g, x, y + .5, 12, Math.max(0, h - 1), edge); // контур
    R(g, x + 1, y, 10, h, top); R(g, x + .5, y + .5, 11, Math.max(0, h - 1), top);
    if (h >= 2) { R(g, x + 1, y + h - .5, 10, .5, done < .5 ? '#E9CC86' : '#C9873C'); if (done >= .5) { R(g, x + 3, y + .5, 1, .5, '#B5782E'); R(g, x + 7, y + 1, 1.5, .5, '#B5782E'); } }
  }
  function drawPancakes(g, t) {
    // на сковородке
    BATTER.forEach((t0, i) => {
      const toss = TOSS[i], flip = FLIP[i];
      if (t < t0 || t >= toss[0]) return;
      const grow = seg(t, t0, t0 + .35), done = seg(t, flip, flip + .1) > 0 ? 1 : seg(t, t0 + .3, flip) * .49;
      const fk = seg(t, flip, flip + .5), hop = Math.sin(Math.PI * fk) * 9;
      if (grow < 1) { R(g, PAN.x + 7 - 5.5 * grow, PAN.y - .5, 11 * grow, 1.5, '#F6E2AE'); return; }
      pancake(g, PAN.x + 7, PAN.y - 1 - hop, fk, fk > .5 ? 1 : done);
    });
    // в полёте на тарелку (через голову птички)
    TOSS.forEach(([a, b]) => {
      if (t < a || t >= b) return;
      const k = seg(t, a, b), ex = PLATE.x + 6, ey = PLATE.y - 3 - stackAt(a) * 2.5;
      pancake(g, lerp(PAN.x + 7, ex, k), lerp(PAN.y - 1, ey, k) - Math.sin(Math.PI * k) * 26, k * 2, 1);
    });
    // стопка на тарелке
    R(g, PLATE.x - .5, PLATE.y - 1.5, 15, 1.5, OUT); R(g, PLATE.x, PLATE.y - 1.5, 14, 1, '#FFFFFF'); R(g, PLATE.x + 1, PLATE.y - .5, 12, .5, '#C9CDD6');
    const n = stackAt(t);
    for (let i = 0; i < n; i++) pancake(g, PLATE.x + 7, PLATE.y - 3 - i * 2.5, 0, 1);
    if (n) { const y = PLATE.y - 5.5 - (n - 1) * 2.5; R(g, PLATE.x + 5, y, 4, 1.5, '#FFF3A8'); R(g, PLATE.x + 5, y + 1, 4, .5, '#E9C46A'); } // масло
    if (t > BITES[0] - .6) for (let i = 0; i < 6; i++) if (t > BITES[0] - .6 + i * .25) R(g, PLATE.x + rnd(i) * 14, PLATE.y - 2, 1, .5, '#C9873C'); // крошки
  }
  // пар: белые клубочки поднимаются над сковородкой
  function drawSteam(g, t) {
    for (let i = 0; i < 46; i++) {
      const t0 = 8.2 + i * .1, life = 1.3, a = (t - t0) / life;
      if (a < 0 || a > 1 || t0 > 12.6) continue;
      const x = PAN.x + 2 + rnd(i) * 10 + Math.sin(a * 5 + i) * 2, y = PAN.y - 2 - a * 22, s = a < .3 ? 1.5 : a < .7 ? 2 : 2.5;
      g.globalAlpha = .8 * (1 - a); R(g, Math.round(x * 2) / 2, Math.round(y * 2) / 2, s, s, '#FFFFFF');
    }
    g.globalAlpha = 1;
  }
  // сердечки над птичкой (большие — как сердечко из подарков, маленькие — как частицы комнаты)
  const HEART_B = ['.rr.rr.', 'rRrrrrr', 'rrrrrrr', '.rrrrr.', '..rrr..', '...r...'], HEART_S = ['r.r', 'rrr', '.r.'];
  const HEARTS = [13.1, 13.5, 13.9, 14.3, 14.7, 15.1, 15.25, 15.4, 15.55, 15.7].map((t0, i) => ({ t0, big: i % 3 !== 1, dx: (rnd(i + 50) - .5) * 16, c: i % 2 ? '#F28AB2' : '#E5484D' }));
  function drawHearts(g, t, b) {
    HEARTS.forEach(h => {
      const a = (t - h.t0) / 1.4; if (a < 0 || a > 1) return;
      const rows = h.big ? HEART_B : HEART_S, x = Math.round(b.x + h.dx + Math.sin(a * 6) * 2), y = Math.round(b.y - 26 - a * 20);
      g.globalAlpha = a > .6 ? (1 - a) / .4 : 1;
      rows.forEach((r, yy) => [...r].forEach((ch, xx) => { if (ch !== '.') R(g, x + xx - 3, y + yy, 1, 1, ch === 'R' ? '#FF9AA8' : h.c); }));
    });
    g.globalAlpha = 1;
  }

  function film(g, ms) {
    const t = ms / 1000, b = bird(t);
    drawStove(g, t);
    drawDoor(g, t);
    // тапочки: на ногах → летят → на полу парой
    [SL1, SL2].forEach((s, i) => {
      if (t < s.t0) return;
      const k = seg(t, s.t0, s.t1), fx = 46 + (i ? 3.5 : -3.5) - 2.5;
      drawSlipper(g, lerp(fx, s.x, k), lerp(GY, GY, k) - Math.sin(Math.PI * k) * 9, k < 1 ? -k : 0);
    });
    drawPancakes(g, t);
    drawSteam(g, t);
    if (t < 3.4) { g.save(); g.beginPath(); g.rect(DOOR.x + 3, 0, RW, RH); g.clip(); drawBird(g, b); g.restore(); } // выходит из-за косяка
    else drawBird(g, b);
    drawHearts(g, t, b);
  }

  // ---------- кадр видео ----------
  const box = document.getElementById('room');
  const api = RM.mount(box, { room, id: 27, nick: 'polly', film: (g, now) => film(g, now), scale: S });
  const cv = box.querySelector('canvas'), vc = document.getElementById('video'), v = vc.getContext('2d');
  v.imageSmoothingEnabled = false;
  function stars(t) {
    for (let i = 0; i < 40; i++) {
      const x = Math.floor(rnd(i) * VW / 12) * 12, top = i % 2 === 0, y = top ? Math.floor(rnd(i + 9) * (ROOM_Y - 24) / 12) * 12 : ROOM_Y + RH * S + 12 + Math.floor(rnd(i + 9) * (ROOM_Y - 24) / 12) * 12;
      const on = Math.sin(t * 2.2 + i * 1.7) > -.3; if (!on) continue;
      v.fillStyle = i % 5 ? '#534AB7' : '#F0A987'; v.fillRect(x, y, 12, 12);
      if (i % 4 === 0) { v.fillRect(x - 12, y, 36, 12); v.fillRect(x, y - 12, 12, 36); }
    }
  }
  const eggPic = window.PPHatch ? PPHatch.egg(Object.assign(document.createElement('canvas'), { width: PPHatch.W, height: PPHatch.H })) : null;
  function finale(t) {
    const k = seg(t, 16.3, 16.7);
    v.fillStyle = BG; v.fillRect(0, 0, VW, VH); stars(t);
    v.globalAlpha = k;
    v.fillStyle = 'rgba(240,169,135,.18)'; v.beginPath(); v.arc(VW / 2, 760, 300, 0, Math.PI * 2); v.fill();
    if (eggPic) {
      const sc = 16 * (k < 1 ? .6 + .4 * ease(k) : 1), wob = t > 17 && t < 18.2 ? Math.round(Math.sin(t * 28)) * sc / 2 : 0;
      v.drawImage(eggPic, VW / 2 - eggPic.width * sc / 2 + wob, 760 - eggPic.height * sc / 2 - 40, eggPic.width * sc, eggPic.height * sc);
    }
    v.globalAlpha = seg(t, 16.6, 17.0);
    v.textAlign = 'center'; v.textBaseline = 'middle';
    v.fillStyle = '#F3EFFA'; v.font = '600 104px Fraunces, Georgia, serif'; v.fillText('pigeonpolly.com', VW / 2, 1150);
    v.globalAlpha = seg(t, 16.9, 17.3);
    v.font = '700 60px Karla, system-ui, sans-serif';
    const tw = v.measureText(HATCH).width, pw = tw + 120, ph = 140, pulse = 1 + .03 * Math.sin(Math.max(0, t - 17.3) * 5);
    v.save(); v.translate(VW / 2, 1360); v.scale(pulse, pulse);
    v.fillStyle = '#F0A987'; v.beginPath(); v.roundRect(-pw / 2, -ph / 2, pw, ph, ph / 2); v.fill();
    v.fillStyle = BG; v.fillText(HATCH, 0, 4); v.restore();
    v.globalAlpha = 1;
  }
  function draw(n) {
    const t = n / FPS;
    if (t >= 16.3) return finale(t);
    api.frame(t * 1000);
    v.fillStyle = BG; v.fillRect(0, 0, VW, VH); stars(t);
    const sx = Math.round(camX(t) * S);
    v.drawImage(cv, sx, 0, VW, RH * S, 0, ROOM_Y, VW, RH * S);
    if (t > 15.6) { // круг сходится на птичке
      const b = bird(t), cx = (b.x - camX(t)) * S, cy = ROOM_Y + (b.y - 14) * S, r = lerp(1300, 0, ease(seg(t, 15.6, 16.3)));
      v.fillStyle = BG; v.beginPath(); v.rect(0, 0, VW, VH); v.arc(cx, cy, Math.max(0, r), 0, Math.PI * 2, true); v.fill('evenodd');
    }
  }
  window.FILM = {
    frames: END * FPS, finaleFrom: Math.floor(16.3 * FPS),
    frame: n => { draw(n); return vc.toDataURL('image/png'); },
    ready: Promise.all([document.fonts.load('600 104px Fraunces'), document.fonts.load('700 60px Karla')]).catch(() => null).then(() => true),
  };
})();
