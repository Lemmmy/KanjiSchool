// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Tooltip } from "antd";

import { useUser } from "@api/auth.ts";
import { SimpleCard } from "@comp/SimpleCard.tsx";
import { ExtLink } from "@comp/ExtLink.tsx";

import { LogOutButton } from "./LogOutButton.tsx";

import { uppercaseFirst } from "@utils";

import TimeAgo from "react-timeago";
import dayjs from "dayjs";

export function SettingsUserInfo(): JSX.Element | null {
  const user = useUser();
  if (!user) return null;

  const sub = user.data.subscription;
  const level = Math.min(user.data.level, sub.max_level_granted);

  return <SimpleCard className="mb-md">
    <div className="leading-none">
      <LogOutButton />

      <Tooltip title="View profile on WaniKani">
        <ExtLink href={user.data.profile_url} className="text-basec">
          <h2 className="inline-block mt-0 mb-md font-medium">{user.data.username}</h2>
        </ExtLink>
      </Tooltip>
    </div>

    <div className="flex flex-col md:flex-row md:items-center gap-xs md:gap-md leading-normal">
      {/* Level */}
      <span>Level {level}</span>

      {/* Separator */}
      <div className="w-px h-4 bg-split hidden md:inline-block" />

      {/* Subscription type */}
      <Tooltip title="Manage subscription">
        <ExtLink href="https://www.wanikani.com/account/subscription" className="text-basec">
          {uppercaseFirst(sub.type)}

          {/* Recurring subscription period date */}
          {sub.type === "recurring" && sub.period_ends_at && <span className="text-desc">
            {" "}(renews <TimeAgo date={sub.period_ends_at} />)
          </span>}
        </ExtLink>
      </Tooltip>
    </div>

    {/* Sign-up date */}
    {user.data.started_at && <div className="mt-xs leading-normal">
      Joined <TimeAgo date={user.data.started_at} />

      <span className="text-desc">
        {" "}({dayjs(user.data.started_at).format("DD MMM, YYYY")})
      </span>
    </div>}
  </SimpleCard>;
}
