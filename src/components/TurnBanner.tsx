"use client";

import type { CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useActiveGame } from "@/context/useActiveGame";
import { getContrastTextColor } from "@/lib/color";
import { Dice3D } from "./Dice3D";

export function TurnBanner() {
  const { state, rollDice, myPlayerId } = useActiveGame();
  const { t } = useLanguage();
  const current = state.players[state.currentPlayerIndex];
  if (!current) return null;

  const isMyTurn = myPlayerId === null || myPlayerId === current.id;
  const canRoll = !state.isRolling && !state.modal?.open && !current.jailed && isMyTurn;
  const textColor = getContrastTextColor(current.color);

  return (
    <div className="flex flex-col items-center gap-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          className="turn-glow flex items-center gap-3 rounded-full px-6 py-2"
          style={
            {
              background: current.color,
              color: textColor,
              "--glow-color": current.color,
            } as CSSProperties
          }
        >
          <span className="text-sm font-semibold uppercase tracking-wide opacity-80">
            {t("turnOf")}
          </span>
          <span className="text-xl font-extrabold drop-shadow-sm">
            {t("player")} {current.id + 1}
          </span>
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-col items-center gap-2">
        <Dice3D value={state.lastRoll ?? 1} spinToken={state.diceSpin} />
        <motion.button
          whileHover={canRoll ? { scale: 1.05 } : undefined}
          whileTap={canRoll ? { scale: 0.95 } : undefined}
          disabled={!canRoll}
          onClick={rollDice}
          className="rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 px-6 py-2 text-lg font-bold text-white shadow-[0_0_20px_rgba(255,45,120,0.4)] transition-shadow hover:shadow-[0_0_30px_rgba(255,45,120,0.6)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          {state.isRolling
            ? t("rolling")
            : isMyTurn
              ? t("rollDice")
              : `${t("waitingFor")} ${t("player")} ${current.id + 1}`}
        </motion.button>
      </div>
    </div>
  );
}
