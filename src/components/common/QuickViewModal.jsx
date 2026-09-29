import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Heart, Check, ShieldCheck, Truck, ArrowRight, Send, Zap } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatters';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart, toggleWishlist, isInWishlist, postProductToTelegram, openQuickBuy } = useStore();
  const { language, t } = useLanguage();
  const [selectedImg, setSelectedImg] = useState(product?.image || '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const description =
    typeof product.description === 'object'
      ? product.description[language] || product.description['uz']
      : product.description;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full shadow-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Images */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
            <img
              src={selectedImg || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=800&q=80";
              }}
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                    (selectedImg || product.image) === img
                      ? 'border-indigo-600 shadow-md scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Rating & Stock */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {product.rating}
                </span>
                <span className="text-slate-400">({product.reviewsCount} {t('product.reviewsCount')})</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  product.stock > 0
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/10 text-rose-500'
                }`}
              >
                {product.stock > 0 ? `${t('shop.inStock')} (${product.stock})` : t('shop.outOfStock')}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 leading-snug">
              {product.name}
            </h2>

            {/* Price & Installment */}
            <div className="flex flex-wrap items-baseline gap-3 mb-2">
              <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {formatPrice(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <span className="text-sm text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Installment Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-4 border border-amber-500/20">
              <span>💳</span>
              <span>Muddatli to'lov: oyiga {formatPrice(Math.round((product.discountPrice || product.price) / 12))} dan</span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5 line-clamp-3">
              {description}
            </p>

            {/* Mini Specs */}
            {product.specs && (
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1.5 mb-5">
                {Object.entries(product.specs).slice(0, 3).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-400 font-medium">{k}:</span>
                    <span className="text-slate-700 dark:text-slate-200 font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Row */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {/* Quantity */}
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                >
                  -
                </button>
                <span className="px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                  product.stock === 0
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : added
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-indigo-600/25'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> {t('cart.title')}ga qo'shildi!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> {t('product.addToCart')}
                  </>
                )}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition ${
                  inWishlist
                    ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/40 dark:border-rose-900'
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-500'
                }`}
                title="Sevimlilarga qo'shish"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>

              {/* Telegram Post */}
              <button
                onClick={() => postProductToTelegram(product)}
                className="p-3 rounded-xl border border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 hover:bg-sky-100 transition"
                title="Telegram botga yuborish"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Buy Button */}
            <button
              onClick={() => {
                openQuickBuy(product);
                onClose();
              }}
              disabled={product.stock === 0}
              className="w-full mb-3 py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all bg-amber-500 hover:bg-amber-600 active:scale-95 text-white shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-white" /> {t('quickBuy.button')}
            </button>

            {/* View Full Product Link */}
            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center gap-1"
            >
              To'liq ma'lumotlarni ko'rish <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
