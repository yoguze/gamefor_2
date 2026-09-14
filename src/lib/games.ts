export type GameId = "button-mash" | "match-score" | "ongeki-practice";

export type GameDefinition = {
  id: GameId;
  title: string;
  description: string;
  accent: string;
};

export const GAMES: GameDefinition[] = [
  {
    id: "button-mash",
    title: "ボタン連打ゲーム",
    description: "1人ずつ30秒連打して、クリック数の多さを競うゲームです。",
    accent: "#ff6b4a",
  },
  {
    id: "match-score",
    title: "一致度ゲーム",
    description: "25問の2択クイズで、2人の好みがどれだけ一致するかを測るゲームです。",
    accent: "#2ec4b6",
  },
  {
    id: "ongeki-practice",
    title: "オンゲキ運指練習",
    description:
      "左右のSIDE・RGBボタン操作をPCキーボードで練習する1人用トレーニングです。",
    accent: "#7b6cff",
  },
];
