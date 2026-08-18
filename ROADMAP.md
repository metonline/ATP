# ATP Platform — Yol Haritası

**Oluşturulma:** 18 Ağustos 2026
**Kaynak:** `PROJECT_STATUS.md` (mevcut durum) + 3 iş planı dokümanı (`docs/`)

## Nasıl sıralandı

İş planları modülleri paralel/eşit önem sırasında sunuyor, ama teknik olarak **sıralı** ilerlemek daha mantıklı — bazı modüller diğerlerinin üzerine kuruluyor. Sıralama mantığı:

1. **Önce pazara çıkmaya hazır olmak** (Faz 0) — 20-100 çiftçilik pilot için gerçek kullanıcı verisi tutacaksak, şu anki "free tier + git'e commit'lenen SQLite" kurulumu yeterli değil, KVKK yok.
2. **Başladığımız modülü bitirmek** (Faz 1) — FMIS.Monitor'ün çekirdeği var, yarım bırakmadan tamamlamak, yeni modüle geçmekten daha değerli.
3. **Mimari temel taşını erken atmak** (Faz 2) — çoklu paydaş sistemi (Uzman/B2B/Tüketici rolleri), sonradan yama yapmak yerine, Uzman Pazaryeri/Helpdesk/B2B'den ÖNCE kurulmalı.
4. **Geri kalan modülleri, birbirine bağımlılıklarına göre** (Faz 3+).

---

## Faz 0: Pilot'a Hazırlık (20-100 çiftçi öncesi zorunlu)

