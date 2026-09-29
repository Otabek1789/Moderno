import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Tag,
  Check,
  Percent,
  Truck,
  Sparkles,
  X,
  Rocket
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import RecentlyViewed from '../components/common/RecentlyViewed';
import { formatPrice } from '../utils/formatters';

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    shippingFee,
    discountAmount,
    grandTotal,
    appliedPromo,
    applyPromo,
    removePromo
  } = useStore();

  const { t } = useLanguage();
  const [promoInput, setPromoInput] = useState('');
  const [promoStatus, setPromoStatus] = useState(null); // { type: 'success' | 'error', message: string }

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const res = applyPromo(promoInput);
    if (res.success) {
      setPromoStatus({ type: 'success', message: t('cart.promoApplied') });
      setPromoInput('');
    } else {
      setPromoStatus({ type: 'error', message: t('cart.promoInvalid') });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">
          {t('cart.emptyTitle')}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
          {t('cart.emptySub')}
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 transition transform active:scale-95"
        >
          {t('cart.exploreShop')} <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  // Free shipping progress calculation (Free over 500,000 UZS)
  const freeThreshold = 500000;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeThreshold) * 100));
  const remainingForFree = Math.max(0, freeThreshold - cartSubtotal);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
          {t('cart.title')} ({cart.length})
        </h1>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
        >
          <Trash2 className="w-4 h-4" />
          <span>{t('cart.clearCart')}</span>
        </button>
      </div>

      {/* Free Shipping Progress Alert */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-500/20">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2">
          <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Truck className="w-4 h-4" />
            {remainingForFree === 0
              ? t('cart.freeShippingUnlocked')
              : t('cart.freeShippingNotice', { amount: formatPrice(remainingForFree) })}
          </span>
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left: Cart Items Table (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
            {cart.map((item) => {
              const activePrice = item.product.discountPrice || item.product.price;
              const itemTotal = activePrice * item.quantity;

              return (
                <div
                  key={item.product.id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition"
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${item.product.id}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/60 dark:border-slate-700"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate hover:text-indigo-600">
                      <Link to={`/product/${item.product.id}`}>
                        {item.product.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 capitalize">
                      {item.product.category}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        {formatPrice(activePrice)}
                      </div>
                      <Link
                        to={`/upgrader?sourceId=${item.product.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[11px] font-bold hover:from-purple-600 hover:to-indigo-600 hover:text-white transition shadow-xs"
                        title="Bu tovarni Upgraderga qo'yish"
                      >
                        <Rocket className="w-3 h-3" />
                        <span>Upgrader 🚀</span>
                      </Link>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 shrink-0">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, -1)}
                      className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 min-w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, 1)}
                      className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Total for Item */}
                  <div className="text-right font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 min-w-[100px]">
                    {formatPrice(itemTotal)}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/shop"
              className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              ← Xaridni davom ettirish
            </Link>
          </div>
        </div>

        {/* Right: Order Summary & Promo Code (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {t('cart.orderSummary')}
            </h2>

            {/* Promo Code Input */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Promokod
              </label>
              
              {appliedPromo ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-bold text-emerald-700 dark:text-emerald-300 uppercase">
                        {appliedPromo.code}
                      </p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                        {appliedPromo.desc}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removePromo}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder={t('cart.promoPlaceholder')}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-indigo-600 transition"
                    >
                      {t('cart.applyPromo')}
                    </button>
                  </div>
                  {promoStatus && (
                    <p
                      className={`text-xs ${
                        promoStatus.type === 'success' ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {promoStatus.message}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400">
                    💡 Sinab ko'ring: <b className="text-indigo-500">UZBEK2025</b> (-15%) yoki <b className="text-indigo-500">WELCOME10</b> (-10%)
                  </p>
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>{t('cart.subtotal')}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>{t('cart.discount')}</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>{t('cart.shipping')}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-500 font-bold">{t('cart.free')}</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
                <span className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  {t('cart.grandTotal')}
                </span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout button */}
            <Link
              to="/checkout"
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition transform active:scale-95"
            >
              <span>{t('cart.checkoutBtn')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

      </div>

      {/* Recently Viewed Products */}
      <RecentlyViewed />
    </div>
  );
}
