// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ErrorInfo, FC, ReactNode, useCallback } from "react";
import { Alert } from "antd";

import { useRouteError } from "react-router-dom";

import { ErrorBoundary, FallbackProps } from "react-error-boundary";

interface WkErrorBoundaryProps {
  name?: string;
  children?: ReactNode;
}

export function WkErrorBoundary({ name, children }: WkErrorBoundaryProps): React.ReactElement {
  const onError = useCallback((error: Error, info: ErrorInfo) => {
    console.error(`Error in ${name ?? "unnamed"} error boundary:`, error, info);
  }, [name]);

  return <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={onError}
  >
    {children}
  </ErrorBoundary>;
}

export const ErroredRoute: FC = () => {
  const error = useRouteError();
  console.error(error); // TODO: Sentry.reactRouterV6Instrumentation

  return <ErrorFallback error={error} />;
};

type ErrorFallbackProps = Pick<FallbackProps, "error">;

function ErrorFallback({ error }: ErrorFallbackProps): React.ReactElement {
  return <Alert
    type="error"
    className="m-lg"

    message="Critical error"
    description={<>
      <p>A critical error has occurred in KanjiSchool, so this page was terminated. See console for details.</p>
1
      {error && <p>
        <b>Error:</b> {error.message}
      </p>}
    </>}
  />;
}
