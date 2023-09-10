// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useUser } from "@api";

export function UserInfo(): JSX.Element | null {
  const user = useUser();
  if (!user) return null;

  const sub = user.data.subscription;
  const level = Math.min(user.data.level, sub.max_level_granted);
  const isFree = sub.type === "free" || sub.type === "unknown";

  return <div className="flex flex-col items-end justify-center text-right px-lg leading-snug">
    <div className="font-bold">{user.data.username}</div>
    <div>
      <span className="text-sm">Level {level}</span>
      {isFree && <span className="inline-block ml-xs text-desc text-sm">Free</span>}
    </div>
  </div>;
}

export function MenuUserInfo(): JSX.Element | null {
  const user = useUser();
  if (!user) return null;

  const sub = user.data.subscription;
  const level = Math.min(user.data.level, sub.max_level_granted);
  const isFree = sub.type === "free" || sub.type === "unknown";

  return <div className="flex mt-[-4px] px-md py-xs text-base bg-black/25 light:bg-black/8 rounded">
    <span className="flex-1 font-bold">{user.data.username}</span>
    <span>Level {level}</span>
    {isFree && <span>Free</span>}
  </div>;
}
