"use client";

import { useContext } from "react";
import { GameContext, type GameContextValue } from "./GameContext";
import { OnlineGameContext } from "./OnlineGameContext";

/**
 * Game-playing components (Board, TurnBanner, ChallengeModal, PlayerPanel,
 * FinalSummary) call this instead of useGame()/useOnlineGame() directly, so
 * the same UI works whether the active provider is the local pass-and-play
 * GameProvider or the networked OnlineGameProvider. Exactly one of the two
 * is ever mounted at a time (decided in page.tsx), so whichever context is
 * present wins.
 */
export function useActiveGame(): GameContextValue {
  const local = useContext(GameContext);
  const online = useContext(OnlineGameContext);
  const ctx = online ?? local;
  if (!ctx) throw new Error("useActiveGame debe usarse dentro de GameProvider u OnlineGameProvider");
  return ctx;
}
