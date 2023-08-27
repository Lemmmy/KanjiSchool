// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { FC, ReactNode } from "react";
import { Alert } from "antd";

import * as Sentry from "@sentry/react";
import { errorReporting } from "@utils";
import { useRouteError } from "react-router-dom";

interface Props {
  name?: string;
  error?: Error;
  children: ReactNode;
}

const WkErrorBoundary: FC<Props> = ({ name, error, children }) => {
  return <Sentry.ErrorBoundary
    fallback={() => <ErrorFallback />}
    onError={console.error}

    // Add the boundary name to the scope
    beforeCapture={scope => {
      if (name) scope.setTag("error-boundary", name);
    }}
  >
    {children}
  </Sentry.ErrorBoundary>;
};
export const ErrorBoundary = WkErrorBoundary;

export const ErroredRoute: FC = () => {
  const error = useRouteError();
  console.error(error); // TODO: Sentry.reactRouterV6Instrumentation

  return <ErrorBoundary>
    <ErrorFallback />
  </ErrorBoundary>;
};

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
