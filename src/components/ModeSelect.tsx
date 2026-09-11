"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitch } from "./LanguageSwitch";

export function ModeSelect({
  onSelectLocal,
  onSelectOnline,
}: {
  onSelectLocal: () => void;
  onSelectOnline: () => void;
}) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6 text-center"
    >
      <div className="absolute right-4 top-4">
        <LanguageSwitch />
      </div>

      <h1 className="title-bounce bg-gradient-to-r from-pink-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-4xl font-bold text-transparent drop-shadow-[0_0_25px_rgba(255,45,120,0.35)] sm:text-6xl">
        🍺 {t("title")} 🍺
      </h1>
      <p className="max-w-md text-lg text-[var(--text-dim)]">{t("subtitle")}</p>

      <div className="flex w-full max-w-sm flex-col gap-4">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onSelectLocal}
          className="flex flex-col items-center gap-1 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          <span className="text-xl font-bold text-[var(--text)]">{t("playLocal")}</span>
          <span className="text-sm text-[var(--text-dim)]">{t("playLocalDesc")}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onSelectOnline}
          className="flex flex-col items-center gap-1 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          <span className="text-xl font-bold text-[var(--text)]">{t("playOnline")}</span>
          <span className="text-sm text-[var(--text-dim)]">{t("playOnlineDesc")}</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
