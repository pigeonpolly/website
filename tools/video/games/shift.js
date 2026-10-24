// Ролик «Смена с Полли» (tools/video/games.js shift): таймер на 20 минут, ретро-музыка, смена «перемоткой» — между кадрами
// часы прыгают вперёд, видно 3 разных дела Полли; в конце — сорванный галстук, колыбельная на рок-гитаре и повышение.
const st = '() => { let s = {}; try { s = JSON.parse(localStorage.getItem("pp-shift")) || {}; } catch (e) {} return { phase: s.phase, left: s.end ? s.end - Date.now() : 0, cap: document.querySelector(".sh-cap").textContent, done: !document.querySelector(".sh-done").hidden }; }';
const SAY = { // подпись ролика по делу Полли (текст игры — под сценой)
  coffee: 'Coffee break ☕', lunch: 'Lunch from the lunch box', water: 'A sip at the water cooler', stretch: 'A little stretch',
  copy: 'Copying papers', folder: 'Digging through folders', plant: 'Watering the plant 🪴', diploma: 'Straightening the diplomas', toss: 'Three points!',
};
const ACT = { coffee: 'coffee', lunch: 'lunch', water: 'cooler', stretch: 'stretching', copy: 'copying', folder: 'folders', plant: 'plant', diploma: 'diplomas', toss: 'bin' };
const actOf = cap => Object.keys(ACT).find(k => cap.includes(ACT[k]));

module.exports = {
  title: 'Shift with Polly', url: '/shift/', cover: '/images/games/shift.png', seed: 5,
  join: ['Focus with Polly —', 'every hour is a promotion 🔘'],
  music: { i: 1 }, // «Coffee Break»; с конца смены — колыбельная (audio ставит step)
  show: ['#shift'],
  keys: [1.8, 4.5, 7.5, 10.5, 15, 18.5],
  api(m, p) {
    if (m === 'GET' && p.startsWith('/api/shift')) return { on: true, btn: 1, total: 50, rank: 0, me: true };
    if (p === '/api/shift/start') return { run: 'video' };
    if (p === '/api/shift/done') return { on: true, btn: 1, total: 70, rank: 1, promoted: 1, got: 1, buttons: 25 };
    return null;
  },
  async setup(v) {
    await v.page.addStyleTag({ content: `
      #shift { position: fixed !important; left: 10px; right: 10px; top: 92px; margin: 0 !important; z-index: 10; }
      #shift .sh-top { flex-direction: column; gap: 12px; margin-bottom: 12px; }
      #shift .sh-clock { padding: 4px 12px; } #shift .sh-left { font-size: 46px; }
      #shift .sh-own, #shift .sh-vol, #shift .sh-row > span[aria-hidden], #shift [data-min="90"], #shift [data-track="-1"], #shift .sh-stop { display: none !important; }
      #shift .sh-lbl { display: none; } #shift .sh-row { justify-content: center; } #shift .sh-ctl { gap: 8px; }
      #shift .sh-ctl { transition: none; } #shift.vid-run .sh-ctl, #shift.vid-run .sh-rank, .pp-toast { display: none !important; }
      #shift.vid-run { top: 128px; } #shift.vid-run .sh-scene { margin: 0 -10px; border-radius: 0; border-width: 3px 0; } #shift.vid-run .sh-left { font-size: 60px; }
      #shift .sh-cap { font-size: 16px; color: #C9B8E8; }
      #shift .sh-done { margin-top: 8px; font-size: 17px; }` });
    await v.page.clock.runFor(400);
  },
  async step(v, t) {
    const s = await v.page.evaluate(`(${st})()`);
    if (t < .7) v.cap('A focus timer with a pixel coworker');
    else if (t < 1.6) { v.cap('Set the timer…'); await v.once('min', () => v.tap('[data-min="20"]')); }
    else if (t < 2.5) { v.cap('…pick a retro tune…'); await v.once('track', () => v.tap('[data-track="1"]')); }
    else if (t < 3.3) { v.cap('…and start the shift!'); await v.once('go', () => v.tap('.sh-go')); }
    else if (s.phase === 'run') {
      await v.once('hide', () => v.page.evaluate(() => document.getElementById('shift').classList.add('vid-run')));
      if (t < 5.6) { v.cap('Polly works right next to you'); return; }
      // перемотка: до следующего нового дела (не печать), пока до конца смены больше 3 минут; три дела — потом к концу
      const shown = v.mem.shown || (v.mem.shown = []);
      if (v.mem.until == null || t >= v.mem.until) {
        let left = s.left, cap = s.cap, a = actOf(cap);
        if (shown.length < 3) {
          while (left > 180000 && (!a || shown.includes(a))) {
            await v.page.clock.runFor(4000);
            ({ left, cap } = await v.page.evaluate(`(${st})()`)); a = actOf(cap);
          }
        }
        if (shown.length < 3 && a && !shown.includes(a)) { shown.push(a); v.cap(SAY[a]); v.mem.until = t + 2.6; await v.page.clock.runFor(600); }
        else { // к концу смены: последние 3 секунды — на экране
          while (left > 3500) { await v.page.clock.runFor(Math.min(20000, left - 3000)); ({ left } = await v.page.evaluate(`(${st})()`)); }
          v.cap('Almost there…'); v.mem.until = 1e9;
        }
      }
    } else if (s.phase === 'end') {
      if (v.mem.endAt == null) { v.mem.endAt = t; v.F.audio = [{ ...v.F.music, from: 0 }, { lullaby: true, from: t + 2.4 }]; }
      const k = t - v.mem.endAt;
      v.cap(k < 2.4 ? 'Shift over! Off with the tie…' : k < 5 ? '…and a lullaby on the rock guitar 🎸' : 'Promotion! +1 🔘');
      if (k > 7.6 && v.fin == null) v.fin = t;
    }
  },
};
