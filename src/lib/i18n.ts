import type { Language } from "./types";

export const LANGUAGES: Language[] = ["en", "es"];

export const DEFAULT_LANGUAGE: Language = "en";

type Dictionary = Record<string, Record<Language, string>>;

export const UI_TEXT: Dictionary = {
  title: { en: "The Drunk Dick", es: "La Polla Borracha" },
  subtitle: {
    en: "A dick-themed party board game — drink with your dick!",
    es: "Un juego de mesa de fiesta de pollas — ¡bebe con la polla!",
  },
  numPlayersLabel: { en: "Select number of players:", es: "Selecciona la cantidad de jugadores:" },
  playerNamesLabel: {
    en: "Names (optional):",
    es: "Nombres (opcional):",
  },
  startGame: { en: "Start Game", es: "Iniciar Juego" },
  players: { en: "Players", es: "Jugadores" },
  shotsShort: { en: "shots", es: "shots" },
  shotShort: { en: "shot", es: "shot" },
  rollDice: { en: "Roll Dice", es: "Lanzar Dado" },
  rolling: { en: "Rolling…", es: "Lanzando…" },
  turnOf: { en: "Turn:", es: "Turno de:" },
  player: { en: "Player", es: "Jugador" },
  jailed: { en: "In jail", es: "En la cárcel" },
  challengeTitle: { en: "Challenge!", es: "¡Reto!" },
  infoTitle: { en: "Event!", es: "¡Evento!" },
  diceShotsTitle: { en: "Dice shots!", es: "¡Shots del dado!" },
  takeLabel: { en: "Take:", es: "Toma:" },
  challengeDone: { en: "Challenge done", es: "Reto cumplido" },
  tookShot: { en: "I took the shot", es: "Tomé el shot" },
  gotIt: { en: "Got it", es: "Entendido" },
  drankThem: { en: "I drank them", es: "Me los tomé" },
  start: { en: "START", es: "SALIDA" },
  winner: { en: "WINNER", es: "WINNER" },
  gameOverTitle: { en: "Game over!", es: "¡Juego terminado!" },
  winnerAnnouncement: { en: "wins the game!", es: "¡gana la partida!" },
  finalScoresTitle: { en: "Final shot count", es: "Conteo final de shots" },
  playAgain: { en: "Play again", es: "Jugar de nuevo" },
  toastGameStarted: { en: "The game has begun! Cheers", es: "¡El juego ha comenzado! Salud" },
  toastSquareFull: { en: "Square is full! Roll again.", es: "¡Casilla llena! Vuelve a tirar." },
  toastJailSkip: {
    en: "was in jail and loses their turn!",
    es: "estaba en la cárcel y pierde el turno!",
  },
  toastBounceBack: {
    en: "Too far! You bounce back",
    es: "¡Te pasaste! Rebotas hacia atrás",
  },
  spacesShort: { en: "space(s)", es: "casilla(s)" },
  languageSwitchLabel: { en: "Language", es: "Idioma" },
  rolledLabel: { en: "Rolled:", es: "Salió:" },
  safeMessage: { en: "Safe! No shots this time.", es: "¡Salvado! No tomas esta vez." },
  minPlayersError: {
    en: "Choose between 3 and 15 players.",
    es: "Selecciona entre 3 y 15 jugadores.",
  },
  you: { en: "you", es: "tú" },
  waitingFor: { en: "Waiting for", es: "Esperando a" },
  tabGame: { en: "Game", es: "Juego" },
  tabPlayers: { en: "Players", es: "Jugadores" },
  playLocal: { en: "Play on this device", es: "Jugar en este dispositivo" },
  playLocalDesc: {
    en: "Pass the phone around the table, turn by turn.",
    es: "Pasa el teléfono en la mesa, turno por turno.",
  },
  playOnline: { en: "Play online", es: "Jugar en línea" },
  playOnlineDesc: {
    en: "Everyone joins from their own phone.",
    es: "Cada persona entra desde su propio teléfono.",
  },
  createRoomTitle: { en: "Create a room", es: "Crear una sala" },
  joinRoomTitle: { en: "Join a room", es: "Unirte a una sala" },
  roomCodeLabel: { en: "Room code", es: "Código de sala" },
  roomCodePlaceholder: { en: "e.g. AB3XZ", es: "ej. AB3XZ" },
  createRoomButton: { en: "Create room", es: "Crear sala" },
  joinRoomButton: { en: "Join room", es: "Unirse" },
  orDivider: { en: "or", es: "o" },
  connecting: { en: "Connecting…", es: "Conectando…" },
  roomJoinNotFound: { en: "Room not found.", es: "No se encontró la sala." },
  roomJoinFull: { en: "That room is full.", es: "Esa sala ya está llena." },
  roomJoinError: { en: "Couldn't join that room.", es: "No se pudo unir a esa sala." },
  roomCreateError: { en: "Couldn't create a room.", es: "No se pudo crear la sala." },
  yourRoomCode: { en: "Room code:", es: "Código de sala:" },
  shareHint: {
    en: "Share this code so others can join.",
    es: "Comparte este código para que otros se unan.",
  },
  youArePlayer: { en: "You are", es: "Tú eres" },
  leaveRoom: { en: "Leave room", es: "Salir de la sala" },
  backToMenu: { en: "Back to menu", es: "Volver al menú" },
  loadingBoard: { en: "Loading board…", es: "Cargando tablero…" },
  newGame: { en: "New game", es: "Nueva partida" },
  confirmRestart: {
    en: "Start a new game? Current progress will be lost.",
    es: "¿Iniciar una nueva partida? Se perderá el progreso actual.",
  },
  confirm: { en: "Yes, restart", es: "Sí, reiniciar" },
  cancel: { en: "Cancel", es: "Cancelar" },
};

export function t(key: keyof typeof UI_TEXT, lang: Language): string {
  return UI_TEXT[key]?.[lang] ?? key;
}
