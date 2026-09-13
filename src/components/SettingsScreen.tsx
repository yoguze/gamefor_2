import type { PlayMode } from "@/lib/settings";

type SettingsScreenProps = {
  playMode: PlayMode;
  onChangePlayMode: (mode: PlayMode) => void;
  onBack: () => void;
};

export function SettingsScreen({
  playMode,
  onChangePlayMode,
  onBack,
}: SettingsScreenProps) {
  return (
    <section className="screen settings-screen">
      <header className="screen-header">
        <h2>設定</h2>
        <p>プレイ方式を選べます。オンライン対戦は今後対応予定です。</p>
      </header>

      <div className="settings-panel">
        <h3 className="settings-label">プレイ方式</h3>
        <div className="mode-options" role="radiogroup" aria-label="プレイ方式">
          <button
            type="button"
            role="radio"
            aria-checked={playMode === "local"}
            className={`mode-card ${playMode === "local" ? "selected" : ""}`}
            onClick={() => onChangePlayMode("local")}
          >
            <span className="mode-title">同じPC</span>
            <span className="mode-desc">1台のキーボード／画面で2人プレイ</span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={playMode === "online"}
            className={`mode-card disabled ${playMode === "online" ? "selected" : ""}`}
            onClick={() => onChangePlayMode("online")}
          >
            <span className="mode-badge">準備中</span>
            <span className="mode-title">オンライン</span>
            <span className="mode-desc">WebSocket で別端末から対戦（未実装）</span>
          </button>
        </div>

        {playMode === "online" && (
          <p className="settings-note" role="status">
            オンラインはまだ遊べません。スタートすると同じPCモードで進みます。
          </p>
        )}
      </div>

      <button type="button" className="menu-btn" onClick={onBack}>
        戻る
      </button>
    </section>
  );
}
