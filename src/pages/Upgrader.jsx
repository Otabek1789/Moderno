import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  Heart,
  TrendingUp,
  Volume2,
  VolumeX,
  Gift,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/formatters';

// Web Audio API Synthesizer for realistic spinner & fanfare
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (type === 'tick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === 'win') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.4);
      });
    } else if (type === 'lose') {
      const notes = [400, 320, 240];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.3);
      });
    }
  } catch (err) {
    // AudioContext might be blocked until user gesture
  }
}

// Dynamic mathematical odds calculator (strictly max 60%, unique per pair)
export function calculateUpgradeChance(sourceP, targetP, targetId = 0) {
  if (!sourceP || !targetP) return 50.0;
  const s = Number(sourceP);
  const t = Number(targetP);

  // Price ratio: r = source / target
  const r = s / t;

  let chance = 50.0;
  if (r <= 0.5) {
    // Direct proportion when upgrading to an item 2x or more expensive:
    // e.g. Pegasus 1.24M -> Tuflik 2.50M = exactly 49.6%
    chance = r * 100;
  } else {
    // When source item is closer to target or more expensive:
    // Smooth saturation curve that approaches 59.5% without ever hitting a flat 60%
    const diff = r - 0.5;
    chance = 50.0 + (9.5 * diff) / (diff + 0.85);

    // Micro-adjustment for items in saturation zone so each item has a unique decimal
    const idNum = Number(targetId) || 0;
    const micro = ((((idNum * 13) % 17) - 8) * 0.08);
    chance += micro;
  }

  // Strict boundary: minimum 1.5%, maximum 59.8% (never exceeds 60.0%)
  const clamped = Math.min(59.8, Math.max(1.5, chance));
  return Number(clamped.toFixed(1));
}

