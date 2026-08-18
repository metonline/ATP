content = open("DashboardPage.tsx", "r", encoding="utf-8").read()

content = content.replace("t(\"dashboard.welcome\")", "{t(\"dashboard.welcome\")}")
content = content.replace("t(\"dashboard.parcels\")", "{t(\"dashboard.parcels\")}")
content = content.replace("t(\"dashboard.totalArea\")", "{t(\"dashboard.totalArea\")}")

open("DashboardPage.tsx", "w", encoding="utf-8").write(content)
print("✅ DashboardPage fixed!")
