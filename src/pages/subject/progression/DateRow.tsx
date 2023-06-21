// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Row, Col } from "antd";
import classNames from "classnames";

import { StoredAssignment } from "@api";

import { ShortDuration } from "@comp/ShortDuration";

import dayjs from "dayjs";
import { isPast, parseISO } from "date-fns";

interface Props {
  assignment: StoredAssignment;
}

export function DateRow({ assignment }: Props): JSX.Element {
  return <div className="date-row">
    <Row className="date-row-row" justify="center" gutter={[16, 16]}>
      <DateCol name="Unlocked at" date={assignment.data.unlocked_at} />
      <DateCol name="Started at" date={assignment.data.started_at} />
      <DateCol name="Passed at" date={assignment.data.passed_at} />
      <DateCol name="Next review" date={assignment.data.available_at} />
      <DateCol name="Burned at" date={assignment.data.burned_at} />
      <DateCol name="Resurrected at" date={assignment.data.resurrected_at} />
    </Row>
  </div>;
}

interface ColProps {
  name: string;
  date: string | null;
}

function DateCol({ name, date }: ColProps): JSX.Element | null {
  if (!date) return null;

  // Highlight the date in green for next review if it's available now
  const past = isPast(parseISO(date));
  const availableNow = name === "Next review" && date && past;

  const classes = classNames("date-col", { now: availableNow });

  return <Col span={8} className={classes}>
    <span className="name">{name}</span>
    <span className="date">{dayjs(date).format("llll")}</span>
    {" "}
    <span className="short">
      ({availableNow
        ? "now"
        : <>
          {past ? "" : "in "}
          <ShortDuration date={date} />
          {past ? " ago" : ""}
        </>})
    </span>
  </Col>;
}
