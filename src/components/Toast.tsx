"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { IconType } from "react-icons";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { GiBeerStein } from "react-icons/gi";
import { useLanguage } from "@/context/LanguageContext";
import { useActiveGame } from "@/context/useActiveGame";
import { playerLabel } from "@/lib/playerLabel";

export function Toast() {
  const { state } = useActiveGame();
  const { t } = useLanguage();
  const toast = state.toast;

  let message: string | null = null;
  let Icon: IconType | null = null;

  if (toast?.key === "gameStarted") {
    message = t("toastGameStarted");
    Icon = GiBeerStein;
  } else if (toast?.key === "squareFull") {
    message = t("toastSquareFull");
  } else if (toast?.key === "jailSkip") {
    const jailedPlayer = state.players.find((p) => p.id === toast.playerId);
    message = `${jailedPlayer ? playerLabel(jailedPlayer, t("player")) : t("player")} ${t("toastJailSkip")}`;
  } else if (toast?.key === "bounceBack") {
    message = `${t("toastBounceBack")} ${toast.spaces} ${t("spacesShort")}`;
    Icon = FaArrowRotateLeft;
  }

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="fixed left-1/2 top-4 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-xl border border-[var(--border-soft-2)] bg-[var(--card-bg)] px-6 py-3 text-center font-bold text-[var(--cyan)] shadow-[0_0_30px_rgba(34,211,238,0.35)]"
        >
          {Icon && <Icon />}
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
