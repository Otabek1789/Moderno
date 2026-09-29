import React from 'react';
import { History, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import ProductCard from './ProductCard';

export default function RecentlyViewed({ currentProductId }) {
  const { products, recentlyViewedIds } = useStore();

  const recentProducts = recentlyViewedIds
    .filter((id) => id !== Number(currentProductId))
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 4);

  if (recentProducts.length === 0) return null;

  return (
    <section className="space-y-6 pt-6 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Yaqinda ko'rilgan mahsulotlar
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Siz qiziqqan tovarlarga tezda qayting
            </p>
          </div>
        </div>

        <Link
          to="/shop"
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          Katalogga o'tish <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recentProducts.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </section>
  );
}
