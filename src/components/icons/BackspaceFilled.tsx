// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import Icon from "@ant-design/icons";

export const BackspaceFilledSvg = (): JSX.Element => (
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
    <path d="m936 112h-560l-320 401.5 320 398.5h560c17.7 0 32-14.3 32-32v-736c0-17.7-14.3-32-32-32zm-163.9 545.9c4.4 5.2 0.7 13.1-6.1 13.1h-58.9c-4.7 0-9.2-2.1-12.3-5.7l-86.8-103.5-86.8 103.5c-3 3.6-7.5 5.7-12.3 5.7h-58.9c-6.8 0-10.5-7.9-6.1-13.1l122.3-145.9-122.3-145.9c-4.4038-5.1787-0.69792-13.137 6.1-13.1h58.9c4.7 0 9.2 2.1 12.3 5.7l86.8 103.5 86.8-103.5c3-3.6 7.5-5.7 12.3-5.7h58.9c6.8 0 10.5 7.9 6.1 13.1l-122.3 145.9z"/>
  </svg>
);

export const BackspaceFilled = (props: any): JSX.Element =>
  <Icon component={BackspaceFilledSvg} {...props} />;
