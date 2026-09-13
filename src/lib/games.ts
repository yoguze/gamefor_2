export type GameId = "button-mash" | "match-score";

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
    description: "制限時間内にどれだけボタンを連打できるか競うゲームです。",
    accent: "#ff6b4a",
  },
  {
    id: "match-score",
    title: "一致度ゲーム",
    description: "25問の2択クイズで、2人の好みがどれだけ一致するかを測るゲームです。",
    accent: "#2ec4b6",
  },
];
