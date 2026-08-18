content = open("main.tsx", "r", encoding="utf-8").read()

lines = content.split("\n")
new_lines = []
i18n_seen = False
for line in lines:
    if "import './i18n'" in line:
        if not i18n_seen:
            new_lines.append(line)
            i18n_seen = True
    else:
        new_lines.append(line)

open("main.tsx", "w", encoding="utf-8").write("\n".join(new_lines))
print("✅ Duplicate removed!")
