// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { HTMLProps, ReactNode } from "react";

interface Props extends Omit<HTMLProps<HTMLDivElement>, "title"> {
  title?: ReactNode;
  extra?: ReactNode;
}

export function AppLoading({ title, extra, ...props }: Props): JSX.Element {
  return <div className="wk-preloader" {...props}>
    {/* Spinner */}
    <div className="wk-preloader-spinner" />

    {/* Loading hint */}
    <span>{title || "Loading KanjiSchool..."}</span>

    {/* Extra? */}
    {extra && <div className="wk-preloader-extra">{extra}</div>}
  </div>;
}
