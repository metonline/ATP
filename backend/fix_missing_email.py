"""
farmers tablosunda email kolonu NULL olan hesapları bulur ve
username bir e-posta adresine benziyorsa (içinde '@' varsa) email = username
olarak düzeltmeyi önerir. Hiçbir şeyi sormadan otomatik değiştirmez,
önce mevcut durumu gösterir.

Kullanım:
    python fix_missing_email.py
"""
import sqlite3

DB_PATH = "ia_platform.db"

conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

cur.execute("SELECT id, email, username, full_name FROM farmers WHERE email IS NULL OR email = ''")
rows = cur.fetchall()

if not rows:
    print("✓ email kolonu NULL olan hesap yok, düzeltilecek bir şey bulunamadı.")
else:
    print(f"{len(rows)} hesapta email eksik:\n")
    fixable = []
    for row in rows:
        print(f"  id={row['id']}  username={row['username']!r}  full_name={row['full_name']!r}  email={row['email']!r}")
        if row['username'] and '@' in row['username']:
            fixable.append(row)

    if fixable:
        print(f"\nBunlardan {len(fixable)} tanesinin username'i e-posta adresine benziyor, email = username olarak düzeltilebilir:")
        for row in fixable:
            print(f"  id={row['id']}: email -> {row['username']!r}")

        confirm = input("\nBu düzeltmeyi uygulamak istiyor musun? (evet/hayir): ").strip().lower()
        if confirm in ("evet", "e", "yes", "y"):
            for row in fixable:
                cur.execute("UPDATE farmers SET email = ? WHERE id = ?", (row['username'], row['id']))
            conn.commit()
            print(f"✓ {len(fixable)} hesap güncellendi.")
        else:
            print("Değişiklik yapılmadı.")
    else:
        print("\nusername alanları e-posta formatında değil, otomatik düzeltilemedi. Elle karar vermen lazım.")

conn.close()
