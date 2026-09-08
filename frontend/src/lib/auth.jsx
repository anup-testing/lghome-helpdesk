import { createContext, useContext, useMemo, useState } from 'react';
import { apiClient } from './apiClient.js';

const TOKEN_KEY = 'lgcare_token';
const USER_KEY = 'lgcare_user';

const AuthContext = createContext(null);

export const PORTAL_HOME = {
  ADMIN: '/admin',
  DISPATCHER: '/dispatcher',
  TECHNICIAN: '/technician',
  CUSTOMER: '/customer',
};

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(readStoredUser);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      async login(email, password) {
        const result = await apiClient.post('/auth/login', { email, password });
        localStorage.setItem(TOKEN_KEY, result.token);
        localStorage.setItem(USER_KEY, JSON.stringify(result.user));
        setToken(result.token);
        setUser(result.user);
        return result.user;
      },
      logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
