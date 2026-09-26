import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle2, XCircle, ArrowRight, Eye } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice, formatDate } from '../utils/formatters';

export default function Orders() {
  const { orders } = useStore();
  const { t } = useLanguage();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> {t('orders.statusCompleted')}
          </span>
        );
      case 'shipping':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Truck className="w-3.5 h-3.5" /> {t('orders.statusShipping')}
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500">
            <XCircle className="w-3.5 h-3.5" /> {t('orders.statusCancelled')}
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="w-3.5 h-3.5" /> {t('orders.statusPending')}
          </span>
        );
    }
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Package className="w-12 h-12" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">
          {t('orders.emptyTitle')}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
          {t('orders.emptySub')}
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 transition transform active:scale-95"
        >
          {t('cart.exploreShop')} <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
          {t('orders.title')} ({orders.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Barcha buyurtmalaringiz va ularning yetkazilish holati
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold">
                  #{order.id}
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                    Buyurtma #{order.id}
                  </h3>
                  <p className="text-xs text-slate-400">{formatDate(order.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(order.status)}
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>

            {/* Items list snippet */}
            <div className="pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Mahsulotlar ({order.items.length}):
              </p>
              <div className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {item.name} <b className="text-slate-400">x {item.quantity}</b>
                    </span>
                    <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Payment Info */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between text-xs text-slate-400 gap-2">
              <span>📍 {order.address}</span>
              <span className="uppercase">💳 {order.paymentMethod}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
