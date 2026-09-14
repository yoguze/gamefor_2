"use client";

import { useEffect, useState } from "react";
import { GameSelectScreen } from "@/components/GameSelectScreen";
import { ButtonMashGame } from "@/components/mash/ButtonMashGame";
import { MatchScoreGame } from "@/components/match/MatchScoreGame";
import { OngekiPracticeGame } from "@/components/ongeki/OngekiPracticeGame";
import { SettingsScreen } from "@/components/SettingsScreen";
import { TopScreen } from "@/components/TopScreen";
import { GAMES } from "@/lib/games";
import type { PlayMode } from "@/lib/settings";
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from "@/lib/settings";

type Screen = "top" | "settings" | "select" | "match" | "mash" | "ongeki";

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
    if (game.id === "button-mash") {
      setScreen("mash");
      return;
    }
    if (game.id === "ongeki-practice") {
      setScreen("ongeki");
    }
  };

  return (
    <main className="app-shell">
      <div className="app-frame">
        {screen === "top" && (
          <TopScreen
            onStart={() => setScreen("select")}
            onSettings={() => setScreen("settings")}
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

        {screen === "mash" && (
          <ButtonMashGame
            onBackToSelect={() => setScreen("select")}
            onBackToTop={() => setScreen("top")}
          />
        )}

        {screen === "ongeki" && (
          <OngekiPracticeGame
            onBackToSelect={() => setScreen("select")}
            onBackToTop={() => setScreen("top")}
          />
        )}
      </div>
    </main>
  );
}
