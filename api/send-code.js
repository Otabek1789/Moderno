import nodemailer from 'nodemailer';
import crypto from 'crypto';

const EMAIL_USER = process.env.EMAIL_USER || 'otabek1789@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'oryqzoqwlvnnvxek';
const SECRET = process.env.JWT_SECRET || 'moderno_secret_salt_2025';

export const otpStore = {};

export function createToken(email, code, expires) {
  const hash = crypto.createHmac('sha256', SECRET)
    .update(`${email.toLowerCase()}:${code}:${expires}`)
    .digest('hex');
  return `${hash}.${expires}`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Faqat POST so\'rovi qabul qilinadi' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const cleanEmail = (body.email || '').trim().toLowerCase();

    if (!cleanEmail) {
      return res.status(400).json({ success: false, error: "Elektron pochta manzili kiritilmadi" });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
    const token = createToken(cleanEmail, code, expires);

    // Also store in memory
    otpStore[cleanEmail] = { code, expires, token };

    let mailSent = false;
    let mailError = null;

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS
        }
      });

      const mailOptions = {
        from: {
          name: "MODERNO",
          address: EMAIL_USER
        },
        to: cleanEmail,
        replyTo: `"Moderno Support" <${EMAIL_USER}>`,
        subject: `[MODERNO] Tasdiqlash kodi: ${code}`,
        text: `MODERNO platformasiga kirish uchun tasdiqlash kodingiz: ${code}\n\nUshbu kod 5 daqiqa davomida amal qiladi. Uni hech kimga bermang.`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; background-color: #0b0f19; border-radius: 16px; overflow: hidden; border: 1px solid rgba(14, 165, 233, 0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
            <div style="background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); padding: 30px 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">MODERNO<span style="color: #38bdf8;"> STORE</span></h1>
              <p style="color: #e0f2fe; margin: 8px 0 0 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Xavfsiz Tizimga Kirish</p>
            </div>
            
            <div style="padding: 32px 24px; text-align: center; color: #e2e8f0;">
              <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
                Salom! <strong>MODERNO</strong> hisobingizga kirishni tasdiqlash uchun quyidagi 6 xonali bir martalik koddan foydalaning:
              </p>
              
              <div style="background-color: #111827; border: 2px solid #0ea5e9; border-radius: 12px; padding: 18px 24px; margin: 0 auto 24px auto; display: inline-block; box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);">
                <span style="font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #38bdf8; font-family: monospace;">${code}</span>
              </div>
              
              <p style="color: #64748b; font-size: 13px; margin: 0 0 24px 0; line-height: 1.5;">
                ⏱ Ushbu kod <strong>5 daqiqa</strong> davomida amal qiladi.<br />
                Xavfsizlik maqsadida bu kodni hech kim bilan bo'lishmang.
              </p>
              
              <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 20px; color: #64748b; font-size: 12px;">
                Agar bu so'rovni siz bajarmagan bo'lsangiz, ushbu xabarni e'tiborsiz qoldiring.
              </div>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      mailSent = true;
    } catch (err) {
      console.error("[Vercel OTP] Email yuborishda xatolik:", err);
      mailError = err.message;
    }

    return res.status(200).json({
      success: true,
      message: mailSent
        ? "Tasdiqlash kodi pochtangizga yuborildi!"
        : "Tasdiqlash kodi tayyorlandi! (Pochta xizmati band bo'lsa: " + code + ")",
      token,
      code: !mailSent ? code : undefined // fallback if SMTP blocked
    });
  } catch (error) {
    console.error('[API send-code] Xatolik:', error);
    return res.status(500).json({ success: false, error: error.message || "Xatolik yuz berdi" });
  }
}
