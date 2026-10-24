#!/usr/bin/env python3
"""Музыка к ролику «Школа Полли» (tools/video/school.js): весёлый чиптюн, 26 с, 120 ударов в минуту, такт = 2 с.

  python3 tools/video/school_music.py out.wav

Такты — как сцены ролика: 1–2 заставка, 3–5 мольберт, 6–7 клиент (печать на 12.5 с), 8–9 тропинка
(12 печатей по восьмым с 14.25 с — нота вверх по ладу на каждую), 10–11 диплом (сургуч на 19.0 с), 12–13 финал.
Пишет 16-бит стерео WAV; всё сочиняется кодом, без чужих сэмплов.
"""
import sys
import wave

import numpy as np

SR, BPM, END = 44100, 120, 26.0
Q = 60 / BPM          # четверть
E = Q / 2             # восьмая
BAR = 4 * Q
N = int(SR * END)
mix = np.zeros(N)


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def env(n, a=.004, r=.06, hold=1.0):
    t = np.arange(n) / SR
    e = np.minimum(1, t / a) * np.clip((n / SR - t) / r, 0, 1)
    return e * (hold + (1 - hold) * np.exp(-t * 6))


def osc(kind, m, dur, duty=.5, vib=0.0, slide=0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = hz(m) * (1 + vib * np.sin(2 * np.pi * 5.5 * t) * np.clip(t * 4 - .4, 0, 1)) * 2 ** (slide * t / dur / 12)
    ph = np.cumsum(f) / SR % 1
    if kind == 'sq':
        return np.where(ph < duty, 1.0, -1.0)
    if kind == 'tri':
        return 4 * np.abs(ph - .5) - 1
    raise ValueError(kind)


def add(at, sig, vol, pan=0.0):
    i = int(at * SR)
    if i >= N:
        return
    sig = sig[:N - i] * vol
    mix[i:i + len(sig)] += sig


def note(kind, m, at, dur, vol, **o):
    s = osc(kind, m, dur, duty=o.get('duty', .5), vib=o.get('vib', 0), slide=o.get('slide', 0))
    add(at, s * env(len(s), r=o.get('r', .05), hold=o.get('hold', 1.0)), vol)


rng = np.random.default_rng(7)


def noise(at, dur, vol, lp=1.0, decay=30):
    n = int(dur * SR)
    x = rng.uniform(-1, 1, n)
    if lp < 1:  # грубый фильтр — «бочка» и «хлопок» глуше
        k = max(1, int(1 / lp))
        x = np.convolve(x, np.ones(k) / k, 'same')
    add(at, x * np.exp(-np.arange(n) / SR * decay), vol)


def kick(at):
    n = int(.18 * SR)
    t = np.arange(n) / SR
    f = 50 + 110 * np.exp(-t * 30)
    add(at, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 18), .55)


def snare(at):
    noise(at, .16, .22, lp=.5, decay=22)
    note('tri', 50, at, .08, .18, r=.05)


def hat(at, v=.07):
    noise(at, .04, v, decay=90)


# ---------- гармония по тактам ----------
C, G, AM, F = [48, 52, 55], [43, 47, 50], [45, 48, 52], [41, 45, 48]
CHORDS = [C, C, C, G, AM, F, C, G, F, F, G, C, C]

# ---------- мелодия: (такт, восьмая, нота, длина в восьмых) ----------
MEL = []


def bar(b, seq):
    i = 0
    for x in seq:
        if isinstance(x, tuple):
            m, ln = x
        else:
            m, ln = x, 1
        if m is not None:
            MEL.append((b, i, m, ln))
        i += ln


bar(2, [76, 79, (84, 2), 83, 79, 76, 79])                 # мольберт: «круг!»
bar(3, [(74, 2), (79, 2), 83, 81, (79, 2)])
bar(4, [72, 76, (81, 2), 79, 76, 72, 76])
bar(5, [(77, 2), (81, 2), (84, 2), 83, 81])               # клиент
bar(6, [76, 79, (84, 2), 83, 79, (88, 2)])                # печать на 12.5 — высокая нота
bar(7, [(74, 4), (79, 4)])                                # тропинка: мелодия тихо, поверх — печати
bar(8, [(81, 4), (83, 4)])
bar(9, [84, 84, (84, 2), (81, 2), (84, 2)])               # диплом: фанфара
bar(10, [86, 86, (86, 2), (83, 2), (86, 2)])
bar(11, [(88, 6), 86, 84])                                # финал
bar(12, [(84, 8)])

