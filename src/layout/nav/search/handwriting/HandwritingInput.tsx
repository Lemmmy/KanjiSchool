// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useMemo, Dispatch, SetStateAction } from "react";

import { HwInputPopover } from "./HwInputPopover";

export type HwInputHookRes = [
  JSX.Element, // Input button
  boolean, // Visibility state
  Dispatch<SetStateAction<boolean>>, // Set visibility state
];

export function useHandwritingInput(
  setValue: Dispatch<SetStateAction<string>>
): HwInputHookRes {
  const [visible, setVisible] = useState(false);
  const button = useMemo(() => <HwInputPopover
    visible={visible}
    setVisible={setVisible}
    setValue={setValue}
  />, [visible, setValue]);

  return [button, visible, setVisible];
}
