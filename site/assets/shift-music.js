// «Смена с Полли» (этап 29): три бесконечные ретро-мелодии и глупая пиксельная колыбельная — всё сочиняется кодом (WebAudio), чужих записей нет.
// Мелодия: аккорды по кругу, мотив на 2 такта из случайного блуждания по ладу; круг из 8 тактов A A' B A'', потом новые мотивы — повторов подряд нет.
// PPShiftMusic.play(i) — 0..2, stop(), lullaby(раз, готово), volume(0..1), TRACKS — названия.
(() => {
  let ctx = null, out = null, noiseBuf = null, timer = null, cur = -1, vol = 0.6;
  const AC = window.AudioContext || window.webkitAudioContext;
  const init = () => {
    if (ctx || !AC) return !!ctx;
    ctx = new AC(); out = ctx.createGain(); out.gain.value = vol * vol; out.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    document.addEventListener('pointerdown', () => ctx.state === 'suspended' && ctx.resume()); // после перезагрузки звук включится от первого нажатия
    return true;
  };
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  const rngOf = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

  // один звук: волна, нота, начало, длина, громкость; slide — съехать на N полутонов, vib — вибрато
  function tone(type, m, t, dur, v, o = {}) {
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(hz(m), t);
    if (o.slide) osc.frequency.exponentialRampToValueAtTime(hz(m + o.slide), t + dur);
    if (o.detune) osc.detune.value = o.detune;
    if (o.vib) { const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = o.vib; lg.gain.value = hz(m) * 0.012; l.connect(lg); lg.connect(osc.frequency); l.start(t); l.stop(t + dur + 0.05); }
    const a = o.attack || 0.005;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + a);
    g.gain.setValueAtTime(v, t + Math.max(a, dur * (o.hold || 0.6))); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = osc;
    if (o.lp) { const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lp; osc.connect(f); node = f; }
    node.connect(g); g.connect(out); osc.start(t); osc.stop(t + dur + 0.05);
  }
  function noise(t, dur, v, hp = 6000) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; f.type = hp > 0 ? 'highpass' : 'lowpass'; f.frequency.value = Math.abs(hp);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
  }
  function kick(t, v) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.2);
  }

  // лады и треки: root — MIDI тоники, scale — ступени, prog — аккорды (ступень), chord — интервалы от ступени
  const MAJ = [0, 2, 4, 5, 7, 9, 11], MIN = [0, 2, 3, 5, 7, 8, 10];
  const TRACKS = [
    { name: ['Morning Mail', 'Утренняя почта', 'Rīta pasts'], icon: '📮', bpm: 126, swing: 0, root: 60, scale: MAJ, prog: [0, 5, 3, 4], ext: [0, 2, 4],
      lead: 'square', leadV: 0.05, bass: 'triangle', bassV: 0.16, drums: 'pop', arp: false, rest: 0.18 },
    { name: ['Coffee Break', 'Кофе-брейк', 'Kafijas pauze'], icon: '☕', bpm: 96, swing: 0.64, root: 65, scale: MAJ, prog: [1, 4, 0, 5], ext: [0, 2, 4, 6],
      lead: 'triangle', leadV: 0.14, bass: 'triangle', bassV: 0.15, drums: 'brush', arp: false, comp: true, rest: 0.28, vib: 5 },
    { name: ['Rain on the Window', 'Дождь за окном', 'Lietus aiz loga'], icon: '🌧', bpm: 76, swing: 0, root: 57, scale: MIN, prog: [0, 5, 2, 6], ext: [0, 2, 4],
      lead: 'square', leadV: 0.03, bass: 'sine', bassV: 0.2, drums: 'soft', arp: true, rest: 0.45, rain: true },
  ];
  const deg = (tr, d, oct = 0) => { const n = tr.scale.length, k = ((d % n) + n) % n; return tr.root + tr.scale[k] + 12 * (Math.floor(d / n) + oct); };

  // мотив: 8 восьмых, блуждание по ладу вокруг аккорда; null — пауза, '-' — тянуть
  function motif(tr, rnd) {
    const m = []; let d = 4 + Math.floor(rnd() * 4);
    for (let i = 0; i < 16; i++) {
      if (i && rnd() < tr.rest) { m.push(rnd() < 0.5 ? null : '-'); continue; }
      d += [-2, -1, -1, 0, 1, 1, 2, 3, -3][Math.floor(rnd() * 9)]; d = Math.max(0, Math.min(11, d)); m.push(d);
    }
    return m;
  }
  const vary = (m, rnd, k) => m.map(x => typeof x === 'number' && rnd() < k ? Math.max(0, Math.min(11, x + (rnd() < 0.5 ? -1 : 1))) : x);

  const snap = (tr, ch, x) => {
    const n = tr.scale.length; let best = x, bd = 99;
    for (let o = -1; o <= 2; o++) tr.ext.forEach(e => { const c = ch + e + o * n, dd = Math.abs(c - x); if (dd < bd) { bd = dd; best = c; } });
    return best;
  };
  let next = 0, bar = 0, phrase = null, rnd = null;
  function newCycle(tr) {
    const a = motif(tr, rnd), b = motif(tr, rnd);
    phrase = [a, vary(a, rnd, 0.25), b, vary(a, rnd, 0.4)];
  }
  function scheduleBar(tr, t) {
    if (bar % 8 === 0) newCycle(tr);
    const beat = 60 / tr.bpm, ch = tr.prog[bar % tr.prog.length], mot = phrase[Math.floor(bar % 8 / 2)], half = bar % 2;
    const at = i => t + Math.floor(i / 2) * beat + (i % 2 ? beat * (tr.swing || 0.5) : 0);
    // мелодия
    for (let i = 0; i < 8; i++) {
      const x = mot[half * 8 + i]; if (typeof x !== 'number') continue;
      let len = 1; while (i + len < 8 && mot[half * 8 + i + len] === '-') len++;
      // на сильных долях — ближайший звук аккорда, чтобы мелодия не спорила с гармонией
      const y = i % 4 === 0 ? snap(tr, ch, x) : x, dur = len * beat / 2 * 0.95, m = deg(tr, y);
      tone(tr.lead, m, at(i), dur, tr.leadV, { vib: tr.vib, hold: 0.5 });
      if (tr.lead === 'square') tone('square', m + 12, at(i), dur * 0.6, tr.leadV * 0.25, { detune: 7 });
    }
    // бас
    const root = deg(tr, ch, -2);
    if (tr.drums === 'brush') { [0, 2, 4, 2].forEach((iv, i) => tone(tr.bass, deg(tr, ch + iv, -2), t + i * beat, beat * 0.9, tr.bassV)); }
    else if (tr.arp) tone(tr.bass, root, t, beat * 4, tr.bassV, { attack: 0.08, hold: 0.8 });
    else for (let i = 0; i < 8; i++) tone(tr.bass, root + (i % 4 === 3 ? 7 : 0) + (i % 2 ? 12 : 0), at(i), beat * 0.4, tr.bassV);
    // аккорды: «комп» на слабые доли или арпеджио шестнадцатыми
    if (tr.comp) [1, 3].forEach(b => tr.ext.forEach(e => tone('square', deg(tr, ch + e), t + b * beat + beat * (tr.swing - 0.5), beat * 0.35, 0.018, { lp: 1800 })));
    if (tr.arp) for (let i = 0; i < 16; i++) tone('triangle', deg(tr, ch + [0, 2, 4, 7][i % 4] + (i >= 8 ? (bar % 2 ? 2 : 0) : 0)), t + i * beat / 4, beat / 4 * 0.9, 0.05, { lp: 2400 });
    // ударные
    for (let b = 0; b < 4; b++) {
      const tb = t + b * beat;
      if (tr.drums === 'pop') { if (b % 2 === 0) kick(tb, 0.35); else noise(tb, 0.12, 0.12, 1800); noise(tb + beat / 2, 0.04, 0.05); }
      if (tr.drums === 'brush') { noise(tb, 0.18, 0.025, 3000); if (b % 2) noise(tb + beat * (tr.swing - 0.5) + beat / 2, 0.08, 0.02, 5000); if (b === 0) kick(tb, 0.2); }
      if (tr.drums === 'soft') { if (b === 0) kick(tb, 0.18); if (b === 2) noise(tb, 0.25, 0.04, 2500); }
    }
    if (tr.rain) noise(t, beat * 4 + 0.05, 0.012, -900);
    bar++;
    return t + 4 * beat;
  }
  function loop() {
    const tr = TRACKS[cur]; if (!tr) return;
    while (next < ctx.currentTime + 2.5) next = scheduleBar(tr, Math.max(next, ctx.currentTime + 0.05));
  }
  function play(i) {
    stop(); if (!init()) return;
    if (ctx.state === 'suspended') ctx.resume();
    cur = i; bar = 0; rnd = rngOf((Math.random() * 1e9) | 0); next = ctx.currentTime + 0.1;
    loop(); timer = setInterval(loop, 250);
  }
  function stop() {
    clearInterval(timer); timer = null; cur = -1;
    if (ctx && out) { const old = out; old.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.05); setTimeout(() => old.disconnect(), 400); out = ctx.createGain(); out.gain.value = vol * vol; out.connect(ctx.destination); }
  }

  // колыбельная 3/4: своя мелодия (ноты MIDI, доли); в конце фраз — «боинг» вниз, в самом конце — дзынь октавой выше
  const LULL = [[64, 2], [67, 1], [64, 2], [67, 1], [64, 1], [67, 1], [72, 1], [71, 2], [69, 1], [69, 2], [65, 1], [69, 2], [65, 1], [65, 1], [69, 1], [74, 1], [72, 3, -5],
    [67, 2], [64, 1], [72, 2], [67, 1], [65, 1], [69, 1], [67, 1], [64, 3], [62, 2], [65, 1], [71, 2], [67, 1], [74, 1], [72, 1], [71, 1], [72, 3, 12]];
  const LULL_BASS = [48, 48, 48, 43, 41, 41, 43, 48, 48, 45, 41, 48, 43, 43, 43, 48];
  function lullaby(times = 2, done) {
    stop(); if (!init()) { done && done(); return; }
    if (ctx.state === 'suspended') ctx.resume();
    const beat = 60 / 84; let t = ctx.currentTime + 0.2;
    for (let k = 0; k < times; k++) {
      let b = 0;
      LULL.forEach(([m, d, fx]) => {
        const dur = d * beat;
        tone('square', m, t + b * beat, dur * 0.92, 0.06, { vib: 6, hold: 0.7, slide: fx === -5 ? -5 : 0 });
        tone('square', m, t + b * beat, dur * 0.92, 0.025, { detune: 14 });          // «казу»: второй голос чуть мимо
        if (fx === 12) tone('triangle', m + 24, t + (b + 2) * beat, beat, 0.08);     // дзынь
        b += d;
      });
      LULL_BASS.forEach((m, i) => { const tb = t + i * 3 * beat; tone('triangle', m, tb, beat * 0.8, 0.14); tone('triangle', m + 7 + 12, tb + beat, beat * 0.5, 0.05); tone('triangle', m + 12 + 4, tb + 2 * beat, beat * 0.5, 0.05); });
      t += 48 * beat;
    }
    const ms = (t - ctx.currentTime) * 1000;
    if (done) setTimeout(done, ms);
    return ms;
  }
  function volume(v) { vol = Math.max(0, Math.min(1, v)); if (out) out.gain.setTargetAtTime(vol * vol, ctx.currentTime, 0.05); }
  window.PPShiftMusic = { TRACKS, play, stop, lullaby, volume, get playing() { return cur; }, get ok() { return !!AC; } };
})();
