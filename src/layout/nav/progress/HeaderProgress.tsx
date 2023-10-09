// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";
import { Progress } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { nts } from "@utils";

interface Props {
  title: ReactNode;
  description?: ReactNode;
  indeterminate?: boolean;
  count?: number;
  total?: number;
}

export function HeaderProgress({
  title,
  description,
  indeterminate,
  count = 0,
  total = 0,
}: Props): JSX.Element {
  const showSpinner = indeterminate || count < 0 || total <= 0;
  const percent = showSpinner ? 0 : Math.floor((count / total) * 100);

  return <div
    className="flex flex-col justify-center h-header px-lg border-0 border-solid border-l border-l-split"
  >
    <div className="text-desc flex-0 leading-tight text-sm flex">
      <span className="overflow-hidden text-ellipsis line-clamp-1">{title}</span>

      {/* Count or spinner */}
      {showSpinner
        ? <Spinner />
        : (
          <span className="inline-block ml-[0.5em] text-base-c/70">
            ({nts(count)}/{nts(total)})
          </span>
        )}
    </div>

    {!showSpinner && <Progress
      percent={indeterminate ? 100 : percent}
      status={indeterminate ? "active" : undefined}
      showInfo
      className="w-[220px] h-[20px] [&_.ant-progress-text]:leading-[8px]"
    />}

    {description && <div className="text-desc flex-0 leading-tight text-sm flex">
      <span className="overflow-hidden text-ellipsis line-clamp-1">{description}</span>
    </div>}
  </div>;
}

const Spinner = () => <LoadingOutlined
  spin
  width={24}
  height={24}
  className="text-basec ml-sm"
/>;
