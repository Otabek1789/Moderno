import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/common/ProductCard';

export default function Wishlist() {
  const { wishlist, clearWishlist, addToCart } = useStore();
  const { t } = useLanguage();

  const handleAddAllToCart = () => {
    wishlist.forEach((item) => {
      addToCart(item, 1);
    });
    alert("Barcha sevimlilar savatga qo'shildi!");
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto mb-6 shadow-xl animate-float animate-heartbeat">
          <Heart className="w-12 h-12 fill-rose-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">
          {t('wishlist.emptyTitle')}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
          {t('wishlist.emptySub')}
        </p>
        <Link
          to="/shop"
          className="btn-shimmer inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 transition transform hover:scale-105 active:scale-95 animate-glow"
        >
          {t('cart.exploreShop')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
            <span className="animate-gradient-text">{t('wishlist.title')}</span> ({wishlist.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Saqlangan barcha mahsulotlaringiz
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddAllToCart}
            className="btn-shimmer px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition active:scale-95 hover:scale-105"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t('wishlist.addAllToCart')}</span>
          </button>
          <button
            onClick={clearWishlist}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 dark:hover:bg-rose-950/40 text-xs sm:text-sm font-semibold flex items-center gap-2 transition"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span>{t('wishlist.clearAll')}</span>
          </button>
        </div>
      </div>

      {/* Upgrader Callout Banner */}
      <div className="card-interactive mb-8 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-slate-900 border border-purple-500/30 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6 text-rose-400 fill-rose-400 animate-pulse" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-white">
              Sevimlilaringizni Upgraderda sinab ko'ring! 🚀
            </h4>
            <p className="text-xs text-purple-200">
              Ushbu tovarlarni qo'yib, yanada qimmatroq va orzuingizdagi tovarlarga upgrade qilishingiz mumkin!
            </p>
          </div>
        </div>
        <Link
          to="/upgrader"
          className="btn-shimmer px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm whitespace-nowrap shadow-lg shadow-purple-500/25 active:scale-95 transition hover:scale-105 animate-glow"
        >
          Upgraderga o'tish →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}
