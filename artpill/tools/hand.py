"""ArtPill hand: strokes in, ink-and-watercolour sheet out.

    from hand import Sheet
    s = Sheet(800, 600, seed=1)
    s.ink([(100, 100), (180, 140), (260, 120)], speed=0.7)   # speed 0 slow/wobbly .. 1 fast/clean
    s.wash([(90, 90), (300, 80), (280, 200), (100, 210)], "#d9a441")
    s.save("out/01")        # writes out/01.svg and out/01.png

Coordinates are pixels. Nothing can be erased: there is no delete.
"""
import math
import os
import random
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))


def _catmull(pts, n=10):
    """Smooth path through pts, n samples per segment."""
    if len(pts) < 3:
        (x0, y0), (x1, y1) = pts[0], pts[-1]
        k = max(2, int(math.dist(pts[0], pts[-1]) / 4))
        return [(x0 + (x1 - x0) * i / k, y0 + (y1 - y0) * i / k) for i in range(k + 1)]
    p = [pts[0]] + list(pts) + [pts[-1]]
    out = []
    for i in range(1, len(p) - 2):
        p0, p1, p2, p3 = p[i - 1], p[i], p[i + 1], p[i + 2]
        seg = max(n, int(math.dist(p1, p2) / 3))
        for j in range(seg):
            t = j / seg
            t2, t3 = t * t, t * t * t
            out.append(tuple(0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * t
                                    + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2
                                    + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3) for k in (0, 1)))
    out.append(pts[-1])
    return out


