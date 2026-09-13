type TopScreenProps = {
  onStart: () => void;
  onSettings: () => void;
  onExit: () => void;
};

export function TopScreen({ onStart, onSettings, onExit }: TopScreenProps) {
  return (
    <section className="screen top-screen">
      <div className="brand-block">
        <p className="brand-kicker">2 PLAYER PARTY</p>
        <h1 className="brand-title">Game for 2</h1>
        <p className="brand-sub">同じ画面で、2人でわいわい遊べるミニゲーム集</p>
      </div>

      <nav className="menu-stack" aria-label="メインメニュー">
        <button type="button" className="menu-btn primary" onClick={onStart}>
          スタート
        </button>
        <button type="button" className="menu-btn" onClick={onSettings}>
          設定
        </button>
        <button type="button" className="menu-btn ghost" onClick={onExit}>
          終了
        </button>
      </nav>
    </section>
  );
}
