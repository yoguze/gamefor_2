import type { ButtonId } from "./buttons";

/** 同一手の SIDE+RGB は原則禁止。例外は左SIDE+左RED / 右SIDE+右BLUE のみ */
export function isLegalChord(ids: ButtonId[]): boolean {
  const set = new Set(ids);
  if (set.size !== ids.length) return false;
  if (ids.length === 0 || ids.length > 4) return false;

  const leftSide = set.has("L_SIDE");
  const rightSide = set.has("R_SIDE");
  const leftRgb = (["L_RED", "L_GREEN", "L_BLUE"] as ButtonId[]).filter((id) =>
    set.has(id),
  );
  const rightRgb = (["R_RED", "R_GREEN", "R_BLUE"] as ButtonId[]).filter((id) =>
    set.has(id),
  );

  if (leftSide && leftRgb.length > 0) {
    if (!(leftRgb.length === 1 && leftRgb[0] === "L_RED")) return false;
  }
  if (rightSide && rightRgb.length > 0) {
    if (!(rightRgb.length === 1 && rightRgb[0] === "R_BLUE")) return false;
  }

  return true;
}

export function chordKey(ids: ButtonId[]): string {
  return [...ids].sort().join("+");
}
