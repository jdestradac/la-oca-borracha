"use client";

import { useState } from "react";
import { FaUsers } from "react-icons/fa6";
import { GiBeerStein } from "react-icons/gi";
import { IoGameControllerOutline } from "react-icons/io5";
import { useLanguage } from "@/context/LanguageContext";
import { useActiveGame } from "@/context/useActiveGame";
import { useBoardImagesReady } from "@/lib/useBoardImagesReady";
import { Board } from "./Board";
import { ChallengeModal } from "./ChallengeModal";
import { LanguageSwitch } from "./LanguageSwitch";
import { MobileBoard } from "./MobileBoard";
import { PlayerPanel } from "./PlayerPanel";
import { RoomBadge } from "./RoomBadge";
import { Spinner } from "./Spinner";
import { Toast } from "./Toast";
import { TurnBanner } from "./TurnBanner";

type MobileTab = "game" | "players";

export function GameScreen() {
  const { state } = useActiveGame();
  const { t } = useLanguage();
  const current = state.players[state.currentPlayerIndex];
  const [mobileTab, setMobileTab] = useState<MobileTab>("game");
  const boardReady = useBoardImagesReady();

  return (
    <div className="flex min-h-dvh flex-col items-center gap-6 px-4 py-6">
      <div className="flex w-full max-w-[1700px] items-center justify-between">
        <h1 className="flex items-center gap-2 bg-gradient-to-r from-pink-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
          <GiBeerStein className="text-[var(--pink)]" /> {t("title")}
        </h1>
        <LanguageSwitch />
      </div>

      <RoomBadge />

      {/* Desktop / tablet: board and sidebar side by side */}
      <div className="hidden w-full max-w-[1700px] flex-col items-center gap-6 lg:flex lg:flex-row lg:items-start lg:justify-center">
        {boardReady ? (
          <Board players={state.players} activePlayerId={current?.id ?? null} />
        ) : (
          <div className="flex w-full flex-1 items-center justify-center">
            <Spinner label={t("loadingBoard")} />
          </div>
        )}
        <div className="flex w-full max-w-xs flex-col items-center gap-6">
          <TurnBanner />
          <PlayerPanel />
        </div>
      </div>

      {/* Mobile: tabbed — Game (dice + board) / Players */}
      <div className="flex w-full flex-col items-center gap-4 lg:hidden">
        <div className="flex w-full max-w-xs overflow-hidden rounded-full border border-white/15 bg-white/5">
          <button
            type="button"
            onClick={() => setMobileTab("game")}
            className={`flex-1 py-2 text-sm font-bold transition-colors ${
              mobileTab === "game"
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                : "text-[var(--text-dim)]"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <IoGameControllerOutline /> {t("tabGame")}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("players")}
            className={`flex-1 py-2 text-sm font-bold transition-colors ${
              mobileTab === "players"
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                : "text-[var(--text-dim)]"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <FaUsers /> {t("tabPlayers")}
            </span>
          </button>
        </div>

        {mobileTab === "game" ? (
          <>
            <TurnBanner />
            {boardReady ? (
              <MobileBoard players={state.players} activePlayerId={current?.id ?? null} />
            ) : (
              <Spinner label={t("loadingBoard")} />
            )}
          </>
        ) : (
          <div className="w-full max-w-xs">
            <PlayerPanel />
          </div>
        )}
      </div>

      <Toast />
      <ChallengeModal />
    </div>
  );
}
