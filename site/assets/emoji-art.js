// Нарисованные эмодзи в стиле сайта (docs/site.md «Нарисованные эмодзи»). Подключён в src/layout-v2*.html — на всех страницах
// эмодзи из ART сами заменяются рисунком: <span class="pp-e"><span class="pp-ec">эмодзи</span><svg></span> (сам символ остаётся
// невидимым — textContent, копирование и поиск по странице не меняются). Не трогает поля ввода, contenteditable, code/pre, canvas,
// .pp-noemo; новые узлы — через MutationObserver. PPEmojiArt.off() — вернуть обычные эмодзи (режим «Править страницу»).
// PPEmojiArt.svg(ch) → строка <svg> или null. Рисунок 32×32: заливка (слой .w, акварель) + линия (.k, цвет текста); новый значок = строка в ART.
(() => {
  // Тушь + акварель (дизайн v2): линия — цвет текста (на тёмном светлеет), заливка — акварель чуть мимо контура.
  const O = '#2A211C', P = '#5B7A9C', PD = '#3D5675', PE = '#EDB797', OR = '#C8643C', ST = '#DDA640', LI = '#FBF7F0', MU = '#D9CFC2',
    GR = '#7FA06E', GL = '#ABC694', BR = '#8A6243', PA = '#F1E4C8', PA2 = '#DFC796', SK = '#BCD3E6', BI = '#7470A3', BD = '#55518A';
  const sp = (cx, cy, r) => `M${cx} ${cy - r}Q${cx} ${cy} ${cx + r} ${cy}Q${cx} ${cy} ${cx} ${cy + r}Q${cx} ${cy} ${cx - r} ${cy}Q${cx} ${cy} ${cx} ${cy - r}Z`;
  const hl = (d) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.6"/>`;
  const ART = {
    '🔘': `<circle cx="16" cy="16" r="12.5" fill="${PE}"/><circle cx="16" cy="16" r="8.5" fill="none" stroke="${OR}" stroke-width="1.5"/>
      <g fill="${O}" stroke="none"><circle cx="13" cy="13" r="1.7"/><circle cx="19" cy="13" r="1.7"/><circle cx="13" cy="19" r="1.7"/><circle cx="19" cy="19" r="1.7"/></g>${hl('M8 11Q9.5 7.5 13 6.5')}`,
    '✨': `<path d="${sp(13, 18, 10)}" fill="${ST}"/><path d="${sp(25, 7, 4.5)}" fill="${PE}"/><circle cx="6" cy="6" r="1.6" fill="${LI}"/><circle cx="26" cy="25" r="1.4" fill="${LI}"/>`,
    '🔍': `<path d="M19.5 19.5L27 27" stroke-width="6"/><path d="M19.5 19.5L27 27" stroke="${OR}" stroke-width="2.8"/><circle cx="13" cy="13" r="9" fill="${SK}"/>${hl('M8 12Q8.5 8.5 12 8')}`,
    '🎨': `<path d="M16 4C8 4 3 10 3 16.5C3 23 9 28 15 28C18 28 18.5 25.5 17.3 23.5C16.2 21.5 17.3 19.3 20 19.3H23.5C27 19.3 29 17 29 14C29 8 23 4 16 4Z" fill="${LI}"/>
      <circle cx="9.5" cy="12" r="2.4" fill="${OR}"/><circle cx="15.5" cy="8.5" r="2.4" fill="${ST}"/><circle cx="22" cy="10.5" r="2.4" fill="${P}"/><circle cx="9" cy="19.5" r="2.4" fill="${GR}"/>`,
    '☕': `<path d="M11 3.5Q9 6 11 8.5M16 2.5Q14 5.5 16 8.5" fill="none" stroke="${MU}"/><ellipse cx="15" cy="27.5" rx="11.5" ry="2.3" fill="${MU}"/>
      <path d="M22.5 15Q28 14.5 27.3 19Q26.5 23 21 22" fill="none" stroke-width="2.2"/><path d="M6.5 12H23.5L21.5 24.5Q21 26.5 18.5 26.5H11.5Q9 26.5 8.5 24.5Z" fill="${LI}"/>
      <path d="M7.4 17H22.6" stroke="${PE}" stroke-width="2.5"/><path d="M6.5 12H23.5L21.5 24.5Q21 26.5 18.5 26.5H11.5Q9 26.5 8.5 24.5Z" fill="none"/>`,
    '📖': `<path d="M2.5 10V27Q10 24.5 16 28Q22 24.5 29.5 27V10Z" fill="${P}"/><path d="M16 9.5Q10 6 4.5 7.5V24.5Q10 23 16 26Z" fill="${LI}"/><path d="M16 9.5Q22 6 27.5 7.5V24.5Q22 23 16 26Z" fill="${LI}"/>
      <path d="M7.5 12Q10.5 11.5 13 12.8M7.5 16Q10.5 15.5 13 16.8M19 12.8Q21.5 11.5 24.5 12M19 16.8Q21.5 15.5 24.5 16" stroke="${MU}" stroke-width="1.4"/>`,
    '🎁': `<rect x="6" y="14" width="20" height="14" rx="1.5" fill="${OR}"/><rect x="4" y="10" width="24" height="5.5" rx="1.5" fill="${PE}"/><path d="M16 10V28" stroke="${ST}" stroke-width="3.5"/>
      <path d="M16 10V28" fill="none" stroke="none"/><path d="M16 10Q9 4 8.5 7.5Q8 10.5 16 10ZM16 10Q23 4 23.5 7.5Q24 10.5 16 10Z" fill="${ST}"/>`,
    '🛒': `<path d="M2.5 6.5H7L10.5 21H25" fill="none"/><path d="M8.5 10.5H28L25.5 19.5H10.5Z" fill="${PE}"/><path d="M15 10.5L15.8 19.5M21 10.5L20.6 19.5M9.6 15H26.7" stroke="${OR}" stroke-width="1.3"/>
      <circle cx="12.5" cy="25.5" r="2.5" fill="${O}"/><circle cx="23" cy="25.5" r="2.5" fill="${O}"/>`,
    '🐦': `<path d="M4 15L1.5 19.5L7 19.5" fill="${BD}"/><ellipse cx="14" cy="18.5" rx="10.5" ry="7.5" fill="${BI}"/><path d="M8 22Q14 27 21 22.5Q23 19 22 16Q17 22 8 22Z" fill="${PE}" stroke="none"/>
      <path d="M7 15Q13 11 18 16Q13 20.5 7 15Z" fill="${BD}"/><circle cx="22" cy="10.5" r="5.5" fill="${BI}"/><path d="M27 9.5L30.5 11.3L27 13Z" fill="${ST}"/>
      <circle cx="23.3" cy="9.6" r="1.4" fill="${O}" stroke="none"/><circle cx="23.7" cy="9.1" r=".5" fill="#fff" stroke="none"/><path d="M12 26V29M17 26V29" stroke="${OR}"/>`,
    '📒': `<rect x="6.5" y="3.5" width="20" height="25" rx="2" fill="${ST}"/><path d="M11.5 3.5V28.5" /><rect x="6.5" y="3.5" width="5" height="25" rx="2" fill="${OR}"/>
      <rect x="15" y="9" width="8.5" height="5" rx="1" fill="${LI}"/><path d="M15 18H23.5M15 21.5H21" stroke="${OR}" stroke-width="1.3"/>`,
    '📜': `<rect x="7.5" y="7" width="17" height="18" fill="${PA}"/><path d="M10.5 12H21.5M10.5 15.5H21.5M10.5 19H18" stroke="${PA2}" stroke-width="1.5"/>
      <rect x="4.5" y="3.5" width="23" height="5" rx="2.5" fill="${PA2}"/><rect x="4.5" y="23.5" width="23" height="5" rx="2.5" fill="${PA2}"/>`,
    '🔒': `<path d="M10 15V10.5Q10 4 16 4Q22 4 22 10.5V15" fill="none" stroke-width="5"/><path d="M10 15V10.5Q10 4 16 4Q22 4 22 10.5V15" fill="none" stroke="${MU}" stroke-width="2"/>
      <rect x="5.5" y="14" width="21" height="14.5" rx="3" fill="${ST}"/><circle cx="16" cy="20" r="2" fill="${O}"/><path d="M16 21V24.5" stroke-width="2.4"/>`,
    '🎲': `<g transform="rotate(-10 16 16)"><rect x="5.5" y="5.5" width="21" height="21" rx="4.5" fill="${LI}"/><g fill="${OR}" stroke="none"><circle cx="11" cy="11" r="2"/><circle cx="16" cy="16" r="2"/><circle cx="21" cy="21" r="2"/><circle cx="21" cy="11" r="2"/><circle cx="11" cy="21" r="2"/></g></g>`,
    '✏': `<g transform="rotate(45 16 16)"><rect x="12.5" y="1.5" width="7" height="5" rx="1.5" fill="${PE}"/><rect x="12.5" y="6" width="7" height="2.5" fill="${MU}"/>
      <rect x="12.5" y="8.5" width="7" height="14" fill="${ST}"/><path d="M16 8.5V22.5" stroke="${OR}" stroke-width="1.2"/><path d="M12.5 22.5H19.5L16 30Z" fill="#F2D9A0"/><path d="M14.6 27H17.4L16 30Z" fill="${O}"/></g>`,
    '🌱': `<path d="M5 28Q16 21.5 27 28Z" fill="${BR}"/><path d="M16 26V14" stroke="${GR}" stroke-width="2.6"/><path d="M16 26V14" fill="none"/>
      <path d="M16 18Q8 18.5 6 10.5Q14 9 16 18Z" fill="${GR}"/><path d="M16 14.5Q17 6 26.5 5Q27 13.5 16 14.5Z" fill="${GL}"/>`,
    '🎄': `<rect x="13.5" y="24" width="5" height="5" fill="${BR}"/><path d="M16 12L26 25H6Z" fill="${GR}"/><path d="M16 8L23.5 18H8.5Z" fill="${GR}"/><path d="M16 4.5L21 11.5H11Z" fill="${GL}"/>
      <path d="${sp(16, 4, 3.5)}" fill="${ST}"/><g stroke="none"><circle cx="12" cy="21" r="1.6" fill="${OR}"/><circle cx="20" cy="22" r="1.6" fill="${PE}"/><circle cx="17.5" cy="15" r="1.5" fill="${ST}"/><circle cx="13" cy="15.5" r="1.3" fill="${PE}"/></g>`,
    '🛍': `<path d="M11 12V9Q11 4 16 4Q21 4 21 9V12" fill="none" stroke-width="2.2"/><path d="M6.5 11H25.5L27.5 28H4.5Z" fill="${PE}"/><circle cx="11" cy="14" r="1.2" fill="${O}" stroke="none"/><circle cx="21" cy="14" r="1.2" fill="${O}" stroke="none"/>
      <path d="${sp(16, 21, 4.5)}" fill="${ST}"/>`,
    '📮': `<rect x="6" y="26.5" width="20" height="3" rx="1" fill="${P}"/><path d="M8 27V12Q8 5 16 5Q24 5 24 12V27Z" fill="${OR}"/><rect x="11" y="12" width="10" height="2.4" rx="1" fill="${O}"/>
      <rect x="12" y="18" width="8" height="5" rx="1" fill="${LI}"/>${hl('M11 9Q12.5 7 15 6.8')}`,
    '🗺': `<path d="M3.5 8L11 5L21 8L28.5 5V24L21 27L11 24L3.5 27Z" fill="${LI}"/><path d="M11 5V24L21 27V8Z" fill="${MU}"/><path d="M11 5V24M21 8V27" fill="none"/>
      <path d="M6.5 21Q10 13 15 16Q19 19 22 12" fill="none" stroke="${OR}" stroke-width="1.5" stroke-dasharray="2 2"/><path d="M22.5 9.5L26 13M26 9.5L22.5 13" stroke="${OR}" stroke-width="2"/>`,
    '📚': `<rect x="5" y="21" width="23" height="6.5" rx="1.5" fill="${P}"/><path d="M24 22.5V26" stroke="${LI}" stroke-width="2"/>
      <rect x="3.5" y="14.5" width="22" height="6.5" rx="1.5" fill="${OR}"/><path d="M7 16V19.5" stroke="${LI}" stroke-width="2"/>
      <rect x="7" y="8" width="20" height="6.5" rx="1.5" fill="${GR}"/><path d="M23 9.5V13" stroke="${LI}" stroke-width="2"/><path d="M10 4L16 2.5L17 8" fill="${ST}"/>`,
    '🔖': `<path d="M8.5 3.5H23.5V28.5L16 22L8.5 28.5Z" fill="${OR}"/><path d="${sp(16, 12, 4.5)}" fill="${ST}"/>`,
    '🌙': `<path d="M19 3.5A12.5 12.5 0 1 0 28.5 21A10 10 0 1 1 19 3.5Z" fill="${ST}"/><path d="${sp(26, 7, 3.5)}" fill="${LI}"/><circle cx="23" cy="14" r="1.2" fill="${LI}" stroke="none"/>`,
    '🏆': `<path d="M9 8Q3.5 7.5 4.5 12Q5.5 16 11 15.5M23 8Q28.5 7.5 27.5 12Q26.5 16 21 15.5" fill="none" stroke-width="2.2"/><path d="M8.5 4.5H23.5V11Q23.5 19.5 16 19.5Q8.5 19.5 8.5 11Z" fill="${ST}"/>
      <rect x="14" y="19.5" width="4" height="4" fill="${ST}"/><rect x="9.5" y="23.5" width="13" height="5" rx="1" fill="${P}"/><path d="${sp(16, 11, 3.5)}" fill="${LI}" stroke="none"/>${hl('M11.5 7V11')}`,
    '🔥': `<path d="M16 2.5Q19.5 9 23.5 12Q28.5 17 25.5 23Q22.5 29.5 16 29.5Q9.5 29.5 6.5 23Q4.5 17 10 12.5Q10.5 16.5 13 17Q11 9 16 2.5Z" fill="${OR}"/>
      <path d="M16 13Q18 18 20.5 20Q22.5 24.5 19 27Q16 28.5 13 27Q10 25 11.5 21Q13 23 14.5 22.5Q13 17 16 13Z" fill="${ST}"/>`,
    '🔔': `<circle cx="16" cy="26" r="2.8" fill="${OR}"/><path d="M16 4.5Q24 4.5 24 14V19.5L27.5 24H4.5L8 19.5V14Q8 4.5 16 4.5Z" fill="${ST}"/><circle cx="16" cy="4" r="1.8" fill="${ST}"/>${hl('M11 15V12Q11 9 13 8')}`,
    '🖼': `<rect x="3" y="5" width="26" height="22" rx="2" fill="${OR}"/><rect x="7" y="9" width="18" height="14" fill="${SK}"/><circle cx="20.5" cy="13" r="2.2" fill="${ST}" stroke="none"/>
      <path d="M7 23L13 15L17 20L19.5 17.5L25 23Z" fill="${GR}"/><rect x="7" y="9" width="18" height="14" fill="none"/>`,
    '🔊': `<path d="M4.5 12H10L17 6V26L10 20H4.5Z" fill="${MU}"/><path d="M21 12.5Q23.5 16 21 19.5M24.5 9Q29.5 16 24.5 23" fill="none" stroke="${OR}" stroke-width="2.2"/>`,
    '📸': `<rect x="10" y="6" width="9" height="5" rx="1.5" fill="${P}"/><rect x="3.5" y="9.5" width="25" height="17" rx="3" fill="${P}"/><circle cx="16" cy="18" r="6" fill="${MU}"/><circle cx="16" cy="18" r="3" fill="${O}"/>
      <circle cx="17" cy="17" r=".9" fill="#fff" stroke="none"/><rect x="22" y="12" width="3.5" height="2.5" rx=".8" fill="${ST}"/><path d="M26 3.5L27.5 6M29.5 7L27 7.5M23 3L24 5.5" stroke="${ST}" stroke-width="1.5"/>`,
    '💬': `<path d="M6.5 5.5H25.5Q29 5.5 29 9V19Q29 22.5 25.5 22.5H14L8 27.5L9 22.5H6.5Q3 22.5 3 19V9Q3 5.5 6.5 5.5Z" fill="${LI}"/><g fill="${O}" stroke="none"><circle cx="10.5" cy="14" r="2"/><circle cx="16" cy="14" r="2"/><circle cx="21.5" cy="14" r="2"/></g>`,
    '⭐': `<path d="M16 3L19.6 11.2L28.5 12L21.8 17.9L23.8 26.6L16 22L8.2 26.6L10.2 17.9L3.5 12L12.4 11.2Z" fill="${ST}"/>${hl('M11.5 14.5L14 12.5')}`,
  };
  // ---- волна 2 (70 значков) ----
  const DK = '#3A332E', RD = '#C8483A', PK = '#F2B8C6', TN = '#B98A5E', LV = '#B9A8E0';
  const ring = (cx, cy, n, R, f) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; return f(cx + R * Math.cos(a), cy + R * Math.sin(a), a); }).join('');
  const gear = (cx, cy, r1, r2, n) => { let d = ''; for (let i = 0; i < n * 2; i++) { const r = i % 2 ? r1 : r2, a0 = (i / (n * 2)) * Math.PI * 2, a1 = ((i + 1) / (n * 2)) * Math.PI * 2; d += `${i ? 'L' : 'M'}${(cx + r * Math.cos(a0)).toFixed(1)} ${(cy + r * Math.sin(a0)).toFixed(1)}L${(cx + r * Math.cos(a1)).toFixed(1)} ${(cy + r * Math.sin(a1)).toFixed(1)}`; } return d + 'Z'; };
  const dbl = (d, c, w = 1.6) => `<path d="${d}" fill="none" stroke-width="${w + 2}"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`;
  Object.assign(ART, {
    '⚠': `<path d="M16 3.5L29.5 27.5H2.5Z" fill="${ST}"/><path d="M16 11V19" stroke-width="3"/><circle cx="16" cy="23.5" r="1.8" fill="${O}"/>`,
    '✍': `<path d="M13 16L25 4L28 7L16 19Z" fill="${ST}"/><path d="M13 16L16 19L10.5 21.5Z" fill="#F2D9A0"/><path d="M6 20Q5 14 11 13L18 12Q21 12 21 15Q21 17 18 17H15.5Q19 18.5 18 22Q17 26.5 12 26.5Q7 26.5 6 20Z" fill="${PE}"/><path d="M11 21Q13 20 15.5 17" fill="none"/>`,
    '🤖': `<path d="M16 9V5" /><circle cx="16" cy="4" r="1.8" fill="${OR}"/><rect x="3.5" y="14" width="3" height="6" rx="1" fill="${P}"/><rect x="25.5" y="14" width="3" height="6" rx="1" fill="${P}"/><rect x="6" y="9" width="20" height="17" rx="4" fill="${MU}"/>
      <circle cx="12" cy="16" r="2.6" fill="${SK}"/><circle cx="20" cy="16" r="2.6" fill="${SK}"/><circle cx="12" cy="16" r="1" fill="${O}"/><circle cx="20" cy="16" r="1" fill="${O}"/><rect x="12" y="20.5" width="8" height="2" rx="1" fill="${O}"/>`,
    '📎': dbl('M20.5 9V22Q20.5 27.5 15.5 27.5Q10.5 27.5 10.5 22V7.5Q10.5 4 14 4Q17.5 4 17.5 7.5V21Q17.5 23.5 15.5 23.5Q13.5 23.5 13.5 21V10', MU, 1.8),
    '🧹': dbl('M26 3L15.5 16', BR, 2.2) + `<path d="M10.5 13.5L20 19L15.5 29Q8 29.5 3.5 24Z" fill="${ST}"/><path d="M9 17L17.5 22" stroke="${OR}" stroke-width="2"/><path d="M8 24L11.5 21M11 27L14 23" />`,
    '🎉': `<path d="M4 28.5L10 12L20.5 22.5Z" fill="${ST}"/><path d="M7.5 19L13.5 25M9 15L17.5 23.5" stroke="${OR}" stroke-width="1.6"/><path d="M14 9Q14 4 19 5M22 14Q27 11 28 16M18 11Q22 7 25 6" fill="none" stroke="${P}" stroke-width="1.6"/>
      <circle cx="26" cy="22" r="1.6" fill="${PE}"/><rect x="21" y="2.5" width="3" height="3" rx=".6" fill="${OR}" transform="rotate(20 22.5 4)"/><rect x="26.5" y="8" width="3" height="3" rx=".6" fill="${GR}"/><circle cx="12" cy="4.5" r="1.4" fill="${GR}"/>`,
    '📅': `<path d="M7 6H25Q28 6 28 9V13H4V9Q4 6 7 6Z" fill="${OR}"/><path d="M4 13H28V25Q28 28 25 28H7Q4 28 4 25Z" fill="${LI}"/><path d="M10 4V9M22 4V9" stroke-width="2.4"/>
      <g fill="${MU}" stroke="none"><circle cx="9" cy="17.5" r="1.4"/><circle cx="14" cy="17.5" r="1.4"/><circle cx="19" cy="17.5" r="1.4"/><circle cx="9" cy="22.5" r="1.4"/><circle cx="14" cy="22.5" r="1.4"/></g><rect x="20.5" y="20" width="5" height="5" rx="1" fill="${ST}"/>`,
    '🔁': dbl('M7 15V12.5Q7 8 11.5 8H24M21 4.5L24.5 8L21 11.5', P, 2) + dbl('M25 17V19.5Q25 24 20.5 24H8M11 20.5L7.5 24L11 27.5', P, 2),
    '📰': `<path d="M26 10H29V25.5Q29 27.5 27 27.5H25" fill="${MU}"/><rect x="4" y="5.5" width="22" height="22" rx="1.5" fill="${LI}"/><rect x="7" y="8.5" width="16" height="3.5" fill="${O}"/><rect x="7" y="15" width="7" height="6.5" fill="${SK}"/>
      <path d="M16.5 15.5H23M16.5 18.5H23M16.5 21.5H23M7 24.5H23" stroke="${MU}" stroke-width="1.4"/>`,
    '🕊': `<path d="M12 14Q9.5 5 19 3Q19.5 11 16 15Z" fill="${LI}"/><path d="M3.5 18Q8 12 15 14L20 10Q24 7 27 9L30.5 10.5L27 12.5Q26 20.5 16 22.5Q9 23.5 3.5 18Z" fill="${LI}"/><path d="M8 18.5Q12 17 15 18" fill="none"/>
      <circle cx="25" cy="10" r="1" fill="${O}"/>` + dbl('M27 14Q25 19 21 22', GR, 1.4) + `<path d="M24 18Q27.5 18 28 21Q24.5 21.5 24 18Z" fill="${GL}"/>`,
    '☀': ring(16, 16, 8, 10.5, (x, y, a) => `<path d="M${(16 + 9.5 * Math.cos(a)).toFixed(1)} ${(16 + 9.5 * Math.sin(a)).toFixed(1)}L${(16 + 13.5 * Math.cos(a)).toFixed(1)} ${(16 + 13.5 * Math.sin(a)).toFixed(1)}" stroke="${OR}" stroke-width="2.2"/>`) + `<circle cx="16" cy="16" r="7" fill="${ST}"/>${hl('M12 14Q12.5 12 14.5 11.5')}`,
    '🎒': `<path d="M13 5Q16 1 19 5" fill="none" stroke-width="2"/><path d="M8 11Q8 5 16 5Q24 5 24 11V26Q24 28.5 21.5 28.5H10.5Q8 28.5 8 26Z" fill="${OR}"/><path d="M8 12.5Q16 16 24 12.5" fill="none"/><rect x="11" y="18" width="10" height="7.5" rx="2" fill="${PE}"/><path d="M11 21H21" />`,
    '📋': `<rect x="6" y="5" width="20" height="24" rx="2" fill="${TN}"/><rect x="9" y="8.5" width="14" height="18" fill="${LI}"/><rect x="12" y="3" width="8" height="5" rx="1.5" fill="${MU}"/><path d="M12 14H20M12 18H20M12 22H17" stroke="${MU}" stroke-width="1.5"/>`,
    '⏳': `<path d="M9 6Q9 13 16 16Q9 19 9 26H23Q23 19 16 16Q23 13 23 6Z" fill="${SK}"/><path d="M11.5 9H20.5Q19 13 16 14.5Q13 13 11.5 9Z" fill="${ST}" stroke="none"/><path d="M10.5 25Q13 20 16 19.5Q19 20 21.5 25Z" fill="${ST}" stroke="none"/>
      <path d="M9 6Q9 13 16 16Q9 19 9 26H23Q23 19 16 16Q23 13 23 6Z" fill="none"/><rect x="6.5" y="3" width="19" height="3.2" rx="1" fill="${BR}"/><rect x="6.5" y="25.8" width="19" height="3.2" rx="1" fill="${BR}"/>`,
    '🩹': `<g transform="rotate(-40 16 16)"><rect x="2.5" y="11.5" width="27" height="9" rx="4.5" fill="${PE}"/><rect x="11.5" y="11.5" width="9" height="9" fill="#F6D9C6"/><g fill="${OR}" stroke="none"><circle cx="6.5" cy="16" r=".9"/><circle cx="25.5" cy="16" r=".9"/><circle cx="8.5" cy="14.5" r=".9"/><circle cx="23.5" cy="17.5" r=".9"/></g></g>`,
    '🌐': `<circle cx="16" cy="16" r="12.5" fill="${SK}"/><path d="M8 7Q11 12 9 16Q7 19 10 22Q13 25 11 28M20 4.5Q18 9 22 11Q26 12 24 17Q22 21 26 23" fill="none" stroke="${GR}" stroke-width="1.6"/><ellipse cx="16" cy="16" rx="5.5" ry="12.5" fill="none"/><path d="M3.5 16H28.5M5.5 9.5H26.5M5.5 22.5H26.5" fill="none"/>`,
    '🏅': `<path d="M8.5 3H14L18.5 14H13Z" fill="${P}"/><path d="M23.5 3H18L13.5 14H19Z" fill="${OR}"/><circle cx="16" cy="21" r="7.5" fill="${ST}"/><path d="${sp(16, 21, 4)}" fill="${LI}" stroke="none"/>`,
    '🥕': `<path d="M22 9Q22 2 26.5 2Q26.5 7 23.5 9.5Z" fill="${GR}"/><path d="M23 11Q28 7.5 30.5 10.5Q27.5 12.5 23.5 12Z" fill="${GL}"/><path d="M19 7.5Q25.5 9 25 13.5L6.5 28Q4.5 28.5 4.5 26.5Z" fill="${OR}"/><path d="M14 13L16.5 15M10 20L13 22M17 17L19.5 18.5" />`,
    '📝': `<rect x="5" y="4" width="18" height="24" rx="1.5" fill="${LI}"/><path d="M8.5 9H19.5M8.5 13H19.5M8.5 17H15" stroke="${MU}" stroke-width="1.5"/><path d="M17 22L27 8L30 10.5L20 24.5Z" fill="${ST}"/><path d="M17 22L20 24.5L15.5 27.5Z" fill="#F2D9A0"/>`,
    '🗣': `<path d="M5 28.5V20.5Q3 18 4 14Q5 5.5 13 5Q20.5 5 21 12L23.5 16.5L21.5 17V20Q21.5 22.5 18.5 22.5H15.5V28.5Z" fill="${P}"/><path d="M25 9L28.5 7M25.5 14H29.5M25 19L28.5 21" stroke="${OR}" stroke-width="2"/>`,
    '🗂': `<rect x="17" y="6.5" width="8" height="5" rx="1" fill="${PE}"/><rect x="4" y="9.5" width="24" height="17" rx="2" fill="${ST}"/><rect x="6" y="6.5" width="8" height="5" rx="1" fill="${ST}"/><path d="M4 14H28V25.5Q28 27.5 26 27.5H6Q4 27.5 4 25.5Z" fill="${OR}"/>`,
    '🥞': `<ellipse cx="16" cy="26.5" rx="13.5" ry="3" fill="${MU}"/><rect x="5.5" y="19.5" width="21" height="5.5" rx="2.75" fill="#E8B25E"/><rect x="6.5" y="14.5" width="19" height="5.5" rx="2.75" fill="#E8B25E"/><rect x="7.5" y="9.5" width="17" height="5.5" rx="2.75" fill="#E8B25E"/>
      <path d="M9 10Q16 7.5 23 10Q23 13 21 13.5Q20 17 18.5 13.5Q13 14 11.5 12.5Q9.5 12.5 9 10Z" fill="${BR}"/><rect x="13" y="6" width="6" height="3.5" rx="1" fill="#F6E08A"/>`,
    '💡': `<path d="M16 3Q25 3 25 12Q25 17 20.5 20V23H11.5V20Q7 17 7 12Q7 3 16 3Z" fill="${ST}"/><path d="M13.5 16L16 12.5L18.5 16" fill="none" stroke="${OR}"/><rect x="11.5" y="23" width="9" height="5" rx="1.5" fill="${MU}"/><path d="M12 25.5H20" />${hl('M11 10Q11.5 7 14 6')}`,
    '🚪': `<path d="M3.5 28.5H28.5" /><rect x="7" y="3" width="18" height="25.5" fill="${BR}"/><rect x="9" y="5" width="14" height="23.5" fill="${OR}"/><rect x="11" y="8" width="10" height="7" rx="1" fill="none"/><circle cx="20.5" cy="18.5" r="1.4" fill="${ST}"/>`,
    '🗑': `<path d="M13 6V4H19V6" fill="none"/><path d="M7 10H25L23.5 28H8.5Z" fill="${LI}"/><path d="M12.5 14L13 24.5M16 14V24.5M19.5 14L19 24.5" stroke="${MU}" stroke-width="1.6"/><rect x="5" y="6.5" width="22" height="3.5" rx="1.5" fill="${MU}"/>`,
    '🧾': `<path d="M8 3H24V29L22 27.5L20 29L18 27.5L16 29L14 27.5L12 29L10 27.5L8 29Z" fill="${LI}"/><path d="M11.5 8H20.5M11.5 12H20.5M11.5 16H17" stroke="${MU}" stroke-width="1.5"/><path d="M11.5 21.5H20.5" stroke="${OR}" stroke-width="2"/>`,
    '✅': `<rect x="4" y="4" width="24" height="24" rx="5" fill="${GR}"/><path d="M9.5 16.5L14 21L23 11" fill="none" stroke="${LI}" stroke-width="3.2"/>`,
    '🪶': `<path d="M27 3.5Q16 4 10.5 14Q7.5 20 8.5 24Q12.5 25 18.5 21Q27.5 14 27 3.5Z" fill="${PE}"/><path d="M11 16L15 17M13.5 12L18.5 13M10 20.5L14 21" stroke="${OR}" stroke-width="1.2"/><path d="M27 3.5Q15 15 4 28.5" fill="none"/>`,
    '🏷': `<path d="M10 10Q6 4 2.5 6.5" fill="none"/><path d="M4 6Q4 4 6 4H15L28 17Q29 18 28 19L19 28Q18 29 17 28L4 15Z" fill="${ST}"/><circle cx="10" cy="10" r="2" fill="${LI}"/>`,
    '🚆': `<path d="M8 29.5L11 25.5M24 29.5L21 25.5" /><rect x="7" y="3.5" width="18" height="22" rx="5" fill="${P}"/><rect x="10" y="7.5" width="12" height="7" rx="2" fill="${SK}"/><rect x="7.5" y="16.5" width="17" height="1.8" fill="${OR}" stroke="none"/>
      <circle cx="11.5" cy="21.5" r="1.6" fill="${ST}"/><circle cx="20.5" cy="21.5" r="1.6" fill="${ST}"/>`,
    '🙈': `<circle cx="5" cy="15" r="3.2" fill="${PE}"/><circle cx="27" cy="15" r="3.2" fill="${PE}"/><circle cx="16" cy="17" r="11" fill="${BR}"/><ellipse cx="16" cy="21.5" rx="7" ry="5" fill="${PE}"/><path d="M13.5 23.5Q16 25 18.5 23.5" fill="none"/>
      <ellipse cx="10.5" cy="14" rx="5.5" ry="3.8" fill="${PE}"/><ellipse cx="21.5" cy="14" rx="5.5" ry="3.8" fill="${PE}"/><path d="M8 12.5V15M10.5 12V15M13 12.5V15M19 12.5V15M21.5 12V15M24 12.5V15" stroke-width="1"/>`,
    '🏠': `<rect x="20.5" y="5" width="3.5" height="7" fill="${BR}"/><rect x="7" y="14" width="18" height="14.5" fill="${LI}"/><path d="M3.5 15.5L16 4.5L28.5 15.5Z" fill="${OR}"/><rect x="13.5" y="19.5" width="5" height="9" fill="${BR}"/><rect x="19.5" y="17.5" width="4" height="4" fill="${SK}"/>`,
    '🍳': dbl('M21 22L29.5 29', BR, 2.4) + `<circle cx="13" cy="15.5" r="10.5" fill="${DK}"/><path d="M8 13Q8 8.5 13 9Q17 8 18.5 12Q20 16 16.5 19Q13 21.5 9.5 19Q7.5 17 8 13Z" fill="${LI}"/><circle cx="13.5" cy="14" r="2.8" fill="${ST}"/>`,
    '✉': `<rect x="3.5" y="7" width="25" height="18" rx="2" fill="${LI}"/><path d="M3.5 8L16 18L28.5 8M3.5 24.5L12.5 16M28.5 24.5L19.5 16" fill="none"/>`,
    '🎃': `<path d="M16 9Q16 5 18.5 3" fill="none" stroke="${GR}" stroke-width="2.6"/><ellipse cx="16" cy="18" rx="13" ry="10" fill="${OR}"/><ellipse cx="16" cy="18" rx="5.5" ry="10" fill="none"/>
      <path d="M8.5 15.5L11.5 12.5L13 16ZM23.5 15.5L20.5 12.5L19 16ZM9 21Q16 26 23 21L21 22L19.5 20.5L17.5 22.5L16 21L14 22.5L12.5 20.5L11 22Z" fill="${O}"/>`,
    '📦': `<path d="M16 4L28 9L16 14L4 9Z" fill="${PA2}"/><path d="M4 9L16 14V28.5L4 23.5Z" fill="#C9A46A"/><path d="M28 9L16 14V28.5L28 23.5Z" fill="#D8B77E"/><path d="M10 6.5L22 11.5V15.5" fill="none" stroke="${PA}" stroke-width="2"/>`,
    '🧪': `<g transform="rotate(28 16 16)"><path d="M12.5 4H19.5V23.5Q19.5 28.5 16 28.5Q12.5 28.5 12.5 23.5Z" fill="${LI}"/><path d="M12.5 15H19.5V23.5Q19.5 28.5 16 28.5Q12.5 28.5 12.5 23.5Z" fill="${GL}"/><path d="M12.5 4H19.5V23.5Q19.5 28.5 16 28.5Q12.5 28.5 12.5 23.5Z" fill="none"/>
      <rect x="11" y="2.5" width="10" height="3" rx="1" fill="${MU}"/><circle cx="15" cy="20" r="1" fill="${LI}" stroke="none"/><circle cx="17" cy="24" r="1.2" fill="${LI}" stroke="none"/></g>`,
    '🎙': `<path d="M7.5 13Q7.5 23 16 23Q24.5 23 24.5 13M16 23V27" fill="none"/><rect x="11" y="3" width="10" height="15.5" rx="5" fill="${MU}"/><path d="M11.5 9H20.5M11.5 12.5H20.5" stroke="${O}" stroke-width="1"/><rect x="10" y="27" width="12" height="2.5" rx="1" fill="${P}"/>`,
    '⚙': `<path d="${gear(16, 16, 9.5, 12.5, 8)}" fill="${MU}"/><circle cx="16" cy="16" r="4" fill="${LI}"/>`,
    '🔮': `<circle cx="16" cy="14" r="10.5" fill="${LV}"/><path d="${sp(13, 12, 3.5)}" fill="${LI}" stroke="none"/><circle cx="19.5" cy="17" r="1.2" fill="${LI}" stroke="none"/><path d="M7.5 28.5Q8.5 22 16 22Q23.5 22 24.5 28.5Z" fill="${BR}"/>${hl('M9 11Q10 7 13.5 5.5')}`,
    '🎮': `<path d="M9 10H23Q29 10 29.5 18Q30 25 26 25Q23.5 25 22 22H10Q8.5 25 6 25Q2 25 2.5 18Q3 10 9 10Z" fill="${P}"/><path d="M8.5 15V20.5M5.75 17.75H11.25" stroke="${LI}" stroke-width="2"/><circle cx="22" cy="16.5" r="1.6" fill="${ST}"/><circle cx="25.5" cy="19" r="1.6" fill="${OR}"/>`,
    '🍽': `<circle cx="16" cy="16" r="9" fill="${LI}"/><circle cx="16" cy="16" r="5.5" fill="none" stroke="${MU}"/><path d="M4 4V11Q4 13 5 13V28M2.5 4V10M5.5 4V10M28 4Q24.5 8.5 25.5 15H28V28" fill="none" stroke-width="1.8"/>`,
    '⏱': `<rect x="14" y="2.5" width="4" height="4" rx="1" fill="${MU}"/><path d="M24 8.5L26 6.5" stroke-width="2.4"/><circle cx="16" cy="18" r="11" fill="${LI}"/><path d="M16 18V11.5" stroke="${OR}" stroke-width="2.2"/><circle cx="16" cy="18" r="1.4" fill="${O}"/><path d="M16 8.5V10M25.5 18H24M16 27.5V26M6.5 18H8" />`,
    '📌': dbl('M13 18.5L5 27.5', MU, 1.4) + `<path d="M11 14Q14 9 19 9L23 5L27 9L23 13Q23 18 18 21Z" fill="${OR}"/><path d="M18 21L11 14" />${hl('M16.5 12Q18 10.5 20 10.5')}`,
    '🎓': `<path d="M8 15V22.5Q16 26.5 24 22.5V15L16 18.5Z" fill="${DK}"/><path d="M16 5.5L30 12L16 18.5L2 12Z" fill="${DK}"/><path d="M16 12L26.5 13.5V20.5" fill="none" stroke="${ST}" stroke-width="1.6"/><circle cx="26.5" cy="21.5" r="1.8" fill="${ST}"/>`,
    '🌧': `<path d="M10.5 23L9 27.5M16.5 23L15 27.5M22.5 23L21 27.5" stroke="${SK}" stroke-width="2.4"/><path d="M8 20Q3 20 3 15.5Q3 11 8 11Q9 5 15.5 5Q21 5 23 10Q29 10 29 15Q29 20 24 20Z" fill="${MU}"/>`,
    '👻': `<path d="M6 28V14Q6 4 16 4Q26 4 26 14V28L22.5 25L19 28L16 25L13 28L9.5 25Z" fill="${LI}"/><ellipse cx="12.5" cy="13.5" rx="1.8" ry="2.5" fill="${O}"/><ellipse cx="19.5" cy="13.5" rx="1.8" ry="2.5" fill="${O}"/><ellipse cx="16" cy="19.5" rx="2" ry="1.6" fill="${O}"/>`,
    '💧': `<path d="M16 3Q25 15 25 20Q25 29 16 29Q7 29 7 20Q7 15 16 3Z" fill="${SK}"/>${hl('M11 20Q11 24 14 25.5')}`,
    '⏰': `<circle cx="8" cy="7.5" r="4" fill="${ST}"/><circle cx="24" cy="7.5" r="4" fill="${ST}"/><path d="M9.5 25.5L6.5 29M22.5 25.5L25.5 29" /><circle cx="16" cy="17.5" r="10.5" fill="${LI}"/><path d="M16 17.5V11.5M16 17.5L20 20" stroke="${OR}" stroke-width="2"/><circle cx="16" cy="17.5" r="1.3" fill="${O}"/>`,
    '👑': `<path d="M4 10.5L10 17L16 6.5L22 17L28 10.5L26 25H6Z" fill="${ST}"/><rect x="6" y="21.5" width="20" height="4" fill="${OR}"/><circle cx="16" cy="6" r="1.8" fill="${PE}"/><circle cx="4" cy="10" r="1.6" fill="${PE}"/><circle cx="28" cy="10" r="1.6" fill="${PE}"/><circle cx="16" cy="16" r="1.8" fill="${LI}"/>`,
    '🔦': `<path d="M21 6L29 2M24 11L30.5 10M18 4L20 1" stroke="${ST}" stroke-width="2"/><g transform="rotate(-35 16 16)"><rect x="4" y="13.5" width="14" height="6" rx="1.5" fill="${P}"/><path d="M18 11H23.5V22H18Z" fill="${MU}"/><rect x="23.5" y="11.5" width="2" height="10" rx=".8" fill="${ST}"/><rect x="9" y="15" width="3" height="3" rx=".5" fill="${OR}"/></g>`,
    '👆': `<path d="M9 14H21Q24 14 24 17V22Q24 29 16.5 29Q9 29 9 23Z" fill="${PE}"/><path d="M14.5 18.5H24M14.5 22.5H23.5" fill="none"/><path d="M9 19V5.5Q9 3 11.5 3Q14 3 14 5.5V19" fill="${PE}"/><path d="M9 20.5Q13.5 20 16 24.5" fill="none"/>`,
    '🕯': `<path d="M16 3Q20 8 19 10.5Q18 12.5 16 12.5Q14 12.5 13 10.5Q12 8 16 3Z" fill="${ST}"/><path d="M16 7Q17.5 9.5 17 10.5Q16.5 11.5 16 11.5Q15.5 11.5 15 10.5Q14.5 9.5 16 7Z" fill="${OR}" stroke="none"/><path d="M16 12.5V14" />
      <rect x="11" y="14" width="10" height="13.5" rx="1" fill="${LI}"/><path d="M14 14V18Q14 19.5 15 19.5Q16 19.5 16 18V15.5" fill="none" stroke="${MU}"/><ellipse cx="16" cy="28" rx="9" ry="2.5" fill="${BR}"/>`,
    '🐞': `<path d="M12 6.5L9.5 3M20 6.5L22.5 3" /><path d="M9 11.5Q16 2 23 11.5Z" fill="${O}"/><circle cx="16" cy="18.5" r="10" fill="${RD}"/><path d="M16 9V28.5" /><g fill="${O}"><circle cx="11" cy="15.5" r="2"/><circle cx="21" cy="15.5" r="2"/><circle cx="10.5" cy="22" r="1.6"/><circle cx="21.5" cy="22" r="1.6"/></g>`,
    '🧿': `<circle cx="16" cy="16" r="12.5" fill="#4A7AB8"/><circle cx="16" cy="16" r="8.5" fill="${LI}"/><circle cx="16" cy="16" r="5.5" fill="${SK}"/><circle cx="16" cy="16" r="2.6" fill="${O}"/>`,
    '🕵': `<path d="M5 30Q7 24 16 24Q25 24 27 30Z" fill="${PA2}"/><circle cx="16" cy="18" r="7.5" fill="${PE}"/><path d="M8 13Q8 4 16 4Q24 4 24 13Z" fill="${BR}"/><rect x="8" y="10" width="16" height="2.5" fill="${O}"/><ellipse cx="16" cy="13" rx="13" ry="2.6" fill="${BR}"/>
      <circle cx="13" cy="18" r="1" fill="${O}"/><circle cx="19" cy="18" r="1" fill="${O}"/><path d="M14 21.5Q16 22.5 18 21.5" fill="none"/>`,
    '💾': `<rect x="4" y="4" width="24" height="24" rx="2" fill="${P}"/><rect x="9" y="4" width="14" height="8" fill="${MU}"/><rect x="17.5" y="5.5" width="3" height="5" fill="${P}"/><rect x="8" y="16" width="16" height="10" rx="1" fill="${LI}"/><path d="M11 19.5H21M11 22.5H18" stroke="${MU}"/>`,
    '🌾': [['M16 29Q15 18 9 7', -30, [[11.5, 12], [10, 9], [13, 15.5]]], ['M16 29V5', 0, [[16, 7], [16, 10.5], [16, 14]]], ['M16 29Q17 18 23 7', 30, [[20.5, 12], [22, 9], [19, 15.5]]]]
      .map(([d, r, gs]) => dbl(d, '#C9973A', 1.3) + gs.map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.7" ry="2.8" fill="${ST}" transform="rotate(${r} ${x} ${y})"/>`).join('')).join(''),
    '🌸': ring(16, 16, 5, 6.5, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="${PK}"/>`) + `<circle cx="16" cy="16" r="3.2" fill="${ST}"/>`,
    '📣': `<path d="M9 20L10.5 27H14L12.5 20" fill="${MU}"/><rect x="3" y="12.5" width="3.5" height="7" rx="1" fill="${MU}"/><path d="M5.5 13L21 6V26L5.5 19Z" fill="${OR}"/><ellipse cx="21.5" cy="16" rx="2.2" ry="10" fill="${PE}"/>`,
    '⚽': `<circle cx="16" cy="16" r="12.5" fill="${LI}"/><path d="M16 11L20.8 14.5L19 20H13L11.2 14.5Z" fill="${O}"/><path d="M16 11V4M20.8 14.5L27 12.5M19 20L23 25.5M13 20L9 25.5M11.2 14.5L5 12.5" fill="none"/>`,
    '🎬': `<rect x="4" y="13" width="24" height="15" rx="1.5" fill="${DK}"/><path d="M8 18H24M8 22H20" stroke="${LI}" stroke-width="1.4"/><g transform="rotate(-12 4 12)"><rect x="4" y="7" width="24" height="5" rx="1" fill="${LI}"/><path d="M8 7L11 12M14 7L17 12M20 7L23 12" stroke="${O}" stroke-width="2.2"/></g>`,
    '🔑': `<rect x="14" y="14.5" width="15" height="3.2" fill="${ST}"/><rect x="23" y="17" width="2.6" height="4.5" fill="${ST}"/><rect x="27" y="17" width="2" height="3.2" fill="${ST}"/><circle cx="9" cy="16" r="6.2" fill="${ST}"/><circle cx="7.5" cy="16" r="2" fill="${LI}"/>`,
    '💛': `<path d="M16 27Q4 19 4 11.5Q4 5 10 5Q14 5 16 9Q18 5 22 5Q28 5 28 11.5Q28 19 16 27Z" fill="${ST}"/>${hl('M8 11Q8 8.5 10.5 8')}`,
    '👁': `<path d="M2.5 16Q16 3 29.5 16Q16 29 2.5 16Z" fill="${LI}"/><circle cx="16" cy="16" r="6" fill="${P}"/><circle cx="16" cy="16" r="2.8" fill="${O}"/><circle cx="17.5" cy="14.5" r="1" fill="#fff" stroke="none"/>`,
    '🥚': `<path d="M16 3Q25 3 25.5 17Q25.5 29 16 29Q6.5 29 6.5 17Q7 3 16 3Z" fill="#F6EEDF"/><g fill="${PA2}" stroke="none"><circle cx="19" cy="11" r="1.1"/><circle cx="12" cy="19" r="1.2"/><circle cx="20" cy="22" r=".9"/></g>${hl('M10.5 14Q11 9 13.5 6.5')}`,
    '📄': `<path d="M7 3H19L26 10V29H7Z" fill="${LI}"/><path d="M19 3V10H26Z" fill="${MU}"/><path d="M10.5 14H22.5M10.5 18H22.5M10.5 22H18" stroke="${MU}" stroke-width="1.5"/>`,
  });
  // одинаковые по смыслу эмодзи — один рисунок
  ART['🔎'] = ART['🔍'];
  ART['✎'] = ART['✏'];
  ART['📷'] = ART['📸'];
  let ready = false;
  const setup = () => {
    if (ready || typeof document === 'undefined' || !document.head) return;
    ready = true;
    const st = document.createElement('style');
    st.textContent = '.pp-emo{width:1.3em;height:1.3em;vertical-align:-.28em;overflow:visible}'
      + '.pp-e{display:inline-block;position:relative;width:1.3em;height:1.3em;vertical-align:-.28em;line-height:1}'
      + '.pp-e .pp-ec{position:absolute;inset:0;opacity:0;overflow:hidden;white-space:nowrap;font-size:.9em;pointer-events:none}'
      + '.pp-e .pp-emo{position:absolute;inset:0;width:100%;height:100%;vertical-align:0}'
      + '.pp-emo .w *{stroke:none!important}.pp-emo .w .i,.pp-emo .w .i *{fill:none!important}.pp-emo .w{opacity:.75;filter:url(#pp-emo-wash)}'
      + '.pp-emo .k{stroke:currentColor;filter:url(#pp-emo-ink)}.pp-emo .k .i,.pp-emo .k .i *{fill:currentColor!important}';
    document.head.appendChild(st);
    const d = document.createElement('div');
    d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    d.innerHTML = '<svg aria-hidden="true"><filter id="pp-emo-ink" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="1.1"/></filter>'
      + '<filter id="pp-emo-wash" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="2.2"/></filter></svg>';
    (document.body || document.head).appendChild(d);
  };
  const svg = (ch) => {
    let a = ART[ch.replace(/\uFE0F/g, '')];
    if (!a) return null;
    setup();
    a = a.split(`fill="${O}"`).join('class="i"');
    return `<svg class="pp-emo" viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke-width="1.35" stroke-linejoin="round" stroke-linecap="round"><g class="w" transform="translate(.9 1)">${a}</g><g class="k">${a}</g></svg>`;
  };
  // ---- замена на странице ----
  const KEYS = Object.keys(ART).sort((x, y) => y.length - x.length).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const RE = new RegExp(`(?<!\\u200D)(?:${KEYS.join('|')})\\uFE0F?(?![\\u200D\\u{1F3FB}-\\u{1F3FF}])`, 'gu');
  const SKIP = /^(SCRIPT|STYLE|TEXTAREA|INPUT|SELECT|OPTION|CODE|PRE|SVG|CANVAS|NOSCRIPT|TITLE|svg|text|tspan)$/;
  const BAD = '[contenteditable],.pp-e,.pp-noemo';
  let on = false, mo = null, queue = new Set(), raf = 0;
  const okText = (n) => {
    const p = n.parentNode;
    if (!p || p.nodeType !== 1 || SKIP.test(p.nodeName)) return false;
    if (p.closest(BAD) || p.isContentEditable) return false;
    RE.lastIndex = 0;
    return RE.test(n.nodeValue);
  };
  const swap = (n) => {
    if (!okText(n)) return;
    const s = n.nodeValue, f = document.createDocumentFragment();
    let last = 0;
    RE.lastIndex = 0;
    for (const m of s.matchAll(RE)) {
      if (m.index > last) f.appendChild(document.createTextNode(s.slice(last, m.index)));
      const w = document.createElement('span');
      w.className = 'pp-e';
      w.innerHTML = svg(m[0]);
      const c = document.createElement('span');
      c.className = 'pp-ec';
      c.textContent = m[0];
      w.prepend(c);
      f.appendChild(w);
      last = m.index + m[0].length;
    }
    if (last < s.length) f.appendChild(document.createTextNode(s.slice(last)));
    n.parentNode.replaceChild(f, n);
  };
  const scan = (root) => {
    if (!root) return;
    if (root.nodeType === 3) return swap(root);
    if (root.nodeType !== 1 || SKIP.test(root.nodeName) || root.closest(BAD)) return;
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const list = [];
    while (tw.nextNode()) list.push(tw.currentNode);
    list.forEach(swap);
  };
  const flush = () => { raf = 0; const q = [...queue]; queue.clear(); q.forEach(n => n.isConnected && scan(n)); };
  const later = (n) => { queue.add(n); if (!raf) raf = requestAnimationFrame(flush); };
  const start = () => {
    if (on || document.documentElement.classList.contains('pp-noemo')) return;
    on = true;
    setup();
    scan(document.body);
    mo = new MutationObserver((ms) => {
      for (const m of ms) {
        if (m.type === 'characterData') later(m.target);
        else m.addedNodes.forEach(later);
      }
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  };
  const off = () => {
    on = false;
    if (mo) mo.disconnect();
    mo = null;
    queue.clear();
    document.querySelectorAll('.pp-e').forEach(w => {
      const c = w.querySelector('.pp-ec'), p = w.parentNode;
      p.replaceChild(document.createTextNode(c ? c.textContent : ''), w);
      p.normalize();
    });
  };
  window.PPEmojiArt = { svg, list: Object.keys(ART), start, off, scan };
  if (typeof document !== 'undefined' && !window.PPEmojiArtManual) {
    if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
  }
})();
