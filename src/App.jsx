import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';
import TelegramPreviewModal from './components/common/TelegramPreviewModal';
import QuickBuyModal from './components/common/QuickBuyModal';
import LiveChatWidget from './components/common/LiveChatWidget';

// Telegram Mini App Dedicated Components
import TelegramHeader from './components/telegram/TelegramHeader';
import TelegramBottomNav from './components/telegram/TelegramBottomNav';
import TelegramNativeControls from './components/telegram/TelegramNativeControls';
import { useTelegramWebApp } from './hooks/useTelegramWebApp';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Upgrader from './pages/Upgrader';
import PCBuilder from './pages/PCBuilder';
import MysteryBox from './pages/MysteryBox';
import TradeIn from './pages/TradeIn';
import BattleArena from './pages/BattleArena';
import Compare from './pages/Compare';
import About from './pages/About';
import Contact from './pages/Contact';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { isTelegram } = useTelegramWebApp();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isAdminPage = location.pathname.startsWith('/admin');
  const isStandalonePage = isAuthPage || isAdminPage;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      <ScrollToTop />

      {/* Telegram Native SDK Synchronization (MainButton, BackButton, Haptics) */}
      <TelegramNativeControls />

      {/* Header: Hidden on Auth & Admin pages so Admin has ONLY its own Sidebar */}
      {!isStandalonePage && (isTelegram ? <TelegramHeader /> : <Navbar />)}

      {/* Main Content View */}
      <main className={`flex-1 ${isStandalonePage ? '' : isTelegram ? 'pb-20' : 'pb-16 lg:pb-0'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/upgrader" element={<Upgrader />} />
          <Route path="/builder" element={<PCBuilder />} />
          <Route path="/mystery-box" element={<MysteryBox />} />
          <Route path="/trade-in" element={<TradeIn />} />
          <Route path="/battle" element={<BattleArena />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login defaultRegister={true} />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Global Interactive Telegram Modal (Order simulator) */}
      {!isStandalonePage && <TelegramPreviewModal />}

      {/* Global 1-Click Quick Purchase Modal */}
      {!isStandalonePage && <QuickBuyModal />}

      {/* Global AI & Telegram Live Chat Assistant Widget */}
      {!isStandalonePage && <LiveChatWidget />}

      {/* Navigation Dock: Telegram Mini App Bottom Bar or Standard Mobile Nav */}
      {!isStandalonePage && (isTelegram ? <TelegramBottomNav /> : <MobileNav />)}

      {/* Footer: Hidden on auth & admin pages and inside Telegram Mini App */}
      {!isStandalonePage && !isTelegram && <Footer />}
    </div>
  );
}
