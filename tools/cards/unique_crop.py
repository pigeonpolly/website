# Фото карточек Алины (collectible_card_raw_*.JPEG) → ровная карточка 5:7.
# Находит карточку на листе, выпрямляет перспективу, поворачивает вертикально, стирает старые номера (рамки из ERASE).
# python3 tools/cards/unique_crop.py [имя ...] [--out папка] [--flat] [--debug]  → site/images/cards/<coll>/NN.jpg (список — unique_cards.json)
import sys, os, glob, json
import cv2, numpy as np

W, H = 750, 1050
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def order(p):
    p = p.reshape(4, 2).astype('float32')
    s, d = p.sum(1), np.diff(p, axis=1).ravel()
    return np.array([p[s.argmin()], p[d.argmin()], p[s.argmax()], p[d.argmax()]], 'float32')  # tl tr br bl


def side_lines(cnt, quad):
    # каждая сторона — прямая по точкам контура у этой стороны (без скруглённых углов), углы — пересечения
    pts = cnt.reshape(-1, 2).astype('float32')
    lines = []
    for i in range(4):
        a, b = quad[i], quad[(i + 1) % 4]
        v = b - a; L = np.linalg.norm(v); u = v / L; nrm = np.array([-u[1], u[0]])
        t = (pts - a) @ u; dist = np.abs((pts - a) @ nrm)
        sel = pts[(t > .15 * L) & (t < .85 * L) & (dist < .04 * L)]
        if len(sel) < 5:
            lines.append((a, u)); continue
        vx, vy, x0, y0 = cv2.fitLine(sel, cv2.DIST_HUBER, 0, .01, .01).ravel()
        lines.append((np.array([x0, y0]), np.array([vx, vy])))
    out = []
    for i in range(4):
        (p1, d1), (p2, d2) = lines[i - 1], lines[i]
        A = np.array([d1, -d2]).T
        try:
            s1, _ = np.linalg.solve(A, p2 - p1); out.append(p1 + s1 * d1)
        except np.linalg.LinAlgError:
            out.append(quad[i])
    return np.array(out, 'float32')


