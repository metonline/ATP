# FMIS: Multi-Modal Data Ingestion Architecture
## Çiftçi-Centric ERP — Tüm Veri Türlerini Kabul Eden Platform

**Document Version:** 1.0  
**Date:** August 2026  
**Status:** Strategic Architecture Design  
**Purpose:** Define how IA Platform accepts and processes all data types (voice, image, video, text, sensors) into unified ERP system

---

## Executive Summary

**Core Principle:** Çiftçi en uygun yöntemle veri girsin. Platform otomatik işlesin.

IA Platform FMIS (Farm Information Management System) **omnichannel data capture** destekler:
- 🎙️ **Ses**: Komut, not, rapor (STT + NLP)
- 📸 **Görüntü**: Fatura, hastalık, kalite (OCR + Computer Vision)
- 🎬 **Video**: Tarla durumu, hasat, makine performans (Action Recognition)
- ✍️ **Elle Giriş**: Form, takvim, listeler
- 💬 **Yazılı**: SMS, WhatsApp, Email, Telegram
- 🔌 **Sensörler**: IoT, uydu, hava, drone, GPS
- 🥽 **AR (Artırılmış Gerçeklik)**: Canlı tanı (hastalık, kalite)

**Tüm veriler → Akıllı İşleme Motoru → Standardize ERP Veri → Modüller + Raporlar + Asistan**

**Sonuç:** Çiftçi hiç bilgisayar açmayıp da, tam bir ERP kullanabiliyor.

---

## 1. VERİ GIRIŞ KANALLARI (7 Ana Kanal + 2 Premium)

### 1.1 Sesli Veri Giriş (Speech Input)

**Teknoloji:**
- **Speech-to-Text (STT):** Google Cloud Speech-to-Text, AWS Transcribe
- **Natural Language Processing (NLP):** spaCy, BERT for Turkish
- **Intent Recognition:** Komut, soru, bilgi, gözlem
- **Entity Extraction:** Sayılar, kategoriler, tarihler, kişiler

**Sesli Giriş Türleri:**

#### A. Komut (Command)
```
Çiftçi: "Sulama başla"
├─ Intent: Aksiyon
├─ Hedef: FMIS.Agro
└─ Sonuç: Sulama işi başlatılır

Çiftçi: "Cankurtaran çağır"
├─ Intent: Acil aksiyon
├─ Hedef: Sistem + Danışman
└─ Sonuç: Uzman çağrısı + uyarı
```

#### B. Veri Giriş (Data Entry)
```
Çiftçi: "200 litre mazot, 50 litre gübre, 30 kg tohum"
├─ Extraction:
│  ├─ 200L → Mazot → Gider kategorisi
│  ├─ 50L → Gübre → Gider kategorisi
│  └─ 30kg → Tohum → Girdi kategorisi
├─ Kategorize: Enerji, Beslenme, Tohum
└─ Sonuç: Depo güncellenmi, gider kayıtları yapılmış

Çiftçi: "8 işçi çalıştı, 6 saat"
├─ Extraction: 8 kişi, 6 saat
├─ Kategorize: Personel bordrosu
└─ Sonuç: 8×6=48 saatlik bordro kaydı
```

#### C. Not Alma (Observation Logging)
```
Çiftçi: "Parsel A'da solüş ve sarılık görülüyor, 
         başka alanlardan daha kötü durumda"
├─ NLP: Hastalık belirtileri algılandı
├─ AI Tanı: Çinko eksikliği %75, Fungal %40
├─ Veri: Ses kaydı arşivlendi (kanıt)
└─ Sonuç: 
   ├─ Monitor modülüne: "Hastalık şüphesi"
   ├─ Asistan: "Uzman görüşü al" uyarısı
   └─ Finansal: Tedavi maliyeti tahmini (+500 TL)

Çiftçi: "Traktor motorunda anormal ses var"
├─ Sistem: Makine problemi algıladı
├─ Recommendation: Teknisyen çağır
└─ Sonuç: Preventive maintenance planlama
```

#### D. Rapor Diktatesi (Report Dictation)
```
Çiftçi (akşam, ofisinde): 
"Bugün sabahtan akşama kadar sordu bir iş oldu. 
Parsel A'nın kuzey kısmında hasat çalışmalarına başladık. 
6 işçi vardı, 8 saat çalıştılar. 
Saat 10'dan 18'e kadar hiç ara vermedik. 
Hava çok güzeldi, yağış ihtimali yok. 
Şimdiye kadar tahminen 14-15 ton hasat aldık. 
Kalitesi de gayet iyi, hastalık veya kuru ürün yok. 
Nakliye için yarın 2 araç gelmesi gerekiyor, 
çünkü Parsel B'de de hasat var."

↓ STT + NLP Analiz:

Extracted Data:
├─ İşlem: Hasat
├─ Parsel: A (kuzey kısmı)
├─ Personel: 6 işçi, 8 saat
├─ Saatler: 10:00-18:00
├─ Hava: Güzel (yağış riski düşük)
├─ Miktar: 14-15 ton (tahmini)
├─ Kalite: İyi (hastalık/kurutma yok)
├─ Lojistik: 2 araç gerekli (Parsel A+B)
├─ Durum: Çiftçi yorgun ama memnun (sesli ton analiz)
└─ Risk: Nakliye gecikmesi

Otomatik Raporlama:
├─ Günlük Faaliyet Raporu hazırlandı
├─ Market-Access: "14-15 ton domates hazır, kalite iyi"
├─ Operasyon: İşçi bordrosu hesaplandı (6×8 saat)
├─ Finansal: 
│  ├─ Gelir Tahmin: 14.5 ton × 1500 TL = 21.75K TL
│  ├─ Gider (personel): 6 işçi × 100 TL/saat × 8 = 4.8K TL
│  └─ Net Tahmin: 17K TL
├─ Lojistik: 2 araç rezervasyon önerisi
└─ Asistan: "Hasat finali günü. Kalite raporu: A-"
```

