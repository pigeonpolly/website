// Что можно с вещью (этап 7, docs/cards.md «Что можно с вещью»): одна функция и для браузера (window.PPCanDo), и для сервера
// (worker/index.js импортирует этот файл и берёт globalThis.PPCanDo). Заменяет разрозненные проверки gameOnly/kidpot/легендарных.
// PPCanDo(kind, item) → { shop, gift, sell, bag, box, pack }:
//   shop — бывает в магазине (продажа и подсказка возвращают её туда +1, автопополнение, «Пуговичный дождь»);
//   gift — можно подарить другой птичке; sell — продать за пуговки; bag — убрать из комнаты в сумку; box — положить в адвент-окно и подарок из кабинета;
//   pack — спрятать в коробку в комнате (этап 11 Г): коробку в коробку и альбом — нельзя (мелкая ли вещь — room.js isSmall).
// Легендарные: не дарятся. Игровые (бутылочка «Вкус детства» furn|kidpot:N): не в магазин и не в подарок из кабинета.
// Альбом furn|album: есть в каждой комнате сам — ничего нельзя.
// Награды Титоса (TITOS, за уровни 30/50/90/100, и вещи за дела furn|tc<имя> — isCase; docs/titos.md): только своя — не в магазине, не подарить, не продать, не в подарок из кабинета.
(function (g) {
  var LEGEND = ['furn|countcoffin', 'furn|crypt', 'furn|tieredcake', 'hat|halo', 'hat|unicorn', 'hat|flamecrown', 'item|dragonegg', 'item|goldfeather', 'item|comet', 'item|goldenapple', 'frame|legend', 'anim|aurora',
    'furn|throne', 'view|aurora', 'wall|gold', 'floor|marble', 'furn|dragon', 'furn|portal', 'furn|treasure', 'furn|phoenixnest', 'furn|pollystatue', 'deco|rainbowarc', 'deco|constellation', 'wall|stainedglass',
    'floor|clouds', 'floor|goldtiles', 'view|dragonsky', 'curtain|starlight'];
  var TITOS = ['furn|chalkrug', 'furn|titospot', 'deco|clueboard', 'deco|titosbadge'];
  var BOXES = ['cardbox', 'crate', 'hatbox', 'trunkbox', 'giftbox']; // коробки в комнате (furn), этап 11 Г
  var base = function (item) { return String(item).split(':')[0]; };
  var isAlbum = function (kind, item) { return kind === 'furn' && base(item) === 'album'; };
  var isGame = function (kind, item) { return kind === 'furn' && base(item) === 'kidpot'; };
  var isBox = function (kind, item) { return kind === 'furn' && BOXES.indexOf(base(item)) >= 0; };
  var isCase = function (kind, item) { return kind === 'furn' && /^tc[a-z]+$/.test(base(item)); };
  function canDo(kind, item) {
    if (kind && typeof kind === 'object') { item = kind.item != null ? kind.item : kind.v; kind = kind.kind || kind.k; }
    if (isAlbum(kind, item)) return { shop: false, gift: false, sell: false, bag: false, box: false, pack: false };
    if (canDo.TITOS.has(kind + '|' + base(item)) || isCase(kind, item)) return { shop: false, gift: false, sell: false, bag: true, box: false, pack: true };
    var leg = canDo.LEGEND.has(kind + '|' + item) || item === 'legend', game = isGame(kind, item);
    return { shop: !game, gift: !leg, sell: true, bag: true, box: !game, pack: !isBox(kind, item) };
  }
  canDo.LEGEND = new Set(LEGEND);
  canDo.TITOS = new Set(TITOS);
  canDo.isAlbum = isAlbum;
  canDo.isGame = isGame;
  canDo.isCase = isCase;
  canDo.isBox = isBox;
  // для подсказки в Зельеварне и похожего «потратить вещь»: можно только то, что возвращается в магазин и не легендарное
  canDo.spend = function (kind, item) { var c = canDo(kind, item); return c.shop && c.gift; };
  g.PPCanDo = canDo;
})(typeof window !== 'undefined' ? window : globalThis);
