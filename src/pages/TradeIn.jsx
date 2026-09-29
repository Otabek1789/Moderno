import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  RefreshCw,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Calculator,
  ChevronRight,
  ChevronDown,
  Check,
  Sparkles,
  Send,
  Building,
  Phone,
  User,
  BadgeCheck,
  Zap
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/formatters';
import sound from '../utils/soundFX';
import { useLanguage } from '../context/LanguageContext';
import { storeBranches } from '../data/storeBranches';

// Brands & Models database with base trade-in values
const TRADE_IN_BRANDS = [
  {
    id: 'apple',
    name: 'Apple',
    models: [
      { id: 'ip15pm', name: 'iPhone 15 Pro Max', basePrice: 11500000 },
      { id: 'ip15p', name: 'iPhone 15 Pro', basePrice: 9800000 },
      { id: 'ip15', name: 'iPhone 15', basePrice: 7200000 },
      { id: 'ip14pm', name: 'iPhone 14 Pro Max', basePrice: 8500000 },
      { id: 'ip14p', name: 'iPhone 14 Pro', basePrice: 7400000 },
      { id: 'ip14', name: 'iPhone 14', basePrice: 5800000 },
      { id: 'ip13pm', name: 'iPhone 13 Pro Max', basePrice: 6500000 },
      { id: 'ip13p', name: 'iPhone 13 Pro', basePrice: 5400000 },
      { id: 'ip13', name: 'iPhone 13', basePrice: 4600000 },
      { id: 'ip12pm', name: 'iPhone 12 Pro Max', basePrice: 4200000 },
      { id: 'ip12', name: 'iPhone 12', basePrice: 3100000 },
      { id: 'ip11', name: 'iPhone 11', basePrice: 2200000 }
    ],
    storages: [
      { size: '64GB', multiplier: 0.9 },
      { size: '128GB', multiplier: 1.0 },
      { size: '256GB', multiplier: 1.15 },
      { size: '512GB', multiplier: 1.3 },
      { size: '1TB', multiplier: 1.45 }
    ]
  },
  {
    id: 'samsung',
    name: 'Samsung',
    models: [
      { id: 's24u', name: 'Galaxy S24 Ultra', basePrice: 10800000 },
      { id: 's24p', name: 'Galaxy S24+', basePrice: 8200000 },
      { id: 's24', name: 'Galaxy S24', basePrice: 6400000 },
      { id: 's23u', name: 'Galaxy S23 Ultra', basePrice: 7800000 },
      { id: 's23', name: 'Galaxy S23', basePrice: 5100000 },
      { id: 's22u', name: 'Galaxy S22 Ultra', basePrice: 5200000 },
      { id: 's22', name: 'Galaxy S22', basePrice: 3600000 },
      { id: 'zfold5', name: 'Galaxy Z Fold 5', basePrice: 9500000 },
      { id: 'zflip5', name: 'Galaxy Z Flip 5', basePrice: 5800000 }
    ],
    storages: [
      { size: '128GB', multiplier: 0.95 },
      { size: '256GB', multiplier: 1.0 },
      { size: '512GB', multiplier: 1.2 },
      { size: '1TB', multiplier: 1.35 }
    ]
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi',
    models: [
      { id: 'mi14u', name: 'Xiaomi 14 Ultra', basePrice: 8500000 },
      { id: 'mi14', name: 'Xiaomi 14', basePrice: 5600000 },
      { id: 'mi13u', name: 'Xiaomi 13 Ultra', basePrice: 6100000 },
      { id: 'mi13t', name: 'Xiaomi 13T Pro', basePrice: 4200000 },
      { id: 'mi12', name: 'Xiaomi 12 Pro', basePrice: 3200000 },
      { id: 'redminote13p', name: 'Redmi Note 13 Pro+ 5G', basePrice: 2800000 }
    ],
    storages: [
      { size: '128GB', multiplier: 0.95 },
      { size: '256GB', multiplier: 1.0 },
      { size: '512GB', multiplier: 1.15 }
    ]
  }
];

// Physical condition tiers
const CONDITIONS = [
  {
    id: 'perfect',
    title: 'Ideal (Yangi kabi)',
    desc: 'Hech qanday tirnalish yo\'q, quti va barcha hujjatlari bor, batareya salomatligi 90%+',
    multiplier: 1.0,
    badge: '100% narx'
  },
  {
    id: 'good',
    title: 'Yaxshi holatda',
    desc: 'Korpusda mayda tirnalishlar bor, texnik tomondan 100% ishchi holatda, batareya 80%+',
    multiplier: 0.85,
    badge: '85% narx'
  },
  {
    id: 'fair',
    title: 'Qoniqarli',
    desc: 'Ko\'rinadigan chiziqlar yoki yengil urilishlar mavjud, ekranda mayda dog\'lar bo\'lishi mumkin',
    multiplier: 0.68,
    badge: '68% narx'
  },
  {
    id: 'damaged',
    title: 'Nosoz / Singan',
    desc: 'Ekran yorilgan, orqa qopqoq singan yoki ba\'zi sensorlar ishlamaydi',
    multiplier: 0.40,
    badge: '40% narx'
  }
];