**Ses Giriş Teknik Özellikleri:**
- **Dil:** Türkçe (standart + diyalektler: Anadolu, Akdeniz vb.)
- **Gürültü İmunu:** Traktör motorun gürültüsünde bile çalışır
- **Çevrimdışı Mod:** Telefonda lokal model (bağlantı olmadan)
- **Sürekli Kaydedici:** Arka planda açık olabilir
- **Ses Arşivi:** Tüm kayıtlar saklanır (denetim, revizyon)

---

### 1.2 Görüntü Veri Giriş (Image Input)

**Teknoloji:**
- **OCR:** Tesseract, Google Vision API (fatura, belgeler)
- **Computer Vision:** YOLOv8, CNN (hastalık, kalite, obje tanı)
- **Image Classification:** TensorFlow (ürün tipi, olgunluk)
- **Handwriting Recognition:** Google Handwriting Recognition (el yazısı)

**Görüntü Giriş Türleri:**

#### A. Fatura/Belge Taraması (Document Scanning)
```
Çiftçi: Mazot faturasının fotoğrafını çekti

OCR Analiz:
├─ Tarih: 10.08.2026
├─ Tutar: 12,500 TL
├─ Ürün: Mazot
├─ Litre: 500L
├─ Birim Fiyat: 25 TL/L
└─ Tedarikçi: Aydem Akaryakıt

Sistem Kaydı:
├─ Gider: Enerji kategorisi
├─ Depo: Mazot stoğu +500L
├─ Finansal: 12,500 TL gider
├─ Asistan: "Mazot maliyeti normal" (versiyon kontrol)
└─ Kanıt: Orijinal fatura arşivlendi

Anomali Tespiti:
├─ Eğer fiyat normal değilse: "Fiyat yüksek, başka kaynaktan al?"
├─ Eğer çok sık alışsa: "Motor verimliliği kontrol ettir"
└─ Eğer az alışsa: "Uyarı: Stok tükenme riski"
```

#### B. Hastalık/Sorun Teşhisi (Disease/Problem Diagnosis)
```
Çiftçi: Şüpheli yaprak fotoğrafı çekti

Computer Vision Analiz:
├─ Image Preprocessing: Işık, açı normalleştir
├─ Feature Extraction: Yaprak deseni, renk, doku
├─ Model Prediction:
│  ├─ Powdery Mildew: 87% confidence
│  ├─ Early Blight: 8% confidence
│  ├─ Nutrient Deficiency: 5% confidence
│  └─ Normal: <1% confidence
└─ Recommendation: Antifungal spray (OCT 1-3)

Sistem Kaydı:
├─ Monitor Modülü: "Hastalık tespit edildi"
├─ Finansal: İlaçlama maliyeti +500 TL (bütçe)
├─ Asistan: 
│  ├─ "Acil ilaçlama gerekli"
│  ├─ "Uzman konsültasyon öner"
│  └─ "İlaç depodan 300 TL var mı, kontrol et"
├─ Lojistik: Antifungal sipariş (24 saat)
└─ Risk: "Gecikme = %30 verim kaybı"
```

#### C. Ürün Kalite Kontrolü (Quality Assessment)
```
Çiftçi: Hasattı domates fotoğrafını çekti

Computer Vision Analiz:
├─ Obje Tanı: Domates × 8 tane fotoğrafta
├─ Büyüklük Tahmini: Ortalama 180g
├─ Renk Analiz: Kırmızı, olgun
├─ Bozulma Tespiti: 
│  ├─ Çatlak: %5
│  ├─ Leke: %2
│  ├─ Ezilme: %1
│  └─ Normal: %92
├─ Kalite Puanı: 88/100 (A sınıfı)
└─ Fiyat Kategori: Premium (+15% fiyat)

Sistem Kaydı:
├─ Market-Access: "Kalite: A sınıfı, Premium fiyat"
├─ Finansal: 
│  ├─ Tahmini Gelir: 12 ton × 1500 TL × 1.15 = 20.7K TL
│  └─ Kalite Bonus: +2.1K TL
├─ Asistan: "İyi kalite! Premium alıcılara sun"
└─ Lojistik: "Soğuk zincir gerekli (bozulmayı önle)"
```

#### D. El Yazısı Okuma (Handwriting Recognition)
```
Çiftçi: Defterine yazılanları sayfanın fotoğrafını çekti

Handwriting Recognition Analiz:
"15 Temmuz - Parsel B ot biçimi başlandı
 8 işçi çalıştı, 3 saat
 Hava güzeldi, sorun yok"

↓ Parse ediliyor:

Extracted Data:
├─ Tarih: 15.07.2026
├─ İşlem: Ot biçimi
├─ Parsel: B
├─ Personel: 8 işçi, 3 saat
├─ Hava: İyi
├─ Sorunlar: Yok

Sistem Kaydı:
├─ Günlük Operasyon Log: Kaydedildi
├─ Personel: 8×3 saat bordro
├─ İş Cronolojisi: Timeline oluşturuldu
└─ Kalite: 100% (sorun yok)
```

