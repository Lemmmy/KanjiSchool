// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Button, Col, Tooltip } from "antd";
import { GlobalHotKeys } from "react-hotkeys";

interface Props {
  hintStage?: 0 | 1 | 2 | undefined;
  onNextHintStage?: () => void;
}

const KEY_MAP = {
  NEXT_STAGE: "h"
};

export function HintStageButtons({
  hintStage,
  onNextHintStage = () => { /* noop */},
}: Props): JSX.Element | null {
  if (hintStage === 0 || hintStage === 1) {
    return <>
      {/* Tooltip with hotkey info */}
      <Tooltip
        title={hintStage === 0
          ? <>Show more answer hints <b>(H)</b></>
          : <>Show full subject hints <b>(H)</b></>}
      >
        <Col>
          <Button type="primary" onClick={onNextHintStage}>
            {hintStage === 0 ? "Show more" : "Show all"}
          </Button>
        </Col>
      </Tooltip>

      <GlobalHotKeys
        keyMap={KEY_MAP}
        handlers={{ NEXT_STAGE: onNextHintStage }}
        allowChanges
      />
    </>;
  } else {
    return null;
  }
}
