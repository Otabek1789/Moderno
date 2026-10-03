import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowRight,
  Send,
  Sparkles,
  ShoppingBag,
  Coins,
  FileText,
  MapPin
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import sound from '../utils/soundFX';
import { formatPrice } from '../utils/formatters';

export default function Checkout() {
  const {
    cart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    grandTotal,
    appliedPromo,
    createOrder,
    modernoCoins,
    useCoins,
    openReceipt,
    openCourierTracking,
    openPayment
  } = useStore();

  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '+998 ',
    address: '',
    note: '',
    paymentMethod: 'click' // 'click' | 'payme' | 'uzum' | 'cash'
  });

  const [useCoinsDiscount, setUseCoinsDiscount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Maximum usable coins: up to 10% of total amount or available coins
  const maxUsableCoins = Math.min(modernoCoins || 0, Math.round(grandTotal * 0.1));
  const finalPayableTotal = useCoinsDiscount ? Math.max(0, grandTotal - maxUsableCoins) : grandTotal;

  if (cart.length === 0 && !createdOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          Savatingiz bo'sh
        </h2>
        <Link
          to="/shop"
          className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold inline-block"
        >
          Katalogga o'tish
        </Link>
      </div>
    );
  }

  const finalizeOrder = async (finalAmount, paymentTxn = null) => {
    setIsSubmitting(true);
    try {
      if (useCoinsDiscount && maxUsableCoins > 0) {
        useCoins(maxUsableCoins);
      }

      const order = await createOrder({
        customerName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        paymentMethod: formData.paymentMethod,
        note: formData.note
      });

      if (paymentTxn) {
        order.transactionId = paymentTxn.transactionId;
      }

      sound.playSuccess();
      confetti({
        particleCount: 130,
        spread: 80,
        origin: { y: 0.6 }
      });

      setCreatedOrder(order);
    } catch (err) {
      console.error(err);
      alert("Buyurtma yuborishda xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      alert("Iltimos, ism, telefon va manzil maydonlarini to'ldiring!");
      return;
    }

    // If online fintech payment is chosen, open simulated Payment Gateway!
    if (['click', 'payme', 'uzum'].includes(formData.paymentMethod)) {
      openPayment({
        amount: finalPayableTotal,
        method: formData.paymentMethod,
        phone: formData.phone,
        onSuccess: (txn) => {
          finalizeOrder(finalPayableTotal, txn);
        }
      });
      return;
    }

    // Cash / COD
    await finalizeOrder(finalPayableTotal);
  };

  // Order Success Screen
  if (createdOrder) {
    const earnedCashback = Math.round((createdOrder.totalAmount || 0) * 0.03);

    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fadeIn">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
          {t('checkout.successTitle')}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto mb-6">
          {t('checkout.successSub', { orderId: createdOrder.id })}
        </p>

        {/* Cashback Coins Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 flex items-center justify-center gap-3">
          <Coins className="w-6 h-6 text-amber-500 animate-pulse" />
          <div className="text-left">
            <p className="font-extrabold text-sm sm:text-base">
              +{earnedCashback.toLocaleString()} Moderno Coin hisobingizga tushdi!
            </p>
            <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
              Ushbu tangalarni keyingi xaridlarda chegirmaga almashtirishingiz mumkin.
            </p>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 text-left mb-8 shadow-sm space-y-4 text-xs sm:text-sm">
          <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-slate-400">Buyurtma raqami:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              #{createdOrder.id}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-slate-400">Mijoz:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {createdOrder.customerName} ({createdOrder.phone})
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-slate-400">Yetkazish manzili:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {createdOrder.address}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-slate-400">To'lov turi:</span>
            <span className="font-semibold uppercase text-indigo-600 dark:text-indigo-400">
              {createdOrder.paymentMethod}
            </span>
          </div>
          <div className="flex justify-between items-baseline pt-2">
            <span className="font-bold text-slate-900 dark:text-slate-100">Jami to'lov:</span>
            <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
              {formatPrice(createdOrder.totalAmount)}
            </span>
          </div>
        </div>

        {/* Action Buttons: Electronic Receipt & Live Map */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <button
            onClick={() => {
              sound.playClick();
              openReceipt(createdOrder);
            }}
            className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <FileText className="w-4 h-4" /> 🧾 Elektron Fiskal Chek (PDF)
          </button>

          <button
            onClick={() => {
              sound.playClick();
              openCourierTracking(createdOrder);
            }}
            className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Truck className="w-4 h-4" /> 🚚 Kuryerni Xaritada Kuzatish
          </button>
        </div>

        <div className="flex gap-4 justify-center text-xs">
          <Link
            to="/orders"
            className="text-slate-500 hover:text-indigo-600 underline font-semibold"
          >
            {t('checkout.viewOrders')}
          </Link>
          <span className="text-slate-300">•</span>
          <Link
            to="/shop"
            className="text-slate-500 hover:text-indigo-600 underline font-semibold"
          >
            {t('checkout.continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-8">
        {t('checkout.title')}
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left: Customer & Delivery Details Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Truck className="w-5 h-5 text-indigo-600" />
              {t('checkout.contactInfo')}
            </h2>

            {/* Name */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                {t('checkout.fullName')} *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="masalan: Azizbek Karimov"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                {t('checkout.phone')} *
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

            {/* Address */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                {t('checkout.deliveryAddress')} *
              </label>
              <textarea
                required
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder={t('checkout.addressPlaceholder')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* Note */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                {t('checkout.orderNote')}
              </label>
              <input
                type="text"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="masalan: Qulay yetkazish vaqti yoki dom kodi"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              {t('checkout.paymentMethod')}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Click */}
              <label
                className={`p-3.5 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  formData.paymentMethod === 'click'
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="click"
                  checked={formData.paymentMethod === 'click'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="sr-only"
                />
                <span className="font-black text-sm text-blue-600">CLICK</span>
                <span className="text-[11px] text-slate-400 mt-2">Onlayn to'lov</span>
              </label>

              {/* Payme */}
              <label
                className={`p-3.5 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  formData.paymentMethod === 'payme'
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="payme"
                  checked={formData.paymentMethod === 'payme'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="sr-only"
                />
                <span className="font-black text-sm text-teal-500">PAYME</span>
                <span className="text-[11px] text-slate-400 mt-2">Onlayn to'lov</span>
              </label>

              {/* Uzum Pay */}
              <label
                className={`p-3.5 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  formData.paymentMethod === 'uzum'
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="uzum"
                  checked={formData.paymentMethod === 'uzum'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="sr-only"
                />
                <span className="font-black text-sm text-purple-600">UZUM / KARTA</span>
                <span className="text-[11px] text-slate-400 mt-2">Humo & Uzcard</span>
              </label>

              {/* Cash */}
              <label
                className={`p-3.5 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  formData.paymentMethod === 'cash'
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="sr-only"
                />
                <span className="font-black text-sm text-slate-900 dark:text-slate-100">NAQD PUL</span>
                <span className="text-[11px] text-slate-400 mt-2">Kuryerga to'lash</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Review & Telegram Notification Notice (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {t('cart.orderSummary')}
            </h2>

            {/* Items summary */}
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt=""
                      className="w-10 h-10 object-cover rounded-lg bg-slate-100 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-slate-400 text-xs">x {item.quantity} dona</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 shrink-0">
                    {formatPrice((item.product.discountPrice || item.product.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Moderno Coins Loyalty Discount Box */}
            {modernoCoins > 0 && maxUsableCoins > 0 && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Coins className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <p className="font-extrabold text-xs text-amber-800 dark:text-amber-300">
                      Moderno Coins chegirmasi
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Balans: {modernoCoins.toLocaleString()} • Chegirma: -{formatPrice(maxUsableCoins)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playCoin();
                    setUseCoinsDiscount(!useCoinsDiscount);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 shrink-0 ${
                    useCoinsDiscount
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {useCoinsDiscount ? "Ishlatildi ✓" : "Ishlatish"}
                </button>
              </div>
            )}

            {/* Calculations */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>{t('cart.subtotal')}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{formatPrice(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>{t('cart.discount')} ({appliedPromo?.code})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              {useCoinsDiscount && maxUsableCoins > 0 && (
                <div className="flex justify-between text-amber-500 font-bold">
                  <span>🪙 Coins chegirmasi:</span>
                  <span>-{formatPrice(maxUsableCoins)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>{t('cart.shipping')}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {shippingFee === 0 ? <span className="text-emerald-500 font-bold">{t('cart.free')}</span> : formatPrice(shippingFee)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
                <span className="font-extrabold text-base text-slate-900 dark:text-slate-100">{t('cart.grandTotal')}</span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {formatPrice(finalPayableTotal)}
                </span>
              </div>
            </div>

            {/* Telegram Notice */}
            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs text-sky-800 dark:text-sky-300 flex items-start gap-2.5">
              <Send className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <span>{t('checkout.telegramNotice')}</span>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-70"
            >
              {isSubmitting ? (
                <span>{t('checkout.processing')}</span>
              ) : (
                <>
                  <span>To'lash & Tasdiqlash: {formatPrice(finalPayableTotal)}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
