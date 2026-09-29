import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Send, Phone, Mail, MapPin, Heart, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const location = useLocation();

  // Strictly NEVER render footer on Admin panel or Auth pages
  if (location.pathname.toLowerCase().startsWith('/admin') || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter & Telegram Section */}
        <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 sm:p-10 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="max-w-xl text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-400 mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Telegram Botimizga ulaning
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Buyurtmalaringiz holatini Telegram orqali real vaqtda kuzating
              </h3>
              <p className="text-sm text-slate-400">
                Aksiyalar, yangi tovarlar va chegirmali promokodlar to'g'ridan-to'g'ri botimizda!
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href="https://t.me/nekitekibeki_bot?start=website"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition active:scale-95"
              >
                <Send className="w-4 h-4" /> Telegram Botni Ochish (@nekitekibeki_bot)
              </a>
            </div>
          </div>
        </div>

        {/* 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                MODERNO
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {t('footer.desc')}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Rasmiy Kafolat
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <CreditCard className="w-4 h-4 text-sky-400" /> Xavfsiz To'lov
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition">
                  {t('nav.shop')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition">
                  {t('nav.orders')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {t('nav.categories')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shop?category=smartphones" className="hover:text-white transition">
                  Smartfonlar
                </Link>
              </li>
              <li>
                <Link to="/shop?category=laptops" className="hover:text-white transition">
                  Noutbuklar
                </Link>
              </li>
              <li>
                <Link to="/shop?category=audio" className="hover:text-white transition">
                  Quloqchinlar va Audio
                </Link>
              </li>
              <li>
                <Link to="/shop?category=watches" className="hover:text-white transition">
                  Aqlli soatlar
                </Link>
              </li>
              <li>
                <Link to="/shop?category=appliances" className="hover:text-white transition">
                  Maishiy Texnika
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {t('contact.title')}
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-1" />
                <span>Toshkent shahri, Yunusobod, Amir Temur shox ko'chasi 107B</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+998 71 200 44 44</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>info@moderno.uz</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Payment Badges & Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MODERNO. {t('footer.rights')}</p>
          
          {/* Payment Badges */}
          <div className="flex items-center gap-2 font-mono text-[10px] font-bold">
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">CLICK</span>
            <span className="px-2 py-1 rounded bg-slate-800 text-emerald-400">PAYME</span>
            <span className="px-2 py-1 rounded bg-slate-800 text-blue-400">UZCARD</span>
            <span className="px-2 py-1 rounded bg-slate-800 text-amber-400">HUMO</span>
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">VISA</span>
            <span className="px-2 py-1 rounded bg-slate-800 text-rose-400">MC</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
