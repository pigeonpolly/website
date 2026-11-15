#!/usr/bin/env python3
"""Иллюстрации «Norsk med Polly» (svg): Полли в стиле цифровых работ Алины — синий голубь,
сонный жёлтый глаз, оранжевый клюв, берет; чайка Mia. python3 art.py → scene-u0.svg, scene-u1.svg, polly-head.svg"""
import os
D = os.path.dirname(os.path.abspath(__file__))
LINE = '#1f2442'

def polly(x, y, s=1, flip=False, wave=False):
    sx = -s if flip else s
    wing = ('<path d="M30 -96 C50 -86 58 -66 62 -50 C56 -48 48 -54 40 -62 C38 -40 30 -22 18 -12 C22 -36 22 -64 14 -88 C18 -96 24 -98 30 -96Z" fill="#23427a"/>'
            if wave else
            '<path d="M30 -98 C46 -82 46 -42 30 -16 C24 -8 14 -6 8 -10 C20 -32 22 -62 14 -88 C18 -96 24 -100 30 -98Z" fill="#23427a"/>'
            '<path d="M10 -12 l-2 8 M17 -12 l1 8 M24 -16 l4 7" stroke="#c9d3e3" stroke-width="2"/>')
    return f'''<g transform="translate({x} {y}) scale({sx} {s})" stroke="{LINE}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
 <ellipse cx="0" cy="9" rx="34" ry="5" fill="#000" opacity=".08" stroke="none"/>
 <path d="M-12 -4 L-14 8 M-14 8 l-8 1 M-14 8 l-3 5 M-14 8 l6 2 M10 -4 L11 8 M11 8 l-8 1 M11 8 l-2 5 M11 8 l7 2" stroke="#e8892c" stroke-width="2.6" fill="none"/>
 <path d="M2 -160 C-24 -160 -36 -136 -38 -108 C-40 -88 -48 -70 -46 -48 C-44 -20 -30 -4 -4 -2 C20 0 36 -14 38 -44 C40 -80 36 -120 28 -142 C22 -154 14 -160 2 -160Z" fill="#2f55a0"/>
 <path d="M28 -142 C36 -120 40 -80 38 -44 C36 -14 20 0 -4 -2 C14 -12 24 -40 24 -80 C24 -110 22 -130 28 -142Z" fill="#26478a" stroke="none"/>
 <path d="M-29 -122 C-31 -110 -32 -100 -33 -92" stroke="#5f86c8" stroke-width="4" fill="none"/>
 <path d="M-40 -84 C-38 -70 -36 -60 -38 -50" stroke="#4a73b9" stroke-width="3" fill="none"/>
 {wing}
 <path d="M-35 -123 L-57 -114 L-34 -110 C-32 -114 -32 -119 -35 -123Z" fill="#f2a33a"/>
 <path d="M-56 -114 L-34 -112" stroke-width="1.4"/>
 <ellipse cx="-32" cy="-124" rx="5" ry="3" fill="#e6e1d8" stroke-width="1.6"/>
 <ellipse cx="-12" cy="-127" rx="11" ry="12" fill="#f6c445"/>
 <ellipse cx="-17" cy="-124" rx="3.6" ry="6.4" fill="{LINE}" stroke="none"/>
 <circle cx="-18.5" cy="-127" r="1.4" fill="#fff" stroke="none"/>
 <path d="M-22.4 -131 A11.5 12.5 0 0 1 -1.6 -131 Q-12 -126.5 -22.4 -131Z" fill="#284a8e"/>
 <path d="M-23 -131 Q-12 -126 -1 -131" fill="none" stroke-width="2.4"/>
 <path d="M-23 -131 l-4 -2 M-22 -129 l-4 1" stroke-width="1.6"/>
 <ellipse cx="6" cy="-160" rx="27" ry="9" fill="#b8324f" transform="rotate(-8 6 -160)"/>
 <path d="M4 -168 q2 -8 9 -8" fill="none"/>
</g>'''

