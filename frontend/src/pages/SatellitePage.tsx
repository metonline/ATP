import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../store/auth";

interface SatelliteData {
  id: number;
  parcel_id: number;
  status: string;
  url: string | null;
  mean_ndvi: number | null;
  ndvi_url: string | null;
  mean_ndre: number | null;
  ndre_url: string | null;
  mean_ndmi: number | null;
  ndmi_url: string | null;
  mean_evi: number | null;
  evi_url: string | null;
  mean_savi: number | null;
  savi_url: string | null;
  mean_gndvi: number | null;
  gndvi_url: string | null;
  error: string | null;
  created_at: string;
}

type IndexKey = "ndvi" | "ndre" | "ndmi" | "evi" | "savi" | "gndvi";

interface LayerDef {
  key: "rgb" | IndexKey;
  labelKey: string;
  icon: string;
  descKey: string;
}

const LAYERS: LayerDef[] = [
  { key: "rgb", labelKey: "satellite.layerRgb", icon: "🖼️", descKey: "satellite.descRgb" },
  { key: "ndvi", labelKey: "satellite.layerNdvi", icon: "🌱", descKey: "satellite.descNdvi" },
  { key: "ndre", labelKey: "satellite.layerNdre", icon: "🍃", descKey: "satellite.descNdre" },
  { key: "ndmi", labelKey: "satellite.layerNdmi", icon: "💧", descKey: "satellite.descNdmi" },
  { key: "evi", labelKey: "satellite.layerEvi", icon: "🌿", descKey: "satellite.descEvi" },
  { key: "savi", labelKey: "satellite.layerSavi", icon: "🌾", descKey: "satellite.descSavi" },
  { key: "gndvi", labelKey: "satellite.layerGndvi", icon: "🍀", descKey: "satellite.descGndvi" },
];

