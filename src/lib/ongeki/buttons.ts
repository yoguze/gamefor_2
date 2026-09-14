export type ButtonId =
  | "L_SIDE"
  | "L_RED"
  | "L_GREEN"
  | "L_BLUE"
  | "R_RED"
  | "R_GREEN"
  | "R_BLUE"
  | "R_SIDE";

export type Hand = "left" | "right";

export type ButtonDef = {
  id: ButtonId;
  code: string;
  label: string;
  hand: Hand;
  color: string;
  arrow: "←" | "→";
  isSide: boolean;
  isRed: boolean;
  isGreen: boolean;
  isBlue: boolean;
};

export const BUTTONS: ButtonDef[] = [
  {
    id: "L_SIDE",
    code: "Tab",
    label: "左SIDE",
    hand: "left",
    color: "#4534a8",
    arrow: "←",
    isSide: true,
    isRed: false,
    isGreen: false,
    isBlue: false,
  },
  {
    id: "L_RED",
    code: "KeyS",
    label: "左RED",
    hand: "left",
    color: "#e53935",
    arrow: "←",
    isSide: false,
    isRed: true,
    isGreen: false,
    isBlue: false,
  },
  {
    id: "L_GREEN",
    code: "KeyD",
    label: "左GREEN",
    hand: "left",
    color: "#43a047",
    arrow: "←",
    isSide: false,
    isRed: false,
    isGreen: true,
    isBlue: false,
  },
  {
    id: "L_BLUE",
    code: "KeyF",
    label: "左BLUE",
    hand: "left",
    color: "#1e88e5",
    arrow: "←",
    isSide: false,
    isRed: false,
    isGreen: false,
    isBlue: true,
  },
  {
    id: "R_RED",
    code: "KeyJ",
    label: "右RED",
    hand: "right",
    color: "#e53935",
    arrow: "→",
    isSide: false,
    isRed: true,
    isGreen: false,
    isBlue: false,
  },
  {
    id: "R_GREEN",
    code: "KeyK",
    label: "右GREEN",
    hand: "right",
    color: "#43a047",
    arrow: "→",
    isSide: false,
    isRed: false,
    isGreen: true,
    isBlue: false,
  },
  {
    id: "R_BLUE",
    code: "KeyL",
    label: "右BLUE",
    hand: "right",
    color: "#1e88e5",
    arrow: "→",
    isSide: false,
    isRed: false,
    isGreen: false,
    isBlue: true,
  },
  {
    id: "R_SIDE",
    code: "Enter",
    label: "右SIDE",
    hand: "right",
    color: "#c2185b",
    arrow: "→",
    isSide: true,
    isRed: false,
    isGreen: false,
    isBlue: false,
  },
];

export const BUTTON_BY_ID: Record<ButtonId, ButtonDef> = Object.fromEntries(
  BUTTONS.map((b) => [b.id, b]),
) as Record<ButtonId, ButtonDef>;

export const BUTTON_BY_CODE: Record<string, ButtonDef> = Object.fromEntries(
  BUTTONS.map((b) => [b.code, b]),
);

/** Tab / S D F / J K L / Enter のみ。それ以外のキーはゲーム入力として扱わない */
export const GAME_KEY_CODES = new Set(BUTTONS.map((b) => b.code));

export const ALL_BUTTON_IDS = BUTTONS.map((b) => b.id);

export const LEFT_IDS = BUTTONS.filter((b) => b.hand === "left").map((b) => b.id);
export const RIGHT_IDS = BUTTONS.filter((b) => b.hand === "right").map(
  (b) => b.id,
);

/** 同時押し判定幅（練習向けに 33ms より余裕を持たせる） */
export const CHORD_WINDOW_MS = 80;
export const INITIAL_DURATION_MS = 60_000;
export const MISS_PENALTY_THRESHOLD = 20;
export const MISS_PENALTY_MS = 500;
