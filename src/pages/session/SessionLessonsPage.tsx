// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback } from "react";

import { RootState } from "@store";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as actions from "@actions/SessionActions";

import { SubjectInfo } from "@pages/subject/SubjectInfo";
import { StoredSubject, useSubjects } from "@api";

import { CSSTransition } from "react-transition-group";
import { GlobalHotKeys } from "react-hotkeys";
import { useReducedMotion } from "@utils";

const KEY_MAP = {
  PREV: ["backspace", "left"],
  NEXT: ["space", "right"]
};

export function SessionLessonsPage(): JSX.Element {
  const subjects = useSubjects();
  const lessonCounter = useSelector((s: RootState) => s.session.lessonCounter);
  const items = useSelector((s: RootState) => s.session.sessionState?.items, shallowEqual);

  const dispatch = useDispatch();
  const onPrevLesson = useCallback(() => dispatch(actions.prevLesson()), [dispatch]);
  const onNextLesson = useCallback(() => dispatch(actions.nextLesson()), [dispatch]);

  const contents = <>{subjects && items && Object.entries(items).map(([id, item]) => (
    <SessionLessonContents
      id={id}
      current={lessonCounter.toString() === id}
      subject={subjects[item.subjectId]}
      lessonCounter={lessonCounter}
      lessonsTotal={items.length}
      onPrevLesson={onPrevLesson}
      onNextLesson={onNextLesson}
    />
  ))}</>;

  return <GlobalHotKeys
    keyMap={KEY_MAP}
    handlers={{
      PREV: onPrevLesson,
      NEXT: onNextLesson
    }}
    allowChanges
  >
    {contents}
  </GlobalHotKeys>;
}

const Wrapper = ({ shouldWrap, transitionKey, current, children }: {
  shouldWrap: boolean,
  transitionKey: string,
  current: boolean,
  children: JSX.Element
}) => shouldWrap
  ? <CSSTransition
    key={transitionKey}
    in={current}
    appear
    timeout={250}
    classNames="session-page-inner-container"
    unmountOnExit
  >
    {children}
  </CSSTransition>
  : (current ? children : null);

function SessionLessonContents({
  id, current,
  subject,
  lessonCounter, lessonsTotal,
  onPrevLesson, onNextLesson
}: {
  id: string,
  current: boolean,
  subject: StoredSubject,
  lessonCounter?: number,
  lessonsTotal?: number,
  onPrevLesson?: () => void,
  onNextLesson?: () => void
}): JSX.Element {
  const reducedMotion = useReducedMotion();

  return <Wrapper
    shouldWrap={!reducedMotion}
    transitionKey={id}
    current={current}
  >
    <div className="session-lesson-container session-page-inner-container">
      <SubjectInfo
        subject={subject}
        questionType="meaning"
        charactersMax={96}

        lessonCounter={lessonCounter}
        lessonsTotal={lessonsTotal}
        onPrevLesson={onPrevLesson}
        onNextLesson={onNextLesson}

        autoPlayAudio={true}

        showToc
      />
    </div>
  </Wrapper>;
}