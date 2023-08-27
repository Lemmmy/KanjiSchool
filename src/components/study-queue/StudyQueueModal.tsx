// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback, useMemo, useState } from "react";
import { Modal, Tooltip, Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { CloseOutlined, DownOutlined, QuestionCircleOutlined, UpOutlined } from "@ant-design/icons";
import classNames from "classnames";

import { RootState } from "@store";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as actions from "@actions/SessionActions";

import { useNavigate } from "react-router-dom";

import { useAssignments } from "@api";
import { clearStudyQueue, gotoSession, startSession } from "@session";
import { SubjectGrid } from "@comp/subjects/lists/grid";
import { PresetDropdownBtn, PresetStartSessionFn } from "@comp/preset-editor";

import { GlobalHotKeys } from "react-hotkeys";
import { pluralN, setBooleanSetting, useBooleanSetting } from "@utils";

const KEY_MAP = {
  TOGGLE_COLLAPSE: ["shift+q"]
};

export function StudyQueueModal(): JSX.Element | null {
  const [innerContainerRef, setInnerContainerRef] =
    useState<HTMLDivElement | null>(null);

  const dispatch = useDispatch();

  // The queue items, converted back to an array of subject IDs
  const queue = useSelector((s: RootState) => s.session.studyQueue, shallowEqual);
  const items = useMemo(() =>
    queue ? Object.keys(queue).map(k => parseInt(k)) : undefined, [queue]);

  // Collapse the modal to just the header
  const collapsed = useSelector((s: RootState) => s.session.studyQueueCollapsed);
  const toggleCollapse = useCallback(() =>
    dispatch(actions.studyQueueSetCollapsed(!collapsed)), [dispatch, collapsed]);

  // Don't show if assignments aren't loaded yet (prematurely)
  const hasAssignments = !!useAssignments();
  if (!hasAssignments) return null;

  const classes = classNames("study-queue-modal", { collapsed });

  return <>
    <Modal
      className={classes}
      wrapClassName="study-queue-modal-wrap"
      width={420}

      // Header
      title={<ModalHeader
        count={items?.length || 0}
        collapsed={collapsed}
        toggleCollapse={toggleCollapse}
      />}

      // Don't show the close icon, it's rendered in the title instead
      closable={false}
      closeIcon={null}

      open={(items?.length || 0) > 0}
      mask={false}
      maskClosable={false}

      // Footer
      footer={<ModalFooter items={items} />}
    >
      {/* Subjects */}
      <div
        className="study-queue-inner-container"
        // Ref here is for the SubjectGrid, so that it can handle scroll
        // windowing correctly
        ref={r => setInnerContainerRef(r)}
      >
        <SubjectGrid
          size="tiny"
          className="color-by-type"
          hasVocabulary
          hideInQueue
          alignLeft
          maxHeight={150}
          subjectIds={items ?? []}
          containerRef={innerContainerRef}
          simpleWindowing
          // TODO: EpicVirtualList doesn't (yet) account for padding when
          //       measuring the scroll container height, so additional overscan
          //       is needed.
          overscanCount={3}
        />
      </div>
    </Modal>

    <GlobalHotKeys
      keyMap={KEY_MAP}
      handlers={{ TOGGLE_COLLAPSE: toggleCollapse }}
      allowChanges
    />
  </>;
}

interface ModalHeaderProps {
  count: number;
  collapsed: boolean;
  toggleCollapse: () => void;
}

function ModalHeader({
  count,
  collapsed, toggleCollapse
}: ModalHeaderProps): JSX.Element {
  const collapseTitle = collapsed
    ? "Show self-study-queue"
    : "Hide self-study-queue";

  return <>
    <span className="study-title">
      Self-study queue <span className="study-count">
        ({pluralN(count, "subject")})
      </span>
    </span>

    {/* Collapse button */}
    <Tooltip title={<>{collapseTitle} <b>(Shift+Q)</b></>}>
      <button
        type="button"
        aria-label="Hide"
        className="ant-modal-close study-modal-collapse"
        onClick={toggleCollapse}
      >
        <span className="ant-modal-close-x">
          {collapsed ? <UpOutlined /> : <DownOutlined />}
        </span>
      </button>
    </Tooltip>

    {/* Fake close button */}
    <Tooltip title="Clear self-study queue">
      <button
        type="button"
        aria-label="Close"
        className="ant-modal-close study-modal-close"
        onClick={promptClear}
      >
        <span className="ant-modal-close-x"><CloseOutlined /></span>
      </button>
    </Tooltip>
  </>;
}

interface FooterProps {
  items?: number[];
}

function ModalFooter({ items }: FooterProps): JSX.Element {
  const navigate = useNavigate();

  const withLessons = useBooleanSetting("selfStudyWithLessons");
  const setWithLessons = useCallback((e: CheckboxChangeEvent) =>
    setBooleanSetting("selfStudyWithLessons", e.target.checked, false), []);

  const start: PresetStartSessionFn = useCallback(opts => {
    // Clear the study queue before starting the lesson
    clearStudyQueue();
    // Start the session with the given items and preset options
    gotoSession(navigate, startSession("self_study", items, withLessons, opts));
  }, [navigate, items, withLessons]);

  return <>
    {/* "With lessons" checkbox */}
    <Checkbox
      onChange={setWithLessons}
      checked={withLessons}
      style={{ float: "left" }}
    >
      With lessons
    </Checkbox>

    {/* Spacer */}
    <div className="spacer" />

    {/* Self-study button */}
    <PresetDropdownBtn
      type="primary" presetType="review"
      disabled={(items?.length || 0) === 0}
      start={start}
    >
      Start self-study
    </PresetDropdownBtn>
  </>;
}

function promptClear() {
  Modal.confirm({
    title: "Clear self-study queue?",
    icon: <QuestionCircleOutlined />,
    content: "The items currently in the self-study queue will be cleared.",
    onOk: clearStudyQueue,
    okText: "Clear",
    okButtonProps: { danger: true }
  });
}
