"use client";

import { useMemo } from "react";
import type { Player } from "@/lib/types";
import { Square } from "./Square";

/** Mobile-only board: instead of the desktop snake grid, squares flow in
 * play order (0 start ... 47 winner), two numbered squares per row, so
 * nothing has to shrink below a comfortable tap size. Runs long vertically
 * on purpose — that's the trade-off for readable squares on a phone. */
export function MobileBoard({
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

  const numberedPairs = useMemo(() => {
    const pairs: [number, number][] = [];
    for (let n = 1; n <= 46; n += 2) pairs.push([n, n + 1]);
    return pairs;
  }, []);

  const renderSquare = (pos: number) => (
    <Square
      key={pos}
      position={pos}
      occupants={occupantsByPosition.get(pos) ?? []}
      activePlayerId={activePlayerId}
      layoutMode="flow"
    />
  );

  return (
    <div className="flex w-full flex-col gap-2">
      {renderSquare(0)}
      {numberedPairs.map(([a, b]) => (
        <div key={a} className="grid grid-cols-2 gap-2">
          {renderSquare(a)}
          {renderSquare(b)}
        </div>
      ))}
      {renderSquare(47)}
    </div>
  );
}
