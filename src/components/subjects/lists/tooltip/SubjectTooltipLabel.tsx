// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const SubjectTooltipLabel = ({ children }: Props): JSX.Element => <span
  className="text-desc text-sm mr-text">{children}</span>;
