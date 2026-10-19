# O‘zgartirish xaritasi

Asosiy kontentni config.js orqali tahrirlang. So‘ng `node build.mjs`: tayyor index.html ham yangilanadi.

| Nima | Fayl / boshlanish qatori |
|---|---|
| Ismlar | config.js:4 |
| Sana va vaqt | config.js:5 |
| To‘yxona / manzil | config.js:6 |
| Xarita koordinatalari | config.js:7 |
| Sayt URL, Telegram, Worker | config.js:8 |
| Zumrad yoki bordo, effektlar | config.js:9 |
| Musiqani almashtirish | config.js:10 |
| Uchta surat | config.js:11 |
| To‘yxona chizmasi | config.js:16 |
| Gul bezagi | config.js:17 |
| Dastur | config.js:18 |
| Asosiy matnlar | config.js:22 |
| Shrift, joylashuv, masofalar | style.css |
| 3D konvert va uzuklar | motion.js |
| Musiqa, hisoblagich, forma | app.js |
| Tugma yozuvlari / HTML tuzilma | template.html, keyin node build.mjs |
| Worker domeni | server/wrangler.toml |

`theme: 'burgundy'` — bordo, `theme: 'emerald'` — zumrad. `effects.three:false` WebGLni o‘chiradi. `effects.particles` zarralar sonini boshqaradi; telefon uchun avtomatik limit bor. `effects.cursor:false` kursor bezagini o‘chiradi.

Rasmlarni asli 719×1280 o‘lchamda saqlang; yangi rasmlar maxfiy ma’lumotlarni oshkor qilmasin. Fasad tasviri real bino fotosurati emas — badiiy talqin.

`accentColor` bo‘sh bo‘lsa tanlangan tema ishlaydi. Maxsus rang qo‘ysangiz matn kontrastini qayta tekshiring.

`phone`, `parents`, `dressCode` bo‘sh bo‘lsa ko‘rinmaydi. RSVP va mehmon ismi formasi qo‘shilmagan.
