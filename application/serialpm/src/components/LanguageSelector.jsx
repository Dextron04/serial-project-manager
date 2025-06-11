import { useState } from "react";
import { Globe } from "lucide-react";
import i18n from "../i18n";

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en-US", label: "English (US)" },
    { code: "en-GB", label: "English (UK)" },
    { code: "es-MX", label: "Español (México)" },
    { code: "es-ES", label: "Español (España)" },
  ];

  const currentLang = i18n.language || "en-US";

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative mt-6 flex justify-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 transition duration-200"
      >
        <Globe size={16} />
        <span>{languages.find((lang) => lang.code === currentLang)?.label}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5">
          <ul className="py-1">
            {languages.map((lang) => (
              <li
                key={lang.code}
                onClick={() => changeLang(lang.code)}
                className={`px-4 py-2 text-sm cursor-pointer ${
                  currentLang === lang.code
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                {lang.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
