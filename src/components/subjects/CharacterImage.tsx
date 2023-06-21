// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { useMemo } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import classNames from "classnames";

import { RootState } from "@store";
import { useSelector } from "react-redux";

import InlineSVG from "svg-inline-react";

interface Props {
  subjectId: number;
  size?: number;
  className?: string;
}

export const CharacterImage = React.memo(({
  subjectId,
  size,
  className
}: Props) => {
  const image = useSelector((s: RootState) => s.sync.images?.[subjectId]?.svg);

  const memoImg: JSX.Element | undefined = useMemo(() => {
    if (!image) return;

    const classes = classNames("subject-characters", "character-image", className);
    return <InlineSVG
      className={classes}
      src={image.replace(/<title>\w+?<\/title>/, "")} // lol
      raw
      style={{ width: size, height: size }}
    />;
  }, [image, className, size]);

  return memoImg || <LoadingOutlined spin />;
});
