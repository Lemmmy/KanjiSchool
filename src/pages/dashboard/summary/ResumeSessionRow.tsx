// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";
import { Tooltip, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import { useAppSelector } from "@store";
import { shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";

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

export function ResumeSessionRow(): React.ReactElement | null {
  const navigate = useNavigate();

  // Get session state to resume session if possible
  const { ongoing, sessionState } =
    useAppSelector(s => s.session, shallowEqual);

  // Don't show row if no ongoing session
  if (!ongoing || !sessionState) return null;

  return <div>
    {/* Session progress bar */}
    <SessionProgress
      className="!mb-0 !bg-black/8 border-0 border-solid border-y border-y-split !rounded-none"
      heightClassName="h-[16px]"
    />

    <div className="flex items-center justify-center gap-sm flex-wrap p-sm bg-white/4">
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
          onClick={() => gotoSession(navigate, sessionState)}>
          Resume {SESSION_TYPE_NAMES[sessionState.type]}
        </Button>
      </Tooltip>
    </div>
  </div>;
}