function getVegetationStatus(value: number): { labelKey: string; bg: string; border: string; text: string } {
  if (value < 0.2) {
    return { labelKey: "satellite.statusBareSoil", bg: "bg-red-50", border: "border-red-200", text: "text-red-700" };
  } else if (value < 0.4) {
    return { labelKey: "satellite.statusWeak", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" };
  } else if (value < 0.6) {
    return { labelKey: "satellite.statusModerate", bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700" };
  } else if (value < 0.8) {
    return { labelKey: "satellite.statusHealthy", bg: "bg-green-50", border: "border-green-200", text: "text-green-700" };
  } else {
    return { labelKey: "satellite.statusVeryDense", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" };
  }
}

function getNdreStatus(value: number): { labelKey: string; bg: string; border: string; text: string } {
  if (value < 0.1) {
    return { labelKey: "satellite.statusNdreLow", bg: "bg-red-50", border: "border-red-200", text: "text-red-700" };
  } else if (value < 0.2) {
    return { labelKey: "satellite.statusNdreModerate", bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700" };
  } else if (value < 0.3) {
    return { labelKey: "satellite.statusNdreGood", bg: "bg-green-50", border: "border-green-200", text: "text-green-700" };
  } else {
    return { labelKey: "satellite.statusNdreHigh", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" };
  }
}

function getNdmiStatus(value: number): { labelKey: string; bg: string; border: string; text: string } {
  if (value < -0.2) {
    return { labelKey: "satellite.statusNdmiVeryDry", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" };
  } else if (value < 0) {
    return { labelKey: "satellite.statusNdmiDry", bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700" };
  } else if (value < 0.2) {
    return { labelKey: "satellite.statusNdmiNormal", bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700" };
  } else if (value < 0.4) {
    return { labelKey: "satellite.statusNdmiMoist", bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-700" };
  } else {
    return { labelKey: "satellite.statusNdmiVeryMoist", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" };
  }
}

function getIndexStatus(key: IndexKey, value: number): { labelKey: string; bg: string; border: string; text: string } {
  if (key === "ndre") return getNdreStatus(value);
  if (key === "ndmi") return getNdmiStatus(value);
  return getVegetationStatus(value); // ndvi, evi, savi, gndvi — hepsi benzer bitki-sağlığı ölçeğinde
}

export default function SatellitePage() {
  const params = useParams();
  const parcelId = params.parcelId;
  const { t } = useTranslation();

  const [satelliteData, setSatelliteData] = useState<SatelliteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [activeLayer, setActiveLayer] = useState<LayerDef["key"]>("rgb");

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

      // Bu parsel için hiç fetch yapılmamışsa (backend "No image yet" ile
      // işaretliyor), kullanıcı butona basmadan otomatik olarak ilk
      // görüntüyü iste.
      if (response.data.status === "pending" && response.data.error === "No image yet") {
        requestNewImage();
      }
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
      setSatelliteData({
        id: 0, parcel_id: parseInt(parcelId || "0"), status: "pending",
        url: null, mean_ndvi: null, ndvi_url: null,
        mean_ndre: null, ndre_url: null, mean_ndmi: null, ndmi_url: null,
        mean_evi: null, evi_url: null, mean_savi: null, savi_url: null,
        mean_gndvi: null, gndvi_url: null,
        error: null, created_at: "",
      });

      // 6 endeks + RGB hesaplandığı için tek NDVI'ye göre daha uzun sürüyor.
      setTimeout(() => {
        fetchSatelliteImage();
        setRequesting(false);
      }, 45000);
    } catch (err) {
      console.error("Error requesting image:", err);
      setRequesting(false);
    }
  };

  const getLayerUrl = (key: LayerDef["key"]): string | null => {
    if (!satelliteData) return null;
    if (key === "rgb") return satelliteData.url;
    const urlField = `${key}_url` as keyof SatelliteData;
    return (satelliteData[urlField] as string | null) || null;
  };

  const getLayerMean = (key: LayerDef["key"]): number | null => {
    if (!satelliteData || key === "rgb") return null;
    const meanField = `mean_${key}` as keyof SatelliteData;
    const val = satelliteData[meanField];
    return typeof val === "number" ? val : null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">📡 {t('satellite.title')}</h1>
            <p className="text-gray-600 mt-1">{t('satellite.subtitle')}</p>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-700">{t('common.loading')}</p>
            </div>
          ) : satelliteData ? (
            <div className="space-y-4">
              {satelliteData.status === "success" ? (
                <div>
                  {/* Katman seçici sekmeler */}
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                    {LAYERS.map((layer) => (
                      <button
                        key={layer.key}
                        onClick={() => setActiveLayer(layer.key)}
                        className={`shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                          activeLayer === layer.key
                            ? "bg-emerald-600 text-white"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {layer.icon} {t(layer.labelKey)}
                      </button>
                    ))}
                  </div>

                  {(() => {
                    const layer = LAYERS.find((l) => l.key === activeLayer)!;
                    const layerUrl = getLayerUrl(activeLayer);
                    const layerMean = getLayerMean(activeLayer);

                    return (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                              {layer.icon} {t(layer.labelKey)}
                            </h2>
                            <p className="text-sm text-gray-500">{t(layer.descKey)}</p>
                          </div>
                          <button
                            onClick={requestNewImage}
                            disabled={requesting}
                            className="text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 px-3 py-1.5 rounded shrink-0"
                          >
                            {requesting ? t('satellite.refreshing') : `🔄 ${t('satellite.refresh')}`}
                          </button>
                        </div>

                        {layerUrl ? (
                          <img src={layerUrl} alt={t(layer.labelKey)} className="w-full rounded-lg shadow" />
                        ) : (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500 text-sm">
                            {t('satellite.noLayerData')}
                          </div>
                        )}

                        <p className="text-sm text-gray-600 mt-2">
                          📅 {new Date(satelliteData.created_at).toLocaleString("tr-TR")}
                        </p>

                        {activeLayer !== "rgb" && layerMean !== null && (() => {
                          const status = getIndexStatus(activeLayer as IndexKey, layerMean);
                          return (
                            <div className={`mt-3 rounded-lg p-4 border ${status.bg} ${status.border}`}>
                              <p className={`font-medium ${status.text}`}>
                                {t('satellite.average')} {t(layer.labelKey)}: {layerMean.toFixed(2)} — {t(status.labelKey)}
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })()}
                </div>
              ) : satelliteData.status === "error" ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 font-medium">❌ {t('satellite.errorTitle')}</p>
                  <p className="text-red-600 text-sm mt-2">{satelliteData.error}</p>
                  <button onClick={requestNewImage} disabled={requesting} className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded">
                    {requesting ? t('satellite.requesting') : t('satellite.tryAgainRequest')}
                  </button>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-700">⏳ {t('satellite.processing')}</p>
                  <button onClick={requestNewImage} disabled={requesting} className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded">
                    {requesting ? t('satellite.requesting') : t('satellite.requestAgain')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700">{t('satellite.notFound')}</p>
              <button onClick={requestNewImage} disabled={requesting} className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded">
                {requesting ? t('satellite.requesting') : t('satellite.requestFirst')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
