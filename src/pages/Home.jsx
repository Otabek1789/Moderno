import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Truck,
  ShieldCheck,
  Headphones,
  CreditCard,
  Smartphone,
  Laptop,
  Watch,
  Tv,
  ChevronRight,
  Star,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/common/ProductCard';
import QuickViewModal from '../components/common/QuickViewModal';

export default function Home() {
  const { products } = useStore();
  const { language, t } = useLanguage();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Live Flash Sale Countdown Timer (Hours, Minutes, Seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashSaleProducts = products.filter((p) => p.isFlashSale).slice(0, 4);
  const topProducts = products.filter((p) => p.isFeatured || p.rating >= 4.8).slice(0, 8);

  const categories = [
    {
      id: 'smartphones',
      name: { uz: 'Smartfonlar', ru: 'Смартфоны', en: 'Smartphones' },
      icon: Smartphone,
      count: '42+ tovarlar',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'laptops',
      name: { uz: 'Noutbuklar', ru: 'Ноутбуки', en: 'Laptops' },
      icon: Laptop,
      count: '35+ tovarlar',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'audio',
      name: { uz: 'Quloqchinlar', ru: 'Наушники', en: 'Audio' },
      icon: Headphones,
      count: '58+ tovarlar',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'watches',
      name: { uz: 'Aqlli soatlar', ru: 'Смарт-часы', en: 'Watches' },
      icon: Watch,
      count: '24+ tovarlar',
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 'appliances',
      name: { uz: 'Texnika', ru: 'Техника', en: 'Appliances' },
      icon: Tv,
      count: '60+ tovarlar',
      color: 'from-amber-500 to-orange-600'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white shadow-2xl border border-indigo-500/20 p-8 sm:p-14 lg:p-20">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-indigo-300 border border-white/10 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Premium Texnika & Elektronika
                </span>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
                  {t('home.heroTitle1')}
                </h1>
                <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {t('home.heroSubtitle1')}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  <Link
                    to="/shop"
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition transform active:scale-95"
                  >
                    {t('home.shopNow')}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/shop?filter=flash"
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/15 backdrop-blur-md flex items-center justify-center gap-2 transition"
                  >
                    <Flame className="w-5 h-5 text-amber-400" />
                    {t('home.viewDeals')}
                  </Link>
                </div>

                {/* Hero Badges */}
                <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 text-center lg:text-left">
                  <div>
                    <p className="text-2xl font-black text-white">100%</p>
                    <p className="text-xs text-slate-400">Original tovarlar</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">24 soat</p>
                    <p className="text-xs text-slate-400">Yetkazib berish</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">1 yil</p>
                    <p className="text-xs text-slate-400">Rasmiy kafolat</p>
                  </div>
                </div>
              </div>

              {/* Hero Image Showcase */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                  <img
                    src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80"
                    alt="iPhone 16 Pro Max"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                      Hafta Yangiligi
                    </span>
                    <h3 className="text-lg font-bold text-white">iPhone 16 Pro Max Natural Titanium</h3>
                    <p className="text-sm font-extrabold text-indigo-400 mt-1">15 490 000 so'm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {t('home.popularCategories')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t('home.popularCategoriesSub')}
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all"
          >
            {t('home.viewAll')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const catTitle = cat.name[language] || cat.name['uz'];
            return (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="group relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 text-center flex flex-col items-center"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition">
                  {catTitle}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{cat.count}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Flash Sale / Kunning maxsus chegirmalari */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-rose-500/10 via-amber-500/10 to-indigo-500/10 dark:from-rose-950/30 dark:to-indigo-950/30 border border-rose-500/20 rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 animate-pulse">
                <Flame className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                  {t('home.flashDeals')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {t('home.flashDealsSub')}
                </p>
              </div>
            </div>

            {/* Countdown Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 hidden sm:inline">
                {t('home.endsIn')}
              </span>
              <div className="flex items-center gap-1.5 font-mono text-sm sm:text-base font-extrabold">
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white shadow">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-rose-500">:</span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white shadow">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-rose-500">:</span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white shadow">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Flash Sale Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flashSaleProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={(prod) => setQuickViewProduct(prod)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Top Selling Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {t('home.topProducts')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t('home.topProductsSub')}
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all"
          >
            {t('home.viewAll')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {topProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onQuickView={(prod) => setQuickViewProduct(prod)}
            />
          ))}
        </div>
      </section>

      {/* 5. Why Choose Us (Value Proposition) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {t('home.whyUsTitle')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Mijozlarimizga xaridning har bir bosqichida mukammal xizmat va kafolat beramiz
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-2">
              {t('home.freeDelivery')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('home.freeDeliveryDesc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-2">
              {t('home.guarantee')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('home.guaranteeDesc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-2">
              {t('home.support24')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('home.support24Desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-2">
              {t('home.safePayment')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('home.safePaymentDesc')}
            </p>
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {t('home.testimonialsTitle')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {t('home.testimonialsSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 italic mb-4">
              "iPhone 16 Pro Max buyurtma berdim. Toshkent ichida atigi 3 soatda bepul yetkazib berishdi. Hujjatlari, kafolati joyida. Rahmat!"
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Bobur Mirzayev</h4>
                <p className="text-xs text-slate-400">Toshkent sh.</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 italic mb-4">
              "MacBook Pro M3 Max oldim. Telegram orqali operatorlar juda tez yordam berishdi, promokod orqali yana 15% chegirma oldim!"
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Zarina Karimova</h4>
                <p className="text-xs text-slate-400">Samarqand sh.</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 italic mb-4">
              "Sony quloqchinlari ajoyib! Tovarning sifati va yetkazib berish xizmati 10/10. Doim shu do'kondan foydalanaman."
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80"
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Jamshid Aliyev</h4>
                <p className="text-xs text-slate-400">Buxoro sh.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
