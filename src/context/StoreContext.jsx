import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts } from '../data/initialProducts';
import {
  sendTelegramMessage,
  sendTelegramProduct,
  formatOrderTelegramMessage,
  DEFAULT_BOT_TOKEN,
  DEFAULT_CHAT_ID,
  DEFAULT_BOT_USERNAME,
  DEFAULT_WEB_APP_URL
} from '../utils/telegram';

const StoreContext = createContext();

const INITIAL_PROMOCODES = [
  { code: 'UZBEK2026', type: 'percent', value: 15, desc: "15% maxsus chegirma (2026)" },
  { code: 'WELCOME10', type: 'percent', value: 10, desc: "10% birinchi xarid uchun chegirma" },
  { code: 'NAVROZ', type: 'percent', value: 20, desc: "20% bahorgi mega chegirma" },
  { code: 'SUPER50K', type: 'fixed', value: 50000, desc: "50 000 so'm qat'iy chegirma" }
];

const INITIAL_REVIEWS = [
  {
    id: 1,
    productId: 1,
    userName: "Jahongir Aliyev",
    rating: 5,
    title: "Aqlbovar qilmas tezlik!",
    comment: "Natural Titanium rangi juda chiroyli. Kamera sifati zo'r, batareyasi bemalol 1.5 kunga yetmoqda. Yetkazib berish ham atigi 4 soatda bo'ldi!",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    verified: true
  },
  {
    id: 2,
    productId: 1,
    userName: "Madina Karimova",
    rating: 5,
    title: "100% original gadjet",
    comment: "Apple rasmiy kafolati bor ekan, tekshirib ko'rdim. Do'konga katta rahmat, sovg'asiga g'ilof va himoya oynasi ham qo'shib berishdi!",
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    verified: true
  },
  {
    id: 3,
    productId: 2,
    userName: "Davron Shokirov",
    rating: 5,
    title: "Galaxy AI vau effekti berdi",
    comment: "S Pen juda qulay, fotosuratlardan ortiqcha narsalarni sun'iy intellekt orqali o'chirish funksiyasi juda ajoyib ishlaydi.",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    verified: true
  },
  {
    id: 4,
    productId: 13,
    userName: "Shavkat Qodirov",
    rating: 5,
    title: "Haqiqiy italyan charmi!",
    comment: "Klassik kostyum bilan ajoyib yarashdi. Terisi juda yumshoq, oyoqni qismaydi. Sifatiga 5 baho!",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    verified: true
  },
  {
    id: 5,
    productId: 14,
    userName: "Bekzod Umarov",
    rating: 5,
    title: "Yugurish uchun eng zo'r krossovka",
    comment: "Har kuni ertalab yuguraman, amotizatsiyasi a'lo darajada. Oyoq charchamaydi va nafas oladi.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    verified: true
  }
];

