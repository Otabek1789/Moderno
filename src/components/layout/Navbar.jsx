import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  Sun,
  Moon,
  Globe,
  User,
  Menu,
  X,
  ShieldAlert,
  LogOut,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  Send,
  Scale,
  Rocket,
  Volume2,
  VolumeX,
  Gamepad2,
  Gift,
  RefreshCw,
  Swords,
  ChevronDown
} from 'lucide-react';
import sound from '../../utils/soundFX';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/formatters';
import { FlagUZ, FlagRU, FlagEN } from '../common/FlagIcons';

export default function Navbar() {
  const { cartCount, wishlistCount, compareCount, products } = useStore();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(() => sound.isMuted());

  const searchRef = useRef(null);
  const langRef = useRef(null);
  const userRef = useRef(null);
  const toolsRef = useRef(null);

  useEffect(() => {
    const handleSoundToggle = (e) => {
      setIsSoundMuted(e.detail.muted);
    };
    window.addEventListener('moderno-sound-toggle', handleSoundToggle);
    return () => window.removeEventListener('moderno-sound-toggle', handleSoundToggle);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setIsToolsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Live matching search results
  const searchResults = searchQuery.trim().length >= 1
    ? products
        .filter((p) => {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCat =
            typeof p.categoryName === 'object'
              ? (p.categoryName[language] || '').toLowerCase().includes(q)
              : p.category.toLowerCase().includes(q);
          return matchName || matchCat;
        })
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const languages = [
    { code: 'uz', label: "O'zbekcha", Icon: FlagUZ },
    { code: 'ru', label: "Русский", Icon: FlagRU },
    { code: 'en', label: "English", Icon: FlagEN }
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];
  const CurrentIcon = currentLangObj.Icon;

  const interactiveTools = [
    {
      to: '/builder',
      title: 'PC Builder Studio',
      desc: "Kompyuter yig'ish va FPS tester",
      icon: Gamepad2,
      badge: 'Yangi 🎮',
      color: 'from-blue-600 to-indigo-600',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    {
      to: '/mystery-box',
      title: 'Mystery Box Arena',
      desc: 'Sirli qutilar & bepul yutuqlar',
      icon: Gift,
      badge: 'Hot 🎁',
      color: 'from-amber-500 to-rose-500',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      to: '/trade-in',
      title: 'Trade-In Kalkulyator',
      desc: 'Eski gadjetni yangisiga almashtirish',
      icon: RefreshCw,
      badge: 'Almashish 🔄',
      color: 'from-emerald-500 to-teal-600',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      to: '/battle',
      title: 'Gadget Battle Arena',
      desc: 'Flagmanlar yakkama-yak jangi',
      icon: Swords,
      badge: 'VS ⚔️',
      color: 'from-purple-600 to-pink-600',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    },
    {
      to: '/upgrader',
      title: "Upgrader O'yini",
      desc: 'Gadjetni kuchaytirish & omad',
      icon: Rocket,
      badge: 'Omad 🚀',
      color: 'from-indigo-600 to-violet-600',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    }
  ];

  const handleToggleSound = () => {
    const newMuted = sound.toggleMute();
    setIsSoundMuted(newMuted);
  };

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/shop', label: t('nav.shop') },
    { to: '/compare', label: t('nav.compare'), badge: compareCount },
    { to: '/orders', label: t('nav.orders') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Top Banner (Centered Promo Announcement) */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs py-1.5 px-4 font-medium tracking-wide relative overflow-hidden">
        <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between min-h-[26px] relative">
          
          {/* Left Decorative/Badge (Hidden on small, balanced with right side) */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-white/90 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">Rasmiy Do'kon</span>
          </div>

          {/* EXACT GEOMETRIC CENTER ANNOUNCEMENT */}
          <div className="w-full lg:w-auto lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex items-center justify-center gap-2 sm:gap-2.5 text-center">
            <span className="inline-flex items-center gap-1.5 font-bold text-[11.5px] sm:text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
              <span>"UZBEK2026" promokodi bilan 15% chegirma!</span>
            </span>
            <a
              href="https://t.me/nekitekibeki_bot?start=website"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-indigo-700 text-[11px] font-bold transition shadow-xs whitespace-nowrap active:scale-95"
            >
              <Send className="w-3 h-3" />
              <span>Botni Ochish</span>
            </a>
          </div>

          {/* Right Telegram Link */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-white/90 shrink-0 ml-auto">
            <span>🤖 Telegram Bot:</span>
            <a
              href="https://t.me/nekitekibeki_bot?start=website"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold hover:text-amber-200"
            >
              @nekitekibeki_bot
            </a>
          </div>

        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  MODERNO
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase -mt-1">
                  Online Store
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 shrink-0">
            <Link
              to="/"
              className={`px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
                location.pathname === '/'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>{t('nav.home')}</span>
            </Link>

            <Link
              to="/shop"
              className={`px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
                location.pathname === '/shop'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>{t('nav.shop')}</span>
            </Link>

            {/* Interactive Studios & Games Dropdown */}
            <div ref={toolsRef} className="relative">
              <button
                onClick={() => {
                  sound.playClick();
                  setIsToolsDropdownOpen(!isToolsDropdownOpen);
                }}
                className={`px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
                  ['/builder', '/mystery-box', '/trade-in', '/battle', '/upgrader'].includes(location.pathname)
                    ? 'bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
                <span>Studiyalar & O'yinlar</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isToolsDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 p-2 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Interaktiv Asboblar & O'yinlar
                  </div>
                  <div className="space-y-1 mt-1">
                    {interactiveTools.map((tool) => {
                      const Icon = tool.icon;
                      const isCurrent = location.pathname === tool.to;
                      return (
                        <Link
                          key={tool.to}
                          to={tool.to}
                          onClick={() => {
                            sound.playClick();
                            setIsToolsDropdownOpen(false);
                          }}
                          className={`flex items-center gap-3 p-2.5 rounded-xl transition ${
                            isCurrent
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-500/30'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/80'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shrink-0 shadow-xs`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                                {tool.title}
                              </span>
                              <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${tool.badgeColor}`}>
                                {tool.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {tool.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/compare"
              className={`px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
                location.pathname === '/compare'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>{t('nav.compare')}</span>
              {compareCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </Link>

            <Link
              to="/orders"
              className={`px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
                location.pathname === '/orders'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>{t('nav.orders')}</span>
            </Link>
          </nav>

          {/* Live Search Bar (Desktop) */}
          <div ref={searchRef} className="relative hidden md:block flex-1 max-w-[180px] xl:max-w-xs">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder={t('nav.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>

            {/* Instant Search Results Dropdown */}
            {isSearchOpen && searchQuery.trim().length >= 1 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3">
                  Qidiruv natijalari ({searchResults.length})
                </div>
                {searchResults.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-72 overflow-y-auto">
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        to={`/product/${item.id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-3 p-2.5 hover:bg-indigo-50/60 dark:hover:bg-slate-800 transition"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg bg-slate-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {formatPrice(item.discountPrice || item.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full py-2.5 px-3 text-xs font-semibold text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-center flex items-center justify-center gap-1"
                    >
                      Barcha natijalarni ko'rish <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    "{searchQuery}" bo'yicha hech narsa topilmadi
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons: Language, DarkMode, Telegram Bot, Wishlist, Cart, Profile */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            
            {/* Language Switcher with Real SVG Flags (No "GB" text!) */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition border border-slate-200/60 dark:border-slate-800"
              >
                <CurrentIcon className="w-5 h-3.5" />
                <span className="hidden sm:inline uppercase">{currentLangObj.code}</span>
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50 p-1">
                  {languages.map((l) => {
                    const FlagComp = l.Icon;
                    return (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-left transition ${
                          language === l.code
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <FlagComp className="w-5 h-3.5" />
                        <span>{l.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Telegram Bot Direct Open Button */}
            <a
              href="https://t.me/nekitekibeki_bot?start=website"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram Botni ochish"
              title="Telegram Bot (@nekitekibeki_bot)"
              className="p-2 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded-xl transition"
            >
              <Send className="w-5 h-5" />
            </a>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Sound Toggle (Feature 7) */}
            <button
              onClick={handleToggleSound}
              aria-label={isSoundMuted ? "Ovozni yoqish" : "Ovozni o'chirish"}
              title={isSoundMuted ? "Ovoz o'chirilgan (Muted) - Yoqish uchun bosing" : "Ovoz yoqilgan (Sound FX) - O'chirish uchun bosing"}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              {isSoundMuted ? (
                <VolumeX className="w-5 h-5 text-rose-500" />
              ) : (
                <Volume2 className="w-5 h-5 text-emerald-500 animate-pulse" />
              )}
            </button>

            {/* Compare Icon */}
            <Link
              to="/compare"
              aria-label={t('nav.compare')}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              title="Taqqoslash"
            >
              <Scale className="w-5 h-5" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scaleUp shadow-xs">
                  {compareCount}
                </span>
              )}
            </Link>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              aria-label={t('nav.wishlist')}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scaleUp shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              aria-label={t('nav.cart')}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scaleUp shadow-md shadow-indigo-600/30">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth */}
            <div ref={userRef} className="relative">
              {user ? (
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  title="Akkaunt menyusi"
                >
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/30"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white text-xs font-black shadow-xs ring-2 ring-indigo-500/30">
                        {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    {isAdmin && (
                      <span className="absolute -top-1.5 -right-1 text-xs" title="Admin">
                        👑
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden xl:inline">
                    {user.name.split(' ')[0]}
                  </span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-md shadow-indigo-600/20 flex items-center gap-1.5 shrink-0 whitespace-nowrap"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('nav.login')}</span>
                </Link>
              )}

              {/* User Dropdown */}
              {isUserDropdownOpen && user && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50 p-2 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{user.name}</p>
                    <p className="text-[11px] font-semibold text-slate-400 capitalize">
                      {isAdmin ? "👑 Bosh Administrator" : "👤 Mijoz"}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-xl mt-1.5 border border-amber-200 dark:border-amber-800/60 transition shadow-xs"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>Admin Panel</span>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400">
                        Boshqaruv
                      </span>
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl mt-1 transition"
                  >
                    <User className="w-4 h-4 text-indigo-500" />
                    <span>Profilim & Rasmni O'zgartirish</span>
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl mt-1 transition"
                  >
                    <Package className="w-4 h-4" />
                    {t('nav.orders')}
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl mt-1 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nav.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-1 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              {link.label}
            </Link>
          ))}

          {/* Interactive Tools Section for Mobile */}
          <div className="pt-2 pb-1 border-t border-slate-200 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
              🎮 Studiya & O'yinlar
            </p>
            {interactiveTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.to}
                  to={tool.to}
                  onClick={() => sound.playClick()}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shrink-0`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="flex-1">{tool.title}</span>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${tool.badgeColor}`}>{tool.badge}</span>
                </Link>
              );
            })}
          </div>
          {isAdmin && (
            <Link
              to="/admin"
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40"
            >
              👑 {t('nav.admin')}
            </Link>
          )}
          <a
            href="https://t.me/nekitekibeki_bot?start=website"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40"
          >
            🤖 Telegram Bot (@nekitekibeki_bot)
          </a>
          {!user && (
            <Link
              to="/login"
              className="block mt-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-center text-white bg-indigo-600"
            >
              {t('nav.login')}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
