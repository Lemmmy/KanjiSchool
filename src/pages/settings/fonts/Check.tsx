// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Tooltip } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";

export const Check = () => <Tooltip title="This font is available!">
  <CheckCircleFilled className="text-green" />
</Tooltip>;
