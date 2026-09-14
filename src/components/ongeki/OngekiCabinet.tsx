import { BUTTON_BY_ID, BUTTONS, type ButtonId } from "@/lib/ongeki/buttons";

const LEFT_RGB: ButtonId[] = ["L_RED", "L_GREEN", "L_BLUE"];
const RIGHT_RGB: ButtonId[] = ["R_RED", "R_GREEN", "R_BLUE"];

type OngekiCabinetProps = {
  mode: "preview" | "play";
  pressedIds?: Set<ButtonId>;
  onButtonDown?: (id: ButtonId) => void;
  onButtonUp?: (id: ButtonId) => void;
  promptLeft?: ButtonId[];
  promptRight?: ButtonId[];
};

export function OngekiCabinet({
  mode,
  pressedIds = new Set(),
  onButtonDown,
  onButtonUp,
  promptLeft = [],
  promptRight = [],
}: OngekiCabinetProps) {
  const interactive = mode === "play";
  const promptIds = new Set<ButtonId>([...promptLeft, ...promptRight]);

  return (
    <div className={`ongeki-cabinet${interactive ? " interactive" : " preview"}`}>
      <div className="ongeki-cabinet-deck" aria-hidden="true">
        <div className="ongeki-cabinet-panel" />
      </div>

      <div className="ongeki-cabinet-prompt" aria-live="polite">
        {mode === "preview" && (
          <div className="ongeki-prompt-wall-slot left">
            {promptIds.has("L_SIDE") ? <PromptOrb id="L_SIDE" /> : null}
          </div>
        )}
        {mode === "play" && promptIds.has("L_SIDE") && (
          <div className="ongeki-prompt-wall-float left">
            <PromptOrb id="L_SIDE" />
          </div>
        )}

        <div className="ongeki-cabinet-prompt-center">
          <PromptCluster ids={LEFT_RGB} hand="left" active={promptIds} />
          <div className="ongeki-cabinet-prompt-gap" aria-hidden="true" />
          <PromptCluster ids={RIGHT_RGB} hand="right" active={promptIds} />
        </div>

        {mode === "preview" && (
          <div className="ongeki-prompt-wall-slot right">
            {promptIds.has("R_SIDE") ? <PromptOrb id="R_SIDE" /> : null}
          </div>
        )}
        {mode === "play" && promptIds.has("R_SIDE") && (
          <div className="ongeki-prompt-wall-float right">
            <PromptOrb id="R_SIDE" />
          </div>
        )}
      </div>

      <div className="ongeki-cabinet-controls">
        {mode === "preview" && (
          <div className="ongeki-wall-slot inline left">
            <CabinetPad id="L_SIDE" interactive={false} pressed={false} />
          </div>
        )}

        <div className="ongeki-cabinet-center">
          <HandCluster
            ids={LEFT_RGB}
            hand="left"
            interactive={interactive}
            pressedIds={pressedIds}
            onButtonDown={onButtonDown}
            onButtonUp={onButtonUp}
          />
          <div className="ongeki-cabinet-lever-gap" aria-hidden="true">
            <span>レバーなし</span>
          </div>
          <HandCluster
            ids={RIGHT_RGB}
            hand="right"
            interactive={interactive}
            pressedIds={pressedIds}
            onButtonDown={onButtonDown}
            onButtonUp={onButtonUp}
          />
        </div>

        {mode === "preview" && (
          <div className="ongeki-wall-slot inline right">
            <CabinetPad
              id="R_SIDE"
              interactive={false}
              pressed={false}
            />
          </div>
        )}
      </div>

      {mode === "preview" && (
        <p className="ongeki-cabinet-hint">
          PC: キーボード / スマホ: 画面のボタンをタップ
        </p>
      )}
    </div>
  );
}

