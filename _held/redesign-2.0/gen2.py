# Макеты продажи артов: товар, мои заказы, кабинет (не часть сайта)
from gen import page, hd, FT, I

MENU = '''<div class="pm"><div class="pmh"><img src="%scards/classic/11.jpg"><div><b>polly_fan</b><span>🔘 240</span></div></div>
<a>🐦 My bird</a><a class="hl">📦 My orders <i>1</i></a><a>📘 Textbook</a><a>🇬🇧 English course</a><a>⚙ Settings</a><a>↩ Log out</a></div>''' % I
MENU_CSS = '''.hd-r .av{width:34px;height:34px;border-radius:50%;object-fit:cover;box-shadow:0 0 0 2px var(--orange)}
.pm{position:absolute;right:40px;top:70px;width:230px;background:#fff;border:1px solid var(--line);border-radius:10px;box-shadow:0 16px 34px rgba(60,40,20,.2);padding:8px;z-index:9}
.pmh{display:flex;gap:10px;align-items:center;padding:8px;border-bottom:1px solid var(--line);margin-bottom:6px}.pmh img{width:38px;height:38px;border-radius:50%;object-fit:cover}.pmh b{font:600 16px Fraunces;display:block}.pmh span{font-size:12px;color:var(--ink2)}
.pm a{display:flex;justify-content:space-between;padding:8px 10px;border-radius:6px;font-size:14px}.pm a.hl{background:var(--paper);font-weight:700}.pm a i{font-style:normal;background:var(--orange);color:#fff;border-radius:999px;padding:0 7px;font-size:12px}
.wrapr{position:relative}
@media(max-width:700px){.pm{display:none}}'''

def hd_user(on=''):
    return hd(on).replace('<span class="burger">☰</span>', '<img class="av" src="%scards/classic/11.jpg"><span class="burger">☰</span>' % I)

# ---------- PRODUCT ----------
pr_css = MENU_CSS + '''
.bc{font-size:13px;color:var(--ink2);padding:22px 0}
.pp{display:grid;grid-template-columns:1.1fr 1fr;gap:56px;padding-bottom:70px}
.gal .main{background:#fff;padding:16px;box-shadow:0 16px 34px rgba(60,40,20,.16)}.gal .main img{width:100%}
.thumbs{display:flex;gap:10px;margin-top:14px}.thumbs img{width:84px;height:84px;object-fit:cover;border:1px solid var(--line)}.thumbs img.on{outline:2px solid var(--orange)}
.pp h1{font-size:50px}.pp .by{font:italic 17px Fraunces;color:var(--ink2);margin:6px 0 18px}
.pp .desc{color:var(--ink2);margin-bottom:22px}
.opt{display:grid;gap:10px;margin-bottom:20px}
.o{display:flex;justify-content:space-between;align-items:center;border:1.5px solid var(--line);border-radius:10px;padding:14px 16px;background:var(--card)}
.o.on{border-color:var(--ink);background:#fff}.o b{font:600 17px Fraunces}.o span{font-size:13px;color:var(--ink2);display:block}.o .p{font:700 18px Karla}
.o.sold{opacity:.5}.o.sold .p{font-size:13px}
.buy{background:#fff;border:1px solid var(--line);border-radius:12px;padding:20px;margin-top:6px}
.buy label{font-size:13px;color:var(--ink2);display:block;margin:0 0 6px}
.buy .in{border:1.5px solid var(--line);border-radius:8px;padding:11px 14px;font-size:15px;margin-bottom:12px;background:var(--paper)}
.buy .btn{width:100%;justify-content:center}
.how{display:flex;gap:8px;margin-top:14px;font-size:12px;color:var(--ink2);flex-wrap:wrap}.how span{background:var(--paper2);padding:4px 10px;border-radius:999px}
.guest{margin-top:16px;border:1.5px dashed var(--orange);border-radius:12px;padding:16px;font-size:14px}.guest b{font:600 16px Fraunces;display:block;margin-bottom:4px}
@media(max-width:700px){.pp{grid-template-columns:1fr;gap:24px}.pp h1{font-size:34px}.thumbs img{width:60px;height:60px}}
'''
page('product', 'Night Garden', pr_css, hd_user('shop') + MENU + '''<div class="wrap"><div class="bc">Shop / Prints / Night Garden</div>
<div class="pp"><div class="gal"><div class="main"><img src="%ssketchbook/sketchbook-15.jpg" alt=""></div><div class="thumbs"><img class="on" src="%ssketchbook/sketchbook-15-800.jpg"><img src="%ssketchbook/sketchbook-16-800.jpg"><img src="%ssketchbook/sketchbook-21-800.jpg"></div></div>
<div><div class="eyebrow">Watercolour · 2026</div><h1>Night Garden</h1><div class="by">by Alina Otkinska</div>
<p class="desc">Physalis lanterns glowing in the dark. Painted in a Riga sketchbook on a November evening.</p>
<div class="opt"><div class="o sold"><div><b>Original</b><span>one of one · 21×29 cm</span></div><span class="p">Sold</span></div>
<div class="o on"><div><b>Print A4</b><span>signed · 5 left</span></div><span class="p">€28</span></div>
<div class="o"><div><b>Print A3</b><span>signed · 3 left</span></div><span class="p">€38</span></div></div>
<div class="buy"><label>Ship to</label><div class="in">Latvia ▾</div><label>Note for Alina (optional)</label><div class="in" style="color:#9a8f80">A gift, please don’t include the price</div>
<span class="btn pri">Order · €28 + shipping</span>
<div class="how"><span>1 · You order</span><span>2 · Alina sends an invoice</span><span>3 · You pay</span><span>4 · It ships</span></div></div>
<div class="guest"><b>Not logged in?</b>Guests see “Log in to order” here instead, then return to this exact print.</div>
</div></div></div>''' % (I, I, I, I) + FT)

