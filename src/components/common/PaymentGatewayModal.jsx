import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  ArrowRight,
  Sparkles,
  RotateCcw,
  FileText
} from 'lucide-react';
import sound from '../../utils/soundFX';
import { formatPrice } from '../../utils/formatters';

export default function PaymentGatewayModal({
  isOpen,
  onClose,
  amount,
  method = 'click', // 'click' | 'payme' | 'uzum' | 'card'
  orderId,
  customerPhone = '+998 90 123 45 67',
  onPaymentSuccess,
  onOpenReceipt
}) {
  const [step, setStep] = useState('card'); // 'card' | 'otp' | 'success'
  const [cardNumber, setCardNumber] = useState('8600 5412 8934 6721');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('card');
      setOtpCode('');
      setTimer(60);
      setIsLoading(false);
      setTransactionId(`TXN-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  // Auto-detect card brand
  const cleanNum = cardNumber.replace(/\s+/g, '');
  let cardBrand = 'Uzcard';
  let brandColor = 'from-blue-600 to-indigo-700';

  if (cleanNum.startsWith('9860')) {
    cardBrand = 'Humo';
    brandColor = 'from-amber-600 to-orange-700';
  } else if (cleanNum.startsWith('4')) {
    cardBrand = 'VISA';
    brandColor = 'from-sky-700 to-blue-900';
  } else if (cleanNum.startsWith('5')) {
    cardBrand = 'Mastercard';
    brandColor = 'from-rose-600 to-red-800';
  }

  // Format card number with spaces
  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardExpiry(val);
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, '').length < 16) {
      alert("Iltimos, to'liq 16 xonali karta raqamini kiriting!");
      return;
    }
    sound.playPop();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 800);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      alert("Iltimos, 4 xonali SMS kodni kiriting!");
      return;
    }

    sound.playPop();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
      sound.playSuccess();
      sound.playCash();
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (onPaymentSuccess) {
        onPaymentSuccess({
          transactionId,
          method,
          amount,
          time: new Date().toISOString()
        });
      }
    }, 1200);
  };

  const getMethodBadge = () => {
    switch (method) {
      case 'payme':
        return { name: "Payme Online", color: "bg-teal-500 text-white" };
      case 'click':
        return { name: "Click Up", color: "bg-blue-600 text-white" };
      case 'uzum':
        return { name: "Uzum Bank / Nasiya", color: "bg-violet-600 text-white" };
      default:
        return { name: "Bank Kartasi", color: "bg-indigo-600 text-white" };
    }
  };

  const methodInfo = getMethodBadge();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-100 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${methodInfo.color}`}>
              {methodInfo.name}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              <Lock className="w-3.5 h-3.5" /> 256-bit SSL Shifrlangan
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: CARD DETAILS */}
        {step === 'card' && (
          <form onSubmit={handleCardSubmit} className="space-y-5 animate-fadeIn">
            {/* Visual Bank Card mockup */}
            <div
              className={`p-5 rounded-2xl bg-gradient-to-tr ${brandColor} text-white shadow-xl relative overflow-hidden space-y-4`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono tracking-widest uppercase opacity-80">MODERNO PAY</span>
                <span className="text-sm font-black tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-md">
                  {cardBrand}
                </span>
              </div>

              <div className="text-lg sm:text-xl font-mono tracking-widest font-black py-1">
                {cardNumber || '•••• •••• •••• ••••'}
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="opacity-60 block text-[9px]">KARTA EGASI</span>
                  <span className="font-bold">MIJOZ TANISHOV</span>
                </div>
                <div>
                  <span className="opacity-60 block text-[9px]">MUDDATI</span>
                  <span className="font-bold">{cardExpiry || 'MM/YY'}</span>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Karta raqami (Uzcard / Humo / Visa)
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="8600 0000 0000 0000"
                    maxLength={19}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Amal qilish muddati
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    To'lov summasi
                  </label>
                  <div className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-extrabold text-indigo-600 dark:text-indigo-400 text-center">
                    {formatPrice(amount)}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition transform active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" /> Shifrlanmoqda...
                </>
              ) : (
                <>
                  <span>To'lash: {formatPrice(amount)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: 3D SECURE SMS OTP */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-5 animate-fadeIn text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <Smartphone className="w-7 h-7 animate-pulse" />
            </div>

            <div>
              <h4 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
                SMS Tasdiqlash Kodi
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Karta egasining telefoniga ({customerPhone}) 4 xonali xavfsizlik kodi yuborildi
              </p>
            </div>

            {/* Test helper banner for Olympiad Judges */}
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
              <span>🏆 Sinov kodi: <b>7492</b></span>
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  setOtpCode('7492');
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold"
              >
                Kodni kiritish
              </button>
            </div>

            <div>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                maxLength={4}
                required
                className="w-40 mx-auto text-center text-3xl font-mono font-black tracking-widest py-3 rounded-2xl border-2 border-indigo-500 bg-white dark:bg-slate-800 outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-2">
                Kod amal qilish muddati: <b className="text-indigo-600">{timer} soniya</b>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || otpCode.length < 4}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition transform active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" /> Tekshirilmoqda...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> To'lovni tasdiqlash
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 'success' && (
          <div className="space-y-5 animate-fadeIn text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 animate-pop-in" />
            </div>

            <div>
              <h4 className="font-extrabold text-xl text-slate-900 dark:text-slate-100">
                To'lov Muvaffaqiyatli O'tdi!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Tranzaksiya ID: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{transactionId}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">To'langan summa:</span>
                <span className="font-black text-indigo-600 dark:text-indigo-400">{formatPrice(amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">To'lov usuli:</span>
                <span className="font-bold">{methodInfo.name} ({cardBrand})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Holat:</span>
                <span className="font-bold text-emerald-600">Tasdiqlandi (Fiskallashtirildi)</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                  if (onOpenReceipt) onOpenReceipt();
                }}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition transform active:scale-95"
              >
                <FileText className="w-4 h-4" /> 🧾 Elektron Fiskal Chekni Ko'rish / Chop etish
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-semibold text-xs transition"
              >
                Oynani yopish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
