# Sardorbek & Gulsevar — Emerald Editorial

Tayyor manzil: https://marufovv.github.io/aabbcc/
25-oktabr 2026, yakshanba, 12:00–14:00 (Asia/Tashkent).
Zulfiya to‘yxonasi, Buvayda, Farg‘ona. Fasad — badiiy talqin.

## GitHub’ga yuklash — eng oson yo‘l
1. ZIPni oching. **ZIP faylning o‘zini emas, ichidagi fayllarni yuklang.**
2. `marufovv/aabbcc` repositorysining boshiga `index.html`, `style.css`, `app.js`, `motion.js`, `config.js` va **assets papkasini to‘liq** yuklang. Qolgan hujjatlar/build/server fayllari ham paketda.
3. Eski bir xil fayllar almashtirilsin. `index.html` yangi ichki papkaga tushib qolmasin.
4. Settings → Pages → Deploy from a branch → main → /(root) → Save.
5. GitHub Pages nashri tugagach yuqoridagi manzilni oching. Keshlangan eski ko‘rinish bo‘lsa sahifani qattiq yangilang yoki yangi maxfiy oynada oching.

Eski repositoryda ildizdagi `music.mp3`, `photo-*.jpg`, `botanical.png`, `zulfiya-illustration.png`, `favicon.svg`, `og.jpg`, `apple-touch-icon.png`, `worker.mjs`, `wrangler.toml`, `enhancements.js`, `enhancements.css` endi ishlatilmaydi. Yangi paketda ular takrorlanmagan. Oddiy Upload eski fayllarni o‘zi o‘chirmaydi; repositoryni tozalashda faqat shu eski nusxalarni olib tashlang. Ishlaydigan media `assets/`, backend `server/` ichida.

## Tahrirlash
`config.js` — asosiy kontent, tema, rasmlar, musiqa, dastur va ulanishlar manbai.
O‘zgartirgach shu papkada `node build.mjs` bajaring: `index.html` yangilanadi. Bu JavaScript o‘chiq holatda ham to‘g‘ri matnlar va Telegram preview saqlanishi uchun kerak. Tayyor ZIPni o‘zgartirmasdan yuklasangiz bu qadam kerak emas. Node paketlari o‘rnatish shart emas.
`EDIT.md` da maydonlar jadvali bor.

## Musiqa
`assets/music.mp3` — haqiqiy MPEG Layer III, 128 kbps; `music.m4a` — AAC zaxira. Ikkalasi ham berilgan yozuvdan aylantirilgan. Oldingi WebM faylga faqat .mp3 nomi berish xatosi tuzatildi.
MP3 faqat mehmon tugmani bosganda yuklanib ijro etiladi. Brauzer ovozini avtomatik boshlashga majburlamaydi. Yuklanish, ijro, pauza va qayta urinish holatlari bor.
Almashtirish: `config.js` dagi `music:{mp3:'assets/yangi.mp3',m4a:'assets/yangi.m4a',title:'Yangi trek',artist:'Ijrochi'}` qatorini o‘zgartiring; haqiqiy formatdagi fayllarni assets ichiga qo‘ying va `node build.mjs` bajaring.
**Mualliflik huquqi:** “Vafodorim” — Izzat Shukurov ijrosidagi, foydalanuvchi taqdim etgan yozuv. Saytga ochiq joylashdan oldin tegishli foydalanish ruxsatiga ega ekaningizni tekshiring; bu paket musiqa uchun litsenziya bermaydi.

## Telegram: hozir ishlaydigan usul
`apiBase:''` bo‘lsa tilak @anthophile_dm uchun Telegramda tayyor matn sifatida ochiladi. Mehmon yuborishni Telegramda yakunlaydi. Popup bloklansa “Telegramni ochish” va “Matnni nusxalash” zaxira tugmalari chiqadi. Hech qanday bot tokeni brauzerga kiritilmaydi.

## Ixtiyoriy: to‘g‘ridan-to‘g‘ri Telegramga yuboruvchi Worker
Bu xizmat ZIPni GitHub’ga yuklash bilan avtomatik ishga tushmaydi. Cloudflare va o‘zingizga tegishli Telegram bot sozlanishi kerak.
1. Telegramdagi rasmiy **@BotFather** bilan `/newbot` orqali bot yarating. Tokenni maxfiy saqlang. Bot bilan shaxsiy chatni ochib **Start** bosing va biror xabar yozing.
2. Telegram Bot API `getUpdates` javobidagi `message.chat.id` — qabul qiluvchi chat ID. Tokenli URLni umumiy chatga yoki repositoryga qo‘ymang. Mahalliy maxfiy muhitdagi rasmiy Bot API so‘rovi orqali IDni oling. Bot faqat u bilan suhbat boshlagan foydalanuvchiga yubora oladi; profil username’i chat ID o‘rnini bosmaydi.
3. Node va Cloudflare Wrangler mavjud bo‘lsin. Paketdagi `server` papkasiga o‘ting. `npx wrangler login` bilan o‘z hisobingizga kiring.
4. `wrangler.toml` ichida `ALLOWED_ORIGIN = "https://marufovv.github.io"` tayyor. Bu yerda `/aabbcc/` yo‘li bo‘lmaydi. Custom domen ishlatsangiz aynan uning HTTPS originini yozing.
5. Quyidagilarni alohida bajaring; qiymatlar terminalning yashirin so‘roviga kiritiladi:

```sh
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