# ---------- MY ORDERS ----------
mo_css = MENU_CSS + '''
.ph{padding:44px 0 22px}.ph h1{font-size:46px}
.ord{background:#fff;border:1px solid var(--line);border-radius:12px;padding:20px;margin-bottom:18px;display:grid;grid-template-columns:110px 1fr auto;gap:20px;align-items:center}
.ord img{width:110px;height:110px;object-fit:cover}
.ord h3{font-size:22px}.ord .meta{font-size:13px;color:var(--ink2);margin:2px 0 12px}
.steps{display:flex;gap:0;font-size:12px}
.steps span{flex:1;border-top:4px solid var(--line);padding-top:6px;color:var(--ink2);min-width:70px}
.steps span.done{border-color:var(--olive);color:var(--ink)}.steps span.now{border-color:var(--orange);color:var(--orange);font-weight:700}
.act{text-align:right}.act .st{display:inline-block;font:700 12px Karla;letter-spacing:.06em;text-transform:uppercase;padding:5px 10px;border-radius:4px;background:var(--apricot);margin-bottom:10px}
.act .st.ok{background:#CFD8B0}
.act .btn{display:flex;margin-top:6px}
@media(max-width:700px){.ord{grid-template-columns:70px 1fr;gap:12px}.ord img{width:70px;height:70px}.act{grid-column:1/-1;text-align:left}.steps{flex-wrap:wrap;row-gap:8px}.ph h1{font-size:34px}}
'''
page('orders', 'My orders', mo_css, hd_user() + MENU + '''<div class="wrap" style="padding-bottom:70px"><div class="ph"><div class="eyebrow">Profile</div><h1>My orders</h1></div>
<div class="ord"><img src="%ssketchbook/sketchbook-15-800.jpg"><div><h3>Night Garden · Print A4</h3><div class="meta">Order #0012 · 10 Nov 2026 · €28 + €6 shipping to Latvia</div>
<div class="steps"><span class="done">Ordered</span><span class="now">Invoice sent</span><span>Paid</span><span>Shipped</span><span>Delivered</span></div></div>
<div class="act"><span class="st">Waiting for payment</span><span class="btn sm pri">📄 Open invoice</span><span class="btn sm">I’ve paid</span></div></div>
<div class="ord"><img src="%ssketchbook/sketchbook-14-800.jpg"><div><h3>Red Wall, Riga · Print A3</h3><div class="meta">Order #0007 · 28 Oct 2026 · €38 + €6</div>
<div class="steps"><span class="done">Ordered</span><span class="done">Invoice sent</span><span class="done">Paid</span><span class="done">Shipped</span><span class="now">Delivered</span></div></div>
<div class="act"><span class="st ok">Delivered</span><span class="btn sm">Tracking LV123…</span></div></div></div>''' % (I, I) + FT)

