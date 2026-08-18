content = open("main.py", "r", encoding="utf-8").read()

# get_current_farmer function'ı düzelt
old = '''def get_current_farmer(token: str = None, db: Session = Depends(get_db)) -> Farmer:'''

new = '''def get_current_farmer(token: str, db: Session) -> Farmer:'''

content = content.replace(old, new)

open("main.py", "w", encoding="utf-8").write(content)
print("✅ get_current_farmer fixed!")
