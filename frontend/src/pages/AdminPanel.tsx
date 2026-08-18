import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth';

interface PendingUser {
  id: number;
  email: string;
  full_name: string;
  region: string;
  created_at: string;
  kvkk_consent: boolean;
  approval_notes: string | null;
}

export default function AdminPanel() {
  const { token } = useAuthStore();
  const [pending, setPending] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching pending users...", token);
      const response = await fetch(`${API_URL}/api/admin/pending-users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          setError('Admin erişimi yok');
        } else {
          setError('Hata oluştu');
        }
        return;
      }

      const data = await response.json();
      setPending(data.users);
    } catch (err: any) {
      setError(err.message || 'Veri yüklemesi başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: number) => {
    if (!window.confirm('Bu kullanıcıyı onaylamak istediğinize emin misiniz?')) {
      return;
    }

    try {
      setApproving(true);
      const response = await fetch(`${API_URL}/api/admin/approve-user/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: 'Your account has been approved!' })
      });

      if (!response.ok) {
        throw new Error('Onaylama başarısız');
      }

      setSuccessMessage('Kullanıcı başarıyla onaylandı');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Refresh list
      setPending(pending.filter(u => u.id !== userId));
      setSelectedUser(null);
    } catch (err: any) {
      setError(err.message || 'Hata oluştu');
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (userId: number) => {
    if (!rejectionReason.trim()) {
      setError('Lütfen reddetme nedenini yazınız');
      return;
    }

    if (!window.confirm('Bu kullanıcıyı reddetmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      setApproving(true);
      const response = await fetch(`${API_URL}/api/admin/reject-user/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: rejectionReason })
      });

      if (!response.ok) {
        throw new Error('Reddetme başarısız');
      }

      setSuccessMessage('Kullanıcı reddedildi');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Refresh list
      setPending(pending.filter(u => u.id !== userId));
      setSelectedUser(null);
      setRejectionReason('');
    } catch (err: any) {
      setError(err.message || 'Hata oluştu');
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Beklemede olan kullanıcı onayları</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-700">
            {successMessage}
          </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Users List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Beklemede ({pending.length})
                </h2>
              </div>

              {loading ? (
                <div className="p-6 text-center text-gray-600">
                  Yükleniyor...
                </div>
              ) : pending.length === 0 ? (
                <div className="p-6 text-center text-gray-600">
                  Beklemede olan kullanıcı yok ✓
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {pending.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                        selectedUser?.id === user.id ? 'bg-green-50 border-l-4 border-green-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{user.full_name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Kaydolma: {new Date(user.created_at).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <div className="text-right">
                          {user.kvkk_consent && (
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                              KVKK ✓
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Details & Actions */}
          {selectedUser && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Kullanıcı Detayları</h2>

              <div className="space-y-3 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Ad Soyad</label>
                  <p className="text-gray-900">{selectedUser.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Bölge</label>
                  <p className="text-gray-900">{selectedUser.region || '—'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Kaydolma Tarihi</label>
                  <p className="text-gray-900">
                    {new Date(selectedUser.created_at).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">KVKK Onayı</label>
                  <p className="text-green-600 font-medium">
                    {selectedUser.kvkk_consent ? '✓ Kabul Etti' : '✗ Kabul Etmedi'}
                  </p>
                </div>
              </div>

              {/* Rejection Reason (if rejecting) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reddetme Sebebi (varsa)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Örn: Eksik bilgi, uygunsuz alan..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => handleApprove(selectedUser.id)}
                  disabled={approving}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50"
                >
                  ✓ Onayla
                </button>
                <button
                  onClick={() => handleReject(selectedUser.id)}
                  disabled={approving || !rejectionReason.trim()}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition disabled:opacity-50"
                >
                  ✗ Reddet
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