# ---------- ADMIN: add art ----------
ad_css = '''
body{background:#F3EEE4}
.ah{background:var(--moss);color:var(--paper)}.ah .wrap{display:flex;align-items:center;height:60px;gap:16px;font:600 18px Fraunces,Lora}.ah span{margin-left:auto;font:500 14px Karla;opacity:.8}
.tb{display:flex;gap:6px;margin:28px 0 20px}.tb span{padding:10px 18px;border-radius:999px;border:1.5px solid var(--ink);font:600 14px Karla}.tb span.on{background:var(--ink);color:var(--paper)}.tb i{font-style:normal;background:var(--orange);color:#fff;border-radius:999px;padding:0 7px;margin-left:6px;font-size:12px}
.two{display:grid;grid-template-columns:1fr 1.2fr;gap:24px;margin-bottom:60px}
.box{background:#fff;border:1px solid var(--line);border-radius:12px;padding:22px}
.box h2{font:600 22px Fraunces,Lora;margin-bottom:14px}
.drop{border:2px dashed var(--line);border-radius:10px;padding:16px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.drop img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px}.drop .add{display:grid;place-items:center;aspect-ratio:1;border-radius:6px;background:var(--paper);font-size:13px;color:var(--ink2);text-align:center}
.fl{font-size:13px;color:var(--ink2);margin:14px 0 6px;display:block}
.in{border:1.5px solid var(--line);border-radius:8px;padding:10px 12px;font-size:15px;background:var(--paper)}
.langs{display:flex;gap:6px;margin-top:6px;font-size:12px}.langs span{background:#E9EFD6;padding:3px 8px;border-radius:4px}
.fmt{display:grid;grid-template-columns:1.4fr 1fr .8fr .5fr;gap:8px;align-items:center;font-size:14px;padding:8px 0;border-bottom:1px solid var(--line)}
.fmt.h{font-size:12px;color:var(--ink2);text-transform:uppercase;letter-spacing:.08em}
.tog{display:inline-block;width:38px;height:22px;border-radius:999px;background:var(--olive);position:relative}.tog:after{content:"";position:absolute;right:3px;top:3px;width:16px;height:16px;border-radius:50%;background:#fff}
.tog.off{background:var(--line)}.tog.off:after{right:auto;left:3px}
.row{display:flex;gap:10px;margin-top:18px;align-items:center}
.list .it{display:grid;grid-template-columns:56px 1fr auto auto;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid var(--line);font-size:14px}
.list .it img{width:56px;height:56px;object-fit:cover;border-radius:6px}.list .it b{font:600 15px Fraunces,Lora;display:block}.list .it small{color:var(--ink2)}
@media(max-width:700px){.two{grid-template-columns:1fr}.tb{overflow:auto}.tb span{white-space:nowrap}.fmt{grid-template-columns:1.2fr 1fr .8fr .5fr;font-size:13px}}
'''
AH = '<div class="ah"><div class="wrap">Pigeon Polly · Кабинет → 🛍 Магазин <span>← на сайт</span></div></div><div class="wrap">'
TB = '<div class="tb"><span %s>🖼 Арты на продажу</span><span %s>📦 Заказы<i>2</i></span><span>🔄 Лавка птичек</span></div>'
page('admin-art', 'Admin art', ad_css, AH + TB % ('class="on"', '') + '''<div class="two">
<div class="box"><h2>＋ Новый арт</h2><span class="fl">Фото (первое — обложка, перетаскиванием меняется порядок)</span>
<div class="drop"><img src="%ssketchbook/sketchbook-15-800.jpg"><img src="%ssketchbook/sketchbook-16-800.jpg"><div class="add">＋<br>ещё фото<br>или фото на стене</div></div>
<span class="fl">Название</span><div class="in">Night Garden</div>
<span class="fl">Описание — пишете на одном языке, остальные переводит тот же переводчик, что в блоге</span><div class="in" style="min-height:64px">Physalis lanterns glowing in the dark…</div>
<div class="langs"><span>EN ✓</span><span>LV ✓</span><span>RU ✓</span> <a style="text-decoration:underline;margin-left:6px">поправить перевод</a></div>
<span class="fl">Раздел</span><div class="in">Prints ▾ &nbsp;·&nbsp; Originals · Card sets · Printables</div>
<span class="fl">Варианты</span>
<div class="fmt h"><span>Вариант</span><span>Цена, €</span><span>Штук</span><span>Вкл.</span></div>
<div class="fmt"><span>Original 21×29</span><span class="in">140</span><span class="in">1</span><span class="tog off"></span></div>
<div class="fmt"><span>Print A4</span><span class="in">28</span><span class="in">5</span><span class="tog"></span></div>
<div class="fmt"><span>Print A3</span><span class="in">38</span><span class="in">3</span><span class="tog"></span></div>
<span style="font-size:13px;text-decoration:underline;display:block;margin-top:8px">＋ вариант</span>
<div class="row"><span class="btn dark">Опубликовать</span><span class="btn">Черновик</span><span class="note">Доставка: LV €4 · EU €6 · мир €12 (в «Правилах»)</span></div></div>
<div class="box list"><h2>В продаже · 8</h2>
<div class="it"><img src="%ssketchbook/sketchbook-15-800.jpg"><div><b>Night Garden</b><small>A4 ×5 · A3 ×3 · оригинал продан</small></div><span class="tog"></span><span>✏️</span></div>
<div class="it"><img src="%ssketchbook/sketchbook-14-800.jpg"><div><b>Red Wall, Riga</b><small>A4 ×2 · A3 ×0 — закончились</small></div><span class="tog"></span><span>✏️</span></div>
<div class="it"><img src="%ssketchbook/sketchbook-21-800.jpg"><div><b>Cup of Brushes</b><small>A4 ×7</small></div><span class="tog"></span><span>✏️</span></div>
<div class="it"><img src="%ssketchbook/sketchbook-16-800.jpg"><div><b>Strawberry Leaves</b><small>оригинал · 1</small></div><span class="tog"></span><span>✏️</span></div>
<div class="it"><img src="%scards/classic/16.jpg"><div><b>Wobbleland cards</b><small>файл для печати · без лимита</small></div><span class="tog"></span><span>✏️</span></div>
<div class="it" style="opacity:.5"><img src="%ssketchbook/sketchbook-7-800.jpg"><div><b>Rooftops</b><small>черновик</small></div><span class="tog off"></span><span>✏️</span></div>
</div></div></div></body></html>''' % ((I,) * 8))

