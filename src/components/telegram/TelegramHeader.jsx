import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Moon,
  Sun,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Heart,
  X
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useStore } from '../../context/StoreContext';
import { useTelegramWebApp } from '../../hooks/useTelegramWebApp';
import { FlagUZ, FlagRU, FlagEN } from '../common/FlagIcons';

export default function TelegramHeader() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { cartCount, wishlistCount, products } = useStore();
  const { tgUser, triggerHaptic } = useTelegramWebApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Search results
  const searchResults = searchQuery.trim()
    ? products
        .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5)
    : [];

  const handleLanguageChange = (lang) => {
    triggerHaptic('light');
    setLanguage(lang);
  };

  const handleToggleTheme = () => {
    triggerHaptic('light');
    toggleTheme();
  };

  const userName = tgUser?.first_name || 'Do\'st';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        {/* User Greeting & Telegram Verified Badge */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-md shadow-sky-500/25 ring-2 ring-white dark:ring-slate-800">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100 truncate">
                Salom, {userName}!
              </span>
              <span className="text-[10px] bg-sky-500/10 text-sky-500 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5 shrink-0">
                <ShieldCheck className="w-3 h-3 text-sky-500" /> Rasmiy
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-400 truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Moderno Telegram Mini App
            </p>
          </div>
        </div>

        {/* Quick Actions (Lang + Theme) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Language Selector */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[11px] font-bold">
            <button
              onClick={() => handleLanguageChange('uz')}
              className={`px-1.5 py-1 rounded-lg flex items-center gap-1 transition ${
                language === 'uz'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                  : 'text-slate-400'
              }`}
            >
              <FlagUZ className="w-3.5 h-2.5 rounded-xs" />
              <span className="hidden xs:inline">UZ</span>
            </button>
            <button
              onClick={() => handleLanguageChange('ru')}
              className={`px-1.5 py-1 rounded-lg flex items-center gap-1 transition ${
                language === 'ru'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                  : 'text-slate-400'
              }`}
            >
              <FlagRU className="w-3.5 h-2.5 rounded-xs" />
              <span className="hidden xs:inline">RU</span>
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-1.5 py-1 rounded-lg flex items-center gap-1 transition ${
                language === 'en'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                  : 'text-slate-400'
              }`}
            >
              <FlagEN className="w-3.5 h-2.5 rounded-xs" />
              <span className="hidden xs:inline">EN</span>
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={handleToggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
            aria-label="Rejimni o'zgartirish"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mini App Quick Search Bar */}
      <div className="mt-2.5 relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Gadjetlar, brendlar qidiruvi..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Popup */}
        {isSearchOpen && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50 divide-y divide-slate-100 dark:divide-slate-800">
            {searchResults.map((prod) => (
              <div
                key={prod.id}
                onClick={() => {
                  triggerHaptic('light');
                  navigate(`/product/${prod.id}`);
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-2.5 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
              >
                <img
                  src={prod.image}
                  alt=""
                  className="w-10 h-10 object-cover rounded-xl bg-slate-100 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {prod.name}
                  </p>
                  <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    {new Intl.NumberFormat('uz-UZ').format(prod.discountPrice || prod.price)} so'm
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
