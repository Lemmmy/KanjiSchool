// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect, useState, useCallback, useRef, Ref, ReactNode, Dispatch, SetStateAction } from "react";
import { Input, InputProps } from "antd";
import classNames from "classnames";

import { ApiSubject } from "@api";

import { PseudoIme } from "@comp/PseudoIme";

import { OnAnsweredFn, OnSkipFn } from "./SessionQuestionsPage";
import { checkAnswer, cleanAnswer } from "./checkAnswer";

import { showSessionWrapUpModal } from "./modals/SessionWrapUpModal";
import { showSessionAbandonModal } from "./modals/SessionAbandonModal";

import { NearMatchAction, useBooleanSetting } from "@utils";

import Debug from "debug";
const debug = Debug("kanjischool:session-question-input");

interface Props {
  isCurrent: boolean;
  questionType: "meaning" | "reading";

  inputRef: Ref<Input>;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;

  inputShake: boolean;

  onAnimationEnd: () => void;
  onSubmit: () => void;
  onSkip: OnSkipFn;
}

function SessionQuestionInput({
  isCurrent, questionType,
  inputRef, inputValue, setInputValue,
  inputShake,
  onAnimationEnd,
  onSubmit,
  onSkip
}: Props): JSX.Element {
  const skipShortcut = useBooleanSetting("skipShortcut");

  const onChangeInternal = useCallback((e: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value), [setInputValue]);

  // These shortcuts are implemented in SessionPage, however, if the input is
  // focused then those shortcuts will not trigger. So, they are implemented
  // here too.
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      if (e.shiftKey) {
        // Abandon session (Shift+Esc)
        e.preventDefault();
        showSessionAbandonModal();
      } else {
        // Wrap up session (Esc)
        e.preventDefault();
        showSessionWrapUpModal();
      }
    }
  }, []);

  // Trigger onSubmit or onSkip depending on if Ctrl was held when Enter was
  // pressed, if allowed.
  const onPressEnter = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && skipShortcut) {
      debug("onPressEnter: ctrl held, triggering onSkip");
      onSkip(true);
    } else {
      onSubmit();
    }
  }, [onSubmit, onSkip, skipShortcut]);

  // debug("rendering SessionQuestionInput %s", inputValue);

  const classes = classNames("question-input-box", {
    "shake": inputShake
  });

  const inputProps: InputProps & { value: string } = {
    className: classes,
    size: "large",
    autoFocus: isCurrent,
    value: inputValue,
    // autoComplete: "off",
    // autoCorrect: "off",
    // spellCheck: false,
    autoCapitalize: "off",
    onPressEnter,
    onAnimationEnd,
    onKeyDown,
    onFocus: () => {
      debug("SessionQuestionInput onFocus %s", inputValue);

      // Workaround mobile scrolling issue
      window.scrollTo(0, 0);
      setTimeout(() => window.scrollTo(0, 0), 50);
    },
    // onBlur: () => {
    //   debug("SessionQuestionInput onBlur %s", inputValue);
    // }
  };

  return questionType === "meaning"
    ? <Input
      {...inputProps}
      placeholder="Your response"
      onChange={onChangeInternal}
      ref={inputRef}
    />
    : <PseudoIme
      {...inputProps}
      placeholder="答え"
      setValue={setInputValue}
      inputRef={inputRef}
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
    />;
}

type HookRes = [
  ReactNode,
  () => void, // onSubmit
];

const FORCE_FOCUS_NODES = ["input", "button", "textarea"];

export function useSessionQuestionInput(
  isCurrent: boolean,
  questionType: "meaning" | "reading",
  subject: ApiSubject,
  meaningSynonyms: string[] | undefined,
  nearMatchAction: NearMatchAction,
  onAnswered: OnAnsweredFn,
  onSkip: OnSkipFn,
): HookRes {
  const inputRef = useRef<Input>(null);

  const [inputValue, setInputValue] = useState("");

  const [inputShake, setInputShake] = useState(false);
  const onAnimationEnd = useCallback(() => setInputShake(false), []);

  const onSubmit = useCallback(() => {
    const answer = cleanAnswer(questionType, inputValue);
    debug("value: %s  cleaned: %s", inputValue, answer);

    const verdict = checkAnswer(
      questionType, subject, undefined, // TODO: matchingKanji
      answer,
      nearMatchAction, meaningSynonyms
    );
    debug("verdict - ok: %o  retry: %o", verdict.ok, verdict.retry);

    if (!verdict.ok && verdict.retry) {
      setInputShake(true);
    } else {
      onAnswered(verdict);
    }
  }, [inputValue, onAnswered, questionType, subject, nearMatchAction, meaningSynonyms]);

  // Bind a key listener to the body, so that if the user starts typing outside
  // of the box, yea
  useEffect(() => {
    debug("SessionQuestionInput inputRef useEffect");

    const handler = function(e: KeyboardEvent) {
      // Only listen to this event if the input is not focused, no other input
      // is focused, and this key event was an ASCII character
      // -----------------------------------------------------------------------
      // Active node name is converted to lowercase, see:
      // https://johnresig.com/blog/nodename-case-sensitivity/
      const activeNode = (document.activeElement?.nodeName || "").toLowerCase();
      const ourInputFocused = document.activeElement?.classList.contains("question-input-box");
      const someInputFocused = !ourInputFocused && FORCE_FOCUS_NODES.includes(activeNode);
      const wasRelevantChar = /^[a-z0-9-]$/i.test(e.key);

      if (!ourInputFocused && !someInputFocused && wasRelevantChar) {
        if (!inputRef.current) {
          debug("no inputRef?");
          return;
        }

        debug("redirecting key event to input");
        inputRef.current.focus();
        // setInputValue(inputValue + e.key); // NOTE: WTF???
      }
    };

    document.addEventListener("keypress", handler);

    // Remove the event listener on unmount
    return () => document.removeEventListener("keypress", handler);
  }, [inputRef]);

  const el = <SessionQuestionInput
    isCurrent={isCurrent}
    questionType={questionType}
    inputRef={inputRef}
    inputValue={inputValue}
    setInputValue={setInputValue}
    inputShake={inputShake}
    onAnimationEnd={onAnimationEnd}
    onSubmit={onSubmit}
    onSkip={onSkip}
  />;

  return [el, onSubmit];
}
