// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback } from "react";

import { useAppSelector } from "@store";
import { useDispatch, shallowEqual } from "react-redux";
import { nextLesson, prevLesson } from "@store/slices/sessionSlice.ts";

import { SubjectInfo } from "@pages/subject/SubjectInfo";
import { SessionPageTransition } from "@pages/session/SessionPageTransition.tsx";
import { StoredSubject, useSubjects } from "@api";

import { GlobalHotKeys } from "react-hotkeys";
import { useBooleanSetting, useReducedMotion } from "@utils";

const KEY_MAP = {
  PREV: ["backspace", "left"],
  NEXT: ["space", "right"]
};

export function SessionLessonsPage(): JSX.Element {
  const subjects = useSubjects();
  const lessonCounter = useAppSelector(s => s.session.lessonCounter);
  const items = useAppSelector(s => s.session.sessionState?.items, shallowEqual);

  const dispatch = useDispatch();
  const onPrevLesson = useCallback(() => dispatch(prevLesson()), [dispatch]);
  const onNextLesson = useCallback(() => dispatch(nextLesson()), [dispatch]);

  const contents = <>{subjects && items && Object.entries(items).map(([id, item]) => (
    <SessionLessonContents
      id={id}
      key={id}
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

function SessionLessonContents({
  id, current,
  subject,
  lessonCounter, lessonsTotal,
  onPrevLesson, onNextLesson
}: {
  id: string;
  current: boolean;
  subject: StoredSubject;
  lessonCounter?: number;
  lessonsTotal?: number;
  onPrevLesson?: () => void;
  onNextLesson?: () => void;
}): JSX.Element {
  const reducedMotion = useReducedMotion();
  const audioMuted = useBooleanSetting("audioMuted");
  const autoPlayAudio = useBooleanSetting("audioAutoplayLessons");

  return <SessionPageTransition
    shouldWrap={!reducedMotion}
    transitionKey={id}
    current={current}
  >
    <div>
      <SubjectInfo
        subject={subject}
        questionType="meaning"
        charactersMax={96}

        lessonCounter={lessonCounter}
        lessonsTotal={lessonsTotal}
        onPrevLesson={onPrevLesson}
        onNextLesson={onNextLesson}

        autoPlayAudio={!audioMuted && autoPlayAudio}

        showToc
      />
    </div>
  </SessionPageTransition>;
}
