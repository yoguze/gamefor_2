import {
  ALL_BUTTON_IDS,
  LEFT_IDS,
  RIGHT_IDS,
  type ButtonId,
  type Hand,
} from "./buttons";
import { chordKey, isLegalChord } from "./legality";

export type ProblemKind = "single" | "oneHand" | "bothHands";

export type Problem = {
  ids: ButtonId[];
  kind: ProblemKind;
  hand?: Hand;
};

function randInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive);
}

function pickN<T>(pool: T[], n: number): T[] {
  const copy = [...pool];
  const out: T[] = [];
  while (out.length < n && copy.length > 0) {
    const i = randInt(copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

function combinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (k > arr.length) return [];
  const result: T[][] = [];
  const helper = (start: number, path: T[]) => {
    if (path.length === k) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < arr.length; i += 1) {
      path.push(arr[i]);
      helper(i + 1, path);
      path.pop();
    }
  };
  helper(0, []);
  return result;
}

function legalCombos(pool: ButtonId[], size: number): ButtonId[][] {
  return combinations(pool, size).filter(isLegalChord);
}

function randomLegalFromPool(
  pool: ButtonId[],
  size: number,
  avoidKey?: string,
): ButtonId[] | null {
  const options = legalCombos(pool, size).filter(
    (c) => chordKey(c) !== avoidKey,
  );
  if (options.length === 0) return null;
  return options[randInt(options.length)];
}

function makeSingle(avoidKey?: string): Problem {
  let id = ALL_BUTTON_IDS[randInt(ALL_BUTTON_IDS.length)];
  let guard = 0;
  while (chordKey([id]) === avoidKey && guard < 20) {
    id = ALL_BUTTON_IDS[randInt(ALL_BUTTON_IDS.length)];
    guard += 1;
  }
  return { ids: [id], kind: "single" };
}

function makeOneHand(avoidKey?: string): Problem {
  const hand: Hand = Math.random() < 0.5 ? "left" : "right";
  const pool = hand === "left" ? LEFT_IDS : RIGHT_IDS;
  const size = Math.random() < 0.5 ? 2 : 3;
  const ids =
    randomLegalFromPool(pool, size, avoidKey) ??
    randomLegalFromPool(pool, 2, avoidKey) ??
    [pool[0], pool[1]].filter(Boolean);
  return { ids, kind: "oneHand", hand };
}

function makeBothHands(avoidKey?: string): Problem {
  const sizeRoll = Math.random();
  const total = sizeRoll < 0.15 ? 2 : sizeRoll < 0.4 ? 3 : 4;

  for (let attempt = 0; attempt < 80; attempt += 1) {
    // 左右それぞれ最低1つ
    const leftCount = randInt(total - 1) + 1; // 1..total-1
    const rightCount = total - leftCount;
    if (leftCount < 1 || rightCount < 1) continue;
    if (leftCount > LEFT_IDS.length || rightCount > RIGHT_IDS.length) continue;

    const leftOptions = legalCombos(LEFT_IDS, leftCount);
    const rightOptions = legalCombos(RIGHT_IDS, rightCount);
    if (leftOptions.length === 0 || rightOptions.length === 0) continue;

    const left = leftOptions[randInt(leftOptions.length)];
    const right = rightOptions[randInt(rightOptions.length)];
    const ids = [...left, ...right];
    if (!isLegalChord(ids)) continue;
    if (chordKey(ids) === avoidKey) continue;
    return { ids, kind: "bothHands" };
  }

  // フォールバック: 左右1つずつ
  const fallback = pickN(LEFT_IDS, 1).concat(pickN(RIGHT_IDS, 1));
  return { ids: fallback, kind: "bothHands" };
}

/** questionNumber は 1 始まり（何問目か） */
export function generateProblem(
  questionNumber: number,
  previous?: Problem | null,
): Problem {
  const avoid = previous ? chordKey(previous.ids) : undefined;

  if (questionNumber <= 5) {
    return makeSingle(avoid);
  }
  if (questionNumber <= 10) {
    return makeOneHand(avoid);
  }

  const roll = Math.random();
  if (roll < 0.04) return makeSingle(avoid);
  if (roll < 0.19) return makeOneHand(avoid);
  return makeBothHands(avoid);
}

export function timeBonusForCombo(combo: number): number {
  if (combo <= 0) return 0;
  const c = combo % 30;
  if (c === 5) return 1;
  if (c === 10) return 1;
  if (c === 20) return 2;
  if (c === 0) return 3; // 30, 60, ...
  return 0;
}
