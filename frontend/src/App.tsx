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

// Components
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

// PWA Service Worker registration
if ('serviceWorker' in navigator) {
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
