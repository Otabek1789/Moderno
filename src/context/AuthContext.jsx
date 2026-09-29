import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Strictly ONLY otabek1789@gmail.com is allowed admin access
export const ADMIN_EMAILS = [
  'otabek1789@gmail.com'
];

export const isStrictAdminEmail = (email) => {
  return (email || '').trim().toLowerCase() === 'otabek1789@gmail.com';
};

const INITIAL_USERS = [
  {
    id: 1,
    name: "Admin (Otabek)",
    username: "otabek1789",
    email: "otabek1789@gmail.com",
    phone: "+998901234567",
    password: "admin",
    role: "admin",
    avatar: null
  },
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
      const saved = localStorage.getItem('shop_auth_user') || localStorage.getItem('authUser');
      if (saved) {
        const parsed = JSON.parse(saved);
        const cleanEmail = (parsed.email || parsed.username || '').trim().toLowerCase();
        // Strict admin check: ONLY otabek1789@gmail.com
        const isAdmin = cleanEmail === 'otabek1789@gmail.com';
        // Erase unwanted default Unsplash picture if previously cached
        const cleanAvatar = (parsed.avatar && parsed.avatar.includes('unsplash.com')) ? null : (parsed.avatar || parsed.photoURL || null);
        return {
          ...parsed,
          email: cleanEmail,
          avatar: cleanAvatar,
          photoURL: cleanAvatar,
          isAdmin,
          role: isAdmin ? 'admin' : 'user'
        };
      }
    } catch (_) {}
    return null;
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

  // Real backend email OTP service via Vite / Express
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
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("sendOTP API error:", error);
      return {
        success: false,
        error: "Server bilan bog'lanishda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring."
      };
    }
  };

  const verifyOTP = async (email, code, displayName = '') => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanCode = (code || '').trim();

    if (!cleanEmail || !cleanCode) {
      return { success: false, error: "Email va tasdiqlash kodini kiriting" };
    }

    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, code: cleanCode })
      });
      const data = await response.json();

      if (data.success) {
        return _saveUser(cleanEmail, displayName);
      }
      return data;
    } catch (error) {
      console.error("verifyOTP API error:", error);
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
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: (user?.email || '').trim().toLowerCase() === 'otabek1789@gmail.com',
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
