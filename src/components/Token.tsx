"use client";

import { motion } from "framer-motion";
import { getContrastTextColor } from "@/lib/color";
import type { Player } from "@/lib/types";

export function Token({
  player,
  active,
  large,
}: {
  player: Player;
  active?: boolean;
  /** Bigger sizing for the mobile "flow" board, where squares are much larger. */
  large?: boolean;
}) {
  const size = large ? "clamp(30px, 11vw, 52px)" : "clamp(18px, 4vw, 32px)";
  const fontSize = large ? "clamp(14px, 4.5vw, 22px)" : "clamp(9px, 1.8vw, 14px)";

  return (
    <motion.div
      layout
      layoutId={`token-${player.id}`}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="flex items-center justify-center rounded-full border-2 border-white font-bold shadow-[0_0_4px_rgba(0,0,0,0.6)]"
      style={{
        background: player.color,
        color: getContrastTextColor(player.color),
        width: size,
        height: size,
        fontSize,
        outline: active ? "2px solid white" : undefined,
        boxShadow: active
          ? `0 0 0 3px ${player.color}, 0 0 10px 2px ${player.color}`
          : "0 0 4px rgba(0,0,0,0.6)",
      }}
      title={`Player ${player.id + 1}`}
    >
      {player.id + 1}
    </motion.div>
  );
}