export default function TradeIn() {
  const { products } = useStore();
  const { t } = useLanguage();

  // State for Old Device
  const [selectedBrandId, setSelectedBrandId] = useState('apple');
  const [selectedModelId, setSelectedModelId] = useState('ip14p');
  const [selectedStorage, setSelectedStorage] = useState('128GB');
  const [selectedConditionId, setSelectedConditionId] = useState('good');

  // State for Target New Device
  const targetProducts = useMemo(() => {
    return products.filter((p) => p.category === 'smartphones' || p.category === 'laptops').slice(0, 6);
  }, [products]);

  const [targetProductId, setTargetProductId] = useState(targetProducts[0]?.id || 1);

  // Form submission state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('+998 ');
  const [selectedBranch, setSelectedBranch] = useState(storeBranches[0]?.name || 'Toshkent Chilonzor');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

  const modelDropdownRef = useRef(null);
  const branchDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target)) {
        setIsModelDropdownOpen(false);
      }
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target)) {
        setIsBranchDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Current selected entities
  const currentBrand = TRADE_IN_BRANDS.find((b) => b.id === selectedBrandId) || TRADE_IN_BRANDS[0];
  const currentModel = currentBrand.models.find((m) => m.id === selectedModelId) || currentBrand.models[0];
  const currentStorage = currentBrand.storages.find((s) => s.size === selectedStorage) || currentBrand.storages[0];
  const currentCondition = CONDITIONS.find((c) => c.id === selectedConditionId) || CONDITIONS[1];
  const targetProduct = products.find((p) => p.id === targetProductId) || targetProducts[0];

  // Estimated Trade-In Value Calculation
  const estimatedTradeInValue = useMemo(() => {
    if (!currentModel || !currentStorage || !currentCondition) return 0;
    const val = currentModel.basePrice * currentStorage.multiplier * currentCondition.multiplier;
    return Math.round(val / 10000) * 10000;
  }, [currentModel, currentStorage, currentCondition]);

  // Net difference
  const targetPrice = targetProduct?.discountPrice || targetProduct?.price || 15490000;
  const netDifference = Math.max(0, targetPrice - estimatedTradeInValue);
  const monthlyInstallment = Math.round(netDifference / 12);

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!clientName.trim() || clientPhone.trim().length < 9) {
      alert("Iltimos, ismingiz va to'liq telefon raqamingizni kiriting!");
      return;
    }
    sound.playSuccess();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wide uppercase mb-3">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>{t('tradeIn.badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            {t('tradeIn.title')} <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{t('tradeIn.titleHighlight')}</span> {t('tradeIn.titleEnd')}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t('tradeIn.subtitle')}
          </p>
        </div>

        {/* Trade-In Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Old Device Specification Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5 mb-6">
                <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white text-xs font-black flex items-center justify-center">1</span>
                <span>{t('tradeIn.step1')}</span>
              </h2>

              {/* Brand Selector */}
              <div className="mb-5">
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
                  {t('tradeIn.selectBrand')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {TRADE_IN_BRANDS.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => {
                        sound.playPop();
                        setSelectedBrandId(brand.id);
                        setSelectedModelId(brand.models[0].id);
                        setSelectedStorage(brand.storages[0].size);
                      }}
                      className={`py-3 px-4 rounded-xl border text-sm font-bold transition flex items-center justify-center gap-2 ${
                        selectedBrandId === brand.id
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>{brand.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Model Selector Dropdown */}
              <div ref={modelDropdownRef} className="relative mb-5">
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
                  Model
                </label>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsModelDropdownOpen(!isModelDropdownOpen);
                  }}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold flex items-center justify-between transition-all duration-200 shadow-xs ${
                    isModelDropdownOpen
                      ? 'bg-white dark:bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span className="font-bold">{currentModel.name}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isModelDropdownOpen ? 'rotate-180 text-indigo-500' : ''
                    }`}
                  />
                </button>

                {isModelDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-30 p-1.5 max-h-60 overflow-y-auto animate-fadeIn">
                    <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      Mavjud modellar ({currentBrand.models.length})
                    </div>
                    <div className="space-y-1 mt-1">
                      {currentBrand.models.map((model) => {
                        const isSelected = selectedModelId === model.id;
                        return (
                          <button
                            key={model.id}
                            type="button"
                            onClick={() => {
                              sound.playPop();
                              setSelectedModelId(model.id);
                              setIsModelDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition text-left ${
                              isSelected
                                ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                            }`}
                          >
                            <span>{model.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Storage Capacity */}
              <div className="mb-5">
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
                  Doimiy Xotira (ROM)
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {currentBrand.storages.map((storage) => (
                    <button
                      key={storage.size}
                      onClick={() => {
                        sound.playPop();
                        setSelectedStorage(storage.size);
                      }}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition ${
                        selectedStorage === storage.size
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {storage.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Physical Condition */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
                  Tashqi va Texnik Holati
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CONDITIONS.map((cond) => (
                    <button
                      key={cond.id}
                      onClick={() => {
                        sound.playPop();
                        setSelectedConditionId(cond.id);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition relative ${
                        selectedConditionId === cond.id
                          ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {cond.title}
                        </span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {cond.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {cond.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Target New Device Picker */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5 mb-6">
                <span className="w-7 h-7 rounded-xl bg-purple-600 text-white text-xs font-black flex items-center justify-center">2</span>
                <span>Olishni xohlagan yangi qurilmangizni tanlang</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {targetProducts.map((prod) => {
                  const isSelected = targetProductId === prod.id;
                  const price = prod.discountPrice || prod.price;

                  return (
                    <button
                      key={prod.id}
                      onClick={() => {
                        sound.playPop();
                        setTargetProductId(prod.id);
                      }}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/40 ring-2 ring-purple-500/40'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-24 object-cover rounded-xl bg-slate-100 dark:bg-slate-800 mb-2"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 mb-1">
                          {prod.name}
                        </h4>
                        <p className="text-xs font-black text-purple-600 dark:text-purple-400">
                          {formatPrice(price)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Side: Calculation & Application Form (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            
            {/* Calculation Card */}
            <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white border border-indigo-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
                <span className="text-xs font-bold tracking-wider uppercase text-indigo-300 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" />
                  Trade-In Hisob-kitobi
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                  Tezkor Baholash
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3.5 mb-6 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Yangi Qurilma narxi:</span>
                  <span className="font-bold text-white">{formatPrice(targetPrice)}</span>
                </div>

                <div className="flex items-center justify-between text-emerald-400">
                  <span className="flex items-center gap-1">
                    <span>Eski gadjet qiymati:</span>
                    <BadgeCheck className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-black text-emerald-300">
                    - {formatPrice(estimatedTradeInValue)}
                  </span>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-baseline justify-between">
                  <span className="font-bold text-slate-200">To'lanadigan Qoldiq:</span>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-black text-amber-400">
                      {formatPrice(netDifference)}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      yoki oyiga {formatPrice(monthlyInstallment)} dan (12 oy)
                    </span>
                  </div>
                </div>
              </div>

              {/* Submission Form or Success Message */}
              {!isSubmitted ? (
                <form onSubmit={handleSubmitApplication} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Ismingiz
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Masalan: Sardor Aliyev"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Telefon Raqamingiz
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+998 90 123 45 67"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Custom Branch Selector Dropdown */}
                  <div ref={branchDropdownRef} className="relative">
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Murojaat qilmoqchi bo'lgan filial
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setIsBranchDropdownOpen(!isBranchDropdownOpen);
                      }}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs flex items-center justify-between text-left transition shadow-xs"
                    >
                      <Building className="w-4 h-4 text-slate-400 absolute left-3 top-7 -translate-y-1/2" />
                      <span className="truncate font-semibold">{selectedBranch}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
                          isBranchDropdownOpen ? 'rotate-180 text-indigo-400' : ''
                        }`}
                      />
                    </button>

                    {isBranchDropdownOpen && (
                      <div className="absolute left-0 right-0 bottom-full mb-2 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-30 p-1.5 max-h-52 overflow-y-auto animate-fadeIn backdrop-blur-xl">
                        <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                          Filialni tanlang
                        </div>
                        <div className="space-y-1 mt-1">
                          {storeBranches.map((branch) => {
                            const isSelected = selectedBranch === branch.name;
                            return (
                              <button
                                key={branch.id}
                                type="button"
                                onClick={() => {
                                  sound.playPop();
                                  setSelectedBranch(branch.name);
                                  setIsBranchDropdownOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition text-left ${
                                  isSelected
                                    ? 'bg-indigo-600 text-white font-bold'
                                    : 'text-slate-300 hover:bg-slate-800'
                                }`}
                              >
                                <span>{branch.name} ({branch.city})</span>
                                {isSelected && <Check className="w-3.5 h-3.5" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 mt-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Trade-In Arizasini Yuborish</span>
                  </button>
                </form>
              ) : (
                <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-2xl p-5 text-center space-y-2 animate-fadeIn">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-extrabold text-base text-white">
                    Arizangiz Qabul Qilindi!
                  </h4>
                  <p className="text-xs text-slate-300">
                    Mutaxassisimiz tez orada <b>{clientPhone}</b> raqamiga aloqaga chiqadi. Sizni <b>{selectedBranch}</b> filialimizda kutamiz!
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-3 text-xs text-indigo-300 hover:underline font-semibold"
                  >
                    Boshqa arizani hisoblash
                  </button>
                </div>
              )}

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tekshirish va baholash do'konda 15 daqiqada bepul amalga oshiriladi.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
