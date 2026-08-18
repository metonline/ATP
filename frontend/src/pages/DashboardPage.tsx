import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../store/auth';

interface Parcel {
  id: number;
  parcel_name: string;
  area_hectares: number;
  centroid_lat: number;
  centroid_lon: number;
  marked_at: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
            <h1 className="text-3xl font-bold text-gray-900 text-center">
              {t('dashboard.subtitle')}
            </h1>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Parcels Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{t('dashboard.statParcels')}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.parcel_count}</p>
                </div>
                <div className="text-4xl">🌾</div>
              </div>
            </div>

            {/* Total Area Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{t('dashboard.statTotalArea')}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total_area}</p>
                  <p className="text-xs text-gray-500 mt-1">{t('common.hectares')}</p>
                </div>
                <div className="text-4xl">📐</div>
              </div>
            </div>

            {/* Satellite Data Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{t('dashboard.statSatelliteData')}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{t('dashboard.statReady')}</p>
                  <p className="text-xs text-gray-500 mt-1">Sentinel-2</p>
                </div>
                <div className="text-4xl">🛰️</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.quickActions')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/map"
                className="flex items-center gap-4 p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg hover:shadow-md transition"
              >
                <div className="text-2xl">🗺️</div>
                <div>
                  <p className="font-medium text-gray-900">{t('dashboard.qaMapTitle')}</p>
                  <p className="text-xs text-gray-600">{t('dashboard.qaMapDesc')}</p>
                </div>
              </Link>

              <Link
                to="/parcels"
                className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:shadow-md transition"
              >
                <div className="text-2xl">📋</div>
                <div>
                  <p className="font-medium text-gray-900">{t('dashboard.qaParcelsTitle')}</p>
                  <p className="text-xs text-gray-600">{t('dashboard.qaParcelsDesc')}</p>
                </div>
              </Link>

              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg opacity-50">
                <div className="text-2xl">📊</div>
                <div>
                  <p className="font-medium text-gray-900">{t('dashboard.qaAnalysisTitle')}</p>
                  <p className="text-xs text-gray-600">{t('dashboard.qaComingSoon')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Parcels */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.recentParcels')}</h2>

            {loading ? (
              <p className="text-gray-600">{t('common.loading')}</p>
            ) : parcels.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-3">{t('dashboard.noParcels')}</p>
                <Link
                  to="/map"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium text-sm"
                >
                  {t('dashboard.goToMap')}
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">
                        {t('dashboard.tableParcel')}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">
                        {t('dashboard.tableArea')}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">
                        {t('dashboard.tableLocation')}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">
                        {t('dashboard.tableAction')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {parcels.slice(0, 5).map((parcel) => (
                      <tr
                        key={parcel.id}
                        onClick={() => navigate('/map', { state: { editingParcelId: parcel.id } })}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="py-3 px-4 text-gray-900 font-medium">{parcel.parcel_name}</td>
                        <td className="py-3 px-4 text-gray-600">{parcel.area_hectares}</td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
                          {parcel.centroid_lat.toFixed(3)}, {parcel.centroid_lon.toFixed(3)}
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            to={`/parcels/${parcel.id}/satellite`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            {t('dashboard.satelliteLink')}
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
                  {t('dashboard.showAll')}
                </Link>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">💡 {t('dashboard.nextStepsTitle')}</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>✓ <strong>{t('dashboard.nextStep1Title')}</strong> {t('dashboard.nextStep1Desc')}</li>
              <li>✓ <strong>{t('dashboard.nextStep2Title')}</strong> {t('dashboard.nextStep2Desc')}</li>
              <li>✓ <strong>{t('dashboard.nextStep3Title')}</strong> {t('dashboard.nextStep3Desc')}</li>
              <li>✓ <strong>{t('dashboard.nextStep4Title')}</strong> {t('dashboard.nextStep4Desc')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
