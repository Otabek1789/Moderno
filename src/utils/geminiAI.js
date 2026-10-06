// Google Gemini AI integratsiyasi
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

/**
 * Haqiqiy Google Gemini API orqali javob olish funksiyasi
 * @param {Object} params
 * @param {string} params.message - Foydalanuvchi savoli
 * @param {Array} params.history - Oldingi suhbatlar tarixi
 * @param {Array} params.products - Saytdagi mahsulotlar ro'yxati
 * @returns {Promise<string>}
 */
export async function askGemini({ message, history = [], products = [] }) {
  const apiKey = GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey.length < 10) {
    return null; // API kalit berilmagan bo'lsa fallback ishlaydi
  }

  // Saytdagi mahsulotlar haqida qisqacha ma'lumot tayyorlash
  const productSummary = (products || []).slice(0, 30).map(p => {
    const price = p.discountPrice || p.price;
    return `- ${p.name} (${p.category}): ${new Intl.NumberFormat('uz-UZ').format(price)} so'm [Omborda: ${p.stock > 0 ? `${p.stock} dona` : 'mavjud emas'}]`;
  }).join('\n');

  const systemInstruction = `Siz MODERNO onlayn elektronika do'konining rasmiy va juda aqlli, xushmuomala Google Gemini AI yordamchisisiz.
Loyihani yaratuvchi va bosh dasturchi: Otabek.

Siz quyidagi barcha ma'lumotlarni mukammal bilasiz:
1. DO'KON MAHSULOTLARI:
${productSummary || 'iPhone 15 Pro, Samsung Galaxy S24 Ultra, MacBook Pro M3, Sony WH-1000XM5, AirPods Pro 2 va boshqa ko\'plab texnikalar.'}

2. AKSIYALAR VA PROMOKODLAR:
- "UZBEK2026" — 15% bayramona maxsus chegirma! (Eng zo'r promokod)
- "WELCOME10" — birinchi xarid uchun 10% chegirma
- "NAVROZ" — 20% bahorgi mega chegirma
- "SUPER50K" — 50 000 so'm chegirma

3. YETKAZIB BERISH VA TO'LOV:
- Toshkent: buyurtma berilgan kuni 3-6 soatda eshikkacha yetkaziladi.
- Barcha viloyatlar: 24-48 soat ichida.
- 500 000 so'mdan oshsa — yetkazib berish MUTLAQO BEPUL! (Kam bo'lsa Toshkent 25 000 so'm, viloyatlar 40 000 so'm).
- To'lov turlari: Click, Payme, Uzum Bank, Naqd pul va fiskal chek bilan.

4. BO'LIB TO'LASH (NASIYA / KREDIT):
- Hamkorlar: Uzum Nasiya, Anorbank, Alif, Zoodpay.
- 0% boshlang'ich to'lov, 3 oydan 24 oygacha, faqat pasport yoki ID karta bilan 2 daqiqada tasdiqlanadi.

5. KAFOLAT VA SERVIS:
- 100% original tovarlar, 12 oylik rasmiy kafolat, 14 kun ichida nuqson aniqlansa yangisiga almashtirish yoki pulni to'liq qaytarish kafolati.

6. BOG'LANISH VA DO'KONLAR:
- Telegram bot: @nekitekibeki_bot
- Bosh do'kon: Toshkent sh., Amir Temur shox ko'chasi 108 (Metro Minor).
- Telefon: +998 71 200 44 44

MUHIM QOIDALAR:
- Foydalanuvchi sayt haqida so'rasa, yuqoridagi aniq ma'lumotlar bilan yordam bering.
- Agar foydalanuvchi do'kondan tashqari boshqa har qanday savol bersa (masalan: texnologiyalar, telefon tanlash bo'yicha maslahatlar, matematika, hayotiy savollar, dasturlash yoki shunchaki suhbatlashish) — GEMINI AI sifatida hamma savoliga to'liq, aqlli, qiziqarli va do'stona javob bering!
- Foydalanuvchi qaysi tilda yozsa, o'sha tilda (asosan o'zbek tilida) javob qaytaring. Emoji belgilaridan o'rnida foydalaning.`;

  // Gemini chat formati
  const contents = [];

  // Tarix
  const recentHistory = (history || []).slice(-6);
  for (const h of recentHistory) {
    contents.push({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    });
  }

  // Yangi savol
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const apiEndpoints = [
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
  ];

  for (const url of apiEndpoints) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800
          }
        })
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidateText && candidateText.trim()) {
        return candidateText.trim();
      }
    } catch (err) {
      console.warn("Gemini fetch error on", url, err);
    }
  }

  return null;
}
