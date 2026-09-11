"use client";

import { useMemo } from "react";
import { BOARD_COLS, BOARD_ROWS } from "@/lib/boardData";
import type { Player } from "@/lib/types";
import { Square } from "./Square";

export function Board({
  players,
  activePlayerId,
}: {
  players: Player[];
  activePlayerId: number | null;
}) {
  const occupantsByPosition = useMemo(() => {
    const map = new Map<number, Player[]>();
    for (const player of players) {
      const list = map.get(player.position) ?? [];
      list.push(player);
      map.set(player.position, list);
    }
    return map;
  }, [players]);

  const positions = useMemo(() => Array.from({ length: 48 }, (_, i) => i), []);

  return (
    <div
      className="grid w-full min-w-0 flex-1 gap-1.5 sm:gap-2.5"
      style={{
        gridTemplateColumns: `repeat(${BOARD_COLS}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${BOARD_ROWS}, minmax(0, 1fr))`,
        maxWidth: "1550px",
        aspectRatio: `${BOARD_COLS} / ${BOARD_ROWS}`,
      }}
    >
      {positions.map((pos) => (
        <Square
          key={pos}
          position={pos}
          occupants={occupantsByPosition.get(pos) ?? []}
          activePlayerId={activePlayerId}
        />
      ))}
    </div>
  );
}
