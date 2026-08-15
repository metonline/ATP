from database import SessionLocal, Farmer, init_db
from auth import get_password_hash

init_db()
db = SessionLocal()

# Eski hesabı sil
old = db.query(Farmer).filter(Farmer.email == 'test2@farm.com').first()
if old:
    db.delete(old)
    db.commit()

# Yeni hesap - doğru hash
try:
    f = Farmer(
        email='test2@farm.com',
        username='testfarm',
        password_hash=get_password_hash('password123'),
        full_name='Test Farmer',
        is_active=True,
        is_verified=True
    )
    db.add(f)
    db.commit()
    print('✓ Account created successfully')
except Exception as e:
    print(f'✗ Error: {e}')
finally:
    db.close()