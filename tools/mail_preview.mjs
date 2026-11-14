// Просмотр оформления писем (worker/mail-html.js): node tools/mail_preview.mjs [папка] → по HTML-файлу на образец и index.html со всеми.
import { mailHtml } from '../worker/mail-html.js';
import { writeFileSync, mkdirSync } from 'fs';
const dir = process.argv[2] || 'mail-preview'; mkdirSync(dir, { recursive: true });
const off = 'https://www.pigeonpolly.com/api/mail/off?u=1&k=abc';
const S = {
  games_ru: ['🐦 Тебя ждут: серия 5 дней, дело №4', `Привет, Ворона!\n\n🔥 Серия рисунков в 5 дней сгорит сегодня вечером — тема дня ещё ждёт. Хватит и быстрого наброска на 10 минут.\nhttps://www.pigeonpolly.com/ru/challenge/?utm_source=email\n\n🕵️ Детективу Титосу не спится: на столе ждёт дело №4 «Пропавший зонтик». Кофе уже горячий ☕\nhttps://www.pigeonpolly.com/ru/titos/?utm_source=email\n\nПолли 🐦\n\n—\nЭто письмо пришло, потому что на pigeonpolly.com включены «уведомления из игр».\nВыбрать, что присылать: https://www.pigeonpolly.com/ru/bird/#mail\nОтписаться от всех писем: ${off}`],
  advent_en: ['🎄 The advent calendar is open!', `Hi!\n\nThe Pigeon Polly advent calendar is open: one window a day until Christmas, each with a little surprise for your bird.\n\nhttps://www.pigeonpolly.com/advent/\n\nYou asked for this reminder on pigeonpolly.com. This is the only one; you can untick it in your profile.\n\nAlina, Pigeon Polly Art Lab`],
  reset_lv: ['Pigeon Polly: jauna parole', `Sveiki!\n\nKāds (cerams, tu) lūdza atjaunot paroli vietnē pigeonpolly.com.\nAtver saiti stundas laikā un izdomā jaunu paroli:\n\nhttps://www.pigeonpolly.com/lv/?pwreset=abc123\n\nJa tas nebiji tu, vienkārši neņem vērā šo vēstuli — parole paliks tā pati.\n\nAlīna, Pigeon Polly Art Lab`],
};
let all = '<!doctype html><meta charset="utf-8"><body style="margin:0;background:#ddd">';
for (const [k, [s, t]] of Object.entries(S)) { const h = mailHtml(s, t); writeFileSync(`${dir}/${k}.html`, h); all += `<iframe src="${k}.html" style="width:100%;height:900px;border:0;display:block;margin-bottom:8px"></iframe>`; }
writeFileSync(`${dir}/index.html`, all);
console.log('ok', dir);
