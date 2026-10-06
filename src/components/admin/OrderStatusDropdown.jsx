import React, { useState, useRef, useEffect } from 'react';
import {
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Check
} from 'lucide-react';
import sound from '../../utils/soundFX';

const STATUS_CONFIG = {
  pending: {
    id: 'pending',
    label: 'Kutilmoqda',
    desc: 'Yangi qabul qilingan',
    color: 'text-amber-600 dark:text-amber-400',
    activeBg: 'bg-amber-500/15 border-amber-500/40',
    badgeBg: 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50',
    dot: 'bg-amber-500 animate-pulse',
    icon: Clock
  },
  shipping: {
    id: 'shipping',
    label: 'Yetkazilmoqda',
    desc: "Kuryer yo'lda",
    color: 'text-sky-600 dark:text-sky-400',
    activeBg: 'bg-sky-500/15 border-sky-500/40',
    badgeBg: 'bg-sky-500/10 border-sky-500/30 hover:border-sky-500/50',
    dot: 'bg-sky-500 animate-pulse',
    icon: Truck
  },
  delivered: {
    id: 'delivered',
    label: 'Yakunlandi',
    desc: 'Muvaffaqiyatli topshirildi',
    color: 'text-emerald-600 dark:text-emerald-400',
    activeBg: 'bg-emerald-500/15 border-emerald-500/40',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50',
    dot: 'bg-emerald-500',
    icon: CheckCircle2
  },
  cancelled: {
    id: 'cancelled',
    label: 'Bekor qilindi',
    desc: 'Buyurtma bekor qilingan',
    color: 'text-rose-600 dark:text-rose-400',
    activeBg: 'bg-rose-500/15 border-rose-500/40',
    badgeBg: 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500/50',
    dot: 'bg-rose-500',
    icon: XCircle
  }
};

export default function OrderStatusDropdown({ status, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const current = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const CurrentIcon = current.icon;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (newStatus) => {
    sound.playPop();
    onChange(newStatus);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          sound.playClick();
          setIsOpen(!isOpen)}
        }
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 shadow-xs hover:scale-105 active:scale-95 ${current.badgeBg} ${current.color}`}
        title="Holatni o'zgartirish uchun bosing"
      >
        <span className={`w-2 h-2 rounded-full ${current.dot}`} />
        <CurrentIcon className="w-3.5 h-3.5 shrink-0" />
        <span className="whitespace-nowrap font-extrabold">{current.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 opacity-70 ${
            isOpen ? 'rotate-180 opacity-100' : ''
          }`}
        />
      </button>

      {/* Custom Glassmorphism Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-56 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-1.5 z-50 animate-scaleUp">
          <div className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800/80 mb-1 flex items-center justify-between">
            <span>Holatni tanlang</span>
            <span className="text-[9px] font-medium text-slate-400 lowercase">bosing</span>
          </div>

          <div className="space-y-1">
            {Object.values(STATUS_CONFIG).map((item) => {
              const Icon = item.icon;
              const isSelected = item.id === status;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all text-left group ${
                    isSelected
                      ? `${item.activeBg} ${item.color} font-bold shadow-xs border`
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-white/40 dark:bg-white/10' : 'bg-slate-100 dark:bg-slate-800 group-hover:scale-110 transition-transform'
                    }`}>
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                        <span className="font-extrabold truncate">{item.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate -mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 ml-1.5 shadow-xs">
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
  );
}
