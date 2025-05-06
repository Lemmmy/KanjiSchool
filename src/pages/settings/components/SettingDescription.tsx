// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";

interface Props {
  description?: ReactNode;
}

export function SettingDescription({ description }: Props): React.ReactElement | null {
  if (!description) return null;

  return (
    <div className="text-desc text-sm mt-xss -mb-xss whitespace-normal">
      {description}
    </div>
  );
}
