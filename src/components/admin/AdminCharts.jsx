import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

// 1. Dynamic SVG Revenue Area Chart with timeframe toggle
export function RevenueChart({ totalRevenue }) {
  const [timeframe, setTimeframe] = useState('week'); // 'week' | 'month' | 'year'
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const dataSets = {
    week: [
      { label: 'Dush', value: 8500000 },
      { label: 'Sesh', value: 12400000 },
      { label: 'Chor', value: 9800000 },
      { label: 'Pay', value: 16200000 },
      { label: 'Juma', value: 24500000 },
      { label: 'Shan', value: 31000000 },
      { label: 'Yak', value: 27800000 }
    ],
    month: [
      { label: '1-hafta', value: 45000000 },
      { label: '2-hafta', value: 68000000 },
      { label: '3-hafta', value: 82000000 },
      { label: '4-hafta', value: 110000000 }
    ],
    year: [
      { label: 'Yan', value: 180000000 },
      { label: 'Fev', value: 220000000 },
      { label: 'Mar', value: 310000000 },
      { label: 'Apr', value: 280000000 },
      { label: 'May', value: 350000000 },
      { label: 'Iyun', value: 420000000 }
    ]
  };

  const activeData = dataSets[timeframe];
  const maxValue = Math.max(...activeData.map((d) => d.value));

  // Generate SVG coordinates (width: 500, height: 200)
  const width = 500;
  const height = 180;
  const paddingX = 30;
  const paddingY = 20;

  const points = activeData.map((d, idx) => {
    const x = paddingX + (idx / (activeData.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - (d.value / maxValue) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  // Construct smooth bezier SVG path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx = (p0.x + p1.x) / 2;
    pathD += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  const fillD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Savdo Dinamikasi & Tushum Grafigi
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +24.8%
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real vaqtdagi savdo hajmi va kunlik daromad tahlili
          </p>
        </div>

        {/* Timeframe switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setTimeframe('week')}
            className={`px-3 py-1.5 rounded-lg transition ${
              timeframe === 'week'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Haftalik
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1.5 rounded-lg transition ${
              timeframe === 'month'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Oylik
          </button>
          <button
            onClick={() => setTimeframe('year')}
            className={`px-3 py-1.5 rounded-lg transition ${
              timeframe === 'year'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Yillik
          </button>
        </div>
      </div>

      {/* SVG Interactive Area Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 sm:h-64 overflow-visible"
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />

          {/* Gradient Area Fill */}
          <path d={fillD} fill="url(#revenueGradient)" />

          {/* Main Stroke Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#6366f1"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Points */}
          {points.map((pt, idx) => (
            <g key={idx} className="cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredPoint === idx ? '7' : '4.5'}
                className="fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-slate-900 transition-all duration-200"
                strokeWidth="2.5"
                onMouseEnter={() => setHoveredPoint(idx)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              <text
                x={pt.x}
                y={height - 2}
                textAnchor="middle"
                className="text-[10px] font-bold fill-slate-400 dark:fill-slate-500"
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Box */}
        {hoveredPoint !== null && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-semibold py-1.5 px-3 rounded-xl shadow-xl flex items-center gap-2 pointer-events-none animate-fadeIn"
          >
            <span>{points[hoveredPoint].label}:</span>
            <b className="text-indigo-400 font-bold">{formatPrice(points[hoveredPoint].value)}</b>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. Category Share Donut / Radial Chart
export function CategoryShareChart() {
  const categories = [
    { label: 'Smartfonlar', percent: 45, count: 180, color: '#6366f1' },
    { label: 'Noutbuklar', percent: 25, count: 95, color: '#8b5cf6' },
    { label: 'Quloqchinlar', percent: 15, count: 62, color: '#ec4899' },
    { label: 'Aqlli soatlar', percent: 10, count: 44, color: '#f59e0b' },
    { label: 'Texnika', percent: 5, count: 20, color: '#10b981' }
  ];

  // SVG Donut calculation
  const radius = 60;
  const circumference = 2 * Math.PI * radius; // ~377
  let cumulativeOffset = 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <PieIcon className="w-5 h-5 text-indigo-500" />
          Kategoriyalar Ulushi
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Savdo aylanmasining toifalar bo'yicha taqsimlanishi
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-auto">
        {/* SVG Donut Circle */}
        <div className="relative w-40 h-40 shrink-0">
          <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
            {categories.map((c, idx) => {
              const dashLength = (c.percent / 100) * circumference;
              const strokeOffset = circumference - cumulativeOffset;
              cumulativeOffset += dashLength;

              return (
                <circle
                  key={idx}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke={c.color}
                  strokeWidth="20"
                  strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                  strokeDashoffset={strokeOffset}
                  className="transition-all duration-500 hover:opacity-80"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">100%</span>
            <span className="text-[10px] font-semibold text-slate-400">Jami Savdo</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2.5 w-full sm:w-auto text-xs">
          {categories.map((c, idx) => (
            <div key={idx} className="flex items-center justify-between sm:justify-start gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <span className="font-semibold text-slate-700 dark:text-slate-200">{c.label}</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-slate-100 ml-auto">
                {c.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 3. Weekly Order Volume Bar Chart
export function WeeklyBarsChart() {
  const days = [
    { day: 'Dush', orders: 18, revenue: 15400000 },
    { day: 'Sesh', orders: 24, revenue: 21200000 },
    { day: 'Chor', orders: 19, revenue: 17800000 },
    { day: 'Pay', orders: 32, revenue: 29500000 },
    { day: 'Juma', orders: 45, revenue: 42000000 },
    { day: 'Shan', orders: 58, revenue: 54000000 },
    { day: 'Yak', orders: 48, revenue: 46500000 }
  ];

  const maxOrders = Math.max(...days.map((d) => d.orders));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            Haftalik Buyurtmalar Soni
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kunlar kesimida tasdiqlangan buyurtmalar grafigi
          </p>
        </div>
        <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-xl">
          244 ta buyurtma / hafta
        </span>
      </div>

      <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6">
        {days.map((d, i) => {
          const heightPercent = Math.round((d.orders / maxOrders) * 100);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                {d.orders}
              </span>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden h-full flex items-end">
                <div
                  className="w-full bg-gradient-to-t from-purple-600 to-indigo-500 rounded-xl transition-all duration-500 group-hover:brightness-110"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {d.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 4. Order Status Pipeline & Low Stock Alerts
export function PipelineAndStockAlerts({ orders = [], products = [] }) {
  const delivered = orders.filter((o) => o.status === 'delivered').length || 1;
  const shipping = orders.filter((o) => o.status === 'shipping').length || 1;
  const pending = orders.filter((o) => o.status === 'pending').length || 1;
  const cancelled = orders.filter((o) => o.status === 'cancelled').length || 0;
  const total = Math.max(1, delivered + shipping + pending + cancelled);

  const lowStockProducts = products.filter((p) => p.stock <= 8).slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Order Status Pipeline */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          Buyurtmalar Holati Taqsimoti
        </h3>

        {/* Progress bar split */}
        <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
          <div style={{ width: `${(delivered / total) * 100}%` }} className="bg-emerald-500 h-full" title="Yakunlandi" />
          <div style={{ width: `${(shipping / total) * 100}%` }} className="bg-sky-500 h-full" title="Yetkazilmoqda" />
          <div style={{ width: `${(pending / total) * 100}%` }} className="bg-amber-500 h-full" title="Kutilmoqda" />
          <div style={{ width: `${(cancelled / total) * 100}%` }} className="bg-rose-500 h-full" title="Bekor qilindi" />
        </div>

        {/* Legend with percentages */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2">
          <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400">
            <span className="block font-bold">Yakunlandi</span>
            <span className="text-base font-black">{delivered} ta</span>
          </div>
          <div className="p-2.5 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400">
            <span className="block font-bold">Yetkazilmoqda</span>
            <span className="text-base font-black">{shipping} ta</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400">
            <span className="block font-bold">Kutilmoqda</span>
            <span className="text-base font-black">{pending} ta</span>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400">
            <span className="block font-bold">Bekor</span>
            <span className="text-base font-black">{cancelled} ta</span>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Omborda Kam Qolgan Gadjetlar
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-bold">
            Diqqat
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {lowStockProducts.map((p) => (
            <div key={p.id} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={p.image} alt="" className="w-9 h-9 object-cover rounded-lg bg-slate-100" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{p.name}</p>
                  <p className="text-slate-400">{formatPrice(p.price)}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 font-bold">
                {p.stock} dona qoldi
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
