// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ArrowUpOutlined, ArrowDownOutlined, CheckOutlined } from "@ant-design/icons";
import classNames from "classnames";

import { globalMessage } from "@global/AntInterface.tsx";

import { stringifySrsStage } from "@utils";
import { v4 as uuidv4 } from "uuid";

let prevSrsNotification: string;
export function showSrsNotification(
  oldSrsStage: number,
  newSrsStage: number
): void {
  const down = oldSrsStage >= newSrsStage;
  const classes = classNames("text-white light:text-black", {
    // SRS stage down
    "[&_.ant-message-notice-content]:!bg-red-9": down,
    "[.light_&_.ant-message-notice-content]:!bg-red-4 light:text-white": down,

    // SRS stage up
    "[&_.ant-message-notice-content]:!bg-green-9": !down,
    "[.light_&_.ant-message-notice-content]:!bg-green-4": !down
  });

  // Only allow one SRS notification
  const key = uuidv4();
  if (prevSrsNotification) globalMessage.destroy(prevSrsNotification);

  globalMessage.info({
    content: stringifySrsStage(newSrsStage),
    icon: down
      ? <ArrowDownOutlined className="!text-red light:!text-red-1" />
      : <ArrowUpOutlined className="!text-green light:!text-green-8" />,
    duration: 1,
    className: classes,
    key
  });
  prevSrsNotification = key;
}

let prevNearMatchNotification: string;
export function showNearMatchNotification(
  givenAnswer: string,
  matchedAnswer: string
): void {
  // Only allow one near match notification
  const key = uuidv4();
  if (prevNearMatchNotification) globalMessage.destroy(prevNearMatchNotification);

  globalMessage.info({
    content: <>
      Your answer (&lsquo;<b>{givenAnswer}</b>&rsquo;) was slightly wrong, the
      nearest correct answer was &lsquo;<b>{matchedAnswer}</b>&rsquo;.
    </>,
    icon: <CheckOutlined className="!text-yellow light:!text-orange" />,
    duration: 3,
    className: classNames(
      "text-white light:text-black",
      "[&_.ant-message-notice-content]:!bg-yellow-9",
      "[.light_&_.ant-message-notice-content]:!bg-yellow-2",
    ),
    key
  });
  prevNearMatchNotification = key;
}
