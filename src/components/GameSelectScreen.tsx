"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [menuIndex, setMenuIndex] = useState(0);

  const actions = useMemo(
    () => [
      { label: "このゲームで遊ぶ", onClick: onConfirm, kind: "default" as const },
      { label: "戻る", onClick: onBack, kind: "ghost" as const },
    ],
    [onConfirm, onBack],
  );

  const goPrev = () => {
    onChangeIndex((selectedIndex - 1 + count) % count);
  };

  const goNext = () => {
    onChangeIndex((selectedIndex + 1) % count);
  };

  useEffect(() => {
    const menuCount = actions.length;
    const moveMenu = (delta: number) => {
      setMenuIndex((i) => (i + delta + menuCount) % menuCount);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onChangeIndex((selectedIndex - 1 + count) % count);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onChangeIndex((selectedIndex + 1) % count);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveMenu(-1);
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveMenu(1);
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        actions[menuIndex]?.onClick();
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        onBack();
      }
    };

    let lastWheelAt = 0;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const now = performance.now();
      if (now - lastWheelAt < 120) return;
      lastWheelAt = now;
      if (event.deltaY > 0) moveMenu(1);
      else if (event.deltaY < 0) moveMenu(-1);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
    };
  }, [selectedIndex, count, onChangeIndex, onBack, actions, menuIndex]);

  return (
    <section className="screen select-screen">
      <header className="screen-header">
        <h2>ゲームを選ぶ</h2>
        <p>← → でゲーム切替、↑ ↓ でメニュー、Enter で決定</p>
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

      <div className="select-actions" role="menu" aria-label="ゲーム選択メニュー">
        {actions.map((action, index) => (
          <button
            key={action.label}
            type="button"
            role="menuitem"
            className={`menu-btn${action.kind === "ghost" ? " ghost" : ""}${index === menuIndex ? " selected" : ""}`}
            onClick={action.onClick}
            onMouseEnter={() => setMenuIndex(index)}
          >
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}
