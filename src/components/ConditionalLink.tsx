// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { FC, ReactNode } from "react";

import { Link, useMatch } from "react-router-dom";
import classNames from "classnames";

interface Props {
  to?: string;
  condition?: boolean;

  replace?: boolean;

  matchTo?: boolean;
  matchPath?: string;
  matchExact?: boolean;

  children?: ReactNode;
  className?: string;
}

export const ConditionalLink: FC<Props> = ({
  to,
  condition,

  replace,

  matchTo,
  matchPath,
  matchExact,

  children,
  className,
  ...props
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
        className={className}
        {...props}
      >
        {children}
      </Link>
    )
    : (
      <span className={classNames("clink-dis cursor-pointer text-link", className)} {...props}>
        {children}
      </span>
    );
};