#### E. QR/Barkod Okuma (QR/Barcode Scanning)
```
Çiftçi: Girdi paketinin QR kodunu tarattı

QR Data:
├─ Ürün: Domates Tohumu "Defne F1"
├─ Batch: 2024-05678
├─ Tarih: 10.08.2025 (süresi var, 1 yıl daha)
├─ Birim: 100 gram
├─ Sertifika: Sertifikalı (hastalık taşıması kontrol edilmiş)
└─ Tedarikçi: AgroSeed Co.

Sistem Kaydı:
├─ Depo: "Domates Tohumu 100g" (-100g)
├─ Finansal: Girdi maliyeti kaydedilmiş
├─ Sertifika: Otomatik doğrulanmış (süresi var)
├─ Asistan: "Tohum kalitesi OK, ekmeye hazır"
└─ İzlenebilirlik: QR → Ürün → Tarlası → Hasattan → Satış
```

**Görüntü Giriş Teknik Özellikleri:**
- **Çözünürlük:** Minimum 5MP (fotoğraf kalitesi önemli)
- **Işık Şartları:** Güneş ışığında bile çalışır
- **Açılar:** Çerçeve içine sığması yeterli
- **Arşiv:** Tüm fotoğraflar saklanır (izlenebilirlik)
- **Batch Processing:** Toplu fotoğraf yüklemesi destekli

---

### 1.3 Video Veri Giriş (Video Input)

**Teknoloji:**
- **Action Recognition:** OpenCV, MediaPipe (ne yapılıyor)
- **Object Detection:** Real-time YOLO (nesneler)
- **Scene Understanding:** CNN (bağlam)
- **Drone Processing:** Orthomosaic mapping, NDVI

**Video Giriş Türleri:**

#### A. Tarla Gezintisi (Field Walkthrough)
```
Çiftçi: Telefonuyla 2-3 dakikalık video çekti, tarlay gezinti

Video Analysis (Otomatik):
├─ Scene Understanding:
│  ├─ Yapılan İşler: Gözlenen operasyonlar
│  ├─ Bitki Durumu: NDVI, sağlık skoru
│  ├─ Hastalık Bölgeleri: Harita üzerine işaretlendi
│  └─ Harita Oluşturma: GPS + video coords
│
├─ Miktar Tahmini:
│  ├─ Bitkiler sayıldı
│  ├─ Büyüklük tahmini
│  └─ Verim Prediction: 14 ton (±10%)
│
├─ Kalite Analizi:
│  ├─ Sağlıklı bitki: %92
│  ├─ Hasta bitki: %5
│  ├─ Ölü bitki: %3
│  └─ Kalite Skoru: 88/100
│
└─ Hastalık Haritalaması:
   ├─ Powdery Mildew bölgesi (30% hastalılı)
   ├─ Early Blight (10% hastalılı)
   └─ Haritalandı (drone fotosu ile karşılaştırıldı)

Sistem Kaydı:
├─ Monitor: "Parsel durumu A-"
├─ Finansal: Tedavi maliyeti tahmin
├─ Asistan: "2 gün içinde ilaçlama gerekli"
├─ Harita: Hastalık bölgeleri görsel
└─ Video Arşiv: İlerisi ile karşılaştırma için
```

#### B. Hasat Süreci (Harvesting Process)
```
Çiftçi: Hasat sırasında 5 dakikalık video çekti

Video Analysis (Otomatik):
├─ İşçi Aktivitesi:
│  ├─ Kaç kişi çalışıyor: 6
│  ├─ Çalışma Hızı: 2-3 kutu/dakika per işçi
│  └─ Produktivite: %85 (normalde %80)
│
├─ Ürün Kalitesi:
│  ├─ Seçme Kalitesi: İyi (%92 kalite)
│  ├─ Hastalık Kontamı: %2
│  └─ Bozuk Ürün Atma: Evet (iyi uygulama)
│
├─ Hız Tahmini:
│  ├─ Hasat Hızı: 2 ton/saat
│  ├─ Tahmini Gün Çıkışı: 12 ton
│  └─ Toplam Verim Tahmini: 38 ton (sezonluk)
│
└─ İş Güvenliği:
   ├─ Koruma Ekipmanı: Evet
   ├─ Ergonomi: İyi
   └─ Riski: Düşük

Sistem Kaydı:
├─ Operasyon: Hasat +2 ton kaydedildi
├─ Personel: 6×8 saat bordro
├─ Finansal: Gelir tahmini güncelendi
├─ Kalite: Video referanslı (tartışma olunca kanıt)
└─ Optimizasyon: "Hız çok iyi, bu işçi grubu tercih et"
```

#### C. Makine Performans (Machine Performance)
```
Çiftçi: Traktörün çalışmasının videosunu çekti
(Motor sesi anormal)

Video + Audio Analysis:
├─ Motor Sesi: Anormal (frekans analizi)
├─ Duman: Erkek mavi tütü (yağ yanması)
├─ Hızlanma: Zor (güç kaybı)
├─ Vibrasyon: Fazla (mekanik sorun)
└─ Diagnosis: Benzin hattında tıkanıklık

Sistem Kaydı:
├─ Maintenance Alert: "Acil bakım gerekli"
├─ Teşhis: "Benzin filtresini kontrol et"
├─ Maliyet: Bakım +1500 TL
├─ Risk: "Motor arızası = hasat kaybı (günde 20K TL)"
└─ Öneri: "Teknisyen çağır, Pazartesi sabah"
```

