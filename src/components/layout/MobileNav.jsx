import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Store, Heart, ShoppingBag, User, ShieldAlert, Rocket } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function MobileNav() {
  const location = useLocation();
  const { cartCount, wishlistCount } = useStore();
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();

  const links = [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/shop', label: t('nav.shop'), icon: Store },
    { to: '/upgrader', label: "Upgrader 🚀", icon: Rocket, isSpecial: true },
    { to: '/cart', label: t('nav.cart'), icon: ShoppingBag, badge: cartCount },
    { to: '/wishlist', label: t('nav.wishlist'), icon: Heart, badge: wishlistCount },
    {
      to: isAdmin ? '/admin' : user ? '/orders' : '/login',
      label: isAdmin ? 'Admin' : user ? t('nav.orders') : t('nav.login'),
      icon: isAdmin ? ShieldAlert : User
    }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 px-3 py-2">
      <div className="flex items-center justify-around">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl relative transition-all ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-indigo-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
