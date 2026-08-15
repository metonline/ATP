import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../store/auth';
import { useAuthStore } from '../store/auth';

interface Parcel {
  id: number;
  parcel_name: string;
  area_hectares: number;
  centroid_lat: number;
  centroid_lon: number;
  marked_at: string;
}

export default function DashboardPage() {
  const { farmer } = useAuthStore();
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_area: 0, parcel_count: 0 });

  useEffect(() => {
    loadParcels();
  }, []);

  const loadParcels = async () => {
    try {
      const response = await api.get('/api/parcels');
      setParcels(response.data);

      // Calculate stats
      const total_area = response.data.reduce((sum: number, p: Parcel) => sum + p.area_hectares, 0);
      setStats({
        total_area: Math.round(total_area * 100) / 100,
        parcel_count: response.data.length,
      });
    } catch (err) {
      console.error('Failed to load parcels');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              👋 Hoş Geldiniz, {farmer?.username}!
            </h1>
            <p className="text-gray-600 mt-2">
              IA Platform - Hassas Tarım Zekası Sistemi
            </p>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Parcels Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Parsellerim</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.parcel_count}</p>
                </div>
                <div className="text-4xl">🌾</div>
              </div>
            </div>

            {/* Total Area Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Toplam Alan</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total_area}</p>
                  <p className="text-xs text-gray-500 mt-1">hektarInstrumented</p>
                </div>
                <div className="text-4xl">📐</div>
              </div>
            </div>

            {/* Satellite Data Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Uydu Verisi</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">Hazır</p>
                  <p className="text-xs text-gray-500 mt-1">Sentinel-2</p>
                </div>
                <div className="text-4xl">🛰️</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/map"
                className="flex items-center gap-4 p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg hover:shadow-md transition"
              >
                <div className="text-2xl">🗺️</div>
                <div>
                  <p className="font-medium text-gray-900">Harita</p>
                  <p className="text-xs text-gray-600">Parsel İşaretle</p>
                </div>
              </Link>

              <Link
                to="/parcels"
                className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:shadow-md transition"
              >
                <div className="text-2xl">📋</div>
                <div>
                  <p className="font-medium text-gray-900">Parselerim</p>
                  <p className="text-xs text-gray-600">Listesi & Detaylar</p>
                </div>
              </Link>

              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg opacity-50">
                <div className="text-2xl">📊</div>
                <div>
                  <p className="font-medium text-gray-900">Analiz</p>
                  <p className="text-xs text-gray-600">Yakında...</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Parcels */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Son Eklenen Parseller</h2>

            {loading ? (
              <p className="text-gray-600">Yükleniyor...</p>
            ) : parcels.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-3">Henüz parsel eklemediniz</p>
                <Link
                  to="/map"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium text-sm"
                >
                  Haritaya Git →
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">
                        Parsel
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">
                        Alan (ha)
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">
                        Konum
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">
                        İşlem
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {parcels.slice(0, 5).map((parcel) => (
                      <tr key={parcel.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900 font-medium">{parcel.parcel_name}</td>
                        <td className="py-3 px-4 text-gray-600">{parcel.area_hectares}</td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
                          {parcel.centroid_lat.toFixed(3)}, {parcel.centroid_lon.toFixed(3)}
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            to={`/parcels/${parcel.id}/satellite`}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            Uydu →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {parcels.length > 5 && (
              <div className="mt-4 text-center">
                <Link
                  to="/parcels"
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Tümünü Göster →
                </Link>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">💡 Sonraki Adımlar</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>✓ <strong>Hesaptan Çık:</strong> Oturum kapatmak için sağ üstteki menüyü kullanın</li>
              <li>✓ <strong>Parsel Ekle:</strong> Harita sayfasında tıklayarak yeni parsel işaretleyin</li>
              <li>✓ <strong>Uydu Görüntüsü:</strong> Parseleriniz için Sentinel-2 verisini indirin</li>
              <li>✓ <strong>NDVI Analizi:</strong> Bitki sağlığını görmek için NDVI endeksini kullanın</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
