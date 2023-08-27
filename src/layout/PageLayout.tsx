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
  centered?: boolean;
  verticallyCentered?: boolean;
  hasToc?: boolean;

  className?: string;
  headerClassName?: string;
  contentsClassName?: string;
  contentsHeightClassName?: string;
  centeredClassName?: string;
  verticallyCenteredClassName?: string;
  onBack?: () => void;
  backLink?: string;
}

export const PageLayout: FC<PageLayoutProps> = ({
  siteTitle,
  title,
  subTitle,
  extra,
  noHeader,
  centered,
  verticallyCentered,
  hasToc,
  className,
  headerClassName,
  contentsClassName,
  contentsHeightClassName = noHeader
    ? `h-screen`
    : `h-[calc(100%-56px)]`,
  centeredClassName = centered
    ? hasToc
      ? "max-w-md pr-0 md:max-w-[972px] md:pr-[204px]" // 768px(md) + 180px(toc width) + 24px(m-lg)
      : "max-w-md mx-auto"
    : "",
  verticallyCenteredClassName = verticallyCentered
    ? "flex flex-col justify-center"
    : "",
  onBack,
  backLink,
  children,
  ...rest
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (siteTitle) document.title = `${siteTitle} - KanjiSchool`;
  }, [siteTitle]);

  const classes = classNames("h-full", className, centeredClassName);

  return <div className={classes} {...rest}>
    {/* Page header */}
    {!noHeader && title && <PageHeader
      className={classNames(
        "min-h-[56px] pb-0 box-border [&_.ant-page-header-heading-sub-title_.ant_typography]:text-inherit",
        headerClassName
      )}

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
    <div className={classNames(
      "p-sm md:p-lg relative box-border",
      contentsHeightClassName,
      contentsClassName,
      verticallyCenteredClassName
    )}>
      {children}
    </div>
  </div>;
};
