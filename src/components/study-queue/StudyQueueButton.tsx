// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect } from "react";
import { Button, ButtonProps, Tooltip } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import classNames from "classnames";

import { addToStudyQueue, removeFromStudyQueue, useIsInStudyQueue } from "@session";
import { useStudyQueueHover } from "./StudyQueueHotkeyHandler";

import Debug from "debug";
const debug = Debug("kanjischool:study-queue-button");

interface Props extends ButtonProps {
  subjectId?: number;
  subjectIds?: number[];
  iconOnly?: boolean;
  useShortTitle?: boolean;
  noDanger?: boolean;
  noTooltip?: boolean;
}

export function StudyQueueButton({
  subjectId,
  subjectIds,
  iconOnly,
  useShortTitle,
  noDanger,
  noTooltip,
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

  const button = <Button
    className={classes}

    icon={inQueue ? <MinusOutlined /> : <PlusOutlined />}
    danger={!noDanger && inQueue}

    onClick={e => {
      debug("clicked study queue button for subject(s) %o", subjectId ?? subjectIds);

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
  </Button>;

  return noTooltip
    ? button
    : (
      <Tooltip
        title={() => <>{longTitle} <b>(Q)</b></>}
        destroyTooltipOnHide={true}
      >
        {button}
      </Tooltip>
    );
}
