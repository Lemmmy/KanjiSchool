// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Button, Space } from "antd";
import { globalNotification } from "@global/AntInterface.tsx";
import { showNearMatchNotification, showSrsNotification } from "@session";
import { SimpleCard } from "@comp/SimpleCard.tsx";
import { useAppSelector } from "@store";
import { PartsOfSpeechList } from "@pages/subject/PartsOfSpeech";
import { shallowEqual } from "react-redux";

export function DebugPartsOfSpeechCard(): React.ReactElement {
  const partsOfSpeech = useAppSelector(s => s.subjects.partsOfSpeechCache, shallowEqual);

  return <SimpleCard title="Parts of speech">
    {partsOfSpeech && <PartsOfSpeechList partsOfSpeech={Object.keys(partsOfSpeech)} />}
  </SimpleCard>;
}
