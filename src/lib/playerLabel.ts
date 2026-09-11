import type { Player } from "./types";

/** A player's custom name if they set one, else "Player N" (localized). */
export function playerLabel(player: Player, playerWord: string): string {
  const trimmed = player.name.trim();
  return trimmed || `${playerWord} ${player.id + 1}`;
}
