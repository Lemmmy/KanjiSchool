// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Row, Col } from "antd";
import classNames from "classnames";

import { StoredAssignment, StoredSubject } from "@api";

import { ShortDuration } from "@comp/ShortDuration";

import dayjs from "dayjs";
import { isPast, parseISO } from "date-fns";

interface Props {
  subject: StoredSubject;
  assignment: StoredAssignment;
}

export function DateRow({ subject, assignment }: Props): JSX.Element {
  const { data } = assignment;

  return <div className="py-md">
    <Row justify="center" gutter={[16, 16]}>
      <DateCol name="Unlocked at" date={data.unlocked_at} />
      <DateCol name="Started at" date={data.started_at} />
      <DateCol name="Passed at" date={data.passed_at} />
      <DateCol name="Next review" date={data.available_at} />
      <DateCol name="Burned at" date={data.burned_at} />
      <DateCol name="Resurrected at" date={data.resurrected_at} />
      <DateCol name="Added to WaniKani" date={subject.data.created_at} short />
    </Row>
  </div>;
}

interface ColProps {
  name: string;
  date: string | null;
  short?: boolean;
}

function DateCol({ name, date, short = false }: ColProps): JSX.Element | null {
  if (!date) return null;

  // Highlight the date in green for next review if it's available now
  const past = isPast(parseISO(date));
  const availableNow = name === "Next review" && date && past;

  return <Col span={8} className="text-center">
    <div className="border-0 border-solid border-b border-b-split pb-xss mb-xss font-bold">
      {name}
    </div>

    <span className="text-sm">{dayjs(date).format(short ? "ll" : "llll")}</span>
    {" "}
    <span className={classNames("text-sm", {
      "text-green font-bold": availableNow,
      "text-desc": !availableNow,
    })}>
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
