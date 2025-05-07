// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Button } from "@comp/Button";
import { Frown } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { SmallResult } from "@comp/results/SmallResult";

interface Props {
  nyi?: boolean;
}

export function NotFoundPage({ nyi }: Props): React.ReactElement {
  const navigate = useNavigate();

  return <SmallResult
    icon={<Frown />}
    status="error"
    title={nyi ? "Not yet implemented" : "Page not found"}
    subtitle={nyi ? "This feature will be coming soon!" : undefined}
    extra={(
      <Button variant="primary" onClick={() => navigate(-1)}>
        Go back
      </Button>
    )}
    fullPage
  />;
}
