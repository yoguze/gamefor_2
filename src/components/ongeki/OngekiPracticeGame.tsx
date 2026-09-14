"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { OngekiCabinet, OngekiWallButton } from "@/components/ongeki/OngekiCabinet";
import {
  BUTTON_BY_CODE,
  BUTTON_BY_ID,
  CHORD_WINDOW_MS,
  GAME_KEY_CODES,
  INITIAL_DURATION_MS,
  MISS_PENALTY_MS,
  MISS_PENALTY_THRESHOLD,
  type ButtonId,
} from "@/lib/ongeki/buttons";
import {
  generateProblem,
  timeBonusForCombo,
  type Problem,
} from "@/lib/ongeki/generate";
import { buildPlayStats, type ProblemLog } from "@/lib/ongeki/stats";

type Phase = "ready" | "countdown" | "playing" | "result" | "details";

type OngekiPracticeGameProps = {
  onBackToSelect: () => void;
  onBackToTop: () => void;
};

export function OngekiPracticeGame({
  onBackToSelect,
  onBackToTop,
}: OngekiPracticeGameProps) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [countdown, setCountdown] = useState(3);
  const [remainingMs, setRemainingMs] = useState(INITIAL_DURATION_MS);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [flashMiss, setFlashMiss] = useState(false);
  const [pressedIds, setPressedIds] = useState<Set<ButtonId>>(() => new Set());
  const [resultMenuIndex, setResultMenuIndex] = useState(0);

  const phaseRef = useRef(phase);
  const remainingRef = useRef(INITIAL_DURATION_MS);
  const endAtRef = useRef(0);
  const problemRef = useRef<Problem | null>(null);
  const questionNumberRef = useRef(1);
  const comboRef = useRef(0);
  const maxComboRef = useRef(0);
  const scoreRef = useRef(0);
  const missInProblemRef = useRef(0);
  const missButtonsRef = useRef<ButtonId[]>([]);
  const problemShownAtRef = useRef(0);
  const logsRef = useRef<ProblemLog[]>([]);
  const physicallyDownRef = useRef<Set<ButtonId>>(new Set());
  const dirtyButtonsRef = useRef<Set<ButtonId>>(new Set());
  const chordStartRef = useRef<number | null>(null);
  const chordTimerRef = useRef<number | null>(null);
  const requiredRef = useRef<Set<ButtonId>>(new Set());

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const clearChordTimer = () => {
    if (chordTimerRef.current != null) {
      window.clearTimeout(chordTimerRef.current);
      chordTimerRef.current = null;
    }
    chordStartRef.current = null;
  };

  const syncRequired = (p: Problem) => {
    requiredRef.current = new Set(p.ids);
  };

  const beginProblem = useCallback((next: Problem, qNum: number) => {
    clearChordTimer();
    problemRef.current = next;
    questionNumberRef.current = qNum;
    missInProblemRef.current = 0;
    missButtonsRef.current = [];
    problemShownAtRef.current = performance.now();
    dirtyButtonsRef.current = new Set(physicallyDownRef.current);
    syncRequired(next);
    setProblem(next);
    setQuestionNumber(qNum);
  }, []);

  const applyMiss = useCallback((button?: ButtonId) => {
    missInProblemRef.current += 1;
    if (button) missButtonsRef.current.push(button);
    comboRef.current = 0;
    setCombo(0);
    clearChordTimer();

    if (missInProblemRef.current >= MISS_PENALTY_THRESHOLD) {
      remainingRef.current = Math.max(0, remainingRef.current - MISS_PENALTY_MS);
      endAtRef.current = performance.now() + remainingRef.current;
      setRemainingMs(remainingRef.current);
    }

    setFlashMiss(true);
    window.setTimeout(() => setFlashMiss(false), 120);
  }, []);

  const completeProblem = useCallback(() => {
    const current = problemRef.current;
    if (!current) return;

    const answerTimeMs = performance.now() - problemShownAtRef.current;
    const hadMiss = missInProblemRef.current > 0;

    logsRef.current.push({
      index: questionNumberRef.current,
      problem: current,
      missCount: missInProblemRef.current,
      cleared: true,
      answerTimeMs,
      missButtons: [...missButtonsRef.current],
    });

    scoreRef.current += 1;
    setScore(scoreRef.current);

    if (!hadMiss) {
      comboRef.current += 1;
      setCombo(comboRef.current);
      if (comboRef.current > maxComboRef.current) {
        maxComboRef.current = comboRef.current;
        setMaxCombo(maxComboRef.current);
      }
      const bonusSec = timeBonusForCombo(comboRef.current);
      if (bonusSec > 0) {
        remainingRef.current += bonusSec * 1000;
        endAtRef.current = performance.now() + remainingRef.current;
        setRemainingMs(remainingRef.current);
      }
    } else {
      comboRef.current = 0;
      setCombo(0);
    }

    const nextNum = questionNumberRef.current + 1;
    const next = generateProblem(nextNum, current);
    beginProblem(next, nextNum);
  }, [beginProblem]);

  const endGame = useCallback(() => {
    clearChordTimer();
    // 未クリアの現問題もログに残す
    if (problemRef.current) {
      logsRef.current.push({
        index: questionNumberRef.current,
        problem: problemRef.current,
        missCount: missInProblemRef.current,
        cleared: false,
        answerTimeMs: null,
        missButtons: [...missButtonsRef.current],
      });
      problemRef.current = null;
    }
    setPhase("result");
  }, []);

  const evaluateChord = useCallback(() => {
    const required = requiredRef.current;
    if (required.size === 0) return;

    const heldEligible = new Set<ButtonId>();
    for (const id of physicallyDownRef.current) {
      if (dirtyButtonsRef.current.has(id)) continue;
      heldEligible.add(id);
    }

    for (const id of heldEligible) {
      if (!required.has(id)) {
        applyMiss(id);
        return;
      }
    }

    let allDown = true;
    for (const id of required) {
      if (!heldEligible.has(id)) {
        allDown = false;
        break;
      }
    }

    if (allDown && heldEligible.size === required.size) {
      completeProblem();
    }
  }, [applyMiss, completeProblem]);

  const handleButtonUp = useCallback((id: ButtonId) => {
    physicallyDownRef.current.delete(id);
    dirtyButtonsRef.current.delete(id);
    setPressedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleButtonDown = useCallback(
    (id: ButtonId) => {
      if (phaseRef.current !== "playing") return;
      if (physicallyDownRef.current.has(id)) return;

      physicallyDownRef.current.add(id);
      setPressedIds((prev) => new Set(prev).add(id));

      if (dirtyButtonsRef.current.has(id)) {
        return;
      }

      const required = requiredRef.current;

      if (!required.has(id)) {
        applyMiss(id);
        return;
      }

      if (required.size === 1) {
        completeProblem();
        return;
      }

      const now = performance.now();
      if (chordStartRef.current == null) {
        chordStartRef.current = now;
        chordTimerRef.current = window.setTimeout(() => {
          applyMiss();
        }, CHORD_WINDOW_MS);
      } else if (now - chordStartRef.current > CHORD_WINDOW_MS) {
        applyMiss(id);
        return;
      }

      evaluateChord();
    },
    [applyMiss, completeProblem, evaluateChord],
  );

  const onGameKeyDown = useCallback(
    (code: string) => {
      if (!GAME_KEY_CODES.has(code)) return;
      const btn = BUTTON_BY_CODE[code];
      if (!btn) return;
      handleButtonDown(btn.id);
    },
    [handleButtonDown],
  );

  const onGameKeyUp = useCallback(
    (code: string) => {
      if (!GAME_KEY_CODES.has(code)) return;
      const btn = BUTTON_BY_CODE[code];
      if (!btn) return;
      handleButtonUp(btn.id);
    },
    [handleButtonUp],
  );

  // Global keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (phaseRef.current === "playing") {
        if (e.code === "Tab" || e.code === "Enter") {
          e.preventDefault();
        }
      }
      if (e.repeat) return;
      onGameKeyDown(e.code);
    };
    const up = (e: KeyboardEvent) => {
      if (phaseRef.current === "playing") {
        if (e.code === "Tab" || e.code === "Enter") {
          e.preventDefault();
        }
      }
      onGameKeyUp(e.code);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [onGameKeyDown, onGameKeyUp]);

  // Countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    setCountdown(3);
    let n = 3;
    const timer = window.setInterval(() => {
      n -= 1;
      if (n <= 0) {
        window.clearInterval(timer);
        setCountdown(0); // START!
        window.setTimeout(() => {
          logsRef.current = [];
          scoreRef.current = 0;
          comboRef.current = 0;
          maxComboRef.current = 0;
          setScore(0);
          setCombo(0);
          setMaxCombo(0);
          remainingRef.current = INITIAL_DURATION_MS;
          endAtRef.current = performance.now() + INITIAL_DURATION_MS;
          setRemainingMs(INITIAL_DURATION_MS);
          const first = generateProblem(1, null);
          beginProblem(first, 1);
          setPhase("playing");
        }, 400);
        return;
      }
      setCountdown(n);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase, beginProblem]);

  // Play timer
  useEffect(() => {
    if (phase !== "playing") return;
    let frame = 0;
    const tick = (now: number) => {
      const left = Math.max(0, endAtRef.current - now);
      remainingRef.current = left;
      setRemainingMs(left);
      if (left <= 0) {
        endGame();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, endGame]);

  const stats = useMemo(
    () => buildPlayStats(logsRef.current, score, maxCombo),
    // recompute when entering result/details
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase, score, maxCombo],
  );

  const leftPrompt = problem?.ids.filter((id) => id.startsWith("L_")) ?? [];
  const rightPrompt = problem?.ids.filter((id) => id.startsWith("R_")) ?? [];

  const startGame = () => {
    setPhase("countdown");
  };

  const resultActions = useMemo(
    () => [
      { label: "もう一度", onClick: startGame, kind: "default" as const },
      {
        label: "詳細なデータ",
        onClick: () => setPhase("details"),
        kind: "default" as const,
      },
      {
        label: "ゲーム選択に戻る",
        onClick: onBackToSelect,
        kind: "ghost" as const,
      },
      { label: "TOPに戻る", onClick: onBackToTop, kind: "ghost" as const },
    ],
    [onBackToSelect, onBackToTop],
  );

  useEffect(() => {
    if (phase === "result") {
      setResultMenuIndex(0);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "result") return;

    const count = resultActions.length;
    const move = (delta: number) => {
      setResultMenuIndex((i) => (i + delta + count) % count);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        move(-1);
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        move(1);
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        resultActions[resultMenuIndex]?.onClick();
      }
    };

    let lastWheelAt = 0;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const now = performance.now();
      if (now - lastWheelAt < 120) return;
      lastWheelAt = now;
      if (event.deltaY > 0) move(1);
      else if (event.deltaY < 0) move(-1);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
    };
  }, [phase, resultActions, resultMenuIndex]);

  if (phase === "ready") {
    return (
      <section className="screen ongeki-screen">
        <header className="screen-header">
          <p className="match-kicker">ONGEKI PRACTICE</p>
          <h2>運指練習</h2>
          <p>筐体レイアウトで SIDE / RGB を練習します（レバーなし）</p>
        </header>

        <OngekiCabinet mode="preview" />

        <div className="select-actions">
          <button type="button" className="menu-btn primary" onClick={startGame}>
            START
          </button>
          <button type="button" className="menu-btn ghost" onClick={onBackToSelect}>
            ゲーム選択に戻る
          </button>
        </div>
      </section>
    );
  }

  if (phase === "countdown") {
    return (
      <section className="screen ongeki-screen">
        <p className="ongeki-countdown" aria-live="assertive">
          {countdown === 0 ? "START!" : countdown}
        </p>
      </section>
    );
  }

  if (phase === "result") {
    return (
      <section className="screen ongeki-screen">
        <header className="screen-header">
          <p className="match-kicker">RESULT</p>
          <h2>SCORE {score}</h2>
          <p>最大COMBO {maxCombo}</p>
        </header>
        <div className="select-actions" role="menu" aria-label="リザルトメニュー">
          {resultActions.map((action, index) => (
            <button
              key={action.label}
              type="button"
              role="menuitem"
              className={`menu-btn${action.kind === "ghost" ? " ghost" : ""}${index === resultMenuIndex ? " selected" : ""}`}
              onClick={action.onClick}
              onMouseEnter={() => setResultMenuIndex(index)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (phase === "details") {
    return (
      <section className="screen ongeki-screen ongeki-details">
        <header className="screen-header">
          <h2>詳細なデータ</h2>
        </header>
        <div className="ongeki-stats">
          <Stat label="SCORE" value={String(stats.score)} />
          <Stat label="最大COMBO" value={String(stats.maxCombo)} />
          <Stat label="総MISS数" value={String(stats.totalMisses)} />
          <Stat
            label="平均回答時間"
            value={
              stats.averageAnswerMs == null
                ? "-"
                : `${(stats.averageAnswerMs / 1000).toFixed(3)}秒`
            }
          />
          <Stat
            label="最速回答時間"
            value={
              stats.fastestAnswerMs == null
                ? "-"
                : `${(stats.fastestAnswerMs / 1000).toFixed(3)}秒`
            }
          />
          <Stat
            label="同時押し挑戦数"
            value={String(stats.multiAttempts)}
          />
          <Stat
            label="同時押し成功率"
            value={
              stats.multiSuccessRate == null
                ? "-"
                : `${Math.round(stats.multiSuccessRate * 100)}%`
            }
          />
          <Stat
            label="単押し"
            value={`${stats.byKind.single.clears}/${stats.byKind.single.attempts}（MISS ${stats.byKind.single.misses}）`}
          />
          <Stat
            label="片手複数"
            value={`${stats.byKind.oneHand.clears}/${stats.byKind.oneHand.attempts}（MISS ${stats.byKind.oneHand.misses}）`}
          />
          <Stat
            label="両手"
            value={`${stats.byKind.bothHands.clears}/${stats.byKind.bothHands.attempts}（MISS ${stats.byKind.bothHands.misses}）`}
          />
          <Stat
            label="2ボタン"
            value={`${stats.bySize[2].clears}/${stats.bySize[2].attempts}`}
          />
          <Stat
            label="3ボタン"
            value={`${stats.bySize[3].clears}/${stats.bySize[3].attempts}`}
          />
          <Stat
            label="4ボタン"
            value={`${stats.bySize[4].clears}/${stats.bySize[4].attempts}`}
          />
          <Stat label="左手MISS" value={String(stats.missLeft)} />
          <Stat label="右手MISS" value={String(stats.missRight)} />
          <Stat label="RED関連MISS" value={String(stats.missRed)} />
          <Stat label="GREEN関連MISS" value={String(stats.missGreen)} />
          <Stat label="BLUE関連MISS" value={String(stats.missBlue)} />
          <Stat label="左SIDE関連MISS" value={String(stats.missLeftSide)} />
          <Stat label="右SIDE関連MISS" value={String(stats.missRightSide)} />
        </div>

        {stats.missedProblems.length > 0 && (
          <div className="ongeki-miss-list">
            <h3>MISSした問題</h3>
            <ul>
              {stats.missedProblems.map((log) => (
                <li key={`${log.index}-${log.problem.ids.join("-")}`}>
                  #{log.index}{" "}
                  {log.problem.ids.map((id) => BUTTON_BY_ID[id].label).join(" + ")}{" "}
                  （MISS {log.missCount}回）
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="select-actions">
          <button type="button" className="menu-btn" onClick={() => setPhase("result")}>
            リザルトに戻る
          </button>
          <button type="button" className="menu-btn ghost" onClick={onBackToSelect}>
            ゲーム選択に戻る
          </button>
        </div>
      </section>
    );
  }

  // playing
  return (
    <section
      className={`screen ongeki-screen ongeki-play-layout${flashMiss ? " miss-flash" : ""}`}
    >
      <OngekiWallButton
        side="left"
        interactive
        pressed={pressedIds.has("L_SIDE")}
        onButtonDown={handleButtonDown}
        onButtonUp={handleButtonUp}
      />
      <OngekiWallButton
        side="right"
        interactive
        pressed={pressedIds.has("R_SIDE")}
        onButtonDown={handleButtonDown}
        onButtonUp={handleButtonUp}
      />

      <div className="ongeki-hud">
        <span>残り {(remainingMs / 1000).toFixed(1)}s</span>
        <span>SCORE {score}</span>
        <span>COMBO {combo}</span>
        <span className="ongeki-qnum-inline">Q{questionNumber}</span>
      </div>

      <div className="ongeki-play-bottom">
        <OngekiCabinet
          mode="play"
          pressedIds={pressedIds}
          promptLeft={leftPrompt}
          promptRight={rightPrompt}
          onButtonDown={handleButtonDown}
          onButtonUp={handleButtonUp}
        />

        <button type="button" className="menu-btn ghost ongeki-exit" onClick={onBackToSelect}>
          やめて戻る
        </button>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="ongeki-stat-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
