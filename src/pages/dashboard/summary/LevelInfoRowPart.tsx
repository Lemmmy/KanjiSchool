// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";

interface LevelInfoPartProps {
  label: string;
  children: ReactNode;
}

export function LevelInfoRowPart({ label, children }: LevelInfoPartProps): JSX.Element {
  return <div
    className="inline-block bg-[#1d1d1d] md:text-base md:py-sm md:px-lg text-sm py-xs px-sm flex-grow text-center"
  >
    <span className="inline-block mr-xs text-desc">{label}: </span>
    {children}
  </div>;
}
