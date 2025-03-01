// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@store";

import { globalNotification } from "@global/AntInterface.tsx";
import { setApiRateLimitResetTime } from "@store/slices/syncSlice.ts";

import PQueue from "p-queue";
import dayjs, { Dayjs } from "dayjs";

import Debug from "debug";
const debug = Debug("kanjischool:api");

export class ApiError extends Error {
  constructor(message: string, public code?: number) {
    super(message);
  }
}

export type ApiResponseErrorable<T> = T & {
  error?: string;
  code?: number;
}

interface RequestConfig extends RequestInit {
  apiKey?: string;
  timeout?: number;
}

const API_BASE = "https://api.wanikani.com/v2";
const MAX_ATTEMPTS = 10;
const DEFAULT_TIMEOUT = 30000;

const requestQueue = new PQueue({ concurrency: 6 });
let rateLimitResetTime: Dayjs | null = null;
let rateLimitResetTimeout: NodeJS.Timeout | number | null = null;

export function getRequestUrl(url: string): string {
  const urlO = new URL(url, API_BASE);

  // Prepend /v2/ to the path if necessary
  if (!urlO.pathname.startsWith("/v2")) {
    urlO.pathname = urlO.pathname.replace(/^\/?/, "/v2/");
  }

  return urlO.toString();
}

async function underlyingRequest<T>(
  method: "GET" | "POST" | "PUT",
  endpoint: string,
  options?: RequestConfig,
  attempt = 1
): Promise<T> {
  if (attempt >= MAX_ATTEMPTS) {
    debug("too many retries for %s, giving up", endpoint);
    globalNotification.error({ message: `Could not complete request after ${attempt} attempts` });
    throw new Error(`Could not complete request after ${attempt} attempts`);
  }

  const apiKey = options?.apiKey ?? store.getState().auth.apiKey;
  const url = getRequestUrl(endpoint);
  debug("api request for %s (%s)%s", url, endpoint, attempt > 1 ? ` (attempt ${attempt})` : "");

  const reqStart = performance.now();
  const timeoutMs = options?.timeout ?? DEFAULT_TIMEOUT;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(url, {
      method,
      ...options,
      ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...options?.headers,
        ...(apiKey ? { "Authorization": "Bearer " + apiKey } : {}),
        "Wanikani-Revision": "20170710"
      },
      credentials: "omit", // Don't send cookies
    });
    clearTimeout(timeout);

    if (res.status === 429) {
      const now = dayjs();
      const resetHeader = res.headers.get("RateLimit-Reset");
      const resetTime = resetHeader
        ? dayjs(parseInt(resetHeader) * 1000).add(1, "seconds") // Account for potential clock skew
        : now.add(5, "seconds");

      if (!rateLimitResetTime || resetTime.isAfter(rateLimitResetTime)) {
        debug("new rate limit reset time: %s", resetTime.toLocaleString());
        rateLimitResetTime = resetTime;

        // Update the rate limit notification in the app header
        store.dispatch(setApiRateLimitResetTime(resetTime.valueOf()));
      }

      const resetMs = Math.max(0, rateLimitResetTime.diff(now));
      debug("rate limited, reset at %s (in %d ms)", rateLimitResetTime.toLocaleString(), resetMs);

      // Pause the queue until the rate limit resets
      if (rateLimitResetTimeout) clearTimeout(rateLimitResetTimeout);
      rateLimitResetTimeout = setTimeout(() => {
        debug("starting request queue again");
        rateLimitResetTimeout = null;
        rateLimitResetTime = null;
        requestQueue.start();

        // Update the rate limit notification in the app header
        store.dispatch(setApiRateLimitResetTime(undefined));
      }, resetMs);

      debug("pausing request queue and queueing retry");
      requestQueue.pause();

      // Retry the request
      return queueRequest(method, endpoint, options, attempt + 1);
    }

    const data = await res.json() as ApiResponseErrorable<T>;
    if (data.error) {
      throw new ApiError(data.error || "unknown_error", data.code);
    }

    return data;
  } catch (err: any) {
    console.error(err);

    // Print a message specifically for timeouts
    if (
      err.code === "ECONNABORTED"
      || (err?.message || "").match(/timeout/gi)
      || err.name === "AbortError"
    ) {
      const reqEnd = performance.now();
      debug("request timed out after %d ms (timeout: %d), adding to retry queue", reqEnd - reqStart, timeoutMs);
      return queueRequest(method, endpoint, options, attempt + 1);
    }

    if (err?.response?.data?.error) {
      throw new ApiError(err.response.data.error || "unknown_error", err.response.code);
    }

    throw err;
  }
}

const queueRequest = <T>(
  method: "GET" | "POST" | "PUT",
  endpoint: string,
  options?: RequestConfig,
  attempt = 1
): Promise<T> => requestQueue.add(
    () => underlyingRequest(method, endpoint, options, attempt),
    {
      priority: attempt - 1,
      throwOnTimeout: true,
    }
  );

export const get = <T>(endpoint: string, options?: RequestConfig): Promise<T> =>
  queueRequest("GET", endpoint, options);

export const post = <T>(endpoint: string, body?: any, options?: RequestConfig): Promise<T> =>
  queueRequest("POST", endpoint, {
    body,
    ...options
  });

export const put = <T>(endpoint: string, body?: any, options?: RequestConfig): Promise<T> =>
  queueRequest("PUT", endpoint, {
    body,
    ...options
  });
