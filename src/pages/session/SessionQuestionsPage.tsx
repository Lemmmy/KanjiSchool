// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { RootState } from "@store";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "@actions/SessionActions";

import {
  chooseQuestion,
  QuestionType,
  SessionItem,
  showNearMatchNotification,
  showSkipNotification,
  skipQuestion,
  SkipType,
  submitQuestionAnswer,
  UndoType
} from "@session";

import { useVocabAudio } from "@comp/subjects/AudioButton";
import { SessionQuestionContents } from "./SessionQuestionContents";

import * as api from "@api";
import { StoredSubject } from "@api";
import { isVocabularyLike, NearMatchAction, useBooleanSetting, useStringSetting } from "@utils";
import { AnswerVerdict } from "./checkAnswer";

import { GlobalHotKeys, KeyMap } from "react-hotkeys";
import { usePreventDocumentSpace } from "@utils/hooks/usePreventDocumentSpace";

import Debug from "debug";
const debug = Debug("kanjischool:session-questions-page");

const KEY_MAP: KeyMap = {
  NEXT: { sequence: "space", action: "keyup" },
  UNDO: ["backspace", "ctrl+z", "command+z"]
};

export type OnAnsweredFn = (verdict: AnswerVerdict) => void;

export type OnSkipFn = (
  viaShortcut?: boolean
) => void;

