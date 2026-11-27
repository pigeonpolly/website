// Фоны сцен для рисованной Полли (плоский вектор, толстый контур — как референс v1). 1000×1000.
const OL = '#1d1830';
const pine = (x, y, s, c = '#2f5d4a', d = '#24483a') => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-6" y="0" width="12" height="40" fill="#5a3e2b"/><path d="M0-160l46 70h-20l40 56h-24l44 64h-172l44-64h-24l40-56h-20z" fill="${c}" stroke="${d}" stroke-width="4" stroke-linejoin="round"/><path d="M0-160l-46 70h20l-40 56h24l-44 64h86z" fill="${d}" opacity=".35"/></g>`;
const cloud = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity=".9"><ellipse cx="0" cy="0" rx="60" ry="18"/><ellipse cx="-24" cy="-12" rx="30" ry="20"/><ellipse cx="18" cy="-16" rx="34" ry="22"/></g>`;
const BG = {
  fjord: () => `<rect width="1000" height="1000" fill="#f3ead8"/>${cloud(220, 140, 1.2)}${cloud(760, 110, 1)}
    <path d="M0 560L120 360 200 430 330 250 450 420 560 300 700 470 820 330 1000 520V700H0z" fill="#8fa9bd"/>
    <path d="M330 250l-40 66 26-10 14 24 18-30 22 12zM820 330l-30 50 22-8 10 18 14-24 16 8zM120 360l-30 50 20-6 12 16 14-22z" fill="#fff"/>
    <path d="M0 600q250-40 500 0t500 0V760H0z" fill="#5fa3b5"/><path d="M80 640h180M520 660h220M300 700h140" stroke="#bfe2ea" stroke-width="6" stroke-linecap="round"/>
    <path d="M0 720q300-60 600-10t400-20V1000H0z" fill="#7a9a4a"/><path d="M0 800q300-40 1000-30V1000H0z" fill="#6a8a3e"/>
    ${pine(70, 760, 1.6)}${pine(170, 700, 1.1, '#3d6e55')}${pine(900, 740, 1.7)}${pine(800, 690, 1.05, '#3d6e55')}
    ${[[120, 900], [180, 930], [860, 920], [760, 950], [300, 960]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="12" fill="${i % 2 ? '#3f5aa8' : '#c8323a'}" stroke="${OL}" stroke-width="4"/>`).join('')}`,
};
module.exports = { BG };
