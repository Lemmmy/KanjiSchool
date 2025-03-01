// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import * as api from "@api";
import { ApiCollection } from "@api";

import dayjs from "dayjs";

import Debug from "debug";
const debug = Debug("kanjischool:api-pagination");

export async function paginateCollection<T>(
  endpoint: string,
  updatedAfter: string | undefined,
  onPage: (col: ApiCollection<T>) => Promise<boolean | void>
): Promise<void> {
  try {
    const qs = new URLSearchParams();
    if (updatedAfter) {
      // The API requires the updated_after parameter to be in the past, so to alleviate issues caused by clock skew,
      // we subtract 30 seconds from the current time. This does mean the API will often return more results than we
      // actually need, but the data will always be eventually consistent, so that's fine.
      const timeThreshold = dayjs().subtract(30, "seconds");
      const givenTime = dayjs(updatedAfter);
      const minTime = dayjs.min(timeThreshold, givenTime)!;
      debug("time threshold: %s, given time: %s, min time: %s",
        timeThreshold.toISOString(), givenTime.toISOString(), minTime.toISOString());
      qs.set("updated_after", minTime.toISOString());
    }

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
  } catch (err: any) {
    if (/must be in the past/i.test(err.message)) {
      console.error("pagination time-locked, ignoring");
    } else {
      console.error("pagination error: ", err);
      throw err;
    }
  }
}
