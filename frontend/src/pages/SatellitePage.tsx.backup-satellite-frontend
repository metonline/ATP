import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../store/auth';

interface SatelliteImage {
  id: number;
  acquisition_date: string;
  cloud_coverage_percent: number;
  source: string;
  mean_ndvi: number;
  tile_url_rgb: string;
  tile_url_ndvi: string;
}

export default function SatellitePage() {
  const { parcelId } = useParams<{ parcelId: string }>();
  const navigate = useNavigate();
  const [images, setImages] = useState<SatelliteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [parcelName, setParcelName] = useState('');

  useEffect(() => {
    if (parcelId) {
      loadData();
    }
  }, [parcelId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Get parcel info
      const parcelRes = await api.get(`/api/parcels/${parcelId}`);
      setParcelName(parcelRes.data.parcel_name);

      // Get satellite images
      const imagesRes = await api.get(`/api/parcels/${parcelId}/satellite-images`);
      setImages(imagesRes.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchData = async () => {
    try {
      setFetching(true);
      setError('');
      await api.post(`/api/parcels/${parcelId}/fetch-satellite-data`);

      // Reload images
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch satellite data');
    } finally {
      setFetching(false);
    }
  };

  const getNDVIColor = (ndvi: number) => {
    if (ndvi < 0) return 'bg-blue-500'; // Water
    if (ndvi < 0.3) return 'bg-yellow-600'; // Bare soil
    if (ndvi < 0.5) return 'bg-yellow-500'; // Weak vegetation
    if (ndvi < 0.7) return 'bg-lime-500'; // Moderate vegetation
    return 'bg-green-600'; // Strong vegetation
  };

  const getNDVILabel = (ndvi: number) => {
    if (ndvi < 0) return 'Su';
    if (ndvi < 0.3) return 'Çıplak Toprak';
    if (ndvi < 0.5) return 'Zayıf Bitki';
    if (ndvi < 0.7) return 'Orta Bitki';
    return 'Güçlü Bitki';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <button
              onClick={() => navigate('/map')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2"
            >
              ← Haritaya Dön
            </button>
            <h1 className="text-2xl font-bold text-gray-900">📡 Uydu Görüntüleri</h1>
            <p className="text-gray-600 mt-1">
              Parsel: <span className="font-semibold">{parcelName}</span>
            </p>
          </div>
        </div>

        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              ❌ {error}
            </div>
          )}

          {/* Fetch Data Button */}
          <div className="mb-6">
            <button
              onClick={handleFetchData}
              disabled={fetching}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium"
            >
              {fetching ? '⏳ Uydu Verisi Alınıyor...' : '🛰️ Uydu Verisi Indir'}
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Sentinel-2 verisini indir ve analize ekle. Bu işlem birkaç dakika sürebilir.
            </p>
          </div>

          {/* Images List */}
          {images.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <p className="text-blue-900 font-medium mb-2">📡 Henüz uydu görüntüsü yok</p>
              <p className="text-blue-800 text-sm">
                Yukarıdaki butona tıklayarak bu parselin Sentinel-2 uydu görüntülerini indirebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  {/* Image Header */}
                  <div className="bg-gray-100 border-b px-4 py-3">
                    <p className="font-semibold text-gray-900">
                      📅 {new Date(image.acquisition_date).toLocaleDateString('tr-TR')}
                    </p>
                    <p className="text-sm text-gray-600">
                      Kaynak: {image.source} • Bulut: {image.cloud_coverage_percent}%
                    </p>
                  </div>

                  {/* NDVI Status */}
                  <div className="px-4 py-4 border-b">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">NDVI (Bitki Sağlığı)</p>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold ${getNDVIColor(
                              image.mean_ndvi
                            )}`}
                          >
                            {image.mean_ndvi.toFixed(2)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {getNDVILabel(image.mean_ndvi)}
                            </p>
                            <p className="text-xs text-gray-600">
                              -1.0 (su) → 0.0 (toprak) → 1.0 (bitki)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Images */}
                  <div className="px-4 py-4 space-y-3">
                    {/* RGB */}
                    {image.tile_url_rgb && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">🌈 RGB (Renkli Görüntü)</p>
                        <a
                          href={image.tile_url_rgb}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm font-medium"
                        >
                          Görüntüyü Aç ↗
                        </a>
                      </div>
                    )}

                    {/* NDVI */}
                    {image.tile_url_ndvi && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">🌱 NDVI (Bitki Endeksi)</p>
                        <a
                          href={image.tile_url_ndvi}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm font-medium"
                        >
                          Görüntüyü Aç ↗
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="bg-gray-50 border-t px-4 py-3 text-xs text-gray-600">
                    <p>ID: {image.id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">ℹ️ NDVI Hakkında</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>
                <strong>NDVI</strong> (Normalized Difference Vegetation Index) = bitki sağlığının ölçüsü
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <strong>0.7 - 1.0</strong> = Çok Güçlü Bitki (Ideal)
                </li>
                <li>
                  <strong>0.5 - 0.7</strong> = Orta Seviye Bitki (İyi)
                </li>
                <li>
                  <strong>0.3 - 0.5</strong> = Zayıf Bitki (Sorun Var)
                </li>
                <li>
                  <strong>0.0 - 0.3</strong> = Çıplak Toprak (Bekleniyor)
                </li>
                <li>
                  <strong>&lt; 0.0</strong> = Su
                </li>
              </ul>
              <p className="mt-3">
                💡 <strong>İpucu:</strong> NDVI az olan alanlara dikkat edin. Bitki stresini gösterebilir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
