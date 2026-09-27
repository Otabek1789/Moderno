import React, { useState } from 'react';
import { Sparkles, Flame, Tag, Zap, Gift, Truck } from 'lucide-react';
import { useTelegramWebApp } from '../../hooks/useTelegramWebApp';
import { useNavigate } from 'react-router-dom';

const STORIES = [
  {
    id: 1,
    title: 'Chegirmalar',
    subtitle: '-30% gacha aksiyalar',
    icon: Flame,
    color: 'from-amber-500 to-rose-500',
    category: 'all'
  },
  {
    id: 2,
    title: 'Smartfonlar',
    subtitle: 'iPhone 15 & 16 seriyasi',
    icon: Zap,
    color: 'from-indigo-600 to-violet-500',
    category: 'smartphones'
  },
  {
    id: 3,
    title: 'Noutbuklar',
    subtitle: 'M3 va M4 chipidagi MacBook',
    icon: Sparkles,
    color: 'from-sky-500 to-blue-600',
    category: 'laptops'
  },
  {
    id: 4,
    title: 'Promokod',
    subtitle: 'UZBEK2025: -15% arzon',
    icon: Gift,
    color: 'from-purple-500 to-pink-500',
    category: 'promos'
  },
  {
    id: 5,
    title: 'Yetkazish',
    subtitle: 'Butun O\'zbekiston bo\'ylab',
    icon: Truck,
    color: 'from-emerald-500 to-teal-600',
    category: 'shipping'
  }
];

export default function TelegramStories({ onSelectCategory }) {
  const { triggerHaptic } = useTelegramWebApp();
  const navigate = useNavigate();
  const [activeStory, setActiveStory] = useState(null);

  const handleStoryClick = (story) => {
    triggerHaptic('medium');
    if (story.category === 'promos') {
      navigate('/cart');
    } else if (onSelectCategory && story.category !== 'shipping') {
      onSelectCategory(story.category);
    } else {
      navigate('/shop');
    }
  };

  return (
    <div className="py-2.5 px-4 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-3.5 w-max">
        {STORIES.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => handleStoryClick(s)}
              className="flex flex-col items-center gap-1.5 focus:outline-none group text-center"
            >
              <div
                className={`w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr ${s.color} ring-2 ring-transparent group-hover:scale-105 group-active:scale-95 transition-transform duration-200`}
              >
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-slate-800 dark:text-slate-100">
                  <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition" />
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 w-16 truncate">
                {s.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
