// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { HTMLProps, ReactNode, useEffect } from "react";
import classNames from "classnames";

import { useNavigate } from "react-router-dom";
import { PageHeader } from "@layout/PageHeader.tsx";

export type PageLayoutProps = HTMLProps<HTMLDivElement> & {
  siteTitle?: string;
  title?: ReactNode | string;

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

  children?: ReactNode;
}

export function PageLayout({
  siteTitle,
  title,
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
      ? "max-w-[768px] mx-auto pr-0 md:max-w-[972px] md:pr-[204px]" // 768px(md) + 180px(toc width) + 24px(m-lg)
      : "max-w-[768px] mx-auto"
    : "",
  verticallyCenteredClassName = verticallyCentered
    ? "flex flex-col justify-center items-center"
    : "",
  onBack,
  backLink,
  children,
  ...rest
}: PageLayoutProps): JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    if (siteTitle) document.title = `${siteTitle} - KanjiSchool`;
  }, [siteTitle]);

  const classes = classNames("h-full", className, centeredClassName);

  return <div className={classes} {...rest}>
    {/* Page header */}
    {!noHeader && title && <PageHeader
      className={headerClassName}
      title={title}
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
}
