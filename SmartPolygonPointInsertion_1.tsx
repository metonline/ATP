/**
 * SMART POLYGON POINT INSERTION
 * =============================
 * 
 * SORUN:
 * - 4 nokta varken 5. nokta ekleniyor → listede sonuna gidiyor
 * - Ama geometrik olarak yeni nokta poligon KENARININ ORTASINA yerleşmeli
 * - Bu sayede yeni nokta yakın kenarları böler, alan tutarlı kalır
 * 
 * ÇÖZÜM:
 * 1. Yeni nokta → poligon kenarlarına mesafe hesapla
 * 2. En yakın kenarı bul
 * 3. Yeni noktayı o kenarın ORTASINA (index-wise) ekle
 * 4. Alan otomatik olarak doğru hesaplanır
 * 
 * ÖRNEK:
 * ┌─────────────────────────────────────┐
 * │  Poligon: A→B→C→D (4 nokta)        │
 * │                                     │
 * │  Yeni E noktası B-C kenarına        │
 * │  en yakın                          │
 * │                                     │
 * │  Sonuç: A→B→E→C→D (5 nokta)        │
 * │                                     │
 * │  ✅ Alan = eski bölge + E bölgesi   │
 * └─────────────────────────────────────┘
 */

import * as turf from '@turf/turf';

interface PolygonPoint {
  lat: number;
  lng: number;
}

/**
 * ✅ SMART POINT INSERTION
 * Yeni noktayı poligon kenarlarına ekler (sonuna değil)
 */
const insertPointSmartly = (
  polygonPoints: PolygonPoint[],
  newLat: number,
  newLng: number
): PolygonPoint[] => {
  // Geçerlilik kontrol
  if (polygonPoints.length < 2) {
    console.log('[INSERT] Less than 2 points, adding to end');
    return [...polygonPoints, { lat: newLat, lng: newLng }];
  }

  const newPoint = turf.point([newLng, newLat]); // GeoJSON format: [lng, lat]
  
  let minDistance = Infinity;
  let closestEdgeIndex = -1;
  let closestPointOnEdge: turf.Feature<turf.Point> | null = null;

  // Her kenarı kontrol et
  for (let i = 0; i < polygonPoints.length; i++) {
    const pointA = polygonPoints[i];
    const pointB = polygonPoints[(i + 1) % polygonPoints.length]; // Circular (son→ilk)

    // GeoJSON line [lng, lat] format
    const edgeLine = turf.lineString([
      [pointA.lng, pointA.lat],
      [pointB.lng, pointB.lat]
    ]);

    try {
      // Yeni nokta → kenarına en yakın nokta ve mesafe
      const snappedPoint = turf.nearestPointOnLine(edgeLine, newPoint);
      const distance = snappedPoint.properties.dist; // km cinsinden

      console.log(`[INSERT] Edge ${i}→${(i + 1) % polygonPoints.length}: distance = ${distance.toFixed(4)}km`);

      // En yakın kenarı bul
      if (distance < minDistance) {
        minDistance = distance;
        closestEdgeIndex = i;
        closestPointOnEdge = snappedPoint;
      }
    } catch (err) {
      console.error(`[INSERT] Error calculating distance for edge ${i}:`, err);
    }
  }

  // Sonuç
  if (closestEdgeIndex === -1) {
    console.warn('[INSERT] No closest edge found, adding to end');
    return [...polygonPoints, { lat: newLat, lng: newLng }];
  }

  console.log(
    `[INSERT] Closest edge: ${closestEdgeIndex}→${(closestEdgeIndex + 1) % polygonPoints.length}, distance: ${minDistance.toFixed(4)}km`
  );

  // Yeni noktayı en yakın kenarın ORTASINA ekle
  const insertIndex = closestEdgeIndex + 1;
  const newPoints = [
    ...polygonPoints.slice(0, insertIndex),
    { lat: newLat, lng: newLng },
    ...polygonPoints.slice(insertIndex)
  ];

  console.log(
    `[INSERT] Inserted at index ${insertIndex}: [${polygonPoints.length} → ${newPoints.length} points]`
  );

  return newPoints;
};

/**
 * ✅ DISTANCE THRESHOLD VARIANT
 * Eğer yeni nokta çok uzaksa (threshold > ??km) sonuna ekle
 * Çok yakınsa kenarına ekle
 */
