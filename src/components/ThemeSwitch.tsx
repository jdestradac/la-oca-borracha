"use client";

import { FaMoon, FaSun } from "react-icons/fa6";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-dim)]">
      <span className="hidden sm:inline">{t("themeSwitchLabel")}:</span>
      <div className="flex overflow-hidden rounded-full border border-[var(--border-soft)] bg-[var(--surface)]">
        <button
          type="button"
          onClick={() => setTheme("day")}
          aria-label="Day"
          className={`px-3 py-1 transition-colors ${
            theme === "day"
              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
              : "text-[var(--text-dim)] hover:bg-[var(--surface-strong)]"
          }`}
        >
          <FaSun />
        </button>
        <button
          type="button"
          onClick={() => setTheme("night")}
          aria-label="Night"
          className={`px-3 py-1 transition-colors ${
            theme === "night"
              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
              : "text-[var(--text-dim)] hover:bg-[var(--surface-strong)]"
          }`}
        >
          <FaMoon />
        </button>
      </div>
    </div>
  );
}
