// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { FC, useEffect } from "react";
import classNames from "classnames";
import { PageHeader } from "antd";

import { useHistory } from "react-router-dom";

export type PageLayoutProps = React.HTMLProps<HTMLDivElement> & {
  siteTitle?: string;
  title?: React.ReactNode | string;
  subTitle?: React.ReactNode | string;

  extra?: React.ReactNode;
  noHeader?: boolean;

  className?: string;

  onBack?: () => void;
  backLink?: string;
}

export const PageLayout: FC<PageLayoutProps> = ({
  siteTitle, title, subTitle,

  extra, noHeader,

  className,

  onBack, backLink,

  children, ...rest
}) => {
  const history = useHistory();

  useEffect(() => {
    if (siteTitle) document.title = `${siteTitle} - KanjiSchool`;
  }, [siteTitle]);

  const classes = classNames("page-layout", className);

  return <div className={classes} {...rest}>
    {/* Page header */}
    {!noHeader && title && <PageHeader
      className="page-layout-header"

      title={title}
      subTitle={subTitle}
      extra={extra}

      onBack={() => {
        if (onBack) onBack();
        else if (backLink) history.push(backLink);
        else history.goBack();
      }}
    />}

    {/* Page contents */}
    <div className="page-layout-contents">
      {children}
    </div>
  </div>;
};
