// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Button } from "antd";
import classNames from "classnames";

interface Props {
  onClick?: () => void;
  className?: string;
}

export default function ListShowAllButton({ onClick, className }: Props): JSX.Element {
  return <div className="flex justify-center mt-md">
    <Button type="link" className="w-full text-sm group" onClick={onClick}>
      <span className={classNames(
        "text-desc group-hover:text-white/80 light:group-hover:text-base-c/80 transition-colors",
        className
      )}>
        Show all...
      </span>
    </Button>
  </div>;
}
