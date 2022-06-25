// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import Icon from "@ant-design/icons";

export const CloudDisconnectedOutlinedSvg = (): JSX.Element => (
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
    <path d="m830.34 120.53c-2.0488 0-4.0977 0.78346-5.6602 2.3477-50.409 50.387-92.766 92.753-139.79 139.77-49.815-32.054-109.08-50.654-172.69-50.654-136.7 0-253.4 85.8-299.2 206.6-85.7 22.5-149 100.5-149 193.4 0 73.609 39.721 137.89 98.875 172.61-17.151 17.148-32.932 32.935-50.395 50.393-3.1217 3.1238-3.1217 8.1868 0 11.311l42.689 42.689c3.1238 3.1217 8.1868 3.1217 11.311 0l712.15-712.12c3.1284-3.1249 3.1284-8.1954 0-11.32l-42.631-42.68c-1.5624-1.5642-3.6114-2.3477-5.6602-2.3477zm-318.14 167.47c41.478 0 81.536 10.329 117.3 30.029-138.62 138.6-275.08 275.06-409.89 409.85-16.059-6.1408-30.788-15.653-43.311-28.176a123.3 123.3 0 0 1-36.301-87.699c0-28 9.0992-54.301 26.199-76.301a125.7 125.7 0 0 1 66.102-43.699l37.898-9.9004 13.9-36.6c8.6-22.8 20.601-44.1 35.701-63.4a245.6 245.6 0 0 1 52.398-49.9c41.1-28.9 89.5-44.199 140-44.199zm263.04 61.986-54.865 54.861c7.9068 12.92 14.573 26.534 19.922 40.652l13.799 36.5 37.801 10c54.3 14.5 92.1 63.8 92.1 120 0 33.1-12.901 64.299-36.301 87.699a123.07 123.07 0 0 1-87.6 36.301h-370.88l-76.004 76h446.89c110.4 0 199.9-89.5 199.9-200 0-92.7-63.1-170.7-148.6-193.3-9.281-24.479-21.476-47.524-36.156-68.713z"/>
  </svg>
);
export const CloudDisconnectedOutlined = (props: any): JSX.Element =>
  <Icon component={CloudDisconnectedOutlinedSvg} {...props} />;