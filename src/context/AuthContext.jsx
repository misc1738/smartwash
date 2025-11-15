import { createContext, useContext, useState, useEffect } from 'react';
import { authAdapter } from '../services/authAdapter';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  useEffect(() => {
    // subscribe to auth state changes (Firebase) when available
    const unsub = authAdapter.onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        // normalize Firebase User to minimal shape
        const u = { id: firebaseUser.uid, email: firebaseUser.email, displayName: firebaseUser.displayName };
        setUser(u);
      } else {
        setUser(null);
      }
    });
    return () => unsub && unsub();
  }, []);

  const register = async (payload) => {
    const u = await authAdapter.register(payload);
    setUser(u);
    return u;
  };

  const login = async (payload) => {
    const u = await authAdapter.login(payload);
    setUser(u);
    return u;
  };

  const logout = async () => {
    await authAdapter.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
