import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ExternalLink,
  Phone,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { sendTelegramMessage } from '../../utils/telegram';

export default function LiveChatWidget() {
  const { t } = useLanguage();
  const { telegramSettings, products } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Assalomu alaykum! 👋 Men MODERNO AI yordamchisiman.\nSizga do'kondagi har qanday tovar, narxlar, yetkazib berish, kafolat, nasiya (bo'lib to'lash), promokodlar va buyurtmalar bo'yicha yordam bera olaman. Hohlagan savolingizni bering!",
      time: "Hozir"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const quickFaqs = [
    { q: "🔥 Qanday promokodlar bor?", short: "🔥 Promokodlar" },
    { q: "🚚 Yetkazib berish shartlari qanday?", short: "🚚 Yetkazish" },
    { q: "💳 Bo'lib to'lash (nasiya) bormi?", short: "💳 Nasiya" },
    { q: "🛡 Kafolat va qaytarish qoidalari qanday?", short: "🛡 Kafolat" },
    { q: "📍 Do'kon manzillari qayerda?", short: "📍 Manzillar" },
    { q: "📱 MODERNO Ilovasini yuklab olish", short: "📱 Ilova" },
    { q: "💻 PC Builder qanday ishlaydi?", short: "💻 PC Yig'ish" },
    { q: "📞 Operator bilan bog'lanish", short: "📞 Bog'lanish" }
  ];

  const generateAIResponse = (rawQuery) => {
    const query = rawQuery.toLowerCase().trim();
    const formatUZS = (val) => new Intl.NumberFormat('uz-UZ').format(val) + " so'm";

    // 1. Greetings
    if (/^(salom|assalom|qalaysiz|qaleysiz|privet|hello|hi|qandaysiz|ahvollar|charchamang)/i.test(query)) {
      return "Assalomu alaykum! 👋 Men MODERNO AI yordamchisiman.\nSizga saytimizdagi istalgan tovar, narxlar, yetkazib berish, kafolat, bo'lib to'lash (nasiya), promokodlar va buyurtmalar bo'yicha yordam bera olaman.\nQanday savolingiz bor?";
    }

    // 2. Creator / About Developer / Moderno
    if (/(kim yaratgan|muallif|dasturchi|avtor|otabek|kim qilgan|kim yasagan|moderno nima|platforma haqida)/i.test(query)) {
      return "MODERNO — O'zbekistondagi eng ilg'or elektronika va gadjetlar onlayn do'koni. Loyiha dasturchi Otabek tomonidan eng zamonaviy texnologiyalar (React, Vite, PWA ilovasi, Telegram WebApp integratsiyasi) asosida yaratilgan. Maqsadimiz — xaridorlarga tezkor, qulay va 100% ishonchli xizmat ko'rsatish!";
    }

    // 3. Promocodes & Discounts
    if (/(promokod|promocode|kupon|chegirma|skidka|aksiya|uzbek2026|uzbek2025|bonus kod)/i.test(query)) {
      return "Hozirgi kunda quyidagi faol promokodlarimiz mavjud:\n🔥 UZBEK2026 — 15% bayramona maxsus chegirma!\n🎁 WELCOME10 — birinchi xarid uchun 10% chegirma;\n🌿 NAVROZ — 20% bahorgi mega chegirma;\n💰 SUPER50K — 50 000 so'm naqd chegirma.\n\n💡 Savatchaga kirib, promokod maydoniga 'UZBEK2026' deb yozsangiz, darhol 15% chegirma hisoblanadi!";
    }

    // 4. Delivery / Shipping / Dostavka
    if (/(yetkaz|dostavka|yetkazib berish|pochta|kuryer|qancha vaqtda|qachon keladi|viloyat|toshkent|necha kunda)/i.test(query)) {
      return "Yetkazib berish shartlari:\n🚀 Toshkent shahri: Buyurtma qilingan kuni 3-6 soat ichida eshikkacha yetkaziladi!\n📦 Barcha viloyatlar (Samarqand, Buxoro, Farg'ona, Andijon, Namangan va butun O'zbekiston): 24-48 soat ichida kuryer orqali yetkaziladi.\n🎉 500 000 so'mdan yuqori xaridlarga yetkazib berish MUTLAQO BEPUL! 500 mingdan kam bo'lsa: Toshkentda 25 000 so'm, viloyatlarga 40 000 so'm.";
    }

    // 5. Payment Methods
    if (/(to'lov|tolov|oplata|qanday to'layman|click|payme|uzum pay|naqd|karta|terminal|plastik)/i.test(query) && !/(nasiya|kredit|bo'lib to'lash|muddatli)/i.test(query)) {
      return "Bizda quyidagi to'lov turlari mavjud:\n💳 Onlayn to'lov: Click, Payme va Uzum Bank orqali xavfsiz to'lov;\n💵 Naqd pul: Buyurtma yetkazilganda kuryerga mahsulotni ko'rib to'lash;\n🧾 Rasmiy chek: Har bir xarid uchun 12% QQS ko'rsatilgan QR-kodli fiskal chek taqdim etiladi.";
    }

    // 6. Installments / Nasiya / Kredit
    if (/(nasiya|bo'lib to'lash|bolib tolash|kredit|muddatli to'lov|rassrochka|anorbank|uzum nasiya|alif|zoodpay)/i.test(query)) {
      return "Bo'lib to'lash (Nasiya) imkoniyatlari:\n✨ Hamkorlarimiz: Uzum Nasiya, Anorbank, Alif va Zoodpay;\n📅 Muddat: 3, 6, 12 yoki 24 oyga;\n💸 Boshlang'ich to'lov: 0% (oldindan pul talab qilinmaydi);\n📄 Talab qilinadigan hujjat: Faqat pasport yoki ID karta (tasdiqlash onlayn 2 daqiqada amalga oshiriladi).";
    }

    // 7. Warranty & Returns
    if (/(kafolat|garantiya|qaytarish|brak|nuqson|vazvrat|almashtir|original|ishlamasa)/i.test(query)) {
      return "Kafolat va qaytarish qoidalari:\n🛡 100% Rasmiy va Original: Barcha smartfonlar, noutbuklar va gadjetlarga 12 oylik rasmiy servis kafolati beriladi.\n🔄 14 kunlik almashtirish: Agar mahsulotda zavod nuqsoni aniqlansa, uni 14 kun ichida yangisiga bepul almashtirib beramiz yoki pulingizni to'liq qaytarib beramiz.";
    }

    // 8. Branches, Address & Working Hours
    if (/(manzil|adres|qayerda joylashgan|filial|lokatsiya|do'kon qayerda|qayerdasiz|ish vaqti|xarita)/i.test(query)) {
      return "MODERNO do'konlari manzillari:\n📍 Bosh do'kon: Toshkent sh., Amir Temur shoh ko'chasi 108 (Metro Minor yaqinida).\n📍 2-filial: Toshkent sh., Chilonzor 9-mavze, 24-uy.\n📍 Samarqand filiali: Universitet xiyoboni 12.\n📍 Buxoro filiali: B. Naqshband ko'chasi 45.\n⏰ Ish vaqti: Har kuni 09:00 dan 22:00 gacha, dam olish kunlarisiz!\n🗺 Bosh sahifamizning pastida interaktiv xarita mavjud.";
    }

    // 9. Contacts & Phone
    if (/(telefon|aloqa|kontakt|nomer|bog'lanish|operator|call center|admin bilan)/i.test(query)) {
      const botUser = telegramSettings?.botUsername || 'nekitekibeki_bot';
      return `Biz bilan bog'lanish:\n📞 Telefon: +998 (90) 123-45-67\n🤖 Telegram bot: @${botUser}\nTelegram orqali ham to'g'ridan-to'g'ri buyurtma berishingiz va savollaringizga tezkor javob olishingiz mumkin!`;
    }

    // 10. Moderno App / PWA Download
    if (/(ilova|app|yuklab olish|skachat|download|apk|pwa|o'rnatish|ornatish)/i.test(query)) {
      return "MODERNO ilovasini yuklab olish juda qulay:\n📱 Ekranning pastki chap qismida chiqadigan 'MODERNO Ilovasini yuklab olish' oynasidagi 'Yuklab olish' tugmasini bosing.\n💡 Yoki telefon brauzeringiz menyusini ochib (⋮ yoki Share tugmasi), 'Bosh ekranga qo'shish' (Add to Home Screen) opsiyasini tanlang. Ilova internetsiz ham tezkor ishlaydi!";
    }

    // 11. PC Builder
    if (/(pc builder|kompyuter yig'ish|pk yig'ish|kompyuter konstruktor|kompyuter terish)/i.test(query)) {
      return "💻 Bizda maxsus 'PC Builder' (Kompyuter konstruktori) xizmati bor!\nYuqori menyudagi 'PC Yig'ish' bo'limiga kiring: u yerda protsessor (CPU), videokarta (GPU), RAM va ona plata kabi qismlarni o'zaro mosligini avtomatik tekshirib, o'zingizga mos o'yin yoki ofis kompyuterini yig'ishingiz mumkin!";
    }

    // 12. Trade-in
    if (/(trade-in|trade in|eski telefon|almashtirish|eski gadjet)/i.test(query)) {
      return "🔄 Trade-In xizmati:\nEski telefoningiz yoki noutbukingizni yangisiga qulay narxda almashtirishingiz mumkin! Menyu orqali 'Trade-In' sahifasiga o'ting, qurilmangiz modelini tanlang va onlayn narxini hisoblab oling!";
    }

    // 13. Mystery Box
    if (/(mystery box|mistik quti|yutuq|omad|sovg'a quti)/i.test(query)) {
      return "🎁 'Mystery Box' bo'limida omadingizni sinab ko'ring!\nKichik to'lov evaziga qimmatbaho Apple iPhone, noutbuk yoki zamonaviy quloqchinlarni yutib olishingiz mumkin. Barcha sovg'alar 100% original!";
    }

    // 14. Moderno Coins & Cashback
    if (/(coin|tanga|keshbek|cashback|ball|bonus)/i.test(query)) {
      return "🪙 MODERNO Coins — keshbek tizimi:\n• Ro'yxatdan o'tganingizda 50 000 tanga bonus olasiz;\n• Har bir xaridingizdan foiz hisobida keshbek tangalari hisobingizga tushadi;\n• 1 tanga = 1 so'm. Keyingi xaridlarda chegirma sifatida qo'llashingiz mumkin!";
    }

    // 15. How to place an order
    if (/(qanday buyurtma|qanday olaman|zakaz berish|sotib olish|qanday sotib)/i.test(query)) {
      return "Buyurtma berish tartibi:\n1. O'zingizga yoqqan mahsulot sahifasida 'Savatga qo'shish' yoki '1 klikda xarid' tugmasini bosing;\n2. Savatga o'tib, 'UZBEK2026' promokodini kiriting (-15% chegirma);\n3. Manzil va telefoningizni yozib buyurtmani tasdiqlang;\n4. Xabarnoma Telegram orqali ham yuboriladi va kuryerimiz tezda mahsulotni yetkazadi!";
    }

    // 16. Admin
    if (/(admin|admin panel|parol|boshqaruvchi)/i.test(query)) {
      return "Admin paneliga kirish uchun menyudagi yoki '/admin' havolasidan foydalanishingiz mumkin. Sinov uchun login: 'admin', parol: 'admin'.";
    }

    // 17. Gratitude
    if (/(rahmat|raxmat|tashakkur|katta rahmat|spasibo|thank)/i.test(query)) {
      return "Arzimaydi! 😊 MODERNO bilan xarid qilish yanada yoqimli bo'lsin! Yana savollaringiz bo'lsa, har doim yordamga tayyorman.";
    }

    // 18. Dynamic Product Search & Inquiries
    if (products && products.length > 0) {
      if (/(eng arzon|arzonroq|eng kam)/i.test(query)) {
        const sorted = [...products].sort((a, b) => a.price - b.price);
        const top3 = sorted.slice(0, 3);
        return `Bizdagi eng hamyonbop mahsulotlar:\n` +
          top3.map((p, i) => `${i + 1}. 🏷️ ${p.name} — ${formatUZS(p.price)} (⭐ ${p.rating})`).join('\n') +
          `\n\n💡 'UZBEK2026' promokodi bilan yanada 15% arzonroq olasiz!`;
      }

      if (/(eng qimmat|flagman|top tovar|eng zo'r)/i.test(query)) {
        const sorted = [...products].sort((a, b) => b.price - a.price);
        const top3 = sorted.slice(0, 3);
        return `Bizdagi eng sara flagman mahsulotlar:\n` +
          top3.map((p, i) => `${i + 1}. ⭐ ${p.name} — ${formatUZS(p.price)} (⭐ ${p.rating})`).join('\n') +
          `\n\nBarcha flagmanlarga 12 oylik rasmiy kafolat va bepul yetkazib berish taqdim etiladi!`;
      }

      const words = query.split(/\s+/).filter((w) => w.length >= 3);
      const matched = products.filter((p) => {
        const name = (p.name || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        return words.some((w) => name.includes(w) || cat.includes(w) || desc.includes(w));
      });

      if (matched.length > 0) {
        const topMatches = matched.slice(0, 3);
        return `Siz so'ragan bo'yicha quyidagi mahsulotlarimiz bor:\n\n` +
          topMatches.map((p, i) => `${i + 1}. 📦 ${p.name}\n   💵 Narxi: ${formatUZS(p.price)}${p.oldPrice ? ` (eski: ${formatUZS(p.oldPrice)})` : ''}\n   ⭐ Reyting: ${p.rating} | Kafolat: 12 oy`).join('\n\n') +
          `\n\n💡 Savatchaga qo'shib 'UZBEK2026' promokodini ishlatsangiz, 15% chegirmaga ega bo'lasiz!`;
      }
    }

    // 19. Intelligent General Fallback
    const botUser = telegramSettings?.botUsername || 'nekitekibeki_bot';
    return `Savolingiz uchun tashakkur! 😊\nMODERNO AI yordamchisi sifatida sizga saytimiz bo'yicha har qanday ma'lumotni bera olaman:\n• Tovar narxlari va mavjudligi (masalan: "iPhone narxi qancha?", "noutbuklar bormi?")\n• Yetkazib berish muddatlari va bepul dostavka;\n• "UZBEK2026" (-15%) va boshqa faol promokodlar;\n• Nasiya (bo'lib to'lash) shartlari;\n• Do'kon manzillari, kafolat va xizmatlar.\n\nAgar savolingiz maxsus bo'lsa, operatorimiz bilan bog'lanishingiz mumkin: +998 (90) 123-45-67 yoki Telegram: @${botUser}.`;
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Forward question to Telegram Bot in background
    if (telegramSettings?.botToken && telegramSettings?.chatId) {
      sendTelegramMessage(
        telegramSettings.botToken,
        telegramSettings.chatId,
        `💬 <b>Yangi Chat Savoli:</b>\n<i>"${text.trim()}"</i>`
      ).catch(() => {});
    }

    // Intelligent AI response answering any user query
    setTimeout(() => {
      const reply = generateAIResponse(text);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/40 hover:scale-110 active:scale-95 transition-all group animate-float animate-glow"
          title="Onlayn yordamchi"
        >
          <MessageCircle className="w-7 h-7 group-hover:scale-115 group-hover:rotate-12 transition-transform duration-300" />
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-ping" />
          )}
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-heartbeat" />
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[520px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-scaleUp">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-indigo-600 rounded-full" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm leading-tight flex items-center gap-1.5">
                  <span>{t('liveChat.title')}</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h4>
                <p className="text-[11px] text-white/80">{t('liveChat.status')}</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60 dark:bg-slate-950/40 text-xs sm:text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] p-3 rounded-2xl space-y-1 shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                  <span
                    className={`text-[9px] block text-right ${
                      m.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Bot className="w-4 h-4 animate-bounce" />
                <span>Yozilmoqda...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Pills */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex gap-1.5 overflow-x-auto scrollbar-none">
            {quickFaqs.map((faq, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(faq.q)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium whitespace-nowrap transition"
              >
                {faq.short || faq.q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('liveChat.inputPlaceholder')}
              className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition shadow-md shadow-indigo-600/20 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