- [ ] **KVKK uyumluluğu** — gizlilik politikası sayfası, kayıt sırasında açık rıza onayı, "verilerimi indir/sil" özelliği
- [ ] **Postgres'e geçiş** (SQLite yerine) — Kod zaten hazır (`DATABASE_URL` env var, `database.py`'de "SQLite for MVP, scales to PostgreSQL later" yorumu). **Neden erken yapılmalı, geç değil:** sorun veri hacmi değil, SQLite'ın tek dosya/tek sunucu sınırı — iş planındaki "auto-scaling, çoklu sunucu" hedefiyle yapısal olarak uyumsuz. Veri hâlâ test aşamasındayken (gerçek çiftçi verisi yokken) yapmak, üretimde sıfır kesinti toleransıyla yapmaktan çok daha ucuz/güvenli.
- [ ] **🐛 Bilinen hata — görüntü dosyası/DB satırı tutarsızlığı:** Her fetch yeni bir `SatelliteImage` satırı oluşturuyor (trend grafiği için doğru, geçmiş veri korunmalı), ama diskteki dosyalar parsel başına sadece 3 ile sınırlı (`cleanup_old_satellite_images`). 4. fetch'ten sonra eski satırların `ndvi_url` vb. alanları hâlâ DB'de duruyor ama işaret ettikleri dosya silinmiş oluyor — Analiz sayfası geçmişe gidince kırık görsel riski var. **Çözüm yönü:** sayısal değerleri (`mean_ndvi` vb.) süresiz sakla (zaten öyle), ama görselleri ya S3/GCS gibi kalıcı bir depoya taşı (sınırsız saklanabilir), ya da eski satırlarda `ndvi_url`'i null'a çekip UI'da "bu tarihe ait görsel artık mevcut değil, sadece sayısal değer" diye göster.
- [ ] **Kalıcı dosya depolama** — Postgres veri tarafını çözer ama `satellite_images/` klasöründeki PNG dosyaları ayrı bir sorun; Render disk (Postgres'le birlikte otomatik gelmiyor) ya da S3/GCS gerekiyor
- [ ] **Custom domain** — `atp-ji6n.onrender.com` yerine akılda kalıcı bir adres
- [ ] **Hata izleme/loglama** — Sentry ya da benzeri (şu an sadece `print()` + Render logları var, üretimde yetersiz)
- [ ] **Yedekleme stratejisi** — veritabanı için düzenli otomatik yedek (mgbric'teki disk krizinden ders: rotasyonlu, sınırlı sayıda yedek)
- [ ] **CORS'u gerçek domain'e daralt** (şu an localhost + tek Render URL'i, custom domain eklenince güncellenmeli)

## Faz 1: FMIS.Monitor'ü Tamamla (başladığımız modül)

- [ ] **Analiz sayfası** (dashboard'daki "Yakında..." yer tutucusu) — zaman içinde biriken 6 endeksle trend grafiği, parsel karşılaştırma
- [ ] **Eşik tabanlı otomatik uyarılar** — NDVI 0.1+ düşüş, NDMI kritik kuraklık gibi durumlarda bildirim
- [ ] **Gerçek Ada/Parsel arama** — şu an mock veri dönüyor, TKGM/LPIS entegrasyonu gerekli
- [ ] **TSMS hava durumu entegrasyonu** — ücretsiz devlet kaynağı, sıcaklık/yağış/don riski uyarıları
- [ ] **TARSIM geçmiş verim verisi** — parsel bazlı tarihsel karşılaştırma için
- [ ] **AI hastalık teşhisi** — yaprak fotoğrafı yükleme → CNN modeli → teşhis + tedavi önerisi (72 saat erken uyarı hedefi; muhtemelen ayrı bir ML altyapısı/servis gerektirir)
- [ ] **NDRE/NDMI renk kalibrasyonu** — gerçek görüntülerde ince ayar (küçük iş, aklında olsun)
- [ ] **Ölü endpoint temizliği** — `/api/parcels/{id}/satellite-images` (eski MVP şemasına referans veriyor)

## Faz 2: Çoklu Paydaş Mimarisi (diğer modüllerden ÖNCE)

- [ ] **Rol sistemi tasarımı** — `Farmer` dışında `Advisor`/`Expert`, `B2B Buyer`, `Consumer` rolleri; her birinin farklı yetki/görünürlük seviyesi
- [ ] **Auth/JWT'yi role-aware hale getirme** — token'a rol bilgisi eklenmesi, endpoint'lerde rol bazlı yetkilendirme
- [ ] **Rol bazlı frontend routing** — her rolün kendi dashboard'u/sayfa seti

*Not: Bu fazı atlayıp doğrudan Uzman Pazaryeri ya da B2B modülüne geçmek, sonradan tüm auth sistemini yeniden yazmak anlamına gelir — iş planında da bu risk "baştan tasarlanmalı" diye vurgulanmıştı.*

## Faz 3: FMIS.Agro (Üretim Planlama ERP)

- [ ] Parsel bazlı 90 günlük ekim takvimi / görev planı veri modeli
- [ ] Günlük rutin sistemi (sabah brifing / akşam raporlama)
- [ ] Hektar bazlı maliyet takibi (tohum, işçilik, su, ekipman)
- [ ] Haftalık danışman check-in akışı (Faz 2'deki Advisor rolüne bağımlı)

## Faz 4: FMIS.AI-Helpdesk

- [ ] Chatbot altyapısı (kural bazlı ya da LLM destekli — mimari kararı gerekli)
- [ ] Bilgi kütüphanesi (başlangıç: 100 makale hedefi)
- [ ] Uzmana escalation akışı (Faz 2'deki Advisor rolüne bağımlı)
- [ ] Çok dilli destek düşünülüyorsa, ertelenen TR/EN toggle işiyle birleştirilebilir

## Faz 5: Uzman Danışman Pazaryeri

- [ ] Uzman profili + değerlendirme/rating sistemi
- [ ] Proje bazlı fiyatlama / teklif-kabul akışı
- [ ] Ödeme/komisyon altyapısı (şu an platformda **hiç ödeme sistemi yok** — bu, ilk gerçek ödeme entegrasyonu olacak)

## Faz 6: FMIS.Equipment (Ekipman Pazaryeri)

- [ ] Listeleme (ekipman sahibi ilanları)
- [ ] Booking/takvim sistemi
- [ ] Rating sistemi
- [ ] "Taraf olmama" modeli (Doküman 2'deki gibi — platform sadece altyapı, sözleşme taraflar arası) mı, yoksa escrow'lu tam aracılık mı — iş kararı gerekiyor

## Faz 7: FMIS.Market-Access (B2B + B2C)

- [ ] B2B: gıda şirketi tedarik eşleştirme, hasat takvimi paylaşımı
- [ ] B2C: QR kod ile çiftlik-tüketici izlenebilirlik (blockchain iş planında geçiyor ama basit bir veritabanı kaydıyla da başlanabilir, blockchain sonradan eklenebilir)

## Faz 8: FMIS.Livestock

- [ ] Ayrı veri modeli (hayvan, sağlık kaydı, sensör verisi)
- [ ] Giyilebilir sensör entegrasyonu (donanım ortaklığı gerektirir, teknik değil iş geliştirme bağımlılığı)
- [ ] AI teşhis modeli

## Kesişen / her fazı etkileyebilecek işler

- [ ] **Çok-modlu veri girişi** (ses, SMS/WhatsApp, video) — belirli bir modülle sınırlı değil, farklı modüllere aşamalı eklenebilir
- [ ] **İki dillilik (TR/EN)** — ayrı oturumda ele alınacak (react-i18next)
- [ ] **PostGIS'e geçiş** — mekansal sorgular gerçek ihtiyaç haline gelince (şu an SQLite+GeoJSON text yeterli)

---

## Kullanım notu

Bu liste, iş planlarındaki *hedeflerin* teknik karşılığı — zaman çizelgesi (Ay 3/6/12 gibi) iş planında ayrı duruyor, burada değil. Her oturumda hangi maddeyle ilgilendiysek işaretleyip `PROJECT_STATUS.md`'deki "Bugün eklenen özellikler" listesine taşımak iyi bir alışkanlık olur.
