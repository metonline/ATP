content = open("DashboardPage.tsx", "r", encoding="utf-8").read()

if "useTranslation" not in content:
    content = content.replace(
        "import React",
        "import { useTranslation } from 'react-i18next';\nimport React"
    )

content = content.replace(
    "export default function DashboardPage() {",
    "export default function DashboardPage() {\n  const { t } = useTranslation();"
)

content = content.replace("Hoş Geldiniz", 't("dashboard.welcome")')
content = content.replace("Parselleri", 't("dashboard.parcels")')
content = content.replace("Toplam Alan", 't("dashboard.totalArea")')

open("DashboardPage.tsx", "w", encoding="utf-8").write(content)
print("✅ DashboardPage fixed!")
