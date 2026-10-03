import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';
import TelegramPreviewModal from './components/common/TelegramPreviewModal';
import QuickBuyModal from './components/common/QuickBuyModal';
import LiveChatWidget from './components/common/LiveChatWidget';

// Advanced Olympiad-Winning Features
import AccessibilityModal from './components/common/AccessibilityModal';
import VoiceSearchModal from './components/common/VoiceSearchModal';
import SpotlightSearchModal from './components/common/SpotlightSearchModal';
import LuckyWheelModal from './components/common/LuckyWheelModal';
import PaymentGatewayModal from './components/common/PaymentGatewayModal';
import FiscalReceiptModal from './components/common/FiscalReceiptModal';
import LiveCourierMapModal from './components/common/LiveCourierMapModal';
import Product360ViewerModal from './components/common/Product360ViewerModal';
import PWAInstallBanner from './components/common/PWAInstallBanner';

import TelegramHeader from './components/telegram/TelegramHeader';
import TelegramBottomNav from './components/telegram/TelegramBottomNav';
import TelegramNativeControls from './components/telegram/TelegramNativeControls';
import { useTelegramWebApp } from './hooks/useTelegramWebApp';
import { useStore } from './context/StoreContext';

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

  const {
    receiptModal,
    closeReceipt,
    courierModal,
    closeCourierTracking,
    paymentModal,
    closePayment,
    wheelModal,
    openWheel,
    closeWheel,
    voiceModal,
    openVoice,
    closeVoice,
    spotlightModal,
    openSpotlight,
    closeSpotlight,
    viewer360Modal,
    close360Viewer,
    openReceipt
  } = useStore();

  // Global Ctrl + K / Cmd + K listener for Spotlight Command Palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSpotlight();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSpotlight]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      <ScrollToTop />

      <TelegramNativeControls />

      {!isStandalonePage && (isTelegram ? <TelegramHeader /> : <Navbar />)}

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
          <Route path="/admin/:tab" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isStandalonePage && <TelegramPreviewModal />}
      {!isStandalonePage && <QuickBuyModal />}
      {!isStandalonePage && <LiveChatWidget />}
      {!isStandalonePage && <PWAInstallBanner />}

      {/* Global Olympiad Modals */}
      <AccessibilityModal />
      <VoiceSearchModal isOpen={voiceModal} onClose={closeVoice} />
      <SpotlightSearchModal
        isOpen={spotlightModal}
        onClose={closeSpotlight}
        onOpenVoice={openVoice}
        onOpenWheel={openWheel}
      />
      <LuckyWheelModal isOpen={wheelModal} onClose={closeWheel} />
      
      {paymentModal?.isOpen && (
        <PaymentGatewayModal
          isOpen={paymentModal.isOpen}
          onClose={closePayment}
          amount={paymentModal.data?.amount}
          method={paymentModal.data?.method}
          orderId={paymentModal.data?.orderId}
          customerPhone={paymentModal.data?.phone}
          onPaymentSuccess={paymentModal.data?.onSuccess}
          onOpenReceipt={() => {
            if (paymentModal.data?.order) {
              openReceipt(paymentModal.data.order);
            }
          }}
        />
      )}

      {receiptModal?.isOpen && (
        <FiscalReceiptModal
          isOpen={receiptModal.isOpen}
          onClose={closeReceipt}
          order={receiptModal.order}
        />
      )}

      {courierModal?.isOpen && (
        <LiveCourierMapModal
          isOpen={courierModal.isOpen}
          onClose={closeCourierTracking}
          order={courierModal.order}
        />
      )}

      {viewer360Modal?.isOpen && (
        <Product360ViewerModal
          isOpen={viewer360Modal.isOpen}
          onClose={close360Viewer}
          product={viewer360Modal.product}
        />
      )}

      {!isStandalonePage && (isTelegram ? <TelegramBottomNav /> : <MobileNav />)}
      {!isStandalonePage && !isTelegram && <Footer />}
    </div>
  );
}
