content = open("App.tsx", "r", encoding="utf-8").read()

# return'i düzelt
content = content.replace(
    "return (",
    "return (\n    <>"
)

content = content.replace(
    ");\n}",
    "    </>\n  );\n}"
)

open("App.tsx", "w", encoding="utf-8").write(content)
print("✅ App.tsx fixed!")
