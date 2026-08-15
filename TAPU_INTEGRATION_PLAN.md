# Tapu Müdürlüğü (Land Registry) Entegrasyonu - Phase 2

## 📋 Geçerli Durum (MVP)

- ✅ Ada/Parsel input alanları var
- ✅ Koordinat arama çalışıyor
- ⏳ Ada/Parsel → Mock verisi döndürüyor (3 örnek parsel)

---

## 🎯 Phase 2 Hedefleri

### 1. **Resmi Veri Kaynakları**

| Kaynak | Erişilebilirlik | Maliyet | Doğruluk | Tavsiye |
|--------|-----------------|---------|----------|---------|
| **TAKBIS** (Tapu Kadastro Bilgi Sistemi) | Kurumsal | Ücretli | ⭐⭐⭐⭐⭐ | Uzun vadeli |
| **Web Hizmeti (Web Service)** | Taleple | Ücretsiz | ⭐⭐⭐⭐ | Yeni başlayanlar için |
| **Veri Sorgulama Sistemi** | Taleple | Değişken | ⭐⭐⭐⭐ | Pilot proje |
| **Açık Veri (OSM/Wikimapia)** | Halka açık | Ücretsiz | ⭐⭐ | Arka plan harita |

---

## 🔧 Entegrasyon Adımları

### **Adım 1: Tapu Müdürlüğüne Başvuru (1-2 hafta)**

```
Başvuru Yapılacak: Türkiye Tapu Kadastro Müdürlüğü
İstekler:
├─ Ada/Parsel sorgulama Web Service API
├─ Sınırlar (boundary geometry) GeoJSON formatında
├─ Koordinatlar (WGS84 / EPSG:4326)
└─ API rate limits ve SLA

Email: bilgi@tkk.gov.tr
Telefon: +90 312 294 80 00
```

### **Adım 2: Backend Geliştirme (1 hafta)**

```python
# backend/tapu_service.py (yeni dosya)
class TapuService:
    """Turkish Land Registry API client"""
    
    async def search_parcel(ada: str, parsel: str) -> ParcelData:
        """Ada/Parsel numarasından parsel bilgisi döndür"""
        # 1. Tapu API'ye request yap
        # 2. Geometry bilgisini parse et
        # 3. Koordinatları normal et (WGS84)
        # 4. Parcel model'ine dönüştür
        pass
    
    async def get_boundary(ada: str, parsel: str) -> GeoJSON:
        """Parsel sınırlarını GeoJSON olarak döndür"""
        pass
    
    async def validate_ada_parsel(ada: str, parsel: str) -> bool:
        """Ada/Parsel geçerli mi kontrol et"""
        pass
```

### **Adım 3: Frontend Bağlantısı (1 hafta)**

```typescript
// frontend/services/tapu.ts (yeni)
export async function searchParcel(ada: string, parsel: string) {
  // GET /api/tapu/search?ada=123&parsel=45
  // Response: {
  //   coordinates: [lat, lng],
  //   geometry: GeoJSON,
  //   area_hectares: 5.2,
  //   owner: "...",
  //   status: "..." 
  // }
}
```

### **Adım 4: MapPage Güncelleme (1 hafta)**

```typescript
// handleAdaParselSearch fonksiyonunu güncelle:
async function handleAdaParselSearch() {
  // 1. Backend'e ara
  const result = await searchParcel(adaNo, parselNo);
  // 2. Haritada polygon'u otomatik çiz
  setPolygonPoints(result.geometry.coordinates);
  // 3. Alanı otomatik hesapla
  setArea(result.area_hectares.toString());
}
```

---

## 📊 Beklenen Faydalar

✅ **Doğruluk**: Resmi kayıtlardan veri  
✅ **Hız**: Çiftçi ela yazıyor, otomatik bulunuyor  
✅ **Otomasyon**: Polygon ve alan otomatik hesaplanıyor  
✅ **Hukuki Geçerlilik**: Resmi tapu verisi kulllanılıyor  

---

## ⚠️ Zorluklar ve Çözümler

| Zorluk | Çözüm |
|--------|-------|
| Tapu API yavaşsa | Caching (1 ay TTL) |
| Parsel bulunamazsa | Fallback: Manuel giriş |
| Veri formatı değişirse | Version kontrol + tests |
| Erişim sınırlandırılırsa | Rate limiting + queue |

---

## 📈 İş Kararları

### **Tavsiyem:**

1. **MVP'de** (şu anda): Mock verisi ✅ (zaten yapılmış)
2. **Phase 2 Başında** (1-2 ay sonra):
   - Tapu Müdürlüğüne resmi başvuru yap
   - Pilot proje anlaşması imzala
   - API endpoint'leri test et
3. **Tam Entegrasyon**: Veri elde edildikten sonra

### **Bütçe Tahminleri:**

- API erişim bedeli: ~$500-2000/ay (veya ücretsiz koşulla)
- Geliştirme saati: ~40-60 saat
- Test & QA: ~20 saat

---

## 📞 Sonraki Adımlar

1. **Bu hafta**: Tapu Müdürlüğü'yle ilk temas
2. **Sonraki hafta**: Başvuru gönder
3. **1 ay sonra**: API access al
4. **2 ay sonra**: Phase 2 geliştirmesine başla

**Kim harika soruyu sordu?** Kullanıcı! 🌾 Bu Phase 2 olmadan MVP eksik kalan kısım tam bundu.
