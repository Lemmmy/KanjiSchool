// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

// -----------------------------------------------------------------------------
// This is ant-design's Result component, but without importing 54 kB of images
// that we don't even use.
//
// This file is based off of the following source code from ant-design, which is
// licensed under the MIT license:
//
// https://github.com/ant-design/ant-design/blob/077443696ba0fb708f2af81f5eb665b908d8be66/components/result/index.tsx
//
// For the full terms of the MIT license used by ant-design, see:
// https://github.com/ant-design/ant-design/blob/master/LICENSE
// -----------------------------------------------------------------------------
import React from "react";
import classNames from "classnames";

import CheckCircleFilled from "@ant-design/icons/CheckCircleFilled";
import CloseCircleFilled from "@ant-design/icons/CloseCircleFilled";
import ExclamationCircleFilled from "@ant-design/icons/ExclamationCircleFilled";
import WarningFilled from "@ant-design/icons/WarningFilled";

export const IconMap = {
  success: CheckCircleFilled,
  error: CloseCircleFilled,
  info: ExclamationCircleFilled,
  warning: WarningFilled,
};
export type ResultStatusType = keyof typeof IconMap;

export interface ResultProps {
  icon?: React.ReactNode;
  status?: ResultStatusType;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  extra?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  fullPage?: boolean;
  children?: React.ReactNode;
}

/**
 * Render icon if ExceptionStatus includes ,render svg image else render iconNode
 */
const renderIcon = ({ status, icon }: ResultProps) => {
  const iconNode = React.createElement(IconMap[status as ResultStatusType],);
  return <div className={"ant-result-icon"}>{icon || iconNode}</div>;
};

const renderExtra = ({ extra }: ResultProps) =>
  extra && <div className="ant-result-extra">{extra}</div>;

export const SmallResult: React.FC<ResultProps>  = ({
  className: customizeClassName,
  subTitle,
  title,
  style,
  children,
  status = "info",
  icon,
  extra,
  fullPage,
}) => {
  const classes = classNames("ant-result", "ant-result-" + status, customizeClassName, {
    "full-page-result": fullPage
  });

  return (
    <div className={classes} style={style}>
      {renderIcon({ status, icon })}
      <div className="ant-result-title">{title}</div>
      {subTitle && <div className="ant-result-subtitle">{subTitle}</div>}
      {renderExtra({ extra })}
      {children && <div className="ant-result-content">{children}</div>}
    </div>
  );
};
