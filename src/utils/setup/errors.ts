// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import * as Sentry from "@sentry/react";
import { CaptureContext } from "@sentry/types";
import { Integrations } from "@sentry/tracing";

import { message } from "antd";

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const __GIT_VERSION__: string;
const gitVersion: string = __GIT_VERSION__;

const ls = localStorage.getItem("settings.errorReporting");
export const errorReporting = process.env.DISABLE_SENTRY !== "true" &&
  (ls === null || ls === "true");
export const messageOnErrorReport = localStorage.getItem("settings.messageOnErrorReport") === "true";

Sentry.init({
  dsn: errorReporting
    ? "https://99545754915c403682949277e401d606@sentry.lemmmy.pw/5"
    : undefined,
  release: "kanjischool@" + gitVersion,
  integrations: [new Integrations.BrowserTracing()],

  // Disable Sentry error reporting if the setting is disabled:
  tracesSampleRate: errorReporting ? 0.2 : 0,

  beforeSend(event) {
    // Don't send an error event if error reporting is disabled
    if (!errorReporting) return null;

    // Show a message on report if the setting is enabled
    if (messageOnErrorReport) {
      message.info("An error was automatically reported. See console for details.");
    }

    return event;
  },

  beforeBreadcrumb(breadcrumb) {
    // Don't send a breadcrumb event if error reporting is disabled
    if (!errorReporting) return null;
    return breadcrumb;
  }
});

export function criticalError(
  err: Error | string,
  captureContext?: CaptureContext
): void {
  Sentry.captureException(err, captureContext);
  console.error(err);
}
