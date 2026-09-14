import type { ButtonId } from "./buttons";
import type { Problem, ProblemKind } from "./generate";

export type ProblemLog = {
  index: number;
  problem: Problem;
  missCount: number;
  cleared: boolean;
  answerTimeMs: number | null;
  missButtons: ButtonId[];
};

export type PlayStats = {
  score: number;
  maxCombo: number;
  totalMisses: number;
  missedProblems: ProblemLog[];
  averageAnswerMs: number | null;
  fastestAnswerMs: number | null;
  multiAttempts: number;
  multiSuccesses: number;
  multiSuccessRate: number | null;
  byKind: Record<
    ProblemKind,
    { attempts: number; clears: number; misses: number }
  >;
  bySize: Record<2 | 3 | 4, { attempts: number; clears: number; misses: number }>;
  missLeft: number;
  missRight: number;
  missRed: number;
  missGreen: number;
  missBlue: number;
  missLeftSide: number;
  missRightSide: number;
};

function emptyKind() {
  return { attempts: 0, clears: 0, misses: 0 };
}

export function buildPlayStats(
  logs: ProblemLog[],
  score: number,
  maxCombo: number,
): PlayStats {
  const byKind: PlayStats["byKind"] = {
    single: emptyKind(),
    oneHand: emptyKind(),
    bothHands: emptyKind(),
  };
  const bySize: PlayStats["bySize"] = {
    2: emptyKind(),
    3: emptyKind(),
    4: emptyKind(),
  };

  let totalMisses = 0;
  let missLeft = 0;
  let missRight = 0;
  let missRed = 0;
  let missGreen = 0;
  let missBlue = 0;
  let missLeftSide = 0;
  let missRightSide = 0;
  const answerTimes: number[] = [];
  let multiAttempts = 0;
  let multiSuccesses = 0;

  for (const log of logs) {
    const { problem, missCount, cleared, answerTimeMs, missButtons } = log;
    const kind = problem.kind;
    byKind[kind].attempts += 1;
    byKind[kind].misses += missCount;
    if (cleared) byKind[kind].clears += 1;

    const size = problem.ids.length;
    if (size >= 2 && size <= 4) {
      const key = size as 2 | 3 | 4;
      bySize[key].attempts += 1;
      bySize[key].misses += missCount;
      if (cleared) bySize[key].clears += 1;
    }

    totalMisses += missCount;
    if (answerTimeMs != null && cleared) answerTimes.push(answerTimeMs);

    if (size >= 2) {
      multiAttempts += 1;
      if (cleared && missCount === 0) multiSuccesses += 1;
      // 成功率は「クリアできた同時押し」寄り: 挑戦数に対するクリア数
    }

    for (const id of missButtons) {
      if (id.startsWith("L_")) missLeft += 1;
      if (id.startsWith("R_")) missRight += 1;
      if (id.includes("RED") && !id.includes("SIDE")) missRed += 1;
      if (id.includes("GREEN")) missGreen += 1;
      if (id.includes("BLUE") && !id.includes("SIDE")) missBlue += 1;
      if (id === "L_SIDE") missLeftSide += 1;
      if (id === "R_SIDE") missRightSide += 1;
    }
  }

  // 同時押し成功率 = クリア数 / 挑戦数（2ボタン以上）
  multiSuccesses = logs.filter(
    (l) => l.problem.ids.length >= 2 && l.cleared,
  ).length;
  multiAttempts = logs.filter((l) => l.problem.ids.length >= 2).length;

  const averageAnswerMs =
    answerTimes.length === 0
      ? null
      : answerTimes.reduce((a, b) => a + b, 0) / answerTimes.length;
  const fastestAnswerMs =
    answerTimes.length === 0 ? null : Math.min(...answerTimes);

  return {
    score,
    maxCombo,
    totalMisses,
    missedProblems: logs.filter((l) => l.missCount > 0),
    averageAnswerMs,
    fastestAnswerMs,
    multiAttempts,
    multiSuccesses,
    multiSuccessRate:
      multiAttempts === 0 ? null : multiSuccesses / multiAttempts,
    byKind,
    bySize,
    missLeft,
    missRight,
    missRed,
    missGreen,
    missBlue,
    missLeftSide,
    missRightSide,
  };
}