def find_card(img):
    h, w = img.shape[:2]
    k = 1000 / max(h, w)
    sm = cv2.resize(img, (int(w * k), int(h * k)))
    hsv = cv2.cvtColor(sm, cv2.COLOR_BGR2HSV)
    A = sm.shape[0] * sm.shape[1]
    best = None
    for edge_lo, edge_hi in ((30, 90), (15, 50), (50, 150)):
        g = cv2.GaussianBlur(cv2.cvtColor(sm, cv2.COLOR_BGR2GRAY), (5, 5), 0)
        e = cv2.dilate(cv2.Canny(g, edge_lo, edge_hi), np.ones((3, 3), np.uint8), 2)
        cs, _ = cv2.findContours(e, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
        for c in cs:
            hull = cv2.convexHull(c)
            a = cv2.contourArea(hull)
            if a < 0.012 * A or a > 0.92 * A:
                continue
            (cx, cy), (rw, rh), ang = cv2.minAreaRect(hull)
            ratio = max(rw, rh) / max(1, min(rw, rh))
            if not 1.2 < ratio < 1.6 or a / (rw * rh) < 0.88:
                continue
            m = np.zeros(sm.shape[:2], np.uint8); cv2.drawContours(m, [hull], -1, 255, -1)
            ms, mv = cv2.mean(hsv, m)[1:3]
            if ms < 22 and mv > 150:  # белый лист, а не карточка
                continue
            if best is None or a > best[0]:
                best = (a, hull, c)
        if best:
            break
    if best is None:
        return None
    hull = best[1]
    peri = cv2.arcLength(hull, True)
    q = None
    for eps in (0.02, 0.03, 0.04, 0.05, 0.06):
        ap = cv2.approxPolyDP(hull, eps * peri, True)
        if len(ap) == 4:
            q = ap; break
    if q is None:
        q = cv2.boxPoints(cv2.minAreaRect(hull))
    q = order(np.array(q))
    q = order(side_lines(hull, q))
    return q / k


def warp(img, quad, inset=0.008):
    tl, tr, br, bl = quad
    wa, wb = np.linalg.norm(tr - tl), np.linalg.norm(br - bl)
    ha, hb = np.linalg.norm(bl - tl), np.linalg.norm(br - tr)
    land = (wa + wb) > (ha + hb)
    dst = np.array([[0, 0], [W, 0], [W, H], [0, H]], 'float32')
    if land:  # горизонтальная — сразу поворачиваем
        dst = np.array([[0, H], [0, 0], [W, 0], [W, H]], 'float32')
    M = cv2.getPerspectiveTransform(quad, dst)
    out = cv2.warpPerspective(img, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    # чуть внутрь, чтобы не было фона в скруглённых углах
    ix, iy = int(W * inset), int(H * inset)
    out = cv2.resize(out[iy:H - iy, ix:W - ix], (W, H), interpolation=cv2.INTER_CUBIC)
    return out, land


def fix_corners(out, r=0.05):
    # скруглённые углы карточки: фон в углах заливаем краской соседней бумаги
    h, w = out.shape[:2]
    R = int(w * r)
    mask = np.zeros((h, w), np.uint8)
    for (cx, cy) in ((R, R), (w - R, R), (R, h - R), (w - R, h - R)):
        corner = np.zeros((h, w), np.uint8)
        x0, y0 = (0 if cx == R else w - R), (0 if cy == R else h - R)
        corner[y0:y0 + R, x0:x0 + R] = 255
        cv2.circle(corner, (cx, cy), R, 0, -1)
        mask |= corner
    return cv2.inpaint(out, mask, 7, cv2.INPAINT_TELEA)


def erase(out, boxes):
    # рамка целиком: плавный цвет с краёв рамки + зернистость бумаги с чистого места рядом (без штрихов)
    g = cv2.cvtColor(out, cv2.COLOR_BGR2GRAY).astype('int16')
    ink = (cv2.medianBlur(g.astype(np.uint8), 31) - g) > 25
    for x0, y0, x1, y1 in boxes:
        X0, Y0, X1, Y1 = int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H)
        bw, bh = X1 - X0, Y1 - Y0
        m = np.zeros(g.shape, np.uint8); m[Y0:Y1, X0:X1] = 255
        m = cv2.dilate(m, np.ones((9, 9), np.uint8))
        # линии рядом (стенки значка, буквы) не тянем внутрь: в полосе вокруг рамки штрихи заменяем медианой
        band = cv2.dilate(m, np.ones((41, 41), np.uint8)) > 0
        ref = np.percentile(g[band], 60)
        dark = cv2.dilate(((g < ref - 30) & band).astype(np.uint8) * 255, np.ones((7, 7), np.uint8))
        low = cv2.GaussianBlur(cv2.inpaint(out, m | dark, 15, cv2.INPAINT_TELEA), (0, 0), 9).astype('float32')
        # донор: такой же кусок рядом с наименьшим числом штрихов
        best = None
        for dy in range(-3 * bh, 3 * bh + 1, max(4, bh // 4)):
            for dx in range(-2 * bw, 2 * bw + 1, max(4, bw // 4)):
                sx, sy = X0 + dx, Y0 + dy
                if (dx, dy) == (0, 0) or sx < 8 or sy < 8 or sx + bw > W - 8 or sy + bh > H - 8:
                    continue
                if abs(dx) < bw and abs(dy) < bh:
                    continue
                k = ink[sy:sy + bh, sx:sx + bw].mean()
                if best is None or k < best[0]:
                    best = (k, sx, sy)
        _, sx, sy = best
        pad = 6
        don = out[max(0, sy - pad):sy + bh + pad, max(0, sx - pad):sx + bw + pad].astype('float32')
        tex = don - cv2.GaussianBlur(don, (0, 0), 9)
        tex = cv2.resize(tex, (bw + 2 * pad, bh + 2 * pad))
        fill = low.copy()
        ys, xs = slice(max(0, Y0 - pad), Y0 - pad + tex.shape[0]), slice(max(0, X0 - pad), X0 - pad + tex.shape[1])
        fill[ys, xs] += tex[:fill[ys, xs].shape[0], :fill[ys, xs].shape[1]]
        soft = cv2.GaussianBlur(m, (0, 0), 3).astype('float32')[..., None] / 255
        out = np.clip(out * (1 - soft) + fill * soft, 0, 255).astype(np.uint8)
    return out


def main():
    args = sys.argv[1:]
    out_dir = os.path.join(ROOT, 'site/images/cards')
    if '--out' in args:
        i = args.index('--out'); out_dir = args[i + 1]; del args[i:i + 2]
    debug = '--debug' in args
    args = [a for a in args if a not in ('--debug', '--flat')]
    cfg = json.load(open(os.path.join(os.path.dirname(__file__), 'unique_cards.json')))
    names = args or [c['raw'] for c in cfg['cards']]
    by = {c['raw']: c for c in cfg['cards']}
    os.makedirs(out_dir, exist_ok=True)
    for name in names:
        c = by.get(name, {'raw': name})
        img = cv2.imread(os.path.join(ROOT, c.get('file') or 'collectible_card_raw_%s.JPEG' % name))
        quad = np.array(c['quad'], 'float32') if c.get('quad') else find_card(img)
        if quad is None:
            print('!! не нашла карточку:', name); continue
        out, land = warp(img, quad)
        if c.get('rot'):
            out = cv2.rotate(out, {90: cv2.ROTATE_90_CLOCKWISE, 180: cv2.ROTATE_180, 270: cv2.ROTATE_90_COUNTERCLOCKWISE}[c['rot']])
            if out.shape[0] != H:
                out = cv2.resize(out, (W, H))
        out = fix_corners(out)
        if c.get('erase'):  # [[x0,y0,x1,y1] в долях] — стираем только тёмные штрихи внутри рамки, акварельный фон остаётся
            out = erase(out, c['erase'])
        sub = os.path.join(out_dir, c['coll']) if c.get('coll') and '--flat' not in sys.argv else out_dir
        os.makedirs(sub, exist_ok=True)
        fn = os.path.join(sub, (('%02d' % c['n']) if c.get('n') else name) + ('.jpg'))
        cv2.imwrite(fn, out, [cv2.IMWRITE_JPEG_QUALITY, 86, cv2.IMWRITE_JPEG_PROGRESSIVE, 1])
        if debug:
            dbg = img.copy(); cv2.polylines(dbg, [quad.astype(int)], True, (0, 0, 255), 12)
            cv2.imwrite(os.path.join(out_dir, name + '_dbg.jpg'), cv2.resize(dbg, None, fx=.3, fy=.3))
        print('ok', name, '→', os.path.basename(fn), 'гориз.' if land else '')


if __name__ == '__main__':
    main()
