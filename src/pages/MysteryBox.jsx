import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  Package,
  Sparkles,
  Trophy,
  Gift,
  Zap,
  Flame,
  CheckCircle2,
  Clock,
  ShoppingBag,
  RotateCcw,
  Star,
  ShieldCheck,
  ChevronRight,
  Info,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/formatters';
import sound from '../utils/soundFX';
import { useLanguage } from '../context/LanguageContext';

// 4 Mystery Box Tiers with their drop pool & probabilities
const BOX_TIERS = [
  {
    id: 'bronze',
    name: 'Bronza Quti',
    subtitle: 'Har kuni 1 marta bepul!',
    price: 49000,
    isFreeDaily: true,
    color: 'from-amber-700 via-orange-600 to-amber-900',
    borderColor: 'border-amber-500/40 hover:border-amber-400',
    glowColor: 'shadow-amber-500/20',
    badge: '🥉 Bronza',
    dropRate: '98% Yutuq kafolati',
    items: [
      {
        id: 'b1',
        name: 'Baseus 100W Fast Charge Type-C Kabeli',
        category: 'Aksessuarlar',
        price: 95000,
        rarity: 'Oddiy',
        rarityColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-500/30',
        image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=600&q=80',
        weight: 35
      },
      {
        id: 'b2',
        name: "50,000 so'm Xarid Vaucheri",
        category: 'Vaucher',
        price: 50000,
        isVoucher: true,
        rarity: 'Oddiy',
        rarityColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30',
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
        weight: 30
      },
      {
        id: 'b3',
        name: 'RGB Katta Gaming Kovrik (80x30 sm)',
        category: 'Gaming',
        price: 140000,
        rarity: 'Kamyob',
        rarityColor: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-500/30',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80',
        weight: 20
      },
      {
        id: 'b4',
        name: 'Remax TWS Simsiz Quloqchinlar',
        category: 'Audio',
        price: 220000,
        rarity: 'Epik',
        rarityColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-500/30',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
        weight: 15
      }
    ]
  },
  {
    id: 'silver',
    name: 'Kumush Quti',
    subtitle: 'Eng ko\'p tanlangan quti',
    price: 179000,
    isFreeDaily: false,
    color: 'from-slate-400 via-zinc-300 to-slate-600',
    borderColor: 'border-slate-400/50 hover:border-slate-300',
    glowColor: 'shadow-slate-400/25',
    badge: '🥈 Kumush',
    dropRate: 'Yuqori foyda koeffitsiyenti',
    items: [
      {
        id: 's1',
        name: 'Xiaomi Mi Power Bank 20,000mAh 50W',
        category: 'Batareya',
        price: 380000,
        rarity: 'Kamyob',
        rarityColor: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-500/30',
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80',
        weight: 35
      },
      {
        id: 's2',
        name: 'Haylou Solar Plus RT3 AMOLED Smartwatch',
        category: 'Aql-idrok soatlar',
        price: 490000,
        rarity: 'Epik',
        rarityColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-500/30',
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80',
        weight: 30
      },
      {
        id: 's3',
        name: 'Redragon RGB Mexanik Klaviatura',
        category: 'Gaming',
        price: 520000,
        rarity: 'Epik',
        rarityColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-500/30',
        image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80',
        weight: 25
      },
      {
        id: 's4',
        name: "250,000 so'm Xarid Sertifikati",
        category: 'Vaucher',
        price: 250000,
        isVoucher: true,
        rarity: 'Kamyob',
        rarityColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30',
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
        weight: 10
      }
    ]
  },
  {
    id: 'gold',
    name: 'Oltin Quti',
    subtitle: 'Brend audio va premium uskunalar',
    price: 590000,
    isFreeDaily: false,
    color: 'from-amber-400 via-yellow-500 to-amber-600',
    borderColor: 'border-yellow-400/60 hover:border-yellow-300',
    glowColor: 'shadow-yellow-500/30',
    badge: '🥇 Oltin',
    dropRate: 'Premial gadgetlar to\'plami',
    items: [
      {
        id: 'g1',
        name: 'Apple AirPods Pro 2 (MagSafe Case)',
        category: 'Audio',
        price: 2850000,
        rarity: 'Afsonaviy',
        rarityColor: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-500/30',
        image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80',
        weight: 15
      },
      {
        id: 'g2',
        name: 'Marshall Minor III Retro Wireless Earbuds',
        category: 'Audio',
        price: 1450000,
        rarity: 'Epik',
        rarityColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-500/30',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
        weight: 25
      },
      {
        id: 'g3',
        name: 'Samsung Galaxy Buds 2 Pro Graphite',
        category: 'Audio',
        price: 1890000,
        rarity: 'Epik',
        rarityColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-500/30',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
        weight: 30
      },
      {
        id: 'g4',
        name: "700,000 so'm Bosh Sovrin Vaucheri",
        category: 'Vaucher',
        price: 700000,
        isVoucher: true,
        rarity: 'Epik',
        rarityColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30',
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
        weight: 30
      }
    ]
  },
  {
    id: 'cyber',
    name: 'Cyber VIP Quti',
    subtitle: 'Flagman smartfonlar va konsollar',
    price: 1490000,
    isFreeDaily: false,
    color: 'from-fuchsia-600 via-purple-600 to-indigo-700',
    borderColor: 'border-fuchsia-500/60 hover:border-fuchsia-400',
    glowColor: 'shadow-fuchsia-500/40',
    badge: '💎 Cyber VIP',
    dropRate: 'Eksklyuziv flagman yutuqlar',
    items: [
      {
        id: 'c1',
        name: 'Apple iPhone 15 Pro 128GB Titanium',
        category: 'Smartfon',
        price: 14200000,
        rarity: 'Afsonaviy',
        rarityColor: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-500/30',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
        weight: 8
      },
      {
        id: 'c2',
        name: 'Sony PlayStation 5 Slim 1TB',
        category: 'Konsol',
        price: 6800000,
        rarity: 'Afsonaviy',
        rarityColor: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-500/30',
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80',
        weight: 18
      },
      {
        id: 'c3',
        name: 'Apple Watch Ultra 2 GPS + Cellular 49mm',
        category: 'Smartwatch',
        price: 9800000,
        rarity: 'Afsonaviy',
        rarityColor: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-500/30',
        image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
        weight: 14
      },
      {
        id: 'c4',
        name: 'Marshall Stanmore III Bluetooth Dinamik',
        category: 'Audio',
        price: 4600000,
        rarity: 'Epik',
        rarityColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-500/30',
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
        weight: 60
      }
    ]
  }
];

