#!/usr/bin/env python3
"""Из site/assets/style.css — только стили кнопок шапки (вход, меню аватара, колокольчик и конвертик, корзина, пуговки, поиск, вылупление, тосты)
→ site/assets/v2-acct.css для новых страниц (src/layout-v2.html), чтобы шапка была как на остальных. Запускать после правок этих стилей в style.css."""
import re, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
css = (R / "site/assets/style.css").read_text().lstrip("﻿")
css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
KEY = re.compile(r"\.(acct|bell|hd-btns|hd-cart|search|nw-|sal-|fn-|hh-|hatch|pill-btn|pill-fill|pp-toast|pp-pin|pd-|day-card)|#(acct|pp-bell|hd-)")

def blocks(s):
    i, out = 0, []
    while i < len(s):
        j = s.find("{", i)
        if j < 0: break
        head, d, k = s[i:j].strip(), 1, j + 1
        while d and k < len(s):
            d += {"{": 1, "}": -1}.get(s[k], 0); k += 1
        out.append((head, s[j + 1:k - 1])); i = k
    return out

def keep_rule(head):
    sels = [x.strip() for x in head.split(",") if x.strip()]
    return sels and all(KEY.search(x) for x in sels)

out, frames = [], set()
def walk(items, wrap=None):
    for head, body in items:
        if head.startswith("@media") or head.startswith("@supports"):
            inner = []
            for h, b in blocks(body):
                if keep_rule(h): inner.append(f"{h}{{{b.strip()}}}")
            if inner: out.append(f"{head}{{\n" + "\n".join(inner) + "\n}")
        elif head.startswith("@keyframes"):
            out.append(("kf", head.split()[1], f"{head}{{{body.strip()}}}"))
        elif not head.startswith("@") and keep_rule(head):
            out.append(f"{head}{{{body.strip()}}}")
walk(blocks(css))
text = "\n".join(x for x in out if isinstance(x, str))
names = {n for n in re.findall(r"animation(?:-name)?\s*:\s*([^;}]+)", text) for n in re.findall(r"[a-zA-Z_][\w-]*", n)}
kf = [x[2] for x in out if not isinstance(x, str) and x[1] in names]
root = ":root{--text:#F6F4F3;--muted:#E6E2DF;--peach:var(--pp-acc,#F0A987);--orange:#D85A30;--star:#E9A93B;--dot:#F5C4B3;--serif:'Fraunces',Georgia,serif;--sans:'Karla',system-ui,sans-serif;--bg-2:var(--pp-2,#534AB7);--bg-card:var(--pp-card,#36235F);--header-h:73px;--sb:0px}"
(R / "site/assets/v2-acct.css").write_text("/* собрано tools/v2_acct_css.py из style.css — руками не править */\n" + root + "\n" + text + "\n" + "\n".join(kf) + "\n")
print(len(text) // 1024, "KB,", text.count("{"), "rules")
