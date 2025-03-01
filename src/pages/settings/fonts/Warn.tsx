// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Tooltip } from "antd";
import { WarningFilled } from "@ant-design/icons";

export const Warn = () => <Tooltip title="Font not found">
  <WarningFilled className="text-yellow light:text-orange" />
</Tooltip>;
