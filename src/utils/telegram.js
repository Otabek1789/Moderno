// Telegram Bot API integration

export async function sendTelegramMessage(token, chatId, messageText) {
  if (!token || !chatId) {
    console.warn('Telegram Bot Token or Chat ID not configured. Message simulated in UI.');
    return {
      success: false,
      simulated: true,
      error: 'Token yoki Chat ID kiritilmagan (Simulyatsiya rejimi)',
      preview: messageText
    };
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML'
      })
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
