import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/auth';
import { LanguageSwitcher } from './LanguageSwitcher';

export default function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout, farmer } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-2xl">🌾</span>
          <span className="text-gray-900">{t('header.brand')}</span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link
            to="/dashboard"
            className="text-gray-600 hover:text-gray-900 font-medium transition"
          >
            {t('header.dashboard')}
          </Link>
          <Link
            to="/map"
            className="text-gray-600 hover:text-gray-900 font-medium transition"
          >
            {t('header.map')}
          </Link>
          <Link
            to="/parcels"
            className="text-gray-600 hover:text-gray-900 font-medium transition"
          >
            {t('header.parcels')}
          </Link>
        </nav>

        {/* Dil seçici + Kullanıcı Menüsü */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <span className="text-sm font-medium text-gray-900">{farmer?.username}</span>
              <span className="text-lg">👤</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-48 z-50">
                <div className="px-4 py-3 border-b text-sm text-gray-600">
                  <p className="font-medium text-gray-900">{farmer?.full_name}</p>
                  <p className="text-xs">{farmer?.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition font-medium text-sm"
                >
                  👤 {t('header.myProfile')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition font-medium text-sm"
                >
                  {t('header.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