#### D. Drone Görüntüsü (Drone Footage)
```
Çiftçi: Drone'dan video çekti (parsel sağlık haritası)

Drone Video Processing:
├─ Orthomosaic Map: Doğru harita oluşturuldu
├─ NDVI Calculation: Vejetasyon sağlığı haritası
├─ Hastalık Deseni:
│  ├─ Kuzey Bölge: Sağlıklı (NDVI 0.75)
│  ├─ Doğu Bölge: Hastalık (NDVI 0.55) ← İşaret
│  ├─ Güney: Normal
│  └─ Batı: Sağlıklı
│
├─ Verim Tahmini:
│  ├─ Sağlı bölge: 4 ton/ha
│  ├─ Hasta bölge: 2.5 ton/ha
│  └─ Ortalama: 3.5 ton/ha × 3ha = 10.5 ton tahmin
│
└─ İlaçlama Planlama:
   ├─ Doğu bölge pri­yoritesi
   ├─ Maliyet: 500 TL (hedefli ilaçlama)
   └─ Beklenen Sonuç: Verim +15% (3 ton olabilir)

Sistem Kaydı:
├─ Monitor: Drone haritası kaydedildi
├─ Finansal: İlaçlama maliyeti +500 TL
├─ Asistan: "Doğu bölgeyi hedefle, batı normal"
├─ Timeline: "2 gün içinde ilaçla"
└─ Trend: Drone görüntüleri karşılaştırmalı analize hazır
```

**Video Giriş Teknik Özellikleri:**
- **Çözünürlük:** 720p+ (daha iyi = 1080p)
- **Çerçeve Hızı:** 24-30 fps (akıcı görüntü)
- **Süre:** 1-10 dakika (uzunsa otomatik bölüne bölünür)
- **İşleme Zamanı:** 5-30 dakika (kalitesine göre)
- **Arşiv:** Tam video + extracted frames saklanır

---

### 1.4 Elle Giriş (Manual Input)

**Veri Giriş Yöntemleri:**

#### A. Mobil Form (Mobile Form)
```
Hızlı, 3-5 alanı 30 saniyede doldu:

📋 Günlük Giriş Formu:
├─ Tarih: [10.08.2026] (otomatik)
├─ Parsel: [Parsel A ▼]
├─ İşlem: [Sulama ▼]
├─ Detay: [200 litre sulama]
├─ Gözlem: [İyi (Emoji: 😊)]
└─ [KAYDET] [DEVAM ET]

(Sonrası otomatik kategorizasyon)
```

#### B. Web Form (Web Form - Detaylı)
```
Bilgisayardan yapılan detaylı rapor:

📊 Aylık Faaliyet Raporu:
├─ Parsel Bilgileri:
│  ├─ Parsel Adı: Parsel A
│  ├─ Ürün: Domates
│  ├─ Alan: 3 hektar
│  └─ Ekme Tarihi: 01.06.2026
│
├─ Operasyonlar (detaylı liste):
│  ├─ ☐ Sulama (10 gün, 2000 litre)
│  ├─ ☑ İlaçlama (3 kez, 500 TL)
│  ├─ ☑ Ot Biçimi (2 kez, 4000 TL)
│  └─ ☐ Gübreköl Yapılması
│
├─ Finansal Özet:
│  ├─ Gider: 12,000 TL
│  ├─ Tahmini Gelir: 45,000 TL
│  └─ Net Tahmin: 33,000 TL
│
└─ Notlar: [Detaylı yorum alanı]
    "Bu ay çok iyi ilerleme var. 
     Hasat Eylül ayında başlayacak."

[KAYDET] [YAZDIR] [PDF İNDİR]
```

#### C. Takvim Planlama (Calendar Planning)
```
Takvim üzerinden plan yapma:

📅 Ağustos 2026:
├─ 10 (Cmt): ✓ Sulama (tamamlandı)
├─ 12 (Pzt): ⏳ İlaçlama (planlı)
├─ 15 (Per): ⚠️ Hastalık Kontrol (tavsiye)
├─ 18 (Cum): ▶ Hasat Başlangıcı (planlı)
└─ 25 (Cum): ▢ Hasattan Sonra Temizlik

[Sürükle-Bırak ile tarih değiştirme]
[Bildirim: "İlaçlama günü dün geçti!"]
```

#### D. Listelerden Seçim (Dropdown Selection)
```
Hızlı seçimler:

📋 Hızlı İşlem Kaydı:
├─ Tarih: [10.08]
├─ İşlem: [Sulama ▼]
│  └─ Sulama
│     Traktör Kiralama
│     İlaçlama
│     Hasat
│     Gübreköl
│     Ot Biçimi
│     Diğer...
├─ Sonuç: [İyi ▼]
│  └─ İyi
│     Normal
│     Kötü
│     Problem Var
└─ [KAYDET]
```

#### E. Sürükle-Bırak (Drag-Drop)
```
Fotoğrafı forma sürükle-bırak:

📎 Fotoğraf Yükleme:
[SÜRÜKLEDİĞİNİZ FOTOĞRAFI BURAYA BIRAKYIN]
        ▼
    [Fatura_10.08.jpg]

Sistem Otomatik:
├─ OCR: Tutar 12,500 TL
├─ Kategori: Enerji/Mazot
├─ Tarih: 10.08.2026
└─ [ONAYLA] [DÜZEN­LE]
```

