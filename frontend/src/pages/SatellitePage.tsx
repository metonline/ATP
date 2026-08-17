import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../store/auth";

interface SatelliteData {
  id: number;
  parcel_id: number;
  status: string;
  url: string | null;
  mean_ndvi: number | null;
  ndvi_url: string | null;
  error: string | null;
  created_at: string;
}

function getNdviStatus(value: number): { label: string; bg: string; border: string; text: string } {
  if (value < 0.2) {
    return { label: "Çıplak toprak / bitki örtüsü yok", bg: "bg-red-50", border: "border-red-200", text: "text-red-700" };
  } else if (value < 0.4) {
    return { label: "Zayıf bitki örtüsü", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" };
  } else if (value < 0.6) {
    return { label: "Orta yoğunlukta bitki örtüsü", bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700" };
  } else if (value < 0.8) {
    return { label: "Sağlıklı bitki örtüsü", bg: "bg-green-50", border: "border-green-200", text: "text-green-700" };
  } else {
    return { label: "Çok yoğun / sağlıklı bitki örtüsü", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" };
  }
}

export default function SatellitePage() {
  const params = useParams();
  const parcelId = params.parcelId;
  
  const [satelliteData, setSatelliteData] = useState<SatelliteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (parcelId) {
      fetchSatelliteImage();
    }
  }, [parcelId]);

  const fetchSatelliteImage = async () => {
    try {
      setLoading(true);
      const url = `/api/parcels/${parcelId}/satellite`;
      const response = await api.get(url);
      setSatelliteData(response.data);
    } catch (err) {
      console.error("Error fetching satellite:", err);
    } finally {
      setLoading(false);
    }
  };

  const requestNewImage = async () => {
    try {
      setRequesting(true);
      const url = `/api/parcels/${parcelId}/satellite/fetch`;
      await api.post(url);
      setSatelliteData({ id: 0, parcel_id: parseInt(parcelId || "0"), status: "pending", url: null, mean_ndvi: null, ndvi_url: null, error: null, created_at: "" });
      
      setTimeout(() => {
        fetchSatelliteImage();
        setRequesting(false);
      }, 30000);
    } catch (err) {
      console.error("Error requesting image:", err);
      setRequesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">📡 Uydu Görüntüleri</h1>
            <p className="text-gray-600 mt-1">Sentinel-2 uydu görüntüleri</p>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-700">Yükleniyor...</p>
            </div>
          ) : satelliteData ? (
            <div className="space-y-4">
              {satelliteData.status === "success" ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">🖼️ Gerçek Renkli Görüntü</h2>
                    <img src={satelliteData.url || ""} alt="Sentinel-2 RGB" className="w-full rounded-lg shadow" />
                    <p className="text-sm text-gray-600 mt-2">📅 {new Date(satelliteData.created_at).toLocaleString("tr-TR")}</p>
                  </div>

                  {satelliteData.ndvi_url && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">🌱 NDVI - Bitki Sağlığı Analizi</h2>
                      <img src={satelliteData.ndvi_url} alt="NDVI" className="w-full rounded-lg shadow" />
                      {satelliteData.mean_ndvi !== null && satelliteData.mean_ndvi !== undefined && (() => {
                        const ndviStatus = getNdviStatus(satelliteData.mean_ndvi);
                        return (
                          <div className={`mt-3 rounded-lg p-4 border ${ndviStatus.bg} ${ndviStatus.border}`}>
                            <p className={`font-medium ${ndviStatus.text}`}>
                              Ortalama NDVI: {satelliteData.mean_ndvi.toFixed(2)} — {ndviStatus.label}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ) : satelliteData.status === "error" ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 font-medium">❌ Hata</p>
                  <p className="text-red-600 text-sm mt-2">{satelliteData.error}</p>
                  <button onClick={requestNewImage} disabled={requesting} className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded">
                    {requesting ? "İsteniyor..." : "Tekrar İste"}
                  </button>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-700">⏳ Görüntü işleniyor...</p>
                  <button onClick={requestNewImage} disabled={requesting} className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded">
                    {requesting ? "İsteniyor..." : "Yeniden İste"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700">Uydu görüntüsü bulunamadı</p>
              <button onClick={requestNewImage} disabled={requesting} className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded">
                {requesting ? "İsteniyor..." : "İlk Görüntüyü İste"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

