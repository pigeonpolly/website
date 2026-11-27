// Полли для постов «Balodis Pollijs ceļā uz Norvēģiju» (скилл norsk-lv-posts).
// Один и тот же персонаж каждый раз: только параметры позы/лица/реквизита, вид не меняется.
// polly({wing, face, look, prop, flip}) → SVG-группа 400×520 (ноги внизу, клюв влево).
// scene(name) → фон 1920×1080. compose(spec) → полный SVG.

const C = {
  ink: '#1b1630', body: '#3a3163', belly: '#4d4380', shade: '#2b2450', wing: '#2e2756',
  beret: '#a52e4f', beretD: '#7c1f3a', beak: '#f2a93b', beakD: '#d9822a', cere: '#f7f1e6',
  iris: '#e9862a', irisD: '#b4541c', leg: '#e8956b',
  scarf: '#7a3b34', scarfR: '#c8463e', scarfW: '#f3e9d8', scarfB: '#2f3f6b',
};
const S = `stroke="${C.ink}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"`;

// ---------- реквизит (в координатах Полли, центр предмета 0,0) ----------
const PROPS = {
  phone: () => `<g transform="rotate(-12)"><rect x="-26" y="-48" width="52" height="96" rx="9" fill="#3d3d4a" ${S}/>
    <rect x="-19" y="-38" width="38" height="72" rx="4" fill="#cfe6c9"/><path d="M-19 -5 L19 10 M-5 -38 L4 34" stroke="#f4f0e2" stroke-width="5"/>
    <path d="M0 -26 a10 10 0 0 1 10 10 c0 8 -10 18 -10 18 s-10 -10 -10 -18 a10 10 0 0 1 10 -10z" fill="#c8303a"/><circle cx="0" cy="-16" r="3.5" fill="#fff"/></g>`,
  mug: () => `<g><path d="M-30 -32 h60 v52 a14 14 0 0 1 -14 14 h-32 a14 14 0 0 1 -14 -14z" fill="#f7f1e6" ${S}/>
    <path d="M30 -18 a16 16 0 0 1 0 30" fill="none" ${S}/>
    <path d="M-22 -12 l6 6 m0 -6 l-6 6 M-4 -12 l6 6 m0 -6 l-6 6 M14 -12 l6 6 m0 -6 l-6 6 M-13 4 l6 6 m0 -6 l-6 6 M5 4 l6 6 m0 -6 l-6 6" stroke="#c8303a" stroke-width="3.5"/>
    <ellipse cx="0" cy="-32" rx="30" ry="6" fill="#5b3a26" ${S}/>
    <path d="M-8 -48 q-10 -14 0 -26 q10 -12 0 -24 M10 -46 q-8 -12 0 -22" fill="none" stroke="#fff" stroke-width="4" opacity=".85"/></g>`,
  book: () => `<g transform="rotate(-8)"><path d="M-48 -34 h96 v68 h-96z" fill="#2f5d8a" ${S}/><path d="M-40 -26 h80 v52 h-80z" fill="#f4ecd8"/>
    <path d="M0 -26 v52" stroke="${C.ink}" stroke-width="4"/><path d="M-32 -12 h24 M-32 0 h20 M-32 12 h24 M8 -12 h24 M8 0 h20 M8 12 h16" stroke="#9a8f80" stroke-width="3"/></g>`,
  bun: () => `<g><ellipse cx="0" cy="0" rx="40" ry="28" fill="#d08a3c" ${S}/>
    <path d="M0 0 m-4 0 a6 6 0 1 1 10 4 a14 14 0 1 1 -22 -10 a22 22 0 1 1 34 16" fill="none" stroke="#8a4f1c" stroke-width="5"/>
    <path d="M-22 -14 l3 2 M14 -18 l3 1 M24 6 l2 3 M-10 16 l3 1" stroke="#fff" stroke-width="4"/></g>`,
  candle: () => `<g><rect x="-14" y="-40" width="28" height="70" rx="4" fill="#f4ecd8" ${S}/>
    <path d="M0 -42 v-10" stroke="${C.ink}" stroke-width="4"/><path d="M0 -84 q14 18 0 30 q-14 -12 0 -30z" fill="#ffc94a" stroke="#e98a2b" stroke-width="3"/>
    <circle cx="0" cy="-66" r="34" fill="#ffd36b" opacity=".25"/></g>`,
  basket: () => `<g><path d="M-52 -10 h104 l-12 52 h-80z" fill="#a8743f" ${S}/>
    <path d="M-46 4 h92 M-42 20 h84 M-26 -10 l6 52 M0 -10 v52 M26 -10 l-6 52" stroke="#7b5128" stroke-width="3.5"/>
    <path d="M-44 -10 q44 -70 88 0" fill="none" ${S}/>
    ${[[-30, -16, '#c8303a'], [-12, -20, '#3a4f9a'], [8, -17, '#c8303a'], [26, -19, '#3a4f9a'], [-2, -26, '#c8303a']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="8" fill="${c}" stroke="${C.ink}" stroke-width="3"/>`).join('')}</g>`,
  ski: () => `<g transform="rotate(-70)"><rect x="-6" y="-110" width="12" height="220" rx="6" fill="#c8303a" ${S}/><rect x="10" y="-110" width="12" height="220" rx="6" fill="#c8303a" ${S}/></g>`,
  letter: () => `<g transform="rotate(-6)"><rect x="-46" y="-30" width="92" height="60" fill="#f7f1e6" ${S}/><path d="M-46 -30 l46 34 l46 -34" fill="none" ${S}/><circle cx="0" cy="8" r="9" fill="#c8303a"/></g>`,
};

// ---------- Полли ----------
function polly(o = {}) {
  const wing = o.wing || 'down';       // down | hold | scratch | wave
  const face = o.face || 'calm';       // calm | happy | worried | surprised
  const [lx, ly] = o.look || [-4, 0];  // куда смотрят зрачки
  const prop = o.prop && PROPS[o.prop] ? PROPS[o.prop]() : '';

  const legs = [175, 238].map(x => `<path d="M${x} 455 v42 M${x} 497 l-20 10 M${x} 497 l2 14 M${x} 497 l20 8" fill="none" stroke="${C.ink}" stroke-width="16" stroke-linecap="round"/>
    <path d="M${x} 455 v42 M${x} 497 l-20 10 M${x} 497 l2 14 M${x} 497 l20 8" fill="none" stroke="${C.leg}" stroke-width="8" stroke-linecap="round"/>`).join('');

  // голова + тело: контур толще, потом заливка поверх — шов внутри пропадает
  const shapes = `<circle cx="200" cy="168" r="102"/><path d="M90 238 C40 340 80 476 205 478 C330 480 372 350 326 250 C300 200 120 190 90 238z"/>`;
  const silhouette = `<g fill="${C.ink}" stroke="${C.ink}" stroke-width="12" stroke-linejoin="round">${shapes}</g><g fill="${C.body}">${shapes}</g>
    <ellipse cx="180" cy="365" rx="98" ry="100" fill="${C.belly}" opacity=".55"/>
    <path d="M306 245 C350 330 330 430 262 468 C340 450 370 350 326 250z" fill="${C.shade}" opacity=".8"/>
    <ellipse cx="245" cy="105" rx="34" ry="16" fill="#fff" opacity=".08"/>`;

  const feathers = (x, y, r) => `<path d="M${x} ${y} q${-12 * r} 18 ${-6 * r} 34 M${x + 16 * r} ${y - 4} q${-8 * r} 20 ${-2 * r} 36" fill="none" stroke="${C.ink}" stroke-width="4"/>`;
  const W = {
    down: `<path d="M298 258 C350 300 362 390 318 452 C304 468 278 464 274 446 C262 386 266 312 298 258z" fill="${C.wing}" ${S}/>${feathers(310, 405, 1)}`,
    scratch: `<path d="M300 262 C352 236 350 150 306 96 C292 82 268 92 274 112 C290 168 276 222 262 268z" fill="${C.wing}" ${S}/>
      <path d="M282 140 q14 -8 22 4 M284 160 q14 -6 20 6" fill="none" stroke="${C.ink}" stroke-width="4"/>`,
    wave: `<path d="M292 262 C340 250 380 190 372 140 C370 126 352 124 348 138 C338 190 300 222 266 250z" fill="${C.wing}" ${S}/>
      <path d="M352 150 q10 6 8 18 M342 176 q12 4 10 16" fill="none" stroke="${C.ink}" stroke-width="4"/>`,
    hold: `<path d="M288 262 C330 300 340 380 300 440 C290 452 272 450 268 436 C258 380 262 310 288 262z" fill="${C.wing}" ${S}/>${feathers(296, 395, 1)}`,
  };
  // передняя «рука» с предметом (левое крыло, тянется вперёд к клюву)
  const front = wing === 'hold' ? `<g transform="translate(70 318)">${prop}</g>
    <path d="M128 285 C100 300 86 320 92 340 C98 352 116 350 122 338 C130 322 140 312 150 300z" fill="${C.wing}" ${S}/>` : '';
  const loose = wing !== 'hold' && prop ? `<g transform="translate(${o.propAt ? o.propAt.join(' ') : '60 470'})">${prop}</g>` : '';

  // шарф
  const band = 'M96 232 C150 262 250 268 312 236 L318 278 C250 306 150 302 100 276z';
  const scarf = `<defs><clipPath id="sc"><path d="${band}"/><path d="M236 270 l42 -6 l14 118 l-44 6z"/></clipPath></defs>
    <path d="${band}" fill="${C.scarf}" ${S}/><path d="M236 270 l42 -6 l14 118 l-44 6z" fill="${C.scarf}" ${S}/>
    <g clip-path="url(#sc)" fill="none" stroke-width="5">
      ${[248, 262, 276].map((y, i) => `<path d="M90 ${y} ${Array.from({ length: 24 }, (_, k) => `l10 ${k % 2 ? 10 : -10}`).join(' ')}" stroke="${[C.scarfW, C.scarfR, C.scarfB][i]}" transform="rotate(4 200 ${y})"/>`).join('')}
      ${[300, 322, 344].map((y, i) => `<path d="M236 ${y} l10 -9 l10 9 l10 -9 l10 9 l10 -9" stroke="${[C.scarfW, C.scarfR, C.scarfW][i]}"/>`).join('')}
    </g>
    <path d="${band}" fill="none" ${S}/><path d="M236 270 l42 -6 l14 118 l-44 6z" fill="none" ${S}/>
    ${[0, 1, 2, 3, 4].map(i => `<path d="M${252 + i * 9} ${386 - i * 1} v16" stroke="${C.scarf}" stroke-width="5" stroke-linecap="round"/>`).join('')}`;

  // клюв и восковица
  const beak = `<path d="M118 150 Q70 150 40 178 Q82 186 126 180z" fill="${C.beak}" ${S}/>
    <path d="M124 180 Q86 186 58 182 Q90 200 126 194z" fill="${C.beakD}" ${S}/>
    <ellipse cx="124" cy="146" rx="20" ry="13" fill="${C.cere}" ${S}/>`;

  // глаза: ближний большой, дальний меньше
  const eye = (cx, cy, r) => {
    const ir = r * 0.66, pr = r * 0.36;
    const lid = face === 'happy' ? `<path d="M${cx - r - 4} ${cy + r * 0.45} Q${cx} ${cy + r * 0.05} ${cx + r + 4} ${cy + r * 0.45} L${cx + r + 4} ${cy + r + 6} L${cx - r - 4} ${cy + r + 6}z" fill="${C.body}"/><path d="M${cx - r + 2} ${cy + r * 0.5} Q${cx} ${cy + r * 0.08} ${cx + r - 2} ${cy + r * 0.5}" fill="none" ${S}/>` : '';
    const half = face === 'worried' ? `<path d="M${cx - r} ${cy - r * 0.35} Q${cx} ${cy - r * 0.6} ${cx + r} ${cy - r * 0.2} L${cx + r} ${cy - r - 4} L${cx - r} ${cy - r - 4}z" fill="${C.body}"/><path d="M${cx - r} ${cy - r * 0.35} Q${cx} ${cy - r * 0.6} ${cx + r} ${cy - r * 0.2}" fill="none" ${S}/>` : '';
    const big = face === 'surprised' ? 1.08 : 1;
    return `<circle cx="${cx}" cy="${cy}" r="${r * big}" fill="#fff" ${S}/>
      <circle cx="${cx + lx}" cy="${cy + ly}" r="${ir}" fill="${C.iris}" stroke="${C.irisD}" stroke-width="3"/>
      <circle cx="${cx + lx * 1.3}" cy="${cy + ly * 1.3}" r="${face === 'surprised' ? pr * 0.7 : pr}" fill="${C.ink}"/>
      <circle cx="${cx + lx + ir * 0.35}" cy="${cy + ly - ir * 0.4}" r="${r * 0.14}" fill="#fff"/>${lid}${half}`;
  };
  const brows = face === 'worried' ? `<path d="M128 104 q14 -10 30 -4 M196 96 q24 -14 48 -2" fill="none" ${S}/>`
    : face === 'surprised' ? `<path d="M126 96 q16 -12 32 -4 M196 84 q26 -14 50 0" fill="none" ${S}/>` : '';
  const eyes = `${eye(150, 138, 27)}${eye(222, 140, 43)}${brows}`;

  const beret = `<g transform="rotate(-7 210 70) translate(-10 -6) scale(1.1)" style="transform-box:view-box"><ellipse cx="208" cy="90" rx="92" ry="17" fill="${C.beretD}" ${S}/>
    <path d="M110 86 C104 40 170 22 230 26 C300 30 318 70 300 92 C260 106 150 104 110 86z" fill="${C.beret}" ${S}/>
    <path d="M150 52 q40 -18 100 -10" fill="none" stroke="#fff" stroke-width="5" opacity=".18"/>
    <path d="M238 28 q4 -16 16 -14" fill="none" ${S}/></g>`;

  const body = `${legs}${W[wing] && (wing === 'scratch' || wing === 'wave') ? '' : W[wing]}${silhouette}${scarf}${beak}${eyes}${beret}${(wing === 'scratch' || wing === 'wave') ? W[wing] : ''}${front}${loose}`;
  return o.flip ? `<g transform="translate(400 0) scale(-1 1)">${body}</g>` : `<g>${body}</g>`;
}

// ---------- фоны 1920×1080 ----------
const pine = (x, base, h, c = '#3f6b4c', snow) => {
  const w = h * 0.42, t = [];
  for (let i = 0; i < 4; i++) {
    const y0 = base - h * (0.22 * i), ww = w * (1 - i * 0.2), hh = h * 0.42;
    t.push(`<path d="M${x - ww} ${y0} Q${x - ww * 0.4} ${y0 - hh * 0.4} ${x} ${y0 - hh} Q${x + ww * 0.4} ${y0 - hh * 0.4} ${x + ww} ${y0}z" fill="${c}"/>`);
    if (snow) t.push(`<path d="M${x - ww * 0.8} ${y0 - 4} q${ww * 0.4} -10 ${ww * 0.8} -4 q${ww * 0.4} -8 ${ww * 0.8} 2" fill="none" stroke="#f4f7fb" stroke-width="${Math.max(4, h / 40)}" stroke-linecap="round"/>`);
  }
  return `<rect x="${x - h * 0.03}" y="${base - 4}" width="${h * 0.06}" height="${h * 0.12}" fill="#6b4a2f"/>${t.join('')}`;
};
const bush = (x, y, s = 1, berries = true) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-110 20 q-10 -60 50 -60 q20 -40 70 -20 q50 -20 80 30 q30 10 20 50z" fill="#4f7d45"/>
  <path d="M-80 0 q20 -10 30 0 M10 -30 q16 -6 24 4 M60 -6 q14 -6 22 4" fill="none" stroke="#3a5f36" stroke-width="5"/>
  ${berries ? [[-70, -6, 1], [-40, -24, 0], [-10, 2, 1], [20, -30, 1], [50, -10, 0], [80, 4, 1], [0, -44, 0], [-60, 14, 0], [64, -36, 1]].map(([bx, by, r]) => `<circle cx="${bx}" cy="${by}" r="10" fill="${r ? '#c8303a' : '#3a4f9a'}" stroke="#1b1630" stroke-width="3"/>`).join('') : ''}</g>`;
