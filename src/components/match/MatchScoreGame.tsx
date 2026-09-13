"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  MATCH_ROUND_SIZE,
  pickMatchRound,
  type MatchOptionIndex,
  type MatchQuestion,
} from "@/lib/match-questions";

type Phase = "p1" | "handoff" | "p2" | "result";

type MatchScoreGameProps = {
  onBackToSelect: () => void;
  onBackToTop: () => void;
};

function createRound() {
  return pickMatchRound(MATCH_ROUND_SIZE);
}

export function MatchScoreGame({
  onBackToSelect,
  onBackToTop,
}: MatchScoreGameProps) {
  const [questions, setQuestions] = useState<MatchQuestion[]>(createRound);
  const [phase, setPhase] = useState<Phase>("p1");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [p1Answers, setP1Answers] = useState<MatchOptionIndex[]>([]);
  const [p2Answers, setP2Answers] = useState<MatchOptionIndex[]>([]);
  const [showAllMatches, setShowAllMatches] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  const total = questions.length;
  const current = questions[questionIndex];
  const playerLabel = phase === "p1" ? "プレイヤー1" : "プレイヤー2";
  const isInProgress = phase === "p1" || phase === "p2" || phase === "handoff";

  const matchedEntries = useMemo(() => {
    return questions
      .map((question, index) => ({ question, index }))
      .filter(({ index }) => p1Answers[index] === p2Answers[index]);
  }, [questions, p1Answers, p2Answers]);

  const matchCount = matchedEntries.length;
  const matchPercent =
    total === 0 ? 0 : Math.round((matchCount / total) * 100);
  const visibleMatches = showAllMatches
    ? matchedEntries
    : matchedEntries.slice(0, 5);

  const restart = () => {
    setQuestions(createRound());
    setPhase("p1");
    setQuestionIndex(0);
    setP1Answers([]);
    setP2Answers([]);
    setShowAllMatches(false);
    setConfirmLeave(false);
  };

  const requestLeaveToSelect = () => {
    if (isInProgress) {
      setConfirmLeave(true);
      return;
    }
    onBackToSelect();
  };

  const currentAnswers = phase === "p1" ? p1Answers : p2Answers;
  const selectedChoice = currentAnswers[questionIndex];
  const canGoPrevious = questionIndex > 0;

  const handleAnswer = (choice: MatchOptionIndex) => {
    if (phase !== "p1" && phase !== "p2") return;
    if (confirmLeave) return;

    const base = phase === "p1" ? p1Answers : p2Answers;
    const nextAnswers = [...base.slice(0, questionIndex), choice];

    if (phase === "p1") {
      setP1Answers(nextAnswers);
    } else {
      setP2Answers(nextAnswers);
    }

    if (questionIndex + 1 >= total) {
      setPhase(phase === "p1" ? "handoff" : "result");
      setQuestionIndex(0);
      return;
    }

    setQuestionIndex(questionIndex + 1);
  };

  const handlePreviousQuestion = () => {
    if (!canGoPrevious || confirmLeave) return;
    setQuestionIndex(questionIndex - 1);
  };

  const leaveConfirmOverlay = confirmLeave ? (
    <div className="match-confirm-overlay" role="dialog" aria-modal="true">
      <div className="match-confirm-panel">
        <h2>本当にやめますか？</h2>
        <p>これまでの回答は全てリセットされます</p>
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
      <section className="screen match-screen">
        <header className="screen-header">
          <p className="match-kicker">PASS THE DEVICE</p>
          <h2>プレイヤー2の番です</h2>
          <p>
            端末を渡して、プレイヤー1の答えが見えないようにしてから始めてね。
          </p>
        </header>
        <button
          type="button"
          className="menu-btn primary"
          onClick={() => {
            setPhase("p2");
            setQuestionIndex(0);
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
    return wrap(
      <section className="screen match-screen match-result">
        <header className="screen-header">
          <p className="match-kicker">RESULT</p>
          <h2>一致度 {matchPercent}%</h2>
          <p>
            {matchCount} / {total} 問が一致しました
          </p>
        </header>

        <div className="match-list-panel">
          <h3 className="match-list-title">一致した質問</h3>
          {matchCount === 0 ? (
            <p className="match-empty">一致した質問はありません</p>
          ) : (
            <ul className="match-list">
              {visibleMatches.map(({ question, index }) => (
                <li key={question.id} className="match-list-item">
                  <p className="match-list-prompt">{question.prompt}</p>
                  <p className="match-list-answer">
                    答え: {question.options[p1Answers[index]]}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {matchCount > 5 && (
            <button
              type="button"
              className="menu-btn ghost match-toggle"
              onClick={() => setShowAllMatches((value) => !value)}
            >
              {showAllMatches ? "少なく表示" : "全て表示"}
            </button>
          )}
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

  return wrap(
    <section className="screen match-screen">
      <header className="screen-header">
        <p className="match-kicker">{playerLabel}</p>
        <p className="match-progress">
          {questionIndex + 1} / {total}
        </p>
        <h2>{current.prompt}</h2>
      </header>

      <div className="match-choices">
        <button
          type="button"
          className={`match-choice${selectedChoice === 0 ? " selected" : ""}`}
          onClick={() => handleAnswer(0)}
          disabled={confirmLeave}
        >
          {current.options[0]}
        </button>
        <button
          type="button"
          className={`match-choice${selectedChoice === 1 ? " selected" : ""}`}
          onClick={() => handleAnswer(1)}
          disabled={confirmLeave}
        >
          {current.options[1]}
        </button>
      </div>

      <div className="match-nav">
        <button
          type="button"
          className="menu-btn"
          onClick={handlePreviousQuestion}
          disabled={!canGoPrevious || confirmLeave}
        >
          前の質問に戻る
        </button>
        <button
          type="button"
          className="menu-btn ghost"
          onClick={requestLeaveToSelect}
          disabled={confirmLeave}
        >
          ゲーム選択に戻る
        </button>
      </div>
    </section>,
  );
}
