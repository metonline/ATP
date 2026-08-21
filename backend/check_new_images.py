"""
Render Cron Job'un düzenli (örn. günlük) çalıştıracağı script.
Tüm aktif parselleri kontrol eder, EE'de gerçekten yeni bir Sentinel-2
görüntüsü varsa (parselin son geçişinden bu yana) fetch'i tetikler.

Neden ayrı bir Cron Job kaynağı (Render'da), FastAPI süreci içinde
zamanlayıcı (APScheduler vb.) değil: Render'ın free tier Web Service'i
15 dakika boşta kalınca "uykuya" geçiyor — süreç içi bir zamanlayıcı,
uygulama uykudayken hiç çalışmaz, tam da zamanında tetiklenmesi gereken
bir işi kaçırır. Cron Job kaynağı, web servisinden bağımsız, kendi
zamanında ayağa kalkıp işini yapıp kapanıyor.

Kullanım (yerel test):
    python check_new_images.py

Render Cron Job kurulumu:
    Command: python check_new_images.py
    Schedule: 0 3 * * *   (her gün UTC 03:00 gibi, gündüz saatleri dışı)
"""
from main import check_and_refresh_all_parcels

if __name__ == "__main__":
    result = check_and_refresh_all_parcels()
    print(f"Özet: {result['checked']} parsel kontrol edildi, {result['refreshed']} tanesi yenilendi.")
