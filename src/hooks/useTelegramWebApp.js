import { useEffect, useState } from 'react';

export function useTelegramWebApp() {
  const [isTelegram, setIsTelegram] = useState(false);
  const [tgUser, setTgUser] = useState(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.initData) {
      setIsTelegram(true);
      tg.ready();
      tg.expand();

      if (tg.initDataUnsafe?.user) {
        setTgUser(tg.initDataUnsafe.user);
      }
    }
  }, []);

  const closeApp = () => {
    window.Telegram?.WebApp?.close();
  };

  return {
    isTelegram,
    tgUser,
    closeApp,
    tg: window.Telegram?.WebApp
  };
}