# ---------- ADMIN: orders ----------
or_css = ad_css + '''
.oc{background:#fff;border:1px solid var(--line);border-radius:12px;padding:18px 20px;margin-bottom:14px;display:grid;grid-template-columns:64px 1.4fr 1fr auto;gap:18px;align-items:center}
.oc img{width:64px;height:64px;object-fit:cover;border-radius:6px}.oc b{font:600 17px Fraunces,Lora;display:block}.oc small{color:var(--ink2);font-size:13px;display:block}
.oc .st{font:700 11px Karla;letter-spacing:.06em;text-transform:uppercase;padding:4px 9px;border-radius:4px;background:var(--apricot);display:inline-block}
.oc .st.new{background:var(--orange);color:#fff}.oc .st.ok{background:#CFD8B0}
.oc .bt{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.inv{background:var(--paper);border:1.5px solid var(--ink);border-radius:12px;padding:18px 20px;margin:-6px 0 20px 82px;display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:12px;align-items:end;font-size:13px}
.inv .in{background:#fff}
.flt{display:flex;gap:8px;margin-bottom:16px;font-size:13px}.flt span{padding:6px 12px;border-radius:999px;background:#fff;border:1px solid var(--line)}.flt span.on{background:var(--ink);color:var(--paper)}
@media(max-width:700px){.oc{grid-template-columns:56px 1fr}.oc .bt{grid-column:1/-1;justify-content:flex-start}.oc>div:nth-child(3){grid-column:2}.inv{margin-left:0;grid-template-columns:1fr}.flt{overflow:auto}.flt span{white-space:nowrap}}
'''
page('admin-orders', 'Admin orders', or_css, AH + TB % ('', 'class="on"') + '''<div class="flt"><span class="on">Все · 5</span><span>Новые · 1</span><span>Ждут оплаты · 1</span><span>Оплачены · 1</span><span>Отправлены · 1</span><span>Архив</span></div>
<div class="oc"><img src="%ssketchbook/sketchbook-21-800.jpg"><div><b>#0013 · Cup of Brushes · A4</b><small>🐦 lina_birdie · Латвия · €24 + €4</small><small>«Можно завернуть как подарок?»</small></div><div><span class="st new">Новый</span><small>сегодня, 14:20</small></div><div class="bt"><span class="btn sm dark">📄 Выставить счёт</span><span class="btn sm">✖ Отменить</span></div></div>
<div class="inv"><div><span class="fl" style="margin-top:0">Сумма, €</span><div class="in">28.00</div></div><div><span class="fl" style="margin-top:0">Счёт (PDF или ссылка)</span><div class="in">rekins-0013.pdf ⬆</div></div><div><span class="fl" style="margin-top:0">Оплатить до</span><div class="in">17.11.2026</div></div><span class="btn sm pri">Отправить птичке</span></div>
<div class="oc"><img src="%ssketchbook/sketchbook-15-800.jpg"><div><b>#0012 · Night Garden · A4</b><small>🐦 polly_fan · Латвия · €28 + €6</small><small>Покупатель нажал «Я оплатил» · 10.11</small></div><div><span class="st">Ждёт оплаты</span><small>счёт отправлен 10.11</small></div><div class="bt"><span class="btn sm dark">✅ Оплачено</span><span class="btn sm">🔔 Напомнить</span></div></div>
<div class="oc"><img src="%ssketchbook/sketchbook-16-800.jpg"><div><b>#0010 · Strawberry Leaves · оригинал</b><small>🐦 artlover · Германия · €140 + €12</small></div><div><span class="st ok">Оплачено</span><small>05.11</small></div><div class="bt"><span class="btn sm dark">📦 Отправлено + трек</span></div></div>
<div class="oc" style="opacity:.75"><img src="%ssketchbook/sketchbook-14-800.jpg"><div><b>#0007 · Red Wall, Riga · A3</b><small>🐦 polly_fan · Латвия · €38 + €6</small></div><div><span class="st ok">Отправлено</span><small>трек LV123…</small></div><div class="bt"><span class="btn sm">Доставлено</span></div></div>
<p class="note" style="margin:20px 0 60px">Каждый шаг: покупатель получает новость 🔔 в профиле и письмо (если согласился на письма). Пока заказ ждёт оплаты, вещь отложена: её не купит другой. Не оплачен до даты → вернуть в продажу одной кнопкой.</p></div></body></html>''' % ((I,) * 4))
print('ok2')