function HandCluster({
  ids,
  hand,
  interactive,
  pressedIds,
  onButtonDown,
  onButtonUp,
}: {
  ids: ButtonId[];
  hand: "left" | "right";
  interactive: boolean;
  pressedIds: Set<ButtonId>;
  onButtonDown?: (id: ButtonId) => void;
  onButtonUp?: (id: ButtonId) => void;
}) {
  return (
    <div className={`ongeki-hand-cluster ${hand}`}>
      {ids.map((id) => (
        <CabinetPad
          key={id}
          id={id}
          interactive={interactive}
          pressed={pressedIds.has(id)}
          onButtonDown={onButtonDown}
          onButtonUp={onButtonUp}
        />
      ))}
    </div>
  );
}

function PromptCluster({
  ids,
  hand,
  active,
}: {
  ids: ButtonId[];
  hand: "left" | "right";
  active: Set<ButtonId>;
}) {
  return (
    <div className={`ongeki-prompt-cluster ${hand}`}>
      {ids.map((id) => (
        <div key={id} className="ongeki-prompt-slot">
          {active.has(id) ? <PromptOrb id={id} /> : null}
        </div>
      ))}
    </div>
  );
}

type WallButtonProps = {
  side: "left" | "right";
  interactive: boolean;
  pressed: boolean;
  onButtonDown?: (id: ButtonId) => void;
  onButtonUp?: (id: ButtonId) => void;
};

export function OngekiWallButton({
  side,
  interactive,
  pressed,
  onButtonDown,
  onButtonUp,
}: WallButtonProps) {
  const id = side === "left" ? "L_SIDE" : "R_SIDE";
  return (
    <div className={`ongeki-wall-edge ${side}`}>
      <CabinetPad
        id={id}
        interactive={interactive}
        pressed={pressed}
        onButtonDown={onButtonDown}
        onButtonUp={onButtonUp}
      />
    </div>
  );
}

function CabinetPad({
  id,
  interactive,
  pressed,
  onButtonDown,
  onButtonUp,
}: {
  id: ButtonId;
  interactive: boolean;
  pressed: boolean;
  onButtonDown?: (id: ButtonId) => void;
  onButtonUp?: (id: ButtonId) => void;
}) {
  const def = BUTTON_BY_ID[id];
  const tone = def.isSide ? "side" : def.isRed ? "red" : def.isGreen ? "green" : "blue";

  const endPress = () => {
    onButtonUp?.(id);
  };

  if (!interactive) {
    return (
      <div
        className={`ongeki-pad ${tone}${def.hand === "left" ? " left" : " right"}`}
        style={{ background: def.color }}
      >
        <span className="ongeki-pad-main">{def.isSide ? "壁" : def.arrow}</span>
        <span className="ongeki-pad-key">{keyLabel(def.code)}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`ongeki-pad ${tone}${pressed ? " pressed" : ""}`}
      style={{ background: def.color }}
      aria-label={def.label}
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        onButtonDown?.(id);
      }}
      onPointerUp={(e) => {
        e.preventDefault();
        endPress();
      }}
      onPointerCancel={() => endPress()}
      onLostPointerCapture={() => endPress()}
    >
      <span className="ongeki-pad-main">{def.isSide ? "壁" : def.arrow}</span>
      <span className="ongeki-pad-key desktop-only">{keyLabel(def.code)}</span>
    </button>
  );
}

function PromptOrb({ id }: { id: ButtonId }) {
  const def = BUTTON_BY_ID[id];
  return (
    <div
      className={`ongeki-orb${def.isSide ? " ongeki-orb-wall" : ""}`}
      style={{ background: def.color }}
      title={def.label}
    >
      <span>{def.isSide ? "壁" : def.arrow}</span>
    </div>
  );
}

function keyLabel(code: string): string {
  if (code === "Tab") return "Tab";
  if (code === "Enter") return "Enter";
  return code.replace("Key", "");
}

/** キー配置の参照用（将来拡張） */
export const ONGEKI_BUTTON_LAYOUT = BUTTONS;