const mountains = (snowy) => `<path d="M0 640 L180 430 L300 520 L470 360 L640 540 L800 420 L980 560 L1150 380 L1330 540 L1500 430 L1700 560 L1920 450 V720 H0z" fill="#9fb3c2"/>
  <path d="M470 360 L420 418 L455 410 L480 430 L505 405 L530 420z M1150 380 L1100 440 L1135 430 L1160 450 L1185 425 L1215 440z M180 430 L140 478 L178 470 L205 486z M1500 430 L1460 480 L1500 472 L1530 486z" fill="${snowy ? '#fff' : '#f4f7fb'}"/>`;

const SCENES = {
  forest: () => `<rect width="1920" height="1080" fill="#f4eedc"/>
    <path d="M300 170 q40 -40 90 -10 q40 -20 70 20z M1400 130 q40 -40 90 -10 q40 -20 70 20z" fill="#fff" opacity=".8"/>
    ${mountains()}<rect y="700" width="1920" height="70" fill="#5fa3a3"/><path d="M200 735 h220 M900 725 h300 M1500 745 h180" stroke="#8cc4c0" stroke-width="5"/>
    ${[80, 260, 420, 1450, 1600, 1760].map((x, i) => pine(x, 760, 260 + (i % 3) * 40, '#4f7a5a')).join('')}
    <path d="M0 760 Q960 720 1920 760 V1080 H0z" fill="#7fa35a"/><path d="M0 880 Q960 840 1920 900 V1080 H0z" fill="#6b8f4c"/>
    ${pine(-10, 1000, 900, '#355f43')}<rect x="1700" y="0" width="70" height="1000" fill="#f1eee6" stroke="#1b1630" stroke-width="6"/>
    <path d="M1700 140 h30 M1740 300 h30 M1700 470 h24 M1745 620 h25 M1700 790 h30" stroke="#1b1630" stroke-width="12"/>
    ${pine(1880, 1000, 860, '#355f43')}
    ${bush(160, 1000, 1.3)}${bush(1560, 1010, 1.2)}${bush(520, 1040, 0.8)}
    ${[[380, 960], [980, 1010], [1240, 980], [700, 990]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="70" ry="26" fill="#9a9a8e" stroke="#1b1630" stroke-width="5"/>`).join('')}`,
  winter: () => `<defs><linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14203f"/><stop offset="1" stop-color="#2d4a73"/></linearGradient></defs>
    <rect width="1920" height="1080" fill="url(#nsky)"/>
    <path d="M-50 300 Q400 120 900 260 T1980 180" fill="none" stroke="#6ee7a8" stroke-width="70" opacity=".35"/><path d="M-50 360 Q500 200 1000 320 T1980 260" fill="none" stroke="#8ff0c8" stroke-width="30" opacity=".35"/>
    ${Array.from({ length: 60 }, (_, i) => `<circle cx="${(i * 337) % 1920}" cy="${(i * 191) % 520}" r="${i % 3 ? 2 : 3.5}" fill="#fff" opacity=".8"/>`).join('')}
    ${mountains(true).replace('#9fb3c2', '#5c7294')}
    <path d="M0 740 Q960 690 1920 740 V1080 H0z" fill="#e8eef6"/><path d="M0 900 Q960 860 1920 920 V1080 H0z" fill="#d6e1ee"/>
    ${[100, 300, 1500, 1700].map((x, i) => pine(x, 780, 300 + (i % 2) * 60, '#2f5a48', true)).join('')}
    <g transform="translate(1180 600)"><path d="M0 120 v-110 l110 -70 l110 70 v110z" fill="#b5332f" stroke="#1b1630" stroke-width="6"/>
    <path d="M-20 14 l130 -86 l130 86" fill="none" stroke="#f4f7fb" stroke-width="18" stroke-linecap="round"/>
    <rect x="40" y="40" width="44" height="40" fill="#ffd36b" stroke="#1b1630" stroke-width="5"/><rect x="136" y="40" width="44" height="40" fill="#ffd36b" stroke="#1b1630" stroke-width="5"/></g>
    ${pine(1840, 1020, 820, '#24493a', true)}${pine(40, 1020, 760, '#24493a', true)}`,
  cozy: () => `<rect width="1920" height="1080" fill="#efdcc0"/>
    <path d="M0 0 h1920 v60 h-1920z" fill="#e3c9a5"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 170 + 40} 60 v680" stroke="#e6cfae" stroke-width="10"/>`).join('')}
    <g transform="translate(1240 150)"><rect width="460" height="400" fill="#1e2d52" stroke="#5b3a26" stroke-width="22"/>
      <path d="M230 0 v400 M0 200 h460" stroke="#5b3a26" stroke-width="14"/>
      ${Array.from({ length: 22 }, (_, i) => `<circle cx="${(i * 97) % 440 + 10}" cy="${(i * 61) % 380 + 10}" r="5" fill="#fff"/>`).join('')}
      <path d="M0 330 q120 -40 230 -10 q120 -30 230 0 v80 h-460z" fill="#e8eef6"/></g>
    <path d="M1220 560 h500 v24 h-500z" fill="#8a5a36" stroke="#1b1630" stroke-width="5"/>
    <g transform="translate(1340 520)">${PROPS.candle()}</g><g transform="translate(1600 520)">${PROPS.candle()}</g>
    <path d="M0 760 h1920 v320 h-1920z" fill="#b98a5a"/>${Array.from({ length: 9 }, (_, i) => `<path d="M0 ${800 + i * 34} h1920" stroke="#a47549" stroke-width="4"/>`).join('')}
    <ellipse cx="960" cy="985" rx="620" ry="70" fill="#a8324f" opacity=".85"/><ellipse cx="960" cy="985" rx="540" ry="50" fill="none" stroke="#f3e9d8" stroke-width="8" stroke-dasharray="26 18"/>
    <g transform="translate(150 230)"><rect width="380" height="26" fill="#8a5a36" stroke="#1b1630" stroke-width="5"/>
      ${[['#2f5d8a', 0], ['#c8463e', 46], ['#e0a83b', 86], ['#3f6b4c', 124]].map(([c, x]) => `<rect x="${x + 20}" y="-110" width="34" height="110" fill="${c}" stroke="#1b1630" stroke-width="5"/>`).join('')}
      <g transform="translate(300 -40) scale(.8)">${PROPS.mug()}</g></g>`,
};

function compose(sp) {
  const s = sp.scale || 1.35, [px, py] = sp.at || [760, 1010];
  const extras = (sp.items || []).map(it => `<g transform="translate(${it.at.join(' ')}) scale(${it.scale || 1})">${PROPS[it.prop]()}</g>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">${SCENES[sp.scene || 'forest']()}${extras}
    <ellipse cx="${px}" cy="${py - 8}" rx="${150 * s}" ry="${22 * s}" fill="#000" opacity=".12"/>
    <g transform="translate(${px - 200 * s} ${py - 515 * s}) scale(${s})">${polly(sp)}</g></svg>`;
}

if (typeof module !== 'undefined') module.exports = { polly, compose, SCENES, PROPS };
