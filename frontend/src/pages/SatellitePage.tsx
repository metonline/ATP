import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../store/auth";

interface SatelliteData {
  id: number;
  parcel_id: number;
  status: string;
  url: string | null;
  error: string | null;
  created_at: string;
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
      setSatelliteData({ id: 0, parcel_id: parseInt(parcelId || "0"), status: "pending", url: null, error: null, created_at: "" });
      
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
                <div>
                  <img src={satelliteData.url || ""} alt="Sentinel-2" className="w-full rounded-lg shadow" />
                  <p className="text-sm text-gray-600 mt-2">📅 {new Date(satelliteData.created_at).toLocaleString("tr-TR")}</p>
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

