// Copyright (c) 2021-2022 Drew Edwards
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
  // Real popover was too buggy with visibility changes, so here's a fake
  // looking one!
  return <>
    {/* Fake popover */}
    {visible && <div className="ant-popover ant-popover-placement-bottom handwriting-input-popover">
      <div className="ant-popover-content">
        <div className="ant-popover-inner">
          <div className="ant-popover-inner-content">
            <PopoverInner setValue={setValue} />
          </div>
        </div>
      </div>
    </div>}

    {/* The normal input button */}
    <HwInputButton visible={visible} setVisible={setVisible} />
  </>;
}

function PopoverInner({ setValue }: Pick<Props, "setValue">): JSX.Element {
  const [predictions, setPredictions] = useState<string[]>([]);
  const [hwCanvas, undo, redo, clear] = useHwCanvas(setPredictions);

  // Whether or not to always open the handwriting input
  const alwaysOpen = useBooleanSetting("searchAlwaysHandwriting");

  // Whether or not the user is online. The handwriting recognition service
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

  return <div className="hw-popover-inner">
    {/* Title area + settings */}
    <div className="hw-header">
      <span className="hw-title">Handwriting</span>

      {/* Always open setting */}
      <div className="hw-settings">
        <Checkbox
          checked={alwaysOpen}
          onChange={e => setBooleanSetting("searchAlwaysHandwriting", e.target.checked, false)}
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
        <div className="hw-suggestions">
          {predictions.map(c => (
            <div
              key={c}
              className={"hw-suggestion"}
              onClick={() => appendValue(c)}
            >
              {c}
            </div>
          ))}
        </div>
      </>
      : <HwOfflineWarning />}

    <div className="hw-controls">
      <Button className="hw-backspace" onClick={backspace}><BackspaceFilled /></Button>
      <Button className="hw-undo" onClick={undo}><UndoOutlined /></Button>
      <Button className="hw-space" onClick={space}><SpaceOutlined /></Button>
      <Button className="hw-redo" onClick={redo}><RedoOutlined /></Button>
      <Button className="hw-clear" onClick={clear}><DeleteFilled /></Button>
    </div>
  </div>;
}

function HwOfflineWarning(): JSX.Element {
  return <div className="hw-offline-warning">
    <CloudDisconnectedOutlined />

    <span className="hw-offline-subtitle">
      An internet connection is required for handwriting recognition.
    </span>
  </div>;
}
