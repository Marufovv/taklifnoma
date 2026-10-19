


npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
npx wrangler secret put SIGNING_SECRET
```

`SIGNING_SECRET` uchun kamida 32 tasodifiy baytga teng yangi sir yarating (masalan parol menejeri orqali). Tokenlarni config.js, wrangler.toml yoki `.env` bilan GitHub’ga yuklamang.
6. `npx wrangler deploy` bajaring. Durable Object migration `wrangler.toml` ichida tayyor.
7. Berilgan `https://…workers.dev` manzilini `config.js` dagi `apiBase` maydoniga yozing. `node build.mjs` bajaring va saytdagi config.js/index.html ni yangilang. Forma avtomatik server rejimiga o‘tadi.
8. O‘z testingizda bitta tilak yuboring, bot chatiga kelganini tekshiring. Frontend “yuborildi” deb faqat backend muvaffaqiyatni tasdiqlaganda ko‘rsatadi.

Himoyalar: exact-origin CORS, HMAC bilan imzolangan 3 soniya–30 daqiqa amal qiluvchi challenge, IP bog‘lanishi, honeypot, 1800 belgi limiti, 16 KB so‘rov limiti, Durable Object orqali atomik rate limit va takroriy nonce rad etilishi. Bu barcha turdagi spamni mutlaq to‘xtatish kafolati emas.
RSVP o‘chiq. Mehmon ismi so‘ralmaydi. `enableRsvp` zaxira flag, hozirgi sahifada RSVP interfeysi ataylab yo‘q; faqat flagni yoqish bilan yangi forma paydo bo‘lmaydi.

Rasmiy manbalar: [Cloudflare secrets](https://developers.cloudflare.com/workers/configuration/secrets/), [Telegram bot yaratish](https://core.telegram.org/bots/tutorial), [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Tekshirish
`node tests/server.mjs` — Telegramga haqiqiy xabar yubormasdan backend sinovlari.
`node tests/package.mjs` — paket, URL, format va HTML tekshiruvlari.
Mahalliy ko‘rish: `python3 -m http.server 8000`, keyin `http://localhost:8000`.
Jonli nashrdan keyin:
- Telefon va kompyuterda birinchi sahifani oching, ismlar va ochish tugmasini tekshiring.
- Musiqani boshlating, pauza qiling va qayta boshlating.
- Uchta surat va Zulfiya chizmasini tekshiring.
- Google/Yandex xaritalari, .ics, ulashish va Telegram oqimini sinang.
- iOS Safari va Android Chrome’da ham sinov qiling. Sensor effekti ixtiyoriy; ruxsat faqat “Telefon harakati” bosilganda so‘raladi.
- Qurilmaning Reduce Motion sozlamasida animatsiyalar o‘chishini tekshiring.

## Halol tekshiruv chegaralari
1280×720 va 390×844 brauzer ko‘rinishlari, konvert ochilishi, ismlar, rasm yuklanishi, MP3 ijro va pauza, forma hisoblagichi tekshirildi. Haqiqiy iPhone/Android apparat sinovi va Lighthouse mobil ≥90 sertifikati berilmagan. Kutubxonalar va shriftlar CDN/Google’dan keladi; ular ishlamasa statik matn, rasmlar, xarita, musiqa va forma saqlanadi. Server deploy qilinmagan.
Dizayn: zumrad/oltin editorial; WebGL konvert va uzuklar, sana chuqurligi CSS, galereya CSS 3D. To‘liq kino uslubidagi xat ichiga kamera sayohati o‘rniga qisqa yaqinlashish va keyingi bo‘limga o‘tish ishlatilgan. Scroll-snap majburiy qilinmagan: mobil va klaviatura navigatsiyasi tabiiy qoladi.
