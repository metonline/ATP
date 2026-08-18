import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => {
          i18n.changeLanguage("en");
        }}
        className={`px-3 py-1 rounded font-bold transition ${
          i18n.language === "en" 
            ? "bg-blue-600 text-white" 
            : "bg-gray-300 text-gray-700 hover:bg-gray-400"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => {
          i18n.changeLanguage("tr");
        }}
        className={`px-3 py-1 rounded font-bold transition ${
          i18n.language === "tr" 
            ? "bg-blue-600 text-white" 
            : "bg-gray-300 text-gray-700 hover:bg-gray-400"
        }`}
      >
        TR
      </button>
    </div>
  );
}
