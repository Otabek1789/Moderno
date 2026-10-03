import crypto from 'crypto';

const SECRET = process.env.JWT_SECRET || 'moderno_secret_salt_2025';

export function verifyToken(email, code, token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return false;
  const [hash, expiresStr] = token.split('.');
  const expires = Number(expiresStr);
  if (!expires || Date.now() > expires) return false;
  const expected = crypto.createHmac('sha256', SECRET)
    .update(`${email.toLowerCase()}:${code}:${expires}`)
    .digest('hex');
  return expected === hash;
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
    const cleanCode = (body.code || '').trim();
    const token = body.token || '';

    if (!cleanEmail || !cleanCode) {
      return res.status(400).json({ success: false, error: "Email va tasdiqlash kodini kiriting" });
    }

    const isTokenValid = token ? verifyToken(cleanEmail, cleanCode, token) : false;

    // Also support universal admin master fallback code for emergencies/demo
    const isMasterCode = cleanCode === '777888' || cleanCode === '123456';

    if (isTokenValid || isMasterCode) {
      const isAdmin = cleanEmail === 'otabek1789@gmail.com';
      return res.status(200).json({
        success: true,
        isAdmin,
        email: cleanEmail
      });
    }

    return res.status(400).json({
      success: false,
      error: "Tasdiqlash kodi noto'g'ri yoki muddati tugagan"
    });
  } catch (error) {
    console.error('[API verify-code] Xatolik:', error);
    return res.status(500).json({ success: false, error: error.message || "Xatolik yuz berdi" });
  }
}
