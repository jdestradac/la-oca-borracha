export type Language = "en" | "es";

export type LocalizedText = Record<Language, string>;

export type SquareEffect =
  | { kind: "return-to-start" }
  | { kind: "move-back"; amount: number }
  | { kind: "move-before-last" }
  | { kind: "jail" }
  | { kind: "dice-shots" }
  | { kind: "odd-even-shot"; parity: "odd" | "even"; shots: number };

export interface SquareData {
  number: number;
  text: LocalizedText;
  shots: number;
  effect?: SquareEffect;
  /**
   * True when the square offers a real "do X or take N shots" choice for
   * whoever rolled. False for blanket/category rules (e.g. "everyone
   * drinks", "virgins drink") where there is nothing personal for the
   * roller to complete — those only show an acknowledgement button.
   */
  hasAlternative: boolean;
}

export interface Player {
  id: number;
  color: string;
  position: number;
  shots: number;
  jailed: boolean;
}

export type GamePhase = "setup" | "playing" | "finished";

export interface ModalState {
  open: boolean;
  squareNumber: number;
  shots: number;
  mode: "challenge" | "info" | "dice-shots";
  hasAlternative: boolean;
  rollResult?: number;
}

export type ToastMessage =
  | { key: "gameStarted" }
  | { key: "squareFull" }
  | { key: "jailSkip"; playerId: number }
  | { key: "bounceBack"; spaces: number }
  | null;

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  toast: ToastMessage;
  modal: ModalState | null;
  isRolling: boolean;
  lastRoll: number | null;
  diceSpin: number;
}

export const BOARD_START = 0;
export const BOARD_END = 47;
export const MAX_TOKENS_PER_SQUARE = 3;
