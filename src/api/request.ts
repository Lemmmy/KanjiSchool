// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { notification } from "antd";

import { store } from "@app";

import axios, { Method, AxiosRequestConfig } from "axios";

import Debug from "debug";
const debug = Debug("kanjischool:api");

export class ApiError extends Error {
  constructor(message: string, public code?: number) {
    super(message);
  }
}

export type ApiResponseErrorable<T extends Record<string, any>> = T & {
  error?: string;
  code?: number;
}

interface RequestConfig extends AxiosRequestConfig {
  apiKey?: string;
  timeout?: number;
}

const API_BASE = "https://api.wanikani.com/v2";

export function getRequestUrl(
  url: string
): string {
  debug("api request for %s", url);
  const urlO = new URL(url, API_BASE);

  // Prepend /v2/ to the path if necessary
  if (!urlO.pathname.startsWith("/v2")) {
    urlO.pathname = urlO.pathname.replace(/^\/?/, "/v2/");
  }

  const outUrl = urlO.toString();
  debug("url rewritten to %s", outUrl);
  return outUrl;
}

export async function request<T>(
  method: Method,
  endpoint: string,
  options?: RequestConfig
): Promise<T> {
  const apiKey = options?.apiKey ?? store.getState().auth.apiKey;
  const url = getRequestUrl(endpoint);

  try {
    const { data } = await axios.request<ApiResponseErrorable<T>>({
      url,
      method,
      ...options,
      headers: {
        ...options?.headers,
        "Authorization": apiKey ? ("Bearer " + apiKey) : undefined,
        "Wanikani-Revision": "20170710"
      },
      responseType: "json",
      withCredentials: false, // No cookies
      timeout: options?.timeout ?? 5000
    });

    if (data.error) {
      throw new ApiError(data.error || "unknown_error", data.code);
    }

    return data;
  } catch (err) {
    console.error(err);

    // Print a message specifically for timeouts
    if (err.code === "ECONNABORTED" || (err?.message || "").match(/timeout/gi))
      notification.error({ message: "Request timed out. Server having trouble? "});

    if (err?.response?.data?.error) {
      throw new ApiError(err.response.data.error || "unknown_error", err.response.code);
    }

    throw err;
  }
}

export const get = <T>(endpoint: string, options?: RequestConfig): Promise<T> =>
  request("GET", endpoint, options);

export const post = <T>(endpoint: string, body?: any, options?: RequestConfig): Promise<T> =>
  request("POST", endpoint, {
    data: body,
    ...options
  });

export const put = <T>(endpoint: string, body?: any, options?: RequestConfig): Promise<T> =>
  request("PUT", endpoint, {
    data: body,
    ...options
  });
