// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ExclamationCircleOutlined } from "@ant-design/icons";

import { store } from "@app";
import { abandonSession, isItemFinished, isItemStarted, SessionState } from "@session";

import { nts } from "@utils";

import { globalModal } from "@global/AntInterface.tsx";

export function showSessionAbandonModal(): void {
  const state = store.getState().session.sessionState;
  if (!state) return;

  globalModal.confirm({
    title: "Abandon session?",
    icon: <ExclamationCircleOutlined />,
    content: <SessionAbandonModalContents state={state} />,
    okText: "Abandon",
    okButtonProps: { danger: true },
    onOk: abandonSession
  });
}

interface Props {
  state: SessionState;
}

function SessionAbandonModalContents({ state }: Props): JSX.Element {
  const { type, items } = state;

  const assignments = store.getState().sync.assignments;
  if (!assignments) throw new Error("Invalid state");

  let incompleteCount = 0;
  let unsubmittedCount = 0;
  for (const item of items) {
    const assignment = assignments[item.assignmentId || -1];
    if (!assignment) continue;

    if (type !== "self_study" && isItemFinished(item) && !item.submitted)
      unsubmittedCount++;
    if (isItemStarted(item) && !isItemFinished(item))
      incompleteCount++;
  }

  return <>
    <p style={{ marginBottom: 0 }}>Really abandon the session?</p>

    {type !== "self_study" && (incompleteCount > 0 || unsubmittedCount > 0) ? (
      <ul style={{ marginTop: 16, paddingLeft: 20 }}>
        {/* Incomplete assignments */}
        {incompleteCount ? (
          <li>
            <b>{nts(incompleteCount)}</b> incomplete
            assignment{incompleteCount !== 1 ? "s" : ""} will be abandoned.
          </li>
        ) : null}

        {/* Unsubmitted assignments */}
        {unsubmittedCount ? (
          <li>
            <b>{nts(unsubmittedCount)}</b> unsubmitted
            assignment{unsubmittedCount !== 1 ? "s" : ""} will be abandoned.
          </li>
        ) : null}
      </ul>
    ) : null}
  </>;
}
