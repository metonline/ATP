content = open('main.py', 'r', encoding='utf-8').read()

# allow_origins'i wildcard'a çevir
old_cors = '''allow_origins=os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,https://atp-1-wr8s.onrender.com"
    ),'''

new_cors = '''allow_origins=["*"],'''

content = content.replace(old_cors, new_cors)

open('main.py', 'w', encoding='utf-8').write(content)
print('✅ CORS fixed!')
