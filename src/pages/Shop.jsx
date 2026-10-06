import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  Search,
  RotateCcw,
  LayoutGrid,
  List,
  Star,
  Check,
  ChevronDown,
  X,
  Sparkles,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Flame
} from 'lucide-react';
import sound from '../utils/soundFX';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/common/ProductCard';
import QuickViewModal from '../components/common/QuickViewModal';
import { formatPrice } from '../utils/formatters';

export default function Shop() {
  const { products } = useStore();
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const sortRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortOptions = [
    { id: 'newest', label: t('shop.sortNewest'), icon: Sparkles, color: 'text-amber-500' },
    { id: 'price_asc', label: t('shop.sortPriceAsc'), icon: ArrowDownWideNarrow, color: 'text-emerald-500' },
    { id: 'price_desc', label: t('shop.sortPriceDesc'), icon: ArrowUpWideNarrow, color: 'text-blue-500' },
    { id: 'popular', label: t('shop.sortPopular'), icon: Flame, color: 'text-rose-500' },
    { id: 'rating', label: t('shop.sortRating'), icon: Star, color: 'text-yellow-400' }
  ];

  const currentSortOption = sortOptions.find((o) => o.id === sortBy) || sortOptions[0];
  const CurrentSortIcon = currentSortOption.icon;

  // Sync search param from URL
  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) setSearch(q);
    const cat = searchParams.get('category');
    if (cat !== null) setSelectedCategory(cat);
  }, [searchParams]);

  const categories = [
    { id: 'all', name: { uz: 'Barchasi', ru: 'Все', en: 'All' } },
    { id: 'smartphones', name: { uz: 'Smartfonlar', ru: 'Смартфоны', en: 'Smartphones' } },
    { id: 'laptops', name: { uz: 'Noutbuklar', ru: 'Ноутбуки', en: 'Laptops' } },
    { id: 'audio', name: { uz: 'Quloqchinlar', ru: 'Наушники', en: 'Audio' } },
    { id: 'watches', name: { uz: 'Aqlli soatlar', ru: 'Смарт-часы', en: 'Smartwatches' } },
    { id: 'appliances', name: { uz: 'Texnika', ru: 'Техника', en: 'Appliances' } },
    { id: 'accessories', name: { uz: 'Aksessuarlar', ru: 'Аксессуары', en: 'Accessories' } }
  ];

  // Filtering & Sorting logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCat =
            typeof p.categoryName === 'object'
              ? (p.categoryName[language] || '').toLowerCase().includes(q)
              : p.category.toLowerCase().includes(q);
          if (!matchName && !matchCat) return false;
        }

        // Category
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Price min/max
        const currentPrice = p.discountPrice || p.price;
        if (priceRange.min && currentPrice < Number(priceRange.min)) return false;
        if (priceRange.max && currentPrice > Number(priceRange.max)) return false;

        // In Stock
        if (inStockOnly && p.stock <= 0) return false;

        // Rating
        if (minRating > 0 && p.rating < minRating) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;

        if (sortBy === 'price_asc') return priceA - priceB;
        if (sortBy === 'price_desc') return priceB - priceA;
        if (sortBy === 'popular') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        // newest default
        return (b.id || 0) - (a.id || 0);
      });
  }, [products, search, selectedCategory, priceRange, inStockOnly, minRating, sortBy, language]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setPriceRange({ min: '', max: '' });
    setInStockOnly(false);
    setMinRating(0);
    setSortBy('newest');
    setSearchParams({});
  };

  const hasActiveFilters =
    search ||
    selectedCategory !== 'all' ||
    priceRange.min ||
    priceRange.max ||
    inStockOnly ||
    minRating > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
            <span className="animate-gradient-text">{t('shop.catalogTitle')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {filteredProducts.length} {t('shop.showingProducts')}
          </p>
        </div>

        {/* Search & Sort Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>{t('shop.filterTitle')}</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
            )}
          </button>

          {/* Custom Modern Glassmorphic Sort Dropdown */}
          <div ref={sortRef} className="relative">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsSortOpen(!isSortOpen);
              }}
              className={`px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2.5 shadow-xs ${
                isSortOpen
                  ? 'border-indigo-500 bg-white dark:bg-slate-900 ring-2 ring-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-md'
                  : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <CurrentSortIcon className={`w-4 h-4 shrink-0 ${currentSortOption.color}`} />
              <span className="whitespace-nowrap font-bold">{currentSortOption.label}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                  isSortOpen ? 'rotate-180 text-indigo-500' : ''
                }`}
              />
            </button>

            {/* Custom Glassmorphism Dropdown Menu */}
            {isSortOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 sm:w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5 animate-fadeIn">
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Saralash usuli
                </div>
                <div className="space-y-1 mt-1">
                  {sortOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = sortBy === opt.id;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          sound.playPop();
                          setSortBy(opt.id);
                          setIsSortOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition text-left ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20 shadow-xs'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-indigo-500/15' : 'bg-slate-100 dark:bg-slate-800'
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 ${opt.color}`} />
                          </div>
                          <span className="truncate">{opt.label}</span>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('shop.clearFilters')}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            
            {/* Search Input in Sidebar */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Qidirish
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Nomi bo'yicha..."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Categories Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                {t('shop.category')}
              </label>
              <div className="space-y-1">
                {categories.map((c) => {
                  const isSelected = selectedCategory === c.id;
                  const cTitle = c.name[language] || c.name['uz'];
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCategory(c.id);
                        setSearchParams(c.id === 'all' ? {} : { category: c.id });
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{cTitle}</span>
                      {isSelected && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                {t('shop.priceRange')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Maks"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* In Stock Only Checkbox */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span>{t('shop.inStockOnly')}</span>
              </label>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Minimal Reyting
              </label>
              <div className="flex gap-1.5">
                {[0, 4, 4.5, 4.8].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setMinRating(minRating === rate ? 0 : rate)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition ${
                      minRating === rate
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {rate === 0 ? "Barchasi" : `${rate}+ ★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t('shop.clearFilters')}
              </button>
            )}

          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onQuickView={(prod) => setQuickViewProduct(prod)}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                {t('shop.noProductsFound')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                Boshqa kalit so'zlarni sinab ko'ring yoki tanlangan filtrlarni tozalang.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition"
              >
                {t('shop.resetFilters')}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-sm lg:hidden animate-fadeIn">
          <div className="w-full max-w-md max-h-[85vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto p-6 animate-slideUp">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                {t('shop.filterTitle')}
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="mb-6">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                {t('shop.category')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl text-left border ${
                      selectedCategory === c.id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {c.name[language] || c.name['uz']}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Price */}
            <div className="mb-6">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                {t('shop.priceRange')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
                <input
                  type="number"
                  placeholder="Maks"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
              </div>
            </div>

            {/* In Stock Mobile */}
            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span>{t('shop.inStockOnly')}</span>
              </label>
            </div>

            {/* Apply & Reset Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                {t('shop.clearFilters')}
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 text-xs font-bold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/30"
              >
                Natijalarni ko'rish ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

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
