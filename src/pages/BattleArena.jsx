import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Swords,
  Trophy,
  Zap,
  Battery,
  Camera,
  Monitor,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/formatters';
import sound from '../utils/soundFX';
import { useLanguage } from '../context/LanguageContext';

// Preset Head-to-Head Showdowns
const POPULAR_RIVALRIES = [
  {
    title: 'iPhone 15 Pro Max vs Galaxy S24 Ultra',
    desc: 'Yilning eng shov-shuvli ikki flagman jangi',
    productA: {
      id: 1,
      name: 'Apple iPhone 15 Pro Max 256GB',
      brand: 'Apple',
      price: 15490000,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
      specs: {
        display: { score: 94, detail: '6.7" Super Retina XDR OLED, 120Hz ProMotion' },
        performance: { score: 97, detail: 'Apple A17 Pro (3nm), Ray Tracing' },
        camera: { score: 96, detail: '48MP Pro + 5x Tetraprism Zoom, ProRes Log' },
        battery: { score: 91, detail: '4422 mAh, 29 soat video ijrosi' },
        value: { score: 88, detail: 'Yuqori likvidlik va 5 yillik iOS yangilanish' }
      }
    },
    productB: {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra 512GB',
      brand: 'Samsung',
      price: 13990000,
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
      specs: {
        display: { score: 98, detail: '6.8" Dynamic AMOLED 2X, 2600 nits, Anti-reflective' },
        performance: { score: 95, detail: 'Snapdragon 8 Gen 3 for Galaxy, Galaxy AI' },
        camera: { score: 97, detail: '200MP asosiy + 50MP 5x periskop + S Pen' },
        battery: { score: 94, detail: '5000 mAh, 45W tezkor quvvatlash' },
        value: { score: 92, detail: '512GB xotira va 7 yillik Android yangilanish' }
      }
    }
  },
  {
    title: 'MacBook Pro 16 M3 Max vs ROG Zephyrus G16',
    desc: 'Apple Silicon vs Quvvatli RTX 4090 Gaming Noutbuk',
    productA: {
      id: 3,
      name: 'Apple MacBook Pro 16" M3 Max 36GB',
      brand: 'Apple',
      price: 36500000,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
      specs: {
        display: { score: 98, detail: '16.2" Liquid Retina XDR, 1600 nits HDR' },
        performance: { score: 96, detail: 'Apple M3 Max 16-core CPU, 40-core GPU' },
        camera: { score: 92, detail: '1080p FaceTime HD + Studio-quality mik' },
        battery: { score: 99, detail: '22 soat avtonom ish vaqti, sovuq korpus' },
        value: { score: 85, detail: 'Dasturchilar va video montajchilar etaloni' }
      }
    },
    productB: {
      id: 4,
      name: 'ASUS ROG Zephyrus G16 OLED RTX 4090',
      brand: 'ASUS',
      price: 34900000,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
      specs: {
        display: { score: 96, detail: '16" 2.5K 240Hz ROG Nebula OLED' },
        performance: { score: 98, detail: 'Intel Core Ultra 9 185H + RTX 4090 16GB' },
        camera: { score: 85, detail: 'FHD IR Kamera Windows Hello' },
        battery: { score: 75, detail: '90Wh batareya, o\'yin rejimida 2-3 soat' },
        value: { score: 90, detail: 'Top darajadagi AAA o\'yinlar va 3D render' }
      }
    }
  },
  {
    title: 'AirPods Pro 2 vs Sony WF-1000XM5',
    desc: 'Simsiz audio olamidagi eng zo\'r shovqinni bekor qilish (ANC)',
    productA: {
      id: 5,
      name: 'Apple AirPods Pro 2 (USB-C)',
      brand: 'Apple',
      price: 2850000,
      image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80',
      specs: {
        display: { score: 95, detail: 'Ergonomik qulaylik va MagSafe Case' },
        performance: { score: 96, detail: 'Apple H2 chip, Shovqinni moslashuvchan o\'chirish' },
        camera: { score: 94, detail: 'Suhbat rejimi (Conversation Awareness)' },
        battery: { score: 90, detail: 'Case bilan 30 soat, 6 soat bir quvvatda' },
        value: { score: 93, detail: 'Apple ekotizimida mutlaq qulaylik' }
      }
    },
    productB: {
      id: 6,
      name: 'Sony WF-1000XM5 Hi-Res Wireless',
      brand: 'Sony',
      price: 2990000,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
      specs: {
        display: { score: 92, detail: 'Ixcham poliuretan ko\'pikli quloq yostiqchalari' },
        performance: { score: 98, detail: 'HD Shovqin protsessori QN2e + LDAC Hi-Res' },
        camera: { score: 93, detail: 'Bone-conduction sensorli mikrofonlar' },
        battery: { score: 94, detail: 'Case bilan 36 soat, 8 soat bir quvvatda' },
        value: { score: 95, detail: 'Android va iOS uchun universal audiophile ovoz' }
      }
    }
  }
];


