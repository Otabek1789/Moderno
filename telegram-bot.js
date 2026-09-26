/**
 * MODERNO Telegram Bot Server
 * Token: 8682232515:AAE_r0XFh0SyhJ7ec3w0JItfAgJCAB8OL-4
 * Chat ID: 7373118052
 * Bot: @nekitekibeki_bot
 */

const BOT_TOKEN = process.env.BOT_TOKEN || '8682232515:AAE_r0XFh0SyhJ7ec3w0JItfAgJCAB8OL-4';
const ADMIN_CHAT_ID = process.env.CHAT_ID || '7373118052';
// Default WebApp URL (can be changed to Vercel URL when deployed)
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://moderno-uz-shop.vercel.app';

const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function tgCall(method, body = {}) {
  try {
    const res = await fetch(`${API_BASE}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err) {
    console.error(`Error in ${method}:`, err.message);
    return { ok: false, error: err.message };
  }
}

// Set Menu Button [Open / Do'kon]
async function configureMenuButton(url) {
  const targetUrl = url || WEB_APP_URL;
  console.log(`Setting Telegram Chat Menu Button to: ${targetUrl}...`);
  const res = await tgCall('setChatMenuButton', {
    menu_button: {
      type: 'web_app',
      text: "Do'kon",
      web_app: { url: targetUrl }
    }
  });
  console.log('Menu Button Response:', res);
  return res;
}

let lastUpdateId = 0;

async function pollUpdates() {
  try {
    const res = await tgCall('getUpdates', {
      offset: lastUpdateId + 1,
      timeout: 30
    });

    if (res.ok && res.result && res.result.length > 0) {
      for (const update of res.result) {
        lastUpdateId = update.update_id;

        if (update.message && update.message.text) {
          const chatId = update.message.chat.id;
          const text = update.message.text.trim();
          const firstName = update.message.from.first_name || 'Xaridor';

          console.log(`[Message from ${chatId}] ${text}`);

          if (text.startsWith('/start') || text.startsWith('/shop') || text === "🛍 Do'konni ochish") {
            const welcomeText = `
Assalomu alaykum, <b>${firstName}</b>! 👋

🛒 <b>MODERNO</b> rasmiy onlayn do'koniga xush kelibsiz!
Bu yerda siz eng so'nggi smartfonlar, noutbuklar, quloqchinlar va aksessuarlarni eng arzon narxlarda xarid qilishingiz mumkin.

👇 Do'konni ochish uchun pastdagi <b>"Do'konni ochish"</b> tugmasini bosing:
`;

            await tgCall('sendMessage', {
              chat_id: chatId,
              text: welcomeText,
              parse_mode: 'HTML',
              reply_markup: {
                keyboard: [
                  [
                    {
                      text: "🛍 Do'konni ochish",
                      web_app: { url: WEB_APP_URL }
                    }
                  ]
                ],
                resize_keyboard: true
              }
            });

            // Also send inline button
            await tgCall('sendMessage', {
              chat_id: chatId,
              text: "Ilovani to'liq ekranda ochish:",
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "🚀 Mini App Do'konni Ochish",
                      web_app: { url: WEB_APP_URL }
                    }
                  ]
                ]
              }
            });
          } else if (text === '/help') {
            await tgCall('sendMessage', {
              chat_id: chatId,
              text: `ℹ️ <b>Yordam bo'limi:</b>\n\nDo'konimizdan buyurtma berish uchun /start bosing yoki quyidagi <b>"Do'kon"</b> menyu tugmasidan foydalaning.\n\n📞 Call-markaz: +998 71 200 44 44`,
              parse_mode: 'HTML'
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('Polling error:', err);
  }

  setTimeout(pollUpdates, 1000);
}

async function start() {
  console.log('🤖 MODERNO Telegram Bot ishga tushmoqda...');
  const me = await tgCall('getMe');
  if (me.ok) {
    console.log(`✅ Bot faol: @${me.result.username} (${me.result.first_name})`);
  } else {
    console.error('❌ Bot token xatosi:', me);
    return;
  }

  // Set chat menu button
  await configureMenuButton();

  // Start polling
  console.log('🚀 Bot xabarlarni tinglamoqda (Polling active)...');
  pollUpdates();
}

start();
