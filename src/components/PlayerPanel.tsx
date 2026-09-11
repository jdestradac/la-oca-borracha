"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useActiveGame } from "@/context/useActiveGame";

export function PlayerPanel() {
  const { state, myPlayerId } = useActiveGame();
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl">
      <h2 className="mb-2 text-center text-lg font-bold text-[var(--text)]">{t("players")}</h2>
      <ul className="flex max-h-80 flex-col gap-1.5 overflow-y-auto pr-1">
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
              {t("player")} {player.id + 1}
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
    </div>
  );
}
