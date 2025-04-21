'use client';
import { useState, useEffect } from 'react';
import { AuthContext } from './auth-context';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

// Only component exports in this file
export function AuthProvider({ children }) {
  const [user,   setUser]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token     = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    if (token && userEmail) setUser({ email: userEmail });
    setLoading(false);
  }, []);

  const register = async (email, pass, name) => {
    setLoading(true);
    try {
      const { data:{ token } } = await authAPI.register(email, pass, name);
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', email);
      setUser({ email });
      toast.success('Registration successful!');
      return true;
    } catch (e) {
      toast.error(e.response?.data?.error || 'Registration failed');
      return false;
    } finally { setLoading(false); }
  };

  const login = async (email, pass) => {
    setLoading(true);
    try {
      const { data:{ token } } = await authAPI.login(email, pass);
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', email);
      setUser({ email });
      toast.success('Login successful!');
      return true;
    } catch (e) {
      toast.error(e.response?.data?.error || 'Login failed');
      return false;
    } finally { setLoading(false); }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      setUser(null);
      toast.success('Logout successful!');
      return true;
    } catch (e) {
      toast.error(e.response?.data?.error || 'Logout failed');
      return false;
    } finally { setLoading(false); }
  };

  const value = { user, loading, register, login, logout, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