# ---------- сборка ----------
for b, ch in enumerate(CHORDS):
    t0 = b * BAR
    # бас: треугольник, корень и октава по четвертям
    for k in range(4):
        r = ch[0] - 12 + (12 if k % 2 else 0)
        if b == 12 and k:
            break
        note('tri', r, t0 + k * Q, Q * (4 if b == 12 else .9), .32 if b < 12 else .3, r=.04 if b < 12 else .9)
    # арпеджио аккорда шестнадцатыми, узкий квадрат
    if b < 12:
        for k in range(16):
            m = ch[[0, 1, 2, 1][k % 4]] + 24
            note('sq', m, t0 + k * Q / 4, Q / 4 * .9, .045 if b >= 2 else .06, duty=.125, r=.02, hold=.3)
    else:
        for i, m in enumerate(ch + [ch[0] + 12]):
            note('sq', m + 24, t0 + i * .06, 2.0 - i * .06, .05, duty=.25, r=1.2, hold=.6)
    # барабаны
    if b == 0:
        continue
    if b < 12:
        for k in range(4):
            if k % 2 == 0:
                kick(t0 + k * Q)
            elif b >= 2:
                snare(t0 + k * Q)
        if b >= 2:
            for k in range(8):
                hat(t0 + k * E, .08 if k % 2 else .05)
        if b == 1:  # сбивка перед мольбертом
            for k in range(4):
                snare(t0 + 3 * Q + k * Q / 4)
    else:
        kick(t0)
        noise(t0, 1.4, .12, decay=3)  # тарелка

for b, i, m, ln in MEL:
    at = b * BAR + i * E
    soft = b in (7, 8)
    note('sq', m, at, ln * E * .92, .07 if soft else .11, duty=.25, vib=.004 if ln > 1 else 0, r=.05 if b < 12 else 1.2)
    note('sq', m - 12, at, ln * E * .92, .03, duty=.5, r=.05 if b < 12 else 1.2)  # октавой ниже — толще

# ---------- звуки событий (время — из school.js) ----------
# заставка: буквы названия выпрыгивают
for k, at in enumerate([.25, .5, .75]):
    note('sq', 72 + k * 4, at, .12, .08, duty=.25, slide=12)
# мольберт: «карандаш» — шорох во время круга, «блинк» деталей
for k in range(26):
    noise(4.3 + k * .05, .03, .025, decay=60)
for at in (6.0, 6.5, 7.5, 8.0):
    note('sq', 91, at, .08, .05, duty=.125)
# лист стёрт
noise(7.0, .35, .06, decay=8)
# клиент: карточка выезжает
note('sq', 67, 10.1, .3, .05, duty=.5, slide=12)
# печать на листок
kick(12.5)
noise(12.5, .2, .2, lp=.3, decay=20)
# тропинка: 12 печатей — нота вверх по ладу до мажор
SCALE = [72, 74, 76, 77, 79, 81, 83, 84, 86, 88, 89, 91]
for i, m in enumerate(SCALE):
    note('sq', m, 14.25 + i * .25, .12, .08, duty=.25)
    note('sq', m + 12, 14.25 + i * .25 + .03, .08, .03, duty=.125)
# диплом: светится в конце тропинки
for k, m in enumerate([84, 88, 91, 96]):
    note('sq', m, 17.1 + k * .05, .25, .04, duty=.125, r=.2)
# свиток разворачивается, сургуч
noise(18.0, .6, .05, decay=4)
kick(19.0)
noise(19.0, .25, .25, lp=.25, decay=14)
for k, m in enumerate([84, 88, 91, 96, 100]):
    note('sq', m, 19.05 + k * .07, .3, .045, duty=.125, r=.25)
# кнопка «Start lesson 1»
note('sq', 79, 22.9, .1, .06, duty=.25)
note('sq', 84, 23.0, .25, .06, duty=.25, r=.2)

# ---------- конец: затухание, нормировка, стерео с лёгким эхом ----------
fade = np.ones(N)
fn = int(1.2 * SR)
fade[-fn:] = np.linspace(1, 0, fn) ** 2
mix *= fade
mix /= np.max(np.abs(mix)) / .89
d = int(.18 * SR)
L, Rr = mix.copy(), mix.copy()
L[d:] += mix[:-d] * .18
Rr[int(d * 1.4):] += mix[:-int(d * 1.4)] * .18
st = np.stack([L, Rr], 1)
st /= np.max(np.abs(st)) / .89
pcm = (st * 32767).astype('<i2')
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'school.wav', 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
