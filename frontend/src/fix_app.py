content = open("App.tsx", "r", encoding="utf-8").read()

# Router'ı div'e sarıp LanguageSwitcher'ı dışına koy
old = """<Router>
      <div className="flex justify-end p-4 bg-gray-100">
        <LanguageSwitcher />
      </div>
      <Routes>"""

new = """<div className="flex justify-end p-4 bg-gray-100">
        <LanguageSwitcher />
      </div>
      <Router>
      <Routes>"""

content = content.replace(old, new)

# Router kapanışını düzelt
content = content.replace("</Routes>\n    </Router>", "</Routes>\n      </Router>\n    </div>")

open("App.tsx", "w", encoding="utf-8").write(content)
print("✅ LanguageSwitcher fixed!")
