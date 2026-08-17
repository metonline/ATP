import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Polygon } from 'react-leaflet';
import L from 'leaflet';
import * as turf from '@turf/turf';
import * as EXIF from 'exif-js';
import { api } from '../store/auth';
import { useAuthStore } from '../store/auth';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Parcel {
  id: number;
  parcel_name: string;
  centroid_lat: number;
  centroid_lon: number;
  area_hectares: number;
  marked_at: string;
  geometry_geojson?: string;
}

interface PolygonPoint {
  lat: number;
  lng: number;
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function DragHandler({
  draggedPointIndex,
  onDragEnd,
  onPointMove,
}: {
  draggedPointIndex: number | null;
  onDragEnd: () => void;
  onPointMove: (lat: number, lng: number) => void;
}) {
  const map = useMap();
  useMapEvents({
    mousemove(e) {
      if (draggedPointIndex !== null) {
        onPointMove(e.latlng.lat, e.latlng.lng);
      }
    },
    mouseup() {
      if (draggedPointIndex !== null) {
        onDragEnd();
        if (map) map.dragging.enable();
      }
    },
  });
  return null;
}

function ZoomToParcel({
  lat,
  lng,
  enabled,
  trigger,
}: {
  lat: number | null;
  lng: number | null;
  enabled: boolean;
  trigger?: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng && enabled && map) {
      console.log('[ZOOM] Focusing on parcel:', lat, lng);
      map.flyTo([lat, lng], 17, { duration: 0.8 });
    }
  }, [lat, lng, enabled, map, trigger]);
  return null;
}

// Leaflet, harita mount olduğu andaki container boyutuna göre projeksiyonunu
// hesaplıyor. Grid/flex layout oturması, kenar panellerin (Parsel Düzenle vb.)
// açılıp kapanmasıyla container boyutu SONRADAN değişirse, Leaflet bundan
// haberdar olmuyor — harita "donuk" görünüyor, poligon dolgusu gerçek
// container boyutuyla uyuşmuyor. ResizeObserver ile her boyut değişiminde
// invalidateSize() çağırarak Leaflet'i güncel tutuyoruz.
function MapAutoResize() {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(container);

    // Mount anında da bir kez tetikle — ilk resize event'i bazı
    // tarayıcılarda kaçabiliyor.
    const initialTimer = setTimeout(() => map.invalidateSize(), 200);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(initialTimer);
    };
  }, [map]);
  return null;
}

