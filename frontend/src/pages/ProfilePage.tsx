import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
      setError(t('profile.profileLoadError'));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError(t('profile.passwordFillAll'));
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError(t('profile.passwordMinLength'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t('profile.passwordMismatch'));
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
      setPasswordError(err.response?.data?.detail || t('profile.passwordChangeError'));
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
      setError(t('profile.profileUpdateError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">👤 {t('profile.title')}</h1>
            <p className="text-gray-600 mt-1">{t('profile.subtitle')}</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-700">{t('common.loading')}</p>
            </div>
          ) : error && !profile ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 font-medium">❌ {t('common.error')}</p>
              <p className="text-red-600 text-sm mt-2">{error}</p>
              <button
                onClick={fetchProfile}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                {t('common.tryAgain')}
              </button>
            </div>
          ) : profile ? (
            <>
              {/* Değiştirilemeyen hesap bilgileri */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.accountInfo')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">{t('profile.email')}</p>
                    <p className="text-gray-900 font-medium">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">{t('profile.username')}</p>
                    <p className="text-gray-900 font-medium">{profile.username}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">{t('profile.fullName')}</p>
                    <p className="text-gray-900 font-medium">{profile.full_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">{t('profile.memberSince')}</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(profile.created_at).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Düzenlenebilir çiftlik bilgileri */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.farmInfo')}</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.region')}</label>
                    <input
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder={t('profile.regionPlaceholder')}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.phone')}</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('profile.phonePlaceholder')}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('profile.farmSize')}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={farmSizeHectares}
                      onChange={(e) => setFarmSizeHectares(e.target.value)}
                      placeholder={t('profile.farmSizePlaceholder')}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.primaryCrops')}</label>
                    <input
                      type="text"
                      value={primaryCrops}
                      onChange={(e) => setPrimaryCrops(e.target.value)}
                      placeholder={t('profile.primaryCropsPlaceholder')}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('profile.primaryCropsHelp')}</p>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {saveSuccess && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-700 text-sm">{t('profile.profileUpdated')}</p>
                  </div>
                )}

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium"
                >
                  {saving ? t('common.loading') : t('common.save')}
                </button>
              </div>

              {/* Şifre değiştirme */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">🔒 {t('profile.changePassword')}</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.currentPassword')}</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.newPassword')}</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={t('profile.newPasswordHelp')}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.confirmPassword')}</label>
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
                    <p className="text-green-700 text-sm">{t('profile.passwordChanged')}</p>
                  </div>
                )}

                <button
                  onClick={handlePasswordChange}
                  disabled={passwordSaving}
                  className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium"
                >
                  {passwordSaving ? t('profile.passwordChanging') : t('profile.changePasswordButton')}
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
