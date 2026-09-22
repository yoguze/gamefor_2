import { describe, expect, it } from "vitest";
import { buildPlayStats, type ProblemLog } from "./stats";

describe("buildPlayStats", () => {
  it("aggregates misses and answer times", () => {
    const logs: ProblemLog[] = [
      {
        index: 1,
        problem: { ids: ["L_RED"], kind: "single", hand: "left" },
        missCount: 1,
        cleared: true,
        answerTimeMs: 400,
        missButtons: ["L_GREEN"],
      },
      {
        index: 2,
        problem: { ids: ["L_RED", "R_BLUE"], kind: "bothHands" },
        missCount: 0,
        cleared: true,
        answerTimeMs: 200,
        missButtons: [],
      },
    ];

    const stats = buildPlayStats(logs, 12, 5);
    expect(stats.score).toBe(12);
    expect(stats.maxCombo).toBe(5);
    expect(stats.totalMisses).toBe(1);
    expect(stats.missLeft).toBe(1);
    expect(stats.missGreen).toBe(1);
    expect(stats.averageAnswerMs).toBe(300);
    expect(stats.fastestAnswerMs).toBe(200);
    expect(stats.multiAttempts).toBe(1);
    expect(stats.multiSuccesses).toBe(1);
    expect(stats.byKind.single.attempts).toBe(1);
    expect(stats.byKind.bothHands.clears).toBe(1);
  });
});
