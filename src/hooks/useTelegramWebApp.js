import { useEffect, useState, useCallback } from 'react';

export function useTelegramWebApp() {
  const [isTelegram, setIsTelegram] = useState(false);
  const [tgUser, setTgUser] = useState(null);
  const [platform, setPlatform] = useState('');

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    // Check if inside Telegram environment (initData, platform or explicit test query ?tg=1)
    const isTg = Boolean(
      (tg && (tg.initData || (tg.platform && tg.platform !== 'unknown'))) ||
      window.location.search.includes('tg=1')
    );

    if (isTg && tg) {
      setIsTelegram(true);
      setPlatform(tg.platform || 'mobile');
      tg.ready();
      tg.expand();

      try {
        tg.enableClosingConfirmation();
      } catch (e) {}

      if (tg.initDataUnsafe?.user) {
        setTgUser(tg.initDataUnsafe.user);
      }
    }
  }, []);

  // Vibration / Haptic feedback on interactions
  const triggerHaptic = useCallback((style = 'light') => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg?.HapticFeedback) {
        if (style === 'success' || style === 'error' || style === 'warning') {
          tg.HapticFeedback.notificationOccurred(style);
        } else {
          tg.HapticFeedback.impactOccurred(style);
        }
      }
    } catch (e) {}
  }, []);

  const closeApp = useCallback(() => {
    window.Telegram?.WebApp?.close();
  }, []);

  return {
    isTelegram,
    tgUser,
    platform,
    triggerHaptic,
    closeApp,
    tg: window.Telegram?.WebApp
  };
}
