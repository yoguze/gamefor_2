"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { MASH_COUNTDOWN_SECONDS, MASH_DURATION_MS } from "@/lib/button-mash";

type Player = 1 | 2;
type Phase = "countdown" | "playing" | "handoff" | "result";

type ButtonMashGameProps = {
  onBackToSelect: () => void;
  onBackToTop: () => void;
};

export function ButtonMashGame({
  onBackToSelect,
  onBackToTop,
}: ButtonMashGameProps) {
  const [phase, setPhase] = useState<Phase>("countdown");
  const [activePlayer, setActivePlayer] = useState<Player>(1);
  const [countdown, setCountdown] = useState(MASH_COUNTDOWN_SECONDS);
  const [remainingMs, setRemainingMs] = useState(MASH_DURATION_MS);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [liveCount, setLiveCount] = useState(0);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [mashPulse, setMashPulse] = useState(false);

  const phaseRef = useRef(phase);
  const activePlayerRef = useRef(activePlayer);
  const confirmLeaveRef = useRef(confirmLeave);
  const liveCountRef = useRef(0);
  const endAtRef = useRef(0);
  const remainingOnPauseRef = useRef(MASH_DURATION_MS);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    activePlayerRef.current = activePlayer;
  }, [activePlayer]);

  useEffect(() => {
    confirmLeaveRef.current = confirmLeave;
  }, [confirmLeave]);

  const isInProgress = phase !== "result";
  const playerLabel =
    activePlayer === 1 ? "プレイヤー1" : "プレイヤー2";
  const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

  const restart = () => {
    setPhase("countdown");
    setActivePlayer(1);
    setCountdown(MASH_COUNTDOWN_SECONDS);
    setRemainingMs(MASH_DURATION_MS);
    setP1Score(0);
    setP2Score(0);
    setLiveCount(0);
    liveCountRef.current = 0;
    setConfirmLeave(false);
  };

  const requestLeaveToSelect = () => {
    if (isInProgress) {
      setConfirmLeave(true);
      return;
    }
    onBackToSelect();
  };

  const finishTurn = useCallback((finalCount: number, player: Player) => {
    if (player === 1) {
      setP1Score(finalCount);
      setLiveCount(0);
      liveCountRef.current = 0;
      setPhase("handoff");
      return;
    }
    setP2Score(finalCount);
    setPhase("result");
  }, []);

  // Countdown 3-2-1（確認中は一時停止し、表示中の秒から再開）
  useEffect(() => {
    if (phase !== "countdown" || confirmLeave) return;

    const timer = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.setTimeout(() => {
            setLiveCount(0);
            liveCountRef.current = 0;
            setRemainingMs(MASH_DURATION_MS);
            remainingOnPauseRef.current = MASH_DURATION_MS;
            endAtRef.current = performance.now() + MASH_DURATION_MS;
            setPhase("playing");
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase, activePlayer, confirmLeave]);

  // 確認ダイアログでプレイ時間を一時停止
  useEffect(() => {
    if (phase !== "playing") return;

    if (confirmLeave) {
      remainingOnPauseRef.current = Math.max(0, endAtRef.current - performance.now());
      return;
    }

    endAtRef.current = performance.now() + remainingOnPauseRef.current;
  }, [confirmLeave, phase]);

  // Playing timer
  useEffect(() => {
    if (phase !== "playing" || confirmLeave) return;

    let frame = 0;
    const tick = (now: number) => {
      const left = Math.max(0, endAtRef.current - now);
      setRemainingMs(left);
      if (left <= 0) {
        finishTurn(liveCountRef.current, activePlayerRef.current);
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [phase, confirmLeave, finishTurn]);

  const registerHit = useCallback(() => {
    if (phaseRef.current !== "playing" || confirmLeaveRef.current) return;
    liveCountRef.current += 1;
    setLiveCount(liveCountRef.current);
    setMashPulse(true);
    window.setTimeout(() => setMashPulse(false), 80);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || event.repeat) return;
      event.preventDefault();
      registerHit();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [registerHit]);

  const leaveConfirmOverlay = confirmLeave ? (
    <div className="match-confirm-overlay" role="dialog" aria-modal="true">
      <div className="match-confirm-panel">
        <h2>本当にやめますか？</h2>
        <p>これまでの記録は全てリセットされます</p>
        <div className="match-confirm-actions">
          <button
            type="button"
            className="menu-btn primary"
            onClick={onBackToSelect}
          >
            はい
          </button>
          <button
            type="button"
            className="menu-btn"
            onClick={() => setConfirmLeave(false)}
          >
            いいえ
          </button>
        </div>
      </div>
    </div>
  ) : null;

  const wrap = (content: ReactNode) => (
    <div className="match-stage">
      {content}
      {leaveConfirmOverlay}
    </div>
  );

  if (phase === "handoff") {
    return wrap(
      <section className="screen mash-screen">
        <header className="screen-header">
          <p className="match-kicker">PASS THE DEVICE</p>
          <h2>プレイヤー2の番です</h2>
          <p>
            端末を渡して、プレイヤー1の記録が見えないようにしてから始めてね。
          </p>
        </header>
        <button
          type="button"
          className="menu-btn primary"
          onClick={() => {
            setActivePlayer(2);
            setCountdown(MASH_COUNTDOWN_SECONDS);
            setLiveCount(0);
            liveCountRef.current = 0;
            setRemainingMs(MASH_DURATION_MS);
            remainingOnPauseRef.current = MASH_DURATION_MS;
            setPhase("countdown");
          }}
          disabled={confirmLeave}
        >
          プレイヤー2の準備OK
        </button>
        <button
          type="button"
          className="menu-btn ghost"
          onClick={requestLeaveToSelect}
          disabled={confirmLeave}
        >
          ゲーム選択に戻る
        </button>
      </section>,
    );
  }

  if (phase === "result") {
    const winner =
      p1Score === p2Score ? "draw" : p1Score > p2Score ? 1 : 2;
    const resultTitle =
      winner === "draw"
        ? "引き分け！"
        : `プレイヤー${winner}の勝ち！`;

    return wrap(
      <section className="screen mash-screen">
        <header className="screen-header">
          <p className="match-kicker">RESULT</p>
          <h2>{resultTitle}</h2>
          <p>30秒でのクリック数を競いました</p>
        </header>

        <div className="mash-scoreboard">
          <div className={`mash-score-card${winner === 1 ? " winner" : ""}`}>
            <p className="mash-score-label">プレイヤー1</p>
            <p className="mash-score-value">{p1Score}</p>
          </div>
          <div className={`mash-score-card${winner === 2 ? " winner" : ""}`}>
            <p className="mash-score-label">プレイヤー2</p>
            <p className="mash-score-value">{p2Score}</p>
          </div>
        </div>

        <div className="select-actions">
          <button type="button" className="menu-btn primary" onClick={restart}>
            もう一度遊ぶ
          </button>
          <button type="button" className="menu-btn" onClick={onBackToSelect}>
            ゲーム選択に戻る
          </button>
          <button type="button" className="menu-btn ghost" onClick={onBackToTop}>
            TOPに戻る
          </button>
        </div>
      </section>,
    );
  }

  if (phase === "countdown") {
    return wrap(
      <section className="screen mash-screen">
        <header className="screen-header">
          <p className="match-kicker">{playerLabel}</p>
          <h2>まもなくスタート</h2>
          <p>画面タップか Enter で連打しよう</p>
        </header>
        <p className="mash-countdown" aria-live="assertive">
          {countdown}
        </p>
        <button
          type="button"
          className="menu-btn ghost"
          onClick={requestLeaveToSelect}
          disabled={confirmLeave}
        >
          ゲーム選択に戻る
        </button>
      </section>,
    );
  }

  return wrap(
    <section className="screen mash-screen">
      <header className="screen-header">
        <p className="match-kicker">{playerLabel}</p>
        <p className="mash-timer">残り {remainingSec} 秒</p>
        <h2 className="mash-live-count">{liveCount}</h2>
      </header>

      <button
        type="button"
        className={`mash-hit-btn${mashPulse ? " pulse" : ""}`}
        onPointerDown={(event) => {
          event.preventDefault();
          registerHit();
        }}
        disabled={confirmLeave}
      >
        連打！
      </button>

      <p className="mash-hint">スマホはタップ / PCは Enter</p>

      <button
        type="button"
        className="menu-btn ghost"
        onClick={requestLeaveToSelect}
        disabled={confirmLeave}
      >
        ゲーム選択に戻る
      </button>
    </section>,
  );
}