# ---------- LEARN ----------
le_css = MENU_CSS + '''
.ph{padding:50px 0 24px}.ph h1{font-size:58px}.ph p{color:var(--ink2);font-size:18px;max-width:36em;margin-top:10px}
.lt{display:flex;gap:8px;margin:0 0 30px;flex-wrap:wrap}.lt span{border:1.5px solid var(--ink);border-radius:999px;padding:8px 16px;font:500 14px Karla}.lt span.on{background:var(--ink);color:var(--paper)}
.sec{margin-bottom:56px}.sec h2{font-size:34px;margin-bottom:4px}.sec>p{color:var(--ink2);margin-bottom:20px}
.vg{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.v{background:var(--card);border:1px solid var(--line);border-radius:6px;overflow:hidden}
.v .th{position:relative;aspect-ratio:16/10;overflow:hidden}.v .th img{width:100%;height:100%;object-fit:cover}
.v .pl{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:58px;height:58px;border-radius:50%;background:rgba(255,255,255,.92);display:grid;place-items:center;font-size:22px}
.v .bd{position:absolute;top:12px;left:12px;font:700 11px Karla;letter-spacing:.08em;text-transform:uppercase;padding:4px 9px;border-radius:3px;background:#fff}
.v .bd.pay{background:var(--burgundy);color:#fff}.v .bd.yt{background:#fff}
.v .tx{padding:14px 16px}.v h3{font-size:19px}.v small{color:var(--ink2);font-size:13px;display:block;margin:4px 0 12px}
.v .row{display:flex;justify-content:space-between;align-items:center}
.tiers{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.tr{background:#fff;border:1px solid var(--line);border-radius:12px;padding:22px}.tr.best{border:2px solid var(--burgundy)}
.tr h3{font-size:22px}.tr .pr{font:600 34px Fraunces;margin:6px 0}.tr .pr span{font:14px Karla;color:var(--ink2)}.tr ul{list-style:none;font-size:14px;color:var(--ink2);line-height:1.9;margin:10px 0 16px}
.ws{display:grid;grid-template-columns:1fr 1.2fr;gap:30px;align-items:center;background:var(--burgundy);color:var(--paper);padding:30px;border-radius:6px}
.ws img{width:100%;border-radius:4px}.ws h2{font-size:32px}.ws p{opacity:.85;margin:10px 0 16px}.ws .btn{border-color:var(--paper)}
@media(max-width:700px){.ph h1{font-size:38px}.vg,.tiers,.ws{grid-template-columns:1fr}.lt{flex-wrap:nowrap;overflow:auto;margin:0 -16px 24px;padding:0 16px}.lt span{white-space:nowrap}}
'''
def v(img, badge, cls, t, s, btn):
    return '<div class="v"><div class="th"><img src="%s%s"><span class="bd %s">%s</span><span class="pl">%s</span></div><div class="tx"><h3>%s</h3><small>%s</small><div class="row">%s</div></div></div>' % (I, img, cls, badge, '🔒' if cls == 'pay' else '▶', t, s, btn)
