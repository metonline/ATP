import sqlite3

conn = sqlite3.connect("ia_platform.db")
cur = conn.cursor()
cur.execute("SELECT id, email, username, is_approved, is_admin FROM farmers")
rows = cur.fetchall()

print(f"{'id':<4} {'email':<25} {'username':<15} {'is_approved':<12} {'is_admin'}")
for row in rows:
    print(f"{row[0]:<4} {row[1]:<25} {row[2]:<15} {str(row[3]):<12} {row[4]}")

conn.close()
