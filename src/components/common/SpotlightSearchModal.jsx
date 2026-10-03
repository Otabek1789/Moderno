import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  ArrowRight,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Eye,
  Gift,
  Gamepad2,
  Sparkles,
  Command,
  Package,
  Layers,
  ShoppingBag,
  Heart,
  Scale,
  Rocket,
  RefreshCw,
  Swords,
  Clock,
  Mic
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import sound from '../../utils/soundFX';
import { formatPrice } from '../../utils/formatters';

export default function SpotlightSearchModal({ isOpen, onClose, onOpenVoice, onOpenWheel }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const { products } = useStore();
  const { isDark, toggleTheme } = useTheme();
  const { language, t } = useLanguage();
  const { openA11y } = useAccessibility();

  // Focus on input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // System actions
  const systemActions = [
    {
      id: 'theme',
      title: isDark ? "Kunduzgi rejimga o'tish (Light Mode)" : "Tungi rejimga o'tish (Dark Mode)",
      icon: isDark ? Sun : Moon,
      category: "Amallar",
      badge: isDark ? "Light" : "Dark",
      action: () => {
        sound.playPop();
        toggleTheme();
        onClose();
      }
    },
    {
      id: 'sound',
      title: sound.isMuted() ? "Ovoz effektlarini yoqish" : "Ovoz effektlarini o'chirish",
      icon: sound.isMuted() ? Volume2 : VolumeX,
      category: "Amallar",
      badge: "Audio",
      action: () => {
        sound.toggleMute();
        onClose();
      }
    },
    {
      id: 'a11y',
      title: "Maxsus Imkoniyatlar (A11y / Shrift & Kontrast)",
      icon: Eye,
      category: "Amallar",
      badge: "Inklyuziv",
      action: () => {
        sound.playClick();
        onClose();
        openA11y();
      }
    },
    {
      id: 'wheel',
      title: "Omad G'ildiragini Aylantirish (Sovrinlar)",
      icon: Gift,
      category: "O'yinlar",
      badge: "Yutuq",
      action: () => {
        sound.playClick();
        onClose();
        if (onOpenWheel) onOpenWheel();
      }
    },
    {
      id: 'voice',
      title: "Ovozli qidiruvni ishga tushirish",
      icon: Mic,
      category: "Amallar",
      badge: "AI Nutq",
      action: () => {
        sound.playClick();
        onClose();
        if (onOpenVoice) onOpenVoice();
      }
    }
  ];

  // Navigation pages
  const navPages = [
    { id: 'shop', title: "Katalog & Barcha Mahsulotlar", to: "/shop", icon: ShoppingBag, category: "Sahifalar" },
    { id: 'cart', title: "Xarid Savatchasi", to: "/cart", icon: ShoppingBag, category: "Sahifalar" },
    { id: 'orders', title: "Buyurtmalar tarixi & Jonli kuzatuv", to: "/orders", icon: Package, category: "Sahifalar" },
    { id: 'wishlist', title: "Sevimlilar Ro'yxati (Wishlist)", to: "/wishlist", icon: Heart, category: "Sahifalar" },
    { id: 'compare', title: "Mahsulotlarni Solishtirish", to: "/compare", icon: Scale, category: "Sahifalar" },
    { id: 'builder', title: "PC Builder (Kompyuter yig'ish & FPS)", to: "/builder", icon: Gamepad2, category: "Asboblar" },
    { id: 'mystery', title: "Mystery Box (Sirli Qutilar)", to: "/mystery-box", icon: Gift, category: "Asboblar" },
    { id: 'tradein', title: "Trade-In (Eski gadjetni almashtirish)", to: "/trade-in", icon: RefreshCw, category: "Asboblar" },
    { id: 'battle', title: "Gadget Battle Arena (Jang)", to: "/battle", icon: Swords, category: "Asboblar" },
    { id: 'upgrader', title: "Upgrader (Gadjetni kuchaytirish)", to: "/upgrader", icon: Rocket, category: "Asboblar" },
    { id: 'admin', title: "Admin Panel & Analitika", to: "/admin", icon: Layers, category: "Sahifalar" }
  ];

  // Filter items
  const q = query.toLowerCase().trim();

  const filteredActions = systemActions.filter((a) => a.title.toLowerCase().includes(q));
  const filteredPages = navPages.filter((p) => p.title.toLowerCase().includes(q));
  const filteredProducts = q
    ? products.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)).slice(0, 5)
    : [];

  const allItems = [
    ...filteredProducts.map((p) => ({
      id: `p-${p.id}`,
      title: p.name,
      sub: formatPrice(p.price),
      image: p.image,
      category: "Mahsulotlar",
      action: () => {
        sound.playClick();
        onClose();
        navigate(`/product/${p.id}`);
      }
    })),
    ...filteredPages.map((p) => ({
      id: p.id,
      title: p.title,
      icon: p.icon,
      category: p.category,
      action: () => {
        sound.playClick();
        onClose();
        navigate(p.to);
      }
    })),
    ...filteredActions.map((a) => ({
      id: a.id,
      title: a.title,
      icon: a.icon,
      badge: a.badge,
      category: a.category,
      action: a.action
    }))
  ];

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (allItems.length || 1));
      sound.playClick();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (allItems.length || 1)) % (allItems.length || 1));
      sound.playClick();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        allItems[selectedIndex].action();
      } else if (query.trim()) {
        sound.playClick();
        onClose();
        navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Tezkor qidiruv yoki buyruq yozing... (masalan: iPhone, Dark, PC, Savat)"
            className="w-full bg-transparent text-sm sm:text-base outline-none font-medium placeholder-slate-400 dark:placeholder-slate-500"
          />
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span>ESC</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-1 divide-y divide-slate-100 dark:divide-slate-800/40">
          {allItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Hech qanday natija topilmadi. Boshqa so'z bilan izlab ko'ring.
            </div>
          ) : (
            allItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon || Sparkles;

              return (
                <div
                  key={item.id || idx}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between cursor-pointer transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="w-9 h-9 rounded-xl object-cover shrink-0 border border-black/10"
                      />
                    ) : (
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                    )}

                    <div className="truncate">
                      <p className="text-xs sm:text-sm font-semibold truncate">{item.title}</p>
                      {item.sub && (
                        <p className={`text-[11px] font-bold ${isSelected ? 'text-amber-200' : 'text-indigo-600 dark:text-indigo-400'}`}>
                          {item.sub}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider ${
                        isSelected ? 'text-indigo-100' : 'text-slate-400'
                      }`}
                    >
                      {item.category}
                    </span>
                    <ArrowRight
                      className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1 opacity-100' : 'opacity-0'}`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-5 py-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono">
              <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800">↑↓</span> Harakat
            </span>
            <span className="flex items-center gap-1 font-mono">
              <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800">↵</span> Tanlash
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>MODERNO Spotlight v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