const insertPointSmartlyWithThreshold = (
  polygonPoints: PolygonPoint[],
  newLat: number,
  newLng: number,
  thresholdKm: number = 0.5 // 500 meter
): { points: PolygonPoint[]; inserted: boolean; distance: number } => {
  if (polygonPoints.length < 2) {
    return {
      points: [...polygonPoints, { lat: newLat, lng: newLng }],
      inserted: false,
      distance: Infinity
    };
  }

  const newPoint = turf.point([newLng, newLat]);
  let minDistance = Infinity;
  let closestEdgeIndex = -1;

  for (let i = 0; i < polygonPoints.length; i++) {
    const pointA = polygonPoints[i];
    const pointB = polygonPoints[(i + 1) % polygonPoints.length];

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
      console.error(`[INSERT-THRESHOLD] Error on edge ${i}:`, err);
    }
  }

  // Threshold kontrol
  if (minDistance <= thresholdKm) {
    console.log(`[INSERT-THRESHOLD] Within threshold (${minDistance.toFixed(4)}km ≤ ${thresholdKm}km), inserting at edge`);
    const insertIndex = closestEdgeIndex + 1;
    return {
      points: [
        ...polygonPoints.slice(0, insertIndex),
        { lat: newLat, lng: newLng },
        ...polygonPoints.slice(insertIndex)
      ],
      inserted: true,
      distance: minDistance
    };
  } else {
    console.log(`[INSERT-THRESHOLD] Beyond threshold (${minDistance.toFixed(4)}km > ${thresholdKm}km), adding to end`);
    return {
      points: [...polygonPoints, { lat: newLat, lng: newLng }],
      inserted: false,
      distance: minDistance
    };
  }
};

/**
 * ✅ MapPage.tsx'te handleMapClick değişikliği
 * 
 * ESKI KOD:
 * const handleMapClick = useCallback((lat: number, lng: number) => {
 *   if (!drawingMode) return;
 *   setPolygonPoints([...polygonPoints, { lat, lng }]);
 *   setError('');
 * }, [drawingMode, polygonPoints]);
 * 
 * YENİ KOD:
 */

const handleMapClickSmart = (lat: number, lng: number) => {
  if (!drawingMode) return;

  // ✅ Akılcı nokta ekleme
  const updatedPoints = insertPointSmartly(polygonPoints, lat, lng);
  
  setPolygonPoints(updatedPoints);
  setError('');

  // Alan otomatik recalculate edilecek (useEffect ile)
  // çünkü polygonPoints state güncellendi
};

/**
 * ✅ VEYA threshold ile (daha kontrollü):
 */
const handleMapClickWithThreshold = (lat: number, lng: number) => {
  if (!drawingMode) return;

  // 500m threshold: kenarına 500m içindeyse ekle, değilse sona ekle
  const result = insertPointSmartlyWithThreshold(
    polygonPoints,
    lat,
    lng,
    0.5 // 500 meter
  );
  
  setPolygonPoints(result.points);
  
  if (result.inserted) {
    setSuccess(`✓ Nokta poligon kenarına eklendi (${result.distance.toFixed(2)}km uzak)`);
  } else {
    setSuccess(`✓ Nokta liste sonuna eklendi (${result.distance.toFixed(2)}km uzak)`);
  }
  
  setTimeout(() => setSuccess(''), 3000);
};

/**
 * ✅ SIDE EFFECT: Poligon noktaları değişince alan otomatik güncelle
 * 
 * EKLE MapPage.tsx'e:
 */

useEffect(() => {
  if (polygonPoints.length >= 3 && drawingMode) {
    const centroid = calculateCentroid(polygonPoints);
    const calculatedArea = calculatePolygonArea(polygonPoints);
    setSelectedLat(centroid.lat);
    setSelectedLng(centroid.lng);
    setArea(calculatedArea.toString());
    
    console.log(`[UPDATE] Polygon updated: ${polygonPoints.length} points, area: ${calculatedArea}ha`);
  }
}, [polygonPoints]);

/**
 * TEST SENARYOSU:
 * ================
 * 
 * 1. 4 nokta çiz (A→B→C→D)
 *    │
 *    └─ Area = 10ha
 * 
 * 2. B-C kenarının ortasına E noktası tıkla
 *    │
 *    ├─ insertPointSmartly() → A→B→E→C→D
 *    └─ Area = 10ha + E bölgesi = ~12ha
 * 
 * 3. Verification:
 *    ├─ console: "[INSERT] Closest edge: 1→2, distance: 0.0001km"
 *    ├─ console: "[INSERT] Inserted at index 2: [4 → 5 points]"
 *    └─ Alan otomatik recalculate edildi ✅
 * 
 * 4. THRESHOLD test:
 *    ├─ 500m içinde kenarına ekle ✅
 *    ├─ 500m dışında sona ekle ✅
 *    └─ Kullanıcı geri bildirim al ✅
 */

/**
 * TURF.JS DEPENDENCY:
 * 
 * ✅ Zaten MapPage.tsx'te var:
 * import * as turf from '@turf/turf';
 * 
 * Gerekli fonksiyonlar:
 * - turf.point([lng, lat])
 * - turf.lineString([[lng, lat], ...])
 * - turf.nearestPointOnLine(line, point)
 * - turf.distance(point1, point2, {units: 'kilometers'})
 */

export { insertPointSmartly, insertPointSmartlyWithThreshold };