def gull(x, y, s=1, flip=False):
    sx = -s if flip else s
    return f'''<g transform="translate({x} {y}) scale({sx} {s})" stroke="{LINE}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
 <ellipse cx="0" cy="9" rx="40" ry="5" fill="#000" opacity=".08" stroke="none"/>
 <path d="M-6 -14 L-7 8 M-7 8 l-7 1 M-7 8 l6 1 M12 -14 L13 8 M13 8 l-7 1 M13 8 l6 1" stroke="#e79a72" stroke-width="2.6" fill="none"/>
 <path d="M-40 -44 L-66 -52 L-60 -34 L-40 -32Z" fill="#fff"/>
 <path d="M-40 -40 C-40 -62 -10 -70 16 -66 C26 -76 30 -92 44 -94 C60 -96 66 -84 62 -74 C58 -64 46 -56 44 -42 C44 -22 24 -12 0 -12 C-24 -12 -40 -22 -40 -40Z" fill="#fff"/>
 <path d="M-34 -50 C-12 -62 18 -60 30 -48 C22 -32 -8 -26 -44 -38Z" fill="#b6c1cc"/>
 <path d="M-44 -38 L-70 -44 L-56 -30Z" fill="#30323d"/>
 <circle cx="-58" cy="-38" r="1.8" fill="#fff" stroke="none"/>
 <path d="M-20 -46 C-8 -50 6 -50 16 -46" fill="none" stroke="#97a4b2" stroke-width="1.6"/>
 <path d="M60 -82 L82 -78 L78 -73 L60 -74Z" fill="#f3c33c"/>
 <circle cx="76" cy="-75.5" r="2" fill="#d8453c" stroke="none"/>
 <circle cx="50" cy="-84" r="3" fill="{LINE}" stroke="none"/>
 <circle cx="49" cy="-85" r="1" fill="#fff" stroke="none"/>
 <path d="M44 -90 q6 -3 11 0" fill="none" stroke-width="1.8"/>
</g>'''

def waffle(x, y, s=1):
    return f'''<g transform="translate({x} {y}) scale({s})" stroke="{LINE}" stroke-width="1.8" stroke-linejoin="round">
 <path d="M0 6 C-4 -2 -16 -2 -16 -10 C-16 -18 -6 -20 0 -13 C6 -20 16 -18 16 -10 C16 -2 4 -2 0 6Z" fill="#e9b45f"/>
 <path d="M-10 -12 l8 8 M-4 -16 l10 10 M-12 -6 l6 6 M6 -14 l-10 10 M12 -12 l-12 12" stroke="#c98a35" stroke-width="1.2"/>
</g>'''

