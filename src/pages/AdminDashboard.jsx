import React, { useState } from 'react';
import {
  ShieldAlert,
  DollarSign,
  ShoppingBag,
  Package,
  Tag,
  Plus,
  Edit2,
  Trash2,
  Send,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  X,
  Search,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice, formatDate } from '../utils/formatters';
import { sendTelegramMessage } from '../utils/telegram';

export default function AdminDashboard() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProductsToDefault,
    orders,
    updateOrderStatus,
    promoCodes,
    addPromoCode,
    telegramSettings,
    updateTelegramSettings,
    setTelegramModal
  } = useStore();

  const { user, isAdmin, quickDemoLogin } = useAuth();
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'telegram' | 'promos'
  const [productSearch, setProductSearch] = useState('');

  // Modals state for Product CRUD
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  // Add / Edit Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'smartphones',
    price: '',
    discountPrice: '',
    stock: 10,
    rating: 5.0,
    image: '',
    description: ''
  });

  // Telegram settings form
  const [tgToken, setTgToken] = useState(telegramSettings.botToken || '');
  const [tgChatId, setTgChatId] = useState(telegramSettings.chatId || '');
  const [tgSaveStatus, setTgSaveStatus] = useState('');

  // Promo code form
  const [newPromo, setNewPromo] = useState({
    code: '',
    type: 'percent',
    value: 10,
    desc: ''
  });

  // Non-admin fallback view
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Administrator Ruxsati Talab Qilinadi
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
          Ushbu boshqaruv panelini sinash uchun tezkor admin rejimiga o'ting.
        </p>
        <button
          onClick={() => quickDemoLogin('admin')}
          className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-xl shadow-amber-500/25 transition active:scale-95"
        >
          🔑 Admin Hisobiga O'tish
        </button>
      </div>
    );
  }

  // Analytics calculations
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const totalOrders = orders.length;
  const totalProducts = products.length;
  const activeCoupons = promoCodes.length;

  // Filtered products for CRUD table
  const filteredProducts = products.filter((p) => {
    const q = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  // Handle Save Product (Add or Edit)
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price),
        discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : null,
        stock: Number(productForm.stock),
        rating: Number(productForm.rating),
        image: productForm.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
        description: {
          uz: productForm.description,
          ru: productForm.description,
          en: productForm.description
        }
      });
      setEditingProduct(null);
    } else {
      addProduct({
        name: productForm.name,
        category: productForm.category,
        categoryName: {
          uz: productForm.category,
          ru: productForm.category,
          en: productForm.category
        },
        price: Number(productForm.price),
        discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : null,
        stock: Number(productForm.stock),
        rating: Number(productForm.rating),
        image: productForm.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
        description: {
          uz: productForm.description,
          ru: productForm.description,
          en: productForm.description
        }
      });
      setIsAddModalOpen(false);
    }

    setProductForm({
      name: '',
      category: 'smartphones',
      price: '',
      discountPrice: '',
      stock: 10,
      rating: 5.0,
      image: '',
      description: ''
    });
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      category: p.category,
      price: p.price,
      discountPrice: p.discountPrice || '',
      stock: p.stock,
      rating: p.rating,
      image: p.image,
      description: typeof p.description === 'object' ? p.description['uz'] : p.description
    });
  };

  const confirmDelete = () => {
    if (deletingProductId) {
      deleteProduct(deletingProductId);
      setDeletingProductId(null);
    }
  };

  // Telegram settings save
  const handleSaveTelegram = (e) => {
    e.preventDefault();
    updateTelegramSettings({ botToken: tgToken.trim(), chatId: tgChatId.trim() });
    setTgSaveStatus(t('admin.settingsSaved'));
    setTimeout(() => setTgSaveStatus(''), 3000);
  };

  // Send Test Telegram message
  const handleTestTelegram = async () => {
    const testMessage = `
🔔 <b>TEST XABARI — MODERNO ADMIN</b>
━━━━━━━━━━━━━━━━━━━━
Bu tizimdan yuborilgan sinov xabarnomasi.
Telegram Bot integratsiyasi muvaffaqiyatli ishlamoqda! ✅
⏰ <i>Sana: ${new Date().toLocaleString('uz-UZ')}</i>
`;
    const res = await sendTelegramMessage(tgToken, tgChatId, testMessage);
    setTelegramModal({
      isOpen: true,
      title: res.success ? t('admin.testMessageSent') : "Telegram Xabari Simulyatsiyasi",
      text: testMessage,
      isReal: res.success
    });
  };

  // Add promo code
  const handleAddPromo = (e) => {
    e.preventDefault();
    if (!newPromo.code.trim()) return;

    addPromoCode({
      code: newPromo.code.trim().toUpperCase(),
      type: newPromo.type,
      value: Number(newPromo.value),
      desc: newPromo.desc || `${newPromo.value}${newPromo.type === 'percent' ? '%' : " so'm"} chegirma`
    });

    setNewPromo({ code: '', type: 'percent', value: 10, desc: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-500 uppercase tracking-wider">
              👑 Administrator Paneli
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {t('admin.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('admin.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetProductsToDefault}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Katalogni Qayta O'rnatish</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('admin.totalRevenue')}</p>
            <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
              {formatPrice(totalRevenue)}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('admin.totalOrders')}</p>
            <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
              {totalOrders} ta
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('admin.totalProducts')}</p>
            <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
              {totalProducts} ta
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('admin.activePromos')}</p>
            <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
              {activeCoupons} ta
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-6 overflow-x-auto text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 border-b-2 transition shrink-0 ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          {t('admin.tabOrders')} ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 border-b-2 transition shrink-0 ${
            activeTab === 'products'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          {t('admin.tabProducts')} ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('telegram')}
          className={`pb-3 border-b-2 transition shrink-0 ${
            activeTab === 'telegram'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          {t('admin.tabTelegram')}
        </button>

        <button
          onClick={() => setActiveTab('promos')}
          className={`pb-3 border-b-2 transition shrink-0 ${
            activeTab === 'promos'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          {t('admin.tabPromos')}
        </button>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'overview' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Oxirgi Buyurtmalar
            </h3>
            <span className="text-xs text-slate-400">{orders.length} ta buyurtma</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">{t('admin.customer')}</th>
                  <th className="p-4">Mahsulotlar</th>
                  <th className="p-4">{t('admin.orderTotal')}</th>
                  <th className="p-4">{t('admin.orderStatus')}</th>
                  <th className="p-4 text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-4 font-mono font-bold text-indigo-600">#{o.id}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{o.customerName}</p>
                      <p className="text-xs text-slate-400">{o.phone}</p>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      {o.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-100">
                      {formatPrice(o.totalAmount)}
                    </td>
                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                          o.status === 'delivered'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                            : o.status === 'shipping'
                            ? 'bg-sky-500/10 text-sky-600 border-sky-500/30'
                            : o.status === 'cancelled'
                            ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                        }`}
                      >
                        <option value="pending">Kutilmoqda</option>
                        <option value="shipping">Yetkazilmoqda</option>
                        <option value="delivered">Yakunlandi</option>
                        <option value="cancelled">Bekor qilindi</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-[11px] text-slate-400">{formatDate(o.createdAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS CRUD */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Search within Admin */}
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Mahsulot nomi yoki kategoriya bo'yicha..."
                className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  name: '',
                  category: 'smartphones',
                  price: '',
                  discountPrice: '',
                  stock: 10,
                  rating: 5.0,
                  image: '',
                  description: ''
                });
                setIsAddModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{t('admin.addProduct')}</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Rasm & Nomi</th>
                    <th className="p-4">{t('admin.productCategory')}</th>
                    <th className="p-4">{t('admin.productPrice')}</th>
                    <th className="p-4">{t('admin.productStock')}</th>
                    <th className="p-4">{t('admin.productRating')}</th>
                    <th className="p-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt=""
                            className="w-12 h-12 object-cover rounded-xl bg-slate-100 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{p.name}</p>
                            <p className="text-[11px] text-slate-400">ID: {p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 uppercase font-semibold text-slate-500 text-xs">
                        {p.category}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{formatPrice(p.price)}</p>
                        {p.discountPrice && (
                          <p className="text-xs text-rose-500 font-semibold">{formatPrice(p.discountPrice)}</p>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          p.stock > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {p.stock} dona
                        </span>
                      </td>
                      <td className="p-4 font-bold text-amber-500">★ {p.rating}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl transition"
                          title={t('admin.editProduct')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingProductId(p.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                          title={t('admin.deleteProduct')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TELEGRAM BOT CONFIG */}
      {activeTab === 'telegram' && (
        <div className="max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Send className="w-5 h-5 text-sky-500" />
              {t('admin.telegramTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t('admin.telegramDesc')}
            </p>
          </div>

          {tgSaveStatus && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-700 text-xs font-semibold">
              {tgSaveStatus}
            </div>
          )}

          <form onSubmit={handleSaveTelegram} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                {t('admin.botToken')}
              </label>
              <input
                type="text"
                value={tgToken}
                onChange={(e) => setTgToken(e.target.value)}
                placeholder={t('admin.botTokenPlaceholder')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Telegram @BotFather orqali olingan token
              </span>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                {t('admin.chatId')}
              </label>
              <input
                type="text"
                value={tgChatId}
                onChange={(e) => setTgChatId(e.target.value)}
                placeholder={t('admin.chatIdPlaceholder')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Xabarlar keladigan shaxsiy yoki guruh Chat ID si (masalan @userinfobot orqali olish mumkin)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition"
              >
                {t('admin.saveSettings')}
              </button>

              <button
                type="button"
                onClick={handleTestTelegram}
                className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-sky-500/25 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{t('admin.testTelegram')}</span>
              </button>
            </div>
          </form>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300">
            {t('admin.simulationNotice')}
          </div>
        </div>
      )}

      {/* TAB 4: PROMO CODES */}
      {activeTab === 'promos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Promo Code Form */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              {t('admin.addPromo')}
            </h3>

            <form onSubmit={handleAddPromo} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  {t('admin.promoCode')}
                </label>
                <input
                  type="text"
                  required
                  value={newPromo.code}
                  onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })}
                  placeholder="masalan: YANGI2025"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 uppercase text-sm font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    {t('admin.discountType')}
                  </label>
                  <select
                    value={newPromo.type}
                    onChange={(e) => setNewPromo({ ...newPromo, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold"
                  >
                    <option value="percent">{t('admin.percentage')}</option>
                    <option value="fixed">{t('admin.fixedAmount')}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    {t('admin.discountValue')}
                  </label>
                  <input
                    type="number"
                    required
                    value={newPromo.value}
                    onChange={(e) => setNewPromo({ ...newPromo, value: e.target.value })}
                    placeholder={newPromo.type === 'percent' ? "15" : "50000"}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Izoh / Tavsif
                </label>
                <input
                  type="text"
                  value={newPromo.desc}
                  onChange={(e) => setNewPromo({ ...newPromo, desc: e.target.value })}
                  placeholder="masalan: 15% bayram chegirmasi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition"
              >
                Promokodni Saqlash
              </button>
            </form>
          </div>

          {/* List of Active Promos */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Faol Promokodlar ({promoCodes.length})
              </h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {promoCodes.map((p, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-black text-sm text-slate-900 dark:text-slate-100 font-mono tracking-wider">
                        {p.code}
                      </p>
                      <p className="text-xs text-slate-400">{p.desc}</p>
                    </div>
                  </div>
                  <span className="font-black text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
                    {p.type === 'percent' ? `-${p.value}%` : `-${formatPrice(p.value)}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                {editingProduct ? t('admin.editProduct') : t('admin.addProduct')}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  {t('admin.productName')} *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="masalan: Apple iPhone 16 Pro Max"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    {t('admin.productCategory')}
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold"
                  >
                    <option value="smartphones">Smartfonlar</option>
                    <option value="laptops">Noutbuklar</option>
                    <option value="audio">Quloqchinlar</option>
                    <option value="watches">Aqlli soatlar</option>
                    <option value="appliances">Maishiy texnika</option>
                    <option value="accessories">Aksessuarlar</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    {t('admin.productStock')}
                  </label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    {t('admin.productPrice')} *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="12000000"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    {t('admin.productDiscountPrice')}
                  </label>
                  <input
                    type="number"
                    value={productForm.discountPrice}
                    onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })}
                    placeholder="10500000"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  {t('admin.productImage')}
                </label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  {t('admin.productDesc')}
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Mahsulot haqida qisqacha tavsif..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  {t('admin.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30"
                >
                  {t('admin.saveProduct')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              {t('admin.confirmDelete')}
            </h3>
            <p className="text-xs text-slate-400">
              Bu amal qaytarilmaydi va mahsulot do'kon katalogidan butunlay olib tashlanadi.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
              >
                {t('admin.cancel')}
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30"
              >
                {t('admin.deleteProduct')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