free = v('sketchbook/sketchbook-17-800.jpg', 'Free · YouTube', 'yt', 'Persimmons in 10 minutes', 'Short paint-along · EN, LV subtitles', '<span class="btn sm">Watch here</span>') + \
       v('sketchbook/sketchbook-21-800.jpg', 'Free · YouTube', 'yt', 'My 5-colour travel palette', 'Tip · 4 min', '<span class="btn sm">Watch here</span>') + \
       v('sketchbook/sketchbook-15-800.jpg', 'Free with a print', 'yt', 'Paint “Night Garden” yourself', 'Comes with the print · 15 min', '<span class="btn sm">Watch here</span>')
paid = v('sketchbook/sketchbook-5-800.jpg', 'Paint-along', 'pay', 'Cosy café breakfast', '35 min · reference photo + line sketch PDF', '<span class="price">€12</span><span class="btn sm dark">Get on Patreon</span>') + \
       v('sketchbook/sketchbook-7-800.jpg', 'Paint-along', 'pay', 'Rooftops of Riga', '40 min · EN, LV subtitles', '<span class="price">€12</span><span class="btn sm dark">Get on Patreon</span>') + \
       v('sketchbook/sketchbook-16-800.jpg', 'Course · 4 weeks', 'pay', 'Watercolour sketching from zero', '8 lessons · homework · later', '<span class="price">€49</span><span class="btn sm">Notify me</span>')
page('learn', 'Learn', le_css, hd_user() + '''<div class="wrap"><div class="ph"><div class="eyebrow">Learn</div><h1>Paint with me</h1><p>Short free lessons on YouTube, full paint-alongs for members, and small workshops in Riga.</p></div>
<div class="lt"><span class="on">All</span><span>Free</span><span>Paint-alongs</span><span>Workshops in Riga</span><span>Guides</span><span>Palettes</span></div>
<div class="sec"><h2>Free lessons</h2><p>Hosted on YouTube, play right here on the site.</p><div class="vg">%s</div></div>
<div class="sec"><h2>Paint-alongs</h2><p>Full lessons with reference photo and sketch. Buy one, or get all of them with a membership.</p><div class="vg">%s</div></div>
<div class="sec"><h2>Studio Club on Patreon</h2><p>Payment, VAT and video hosting are handled by Patreon.</p><div class="tiers">
<div class="tr"><h3>Sketchbook friend</h3><div class="pr">€5<span> / month</span></div><ul><li>Process videos and studio notes</li><li>A printable Wobbleland card each month</li><li>Vote for the next lesson</li></ul><span class="btn sm">Join</span></div>
<div class="tr best"><h3>Studio</h3><div class="pr">€12<span> / month</span></div><ul><li>Everything in Friend</li><li>Every paint-along, new one each month</li><li>Reference photos and line sketches</li></ul><span class="btn sm pri">Join</span></div>
<div class="tr"><h3>Feedback</h3><div class="pr">€30<span> / month</span></div><ul><li>Everything in Studio</li><li>Personal feedback on your painting</li><li>Only 10 places · later</li></ul><span class="btn sm">Join the waitlist</span></div></div></div>
<div class="sec ws"><img src="%ssketchbook/sketchbook-12-800.jpg"><div><div class="eyebrow" style="color:var(--apricot)">Riga · in Latvian</div><h2>Workshop: winter cards in watercolour</h2><p>Saturday 13 Dec · 3 hours · all materials included · 8 seats</p><span class="btn">Book a seat · €35</span></div></div></div>''' % (free, paid, I) + FT)
print('ok3')
