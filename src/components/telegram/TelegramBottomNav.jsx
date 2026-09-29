import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Grid,
  Heart,
  ShoppingBag,
  ClipboardList,
  Rocket
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useTelegramWebApp } from '../../hooks/useTelegramWebApp';

export default function TelegramBottomNav() {
  const { cartCount, wishlistCount } = useStore();
  const { triggerHaptic } = useTelegramWebApp();

  const navItems = [
    { to: '/', label: 'Asosiy', icon: Home },
    { to: '/shop', label: 'Katalog', icon: Grid },
    { to: '/upgrader', label: 'Upgrader 🚀', icon: Rocket },
    { to: '/cart', label: 'Savat', icon: ShoppingBag, badge: cartCount },
    { to: '/orders', label: 'Buyurtmalar', icon: ClipboardList }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 shadow-lg safe-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => triggerHaptic('light')}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 relative ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
