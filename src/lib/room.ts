import { gameReducer, initialGameState, type GameAction } from "./gameReducer";
import { storeDelete, storeGet, storeSet } from "./store";
import type { GameState } from "./types";

export interface RoomRecord {
  roomId: string;
  state: GameState;
  numPlayers: number;
  claimedSeats: number[];
  createdAt: number;
}

const ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion

function generateRoomCode(length = 5): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
  }
  return code;
}

function roomKey(roomId: string): string {
  return `room:${roomId.toUpperCase()}`;
}

/** Auto-skips the current player's turn if they're jailed and nothing is blocking it. */
function tick(record: RoomRecord): RoomRecord {
  const { state } = record;
  if (state.phase !== "playing" || state.isRolling || state.modal?.open) return record;
  const current = state.players[state.currentPlayerIndex];
  if (!current?.jailed) return record;
  return { ...record, state: gameReducer(state, { type: "SKIP_JAILED_TURN" }) };
}

export async function createRoom(
  numPlayers: number
): Promise<{ roomId: string; playerId: number; state: GameState }> {
  let roomId = generateRoomCode();
  // Extremely unlikely to collide, but guard anyway.
  for (let attempts = 0; attempts < 5 && (await storeGet(roomKey(roomId))); attempts++) {
    roomId = generateRoomCode();
  }

  const state = gameReducer(initialGameState, { type: "START_GAME", numPlayers });
  const record: RoomRecord = {
    roomId,
    state,
    numPlayers,
    claimedSeats: [0],
    createdAt: Date.now(),
  };
  await storeSet(roomKey(roomId), record);
  return { roomId, playerId: 0, state };
}

export async function getRoom(roomId: string): Promise<RoomRecord | null> {
  const record = await storeGet<RoomRecord>(roomKey(roomId));
  if (!record) return null;
  const ticked = tick(record);
  if (ticked !== record) await storeSet(roomKey(roomId), ticked);
  return ticked;
}

export async function joinRoom(
  roomId: string
): Promise<{ playerId: number; state: GameState } | { error: string }> {
  const record = await getRoom(roomId);
  if (!record) return { error: "not-found" };

  const openSeat = Array.from({ length: record.numPlayers }, (_, i) => i).find(
    (seat) => !record.claimedSeats.includes(seat)
  );
  if (openSeat === undefined) return { error: "full" };

  const updated: RoomRecord = { ...record, claimedSeats: [...record.claimedSeats, openSeat] };
  await storeSet(roomKey(roomId), updated);
  return { playerId: openSeat, state: updated.state };
}

export async function rollForPlayer(
  roomId: string,
  playerId: number
): Promise<{ roll: number; state: GameState } | { error: string }> {
  const record = await getRoom(roomId);
  if (!record) return { error: "not-found" };
  const { state } = record;

  if (state.phase !== "playing") return { error: "not-playing" };
  if (state.isRolling || state.modal?.open) return { error: "busy" };
  if (state.currentPlayerIndex !== playerId) return { error: "not-your-turn" };
  const current = state.players[playerId];
  if (!current || current.jailed) return { error: "not-your-turn" };

  const roll = Math.floor(Math.random() * 6) + 1;
  let next = gameReducer(state, { type: "ROLL_START", roll });
  next = gameReducer(next, { type: "ROLL_RESULT", roll });

  const updated: RoomRecord = { ...record, state: next };
  await storeSet(roomKey(roomId), updated);
  return { roll, state: next };
}

export async function dispatchRoomAction(
  roomId: string,
  action: GameAction,
  playerId: number | null
): Promise<{ state: GameState } | { error: string }> {
  const record = await getRoom(roomId);
  if (!record) return { error: "not-found" };
  const { state } = record;

  if (action.type === "RESOLVE_MODAL") {
    if (!state.modal?.open) return { error: "no-modal" };
    if (playerId !== state.currentPlayerIndex) return { error: "not-your-turn" };
  }

  // A "rematch" keeps the same room code and claimed seats instead of
  // wiping the room back to the (online-mode-less) setup phase.
  const next =
    action.type === "RESTART"
      ? gameReducer(initialGameState, { type: "START_GAME", numPlayers: record.numPlayers })
      : gameReducer(state, action);

  const updated: RoomRecord = { ...record, state: next };
  await storeSet(roomKey(roomId), updated);
  return { state: next };
}

export async function deleteRoom(roomId: string): Promise<void> {
  await storeDelete(roomKey(roomId));
}
