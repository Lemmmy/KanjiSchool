// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect } from "react";
import { Button, ButtonProps, Tooltip } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import classNames from "classnames";

import { addToStudyQueue, removeFromStudyQueue, useIsInStudyQueue } from "@session";
import { useStudyQueueHover } from "./StudyQueueHotkeyHandler";

interface Props extends ButtonProps {
  subjectId?: number;
  subjectIds?: number[];
  iconOnly?: boolean;
  useShortTitle?: boolean;
  noDanger?: boolean;
}

const keepParentFalse = { keepParent: false };

export function StudyQueueButton({
  subjectId, subjectIds,
  iconOnly,
  useShortTitle,
  noDanger,
  className,
  ...props
}: Props): JSX.Element {
  const inQueue = useIsInStudyQueue(subjectId ?? -1);
  const [hover, unhover] = useStudyQueueHover();

  // Various titles depending on the circumstance
  const longTitle = inQueue ? "Remove from self-study queue" : "Add to self-study queue";
  const title = inQueue ? "Remove from study queue" : "Add to study queue";

  const classes = classNames("study-queue-button", className);

  // Bind the self-study hotkey to this button being mounted
  useEffect(() => {
    if (subjectIds) return; // Do nothing if this is a multiple-subject button
    hover(subjectId);
    return unhover;
  }, [subjectId, subjectIds, hover, unhover]);

  // Tooltip (in case this is an icon-only button)
  return <Tooltip
    title={() => <>{longTitle} <b>(Q)</b></>}
    destroyTooltipOnHide={keepParentFalse}
  >
    {/* Add/remove to/from self-study queue button */}
    <Button
      className={classes}

      icon={inQueue ? <MinusOutlined /> : <PlusOutlined />}
      danger={!noDanger && inQueue}

      onClick={e => {
        e.stopPropagation();

        if (subjectIds) {
          // Add multiple subjects
          addToStudyQueue(subjectIds);
        } else if (subjectId !== undefined) {
          // Add or remove a single subject
          if (inQueue) removeFromStudyQueue(subjectId);
          else addToStudyQueue(subjectId);
        }

        return false;
      }}

      // Any user-defined button props
      {...props}
    >
      {!iconOnly && (useShortTitle ? "Queue" : title)}
    </Button>
  </Tooltip>;
}
