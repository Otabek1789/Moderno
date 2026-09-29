import React, { useState } from 'react';
import { CreditCard, Calendar, CheckCircle2, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatters';

const PARTNERS = [
  { id: 'uzum', name: 'Uzum Nasiya', rate: 1.0, color: 'from-violet-600 to-indigo-600', badge: '0% Aksiyada' },
  { id: 'anor', name: 'Anorbank', rate: 1.05, color: 'from-rose-500 to-red-600', badge: 'Tezkor' },
  { id: 'alif', name: 'Alif Nasiya', rate: 1.08, color: 'from-emerald-500 to-teal-600', badge: 'Pasportsiz' },
  { id: 'zood', name: 'Zoodpay', rate: 1.04, color: 'from-amber-500 to-orange-600', badge: '1 daqiqada' }
];

export default function InstallmentCalculator({ price, onApply }) {
  const { t } = useLanguage();
  const [months, setMonths] = useState(12);
  const [selectedPartner, setSelectedPartner] = useState(PARTNERS[0]);

  const activePrice = Number(price) || 0;
  const totalPrice = Math.round(activePrice * selectedPartner.rate);
  const monthlyPayment = Math.round(totalPrice / months);

  const monthOptions = [3, 6, 12, 24];

  return (
    <div className="bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-white dark:from-slate-900/90 dark:via-slate-900 dark:to-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/40 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/25">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>{t('installment.applyNow')}</span>
              <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 whitespace-nowrap shrink-0">
                {t('installment.zeroInitial')}
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ortiqcha hujjatlarsiz, 3 daqiqa ichida onlayn rasmiylashtirish
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">{t('installment.monthlyFrom')}</div>
          <div className="text-lg sm:text-xl font-black text-indigo-600 dark:text-indigo-400">
            {formatPrice(monthlyPayment)}
            <span className="text-xs font-normal text-slate-500"> / oy</span>
          </div>
        </div>
      </div>

      {/* Month Selector Buttons */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          {t('installment.selectMonths')}
        </label>
        <div className="grid grid-cols-4 gap-2">
          {monthOptions.map((m) => {
            const isSelected = months === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setMonths(m)}
                className={`py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25 scale-[1.02]'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                }`}
              >
                {m} oy
              </button>
            );
          })}
        </div>
      </div>

      {/* Financing Partners */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          {t('installment.providers')}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PARTNERS.map((p) => {
            const isSelected = selectedPartner.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPartner(p)}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-slate-800 border-indigo-600 shadow-sm ring-2 ring-indigo-500/20'
                    : 'bg-white/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{p.name}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                </div>
                <span className="text-[10px] font-semibold text-slate-500 block truncate">
                  {p.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Breakdown Summary Box */}
      <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 text-xs space-y-1.5">
        <div className="flex justify-between text-slate-500 dark:text-slate-400">
          <span>{t('installment.zeroInitial')}:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">0 so'm</span>
        </div>
        <div className="flex justify-between text-slate-500 dark:text-slate-400">
          <span>{t('installment.monthlyPayment')} ({months} oy):</span>
          <span className="font-bold text-slate-900 dark:text-slate-100">{formatPrice(monthlyPayment)}</span>
        </div>
        <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100 pt-1.5 border-t border-slate-100 dark:border-slate-700">
          <span>{t('installment.totalAmount')}:</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {/* Action Button */}
      {onApply && (
        <button
          type="button"
          onClick={() => onApply({ months, partner: selectedPartner, monthlyPayment, totalPrice })}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-95 transition"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>{months} oyga {formatPrice(monthlyPayment)} dan rasmiylashtirish</span>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </button>
      )}
    </div>
  );
}