export default function Upgrader() {
  const [searchParams] = useSearchParams();
  const { products, cart, wishlist, addToCart, upgradeHistory, addUpgradeRecord } = useStore();
  const { t } = useLanguage();

  // Find source & target from query params or defaults
  const querySourceId = searchParams.get('sourceId');
  const queryTargetId = searchParams.get('targetId');

  // Source item: defaults to Pegasus sneakers (ID 14, 1.24M) for the 49.6% example
  const [sourceItem, setSourceItem] = useState(() => {
    if (querySourceId) {
      const match = products.find((p) => String(p.id) === String(querySourceId));
      if (match) return match;
    }
    const pegasus = products.find((p) => p.id === 14);
    if (pegasus) return pegasus;
    if (cart.length > 0) return cart[0].product;
    if (wishlist.length > 0) return wishlist[0];
    return products[0];
  });

  // Target item: defaults to Italiya Tuflik (ID 13, 2.50M) -> exactly 49.6%
  const [targetItem, setTargetItem] = useState(() => {
    if (queryTargetId) {
      const match = products.find((p) => String(p.id) === String(queryTargetId));
      if (match) return match;
    }
    const tuflik = products.find((p) => p.id === 13);
    if (tuflik) return tuflik;
    return products[1] || products[0];
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [gameResult, setGameResult] = useState(null); // 'win' | 'lose' | null
  const [copiedCode, setCopiedCode] = useState(false);

  // Modals for selection
  const [selectingMode, setSelectingMode] = useState(null); // 'source' | 'target' | null

  const sourcePrice = sourceItem ? (sourceItem.discountPrice || sourceItem.price) : 1240000;
  const targetPrice = targetItem ? (targetItem.discountPrice || targetItem.price) : 2500000;

  // Calculate Win Probability (%) with dynamic varied odds, max 60%
  const winChance = calculateUpgradeChance(sourcePrice, targetPrice, targetItem?.id);

  // The green winning sector is from 0 deg to greenDeg
  const greenDegrees = (winChance / 100) * 360;

  const handleStartUpgrade = () => {
    if (isSpinning || !sourceItem || !targetItem) return;

    setIsSpinning(true);
    setGameResult(null);

    // 1. Determine if this roll is a WIN or LOSE mathematically
    const randomPercent = Math.random() * 100;
    const isWin = randomPercent < winChance;

    // 2. Pick a stopping angle inside the appropriate sector
    // Green sector: [2, greenDegrees - 2]
    // Red sector: [greenDegrees + 2, 358]
    let landingAngle = 0;
    if (isWin) {
      landingAngle = 2 + Math.random() * Math.max(1, greenDegrees - 4);
    } else {
      landingAngle = greenDegrees + 2 + Math.random() * Math.max(1, 356 - greenDegrees);
    }

    // Add 6 to 8 full revolutions for thrilling spin anticipation
    const fullSpins = 6 + Math.floor(Math.random() * 3);
    const targetRotation = 360 * fullSpins + landingAngle;

    setRotationAngle(targetRotation);

    // Audio tick emulation while spinning
    let tickCount = 0;
    const maxTicks = 24;
    const tickInterval = setInterval(() => {
      tickCount++;
      if (soundEnabled) playSound('tick');
      if (tickCount >= maxTicks) {
        clearInterval(tickInterval);
      }
    }, 150 + tickCount * 15);

    // Spin animation duration: 5.5 seconds
    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setGameResult(isWin ? 'win' : 'lose');

      if (isWin) {
        if (soundEnabled) playSound('win');
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.55 }
        });
      } else {
        if (soundEnabled) playSound('lose');
      }

      // Record in history
      addUpgradeRecord({
        sourceName: sourceItem.name,
        targetName: targetItem.name,
        chance: winChance,
        won: isWin
      });
    }, 5500);
  };

  const handleClaimPrize = () => {
    if (!targetItem) return;
    // Add won product to cart as a free prize
    addToCart({
      ...targetItem,
      discountPrice: 0,
      name: `🎁 [UPGRADE YUTUG'I] ${targetItem.name}`
    }, 1);
    alert(`🎉 Tabriklaymiz! "${targetItem.name}" savatingizga 0 so'mga (BEPUL) qo'shildi!`);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('UPGRADE5');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Title & Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider shadow-sm animate-pulse">
          <Sparkles className="w-4 h-4" />
          <span>{t('upgrader.badge')}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          MODERNO <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">UPGRADER</span> 🚀
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          {t('upgrader.subtitle')}
        </p>

        {/* Audio Toggle */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Ovoz: Yoqilgan</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span>Ovoz: O'chirilgan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Upgrader Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-indigo-500/20 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-pink-600/20 blur-3xl pointer-events-none" />

        {/* Left Side: Source Product */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">
              {t('upgrader.sourceLabel')}
            </span>
            <button
              onClick={() => setSelectingMode('source')}
              className="text-xs text-indigo-300 hover:text-white underline font-semibold"
            >
              O'zgartirish
            </button>
          </div>

          <div className="p-4 rounded-3xl bg-slate-800/80 border border-slate-700/80 flex flex-col items-center text-center space-y-3 relative group">
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-700/40 p-2 relative">
              <img
                src={sourceItem.image}
                alt={sourceItem.name}
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=800&q=80";
                }}
              />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 line-clamp-2">
                {sourceItem.name}
              </h3>
              <div className="text-base font-extrabold text-indigo-400 mt-1">
                {formatPrice(sourcePrice)}
              </div>
            </div>

            <div className="flex gap-2 w-full pt-1">
              <button
                onClick={() => setSelectingMode('source')}
                className="flex-1 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold transition"
              >
                Tanlash
              </button>
            </div>
          </div>
        </div>

        {/* Center: The Radial Upgrader Wheel */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-6 py-4">
          {/* Probability Indicator Pill */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase mb-1">
              {t('upgrader.winChance')}
            </span>
            <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              {winChance}%
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5">
              ({formatPrice(sourcePrice)} ➔ {formatPrice(targetPrice)})
            </span>
          </div>

          {/* Interactive Wheel Graphic */}
          <div className="relative w-64 h-64 sm:w-76 sm:h-76 flex items-center justify-center">
            {/* SVG Circular Donut representation */}
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background Losing Arc (Red/Dark) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#ef4444"
                strokeWidth="10"
                strokeOpacity="0.4"
              />
              {/* Foreground Winning Arc (Green/Cyan) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="10"
                strokeDasharray={`${(winChance / 100) * 251.2} 251.2`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>

            {/* Dial Center Needle Indicator */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                transform: `rotate(${rotationAngle}deg)`,
                transition: isSpinning
                  ? 'transform 5.5s cubic-bezier(0.12, 0.8, 0.2, 1)'
                  : 'none'
              }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Arrow / Needle pointing up */}
                <div className="absolute top-2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[26px] border-b-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              </div>
            </div>

            {/* Central Glow Disc */}
            <div className="absolute w-24 h-24 rounded-full bg-slate-900 border-4 border-slate-700 flex flex-col items-center justify-center text-center shadow-inner">
              <Zap className="w-6 h-6 text-amber-400 fill-amber-400 animate-pulse" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">
                MODERNO
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="w-full max-w-sm space-y-3">
            <button
              onClick={handleStartUpgrade}
              disabled={isSpinning}
              className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base tracking-wider uppercase transition-all shadow-2xl flex items-center justify-center gap-2 ${
                isSpinning
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white shadow-emerald-500/25 active:scale-95'
              }`}
            >
              {isSpinning ? (
                <>
                  <RotateCcw className="w-5 h-5 animate-spin" />
                  <span>{t('upgrader.spinning')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 fill-white" />
                  <span>{t('upgrader.upgradeAction')} ({winChance}%)</span>
                </>
              )}
            </button>
          </div>

          {/* Result Alert / Celebration Box */}
          {gameResult && (
            <div
              className={`w-full max-w-md p-5 rounded-2xl border text-center space-y-3 animate-scaleUp ${
                gameResult === 'win'
                  ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/70 border-rose-500/50 text-rose-200'
              }`}
            >
              {gameResult === 'win' ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-white">
                    {t('upgrader.congratulations')}
                  </h4>
                  <p className="text-xs text-emerald-300">
                    Siz <b>{targetItem.name}</b> mahsulotini muvaffaqiyatli yutib oldingiz!
                  </p>
                  <button
                    onClick={handleClaimPrize}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold text-xs shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
                  >
                    <Gift className="w-4 h-4" />
                    <span>{t('upgrader.claimPrize')}</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                    <XCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-white">
                    {t('upgrader.failedTitle')}
                  </h4>
                  <p className="text-xs text-rose-300">
                    {t('upgrader.failedMessage')}
                  </p>
                  <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-900/80 border border-slate-700">
                    <span className="font-mono font-bold text-amber-400 text-sm">UPGRADE5</span>
                    <button
                      onClick={handleCopyCode}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1 text-slate-300"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? "Nusxalandi" : "Nusxa"}</span>
                    </button>
                  </div>
                  <button
                    onClick={handleStartUpgrade}
                    className="text-xs text-slate-300 hover:underline font-bold"
                  >
                    {t('upgrader.tryAgain')}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Target Product */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-pink-400">
              {t('upgrader.targetLabel')}
            </span>
            <button
              onClick={() => setSelectingMode('target')}
              className="text-xs text-pink-300 hover:text-white underline font-semibold"
            >
              O'zgartirish
            </button>
          </div>

          <div className="p-4 rounded-3xl bg-slate-800/80 border border-slate-700/80 flex flex-col items-center text-center space-y-3 relative group">
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-700/40 p-2 relative">
              <img
                src={targetItem.image}
                alt={targetItem.name}
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=800&q=80";
                }}
              />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 line-clamp-2">
                {targetItem.name}
              </h3>
              <div className="text-base font-extrabold text-pink-400 mt-1">
                {formatPrice(targetPrice)}
              </div>
            </div>

            <div className="flex gap-2 w-full pt-1">
              <button
                onClick={() => setSelectingMode('target')}
                className="flex-1 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold transition"
              >
                Katalogdan tanlash
              </button>
            </div>
          </div>

          {/* Quick Target Suggestions with individual odds */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              Tezkor nishonlar (Har xil shans):
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {products
                .filter((p) => p.id !== sourceItem?.id)
                .slice(0, 4)
                .map((p) => {
                  const pPrice = p.discountPrice || p.price;
                  const chance = calculateUpgradeChance(sourcePrice, pPrice, p.id);
                  const isSelected = targetItem?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setTargetItem(p)}
                      className={`p-2 rounded-xl border text-left transition flex flex-col justify-between ${
                        isSelected
                          ? 'bg-pink-500/20 border-pink-500 text-white shadow-sm'
                          : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-700/80 text-slate-300'
                      }`}
                    >
                      <span className="font-bold line-clamp-1 text-[11px]">{p.name}</span>
                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-700/40">
                        <span className="text-[10px] text-pink-400 font-extrabold">⚡ {chance}%</span>
                        <span className="text-[9px] text-slate-400">{formatPrice(pPrice)}</span>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* How Upgrader Works Explained */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>{t('upgrader.howItWorksTitle')}</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-bold text-slate-900 dark:text-slate-100">1. Matematik Aniq Shans:</div>
            <p>{t('upgrader.rule1')}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-bold text-slate-900 dark:text-slate-100">2. Yashil Sektor:</div>
            <p>{t('upgrader.rule2')}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-bold text-slate-900 dark:text-slate-100">3. 100% Rasmiy Yutuq:</div>
            <p>{t('upgrader.rule3')}</p>
          </div>
        </div>
      </div>

      {/* Upgrade History Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
            {t('upgrader.historyTitle')}
          </h3>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          {upgradeHistory.map((rec) => (
            <div
              key={rec.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    rec.won
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/10 text-rose-500'
                  }`}
                >
                  {rec.won ? '✓' : '✕'}
                </span>
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    {rec.sourceName} ➔ <span className="text-indigo-600 dark:text-indigo-400">{rec.targetName}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Shans: {rec.chance}%
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    rec.won
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/10 text-rose-500'
                  }`}
                >
                  {rec.won ? "YUTUQ (Won)" : "Omad kelmadi"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for selecting Source or Target item */}
      {selectingMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
          <div
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                {selectingMode === 'source' ? "Bazaviy tovaringizni tanlang" : "Upgrade qilinadigan nishon tovarni tanlang"}
              </h4>
              <button
                onClick={() => setSelectingMode(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Yopish
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1">
              {products.map((p) => {
                const pPrice = p.discountPrice || p.price;
                const chance =
                  selectingMode === 'target'
                    ? calculateUpgradeChance(sourcePrice, pPrice, p.id)
                    : targetItem
                    ? calculateUpgradeChance(pPrice, targetPrice, targetItem.id)
                    : 50.0;
                const isSelected =
                  selectingMode === 'source' ? sourceItem?.id === p.id : targetItem?.id === p.id;

                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      if (selectingMode === 'source') setSourceItem(p);
                      else setTargetItem(p);
                      setSelectingMode(null);
                    }}
                    className={`p-3 rounded-2xl border flex items-center gap-3 text-left transition group ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-indigo-600'
                    }`}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-14 h-14 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600">
                        {p.name}
                      </h5>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                          {formatPrice(pPrice)}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap shrink-0">
                          ⚡ {chance}% {selectingMode === 'target' ? "shans" : ""}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
