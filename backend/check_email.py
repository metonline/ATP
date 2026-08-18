import sqlite3

conn = sqlite3.connect("ia_platform.db")
cur = conn.cursor()
cur.execute("SELECT id, email, username, is_active FROM farmers WHERE email = ?", ("mg2@test.com",))
rows = cur.fetchall()

if not rows:
    print("Bu e-posta ile kayıtlı hiçbir hesap yok.")
else:
    for row in rows:
        print(f"id={row[0]}  email={row[1]}  username={row[2]}  is_active={row[3]}")

conn.close()
