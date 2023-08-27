// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { FC, ReactNode } from "react";

import { Link, useMatch } from "react-router-dom";

interface Props {
  to?: string;
  condition?: boolean;

  replace?: boolean;

  matchTo?: boolean;
  matchPath?: string;
  matchExact?: boolean;

  children?: ReactNode;
}

export const ConditionalLink: FC<Props> = ({
  to,
  condition,

  replace,

  matchTo,
  matchPath,
  matchExact,

  children, ...props
}): JSX.Element => {
  // Disable the link if we're already on that route
  const wantsCondition = condition !== undefined;
  const wantsMatch = matchTo || !!matchPath;

  const pattern = (matchTo && to ? to : matchPath) || "";
  const match = useMatch({
    path: pattern,
    end: matchExact
  });

  const active = (!wantsCondition || !!condition) && (!wantsMatch || !match);

  return active && to
    ? (
      <Link
        to={to}
        replace={replace}
        {...props}
      >
        {children}
      </Link>
    )
    : (
      <span className="conditional-link-disabled" {...props}>
        {children}
      </span>
    );
};
