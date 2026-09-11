"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useActiveGame } from "@/context/useActiveGame";

export function Toast() {
  const { state } = useActiveGame();
  const { t } = useLanguage();
  const toast = state.toast;

  let message: string | null = null;
  if (toast?.key === "gameStarted") message = t("toastGameStarted");
  else if (toast?.key === "squareFull") message = t("toastSquareFull");
  else if (toast?.key === "jailSkip")
    message = `${t("player")} ${toast.playerId + 1} ${t("toastJailSkip")}`;
  else if (toast?.key === "bounceBack")
    message = `${t("toastBounceBack")} ${toast.spaces} ${t("spacesShort")} 🔄`;

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="fixed left-1/2 top-4 z-[60] -translate-x-1/2 rounded-xl border border-white/10 bg-[#171029] px-6 py-3 text-center font-bold text-[var(--cyan)] shadow-[0_0_30px_rgba(34,211,238,0.35)]"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
