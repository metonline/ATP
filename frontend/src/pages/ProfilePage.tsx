import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../store/auth";
import { useAuthStore } from "../store/auth";

interface ProfileData {
  id: number;
  username: string;
  full_name: string;
  phone?: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { farmer } = useAuthStore();
  
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!farmer) {
      navigate("/login");
      return;
    }
    loadProfile();
  }, [farmer, navigate]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/auth/profile");
      setProfileData(response.data);
      setFullName(response.data.full_name);
      setPhone(response.data.phone || "");
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Profil yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setError("");
      setUpdating(true);
      
      const response = await api.put("/api/auth/profile", {
        full_name: fullName,
        phone: phone || null
      });
      
      setProfileData(response.data);
      setSuccess("✓ Profil güncellendi");
      setEditMode(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Güncelleme başarısız");
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    setError("");
    
    if (newPassword !== confirmPassword) {
      setError("Yeni şifreler eşleşmiyor");
      return;
    }
    
    if (newPassword.length < 6) {
      setError("Şifre en az 6 karakter olmalı");
      return;
    }
    
    try {
      setUpdating(true);
      await api.post("/api/auth/change-password", {
        old_password: oldPassword,
        new_password: newPassword
      });
      
      setSuccess("✓ Şifre başarıyla değiştirildi");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMode(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Şifre değiştirilemedi");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">👤 Profil</h1>
            <p className="text-gray-600 mt-1">Hesap bilgilerini yönet</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>}
          {success && <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">{success}</div>}

          {/* Profil Bilgileri */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Profil Bilgileri</h2>
              <button
                onClick={() => setEditMode(!editMode)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {editMode ? "İptal" : "Düzenle"}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Değiştirilemiyor)</label>
                <input
                  type="email"
                  value={profileData?.username || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!editMode}
                  className={`w-full px-4 py-2 border rounded-lg ${
                    editMode ? "border-gray-300" : "border-gray-300 bg-gray-50 text-gray-600"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon (İsteğe bağlı)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!editMode}
                  placeholder="+90 5XX XXX XXXX"
                  className={`w-full px-4 py-2 border rounded-lg ${
                    editMode ? "border-gray-300" : "border-gray-300 bg-gray-50 text-gray-600"
                  }`}
                />
              </div>

              {editMode && (
                <button
                  onClick={handleUpdateProfile}
                  disabled={updating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium"
                >
                  {updating ? "Kaydediliyor..." : "Kaydet"}
                </button>
              )}
            </div>
          </div>

          {/* Şifre Değişikliği */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Şifre Değişikliği</h2>
              <button
                onClick={() => setPasswordMode(!passwordMode)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {passwordMode ? "İptal" : "Değiştir"}
              </button>
            </div>

            {passwordMode && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Eski Şifre</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre (Tekrar)</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={updating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium"
                >
                  {updating ? "Değiştiriliyor..." : "Şifre Değiştir"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
