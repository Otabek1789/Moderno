import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useTelegramWebApp } from '../../hooks/useTelegramWebApp';
import { formatPrice } from '../../utils/formatters';

export default function TelegramNativeControls() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { cartCount, cartSubtotal, grandTotal } = useStore();
  const { isTelegram, tg, triggerHaptic } = useTelegramWebApp();

  // 1. BackButton synchronization
  useEffect(() => {
    if (!isTelegram || !tg?.BackButton) return;

    if (pathname !== '/') {
      tg.BackButton.show();
      const handleBack = () => {
        triggerHaptic('light');
        navigate(-1);
      };
      tg.BackButton.onClick(handleBack);
      return () => {
        tg.BackButton.offClick(handleBack);
      };
    } else {
      tg.BackButton.hide();
    }
  }, [pathname, isTelegram, tg, navigate, triggerHaptic]);

  // 2. MainButton synchronization
  useEffect(() => {
    if (!isTelegram || !tg?.MainButton) return;

    const mainBtn = tg.MainButton;

    if (pathname === '/cart') {
      if (cartCount > 0) {
        mainBtn.setText(`BUYURTMA BERISH • ${formatPrice(grandTotal)}`);
        mainBtn.show();
        mainBtn.enable();
        const handleGoCheckout = () => {
          triggerHaptic('medium');
          navigate('/checkout');
        };
        mainBtn.onClick(handleGoCheckout);
        return () => {
          mainBtn.offClick(handleGoCheckout);
        };
      } else {
        mainBtn.hide();
      }
    } else if (pathname === '/checkout') {
      // In checkout page, form handles submission, keep main button clean or submit
      mainBtn.hide();
    } else {
      // On regular browsing pages
      if (cartCount > 0) {
        mainBtn.setText(`SAVAT (${cartCount}) • ${formatPrice(cartSubtotal)}`);
        mainBtn.show();
        mainBtn.enable();
        const handleGoCart = () => {
          triggerHaptic('light');
          navigate('/cart');
        };
        mainBtn.onClick(handleGoCart);
        return () => {
          mainBtn.offClick(handleGoCart);
        };
      } else {
        mainBtn.hide();
      }
    }
  }, [pathname, cartCount, cartSubtotal, grandTotal, isTelegram, tg, navigate, triggerHaptic]);

  return null;
}
