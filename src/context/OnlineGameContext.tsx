"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { initialGameState } from "@/lib/gameReducer";
import type { GameState } from "@/lib/types";
import type { GameContextValue } from "./GameContext";

const POLL_INTERVAL_MS = 1500;
const STORAGE_PREFIX = "drunk-goose-seat:";

interface OnlineGameContextValue extends GameContextValue {
  roomId: string | null;
  connectionError: string | null;
  isConnecting: boolean;
  createRoom: (numPlayers: number) => Promise<void>;
  joinRoom: (code: string) => Promise<void>;
  leaveRoom: () => void;
}

const OnlineGameContext = createContext<OnlineGameContextValue | null>(null);

async function readJson(response: Response) {
  return response.json().catch(() => ({}));
}

/**
 * Online counterpart to GameContext: instead of a local reducer, the source
 * of truth lives server-side (see src/lib/room.ts, backed by Redis). Every
 * mutation goes through an API route that re-applies the same gameReducer,
 * and every connected device polls for the latest state so all screens stay
 * in sync. The exposed shape matches GameContextValue so the game-playing
 * components (Board, TurnBanner, ChallengeModal, ...) don't need to know
 * which mode they're in.
 */
export function OnlineGameProvider({ children }: { children: ReactNode }) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<number | null>(null);
  const [state, setState] = useState<GameState>(initialGameState);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const busyRef = useRef(false);

  const stopPolling = useCallback(() => {
    if (pollTimer.current) clearInterval(pollTimer.current);
    pollTimer.current = null;
  }, []);

  const poll = useCallback(async (activeRoomId: string) => {
    try {
      const res = await fetch(`/api/rooms/${activeRoomId}`);
      if (!res.ok) return;
      const data = await readJson(res);
      if (data.state) setState(data.state);
    } catch {
      // transient network hiccup — next poll will retry
    }
  }, []);

  useEffect(() => {
    if (!roomId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching room state from the server on mount/interval, not a synchronous setState
    poll(roomId);
    pollTimer.current = setInterval(() => poll(roomId), POLL_INTERVAL_MS);
    return stopPolling;
  }, [roomId, poll, stopPolling]);

  const createRoom = useCallback(async (numPlayers: number) => {
    setIsConnecting(true);
    setConnectionError(null);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numPlayers }),
      });
      const data = await readJson(res);
      if (!res.ok) throw new Error(data.error ?? "create-failed");
      window.localStorage.setItem(`${STORAGE_PREFIX}${data.roomId}`, String(data.playerId));
      setRoomId(data.roomId);
      setMyPlayerId(data.playerId);
      setState(data.state);
    } catch {
      setConnectionError("create-failed");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const joinRoom = useCallback(async (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) return;
    setIsConnecting(true);
    setConnectionError(null);
    try {
      const stored = window.localStorage.getItem(`${STORAGE_PREFIX}${normalized}`);
      if (stored !== null) {
        setRoomId(normalized);
        setMyPlayerId(Number(stored));
        return;
      }

      const res = await fetch(`/api/rooms/${normalized}/join`, { method: "POST" });
      const data = await readJson(res);
      if (!res.ok) throw new Error(data.error ?? "join-failed");
      window.localStorage.setItem(`${STORAGE_PREFIX}${normalized}`, String(data.playerId));
      setRoomId(normalized);
      setMyPlayerId(data.playerId);
      setState(data.state);
    } catch (err) {
      const message = err instanceof Error ? err.message : "join-failed";
      setConnectionError(message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const leaveRoom = useCallback(() => {
    stopPolling();
    setRoomId(null);
    setMyPlayerId(null);
    setState(initialGameState);
    setConnectionError(null);
  }, [stopPolling]);

  const rollDice = useCallback(() => {
    if (!roomId || myPlayerId === null || busyRef.current) return;
    busyRef.current = true;
    fetch(`/api/rooms/${roomId}/roll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: myPlayerId }),
    })
      .then(readJson)
      .then((data) => {
        if (data.state) setState(data.state);
      })
      .finally(() => {
        busyRef.current = false;
      });
  }, [roomId, myPlayerId]);

  const resolveModal = useCallback(
    (tookShot: boolean) => {
      if (!roomId || busyRef.current) return;
      busyRef.current = true;
      fetch(`/api/rooms/${roomId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "RESOLVE_MODAL", tookShot, playerId: myPlayerId }),
      })
        .then(readJson)
        .then((data) => {
          if (data.state) setState(data.state);
        })
        .finally(() => {
          busyRef.current = false;
        });
    },
    [roomId, myPlayerId]
  );

  const restart = useCallback(() => {
    if (!roomId) return;
    fetch(`/api/rooms/${roomId}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "RESTART" }),
    })
      .then(readJson)
      .then((data) => {
        if (data.state) setState(data.state);
      });
  }, [roomId]);

  const value: OnlineGameContextValue = {
    state,
    myPlayerId,
    roomId,
    connectionError,
    isConnecting,
    startGame: () => {
      throw new Error("Use createRoom() in online mode");
    },
    rollDice,
    resolveModal,
    restart,
    createRoom,
    joinRoom,
    leaveRoom,
  };

  return <OnlineGameContext.Provider value={value}>{children}</OnlineGameContext.Provider>;
}

export function useOnlineGame() {
  const ctx = useContext(OnlineGameContext);
  if (!ctx) throw new Error("useOnlineGame debe usarse dentro de OnlineGameProvider");
  return ctx;
}

export { OnlineGameContext };
