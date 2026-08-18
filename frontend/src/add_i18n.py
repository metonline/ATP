content = open("main.tsx", "r", encoding="utf-8").read()

if "import './i18n'" not in content:
    content = content.replace(
        "import React",
        "import './i18n'\nimport React"
    )

open("main.tsx", "w", encoding="utf-8").write(content)
print("✅ i18n added!")
