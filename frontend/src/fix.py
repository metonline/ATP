content = open('App.tsx', 'r', encoding='utf-8').read()
content = content.replace("import PrivacyPolicy from './pages/PrivacyPolicy';\nimport AdminPanel from './pages/AdminPanel';\nimport { BrowserRouter", "import { BrowserRouter")
new_imports = "import React, { useEffect } from 'react';\nimport PrivacyPolicy from './pages/PrivacyPolicy';\nimport AdminPanel from './pages/AdminPanel';\nimport { BrowserRouter"
content = content.replace('import { BrowserRouter', new_imports)
open('App.tsx', 'w', encoding='utf-8').write(content)
print('✅ Fixed!')