---

### 1.5 Yazılı Veri (Text Input via Chat Platforms)

**Teknoloji:**
- **SMS Parser:** Regex + NLP (kısaltmalar çözümleme)
- **WhatsApp Integration:** Twilio/WhatsApp API
- **Email Parser:** Extract structured data
- **Telegram Bot:** Command-based interface

**Yazılı Giriş Türleri:**

#### A. SMS Komutları
```
Çiftçi → SMS:
"SULAMA 200L 10:00"

SMS Parser:
├─ Komut: SULAMA
├─ Miktar: 200L
├─ Saat: 10:00
└─ Sistem: Sulama işi plana eklendi, bildirim gönder

---

Çiftçi → SMS:
"GIDER MAZOT 12500 500L"

Parser:
├─ Komut: GIDER
├─ Kategori: MAZOT
├─ Tutar: 12,500 TL
├─ Miktar: 500L
└─ Sistem: Gider kaydedildi, depo güncellendi
```

#### B. WhatsApp Mesaj + Dosya
```
Çiftçi → WhatsApp:
[Mesaj + Fatura fotoğrafı + Video]

"Mazot aldım. Fatura ekli. 
 Fiyat biraz yüksekti, kontrol ettim.
 Video'da makine normali görüyor."

Sistem (WhatsApp Integration):
├─ Metin Parse: "Mazot, fiyat yüksek"
├─ Fotoğraf OCR: 12,500 TL
├─ Video: Motor normal (ses analizi)
└─ Kaydı: Gider + uyarı "Fiyat %5 yüksek"
```

#### C. Email (Resmi Belge)
```
Çiftçi → Email:
[Mesaj + Uydu Görüntü + Drone Video + Hastalık Teşhisi]

"Drone görüntüsü ve hastalık analizi ektedir.
 Doğu bölge hastalık gösteriyor.
 Uzman önerisi için rapor bekliyorum."

Sistem (Email Integration):
├─ Metin: Doğu bölge hastalık
├─ Ek 1 (Uydu Görüntüsü): NDVI haritası
├─ Ek 2 (Drone): Orthomosaic map
├─ Ek 3 (Analiz): Teşhis raporu
└─ Kaydı: Tüm dosyalar arşivlendi, AI analiz başladı
```

#### D. Telegram Bot
```
Çiftçi → Telegram Bot:
/sulama_ekle miktar:200L parsel:A
/tarim_yapilan_listele
/bugun_giderler
/ciftligi_sağlığı

Bot → Sistem:
├─ /sulama_ekle: Sulama işi kaydedildi
├─ /tarim: Bugün yapılan işler listesini göster
├─ /gider: Günlük giderleri göster
└─ /health: Parsel sağlık raporunu göster

Örnek Bot Cevabı:
"📊 Bugün Yapılanlar:
 ✓ Sulama (200L)
 ✓ İlaçlama (500 TL)
 ✓ Personel (8 işçi, 8 saat)
 
 💰 Toplam Gider: 2,500 TL
 📈 Tahmini Gelir: +5,000 TL
 
 ⚠️ Hastalık Riski: Az
 🌤️ Hava: Yarın yağış ihtimali %20"
```

---

### 1.6 Sensörler & Harici Kaynaklar (Sensors & External Data)

**Teknoloji:**
- **IoT Integration:** MQTT, Zigbee (toprak nemi, sıcaklık)
- **API Integration:** TARBIL, TSMS, Copernicus, drone API
- **GPS Tracking:** Makine konumu, hareket
- **Satellite Data:** Uydu görüntüsü subscription

**Sensor Giriş Türleri:**

#### A. Toprak Sensörleri (Soil Sensors)
```
IoT Toprak Sensörleri (Parsel A'da 4 adet):
├─ Sensor 1 (Noktası): 
│  ├─ Toprak Nemi: 45% (optimal: 40-60%)
│  ├─ Sıcaklık: 24°C
│  ├─ EC (Tuzluluk): 1.2 mS/cm (normal)
│  └─ pH: 6.5 (domates için optimal)
│
├─ Sensor 2-4: (Benzer veriler)
│
└─ Sistem Analizi:
   ├─ Ortalama Nem: 46% (İyi)
   ├─ Sıcaklık Dağılım: 22-25°C (normal)
   ├─ Tuz Birikintisi: Yok
   ├─ pH Dağılımı: 6.3-6.7 (homojen)
   └─ Asistan: "Sulama gerekli mi? 2 gün içinde evet"
```

#### B. Hava Verisi (Weather Data - Otomatik)
```
TSMS (Türkiye Meteoroloji Sistemi) + OpenWeather:

Bugün Gerçek Zamanı:
├─ Sıcaklık: 24°C
├─ Nem: 65%
├─ Yağış: 0 mm
├─ Rüzgar: 8 km/h
├─ Ultraviyole İndeksi: 7 (orta)
└─ Hastalık Riski: Düşük (nem düşük)

7 Günlük Tahmin:
├─ Pazartesi: 28°C, %70 nem, 2mm yağış (hastalık riski ↑)
├─ Salı: 26°C, %60 nem (İlaçlama için uygun)
└─ ...

Sistem Önerisi:
"Pazartesi yağış bekleniyor. 
 İlaçlama Pazartesi akşamında yapmayın.
 Salı sabahı yapın (yağış sonrası, hastalık kontrol)."
```