def u1():
    trees = ''.join(f'<path d="M{x} 168 l{w} -{h} l{w} {h}z" fill="#7f9c8e"/>' for x, w, h in
                    [(40, 7, 24), (52, 6, 18), (250, 8, 28), (266, 6, 19), (430, 7, 22), (444, 6, 17), (520, 8, 27)])
    slats = ''.join(f'<path d="M{x} 0 Q{x+4} 22 {x+8} 40" stroke="#c39d6a" stroke-width="1.2" fill="none"/>' for x in range(-10, 610, 14))
    return f'''<svg preserveAspectRatio="xMidYMid slice" viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" aria-label="Pollijs un kaija Mia Oslo lidostā pie vafeļu kioska">
<defs><linearGradient id="u1sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd5e8"/><stop offset="1" stop-color="#eef2ee"/></linearGradient>
<linearGradient id="u1fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2c79e"/><stop offset="1" stop-color="#efdcbc"/></linearGradient></defs>
<rect width="600" height="260" fill="#f3ece0"/>
<rect x="0" y="44" width="600" height="128" fill="url(#u1sky)"/>
<ellipse cx="140" cy="76" rx="44" ry="8" fill="#fff" opacity=".75"/><ellipse cx="470" cy="70" rx="56" ry="9" fill="#fff" opacity=".7"/>
<path d="M0 150 C70 128 120 134 180 122 C240 110 300 128 360 118 C420 108 480 126 540 116 C570 112 590 116 600 116 V172 H0Z" fill="#a9c0cf"/>
<path d="M0 160 C90 148 200 156 300 150 C400 144 500 154 600 146 V172 H0Z" fill="#94b2a5"/>
{trees}
<g transform="translate(400 84) rotate(-10)" fill="#fff" stroke="#7d8da0" stroke-width="1.2" stroke-linejoin="round">
 <path d="M0 10 C10 4 70 3 92 6 C100 7 104 10 100 13 C90 16 20 17 4 15Z"/><path d="M40 9 L62 -14 L70 -14 L58 9Z"/><path d="M84 7 L94 -6 L99 -6 L96 8Z"/>
 <path d="M14 9 h50" stroke-dasharray="2 4"/></g>
<g stroke="#b99a70" stroke-width="4"><line x1="0" y1="172" x2="600" y2="172"/><line x1="150" y1="44" x2="150" y2="172"/><line x1="300" y1="44" x2="300" y2="172"/><line x1="450" y1="44" x2="450" y2="172"/></g>
<path d="M0 0 H600 V40 C450 54 150 54 0 40Z" fill="#dcbd8e"/>
{slats}
<path d="M0 40 C150 54 450 54 600 40" stroke="#a9834f" stroke-width="2.5" fill="none"/>
<g transform="translate(318 56)"><path d="M18 -8 v8 M118 -8 v8" stroke="#8b7a64" stroke-width="1.5"/>
 <rect width="136" height="32" rx="4" fill="#2f3c58"/>
 <text x="10" y="13" font-family="DM Sans,sans-serif" font-size="8.5" fill="#f2d48a" letter-spacing="1">ANKOMST · ARRIVALS</text>
 <text x="10" y="25" font-family="DM Sans,sans-serif" font-size="8.5" fill="#fff">RIGA  RIX      LANDET ✓</text></g>
<rect x="0" y="172" width="600" height="88" fill="url(#u1fl)"/>
<g stroke="#d6b88a" stroke-width="1"><line x1="0" y1="196" x2="600" y2="196"/><line x1="0" y1="226" x2="600" y2="226"/>
 <line x1="80" y1="172" x2="70" y2="196"/><line x1="260" y1="196" x2="252" y2="226"/><line x1="420" y1="172" x2="414" y2="196"/><line x1="520" y1="226" x2="512" y2="260"/></g>
<!-- vafeļu kiosks -->
<g stroke="{LINE}" stroke-width="2" stroke-linejoin="round">
 <rect x="40" y="150" width="150" height="74" rx="4" fill="#c8323c"/>
 <path d="M40 166 h150" stroke="#fff" stroke-width="3"/>
 <rect x="34" y="144" width="162" height="10" rx="3" fill="#f6efe2"/>
 <path d="M48 98 h134 v20 l-8 6 -8 -6 -8 6 -8 -6 -8 6 -8 -6 -8 6 -8 -6 -8 6 -8 -6 -8 6 -8 -6 -8 6 -8 -6 -8 6 -8 -6 -6 4Z" fill="#fff"/>
 <path d="M48 98 h134" stroke-width="2"/>
 <path d="M60 98 v20 M84 98 v20 M108 98 v20 M132 98 v20 M156 98 v20" stroke="#c8323c" stroke-width="10" opacity=".85"/>
 <line x1="50" y1="124" x2="50" y2="144"/><line x1="180" y1="124" x2="180" y2="144"/>
 <rect x="70" y="182" width="90" height="26" rx="13" fill="#f6efe2"/>
</g>
<text x="115" y="200" text-anchor="middle" font-family="DM Serif Display,serif" font-size="15" fill="#c8323c">Vafler</text>
{waffle(70, 140, .8)}{waffle(92, 141, .7)}
{gull(150, 144, .62)}

<!-- čemodāns -->
<g transform="translate(410 192)" stroke="{LINE}" stroke-width="2" stroke-linejoin="round">
 <path d="M12 0 V-10 H28 V0" fill="none"/>
 <rect x="0" y="0" width="42" height="50" rx="6" fill="#e1a85a"/>
 <path d="M10 0 v50 M32 0 v50" stroke="#b97c33"/>
 <circle cx="9" cy="53" r="3" fill="{LINE}"/><circle cx="33" cy="53" r="3" fill="{LINE}"/>
 <rect x="13" y="16" width="16" height="10" fill="#9e3039" stroke-width="1"/><rect x="13" y="19.5" width="16" height="3" fill="#fff" stroke="none"/>
 <g transform="translate(34 6) rotate(14)"><rect width="22" height="13" rx="2" fill="#fff" stroke-width="1.2"/>
 <text x="3" y="9.5" font-family="DM Sans,sans-serif" font-size="7" font-weight="700" fill="#c8323c" stroke="none">RIX</text></g>
</g>
{polly(370, 242, .78)}
<!-- augs -->
<g stroke="{LINE}" stroke-width="2" stroke-linejoin="round">
 <path d="M540 150 C520 120 530 100 548 92 C552 112 552 130 548 150Z" fill="#6f9a76"/>
 <path d="M552 150 C560 116 580 104 592 104 C588 126 572 142 556 152Z" fill="#7fae86"/>
 <path d="M545 152 C536 136 518 132 506 136 C514 150 530 156 545 156Z" fill="#5f8a68"/>
 <path d="M528 154 h44 l-6 46 h-32Z" fill="#e8ddcb"/>
</g>
</svg>'''

