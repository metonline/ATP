import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import { api } from '../store/auth';

interface Parcel {
  id: number;
  parcel_name: string;
  area_hectares: number;
  centroid_lat: number;
  centroid_lon: number;
  marked_at: string;
  land_cover_classification: string;
  geometry_geojson?: string;
}

export default function ParcelPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);

  useEffect(() => {
    loadParcels();
  }, []);

  const loadParcels = async () => {
    try {
      const response = await api.get('/api/parcels');
      setParcels(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load parcels');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">📋 Parselerim</h1>
            <p className="text-gray-600 mt-1">Tüm parsellerinizi burada görebilirsiniz</p>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              ❌ {error}
            </div>
          )}

          {parcels.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <p className="text-blue-900 font-medium mb-3">Henüz parsel yok</p>
              <p className="text-blue-800 text-sm mb-4">
                Harita sayfasında tıklayarak yeni parsel işaretleyebilirsiniz.
              </p>
              <Link
                to="/map"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium"
              >
                Haritaya Git →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parcels.map((parcel) => (
                <div
                  key={parcel.id}
                  onClick={() => setSelectedParcel(parcel)}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer"
                >
                  {/* Header - Clickable to edit */}
                  <Link
                    to="/map"
                    state={{ editingParcelId: parcel.id }}
                    className="block bg-gradient-to-r from-green-50 to-blue-50 border-b px-4 py-3 hover:from-green-100 hover:to-blue-100 transition"
                  >
                    <h3 className="font-semibold text-blue-600 hover:underline">{parcel.parcel_name}</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(parcel.marked_at).toLocaleDateString('tr-TR')}
                    </p>
                  </Link>

                  {/* Content */}
                  <div className="px-4 py-4 space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">Alan</p>
                      <p className="text-lg font-semibold text-gray-900">{parcel.area_hectares} ha</p>
                    </div>

                    {parcel.land_cover_classification && (
                      <div>
                        <p className="text-xs text-gray-600">Ürün Sınıfı</p>
                        <p className="text-sm text-gray-900">{parcel.land_cover_classification}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-gray-600">Konum</p>
                      <p className="text-xs font-mono text-gray-900">
                        {parcel.centroid_lat.toFixed(4)}, {parcel.centroid_lon.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-gray-50 border-t px-4 py-3">
                    <Link
                      to={`/parcels/${parcel.id}/satellite`}
                      className="inline-block text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Uydu Görüntülerini Gör →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Parcel Detail Modal */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedParcel.parcel_name}</h2>
                  <p className="text-gray-600 mt-1">
                    📍 {selectedParcel.centroid_lat.toFixed(6)}, {selectedParcel.centroid_lon.toFixed(6)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedParcel(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Mini Map with Polygon */}
              {selectedParcel.geometry_geojson && (
                <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 h-64">
                  <MapContainer
                    center={[selectedParcel.centroid_lat, selectedParcel.centroid_lon]}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      attribution='&copy; Esri'
                    />
                    {(() => {
                      try {
                        const geojson = JSON.parse(selectedParcel.geometry_geojson!);
                        if (geojson.type === 'Polygon' && geojson.coordinates) {
                          const polygonCoords = geojson.coordinates[0].map((coord: [number, number]) => [coord[1], coord[0]]);
                          return (
                            <Polygon
                              positions={polygonCoords}
                              pathOptions={{
                                color: '#3b82f6',
                                weight: 3,
                                opacity: 0.8,
                                fill: true,
                                fillColor: '#3b82f6',
                                fillOpacity: 0.2
                              }}
                            />
                          );
                        }
                      } catch (e) {
                        return null;
                      }
                    })()}
                  </MapContainer>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Alan</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedParcel.area_hectares} ha</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Durum</p>
                  <p className="text-2xl font-bold text-green-600">✓ Aktif</p>
                </div>
              </div>

              {selectedParcel.land_cover_classification && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-sm font-medium text-gray-700">🌾 Ürün Sınıfı</p>
                  <p className="text-gray-600 mt-1">{selectedParcel.land_cover_classification}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Link
                  to="/map"
                  state={{ editingParcelId: selectedParcel.id }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium text-center"
                >
                  🗺️ Haritada Düzenle
                </Link>
                <button
                  onClick={async () => {
                    if (window.confirm(`"${selectedParcel.parcel_name}" parselini silmek istediğinize emin misiniz?`)) {
                      try {
                        await api.delete(`/api/parcels/${selectedParcel.id}`);
                        setSelectedParcel(null);
                        loadParcels();
                      } catch (err: any) {
                        alert('Parsel silinirken hata: ' + (err.response?.data?.detail || err.message));
                      }
                    }
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium"
                >
                  🗑️ Sil
                </button>
                <button
                  onClick={() => setSelectedParcel(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded font-medium"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
