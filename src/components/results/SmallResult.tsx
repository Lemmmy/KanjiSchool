// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React from "react";
import { CloseCircleFilled } from "@ant-design/icons";
import classNames from "classnames";

type Status = "error";
interface StatusIcon {
  render: () => React.ReactNode;
  className?: string;
}

export const statusIcons: Record<Status, StatusIcon> = {
  error: {
    render: () => <CloseCircleFilled className="text-red" />,
    className: "text-red",
  },
};

export interface ResultProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  extra?: React.ReactNode;
  status?: Status;
  icon?: React.ReactNode;
  fullPage?: boolean;
  className?: string;
}

const StatusIcon = React.memo(function StatusIcon({ status, icon }: ResultProps) {
  const renderIcon = icon || (status ? statusIcons[status]?.render() : null);
  const className = status ? statusIcons[status]?.className : null;
  if (!renderIcon) return null;

  return <span className={classNames("text-4xl", className)}>
    {renderIcon}
  </span>;
});

export function SmallResult({
  title,
  subtitle,
  extra,
  status = "error",
  icon,
  fullPage,
  className,
}: ResultProps): React.ReactElement {
  const classes = classNames("flex flex-col justify-center items-center gap-md", className, {
    "h-[calc(100vh-64px)]": fullPage
  });

  return (
    <div className={classes}>
      {/* Icon */}
      {(icon || status) && <StatusIcon status={status} icon={icon} />}

      {/* Title */}
      <div className="text-2xl">{title}</div>

      {/* Subtitle */}
      {subtitle && <div className="text-desc">{subtitle}</div>}

      {/* Extra */}
      {extra && <div>{extra}</div>}
    </div>
  );
}