#### C. Uydu Verisi (Satellite Data)
```
Copernicus Sentinel-2 (Otomatik Haftalık):

Haftalık NDVI Haritası:
├─ Sağlıklı Bölge (NDVI >0.70): 60% alanı
├─ Normal Bölge (0.50-0.70): 35% alanı
├─ Stres Bölgesi (NDVI <0.50): 5% alanı ← Kırmızı alarm
│
├─ Trend (Hafta öncesine göre):
│  ├─ Sağlıklı: +2% (İyi ilerleme)
│  ├─ Stres: +1% (İlaçlama sonrası iyileşiyor)
│  └─ Genel: ✓ Pozitif trend
│
└─ Asistan:
   "NDVI yükselişe geçti. İlaçlama etkili olmuş.
    Stres bölgesinde 3 gün daha ilaçlama gerekebilir."
```

#### D. Drone (Otonom Uçuş)
```
Haftalık Drone Uçuşu (Otomatik Zamanlanmış):

Her Pazartesi 10:00 → Drone otomatik kalkar:
├─ Rota: Parsel A + B'nin tamamı
├─ Çözünürlük: 2cm pixel (yüksek kalite)
├─ Çıkış: Orthomosaic harita + NDVI + 3D model
│
└─ Sistem Kaydı:
   ├─ Geçmiş Tarihlerle Karşılaştır (trend analiz)
   ├─ Hastalık Deseni Güncelle
   ├─ Verim Tahmini Yenile
   └─ Asistan: Haftalık durumu rapor et
```

#### E. GPS Makine Tracking (Machine GPS)
```
Traktöre Bağlı GPS Cihazı:

Hareket Verisi (Real-time):
├─ Konum: 39.8735°N, 35.2435°E
├─ Hız: 12 km/h
├─ Motor Hali: Açık
├─ Enerji Tüketimi: 8 L/saat
├─ Saat: 14:35
└─ İş: Sulama (program edilen rota)

Sistem Analizi:
├─ Sulama Rotu Tamamlandı: %65
├─ ETA: 30 dakika kaldı
├─ Verimlilik: Normal
└─ Asistan: "İş plana uygun ilerliyor"

Bakım Tespiti:
"Motor sıcaklığı normal (85°C)
 Performans beklendik gibi
 Sonraki bakım: 500 saat sonra (50 gün kaldı)"
```

---

### 1.7 Artırılmış Gerçeklik (Augmented Reality)

**Teknoloji:**
- **AR Engine:** ARKit (iOS), ARCore (Android)
- **Real-time Object Detection:** On-device CV
- **Overlay Data:** 3D modeller, etiketler

**AR Giriş Türleri:**

#### A. Canlı Hastalık Tanısı (Live Disease Diagnosis)
```
Çiftçi Aksiyon:
1. Telefonu hastalı yaprakta tutuyor
2. AR uygulamayı açıyor
3. Kamera = yaprakın görüntüsü

Sistem (Real-time):
├─ Yaprakı tanitıyor (Domates Powdery Mildew)
├─ Çerçeve içinde hastalık bölgelerini işaretliyor (kırmızı)
├─ Üzerine metin ekliyor: "Powdery Mildew 87%"
├─ İstatistikleri gösteriyor: 
│  "Bu bölgede %30 etkilenmiş"
├─ Özeri gösteriyor:
│  "✓ İlaçlama önerilir (tip: Sulfur)"
│  "⏱️ Zamanla: 48 saat içinde"
│  "💰 Maliyet: 250 TL"
│  "📈 Beklenen Sonuç: +2% verim"
└─ Kaydı: Fotoğraf + teşhis raporu otomatik kaydedilir
```

#### B. Kalite Kontrol (Quality Assessment)
```
Çiftçi Aksiyon:
1. Domates setini telefon kamerasında tutuyor
2. AR kalite uygulaması başlıyor
3. Sistem analizini yapıyor

Sistem (Real-time):
├─ Döndürmek için: Gözleme devam
├─ Her domatesii tanıyor ve puanlıyor:
│  ├─ Domates 1: 92/100 (kaliteli)
│  ├─ Domates 2: 88/100 (kaliteli)
│  ├─ Domates 3: 75/100 (normal)
│  ├─ Domates 4: 65/100 (standart)
│  └─ Domates 5: 45/100 (bozuk - ayır)
│
├─ Ortalama: 85/100 (A sınıfı)
├─ Fiyat Kategorisi: Premium (+15%)
└─ Kaydı: Kalite raporu + tavsiye (ayıklama)
```

#### C. Makine Teknik Bilgisi (Machine Technical Info)
```
Çiftçi Aksiyon:
1. Telefonu traktörü gösterecek şekilde tutuyor
2. AR uygulaması makineni tanıyor
3. 3D overlay gösteriliyor

Sistem (Augmented):
├─ 3D Model: Traktörün parçaları renkli
├─ Etiketler: Tüm önemli parçaların adları
├─ Bakım Verileri:
│  ├─ Motor: Son bakım 20 saat önce (OK)
│  ├─ Filtreler: Sonraki kontrol 80 saat sonra
│  ├─ Yağ: Sonraki değişim 150 saat sonra
│  └─ Kütür: Dişleri kontrol et (normal)
├─ Teknik Özellikleri: "6 silindir, 85 HP"
├─ Bakım Rehberi: İnteraktif (tıkla, video izle)
└─ Acil Durum: "Motor sorunsuz, ilk 500 saat içinde"
```

---

