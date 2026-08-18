import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => {
          i18n.changeLanguage("en");
        }}
        title="English"
        aria-label="Switch to English"
        className={`w-9 h-9 rounded-lg overflow-hidden transition ${
          i18n.language === "en"
            ? "ring-2 ring-blue-500"
            : "opacity-50 hover:opacity-100"
        }`}
      >
        <img
          src="https://flagcdn.com/gb.svg"
          alt="English"
          className="w-full h-full object-cover"
        />
      </button>
      <button
        onClick={() => {
          i18n.changeLanguage("tr");
        }}
        title="Türkçe"
        aria-label="Türkçe'ye geç"
        className={`w-9 h-9 rounded-lg overflow-hidden transition ${
          i18n.language === "tr"
            ? "ring-2 ring-blue-500"
            : "opacity-50 hover:opacity-100"
        }`}
      >
        <img
          src="https://flagcdn.com/tr.svg"
          alt="Türkçe"
          className="w-full h-full object-cover"
        />
      </button>
    </div>
  );
}
