// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Alert } from "antd";

import { useUser } from "@api";

import { ExtLink } from "@comp/ExtLink";

export function OverleveledSubjects(): JSX.Element | null {
  const user = useUser();

  return <Alert
    type="info"
    message={<>
      TODO
    </>}
    style={{ marginBottom: 24 }}
  />;
}
