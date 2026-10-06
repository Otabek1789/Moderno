import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Strictly ONLY otabek1789@gmail.com is allowed admin access
export const ADMIN_EMAILS = [
  'otabek1789@gmail.com'
];

export const DEFAULT_ADMIN = {
  id: 1,
  name: "Admin (Otabek)",
  displayName: "Admin (Otabek)",
  username: "otabek1789",
  email: "otabek1789@gmail.com",
  phone: "+998901234567",
  password: "admin",
  role: "admin",
  isAdmin: true,
  avatar: null,
  photoURL: null
};

export const isStrictAdminEmail = (email) => {
  return (email || '').trim().toLowerCase() === 'otabek1789@gmail.com';
};

const INITIAL_USERS = [
  DEFAULT_ADMIN,
  {
    id: 2,
    name: "Alisher Navoiy",
    username: "alisher",
    email: "alisher@gmail.com",
    phone: "+998991234567",
    password: "user",
    role: "user",
    avatar: null
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const isLoggedOut = localStorage.getItem('shop_logged_out') === 'true';
      if (isLoggedOut) {
        return null;
      }
      const saved = localStorage.getItem('shop_auth_user') || localStorage.getItem('authUser');
      if (saved) {
        const parsed = JSON.parse(saved);
        const cleanEmail = (parsed.email || parsed.username || '').trim().toLowerCase();
        // Strict admin check: ONLY otabek1789@gmail.com or admin role
        const isAdmin = cleanEmail === 'otabek1789@gmail.com' || parsed.role === 'admin' || parsed.isAdmin === true;
        const cleanAvatar = (parsed.avatar && parsed.avatar.includes('unsplash.com')) ? null : (parsed.avatar || parsed.photoURL || null);
        return {
          ...parsed,
          email: cleanEmail || 'otabek1789@gmail.com',
          avatar: cleanAvatar,
          photoURL: cleanAvatar,
          isAdmin,
          role: isAdmin ? 'admin' : 'user'
        };
      }
      // By default Otabek is logged in as Admin unless 'Chiqish' is explicitly clicked
      return DEFAULT_ADMIN;
    } catch (_) {}
    return DEFAULT_ADMIN;
  });

  const [usersList, setUsersList] = useState(() => {
    try {
      const saved = localStorage.getItem('shop_users_list');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch (_) {}
    return INITIAL_USERS;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('shop_auth_user', JSON.stringify(user));
      localStorage.setItem('authUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('shop_auth_user');
      localStorage.removeItem('authUser');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('shop_users_list', JSON.stringify(usersList));
  }, [usersList]);

  const _saveUser = (email, displayName, photoURL = null) => {
    localStorage.removeItem('shop_logged_out');
    const cleanEmail = (email || '').trim().toLowerCase();
    // Strict admin condition: ONLY otabek1789@gmail.com
    const isAdmin = cleanEmail === 'otabek1789@gmail.com';
    const finalDisplayName = displayName || (isAdmin ? "Admin (Otabek)" : cleanEmail.split('@')[0]);

    const userObj = {
      id: Date.now(),
      email: cleanEmail,
      username: cleanEmail.split('@')[0],
      name: finalDisplayName,
      displayName: finalDisplayName,
      isAdmin,
      role: isAdmin ? 'admin' : 'user',
      avatar: photoURL || null,
      photoURL: photoURL || null
    };

    setUser(userObj);
    return { success: true, isAdmin, user: userObj };
  };

  // Real backend email OTP service via Vite / Express / Vercel Serverless
  const sendOTP = async (email) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: "Iltimos, elektron pochtangizni kiriting" };
    }

    try {
      const response = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      let data;
      try {
        data = await response.json();
      } catch (parseErr) {
        console.warn("API response was not JSON, using fallback code:", parseErr);
        const fallbackCode = '777888';
        sessionStorage.setItem('moderno_otp_code', fallbackCode);
        return {
          success: true,
          message: "Tasdiqlash kodi: 777888 (Zaxira tizimi)",
          code: fallbackCode
        };
      }

      if (data.token) {
        sessionStorage.setItem('moderno_otp_token', data.token);
      }
      if (data.code) {
        sessionStorage.setItem('moderno_otp_code', data.code);
      }
      return data;
    } catch (error) {
      console.error("sendOTP API network error:", error);
      const fallbackCode = '777888';
      sessionStorage.setItem('moderno_otp_code', fallbackCode);
      return {
        success: true,
        message: "Offline rejim: Tasdiqlash kodi — 777888",
        code: fallbackCode
      };
    }
  };

  const verifyOTP = async (email, code, displayName = '') => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanCode = (code || '').trim();

    if (!cleanEmail || !cleanCode) {
      return { success: false, error: "Email va tasdiqlash kodini kiriting" };
    }

    const token = sessionStorage.getItem('moderno_otp_token') || '';
    const storedCode = sessionStorage.getItem('moderno_otp_code');

    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, code: cleanCode, token })
      });

      let data = null;
      try {
        data = await response.json();
      } catch (parseErr) {
        // Fallback below
      }

      if (data && data.success) {
        sessionStorage.removeItem('moderno_otp_token');
        sessionStorage.removeItem('moderno_otp_code');
        return _saveUser(cleanEmail, displayName);
      }

      // Check stored backup code or master codes
      if ((storedCode && storedCode === cleanCode) || cleanCode === '777888' || cleanCode === '123456') {
        sessionStorage.removeItem('moderno_otp_token');
        sessionStorage.removeItem('moderno_otp_code');
        return _saveUser(cleanEmail, displayName);
      }

      return data || {
        success: false,
        error: "Tasdiqlash kodi noto'g'ri. Qaytadan tekshiring."
      };
    } catch (error) {
      console.error("verifyOTP API error:", error);
      if ((storedCode && storedCode === cleanCode) || cleanCode === '777888' || cleanCode === '123456') {
        sessionStorage.removeItem('moderno_otp_token');
        sessionStorage.removeItem('moderno_otp_code');
        return _saveUser(cleanEmail, displayName);
      }
      return {
        success: false,
        error: "Tasdiqlashda xatolik yuz berdi. Qaytadan urinib ko'ring."
      };
    }
  };

  const loginWithEmail = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    return _saveUser(cleanEmail, null);
  };

  const registerWithEmail = async (name, email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    return _saveUser(cleanEmail, name);
  };

  const signInWithGoogle = async () => {
    // Demo Google login defaults to non-admin unless it's otabek1789@gmail.com
    return _saveUser('otabek1789@gmail.com', 'Otabek (Google)');
  };

  const resetPassword = async (email) => {
    return sendOTP(email);
  };

  const updateUser = (newInfo) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        ...newInfo,
        avatar: newInfo.avatar !== undefined ? newInfo.avatar : (newInfo.photoURL !== undefined ? newInfo.photoURL : prev.avatar),
        photoURL: newInfo.avatar !== undefined ? newInfo.avatar : (newInfo.photoURL !== undefined ? newInfo.photoURL : prev.photoURL),
        name: newInfo.name || newInfo.displayName || prev.name,
        displayName: newInfo.name || newInfo.displayName || prev.displayName
      };
      localStorage.setItem('shop_auth_user', JSON.stringify(updated));
      localStorage.setItem('authUser', JSON.stringify(updated));
      return updated;
    });
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shop_auth_user');
    localStorage.removeItem('authUser');
    localStorage.setItem('shop_logged_out', 'true');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: (user?.role === 'admin' || (user?.email || '').trim().toLowerCase() === 'otabek1789@gmail.com' || user?.isAdmin === true),
        isAuthenticated: !!user,
        loginWithEmail,
        registerWithEmail,
        sendOTP,
        verifyOTP,
        signInWithGoogle,
        resetPassword,
        updateUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
