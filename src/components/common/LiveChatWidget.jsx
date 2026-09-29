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
  const { telegramSettings } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Assalomu alaykum! 👋 Men MODERNO AI yordamchisiman. Sizga tovarlar, narxlar yoki yetkazib berish bo'yicha qanday yordam bera olaman?",
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
    {
      q: "🚚 Yetkazib berish qancha vaqt oladi?",
      a: "Toshkent shahri bo'ylab buyurtma berilgan kunda 3-6 soatda yetkaziladi. 500 000 so'mdan yuqori xaridlarga yetkazib berish BEPUL! Viloyatlarga esa 24-48 soat ichida yetkazib beramiz."
    },
    {
      q: "💳 Bo'lib to'lash (nasiya) shartlari qanday?",
      a: "Bizda Uzum Nasiya, Anorbank, Alif va Zoodpay orqali 3, 6, 12 va 24 oyga 0% boshlang'ich to'lov bilan bo'lib to'lash mumkin! Pasportingiz bo'lsa kifoya."
    },
    {
      q: "🛡 Mahsulotlarga rasmiy kafolat bormi?",
      a: "Albatta! Barcha smartfonlar, noutbuklar va gadjetlarga 12 oylik rasmiy servis kafolati beriladi. 14 kun ichida nuqson aniqlansa, darhol almashtirib beramiz."
    },
    {
      q: "📞 Operator bilan bog'lanish",
      a: "Jonli operatorimiz bilan Telegram orqali bog'lanishingiz mumkin: @nekitekibeki_bot yoki telefon: +998 (90) 123-45-67."
    }
  ];

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

    // Check FAQ matches or generate smart answer
    setTimeout(() => {
      const match = quickFaqs.find(
        (f) =>
          f.q.toLowerCase().includes(text.toLowerCase()) ||
          text.toLowerCase().includes('yetkaz') ||
          (text.toLowerCase().includes('nasiya') && f.q.includes('nasiya')) ||
          (text.toLowerCase().includes('kafolat') && f.q.includes('kafolat')) ||
          (text.toLowerCase().includes('operator') && f.q.includes('operator'))
      );

      let reply = match
        ? match.a
        : "Savolingiz uchun rahmat! Operatorimiz xabaringizni qabul qildi va tez orada siz bilan bog'lanadi. Agar shoshilinch bo'lsa, Telegram botimizga (@" +
          telegramSettings.botUsername +
          ") yozishingiz mumkin.";

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
    }, 800);
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white flex items-center justify-center shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all group"
          title="Onlayn yordamchi"
        >
          <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-ping" />
          )}
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
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
                  <p className="leading-relaxed">{m.text}</p>
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
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] whitespace-nowrap transition"
              >
                {faq.q.split(' ')[0]} {faq.q.split(' ')[1]}
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
