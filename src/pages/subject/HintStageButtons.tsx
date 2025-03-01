// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Button, Col, Tooltip } from "antd";
import { GlobalHotKeys } from "react-hotkeys";

import { SubjectHintStage } from "./hintStages";

interface Props {
  hintStage?: SubjectHintStage | undefined;
  onNextHintStage?: () => void;
}

const KEY_MAP = {
  NEXT_STAGE: "h"
};

const STAGE_TEXTS: Record<SubjectHintStage, [JSX.Element | null, JSX.Element | null]> = {
  "-1": [<>Show hints</>, <>Show answer hints <b>(H)</b></>],
  "0":  [<>Show more</> , <>Show more answer hints <b>(H)</b></>],
  "1":  [<>Show all</>  , <>Show full answer hints <b>(H)</b></>],
  "2":  [null, null],
};

export function HintStageButtons({
  hintStage,
  onNextHintStage = () => { /* noop */},
}: Props): JSX.Element | null {
  if (hintStage !== undefined && hintStage < 2) {
    return <>
      {/* Tooltip with hotkey info */}
      <Tooltip title={STAGE_TEXTS[hintStage][1]}>
        <Col>
          <Button type="primary" onClick={onNextHintStage}>
            {STAGE_TEXTS[hintStage][0]}
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
