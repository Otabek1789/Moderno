import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
        <ShoppingBag className="w-10 h-10" />
      </div>
      <h1 className="text-6xl font-black text-indigo-600 dark:text-indigo-400">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        {t('notFound.title')}
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        {t('notFound.desc')}
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('notFound.backHome')}</span>
      </Link>
    </div>
  );
}
