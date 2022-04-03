// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { FC } from "react";
import { Alert } from "antd";

import * as Sentry from "@sentry/react";
import { errorReporting } from "@utils";

interface Props {
  name: string;
}

const WkErrorBoundary: FC<Props> = ({ name, children }) => {
  return <Sentry.ErrorBoundary
    fallback={() => <ErrorFallback />}
    onError={console.error}

    // Add the boundary name to the scope
    beforeCapture={scope => {
      scope.setTag("error-boundary", name);
    }}
  >
    {children}
  </Sentry.ErrorBoundary>;
};
export const ErrorBoundary = WkErrorBoundary;

function ErrorFallback(): JSX.Element {
  return <Alert
    type="error"
    style={{ margin: 16 }}

    message="Critical error"
    description={<>
      <p>A critical error has occurred in KanjiSchool, so this page was terminated. See console for details.</p>

      {/* If Sentry error reporting is enabled, add a message saying the error
        * was automatically reported. */}
      {errorReporting && (
        <p style={{ marginBottom: 0}}>This error was automatically reported.</p>
      )}
    </>}
  />;
}
