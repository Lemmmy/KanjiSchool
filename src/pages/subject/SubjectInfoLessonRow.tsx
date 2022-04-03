// Copyright (c) 2021-2022 Drew Edwards
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
}: Props): JSX.Element {
  return <Row className="subject-info-lesson-row">
    {/* Previous lesson button */}
    <Col className="prev-btn-col">
      <Button disabled={lessonCounter <= 0} onClick={onPrevLesson}>
        Prev
      </Button>
    </Col>

    {/* Counter */}
    <Col flex="auto" className="lesson-counter">
      {nts(lessonCounter + 1)}
      /
      {nts(lessonsTotal)}
    </Col>

    {/* Next lesson button */}
    <Col className="next-btn-col">
      <Button onClick={onNextLesson}>
        {lessonCounter + 1 >= lessonsTotal
          ? "Review"
          : "Next"}
      </Button>
    </Col>
  </Row>;
}
