// Что можно с вещью (этап 7, docs/cards.md «Что можно с вещью»): одна функция и для браузера (window.PPCanDo), и для сервера
// (worker/index.js импортирует этот файл и берёт globalThis.PPCanDo). Заменяет разрозненные проверки gameOnly/kidpot/легендарных.
// PPCanDo(kind, item) → { shop, gift, sell, bag, box }:
//   shop — бывает в магазине (продажа и подсказка возвращают её туда +1, автопополнение, «Пуговичный дождь»);
//   gift — можно подарить другой птичке; sell — продать за пуговки; bag — убрать из комнаты в сумку; box — положить в адвент-окно и подарок из кабинета.
// Легендарные: не дарятся. Игровые (бутылочка «Вкус детства» furn|kidpot:N): не в магазин и не в подарок из кабинета.
// Альбом furn|album: есть в каждой комнате сам — ничего нельзя.
(function (g) {
  var LEGEND = ['furn|countcoffin', 'furn|crypt', 'furn|tieredcake', 'hat|halo', 'hat|unicorn', 'hat|flamecrown', 'item|dragonegg', 'item|goldfeather', 'item|comet', 'item|goldenapple', 'frame|legend', 'anim|aurora',
    'furn|throne', 'view|aurora', 'wall|gold', 'floor|marble', 'furn|dragon', 'furn|portal', 'furn|treasure', 'furn|phoenixnest', 'furn|pollystatue', 'deco|rainbowarc', 'deco|constellation', 'wall|stainedglass',
    'floor|clouds', 'floor|goldtiles', 'view|dragonsky', 'curtain|starlight'];
  var base = function (item) { return String(item).split(':')[0]; };
  var isAlbum = function (kind, item) { return kind === 'furn' && base(item) === 'album'; };
  var isGame = function (kind, item) { return kind === 'furn' && base(item) === 'kidpot'; };
  function canDo(kind, item) {
    if (kind && typeof kind === 'object') { item = kind.item != null ? kind.item : kind.v; kind = kind.kind || kind.k; }
    if (isAlbum(kind, item)) return { shop: false, gift: false, sell: false, bag: false, box: false };
    var leg = canDo.LEGEND.has(kind + '|' + item) || item === 'legend', game = isGame(kind, item);
    return { shop: !game, gift: !leg, sell: true, bag: true, box: !game };
  }
  canDo.LEGEND = new Set(LEGEND);
  canDo.isAlbum = isAlbum;
  canDo.isGame = isGame;
  // для подсказки в Зельеварне и похожего «потратить вещь»: можно только то, что возвращается в магазин и не легендарное
  canDo.spend = function (kind, item) { var c = canDo(kind, item); return c.shop && c.gift; };
  g.PPCanDo = canDo;
})(typeof window !== 'undefined' ? window : globalThis);
