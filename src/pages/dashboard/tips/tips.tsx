// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";
import { Typography } from "antd";
import { EllipsisOutlined, MoreOutlined } from "@ant-design/icons";

import { ctrl } from "@utils";

const { Text } = Typography;

export const TIPS: ReactNode[] = [
  <>
    KanjiSchool supports a wide range of keyboard shortcuts. You can view a list
    in the <MoreOutlined /> Menu, or by pressing <Text keyboard>?</Text>.
  </>,
  <>
    You can adjust the order of your lesson and review sessions in the Settings,
    or by creating Presets in the <EllipsisOutlined /> Dropdown menu next to
    the &ldquo;Start lessons&rdquo; and &ldquo;Start reviews&rdquo; buttons!
  </>,
  <>
    You can quickly start a review session by pressing <Text keyboard>R</Text>.
  </>,
  <>
    If you don&apos;t want to continue a session, wrap it up by pressing
    <Text keyboard>Esc</Text>. This will remove all unstarted questions and
    leave you to finish only a few partially-answered ones.
  </>,
  <>
    Self-study sessions are a useful way to test your knowledge without
    affecting your SRS progress.
  </>,
  <>
    Quickly add items to a self-study queue by pressing <Text keyboard>Q</Text>
    while hovering over them!
  </>,
  <>
    Almost everything on the Dashboard can be clicked!
  </>,
  <>
    If you deselect the textbox during a session, simply start typing to focus
    it again.
  </>,
  <>
    Quickly start a search with <Text keyboard>{ctrl}+K</Text>.
  </>,
  <>
    If you have trouble spoiling yourself with answer hints, you can fully hide
    them by default by enabling &ldquo;Hide all hints&rdquo; in
    &ldquo;General session settings&rdquo;.
  </>,
  <>
    Pitch accent diagrams for vocabulary subjects can be enabled in the Settings
    under &ldquo;Subject info settings&rdquo;.
  </>,
];
