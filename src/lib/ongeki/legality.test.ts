import { describe, expect, it } from "vitest";
import { chordKey, isLegalChord } from "./legality";

describe("isLegalChord", () => {
  it("allows single buttons", () => {
    expect(isLegalChord(["L_RED"])).toBe(true);
    expect(isLegalChord(["R_SIDE"])).toBe(true);
  });

  it("rejects empty or oversized chords", () => {
    expect(isLegalChord([])).toBe(false);
    expect(
      isLegalChord(["L_RED", "L_GREEN", "L_BLUE", "R_RED", "R_GREEN"]),
    ).toBe(false);
  });

  it("rejects duplicate ids", () => {
    expect(isLegalChord(["L_RED", "L_RED"])).toBe(false);
  });

  it("allows left SIDE only with left RED", () => {
    expect(isLegalChord(["L_SIDE", "L_RED"])).toBe(true);
    expect(isLegalChord(["L_SIDE", "L_GREEN"])).toBe(false);
    expect(isLegalChord(["L_SIDE", "L_RED", "L_GREEN"])).toBe(false);
  });

  it("allows right SIDE only with right BLUE", () => {
    expect(isLegalChord(["R_SIDE", "R_BLUE"])).toBe(true);
    expect(isLegalChord(["R_SIDE", "R_RED"])).toBe(false);
  });

  it("allows both-hand RGB without SIDE conflict", () => {
    expect(isLegalChord(["L_RED", "R_BLUE"])).toBe(true);
    expect(isLegalChord(["L_GREEN", "L_BLUE", "R_RED", "R_GREEN"])).toBe(true);
  });
});

describe("chordKey", () => {
  it("sorts ids for stable comparison", () => {
    expect(chordKey(["R_BLUE", "L_RED"])).toBe(chordKey(["L_RED", "R_BLUE"]));
  });
});
