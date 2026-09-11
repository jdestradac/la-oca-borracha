"use client";

import { useState } from "react";
import { FinalSummary } from "@/components/FinalSummary";
import { GameScreen } from "@/components/GameScreen";
import { ModeSelect } from "@/components/ModeSelect";
import { OnlineLobby } from "@/components/OnlineLobby";
import { StartScreen } from "@/components/StartScreen";
import { GameProvider, useGame } from "@/context/GameContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { OnlineGameProvider, useOnlineGame } from "@/context/OnlineGameContext";

type Mode = "select" | "local" | "online";

function LocalRouter() {
  const { state } = useGame();

  if (state.phase === "setup") return <StartScreen />;
  if (state.phase === "finished") return <FinalSummary />;
  return <GameScreen />;
}

function OnlineRouter({ onExit }: { onExit: () => void }) {
  const { state, roomId } = useOnlineGame();

  if (!roomId) return <OnlineLobby onExit={onExit} />;
  if (state.phase === "finished") return <FinalSummary />;
  return <GameScreen />;
}

function AppRouter() {
  const [mode, setMode] = useState<Mode>("select");

  if (mode === "select") {
    return (
      <ModeSelect onSelectLocal={() => setMode("local")} onSelectOnline={() => setMode("online")} />
    );
  }

  if (mode === "local") {
    return (
      <GameProvider>
        <LocalRouter />
      </GameProvider>
    );
  }

  return (
    <OnlineGameProvider>
      <OnlineRouter onExit={() => setMode("select")} />
    </OnlineGameProvider>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <AppRouter />
    </LanguageProvider>
  );
}
