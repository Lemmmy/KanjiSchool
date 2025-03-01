// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { HTMLProps, ReactNode } from "react";
import classNames from "classnames";

interface Props extends Omit<HTMLProps<HTMLDivElement>, "title"> {
  title?: ReactNode;
  extra?: ReactNode;
  className?: string;
}

export function AppLoading({ title, extra, className }: Props): JSX.Element {
  return <div className={classNames("wk-preloader", className)}>
    {/* Spinner */}
    <div className="wk-preloader-spinner" />

    {/* Loading hint */}
    <span>{title || "Loading KanjiSchool..."}</span>

    {/* Extra? */}
    {extra && <div className="wk-preloader-extra">{extra}</div>}
  </div>;
}
