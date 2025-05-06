// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";
import { CSSTransitionClassNames } from "react-transition-group/CSSTransition";
import { CSSTransition } from "react-transition-group";

const cssTransitionBase = classNames(
  "select-none pointer-events-none fixed inset-0 md:static",
  "[&_.toc-affix]:opacity-0 [&_.toc-affix]:!transition-none"
);
const cssTransitionAnim = "transition-session-page duration-session-page ease-session-page";
const cssTransitionEnter = "scale-105 md:scale-110 opacity-0";
const cssTransitionEnterActive = "!opacity-100 !scale-100";
const cssTransitionExit = "!absolute !inset-x-lg !bottom-lg !top-[60px]";
const cssTransitionExitActive = "!scale-95 md:!scale-90 !opacity-0";

const cssTransitionClasses: CSSTransitionClassNames = {
  appear: classNames(cssTransitionEnter),
  appearActive: classNames(cssTransitionBase, cssTransitionAnim, cssTransitionEnterActive),
  enter: classNames(cssTransitionEnter),
  enterActive: classNames(cssTransitionBase, cssTransitionAnim, cssTransitionEnterActive),
  exit: classNames(cssTransitionBase, cssTransitionExit, "opacity-100 scale-100"),
  exitActive: classNames(cssTransitionBase, cssTransitionAnim, cssTransitionExit, cssTransitionExitActive),
};

export function SessionPageTransition({ shouldWrap, transitionKey, current, children }: {
  shouldWrap: boolean;
  transitionKey: string;
  current: boolean;
  children: React.ReactElement;
}): React.ReactElement | null {
  return shouldWrap
    ? (
      <CSSTransition
        key={transitionKey}
        in={current}
        appear
        timeout={300}
        classNames={cssTransitionClasses}
        unmountOnExit
      >
        {children}
      </CSSTransition>
    )
    : (current ? children : null);
}
