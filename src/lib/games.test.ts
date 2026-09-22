import { describe, expect, it } from "vitest";
import { GAMES } from "./games";

describe("GAMES", () => {
  it("has unique ids and required fields", () => {
    const ids = GAMES.map((game) => game.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const game of GAMES) {
      expect(game.title.length).toBeGreaterThan(0);
      expect(game.description.length).toBeGreaterThan(0);
      expect(game.accent).toMatch(/^#/);
    }
  });
});
