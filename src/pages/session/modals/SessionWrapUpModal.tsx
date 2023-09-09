// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { QuestionCircleOutlined } from "@ant-design/icons";

import { store } from "@app";
import { wrapUpSession, isItemFinished, isItemStarted, SessionState } from "@session";

import { nts } from "@utils";

import { globalModal } from "@global/AntInterface.tsx";

export function showSessionWrapUpModal(): void {
  const state = store.getState().session.sessionState;
  const doingLessons = store.getState().session.doingLessons;
  if (!state || doingLessons) return;

  globalModal.confirm({
    title: "Wrap up session?",
    icon: <QuestionCircleOutlined />,
    content: <SessionWrapUpModalContents state={state} />,
    okText: "Wrap up",
    onOk: wrapUpSession
  });
}

interface Props {
  state: SessionState;
}

function SessionWrapUpModalContents({ state }: Props): JSX.Element {
  const { type, items } = state;

  const assignments = store.getState().sync.assignments;
  if (!assignments) throw new Error("Invalid state");

  let toCompleteCount = 0;
  let incompleteCount = 0;
  for (const item of items) {
    const assignment = assignments[item.assignmentId || -1];
    if (!assignment) continue;

    if (!isItemStarted(item))
      incompleteCount++;
    else if (isItemStarted(item) && !isItemFinished(item))
      toCompleteCount++;
  }

  return <>
    <p style={{ marginBottom: 0 }}>Wrap up the session?</p>

    {type !== "self_study" && (incompleteCount > 0 || toCompleteCount > 0) ? (
      <ul style={{ marginTop: 16, paddingLeft: 20 }}>
        {/* Incomplete assignments */}
        {incompleteCount ? (
          <li>
            <b>{nts(incompleteCount)}</b> incomplete
            assignment{incompleteCount !== 1 ? "s" : ""} will not be quizzed.
          </li>
        ) : null}

        {/* To complete assignments */}
        {toCompleteCount ? (
          <li>
            <b>{nts(toCompleteCount)}</b> partially complete
            assignment{toCompleteCount !== 1 ? "s" : ""} will still be quizzed.
          </li>
        ) : null}
      </ul>
    ) : null}
  </>;
}
