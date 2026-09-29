import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Trash2,
  Plus,
  ShoppingBag,
  Star,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/formatters';

export default function Compare() {
  const { compareList, removeFromCompare, clearCompare, addToCart, products, addToCompare } = useStore();
  const { language, t } = useLanguage();

  const [diffOnly, setDiffOnly] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addedIds, setAddedIds] = useState([]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 1500);
  };

  // Extract all unique specs keys across compared products
  const allSpecKeys = Array.from(
    new Set(
      compareList.flatMap((p) => (p.specs ? Object.keys(p.specs) : []))
    )
  );

  if (compareList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-fadeIn">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Scale className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">
          {t('compare.emptyTitle')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
          {t('compare.emptySub')}
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <Scale className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <span>{t('compare.title')} ({compareList.length}/4)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('compare.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Differences Only Toggle */}
          <button
            onClick={() => setDiffOnly(!diffOnly)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 ${
              diffOnly
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{t('compare.highlightDiff')}</span>
          </button>

          {/* Add more button */}
          {compareList.length < 4 && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Qo'shish</span>
            </button>
          )}

          {/* Clear button */}
          <button
            onClick={clearCompare}
            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
            title={t('compare.clearAll')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[640px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          
          {/* Product Header Row */}
          <div className="grid grid-cols-5 p-5 bg-slate-50/60 dark:bg-slate-800/40 items-start">
            <div className="font-extrabold text-xs uppercase tracking-wider text-slate-400 self-center">
              Tovarlar
            </div>
            {compareList.map((product) => {
              const activePrice = product.discountPrice || product.price;
              const isAdded = addedIds.includes(product.id);
              return (
                <div key={product.id} className="px-3 flex flex-col items-center text-center relative group">
                  <button
                    onClick={() => removeFromCompare(product.id)}
                    className="absolute top-0 right-2 p-1.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-500 hover:text-rose-500 transition"
                    title="Taqqoslashdan o'chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <Link to={`/product/${product.id}`} className="block w-24 h-24 sm:w-28 sm:h-28 mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-2xl bg-white shadow-xs group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </Link>

                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 line-clamp-2 mb-2">
                    <Link to={`/product/${product.id}`} className="hover:text-indigo-600">
                      {product.name}
                    </Link>
                  </h4>

                  <div className="text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400 mb-3">
                    {formatPrice(activePrice)}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
                      isAdded
                        ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25 active:scale-95'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Savatda</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{t('shop.addToCart')}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Monthly installment row */}
          <div className="grid grid-cols-5 p-4 text-xs items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
            <div className="font-bold text-slate-500 dark:text-slate-400">
              {t('compare.installment')} (12 oy)
            </div>
            {compareList.map((p) => {
              const activePrice = p.discountPrice || p.price;
              const monthly = Math.round(activePrice / 12);
              return (
                <div key={p.id} className="px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                  {formatPrice(monthly)} / oy
                </div>
              );
            })}
          </div>

          {/* Category row */}
          <div className="grid grid-cols-5 p-4 text-xs items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
            <div className="font-bold text-slate-500 dark:text-slate-400">
              {t('compare.category')}
            </div>
            {compareList.map((p) => (
              <div key={p.id} className="px-3 text-center text-slate-600 dark:text-slate-300 capitalize">
                {typeof p.categoryName === 'object' ? p.categoryName[language] || p.category : p.category}
              </div>
            ))}
          </div>

          {/* Rating row */}
          <div className="grid grid-cols-5 p-4 text-xs items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
            <div className="font-bold text-slate-500 dark:text-slate-400">
              {t('compare.rating')}
            </div>
            {compareList.map((p) => (
              <div key={p.id} className="px-3 flex items-center justify-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{p.rating}</span>
                <span className="text-slate-400 font-normal">({p.reviewsCount})</span>
              </div>
            ))}
          </div>

          {/* In Stock row */}
          <div className="grid grid-cols-5 p-4 text-xs items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
            <div className="font-bold text-slate-500 dark:text-slate-400">
              {t('compare.stock')}
            </div>
            {compareList.map((p) => (
              <div key={p.id} className="px-3 text-center">
                {p.stock > 0 ? (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Mavjud ({p.stock} dona)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                    <XCircle className="w-3 h-3" /> Mavjud emas
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Technical Specifications Rows */}
          {allSpecKeys.map((key) => {
            const values = compareList.map((p) => p.specs?.[key] || '—');
            const isDifferent = new Set(values).size > 1;

            if (diffOnly && !isDifferent) return null;

            return (
              <div
                key={key}
                className={`grid grid-cols-5 p-4 text-xs items-center transition-colors ${
                  isDifferent
                    ? 'bg-indigo-50/30 dark:bg-indigo-950/20'
                    : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                }`}
              >
                <div className="font-bold text-slate-700 dark:text-slate-300">
                  {key}
                  {isDifferent && (
                    <span className="block text-[10px] font-normal text-indigo-500">Farq bor</span>
                  )}
                </div>
                {compareList.map((p) => (
                  <div
                    key={p.id}
                    className="px-3 text-center text-slate-800 dark:text-slate-200 font-medium"
                  >
                    {p.specs?.[key] || '—'}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
          <div
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                Taqqoslashga mahsulot qo'shish
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Yopish
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1">
              {products
                .filter((p) => !compareList.some((c) => c.id === p.id))
                .map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      addToCompare(p);
                      setIsAddModalOpen(false);
                    }}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-600 flex items-center gap-3 text-left transition group"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600">
                        {p.name}
                      </h5>
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                        {formatPrice(p.discountPrice || p.price)}
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
