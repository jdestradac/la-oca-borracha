import { getSquare, PLAYER_COLORS } from "./boardData";
import type { GameState, Player } from "./types";
import { BOARD_END, MAX_TOKENS_PER_SQUARE } from "./types";

export type GameAction =
  | { type: "START_GAME"; numPlayers: number; names?: string[] }
  | { type: "ROLL_START"; roll: number }
  | { type: "ROLL_RESULT"; roll: number }
  | { type: "RESOLVE_MODAL"; tookShot: boolean }
  | { type: "SKIP_JAILED_TURN" }
  | { type: "DISMISS_TOAST" }
  | { type: "RESTART" }
  | { type: "HYDRATE"; state: GameState };

export const initialGameState: GameState = {
  phase: "setup",
  players: [],
  currentPlayerIndex: 0,
  toast: null,
  modal: null,
  isRolling: false,
  lastRoll: null,
  diceSpin: 0,
};

function nextPlayerIndex(state: GameState): number {
  return (state.currentPlayerIndex + 1) % state.players.length;
}

function updatePlayer(players: Player[], id: number, patch: Partial<Player>): Player[] {
  return players.map((p) => (p.id === id ? { ...p, ...patch } : p));
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      const players: Player[] = Array.from({ length: action.numPlayers }, (_, i) => ({
        id: i,
        name: action.names?.[i]?.trim() ?? "",
        color: PLAYER_COLORS[i % PLAYER_COLORS.length],
        position: 0,
        shots: 0,
        jailed: false,
      }));
      return {
        ...initialGameState,
        phase: "playing",
        players,
        toast: { key: "gameStarted" },
      };
    }

    case "HYDRATE": {
      return action.state;
    }

    case "ROLL_START": {
      return {
        ...state,
        isRolling: true,
        lastRoll: action.roll,
        diceSpin: state.diceSpin + 1,
        toast: null,
      };
    }

    case "ROLL_RESULT": {
      const current = state.players[state.currentPlayerIndex];
      if (!current) return state;

      const rawTarget = current.position + action.roll;
      const overshoot = rawTarget > BOARD_END ? rawTarget - BOARD_END : 0;
      const target = overshoot > 0 ? BOARD_END - overshoot : rawTarget;

      if (target > 0 && target < BOARD_END) {
        const occupants = state.players.filter(
          (p) => p.id !== current.id && p.position === target
        ).length;
        if (occupants >= MAX_TOKENS_PER_SQUARE) {
          return {
            ...state,
            isRolling: false,
            toast: { key: "squareFull" },
          };
        }
      }

      if (target === BOARD_END) {
        return {
          ...state,
          isRolling: false,
          phase: "finished",
          modal: null,
          players: updatePlayer(state.players, current.id, { position: BOARD_END }),
        };
      }

      const bounceToast = overshoot > 0 ? ({ key: "bounceBack", spaces: overshoot } as const) : null;
      const square = getSquare(target);
      const effect = square?.effect;

      if (!effect) {
        return {
          ...state,
          isRolling: false,
          toast: bounceToast,
          players: updatePlayer(state.players, current.id, { position: target }),
          modal: {
            open: true,
            squareNumber: target,
            shots: square?.shots ?? 0,
            mode: "challenge",
            hasAlternative: square?.hasAlternative ?? false,
          },
        };
      }

      switch (effect.kind) {
        case "return-to-start": {
          return {
            ...state,
            isRolling: false,
            toast: bounceToast,
            players: updatePlayer(state.players, current.id, { position: 0 }),
            modal: { open: true, squareNumber: target, shots: 0, mode: "info", hasAlternative: false },
          };
        }
        case "move-back": {
          const finalPosition = Math.max(0, target - effect.amount);
          return {
            ...state,
            isRolling: false,
            toast: bounceToast,
            players: updatePlayer(state.players, current.id, { position: finalPosition }),
            modal: { open: true, squareNumber: target, shots: 0, mode: "info", hasAlternative: false },
          };
        }
        case "move-before-last": {
          const others = state.players.filter((p) => p.id !== current.id);
          const minPos = others.length > 0 ? Math.min(...others.map((p) => p.position)) : 0;
          const finalPosition = Math.max(0, minPos - 1);
          return {
            ...state,
            isRolling: false,
            toast: bounceToast,
            players: updatePlayer(state.players, current.id, { position: finalPosition }),
            modal: { open: true, squareNumber: target, shots: 0, mode: "info", hasAlternative: false },
          };
        }
        case "jail": {
          return {
            ...state,
            isRolling: false,
            toast: bounceToast,
            players: updatePlayer(state.players, current.id, {
              position: target,
              jailed: true,
            }),
            modal: { open: true, squareNumber: target, shots: 0, mode: "info", hasAlternative: false },
          };
        }
        case "dice-shots": {
          const shotsRolled = Math.floor(Math.random() * 6) + 1;
          return {
            ...state,
            isRolling: false,
            toast: bounceToast,
            players: updatePlayer(state.players, current.id, { position: target }),
            modal: {
              open: true,
              squareNumber: target,
              shots: shotsRolled,
              mode: "dice-shots",
              hasAlternative: false,
            },
          };
        }
        case "odd-even-shot": {
          const subRoll = Math.floor(Math.random() * 6) + 1;
          const isOdd = subRoll % 2 === 1;
          const matched = effect.parity === "odd" ? isOdd : !isOdd;
          const shotsGained = matched ? effect.shots : 0;
          return {
            ...state,
            isRolling: false,
            toast: bounceToast,
            players: updatePlayer(state.players, current.id, {
              position: target,
              shots: current.shots + shotsGained,
            }),
            modal: {
              open: true,
              squareNumber: target,
              shots: shotsGained,
              mode: "info",
              hasAlternative: false,
              rollResult: subRoll,
            },
          };
        }
        default:
          return state;
      }
    }

    case "RESOLVE_MODAL": {
      if (!state.modal) return state;
      const current = state.players[state.currentPlayerIndex];
      const shouldAddShots = state.modal.mode === "dice-shots" ? true : action.tookShot;
      const players = shouldAddShots
        ? updatePlayer(state.players, current.id, { shots: current.shots + state.modal.shots })
        : state.players;

      return {
        ...state,
        players,
        modal: null,
        currentPlayerIndex: nextPlayerIndex({ ...state, players }),
      };
    }

    case "SKIP_JAILED_TURN": {
      const current = state.players[state.currentPlayerIndex];
      if (!current) return state;
      const players = updatePlayer(state.players, current.id, { jailed: false });
      return {
        ...state,
        players,
        toast: { key: "jailSkip", playerId: current.id },
        currentPlayerIndex: nextPlayerIndex({ ...state, players }),
      };
    }

    case "DISMISS_TOAST":
      return { ...state, toast: null };

    case "RESTART":
      return initialGameState;

    default:
      return state;
  }
}
