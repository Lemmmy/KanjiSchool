// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Progress } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { nts } from "@utils";

interface Props {
  title: string;
  indeterminate?: boolean;
  count: number;
  total: number;
}

export function HeaderProgress({
  title,
  indeterminate,
  count, total
}: Props): JSX.Element {
  const percent = Math.floor((count / total) * 100);
  const showSpinner = indeterminate || count < 0 || total <= 0;

  return <div className="site-header-progress">
    <div className="site-header-progress-top-row">
      <span className="site-header-progress-title">{title}</span>

      {/* Count or spinner */}
      {showSpinner
        ? <LoadingOutlined spin width={24} height={24} />
        : (
          <span className="site-header-progress-count">
            ({nts(count)}/{nts(total)})
          </span>
        )}
    </div>

    {!showSpinner && <Progress
      percent={indeterminate ? 100 : percent}
      status={indeterminate ? "active" : undefined}
      showInfo
    />}
  </div>;
}