export default function MapPage() {
  const { farmer, token } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [polygonPoints, setPolygonPoints] = useState<PolygonPoint[]>([]);
  const [flyTrigger, setFlyTrigger] = useState(0);
  const [selectedLat, setSelectedLat] = useState<number | null>(null);
  const [selectedLng, setSelectedLng] = useState<number | null>(null);
  const [parcelName, setParcelName] = useState('');
  const [area, setArea] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [drawingMode, setDrawingMode] = useState(false);

  const [searchMode, setSearchMode] = useState<'draw' | 'ada-parsel' | 'koordinat' | 'foto' | 'address'>('draw');
  const [adaNo, setAdaNo] = useState('');
  const [parselNo, setParselNo] = useState('');
  const [searchLat, setSearchLat] = useState('');
  const [searchLng, setSearchLng] = useState('');
  const [addressSearch, setAddressSearch] = useState('');
  const [draggedPointIndex, setDraggedPointIndex] = useState<number | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoExifData, setPhotoExifData] = useState<any>(null);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [isEditingParcel, setIsEditingParcel] = useState(false);
  const editingAttemptedRef = useRef(false);

  // ✅ FIX #1: Smart Point Insertion - Yeni noktayı kenarına ekle
  const insertPointSmartly = (
    points: PolygonPoint[],
    newLat: number,
    newLng: number
  ): PolygonPoint[] => {
    if (points.length < 2) {
      console.log('[INSERT] Less than 2 points, adding to end');
      return [...points, { lat: newLat, lng: newLng }];
    }

    const newPoint = turf.point([newLng, newLat]);
    let minDistance = Infinity;
    let closestEdgeIndex = -1;

    for (let i = 0; i < points.length; i++) {
      const pointA = points[i];
      const pointB = points[(i + 1) % points.length];

      const edgeLine = turf.lineString([
        [pointA.lng, pointA.lat],
        [pointB.lng, pointB.lat]
      ]);

      try {
        const snappedPoint = turf.nearestPointOnLine(edgeLine, newPoint);
        const distance = snappedPoint.properties.dist;

        if (distance < minDistance) {
          minDistance = distance;
          closestEdgeIndex = i;
        }
      } catch (err) {
        console.error(`[INSERT] Error on edge ${i}:`, err);
      }
    }

    if (closestEdgeIndex === -1) {
      return [...points, { lat: newLat, lng: newLng }];
    }

    console.log(`[INSERT] Closest edge: ${closestEdgeIndex}→${(closestEdgeIndex + 1) % points.length}, distance: ${minDistance.toFixed(4)}km`);

    const insertIndex = closestEdgeIndex + 1;
    const newPoints = [
      ...points.slice(0, insertIndex),
      { lat: newLat, lng: newLng },
      ...points.slice(insertIndex)
    ];

    console.log(`[INSERT] Inserted at index ${insertIndex}: [${points.length} → ${newPoints.length} points]`);
    return newPoints;
  };

  // ✅ FIX #2: Polygon Area Calculation (closing point tutarlı)
  const calculatePolygonArea = (points: PolygonPoint[]) => {
    if (points.length < 3) return 0;

    try {
      const coordinates = [
        [
          ...points.map(p => [p.lng, p.lat]),
          [points[0].lng, points[0].lat] // Closing point
        ]
      ];

      const polygon = turf.polygon(coordinates);
      const areaInSquareMeters = turf.area(polygon);
      const hectares = areaInSquareMeters / 10000;

      return Math.round(hectares * 100) / 100;
    } catch (error) {
      console.error('Alan hesaplama hatası:', error);
      return 0;
    }
  };

  // ✅ FIX #3: Convert to GeoJSON
  const convertToGeoJSON = (points: PolygonPoint[]) => {
    if (points.length < 3) {
      console.error('Invalid polygon: less than 3 points');
      return null;
    }

    const coordinates = [
      [
        ...points.map(p => [p.lng, p.lat]),
        [points[0].lng, points[0].lat] // Closing point
      ]
    ];

    return {
      type: 'Polygon',
      coordinates: coordinates
    };
  };

  useEffect(() => {
    if (token) {
      loadParcels();
    }
  }, [token]);

  const loadParcels = async () => {
    try {
      setLoading(true);
      if (!token) return;

      const response = await api.get('/api/parcels');
      setParcels(response.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        console.log('[LOAD] Token invalid - session expired');
        const errorMsg = 'âš ï¸ Oturum süresi doldu. Lütfen tekrar giriş yapınız.';
        setError(errorMsg);
        localStorage.setItem('lastLoadError', JSON.stringify({
          status: 401,
          message: errorMsg,
          timestamp: new Date().toISOString()
        }));
      } else {
        const errorMsg = err.response?.data?.detail || 'Parsel listesi yüklenemedi';
        setError(errorMsg);
        localStorage.setItem('lastLoadError', JSON.stringify({
          status: err.response?.status,
          message: errorMsg,
          timestamp: new Date().toISOString()
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const editingParcelId = (location.state as any)?.editingParcelId;
    if (editingParcelId && parcels.length > 0 && !editingAttemptedRef.current) {
      editingAttemptedRef.current = true;
      const editingParcel = parcels.find(p => p.id === editingParcelId);
      if (editingParcel) {
        console.log('[EDIT MODE] Loading parcel for editing:', editingParcelId);
        handleOpenParcelDetail(editingParcel);
      }
    }
  }, [parcels]);

  const handleAdaParselSearch = () => {
    if (!adaNo || !parselNo) {
      setError('Lütfen Ada ve Parsel numarasını girin');
      return;
    }

    const mockCoordinates: Record<string, [number, number]> = {
      '123-45': [39.0, 35.0],
      '456-78': [38.5, 34.5],
      '789-10': [38.2, 35.3],
    };

    const key = `${adaNo}-${parselNo}`;
    const coords = mockCoordinates[key] || [39.0, 35.0];

    setSelectedLat(coords[0]);
    setSelectedLng(coords[1]);
    setParcelName(`Ada: ${adaNo}, Parsel: ${parselNo}`);
    setShowForm(false);
    setPolygonPoints([]);
    setSuccess(`✓ Parsel bulundu: ${key}`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleKoordinatSearch = () => {
    const lat = parseFloat(searchLat);
    const lng = parseFloat(searchLng);

    if (isNaN(lat) || isNaN(lng)) {
      setError('Lütfen geçerli koordinat girin');
      return;
    }

    if (lat < 36 || lat > 42 || lng < 26 || lng > 45) {
      setError('Lütfen Türkiye sınırları içinde koordinat girin');
      return;
    }

    setSelectedLat(lat);
    setSelectedLng(lng);
    setParcelName(`Koordinat: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    setShowForm(false);
    setPolygonPoints([]);
    setSuccess(`✓ Haritaya gidildi: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleAddressSearch = async () => {
    if (!addressSearch.trim()) {
      setError('Lütfen bir adres girin');
      return;
    }

    try {
      setError('');
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressSearch)}&format=json&limit=5&countrycodes=tr`
      );
      const results = await response.json();

      if (results.length === 0) {
        setError('Adres bulunamadı. Başka bir adres deneyin.');
        return;
      }

      const result = results[0];
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);

      setSelectedLat(lat);
      setSelectedLng(lng);
      setParcelName(result.display_name || addressSearch);
      setShowForm(false);
      setPolygonPoints([]);
      setSuccess(`✓ ${result.display_name} bulundu!`);
    } catch (err: any) {
      console.error('Adres arama hatası:', err);
      setError('Adres arama başarısız. Lütfen tekrar deneyin.');
    }
  };

  const handlePointMouseDown = (index: number) => {
    setDraggedPointIndex(index);
  };

  const handlePointMove = (lat: number, lng: number) => {
    if (draggedPointIndex === null) return;

    if (draggedPointIndex < 0 || draggedPointIndex >= polygonPoints.length) {
      console.warn('[DRAG] Invalid index:', draggedPointIndex);
      return;
    }

    const updatedPoints = [...polygonPoints];
    updatedPoints[draggedPointIndex] = { lat, lng };
    setPolygonPoints(updatedPoints);

    const newArea = calculatePolygonArea(updatedPoints);
    setArea(newArea.toString());

    console.log(`[DRAG] Point ${draggedPointIndex} moved, area: ${newArea}ha`);
  };

  const handleDragEnd = () => {
    setDraggedPointIndex(null);
  };

  const handleOpenParcelDetail = (parcel: Parcel) => {
    console.log('[LOAD] Opening parcel:', parcel.id, parcel.parcel_name);
    setSelectedParcel(parcel);
    setIsEditingParcel(true);

    if (!parcel.geometry_geojson) {
      console.warn('[LOAD] No geometry_geojson for parcel', parcel.id);
      return;
    }

    try {
      const geojson = JSON.parse(parcel.geometry_geojson);
      console.log('[LOAD] Parsed GeoJSON:', geojson);

      if (geojson.type === 'Polygon' && geojson.coordinates) {
        let polygonCoords = geojson.coordinates[0];

        if (polygonCoords.length > 1) {
          const first = polygonCoords[0];
          const last = polygonCoords[polygonCoords.length - 1];

          if (first[0] === last[0] && first[1] === last[1]) {
            polygonCoords = polygonCoords.slice(0, -1);
            console.log('[LOAD] Removed closing point from geometry');
          }
        }

        const mappedCoords = polygonCoords.map(
          (coord: [number, number]) => ({ lat: coord[1], lng: coord[0] })
        );

        setPolygonPoints(mappedCoords);
        setParcelName(parcel.parcel_name);
        setArea(parcel.area_hectares.toString());
        setSelectedLat(parcel.centroid_lat);
        setSelectedLng(parcel.centroid_lon);
        setShowForm(true);

        console.log(`[LOAD] Parcel loaded with ${mappedCoords.length} points`);
      } else {
        console.warn('[LOAD] Invalid polygon geometry:', geojson);
      }
    } catch (e) {
      console.error('[LOAD] Failed to parse geometry:', e);
    }
  };

  const handleSaveEditedParcel = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[SAVE] handleSaveEditedParcel başladı');
    console.log('[SAVE] selectedParcel:', selectedParcel?.id);
    console.log('[SAVE] polygonPoints.length:', polygonPoints.length);

    if (!selectedParcel || polygonPoints.length < 3) {
      console.log('[SAVE] Error: parcel veya nokta yok');
      setError('En az 3 nokta gereklidir');
      return;
    }

    try {
      console.log('[SAVE] Try block başladı');
      
      const geometryGeojson = convertToGeoJSON(polygonPoints);
      if (!geometryGeojson) {
        setError('Geçersiz poligon');
        return;
      }

      const authToken = localStorage.getItem('token') || token;
      console.log('[SAVE] Token:', authToken ? '✓ Present' : '✗ Missing');
      console.log('[SAVE] Parcel ID:', selectedParcel.id);

      const response = await api.put(`/api/parcels/${selectedParcel.id}`, {
        parcel_name: parcelName,
        centroid_lat: selectedLat || selectedParcel.centroid_lat,
        centroid_lon: selectedLng || selectedParcel.centroid_lon,
        area_hectares: parseFloat(area),
        geometry_geojson: JSON.stringify(geometryGeojson),
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      console.log('[SAVE] Response status:', response.status);
      console.log('[SAVE] Response data:', response.data);
      localStorage.setItem('lastSaveLog', JSON.stringify({
        status: response.status,
        data: response.data,
        timestamp: new Date().toISOString()
      }));
      setSuccess(`✓ Parsel "${parcelName}" güncellendi!`);
      setSelectedParcel(null);
      setIsEditingParcel(false);
      setPolygonPoints([]);
      setParcelName('');
      setArea('');
      setShowForm(false);

      console.log('[SAVE] loadParcels() çağrılıyor...');
      try {
        const parcelsResponse = await api.get('/api/parcels');
        console.log('[SAVE] loadParcels() başarılı:', parcelsResponse.data.length, 'parsel');
        setParcels(parcelsResponse.data);
      } catch (loadErr: any) {
        console.error('[SAVE] loadParcels() failed:', loadErr);
        console.error('[SAVE] Error status:', loadErr.response?.status);
        console.error('[SAVE] Error detail:', loadErr.response?.data?.detail);
      }

      console.log('[SAVE] Token after refresh:', localStorage.getItem('token') ? '✓' : '✗');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Save parcel error:', err);
      let errorMessage = 'Parsel güncellenemedi';

      if (err.response?.status === 401) {
        errorMessage = 'Oturum süresi doldu. Lütfen tekrar giriş yapın.';
      } else if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.detail) {
          errorMessage = String(err.response.data.detail);
        } else if (err.response.data.message) {
          errorMessage = String(err.response.data.message);
        } else if (err.message) {
          errorMessage = err.message;
        }
      }

      localStorage.setItem('lastSaveError', JSON.stringify({
        status: err.response?.status,
        message: errorMessage,
        timestamp: new Date().toISOString()
      }));

      setError(errorMessage);
    }
  };

  const handleCancelEdit = () => {
    setSelectedParcel(null);
    setIsEditingParcel(false);
    setPolygonPoints([]);
    setParcelName('');
    setArea('');
  };

  const handleDeleteParcel = async () => {
    if (!selectedParcel) return;

    const confirmed = window.confirm(
      `"${selectedParcel.parcel_name}" parselini silmek istediğine emin misin? Bu işlem geri alınamaz.`
    );
    if (!confirmed) return;

    try {
      await api.delete(`/api/parcels/${selectedParcel.id}`);
      setParcels(parcels.filter((p) => p.id !== selectedParcel.id));
      setSuccess('Parsel silindi.');
      setShowForm(false);
      handleCancelEdit();
    } catch (err: any) {
      console.error('Error deleting parcel:', err);
      setError(err.response?.data?.detail || 'Parsel silinemedi.');
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    setError('');
    setSuccess('');

    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        try {
          EXIF.getData(img as any, function (this: any) {
            const lat = EXIF.getTag(this, 'GPSLatitude');
            const lng = EXIF.getTag(this, 'GPSLongitude');
            const latRef = EXIF.getTag(this, 'GPSLatitudeRef');
            const lngRef = EXIF.getTag(this, 'GPSLongitudeRef');

            if (lat && lng) {
              const latitude = lat[0] + lat[1] / 60 + lat[2] / 3600;
              const longitude = lng[0] + lng[1] / 60 + lng[2] / 3600;

              const latDec = latRef === 'S' ? -latitude : latitude;
              const lngDec = lngRef === 'W' ? -longitude : longitude;

              setPhotoExifData({ latitude: latDec, longitude: lngDec });
              setSelectedLat(latDec);
              setSelectedLng(lngDec);
              setParcelName(`📷 ${file.name}`);
              setShowForm(false);
              setPolygonPoints([]);

              setSuccess(
                `✓ Fotoğraftan konum çıkarıldı!\n📍 ${latDec.toFixed(6)}, ${lngDec.toFixed(6)}\n📏 Hassasiyet: ±5-15m`
              );
              setTimeout(() => setSuccess(''), 4000);

              URL.revokeObjectURL(img.src);
            } else {
              setError(
                'Fotoğrafta GPS verisi bulunamadı. Lütfen konum özelliği etkin kameraya sahip cihaz kullanın.'
              );
              URL.revokeObjectURL(img.src);
            }
          });
        } catch (err: any) {
          console.error('EXIF parse error:', err);
          setError('Fotoğraf işlenirken hata oluştu.');
          URL.revokeObjectURL(img.src);
        }
      };

      img.onerror = () => {
        setError('Fotoğraf yüklenemedi. JPEG formatı kontrol edin.');
      };
    } catch (err: any) {
      console.error('Upload error:', err);
      setError('Dosya işlenirken hata oluştu.');
    }
  };

  const calculateCentroid = (points: PolygonPoint[]) => {
    if (points.length === 0) return { lat: 0, lng: 0 };
    const sum = points.reduce((acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }), { lat: 0, lng: 0 });
    return { lat: sum.lat / points.length, lng: sum.lng / points.length };
  };

  // ✅ SMART INSERTION - handleMapClick güncellemesi
  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (!drawingMode) return;

    // Smart insertion: En yakın kenarın ortasına ekle
    const updatedPoints = insertPointSmartly(polygonPoints, lat, lng);
    setPolygonPoints(updatedPoints);
    setError('');
  }, [drawingMode, polygonPoints]);

  const handleFinishPolygon = () => {
    if (polygonPoints.length < 3) {
      setError('En az 3 nokta gerekli');
      return;
    }

    const centroid = calculateCentroid(polygonPoints);
    const calculatedArea = calculatePolygonArea(polygonPoints);

    setSelectedLat(centroid.lat);
    setSelectedLng(centroid.lng);
    setArea(calculatedArea.toString());
    setShowForm(true);
    setDrawingMode(false);
  };

  const handleClearPolygon = () => {
    setPolygonPoints([]);
    setSelectedLat(null);
    setSelectedLng(null);
    setArea('');
    setShowForm(false);
    setError('');
  };

  const handleDeletePoint = (idx: number) => {
    if (idx < 0 || idx >= polygonPoints.length) {
      console.warn('[DELETE] Invalid index:', idx);
      return;
    }

    const updated = polygonPoints.filter((_, i) => i !== idx);

    if (updated.length < 3) {
      setPolygonPoints([]);
      setSelectedLat(null);
      setSelectedLng(null);
      setArea('');
      console.log('[DELETE] Polygon cleared (less than 3 points)');
      return;
    }

    setPolygonPoints(updated);

    const centroid = calculateCentroid(updated);
    const calculatedArea = calculatePolygonArea(updated);
    setSelectedLat(centroid.lat);
    setSelectedLng(centroid.lng);
    setArea(calculatedArea.toString());

    console.log(`[DELETE] Point ${idx} deleted, remaining: ${updated.length}`);
  };

  const handleSubmitParcel = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedLat || !selectedLng || !parcelName || !area) {
      setError('Lütfen tüm alanları doldurunuz');
      return;
    }

    if (polygonPoints.length < 3) {
      setError('En az 3 nokta gerekli');
      return;
    }

    const storedToken = localStorage.getItem('token');
    if (!storedToken && !token) {
      setError('Oturum kapalı. Lütfen giriş yapınız');
      return;
    }

    try {
      const authToken = storedToken || token;
      const geometryGeojson = convertToGeoJSON(polygonPoints);

      if (!geometryGeojson) {
        setError('Geçersiz poligon');
        return;
      }

      const response = await api.post('/api/parcels', {
        parcel_name: parcelName,
        centroid_lat: selectedLat,
        centroid_lon: selectedLng,
        area_hectares: parseFloat(area),
        geometry_geojson: JSON.stringify(geometryGeojson),
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      setParcels([...parcels, response.data]);
      setSuccess(`✓ Parsel "${parcelName}" işaretlendi!`);

      setParcelName('');
      setArea('');
      setSelectedLat(null);
      setSelectedLng(null);
      setPolygonPoints([]);
      setShowForm(false);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Parsel kaydedilemedi');
    }
  };

  // Auto-update area when polygon points change
  useEffect(() => {
    if (polygonPoints.length >= 3 && drawingMode) {
      const centroid = calculateCentroid(polygonPoints);
      const calculatedArea = calculatePolygonArea(polygonPoints);
      setSelectedLat(centroid.lat);
      setSelectedLng(centroid.lng);
      setArea(calculatedArea.toString());
      console.log(`[UPDATE] Polygon updated: ${polygonPoints.length} points, area: ${calculatedArea}ha`);
    }
  }, [polygonPoints, drawingMode]);

  const centerLat = 39.0;
  const centerLng = 35.0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">🛰️ Uydu Haritası - Parsel İşaretleme</h1>
            <p className="text-gray-600 mt-1">
              Uydu görüntüsü üzerinden parselinizi işaretleyebilirsiniz. Zoom: Scroll ile | Max: Level 21
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <h3 className="font-semibold text-emerald-900 mb-2">✏️ Parsel Alanı Belirle</h3>
                {!(searchMode === 'draw' && drawingMode) ? (
                  <button
                    onClick={() => {
                      setSearchMode('draw');
                      setDrawingMode(true);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded text-sm font-medium"
                  >
                    🖍️ Haritada Çizerek Belirle
                  </button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-emerald-800">
                      Haritaya tıklayarak parsel sınırını belirle (min. 3 nokta)
                    </p>
                    <p className="text-xs text-emerald-700">
                      Nokta sayısı: {polygonPoints.length}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleFinishPolygon}
                        disabled={polygonPoints.length < 3}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-3 py-2 rounded text-sm font-medium"
                      >
                        Tamamla ({polygonPoints.length}/3+)
                      </button>
                      <button
                        onClick={handleClearPolygon}
                        className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded text-sm font-medium"
                      >
                        Temizle
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <h3 className="font-semibold text-gray-900 mb-2">🔍 Parsel Bulma Yöntemi</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSearchMode('ada-parsel');
                      setDrawingMode(false);
                    }}
                    className={`px-2 py-2 rounded text-xs font-medium transition ${
                      searchMode === 'ada-parsel'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    📋 Ada/Parsel
                  </button>
                  <button
                    onClick={() => {
                      setSearchMode('koordinat');
                      setDrawingMode(false);
                    }}
                    className={`px-2 py-2 rounded text-xs font-medium transition ${
                      searchMode === 'koordinat'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    📍 Koordinat
                  </button>
                  <button
                    onClick={() => {
                      setSearchMode('foto');
                      setDrawingMode(false);
                    }}
                    className={`px-2 py-2 rounded text-xs font-medium transition ${
                      searchMode === 'foto'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    📸 Fotoğraf
                  </button>
                  <button
                    onClick={() => {
                      setSearchMode('address');
                      setDrawingMode(false);
                    }}
                    className={`px-2 py-2 rounded text-xs font-medium transition ${
                      searchMode === 'address'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🏘️ Adres
                  </button>
                </div>
              </div>

              {searchMode === 'ada-parsel' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-3">📋 Ada/Parsel Numarası</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Ada No</label>
                      <input
                        type="text"
                        value={adaNo}
                        onChange={(e) => setAdaNo(e.target.value)}
                        placeholder="ör: 123"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Parsel No</label>
                      <input
                        type="text"
                        value={parselNo}
                        onChange={(e) => setParselNo(e.target.value)}
                        placeholder="ör: 45"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <button
                      onClick={handleAdaParselSearch}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium text-sm"
                    >
                      Ara
                    </button>
                  </div>
                </div>
              )}

              {searchMode === 'koordinat' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-3">📍 Enlem/Boylam</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Enlem (N)</label>
                      <input
                        type="number"
                        value={searchLat}
                        onChange={(e) => setSearchLat(e.target.value)}
                        placeholder="ör: 38.0335"
                        step="0.0001"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Boylam (E)</label>
                      <input
                        type="number"
                        value={searchLng}
                        onChange={(e) => setSearchLng(e.target.value)}
                        placeholder="ör: 27.4990"
                        step="0.0001"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <button
                      onClick={handleKoordinatSearch}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium text-sm"
                    >
                      Haritaya Git
                    </button>
                  </div>
                </div>
              )}

              {searchMode === 'address' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-3">🏘️ Adres Arama</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Adres Yazın</label>
                      <input
                        type="text"
                        value={addressSearch}
                        onChange={(e) => setAddressSearch(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch()}
                        placeholder="ör: Izmit Kırkpınar Köyü"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <button
                      onClick={handleAddressSearch}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium text-sm"
                    >
                      Haritaya Git
                    </button>
                  </div>
                </div>
              )}

              {searchMode === 'foto' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-900 mb-3">📸 Fotoğraftan Konum</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Konum Verili Fotoğraf Seç
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm cursor-pointer"
                      />
                    </div>
                    {photoExifData && (
                      <div className="bg-white p-3 rounded border border-orange-200 text-xs">
                        <p className="font-medium text-gray-900 mb-2">📷 Fotoğraf EXIF Verisi:</p>
                        {photoExifData.latitude && photoExifData.longitude && (
                          <p className="text-gray-700">
                            📍 Konum: {photoExifData.latitude.toFixed(6)}, {photoExifData.longitude.toFixed(6)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                  ✗ {error}
                </div>
              )}
              {success && (
                <div
                  onClick={() => {
                    if (selectedLat && selectedLng) setFlyTrigger((t) => t + 1);
                  }}
                  className={`bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm ${
                    selectedLat && selectedLng ? 'cursor-pointer hover:bg-green-100' : ''
                  }`}
                >
                  {success}
                </div>
              )}

              {showForm && selectedLat && selectedLng && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {isEditingParcel ? '✏️ Parsel Düzenle' : 'Parsel Detayları'}
                  </h3>
                  <form onSubmit={isEditingParcel ? handleSaveEditedParcel : handleSubmitParcel} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parsel Adı</label>
                      <input
                        type="text"
                        value={parcelName}
                        onChange={(e) => setParcelName(e.target.value)}
                        placeholder="ör: A Alanı"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alan (hektar)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="ör: 5.5"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div className="text-xs text-gray-500">
                      📍 {selectedLat.toFixed(4)}, {selectedLng.toFixed(4)}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium"
                      >
                        Kaydet
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded text-sm font-medium"
                      >
                        İptal
                      </button>
                    </div>

                    {isEditingParcel && selectedParcel && (
                      <>
                        <button
                          type="button"
                          onClick={() => navigate(`/parcels/${selectedParcel.id}/satellite`)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded text-sm font-medium"
                        >
                          🛰️ Uydu Görüntüleri ve İndeksler
                        </button>
                        <button
                          type="button"
                          onClick={handleDeleteParcel}
                          className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium"
                        >
                          🗑️ Parseli Sil
                        </button>
                      </>
                    )}
                  </form>
                </div>
              )}

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Parselerim ({parcels.length})
                </h3>
                {isEditingParcel ? (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                    <p className="text-blue-800 font-medium">✏️ Düzenleme Modu Aktif</p>
                  </div>
                ) : loading ? (
                  <p className="text-gray-500 text-sm">Yükleniyor...</p>
                ) : parcels.length === 0 ? (
                  <p className="text-gray-500 text-sm">Henüz parsel işaretlediniz.</p>
                ) : (
                  <ul className="space-y-2 max-h-96 overflow-y-auto">
                    {parcels.map((parcel) => (
                      <li
                        key={parcel.id}
                        onClick={() => handleOpenParcelDetail(parcel)}
                        className="p-3 bg-gray-50 border border-gray-200 rounded text-sm hover:bg-blue-50 cursor-pointer transition flex items-center justify-between gap-2"
                      >
                        <div>
                          <p className="font-medium text-gray-900">📍 {parcel.parcel_name}</p>
                          <p className="text-xs text-gray-600 mt-1">{parcel.area_hectares} hektar</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/parcels/${parcel.id}/satellite`);
                          }}
                          title="Uydu görüntüsünü görüntüle"
                          className="shrink-0 p-2 rounded hover:bg-blue-100 text-blue-600"
                        >
                          🛰️
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden h-[600px] lg:h-[750px]">
                <MapContainer
                  center={[centerLat, centerLng]}
                  zoom={6}
                  maxZoom={21}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='&copy; <a href="https://www.arcgis.com/">Esri</a>'
                    maxZoom={21}
                  />

                  <DragHandler
                    draggedPointIndex={draggedPointIndex}
                    onDragEnd={handleDragEnd}
                    onPointMove={handlePointMove}
                  />

                  {(isEditingParcel && selectedParcel ? [selectedParcel] : parcels).map((parcel) => {
                    let polygonCoords: any[] = [];
                    if (parcel.geometry_geojson) {
                      try {
                        const geojson = JSON.parse(parcel.geometry_geojson);
                        if (geojson.type === 'Polygon' && geojson.coordinates) {
                          polygonCoords = geojson.coordinates[0].map((coord: [number, number]) => [coord[1], coord[0]]);
                        }
                      } catch (e) {
                        console.warn('Failed to parse geometry for parcel', parcel.id);
                      }
                    }

                    return (
                      <div key={parcel.id}>
                        {polygonCoords.length >= 3 && (
                          <Polygon
                            positions={polygonCoords}
                            pathOptions={{
                              color: '#3b82f6',
                              weight: 2,
                              opacity: 0.6,
                              fill: true,
                              fillColor: '#3b82f6',
                              fillOpacity: 0.15
                            }}
                          >
                            <Popup>
                              <div className="text-sm">
                                <p className="font-medium">{parcel.parcel_name}</p>
                                <p className="text-gray-600">{parcel.area_hectares} ha</p>
                              </div>
                            </Popup>
                          </Polygon>
                        )}

                        <Marker
                          position={[parcel.centroid_lat, parcel.centroid_lon]}
                          icon={new L.Icon({
                            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                          })}
                          eventHandlers={{
                            click: () => handleOpenParcelDetail(parcel),
                          }}
                        >
                          <Popup>
                            <div className="text-sm">
                              <p className="font-medium">{parcel.parcel_name}</p>
                              <p className="text-gray-600">{parcel.area_hectares} ha</p>
                            </div>
                          </Popup>
                        </Marker>
                      </div>
                    );
                  })}

                  {selectedLat && selectedLng && (
                    <Marker
                      position={[selectedLat, selectedLng]}
                      icon={new L.Icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                      })}
                    >
                      <Popup>Yeni Parsel</Popup>
                    </Marker>
                  )}

                  {polygonPoints.length > 0 && (
                    <>
                      {polygonPoints.length >= 3 && (
                        <Polygon
                          positions={polygonPoints.map(p => [p.lat, p.lng])}
                          pathOptions={{
                            color: '#10b981',
                            weight: 2,
                            opacity: 0.7,
                            fill: true,
                            fillColor: '#10b981',
                            fillOpacity: 0.2
                          }}
                        />
                      )}

                      {polygonPoints.map((point, idx) => (
                        <Marker
                          key={idx}
                          position={[point.lat, point.lng]}
                          icon={new L.Icon({
                            iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iNiIgZmlsbD0iI2E4NTVmNyIgc3Ryb2tlPSIjN2MzYWVkIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=',
                            iconSize: [16, 16],
                            iconAnchor: [8, 8],
                            popupAnchor: [0, -8],
                          })}
                          eventHandlers={{
                            click: (e) => {
                              if (e.originalEvent?.ctrlKey || e.originalEvent?.metaKey) {
                                handleDeletePoint(idx);
                              }
                            },
                            dblclick: () => handleDeletePoint(idx),
                            mousedown: (e) => {
                              const map = e.target._map;
                              if (map) map.dragging.disable();
                              handlePointMouseDown(idx);
                            },
                          }}
                        >
                          <Popup>Nokta {idx + 1}</Popup>
                        </Marker>
                      ))}
                    </>
                  )}

                  <MapClickHandler onMapClick={handleMapClick} />
                  <ZoomToParcel lat={selectedLat} lng={selectedLng} enabled={true} trigger={flyTrigger} />
                  <MapAutoResize />
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedParcel && !isEditingParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedParcel.parcel_name}</h2>
                  <p className="text-gray-600 mt-1">
                    📍 {selectedParcel.centroid_lat.toFixed(6)}, {selectedParcel.centroid_lon.toFixed(6)}
                  </p>
                </div>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

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

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate(`/parcels/${selectedParcel.id}/satellite`)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-medium"
                >
                  🛰️ Uydu Görüntüsü
                </button>
                <button
                  onClick={() => setIsEditingParcel(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
                >
                  ✏️ Düzenle
                </button>
                <button
                  onClick={handleDeleteParcel}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium"
                >
                  🗑️ Sil
                </button>
                <button
                  onClick={handleCancelEdit}
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
