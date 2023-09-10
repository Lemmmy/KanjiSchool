// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";
import { Button } from "antd";
import classNames from "classnames";
import { ArrowLeftOutlined } from "@ant-design/icons";

interface Props {
  title?: ReactNode;
  onBack?: () => void;
  className?: string;
}

export function PageHeader({
  title,
  onBack,
  className
}: Props): JSX.Element {
  const classes = classNames("min-h-page-header px-lg pt-md pb-0 box-border flex items-center", className);

  return <div className={classes}>
    {/* Back button */}
    {onBack && <Button
      type="link"
      aria-label="Back"
      tabIndex={0}
      onClick={onBack}
      className="mr-md px-0 text-white light:text-black flex-shrink-0"
    >
      <ArrowLeftOutlined />
    </Button>}

    {/* Title */}
    <div className="font-semibold text-[23px] leading-[32px] overflow-hidden whitespace-nowrap text-ellipsis">
      {title}
    </div>
  </div>;
}
