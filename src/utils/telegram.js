// Telegram Bot API integration with real bot token and chat ID

export const DEFAULT_BOT_TOKEN = "8682232515:AAE_r0XFh0SyhJ7ec3w0JItfAgJCAB8OL-4";
export const DEFAULT_CHAT_ID = "7373118052";
export const DEFAULT_BOT_USERNAME = "nekitekibeki_bot";
export const DEFAULT_WEB_APP_URL = "https://moderno-three.vercel.app";

export async function sendTelegramMessage(token, chatId, messageText, inlineKeyboard = null) {
  const activeToken = token || DEFAULT_BOT_TOKEN;
  const activeChatId = chatId || DEFAULT_CHAT_ID;

  if (!activeToken || !activeChatId) {
    return {
      success: false,
      simulated: true,
      error: 'Token yoki Chat ID kiritilmagan',
      preview: messageText
    };
  }

  try {
    const url = `https://api.telegram.org/bot${activeToken}/sendMessage`;
    const payload = {
      chat_id: activeChatId,
      text: messageText,
      parse_mode: 'HTML'
    };

    if (inlineKeyboard) {
      payload.reply_markup = { inline_keyboard: inlineKeyboard };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (data.ok) {
      return { success: true, data };
    } else {
      return {
        success: false,
        simulated: true,
        error: data.description || 'Telegram API xatosi',
        preview: messageText
      };
    }
  } catch (err) {
    console.error('Telegram send error:', err);
    return {
      success: false,
      simulated: true,
      error: err.message || 'Tarmoq xatosi',
      preview: messageText
    };
  }
}

// Send Product Card with photo to Telegram
export async function sendTelegramProduct(token, chatId, product, webAppUrl = '') {
  const activeToken = token || DEFAULT_BOT_TOKEN;
  const activeChatId = chatId || DEFAULT_CHAT_ID;

  const currentPrice = product.discountPrice || product.price;
  const oldPriceText = product.discountPrice
    ? ` <s>${new Intl.NumberFormat('uz-UZ').format(product.price)} so'm</s>`
    : '';

  const caption = `
🛍 <b>${product.name}</b>
━━━━━━━━━━━━━━━━━━━━
💰 <b>Narxi:</b> <u>${new Intl.NumberFormat('uz-UZ').format(currentPrice)} so'm</u>${oldPriceText}
⭐️ <b>Reyting:</b> ${product.rating} ★ (${product.reviewsCount || 10}+ sharh)
📦 <b>Holati:</b> Omborda mavjud (${product.stock || 10} dona)
━━━━━━━━━━━━━━━━━━━━
📝 <i>${typeof product.description === 'object' ? product.description.uz : product.description}</i>
`;

  const inlineKeyboard = [];
  const actionButtons = [];

  if (webAppUrl && webAppUrl.startsWith('https://')) {
    actionButtons.push({
      text: "📱 Ilovada ochish (Mini App)",
      web_app: { url: `${webAppUrl}/product/${product.id}` }
    });
  } else {
    actionButtons.push({
      text: "🛒 Do'konga o'tish",
      url: `https://t.me/${DEFAULT_BOT_USERNAME}?start=prod_${product.id}`
    });
  }

  inlineKeyboard.push(actionButtons);

  try {
    const url = `https://api.telegram.org/bot${activeToken}/sendPhoto`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: activeChatId,
        photo: product.image,
        caption: caption,
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: inlineKeyboard }
      })
    });

    const data = await response.json();
    if (data.ok) {
      return { success: true, data };
    } else {
      // Fallback to text message if photo fails
      return sendTelegramMessage(activeToken, activeChatId, caption, inlineKeyboard);
    }
  } catch (err) {
    return sendTelegramMessage(activeToken, activeChatId, caption, inlineKeyboard);
  }
}

// Set Chat Menu Button in Telegram to open Web App
export async function setTelegramMenuButton(token, webAppUrl) {
  const activeToken = token || DEFAULT_BOT_TOKEN;
  try {
    const url = `https://api.telegram.org/bot${activeToken}/setChatMenuButton`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        menu_button: {
          type: "web_app",
          text: "Do'kon",
          web_app: { url: webAppUrl }
        }
      })
    });
    return await response.json();
  } catch (err) {
    return { ok: false, description: err.message };
  }
}

export function formatOrderTelegramMessage(order) {
  const itemsText = order.items
    .map(
      (item, idx) =>
        `   ${idx + 1}. <b>${item.name}</b> x ${item.quantity} dona — <i>${new Intl.NumberFormat('uz-UZ').format(item.price * item.quantity)} so'm</i>`
    )
    .join('\n');

  const discountText = order.discountAmount
    ? `\n🎟 <b>Promokod (${order.promoCode}):</b> -${new Intl.NumberFormat('uz-UZ').format(order.discountAmount)} so'm`
    : '';

  return `
🛒 <b>YANGI BUYURTMA #${order.id}</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>Mijoz:</b> ${order.customerName}
📞 <b>Telefon:</b> ${order.phone}
📍 <b>Manzil:</b> ${order.address}
💳 <b>To'lov usuli:</b> ${order.paymentMethod.toUpperCase()}
📝 <b>Izoh:</b> ${order.note || "Mavjud emas"}
━━━━━━━━━━━━━━━━━━━━
📦 <b>Mahsulotlar:</b>
${itemsText}
${discountText}
🚚 <b>Yetkazib berish:</b> ${order.shippingFee === 0 ? "Bepul" : new Intl.NumberFormat('uz-UZ').format(order.shippingFee) + " so'm"}
💰 <b>JAMI SUMMA:</b> <u>${new Intl.NumberFormat('uz-UZ').format(order.totalAmount)} so'm</u>
━━━━━━━━━━━━━━━━━━━━
⏰ <i>Sana: ${new Date(order.createdAt).toLocaleString('uz-UZ')}</i>
`;
}

export function formatContactTelegramMessage(contact) {
  return `
📬 <b>YANGI ALOQA XABARI</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>Ism:</b> ${contact.name}
📞 <b>Telefon:</b> ${contact.phone}
✉️ <b>Email:</b> ${contact.email || "Kiritilmagan"}
💬 <b>Xabar:</b>
<i>"${contact.message}"</i>
━━━━━━━━━━━━━━━━━━━━
⏰ <i>Sana: ${new Date().toLocaleString('uz-UZ')}</i>
`;
}
