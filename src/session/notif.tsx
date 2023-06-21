// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { message } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, CheckOutlined } from "@ant-design/icons";
import classNames from "classnames";

import { stringifySrsStage } from "@utils";
import { v4 as uuidv4 } from "uuid";

let prevSrsNotification: string;
export function showSrsNotification(
  oldSrsStage: number,
  newSrsStage: number
): void {
  const down = oldSrsStage >= newSrsStage;
  const classes = classNames("srs-notif", {
    "srs-down": down,
    "srs-up": !down
  });

  // Only allow one SRS notification
  const key = uuidv4();
  if (prevSrsNotification) message.destroy(prevSrsNotification);

  message.info({
    content: stringifySrsStage(newSrsStage),
    icon: down ? <ArrowDownOutlined /> : <ArrowUpOutlined />,
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
  if (prevNearMatchNotification) message.destroy(prevNearMatchNotification);

  message.info({
    content: <>
      Your answer (&lsquo;<b>{givenAnswer}</b>&rsquo;) was slightly wrong, the
      nearest correct answer was &lsquo;<b>{matchedAnswer}</b>&rsquo;.
    </>,
    icon: <CheckOutlined />,
    duration: 3,
    className: "near-match-notif",
    key
  });
  prevNearMatchNotification = key;
}
