import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en, tr } from "./locales/translations";

const savedLang = localStorage.getItem("app-language") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      tr: { translation: tr }
    },
    lng: savedLang,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("app-language", lng);
});

export default i18n;
