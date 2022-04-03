// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback } from "react";

import { RootState } from "@store";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as actions from "@actions/SessionActions";

import { SubjectInfo } from "@pages/subject/SubjectInfo";

import { CSSTransition } from "react-transition-group";
import { GlobalHotKeys } from "react-hotkeys";
import { useSubjects } from "@api";

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
    <CSSTransition
      key={id}
      in={lessonCounter.toString() === id}
      appear
      timeout={250}
      classNames="session-page-inner-container"
      unmountOnExit
    >
      <div className="session-lesson-container session-page-inner-container">
        <SubjectInfo
          subject={subjects[item.subjectId]}
          questionType="meaning"
          charactersMax={96}

          lessonCounter={lessonCounter}
          lessonsTotal={items.length}
          onPrevLesson={onPrevLesson}
          onNextLesson={onNextLesson}

          autoPlayAudio={true}

          showToc
        />
      </div>
    </CSSTransition>
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
