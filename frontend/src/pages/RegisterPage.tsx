import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, error, loading } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    fullName: '',
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.email || !formData.username || !formData.password || !formData.fullName) {
      setLocalError('Lütfen tüm alanları doldurunuz');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    try {
      await register(formData.email, formData.username, formData.password, formData.fullName);
      navigate('/dashboard');
    } catch (err: any) {
      setLocalError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🌾 IA Platform</h1>
          <p className="text-gray-600">Precision Agriculture Intelligence</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Üye Ol</h2>

          {/* Error Messages */}
          {(localError || error) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {localError || error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Ad Soyad
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ahmet Yılmaz"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="ornek@tarima.com"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="ahmetyilmaz"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Şifre
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Üye oluşturuluyor...' : 'Üye Ol'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Zaten hesabın var mı?{' '}
            <Link to="/login" className="text-green-600 hover:underline font-medium">
              Giriş Yap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
