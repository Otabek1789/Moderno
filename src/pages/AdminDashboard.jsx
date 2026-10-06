import React, { useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
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
  Sparkles,
  LayoutDashboard,
  BarChart3,
  Sliders,
  LogOut,
  Store,
  Menu,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
  Users,
  Download,
  FileSpreadsheet,
  Sun,
  Moon,
  Globe,
  ChevronDown
} from 'lucide-react';
import { FlagUZ, FlagRU, FlagEN } from '../components/common/FlagIcons';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { formatPrice, formatDate } from '../utils/formatters';
import { sendTelegramMessage, setTelegramMenuButton } from '../utils/telegram';
import {
  RevenueChart,
  CategoryShareChart,
  WeeklyBarsChart,
  PipelineAndStockAlerts
} from '../components/admin/AdminCharts';
import AnimatedCounter from '../components/admin/AnimatedCounter';

const adminTranslations = {
  uz: {
    consoleTitle: "Admin Console",
    dashboard: "Dashboard & Grafiklar",
    products: "Mahsulotlar (CRUD)",
    orders: "Buyurtmalar",
    customers: "Mijozlar (CRM)",
    analytics: "Savdo Tahlili",
    telegram: "Telegram Bot & App",
    promos: "Promokodlar",
    totalRevenue: "Umumiy Tushum",
    totalOrders: "Jami Buyurtmalar",
    totalProducts: "Mahsulotlar Soni",
    activePromos: "Faol Promokodlar",
    avgOrder: "O'rtacha Chek",
    activeCustomers: "Faol Xaridorlar",
    ordersCSV: "Buyurtmalar CSV",
    productsCSV: "Mahsulotlar CSV",
    resetCatalog: "Katalogni Qayta O'rnatish",
    backToStore: "Do'konga Qaytish",
    logout: "Chiqish",
    addProduct: "Yangi Mahsulot",
    editProduct: "Mahsulotni Tahrirlash",
    deleteConfirm: "O'chirishni Tasdiqlash",
    searchPlaceholder: "Mahsulot nomi yoki toifasi bo'yicha qidirish...",
    revenueDynamics: "Daromad Dinamikasi",
    categoryShare: "Kategoriyalar Ulushi",
    weeklyVolume: "Haftalik Buyurtmalar",
    stockAlerts: "Ombor Nazorati"
  },
  ru: {
    consoleTitle: "Панель Управления",
    dashboard: "Панель & Графики",
    products: "Товары (CRUD)",
    orders: "Заказы",
    customers: "Клиенты (CRM)",
    analytics: "Анализ Продаж",
    telegram: "Телеграм Бот & App",
    promos: "Промокоды",
    totalRevenue: "Общая Выручка",
    totalOrders: "Всего Заказов",
    totalProducts: "Количество Товаров",
    activePromos: "Активные Промокоды",
    avgOrder: "Средний Чек",
    activeCustomers: "Активные Клиенты",
    ordersCSV: "Заказы CSV",
    productsCSV: "Товары CSV",
    resetCatalog: "Сбросить Каталог",
    backToStore: "В Магазин",
    logout: "Выйти",
    addProduct: "Новый Товар",
    editProduct: "Редактировать Товар",
    deleteConfirm: "Подтвердить Удаление",
    searchPlaceholder: "Поиск по названию или категории...",
    revenueDynamics: "Динамика Доходов",
    categoryShare: "Доля Категорий",
    weeklyVolume: "Заказы по Дням",
    stockAlerts: "Складской Учет"
  },
  en: {
    consoleTitle: "Admin Console",
    dashboard: "Dashboard & Charts",
    products: "Products (CRUD)",
    orders: "Orders Management",
    customers: "Customers (CRM)",
    analytics: "Sales Analytics",
    telegram: "Telegram Bot & App",
    promos: "Promo Codes",
    totalRevenue: "Total Revenue",
    totalOrders: "Total Orders",
    totalProducts: "Total Products",
    activePromos: "Active Promos",
    avgOrder: "Avg Order Value",
    activeCustomers: "Active Customers",
    ordersCSV: "Orders CSV",
    productsCSV: "Products CSV",
    resetCatalog: "Reset Catalog",
    backToStore: "Back to Store",
    logout: "Log Out",
    addProduct: "Add Product",
    editProduct: "Edit Product",
    deleteConfirm: "Confirm Deletion",
    searchPlaceholder: "Search by product name or category...",
    revenueDynamics: "Revenue Dynamics",
    categoryShare: "Category Sales Share",
    weeklyVolume: "Daily Orders Inflow",
    stockAlerts: "Stock Tracking"
  }
};

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
    postProductToTelegram,
    telegramSettings,
    updateTelegramSettings,
    setTelegramModal
  } = useStore();

  const { user, isAdmin, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // React Router route param for tab (/admin, /admin/products, etc.)
  const { tab } = useParams();
  const navigate = useNavigate();
  const activeTab = tab || 'dashboard';

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  const availableLanguages = [
    { code: 'uz', label: "O'zbekcha", Icon: FlagUZ },
    { code: 'ru', label: "Русский", Icon: FlagRU },
    { code: 'en', label: "English", Icon: FlagEN }
  ];
  const currentLangObj = availableLanguages.find((l) => l.code === language) || availableLanguages[0];
  const CurrentFlagIcon = currentLangObj.Icon;

  const at = (key, fallback = '') => {
    return adminTranslations[language]?.[key] || adminTranslations['uz']?.[key] || fallback || key;
  };

  // Modals state for Product CRUD
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [saveToast, setSaveToast] = useState('');

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
  const [tgWebAppUrl, setTgWebAppUrl] = useState(
    telegramSettings.webAppUrl || 'https://moderno-three.vercel.app'
  );
  const [tgSaveStatus, setTgSaveStatus] = useState('');

  // Promo code form
  const [newPromo, setNewPromo] = useState({
    code: '',
    type: 'percent',
    value: 10,
    desc: ''
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Analytics calculations
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const totalOrders = orders.length;
  const totalProducts = products.length;
  const activeCoupons = promoCodes.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Filtered products for CRUD table
  const filteredProducts = products.filter((p) => {
    const q = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  // Product CRUD
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
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
        image: productForm.image || editingProduct.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
        images: productForm.image ? [productForm.image] : (editingProduct.images || []),
        description: typeof editingProduct.description === 'object'
          ? {
              ...editingProduct.description,
              uz: productForm.description,
              [language]: productForm.description
            }
          : {
              uz: productForm.description,
              ru: productForm.description,
              en: productForm.description
            }
      });
      setEditingProduct(null);
      setSaveToast("Mahsulot muvaffaqiyatli saqlandi va LocalStorage ga yozildi! ✅");
      setTimeout(() => setSaveToast(''), 4000);
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
        images: productForm.image ? [productForm.image] : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'],
        description: {
          uz: productForm.description,
          ru: productForm.description,
          en: productForm.description
        }
      });
      setIsAddModalOpen(false);
      setSaveToast("Yangi mahsulot muvaffaqiyatli qo'shildi! ✅");
      setTimeout(() => setSaveToast(''), 4000);
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
      name: p.name || '',
      category: p.category || 'smartphones',
      price: p.price || '',
      discountPrice: p.discountPrice || '',
      stock: p.stock !== undefined ? p.stock : 10,
      rating: p.rating || 5.0,
      image: p.image || '',
      description: typeof p.description === 'object'
        ? (p.description['uz'] || p.description[language] || '')
        : (p.description || '')
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
    updateTelegramSettings({
      botToken: tgToken.trim(),
      chatId: tgChatId.trim(),
      webAppUrl: tgWebAppUrl.trim()
    });
    setTgSaveStatus(t('admin.settingsSaved'));
    setTimeout(() => setTgSaveStatus(''), 3000);
  };

  // Configure Telegram Menu Button [Open / Do'kon]
  const handleSetMenuButton = async () => {
    if (!tgWebAppUrl.trim()) {
      alert("Iltimos, HTTPS Web App URL manzilini kiriting (masalan Vercel yoki HTTPS manzilingiz)");
      return;
    }
    const res = await setTelegramMenuButton(tgToken, tgWebAppUrl.trim());
    if (res.ok) {
      alert("✅ Telegram botingizda [Do'kon] menyu tugmasi muvaffaqiyatli yoqildi!\nTelegramda botingiz ochilganda pastda [Do'kon] yoki [Open] tugmasi chiqadi!");
    } else {
      alert("Telegram API xabari: " + (res.description || 'URL https:// bilan bo\'lishi shart'));
    }
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

  // --- CSV Export Handlers ---
  const exportOrdersToCSV = () => {
    const headers = ["Buyurtma ID", "Mijoz", "Telefon", "Manzil", "Jami Summa (UZS)", "To'lov turi", "Holati", "Sana"];
    const rows = orders.map((o) => [
      `#${o.id}`,
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      `"${o.phone || ''}"`,
      `"${(o.address || '').replace(/"/g, '""')}"`,
      o.totalAmount,
      `"${o.paymentMethod || ''}"`,
      `"${o.status || ''}"`,
      `"${new Date(o.createdAt).toLocaleString()}"`
    ]);
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Moderno_Buyurtmalar_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportProductsToCSV = () => {
    const headers = ["ID", "Nomi", "Kategoriya", "Narxi (UZS)", "Chegirma Narxi", "Omborda", "Reyting"];
    const rows = products.map((p) => [
      p.id,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${p.category || ''}"`,
      p.price,
      p.discountPrice || '',
      p.stock,
      p.rating
    ]);
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Moderno_Mahsulotlar_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // --- Derive CRM Customers from Orders ---
  const customersMap = {};
  orders.forEach((o) => {
    const key = (o.phone || o.customerName || 'Mijoz').trim();
    if (!customersMap[key]) {
      customersMap[key] = {
        name: o.customerName || 'Noma\'lum',
        phone: o.phone || '—',
        address: o.address || '—',
        ordersCount: 0,
        totalSpent: 0,
        lastOrderDate: o.createdAt,
        status: 'active'
      };
    }
    customersMap[key].ordersCount += 1;
    customersMap[key].totalSpent += o.totalAmount || 0;
    if (new Date(o.createdAt) > new Date(customersMap[key].lastOrderDate)) {
      customersMap[key].lastOrderDate = o.createdAt;
      customersMap[key].address = o.address;
    }
  });
  const customersList = Object.values(customersMap);

  // Sidebar Menu Items
  const sidebarNav = [
    { id: 'dashboard', label: at('dashboard', "Dashboard & Grafiklar"), icon: LayoutDashboard },
    { id: 'products', label: at('products', "Mahsulotlar (CRUD)"), icon: Package, badge: products.length },
    { id: 'orders', label: at('orders', "Buyurtmalar"), icon: ShoppingBag, badge: orders.length },
    { id: 'customers', label: at('customers', "Mijozlar (CRM)"), icon: Users, badge: customersList.length },
    { id: 'analytics', label: at('analytics', "Savdo Tahlili"), icon: BarChart3 },
    { id: 'telegram', label: at('telegram', "Telegram Bot & App"), icon: Send },
    { id: 'promos', label: at('promos', "Promokodlar"), icon: Tag, badge: promoCodes.length }
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col lg:flex-row transition-colors">
      
      {/* Mobile Header Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-xs">
            M
          </div>
          <span className="font-extrabold text-base text-slate-900 dark:text-slate-100">
            {at('consoleTitle', 'Admin Console')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xs"
            >
              <CurrentFlagIcon className="w-4 h-3 rounded-xs" />
              <span className="uppercase text-[11px]">{currentLangObj.code}</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
            {isLangOpen && (
              <div className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5 animate-fadeIn">
                {availableLanguages.map((l) => {
                  const FlagComp = l.Icon;
                  return (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-semibold rounded-xl transition ${
                        language === l.code
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FlagComp className="w-4 h-3 rounded-xs" />
                        <span>{l.label}</span>
                      </div>
                      {language === l.code && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60"
            title="Akkauntdan chiqish"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* LEFT SIDEBAR */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between z-40 transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Brand & Console Title */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-black text-lg text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                  MODERNO
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  {at('consoleTitle', 'Admin Console')}
                </span>
              </div>
            </Link>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items (React Router Tabs) */}
          <nav className="space-y-1.5 pt-2">
            {sidebarNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const targetRoute = item.id === 'dashboard' ? '/admin' : `/admin/${item.id}`;
              return (
                <Link
                  key={item.id}
                  to={targetRoute}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-left ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: Admin Profile & Site link */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 space-y-3">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-2 py-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition group"
            title="Profil sozlamalari va rasmni o'zgartirish"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.name || "Admin"}
                className="w-10 h-10 rounded-2xl object-cover ring-2 ring-indigo-500/30 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-xs ring-2 ring-indigo-500/30">
                {(user?.name || user?.email || 'Admin').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 transition-colors">
                {user?.name || "Admin (Otabek)"}
              </p>
              <p className="text-[11px] text-amber-500 font-semibold">👑 Administrator</p>
            </div>
          </Link>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              to="/"
              className="py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 text-center flex items-center justify-center gap-1 transition"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Saytga</span>
            </Link>
            <button
              onClick={handleLogout}
              className="py-2 px-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/40 text-[11px] font-bold text-rose-600 hover:bg-rose-100 text-center flex items-center justify-center gap-1 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Chiqish</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop overlay on mobile */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 space-y-8 overflow-y-auto">
        
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
              <span>{at('consoleTitle', 'Admin Console')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="capitalize text-indigo-600 dark:text-indigo-400 font-bold">
                {sidebarNav.find((s) => s.id === activeTab)?.label}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {sidebarNav.find((s) => s.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* Language Switcher in Admin Top Bar */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm transition active:scale-95"
                title="Admin paneli tilini o'zgartirish"
              >
                <CurrentFlagIcon className="w-4 h-3 rounded-xs shadow-xs" />
                <span className="uppercase tracking-wider font-extrabold">{currentLangObj.code}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5 animate-fadeIn">
                  {availableLanguages.map((l) => {
                    const FlagComp = l.Icon;
                    return (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition ${
                          language === l.code
                            ? 'bg-indigo-600 text-white shadow-sm font-bold'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <FlagComp className="w-4 h-3 rounded-xs" />
                          <span>{l.label}</span>
                        </div>
                        {language === l.code && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={exportOrdersToCSV}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Buyurtmalar ro'yxatini Excel/CSV formatida yuklab olish"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{at('ordersCSV', 'Buyurtmalar CSV')}</span>
            </button>
            <button
              onClick={exportProductsToCSV}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Mahsulotlar ro'yxatini Excel/CSV formatida yuklab olish"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{at('productsCSV', 'Mahsulotlar CSV')}</span>
            </button>
            <button
              onClick={resetProductsToDefault}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{at('resetCatalog', "Katalogni Qayta O'rnatish")}</span>
            </button>
            <a
              href="https://t.me/nekitekibeki_bot?start=admin"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-bold rounded-xl bg-sky-500 hover:bg-sky-600 text-white transition flex items-center gap-1.5 shadow-md shadow-sky-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>@nekitekibeki_bot</span>
            </a>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              title="Mavzuni o'zgartirish"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Back to Store */}
            <Link
              to="/"
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5" />
              <span>{at('backToStore', "Do'konga qaytish")}</span>
            </Link>

            {/* Chiqish (Logout) */}
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition flex items-center gap-1.5 shadow-xs active:scale-95"
              title="Akkauntdan chiqish"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{at('logout', 'Chiqish')}</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: DASHBOARD & GRAPHICS */}
        {/* ======================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Live Indicator Banner */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-xs text-indigo-700 dark:text-indigo-300">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="font-bold">Jonli Tizim Statistikasi</span>
                <span className="text-slate-400 hidden sm:inline">•</span>
                <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">Ma'lumotlar avtomatik yangilanmoqda</span>
              </div>
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-white/80 dark:bg-slate-900/80 px-2.5 py-0.5 rounded-lg shadow-xs">
                Real-Time KPI
              </span>
            </div>

            {/* KPI Metrics Strip with Staggered Entrance & Count-Up Animations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Card 1: Revenue */}
              <div
                className="animate-stat-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex items-center gap-4 group"
                style={{ animationDelay: '0ms' }}
              >
                <div className="w-13 h-13 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-xs">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Umumiy Tushum</p>
                  <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5 truncate">
                    <AnimatedCounter value={totalRevenue} formatter={formatPrice} />
                  </p>
                  <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-0.5 mt-0.5">
                    <ArrowUpRight className="w-3 h-3" /> +18.4% o'sish
                  </span>
                </div>
              </div>

              {/* Card 2: Orders */}
              <div
                className="animate-stat-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex items-center gap-4 group"
                style={{ animationDelay: '100ms' }}
              >
                <div className="w-13 h-13 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-xs">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Jami Buyurtmalar</p>
                  <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5 truncate">
                    <AnimatedCounter value={totalOrders} suffix=" ta" />
                  </p>
                  <span className="text-[11px] text-indigo-500 font-bold flex items-center gap-0.5 mt-0.5">
                    <ArrowUpRight className="w-3 h-3" /> +12 ta bu hafta
                  </span>
                </div>
              </div>

              {/* Card 3: AOV */}
              <div
                className="animate-stat-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex items-center gap-4 group"
                style={{ animationDelay: '200ms' }}
              >
                <div className="w-13 h-13 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 shadow-xs">
                  <Package className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">O'rtacha Chek (AOV)</p>
                  <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5 truncate">
                    <AnimatedCounter value={avgOrderValue} formatter={formatPrice} />
                  </p>
                  <span className="text-[11px] text-purple-500 font-bold flex items-center gap-0.5 mt-0.5">
                    <Sparkles className="w-3 h-3" /> Yuqori samaradorlik
                  </span>
                </div>
              </div>

              {/* Card 4: Coupons */}
              <div
                className="animate-stat-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex items-center gap-4 group"
                style={{ animationDelay: '300ms' }}
              >
                <div className="w-13 h-13 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-xs">
                  <Tag className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Faol Promokodlar</p>
                  <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5 truncate">
                    <AnimatedCounter value={activeCoupons} suffix=" ta faol" />
                  </p>
                  <span className="text-[11px] text-amber-500 font-bold flex items-center gap-0.5 mt-0.5">
                    UZBEK2026, WELCOME10...
                  </span>
                </div>
              </div>
            </div>

            {/* Charts Row: Revenue Area Chart (2 cols) & Category Donut Chart (1 col) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RevenueChart totalRevenue={totalRevenue} />
              </div>
              <div className="lg:col-span-1">
                <CategoryShareChart />
              </div>
            </div>

            {/* Weekly Orders Bar Chart */}
            <WeeklyBarsChart />

            {/* Order Status Pipeline & Low Stock Alerts */}
            <PipelineAndStockAlerts orders={orders} products={products} />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PRODUCTS CRUD */}
        {/* ======================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                <span>+ Yangi Mahsulot Qo'shish</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="p-4">Rasm & Nomi</th>
                      <th className="p-4">Kategoriya</th>
                      <th className="p-4">Narxi</th>
                      <th className="p-4">Ombordagi Soni</th>
                      <th className="p-4">Reyting</th>
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
                              className="w-12 h-12 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-200/50 dark:border-slate-700"
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
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            p.stock > 8 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-500'
                          }`}>
                            {p.stock} dona
                          </span>
                        </td>
                        <td className="p-4 font-bold text-amber-500">★ {p.rating}</td>
                        <td className="p-4 text-right space-x-1.5">
                          <button
                            onClick={() => postProductToTelegram(p)}
                            className="p-2 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded-xl transition"
                            title="Telegram botga joylash"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl transition"
                            title="Tahrirlash"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingProductId(p.id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                            title="O'chirish"
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

        {/* ======================================================== */}
        {/* TAB 3: ORDERS */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm animate-fadeIn">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  Buyurtmalar Boshqaruvi
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Xaridorlarning barcha buyurtmalari va holatlarini o'zgartirish
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-xl">
                {orders.length} ta buyurtma
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Mijoz</th>
                    <th className="p-4">Mahsulotlar</th>
                    <th className="p-4">Summa</th>
                    <th className="p-4">Holat</th>
                    <th className="p-4 text-right">Sana</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-4 font-mono font-bold text-indigo-600">#{o.id}</td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{o.customerName}</p>
                        <p className="text-xs text-slate-400">{o.phone}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1">📍 {o.address}</p>
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
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
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

        {/* ======================================================== */}
        {/* TAB: CUSTOMERS (CRM) */}
        {/* ======================================================== */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Jami Mijozlar</p>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">{customersList.length} ta</h4>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">O'rtacha Chek</p>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">{formatPrice(avgOrderValue)}</h4>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Jami Buyurtmalar</p>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">{orders.length} ta</h4>
                </div>
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    Mijozlar Bazasi (CRM)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Xarid qilgan mijozlarning telefon raqamlari, buyurtmalar soni va faolligi
                  </p>
                </div>
                <button
                  onClick={exportOrdersToCSV}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Mijozlar hisobotini yuklash</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="p-4">Mijoz Ismi</th>
                      <th className="p-4">Telefon</th>
                      <th className="p-4">Manzil</th>
                      <th className="p-4 text-center">Buyurtmalar</th>
                      <th className="p-4">Jami Sarflangan</th>
                      <th className="p-4">Oxirgi Xarid</th>
                      <th className="p-4 text-center">Holati</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {customersList.map((c, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                        <td className="p-4 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center text-xs">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{c.name}</span>
                        </td>
                        <td className="p-4 font-mono font-medium text-slate-600 dark:text-slate-300">
                          {c.phone}
                        </td>
                        <td className="p-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                          {c.address}
                        </td>
                        <td className="p-4 text-center">
                          <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 font-bold text-xs">
                            {c.ordersCount} ta
                          </span>
                        </td>
                        <td className="p-4 font-extrabold text-indigo-600 dark:text-indigo-400">
                          {formatPrice(c.totalSpent)}
                        </td>
                        <td className="p-4 text-slate-400 text-xs">
                          {formatDate(c.lastOrderDate)}
                        </td>
                        <td className="p-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600">
                            Faol mijoz
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: ADVANCED ANALYTICS */}
        {/* ======================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart totalRevenue={totalRevenue} />
              <CategoryShareChart />
            </div>
            <WeeklyBarsChart />
            <PipelineAndStockAlerts orders={orders} products={products} />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: TELEGRAM BOT & MINI APP CONFIG */}
        {/* ======================================================== */}
        {activeTab === 'telegram' && (
          <div className="max-w-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Send className="w-5 h-5 text-sky-500" />
                Telegram Bot & Mini App Integratsiyasi
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Yangi buyurtmalarni Telegramga yuborish, tovarlarni post qilish va pastki [Do'kon] tugmasini boshqarish
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
                  Telegram Bot Token
                </label>
                <input
                  type="text"
                  value={tgToken}
                  onChange={(e) => setTgToken(e.target.value)}
                  placeholder="8682232515:AAE_r0XFh0SyhJ7ec3w0JItfAgJCAB8OL-4"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Botingiz: <b>@nekitekibeki_bot</b>
                </span>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Admin Chat ID
                </label>
                <input
                  type="text"
                  value={tgChatId}
                  onChange={(e) => setTgChatId(e.target.value)}
                  placeholder="7373118052"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Buyurtmalar va xabarlar boradigan Chat ID raqami: <b>7373118052</b>
                </span>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  📱 Telegram Web App (Mini App) URL Manzili
                </label>
                <input
                  type="url"
                  value={tgWebAppUrl}
                  onChange={(e) => setTgWebAppUrl(e.target.value)}
                  placeholder="https://moderno-three.vercel.app"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Telegramda pastda [Do'kon] tugmasini bosganda ochiladigan Mini App manzili (HTTPS bo'lishi shart)
                </span>
              </div>

              <div className="flex flex-wrap gap-3 pt-3">
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition"
                >
                  Sozlamalarni Saqlash
                </button>

                <button
                  type="button"
                  onClick={handleTestTelegram}
                  className="px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-sky-500/25 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>🔔 Test Xabar Yuborish</span>
                </button>

                <button
                  type="button"
                  onClick={handleSetMenuButton}
                  className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/25 transition flex items-center justify-center gap-2"
                >
                  <span>📱 [Open / Do'kon] Tugmasini Sozlash</span>
                </button>

                <a
                  href="https://t.me/nekitekibeki_bot?start=admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4 text-sky-500" />
                  <span>Botga Kirish (@nekitekibeki_bot)</span>
                </a>
              </div>
            </form>

            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-300 space-y-2">
              <p className="font-bold flex items-center gap-1.5">
                <span>💡 Telegram Mini App qanday ishlaydi?</span>
              </p>
              <p className="leading-relaxed">
                1. <b>"📱 [Open / Do'kon] Tugmasini Sozlash"</b> tugmasini bossangiz, Telegram API orqali botingizning pastida doimiy <b>[Do'kon]</b> yoki <b>[Open]</b> tugmasi paydo bo'ladi.
              </p>
              <p className="leading-relaxed">
                2. Mijoz Telegramda botga kirib ushbu tugmani bosganda, xuddi Telegramning o'zida kichik ilova (Mini App) ochilib, do'kon to'liq ishlaydi!
              </p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: PROMO CODES */}
        {/* ======================================================== */}
        {activeTab === 'promos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            {/* Add Promo Code Form */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                + Yangi Promokod Yaratish
              </h3>

              <form onSubmit={handleAddPromo} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Promokod Kodi
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
                      Chegirma Turi
                    </label>
                    <select
                      value={newPromo.type}
                      onChange={(e) => setNewPromo({ ...newPromo, type: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold"
                    >
                      <option value="percent">Foiz (%)</option>
                      <option value="fixed">Belgilangan summa (so'm)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Qiymati
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

      </main>

      {/* ======================================================== */}
      {/* ADD / EDIT PRODUCT MODAL */}
      {/* ======================================================== */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                {editingProduct ? "Mahsulotni Tahrirlash" : "Yangi Mahsulot Qo'shish"}
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
                  Mahsulot Nomi *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="masalan: Apple iPhone 15 Pro Max"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Kategoriya
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
                    Ombordagi Soni
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
                    Narxi (so'm) *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="15000000"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Chegirmali Narxi (ixtiyoriy)
                  </label>
                  <input
                    type="number"
                    value={productForm.discountPrice}
                    onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })}
                    placeholder="13500000"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Rasm Havolasi (URL)
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
                  Tavsifi
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
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CONFIRM DELETE MODAL */}
      {/* ======================================================== */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Mahsulotni o'chirmoqchimisiz?
            </h3>
            <p className="text-xs text-slate-400">
              Bu amal qaytarilmaydi va tovar katalogdan butunlay olib tashlanadi.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-emerald-600/30 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

    </div>
  );
}
