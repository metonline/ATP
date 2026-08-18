content = open("RegisterPage.tsx", "r", encoding="utf-8").read()

# Yanlış: `t('register.password') en az...`
# Doğru: ${t('register.password')} en az...

content = content.replace(
    "`t('register.password') en az 6 karakter olmalıdır`",
    "`${t('register.password')} en az 6 karakter olmalıdır`"
)

content = content.replace(
    "`t('register.email') ya da t('register.username') zaten kayıtlı`",
    "`${t('register.email')} or ${t('register.username')} already exists`"
)

open("RegisterPage.tsx", "w", encoding="utf-8").write(content)
print("✅ Fixed template literals!")
