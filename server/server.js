import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// In-memory OTP store
export const otpStore = {};

const EMAIL_USER = process.env.EMAIL_USER || 'otabek1789@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'oryqzoqwlvnnvxek';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// Helper to send OTP code
export async function sendOtpEmail(email) {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!cleanEmail) {
    throw new Error("Elektron pochta manzili kiritilmadi");
  }

  // Generate a 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[cleanEmail] = { code, expires: Date.now() + 5 * 60 * 1000 };

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
  console.log(`[OTP] Kod ${cleanEmail} manziliga yuborildi: ${code}`);
  return { success: true, message: "Tasdiqlash kodi pochtangizga yuborildi!", code };
}

// Helper to verify code
export function verifyOtpCode(email, code) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanCode = (code || '').trim();

  if (!cleanEmail || !cleanCode) {
    return { success: false, error: "Ma'lumotlar to'liq emas" };
  }

  const storedData = otpStore[cleanEmail];
  if (!storedData) {
    return { success: false, error: "Kod yuborilmagan yoki muddati o'tgan" };
  }

  if (Date.now() > storedData.expires) {
    delete otpStore[cleanEmail];
    return { success: false, error: "Kodning muddati tugagan. Qaytadan so'rang." };
  }

  if (storedData.code === cleanCode) {
    delete otpStore[cleanEmail];
    const isAdmin = cleanEmail === 'otabek1789@gmail.com';
    return { success: true, isAdmin, email: cleanEmail };
  } else {
    return { success: false, error: "Kod noto'g'ri. Qaytadan tekshiring." };
  }
}

// Routes
const handleSendCode = async (req, res) => {
  try {
    const result = await sendOtpEmail(req.body.email);
    res.json(result);
  } catch (error) {
    console.error('Xat yuborishda xatolik:', error);
    res.status(500).json({ success: false, error: error.message || "Xat yuborishda xatolik yuz berdi." });
  }
};

const handleVerifyCode = (req, res) => {
  const { email, code } = req.body;
  const result = verifyOtpCode(email, code);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
};

// Route handlers - supports local development and Vercel serverless functions
app.post(['/api/send-code', '/send-code'], handleSendCode);
app.post(['/api/verify-code', '/verify-code'], handleVerifyCode);

app.get(['/api/health', '/health', '/api', '/'], (req, res) => {
  res.json({
    status: 'ok',
    server: 'MODERNO Express Backend (Local & Vercel)',
    timestamp: new Date().toISOString()
  });
});

const isDirectRun = process.argv[1] && (process.argv[1].endsWith('server.js') || process.argv[1].endsWith('server.cjs'));
if (isDirectRun || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  // If not already listening or running locally
  try {
    app.listen(PORT, () => {
      console.log(`Backend server ishga tushdi: http://localhost:${PORT}`);
    });
  } catch (err) {
    // Port might already be open
  }
}

export default app;
