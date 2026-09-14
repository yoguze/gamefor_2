"use client";

import { useEffect, useMemo, useState } from "react";

type TopScreenProps = {
  onStart: () => void;
  onSettings: () => void;
};

export function TopScreen({ onStart, onSettings }: TopScreenProps) {
  const [menuIndex, setMenuIndex] = useState(0);

  const actions = useMemo(
    () => [
      { label: "スタート", onClick: onStart },
      { label: "設定", onClick: onSettings },
    ],
    [onStart, onSettings],
  );

  useEffect(() => {
    const count = actions.length;
    const move = (delta: number) => {
      setMenuIndex((i) => (i + delta + count) % count);
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
        actions[menuIndex]?.onClick();
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
  }, [actions, menuIndex]);

  return (
    <section className="screen top-screen">
      <div className="brand-block">
        <p className="brand-kicker">2 PLAYER PARTY</p>
        <h1 className="brand-title">Game for 2</h1>
        <p className="brand-sub">同じ画面で、2人でわいわい遊べるミニゲーム集</p>
      </div>

      <nav className="menu-stack" aria-label="メインメニュー" role="menu">
        {actions.map((action, index) => (
          <button
            key={action.label}
            type="button"
            role="menuitem"
            className={`menu-btn${index === menuIndex ? " selected" : ""}`}
            onClick={action.onClick}
            onMouseEnter={() => setMenuIndex(index)}
          >
            {action.label}
          </button>
        ))}
      </nav>
    </section>
  );
}
