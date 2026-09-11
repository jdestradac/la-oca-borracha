"use client";

import { useState } from "react";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { useLanguage } from "@/context/LanguageContext";
import { useActiveGame } from "@/context/useActiveGame";
import { playerLabel } from "@/lib/playerLabel";
import { ConfirmModal } from "./ConfirmModal";

export function PlayerPanel() {
  const { state, myPlayerId, restart } = useActiveGame();
  const { t } = useLanguage();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl">
      <h2 className="mb-2 text-center text-lg font-bold text-[var(--text)]">{t("players")}</h2>
      <ul className="pretty-scrollbar flex max-h-80 flex-col gap-1.5 overflow-y-auto pr-1">
        {state.players.map((player, i) => (
          <li
            key={player.id}
            className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
              i === state.currentPlayerIndex
                ? "bg-white/10 ring-2 ring-inset ring-[var(--pink)]"
                : "bg-white/[0.03]"
            }`}
          >
            <span className="flex items-center gap-2 text-[var(--text)]">
              <span
                className="inline-block h-4 w-4 rounded-full border-2 border-white/40 shadow"
                style={{ background: player.color }}
              />
              {playerLabel(player, t("player"))}
              {player.id === myPlayerId && (
                <span className="text-xs font-normal text-[var(--cyan)]">({t("you")})</span>
              )}
              {player.jailed && (
                <span className="text-xs font-normal text-[var(--text-dim)]">({t("jailed")})</span>
              )}
            </span>
            <span className="text-[var(--cyan)]">
              {player.shots} {player.shots === 1 ? t("shotShort") : t("shotsShort")}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-[0_0_18px_rgba(255,45,120,0.4)] transition-shadow hover:shadow-[0_0_26px_rgba(255,45,120,0.6)]"
      >
        <FaArrowRotateLeft /> {t("newGame")}
      </button>

      <ConfirmModal
        open={confirmOpen}
        message={t("confirmRestart")}
        confirmLabel={t("confirm")}
        cancelLabel={t("cancel")}
        onConfirm={() => {
          setConfirmOpen(false);
          restart();
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
