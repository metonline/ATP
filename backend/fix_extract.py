content = open("main.py", "r", encoding="utf-8").read()

# extract_token_from_header parametresini düzelt
old = '''def extract_token_from_header(authorization: Optional[str] = Header(None)) -> Optional[str]:'''

new = '''def extract_token_from_header(authorization: Optional[str]) -> Optional[str]:'''

content = content.replace(old, new)

open("main.py", "w", encoding="utf-8").write(content)
print("✅ extract_token_from_header fixed!")
