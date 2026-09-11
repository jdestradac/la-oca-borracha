"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getGridPosition } from "@/lib/boardData";
import type { Player } from "@/lib/types";
import { Token } from "./Token";

const IMAGE_EXTENSIONS = ["png", "jpg"];

function baseNameFor(position: number): string {
  if (position === 0) return "square-start";
  if (position === 47) return "square-winner";
  return `square-${position}`;
}

function imageSrcFor(position: number, extensionIndex: number): string {
  const ext = IMAGE_EXTENSIONS[extensionIndex];
  return `/assets/images/squares/${baseNameFor(position)}.${ext}`;
}

export function Square({
  position,
  occupants,
  activePlayerId,
  layoutMode = "grid",
}: {
  position: number;
  occupants: Player[];
  activePlayerId: number | null;
  /** "grid" places itself on the snake grid via row/col (desktop board).
   * "flow" lets the parent container control placement (mobile list). */
  layoutMode?: "grid" | "flow";
}) {
  const { t } = useLanguage();
  const [extensionIndex, setExtensionIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const imgError = extensionIndex >= IMAGE_EXTENSIONS.length;
  const { row, col } = getGridPosition(position);

  const isStart = position === 0;
  const isWinner = position === 47;
  const isWide = isStart || isWinner;
  const label = isStart ? t("start") : isWinner ? String(position) : String(position);

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden rounded-lg border ${
        isWinner
          ? "border-amber-400/70 bg-gradient-to-br from-amber-500/25 to-amber-300/10 shadow-[0_0_16px_rgba(251,191,36,0.35)]"
          : isStart
            ? "border-[var(--pink)]/60 bg-gradient-to-br from-pink-500/20 to-purple-600/10 shadow-[0_0_16px_rgba(255,45,120,0.3)]"
            : "border-white/10 bg-white/[0.04]"
      } ${layoutMode === "flow" ? (isWide ? "aspect-[2/1] w-full" : "aspect-square w-full") : ""}`}
      style={
        layoutMode === "grid"
          ? {
              gridRowStart: row + 1,
              gridColumn: isWide ? `${col + 1} / span 2` : col + 1,
              zIndex: isWide ? 5 : undefined,
            }
          : undefined
      }
    >
      {!imgError && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={extensionIndex}
          src={imageSrcFor(position, extensionIndex)}
          alt={isStart ? t("start") : isWinner ? t("winner") : `Square ${position}`}
          className="absolute inset-0 h-full w-full object-cover"
          onLoad={() => setLoaded(true)}
          onError={() => setExtensionIndex((i) => i + 1)}
        />
      )}

      {!loaded && occupants.length === 0 && (
        <span
          className={`z-0 select-none font-bold ${
            isWinner ? "text-amber-300" : isStart ? "text-pink-200" : "text-white/40"
          }`}
          style={{ fontSize: "clamp(0.5rem, 2vw, 1.1rem)" }}
        >
          {isStart ? t("start") : isWinner ? t("winner") : label}
        </span>
      )}

      {loaded && !isStart && !isWinner && (
        <span
          className="absolute right-0.5 top-0.5 z-0 select-none rounded bg-black px-1 font-bold leading-tight text-white"
          style={{ fontSize: "clamp(0.4rem, 1.4vw, 0.75rem)" }}
        >
          {label}
        </span>
      )}

      {occupants.length > 0 && (
        <div
          className={`absolute inset-0 z-10 flex flex-wrap gap-0.5 bg-black/10 p-1 ${
            isWide ? "content-start justify-center overflow-y-auto" : "items-center justify-center"
          }`}
        >
          {occupants.map((p) => (
            <Token
              key={p.id}
              player={p}
              active={p.id === activePlayerId}
              large={layoutMode === "flow"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
