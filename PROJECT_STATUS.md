# ATP (Akıllı Tarım Platformu / Renta Platform) — Proje Durumu

**Son güncelleme:** 18 Ağustos 2026

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