class Sheet:
    def __init__(self, w=800, h=600, seed=0, paper="#fbf8f1"):
        self.w, self.h, self.paper = w, h, paper
        self.r = random.Random(seed)
        self.layers = []  # drawn in order; washes go under later ink naturally

    # -- ink -------------------------------------------------------------
    def ink(self, pts, speed=0.5, width=1.8, color="#26221f", passes=1, tokens=False):
        """A pen line through pts. Slow lines wobble and are heavier; fast lines taper.
        tokens=True breaks the line into short pieces with small gaps."""
        for k in range(passes):
            wob = (1 - speed) * 1.6 + 0.3 + k * 0.8
            jit = [(x + self.r.gauss(0, wob), y + self.r.gauss(0, wob)) for x, y in pts]
            line = _catmull(jit)
            # low-frequency tremor along the line
            ph, fr = self.r.random() * 6.28, self.r.uniform(0.02, 0.06)
            amp = (1 - speed) * 1.2
            n = len(line)
            left, right = [], []
            for i, (x, y) in enumerate(line):
                a, b = line[max(i - 1, 0)], line[min(i + 1, n - 1)]
                dx, dy = b[0] - a[0], b[1] - a[1]
                L = math.hypot(dx, dy) or 1
                nx, ny = -dy / L, dx / L
                t = i / max(n - 1, 1)
                taper = min(1, (t / 0.12) if t < 0.12 else ((1 - t) / 0.18 if t > 0.82 else 1)) if speed > 0.4 else 1
                w = width * (1.25 - 0.5 * speed) * (0.35 + 0.65 * taper) * (1 + 0.18 * math.sin(i * 0.3 + ph))
                w *= (0.7 if k else 1)
                off = amp * math.sin(i * fr * 6 + ph)
                cx, cy = x + nx * off, y + ny * off
                left.append((cx + nx * w / 2, cy + ny * w / 2))
                right.append((cx - nx * w / 2, cy - ny * w / 2))
            cuts = [(0, n)]
            if tokens:
                cuts, i = [], 0
                while i < n - 1:
                    j = i
                    seg = self.r.uniform(7, 20)
                    while j < n - 1 and math.dist(line[i], line[j]) < seg:
                        j += 1
                    cuts.append((i, j + 1))
                    gap = self.r.uniform(2.5, 5)
                    i = j
                    while i < n - 1 and math.dist(line[j], line[i]) < gap:
                        i += 1
            for a, b in cuts:
                if b - a < 2:
                    continue
                poly = left[a:b] + right[a:b][::-1]
                d = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in poly) + "Z"
                self.layers.append(f'<path d="{d}" fill="{color}" opacity="{0.92 if not k else 0.6}" filter="url(#inkf)"/>')

    def hatch(self, x0, y0, x1, y1, angle=-35, gap=7, speed=0.8, width=1.1):
        """Quick hatching inside a box, a hand doing it: uneven gaps and lengths."""
        a = math.radians(angle)
        dx, dy = math.cos(a), math.sin(a)
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        R = math.hypot(x1 - x0, y1 - y0) / 2
        o = -R
        while o < R:
            px, py = cx - dy * o, cy + dx * o
            L = R * self.r.uniform(0.6, 1.0)
            p1 = (max(x0, min(x1, px - dx * L)), max(y0, min(y1, py - dy * L)))
            p2 = (max(x0, min(x1, px + dx * L)), max(y0, min(y1, py + dy * L)))
            if math.dist(p1, p2) > 6:
                self.ink([p1, p2], speed=speed, width=width)
            o += gap * self.r.uniform(0.7, 1.4)

    # -- watercolour -------------------------------------------------------
    def wash(self, pts, color, alpha=0.45, wet=1.0):
        """A loose watercolour wash over the polygon pts. It doesn't obey the edge."""
        ring = _catmull([(x + self.r.gauss(0, 4 * wet), y + self.r.gauss(0, 4 * wet)) for x, y in pts] + [pts[0]], n=6)
        d = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in ring) + "Z"
        fid = f"w{len(self.layers)}"
        seed = self.r.randint(1, 999)
        self.layers.append(
            f'<filter id="{fid}" x="-20%" y="-20%" width="140%" height="140%">'
            f'<feTurbulence type="fractalNoise" baseFrequency="{0.02 * wet:.3f}" numOctaves="3" seed="{seed}"/>'
            f'<feDisplacementMap in="SourceGraphic" scale="{14 * wet:.0f}"/>'
            f'<feGaussianBlur stdDeviation="0.7"/></filter>'
            f'<g style="mix-blend-mode:multiply" filter="url(#{fid})">'
            f'<path d="{d}" fill="{color}" opacity="{alpha}" filter="url(#gran)"/>'
            f'<path d="{self._pool(ring)}" fill="{color}" opacity="{alpha * 0.55:.2f}"/>'
            f'<path d="{d}" fill="none" stroke="{color}" stroke-width="2.2" opacity="{alpha * 0.9:.2f}"/></g>')

    def _pool(self, ring):
        """Pigment settles toward one side: the ring shrunk toward a random point."""
        cx = sum(p[0] for p in ring) / len(ring)
        cy = sum(p[1] for p in ring) / len(ring)
        a = self.r.random() * 6.283
        R = max(math.dist((cx, cy), p) for p in ring)
        px, py = cx + math.cos(a) * R * 0.5, cy + math.sin(a) * R * 0.5
        k = self.r.uniform(0.35, 0.6)
        return "M" + " L".join(f"{px + (x - px) * k:.1f},{py + (y - py) * k:.1f}" for x, y in ring) + "Z"

    def blot(self, x, y, r, color, alpha=0.5):
        pts = [(x + math.cos(a) * r * self.r.uniform(0.6, 1.2), y + math.sin(a) * r * self.r.uniform(0.6, 1.2))
               for a in [i * 6.283 / 9 for i in range(9)]]
        self.wash(pts, color, alpha, wet=1.3)

    # -- output -----------------------------------------------------------
    def svg(self):
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}">'
                '<defs>'
                '<filter id="paper"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/>'
                '<feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0 0.33  0 0 0 0.07 0"/></filter>'
                '<filter id="inkf"><feTurbulence type="fractalNoise" baseFrequency="0.8" seed="7"/>'
                '<feDisplacementMap in="SourceGraphic" scale="1.3"/></filter>'
                '<filter id="gran"><feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="2" seed="11" result="n"/>'
                '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 1.15" result="m"/>'
                '<feComposite in="SourceGraphic" in2="m" operator="in"/></filter>'
                '</defs>'
                f'<rect width="100%" height="100%" fill="{self.paper}"/>'
                '<rect width="100%" height="100%" filter="url(#paper)"/>'
                + "".join(self.layers) + "</svg>")

    def save(self, path):
        os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
        with open(path + ".svg", "w") as f:
            f.write(self.svg())
        subprocess.run(["node", os.path.join(HERE, "render.js"), path + ".svg", path + ".png"], check=True)
        return path + ".png"
