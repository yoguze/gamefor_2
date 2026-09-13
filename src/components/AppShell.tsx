"use client";

import { useEffect, useState } from "react";
import { ExitScreen } from "@/components/ExitScreen";
import { GameSelectScreen } from "@/components/GameSelectScreen";
import { MatchScoreGame } from "@/components/match/MatchScoreGame";
import { SettingsScreen } from "@/components/SettingsScreen";
import { TopScreen } from "@/components/TopScreen";
import { GAMES } from "@/lib/games";
import type { PlayMode } from "@/lib/settings";
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from "@/lib/settings";

type Screen = "top" | "settings" | "select" | "exit" | "coming-soon" | "match";

export function AppShell() {
  const [screen, setScreen] = useState<Screen>("top");
  const [playMode, setPlayMode] = useState<PlayMode>(DEFAULT_SETTINGS.playMode);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const settings = loadSettings();
    setPlayMode(settings.playMode);
  }, []);

  const handleChangePlayMode = (mode: PlayMode) => {
    setPlayMode(mode);
    saveSettings({ playMode: mode });
  };

  const handleConfirmGame = () => {
    const game = GAMES[selectedIndex];
    if (game.id === "match-score") {
      setScreen("match");
      return;
    }
    setScreen("coming-soon");
  };

  const selectedGame = GAMES[selectedIndex];

  return (
    <main className="app-shell">
      <div className="app-frame">
        {screen === "top" && (
          <TopScreen
            onStart={() => setScreen("select")}
            onSettings={() => setScreen("settings")}
            onExit={() => setScreen("exit")}
          />
        )}

        {screen === "settings" && (
          <SettingsScreen
            playMode={playMode}
            onChangePlayMode={handleChangePlayMode}
            onBack={() => setScreen("top")}
          />
        )}

        {screen === "select" && (
          <GameSelectScreen
            selectedIndex={selectedIndex}
            onChangeIndex={setSelectedIndex}
            onConfirm={handleConfirmGame}
            onBack={() => setScreen("top")}
          />
        )}

        {screen === "match" && (
          <MatchScoreGame
            onBackToSelect={() => setScreen("select")}
            onBackToTop={() => setScreen("top")}
          />
        )}

        {screen === "coming-soon" && (
          <section className="screen">
            <header className="screen-header">
              <h2>{selectedGame.title}</h2>
              <p>
                このゲームはこれから実装します。
                {playMode === "online"
                  ? " 設定はオンラインですが、現状は同じPC向けの土台です。"
                  : " 同じPCモードで遊べるように準備中です。"}
              </p>
            </header>
            <div className="select-actions">
              <button
                type="button"
                className="menu-btn"
                onClick={() => setScreen("select")}
              >
                ゲーム選択に戻る
              </button>
              <button
                type="button"
                className="menu-btn ghost"
                onClick={() => setScreen("top")}
              >
                TOPに戻る
              </button>
            </div>
          </section>
        )}

        {screen === "exit" && (
          <ExitScreen onBackToTop={() => setScreen("top")} />
        )}
      </div>
    </main>
  );
}