## 2. AKILLI VERİ İŞLEME MOTORU

Tüm veri kanallarından gelen veriler bu motorda normalleştirilir ve standardize edilir.

### 2.1 Verinin Otomatik İşlenmesi

```
Raw Data (Her Türlü Format)
        ↓
EXTRACTION (Bilgi Ayıklama)
├─ STT (ses → metin)
├─ OCR (görüntü → metin)
├─ Computer Vision (görüntü → anlamlı veri)
├─ NLP (yazı → yapılandırılmış veri)
└─ Sensor API (sayısal değerler)
        ↓
NORMALIZATION (Tutarlılaştırma)
├─ Dilek/Standart: Türkçe → Standart Turkish
├─ Ölçü Birimleri: 200L → 200, litre
├─ Tarihler: "Pazartesi" → 10.08.2026
├─ Kategoriler: "Mazot" → Enerji/Yakıt
└─ Veri Tipi: String → Number, Date, Category
        ↓
MULTI-MODAL FUSION (Birleştirme)
├─ Ses + Görüntü: "14 ton hasat" + Video → Verim kaydı
├─ Sensor + Uydu: IoT (nem) + Satellite (NDVI) → Sulama planı
└─ Rapor + History: Bugün + Geçmiş = Trend analizi
        ↓
VALIDATION (Doğrulama)
├─ Mantık Kontrolü: 5000 ton ≠ 3 hectare (anormal)
├─ Tutarlılık: Girdi miktar = Depo çıkışı (doğru mu?)
├─ Eksik Veri: Tarih girilmedi → Soru sorma
└─ Güvenilirlik: Video + sensor = %95, sadece ses = %60
        ↓
AUTOMATIC CATEGORIZATION (Kategorizasyon)
├─ Veri Tipi: Gider, gelir, girdi, operasyon, personel
├─ Modül: FMIS.Agro, FMIS.Finance, FMIS.Inventory
├─ Parsel: Hangisi? (otomatik bağlantı)
└─ İşlem: Sulama, ilaçlama, hasat, vb.
        ↓
CONTEXT UNDERSTANDING (Kontekst Anlama)
├─ Ne: İşlem tipi
├─ Ne Kadar: Miktar
├─ Ne Zaman: Tarih/saat
├─ Nerede: Parsel/bölge
├─ Neden: Plan'da yazılı mı?
└─ Kim: Çiftçi mi, işçi mi?
        ↓
Standardized, Structured Data → ERP Modules
```

### 2.2 Veri Kalitesi & Güven Puanlaması

```
Her veri için Güvenilirlik Puanı (0-100):

📸 Video + Sensor (Kaynak):       95/100
├─ Neden: Visual + Numerical dual confirmation
└─ Kullanım: Karar alma (kritik işlemler)

🎙️ Ses + NLP (Kaynak):             75/100
├─ Neden: STT hata riski (%5-10)
└─ Kullanım: Operasyon kaydı (teyit istenebilir)

📱 Elle Form Girişi (Kaynak):      90/100
├─ Neden: Doğrudan veri, insan kontrolü
└─ Kullanım: Finansal kaydı (güvenilir)

🔌 IoT Sensor (Kaynak):            85/100
├─ Neden: Otomatik ama kalibrasyona bağlı
└─ Kullanım: Sulama planı (uyarı gerekli)

📸 Fotoğraf OCR (Kaynak):          80/100
├─ Neden: OCR hata riski (%2-5)
└─ Kullanım: Fatura (teyit istenmeli)

Sistem Kuralı:
├─ Puan >90: Otomatik kaydedilir
├─ Puan 70-90: Kaydedilir, asistan teyit ister
└─ Puan <70: Kaydedilir ama uyarı koyulur
```

---

## 3. VERİ AKIŞI ÖRNEK SENARYO

(Detaylı örnek - başlıkta zaten var)

---

## 4. TEKNİK ALTYAPı (TECHNOLOGY STACK)

### 4.1 Data Ingestion Layer

```
SESLI VERİ:
├─ STT: Google Cloud Speech-to-Text API
│  └─ Türkçe, Diyalekt Destek
├─ NLP: spaCy + Custom Turkish BERT
│  └─ Intent Recognition, Entity Extraction
├─ Ses Arşiv: Firebase Storage (encrypted)
└─ Latency: Real-time (WebSocket)

GÖRÜNTÜ VERİSİ:
├─ OCR: Tesseract + Google Vision API
│  └─ %95+ doğruluk faturalar için
├─ Computer Vision: YOLOv8 + TensorFlow
│  └─ Hastalık, kalite, verim tahmini
├─ Arşiv: Firebase Storage + CDN
└─ Latency: 5-10 dakika (batch processing)

VİDEO VERİSİ:
├─ Processing: OpenCV + MediaPipe
├─ Action Recognition: Custom CNN
├─ Drone Integration: DroneLink API
├─ Arşiv: S3 + Amazon EFS
└─ Latency: 10-30 dakika (GPU processing)

YAZILI VERİ:
├─ SMS: Twilio SMS API + RegEx Parser
├─ WhatsApp: WhatsApp Cloud API + Webhook
├─ Email: SendGrid + MIME Parser
├─ Telegram: Telegram Bot API
└─ Latency: Real-time

SENSÖRLer:
├─ IoT: MQTT Broker (Mosquitto)
├─ GPS: Google Maps API
├─ Uydu: Copernicus DataHub API
├─ Hava: TSMS API + OpenWeather API
└─ Latency: Real-time (MQTT push)

AR:
├─ iOS: ARKit 5+
├─ Android: ARCore 1.20+
├─ Model Serving: TensorFlow Lite (on-device)
└─ Latency: <100ms (real-time overlay)
```

