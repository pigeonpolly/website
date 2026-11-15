// Нарисованные эмодзи в стиле сайта (черновик, волна 1 — 30 частых). PPEmojiArt.svg(ch) → строка <svg> или null.
// Рисунок 32×32, обводка #2B1A51; новый значок = строка в ART.
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
  let ready = false;
  const setup = () => {
    if (ready || typeof document === 'undefined' || !document.head) return;
    ready = true;
    const st = document.createElement('style');
    st.textContent = '.pp-emo{width:1.3em;height:1.3em;vertical-align:-.28em;overflow:visible}'
      + '.pp-emo .w *{stroke:none!important}.pp-emo .w .i,.pp-emo .w .i *{fill:none!important}.pp-emo .w{opacity:.88;filter:url(#pp-emo-wash)}'
      + '.pp-emo .k{stroke:currentColor;filter:url(#pp-emo-ink)}.pp-emo .k *{fill:none!important}.pp-emo .k .i,.pp-emo .k .i *{fill:currentColor!important}';
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
    return `<svg class="pp-emo" viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><g class="w" transform="translate(.9 1)">${a}</g><g class="k">${a}</g></svg>`;
  };
  window.PPEmojiArt = { svg, list: Object.keys(ART) };
})();
