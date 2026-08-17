import React, { useState, useEffect } from "react";
import { api } from "../store/auth";

interface Profile {
  id: number;
  email: string;
  username: string;
  full_name: string;
  region: string | null;
  phone: string | null;
  farm_size_hectares: number | null;
  primary_crops: string | null;
  created_at: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Düzenlenebilir alanlar için ayrı form state'i
  const [region, setRegion] = useState("");
  const [phone, setPhone] = useState("");
  const [farmSizeHectares, setFarmSizeHectares] = useState("");
  const [primaryCrops, setPrimaryCrops] = useState("");

  // Şifre değiştirme formu
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/auth/profile");
      const data: Profile = response.data;
      setProfile(data);
      setRegion(data.region || "");
      setPhone(data.phone || "");
      setFarmSizeHectares(data.farm_size_hectares !== null ? String(data.farm_size_hectares) : "");
      setPrimaryCrops(data.primary_crops || "");
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Profil bilgileri yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("Tüm şifre alanlarını doldur.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Yeni şifre en az 6 karakter olmalı.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Yeni şifreler eşleşmiyor.");
      return;
    }

    try {
      setPasswordSaving(true);
      await api.post("/api/auth/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setPasswordSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error changing password:", err);
      setPasswordError(err.response?.data?.detail || "Şifre değiştirilemedi.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSaveSuccess(false);

      await api.put("/api/auth/profile", {
        region: region || null,
        phone: phone || null,
        farm_size_hectares: farmSizeHectares ? parseFloat(farmSizeHectares) : null,
        primary_crops: primaryCrops || null,
      });

      setSaveSuccess(true);
      await fetchProfile();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Profil güncellenemedi. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">👤 Profilim</h1>
            <p className="text-gray-600 mt-1">Hesap bilgilerin ve çiftlik detayların</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-700">Yükleniyor...</p>
            </div>
          ) : error && !profile ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 font-medium">❌ Hata</p>
              <p className="text-red-600 text-sm mt-2">{error}</p>
              <button
                onClick={fetchProfile}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Tekrar Dene
              </button>
            </div>
          ) : profile ? (
            <>
              {/* Değiştirilemeyen hesap bilgileri */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Hesap Bilgileri</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">E-posta</p>
                    <p className="text-gray-900 font-medium">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Kullanıcı Adı</p>
                    <p className="text-gray-900 font-medium">{profile.username}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Ad Soyad</p>
                    <p className="text-gray-900 font-medium">{profile.full_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Üyelik Tarihi</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(profile.created_at).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Düzenlenebilir çiftlik bilgileri */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Çiftlik Bilgileri</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bölge</label>
                    <input
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder="örn. Hatay, Reyhanlı"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="örn. 0532 123 45 67"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Toplam Çiftlik Alanı (hektar)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={farmSizeHectares}
                      onChange={(e) => setFarmSizeHectares(e.target.value)}
                      placeholder="örn. 94.59"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ana Ürünler</label>
                    <input
                      type="text"
                      value={primaryCrops}
                      onChange={(e) => setPrimaryCrops(e.target.value)}
                      placeholder="örn. buğday, mısır, pamuk"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Virgülle ayırarak birden fazla ürün girebilirsin.</p>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {saveSuccess && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-700 text-sm">✓ Profil güncellendi</p>
                  </div>
                )}

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium"
                >
                  {saving ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>

              {/* Şifre değiştirme */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">🔒 Şifre Değiştir</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Şifre</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="En az 6 karakter"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre (Tekrar)</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {passwordError && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{passwordError}</p>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-700 text-sm">✓ Şifre değiştirildi</p>
                  </div>
                )}

                <button
                  onClick={handlePasswordChange}
                  disabled={passwordSaving}
                  className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium"
                >
                  {passwordSaving ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
