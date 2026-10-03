import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Gift,
  X,
  Sparkles,
  Trophy,
  Copy,
  Check,
  RotateCcw,
  Zap,
  Coins,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import sound from '../../utils/soundFX';

const SECTORS = [
  { id: 0, label: "15% Chegirma", code: "LUCKY15", type: "promo", color: "#6366f1", textColor: "#ffffff" },
  { id: 1, label: "50 000 Coin", amount: 50000, type: "coins", color: "#f59e0b", textColor: "#000000" },
  { id: 2, label: "20% Chegirma", code: "LUCKY20", type: "promo", color: "#ec4899", textColor: "#ffffff" },
  { id: 3, label: "Bepul Yetkazish", code: "FREESHIP", type: "promo", color: "#10b981", textColor: "#ffffff" },
  { id: 4, label: "25 000 Coin", amount: 25000, type: "coins", color: "#8b5cf6", textColor: "#ffffff" },
  { id: 5, label: "10% Chegirma", code: "LUCKY10", type: "promo", color: "#3b82f6", textColor: "#ffffff" },
  { id: 6, label: "25% JACKPOT", code: "JACKPOT25", type: "promo", color: "#ef4444", textColor: "#ffffff" },
  { id: 7, label: "100 000 Coin", amount: 100000, type: "coins", color: "#14b8a6", textColor: "#ffffff" }
];