export default function BattleArena() {
  const { addToCart } = useStore();
  const { t } = useLanguage();

  // 5 Battle Round Categories
  const ROUNDS = [
    { key: 'display', title: t('battle.display'), icon: Monitor },
    { key: 'performance', title: t('battle.performance'), icon: Zap },
    { key: 'camera', title: t('battle.camera'), icon: Camera },
    { key: 'battery', title: t('battle.battery'), icon: Battery },
    { key: 'value', title: t('battle.value'), icon: TrendingUp }
  ];

  const [activeRivalryIndex, setActiveRivalryIndex] = useState(0);
  const rivalry = POPULAR_RIVALRIES[activeRivalryIndex];

  // Calculate winner rounds
  const battleScores = useMemo(() => {
    let scoreA = 0;
    let scoreB = 0;

    ROUNDS.forEach((rnd) => {
      const valA = rivalry.productA.specs[rnd.key]?.score || 0;
      const valB = rivalry.productB.specs[rnd.key]?.score || 0;
      if (valA > valB) scoreA++;
      else if (valB > valA) scoreB++;
      else {
        scoreA += 0.5;
        scoreB += 0.5;
      }
    });

    return { scoreA, scoreB };
  }, [rivalry]);

  const winner = battleScores.scoreA > battleScores.scoreB ? 'A' : 'B';

  const handleSwitchBattle = (index) => {
    sound.playBattleHit();
    setActiveRivalryIndex(index);
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }, 150);
  };

  const handleAddToCart = (product) => {
    sound.playSuccess();
    addToCart(product, 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Lighting */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold tracking-wide uppercase mb-3">
            <Swords className="w-4 h-4 animate-bounce" />
            <span>{t('battle.badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
            {t('battle.title')} <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 bg-clip-text text-transparent">{t('battle.titleHighlight')}</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            {t('battle.subtitle')}
          </p>
        </div>

        {/* Rivalry Switcher Tabs */}
        <div className="flex items-center justify-center gap-2.5 flex-wrap mb-10">
          {POPULAR_RIVALRIES.map((riv, idx) => (
            <button
              key={idx}
              onClick={() => handleSwitchBattle(idx)}
              className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeRivalryIndex === idx
                  ? 'bg-gradient-to-r from-blue-600 to-rose-600 text-white border-transparent shadow-lg shadow-purple-500/20 scale-105'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>{riv.title}</span>
            </button>
          ))}
        </div>

        {/* Versus Main Fighter Cards (A vs B) */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 sm:gap-6 items-center mb-10">
          
          {/* Fighter A (Blue Corner) */}
          <div className={`md:col-span-5 rounded-3xl p-6 border-2 transition-all relative overflow-hidden ${
            winner === 'A'
              ? 'bg-gradient-to-br from-blue-950/80 via-slate-900 to-indigo-950/60 border-blue-500 shadow-2xl shadow-blue-500/20'
              : 'bg-slate-900/90 border-slate-800'
          }`}>
            {winner === 'A' && (
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black flex items-center gap-1.5 animate-pulse">
                <Trophy className="w-3.5 h-3.5" />
                <span>{t('battle.winner').toUpperCase()}</span>
              </div>
            )}

            <div className="flex items-center gap-4 mb-4">
              <img
                src={rivalry.productA.image}
                alt={rivalry.productA.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-slate-800 shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">
                  {rivalry.productA.brand}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-white truncate">
                  {rivalry.productA.name}
                </h3>
                <p className="text-lg font-black text-blue-400 mt-1">
                  {formatPrice(rivalry.productA.price)}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleAddToCart(rivalry.productA)}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-md shadow-blue-600/30"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{rivalry.productA.brand} — {t('battle.addWinnerToCart')}</span>
            </button>
          </div>

          {/* Center VS Score Badge (1 Col) */}
          <div className="md:col-span-1 flex flex-col items-center justify-center py-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-600 to-rose-600 flex items-center justify-center font-black text-white text-base shadow-xl animate-pulse">
              VS
            </div>
            <div className="text-center mt-2">
              <span className="text-xs font-black text-slate-400">
                {battleScores.scoreA} : {battleScores.scoreB}
              </span>
            </div>
          </div>

          {/* Fighter B (Red Corner) */}
          <div className={`md:col-span-5 rounded-3xl p-6 border-2 transition-all relative overflow-hidden ${
            winner === 'B'
              ? 'bg-gradient-to-br from-rose-950/80 via-slate-900 to-pink-950/60 border-rose-500 shadow-2xl shadow-rose-500/20'
              : 'bg-slate-900/90 border-slate-800'
          }`}>
            {winner === 'B' && (
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black flex items-center gap-1.5 animate-pulse">
                <Trophy className="w-3.5 h-3.5" />
                <span>{t('battle.winner').toUpperCase()}</span>
              </div>
            )}

            <div className="flex items-center gap-4 mb-4">
              <img
                src={rivalry.productB.image}
                alt={rivalry.productB.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-slate-800 shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">
                  {rivalry.productB.brand}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-white truncate">
                  {rivalry.productB.name}
                </h3>
                <p className="text-lg font-black text-rose-400 mt-1">
                  {formatPrice(rivalry.productB.price)}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleAddToCart(rivalry.productB)}
              className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-md shadow-rose-600/30"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{rivalry.productB.brand} — {t('battle.addWinnerToCart')}</span>
            </button>
          </div>

        </div>

        {/* 5 Battle Rounds Breakdown Meters */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>{t('battle.popularRivalries')} (5 {t('battle.overallScore')})</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              {t('battle.overallScore')}: {battleScores.scoreA > battleScores.scoreB ? rivalry.productA.brand : rivalry.productB.brand} {t('battle.winner')}
            </span>
          </div>

          <div className="space-y-6">
            {ROUNDS.map((rnd) => {
              const Icon = rnd.icon;
              const specA = rivalry.productA.specs[rnd.key];
              const specB = rivalry.productB.specs[rnd.key];
              const isWinnerA = specA.score > specB.score;
              const isWinnerB = specB.score > specA.score;

              return (
                <div key={rnd.key} className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className={`font-bold flex items-center gap-1.5 ${isWinnerA ? 'text-blue-400' : 'text-slate-400'}`}>
                      {specA.score} ball {isWinnerA && '👑'}
                    </span>

                    <span className="font-extrabold text-slate-200 flex items-center gap-1.5 uppercase tracking-wide text-xs">
                      <Icon className="w-4 h-4 text-indigo-400" />
                      <span>{rnd.title}</span>
                    </span>

                    <span className={`font-bold flex items-center gap-1.5 ${isWinnerB ? 'text-rose-400' : 'text-slate-400'}`}>
                      {isWinnerB && '👑'} {specB.score} ball
                    </span>
                  </div>

                  {/* Dual Progress Meter Bar */}
                  <div className="grid grid-cols-2 gap-1 h-3 rounded-full bg-slate-800 p-0.5 overflow-hidden">
                    {/* Left (Product A) fills towards right */}
                    <div className="flex justify-end">
                      <div
                        className={`h-full rounded-l-full transition-all duration-700 ${
                          isWinnerA ? 'bg-blue-500' : 'bg-blue-500/50'
                        }`}
                        style={{ width: `${(specA.score / 100) * 100}%` }}
                      />
                    </div>

                    {/* Right (Product B) fills towards right */}
                    <div className="flex justify-start">
                      <div
                        className={`h-full rounded-r-full transition-all duration-700 ${
                          isWinnerB ? 'bg-rose-500' : 'bg-rose-500/50'
                        }`}
                        style={{ width: `${(specB.score / 100) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Micro Specs text */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                    <span className="truncate max-w-[45%] text-left">{specA.detail}</span>
                    <span className="truncate max-w-[45%] text-right">{specB.detail}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Callout */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Har ikkala qurilma ham Moderno do'konida 12 oylik rasmiy kafolat bilan mavjud</span>
            </span>

            <div className="flex items-center gap-3">
              <Link to="/compare" className="text-indigo-400 hover:underline font-bold">
                {t('compare.title')} →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
