// Рисованная Полли (как референс v1 из Drive «References»: тёмно-фиолетовая, малиновый берет, оранжевый глаз, вязаный шарф, толстый контур).
// pollySVG({hold, hat, look}) → <g> в системе 400×520 (ноги на y≈505). Вставлять внутрь <svg> через transform.
const OL = '#1d1830', BODY = '#3c3470', BODY2 = '#4a4188', WING = '#2e2858', BERET = '#b8325a', BERET2 = '#d04a72';
const SCARF = '#a8483c', SCARF2 = '#f3e6d0', SCARF3 = '#4f6f8f', BEAK = '#f2a93b', LEG = '#e48a62';
const st = (w = 7) => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

// предмет в крыле (рисуется у кончика переднего крыла ~ x 300, y 330)
const HOLD = {
  mug: `<g transform="translate(278 300)"><path d="M0 0h62v58q0 14-14 14h-34q-14 0-14-14z" fill="#fbf6ea" ${st(6)}/><path d="M62 12q22 0 22 18t-22 18" fill="none" ${st(6)}/>
    <g fill="#c8433d"><rect x="8" y="24" width="10" height="10"/><rect x="26" y="24" width="10" height="10"/><rect x="44" y="24" width="10" height="10"/></g>
    <path d="M20-12q-8-14 4-26M38-10q-8-14 4-26" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".85"/></g>`,
  brush: `<g transform="translate(300 250) rotate(28)"><rect x="-6" y="0" width="12" height="120" rx="5" fill="#c9873b" ${st(5)}/><rect x="-8" y="-14" width="16" height="18" fill="#c8ccd2" ${st(5)}/><path d="M-8-14q8-46 0-52q-8 6 0 52z" fill="#e2544a" ${st(5)} transform="translate(8 0)"/></g>`,
  book: `<g transform="translate(250 300) rotate(-8)"><path d="M0 0l70 8v86l-70-8z" fill="#f6c445" ${st(6)}/><path d="M70 8l70-8v86l-70 8z" fill="#fbf6ea" ${st(6)}/>
    <text x="16" y="56" font-family="Caveat" font-weight="700" font-size="34" fill="${OL}" transform="rotate(5 30 50)">Hei!</text><path d="M86 30h40M86 46h34M86 62h40" stroke="#9a8f80" stroke-width="4"/></g>`,
  phone: `<g transform="translate(300 230) rotate(-10)"><rect x="0" y="0" width="64" height="118" rx="12" fill="#2b2b33" ${st(6)}/><rect x="7" y="12" width="50" height="92" rx="4" fill="#9fd0b8"/><path d="M32 40c-10 0-16 8-16 16 0 12 16 26 16 26s16-14 16-26c0-8-6-16-16-16z" fill="#c8433d"/><circle cx="32" cy="56" r="6" fill="#fff"/></g>`,
  palette: `<g transform="translate(262 300)"><path d="M10 40C0 0 60-18 100 6s30 70-10 66c-20-2-14-22-34-20S20 80 10 40z" fill="#e8c9a0" ${st(6)}/>
    <circle cx="40" cy="20" r="9" fill="#e2544a"/><circle cx="66" cy="14" r="9" fill="#f6c445"/><circle cx="90" cy="26" r="9" fill="#5ba3d9"/><circle cx="96" cy="50" r="8" fill="#6a9a3a"/><ellipse cx="34" cy="46" rx="9" ry="7" fill="#fff" ${st(4)}/></g>`,
  pencil: `<g transform="translate(296 262) rotate(35)"><rect x="-7" y="0" width="14" height="110" fill="#f6c445" ${st(5)}/><path d="M-7 0l7-26 7 26z" fill="#f0d9b5" ${st(5)}/><path d="M-2-18l2-8 2 8z" fill="${OL}"/><rect x="-7" y="104" width="14" height="14" fill="#e48a9a" ${st(5)}/></g>`,
  none: '',
};
const HAT = {
  beret: `<path d="M118 92c-6-40 60-74 130-60 52 10 66 42 52 60-30 18-150 22-182 0z" fill="${BERET}" ${st()}/><path d="M150 52c30-16 80-18 110-4" fill="none" stroke="${BERET2}" stroke-width="10" stroke-linecap="round"/><path d="M200 26c-2-12 4-20 14-20" fill="none" ${st(9)}/>`,
  santa: `<path d="M116 98c0-60 70-92 140-74 30 8 62 40 90 92l-22 16c-14-30-30-48-46-56" fill="#c8323a" ${st()}/><circle cx="330" cy="122" r="20" fill="#fff" ${st(6)}/><path d="M104 98q100-26 190 0v26q-95-24-190 0z" fill="#fff" ${st()}/>`,
};
function pollySVG(o = {}) {
  const hold = HOLD[o.hold || 'none'], hat = HAT[o.hat || 'beret'];
  const wingUp = !!o.hold;
  return `<g>
  <!-- ноги -->
  <g fill="none" stroke="${OL}" stroke-width="20" stroke-linecap="round"><path d="M172 440v52M238 440v52"/></g>
  <g fill="none" stroke="${LEG}" stroke-width="10" stroke-linecap="round"><path d="M172 440v52M238 440v52"/></g>
  <g stroke-linecap="round" fill="none"><path d="M172 494l-26 10M172 494l4 14M172 494l26 8M238 494l-24 10M238 494l6 14M238 494l28 6" stroke="${OL}" stroke-width="18"/>
  <path d="M172 494l-26 10M172 494l4 14M172 494l26 8M238 494l-24 10M238 494l6 14M238 494l28 6" stroke="${LEG}" stroke-width="9"/></g>
  <!-- тело -->
  <path d="M130 120C104 170 86 250 92 330c6 80 52 124 120 124s116-40 118-112c2-70-34-110-56-150 10-40 6-80-26-104-42-30-104-12-118 32z" fill="${BODY}" ${st()}/>
  <path d="M120 300c10 70 40 110 92 118" fill="none" stroke="${BODY2}" stroke-width="18" stroke-linecap="round" opacity=".7"/>
  <!-- заднее крыло -->
  <path d="M112 250c-40 40-56 110-24 160 20 10 50-2 64-30 18-40 10-100-40-130z" fill="${WING}" ${st()}/>
  <path d="M96 350c10 20 26 30 40 26M90 320c12 18 26 24 40 22" fill="none" stroke="${BODY2}" stroke-width="6" stroke-linecap="round"/>
  <!-- шарф -->
  <path d="M120 200c40 26 120 26 164-4l10 44c-50 30-130 30-180 0z" fill="${SCARF}" ${st()}/>
  <path d="M130 222l14-10 14 10 14-10 14 10 14-10 14 10 14-10 14 10 14-10 14 10 14-10 14 10" fill="none" stroke="${SCARF2}" stroke-width="5"/>
  <path d="M134 236h150" stroke="${SCARF3}" stroke-width="5"/>
  <path d="M236 230l-16 110 44 6 10-108z" fill="${SCARF}" ${st()}/>
  <path d="M232 262l38 4M228 292l38 4" stroke="${SCARF2}" stroke-width="5"/><path d="M228 276l12 6 12-4 12 6" fill="none" stroke="${SCARF3}" stroke-width="4"/>
  <path d="M224 340l-2 18M236 342l-2 18M248 344l-2 18M260 346l-2 18" ${st(5)}/>
  <!-- голова: клюв, глаз -->
  <g transform="translate(0 26)">
  <path d="M292 132c30-8 62 0 80 16-24 14-56 18-84 12z" fill="${BEAK}" ${st()}/>
  <path d="M292 148c24 2 46 4 70 0" fill="none" stroke="#c97a1e" stroke-width="4"/>
  <ellipse cx="290" cy="122" rx="20" ry="14" fill="#efe3d0" ${st(5)}/>
  <ellipse cx="238" cy="126" rx="42" ry="44" fill="#fbf6ea" ${st()}/>
  <circle cx="244" cy="130" r="29" fill="#e8892b"/><circle cx="246" cy="132" r="17" fill="${OL}"/><circle cx="236" cy="120" r="7" fill="#fff"/><circle cx="256" cy="142" r="3" fill="#fff"/>
  ${o.look === 'happy' ? `<path d="M198 92q38-22 80 0" fill="none" ${st(7)}/>` : `<path d="M196 86q42-10 84 8" fill="none" ${st(7)}/>`}
  </g>
  ${hat}
  <!-- переднее крыло -->
  ${wingUp ? `<path d="M200 260c40-10 80-4 106 30 10 14 6 30-8 34-30 8-70-6-98-26-14-12-14-34 0-38z" fill="${WING}" ${st()}/>${hold}<path d="M290 296c10 0 22 8 22 20" fill="none" stroke="${BODY2}" stroke-width="5" stroke-linecap="round"/>`
    : `<path d="M196 262c30 30 40 90 20 130-16 10-40 0-48-20-10-40 2-90 28-110z" fill="${WING}" ${st()}/>`}
</g>`;
}
module.exports = { pollySVG };
