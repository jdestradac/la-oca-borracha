"use client";

import { useLanguage } from "@/context/LanguageContext";

export function LanguageSwitch() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-dim)]">
      <span className="hidden sm:inline">{t("languageSwitchLabel")}:</span>
      <div className="flex overflow-hidden rounded-full border border-white/15 bg-white/5">
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`px-3 py-1 transition-colors ${
            language === "en"
              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
              : "text-[var(--text-dim)] hover:bg-white/10"
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLanguage("es")}
          className={`px-3 py-1 transition-colors ${
            language === "es"
              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
              : "text-[var(--text-dim)] hover:bg-white/10"
          }`}
        >
          ES
        </button>
      </div>
    </div>
  );
}
