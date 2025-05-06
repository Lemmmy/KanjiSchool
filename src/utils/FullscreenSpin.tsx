// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Spin } from "antd";

export function FullscreenSpin(): React.ReactElement {
  return <div className="animate-fade-in bg-black/25 fixed inset-0 z-50 flex items-center justify-center">
    <Spin size="large" />
  </div>;
}
