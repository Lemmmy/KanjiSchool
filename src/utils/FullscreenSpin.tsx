// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Spin } from "antd";

export function FullscreenSpin(): JSX.Element {
  return <div className="bg-black/25 fixed inset-0">
    <Spin size="large" />
  </div>;
}
