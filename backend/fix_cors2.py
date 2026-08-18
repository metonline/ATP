import re

content = open("main.py", "r", encoding="utf-8").read()

# allow_origins'i wildcard'a çevir
content = re.sub(
    r"allow_origins\s*=\s*os\.getenv\([^)]+\)\.split",
    'allow_origins=["*"]',
    content
)

open("main.py", "w", encoding="utf-8").write(content)
print("✅ CORS fixed!")
