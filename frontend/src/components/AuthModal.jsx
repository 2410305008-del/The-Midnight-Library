import React, { useState } from 'react';
import { useBookstore } from '../context/BookstoreContext';
import api from '../services/api';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, currentUser, setCurrentUser, showToast } = useBookstore();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'register') {
      const res = await api.register(formData.name, formData.email, formData.password);
      setLoading(false);
      if (res && res.success) {
        setCurrentUser(res.user);
        showToast(`Welcome to PageHaven Sanctuary, ${res.user.name}!`);
        setIsAuthModalOpen(false);
      } else {
        showToast(res.message || 'Registration failed', 'error');
      }
    } else {
      const res = await api.login(formData.email, formData.password);
      setLoading(false);
      if (res && res.success) {
        setCurrentUser(res.user);
        showToast(`Welcome back, ${res.user.name}`);
        setIsAuthModalOpen(false);
      } else {
        showToast(res.message || 'Login failed', 'error');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden border border-surface-container flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">account_circle</span>
            <h3 className="font-headline-sm text-lg font-bold text-primary">
              {mode === 'login' ? 'Scholar Sanctuary Access' : 'Register Scholar Account'}
            </h3>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-8 h-8 rounded-full bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-surface-container bg-surface-container-low p-2 gap-2">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Scholar Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Register Membership
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {mode === 'register' && (
            <div>
              <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">
                Scholar Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Eleanor Vance"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="scholar@pagehaven.org"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">
              Sanctuary Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : mode === 'login' ? 'Enter Sanctuary' : 'Register Scholar Account'}
            </button>
          </div>

          <div className="text-center pt-2 text-xs text-outline">
            <span>Current Status: </span>
            <strong className="text-on-surface">{currentUser?.name || 'Guest Explorer'}</strong>
            <span className="block text-[11px] text-outline-variant mt-0.5">
              Patron tier includes 21-day digital loan access & white-glove packaging.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