### 4.2 Data Processing Layer

```
STREAMING:
├─ Apache Kafka (high-volume data)
├─ Logstash (log aggregation)
└─ Redis (caching, session)

PROCESSING:
├─ Apache Spark (batch + stream)
├─ Python Scripts (NLP, CV)
└─ Node.js Workers (orchestration)

SEARCH & INDEX:
├─ Elasticsearch (full-text search)
├─ PostgreSQL (structured)
└─ MongoDB (unstructured)

DATA WAREHOUSE:
├─ Google BigQuery (analytics)
├─ Apache Hive (long-term storage)
└─ S3 (raw data archive)

QUALITY:
├─ Great Expectations (data validation)
├─ dbt (data transformation)
└─ Sentry (error tracking)
```

### 4.3 Application Layer (FMIS ERP Modules)

```
├─ FMIS.Agro (Production Planning)
├─ FMIS.Operations (Daily Tasks)
├─ FMIS.Inventory (Storage Management)
├─ FMIS.Procurement (Purchasing)
├─ FMIS.Finance (Accounting)
├─ FMIS.Marketplace (Sales)
└─ FMIS.Advisory (Expert Network)

(All using standardized data from Data Processing Layer)
```

---

## 5. DEPLOYMENT STRATEGY

### 5.1 Phased Rollout

```
PHASE 1 (M0-3): MVP
├─ Channels: Sesli + Mobil Form + SMS
├─ Modules: FMIS.Agro + FMIS.Finance
├─ Farmers: 50 pilot users
└─ Focus: Basic data capture & reporting

PHASE 2 (M3-6): Expand Channels
├─ Add: Görüntü, Video, WhatsApp, Email
├─ Modules: + FMIS.Operations, FMIS.Inventory
├─ Farmers: 500 users
└─ Focus: Multi-modal fusion, advanced analytics

PHASE 3 (M6-12): Full Integration
├─ Add: Sensörler, Uydu, Drone, AR
├─ Modules: + FMIS.Marketplace, FMIS.Advisory
├─ Farmers: 5,000+ users
└─ Focus: Real-time intelligence, automation

PHASE 4 (M12+): Scale & Optimize
├─ Refinement: Model accuracy, latency optimization
├─ Geographic: Regional customization (diyalektler)
├─ Integration: Government systems (TARBIL, LPIS)
└─ Farmers: 50,000+ users (full market penetration)
```

---

## 6. SECURITY & PRIVACY

```
DATA SECURITY:
├─ Encryption: AES-256 (data at rest)
├─ HTTPS: TLS 1.3 (data in transit)
├─ Authentication: OAuth 2.0 + MFA
└─ Audit: All actions logged

FARMER DATA PRIVACY (KVKK Compliance):
├─ Ownership: Farmer owns all their data
├─ Portability: Export to JSON/CSV anytime
├─ Deletion: Right to be forgotten (GDPR-aligned)
├─ Consent: Explicit opt-in for each data type
└─ Transparency: What we store, how we use it

VOICE RECORDINGS:
├─ Farmer can delete: Anytime
├─ Retention: 1 year default (customizable)
├─ Encryption: Stored encrypted
└─ Access: Only necessary AI processes

IMAGE/VIDEO ARCHIVE:
├─ Farmer control: Can delete anytime
├─ Retention: 3 years (historical analysis)
├─ Anonymization: PII removed from reports
└─ Backup: Redundant backup (disaster recovery)
```

---

## 7. SUCCESS METRICS

```
DATA CAPTURE:
├─ Multi-modal adoption: >80% çiftçi ≥2 kanal kullanır
├─ Entry time: <5 dakika/gün operasyon kaydı
├─ Accuracy: >90% automated categorization success
└─ Latency: <30 dakika speech-to-action

DATA QUALITY:
├─ Anomaly detection: %95 false-positive rate <5%
├─ Data completeness: <2% missing critical fields
├─ Validation success: >95% pass quality checks
└─ User correction rate: <3% (sistem doğru çalışıyor)

BUSINESS IMPACT:
├─ Decision making: 50% faster (data-driven)
├─ Cost reduction: 15% giderlerde tasarruf
├─ Revenue increase: 20% gross margin artış
├─ User satisfaction: >4.5/5 stars (Net Promoter Score >70)
└─ Retention: >85% monthly active users 6+ months
```

---

## Conclusion

**FMIS Multi-Modal Data Ingestion Architecture**:
- ✅ Çiftçi en uygun şekilde veri girişi yapabiliyor
- ✅ Platform otomatik işliyor, kategorize ediyor, raporluyor
- ✅ Tüm veri türleri entegre edilebiliyor
- ✅ Gerçek zamanlı intelligence & asistan uyarıları
- ✅ Scalable, secure, farmer-centric ERP

**Sonuç:** Çiftçi hiç bilgisayar açmayıp da, tam bir işletme yönetim sistemi (ERP) kullanabiliyor. El'tutulur faydalar: daha iyi hasat, daha az maliyet, daha fazla kâr.

---

**Document Owner:** Chief Technology Officer / Product Lead  
**Review Cycle:** Quarterly  
**Next Update:** M3 (Phase 1 pilot learnings)  
**Last Updated:** August 2026
