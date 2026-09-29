import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatters';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart, toggleWishlist, isInWishlist, addToCompare, isInCompare } = useStore();
  const { language, t } = useLanguage();
  const [added, setAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCompareToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  // Discount percentage calculation
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  const categoryName =
    typeof product.categoryName === 'object'
      ? product.categoryName[language] || product.categoryName['uz']
      : product.category;

  const activePrice = product.discountPrice || product.price;
  const monthlyInstallment = Math.round(activePrice / 12);

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full">
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800/50">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=800&q=80";
            }}
          />
        </Link>

        {/* Badges on Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/90 dark:bg-emerald-500/20 dark:text-emerald-300 backdrop-blur-md rounded-lg shadow-sm">
              {t('shop.newBadge')}
            </span>
          )}
          {discountPercent && (
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100/90 dark:bg-rose-500/20 dark:text-rose-300 backdrop-blur-md rounded-lg shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Action Buttons on Top Right */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            aria-label={t('nav.wishlist')}
            className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
              inWishlist
                ? 'bg-rose-500 text-white shadow-rose-500/30 scale-105'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:scale-110'
            }`}
            title="Sevimlilarga"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          {/* Compare Button */}
          <button
            onClick={handleCompareToggle}
            aria-label={t('nav.compare')}
            className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
              inCompare
                ? 'bg-indigo-600 text-white shadow-indigo-600/30 scale-105'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:scale-110'
            }`}
            title={inCompare ? "Taqqoslashda mavjud" : "Taqqoslashga qo'shish"}
          >
            <span className="text-xs font-bold leading-none">⚖️</span>
          </button>

          {/* Quick View Button */}
          <button
            onClick={handleQuickView}
            aria-label={t('shop.quickView')}
            className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:scale-110 backdrop-blur-md transition-all shadow-md opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 duration-300"
            title="Tez ko'rish"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="font-medium uppercase tracking-wider text-[11px] text-indigo-600 dark:text-indigo-400">
            {categoryName}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {product.rating}
            </span>
            <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base mb-2 line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>

        {/* Monthly Installment Pill */}
        <div className="mb-3">
          <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-bold">
            Oyiga {formatPrice(monthlyInstallment)} dan
          </span>
        </div>

        {/* Spacer */}
        <div className="mt-auto"></div>

        {/* Price & Add to Cart button */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {formatPrice(product.discountPrice || product.price)}
            </div>
            {product.discountPrice && (
              <div className="text-xs text-slate-400 dark:text-slate-500 line-through">
                {formatPrice(product.price)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md ${
              product.stock === 0
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-indigo-600/20'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 animate-bounce" />
                <span className="hidden sm:inline">Qo'shildi</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">{t('shop.addToCart')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
