import { describe, expect, it } from "vitest";
import { generateProblem } from "./generate";
import { isLegalChord } from "./legality";

describe("generateProblem", () => {
  it("always returns a legal chord", () => {
    for (let i = 1; i <= 40; i += 1) {
      const problem = generateProblem(i);
      expect(problem.ids.length).toBeGreaterThan(0);
      expect(problem.ids.length).toBeLessThanOrEqual(4);
      expect(isLegalChord(problem.ids)).toBe(true);
    }
  });

  it("returns a legal follow-up problem", () => {
    const first = generateProblem(1);
    const second = generateProblem(2, first);
    expect(isLegalChord(second.ids)).toBe(true);
    expect(["single", "oneHand", "bothHands"]).toContain(second.kind);
  });
});
