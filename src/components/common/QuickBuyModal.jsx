import React, { useState } from 'react';
import { X, Zap, Phone, User, CheckCircle2, ShieldCheck, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatters';

export default function QuickBuyModal() {
  const { quickBuyModal, closeQuickBuy, createOrder, telegramSettings } = useStore();
  const { t } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' | 'installment' | 'click'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!quickBuyModal.isOpen || !quickBuyModal.product) return null;

  const product = quickBuyModal.product;
  const activePrice = product.discountPrice || product.price;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || phone.trim().length < 9) {
      alert("Iltimos, ismingiz va to'liq telefon raqamingizni kiriting!");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create quick order
      const newOrder = await createOrder({
        customerName: fullName.trim(),
        phone: phone.trim(),
        address: "Tezkor 1-klik xaridi (Mijoz bilan bog'lanib aniqlanadi)",
        paymentMethod,
        note: `⚡ 1-BOSISHDA TEZKOR XARID: Mahsulot: ${product.name} (ID: ${product.id})`
      });

      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        closeQuickBuy();
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi, qaytadan urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                {t('quickBuy.title')}
              </h3>
              <p className="text-[11px] text-white/80">
                10 daqiqada tasdiqlash & tezkor yetkazish
              </p>
            </div>
          </div>

          <button
            onClick={closeQuickBuy}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3 animate-scaleUp">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                {t('quickBuy.successTitle')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                {t('quickBuy.successSub')}
              </p>
            </div>
          ) : (
            <>
              {/* Product preview card */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-14 object-cover rounded-xl bg-white shadow-xs shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                    {product.name}
                  </h5>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                      {formatPrice(activePrice)}
                    </span>
                    {product.discountPrice && (
                      <span className="text-[11px] text-slate-400 line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('reviews.yourName')} *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t('quickBuy.namePlaceholder')}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-100"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Telefon raqamingiz *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('quickBuy.phonePlaceholder')}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-100 font-mono"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    To'lov turi
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-2 rounded-xl border font-semibold text-center transition ${
                        paymentMethod === 'cash'
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 dark:bg-indigo-950/40'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Qabulda to'lash
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('click')}
                      className={`p-2 rounded-xl border font-semibold text-center transition ${
                        paymentMethod === 'click'
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 dark:bg-indigo-950/40'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Click / Payme
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('installment')}
                      className={`p-2 rounded-xl border font-semibold text-center transition ${
                        paymentMethod === 'installment'
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 dark:bg-indigo-950/40'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Nasiya (Bo'lib)
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Ma'lumotlaringiz xavfsizligi kafolatlanadi</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{t('quickBuy.processing')}</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t('quickBuy.submitBtn')}</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
