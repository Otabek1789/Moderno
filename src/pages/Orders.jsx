import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Eye,
  Search,
  MapPin,
  Phone,
  ShieldCheck,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice, formatDate } from '../utils/formatters';

export default function Orders() {
  const { orders } = useStore();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all' | 'pending' | 'shipping' | 'delivered'
  const [trackedOrderId, setTrackedOrderId] = useState(null);

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

  const getStepIndex = (status) => {
    switch (status) {
      case 'pending': return 1;
      case 'shipping': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchSearch = String(o.id).includes(searchQuery.trim().replace('#', '')) ||
      (o.customerName && o.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.phone && o.phone.includes(searchQuery));
    const matchStatus = selectedStatus === 'all' || o.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const activeTrackedOrder = trackedOrderId
    ? orders.find((o) => o.id === trackedOrderId)
    : (orders.length > 0 ? orders[0] : null);

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-fadeIn">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <Package className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <span>{t('orders.title')} ({orders.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Barcha buyurtmalaringiz va ularning kuryerlik bosqichlari
          </p>
        </div>

        {/* Search Order by ID input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buyurtma ID orqali kuzatish (masalan: 1024)..."
            className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-100 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Active Order Real-Time Tracker Widget */}
      {activeTrackedOrder && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-2xl border border-indigo-500/30 space-y-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center font-black text-indigo-300">
                #{activeTrackedOrder.id}
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg">
                  Jonli Buyurtma Kuzatuvi #{activeTrackedOrder.id}
                </h3>
                <p className="text-xs text-indigo-200">
                  Buyurtma sanasi: {formatDate(activeTrackedOrder.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl font-black text-amber-300">
                {formatPrice(activeTrackedOrder.totalAmount)}
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="py-4">
            <div className="relative">
              {/* Line */}
              <div className="absolute top-5 left-6 right-6 h-1 bg-white/20 rounded-full">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${(getStepIndex(activeTrackedOrder.status) / 3) * 100}%` }}
                />
              </div>

              {/* Steps */}
              <div className="grid grid-cols-4 relative text-center">
                {[
                  { title: "Qabul qilindi", desc: "Tizimda qayd etildi", icon: Clock },
                  { title: "Tayyorlanmoqda", desc: "Omborda qadoqlanmoqda", icon: Package },
                  { title: "Kuryer yo'lda", desc: "Yetkazib berilmoqda", icon: Truck },
                  { title: "Yetkazildi", desc: "Mijozga topshirildi", icon: CheckCircle2 }
                ].map((step, idx) => {
                  const Icon = step.icon;
                  const currentIdx = getStepIndex(activeTrackedOrder.status);
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-all shadow-md ${
                          isDone
                            ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        } ${isCurrent ? 'animate-bounce' : ''}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs font-bold ${isDone ? 'text-white' : 'text-slate-400'}`}>
                        {step.title}
                      </span>
                      <span className="text-[10px] text-indigo-200 hidden sm:inline mt-0.5">
                        {step.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Courier and Delivery details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2 text-indigo-100">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{activeTrackedOrder.address}</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-100">
              <Phone className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Kuryer: +998 (90) 123-45-67 (Bobur M.)</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-100">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>To'lov: {activeTrackedOrder.paymentMethod.toUpperCase()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: "Barchasi" },
          { id: 'pending', label: "Kutilmoqda" },
          { id: 'shipping', label: "Yetkazilmoqda" },
          { id: 'delivered', label: "Yetkazib berildi" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedStatus(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
              selectedStatus === tab.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            Hech qanday buyurtma topilmadi.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => setTrackedOrderId(order.id)}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition cursor-pointer shadow-sm hover:shadow-md ${
                trackedOrderId === order.id
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold">
                    #{order.id}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span>Buyurtma #{order.id}</span>
                      <span className="text-xs text-slate-400 font-normal">({order.customerName})</span>
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
          ))
        )}
      </div>
    </div>
  );
}
