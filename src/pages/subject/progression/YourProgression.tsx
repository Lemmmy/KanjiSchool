// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Divider } from "antd";

import { StoredAssignment, StoredSubject } from "@api";

import { SrsStageBar } from "./SrsStageBar";
import { DateRow } from "./DateRow";
import { CorrectBars } from "./CorrectBars";

interface Props {
  subject: StoredSubject;
  assignment: StoredAssignment;
}

export function YourProgression({
  subject,
  assignment
}: Props): JSX.Element | null {
  // Don't show this section at all if the assignment does not exist/is not yet
  // unlocked
  if (!assignment || !assignment.data.unlocked_at) return null;

  return <div className="subject-info-your-progression">
    <Divider orientation="left">Your progression</Divider>

    {/* SRS stage */}
    <SrsStageBar subject={subject} assignment={assignment} />

    {/* Date row (unlocked, next review, etc.) */}
    <DateRow subject={subject} assignment={assignment} />

    {/* Correct bars (meaning/reading answered correctly, streak, etc.) */}
    <CorrectBars subject={subject} />
  </div>;
}
