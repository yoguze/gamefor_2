"use client";

import { useEffect } from "react";
import { GAMES } from "@/lib/games";

type GameSelectScreenProps = {
  selectedIndex: number;
  onChangeIndex: (index: number) => void;
  onConfirm: () => void;
  onBack: () => void;
};

export function GameSelectScreen({
  selectedIndex,
  onChangeIndex,
  onConfirm,
  onBack,
}: GameSelectScreenProps) {
  const game = GAMES[selectedIndex];
  const count = GAMES.length;

  const goPrev = () => {
    onChangeIndex((selectedIndex - 1 + count) % count);
  };

  const goNext = () => {
    onChangeIndex((selectedIndex + 1) % count);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onChangeIndex((selectedIndex - 1 + count) % count);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onChangeIndex((selectedIndex + 1) % count);
      }
      if (event.key === "Enter") {
        event.preventDefault();
        onConfirm();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        onBack();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex, count, onChangeIndex, onConfirm, onBack]);

  return (
    <section className="screen select-screen">
      <header className="screen-header">
        <h2>ゲームを選ぶ</h2>
        <p>← → で切り替えて、決定で始めます</p>
      </header>

      <div className="select-row">
        <button
          type="button"
          className="arrow-btn"
          onClick={goPrev}
          aria-label="前のゲーム"
        >
          ←
        </button>

        <article
          className="game-card"
          style={{ ["--game-accent" as string]: game.accent }}
        >
          <h3>{game.title}</h3>
          <p>{game.description}</p>
        </article>

        <button
          type="button"
          className="arrow-btn"
          onClick={goNext}
          aria-label="次のゲーム"
        >
          →
        </button>
      </div>

      <div className="select-actions">
        <button type="button" className="menu-btn primary" onClick={onConfirm}>
          このゲームで遊ぶ
        </button>
        <button type="button" className="menu-btn ghost" onClick={onBack}>
          戻る
        </button>
      </div>
    </section>
  );
}
