type ExitScreenProps = {
  onBackToTop: () => void;
};

export function ExitScreen({ onBackToTop }: ExitScreenProps) {
  return (
    <section className="screen exit-screen">
      <div className="brand-block">
        <h2 className="brand-title compact">お疲れさま！</h2>
        <p className="brand-sub">また2人で遊びに来てね。</p>
      </div>
      <button type="button" className="menu-btn" onClick={onBackToTop}>
        TOPに戻る
      </button>
    </section>
  );
}
