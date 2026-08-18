# ATP (Akıllı Tarım Platformu / Renta Platform) — Proje Durumu

**Son güncelleme:** 18 Ağustos 2026

## İş Modeli & Geniş Perspektif

**Kaynak:** `00_EXECUTIVE_SUMMARY_EN.md` (25 sayfalık tam doküman, yatırımcı sunumu formatında — rakamlar/detaylar için oraya bak, burada sadece mühendislik kararlarını etkileyecek özet var)

**Vizyon:** Türkiye'nin 3 milyon çiftçisine yönelik, entegre 5 katmanlı dijital tarım platformu. Şu an kodladığımız ATP, bu büyük vizyonun **sadece bir parçası** — aşağıdaki modül haritasında nerede durduğumuzu kaybetmemek önemli.

### 6 Ana Modül + Uzman Pazaryeri

| Modül | Ne yapıyor | ATP'deki şu anki durumu |
|---|---|---|
| **FMIS.Agro** (Üretim Planlama ERP) | Parsel bazlı 90 günlük üretim planı, günlük rutin/raporlama, danışman check-in'leri | ❌ Hiç yok |
| **FMIS.Monitor** (Uydu + IoT) | NDVI/bitki sağlığı, hava durumu uyarıları, toprak sensörleri, hastalık erken uyarı | ✅ **Bunun çekirdeği var** — parsel yönetimi + 6 spektral indeks (NDVI/NDRE/NDMI/EVI/SAVI/GNDVI). IoT sensör/hava durumu/hastalık AI'ı henüz yok. |
| **FMIS.Livestock** (Veteriner AI) | Giyilebilir izleme, AI teşhis | ❌ Hiç yok |
| **FMIS.Equipment** (P2P Pazaryeri) | Traktör/ekipman kiralama, eşleştirme, escrow | ❌ Hiç yok |
| **FMIS.AI-Helpdesk** (7/24 Danışmanlık) | Chatbot + uzmana yönlendirme | ❌ Hiç yok |
| **FMIS.Market-Access** (B2B + B2C) | B2B: gıda şirketi direkt tedarik. B2C: QR ile çiftlikten-tüketiciye şeffaflık | ❌ Hiç yok |
| **Uzman Danışman Pazaryeri** | 300+ doğrulanmış agronomist, proje bazlı fiyatlama | ❌ Hiç yok |

### Mimari açıdan önemli çıkarım: Çoklu paydaş tipi

Vizyon en az **4 farklı kullanıcı/paydaş tipi** öngörüyor:
1. **Çiftçi** (şu an tek var olan: `Farmer` modeli)
2. **Uzman/Danışman** (agronomist — proje bazlı çalışan, kendi profili/değerlendirmesi olan ayrı bir rol)
3. **B2B Alıcı** (gıda şirketi — tedarik zinciri görünürlüğü isteyen kurumsal hesap)
4. **Tüketici** (B2C — sadece QR ile izleme yapan, muhtemelen hesapsız/hafif bir arayüz)

Şu anki `database.py`'de sadece `Farmer` var. İleride `FMIS.AI-Helpdesk` ya da uzman pazaryeri gibi modüller eklenirse, **auth/rol sistemi baştan tasarlanmalı** — mevcut tek-rollü yapıya sonradan yama yapmak yerine.

### Çok-modlu veri girişi vizyonu
Platform, çiftçilerin doğal kullandığı **7 farklı kanaldan** veri kabul etmeyi hedefliyor: sesli komut (STT+NLP), fotoğraf (OCR/CV — fatura, hastalık teşhisi), video, form, SMS/WhatsApp, IoT sensör, AR. Şu an ATP sadece klasik form/web arayüzü kullanıyor — bu vizyonun neredeyse hiçbiri henüz yok, ama ileride "parsel düzenleme formunu sesle doldurma" gibi özellikler istenirse bu doküman referans olur.

### İkinci kaynak: "Dört Eşit Misyon" çerçevesi

**Kaynak:** `02_DETAYLI_IS_MODELI_BILINGUAL.docx`

Bu doküman, 6 Modül mimarisiyle **çelişmiyor**, farklı bir seviyede tamamlıyor: 6 Modül *ürün/özellik* mimarisini tarif ederken, bu doküman platformun **stratejik/iş misyonunu** 4 eşit ayak üzerinden anlatıyor:

1. **Uzman Tarım Verisi + AI Öğrenme** — üniversiteler/araştırma enstitüleri/çiftçi feedback'inden merkezi bilgi kütüphanesi, AI üretim sonuçlarından öğrenir
2. **Ücretsiz Bilgi Yayınlanması (satıcı sponsorlu)** — Corteva/AGCO/Syngenta gibi girdi şirketleri sponsorluğuyla, çiftçiye ücretsiz webinar/SMS/WhatsApp içeriği → viral benimseme
3. **7/24 AI Yardım Masası** — SMS/WhatsApp/uygulama üzerinden %90 otomatik yanıt, zor sorular insan agronoma escalate; 5+ dil (TR, Kürtçe, Arapça, İngilizce, Almanca)
4. **Ekipman Booking + B2B Pazarı** — platform taraf olmuyor, sadece listing/booking/rating altyapısı; e-ticaret kanalında %2 komisyon

**9 Gelir Akışı (Yıl 2 hedefi ~14.8M USD):** E-ticaret komisyonu, ekipman premium üyelik, girdi şirketi sponsorluğu, reklam, premium abonelik (çiftçi odaklı — toplam ~8.25M) + Gıda Sanayii/Lojistik/Banka/TARSIM veri paketleri (B2B, yüksek marj — toplam ~6.55M).

**Çok paydaşlı veri ekosistemi (isimli örnekler):** Ülker Gıda, Bursayan Lojistik, Türk Tarım Bankası/Ziraatbank/VakıfBank, TARSIM — her biri platformdan farklı bir veri paketi alıp yıllık belirli bir gelir katkısı yapıyor olarak modellenmiş.

**Teknik altyapı uyumu (doğrudan bizim kod tabanımızla ilgili):**
- ✅ **Sentinel/Copernicus (ücretsiz uydu verisi)** — ATP zaten bunu kullanıyor (`COPERNICUS/S2_SR_HARMONIZED`)
- ✅ **Leaflet** — ATP zaten bunu kullanıyor (`MapPage.tsx`, `ParcelPage.tsx`)
- ⚠️ **PostGIS öngörülüyor, biz düz SQLite kullanıyoruz** — GeoJSON şu an sadece bir text kolonunda duruyor, gerçek mekansal sorgular (örn. "bana X km yarıçapındaki parselleri getir") gerekirse bu bir geçiş noktası olur
- Hedeflenen ölçek: 8000+ çiftçi, kubernetes/GCP/AWS auto-scaling — şu anki Render free tier kurulumu bu ölçeğin çok gerisinde, bilinçli bir MVP/pilot aşaması kararı olarak görülmeli

**Pazara giriş zaman çizelgesi:** Ay 3'te 100 çiftçi pilotu (Ankara) → Ay 6'da 500 çiftçi → Ay 12'de 4.000 çiftçi → Ay 18-20'de EBITDA pozitif (20K çiftçi) → Ay 24'te Series A.

---

## Ne bu proje
Tarım/parsel yönetimi + uydu görüntüsü tabanlı bitki analizi platformu.
FastAPI + SQLite backend, React/TypeScript/Vite PWA frontend.

## Yerel geliştirme
- Backend: `C:\Renta\backend\` — `python main.py` (port 8000)
- Frontend: `C:\Renta\frontend\` — `npm run dev` (port 5173)
- Tek tıkla başlatma: masaüstünde "ATP Platform" kısayolu (`C:\Renta\start-platform.bat`)
- Repo: `metonline/ATP` (GitHub, `main` branch)

## Canlı (Render, free tier)
- Backend: `https://atp-ji6n.onrender.com` (Web Service, Docker, root dir `backend`)
- Frontend: `https://atp-1-wr8s.onrender.com` (Static Site, root dir `frontend`, build: `npm install && npm run build`, publish dir `dist`)
- **Not:** Free tier'da kalıcı disk yok — SQLite (`ia_platform.db`) ve `satellite_images/` klasörü git'e commit'lenerek "kalıcı" tutuluyor; her deploy bu commit'lenmiş halden başlıyor. Gerçek kullanıcı verisiyle üretime geçmeden önce ücretli plan + persistent disk (ya da Postgres + S3/GCS) gerekir.

