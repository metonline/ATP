import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/auth";
import Header from "./components/Header";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MapPage from "./pages/MapPage";
import ParcelPage from "./pages/ParcelPage";
import ProfilePage from "./pages/ProfilePage";
import SatellitePage from "./pages/SatellitePage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminPanel from "./pages/AdminPanel";

const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const { token } = useAuthStore();
  return token ? element : <Navigate to="/login" />;
};

export default function App() {
  const { token } = useAuthStore();

  return (
    <Router>
      {token && <Header />}
      <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
          <Route path="/map" element={<ProtectedRoute element={<MapPage />} />} />
          <Route path="/parcel/:id" element={<ProtectedRoute element={<ParcelPage />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
          <Route path="/satellite/:parcelId" element={<ProtectedRoute element={<SatellitePage />} />} />

          {/* Geriye dönük uyumluluk: bugünkü oturumda MapPage/DashboardPage/ParcelPage
              içindeki bazı link/navigate() çağrıları hâlâ eski yol şemasını kullanıyor
              (/parcels, /parcels/:parcelId/satellite). Claude Code'un yeni şemasını
              (/parcel/:id, /satellite/:parcelId) bozmadan, aynı sayfalara giden
              ek (alias) route'lar ekliyoruz — ikisi de çalışsın diye. */}
          <Route path="/parcels" element={<ProtectedRoute element={<ParcelPage />} />} />
          <Route path="/parcels/:parcelId/satellite" element={<ProtectedRoute element={<SatellitePage />} />} />

          <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}