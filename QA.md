# Tayyorlik va tekshiruv — 19.10.2026

1. **TAYYOR — fayl xatolari.** /aabbcc/ URL va mutlaq OG/Twitter preview; haqiqiy 128k MP3 + AAC/M4A; yengil WebP/JPEG; dublikatlarsiz yangi paket; server origin tuzatilgan. Worker kodi va ko‘rsatma tayyor, ammo hisob/tokenlar kiritilmagan va deploy qilinmagan.
2. **TAYYOR — art direction.** Zumrad/oltin editorial tizim, qorong‘i va yorug‘ sahnalar, yirik serif ismlar va sana, ravoqdagi uchta original surat, nozik SVG bezaklar, donador tekstura, mos yangi OG rasmi. Tilaklar qismi manzildan alohida issiq bodom rangda.
3. **QISMAN — harakat.** Haqiqiy protsedurali WebGL konvert, ochiluvchi qopqoq/xat, oltin muhr, uzuklar, yengil zarralar, harfma-harf ochilish, rolling countdown, timeline, 3D qiyalangan galereya, rasm parallaksi, magnit tugmalar va musiqa zarralari ishlangan. Kinematik xat ichiga to‘liq kamera sayohati qisqa yaqinlashishga soddalashtirilgan. Sana chuqurligi CSS. Majburiy scroll-snap ishlatilmagan. Ixtiyoriy sensor kodi mavjud, haqiqiy telefon sensori sinalmagan.
4. **QISMAN — ishlash va moslik.** Desktop 1280×720, mobil 390×844, kichik 320×740 ko‘rinishlari tekshirildi; yonlama overflow yo‘q. To‘yxona WebP yuklandi (1400 px). MP3 242.53 s davomiylik bilan ijro etildi, vaqt yurishi va pauza tasdiqlandi. MP3/M4A dekodlash xatosiz. Lokal sahifa resurslari, musiqasiz ~1.07 MB (CDN/shriftlar bu hisobga kirmaydi). Reduced-motion va CSS zaxira bor, skriptsiz HTML kontenti tekshirildi. Lighthouse ≥90, to‘liq WCAG auditi va haqiqiy iOS/Android apparat sinovi o‘tkazilmagan.
5. **TAYYOR — tahrirlash va hujjatlar.** config.js, qayta HTML yaratuvchi build.mjs, EDIT.md, Pages/Worker yo‘riqnomasi, sinovlar. Asosiy kontent config orqali; xizmat tugmalari matnlari template.html ichida. RSVP ko‘rinishi qo‘shilmagan va mehmon ismi so‘ralmaydi.

## Avtomatik sinovlar
- Paket: mahalliy fayllar, URL/metadata, audio format sarlavhalari, sana/timezone, yagona aria-live, har bir bezak rasmi ≤250 KiB.
- Worker: exact-origin, HMAC, vaqt oynasi, IP, honeypot, HTML escaping, limitlar, nonce replay, RSVP o‘chiq. Telegram tarmoq so‘rovlari mock, haqiqiy xabar yuborilmagan.

## Nima hali nashr etilmagan
GitHub repository va jonli sahifa bu ish davomida o‘zgartirilmagan. ZIPni yuklab yangi Pages nashrini chiqarish kerak. Telegram bot rejimi uchun README bo‘yicha Worker sozlanadi; ungacha tayyor Telegram matni oqimi ishlaydi.