const INITIAL_ORDERS = [
  {
    id: 1024,
    customerName: "Sardor Rahimov",
    phone: "+998 90 987 65 43",
    address: "Toshkent sh., Mirobod tumani, Nukus ko'chasi 21-uy",
    items: [
      { id: 1, name: "Apple iPhone 15 Pro Max 256GB Natural Titanium", price: 15490000, quantity: 1 }
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
  // 1. Products with LocalStorage persistence & auto-migration
  const [products, setProducts] = useState(() => {
    try {
      const savedV4 = localStorage.getItem('shop_products_v4');
      const savedV3 = localStorage.getItem('shop_products_v3');
      const raw = savedV4 || savedV3;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Retain all user edits exactly as saved!
          // Only add newly introduced default products if missing
          const existingIds = new Set(parsed.map((p) => String(p.id)));
          const merged = [...parsed];
          initialProducts.forEach((ip) => {
            if (!existingIds.has(String(ip.id))) {
              merged.push(ip);
            }
          });
          return merged;
        }
      }
    } catch (e) {
      console.error("Failed to load products from localStorage:", e);
    }
    return initialProducts;
  });

  useEffect(() => {
    try {
      localStorage.setItem('shop_products_v4', JSON.stringify(products));
    } catch (err) {
      console.error("Failed to save products to localStorage:", err);
    }
  }, [products]);

  // 2. Cart with LocalStorage persistence
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('shop_cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((item) => {
          if (item.product?.id === 1) {
            return {
              ...item,
              product: {
                ...item.product,
                name: "Apple iPhone 15 Pro Max 256GB Natural Titanium",
                image: initialProducts[0].image
              }
            };
          }
          if (item.product?.id === 12) {
            return {
              ...item,
              product: {
                ...item.product,
                image: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=800&q=80"
              }
            };
          }
          return item;
        });
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
        const parsed = JSON.parse(saved);
        return parsed.map((item) => {
          if (item.id === 1) {
            return {
              ...item,
              name: "Apple iPhone 15 Pro Max 256GB Natural Titanium",
              image: initialProducts[0].image
            };
          }
          if (item.id === 12) {
            return {
              ...item,
              image: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=800&q=80"
            };
          }
          return item;
        });
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
    try {
      const saved = localStorage.getItem('shop_promocodes');
      if (saved) {
        let parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Replace obsolete UZBEK2025 with UZBEK2026 if present
          let has2026 = parsed.some(p => p.code === 'UZBEK2026');
          if (!has2026) {
            parsed = parsed.map(p => p.code === 'UZBEK2025' ? { ...p, code: 'UZBEK2026', desc: "15% maxsus chegirma (2026)" } : p);
            if (!parsed.some(p => p.code === 'UZBEK2026')) {
              parsed.unshift({ code: 'UZBEK2026', type: 'percent', value: 15, desc: "15% maxsus chegirma (2026)" });
            }
          }
          return parsed;
        }
      }
    } catch {}
    return INITIAL_PROMOCODES;
  });

  useEffect(() => {
    localStorage.setItem('shop_promocodes', JSON.stringify(promoCodes));
  }, [promoCodes]);

  const [appliedPromo, setAppliedPromo] = useState(null);

  // --- MODERNO COINS & CASHBACK SYSTEM ---
  const [modernoCoins, setModernoCoins] = useState(() => {
    const saved = localStorage.getItem('moderno_coins');
    return saved !== null ? Number(saved) : 50000; // 50,000 initial bonus coins
  });

  useEffect(() => {
    localStorage.setItem('moderno_coins', String(modernoCoins));
  }, [modernoCoins]);

  const addCoins = (amount, reason = "Xarid keshbeki") => {
    const num = Math.round(Number(amount) || 0);
    setModernoCoins((prev) => prev + num);
  };

  const useCoins = (amount) => {
    const num = Math.round(Number(amount) || 0);
    setModernoCoins((prev) => Math.max(0, prev - num));
  };



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
      webAppUrl: DEFAULT_WEB_APP_URL
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
    setProducts((prev) => {
      const next = [newProduct, ...prev];
      try {
        localStorage.setItem('shop_products_v4', JSON.stringify(next));
      } catch (err) {
        console.error("LocalStorage save error:", err);
      }
      return next;
    });
    return newProduct;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) => {
      const next = prev.map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              ...updatedFields,
              price: Number(updatedFields.price !== undefined ? updatedFields.price : item.price),
              discountPrice: updatedFields.discountPrice !== undefined
                ? (updatedFields.discountPrice ? Number(updatedFields.discountPrice) : null)
                : item.discountPrice,
              stock: Number(updatedFields.stock !== undefined ? updatedFields.stock : item.stock),
              images: updatedFields.images
                ? updatedFields.images
                : updatedFields.image
                ? [updatedFields.image, ...(Array.isArray(item.images) ? item.images.slice(1) : [])]
                : item.images
            }
          : item
      );
      try {
        localStorage.setItem('shop_products_v4', JSON.stringify(next));
      } catch (err) {
        console.error("LocalStorage save error:", err);
      }
      return next;
    });
  };

  const deleteProduct = (id) => {
    setProducts((prev) => {
      const next = prev.filter((item) => String(item.id) !== String(id));
      try {
        localStorage.setItem('shop_products_v4', JSON.stringify(next));
      } catch (err) {
        console.error("LocalStorage save error:", err);
      }
      return next;
    });
    setCart((prev) => prev.filter((item) => String(item.product?.id) !== String(id)));
    setWishlist((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  const resetProductsToDefault = () => {
    setProducts(initialProducts);
    try {
      localStorage.setItem('shop_products_v4', JSON.stringify(initialProducts));
      localStorage.removeItem('shop_products_v3');
    } catch {}
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

    // Award 3% Cashback in Moderno Coins!
    const earnedCashback = Math.round(grandTotal * 0.03);
    addCoins(earnedCashback, `Buyurtma #${newOrder.id} uchun 3% keshbek`);
    newOrder.earnedCoins = earnedCashback;

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

  // --- 8. Compare List Actions (Max 4 items) ---
  const [compareList, setCompareList] = useState(() => {
    const saved = localStorage.getItem('shop_compare_v2');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return parsed.map((item) => {
        if (item.id === 1) {
          return {
            ...item,
            name: "Apple iPhone 15 Pro Max 256GB Natural Titanium",
            image: initialProducts[0].image
          };
        }
        if (item.id === 12) {
          return {
            ...item,
            image: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=800&q=80"
          };
        }
        return item;
      });
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('shop_compare_v2', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (product) => {
    const exists = compareList.some((item) => item.id === product.id);
    if (exists) {
      removeFromCompare(product.id);
      return { added: false, removed: true };
    }
    if (compareList.length >= 4) {
      alert("Taqqoslash uchun eng ko'pi bilan 4 ta mahsulot tanlash mumkin!");
      return { added: false, full: true };
    }
    setCompareList((prev) => [...prev, product]);
    return { added: true };
  };

  const removeFromCompare = (productId) => {
    setCompareList((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInCompare = (productId) => compareList.some((item) => item.id === productId);

  const clearCompare = () => setCompareList([]);

  const compareCount = compareList.length;

  // --- 9. Reviews Actions ---
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('shop_reviews_v2');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem('shop_reviews_v2', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = ({ productId, userName, rating, comment, title }) => {
    const pId = Number(productId);
    const newRev = {
      id: Date.now(),
      productId: pId,
      userName: userName.trim() || 'Xaridor',
      rating: Number(rating) || 5,
      title: title?.trim() || '',
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
      verified: true
    };
    const updated = [newRev, ...reviews];
    setReviews(updated);

    // Recalculate average rating & count for this product
    const prodReviews = updated.filter((r) => r.productId === pId);
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    updateProduct(pId, {
      rating: Number(avg.toFixed(1)),
      reviewsCount: prodReviews.length
    });

    return newRev;
  };

  const getProductReviews = (productId) => {
    return reviews.filter((r) => r.productId === Number(productId));
  };

  // --- 10. Recently Viewed Products (max 8) ---
  const [recentlyViewedIds, setRecentlyViewedIds] = useState(() => {
    const saved = localStorage.getItem('shop_recently_viewed_v2');
    return saved ? JSON.parse(saved) : [1, 2, 6, 13];
  });

  useEffect(() => {
    localStorage.setItem('shop_recently_viewed_v2', JSON.stringify(recentlyViewedIds));
  }, [recentlyViewedIds]);

  const addToRecentlyViewed = (productId) => {
    const pId = Number(productId);
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== pId);
      return [pId, ...filtered].slice(0, 8);
    });
  };

  // --- 11. Quick 1-Click Buy Modal State ---
  const [quickBuyModal, setQuickBuyModal] = useState({
    isOpen: false,
    product: null
  });

  const openQuickBuy = (product) => setQuickBuyModal({ isOpen: true, product });
  const closeQuickBuy = () => setQuickBuyModal({ isOpen: false, product: null });

  // --- 12. Upgrader History State ---
  const [upgradeHistory, setUpgradeHistory] = useState(() => {
    const saved = localStorage.getItem('shop_upgrader_history_v2');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        sourceName: "Air Zoom Pegasus Pro Sport Krossovkasi",
        targetName: "Italiya Charm Erkaklar Klassik Tufligi (Oxford Royal)",
        chance: 49.6,
        won: true,
        date: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('shop_upgrader_history_v2', JSON.stringify(upgradeHistory));
  }, [upgradeHistory]);

  const addUpgradeRecord = (record) => {
    setUpgradeHistory((prev) => [
      { id: Date.now(), date: new Date().toISOString(), ...record },
      ...prev.slice(0, 19)
    ]);
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
        setTelegramModal,
        // Compare
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        compareCount,
        // Reviews
        reviews,
        addReview,
        getProductReviews,
        // Recently Viewed
        recentlyViewedIds,
        addToRecentlyViewed,
        // Quick 1-Click Buy
        quickBuyModal,
        openQuickBuy,
        closeQuickBuy,
        // Upgrader
        upgradeHistory,
        addUpgradeRecord,
        // Moderno Coins & Loyalty
        modernoCoins,
        addCoins,
        useCoins
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
