import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import ParcelPage from './pages/ParcelPage';
import SatellitePage from './pages/SatellitePage';
import ProfilePage from './pages/ProfilePage';

// Components
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

// PWA Service Worker registration
// Service worker sadece production build'de aktif — dev modda (npm run dev)
// Vite dosyaları hash'siz/sabit URL'lerle servis ettiği için service worker
// eski kodu cache'leyip yanıltıcı davranabiliyor. import.meta.env.PROD sadece
// gerçek `npm run build` çıktısında true olur.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register('/sw.js');
}

export default function App() {
  const { token, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {token && <Header />}

        <main className="w-full">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <MapPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/parcels"
              element={
                <ProtectedRoute>
                  <ParcelPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/parcels/:parcelId/satellite"
              element={
                <ProtectedRoute>
                  <SatellitePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Redirect */}
            <Route
              path="/"
              element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
