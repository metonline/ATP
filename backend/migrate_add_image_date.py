"""
Migration: satellite_images tablosuna image_date kolonu ekler
(uydunun görüntüyü gerçekten çektiği tarih, akıllı yenileme kontrolü için).
Mevcut veriyi silmez. Tekrar çalıştırılsa da hata vermez (idempotent).

Kullanım:
    python migrate_add_image_date.py
"""
import sqlite3

DB_PATH = "ia_platform.db"

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

cur.execute("PRAGMA table_info(satellite_images)")
existing_columns = {row[1] for row in cur.fetchall()}

if "image_date" not in existing_columns:
    cur.execute("ALTER TABLE satellite_images ADD COLUMN image_date DATETIME")
    conn.commit()
    print("✓ Eklenen kolon: image_date")
else:
    print("✓ Kolon zaten mevcut, değişiklik yapılmadı")

conn.close()
