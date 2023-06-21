// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Divider } from "antd";

import { RootState } from "@store";
import { useSelector, shallowEqual } from "react-redux";

import { countSessionItems } from "@session";

export function SessionDebugInfo(): JSX.Element {
  const currentQuestion = useSelector((s: RootState) => s.session.currentQuestion);
  const sessionState = useSelector((s: RootState) => s.session.sessionState, shallowEqual);
  const { startedItems, finishedItems, skippedItems, totalItems, wrappingUp } =
    countSessionItems(sessionState);
  const question = useSelector((s: RootState) =>
    s.session.sessionState?.questions[currentQuestion ?? -1], shallowEqual);
  const item = useSelector((s: RootState) =>
    s.session.sessionState?.items[question?.itemId ?? -1], shallowEqual);

  return <div className="session-debug-info">
    <Divider orientation="left">Debug</Divider>

    <div style={{ display: "flex" }}>
      <ul style={{ flex: 1 }}>
        <li>Started items: {startedItems}</li>
        <li>Finished items: {finishedItems}</li>
        <li>Skipped items: {skippedItems}</li>
        <li>Total items: {totalItems}</li>
        <li>Wrapping up: {wrappingUp ? <b>true</b> : "false"}</li>
      </ul>

      <ul style={{ flex: 1 }}>
        <li>Current question: {currentQuestion ?? "null"} (item ID {question?.itemId ?? "null"})</li>
        {question && item && <>
          <li>Type: {question.type}</li>
          <li>Meaning completed: {item.meaningCompleted ? <b>true</b> : "false"}</li>
          <li>Meaning incorrect answers: {item.meaningIncorrectAnswers}</li>
          <li>Reading completed: {item.readingCompleted ? <b>true</b> : "false"}</li>
          <li>Reading incorrect answers: {item.readingIncorrectAnswers}</li>
          <li>Answers: {item.numAnswers}</li>
          <li>Submitted: {item.submitted ? <b>true</b> : "false"}</li>
          <li>Subject ID: {item.subjectId}</li>
          <li>Assignment ID: {item.assignmentId}</li>
          <li>Bucket: {item.bucket} (order {item.order})</li>
          <li>Choice delay: {item.choiceDelay}</li>
          <li>Put end: {item.putEnd ? <b>true</b> : "false"}</li>
          <li>Abandoned: {item.abandoned ? <b>true</b> : "false"}</li>
        </>}
      </ul>
    </div>
  </div>;
}