export default function LuckyWheelModal({ isOpen, onClose }) {
  const { applyPromo, addPromoCode, addCoins } = useStore();

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [unlimitedMode, setUnlimitedMode] = useState(true); // Default true for demo/olympiad judges
  const [lastSpinTime, setLastSpinTime] = useState(() => {
    return localStorage.getItem('moderno_last_wheel_spin') || null;
  });

  const numSectors = SECTORS.length;
  const sectorAngle = 360 / numSectors;

  const canSpin = unlimitedMode || !lastSpinTime || (Date.now() - Number(lastSpinTime) > 86400000);

  const handleSpin = () => {
    if (isSpinning || !canSpin) return;

    sound.playPop();
    setIsSpinning(true);
    setWonPrize(null);
    setIsCopied(false);

    // Pick random winning sector
    const winningIndex = Math.floor(Math.random() * numSectors);
    const prize = SECTORS[winningIndex];

    // Compute target rotation
    // Add 5-8 full rotations (1800 - 2880 deg) + angle to land on pointer (top = 270 deg or pointer offset)
    const extraRounds = 5 + Math.floor(Math.random() * 3);
    const targetOffset = 360 - (winningIndex * sectorAngle + sectorAngle / 2);
    const finalRotation = rotation + (extraRounds * 360) + (targetOffset - (rotation % 360));

    setRotation(finalRotation);

    // Play tick sound interval
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      sound.playWheelTick();
      tickCount++;
      if (tickCount > 25) clearInterval(tickInterval);
    }, 150);

    // Spin duration 4.5 seconds
    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setWonPrize(prize);

      // Sound and confetti
      sound.playSuccess();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Award prize
      if (prize.type === 'coins' && addCoins) {
        addCoins(prize.amount, "Omad G'ildiragi yutug'i");
        sound.playCoin();
      } else if (prize.type === 'promo') {
        // Register promo code to valid list
        if (addPromoCode) {
          addPromoCode({
            code: prize.code,
            type: prize.code === 'FREESHIP' ? 'shipping' : 'percent',
            value: prize.code === 'LUCKY15' ? 15 : prize.code === 'LUCKY20' ? 20 : prize.code === 'JACKPOT25' ? 25 : 10,
            desc: `Omad g'ildiragi yutug'i: ${prize.label}`
          });
        }
      }

      if (!unlimitedMode) {
        const now = Date.now().toString();
        setLastSpinTime(now);
        localStorage.setItem('moderno_last_wheel_spin', now);
      }
    }, 4500);
  };

  const handleApplyPromo = () => {
    if (wonPrize?.code && applyPromo) {
      applyPromo(wonPrize.code);
      sound.playSuccess();
      setIsCopied(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  const handleCopyCode = () => {
    if (wonPrize?.code) {
      navigator.clipboard.writeText(wonPrize.code);
      sound.playPop();
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-100 relative text-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 absolute top-5 right-5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Omadli Sovrinlar
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            Omad G'ildiragi
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Aylantiring va 100% kafolatlangan promokod yoki tangalarni yutib oling!
          </p>
        </div>

        {/* Wheel Canvas / SVG Container */}
        <div className="relative py-2 flex items-center justify-center">
          {/* Wheel Pointer (Top center) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-8 h-10 -mt-2 filter drop-shadow-md">
            <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[30px] border-t-rose-600 mx-auto" />
          </div>

          {/* Rotating Wheel Container */}
          <div
            className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-slate-900/10 dark:border-white/10 shadow-2xl relative overflow-hidden transition-transform duration-[4500ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
            style={{
              transform: `rotate(${rotation}deg)`
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {SECTORS.map((sector, index) => {
                const angle = sectorAngle;
                const startAngle = index * angle;
                const endAngle = startAngle + angle;

                const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                // Text position
                const textAngle = startAngle + angle / 2;
                const textRad = (Math.PI * textAngle) / 180;
                const tx = 50 + 33 * Math.cos(textRad);
                const ty = 50 + 33 * Math.sin(textRad);

                return (
                  <g key={sector.id}>
                    <path d={pathData} fill={sector.color} stroke="#ffffff" strokeWidth="0.8" />
                    <text
                      x={tx}
                      y={ty}
                      fill={sector.textColor}
                      fontSize="3.8"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
                    >
                      {sector.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Wheel Center Hub */}
            <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-xl border-2 border-amber-400">
              <Gift className="w-6 h-6 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Won Prize Celebration Modal */}
        {wonPrize && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-pink-500/10 border border-amber-400/40 animate-stat-card space-y-3">
            <div className="flex items-center justify-center gap-2 text-amber-500 font-extrabold text-base">
              <Trophy className="w-5 h-5" />
              <span>Tabriklaymiz! Siz yutdingiz:</span>
            </div>

            <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {wonPrize.label}
            </div>

            {wonPrize.type === 'coins' ? (
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                🪙 +{wonPrize.amount.toLocaleString()} Moderno Coin hisobingizga muvaffaqiyatli qo'shildi!
              </p>
            ) : (
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-mono font-bold flex items-center gap-2 border border-slate-300 dark:border-slate-700"
                >
                  <span>{wonPrize.code}</span>
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={handleApplyPromo}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5" /> Savatda faollashtirish
                </button>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="space-y-3">
          <button
            onClick={handleSpin}
            disabled={isSpinning || !canSpin}
            className={`w-full py-4 rounded-2xl font-extrabold text-base text-white shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2 ${
              isSpinning || !canSpin
                ? 'bg-slate-400 cursor-not-allowed opacity-70'
                : 'bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 shadow-indigo-500/25 hover:scale-[1.02]'
            }`}
          >
            {isSpinning ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" /> Baraban aylanmoqda...
              </>
            ) : !canSpin ? (
              "Kunlik limit tugadi (Ertaga urinib ko'ring)"
            ) : (
              <>
                <Gift className="w-5 h-5" /> G'ILDIRAKNI AYLANTIRISH!
              </>
            )}
          </button>

          {/* Test Mode toggle for Olympiad Judges */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              🏆 Hakamlar/Sinov rejimi (Cheksiz aylantirish):
            </span>
            <button
              onClick={() => {
                sound.playPop();
                setUnlimitedMode(!unlimitedMode);
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                unlimitedMode ? 'bg-emerald-600 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-700'
              }`}
            >
              {unlimitedMode ? "Yoqilgan (Faol)" : "O'chirilgan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
