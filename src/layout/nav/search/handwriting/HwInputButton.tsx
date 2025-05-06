// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Dispatch, SetStateAction, useCallback } from "react";
import { EditFilled, EditOutlined } from "@ant-design/icons";
import type { AntdIconProps } from "@ant-design/icons/es/components/AntdIcon";
import classNames from "classnames";

import Debug from "debug";
const debug = Debug("kanjischool:hw-input-button");

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export function HwInputButton({ visible, setVisible, ...props }: Props): React.ReactElement {
  const open = useCallback(() => {
    debug("opening handwriting input");
    setVisible(true);
  }, [setVisible]);

  const classes = classNames("ant-input-clear-icon handwriting-input-button", { visible });
  const iconProps: Omit<AntdIconProps, "ref"> = {
    ...props,
    role: "button",
    "aria-label": "handwriting-input-button",
    tabIndex: -1,
    className: classes
  };

  return visible
    ? <EditFilled onClick={open} {...iconProps} />
    : <EditOutlined onClick={open} {...iconProps} />;
}
