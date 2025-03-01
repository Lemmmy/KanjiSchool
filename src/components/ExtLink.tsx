// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { FC, HTMLProps } from "react";

export const ExtLink: FC<HTMLProps<HTMLAnchorElement>> = ({ children, ...props }) => {
  return <a
    {...props}
    target="_blank"
    rel="noopener noreferrer"
  >{children}</a>;
};
