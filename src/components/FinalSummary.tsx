"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useActiveGame } from "@/context/useActiveGame";
import { RoomBadge } from "./RoomBadge";

export function FinalSummary() {
  const { state, restart } = useActiveGame();
  const { t } = useLanguage();

  const ranked = [...state.players].sort((a, b) => b.shots - a.shots);
  const winner = state.players.find((p) => p.position >= 47);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center"
    >
      <RoomBadge />

      <h1 className="title-bounce bg-gradient-to-r from-amber-300 via-pink-300 to-cyan-300 bg-clip-text text-4xl font-bold text-transparent drop-shadow-[0_0_25px_rgba(251,191,36,0.35)] sm:text-5xl">
        🏆 {t("gameOverTitle")}
      </h1>

      {winner && (
        <p className="text-xl font-bold text-[var(--text)]">
          <span
            className="mr-2 inline-block h-4 w-4 rounded-full align-middle"
            style={{ background: winner.color }}
          />
          {t("player")} {winner.id + 1} {t("winnerAnnouncement")}
        </p>
      )}

      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <h2 className="mb-3 text-lg font-bold text-[var(--text)]">{t("finalScoresTitle")}</h2>
        <ul className="flex flex-col gap-2">
          {ranked.map((player) => (
            <li
              key={player.id}
              className="flex items-center justify-between rounded-lg bg-white/[0.04] px-4 py-2 font-semibold"
              style={{ color: player.color }}
            >
              <span>
                {t("player")} {player.id + 1}
              </span>
              <span>
                {player.shots} {player.shots === 1 ? t("shotShort") : t("shotsShort")}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={restart}
        className="rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 px-8 py-3 text-xl font-bold text-white shadow-[0_0_25px_rgba(255,45,120,0.45)] transition-shadow hover:shadow-[0_0_35px_rgba(255,45,120,0.65)]"
      >
        {t("playAgain")}
      </motion.button>
    </motion.div>
  );
}
