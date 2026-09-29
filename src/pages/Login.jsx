import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  Mail,
  KeyRound,
  AlertCircle,
  ArrowLeft,
  Moon,
  Sun,
  User,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import './Auth.css';

export default function Login({ defaultRegister = false }) {
  const { sendOTP, verifyOTP, signInWithGoogle } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Container sliding state (Login vs Register)
  const [isRegister, setIsRegister] = useState(defaultRegister);

  // Login Form States (Step 1: Email + Password, Step 2: OTP Code)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStep, setLoginStep] = useState(1);
  const [loginCode, setLoginCode] = useState('');
  const [loginTimer, setLoginTimer] = useState(0);

  // Register Form States (Step 1: Info, Step 2: OTP Code)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regStep, setRegStep] = useState(1);
  const [regCode, setRegCode] = useState('');
  const [regTimer, setRegTimer] = useState(0);

  // Forgot Password States
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotCode, setForgotCode] = useState('');
  const [forgotTimer, setForgotTimer] = useState(0);

  // Status & Feedback
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (type, text) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Cooldown timers
  useEffect(() => {
    let interval = null;
    if (loginTimer > 0) {
      interval = setInterval(() => setLoginTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [loginTimer]);

  useEffect(() => {
    let interval = null;
    if (regTimer > 0) {
      interval = setInterval(() => setRegTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [regTimer]);

  useEffect(() => {
    let interval = null;
    if (forgotTimer > 0) {
      interval = setInterval(() => setForgotTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [forgotTimer]);

  useEffect(() => {
    setIsRegister(defaultRegister);
    resetAllForms();
  }, [defaultRegister]);

  useEffect(() => {
    const handlePopState = () => {
      setIsRegister(window.location.pathname === '/register');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const resetAllForms = () => {
    setError('');
    setMessage('');
    setLoginStep(1);
    setLoginCode('');
    setRegStep(1);
    setRegCode('');
    setIsForgotPassword(false);
    setForgotStep(1);
    setForgotCode('');
  };

  const togglePanel = (toRegister) => {
    setIsRegister(toRegister);
    resetAllForms();
    try {
      window.history.replaceState(null, '', toRegister ? '/register' : '/login');
    } catch (_) {}
  };

  // ---------------------------------------------------------
  // LOGIN FLOW (2-Step Email Verification)
  // ---------------------------------------------------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Step 1: Send OTP to email
    if (loginStep === 1) {
      if (!email || !password) {
        setError(t('auth.fillEmailPass', "Iltimos, elektron pochta va parolingizni kiriting"));
        return;
      }
      setLoading(true);
      try {
        const result = await sendOTP(email);
        if (result.success) {
          showToast('success', result.message || "Tasdiqlash kodi pochtangizga yuborildi!");
          setMessage(`Tasdiqlash kodi quyidagi pochtaga yuborildi: ${email}`);
          setLoginStep(2);
          setLoginTimer(60);
        } else {
          setError(result.error || "Kod yuborishda xatolik yuz berdi. Pochtani tekshiring.");
        }
      } catch (err) {
        console.error("Login send OTP error:", err);
        setError("Server bilan ulanishda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Step 2: Verify OTP
    if (!loginCode || loginCode.trim().length < 4) {
      setError(t('auth.enterCode', "Iltimos, pochtangizga yuborilgan tasdiqlash kodini kiriting"));
      return;
    }

    setLoading(true);
    try {
      const result = await verifyOTP(email, loginCode);
      if (result.success) {
        if (result.isAdmin) {
          showToast('success', "👑 Xush kelibsiz, Admin! Admin paneli ochilmoqda...");
          setTimeout(() => navigate('/admin'), 600);
        } else {
          showToast('success', "✅ Muvaffaqiyatli kirdingiz!");
          setTimeout(() => navigate('/'), 600);
        }
      } else {
        setError(result.error || "Tasdiqlash kodi noto'g'ri. Qaytadan tekshiring.");
      }
    } catch (err) {
      console.error("Login verify error:", err);
      setError("Server bilan ulanishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendLoginOTP = async () => {
    if (loginTimer > 0 || !email) return;
    setError('');
    setLoading(true);
    try {
      const result = await sendOTP(email);
      if (result.success) {
        showToast('success', "Yangi tasdiqlash kodi pochtangizga yuborildi!");
        setLoginTimer(60);
      } else {
        setError(result.error || "Kodni qayta yuborishda xatolik yuz berdi.");
      }
    } catch (_) {
      setError("Server bilan ulanishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // REGISTER FLOW (2-Step Email Verification)
  // ---------------------------------------------------------
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Step 1: Send OTP to register email
    if (regStep === 1) {
      if (!regName || !regEmail || !regPassword) {
        setError(t('auth.fillAllFields', "Iltimos, barcha maydonlarni to'ldiring"));
        return;
      }
      setLoading(true);
      try {
        const result = await sendOTP(regEmail);
        if (result.success) {
          showToast('success', result.message || "Tasdiqlash kodi pochtangizga yuborildi!");
          setMessage(`Tasdiqlash kodi quyidagi pochtaga yuborildi: ${regEmail}`);
          setRegStep(2);
          setRegTimer(60);
        } else {
          setError(result.error || "Kod yuborishda xatolik yuz berdi. Pochtani tekshiring.");
        }
      } catch (err) {
        console.error("Register send OTP error:", err);
        setError("Server bilan ulanishda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Step 2: Verify Register OTP
    if (!regCode || regCode.trim().length < 4) {
      setError(t('auth.enterCode', "Iltimos, pochtangizga yuborilgan tasdiqlash kodini kiriting"));
      return;
    }

    setLoading(true);
    try {
      const result = await verifyOTP(regEmail, regCode, regName);
      if (result.success) {
        if (result.isAdmin) {
          showToast('success', "👑 Xush kelibsiz, Admin! Admin paneli ochilmoqda...");
          setTimeout(() => navigate('/admin'), 600);
        } else {
          showToast('success', "🎉 Muvaffaqiyatli ro'yxatdan o'tdingiz!");
          setTimeout(() => navigate('/'), 600);
        }
      } else {
        setError(result.error || "Tasdiqlash kodi noto'g'ri. Qaytadan tekshiring.");
      }
    } catch (err) {
      console.error("Register verify error:", err);
      setError("Server bilan ulanishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendRegOTP = async () => {
    if (regTimer > 0 || !regEmail) return;
    setError('');
    setLoading(true);
    try {
      const result = await sendOTP(regEmail);
      if (result.success) {
        showToast('success', "Yangi tasdiqlash kodi pochtangizga yuborildi!");
        setRegTimer(60);
      } else {
        setError(result.error || "Kodni qayta yuborishda xatolik yuz berdi.");
      }
    } catch (_) {
      setError("Server bilan ulanishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // FORGOT PASSWORD FLOW
  // ---------------------------------------------------------
  const openForgotPassword = (e) => {
    e.preventDefault();
    setIsForgotPassword(true);
    setForgotStep(1);
    setForgotEmail(email || '');
    setForgotCode('');
    setError('');
    setMessage('');
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (forgotStep === 1) {
      if (!forgotEmail) {
        setError(t('auth.enterEmailFirst', "Iltimos, elektron pochtangizni kiriting"));
        return;
      }
      setLoading(true);
      try {
        const result = await sendOTP(forgotEmail);
        if (result.success) {
          showToast('success', result.message || "Tasdiqlash kodi pochtangizga yuborildi!");
          setMessage(`Email pochtangizga tasdiqlash kodi yuborildi: ${forgotEmail}`);
          setForgotStep(2);
          setForgotTimer(60);
        } else {
          setError(result.error || "Kod yuborishda xatolik yuz berdi");
        }
      } catch (_) {
        setError("Server bilan ulanishda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!forgotCode || forgotCode.trim().length < 4) {
      setError(t('auth.enterCode', "Iltimos, tasdiqlash kodini kiriting"));
      return;
    }

    setLoading(true);
    try {
      const result = await verifyOTP(forgotEmail, forgotCode);
      if (result.success) {
        if (result.isAdmin) {
          showToast('success', "👑 Xush kelibsiz, Admin!");
          setTimeout(() => navigate('/admin'), 600);
        } else {
          showToast('success', "✅ Muvaffaqiyatli kirdingiz!");
          setTimeout(() => navigate('/'), 600);
        }
      } else {
        setError(result.error || "Kod noto'g'ri. Qaytadan tekshiring.");
      }
    } catch (_) {
      setError("Server bilan ulanishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialMock = async (platform) => {
    if (platform === 'Google' && signInWithGoogle) {
      setLoading(true);
      setError('');
      try {
        const res = await signInWithGoogle();
        if (res.success) {
          showToast('success', "Google orqali kirdingiz!");
          setTimeout(() => navigate(res.isAdmin ? '/admin' : '/'), 600);
        } else {
          setError(res.error || "Xatolik yuz berdi");
        }
      } catch (_) {
        setError("Google orqali kirishda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
      return;
    }

    showToast('error', `${platform} orqali kirish tez kunda ishga tushadi`);
  };

  return (
    <div className="auth-wrapper">
      {/* Toast Alert */}
      {toastMsg && (
        <div className={`auth-toast ${toastMsg.type}`}>
          {toastMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Top Left: Back button to main site */}
      <div className="auth-back-action">
        <Link to="/" className="auth-icon-btn" title={t('auth.goBack', "Ortga")}>
          <ArrowLeft size={20} />
        </Link>
      </div>

      {/* Top Right: Language and Theme Switcher */}
      <div className="auth-header-actions">
        <div className="auth-lang-switcher">
          <button
            type="button"
            className={`auth-lang-btn ${language === 'uz' ? 'active' : ''}`}
            onClick={() => setLanguage('uz')}
          >
            UZ
          </button>
          <button
            type="button"
            className={`auth-lang-btn ${language === 'ru' ? 'active' : ''}`}
            onClick={() => setLanguage('ru')}
          >
            RU
          </button>
          <button
            type="button"
            className={`auth-lang-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => setLanguage('en')}
          >
            EN
          </button>
        </div>
        <button
          type="button"
          className="auth-icon-btn"
          onClick={toggleTheme}
          title={t('auth.toggleTheme', "Mavzuni o'zgartirish")}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      <div className={`auth-container ${isRegister ? 'active' : ''}`}>
        {/* ========================================================= */}
        {/* LOGIN FORM (Right Panel)                                 */}
        {/* ========================================================= */}
        <div className="auth-form-box login">
          {isForgotPassword ? (
            /* Forgot Password Sub-Flow */
            <form onSubmit={handleForgotSubmit}>
              <h1>{t('auth.forgotPassword', "Parolni tiklash")}</h1>

              {error && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#EF4444',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    margin: '15px 0',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textAlign: 'left'
                  }}
                >
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              {message && (
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: '#10B981',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    margin: '15px 0',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textAlign: 'left'
                  }}
                >
                  <CheckCircle2 size={16} /> {message}
                </div>
              )}

              {forgotStep === 1 ? (
                <>
                  <p
                    style={{
                      margin: '15px 0 20px',
                      color: 'var(--neutral-500)',
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}
                  >
                    Gmail pochtangizni kiriting. Sizga 6 xonali tasdiqlash kodi yuboriladi va u orqali avtomatik saytga kirasiz.
                  </p>
                  <div className="auth-input-box">
                    <input
                      type="email"
                      placeholder={t('auth.email', "Email manzilingiz")}
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      autoFocus
                    />
                    <Mail size={20} />
                  </div>
                  <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: '16px' }}>
                    {loading ? t('auth.wait', 'Yuborilmoqda...') : t('auth.sendCodeBtn', "Kodni yuborish")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setError('');
                      setMessage('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--brand-600)',
                      marginTop: '20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 600
                    }}
                  >
                    ← {t('auth.backToLogin', "Kirish sahifasiga qaytish")}
                  </button>
                </>
              ) : (
                <>
                  <p
                    style={{
                      margin: '15px 0 20px',
                      color: 'var(--neutral-500)',
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}
                  >
                    Tasdiqlash kodi quyidagi pochtaga yuborildi: <br />
                    <strong style={{ color: 'var(--neutral-900)' }}>{forgotEmail}</strong>
                  </p>
                  <div className="auth-input-box">
                    <input
                      type="text"
                      placeholder={t('auth.verifyCode', "6 xonali tasdiqlash kodi")}
                      required
                      maxLength={6}
                      value={forgotCode}
                      onChange={(e) => setForgotCode(e.target.value)}
                      style={{ letterSpacing: '6px', textAlign: 'center', fontWeight: 'bold', fontSize: '20px' }}
                      autoFocus
                    />
                    <ShieldCheck size={20} />
                  </div>
                  <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: '16px' }}>
                    {loading ? t('auth.checking', 'Tekshirilmoqda...') : t('auth.verifyAndLoginBtn', "Tasdiqlash va saytga kirish")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep(1);
                      setForgotCode('');
                      setError('');
                      setMessage('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--neutral-500)',
                      marginTop: '20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      textDecoration: 'underline'
                    }}
                  >
                    ← {t('auth.changeEmail', "Boshqa email kiritish")}
                  </button>
                </>
              )}
            </form>
          ) : (
            /* Main Login Form */
            <form onSubmit={handleLoginSubmit}>
              <h1>{t('auth.loginHeading', "Kirish")}</h1>

              {error && !isRegister && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#EF4444',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    margin: '12px 0',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textAlign: 'left'
                  }}
                >
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              {message && !isRegister && (
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: '#10B981',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    margin: '12px 0',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textAlign: 'left'
                  }}
                >
                  <CheckCircle2 size={16} /> {message}
                </div>
              )}

              {loginStep === 1 ? (
                <>
                  <div className="auth-input-box">
                    <input
                      type="email"
                      placeholder={t('auth.email', "Email manzilingiz")}
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                    />
                    <Mail size={20} />
                  </div>

                  <div className="auth-input-box">
                    <input
                      type="password"
                      placeholder={t('auth.password', "Parolingiz")}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <KeyRound size={20} />
                  </div>

                  <div className="auth-forgot-link">
                    <a href="#forgot" onClick={openForgotPassword}>
                      {t('auth.forgotPassword', "Parolni unutdingizmi?")}
                    </a>
                  </div>

                  <button type="submit" className="auth-btn" disabled={loading}>
                    {loading ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <RefreshCw className="animate-spin" size={16} />
                        Tasdiqlash kodi yuborilmoqda...
                      </span>
                    ) : (
                      'Tizimga kirish'
                    )}
                  </button>

                  <p>{t('auth.orLoginSocial', "yoki ijtimoiy tarmoqlar orqali kiring")}</p>

                  <div className="auth-social-icons">
                    <button type="button" onClick={() => handleSocialMock('Google')} title="Google">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </button>
                    <button type="button" onClick={() => handleSocialMock('Facebook')} title="Facebook">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#1877F2' }}>
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    <button type="button" onClick={() => handleSocialMock('Apple')} title="Apple">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.126 3.805 3.052 1.527-.074 2.124-.984 3.96-.984 1.815 0 2.383.984 3.96.958 1.628-.027 2.65-1.524 3.633-2.983 1.144-1.674 1.616-3.298 1.637-3.385-.037-.015-3.176-1.216-3.21-4.858-.029-3.045 2.492-4.508 2.607-4.577-1.428-2.086-3.627-2.37-4.437-2.417-2.032-.128-4.047 1.13-5.078 1.13zm1.186-5.834c.813-.984 1.36-2.355 1.21-3.712-1.155.047-2.585.77-3.419 1.74-.666.772-1.32 2.164-1.144 3.498 1.295.101 2.544-.537 3.353-1.526z"/>
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                /* Step 2: Enter OTP Code */
                <>
                  <p
                    style={{
                      margin: '10px 0 16px',
                      color: 'var(--neutral-500)',
                      fontSize: '13.5px',
                      lineHeight: '1.5'
                    }}
                  >
                    Email pochtangizga yuborilgan 6 xonali tasdiqlash kodini kiriting: <br />
                    <strong style={{ color: 'var(--neutral-900)' }}>{email}</strong>
                  </p>

                  <div className="auth-input-box">
                    <input
                      type="text"
                      placeholder="• • • • • •"
                      required
                      maxLength={6}
                      value={loginCode}
                      onChange={(e) => setLoginCode(e.target.value.replace(/\D/g, ''))}
                      style={{ letterSpacing: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '22px' }}
                      autoFocus
                    />
                    <ShieldCheck size={20} />
                  </div>

                  <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: '16px' }}>
                    {loading ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <RefreshCw className="animate-spin" size={16} />
                        Tekshirilmoqda...
                      </span>
                    ) : (
                      'Kodni tasdiqlash va kirish'
                    )}
                  </button>

                  <div style={{ marginTop: '14px', fontSize: '13px', color: 'var(--neutral-500)' }}>
                    {loginTimer > 0 ? (
                      <span>Kodni qaytadan yuborish: <strong>{loginTimer}s</strong></span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendLoginOTP}
                        disabled={loading}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--brand-600)',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '13px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <RefreshCw size={13} /> Kodni qaytadan yuborish
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginStep(1);
                      setLoginCode('');
                      setError('');
                      setMessage('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--neutral-500)',
                      marginTop: '14px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      textDecoration: 'underline'
                    }}
                  >
                    ← Boshqa email kiritish
                  </button>
                </>
              )}
            </form>
          )}
        </div>

        {/* ========================================================= */}
        {/* REGISTER FORM (Left Panel)                              */}
        {/* ========================================================= */}
        <div className="auth-form-box register">
          <form onSubmit={handleRegisterSubmit}>
            <h1>{t('auth.registrationHeading', "Ro'yxatdan o'tish")}</h1>

            {error && isRegister && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#EF4444',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  margin: '12px 0',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textAlign: 'left'
                }}
              >
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {message && isRegister && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10B981',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  margin: '12px 0',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textAlign: 'left'
                }}
              >
                <CheckCircle2 size={16} /> {message}
              </div>
            )}

            {regStep === 1 ? (
              <>
                <div className="auth-input-box">
                  <input
                    type="text"
                    placeholder={t('auth.username', "Ismingiz")}
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                  <User size={20} />
                </div>

                <div className="auth-input-box">
                  <input
                    type="email"
                    placeholder={t('auth.email', "Email manzilingiz")}
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                  <Mail size={20} />
                </div>

                <div className="auth-input-box">
                  <input
                    type="password"
                    placeholder={t('auth.password', "Parolingiz")}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                  <KeyRound size={20} />
                </div>

                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <RefreshCw className="animate-spin" size={16} />
                      Tasdiqlash kodi yuborilmoqda...
                    </span>
                  ) : (
                    "Ro'yxatdan o'tish"
                  )}
                </button>

                <p>{t('auth.orRegisterSocial', "yoki quyidagilar orqali ro'yxatdan o'ting")}</p>

                <div className="auth-social-icons">
                  <button type="button" onClick={() => handleSocialMock('Google')} title="Google">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </button>
                  <button type="button" onClick={() => handleSocialMock('Facebook')} title="Facebook">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#1877F2' }}>
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button type="button" onClick={() => handleSocialMock('Apple')} title="Apple">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.126 3.805 3.052 1.527-.074 2.124-.984 3.96-.984 1.815 0 2.383.984 3.96.958 1.628-.027 2.65-1.524 3.633-2.983 1.144-1.674 1.616-3.298 1.637-3.385-.037-.015-3.176-1.216-3.21-4.858-.029-3.045 2.492-4.508 2.607-4.577-1.428-2.086-3.627-2.37-4.437-2.417-2.032-.128-4.047 1.13-5.078 1.13zm1.186-5.834c.813-.984 1.36-2.355 1.21-3.712-1.155.047-2.585.77-3.419 1.74-.666.772-1.32 2.164-1.144 3.498 1.295.101 2.544-.537 3.353-1.526z"/>
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              /* Step 2: Register OTP Code */
              <>
                <p
                  style={{
                    margin: '10px 0 16px',
                    color: 'var(--neutral-500)',
                    fontSize: '13.5px',
                    lineHeight: '1.5'
                  }}
                >
                  Email pochtangizga yuborilgan 6 xonali tasdiqlash kodini kiriting: <br />
                  <strong style={{ color: 'var(--neutral-900)' }}>{regEmail}</strong>
                </p>

                <div className="auth-input-box">
                  <input
                    type="text"
                    placeholder="• • • • • •"
                    required
                    maxLength={6}
                    value={regCode}
                    onChange={(e) => setRegCode(e.target.value.replace(/\D/g, ''))}
                    style={{ letterSpacing: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '22px' }}
                    autoFocus
                  />
                  <ShieldCheck size={20} />
                </div>

                <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: '16px' }}>
                  {loading ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <RefreshCw className="animate-spin" size={16} />
                      Tekshirilmoqda...
                    </span>
                  ) : (
                    "Ro'yxatdan o'tishni yakunlash"
                  )}
                </button>

                <div style={{ marginTop: '14px', fontSize: '13px', color: 'var(--neutral-500)' }}>
                  {regTimer > 0 ? (
                    <span>Kodni qaytadan yuborish: <strong>{regTimer}s</strong></span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendRegOTP}
                      disabled={loading}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--brand-600)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '13px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <RefreshCw size={13} /> Kodni qaytadan yuborish
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setRegStep(1);
                    setRegCode('');
                    setError('');
                    setMessage('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--neutral-500)',
                    marginTop: '14px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    textDecoration: 'underline'
                  }}
                >
                  ← Boshqa ma'lumot kiritish
                </button>
              </>
            )}
          </form>
        </div>

        {/* ========================================================= */}
        {/* SLIDING TOGGLE PANELS                                     */}
        {/* ========================================================= */}
        <div className="auth-toggle-box">
          <div className="auth-toggle-panel toggle-left">
            <h1>{t('auth.helloWelcome', "Xush kelibsiz!")}</h1>
            <p>{t('auth.dontHaveAccount', "Profilingiz yo'qmi? Hoziroq ro'yxatdan o'ting")}</p>
            <button className="auth-btn" onClick={() => togglePanel(true)}>
              {t('auth.registerBtn', "Ro'yxatdan o'tish")}
            </button>
          </div>

          <div className="auth-toggle-panel toggle-right">
            <h1>{t('auth.welcomeBack', "Qaytganingizdan xursandmiz!")}</h1>
            <p>{t('auth.alreadyHaveAccount', "Profilingiz bormi? Tizimga kiring")}</p>
            <button className="auth-btn" onClick={() => togglePanel(false)}>
              {t('auth.loginBtn', "Tizimga kirish")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
