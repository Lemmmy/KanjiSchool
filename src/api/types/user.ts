// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiObject } from "./";

export interface ApiSubscription {
  /** Whether the user currently has a paid subscription. */
  active: boolean;

  /** The maximum level of content accessible to the user. */
  max_level_granted: number;

  /** The type of subscription the user has. */
  type: "free" | "recurring" | "lifetime" | "unknown";

  /** The date when the user's subscription period ends (or renews). */
  period_ends_at: string | null;
}

export interface ApiUserInner {
  id: string;
  level: number;
  username: string;

  /** The signup date for the user. */
  started_at: string | null;

  /** Details about the user's subscription state. */
  subscription: ApiSubscription;
}
export interface ApiUser extends Omit<ApiObject<ApiUserInner>, "id"> {
  object: "user";
}
