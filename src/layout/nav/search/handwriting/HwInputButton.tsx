// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Dispatch, SetStateAction, useCallback } from "react";
import { EditFilled, EditOutlined } from "@ant-design/icons";
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import classNames from "classnames";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export function HwInputButton({ visible, setVisible, ...props }: Props): JSX.Element {
  const open = useCallback(() => setVisible(true), [setVisible]);

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
