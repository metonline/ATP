with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

imports = "import PrivacyPolicy from './pages/PrivacyPolicy';\nimport AdminPanel from './pages/AdminPanel';"
if 'PrivacyPolicy' not in content:
    content = content.replace('import {', imports + '\nimport {')

routes = """    {
      path: '/privacy-policy',
      element: <PrivacyPolicy />
    },
    {
      path: '/admin',
      element: <AdminPanel />
    }"""

if "'/privacy-policy'" not in content:
    content = content.replace('  ];', routes + '\n  ];')

with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ App.tsx updated!')
