content = open("RegisterPage.tsx", "r", encoding="utf-8").read()

# useTranslation import'ı ekle
if "useTranslation" not in content:
    content = content.replace(
        "import { useNavigate",
        "import { useTranslation } from 'react-i18next';\nimport { useNavigate"
    )

# Türkçe text'leri i18n ile değiştir
content = content.replace("Üye Ol", "t('register.title')")
content = content.replace("Ad Soyad", "t('register.fullName')")
content = content.replace("Email", "t('register.email')")
content = content.replace("Kullanıcı Adı", "t('register.username')")
content = content.replace("Şifre", "t('register.password')")

open("RegisterPage.tsx", "w", encoding="utf-8").write(content)
print("✅ RegisterPage translated!")
