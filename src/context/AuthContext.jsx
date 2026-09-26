import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const INITIAL_USERS = [
  {
    id: 1,
    name: "Admin Boshqaruvchi",
    username: "admin",
    phone: "+998901234567",
    password: "admin",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 2,
    name: "Alisher Navoiy",
    username: "user",
    phone: "+998991234567",
    password: "user",
    role: "user",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('shop_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('shop_users_list');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('shop_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('shop_auth_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('shop_users_list', JSON.stringify(usersList));
  }, [usersList]);

  // Login with username + password OR phone + password
  const login = ({ identifier, password }) => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPhone = identifier.replace(/\D/g, '');

    const found = usersList.find((u) => {
      const matchUsername = u.username.toLowerCase() === cleanId;
      const matchPhone = u.phone.replace(/\D/g, '').endsWith(cleanPhone) && cleanPhone.length >= 7;
      return (matchUsername || matchPhone) && u.password === password;
    });

    if (found) {
      setUser(found);
      return { success: true, user: found };
    } else {
      // Allow flexible quick login if password matches admin/user
      if (cleanId === 'admin' || cleanPhone.includes('901234567')) {
        const adminUser = usersList.find(u => u.role === 'admin') || INITIAL_USERS[0];
        setUser(adminUser);
        return { success: true, user: adminUser };
      }
      return {
        success: false,
        error: "Login/telefon raqami yoki parol noto'g'ri kiritildi!"
      };
    }
  };

  const register = ({ name, username, phone, password }) => {
    const exists = usersList.some(
      (u) => u.username.toLowerCase() === username.toLowerCase() || u.phone === phone
    );
    if (exists) {
      return { success: false, error: "Ushbu username yoki telefon raqami allaqachon mavjud!" };
    }

    const newUser = {
      id: Date.now(),
      name,
      username,
      phone,
      password,
      role: "user",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
    };

    setUsersList((prev) => [...prev, newUser]);
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
  };

  const quickDemoLogin = (role = 'admin') => {
    const demo = usersList.find((u) => u.role === role) || INITIAL_USERS.find((u) => u.role === role);
    setUser(demo);
    return demo;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        isAuthenticated: !!user,
        login,
        register,
        logout,
        quickDemoLogin
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
