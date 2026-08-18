import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/auth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { register } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    fullName: "",
    kvkkConsent: false,
  });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!formData.email || !formData.username || !formData.password || !formData.fullName) {
      setLocalError("Lütfen tüm alanları doldurunuz");
      return;
    }

    if (!formData.kvkkConsent) {
      setLocalError(t("register.kvkkConsent"));
      return;
    }

    if (formData.password.length < 6) {
      setLocalError(`${t("register.password")} minimum 6 characters`);
      return;
    }

    try {
      setLoading(true);
      const response = await register(
        formData.email,
        formData.username,
        formData.password,
        formData.fullName,
        formData.kvkkConsent
      );

      if (response?.status === "pending_approval") {
        navigate("/login", {
          state: { message: "Registration pending admin approval" },
        });
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setLocalError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🌾 IA Platform</h1>
          <p className="text-gray-600">Precision Agriculture Intelligence</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("register.title")}</h2>

          {localError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                {t("register.fullName")}
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t("register.email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                {t("register.username")}
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t("register.password")}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="kvkkConsent"
                name="kvkkConsent"
                checked={formData.kvkkConsent}
                onChange={handleChange}
                className="mt-1 h-4 w-4"
              />
              <label htmlFor="kvkkConsent" className="ml-2 text-sm text-gray-700">
                <a href="/privacy-policy" className="text-green-600 font-medium">
                  {t("register.kvkkConsent")}
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-green-600 text-white rounded-lg"
            >
              {t("register.button")}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link to="/login" className="text-green-600">
              {t("register.alreadyMember")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
