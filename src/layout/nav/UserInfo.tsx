// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import * as api from "@api";

export function UserInfo(): JSX.Element | null {
  const user = api.useUser();
  if (!user) return null;

  const sub = user.data.subscription;
  const level = Math.min(user.data.level, sub.max_level_granted);
  const isFree = sub.type === "free" || sub.type === "unknown";

  return <div className="site-header-user">
    <span className="user-username">{user.data.username}</span>
    <span className="user-lower">
      <span className="user-level">Level {level}</span>
      {isFree && <span className="user-free">Free</span>}
    </span>
  </div>;
}

export function MenuUserInfo(): JSX.Element | null {
  const user = api.useUser();
  if (!user) return null;

  const sub = user.data.subscription;
  const level = Math.min(user.data.level, sub.max_level_granted);
  const isFree = sub.type === "free" || sub.type === "unknown";

  return <div className="menu-user-info">
    <span className="user-username">{user.data.username}</span>
    <span className="user-level">Level {level}</span>
    {isFree && <span className="user-free">Free</span>}
  </div>;
}
