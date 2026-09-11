"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useActiveGame } from "@/context/useActiveGame";
import { getSquare } from "@/lib/boardData";

export function ChallengeModal() {
  const { state, resolveModal, myPlayerId } = useActiveGame();
  const { t, language } = useLanguage();
  const modal = state.modal;

  const square = modal ? getSquare(modal.squareNumber) : undefined;
  const isMyTurn = myPlayerId === null || myPlayerId === state.currentPlayerIndex;

  return (
    <AnimatePresence>
      {modal?.open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl border border-white/10 bg-[#171029] p-8 text-center shadow-[0_0_60px_rgba(124,58,237,0.35)]"
          >
            <span className="text-sm font-bold uppercase tracking-widest text-[var(--cyan)]">
              {modal.mode === "challenge"
                ? t("challengeTitle")
                : modal.mode === "dice-shots" || modal.rollResult !== undefined
                  ? t("diceShotsTitle")
                  : t("infoTitle")}
            </span>

            <p className="text-xl font-semibold text-[var(--text)]">{square?.text[language] ?? ""}</p>

            {modal.rollResult !== undefined && (
              <p className="text-lg font-bold text-[var(--cyan)]">
                {t("rolledLabel")} <span className="text-white">{modal.rollResult}</span>
              </p>
            )}

            {modal.shots > 0 ? (
              <p className="text-lg font-bold text-[var(--pink)]">
                {t("takeLabel")}{" "}
                <span className="text-white">
                  {modal.shots} {modal.shots === 1 ? t("shotShort") : t("shotsShort")}
                </span>
              </p>
            ) : (
              modal.rollResult !== undefined && (
                <p className="text-lg font-bold text-emerald-400">{t("safeMessage")}</p>
              )
            )}

            {!isMyTurn && (
              <p className="text-sm font-semibold text-[var(--text-dim)]">
                ⏳ {t("waitingFor")} {t("player")} {state.currentPlayerIndex + 1}…
              </p>
            )}

            <div className={`flex w-full flex-col gap-3 ${!isMyTurn ? "hidden" : ""}`}>
              {modal.mode === "challenge" && (
                <>
                  <button
                    onClick={() => resolveModal(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3 font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-shadow hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
                  >
                    <span aria-hidden>✅</span> {t("challengeDone")}
                  </button>
                  {modal.hasAlternative && (
                    <button
                      onClick={() => resolveModal(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 px-6 py-3 font-bold text-white shadow-[0_0_20px_rgba(255,45,120,0.4)] transition-shadow hover:shadow-[0_0_30px_rgba(255,45,120,0.6)]"
                    >
                      <span aria-hidden>🥃</span> {t("tookShot")}
                    </button>
                  )}
                </>
              )}

              {modal.mode === "dice-shots" && (
                <button
                  onClick={() => resolveModal(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 px-6 py-3 font-bold text-white shadow-[0_0_20px_rgba(255,45,120,0.4)] transition-shadow hover:shadow-[0_0_30px_rgba(255,45,120,0.6)]"
                >
                  <span aria-hidden>🥃</span> {t("drankThem")}
                </button>
              )}

              {modal.mode === "info" && (
                <button
                  onClick={() => resolveModal(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 px-6 py-3 font-bold text-white shadow-[0_0_20px_rgba(255,45,120,0.4)] transition-shadow hover:shadow-[0_0_30px_rgba(255,45,120,0.6)]"
                >
                  {t("gotIt")}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
