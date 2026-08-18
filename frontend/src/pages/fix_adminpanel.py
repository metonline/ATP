content = open("AdminPanel.tsx", "r", encoding="utf-8").read()

# fetchPendingUsers'ı güncelle
old = '''try {
      setLoading(true);
      const response = await fetch('''

new = '''try {
      setLoading(true);
      console.log("Fetching pending users...", token);
      const response = await fetch('''

# Error handling
old2 = '''} catch (err: any) {
      setError(err.message || "Veri yüklemesi başarısız");
    }'''

new2 = '''} catch (err: any) {
      console.error("Error fetching pending users:", err);
      setError(err.message || "Veri yüklemesi başarısız");
    }'''

content = content.replace(old, new)
content = content.replace(old2, new2)

open("AdminPanel.tsx", "w", encoding="utf-8").write(content)
print("✅ Added debug logs")