## Earth Engine kimlik doğrulama
- Service account: `atp-976@renta-platform-505621.iam.gserviceaccount.com`
- Key dosyası: `renta-key.json` (backend klasöründe, **git'e commit edilmiyor**, `.gitignore`'da)
- Render'da: Secret File olarak `/etc/secrets/renta-key.json`'a yüklü, `EE_SERVICE_ACCOUNT_KEY` env var bu yolu gösteriyor
- Kod: `main.py` içinde `initialize_earth_engine()` fonksiyonu — dosya varsa service account, yoksa yerel `ee.Authenticate()` oturumuna düşer
- **Önemli teknik not:** `get_ee_session()` (görüntü indirme için) artık `initialize_earth_engine()`'ın kullandığı credential objesini modül-seviyesinde önbelleğe alıp (`_ee_credentials`) yeniden kullanıyor — `ee.data.get_persistent_credentials()` sadece kişisel OAuth oturumunu bildiği için service account senaryosunda yanlış sonuç veriyordu, bu düzeltildi.

## Render ortam değişkenleri (backend)
- `SECRET_KEY` — JWT imzalama (rastgele üretildi, kayıtlı)
- `EE_SERVICE_ACCOUNT_KEY` = `/etc/secrets/renta-key.json`
- `BACKEND_BASE_URL` = `https://atp-ji6n.onrender.com` (kalıcı görüntü URL'leri için)
- `PYTHONUNBUFFERED` = `1` (print() loglarının anında görünmesi için)

## Render ortam değişkenleri (frontend)
- `VITE_API_URL` = `https://atp-ji6n.onrender.com`
- Redirect/Rewrite kuralı: `/*` → `/index.html` (Rewrite) — SPA routing için şart

## Bugün eklenen büyük özellikler
- **Profile sayfası:** hesap bilgileri, çiftlik detayları, şifre değiştirme
- **6 spektral indeks:** NDVI, NDRE, NDMI, EVI, SAVI, GNDVI — hepsi aynı Sentinel-2 görüntüsünden, sekmeli arayüzle gösteriliyor (`SatellitePage.tsx`)
- **Kalıcı görüntü depolama:** EE'nin süreli thumbnail linkleri yerine, backend bytes'ı indirip kendi `/satellite-static/` altında servis ediyor (parsel başına en fazla 3 görüntü tutuluyor, otomatik rotasyon)
- **MapPage UX:** parsel silme, uydu görüntüsü linki, çizim akışı tek adıma indirildi, harita boyut/zoom düzeltmeleri, adres/koordinat/parsel arama sonrası otomatik zoom
- **Service worker düzeltmesi:** API istekleri artık cache'lenmiyor, service worker sadece production build'de aktif
- **Kritik bug fix:** `handleSaveEditedParcel`'da eksik `preventDefault()` — düzenleme sonrası "kaydet" basınca tüm sayfa reload olup kullanıcıyı login'e atıyordu, düzeltildi
- **CORS:** wildcard (`*`) yerine belirli origin allowlist (localhost + production frontend)
- **Tam production deployment:** Render'da backend + frontend, service account ile Earth Engine

## Bilinen açık işler / sonraki sprint adayları
- **İki dillilik (TR/EN toggle)** — react-i18next ile, tüm sayfalardaki metinlerin çıkarılması gerekiyor (büyük iş, ayrı oturum)
- **Custom domain** — şu anki Render URL'leri (`atp-ji6n`, `atp-1-wr8s`) akılda kalıcı değil; Render subdomain'i sonradan değiştirilemiyor (sadece oluşturmada belirleniyor), gerçek çözüm kendi domain'ini bağlamak
- **Analiz sayfası** (dashboard'da "Yakında..." yer tutucusu) — zaman içinde biriken endeks verisiyle trend grafiği / parsel karşılaştırma / eşik tabanlı uyarılar doğal aday
- **Ada/Parsel araması mock veri döndürüyor** — gerçek TKGM entegrasyonu yapılmadı
- **Ölü endpoint:** `/api/parcels/{id}/satellite-images` eski MVP şemasına referans veriyor, çağrılırsa 500 verir (hiç kullanılmıyor ama temizlenebilir)
- **NDRE/NDMI renk aralıkları** literatür tahmini — gerçek görüntülerde çok soluk/doygun geliyorsa ince ayar gerekebilir

## Sık kullanılan komutlar
```powershell
# Yerel çalıştırma
cd C:\Renta\backend; python main.py
cd C:\Renta\frontend; npm run dev

# Git
cd C:\Renta
git status
git add <dosyalar>
git commit -m "..."
git push

# Render deploy loglarını izleme
# Dashboard > servis > Logs > Live tail
```
