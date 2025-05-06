// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import Icon from "@ant-design/icons";

export const SpaceOutlinedSvg = (): React.ReactElement => (
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
    <path d="m878 626h-60c-4.4 0-8 3.6-8 8v154h-596v-154c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32v-198c0-4.4-3.6-8-8-8z"/>
  </svg>
);

export const SpaceOutlined = (props: any): React.ReactElement =>
  <Icon component={SpaceOutlinedSvg} {...props} />;
