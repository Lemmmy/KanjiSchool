// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Button, Checkbox } from "antd";
import { DeleteFilled, RedoOutlined, UndoOutlined } from "@ant-design/icons";
import { CloudDisconnectedOutlined } from "@comp/icons/CloudDisconnectedOutlined";

import { HwInputButton } from "./HwInputButton";
import { useHwCanvas } from "./HwCanvas";

import { BackspaceFilled } from "@comp/icons/BackspaceFilled";
import { SpaceOutlined } from "@comp/icons/SpaceOutlined";

import { setBooleanSetting, useBooleanSetting, useOnlineStatus } from "@utils";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  setValue: Dispatch<SetStateAction<string>>;
}

export function HwInputPopover({
  visible, setVisible,
  setValue
}: Props): JSX.Element {
  return <>
    {visible && <div
      className="w-full max-w-[400px] fixed top-header right-0 z-50 bg-container rounded-b !mr-0"
      // Allows onBlur.relatedTarget to work in the search box
      tabIndex={0}
    >
      <PopoverInner setValue={setValue} />
    </div>}

    {/* The normal input button */}
    <HwInputButton visible={visible} setVisible={setVisible} />
  </>;
}

function PopoverInner({ setValue }: Pick<Props, "setValue">): JSX.Element {
  const [predictions, setPredictions] = useState<string[]>([]);
  const [hwCanvas, undo, redo, clear] = useHwCanvas(setPredictions);

  // Whether to always open the handwriting input
  const alwaysOpen = useBooleanSetting("searchAlwaysHandwriting");

  // Whether the user is online. The handwriting recognition service
  // requires an internet connection for the time being, so a notice will be
  // displayed if the user is offline.
  const isOnline = useOnlineStatus();

  /// Append a value to the search box and clear the handwriting input
  const appendValue = useCallback((value: string) => {
    setValue(v => v + value);
    clear();
  }, [setValue, clear]);

  /// Insert a space into the search box
  const space = useCallback(() => appendValue(" "), [appendValue]);

  /// Remove the previous character from the search box and clear the input
  const backspace = useCallback(() => {
    setValue(v => (v || "").replace(/.$/su, ""));
    clear();
  }, [setValue, clear]);

  const btnClass = "h-[48px] mr-sm last:mr-0";

  return <div className="flex flex-col">
    {/* Title area + settings */}
    <div className="flex items-center w-full border-0 border-solid border-b border-b-split py-xs px-sm">
      {/* Title */}
      <span className="block leading-none font-semibold">
        Handwriting
      </span>

      {/* Always open setting */}
      <div className="ml-auto">
        <Checkbox
          checked={alwaysOpen}
          onChange={e => setBooleanSetting("searchAlwaysHandwriting", e.target.checked, false)}
          tabIndex={7}
        >
          Open with search
        </Checkbox>
      </div>
    </div>

    {/* Display canvas and suggestions as long as user is online */}
    {isOnline
      ? <>
        {/* Canvas drawing area */}
        {hwCanvas}

        {/* Suggested character row */}
        <div
          className="border-0 border-solid border-t border-t-split whitespace-nowrap overflow-x-auto min-h-[49px]
            [scrollbar-width]:none [-ms-overflow-style]:none [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0"
          tabIndex={1}
        >
          {predictions.map(c => (
            <span
              key={c}
              className="inline-block cursor-pointer px-md h-[48px] leading-[48px] text-center align-middle
                 border-0 border-solid border-r border-r-split font-ja text-lg select-none
                 hover:bg-white/5 light:hover:bg-black/5"
              onClick={() => appendValue(c)}
            >
              {c}
            </span>
          ))}
        </div>
      </>
      : <HwOfflineWarning />}

    <div className="flex bg-white/5 border-0 border-solid border-t border-t-split py-xs px-sm mb-px">
      <Button tabIndex={2} className={btnClass} onClick={backspace}><BackspaceFilled /></Button>
      <Button tabIndex={3} className={btnClass} onClick={undo}><UndoOutlined /></Button>
      <Button tabIndex={4} className={btnClass + " flex-1"} onClick={space}><SpaceOutlined /></Button>
      <Button tabIndex={5} className={btnClass} onClick={redo}><RedoOutlined /></Button>
      <Button tabIndex={6} className={btnClass} onClick={clear}><DeleteFilled /></Button>
    </div>
  </div>;
}

function HwOfflineWarning(): JSX.Element {
  return <div className="relative flex items-center justify-center p-lg">
    <CloudDisconnectedOutlined className="!text-red/50 text-[4rem] mr-lg" />

    <span className="text-desc">
      An internet connection is required for handwriting recognition.
    </span>
  </div>;
}
