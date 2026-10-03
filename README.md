# 🛒 MODERNO — Zamonaviy Professional Onlayn Do'kon (E-Commerce Web App)

Ushbu loyiha barcha zamonaviy talablarga javob beradigan, yuqori sifatli va professional tarzda ishlab chiqilgan to'liq funksional onlayn do'kondir.

---

## 🌟 17 Ta Asosiy Talab va Ularning Amalga Oshirilishi:

1. **🌐 Ko'p tillilik (Multi-language):**
   - **O'zbekcha (`uz`)**, **Ruscha (`ru`)** va **Inglizcha (`en`)** to'liq tarjima tizimi.
   - Saytdagi barcha bo'limlar, mahsulotlar, filtrlar, tugmalar va bildirishnomalar dinamik tarjima qilinadi.
   - Tanlangan til `localStorage`da saqlanadi.

2. **🌓 Tun va Kun rejimi (Dark / Light mode):**
   - Zamonaviy qorong'u (Dark) va yorug' (Light) rejimlar.
   - Tanlov `localStorage` va brauzer sozlamalariga moslashadi.

3. **⚛️ React + React Router:**
   - React 19 + React Router DOM orqali ko'p sahifali SPA arxitekturasi:
     - `/` — Bosh sahifa (Hero slider, Ommabop kategoriyalar, Kunning chegirmalari, Fikrlar)
     - `/shop` — Mahsulotlar katalogi (jonli qidiruv, saralash va filtrlar)
     - `/product/:id` — Mahsulotning batafsil sahifasi (rasmlar galereyasi, xususiyatlar, sharhlar)
     - `/cart` — Xarid savati (miqdorni o'zgartirish, promokod, narx hisob-kitobi)
     - `/checkout` — Buyurtmani rasmiylashtirish (Telegram xabarnomasi, to'lov usullari)
     - `/wishlist` — Sevimlilar ro'yxati (Izbrannoe)
     - `/about` — Biz haqimizda (tarix, jamoa, statistika)
     - `/contact` — Aloqa va do'kon xaritasi (Leaflet interaktiv xaritasi)
     - `/orders` — Mening buyurtmalarim tarixi va holati
     - `/login` — Kirish va ro'yxatdan o'tish (Login yoki Telefon orqali)
     - `/admin` — Administrator boshqaruv paneli (Dashboard)

4. **🎨 Tailwind CSS:**
   - Eng so'nggi Tailwind CSS v4 integratsiyasi.
   - Chiroyli gradientlar, glassmorphism effektlari, kartalar animatsiyasi va to'liq moslashuvchan (responsive) dizayn.

5. **📄 5+ Sahifali Landing Page & Magazin:**
   - 10 dan ortiq to'liq sahifalar (Bosh sahifa, Do'kon, Mahsulot, Savat, Buyurtma, Sevimlilar, Biz haqimizda, Aloqa, Buyurtmalar, Admin).

6. **📊 Admin Panel + Dashboard:**
   - KPI kartalari: Umumiy tushum (UZS), Jami buyurtmalar, Mahsulotlar soni, Faol promokodlar.
   - Buyurtmalar holatini o'zgartirish: *Kutilmoqda*, *Yetkazilmoqda*, *Yakunlandi*, *Bekor qilindi*.
   - Promokodlar boshqaruvi (foiz yoki belgilangan summa).

7. **🤖 Telegram Bot Integratsiyasi:**
   - Har bir yangi buyurtma va aloqa xabari to'g'ridan-to'g'ri Telegram bot API (`https://api.telegram.org/bot<TOKEN>/sendMessage`) orqali yuboriladi.
   - Admin panelda Bot Token va Chat ID ni kiritish va saqlash imkoniyati.
   - **🔔 Test xabar yuborish** tugmasi.
   - Agar bot token kiritilmagan bo'lsa, xabarlar simulyatsiya rejimida chiroyli interaktiv modalda ko'rsatiladi.

8. **💾 LocalStorage orqali ma'lumotlarni saqlash:**
   - Mahsulotlar ro'yxati (`shop_products_v3`)
   - Savat (`shop_cart`)
   - Sevimlilar (`shop_wishlist`)
   - Foydalanuvchi seansi (`shop_auth_user`)
   - Buyurtmalar tarixi (`shop_orders`)
   - Promokodlar (`shop_promocodes`)
   - Til va Mavzu sozlamalari (`shop_lang`, `shop_theme`)
   - Telegram bot sozlamalari (`shop_telegram_settings`)

9. **🛠️ Mahsulotlarni boshqarish (CRUD):**
   - Yangi mahsulot qo'shish (Add Product modal)
   - Tahrirlash (Edit Product modal)
   - O'chirish (Delete confirmation modal)
   - Ombordagi soni, reyting, chegirmali narx va toifa kiritish.

10. **❤️ Sevimlilar (Izbrannoe / Wishlist):**
    - Har bir kartada yurakcha tugmasi va animatsiya.
    - Sevimlilar sahifasi, bir bosishda savatga o'tkazish yoki tozalash.

11. **🛒 Savatga qo'shish + Promokod tizimi:**
    - Dinamik savat (miqdor +/-/o'chirish).
    - 500 000 so'mdan oshganda bepul yetkazib berish progress-bari.
    - Ishlaydigan sinov promokodlari:
      - `UZBEK2025` — **15% chegirma**
      - `WELCOME10` — **10% chegirma**
      - `NAVROZ` — **20% chegirma**
      - `SUPER50K` — **50 000 so'm chegirma**

12. **🔐 Kirish (Login & Register):**
    - **Login (Username) + Parol** yoki **Telefon raqami (+998) + Parol** orqali kirish.
    - Tezkor 1-bosishda sinov hisoblari:
      - 🔑 **Admin:** `admin` / `admin` (yoki Telefon: `+998901234567` / `admin`)
      - 👤 **Mijoz:** `user` / `user` (yoki Telefon: `+998991234567` / `user`)

13. **🛍️ Zamonaviy Onlayn Magazin:**
    - So'mda formatlangan narxlar (`15 490 000 so'm`).
    - Tezkor ko'rish (Quick View) modali.
    - Aktsiyalar, chegirmalar va yangi mahsulot nishonlari.

14. **🚀 GitHub + Vercel Deployment Tayyor:**
    - `vercel.json` SPA marshrutlash fayli sozlangan.
    - Git orqali oson joylash.

15. **🔍 Qidiruv (Search):**
    - Navbarda real vaqtda tezkor qidiruv takliflari (rasm, narx, nom ko'rsatiladi).
    - `/shop` sahifasida to'liq qidiruv filtri.

16. **⚡ Saralash + Filtr + Sort:**
    - Kategoriyalar (Smartfonlar, Noutbuklar, Quloqchinlar, Soatlar, Texnika, Aksessuarlar).
    - Narx oralig'i (Min - Maks).
    - Faqat omborda mavjudlarini ko'rsatish.
    - Reyting bo'yicha (4+ yulduz).
    - Saralash: *Eng yangilari*, *Arzondan qimmatga*, *Qimmatdan arzonga*, *Mashhurlari*, *Reyting bo'yicha*.

17. **🗺️ Xaritada Do'kon Joylashuvi:**
    - Interaktiv **Leaflet / OpenStreetMap** xaritasi.
    - Filiallar: Toshkent (Amir Temur, Chilonzor), Samarqand va Buxoro.
    - Filial tanlanganda xarita ravon o'tadi (`flyTo`), manzili, telefoni, ish vaqti va Google Xaritalar havolasi chiqadi.

18. **🎙️ Web Speech AI — Ovozli Qidiruv (Voice Search):**
    - Brauzerning mahalliy `SpeechRecognition` API'si orqali ovozni bir zumda matnga o'girib, mahsulotlarni qidirish.
    - O'zbek, rus va ingliz tillarida ovozni tushunish va qidiruv natijalariga yo'naltirish.
    - Jonli audio to'lqinlar animatsiyasi.

19. **♿ Maxsus Imkoniyatlar (Accessibility / A11y Inklyuziv Rejim):**
    - Zaif ko'ruvchilar va maxsus ehtiyojli foydalanuvchilar uchun A11y paneli.
    - Shrift o'lchamini oshirish (A+, A++), yuqori kontrast (High-contrast), monoxrom va tungi filtrlash rejimlar.
    - **Ovozli eshittirish (Text-to-Speech)**: Mahsulot sahifasida tovar nomi, narxi va parametrlarini ovozli o'qib berish.
    - Disleksiya va o'qishni osonlashtirish sozlamalari.

20. **⌨️ Spotlight Command Palette (Ctrl + K / Cmd + K):**
    - macOS Spotlight yoki VS Code Command Palette uslubidagi tezkor universal boshqaruv oynasi.
    - Butun sayt sahifalariga bir zumda sakrash, qidirish, tungi rejim, ovoz, A11y va g'ildirakni klaviaturadan boshqarish.

21. **🎡 Omad G'ildiragi (Lucky Spin the Wheel):**
    - Interaktiv SVG 8 sektorli baraban.
    - 5%, 10%, 15%, 20%, 25% promokodlar, bepul yetkazish va Moderno Coins yutuqlari.
    - Web Audio API orqali mexanik aylanish tovushlari va g'alaba konfettisi.
    - Chiqqan promokodni to'g'ridan-to'g'ri savatchada faollashtirish.
    - Hakamlar va namoyish uchun cheksiz sinov rejimi.

22. **🪙 Moderno Coins — Keshbek va Sodiqlik Tizimi:**
    - Har bir muvaffaqiyatli xariddan 3% keshbek Moderno Coins sifatida hisobga tushadi.
    - Buyurtmani rasmiylashtirishda tangalarni 10% gacha real chegirmaga almashtirish.
    - Navbarda jonli tangalar balansi.

23. **💳 Realistik Fintech To'lov Shlyuzi (Click, Payme, Uzum Pay & Bank Karta):**
    - Karta raqamini kiritish, Uzcard (`8600`), Humo (`9860`), Visa (`4...`) ni avtomatik aniqlash.
    - 3D Secure SMS tasdiqlash kodi simulyatsiyasi (60 soniyali taymer va 1-bosishda test kodi to'ldirish).
    - Muvaffaqiyatli to'lov va tranzaksiya ID generatsiyasi.

24. **🧾 Elektron Fiskal Chek & Invoys (PDF & Print Invoice):**
    - Har bir buyurtma uchun davlat soliq talablariga mos fiskal kvitansiya generatsiyasi (QR-kod, STIR/INN, tovarlar jadvali, QQS 12%).
    - Maxsus `@media print` uslubi orqali brauzer orqali toza PDF yuklab olish va printerdan chop etish.

25. **🚚 Jonli Kuryer Harakati (Live Courier GPS Tracking on Leaflet Map):**
    - Xaritada kuryer skuterining markaziy ombordan mijoz manziliga qarab real vaqtda harakatlanishi.
    - Qolgan vaqt (ETA), kuryer tezligi, ismi, transport vositasi va qo'ng'iroq qilish tugmasi.

26. **🔄 360° Interaktiv Mahsulot Aylantirish (Interactive 360° Viewer):**
    - Mahsulot sahifasida sichqoncha yoki barmoq bilan gorizontal tortib tovarni 360 gradusga har tomondan ko'rish.
    - Avtomatik aylanish, rakurslar (Oldi, Orqa, Yon) va zum boshqaruvi.

27. **📲 Progressive Web App (PWA) & Offline Rejim:**
    - Brauzerdan turib kompyuter yoki telefonga ilova (App) kabi o'rnatish imkoniyati (`manifest.json` va Service Worker).
    - Internet uzilganda ham ma'lumotlarni xotirada saqlash va oflayn ogohlantirish banneri.

---

## 💻 Loyihani Ishga Tushirish:

```bash
# 1. Bog'liqliklarni o'rnatish
npm install

# 2. Dasturchi rejimida ishga tushirish
npm run dev

# 3. Brauzerda ochish:
http://localhost:5173/
```

---

## 🚀 Vercel ga Joylash (Deploy qilish):

1. Loyihani GitHub repositoriyangizga push qiling:
```bash
git init
git add .
git commit -m "Initial commit of Moderno shop"
git branch -M main
git remote add origin <SIZNING_GITHUB_REPO_URL>
git push -u origin main
```

2. [Vercel.com](https://vercel.com) ga kiring:
   - **Add New Project** tugmasini bosing
   - GitHub repositoriyangizni tanlang
   - **Deploy** tugmasini bosing!
   - `vercel.json` fayli allaqachon sozlangan, barcha sahifalar to'g'ri ochiladi.
