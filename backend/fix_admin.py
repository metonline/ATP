content = open("main.py", "r", encoding="utf-8").read()

old = '''def get_current_admin(token: str = None, db: Session = Depends(get_db)) -> Farmer:
    """Verify JWT token and return current farmer (must be admin)"""
    farmer = get_current_farmer(token, db)
    if not farmer.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return farmer'''

new = '''def get_current_admin(token: str, db: Session) -> Farmer:
    """Verify JWT token and return current farmer (must be admin)"""
    farmer = get_current_farmer(token, db)
    if not farmer or not farmer.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return farmer'''

content = content.replace(old, new)
open("main.py", "w", encoding="utf-8").write(content)
print("✅ get_current_admin fixed!")
