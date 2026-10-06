import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  Share2,
  Zap,
  CheckCircle2,
  Send,
  Scale,
  Rocket,
  MessageSquare
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/common/ProductCard';
import InstallmentCalculator from '../components/common/InstallmentCalculator';
import ProductReviews from '../components/common/ProductReviews';
import RecentlyViewed from '../components/common/RecentlyViewed';
import { formatPrice } from '../utils/formatters';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    postProductToTelegram,
    addToCompare,
    isInCompare,
    openQuickBuy,
    addToRecentlyViewed,
    getProductReviews
  } = useStore();
  const { language, t } = useLanguage();

  const product = products.find((p) => String(p.id) === String(id));
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'desc' | 'delivery' | 'reviews'

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setQuantity(1);
      window.scrollTo(0, 0);
      addToRecentlyViewed(product.id);
    }
  }, [product, id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          Mahsulot topilmadi
        </h2>
        <Link
          to="/shop"
          className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold inline-block"
        >
          Katalogga qaytish
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const categoryName =
    typeof product.categoryName === 'object'
      ? product.categoryName[language] || product.categoryName['uz']
      : product.category;

  const description =
    typeof product.description === 'object'
      ? product.description[language] || product.description['uz']
      : product.description;

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
        <Link to="/" className="hover:text-indigo-600">
          {t('nav.home')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/shop" className="hover:text-indigo-600">
          {t('nav.shop')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md group">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=800&q=80";
              }}
            />
            {product.discountPrice && (
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-rose-700 bg-rose-100 dark:bg-rose-500/20 dark:text-rose-300 rounded-xl shadow-sm animate-pulse">
                -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}% Chegirma
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200 shrink-0 ${
                    (selectedImage || product.image) === img
                      ? 'border-indigo-600 shadow-lg scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100 hover:scale-102'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info (7 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                {categoryName}
              </span>
              <div className="flex items-center gap-1.5 text-xs">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {product.rating}
                </span>
                <span className="text-slate-400">({product.reviewsCount} {t('product.reviewsCount')})</span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight mb-4">
              {product.name}
            </h1>

            {/* Price Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 mb-6 flex items-baseline gap-4 shadow-xs">
              <span className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400 animate-gradient-text">
                {formatPrice(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <span className="text-base sm:text-lg text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2 text-xs font-semibold mb-6">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  product.stock > 0 ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'
                }`}
              />
              <span className={product.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}>
                {product.stock > 0
                  ? `${t('shop.inStock')} (${product.stock} dona omborda qoldi)`
                  : t('shop.outOfStock')}
              </span>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t('product.quantity')}
                </span>
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold active:scale-95 transition"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 min-w-10 text-center font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3.5 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold active:scale-95 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons Area */}
              <div className="space-y-3 pt-3">
                {/* 1. Main Action Buttons: Add to Cart & Quick Buy */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Add To Cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`btn-shimmer w-full py-3.5 px-5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-xl hover:scale-[1.02] active:scale-95 ${
                      product.stock === 0
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        : added
                        ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-5 h-5 animate-bounce shrink-0" />
                        <span className="whitespace-nowrap">{t('cart.title')}ga qo'shildi!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5 shrink-0" />
                        <span className="whitespace-nowrap">{t('product.addToCart')}</span>
                      </>
                    )}
                  </button>

                  {/* 1-Click Fast Buy */}
                  <button
                    onClick={() => openQuickBuy(product)}
                    disabled={product.stock === 0}
                    className="btn-shimmer w-full py-3.5 px-5 rounded-2xl font-bold text-sm sm:text-base bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition disabled:opacity-50"
                  >
                    <Zap className="w-5 h-5 fill-white shrink-0 animate-pulse" />
                    <span className="whitespace-nowrap">1-Klikda xarid</span>
                  </button>
                </div>

                {/* 2. Interactive Feature: Upgrader Card */}
                <button
                  onClick={() => navigate(`/upgrader?sourceId=${product.id}`)}
                  className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900/60 hover:from-purple-900/60 hover:to-indigo-900/60 border border-purple-500/30 text-white flex items-center justify-between transition-all group shadow-sm active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <Rocket className="w-4 h-4" />
                    </span>
                    <div className="text-left">
                      <div className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
                        <span>Upgrader orqali almashtirish</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-gradient-to-r from-purple-500 to-indigo-500 text-white">HOT</span>
                      </div>
                      <div className="text-[11px] text-purple-200/80 line-clamp-1">
                        Ushbu tovarni qimmatroq mahsulotga upgrade qiling
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                {/* 3. Utility Row: Wishlist, Compare, Telegram */}
                <div className="flex items-center gap-2.5 pt-1">
                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`flex-1 py-3 px-3.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      inWishlist
                        ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Heart className={`w-4 h-4 shrink-0 ${inWishlist ? 'fill-current text-rose-500' : ''}`} />
                    <span className="whitespace-nowrap">{inWishlist ? 'Sevimlilarda' : 'Sevimlilar'}</span>
                  </button>

                  {/* Compare */}
                  <button
                    onClick={() => addToCompare(product)}
                    className={`flex-1 py-3 px-3.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      isInCompare(product.id)
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Scale className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">{isInCompare(product.id) ? 'Taqqoslangan' : 'Taqqoslash'}</span>
                  </button>

                  {/* Telegram */}
                  <button
                    onClick={() => postProductToTelegram(product)}
                    className="p-3 rounded-xl border border-sky-200 dark:border-sky-800/80 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 hover:bg-sky-100 transition shrink-0"
                    title="Telegram kanal/botga yuborish"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-5 my-6 border-y border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl px-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="font-medium">Tezkor yetkazib berish</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="font-medium">12 oy rasmiy kafolat</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <span className="font-medium">14 kun almashtirish</span>
              </div>
            </div>

            {/* Installment Calculator Widget */}
            <div className="pt-2">
              <InstallmentCalculator
                price={product.discountPrice || product.price}
                onApply={() => openQuickBuy(product)}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Tabs: Specifications & Description & Delivery & Reviews */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 sm:gap-6 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-sm sm:text-base font-bold transition border-b-2 whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {t('product.specifications')}
          </button>
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 text-sm sm:text-base font-bold transition border-b-2 whitespace-nowrap ${
              activeTab === 'desc'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {t('product.description')}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-sm sm:text-base font-bold transition border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <span>{t('reviews.title')}</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold">
              {getProductReviews(product.id).length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`pb-3 text-sm sm:text-base font-bold transition border-b-2 whitespace-nowrap ${
              activeTab === 'delivery'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {t('product.deliveryInfo')}
          </button>
        </div>

        {activeTab === 'specs' && product.specs && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="py-3.5 flex flex-col sm:flex-row sm:justify-between">
                <span className="font-medium text-slate-400 sm:w-1/3">{key}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 sm:w-2/3">
                  {val}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'desc' && (
          <div className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl space-y-4">
            <p>{description}</p>
            <p>
              Har bir mahsulot qadoqlanishidan oldin to'liq sifat nazoratidan o'tkaziladi va rasmiy kafolat taloniga ega bo'ladi.
            </p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <ProductReviews productId={product.id} productName={product.name} />
        )}

        {activeTab === 'delivery' && (
          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-900/50">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                Toshkent shahri bo'ylab:
              </h4>
              <p>Buyurtma berilgan kunda 3-6 soat ichida yetkaziladi. 500 000 so'mdan yuqori xaridlarga yetkazib berish BEPUL!</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                Viloyatlarga yetkazib berish:
              </h4>
              <p>O'zbekistonning barcha viloyatlariga kuryerlik xizmatlari orqali 24 soat ichida yetkaziladi.</p>
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {t('product.relatedProducts')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Products */}
      <RecentlyViewed currentProductId={product.id} />

    </div>
  );
}
