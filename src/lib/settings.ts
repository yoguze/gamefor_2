export type PlayMode = "local" | "online";

export type AppSettings = {
  playMode: PlayMode;
};

export const DEFAULT_SETTINGS: AppSettings = {
  playMode: "local",
};

const STORAGE_KEY = "game_for_2_settings";

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      playMode: parsed.playMode === "online" ? "online" : "local",
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
