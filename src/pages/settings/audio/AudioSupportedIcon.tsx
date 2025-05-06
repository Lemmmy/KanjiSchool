// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Tooltip } from "antd";
import { CheckOutlined, CloseOutlined, QuestionOutlined } from "@ant-design/icons";

import { AudioSupport } from "@api";

export function AudioSupportedIcon({ supported }: { supported: AudioSupport }): React.ReactElement {
  switch (supported) {
  case "NO":
    return <Tooltip title="Your browser cannot play this type of audio.">
      <span className="text-red"><CloseOutlined /></span>
    </Tooltip>;
  case "maybe":
    return <Tooltip title="Your browser might be able to play this type of audio.">
      <span className="text-yellow light:text-orange"><QuestionOutlined /></span>
    </Tooltip>;
  case "probably":
    return <Tooltip title="Your browser should be able to play this type of audio.">
      <span className="text-green"><CheckOutlined /></span>
    </Tooltip>;
  default:
    return <span>{supported}</span>;
  }
}
