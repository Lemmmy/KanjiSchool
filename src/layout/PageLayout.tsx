// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { FC, HTMLProps, ReactNode, useEffect } from "react";
import classNames from "classnames";

import { useNavigate } from "react-router-dom";
import { PageHeader } from "@ant-design/pro-layout";

export type PageLayoutProps = HTMLProps<HTMLDivElement> & {
  siteTitle?: string;
  title?: ReactNode | string;
  subTitle?: ReactNode | string;

  extra?: ReactNode;
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
  const navigate = useNavigate();

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
        else if (backLink) navigate(backLink);
        else navigate(-1);
      }}
    />}

    {/* Page contents */}
    <div className="page-layout-contents">
      {children}
    </div>
  </div>;
};
