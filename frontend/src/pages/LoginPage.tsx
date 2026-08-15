import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, error, loading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setLocalError(err.message || 'Login failed');
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Giriş Yap</h2>

          {/* Error Messages */}
          {(localError || error) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {localError || error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="ornek@tarima.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Şifre
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Hesabın yok mu?{' '}
            <Link to="/register" className="text-green-600 hover:underline font-medium">
              Üye Ol
            </Link>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
          <p className="font-medium mb-2">🧪 Test Hesabı:</p>
          <p>Email: <code className="bg-blue-100 px-2 py-1 rounded">test@farm.com</code></p>
          <p>Şifre: <code className="bg-blue-100 px-2 py-1 rounded">password123</code></p>
        </div>
      </div>
    </div>
  );
}
