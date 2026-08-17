"""
Migration: satellite_images tablosuna NDVI kolonları ekler.
Mevcut veriyi silmez. Tekrar çalıştırılsa da hata vermez (idempotent).

Kullanım:
    python migrate_add_ndvi.py
"""
import sqlite3

DB_PATH = "ia_platform.db"

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

cur.execute("PRAGMA table_info(satellite_images)")
existing_columns = {row[1] for row in cur.fetchall()}

added = []

if "mean_ndvi" not in existing_columns:
    cur.execute("ALTER TABLE satellite_images ADD COLUMN mean_ndvi FLOAT")
    added.append("mean_ndvi")

if "ndvi_url" not in existing_columns:
    cur.execute("ALTER TABLE satellite_images ADD COLUMN ndvi_url VARCHAR")
    added.append("ndvi_url")

conn.commit()
conn.close()

if added:
    print(f"✓ Eklenen kolonlar: {', '.join(added)}")
else:
    print("✓ Kolonlar zaten mevcut, değişiklik yapılmadı")
