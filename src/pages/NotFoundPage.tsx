// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Button } from "antd";
import { FrownOutlined } from "@ant-design/icons";

import { useHistory } from "react-router-dom";

import { SmallResult } from "@comp/results/SmallResult";

interface Props {
  nyi?: boolean;
}

export function NotFoundPage({ nyi }: Props): JSX.Element {
  const history = useHistory();

  return <SmallResult
    icon={<FrownOutlined />}
    status="error"
    title={nyi ? "Not yet implemented" : "Page not found"}
    subTitle={nyi ? "This feature will be coming soon!" : undefined}
    extra={(
      <Button type="primary" onClick={() => history.goBack()}>
        Go back
      </Button>
    )}
    fullPage
  />;
}
