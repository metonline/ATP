content = open("App.tsx", "r", encoding="utf-8").read()

if "LanguageSwitcher" not in content:
    content = content.replace(
        "import { BrowserRouter",
        "import { LanguageSwitcher } from './components/LanguageSwitcher';\nimport { BrowserRouter"
    )

content = content.replace(
    "<Router>",
    """<Router>
      <div className="flex justify-end p-4 bg-gray-100">
        <LanguageSwitcher />
      </div>"""
)

open("App.tsx", "w", encoding="utf-8").write(content)
print("✅ LanguageSwitcher added!")
