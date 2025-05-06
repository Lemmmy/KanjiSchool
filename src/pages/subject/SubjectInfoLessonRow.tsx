// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Row, Col, Button } from "antd";

import { nts } from "@utils";

interface Props {
  lessonCounter: number;
  lessonsTotal: number;
  onPrevLesson?: () => void;
  onNextLesson: () => void;
}

export function SubjectInfoLessonRow({
  lessonCounter,
  lessonsTotal,
  onPrevLesson,
  onNextLesson
}: Props): React.ReactElement {
  return <Row className="mb-lg">
    {/* Previous lesson button */}
    <Col>
      <Button disabled={lessonCounter <= 0} onClick={onPrevLesson}>
        Prev
      </Button>
    </Col>

    {/* Counter */}
    <Col flex="auto" className="text-center text-desc">
      {nts(lessonCounter + 1)}
      /
      {nts(lessonsTotal)}
    </Col>

    {/* Next lesson button */}
    <Col>
      <Button onClick={onNextLesson} className="float-right">
        {lessonCounter + 1 >= lessonsTotal
          ? "Review"
          : "Next"}
      </Button>
    </Col>
  </Row>;
}
