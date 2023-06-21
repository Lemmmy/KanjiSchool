// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import * as api from "@api";
import { ApiCollection } from "@api";

import Debug from "debug";
const debug = Debug("kanjischool:api-pagination");

export async function paginateCollection<T>(
  endpoint: string,
  updatedAfter: string | undefined,
  onPage: (col: ApiCollection<T>) => Promise<boolean | void>
): Promise<void> {
  const qs = new URLSearchParams();
  if (updatedAfter) qs.set("updated_after", updatedAfter);

  try {
    let nextPage: string | null = endpoint + "?" + qs.toString();
    do {
      // Fetch a page
      debug("fetching page %s", nextPage);
      const col = await api.get<ApiCollection<T>>(nextPage, {
        // Use an increased timeout for pagination, because it can be very slow
        // sometimes
        timeout: 60000
      });

      await onPage(col);

      nextPage = col.pages.next_url as string | null;
    } while (nextPage !== null);
  } catch (err) {
    if (/must be in the past/i.test(err.message)) {
      console.error("pagination time-locked, ignoring");
    } else {
      console.error("pagination error: ", err);
      throw err;
    }
  }
}
