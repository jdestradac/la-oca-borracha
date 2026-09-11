"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GiBeerStein } from "react-icons/gi";
import { useGame } from "@/context/GameContext";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitch } from "./LanguageSwitch";

const PLAYER_OPTIONS = Array.from({ length: 13 }, (_, i) => i + 3);

function resizeNames(names: string[], count: number): string[] {
  if (count <= names.length) return names.slice(0, count);
  return [...names, ...Array.from({ length: count - names.length }, () => "")];
}

export function StartScreen() {
  const { startGame } = useGame();
  const { t } = useLanguage();
  const [numPlayers, setNumPlayers] = useState(4);
  const [names, setNames] = useState<string[]>(() => Array.from({ length: 4 }, () => ""));

  const handleNumPlayersChange = (value: number) => {
    setNumPlayers(value);
    setNames((prev) => resizeNames(prev, value));
  };

  const handleNameChange = (index: number, value: string) => {
    setNames((prev) => prev.map((n, i) => (i === index ? value : n)));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6 py-10 text-center"
    >
      <div className="absolute right-4 top-4">
        <LanguageSwitch />
      </div>

      <h1 className="title-bounce flex items-center justify-center gap-3 bg-gradient-to-r from-pink-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-4xl font-bold text-transparent drop-shadow-[0_0_25px_rgba(255,45,120,0.35)] sm:text-6xl">
        <GiBeerStein className="text-[var(--pink)]" />
        {t("title")}
        <GiBeerStein className="text-[var(--cyan)]" />
      </h1>
      <p className="max-w-md text-lg text-[var(--text-dim)]">{t("subtitle")}</p>

      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <label htmlFor="numPlayers" className="text-lg font-semibold text-[var(--text)]">
          {t("numPlayersLabel")}
        </label>
        <select
          id="numPlayers"
          value={numPlayers}
          onChange={(e) => handleNumPlayersChange(Number(e.target.value))}
          className="rounded-xl border-2 border-white/15 bg-[#160f2b] px-4 py-2 text-xl font-bold text-[var(--text)] outline-none focus:border-[var(--pink)]"
        >
          {PLAYER_OPTIONS.map((n) => (
            <option key={n} value={n} className="bg-[#160f2b]">
              {n}
            </option>
          ))}
        </select>

        <div className="flex w-full flex-col gap-2">
          <span className="text-sm font-semibold text-[var(--text-dim)]">
            {t("playerNamesLabel")}
          </span>
          <div className="pretty-scrollbar flex max-h-64 w-full flex-col gap-2 overflow-y-auto pr-1">
            {names.map((name, i) => (
              <input
                key={i}
                value={name}
                onChange={(e) => handleNameChange(i, e.target.value)}
                placeholder={`${t("player")} ${i + 1}`}
                maxLength={20}
                className="w-full rounded-xl border-2 border-white/15 bg-[#160f2b] px-4 py-2 text-[var(--text)] outline-none focus:border-[var(--cyan)]"
              />
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => startGame(numPlayers, names)}
          className="mt-1 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 px-8 py-3 text-xl font-bold text-white shadow-[0_0_25px_rgba(255,45,120,0.45)] transition-shadow hover:shadow-[0_0_35px_rgba(255,45,120,0.65)]"
        >
          {t("startGame")}
        </motion.button>
      </div>
    </motion.div>
  );
}
