import type { SquareData } from "./types";

export const PLAYER_COLORS = [
  "#ff6565",
  "#ffaf65",
  "#f0ff65",
  "#91ff65",
  "#4ade80",
  "#5eb1ff",
  "#7c8cff",
  "#c084fc",
  "#f472b6",
  "#fb7185",
  "#fbbf24",
  "#34d399",
  "#22d3ee",
  "#a78bfa",
  "#f87171",
];

export const BOARD_COLS = 10;
export const BOARD_ROWS = 5;

/**
 * START and WINNER are double-wide (2 columns) so they can hold many player
 * tokens, so the 46 numbered squares snake around them instead of using a
 * plain uniform grid. Each segment below is one grid row's worth of
 * numbered squares: where it starts counting from, which column it starts
 * at, and which direction it reads.
 */
const PATH_SEGMENTS = [
  { rowFromBottom: 0, count: 8, startCol: 2, dir: 1 }, // squares 1-8 (start occupies cols 0-1)
  { rowFromBottom: 1, count: 10, startCol: 9, dir: -1 }, // squares 9-18
  { rowFromBottom: 2, count: 10, startCol: 0, dir: 1 }, // squares 19-28
  { rowFromBottom: 3, count: 10, startCol: 9, dir: -1 }, // squares 29-38
  { rowFromBottom: 4, count: 8, startCol: 0, dir: 1 }, // squares 39-46 (winner occupies cols 8-9)
];

/** Maps a linear board position (0 = start ... 47 = winner) to a grid cell. */
export function getGridPosition(pos: number): { row: number; col: number } {
  if (pos === 0) return { row: BOARD_ROWS - 1, col: 0 };
  if (pos === 47) return { row: 0, col: BOARD_COLS - 2 };

  let remaining = pos - 1;
  for (const segment of PATH_SEGMENTS) {
    if (remaining < segment.count) {
      const row = BOARD_ROWS - 1 - segment.rowFromBottom;
      const col = segment.startCol + segment.dir * remaining;
      return { row, col };
    }
    remaining -= segment.count;
  }
  return { row: 0, col: 0 };
}

/**
 * Source of truth for the 44 numbered rules photo, translated to English as
 * the game's default language, with the original Spanish kept as the
 * alternate language. 45/46 round out the board in the same spirit as the
 * original sketch, fixing its `1-6` shots bug with a real dice roll instead.
 *
 * `hasAlternative` marks squares that are a genuine "do X or take N shots"
 * dare for whoever rolled — those get both the "challenge done" and "took
 * the shot" buttons. Blanket/category rules ("everyone drinks", "virgins
 * drink", "the person to your right drinks") have nothing personal for the
 * roller to complete, so they only get an acknowledgement button and carry
 * no trackable shots for the roller.
 */
