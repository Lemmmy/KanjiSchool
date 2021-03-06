// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";
import { Tooltip, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import { RootState } from "@store";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";

import { SessionType, gotoSession } from "@session";
import { showSessionAbandonModal } from "@pages/session/modals/SessionAbandonModal";

import { SessionProgress } from "@pages/session/SessionProgress";

const SESSION_TYPE_NAMES: Record<SessionType, string> = {
  lesson: "lessons",
  review: "reviews",
  self_study: "self-study"
};

const SESSION_RESUME_TOOLTIPS: Record<SessionType, ReactNode> = {
  lesson: <>Resume lessons <b>(L)</b></>,
  review: <>Resume reviews <b>(R)</b></>,
  self_study: <>Resume self-study <b>(R)</b></>
};

export function ResumeSessionRow(): JSX.Element | null {
  const history = useHistory();

  // Get session state to resume session if possible
  const { ongoing, sessionState } =
    useSelector((s: RootState) => s.session, shallowEqual);

  // Don't show row if no ongoing session
  if (!ongoing || !sessionState) return null;

  return <div className="resume-session-row">
    {/* Session progress bar */}
    <SessionProgress responsive={false} />

    <div className="resume-session-inner">
      {/* Abandon session */}
      <Tooltip title={<>Abandon {SESSION_TYPE_NAMES[sessionState.type]} <b>(A)</b></>}>
        <Button danger size="large" icon={<DeleteOutlined />}
          onClick={() => showSessionAbandonModal()}>
          Abandon {SESSION_TYPE_NAMES[sessionState.type]}
        </Button>
      </Tooltip>

      {/* Resume session */}
      <Tooltip title={SESSION_RESUME_TOOLTIPS[sessionState.type]}>
        <Button type="primary" size="large"
          onClick={() => gotoSession(history, sessionState)}>
          Resume {SESSION_TYPE_NAMES[sessionState.type]}
        </Button>
      </Tooltip>
    </div>
  </div>;
}
