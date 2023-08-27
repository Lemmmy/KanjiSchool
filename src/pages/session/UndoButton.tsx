import { Button, ButtonProps, Tooltip } from "antd";

import { UndoType } from "@session";
import { useStringSetting } from "@utils";

interface Props extends ButtonProps {
  onUndo?: () => void;
}

export function UndoButton({
  onUndo,
  ...buttonProps
}: Props): JSX.Element | null {
  // Whether to show the undo button
  const undoEnabled = useStringSetting<UndoType>("undoEnabled");
  if (undoEnabled === "HIDDEN") return null;

  return <Tooltip
    title={undoEnabled === "DISABLED"
      ? "Undo is disabled. This can be turned off in Settings."
      : undefined}
  >
    <Button
      className="session-button-left session-button-undo"
      danger
      disabled={undoEnabled === "DISABLED"}
      onClick={onUndo}
      {...buttonProps}
    >
      Undo
    </Button>
  </Tooltip>;
}
