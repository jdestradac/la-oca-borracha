"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaGlobe } from "react-icons/fa6";
import { useLanguage } from "@/context/LanguageContext";
import { useOnlineGame } from "@/context/OnlineGameContext";
import { LanguageSwitch } from "./LanguageSwitch";
import { ThemeSwitch } from "./ThemeSwitch";

const PLAYER_OPTIONS = Array.from({ length: 13 }, (_, i) => i + 3);

const ERROR_KEYS = {
  "not-found": "roomJoinNotFound",
  full: "roomJoinFull",
} as const;

export function OnlineLobby({ onExit }: { onExit: () => void }) {
  const { createRoom, joinRoom, isConnecting, connectionError } = useOnlineGame();
  const { t } = useLanguage();
  const [numPlayers, setNumPlayers] = useState(4);
  const [joinCode, setJoinCode] = useState("");

  const errorMessage = connectionError
    ? t(ERROR_KEYS[connectionError as keyof typeof ERROR_KEYS] ?? "roomJoinError")
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 py-10 text-center"
    >
      <div className="absolute right-4 top-4 flex flex-col items-end gap-2">
        <ThemeSwitch />
        <LanguageSwitch />
      </div>

      <h1 className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
        <FaGlobe className="text-[var(--cyan)]" /> {t("playOnline")}
      </h1>

      <div className="flex w-full max-w-sm flex-col gap-3 rounded-3xl border border-[var(--border-soft-2)] bg-[var(--surface)] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <h2 className="text-lg font-bold text-[var(--text)]">{t("createRoomTitle")}</h2>
        <label htmlFor="numPlayers" className="text-sm font-semibold text-[var(--text-dim)]">
          {t("numPlayersLabel")}
        </label>
        <select
          id="numPlayers"
          value={numPlayers}
          onChange={(e) => setNumPlayers(Number(e.target.value))}
          className="rounded-xl border-2 border-[var(--border-soft)] bg-[var(--input-bg)] px-4 py-2 text-lg font-bold text-[var(--text)] outline-none focus:border-[var(--pink)]"
        >
          {PLAYER_OPTIONS.map((n) => (
            <option key={n} value={n} className="bg-[var(--input-bg)]">
              {n}
            </option>
          ))}
        </select>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={isConnecting}
          onClick={() => createRoom(numPlayers)}
          className="rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 px-6 py-3 font-bold text-white shadow-[0_0_25px_rgba(255,45,120,0.45)] transition-shadow hover:shadow-[0_0_35px_rgba(255,45,120,0.65)] disabled:opacity-50"
        >
          {isConnecting ? t("connecting") : t("createRoomButton")}
        </motion.button>
      </div>

      <span className="text-sm font-semibold uppercase tracking-widest text-[var(--text-dim)]">
        {t("orDivider")}
      </span>

      <div className="flex w-full max-w-sm flex-col gap-3 rounded-3xl border border-[var(--border-soft-2)] bg-[var(--surface)] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <h2 className="text-lg font-bold text-[var(--text)]">{t("joinRoomTitle")}</h2>
        <label htmlFor="roomCode" className="text-sm font-semibold text-[var(--text-dim)]">
          {t("roomCodeLabel")}
        </label>
        <input
          id="roomCode"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          placeholder={t("roomCodePlaceholder")}
          maxLength={8}
          className="rounded-xl border-2 border-[var(--border-soft)] bg-[var(--input-bg)] px-4 py-2 text-center text-lg font-bold uppercase tracking-widest text-[var(--text)] outline-none focus:border-[var(--cyan)]"
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={isConnecting || !joinCode.trim()}
          onClick={() => joinRoom(joinCode)}
          className="rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-3 font-bold text-white shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-shadow hover:shadow-[0_0_35px_rgba(34,211,238,0.6)] disabled:opacity-50"
        >
          {isConnecting ? t("connecting") : t("joinRoomButton")}
        </motion.button>
      </div>

      {errorMessage && <p className="font-semibold text-[var(--pink)]">{errorMessage}</p>}

      <button
        type="button"
        onClick={onExit}
        className="text-sm font-semibold text-[var(--text-dim)] underline-offset-4 hover:underline"
      >
        ← {t("backToMenu")}
      </button>
    </motion.div>
  );
}