export const SQUARES: SquareData[] = [
  {
    number: 1,
    text: {
      en: "The person to your right must take 1 shot",
      es: "La persona que se encuentra a tu derecha debe tomar 1 shot",
    },
    shots: 1,
    hasAlternative: false,
  },
  {
    number: 2,
    text: {
      en: "Play rock, paper, scissors — the loser takes 1 shot",
      es: "Juegas piedra, papel o tijera y el perdedor toma 1 shot",
    },
    shots: 1,
    hasAlternative: false,
  },
  {
    number: 3,
    text: { en: "Everyone must take 1 shot", es: "Todos deben tomar 1 shot" },
    shots: 1,
    hasAlternative: false,
  },
  {
    number: 4,
    text: {
      en: "Answer a question or do a dare, or take 2 shots",
      es: "Responde una pregunta o haz un reto, si no lo haces toma 2 shots",
    },
    shots: 2,
    hasAlternative: true,
  },
  {
    number: 5,
    text: { en: "Virgins take 1 shot", es: "Los vírgenes toman 1 shot" },
    shots: 1,
    hasAlternative: false,
  },
  {
    number: 6,
    text: {
      en: "Anyone born January through June takes 1 shot",
      es: "Los que nacieron de enero a junio toman 1 shot",
    },
    shots: 1,
    hasAlternative: false,
  },
  {
    number: 7,
    text: { en: "All the men take 1 shot", es: "Todos los hombres toman 1 shot" },
    shots: 1,
    hasAlternative: false,
  },
  {
    number: 8,
    text: {
      en: "Roll the dice: if it's odd, take 1 shot",
      es: "Tira el dado: si sacas un número impar, toma 1 shot",
    },
    shots: 0,
    hasAlternative: false,
    effect: { kind: "odd-even-shot", parity: "odd", shots: 1 },
  },
  {
    number: 9,
    text: {
      en: "Tell your worst sexual experience or take 2 shots (3 if you're a virgin)",
      es: "Cuenta tu peor experiencia sexual o toma 2 shots (si eres virgen, tomas 3)",
    },
    shots: 2,
    hasAlternative: true,
  },
  {
    number: 10,
    text: { en: "Non-virgins take 1 shot", es: "Los que no son vírgenes toman 1 shot" },
    shots: 1,
    hasAlternative: false,
  },
  {
    number: 11,
    text: { en: "Everyone takes 1 shot, except you", es: "Todos toman 1 shot, menos tú" },
    shots: 0,
    hasAlternative: false,
  },
  {
    number: 12,
    text: {
      en: "Anyone born July through December takes 1 shot",
      es: "Los que nacieron de julio a diciembre toman 1 shot",
    },
    shots: 1,
    hasAlternative: false,
  },
  {
    number: 13,
    text: {
      en: "Roll the dice: if it's even, take 1 shot",
      es: "Tira el dado: si sacas un número par, toma 1 shot",
    },
    shots: 0,
    hasAlternative: false,
    effect: { kind: "odd-even-shot", parity: "even", shots: 1 },
  },
  {
    number: 14,
    text: {
      en: "Show the last photo in your gallery or take 2 shots",
      es: "Muestra la última foto de tu galería o toma 2 shots",
    },
    shots: 2,
    hasAlternative: true,
  },
  {
    number: 15,
    text: { en: "Everyone must take 1 shot", es: "Todos deben tomar 1 shot" },
    shots: 1,
    hasAlternative: false,
  },
  {
    number: 16,
    text: { en: "All the women take 1 shot", es: "Todas las mujeres toman 1 shot" },
    shots: 1,
    hasAlternative: false,
  },
  {
    number: 17,
    text: {
      en: "Kiss someone of the same sex (players choose who) or take 3 shots",
      es: "Tienes que besar a alguien del mismo sexo (elijen los jugadores) o toma 3 shots",
    },
    shots: 3,
    hasAlternative: true,
  },
  {
    number: 18,
    text: {
      en: "A body part is chosen: the last to touch it must give a kiss, or take 3 shots",
      es: "Se elige una parte del cuerpo: el último que la toque debe dar un beso, si no quiere, toma 3 shots",
    },
    shots: 3,
    hasAlternative: true,
  },
  {
    number: 19,
    text: {
      en: "Tell your best sexual experience or take 2 shots (3 if you're a virgin)",
      es: "Cuenta tu mejor experiencia sexual o toma 2 shots (si eres virgen, tomas 3)",
    },
    shots: 2,
    hasAlternative: true,
  },
  {
    number: 20,
    text: { en: "Everyone must take 1 shot", es: "Todos deben tomar 1 shot" },
    shots: 1,
    hasAlternative: false,
  },
  {
    number: 21,
    text: {
      en: "Everyone in the LGBTQ+ community takes 1 shot",
      es: "Todos los que pertenezcan a la comunidad LGBTQ+ toman 1 shot",
    },
    shots: 1,
    hasAlternative: false,
  },
  {
    number: 22,
    text: { en: "You go back to start!", es: "¡Regresas a la salida!" },
    shots: 0,
    hasAlternative: false,
    effect: { kind: "return-to-start" },
  },
  {
    number: 23,
    text: { en: "All the singles take 1 shot", es: "Todos los solteros toman 1 shot" },
    shots: 1,
    hasAlternative: false,
  },
  {
    number: 24,
    text: {
      en: "Play passing a card mouth-to-mouth; when it drops, both take 1 shot",
      es: "Jueguen a pasar la carta con la boca; cuando se caiga, los dos toman 1 shot",
    },
    shots: 1,
    hasAlternative: false,
  },
  {
    number: 25,
    text: {
      en: "Lemon and salt shot (players choose who) or take 3 shots",
      es: "Shot con limón y sal (elijen los jugadores) o toma 3 shots",
    },
    shots: 3,
    hasAlternative: true,
  },
  {
    number: 26,
    text: { en: "Do a twerk or take 1 shot", es: "Haz twerk o toma 1 shot" },
    shots: 1,
    hasAlternative: true,
  },
  {
    number: 27,
    text: { en: "Jail! You can't play for 1 round", es: "¡Cárcel! No puedes jugar durante 1 ronda" },
    shots: 0,
    hasAlternative: false,
    effect: { kind: "jail" },
  },
  {
    number: 28,
    text: { en: "Karaoke time! Or take 2 shots", es: "¡Karaoke time! O toma 2 shots" },
    shots: 2,
    hasAlternative: true,
  },
  {
    number: 29,
    text: { en: "Everyone must take 1 shot", es: "Todos deben tomar 1 shot" },
    shots: 1,
    hasAlternative: false,
  },
  {
    number: 30,
    text: {
      en: "5 minutes in heaven with the most-voted player, or take 3 shots",
      es: "5 minutos en el paraíso con la persona más votada o toma 3 shots",
    },
    shots: 3,
    hasAlternative: true,
  },
  {
    number: 31,
    text: { en: "Dare or take 3 shots", es: "Reto o toma 3 shots" },
    shots: 3,
    hasAlternative: true,
  },
  {
    number: 32,
    text: {
      en: "Blindfolded: whoever you touch first, you kiss",
      es: "Ojos vendados: a la primera persona que toques, la besas",
    },
    shots: 0,
    hasAlternative: false,
  },
  {
    number: 33,
    text: { en: "Go back 10 squares", es: "Retrocedes 10 casillas" },
    shots: 0,
    hasAlternative: false,
    effect: { kind: "move-back", amount: 10 },
  },
  {
    number: 34,
    text: {
      en: "Tell your favorite sex position or take 2 shots",
      es: "Cuenta tu posición sexual favorita o toma 2 shots",
    },
    shots: 2,
    hasAlternative: true,
  },
  {
    number: 35,
    text: { en: "Moan in front of everyone or take 3 shots", es: "Gime delante de todos o toma 3 shots" },
    shots: 3,
    hasAlternative: true,
  },
  {
    number: 36,
    text: {
      en: "Whisper something bold and suggestive into the ear of your choice, or take 4 shots",
      es: "Susurra algo atrevido y sugerente al oído de quien elijas o toma 4 shots",
    },
    shots: 4,
    hasAlternative: true,
  },
  {
    number: 37,
    text: {
      en: "Point to who you think is biggest and who's smallest, without saying which is which",
      es: "Señala a quien crees que la tiene más grande y a quien más pequeña, sin decir quién es quien",
    },
    shots: 0,
    hasAlternative: false,
  },
  {
    number: 38,
    text: {
      en: "Demonstrate an oral sex technique or take 4 shots",
      es: "Haz la demostración de un oral o toma 4 shots",
    },
    shots: 4,
    hasAlternative: true,
  },
  {
    number: 39,
    text: {
      en: "Blind kiss: guess who it is. If you're wrong, 1 shot",
      es: "Beso a ciegas: adivina quién es. Si fallas, 1 shot",
    },
    shots: 1,
    hasAlternative: true,
  },
  {
    number: 40,
    text: { en: "Everyone must take 1 shot", es: "Todos deben tomar 1 shot" },
    shots: 1,
    hasAlternative: false,
  },
  {
    number: 41,
    text: {
      en: "Go back to one square before the player furthest from the goal",
      es: "Retrocedes a una casilla antes del jugador más lejos de la meta",
    },
    shots: 0,
    hasAlternative: false,
    effect: { kind: "move-before-last" },
  },
  {
    number: 42,
    text: {
      en: "Send a nude to someone in the group for a single view, or take 4 shots",
      es: "Manda un nude a alguien del grupo para ver una sola vez o toma 4 shots",
    },
    shots: 4,
    hasAlternative: true,
  },
  {
    number: 43,
    text: {
      en: "Act out the sex position voted by whoever the bottle picks, or take 4 shots",
      es: "Haz la postura sexual votada con la persona que elija la botella o toma 4 shots",
    },
    shots: 4,
    hasAlternative: true,
  },
  {
    number: 44,
    text: {
      en: "Group kiss of 3 (players choose who) or take 4 shots",
      es: "Beso de 3 (elijen los jugadores) o toma 4 shots",
    },
    shots: 4,
    hasAlternative: true,
  },
  {
    number: 45,
    text: {
      en: "Roll the dice: take that many shots",
      es: "Tira el dado: toma esa cantidad de shots",
    },
    shots: 0,
    hasAlternative: false,
    effect: { kind: "dice-shots" },
  },
  {
    number: 46,
    text: {
      en: "All or nothing: take off an item of clothing or take 5 shots",
      es: "Todo o nada: quítate una prenda o toma 5 shots",
    },
    shots: 5,
    hasAlternative: true,
  },
];

export function getSquare(number: number): SquareData | undefined {
  return SQUARES.find((s) => s.number === number);
}
