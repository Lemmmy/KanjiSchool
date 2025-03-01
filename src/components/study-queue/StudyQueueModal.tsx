// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback, useMemo, useState } from "react";
import { Tooltip, Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { CloseOutlined, DownOutlined, QuestionCircleOutlined, UpOutlined } from "@ant-design/icons";
import classNames from "classnames";

import { useAppSelector } from "@store";
import { useDispatch, shallowEqual } from "react-redux";

import { useNavigate } from "react-router-dom";

import { useAssignments } from "@api";
import { clearStudyQueue, gotoSession, startSession } from "@session";
import { SubjectGrid } from "@comp/subjects/lists/grid";
import { PresetDropdownBtn, PresetStartSessionFn } from "@comp/preset-editor";

import { GlobalHotKeys } from "react-hotkeys";
import { pluralN, setBooleanSetting, useBooleanSetting } from "@utils";

import { globalModal } from "@global/AntInterface.tsx";
import { studyQueueSetCollapsed } from "@store/slices/sessionSlice.ts";

const KEY_MAP = {
  TOGGLE_COLLAPSE: ["shift+q"]
};

export function StudyQueueModal(): JSX.Element | null {
  const [innerContainerRef, setInnerContainerRef] =
    useState<HTMLDivElement | null>(null);

  const dispatch = useDispatch();

  // The queue items, converted back to an array of subject IDs
  const queue = useAppSelector(s => s.session.studyQueue, shallowEqual);
  const items = useMemo(() =>
    queue ? Object.keys(queue).map(k => parseInt(k)) : undefined, [queue]);

  // Collapse the modal to just the header
  const collapsed = useAppSelector(s => s.session.studyQueueCollapsed);
  const toggleCollapse = useCallback(() =>
    dispatch(studyQueueSetCollapsed(!collapsed)), [dispatch, collapsed]);

  // Don't show if assignments aren't loaded yet (prematurely)
  const hasAssignments = !!useAssignments();
  if (!hasAssignments) return null;

  const classes = classNames(
    "mt-auto sm:mb-lg sm:mx-lg px-lg py-[20px]",
    "w-full max-w-[420px] absolute right-0 bottom-0 pointer-events-auto",
    "bg-[#1f1f1f] light:bg-container rounded-t-xl sm:rounded-xl shadow-xl"
  );

  const collapseClasses = classNames("transition-[max-height] max-h-study-modal-outer overflow-hidden", {
    "overflow-hidden !max-h-0": collapsed
  });

  if ((items?.length || 0) <= 0) return null;

  // Wrapper
  return <div className="fixed inset-0 pointer-events-none overflow-hidden z-30">
    {/* Inner dialog */}
    <div className={classes}>
      {/* Header */}
      <ModalHeader
        count={items?.length || 0}
        collapsed={collapsed}
        toggleCollapse={toggleCollapse}
      />

      {/* Collapsible portion */}
      <div className={collapseClasses}>
        {/* Subjects */}
        <div
          className="h-full max-h-study-modal overflow-y-auto mt-sm"
          // Ref here is for the SubjectGrid, so that it can handle scroll
          // windowing correctly
          ref={r => setInnerContainerRef(r)}
        >
          <SubjectGrid
            size="tiny"
            colorBy="type"
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

        {/* Footer */}
        <ModalFooter items={items} />
      </div>
    </div>

    <GlobalHotKeys
      keyMap={KEY_MAP}
      handlers={{ TOGGLE_COLLAPSE: toggleCollapse }}
      allowChanges
    />
  </div>;
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

  const buttonClasses = classNames(
    "flex items-center justify-center w-[32px] h-[32px] rounded text-desc text-lg leading-none cursor-pointer",
    "border-0 outline-none bg-transparent hover:bg-white/10 light:hover:bg-black/10 transition-colors"
  );

  return <div className="flex justify-between">
    <div className="text-lg font-semibold flex flex-wrap gap-xs items-baseline">
      <span>Self-study queue</span>
      <span className="text-base font-normal whitespace-nowrap">
        ({pluralN(count, "subject")})
      </span>
    </div>

    <div className="flex items-start gap-sm -mr-xs">
      {/* Collapse button */}
      <Tooltip title={<>{collapseTitle} <b>(Shift+Q)</b></>}>
        <button
          type="button"
          aria-label="Hide"
          className={buttonClasses}
          onClick={toggleCollapse}
        >
          {collapsed ? <UpOutlined /> : <DownOutlined />}
        </button>
      </Tooltip>

      {/* Fake close button */}
      <Tooltip title="Clear self-study queue">
        <button
          type="button"
          aria-label="Close"
          className={buttonClasses}
          onClick={promptClear}
        >
          <CloseOutlined />
        </button>
      </Tooltip>
    </div>
  </div>;
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

  return <div className="flex items-center mt-sm">
    {/* "With lessons" checkbox */}
    <Checkbox
      onChange={setWithLessons}
      checked={withLessons}
      className="flex-1"
    >
      With lessons
    </Checkbox>

    {/* Self-study button */}
    <PresetDropdownBtn
      type="primary"
      presetType="review"
      disabled={(items?.length || 0) === 0}
      start={start}
      className="w-auto"
    >
      Start self-study
    </PresetDropdownBtn>
  </div>;
}

function promptClear() {
  globalModal.confirm({
    title: "Clear self-study queue?",
    icon: <QuestionCircleOutlined />,
    content: "The items currently in the self-study queue will be cleared.",
    onOk: clearStudyQueue,
    okText: "Clear",
    okButtonProps: { danger: true }
  });
}
