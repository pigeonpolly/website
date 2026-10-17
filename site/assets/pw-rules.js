// Правила пароля — одни для сервера (worker/index.js) и браузера (account.js): от 8 символов, не из списка частых, не совпадает с почтой и ником.
// PPPw.check(pw, {email, nick}) → '' или код ошибки: short, long, common, same.
(function (g) {
  const COMMON = new Set(`123456 1234567 12345678 123456789 1234567890 12345678910 0123456789 987654321 9876543210 11111111 111111111 1111111111 00000000 000000000 88888888
  12341234 11223344 12121212 123123123 123321123 147258369 159753159 741852963 qwertyui qwertyuiop qwerty123 qwerty12 qwerty1234 1qaz2wsx 1q2w3e4r 1q2w3e4r5t zaq12wsx
  asdfghjk asdfghjkl zxcvbnm1 zxcvbnmm qazwsxedc password password1 password12 password123 passw0rd p@ssword p@ssw0rd pa55word 1password iloveyou iloveyou1 sunshine
  princess football baseball welcome1 welcome123 superman batman123 starwars whatever trustno1 letmein1 letmein123 changeme default1 computer internet monkey123 dragon123
  michael1 jennifer charlie1 jordan23 liverpool chelsea1 arsenal1 barcelona manchester shadow12 master12 mustang1 freedom1 secret12 secret123 abcd1234 abc12345 abcdefgh
  aa123456 a1234567 a12345678 abc123456 q1w2e3r4 q1w2e3r4t5 asdf1234 test1234 testtest admin123 admin1234 administrator user1234 guest123 hello123 helloworld loveyou1
  lovely12 butterfly cookie12 pokemon1 minecraft fortnite roblox123 instagram facebook tiktok123 google123 youtube1 samsung1 iphone12 apple123 gmail123 mypassword
  parole123 parole12 parolis1 parolis123 parol123 privet123 qwertyqwerty йцукенгш йцукенгшщз пароль123 пароль1 qweasdzxc 1qazxsw2 zaq1zaq1 a1b2c3d4 11qq22ww
  pigeonpolly polly123 pigeon123 drawing1 sketch123 artist123 painting watercolor`.split(/\s+/).filter(Boolean));
  const norm = s => String(s || '').toLowerCase().trim();
  function check(pw, o) {
    pw = String(pw || ''); o = o || {};
    if ([...pw].length < 8) return 'short';
    if (pw.length > 200) return 'long'; // PBKDF2 от очень длинной строки — лишняя нагрузка
    const p = norm(pw);
    if (COMMON.has(p) || /^(.)\1+$/.test(p) || /^(?:0123456789|1234567890|abcdefghijklmnopqrstuvwxyz)+$/.test(p)) return 'common';
    const mail = norm(o.email), local = mail.split('@')[0];
    if ((mail && (p === mail || p === local)) || (o.nick && p === norm(o.nick))) return 'same';
    return '';
  }
  g.PPPw = { check, COMMON };
})(typeof window !== 'undefined' ? window : globalThis);
