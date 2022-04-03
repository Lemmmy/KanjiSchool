// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

interface Props {
  description?: string;
}

export function SettingDescription({ description }: Props): JSX.Element | null {
  if (!description) return null;

  return (
    <div className="menu-item-description menu-item-setting-description">
      {description}
    </div>
  );
}