export function SessionQuestionsPage(): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  usePreventDocumentSpace();

  // Fetch all the required information from the Redux store.
  const subjects = api.useSubjects();
  const items = useSelector((s: RootState) => s.session.sessionState?.items, shallowEqual);
  const questions = useSelector((s: RootState) => s.session.sessionState?.questions, shallowEqual);
  const currentQuestion = useSelector((s: RootState) => s.session.currentQuestion);
  const incorrectAnswer = useSelector((s: RootState) => s.session.incorrectAnswer);

  // Get the subject for a given SessionItem.
  const getItemSubject = useCallback((item?: SessionItem): StoredSubject | undefined => {
    if (!item || !subjects) return;
    return subjects[item.subjectId];
  }, [subjects]);

  // Get the current SessionQuestion, SessionItem and its subject.
  const question = questions?.[currentQuestion ?? -1];
  const item = items?.[question?.itemId ?? -1];
  const subject = getItemSubject(item);

  const currentItemId = question?.itemId;
  const currentType = question?.type;

  // Grab a playAudio function if this is a vocabulary subject and reading
  // question
  const [playAudio] = useVocabAudio(
    question?.type === "reading" && subject && isVocabularyLike(subject)
      ? subject : undefined
  );

  // The setting for near match notifications
  const nearMatchAction = useStringSetting<NearMatchAction>("nearMatchAction");

  // If there is no question set yet, pick a random one
  useEffect(() => {
    if (!items || !questions || !subjects) return;
    if (question) return;

    debug("SessionQuestionsPage fetching next question");
    // debug("session items (%d): %o", items?.length || 0, items);
    chooseQuestion();
  }, [items, questions, subjects, question]);

  const submitAnswer = useCallback(async (correct: boolean) => {
    if (!question || !item) throw new Error("Missing question or item!");
    // debug("submitAnswer %d %o %o", item.assignmentId, correct, item);

    // submitQuestionAnswer will immediately call actions.answerQuestion on the
    // Session reducer, which will remove the incorrect answer screen. The
    // useEffect will pick the next question automatically.
    const complete = submitQuestionAnswer(question.type, question.itemId, item, correct);

    // If the session is completed, return to the dashboard.
    if (complete) navigate("/");
  }, [navigate, question, item]);

  const onAnswered: OnAnsweredFn = useCallback(async ({
    givenAnswer, ok, nearMatch, matchedAnswer, digraphMatch
  }) => {
    // debug(question, subject);
    if (!question || !subject) throw new Error("Missing question or subject!");
    // debug("answered question: %o", correct);

    if (!ok) {
      // If the answer was rejected, show the lesson screen
      dispatch(actions.setIncorrectAnswer({
        answer: givenAnswer,
        digraphMatch
      }));
    } else {
      // Otherwise, if it was correct, submit the answer immediately, and play
      // the audio if possible (vocabulary readings)
      if (question.type === "reading" && isVocabularyLike(subject)) {
        playAudio(givenAnswer);
      }

      // If this was a 'near match' and the user wants to see a notification,
      // then show that notification
      if (nearMatch && nearMatchAction === "ACCEPT_NOTIFY" && matchedAnswer) {
        showNearMatchNotification(givenAnswer, matchedAnswer);
      }

      submitAnswer(ok).catch(console.error);
    }
  }, [dispatch, question, subject, submitAnswer, playAudio, nearMatchAction]);

  // Don't know, undo, skip, and incorrect next buttons
  const onDontKnow = useCallback(() => {
    // Submit an empty answer
    onAnswered({ ok: false, retry: false, givenAnswer: "" });
  }, [onAnswered]);

  const skipEnabled = useBooleanSetting("skipEnabled");
  const skipNotification = useBooleanSetting("skipNotification");
  const skipType = useStringSetting<SkipType>("skipType");
  const onSkip: OnSkipFn = useCallback((viaShortcut) => {
    if (!skipEnabled) return;
    if (!question) throw new Error("Missing question!");

    // Skip based on the desired skip setting
    const complete = skipQuestion(question.type, question.itemId);

    // If this was skipped via the shortcut and the notification is enabled,
    // show the message. A different message is shown if the session is now
    // complete (only SKIP_REMOVE).
    if (viaShortcut && skipNotification && !complete) {
      showSkipNotification(skipType);
    }

    // If the session is completed, return to the dashboard. Should only happen
    // in SKIP_REMOVE.
    if (complete) {
      showSkipNotification("complete");
      navigate("/");
    }
  }, [navigate, question, skipEnabled, skipNotification, skipType]);

  const undoEnabled = useStringSetting<UndoType>("undoEnabled");
  const onIncorrectUndo = useCallback(() => {
    if (undoEnabled !== "ENABLED") return;
    // Remove the incorrect answer and try the question again
    dispatch(actions.setIncorrectAnswer(undefined));
  }, [dispatch, undoEnabled]);

  const onIncorrectNext = useCallback(() => {
    submitAnswer(false).catch(console.error);
  }, [submitAnswer]);

  // Keyboard shortcuts
  const onUndoShortcut = useCallback((e?: KeyboardEvent) => {
    debug("undo shortcut pressed");
    if (incorrectAnswer !== undefined) {
      e?.preventDefault();
      onIncorrectUndo();
    }
  }, [incorrectAnswer, onIncorrectUndo]);

  const onSpace = useCallback((e?: KeyboardEvent) => {
    debug("space pressed", e);
    if (incorrectAnswer !== undefined) {
      e?.stopPropagation();
      onIncorrectNext();
    }
  }, [incorrectAnswer, onIncorrectNext]);

  const renderQuestion = useCallback((
    type: QuestionType,
    item: SessionItem,
    itemId: number
  ): JSX.Element | null => {
    const iSubject = getItemSubject(item);
    if (!iSubject) return null;

    // Radicals do not have reading questions
    if (type === "reading" && iSubject.object === "radical") return null;

    // If this is the question currently being shown
    const isCurrent = itemId === currentItemId && type === currentType;

    return <SessionQuestionContents
      key={`${itemId}-${type}`}
      type={type} itemId={itemId}
      subject={iSubject}
      current={isCurrent}
      onIncorrectNext={onIncorrectNext} onIncorrectUndo={onIncorrectUndo}
      onDontKnow={onDontKnow} onSkip={onSkip} onAnswered={onAnswered}
    />;
  }, [getItemSubject, currentItemId, currentType,
    onIncorrectNext, onIncorrectUndo, onDontKnow, onSkip, onAnswered]);

  return <GlobalHotKeys
    keyMap={KEY_MAP}
    handlers={{
      NEXT: onSpace,
      UNDO: onUndoShortcut
    }}
    allowChanges
  >
    {items && subjects && items.flatMap((item, itemId) => [
      // All items have a meaning question
      renderQuestion("meaning", item, itemId),
      // Non-radicals have a reading question, radicals will return null here
      renderQuestion("reading", item, itemId),
    ])}
  </GlobalHotKeys>;
}
