content = open("LoginPage.tsx", "r", encoding="utf-8").read()

if "useTranslation" not in content:
    content = content.replace(
        "import { useNavigate",
        "import { useTranslation } from 'react-i18next';\nimport { useNavigate"
    )

content = content.replace("Giriş Yap", "t('login.title')")
content = content.replace("Şifre", "t('login.password')")

open("LoginPage.tsx", "w", encoding="utf-8").write(content)
print("✅ LoginPage translated!")
