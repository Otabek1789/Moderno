import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import MapComponent from '../components/common/MapComponent';
import { sendTelegramMessage, formatContactTelegramMessage } from '../utils/telegram';

export default function Contact() {
  const { t } = useLanguage();
  const { telegramSettings, setTelegramModal } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '+998 ',
    email: '',
    message: ''
  });

  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      alert("Iltimos, ism, telefon va xabar matnini to'ldiring!");
      return;
    }

    setIsSending(true);

    try {
      const messageText = formatContactTelegramMessage(formData);
      const res = await sendTelegramMessage(
        telegramSettings.botToken,
        telegramSettings.chatId,
        messageText
      );

      setTelegramModal({
        isOpen: true,
        title: res.success ? "Aloqa Xabari Telegramga Yuborildi!" : "Aloqa Xabari Simulyatsiyasi",
        text: messageText,
        isReal: res.success
      });

      setSentSuccess(true);
      setFormData({ name: '', phone: '+998 ', email: '', message: '' });
      setTimeout(() => setSentSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      alert("Xabar yuborishda xatolik yuz berdi");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          <Sparkles className="w-3.5 h-3.5" /> MODERNO Showroom & Aloqa
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {t('contact.title')}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('contact.subtitle')}
        </p>
      </div>

      {/* 1. Interactive Leaflet Store Map */}
      <section className="space-y-4">
        <MapComponent />
      </section>

      {/* 2. Contact Message Form & Info Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-6">
        
        {/* Left: Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {t('contact.sendMessage')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t('contact.sendMessageSub')}
            </p>
          </div>

          {sentSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>{t('contact.messageSent')}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  {t('contact.yourName')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="masalan: Sardor"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  {t('contact.yourPhone')} *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+998 90 123 45 67"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                {t('contact.yourEmail')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="masalan: sardor@mail.uz"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                {t('contact.yourMessage')} *
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Savol yoki taklifingizni yozing..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-70"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? "Yuborilmoqda..." : t('contact.sendBtn')}</span>
            </button>
          </form>
        </div>

        {/* Right: Direct Contacts Info (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Bog'lanish Ma'lumotlari
            </h3>

            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">Bosh ofis</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Toshkent sh., Amir Temur shox ko'chasi 107B</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">Yagona Call-markaz</h4>
                  <p className="text-xs text-slate-400 mt-0.5">+998 71 200 44 44</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">Elektron pochta</h4>
                  <p className="text-xs text-slate-400 mt-0.5">support@moderno.uz</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">Ish vaqti</h4>
                  <p className="text-xs text-slate-400 mt-0.5">09:00 - 21:00 (dam olish kunisiz)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Telegram direct badge */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-transparent border border-sky-500/20 text-xs sm:text-sm">
            <h4 className="font-bold text-sky-700 dark:text-sky-300 flex items-center gap-2 mb-2">
              <Send className="w-4 h-4 text-sky-500" />
              {t('contact.telegramLiveNotice')}
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Ushbu sahifadagi har qanday xabar to'g'ridan-to'g'ri do'kon boshqaruvchisining Telegram botiga tezkor yetkaziladi.
            </p>
          </div>
        </div>

      </section>

    </div>
  );
}