def u0():
    no = open(os.path.join(D, 'no-mini.txt')).read()
    paper = ''.join(f'<path d="M{x} {y} c-2 -3 -6 -1 -4 2 l4 4 l4 -4 c2 -3 -2 -5 -4 -2z" fill="#e6c9c1" stroke="none"/>'
                    for x in range(250, 600, 44) for y in range(22, 160, 40))
    return f'''<svg preserveAspectRatio="xMidYMid slice" viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" aria-label="Pollijs Rīgā mācās norvēģu burtus">
<defs><linearGradient id="u0sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2c9a6"/><stop offset="1" stop-color="#f7e6cf"/></linearGradient></defs>
<rect width="600" height="260" fill="#f4e9da"/>
{paper}
<!-- logs uz Rīgu -->
<g stroke="{LINE}" stroke-width="2" stroke-linejoin="round">
 <rect x="26" y="26" width="190" height="150" fill="url(#u0sky)"/>
 <circle cx="170" cy="70" r="14" fill="#f8dc8c" stroke="none"/>
 <path d="M26 176 V130 h20 v-10 h14 v10 h12 V112 l6 -10 l6 10 V176Z" fill="#9b8aa6" stroke-width="1.4"/>
 <path d="M90 176 V122 h8 V96 l4 -6 V70 l3 -30 l3 30 V90 l4 6 V122 h8 V176Z" fill="#7b6a8c" stroke-width="1.4"/>
 <path d="M126 176 V128 l14 -14 l14 14 V176Z" fill="#a698b0" stroke-width="1.4"/>
 <path d="M154 176 V118 h10 V100 l6 -8 l6 8 V118 h10 V176Z" fill="#8e7ea0" stroke-width="1.4"/>
 <path d="M186 176 V136 l15 -10 l15 10 V176Z" fill="#b2a5bb" stroke-width="1.4"/>
 <path d="M121 26 V176 M26 101 H216" stroke="#fff" stroke-width="6"/>
 <rect x="26" y="26" width="190" height="150" fill="none" stroke="#fff" stroke-width="8"/>
 <rect x="22" y="22" width="198" height="158" fill="none"/>
 <path d="M14 14 C40 40 30 120 50 190 H10 V14Z" fill="#c8323c" opacity=".9"/>
 <path d="M228 14 C204 40 214 120 196 190 H232 V14Z" fill="#c8323c" opacity=".9"/>
 <rect x="8" y="8" width="228" height="8" rx="4" fill="#8b6a46"/>
</g>
<!-- Norvēģijas karte pie sienas -->
<g transform="translate(470 22) rotate(3)">
 <rect x="0" y="0" width="94" height="112" fill="#fbf7f0" stroke="{LINE}" stroke-width="2"/>
 <g transform="translate(12 12)"><path d="{no}" fill="#bcd3dc" stroke="#5f7f8c" stroke-width=".6"/>
 <circle cx="29.7" cy="73.5" r="3.2" fill="#c8323c" stroke="{LINE}" stroke-width="1"/></g>
 <circle cx="47" cy="4" r="4" fill="#c8323c" stroke="{LINE}" stroke-width="1.5"/>
</g>
<!-- grīda, galds -->
<rect y="196" width="600" height="64" fill="#d9b88c"/>
<g stroke="#c49f6f"><line x1="0" y1="220" x2="600" y2="220"/><line x1="0" y1="242" x2="600" y2="242"/><line x1="120" y1="196" x2="112" y2="220"/><line x1="380" y1="220" x2="372" y2="242"/></g>
<g stroke="{LINE}" stroke-width="2" stroke-linejoin="round">
 <rect x="300" y="150" width="270" height="12" rx="3" fill="#a8774a"/>
 <path d="M312 162 v80 M558 162 v80" stroke-width="6" stroke="#8b5f37"/>
 <path d="M318 152 L328 132 Q342 128 357 136 L357 154 Q340 148 318 152Z" fill="#fff"/>
 <path d="M396 152 L386 132 Q372 128 357 136 L357 154 Q374 148 396 152Z" fill="#fbf7f0"/>
 <path d="M330 140 h16 M328 145 h18" stroke="#b9b3a8" stroke-width="1.2"/>
 <rect x="410" y="120" width="26" height="30" rx="4" fill="#9fc2b8"/>
 <path d="M436 128 q10 2 0 12" fill="none"/>
 <path d="M418 112 q4 -6 0 -12 M428 112 q4 -6 0 -12" stroke="#b9a58c" stroke-width="1.6" fill="none"/>
 <rect x="460" y="128" width="16" height="22" fill="#c8323c"/>
 <path d="M464 128 l-4 -18 M470 128 l3 -20 M474 128 l8 -14" stroke-width="1.6"/>
</g>
<text x="361" y="146" font-family="DM Serif Display,serif" font-size="9.5" fill="#c8323c">Æ Ø Å</text>
<!-- čemodāns -->
<g transform="translate(150 186)" stroke="{LINE}" stroke-width="2" stroke-linejoin="round">
 <rect x="0" y="0" width="70" height="46" rx="6" fill="#e1a85a"/>
 <path d="M24 0 V-8 H46 V0" fill="none"/>
 <path d="M0 16 h70" stroke="#b97c33"/>
 <g transform="translate(46 22) rotate(-8)"><rect width="26" height="14" rx="2" fill="#fff" stroke-width="1.2"/>
 <text x="3" y="10" font-family="DM Sans,sans-serif" font-size="7.5" font-weight="700" fill="#2f55a0" stroke="none">OSLO</text></g>
</g>
{polly(270, 238, .82, flip=True, wave=True)}
</svg>'''

def head():
    return f'''<svg viewBox="-64 -184 108 108" xmlns="http://www.w3.org/2000/svg" aria-label="Pollijs">
<circle cx="-10" cy="-130" r="54" fill="#e8eef6"/>
<clipPath id="hc"><circle cx="-10" cy="-130" r="54"/></clipPath>
<g clip-path="url(#hc)">{polly(4, 0, 1)}</g>
</svg>'''

for name, fn in [('scene-u0.svg', u0), ('scene-u1.svg', u1), ('polly-head.svg', head)]:
    open(os.path.join(D, name), 'w').write(fn())
print('ok')
