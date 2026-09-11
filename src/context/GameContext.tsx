"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { gameReducer, initialGameState } from "@/lib/gameReducer";
import type { GameState } from "@/lib/types";

const DICE_ANIMATION_MS = 900;
const TOAST_DURATION_MS = 2600;
const STORAGE_KEY = "drunk-goose-local-game";

export interface GameContextValue {
  state: GameState;
  /** null = unrestricted: any device can act (this is the local pass-and-play mode). */
  myPlayerId: number | null;
  startGame: (numPlayers: number, names?: string[]) => void;
  rollDice: () => void;
  resolveModal: (tookShot: boolean) => void;
  restart: () => void;
}

function loadPersistedState(): GameState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    if (parsed.phase === "setup") return null;
    // Never resume mid-animation or with a stale toast lingering after reload.
    return { ...parsed, isRolling: false, toast: null };
  } catch {
    return null;
  }
}

export const GameContext = createContext<GameContextValue | null>(null);

/**
 * Central game store. All match logic (players, turn, positions, shots)
 * lives behind the pure gameReducer. When this becomes a networked game,
 * this is the layer to sync — the same actions dispatched locally today
 * (START_GAME, ROLL_RESULT, RESOLVE_MODAL, ...) are what would travel
 * between client and server.
 */
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const jailTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(state);
  const skipNextPersist = useRef(true);
  useEffect(() => {
    stateRef.current = state;
  });

  // Restore an in-progress game after an accidental reload/close.
  useEffect(() => {
    const persisted = loadPersistedState();
    if (persisted) {
      dispatch({ type: "HYDRATE", state: persisted });
    }
  }, []);

  // Keep localStorage in sync, skipping the very first (still-initial) render.
  useEffect(() => {
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage unavailable (private mode, quota) — game just won't survive a reload
    }
  }, [state]);

  const startGame = useCallback((numPlayers: number, names?: string[]) => {
    dispatch({ type: "START_GAME", numPlayers, names });
  }, []);

  const rollDice = useCallback(() => {
    const current = stateRef.current;
    if (current.phase !== "playing" || current.isRolling || current.modal?.open) return;
    const player = current.players[current.currentPlayerIndex];
    if (!player || player.jailed) return;

    const roll = Math.floor(Math.random() * 6) + 1;
    dispatch({ type: "ROLL_START", roll });
    if (rollTimeout.current) clearTimeout(rollTimeout.current);
    rollTimeout.current = setTimeout(() => {
      dispatch({ type: "ROLL_RESULT", roll });
    }, DICE_ANIMATION_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (rollTimeout.current) clearTimeout(rollTimeout.current);
    };
  }, []);

  const restart = useCallback(() => {
    dispatch({ type: "RESTART" });
  }, []);

  const resolveModal = useCallback((tookShot: boolean) => {
    dispatch({ type: "RESOLVE_MODAL", tookShot });
  }, []);

  useEffect(() => {
    if (!state.toast) return;
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => {
      dispatch({ type: "DISMISS_TOAST" });
    }, TOAST_DURATION_MS);
    return () => {
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
    };
  }, [state.toast]);

  useEffect(() => {
    if (state.phase !== "playing" || state.isRolling || state.modal?.open) return;
    const current = state.players[state.currentPlayerIndex];
    if (!current?.jailed) return;
    jailTimeout.current = setTimeout(() => {
      dispatch({ type: "SKIP_JAILED_TURN" });
    }, 700);
    return () => {
      if (jailTimeout.current) clearTimeout(jailTimeout.current);
    };
  }, [state.phase, state.isRolling, state.modal, state.currentPlayerIndex, state.players]);

  const value: GameContextValue = {
    state,
    myPlayerId: null,
    startGame,
    rollDice,
    resolveModal,
    restart,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame debe usarse dentro de GameProvider");
  return ctx;
}

export { DICE_ANIMATION_MS };