// Live recent winner simulations for real excitement
const RECENT_WINNERS = [
  { user: 'Sardor A.', box: 'Cyber VIP', prize: 'PlayStation 5 Slim', time: '1 daqiqa oldin' },
  { user: 'Nilufar M.', box: 'Oltin Quti', prize: 'AirPods Pro 2', time: '3 daqiqa oldin' },
  { user: 'Jasur K.', box: 'Kumush Quti', prize: 'Haylou Smartwatch', time: '6 daqiqa oldin' },
  { user: 'Bobur T.', box: 'Bronza Quti', prize: '50,000 so\'m Vaucher', time: '8 daqiqa oldin' },
  { user: 'Kamola R.', box: 'Cyber VIP', prize: 'Marshall Stanmore III', time: '12 daqiqa oldin' }
];

export default function MysteryBox() {
  const { addToCart } = useStore();
  const { t } = useLanguage();
  const [selectedTier, setSelectedTier] = useState(BOX_TIERS[0]);
  const [isOpening, setIsOpening] = useState(false);
  const [wonItem, setWonItem] = useState(null);
  const [claimedToCart, setClaimedToCart] = useState(false);
  const [freeTimeLeft, setFreeTimeLeft] = useState(0);

  // Check Daily Free Box countdown
  useEffect(() => {
    const checkFreeStatus = () => {
      const lastFree = localStorage.getItem('moderno_last_free_box');
      if (lastFree) {
        const diff = 86400000 - (Date.now() - parseInt(lastFree, 10));
        setFreeTimeLeft(diff > 0 ? diff : 0);
      } else {
        setFreeTimeLeft(0);
      }
    };
    checkFreeStatus();
    const interval = setInterval(checkFreeStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (ms) => {
    if (ms <= 0) return '00:00:00';
    const totalSec = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOpenBox = () => {
    if (isOpening) return;
    setIsOpening(true);
    setWonItem(null);
    setClaimedToCart(false);

    // Sound FX: Start tension rumble
    sound.playMysteryRumble();

    // Weighted random selection algorithm
    const pool = selectedTier.items;
    const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
    let rand = Math.random() * totalWeight;
    let selectedItem = pool[0];

    for (const item of pool) {
      if (rand < item.weight) {
        selectedItem = item;
        break;
      }
      rand -= item.weight;
    }

    // Shaking and tension build-up delay (1.8s)
    setTimeout(() => {
      // Sound FX: Mystery magic open & victory fanfare
      sound.playMysteryOpen();
      setTimeout(() => sound.playSuccess(), 250);

      // Trigger multi-stage confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 200);

      // Mark free box if bronze was opened for free
      if (selectedTier.isFreeDaily && freeTimeLeft === 0) {
        localStorage.setItem('moderno_last_free_box', Date.now().toString());
        setFreeTimeLeft(86400000);
      }

      setWonItem(selectedItem);
      setIsOpening(false);
    }, 1800);
  };

  const handleClaim = () => {
    if (!wonItem) return;
    sound.playPop();
    addToCart({
      id: Date.now(),
      name: `[MYSTERY BOX YUTUG'I] ${wonItem.name}`,
      price: wonItem.price,
      discountPrice: 0, // Won for free or won as box prize!
      image: wonItem.image,
      category: wonItem.category,
      isMysteryPrize: true
    }, 1);
    setClaimedToCart(true);
    sound.playSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden py-10 px-4 sm:px-6 lg:px-8">
      {/* Background Neon Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Breadcrumbs & Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>{t('mysteryBox.badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
            {t('mysteryBox.title')} <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent">{t('mysteryBox.titleHighlight')}</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            {t('mysteryBox.subtitle')}
          </p>
        </div>

        {/* Live Winners Ticker Bar */}
        <div className="mb-10 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 overflow-hidden backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {t('mysteryBox.liveWinners')}
            </span>
            <div className="flex items-center gap-6 overflow-x-auto text-xs text-slate-300 no-scrollbar whitespace-nowrap">
              {RECENT_WINNERS.map((win, idx) => (
                <div key={idx} className="flex items-center gap-2 shrink-0">
                  <span className="font-semibold text-slate-200">{win.user}</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-slate-700 text-[10px] text-amber-300 font-bold">{win.box}</span>
                  <span className="text-emerald-400 font-bold">"{win.prize}"</span>
                  <span className="text-[10px] text-slate-500">({win.time})</span>
                  {idx < RECENT_WINNERS.length - 1 && <span className="text-slate-600">•</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tier Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {BOX_TIERS.map((tier) => {
            const isSelected = selectedTier.id === tier.id;
            const isFreeAvailable = tier.isFreeDaily && freeTimeLeft === 0;

            return (
              <button
                key={tier.id}
                onClick={() => {
                  sound.playPop();
                  setSelectedTier(tier);
                  setWonItem(null);
                }}
                className={`relative p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? `bg-slate-800/90 border-indigo-500 shadow-xl shadow-indigo-500/20 scale-[1.02] ring-2 ring-indigo-500/50`
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-600'
                }`}
              >
                {tier.isFreeDaily && (
                  <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                    {isFreeAvailable ? `🎁 ${t('mysteryBox.free')}` : t('mysteryBox.waiting')}
                  </span>
                )}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400">{tier.badge}</span>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white mb-0.5">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-slate-400 mb-3">{tier.subtitle}</p>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                  <div className="text-sm sm:text-base font-black text-amber-400">
                    {tier.isFreeDaily && isFreeAvailable ? (
                      <span className="text-emerald-400">{t('mysteryBox.free').toUpperCase()}</span>
                    ) : (
                      formatPrice(tier.price)
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">{tier.items.length} {t('mysteryBox.prizes')}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Central Gamified Unboxing Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-800/50 border border-slate-700/70 rounded-3xl p-6 sm:p-10 backdrop-blur-xl relative">
          
          {/* Left Column: 3D Box Visual & Action */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center text-center py-6">
            
            {/* 3D Animated Box Container */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center mb-6">
              
              {/* Pulsing Aura */}
              <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 ${
                isOpening ? 'bg-amber-400/40 scale-125 animate-pulse' : 'bg-indigo-500/20 scale-100'
              }`} />

              {/* Shaking Mystery Box Container */}
              <div className={`relative transition-transform duration-200 ${
                isOpening ? 'animate-bounce scale-110' : 'hover:scale-105'
              }`}>
                <div className={`w-44 h-44 sm:w-48 sm:h-48 rounded-3xl bg-gradient-to-tr ${selectedTier.color} p-1 shadow-2xl flex items-center justify-center relative overflow-hidden border-2 border-white/20`}>
                  {/* Glossy overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/40 pointer-events-none" />
                  
                  {/* Center Emblem */}
                  <div className="flex flex-col items-center justify-center text-white z-10">
                    <Package className={`w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg transition-transform ${isOpening ? 'animate-spin' : ''}`} />
                    <span className="text-xs font-black uppercase tracking-wider mt-2 px-3 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/20">
                      {selectedTier.badge}
                    </span>
                  </div>

                  {/* Corner sparkles */}
                  <Sparkles className="w-5 h-5 text-yellow-300 absolute top-3 left-3 animate-pulse" />
                  <Sparkles className="w-4 h-4 text-white absolute bottom-3 right-3 animate-ping" />
                </div>
              </div>
            </div>

            {/* Price / Daily Free Banner */}
            {selectedTier.isFreeDaily && freeTimeLeft > 0 ? (
              <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Clock className="w-4 h-4 animate-spin" />
                <span>{t('mysteryBox.nextFreeBox')} {formatCountdown(freeTimeLeft)}</span>
              </div>
            ) : null}

            {/* Open Button */}
            <div className="w-full max-w-sm">
              <button
                onClick={handleOpenBox}
                disabled={isOpening}
                className={`w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-xl transition-all duration-300 active:scale-95 ${
                  isOpening
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02]'
                }`}
              >
                {isOpening ? (
                  <>
                    <RotateCcw className="w-5 h-5 animate-spin" />
                    <span>{t('mysteryBox.opening')}</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-5 h-5" />
                    <span>
                      {selectedTier.isFreeDaily && freeTimeLeft === 0
                        ? t('mysteryBox.freeOpen')
                        : `${formatPrice(selectedTier.price)} ${t('mysteryBox.openFor')}`}
                    </span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('mysteryBox.guarantee')}</span>
            </p>
          </div>

          {/* Right Column: Possible Drops Pool */}
          <div className="lg:col-span-6 bg-slate-900/60 border border-slate-700/60 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-sm sm:text-base text-white">
                  {selectedTier.name} {t('mysteryBox.prizesTitle')}
                </h4>
              </div>
              <span className="text-xs text-indigo-400 font-semibold">
                {selectedTier.dropRate}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {selectedTier.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 transition group"
                >
                  {item.isVoucher || item.category === 'Vaucher' ? (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-amber-500 via-yellow-500 to-amber-700 flex flex-col items-center justify-center text-white shrink-0 shadow-xs relative overflow-hidden">
                      <Gift className="w-5 h-5 text-amber-100" />
                      <span className="text-[8px] font-black text-amber-100">
                        {item.price >= 1000 ? `${item.price / 1000}k` : item.price}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80";
                      }}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-700 shrink-0 group-hover:scale-105 transition-transform"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border inline-block mb-1 ${item.rarityColor}`}>
                      {item.rarity}
                    </span>
                    <h5 className="text-xs font-semibold text-slate-200 truncate">
                      {item.name}
                    </h5>
                    <p className="text-xs font-bold text-amber-400">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t('mysteryBox.prizeInfo')}</span>
              </span>
              <Link to="/shop" className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5">
                {t('mysteryBox.catalog')} <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* WINNING REVEAL MODAL */}
        {wonItem &&
          createPortal(
            <div
              className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
              onClick={() => {
                sound.playClick();
                setWonItem(null);
              }}
            >
              <div
                className="relative my-auto w-full max-w-sm sm:max-w-md bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-amber-500/60 rounded-3xl p-5 sm:p-6 text-center shadow-2xl overflow-hidden animate-scaleUp"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close X Button */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setWonItem(null);
                  }}
                  className="absolute top-3.5 right-3.5 p-2 rounded-full bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition z-20"
                  title="Yopish"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header celebration aura */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/30 rounded-full blur-2xl pointer-events-none" />

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-3">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>{t('mysteryBox.congratsTitle')}</span>
                </div>

                {/* Item Card */}
                <div className="relative mb-3.5 group">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-xl bg-slate-800 relative flex items-center justify-center">
                    {wonItem.isVoucher || wonItem.category === 'Vaucher' ? (
                      <div className="w-full h-full bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-700 flex flex-col items-center justify-center p-2.5 text-white text-center relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/20 rounded-full blur-md pointer-events-none" />
                        <Gift className="w-9 h-9 mb-0.5 drop-shadow-md text-amber-100 animate-bounce" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-amber-200">{t('mysteryBox.voucherLabel')}</span>
                        <span className="text-xs sm:text-sm font-black tracking-tight text-white drop-shadow">{formatPrice(wonItem.price)}</span>
                        <span className="text-[8px] font-bold text-amber-100/90 mt-0.5 uppercase px-1.5 py-0.5 rounded-full bg-black/20">{t('mysteryBox.couponLabel')}</span>
                      </div>
                    ) : (
                      <img
                        src={wonItem.image}
                        alt={wonItem.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80";
                        }}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute top-1.5 right-1.5">
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border shadow-sm ${wonItem.rarityColor}`}>
                        {wonItem.rarity}
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-extrabold text-white mb-0.5 line-clamp-2">
                  {wonItem.name}
                </h3>
                <p className="text-xs text-slate-400 mb-2">{wonItem.category}</p>

                <div className="text-lg sm:text-xl font-black text-amber-400 mb-4">
                  {t('mysteryBox.value')} {formatPrice(wonItem.price)}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleClaim}
                    disabled={claimedToCart}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
                      claimedToCart
                        ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/50 cursor-default'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 active:scale-95'
                    }`}
                  >
                    {claimedToCart ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t('mysteryBox.claimed')}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>{t('mysteryBox.claimToCart')}</span>
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setWonItem(null);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
                    >
                      {t('mysteryBox.close')}
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setWonItem(null);
                        handleOpenBox();
                      }}
                      className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t('mysteryBox.openAgain')}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>,
            document.body
          )}

      </div>
    </div>
  );
}
