import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts } from '../data/initialProducts';
import {
  sendTelegramMessage,
  sendTelegramProduct,
  formatOrderTelegramMessage,
  DEFAULT_BOT_TOKEN,
  DEFAULT_CHAT_ID,
  DEFAULT_BOT_USERNAME
} from '../utils/telegram';

const StoreContext = createContext();

const INITIAL_PROMOCODES = [
  { code: 'UZBEK2025', type: 'percent', value: 15, desc: "15% maxsus bayram chegirmasi" },
  { code: 'WELCOME10', type: 'percent', value: 10, desc: "10% birinchi xarid uchun chegirma" },
  { code: 'NAVROZ', type: 'percent', value: 20, desc: "20% bahorgi mega chegirma" },
  { code: 'SUPER50K', type: 'fixed', value: 50000, desc: "50 000 so'm qat'iy chegirma" }
];

const INITIAL_ORDERS = [
  {
    id: 1024,
    customerName: "Sardor Rahimov",
    phone: "+998 90 987 65 43",
    address: "Toshkent sh., Mirobod tumani, Nukus ko'chasi 21-uy",
    items: [
      { id: 1, name: "Apple iPhone 16 Pro Max 256GB Natural Titanium", price: 15490000, quantity: 1 }
    ],
    subtotal: 15490000,
    discountAmount: 1549000,
    promoCode: "WELCOME10",
    shippingFee: 0,
    totalAmount: 13941000,
    paymentMethod: "click",
    note: "Eshik oldiga kelganda qo'ng'iroq qiling",
    status: "delivered",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 1025,
    customerName: "Nilufar Usmonova",
    phone: "+998 93 555 44 33",
    address: "Samarqand sh., Universitet xiyoboni 12",
    items: [
      { id: 6, name: "Apple AirPods Pro 2 (USB-C)", price: 2650000, quantity: 1 },
      { id: 11, name: "Logitech MX Master 3S Wireless Mouse", price: 1180000, quantity: 1 }
    ],
    subtotal: 3830000,
    discountAmount: 0,
    promoCode: null,
    shippingFee: 0,
    totalAmount: 3830000,
    paymentMethod: "payme",
    note: "",
    status: "shipping",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

export function StoreProvider({ children }) {
  // 1. Products with LocalStorage persistence
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('shop_products_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('shop_products_v3', JSON.stringify(products));
  }, [products]);

  // 2. Cart with LocalStorage persistence
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('shop_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('shop_cart', JSON.stringify(cart));
  }, [cart]);

  // 3. Wishlist with LocalStorage persistence
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('shop_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('shop_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // 4. Promo codes
  const [promoCodes, setPromoCodes] = useState(() => {
    const saved = localStorage.getItem('shop_promocodes');
    return saved ? JSON.parse(saved) : INITIAL_PROMOCODES;
  });

  useEffect(() => {
    localStorage.setItem('shop_promocodes', JSON.stringify(promoCodes));
  }, [promoCodes]);

  const [appliedPromo, setAppliedPromo] = useState(null);

  // 5. Orders with LocalStorage persistence
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('shop_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('shop_orders', JSON.stringify(orders));
  }, [orders]);

  // 6. Telegram Settings pre-configured with user's Bot Token & Chat ID
  const [telegramSettings, setTelegramSettings] = useState(() => {
    const saved = localStorage.getItem('shop_telegram_settings_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      botToken: DEFAULT_BOT_TOKEN,
      chatId: DEFAULT_CHAT_ID,
      botUsername: DEFAULT_BOT_USERNAME,
      webAppUrl: window.location.origin
    };
  });

  useEffect(() => {
    localStorage.setItem('shop_telegram_settings_v2', JSON.stringify(telegramSettings));
  }, [telegramSettings]);

  // 7. Telegram notification preview modal state
  const [telegramModal, setTelegramModal] = useState({
    isOpen: false,
    title: '',
    text: '',
    isReal: false
  });

  // --- Product CRUD Actions ---
  const addProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: Date.now(),
      rating: Number(productData.rating) || 5.0,
      reviewsCount: 1,
      stock: Number(productData.stock) || 10,
      price: Number(productData.price),
      discountPrice: productData.discountPrice ? Number(productData.discountPrice) : null,
      images: productData.images?.length ? productData.images : [productData.image],
      isNew: true
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updatedFields,
              price: Number(updatedFields.price !== undefined ? updatedFields.price : item.price),
              discountPrice: updatedFields.discountPrice !== undefined
                ? (updatedFields.discountPrice ? Number(updatedFields.discountPrice) : null)
                : item.discountPrice,
              stock: Number(updatedFields.stock !== undefined ? updatedFields.stock : item.stock)
            }
          : item
      )
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const resetProductsToDefault = () => {
    setProducts(initialProducts);
    localStorage.setItem('shop_products_v3', JSON.stringify(initialProducts));
  };

  // --- Cart Actions ---
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cart.reduce((acc, item) => {
    const activePrice = item.product.discountPrice || item.product.price;
    return acc + activePrice * item.quantity;
  }, 0);

  const shippingFee = cartSubtotal >= 500000 || cartSubtotal === 0 ? 0 : 35000;

  let discountAmount = 0;
  if (appliedPromo && cartSubtotal > 0) {
    if (appliedPromo.type === 'percent') {
      discountAmount = Math.round((cartSubtotal * appliedPromo.value) / 100);
    } else if (appliedPromo.type === 'fixed') {
      discountAmount = Math.min(appliedPromo.value, cartSubtotal);
    }
  }

  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const applyPromo = (codeStr) => {
    const clean = codeStr.trim().toUpperCase();
    const found = promoCodes.find((p) => p.code.toUpperCase() === clean);
    if (found) {
      setAppliedPromo(found);
      return { success: true, promo: found };
    }
    return { success: false, error: "Promokod mavjud emas" };
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  const addPromoCode = (promo) => {
    setPromoCodes((prev) => [...prev, promo]);
  };

  // --- Wishlist Actions ---
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const wishlistCount = wishlist.length;

  // --- Order Creation & Telegram Integration ---
  const createOrder = async ({ customerName, phone, address, paymentMethod, note }) => {
    if (cart.length === 0) return null;

    const orderId = Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: orderId,
      customerName,
      phone,
      address,
      items: cart.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.discountPrice || i.product.price,
        quantity: i.quantity
      })),
      subtotal: cartSubtotal,
      discountAmount,
      promoCode: appliedPromo?.code || null,
      shippingFee,
      totalAmount: grandTotal,
      paymentMethod,
      note: note || "",
      status: "pending",
      createdAt: new Date().toISOString()
    };

    setOrders((prev) => [newOrder, ...prev]);

    const messageText = formatOrderTelegramMessage(newOrder);
    const res = await sendTelegramMessage(
      telegramSettings.botToken,
      telegramSettings.chatId,
      messageText
    );

    setTelegramModal({
      isOpen: true,
      title: res.success ? "Telegram Xabarnomasi Jo'natildi! 🚀" : "Telegram Xabarnomasi Simulyatsiyasi",
      text: messageText,
      isReal: res.success
    });

    clearCart();
    return newOrder;
  };

  // Post single product to Telegram chat/bot
  const postProductToTelegram = async (product) => {
    const res = await sendTelegramProduct(
      telegramSettings.botToken,
      telegramSettings.chatId,
      product,
      telegramSettings.webAppUrl
    );

    if (res.success) {
      alert(`"${product.name}" mahsuloti Telegram botingizga (@${telegramSettings.botUsername}) muvaffaqiyatli yuborildi! 🚀`);
    } else {
      setTelegramModal({
        isOpen: true,
        title: "Telegramga Yuborilgan Tovarlar",
        text: `<b>${product.name}</b> rasmi va narxi Telegramga yuborilmoqda...`,
        isReal: false
      });
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const updateTelegramSettings = (newSettings) => {
    setTelegramSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const closeTelegramModal = () => {
    setTelegramModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProductsToDefault,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        shippingFee,
        discountAmount,
        grandTotal,
        promoCodes,
        appliedPromo,
        applyPromo,
        removePromo,
        addPromoCode,
        wishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount,
        orders,
        createOrder,
        updateOrderStatus,
        postProductToTelegram,
        telegramSettings,
        updateTelegramSettings,
        telegramModal,
        closeTelegramModal,
        setTelegramModal
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
