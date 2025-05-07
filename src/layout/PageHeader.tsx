// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";
import { Button } from "@comp/Button";
import classNames from "classnames";
import { ArrowLeft } from "lucide-react";

interface Props {
  title?: ReactNode;
  onBack?: () => void;
  className?: string;
}

export function PageHeader({
  title,
  onBack,
  className
}: Props): React.ReactElement {
  const classes = classNames("min-h-page-header px-lg pt-md pb-0 box-border flex items-center", className);

  return <div className={classes}>
    {/* Back button */}
    {onBack && <Button
      variant="link"
      size="icon"
      aria-label="Back"
      tabIndex={0}
      onClick={onBack}
      className="mr-2 px-0 text-white light:text-black flex-shrink-0"
    >
      <ArrowLeft />
    </Button>}

    {/* Title */}
    <div className="font-semibold text-[23px] leading-[32px] overflow-hidden whitespace-nowrap text-ellipsis">
      {title}
    </div>
  </div>;
}
