"""
Migration: satellite_images tablosuna NDRE, NDMI, EVI, SAVI, GNDVI
kolonlarını ekler. Mevcut veriyi silmez. Tekrar çalıştırılsa da hata
vermez (idempotent).

Kullanım:
    python migrate_add_indices.py
"""
import sqlite3

DB_PATH = "ia_platform.db"

NEW_COLUMNS = [
    ("mean_ndre", "FLOAT"),
    ("ndre_url", "VARCHAR"),
    ("mean_ndmi", "FLOAT"),
    ("ndmi_url", "VARCHAR"),
    ("mean_evi", "FLOAT"),
    ("evi_url", "VARCHAR"),
    ("mean_savi", "FLOAT"),
    ("savi_url", "VARCHAR"),
    ("mean_gndvi", "FLOAT"),
    ("gndvi_url", "VARCHAR"),
]

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

cur.execute("PRAGMA table_info(satellite_images)")
existing_columns = {row[1] for row in cur.fetchall()}

added = []
for col_name, col_type in NEW_COLUMNS:
    if col_name not in existing_columns:
        cur.execute(f"ALTER TABLE satellite_images ADD COLUMN {col_name} {col_type}")
        added.append(col_name)

conn.commit()
conn.close()

if added:
    print(f"✓ Eklenen kolonlar: {', '.join(added)}")
else:
    print("✓ Kolonlar zaten mevcut, değişiklik yapılmadı")
